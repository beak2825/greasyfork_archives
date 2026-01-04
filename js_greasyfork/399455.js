// ==UserScript==
// @name         去除btbtt广告
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       dogcraft
// @match        https://btbtt.us/
// @include        *//*btbtt*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399455/%E5%8E%BB%E9%99%A4btbtt%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/399455/%E5%8E%BB%E9%99%A4btbtt%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dog1=document.getElementsByClassName("width imgs_1");
    document.body.removeChild(dog1[0]);
    //dog1[0].innerHTML='';
    var dog2=document.getElementsByClassName("width");
    dog2[1].innerHTML='';
    document.body.style.backgroundImage='';
    var yy=document.getElementById("wrapper_left_bg");
    document.body.removeChild(yy);
    var zz=document.getElementById("wrapper_right_bg");
    document.body.removeChild(zz);
    // Your code here...
})();