// ==UserScript==
// @name         1.传奇挂机多功能脚本 - 重构版
// @namespace    https://linux.do/u/ziyun
// @version      1.5.1
// @author       am (优化 传奇挂机多功能脚本)
// @description  传奇挂机多功能脚本 - 优化版本，提高代码可维护性和效率
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hai.one
// @match        http://cq.e-hai.one/play?*
// @match        http://chuanqi.proxy2world.com/play?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526469/1%E4%BC%A0%E5%A5%87%E6%8C%82%E6%9C%BA%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC%20-%20%E9%87%8D%E6%9E%84%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526469/1%E4%BC%A0%E5%A5%87%E6%8C%82%E6%9C%BA%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC%20-%20%E9%87%8D%E6%9E%84%E7%89%88.meta.js
// ==/UserScript==

(o => {
    if (typeof GM_addStyle == "function") {
        GM_addStyle(o);
        return;
    }
    const t = document.createElement("style");
    t.textContent = o, document.head.append(t);
  })(" .control-panel{position:fixed;bottom:0;left:0;min-width:auto;z-index:9999;background-color:rgba(0,0,0,0.7);padding:5px;border-radius:5px}.control-panel .control-group{display:flex;flex-wrap:wrap;}.control-panel .control-group .button{color:#ece6cf;background-color:#084552;padding:.3rem;border:none;cursor:pointer;border-radius:.2rem;transition:background-color 0.3s;}.control-panel .control-group .button:hover{background-color:#0a5566;} .control-panel .control-group input{border-radius: 1rem; appearance: none; border: 1px solid #ccc; background-color: #f8f8f8; color: #333; width: 1rem; text-align:center;} .control-panel .control-group .input-group{display:flex;align-items:center;margin:0.2rem;} ");

  (function() {
    'use strict';

    // --- 配置项 ---
    const CONFIG = {
        // UI相关
        ui: {
            buttonColorActive: "#55b47d",
            buttonColorInactive: "#084552",
            toastColorSuccess: "0x00ff60",
            toastColorWarning: "0xffa500",
            toastColorError: "0xff0000",
        },
        // 地图相关
        maps: {
            FENG_MO_GU: {
                id: 9,
                sendId: 12,
                name: "封魔谷"
            },
            CANG_YUE_DAO: {
                id: 4,
                sendId: 4,
                name: "苍月岛"
            },
            TIAN_CHI: {
                id: 349,
                sendId: 235,
                name: "天池"
            },
            CHEN_MO_ZHI_LU_5: {
                id: 347,
                sendId: 233,
                name: "沉默之路5"
            },
            HUN_SHUI_ZHI_DI_5: {
                id: 348,
                sendId: 234,
                name: "昏睡之地5"
            },
            ZHUANG_YUAN: {
                id: 150,
                sendId: 118,
                name: "庄园"
            },
        },
        // 安全区域
        safeZones: {
            FENG_MO_GU: [
                [162, 60],
                [208, 95],
                [155, 130],
                [110, 100]
            ]
        },
        // 技能和物品ID
        skills: {
            FIRE_WALL: 14,
            FLY_SHOES: 58,
        },
        items: {
            EXP_5X: 462,
        },
        // 定时器间隔
        intervals: {
            FIRE_WALL: 9000,
            AUTO_FLY: 3000,
            RANDOM_FARM: 4000,
            AUTO_BOSS: 1000,
            AUTO_QL_FLY: 5000,
            AUTO_EXP: 1200000, // 20分钟
            AUTO_MANOR: 20000, // 1分钟
            FIXED_POINT: 300,
        },
        // 庄园设置
        manor: {
            scheduledMinute: 50,
            xPoint: 40,
            yPoint: 31,
            checkQingLongDelay: 180000, // 3分钟后返回苍月岛
            pathFindingDelay: 1000, // 传送后等待寻路的延迟
            checkAfterPathDelay: 5000, // 寻路后等待到达目的地的延迟
            qingLongCheckInterval: 3000, // 每3秒检测一次青龙
            pathFindingRetryInterval: 2000, // 寻路重试间隔
            maxPathFindingRetries: 5, // 最大寻路重试次数
        },
        // 互斥功能组
        exclusiveGroups: {
            farmMode: ["randomFarm", "toCangYue", "toTianChi", "toChenMo", "toHunShui", "autoQLFly"]
        }
    };

    // --- 工具类 ---
    class Icons {
        static startIcon = '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M823.8 603.5l-501.2 336c-50.7 34-119.3 20.4-153.2-30.2-12.2-18.2-18.7-39.6-18.7-61.5v-672c0-61 49.5-110.4 110.4-110.4 21.9 0 43.3 6.5 61.5 18.7l501.1 336c50.7 34 64.2 102.6 30.2 153.2-7.8 11.9-18.1 22.2-30.1 30.2z m0 0"></path></svg>';
        static stopIcon = '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M941.967463 109.714286v804.571428q0 14.857143-10.857143 25.714286t-25.714286 10.857143H100.824606q-14.857143 0-25.714286-10.857143t-10.857143-25.714286V109.714286q0-14.857143 10.857143-25.714286t25.714286-10.857143h804.571428q14.857143 0 25.714286 10.857143t10.857143 25.714286z"></path></svg>';
    }

    class Rectangle {
        constructor(vertices) {
            this.vertices = vertices;
        }

        crossProduct(x, y, z) {
            return (z[1] - y[1]) * (y[0] - x[0]) - (z[0] - y[0]) * (y[1] - x[1]);
        }

        isOnSameSide(p1, p2, a, b) {
            const cp1 = this.crossProduct(a, b, p1);
            const cp2 = this.crossProduct(a, b, p2);
            return cp1 * cp2 >= 0;
        }

        isInside(x, y) {
            const[A, B, C, D] = this.vertices;
            const p = [x, y];
            return this.isOnSameSide(p, A, B, C) &&
                   this.isOnSameSide(p, B, C, D) &&
                   this.isOnSameSide(p, C, D, A) &&
                   this.isOnSameSide(p, D, A, B);
        }
    }

    // 初始化安全区域
    const safeZones = {};
    for (const key in CONFIG.safeZones) {
        safeZones[key] = new Rectangle(CONFIG.safeZones[key]);
    }

    // 消息提示函数
    function toast(message, color = CONFIG.ui.toastColorSuccess) {
        if (typeof app !== 'undefined' && app.uMEZy && app.uMEZy.ins) {
            app.uMEZy.ins().IrCm(`|C:${color}&T:${message}|`);
        } else {
            console.warn("Toast message:", message, "Color:", color);
        }
    }

    // --- 状态管理 ---
    class ScriptState {
        constructor() {
            this.timers = {};
            this.buttonStatus = {};
            this.activeFarmMode = null;
            this.timerFunctions = {}; // 存储定时器回调函数
        }

        setButtonActive(buttonName, isActive) {
            this.buttonStatus[buttonName] = isActive;
            // 如果是挂机模式按钮，并且被激活，则更新当前激活的挂机模式
            if (isActive && CONFIG.exclusiveGroups.farmMode.includes(buttonName)) {
                this.activeFarmMode = buttonName;
            } else if (!isActive && this.activeFarmMode === buttonName) {
                this.activeFarmMode = null;
            }
        }

        isButtonActive(buttonName) {
            return !!this.buttonStatus[buttonName];
        }

        startTimer(timerName, interval, callback) {
            this.stopTimer(timerName);
            // 保存回调函数的引用
            this.timerFunctions[timerName] = callback;

            // 创建一个闭包来保持对回调的引用
            const boundCallback = function() {
                if (typeof callback === 'function') {
                    try {
                        callback();
                    } catch (e) {
                        console.error(`Timer ${timerName} error:`, e);
                    }
                }
            };

            this.timers[timerName] = window.setInterval(boundCallback, interval);
            console.log(`Timer ${timerName} started with ID ${this.timers[timerName]}`);
        }

        stopTimer(timerName) {
            if (this.timers[timerName]) {
                console.log(`Stopping timer ${timerName} with ID ${this.timers[timerName]}`);
                window.clearInterval(this.timers[timerName]);
                delete this.timers[timerName];
                delete this.timerFunctions[timerName];
            }
        }

        stopAllTimers() {
            console.log("Stopping all timers");
            for (const timerName in this.timers) {
                this.stopTimer(timerName);
            }
        }
    }

    const scriptState = new ScriptState();

    // --- 游戏工具类 ---
    const gameUtils = {
        getPlayer: function() {
            if (typeof app !== 'undefined' && app.NWRFmB && app.NWRFmB.ins) {
                return app.NWRFmB.ins().getPayer;
            } else {
                console.warn("游戏API (app.NWRFmB)不可用.");
                return null;
            }
        },

        getCharRole: function(obj) {
            if (typeof app !== 'undefined' && app.NWRFmB && app.NWRFmB.ins) {
                return app.NWRFmB.ins().getCharRole(obj);
            } else {
                console.warn("游戏API（app.NWRFmB）不可用.");
                return null;
            }
        },

        getNearMonster: function() {
            if (typeof app !== 'undefined' && app.qTVCL && app.qTVCL.ins) {
                return app.qTVCL.ins().getNearestMonster();
            } else {
                console.warn("游戏API (app.qTVCL)不可用.");
                return null;
            }
        },

        checkMonster: function() {
            if (typeof app !== 'undefined' && app.NWRFmB && app.NWRFmB.ins) {
                const all = app.NWRFmB.ins().YUwhM();
                let count = 0;
                for (const a in all) {
                    const monster = all[a];
                    if (monster && monster.propSet && monster.propSet.getRace() == 1) {
                        count++;
                    }
                }
                return count;
            } else {
                console.warn("游戏API (app.NWRFmB) 不可用.");
                return 0;
            }
        },

        checkDropCount: function() {
            if (typeof app !== 'undefined' && app.NWRFmB && app.NWRFmB.ins) {
                const drops = app.NWRFmB.ins().dropList;
                let count = 0;
                for (const _ in drops) {
                    if (drops.hasOwnProperty(_)) {
                        count++;
                    }
                }
                return count;
            } else {
                console.warn("游戏API (app.NWRFmB) 不可用, 返回0.");
                return 0;
            }
        },

        checkEdcwsp: function() {
            if (typeof app !== 'undefined' && app.qTVCL && app.qTVCL.ins) {
                if (!app.qTVCL.ins().isOpen) {
                    app.GameMap.scenes.isHook = 1;
                    app.qTVCL.ins().edcwsp();
                    toast("开始挂机", CONFIG.ui.toastColorSuccess);
                }
            } else {
                console.error("游戏API (app.qTVCL) 不可用.");
            }
        },

        inMap: function(mapId) {
            if (typeof app !== 'undefined' && app.GameMap) {
                return app.GameMap.mapID === mapId;
            } else {
                console.warn("游戏API (app.GameMap)不可用.");
                return false;
            }
        },

        send: function(recog, mapId) {
            if (typeof app !== 'undefined' && app.PKRX && app.PKRX.ins) {
                  app.PKRX.ins().send_1_7(recog, mapId);
              } else {
                  console.warn("游戏API (app.PKRX)不可用.");
              }
        },

        ingotSend: function(recog, mapId) {
            if (typeof app !== 'undefined' && app.PKRX && app.PKRX.ins) {
                app.PKRX.ins().s_1_6(recog, mapId)
              } else {
                  console.warn("游戏API (app.PKRX)不可用.");
              }
        },

        fly: function() {
            if (typeof app !== 'undefined' && app.EhSWiR) {
                app.EhSWiR.m_clickSkillId = CONFIG.skills.FLY_SHOES
            } else {
                console.warn("游戏API (app.EhSWiR)不可用.");
            }
        },

        useFireWall: function() {
            if (typeof app !== 'undefined' && app.EhSWiR) {
                app.EhSWiR.m_clickSkillId = CONFIG.skills.FIRE_WALL;
            } else {
                console.warn("游戏API (app.EhSWiR)不可用.");
            }
        },

        useExp: function(itemId, count = 1) {
            if (typeof app !== 'undefined' && app.ThgMu && app.ThgMu.ins && app.pWFTj && app.pWFTj.ins) {
                const item = app.ThgMu.ins().getItemById(itemId);
                if (item) {
                    app.pWFTj.ins().useItem(item.series, itemId, count);
                    console.log(`已使用五倍经验`);
                } else {
                    console.log(`在仓库中没有找到五倍经验`);
                }
            } else {
                console.warn("游戏API(app.ThgMu or app.pWFTj)不可用.");
            }
        },

        checkQingLong: function() {
            if (typeof app !== 'undefined' && app.NWRFmB && app.NWRFmB.ins) {
                const all = app.NWRFmB.ins().YUwhM();
                for (const a in all) {
                    const monster = all[a];
                    if (monster && monster.propSet && monster.propSet.getRace() == 1) {
                        if (monster.propSet.getName() === "[神话]青龙") {
                            return true; // 找到青龙
                        }
                    }
                }
                return false; // 未找到青龙
            } else {
                console.warn("游戏API (app.NWRFmB) 不可用.");
                return false; // API 不可用时默认未找到青龙
            }
        },

        checkBossMonster: function() {
            if (typeof app !== 'undefined' && app.qTVCL && app.qTVCL.ins) {
                app.qTVCL.ins().YFOmNj(); // VIP BOSS 交互函数
                return true;
            }
            return false;
        }
    };

    // --- 辅助函数 ---
    function convertButton(btn, color, icon) {
        if (!btn) return;
        btn.style.backgroundColor = color;
        btn.innerHTML = icon;
    }

    function autoFlyAction(player) {
        if (!player || !player.propSet) return;
        const flyShoesCount = player.propSet.getFlyshoes();
        if (flyShoesCount > 0) {
            toast(`周围无怪，飞鞋启动，剩余飞鞋点数：${flyShoesCount - 1}`, CONFIG.ui.toastColorSuccess);
            gameUtils.fly();
        } else {
            toast("飞鞋点数不足，请补充", CONFIG.ui.toastColorError);
            scriptState.stopTimer("autoFlyTimer");
            scriptState.stopTimer("randomFarmTimer");
            scriptState.setButtonActive("autoFly", false);
            scriptState.setButtonActive("randomFarm", false);
            resetAllButtons();
        }
    }

    function stopExclusiveFarmMode(exceptButtonName) {
        if (scriptState.activeFarmMode && scriptState.activeFarmMode !== exceptButtonName) {
            const activeBtn = document.getElementById(scriptState.activeFarmMode);
            if (activeBtn) {
                buttonHandlers[scriptState.activeFarmMode](activeBtn);
            }
        }
    }

    function mapFarmHandler(buttonName, mapKey, btn) {
        // 停止其他互斥的挂机模式
        stopExclusiveFarmMode(buttonName);
        const isActive = scriptState.isButtonActive(buttonName);
        if (isActive) {
            scriptState.stopTimer(`${buttonName}Timer`);
            scriptState.setButtonActive(buttonName, false);
            convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
        } else {
            toast(`开始${CONFIG.maps[mapKey].name}挂机，传送中...`, CONFIG.ui.toastColorSuccess);
            scriptState.setButtonActive(buttonName, true);
            convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
            const farmLogic = function() {
                try {
                    if (!gameUtils.inMap(CONFIG.maps[mapKey].id)) {
                        toast(`不在${CONFIG.maps[mapKey].name}，开始传送`, CONFIG.ui.toastColorSuccess);
                        const player = gameUtils.getPlayer();
                        if (player && buttonName == "toCangYue") {
                            gameUtils.ingotSend(player.recog, CONFIG.maps[mapKey].sendId);
                        } else if(player) {
                             gameUtils.send(player.recog, CONFIG.maps[mapKey].sendId);
                        }
                    } else {
                        gameUtils.checkEdcwsp();
                        if (gameUtils.checkMonster() < 1 && gameUtils.checkDropCount() < 1) {
                            const player = gameUtils.getPlayer();
                            if (player) {
                                autoFlyAction(player);
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Error in ${buttonName} farm logic:`, e);
                }
            };
            scriptState.startTimer(`${buttonName}Timer`, CONFIG.intervals.RANDOM_FARM, farmLogic);
        }
    }

    function resetAllButtons() {
        const panel = document.getElementById("control-panel");
        if (!panel) return;
        const buttons = panel.querySelectorAll('.button');
        buttons.forEach(btn => {
            convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
        });
    }

    // --- 按钮处理程序 ---
    const buttonHandlers = {
        toggleFireWall: function(btn) {
            const isFireWallActive = scriptState.isButtonActive("toggleFireWall");
            if (isFireWallActive) {
                scriptState.stopTimer("fireWallTimer");
                scriptState.setButtonActive("toggleFireWall", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("自动火墙已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("toggleFireWall", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const fireWallLogic = function() {
                    try {
                        gameUtils.useFireWall();
                    } catch (e) {
                        console.error("Error in fireWall logic:", e);
                    }
                };
                scriptState.startTimer("fireWallTimer", CONFIG.intervals.FIRE_WALL, fireWallLogic);
            }
        },

        randomFarm: function(btn) {
            stopExclusiveFarmMode("randomFarm");
            const isRandomFarmActive = scriptState.isButtonActive("randomFarm");
            if (isRandomFarmActive) {
                scriptState.stopTimer("randomFarmTimer");
                scriptState.setButtonActive("randomFarm", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("封魔谷全自动挂机已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("randomFarm", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const farmLogic = function() {
                    try {
                        const player = gameUtils.getPlayer();
                        if (!player) return;
                        if (gameUtils.inMap(CONFIG.maps.FENG_MO_GU.id)) {
                            gameUtils.checkEdcwsp();
                            if (safeZones.FENG_MO_GU.isInside(player.lastX, player.lastY)) {
                                toast(`角色在安全区[${player.lastX},${player.lastY}]，飞鞋避险`, CONFIG.ui.toastColorWarning);
                                gameUtils.fly();
                            } else if (gameUtils.checkMonster() < 1 && gameUtils.checkDropCount() < 1) {
                                autoFlyAction(player);
                            }
                        } else {
                            toast("不在封魔谷，开始传送", CONFIG.ui.toastColorSuccess);
                            gameUtils.send(player.recog, CONFIG.maps.FENG_MO_GU.sendId);
                        }
                    } catch (e) {
                        console.error("Error in randomFarm logic:", e);
                    }
                };
                scriptState.startTimer("randomFarmTimer", CONFIG.intervals.RANDOM_FARM, farmLogic);
            }
        },

        toCangYue: function(btn) {
            mapFarmHandler("toCangYue", "CANG_YUE_DAO", btn);
        },

        toTianChi: function(btn) {
            mapFarmHandler("toTianChi", "TIAN_CHI", btn);
        },

        toChenMo: function(btn) {
            mapFarmHandler("toChenMo", "CHEN_MO_ZHI_LU_5", btn);
        },

        toHunShui: function(btn) {
            mapFarmHandler("toHunShui", "HUN_SHUI_ZHI_DI_5", btn);
        },

        autoFly: function(btn) {
            const isAutoFlyActive = scriptState.isButtonActive("autoFly");
            if (isAutoFlyActive) {
                scriptState.stopTimer("autoFlyTimer");
                scriptState.setButtonActive("autoFly", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("3秒后开启无怪自动飞鞋", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("autoFly", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const autoFlyLogic = function() {
                    try {
                        gameUtils.checkEdcwsp();
                        if (gameUtils.checkMonster() < 1 && gameUtils.checkDropCount() < 1) {
                            const player = gameUtils.getPlayer();
                            if (player) {
                                autoFlyAction(player);
                            }
                        }
                    } catch (e) {
                        console.error("Error in autoFly logic:", e);
                    }
                };
                scriptState.startTimer("autoFlyTimer", CONFIG.intervals.AUTO_FLY, autoFlyLogic);
            }
        },

        autoBoss: function(btn) {
            const isAutoBossActive = scriptState.isButtonActive("autoBoss");
            if (isAutoBossActive) {
                scriptState.stopTimer("autoBossTimer");
                scriptState.setButtonActive("autoBoss", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                scriptState.setButtonActive("autoBoss", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const autoBossLogic = function() {
                    try {
                        if (gameUtils.checkMonster() < 1 && gameUtils.checkDropCount() < 1 && gameUtils.inMap(CONFIG.maps.FENG_MO_GU.id)) {
                            if (typeof app !== 'undefined' && app.qTVCL && app.qTVCL.ins) {
                                app.qTVCL.ins().YFOmNj(); // VIP BOSS 交互函数
                                toast("停止挂机，搜寻BOSS", CONFIG.ui.toastColorSuccess);
                            }
                        } else if (gameUtils.checkMonster() > 0 && !gameUtils.inMap(CONFIG.maps.FENG_MO_GU.id)) {
                            gameUtils.checkEdcwsp();
                            const nearMonster = gameUtils.getNearMonster();
                            const charRole = gameUtils.getCharRole(nearMonster);
                            if (!charRole || !charRole.propSet) {
                                toast(`开始挂机, 怪物数量: ${gameUtils.checkMonster()}`, CONFIG.ui.toastColorSuccess);
                            } else {
                                toast(`开始挂机, 怪物数量: ${gameUtils.checkMonster()}, 目标: ${charRole.propSet.getName()}`, CONFIG.ui.toastColorSuccess);
                            }
                        }
                    } catch (e) {
                        console.error("Error in autoBoss logic:", e);
                    }
                };
                scriptState.startTimer("autoBossTimer", CONFIG.intervals.AUTO_BOSS, autoBossLogic);
            }
        },

        autoQLFly: function(btn) {
            stopExclusiveFarmMode("autoQLFly");
            const isAutoQLFlyActive = scriptState.isButtonActive("autoQLFly");
            if (isAutoQLFlyActive) {
                scriptState.stopTimer("autoQLFlyTimer");
                scriptState.setButtonActive("autoQLFly", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("麒麟/炼狱魔龙监测已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("autoQLFly", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const autoQLFlyLogic = function() {
                    try {
                        gameUtils.checkEdcwsp();
                        const nearMonster = gameUtils.getNearMonster();
                        if (nearMonster) {
                            const charRole = gameUtils.getCharRole(nearMonster);
                            if (charRole && charRole.propSet) {
                                const monsterName = charRole.propSet.getName();
                                if (monsterName === "[神话]麒麟" || monsterName === "[妖兽]妖化麒麟" || monsterName === "[神话]炼狱魔龙") {
                                    toast(`检测到${monsterName}，飞鞋避让`, CONFIG.ui.toastColorWarning);
                                    const player = gameUtils.getPlayer();
                                    if (player) {
                                        autoFlyAction(player);
                                    }
                                }
                            }
                        }
                        if (gameUtils.checkMonster() < 1 && gameUtils.checkDropCount() < 1) {
                            const player = gameUtils.getPlayer();
                            if (player) {
                                autoFlyAction(player);
                            }
                        }
                    } catch (e) {
                        console.error("Error in autoQLFly logic:", e);
                    }
                };
                scriptState.startTimer("autoQLFlyTimer", CONFIG.intervals.AUTO_QL_FLY, autoQLFlyLogic);
            }
        },

        autoFivefoldExp: function(btn) {
            const isAutoFivefoldExpActive = scriptState.isButtonActive("autoFivefoldExp");
            if (isAutoFivefoldExpActive) {
                scriptState.stopTimer("autoExpTimer");
                scriptState.setButtonActive("autoFivefoldExp", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("自动五倍经验已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("autoFivefoldExp", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);
                const autoExpLogic = function() {
                    try {
                        gameUtils.useExp(CONFIG.items.EXP_5X, 1);
                    } catch (e) {
                        console.error("Error in autoExp logic:", e);
                    }
                };
                scriptState.startTimer("autoExpTimer", CONFIG.intervals.AUTO_EXP, autoExpLogic);
            }
        },

        autoManorFarm: function(btn) {
            const isAutoManorFarmActive = scriptState.isButtonActive("autoManorFarm");
            if (isAutoManorFarmActive) {
                scriptState.stopTimer("scheduledManorTimer");
                scriptState.stopTimer("manorQingLongCheckTimer");
                scriptState.stopTimer("frequentQingLongCheckTimer");
                scriptState.stopTimer("pathFindingRetryTimer");  // 停止寻路重试定时器
                scriptState.setButtonActive("autoManorFarm", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
                toast("庄园自动打怪已关闭", CONFIG.ui.toastColorSuccess);
                toast("庄园自动打怪已关闭", CONFIG.ui.toastColorSuccess);
            } else {
                toast("庄园自动打怪已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("autoManorFarm", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);

                // 庄园管理逻辑
                const manorManager = {
                    // 检查青龙并决定行动
                    checkQingLongAndAct: function(now) {
                        gameUtils.checkEdcwsp();
                        if (gameUtils.checkQingLong()) {
                            toast(`[${now.getHours()}:${now.getMinutes()}]庄园检测到青龙，开始挂机`, CONFIG.ui.toastColorSuccess);
                            gameUtils.checkEdcwsp();
                            return true;
                        } else {
                            toast(`[${now.getHours()}:${now.getMinutes()}]庄园未检测到青龙，开始频繁检测`, CONFIG.ui.toastColorWarning);
                            this.startFrequentQingLongCheck();
                            return false;
                        }
                    },

                    // 开始频繁检测青龙（每3秒一次，持续3分钟）
                    startFrequentQingLongCheck: function() {
                        let checkCount = 0;
                        const maxChecks = Math.floor(CONFIG.manor.checkQingLongDelay / CONFIG.manor.qingLongCheckInterval);

                        // 停止之前可能存在的频繁检测定时器
                        scriptState.stopTimer("frequentQingLongCheckTimer");

                        scriptState.startTimer("frequentQingLongCheckTimer", CONFIG.manor.qingLongCheckInterval, () => {
                            try {
                                if (!gameUtils.inMap(CONFIG.maps.ZHUANG_YUAN.id)) {
                                    scriptState.stopTimer("frequentQingLongCheckTimer");
                                    return;
                                }

                                checkCount++;
                                const currentTime = new Date();
                                console.log(`[庄园青龙检测] 第${checkCount}次检测，共${maxChecks}次`);

                                if (gameUtils.checkQingLong()) {
                                    toast(`[${currentTime.getHours()}:${currentTime.getMinutes()}]庄园检测到青龙，开始挂机`, CONFIG.ui.toastColorSuccess);
                                    gameUtils.checkEdcwsp();
                                    scriptState.stopTimer("frequentQingLongCheckTimer");
                                    return;
                                }

                                // 如果达到最大检测次数且仍未发现青龙，返回苍月岛
                                if (checkCount >= maxChecks) {
                                    toast(`[${currentTime.getHours()}:${currentTime.getMinutes()}]庄园3分钟未检测到青龙，返回苍月岛`, CONFIG.ui.toastColorSuccess);
                                    const player = gameUtils.getPlayer();
                                    if (player) {
                                        gameUtils.ingotSend(player.recog, CONFIG.maps.CANG_YUE_DAO.sendId);
                                    }
                                    scriptState.stopTimer("frequentQingLongCheckTimer");
                                }
                            } catch (e) {
                                console.error("Error in frequent QingLong check:", e);
                            }
                        });
                    },

                    // 传送到庄园并寻路到指定位置
                    teleportToManor: function(now) {
                        const player = gameUtils.getPlayer();
                        if (!player) return;

                        toast(`[${now.getHours()}:${now.getMinutes()}]传送到庄园`, CONFIG.ui.toastColorSuccess);
                        gameUtils.send(player.recog, CONFIG.maps.ZHUANG_YUAN.sendId);

                        // 短暂延迟后开始寻路过程，确保传送完成
                        setTimeout(() => {
                            this.startPathFindingProcess();
                        }, CONFIG.manor.pathFindingDelay);
                    },

                    // 寻路过程管理
                    startPathFindingProcess: function() {
                        let retryCount = 0;

                        // 停止可能存在的寻路重试定时器
                        scriptState.stopTimer("pathFindingRetryTimer");

                        // 创建寻路函数
                        const attemptPathFinding = () => {
                            try {
                                const player = gameUtils.getPlayer();
                                if (!player || !gameUtils.inMap(CONFIG.maps.ZHUANG_YUAN.id)) {
                                    scriptState.stopTimer("pathFindingRetryTimer");
                                    return;
                                }

                                // 检查是否已经到达目标位置
                                const distanceToTarget = Math.sqrt(
                                    Math.pow(player.currentX - CONFIG.manor.xPoint, 2) +
                                    Math.pow(player.currentY - CONFIG.manor.yPoint, 2)
                                );

                                // 如果已经接近目标位置，停止寻路并开始检测青龙
                                if (distanceToTarget < 5) {
                                    toast(`已到达目标位置附近[${player.currentX},${player.currentY}]，开始检测青龙`, CONFIG.ui.toastColorSuccess);
                                    scriptState.stopTimer("pathFindingRetryTimer");

                                    // 开始检测青龙
                                    const currentTime = new Date();
                                    this.checkQingLongAndAct(currentTime);
                                    return;
                                }

                                // 如果还未到达目标位置，继续尝试寻路
                                retryCount++;
                                toast(`寻路尝试 ${retryCount}/${CONFIG.manor.maxPathFindingRetries} 到[${CONFIG.manor.xPoint},${CONFIG.manor.yPoint}]`, CONFIG.ui.toastColorSuccess);
                                player.pathFinding(CONFIG.manor.xPoint, CONFIG.manor.yPoint);

                                // 如果达到最大重试次数，停止重试并开始检测青龙
                                if (retryCount >= CONFIG.manor.maxPathFindingRetries) {
                                    toast(`达到最大寻路尝试次数，在当前位置[${player.currentX},${player.currentY}]开始检测青龙`, CONFIG.ui.toastColorWarning);
                                    scriptState.stopTimer("pathFindingRetryTimer");

                                    // 开始检测青龙
                                    const currentTime = new Date();
                                    this.checkQingLongAndAct(currentTime);
                                }
                            } catch (e) {
                                console.error("Error in pathFinding retry:", e);
                                scriptState.stopTimer("pathFindingRetryTimer");
                            }
                        };

                        // 立即执行一次寻路
                        attemptPathFinding();

                        // 设置定时器进行寻路重试
                        scriptState.startTimer("pathFindingRetryTimer", CONFIG.manor.pathFindingRetryInterval, attemptPathFinding);
                    },

                    // 主要定时检查逻辑
                    scheduledCheck: function() {
                        try {
                            const now = new Date();
                            console.log(`[庄园定时]当前分钟: ${now.getMinutes()}, 设定分钟: ${CONFIG.manor.scheduledMinute}`);

                            // 如果是指定时间，执行庄园传送和检查
                            if (now.getMinutes() === CONFIG.manor.scheduledMinute) {
                                if (!gameUtils.inMap(CONFIG.maps.ZHUANG_YUAN.id)) {
                                    this.teleportToManor(now);
                                } else {
                                    toast(`[${now.getHours()}:${now.getMinutes()}]已在庄园，检查青龙`, CONFIG.ui.toastColorSuccess);
                                    this.checkQingLongAndAct(now);
                                }
                            }
                            // 如果不是指定时间但已在庄园，也检查青龙
                            else if (gameUtils.inMap(CONFIG.maps.ZHUANG_YUAN.id)) {
                                // 静默检查，只有发现青龙才挂机
                                if (gameUtils.checkQingLong()) {
                                    gameUtils.checkEdcwsp();
                                }else{
                                    const player = gameUtils.getPlayer();
                                    if (player) {
                                        gameUtils.ingotSend(player.recog, CONFIG.maps.CANG_YUE_DAO.sendId);
                                    }
                                    scriptState.stopTimer("frequentQingLongCheckTimer");
                                }
                            }
                        } catch (e) {
                            console.error("Error in scheduledCheck:", e);
                        }
                    }
                };

                // 启动庄园定时检查
                scriptState.startTimer("scheduledManorTimer", CONFIG.intervals.AUTO_MANOR, () => {
                    try {
                        manorManager.scheduledCheck();
                    } catch (e) {
                        console.error("Error in manor scheduled check:", e);
                    }
                });

                // 立即执行一次检查
                manorManager.scheduledCheck();
            }
        },

        fixedPointFarm: function(btn) {
            const isFixedPointFarmActive = scriptState.isButtonActive("fixedPointFarm");
            if (isFixedPointFarmActive) {
                scriptState.stopTimer("fixedPointTimer");
                scriptState.setButtonActive("fixedPointFarm", false);
                convertButton(btn, CONFIG.ui.buttonColorInactive, Icons.startIcon);
            } else {
                toast("定点挂机已开启", CONFIG.ui.toastColorSuccess);
                scriptState.setButtonActive("fixedPointFarm", true);
                convertButton(btn, CONFIG.ui.buttonColorActive, Icons.stopIcon);

                const player = gameUtils.getPlayer();
                const fixedPoint = player ? {
                    x: player.currentX,
                    y: player.currentY
                } : {
                    x: 0,
                    y: 0
                };

                const fixedPointLogic = function() {
                    try {
                        if (typeof app !== 'undefined' && app.GameMap && app.GameMap.scenes && app.GameMap.scenes.hook) {
                            for (let i = 0; i < app.GameMap.scenes.hook.length; i++) {
                                app.GameMap.scenes.hook[i] = fixedPoint;
                            }
                        } else {
                            console.warn("游戏 API(app.GameMap.scenes.hook)不可用.");
                        }
                        gameUtils.checkEdcwsp();
                    } catch (e) {
                        console.error("Error in fixedPoint logic:", e);
                    }
                };

                scriptState.startTimer("fixedPointTimer", CONFIG.intervals.FIXED_POINT, fixedPointLogic);
            }
        },

        setManorTime: function(inputElement) {
            const minute = parseInt(inputElement.value, 10);
            if (!isNaN(minute) && minute >= 0 && minute <= 59) {
                CONFIG.manor.scheduledMinute = minute;
                toast(`庄园定时已设置为每小时${minute}分`, CONFIG.ui.toastColorSuccess);
            } else {
                toast("无效的分钟数，请输入0-59之间的数字", CONFIG.ui.toastColorError);
                inputElement.value = CONFIG.manor.scheduledMinute;
            }
        },

        setXPointInput: function(inputElement) {
            const xPoint = parseInt(inputElement.value, 10);
            if (!isNaN(xPoint) && xPoint >= 0 && xPoint <= 1000) {
                CONFIG.manor.xPoint = xPoint;
                toast(`庄园寻路X坐标已设置为 ${xPoint}`, CONFIG.ui.toastColorSuccess);
            } else {
                toast("无效的X坐标，请输入0-1000之间的数字", CONFIG.ui.toastColorError);
                inputElement.value = CONFIG.manor.xPoint;
            }
        },

        setYPointInput: function(inputElement) {
            const yPoint = parseInt(inputElement.value, 10);
            if (!isNaN(yPoint) && yPoint >= 0 && yPoint <= 1000) {
                CONFIG.manor.yPoint = yPoint;
                toast(`庄园寻路Y坐标已设置为 ${yPoint}`, CONFIG.ui.toastColorSuccess);
            } else {
                toast("无效的Y坐标，请输入0-1000之间的数字", CONFIG.ui.toastColorError);
                inputElement.value = CONFIG.manor.yPoint;
            }
        },
    };

    // --- UI创建 ---
    function createControlPanel() {
        const controlPanel = document.createElement("div");
        controlPanel.id = "control-panel";
        controlPanel.className = "control-panel";
        controlPanel.innerHTML = `
            <div class="control-group">
                <button id="toggleFireWall" class="button" title="自动释放火墙">${Icons.startIcon}</button>
                <button id="randomFarm" class="button" title="封魔谷全自动挂机">${Icons.startIcon}</button>
                <button id="toCangYue" class="button" title="苍月岛全自动挂机">${Icons.startIcon}</button>
                <button id="toTianChi" class="button" title="天池全自动挂机">${Icons.startIcon}</button>
                <button id="toChenMo" class="button" title="沉默之路5全自动挂机">${Icons.startIcon}</button>
                <button id="toHunShui" class="button" title="昏睡之地5全自动挂机">${Icons.startIcon}</button>
                <button id="autoFly" class="button" title="周围无怪自动飞鞋">${Icons.startIcon}</button>
                <button id="autoBoss" class="button" title="自动刷VIP BOSS">${Icons.startIcon}</button>
                <button id="autoQLFly" class="button" title="麒麟/炼狱魔龙飞鞋避让">${Icons.startIcon}</button>
                <button id="autoFivefoldExp" class="button" title="自动使用五倍经验">${Icons.startIcon}</button>
                <button id="autoManorFarm" class="button" title="自动庄园打怪">${Icons.startIcon}</button>
                <input type="text" id="manor-time-input" value="${CONFIG.manor.scheduledMinute}" min="0" max="59" title="设置每小时的哪一分钟定时执行庄园传送"/>
                <input type="text" id="manor-x-point" value="${CONFIG.manor.xPoint}" title="设置X坐标位置"/>
                <input type="text" id="manor-y-point" value="${CONFIG.manor.yPoint}" title="设置Y坐标位置"/>
                <button id="fixedPointFarm" class="button" title="定点挂机打怪">${Icons.startIcon}</button>
            </div>
        `;

        const btnActions = {
            "toggleFireWall": buttonHandlers.toggleFireWall,
            "randomFarm": buttonHandlers.randomFarm,
            "toCangYue": buttonHandlers.toCangYue,
            "toTianChi": buttonHandlers.toTianChi,
            "toChenMo": buttonHandlers.toChenMo,
            "toHunShui": buttonHandlers.toHunShui,
            "autoFly": buttonHandlers.autoFly,
            "autoBoss": buttonHandlers.autoBoss,
            "autoQLFly": buttonHandlers.autoQLFly,
            "autoFivefoldExp": buttonHandlers.autoFivefoldExp,
            "autoManorFarm": buttonHandlers.autoManorFarm,
            "fixedPointFarm": buttonHandlers.fixedPointFarm,
        };

        for (const btnId in btnActions) {
            const btn = controlPanel.querySelector(`#${btnId}`);
            if (btn) {
                btn.addEventListener("click", function() {
                    try {
                        btnActions[btnId](this);
                    } catch (e) {
                        console.error(`Error in button handler ${btnId}:`, e);
                    }
                });
            }
        }

        const manorTimeInput = controlPanel.querySelector("#manor-time-input");
        if (manorTimeInput) {
            manorTimeInput.addEventListener("change", function() {
                try {
                    buttonHandlers.setManorTime(this);
                } catch (e) {
                    console.error("Error in manor time input handler:", e);
                }
            });
        }

        const xPointInput = controlPanel.querySelector("#manor-x-point");
        if (xPointInput) {
            xPointInput.addEventListener("change", function() {
                try {
                    buttonHandlers.setXPointInput(this);
                } catch (e) {
                    console.error("Error in X point input handler:", e);
                }
            });
        }

        const yPointInput = controlPanel.querySelector("#manor-y-point");
        if (yPointInput) {
            yPointInput.addEventListener("change", function() {
                try {
                    buttonHandlers.setYPointInput(this);
                } catch (e) {
                    console.error("Error in Y point input handler:", e);
                }
            });
        }

        return controlPanel;
    }

    // --- 初始化 ---
    window.addEventListener("load", function() {
        try {
            document.body.appendChild(createControlPanel());
            console.log("传奇挂机多功能脚本已加载");
        } catch (e) {
            console.error("脚本初始化错误:", e);
        }
    });

    // 保存原始定时器函数
    const originalSetInterval = window.setInterval;
    const originalClearInterval = window.clearInterval;

    // 防止游戏环境干扰定时器
    window.setInterval = function(callback, delay) {
        return originalSetInterval.call(window, callback, delay);
    };

    window.clearInterval = function(id) {
        return originalClearInterval.call(window, id);
    };

    // 在脚本卸载时清理所有定时器
    window.addEventListener("beforeunload", function() {
        scriptState.stopAllTimers();
    });
  })();