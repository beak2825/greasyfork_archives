// ==UserScript==
// @name         更改telegraph的排版
// @namespace    http://tampermonkey.net/
// @version      0.11
// @license      MIT
// @description  telegraph不居中
// @author       You
// @match        *://telegra.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456434/%E6%9B%B4%E6%94%B9telegraph%E7%9A%84%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/456434/%E6%9B%B4%E6%94%B9telegraph%E7%9A%84%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function() {
        var obj = document.querySelectorAll("div,img");
        obj.forEach((item)=>{
            item.style.display="inline"
        })
   obj = document.querySelectorAll("figure");
        obj.forEach((item)=>{
            item.style.display="inline-block"
        })
try { document.getElementById("_report_popup").remove();}
catch(e) { console.log(e);}
})();