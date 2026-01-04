// ==UserScript==
// @name        url.cn 自动跳转
// @description 在遇到“如需浏览，请长按网址复制后使用浏览器访问”时，获取页面中的网址并自动跳转
// @namespace   RainSlide
// @author      RainSlide
// @version     1.0
// @match       http://url.cn/*
// @grant       none
// @inject-into context
// @run-at      document-end
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/412942/urlcn%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412942/urlcn%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

"use strict";

( link => link !== null && location.assign(link.textContent) )
( document.querySelector('.link') );
