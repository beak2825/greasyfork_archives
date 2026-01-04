// ==UserScript==
// @name         豆包插件Logo替换工具
// @namespace    https://github.com/YourName
// @version      1.1
// @description  替换豆包浏览器插件Logo，支持Chrome/Edge
// @author       wh-chen&Deepseek
// @match        *://*/*
// @grant        GM_addStyle
// @license      CC-BY-NC-4.0
// @supportURL   https://github.com/YourName/issues
// @downloadURL https://update.greasyfork.org/scripts/532687/%E8%B1%86%E5%8C%85%E6%8F%92%E4%BB%B6Logo%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532687/%E8%B1%86%E5%8C%85%E6%8F%92%E4%BB%B6Logo%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        // 主Logo替换（彩色图标）
        mainLogo: {
            newLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABClJREFUWEftl01sVFUUx3/nvjfTWlrpAI0xiIp8NHZhgoCkCz8iAvGLJsbEBFbEGoOkC6MFBdnpwgWJBmOQqCFSFyZ+J6LUQAJJQUo/EFMDbSlUKJ3CUJzWaefjvXvNe4MBpDPzyrhQ0zuTzGLePed3/+fcc84T2w4b/kVLpoAKRGNKoULp+v9RyFalPLd8K0sXrOR8rI9P9m4mGj9VSICC/09aISU2H6wfojRdhiMC3lcJrutii7CzZQ0tXV8VdJzrgUkBlYer2L6uD9wwKIMYuWpXDNkP7GjZQWvXyzcFNQkgYdcL4yhb0C74nv+2tKeWyXA647LzUBPR7g2ThgoMtKNhgND4LCzPxTXCXOtRjAek0aXwequQim5i+Oy7k4IKCCR8VJ9AiaCUwugcPnwiwTEOm9tcCIdI9tczMvhpYKhAQA9UP8X6B7/IJvBEpiVL6EXRSyttYGungOv6B4j11JGKNweCCgS0rb6FmbLkRoMegUpixOBOG+ZIz5f8/GsL5RURWspf5Nb0Xdi6DNfYxE8+TOqPowWhAgE1NcZwfq/IGvMlMmitITROw4cLSWQu3eDokf5mRpMpVLgEfaiKc+/MYfiXZWSS+WtVIKDdG6O4lyNo5fG4pEUxkk7S+HFlzhPXDR5kIJHwQ2iM8X8rLszm4EPLIRPLuS8YUGOUTDzi3zBtHL7vTfDZ/jmIpPIAHWAgMeaD+JqKxnJKSYnh+ILHigNq2jiEE6/0T3pkcIz9Q1G6W2vy5sOq/n1cymT8/PIjbRRKgxMK0blwJSbjTLg/mEIbL+DEyxkVxZvtEDteg0715QWq7dlD0vIK+vX3UhnF0fmrilNotwd0uYQt7RbaCNHOaQVvy32936GUYF0DJCIYrWmf/0RxQE2vDPJ5h8Wx+HTSKsP5tvIAQHsI+eJkFfL6nkFjfX2A1lffLg5o16YYjc2llFgKQ4qBtkh+IKVY0v0DjtJYJptDGTRlwE/znsy7N1AOrVszwN6TM/1ebkmScwWA5tatZMa2bLf39ElZQlhDx6JnMCNjxQPNq+1mLH2nXxBF3IIhW3HmR4bdK7dIG8SyOLN2E7HDxwqGOpBC82pPMJ6+2+9VGmGofTqQzGn8/lPfYsRGiYVKZTjx9AZGe/oLwviKBnkvq7pnC3bkDT8AXghKw6P0Ha6a0MHi7W+hH1+KqxzstEtHzepstw24AgGBxe2LE1dMCtpyuMVc5PTRaoRstRaZyexle5nVdNGbQJjR2cu+ZxsCYlx9LCAQRO54ntBt7xEy4E2GnloaF9toUmEL4xoW7e5C2aM0V68AN9fQlJ8xMJBnZlrlKirmfoMof+7AqyxGuUha8ehrv9G09l7wpoAi1qSA/vJjl8xn1pyXsEURPfs+TrK7CITrt94U0D/mfQJDU0CF1J1S6D+n0J9CKbII9Kl5kwAAAABJRU5ErkJggg==', // 替换为你的Base64主图标
            targetSelectors: [
                'img[src*="capohkkfagimodmlpnahjoijgoocdjhd"][src*="icon.png"]',
                'img[class*="floatBtnAvatar"]',
                'img[style*="width: 36px"][style*="height: 36px"]'
            ]
        },

        // 选中文本时的白色Logo替换
        selectionLogo: {
            newLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABClJREFUWEftl01sVFUUx3/nvjfTWlrpAI0xiIp8NHZhgoCkCz8iAvGLJsbEBFbEGoOkC6MFBdnpwgWJBmOQqCFSFyZ+J6LUQAJJQUo/EFMDbSlUKJ3CUJzWaefjvXvNe4MBpDPzyrhQ0zuTzGLePed3/+fcc84T2w4b/kVLpoAKRGNKoULp+v9RyFalPLd8K0sXrOR8rI9P9m4mGj9VSICC/09aISU2H6wfojRdhiMC3lcJrutii7CzZQ0tXV8VdJzrgUkBlYer2L6uD9wwKIMYuWpXDNkP7GjZQWvXyzcFNQkgYdcL4yhb0C74nv+2tKeWyXA647LzUBPR7g2ThgoMtKNhgND4LCzPxTXCXOtRjAek0aXwequQim5i+Oy7k4IKCCR8VJ9AiaCUwugcPnwiwTEOm9tcCIdI9tczMvhpYKhAQA9UP8X6B7/IJvBEpiVL6EXRSyttYGungOv6B4j11JGKNweCCgS0rb6FmbLkRoMegUpixOBOG+ZIz5f8/GsL5RURWspf5Nb0Xdi6DNfYxE8+TOqPowWhAgE1NcZwfq/IGvMlMmitITROw4cLSWQu3eDokf5mRpMpVLgEfaiKc+/MYfiXZWSS+WtVIKDdG6O4lyNo5fG4pEUxkk7S+HFlzhPXDR5kIJHwQ2iM8X8rLszm4EPLIRPLuS8YUGOUTDzi3zBtHL7vTfDZ/jmIpPIAHWAgMeaD+JqKxnJKSYnh+ILHigNq2jiEE6/0T3pkcIz9Q1G6W2vy5sOq/n1cymT8/PIjbRRKgxMK0blwJSbjTLg/mEIbL+DEyxkVxZvtEDteg0715QWq7dlD0vIK+vX3UhnF0fmrilNotwd0uYQt7RbaCNHOaQVvy32936GUYF0DJCIYrWmf/0RxQE2vDPJ5h8Wx+HTSKsP5tvIAQHsI+eJkFfL6nkFjfX2A1lffLg5o16YYjc2llFgKQ4qBtkh+IKVY0v0DjtJYJptDGTRlwE/znsy7N1AOrVszwN6TM/1ebkmScwWA5tatZMa2bLf39ElZQlhDx6JnMCNjxQPNq+1mLH2nXxBF3IIhW3HmR4bdK7dIG8SyOLN2E7HDxwqGOpBC82pPMJ6+2+9VGmGofTqQzGn8/lPfYsRGiYVKZTjx9AZGe/oLwviKBnkvq7pnC3bkDT8AXghKw6P0Ha6a0MHi7W+hH1+KqxzstEtHzepstw24AgGBxe2LE1dMCtpyuMVc5PTRaoRstRaZyexle5nVdNGbQJjR2cu+ZxsCYlx9LCAQRO54ntBt7xEy4E2GnloaF9toUmEL4xoW7e5C2aM0V68AN9fQlJ8xMJBnZlrlKirmfoMof+7AqyxGuUha8ehrv9G09l7wpoAi1qSA/vJjl8xn1pyXsEURPfs+TrK7CITrt94U0D/mfQJDU0CF1J1S6D+n0J9CKbII9Kl5kwAAAABJRU5ErkJggg==', // 替换为你的Base64白色图标
            targetSelectors: [
                'img[src*="capohkkfagimodmlpnahjoijgoocdjhd"][src*="icon_white.png"]',
                'img[style*="width: 24px"][style*="height: 24px"]' // 悬浮图标通常较小
            ]
        },

        // 排除其他插件
        excludeRules: [
            'img[src*="kimi"]',
            'img[src*="moonshot"]',
            'img[class*="kimi"]'
        ]
    };

    // 穿透Shadow DOM查找元素
    function deepQuery(selector, root = document) {
        const elements = [];

        // 普通DOM查询
        elements.push(...root.querySelectorAll(selector));

        // Shadow DOM穿透
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            { acceptNode: () => NodeFilter.FILTER_ACCEPT },
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
                elements.push(...deepQuery(selector, node.shadowRoot));
            }
        }

        return elements;
    }

    // 执行替换（支持多目标）
    function replaceLogos() {
        // 替换主Logo
        replaceLogoType(config.mainLogo);

        // 替换选中文本时的Logo
        replaceLogoType(config.selectionLogo);
    }

    // 替换特定类型的Logo
    function replaceLogoType(logoConfig) {
        let targets = [];

        // 多重选择器尝试
        logoConfig.targetSelectors.forEach(selector => {
            targets.push(...deepQuery(selector));
        });

        // 去重 + 排除干扰项
        targets = [...new Set(targets)].filter(el => {
            return !config.excludeRules.some(rule => el.matches(rule));
        });

        // 执行替换
        targets.forEach(img => {
            img.src = logoConfig.newLogo;
            // 保持原有尺寸（主图标36x36，悬浮图标24x24）
            const size = logoConfig === config.mainLogo ? '36px' : '24px';
            img.style.cssText += `;width: ${size} !important; height: ${size} !important;`;
            console.log('✅ 替换成功:', img);
        });
    }

    // 监听文本选择事件（针对悬浮Logo动态出现）
    function setupSelectionListener() {
        document.addEventListener('mouseup', () => {
            if (window.getSelection().toString().length > 0) {
                // 延迟执行以确保悬浮Logo已生成
                setTimeout(replaceLogos, 300);
            }
        });
    }

    // 初始化
    const init = () => {
        replaceLogos();
        setupSelectionListener();

        // 监听DOM变化
        new MutationObserver(replaceLogos).observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'style']
        });
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();