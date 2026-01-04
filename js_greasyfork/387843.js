// ==UserScript==
// @name         remove bilibili unable-reprint
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://www.bilibili.com/read/*
// @run-at          document-idle
// @include      *://www.bilibili.com/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387843/remove%20bilibili%20unable-reprint.user.js
// @updateURL https://update.greasyfork.org/scripts/387843/remove%20bilibili%20unable-reprint.meta.js
// ==/UserScript==

(function() {
    'use strict';
var holder=document.getElementsByClassName(`article-holder`);
    console.log(holder.length);
    if(holder.length===0){
    return;
    }
  // console.log(holder[0].className);
    //holder[0].className = "";
    setTimeout(function(){ holder=document.getElementsByClassName(`article-holder`);holder[0].className = "article-holder"; }, 300);
    //holder[0].className = "article-holder";
   // console.log(holder[0].className);
    return;
    // Your code here...
})();