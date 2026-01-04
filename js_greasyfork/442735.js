// ==UserScript==
// @name         自动答题进入
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动进入答题
// @author       Coolstuz
// @match        https://www.dianmoyun.com/Course/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dianmoyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442735/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%BF%9B%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442735/%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%BF%9B%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('xxxxxxxxx');

var k=0;
for(var a=0;a<document.getElementsByClassName("zlx").length;a++){
    var app=document.getElementsByClassName("khzy")[0].getElementsByTagName("td")[k+7].innerText;
    if(app<'60'){
        document.getElementsByClassName("zlx")[a].getElementsByTagName("a")[0].click()
    }
    k=k+5;

}
    // Your code here...
})();