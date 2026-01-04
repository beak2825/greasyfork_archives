// ==UserScript==
// @name         将webgoat7.1的学习进度全部展示并点亮
// @namespace    github.zuowb.io
// @version      0.1
// @description  first_try
// @author       Joven
// @match        127.0.0.1:8080/WebGoat/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446443/%E5%B0%86webgoat71%E7%9A%84%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E5%85%A8%E9%83%A8%E5%B1%95%E7%A4%BA%E5%B9%B6%E7%82%B9%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446443/%E5%B0%86webgoat71%E7%9A%84%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E5%85%A8%E9%83%A8%E5%B1%95%E7%A4%BA%E5%B9%B6%E7%82%B9%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
  setTimeout(Display,5000);
function Display(){

   var node_1 = document.getElementById("Introduction");
    var span_1 = node_1.querySelector("li").querySelector("span");

   var parent = node_1.parentNode.parentNode.childNodes;
   for(var i=0;i<parent.length;i++){
       parent[i].lastChild.style.display='block';
       var li_1 = parent[i].lastChild.childNodes;
       for(var j=0;j<li_1.length;j++){
           if(li_1[j].lastChild.tagName!="span"){
           var span_2 = span_1.cloneNode(true)
           li_1[j].appendChild(span_2)
           }

               }
   }
}


})();