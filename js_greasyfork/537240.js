// ==UserScript==
// @name         Torn Messages Profile Linker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       fourzees [3002874]
// @description  Turns every “[XID]” in Torn messages into profile links on load and thread change
// @match        https://www.torn.com/messages.php*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537240/Torn%20Messages%20Profile%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/537240/Torn%20Messages%20Profile%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // non-global test regex
    const TEST_RE = /\[([0-9]+)\]/;
    // global match regex (we reset lastIndex inside linkifyNode)
    const MATCH_RE = /\[([0-9]+)\]/g;

    // Replace all “[12345]” in a single TEXT_NODE
    function linkifyNode(textNode) {
        const txt = textNode.nodeValue;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        MATCH_RE.lastIndex = 0;
        while ((m = MATCH_RE.exec(txt)) !== null) {
            if (m.index > last) {
                frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
            }
            const xid = m[1];
            const a = document.createElement('a');
            a.href = `https://www.torn.com/profiles.php?XID=${xid}`;
            a.textContent = `[${xid}]`;
            a.target = '_blank';
            frag.appendChild(a);
            last = MATCH_RE.lastIndex;
        }
        if (last < txt.length) {
            frag.appendChild(document.createTextNode(txt.slice(last)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
    }

    // Walk root, collect any TEXT_NODE with “[digits]”, then linkify
    function linkifyAll(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (node.parentNode.nodeName === 'A') return NodeFilter.FILTER_SKIP;
                    return TEST_RE.test(node.nodeValue)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            }
        );
        const nodes = [];
        let node;
        while ((node = walker.nextNode())) {
            nodes.push(node);
        }
        for (const n of nodes) linkifyNode(n);
    }

    // Do a full pass
    function doLinkify() {
        linkifyAll(document.body);
    }

    // Initial runs (to catch slow-loading content on refresh)
    setTimeout(doLinkify, 500);
    setTimeout(doLinkify, 1500);

    // Rerun when you switch threads
    window.addEventListener('hashchange', () => {
        setTimeout(doLinkify, 300);
    });
})();