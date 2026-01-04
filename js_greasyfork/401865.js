// ==UserScript==
// @name         Google Translate Remove Line break
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Line break
// @author       miniJoy
// @match        https://translate.google.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401865/Google%20Translate%20Remove%20Line%20break.user.js
// @updateURL https://update.greasyfork.org/scripts/401865/Google%20Translate%20Remove%20Line%20break.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 粘贴的时候移除换行符
    var input = document.querySelector("#source")
    input.addEventListener('paste', (event) => {
        event.preventDefault();
        input.value = (event.clipboardData || window.clipboardData).getData('text');
        input.value = input.value.replace(/\n/g,"");
    });
})();