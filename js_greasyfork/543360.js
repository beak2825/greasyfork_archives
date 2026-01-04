// ==UserScript==
// @name         xd2shuffle
// @namespace    http://tampermonkey.net/
// @version      7.7.7.7
// @description  no
// @author       fusi | @loficat on tg | codedfusi on github
// @match        *://*.shuffle.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543360/xd2shuffle.user.js
// @updateURL https://update.greasyfork.org/scripts/543360/xd2shuffle.meta.js
// ==/UserScript==

(function () {
    const x = new Set();
    const y = new Set();

    function z(n) {
        if (n.nodeType === 3 && n.nodeValue && n.nodeValue.includes("ARS")) {
            n.nodeValue = n.nodeValue.replace(/ARS/g, "$");
            x.add(n);
        }
    }

    function q(el) {
        if (el.nodeType === 1 && el.hasAttribute("src")) {
            const v = el.getAttribute("src");
            if (v.includes("/icons/fiat/ARS.svg")) {
                el.setAttribute("src", v.replace("/icons/fiat/ARS.svg", "/icons/fiat/USD.svg"));
                y.add(el);
            }
        }
    }

    function w(root) {
        if (!root) root = document.body;
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while ((n = tw.nextNode())) {
            z(n);
        }
        const imgs = root.querySelectorAll('[src*="/icons/fiat/ARS.svg"]');
        for (let i = 0; i < imgs.length; i++) q(imgs[i]);
    }

    function r() {
        for (const n of x) {
            if (n.nodeValue && n.nodeValue.includes("ARS")) {
                n.nodeValue = n.nodeValue.replace(/ARS/g, "$");
            }
        }
        for (const e of y) {
            const s = e.getAttribute("src");
            if (s && s.includes("/icons/fiat/ARS.svg")) {
                e.setAttribute("src", s.replace("/icons/fiat/ARS.svg", "/icons/fiat/USD.svg"));
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        w();

        new MutationObserver(function (m) {
            for (let i = 0; i < m.length; i++) {
                const a = m[i].addedNodes;
                for (let j = 0; j < a.length; j++) {
                    const k = a[j];
                    if (k.nodeType === 1) w(k);
                    else if (k.nodeType === 3) z(k);
                }
            }
            r();
        }).observe(document.body, { childList: true, subtree: true });

        setInterval(r, 500);
    });
})();
