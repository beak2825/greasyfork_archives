// ==UserScript==
// @name         小说适配器
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  try to take over the world!
// @author       You
// @match        https://www.kdzw.cc/*
// @match        https://www.8czw.com/8837/*
// @match        https://www.mayiwxw.com/*
// @match        https://www.linovel.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469947/%E5%B0%8F%E8%AF%B4%E9%80%82%E9%85%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469947/%E5%B0%8F%E8%AF%B4%E9%80%82%E9%85%8D%E5%99%A8.meta.js
// ==/UserScript==
//轻之文库
if(window.location.href.indexOf("https://www.linovel.net")>-1){
(function() {
    'use strict';
    var o = document.getElementsByClassName("l");
    for(var i=0;i<o.length;i++){
        var a = document.getElementsByClassName("l")[i];
        a.setAttribute("style","font-size: 40px;background-color:#c9e0cb;line-height: 1.5;margin-top:65px;text-indent: 2em;");
   }
    //o.setAttribute("style","font-size: 45px;background-color:#c9e0cb;width:90%;line-height: 1.5;");
    var b = document.getElementsByClassName("read-content")[0];
    b.setAttribute("style","background-color:#c9e0cb;font-family:SimHei;width: 1024px;");
    var c = document.getElementsByClassName("read read_show read-white")[0];
    c.setAttribute("style","background-color:#e0eee1;");
    var d = document.getElementsByClassName("article-content")[0];
    d.setAttribute("style","width: 850px;");
  //  document.getElementsById('content').setAttribute("style","font-size: 40px;");
    // Your code here...
})();
}
if(window.location.href.indexOf("https://www.kdzw.cc")>-1){
(function() {
  //  'use strict';
    alert("Wellcome");
    var o = document.getElementById("content");
    o.setAttribute("style","font-size: 40px;background-color:#c9e0cb;");
    var a = document.getElementsByTagName("body")[0];
    a.setAttribute("style","background-color:#c9e0cb;");
    // Your code here...
})();
}
    //getElementById()
    //getElementsByTagName()
    //getElementsByClassName()