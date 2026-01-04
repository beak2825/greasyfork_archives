// ==UserScript==
// @name         掘金签到+可视化智能抽奖(自修改版)
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  掘金签到和智能可视化抽奖
// @author       reggiepy
// @icon         chrome://favicon/http://juejin.cn/
// @grant        GM_getValue
// @grant        GM_setValue
// @create       2021-08-29
// @run-at       document-body
// @include      https://juejin.cn/*
// @exclude      https://juejin.cn/editor/drafts/*
// @require      https://unpkg.com/coco-message/coco-message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT


// @note         0.1.5 发送通知提供总积分信息，优化脚本目录
// @note         0.1.4 优化脚本
// @note         2023年12月1日 V0.1.3 增加自动沾福气
// @note        2021-09-29 V0.1.2 增加自动签到，签到后使用一次免费抽奖；使用第三方弹框库提示;排除文章编辑页面
// @downloadURL https://update.greasyfork.org/scripts/481137/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%2B%E5%8F%AF%E8%A7%86%E5%8C%96%E6%99%BA%E8%83%BD%E6%8A%BD%E5%A5%96%28%E8%87%AA%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481137/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%2B%E5%8F%AF%E8%A7%86%E5%8C%96%E6%99%BA%E8%83%BD%E6%8A%BD%E5%A5%96%28%E8%87%AA%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let version = "0.1.5";
    Script_setting();
    var autoSign = true;

    cocoMessage.config({
        duration: 3000,
    });

    const styleContent = `
    ._jj_draw_container {
        position:fixed;
        top: 80px;
        right: 0;
        z-index: 9999;
        background-color: rgba(0,0,0,0.6);
        padding: 20px;
    }
        ._jj_button {
            padding: 6px;
            background-color: #1e80ff;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid transparent;
            font-weight: 700;
            letter-spacing: 1em;
            text-indent: 1em;
            cursor: pointer;
        }
        ._jj_btn_sign_in{
            background-color:#e8f3ff !important;
            color:#1e80ff !important;
        }
        ._jj_button:hover {
            opacity: 0.8;
        }
        table._jj_hovertable thead {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            color:#333;
        }
        table._jj_hovertable {
            font-family: verdana, arial, sans-serif;
            font-size: 11px;
            color: #d25f00;
            border-width: 1px;
            border-color: #999999;
            border-collapse: collapse;
        }
        table._jj_hovertable th {
            background-color: #c3dde0;
            border-width: 1px;
            padding: 8px;
            border-style: solid;
            border-color: #a9c6c9;
        }
        table._jj_hovertable tr {
            background-color: #fff;
        }
        table._jj_hovertable td {
            border-width: 1px;
            padding: 8px;
            border-style: solid;
            border-color: #a9c6c9;
        }
        ._jj_button_close{
            font-size: 20px;
            font-weight: 700;
            color: #FFF;
        }
        .__jj_dialog_title{
            display: flex;
        }
        .__jj_dialog_title_left{
            flex:1;
            font-size: 14px;
            color: #fff;
        }
        .__jj_dialog_title_left span{
            color: #1e80ff;
            font-size:20px;
            font-weight: 700;
        }
        .__jj_dialog_title_right{
            width: 30px;
        }

    `;


    const htmlContent = `
    <div class="">
        <div class="__jj_dialog_title">
            <div class="__jj_dialog_title_left" id="__jj_dialog_title_left" style="visibility:hidden;">矿石<span id="ore_num">0</span>个 | 可抽奖<span id="draws_num">0</span>次</div>
            <div class="__jj_dialog_title_right">
            <a href="javascript:void(0)" id="_jj_btn_close" class="_jj_button_close">X</a>
            </div>
        </div>
        <div style="text-align:center;margin: 10px;">
            <button id="_jj_btn_sign_in" type="button" class="_jj_button _jj_btn_sign_in">签到</button>
            <button id="_jj_btn_draw" type="button" class="_jj_button _jj_btn_draw">抽奖</button>
            <button id="_jj_btn_stop" type="button" class="_jj_button">停止</button>
            
        </div>
        <table class="_jj_hovertable">
            <thead>
                <tr>
                    <td>奖品图标</td>
                    <td>奖品名称</td>
                    <td>中奖次数</td>
                    <td>累计奖励</td>
                </tr>
            <tbody id="_jj_tbodyList">
            </tbody>
            </thead>
        </table>
    </div>
    `



    function appendStyle(text) {
        const styleEl = document.createElement('style');
        styleEl.textContent = text;
        document.head.appendChild(styleEl);
    }

    function appendHTML(htmlContent) {
        const htmlEl = document.createElement('div');
        htmlEl.id = "_jj_draw_container";
        htmlEl.className = "_jj_draw_container";
        htmlEl.innerHTML = htmlContent;
        document.body.appendChild(htmlEl);
        getCurPoint();
    }

    appendStyle(styleContent);
    appendHTML(htmlContent);

    let lotteryConfig = [];
    let isDrawing = false;
    let prizes = [];
    const tbodyListEl = document.getElementById("_jj_tbodyList")

    var user_name = null;

    function delay(fn = () => { }, delay = 5000, context = null) {
        let ticket = null;
        let runned = false;
        return {
            run(...args) {
                return new Promise((resolve, reject) => {
                    if (runned === true) {
                        return;
                    }
                    runned = true;
                    ticket = setTimeout(async () => {
                        try {
                            const res = await fn.apply(context, args);
                            resolve(res);
                        } catch (err) {
                            reject(err)
                        }
                    }, delay)
                })
            },
            cancel: () => {
                clearTimeout(ticket);
            }
        }
    }

    function getLotteryConfig() {
        return fetch("https://api.juejin.cn/growth_api/v1/lottery_config/get")
            .then(res => res.json())
    }

    function getSignCount() {
        return fetch('https://api.juejin.cn/growth_api/v1/get_counts?aid=2608&uuid=6986922219256989198', {
            method: 'GET',
            credentials: "include"
        }).then(res => res.json())
    }

    function getCurPoint() {
        return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point?aid=2608&uuid=6986922219256989198', {
            method: 'GET',
            credentials: "include"
        }).then(res => res.json()).then(data => {
            document.getElementById("ore_num").innerText = data.data;
            document.getElementById("draws_num").innerText = Math.floor(data.data / 200);
            document.getElementById("__jj_dialog_title_left").style.visibility = 'visible';
        })
    }


    // 自动沾喜气
    function getGlobalBig() {
        // 获取中奖信息
        return fetch('https://api.juejin.cn/growth_api/v1/lottery_history/global_big?aid=2608&uuid=7161957105379935781&spider=0', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            body: JSON.stringify({ "page_no": 1, "page_size": 5 })
        }).then(res => res.json()).then(data => {
            console.log("global_big: ", data)
            if (data.err_no == 0) {
                let lottery = data.data.lotteries[0]
                lotteryDigLucky(lottery)
            } else {
                sendDingdingNotify(`掘金: ${user_name} 获取围观大奖错误: ${data.err_msg}`);
            }
        })
    }

    function lotteryDigLucky(lottery) {
        return fetch('https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=2608&uuid=7161957105379935781&spider=0', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            body: JSON.stringify({ "lottery_history_id": lottery.history_id })
        }).then(res => res.json()).then(data => {
            console.log("dip_lucky: ", data)
            if (data.err_no == 0) {
                if (data.data.has_dip) {
                    sendDingdingNotify(`掘金: ${user_name} 已经沾过福气`);
                } else {
                    sendDingdingNotify(`掘金: ${user_name} 沾福气成功 ${lottery.lottery_name} ${lottery.user_name}`);
                }
            } else {
                sendDingdingNotify(`掘金: ${user_name} 沾福气错误: ${data.err_msg}`);
            }
        })
    }

    function getInfoPack() {
        // 获取用户信息
        return fetch('https://api.juejin.cn/user_api/v1/user/get_info_pack?aid=2608&uuid=6986922219256989198', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            body: JSON.stringify({
                "pack_req": {
                    // "user_counter":true,
                    // "user_growth_info":true,
                    "user": true
                }
            })
        }).then(res => res.json()).then(data => {
            console.log("get_info_pack: ", data)
            user_name = data.data.user_basic.user_name
            autoSignHandle()
            getGlobalBig()
        })
    }

    function onSignIn(isAuto = false) {
        return fetch('https://api.juejin.cn/growth_api/v1/check_in', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            body: JSON.stringify({
                aid: '2608',
                uuid: '6986922219256989198'
            })
        }).then(res => res.json()).then(data => {
            if (data.err_no !== 0) {
                if (data.err_msg == "您今日已完成签到，请勿重复签到") {
                    GM_setValue("signDate", today())
                }
                sendDingdingNotify(`掘金: ${user_name} 错误: ${data.err_msg}`);
                cocoMessage.error(data.err_msg)
            } else {
                onSuccess(isAuto);
            }
        })
    }

    //自动签到
    function autoSignHandle() {
        let signDate = GM_getValue("signDate");
        console.log(signDate)
        if (autoSign && (!signDate || signDate < today())) {
            onSignIn(true).then(getCurPointV2())
        } else {
            sendDingdingNotify(`掘金: ${user_name} 已经签到过，上次签到时间 ${signDate}`).then(getCurPointV2());
            cocoMessage.error(`掘金: ${user_name} 已经签到过，上次签到时间 ${signDate}`)
        }
    }

    function getCurPointV2() {
        return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point?aid=2608&uuid=7161957105379935781&spider=0', {
            method: 'GET',
            credentials: "include"
        }).then(res => res.json()).then(data => {
            if (data.err_no !== 0) {
                sendDingdingNotify(`掘金: ${user_name} 获取总积分失败: ${data.err_msg}`);
                cocoMessage.error(data.err_msg)
            } else {
                sendDingdingNotify(`掘金: ${user_name} 总积分: ${data.data}`);
            }
        })
    }

    //获取今天的日期
    function today() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;

    }

    async function onSuccess(isAuto) {
        const count = await getSignCount();
        getCurPoint();
        GM_setValue("signDate", today())
        let message = `${user_name} 签到成功,连续签到${count.data.cont_count}天,累计签到${count.data.sum_count}天`
        cocoMessage.success(message);
        sendDingdingNotify("掘金:" + message);
        if (isAuto) {
            onDraw(!isAuto)
        }
    }

    // {"err_no":7003,"err_msg":"积分不足，无法进行抽奖lack of point","data":null}
    function doDraw() {
        return fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
            method: 'POST',
            credentials: "include"
        }).then(res => res.json())
    }

    async function onDraw(isOnce = true) {
        if (isDrawing) {
            return;
        }
        isDrawing = true;

        try {
            let errNo = 0;
            do {
                if (!isDrawing) {
                    break;
                }

                const res = await doDraw();
                getCurPoint();
                errNo = res.err_no;

                if (errNo !== 0) {
                    cocoMessage.error(res.err_msg);
                    isDrawing = false;
                    break;
                }

                // 增加奖励
                addPrize(res.data)
                // 渲染
                renderPrizes();
                // 暂停16ms
                await delay(undefined, 16).run();

                //isDrawing = false;
                //break;

            } while (errNo == 0 && isOnce)

        } catch (err) {
            isDrawing = false
            cocoMessage.error(err.message);
        }
    }

    function addPrize(data) {

        let prize = prizes.find(p => p.lottery_id == data.lottery_id);
        if (!prize) {
            return;
        }
        prize.counts += 1;

    }

    function onStop() {
        isDrawing = false;
    }

    function getTotal(data) {
        if (data.lottery_id == "6981716980386496552" || data.lottery_name == "66矿石") {
            return data.counts * 66;
        }
        return data.counts;
    }

    function renderPrizes() {
        tbodyListEl.innerHTML = prizes.map(prize => `
        <tr id="_jj_${prize.lottery_id}">
            <td class="_jj_price_icon"><img style="height:30px" src="${prize.lottery_image}" /></td>
            <td>${prize.lottery_name}</td>
            <td class="_jj_count">${prize.counts}</td>
            <td class="_jj_total">${getTotal(prize)}</td>
        </tr>
    `).join("");

    }


    async function init() {
        lotteryConfig = (await getLotteryConfig()).data.lottery;

        prizes = lotteryConfig.map(c => ({
            lottery_id: c.lottery_id,
            lottery_name: c.lottery_name,
            lottery_image: c.lottery_image,
            counts: 0
        }));

        renderPrizes();
        document.getElementById("_jj_btn_sign_in").addEventListener("click", onSignIn)
        document.getElementById("_jj_btn_draw").addEventListener("click", onDraw);
        document.getElementById("_jj_btn_stop").addEventListener("click", onStop);
        document.getElementById("_jj_btn_close").addEventListener("click", function () {
            document.querySelector("#_jj_draw_container").style.display = "none"
        });
        getInfoPack()
    }
    init();

    function sendDingdingNotify(message) {
        var data = JSON.stringify({
            "message": message,
        })
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://127.0.0.1:1202/notify/dingding/",
                headers: {
                    "Content-Type": "application/json"
                },
                data: data,
                onload: function (response) {
                    console.log(`消息发送成功: ${message}`);
                    resolve(response);
                },
                onerror: function (error) {
                    console.log(`消息发送失败: ${message}`);
                    reject(error);
                }
            })
        });
    }

    function Script_setting() {
        var menu_ALL = [
            // ['menu_GAEEScript_tc_Jianshu', 'Jianshu', '简书宽屏/简化', true],
        ], menu_ID = [];
        for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
            if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) };
            //console.log(menu_ALL[i][3]);
        }
        registerMenuCommand();

        // 注册脚本菜单
        function registerMenuCommand() {
            if (menu_ID.length > menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
                for (let i = 0; i < menu_ID.length; i++) {
                    GM_unregisterMenuCommand(menu_ID[i]);
                }
            }
            for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
                menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
                menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❎'} ${menu_ALL[i][2]}`, function () { menu_switch(`${menu_ALL[i][0]}`, `${menu_ALL[i][1]}`, `${menu_ALL[i][2]}`, `${menu_ALL[i][3]}`) });
            }
            let ClickMenu = GM_registerMenuCommand("菜单第" + GM_getValue("click_num", 0) + "点击", click, "h");

            function click() {
                GM_unregisterMenuCommand(ClickMenu);
                GM_setValue("click_num", GM_getValue("click_num", 0) + 1)
                ClickMenu = GM_registerMenuCommand("菜单第" + GM_getValue("click_num", 0) + "点击", click, "h");
            }
            menu_ID[menu_ID.length] = ClickMenu;
            menu_ID[menu_ID.length] = GM_registerMenuCommand("测试钉钉消息", function () { sendDingdingNotify("test") }, "t");
            menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${version}`, function () { window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/481137', { active: true, insert: true, setParent: true }); });
        }

        //切换选项
        function menu_switch(name, ename, cname, value) {
            if (value == 'false') {
                console.log(name);
                GM_setValue(`${name}`, true);
                registerMenuCommand(); // 重新注册脚本菜单
                location.reload(); // 刷新网页
                GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 }); // 提示消息
            } else {
                console.log(name);
                GM_setValue(`${name}`, false);
                registerMenuCommand(); // 重新注册脚本菜单
                location.reload(); // 刷新网页
                GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 }); // 提示消息
            }
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }
})();