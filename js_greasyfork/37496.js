// ==UserScript==
// @name         龙谷手机题库显答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.shoujitiku.net/*
// @match        *://10.99.108.43:81/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37496/%E9%BE%99%E8%B0%B7%E6%89%8B%E6%9C%BA%E9%A2%98%E5%BA%93%E6%98%BE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/37496/%E9%BE%99%E8%B0%B7%E6%89%8B%E6%9C%BA%E9%A2%98%E5%BA%93%E6%98%BE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

function display(){
    document.getElementById("stdaan").style.display = "block";
}
var t1 = window.setInterval(display,500);