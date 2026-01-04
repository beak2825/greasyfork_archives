// ==UserScript==
// @name         YearsBack
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Fork of my previous script for emojis. Script changes 202X years for 201X.
// @author       huberatelier
// @match        *://*/*
// @icon         https://github.com/huberatelier/huberatelierThemes/blob/main/YearsBack/clock3.png?raw=true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516703/YearsBack.user.js
// @updateURL https://update.greasyfork.org/scripts/516703/YearsBack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const years = {
        '2010': '2010',
        '2011': '2011',
        '2012': '2012',
        '2013': '2013',
        '2014': '2014',
        '2015': '2015',
        '2016': '2016',
    };

    const emojiregex = new RegExp(Object.keys(years).join('|'), 'g');

    function replacetext(node) {
        const original = node.nodeValue;
        const replaced = original.replace(emojiregex, match => years[match]);
        if (replaced !== original) {
            node.nodeValue = replaced;
        }
    }

    function replaceall() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];

        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        nodes.forEach(replacetext);
    }

    window.addEventListener('load', replaceall);

    const observer = new MutationObserver(() => {
        clearTimeout(observer.timeout);
        observer.timeout = setTimeout(replaceall, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
