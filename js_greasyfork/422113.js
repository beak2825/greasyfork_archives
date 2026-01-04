// ==UserScript==
// @name         jojodl解除搜索限制
// @namespace    Tampermonkey for FireFox
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jojodl.pw/*
// @match        https://jojodl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422113/jojodl%E8%A7%A3%E9%99%A4%E6%90%9C%E7%B4%A2%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422113/jojodl%E8%A7%A3%E9%99%A4%E6%90%9C%E7%B4%A2%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {    
'use strict';    
//alert("ABC");    
var im;    
var bt;    
bt=document.getElementsByClassName("btn btn-secondary my-sm-0");    
im=document.getElementsByClassName("form-control mr-sm-2");    
im[1].disabled=false;    
bt[0].disabled=false;    
// Your code here...
})();