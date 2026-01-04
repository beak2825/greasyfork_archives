// ==UserScript==
// @name         知识产权与大数据实验室文章阅读优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无干扰阅读
// @author       HaoKJ
// @match        https://wp.recgroup.cn/?p=*
// @grant        none
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491135/%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E4%B8%8E%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%AE%9E%E9%AA%8C%E5%AE%A4%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491135/%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E4%B8%8E%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%AE%9E%E9%AA%8C%E5%AE%A4%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
'use strict';
document.querySelector("#main-header").style.display="none";
document.querySelector("#secondary").style.display="none";

})();