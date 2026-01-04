// ==UserScript==
// @name         游戏状态角标增强
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为特定游戏状态添加识别角标
// @author       XiaoR
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @license      不允许分发
// @downloadURL https://update.greasyfork.org/scripts/530917/%E6%B8%B8%E6%88%8F%E7%8A%B6%E6%80%81%E8%A7%92%E6%A0%87%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530917/%E6%B8%B8%E6%88%8F%E7%8A%B6%E6%80%81%E8%A7%92%E6%A0%87%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    // 基础角标样式
    const BASE_BADGE_STYLE = {
        position: 'absolute',
        left: '1px',
        bottom: '1px',
        borderRadius: '50%',
        fontSize: '16px',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none'
    };

    // 状态配置列表
    const STATE_CONFIGS = [
        {   // 红色①组
            labels: ['嘲讽', '精确', '坚韧'],
            text: 'B',
            style: { background: 'red', color: 'white' }
        },
        {   // 绿色①组
            labels: ['元素增幅', '狂暴'],
            text: 'S',
            style: { background: 'green', color: 'white' }
        },
        {   // 红色②组
            labels: ['闪避','尖刺防护', '吸血'],
            text: '买',
            style: { background: 'red', color: 'white' }
        },
        {   // 绿色②组
            labels: [,'狂速','挑衅'],
            text: '卖',
            style: { background: 'green', color: 'white' }
        },
        {
            labels: ['杨桃酸奶'],
            text: '分',
            style: { background: 'green', color: 'white' }
        },
        {
            labels: ['透骨之刺','流水箭','烈焰箭','冰枪术'],
            text: 'b',
            style: { background: 'pink', color: 'white' }
        },
        {
            labels: ['箭雨','分裂斩','剧毒粉尘','熔岩爆裂','自愈术','重扫'],
            text: 's',
            style: { background: '#00dd11', color: 'white' }
        },
        {
            labels: ['沉默之箭','破甲之刺','血刃斩','重锤'],
            text: 'B',
            style: { background: '#FF6A6A', color: 'white' }
        },
        {
            labels: ['稳定射击','冰霜爆裂','自然菌幕','火焰风暴','快速治疗术','群体治疗术'],
            text: 'S',
            style: { background: '#006400', color: 'white' }
        },
        {
            labels: ['琥珀','珍珠','石榴石','翡翠','紫水晶'],
            text: '炼',
            style: { background: 'yellow', color: 'white' }
        },{
            labels: ['奥术反射'],
            text: 'B',
            style: { background: 'black', color: 'white' }
        },
        {
                    labels: ['致残斩','疫病射击'],
            text: 'SB',
            style: { background: 'black', color: 'white' }

        },



        {
            labels: ['贯心之刺','贯穿射击','法力喷泉','烟爆灭影'],
            text: 'S',
            style: { background: 'black', color: 'white' }

        },{
            labels: ['工匠茶'],
            text: '炼',
            style: { background: 'black', color: 'white' }
        },{
            labels: ['破胆之刺','爪影斩','重碾','快速射击'],
            text: '裸转',
            style: { background: 'white', color: 'black' }

        },{
            labels: ['初级自愈术','缠绕','火球','流水冲击'],
            text: '卖',
            style: { background: 'white', color: 'black' }

        }


    ];

    // 创建角标元素
    function createBadge(config) {
        const badge = document.createElement('div');
        Object.assign(badge.style, BASE_BADGE_STYLE, config.style);
        badge.textContent = config.text;
        return badge;
    }

    // 查找有效容器
    function findContainer(svgElement) {
        let container = svgElement.closest('div');
        return container || svgElement.parentElement?.parentElement?.parentElement;
    }

    // 处理SVG元素
    function processSVG(svgElement) {
        if (svgElement.dataset.processed) return;

        const stateLabel = svgElement.getAttribute('aria-label');
        const matchedConfig = STATE_CONFIGS.find(c => c.labels.includes(stateLabel));

        if (matchedConfig) {
            const container = findContainer(svgElement);
            if (!container) return;

            // 标记已处理
            svgElement.dataset.processed = true;

            // 设置容器定位
            if (getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }

            // 添加角标
            container.appendChild(createBadge(matchedConfig));
        }
    }

    // 初始化观察器
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 处理直接添加的SVG
                    if (node.tagName === 'SVG') processSVG(node);

                    // 处理嵌套的SVG
                    node.querySelectorAll('svg').forEach(processSVG);
                }
            });
        });
    });

    // 启动观察
    observer.observe(document.documentElement, {
        subtree: true,
        childList: true
    });

    // 初始处理
    document.querySelectorAll('svg').forEach(processSVG);
})();