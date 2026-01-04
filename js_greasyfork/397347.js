// ==UserScript==
// @name       复制道客巴巴（火狐可用，谷歌不可用） - doc88.com
// @namespace   Violentmonkey Scripts doc88
// @match       *://www.doc88.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 2020/3/5 上午9:02:22
// @downloadURL https://update.greasyfork.org/scripts/397347/%E5%A4%8D%E5%88%B6%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%EF%BC%88%E7%81%AB%E7%8B%90%E5%8F%AF%E7%94%A8%EF%BC%8C%E8%B0%B7%E6%AD%8C%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%89%20-%20doc88com.user.js
// @updateURL https://update.greasyfork.org/scripts/397347/%E5%A4%8D%E5%88%B6%E9%81%93%E5%AE%A2%E5%B7%B4%E5%B7%B4%EF%BC%88%E7%81%AB%E7%8B%90%E5%8F%AF%E7%94%A8%EF%BC%8C%E8%B0%B7%E6%AD%8C%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%89%20-%20doc88com.meta.js
// ==/UserScript==

$(document).ready(function () {    
    var btn05 = $("<input type='button' id='wzmBtn'  value='显示当前页'   style='height:50px;font-size: 14px; position: fixed;  left: 00px;  top: 300px;z-index:65536'>");
    $("body").append(btn05);
    document.getElementById("wzmBtn").addEventListener("click", function () {
        showtext();
    });
});


function showtext() {
    var canName = "page_" + document.getElementById("pageNumInput").value;
    var canvas = document.getElementById(canName);
    var dataUrl = canvas.toDataURL();   
    window.open(dataUrl, "toDataURL() image");
}