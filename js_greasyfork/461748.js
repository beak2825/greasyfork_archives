// ==UserScript==
// @name             显示防盗链图片 for Feedly
// @name:en          Display anti-hotlinking images For Feedly
// @version          0.1
// @namespace        https://github.com/SimonZhongl/UserScripts
// @description      通过强制全站不发送 referrer， 实现显示防盗链图片
// @description:en   Display anti-hotlinking images, for forced not send a referrer.
// @match          http*://feedly.com/*
// @icon             http://www.feedly.com/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/461748/%E6%98%BE%E7%A4%BA%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87%20for%20Feedly.user.js
// @updateURL https://update.greasyfork.org/scripts/461748/%E6%98%BE%E7%A4%BA%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87%20for%20Feedly.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.name = "referrer";
meta.content = "no-referrer";
document.getElementsByTagName('head')[0].appendChild(meta);
