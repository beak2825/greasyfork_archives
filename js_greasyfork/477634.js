// ==UserScript==
// @name         Цокольный этаж - загрузка книг
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes all buttons on the search page linkable, allowing you to open them in bulk, e.g. with MMB
// @author       y7o4ka
// @match        https://searchfloor.org/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=searchfloor.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477634/%D0%A6%D0%BE%D0%BA%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6%20-%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BA%D0%BD%D0%B8%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/477634/%D0%A6%D0%BE%D0%BA%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D1%8D%D1%82%D0%B0%D0%B6%20-%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BA%D0%BD%D0%B8%D0%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('[class*="download-btn"]').forEach(el => {
        var newA = document.createElement("a");
        newA.href = el.dataset.url;
        newA.style.color = 'inherit';
        newA.style.textDecoration = 'inherit';
        while(el.hasChildNodes()) {
            newA.appendChild(el.firstChild);
        }
        el.appendChild(newA);
    });
})();