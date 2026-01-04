// ==UserScript==
// @name         ChatGPT Auto-Continue
// @description  Auto click the "Continue generating" button.
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       bigfatsea
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466507/ChatGPT%20Auto-Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/466507/ChatGPT%20Auto-Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('ChatGPT Auto-Continue is running...')

    var auto_continue = function(){
        var buttons = document.querySelectorAll('button.btn-neutral');
        for (var i=buttons.length-1; i>=0; i--){
            if (buttons[i].innerText =='Continue generating') {
                setTimeout(function(){
                    buttons[i].click();
                },800);
                break;
            }
        }
    }

    setInterval(auto_continue,800);
})();