// ==UserScript==
// @name         adblock helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  simple "adblock detected" remover
// @description:pt-BR simple "adblock detected" remover
// @description:ar simple "adblock detected" remover
// @description:bg simple "adblock detected" remover
// @description:cs simple "adblock detected" remover
// @description:da simple "adblock detected" remover
// @description:de simple "adblock detected" remover
// @description:el simple "adblock detected" remover
// @description:eo simple "adblock detected" remover
// @description:es simple "adblock detected" remover
// @description:fi simple "adblock detected" remover
// @description:fr simple "adblock detected" remover
// @description:fr-CA simple "adblock detected" remover
// @description:he simple "adblock detected" remover
// @description:hu simple "adblock detected" remover
// @description:id simple "adblock detected" remover
// @description:it simple "adblock detected" remover
// @description:ja simple "adblock detected" remover
// @description:ko simple "adblock detected" remover
// @description:nb simple "adblock detected" remover
// @description:nl simple "adblock detected" remover
// @description:pl simple "adblock detected" remover
// @description:ro simple "adblock detected" remover
// @description:ru simple "adblock detected" remover
// @description:sk simple "adblock detected" remover
// @description:sr simple "adblock detected" remover
// @description:sv simple "adblock detected" remover
// @description:th simple "adblock detected" remover
// @description:tr simple "adblock detected" remover
// @description:uk simple "adblock detected" remover
// @description:ug simple "adblock detected" remover
// @description:vi simple "adblock detected" remover
// @description:zh-CN simple "adblock detected" remover
// @description:zh-TW simple "adblock detected" remover
// @author       fienestar
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503519/adblock%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/503519/adblock%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function update(){
        const style = document.body.style;
        if(style.overflow === 'hidden')
            style.overflow = '';
    }

    new MutationObserver(update).observe(document.body, { attributes: true });
    update();

    const style = document.createElement('style');
    style.innerHTML = `div.fc-ab-root[class="fc-ab-root"]{
    display: none !important;
}`
    document.head.append(style);
})();
