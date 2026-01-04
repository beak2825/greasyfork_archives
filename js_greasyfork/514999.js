// ==UserScript==
// @name         MakerWorld Points to RMB Converter
// @name:zh-CN   MakerWorld积分转人民币转换器
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description          Convert MakerWorld points to RMB display for both CN and international sites
// @description:zh-CN    支持国际站和中文站的MakerWorld积分自动转换人民币显示
// @author       AIScripter
// @match        https://makerworld.com.cn/*
// @match        https://makerworld.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514999/MakerWorld%20Points%20to%20RMB%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/514999/MakerWorld%20Points%20to%20RMB%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXCHANGE_RATES = {
        'normal': 0.5795,    // Normal points exchange rate
        'exclusive': 0.47    // Exclusive points exchange rate
    };

    let isUpdating = false; // 防止重复执行的标志

    // Function to parse number text with internationalization support
    function parseNumber(text) {
        // Handle text with <em> tags for decimal parts
        if (text.includes('<em')) {
            const mainPart = text.split('<em')[0].trim();
            const decimalMatch = text.match(/\.<!-- -->(\d+)/);
            const decimal = decimalMatch ? decimalMatch[1] : '';
            return parseFloat(mainPart.replace(/,/g, '') + '.' + decimal);
        }
        // Handle regular numbers
        return parseFloat(text.replace(/,/g, ''));
    }

    // Function to convert points to RMB
    function convertPointsToRMB(points, type = 'normal') {
        const rate = EXCHANGE_RATES[type] || EXCHANGE_RATES.normal;
        return Math.round(points * rate);
    }

    // Function to create or update RMB display element
    function createOrUpdateRMBDisplay(container, value, className, styles = {}) {
        let rmbDisplay = container.querySelector(`.${className}`);
        if (!rmbDisplay) {
            rmbDisplay = document.createElement('span');
            rmbDisplay.className = className;
            rmbDisplay.setAttribute('data-rmb-converter', 'true'); // 标记为脚本创建的元素
            Object.assign(rmbDisplay.style, {
                color: '#666',
                marginLeft: '4px',
                display: 'inline-block',
                verticalAlign: 'baseline',
                ...styles
            });
            container.appendChild(rmbDisplay);
        }
        rmbDisplay.textContent = `≈ ${value} 元`;
        return rmbDisplay;
    }

    // Function to update points display
    function updatePointsDisplay() {
        if (isUpdating) return; // 如果正在更新，直接返回
        isUpdating = true;

        try {
            // Handle points type display area (both CN and international versions)
            const pointTypesContainer = document.querySelector('.mw-css-dx018d');
            if (pointTypesContainer) {
                const typeBlocks = pointTypesContainer.querySelectorAll('[class*="mw-css-"][class*="gc1l0t"]');
                typeBlocks.forEach(block => {
                    const pointsSpan = block.querySelector('[class*="mw-css-"][class*="yyek0l"]');
                    const typeLabel = block.querySelector('[class*="mw-css-"][class*="kx5qaq"]');
                    if (pointsSpan && typeLabel) {
                        const pointsText = pointsSpan.innerHTML;
                        const pointsValue = parseNumber(pointsText);
                        const isExclusive = typeLabel.textContent.includes('独家') ||
                                          typeLabel.textContent.toLowerCase().includes('exclusive');
                        const rmbValue = convertPointsToRMB(pointsValue, isExclusive ? 'exclusive' : 'normal');

                        createOrUpdateRMBDisplay(
                            block.querySelector('[class*="mw-css-"][class*="gr0cu"]'),
                            rmbValue,
                            'rmb-type-conversion',
                            { fontSize: '12px' }
                        );
                    }
                });
            }

            // Handle total points display area
            const totalPointsContainers = document.querySelectorAll('[class*="mw-css-"][class*="gjjkf7"]');
            totalPointsContainers.forEach(container => {
                const pointsSpan = container.querySelector('[class*="mw-css-"][class*="yyek0l"]');
                if (pointsSpan) {
                    const pointsText = pointsSpan.innerHTML;
                    const pointsValue = parseNumber(pointsText);
                    const rmbValue = convertPointsToRMB(pointsValue);

                    createOrUpdateRMBDisplay(
                        container,
                        rmbValue,
                        'rmb-total-conversion',
                        { fontSize: '14px', textAlign: 'center' }
                    );
                }
            });

            // Handle small version points display (including nested formats)
            const smallPointsContainers = document.querySelectorAll('[class*="mw-css-"][class*="foh4ep"]');
            smallPointsContainers.forEach(container => {
                // Try both direct and nested yyek0l span structures
                const pointsSpan = container.querySelector('[class*="mw-css-"][class*="yyek0l"]');
                const nestedPointsSpan = container.querySelector('[class*="mw-css-"][class*="1541sxf"] [class*="mw-css-"][class*="yyek0l"]');

                const targetSpan = pointsSpan || nestedPointsSpan;
                if (targetSpan) {
                    const pointsText = targetSpan.innerHTML;
                    const pointsValue = parseNumber(pointsText);
                    const rmbValue = convertPointsToRMB(pointsValue);

                    createOrUpdateRMBDisplay(
                        container,
                        rmbValue,
                        'rmb-individual-conversion',
                        { fontSize: '0.75em', textAlign: 'center' }
                    );
                }
            });

            // Handle income/expenditure details
            const incomeLabels = document.querySelectorAll('[class*="mw-css-"][class*="jrs7sa"]');
            incomeLabels.forEach(label => {
                const incomeSpans = label.querySelectorAll('[class*="mw-css-"][class*="jgoohm"] [class*="mw-css-"][class*="yyek0l"]');
                incomeSpans.forEach((span, index) => {
                    const pointsText = span.innerHTML;
                    const pointsValue = parseNumber(pointsText);
                    const rmbValue = convertPointsToRMB(pointsValue);

                    const parentContainer = span.closest('[class*="mw-css-"][class*="jgoohm"]');
                    createOrUpdateRMBDisplay(
                        parentContainer,
                        rmbValue,
                        `rmb-${index === 0 ? 'income' : 'expenditure'}-conversion`,
                        { fontSize: '0.75em' }
                    );
                });
            });
        } finally {
            isUpdating = false; // 确保标志被重置
        }
    }

    // 延迟执行函数，防止频繁调用
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 创建防抖版本的更新函数
    const debouncedUpdate = debounce(updatePointsDisplay, 300);

    // Add page load event and mutation observer
    window.addEventListener('load', function() {
        updatePointsDisplay();

        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            // 检查变化是否与我们的脚本无关
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        !node.hasAttribute('data-rmb-converter') && 
                        !node.querySelector('[data-rmb-converter]')) {
                        shouldUpdate = true;
                        break;
                    }
                }
                if (shouldUpdate) break;
            }
            
            if (shouldUpdate) {
                debouncedUpdate();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 添加页面可见性变化时的更新
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(updatePointsDisplay, 100);
        }
    });
})();