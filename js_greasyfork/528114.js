// ==UserScript==
// @name         Alternate Case Text
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Converts all text on a webpage to "a CaSe LiKe ThIs".
// @author       LiyahMackenzie
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528114/Alternate%20Case%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/528114/Alternate%20Case%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toWeirdCase(text) {
        return text.split(" ").map(word =>
            word.split("").map((char, index) =>
                index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
            ).join("")
        ).join(" ");
    }

    function modifyTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            node.nodeValue = toWeirdCase(node.nodeValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(modifyTextNodes);
        }
    }

    modifyTextNodes(document.body);
})();