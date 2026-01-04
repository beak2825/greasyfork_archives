
// ==UserScript==
// @name         熊猫书签
// @description  zh-cn/
// @license      MIT
// @version      16
// @match        exhentai.org/*
// @grant        none
// @namespace https://loligit.github.io/panda/
// @downloadURL https://update.greasyfork.org/scripts/377670/%E7%86%8A%E7%8C%AB%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/377670/%E7%86%8A%E7%8C%AB%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==
(function(){
'use strict';
if(window.location.hostname=='exhentai.org'){var a=document.createElement('script');a.src='//panda.52linglong.com/panda.js?'+parseInt(Date.parse(new Date())/600000);document.body.appendChild(a);}
})();
