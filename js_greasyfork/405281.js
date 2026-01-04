// ==UserScript==
// @name         還原艦船名稱
// @namespace    https://greasyfork.org/zh-TW/scripts/405281-%E9%82%84%E5%8E%9F%E8%89%A6%E8%88%B9%E5%90%8D%E7%A8%B1
// @version      0.52
// @description  自動替換所有連結名稱
// @author       x94fujo6
// @match        https://wiki.biligame.com/blhx/*
// @match        http://wiki.biligame.com/blhx/*
// @downloadURL https://update.greasyfork.org/scripts/405281/%E9%82%84%E5%8E%9F%E8%89%A6%E8%88%B9%E5%90%8D%E7%A8%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/405281/%E9%82%84%E5%8E%9F%E8%89%A6%E8%88%B9%E5%90%8D%E7%A8%B1.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    window.onload=()=>{
        document.querySelectorAll(".af,.nowrap").forEach((Element)=>{
            if(Element.parentNode && Element.parentNode.title)Element.textContent=Element.parentNode.title;
        })
    }
})();