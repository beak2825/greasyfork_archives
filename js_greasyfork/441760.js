// ==UserScript==
// @name         Twitcasting Ctrl+Enter
// @namespace    https://twitter.com/yoigara3
// @version      1.0
// @description  It enable to send comment with ctrl + enter
// @author       yoigara3
// @match        https://twitcasting.tv/*
// @exclude      https://twitcasting.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitcasting.tv
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/441760/Twitcasting%20Ctrl%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/441760/Twitcasting%20Ctrl%2BEnter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const area = document.getElementsByClassName('tw-textarea')[0];
    const button = document.getElementsByClassName('tw-button-primary')[0];
    if(!area || !button) return;
    const send = () => {
        button.click();
    }
    const handleEvent = (e) => {
        if(e.code=='Enter' && e.ctrlKey && area.value!==''){
            send();
        }
    }
    document.addEventListener("keydown",handleEvent);
})();