// ==UserScript==
// @name         无限次下载音乐
// @namespace    sdzbzjh
// @version      0.1
// @description  gequdaquan无限次下载音乐
// @author       You
// @match        http://www.gequdaquan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406676/%E6%97%A0%E9%99%90%E6%AC%A1%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/406676/%E6%97%A0%E9%99%90%E6%AC%A1%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        localStorage.setItem('authDownNumN',JSON.stringify({"data":0,"time":new Date().getTime()}));
        console.log(localStorage.getItem('authDownNumN'));
    },5000)
})();