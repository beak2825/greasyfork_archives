// ==UserScript==
// @name 熊猫书签
// @namespace https://sleazyfork.org/zh-CN/scripts/458296
// @description  exhentai.org自动登录
// @version 114514
// @match *://exhentai.org/*
// @icon https://s2.loli.net/2023/01/15/StTudH3WO4meVyw.jpg
// @grant none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/458296/%E7%86%8A%E7%8C%AB%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458296/%E7%86%8A%E7%8C%AB%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

(function(){function panda_init(c){if(c>=3){return;};let n=['https://expanda.now.sh/','https://ghcdn.rawgit.org/noprogramming/expanda/master/','https://noprogramming.github.io/expanda/'];let t=setTimeout(function(){clearTimeout(t);panda_init(c+1);},3000);let s=document.createElement('script');s.src=(n[c]?n[c]:n[0])+'panda.js?'+parseInt(Date.parse(new Date())/600000)+c;s.onerror=function(){clearTimeout(t);panda_init(c+1);};s.onload=function(){clearTimeout(t);};s.setAttribute('exkey','3c5b0d72139de14c7661bb931008005b6914514x56baaf183');document.body.appendChild(s);};panda_init(0);}());