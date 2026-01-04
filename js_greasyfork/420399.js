// ==UserScript==
// @name         Bangumi-Topic居中
// @namespace    mytreee@qq.com
// @version      0.2
// @description  Bangumi小组Topic页去除边栏，居中排版
// @author       Mytreee
// @match        *://bgm.tv/*/topic/*
// @match        *://bangumi.tv/*/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420399/Bangumi-Topic%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/420399/Bangumi-Topic%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //删除侧边栏columnInSubjectB
    var csB = document.getElementById("columnInSubjectB");
    csB.parentNode.removeChild(columnInSubjectB);

    //元素居中    //仅适配1920×1080；可自行更改数值
    var inner = document.querySelector('.column');
    inner.style.marginLeft = '140px';
    inner.style.marginRight = '150px';
})();