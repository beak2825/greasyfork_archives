// ==UserScript==
// @name         显示洛谷用户个人主页
// @namespace    https://www.allenyou.wang
// @version      2024-03-05
// @license      GPLv3
// @description  显示洛谷用户个人主页中的介绍部分
// @author       Allenyou
// @match        https://www.luogu.com.cn/user/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489051/%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/489051/%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".introduction").style.display="block";
})();