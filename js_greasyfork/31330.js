// ==UserScript==
// @name         17玩吧免登录看贴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yungs
// @match        http*://www.17wanba.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31330/17%E7%8E%A9%E5%90%A7%E5%85%8D%E7%99%BB%E5%BD%95%E7%9C%8B%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/31330/17%E7%8E%A9%E5%90%A7%E5%85%8D%E7%99%BB%E5%BD%95%E7%9C%8B%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload=RemoveAD();
    function RemoveAD()
    {
        var v = document.getElementById("s-loginbar-Login");
        var p = v.parentElement;
        p.removeChild(v);
    }
})();