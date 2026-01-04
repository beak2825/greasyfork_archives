// ==UserScript==
// @name         百度文库自动继续阅读
// @namespace    xyenon.bid
// @version      0.0.1
// @description  自动点击百度文库的「还剩 x 页未读，继续阅读」
// @author       XYenon
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406020/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/406020/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const moreBtn = document.getElementsByClassName("moreBtn")[0];
    moreBtn.click();
})();