// ==UserScript==
// @name         Qidian fix
// @namespace    http://tampermonkey.net/
// @version      2024-08-13
// @description  Make qidian great again
// @author       SomeTestUser1243312
// @match        https://www.qidian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503567/Qidian%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/503567/Qidian%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const html = document.documentElement;

    html.classList.remove("notranslate");
    html.removeAttribute("translate");
    document.documentElement.querySelector("head meta[name='google']").remove();

    document.addEventListener('contextmenu', (e => e.stopPropagation()), true);
})();