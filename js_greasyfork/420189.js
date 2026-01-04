// ==UserScript==
// @name         蔷薇花园-禁止赌博
// @name:en      IIROSE - NoGamblings
// @namespace    ckylin-script-iirose-nogamble
// @version      0.1
// @description  屏蔽机器人赌博消息！
// @description:en  Block the message of gamblings from AIs!
// @author       CKylinMC
// @match        https://iirose.com/messages.html
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420189/%E8%94%B7%E8%96%87%E8%8A%B1%E5%9B%AD-%E7%A6%81%E6%AD%A2%E8%B5%8C%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/420189/%E8%94%B7%E8%96%87%E8%8A%B1%E5%9B%AD-%E7%A6%81%E6%AD%A2%E8%B5%8C%E5%8D%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onSocketMessage(event) {
        setTimeout(() => {
            let msgs = document.querySelectorAll("div.msg");
            if (msgs.length > 0) [...msgs].forEach((msg, index) => {
                let senderDom = msg.querySelector("div.PubChatUserInfo");
                if (!senderDom) return;
                if (!["艾泽", "艾瑞", "艾莉", "艾薇", "艾洛", "艾瑟", "艾花", "艾A", "艾B", "上杉夏乡", "上杉夏香", "logos"].includes(senderDom.firstElementChild.innerText.trim())) return;
                let msgcontent = msg.querySelector("div.roomChatContentBox");
                if (!msgcontent) return;
                if (msgcontent.innerText.indexOf("押注") != -1
                    && msgcontent.innerText.indexOf("总金")!=-1
                ) {
                    let newNode = msg.cloneNode(true);
                    msg.style.display = none;
                    let chatcontainer = newNode.querySelector("div.roomChatContentBox");
                    if (!chatcontainer) return;
                    chatcontainer.innerHTML = "";
                    let notifyDiv = document.createElement("div");
                    notifyDiv.classList.add("chatContentHolder");
                    notifyDiv.innerText = "🚫 此消息已因 '禁止赌博' 而移除。";
                    chatcontainer.appendChild(notifyDiv);
                    msg.parentElement.insertBefore(newNode, msg);
                }
            });
        }, 100);
    }

    function registerHook() {
        console.log("Try hook socket");
        let socket;
        let win = unsafeWindow;
        if (win.mainFrame) win = win.mainFrame.contentWindow;
        if (socket = win.socket) {
            socket.addEventListener("message", e => onSocketMessage(e));
            console.log("Socket hooked");
            return true;
        } else return false;
    }
    function tryHook() {
        if(!registerHook())
            setTimeout(() => {
                tryHook();
            }, 200);
    }
    tryHook();
})();