// ==UserScript==
// @name            arXiv enhanced
// @name:en         arXiv enhanced
// @namespace       http://tampermonkey.net/
// @version         1.1.0
// @description:en  Automatically adds ar5iv and alphaXiv links to arXiv paper pages.
// @description:ja  arXiv論文ページにar5iv及びalphaXivリンクを自動追加します。
// @author          sho9029
// @match           https://arxiv.org/abs/*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @license         MIT
// @description Automatically adds ar5iv and alphaXiv links to arXiv paper pages.
// @downloadURL https://update.greasyfork.org/scripts/502847/arXiv%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/502847/arXiv%20enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ul = document.querySelector("#abs-outer > div.extra-services > div.full-text > ul");
    const li1 = document.createElement("li");
    const a1 = document.createElement("a");
    a1.href = window.location.href.replace("arxiv", "ar5iv");
    a1.textContent = "HTML (ar5iv)";
    li1.appendChild(a1);
    const li2 = document.createElement("li");
    const a2 = document.createElement("a");
    a2.href = window.location.href.replace("arxiv", "alphaxiv");
    a2.textContent = "alphaXiv";
    li2.appendChild(a2);

    ul.insertBefore(li1, ul.children[3]);
    ul.insertBefore(li2, ul.children[4]);
})();