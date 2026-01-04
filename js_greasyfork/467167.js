// ==UserScript==
// @name         LZTTypingNickChanger
// @namespace    MeloniuM/LZT
// @version      1.3
// @description  Позволяет изменить никнейм
// @author       MeloniuM
// @license MIT
// @match        *://zelenka.guru/conversations/*
// @match        *://lzt.market/conversations/*
// @match        *://lolz.guru/conversations/*
// @match        *://lolz.live/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467167/LZTTypingNickChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/467167/LZTTypingNickChanger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = document.createElement('a')
    a.innerHTML = '<i class="fa fa-id-card " aria-hidden="true">'
    a.style.marginLeft = "10px"
    let controls = document.querySelector("div.conversation-controls")
    if (controls){
        controls.appendChild(a)
    }
    a.addEventListener('click', function(){
      //  XenForo.alert('<input class="LZTTypingNickChanger" type="text" value="'+ Im.username +'">', 'LZTTypingNickChanger')
        let nick = prompt('Введите желаемый ник:')
        if(nick != null){
            localStorage.setItem('LZTTypingNick', nick)
            Im.username = nick
        }
    })
    Im.Start.prototype.sendUserIsTypingMessage = function () {
        var data = {
            'do': 'typing_message',
            'username': localStorage.getItem('LZTTypingNick') || Im.username,
            'conversation_id': Im.conversationId,
            'user_id': XenForo.visitor.user_id
        };

        Im.Start.prototype.sendRequest(JSON.stringify(data));
    }
})();