// ==UserScript==
// @name         粉笔答案解析页删除VIP视频解析广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除粉笔答案解析页中的VIP解析视频
// @author       slience_2018
// @match        https://spa.fenbi.com/ti/exam/solution/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545702/%E7%B2%89%E7%AC%94%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90%E9%A1%B5%E5%88%A0%E9%99%A4VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/545702/%E7%B2%89%E7%AC%94%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90%E9%A1%B5%E5%88%A0%E9%99%A4VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function main() {
        const observer = new MutationObserver(function(mutations) {
            removeVideoSections();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        removeVideoSections();
    }
    
    function removeVideoSections() {
        const sections = document.querySelectorAll('section[id^="section-video"]');
        
        if (sections.length > 0) {
            sections.forEach(section => {
                section.remove();
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();