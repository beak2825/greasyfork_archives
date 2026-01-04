// ==UserScript==
// @name         Forum Manjaro Fixed!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bug report: https://forum.manjaro.org/t/remove-that-pesky-penguin/8399
// @author       You
// @match        https://forum.manjaro.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409686/Forum%20Manjaro%20Fixed%21.user.js
// @updateURL https://update.greasyfork.org/scripts/409686/Forum%20Manjaro%20Fixed%21.meta.js
// ==/UserScript==

(function() {
    let style = document.createElement("style");
    style.innerHTML = ".first-box{display: none !important} .custom-footer .second-box .links{justify-content: space-between;}";
    document.body.appendChild(style);
})();