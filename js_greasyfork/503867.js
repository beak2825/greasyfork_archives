// ==UserScript==
// @name               琉璃神社(hacg.me)_缓解多域名间来回跳转
// @name:en_US         HACG(hacg.me)_Multi-Domain Switching Reduction
// @description        缓解 https://www.hacg.me/wp/bbs/postid/48650 提出得多域名跳转问题。
// @version            2.0.3
// @author             璃末Li3nd
// @namespace          https://gitlab.com/LiuliPack
// @match              *://*.hacg.*/*
// @match              *://*.liuli.*/*
// @match              *://*.llss.*/*
// @match              *://*.h2024.*/*
// @exclude            *://hacg.uno/*
// @license            WTFPL
// @contributionURL    https://b23.tv/BV1ME411r78W
// @icon               https://www.hacg.me/favicon.ico
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/503867/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%28hacgme%29_%E7%BC%93%E8%A7%A3%E5%A4%9A%E5%9F%9F%E5%90%8D%E9%97%B4%E6%9D%A5%E5%9B%9E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503867/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%28hacgme%29_%E7%BC%93%E8%A7%A3%E5%A4%9A%E5%9F%9F%E5%90%8D%E9%97%B4%E6%9D%A5%E5%9B%9E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const probe = new MutationObserver(() => {
        document.querySelectorAll('a:not(.probed, #post-63117 .entry-content a').forEach(ele => {
            if(/^https?:\/\/((www|cdn)\.)?(hacg|liuli|llss|h2024)\.*/.test(ele.href)) {
                ele.href = new URL(ele.href).pathname;
                ele.classList.add('probed')
            }
        })
    })

    probe.observe(document.body, { childList: true, subtree: true })


})();