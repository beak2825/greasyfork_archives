// ==UserScript==
// @name         德州专业技术人员继续教育跳过答题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  继续教育跳过答题，安心学习
// @author       追梦
// @match        *://*.yxlearning.com/*
// @grant        none
// @license      追梦
// @downloadURL https://update.greasyfork.org/scripts/464941/%E5%BE%B7%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%B7%B3%E8%BF%87%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/464941/%E5%BE%B7%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%B7%B3%E8%BF%87%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    clearInterval(myTimer);
    function enterCourse() {
        var a = document.getElementsByTagName("BUTTON");
            for (var i = 0; i < a.length; i++) {
                if(a[i].innerHTML=="跳过"){
                    a[i].click();
                }
            }
    }
    var myTimer = setInterval(enterCourse, 3000);
})();