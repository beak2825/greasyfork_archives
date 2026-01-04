// ==UserScript==
// @name         智慧树考试 破解右键屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  智慧树考试和作业页面现在屏蔽了右键和选择，不能选择后右键-搜索，此脚本就简单的破解右键屏蔽
// @author       wjn
// @match        http://exam.zhihuishu.com/onlineExam/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368603/%E6%99%BA%E6%85%A7%E6%A0%91%E8%80%83%E8%AF%95%20%E7%A0%B4%E8%A7%A3%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/368603/%E6%99%BA%E6%85%A7%E6%A0%91%E8%80%83%E8%AF%95%20%E7%A0%B4%E8%A7%A3%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector('.myschool_ewcon').onselectstart = null;
document.querySelector('.myschool_ewcon').oncontextmenu = null;
document.querySelector('.grayBg').onselectstart = null;
document.querySelector('.grayBg').oncontextmenu = null;
document.oncontextmenu = null;
document.onselectstart = null;
})();