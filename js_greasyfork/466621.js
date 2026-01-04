// ==UserScript==
// @name         LZTConversationsAddBotton
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет кнопку создания чата(беседы) в панель личных сообщений
// @author       MeloniuM
// @license MIT
// @match        *://zelenka.guru/conversations/*
// @match        *://lzt.market/conversations/*
// @match        *://lolz.guru/conversations/*
// @match        *://lolz.live/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466621/LZTConversationsAddBotton.user.js
// @updateURL https://update.greasyfork.org/scripts/466621/LZTConversationsAddBotton.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let a = document.createElement('a')
    a.href = "conversations/add"
    a.innerHTML = '<i class="fa fa-plus conversationControl" aria-hidden="true">'
    a.style.marginLeft = "10px"
    let controls = document.querySelector("div.conversation-controls")
    if (controls){
        controls.appendChild(a)
    }
})();