// ==UserScript==
// @name         BossAutoReply
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages automatically after right click.
// @author       You
// @match        https://www.zhipin.com/web/geek/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445063/BossAutoReply.user.js
// @updateURL https://update.greasyfork.org/scripts/445063/BossAutoReply.meta.js
// ==/UserScript==
var i = 1;
(function() {
    'use strict';
    console.log("======");
    console.log("start checking messages");
    sendMessages();
})();

function checkMessage() {
    var messages = document.getElementsByClassName("notice-badge");
    console.log("fetched messages");
    console.log(messages);
    // let item of messages
    for (let i = 0; i < 3; i++){
        console.log(i);
        let item = messages[i];
        console.log("start fetching item");
        console.log(item);
        if(item.textContent > 0) {
            setTimeout(reply, 5000, item);
        }
    }
}

function reply(it){
    it.click();
    let messageTextTotal = document.getElementsByClassName("message-text");
    let messageTextNumber = messageTextTotal.length;
    if (messageTextNumber < 3){
        document.getElementsByClassName("btn-emotion tooltip tooltip-top")[0].click();
        document.getElementsByClassName("emoj emoj-1")[1].click();
        document.getElementsByClassName("chat-input")[0].textContent="你好";
        document.getElementsByClassName("btn btn-primary btn-send")[0].click();
        document.getElementsByClassName("btn btn-primary btn-sure")[1].click();
        console.log("message sent.");
    }
}

function sendMessages() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        document.getElementsByClassName("btn-emotion tooltip tooltip-top")[0].click();
        document.getElementsByClassName("emoj emoj-1")[1].click();
        document.getElementsByClassName("chat-input")[0].textContent= "现在有点事，留个电话吧，我方便联系你，谢谢。";
        document.getElementsByClassName("btn btn-primary btn-send")[0].click();
        document.getElementsByClassName("btn btn-primary btn-sure")[1].click();
        console.log("message sent.");
    }, false);
}