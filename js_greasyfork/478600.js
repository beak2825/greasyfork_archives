// ==UserScript==
// @name         解除 displayspecifications 复制限制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the copy restriction on displayspecifications.com, 解除 displayspecifications 复制限制
// @author       You
// @license MIT
// @match        *.displayspecifications.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478600/%E8%A7%A3%E9%99%A4%20displayspecifications%20%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/478600/%E8%A7%A3%E9%99%A4%20displayspecifications%20%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 选择所有的 header 标签
var headerElements = document.querySelectorAll('header');
headerElements.forEach(function(element) {
  element.contentEditable = true;
});

// 选择所有的 .section-header 的父级元素
var sectionHeaderParentElements = document.querySelectorAll('.section-header');
sectionHeaderParentElements.forEach(function(element) {
  var parentElement = element.parentNode;
  element.contentEditable = true;
});

// 选择所有的 #model-brief-specifications 元素
var modelBriefSpecificationsElements = document.querySelectorAll('#model-brief-specifications');
modelBriefSpecificationsElements.forEach(function(element) {
  element.contentEditable = true;
});
    // 选择所有的 .model-information-table 元素
var modelInformationTableElements = document.querySelectorAll('.model-information-table');
modelInformationTableElements.forEach(function(element) {
  element.contentEditable = true;
});
// 选择所有的 .model-comparison-table 元素
var modelComparisonTableElements = document.querySelectorAll('.model-comparison-table');
modelComparisonTableElements.forEach(function(element) {
  element.contentEditable = true;
});


})();