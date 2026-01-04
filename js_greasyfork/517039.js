// ==UserScript==
// @name         arxiv Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在打开axriv.org的某篇论文,自动在新标签页打开对应论文的paper.cool(kimi总结)和alphaxiv.org(论文讨论)内容 
// @author       flaging
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/pdf/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517039/arxiv%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/517039/arxiv%20Link%20Extractor.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取目标元素
    const targetElement = document.getElementById('download-button-info');
    if (targetElement) {
        // 创建超链接元素

        const link = document.createElement('a');
        var url = window.location.href.substr(22);
        window.open('https://papers.cool/arxiv/'+url, '_blank');
        window.open('https://alphaxiv.org/pdf/'+url, '_blank');
    }
})();
