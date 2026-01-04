// ==UserScript==
// @name         github新版宽屏适配
// @namespace    https://github.com/githubWide
// @version      0.2
// @description  将新版Github的主页进行宽屏适配优化
// @author       JimHan
// @license      GPL-3.0
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465598/github%E6%96%B0%E7%89%88%E5%AE%BD%E5%B1%8F%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/465598/github%E6%96%B0%E7%89%88%E5%AE%BD%E5%B1%8F%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName("feed-content")[0].style.maxWidth="unset";
    document.getElementsByClassName("d-flex flex-auto flex-column feed-main")[0].style.maxWidth="unset";
    document.getElementsByClassName("feed-right-sidebar mb-5 border-bottom")[0].style.maxWidth="unset";
    console.log("已宽屏适配")


})();