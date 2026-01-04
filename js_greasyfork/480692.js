// ==UserScript==
// @name         SZU公文通去水印
// @namespace    https://www1.szu.edu.cn/board/
// @version      0.2.1
// @description  Remove watermark from the page
// @author       YuChangfeng
// @match        *://www1.szu.edu.cn/board/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480692/SZU%E5%85%AC%E6%96%87%E9%80%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480692/SZU%E5%85%AC%E6%96%87%E9%80%9A%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function removeWatermark() {
        var watermarkParent = document.body;
        var watermarkElements = document.querySelectorAll('.mark_div');

        watermarkElements.forEach(function(element) {
            watermarkParent.removeChild(element);
        });
    }

    function removeElementsWithColor() {
        var elementsWithColor = document.querySelectorAll('[color="#F8F8F8"]');

        elementsWithColor.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }

    function removeSpecificParagraph() {
        var paragraphs = document.querySelectorAll('p[align="center"] font.fontcolor3');

        paragraphs.forEach(function(paragraph) {
            paragraph.parentNode.removeChild(paragraph);
        });
    }
    window.onload = function() {
        removeWatermark();
        removeElementsWithColor();
        removeSpecificParagraph();

    };
})();