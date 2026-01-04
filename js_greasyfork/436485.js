// ==UserScript==
// @name   摸鱼派聊天室
// @namespace    https://lemon-cxh.github.io/
// @version      1.19
// @description  摸鱼派聊天室，防撤回、自动清屏、一言,设置网页图标和标题
// @author       Lemon
// @match        https://fishpi.cn/cr
// @match        https://fishpi.cn
// @icon         https://www.google.com/s2/favicons?domain=pwl.icu
// @connect      v1.hitokoto.cn
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436485/%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/436485/%E6%91%B8%E9%B1%BC%E6%B4%BE%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const URL = 'https://fishpi.cn';
    const CHAT_URL = URL + '/cr';
    const HITOKOTO_URL = 'https://v1.hitokoto.cn/?c=e&c=f&c=j';

    const REVOKE_ID = 'revokeCheckbox';
    var revokeEnable = false;

    const MESSAGE_MAX = 60;
    var messageCount = 0;

    function setTitleAndIcon() {
        document.querySelector('head link[rel*="icon"]').href = 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196';
        document.querySelector('head title').innerText = 'Questionst - Stack Overflow';
    }


    function webSocketHook() {
        unsafeWindow.WebSocket = new Proxy(unsafeWindow.WebSocket, {
            construct(target, args) {
                let obj = new target(...args);
                return new Proxy(obj, proxyHandler);
            }
        })
    };

    function addMenu() {
        document.onreadystatechange = function(){
            if(document.readyState == 'complete'){
                let e = document.getElementById('redPacketBtn').parentNode.children[3];
                // 防撤回
                let revoke = document.createElement("button");
                revoke.setAttribute('style', 'margin-right: 6px');
                revoke.innerHTML = '<input id="' + REVOKE_ID + '" type="checkbox"/><span>防撤回</span>';
                e.insertBefore(revoke, e.firstChild);
                document.getElementById(REVOKE_ID).addEventListener( 'change', function() {
                    revokeEnable = this.checked;
                });

                // 一言
                e = document.getElementById('breezemoonInput').parentNode;
                let hitokoto = document.createElement("button");
                hitokoto.innerHTML = '一言';
                hitokoto.setAttribute('class', 'green');
                e.insertBefore(hitokoto, e.lastChild.nextSibling);
                hitokoto.onclick = () => sendHitokoto();
            }
        }
    }

    let proxyHandler = {
        get(target, property) {
            let value = target[property]
            if ((typeof value) === 'function') {
                value = value.bind(target)
            }
            return value
        },
        set(target, property, value) {
            if (property === 'onmessage') {
                let realOnMessage = value;
                value = function(event) {
                    analyzeMessage(event, realOnMessage);
                }
            }
            target[property] = value
            return value
        }
    };

    //  解析消息
    function analyzeMessage(event, realOnMessage) {
        var o = JSON.parse(event.data);
        chatWsHandler(o) && realOnMessage(event);
    };


    function chatWsHandler(data) {
        switch (data.type) {
            case 'revoke':
                if (revokeEnable) {
                    preventRevoke(data.oId);
                    return false;
                }
                break;
            case 'msg':
                messageCount++;
                clearChatRoom();
                return true;
                break;
            default:
                return true;
        }
    }

    function sendGameMsg(msg) {
        let e = document.getElementsByClassName('ice-chat-input')[0]
        e.value = msg
        unsafeWindow.ChatRoom.sendIceMsg()
        e.value = ''
    }

    //   清屏
    function clearChatRoom() {
        if (messageCount > MESSAGE_MAX) {
            document.getElementById('chats').innerHTML='';
            unsafeWindow.page = 0;
            unsafeWindow.ChatRoom.more();
            messageCount = 0;
        }
    }

    //  防撤回
    function preventRevoke(oId) {
        let source = document.getElementById('chatroom' + oId);
        if (!source) {
            return;
        }
        let href = source.firstElementChild.getAttribute('href');
        let child = document.createElement("div");
        child.setAttribute('style', 'color: rgb(50 50 50);margin-bottom: 10px;text-align: center;');
        child.innerHTML = '<span><a href="' + href + '" target="_blank">' + href.substring(8) + '</a>想要撤回消息</span>';
        source.parentNode.insertBefore(child, source);
        messageCount--;
    }



    //  发送一言
    function sendHitokoto() {
        GM_xmlhttpRequest({
            method: "GET",
            url: HITOKOTO_URL,
            onload: function(response){
                if (response.status === 200) {
                    let o = JSON.parse(response.response);
                    document.getElementById('breezemoonInput').value = o.hitokoto;
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }


    setTitleAndIcon()
    if (CHAT_URL === window.location.href) {
        webSocketHook();
        addMenu();
    } else {
        window.onload = () => {
            unsafeWindow.Util.closeAlert()
        }
    }
})();