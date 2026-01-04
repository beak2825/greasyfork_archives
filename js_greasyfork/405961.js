// ==UserScript==
// @name         去除SG陪玩广告
// @namespace    remove ad
// @version      1.0
// @description  去除SG论坛页面陪玩广告
// @author       shag
// @match        https://bbs.sgamer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405961/%E5%8E%BB%E9%99%A4SG%E9%99%AA%E7%8E%A9%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405961/%E5%8E%BB%E9%99%A4SG%E9%99%AA%E7%8E%A9%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var reg = /play.daidaidj.com/i;
    var list = document.getElementsByTagName("a");
    for(var i = 0;i<list.length;i++){
        var dom = list[i];
        if (reg.test(dom.getAttribute("href"))) dom.parentNode.removeChild(dom);
    }
})();