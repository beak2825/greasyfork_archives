// ==UserScript==
// @name         电影天堂dytt auto show
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  电影天堂自动展开下载列表
// @match        https://www.dytt8899.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dytt8899.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531241/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82dytt%20auto%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/531241/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82dytt%20auto%20show.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //show the download list
    const nodes = document.querySelector("#downlist");
    nodes.style.display = 'contents';
})();