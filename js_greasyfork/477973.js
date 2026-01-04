// ==UserScript==
// @name         Cancelence
// @namespace    https://atcoder.jp
// @version      0.1
// @description  AtCoderのコンテストのカスタムCSSを無効化します
// @author       Yukkku
// @match        https://atcoder.jp/contests/*/*
// @icon         https://atcoder.jp/favicon.ico
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477973/Cancelence.user.js
// @updateURL https://update.greasyfork.org/scripts/477973/Cancelence.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const d = ()=>{
        const v = document.querySelector('head>style:first-of-type');
        if (v) {
            v.innerHTML = '';
            observer.disconnect();
        }
    };
    d();
    const observer = new MutationObserver(d);
    observer.observe(document.documentElement ,{ attributes: true, childList: true, subtree: true });
    addEventListener('DOMContentLoaded', () => {
        observer.disconnect();
    });
})();
