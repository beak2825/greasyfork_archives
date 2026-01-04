// ==UserScript==
// @name         站长工具去广告
// @namespace    a23187.cn
// @version      0.1.0
// @description  去掉站长工具【tool.chinaz.com】上的广告
// @author       A23187
// @match        http://tool.chinaz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424511/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424511/%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('topTxt').outerHTML = '';
    document.getElementById('navAfter').outerHTML = '';
    document.getElementById('centerTxt').outerHTML = '';
    document.getElementById('toolsIntro').outerHTML = '';
    document.getElementsByClassName('wrapper mt10')[0].outerHTML = '';
    document.getElementsByClassName('wrapper mt10')[0].outerHTML = '';
    document.getElementsByClassName('fr topTsCenter')[0].outerHTML = '';
})();