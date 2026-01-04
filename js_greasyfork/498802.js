// ==UserScript==
// @name         FC2 跳轉連結
// @namespace    none
// @description  Convert FC2 article codes into clickable links
// @version      1.2
// @author       Hitenlxy
// @license      MIT
// @match        https://sukebei.nyaa.si/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498802/FC2%20%E8%B7%B3%E8%BD%89%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/498802/FC2%20%E8%B7%B3%E8%BD%89%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createClickableLinks() {
        // This regex matches multiple formats of FC2-PPV codes
        const regex = /(?:FC2[\s-]?PPV[\s-]?(\d+))/gi;
        const bodyText = document.body.innerHTML;
        let modifiedText = bodyText;
        const matches = [...bodyText.matchAll(regex)];

        matches.forEach(match => {
            const code = match[1];
            const url = `https://adult.contents.fc2.com/article/${code}/`;
            const link = `<a href="${url}" target="_blank" style="font-size: larger; font-weight: bold;">${match[0]}</a>`;
            modifiedText = modifiedText.replace(match[0], link);
        });

        if (modifiedText !== bodyText) {
            document.body.innerHTML = modifiedText;
        }
    }

    window.addEventListener('load', createClickableLinks);
})();
