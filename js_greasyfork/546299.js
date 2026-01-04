// ==UserScript==
// @name         DaoVerse Hero Analysis
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enhanced hero battle power calculator for DaoVerse with display controls
// @author       You
// @match        https://www.daoverse.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=daoverse.pro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546299/DaoVerse%20Hero%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/546299/DaoVerse%20Hero%20Analysis.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 职业属性权重配置
    const jobs = {
        "道士": { main: "悟性", sub: "神識", weights: { main: 1, sub: 0.8 } },
        "遊俠": { main: "真氣", sub: "身法", weights: { main: 1, sub: 0.8 } },
        "影修": { main: "身法", sub: "真氣", weights: { main: 1, sub: 0.8 } },
        "劍修": { main: "真氣", sub: "根骨", weights: { main: 1, sub: 0.8 } },
    };

    // 线性回归模型参数
    const slope = 0.00119457551417354;
    const intercept = 0.010624752368260049;

    // 样式配置
    const STYLES = {
        container: `
            margin-top:15px;
            padding: 6px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 4px;
            font-size: 16px;
            line-height: 1.4;
            color: #ffd700;
            font-weight: bold;
            border: 1px solid #444;
        `,
        mainValue: `color: #4caf50;`,
        subInfo: `font-size: 16px; opacity: 0.9;`,
        highlightValue: `color: #ff9800; font-weight: bold;`,

        // 完整的简约模式CSS
        minimalModeCSS: `
            /* 简约模式全局样式 */
            .MarketHeroCard_professionImageContainer__V39vZ,
            .MarketHeroCard_marketInfo__3aE13,
            .MarketHeroCard_attributesSection__b2BgP {
                display: none !important;
            }
            .css-1ylolxj, .MarketHeroCard_header__wL9We {
                display: none !important;
            }
            .MarketHeroCard_card__deSlg {
                height: auto !important;
                min-height: 100px !important;
            }
            .HeroMarketTab_heroesGrid__zX4bE {
                grid-template-columns: repeat(auto-fill, minmax(229px, 1fr)) !important;
            }
            .page_contentWrapper__obfCi {
                max-width: 100% !important;
            }
            .MarketHeroCard_professionHeader__3CH84 {
                position: absolute;
                top: 0;
                left: 10px;
            }
            .MarketHeroCard_professionDetails__xMfae {
                position: absolute;
                top: 0;
                right: 10px;
            }
            .MarketHeroCard_priceSection__Ki20g {
                padding: 0 12px !important;
            }
            .MarketHeroCard_priceLabel___DZ5U {
                display: none !important;
            }
        `,

        // 控制按钮样式
        controlButton: `
            background: #2c3e50;
            color: #ecf0f1;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            margin-bottom: 5px;
            width: 120px;
            text-align: center;
        `,
        activeButton: `background: #27ae60;`,
        inactiveButton: `background: #e74c3c;`
    };

    // 显示状态设置
    const displaySettings = {
        showPower: true,
        showAttributes: true,
        showWinRate: true
    };

    // 从本地存储加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('heroAnalysisSettings');
        if (savedSettings) {
            Object.assign(displaySettings, JSON.parse(savedSettings));
        }
    }

    // 保存设置到本地存储
    function saveSettings() {
        localStorage.setItem('heroAnalysisSettings', JSON.stringify(displaySettings));
    }

    // =============== 控制面板 ===============
    function createControlPanel() {
        // 移除旧的控制面板（如果存在）
        const oldPanel = document.getElementById('analysis-control-panel');
        if (oldPanel) oldPanel.remove();

        // 创建控制面板容器
        const controlPanel = document.createElement('div');
        controlPanel.id = 'analysis-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #444;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        // 面板标题
        const title = document.createElement('div');
        title.textContent = '显示控制';
        title.style.cssText = `
            color: #ffd700;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
        `;
        controlPanel.appendChild(title);

        // 创建控制按钮
        const createButton = (text, settingKey) => {
            const button = document.createElement('button');
            button.textContent = text + (displaySettings[settingKey] ? ': 显示' : ': 隐藏');
            button.style.cssText = STYLES.controlButton;
            button.style.background = displaySettings[settingKey] ?
                STYLES.activeButton : STYLES.inactiveButton;

            button.addEventListener('click', () => {
                displaySettings[settingKey] = !displaySettings[settingKey];
                button.textContent = text + (displaySettings[settingKey] ? ': 显示' : ': 隐藏');
                button.style.background = displaySettings[settingKey] ?
                    STYLES.activeButton : STYLES.inactiveButton;

                saveSettings();
                updateAllDisplays();
            });

            return button;
        };

        // 添加控制按钮
        controlPanel.appendChild(createButton('战力', 'showPower'));
        controlPanel.appendChild(createButton('总属性', 'showAttributes'));
        controlPanel.appendChild(createButton('胜率', 'showWinRate'));

        // 简约模式按钮
        const minimalToggle = document.createElement('button');
        minimalToggle.textContent = '简约模式: ' + (document.getElementById('minimal-mode-style')?.textContent ? '开启' : '关闭');
        minimalToggle.style.cssText = STYLES.controlButton;
        minimalToggle.style.background = document.getElementById('minimal-mode-style')?.textContent ?
            STYLES.activeButton : STYLES.controlButton;

        minimalToggle.addEventListener('click', () => {
            const styleTag = document.getElementById('minimal-mode-style');
            if (!styleTag) return;

            const isEnabled = !!styleTag.textContent;
            minimalToggle.textContent = '简约模式: ' + (isEnabled ? '关闭' : '开启');
            minimalToggle.style.background = isEnabled ?
                STYLES.controlButton : STYLES.activeButton;

            styleTag.textContent = isEnabled ? '' : STYLES.minimalModeCSS;
        });

        controlPanel.appendChild(minimalToggle);

        // 添加到文档
        document.body.appendChild(controlPanel);
    }

    // =============== 核心函数 ===============

    // 属性提取
    function extractAttributes(container, selector) {
        const attributes = {};
        container.querySelectorAll(selector).forEach(attr => {
            const text = attr.innerText.trim();
            const colonIndex = text.indexOf(':');
            if (colonIndex !== -1) {
                const attrName = text.substring(0, colonIndex).trim();
                const attrValue = parseInt(text.substring(colonIndex + 1).trim());
                if (!isNaN(attrValue)) attributes[attrName] = attrValue;
            }
        });
        return attributes;
    }

    // 战力计算（包含4级/5级胜率计算）
    function computeBattlePower(professionName, attributes, level) {
        if (!jobs[professionName]) return null;

        const { main, sub, weights } = jobs[professionName];
        const mainValue = attributes[main] || 0;
        const subValue = attributes[sub] || 0;

        const totalAttributes = Object.values(attributes).reduce((sum, val) => sum + val, 0);
        const otherAttributes = Object.keys(attributes).reduce((sum, key) => {
            return (key !== main && key !== sub) ? sum + (attributes[key] || 0) : sum;
        }, 0);

        // 基础战力计算（不含等级加成）
        const basePower = mainValue * weights.main + subValue * weights.sub + otherAttributes * 0.4;

        // 当前等级战力
        const currentBattlePower = Math.round(basePower * (1 + level / 5));

        // 计算各级胜率
        const winRate = (slope * currentBattlePower + intercept) * 100;
        const level4WinRate = (slope * (basePower * (1 + 4 / 5)) + intercept) * 100;
        const level5WinRate = (slope * (basePower * (1 + 5 / 5)) + intercept) * 100;

        return {
            battlePower: currentBattlePower,
            winRate: winRate.toFixed(2),
            level4WinRate: level4WinRate.toFixed(2),
            level5WinRate: level5WinRate.toFixed(2),
            mainValue,
            subValue,
            otherValue: otherAttributes,
            totalAttributes
        };
    }

    // 创建战力显示元素（包含4级/5级胜率）
    function createBattlePowerElement(results) {
        const container = document.createElement('div');
        container.className = 'battle-power-container';
        container.style.cssText = STYLES.container;

        // 根据设置决定显示内容
        container.innerHTML = `
            ${displaySettings.showPower ? `<div>战力: <span style="${STYLES.mainValue}">${results.battlePower}</span></div>` : ''}
            ${displaySettings.showAttributes ? `<div>总属性: <span style="${STYLES.highlightValue}">${results.totalAttributes}</span></div>` : ''}
            ${displaySettings.showWinRate ? `
                <div>胜率: ${results.winRate}%</div>
                <div style="${STYLES.subInfo}">
                    4级: ${results.level4WinRate}% | 5级: ${results.level5WinRate}%
                </div>
            ` : ''}
        `;

        return container;
    }

    // 更新所有显示
    function updateAllDisplays() {
        // 移除所有现有的战力容器
        document.querySelectorAll('.battle-power-container').forEach(el => el.remove());

        // 重新处理所有卡片
        processAllCards();
    }

    // 处理质押卡片
    function processStakingCard(card) {
        const profession = card.querySelector('.StakingHeroItem_professionName__c7Pl1')?.innerText || '未知职业';
        const levelText = card.querySelector('.StakingHeroItem_heroLevel__IBTd0')?.innerText || '等级 0';
        const level = parseInt(levelText.replace('等級 ', '')) || 0;

        const attributes = extractAttributes(card, '.StakingHeroItem_attributeChip__lEVuu .MuiChip-label');
        const results = computeBattlePower(profession, attributes, level);
        if (!results) return;

        const battlePowerElem = createBattlePowerElement(results);
        const rewardInfo = card.querySelector('.StakingHeroItem_rewardInfo__AcbGD');

        if (rewardInfo) {
            rewardInfo.parentNode.insertBefore(battlePowerElem, rewardInfo.nextSibling);
        } else {
            card.appendChild(battlePowerElem);
        }
    }

    // 处理市场卡片
    function processMarketCard(card) {
        const professionElement = card.querySelector('.MarketHeroCard_professionName__TodRS');
        const levelElement = card.querySelector('.MarketHeroCard_professionDetails__xMfae');
        if (!professionElement || !levelElement) return;

        const professionName = professionElement.innerText;
        const levelText = levelElement.innerText;
        const levelMatch = levelText.match(/等級 (\d+)/);
        const level = levelMatch ? parseInt(levelMatch[1]) : 0;

        const attributes = extractAttributes(card, '.MuiChip-label');
        const results = computeBattlePower(professionName, attributes, level);
        if (!results) return;

        const battlePowerContainer = createBattlePowerElement(results);
        const breedingChip = card.querySelector('.MuiChip-root.MuiChip-filled.MuiChip-colorSuccess');

        if (breedingChip) {
            breedingChip.parentNode.insertBefore(battlePowerContainer, breedingChip.nextSibling);
        } else {
            card.appendChild(battlePowerContainer);
        }
    }


        // 处理我的英雄卡片
    function processMyCard(card) {
        //职业
        const professionElement = card.querySelector('.HeroCard_professionName__7Pzm3');
        //等级
        const levelElement = card.querySelector('.HeroCard_professionDetails__wj_jr');
        if (!professionElement || !levelElement) return;

        const professionName = professionElement.innerText;
        const levelText = levelElement.innerText;
        const levelMatch = levelText.match(/等級 (\d+)/);
        const level = levelMatch ? parseInt(levelMatch[1]) : 0;

        const attributes = extractAttributes(card, '.MuiChip-label');
        const results = computeBattlePower(professionName, attributes, level);
        if (!results) return;

        const battlePowerContainer = createBattlePowerElement(results);
        const breedingChip = card.querySelector('.MuiChip-root.MuiChip-filled.MuiChip-colorSuccess');

        if (breedingChip) {
            breedingChip.parentNode.insertBefore(battlePowerContainer, breedingChip.nextSibling);
        } else {
            card.appendChild(battlePowerContainer);
        }
    }

    // 主处理函数
    function processAllCards() {
        // 移除所有现有战力元素
        document.querySelectorAll('.battle-power-container').forEach(el => el.remove());

        // 处理质押卡片
        document.querySelectorAll('.StakingHeroItem_heroCard__1DH_W').forEach(processStakingCard);

        // 处理市场卡片
        document.querySelectorAll('.MarketHeroCard_cardContent__n4KNW').forEach(processMarketCard);

        //处理我的英雄
       document.querySelectorAll('.HeroCard_cardContent__jju_k').forEach(processMyCard);

    }

    // 初始化
    function init() {
        // 加载设置
        loadSettings();

        // 初始化简约模式样式
        if (!document.getElementById('minimal-mode-style')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'minimal-mode-style';
            document.head.appendChild(styleTag);
        }

        // 创建控制面板
        createControlPanel();

        // 执行主处理
        processAllCards();

        // 使用定时器定期刷新
        setInterval(processAllCards, 3000);
    }

    // 启动脚本
    init();
})();