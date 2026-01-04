// ==UserScript==
// @name         bd网盘高速下载（仅分享文件）
// @namespace    http://github.web-page.workers.dev/
// @version      0.1
// @description  自动将pan.baidu.com转为pan.kdbaidu.com, 接口为Kinhdown提供
// @author       自由飞翔
// @match        *://pan.baidu.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433345/bd%E7%BD%91%E7%9B%98%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%BB%85%E5%88%86%E4%BA%AB%E6%96%87%E4%BB%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/433345/bd%E7%BD%91%E7%9B%98%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%BB%85%E5%88%86%E4%BA%AB%E6%96%87%E4%BB%B6%EF%BC%89.meta.js
// ==/UserScript==

window.location.hostname = "pan.kdbaidu.com";