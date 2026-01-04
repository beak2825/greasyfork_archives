// ==UserScript==
// @name 资源索引1
// @namespace Tampermonkey for Chrome
// @version 0.1
// @description try to take over the world!
// @author You
// @match https://jojodl.pw/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/420468/%E8%B5%84%E6%BA%90%E7%B4%A2%E5%BC%951.user.js
// @updateURL https://update.greasyfork.org/scripts/420468/%E8%B5%84%E6%BA%90%E7%B4%A2%E5%BC%951.meta.js
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

