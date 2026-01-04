// ==UserScript==
// @name         删除b站动态的红点
// @namespace    DuckBurnIncense
// @version      0.0.5
// @description  有时候删都删不掉的,看着烦
// @author       DuckBurnIncense
// @match        *://t.bilibili.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435896/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%8A%A8%E6%80%81%E7%9A%84%E7%BA%A2%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/435896/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%8A%A8%E6%80%81%E7%9A%84%E7%BA%A2%E7%82%B9.meta.js
// ==/UserScript==

var classObj;
var i;
setTimeout(function()
{
    i = 0;
    classObj = document.getElementsByClassName("red-dot");
    for(i=0;i<classObj.length;i++)
    {
        classObj[i].setAttribute("class","");
    }
},10000);
console.log("Del " + i + " Red-dot Success!");
