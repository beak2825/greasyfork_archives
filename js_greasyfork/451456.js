// ==UserScript==
// @name         关闭知乎登录框
// @namespace    Close the login box
// @version      1.0
// @description   关闭知乎页面登录框，特别是适合手机端浏览器
// @run-at       document-start
// @match        *.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451456/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/451456/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==
(function(){ window.onload = document.querySelector('.Modal-closeButton')?.click(); })();