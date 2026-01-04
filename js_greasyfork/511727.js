// ==UserScript==
// @name         Convert All URLs in Mail to Hyperlinks
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Convert all plain text URLs inside tables to hyperlinks, preserving URL characters
// @author       Prozyk
// @match        https://www.lordswm.com/sms*
// @match        https://www.heroeswm.ru/sms*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511727/Convert%20All%20URLs%20in%20Mail%20to%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/511727/Convert%20All%20URLs%20in%20Mail%20to%20Hyperlinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function linkifyTextNodes(node) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
//         alert(urlPattern)

        let textNode;
        const nodesToReplace = [];

        // Collect all text nodes that match the pattern
        while (textNode = walker.nextNode()) {
            if (textNode.nodeValue.match(urlPattern)) {
                nodesToReplace.push(textNode);
            }
        }

        // Replace collected text nodes with links
        nodesToReplace.forEach(textNode => {
            const span = document.createElement('span');
            const escapedUrl = textNode.nodeValue.replace(/&/g, '&amp;'); // Preserve & symbol in URLs
            span.innerHTML = escapedUrl.replace(urlPattern, (url) => `<a href="${url}" target="_blank">${url}</a>`);
            textNode.parentNode.replaceChild(span, textNode);
        });
    }

    function convertLinksInTable() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            linkifyTextNodes(table);
        });
    }

    convertLinksInTable();
})();
