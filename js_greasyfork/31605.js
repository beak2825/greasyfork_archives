// ==UserScript==
// @name            Kinopoisk removing
// @namespace       FIX
// @version         0.1
// @description     Удаление фоновой рекламы на кинопоиске
// @author          raletag
// @copyright       2017, raletag
// @include         *://kinopoisk.ru/*
// @include         *://www.kinopoisk.ru/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/31605/Kinopoisk%20removing.user.js
// @updateURL https://update.greasyfork.org/scripts/31605/Kinopoisk%20removing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var MO = window.MutationObserver;
    if (!MO) {
        alert('"Kinopoisk removing" не поддерживается в данном браузере!');
        return;
    }
    var o = new MO(function (ms){
        ms.forEach(function (m) {
                m.addedNodes.forEach(function (n) {
                    if (n.nodeType === Node.ELEMENT_NODE && n.id == 'branding-style') {
                        console.log('Kinopoisk removing');
                        n.innerHTML = '';
                        o.disconnect();
                        var style = document.createElement("style");
                        style.innerHTML='#top_form, #top .png_block, #top .menu  {top: 10px!important;} .shadow {top: -200px;}';
                        (document.head||document.body||document.documentElement||document).appendChild(style);
                    }
                });
            });
    });
    o.observe(document, {childList: true, subtree: true});
})();
