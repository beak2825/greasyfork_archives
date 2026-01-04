// ==UserScript==
// @name         disableshuiying
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉超星水印
// @author       You
// @match        *://mooc1.chaoxing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457494/disableshuiying.user.js
// @updateURL https://update.greasyfork.org/scripts/457494/disableshuiying.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        var shuiying=document.getElementsByClassName("mask_div")
        for (var i=0;i<shuiying.length;i++){
            shuiying[i].style.display="none"
            //shuiying[i].style.color="#FFF"
        }
}


})();