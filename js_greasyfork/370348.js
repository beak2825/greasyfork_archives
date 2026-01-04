// ==UserScript==
// @name         douban auto-link
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  auto link for douban
// @author       yetone
// @match        https://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370348/douban%20auto-link.user.js
// @updateURL https://update.greasyfork.org/scripts/370348/douban%20auto-link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    replace(document);

    document.querySelectorAll('.full-content').forEach(x => {
        x.addEventListener('DOMSubtreeModified', e => replace(e.target));
    });

    function replace(ele) {
        ele.querySelectorAll('p, blockquote, span, .short-content, .review-content').forEach(p => {
            let nodes = [];
            let need = false;
            p.childNodes.forEach(x => {
                if (x.nodeType !== 3) {
                    nodes.push(x);
                    return;
                }
                let text = x.textContent;
                let lastIdx = 0;
                text.replace(/《.+?》|「.+?」|『.+?』/g, (c, idx, t) => {
                    need = true;
                    nodes.push(new Text(t.substring(lastIdx, idx + 1)));
                    lastIdx = idx + c.length - 1;
                    let a = document.createElement('a');
                    let cc = t.substring(idx + 1, idx + c.length - 1);
                    a.href = `https://www.douban.com/search?q=${encodeURIComponent(cc)}`;
                    a.target = '_blank';
                    a.innerText = cc;
                    nodes.push(a);
                });
                nodes.push(new Text(text.substring(lastIdx)));
            });
            if (need) {
                while (p.childNodes.length > 0) {
                    p.childNodes.forEach(x => {
                        p.removeChild(x);
                    });
                }
                nodes.forEach(x => {
                    p.appendChild(x);
                });
            }
        });
    }
})();