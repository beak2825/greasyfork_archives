// ==UserScript==
// @name         电波小队懒得填学校
// @namespace    http://bilibili.23333333.com
// @version      0.1.1
// @description  小队长比我还懒！
// @author       You guess
// @match        http://www.bilibili.com/blackboard/network-diagnosis.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36695/%E7%94%B5%E6%B3%A2%E5%B0%8F%E9%98%9F%E6%87%92%E5%BE%97%E5%A1%AB%E5%AD%A6%E6%A0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/36695/%E7%94%B5%E6%B3%A2%E5%B0%8F%E9%98%9F%E6%87%92%E5%BE%97%E5%A1%AB%E5%AD%A6%E6%A0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        fillSchool(getSchool());
    };
    window.onclick = function(){
        recordSchool();
    };
    function getSchool(){
        return decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)tschool\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    }
    function recordSchool(){
        document.cookie = "tschool=" + encodeURIComponent(document.querySelector(".bilibili-network-diagnosis-school-name").value) + "; expires=" + new Date(0x7fffffff * 1e3);
    }
    function fillSchool(str){
        document.querySelector(".bilibili-network-diagnosis-school-name").value = str;
    }

})();
