// ==UserScript==
// @name         猫猫放置-详细战斗日志面板
// @version      v1.45
// @description  猫猫放置-详细战斗日志面板,点击上方中间的按钮展开或者收起
// @author       YuoHira
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moyu-idle.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @namespace https://greasyfork.org/users/397156
// @downloadURL https://update.greasyfork.org/scripts/540090/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE-%E8%AF%A6%E7%BB%86%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/540090/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE-%E8%AF%A6%E7%BB%86%E6%88%98%E6%96%97%E6%97%A5%E5%BF%97%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // —— 配置变量 ——
    let isPanelExpanded = true;      // 面板展开状态
    let panelScale = 100;            // 面板缩放百分比
    let enableCurrentActionLog = false; // 是否在控制台记录当前回合战斗信息
    let hideZeroDamageSkills = true; // 是否屏蔽无伤害技能
    
    // —— 统计数据 ——
    let battleStartTime = null;      // 战斗开始时间
    let currentBattleInfo = null;    // 当前战斗信息
    let playerStats = {};            // 玩家统计数据
    let updateTimeout = null;        // 更新防抖定时器
    
    // —— 击杀波次统计 ——
    let killWaveStats = {
        totalWaves: 0,               // 总击杀波次
        totalEnemies: 0,             // 总击杀敌人数量
        firstKillTime: null,         // 第一次击杀时间
        lastKillTime: null,          // 最后一次击杀时间
        currentBattleUuid: null,     // 当前战斗UUID
        currentBattleEnemies: new Set(), // 当前战斗中的敌人UUID集合
        currentBattleAllEnemies: new Set() // 当前战斗中所有敌人UUID集合（包括已死亡的）
    };
    
    // —— 技能ID到中文名称的映射 ——
    const skillNameMap = {
        baseAttack: "普通攻击",
        boneShield: "骨盾",
        corrosiveBreath: "腐蚀吐息",
        summonBerryBird: "召唤浆果鸟",
        baseHeal: "基础治疗",
        poison: "中毒",
        selfHeal: "自我疗愈",
        sweep: "横扫",
        baseGroupHeal: "基础群体治疗",
        powerStrike: "重击",
        guardianLaser: "守护者激光",
        lavaBreath: "熔岩吐息",
        dragonRoar: "龙之咆哮",
        doubleStrike: "双重打击",
        lowestHpStrike: "弱点打击",
        explosiveShot: "爆炸射击",
        freeze: "冻结",
        iceBomb: "冰弹",
        lifeDrain: "吸血",
        roar: "咆哮",
        blizzard: "暴风雪",
        ironWall: "铁壁",
        curse: "诅咒",
        shadowBurst: "暗影爆发",
        groupCurse: "群体诅咒",
        holyLight: "神圣之光",
        bless: "祝福",
        revive: "复活",
        groupRegen: "群体再生",
        astralBarrier: "星辉结界",
        astralBlast: "星辉冲击",
        groupSilence: "群体沉默",
        selfRepair: "自我修复",
        cleanse: "驱散",
        cometStrike: "彗星打击",
        armorBreak: "破甲",
        starTrap: "星辰陷阱",
        emperorCatFinale_forAstralEmpressBoss: "星辉终极裁决",
        astralStorm: "星辉风暴",
        groupShield: "群体护盾",
        sneak: "潜行",
        ambush: "偷袭",
        poisonClaw: "毒爪",
        shadowStep: "暗影步",
        silenceStrike: "沉默打击",
        slientSmokeScreen: "静默烟雾弹",
        mirrorImage: "镜像影分身",
        shadowAssassinUlt: "绝影连杀",
        stardustMouseSwap: "偷天换日",
        dizzySpin: "眩晕旋转",
        carouselOverdrive: "失控加速",
        candyBomb: "糖果爆裂",
        prankSmoke: "恶作剧烟雾",
        plushTaunt: "毛绒嘲讽",
        starlightSanctuary: "星光治愈",
        ghostlyStrike: "鬼影冲锋",
        paradeHorn: "狂欢号角",
        clownSummon: "小丑召集令",
        kingAegis: "猫王庇护"
    };
    
    // 获取技能中文名称
    function getSkillDisplayName(skillId) {
        return skillNameMap[skillId] || skillId;
    }
    
    // 初始化玩家统计数据结构
    function initPlayerStats(playerUuid, playerName) {
        if (!playerStats[playerUuid]) {
            playerStats[playerUuid] = {
                name: playerName,
                totalDamage: 0,
                totalActions: 0,
                firstActionTime: null,
                lastActionTime: null,
                skills: {} // 技能统计: {skillId: {totalDamage, actionCount, firstTime, lastTime}}
            };
        }
    }
    
    // 更新玩家统计数据
    function updatePlayerStats(battleData) {
        const sourceActor = battleData.action.sourceActor;
        if (!sourceActor || !sourceActor.isPlayer) return;
        
        const now = Date.now();
        const playerUuid = sourceActor.uuid;
        const skillId = battleData.action.skillId || 'baseAttack';
        const totalDamage = battleData.action.totalDamage;
        
        // 初始化玩家数据
        initPlayerStats(playerUuid, sourceActor.name);
        const playerData = playerStats[playerUuid];
        
        // 更新总体统计
        playerData.totalDamage += totalDamage;
        playerData.totalActions++;
        if (!playerData.firstActionTime) playerData.firstActionTime = now;
        playerData.lastActionTime = now;
        
        // 更新技能统计
        if (!playerData.skills[skillId]) {
            playerData.skills[skillId] = {
                totalDamage: 0,
                actionCount: 0,
                firstTime: null,
                lastTime: null
            };
        }
        
        const skillData = playerData.skills[skillId];
        skillData.totalDamage += totalDamage;
        skillData.actionCount++;
        if (!skillData.firstTime) skillData.firstTime = now;
        skillData.lastTime = now;
        
        // 保存统计数据到本地存储
        savePlayerStats();
    }
    
    // 计算DPS
    function calculateDPS(totalDamage, firstTime, lastTime) {
        if (!firstTime || !lastTime || firstTime === lastTime) return 0;
        const timeSpan = (lastTime - firstTime) / 1000; // 转换为秒
        return timeSpan > 0 ? (totalDamage / timeSpan) : 0;
    }
    
    // 计算WPH(每小时击杀波次)
    function calculateWPH() {
        if (!killWaveStats.firstKillTime || !killWaveStats.lastKillTime || killWaveStats.totalWaves === 0) {
            return 0;
        }
        const timeSpan = (killWaveStats.lastKillTime - killWaveStats.firstKillTime) / 1000 / 3600; // 转换为小时
        return timeSpan > 0 ? (killWaveStats.totalWaves / timeSpan) : 0;
    }
    
    // 计算EPH(每小时击杀敌人数)
    function calculateEPH() {
        if (!killWaveStats.firstKillTime || !killWaveStats.lastKillTime || killWaveStats.totalEnemies === 0) {
            return 0;
        }
        const timeSpan = (killWaveStats.lastKillTime - killWaveStats.firstKillTime) / 1000 / 3600; // 转换为小时
        return timeSpan > 0 ? (killWaveStats.totalEnemies / timeSpan) : 0;
    }
    
    // 格式化运行时间
    function formatRunningTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds}秒`;
        } else {
            return `${seconds}秒`;
        }
    }
    
    // 检测击杀波次（敌人全部死亡）
    function detectKillWave(battleData) {
        const battleUuid = battleData.battleUuid;
        const allMembers = battleData.allMembers;
        
        if (!allMembers || allMembers.length === 0) return false;
        
        // 如果是新战斗，重置当前战斗的敌人集合
        if (battleUuid !== killWaveStats.currentBattleUuid) {
            killWaveStats.currentBattleUuid = battleUuid;
            killWaveStats.currentBattleEnemies.clear();
            killWaveStats.currentBattleAllEnemies.clear();
            
            // 初始化敌人集合：遍历所有成员，找出敌人
            allMembers.forEach(member => {
                if (!member.isPlayer) {
                    killWaveStats.currentBattleAllEnemies.add(member.uuid);
                    if (member.hp > 0) {
                        killWaveStats.currentBattleEnemies.add(member.uuid);
                    }
                }
            });
            
            return false; // 新战斗开始，不检测击杀
        }
        
        // 更新当前存活敌人状态
        killWaveStats.currentBattleEnemies.clear();
        allMembers.forEach(member => {
            if (!member.isPlayer && member.hp > 0) {
                killWaveStats.currentBattleEnemies.add(member.uuid);
            }
        });
        
        // 检查是否所有敌人都死亡（存活敌人集合为空且全部敌人集合不为空）
        if (killWaveStats.currentBattleEnemies.size === 0 && killWaveStats.currentBattleAllEnemies.size > 0) {
            const now = Date.now();
            const enemyCount = killWaveStats.currentBattleAllEnemies.size;
            
            // 更新击杀波次统计
            killWaveStats.totalWaves++;
            killWaveStats.totalEnemies += enemyCount;
            killWaveStats.lastKillTime = now;
            
            // 如果是第一次击杀，记录开始时间
            if (!killWaveStats.firstKillTime) {
                killWaveStats.firstKillTime = now;
            }
            
            // 获取敌人名称列表用于日志显示
            const enemyNames = allMembers
                .filter(member => !member.isPlayer && killWaveStats.currentBattleAllEnemies.has(member.uuid))
                .map(member => member.name);
            
            // 保存击杀统计
            saveKillWaveStats();
            
            console.log(`⚔️ [击杀统计] 击杀第${killWaveStats.totalWaves}波 | 敌人数量: ${enemyCount} | 敌人: ${enemyNames.join(', ')} | 战斗ID: ${battleUuid}`);
            
            // 重置当前战斗统计，为下一波做准备
            killWaveStats.currentBattleEnemies.clear();
            killWaveStats.currentBattleAllEnemies.clear();
            killWaveStats.currentBattleUuid = null;
            
            return true;
        }
        
        return false;
    }
    
    // 防抖更新UI
    function debouncedUpdateUI() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            updateCurrentActionDisplay();
            updatePlayerStatsDisplay();
            updateTimeout = null;
        }, 100); // 100ms防抖延迟
    }
    
    // —— 本地存储键名 ——
    const STORAGE_KEYS = {
        PANEL_EXPANDED: 'messageListener_panelExpanded',
        PANEL_SCALE: 'messageListener_panelScale',
        PLAYER_STATS: 'messageListener_playerStats',
        ENABLE_ACTION_LOG: 'messageListener_enableActionLog',
        HIDE_ZERO_DAMAGE_SKILLS: 'messageListener_hideZeroDamageSkills',
        KILL_WAVE_STATS: 'messageListener_killWaveStats',
        IS_MINIMIZED: 'messageListener_isMinimized'
    };
    
    // —— 界面状态 ——
    let isMinimized = false;
    
    // —— 加载配置 ——
    function loadConfig() {
        const savedExpanded = localStorage.getItem(STORAGE_KEYS.PANEL_EXPANDED);
        const savedScale = localStorage.getItem(STORAGE_KEYS.PANEL_SCALE);
        const savedStats = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
        const savedActionLog = localStorage.getItem(STORAGE_KEYS.ENABLE_ACTION_LOG);
        const savedHideZeroDamage = localStorage.getItem(STORAGE_KEYS.HIDE_ZERO_DAMAGE_SKILLS);
        const savedKillWaveStats = localStorage.getItem(STORAGE_KEYS.KILL_WAVE_STATS);
        const savedIsMinimized = localStorage.getItem(STORAGE_KEYS.IS_MINIMIZED);
        
        if (savedExpanded !== null) {
            isPanelExpanded = savedExpanded === 'true';
        }
        if (savedIsMinimized !== null) {
            isMinimized = savedIsMinimized === 'true';
        }
        if (savedScale !== null) {
            panelScale = parseInt(savedScale) || 100;
        }
        if (savedActionLog !== null) {
            enableCurrentActionLog = savedActionLog === 'true';
        }
        if (savedHideZeroDamage !== null) {
            hideZeroDamageSkills = savedHideZeroDamage === 'true';
        }
        if (savedStats) {
            try {
                const parsedStats = JSON.parse(savedStats);
                playerStats = parsedStats || {};
            } catch (e) {
                console.warn('加载统计数据失败:', e);
                playerStats = {};
            }
        }
        if (savedKillWaveStats) {
            try {
                const parsedKillWaveStats = JSON.parse(savedKillWaveStats);
                // 重新创建Set对象，因为JSON.parse不会恢复Set
                killWaveStats = { 
                    ...killWaveStats, 
                    ...parsedKillWaveStats,
                    currentBattleEnemies: new Set(parsedKillWaveStats.currentBattleEnemies || []),
                    currentBattleAllEnemies: new Set(parsedKillWaveStats.currentBattleAllEnemies || [])
                 };
            } catch (e) {
                console.warn('加载击杀波次统计失败:', e);
            }
        }
    }
    
    // —— 保存配置 ——
    function saveConfig() {
        localStorage.setItem(STORAGE_KEYS.PANEL_EXPANDED, isPanelExpanded);
        localStorage.setItem(STORAGE_KEYS.PANEL_SCALE, panelScale);
        localStorage.setItem(STORAGE_KEYS.ENABLE_ACTION_LOG, enableCurrentActionLog);
        localStorage.setItem(STORAGE_KEYS.HIDE_ZERO_DAMAGE_SKILLS, hideZeroDamageSkills);
        localStorage.setItem(STORAGE_KEYS.IS_MINIMIZED, isMinimized);
    }
    
    // —— 保存统计数据 ——
    function savePlayerStats() {
        try {
            localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(playerStats));
        } catch (e) {
            console.warn('保存统计数据失败:', e);
        }
    }
    
    // —— 保存击杀波次统计数据 ——
    function saveKillWaveStats() {
        try {
            // 将Set转换为数组进行保存
            const statsToSave = {
                ...killWaveStats,
                currentBattleEnemies: Array.from(killWaveStats.currentBattleEnemies),
                currentBattleAllEnemies: Array.from(killWaveStats.currentBattleAllEnemies)
            };
            localStorage.setItem(STORAGE_KEYS.KILL_WAVE_STATS, JSON.stringify(statsToSave));
        } catch (e) {
            console.warn('保存击杀波次统计失败:', e);
        }
    }
    

    
    // —— 辅助：检测压缩格式 ——
    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length >= 2) {
            if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
            if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        }
        return 'deflate';
    }
    
    // —— 检测是否为战斗消息 ——
    function isBattleMessage(data) {
        if (typeof data === 'string') {
            try {
                return data.includes('"battleInfo"') && data.includes('"thisRoundAction"');
            } catch (e) {
                return false;
            }
        }
        return false;
    }
    
    // —— 分割多个JSON对象 ——
    function splitMultipleJsonObjects(data) {
        const jsonObjects = [];
        let depth = 0;
        let start = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < data.length; i++) {
            const char = data[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        // 找到一个完整的JSON对象
                        const jsonStr = data.substring(start, i + 1);
                        jsonObjects.push(jsonStr);
                        start = i + 1;
                    }
                }
            }
        }
        
        return jsonObjects;
    }
    
    // —— 解析战斗消息 ——
    function parseBattleMessage(data) {
        try {
            if (typeof data === 'string') {
                // 首先尝试直接解析
                let jsonData;
                try {
                    jsonData = JSON.parse(data);
                } catch (firstError) {
                    // 如果直接解析失败，尝试分割多个JSON对象
                    const jsonObjects = splitMultipleJsonObjects(data);
                    
                    // 尝试解析每个JSON对象，找到包含战斗信息的那个
                    for (const jsonStr of jsonObjects) {
                        try {
                            const parsed = JSON.parse(jsonStr);
                            if (parsed.data && parsed.data.battleInfo && parsed.data.thisRoundAction) {
                                jsonData = parsed;
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    // 如果还是没找到，尝试Socket.IO格式
                    if (!jsonData) {
                        const match = data.match(/\[.*?({.*})\]/);
                        if (match) {
                            jsonData = JSON.parse(match[1]);
                        } else {
                            throw firstError; // 抛出原始错误
                        }
                    }
                }
                
                if (jsonData && jsonData.data && jsonData.data.battleInfo && jsonData.data.thisRoundAction) {
                    const battleInfo = jsonData.data.battleInfo;
                    const action = jsonData.data.thisRoundAction;
                    
                    // 找到当前行动的角色
                    const currentTurnIndex = battleInfo.currentTurnIndex;
                    const turnOrder = battleInfo.turnOrder;
                    const currentActorUuid = turnOrder[currentTurnIndex];
                    
                    // 找到角色信息
                    const currentActor = battleInfo.members.find(member => member.uuid === currentActorUuid);
                    const sourceActor = battleInfo.members.find(member => member.uuid === action.sourceUnitUuid);
                    
                    // 解析目标信息
                    const targets = [];
                    if (action.damage) {
                        Object.keys(action.damage).forEach(targetUuid => {
                            const target = battleInfo.members.find(member => member.uuid === targetUuid);
                            if (target) {
                                targets.push({
                                    name: target.name,
                                    damage: action.damage[targetUuid],
                                    hp: target.hp,
                                    maxHp: target.maxHp,
                                    isDead: target.hp === 0
                                });
                            }
                        });
                    }
                    
                    return {
                        currentTurn: currentTurnIndex,
                        currentActor: currentActor ? {
                            name: currentActor.name,
                            uuid: currentActor.uuid,
                            isPlayer: currentActor.isPlayer
                        } : null,
                        action: {
                            type: action.type,
                            sourceActor: sourceActor ? {
                                name: sourceActor.name,
                                uuid: sourceActor.uuid,
                                isPlayer: sourceActor.isPlayer
                            } : null,
                            skillId: action.castSkillId,
                            targets: targets,
                            totalDamage: Object.values(action.damage || {}).reduce((sum, dmg) => sum + dmg, 0),
                            attackCount: action.targetUnitUuidList ? action.targetUnitUuidList.length : 0
                        },
                        battleUuid: battleInfo.uuid,
                        // 添加完整的成员信息用于击杀检测
                        allMembers: battleInfo.members
                    };
                }
            }
        } catch (e) {
            console.group('❌ [战斗解析] 解析战斗消息失败');
            console.error('错误信息:', e);
            console.log('原始数据长度:', data ? data.length : 'undefined');
            console.log('原始数据类型:', typeof data);
            
            // 显示原始数据的前后部分，避免控制台过于拥挤
            if (typeof data === 'string') {
                console.log('数据开头 (前500字符):', data.substring(0, 500));
                if (data.length > 1000) {
                    console.log('数据结尾 (后500字符):', data.substring(data.length - 500));
                }
                
                // 尝试找到JSON解析失败的位置
                if (e.message.includes('position')) {
                    const match = e.message.match(/position (\d+)/);
                    if (match) {
                        const pos = parseInt(match[1]);
                        console.log(`错误位置周围的字符 (位置${pos}):`, data.substring(Math.max(0, pos - 50), pos + 50));
                        console.log(`错误位置的字符:`, `"${data[pos]}" (字符码: ${data.charCodeAt(pos)})`);
                    }
                }
                
                // 尝试分割JSON对象进行调试
                try {
                    const jsonObjects = splitMultipleJsonObjects(data);
                    console.log(`检测到 ${jsonObjects.length} 个JSON对象:`);
                    jsonObjects.forEach((obj, index) => {
                        console.log(`JSON对象 ${index + 1} (长度: ${obj.length}):`, obj.substring(0, 200) + (obj.length > 200 ? '...' : ''));
                    });
                } catch (splitError) {
                    console.log('分割JSON对象时出错:', splitError);
                }
                
                console.log('完整原始数据:', data);
            } else {
                console.log('完整原始数据:', data);
            }
            console.groupEnd();
        }
        return null;
    }
    
    // —— 记录战斗消息 ——
    function logBattleMessage(battleData) {
        // 检测击杀波次
        detectKillWave(battleData);
        
        // 更新统计数据
        updatePlayerStats(battleData);
        
        // 始终更新当前行动信息（面板显示用）
        currentBattleInfo = battleData;
        
        // 防抖更新UI显示
        debouncedUpdateUI();
        
        // 只有在开关打开时才输出控制台日志
        if (enableCurrentActionLog) {
            const action = battleData.action;
            const sourceActor = action.sourceActor;
            
            console.group(`⚔️ [战斗记录] 第${battleData.currentTurn + 1}次行动 - ${sourceActor.name}`);
            
            // 基本信息
            console.log(`🎯 行动者: ${sourceActor.name} (${sourceActor.isPlayer ? '玩家' : '敌人'})`);
            console.log(`🔥 技能: ${getSkillDisplayName(action.skillId || 'baseAttack')}`);
            console.log(`💥 总伤害: ${action.totalDamage}点`);
            console.log(`🎲 攻击次数: ${action.attackCount}次`);
            
            // 目标详情
            if (action.targets.length > 0) {
                console.log('🎯 攻击目标:');
                action.targets.forEach(target => {
                    const status = target.isDead ? '☠️ 死亡' : `❤️ ${target.hp}/${target.maxHp}`;
                    console.log(`  • ${target.name}: ${target.damage}伤害 → ${status}`);
                });
            }
            
            console.log(`🕐 时间: ${new Date().toLocaleTimeString()}`);
            console.log(`🆔 战斗ID: ${battleData.battleUuid}`);
            console.groupEnd();
        }
    }
    

    
    // —— 初始化配置 ——
    loadConfig();
    
    // —— 暴露全局控制台命令 ——
    window.toggleBattlePanel = function() {
        if (!isPanelExpanded) {
            isPanelExpanded = true;
            isMinimized = false;
        } else if (!isMinimized) {
            isMinimized = true;
        } else {
            isMinimized = false;
        }
        saveConfig();
        updatePanelLayout();
        const status = isPanelExpanded ? (isMinimized ? '收起' : '展开') : '关闭';
        console.log(`📋 [控制台命令] 面板状态: ${status}`);
        return `面板状态: ${status}`;
    };
    
    window.showBattlePanel = function() {
        isPanelExpanded = true;
        isMinimized = false;
        saveConfig();
        updatePanelLayout();
        console.log('📋 [控制台命令] 面板已展开');
        return '面板已展开';
    };
    
    window.hideBattlePanel = function() {
        isPanelExpanded = false;
        isMinimized = false;
        saveConfig();
        updatePanelLayout();
        console.log('📋 [控制台命令] 面板已关闭');
        return '面板已关闭';
    };
    
    window.minimizeBattlePanel = function() {
        isPanelExpanded = true;
        isMinimized = true;
        saveConfig();
        updatePanelLayout();
        console.log('📋 [控制台命令] 面板已收起到EPH横条');
        return '面板已收起到EPH横条';
    };
    
    window.getBattlePanelStatus = function() {
        const status = isPanelExpanded ? (isMinimized ? '收起(EPH横条)' : '展开') : '关闭';
        console.log(`📋 [控制台命令] 当前面板状态: ${status}`);
        return status;
    };
    
    window.clearBattleStats = function() {
        playerStats = {};
        currentBattleInfo = null;
        battleStartTime = null;
        
        // 重置击杀波次统计
        killWaveStats = {
            totalWaves: 0,
            totalEnemies: 0,
            firstKillTime: null,
            lastKillTime: null,
            currentBattleUuid: null,
            currentBattleEnemies: new Set(),
            currentBattleAllEnemies: new Set()
        };
        
        // 清除本地存储
        localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
        localStorage.removeItem(STORAGE_KEYS.KILL_WAVE_STATS);
        
        // 立即更新显示
        updateCurrentActionDisplay();
        updatePlayerStatsDisplay();
        
        console.log('📋 [控制台命令] 统计数据和击杀波次数据已清除');
        return '统计数据已清除';
    };
    
    // 启动提示
    console.log('⚔️ [战斗数据面板] 已启动，自动监听战斗消息并保存统计数据');
    console.log(`📊 [击杀统计] 当前数据: 波次=${killWaveStats.totalWaves}, 敌人=${killWaveStats.totalEnemies}, 每小时击杀波次=${calculateWPH().toFixed(1)}, 每小时击杀敌人数=${calculateEPH().toFixed(1)}`);
    console.log('');
    console.log('🎮 [控制台命令] 可用的控制台命令:');
    console.log('  toggleBattlePanel()    - 切换面板状态 (关闭→展开→收起→展开...)');
    console.log('  showBattlePanel()      - 完全展开面板');
    console.log('  hideBattlePanel()      - 完全关闭面板');
    console.log('  minimizeBattlePanel()  - 收起到EPH横条');
    console.log('  getBattlePanelStatus() - 获取当前面板状态');
    console.log('  clearBattleStats()     - 清除所有统计数据');
    console.log('');
    
      // —— 创建固定的展开收起按钮 ——
  const toggleButton = document.createElement('button');
  toggleButton.id = 'battlePanel_fixedToggleButton';
    // 根据初始状态设置样式
    function setToggleButtonStyle() {
        if (isPanelExpanded && !isMinimized) {
            // 展开状态：显示收起按钮
            toggleButton.style.cssText = `
                position: fixed; 
                top: 10px; 
                left: 50%; 
                transform: translateX(-50%);
                background: rgba(244,67,54,0.25); 
                border: 2px solid rgb(255, 0, 0); 
                color: rgb(255, 147, 23);
                padding: 8px 24px; 
                border-radius: 6px; 
                font-size: 12px; 
                cursor: pointer;
                font-weight: bold;
                z-index: 99999;
                backdrop-filter: blur(10px);
                transition: all 0.2s ease;
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                display: block;
            `;
            toggleButton.innerHTML = '📐 收起';
        } else {
            // 关闭状态和收起状态：隐藏按钮，由EPH横条代替
            toggleButton.style.display = 'none';
        }
    }
    
    setToggleButtonStyle();
    document.body.appendChild(toggleButton);
    
      // —— 创建收起状态的EPH小横条 ——
  const minimizedBar = document.createElement('div');
  minimizedBar.id = 'battlePanel_minimizedEphBar';
    minimizedBar.style.cssText = `
        position: fixed; 
        top: 10px; 
        left: 50%; 
        transform: translateX(-50%);
        background: rgba(25,35,45,0.95); 
        border: 1px solid rgba(255,193,7,0.5); 
        color: #FFC107;
        padding: 8px 16px; 
        border-radius: 6px; 
        font-size: 11px; 
        font-weight: bold;
        z-index: 99998;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        display: ${(!isPanelExpanded || isMinimized) ? 'block' : 'none'};
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    minimizedBar.innerHTML = `
              <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;" title="点击展开面板">
          <span>⚔️</span>
          <span id="battlePanel_ephDisplay">${!isPanelExpanded ? '📊 展开 | EPH: ' + calculateEPH().toFixed(1) : 'EPH: ' + calculateWPH().toFixed(1)}</span>
      </div>
    `;
    
    // 为EPH横条添加点击事件来展开面板
    minimizedBar.addEventListener('click', () => {
        if (!isPanelExpanded) {
            // 从关闭状态展开
            isPanelExpanded = true;
            isMinimized = false;
            console.log('📋 [面板] 通过EPH横条从关闭状态展开面板');
        } else if (isMinimized) {
            // 从收起状态展开
            isMinimized = false;
            console.log('📋 [面板] 通过EPH横条从收起状态展开面板');
        }
        saveConfig();
        updatePanelLayout();
    });
    
    document.body.appendChild(minimizedBar);
    
    // —— 添加滚动条样式 ——
    const style = document.createElement('style');
    style.textContent = `
        /* 自定义滚动条样式 - Webkit浏览器 */
        .battle-panel-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .battle-panel-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
        }
        .battle-panel-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(100,181,246,0.5);
            border-radius: 3px;
        }
        .battle-panel-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(100,181,246,0.7);
        }
        /* Firefox滚动条样式 */
        .battle-panel-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(100,181,246,0.5) rgba(255,255,255,0.1);
        }
        /* 技能列表容器过渡效果 */
        .skill-list-container {
            transition: opacity 0.1s ease-out;
        }
        /* 防止内容闪烁的样式 */
        .skill-list-container.updating {
            pointer-events: none;
        }
        /* EPH横条悬停效果 */
        #battlePanel_minimizedEphBar:hover {
            background: rgba(35,45,55,0.98) !important;
            border-color: rgba(255,193,7,0.8) !important;
            box-shadow: 0 6px 20px rgba(255,193,7,0.3) !important;
            transform: translateX(-50%) scale(1.02);
        }
    `;
    document.head.appendChild(style);

    // —— 创建战斗面板 ——
    const panel = document.createElement('div');
    panel.id = 'battleLogPanel'; // 添加唯一ID
    function updatePanelStyle() {
        const shouldShow = isPanelExpanded && !isMinimized;
        panel.style.cssText = `
            position: fixed; 
            top: ${shouldShow ? '50px' : '-1000px'}; 
            left: 50%; 
            transform: translateX(-50%);
            width: 80vw; 
            height: 80vh;
            padding: 12px;
            background: rgba(15,20,25,0.7); color: #fff;
            font-family: 'Consolas', 'Monaco', monospace; font-size: 10px;
            border-radius: 8px; 
            z-index: 99997;
            border: 1px solid rgba(100,200,255,0.4);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            overflow: hidden;
            display: ${shouldShow ? 'block' : 'none'};
        `;
    }
    updatePanelStyle();
    function updatePanelContent() {
        const scale = (panelScale * 1.7) / 100; // 将170的效果作为100%基准
        panel.innerHTML = `
            <!-- 展开状态内容 -->
            <div style="display:flex; flex-direction:column; height:100%; --scale: ${scale};">
                <!-- 标题栏和控制区 -->
                                    <div style="display:flex; align-items:center; justify-content:space-between; padding:${8*scale}px ${16*scale}px; background:rgba(0,0,0,0.3); margin-bottom:${8*scale}px; border-radius:${6*scale}px;">
                    <div style="font-size:${16*scale}px; font-weight:bold; color:#64B5F6;">
                        ⚔️ 战斗数据统计面板
                    </div>
                    <div style="display:flex; align-items:center; gap:${8*scale}px;">
                        <label style="color:#aaa; font-size:${9*scale}px;">
                            <input id="battlePanel_actionLogToggle" type="checkbox" ${enableCurrentActionLog ? 'checked' : ''} style="margin-right:${4*scale}px;">
                            控制台日志
                        </label>
                        <label style="color:#aaa; font-size:${9*scale}px;">
                            <input id="battlePanel_hideZeroDamageToggle" type="checkbox" ${hideZeroDamageSkills ? 'checked' : ''} style="margin-right:${4*scale}px;">
                            屏蔽无伤害技能
                        </label>
                        <div style="width:1px; height:${16*scale}px; background:rgba(255,255,255,0.2);"></div>
                        <label style="color:#aaa; font-size:${9*scale}px;">缩放:</label>
                        <input id="battlePanel_scaleInput" type="number" value="${panelScale}" min="50" max="200" step="10" style="
                            width:${50*scale}px; padding:${2*scale}px ${4*scale}px; border:1px solid #64B5F6; border-radius:${3*scale}px;
                            background:rgba(0,0,0,0.3); color:#fff; font-size:${9*scale}px; text-align:center;
                        ">
                        <span style="color:#aaa; font-size:${9*scale}px;">%</span>
                        <button id="battlePanel_minimizeBtn" style="
                            background:rgba(255,193,7,0.15); border:1px solid #FFC107; color:#FFC107;
                            padding:${4*scale}px ${8*scale}px; border-radius:${4*scale}px; font-size:${9*scale}px; cursor:pointer;
                            margin-right:${4*scale}px;
                        ">📌 收起</button>
                        <button id="battlePanel_clearStats" style="
                            background:rgba(244,67,54,0.15); border:1px solid #f44336; color:#f44336;
                            padding:${4*scale}px ${8*scale}px; border-radius:${4*scale}px; font-size:${9*scale}px; cursor:pointer;
                        ">🗑️ 清除</button>
                    </div>
                </div>
                
                <!-- 主内容区域 -->
                <div style="display:flex; flex:1; gap:${8*scale}px; overflow:hidden;">
                    <!-- 左侧：玩家统计面板 (4/5宽度) -->
                    <div id="battlePanel_playerStatsPanel" style="
                        width:80%; height:100%; 
                        background:linear-gradient(135deg, rgba(76,175,80,0.1), rgba(139,195,74,0.05)); 
                        border-radius:${8*scale}px; border:1px solid rgba(76,175,80,0.2);
                        padding:${12*scale}px; overflow:hidden; display:none;
                    ">
                        <div style="font-size:${12*scale}px; color:#4CAF50; margin-bottom:${8*scale}px; font-weight:bold; text-align:center;">
                            📊 玩家伤害统计数据
                        </div>
                        <div id="battlePanel_killWaveStatsBar" style="
                            display:flex; justify-content:center; align-items:center; gap:${8*scale}px; 
                            background:rgba(255,193,7,0.1); border:1px solid rgba(255,193,7,0.3); 
                            border-radius:${6*scale}px; padding:${6*scale}px; margin-bottom:${8*scale}px;
                            font-size:${9*scale}px;
                        ">
                            <div style="color:#FFC107; font-weight:bold;">
                                ⚔️ 击杀波次: <span id="battlePanel_totalWaves">${killWaveStats.totalWaves}</span>
                            </div>
                            <div style="color:#FFC107; font-weight:bold;">
                                👹 总敌人数: <span id="battlePanel_totalEnemies">${killWaveStats.totalEnemies}</span>
                            </div>
                            <div style="color:#FFC107; font-weight:bold;">
                                📊 每小时击杀波次: <span id="battlePanel_wphValue">${calculateWPH().toFixed(1)}</span>
                            </div>
                            <div style="color:#FFC107; font-weight:bold;">
                                🎯 每小时击杀敌人数: <span id="battlePanel_ephValue">${calculateEPH().toFixed(1)}</span>
                            </div>
                            <div style="color:#FFC107; font-weight:bold;">
                                ⏱️ 运行时间: <span id="battlePanel_runningTime">${killWaveStats.firstKillTime ? formatRunningTime(Date.now() - killWaveStats.firstKillTime) : '0分钟'}</span>
                            </div>
                        </div>
                        <div id="battlePanel_playerStatsContent" style="
                            display:flex; gap:${8*scale}px; overflow-x:auto; overflow-y:hidden; 
                            height:calc(100% - ${30*scale}px); padding:${4*scale}px 0; align-items:stretch;
                        "></div>
                    </div>
                    
                    <!-- 右侧：当前出手信息 (1/5宽度) -->
                    <div id="battlePanel_currentActionPanel" style="
                        width:20%; height:100%;
                        background:linear-gradient(135deg, rgba(100,181,246,0.1), rgba(33,150,243,0.05)); 
                        border-radius:${8*scale}px; border:1px solid rgba(100,181,246,0.2);
                        padding:${12*scale}px; overflow-y:auto; display:none;
                    ">
                        <div style="font-size:${11*scale}px; color:#64B5F6; margin-bottom:${8*scale}px; font-weight:bold; text-align:center;">
                            🎯 当前行动
                        </div>
                        <div id="battlePanel_currentActionContent" style="font-size:${9*scale}px; line-height:1.4;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    updatePanelContent();
    document.body.appendChild(panel);
    
    // —— 获取控制元素 ——
    function getElements() {
        return {
            toggleButton: document.getElementById('battlePanel_fixedToggleButton'),
            actionLogToggle: document.getElementById('battlePanel_actionLogToggle'),
            hideZeroDamageToggle: document.getElementById('battlePanel_hideZeroDamageToggle'),
            scaleInput: document.getElementById('battlePanel_scaleInput'),
            currentActionPanel: document.getElementById('battlePanel_currentActionPanel'),
            currentActionContent: document.getElementById('battlePanel_currentActionContent'),
            playerStatsPanel: document.getElementById('battlePanel_playerStatsPanel'),
            playerStatsContent: document.getElementById('battlePanel_playerStatsContent'),
            clearStats: document.getElementById('battlePanel_clearStats'),
            minimizeBtn: document.getElementById('battlePanel_minimizeBtn')
        };
    }
    

    
    // —— 收起/展开功能 ——
    function toggleMinimize() {
        isMinimized = !isMinimized;
        saveConfig();
        updatePanelLayout();
        updateMinimizedBar();
    }
    
    // —— 更新EPH横条 ——
    function updateMinimizedBar() {
        const minimizedBar = document.getElementById('battlePanel_minimizedEphBar');
        const ephDisplay = document.getElementById('battlePanel_ephDisplay');
        
        if (minimizedBar) {
            const shouldShow = !isPanelExpanded || isMinimized;
            minimizedBar.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow && ephDisplay) {
                // 根据状态显示不同文本
                if (!isPanelExpanded) {
                    ephDisplay.textContent = `📊 展开 | EPH: ${calculateEPH().toFixed(1)}`;
                } else {
                    // 收起状态：显示EPH标签，但数值使用WPH（每小时击杀波次）
                    ephDisplay.textContent = `EPH: ${calculateWPH().toFixed(1)}`;
                }
            }
        }
    }

    // —— 面板展开/收起功能 ——
    function updatePanelLayout() {
        // 更新面板显示状态
        updatePanelStyle();
        
        // 更新按钮样式
        setToggleButtonStyle();
        
        // 更新收起横条
        updateMinimizedBar();
        
        // 重新绑定事件
        bindEvents();
        
        // 更新显示
        updateCurrentActionDisplay();
        updatePlayerStatsDisplay();
    }
    
    // —— 更新面板内容和缩放 ——
    function updatePanelContentAndScale() {
        updatePanelContent();
        bindEvents();
        updateCurrentActionDisplay();
        updatePlayerStatsDisplay();
    }
    
    // —— 事件绑定函数 ——
    function bindEvents() {
        const elements = getElements();
        
        // 面板展开/收起 - 固定按钮
        if (elements.toggleButton) {
            elements.toggleButton.removeEventListener('click', togglePanelHandler);
            elements.toggleButton.addEventListener('click', togglePanelHandler);
        }
        
        // 当前行动记录开关
        if (elements.actionLogToggle) {
            elements.actionLogToggle.removeEventListener('change', actionLogToggleHandler);
            elements.actionLogToggle.addEventListener('change', actionLogToggleHandler);
        }
        
        // 屏蔽无伤害技能开关
        if (elements.hideZeroDamageToggle) {
            elements.hideZeroDamageToggle.removeEventListener('change', hideZeroDamageToggleHandler);
            elements.hideZeroDamageToggle.addEventListener('change', hideZeroDamageToggleHandler);
        }
        
        // 缩放输入框
        if (elements.scaleInput) {
            elements.scaleInput.removeEventListener('input', scaleInputHandler);
            elements.scaleInput.addEventListener('input', scaleInputHandler);
        }
        
        // 清除统计数据
        if (elements.clearStats) {
            elements.clearStats.removeEventListener('click', clearStatsHandler);
            elements.clearStats.addEventListener('click', clearStatsHandler);
        }
        
        // 收起按钮
        if (elements.minimizeBtn) {
            elements.minimizeBtn.removeEventListener('click', minimizeBtnHandler);
            elements.minimizeBtn.addEventListener('click', minimizeBtnHandler);
        }
    }
    
    // 事件处理函数
    function togglePanelHandler() {
        // 顶部红色收起按钮只负责收起到小横条
        if (isPanelExpanded && !isMinimized) {
            isMinimized = true;
            saveConfig();
            updatePanelLayout();
            console.log('📋 [面板] 面板已收起到EPH横条');
        }
    }
    
    function actionLogToggleHandler(e) {
        enableCurrentActionLog = e.target.checked;
        saveConfig();
        
        console.log(`📋 [面板] 控制台战斗日志已${enableCurrentActionLog ? '开启' : '关闭'}`);
    }
    
    function hideZeroDamageToggleHandler(e) {
        hideZeroDamageSkills = e.target.checked;
        saveConfig();
        updatePlayerStatsDisplay(); // 立即更新显示
        
        console.log(`📋 [面板] 屏蔽无伤害技能已${hideZeroDamageSkills ? '开启' : '关闭'}`);
    }
    
    function scaleInputHandler(e) {
        const value = parseInt(e.target.value);
        if (value >= 50 && value <= 200) {
            panelScale = value;
            saveConfig();
            updatePanelContentAndScale();
            console.log(`📋 [面板] 缩放调整为 ${panelScale}%`);
        }
    }
    
    function clearStatsHandler() {
        if (confirm('确定要清除所有统计数据吗？这将删除所有保存的战斗数据和遇敌统计！')) {
            playerStats = {};
            currentBattleInfo = null;
            battleStartTime = null;
            
            // 重置击杀波次统计
            killWaveStats = {
                totalWaves: 0,
                totalEnemies: 0,
                firstKillTime: null,
                lastKillTime: null,
                currentBattleUuid: null,
                currentBattleEnemies: new Set(),
                currentBattleAllEnemies: new Set()
            };
            
            // 清除本地存储
            localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
            localStorage.removeItem(STORAGE_KEYS.KILL_WAVE_STATS);
            
            // 立即更新显示
            updateCurrentActionDisplay();
            updatePlayerStatsDisplay();
            
            console.log('📊 [统计] 统计数据和击杀波次数据已清除');
        }
    }
    
    function minimizeBtnHandler() {
        toggleMinimize();
        console.log(`📋 [面板] 面板已${isMinimized ? '收起' : '展开'}`);
    }
    
    // 初始绑定事件
    bindEvents();
    
    // 初始化状态显示
    setTimeout(() => {
        updateStatusDisplay();
        updateCurrentActionDisplay();
        updatePlayerStatsDisplay();
        updateMinimizedBar(); // 初始化收起横条状态
        
        // 如果有保存的数据，显示统计面板
        const elements = getElements();
        if ((Object.keys(playerStats).length > 0 || killWaveStats.totalWaves > 0) && elements.playerStatsPanel) {
            elements.playerStatsPanel.style.display = 'block';
        }
    }, 100);
    
    // —— 更新状态显示 ——
    function updateStatusDisplay() {
        // 收起状态下不需要状态显示
    }
    
    // —— 更新当前出手信息显示 ——
    function updateCurrentActionDisplay() {
        const elements = getElements();
        if (!currentBattleInfo || !elements.currentActionPanel || !elements.currentActionContent) {
            if (elements.currentActionPanel) {
                elements.currentActionPanel.style.display = 'none';
            }
            return;
        }
        
        elements.currentActionPanel.style.display = 'block';
        
        const action = currentBattleInfo.action;
        const sourceActor = action.sourceActor;
        const scale = (panelScale * 1.7) / 100;
        
        let html = `
            <div style="color:#64B5F6; font-weight:bold; margin-bottom:${6*scale}px; font-size:${10*scale}px; text-align:center;">
                第${currentBattleInfo.currentTurn + 1}次 - ${sourceActor.name} ${sourceActor.isPlayer ? '👤' : '👹'}
            </div>
            <div style="margin-bottom:${6*scale}px;">
                <div style="background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px; margin-bottom:${2*scale}px;">
                    <div style="color:#aaa; font-size:${7*scale}px;">技能</div>
                    <div style="color:#64B5F6; font-weight:bold; font-size:${8*scale}px;">${getSkillDisplayName(action.skillId || 'baseAttack')}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px; margin-bottom:${2*scale}px;">
                    <div style="color:#aaa; font-size:${7*scale}px;">总伤害</div>
                    <div style="color:#f44336; font-weight:bold; font-size:${8*scale}px;">${action.totalDamage.toLocaleString()}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px; margin-bottom:${2*scale}px;">
                    <div style="color:#aaa; font-size:${7*scale}px;">攻击次数</div>
                    <div style="color:#FF9800; font-weight:bold; font-size:${8*scale}px;">${action.attackCount}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px;">
                    <div style="color:#aaa; font-size:${7*scale}px;">时间</div>
                    <div style="color:#4CAF50; font-weight:bold; font-size:${8*scale}px;">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
        
        if (action.targets.length > 0) {
            html += `<div style="color:#64B5F6; font-size:${9*scale}px; margin-bottom:${4*scale}px; font-weight:bold; text-align:center;">🎯 目标</div>`;
            action.targets.forEach(target => {
                const hpPercent = Math.round((target.hp / target.maxHp) * 100);
                const statusColor = target.isDead ? '#9E9E9E' : (hpPercent < 20 ? '#f44336' : (hpPercent < 50 ? '#FF9800' : '#4CAF50'));
                html += `
                    <div style="
                        background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px; margin-bottom:${3*scale}px;
                        border-left:${2*scale}px solid ${statusColor};
                    ">
                        <div style="color:${statusColor}; font-weight:bold; font-size:${8*scale}px; ${target.isDead ? 'text-decoration: line-through;' : ''}">${target.name}</div>
                        <div style="color:#f44336; font-size:${7*scale}px;">${target.damage.toLocaleString()} 伤害</div>
                        <div style="color:${statusColor}; font-size:${7*scale}px;">
                            ${target.isDead ? '☠️ 死亡' : `❤️ ${target.hp}/${target.maxHp} (${hpPercent}%)`}
                        </div>
                    </div>
                `;
            });
        }
        
        elements.currentActionContent.innerHTML = html;
    }
    
    // —— 保存滚动位置 ——
    function saveScrollPositions() {
        const scrollPositions = {};
        const skillContainers = document.querySelectorAll('.skill-list-container');
        skillContainers.forEach(container => {
            const playerUuid = container.getAttribute('data-player-uuid');
            if (playerUuid) {
                scrollPositions[playerUuid] = container.scrollTop;
            }
        });
        return scrollPositions;
    }
    
    // —— 恢复滚动位置 ——（已弃用，改为同步更新）
    // function restoreScrollPositions - 已移除，现在使用同步方式更新滚动位置

    // —— 更新玩家统计显示 ——
    function updatePlayerStatsDisplay() {
        const elements = getElements();
        const playerCount = Object.keys(playerStats).length;
        const hasKillStats = killWaveStats.totalWaves > 0;
        if (playerCount === 0 && !hasKillStats) {
            if (elements.playerStatsPanel) {
                elements.playerStatsPanel.style.display = 'none';
            }
            return;
        }
        if (!elements.playerStatsPanel || !elements.playerStatsContent) {
            return;
        }
        
        // 保存当前滚动位置
        const scrollPositions = saveScrollPositions();
        
        // 添加更新状态标记，防止用户交互
        const existingContainers = document.querySelectorAll('.skill-list-container');
        existingContainers.forEach(container => {
            container.classList.add('updating');
        });
        
        elements.playerStatsPanel.style.display = 'block';
        
        const scale = (panelScale * 1.7) / 100;
        let html = '';
        
        // 按DPS从高到低排序玩家
        const sortedPlayersWithUuid = Object.entries(playerStats).map(([uuid, player]) => ({
            uuid,
            ...player
        })).sort((a, b) => {
            const aDPS = calculateDPS(a.totalDamage, a.firstActionTime, a.lastActionTime);
            const bDPS = calculateDPS(b.totalDamage, b.firstActionTime, b.lastActionTime);
            return bDPS - aDPS; // 从高到低排序
        });
        
        sortedPlayersWithUuid.forEach(player => {
            const avgDamage = player.totalActions > 0 ? Math.round(player.totalDamage / player.totalActions) : 0;
            const dps = calculateDPS(player.totalDamage, player.firstActionTime, player.lastActionTime);
            
            html += `
                <div style="
                    width:${140*scale}px; min-width:${140*scale}px; max-width:${140*scale}px; flex-shrink:0;
                    background:linear-gradient(135deg, rgba(0,0,0,0.3), rgba(100,181,246,0.05)); 
                    border-radius:${6*scale}px; padding:${8*scale}px;
                    border:1px solid rgba(100,181,246,0.3); height:100%;
                    box-shadow: 0 ${2*scale}px ${8*scale}px rgba(0,0,0,0.2);
                    display:flex; flex-direction:column;
                ">
                    <div style="color:#64B5F6; font-weight:bold; margin-bottom:${6*scale}px; font-size:${10*scale}px; text-align:center;">
                        👤 ${player.name}
                    </div>
                    
                    <!-- 总体数据 -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:${4*scale}px; margin-bottom:${6*scale}px; font-size:${8*scale}px;">
                        <div style="text-align:center; background:rgba(244,67,54,0.15); padding:${3*scale}px; border-radius:${3*scale}px; border:1px solid rgba(244,67,54,0.3);">
                            <div style="color:#f44336; font-weight:bold; font-size:${8*scale}px;">${player.totalDamage.toLocaleString()}</div>
                            <div style="color:#ccc; font-size:${6*scale}px;">总伤害</div>
                        </div>
                        <div style="text-align:center; background:rgba(255,152,0,0.15); padding:${3*scale}px; border-radius:${3*scale}px; border:1px solid rgba(255,152,0,0.3);">
                            <div style="color:#FF9800; font-weight:bold; font-size:${8*scale}px;">${avgDamage.toLocaleString()}</div>
                            <div style="color:#ccc; font-size:${6*scale}px;">平均</div>
                        </div>
                        <div style="text-align:center; background:rgba(76,175,80,0.15); padding:${3*scale}px; border-radius:${3*scale}px; border:1px solid rgba(76,175,80,0.3);">
                            <div style="color:#4CAF50; font-weight:bold; font-size:${8*scale}px;">${dps.toFixed(1)}</div>
                            <div style="color:#ccc; font-size:${6*scale}px;">DPS</div>
                        </div>
                    </div>
                    
                    <!-- 技能数据 -->
                    <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:${6*scale}px; padding-top:${6*scale}px; flex:1; min-height:0; display:flex; flex-direction:column;">
                        <div style="color:#64B5F6; font-size:${8*scale}px; margin-bottom:${4*scale}px; font-weight:bold; text-align:center;">🗡️ 技能统计</div>
                        <div class="battle-panel-scrollbar skill-list-container" data-player-uuid="${player.uuid}" style="
                            flex:1; overflow-y:auto; overflow-x:hidden; 
                            min-height:${150*scale}px;
                            border-radius:${3*scale}px;
                            padding-right:${2*scale}px;
                        ">
                        ${Object.entries(player.skills)
                            .filter(([skillId, skillData]) => !hideZeroDamageSkills || skillData.totalDamage > 0) // 过滤无伤害技能
                            .sort(([,a], [,b]) => b.totalDamage - a.totalDamage) // 按总伤害从大到小排序
                            .map(([skillId, skillData]) => {
                                const skillAvg = skillData.actionCount > 0 ? Math.round(skillData.totalDamage / skillData.actionCount) : 0;
                                const skillDps = calculateDPS(skillData.totalDamage, skillData.firstTime, skillData.lastTime);
                                return `
                                    <div style="margin-bottom:${3*scale}px; background:rgba(255,255,255,0.05); padding:${4*scale}px; border-radius:${3*scale}px; border-left:${2*scale}px solid #64B5F6;">
                                        <div style="color:#fff; font-weight:bold; font-size:${7*scale}px; margin-bottom:${2*scale}px;">${skillId === 'baseAttack' ? '⚔️' : '🔥'} ${getSkillDisplayName(skillId)}</div>
                                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:${2*scale}px; font-size:${6*scale}px;">
                                            <div style="text-align:center; color:#f44336; font-weight:bold;">${skillData.totalDamage.toLocaleString()}</div>
                                            <div style="text-align:center; color:#FF9800; font-weight:bold;">${skillAvg.toLocaleString()}</div>
                                            <div style="text-align:center; color:#4CAF50; font-weight:bold;">${skillDps.toFixed(1)}</div>
                                        </div>
                                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:${2*scale}px; font-size:${5*scale}px; color:#aaa; margin-top:${1*scale}px;">
                                            <div style="text-align:center;">总伤害</div>
                                            <div style="text-align:center;">平均</div>
                                            <div style="text-align:center;">DPS</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        // 使用DocumentFragment减少DOM重排
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 将tempDiv的所有子节点移动到fragment中
        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }
        
        // 一次性替换内容
        elements.playerStatsContent.innerHTML = '';
        elements.playerStatsContent.appendChild(fragment);
        
        // 立即恢复滚动位置，不使用延迟
        const skillContainers = document.querySelectorAll('.skill-list-container');
        skillContainers.forEach(container => {
            const playerUuid = container.getAttribute('data-player-uuid');
            if (playerUuid && scrollPositions[playerUuid] !== undefined) {
                container.scrollTop = scrollPositions[playerUuid];
            }
            container.classList.remove('updating');
        });
        
        // 更新击杀波次统计栏数据
        updateKillWaveStatsBar();
    }
    
    // —— 更新击杀波次统计栏 ——
    function updateKillWaveStatsBar() {
        const totalWavesElement = document.getElementById('battlePanel_totalWaves');
        const totalEnemiesElement = document.getElementById('battlePanel_totalEnemies');
        const wphValueElement = document.getElementById('battlePanel_wphValue');
        const ephValueElement = document.getElementById('battlePanel_ephValue');
        const runningTimeElement = document.getElementById('battlePanel_runningTime');
        
        if (totalWavesElement) {
            totalWavesElement.textContent = killWaveStats.totalWaves;
        }
        if (totalEnemiesElement) {
            totalEnemiesElement.textContent = killWaveStats.totalEnemies;
        }
        if (wphValueElement) {
            wphValueElement.textContent = calculateWPH().toFixed(1);
        }
        if (ephValueElement) {
            ephValueElement.textContent = calculateEPH().toFixed(1);
        }
        if (runningTimeElement) {
            const runningTime = killWaveStats.firstKillTime ? 
                formatRunningTime(Date.now() - killWaveStats.firstKillTime) : '0分钟';
            runningTimeElement.textContent = runningTime;
        }
        
        // 同时更新收起状态的EPH横条
        updateMinimizedBar();
    }
    
    // —— 拦截全局 WebSocket（战斗面板命名空间） ——
    const NativeWS = window.WebSocket;
    
    // 检查是否已经被其他脚本拦截
    if (!window.WebSocket.__battlePanelIntercepted) {
        const OriginalWebSocket = window.WebSocket;
        
        window.WebSocket = function(url, protocols) {
            const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
        
        // 保存当前WebSocket实例
        window.currentWS = ws;
        
        // —— 拦截发送的消息 ——
        const originalSend = ws.send;
        ws.send = function(data) {
            // 正常发送消息
            originalSend.call(this, data);
        };
        
        // —— 拦截接收的消息 ——
        ws.addEventListener('message', ev => {
            if (ev.data instanceof ArrayBuffer) {
                try {
                    const format = detectCompression(ev.data);
                    let text;
                    switch (format) {
                        case 'gzip':
                            text = pako.ungzip(new Uint8Array(ev.data), { to: 'string' });
                            break;
                        case 'zlib':
                            text = pako.inflate(new Uint8Array(ev.data), { to: 'string' });
                            break;
                        default:
                            text = pako.inflateRaw(new Uint8Array(ev.data), { to: 'string' });
                    }
                    
                    // 检查是否为战斗消息
                    if (isBattleMessage(text)) {
                        const battleData = parseBattleMessage(text);
                        if (battleData) {
                            logBattleMessage(battleData);
                        }
                    }
                    

                    
                } catch (err) {
                    // 解压失败，忽略
                    console.warn('WebSocket消息解压失败:', err);
                }
            } else {
                // 检查非二进制消息是否为战斗消息
                if (isBattleMessage(ev.data)) {
                    const battleData = parseBattleMessage(ev.data);
                    if (battleData) {
                        logBattleMessage(battleData);
                    }
                }
                

            }
        });
        
        // WebSocket连接状态变化
        ws.addEventListener('open', () => {
            console.log('⚔️ [战斗监听] WebSocket连接已建立');
        });
        
        ws.addEventListener('close', () => {
            console.log('⚔️ [战斗监听] WebSocket连接已断开');
        });
        
        ws.addEventListener('error', (error) => {
            console.error('⚔️ [战斗监听] WebSocket连接错误:', error);
        });
        
        return ws;
    };
    
        // 继承原型与静态属性
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        Object.getOwnPropertyNames(OriginalWebSocket).forEach(prop => {
            if (!(prop in window.WebSocket)) {
                window.WebSocket[prop] = OriginalWebSocket[prop];
            }
        });
        
        // 标记已被战斗面板拦截
        window.WebSocket.__battlePanelIntercepted = true;
    }
    
})(); 