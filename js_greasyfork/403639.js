// ==UserScript==
// @name        B站动态部分隐藏
// @namespace   http://tampermonkey.net/
// @description Bilibili关注的动态列表，隐藏指定内容
// @include     https://t.bilibili.com/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/403639/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%83%A8%E5%88%86%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403639/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%83%A8%E5%88%86%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

console.log("hello new");

function getElementsByClassName(n) {
var classElements = [],allElements = document.getElementsByTagName('*');
for (var i=0; i< allElements.length; i++ )
{
if (allElements[i].className == n ) {
classElements[classElements.length] = allElements[i];
}
}
return classElements;
}

var classEle = getElementsByClassName("card");
console.log(classEle);
