// ==UserScript==
// @name         bttv smile copy
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  copy smile from chat on twitch 
// @author       Pudge3115
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429741/bttv%20smile%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/429741/bttv%20smile%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //chat-line__message--emote
    document.addEventListener("click", (event) => {
        if(event.target.classList.contains("chat-line__message--emote")){
            var el = document.createElement('textarea');
            el.value = event.target.getAttribute("alt");
            console.log(el.value);
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    });
})();