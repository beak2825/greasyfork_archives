// ==UserScript==
// @name         不要翻译代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       doublethink
// @match        *
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405719/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/405719/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // Your code here...
    const notranslate = (node) => void node.classList.add('notranslate')
    ;[...document.querySelectorAll('pre')].forEach(notranslate)
})()