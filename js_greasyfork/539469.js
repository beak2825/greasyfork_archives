// ==UserScript==
// @name         莫奈风格动态区域配色
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将网站划分为不同区域并应用莫奈风格配色，颜色会实时动态变化
// @author       Doubao
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539469/%E8%8E%AB%E5%A5%88%E9%A3%8E%E6%A0%BC%E5%8A%A8%E6%80%81%E5%8C%BA%E5%9F%9F%E9%85%8D%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/539469/%E8%8E%AB%E5%A5%88%E9%A3%8E%E6%A0%BC%E5%8A%A8%E6%80%81%E5%8C%BA%E5%9F%9F%E9%85%8D%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 莫奈经典配色方案 - 从莫奈画作中提取的色彩组合
    const monetColorPalettes = [
        // 睡莲系列
        [
            '#E6E9D2', '#9EB385', '#8C9FBC', '#A67C52', '#D8CCC9'
        ],
        // 日出·印象
        [
            '#F2F3F4', '#E2C394', '#8A9CA5', '#4A5568', '#D4AF37'
        ],
        // 野罂粟
        [
            '#F5F5DC', '#F4A460', '#90EE90', '#6A5ACD', '#CD853F'
        ],
        // 干草堆
        [
            '#FAF0E6', '#D2B48C', '#8B7D6B', '#A67C52', '#BC8F8F'
        ],
        // 伦敦国会大厦
        [
            '#E6E6FA', '#9370DB', '#D3D3D3', '#696969', '#4682B4'
        ]
    ];
    
    // 区域划分配置 - 可根据需要调整区域数量和位置
    const sectionConfig = {
        numSections: 4, // 区域数量
        animationSpeed: 5000, // 颜色变化速度(毫秒)
        transitionDuration: 1000 // 颜色过渡持续时间(毫秒)
    };
    
    // 创建样式标签
    function createStyleTag() {
        const style = document.createElement('style');
        style.id = 'monet-style';
        document.head.appendChild(style);
        return style;
    }
    
    // 生成区域CSS
    function generateSectionCSS(styleElement, colors) {
        let css = '';
        const sectionHeight = 100 / sectionConfig.numSections;
        
        for (let i = 0; i < sectionConfig.numSections; i++) {
            css += `
                .monet-section-${i} {
                    position: fixed;
                    top: ${i * sectionHeight}%;
                    left: 0;
                    width: 100%;
                    height: ${sectionHeight}%;
                    background-color: ${colors[i]};
                    z-index: 9999;
                    transition: background-color ${sectionConfig.transitionDuration / 1000}s ease;
                    opacity: 0.8; /* 透明度，使内容仍可阅读 */
                }
            `;
        }
        
        styleElement.textContent = css;
    }
    
    // 创建区域元素
    function createSectionElements() {
        for (let i = 0; i < sectionConfig.numSections; i++) {
            const section = document.createElement('div');
            section.className = `monet-section-${i}`;
            document.body.appendChild(section);
        }
    }
    
    // 随机选择一个莫奈配色方案
    function getRandomMonetPalette() {
        const randomIndex = Math.floor(Math.random() * monetColorPalettes.length);
        return monetColorPalettes[randomIndex];
    }
    
    // 随机打乱颜色顺序
    function shuffleColors(colors) {
        const shuffled = [...colors];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // 动态更新颜色
    function updateColors() {
        const palette = getRandomMonetPalette();
        const shuffledColors = shuffleColors(palette);
        const styleElement = document.getElementById('monet-style');
        
        if (styleElement) {
            generateSectionCSS(styleElement, shuffledColors);
        }
    }
    
    // 初始化函数
    function init() {
        // 创建样式标签
        const styleElement = createStyleTag();
        
        // 创建区域元素
        createSectionElements();
        
        // 初始颜色设置
        const initialPalette = getRandomMonetPalette();
        generateSectionCSS(styleElement, initialPalette);
        
        // 定时更新颜色
        setInterval(updateColors, sectionConfig.animationSpeed);
    }
    
    // 启动脚本
    init();
})();