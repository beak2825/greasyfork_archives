// ==UserScript==
// @name         新标签页打开链接
// @namespace    http://blog.studyxiao.cn
// @version      0.1
// @description  在查找文献的时候，发现有些网站搜索结果页直接当前页打开链接，故建立此脚本。
// @author       studyxiao
// @match        https://www.sciencedirect.com/*
// @icon         http://daohang.studyxiao.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/38273/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/38273/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function(base) {
    base.setAttribute("target","_blank");
    document.head.appendChild(base);
})(document.createElement("base"));