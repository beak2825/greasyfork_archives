// ==UserScript==
// @name         this this many
// @namespace    http://tampermonkey.net/
// @version      2025-08-24
// @description  thiiiis many
// @license      WTFPL
// @author       winfy
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546809/this%20this%20many.user.js
// @updateURL https://update.greasyfork.org/scripts/546809/this%20this%20many.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chance = 0.3;
    const renames = [
        [/many/g, mkIs("th@is many")],
        [/Many/g, mkIs("Th@is Many")],
        [/MANY/g, mkIs("TH@iS MANY")]
    ];

    function mkIs(str) {
        return match => str.replace(/@(.)/g, (_, c) => Math.random() < chance ? new Array(1 + Math.random() * 10 | 0).fill(c).join("") : c);
    }

    function subst(text) {
        for (const [p, sub] of renames) {
            text = text.replace(p, match => Math.random() < chance ? sub instanceof Function ? sub.apply(this, arguments) : sub : match);
        }
        return text;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
        node.data = subst(node.data);
    }
})();