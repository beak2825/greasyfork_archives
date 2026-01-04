// ==UserScript==
// @name         chatgpt prompt input focus
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  shortcut to focus on input area on chatgpt page
// @author       You
// @match        https://chat.openai.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476740/chatgpt%20prompt%20input%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/476740/chatgpt%20prompt%20input%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // make sure content is loaded
    window.addEventListener('load', function() {
        // custom the queryselector here
        const a=document.querySelector('#prompt-textarea');

        let is_focused = false;
        a.onfocus = (e)=>{
            is_focused = true
        }
        a.onblur = (e)=>{
            is_focused = false
        }

        // custom your key stroke here
        document.addEventListener("keypress",(e) => {
            if (e.key=='/' && !is_focused) {
                e.preventDefault();
                a.focus()
            }
        })
    })
})();