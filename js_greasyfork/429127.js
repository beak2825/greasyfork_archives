// ==UserScript==
// @name         给java官方文档title加锚点链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给java 官方文档title加链接，以便分享
// @author       yongfa365 https://www.github.com/yongfa365/
// @match        https://docs.oracle.com/javase/*
// @icon         https://docs.oracle.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429127/%E7%BB%99java%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3title%E5%8A%A0%E9%94%9A%E7%82%B9%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429127/%E7%BB%99java%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3title%E5%8A%A0%E9%94%9A%E7%82%B9%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".title >a").forEach(p=>{p.innerText="§";p.href="#"+p.name})
})();