// ==UserScript==
// @name:en         [MWI]Disable Market Panel Buttons (TC Experience Plugin)
// @name            [银河奶牛]一键铁牛体验插件
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-orderbook-button-disabler
// @version         3.0.8
// @description:en  Automatically disable and gray out the buttons in the in-game market function area in the normal mode. 
// @description     在普通模式下自动禁用并灰化游戏内的市场功能区域按钮，体验铁牛的生活吧
// @author          shenhuanjie
// @license         MIT
// @match           https://www.milkywayidle.com/game*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           none
// @homepage        https://greasyfork.org/scripts/535665
// @supportURL      https://greasyfork.org/scripts/535665
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/535665/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%B8%80%E9%94%AE%E9%93%81%E7%89%9B%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535665/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E4%B8%80%E9%94%AE%E9%93%81%E7%89%9B%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象，包含需要禁用按钮的面板类名、按钮白名单和SVG删除规则
    const config = {
        panelClassNames: [
            "MarketplacePanel_orderBook",
            "MarketplacePanel_itemSummary"
        ],
        // 按钮白名单规则：基于类名前缀的模糊匹配
        buttonWhitelist: [
            // 模糊匹配层级关系
            "MarketplacePanel_viewAll > button", // 匹配任何类名前缀包含MarketplacePanel_viewAll的父元素下的button
            "MarketplacePanel_viewAll > Button_button" // 匹配特定按钮类名前缀
        ],
        // SVG删除规则配置
        svgToRemove: [
            {
                parentSelector: "div[class*='MarketplacePanel_actionButtonText']",
                svgAttributes: {
                    "aria-label": "Up Arrow"
                }
            }
            // 可以在此处添加更多SVG删除规则
        ]
    };

    // 生成CSS选择器的函数
    function generateCSS(classNames) {
        // 生成基本选择器
        const baseSelectors = classNames.map(className => 
            `div[class*="${className}"] button`
        ).join(',\n        ');
        
        // 生成白名单选择器（基于类名前缀模糊匹配）
        const whitelistSelectors = config.buttonWhitelist.map(rule => {
            const parts = rule.split(/\s*>\s*/).map(part => part.trim());
            
            // 处理层级选择器规则
            if (parts.length > 1) {
                const parentClass = parts[0];
                const childElement = parts[1];
                
                // 如果是特定按钮类名前缀匹配
                if (childElement.includes('_')) {
                    return `[class*="${parentClass}"] > [class*="${childElement}"]`;
                }
                // 普通元素匹配
                return `[class*="${parentClass}"] > ${childElement}`;
            }
            
            // 处理简单按钮类名前缀匹配
            return `[class*="${parts[0]}"]`;
        }).join(',\n        ');
        
        // 生成hover、active和focus状态的选择器
        const stateSelectors = classNames.flatMap(className => [
            `div[class*="${className}"] button:hover`,
            `div[class*="${className}"] button:active`,
            `div[class*="${className}"] button:focus`
        ]).join(',\n        ');
        
        // 生成SVG删除规则
        const svgRules = config.svgToRemove.map(rule => {
            const parentSelector = rule.parentSelector;
            const svgSelector = Object.entries(rule.svgAttributes)
                .map(([attr, value]) => `[${attr}="${value}"]`)
                .join('');
            return `${parentSelector} svg${svgSelector}`;
        }).join(',\n        ');
        
        // 返回完整的CSS
        return `
        /* 移除配置的SVG元素 */
        ${svgRules} {
            display: none !important;
        }
        
        /* 样式规则：应用于所有匹配的按钮（包括白名单中的按钮） */
        ${baseSelectors} {
            opacity: 0.5 !important;
            background-color: #e0e0e0 !important;
            color: #888 !important;
            border-color: #ccc !important;
            filter: grayscale(100%) !important;
            transition: all 0.3s ease !important;
            cursor: not-allowed !important;
        }
        
        /* 交互规则：只应用于非白名单的按钮 */
        ${baseSelectors}:not(${whitelistSelectors}) {
            cursor: not-allowed !important;
            pointer-events: none !important;
        }
        
        /* 确保禁用状态不会被其他样式覆盖 */
        ${stateSelectors} {
            opacity: 0.5 !important;
            background-color: #e0e0e0 !important;
            color: #888 !important;
            border-color: #ccc !important;
            filter: grayscale(100%) !important;
            box-shadow: none !important;
            transform: none !important;
        }
        
        /* 白名单按钮的交互状态 */
        ${whitelistSelectors},
        ${whitelistSelectors}:hover,
        ${whitelistSelectors}:active,
        ${whitelistSelectors}:focus {
            cursor: pointer !important;
            pointer-events: auto !important;
        }
        
        /* 特殊处理层级选择器规则的交互状态 */
        ${config.buttonWhitelist
            .filter(rule => rule.includes('>'))
            .map(rule => {
                const parts = rule.split(/\s*>\s*/);
                const parentSelector = parts[0].includes('__') ? 
                    `[class*="${parts[0]}"]` : `.${parts[0]}`;
                const childSelector = parts[1];
                return `${parentSelector} > ${childSelector}:hover,
                ${parentSelector} > ${childSelector}:active,
                ${parentSelector} > ${childSelector}:focus`;
            })
            .join(',\n        ')} {
            cursor: pointer !important;
            pointer-events: auto !important;
        }`;
    }

    // 添加纯CSS实现
    const style = document.createElement('style');
    style.textContent = generateCSS(config.panelClassNames);
    document.head.appendChild(style);
    
    console.log(`[MarketplacePanelDisabler] 已应用CSS规则：
    面板类名: ${config.panelClassNames.join(', ')}
    白名单按钮: ${config.buttonWhitelist.join(', ')}
    SVG删除规则: ${config.svgToRemove.map(rule => 
        `${rule.parentSelector} svg[${Object.entries(rule.svgAttributes).map(([attr, value]) => `${attr}="${value}"`).join(' ')}]`
    ).join(', ')}
    特殊规则: "MarketplacePanel_viewAll"类名下的按钮保持正常样式和点击功能`);
})();