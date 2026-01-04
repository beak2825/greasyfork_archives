// ==UserScript==
// @name         51VOA 字体增大
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        *://www.51voa.com/*
// @grant        none
// @run-at       document-end
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/370632/51VOA%20%E5%AD%97%E4%BD%93%E5%A2%9E%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/370632/51VOA%20%E5%AD%97%E4%BD%93%E5%A2%9E%E5%A4%A7.meta.js
// ==/UserScript==

(function() {

    document.getElementsByClassName("content")[0].className ="contentx";
    var a=document.getElementsByClassName("contentx")[0]
    a.style.fontSize="20px";
    a.style.fontFamily="arial";
    a.style.color="black";




})();