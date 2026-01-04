// ==UserScript==
// @name         MCBBS-中度简洁版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本删除了一些不常用的功能，并简化了部分功能
// @author       You
// @match        https://www.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407989/MCBBS-%E4%B8%AD%E5%BA%A6%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/407989/MCBBS-%E4%B8%AD%E5%BA%A6%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var removeObj = document.querySelectorAll("div[class='y']");
    for(var i =0;i<removeObj.length;i++){removeObj[i].parentNode.removeChild(removeObj[i]);}

    // Your code here...
})();