// ==UserScript==
// @name         sukeibei.nyaa小图变大图
// @namespace    undefined
// @version      0.0.2
// @description  如果还是小图是因为大图还在下载，下载完后会变成大图
// @author       maybreath
// @match        http://sukebei.nyaa.se/*
// @match        https://sukebei.nyaa.se/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29201/sukeibeinyaa%E5%B0%8F%E5%9B%BE%E5%8F%98%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/29201/sukeibeinyaa%E5%B0%8F%E5%9B%BE%E5%8F%98%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
/* 针对常见图床 */
'use strict';

//针对small替换big
var reg = new RegExp('/upload/small/.*/'); 
//针对去掉small-
var reg2 = new RegExp('uploads/small-'); 
//针对去掉_thumb
var reg3 = new RegExp('_thumb'); 


var images = document.querySelectorAll('img'); 
var i, image; 
for (i = 0; i < images.length; i += 1) { 
image = images[i]; 
if (image.src.match(reg)) { 
image.src = image.src.replace('small', 'big'); 
} 
  
if (image.src.match(reg2)) { 
image.src = image.src.replace('small-', ''); 
} 

  if (image.src.match(reg3)) { 
image.src = image.src.replace('_thumb', ''); 
} 
  
} 

//去掉侧边
document.getElementById("main").children[1].innerHTML= "";

//宽屏显示
document.getElementById("main").style.width='100%';