// ==UserScript==
// @name         Fotobus_and_transphoto_anti_new_design
// @description  New photos in one line, zoom in blocked
// @namespace    https://gist.github.com
// @version      0.1
// @author       Nikita Yushkov
// @match        https://fotobus.msk.ru/
// @match        http://fotobus.msk.ru/
// @match        https://transphoto.org/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422345/Fotobus_and_transphoto_anti_new_design.user.js
// @updateURL https://update.greasyfork.org/scripts/422345/Fotobus_and_transphoto_anti_new_design.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.insertAdjacentHTML('afterEnd','<style> #recent-photos>a, #random-photos>a { display: inline-block; position: relative; height: 100px; background-position: center; background-size: cover; box-shadow: 0 0 15px rgb(0 0 0 / 50%) inset; margin: 0 1px 1px 0;} #recent-photos { min-height: 100px !important; max-height: 303px; height: 100px; overflow-y: auto; resize: vertical;} </style>');
    new MutationObserver(() => {
        Array.from(document.getElementsByClassName('prw-animate')).forEach((e) => {e.classList.remove('prw-animate');});
    }).observe(document, { childList: true, subtree: true });
})();