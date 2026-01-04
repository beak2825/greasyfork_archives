// ==UserScript==
// @name         Manarion helper
// @name:zh-CN   Manarion 助手
// @name:en      Manarion helper
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Manarion calculation tool with combat/gathering efficiency calculator, ROI analysis, and dark mode. For issues, please /whisper LemonApostle in-game.
// @description:zh-CN  Manarion 游戏多功能数据计算器。提供战斗/采集效率计算、投资回报率(ROI)分析、黑暗模式、中英文切换等功能。如果出现任何问题，可以游戏内私信 LemonApostle。
// @author       LemonApostle
// @match        https://manarion.com/*
// @match        https://*.manarion.com/*
// @icon         https://s2.loli.net/2025/05/28/YmWGhwXJVHonOsI.png
// @grant        GM_xmlhttpRequest
// @connect      api.manarion.com
// @run-at       document-end
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/546781-manarion-helper
// @supportURL   https://greasyfork.org/zh-CN/scripts/546781-manarion-helper/feedback
// @downloadURL https://update.greasyfork.org/scripts/546781/Manarion%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546781/Manarion%20helper.meta.js
// ==/UserScript==

if (window.top !== window) return;

(function() {
    'use strict';

    if (window.top !== window) return;

    function getFullHTMLContent() { return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate-key="title">计算器</title>
    <style>
        /* --- THEME COLORS USING CSS VARIABLES --- */
        :root {
            --bg-gradient-start: #667eea;
            --bg-gradient-end: #764ba2;
            --container-bg: rgba(255, 255, 255, 0.95);
            --card-bg: #ffffff;
            --section-bg: #f8f9fa;
            --input-bg: #f9f9f9;
            --button-gradient-start: #667eea;
            --button-gradient-end: #764ba2;
            --text-color: #333;
            --text-color-light: #666;
            --border-color: #e0e0e0;
            --input-border-color: #ddd;
            --accent-border-color: #667eea;
            --success-bg: #d4edda;
            --success-text: #155724;
            --success-border: #28a745;
            --error-bg: #f8d7da;
            --error-text: #721c24;
            --error-border: #dc3545;
            --note-bg: #e3f2fd;
            --note-text: #1565c0;
            --note-border: #bbdefb;
            --calc-result-bg: #e8f5e8;
            --calc-result-text: #2e7d2e;
            --result-content-bg: #f5f5f5;
            --loading-bg: #cce5ff;
            --loading-text: #004085;
            --loading-border: #b8daff;
        }

        body.dark {
            --bg-gradient-start: oklch(20% .07 262.5);
            --bg-gradient-end: oklch(4.8% .02 262.5);
            --container-bg: oklch(12% .05 262.5 / .95);
            --card-bg: oklch(17.2% .07 262.5);
            --section-bg: oklch(15% .06 262.5);
            --input-bg: oklch(20% .07 262.5);
            --button-gradient-start: oklch(52.5% .23 290);
            --button-gradient-end: oklch(59.8% .26 292);
            --text-color: oklch(98.1% .004 257.1);
            --text-color-light: oklch(67.3% .03 270);
            --border-color: oklch(25% .07 262.5);
            --input-border-color: oklch(30% .07 262.5);
            --accent-border-color: oklch(52.5% .23 290);
            --success-bg: oklch(25% .1 149);
            --success-text: oklch(85% .2 149);
            --success-border: oklch(72.3% .219 149.579);
            --error-bg: oklch(25% .1 27);
            --error-text: oklch(85% .2 27);
            --error-border: oklch(63% .25 27);
            --note-bg: oklch(25% .1 259);
            --note-text: oklch(85% .2 259);
            --note-border: oklch(62.3% .214 259.815);
            --calc-result-bg: oklch(20% .08 149);
            --calc-result-text: oklch(85% .2 149);
            --result-content-bg: oklch(22% .07 262.5);
            --loading-bg: oklch(25% .1 259);
            --loading-text: oklch(85% .2 259);
            --loading-border: oklch(62.3% .214 259.815);
        }
        /* --- END THEME COLORS --- */

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
            color: var(--text-color);
            min-height: 100vh;
            box-sizing: border-box; 
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .container {
            background: var(--container-bg);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        }
        
        h1 {
            color: var(--text-color);
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .header-buttons {
            display: flex;
            gap: 10px;
        }
        
        .input-section {
            background: var(--section-bg);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid var(--accent-border-color);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 15px;
        }
        
        input[type="text"] {
            flex-grow: 1;
            min-width: 0;
            padding: 12px;
            border: 2px solid var(--input-border-color);
            background-color: var(--input-bg);
            color: var(--text-color);
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s, background-color 0.3s ease;
        }
        
        input[type="text"]:focus {
            outline: none;
            border-color: var(--accent-border-color);
            box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent-border-color) 20%, transparent);
        }
        
        button, .calc-button {
            background: linear-gradient(45deg, var(--button-gradient-start), var(--button-gradient-end));
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            flex-shrink: 0;
        }
        button { padding: 12px 24px; font-size: 16px; }
        .calc-button { padding: 8px 16px; font-size: 14px; }

        .button-grid {
            display: grid;
            grid-template-columns: 1fr 1fr; 
            gap: 10px; 
            margin-top: 15px; 
        }

        .info-card-button {
            background: linear-gradient(45deg, var(--button-gradient-start), var(--button-gradient-end));
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            flex-shrink: 0;
            padding: 6px 10px; 
            font-size: 13px;   
            width: 100%;       
        }
        
        button:hover, .calc-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px color-mix(in oklab, var(--button-gradient-start) 40%, transparent);
        }
        
        button:disabled, .calc-button:disabled {
            background: var(--text-color-light);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .theme-toggle-button {
            background: var(--container-bg);
            color: var(--accent-border-color);
            border: 2px solid var(--accent-border-color);
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .theme-toggle-button:hover {
            background: var(--accent-border-color);
            color: var(--card-bg);
        }

        .usage-note {
            background: var(--note-bg);
            border: 1px solid var(--note-border);
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 15px;
            color: var(--note-text);
            font-size: 14px;
        }

        .calc-input,
        .calc-input-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0;
            gap: 15px;
        }

        .calc-input label,
        .calc-input-group label {
            flex-shrink: 0;
            font-weight: 500;
            color: var(--text-color);
            padding-right: 10px;
        }

        .calc-input .input-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-grow: 1;
            justify-content: flex-end;
        }

        #gatheringType, #gatheringType2 {
            padding: 8px;
            border: 1px solid var(--input-border-color);
            background-color: var(--input-bg);
            color: var(--text-color);
            border-radius: 4px;
            min-width: 120px;
        }
        
        .player-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px; 
            margin-bottom: 20px;
        }
        
        .info-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 15px; 
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        .info-card h3,
        .input-section h3,
        .calculator-section h3 {
            margin: 0 0 10px 0;
            font-size: 1.1em;
            color: var(--text-color); /* This is the key line */
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 6px 0; 
            gap: 10px;
            padding: 2px 0;
        }
        
        .stat-label {
            font-size: 0.9em;
            color: var(--text-color-light);
            font-weight: 500;
            min-width: 160px; 
            flex-shrink: 0; 
        }
        
        .stat-value {
            font-weight: bold;
            color: var(--text-color);
        }
        
        .stat-suffix {
            margin-left: 4px;
            color: var(--text-color-light);
            flex-shrink: 0;
        }

        .stat-input {
            width: 80px;
            padding: 3px 6px;
            border: 1px solid var(--input-border-color);
            background: var(--input-bg);
            color: var(--text-color);
            border-radius: 4px;
            text-align: right;
            font-size: 0.9em;
        }
        
        .stat-input:focus {
            outline: none;
            border-color: var(--accent-border-color);
            background: var(--card-bg);
        }
        
        .success, .error, .loading { 
            padding: 15px; 
            border-radius: 8px; 
            margin: 10px 0; 
            border-left: 4px solid; 
        }

        .error { background-color: var(--error-bg); color: var(--error-text); border-color: var(--error-border); }
        .success { background-color: var(--success-bg); color: var(--success-text); border-color: var(--success-border); }
        .loading { background-color: var(--loading-bg); color: var(--loading-text); border-color: var(--loading-border); text-align: center; }

        .calculator-section {
            background: var(--section-bg);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 4px solid var(--success-border);
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        .calc-result {
            background: var(--calc-result-bg);
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            font-weight: bold;
            color: var(--calc-result-text);
            word-wrap: break-word;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .result-content-box {
            font-family: monospace;
            background-color: var(--result-content-bg);
            color: inherit;
            padding: 10px;
            border-radius: 5px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .result-grid {
            display: grid;
            grid-template-columns: auto 1fr 1fr;
            column-gap: 20px; 
            row-gap: 5px;     
            margin-top: 10px;
            margin-bottom: 15px;
        }

        .result-grid > span {
            font-family: monospace;
            font-size: 0.9em;
        }

        .result-grid > .grid-header {
            font-weight: bold;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 4px;
        }

        .result-grid > span:nth-child(3n + 2),
        .result-grid > span:nth-child(3n + 3) {
            text-align: right;
        }

        @media (max-width: 768px) {
            body { padding: 10px; }
            .container { padding: 15px; }
            h1 { font-size: 1.8em; }
            .header-buttons { margin-left: auto; }
            .container > div:first-child { flex-direction: row; align-items: center; }
            .input-group { flex-direction: column; align-items: stretch; }
            .calc-input { flex-direction: column; align-items: stretch; gap: 8px; }
            .calc-input label { padding-right: 0; }
            .calc-input .input-controls { flex-direction: column; align-items: stretch; width: 100%; gap: 8px; }
            .calc-button { width: 100%; }
        }

        /* 0.8.0 */
        .accordion-category {
            margin-bottom: 5px;
        }

        .accordion-header {
            background-color: var(--section-bg);
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            transition: background-color 0.2s ease;
        }

        .accordion-header:hover {
            background-color: color-mix(in oklab, var(--section-bg) 70%, #000);
        }

        .accordion-arrow {
            transition: transform 0.3s ease;
        }

        .accordion-header.open .accordion-arrow {
            transform: rotate(90deg);
        }

        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background-color: color-mix(in oklab, var(--result-content-bg) 50%, transparent);
            border-radius: 0 0 4px 4px;
        }

        .accordion-content table {
            margin: 0;
        }

        .calc-input-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap; /* Allow wrapping on small screens */
        }

        #elnaeth-settings-button,
        #elnaeth-modal-overlay {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        ;
    </style>
</head>
<body>
    <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h1 style="margin: 0; flex: 1; text-align: center;" data-translate-key="mainTitle">🏰 Manarion 数据计算器</h1>
            <div class="header-buttons">
                <button id="langToggle" class="theme-toggle-button" onclick="toggleLanguage()" data-translate-key="langToggle" style="min-width: 60px; border-radius: 20px; padding-left: 12px; padding-right: 12px; width: auto;"></button>
                <button id="themeToggle" class="theme-toggle-button" onclick="toggleTheme()">
                    <span id="themeIcon">🌙</span>
                </button>
            </div>
        </div>
        
        <div class="input-section">
            <h3 data-translate-key="getPlayerData">📊 获取玩家数据</h3>
            <div class="input-group">
                <input type="text" id="playerName" data-translate-key="playerNamePlaceholder" placeholder="输入玩家名称或ID" value="LemonApostle">
                <button onclick="fetchPlayerData()" data-translate-key="fetchData">获取数据</button>
            </div>
            <div id="message"></div>
        </div>
        
        <div id="playerData" style="display:none;">
            <div class="player-info">
                <div class="info-card"><h3 data-translate-key="basicInfo">基本信息</h3><div id="basicInfo"></div></div>
                <div class="info-card"><h3 data-translate-key="gatheringBoosts">采集加成</h3><div id="gatheringBoosts"></div></div>
                <div class="info-card"><h3 data-translate-key="codexBoosts">法典加成</h3><div id="codexBoosts"></div></div>
                <div class="info-card"><h3 data-translate-key="otherEquipmentBoosts">其他装备加成</h3><div id="otherEquipmentBoosts"></div></div>
                <div class="info-card"><h3 data-translate-key="farm">农场</h3><div id="farmBoosts"></div></div>
                <div class="info-card"><h3 data-translate-key="marketPrice">市场价格</h3><div id="marketPrice"></div></div>
                <div class="info-card"><h3 data-translate-key="needToSupplement">需要自己补充的内容</h3><div id="needToSupplement"></div></div>
            </div>
        </div>
        
        <div class="calculator-section">
            <h3 data-translate-key="dataCalculator">🧮 数据计算器</h3>
            <div class="usage-note">
                <strong data-translate-key="usageNoteTitle">使用说明：</strong>
                <span data-translate-key="usageNote">填完必要的数据后，先点击"更新数据"按钮，再点击其他计算按钮。</span>
            </div>
            <div class="calc-input">
                <label data-translate-key="getAllCurrentValues">获取当前所有数据:</label>
                <button class="calc-button" onclick="getAllCurrentValues()" data-translate-key="updateData">更新数据</button>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateCombat">战斗计算:</label>
                <button class="calc-button" onclick="calculateCombatEfficiency()" data-translate-key="calculateCombatEfficiency">计算战斗效率</button>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateGathering">采集效率计算:</label>
                <div class="input-controls">
                    <select id="gatheringType">
                        <option value="mining" data-translate-key="miningOption">挖矿</option>
                        <option value="fishing" data-translate-key="fishingOption">钓鱼</option>
                        <option value="woodcutting" data-translate-key="woodcuttingOption">伐木</option>
                    </select>
                    <button class="calc-button" onclick="calculateGatheringEfficiency()" data-translate-key="calculateGatheringEfficiency">计算采集效率</button>
                </div>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateResonance">回响药水最佳等级计算:</label>
                <button class="calc-button" onclick="calculateResonancePotionLevel()" data-translate-key="calculateLevel">计算等级</button>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateROI">采集投资回报率计算:</label>
                <div class="input-controls">
                    <select id="gatheringType2">
                        <option value="mining" data-translate-key="miningOption">挖矿</option>
                        <option value="fishing" data-translate-key="fishingOption">钓鱼</option>
                        <option value="woodcutting" data-translate-key="woodcuttingOption">伐木</option>
                    </select>
                    <button class="calc-button" onclick="calculateGatheringROI()" data-translate-key="calculateGatheringROI">计算采集投资回报率</button>
                </div>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateCombatROI">战斗投资回报率计算:</label>
                <button class="calc-button" onclick="calculateCombatROI()" data-translate-key="calculateCombatROIButton">计算战斗投资回报率</button>
            </div>
            <div class="calc-input-group">
                <label data-translate-key="calculateInvestedNetWorth">已投资净值计算:</label>
                <div class="input-controls">
                    <button id="getRankButton" class="calc-button" onclick="getRank()" data-translate-key="getRank">获取排名</button>
                    <button class="calc-button" onclick="showTotalInvestedNetWorth()" data-translate-key="calculateInvestedNetWorthButton">计算已投资净值</button>
                </div>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateGatherEquip">采集装备替换检测:</label>
                <button class="calc-button" onclick="calculateGatherEquipReplace()" data-translate-key="detectGatherEquip">检测采集装备替换</button>
            </div>
            <div class="calc-input">
                <label data-translate-key="calculateBattleEquip">战斗装备替换检测:</label>
                <button class="calc-button" onclick="calculateBattlerEquipReplace()" data-translate-key="detectBattleEquip">检测战斗装备替换</button>
            </div>
            <div id="calcResults"></div>
        </div>
    </div>

    <script>
let values = null;
let globalPlayerData = null;
let globalMarketData = null;
let manarionHelperRank = null;
let currentLanguage = localStorage.getItem('manarion-language') || 'zh';
let currentTheme = localStorage.getItem('manarion-theme') || 'light';

const translations = {
    en: {
        // General UI
        langToggle: "中/EN",
        fetchData: "Get Data",
        updateData: "Update Data",
        playerNamePlaceholder: "Enter player name or ID",
        getPlayerData: "📊 Get Player Data",
        dataCalculator: "🧮 Data Calculator",
        usageNoteTitle: "Instructions:",
        usageNote: "After filling in necessary data, click 'Update Data' first, then other calculation buttons.",
        mainTitle: "🏰 Manarion Data Calculator", 


        // Titles
        basicInfo: "Basic Info",
        gatheringBoosts: "Gathering Boosts",
        codexBoosts: "Codex Boosts",
        otherEquipmentBoosts: "Other Equipment Boosts",
        farm: "Farm",
        marketPrice: "Market Price",
        needToSupplement: "Manual Input",

        // Basic Info Labels
        playerName: "Player Name:",
        currentEnemy: "Current Enemy:",
        battleLevel: "Battle Level:",
        miningLevel: "Mining Level:",
        fishingLevel: "Fishing Level:",
        woodcuttingLevel: "Woodcutting Level:",

        // Gathering Boosts Labels
        mining: "Mining:",
        fishing: "Fishing:",
        woodcutting: "Woodcutting:",
        baseResourceBoost: "Base Resource Amount:",

        // Codex Boosts Labels
        codexManaDust: "Base Mana Dust:",
        codexBaseResource: "Base Resource:",
        codexDropBoost: "Drop Boost:",

        // Other Equipment Boosts Labels
        manaBoost: "Mana Dust:",
        shardBoost: "Elemental Shards:",
        potionBoost: "Potion Boost:",

        // Farm Labels
        harvestGolem: "Harvest Golem:",
        fertilizer: "Fertilizer:",
        farmPlots: "Farm Plots:",
        farmHerbHarvest: "Herb Harvest:",
        farmTax: "Tax:",

        // Market Price Labels
        shardPrice: "Elemental Shards:",
        codexPrice: "Codex:",
        fishPrice: "Fish:",
        woodPrice: "Wood:",
        ironPrice: "Iron:",
        sagerootPrice: "Sageroot:",
        bloomwellPrice: "Bloomwell:",

        // Manual Input Labels
        guildLevel: "Guild Level:",
        guildNexusCrystalLevel: "Nexus Crystal Level:",
        guildManaTax: "Guild Mana Tax:",
        guildResourceTax: "Guild Resource Tax:",
        guildShardTax: "Guild Shard Tax:",
        wisdomPotionLevel: "Wisdom Potion Level:",
        harvestingPotionLevel: "Harvesting Potion Level:",
        resonancePotionLevel: "Resonance Potion Level:",
        fillGuildInfo: "Fill My Guild Info",    
        fillPotionInfo: "Fill My Potion Info",
        
        // Calculator Buttons
        getAllCurrentValues: "Get current data:",
        calculateCombat: "Combat Calculation:",
        calculateCombatEfficiency: "Calculate Combat Efficiency",
        calculateGathering: "Gathering Efficiency:",
        calculateGatheringEfficiency: "Calculate Gathering Efficiency",
        calculateResonance: "Optimal Resonance Potion Level:",
        calculateLevel: "Calculate Level",
        calculateROI: "Gathering ROI:",
        calculateGatheringROI: "Calculate Gathering ROI",
        calculateCombatROI: "Combat ROI:",
        calculateCombatROIButton: "Calculate Combat ROI",
        calculateInvestedNetWorth: "Invested Net Worth:",
        calculateInvestedNetWorthButton: "Calculate Invested Net Worth",
        calculateGatherEquip: "Gathering Equipment Replacement:",
        detectGatherEquip: "Detect Gather Equip Replace",
        calculateBattleEquip: "Battle Equipment Replacement:",
        detectBattleEquip: "Detect Battle Equip Replace",
        
        // Select Options
        miningOption: "Mining",
        fishingOption: "Fishing",
        woodcuttingOption: "Woodcutting",

        // Messages
        enterPlayerNameError: "Please enter a player name",
        fetchingData: "Fetching data...",
        fetchDataError: "Failed to fetch data. Possible reasons: 1. API is temporarily unavailable 2. Player name does not exist 3. Network connection issue",
        fetchSuccess: "Data fetched successfully!",
        showExampleData: "Showing example data",
        loadSavedData: "Loading saved data for user: ",
        fillPotionSuccess: "Potion levels have been filled from your belt.",
        fillGuildSuccess: "Guild info has been filled based on your current rank.",

        // Calculation Results
        currentDataSnapshot: "Current data snapshot. If there are large discrepancies, please check if the content here is correct:",
        basicInfoTitle: "Basic Info:",
        skillLevels: "Skill Levels: Mining \${miningLevel} Fishing \${fishingLevel} Woodcutting \${woodcuttingLevel}",
        gatheringBoostsTitle: "Gathering Boosts:",
        baseResourceAmount: "Base Resource Amount: \${baseResourceAmountTotal}",
        codexBoostsTitle: "Codex Boosts:",
        equipmentBoostsTitle: "Equipment Boosts:",
        farmSystemTitle: "Farm System:",
        herbHarvest: "Herb Harvest: \${farmHerbHarvest}/h, Tax: \${farmTax}/h",
        marketPricesTitle: "Market Prices:",
        manualInputTitle: "Manual Input:",
        guildTaxRates: "Guild Mana Tax: \${guildManaTax}%, Guild Resource Tax: \${guildResonanceTax}%, Guild Shard Tax: \${guildShardTax}%",
        potionLevels: "Wisdom Potion Level: \${wisdomPotionLevel}, Harvesting Potion Level: \${harvestingPotionLevel}, Resonance Potion Level: \${resonancePotionLevel}",
        manaPerDay: "Mana Dust per day",
        shardRangePerAction: "Shards per action (after tax)",
        shardsPerDay: "Shards per day",
        shardsDailyValue: "Shards daily value",
        sagerootHourlyProduction: "Sageroot hourly production",
        bloomwellHourlyProduction: "Bloomwell hourly production",
        sagerootHourlyConsumption: "Sageroot hourly consumption",
        bloomwellHourlyConsumption: "Bloomwell hourly consumption",
        sagerootNetProduction: "Sageroot net hourly production",
        bloomwellNetProduction: "Bloomwell net hourly production",
        sagerootDailyProfit: "Sageroot daily net profit",
        bloomwellDailyProfit: "Bloomwell daily net profit",
        farmDailyMaintenance: "Farm daily maintenance cost",
        farmDailyValue: "Farm daily value",
        dailyIncome: "Daily income",
        category: "Category",
        farmDetailsTitle: "Farm Details",            
        sagerootHeader: "Sageroot",                
        bloomwellHeader: "Bloomwell",              
        hourlyProd: "Hourly Production",           
        hourlyCons: "Hourly Consumption",          
        netHourlyProd: "Net Hourly Production",    
        netDailyProd: "Net Daily Production",      
        dailyNetProfit: "Daily Net Profit",
        resourcePerAction: "Resource per action:",
        resourcePerDay: "Resource per day:",
        resourcePrice: "Resource price:",
        resourceDailyValue: "Resource daily value:",
        optimalResonanceLevel: "Optimal Resonance Potion Level:",
        comparedToLevel0: "Compared to level 0 potion",
        extraFarmConsumption: "Extra farm consumption:",
        extraIncome: "Extra income:",
        increasedIncome: "Increased income:",
        gatheringROIComparison: "\${gatheringType} Investment ROI Comparison:",
        cost: "Cost:",
        extraDailyProfit: "Extra Daily Profit:",
        paybackPeriod: "Payback (Days):",
        combatROIComparison: "Combat Investment ROI Comparison:",
        totalInvestedNetWorth: "Total Invested Net Worth:",
        battleBoostsLabel: "Battle Boosts (Total)",
        codexTotalLabel: "Codex (Total)",
        potionBoostLabel: "Potion Boost",
        researchTotalLabel: "Research (Total)",
        baseResourceLabel: "Base Resource",
        farmTotalLabel: "Farm (Total)",
        investments: {
            research: "Research Boost 3000 levels",
            baseResource: "Base Resource 100 levels",
            codexBase: "Codex Base Resource 5 levels",
            potion: "Potion Boost 5 levels",
            codexDrop: "Codex Drop Rate 5 levels(only calculate for elemental shards)",
            farm: "Farm total 300 levels",
            codexMana: "Codex Mana Dust 5 levels",
            enemyLevel: "Increase enemy level by 100"
        },
        gatherEquipReplaceTitle: "Gathering Equipment Replacement",
        gatherEquipReplaceDesc: "Analyzes if replacing a base resource item with an elemental shard item (or vice versa) is profitable, while keeping total base resources constant by adjusting potion levels. (calculates for the lowest value item).",
        gatherEquipReplaceNote: "Note: The gathering type is determined by the selection box next to the 'Calculate Gathering Efficiency' button.",
        noBaseResourceEquip: "No base resource equipment found, ending check.",
        currentPotionLevel: "Current potion level:",
        newPotionLevel: "New potion level after replacement:",
        canReplaceGatherEquip: "Current base resource equipment: \${name} can be replaced with elemental shard equipment.",
        canReplaceGatherEquip: "Current elemental shard equipment: \${name} can be replaced with base resource equipment.",
        baseResourceAmountLost: "Base resource amount from equipment: \${amount}, can be replaced with elemental shard boost \${shardBoost}%",
        manaIncreaseAfterReplace: "Daily mana dust increase after replacement",
        farmCostIncreaseAfterReplace: "Daily farm cost increase after replacement",
        incomeIncreaseAfterReplace: "Daily income increase after replacement",
        cannotReplaceGatherEquip: "It seems replacement is not beneficial with the current potion level and gear. Ending check.",
        battleEquipReplaceTitle: "Battle Equipment Replacement",
        battleEquipReplaceDesc: "Analyzes if replacing an experience item with a mana dust/elemental shard item (or vice versa) is profitable, while keeping total experience gain constant by adjusting potion levels. (calculates for the lowest value item).",
        incomeChange: "Gross Income Change",
        potionCostChange: "Potion Cost Change",
        netIncomeChange: "Net Income Change",
        comparedToCurrentLevel: "Compared to your current level (\${currentLevel})",
        consumptionChange: "Consumption Change", 
        noExpEquip: "No experience boost equipment found",
        canReplaceBattleEquipToMana: "Current experience equipment: \${name} can be replaced with mana dust equipment.",
        canReplaceBattleEquipToShard: "Current experience equipment: \${name} can be replaced with elemental shard equipment.",
        canReplaceManaEquipToExp: "Current mana dust equipment: \${name} can be replaced with experience equipment.",
        canReplaceShardEquipToExp: "Current elemental shard equipment: \${name} can be replaced with experience equipment.",
        maxLevelWarning: "Already at max level (100), cannot upgrade further.",
        fillButtonNote: "<strong>Note:</strong> To use these buttons, please open your in-game Guild panel at least once first.", 
        cannotReplaceBattleEquip: "It seems replacement is not beneficial with the current potion level and gear. Ending check.",
        investmentDetails: "Investment Details:",
        summaryByCategory: "Summary by Category:",
        dustCategory: "Dust",
        shardBattleCategory: "Shard (Battle)",
        shardGatherCategory: "Shard (Gather)",
        codexCategory: "Codex",
        farmCategory: "Farm",
        categories: {
            basePower: "Base Power",
            combatSkills: "Combat Skills",
            enchants: "Enchants",
            gathering: "Gathering",
            codex: "Codex",
            farm: "Farm & Potions"
        },
        getRank: "Get Ranks",
        rank: "Rank",
        fetchPlayerDataFirst: "Please fetch player data first.",
        fetchingButton: "Fetching...",
        fetchingRanksInitial: "Fetching ranks for \${playerName}... (0/\${total})",
        fetchingRanksProgress: "Fetching ranks for \${playerName}... (\${completed}/\${total}) - Checking '\${type}'",
        fetchingRanksSuccess: "Successfully fetched all rank data for \${playerName}.",
        fetchingRanksError: "An error occurred while fetching ranks.",
        potionDuration: "Potion Duration:",
        fillGuildSuccess: "Guild info has been filled based on your current rank.",
        fillGuildErrorRoster: "Error: Guild roster data is unavailable or not yet loaded. Please open the guild panel in-game and try again.",
        fillGuildErrorPlayerNotFound: "Error: Could not find your character in the guild roster.",
        fillGuildErrorRankNotFound: "Error: Could not find your rank information. RankID: ",
        fillGuildErrorGameData: "Error: Cannot access core game data (manarion.guild or manarion.player). Is the game fully loaded?",
    },
    zh: {
        // General UI
        langToggle: "中/EN",
        fetchData: "获取数据",
        updateData: "更新数据",
        playerNamePlaceholder: "输入玩家名称或ID",
        getPlayerData: "📊 获取玩家数据",
        dataCalculator: "🧮 数据计算器",
        usageNoteTitle: "使用说明：",
        usageNote: "填完必要的数据后，先点击“更新数据”按钮，再点击其他计算按钮。",
        mainTitle: "🏰 Manarion 数据计算器", 

        // Titles
        basicInfo: "基本信息",
        gatheringBoosts: "采集加成",
        codexBoosts: "法典加成",
        otherEquipmentBoosts: "其他装备加成",
        farm: "农场",
        marketPrice: "市场价格",
        needToSupplement: "需要自己补充的内容",

        // Basic Info Labels
        playerName: "玩家名:",
        currentEnemy: "当前敌人:",
        battleLevel: "战斗等级:",
        miningLevel: "挖矿等级:",
        fishingLevel: "钓鱼等级:",
        woodcuttingLevel: "伐木等级:",

        // Gathering Boosts Labels
        mining: "挖矿:",
        fishing: "钓鱼:",
        woodcutting: "伐木:",
        baseResourceBoost: "基础资源量:",

        // Codex Boosts Labels
        codexManaDust: "魔法尘:",
        codexBaseResource: "基础资源量:",
        codexDropBoost: "掉落加成:",

        // Other Equipment Boosts Labels
        manaBoost: "魔法尘:",
        shardBoost: "元素碎片:",
        potionBoost: "药水效果:",

        // Farm Labels
        harvestGolem: "收获傀儡:",
        fertilizer: "肥料:",
        farmPlots: "地块:",
        farmHerbHarvest: "草药收获:",
        farmTax: "税收:",

        // Market Price Labels
        shardPrice: "元素碎片:",
        codexPrice: "法典:",
        fishPrice: "鱼:",
        woodPrice: "木:",
        ironPrice: "铁:",
        sagerootPrice: "智慧之根:",
        bloomwellPrice: "繁茂精华:",

        // Manual Input Labels
        guildLevel: "工会等级:",
        guildNexusCrystalLevel: "连结水晶等级:",
        guildManaTax: "工会魔法尘税率:",
        guildResourceTax: "工会资源税率:",
        guildShardTax: "工会碎片税率:",
        wisdomPotionLevel: "智慧药水等级:",
        harvestingPotionLevel: "收获药水等级:",
        resonancePotionLevel: "回响药水等级:",
        fillGuildInfo: "填充自身工会信息",
        fillPotionInfo: "填充自身药水信息",
        fillGuildSuccess: "已根据您的当前职阶填充工会信息。",

        // Calculator Buttons
        getAllCurrentValues: "获取当前所有数据:",
        calculateCombat: "战斗计算:",
        calculateCombatEfficiency: "计算战斗效率",
        calculateGathering: "采集效率计算:",
        calculateGatheringEfficiency: "计算采集效率",
        calculateResonance: "回响药水最佳等级计算:",
        calculateLevel: "计算等级",
        calculateROI: "采集投资回报率计算:",
        calculateGatheringROI: "计算采集投资回报率",
        calculateCombatROI: "战斗投资回报率计算:",
        calculateCombatROIButton: "计算战斗投资回报率",
        calculateInvestedNetWorth: "已投资净值计算:",
        calculateInvestedNetWorthButton: "计算已投资净值",
        calculateGatherEquip: "采集装备替换检测:",
        detectGatherEquip: "检测采集装备替换",
        calculateBattleEquip: "战斗装备替换检测:",
        detectBattleEquip: "检测战斗装备替换",

        // Select Options
        miningOption: "挖矿",
        fishingOption: "钓鱼",
        woodcuttingOption: "伐木",

        // Messages
        enterPlayerNameError: "请输入玩家名称",
        fetchingData: "正在获取数据...",
        fetchDataError: "无法获取数据。可能原因：1. API暂时不可用 2. 玩家名称不存在 3. 网络连接问题",
        fetchSuccess: "数据获取成功！",
        showExampleData: "显示示例数据",
        loadSavedData: "加载已保存的数据 用户名: ",
        fillPotionSuccess: "已从您的药水腰带填充药水等级。",

        // Calculation Results
        currentDataSnapshot: "当前数据快照, 如有大出入，请检查这里的内容是否正确:",
        basicInfoTitle: "基础信息:",
        skillLevels: "技能等级: 挖矿\${miningLevel} 钓鱼\${fishingLevel} 伐木\${woodcuttingLevel}",
        gatheringBoostsTitle: "采集加成:",
        baseResourceAmount: "基础资源量: \${baseResourceAmountTotal}",
        codexBoostsTitle: "法典加成:",
        equipmentBoostsTitle: "装备加成:",
        farmSystemTitle: "农场系统:",
        herbHarvest: "草药收获: \${farmHerbHarvest}/h, 税收: \${farmTax}/h",
        marketPricesTitle: "市场价格:",
        manualInputTitle: "手动输入信息:",
        guildTaxRates: "工会魔法尘税率: \${guildManaTax}%, 工会资源税率: \${guildResonanceTax}%, 工会碎片税率: \${guildShardTax}%",
        potionLevels: "智慧药水等级: \${wisdomPotionLevel}, 收获药水等级: \${harvestingPotionLevel}, 回响药水等级: \${resonancePotionLevel}",
        manaPerDay: "魔法尘每天",
        shardRangePerAction: "税后每动作碎片范围",
        shardsPerDay: "碎片每天",
        shardsDailyValue: "碎片每天价值",
        sagerootHourlyProduction: "慧根每小时产出",
        bloomwellHourlyProduction: "繁茂每小时产出",
        sagerootHourlyConsumption: "慧根每小时消耗",
        bloomwellHourlyConsumption: "繁茂每小时消耗",
        sagerootNetProduction: "慧根每小时净产出",
        bloomwellNetProduction: "繁茂每小时净产出",
        sagerootDailyProfit: "慧根每日净利",
        bloomwellDailyProfit: "繁茂每日净利",
        farmDailyMaintenance: "农场每日维护费",
        farmDailyValue: "农场每天价值",
        dailyIncome: "每日收入",
        farmDetailsTitle: "农场详情",  
        category: "类别",    
        sagerootHeader: "慧根",       
        bloomwellHeader: "繁茂",     
        hourlyProd: "每小时产出",    
        hourlyCons: "每小时消耗",     
        netHourlyProd: "每小时净产出", 
        netDailyProd: "每日净产出",   
        dailyNetProfit: "每日净利",
        resourcePerAction: "资源每动作:",
        resourcePerDay: "资源每天:",
        resourcePrice: "资源价格:",
        resourceDailyValue: "资源每天价值:",
        optimalResonanceLevel: "最佳的碎片药水等级:",
        comparedToLevel0: "相对0级药水",
        extraFarmConsumption: "额外的农场消耗量:",
        extraIncome: "额外的收益:",
        increasedIncome: "提升的收益:",
        gatheringROIComparison: "\${gatheringType} 投资回报率对比:",
        combatROIComparison: "战斗投资回报率对比:",
        totalInvestedNetWorth: "已投资总净值:",
        battleBoostsLabel: "战斗加成 (总计)",
        codexTotalLabel: "法典 (总计)",
        potionBoostLabel: "药水加成",
        researchTotalLabel: "研究 (总计)",
        baseResourceLabel: "基础资源",
        farmTotalLabel: "农场 (总计)",
        cost: "成本:",
        extraDailyProfit: "额外日收益:",
        paybackPeriod: "回本周期 (天):",
        investments: {
            research: "研究加成3000级",
            baseResource: "基础资源100级",
            codexBase: "法典基础5级",
            potion: "药水加成5级",
            codexDrop: "法典掉落5级(只计算了 elemental shards)",
            farm: "农场总共提升300级",
            codexMana: "法典魔法尘5级",
            enemyLevel: "当前怪物等级提升100级"
        },
        maxLevelWarning: "已达满级 (100)，无法继续提升。",
        fillButtonNote: "<strong>注意：</strong> 使用前，请先在游戏中点开一次公会面板。",
        gatherEquipReplaceTitle: "采集装备替换说明",
        gatherEquipReplaceDesc: "通过调整药水等级以维持总基础资源不变，分析将基础资源装备与元素碎片装备相互替换是否能带来更高收益。（每次只会计算最小数值的装备）",
        gatherEquipReplaceNote: "注意：根据【计算采集效率】按钮前面的框的值决定采集类型",
        noBaseResourceEquip: "当前没有找到基础资源加成装备，结束",
        currentPotionLevel: "当前使用的药水等级：",
        newPotionLevel: "替换后使用的药水等级：",
        canReplaceGatherEquip: "当前基础资源加成装备：\${name} 可以被替换为元素碎片加成装备",
        canReplaceGatherEquip2: "当前元素碎片加成装备：\${name} 可以被替换为基础资源加成装备",
        baseResourceAmountLost: "当前基础资源加成装备基础资源量: \${amount} 可以被替换为元素碎片加成 \${shardBoost}%",
        manaIncreaseAfterReplace: "替换后每日魔法尘增加",
        farmCostIncreaseAfterReplace: "替换后每日农场支出增加",
        incomeIncreaseAfterReplace: "替换后每日收入增加",
        cannotReplaceGatherEquip: "看起来现在的药水等级+基础资源装情况，替换不了呢。结束",
        battleEquipReplaceTitle: "战斗装备替换说明",
        battleEquipReplaceDesc: "通过调整药水等级以维持总经验值不变，分析将经验装备与魔法尘/元素碎片装备相互替换是否能带来更高收益。（每次只会计算最小数值的装备）",
        incomeChange: "总收益变化",
        potionCostChange: "药水成本变化",
        netIncomeChange: "净收益变化",
        comparedToCurrentLevel: "与您当前的等级 (\${currentLevel}) 相比",
        consumptionChange: "消耗变化",
        noExpEquip: "当前没有找到经验加成装备",
        canReplaceBattleEquipToMana: "当前经验加成装备：\${name} 可以被替换为 mana dust 装备",
        canReplaceBattleEquipToShard: "当前经验加成装备：\${name} 可以被替换为 elemental shard 装备",
        canReplaceManaEquipToExp: "当前魔法尘装备：\${name} 可以被替换为经验装备",
        canReplaceShardEquipToExp: "当前元素碎片装备：\${name} 可以被替换为经验装备",
        cannotReplaceBattleEquip: "看起来现在的药水等级+经验装情况，替换不了呢。结束",
        investmentDetails: "投资明细：",
        summaryByCategory: "分类汇总：",
        dustCategory: "魔法尘",
        shardBattleCategory: "碎片(战斗)",
        shardGatherCategory: "碎片(采集)",
        codexCategory: "法典",
        farmCategory: "农场",
        categories: {
            basePower: "基础能力",
            combatSkills: "战斗技能",
            enchants: "附魔",
            gathering: "采集",
            codex: "法典",
            farm: "农场与药水"
        },
        getRank: "获取排名",
        rank: "排名",
        fetchPlayerDataFirst: "请先获取玩家数据。",
        fetchingButton: "获取中...",
        fetchingRanksInitial: "正在为 \${playerName} 获取排名... (0/\${total})",
        fetchingRanksProgress: "正在为 \${playerName} 获取排名... (\${completed}/\${total}) - 正在查询 '\${type}'",
        fetchingRanksSuccess: "已成功获取 \${playerName} 的所有排名数据。",
        fetchingRanksError: "获取排名时发生错误。",
        potionDuration: "药水持续时间:",
        fillGuildSuccess: "已根据您的当前职阶填充工会信息。",
        fillGuildErrorRoster: "错误：公会成员列表数据不可用或尚未加载。请在游戏中点开公会面板后再试。",
        fillGuildErrorPlayerNotFound: "错误：在公会成员列表中找不到您的角色信息。",
        fillGuildErrorRankNotFound: "错误：找不到您的职阶信息。RankID: ",
        fillGuildErrorGameData: "错误：无法访问核心游戏数据 (manarion.guild 或 manarion.player)。游戏是否已完全加载？",
    }
};

const boostIdToRankTypeMap = {
    // Base Power
    '1': 'boost_base_spellpower',
    '2': 'boost_base_ward',
    '21': 'highest_damage_spell_rank', // Grouped rank
    '22': 'highest_damage_spell_rank', // Grouped rank
    '23': 'highest_damage_spell_rank', // Grouped rank
    '24': 'boost_mana_shield',
    '83': 'highest_resistance_spell_rank', // Grouped rank
    '84': 'highest_resistance_spell_rank', // Grouped rank
    '85': 'highest_resistance_spell_rank', // Grouped rank
    // Combat Skills
    '40': 'boost_damage',
    '41': 'boost_multicast',
    '42': 'boost_crit_chance',
    '43': 'boost_crit_damage',
    '44': 'boost_haste',
    '45': 'boost_health',
    '46': 'boost_ward',
    '47': 'boost_focus',
    '48': 'boost_mana',
    '49': 'boost_overload',
    '50': 'boost_time_dilation',
    // Gathering
    '30': 'boost_mining',
    '31': 'boost_fishing',
    '32': 'boost_woodcutting',
    '124': 'boost_base_res',
    // Farm & Potions
    '108': 'boost_potion',
    '130': 'farm', // The farm investments (golem, fertilizer, plots) are collectively ranked under 'farm'
    '131': 'farm',
    '132': 'farm',
    // Note: Codex boosts (100-106) and Base Resource (124) do not have direct leaderboards.
};

const manarion = window.parent.manarion;

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('manarion-language', lang);
    updateUIForLanguage();
    document.getElementById('message').innerHTML = '';
    // Re-render data if it exists
    if (globalPlayerData) {
        displayData(globalPlayerData, globalMarketData);
    }
    if (document.getElementById('calcResults').innerHTML.trim() !== '') {
        getAllCurrentValues();
    }
}

function toggleLanguage() {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
}

//#region UI language
function updateUIForLanguage() {
    const t = translations[currentLanguage];
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.dataset.translateKey;
        // 确保key存在于翻译对象中
        if (t && t[key]) {
            const translation = t[key];
            
            // 根据元素类型设置不同的属性
            if (element.tagName === 'INPUT') {
                if(element.type === 'button' || element.type === 'submit' || element.type === 'reset') {
                     element.value = translation;
                } else {
                     element.placeholder = translation;
                }
            } else if (element.tagName === 'OPTION') {
                 element.textContent = translation;
            } else if (element.tagName === 'TITLE') {
                element.textContent = translation;
            }
            else {
                // 适用于 <h1>, <button>, <span>, <strong>, <label>, <h3> 等
                element.innerHTML = translation;
            }
        }
    });
}

//#region Theme
function setTheme(theme) {
    localStorage.setItem('manarion-theme', theme);
    currentTheme = theme;

    const themeIcon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (themeIcon) themeIcon.innerHTML = '☀️'; // Sun icon for switching to light mode
    } else {
        document.body.classList.remove('dark');
        if (themeIcon) themeIcon.innerHTML = '🌙'; // Moon icon for switching to dark mode
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

//#region  global data
function loadGlobalData() {
    try {
        const savedValues = localStorage.getItem('manarion-values');
        const savedPlayerData = localStorage.getItem('manarion-player-data');
        const savedMarketData = localStorage.getItem('manarion-market-data');
        if (savedValues) {
            values = JSON.parse(savedValues);
            console.log('✅ manarion_helper_values LOAD');
            if (values && values.ui) {
                const gatheringType1 = document.getElementById('gatheringType');
                const gatheringType2 = document.getElementById('gatheringType2');
                if (gatheringType1 && values.ui.lastGatheringType) {
                    gatheringType1.value = values.ui.lastGatheringType;
                }
                if (gatheringType2 && values.ui.lastGatheringType2) {
                    gatheringType2.value = values.ui.lastGatheringType2;
                }
            }
        }
        if (savedPlayerData) {
            globalPlayerData = JSON.parse(savedPlayerData);
            const playerNameInput = document.getElementById('playerName');
            if (playerNameInput && globalPlayerData.Name) {
                playerNameInput.value = globalPlayerData.Name;
            }
            console.log('✅ manarion_helper_player_data LOAD');
        }
        if (savedMarketData) {
            globalMarketData = JSON.parse(savedMarketData);
            console.log('✅ manarion_helper_market_data LOAD');
        }
    } catch (error) {
        console.log('❌ manarion_helper_load_data ERROR');
    }
}

function saveGlobalData() {
    try {
        if (values !== null) {
            localStorage.setItem('manarion-values', JSON.stringify(values));
        }
        if (globalPlayerData !== null) {
            localStorage.setItem('manarion-player-data', JSON.stringify(globalPlayerData));
        }
        if (globalMarketData !== null) {
            localStorage.setItem('manarion-market-data', JSON.stringify(globalMarketData));
        }
        console.log('💾 marion_helper_save_data SUCCESS');
    } catch (error) {
        console.log('❌ manarion_helper_save_data ERROR');
    }
}

function removeGlobalData() {
    try {
        localStorage.removeItem('manarion-values');
        localStorage.removeItem('manarion-player-data');
        localStorage.removeItem('manarion-market-data');
        globalMarketData = null;
        globalPlayerData = null;
        values = null;
        console.log('💾 manarion_helper_remove_data SUCCESS');
    } catch (error) {
        console.log('❌ manarion_helper_remove_data ERROR');
    }
}

async function fetchPlayerData() {
    const playerName = document.getElementById('playerName').value.trim();
    let data = null, marketData = null;
    if (!playerName) {
        showMessage(translations[currentLanguage].enterPlayerNameError, 'error');
        return;
    }
    
    showMessage(translations[currentLanguage].fetchingData, 'loading');
    
    try {
        const playerUrl = \`https://api.manarion.com/players/\${encodeURIComponent(playerName)}\`;
        
        data = await window.fetchDataWithGM(playerUrl);
        
    } catch (error) {
        console.error('获取数据失败:', error);
        showExampleData();
        showMessage(translations[currentLanguage].fetchDataError, 'error');
        return;
    }
    
    marketData = await fetchMarketData();
    showMessage(translations[currentLanguage].fetchSuccess, 'success');
    globalPlayerData = data;
    displayData(data, marketData);
    getAllCurrentValues();
    saveGlobalData();
}

async function fetchMarketData() {
    try {
        const marketUrl = 'https://api.manarion.com/market';
        const marketData = await window.fetchDataWithGM(marketUrl);
        globalMarketData = marketData;
        return marketData;
    } catch (error) {
        console.warn('获取市场价格失败:', error);
        return null;
    }
}

// region example data
function showExampleData() {
    const examplePlayerData = {"ID":2582,"Banned":false,"Title":"Scholar","TitleColor":"#b1d852","Name":"LemonApostle","ProfileText":"","Level":2269,"Zone":"blazing_core","Enemy":58000,"MagicType":"water","ActionType":"battle","MiningLevel":636,"FishingLevel":2442,"WoodcuttingLevel":701,"GatherActions":1599128,"Kills":241570,"Deaths":821,"EventActions":138637,"EventPoints":10867920.089814264,"BattleQuestNumber":415,"GatherQuestNumber":903,"BaseBoosts":{"1":1600,"100":100,"101":17,"102":13,"103":16,"105":0,"106":0,"108":85,"11":724583,"124":1800,"130":2600,"131":2600,"132":2600,"133":17,"140":416,"141":27,"142":2,"143":0,"144":0,"145":0,"146":0,"2":1800,"22":13,"23":6,"24":11,"3":19047,"30":1100,"31":69562,"32":500,"4":19112,"40":36000,"41":26000,"42":36000,"43":36000,"44":26000,"45":36000,"46":40000,"47":36000,"48":31000,"49":22000,"5":19194,"50":36000,"6":19246,"69":1,"7":18966,"70":1},"TotalBoosts":{"1":1600,"10":0,"100":299,"101":56,"102":52,"103":55,"105":0,"106":0,"107":0,"108":231,"11":763724,"12":0,"120":4683,"121":1398,"122":0,"123":0,"124":1800,"130":2600,"131":2600,"132":2600,"133":17,"140":416,"141":27,"142":2,"143":0,"144":0,"145":0,"146":0,"2":1800,"21":0,"22":13,"23":6,"24":11,"3":118166.33,"30":1.6534,"31":42.319828,"32":1.297,"4":101749.68000000001,"40":46.6062,"41":25.868000000000002,"42":29.2158,"43":36.0982,"44":16.444000000000003,"45":29.253,"46":24.76,"47":41.803,"48":19.414,"49":31.699399999999997,"5":96850.66,"50":46.2424,"6":101426.94,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":1,"7":84603.74,"70":1,"71":0,"8":2666813,"80":0,"81":39,"82":0,"83":38,"84":0,"85":0,"86":39,"9":2535942},"SigilBoost":108,"GuildID":86,"LastFatigue":1753980262,"UnfatiguedStreak":492529,"HighestEnemy":58000,"Equipment":{"1":{"ID":5025890,"Name":"Heirloom Staff of Water +16 (3046)","IsEquipped":true,"Level":3046,"Rarity":6,"Slot":1,"Boosts":{"11":21745,"120":562,"3":11089,"40":27909,"41":26178,"5":12022,"6":10837,"8":770006,"81":39},"Quality":0.99403,"UpgradeChance":0.04681,"Infusions":16},"2":{"ID":4951400,"Name":"Heirloom Robes +14 (2492)","IsEquipped":true,"Level":2492,"Rarity":6,"Slot":2,"Boosts":{"101":39,"121":466,"4":8821,"49":22310,"50":22010,"6":8642,"7":9083,"9":108884},"Quality":0.99292,"UpgradeChance":0.04852,"Infusions":14},"3":{"ID":4969542,"Name":"Heirloom Sandals +14 (2163)","IsEquipped":true,"Level":2163,"Rarity":6,"Slot":3,"Boosts":{"103":39,"120":401,"3":7623,"40":18591,"43":18751,"6":8244,"7":9253,"9":85431},"Quality":0.99324,"UpgradeChance":0.04643,"Infusions":14},"4":{"ID":4940806,"Name":"Heirloom Gloves +14 (2149)","IsEquipped":true,"Level":2149,"Rarity":6,"Slot":4,"Boosts":{"102":39,"121":400,"3":7535,"4":7931,"42":19947,"50":18620,"6":7661,"9":90438},"Quality":0.99402,"UpgradeChance":0.04116,"Infusions":14},"5":{"ID":4937498,"Name":"Heirloom Hood +15 (2167)","IsEquipped":true,"Level":2167,"Rarity":6,"Slot":5,"Boosts":{"100":39,"120":388,"3":7516,"43":19540,"47":18825,"5":8153,"6":7681,"9":88907},"Quality":0.99269,"UpgradeChance":0.0501,"Infusions":15},"6":{"ID":5030783,"Name":"Heirloom Cloak +16 (3057)","IsEquipped":true,"Level":3057,"Rarity":6,"Slot":6,"Boosts":{"120":547,"3":10676,"4":10889,"49":27906,"5":10830,"50":27901,"83":38,"9":152982},"Quality":0.99299,"UpgradeChance":0.048,"Infusions":16},"7":{"ID":4954354,"Name":"Heirloom Pendant +14 (2181)","IsEquipped":true,"Level":2181,"Rarity":6,"Slot":7,"Boosts":{"120":418,"3":7997,"4":8307,"45":20203,"47":18226,"7":8001},"Quality":0.99343,"UpgradeChance":0.03895,"Infusions":14},"8":{"ID":4921970,"Name":"Heirloom Ring +14 (2169)","IsEquipped":true,"Level":2169,"Rarity":6,"Slot":8,"Boosts":{"120":364,"4":7639,"40":23101,"47":19511,"5":8689,"7":7923,"86":39},"Quality":0.99264,"UpgradeChance":0.04351,"Infusions":14}}};
    const exampleMarketData = {"Buy":{"10":5100000,"11":4050000,"12":2250000,"13":40410105,"14":33000000,"15":39700001,"16":1902328816,"17":12000000000,"18":6060000009,"19":1402439508,"2":1091,"20":13072500002,"21":13261300010,"22":1800000000,"23":2049999999,"24":1040300000,"25":502000000,"26":2750000000,"27":431000000,"28":800000000,"29":6250000,"3":16000000105,"30":2400006,"31":3300000,"32":7777778,"33":30500009,"34":11250000,"35":6920016671,"36":17220500000,"37":40150000000,"39":25000009,"4":11000009,"40":980000,"41":999500,"44":27500000015,"45":313000000000,"46":796001001,"47":7885373010,"5":12625009,"50":4500000000000,"6":8010009,"7":407,"8":377,"9":387},"Sell":{"10":15000000,"11":37000000,"12":17641798,"13":41550000,"14":39589994,"15":42000000,"16":2000000000,"17":14199000000,"18":25000000000,"19":4257000000,"2":1232,"20":1000000000000,"21":99000000000,"22":4514801227,"23":2305430421,"24":1900000000,"25":790000000,"26":7920000000,"27":633977685,"28":1300000000,"29":21000000,"3":16416671000,"30":10500000,"31":14900000,"32":41250000,"33":74979999,"34":35000000,"35":8035830000,"36":19999999990,"37":57247631000,"39":67320000,"4":69000000,"40":1127114,"41":1000000,"44":38999999999,"45":361000000000,"46":835000000,"47":8612000000,"5":60000000,"50":21900000000000,"6":66000000,"7":503,"8":409,"9":402}};
    let displayExampleData = false;

    if(globalPlayerData == null){
        globalPlayerData = examplePlayerData;
        displayExampleData = true;

    }
    if(globalMarketData == null){
        globalMarketData = exampleMarketData;
        displayExampleData = true;
    }

    displayData(globalPlayerData, globalMarketData);
    
    const t = translations[currentLanguage];
    if(displayExampleData){
        showMessage(t.showExampleData, 'success');
    } else {
        showMessage(t.loadSavedData + globalPlayerData.Name, 'success');
    }

}


function showMessage(message, type, targetId = 'message') {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.innerHTML = \`<div class="\${type}">\${message}</div>\`;
    } else {
        console.error(\`Message target with ID "\${targetId}" not found.\`);
    }
}

// region show data
function displayData(playerData, marketData) {
    document.getElementById('playerData').style.display = 'block';
    
    const t = translations[currentLanguage];

    document.getElementById('basicInfo').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.playerName}</span> <span class="stat-value">\${playerData.Name}</span></div>
        <div class="stat-row"><span class="stat-label">\${t.currentEnemy}</span> <input type="number" class="stat-input" value="\${playerData.Enemy || 0}" id="currentEnemy"></div>
        <div class="stat-row"><span class="stat-label">\${t.battleLevel}</span> <input type="number" class="stat-input" value="\${playerData.Level || 0}" id="battleLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.miningLevel}</span> <input type="number" class="stat-input" value="\${playerData.MiningLevel || 0}" id="miningLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.fishingLevel}</span> <input type="number" class="stat-input" value="\${playerData.FishingLevel || 0}" id="fishingLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.woodcuttingLevel}</span> <input type="number" class="stat-input" value="\${playerData.WoodcuttingLevel || 0}" id="woodcuttingLevel"></div>
    \`;

    document.getElementById('gatheringBoosts').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.mining}</span> <input type="number" class="stat-input" value="\${((playerData.TotalBoosts['30'] - 1 || 0) * 100).toFixed(2)}" id="miningBoost"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.fishing}</span> <input type="number" class="stat-input" value="\${((playerData.TotalBoosts['31'] - 1 || 0) * 100).toFixed(2)}" id="fishingBoost"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.woodcutting}</span> <input type="number" class="stat-input" value="\${((playerData.TotalBoosts['32'] - 1 || 0) * 100).toFixed(2)}" id="woodcuttingBoost"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.baseResourceBoost}</span> <input type="number" class="stat-input" value="\${((playerData.TotalBoosts['124'] || 0) /100).toFixed(2)}" id="baseResourceBoost"></div>
    \`;
    
    document.getElementById('codexBoosts').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.codexManaDust}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['101'] || 0}" id="codexManaDust"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.codexBaseResource}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['106'] || 0}" id="codexBaseResource"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.codexDropBoost}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['102'] || 0}" id="codexDropBoost"><span class="stat-suffix">%</span></div>
    \`;
    
    document.getElementById('otherEquipmentBoosts').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.manaBoost}</span> <input type="number" class="stat-input" value="\${(playerData.TotalBoosts['121'] || 0)}" id="manaBoost"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.shardBoost}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['122'] || 0}" id="shardBoost"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.potionBoost}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['108'] || 0}" id="potionBoost"><span class="stat-suffix">%</span></div>
    \`;

    document.getElementById('farmBoosts').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.harvestGolem}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['130'] || 0}" id="harvestGolem"></div>
        <div class="stat-row"><span class="stat-label">\${t.fertilizer}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['131'] || 0}" id="fertilizer"></div>
        <div class="stat-row"><span class="stat-label">\${t.farmPlots}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['132'] || 0}" id="farmPlots"></div>
        <div class="stat-row"><span class="stat-label">\${t.potionDuration}</span> <input type="number" class="stat-input" value="\${playerData.TotalBoosts['110'] || 0}" id="potionDuration"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.farmHerbHarvest}</span> <input type="number" class="stat-input" value="\${(2.5 * (1 + playerData.TotalBoosts['130']/100)**0.9 * (1 + playerData.TotalBoosts['131']/100)**0.9 * (1 + playerData.TotalBoosts['132']/100)**0.9).toFixed(0) || 0}" id="farmHerbHarvest"><span class="stat-suffix">/h</span></div>
        <div class="stat-row"><span class="stat-label">\${t.farmTax}</span> <input type="number" class="stat-input" value="\${(2.5 * (1 + playerData.TotalBoosts['130']/100)**0.9 * (1 + playerData.TotalBoosts['131']/100)**0.9 * (1 + playerData.TotalBoosts['132']/100)**0.9*200000).toFixed(0) || 0}" id="farmTax"><span class="stat-suffix">/h</span></div>
    \`;
    
    document.getElementById('marketPrice').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.shardPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['2'] || 0}" id="shardPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.codexPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['3'] || 0}" id="codexPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.fishPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['7'] || 0}" id="fishPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.woodPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['8'] || 0}" id="woodPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.ironPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['9'] || 0}" id="ironPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.sagerootPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['40'] || 0}" id="sagerootPrice"></div>
        <div class="stat-row"><span class="stat-label">\${t.bloomwellPrice}</span> <input type="number" class="stat-input" value="\${marketData.Sell['41'] || 0}" id="bloomwellPrice"></div>
    \`;

    document.getElementById('needToSupplement').innerHTML = \`
        <div class="stat-row"><span class="stat-label">\${t.guildLevel}</span> <input type="number" class="stat-input" value="\${values?.guild?.guildLevel ?? 100}" id="guildLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.guildNexusCrystalLevel}</span> <input type="number" class="stat-input" value="\${values?.guild?.guildNexusCrystalLevel ?? 100}" id="guildNexusCrystalLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.guildManaTax}</span> <input type="number" class="stat-input" value="\${values?.guild?.guildManaTax ?? 10}" id="guildManaTax"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.guildResourceTax}</span> <input type="number" class="stat-input" value="\${values?.guild?.guildResonanceTax ?? 60}" id="guildResourceTax"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.guildShardTax}</span> <input type="number" class="stat-input" value="\${values?.guild?.guildShardTax ?? 10}" id="guildShardTax"><span class="stat-suffix">%</span></div>
        <div class="stat-row"><span class="stat-label">\${t.wisdomPotionLevel}</span> <input type="number" class="stat-input" value="\${values?.guild?.wisdomPotionLevel ?? 10}" id="wisdomPotionLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.harvestingPotionLevel}</span> <input type="number" class="stat-input" value="\${values?.guild?.harvestingPotionLevel ?? 10}" id="harvestingPotionLevel"></div>
        <div class="stat-row"><span class="stat-label">\${t.resonancePotionLevel}</span> <input type="number" class="stat-input" value="\${values?.guild?.resonancePotionLevel ?? 10}" id="resonancePotionLevel"></div>
        <div class="usage-note" data-translate-key="fillButtonNote">\${t.fillButtonNote}</div>
        <div id="supplementMessage"></div>
        <div class="button-grid">
            <button class="info-card-button" onclick="fillGuildInfo()" data-translate-key="fillGuildInfo">\${t.fillGuildInfo}</button>
            <button class="info-card-button" onclick="fillPotionInfo()" data-translate-key="fillPotionInfo">\${t.fillPotionInfo}</button>
        </div>
    \`;
}

//#region getvalue
function getAllCurrentValues() {
    values = {
        basic: {
            battleLevel: getValue('battleLevel'),
            currentEnemy: getValue('currentEnemy'),
            miningLevel: getValue('miningLevel'),
            fishingLevel: getValue('fishingLevel'),
            woodcuttingLevel: getValue('woodcuttingLevel')
        },
        gathering: {
            miningBoost: getValue('miningBoost'),
            fishingBoost: getValue('fishingBoost'),
            woodcuttingBoost: getValue('woodcuttingBoost'),
            miningBaseBoost: globalPlayerData.BaseBoosts['30'],
            fishingBaseBoost: globalPlayerData.BaseBoosts['31'],
            woodcuttingBaseBoost: globalPlayerData.BaseBoosts['32'],
            baseResourceAmountTotal: getValue('baseResourceBoost'),
            baseResourceAmountBase: globalPlayerData.BaseBoosts['124']
        },
        codex: {
            codexManaDust: getValue('codexManaDust'),
            codexBaseResource: getValue('codexBaseResource'),
            codexDropBoost: getValue('codexDropBoost'),
            codexBaseResourceBase: globalPlayerData.BaseBoosts['106'],
            codexDropBoostBase: globalPlayerData.BaseBoosts['102']
        },
        equipment: {
            manaBoost: getValue('manaBoost'),
            shardBoost: getValue('shardBoost'),
            potionBoost: getValue('potionBoost'),
            potionBoostBase: globalPlayerData.BaseBoosts['108']
        },
        farm: {
            harvestGolem: getValue('harvestGolem'),
            fertilizer: getValue('fertilizer'),
            farmPlots: getValue('farmPlots'),
            potionDuration: getValue('potionDuration'),
            farmHerbHarvest: getValue('farmHerbHarvest'),
            farmTax: getValue('farmTax')
        },
        market: {
            codexPrice: getValue('codexPrice'),
            fishPrice: getValue('fishPrice'),
            woodPrice: getValue('woodPrice'),
            ironPrice: getValue('ironPrice'),
            shardPrice: getValue('shardPrice'),
            sagerootPrice: getValue('sagerootPrice'),
            bloomwellPrice: getValue('bloomwellPrice')
        },
        guild: {
            guildLevel: getValue('guildLevel'),
            guildNexusCrystalLevel: getValue('guildNexusCrystalLevel'),
            guildManaTax: getValue('guildManaTax'),
            guildResonanceTax: getValue('guildResourceTax'),
            guildShardTax: getValue('guildShardTax'),
            wisdomPotionLevel: getValue('wisdomPotionLevel'),
            harvestingPotionLevel: getValue('harvestingPotionLevel'),
            resonancePotionLevel: getValue('resonancePotionLevel')
        }
    };
    
    const t = translations[currentLanguage];
    const skillLevelsText = t.skillLevels
        .replace('\${miningLevel}', values.basic.miningLevel)
        .replace('\${fishingLevel}', values.basic.fishingLevel)
        .replace('\${woodcuttingLevel}', values.basic.woodcuttingLevel);

    document.getElementById('calcResults').innerHTML = \`
        <div class="calc-result">
            <h4>\${t.currentDataSnapshot}</h4>
            <div class="result-content-box">
                <strong>\${t.basicInfoTitle}</strong><br>
                \${t.battleLevel} \${values.basic.battleLevel}, \${t.currentEnemy} \${values.basic.currentEnemy}<br>
                \${skillLevelsText}<br><br>
                
                <strong>\${t.gatheringBoostsTitle}</strong><br>
                \${t.mining} \${values.gathering.miningBoost}%, \${t.fishing} \${values.gathering.fishingBoost}%, \${t.woodcutting} \${values.gathering.woodcuttingBoost}%<br>
                \${t.baseResourceAmount.replace('\${baseResourceAmountTotal}', values.gathering.baseResourceAmountTotal)}<br><br>
                
                <strong>\${t.codexBoostsTitle}</strong><br>
                \${t.codexManaDust} \${values.codex.codexManaDust}%, \${t.codexBaseResource} \${values.codex.codexBaseResource}%, \${t.codexDropBoost} \${values.codex.codexDropBoost}%
                <br><br>
                
                <strong>\${t.equipmentBoostsTitle}</strong><br>
                \${t.manaBoost} \${values.equipment.manaBoost}%, \${t.shardBoost} \${values.equipment.shardBoost}%, \${t.potionBoost} \${values.equipment.potionBoost}%<br><br>
                
                <strong>\${t.farmSystemTitle}</strong><br>
                \${t.harvestGolem} \${values.farm.harvestGolem}, \${t.fertilizer} \${values.farm.fertilizer}, \${t.farmPlots} \${values.farm.farmPlots}<br>
                \${t.herbHarvest.replace('\${farmHerbHarvest}', values.farm.farmHerbHarvest).replace('\${farmTax}', values.farm.farmTax)}<br><br>
                
                <strong>\${t.marketPricesTitle}</strong><br>
                \${t.shardPrice} \${values.market.shardPrice}, \${t.codexPrice} \${values.market.codexPrice} <br>
                \${t.fishPrice} \${values.market.fishPrice}, \${t.woodPrice} \${values.market.woodPrice}, \${t.ironPrice} \${values.market.ironPrice}<br>
                \${t.sagerootPrice} \${values.market.sagerootPrice}, \${t.bloomwellPrice} \${values.market.bloomwellPrice}
                <br><br>
                
                <strong>\${t.manualInputTitle}</strong><br>
                \${t.guildLevel} \${values.guild.guildLevel}, \${t.guildNexusCrystalLevel} \${values.guild.guildNexusCrystalLevel}<br>
                \${t.guildTaxRates.replace('\${guildManaTax}', values.guild.guildManaTax).replace('\${guildResonanceTax}', values.guild.guildResonanceTax).replace('\${guildShardTax}', values.guild.guildShardTax)} <br>
                \${t.potionLevels.replace('\${wisdomPotionLevel}', values.guild.wisdomPotionLevel).replace('\${harvestingPotionLevel}', values.guild.harvestingPotionLevel).replace('\${resonancePotionLevel}', values.guild.resonancePotionLevel)}
            </div>
        </div>
    \`;

    saveGlobalData();
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? (parseFloat(element.value) || 0) : 0;
}

function formatNumber(num) {
    if (num === 0) return '0.00';
    if (isNaN(num) || !isFinite(num)) return 'NaN';
    
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    
    let result;
    if (absNum >= 1e15) {
        result = (absNum / 1e15).toFixed(2) + 'Qa';
    } else if (absNum >= 1e12) {
        result = (absNum / 1e12).toFixed(2) + 'T';  
    } else if (absNum >= 1e9) {
        result = (absNum / 1e9).toFixed(2) + 'B';   
    } else if (absNum >= 1e6) {
        result = (absNum / 1e6).toFixed(2) + 'M';  
    } else if (absNum >= 1e3) {
        result = (absNum / 1e3).toFixed(2) + 'K'; 
    } else {
        result = absNum.toFixed(2);
    }
    
    return isNegative ? '-' + result : result;
}

//#region shards
function calculateShards(){
    const totalLevel = values.basic.battleLevel*3 + values.basic.miningLevel + values.basic.fishingLevel + values.basic.woodcuttingLevel;
    const MinBaseShard = 100*Math.pow(1+totalLevel/10, 1-0.3*(totalLevel/(totalLevel+20000)));
    const potionShardBoost = 5* (1 + values.equipment.potionBoost/100) * values.guild.resonancePotionLevel;
    const totalShardBoost = values.equipment.shardBoost +  potionShardBoost;
    const minShardPerActionAfterTax = MinBaseShard * (1 + totalShardBoost / 100) * (1 - values.guild.guildShardTax / 100);
    const shardPerActionAfterTax = 1.5 * MinBaseShard * (1 + totalShardBoost / 100) * (1 - values.guild.guildShardTax / 100);
    const shardsPerDayAfterTax = shardPerActionAfterTax * ((1+(values.codex.codexDropBoost/100))*(1/80)*28800);
    const shardDailyValue = shardsPerDayAfterTax * values.market.shardPrice;
    return [shardsPerDayAfterTax, shardDailyValue, minShardPerActionAfterTax];
}

//#region farm
function calculateFarmIncome(){
    //  200k Mana Dust/herb/hr -> * 0.75 since update
    const herbsHourHarvestTotal = values.farm.farmHerbHarvest;
    const manaHourConsume = herbsHourHarvestTotal * 200000 * 0.75 ;
    const sageRootHourHarvest = herbsHourHarvestTotal/2;
    const bloomHourHarvest = herbsHourHarvestTotal/2; 
    const durationMultiplier = 1 + (values.farm.potionDuration / 100);

    function getPotionConsumption(tier) {
        if (tier <= 0) return 0;
        const cost = tier * (1 + tier) / 2 + 0.0002 * Math.pow(tier, 3);
        return cost / durationMultiplier;
    }

    const wisdomPotionConsume = getPotionConsumption(values.guild.wisdomPotionLevel);
    const harvestingPotionConsume = getPotionConsumption(values.guild.harvestingPotionLevel);
    const resonancePotionConsume = getPotionConsumption(values.guild.resonancePotionLevel);


    const netSageRootGain = sageRootHourHarvest - wisdomPotionConsume - resonancePotionConsume;
    const netBloomGain = bloomHourHarvest - harvestingPotionConsume - resonancePotionConsume;

    const sagePrice = values.market.sagerootPrice;
    const bloomPrice = values.market.bloomwellPrice;
    const sageProfitPerDay = netSageRootGain * sagePrice * 24;
    const bloomProfitPerDay = netBloomGain * bloomPrice * 24;
    const manaConsumePerDay = manaHourConsume * 24;

    return [manaConsumePerDay, sageRootHourHarvest, bloomHourHarvest, (wisdomPotionConsume + resonancePotionConsume), (harvestingPotionConsume + resonancePotionConsume), netSageRootGain, netBloomGain, sageProfitPerDay, bloomProfitPerDay];
}

//#region combat
function calculateCombatEfficiency(display = true){
    const t = translations[currentLanguage];
    let baseMana = 0.0001 * Math.pow((values.basic.currentEnemy + 150), 2) + Math.pow((values.basic.currentEnemy + 150), 1.2) + 10 * (values.basic.currentEnemy + 150);
    if (values.basic.currentEnemy > 150000) {
        const scalingFactor = Math.pow(1.01, (values.basic.currentEnemy - 150000) / 2000);
        baseMana *= scalingFactor;
    }
    const manaPerAction = baseMana * (1 + values.codex.codexManaDust / 100) * (1 + values.equipment.manaBoost / 100);
    const manaPerDay = manaPerAction * 28800;
    const manaPerDayAfterTax = manaPerDay * (1 - values.guild.guildManaTax / 100);
    const [shardPerActionAfterTax, shardDailyValue,minShardPerActionAfterTax] = calculateShards();
    const [manaConsumePerDay, sageRootHourHarvest, bloomHourHarvest, sageRootHourConsume, bloomHourConsume, netSageRootGain, netBloomGain, sageProfitPerDay, bloomProfitPerDay] = calculateFarmIncome();
    const farmProfitPerDay = sageProfitPerDay + bloomProfitPerDay - manaConsumePerDay;

    const profitPerDayTotal = manaPerDayAfterTax + shardDailyValue + farmProfitPerDay;

    if(display){
        const netSageRootGainDaily = netSageRootGain * 24;
        const netBloomGainDaily = netBloomGain * 24;

        document.getElementById('calcResults').innerHTML = \`
            <div class="calc-result">
                <div class="result-content-box">
                    \${t.manaPerDay} \${formatNumber(manaPerDayAfterTax)}<br><br>

                    \${t.shardRangePerAction} \${formatNumber(minShardPerActionAfterTax)} ~ \${formatNumber(2*minShardPerActionAfterTax)}<br>
                    \${t.shardsPerDay} \${formatNumber(shardPerActionAfterTax)}<br>
                    \${t.shardsDailyValue} \${formatNumber(shardDailyValue)}<br><br>

                    <h4>\${t.farmDetailsTitle}</h4>
                    <div class="result-grid">
                        <!-- Header Row -->
                        <span class="grid-header">\${t.category}</span>
                        <span class="grid-header">\${t.sagerootHeader}</span>
                        <span class="grid-header">\${t.bloomwellHeader}</span>

                        <!-- Data Rows -->
                        <span>\${t.hourlyProd}</span>
                        <span>\${formatNumber(sageRootHourHarvest)}</span>
                        <span>\${formatNumber(bloomHourHarvest)}</span>

                        <span>\${t.hourlyCons}</span>
                        <span>\${formatNumber(sageRootHourConsume)}</span>
                        <span>\${formatNumber(bloomHourConsume)}</span>
                        
                        <span>\${t.netHourlyProd}</span>
                        <span>\${formatNumber(netSageRootGain)}</span>
                        <span>\${formatNumber(netBloomGain)}</span>
                        
                        <span>\${t.netDailyProd}</span>
                        <span>\${formatNumber(netSageRootGainDaily)}</span>
                        <span>\${formatNumber(netBloomGainDaily)}</span>
                        
                        <span>\${t.dailyNetProfit}</span>
                        <span>\${formatNumber(sageProfitPerDay)}</span>
                        <span>\${formatNumber(bloomProfitPerDay)}</span>
                    </div>

                    \${t.farmDailyMaintenance} \${formatNumber(manaConsumePerDay)}<br>
                    \${t.farmDailyValue} \${formatNumber(farmProfitPerDay)}<br><br>

                    <strong>\${t.dailyIncome} \${formatNumber(profitPerDayTotal)}</strong><br>
                </div>
            </div>
        \`;
    }

    return profitPerDayTotal;
}

//#region gathering
function calculateGatheringEfficiency(display = true, gatheringType = null){
    const t = translations[currentLanguage];
    if (display && gatheringType === null) {
        const selectedType = document.getElementById('gatheringType').value;
        if (!values.ui) values.ui = {};
        values.ui.lastGatheringType = selectedType;
    }

    if(gatheringType === null){
        gatheringType = document.getElementById('gatheringType').value;
    }

    let level = 0;

    if (gatheringType === 'woodcutting') {
        level = values.basic.woodcuttingLevel;
    } else if (gatheringType === 'mining') {
        level = values.basic.miningLevel;
    } else if (gatheringType === 'fishing') {
        level = values.basic.fishingLevel;
    }
    const [shardPerActionAfterTax, shardDailyValue,minShardPerActionAfterTax] = calculateShards();

    const potionBaseResource = values.guild.harvestingPotionLevel * 0.1 * (1 + values.equipment.potionBoost/100);
    const baseResource = 1 + level * 0.03 + values.gathering.baseResourceAmountTotal + potionBaseResource;
    console.log("baseResource", baseResource)
    const totalBaseResourceAmount = 1 + values.codex.codexBaseResource/100;
    const factor4 = 1 + values.gathering[gatheringType + 'Boost'] / 100;

    const resourcePerAction = baseResource * totalBaseResourceAmount * factor4;
    const resourcePerActionAfterTax = resourcePerAction * (1 - values.guild.guildResonanceTax / 100);
    const resourcePerDayAfterTax = resourcePerActionAfterTax * 28800;
    let resourcePrice = 0;
    if (gatheringType === 'woodcutting') {
        resourcePrice = values.market.woodPrice;
    } else if (gatheringType === 'mining') {
        resourcePrice = values.market.ironPrice;
    } else if (gatheringType === 'fishing') {
        resourcePrice = values.market.fishPrice;
    }
    let resourceProfitPerDay = resourcePerDayAfterTax * resourcePrice;

    const [manaConsumePerDay, sageRootHourHarvest, bloomHourHarvest, sageRootHourConsume, bloomHourConsume, netSageRootGain, netBloomGain, sageProfitPerDay, bloomProfitPerDay] = calculateFarmIncome();
    const farmProfitPerDay = sageProfitPerDay + bloomProfitPerDay - manaConsumePerDay;

    const profitPerDayTotal = resourceProfitPerDay + shardDailyValue + farmProfitPerDay;

    if(display){
        const netSageRootGainDaily = netSageRootGain * 24;
        const netBloomGainDaily = netBloomGain * 24;

        document.getElementById('calcResults').innerHTML = \`
            <div class="calc-result">
                <div class="result-content-box">
                    \${t.resourcePerAction} \${formatNumber(resourcePerActionAfterTax)}<br>
                    \${t.resourcePerDay} \${formatNumber(resourcePerDayAfterTax)}<br>
                    \${t.resourcePrice} \${formatNumber(resourcePrice)}<br>
                    \${t.resourceDailyValue} \${formatNumber(resourceProfitPerDay)}<br><br>
                    
                    \${t.shardRangePerAction} \${formatNumber(minShardPerActionAfterTax)} ~ \${formatNumber(2*minShardPerActionAfterTax)}<br>
                    \${t.shardsPerDay} \${formatNumber(shardPerActionAfterTax)}<br>
                    \${t.shardsDailyValue} \${formatNumber(shardDailyValue)}<br><br>

                    <h4>\${t.farmDetailsTitle}</h4>
                    <div class="result-grid">
                        <!-- Header Row -->
                        <span class="grid-header">\${t.category}</span>
                        <span class="grid-header">\${t.sagerootHeader}</span>
                        <span class="grid-header">\${t.bloomwellHeader}</span>

                        <!-- Data Rows -->
                        <span>\${t.hourlyProd}</span>
                        <span>\${formatNumber(sageRootHourHarvest)}</span>
                        <span>\${formatNumber(bloomHourHarvest)}</span>

                        <span>\${t.hourlyCons}</span>
                        <span>\${formatNumber(sageRootHourConsume)}</span>
                        <span>\${formatNumber(bloomHourConsume)}</span>
                        
                        <span>\${t.netHourlyProd}</span>
                        <span>\${formatNumber(netSageRootGain)}</span>
                        <span>\${formatNumber(netBloomGain)}</span>
                        
                        <span>\${t.netDailyProd}</span>
                        <span>\${formatNumber(netSageRootGainDaily)}</span>
                        <span>\${formatNumber(netBloomGainDaily)}</span>
                        
                        <span>\${t.dailyNetProfit}</span>
                        <span>\${formatNumber(sageProfitPerDay)}</span>
                        <span>\${formatNumber(bloomProfitPerDay)}</span>
                    </div>

                    \${t.farmDailyMaintenance} \${formatNumber(manaConsumePerDay)}<br>
                    \${t.farmDailyValue} \${formatNumber(farmProfitPerDay)}<br><br>

                    <strong>\${t.dailyIncome} \${formatNumber(profitPerDayTotal)}</strong><br>
                </div>
            </div>
        \`;
    }

    return profitPerDayTotal;
}

//#region ResonanceLevel
function calculateResonancePotionLevel(){
    const t = translations[currentLanguage];
    let resonancePotionLevelX = 0;

    function getResonancePotionConsume(resonancePotionLevelX) {
        const durationMultiplier = 1 + (values.farm.potionDuration / 100);
        const originalCost = resonancePotionLevelX * (1 + resonancePotionLevelX) / 2;
        const additionalCost = 0.0002 * Math.pow(resonancePotionLevelX, 3);
        const resonancePotionConsume = (originalCost + additionalCost) / durationMultiplier;
        const sageRootConsumePerDay = resonancePotionConsume * values.market.sagerootPrice * 24;
        const bloomConsumePerDay = resonancePotionConsume * values.market.bloomwellPrice * 24;
        const farmConsumePerDay = sageRootConsumePerDay + bloomConsumePerDay;
        return farmConsumePerDay;
    }

    function getResonancePotionExtraIncome(resonancePotionLevelX) {
        const totalLevel = values.basic.battleLevel*3 + values.basic.miningLevel + values.basic.fishingLevel + values.basic.woodcuttingLevel;
        const MinBaseShard = 100*Math.pow(1+totalLevel/10, 1-0.3*(totalLevel/(totalLevel+20000)));
        const potionShardBoost = 5* (1 + values.equipment.potionBoost/100) * resonancePotionLevelX;
        const shardPerActionAfterTax = 1.5 * MinBaseShard * (1 + potionShardBoost / 100) * (1 - values.guild.guildShardTax / 100);
        const shardsPerDayAfterTax = shardPerActionAfterTax * ((1+(values.codex.codexDropBoost/100))*(1/80)*28800);
        const shardDailyValue = shardsPerDayAfterTax * values.market.shardPrice;
        return shardDailyValue;
    }

    const totalLevel = values.basic.battleLevel * 3 + values.basic.miningLevel + values.basic.fishingLevel + values.basic.woodcuttingLevel;
    const MinBaseShard = 100 * Math.pow(1 + totalLevel/10, 1 - 0.3 * (totalLevel/(totalLevel + 20000)));
    
    
    const A = (values.market.sagerootPrice + values.market.bloomwellPrice) * 24 / (1 + values.farm.potionDuration / 100);
    const B = 0.05 * (1 + values.equipment.potionBoost / 100);
    const C = 1.5 * MinBaseShard * (1 - values.guild.guildShardTax / 100) * 
            ((1 + values.codex.codexDropBoost / 100) * (1/80) * 28800) * 
            values.market.shardPrice;
    const coeff_a = 0.0006 * A;
    const coeff_b = A;
    const coeff_c = 0.5 * A - C * B;
    let optimalLevel = 0;
    const discriminant = coeff_b * coeff_b - 4 * coeff_a * coeff_c;
        if (discriminant >= 0) {
        const sqrt_discriminant = Math.sqrt(discriminant);
        
        const root1 = (-coeff_b + sqrt_discriminant) / (2 * coeff_a);
        const root2 = (-coeff_b - sqrt_discriminant) / (2 * coeff_a);

        if (root1 > 0) {
            optimalLevel = root1;
        } else if (root2 > 0) {
            optimalLevel = root2;
        }
    }

    const finalOptimalLevel = Math.max(0, optimalLevel);

    // 获取当前等级并计算其成本和收益
    const currentResonancePotionLevel = values.guild.resonancePotionLevel;
    const currentConsumption = getResonancePotionConsume(currentResonancePotionLevel);
    const currentIncome = getResonancePotionExtraIncome(currentResonancePotionLevel);

    // 计算最佳等级的成本和收益
    const optimalConsumption = getResonancePotionConsume(finalOptimalLevel);
    const optimalIncome = getResonancePotionExtraIncome(finalOptimalLevel);

    // 计算最佳与当前状态的差值
    const consumptionDifference = optimalConsumption - currentConsumption;
    const incomeDifference = optimalIncome - currentIncome;
    const netGainDifference = incomeDifference - consumptionDifference;


    document.getElementById('calcResults').innerHTML = \`
    <div class="calc-result">
        <div class="result-content-box">
            \${t.optimalResonanceLevel} \${finalOptimalLevel.toFixed(2)}<br><br>

            <!-- 与0级对比的部分 -->
            <strong>\${t.comparedToLevel0}</strong><br>
            \${t.extraFarmConsumption} \${formatNumber(optimalConsumption)}/day<br>
            \${t.extraIncome} \${formatNumber(optimalIncome)}/day<br>
            \${t.increasedIncome} \${formatNumber(optimalIncome - optimalConsumption)}<br>
            <hr class="card-divider">

            <!-- [新增] 与当前等级对比的部分 -->
            <strong>\${t.comparedToCurrentLevel.replace('\${currentLevel}', currentResonancePotionLevel)}</strong><br>
            \${t.extraFarmConsumption} \${formatNumber(consumptionDifference)}/day<br>
            \${t.extraIncome} \${formatNumber(incomeDifference)}/day<br>
            \${t.increasedIncome} \${formatNumber(netGainDifference)}<br>
        </div>
    </div>\`;
}

// region Gather ROI
function calculateGatheringROI(){
    const t = translations[currentLanguage];
    const gatheringType = document.getElementById('gatheringType2').value;
    const paths = {
        mining: { base: 'miningBaseBoost', total: 'miningBoost' },
        fishing: { base: 'fishingBaseBoost', total: 'fishingBoost' },
        woodcutting: { base: 'woodcuttingBaseBoost', total: 'woodcuttingBoost' }
    };

    function calculateResearchBoost(incrementLevel) {
        function sumOfCostFormula(fromLevel, toLevel) {
            const a = 0.000005;
            const b = 2;
            const sumUpTo = (n) => {
                if (n < 1) return 0;
                const sum_sq = n * (n + 1) * (2 * n + 1) / 6;
                const sum_lin = n * (n + 1) / 2;
                return a * sum_sq + b * sum_lin;
            };
            return sumUpTo(toLevel) - sumUpTo(fromLevel);
        }
        const path = paths[gatheringType];
        const currentLevel = values.gathering[path.base];
        const oldBoostTotal = values.gathering[path.total];
        const shardsNeed = sumOfCostFormula(currentLevel, currentLevel + incrementLevel);
        const priceNeed = shardsNeed * values.market.shardPrice;
        const newBoostTotal = oldBoostTotal + incrementLevel *( 0.02 +  values.guild.guildNexusCrystalLevel * 0.0002);
        // console.log("oldBoostTotal: " + oldBoostTotal + " newBoostTotal: " + newBoostTotal);
        values.gathering[path.total] = newBoostTotal;
        const newProfit = calculateGatheringEfficiency(false,gatheringType);
        values.gathering[path.total] = oldBoostTotal; 
        return [priceNeed, newProfit];
    }

    // no problem
    function calculateBaseResourceAmount(incrementLevel) {
        const currentLevel = values.gathering.baseResourceAmountBase;
        function sumOfSquares(n) {
            return n * (n + 1) * (2 * n + 1) / 6;
        }
        const priceNeed = (sumOfSquares(currentLevel+incrementLevel) - sumOfSquares(currentLevel))*5;
        const oldBaseResourceAmoutTotal = values.gathering.baseResourceAmountTotal;
        values.gathering.baseResourceAmountTotal += incrementLevel/100;
        const newProfit = calculateGatheringEfficiency(false, gatheringType);
        values.gathering.baseResourceAmountTotal = oldBaseResourceAmoutTotal;
        return [priceNeed, newProfit];
    }

    // no problem
    function calculateCodexBaseResource(incrementLevel) {
        const currentLevel = values.codex.codexBaseResourceBase;
        function calculateCost(fromLevel, toLevel) {
            const startValue = fromLevel + 1;
            const endValue = toLevel;
            const n = endValue - startValue + 1; 
            const sum = n * (startValue + endValue) / 2;
            return sum;
        }
        const codexNeed = calculateCost(currentLevel, currentLevel+incrementLevel);
        const priceNeed = codexNeed * values.market.codexPrice;
        const oldCodexBaseResource = values.codex.codexBaseResource;
        values.codex.codexBaseResource += incrementLevel;
        const newProfit = calculateGatheringEfficiency(false, gatheringType);
        values.codex.codexBaseResource = oldCodexBaseResource;
        return [priceNeed, newProfit];
    }

    // no problem
    function calculatePotionBoost(incrementLevel) {
        const currentLevel = values.equipment.potionBoostBase;
        function calculateCost(fromLevel, toLevel) {
            const baseCost = 10000000;
            const growthRate = 1.1;
            return Array.from({ length: toLevel - fromLevel }, (_, i) => fromLevel + i)
                .map(level => Math.floor(baseCost * Math.pow(growthRate, level)))
                .reduce((total, cost) => total + cost, 0);
        }
        const priceNeed = calculateCost(currentLevel, currentLevel+incrementLevel);
        const oldPotionBoost = values.equipment.potionBoost;
        values.equipment.potionBoost += incrementLevel;
        console.log("oldPotionBoost: " + oldPotionBoost + " newPotionBoost: " + values.equipment.potionBoost);
        const newProfit = calculateGatheringEfficiency(false, gatheringType);
        values.equipment.potionBoost = oldPotionBoost;
        return [priceNeed, newProfit];
    }


    // no problem
    function calculateCodexDropRate(incrementLevel) {
        const currentLevel = values.codex.codexDropBoostBase;
        function calculateCost(fromLevel, toLevel) {
            const startValue = fromLevel + 1;
            const endValue = toLevel;
            const n = endValue - startValue + 1; 
            const sum = n * (startValue + endValue) / 2;
            return sum;
        }
        const codexNeed = calculateCost(currentLevel, currentLevel+incrementLevel);
        const priceNeed = codexNeed * values.market.codexPrice;
        const oldCodexDropRate = values.codex.codexDropBoost;
        values.codex.codexDropBoost += incrementLevel;
        const newProfit = calculateGatheringEfficiency(false, gatheringType);
        values.codex.codexDropBoost = oldCodexDropRate;
        return [priceNeed, newProfit];
    }
    
    function calculateFarmLevel(incrementLevel) {
        function calculateCost(fromLevel, toLevel) {
            function sumOfSquares(n) {
                return n * (n + 1) * (2 * n + 1) / 6;
            }
            return sumOfSquares(toLevel) - sumOfSquares(fromLevel);
        }

        const currentLevels = {
            harvestGolem: values.farm.harvestGolem,
            fertilizer: values.farm.fertilizer,
            farmPlots: values.farm.farmPlots
        };

        function optimizedAllocation(incrementLevel) {
            const projects = ['harvestGolem', 'fertilizer', 'farmPlots'];
            const levels = [currentLevels.harvestGolem, currentLevels.fertilizer, currentLevels.farmPlots];
            const allocations = [0, 0, 0];

            let remaining = incrementLevel;

            while (remaining > 0) {
                let minLevel = Math.min(...levels);
                let minIndices = [];
                
                for (let i = 0; i < levels.length; i++) {
                    if (levels[i] === minLevel) {
                        minIndices.push(i);
                    }
                }

                let nextHigherLevel = Math.min(...levels.filter(l => l > minLevel));
                if (!isFinite(nextHigherLevel)) {
                    const avgAllocation = Math.floor(remaining / minIndices.length);
                    const extraLevels = remaining % minIndices.length;

                    for (let i = 0; i < minIndices.length; i++) {
                        const idx = minIndices[i];
                        const allocation = avgAllocation + (i < extraLevels ? 1 : 0);
                        allocations[idx] += allocation;
                        levels[idx] += allocation;
                    }
                    remaining = 0;
                } else {
                    const levelGap = nextHigherLevel - minLevel;
                    const totalNeeded = levelGap * minIndices.length;

                    if (totalNeeded <= remaining) {
                        for (const idx of minIndices) {
                            allocations[idx] += levelGap;
                            levels[idx] += levelGap;
                        }
                        remaining -= totalNeeded;
                    } else {
                        const avgAllocation = Math.floor(remaining / minIndices.length);
                        const extraLevels = remaining % minIndices.length;

                        for (let i = 0; i < minIndices.length; i++) {
                            const idx = minIndices[i];
                            const allocation = avgAllocation + (i < extraLevels ? 1 : 0);
                            allocations[idx] += allocation;
                            levels[idx] += allocation;
                        }
                        remaining = 0;
                    }
                }
            }

            return {
                harvestGolem: allocations[0],
                fertilizer: allocations[1],
                farmPlots: allocations[2]
            };
        }

        const allocations = optimizedAllocation(incrementLevel);
        const costs = {
            harvestGolem: calculateCost(currentLevels.harvestGolem, currentLevels.harvestGolem + allocations.harvestGolem),
            fertilizer: calculateCost(currentLevels.fertilizer, currentLevels.fertilizer + allocations.fertilizer),
            farmPlots: calculateCost(currentLevels.farmPlots, currentLevels.farmPlots + allocations.farmPlots)
        };
        const priceNeed = costs.harvestGolem * values.market.ironPrice + costs.fertilizer * values.market.fishPrice + costs.farmPlots * values.market.woodPrice;
        const oldfarmHerbHarvest = values.farm.farmHerbHarvest;
        const newHarvestGolemLevel = currentLevels.harvestGolem + allocations.harvestGolem;
        const newFertilizerLevel = currentLevels.fertilizer + allocations.fertilizer;
        const newFarmPlotsLevel = currentLevels.farmPlots + allocations.farmPlots;
        values.farm.farmHerbHarvest = 2.5 * 
            Math.pow(1 + newHarvestGolemLevel/100, 0.9) * 
            Math.pow(1 + newFertilizerLevel/100, 0.9) * 
            Math.pow(1 + newFarmPlotsLevel/100, 0.9);
        const newProfit = calculateGatheringEfficiency(false, gatheringType);
        values.farm.farmHerbHarvest = oldfarmHerbHarvest;
        return [priceNeed, newProfit];
    }

    const currentProfit = calculateGatheringEfficiency(false, gatheringType);

    const research = calculateResearchBoost(3000);
    const baseResource = calculateBaseResourceAmount(100);
    const codexBase = calculateCodexBaseResource(5);
    const potion = calculatePotionBoost(5);
    const codexDrop = calculateCodexDropRate(5);
    const farm = calculateFarmLevel(300);

    const investments = [
        { name: t.investments.research, cost: research[0], profit: research[1]-currentProfit },
        { name: t.investments.baseResource, cost: baseResource[0], profit: baseResource[1]-currentProfit },
        { name: t.investments.codexBase, cost: codexBase[0], profit: codexBase[1]-currentProfit },
        { name: t.investments.potion, cost: potion[0], profit: potion[1]-currentProfit },
        { name: t.investments.codexDrop, cost: codexDrop[0], profit: codexDrop[1]-currentProfit },
        { name: t.investments.farm, cost: farm[0], profit: farm[1]-currentProfit }
    ];
    
    investments.forEach(item => {
        if (item.cost > 0 && item.profit > 0) {
            item.payback = item.cost / item.profit;
        } else if (item.cost === 0) {
            item.payback = 0;
        } else {
            item.payback = Infinity;
        }
    });
    investments.sort((a, b) => a.payback - b.payback);

    const codexBaseItem = investments.find(item => item.name === t.investments.codexBase);
    if (codexBaseItem && values.codex.codexBaseResourceBase >= 100) {
        codexBaseItem.name += \` <span style="opacity: 0.7;">(\${t.maxLevelWarning})</span>\`;
    }

    const codexDropItem = investments.find(item => item.name === t.investments.codexDrop);
    if (codexDropItem && values.codex.codexDropBoostBase >= 100) {
        codexDropItem.name += \` <span style="opacity: 0.7;">(\${t.maxLevelWarning})</span>\`;
    }

    let resultHTML = \`
        <div class="calc-result">
            <div class="result-content-box">
                <strong>\${t.gatheringROIComparison.replace('\${gatheringType}', gatheringType)}</strong><br><br>
    \`;
    
    investments.forEach((item, index) => {
        resultHTML += \`\${index + 1}. \${item.name}<br>\`;
        resultHTML += \`&nbsp;&nbsp;&nbsp;\${t.cost} \${formatNumber(item.cost)} | \${t.extraDailyProfit} \${formatNumber(item.profit)}<br>\`;
        resultHTML += \`&nbsp;&nbsp;&nbsp;\${t.paybackPeriod} \${isFinite(item.payback) ? item.payback.toFixed(2) : 'N/A'}<br><br>\`;
    });
    
    resultHTML += \`</div></div>\`;
    
    document.getElementById('calcResults').innerHTML = resultHTML;

    const selectedType = document.getElementById('gatheringType2').value;
    if (!values.ui) values.ui = {};
    values.ui.lastGatheringType2 = selectedType;
}

// #region getRank
async function getRank() {
    const t = translations[currentLanguage];
    const getRankBtn = document.getElementById('getRankButton');
    const calcResultsDiv = document.getElementById('calcResults');

    if (getRankBtn.disabled) {
        return;
    }

    if (!globalPlayerData || !globalPlayerData.Name) {
        calcResultsDiv.innerHTML = \`<div class="calc-result error">\${t.fetchPlayerDataFirst}</div>\`;
        return;
    }

    const originalBtnText = getRankBtn.textContent;
    
    try {
        getRankBtn.disabled = true;
        getRankBtn.textContent = t.fetchingButton; // 使用翻译

        const playerName = globalPlayerData.Name;
        const lowerCaseUsername = playerName.toLowerCase();
        const REQUEST_DELAY = 1000;
        
        const interestedLeaderboards = [
            'base_stats', 'farm', 'highest_mastery', 'highest_damage_spell_rank','highest_resistance_spell_rank',
            'boost_base_spellpower', 'boost_base_ward', 'boost_damage', 'boost_multicast', 'boost_crit_chance',
            'boost_crit_damage', 'boost_haste', 'boost_health', 'boost_ward', 'boost_focus', 'boost_mana','boost_overload',
            'boost_time_dilation', 'boost_mana_shield', 'boost_potion',
            'boost_mining', 'boost_fishing','boost_woodcutting', 'boost_base_res'
        ];

        const total = interestedLeaderboards.length;

        let initialMsg = t.fetchingRanksInitial
            .replace('\${playerName}', playerName)
            .replace('\${total}', total);
        calcResultsDiv.innerHTML = \`<div class="calc-result loading">\${initialMsg}</div>\`;

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        async function findUserRankInLeaderboard(leaderboardType) {
            try {
                const firstPageUrl = \`https://api.manarion.com/leaderboards/\${leaderboardType}?page=1\`;
                const firstPageData = await window.fetchDataWithGM(firstPageUrl);
                
                let userEntry = (firstPageData.Entries || []).find(e => e.Name.toLowerCase() === lowerCaseUsername);
                if (userEntry) {
                    return { rank: userEntry.Rank, score: userEntry.Score };
                }

                const totalPages = firstPageData.TotalPages;
                if (totalPages <= 1) return null;

                for (let i = 2; i <= totalPages; i++) {
                    await delay(REQUEST_DELAY);
                    const pageUrl = \`https://api.manarion.com/leaderboards/\${leaderboardType}?page=\${i}\`;
                    const pageData = await window.fetchDataWithGM(pageUrl);
                    userEntry = (pageData.Entries || []).find(e => e.Name.toLowerCase() === lowerCaseUsername);
                    if (userEntry) {
                        return { rank: userEntry.Rank, score: userEntry.Score };
                    }
                }
                return null;
            } catch (error) {
                console.error(\`Error fetching leaderboard \${leaderboardType}:\`, error);
                return { error: error.message };
            }
        }

        const allRanks = {};
        let completed = 0;

        for (const type of interestedLeaderboards) {
            const result = await findUserRankInLeaderboard(type);
            if (result) {
                allRanks[type] = result;
            }
            completed++;
            let progressMsg = t.fetchingRanksProgress
                .replace('\${playerName}', playerName)
                .replace('\${completed}', completed)
                .replace('\${total}', total)
                .replace('\${type}', type);
            calcResultsDiv.innerHTML = \`<div class="calc-result loading">\${progressMsg}</div>\`;
        }

        manarionHelperRank = {
            username: playerName,
            timestamp: new Date().toISOString(),
            ranks: allRanks
        };

        let successMsg = t.fetchingRanksSuccess.replace('\${playerName}', playerName);
        calcResultsDiv.innerHTML = \`<div class="calc-result success">\${successMsg}</div>\`;

    } catch (error) {
        console.error("An unexpected error occurred during getRank:", error);
        calcResultsDiv.innerHTML = \`<div class="calc-result error">\${t.fetchingRanksError}</div>\`; // 使用翻译
    } finally {
        getRankBtn.disabled = false;
        getRankBtn.textContent = originalBtnText;
    }
}

// #region InvestedNetWorth
// Calculate total invested net worth based on current levels
function showTotalInvestedNetWorth() {
    window.toggleAccordion = function(element) {
        element.classList.toggle('open');
        const content = element.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    };
    const t = translations[currentLanguage];
    
    // Get all boost data from API
    const baseBoosts = globalPlayerData.BaseBoosts || {};
    
    // Define boost names mapping with translations
    // Define boost names mapping with translations
    const boostNames = currentLanguage === 'en' ? {
        // Base Power
        1: "Spellpower",
        2: "Ward",
        21: "Fire Spell Rank",
        22: "Water Spell Rank",
        23: "Nature Spell Rank",
        24: "Mana Shield Rank",
        83: "Fire Resistance Value",
        84: "Water Resistance Value",
        85: "Nature Resistance Value",
        // Combat Skills
        40: "Damage",
        41: "Multicast",
        42: "Crit Chance",
        43: "Crit Damage",
        44: "Haste",
        45: "Health",
        46: "Ward",
        47: "Focus",
        48: "Mana",
        49: "Overload",
        50: "Time Dilation",
        // Enchants
        60: "Enchant Inferno Rank",
        61: "Enchant Tidal Wrath Rank",
        62: "Enchant Wildheart Rank",
        63: "Enchant Fire Resistance Rank",
        64: "Enchant Water Resistance Rank",
        65: "Enchant Nature Resistance Rank",
        66: "Enchant Insight Rank",
        67: "Enchant Bountiful Harvest Rank",
        68: "Enchant Prosperity Rank",
        69: "Enchant Fortune Rank",
        70: "Enchant Growth Rank",
        71: "Enchant Vitality Rank",
        // Gathering
        30: "Mining",
        31: "Fishing", 
        32: "Woodcutting",
        124: "Base Resource Amount",
        // Codex
        100: "Base Experience",
        101: "Base Mana Dust",
        102: "Drop Boost",
        103: "Multistat",
        105: "Actions",
        106: "Base Resource",
        // Farm
        130: "Harvest Golem",
        131: "Fertilizer",
        132: "Farm Plots",
        108: "Potion Boost",
    } : {
        // Base Power
        1: "法术强度",
        2: "抗性",
        21: "火魔法等级",
        22: "水魔法等级",
        23: "自然魔法等级",
        24: "魔法盾等级",
        83: "火系抗性",
        84: "水系抗性",
        85: "自然抗性",
        // Combat Skills
        40: "伤害",
        41: "多重施法",
        42: "暴击几率",
        43: "暴击伤害",
        44: "技能急速",
        45: "生命值",
        46: "抗性",
        47: "集中",
        48: "魔力",
        49: "过载",
        50: "时间膨胀",
        // Enchants
        60: "术式：地狱烈焰",
        61: "术式：狂潮",
        62: "术式：野性之心",
        63: "术式：火系抗性",
        64: "术式：水系抗性",
        65: "术式：自然抗性",
        66: "术式：洞察",
        67: "术式：丰饶",
        68: "术式：富饶",
        69: "术式：幸运",
        70: "术式：成长",
        71: "术式：活力",
        // Gathering
        30: "挖矿",
        31: "钓鱼", 
        32: "伐木",
        124: "基础资源数量",
        // Codex
        100: "基础经验",
        101: "基础魔法尘",
        102: "掉落加成",
        103: "多属性",
        105: "行动",
        106: "基础资源",
        // Farm
        130: "收获傀儡",
        131: "肥料",
        132: "农场地块",
        108: "药剂加成",
    };

    const displayOrder = [
        // Base Power
        '1', '2', '21', '22', '23', '24', '83', '84', '85',
        // Combat Skills
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        // Enchants
        '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71',
        // Gathering
        '30', '31', '32', '124',
        // Codex
        '100', '101', '102', '103', '105', '106',
        // Farm
        '130', '131', '132', '108'
    ];

    
    // Helper function to get all boost levels
    function getAllBoostLevels() {
        const allowedIdsSet = new Set(Object.keys(boostNames).map(Number));
        const boostLevel = {};
        
        // BaseBoosts data
        if (baseBoosts) {
            Object.entries(baseBoosts).forEach(([id, level]) => {
                if (allowedIdsSet.has(parseInt(id))) {
                    boostLevel[id] = level;
                }
            });
        }
        
        return boostLevel;
    }
    
    // Calculate individual costs for display
    function getBoostCost(id, level) {
        if (!level || level <= 0) return 0;
        const numId = parseInt(id);
        
        // IDs 1 and 2 use 2000000*X formula
        if (numId === 1 || numId === 2) {
            return 1000 * level * (level + 1) * (2 * level + 1) / 6;
        }
        // Battle boosts (40-50) use 2x formula with shard price
        else if (numId >= 40 && numId <= 50) {
            return level * (level + 1) * ((values.market && values.market.shardPrice) || 0);
        }
        // Research (30-32) uses sumOfCostFormula
        else if (numId >= 30 && numId <= 32) {
            function sumOfCostFormula(toLevel) {
                const a = 0.000005;
                const b = 2;
                const sumUpTo = (n) => {
                    if (n < 1) return 0;
                    const sum_sq = n * (n + 1) * (2 * n + 1) / 6;
                    const sum_lin = n * (n + 1) / 2;
                    return a * sum_sq + b * sum_lin;
                };
                return sumUpTo(toLevel);
            }
            return sumOfCostFormula(level) * ((values.market && values.market.shardPrice) || 0);
        }
        // ID 105 is special - 1 codex per level
        else if (numId === 105) {
            return level * ((values.market && values.market.codexPrice) || 0);
        }
        // Other Codex (100-106 except 105) use arithmetic series
        else if (numId >= 100 && numId <= 106) {
            const n = level;
            const sum = n * (1 + level) / 2;
            return sum * ((values.market && values.market.codexPrice) || 0);
        }
        // ID 108 Potion Boost
        else if (numId === 108) {
            const baseCost = 10000000;
            const growthRate = 1.1;
            let totalCost = 0;
            for (let i = 0; i < level; i++) {
                totalCost += Math.floor(baseCost * Math.pow(growthRate, i));
            }
            return totalCost;
        }
        // ID 124 Base Resource (sum of squares * 5)
        else if (numId === 124) {
            function sumOfSquares(n) {
                return n * (n + 1) * (2 * n + 1) / 6;
            }
            return sumOfSquares(level) * 5;
        }
        // Farm investments (130-132) - sum of squares with resource prices
        else if (numId === 130) { // Harvest Golem
            function sumOfSquares(n) { return n * (n + 1) * (2 * n + 1) / 6; }
            return sumOfSquares(level) * ((values.market && values.market.ironPrice) || 0);
        }
        else if (numId === 131) { // Fertilizer
            function sumOfSquares(n) { return n * (n + 1) * (2 * n + 1) / 6; }
            return sumOfSquares(level) * ((values.market && values.market.fishPrice) || 0);
        }
        else if (numId === 132) { // Farm Plots
            function sumOfSquares(n) { return n * (n + 1) * (2 * n + 1) / 6; }
            return sumOfSquares(level) * ((values.market && values.market.woodPrice) || 0);
        }
        // Spell Ranks (21-23) Resistance Values (83-85)
        else if (numId >= 21 && numId <= 23 || numId >= 83 && numId <= 85) {
            const triangularNumber = level * (level + 1) / 2;
            const totalItems = triangularNumber * triangularNumber;
            const boostToItemMap = {
                '21': '13', // Fire Spell -> Tome of Fire
                '22': '14', // Water Spell -> Tome of Water
                '23': '15', // Nature Spell -> Tome of Nature
                '83': '13', // Fire Resistance -> Tome of Fire
                '84': '14', // Water Resistance -> Tome of Water
                '85': '15'  // Nature Resistance -> Tome of Nature
            };
            const itemIdToPrice = boostToItemMap[numId];
            const price = (globalMarketData && globalMarketData.Sell && globalMarketData.Sell[itemIdToPrice]) || 0;
            return totalItems * price;
        } 
        // Mana Shield (24)
        else if (numId === 24) { 
            const totalItems = level * (level + 1) / 2;
            const itemIdToPrice = '16';
            const price = (globalMarketData && globalMarketData.Sell && globalMarketData.Sell[itemIdToPrice]) || 0;
            return totalItems * price;
        }
        // Enchant Ranks (60-71)
        else if (numId >= 60 && numId <= 71) {
            const totalItems = level * (level + 1) / 2;

            const enchantToItemMap = {
                '60': '20', // Enchant Inferno -> Formula: Inferno
                '61': '21', // Enchant Tidal Wrath -> Formula: Tidal Wrath
                '62': '22', // Enchant Wildheart -> Formula: Wildheart
                '63': '17', // Enchant Fire Resistance -> Formula: Fire Resistance
                '64': '18', // Enchant Water Resistance -> Formula: Water Resistance
                '65': '19', // Enchant Nature Resistance -> Formula: Nature Resistance
                '66': '23', // Enchant Insight -> Formula: Insight
                '67': '24', // Enchant Bountiful Harvest -> Formula: Bountiful Harvest
                '68': '25', // Enchant Prosperity -> Formula: Prosperity
                '69': '26', // Enchant Fortune -> Formula: Fortune
                '70': '27', // Enchant Growth -> Formula: Growth
                '71': '28'  // Enchant Vitality -> Formula: Vitality
            };
            
            const itemIdToPrice = enchantToItemMap[numId];
            const price = (globalMarketData && globalMarketData.Sell && globalMarketData.Sell[itemIdToPrice]) || 0;
            return totalItems * price;
        }
        // Potion Belt (133)
        else if (numId === 133) {
            return 1;
        }
        
        return 0;
    }
    
    // Get all boost levels
    const boostLevel = getAllBoostLevels();
    
    // Calculate total by summing all individual boost costs
    let totalNetWorth = 0;
    Object.entries(boostLevel).forEach(([id, level]) => {
        if (level > 0) {
            totalNetWorth += getBoostCost(id, level);
        }
    });
   
    const rankData = manarionHelperRank ? manarionHelperRank.ranks : null;

    let resultHTML = \`
        <div class="calc-result">
            <div class="result-content-box">
                <strong>\${t.totalInvestedNetWorth}</strong><br><br>
                <span style="font-size: 1.8em; color: var(--success-text);">\${formatNumber(totalNetWorth)}</span><br><br>
                
                <div style="opacity: 0.8; font-size: 0.9em;">
                    <strong>\${t.investmentDetails}</strong><br><br>
                    
                    \${(() => {
                        const categoryOrder = [
                            { key: 'basePower', ids: ['1', '2', '21', '22', '23', '24', '83', '84', '85'] },
                            { key: 'combatSkills', ids: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'] },
                            { key: 'enchants', ids: ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71'] },
                            { key: 'gathering', ids: ['30', '31', '32', '124'] },
                            { key: 'codex', ids: ['100', '101', '102', '103', '105', '106'] },
                            { key: 'farm', ids: ['130', '131', '132', '108'] }
                        ];

                        return categoryOrder.map(category => {
                            let categoryTotalCost = 0;
                            const itemsInCategory = category.ids.filter(id => boostLevel[id] > 0);
                            
                            if (itemsInCategory.length === 0) return '';
                            
                            const tableRows = itemsInCategory.map(id => {
                                // specific boost in category
                                const level = boostLevel[id];
                                const cost = getBoostCost(id, level);
                                categoryTotalCost += cost;
                                const name = boostNames[id] || 'Unknown';

                                let rankCellHTML = '';
                                if (rankData) {
                                    const rankType = boostIdToRankTypeMap[id];
                                    let rankDisplay = '–'; // 默认占位符
                                    if (rankType && rankData[rankType] && rankData[rankType].rank) {
                                        rankDisplay = \`#\${rankData[rankType].rank}\`;
                                    }
                                    rankCellHTML = \`<td style="padding: 3px; border: 1px solid var(--border-color); text-align: center; font-weight: bold;">\${rankDisplay}</td>\`;
                                }

                                return \`
                                    <tr>
                                        <td style="padding: 3px; border: 1px solid var(--border-color);">\${id}</td>
                                        <td style="padding: 3px; border: 1px solid var(--border-color);">\${name}</td>
                                        <td style="padding: 3px; border: 1px solid var(--border-color); text-align: center;">\${level}</td>
                                        \${rankCellHTML}
                                        <td style="padding: 3px; border: 1px solid var(--border-color); text-align: right;">\${formatNumber(cost)}</td>
                                    </tr>
                                \`;
                            }).join('');

                            const rankHeaderHTML = rankData ? \`<td style="padding: 5px; border: 1px solid var(--border-color);">\${t.rank}</td>\` : '';

                            return \`
                                <div class="accordion-category">
                                    <div class="accordion-header" onclick="toggleAccordion(this)">
                                        <span>\${t.categories[category.key]}</span>
                                        <span style="display: flex; align-items: center; gap: 10px;">
                                            <strong style="color: var(--calc-result-text);">\${formatNumber(categoryTotalCost)}</strong>
                                            <span class="accordion-arrow">></span>
                                        </span>
                                    </div>
                                    <div class="accordion-content">
                                        <table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">
                                            <tr style="background-color: var(--section-bg); font-weight: bold;">
                                                <td style="padding: 5px; border: 1px solid var(--border-color);">ID</td>
                                                <td style="padding: 5px; border: 1px solid var(--border-color);">\${currentLanguage === 'en' ? 'Name' : '名称'}</td>
                                                <td style="padding: 5px; border: 1px solid var(--border-color);">\${currentLanguage === 'en' ? 'Level' : '等级'}</td>
                                                \${rankHeaderHTML}
                                                <td style="padding: 5px; border: 1px solid var(--border-color);">\${t.cost}</td>
                                            </tr>
                                            \${tableRows}
                                        </table>
                                    </div>
                                </div>
                            \`;
                        }).join('');
                    })()}
                </div>
            </div>
        </div>
    \`;
    
    document.getElementById('calcResults').innerHTML = resultHTML;
}

// #region CombatROI
// Add this entire function into your test.js file
function calculateCombatROI() {
    const t = translations[currentLanguage];

    // Helper function to calculate cost of Codex upgrades
    function calculateCodexCost(baseLevel, incrementLevel) {
        function calculateSum(from, to) {
            const n = to - from;
            return n * (from + 1 + to) / 2;
        }
        const codexNeed = calculateSum(baseLevel, baseLevel + incrementLevel);
        return codexNeed * values.market.codexPrice;
    }

    // Path 1: Upgrade Codex Mana Dust
    function calculateCodexManaDust(incrementLevel) {
        // Note: BaseBoosts['101'] is the base level for Codex Mana Dust
        const priceNeed = calculateCodexCost(globalPlayerData.BaseBoosts['101'] || 0, incrementLevel);
        const oldCodexManaDust = values.codex.codexManaDust;
        values.codex.codexManaDust += incrementLevel;
        const newProfit = calculateCombatEfficiency(false);
        values.codex.codexManaDust = oldCodexManaDust;
        return [priceNeed, newProfit];
    }

    // Path 2: Upgrade Codex Drop Rate
    function calculateCodexDropRate(incrementLevel) {
        const priceNeed = calculateCodexCost(values.codex.codexDropBoostBase, incrementLevel);
        const oldCodexDropRate = values.codex.codexDropBoost;
        values.codex.codexDropBoost += incrementLevel;
        const newProfit = calculateCombatEfficiency(false);
        values.codex.codexDropBoost = oldCodexDropRate;
        return [priceNeed, newProfit];
    }

    // Path 3: Upgrade Potion Boost
    function calculatePotionBoost(incrementLevel) {
        const currentLevel = values.equipment.potionBoostBase;
        function calculateCost(fromLevel, toLevel) {
            const baseCost = 10000000;
            const growthRate = 1.1;
            return Array.from({ length: toLevel - fromLevel }, (_, i) => fromLevel + i)
                .map(level => Math.floor(baseCost * Math.pow(growthRate, level)))
                .reduce((total, cost) => total + cost, 0);
        }
        const priceNeed = calculateCost(currentLevel, currentLevel + incrementLevel);
        const oldPotionBoost = values.equipment.potionBoost;
        values.equipment.potionBoost += incrementLevel;
        const newProfit = calculateCombatEfficiency(false);
        values.equipment.potionBoost = oldPotionBoost;
        return [priceNeed, newProfit];
    }
    
    // Path 4: Upgrade Farm Levels (as it affects overall profit)
    function calculateFarmLevel(incrementLevel) {
        function calculateCost(fromLevel, toLevel) {
            function sumOfSquares(n) { return n * (n + 1) * (2 * n + 1) / 6; }
            return sumOfSquares(toLevel) - sumOfSquares(fromLevel);
        }
        const currentLevels = { harvestGolem: values.farm.harvestGolem, fertilizer: values.farm.fertilizer, farmPlots: values.farm.farmPlots };
        // This allocation logic is complex, assuming it's correct from calculateGatheringROI
        function optimizedAllocation(inc) {
            const levels = [currentLevels.harvestGolem, currentLevels.fertilizer, currentLevels.farmPlots];
            const allocations = [0, 0, 0];
            let remaining = inc;
            while(remaining > 0){ let minLvl=Math.min(...levels),indices=[]; for(let i=0;i<3;i++) if(levels[i]===minLvl) indices.push(i); let nextHigher=Math.min(...levels.filter(l=>l>minLvl)),gap=isFinite(nextHigher)?nextHigher-minLvl:remaining,alloc=Math.min(gap,Math.floor(remaining/indices.length)); for(let idx of indices){ allocations[idx]+=alloc; levels[idx]+=alloc; } remaining -= alloc * indices.length; if(alloc<gap && remaining>0) { for(let i=0;i<remaining;i++){ let idx=indices[i%indices.length]; allocations[idx]++; levels[idx]++; } remaining=0; }}
            return { harvestGolem: allocations[0], fertilizer: allocations[1], farmPlots: allocations[2] };
        }
        const allocations = optimizedAllocation(incrementLevel);
        const costs = {
            harvestGolem: calculateCost(currentLevels.harvestGolem, currentLevels.harvestGolem + allocations.harvestGolem),
            fertilizer: calculateCost(currentLevels.fertilizer, currentLevels.fertilizer + allocations.fertilizer),
            farmPlots: calculateCost(currentLevels.farmPlots, currentLevels.farmPlots + allocations.farmPlots)
        };
        const priceNeed = costs.harvestGolem * values.market.ironPrice + costs.fertilizer * values.market.fishPrice + costs.farmPlots * values.market.woodPrice;
        
        const oldFarmHerbHarvest = values.farm.farmHerbHarvest;
        const newGolem = currentLevels.harvestGolem + allocations.harvestGolem;
        const newFert = currentLevels.fertilizer + allocations.fertilizer;
        const newPlots = currentLevels.farmPlots + allocations.farmPlots;
        values.farm.farmHerbHarvest = 2.5 * Math.pow(1 + newGolem/100, 0.9) * Math.pow(1 + newFert/100, 0.9) * Math.pow(1 + newPlots/100, 0.9);
        const newProfit = calculateCombatEfficiency(false);
        values.farm.farmHerbHarvest = oldFarmHerbHarvest;
        return [priceNeed, newProfit];
    }

    function calculateEnemyLevelIncrease(incrementLevel) {
        const priceNeed = 0; // No cost
        const oldEnemyLevel = values.basic.currentEnemy;
        values.basic.currentEnemy += incrementLevel;
        const newProfit = calculateCombatEfficiency(false);
        values.basic.currentEnemy = oldEnemyLevel; // IMPORTANT: Restore original value
        return [priceNeed, newProfit];
    }



    // --- Main Execution ---
    const currentProfit = calculateCombatEfficiency(false);

    const codexMana = calculateCodexManaDust(5);
    const codexDrop = calculateCodexDropRate(5);
    const potion = calculatePotionBoost(5);
    const farm = calculateFarmLevel(300);
    const enemyIncrease = calculateEnemyLevelIncrease(100); 

    const investments = [
        { name: t.investments.codexMana, cost: codexMana[0], profit: codexMana[1] - currentProfit },
        { name: t.investments.codexDrop, cost: codexDrop[0], profit: codexDrop[1] - currentProfit },
        { name: t.investments.potion, cost: potion[0], profit: potion[1] - currentProfit },
        { name: t.investments.farm, cost: farm[0], profit: farm[1] - currentProfit },
        { name: t.investments.enemyLevel, cost: enemyIncrease[0], profit: enemyIncrease[1] - currentProfit },
    ];
    
    investments.forEach(item => {
        if (item.cost > 0 && item.profit > 0) {
            item.payback = item.cost / item.profit;
        } else if (item.cost === 0) {
            item.payback = 0;
        } else {
            item.payback = Infinity;
        }
    });
    investments.sort((a, b) => a.payback - b.payback);

    const codexManaItem = investments.find(item => item.name === t.investments.codexMana);
    if (codexManaItem && (globalPlayerData.BaseBoosts['101'] || 0) >= 100) {
        codexManaItem.name += \` <span style="opacity: 0.7;">(\${t.maxLevelWarning})</span>\`;
    }

    const codexDropItem = investments.find(item => item.name === t.investments.codexDrop);
    console.log("values.codex.codexDropBoostBase: " + values.codex.codexDropBoostBase);
    if (codexDropItem && values.codex.codexDropBoostBase >= 100) {
        codexDropItem.name += \` <span style="opacity: 0.7;">(\${t.maxLevelWarning})</span>\`;
    }

    let resultHTML = \`
        <div class="calc-result">
            <div class="result-content-box">
                <strong>\${t.combatROIComparison}</strong><br><br>
    \`;
    
    investments.forEach((item, index) => {
        resultHTML += \`\${index + 1}. \${item.name}<br>\`;
        if (item.cost > 0) {
            resultHTML += \`&nbsp;&nbsp;&nbsp;\${t.cost} \${formatNumber(item.cost)} | \${t.extraDailyProfit} \${formatNumber(item.profit)}<br>\`;
            resultHTML += \`&nbsp;&nbsp;&nbsp;\${t.paybackPeriod} \${isFinite(item.payback) ? item.payback.toFixed(2) : 'N/A'}<br><br>\`;
        } else {
            resultHTML += \`&nbsp;&nbsp;&nbsp;\${t.extraDailyProfit}\${formatNumber(item.profit)}<br><br>\`;
        }
    });

    resultHTML += \`</div></div>\`;
    
    document.getElementById('calcResults').innerHTML = resultHTML;
}


// #region GatherEquip
function calculateGatherEquipReplace() {
    const t = translations[currentLanguage];
    let replacementFound = false;

    function findLowestTypeBoostEquip(playerData, boostType) {
        const equipment = playerData.Equipment;
        let lowestEquip = null;
        let lowestBoost = Infinity;
        
        Object.values(equipment).forEach(item => {
            if (item.Slot == 1) return;
            const boosts = item.Boosts;
            const boostKeys = Object.keys(boosts);
            const lastBoostType = boostKeys[boostKeys.length - 1];

            if (lastBoostType === boostType) {
                const infusions = item.Infusions || 0;
                const infusionMultiplier = 1 + (infusions * 0.05);
                const boostValue = boosts[lastBoostType] * infusionMultiplier;
                
                if (boostValue < lowestBoost) {
                    lowestBoost = boostValue;
                    lowestEquip = item;
                }
            }
        });
        return lowestEquip;
    }

    function findRequiredPotionLevel(resourceChange, currentLevel) {
        const potionBasePerLevel = 0.1 * (1 + values.equipment.potionBoost / 100);
        if (potionBasePerLevel <= 0) return Infinity;

        const currentPotionResource = currentLevel * potionBasePerLevel;
        const targetResource = currentPotionResource + resourceChange;

        if (targetResource < 0) {
            return null;
        }

        const targetLevel = targetResource / potionBasePerLevel;
        return Math.ceil(targetLevel);
    }

    function calculateHarvestingPotionCost(level) {
        if (level < 0) return 0;
        const durationMultiplier = 1 + (values.farm.potionDuration / 100);
        const originalCost = level * (1 + level) / 2;
        const additionalCost = 0.0002 * Math.pow(level, 3);
        const consumption = (originalCost + additionalCost) / durationMultiplier;
        const bloomwellPrice = values.market.bloomwellPrice;
        return consumption * bloomwellPrice * 24;
    }
    
    let resultHTML = \`
        <div class="calc-result">
            <div class="result-content-box">
                \${t.gatherEquipReplaceTitle}<br>
                \${t.gatherEquipReplaceDesc}<br>
                \${t.gatherEquipReplaceNote}<br><br>
    \`;

    const oldProfit = calculateGatheringEfficiency(false);
    const currentHarvestingPotionLevel = values.guild.harvestingPotionLevel;
    const oldPotionCost = calculateHarvestingPotionCost(currentHarvestingPotionLevel);

    const lowestBaseEquip = findLowestTypeBoostEquip(globalPlayerData, '124');
    if (lowestBaseEquip) {
        const baseResourceLost = (lowestBaseEquip.Boosts['124'] * (1 + (lowestBaseEquip.Infusions || 0) * 0.05)) / 100;
        const shardBoostGained = baseResourceLost * 40;
        const newPotionLevel = findRequiredPotionLevel(baseResourceLost, currentHarvestingPotionLevel);

        if (newPotionLevel !== null) {
            const originalValues = {
                shardBoost: values.equipment.shardBoost,
                baseResource: values.gathering.baseResourceAmountTotal,
                potionLevel: values.guild.harvestingPotionLevel
            };

            values.equipment.shardBoost += shardBoostGained;
            values.gathering.baseResourceAmountTotal -= baseResourceLost;
            values.guild.harvestingPotionLevel = newPotionLevel;
            const grossNewProfit = calculateGatheringEfficiency(false);
            const netIncomeChange = grossNewProfit - oldProfit;

            values.equipment.shardBoost = originalValues.shardBoost;
            values.gathering.baseResourceAmountTotal = originalValues.baseResource;
            values.guild.harvestingPotionLevel = originalValues.potionLevel;
            
            const newPotionCost = calculateHarvestingPotionCost(newPotionLevel);
            const potionCostChange = newPotionCost - oldPotionCost;
            
            if (netIncomeChange > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    \${t.canReplaceGatherEquip.replace('\${name}', \`<strong>\${lowestBaseEquip.Name}</strong>\`)}<br>
                    \${t.baseResourceAmountLost.replace('\${amount}', baseResourceLost.toFixed(2)).replace('\${shardBoost}', shardBoostGained.toFixed(2))}<br>
                    \${t.currentPotionLevel} \${currentHarvestingPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel}</strong><br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange)}</strong><br>
                    <hr class="card-divider">
                    </div>
                \`;
            }
        }
    }

    const lowestShardEquip = findLowestTypeBoostEquip(globalPlayerData, '122');
    if (lowestShardEquip) {
        const shardBoostLost = lowestShardEquip.Boosts['122'] * (1 + (lowestShardEquip.Infusions || 0) * 0.05);
        const baseResourceGained = shardBoostLost / 40;
        const newPotionLevel2 = findRequiredPotionLevel(-baseResourceGained, currentHarvestingPotionLevel);

        if (newPotionLevel2 !== null) {
            const originalValues = {
                shardBoost: values.equipment.shardBoost,
                baseResource: values.gathering.baseResourceAmountTotal,
                potionLevel: values.guild.harvestingPotionLevel
            };

            values.equipment.shardBoost -= shardBoostLost;
            values.gathering.baseResourceAmountTotal += baseResourceGained;
            values.guild.harvestingPotionLevel = newPotionLevel2;
            const grossNewProfit2 = calculateGatheringEfficiency(false);
            const netIncomeChange2 = grossNewProfit2 - oldProfit;

            values.equipment.shardBoost = originalValues.shardBoost;
            values.gathering.baseResourceAmountTotal = originalValues.baseResource;
            values.guild.harvestingPotionLevel = originalValues.potionLevel;

            const newPotionCost2 = calculateHarvestingPotionCost(newPotionLevel2);
            const potionCostChange2 = newPotionCost2 - oldPotionCost;

            if (netIncomeChange2 > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    \${t.canReplaceGatherEquip2.replace('\${name}', \`<strong>\${lowestShardEquip.Name}</strong>\`)}<br>
                    \${t.currentPotionLevel} \${currentHarvestingPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel2}</strong><br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange2)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange2)}</strong><br>
                    <hr class="card-divider">
                    </div>
                \`;
            }
        }
    }

    if (!replacementFound) {
        resultHTML += \`\${t.cannotReplaceGatherEquip}<br>\`;
    }
    
    resultHTML += \`</div></div>\`;
    document.getElementById('calcResults').innerHTML = resultHTML;
}

// #region battlerEquip
function calculateBattlerEquipReplace() {
    const t = translations[currentLanguage];
    let replacementFound = false;

    function findLowestBoostEquip(playerData, boostType) {
        const equipment = playerData.Equipment;
        let lowestEquip = null;
        let lowestBoost = Infinity;
        
        Object.values(equipment).forEach(item => {
            if (item.Slot == 1) return; // Skip weapon
            const boosts = item.Boosts;
            const boostKeys = Object.keys(boosts);
            const lastBoostType = boostKeys[boostKeys.length - 1];

            if (lastBoostType === String(boostType)) {
                const infusions = item.Infusions || 0;
                const infusionMultiplier = 1 + (infusions * 0.05);
                const boostValue = boosts[lastBoostType] * infusionMultiplier;
                
                if (boostValue < lowestBoost) {
                    lowestBoost = boostValue;
                    lowestEquip = item;
                }
            }
        });
        return lowestEquip;
    }
    
    function calculateWisdomPotionCost(level) {
        if (level < 0) return 0;
        const durationMultiplier = 1 + (values.farm.potionDuration / 100);
        const originalCost = level * (1 + level) / 2;
        const additionalCost = 0.0002 * Math.pow(level, 3);
        const consumption = (originalCost + additionalCost) / durationMultiplier;
        const sageRootPrice = values.market.sagerootPrice;
        return consumption * sageRootPrice * 24;
    }

    function findRequiredWisdomPotionLevel(expChange, currentLevel) {
        const potionExpPerLevel = 5 * (1 + values.equipment.potionBoost / 100);
        if (potionExpPerLevel <= 0) return Infinity;

        const currentPotionExp = currentLevel * potionExpPerLevel;
        const targetExp = currentPotionExp + expChange;

        if (targetExp < 0) {
            return null; 
        }
        
        const targetLevel = targetExp / potionExpPerLevel;
        return Math.ceil(targetLevel);
    }
    
    function recalculateManaBoostOnRemoval(allEquipment, itemToRemove) {
        let rawManaSum = 0;
        let manaItemCount = 0;
        Object.values(allEquipment).forEach(item => {
            if (item.ID === itemToRemove.ID) return; // 跳过要被移除的装备

            const boostKeys = Object.keys(item.Boosts);
            if (boostKeys[boostKeys.length - 1] === '121') {
                const infusions = item.Infusions || 0;
                const infusionMultiplier = 1 + (infusions * 0.05);
                rawManaSum += item.Boosts['121'] * infusionMultiplier;
                manaItemCount++;
            }
        });

        if (manaItemCount === 0) return 0;
        const penalty = (manaItemCount > 1) ? (1 - (manaItemCount - 1) * 0.05) : 1;
        return rawManaSum * penalty;
    }

    let resultHTML = \`
        <div class="calc-result">
            <div class="result-content-box">
                \${t.battleEquipReplaceTitle}<br>
                \${t.battleEquipReplaceDesc}<br><br>
    \`;

    const oldProfit = calculateCombatEfficiency(false);
    const currentWisdomPotionLevel = values.guild.wisdomPotionLevel;
    const oldPotionCost = calculateWisdomPotionCost(currentWisdomPotionLevel);
    const originalValues = {
        manaBoost: values.equipment.manaBoost,
        shardBoost: values.equipment.shardBoost,
        wisdomPotionLevel: values.guild.wisdomPotionLevel
    };

    const lowestExpEquip = findLowestBoostEquip(globalPlayerData, 120);
    if (lowestExpEquip) {
        const expLost = lowestExpEquip.Boosts['120'] * (1 + (lowestExpEquip.Infusions || 0) * 0.05);
        const newPotionLevel = findRequiredWisdomPotionLevel(expLost, currentWisdomPotionLevel);

        if (newPotionLevel !== null) {
            const currentManaItems = Object.values(globalPlayerData.Equipment).filter(e => Object.keys(e.Boosts).pop() === '121');
            const currentManaItemCount = currentManaItems.length;

            const rawManaSum = currentManaItemCount > 0 
                ? originalValues.manaBoost / (1 - (currentManaItemCount - 1) * 0.05) 
                : 0;
            const newRawManaSum = rawManaSum + expLost;
            const newManaItemCount = currentManaItemCount + 1;
            const newPenalty = (newManaItemCount > 1) ? (1 - (newManaItemCount - 1) * 0.05) : 1;
            
            values.equipment.manaBoost = newRawManaSum * newPenalty;
            const grossNewProfit = calculateCombatEfficiency(false);
            const grossIncomeChange = grossNewProfit - oldProfit;

            values.equipment.manaBoost = originalValues.manaBoost;
            
            const newPotionCost = calculateWisdomPotionCost(newPotionLevel);
            const potionCostChange = newPotionCost - oldPotionCost;
            const netIncomeChange = grossIncomeChange - potionCostChange;

            if (netIncomeChange > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    \${t.canReplaceBattleEquipToMana.replace('\${name}', \`<strong>\${lowestExpEquip.Name}</strong>\`)}<br>
                    \${t.currentPotionLevel} \${currentWisdomPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel}</strong><br>
                   
                    \${t.incomeChange}: \${formatNumber(grossIncomeChange)}<br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange)}</strong><br>
                     <hr class="card-divider">
                    </div>\`;
            }
        }
    }
    
    if (lowestExpEquip) { 
        const expLost = lowestExpEquip.Boosts['120'] * (1 + (lowestExpEquip.Infusions || 0) * 0.05);
        const newPotionLevel = findRequiredWisdomPotionLevel(expLost, currentWisdomPotionLevel);

        if (newPotionLevel !== null) {
            values.equipment.shardBoost += expLost;
            const grossNewProfit = calculateCombatEfficiency(false);
            const grossIncomeChange = grossNewProfit - oldProfit;
            
            values.equipment.shardBoost = originalValues.shardBoost;
            
            const newPotionCost = calculateWisdomPotionCost(newPotionLevel);
            const potionCostChange = newPotionCost - oldPotionCost;
            const netIncomeChange = grossIncomeChange - potionCostChange;
            
            if (netIncomeChange > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    \${t.canReplaceBattleEquipToShard.replace('\${name}', \`<strong>\${lowestExpEquip.Name}</strong>\`)}<br>
                    \${t.currentPotionLevel} \${currentWisdomPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel}</strong><br>
                    \${t.incomeChange}: \${formatNumber(grossIncomeChange)}<br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange)}</strong><br>
                    <hr class="card-divider">
                    </div>\`;
            }
        }
    }

    const lowestManaEquip = findLowestBoostEquip(globalPlayerData, 121);
    if (lowestManaEquip) {
        const manaBoostLostRaw = lowestManaEquip.Boosts['121'] * (1 + (lowestManaEquip.Infusions || 0) * 0.05);
        const expGained = manaBoostLostRaw;
        const newPotionLevel = findRequiredWisdomPotionLevel(-expGained, currentWisdomPotionLevel);

        if (newPotionLevel !== null) {
            values.equipment.manaBoost = recalculateManaBoostOnRemoval(globalPlayerData.Equipment, lowestManaEquip);
            const grossNewProfit = calculateCombatEfficiency(false);
            const grossIncomeChange = grossNewProfit - oldProfit;
            
            values.equipment.manaBoost = originalValues.manaBoost;

            const newPotionCost = calculateWisdomPotionCost(newPotionLevel);
            const potionCostChange = newPotionCost - oldPotionCost;
            const netIncomeChange = grossIncomeChange - potionCostChange;

            if (netIncomeChange > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    <hr class="card-divider">
                    \${t.canReplaceManaEquipToExp.replace('\${name}', \`<strong>\${lowestManaEquip.Name}</strong>\`)}<br>
                    \${t.currentPotionLevel} \${currentWisdomPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel}</strong><br>
                    \${t.incomeChange}: \${formatNumber(grossIncomeChange)}<br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange)}</strong><br>
                    <hr class="card-divider">
                    </div>\`;
            }
        }
    }

    const lowestShardEquip = findLowestBoostEquip(globalPlayerData, 122);
    if (lowestShardEquip) {
        const shardBoostLost = lowestShardEquip.Boosts['122'] * (1 + (lowestShardEquip.Infusions || 0) * 0.05);
        const expGained = shardBoostLost;
        const newPotionLevel = findRequiredWisdomPotionLevel(-expGained, currentWisdomPotionLevel);

        if (newPotionLevel !== null) {
            values.equipment.shardBoost -= shardBoostLost;
            const grossNewProfit = calculateCombatEfficiency(false);
            const grossIncomeChange = grossNewProfit - oldProfit;
            
            values.equipment.shardBoost = originalValues.shardBoost;

            const newPotionCost = calculateWisdomPotionCost(newPotionLevel);
            const potionCostChange = newPotionCost - oldPotionCost;
            const netIncomeChange = grossIncomeChange - potionCostChange;

            if (netIncomeChange > 0) {
                replacementFound = true;
                resultHTML += \`
                    <div class="replacement-card beneficial">
                    <hr class="card-divider">
                     \${t.canReplaceShardEquipToExp.replace('\${name}', \`<strong>\${lowestShardEquip.Name}</strong>\`)}<br>
                    \${t.currentPotionLevel} \${currentWisdomPotionLevel} → \${t.newPotionLevel} <strong>\${newPotionLevel}</strong><br>
                    \${t.incomeChange}: \${formatNumber(grossIncomeChange)}<br>
                    \${t.potionCostChange}: \${formatNumber(potionCostChange)}<br>
                    <strong>\${t.netIncomeChange}: \${formatNumber(netIncomeChange)}</strong><br>
                    <hr class="card-divider">
                    </div>\`;
            }
        }
    }

    if (!replacementFound) {
        resultHTML += \`\${t.cannotReplaceBattleEquip}<br>\`;
    }

    resultHTML += \`</div></div>\`;
    document.getElementById('calcResults').innerHTML = resultHTML;
}

// #region Guild Info
function fillGuildInfo() {
    const t = translations[currentLanguage];
    const messageTarget = 'supplementMessage';
    
    const messageDiv = document.getElementById(messageTarget);
    if (messageDiv) messageDiv.innerHTML = '';

    if (manarion && manarion.guild && manarion.player) {
        const guildData = manarion.guild;
        const playerData = manarion.player;
        
        if (!Array.isArray(guildData.Roster) || guildData.Roster.length === 0) {
            showMessage(t.fillGuildErrorRoster, 'error', messageTarget);
            console.error("guildData.Roster is not a valid array. Current value:", guildData.Roster);
            return;
        }

        const currentPlayerInRoster = guildData.Roster.find(member => member.ID === playerData.ID);

        if (!currentPlayerInRoster) {
            showMessage(t.fillGuildErrorPlayerNotFound, 'error', messageTarget); 
            console.error("Player not found in guild roster. Your ID:", playerData.ID);
            return;
        }

        const playerRankId = currentPlayerInRoster.RankID.toString();
        const playerRankInfo = guildData.Ranks[playerRankId];

        if (!playerRankInfo) {
            showMessage(t.fillGuildErrorRankNotFound + playerRankId, 'error', messageTarget);
            console.error("Player rank info not found for RankID:", playerRankId);
            return;
        }
        
        const taxes = playerRankInfo.Tax || {};
        const manaTax = taxes['1'] ?? 0;
        const shardTax = taxes['2'] ?? 0;
        const resourceTax = taxes['7'] ?? 0;

        const guildLevel = guildData.Level ?? 0;
        const nexusCrystalLevel = guildData.Upgrades ? (guildData.Upgrades['3'] ?? 0) : 0;

        document.getElementById('guildLevel').value = guildLevel;
        document.getElementById('guildNexusCrystalLevel').value = nexusCrystalLevel;
        document.getElementById('guildManaTax').value = manaTax;
        document.getElementById('guildResourceTax').value = resourceTax;
        document.getElementById('guildShardTax').value = shardTax;

        getAllCurrentValues();
        showMessage(t.fillGuildSuccess, "success", messageTarget);

    } else {
        showMessage(t.fillGuildErrorGameData, 'error', messageTarget);
        console.error("manarion.guild or manarion.player object is not available.");
    }
}

function fillPotionInfo() {
    const messageTarget = 'supplementMessage';
    const messageDiv = document.getElementById(messageTarget);
    if (messageDiv) messageDiv.innerHTML = '';

    if (manarion && manarion.potionBelt && manarion.potionBelt.Potions) {
        const potions = manarion.potionBelt.Potions;
        const t = translations[currentLanguage];

        const WISDOM_POTION_ID = '120';   
        const HARVESTING_POTION_ID = '124'; 
        const RESONANCE_POTION_ID = '122'; 

        const wisdomTier = potions[WISDOM_POTION_ID]?.Tier ?? 0;
        const harvestingTier = potions[HARVESTING_POTION_ID]?.Tier ?? 0;
        const resonanceTier = potions[RESONANCE_POTION_ID]?.Tier ?? 0;

        document.getElementById('wisdomPotionLevel').value = wisdomTier;
        document.getElementById('harvestingPotionLevel').value = harvestingTier;
        document.getElementById('resonancePotionLevel').value = resonanceTier;
        
        getAllCurrentValues();

        showMessage(t.fillPotionSuccess, "success", messageTarget);

    } else {
        console.error("The 'manarion.potionBelt' object is not available.");
    }
}

window.onload = function() {
    setTheme(currentTheme);
    setLanguage(currentLanguage);
    loadGlobalData();
    showExampleData();
};

window.addEventListener('beforeunload', function() {
    saveGlobalData();
});
</script>
</body>
</html>`; }

    function handleButtonClickCalculate() {
        console.log("Button clicked!");
        
        let panel = document.getElementById('manarion-calculator-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            return;
        }
        
        panel = document.createElement('div');
        panel.id = 'manarion-calculator-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1200px;
            height: 80vh;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1000000;
            overflow: auto;
        `;
        
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 15px;';
        panel.appendChild(iframe);
        
        document.body.appendChild(panel);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(getFullHTMLContent());
        iframeDoc.close();

        iframe.onload = function() {
            const doc = iframe.contentDocument;
            if (!doc) return;

            const unwantedIds = [
                'elnaeth-settings-button',
                'elnaeth-modal-overlay'
            ];

            unwantedIds.forEach(id => {
                const unwantedElement = doc.getElementById(id);
                if (unwantedElement) {
                    unwantedElement.remove();
                    console.log(`Manarion Helper: Removed conflicting element #${id} from its UI.`);
                }
            });

        };

        iframe.contentWindow.fetchDataWithGM = async function(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    },
                    onload: function(response) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #ff4444;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000001;
        `;
        closeBtn.onclick = () => panel.style.display = 'none';
        panel.appendChild(closeBtn);
    }

    function initHelper() {
        createDraggableButton();
    }

    function createDraggableButton() {
        if (document.getElementById('manarion-helper-button')) return;

        const button = document.createElement('div');
        button.id = 'manarion-helper-button';
        button.innerHTML = `
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        `;

        Object.assign(button.style, {
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'move',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            zIndex: '999999',
            transition: 'all 0.3s ease',
            border: '4px solid rgba(255,255,255,0.2)',
            userSelect: 'none',
            touchAction: 'none'
        });

        let isDragging = false;
        let hasMoved = false;
        let startX = 0, startY = 0; 
        let initialX = 0, initialY = 0; 

        function dragStart(clientX, clientY) {
            isDragging = true;
            hasMoved = false;
            startX = clientX;
            startY = clientY;
            
            const rect = button.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            button.style.transition = 'none';
            button.style.cursor = 'grabbing';
        }

        function dragMove(clientX, clientY) {
            if (!isDragging) return;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                hasMoved = true;
            }

            if (hasMoved) {
                const newX = initialX + deltaX;
                const newY = initialY + deltaY;
                const buttonSize = button.offsetWidth; 

                const limitedX = Math.max(0, Math.min(newX, window.innerWidth - buttonSize));
                const limitedY = Math.max(0, Math.min(newY, window.innerHeight - buttonSize));
                
                button.style.left = `${limitedX}px`;
                button.style.top = `${limitedY}px`;
                button.style.right = 'auto';
                button.style.transform = 'none';
            }
        }

        function dragEnd() {
            if (isDragging) {
                if (!hasMoved) {
                    handleButtonClickCalculate();
                }
                isDragging = false;
                // hasMoved 在 dragStart 中重置
                button.style.transition = 'all 0.3s ease';
                button.style.cursor = 'move';
            }
        }


        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            dragStart(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            dragMove(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', dragEnd);

        button.addEventListener('touchstart', (e) => {
            // e.preventDefault(); // 在touchstart中阻止默认事件有时会阻止点击，需谨慎
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                dragStart(touch.clientX, touch.clientY);
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                dragMove(touch.clientX, touch.clientY);
            }
        });
        
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchcancel', dragEnd);

        button.addEventListener('mouseenter', () => {
            if (!isDragging) {
                button.style.transform = button.style.transform === 'translateY(-50%)' ? 
                    'translateY(-50%) scale(1.1)' : 'scale(1.1)';
                button.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!isDragging) {
                button.style.transform = button.style.transform.includes('translateY(-50%)') ? 
                    'translateY(-50%)' : 'none';
                button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }
        });

        document.body.appendChild(button);
        console.log('Manarion Helper Button created!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHelper);
    } else {
        setTimeout(initHelper, 1000);
    }

})();