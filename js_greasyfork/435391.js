// ==UserScript==
// @name         泥巴影院解除分享限制
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  泥巴影院解除分享限制，去廣告
// @author       Bjdanny
// @match        *://*.nbyy.tv/*
// @match        *://*.nbys1.tv/*
// @match        https://www.mudvod.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435391/%E6%B3%A5%E5%B7%B4%E5%BD%B1%E9%99%A2%E8%A7%A3%E9%99%A4%E5%88%86%E4%BA%AB%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435391/%E6%B3%A5%E5%B7%B4%E5%BD%B1%E9%99%A2%E8%A7%A3%E9%99%A4%E5%88%86%E4%BA%AB%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
setTimeout(()=>{document.querySelector("#hotarea").style.display='none'; document.querySelector(".sharethis-sticky-share-buttons").style.display='none'; },2000);}catch(e){};
document.getElementById("bg_cover").remove();
document.getElementsByClassName("qy-header-warn-alert")[0].style.display="none";
document.querySelector("#ad1").remove();
document.querySelector("#adltop").remove();
})();
