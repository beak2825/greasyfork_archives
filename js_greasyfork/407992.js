// ==UserScript==
// @name         MCBBS-删除广告
// @namespace    http://tampermonkey.net/
// @version       1.1
// @description  此脚本删除了MCBBS右上角的广告
// @author       You
// @match        https://www.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407992/MCBBS-%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/407992/MCBBS-%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var removeObj = document.querySelectorAll("div[class='y']");
    removeObj[1].parentNode.removeChild(removeObj[1]);
    removeObj[removeObj.length - 1].parentNode.removeChild(removeObj[removeObj.length - 1]);

    // Your code here...
})();