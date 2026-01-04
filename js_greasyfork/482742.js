// ==UserScript==
// @name         【ECUST】世界百流大学Alist报错解决
// @namespace    https://alist.世界百流大学.com
// @version      0.1
// @description  当自动答题脚本和百流大学CourseShare冲突时自动刷新网页
// @author       Eric
// @match        https://alist.xn--rhqr3ykwbm05aegjqxb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482742/%E3%80%90ECUST%E3%80%91%E4%B8%96%E7%95%8C%E7%99%BE%E6%B5%81%E5%A4%A7%E5%AD%A6Alist%E6%8A%A5%E9%94%99%E8%A7%A3%E5%86%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/482742/%E3%80%90ECUST%E3%80%91%E4%B8%96%E7%95%8C%E7%99%BE%E6%B5%81%E5%A4%A7%E5%AD%A6Alist%E6%8A%A5%E9%94%99%E8%A7%A3%E5%86%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function findAndRefreshOnError() {
        const errorMessage = "System error: SyntaxError: Invalid regular expression: /?/gm: Nothing to repeat";
        if (document.body.textContent.includes(errorMessage)) {
            //window.location.assign(window.location.href);
            location.reload();
        }
    }
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                findAndRefreshOnError();
            }
        }
    });
    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);
    findAndRefreshOnError();
})();