// ==UserScript==
// @name         重庆大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.81
// @description  try to take over the world!
// @author       You
// @match        http://202.202.0.180/*
// @match        http://10.10.12.51/*
// @match        http://202.202.0.163/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381563/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/381563/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    window.onload = () =>{
    'use strict';
        document.querySelector("input[type='submit']").click();
       
    }
})();