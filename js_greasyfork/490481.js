// ==UserScript==
// @name:ru        Эвадес Блокер Рекламы
// @name         Evades Ad Remover/Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes ads from evades.online and evades.io
// @author       Alertix
// @match        *://evades.online/*
// @match        *://evades.io/*
// @grant        none
// @description:ru        Убирает рекламу из evades.online и evades.io
// @license      @license
// @downloadURL https://update.greasyfork.org/scripts/490481/Evades%20Ad%20RemoverBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/490481/Evades%20Ad%20RemoverBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var adStyles = `
    /* Removes ad/убирает рекламу */
    .header-ad {
        opacity: 0 !important;
        height: 90px !important;
        text-align: center !important;
        margin: 0 auto !important;
    }

    .left-ad {
        opacity: 0 !important;
        float: left !important;
    }

    .right-ad {
        opacity: 0 !important;
        float: right !important;
    }

    .box-ad {
        opacity: 0 !important;
        float: right !important;
        position: relative !important;
        left: -50% !important;
        transform: translate(165%) !important;
    }
    `;

    function addGlobalStyle(css) {
        var head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(adStyles);
})();