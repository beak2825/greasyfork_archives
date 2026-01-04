// ==UserScript==
// @name         【贴吧机器人】贴吧关键词找发帖、水贴机器人
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  贴吧自动找发帖，基于页面JS； ESC热键 停止打开页面；缓存只缓存 500 条，即发过500个贴后旧贴没沉可能会重复发帖。初次使用请开启允许弹窗；脚本部分参考《知乎增强》编写。
// @author       贴吧用户：皮燕子
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/f*
// @match        *://tieba.baidu.com/index.html
// @license      bonelf.com
// @icon         http://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/438523/%E3%80%90%E8%B4%B4%E5%90%A7%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%91%E8%B4%B4%E5%90%A7%E5%85%B3%E9%94%AE%E8%AF%8D%E6%89%BE%E5%8F%91%E5%B8%96%E3%80%81%E6%B0%B4%E8%B4%B4%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438523/%E3%80%90%E8%B4%B4%E5%90%A7%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%91%E8%B4%B4%E5%90%A7%E5%85%B3%E9%94%AE%E8%AF%8D%E6%89%BE%E5%8F%91%E5%B8%96%E3%80%81%E6%B0%B4%E8%B4%B4%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    var menu_ALL = [
        ['menu_search', '匹配关键词打开帖子功能', '', true],
        ['menu_send', '发帖功能（输入框填充回帖内容）', '', true],
        ['menu_sendAuto', '系统自动发帖（点击发送）', '', false],
        ['menu_closeAuto', '打开帖子后自动关闭', '有图片8秒，没有3秒', true],
        ['menu_openPinlv', '打开窗口频率', '秒/次', 5],
        ['menu_titleRegStr', '关键词', '', {"如何评价": ["经验+3，告辞"]}],
        ['menu_page', '一次最多打开帖子数', '一次最多打开帖子数', 20],
        ['menu_pic', '穿插图片（网络图片地址，不支持本地文件）', '使用网络图片地址',
            'http://tb2.bdstatic.com/tb/static-common/img/search_logo_big_v2_d84d082.png'],
        ['menu_isCache', '缓存帖子防止重复', '这将使得下次打开页面运行脚本打开的帖子不会与上次运行打开的重复，只缓存 500 条', true]
    ], menu_ID = [];

    // 模拟旧数据格式
    for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
        let value = GM_getValue(menu_ALL[i][0]);
        if (menu_ALL[i][0] === "menu_titleRegStr" && typeof (value) === "string") {
            // xxx;xxx::xxxxxx;;xxx;xxx::xxxxxx;;xxx;xxx::xxxxxx
            // 兼容旧版本文本配置
            let result = {}
            for (let string of value.split(';;')) {
                if (string) {
                    let ks = string.split('::');
                    let key = ks[0].split(";").join("|");
                    result[key] = [ks[1]];
                }
            }
            menu_ALL[i][3] = result;
            GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
        }
        if (value == null) {
            GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
        }
    }

    function customMenuPrompt(menuName) {
        let nowBlockKeywords = menu_value(menuName) || ''
        let newBlockKeywords = prompt('编辑', nowBlockKeywords);
        if (newBlockKeywords === '') {
            GM_setValue(menuName, '');
            registerMenuCommand(); // 重新注册脚本菜单
        } else if (newBlockKeywords != null) {
            GM_setValue(menuName, newBlockKeywords);
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }

    /**
     * @deprecated customKeyValPrompt
     */
    function customMenuTitleRegStr() {
        let nowBlockKeywords = '';
        let titleRegStr = menu_value('menu_titleRegStr');
        if (typeof (titleRegStr) == 'string') {
            titleRegStr = titleRegStr.split(';;')
        }
        (titleRegStr || []).forEach(function (item) {
            nowBlockKeywords += ';;' + item
        })
        let newBlockKeywords = prompt('编辑', nowBlockKeywords);
        if (newBlockKeywords === '') {
            GM_setValue('menu_titleRegStr', []);
            registerMenuCommand(); // 重新注册脚本菜单
        } else if (newBlockKeywords != null) {
            GM_setValue('menu_titleRegStr', newBlockKeywords.split(';;'));
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }


    /**
     * 输入框设置
     * @param menu
     * @param keyMethod
     * @param valueMethod
     */
    function customKeyValPrompt(menu, keyMethod, valueMethod) {
        function getItemHtml(key, value) {
            return `<div>
                        <label>
                            <input class="bonelf_Setting bonelf-key" type="${keyMethod.type}" value="${key}"
                                   placeholder="${keyMethod.placeholder}">
                        </label>
                        <label>
                            <input class="bonelf_Setting bonelf-val" type="${valueMethod.type}" value="${value}"
                                   placeholder="${valueMethod.placeholder}">
                        </label>
                        <span class="bonelf-close bonelf-delete" title="删除此行"></span>
                    </div>`
        }

        function addDelEvt() {
            let bonelfDel = document.querySelectorAll('.bonelf-delete')
            if (bonelfDel.length > 0) {
                bonelfDel.forEach(item => {
                    item.onclick = function (event) {
                        this.parentElement.remove();
                    }
                })
            }
        }

        let menuCode = menu[0];
        let menuName = menu[1];
        let pastVal = menu_value(menuCode) || {}
        let _br = '', _html = `
        <style class="zhihuE_SettingStyle">
            .zhihuE_SettingRoot {
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                -o-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                width: auto;
                min-width: 400px;
                max-width: 600px;
                height: auto;
                min-height: 150px;
                max-height: 400px;
                color: #535353;
                background-color: #fff;
                border-radius: 3px;
            }

            .zhihuE_SettingBackdrop_1 {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9999;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                overflow-x: hidden;
                overflow-y: auto;
                -webkit-transition: opacity .3s ease-out;
                transition: opacity .3s ease-out;
            }

            .zhihuE_SettingBackdrop_2 {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 0;
                background-color: rgba(18, 18, 18, .65);
                -webkit-transition: background-color .3s ease-out;
                transition: background-color .3s ease-out;
            }

            .zhihuE_SettingRoot .zhihuE_SettingHeader {
                padding: 10px 20px;
                color: #fff;
                font-weight: bold;
                background-color: #3994ff;
                border-radius: 3px 3px 0 0;
            }

            .zhihuE_SettingRoot .zhihuE_SettingMain, .button-group {
                padding: 10px 20px;
                border-radius: 0 0 3px 3px;
            }

            .zhihuE_SettingHeader span {
                float: right;
                margin-top: 10px;
                cursor: pointer;
            }

            .bonelf-close {
                float: right;
                margin-top: 10px;
                cursor: pointer;
            }

            .zhihuE_SettingMain input {
                margin: 10px 6px 10px 0;
                cursor: pointer;
                vertical-align: middle
            }

            .zhihuE_SettingMain label {
                margin-right: 20px;
                user-select: none;
                cursor: pointer;
                vertical-align: middle
            }

            .zhihuE_SettingMain hr {
                border: 0.5px solid #f4f4f4;
            }

            [data-theme="dark"] .zhihuE_SettingRoot {
                color: #adbac7;
                background-color: #343A44;
            }

            [data-theme="dark"] .zhihuE_SettingHeader {
                color: #d0d0d0;
                background-color: #2D333B;
            }

            [data-theme="dark"] .zhihuE_SettingMain hr {
                border: 0.5px solid #2d333b;
            }

            .bonelf-close {
                display: inline-block;
                width: 22px;
                height: 4px;
                background: white;
                transform: rotate(45deg);
            }

            .bonelf-close::after {
                content: '';
                display: block;
                width: 22px;
                height: 4px;
                background: white;
                transform: rotate(-90deg);
            }

            .bonelf-finish {
                background: white;
            }

            .bonelf-finish::after {
                background: white;
            }

            .bonelf-delete {
                background: black;
                margin-top: 23px;
            }

            .bonelf-delete::after {
                background: black;
            }

            .bonelf-key {
                width: 100px;
            }

            .bonelf-val {
                width: 200px;
            }

            input.bonelf_Setting {
                padding: .375rem .75rem;
                border-radius: .25rem;
                border: 1px solid #ced4da;
            }

            input.bonelf_Setting:focus {
                border-style: solid;
                border-color: #03a9f4;
                box-shadow: 0 0 5px #03a9f4;
            }

            input.bonelf_Setting:hover {
                cursor: text;
            }

            .button-group > button {
                float: right;
                padding: .375rem .75rem;
                border-radius: .25rem;
                border: 1px solid #ced4da;
                margin: 10px;
            }

            .button-group > button:hover {
                border-color: #03a9f4;
            }

            .button-group > button:active {
                background: #03a9f4;
            }
        </style>
        <div class="zhihuE_SettingBackdrop_1">
            <div class="zhihuE_SettingBackdrop_2"></div>
            <div class="zhihuE_SettingRoot">
                <div class="zhihuE_SettingHeader">
                    ${menuName}
                    <span class="bonelf-close bonelf-finish" title="点击关闭"></span>
                </div>
                <div class="zhihuE_SettingMain">
        `
        for (let pastValKey in pastVal) {
            if (pastVal.hasOwnProperty(pastValKey)) {
                if (Array.isArray(pastVal[pastValKey])) {
                    pastVal[pastValKey].forEach(item => {
                        _html += getItemHtml(pastValKey, item)
                    })
                } else {
                    _html += getItemHtml(pastValKey, pastVal[pastValKey])
                }
            }
        }
        _html += `
                </div>
                <div class="button-group">
                    <button class="bonelf-save">保存</button>
                    <button class="bonelf-add">新增</button>
                </div>
            </div>
        </div>`
        document.body.insertAdjacentHTML('beforeend', _html); // 插入网页末尾
        setTimeout(function () { // 延迟 100 毫秒，避免太快
            // 关闭按钮 点击事件
            let bonelfFinish = document.querySelector('.bonelf-finish');
            if (bonelfFinish) {
                bonelfFinish.onclick = function () {
                    this.parentElement.parentElement.parentElement.remove();
                    document.querySelector('.zhihuE_SettingStyle').remove();
                }
            }
            // 添加点击事件
            // 点击周围空白处 = 点击关闭按钮
            let bonelfDrop = document.querySelector('.zhihuE_SettingBackdrop_2');
            if (bonelfDrop) {
                bonelfDrop.onclick = function (event) {
                    this.parentElement.remove();
                    document.querySelector('.zhihuE_SettingStyle').remove();
                }
            }
            // 点击删除按钮
            addDelEvt()
            // 添加点击事件
            let bonelfAdd = document.querySelector('.bonelf-add');
            if (bonelfAdd) {
                bonelfAdd.onclick = function (event) {
                    document.querySelector('.zhihuE_SettingMain')
                        .insertAdjacentHTML('beforeend', getItemHtml('', '')); // 插入网页末尾
                    addDelEvt()
                }
            }
            // 添加点击事件
            let bonelfSave = document.querySelector('.bonelf-save');
            if (bonelfSave) {
                bonelfSave.onclick = function (event) {
                    let keys = document.querySelectorAll('.bonelf-key')
                    let values = document.querySelectorAll('.bonelf-val')
                    let newVal = {}
                    for (let i = 0; i < keys.length; i++) {
                        if (newVal[keys[i].value]) {
                            newVal[keys[i].value].push(values[i].value)
                        } else {
                            newVal[keys[i].value] = [values[i].value]
                        }
                    }
                    if (newVal !== null) {
                        GM_setValue(menuCode, newVal);
                        registerMenuCommand(); // 重新注册脚本菜单
                    }
                    this.parentElement.parentElement.remove();
                    document.querySelector('.zhihuE_SettingStyle').remove();
                }
            }
        }, 100)
    }

    /**
     * 注册脚本菜单
     */
    function registerMenuCommand() {
        if (menu_ID.length >= menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
            for (let i = 0; i < menu_ID.length; i++) {
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
            if (menu_ALL[i][0] === 'menu_titleRegStr') {
                if (menu_value(menu_ALL[i][0])) {
                    menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                        customKeyValPrompt(menu_ALL[i],
                            {type: 'text', placeholder: '关键字(正则)'},
                            {type: 'text', placeholder: '回复文本'}
                        );
                    });
                }
            } else if (menu_ALL[i][0] === 'menu_page' || menu_ALL[i][0] === 'menu_openPinlv' || menu_ALL[i][0] === 'menu_pic') {
                if (menu_value(menu_ALL[i][0])) menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                    customMenuPrompt(menu_ALL[i][0]);
                });
            } else {
                menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][1]}`, function () {
                    menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`)
                });
            }
        }
    }


// 菜单开关
    function menu_switch(menu_status, Name, Tips) {
        if (menu_status == 'true') {
            GM_setValue(`${Name}`, false);
            GM_notification({
                text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                    location.reload();
                }
            });
        } else {
            GM_setValue(`${Name}`, true);
            GM_notification({
                text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                    location.reload();
                }
            });
        }
        registerMenuCommand(); // 重新注册脚本菜单
    }


// 返回菜单值
    function menu_value(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu[3]
            }
        }
    }

    registerMenuCommand();

    // ===================== reply

    var pic = menu_value("menu_pic");
    var pics = []
    if (pic) {
        pics.push(pic)
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function wait(time) {
        // console.log('action finish, wait paging loading ' + time / 1000 + 's ...');
        await sleep(time);
        // console.log('finish load');
    }

    function parseQueryString(str) {
        var arr = [],
            length = 0,
            res = {},
            si = str.indexOf("?");
        str = si === -1 ? undefined : str.substring(si + 1);
        if (str) {
            // console.log(str);
            arr = str.split('&');
            length = arr.length;
            for (var i = 0; i < length; i++) {
                res[arr[i].split('=')[0]] = arr[i].split('=')[1];
            }
        }
        return res;
    }

    /**
     * 点击后等待页面加载
     * @param selector
     * @returns {Promise<unknown>}
     */
    function waitLoad(selector) {
        return new Promise((resolve, reject) => {
            let times = 0;
            let interval = setInterval(function () {
                let dom = $(selector);
                if (dom.length > 0 || times > 5) {
                    resolve(dom);
                    clearInterval(interval)
                    resolve.apply()
                }
                times++;
            }, 1000);
        })
    }

    function execSend() {
        // console.log("exec")
        var data = parseQueryString(window.location.href);
        if (!data.keyword) {
            let dom = $('h3.core_title_txt.pull-left.text-overflow');
            var title = dom.attr("title")
            if (titleReg.length > 0) {
                for (let item of titleReg) {
                    if (new RegExp(item.keywords).test(title)) {
                        data = {keyword: item.keywords, reply: item.reply}
                        break;
                    }
                }
            }
        }

        var h = $(document).height() - $(window).height();
        $(document).scrollTop(h);
        var sendAuto = menu_value('menu_sendAuto');
        var closeAuto = menu_value('menu_closeAuto');
        setTimeout(() => {
            if (pics.length > 0) {
                var randomPic = pics[Math.floor(Math.random() * pics.length)];
                if (randomPic) {
                    $('.edui-btn.edui-btn-image').click()
                    waitLoad('.from_web>a').then(res => {
                        res.click()
                        waitLoad('.l_netpic_input.j_input.ui_textfield').then(res => {
                            res.val(pics[Math.floor(Math.random() * pics.length)])
                            $('.ui_btn.ui_btn_m.j_addpic').click()
                            waitLoad('#dialogJbody').then(res => {
                                res.find('.ui_btn.ui_btn_m').click()
                            })
                        })
                    })
                }
            }

            $("#ueditor_replace>p").html(
                (data.keyword ? decodeURIComponent(data.reply || "") : "")
                // + "@" + decodeURIComponent(data.keyword)
            );

            if (sendAuto) {
                $(".poster_submit").click()
            }

            if (closeAuto) {
                setTimeout(() => {
                    window.close();
                }, pics.length > 0 ? 8000 : 3000)
            }
        }, 500)
    }

    // ============ find

    const openPinlvSave = Number(menu_value('menu_openPinlv'));
    const openPinlv = !openPinlvSave || openPinlvSave < 5 ? 5 : openPinlvSave;
    const pageSave = Number(menu_value('menu_page')) || 20;
    const page = pageSave > 100 ? 100 : pageSave;
    var titleRegStr = menu_value('menu_titleRegStr') || []
    const isCache = Boolean(menu_value('menu_isCache')) || false;

    var num = 0;
    var alreadySendArrTmp = isCache ? (localStorage.getItem("tiebaAlreadySendArr") || "").split(",") : []
    var alreadySendArr = alreadySendArrTmp.slice(alreadySendArrTmp.length - 100 < 0 ? 0 : alreadySendArrTmp.length - 100, alreadySendArrTmp.length - 1)

    var titleReg = []
    try {
        for (let item in titleRegStr) {
            titleReg.push({
                keywords: item,
                reply: titleRegStr[item][0]
            })
        }
    } catch (err) {
        alert("关键词规则错误，脚本停止")
        return;
    }
    console.log("当前生效规则", titleReg)

    var hrefQueue = []

    var iter;

    var stop = false;

    function stopExec() {
        clearInterval(iter)
        stop = true;
    }

    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    function execFind() {
        // console.log("开始执行")
        // console.log("已找到的帖子", alreadySendArr)

        iter = setInterval(function () {
            // console.log("剩余缓冲区帖子 ", hrefStack);
            if (hrefQueue.length > 0) {
                let item = hrefQueue.shift()
                if (alreadySendArr.length > 500) {
                    alreadySendArr.shift()
                }
                alreadySendArr.push(item.tid)
                if (isCache) {
                    localStorage.setItem("tiebaAlreadySendArr", alreadySendArr)
                }
                window.open("/p/" + item.tid + "?keyword=" + item.keyword + "&reply=" + item.reply)
                // window.open("/p/" + item.tid + "?keyword=" + item.keyword + "&reply=" + item.reply, '临时窗口', 'width=600,height=450', false)
            } else {

            }
        }, openPinlv * 1000);

        //var tomt = setTimeout(()=>{
        //    clearInterval(iter)
        //    // console.log("end")
        //}, 50 * 1000);

        var idx = 0;

        function jiansuo() {
            // console.log("正在检索第" + (idx + 1) + "页")
            var doms = $(".threadlist_title>a");
            doms.each(function () {
                let dom = $(this);
                var hrf = dom.attr("href")
                var title = dom.attr("title")
                var titleMatch = true
                var word = ""
                if (titleReg.length > 0) {
                    titleMatch = false
                    for (let item of titleReg) {
                        if (new RegExp(item.keywords).test(title)) {
                            titleMatch = true;
                            word = {keyword: item.keywords, reply: item.reply}
                            break;
                        }
                    }
                    if (hrf && titleMatch) {
                        var tid = hrf.split("/")[2]
                        if (!contains(alreadySendArr, tid)) {
                            // console.log("match " + tid + ":" + title);
                            num++;
                            hrefQueue.push({tid: tid, keyword: word.keyword, reply: word.reply});
                        }
                    }
                }
            });
            // 下一页
            $(".next.pagination-item").click()
            // console.log("已找到（无重复）", alreadySendArr.length)
            setTimeout(function () {
                idx = idx + 1
                if (num <= page && !stop) {
                    jiansuo()
                }
            }, 2000)
        }

        jiansuo();

    }

    if ($) {
        $(document).ready(function () {
            let pathname = location.pathname
            if (pathname.startsWith("/p/") && menu_value('menu_send')) {
                execSend();
            } else if (pathname.startsWith("/index.html")) {
                console.log("脚本提示：此页面不允许脚本，你可在此页面进行参数配置，进入贴吧后运行。")
            } else if (menu_value('menu_search')) {
                execFind();
            }
        })
    }

    function keyDown(e) {
        if (e.which == 27) { //ESC
            e.returnValue = false;
            stopExec()
            return false;
        }
    }

    document.onkeydown = keyDown;
})();
