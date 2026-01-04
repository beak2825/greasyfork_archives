// ==UserScript==
// @name         NGA搜索框飘回来
// @namespace    https://live.bilibili.com/7115892
// @version      0.1
// @description  如题
// @author       Windy
// @match        https://bbs.nga.cn/*
// @match        https://nga.178.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410991/NGA%E6%90%9C%E7%B4%A2%E6%A1%86%E9%A3%98%E5%9B%9E%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/410991/NGA%E6%90%9C%E7%B4%A2%E6%A1%86%E9%A3%98%E5%9B%9E%E6%9D%A5.meta.js
// ==/UserScript==

document.getElementsByTagName('input')[0].addEventListener("click", function(){
    document.getElementsByClassName(' single_ttip2')[0].style.right='0px';
})