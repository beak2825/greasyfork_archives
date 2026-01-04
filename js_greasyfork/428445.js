// ==UserScript==
// @name         Auto comment NimoTv
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Comment nimotv interval
// @author       Duclh
// @match        https://www.nimo.tv/ngansatthu
// @icon         https://www.google.com/s2/favicons?domain=nimo.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428445/Auto%20comment%20NimoTv.user.js
// @updateURL https://update.greasyfork.org/scripts/428445/Auto%20comment%20NimoTv.meta.js
// ==/UserScript==


var chatInputElem = "nimo-chat-box__input"
var sendButtonElem = "nimo-chat-box__send-btn"

var sendButton = ""
var chatbox = ""

//let commentMode = 1

var comments = [
    "Donate cho chị Hai tại đây nha: https://vrstudio.vn/nst"
]
//var commentIdx = 0

var everySec = 1000 * 60 // Số sau số 1000 là giây

var checkExist = setInterval(function() {
    console.log("Tik")
    if (document.getElementsByClassName(chatInputElem)) {
        chatbox = document.getElementsByClassName(chatInputElem)[0]
        chatbox.value = comments[0];
    }

     if (document.getElementsByClassName(sendButtonElem)) {
        sendButton = document.getElementsByClassName(sendButtonElem)[0]
        sendButton.click()
    }

}, everySec);