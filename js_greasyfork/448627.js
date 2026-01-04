// ==UserScript==
// @name         n typer (For broken keyboards)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces a specified key input with another key for when you have a broken key.
// @author       Wantitled
// @match        https://www.wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448627/n%20typer%20%28For%20broken%20keyboards%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448627/n%20typer%20%28For%20broken%20keyboards%29.meta.js
// ==/UserScript==

const keyToReplace = ",";
const keyToType = "n";

(function() {
    'use strict';
    const input = document.querySelector('input');
    input.addEventListener('input', (event) => {
        if (event.data === keyToReplace){
            input.value = input.value.slice(0,input.value.length - 1) + keyToType;
        }
    })
})();