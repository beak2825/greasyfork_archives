// ==UserScript==
// @name         Fix Broken Paragraphs
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Merge seemingly incomplete paragraphs with the one to its next.
// @match        *://ranobes.top/*
// @match        *://ranobes.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ranobes.top
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520151/Fix%20Broken%20Paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/520151/Fix%20Broken%20Paragraphs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function ellipsize(s) {
        return s.substring(0, 24).trim().replace(/[^\w\s\d]+$/, "") + "...";
    }

    function log(text) {
        console.log(`Fix Broken Paragraphs: ${text}`);
    }

    function regex(re_list, opts) {
        return new RegExp(re_list.map(r => r.source).join(''), opts)
    }

    let section = document.querySelector(".story #arrticle");

    if (!section) {
        return;
    }

    let is_broken = false;
    let nodes = [];
    // `nodes` contain `p` and `#text` nodes.
    // Order of node matters.

    // Every ranobes chapter content section has a paragraph not in a `p` node but as a `#text` node.
    // As of 12-2024.
    section.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE || child.nodeName === 'P') {
            nodes.push(child);
        }
    })

    const properPragraphPattern = regex([
        /([?!.](|\s*?['"\)])$)|/, // If ends with `?`, `!`, or `.` — and, with optional qoute
        /([\*\>\-}\]…:;]$)|/, // Consider proper if ends with either
        /(\.{3,}$)/ // If ends with ellipsis
    ]);

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const text = node.textContent.trim();

        if (
            node &&
            // Consider those below this length as heading
            text.length > 32 &&
            !properPragraphPattern.test(text)
        ) {
            const nextNode = nodes[i + 1];

            if (nextNode) {
                log(`\`${ellipsize(node.textContent)}\` seems broken; merging with \`${ellipsize(nextNode.textContent)}\``);

                const nextText = nextNode.textContent.trim();
                node.textContent += ' ' + nextText.charAt(0).toLowerCase() + nextText.slice(1);
                nextNode.remove();
                nodes.splice(i + 1, 1);
                i--;

                is_broken = true;
            }
        }
    }

    if (!is_broken) {
        log("There's nothing to fix...");
    }
})();