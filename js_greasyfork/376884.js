// ==UserScript==
// @name             显示防盗链图片 for Inoreader
// @name:en          Display anti-hotlinking images For Inoreader
// @version          0.1
// @namespace        https://github.com/maboloshi/UserScripts/
// @description      通过强制全站不发送 referrer， 实现显示防盗链图片
// @description:en   Display anti-hotlinking images, for forced not send a referrer.
// @include          http*://*.inoreader.com/*
// @icon             http://www.inoreader.com/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/376884/%E6%98%BE%E7%A4%BA%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87%20for%20Inoreader.user.js
// @updateURL https://update.greasyfork.org/scripts/376884/%E6%98%BE%E7%A4%BA%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87%20for%20Inoreader.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.name = "referrer";
meta.content = "no-referrer";
document.getElementsByTagName('head')[0].appendChild(meta);