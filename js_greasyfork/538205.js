// ==UserScript==
// @name         MWI-AutoCombat
// @name:zh-CN   MWI自动战斗助手
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Auto-manage game queue(自动9战)
// @author       XIxixi297
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @downloadURL https://update.greasyfork.org/scripts/538205/MWI-AutoCombat.user.js
// @updateURL https://update.greasyfork.org/scripts/538205/MWI-AutoCombat.meta.js
// ==/UserScript==

/**
 * 关于使用本插件可能存在的脚本行为说明：
 *
 * 《游戏规则》
 *
 * 4.机器人、脚本和扩展
 *
 *  4.1禁止机器人: 请勿使用任何自动化程序代替你操作游戏。
 *  4.2脚本和扩展: 任何脚本或扩展程序都不得为玩家执行任何操作(向服务器发送任何请求)， 仅限使用于显示信息或改进用户界面 (例如: 显示战斗摘要、跟踪掉落、将按钮移动到不同位置)。
 *
 * 请仔细阅读游戏规则条款后，再选择是否安装使用本插件，谢谢！
 */

(function (workerScript) {
    if (!/MSIE 10/i.test(navigator.userAgent)) {
        try {
            var blob = new Blob(["var fakeIdToId = {};\nonmessage = function (event) {\n\tvar data = event.data,\n\t\tname = data.name,\n\t\tfakeId = data.fakeId,\n\t\ttime;\n\tif(data.hasOwnProperty('time')) {\n\t\ttime = data.time;\n\t}\n\tswitch (name) {\n\t\tcase 'setInterval':\n\t\t\tfakeIdToId[fakeId] = setInterval(function () {\n\t\t\t\tpostMessage({fakeId: fakeId});\n\t\t\t}, time);\n\t\t\tbreak;\n\t\tcase 'clearInterval':\n\t\t\tif (fakeIdToId.hasOwnProperty (fakeId)) {\n\t\t\t\tclearInterval(fakeIdToId[fakeId]);\n\t\t\t\tdelete fakeIdToId[fakeId];\n\t\t\t}\n\t\t\tbreak;\n\t\tcase 'setTimeout':\n\t\t\tfakeIdToId[fakeId] = setTimeout(function () {\n\t\t\t\tpostMessage({fakeId: fakeId});\n\t\t\t\tif (fakeIdToId.hasOwnProperty (fakeId)) {\n\t\t\t\t\tdelete fakeIdToId[fakeId];\n\t\t\t\t}\n\t\t\t}, time);\n\t\t\tbreak;\n\t\tcase 'clearTimeout':\n\t\t\tif (fakeIdToId.hasOwnProperty (fakeId)) {\n\t\t\t\tclearTimeout(fakeIdToId[fakeId]);\n\t\t\t\tdelete fakeIdToId[fakeId];\n\t\t\t}\n\t\t\tbreak;\n\t}\n}\n"]);
            workerScript = window.URL.createObjectURL(blob);
        } catch (error) {
            /* Blob is not supported, use external script instead */
        }
    }
    var worker,
        fakeIdToCallback = {},
        lastFakeId = 0,
        maxFakeId = 0x7FFFFFFF;
    if (typeof (Worker) !== 'undefined') {
        function getFakeId() {
            do {
                if (lastFakeId == maxFakeId) {
                    lastFakeId = 0;
                } else {
                    lastFakeId++;
                }
            } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
            return lastFakeId;
        }
        try {
            worker = new Worker(workerScript);
            window.setInterval = function (callback, time) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2)
                };
                worker.postMessage({
                    name: 'setInterval',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };
            window.clearInterval = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearInterval',
                        fakeId: fakeId
                    });
                }
            };
            window.setTimeout = function (callback, time) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2),
                    isTimeout: true
                };
                worker.postMessage({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };
            window.clearTimeout = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });
                }
            };
            worker.onmessage = function (event) {
                var data = event.data,
                    fakeId = data.fakeId,
                    request,
                    parameters,
                    callback;
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    request = fakeIdToCallback[fakeId];
                    callback = request.callback;
                    parameters = request.parameters;
                    if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
                        delete fakeIdToCallback[fakeId];
                    }
                }
                if (typeof (callback) === 'string') {
                    try {
                        callback = new Function(callback);
                    } catch (error) {
                        console.log('HackTimer.js by turuslan: Error parsing callback code string: ', error);
                    }
                }
                if (typeof (callback) === 'function') {
                    callback.apply(window, parameters);
                }
            };
            worker.onerror = function (event) {
                console.log(event);
            };
        } catch (error) {
            console.log('HackTimer.js by turuslan: Initialisation failed');
            console.error(error);
        }
    } else {
        console.log('HackTimer.js by turuslan: Initialisation failed - HTML5 Web Worker is not supported');
    }
})('HackTimerWorker.js');

(function () {
    'use strict';

    // 任务数据字典
    const hrids = [
        "/actions/combat/fly",
        "/actions/combat/rat",
        "/actions/combat/skunk",
        "/actions/combat/porcupine",
        "/actions/combat/slimy",
        "/actions/combat/smelly_planet",
        "/actions/combat/smelly_planet_elite",
        "/actions/combat/frog",
        "/actions/combat/snake",
        "/actions/combat/swampy",
        "/actions/combat/alligator",
        "/actions/combat/swamp_planet",
        "/actions/combat/swamp_planet_elite",
        "/actions/combat/sea_snail",
        "/actions/combat/crab",
        "/actions/combat/aquahorse",
        "/actions/combat/nom_nom",
        "/actions/combat/turtle",
        "/actions/combat/aqua_planet",
        "/actions/combat/aqua_planet_elite",
        "/actions/combat/jungle_sprite",
        "/actions/combat/myconid",
        "/actions/combat/treant",
        "/actions/combat/centaur_archer",
        "/actions/combat/jungle_planet",
        "/actions/combat/jungle_planet_elite",
        "/actions/combat/gobo_stabby",
        "/actions/combat/gobo_slashy",
        "/actions/combat/gobo_smashy",
        "/actions/combat/gobo_shooty",
        "/actions/combat/gobo_boomy",
        "/actions/combat/gobo_planet",
        "/actions/combat/gobo_planet_elite",
        "/actions/combat/eye",
        "/actions/combat/eyes",
        "/actions/combat/veyes",
        "/actions/combat/planet_of_the_eyes",
        "/actions/combat/planet_of_the_eyes_elite",
        "/actions/combat/novice_sorcerer",
        "/actions/combat/ice_sorcerer",
        "/actions/combat/flame_sorcerer",
        "/actions/combat/elementalist",
        "/actions/combat/sorcerers_tower",
        "/actions/combat/sorcerers_tower_elite",
        "/actions/combat/gummy_bear",
        "/actions/combat/panda",
        "/actions/combat/black_bear",
        "/actions/combat/grizzly_bear",
        "/actions/combat/polar_bear",
        "/actions/combat/bear_with_it",
        "/actions/combat/bear_with_it_elite",
        "/actions/combat/magnetic_golem",
        "/actions/combat/stalactite_golem",
        "/actions/combat/granite_golem",
        "/actions/combat/golem_cave",
        "/actions/combat/golem_cave_elite",
        "/actions/combat/zombie",
        "/actions/combat/vampire",
        "/actions/combat/werewolf",
        "/actions/combat/twilight_zone",
        "/actions/combat/twilight_zone_elite",
        "/actions/combat/abyssal_imp",
        "/actions/combat/soul_hunter",
        "/actions/combat/infernal_warlock",
        "/actions/combat/infernal_abyss",
        "/actions/combat/infernal_abyss_elite",
        "/actions/combat/chimerical_den",
        "/actions/combat/sinister_circus",
        "/actions/combat/enchanted_fortress",
        "/actions/combat/pirate_cove"
    ];

    const zhNames = [
        "苍蝇",
        "杰瑞",
        "臭鼬",
        "豪猪",
        "史莱姆",
        "臭臭星球",
        "臭臭星球 (精英)",
        "青蛙",
        "蛇",
        "沼泽虫",
        "夏洛克",
        "沼泽星球",
        "沼泽星球 (精英)",
        "蜗牛",
        "螃蟹",
        "水马",
        "咬咬鱼",
        "忍者龟",
        "海洋星球",
        "海洋星球 (精英)",
        "丛林精灵",
        "蘑菇人",
        "树人",
        "半人马弓箭手",
        "丛林星球",
        "丛林星球 (精英)",
        "刺刺",
        "砍砍",
        "锤锤",
        "咻咻",
        "轰轰",
        "哥布林星球",
        "哥布林星球 (精英)",
        "独眼",
        "叠眼",
        "复眼",
        "眼球星球",
        "眼球星球 (精英)",
        "新手巫师",
        "冰霜巫师",
        "火焰巫师",
        "元素法师",
        "巫师之塔",
        "巫师之塔 (精英)",
        "软糖熊",
        "熊猫",
        "黑熊",
        "棕熊",
        "北极熊",
        "熊熊星球",
        "熊熊星球 (精英)",
        "磁力魔像",
        "钟乳石魔像",
        "花岗岩魔像",
        "魔像洞穴",
        "魔像洞穴 (精英)",
        "僵尸",
        "吸血鬼",
        "狼人",
        "暮光之地",
        "暮光之地 (精英)",
        "深渊小鬼",
        "灵魂猎手",
        "地狱术士",
        "地狱深渊",
        "地狱深渊 (精英)",
        "奇幻洞穴",
        "阴森马戏团",
        "秘法要塞",
        "海盗基地"
    ];
    const enNames = [
        "Fly",
        "Jerry",
        "Skunk",
        "Porcupine",
        "Slimy",
        "Smelly Planet",
        "Smelly Planet (Elite)",
        "Frogger",
        "Thnake",
        "Swampy",
        "Sherlock",
        "Swamp Planet",
        "Swamp Planet (Elite)",
        "Gary",
        "I Pinch",
        "Aquahorse",
        "Nom Nom",
        "Turuto",
        "Aqua Planet",
        "Aqua Planet (Elite)",
        "Jungle Sprite",
        "Myconid",
        "Treant",
        "Centaur Archer",
        "Jungle Planet",
        "Jungle Planet (Elite)",
        "Stabby",
        "Slashy",
        "Smashy",
        "Shooty",
        "Boomy",
        "Gobo Planet",
        "Gobo Planet (Elite)",
        "Eye",
        "Eyes",
        "Veyes",
        "Planet Of The Eyes",
        "Planet Of The Eyes (Elite)",
        "Novice Sorcerer",
        "Ice Sorcerer",
        "Flame Sorcerer",
        "Elementalist",
        "Sorcerer's Tower",
        "Sorcerer's Tower (Elite)",
        "Gummy Bear",
        "Panda",
        "Black Bear",
        "Grizzly Bear",
        "Polar Bear",
        "Bear With It",
        "Bear With It (Elite)",
        "Magnetic Golem",
        "Stalactite Golem",
        "Granite Golem",
        "Golem Cave",
        "Golem Cave (Elite)",
        "Zombie",
        "Vampire",
        "Werewolf",
        "Twilight Zone",
        "Twilight Zone (Elite)",
        "Abyssal Imp",
        "Soul Hunter",
        "Infernal Warlock",
        "Infernal Abyss",
        "Infernal Abyss (Elite)",
        "Chimerical Den",
        "Sinister Circus",
        "Enchanted Fortress",
        "Pirate Cove"
    ]

    // 语言检测
    const isZhCN = navigator.language.toLowerCase().includes('zh');

    // 翻译字典
    const translations = {
        zh: {
            title: "自动战斗助手",
            selectTask: "选择任务:",
            battleCount: "每个队列战斗次数:",
            startButton: "开始挂机",
            stopButton: "停止挂机"
        },
        en: {
            title: "Combat Assistant",
            selectTask: "Select Task:",
            battleCount: "Battles per Queue:",
            startButton: "Start Auto",
            stopButton: "Stop Auto"
        }
    };

    const t = translations[isZhCN ? 'zh' : 'en'];

    // 队列监听器类
    class ReactActionQueueMonitor {
        constructor(callback, interval = 100) {
            this.callback = callback;
            this.interval = interval;
            this.lastValue = null;
            this.timer = null;
        }

        getProps() {
            const el = document.querySelector(".Header_leftHeader__PkRWX");
            if (!el) return null;
            const key = Object.keys(el).find(k => k.startsWith('__reactProps$'));
            return key ? el[key] : null;
        }

        getCurrentValue() {
            const props = this.getProps();
            return props?.children?.[0]?._owner?.memoizedProps?.characterActions?.length ?? null;
        }

        getActionQueueCap() {
            const props = this.getProps();
            return props?.children?.[0]?._owner?.memoizedProps?.characterInfo?.actionQueueCap ?? null;
        }

        start() {
            if (this.timer) return;
            this.timer = setInterval(() => {
                const val = this.getCurrentValue();
                const cap = this.getActionQueueCap();
                if (val !== null && cap !== null && val !== this.lastValue && val < cap) {
                    this.callback();
                }
                this.lastValue = val;
            }, this.interval);
        }

        stop() {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 战斗任务创建器
    class CombatTaskCreator {
        constructor() {
            this.reactInstance = null;
        }

        findReactInstance() {
            const rootEl = document.querySelector(".GamePage_gamePage__ixiPl");
            if (!rootEl) return null;

            const fiberKey = Object.keys(rootEl).find(k => k.startsWith("__reactFiber$"));
            if (!fiberKey) return null;

            let fiber = rootEl[fiberKey];
            while (fiber) {
                const inst = fiber.stateNode;
                if (inst && typeof inst.sendPing === "function") {
                    return inst;
                }
                fiber = fiber.return;
            }
            return null;
        }

        createCombatAction(hrid, battleCount) {
            if (!this.reactInstance) {
                this.reactInstance = this.findReactInstance();
            }

            if (this.reactInstance && typeof this.reactInstance.handleNewCharacterAction === "function") {
                this.reactInstance.handleNewCharacterAction(hrid, true, battleCount, "", "", 0, 0, 0, false);
                return true;
            }
            return false;
        }
    }

    // 本地存储管理器
    class StorageManager {
        static get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(`combatAssistant_${key}`);
                return value ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        }

        static set(key, value) {
            try {
                localStorage.setItem(`combatAssistant_${key}`, JSON.stringify(value));
            } catch (e) {
                console.error('Storage error:', e);
            }
        }
    }

    // 主应用类
    class CombatAssistant {
        constructor() {
            this.monitor = null;
            this.taskCreator = new CombatTaskCreator();
            this.isRunning = false;
            this.selectedTaskIndex = StorageManager.get('selectedTask', 0);
            this.battleCount = StorageManager.get('battleCount', 9);
            this.panelPosition = StorageManager.get('panelPosition', { x: 100, y: 100 });
            this.isCollapsed = StorageManager.get('isCollapsed', false);
            this.isMinimized = StorageManager.get('isMinimized', false);
            this.wasDragged = false;

            this.init();
        }

        init() {
            this.createUI();
            this.setupEventListeners();
            this.setupDragAndDrop();
            this.loadSettings();
        }

        // 验证输入值是否合法
        validateBattleCount(value) {
            // 检查是否为空或非数字
            if (value === '' || isNaN(value)) {
                return false;
            }
            
            const num = parseInt(value);
            
            // 检查是否为整数且在有效范围内
            if (!Number.isInteger(num) || num < 1 || num > 9999999999) {
                return false;
            }
            
            // 检查是否超过10位数（字符串长度检查，排除前导零等情况）
            const cleanValue = value.toString().replace(/^0+/, '') || '0';
            if (cleanValue.length > 10) {
                return false;
            }
            
            return true;
        }

        // 更新开始按钮状态
        updateStartButtonState() {
            const startButton = this.panel.querySelector('#combat-start-button');
            const battleCountInput = this.panel.querySelector('#combat-battle-count');
            const inputValue = battleCountInput.value;
            
            const isValid = this.validateBattleCount(inputValue);
            startButton.disabled = !isValid || this.isRunning;
            
            // 视觉反馈
            if (isValid) {
                battleCountInput.style.borderColor = 'rgba(255,255,255,0.2)';
                battleCountInput.style.backgroundColor = 'rgba(0,0,0,0.3)';
            } else {
                battleCountInput.style.borderColor = '#e74c3c';
                battleCountInput.style.backgroundColor = 'rgba(231,76,60,0.1)';
            }
        }

        createUI() {
            // 创建面板容器
            this.panel = document.createElement('div');
            this.panel.id = 'combat-assistant-panel';
            this.panel.innerHTML = `
                <div id="combat-title-bar">
                    <h3 id="combat-panel-title">${t.title}</h3>
                    <div class="combat-title-buttons">
                        <button id="combat-minimize-button">−</button>
                    </div>
                </div>
                <div id="combat-panel-content">
                    <div class="combat-form-group">
                        <label>${t.selectTask}</label>
                        <select id="combat-task-select">
                            ${this.generateTaskOptions()}
                        </select>
                    </div>
                    <div class="combat-form-group">
                        <label>${t.battleCount}</label>
                        <input id="combat-battle-count" type="text" value="${this.battleCount}" maxLength="10" placeholder="1-9999999999">
                    </div>
                    <div class="combat-button-container">
                        <button id="combat-start-button">${t.startButton}</button>
                        <button id="combat-stop-button" disabled>${t.stopButton}</button>
                    </div>
                </div>
                <div id="combat-minimized-indicator">⚔</div>
            `;

            // 应用样式
            this.applyStyles();

            // 设置初始位置
            this.panel.style.left = this.panelPosition.x + 'px';
            this.panel.style.top = this.panelPosition.y + 'px';

            // 设置最小化状态
            if (this.isMinimized) {
                this.panel.classList.add('minimized');
                this.panel.querySelector('#combat-minimize-button').textContent = '+';
            }

            document.body.appendChild(this.panel);
        }

        generateTaskOptions() {
            const names = isZhCN ? zhNames : enNames;
            return hrids.map((hrid, index) =>
                `<option value="${index}">${names[index] || hrid}</option>`
            ).join('');
        }

        applyStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #combat-assistant-panel {
                    position: fixed;
                    width: 300px;
                    padding: 20px;
                    background: rgba(44, 62, 80, 0.95);
                    color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    backdrop-filter: blur(5px);
                    user-select: none;
                    transition: all 0.3s ease;
                    border: 2px solid rgba(255,255,255,0.1);
                }

                #combat-assistant-panel.minimized {
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50% !important;
                    padding: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    overflow: hidden !important;
                }

                #combat-assistant-panel.minimized * {
                    display: none !important;
                }

                #combat-assistant-panel.minimized #combat-minimized-indicator {
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: 1 !important;
                }

                #combat-assistant-panel.collapsed #combat-panel-content {
                    display: none;
                }

                #combat-title-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    cursor: move;
                    padding: 5px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                #combat-panel-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: bold;
                }

                .combat-title-buttons {
                    display: flex;
                    gap: 5px;
                }

                #combat-minimize-button {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                #combat-minimize-button:hover {
                    background: rgba(255,255,255,0.2);
                }

                .combat-form-group {
                    margin-bottom: 15px;
                }

                .combat-form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #bdc3c7;
                }

                #combat-task-select, #combat-battle-count {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 6px;
                    background: rgba(0,0,0,0.3);
                    color: white;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.3s, background-color 0.3s;
                }

                #combat-task-select:focus, #combat-battle-count:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
                }

                /* 输入框无效状态样式 */
                #combat-battle-count.invalid {
                    border-color: #e74c3c !important;
                    background-color: rgba(231,76,60,0.1) !important;
                }

                .combat-button-container {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                #combat-start-button, #combat-stop-button {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                #combat-start-button {
                    background: #27ae60;
                    color: white;
                }

                #combat-start-button:hover:not(:disabled) {
                    background: #2ecc71;
                    transform: translateY(-1px);
                }

                #combat-stop-button {
                    background: #e74c3c;
                    color: white;
                }

                #combat-stop-button:hover:not(:disabled) {
                    background: #c0392b;
                    transform: translateY(-1px);
                }

                #combat-start-button:disabled, #combat-stop-button:disabled {
                    background: #7f8c8d;
                    cursor: not-allowed;
                    transform: none;
                }

                #combat-minimized-indicator {
                    font-size: 24px;
                    color: white;
                    text-align: center;
                    line-height: 1;
                    display: none;
                }

                /* 响应式设计 */
                @media (max-width: 768px) {
                    #combat-assistant-panel {
                        width: 280px;
                        padding: 15px;
                        font-size: 13px;
                    }

                    #combat-panel-title {
                        font-size: 15px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setupEventListeners() {
            // 任务选择变化
            this.panel.querySelector('#combat-task-select').addEventListener('change', (e) => {
                this.selectedTaskIndex = parseInt(e.target.value);
                StorageManager.set('selectedTask', this.selectedTaskIndex);
            });

            // 战斗次数变化 - 修改后的验证逻辑
            const battleCountInput = this.panel.querySelector('#combat-battle-count');
            battleCountInput.addEventListener('input', (e) => {
                const inputValue = e.target.value;
                
                // 实时验证并更新按钮状态
                this.updateStartButtonState();
                
                // 只有在输入合法时才保存到存储
                if (this.validateBattleCount(inputValue)) {
                    this.battleCount = parseInt(inputValue);
                    StorageManager.set('battleCount', this.battleCount);
                }
            });

            // 添加失焦事件，确保输入完成后进行验证
            battleCountInput.addEventListener('blur', () => {
                this.updateStartButtonState();
            });

            // 开始按钮
            this.panel.querySelector('#combat-start-button').addEventListener('click', () => {
                // 双重检查：点击时再次验证
                const inputValue = this.panel.querySelector('#combat-battle-count').value;
                if (this.validateBattleCount(inputValue)) {
                    this.battleCount = parseInt(inputValue);
                    this.startAuto();
                }
            });

            // 停止按钮
            this.panel.querySelector('#combat-stop-button').addEventListener('click', () => {
                this.stopAuto();
            });

            // 最小化按钮
            this.panel.querySelector('#combat-minimize-button').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });

            // 最小化状态下点击恢复
            this.panel.addEventListener('click', (e) => {
                if (this.isMinimized && !this.wasDragged) {
                    e.stopPropagation();
                    this.toggleMinimize();
                }
                // 重置拖拽状态
                this.wasDragged = false;
            });

            // 手机端触摸事件支持
            this.panel.addEventListener('touchend', (e) => {
                if (this.isMinimized && !this.wasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMinimize();
                }
                // 重置拖拽状态
                this.wasDragged = false;
            });
        }

        setupDragAndDrop() {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            const titleBar = this.panel.querySelector('#combat-title-bar');

            const handleStart = (e) => {
                // 如果点击的是最小化按钮，不进行拖拽
                if (e.target.id === 'combat-minimize-button') {
                    return;
                }

                if (this.isMinimized) {
                    // 最小化状态下，整个面板都可以拖拽
                    const rect = this.panel.getBoundingClientRect();
                    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
                    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

                    // 检查点击是否在面板范围内
                    if (clientX >= rect.left && clientX <= rect.right &&
                        clientY >= rect.top && clientY <= rect.bottom) {
                        isDragging = true;
                        startX = clientX;
                        startY = clientY;
                        startLeft = parseInt(this.panel.style.left) || 0;
                        startTop = parseInt(this.panel.style.top) || 0;
                        this.panel.style.transition = 'none';
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return;
                }

                // 正常状态下，只有标题栏可以拖拽
                isDragging = true;

                const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
                const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

                startX = clientX;
                startY = clientY;
                startLeft = parseInt(this.panel.style.left) || 0;
                startTop = parseInt(this.panel.style.top) || 0;

                this.panel.style.transition = 'none';
                e.preventDefault();
            };

            const handleMove = (e) => {
                if (!isDragging) return;

                const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
                const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

                const deltaX = clientX - startX;
                const deltaY = clientY - startY;

                // 如果移动距离超过阈值，标记为已拖拽
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    this.wasDragged = true;
                }

                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                // 限制在窗口内
                const panelRect = this.panel.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                newLeft = Math.max(0, Math.min(newLeft, windowWidth - panelRect.width));
                newTop = Math.max(0, Math.min(newTop, windowHeight - panelRect.height));

                this.panel.style.left = newLeft + 'px';
                this.panel.style.top = newTop + 'px';

                this.panelPosition = { x: newLeft, y: newTop };
            };

            const handleEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                this.panel.style.transition = 'all 0.3s ease';
                StorageManager.set('panelPosition', this.panelPosition);
                StorageManager.set('isMinimized', this.isMinimized);

                // 使用setTimeout延迟重置拖拽状态，确保click事件能正确检测到拖拽状态
                setTimeout(() => {
                    if (!isDragging) { // 确保没有新的拖拽开始
                        this.wasDragged = false;
                    }
                }, 100);
            };

            // 鼠标事件
            titleBar.addEventListener('mousedown', handleStart);
            this.panel.addEventListener('mousedown', (e) => {
                if (this.isMinimized) handleStart(e);
            });
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // 触摸事件
            titleBar.addEventListener('touchstart', handleStart, { passive: false });
            this.panel.addEventListener('touchstart', (e) => {
                if (this.isMinimized) handleStart(e);
            }, { passive: false });
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
        }

        loadSettings() {
            this.panel.querySelector('#combat-task-select').value = this.selectedTaskIndex;
            this.panel.querySelector('#combat-battle-count').value = this.battleCount;
            
            // 初始化时验证输入并更新按钮状态
            this.updateStartButtonState();
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            const minimizeBtn = this.panel.querySelector('#combat-minimize-button');

            if (this.isMinimized) {
                // 先保存当前位置
                const rect = this.panel.getBoundingClientRect();
                this.panelPosition = {
                    x: parseInt(this.panel.style.left) || rect.left,
                    y: parseInt(this.panel.style.top) || rect.top
                };

                this.panel.classList.add('minimized');
                minimizeBtn.textContent = '+';

                // 只调整位置确保完全显示
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                let newLeft = this.panelPosition.x;
                let newTop = this.panelPosition.y;

                // 确保最小化后的面板完全在屏幕内
                newLeft = Math.max(0, Math.min(newLeft, windowWidth - 50));
                newTop = Math.max(0, Math.min(newTop, windowHeight - 50));

                this.panel.style.left = newLeft + 'px';
                this.panel.style.top = newTop + 'px';
            } else {
                this.panel.classList.remove('minimized');
                minimizeBtn.textContent = '−';

                // 恢复到之前的位置
                this.panel.style.left = this.panelPosition.x + 'px';
                this.panel.style.top = this.panelPosition.y + 'px';
            }

            StorageManager.set('panelPosition', this.panelPosition);
        }

        startAuto() {
            if (this.isRunning) return;

            // 开始前最后一次验证
            const inputValue = this.panel.querySelector('#combat-battle-count').value;
            if (!this.validateBattleCount(inputValue)) {
                return;
            }

            this.isRunning = true;
            
            // 更新按钮状态
            this.updateStartButtonState();
            this.panel.querySelector('#combat-stop-button').disabled = false;

            // 创建监听器
            this.monitor = new ReactActionQueueMonitor(() => {
                const selectedHrid = hrids[this.selectedTaskIndex];
                if (selectedHrid && this.taskCreator.createCombatAction(selectedHrid, this.battleCount)) {
                } else {
                    console.error('Failed to create combat action');
                }
            });

            this.monitor.start();
        }

        stopAuto() {
            if (!this.isRunning) return;

            this.isRunning = false;
            
            // 更新按钮状态
            this.updateStartButtonState();  
            this.panel.querySelector('#combat-stop-button').disabled = true;

            if (this.monitor) {
                this.monitor.stop();
                this.monitor = null;
            }
        }
    }

    // 等待页面加载完成后启动
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => new CombatAssistant(), 1000);
            });
        } else {
            setTimeout(() => new CombatAssistant(), 1000);
        }
    }

    init();
})();