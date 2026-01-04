// ==UserScript==
// @name			斗鱼自动发送弹幕、自定义清爽模式
// @namespace		http://tampermonkey.net/
// @version			0.0.4
// @icon			http://www.douyutv.com/favicon.ico
// @description		循环弹幕、自定义清爽模式
// @author			H2P
// @compatible		chrome
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @note			2020.04.26-V0.0.01 发送循环弹幕，设定自动保存
// @note			2020.04.26-V0.0.02 自定义清爽模式，目前只支持主播信息
// @note			2020.04.27-V0.0.03 优化清爽模式，支持导航栏
// @note			2020.04.27-V0.0.04 修复清爽模式自动保存 BUG
// @downloadURL https://update.greasyfork.org/scripts/401994/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/401994/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(() => {
    // 抽奖倒计时：document.querySelector('div.LotteryDrawEnter div.LotteryDrawEnter-desc').textContent

    const $H2P = function (xpath, one = true) {
        if (one) { return document.querySelector(xpath); }
        else { return document.querySelectorAll(xpath); }
    }

    window.onload = function () {
        new Promise((resolve, reject) => {
            // 先添加样式
            let eleStyle = document.createElement('style');
            eleStyle.innerHTML = `
                button {
                    font-family: WeibeiSC-Bold, STKaiti;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.8s ease;
                }
                button:active {
                    opacity: 0;
                }

                .h2p-div-borad {
                    position: fixed;
                    z-index: 9999;
                    bottom: 60%;
                    right: -322px;
                    width: 300px;
                    min-height: 100px;
                    height: auto;
                    padding: 10px;
                    border: 1px solid rgb(255, 145, 26);
                    border-right: 0;
                    border-radius: 10px 0 0 10px;
                    display: flex;
                    flex-flow: row wrap;
                    font-size: 14px;
                    font-family: WeibeiSC-Bold, STKaiti;
                    line-height: 15px;
                    background: #f8f8f8;
                    transition: all 1s ease;
                }
                .h2p-div-borad:hover {
                    right: 0px;
                }
                .h2p-left-out {
                    position: absolute;
                    top: 40%;
                    left: -16px;
                    width: 15px;
                    height: 80px;
                    border: 1px solid #ff9019;
                    border-right: 0;
                    border-radius: 15px 0 0 15px;
                    background-color: #f8f8f8;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    opacity: 1;
                    transition: opacity 1s ease-in;
                }
                .h2p-div-borad:hover .h2p-left-out{
                    opacity: 0;
                    transition: opacity 0s;
                }

                .h2p-nav-bottom {
                    width: 320px;
                    height: 27px;
                    margin: 10px -10px -10px;
                    border-top: 1px solid #d0d0d0;
                    border-radius: 0 0 0 15px;
                }
                .h2p-nav-bottom button {
                    width: 33.33%;
                    height: 100%;
                    border: none;
                    background: #f8f8f8;
                    transition: opacity 0.5s;
                }
                .h2p-nav-bottom button:nth-child(1) {
                    border-right: 1px solid #d0d0d0;
                    border-radius: 0 0 0 9px;
                }
                .h2p-nav-bottom button:nth-child(2) {
                    border-right: 1px solid #d0d0d0;
                }
                .h2p-nav-item-btn-selected {
                    background: #ffbb77!important;
                }

                .h2p-div-ceil {
                    width: 300px;
                }
                .h2p-flex-main-center {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: center;
                }
                .h2p-flex-main-start {
                    display: flex;
                    justify-content: flex-start;
                }
                .h2p-flex-main-end {
                    display: flex;
                    justify-content: flex-end;
                }
                .h2p-flex-cross-center {
                    display: flex;
                    align-items: center;
                }

                .h2p-item-100p {
                    width: 100%;
                    margin: 5px 0;
                }
                .h2p-item-50p {
                    width: 50%;
                    margin: 5px 0;
                }
                .h2p-item-33p {
                    width: 33.33%;
                    margin: 5px 0;
                }
                .h2p-item-25p {
                    width: 25%;
                    margin: 5px 0;
                }

                .h2p-item-hover {
                    background: #2299ff!important;
                }
                .h2p-item-selected {
                    background: #77bbff;
                }
            `;
            document.head.append(eleStyle);
            resolve();
        })
        .then(() => {
            // 添加发送弹幕界面元素
            let eleBoard = document.createElement('div');
            eleBoard.id = 'h2p-div-borad';
            eleBoard.className = 'h2p-div-borad';
            eleBoard.innerHTML = `
                <div class="h2p-left-out">
                    <span><</span>
                </div>
                <div id="div-nav-bottom" class="h2p-nav-bottom h2p-flex-main-center" style="align-self: flex-end; order: 999">
                    <button id="btn-chat" class="h2p-nav-item-btn-selected">📢</button>
                    <button id="btn-clear">✡️</button>
                    <button id="btn-config">⏲️</button>
                </div>
            `;
            document.body.append(eleBoard);
        })
        .then(() => {
            // 开始在界面上添加元素
            initView_Chat();
            initView_Clear();
        })
        .then(() => {
            let nav = $H2P('div#div-nav-bottom');
            nav.addEventListener('click', (event) => {
                let target = event.target;
                $H2P('div#h2p-div-borad > div.h2p-div-ceil', false).forEach(ele => { ele.style.display = 'none'; });
                $H2P('div#div-nav-bottom button', false).forEach(ele => ele.classList.remove('h2p-nav-item-btn-selected'));
                if (target.id === 'btn-chat') {
                    $H2P('button#btn-chat').classList.add('h2p-nav-item-btn-selected');
                    $H2P('div#h2p-div-chat').style.display = '';
                } else if (target.id === 'btn-clear') {
                    $H2P('button#btn-clear').classList.add('h2p-nav-item-btn-selected');
                    $H2P('div#h2p-div-clear').style.display = '';
                } else if (target.id === 'btn-config') {
                    $H2P('button#btn-config').classList.add('h2p-nav-item-btn-selected');
                    $H2P('div#h2p-div-config').style.display = '';
                }
            }, false);
        })
        .catch((error) => { console.log(error); })
    }





    // ========== ========== ========== ========== ========== ========== ==========
    //
    //
    //
    //                                 初始化弹幕模块
    //
    //
    //
    // ========== ========== ========== ========== ========== ========== ==========
    const LSChat = 'h2p-DY-config-chat';
    let config_chat = undefined;
    let [Chat, INVL_SendMsg, INVL_ShowCD] = [undefined, undefined, undefined];

    function initView_Chat () {
        new Promise((resolve, reject) => {
            // 先添加样式
            let eleStyle = document.createElement('style');
            eleStyle.innerHTML = `
                .h2p-input-invl {
                    width: 23px;
                    min-height: 17px;
                    padding: 0 3px;
                    border: 1px solid #d0d0d0;
                    border-radius: 3px;
                }

                .h2p-ta-chat-loop {
                    width: 100%;
                    height: 60px;
                    padding: 0 4px;
                    border: 1px solid #d0d0d0;
                    border-radius: 5px;
                    resize: none;
                }

                .h2p-btn-send-chat {
                    width: 100%;
                    padding: 4px 0;
                    border: none;
                    border-radius: 5px;
                    background: #66ddcc;
                    cursor: pointer;
                    transition: all 0.5s
                }
                .h2p-btn-send-chat:hover {
                    background: #55ccaa;
                }
                .h2p-btn-send-chat span {
                    display: inline-block;
                    position: relative;
                    transition: all 0.5s
                }
                .h2p-btn-send-chat span:after {
                    content: '🔥';
                    position: absolute;
                    opacity: 0;
                    top: -2px;
                    right: -20px;
                    transition: 0.5s;
                }
                .h2p-btn-send-chat:hover span {
                    padding-right: 20px;
                }  
                .h2p-btn-send-chat:hover span:after {
                    opacity: 1;
                    right: 0;
                }
                .h2p-btn-active {
                    background: #ffbb77!important;
                }
            `;
            document.head.append(eleStyle);
            resolve();
        })
        .then(() => {
            // 添加发送弹幕界面元素
            let eleChat = document.createElement('div');
            eleChat.id = 'h2p-div-chat';
            eleChat.className = 'h2p-flex-main-center h2p-div-ceil';
            eleChat.style = 'order: 0;';
            eleChat.innerHTML = `
                <div class="h2p-item-50p" style="order: 0;">
                    <span>间隔:</span>
                    <input id="input-invl-start" class="h2p-input-invl" placeholder="≥3">
                    <span>～</span>
                    <input id="input-invl-end" class="h2p-input-invl">
                    <span>秒</span>
                </div>
                <div class="h2p-item-50p h2p-flex-main-end" style="order: 1;">
                    <input id="input-invl" class="h2p-input-invl" style="width: 33px" disabled>
                </div>
                <div class="h2p-item-100p" style="order: 2;">
                    <div class="h2p-flex-cross-center">
                        <input id="input-chat-loop" type="checkbox" style="margin: 3px;">
                        <textarea class="h2p-ta-chat-loop" placeholder="循环弹幕"></textarea>
                    </div>
                </div>
                <div class="h2p-item-100p" style="order: 20;">
                    <button id="btn-chat-send" class="h2p-btn-send-chat">
                        <span>发送</span>
                    </button>
                </div>
            `;
            $H2P('div#h2p-div-borad').append(eleChat);
        })
        .then(() => {
            // 给元素添加监听
            let eleChat = $H2P('div#h2p-div-chat');
            eleChat.addEventListener('click', (event) => {
                let target = event.target;
                if (target.id === 'input-chat-loop') {
                    config_chat.isLoop = target.checked;
                }
                localStorage.setItem(LSChat, JSON.stringify(config_chat));
            }, false)

            // 间隔最小值
            let eleInvlStart = $H2P('input#input-invl-start');
            eleInvlStart.addEventListener('input', () => { eleInvlStart.value = eleInvlStart.value.slice(0, 3); });
            eleInvlStart.addEventListener('keyup', () => { eleInvlStart.value = eleInvlStart.value.replace(/[^\d]/g, ''); });
            eleInvlStart.addEventListener('focusout', () => {
                eleInvlStart.value = Math.max(eleInvlStart.value, 3);
                config_chat.invlStart = eleInvlStart.value;
                localStorage.setItem(LSChat, JSON.stringify(config_chat));
            });

            // 间隔最大值
            let eleInvlEnd = $H2P('input#input-invl-end');
            eleInvlEnd.addEventListener('input', () => { eleInvlEnd.value = eleInvlEnd.value.slice(0, 3); });
            eleInvlEnd.addEventListener('keyup', () => { eleInvlEnd.value = eleInvlEnd.value.replace(/[^\d]/g, ''); });
            eleInvlEnd.addEventListener('focusout', () => {
                eleInvlEnd.value = Math.max(eleInvlEnd.value, Number(eleInvlStart.value) + 1, 4);
                config_chat.invlEnd = eleInvlEnd.value;
                localStorage.setItem(LSChat, JSON.stringify(config_chat));
            });
            
            let eleLoop = $H2P('textarea.h2p-ta-chat-loop');
            eleLoop.addEventListener('focusout', () => {
                if (eleLoop.value && eleLoop.value.replace(/\s/g, '')) {
                    config_chat.loopChat = eleLoop.value.split('\n');
                    localStorage.setItem(LSChat, JSON.stringify(config_chat));
                }
            });

            let eleSend = $H2P('button#btn-chat-send');
            eleSend.addEventListener('click', () => {
                config_chat.isSend = !config_chat.isSend;
                if (config_chat.isSend) {
                    setINVL_SendMsg();
                    eleSend.classList.add('h2p-btn-active');
                    eleSend.firstElementChild.textContent = "发送中";
                }
                else {
                    window.clearTimeout(INVL_SendMsg);
                    INVL_SendMsg = undefined;
                    window.clearInterval(INVL_ShowCD);
                    $H2P('input#input-invl').value = '';
                    INVL_ShowCD = undefined;
                    eleSend.classList.remove('h2p-btn-active');
                    eleSend.firstElementChild.textContent = "发送";
                }
                localStorage.setItem(LSChat, JSON.stringify(config_chat));
            }, false)
        })
        .catch((error) => { console.log(error); })
        .then(() => {
            if (!config_chat) { config_chat = JSON.parse(localStorage.getItem(LSChat)) || {}; }
            $H2P('input#input-invl-start').value = config_chat.invlStart || '';
            $H2P('input#input-invl-end').value = config_chat.invlEnd || '';
            $H2P('input#input-chat-loop').checked = config_chat.isLoop || false;
            $H2P('textarea.h2p-ta-chat-loop').value = config_chat.loopChat ? config_chat.loopChat.join('\n') : '';
            if (config_chat.isSend) {
                config_chat.isSend = false;
                $H2P('button#btn-chat-send').click();
            }
            if (!Chat) { Chat = setChat(); }
        })
        .catch((error) => {
            // 判断 localStorage 是否能够读取 h2p-DY-config-chat
            console.log(error);
            config_chat = config_chat || {};
            localStorage.removeItem(LSChat);
            localStorage.setItem(LSChat, JSON.stringify(config_chat));
        })

        function getMsg () {
            let msg = undefined;
            if (!msg && config_chat.isLoop && Array.isArray(config_chat.loopChat)) {
                let index = Math.floor(Math.random() * (config_chat.loopChat.length));
                msg = config_chat.loopChat[index];
            }
            return msg;
        }
    
        function setINVL_SendMsg () {
            let {invlStart = 2, invlEnd = 2} = config_chat;
            let [start, end] = [Number(invlStart), Number(invlEnd)];
            let invl = Math.floor(Math.random() * (end - start)) + start;
            setINVL_ShowCD(invl);
            INVL_SendMsg = setTimeout(() => {
                Chat.setMsg(getMsg());
                Chat.sendMsg();
                setINVL_SendMsg();
            }, invl * 1000);
        }
    
        function setINVL_ShowCD (invl) {
            new Promise((resolve, reject) => {
                window.clearInterval(INVL_ShowCD);
                resolve(invl);
            }).then((invl)=> {
                let cd = invl + 0.3;
                INVL_ShowCD = setInterval(() => {
                    cd = Math.max(Math.floor((cd - 0.1) * 10) / 10.0, 0);
                    $H2P('input#input-invl').value = cd;
                }, 100);
            })
        }
    
        function setChat () {
            let [eleSetMsg, eleSendMsg] = [undefined, undefined];
            return {
                setMsg : (msg)=>{
                    if (!eleSetMsg && $H2P('.ChatSend-txt')) { eleSetMsg = $H2P('.ChatSend-txt'); }
                    if (eleSetMsg) { eleSetMsg.value = msg; }
                },
                sendMsg : ()=>{
                    if (!eleSendMsg && $H2P('.ChatSend-button')) { eleSendMsg = $H2P('.ChatSend-button'); }
                    if (eleSendMsg) { eleSendMsg.click(); }
                }
            }
        }
    }





    // ========== ========== ========== ========== ========== ========== ==========
    //
    //
    //
    //                                 初始化清爽模块
    //
    //
    //
    // ========== ========== ========== ========== ========== ========== ==========
    const LSClear = 'h2p-DY-config-clear';
    let config_clear = undefined;

    function initView_Clear () {
        let isSelectingEle = false;

        new Promise((resolve, reject) => {
            // 先添加样式
            let eleStyle = document.createElement('style');
            eleStyle.innerHTML = `
                .h2p-btn-clear {
                    width: 95%;
                    padding: 4px 0;
                    border: none;
                    border-radius: 5px;
                    background: #66ddcc;
                    transition: 0.5s;
                }
                .h2p-btn-clear:hover {
                    background: #55ccaa;
                }
            `;
            document.head.append(eleStyle);
            resolve();
        })
        .then(() => {
            // 添加清爽模式界面元素
            let eleClear = document.createElement('div');
            eleClear.id = 'h2p-div-clear';
            eleClear.className = 'h2p-flex-main-center h2p-div-ceil';
            eleClear.style = 'display: none; order: 0';
            eleClear.innerHTML = `
                <div class="h2p-item-50p h2p-flex-main-start" style="order: 0;">
                    <button id="btn-clear-DIY" class="h2p-btn-clear">自定义清爽</button>
                </div>
                <div class="h2p-item-50p h2p-flex-main-end" style="order: 1;">
                    <button id="btn-clear-selectEle" class="h2p-btn-clear">选择元素</button>
                </div>
            `;
            $H2P('div#h2p-div-borad').append(eleClear);
        })
        .then(() => {
            let eleClear = $H2P('div#h2p-div-clear');
            eleClear.addEventListener('click', (event) => {
                let target = event.target;
                if (target.tagName.toLowerCase() === 'button') { target.classList.toggle('h2p-btn-active'); }
                // 自定义清爽模式
                if (target.id === 'btn-clear-DIY') {
                    config_clear.isClearDIY = !config_clear.isClearDIY;
                    localStorage.setItem(LSClear, JSON.stringify(config_clear));
                    // $H2P('div#js-player-title').style.display = 'none';
                    config_clear.clearInfo.forEach(xpath => { $H2P(xpath).style.display = config_clear.isClearDIY ? 'none' : ''; });
                    // $H2P('div#js-player-title').style.display = '';
                }
                // 选择自定义清爽的元素
                else if (target.id === 'btn-clear-selectEle') {
                    isSelectingEle = target.classList.contains('h2p-btn-active');
                    if (!isSelectingEle) {
                        $H2P('.h2p-item-selected', false).forEach(ele => {
                            if (config_clear.isClearDIY) { ele.style.display = 'none'; }
                            ele.classList.remove('h2p-item-selected')
                        });
                    } else if (!config_clear.isClearDIY) {
                        config_clear.clearInfo.forEach(xpath => $H2P(xpath).classList.add('h2p-item-selected'));
                    }
                }
            }, false)
        })
        .then(() => {
            // 导航栏、主播信息面板
            let areas = [$H2P('header#js-header'), $H2P('div#js-player-title')];
            
            for (area of areas) {
                if (area) {
                    let curele = undefined;
                    area.addEventListener('mouseover', (event) => {
                        if (isSelectingEle) {
                            curele = event.target;
                            event.target.classList.add('h2p-item-hover');
                        }
                    }, false);
                    area.addEventListener('mouseout', (event) => {
                        if (isSelectingEle) {
                            curele = undefined;
                            event.target.classList.remove('h2p-item-hover');
                        }
                    }, false);
                    area.addEventListener('click', (event) => {
                        if (curele === event.target && curele !== event.currentTarget) {
                            clearClickSelect(event.target, `${area.tagName.toLowerCase()}#${area.id}`);
                        }
                    }, false)
                }
            }
        })
        .catch((error) => { console.log(error); })
        .then(() => {
            if (!config_clear) { config_clear = JSON.parse(localStorage.getItem(LSClear)) || {}; }
            if (config_clear.isClearDIY) {
                $H2P('button#btn-clear-DIY').classList.add('h2p-btn-active');
                let wait = setInterval(() => {
                    let notReady = config_clear.clearInfo.filter(xpath => !$H2P(xpath));
                    let eles = config_clear.clearInfo.filter(xpath => $H2P(xpath) && $H2P(xpath).style.display !== 'none');
                    eles.forEach(xpath => { $H2P(xpath).style.display = 'none'; });
                    if (notReady.length === 0) {
                        window.clearInterval(wait);
                        wait = undefined;
                    }
                }, 500);
            }
        })

        function findXPath (current, root) {
            if (root.tagName.toLowerCase() === 'header' && root.id === 'js-header' && current.tagName.toLowerCase() === 'div' && current.parentNode.tagName.toLowerCase() === 'li') {
                current = current.parentNode;
            }
            let index = Array.from(current.parentNode.children).filter(ele => ele.tagName === current.tagName).indexOf(current);
            let xpath = index === 0 ? ` > ${current.tagName.toLowerCase()}` : ` > ${current.tagName.toLowerCase()}:nth-child(${index+1})`;
            current = current.parentNode;
            while (current !== root && !current.id) {
                index = Array.from(current.parentNode.children).filter(ele => ele.tagName === current.tagName).indexOf(current);
                if (index === 0) { xpath = ` > ${current.tagName.toLowerCase()}` + xpath; }
                else { xpath = ` > ${current.tagName.toLowerCase()}:nth-child(${index+1})` + xpath; }
                current = current.parentNode;
            }
            return `${current.tagName.toLowerCase()}#${current.id}${xpath}`;
        }

        function clearClickSelect (target, xpathPre) {
            let xpath = '';
            if (target.id) { xpath = `${xpathPre} ${target.tagName.toLowerCase()}#${target.id}`; }
            else { xpath = findXPath(target, event.currentTarget); }
            // console.log(xpath);
            $H2P(xpath).classList.toggle('h2p-item-selected');
            if ($H2P(xpath).classList.contains('h2p-item-selected')) {
                if (!config_clear.clearInfo) { config_clear.clearInfo = []; }
                if (config_clear.clearInfo.indexOf(xpath) < 0) {
                    config_clear.clearInfo.push(xpath);
                    localStorage.setItem(LSClear, JSON.stringify(config_clear));
                }
            } else {
                let index = config_clear.clearInfo.indexOf(xpath);
                if (index > -1) {
                    config_clear.clearInfo.splice(index, 1);
                    localStorage.setItem(LSClear, JSON.stringify(config_clear));
                }
            }
        }
    }
})();