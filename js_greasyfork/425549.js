// ==UserScript==
// @name         火狐新标签页跳转
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  火狐新标签页跳转特定网址
// @author       廖文杰
// @match        *://newtab.firefoxchina.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425549/%E7%81%AB%E7%8B%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425549/%E7%81%AB%E7%8B%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.body.innerHTML="";
var iframe = document.createElement('iframe');
iframe.src="https://nt.kdcc.cn/";
iframe.id="nt";
iframe.scrolling="no";
iframe.frameBorder="0";
document.body.appendChild(iframe);
var nt = document.getElementById('nt');
nt.style.height = '100%';
nt.style.width = '100%';
nt.style.position = 'absolute';
nt.style.left="0%";
nt.style.top="0%";
nt.style.zIndex="999999";
   /* alert(url);*/
})();