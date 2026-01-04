// ==UserScript==
// @name         Github: Add more links to nav.
// @namespace    https://greasyfork.org/zh-CN/scripts/397263
// @version      0.5.0
// @description  Add profile link to nav bar.
// @author       Al Cheung
// @match        *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397263/Github%3A%20Add%20more%20links%20to%20nav.user.js
// @updateURL https://update.greasyfork.org/scripts/397263/Github%3A%20Add%20more%20links%20to%20nav.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = document.querySelector.bind(document);

    function appendLink(url, text) {
        const a = document.createElement(`a`);
        a.className = `js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15`;
        a.innerText = text;
        a.href = url;
        const headerList = $(`nav.d-flex`);
        headerList.appendChild(a);
    }

    const userName = $(`details > summary > img`).alt.replace(`@`, '');

    appendLink(`//github.com/${userName}?tab=stars`, `My Stars`);
    appendLink(`//github.com/${userName}`, `My Profile`);
})();
