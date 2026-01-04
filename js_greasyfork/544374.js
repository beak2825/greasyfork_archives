// ==UserScript==
// @name         LeetCode 学习计划体验增强（题目列表常驻、显示分类下题目个数）
// @namespace    http://tampermonkey.net/
// @homepageURL  https://greasyfork.org/en/scripts/544374-leetcode-%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA-%E9%A2%98%E7%9B%AE%E5%88%97%E8%A1%A8%E5%B8%B8%E9%A9%BB-%E6%98%BE%E7%A4%BA%E5%88%86%E7%B1%BB%E4%B8%8B%E9%A2%98%E7%9B%AE%E4%B8%AA%E6%95%B0
// @version      0.2.11
// @description  在 LeetCode 学习计划页面为每个分类显示题目总数，并为每个题目添加序号。
// @author       tianyw0
// @match        https://leetcode.cn/studyplan/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/studyplan/*
// @match        https://leetcode.com/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544374/LeetCode%20%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%EF%BC%88%E9%A2%98%E7%9B%AE%E5%88%97%E8%A1%A8%E5%B8%B8%E9%A9%BB%E3%80%81%E6%98%BE%E7%A4%BA%E5%88%86%E7%B1%BB%E4%B8%8B%E9%A2%98%E7%9B%AE%E4%B8%AA%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544374/LeetCode%20%E5%AD%A6%E4%B9%A0%E8%AE%A1%E5%88%92%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%EF%BC%88%E9%A2%98%E7%9B%AE%E5%88%97%E8%A1%A8%E5%B8%B8%E9%A9%BB%E3%80%81%E6%98%BE%E7%A4%BA%E5%88%86%E7%B1%BB%E4%B8%8B%E9%A2%98%E7%9B%AE%E4%B8%AA%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(processAllModules, 800);
    setTimeout(left, 1000);
})();

function left() {
    function updateBodyWidth() {
        document.body.style.width = `${window.innerWidth - 400}px`;
    }
    try {
        const leftPanel = document.querySelectorAll(".z-modal")[2];
        if (!leftPanel) return;

        const progressBar = leftPanel.querySelectorAll(".cursor-pointer")[0];
        if (!progressBar) return;

        leftPanel.classList.remove('w-[600px]');
        leftPanel.classList.add('w-[400px]');

        progressBar.classList.remove('w-[200px]');
        progressBar.classList.add('w-[100px]');

        leftPanel.classList.remove('transform');
        leftPanel.classList.add('transform-none');

        document.body.style.marginLeft = '400px';
        updateBodyWidth();

        // id="activeItem" 让这个元素垂直居中显示在页面
        const activeItem = document.getElementById("activeItem");
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        window.addEventListener('resize', updateBodyWidth);

    } catch (error) {
        console.error('Error in left function:', error);
    }
}

function processAllModules() {
    const MODULE_SELECTOR = '.w-full.overflow-hidden.rounded-lg.border-\\[1\\.5px\\]';
    const CATEGORY_TITLE_SELECTOR = 'div.flex.h-10 > div.text-\\[12px\\]';
    const PROBLEM_ITEM_SELECTOR = 'div.flex.flex-col.border-b-\\[1\\.5px\\] > div.flex.h-\\[52px\\]';
    const TITLE_CONTAINER_SELECTOR = 'div.relative.flex.h-full.w-full.items-center > div.flex.w-0.flex-1.items-center.space-x-2';

    const modules = document.querySelectorAll(MODULE_SELECTOR);
    let globalIndex = 1;

    modules.forEach(module => {
        if (module.dataset.processed) return;

        try {
            const categoryTitles = module.querySelectorAll(CATEGORY_TITLE_SELECTOR);
            const problemItems = module.querySelectorAll(PROBLEM_ITEM_SELECTOR);
            const problemCount = problemItems.length;

            categoryTitles.forEach(title => {
                if (!title.querySelector('.problem-count-span')) {
                    const countSpan = document.createElement('span');
                    countSpan.textContent = ` (${problemCount} 题)`;
                    countSpan.style.marginLeft = '5px';
                    countSpan.className = 'problem-count-span';
                    title.appendChild(countSpan);
                }
            });

            problemItems.forEach((item) => {
                const titleContainer = item.querySelector(TITLE_CONTAINER_SELECTOR);
                if (titleContainer && !titleContainer.querySelector('.problem-index-span')) {
                    const indexSpan = document.createElement('span');
                    indexSpan.textContent = `${globalIndex}. `;
                    indexSpan.className = 'problem-index-span';
                    titleContainer.prepend(indexSpan);
                    globalIndex++;
                }
            });

            module.dataset.processed = 'true';
        } catch (error) {
            console.error('Error processing module:', error);
        }
    });
}