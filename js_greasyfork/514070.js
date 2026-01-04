// ==UserScript==
// @name         HeiseMinus - heise.de
// @namespace    lxtgb
// @version      2024-10-25
// @description  Alle HeisePlus-Artikel auf der Heise-Homepage ausblenden
// @author       lxtgb
// @match        https://www.heise.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514070/HeiseMinus%20-%20heisede.user.js
// @updateURL https://update.greasyfork.org/scripts/514070/HeiseMinus%20-%20heisede.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const articles=document.querySelectorAll('article')
    Array.from(articles)
        .filter(a=>a.querySelector('[data-component=TeaserHeadline] svg'))
        .forEach(a=>{
            a.style.display = 'none';
        })
})();
