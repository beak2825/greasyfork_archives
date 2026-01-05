// ==UserScript==
// @name         [购物必备]自动勾选京东配送/仅显示有货/货到付款
// @description  方便在京东购物,免去点击的麻烦!
// @version      0.40
// @author       JaneCC
// @license      MIT
// @match        https://search.jd.com/*
// @match        https://list.jd.com/*
// @grant        none
// @run-at       document-body
// @namespace 	 https://JaneCC.com
// @downloadURL https://update.greasyfork.org/scripts/29220/%5B%E8%B4%AD%E7%89%A9%E5%BF%85%E5%A4%87%5D%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81%E4%BB%85%E6%98%BE%E7%A4%BA%E6%9C%89%E8%B4%A7%E8%B4%A7%E5%88%B0%E4%BB%98%E6%AC%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/29220/%5B%E8%B4%AD%E7%89%A9%E5%BF%85%E5%A4%87%5D%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E4%BA%AC%E4%B8%9C%E9%85%8D%E9%80%81%E4%BB%85%E6%98%BE%E7%A4%BA%E6%9C%89%E8%B4%A7%E8%B4%A7%E5%88%B0%E4%BB%98%E6%AC%BE.meta.js
// ==/UserScript==

if(!/wtype=1/.test(window.location.href)) window.location.href = window.location.href + '&wtype=1';
if(!/cod=1/.test(window.location.href)) window.location.href = window.location.href + '&cod=1';
if(!/stock=1/.test(window.location.href)) window.location.href = window.location.href + '&stock=1';