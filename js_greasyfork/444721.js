// ==UserScript==
// @name         B站直播间机器人
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  【bilibili，机器人，直播】定时发消息、自动回复、指令[#XXX]功能，注意自动回复对自己发的是不生效的~。对话和指令功能需要实现一个本地服务器，脚本向7564端口/_api/chat接口本地服务发送格式为{content: ""}数据，可以使用阿里云智能机器人或者自己实现一个机器人（例如python 的RASA）
// @author       皮燕子
// @match        https://live.bilibili.com/*
// @exclude      https://live.bilibili.com/p/html/live-web-mng/**
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_info
// @connect      127.0.0.1
// @license      bonelf.com
// @downloadURL https://update.greasyfork.org/scripts/444721/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444721/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function () {
    // http://libs.baidu.com/jquery/2.1.4/jquery.min.js
    'use strict';
    // 注意页面有个iframe导致多次执行脚本，所以添加了exclude https://live.bilibili.com/p/html/live-web-mng/index.html?...

    // id,title,tips,defaultVal
    var menu_ALL = [
        ['menu_notify', '所有配置项需要刷新页面生效!', '你懂了就好', false],
        ['menu_intervalMsg_switch', '定时发送消息开关', '定时发送消息开关', true],
        ['menu_intervalMsg', '定时发送消息', '定时发送消息', {60: ["新来的小伙伴关注点一点~"]}],
        ['menu_reply_switch', '自动回复开关', '自动回复开关', true],
        ['menu_reply', '自动回复', '自动回复', [{
            regexp: "机器人在吗",
            reply: "我随时在哦~",
            rate: 1,
            timeout: 0
        }]], //旧版本 {"机器人在吗": ["我随时在哦~"]} + menu_rate
        ['menu_ruchang', '入场事件', '舰长入场、粉丝入场、普通用户入场', {
            enterReplyNorm: '',
            fansMedalLevel: 0,
            enterReplyFans: '',
            fansMedalContent: '',
            enterReplyJianzhang: '',
            enterReplyTidu: '',
        }],
        ['menu_at', '显示@用户后缀', '@用户后缀', true],
        ['menu_short_name', '用户简称', '长B站用户昵称可使用此配置缩短对用户的称呼', {}],
        ['menu_clear_cache', '重置配置', '如果出现配置不生效或者页面混乱，尝试重置配置', {}],
        ['menu_enemy', 'AI对话用户[需要服务器]', '英文逗号“,”分割', '']
    ], menu_ID = [];

    const mycss = `<style class="zhihuE_SettingStyle">
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
                max-width: 1000px;
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
        </style>`

    for (let i = 0; i < menu_ALL.length; i++) {
        // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menu_ALL[i][0]) == null) {
            GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
        }
    }

    // 初始化注册
    registerMenuCommand();

    /**
     * 注册脚本菜单
     * 页面如果执行多次脚本将出现BUG
     */
    function registerMenuCommand() {
        if (menu_ID.length >= menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单（有反馈），需要卸载所有脚本菜单
            for (let i = 0; i < menu_ID.length; i++) {
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
            if (menu_ALL[i][0] === 'menu_intervalMsg') {
                if (menu_value(menu_ALL[i][0])) {
                    menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                        // 用键值对，因为每相同时间建立一个定时器减少开销
                        customKeyValPrompt(menu_ALL[i],
                            {type: 'number', placeholder: '定时时间/s(>10s)'},
                            {type: 'text', placeholder: '文本(<20字符)'}
                        );
                    });
                }
            } else if (menu_ALL[i][0] === 'menu_reply') {
                if (menu_value(menu_ALL[i][0])) {
                    menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                        customReplyPrompt(menu_ALL[i]);
                    });
                }
            } else if (menu_ALL[i][0] === 'menu_short_name') {
                if (menu_value(menu_ALL[i][0])) {
                    menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                        customKeyValPrompt(menu_ALL[i],
                            {type: 'text', placeholder: '用户昵称'},
                            {type: 'text', placeholder: '用户简称'}
                        );
                    });
                }
            } else if (menu_ALL[i][0] === 'menu_ruchang') {
                menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                    customFormGroupPrompt(menu_ALL[i]);
                });
            } else if (menu_ALL[i][0] === 'menu_clear_cache') {
                menu_ID[i] = GM_registerMenuCommand(`❗ ${menu_ALL[i][1]}`, function () {
                    if(confirm(menu_ALL[i][2])){
                        for(let each of menu_ALL){
                            GM_deleteValue(each[0])
                        }
                        alert("重置成功")
                    }
                });
            } else if (menu_ALL[i][0] === 'menu_enemy' || menu_ALL[i][0] === 'menu_rate') {
                menu_ID[i] = GM_registerMenuCommand(`#️⃣ ${menu_ALL[i][1]}`, function () {
                    customMenuPrompt(menu_ALL[i][0], menu_ALL[i][2]);
                });
            } else {
                menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][1]}`, function () {
                    menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`)
                });
            }
        }
        menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 反馈 & 建议', function () {
            window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/444721-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9C%BA%E5%99%A8%E4%BA%BA/feedback', {
                active: true,
                insert: true,
                setParent: true
            });
        });
    }

    /**
     * 输入框设置
     * @param menu
     * @param keyMethod
     * @param valueMethod
     */
    function customFormGroupPrompt(menu) {
        let menuCode = menu[0];
        let menuName = menu[1];
        let pastVal = menu_value(menuCode) || {
            enterReplyNorm: '',
            fansMedalLevel: 0,
            enterReplyFans: '',
            fansMedalContent: '',
            enterReplyJianzhang: '',
            enterReplyTidu: '',
        }
        let _html = `
        ${mycss}
        <div class="zhihuE_SettingBackdrop_1">
            <div class="zhihuE_SettingBackdrop_2"></div>
            <div class="zhihuE_SettingRoot">
                <div class="zhihuE_SettingHeader">
                    ${menuName}
                    <span class="bonelf-close bonelf-finish" title="点击关闭"></span>
                </div>
                <div class="zhihuE_SettingMain">
                    <div>
                        普通用户进场：
                            <input class="bonelf_Setting bonelf-val" name="enterReplyNorm" type="text" value="${pastVal.enterReplyNorm}" />
                    </div>
                    <div>
                        粉丝牌大于
                            <input class="bonelf_Setting bonelf-key" name="fansMedalLevel" type="number" value="${pastVal.fansMedalLevel}" />
                            级的用户进场：
                            <input class="bonelf_Setting bonelf-val" name="enterReplyFans" type="text" value="${pastVal.enterReplyFans}" />
                            <br/>
                        （我的粉丝牌：
                            <input class="bonelf_Setting bonelf-key" name="fansMedalContent" type="text" value="${pastVal.fansMedalContent}" />）
                    </div>
                    <div>
                        舰长进场：
                            <input class="bonelf_Setting bonelf-val" name="enterReplyJianzhang" type="text" value="${pastVal.enterReplyJianzhang}" />
                    </div>
                    <div>
                        提督进场：
                            <input class="bonelf_Setting bonelf-val" name="enterReplyTidu" type="text" value="${pastVal.enterReplyTidu}" />
                    </div>
                    <div>
                        tips：可用"{昵称}"表示用户昵称，为空则不会回复，配置将直接生效，发弹幕有冷却时间，请合理控制回复对象~
                    </div>
                </div>
                <div class="button-group">
                    <button class="bonelf-save">保存</button>
                </div>
            </div>
        </div>
        `
        document.body.insertAdjacentHTML('beforeend', _html);
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
            // 保存点击事件
            let bonelfSave = document.querySelector('.bonelf-save');
            if (bonelfSave) {
                bonelfSave.onclick = function (event) {
                    let newVal = {}
                    let inputs = document.querySelectorAll('input.bonelf_Setting')
                    for (let i = 0; i < inputs.length; i++) {
                        if (newVal[inputs[i].getAttribute('name')]) {
                            newVal[inputs[i].getAttribute('name')].push(inputs[i].value)
                        } else {
                            newVal[inputs[i].getAttribute('name')] = inputs[i].value
                        }
                    }
                    console.log(newVal)
                    GM_setValue(menuCode, newVal);
                    registerMenuCommand(); // 重新注册脚本菜单

                    this.parentElement.parentElement.remove();
                    document.querySelector('.zhihuE_SettingStyle').remove();
                }
            }
        }, 100)
    }

    /**
     * 自动回复配置
     * @param menu
     */
    function customReplyPrompt(menu) {
        let menuCode = menu[0];
        let keyMethod = {type: 'text', placeholder: '关键词（支持正则）'},
            valueMethod = {type: 'text', placeholder: '回复内容'};
        return customInputPrompt(menu,
            keyMethod,
            valueMethod,
            function getItemHtml(itemValue) {
                return `<div>
                            <input class="bonelf_Setting bonelf-key" type="${keyMethod.type}" value="${itemValue.regexp||""}"
                                   placeholder="${keyMethod.placeholder}">
                        每
                            <input class="bonelf_Setting bonelf-timeout" min="0" style="width:40px" type="number" value="${itemValue.timeout||0}">
                        秒且每
                            <input class="bonelf_Setting bonelf-rate" min="0" style="width:40px" type="number" value="${itemValue.rate||1}">
                        条回复
                            <input class="bonelf_Setting bonelf-val" type="${valueMethod.type}" value="${itemValue.reply||""}"
                                   placeholder="${valueMethod.placeholder}">
                        一次
                        <span class="bonelf-close bonelf-delete" title="删除此行"></span>
                    </div>`
            }, function (that) {
                let keys = document.querySelectorAll('.bonelf-key')
                let values = document.querySelectorAll('.bonelf-val')
                let timeouts = document.querySelectorAll('.bonelf-timeout')
                let rates = document.querySelectorAll('.bonelf-rate')
                let newValList = []
                for (let i = 0; i < keys.length; i++) {
                    let newVal = {}
                    newVal.regexp = keys[i].value;
                    newVal.reply = values[i].value;
                    newVal.timeout = timeouts[i].value;
                    newVal.rate = rates[i].value;
                    newValList.push(newVal)
                }
                GM_setValue(menuCode, newValList);
                registerMenuCommand(); // 重新注册脚本菜单
                that.currentTarget.parentElement.parentElement.remove();
                document.querySelector('.zhihuE_SettingStyle').remove();
            })
    }

    /**
     * 输入框配置方法
     * @param menu
     * @param keyMethod
     * @param valueMethod
     * @param onSave
     */
    function customInputPrompt(menu, keyMethod, valueMethod, itemHtml, onSave) {
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
        let pastVal = menu_value(menuCode)
        let _html = `
        ${mycss}
        <div class="zhihuE_SettingBackdrop_1">
            <div class="zhihuE_SettingBackdrop_2"></div>
            <div class="zhihuE_SettingRoot">
                <div class="zhihuE_SettingHeader">
                    ${menuName}
                    <span class="bonelf-close bonelf-finish" title="点击关闭"></span>
                </div>
                <div class="zhihuE_SettingMain">
        `
        if (Array.isArray(pastVal)) {
            for (let each of pastVal) {
                _html += itemHtml(each)
            }
        } else {
            for (let pastValKey in pastVal) {
                if (pastVal.hasOwnProperty(pastValKey)) {
                    if (Array.isArray(pastVal[pastValKey])) {
                        pastVal[pastValKey].forEach(item => {
                            _html += itemHtml({key: pastValKey, value: item})
                        })
                    } else {
                        _html += itemHtml({key: pastValKey, value: pastVal[pastValKey]})
                    }
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
                        .insertAdjacentHTML('beforeend', itemHtml({key:"",value:""})); // 插入网页末尾
                    addDelEvt()
                }
            }
            // 添加点击事件
            let bonelfSave = document.querySelector('.bonelf-save');
            if (bonelfSave) {
                bonelfSave.onclick = onSave
            }
        }, 100)
    }

    /**
     * 双输入框配置方法
     * @param menu
     * @param keyMethod
     * @param valueMethod
     * @param onSave
     */
    function custom2InputPrompt(menu, keyMethod, valueMethod, onSave) {
        return customInputPrompt(menu, keyMethod, valueMethod,
            function getItemHtml(itemValue) {
                return `<div>
                        <label>
                            <input class="bonelf_Setting bonelf-key" type="${keyMethod.type}" value="${itemValue.key}"
                                   placeholder="${keyMethod.placeholder}">
                        </label>
                        <label>
                            <input class="bonelf_Setting bonelf-val" type="${valueMethod.type}" value="${itemValue.value}"
                                   placeholder="${valueMethod.placeholder}">
                        </label>
                        <span class="bonelf-close bonelf-delete" title="删除此行"></span>
                    </div>`
            }, onSave)
    }

    /**
     * 双输入列表存储配置方法
     * @param menu
     * @param keyMethod
     * @param valueMethod
     * @param onSave
     */
    function customListPrompt(menu, keyMethod, valueMethod) {
        let menuCode = menu[0];
        return custom2InputPrompt(menu, keyMethod, valueMethod, function (event) {
            let keys = document.querySelectorAll('.bonelf-key')
            let values = document.querySelectorAll('.bonelf-val')
            let newValList = []
            for (let i = 0; i < keys.length; i++) {
                let newVal = {}
                newVal[keyMethod.key] = keys[i].value;
                newVal[valueMethod.key] = values[i].value;
                newValList.push(newVal)
            }
            GM_setValue(menuCode, newValList);
            registerMenuCommand(); // 重新注册脚本菜单
            this.parentElement.parentElement.remove();
            document.querySelector('.zhihuE_SettingStyle').remove();
        })
    }

    /**
     * 双输入列表键值对存储配置方法
     * @param menu
     * @param keyMethod
     * @param valueMethod
     */
    function customKeyValPrompt(menu, keyMethod, valueMethod) {
        let menuCode = menu[0];
        return custom2InputPrompt(menu, keyMethod, valueMethod, function (event) {
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
        })
    }

    /**
     * 简单弹出框类型配置设置
     * @param menuName
     * @param tips
     */
    function customMenuPrompt(menuName, tips) {
        let nowBlockKeywords = menu_value(menuName) || ''
        let newBlockKeywords = prompt(tips ? tips : '编辑', nowBlockKeywords);
        if (newBlockKeywords != null) {
            GM_setValue(menuName, newBlockKeywords);
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }


    /**
     * 开关类型配置设置
     * @param menuStatus
     * @param name
     * @param tips
     */
    function menu_switch(menuStatus, name, tips) {
        if (menuStatus == 'true') {
            GM_setValue(`${name}`, false);
            GM_notification({
                text: `已关闭 [${tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                    location.reload();
                }
            });
        } else {
            GM_setValue(`${name}`, true);
            GM_notification({
                text: `已开启 [${tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function () {
                    location.reload();
                }
            });
        }
        registerMenuCommand(); // 重新注册脚本菜单
    }


    /**
     * 返回菜单值
     */
    function menu_value(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu[3]
            }
        }
    }

    //---------------------------------------------------------------------
    // 兼容性代码
    //---------------------------------------------------------------------
    // @since 1.2.4 menu_reply 存储格式变更
    let menuReply = menu_value("menu_reply_switch") ? (menu_value("menu_reply") || []) : []
    if (!Array.isArray(menuReply)) {
        let menuRate = menu_value("menu_rate") || 1
        let newValList = []
        for (let menuReplyKey in menuReply) {
            if (menuReply.hasOwnProperty(menuReplyKey)) {
                for (let menuReplyElementKey of menuReply[menuReplyKey]) {
                    let newVal = {
                        timeout: 0
                    };
                    newVal.rate = menuRate;
                    newVal.regexp = menuReplyKey;
                    newVal.reply = menuReplyElementKey;
                    newValList.push(newVal);
                }
            }
        }
        GM_setValue("menu_reply", newValList);
        alert("机器人脚本有数据更新，请刷新下页面");
    }
    //---------------------------------------------------------------------
    // 兼容性代码 END
    //---------------------------------------------------------------------

    window.onload = function () {
        // 消息队列
        // var msgQueue = ["您可爱的机器人来啦~(●'◡'●)"]
        var msgQueue = []

        // 消息队列冷却 s
        var msgQueueCooldown = 3;

        // readArr.forEach(item=>{msgQueue.push(item)})

        // 主播名称
        // var streamerDom = document.getElementsByClassName("room-owner-username")[0].getAttribute('title') || "Unknown";
        let streamerElem = document.querySelector('.header-info-ctnr');
        let streamerAreaVue = streamerElem ? streamerElem.__vue__ : { };
        var streamerName = streamerAreaVue.anchorUsername || "Unknown"
        var liveAreaName = streamerAreaVue.liveAreaName || "Unknown"

        // 登录用户名称
        // var customerName = document.getElementsByClassName("username-info")[0].firstChild.getAttribute('title') || "Unknown"
        var customerUid;
        findVueElem('.user-panel-ctnr', (elem) => {
            customerUid = Number(elem.__vue__.userData.uid) || 0
        })

        // 正则回复JSON
        // var replyJson = {
        //     "主播你是做什么工作的": "？",
        //     "机器人？": "我是一个机器人，请多包容(●'◡'●)",
        // }
        var replyJson = []
        var menuAt = false
        var shortNameMap = {}

        // 定时消息
        var intervalMsg = []

        /**
         * 刷新配置
         */
        function initConfig() {
            // 定时消息
            var intervalMsgData = menu_value("menu_intervalMsg_switch") ? (menu_value("menu_intervalMsg") || {}) : {}
            for (let intervalMsgDataKey in intervalMsgData) {
                if (intervalMsgData.hasOwnProperty(intervalMsgDataKey)) {
                    intervalMsg.push({
                        interval: Math.max(Number(intervalMsgDataKey), 10), msgArr: intervalMsgData[intervalMsgDataKey]
                    })
                }
            }
            // 正则回复
            // regexp: "机器人在吗",
            // reply: "我随时在哦~",
            // rate: 1,
            // timeout: 0
            replyJson = menu_value("menu_reply") || []
            menuAt = menu_value("menu_at") || false
            let shortNameMapData = menu_value("menu_short_name") || {}
            for (let shortNameMapDataKey in shortNameMapData) {
                if (shortNameMapData.hasOwnProperty(shortNameMapDataKey) &&
                    Array.isArray(shortNameMapData[shortNameMapDataKey]) &&
                    shortNameMapData[shortNameMapDataKey].length > 0) {
                    shortNameMap[shortNameMapDataKey] = shortNameMapData[shortNameMapDataKey][0]
                }
            }
        }

        initConfig()
        console.log("当前生效自动回复", replyJson)
        console.log("当前生效定时消息", intervalMsg)
        console.log("当前生效用户简称", shortNameMap)
        // var intervalMsg = [
        //     {interval: 60, msgArr: ["新来的小伙伴关注点一点~"]}
        // ]

        /**
         * AI 对话
         * @param param
         */
        function aiReply(param) {
            // AI 对话
            if (param.onlineCount && param.onlineCount > 100) {
                console.log("人数过多，AI对话禁用")
            }
            GM_xmlhttpRequest({
                method: "post",
                url: 'http://127.0.0.1:7564/_api/chat',
                data: JSON.stringify({content: param.text}),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (res) {
                    let data
                    try {
                        data = JSON.parse(res.response);
                    } catch (e) {
                    }
                    if (data) {
                        let ctt = data.data + (param.uname && menuAt ? ("@" + param.uname) : "");
                        console.log("回复内容:" + ctt)
                        msgQueue.push(ctt)
                    }
                },
                onerror: function (err) {
                    console.error(err)
                }
            });
        }

        // 指令列表
        var orderJson = {
            "#测试": function (param = '') {
                // sendStr("测试正常：" + param)
                msgQueue.push("测试正常：" + param.text)
            },
            "#对话 ": function (param) {
                aiReply(param);
            }
            // 其他指令过后台
            // "#刷新配置": function (param = '') {
            //     initConfig()
            //     // sendStr("刷新成功")
            //     msgQueue.push("刷新成功")
            // }
        }
        console.log("当前生效指令", orderJson)

        // 弹幕输入框model所在元素
        var danmakuElem;

        /**
         * 获取元素
         * @param selector
         * @param callback
         */
        function findVueElem(selector, callback) {
            // 弹幕输入框model所在元素获取任务定时器
            var times = 0;
            var findElemTimer = setInterval(() => {
                var elem = document.querySelector(selector);
                if (times > 20 || (elem && elem.__vue__)) {
                    callback(elem);
                    clearInterval(findElemTimer)
                } else {
                    console.warn("获取弹幕元素失败")
                }
                times++
            }, 1000)
        }

        findVueElem("#control-panel-ctnr-box", (res) => {
            danmakuElem = res;
        });

        /**
         * 发送数组消息
         * @param arr
         * @param finish 消息发送完即关闭定时器
         */
        function sendArr(arr, finish = true) {
            var times = 0;
            var timer = setInterval(() => {
                var elem = danmakuElem;
                if (elem && elem.__vue__) {
                    let data = elem.__vue__.$data;
                    if (data && arr.length > 0) {
                        data.chatInput = arr.shift().substring(0, 20)
                        elem.__vue__.sendDanmaku()
                    }
                    if (arr.length === 0 && finish) {
                        clearInterval(timer)
                    }
                } else if (times < 20) {
                    console.warn("danmakuElem 为空")
                } else {
                    console.warn("消息队列因获取不到弹幕输入框model终止")
                    clearInterval(timer)
                }
                times++
            }, msgQueueCooldown * 1000)
        }

        /**
         * 对此方法调用可能会引起弹幕输入过快,
         * 更推荐向消息队列+数据
         * @param str
         */
        function sendStr(str) {
            var elem = danmakuElem;
            if (elem && elem.__vue__) {
                let data = elem.__vue__.$data;
                if (!data) {
                    alert("发送失败")
                }
                data.chatInput = str.substring(0, 20)
                elem.__vue__.sendDanmaku()
            }
        }

        // 消息队列数据发送
        sendArr(msgQueue, false)

        // 定时发送消息
        intervalMsg.forEach(item => {
            item.timer = setInterval(() => {
                item.msgArr.forEach(i => {
                    msgQueue.push(i)
                })
            }, item.interval * 1000)
        })

        // 处理到的最近的弹幕
        var danmakuPointer

        /**
         * 初始化最近一条弹幕的DOM
         */
        function initRecentDom() {
            let allDanmakuElem = document.querySelectorAll("div.danmaku-item[data-uname]")
            if (allDanmakuElem.length > 0) {
                danmakuPointer = allDanmakuElem[allDanmakuElem.length - 1]
            }
        }

        var countMap = {};

        // 消息回复
        var timer = setInterval(() => {
            if (!danmakuPointer) {
                initRecentDom();
            }
            // 以后出现弹幕过多时页面卡死则考虑加这个代码，但是要考虑高能预警情况 可能卫视 ###.##万 这种带单位的格式
            let headerInfoCtnrElem = document.querySelector('.header-info-ctnr');
            let onlineCount = headerInfoCtnrElem ? (headerInfoCtnrElem.__vue__.onlineCount || 0) : 0;
            // if (onlineCount > 10000) {
            //     console.warn("本直播间人数超过10000，出于页面安全考虑禁用了自动回复功能")
            // }
            while (danmakuPointer && danmakuPointer.nextSibling != null) {
                danmakuPointer = danmakuPointer.nextSibling
                if (!danmakuPointer.classList.contains('danmaku-item')) {
                    continue;
                }
                let uid = Number(danmakuPointer.getAttribute('data-uid'))
                let uname = danmakuPointer.getAttribute('data-uname')
                // 跳过对自己的回复 uname === streamerName || 或者主播添加这个，其实能获取到用户id来判断
                let text = danmakuPointer.getAttribute('data-danmaku')
                // console.debug("uid:" + uid);
                // console.debug("customerUid:" + customerUid);
                if (uid !== customerUid) {
                    // 自动回复
                    for (let each of replyJson) {
                        let re = new RegExp(each.regexp);
                        if (text.match(re)) {
                            let now = new Date();
                            if (countMap[each.regexp] === undefined) {
                                countMap[each.regexp] = {count: 0, lastTime: undefined}
                            }
                            // sendStr(replyJson[each] + menuAt ? "@" + uname : "")
                            if (countMap[each.regexp].count % Number(each.rate) === 0 &&
                                // 时间未到
                                (countMap[each.regexp].lastTime === undefined ||
                                    (now.getTime() - countMap[each.regexp].lastTime.getTime()) / 1000 > Number(each.timeout))) {
                                console.log("自动回复->" + each.regexp + "：" + each.reply)
                                msgQueue.push(each.reply + (menu_value("menu_at") ? ("@" + (shortNameMap[uname] || uname)) : ""))
                                countMap[each.regexp].lastTime = now;
                            }
                            countMap[each.regexp].count = countMap[each.regexp].count + 1;
                            break;
                        }
                    }
                }
                // 指令应答
                if (text.startsWith("#")) {
                    let match = false;
                    for (let each in orderJson) {
                        let re = new RegExp(each);
                        let result = text.match(re);
                        if (result && result.length > 0) {
                            match = true;
                            console.log("指令应答:" + each)
                            let param = {
                                text: text.replace(result[0], ''),
                                onlineCount: onlineCount,
                                uname: uname
                            }
                            orderJson[each](param)
                            break;
                        }
                    }
                    if (!match) {
                        // 请求后台数据
                        GM_xmlhttpRequest({
                            method: "post",
                            url: 'http://127.0.0.1:7564/_api/order',
                            data: JSON.stringify({
                                content: text,
                                streamerName: streamerName,
                                customerName: customerUid,
                                channel: liveAreaName,
                                uname: uname,
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function (res) {
                                let data
                                try {
                                    data = JSON.parse(res.response);
                                } catch (e) {
                                }
                                if (data && data.data) {
                                    let ctt = data.data.content + (uname && menuAt ? ("@" + uname) : "");
                                    console.log("回复内容:" + ctt)
                                    msgQueue.push(ctt)
                                }
                            },
                            onerror: function (err) {
                                console.error(err)
                            }
                        });
                    }
                }
                // 对话用户
                let enemyStr = menu_value("menu_enemy");
                if (enemyStr) {
                    for (let name of enemyStr.split(",")) {
                        if (uid === name && uid !== customerUid) {
                            aiReply({text: text})
                        }
                    }
                }
            }
        }, 5000)

        /**
         * 普通用户进入直播间
         */
        document.querySelector('#brush-prompt').addEventListener('DOMNodeInserted', function (e) {
            // fans-medal-content 粉丝牌
            let $fansMedalContent = document.querySelector('#brush-prompt .fans-medal-content')
            let fansMedalContent = $fansMedalContent ? $fansMedalContent.innerHTML : null
            // fans-medal-level 粉丝等级
            let $fansMedalLevel = document.querySelector('#brush-prompt .fans-medal-level')
            let fansMedalLevel = $fansMedalLevel ? Number($fansMedalLevel.innerHTML) : 0
            // interact-name 用户昵称
            let $interactName = document.querySelector('#brush-prompt .interact-name')
            let interactName = $interactName ? $interactName.innerHTML : null
            interactName = shortNameMap[interactName] || interactName;
            // console.log('普通用户进入直播间', interactName);

            let ruchangSetting = menu_value("menu_ruchang") || {};
            let myFansMedalContent = ruchangSetting.fansMedalContent || null;
            let myFansMedalLevelStr = ruchangSetting.fansMedalLevel;
            // 普通用户
            let normUserReply = ruchangSetting.enterReplyNorm;
            // 粉丝
            let fansUserReply = ruchangSetting.enterReplyFans;
            // 达到要求的粉丝级别
            let myFansMedalLevel = myFansMedalLevelStr ? Number(myFansMedalLevelStr) : 0;

            if (fansUserReply && myFansMedalContent === fansMedalContent && myFansMedalLevel <= fansMedalLevel) {
                // console.log(fansUserReply
                //     .replace("{昵称}", interactName))
                msgQueue.push(fansUserReply
                    .replace("{昵称}", interactName))
            }
            // console.log("欢迎用户", normUserReply, interactName)
            if (normUserReply) {
                // console.log(normUserReply.replace("{昵称}", interactName))
                msgQueue.push(normUserReply.replace("{昵称}", interactName))
            }
        });

        /**
         * 下面事件会触发两次，所以以此字段判断第二次不执行
         */
        var lastWelcomeText;
        /**
         * 特殊用户进入直播间
         */
        document.querySelector('#welcome-area-bottom-vm').addEventListener('DOMNodeInserted', function (e) {
            let $samaNameBox = document.querySelector('#welcome-area-bottom-vm .sama-name-box')
            let welcomeText = $samaNameBox ? $samaNameBox.textContent : ""
            // console.log("特殊用户进入直播间事件触发", welcomeText)
            if (lastWelcomeText === welcomeText) {
                return;
            }

            function send(type, reply) {
                let $interactName = document.querySelector('#welcome-area-bottom-vm .sama-name-box span')
                let interactName = $interactName ? $interactName.innerHTML : null
                interactName = shortNameMap[interactName] || interactName;
                // console.log("欢迎" + type, jianzhangReply, interactName)
                if (reply) {
                    //console.log(reply
                    //    .replace("{昵称}", interactName))
                    msgQueue.push(reply
                        .replace("{昵称}", interactName))
                }
            }

            let ruchangSetting = menu_value("menu_ruchang") || {};
            if (welcomeText.startsWith("欢迎舰长 ")) {
                send('舰长', ruchangSetting.enterReplyJianzhang);
            } else if (welcomeText.startsWith("欢迎提督 ")) {
                send('提督', ruchangSetting.enterReplyTidu);
            } else {
                // 还有一个没身份的特效，应该是高能用户？
                send('~', ruchangSetting.enterReplyNorm);
            }
            lastWelcomeText = welcomeText;
        });

        /**
         * 清除已定义的定时器
         */
        function stopAllInterval() {
            // 定时消息
            intervalMsg.forEach(item => {
                if (item.timer) {
                    clearInterval(item.timer)
                }
                delete item.timer;
            })
            clearInterval(timer)
        }

        function keyDown(e) {
            if (e.which === 27) { //ESC
                e.returnValue = false;
                console.log("ESC")
                stopAllInterval()
                return false;
            }
        }

        document.onkeydown = keyDown;
    }
})();