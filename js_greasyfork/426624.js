// ==UserScript==
// @name         Meduza.io foreign agent banner remove
// @name:ru      Meduza.io удаление баннера об иностранном агенте
// @namespace    https://meduza.io/
// @version      0.3
// @description  Removes foreign agent banner from Meduza news site
// @description:ru  Удаляет баннер об иностранном агенте из новостей Meduza
// @author       konclave
// @match        https://meduza.io/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/426624/Meduzaio%20foreign%20agent%20banner%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/426624/Meduzaio%20foreign%20agent%20banner%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var resizeObserver = new ResizeObserver(function() {
        var banner = document.querySelector('#div-gpt-ad');
        if (banner) {
            banner.parentNode.removeChild(banner);
        }
    });
    resizeObserver.observe(document.querySelector('body'));
})();