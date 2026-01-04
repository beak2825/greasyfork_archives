// ==UserScript==
// @name         Google Scholar Advanced Sorting Toolbox（year、cite）
// @name:zh-CN   📚谷歌学术高级排序工具箱 (按年份、引用数)
// @namespace    http://tampermonkey.net/
// @version      2025.07.10.101
// @description  👍Supercharge your Google Scholar experience with a powerful, floating sorting toolbox. This script allows you to instantly sort results on the **current page**: 1. Sort by Year (Newest ↔ Oldest) 2. Sort by Citations (Highest ↔ Lowest)3. Data at a Glance 4. Intuitive UI
// @description:zh-CN  👍为谷歌学术搜索结果页面添加一个功能强大的悬浮排序工具箱。你可以通过它轻松地对【当前页面】的文献进行排序：1.【按年份排序 (新→旧 / 旧→新)】：同年份的文献会自动按引用数从高到低排列。2.【按引用数排序 (高→低 / 低→高)】。3.【直观数据显示】：排序后，每条结果左侧将清晰地显示其年份和引用数。4.【状态高亮】：当前有效的排序按钮会高亮显示，且脚本能完美保留谷歌学术的原有页面布局。
// @author       heyue
// @match        https://scholar.google.com/scholar?*
// @match        https://scholar.google.com.hk/scholar?*
// @match        https://sc.panda985.com/scholar?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542159/Google%20Scholar%20Advanced%20Sorting%20Toolbox%EF%BC%88year%E3%80%81cite%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542159/Google%20Scholar%20Advanced%20Sorting%20Toolbox%EF%BC%88year%E3%80%81cite%EF%BC%89.meta.js
// ==/UserScript==



(function () {
    'use strict';

    let currentSortState = { key: null, descending: null };

    // --- 数据提取辅助函数 ---
    function getYear(node) {
        const authorLine = node.querySelector('.gs_a');
        if (!authorLine) return 0;
        const text = authorLine.textContent;
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        return yearMatch ? parseInt(yearMatch[0], 10) : 0;
    }

    function getCiteCount(node) {
        const citeLink = node.querySelector('a[href*="/scholar?cites"]');
        if (!citeLink) return 0;
        const citeMatch = citeLink.textContent.match(/\d+/);
        return citeMatch ? parseInt(citeMatch[0], 10) : 0;
    }

    // --- 核心排序与渲染逻辑 ---
    function sortElements(sortKey, isDescending) {
        const gsResCclMid = document.getElementById('gs_res_ccl_mid');
        if (!gsResCclMid) return;

        const elementsWithData = [...gsResCclMid.querySelectorAll('.gs_or')]
            .map(node => ({
                node: node,
                year: getYear(node),
                cite: getCiteCount(node)
            }));

        elementsWithData.sort((a, b) => {
            if (sortKey === 'year') {
                const yearDiff = isDescending ? b.year - a.year : a.year - b.year;
                if (yearDiff !== 0) return yearDiff;
                return b.cite - a.cite;
            } else {
                return isDescending ? b.cite - a.cite : a.cite - b.cite;
            }
        });

        // 【关键改动】为每个结果项更新布局和信息
        elementsWithData.forEach(item => {
            const { node, year, cite } = item;

            // --- 布局包裹逻辑 ---
            // 检查是否已经处理过（即是否已存在包裹容器）
            if (!node.querySelector('.gs-original-content-wrapper')) {
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'gs-original-content-wrapper';
                contentWrapper.style.flexGrow = '1'; // 让包裹容器占据剩余空间

                // 将 node 的所有原始子元素移动到包裹容器中
                while (node.firstChild) {
                    contentWrapper.appendChild(node.firstChild);
                }
                // 将包裹容器加回 node
                node.appendChild(contentWrapper);
            }

            // --- 信息块创建与更新逻辑 ---
            let infoBox = node.querySelector('.gs-sort-info-box');
            if (!infoBox) {
                infoBox = document.createElement('div');
                infoBox.className = 'gs-sort-info-box';
                Object.assign(infoBox.style, {
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', width: '80px', flexShrink: '0',
                    paddingRight: '15px', marginRight: '15px', borderRight: '1px solid #e0e0e0',
                    textAlign: 'center'
                });
                // 首次创建时，插入到最前面
                node.prepend(infoBox);
            }

            // 无论是否首次创建，都更新信息块的内容
            const yearText = year > 0 ? year : 'N/A';
            const yearDisplay = `<div>📅 ${yearText}</div>`;
            const citeDisplay = `<div>💬 ${cite}</div>`;
            infoBox.innerHTML = yearDisplay + citeDisplay;

            // 设置父容器为flex，使其能容纳 信息块 和 包裹容器
            node.style.display = 'flex';
            node.style.alignItems = 'center';
        });

        gsResCclMid.innerHTML = '';
        gsResCclMid.append(...elementsWithData.map(item => item.node));

        currentSortState = { key: sortKey, descending: isDescending };
        console.log(`排序完成，布局已保留。`);

        // 排序后，需要手动更新一下按钮高亮，因为我们没有在循环外调用它
        const panel = document.querySelector('.gs-sort-panel');
        if (panel) updateHighlights(panel); // 传递 panel 引用
    }

    // --- UI 创建与交互 ---
    let updateHighlights; // 将函数声明提前

    function createSortPanel() {
        const normalStyle = { backgroundColor: '#f8f9fa', color: '#202124', border: '1px solid #dadce0' };
        const activeStyle = { backgroundColor: '#4285F4', color: 'white', border: '1px solid #4285F4' };

        const panel = document.createElement('div');
        panel.className = 'gs-sort-panel'; // 添加一个 class 以便之后查找
        Object.assign(panel.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
            backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '8px',
            padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', gap: '12px'
        });

        const createSortRow = (labelText, descText, ascText) => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '8px' });
            const label = document.createElement('span');
            Object.assign(label.style, { fontSize: '14px', color: '#5f6368', minWidth: '85px', flexShrink: '0' });
            label.textContent = labelText;
            const buttonStyle = { fontSize: '13px', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontWeight: '500', transition: 'all 0.2s', whiteSpace: 'nowrap' };
            const descButton = document.createElement('button');
            descButton.textContent = descText;
            Object.assign(descButton.style, buttonStyle);
            const ascButton = document.createElement('button');
            ascButton.textContent = ascText;
            Object.assign(ascButton.style, buttonStyle);
            row.append(label, descButton, ascButton);
            return { row, descButton, ascButton };
        };

        const yearRow = createSortRow('按年份:', '新 → 旧', '旧 → 新');
        const citeRow = createSortRow('按引用数:', '高 → 低', '低 → 高');

        // 将高亮函数赋值
        updateHighlights = (panelRef) => {
            const buttons = [
                { btn: yearRow.descButton, key: 'year', desc: true }, { btn: yearRow.ascButton,  key: 'year', desc: false },
                { btn: citeRow.descButton, key: 'cite', desc: true }, { btn: citeRow.ascButton,  key: 'cite', desc: false },
            ];
            buttons.forEach(item => {
                const isActive = (currentSortState.key === item.key && currentSortState.descending === item.desc);
                Object.assign(item.btn.style, isActive ? activeStyle : normalStyle);
            });
        };

        yearRow.descButton.addEventListener('click', () => sortElements('year', true));
        yearRow.ascButton.addEventListener('click', () => sortElements('year', false));
        citeRow.descButton.addEventListener('click', () => sortElements('cite', true));
        citeRow.ascButton.addEventListener('click', () => sortElements('cite', false));

        panel.append(yearRow.row, citeRow.row);
        document.body.appendChild(panel);
        updateHighlights(panel);
    }

    if (document.readyState === 'complete') {
        createSortPanel();
    } else {
        window.addEventListener('load', createSortPanel);
    }
})();