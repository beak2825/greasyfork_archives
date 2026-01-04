// ==UserScript==
// @name         Javbus
// @namespace    hlw
// @version      0.4
// @description  去广告，快速加载
// @author       Linker
// @match       *://www.javbus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377536/Javbus.user.js
// @updateURL https://update.greasyfork.org/scripts/377536/Javbus.meta.js
// ==/UserScript==

(function() {
    'use strict';
      //window.onload = function(){
         var class1 = document.getElementsByClassName("ad-box");
         var class2 = document.getElementsByClassName("col-xs-12 col-md-4 text-center ptb10");

         var reg = /\bgenre\b/i;
        let len =  class1.length
        let len2 = class2.length
        for(let i = 0;i < len;i++)
        {
            class1[0].remove()
        }
        for(let i = 0;i <len2;i++)
        {
            class2[0].remove()
            console.log(class2)
        }
		




     // }
    // Your code here...
})();