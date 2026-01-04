// ==UserScript==
// @name         知乎去除header
// @namespace    zhihu-remove-header
// @description  知乎样式修改，去掉问题页的header通栏
// @version      1.0
// @author       huhan_y@163.com
// @match        *://www.zhihu.com/question/*
// @downloadURL https://update.greasyfork.org/scripts/411359/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4header.user.js
// @updateURL https://update.greasyfork.org/scripts/411359/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4header.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('header').style = 'display:none;'
    document.querySelector('.Question-sideColumn.Question-sideColumn--sticky').style = 'display:none;'
    document.querySelector('.Question-mainColumn').style = 'width:1000px;'
})();