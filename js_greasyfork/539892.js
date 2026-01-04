// ==UserScript==
// @name         猫猫放置强化助手
// @version      v4.6
// @description  强化自动化工具
// @author       YuoHira
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moyu-idle.com
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @namespace    https://greasyfork.org/users/397156
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      kokdmexaezqaylurjprj.supabase.co
// @connect      *.supabase.co
// @downloadURL https://update.greasyfork.org/scripts/539892/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539892/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // —— 默认配置 ——
  let TARGET_LEVEL = 5;           // 目标强化等级
  let ENHANCE_INTERVAL = 3000;    // 强化间隔（毫秒）
  let isAutoEnhancing = false;    // 自动强化状态
  let enhanceTimer = null;        // 强化定时器
  let storedEnhanceData = null;   // 储存的强化数据（完整的请求对象）
  let currentEnhanceItem = null;  // 当前强化物品信息
  let DEBUG_MODE = false;         // 调试模式（默认关闭）
  let PROTECT_START_LEVEL = 3;    // 从几级开始使用保护材料
  let PROTECT_MODE = 'none';      // 保护模式: 'none'=不使用, 'item'=使用物品, 'essence'=使用精华
  let BATCH_COUNT = 1;            // 批量强化次数
  let currentBatchCount = 0;      // 当前剩余强化次数

  let waitingForResult = false;   // 等待强化结果
  let enhanceHistory = {};        // 强化历史记录 {baseItem: {sessions: []}}
  let isHistoryPanelOpen = false; // 历史记录面板是否打开
  let currentEnhanceRecordId = null; // 当前强化记录ID（用于继承）
  let isContinuedFromHistory = false; // 是否从历史记录继续强化（不存档）
  let lastEnhanceBaseItem = null; // 上一次强化的基础物品名称（用于智能继续检测）
  let ENABLE_HISTORY_RECORDING = true; // 是否启用历史记录功能（存档）
  let savedUserName = null; // 保存的用户名称

  // —— 强化统计数据 ——
  let enhanceStats = {
    baseItem: '',               // 基础物品名称
    currentLevel: 0,            // 当前等级
    targetLevel: 0,             // 目标等级
    maxReachedLevel: 0,         // 历史最大等级
    levelStats: {},             // 每级统计 {level: {attempts: 0, success: 0}}
    totalAttempts: 0,           // 总尝试次数
    totalSuccess: 0,            // 总成功次数
    startTime: null             // 开始时间
  };

  // —— 可强化装备ID到中文名称的映射 ——
  const enhanceableItemsMap = {
    ancientFishboneNecklace: "远古鱼骨项链",
    axe: "斧头",
    catFurCuteHat: "毛毛可爱帽",
    catPotionSilverBracelet: "猫薄荷手链",
    collectingBracelet: "采集手环",
    emberAegis: "余烬庇护",
    fermentationStirrer: "酿造搅拌器",
    fishingHat: "钓鱼帽",
    forestDagger: "冰霜匕首",
    frostCrown: "霜之王冠",
    goblinDaggerPlus: "哥布林匕首·改",
    iceFeatherBoots: "冰羽靴",
    icePickaxe: "冰镐",
    ironCoat: "铁甲衣",
    ironGloves: "铁护手",
    ironHat: "铁头盔",
    ironMachinistHammer: "铁锤",
    ironPants: "铁护腿",
    ironPot: "铁锅",
    ironShovel: "铁铲",
    ironSword: "铁剑",
    magicBook: "魔法书",
    mewShadowStaff: "喵影法杖",
    mithrilCoat: "秘银护甲",
    mithrilDagger: "秘银匕首",
    mithrilGloves: "秘银手套",
    mithrilHat: "秘银头盔",
    mithrilPants: "秘银护腿",
    mithrilSword: "秘银剑",
    moonlightPendant: "月光吊坠",
    moonlightStaff: "月光法杖",
    overloadGuardianCore: "过载核心",
    silkDexGloves: "丝质绑带手套",
    silkDexHeadScarf: "丝质裹头巾",
    silkMageBurqa: "丝质罩袍",
    silkMageHat: "丝质法师帽",
    silkMageLongGloves: "丝质法师手套",
    silkMagePants: "丝质法师裤",
    silkTightsCloth: "丝质夜行衣",
    silkTightsPants: "丝质宽松裤",
    silverCoat: "银护甲",
    silverDagger: "银质匕首",
    silverGloves: "银护手",
    silverHat: "银头盔",
    silverPants: "银护腿",
    silverSword: "银质剑",
    snowWolfCloak: "雪狼皮披风",
    starDustMagicBook: "星辰魔法书",
    steelCoat: "钢甲衣",
    steelGloves: "钢护手",
    steelHammer: "钢制重锤",
    steelHat: "钢头盔",
    steelMachinistHammer: "钢锤",
    steelPants: "钢护腿",
    steelPot: "钢锅",
    steelShovel: "钢铲",
    steelSword: "钢剑",
    woodStaff: "木法杖",
    woodSword: "木剑",
    woolArtisanOutfit: "羊毛工匠服",
    woolBurqa: "羊毛罩袍",
    woolCuteGloves: "羊毛可爱手套",
    woolCuteHat: "羊毛可爱帽",
    woolDexGloves: "羊毛绑带手套",
    woolDexHeadScarf: "羊毛裹头巾",
    woolMageHat: "羊毛法师帽",
    woolMageLongGloves: "羊毛法师手套",
    woolMagePants: "羊毛法师裤",
    woolTailorClothes: "羊毛裁缝服",
    woolTailorGloves: "羊毛裁缝手套",
    woolTightsCloth: "羊毛紧身衣",
    woolTightsPants: "羊毛紧身裤",
    starEssence: "星辉精华",
  };

  // —— 本地存储键名 ——
  const STORAGE_KEYS = {
    POSITION: 'enhanceHelper_position',
    TARGET_LEVEL: 'enhanceHelper_targetLevel',
    INTERVAL: 'enhanceHelper_interval',
    CURRENT_ITEM: 'enhanceHelper_currentItem',
    STORED_REQUEST: 'enhanceHelper_storedRequest',
    DEBUG_MODE: 'enhanceHelper_debugMode',
    PROTECT_START_LEVEL: 'enhanceHelper_protectStartLevel',
    PROTECT_MODE: 'enhanceHelper_protectMode',
    IS_MINIMIZED: 'enhanceHelper_isMinimized',
    BATCH_COUNT: 'enhanceHelper_batchCount',
    CURRENT_BATCH_COUNT: 'enhanceHelper_currentBatchCount',
    ENHANCE_HISTORY: 'enhanceHelper_enhanceHistory',
    ENABLE_HISTORY_RECORDING: 'enhanceHelper_enableHistoryRecording',
    USER_NAME: 'enhanceHelper_userName'
  };

  // —— 数据库配置 ——
  // 如果你是其他的脚本开发者,请自行前往supabase创建自己的数据库和表(感谢配合)
  // 表结构: item_name (text), player_name (text), enhance_num (integer)
  const SUPABASE_CONFIG = {
    url: 'https://kokdmexaezqaylurjprj.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtva2RtZXhhZXpxYXlsdXJqcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzMzNzQsImV4cCI6MjA2Njg0OTM3NH0.fuHqBV4RWd6gHUn-ff3pmsOu6BAdNTmDb_0Eclqz8aM'
  };
  const TABLE_NAME = '弱化之王';

  // —— 界面状态 ——
  let isMinimized = false;

  // —— 加载本地配置 ——
  function loadConfig() {
    const savedTarget = localStorage.getItem(STORAGE_KEYS.TARGET_LEVEL);
    const savedInterval = localStorage.getItem(STORAGE_KEYS.INTERVAL);
    const savedCurrentItem = localStorage.getItem(STORAGE_KEYS.CURRENT_ITEM);
    const savedStoredRequest = localStorage.getItem(STORAGE_KEYS.STORED_REQUEST);
    const savedDebugMode = localStorage.getItem(STORAGE_KEYS.DEBUG_MODE);

    const savedProtectStartLevel = localStorage.getItem(STORAGE_KEYS.PROTECT_START_LEVEL);
    const savedProtectMode = localStorage.getItem(STORAGE_KEYS.PROTECT_MODE);
    const savedIsMinimized = localStorage.getItem(STORAGE_KEYS.IS_MINIMIZED);
    const savedBatchCount = localStorage.getItem(STORAGE_KEYS.BATCH_COUNT);
    const savedCurrentBatchCount = localStorage.getItem(STORAGE_KEYS.CURRENT_BATCH_COUNT);
    const savedEnhanceHistory = localStorage.getItem(STORAGE_KEYS.ENHANCE_HISTORY);
    const savedEnableHistoryRecording = localStorage.getItem(STORAGE_KEYS.ENABLE_HISTORY_RECORDING);
    const storedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME);

    if (savedTarget) TARGET_LEVEL = parseInt(savedTarget, 10);
    if (savedInterval) ENHANCE_INTERVAL = parseInt(savedInterval, 10);
    if (savedDebugMode) DEBUG_MODE = savedDebugMode === 'true';
    if (savedProtectStartLevel) PROTECT_START_LEVEL = parseInt(savedProtectStartLevel, 10);
    if (savedProtectMode) PROTECT_MODE = savedProtectMode;
    if (savedIsMinimized) isMinimized = savedIsMinimized === 'true';
    if (savedBatchCount) BATCH_COUNT = parseInt(savedBatchCount, 10);
    if (savedCurrentBatchCount) currentBatchCount = parseInt(savedCurrentBatchCount, 10);
    if (savedEnableHistoryRecording !== null) ENABLE_HISTORY_RECORDING = savedEnableHistoryRecording === 'true';

    // 恢复用户名
    if (storedUserName) {
      savedUserName = storedUserName;
    }

    // 恢复强化历史记录
    if (savedEnhanceHistory) {
      try {
        enhanceHistory = JSON.parse(savedEnhanceHistory);
      } catch (e) {
        enhanceHistory = {};
      }
    }

    // 恢复当前强化物品
    if (savedCurrentItem) {
      try {
        currentEnhanceItem = JSON.parse(savedCurrentItem);
      } catch (e) {
        currentEnhanceItem = null;
      }
    }

    // 恢复储存的请求数据
    if (savedStoredRequest) {
      try {
        storedEnhanceData = JSON.parse(savedStoredRequest);
      } catch (e) {
        storedEnhanceData = null;
      }
    }
  }

  // —— 保存配置 ——
  function saveConfig() {
    localStorage.setItem(STORAGE_KEYS.TARGET_LEVEL, TARGET_LEVEL);
    localStorage.setItem(STORAGE_KEYS.INTERVAL, ENHANCE_INTERVAL);
    localStorage.setItem(STORAGE_KEYS.DEBUG_MODE, DEBUG_MODE);
    localStorage.setItem(STORAGE_KEYS.PROTECT_START_LEVEL, PROTECT_START_LEVEL);
    localStorage.setItem(STORAGE_KEYS.PROTECT_MODE, PROTECT_MODE);
    localStorage.setItem(STORAGE_KEYS.IS_MINIMIZED, isMinimized);
    localStorage.setItem(STORAGE_KEYS.BATCH_COUNT, BATCH_COUNT);
    localStorage.setItem(STORAGE_KEYS.CURRENT_BATCH_COUNT, currentBatchCount);
    localStorage.setItem(STORAGE_KEYS.ENABLE_HISTORY_RECORDING, ENABLE_HISTORY_RECORDING);

    // 保存用户名
    if (savedUserName) {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, savedUserName);
    }
  }

  // —— 保存强化历史记录 ——
  function saveEnhanceHistory() {
    localStorage.setItem(STORAGE_KEYS.ENHANCE_HISTORY, JSON.stringify(enhanceHistory));
  }

  // —— 生成完全随机的强化记录ID ——
  function generateEnhanceRecordId() {
    const timestamp = Date.now().toString(36);
    const randomPart1 = Math.random().toString(36).substr(2, 8);
    const randomPart2 = Math.random().toString(36).substr(2, 8);
    const randomPart3 = Math.random().toString(36).substr(2, 8);
    return `${timestamp}_${randomPart1}_${randomPart2}_${randomPart3}`;
  }

  // —— 保存当前强化物品 ——
  function saveCurrentItem() {
    if (currentEnhanceItem) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ITEM, JSON.stringify(currentEnhanceItem));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ITEM);
    }
  }

  // —— 保存强化请求数据 ——
  function saveStoredRequest() {
    if (storedEnhanceData) {
      localStorage.setItem(STORAGE_KEYS.STORED_REQUEST, JSON.stringify(storedEnhanceData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STORED_REQUEST);
    }
  }

  // —— 边界检查函数 ——
  function constrainPosition(x, y, panelWidth = 480, panelHeight = 400) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 确保面板至少有50px在可见范围内
    const minVisible = 50;

    // 检查右边界（x是right值）
    if (x < 0) {
      x = 20; // 默认右边距
    } else if (x > windowWidth - minVisible) {
      x = windowWidth - minVisible;
    }

    // 检查上下边界（y是top值）  
    if (y < 0) {
      y = 20; // 默认上边距
    } else if (y > windowHeight - minVisible) {
      y = windowHeight - minVisible;
    }

    return { x, y };
  }

  // —— 保存位置 ——
  function savePosition(x, y) {
    const constrained = constrainPosition(x, y);
    localStorage.setItem(STORAGE_KEYS.POSITION, JSON.stringify(constrained));
  }

  // —— 加载位置 ——
  function loadPosition() {
    const saved = localStorage.getItem(STORAGE_KEYS.POSITION);
    let position = { x: 20, y: 20 }; // 默认位置

    if (saved) {
      try {
        position = JSON.parse(saved);
      } catch (e) {
        position = { x: 20, y: 20 };
      }
    }

    // 加载时也进行边界检查，防止窗口大小改变后面板跑到屏幕外
    return constrainPosition(position.x, position.y);
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

  // —— 判断是否为强化请求 ——
  function isEnhanceRequest(data) {
    if (typeof data === 'string') {
      try {
        // 检查是否包含 enhance:require 事件
        return data.includes('"enhance:require"') || data.includes('enhance:require');
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // —— 解析强化数据 ——
  function parseEnhanceData(data) {
    try {
      if (typeof data === 'string') {
        // 尝试解析Socket.IO格式的数据
        const match = data.match(/\["enhance:require",(.+)\]/);
        if (match) {
          const payload = JSON.parse(match[1]);
          if (payload.data && payload.data.resourceId) {
            return {
              resourceId: payload.data.resourceId,
              protectedResourceId: payload.data.protectedResourceId || null,
              user: payload.user ? payload.user.name : 'Unknown',
              fullPayload: payload // 保存完整的payload用于重构请求
            };
          }
        }
      }
    } catch (e) {
      // 解析失败，忽略
    }
    return null;
  }

  // —— 解析强化结果 ——
  function parseEnhanceResult(text) {
    try {
      const data = JSON.parse(text);
      if (data.data && data.data.hasOwnProperty('success') && data.data.enhanceResultId) {
        return {
          success: data.data.success,
          message: data.data.msg,
          resultId: data.data.enhanceResultId,
          user: data.user ? data.user.name : 'Unknown'
        };
      }
    } catch (e) {
      // 不是强化结果，忽略
    }
    return null;
  }

  // —— 解析物品等级 ——
  function parseItemLevel(itemId) {
    const match = itemId.match(/(.+?)\+(\d+)$/);
    if (match) {
      return {
        baseItem: match[1],
        level: parseInt(match[2], 10)
      };
    }
    return {
      baseItem: itemId,
      level: 0
    };
  }

  // —— 物品ID翻译函数 ——
  function translateItemId(itemId) {
    if (!itemId) return itemId;
    
    // 解析物品等级
    const itemInfo = parseItemLevel(itemId);
    const baseItemId = itemInfo.baseItem;
    const level = itemInfo.level;
    
    // 获取中文名称
    const chineseName = enhanceableItemsMap[baseItemId] || baseItemId;
    
    // 如果有等级后缀，添加等级显示
    if (level > 0) {
      return `${chineseName}+${level}`;
    }
    
    return chineseName;
  }

  // —— 初始化统计数据 ——
  function initStats(itemId, targetLevel, inheritRecordId = null) {
    const parsed = parseItemLevel(itemId);

    // 如果有继承的记录ID，使用它；否则生成新的
    const recordId = inheritRecordId || generateEnhanceRecordId();
    currentEnhanceRecordId = recordId;

    enhanceStats = {
      baseItem: parsed.baseItem,
      startLevel: parsed.level, // 记录起始等级
      currentLevel: parsed.level,
      targetLevel: targetLevel,
      maxReachedLevel: parsed.level, // 初始化为当前等级
      levelStats: {},
      totalAttempts: 0,
      totalSuccess: 0,
      startTime: Date.now(),
      sessionId: Date.now() + '_' + Math.random().toString(36).substr(2, 9), // 唯一会话ID
      recordId: recordId // 强化记录ID（用于继承和合并）
    };

    // 初始化每级统计 - 始终从+1到目标等级
    for (let i = 0; i < targetLevel; i++) {
      enhanceStats.levelStats[i] = { attempts: 0, success: 0 };
    }
  }

  // —— 更新统计数据 ——
  function updateStats(result) {
    // 解析结果物品等级
    const resultItem = parseItemLevel(result.resultId);

    // 记录这次尝试
    const attemptLevel = enhanceStats.currentLevel;
    const levelStats = enhanceStats.levelStats[attemptLevel];
    if (levelStats) {
      levelStats.attempts++;
      enhanceStats.totalAttempts++;

      if (result.success) {
        levelStats.success++;
        enhanceStats.totalSuccess++;
      }
    }

    // 更新当前等级为结果等级
    enhanceStats.currentLevel = resultItem.level;

    // 更新历史最大等级
    if (resultItem.level > enhanceStats.maxReachedLevel) {
      enhanceStats.maxReachedLevel = resultItem.level;
    }

    updateStatsDisplay();
  }

  // —— 保存当前强化会话到历史记录 ——
  function saveCurrentSessionToHistory() {
    if (!ENABLE_HISTORY_RECORDING || !enhanceStats.baseItem || !enhanceStats.sessionId) return;

    const baseItem = enhanceStats.baseItem;

    // 初始化物品历史记录
    if (!enhanceHistory[baseItem]) {
      enhanceHistory[baseItem] = {
        sessions: []
      };
    }

    // 创建历史记录条目
    const historyEntry = {
      sessionId: enhanceStats.sessionId,
      recordId: enhanceStats.recordId, // 强化记录ID
      startLevel: enhanceStats.startLevel, // 使用记录的起始等级
      endLevel: enhanceStats.currentLevel,
      targetLevel: enhanceStats.targetLevel,
      maxReachedLevel: enhanceStats.maxReachedLevel,
      levelStats: JSON.parse(JSON.stringify(enhanceStats.levelStats)), // 深拷贝
      totalAttempts: enhanceStats.totalAttempts,
      totalSuccess: enhanceStats.totalSuccess,
      startTime: enhanceStats.startTime,
      endTime: Date.now(),
      completed: enhanceStats.currentLevel >= enhanceStats.targetLevel
    };

    // 检查是否已存在相同recordId的记录，如果存在则直接覆盖，否则添加
    const existingIndex = enhanceHistory[baseItem].sessions.findIndex(s => s.recordId === enhanceStats.recordId);
    if (existingIndex >= 0) {
      const existingEntry = enhanceHistory[baseItem].sessions[existingIndex];

      // 直接覆盖记录：保留最早的开始时间和最初的起始等级
      historyEntry.startTime = existingEntry.startTime; // 保持最早的开始时间
      historyEntry.startLevel = existingEntry.startLevel; // 保持最初的起始等级

      // 直接覆盖记录（不累加）
      enhanceHistory[baseItem].sessions[existingIndex] = historyEntry;
    } else {
      enhanceHistory[baseItem].sessions.push(historyEntry);
    }

    // 保存到本地存储
    saveEnhanceHistory();

    // Debug模式记录历史保存
    if (DEBUG_MODE) {
      console.group('📚 [强化助手] 保存强化历史记录');
      console.log('记录信息:', {
        记录ID: historyEntry.recordId,
        会话ID: historyEntry.sessionId,
        物品: baseItem,
        等级进度: `+${historyEntry.startLevel} → +${historyEntry.endLevel}`,
        操作类型: existingIndex >= 0 ? '覆盖现有记录' : '新增记录',
        总尝试: historyEntry.totalAttempts,
        总成功: historyEntry.totalSuccess
      });
      console.groupEnd();
    }
  }

  // —— 自动强化函数 ——
  function startAutoEnhance(ws) {
    if (enhanceTimer) {
      clearTimeout(enhanceTimer);
    }

    // 发送第一次强化请求
    sendEnhanceRequest(ws);
  }

  // —— 发送强化请求 ——
  function sendEnhanceRequest(ws) {
    if (!isAutoEnhancing || !ws || ws.readyState !== WebSocket.OPEN || !currentEnhanceItem || !storedEnhanceData) {
      return;
    }

    // 检查是否达到目标等级
    if (enhanceStats.currentLevel >= enhanceStats.targetLevel) {
      // 获取当前输入框的批量次数
      const currentInputValue = parseInt(batchCountInput.value, 10);

      // 批量次数-1，直接修改输入框的值
      if (currentInputValue > 1) {
        batchCountInput.value = currentInputValue - 1;
        BATCH_COUNT = currentInputValue - 1; // 同步内部变量
        currentBatchCount = currentInputValue - 1; // 同步当前批量次数
        saveConfig(); // 保存配置

        // 获取基础物品ID（去掉+数字后缀）
        const currentItemInfo = parseItemLevel(currentEnhanceItem.resourceId);
        const baseItemId = currentItemInfo.baseItem; // 基础物品ID，不包含+数字

        // 更新当前强化物品为基础版本
        currentEnhanceItem.resourceId = baseItemId;
        saveCurrentItem(); // 保存更新后的物品信息

        // 重置统计数据，准备下一轮强化（使用基础物品ID，生成新的记录ID）
        initStats(baseItemId, TARGET_LEVEL); // 不传递inheritRecordId，让每轮批量强化生成新的记录ID
        updateStatsDisplay();
        updateItemDisplay(currentEnhanceItem, `批量剩余: ${currentInputValue - 1}`);
        updateMinimizedDisplay();

        // 批量强化中不重置继续强化标记，保持当前状态

        // Debug模式记录批量循环信息
        if (DEBUG_MODE) {
          console.group('🔄 [强化助手] 批量强化循环');
          console.log('批量信息:', {
            完成轮次: BATCH_COUNT - (currentInputValue - 1) + 1,
            剩余次数: currentInputValue - 1,
            基础物品ID: baseItemId,
            原强化物品ID: enhanceStats.baseItem + '+' + enhanceStats.targetLevel,
            新记录ID: currentEnhanceRecordId, // 显示新生成的记录ID
            时间: new Date().toLocaleTimeString()
          });
          console.groupEnd();
        }

        // 继续发送强化请求
        setTimeout(() => {
          sendEnhanceRequest(ws);
        }, ENHANCE_INTERVAL);
        return;
      }

      // 批量完成，停止自动强化并更新UI状态
      isAutoEnhancing = false;
      // 先保存历史记录再停止
      if (enhanceStats.baseItem) {
        saveCurrentSessionToHistory();
      }
      stopAutoEnhance();
      updateItemDisplay(currentEnhanceItem, '批量完成');
      updateToggleButtonState();
      updateMinimizedDisplay();

      // 重置继续强化标记和上次强化记录
      isContinuedFromHistory = false;
      lastEnhanceBaseItem = null;
      return;
    }

    // 构造当前物品的强化请求，使用完整保存的数据
    const requestData = {
      user: storedEnhanceData.user,
      data: {
        resourceId: currentEnhanceItem.resourceId
      }
    };

    // 根据保护模式和当前等级决定是否使用保护材料
    if (enhanceStats.currentLevel >= PROTECT_START_LEVEL && PROTECT_MODE !== 'none') {
      if (PROTECT_MODE === 'essence') {
        // 使用精华保护
        requestData.data.protectedResourceId = 'starEssence';
      } else if (PROTECT_MODE === 'item') {
        // 使用物品保护：当前强化物品的等级-4，最低为0级
        const currentItemInfo = parseItemLevel(currentEnhanceItem.resourceId);
        const protectLevel = Math.max(0, currentItemInfo.level - 4);
        const protectItemId = protectLevel > 0 ? `${currentItemInfo.baseItem}+${protectLevel}` : currentItemInfo.baseItem;
        requestData.data.protectedResourceId = protectItemId;
      }
    }

    const enhanceRequest = `42["enhance:require",${JSON.stringify(requestData)}]`;

    // Debug模式记录自动强化请求
    if (DEBUG_MODE) {
      console.group('🤖 [强化助手] 发送自动强化请求');
      console.log('请求数据:', enhanceRequest);
      console.log('构造的请求对象:', requestData);
      console.log('目标物品:', {
        物品ID: currentEnhanceItem.resourceId,
        保护材料ID: requestData.data.protectedResourceId || '无',
        当前等级: enhanceStats.currentLevel,
        目标等级: enhanceStats.targetLevel,
        批量进度: `${BATCH_COUNT - currentBatchCount + 1}/${BATCH_COUNT}`,
        剩余次数: currentBatchCount,
        保护模式: PROTECT_MODE,
        保护设置: `≥${PROTECT_START_LEVEL}级使用`,
        实际使用保护: requestData.data.protectedResourceId ? '是' : '否',
        用户: requestData.user.name,
        时间: new Date().toLocaleTimeString()
      });
      console.groupEnd();
    }

    waitingForResult = true;
    ws.__originalSend(enhanceRequest);
  }

  // —— 处理强化结果 ——
  function handleEnhanceResult(result) {
    // 添加错误处理，防止我们的代码影响游戏运行
    try {
      waitingForResult = false;

      // 解析结果物品信息
      const resultItemInfo = parseItemLevel(result.resultId);
      const resultBaseItem = resultItemInfo.baseItem;

      // 检查是否需要智能继续强化
      let shouldSmartContinue = false;
      if (!isAutoEnhancing && lastEnhanceBaseItem && resultBaseItem === lastEnhanceBaseItem) {
        // 停止强化状态下，如果结果物品和上次强化的是同一种基础物品，启用智能继续
        shouldSmartContinue = true;
        isContinuedFromHistory = true;

        // Debug模式记录智能继续
        if (DEBUG_MODE) {
          console.group('🔄 [强化助手] 智能继续检测');
          console.log('继续信息:', {
            上次基础物品: lastEnhanceBaseItem,
            当前结果物品: result.resultId,
            结果基础物品: resultBaseItem,
            是否继续: shouldSmartContinue,
            时间: new Date().toLocaleTimeString()
          });
          console.groupEnd();
        }
      }

      // 总是更新当前强化物品为结果物品（不管成功失败）
      const wasFirstCapture = !currentEnhanceItem;

      currentEnhanceItem = {
        resourceId: result.resultId,
        user: result.user
      };

      // 保存到本地存储
      saveCurrentItem();

      // 保存用户名到本地存储
      if (result.user && !savedUserName) {
        savedUserName = result.user;
        saveConfig(); // 保存用户名到本地存储
      }

      // 如果是第一次捕获物品，启用按钮
      if (wasFirstCapture) {
        updateItemDisplay(currentEnhanceItem);
      } else {
        // 更新UI显示当前物品
        updateItemDisplay(currentEnhanceItem);

        // 更新统计数据（只有在自动强化时才统计）
        if (isAutoEnhancing) {
          updateStats(result);
          // 自动强化时每次都保存历史记录
          saveCurrentSessionToHistory();
        }

        // 如果启用了智能继续，且当前有统计数据，继续累加统计
        if (shouldSmartContinue && enhanceStats.baseItem === resultBaseItem) {
          updateStats(result);
          // 智能继续时也保存历史记录
          saveCurrentSessionToHistory();
        }

        // 手动强化：如果当前有统计数据且是同一物品，也要更新统计和保存历史
        if (!isAutoEnhancing && !shouldSmartContinue && enhanceStats.baseItem === resultBaseItem) {
          updateStats(result);
          saveCurrentSessionToHistory();
        }
      }

      // 如果还在自动强化模式，延迟后继续
      if (isAutoEnhancing) {
        enhanceTimer = setTimeout(() => {
          sendEnhanceRequest(unsafeWindow.currentWS);
        }, ENHANCE_INTERVAL);
      }
    } catch (error) {
      // 捕获并记录错误，但不影响游戏运行
      if (DEBUG_MODE) {
        console.error('[强化助手] 处理强化结果时发生错误:', error);
        console.error('错误堆栈:', error.stack);
        console.log('强化结果数据:', result);
      }
      
      // 重置等待状态，避免卡住
      waitingForResult = false;
    }
  }

  function stopAutoEnhance() {
    if (enhanceTimer) {
      clearTimeout(enhanceTimer);
      enhanceTimer = null;
    }
    waitingForResult = false;

    // 记录上次强化的基础物品名称，用于智能继续检测
    if (enhanceStats.baseItem) {
      lastEnhanceBaseItem = enhanceStats.baseItem;
      // 保存当前会话到历史记录
      saveCurrentSessionToHistory();
    }

    // 注意：这里不重置 isContinuedFromHistory 标记
    // 因为停止后用户可能还想继续，标记会在下次开始强化时处理
  }

  // —— 初始化配置 ——
  loadConfig();

  // Debug模式启动提示
  if (DEBUG_MODE) {
    console.log('🐛 [强化助手] 调试模式已启用，将记录所有WebSocket强化请求和结果');
  }

  // 检查权限配置
  checkPermissions();

  // 如果有恢复的物品，延迟更新UI显示
  if (currentEnhanceItem) {
    setTimeout(() => {
      updateItemDisplay(currentEnhanceItem);
    }, 100);
  }

  // 初始化保护显示
  setTimeout(() => {
    updateProtectDisplay();
    updateProtectModeButtons(); // 初始化保护模式按钮样式
    // 初始化保护等级提示
    if (PROTECT_START_LEVEL === 0) {
      protectLevelHint.textContent = '不使用保护';
      protectLevelHint.style.color = '#f44336';
    } else {
      protectLevelHint.textContent = `≥${PROTECT_START_LEVEL}级使用保护`;
      protectLevelHint.style.color = '#aaa';
    }

    // 如果有恢复的物品，更新显示
    if (currentEnhanceItem) {
      updateItemDisplay(currentEnhanceItem);
    }

    // 如果页面加载时是收起状态，调整面板宽度和显示状态
    if (isMinimized) {
      panel.style.width = '280px';
      titleBar.style.display = 'none';
      mainContent.style.display = 'none';
      minimizedBar.style.display = 'flex';
    }

    // 初始化收起状态显示
    updateMinimizedDisplay();

    // 初始化历史记录按钮状态
    historyBtn.disabled = !ENABLE_HISTORY_RECORDING;
    historyBtn.style.opacity = ENABLE_HISTORY_RECORDING ? '1' : '0.5';
  }, 100);

  // —— 创建浮动控制面板 ——
  const panel = document.createElement('div');
  panel.id = 'enhanceHelperPanel'; // 添加唯一ID
  const savedPos = loadPosition();
  panel.style.cssText = `
    position: fixed; top: ${savedPos.y}px; right: ${savedPos.x}px;
    width: 480px; padding: 12px;
    background: rgba(25,35,45,0.95); color: #fff;
    font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
    border-radius: 10px; z-index: 9999;
    cursor: move; border: 1px solid rgba(100,200,255,0.3);
    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
    backdrop-filter: blur(5px);
  `;
  panel.innerHTML = `
    <div id="enhanceHelper_titleBar" style="cursor: default; margin-bottom:10px; font-weight:bold; color:#64B5F6; display:${isMinimized ? 'none' : 'flex'}; align-items:center;">
      <span>🛠️ 强化助手</span>
      <div style="margin-left:auto; display:flex; align-items:center; gap:6px;">
        <button id="enhanceHelper_minimizeBtn" style="
          padding:2px 6px; background:rgba(100,200,255,0.2); border:none; border-radius:3px;
          color:#64B5F6; cursor:pointer; font-size:10px;
        ">${isMinimized ? '📋' : '📌'}</button>
        <div style="font-size:10px; color:#888;">v4.6</div>
      </div>
    </div>
    
    <!-- 收起状态的小横条 -->
    <div id="enhanceHelper_minimizedBar" style="display:${isMinimized ? 'flex' : 'none'}; 
      background:rgba(0,0,0,0.5); padding:6px 8px; border-radius:6px; margin-bottom:8px;
      font-size:11px; color:#FFA726; align-items:center; justify-content:space-between;">
      <div id="enhanceHelper_minimizedStatus">等待强化结果...</div>
      <button id="enhanceHelper_expandBtn" style="
        padding:2px 6px; background:rgba(100,200,255,0.2); border:none; border-radius:3px;
        color:#64B5F6; cursor:pointer; font-size:10px; margin-left:8px;
      ">📋</button>
    </div>
    
    <div id="enhanceHelper_mainContent" style="display:${isMinimized ? 'none' : 'block'};">
      <!-- 主要内容区域：左右分布 -->
      <div style="display: flex; gap: 12px;">
        <!-- 左侧控制区 -->
        <div style="flex: 1; min-width: 220px;">
          <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; margin-bottom:8px;">
            <div style="font-size:10px; color:#aaa; margin-bottom:4px;">目标物品:</div>
            <div id="enhanceHelper_itemDisplay" style="color:#FFA726; font-weight:bold; min-height:16px;">
              等待强化结果...
            </div>
            <div id="enhanceHelper_protectMaterialDisplay" style="font-size:9px; color:#81C784; margin-top:4px; min-height:12px;">
              <!-- 保护材料信息 -->
            </div>
          </div>
          
          <div style="display:flex; gap:8px; margin-bottom:8px;">
            <label style="flex:1;">
              目标等级:
              <input id="enhanceHelper_targetInput" type="number" min="1" max="15" value="${TARGET_LEVEL}"
                     style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;">
            </label>
            <label style="flex:1;">
              间隔(ms):
              <input id="enhanceHelper_intervalInput" type="number" min="100" value="${ENHANCE_INTERVAL}"
                     style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;">
            </label>
          </div>
          
          <div style="display:flex; gap:8px; margin-bottom:8px;">
            <label style="flex:1;">
              批量次数:
              <input id="enhanceHelper_batchCountInput" type="number" min="1" max="99999999" value="${BATCH_COUNT}"
                     style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"
                     title="连续强化多少个物品到目标等级">
            </label>
            <div style="flex:1; font-size:10px; color:#aaa; padding:4px;">
              <div style="font-size:9px; color:#666;">剩余次数会自动减少</div>
              <div style="font-size:9px; color:#666;">1=单次强化</div>
            </div>
          </div>
          
          <div style="margin-bottom:8px;">
            <div style="font-size:10px; color:#aaa; margin-bottom:4px;">保护设置:</div>
            <div style="display:flex; gap:2px; margin-bottom:6px;">
              <button id="enhanceHelper_protectModeNone" class="protect-mode-btn" data-mode="none" style="
                flex:1; padding:4px 8px; font-size:10px; border:none; border-radius:4px;
                background:${PROTECT_MODE === 'none' ? 'rgba(244,67,54,0.3)' : 'rgba(255,255,255,0.1)'};
                color:${PROTECT_MODE === 'none' ? '#f44336' : '#aaa'}; cursor:pointer;
                border:${PROTECT_MODE === 'none' ? '1px solid #f44336' : '1px solid transparent'};
              ">不使用</button>
              <button id="enhanceHelper_protectModeItem" class="protect-mode-btn" data-mode="item" style="
                flex:1; padding:4px 8px; font-size:10px; border:none; border-radius:4px;
                background:${PROTECT_MODE === 'item' ? 'rgba(100,181,246,0.3)' : 'rgba(255,255,255,0.1)'};
                color:${PROTECT_MODE === 'item' ? '#64B5F6' : '#aaa'}; cursor:pointer;
                border:${PROTECT_MODE === 'item' ? '1px solid #64B5F6' : '1px solid transparent'};
              ">使用物品</button>
              <button id="enhanceHelper_protectModeEssence" class="protect-mode-btn" data-mode="essence" style="
                flex:1; padding:4px 8px; font-size:10px; border:none; border-radius:4px;
                background:${PROTECT_MODE === 'essence' ? 'rgba(129,199,132,0.3)' : 'rgba(255,255,255,0.1)'};
                color:${PROTECT_MODE === 'essence' ? '#81C784' : '#aaa'}; cursor:pointer;
                border:${PROTECT_MODE === 'essence' ? '1px solid #81C784' : '1px solid transparent'};
              ">使用精华</button>
            </div>
            <div style="display:flex; gap:8px;">
              <label style="flex:1;">
                保护等级:
                <input id="enhanceHelper_protectStartLevelInput" type="number" min="0" max="15" value="${PROTECT_START_LEVEL}"
                       style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"
                       title="从几级开始使用保护材料 (0=不使用)">
              </label>
              <div style="flex:1; font-size:10px; color:#aaa; padding:4px;">
                <div id="enhanceHelper_protectLevelHint">≥${PROTECT_START_LEVEL}级使用保护</div>
                <div style="font-size:9px; color:#666;">0=不使用保护</div>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom:8px;">
            <label style="display:flex; align-items:center; font-size:11px; color:#aaa; cursor:pointer; margin-bottom:4px;">
              <input id="enhanceHelper_enableHistoryCheckbox" type="checkbox" ${ENABLE_HISTORY_RECORDING ? 'checked' : ''}
                     style="margin-right:6px; transform:scale(0.9);">
              <span>📚 启用历史记录功能</span>
            </label>
            <label style="display:flex; align-items:center; font-size:11px; color:#aaa; cursor:pointer;">
              <input id="enhanceHelper_debugModeCheckbox" type="checkbox" ${DEBUG_MODE ? 'checked' : ''}
                     style="margin-right:6px; transform:scale(0.9);">
              <span>🐛 调试模式 (记录WS强化请求)</span>
            </label>
          </div>
          
          <button id="enhanceHelper_toggleBtn" style="
            width:100%; padding:10px;
            background:linear-gradient(45deg, #4CAF50, #45a049); color:white; border:none;
            border-radius:6px; cursor:pointer; font-size:13px; font-weight:bold;
            transition: all 0.3s ease;
          " disabled>🚀 开始强化</button>
          
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#aaa; margin-top:8px;">
            <span>状态: <span id="enhanceHelper_status" style="color:#FFA726;">待机中</span></span>
            <span id="enhanceHelper_counter">就绪</span>
          </div>
          
          <div style="display:flex; gap:6px; margin-top:6px;">
            <button id="enhanceHelper_historyBtn" style="
              flex:1; padding:6px;
              background:rgba(129,199,132,0.8); color:white; border:none;
              border-radius:4px; cursor:pointer; font-size:10px;
              transition: all 0.3s ease;
            ">📚 强化历史</button>
            <button id="enhanceHelper_weakKingBtn" style="
              flex:1; padding:6px;
              background:rgba(255,215,0,0.8); color:#000; border:none;
              border-radius:4px; cursor:pointer; font-size:10px;
              transition: all 0.3s ease;
              font-weight:bold;
            ">👑 弱化之王</button>
            <button id="enhanceHelper_clearDataBtn" style="
              flex:1; padding:6px;
              background:rgba(244,67,54,0.8); color:white; border:none;
              border-radius:4px; cursor:pointer; font-size:10px;
              transition: all 0.3s ease;
            ">🗑️ 清除数据</button>
          </div>
        </div>
        
        <!-- 右侧统计区 -->
        <div style="flex: 1; min-width: 220px;">
          <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; height: 100%;">
            <div style="font-size:10px; color:#aaa; margin-bottom:6px; display:flex; align-items:center;">
              <span>📊 强化统计</span>
            </div>
            <div id="enhanceHelper_statsDisplay" style="font-size:10px; color:#FFA726;">
              等待开始强化...
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // —— 创建历史记录面板 ——
  const historyPanel = document.createElement('div');
  historyPanel.id = 'enhanceHelperHistoryPanel';
  historyPanel.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 600px; max-height: 80vh; padding: 16px;
    background: rgba(25,35,45,0.98); color: #fff;
    font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
    border-radius: 12px; z-index: 10000;
    border: 1px solid rgba(100,200,255,0.4);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    display: none;
    overflow-y: auto;
  `;
  historyPanel.innerHTML = `
    <div style="display:flex; align-items:center; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
      <h3 style="margin:0; color:#64B5F6; font-size:16px;">📚 强化历史记录</h3>
      <button id="enhanceHelper_closeHistoryBtn" style="
        margin-left:auto; padding:4px 8px; background:rgba(244,67,54,0.8); color:white; border:none;
        border-radius:4px; cursor:pointer; font-size:11px;
      ">✕ 关闭</button>
    </div>
    
    <!-- 历史记录列表视图 -->
    <div id="enhanceHelper_historyListView" style="display:block;">
      <div style="margin-bottom:12px; text-align:right;">
        <button id="enhanceHelper_deleteAllHistoryBtn" style="
          padding:6px 12px; background:rgba(244,67,54,0.8); color:white; border:none;
          border-radius:4px; cursor:pointer; font-size:11px;
        ">🗑️ 删除全部历史记录</button>
      </div>
      <div id="enhanceHelper_historyList" style="max-height:50vh; overflow-y:auto;">
        <!-- 历史记录项目将在这里动态生成 -->
      </div>
    </div>
    
    <!-- 历史记录详情视图 -->
    <div id="enhanceHelper_historyDetailView" style="display:none;">
      <div style="margin-bottom:12px;">
        <button id="enhanceHelper_backToListBtn" style="
          padding:4px 8px; background:rgba(100,181,246,0.3); color:#64B5F6; border:1px solid #64B5F6;
          border-radius:4px; cursor:pointer; font-size:10px; margin-right:8px;
        ">← 返回列表</button>
        <span id="enhanceHelper_historyDetailTitle" style="color:#FFA726; font-weight:bold;"></span>
      </div>
      
      <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; margin-bottom:12px;">
        <div id="enhanceHelper_historyDetailStats" style="font-size:11px;">
          <!-- 详细统计信息将在这里显示 -->
        </div>
      </div>
      
      <div style="display:flex; gap:8px;">
        <button id="enhanceHelper_continueEnhanceBtn" style="
          flex:2; padding:8px; background:linear-gradient(45deg, #4CAF50, #45a049); color:white; border:none;
          border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold;
        ">🔄 继续强化</button>
        <button id="enhanceHelper_deleteRecordBtn" style="
          flex:1; padding:8px; background:linear-gradient(45deg, #f44336, #d32f2f); color:white; border:none;
          border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold;
        ">🗑️ 删除</button>
      </div>
    </div>
  `;
  document.body.appendChild(historyPanel);

  // —— 获取控制元素 ——
  const targetInput = document.getElementById('enhanceHelper_targetInput');
  const intervalInput = document.getElementById('enhanceHelper_intervalInput');
  const batchCountInput = document.getElementById('enhanceHelper_batchCountInput');
  const protectStartLevelInput = document.getElementById('enhanceHelper_protectStartLevelInput');
  const protectModeButtons = document.querySelectorAll('.protect-mode-btn');
  const enableHistoryCheckbox = document.getElementById('enhanceHelper_enableHistoryCheckbox');
  const debugCheckbox = document.getElementById('enhanceHelper_debugModeCheckbox');
  const toggleBtn = document.getElementById('enhanceHelper_toggleBtn');
  const statusSpan = document.getElementById('enhanceHelper_status');
  const itemDisplay = document.getElementById('enhanceHelper_itemDisplay');
  const protectMaterialDisplay = document.getElementById('enhanceHelper_protectMaterialDisplay');
  const protectLevelHint = document.getElementById('enhanceHelper_protectLevelHint');
  const counterSpan = document.getElementById('enhanceHelper_counter');
  const statsDisplay = document.getElementById('enhanceHelper_statsDisplay');
  const clearDataBtn = document.getElementById('enhanceHelper_clearDataBtn');
  const historyBtn = document.getElementById('enhanceHelper_historyBtn');
  const weakKingBtn = document.getElementById('enhanceHelper_weakKingBtn');

  // 历史记录面板相关元素
  const closeHistoryBtn = document.getElementById('enhanceHelper_closeHistoryBtn');
  const historyList = document.getElementById('enhanceHelper_historyList');
  const historyListView = document.getElementById('enhanceHelper_historyListView');
  const historyDetailView = document.getElementById('enhanceHelper_historyDetailView');
  const backToListBtn = document.getElementById('enhanceHelper_backToListBtn');
  const historyDetailTitle = document.getElementById('enhanceHelper_historyDetailTitle');
  const historyDetailStats = document.getElementById('enhanceHelper_historyDetailStats');
  const continueEnhanceBtn = document.getElementById('enhanceHelper_continueEnhanceBtn');
  const deleteRecordBtn = document.getElementById('enhanceHelper_deleteRecordBtn');
  const deleteAllHistoryBtn = document.getElementById('enhanceHelper_deleteAllHistoryBtn');

  // 收起/展开相关元素
  const titleBar = document.getElementById('enhanceHelper_titleBar');
  const minimizeBtn = document.getElementById('enhanceHelper_minimizeBtn');
  const expandBtn = document.getElementById('enhanceHelper_expandBtn');
  const mainContent = document.getElementById('enhanceHelper_mainContent');
  const minimizedBar = document.getElementById('enhanceHelper_minimizedBar');
  const minimizedStatus = document.getElementById('enhanceHelper_minimizedStatus');

  // —— 拖拽逻辑 ——
  (function makeDraggable(el) {
    let isDown = false, offsetX = 0, offsetY = 0, hasMoved = false;
    el.addEventListener('mousedown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
      isDown = true;
      hasMoved = false;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    });
    document.addEventListener('mousemove', e => {
      if (!isDown) return;
      hasMoved = true;
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
      el.style.right = 'auto'; // 拖拽时清除right定位
    });
    document.addEventListener('mouseup', () => {
      if (isDown && hasMoved) {
        // 只有真正拖拽过才应用边界检查
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const rightDistance = window.innerWidth - rect.right;
          const topDistance = rect.top;

          // 保存并应用边界约束后的位置
          const constrained = constrainPosition(rightDistance, topDistance);
          savePosition(constrained.x, constrained.y);

          // 重新设置为right定位
          el.style.right = constrained.x + 'px';
          el.style.top = constrained.y + 'px';
          el.style.left = 'auto';
        }, 0); // 使用setTimeout避免干扰点击事件
      }
      isDown = false;
      hasMoved = false;
    });
  })(panel);

  // —— 更新保护材料显示 ——
  function updateProtectDisplay() {
    let displayText = '';
    let statusColor = '#aaa';

    if (PROTECT_MODE === 'none') {
      displayText = '🛡️ 保护: 不使用';
      statusColor = '#f44336';
    } else if (PROTECT_START_LEVEL === 0) {
      displayText = `🛡️ 保护: ${PROTECT_MODE === 'essence' ? translateItemId('starEssence') : '物品'} <span style="color:#f44336;">(已禁用)</span>`;
      statusColor = '#f44336';
    } else {
      const protectType = PROTECT_MODE === 'essence' ? translateItemId('starEssence') : '当前物品-4级';
      displayText = `🛡️ 保护: ${protectType} <span style="color:#64B5F6;">(≥${PROTECT_START_LEVEL}级)</span>`;
      statusColor = '#64B5F6';
    }

    protectMaterialDisplay.innerHTML = displayText;
  }

  // —— 更新UI显示 ——
  function updateItemDisplay(itemInfo, customStatus = null) {
    if (itemInfo) {
      itemDisplay.textContent = translateItemId(itemInfo.resourceId); // 显示中文名称

      // 构建标题信息，包含用户和继续状态
      let titleText = `用户: ${itemInfo.user}`;
      if (isContinuedFromHistory) {
        titleText += ' | 🔄 从历史记录继续';
      }
      // 在title中显示原始英文ID，方便调试
      titleText += ` | 原始ID: ${itemInfo.resourceId}`;
      itemDisplay.title = titleText;

      toggleBtn.disabled = false;
      toggleBtn.style.opacity = '1';
      statusSpan.textContent = customStatus || (isContinuedFromHistory ? '继续就绪' : '就绪');
      statusSpan.style.color = customStatus === '已完成' ? '#4CAF50' : '#4CAF50';
      counterSpan.textContent = customStatus === '已完成' ? '完成' : (isContinuedFromHistory ? '继续' : '已捕获');
    } else {
      itemDisplay.textContent = '等待强化结果...';
      itemDisplay.title = '';
      toggleBtn.disabled = true;
      toggleBtn.style.opacity = '0.5';
      statusSpan.textContent = '等待中';
      statusSpan.style.color = '#FFA726';
      counterSpan.textContent = '就绪';
    }

    // 更新保护材料显示
    updateProtectDisplay();
    // 更新收起状态显示
    updateMinimizedDisplay();
  }

  // —— 更新统计显示 ——
  function updateStatsDisplay() {
    if (!enhanceStats.baseItem) {
      statsDisplay.innerHTML = '等待开始强化...';
      return;
    }

    const totalRate = enhanceStats.totalAttempts > 0 ?
      (enhanceStats.totalSuccess / enhanceStats.totalAttempts * 100).toFixed(1) : '0.0';

    let html = `
      <div style="margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="color:#64B5F6; font-weight:bold; margin-bottom:2px;">${translateItemId(enhanceStats.baseItem)}</div>
        <div style="font-size:11px; color:#FFA726;">
          进度: Lv${enhanceStats.currentLevel}/${enhanceStats.targetLevel} | 
          总计: ${enhanceStats.totalAttempts}次 (${totalRate}%)
        </div>
      </div>
    `;

    // 显示每级详细统计 - 每级一行，从高到低排序
    const levels = Object.keys(enhanceStats.levelStats).sort((a, b) => parseInt(b) - parseInt(a));
    if (levels.length > 0) {
      html += '<div>';
      levels.forEach(level => {
        const stats = enhanceStats.levelStats[level];
        const levelNum = parseInt(level);
        const targetLevelNum = levelNum + 1;
        const rate = stats.attempts > 0 ? (stats.success / stats.attempts * 100).toFixed(1) : '0.0';
        const targetLevel = levelNum + 1; // 目标等级 (Lv1, Lv2, etc.)
        const currentItemLevel = enhanceStats.currentLevel; // 当前物品等级
        const maxReachedLevel = enhanceStats.maxReachedLevel; // 历史最大等级

        // 确定显示样式
        let bgColor, textColor;
        if (targetLevel === currentItemLevel + 1) {
          // 当前正在强化的目标等级（蓝色）- 优先级最高
          bgColor = 'rgba(100,181,246,0.2)';
          textColor = '#64B5F6';
        } else if (targetLevel <= maxReachedLevel) {
          // 历史上到过的等级（绿色）
          bgColor = 'rgba(76,175,80,0.1)';
          textColor = '#81C784';
        } else {
          // 还没到过的等级（灰色）
          bgColor = 'transparent';
          textColor = '#666';
        }

        const displayText = `${stats.attempts}次 (${rate}%)`;

        html += `
          <div style="
            display:flex; justify-content:space-between; align-items:center;
            padding:2px 4px; margin:1px 0; border-radius:3px;
            background:${bgColor}; font-size:9px; color:${textColor};
          ">
            <span>Lv${targetLevelNum}</span>
            <span>${displayText}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    statsDisplay.innerHTML = html;
  }

  // —— 收起/展开功能 ——
  function toggleMinimize() {
    isMinimized = !isMinimized;

    if (isMinimized) {
      titleBar.style.display = 'none';
      mainContent.style.display = 'none';
      minimizedBar.style.display = 'flex';
      panel.style.width = '280px';
    } else {
      titleBar.style.display = 'flex';
      mainContent.style.display = 'block';
      minimizedBar.style.display = 'none';
      minimizeBtn.textContent = '📌';
      panel.style.width = '480px';
    }

    saveConfig();
    updateMinimizedDisplay();
  }

  // —— 更新收起状态显示 ——
  function updateMinimizedDisplay() {
    if (!isMinimized) return;

    let statusText = '等待强化结果...';

    if (currentEnhanceItem) {
      const itemInfo = parseItemLevel(currentEnhanceItem.resourceId);
      const translatedName = translateItemId(itemInfo.baseItem);
      const baseItem = translatedName.length > 15 ? translatedName.substring(0, 15) + '..' : translatedName;
      const currentLevel = itemInfo.level;

      if (isAutoEnhancing) {
        // 获取当前输入框的剩余次数
        const remainingCount = parseInt(batchCountInput.value, 10);
        const batchInfo = remainingCount > 1 ? ` [剩余${remainingCount}次]` : '';
        statusText = `🔨 ${baseItem} +${currentLevel} → +${TARGET_LEVEL}${batchInfo}`;
      } else {
        const status = enhanceStats.currentLevel >= enhanceStats.targetLevel ? '已完成' : '就绪';
        statusText = `${status}: ${baseItem} +${currentLevel}`;
        if (status === '已完成') {
          statusText = `✅ ${baseItem} +${currentLevel} 已完成`;
        }
      }
    }

    minimizedStatus.textContent = statusText;
  }

  // —— 更新保护模式按钮样式 ——
  function updateProtectModeButtons() {
    protectModeButtons.forEach(btn => {
      const mode = btn.dataset.mode;
      const isActive = mode === PROTECT_MODE;

      if (mode === 'none') {
        btn.style.background = isActive ? 'rgba(244,67,54,0.3)' : 'rgba(255,255,255,0.1)';
        btn.style.color = isActive ? '#f44336' : '#aaa';
        btn.style.border = isActive ? '1px solid #f44336' : '1px solid transparent';
      } else if (mode === 'item') {
        btn.style.background = isActive ? 'rgba(100,181,246,0.3)' : 'rgba(255,255,255,0.1)';
        btn.style.color = isActive ? '#64B5F6' : '#aaa';
        btn.style.border = isActive ? '1px solid #64B5F6' : '1px solid transparent';
      } else if (mode === 'essence') {
        btn.style.background = isActive ? 'rgba(129,199,132,0.3)' : 'rgba(255,255,255,0.1)';
        btn.style.color = isActive ? '#81C784' : '#aaa';
        btn.style.border = isActive ? '1px solid #81C784' : '1px solid transparent';
      }
    });
  }

  // —— 更新按钮状态 ——
  function updateToggleButtonState() {
    if (isAutoEnhancing) {
      toggleBtn.innerHTML = '⏹️ 停止强化';
      toggleBtn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
      statusSpan.textContent = '运行中';
      statusSpan.style.color = '#4CAF50';
      counterSpan.textContent = '活动中';
    } else {
      toggleBtn.innerHTML = '🚀 开始强化';
      toggleBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';

      if (enhanceStats.currentLevel >= enhanceStats.targetLevel && enhanceStats.baseItem) {
        statusSpan.textContent = '已完成';
        statusSpan.style.color = '#4CAF50';
        counterSpan.textContent = '完成';
      } else {
        statusSpan.textContent = '已停止';
        statusSpan.style.color = '#f44336';
        counterSpan.textContent = '就绪';
      }
    }
  }

  // —— 显示历史记录列表 ——
  function showHistoryList() {
    historyList.innerHTML = '';

    // 计算总记录数
    const totalRecords = Object.keys(enhanceHistory).reduce((total, baseItem) => {
      return total + (enhanceHistory[baseItem].sessions ? enhanceHistory[baseItem].sessions.length : 0);
    }, 0);

    // 控制删除全部按钮的显示和文本
    if (deleteAllHistoryBtn) {
      if (totalRecords > 0) {
        deleteAllHistoryBtn.style.display = 'inline-block';
        deleteAllHistoryBtn.textContent = `🗑️ 删除全部历史记录 (${totalRecords})`;
      } else {
        deleteAllHistoryBtn.style.display = 'none';
      }
    }

    if (Object.keys(enhanceHistory).length === 0) {
      historyList.innerHTML = `
        <div style="text-align:center; padding:20px; color:#888;">
          <div style="font-size:24px; margin-bottom:8px;">📝</div>
          <div>暂无强化历史记录</div>
          <div style="font-size:10px; margin-top:4px;">开始强化后会自动记录历史</div>
        </div>
      `;
      return;
    }

    // 按物品分组显示历史记录
    Object.keys(enhanceHistory).forEach(baseItem => {
      const itemHistory = enhanceHistory[baseItem];
      const sessions = itemHistory.sessions.sort((a, b) => b.endTime - a.endTime); // 按结束时间倒序

      if (sessions.length === 0) return;

      // 物品分组标题
      const itemGroupDiv = document.createElement('div');
      itemGroupDiv.style.cssText = `
        margin-bottom: 12px; padding: 8px; border-radius: 6px;
        background: rgba(100,181,246,0.1); border-left: 3px solid #64B5F6;
      `;
      itemGroupDiv.innerHTML = `
        <div style="font-weight:bold; color:#64B5F6; margin-bottom:6px;">${translateItemId(baseItem)}</div>
      `;

      // 会话列表
      sessions.forEach(session => {
        const sessionDiv = document.createElement('div');
        sessionDiv.style.cssText = `
          margin: 4px 0; padding: 8px; border-radius: 4px; cursor: pointer;
          background: rgba(255,255,255,0.05); border: 1px solid transparent;
          transition: all 0.2s ease;
        `;
        sessionDiv.addEventListener('mouseenter', () => {
          sessionDiv.style.background = 'rgba(255,255,255,0.1)';
          sessionDiv.style.borderColor = 'rgba(100,181,246,0.3)';
        });
        sessionDiv.addEventListener('mouseleave', () => {
          sessionDiv.style.background = 'rgba(255,255,255,0.05)';
          sessionDiv.style.borderColor = 'transparent';
        });

        const startDate = new Date(session.startTime);
        const endDate = new Date(session.endTime);
        const duration = Math.round((session.endTime - session.startTime) / 1000);
        const successRate = session.totalAttempts > 0 ? (session.totalSuccess / session.totalAttempts * 100).toFixed(1) : '0.0';

        sessionDiv.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="color:#FFA726; font-weight:bold;">+${session.startLevel} → +${session.endLevel}</span>
              <span style="color:#888; margin-left:8px; font-size:10px;">
                目标: +${session.targetLevel} | 最高: +${session.maxReachedLevel}
              </span>
            </div>
            <div style="text-align:right; font-size:10px; color:#aaa;">
              <div>${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}</div>
              <div>${session.totalAttempts}次 (${successRate}%) | ${duration}秒</div>
            </div>
          </div>
          <div style="margin-top:4px; font-size:10px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:${session.completed ? '#4CAF50' : '#FFA726'};">
              ${session.completed ? '✅ 已完成' : '⏸️ 未完成'}
            </span>
            ${DEBUG_MODE ? `<span style="color:#666; font-size:8px;">ID: ${session.recordId ? session.recordId.split('_')[0] : 'N/A'}</span>` : ''}
          </div>
        `;

        // 点击显示详情
        sessionDiv.addEventListener('click', () => {
          showHistoryDetail(baseItem, session);
        });

        itemGroupDiv.appendChild(sessionDiv);
      });

      historyList.appendChild(itemGroupDiv);
    });
  }

  // —— 显示历史记录详情 ——
  function showHistoryDetail(baseItem, session) {
    historyListView.style.display = 'none';
    historyDetailView.style.display = 'block';

    const startDate = new Date(session.startTime);
    const endDate = new Date(session.endTime);
    const duration = Math.round((session.endTime - session.startTime) / 1000);
    const totalRate = session.totalAttempts > 0 ? (session.totalSuccess / session.totalAttempts * 100).toFixed(1) : '0.0';

    historyDetailTitle.textContent = `${translateItemId(baseItem)} (+${session.startLevel} → +${session.endLevel})`;

    // 构建详细统计信息
    let statsHtml = `
      <div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="color:#64B5F6; font-weight:bold; margin-bottom:4px;">${translateItemId(baseItem)}</div>
        <div style="font-size:11px; color:#FFA726; margin-bottom:4px;">
          进度: +${session.startLevel} → +${session.endLevel} (目标: +${session.targetLevel})
        </div>
        <div style="font-size:10px; color:#aaa;">
          开始时间: ${startDate.toLocaleString()}<br/>
          结束时间: ${endDate.toLocaleString()}<br/>
          持续时间: ${duration}秒 | 总计: ${session.totalAttempts}次 (${totalRate}%)
          ${DEBUG_MODE && session.recordId ? `<br/>记录ID: ${session.recordId}` : ''}
        </div>
      </div>
    `;

    // 显示每级详细统计
    const levels = Object.keys(session.levelStats).sort((a, b) => parseInt(b) - parseInt(a));
    if (levels.length > 0) {
      statsHtml += '<div>';
      levels.forEach(level => {
        const stats = session.levelStats[level];
        const levelNum = parseInt(level);
        const targetLevel = levelNum + 1;
        const rate = stats.attempts > 0 ? (stats.success / stats.attempts * 100).toFixed(1) : '0.0';

        // 确定显示样式
        let bgColor, textColor;
        if (targetLevel === session.endLevel + 1) {
          // 当前等级（蓝色）
          bgColor = 'rgba(100,181,246,0.2)';
          textColor = '#64B5F6';
        } else if (targetLevel <= session.maxReachedLevel) {
          // 历史上到过的等级（绿色）
          bgColor = 'rgba(76,175,80,0.1)';
          textColor = '#81C784';
        } else {
          // 还没到过的等级（灰色）
          bgColor = 'transparent';
          textColor = '#666';
        }

        const displayText = `${stats.attempts}次 (${rate}%)`;

        statsHtml += `
          <div style="
            display:flex; justify-content:space-between; align-items:center;
            padding:2px 4px; margin:1px 0; border-radius:3px;
            background:${bgColor}; font-size:9px; color:${textColor};
          ">
            <span>Lv${targetLevel}</span>
            <span>${displayText}</span>
          </div>
        `;
      });
      statsHtml += '</div>';
    }

    historyDetailStats.innerHTML = statsHtml;

    // 存储当前查看的会话信息，供继续强化和删除使用
    continueEnhanceBtn.dataset.baseItem = baseItem;
    continueEnhanceBtn.dataset.sessionData = JSON.stringify(session);
    deleteRecordBtn.dataset.baseItem = baseItem;
    deleteRecordBtn.dataset.recordId = session.recordId;
  }

  // —— 从历史记录继续强化 ——
  function continueFromHistory(baseItem, sessionData) {
    // 如果正在自动强化，先停止
    if (isAutoEnhancing) {
      isAutoEnhancing = false;
      stopAutoEnhance();
    }

    // 设置当前强化物品为会话结束时的物品
    const itemId = sessionData.endLevel > 0 ? `${baseItem}+${sessionData.endLevel}` : baseItem;
    currentEnhanceItem = {
      resourceId: itemId,
      user: 'HistoryRestore'
    };

    // 保存当前物品
    saveCurrentItem();

    // 恢复目标等级（使用历史记录中的目标等级）
    TARGET_LEVEL = sessionData.targetLevel;
    targetInput.value = TARGET_LEVEL;

    // 初始化统计数据，继承历史记录ID
    initStats(itemId, TARGET_LEVEL, sessionData.recordId);

    // 直接使用历史数据替换当前统计（而不是累加）
    enhanceStats.maxReachedLevel = sessionData.maxReachedLevel;
    enhanceStats.totalAttempts = sessionData.totalAttempts;
    enhanceStats.totalSuccess = sessionData.totalSuccess;

    // 直接使用历史等级统计数据（而不是累加）
    Object.keys(sessionData.levelStats).forEach(level => {
      if (enhanceStats.levelStats[level]) {
        enhanceStats.levelStats[level].attempts = sessionData.levelStats[level].attempts;
        enhanceStats.levelStats[level].success = sessionData.levelStats[level].success;
      }
    });

    // 更新UI
    updateItemDisplay(currentEnhanceItem, '已从历史恢复');
    updateStatsDisplay();
    updateToggleButtonState();
    updateMinimizedDisplay();

    // 设置继续强化标记
    isContinuedFromHistory = true;

    // 关闭历史记录面板
    closeHistoryPanel();

    // 保存配置
    saveConfig();

    // Debug模式记录恢复信息
    if (DEBUG_MODE) {
      console.group('🔄 [强化助手] 从历史记录恢复强化');
      console.log('恢复信息:', {
        记录ID: sessionData.recordId,
        物品: itemId,
        目标等级: TARGET_LEVEL,
        恢复最高等级: sessionData.maxReachedLevel,
        恢复总尝试: sessionData.totalAttempts,
        恢复总成功: sessionData.totalSuccess,
        操作类型: '数据恢复（非累加）'
      });
      console.groupEnd();
    }
  }

  // —— 打开历史记录面板 ——
  function openHistoryPanel() {
    isHistoryPanelOpen = true;
    historyPanel.style.display = 'block';
    historyListView.style.display = 'block';
    historyDetailView.style.display = 'none';
    showHistoryList();
  }

  // —— 关闭历史记录面板 ——
  function closeHistoryPanel() {
    isHistoryPanelOpen = false;
    historyPanel.style.display = 'none';
  }

  // —— 删除单个历史记录 ——
  function deleteHistoryRecord(baseItem, recordId) {
    if (!enhanceHistory[baseItem] || !enhanceHistory[baseItem].sessions) {
      return false;
    }

    const sessionIndex = enhanceHistory[baseItem].sessions.findIndex(s => s.recordId === recordId);
    if (sessionIndex >= 0) {
      // 删除记录
      enhanceHistory[baseItem].sessions.splice(sessionIndex, 1);

      // 如果该物品没有更多记录，删除整个物品条目
      if (enhanceHistory[baseItem].sessions.length === 0) {
        delete enhanceHistory[baseItem];
      }

      // 保存到本地存储
      saveEnhanceHistory();

      // Debug模式记录删除操作
      if (DEBUG_MODE) {
        console.log('🗑️ [强化助手] 删除历史记录:', {
          物品: baseItem,
          记录ID: recordId,
          剩余记录数: enhanceHistory[baseItem] ? enhanceHistory[baseItem].sessions.length : 0
        });
      }

      return true;
    }

    return false;
  }

  // —— 删除全部历史记录 ——
  function deleteAllHistory() {
    const recordCount = Object.keys(enhanceHistory).reduce((total, baseItem) => {
      return total + (enhanceHistory[baseItem].sessions ? enhanceHistory[baseItem].sessions.length : 0);
    }, 0);

    // 清空历史记录
    enhanceHistory = {};

    // 保存到本地存储
    saveEnhanceHistory();

    // Debug模式记录删除操作
    if (DEBUG_MODE) {
      console.log('🗑️ [强化助手] 删除全部历史记录:', {
        删除记录数: recordCount,
        操作时间: new Date().toLocaleString()
      });
    }

    return recordCount;
  }

  // —— 双击标题栏重置位置 ——
  titleBar.addEventListener('dblclick', () => {
    const defaultPos = { x: 20, y: 20 };
    panel.style.right = defaultPos.x + 'px';
    panel.style.top = defaultPos.y + 'px';
    panel.style.left = 'auto';
    savePosition(defaultPos.x, defaultPos.y);

    // 显示重置提示
    const oldTitle = titleBar.querySelector('span').textContent;
    titleBar.querySelector('span').textContent = '🔄 位置已重置';
    setTimeout(() => {
      titleBar.querySelector('span').textContent = oldTitle;
    }, 1000);
  });

  // —— 事件监听器 ——
  targetInput.addEventListener('change', e => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v > 0 && v <= 15) {
      TARGET_LEVEL = v;
      saveConfig();
    }
  });

  intervalInput.addEventListener('change', e => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 100) {
      ENHANCE_INTERVAL = v;
      saveConfig();
    }
  });

  batchCountInput.addEventListener('change', e => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 1 && v <= 99) {
      BATCH_COUNT = v;
      saveConfig();
    }
  });

  protectStartLevelInput.addEventListener('change', e => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 0 && v <= 15) {
      PROTECT_START_LEVEL = v;
      saveConfig();
      updateProtectDisplay(); // 更新保护显示
      // 更新提示文本
      if (v === 0) {
        protectLevelHint.textContent = '不使用保护';
        protectLevelHint.style.color = '#f44336';
      } else {
        protectLevelHint.textContent = `≥${v}级使用保护`;
        protectLevelHint.style.color = '#aaa';
      }
    }
  });

  // 保护模式按钮事件监听器
  protectModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset.mode;
      if (newMode !== PROTECT_MODE) {
        PROTECT_MODE = newMode;
        saveConfig();
        updateProtectModeButtons();
        updateProtectDisplay();
      }
    });
  });

  enableHistoryCheckbox.addEventListener('change', e => {
    ENABLE_HISTORY_RECORDING = e.target.checked;
    saveConfig();

    // 更新历史记录按钮的可用状态
    historyBtn.disabled = !ENABLE_HISTORY_RECORDING;
    historyBtn.style.opacity = ENABLE_HISTORY_RECORDING ? '1' : '0.5';

    if (DEBUG_MODE) {
      console.log(`[强化助手] 历史记录功能已${ENABLE_HISTORY_RECORDING ? '启用' : '禁用'}`);
    }
  });

  debugCheckbox.addEventListener('change', e => {
    DEBUG_MODE = e.target.checked;
    saveConfig();
    console.log(`[强化助手] 调试模式已${DEBUG_MODE ? '开启' : '关闭'}`);
  });

  toggleBtn.addEventListener('click', () => {
    if (!isAutoEnhancing) {
      if (!currentEnhanceItem) {
        return; // 按钮应该是禁用状态
      }

      // 获取当前批量次数设置
      const inputBatchCount = parseInt(batchCountInput.value, 10);
      BATCH_COUNT = inputBatchCount;
      currentBatchCount = inputBatchCount;

      // 检查是否从历史记录继续强化
      if (!isContinuedFromHistory) {
        // 正常的新强化流程
        // 如果是批量强化（>1次），确保从基础物品开始
        if (inputBatchCount > 1) {
          const currentItemInfo = parseItemLevel(currentEnhanceItem.resourceId);
          const baseItemId = currentItemInfo.baseItem; // 基础物品ID，不包含+数字

          // 更新当前强化物品为基础版本
          currentEnhanceItem.resourceId = baseItemId;
          saveCurrentItem(); // 保存更新后的物品信息

          // 初始化统计数据（使用基础物品ID）
          initStats(baseItemId, TARGET_LEVEL);

          // Debug模式记录批量开始信息
          if (DEBUG_MODE) {
            console.group('🚀 [强化助手] 开始批量强化');
            console.log('批量设置:', {
              批量次数: inputBatchCount,
              基础物品ID: baseItemId,
              原物品ID: currentItemInfo.baseItem + (currentItemInfo.level > 0 ? '+' + currentItemInfo.level : ''),
              目标等级: TARGET_LEVEL,
              记录ID: currentEnhanceRecordId, // 显示生成的记录ID
              时间: new Date().toLocaleTimeString()
            });
            console.groupEnd();
          }
        } else {
          // 单次强化，使用当前物品
          initStats(currentEnhanceItem.resourceId, TARGET_LEVEL);
          
          // Debug模式记录单次强化开始信息
          if (DEBUG_MODE) {
            console.group('🚀 [强化助手] 开始单次强化');
            console.log('强化设置:', {
              物品ID: currentEnhanceItem.resourceId,
              目标等级: TARGET_LEVEL,
              记录ID: currentEnhanceRecordId, // 显示生成的记录ID
              时间: new Date().toLocaleTimeString()
            });
            console.groupEnd();
          }
        }

        updateStatsDisplay();
      } else {
        // 从历史记录继续强化，不重新初始化统计数据
        // 重置继续强化标记
        isContinuedFromHistory = false;

        // Debug模式记录继续强化信息
        if (DEBUG_MODE) {
          console.group('🔄 [强化助手] 继续历史强化');
          console.log('继续信息:', {
            物品ID: currentEnhanceItem.resourceId,
            记录ID: currentEnhanceRecordId,
            当前等级: enhanceStats.currentLevel,
            目标等级: enhanceStats.targetLevel,
            已有尝试: enhanceStats.totalAttempts,
            时间: new Date().toLocaleTimeString()
          });
          console.groupEnd();
        }
      }

      // 开始自动强化
      isAutoEnhancing = true;
      updateToggleButtonState();
      updateMinimizedDisplay();

      if (unsafeWindow.currentWS) {
        startAutoEnhance(unsafeWindow.currentWS);
      }
    } else {
      // 停止自动强化
      isAutoEnhancing = false;
      stopAutoEnhance();
      updateToggleButtonState();
      updateMinimizedDisplay();

      // 注意：这里不重置继续强化标记和上次强化记录
      // 因为手动停止后，用户可能想要继续强化同一物品
    }
  });

  // —— 收起/展开按钮事件 ——
  minimizeBtn.addEventListener('click', toggleMinimize);
  expandBtn.addEventListener('click', toggleMinimize);

  // —— 清除数据按钮事件 ——
  clearDataBtn.addEventListener('click', () => {
    if (confirm('确定要清除所有保存的数据吗？这将清除当前强化物品和请求数据。')) {
      // 清除内存中的数据
      currentEnhanceItem = null;
      storedEnhanceData = null;
      currentBatchCount = 0; // 重置批量次数
      isContinuedFromHistory = false; // 重置继续强化标记
      lastEnhanceBaseItem = null; // 清除上次强化的基础物品记录

      // 重置批量次数输入框
      batchCountInput.value = 1;
      BATCH_COUNT = 1;

      // 清除本地存储
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ITEM);
      localStorage.removeItem(STORAGE_KEYS.STORED_REQUEST);

      // 重置UI
      updateItemDisplay(null);
      updateProtectDisplay();

      // 如果正在强化，停止强化
      if (isAutoEnhancing) {
        isAutoEnhancing = false;
        stopAutoEnhance();
        updateToggleButtonState();
      }

      // 更新收起状态显示
      updateMinimizedDisplay();

      // 保存配置
      saveConfig();
    }
  });

  // —— 历史记录按钮事件 ——
  historyBtn.addEventListener('click', () => {
    if (!ENABLE_HISTORY_RECORDING) {
      alert('历史记录功能已禁用，请先启用历史记录功能！');
      return;
    }
    openHistoryPanel();
  });

  // —— 弱化之王按钮事件 ——
  weakKingBtn.addEventListener('click', () => {
    if (!checkPermissions()) {
      alert('弱化之王功能需要网络权限！\n\n请确保：\n1. 油猴脚本已正确安装\n2. @grant GM_xmlhttpRequest 权限已配置\n3. @connect 域名权限已设置\n\n如果问题持续，请重新安装脚本。');
      return;
    }
    openWeakKingPanel();
  });

  // —— 历史记录面板事件监听器 ——
  closeHistoryBtn.addEventListener('click', () => {
    closeHistoryPanel();
  });

  backToListBtn.addEventListener('click', () => {
    historyListView.style.display = 'block';
    historyDetailView.style.display = 'none';
  });

  continueEnhanceBtn.addEventListener('click', () => {
    const baseItem = continueEnhanceBtn.dataset.baseItem;
    const sessionData = JSON.parse(continueEnhanceBtn.dataset.sessionData);
    continueFromHistory(baseItem, sessionData);
  });

  // —— 删除单个记录按钮事件 ——
  deleteRecordBtn.addEventListener('click', () => {
    const baseItem = deleteRecordBtn.dataset.baseItem;
    const recordId = deleteRecordBtn.dataset.recordId;

    if (!baseItem || !recordId) {
      alert('无法获取记录信息，删除失败！');
      return;
    }

    // 检查是否正在删除当前强化的记录
    let warningMessage = `确定要删除这条强化记录吗？\n\n物品: ${baseItem}\n记录ID: ${recordId}`;
    if (currentEnhanceRecordId === recordId) {
      warningMessage += '\n\n⚠️ 警告：这是当前正在强化的记录！';
    }
    warningMessage += '\n\n此操作无法撤销！';

    if (confirm(warningMessage)) {
      const success = deleteHistoryRecord(baseItem, recordId);
      if (success) {
        // 删除成功，返回列表页面并刷新
        historyListView.style.display = 'block';
        historyDetailView.style.display = 'none';
        showHistoryList();

        // 显示删除成功提示
        const oldTitle = historyPanel.querySelector('h3').textContent;
        historyPanel.querySelector('h3').textContent = '✅ 记录已删除';
        historyPanel.querySelector('h3').style.color = '#4CAF50';
        setTimeout(() => {
          historyPanel.querySelector('h3').textContent = oldTitle;
          historyPanel.querySelector('h3').style.color = '#64B5F6';
        }, 2000);
      } else {
        alert('删除失败，记录不存在或已被删除！');
      }
    }
  });

  // —— 删除全部历史记录按钮事件 ——
  deleteAllHistoryBtn.addEventListener('click', () => {
    const recordCount = Object.keys(enhanceHistory).reduce((total, baseItem) => {
      return total + (enhanceHistory[baseItem].sessions ? enhanceHistory[baseItem].sessions.length : 0);
    }, 0);

    if (recordCount === 0) {
      alert('没有历史记录可以删除！');
      return;
    }

    if (confirm(`确定要删除全部 ${recordCount} 条强化历史记录吗？\n\n此操作将清除所有物品的强化历史，无法撤销！`)) {
      const deletedCount = deleteAllHistory();

      // 刷新列表显示
      showHistoryList();

      // 显示删除成功提示
      const oldTitle = historyPanel.querySelector('h3').textContent;
      historyPanel.querySelector('h3').textContent = `✅ 已删除 ${deletedCount} 条记录`;
      historyPanel.querySelector('h3').style.color = '#4CAF50';
      setTimeout(() => {
        historyPanel.querySelector('h3').textContent = oldTitle;
        historyPanel.querySelector('h3').style.color = '#64B5F6';
      }, 3000);
    }
  });

  // —— 拦截全局 WebSocket（增强助手命名空间） ——
  const NativeWS = unsafeWindow.WebSocket;

  // 检查是否已经被其他脚本拦截
  if (!unsafeWindow.WebSocket.__enhanceHelperIntercepted) {
    const OriginalWebSocket = unsafeWindow.WebSocket;

    unsafeWindow.WebSocket = function (url, protocols) {
      const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

      // 保存当前WebSocket实例
      unsafeWindow.currentWS = ws;

      // —— 拦截 send ——
      const originalSend = ws.send;
      ws.__originalSend = originalSend; // 保存原始方法供自动强化使用
      ws.send = function (data) {
        // 检查是否为强化请求
        if (isEnhanceRequest(data)) {
          const enhanceData = parseEnhanceData(data);
          if (enhanceData && enhanceData.fullPayload) {
            // 储存完整的强化数据供后续自动使用
            storedEnhanceData = enhanceData.fullPayload;
            saveStoredRequest(); // 保存到本地存储
            updateProtectDisplay(); // 更新保护材料显示

            // 保存用户名到本地存储
            if (enhanceData.user && !savedUserName) {
              savedUserName = enhanceData.user;
              saveConfig(); // 保存用户名到本地存储
            }

            // 检测到手动强化指令，如果批量次数为0，设为1
            if (currentBatchCount === 0) {
              currentBatchCount = 1;
              batchCountInput.value = 1;
              BATCH_COUNT = 1;
              saveConfig(); // 保存批量次数
              updateMinimizedDisplay(); // 更新收起状态显示
            }

            // Debug模式记录强化请求保存
            if (DEBUG_MODE) {
              console.group('💾 [强化助手] 保存强化请求数据');
              console.log('原始数据:', data);
              console.log('保存的完整数据:', storedEnhanceData);
              console.log('解析结果:', {
                物品ID: enhanceData.resourceId,
                保护材料ID: enhanceData.protectedResourceId || '无',
                用户: enhanceData.user,
                批量次数设置: currentBatchCount,
                时间: new Date().toLocaleTimeString()
              });
              console.groupEnd();
            }
          }

          // Debug模式记录强化请求拦截
          if (DEBUG_MODE) {
            console.group('🔨 [强化助手] 拦截到强化请求');
            console.log('原始数据:', data);
            if (enhanceData) {
              console.log('解析结果:', {
                物品ID: enhanceData.resourceId,
                保护材料ID: enhanceData.protectedResourceId || '无',
                用户: enhanceData.user,
                时间: new Date().toLocaleTimeString()
              });
            }
            console.groupEnd();
          }
        }

        // 正常发送原始请求，不影响游戏运行
        originalSend.call(this, data);
      };

      // —— 拦截接收消息并解压 ——
      // 保存原始的 onmessage 处理器（如果存在）
      const originalOnMessage = ws.onmessage;
      
      // 添加我们的消息监听器（不会替换游戏的处理器）
      // 使用 capture 阶段监听，确保不干扰游戏的正常消息处理
      ws.addEventListener('message', ev => {
        // 只处理二进制数据（压缩的消息）
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

            // 检查是否为强化结果（只在有当前强化物品时才处理）
            const enhanceResult = parseEnhanceResult(text);
            if (enhanceResult && (currentEnhanceItem || isAutoEnhancing)) {
              // Debug模式记录强化结果
              if (DEBUG_MODE) {
                console.group('✨ [强化助手] 拦截到强化结果');
                console.log('原始数据:', text);
                console.log('解析结果:', {
                  成功: enhanceResult.success,
                  消息: enhanceResult.message,
                  结果物品ID: enhanceResult.resultId,
                  用户: enhanceResult.user,
                  时间: new Date().toLocaleTimeString()
                });
                // 如果有保存的请求数据，也显示相关信息
                if (storedEnhanceData && storedEnhanceData.data) {
                  console.log('关联的请求信息:', {
                    原始物品ID: storedEnhanceData.data.resourceId,
                    保护材料ID: storedEnhanceData.data.protectedResourceId || '无'
                  });
                }
                console.groupEnd();
              }

              // 异步处理强化结果，避免阻塞游戏的消息处理
              // 使用更长的延迟，确保游戏先处理完消息
              setTimeout(() => {
                try {
                  handleEnhanceResult(enhanceResult);
                } catch (error) {
                  if (DEBUG_MODE) {
                    console.error('[强化助手] 异步处理强化结果时发生错误:', error);
                  }
                }
              }, 50); // 增加延迟到50ms，让游戏有足够时间处理消息
            }
          } catch (err) {
            // 解压失败，忽略
            if (DEBUG_MODE) {
              console.warn('[强化助手] 消息解压失败:', err);
            }
          }
        }
        
        // 注意：不阻止事件传播，让游戏的原始处理器也能处理消息
      });

      // WebSocket关闭时清理
      ws.addEventListener('close', () => {
        if (isAutoEnhancing) {
          stopAutoEnhance();
          isAutoEnhancing = false;
          updateToggleButtonState();
          statusSpan.textContent = '连接断开';
          statusSpan.style.color = '#f44336';
          counterSpan.textContent = '离线';
          updateMinimizedDisplay();

          // 连接断开时重置继续强化标记和上次强化记录
          isContinuedFromHistory = false;
          lastEnhanceBaseItem = null;
        }
      });

      return ws;
    };

    // 继承原型与静态属性
    unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
    Object.getOwnPropertyNames(OriginalWebSocket).forEach(prop => {
      if (!(prop in unsafeWindow.WebSocket)) {
        unsafeWindow.WebSocket[prop] = OriginalWebSocket[prop];
      }
    });

    // 标记已被强化助手拦截
    unsafeWindow.WebSocket.__enhanceHelperIntercepted = true;
  }

  // —— 窗口大小改变时检查面板位置 ——
  window.addEventListener('resize', () => {
    const rect = panel.getBoundingClientRect();
    const rightDistance = window.innerWidth - rect.right;
    const topDistance = rect.top;

    // 检查并应用边界约束
    const constrained = constrainPosition(rightDistance, topDistance);

    // 如果位置需要调整，立即应用
    if (constrained.x !== rightDistance || constrained.y !== topDistance) {
      panel.style.right = constrained.x + 'px';
      panel.style.top = constrained.y + 'px';
      panel.style.left = 'auto';
      savePosition(constrained.x, constrained.y);
    }
  });

  // —— 数据库服务类 ——
  class SupabaseService {
    constructor(config) {
      this.url = config.url;
      this.key = config.key;
      this.headers = {
        'apikey': config.key,
        'Authorization': `Bearer ${config.key}`,
        'Content-Type': 'application/json'
      };
    }

    /**
     * 执行HTTP请求的通用方法
     */
    _request(method, url, options = {}) {
      return new Promise((resolve, reject) => {
        // 检查是否有 GM_xmlhttpRequest 可用
        if (typeof GM_xmlhttpRequest !== 'undefined') {
          const requestConfig = {
            method: method,
            url: url,
            headers: { ...this.headers, ...options.headers },
            onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                try {
                  const data = response.responseText ? JSON.parse(response.responseText) : null;
                  resolve(data);
                } catch (e) {
                  reject(new Error('解析响应数据失败: ' + e.message));
                }
              } else {
                reject(new Error(`HTTP ${response.status}: ${response.responseText}`));
              }
            },
            onerror: (error) => reject(new Error('网络请求失败: ' + error.message))
          };

          if (options.data) {
            requestConfig.data = JSON.stringify(options.data);
          }

          GM_xmlhttpRequest(requestConfig);
        } else {
          // 备用方案：使用 fetch (可能受到 CORS 限制)
          const fetchOptions = {
            method: method,
            headers: { ...this.headers, ...options.headers }
          };

          if (options.data) {
            fetchOptions.body = JSON.stringify(options.data);
          }

          fetch(url, fetchOptions)
            .then(response => {
              if (response.ok) {
                return response.text();
              } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
            })
            .then(text => {
              try {
                const data = text ? JSON.parse(text) : null;
                resolve(data);
              } catch (e) {
                reject(new Error('解析响应数据失败: ' + e.message));
              }
            })
            .catch(error => {
              reject(new Error(`网络请求失败: ${error.message}. 请确保油猴脚本权限配置正确。`));
            });
        }
      });
    }

    /**
     * 构建查询URL参数
     */
    _buildQueryParams(options) {
      const params = new URLSearchParams();

      if (options.select) params.append('select', options.select);
      if (options.eq) {
        Object.entries(options.eq).forEach(([key, value]) => {
          params.append(key, `eq.${value}`);
        });
      }
      if (options.limit) params.append('limit', options.limit);
      if (options.order) params.append('order', options.order);
      if (options.offset) params.append('offset', options.offset);

      return params.toString();
    }

    /**
     * 查询数据
     */
    async select(table, options = {}) {
      let url = `${this.url}/rest/v1/${table}`;

      const queryParams = this._buildQueryParams(options);
      if (queryParams) {
        url += '?' + queryParams;
      }

      return await this._request('GET', url);
    }

    /**
     * 插入数据
     */
    async insert(table, data) {
      const url = `${this.url}/rest/v1/${table}`;
      const headers = { 'Prefer': 'return=representation' };

      return await this._request('POST', url, { data, headers });
    }

    /**
     * 更新数据
     */
    async update(table, data, conditions) {
      let url = `${this.url}/rest/v1/${table}`;

      if (conditions) {
        const params = new URLSearchParams();
        Object.entries(conditions).forEach(([key, value]) => {
          params.append(key, `eq.${value}`);
        });
        url += '?' + params.toString();
      }

      const headers = { 'Prefer': 'return=representation' };
      return await this._request('PATCH', url, { data, headers });
    }

    /**
     * UPSERT操作 - 插入或更新数据，避免409冲突
     * @param {string} table - 表名
     * @param {Object} data - 要插入/更新的数据
     * @param {string|Array} onConflict - 冲突检测的列名（字符串或数组）
     * @param {Object} options - 额外选项
     * @returns {Promise<Array>} 操作结果
     */
    async upsert(table, data, onConflict = null, options = {}) {
      const url = `${this.url}/rest/v1/${table}`;
      
      // 构建请求头 - 使用正确的Supabase UPSERT语法
      const headers = { 
        'Prefer': 'resolution=merge-duplicates,return=representation',
        'Content-Type': 'application/json'
      };

      // 构建请求体
      const requestBody = data;

      // 构建URL参数
      const params = new URLSearchParams();
      
      // 如果指定了冲突列，添加到URL参数中
      if (onConflict) {
        const conflictStr = Array.isArray(onConflict) ? onConflict.join(',') : onConflict;
        params.append('on_conflict', conflictStr);
      }

      let requestUrl = url;
      if (params.toString()) {
        requestUrl += '?' + params.toString();
      }

      // 使用POST方法进行UPSERT
      try {
        return await this._request('POST', requestUrl, { data: requestBody, headers });
      } catch (error) {
        // 如果遇到409冲突，尝试使用更新操作作为后备方案
        if (error.message.includes('409') || error.message.includes('duplicate key')) {
          console.warn('[SupabaseService] UPSERT失败，尝试更新操作作为后备方案...');
          
          // 构建更新条件
          const conditions = {};
          const conflictCols = Array.isArray(onConflict) ? onConflict : (onConflict ? [onConflict] : []);
          conflictCols.forEach(col => {
            if (data[col] !== undefined) {
              conditions[col] = data[col];
            }
          });
          
          // 如果没有冲突列信息，无法构建更新条件
          if (Object.keys(conditions).length === 0) {
            throw new Error('无法执行更新操作：缺少冲突列信息');
          }
          
          return await this.update(table, data, conditions);
        }
        throw error;
      }
    }
  }

  // —— 创建数据库服务实例 ——
  const supabaseService = new SupabaseService(SUPABASE_CONFIG);

  // —— 检查权限配置 ——
  function checkPermissions() {
    if (typeof GM_xmlhttpRequest === 'undefined') {
      console.warn('[强化助手] GM_xmlhttpRequest 不可用，弱化之王功能可能受限');
      console.warn('[强化助手] 请确保油猴脚本的 @grant GM_xmlhttpRequest 权限已正确配置');
      return false;
    }
    return true;
  }

  // —— 弱化之王功能 ——
  let weakKingPanel = null;
  let isWeakKingPanelOpen = false;

  // —— 创建弱化之王面板 ——
  function createWeakKingPanel() {
    weakKingPanel = document.createElement('div');
    weakKingPanel.id = 'enhanceHelper_weakKingPanel';
    weakKingPanel.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 500px; max-height: 80vh; padding: 16px;
      background: rgba(25,35,45,0.98); color: #fff;
      font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
      border-radius: 12px; z-index: 10001;
      border: 1px solid rgba(255,215,0,0.4);
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      display: none;
      overflow-y: auto;
    `;
    weakKingPanel.innerHTML = `
      <div style="display:flex; align-items:center; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid rgba(255,215,0,0.3);">
        <h3 style="margin:0; color:#FFD700; font-size:16px;">👑 弱化之王排行榜</h3>
        <button id="enhanceHelper_closeWeakKingBtn" style="
          margin-left:auto; padding:4px 8px; background:rgba(244,67,54,0.8); color:white; border:none;
          border-radius:4px; cursor:pointer; font-size:11px;
        ">✕ 关闭</button>
      </div>
      
      <div style="text-align:center; margin-bottom:12px; padding:8px; background:rgba(255,215,0,0.05); border-radius:6px; border:1px solid rgba(255,215,0,0.2);">
        <div style="color:#FFD700; font-size:11px; font-style:italic;">
          "即使土豆早已发芽，也请您成为弱化之王"
        </div>
      </div>
      
      <div id="enhanceHelper_weakKingContent">
        <div style="text-align:center; padding:20px; color:#888;">
          <div style="font-size:24px; margin-bottom:8px;">👑</div>
          <div>请先选择一个强化物品</div>
        </div>
      </div>
    `;
    document.body.appendChild(weakKingPanel);

    // 绑定关闭按钮事件
    document.getElementById('enhanceHelper_closeWeakKingBtn').addEventListener('click', closeWeakKingPanel);
  }

  // —— 打开弱化之王面板 ——
  function openWeakKingPanel() {
    if (!weakKingPanel) {
      createWeakKingPanel();
    }

    isWeakKingPanelOpen = true;
    weakKingPanel.style.display = 'block';
    loadWeakKingData();
  }

  // —— 关闭弱化之王面板 ——
  function closeWeakKingPanel() {
    isWeakKingPanelOpen = false;
    if (weakKingPanel) {
      weakKingPanel.style.display = 'none';
    }
  }

  // —— 加载弱化之王数据 ——
  async function loadWeakKingData() {
    const contentEl = document.getElementById('enhanceHelper_weakKingContent');

    if (!currentEnhanceItem) {
      contentEl.innerHTML = `
        <div style="text-align:center; padding:20px; color:#888;">
          <div style="font-size:24px; margin-bottom:8px;">👑</div>
          <div>请先选择一个强化物品</div>
        </div>
      `;
      return;
    }

    // 构造查询的物品名称（基础物品名 + 目标等级）
    const currentItemInfo = parseItemLevel(currentEnhanceItem.resourceId);
    const targetItemName = `${currentItemInfo.baseItem}+${TARGET_LEVEL}`;

    contentEl.innerHTML = `
      <div style="text-align:center; padding:20px; color:#FFA726;">
        <div style="font-size:20px; margin-bottom:8px;">🔍</div>
        <div>正在查询 ${translateItemId(targetItemName)} 的排行榜数据...</div>
      </div>
    `;

    try {
      // 查询数据库中该物品的记录（按次数降序排列，次数越高排名越前）
      const records = await supabaseService.select(TABLE_NAME, {
        eq: { item_name: targetItemName },
        order: 'enhance_num.desc'
      });

      // 获取当前用户的强化统计
      const currentUserName = savedUserName || (currentEnhanceItem.user || 'Unknown');
      const currentAttempts = enhanceStats.totalAttempts || 0;

      displayWeakKingResults(targetItemName, records, currentUserName, currentAttempts);

    } catch (error) {
      contentEl.innerHTML = `
        <div style="text-align:center; padding:20px; color:#f44336;">
          <div style="font-size:24px; margin-bottom:8px;">❌</div>
          <div>查询失败: ${error.message}</div>
          <div style="font-size:10px; margin-top:8px; color:#888;">请检查网络连接或数据库配置</div>
        </div>
      `;
    }
  }

  // —— 显示弱化之王结果 ——
  function displayWeakKingResults(targetItemName, records, currentUserName, currentAttempts) {
    const contentEl = document.getElementById('enhanceHelper_weakKingContent');

    let html = `
      <div style="margin-bottom:16px; padding:12px; background:rgba(255,215,0,0.1); border-radius:8px; border:1px solid rgba(255,215,0,0.3);">
        <div style="color:#FFD700; font-weight:bold; margin-bottom:4px;">🎯 目标物品: ${translateItemId(targetItemName)}</div>
        <div style="color:#aaa; font-size:11px;">当前用户: ${currentUserName} | 当前尝试次数: ${currentAttempts}</div>
      </div>
    `;

    if (records.length === 0) {
      html += `
        <div style="text-align:center; padding:20px; color:#888;">
          <div style="font-size:24px; margin-bottom:8px;">🏆</div>
          <div>暂无 ${translateItemId(targetItemName)} 的弱化记录</div>
          <div style="font-size:10px; margin-top:8px; color:#666;">成为第一个弱化之王！</div>
        </div>
      `;

      // 如果有尝试次数，显示上传按钮
      if (currentAttempts > 0) {
        html += `
          <div style="text-align:center; margin-top:16px;">
            <button id="enhanceHelper_uploadWeakKingBtn" style="
              padding:10px 20px; background:linear-gradient(45deg, #FFD700, #FFA000); color:#000; border:none;
              border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold;
            ">👑 上传我的记录 (${currentAttempts}次)</button>
          </div>
        `;
      }
    } else {
      // 显示弱化排行榜（次数越高越厉害）
      const bestRecord = records[0];
      const canUpload = currentAttempts > 0 && currentAttempts > bestRecord.enhance_num;

      html += `
        <div style="margin-bottom:16px;">
          <h4 style="margin:0 0 8px 0; color:#FFD700;">🏆 弱化之王排行榜</h4>
          <div style="background:rgba(255,215,0,0.05); border-radius:6px; padding:8px;">
      `;

      records.forEach((record, index) => {
        const isCurrentUser = record.player_name === currentUserName;
        const rankIcon = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `${index + 1}.`));

        html += `
          <div style="
            display:flex; justify-content:space-between; align-items:center; padding:6px 8px;
            margin:2px 0; border-radius:4px;
            background:${isCurrentUser ? 'rgba(100,181,246,0.2)' : 'transparent'};
            border-left:${isCurrentUser ? '3px solid #64B5F6' : 'none'};
          ">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:14px;">${rankIcon}</span>
              <span style="color:${isCurrentUser ? '#64B5F6' : '#fff'}; font-weight:${isCurrentUser ? 'bold' : 'normal'};">
                ${record.player_name}${isCurrentUser ? ' (我)' : ''}
              </span>
            </div>
            <div style="color:#FFA726; font-weight:bold;">${record.enhance_num}次</div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      // 显示自己的统计
      html += `
        <div style="margin-bottom:16px; padding:12px; background:rgba(100,181,246,0.1); border-radius:8px; border:1px solid rgba(100,181,246,0.3);">
          <div style="color:#64B5F6; font-weight:bold; margin-bottom:4px;">📊 我的统计</div>
          <div style="color:#aaa; font-size:11px;">
            当前尝试次数: <span style="color:#FFA726; font-weight:bold;">${currentAttempts}次</span>
          </div>
          <div style="color:#aaa; font-size:11px; margin-top:2px;">
            当前弱化之王: <span style="color:#FFD700; font-weight:bold;">${bestRecord.enhance_num}次</span> (${bestRecord.player_name})
          </div>
        </div>
      `;

      // 如果可以上传，显示上传按钮
      if (canUpload) {
        html += `
          <div style="text-align:center; margin-top:16px;">
            <div style="margin-bottom:8px; color:#4CAF50; font-size:11px;">
              🎉 恭喜！你超越了当前弱化之王！
            </div>
            <button id="enhanceHelper_uploadWeakKingBtn" style="
              padding:10px 20px; background:linear-gradient(45deg, #4CAF50, #45a049); color:white; border:none;
              border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold;
            ">👑 更新弱化之王记录 (${currentAttempts}次)</button>
          </div>
        `;
      } else if (currentAttempts > 0) {
        html += `
          <div style="text-align:center; margin-top:16px; color:#888; font-size:11px;">
            还需要努力哦！目标: 超过 ${bestRecord.enhance_num} 次成为弱化之王
          </div>
        `;
      }
    }

    contentEl.innerHTML = html;

    // 绑定上传按钮事件
    const uploadBtn = document.getElementById('enhanceHelper_uploadWeakKingBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => uploadWeakKingRecord(targetItemName, currentUserName, currentAttempts));
    }
  }

  // —— 上传弱化之王记录 ——
  async function uploadWeakKingRecord(itemName, playerName, attempts) {
    const uploadBtn = document.getElementById('enhanceHelper_uploadWeakKingBtn');
    if (!uploadBtn) return;

    const originalText = uploadBtn.textContent;
    uploadBtn.disabled = true;
    uploadBtn.textContent = '上传中...';

    // 添加防重复提交保护
    const uploadKey = `${itemName}_${playerName}_${attempts}`;
    const lastUploadKey = uploadBtn.dataset.lastUpload;
    if (lastUploadKey === uploadKey) {
      uploadBtn.disabled = false;
      uploadBtn.textContent = originalText;
      return;
    }
    uploadBtn.dataset.lastUpload = uploadKey;

    try {
      // 先查询是否已存在记录
      const existingRecords = await supabaseService.select(TABLE_NAME, {
        eq: {
          item_name: itemName,
          player_name: playerName
        }
      });

      let result;
      if (existingRecords && existingRecords.length > 0) {
        // 记录已存在，执行更新操作
        result = await supabaseService.update(TABLE_NAME, {
          enhance_num: attempts
        }, {
          item_name: itemName,
          player_name: playerName
        });
        
        // Debug模式记录更新操作
        if (DEBUG_MODE) {
          console.group('👑 [强化助手] 弱化之王记录更新');
          console.log('更新结果:', {
            物品: itemName,
            玩家: playerName,
            尝试次数: attempts,
            操作类型: '更新现有记录',
            操作结果: result ? '成功' : '未知',
            时间: new Date().toLocaleString()
          });
          console.groupEnd();
        }
      } else {
        // 记录不存在，执行插入操作
        result = await supabaseService.insert(TABLE_NAME, {
          item_name: itemName,
          player_name: playerName,
          enhance_num: attempts
        });
        
        // Debug模式记录插入操作
        if (DEBUG_MODE) {
          console.group('👑 [强化助手] 弱化之王记录插入');
          console.log('插入结果:', {
            物品: itemName,
            玩家: playerName,
            尝试次数: attempts,
            操作类型: '插入新记录',
            操作结果: result ? '成功' : '未知',
            时间: new Date().toLocaleString()
          });
          console.groupEnd();
        }
      }

      // 显示成功提示
      const oldTitle = weakKingPanel.querySelector('h3').textContent;
      weakKingPanel.querySelector('h3').textContent = '✅ 记录上传成功！';
      weakKingPanel.querySelector('h3').style.color = '#4CAF50';
      setTimeout(() => {
        weakKingPanel.querySelector('h3').textContent = oldTitle;
        weakKingPanel.querySelector('h3').style.color = '#FFD700';
      }, 2000);

      // 重新加载数据
      setTimeout(() => {
        loadWeakKingData();
      }, 1000);

    } catch (error) {
      // 处理可能的竞争条件：如果在查询和插入之间有其他用户插入了相同的记录
      if ((error.message.includes('409') || error.message.includes('duplicate key')) && 
          !error.message.includes('update')) {
        // 出现重复键错误，说明在我们查询后有人插入了记录，尝试更新
        try {
          const result = await supabaseService.update(TABLE_NAME, {
            enhance_num: attempts
          }, {
            item_name: itemName,
            player_name: playerName
          });
          
          // 更新成功，显示成功提示
          const oldTitle = weakKingPanel.querySelector('h3').textContent;
          weakKingPanel.querySelector('h3').textContent = '✅ 记录更新成功！';
          weakKingPanel.querySelector('h3').style.color = '#4CAF50';
          setTimeout(() => {
            weakKingPanel.querySelector('h3').textContent = oldTitle;
            weakKingPanel.querySelector('h3').style.color = '#FFD700';
          }, 2000);

          setTimeout(() => {
            loadWeakKingData();
          }, 1000);
          
          uploadBtn.disabled = false;
          uploadBtn.textContent = originalText;
          return;
          
        } catch (retryError) {
          error.message = `竞争条件处理失败: ${retryError.message}`;
        }
      }

      // 错误处理和用户友好提示
      let errorMessage = error.message;
      
      if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        errorMessage = '权限不足，请检查数据库配置';
      } else if (error.message.includes('42P10')) {
        errorMessage = '数据库表结构配置问题，请联系开发者';
      }

      alert(`上传失败: ${errorMessage}`);
      
      // Debug模式记录错误详情
      if (DEBUG_MODE) {
        console.group('❌ [强化助手] 弱化之王记录上传失败');
        console.error('错误详情:', {
          原始错误: error.message,
          处理后错误: errorMessage,
          物品: itemName,
          玩家: playerName,
          尝试次数: attempts,
          时间: new Date().toLocaleString()
        });
        console.groupEnd();
      }
      
      uploadBtn.disabled = false;
      uploadBtn.textContent = originalText;
      // 清除防重复标记，允许重试
      delete uploadBtn.dataset.lastUpload;
    }
  }

})(); 