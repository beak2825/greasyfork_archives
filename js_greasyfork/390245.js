// ==UserScript==
// @name                bilibili-live-room-blocker bilibili 直播间屏蔽工具
// @name:en             bilibili-live-room-blocker
// @name:ja             bilibili-live-room-blocker ライブルームスクリーニングツール
// @name:zh-CN          bilibili-live-room-blocker bilibili 直播间屏蔽工具
// @name:zh-TW          bilibili-live-room-blocker bilibili 直播間屏蔽工具
// @namespace           https://github.com/catscarlet/bilibili-live-room-blocker
// @description         bilibili 直播间屏蔽工具，可以把不喜欢的直播间在房间列表页屏蔽掉
// @description:en      bilibili live room blocker, use this to block the room you don't like
// @description:ja      これを使用して、気に入らない部屋をブロックします
// @description:zh-CN   bilibili 直播间屏蔽工具，可以把不喜欢的直播间在房间列表页屏蔽掉
// @description:zh-TW   bilibili 直播間屏蔽工具，可以把不喜歡的直播間在房間列表頁屏蔽掉
// @icon                https://www.bilibili.com/favicon.ico
// @version             0.0.2
// @author              catscarlet
// @license             MIT License
// @match               *://live.bilibili.com/p/*
// @match               *://live.bilibili.com/all*
// @run-at              document-end
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM.listValues
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390245/bilibili-live-room-blocker%20bilibili%20%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/390245/bilibili-live-room-blocker%20bilibili%20%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

GM_addStyle(`
    .bilibili-live-room-block {
        margin-left: 1em;
        margin-right: 1em;
    }
    .room-handler {
        text-decoration: none; color: rgb(0, 115, 170); cursor: pointer;
    }
    .room-choice-submit {
        text-decoration: none; color: rgb(0, 115, 170); cursor: pointer;
    }
    .room-choice-handler {
        text-decoration: underline; color: rgb(0, 115, 170); cursor: pointer;
    }
    .room-blocker-input {
        display: inline;
    }
    .reason-selector {
        style="display: inline-flex"
    }
`);

(function() {
    'use strict';

    console.log('bilibili-live-room-block loaded.');
    init();
    ob();
    consoleShowBlockList();

    history.onpushstate = function(e) {
        init();
    };

    window.onpopstate = function(event) {
        init();
    };

    function ob() {
        let obj = document.getElementsByClassName('list')[0];

        let observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        };

        let observer = new MutationObserver(init);

        observer.observe(obj, observerOptions);
    }

    function init() {
        if (!document.getElementsByClassName('list')[0]) {
            console.log('list has no child, setTimeout');
            window.setTimeout(() => {
                init();
            }, 1000);
        } else {
            let list = document.getElementsByClassName('list')[0].children;
            for (let item of list) {
                let flag = item.getAttribute('room');
                if (flag) {
                    continue;
                }
                let str = item.children[0].href;
                let origin = item.children[0].origin;

                if (str.startsWith(origin + '/')) {
                    let roomId = str.slice(26);
                    item.setAttribute('room', roomId);

                    let p = document.createElement('p');
                    p.className = 'bilibili-live-room-block';
                    p.innerHTML = `
                <a class="room-handler" room="${roomId}">我不喜欢${roomId}这个直播间</a>
                <br>
                <input id="room-${roomId}-blocker-input" room="${roomId}" class="room-blocker-input" type="text" title="可自定义理由，或点击下面快速选择" disabled>

                <div id="room-${roomId}-blocker-handler" style="display:inline; visibility: hidden;">
                    <a class="room-choice-submit" room="${roomId}">确定</a>
                    <br>
                    <div class="reason-selector">
                        <a class="room-choice-handler" room="${roomId}">放录像</a>
                        <a class="room-choice-handler" room="${roomId}">不理人</a>
                        <a class="room-choice-handler" room="${roomId}">没什么理由</a>
                        <a class="room-choice-handler" room="${roomId}" style="color: red;">清空</a>
                    </div>
                </div>
                `;

                    item.appendChild(p);

                    getReason(roomId).then((resolve) => {
                        if (resolve !== false) {

                            let inputer = document.getElementById('room-' + roomId + '-blocker-input');
                            let value = inputer.value;

                            inputer.value = resolve;

                            blockRoomById(roomId);
                        }
                    });
                }
            }
        }


        initHandler();
    };

    function consoleShowBlockList() {
        GM.listValues().then((resolve) => {
            console.log(resolve);
        });
    }

    function initHandler() {
        let handlers = document.getElementsByClassName('room-handler');
        for (let handler1 of handlers) {
            handler1.onclick = roomOnClick;
        }

        let choiceHandlers = document.getElementsByClassName('room-choice-handler');
        for (let handler2 of choiceHandlers) {
            handler2.onclick = choiceOnClick;
        }

        let submitHandlers = document.getElementsByClassName('room-choice-submit');
        for (let handler3 of submitHandlers) {
            handler3.onclick = submitOnClick;
        }

        let inputHandlers = document.getElementsByClassName('room-blocker-input');
        for (let handler4 of inputHandlers) {
            handler4.addEventListener('keyup', inputOnEvent);
        }
    };

    function roomOnClick(e) {
        let target = e.target;
        let roomId = target.getAttribute('room');
        let roomHandler = document.getElementById('room-' + roomId + '-blocker-handler');
        let inputer = document.getElementById('room-' + roomId + '-blocker-input');
        roomHandler.style.visibility = 'visible';
        inputer.removeAttribute('disabled');
    }

    function choiceOnClick(e) {
        let target = e.target;
        let roomId = target.getAttribute('room');
        let choice = e.target.text;

        let inputer = document.getElementById('room-' + roomId + '-blocker-input');
        let value = inputer.value;

        if (choice === '清空') {
            value = '';
        } else {
            if (value == '') {
                value = choice;
            } else {
                value += '_' + choice;
            }
        }

        inputer.value = value;
    }

    function inputOnEvent(e) {
        console.log(e);
        if (e.keyCode === 13) {
            let target = e.target;
            let roomId = target.getAttribute('room');
            let reason = document.getElementById('room-' + roomId + '-blocker-input').value;
            submit(roomId, reason);
        }
    }

    function submitOnClick(e) {
        let target = e.target;
        let roomId = target.getAttribute('room');
        let reason = document.getElementById('room-' + roomId + '-blocker-input').value;

        submit(roomId, reason);
    }

    function submit(roomId, reason) {
        if (reason != '') {
            blockRoomById(roomId);
            setReason(roomId, reason);
        } else {
            freeRoomById(roomId);
            setReason(roomId, false);
        }

        let roomHandler = document.getElementById('room-' + roomId + '-blocker-handler');
        let inputer = document.getElementById('room-' + roomId + '-blocker-input');
        roomHandler.style.visibility = 'hidden';
        inputer.setAttribute('disabled', true);
    }

    function blockRoomById(roomId) {
        let li = document.querySelector('li[room=\'' + roomId + '\']');
        let a = li.children[0];
        //a.removeAttribute('href');
        //a.style.opacity = 0.1;
    }

    function freeRoomById(roomId) {
        let li = document.querySelector('li[room=\'' + roomId + '\']');
        let a = li.children[0];
        a.setAttribute('href', '/' + roomId);
        a.style.opacity = null;
    }

    function getReason(roomId) {
        return GM.getValue(roomId, false);
    }

    function setReason(roomId, reason) {
        GM.setValue(roomId, reason);
    }

})();
