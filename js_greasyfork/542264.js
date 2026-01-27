// ==UserScript==
// @name        安徽干部教育在线自动学习
// @description 安徽干部教育在线自动学习脚本，支持自动播放、自动跳转、防暂停
// @namespace   http://tampermonkey.net/
// @version     1.6.3
// @author      Moker32
// @license     GPL-3.0-or-later
// @match       https://www.ahgbjy.gov.cn/*
// @icon        https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico
// @noframes
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

/**
 * 安徽干部教育在线自动学习脚本 (UserScript)
 * -------------------------------------------------------------------------
 * 版本: V1.6.3
 * 更新: 2026-01-26
 * 作者: Moker32
 *
 * [说明] V1.6.3
 * • 功能增强：添加静默模式学习通知功能（GM_notification）
 * • 新增 NotificationService 通知服务，支持学习开始/章节完成/课程完成三种通知
 * • 通知可配置开关，通过 CONFIG.NOTIFICATIONS 控制
 * • 版本更新规范修复：强调必须使用 update_version.sh 脚本
 * -------------------------------------------------------------------------
 */

(function () {
  'use strict';

  /**
   * Enhanced logger with prefixing, UI integration, log levels, and history.
   */
  const Logger = {
    prefix: '[安徽干部教育助手]',
    config: {
      level: 'debug',      // debug/info/warn/error - 保留所有级别
      maxHistory: 100,     // 最大历史条数
      debounceMs: 100,     // UI 更新防抖时间
      showModule: true,    // 显示模块名
      showTimestamp: true, // 显示时间戳
    },
    _history: [],
    _pendingUpdates: [],
    _debounceTimer: null,
    _updateTimer: null,

    // 日志级别数值（用于比较）
    _LEVELS: { debug: 0, info: 1, success: 1, warn: 2, error: 3 },

    // 检查是否应该记录该级别的日志
    _shouldLog: (level) => {
      const currentLevel = Logger._LEVELS[Logger.config.level] ?? 0;
      return Logger._LEVELS[level] >= currentLevel;
    },

    _format: (level, msg, module = 'App') => {
      const now = new Date();
      const time = `${now.toLocaleTimeString('zh-CN', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const moduleStr = Logger.config.showModule ? `[${module}]` : '';
      const timeStr = Logger.config.showTimestamp ? `[${time}]` : '';
      return `${Logger.prefix} ${timeStr} [${level.toUpperCase()}] ${moduleStr} ${msg}`;
    },

    _addToHistory: (level, msg, module = 'App') => {
      const now = new Date();
      const entry = {
        timestamp: now.toISOString(),
        time: `${now.toLocaleTimeString('zh-CN', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`,
        level,
        module,
        message: msg
      };
      Logger._history.push(entry);
      if (Logger._history.length > Logger.config.maxHistory) {
        Logger._history.shift();
      }
      return entry;
    },

    _flushPendingUpdates: () => {
      if (Logger._pendingUpdates.length > 0 && Logger.onUpdateUI) {
        // 批量更新 UI，传递所有待处理的日志
        // 使用 try-catch 保护回调,防止异常中断日志流程
        try {
          Logger.onUpdateUI(Logger._pendingUpdates.map(u => u.msg));
        } catch (e) {
          console.error('[Logger] UI更新回调失败:', e);
        }
        Logger._pendingUpdates = [];
      }
    },

    _debouncedUpdate: () => {
      if (Logger._debounceTimer) clearTimeout(Logger._debounceTimer);
      Logger._debounceTimer = setTimeout(() => {
        Logger._flushPendingUpdates();
        Logger._debounceTimer = null;
      }, Logger.config.debounceMs);
    },

    debug: (msg, module = 'App', updateUI = false) => {
      if (!Logger._shouldLog('debug')) return;
      const formatted = Logger._format('debug', msg, module);
      console.log(`%c${formatted}`, 'color: #888;');
      Logger._addToHistory('debug', msg, module);
      if (updateUI && Logger.onUpdateUI) {
        Logger._pendingUpdates.push({ msg, level: 'debug' });
        Logger._debouncedUpdate();
      }
    },

    info: (msg, module = 'App', updateUI = false) => {
      if (!Logger._shouldLog('info')) return;
      const formatted = Logger._format('info', msg, module);
      console.log(formatted);
      Logger._addToHistory('info', msg, module);
      if (updateUI && Logger.onUpdateUI) {
        Logger._pendingUpdates.push({ msg, level: 'info' });
        Logger._debouncedUpdate();
      }
    },

    success: (msg, module = 'App', updateUI = true) => {
      if (!Logger._shouldLog('success')) return;
      const formatted = Logger._format('success', msg, module);
      console.log('%c' + formatted, 'color: #4CAF50; font-weight: bold;');
      Logger._addToHistory('success', msg, module);
      if (updateUI && Logger.onUpdateUI) {
        Logger._pendingUpdates.push({ msg, level: 'success' });
        Logger._debouncedUpdate();
      }
    },

    warn: (msg, module = 'App', updateUI = true) => {
      if (!Logger._shouldLog('warn')) return;
      const formatted = Logger._format('warn', msg, module);
      console.warn(formatted);
      Logger._addToHistory('warn', msg, module);
      if (updateUI && Logger.onUpdateUI) {
        Logger._pendingUpdates.push({ msg, level: 'warn' });
        Logger._debouncedUpdate();
      }
    },

    error: (msg, errorObj = null, module = 'App') => {
      if (!Logger._shouldLog('error')) return;
      const fullMsg = errorObj ? `${msg} | Error: ${errorObj.message}` : msg;
      const formatted = Logger._format('error', fullMsg, module);
      console.error(formatted);
      Logger._addToHistory('error', msg, module);
      if (Logger.onUpdateUI) {
        Logger._pendingUpdates.push({ msg, level: 'error' });
        Logger._debouncedUpdate();
      }
    },

    // 历史和导出
    getHistory: () => [...Logger._history],

    clearHistory: () => {
      Logger._history = [];
      if (Logger.onClearUI) Logger.onClearUI();
    },

    exportLogs: () => {
      const logs = Logger._history.map(entry =>
        `[${entry.time}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}`
      ).join('\n');
      return logs;
    },

    downloadLogs: () => {
      const logs = Logger.exportLogs();
      const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ahgbjy-logs-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },

    // 回调
    onUpdateUI: null,
    onClearUI: null
  };

  /**
   * URL parsing utilities.
   */
  const URLUtils = {
    extractCourseId: input => {
      if (!input) return null;
      
      // 1. Try extracting from ID attribute (e.g. ucheck-listGUID)
      if (typeof input !== 'string' && input.id) {
        const idMatch = input.id.match(/([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i);
        if (idMatch) return idMatch[1];
      }

      // 2. Try extracting from href or element text
      const str = typeof input === 'string' ? input : (input?.href || input?.querySelector('a')?.href || '');
      const match = str.match(/courseid=([0-9A-F-]{36})/i) || str.match(/courseid=(\d+)/);
      return match ? match[1] : null;
    },
    
    extractChapterId: url => {
      const match = url.match(/chapterid=([0-9A-F-]{36})/i) || url.match(/chapterid=(\d+)/);
      return match ? match[1] : null;
    },
    
    getParam: (name, url) => {
      // Use global helper if available (for testing), otherwise use window.location.href
      if (!url && typeof window !== 'undefined') {
        url = (typeof globalThis !== 'undefined' && typeof globalThis.getLocationHref === 'function')
          ? globalThis.getLocationHref()
          : window.location.href;
      }
      const regex = new RegExp(`[?&#]${name}=([^&#]*)`);
      const match = url.match(regex);
      return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
    }
  };

  /**
   * Global configuration for the script.
   * All selectors, timeout values, and storage keys must be defined here.
   */
  const CONFIG = {
    VERSION: '1.6.2',
    TIMEOUTS: {
      DEFAULT_WAIT: 2000,
      POPUP_CHECK: 5000,
      WAKE_LOCK_FALLBACK: 30000,
      PAGE_LOAD: 5000,
      RETRY_DELAY: 1000,
      LONG_ACTIVITY_CHECK: 300000,
      // 新增: 统一的锁超时配置
      LOCK_ACTIVE: 15000,      // 15秒 - 活跃检测 (TabManager)
      LOCK_STALE: 35000,       // 35秒 - 僵死锁检测 (GlobalLock)
      LOCK_EXPIRED: 300000,    // 5分钟 - 绝对过期
    },
    SELECTORS: {
      VIDEO: 'video',
      POPUPS: [
        '.video-popup', '.video-ad', '.video-overlay',
        '.player-popup', '.media-popup', '.video-dialog'
      ],
      COURSE_LIST: {
        CONTAINERS: [
          '.lbms tbody tr',
          '.ke-box',
          'tr[id*="ucheck"]',
          'tr:has(td[id*="ucheck"])',
          'td[id*="ucheck-list"]',
          // 新增：更通用的选择器
          'tr:has(a[href*="courseid="])',
          '.coursecard',
          '.cmt7',
          // 新增：专题班容器
          '.tubox',
          '#course .aaa',
          '.ke-box .tubox'
        ],
        CHAPTER_LINKS: 'a[href*="courseid="]',
        // 新增：课程状态元素
        STATUS_INDICATORS: {
          COMPLETED: [
            'img[src*="ywc"]',           // 已完成图片
            'img[src*="complete"]',      // 英文版完成图片
            'span.green2',               // 绿色状态类
            '.status-completed',
            '.course-status.finished'
          ],
          IN_PROGRESS: [
            'img[src*="xxz"]',           // 学习中图片
            'img[src*="learning"]',      // 英文版学习中图片
            'span.orange',               // 橙色状态类
            '.status-learning',
            '.course-status.studying'
          ]
        },
        // 新增：课程标题元素
        TITLE_ELEMENTS: [
          '.coursetxt',
          '.detail-title',
          '.course-name',
          '.title',
          'h4',
          'h5',
          'td[id*="ucheck-list"]'       // 兜底：包含课程ID的单元格
        ]
      },
      COURSE_DETAIL: {
        // 新增：课程详情页选择器
        CHAPTER_BUTTONS: [
          '.playBtn[data-chapterid]',
          'button[data-chapterid]',
          'a.playBtn',
          '.chapter-play-btn'
        ]
      },
      VIDEO_PLAYER: {
        COURSE_TITLE: '#coursenametitle',
        COMPLETE_BTN: '#completebtn'
      },
      SCORM_PLAYER: {
        IFRAME: '#mainFrame',
        CATALOG_TREE: '#catalog_tree',
        STUDY_TIME: '#study_time',
        COMPLETE_BTN: '#completebtn'
      },
      // 进度条选择器（用于提取学习进度）
      PROGRESS_BAR: '.progress-bar.progress-bar-danger, .progress-bar',
      // 专题班相关选择器
      THEMATIC_COURSE: {
        CONTAINER: '.tubox, #course .aaa, .ke-box .tubox',
        LINK: '#course a[href*="coursedetail.do"], .ke-box a[href*="coursedetail.do"]',
        PROGRESS_TEXT: '.ke-box p[style*="color"], .ke-box p',
        PROGRESS_BAR: '.progress-bar, .progress-bar.progress-bar-striped'
      }
    },
    STORAGE_KEYS: {
      VISITED_COURSES: 'visitedCourses',
      GLOBAL_APP_STATE: 'global_app_state',
      PLAY_LOCK: 'ahgbjy_play_lock',
      TAB_TABLE: 'ahgbjy_tab_table',
      REMOTE_REFRESH: 'remote_refresh_signal'
    },
    // 平台 API 适配开关
    PLATFORM_API: {
      ENABLED: true,           // 整体开关
      USE_API_FOR_CHAPTERS: true,   // 使用 API 获取章节列表
      USE_API_FOR_PROGRESS: true,   // 使用 API 验证学习进度
      USE_SILENT_MODE: true,        // 使用静音挂机模式（需要 tracetime.do 支持）
      AUTO_DETECT_API: true,        // 自动检测 API 可用性
      FALLBACK_TO_DOM: true,        // API 失败时回退到 DOM 解析
      USE_LIST_PAGE_DIRECT_LEARNING: true,  // 列表页直接学习模式（完全跳过播放页）
      TRACE_INTERVAL_MIN: 30000,    // 静默模式 trace 间隔最小值（毫秒）
      TRACE_INTERVAL_MAX: 60000,    // 静默模式 trace 间隔最大值（毫秒）
    },
    // 静默模式通知配置
    NOTIFICATIONS: {
      ENABLED: true,
      ON_CHAPTER_START: true,
      ON_CHAPTER_COMPLETE: true,
      ON_COURSE_COMPLETE: true,
    }
  };

  /**
   * Enhanced storage manager with write caching.
   */

  const StorageUtils = {
    _writeCache: {},

    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    get: (key, defaultValue = '') => {
      let val = defaultValue;
      if (typeof GM_getValue === 'function') {
        val = GM_getValue(key, defaultValue);
      }
      // 使用 structuredClone 进行深拷贝,避免循环引用问题
      try {
        // 对于简单类型直接返回,对象和数组使用 structuredClone
        if (val === null || val === undefined || typeof val !== 'object') {
          return val;
        }
        // 优先使用 structuredClone (现代浏览器支持)
        /* global structuredClone */
        if (typeof structuredClone !== 'undefined') {
          return structuredClone(val);
        }
        // 回退到 JSON 方法 (可能抛出循环引用错误)
        return JSON.parse(JSON.stringify(val));
      } catch (e) {
        // 循环引用或其他错误,返回浅拷贝
        console.warn('[Storage] 深拷贝失败,返回浅拷贝:', e);
        return val;
      }
    },

    /**
     * @param {string} key
     * @param {any} value
     */
    set: (key, value) => {
      const stringifiedValue = JSON.stringify(value);
      if (StorageUtils._writeCache[key] === stringifiedValue) {
        return;
      }

      if (typeof GM_setValue === 'function') {
        console.log(`[Storage] Saving ${key}:`, value);
        GM_setValue(key, value);
        StorageUtils._writeCache[key] = stringifiedValue;
      }
    },

    getVisited: () => {
      return StorageUtils.get(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
    },

    addVisited: courseId => {
      const visited = StorageUtils.getVisited();
      if (!visited.includes(courseId)) {
        visited.push(courseId);
        StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, visited);
      }
    },

    removeVisited: courseId => {
      const visited = StorageUtils.getVisited();
      const index = visited.indexOf(courseId);
      if (index > -1) {
        visited.splice(index, 1);
        StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, visited);
      }
    },

    clearVisited: () => {
      StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
    },

    // ============================================================================
    // 缓存过期检查工具
    // ============================================================================

    /**
     * 检查缓存是否已过期
     * @param {number} timestamp - 缓存时间戳
     * @param {number} maxAge - 缓存有效期（毫秒）
     * @returns {boolean} true表示已过期，false表示有效
     */
    isCacheExpired: (timestamp, maxAge) => {
      const now = Date.now();
      const cacheAge = now - timestamp;
      return cacheAge >= maxAge;
    },

    /**
     * 验证并清理过期缓存（通用方法）
     * @param {string} cacheKey - sessionStorage 缓存键名
     * @param {number} maxAge - 缓存有效期（毫秒），默认5分钟
     * @returns {{valid: boolean, data: any}} 验证结果
     */
    validateCache: (cacheKey, maxAge = 5 * 60 * 1000) => {
      const cached = sessionStorage.getItem(cacheKey);
      if (!cached) return { valid: false, data: null };

      try {
        const data = JSON.parse(cached);
        const timestamp = data.timestamp || 0;

        if (StorageUtils.isCacheExpired(timestamp, maxAge)) {
          sessionStorage.removeItem(cacheKey);
          return { valid: false, data: null };
        }

        return { valid: true, data };
      } catch {
        sessionStorage.removeItem(cacheKey);
        return { valid: false, data: null };
      }
    },

    // ============================================================================
    // 已验证完成课程管理
    // ============================================================================

    /**
     * 获取当前用户的已验证完成课程列表
     * @param {string} userId - 用户ID
     * @returns {string[]} 已验证完成的课程ID列表
     */
    getVerifiedCompletedCourses: (userId) => {
      try {
        const map = JSON.parse(sessionStorage.getItem('ahgbjy_verified_completed_courses') || '{}');
        return map[userId] || [];
      } catch {
        return [];
      }
    },

    /**
     * 将课程添加到已验证完成列表
     * @param {string} courseId - 课程ID
     * @param {string} userId - 用户ID
     * @param {string} [courseTitle] - 课程标题（用于日志）
     */
    addVerifiedCompletedCourse: (courseId, userId, courseTitle) => {
      try {
        const verifiedCompleted = JSON.parse(sessionStorage.getItem('ahgbjy_verified_completed_courses') || '{}');

        // 初始化当前用户的列表
        if (!verifiedCompleted[userId]) {
          verifiedCompleted[userId] = [];
        }

        if (!verifiedCompleted[userId].includes(courseId)) {
          verifiedCompleted[userId].push(courseId);
          sessionStorage.setItem('ahgbjy_verified_completed_courses', JSON.stringify(verifiedCompleted));
          if (courseTitle) {
            /* istanbul ignore next */
            console.log(`[Storage] 课程 "${courseTitle}" 已添加到用户 ${userId} 的已验证完成列表`);
          }
        }
      } catch (e) {
        /* istanbul ignore next */
        console.warn('[Storage] 添加已验证完成课程失败:', e);
      }
    },

    /**
     * 检查课程是否在已验证完成列表中
     * @param {string} courseId - 课程ID
     * @param {string} userId - 用户ID
     * @returns {boolean}
     */
    isCourseVerifiedCompleted: (courseId, userId) => {
      const verifiedList = StorageUtils.getVerifiedCompletedCourses(userId);
      return verifiedList.includes(courseId);
    },

    /**
     * 清除所有用户的已验证完成课程列表
     */
    clearVerifiedCompletedCourses: () => {
      sessionStorage.removeItem('ahgbjy_verified_completed_courses');
    },

    /**
     * 清除指定用户的已验证完成课程列表
     * @param {string} userId - 用户ID
     */
    clearUserVerifiedCompletedCourses: (userId) => {
      try {
        const verifiedCompleted = JSON.parse(sessionStorage.getItem('ahgbjy_verified_completed_courses') || '{}');
        if (verifiedCompleted[userId]) {
          delete verifiedCompleted[userId];
          sessionStorage.setItem('ahgbjy_verified_completed_courses', JSON.stringify(verifiedCompleted));
        }
      } catch (e) {
        console.warn('[Storage] 清除用户已验证完成课程失败:', e);
      }
    }
  };

  /**
   * Tab and session management across multiple pages.
   */

  const TabManager = {
    tableKey: CONFIG.STORAGE_KEYS.TAB_TABLE,
    currentTabId: Date.now() + '_' + Math.floor(Math.random() * 1000),
    
    register: () => {
      if (typeof GM_getValue !== 'function') return;
      const table = GM_getValue(TabManager.tableKey, {});
      // Use global helper if available (for testing), otherwise use window.location.href
      const url = (typeof globalThis !== 'undefined' && typeof globalThis.getLocationHref === 'function')
        ? globalThis.getLocationHref()
        : window.location.href;
      const type = url.includes('playvideo.do') || url.includes('playscorm.do') ? 'player' : 'manager';
      
      table[TabManager.currentTabId] = {
        type: type,
        url: url,
        courseId: URLUtils.extractCourseId(url),
        timestamp: Date.now()
      };
      GM_setValue(TabManager.tableKey, table);
      Logger.info(`Tab 注册成功: ${TabManager.currentTabId} (${type})`);
    },
    
    heartbeat: () => {
      if (typeof GM_getValue !== 'function') return;
      const table = GM_getValue(TabManager.tableKey, {});
      if (table[TabManager.currentTabId]) {
        table[TabManager.currentTabId].timestamp = Date.now();
        GM_setValue(TabManager.tableKey, table);
      } else {
        TabManager.register();
      }
    },
    
    hasActivePlayer: (courseId) => {
      if (typeof GM_getValue === 'function') {
        const table = GM_getValue(TabManager.tableKey, {});
        const now = Date.now();
        // 使用 CONFIG 中的统一超时配置
        return Object.values(table).some(tab =>
          tab.type === 'player' &&
          (!courseId || String(tab.courseId) === String(courseId)) &&
          (now - tab.timestamp < CONFIG.TIMEOUTS.LOCK_ACTIVE)
        );
      }
      return false;
    },

    cleanup: () => {
      if (typeof GM_getValue === 'function') {
        const table = GM_getValue(TabManager.tableKey, {});
        const now = Date.now();
        let changed = false;
        for (const id in table) {
          // Revert to 60 seconds for cleanup
          if (now - table[id].timestamp > 60000 || id === TabManager.currentTabId) {
            delete table[id];
            changed = true;
          }
        }
        if (changed) GM_setValue(TabManager.tableKey, table);
      }
    },

    unregister: () => {
      if (typeof GM_getValue !== 'function') return;
      const table = GM_getValue(TabManager.tableKey, {});
      delete table[TabManager.currentTabId];
      GM_setValue(TabManager.tableKey, table);
    }
  };

  /**
   * Global mutex for video playback.
   */

  // Session storage key constants to avoid typos
  const STUDYING_KEY = 'currentlyStudying';
  const LOCK_COURSE_ID_KEY = 'currentLockCourseId';

  const GlobalLock = {
    lockKey: CONFIG.STORAGE_KEYS.PLAY_LOCK,

    isLocked: () => {
      const lockData = StorageUtils.get(GlobalLock.lockKey, null);
      if (!lockData) return false;

      const now = Date.now();
      const lockAge = now - lockData.timestamp;

      // Definitive expiration: 使用 CONFIG 中的配置
      if (lockAge > CONFIG.TIMEOUTS.LOCK_EXPIRED) {
        Logger.info(`全局锁已超时(${Math.round(CONFIG.TIMEOUTS.LOCK_EXPIRED/1000)}秒)，自动释放`);
        return false;
      }

      // Active zombie lock detection: 使用 CONFIG 中的配置
      if (lockAge > CONFIG.TIMEOUTS.LOCK_STALE) {
        Logger.warn(`检测到僵死锁 (Course: ${lockData.courseId})，心跳停止 ${Math.round(lockAge/1000)}秒，主动释放`);
        GlobalLock.forceRelease();
        return false;
      }

      return true;
    },

    heartbeat: () => {
      if (sessionStorage.getItem(STUDYING_KEY) !== 'true') return;
      const courseId = sessionStorage.getItem(LOCK_COURSE_ID_KEY);
      if (!courseId) return;

      StorageUtils.set(GlobalLock.lockKey, {
        courseId: courseId,
        timestamp: Date.now()
      });
    },

    acquire: (courseId) => {
      sessionStorage.setItem(STUDYING_KEY, 'true');
      sessionStorage.setItem(LOCK_COURSE_ID_KEY, courseId);
      GlobalLock.heartbeat();
      Logger.info(`已获取全局播放锁: ${courseId}`);
    },

    release: () => {
      const currentCourseId = sessionStorage.getItem(LOCK_COURSE_ID_KEY);
      const lockData = StorageUtils.get(GlobalLock.lockKey, null);

      // 只有当锁存在且课程ID匹配时才完全释放
      if (lockData && String(lockData.courseId) === String(currentCourseId)) {
        GlobalLock.forceRelease();
      } else {
        // 即使没有匹配的锁，也清理 sessionStorage 状态
        sessionStorage.removeItem(STUDYING_KEY);
        sessionStorage.removeItem(LOCK_COURSE_ID_KEY);
      }
    },

    forceRelease: () => {
      if (typeof GM_setValue === 'function') {
        GM_setValue(GlobalLock.lockKey, null);
      }
      // 清理 sessionStorage 中相关状态
      sessionStorage.removeItem(STUDYING_KEY);
      sessionStorage.removeItem(LOCK_COURSE_ID_KEY);
      Logger.info('全局播放锁已强制释放');
    }
  };

  /**
   * Global state manager for cross-tab session persistence.
   */

  const StateManager = {
    stateKey: CONFIG.STORAGE_KEYS.GLOBAL_APP_STATE,
    _lastSync: 0,
    
    sync: () => {
      const now = Date.now();
      if (now - StateManager._lastSync < 1000) {
        return StateManager._getCurrentSession();
      }
      StateManager._lastSync = now;

      const appState = StorageUtils.get(StateManager.stateKey, null);
      
      if (appState && (now - appState.timestamp > 1800000)) {
        StateManager.clear();
        return {};
      }

      if (appState) {
        if (appState.thematicClassId) sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
        if (appState.learningMode) sessionStorage.setItem('learningMode', appState.learningMode);
        sessionStorage.setItem('isThematicClass', 'true');
      }
      
      return StateManager._getCurrentSession();
    },

    _getCurrentSession: () => {
      return {
        learningMode: sessionStorage.getItem('learningMode'),
        thematicClassId: sessionStorage.getItem('currentThematicClassId'),
        isThematicClass: sessionStorage.getItem('isThematicClass') === 'true'
      };
    },

    setThematicState: (thematicClassId, learningMode = 'thematic') => {
      StorageUtils.set(StateManager.stateKey, {
        thematicClassId, learningMode, timestamp: Date.now()
      });
      StateManager.sync();
    },

    clear: () => {
      StorageUtils.set(StateManager.stateKey, null);
      ['currentThematicClassId', 'learningMode', 'isThematicClass'].forEach(k => sessionStorage.removeItem(k));
    }
  };

  /**
   * BackgroundMonitor handles page visibility, keep-alive, and self-healing.
   */

  const BackgroundMonitor = {
    isVisible: typeof document !== 'undefined' ? !document.hidden : true,
    keepAliveWorker: null,
    lastSignalTime: 0,

    _initialized: false,
    _forceCheckInterval: null,
    _visibilityHandler: null,
    _refreshListenerId: null,

    // Callback registry to avoid circular dependencies
    onCheckDetail: null,
    onListRefresh: null,
    utils: null, // Will be injected

    // Mockable URL getter for testing
    getCurrentUrl: () => (typeof window !== 'undefined' ? window.location.href : ''),

    init: (utils) => {
      if (BackgroundMonitor._initialized) return;
      BackgroundMonitor._initialized = true;
      BackgroundMonitor.utils = utils;

      utils.safeExecute(() => {
        // Initialize signal baseline
        BackgroundMonitor.lastSignalTime = utils.storage.get(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, 0);
        utils.logger.info(`初始化刷新信号基准: ${BackgroundMonitor.lastSignalTime}`);

        // Listen for remote refresh signals (event-driven approach)
        if (typeof GM_addValueChangeListener === 'function') {
          BackgroundMonitor._refreshListenerId = GM_addValueChangeListener(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, (_name, _oldVal, _newVal, remote) => {
            if (remote) {
              utils.logger.info('收到远程刷新信号，准备更新课程列表');
              const currentUrl = BackgroundMonitor.getCurrentUrl();
              // Only respond on course list, thematic class detail, or course detail pages
              if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                // Status update injected via logger callback
                if (utils.logger.onUpdateStatusUI) utils.logger.onUpdateStatusUI('课程已完成，正在刷新列表...', 'success');

                // Force refresh: add timestamp to prevent caching
                const urlObj = new URL(BackgroundMonitor.getCurrentUrl());
                urlObj.searchParams.set('_t', String(Date.now()));

                utils.lifecycle.setTimeout(() => window.location.href = urlObj.href, 1500);
              }
            }
          });
        }

        // Visibility monitoring
        BackgroundMonitor._visibilityHandler = BackgroundMonitor.handleVisibilityChange;
        if (typeof document !== 'undefined') {
          utils.lifecycle.addEventListener(document, 'visibilitychange', BackgroundMonitor._visibilityHandler);
        }

        // Web Worker keep-alive
        BackgroundMonitor.createKeepAliveWorker();

        // Navigation watch
        BackgroundMonitor.setupNavigationWatch();

        utils.logger.info('双重后台监控系统已启动');
      }, '后台监控初始化失败');
    },

    handleVisibilityChange: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        BackgroundMonitor.isVisible = !document.hidden;
        // UI update is handled via logger callback or direct reference
        if (utils.logger.onUpdateBackgroundUI) utils.logger.onUpdateBackgroundUI(!BackgroundMonitor.isVisible);

        if (!BackgroundMonitor.isVisible) ; else {
          utils.logger.info('页面恢复前台，检查刷新信号');
          BackgroundMonitor.checkPendingActions();
        }
      }, '可见性变化处理失败');
    },

    createKeepAliveWorker: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        // 清理旧的 Worker,防止监听器泄漏
        if (BackgroundMonitor.keepAliveWorker) {
          try {
            BackgroundMonitor.keepAliveWorker.onmessage = null; // 清除旧监听器
            BackgroundMonitor.keepAliveWorker.postMessage('stop');
            BackgroundMonitor.keepAliveWorker.terminate();
          } catch { /* ignore */ }
          BackgroundMonitor.keepAliveWorker = null;
        }

        const tickInterval = 10000; // 统一心跳间隔为10秒
        const workerScript = `
        let interval = null;
        let isActive = true;
        const startKeepAlive = () => {
          interval = setInterval(() => {
            if (isActive) {
              postMessage({type: 'tick', timestamp: Date.now()});
            }
          }, ${tickInterval});
        };
        startKeepAlive();
        self.onmessage = function(e) {
          if (e.data === 'stop') {
            isActive = false;
            if (interval) clearInterval(interval);
          }
        };
      `;

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);

        utils.lifecycle.addCleanup(() => {
          try { URL.revokeObjectURL(url); } catch { /* ignore */ }
        });

        let tickCount = 0;
        worker.onmessage = (e) => {
          if (e.data.type === 'tick') {
            tickCount++;

            // 统一心跳，执行所有任务
            utils.globalLock.heartbeat();
            utils.tabManager.heartbeat();
            BackgroundMonitor.checkPendingActions();

            // 每300秒执行一次长时间无活动检查（第30次心跳，因为每次心跳间隔是10秒）
            if (tickCount % 30 === 0) {
              BackgroundMonitor.checkLongActivity();
            }
          }
        };

        BackgroundMonitor.keepAliveWorker = worker;
        utils.logger.info('Web Worker保活已启动');
      }, 'Web Worker创建失败');
    },

    setupNavigationWatch: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        const notify = () => {
          const currentUrl = BackgroundMonitor.getCurrentUrl();
          const lastUrl = sessionStorage.getItem('lastUrl') || '';
          if (currentUrl.includes('/pc/login.do')) return;

          if (currentUrl !== lastUrl) {
            utils.logger.info(`检测到页面变化: ${lastUrl} -> ${currentUrl}`);
            sessionStorage.setItem('lastUrl', currentUrl);
            // Router handling is injected
            if (BackgroundMonitor.onNavigationChange) BackgroundMonitor.onNavigationChange();
          }
        };

        const hookHistory = () => {
          const rawPushState = window.history.pushState;
          const rawReplaceState = window.history.replaceState;
          const wrap = (fn) => function(...args) {
            const ret = fn.apply(this, args);
            try { notify(); } catch { /* ignore */ }
            return ret;
          };
          window.history.pushState = wrap(rawPushState);
          window.history.replaceState = wrap(rawReplaceState);
          utils.lifecycle.addCleanup(() => {
            window.history.pushState = rawPushState;
            window.history.replaceState = rawReplaceState;
          });
        };

        hookHistory();
        utils.lifecycle.addEventListener(window, 'popstate', notify);
        utils.lifecycle.addEventListener(window, 'hashchange', notify);

        // 移除原来的30秒定时器，因为现在由统一心跳处理
      }, '页面变化监听设置失败');
    },

    checkPendingActions: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        const currentUrl = BackgroundMonitor.getCurrentUrl();

        if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do') || currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do')) {
          const now = Date.now();

          // 0. Grace period for newly opened courses (prevent self-healing from killing new tabs)
          // Check both GM and sessionStorage for maximum reliability
          const lastOpenTimeGM = typeof GM_getValue === 'function' ? GM_getValue('last_course_open_time', 0) : 0;
          const lastOpenTimeSS = parseInt(sessionStorage.getItem('last_course_open_time') || '0');
          const lastOpenTime = Math.max(lastOpenTimeGM, lastOpenTimeSS);
          
          if (now - lastOpenTime < 25000) { // 增加到25秒宽限期
             return;
          }

          // 1. Crash recovery / Orphan lock detection (Simplified & Robust)
          const lockData = utils.storage.get(CONFIG.STORAGE_KEYS.PLAY_LOCK, null);
          
          if (lockData && lockData.courseId) {
            const isCurrentPagePlayer = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
            const isCurrentCourseMatch = currentUrl.includes(String(lockData.courseId));
            
            if (isCurrentPagePlayer && isCurrentCourseMatch) {
               return;
            }

            // Heartbeat check: 使用 CONFIG 中的统一配置
            const silenceDuration = now - lockData.timestamp;
            if (silenceDuration > CONFIG.TIMEOUTS.LOCK_STALE) {
              utils.logger.warn(`检测到僵死锁 (Course: ${lockData.courseId})，心跳停止已超过 ${Math.round(silenceDuration/1000)}秒，触发自愈重试`);
              utils.globalLock.forceRelease();
              
              // Need to reset engine state
              if (BackgroundMonitor.onResetProcessing) BackgroundMonitor.onResetProcessing();
              
              // Refresh to find next task
              utils.lifecycle.setTimeout(() => window.location.reload(), 1000);
              return;
            }
          }
        }
      }, '检查待执行动作失败');
    },

    // 检查长时间无活动状态
    checkLongActivity: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        const currentUrl = BackgroundMonitor.getCurrentUrl();
        const lastActiveTime = sessionStorage.getItem('lastActiveTime');
        if (lastActiveTime && currentUrl.includes('coursedetail.do')) {
          const elapsed = Date.now() - parseInt(lastActiveTime);
          if (elapsed > CONFIG.TIMEOUTS.LONG_ACTIVITY_CHECK) {
            console.log('长时间无活动，强制刷新课程详情页以重置状态');
            sessionStorage.setItem('lastActiveTime', Date.now().toString());
            
            // Use reload instead of onCheckDetail to prevent dual-opening of courses
            // A fresh reload will trigger handleCourseDetailPage naturally and safely
            window.location.reload();
          }
        }
      }, '长时间活动检查失败');
    },

    cleanup: () => {
      const utils = BackgroundMonitor.utils;
      utils.safeExecute(() => {
        // 移除值变化监听器
        if (BackgroundMonitor._refreshListenerId) {
          try {
            if (typeof GM_removeValueChangeListener === 'function') {
              GM_removeValueChangeListener(BackgroundMonitor._refreshListenerId);
            }
          } catch (e) {
            utils.logger.warn('移除监听器失败', e, 'BackgroundMonitor');
          }
          BackgroundMonitor._refreshListenerId = null;
        }

        if (BackgroundMonitor.keepAliveWorker) {
          try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch { /* ignore */ }
          try { BackgroundMonitor.keepAliveWorker.terminate(); } catch { /* ignore */ }
          BackgroundMonitor.keepAliveWorker = null;
        }
        if (BackgroundMonitor._forceCheckInterval) {
          utils.lifecycle.clearInterval(BackgroundMonitor._forceCheckInterval);
          BackgroundMonitor._forceCheckInterval = null;
        }
        BackgroundMonitor._initialized = false;
      }, '后台监控清理失败');
    }
  };

  /**
   * Notification Service - 静默模式通知服务
   *
   * 提供学习开始和完成通知功能（GM_notification）
   * 配置方式：在 Config.js 中设置 NOTIFICATIONS 开关
   */


  /**
   * 通知模板
   */
  const NOTIFICATION_TEMPLATES = {
    CHAPTER_START: '开始学习：{courseTitle} - {chapterName}',
    CHAPTER_COMPLETE: '章节完成：{chapterName}',
    COURSE_COMPLETE: '课程完成：{courseTitle}',
  };

  /**
   * 渲染通知模板
   * @param {string} template - 模板文本
   * @param {Object} data - 替换数据
   * @returns {string} 渲染后的文本
   */
  function renderTemplate(template, data) {
    if (!template || !data) return template || '';
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  /**
   * 静默模式通知服务
   */
  const NotificationService = {
    /**
     * 检查通知功能是否启用
     * @returns {boolean}
     */
    isEnabled: () => {
      return CONFIG.NOTIFICATIONS?.ENABLED === true;
    },

    /**
     * 发送浏览器通知
     * @param {string} text - 通知内容
     * @param {string} title - 通知标题
     */
    _send: (text, title = '安徽干部教育自动学习') => {
      if (typeof GM_notification === 'function') {
        const icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';
        GM_notification({
          text,
          title,
          image: icon,
          highlight: true,
          silent: false,
          timeout: 10000,
          onclick: () => window.focus(),
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        const icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';
        const n = new Notification(title, { body: text, icon });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      }
    },

    /**
     * 学习开始通知
     * @param {Object} data - 通知数据
     * @param {string} data.chapterName - 章节名称
     * @param {string} data.courseTitle - 课程标题
     * @param {number} [data.duration] - 学习时长（秒）
     */
    notifyChapterStart: (data) => {
      if (!NotificationService.isEnabled()) return;

      const { chapterName, courseTitle, duration } = data;
      if (!chapterName || !courseTitle) return;

      let text = renderTemplate(NOTIFICATION_TEMPLATES.CHAPTER_START, {
        chapterName,
        courseTitle,
      });

      if (duration) {
        const minutes = Math.round(duration / 60);
        text += ` (约${minutes}分钟)`;
      }

      NotificationService._send(text);
    },

    /**
     * 章节完成通知
     * @param {Object} data - 通知数据
     * @param {string} data.chapterName - 章节名称
     * @param {string} data.courseTitle - 课程标题
     * @param {boolean} [data.isCourseComplete] - 是否课程也已完成
     */
    notifyChapterComplete: (data) => {
      if (!NotificationService.isEnabled()) return;

      const { chapterName, courseTitle, isCourseComplete } = data;
      if (!chapterName) return;

      // 如果课程也完成，发送课程完成通知
      if (isCourseComplete) {
        {
          const courseText = renderTemplate(NOTIFICATION_TEMPLATES.COURSE_COMPLETE, {
            courseTitle: courseTitle || '课程',
          });
          NotificationService._send(courseText);
          return;
        }
      }

      // 章节完成通知
      let text = renderTemplate(NOTIFICATION_TEMPLATES.CHAPTER_COMPLETE, {
        chapterName,
      });

      if (courseTitle) {
        text = `${courseTitle} - ${text}`;
      }

      NotificationService._send(text);
    },

    /**
     * 课程完成通知（显式调用）
     * @param {Object} data - 通知数据
     * @param {string} data.courseTitle - 课程标题
     */
    notifyCourseComplete: (data) => {
      if (!NotificationService.isEnabled()) return;

      const { courseTitle } = data;
      if (!courseTitle) return;

      const text = renderTemplate(NOTIFICATION_TEMPLATES.COURSE_COMPLETE, {
        courseTitle,
      });

      NotificationService._send(text);
    },
  };

  /**
   * Lifecycle Management - 生命周期管理
   *
   * 提供统一的定时器、事件监听器和 MutationObserver 管理，
   * 确保页面切换或标签页关闭时能正确清理资源，防止内存泄漏。
   */

  const Lifecycle = {
    _intervals: new Set(),
    _timeouts: new Set(),
    _listeners: [],
    _observers: new Set(),
    _cleaners: [],

    /**
     * 添加清理函数
     * @param {Function} fn - 清理函数
     */
    addCleanup(fn) {
      if (typeof fn === 'function') this._cleaners.push(fn);
    },

    /**
     * 设置定时器
     * @param {Function} fn - 回调函数
     * @param {number} ms - 间隔时间（毫秒）
     * @returns {number} 定时器 ID
     */
    setInterval(fn, ms) {
      const id = setInterval(fn, ms);
      this._intervals.add(id);
      return id;
    },

    /**
     * 清除定时器
     * @param {number} id - 定时器 ID
     */
    clearInterval(id) {
      if (id) {
        clearInterval(id);
        this._intervals.delete(id);
      }
    },

    /**
     * 设置延时器
     * @param {Function} fn - 回调函数
     * @param {number} ms - 延迟时间（毫秒）
     * @returns {number} 延时器 ID
     */
    setTimeout(fn, ms) {
      const id = setTimeout(() => {
        this._timeouts.delete(id);
        fn();
      }, ms);
      this._timeouts.add(id);
      return id;
    },

    /**
     * 清除延时器
     * @param {number} id - 延时器 ID
     */
    clearTimeout(id) {
      if (id) {
        clearTimeout(id);
        this._timeouts.delete(id);
      }
    },

    /**
     * 添加事件监听器
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     * @param {Function} handler - 事件处理器
     * @param {Object} options - 选项
     */
    addEventListener(target, type, handler, options) {
      if (!target || typeof target.addEventListener !== 'function') return;
      target.addEventListener(type, handler, options);
      this._listeners.push({ target, type, handler, options });
    },

    /**
     * 添加 MutationObserver
     * @param {MutationObserver} observer - 观察者实例
     * @returns {MutationObserver}
     */
    addObserver(observer) {
      if (observer) this._observers.add(observer);
      return observer;
    },

    /**
     * 清理所有资源
     */
    cleanup() {
      // 断开所有 MutationObserver
      for (const ob of this._observers) {
        try {
          ob.disconnect();
        } catch {
          /* ignore */
        }
      }
      this._observers.clear();

      // 移除所有事件监听器
      for (const { target, type, handler, options } of this._listeners) {
        try {
          target.removeEventListener(type, handler, options);
        } catch {
          /* ignore */
        }
      }
      this._listeners = [];

      // 清除所有定时器
      for (const id of this._intervals) {
        try {
          clearInterval(id);
        } catch {
          /* ignore */
        }
      }
      this._intervals.clear();

      // 清除所有延时器
      for (const id of this._timeouts) {
        try {
          clearTimeout(id);
        } catch {
          /* ignore */
        }
      }
      this._timeouts.clear();

      // 执行自定义清理函数
      for (const fn of this._cleaners) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
      this._cleaners = [];
    }
  };

  /**
   * DOM Utilities - DOM 操作工具函数
   *
   * 提供进度提取、章节名称解析、课程选择等 DOM 相关功能。
   */


  /**
   * DOM 工具对象
   */
  const DOMUtils = {
    /**
     * 智能点击元素
     * @param {HTMLElement} element - 要点击的元素
     * @param {string} description - 点击描述
     * @returns {boolean}
     */
    smartClick: (element, description = '点击操作') => {
      try {
        if (!element) {
          Logger.error(`${description}: 元素不存在`);
          return false;
        }
        Logger.info(`执行: ${description}`);

        const currentUrl = window.location.href;
        const isNewTab = element.tagName === 'A' && element.getAttribute('target') === '_blank';
        let href = element.getAttribute('href');

        if (isNewTab && href && (href.includes('playvideo.do') || href.includes('playscorm.do'))) {
          Logger.info(`后台静默打开视频页面: ${href}`);
          if (typeof GM_openInTab === 'function') {
            GM_openInTab(href, { active: false, insert: true, setParent: true });
            return true;
          }
        }

        element.click();

        if (!isNewTab) {
          setTimeout(() => {
            if (window.location.href === currentUrl) {
              Logger.info(`${description}: 页面未响应，执行备用点击`);
              element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            }
          }, 2000);
        }
        return true;
      } catch (error) {
        Logger.error(`点击失败: ${description}: ${error.message}`, error);
        return false;
      }
    },

    /**
     * 从 DOM 元素中提取进度百分比
     * @param {HTMLElement} element - DOM 元素
     * @returns {number} 进度百分比 (0-100)
     */
    extractProgress: (element) => {
      if (!element) return 0;
      const text = element.textContent || '';
      const match = text.match(/(\d+)%/);
      if (match) return parseInt(match[1]);
      return 0;
    },

    /**
     * 从表格行中提取进度百分比
     * @param {HTMLTableRowElement} row - 表格行元素
     * @returns {number} 进度百分比 (0-100)
     */
    extractProgressFromRow: (row) => {
      if (!row) return 0;
      const cells = row.querySelectorAll('td');
      for (const cell of cells) {
        const progress = DOMUtils.extractProgress(cell);
        if (progress > 0) return progress;
      }
      return 0;
    },

    /**
     * 从文本中提取时长（分钟）
     * @param {string} text - 文本内容
     * @returns {number} 时长（分钟）
     */
    extractDuration: (text) => {
      if (!text) return 30;
      const match = text.match(/(\d+)\s*分钟/);
      return match ? parseInt(match[1]) : 30;
    },

    /**
     * 从表格行中提取时长（分钟）
     * @param {HTMLTableRowElement} row - 表格行元素
     * @returns {number} 时长（分钟）
     */
    extractDurationFromRow: (row) => {
      if (!row) return 30;
      const cells = row.querySelectorAll('td');
      for (const cell of cells) {
        const text = cell.textContent?.trim() || '';
        if (text.includes('分钟')) {
          return DOMUtils.extractDuration(text);
        }
      }
      return 30;
    },

    /**
     * 从表格行中提取章节名称
     * @param {HTMLTableRowElement} row - 表格行元素
     * @param {number} chapterIndex - 章节索引（从 0 开始）
     * @returns {string} 章节名称
     */
    extractChapterName: (row, chapterIndex) => {
      if (!row) return `第${chapterIndex + 1}章`;

      try {
        // 方法 1: Cell analysis - iterate through all TD cells
        const cells = row.querySelectorAll('td');
        for (const cell of cells) {
          const text = cell.textContent.trim();

          // Skip cells with progress, time, numbers only, or play buttons
          if (!text ||
              text.includes('%') ||
              text.includes('分钟') ||
              /^\d+$/.test(text) ||
              cell.querySelector('.playBtn') ||
              text.includes('进入') ||
              text.includes('播放')) {
            continue;
          }

          // Found a meaningful text
          if (text.length > 2) {
            return text;
          }
        }

        // 方法 2: Pattern matching in row text
        const rowText = row.textContent;
        const patterns = [
          /第[一二三四五六七八九十\d]+章[\s:：]*([^\n]{2,30})/,
          /[一二三四五六七八九十]+、[ \t]*([^\n]{2,30})/,
          /\d+[.、][ \t]*([^\n]{2,30})/,
          /第\d+节[\s:：]*([^\n]{2,30})/,
          /章[\s:：]*([^\n]{2,30})/,
          /节[\s:：]*([^\n]{2,30})/
        ];

        for (const pattern of patterns) {
          const match = rowText.match(pattern);
          if (match && match[1]) {
            const title = match[1].trim();
            if (title.length > 2) {
              return title;
            }
          }
        }

        // 方法 3: Text block analysis - find longest meaningful text
        const textBlocks = rowText.split(/[\n\t]+/).filter(block => {
          const trimmed = block.trim();
          return trimmed.length > 2 &&
                 !trimmed.includes('%') &&
                 !trimmed.includes('分钟') &&
                 !/^\d+$/.test(trimmed) &&
                 !trimmed.includes('进入') &&
                 !trimmed.includes('播放');
        });

        if (textBlocks.length > 0) {
          textBlocks.sort((a, b) => b.length - a.length);
          return textBlocks[0].trim();
        }

        return `第${chapterIndex + 1}章`;
      } catch (error) {
        Logger.error(`章节${chapterIndex + 1}名称提取错误: ${error.message || error}`);
        return `第${chapterIndex + 1}章`;
      }
    },

    /**
     * 从专题班进度条元素中提取进度
     * @param {HTMLElement} element - 进度条元素
     * @returns {number} 进度百分比 (0-100)
     */
    extractProgressFromThematicProgressBar: (element) => {
      if (!element) return 0;

      // 方法 1: 从 style 属性提取 width 值
      const style = element.getAttribute('style') || '';
      const styleMatch = style.match(/width:\s*(\d+)%/);
      if (styleMatch) return parseInt(styleMatch[1]);

      // 方法 2: 从文本内容提取百分比
      const text = element.textContent || '';
      const textMatch = text.match(/(\d+)%/);
      if (textMatch) return parseInt(textMatch[1]);

      // 方法 3: 检查 data-* 属性
      const dataPercent = element.getAttribute('data-percent') ||
                          element.getAttribute('data-progress');
      if (dataPercent) {
        const parsed = parseInt(dataPercent);
        if (!isNaN(parsed)) return parsed;
      }

      return 0;
    },

    /**
     * 从容器元素中提取专题班课程进度
     * @param {HTMLElement} container - 课程容器元素 (.tubox 等)
     * @returns {number} 进度百分比 (0-100)
     */
    extractProgressFromThematicContainer: (container) => {
      if (!container) return 0;

      // 方法 1: 从 .progress-bar 元素提取
      const progressBar = container.querySelector('.progress-bar, .progress-bar-danger, .progress-bar-striped');
      if (progressBar) {
        const progress = DOMUtils.extractProgressFromThematicProgressBar(progressBar);
        if (progress > 0) return progress;
      }

      // 方法 2: 从 p 标签文本提取 (格式: "学习进度:XX%" 或 "XX%")
      const progressText = container.querySelector('p');
      if (progressText) {
        const text = progressText.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) return parseInt(match[1]);
      }

      // 方法 3: 从直接包含进度文本的元素提取
      const allText = container.textContent || '';
      const allMatch = allText.match(/学习进度[:：]?\s*(\d+)%/);
      if (allMatch) return parseInt(allMatch[1]);

      return 0;
    },

    /**
     * 从专题班课程链接中提取进度（支持新旧两种样式）
     * @param {HTMLAnchorElement} link - 课程链接元素
     * @returns {number} 进度百分比 (0-100)
     */
    extractProgressFromThematicLink: (link) => {
      if (!link) return 0;

      // 方法 1: 旧版样式 - 从 <p> 标签提取 (格式: "学习进度:XX%")
      const oldStyleText = link.querySelector('p')?.textContent || '';
      const oldMatch = oldStyleText.match(/(\d+)%/);
      if (oldMatch) return parseInt(oldMatch[1]);

      // 方法 2: 新版样式 - 从 .progress-bar 元素提取
      const progressBar = link.querySelector('.progress-bar');
      if (progressBar) {
        const barText = progressBar.textContent || '';
        const barStyle = progressBar.getAttribute('style') || '';
        const textMatch = barText.match(/(\d+)%/);
        if (textMatch) return parseInt(textMatch[1]);
        const styleMatch = barStyle.match(/width:\s*(\d+)%/);
        if (styleMatch) return parseInt(styleMatch[1]);
      }

      return 0;
    },

    /**
     * 两阶段选课：优先选择进行中的课程，然后选择未开始的课程
     * @param {Array} courseElements - 课程元素数组
     * @param {Array} visitedCourses - 已访问课程 ID 数组
     * @param {Function} progressExtractor - 进度提取函数
     * @param {Function} courseIdExtractor - 课程 ID 提取函数
     * @param {Function} [statusExtractor] - 可选的状态提取函数
     * @returns {Object} { element: HTMLElement|null, phase: string }
     */
    selectCourseByProgress: (courseElements, visitedCourses, progressExtractor, courseIdExtractor, statusExtractor = null) => {
      if (!courseElements || courseElements.length === 0) {
        return { element: null, phase: 'none' };
      }

      // 第一阶段：优先选择进行中的课程 (0% < progress < 100%)
      for (const el of courseElements) {
        const progress = progressExtractor(el);
        const courseId = courseIdExtractor(el);

        if (statusExtractor) {
          const status = statusExtractor(el);
          if (status === '学习中' && courseId && !visitedCourses.includes(courseId)) {
            Logger.debug(`第一阶段选中: ${courseId} (学习中, ${progress}%)`);
            return { element: el, phase: 'in_progress' };
          }
        } else {
          if (courseId && progress > 0 && progress < 100 && !visitedCourses.includes(courseId)) {
            Logger.debug(`第一阶段选中: ${courseId} (进度 ${progress}%)`);
            return { element: el, phase: 'in_progress' };
          }
        }
      }

      // 第二阶段：选择未开始的课程 (progress === 0)
      for (const el of courseElements) {
        const progress = progressExtractor(el);
        const courseId = courseIdExtractor(el);

        if (statusExtractor) {
          const status = statusExtractor(el);
          if (status && status !== '已完成' && courseId && !visitedCourses.includes(courseId)) {
            Logger.debug(`第二阶段选中: ${courseId} (状态: ${status})`);
            return { element: el, phase: 'not_started' };
          }
        } else {
          if (courseId && progress === 0 && !visitedCourses.includes(courseId)) {
            Logger.debug(`第二阶段选中: ${courseId} (未开始)`);
            return { element: el, phase: 'not_started' };
          }
        }
      }

      Logger.debug('未找到合适的课程');
      return { element: null, phase: 'none' };
    }
  };

  /**
   * Navigator - 页面导航工具
   */


  /**
   * 导航到指定 URL
   * @param {string} url - 目标 URL
   * @param {string} reason - 跳转原因
   */
  const Navigator = (url, reason = '页面跳转') => {
    try {
      Logger.info(`${reason}: ${url}`);
      sessionStorage.setItem('returning', 'true');
      window.location.href = url;
      Lifecycle.setTimeout(() => {
        if (!window.location.href.includes(url.split('?')[0])) {
          window.location.assign(url);
        }
      }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
    } catch (error) {
      Logger.error(`导航失败: ${url}: ${error.message}`, error);
    }
  };

  /**
   * Notification Manager - 通知管理
   *
   * 提供浏览器通知功能，支持 GM_notification 和原生 Notification API。
   */

  const NotificationManager = {
    title: '安徽干部教育自动学习',

    /**
     * 发送通知
     * @param {string} text - 通知内容
     * @param {Object} options - 选项
     */
    send(text, options = {}) {
      const title = this.title;
      const icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';

      if (typeof GM_notification === 'function') {
        GM_notification({
          text,
          title,
          image: icon,
          highlight: true,
          silent: false,
          timeout: 10000,
          onclick: () => window.focus(),
          ...options
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification(title, { body: text, icon, ...options });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      }
    }
  };

  /**
   * Central utility entry point.
   *
   * 整合所有工具模块，提供统一的导出接口。
   */

  /** @type {Object} */
  const Utils = {
    logger: Logger,
    url: URLUtils,
    storage: StorageUtils,
    tabManager: TabManager,
    globalLock: GlobalLock,
    stateManager: StateManager,
    monitor: BackgroundMonitor,
    notificationService: NotificationService,
    lifecycle: Lifecycle,
    dom: DOMUtils,
    notificationManager: NotificationManager,

    // 基础选择器
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),

    // 广播刷新信号
    broadcastRefresh: () => {
      if (typeof GM_setValue === 'function') {
        GM_setValue('remote_refresh_signal', Date.now());
        GM_setValue('force_reload_requested', true);
      }
    },

    // 安全执行函数
    safeExecute: (func, context = '未知操作') => {
      try {
        return func();
      } catch (error) {
        Logger.error(`[运行时异常] 在 ${context} 发生错误: ${error.message}`, error);
        return null;
      }
    },

    // 重试机制
    retry: (func, maxRetries = 3, delay = 1000, errorMsg = '重试失败') => {
      let attempts = 0;
      const attempt = () => {
        try {
          const result = func();
          if (result !== false && result !== null && result !== undefined) {
            return result;
          }
        } catch (error) {
          Logger.error(`尝试 ${attempts + 1} 失败`, error);
        }
        attempts++;
        if (attempts < maxRetries) {
          Utils.lifecycle.setTimeout(attempt, delay);
        } else {
          Logger.error(`${errorMsg}: 已达最大重试次数`);
        }
      };
      attempt();
    },

    // 等待Promise
    wait: (ms) => new Promise(resolve => Utils.lifecycle.setTimeout(resolve, ms)),

    // 等待元素出现
    waitForElement: (selector, timeout = 10000) => {
      return new Promise((resolve, reject) => {
        let timeoutId = null;

        const cleanup = () => {
          if (timeoutId) {
            Utils.lifecycle.clearTimeout(timeoutId);
            timeoutId = null;
          }
        };

        const check = () => {
          const el = document.querySelector(selector);
          if (el) return el;
          return null;
        };

        const existing = check();
        if (existing) return resolve(existing);

        const observer = new MutationObserver(() => {
          const el = check();
          if (el) {
            observer.disconnect();
            cleanup();
            resolve(el);
          }
        });

        Utils.lifecycle.addObserver(observer);

        const startObserver = () => {
          const target = document.body || document.documentElement;
          observer.observe(target, { childList: true, subtree: true });
        };

        let bodyCheckInterval = null;

        if (document.body) {
          startObserver();
        } else {
          bodyCheckInterval = Utils.lifecycle.setInterval(() => {
            if (document.body) {
              Utils.lifecycle.clearInterval(bodyCheckInterval);
              startObserver();
            }
          }, 50);
        }

        timeoutId = Utils.lifecycle.setTimeout(() => {
          observer.disconnect();
          if (bodyCheckInterval) {
            Utils.lifecycle.clearInterval(bodyCheckInterval);
          }
          reject(new Error(`等待元素超时: ${selector}`));
        }, timeout);
      });
    },

    // 提取分钟数
    extractMinutes: (text) => {
      if (!text) return 30;
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1]) : 30;
    },

    // 设置安全防护
    setupProtection: () => {
      Utils.safeExecute(() => {
        if (typeof unsafeWindow !== 'undefined') {
          unsafeWindow.alert = (msg) => console.log(`[屏蔽弹窗] alert: ${msg}`);
          unsafeWindow.confirm = (msg) => { console.log(`[自动确认] confirm: ${msg}`); return true; };
          unsafeWindow.prompt = () => { console.log('[屏蔽弹窗] prompt'); return ''; };
          unsafeWindow.focus = () => console.log('窗口聚焦请求被屏蔽');

          const originalOpen = unsafeWindow.open;
          unsafeWindow.open = (url, target, features) => {
            if (url && typeof url === 'string' && (url.includes('playvideo.do') || url.includes('playscorm.do'))) {
              let fullUrl = url;
              if (!url.startsWith('http')) {
                try { fullUrl = new URL(url, window.location.href).href; } catch { fullUrl = url; }
              }
              if (!fullUrl.includes('#bg_mode=1')) fullUrl += '#bg_mode=1';
              console.log(`拦截 window.open 弹窗，转为后台静默打开: ${fullUrl}`);
              if (typeof GM_openInTab === 'function') {
                GM_openInTab(fullUrl, { active: false, insert: true });
                return null;
              }
            }
            return originalOpen(url, target, features);
          };
        }
      }, '安全防护设置失败');
    },

    // 页面导航
    navigateTo: Navigator
  };

  /**
   * UI Manager for the script.
   * Fully restored matching original script UI and inline styles.
   */

  // 保存最近一次的课程进度信息，用于切换前台时恢复显示
  let _lastCourseInfo = null;

  // 日志条目上限，防止内存泄漏
  const MAX_LOG_ENTRIES = 100;

  const UI = {
    init: () => {
      Utils.safeExecute(() => {
        UI.injectStyles();
        if (document.body) UI.createPanel();
        else {
          const check = setInterval(() => {
            if (document.body) { clearInterval(check); UI.createPanel(); }
          }, 50);
        }
      }, 'UI初始化失败');
    },

    injectStyles: () => {
      if (document.getElementById('study-assistant-styles')) return;
      const style = document.createElement('style');
      style.id = 'study-assistant-styles';
      style.textContent = `
      #study-assistant-panel #log-container::-webkit-scrollbar {
        width: 6px;
      }
      #study-assistant-panel #log-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      #study-assistant-panel #log-container::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
      #study-assistant-panel #log-container::-webkit-scrollbar-thumb:hover {
        background: #bbb;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      #study-assistant-panel .log-entry {
        transition: background 0.15s ease;
        padding: 1px 4px;
        margin: 2px 0;
        border-radius: 2px;
      }
      #study-assistant-panel .log-entry:hover {
        background: rgba(0,0,0,0.03);
      }
    `;
      document.head.appendChild(style);
    },

    createPanel: () => {
      Utils.safeExecute(() => {
        if (document.getElementById('study-assistant-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'study-assistant-panel';
        // Restored exact inline styles from original script
        panel.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 320px; background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; font-family: Arial, sans-serif; font-size: 12px; max-height: 500px; overflow: hidden; display: flex; flex-direction: column;';

        panel.innerHTML = `
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 12px; color: #333; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 4px; height: 16px; background: #2196F3; border-radius: 2px;"></span>
          安徽干部教育助手 <span style="font-weight: normal; font-size: 11px; color: #999;">V${CONFIG.VERSION}</span>
        </div>
        <div id="log-container" style="flex: 1; overflow-y: auto; max-height: 240px; min-height: 80px; padding: 8px; background: #fafafa; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px; font-family: 'SF Mono', 'Consolas', monospace; font-size: 10px; line-height: 1.6;">
          <div class="log-entry" style="margin: 2px 0; color: #666;">脚本加载中...</div>
        </div>
        <div id="course-info" style="display: none; padding: 10px 12px; background: #fff8e1; border-radius: 4px; font-size: 11px; margin-bottom: 10px; border-left: 3px solid #f57c00;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 10px; color: #f57c00; font-weight: 500;">学习中</span>
            <span id="chapter-name" style="flex: 1; font-size: 11px; color: #333; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
            <span id="chapter-progress" style="font-size: 11px; color: #f57c00; font-weight: 500;">0%</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="course-name" style="flex: 1; font-size: 10px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
            <span id="course-chapter-progress" style="font-size: 10px; color: #666;">0/0</span>
          </div>
          <div style="height: 4px; background: #ddd; border-radius: 2px; overflow: hidden; margin-top: 6px;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: #4CAF50; transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div id="bg-status-text" style="padding: 10px; background: #e8f5e8; border-radius: 4px; font-size: 11px; text-align: center; font-weight: 500; color: #333;">进行中</div>
      `;

        document.body.appendChild(panel);

        UI.updateStatus('脚本已就绪', 'info');
      }, 'UI面板创建失败');
    },

    updateStatus: (message, type = 'info') => {
      Utils.safeExecute(() => {
        // 简化的状态显示，只在日志区域添加一条日志
        UI.appendLog(message, type);
      }, '状态更新失败');
    },

    updateBackgroundStatus: (isBackground, courseInfo = null) => {
      Utils.safeExecute(() => {
        // 缓存 DOM 元素引用，避免频繁查询
        const bgStatusText = document.getElementById('bg-status-text');
        const courseInfoEl = document.getElementById('course-info');
        const chapterName = document.getElementById('chapter-name');
        const courseName = document.getElementById('course-name');
        const chapterProgress = document.getElementById('chapter-progress');
        const courseChapterProgress = document.getElementById('course-chapter-progress');
        const progressBar = document.getElementById('progress-bar');

        if (courseInfo) {
          // 有进度信息 → 保存并显示
          _lastCourseInfo = courseInfo;
        } else if (isBackground === false && !_lastCourseInfo) {
          // 无进度信息且无缓存 → 清除状态
          _lastCourseInfo = null;
        }

        if (courseInfoEl && bgStatusText) {
          // 有进度信息 → 显示进度区块
          if (courseInfo || _lastCourseInfo) {
            // 学习中的状态 - 显示进度区块
            courseInfoEl.style.display = 'block';
            bgStatusText.style.display = 'none';

            const info = courseInfo || _lastCourseInfo;
            if (chapterName) chapterName.textContent = info.chapterName || '';
            if (courseName) courseName.textContent = info.courseTitle || '';
            if (chapterProgress) chapterProgress.textContent = `${info.percent || 0}%`;
            if (courseChapterProgress) {
              const currentChapter = info.currentChapter || 0;
              const totalChapters = info.totalChapters || 0;
              courseChapterProgress.textContent = `${currentChapter}/${totalChapters}`;
            }
            if (progressBar) progressBar.style.width = `${info.percent || 0}%`;
          } else {
            // 无进度信息 → 显示统一状态（不区分前后台）
            courseInfoEl.style.display = 'none';
            bgStatusText.style.display = 'block';
            bgStatusText.textContent = '进行中';
            bgStatusText.style.background = '#e8f5e8';
          }
        }
      }, '后台状态更新失败');
    },

    // 清除保存的课程进度信息（在静默模式结束时调用）
    clearCourseInfo: () => {
      _lastCourseInfo = null;
    },

    appendLog: (message, level = 'info') => {
      Utils.safeExecute(() => {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;

        // 移除旧日志，防止内存泄漏
        while (logContainer.children.length >= MAX_LOG_ENTRIES) {
          logContainer.removeChild(logContainer.firstChild);
        }

        const entry = document.createElement('div');
        entry.className = 'log-entry';

        // 级别图标和颜色
        const levelConfig = {
          debug: { icon: 'D', color: '#888' },
          info: { icon: 'I', color: '#2196F3' },
          success: { icon: '✓', color: '#4CAF50' },
          warn: { icon: '!', color: '#FF9800' },
          error: { icon: '✗', color: '#F44336' }
        };
        const config = levelConfig[level] || levelConfig.info;

        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

        // 安全构建: 使用 textContent 防止 XSS
        const timeSpan = document.createElement('span');
        timeSpan.style.color = '#888';
        timeSpan.textContent = `${time} `;

        const iconSpan = document.createElement('span');
        iconSpan.style.color = config.color;
        iconSpan.style.fontWeight = 'bold';
        iconSpan.textContent = `[${config.icon}] `;

        const msgSpan = document.createElement('span');
        msgSpan.textContent = message;

        entry.appendChild(timeSpan);
        entry.appendChild(iconSpan);
        entry.appendChild(msgSpan);
        entry.style.margin = '2px 0';

        logContainer.appendChild(entry);

        // 自动滚动到底部
        logContainer.scrollTop = logContainer.scrollHeight;
      }, '日志追加失败');
    },

    clearLogs: () => {
      Utils.safeExecute(() => {
        const logContainer = document.getElementById('log-container');
        if (logContainer) {
          logContainer.innerHTML = '';
        }
      }, '清空日志失败');
    }
  };

  /**
   * WakeLockManager handles system sleep prevention.
   * Uses the screen Wake Lock API with a fallback mechanism.
   */

  const WakeLockManager = {
    wakeLock: null,
    fallbackInterval: null,
    _visibilityHandler: null,

    init: () => {
      Utils.safeExecute(() => {
        WakeLockManager.requestWakeLock();
        WakeLockManager.setupFallbackKeepAwake();
        WakeLockManager.handleVisibilityChange();
        Utils.logger.info('防休眠系统已启动');
      }, '防休眠初始化失败');
    },

    requestWakeLock: async () => {
      try {
        if ('wakeLock' in navigator) {
          WakeLockManager.wakeLock = await navigator.wakeLock.request('screen');
          Utils.logger.info('Wake Lock已激活，系统保持唤醒状态');

          WakeLockManager.wakeLock.addEventListener('release', () => {
            Utils.logger.info('Wake Lock已释放');
          });
        } else {
          Utils.logger.warn('浏览器不支持Wake Lock API，使用备用方案');
        }
      } catch {
        Utils.logger.warn('Wake Lock请求失败，使用备用方案');
      }
    },

    setupFallbackKeepAwake: () => {
      Utils.safeExecute(() => {
        // 定期活动保持系统唤醒
        if (WakeLockManager.fallbackInterval) {
          Utils.lifecycle.clearInterval(WakeLockManager.fallbackInterval);
        }
        WakeLockManager.fallbackInterval = Utils.lifecycle.setInterval(() => {

          // 偶尔发送心跳请求
          if (Math.random() < 0.1) {
            fetch(window.location.href, { method: 'HEAD' }).catch(() => {});
          }
        }, CONFIG.TIMEOUTS.WAKE_LOCK_FALLBACK);

        Utils.logger.info('备用防休眠机制已启动');
      }, '备用防休眠设置失败');
    },

    handleVisibilityChange: () => {
      if (WakeLockManager._visibilityHandler) return;
      WakeLockManager._visibilityHandler = async () => {
        if (!document.hidden && !WakeLockManager.wakeLock) {
          await WakeLockManager.requestWakeLock();
        }
      };
      Utils.lifecycle.addEventListener(document, 'visibilitychange', WakeLockManager._visibilityHandler);
    },

    cleanup: () => {
      Utils.safeExecute(() => {
        if (WakeLockManager.wakeLock) {
          WakeLockManager.wakeLock.release();
          WakeLockManager.wakeLock = null;
        }

        if (WakeLockManager.fallbackInterval) {
          Utils.lifecycle.clearInterval(WakeLockManager.fallbackInterval);
          WakeLockManager.fallbackInterval = null;
        }

        console.log('防休眠系统已清理');
      }, '防休眠清理失败');
    }
  };

  /**
   * Course Selector - 课程选择模块
   *
   * 提供课程选择相关功能：selectCourse, extractCourseStatus, extractCourseTitle
   */


  /**
   * 课程选择器
   */
  const CourseSelector = {
    /**
     * 选择课程
     * @param {Array} courseElements - 课程元素列表
     * @param {Array} visitedCourses - 已访问课程列表
     * @returns {HTMLElement|null} 选中的课程元素
     */
    selectCourse: (courseElements, visitedCourses) => {
      Utils.logger.debug(`开始选择课程，共 ${courseElements.length} 个课程，已访问 ${visitedCourses.length} 个`, 'CourseHandler');

      // 使用可复用的两阶段选课逻辑
      const result = Utils.dom.selectCourseByProgress(
        courseElements,
        visitedCourses,
        // 进度提取：尝试从元素提取百分比进度
        (el) => {
          const progressMatch = el.textContent?.match(/(\d+)%/);
          if (progressMatch) return parseInt(progressMatch[1]);
          return 0;
        },
        // 课程ID提取：使用统一的 URL 工具
        (el) => Utils.url.extractCourseId(el),
        // 状态提取：使用现有的状态提取逻辑
        (el) => CourseSelector.extractCourseStatus(el)
      );

      if (result.element) {
        const courseId = Utils.url.extractCourseId(result.element);
        Utils.logger.debug(`选课结果: ${courseId} (阶段: ${result.phase})`, 'CourseHandler');
        return result.element;
      }

      Utils.logger.debug('未找到合适的课程', 'CourseHandler');
      return null;
    },

    /**
     * 提取课程状态
     * @param {HTMLElement} el - 课程元素
     * @returns {string} 课程状态：已完成、学习中、未开始
     */
    extractCourseStatus: (el) => {
      if (!el) return null;

      // 1. Image based detection (highest priority)
      const findImg = (selector) => el.querySelector(selector) || (el.tagName === 'TD' && el.closest('tr')?.querySelector(selector));

      if (findImg("img[src*='ywc']")) return "已完成";
      if (findImg("img[src*='xxz']")) return "学习中";

      // 2. Class based detection
      const hasClass = (cls) => el.classList.contains(cls) || el.querySelector(`span.${cls}`) || (el.tagName === 'TD' && el.closest('tr')?.querySelector(`span.${cls}`));

      if (hasClass('green2')) return "已完成";
      if (hasClass('orange')) return "学习中";

      // 3. Text based detection with correct priority order
      const text = el.textContent || "";
      const parentTR = el.tagName === 'TD' ? el.closest('tr') : null;
      const combinedText = text + (parentTR ? parentTR.textContent : "");

      // Priority 1: Explicit "学习中" status (highest priority to avoid false positives)
      if (combinedText.includes("学习中")) return "学习中";

      // Priority 2: Explicit "已完成" status
      if (combinedText.includes("已完成")) return "已完成";

      // Priority 3: 100% progress (only if not "学习中")
      if (combinedText.includes("100%")) return "已完成";

      return "未开始";
    },

    /**
     * 提取课程标题
     * @param {HTMLElement} el - 课程元素
     * @returns {string} 课程标题
     */
    extractCourseTitle: (el) => {
      if (!el) return '未知课程';

      // Safer cleaning: targets labels while preserving course name parts
      const clean = (t) => {
        if (!t) return '';
        return t.replace(/\[.*?\]/g, '') // Remove [Label]
                .replace(/(新课|学习中|已完成|进行中|未开始|必修|选修|学分|学时|课时|%)/g, '')
                .replace(/\s+/g, ' ')
                .trim();
      };

      // 0. Special case: If el is a status span (.coursespan), find sibling or parent elements
      if (el.classList.contains('coursespan') || el.id.includes('ucheck') && !el.id.includes('ucheck-list')) {
        // Try to find parent container with course info
        const parentRow = el.closest('tr');
        if (parentRow) {
          // Find the title TD in the same row
          const titleTd = parentRow.querySelector('td[id*="ucheck-list"]');
          if (titleTd) {
            const t = clean(titleTd.textContent);
            if (t.length > 2) return t;
          }
        }

        // Try to find sibling course card container
        const parentCard = el.closest('.coursecard, .cmt7, .ke-box');
        if (parentCard) {
          const titleEl = parentCard.querySelector('.coursetxt, .detail-title, .title, .course-name, h4, h5');
          if (titleEl) {
            const t = clean(titleEl.textContent);
            if (t.length > 2) return t;
          }
        }

        // Try to find sibling link with course ID
        const courseId = el.id.replace(/ucheck/, '') || el.getAttribute('data-courseid');
        if (courseId) {
          const siblingLink = el.parentElement?.querySelector(`a[href*="courseid=${courseId}"]`);
          if (siblingLink) {
            const t = clean(siblingLink.textContent);
            if (t.length > 2) return t;
          }
        }
      }

      // 1. Check all course links and find the one with meaningful text content
      const allLinks = el.querySelectorAll('a[href*="courseid="]');
      if (allLinks.length > 0) {
        // Try each link to find one with valid title text
        for (const link of allLinks) {
          // First check for specific title class inside the link
          const specificTitle = link.querySelector('.detail-title, .course-name, .title');
          if (specificTitle) {
            const t = clean(specificTitle.textContent);
            if (t.length > 2) return t;
          }

          // Then check the link's own textContent and title attribute
          const linkText = clean(link.textContent || link.getAttribute('title'));
          if (linkText.length > 2) return linkText;
        }

        // If el itself is an anchor
        if (el.tagName === 'A') {
          const t = clean(el.textContent || el.getAttribute('title'));
          if (t.length > 2) return t;
        }
      }

      // 2. Check for TD elements with course title (specific structure: td[id*="ucheck-list"])
      const titleTd = el.querySelector('td[id*="ucheck-list"]') ||
                     (el.tagName === 'TD' && el.id.includes('ucheck-list') ? el : null);
      if (titleTd) {
        const t = clean(titleTd.textContent);
        if (t.length > 2) return t;
      }

      // 3. Attribute check
      const attrTitle = el.getAttribute('title') || el.getAttribute('data-original-title');
      if (attrTitle && clean(attrTitle).length > 2) return clean(attrTitle);

      // 4. Search the entire row if el is part of a table
      const row = el.tagName === 'TR' ? el : el.closest('tr');
      if (row) {
        // Find specific title element in the row first
        const rowTitle = row.querySelector('.detail-title, .title, .course-name');
        if (rowTitle) return clean(rowTitle.textContent);

        // Find the longest text node in the row that isn't a label
        const candidates = Array.from(row.querySelectorAll('td, a, span'))
          .map(node => clean(node.textContent))
          .filter(t => t.length > 4 && !/^\d+$/.test(t))
          .sort((a, b) => b.length - a.length);

        if (candidates.length > 0) return candidates[0];
      }

      // 5. Common title selectors
      const found = el.querySelector('.detail-title, .title, .course-name, h4, h5, .coursename, .coursetxt');
      if (found && clean(found.textContent).length > 2) return clean(found.textContent);

      const finalText = clean(el.textContent);
      return finalText.length > 2 ? finalText : '未知课程';
    }
  };

  /**
   * Course Navigator - 课程导航模块
   *
   * 提供课程导航相关功能：openCourse, returnToCourseList, handlePagination, switchCourseType
   */


  /**
   * 课程导航器
   */
  const CourseNavigator = {
    /**
     * 打开课程
     * @param {HTMLElement} courseElement - 课程元素
     */
    openCourse: (courseElement) => {
      if (!courseElement) return;
      Utils.safeExecute(() => {
        let courseTitle = CourseSelector.extractCourseTitle(courseElement);

        // If still unknown, try a last-ditch search in document title
        if (courseTitle === '未知课程') {
          const pageTitle = document.querySelector('h3.title, .coursename, .breadcrumb .active');
          if (pageTitle) courseTitle = pageTitle.textContent.trim();
        }

        // Final protection: Never open if title is missing
        if (!courseTitle || courseTitle === '未知课程') {
          const cid = Utils.url.extractCourseId(courseElement) || '未知ID';
          Utils.logger.error(`无法识别课程标题 (ID: ${cid})，放弃打开以防止逻辑冲突`);
          UI.updateStatus('错误：课程名解析失败', 'error');
          return;
        }

        // 引用外部的 isProcessing
        // 注意：这里通过间接方式设置，避免循环依赖
        courseTitle = courseTitle.substring(0, 40); // Increased limit

        Utils.logger.info(`准备打开课程: ${courseTitle}`);
        UI.updateStatus(`正在打开: ${courseTitle}`, 'info');
        Utils.notificationManager.send(`开始学习：${courseTitle}`);

        // Signal BackgroundMonitor to pause self-healing checks for a while (use GM_setValue for cross-tab sync)
        if (typeof GM_setValue === 'function') {
          GM_setValue('last_course_open_time', Date.now());
        }
        sessionStorage.setItem('last_course_open_time', Date.now().toString());

        const courseId = Utils.url.extractCourseId(courseElement);
        if (courseId) {
          let playUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseId}`;

          // 检测是否为专题班模式，携带来源信息到 URL
          const isThematic = sessionStorage.getItem('learningMode') === 'thematic' ||
                             sessionStorage.getItem('isThematicClass') === 'true';
          if (isThematic) {
            const tid = sessionStorage.getItem('currentThematicClassId');
            playUrl += `&thm=1`;  // 标记专题班模式
            if (tid) playUrl += `&tid=${tid}`;  // 携带专题班ID
            Utils.logger.info(`专题班模式：跳转携带参数 thm=1, tid=${tid}`);
          }

          Utils.logger.info(`导航至: ${playUrl}`);
          Utils.navigateTo(playUrl, '打开课程');
        } else {
          Utils.logger.info('未找到直接链接，尝试点击元素');
          Utils.dom.smartClick(courseElement, '打开课程');
        }
      }, '打开课程失败');
    },

    /**
     * 处理分页
     * @returns {Promise<boolean>}
     */
    handlePagination: async () => {
      try {
        const pagination = Utils.$('.pagination');
        if (!pagination) {
          Utils.logger.error('未找到分页元素', null, 'CourseHandler');
          return false;
        }
        const pageLinks = pagination.querySelectorAll('a[href]');
        Utils.logger.debug(`找到 ${pageLinks.length} 个分页链接`, 'CourseHandler');
        for (const link of pageLinks) {
          const text = link.textContent.trim();
          if (text === '>' || text === '»' || text.includes('下一页') || text.toLowerCase().includes('next')) {
            const href = link.getAttribute('href');
            if (href) {
              const fullUrl = new URL(href, window.location.href).href;
              Utils.logger.info(`找到下一页按钮，跳转到: ${fullUrl}`);
              UI.updateStatus('跳转到下一页');
              window.location.href = fullUrl;
              return true;
            }
          }
        }
        Utils.logger.error('未找到下一页按钮', null, 'CourseHandler');
        return false;
      } catch (e) {
        Utils.logger.error(`分页处理错误: ${e.message}`, null, 'CourseHandler');
        return false;
      }
    },

    /**
     * 切换课程类型
     */
    switchCourseType: () => {
      Utils.safeExecute(() => {
        const currentType = Utils.url.getParam('coutype') || '1';
        const otherType = currentType === '1' ? '0' : '1';
        Utils.logger.debug(`当前课程类型: ${currentType === '1' ? '必修' : '选修'}`, 'CourseHandler');

        const flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
        Utils.storage.set(flagKey, 'true');
        sessionStorage.setItem(`verified_type_${currentType}`, 'true');

        const requiredCompleted = Utils.storage.get('requiredCoursesCompleted', 'false');
        const electiveCompleted = Utils.storage.get('electiveCoursesCompleted', 'false');
        const requiredVerified = sessionStorage.getItem('verified_type_1') === 'true';
        const electiveVerified = sessionStorage.getItem('verified_type_0') === 'true';

        if (requiredCompleted === 'true' && electiveCompleted === 'true' && requiredVerified && electiveVerified) {
          Utils.logger.debug('所有课程均已通过本次会话验证并确认完成！', 'CourseHandler');
          Utils.logger.success('所有课程均已通过本次会话验证并确认完成！');
          UI.updateStatus('所有课程已完成！', 'success');
          Utils.notificationManager.send('恭喜！所有必修和选修课程均已完成！');
          return;
        }

        if (currentType === '1') {
          Utils.logger.debug('必修页学完，准备切换到选修课程进行验证', 'CourseHandler');
          UI.updateStatus('切换到选修课程...', 'info');
        } else {
          Utils.logger.debug('选修页学完，准备切换到必修课程进行验证', 'CourseHandler');
          UI.updateStatus('切换到必修课程...', 'info');
        }

        const targetUrl = `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=${otherType}`;
        Utils.navigateTo(targetUrl, '切换类型');
      }, '类型切换失败');
    },

    /**
     * 返回课程列表
     */
    returnToCourseList: () => {
      Utils.safeExecute(() => {
        const currentUrl = window.location.href;
        const isPlaybackPage = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
        const isBgMode = window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1') || sessionStorage.getItem('isBackgroundMode') === 'true';

        const currentCourseId = Utils.url.extractCourseId(currentUrl);
        Utils.logger.debug(`任务完成处理 - 课程ID: ${currentCourseId || '未知'}`, 'CourseHandler');

        // 1. First record to blacklist
        if (currentCourseId) {
            Utils.logger.debug(`记录已完成课程黑名单: ${currentCourseId}`, 'CourseHandler');
            Utils.storage.addVisited(currentCourseId);
            sessionStorage.setItem('last_completed_course', currentCourseId);
        }

        // 2. Set refresh flags
        GM_setValue('remote_refresh_signal', Date.now());
        GM_setValue('force_reload_requested', true);

        // 3. Release lock last
        Utils.globalLock.release();
        Utils.notificationManager.send('课程学习已完成，准备进入下一门。');

        const refreshContext = {
            timestamp: Date.now(),
            courseId: currentCourseId,
            url: currentUrl,
            learningMode: sessionStorage.getItem('learningMode')
        };
        GM_setValue('refresh_context', JSON.stringify(refreshContext));

        if (isPlaybackPage || isBgMode) {
          Utils.logger.debug('播放页：尝试关闭窗口', 'CourseHandler');
          Utils.lifecycle.setTimeout(() => {
            window.close();
            Utils.lifecycle.setTimeout(() => {
              if (!window.closed) {
                  Utils.logger.debug('窗口关闭失败，执行强制跳转返回列表', 'CourseHandler');
                  const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                  window.location.href = `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=${coursetype}`;
              }
            }, 1000);
          }, 500);
        } else if (currentUrl.includes('coursedetail.do')) {
          // 三重保险：URL参数 > sessionStorage > GM存储
          const isThematicUrl = Utils.url.getParam('thm') === '1';
          const isThematicSession = sessionStorage.getItem('learningMode') === 'thematic' ||
                                   sessionStorage.getItem('isThematicClass') === 'true';

          // 先同步状态，然后检查
          const sessionState = Utils.stateManager.sync();
          const isThematicGM = sessionState.isThematicClass;

          const isThematic = isThematicUrl || isThematicSession || isThematicGM;

          // 调试日志：清晰显示判断依据
          if (isThematicUrl) {
            Utils.logger.debug('返回判断：基于 URL 参数（专题班模式）', 'CourseHandler');
          } else if (isThematicSession) {
            Utils.logger.debug('返回判断：基于 sessionStorage（专题班模式）', 'CourseHandler');
          } else if (isThematicGM) {
            Utils.logger.debug('返回判断：基于 GM存储（专题班模式）', 'CourseHandler');
          } else {
            Utils.logger.debug('返回判断：普通课程模式', 'CourseHandler');
          }

          let backUrl = '';
          if (isThematic) {
              const tid = sessionStorage.getItem('currentThematicClassId') || Utils.url.getParam('tid');
              backUrl = tid ? `/pc/thematicclass/thematicclassdetail.do?tid=${tid}` : '/pc/thematicclass/thematicclasslist.do';
              Utils.logger.debug(`专题班章节完成，退回到专题班列表: ${backUrl}`, 'CourseHandler');
              sessionStorage.setItem('fromThematicLearning', 'true');
          } else {
              const lastListUrl = sessionStorage.getItem('lastListUrl');
              if (lastListUrl) {
                  backUrl = lastListUrl;
                  Utils.logger.debug(`普通课程章节完成，退回到最后访问的列表页: ${backUrl}`, 'CourseHandler');
              } else {
                  const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                  backUrl = `/pc/course/courselist.do?coutype=${coursetype}`;
                  Utils.logger.debug(`普通课程章节完成，退回到主课表首页: ${backUrl}`, 'CourseHandler');
              }
          }

          // Final protection: strip fragment and instructions before navigation
          const urlObj = new URL(backUrl, window.location.origin);
          urlObj.searchParams.delete('refresh_ts');
          urlObj.searchParams.delete('auto_continue');
          urlObj.hash = '';

          urlObj.searchParams.set('refresh_ts', Date.now().toString());
          urlObj.searchParams.set('auto_continue', 'true');
          window.location.replace(urlObj.href);
        } else {
          Utils.logger.debug('列表页/其他：强制刷新当前页', 'CourseHandler');
          const urlObj = new URL(window.location.href);
          urlObj.hash = ''; // Clear fragment
          urlObj.searchParams.set('refresh_ts', Date.now().toString());
          urlObj.searchParams.set('auto_continue', 'true');
          window.location.replace(urlObj.href);
        }
      }, '返回逻辑执行失败');
    }
  };

  /**
   * Thematic Handler - 专题班处理模块
   *
   * 提供专题班相关功能：verifyThematicClassProgress
   */


  /**
   * 专题班处理器
   */
  const ThematicHandler = {
    /**
     * 验证专题班列表页的实际课程进度
     * @param {string} courseId - 课程ID
     * @returns {Promise<number>} 返回实际进度(0-100),如果无法获取则返回-1
     */
    verifyThematicClassProgress: async (courseId) => {
      return Utils.safeExecute(async () => {
        const isThematic = sessionStorage.getItem('learningMode') === 'thematic' ||
                           sessionStorage.getItem('isThematicClass') === 'true';

        if (!isThematic) {
          Utils.logger.info('非专题班模式,跳过列表页进度验证');
          return -1; // 非专题班模式,不验证
        }

        const tid = sessionStorage.getItem('currentThematicClassId');
        if (!tid) {
          Utils.logger.warn('缺少专题班ID,无法验证列表页进度');
          return -1;
        }

        Utils.logger.info(`🔍 验证专题班列表页进度: 课程ID=${courseId}`);

        // 优先从sessionStorage缓存的进度数据获取(最可靠)
        const cachedProgress = sessionStorage.getItem(`course_progress_${courseId}`);
        if (cachedProgress !== null) {
          const progress = parseInt(cachedProgress);
          Utils.logger.info(`📊 从缓存读取到进度: ${progress}%`);
          return progress;
        }

        // 备用方案: 尝试通过opener访问专题班列表页
        if (window.opener && !window.opener.closed) {
          try {
            // 尝试使用jQuery
            if (typeof window.opener.$ === 'function') {
              const courseLinks = window.opener.$('#course a[href*="coursedetail.do"], .ke-box a[target="_blank"]');
              if (courseLinks.length > 0) {
                for (let i = 0; i < courseLinks.length; i++) {
                  const linkHref = courseLinks[i].href || courseLinks[i].getAttribute('href');
                  if (linkHref && linkHref.includes(courseId)) {
                    // 找到课程链接,检查进度显示
                    const $container = window.opener.$(courseLinks[i]).closest('a, div');
                    const $progressElem = $container.find('p').filter(function() {
                      return window.opener.$(this).text().includes('学习进度') ||
                             window.opener.$(this).text().includes('%');
                    });

                    if ($progressElem.length > 0) {
                      const progressText = $progressElem.text();
                      const match = progressText.match(/(\d+)%/);
                      if (match) {
                        const actualProgress = parseInt(match[1]);
                        Utils.logger.info(`✅ 从opener窗口读取到实际进度: ${actualProgress}%`);
                        return actualProgress;
                      }
                    }
                    break;
                  }
                }
              }
            }
          } catch (e) {
            Utils.logger.warn(`访问opener窗口失败: ${e.message}`);
          }
        }

        Utils.logger.warn('⚠️ 无法从专题班列表页获取实际进度');
        return -1; // 无法获取
      }, '专题班列表页进度验证失败', -1);
    }
  };

  /**
   * Chapter Manager - 章节管理模块
   *
   * 提供章节信息提取、课程完成检查和未完成章节查找功能
   */


  /**
   * 章节管理器
   */
  const ChapterManager = {
    /**
     * 提取章节信息
     * @param {string} courseId - 课程ID
     */
    extractChapterInfo: (courseId) => {
      Utils.safeExecute(() => {
        // 尝试所有配置的章节按钮选择器
        let chapters = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);

        // 如果找不到，尝试其他选择器
        if (chapters.length === 0) {
          for (const selector of CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS) {
            chapters = Utils.$$(selector);
            if (chapters.length > 0) {
              Utils.logger.info(`使用选择器 ${selector} 找到 ${chapters.length} 个章节`);
              break;
            }
          }
        }

        Utils.logger.debug(`找到 ${chapters.length} 个章节`, 'CourseHandler');

        chapters.forEach((button, index) => {
          Utils.safeExecute(() => {
            const chapterId = button.getAttribute('data-chapterid');
            if (!chapterId) return;

            const row = button.closest('tr');
            if (!row) return;

            // 改进的时长和进度提取逻辑
            let totalMinutes = 30;  // 默认30分钟
            let learnedPercent = 0;

            // 使用统一工具函数提取时长和进度
            totalMinutes = Utils.dom.extractDurationFromRow(row);
            learnedPercent = Utils.dom.extractProgressFromRow(row);

            // 如果上面没找到，尝试使用col-md-2选择器
            if (totalMinutes === 30) {
              const colMd2Cells = row.querySelectorAll('td.col-md-2');
              if (colMd2Cells.length >= 1) {
                const timeText = colMd2Cells[0].textContent;
                if (timeText.includes('分钟')) {
                  totalMinutes = Utils.extractMinutes(timeText);
                  Utils.logger.debug(`章节${index + 1}时长（备用）: ${totalMinutes}分钟`, 'CourseHandler');
                }
              }
            }

            if (learnedPercent === 0) {
              const colMd2Cells = row.querySelectorAll('td.col-md-2');
              if (colMd2Cells.length >= 2) {
                const progressText = colMd2Cells[1].textContent;
                const match = progressText.match(/(\d+)%/);
                if (match) {
                  learnedPercent = parseInt(match[1]);
                  Utils.logger.debug(`章节${index + 1}进度（备用）: ${learnedPercent}%`, 'CourseHandler');
                }
              }
            }

            const key = `duration_${courseId}_${chapterId}`;
            Utils.storage.set(key, totalMinutes.toString());
            Utils.logger.debug(`章节${index + 1}总时长已记录: ${totalMinutes}分钟`, 'CourseHandler');
          }, `章节${index + 1}信息提取错误`);
        });
      }, '章节信息处理错误');
    },

    /**
     * 检查课程是否完成
     * @returns {boolean}
     */
    checkCourseCompletion: () => {
      return Utils.safeExecute(() => {
        Utils.logger.info('检查课程完成状态');

        // 方法1: 检查所有章节的进度是否都是100%
        const chapters = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);
        if (chapters.length === 0) {
          // 尝试其他选择器
          for (const selector of CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS) {
            const found = Utils.$$(selector);
            if (found.length > 0) {
              chapters.push(...found);
              break;
            }
          }
        }

        if (chapters.length > 0) {
          let allCompleted = true;
          let completedCount = 0;

          chapters.forEach((button, index) => {
            const row = button.closest('tr');
            if (!row) return;

            // 使用统一工具函数提取进度
            const progress = Utils.dom.extractProgressFromRow(row);

            if (progress === 100) {
              completedCount++;
            } else {
              allCompleted = false;
              Utils.logger.info(`章节${index + 1}未完成: ${progress}%`);
            }
          });

          Utils.logger.info(`课程进度: ${completedCount}/${chapters.length} 章节已完成`);

          // 所有章节都完成才算课程完成
          return allCompleted && completedCount === chapters.length && chapters.length > 0;
        }

        // 方法2: 兜底方案 - 检查最后一个col-md-2元素
        const colMd2Elements = document.getElementsByClassName('col-md-2');
        if (colMd2Elements.length > 0) {
          const lastElement = colMd2Elements[colMd2Elements.length - 1];
          const spans = lastElement.getElementsByTagName('span');
          if (spans.length > 0) {
            const progressText = spans[0].textContent || spans[0].innerHTML;
            Utils.logger.info(`使用兜底方案检查进度: ${progressText}`);
            return progressText === '100' || progressText === '100%';
          }
        }

        Utils.logger.warn('无法确定课程完成状态，默认为未完成');
        return false;
      }, '课程完成状态检查错误', false);
    },

    /**
     * 查找并点击未完成章节
     * @returns {boolean}
     */
    findAndClickIncompleteChapter: () => {
      return Utils.safeExecute(() => {
        const courseId = Utils.url.extractCourseId(window.location.href);

        // 首先检查全局锁，或者是否已有该课程的活跃标签页
        if (Utils.globalLock.isLocked() || (courseId && Utils.tabManager.hasActivePlayer(courseId))) {
          Utils.logger.debug(`检测到全局锁占用或已存在该课程的活跃播放页 (${courseId})，进入带超时的等待模式...`, 'CourseHandler');
          UI.updateStatus('课程已在其他页面运行中，等待中...', 'warning');

          // 修复：添加超时机制，防止永久死锁
          const waitStart = Date.now();
          const waitTimeout = 60000; // 60秒超时

          const checkInterval = Utils.lifecycle.setInterval(() => {
            const elapsed = Date.now() - waitStart;

            // 检查锁是否已释放
            if (!Utils.globalLock.isLocked() && !Utils.tabManager.hasActivePlayer(courseId)) {
              Utils.lifecycle.clearInterval(checkInterval);
              Utils.logger.info('播放页已完成，继续处理');
              // 重新尝试查找未完成章节
              ChapterManager.findAndClickIncompleteChapter();
            } else if (elapsed > waitTimeout) {
              // 超时后强制释放僵死锁并重试
              Utils.lifecycle.clearInterval(checkInterval);
              Utils.logger.warn('等待播放页超时，强制释放僵死锁并重试');
              Utils.globalLock.release(); // 强制释放
              Utils.lifecycle.setTimeout(() => {
                Utils.logger.info('刷新课程详情页以重试');
                window.location.reload();
              }, 2000);
            }
          }, 5000); // 每5秒检查一次

          return false;
        }

        Utils.logger.debug('查找未完成章节', 'CourseHandler');

        // 尝试所有配置的章节按钮选择器
        let playButtons = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);
        if (playButtons.length === 0) {
          for (const selector of CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS) {
            playButtons = Utils.$$(selector);
            if (playButtons.length > 0) {
              Utils.logger.info(`使用选择器 ${selector} 找到 ${playButtons.length} 个章节按钮`);
              break;
            }
          }
        }

        if (playButtons.length === 0) {
          Utils.logger.error('未找到任何章节按钮');
          return false;
        }

        Utils.logger.info(`找到 ${playButtons.length} 个章节`);

        for (let i = 0; i < playButtons.length; i++) {
          const btn = playButtons[i];
          const row = btn.closest('tr');
          if (!row) continue;

          // 使用统一工具函数提取进度
          let progress = Utils.dom.extractProgressFromRow(row);

          // 如果没找到进度%，检查是否有"已完成"文本
          if (progress === 0 && row.textContent.includes('已完成')) {
            progress = 100;
          }

          if (progress < 100) {
            // 使用统一工具函数提取章节名称
            const chapterName = Utils.dom.extractChapterName(row, i);
            Utils.logger.debug(`找到未完成章节"${chapterName}"（进度：${progress}%），准备点击`, 'CourseHandler');
            UI.updateStatus(`进入章节：${chapterName}（进度：${progress}%）`, 'info');

            const chapterId = btn.getAttribute('data-chapterid');
            const courseId = Utils.url.extractCourseId(window.location.href);

            if (chapterId && courseId) {
              // 修复：在打开播放页之前立即设置临时锁，防止竞态条件
              Utils.globalLock.acquire(courseId);
              Utils.logger.info(`已设置临时锁: ${courseId}，准备打开播放页`);

              let playUrl = `/pc/course/playvideo.do?courseid=${courseId}&chapterid=${chapterId}&bg_mode=1&prev_progress=${progress}`;
              playUrl = new URL(playUrl, window.location.href).href;
              Utils.logger.debug(`强力后台跳转: ${playUrl}`, 'CourseHandler');
              if (typeof GM_openInTab === 'function') {
                GM_openInTab(playUrl, { active: false, insert: true });
              } else {
                window.open(playUrl);
              }
            } else {
              Utils.dom.smartClick(btn, '进入章节');
            }
            return true;
          }
        }

        // 所有章节已完成,但在专题班模式下需要验证列表页实际进度
        Utils.logger.debug('所有章节已完成，验证专题班列表页进度...', 'CourseHandler');
        const currentCourseId = Utils.url.extractCourseId(window.location.href);

        // 异步验证专题班列表页进度
        ThematicHandler.verifyThematicClassProgress(currentCourseId).then((actualProgress) => {
          if (actualProgress >= 0 && actualProgress < 100) {
            // 列表页显示未完成,详情页显示已完成 -> 进度不同步
            Utils.logger.warn(`进度不同步: 详情页100% vs 列表页${actualProgress}%`);
            UI.updateStatus(`等待服务器同步进度... (${actualProgress}%)`, 'warning');

            // 延迟后刷新当前页面重新检查
            Utils.lifecycle.setTimeout(() => {
              Utils.logger.info('刷新课程详情页以重新获取进度');
              sessionStorage.setItem('fromLearningPage', 'true');
              window.location.reload();
            }, 3000);
          } else {
            // 真正完成了,标记为已访问
            Utils.logger.debug('课程真正完成，标记为已访问并返回列表', 'CourseHandler');
            if (currentCourseId) {
              Utils.storage.addVisited(currentCourseId);
              // 清除进度缓存
              sessionStorage.removeItem(`course_progress_${currentCourseId}`);
            }
            UI.updateStatus('课程已完成，返回列表', 'success');
            Utils.lifecycle.setTimeout(() => CourseNavigator.returnToCourseList(), 1000);
          }
        }).catch((e) => {
          // 验证失败,按原逻辑处理
          Utils.logger.warn(`进度验证失败: ${e.message}, 按原逻辑标记为完成`);
          if (currentCourseId) {
            Utils.storage.addVisited(currentCourseId);
          }
          UI.updateStatus('课程已完成，返回列表', 'success');
          Utils.lifecycle.setTimeout(() => CourseNavigator.returnToCourseList(), 1000);
        });

        return false;
      }, '查找未完成章节失败', false);
    }
  };

  /**
   * Shared User Utilities - 共享用户工具模块
   *
   * 提供跨模块共享的工具函数，避免循环依赖。
   */

  /**
   * 对外显示 userId 时进行脱敏处理
   * @param {string} userId - 用户 ID
   * @returns {string}
   */
  function hashUserId(userId) {
    if (!userId || userId.length <= 8) return '[***]';
    return `${userId.substring(0, 4)}***${userId.substring(userId.length - 4)}`;
  }

  /**
   * Cookie Resolver - Cookie 用户解析模块
   */


  /**
   * Cookie 用户解析器
   */
  const CookieResolver = {
    /**
     * 从 Cookie 获取指定名称的值
     * @param {string} name - Cookie 名称
     * @returns {string|null}
     */
    _getCookie: (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },

    /**
     * 从 Cookie 获取 userId
     * @returns {string|null}
     */
    getUserId: () => {
      const USER_ID_COOKIE_NAMES = ['userId', 'userid', 'uid', 'user_id', 'USER_ID'];
      Utils.logger.debug('正在检查 Cookie...', 'PlatformAPI');
      const allCookies = document.cookie.split(';').map(c => c.trim().split('=')[0]);
      Utils.logger.debug(`所有 Cookie 键名 (${allCookies.length} 个)`, 'PlatformAPI');

      const cookieUserId = USER_ID_COOKIE_NAMES.reduce((found, name) => {
        return found || CookieResolver._getCookie(name);
      }, null);

      if (cookieUserId) {
        Utils.logger.debug(`从 Cookie 获取 userId: ${hashUserId(cookieUserId)}`, 'PlatformAPI');
        return cookieUserId;
      }
      Utils.logger.debug(`Cookie 中没有找到 userId (尝试过: ${USER_ID_COOKIE_NAMES.join(', ')})`, 'PlatformAPI');

      // 特殊格式：平台使用 userId 本身作为 Cookie 键名
      Utils.logger.debug('尝试从特殊格式的 Cookie 键名提取 userId...', 'PlatformAPI');
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      for (const cookieKey of allCookies) {
        const match = cookieKey.match(uuidPattern);
        if (match) {
          const extractedUserId = match[0].toUpperCase();
          if (cookieKey.length > 36 && !cookieKey.includes('httpif') && !cookieKey.includes('headmenu')) {
            Utils.logger.debug(`从特殊 Cookie 键名提取 userId: ${hashUserId(extractedUserId)}`, 'PlatformAPI');
            return extractedUserId;
          }
        }
      }
      Utils.logger.debug('特殊格式的 Cookie 键名中未找到有效的 userId', 'PlatformAPI');
      return null;
    }
  };

  /**
   * Storage Resolver - Storage 用户解析模块
   */


  /**
   * Storage 用户解析器
   */
  const StorageResolver = {
    /**
     * 从 sessionStorage 获取 userId
     * @returns {string|null}
     */
    getFromSessionStorage: () => {
      const storedUserId = sessionStorage.getItem('ahgbjy_user_id');
      if (storedUserId) {
        Utils.logger.debug(`从 sessionStorage 获取 userId: ${hashUserId(storedUserId)}`, 'PlatformAPI');
        return storedUserId;
      }
      Utils.logger.debug('sessionStorage 中没有 ahgbjy_user_id', 'PlatformAPI');
      return null;
    },

    /**
     * 从 localStorage 获取 userId
     * @returns {string|null}
     */
    getFromLocalStorage: () => {
      const localUserId = localStorage.getItem('ahgbjy_user_id') ||
                          localStorage.getItem('userId') ||
                          localStorage.getItem('userid') ||
                          localStorage.getItem('USER_ID');
      if (localUserId) {
        Utils.logger.debug(`从 localStorage 获取 userId: ${hashUserId(localUserId)}`, 'PlatformAPI');
        // 同步到 sessionStorage
        sessionStorage.setItem('ahgbjy_user_id', localUserId);
        return localUserId;
      }
      Utils.logger.debug('localStorage 中没有找到 userId', 'PlatformAPI');
      return null;
    },

    /**
     * 保存 userId 到 storage
     * @param {string} userId - 用户 ID
     */
    saveToStorage: (userId) => {
      if (userId) {
        sessionStorage.setItem('ahgbjy_user_id', userId);
        localStorage.setItem('ahgbjy_user_id', userId);
      }
    }
  };

  /**
   * URL Resolver - URL 用户解析模块
   */


  /**
   * URL 用户解析器
   */
  const URLResolver = {
    /**
     * 从 URL 参数获取 userId
     * @returns {string|null}
     */
    getUserId: () => {
      const urlUser = Utils.url.getParam('userid') ||
                      Utils.url.getParam('uid') ||
                      Utils.url.getParam('userID') ||
                      Utils.url.getParam('UserId');
      if (urlUser) {
        Utils.logger.debug(`从 URL 获取 userId: ${hashUserId(urlUser)}`, 'PlatformAPI');
        return urlUser;
      }
      Utils.logger.debug('URL 参数中没有 userid、uid、userID 或 UserId', 'PlatformAPI');
      return null;
    },

    /**
     * 从 referrer 中提取 userID
     * @returns {string|null}
     */
    getFromReferrer: () => {
      Utils.logger.debug('正在检查 referrer 中的 userID...', 'PlatformAPI');

      const referrer = document.referrer;
      if (referrer) {
        const userIDPattern = /[?&](?:userID|UserId|user_id)=([a-zA-Z0-9-]{36})/;
        const match = referrer.match(userIDPattern);
        if (match && match[1]) {
          Utils.logger.debug(`从 referrer 获取 userID: ${hashUserId(match[1])}`, 'PlatformAPI');
          return match[1];
        }
      }

      Utils.logger.debug('referrer 中没有找到 userID', 'PlatformAPI');
      return null;
    }
  };

  /**
   * Element Resolver - 页面元素用户解析模块
   */


  /**
   * 页面元素用户解析器
   */
  const ElementResolver = {
    /**
     * 从页面元素获取 userId
     * @returns {string|null}
     */
    getUserId: () => {
      const hiddenUser = document.querySelector('input[name="userid"], input[id*="userid"], [data-userid]');
      if (hiddenUser) {
        const uid = hiddenUser.value || hiddenUser.getAttribute('data-userid');
        if (uid) {
          Utils.logger.debug(`从页面元素获取 userId: ${hashUserId(uid)}`, 'PlatformAPI');
          return uid;
        }
      }
      Utils.logger.debug('页面元素中没有找到 userid', 'PlatformAPI');
      return null;
    },

    /**
     * 从页面中已有的链接中提取 userID
     * @returns {string|null}
     */
    getFromPageLinks: () => {
      Utils.logger.debug('正在检查页面链接中的 userID...', 'PlatformAPI');

      const links = document.querySelectorAll('a[href]');
      const userIDPattern = /[?&](?:userID|UserId|user_id)=([a-zA-Z0-9-]{36})/;

      for (const link of links) {
        const href = link.getAttribute('href');
        if (href && (href.includes('userID') || href.includes('UserId') || href.includes('user_id'))) {
          const match = href.match(userIDPattern);
          if (match && match[1]) {
            Utils.logger.debug(`从页面链接获取 userID: ${hashUserId(match[1])}`, 'PlatformAPI');
            return match[1];
          }
        }
      }

      Utils.logger.debug('页面链接中没有找到 userID', 'PlatformAPI');
      return null;
    }
  };

  /**
   * Global Resolver - 全局变量用户解析模块
   */


  /**
   * 全局变量用户解析器
   */
  const GlobalResolver = {
    /**
     * 从全局变量获取 userId
     * @returns {string|null}
     */
    getUserId: () => {
      Utils.logger.debug('正在检查全局变量...', 'PlatformAPI');
      const win = window;

      if (win.userInfo?.userId) {
        Utils.logger.debug(`从全局变量 userInfo.userId 获取 userId: ${hashUserId(win.userInfo.userId)}`, 'PlatformAPI');
        return win.userInfo.userId;
      }

      if (win.user?.id) {
        Utils.logger.debug(`从全局变量 user.id 获取 userId: ${hashUserId(win.user.id)}`, 'PlatformAPI');
        return win.user.id;
      }

      if (win.USER?.id) {
        Utils.logger.debug(`从全局变量 USER.id 获取 userId: ${hashUserId(win.USER.id)}`, 'PlatformAPI');
        return win.USER.id;
      }

      if (win.__USER__?.id) {
        Utils.logger.debug(`从全局变量 __USER__.id 获取 userId: ${hashUserId(win.__USER__.id)}`, 'PlatformAPI');
        return win.__USER__.id;
      }

      Utils.logger.debug('全局变量中没有找到 userId (尝试过: userInfo, user, USER, __USER__)', 'PlatformAPI');
      return null;
    },

    /**
     * 从登录信息对象获取 userId
     * @returns {string|null}
     */
    getFromLoginInfo: () => {
      const win = window;

      if (win.__userInfo__?.userId) {
        Utils.logger.debug(`从 __userInfo__.userId 获取 userId: ${hashUserId(win.__userInfo__.userId)}`, 'PlatformAPI');
        return win.__userInfo__.userId;
      }

      if (win.loginUser?.id) {
        Utils.logger.debug(`从 loginUser.id 获取 userId: ${hashUserId(win.loginUser.id)}`, 'PlatformAPI');
        return win.loginUser.id;
      }

      Utils.logger.debug('登录信息对象中没有找到 userId', 'PlatformAPI');
      return null;
    },

    /**
     * 从页面脚本变量获取 userId
     * @returns {string|null}
     */
    getFromScriptVars: () => {
      if (document.readyState === 'loading') {
        Utils.logger.debug('页面仍在加载中，跳过脚本变量检查', 'PlatformAPI');
        return null;
      }

      Utils.logger.debug('正在检查页面脚本变量...', 'PlatformAPI');
      const scriptVars = document.querySelectorAll('script:not([src])');

      const MAX_SCRIPTS_TO_CHECK = 20;
      const scriptsToCheck = Array.from(scriptVars).slice(0, MAX_SCRIPTS_TO_CHECK);
      Utils.logger.debug(`找到 ${scriptVars.length} 个内联脚本，限制检查前 ${scriptsToCheck.length} 个`, 'PlatformAPI');

      const userIdPattern = /(?:userID|userId|UserId|user_id|uid|USER_ID)\s*[:=]\s*['"]?([a-zA-Z0-9-]{36})['"]?/;

      for (const script of scriptsToCheck) {
        const content = script.textContent || '';
        if (!content.includes('user') && !content.includes('User')) {
          continue;
        }
        const match = content.match(userIdPattern);
        if (match && match[1]) {
          Utils.logger.debug(`从脚本变量获取 userId: ${hashUserId(match[1])}`, 'PlatformAPI');
          return match[1];
        }
      }
      Utils.logger.debug('脚本变量中没有找到 userId', 'PlatformAPI');
      return null;
    }
  };

  /**
   * User Resolver - 用户 ID 解析模块汇总
   *
   * 提供从多种数据源获取 userId 的功能。
   */


  /**
   * User ID Cookie 名称列表（按优先级）
   */
  const USER_ID_COOKIE_NAMES = ['userId', 'userid', 'uid', 'user_id', 'USER_ID'];

  /**
   * 用户解析器
   */
  const UserResolver = {
    /**
     * 保存 userId 到 sessionStorage 和 localStorage
     * @param {string} userId - 用户 ID
     */
    _saveToSessionStorage: (userId) => {
      StorageResolver.saveToStorage(userId);
    },

    /**
     * 获取用户 ID（主入口）
     * @returns {string|null}
     */
    getUserId: () => {
      Utils.logger.debug('开始获取 userId...', 'PlatformAPI');
      Utils.logger.debug(`当前 URL: ${window.location.href}`, 'PlatformAPI');

      // 优先级：Storage > URL > Referrer > 元素 > Cookie > 全局变量 > 登录信息 > 脚本变量 > 链接
      return StorageResolver.getFromSessionStorage() ||
             URLResolver.getUserId() ||
             URLResolver.getFromReferrer() ||
             ElementResolver.getUserId() ||
             CookieResolver.getUserId() ||
             StorageResolver.getFromLocalStorage() ||
             GlobalResolver.getUserId() ||
             GlobalResolver.getFromLoginInfo() ||
             GlobalResolver.getFromScriptVars() ||
             ElementResolver.getFromPageLinks() ||
             (Utils.logger.warn(`未找到 userId，API 调用可能失败 (当前页面: ${window.location.pathname})`, 'PlatformAPI'), null);
    }
  };

  /**
   * Request Utilities - 请求工具模块
   *
   * 提供统一的 HTTP 请求封装。
   */


  /**
   * API 配置
   */
  const API_CONFIG = {
    BASE_URL: 'https://www.ahgbjy.gov.cn',
    TIMEOUT: 10000,
  };

  // 模块级状态，用于避免重复警告
  let _warnedNoGMXHR = false;

  /**
   * 生成缓存破坏参数
   * @returns {Object}
   */
  function generateCacheBuster() {
    const randomPart = Math.random().toString();
    return {
      _t: randomPart.substring(0, 18),
      _: Date.now().toString(),
    };
  }

  /**
   * 带超时的 fetch 封装
   * @param {string} url - 请求 URL
   * @param {Object} options - fetch 选项
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<Response>}
   */
  async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 使用 GM_xmlhttpRequest 或 fetch 发起请求
   * @param {string} url - 请求 URL
   * @param {Object} options - 请求选项
   * @returns {Promise<any>}
   */
  function gmRequest(url, options) {
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const body = options.body || null;
    const timeout = options.timeout || 10000;

    if (typeof GM_xmlhttpRequest !== 'undefined') {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          method,
          headers,
          data: body,
          timeout,
          onload: (response) => {
            try {
              if (response.status >= 200 && response.status < 300) {
                const contentType = response.responseHeaders?.['content-type'] || '';
                if (contentType.includes('application/json')) {
                  resolve(JSON.parse(response.responseText));
                } else {
                  resolve(response.responseText);
                }
              } else {
                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
              }
            } catch (error) {
              reject(error);
            }
          },
          onerror: (error) => reject(error),
          ontimeout: () => reject(new Error('请求超时')),
        });
      });
    }

    // 备用：使用 fetch
    if (!_warnedNoGMXHR) {
      Utils.logger.warn('GM_xmlhttpRequest 不可用，使用 fetch 作为备用', 'PlatformAPI');
      _warnedNoGMXHR = true;
    }

    return new Promise((resolve, reject) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOptions = {
          method,
          headers,
          credentials: 'include',
          signal: controller.signal,
        };

        if (body) {
          fetchOptions.body = body;
        }

        fetch(url, fetchOptions)
          .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
              reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
              return;
            }
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              response.json().then(resolve);
            } else {
              response.text().then(resolve);
            }
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              reject(new Error('请求超时'));
            } else {
              reject(error);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 发起 API 请求（统一封装）
   * @param {string} endpoint - API 端点
   * @param {Object} params - 请求参数
   * @param {string} method - 请求方法 GET/POST
   * @returns {Promise<any>}
   */
  async function request(endpoint, params = {}, method = 'GET') {
    const url = new URL(endpoint, API_CONFIG.BASE_URL);

    if (method === 'GET') {
      const cb = generateCacheBuster();
      url.searchParams.append('_t', cb._t);
      url.searchParams.append('_', cb._);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    if (method === 'GET') {
      const userIDFromURL = url.searchParams.get('userID') || url.searchParams.get('UserId');
      if (userIDFromURL && /^[0-9A-F-]{36}$/i.test(userIDFromURL)) {
        const storedUserId = sessionStorage.getItem('ahgbjy_user_id');
        if (!storedUserId) {
          Utils.logger.debug(`从 API 请求 URL 自动提取并保存 userID: ${hashUserId(userIDFromURL)}`, 'PlatformAPI');
          sessionStorage.setItem('ahgbjy_user_id', userIDFromURL);
        }
      }
    }

    const headers = {
      'Accept': 'application/json, text/javascript, */*',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': `${window.location.origin}${window.location.pathname}`,
    };

    let body = null;
    if (method === 'POST') {
      body = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    const options = {
      method,
      headers,
      credentials: 'include',
    };

    if (body) {
      options.body = body;
    }

    try {
      const response = await fetchWithTimeout(url.href, options, API_CONFIG.TIMEOUT);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      Utils.logger.error(`请求失败 ${endpoint}`, error, 'PlatformAPI');
      throw error;
    }
  }

  /**
   * 请求工具对象
   */
  const RequestUtils = {
    API_CONFIG,
    request,
    gmRequest,
    fetchWithTimeout,
    generateCacheBuster,
  };

  /**
   * Course API - 课程相关 API 模块
   *
   * 提供课程查询、章节获取等功能。
   */


  /**
   * 输入验证函数
   */
  const validators = {
    isValidCourseId: (id) => {
      if (typeof id !== 'string') return false;
      return /^[a-zA-Z0-9_-]{6,50}$/.test(id);
    },

    isValidChapterId: (id) => {
      if (typeof id !== 'string') return false;
      return /^[a-zA-Z0-9-]{36}$/.test(id) || /^[a-zA-Z0-9_-]{6,50}$/.test(id);
    }
  };

  /**
   * 课程 API
   */
  const CourseAPI = {
    /**
     * 获取课程章节列表
     * @param {string} courseId - 课程 ID
     * @returns {Promise<Array>}
     */
    getVideoCourseChapter: async (courseId) => {
      if (!courseId) {
        Utils.logger.error('getVideoCourseChapter: 缺少 courseId', null, 'PlatformAPI');
        return [];
      }

      if (!validators.isValidCourseId(courseId)) {
        Utils.logger.error(`getVideoCourseChapter: courseId 格式无效 (${hashUserId(courseId)})`, null, 'PlatformAPI');
        return [];
      }

      try {
        const response = await RequestUtils.request(
          '/pc/course/getVideoCourseChapter.do',
          { courseid: courseId },
          'GET'
        );

        let chapters = [];
        if (Array.isArray(response)) {
          chapters = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          chapters = response.data;
        } else if (response && typeof response === 'object') {
          chapters = response.list || response.chapters || response.result || [];
        }

        chapters = chapters.map((ch) => ({
          ...ch,
          chapterid: ch.chapterid || ch.id || ch.chapterId,
          chaptername: ch.chaptername || ch.name || ch.chapterName || '未知章节',
          progress: ch.progress || ch.learnedPercent || 0,
          duration: ch.duration || (ch.courselen ? Math.ceil(ch.courselen / 60) : 30),
        }));

        Utils.logger.debug(`获取到 ${chapters.length} 个章节`, 'PlatformAPI');
        return chapters;
      } catch (error) {
        Utils.logger.error('getVideoCourseChapter 失败', error, 'PlatformAPI');
        return [];
      }
    },

    /**
     * 批量查询课程状态
     * @param {string|string[]} courseIds - 课程 ID 数组或逗号分隔的字符串
     * @returns {Promise<Object>}
     */
    checkUserCourse: async (courseIds) => {
      const idsStr = Array.isArray(courseIds)
        ? courseIds.join(',')
        : String(courseIds);

      if (!idsStr) {
        Utils.logger.error('checkUserCourse: 缺少 courseIds', null, 'PlatformAPI');
        return {};
      }

      try {
        const response = await RequestUtils.request(
          '/pc/course/checkUserCourse.do',
          { courseids: idsStr },
          'GET'
        );

        let result = {};

        if (Array.isArray(response)) {
          response.forEach(item => {
            const cid = item.courseid || item.id || item.courseId;
            if (cid) {
              result[cid] = {
                status: item.status || item.studyStatus || 'unknown',
                progress: item.progress || item.percent || 0,
                duration: item.duration || item.totalTime || 0,
                chapters: item.chapters || item.chapterCount || 0,
              };
            }
          });
        } else if (response && typeof response === 'object') {
          const data = response.data || response.result || response;
          if (Array.isArray(data)) {
            data.forEach(item => {
              const cid = item.courseid || item.id || item.courseId;
              if (cid) {
                result[cid] = {
                  status: item.status || item.studyStatus || 'unknown',
                  progress: item.progress || item.percent || 0,
                  duration: item.duration || item.totalTime || 0,
                  chapters: item.chapters || item.chapterCount || 0,
                };
              }
            });
          } else if (data && typeof data === 'object') {
            result = data;
          }
        }

        Utils.logger.debug(`批量查询课程状态: ${Object.keys(result).length} 个课程`, 'PlatformAPI');
        return result;
      } catch (error) {
        Utils.logger.error('checkUserCourse 失败', error, 'PlatformAPI');
        return {};
      }
    },

    /**
     * 保存课程学习进度
     * @param {string} courseId - 课程 ID
     * @returns {Promise<boolean>}
     */
    saveUserCourse: async (courseId) => {
      if (!courseId) {
        Utils.logger.error('saveUserCourse: 缺少 courseId', null, 'PlatformAPI');
        return false;
      }

      try {
        Utils.logger.info(`[saveUserCourse] 保存课程进度: courseId=${courseId}`, 'PlatformAPI');
        const response = await RequestUtils.request(
          '/pc/course/saveusercus.do',
          { courseid: courseId },
          'GET'
        );
        Utils.logger.debug(`[saveUserCourse] 响应: ${JSON.stringify(response).substring(0, 100)}...`, 'PlatformAPI');
        return response !== null;
      } catch (error) {
        Utils.logger.error('[saveUserCourse] 请求失败', error, 'PlatformAPI');
        return false;
      }
    }
  };

  /**
   * Progress API - 进度相关 API 模块
   *
   * 提供学习统计、时间追踪等功能。
   */


  /**
   * 进度 API
   */
  const ProgressAPI = {
    /**
     * 获取学习统计详情
     * @param {string} userId - 用户 ID
     * @param {string} courseId - 课程 ID
     * @param {string} chapterId - 章节 ID（可选）
     * @returns {Promise<Array>}
     */
    getPageStudyStatistics: async (userId, courseId, chapterId = null) => {
      if (!courseId) {
        Utils.logger.error('pagestudystatistics: 缺少 courseId', null, 'PlatformAPI');
        return [];
      }

      const requestUrl = '/pc/course/pagestudystatistics.do';
      const pageSize = 100;
      let pageNum = 1;
      let allRecords = [];
      const MAX_PAGES = 50;

      try {
        while (pageNum <= MAX_PAGES) {
          const params = {
            courseid: courseId,
            pagesize: pageSize,
            pagenum: pageNum,
          };
          if (userId) params.userid = userId;
          if (chapterId) params.ccid = chapterId;

          Utils.logger.debug(`请求学习统计 (Page ${pageNum})`, 'PlatformAPI');

          const response = await request(requestUrl, params, 'GET');

          let records = [];
          if (Array.isArray(response)) {
            records = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            records = response.data;
          } else if (response && response.rows && Array.isArray(response.rows)) {
            records = response.rows;
          }

          if (records.length === 0) {
            Utils.logger.debug(`第 ${pageNum} 页无数据，停止翻页`, 'PlatformAPI');
            break;
          }

          Utils.logger.debug(`第 ${pageNum} 页返回 ${records.length} 条记录`, 'PlatformAPI');
          allRecords = allRecords.concat(records);

          if (records.length < pageSize) {
            break;
          }

          pageNum++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        Utils.logger.debug(`学习统计总计: ${allRecords.length} 条记录`, 'PlatformAPI');
        return allRecords;
      } catch (error) {
        Utils.logger.error('pagestudystatistics 失败', error, 'PlatformAPI');
        return allRecords.length > 0 ? allRecords : [];
      }
    },

    /**
     * 学习时间追踪（静音挂机核心）
     * @param {string} type - 操作类型: start/trace/end
     * @param {Object} params - 附加参数
     * @returns {Promise<Object>}
     */
    traceTime: async (type, params = {}) => {
      const endpoint = '/pc/course/tracetime.do';
      const url = new URL(endpoint, API_CONFIG.BASE_URL).href;

      const body = Object.entries({ ...params, type })
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

      const headers = {
        'Accept': 'application/json, text/javascript, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Referer': `${window.location.origin}${window.location.pathname}`,
        'Origin': API_CONFIG.BASE_URL,
      };

      try {
        const response = await gmRequest(url, {
          method: 'POST',
          headers,
          body,
          timeout: 10000,
        });

        let result = response;
        if (typeof response === 'string') {
          try {
            result = JSON.parse(response);
          } catch {
            Utils.logger.warn(`tracetime ${type} 响应解析失败: ${response.substring(0, 100)}`, 'PlatformAPI');
            return null;
          }
        }

        Utils.logger.debug(`tracetime ${type} 响应: ${JSON.stringify(result).substring(0, 100)}...`, 'PlatformAPI');
        return result;
      } catch (error) {
        Utils.logger.error(`tracetime ${type} 失败`, error, 'PlatformAPI');
        return null;
      }
    },

    /**
     * 视频进度追踪
     * @param {string} userId - 用户 ID
     * @param {string} chapterId - 章节 ID
     * @param {number} progress - 进度百分比
     * @returns {Promise<Object|null>}
     */
    videoTrace: async (userId, chapterId, progress) => {
      try {
        const response = await request(
          '/pc/course/videocoursetrace.do',
          {
            userid: userId,
            cid: chapterId,
            progress: Math.round(progress),
          },
          'GET'
        );
        Utils.logger.debug(`videocoursetrace 响应: ${JSON.stringify(response).substring(0, 100)}...`, 'PlatformAPI');
        return response;
      } catch (error) {
        Utils.logger.error('videocoursetrace 失败', error, 'PlatformAPI');
        return null;
      }
    },

    /**
     * 获取章节的实际学习进度
     * @param {string} userId - 用户 ID
     * @param {string} courseId - 课程 ID
     * @param {string} chapterId - 章节 ID
     * @returns {Promise<number>}
     */
    getChapterStudyTime: async (userId, courseId, chapterId) => {
      Utils.logger.debug(`getChapterStudyTime() 调用: userId=${hashUserId(userId)}, courseId=${courseId}, chapterId=${chapterId}`, 'PlatformAPI');
      try {
        const response = await ProgressAPI.getPageStudyStatistics(userId, courseId, chapterId);
        const stats = Array.isArray(response) ? response : (response?.data || []);
        Utils.logger.debug(`getPageStudyStatistics 响应: ${JSON.stringify(stats).substring(0, 200)}...`, 'PlatformAPI');

        if (!stats || stats.length === 0) {
          Utils.logger.debug('无效的响应数据，返回 -1', 'PlatformAPI');
          return -1;
        }

        const data = stats[0];
        const stutime = data?.stutime ||
                        data?.studyTime ||
                        data?.learnedTime ||
                        data?.time ||
                        0;

        Utils.logger.debug(`章节已学习时长: ${stutime}秒`, 'PlatformAPI');
        return stutime;
      } catch (error) {
        Utils.logger.error('获取章节学习时间失败', error, 'PlatformAPI');
        return -1;
      }
    }
  };

  /**
   * Tracker State - 学习追踪状态管理模块
   *
   * 提供学习状态的保存、加载和清除功能。
   */


  /**
   * 追踪状态管理
   */
  const TrackerState = {
    /**
     * 保存学习状态到 sessionStorage
     * @param {Object} state - 学习状态
     */
    saveStudyState: (state) => {
      try {
        sessionStorage.setItem('ahgbjy_study_state', JSON.stringify(state));
        Utils.logger.debug(`学习状态已保存: chapterId=${state.chapterId}, stutime=${state.stutime}, elapsed=${state.elapsed}`, 'PlatformAPI');
      } catch (error) {
        Utils.logger.error('保存学习状态失败', error, 'PlatformAPI');
      }
    },

    /**
     * 从 sessionStorage 加载学习状态
     * @returns {Object|null}
     */
    loadStudyState: () => {
      try {
        const stateStr = sessionStorage.getItem('ahgbjy_study_state');
        if (!stateStr) return null;
        const state = JSON.parse(stateStr);
        Utils.logger.debug(`发现已保存的学习状态: chapterId=${state.chapterId}, stutime=${state.stutime}`, 'PlatformAPI');
        return state;
      } catch (error) {
        Utils.logger.error('加载学习状态失败', error, 'PlatformAPI');
        return null;
      }
    },

    /**
     * 清除已保存的学习状态
     */
    clearStudyState: () => {
      try {
        sessionStorage.removeItem('ahgbjy_study_state');
        Utils.logger.debug('学习状态已清除', 'PlatformAPI');
      } catch (error) {
        Utils.logger.error('清除学习状态失败', error, 'PlatformAPI');
      }
    }
  };

  /**
   * Tracker Worker - 学习追踪器 Web Worker
   *
   * 提供 Web Worker 代码生成，用于后台计时。
   */

  /**
   * 生成 Worker 代码字符串
   * @param {number} startFromProgress - 起始进度（秒）
   * @param {number} duration - 学习时长（秒）
   * @returns {string} Worker 代码
   */
  function generateTrackerWorkerCode(startFromProgress, duration) {
    return `
    let localElapsed = 0;
    let startFromProgress = ${startFromProgress};
    let duration = ${duration};
    let interval = null;
    let isActive = false;

    function sendTick() {
      const totalElapsed = startFromProgress + localElapsed;
      const totalDuration = duration + startFromProgress;
      const percent = Math.min(100, Math.round((totalElapsed / totalDuration) * 100));
      postMessage({
        type: 'tick',
        localElapsed,
        totalElapsed,
        percent,
      });
    }

    self.onmessage = function(e) {
      const data = e.data;
      if (data.type === 'start') {
        if (isActive) return;
        isActive = true;
        localElapsed = 0;
        sendTick();
        interval = setInterval(() => {
          if (isActive) {
            localElapsed += 1;
            sendTick();
            if (localElapsed >= duration) {
              clearInterval(interval);
              postMessage({ type: 'complete' });
            }
          }
        }, 1000);
      } else if (data.type === 'pause') {
        isActive = false;
      } else if (data.type === 'resume') {
        if (!isActive && interval) isActive = true;
      } else if (data.type === 'stop') {
        isActive = false;
        if (interval) clearInterval(interval);
        postMessage({ type: 'stopped' });
      }
    };
  `;
  }

  /**
   * 创建 Worker 实例
   * @param {number} startFromProgress - 起始进度（秒）
   * @param {number} duration - 学习时长（秒）
   * @returns {Worker} Worker 实例
   */
  function createTrackerWorker(startFromProgress, duration) {
    const workerCode = generateTrackerWorkerCode(startFromProgress, duration);
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    return new Worker(workerUrl);
  }

  /**
   * Tracker Index - 学习追踪器模块汇总
   *
   * 提供学习追踪功能，包含 Web Worker 支持。
   */


  const { traceTime, videoTrace, getPageStudyStatistics } = ProgressAPI;

  /**
   * 学习时间追踪状态
   */
  const StudyTimeState = {
    IDLE: 'idle',
    STARTED: 'started',
    TRACE: 'trace',
    ENDING: 'ending',
  };

  /**
   * 学习追踪器
   */
  const StudyTracker = {
    _studyTimeState: StudyTimeState.IDLE,
    _studyTimeInterval: null,
    _traceStartTime: null,
    _currentTraceParams: null,
    _warnedNoGMXHR: false,
    _studyTrackerWorker: null,

    // 状态管理委托
    _saveStudyState: TrackerState.saveStudyState,
    _loadStudyState: TrackerState.loadStudyState,
    _clearStudyState: TrackerState.clearStudyState,

    /**
     * 创建学习追踪器
     * @param {Object} options - 配置选项
     * @returns {Object} 控制器对象 { start, stop, pause, resume }
     */
    createTracker: (options) => {
      const {
        userId,
        courseId,
        chapterId,
        duration = 1800,
        onProgress = () => {},
        onComplete = () => {},
        onError = (err) => console.error(err),
        onStart = () => {},
      } = options;

      let traceId = null;
      let elapsed = 0;
      let traceTimerId = null;
      let trackerWorker = null;

      const TRACE_INTERVAL = Math.min(
        CONFIG.PLATFORM_API.TRACE_INTERVAL_MAX,
        Math.max(CONFIG.PLATFORM_API.TRACE_INTERVAL_MIN, Math.floor(duration / 10))
      );

      const start = async () => {
        if (StudyTracker._studyTimeState !== StudyTimeState.IDLE) {
          Utils.logger.warn(`学习追踪器已在运行 (当前状态: ${StudyTracker._studyTimeState})`, 'PlatformAPI');
          onError('学习追踪器已在运行');
          return false;
        }

        if (!chapterId) {
          onError(`缺少必要参数: chapterId=${chapterId}`);
          return false;
        }

        const effectiveUserId = userId || '';

        Utils.logger.debug(`studyTimeTracker.start() 参数: courseId=${courseId}, chapterId=${chapterId}, duration=${duration}`, 'PlatformAPI');

        try {
          const startResult = await traceTime('start', {
            course_type: '1',
            user: effectiveUserId,
            resource_id: chapterId,
          });

          traceId = startResult?.data?.traceid || startResult?.traceid;
          const realUserId = startResult?.data?.userid || startResult?.data?.userId || userId || '';

          if (!traceId) {
            onError('start 响应无 traceId', 'PlatformAPI');
            return false;
          }

          Utils.logger.debug(`获取到 userid: ${hashUserId(realUserId)}`, 'PlatformAPI');

          let actualProgress = 0;
          const isDetailPage = window.location.href.includes('coursedetail.do');

          if (courseId && realUserId && chapterId) {
            try {
              Utils.logger.debug(`查询章节进度: userId=${hashUserId(realUserId)}, courseId=${courseId}, chapterId=${chapterId}`, 'PlatformAPI');

              const response = await getPageStudyStatistics(realUserId, courseId, chapterId);
              const stats = Array.isArray(response) ? response : (response?.data || []);
              Utils.logger.debug(`pagestudystatistics 响应共 ${stats.length} 条记录`, 'PlatformAPI');

              if (Array.isArray(stats)) {
                const matchedItems = stats.filter(item =>
                  item.chapterid === chapterId ||
                  item.chapterid === `ccid_${chapterId}` ||
                  item.id === chapterId ||
                  item.chapterId === chapterId
                );

                if (matchedItems.length > 0) {
                  const totalProgress = matchedItems.reduce((sum, item) => {
                    const itemCost = item.cost || item.stutime || item.studyTime || 0;
                    return sum + itemCost;
                  }, 0);
                  actualProgress = totalProgress;
                  Utils.logger.debug(`累加进度: ${actualProgress}秒 (共 ${matchedItems.length} 条学习记录)`, 'PlatformAPI');
                }
              }

              if (actualProgress > 0) {
                Utils.logger.info(`服务器端记录的学习时间: ${actualProgress}秒`, 'PlatformAPI');
              }
            } catch (e) {
              Utils.logger.error('查询章节进度失败', e, 'PlatformAPI');
            }
          } else if (!isDetailPage) {
            Utils.logger.debug('跳过进度查询（缺少参数）', 'PlatformAPI');
            try {
              const savedProgress = sessionStorage.getItem('ahgbjy_chapter_learned_time');
              if (savedProgress) {
                const progressData = JSON.parse(savedProgress);
                if (progressData.chapterId === chapterId) {
                  actualProgress = progressData.learnedTime || 0;
                  if (actualProgress > 0) {
                    Utils.logger.info(`从 sessionStorage 读取预存进度: ${actualProgress}秒`, 'PlatformAPI');
                  }
                  sessionStorage.removeItem('ahgbjy_chapter_learned_time');
                }
              }
            } catch (e) {
              Utils.logger.error('读取预存进度失败', e, 'PlatformAPI');
            }
          }

          if (actualProgress >= duration) {
            Utils.logger.info(`章节 ${chapterId} 已完成 (${actualProgress}s >= ${duration}s)，跳过学习`, 'PlatformAPI');
            StudyTracker._clearStudyState();
            await traceTime('end', {
              course_type: '1',
              user: effectiveUserId,
              resource_id: chapterId,
              trace_id: traceId,
            });
            onComplete();
            return false;
          }

          const startFromProgress = actualProgress;
          elapsed = actualProgress;
          StudyTracker._studyTimeState = StudyTimeState.STARTED;
          Utils.logger.debug(`学习追踪已开始, 从 ${startFromProgress}秒继续学习, 剩余: ${duration}秒`, 'PlatformAPI');

          // 创建 Web Worker
          try {
            const worker = createTrackerWorker(startFromProgress, duration);

            worker.onmessage = (e) => {
              const data = e.data;
              if (data.type === 'tick') {
                elapsed = data.totalElapsed;
                if (data.localElapsed % 30 === 0 || data.localElapsed === 1) {
                  Utils.logger.debug(`onProgress: 本次=${data.localElapsed}s, 总计=${elapsed}s, 剩余=${duration - data.localElapsed}s`, 'PlatformAPI');
                }
                onProgress(data.localElapsed, duration);
              } else if (data.type === 'complete') {
                stop().then(() => onComplete());
              }
            };

            worker.postMessage({ type: 'start' });
            Utils.logger.debug('学习进度追踪 Worker 已启动', 'PlatformAPI');
            trackerWorker = worker;
          } catch (error) {
            Utils.logger.error('创建 Worker 失败，回退到主线程定时器', error, 'PlatformAPI');

            let fallbackLocalElapsed = 0;
            const fallbackTimerId = setInterval(() => {
              fallbackLocalElapsed += 1;
              elapsed = startFromProgress + fallbackLocalElapsed;

              if (fallbackLocalElapsed % 30 === 0 || fallbackLocalElapsed === 1) {
                Utils.logger.debug(`onProgress(回退模式): 本次=${fallbackLocalElapsed}s, 总计=${elapsed}s, 剩余=${duration - fallbackLocalElapsed}s`, 'PlatformAPI');
              }

              onProgress(fallbackLocalElapsed, duration);

              if (fallbackLocalElapsed >= duration) {
                clearInterval(fallbackTimerId);
                stop().then(() => onComplete());
              }
            }, 1000);

            trackerWorker = { _isFallback: true, _timerId: fallbackTimerId };
          }

          // 启动 trace 定时器
          traceTimerId = setInterval(async () => {
            const totalStudytime = elapsed;
            const traceParams = {
              course_type: '1',
              user: effectiveUserId,
              resource_id: chapterId,
              trace_id: traceId,
              studytime: Math.floor(totalStudytime),
            };

            const totalDuration = duration + startFromProgress;
            const progressPercent = Math.min(100, Math.round((totalStudytime / totalDuration) * 100));

            await traceTime('trace', traceParams);
            await videoTrace(effectiveUserId, chapterId, progressPercent);
          }, TRACE_INTERVAL);

          onStart();
          return true;
        } catch (error) {
          onError(`启动失败: ${error.message}`);
          return false;
        }
      };

      const stop = async () => {
        try {
          if (userId && chapterId) {
            await videoTrace(userId, chapterId, 100);
            Utils.logger.debug('学习完成，同步最终进度 100%', 'PlatformAPI');
          }

          const endParams = {
            course_type: '1',
            user: userId,
            resource_id: chapterId,
            studytime: Math.floor(elapsed),
          };

          if (traceId) {
            endParams.trace_id = traceId;
          }

          await traceTime('end', endParams);
          Utils.logger.debug(`学习追踪已结束，总计: ${elapsed}秒`, 'PlatformAPI');

          StudyTracker._clearStudyState();
        } catch (error) {
          Utils.logger.error('结束追踪失败', error, 'PlatformAPI');
        }

        if (traceTimerId) clearInterval(traceTimerId);

        if (trackerWorker) {
          if (trackerWorker._isFallback) {
            clearInterval(trackerWorker._timerId);
          } else {
            try {
              trackerWorker.postMessage({ type: 'stop' });
              trackerWorker.terminate();
            } catch {
              // Worker 可能已终止，忽略错误
            }
          }
          trackerWorker = null;
        }

        StudyTracker._studyTimeState = StudyTimeState.IDLE;
        elapsed = 0;
        traceId = null;
      };

      const pause = () => {
        if (trackerWorker && !trackerWorker._isFallback) {
          trackerWorker.postMessage({ type: 'pause' });
          Utils.logger.debug('学习追踪已暂停', 'PlatformAPI');
        }
      };

      const resume = () => {
        if (trackerWorker && !trackerWorker._isFallback) {
          trackerWorker.postMessage({ type: 'resume' });
          Utils.logger.debug('学习追踪已恢复', 'PlatformAPI');
        }
      };

      return { start, stop, pause, resume };
    }
  };

  /**
   * User Diagnostics - 用户诊断工具模块
   *
   * 提供 userId 诊断功能。
   */


  /**
   * 用户诊断工具
   */
  const UserDiagnostics = {
    /**
     * 诊断 userId 获取问题
     * @returns {Object} 诊断报告
     */
    diagnoseUserId: () => {
      const report = {
        timestamp: new Date().toISOString(),
        currentUrl: window.location.href,
        pathname: window.location.pathname,
        findings: [],
        recommendedActions: [],
      };

      Utils.logger.info('========== userId 诊断开始 ==========', 'PlatformAPI');
      Utils.logger.info(`当前页面: ${window.location.pathname}`, 'PlatformAPI');
      Utils.logger.info(`完整 URL: ${window.location.href}`, 'PlatformAPI');

      // 1. 检查 sessionStorage
      Utils.logger.info('\n【1/8】检查 sessionStorage...', 'PlatformAPI');
      const sessionKeys = Object.keys(sessionStorage);
      Utils.logger.info(`  找到 ${sessionKeys.length} 个键`, 'PlatformAPI');

      let sessionUserId = null;
      sessionKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (key.toLowerCase().includes('user') || key.toLowerCase().includes('id')) {
          Utils.logger.info(`  - ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`, 'PlatformAPI');
        }
        if (value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
          if (!sessionUserId) {
            sessionUserId = value;
            Utils.logger.info(`  ✓ 发现可能的 userId: ${hashUserId(value)}`, 'PlatformAPI');
          }
        }
      });

      if (sessionUserId) {
        report.findings.push({ location: 'sessionStorage', userId: sessionUserId, confidence: 'high' });
      } else {
        report.findings.push({ location: 'sessionStorage', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 2. 检查 URL 参数
      Utils.logger.info('\n【2/8】检查 URL 参数...', 'PlatformAPI');
      const urlParams = new URLSearchParams(window.location.search);
      const paramNames = Array.from(urlParams.keys());
      Utils.logger.info(`  找到 ${paramNames.length} 个参数`, 'PlatformAPI');

      let urlUserId = null;
      paramNames.forEach(param => {
        const value = urlParams.get(param);
        Utils.logger.info(`  - ${param}: ${value}`, 'PlatformAPI');
        if (param.toLowerCase().includes('user') || param.toLowerCase().includes('uid') || param.toLowerCase().includes('id')) {
          if (value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            urlUserId = value;
            Utils.logger.info(`  ✓ 发现可能的 userId: ${hashUserId(value)}`, 'PlatformAPI');
          }
        }
      });

      if (urlUserId) {
        report.findings.push({ location: 'URL参数', userId: urlUserId, confidence: 'high' });
      } else {
        report.findings.push({ location: 'URL参数', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 3. 检查页面元素
      Utils.logger.info('\n【3/8】检查页面元素...', 'PlatformAPI');
      const possibleSelectors = [
        'input[name="userid"]', 'input[name="userId"]', 'input[name="uid"]',
        '#userid', '#userId', '#uid', '[data-userid]', '[data-user-id]',
      ];

      let elementUserId = null;
      possibleSelectors.forEach(selector => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            const inputEl = element;
            let value = null;
            if ('value' in inputEl && inputEl.value) {
              value = inputEl.value;
            } else if (element.textContent) {
              value = element.textContent;
            } else {
              const attr = element.getAttribute?.('content');
              if (attr) value = attr;
            }
            if (value) {
              Utils.logger.info(`  - ${selector}: ${String(value).substring(0, 50)}`, 'PlatformAPI');
              if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value))) {
                elementUserId = String(value);
                Utils.logger.info(`  ✓ 发现可能的 userId: ${hashUserId(String(value))}`, 'PlatformAPI');
              }
            }
          }
        } catch {
          // 忽略无效选择器
        }
      });

      if (elementUserId) {
        report.findings.push({ location: '页面元素', userId: elementUserId, confidence: 'medium' });
      } else {
        report.findings.push({ location: '页面元素', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 4. 检查 Cookie
      Utils.logger.info('\n【4/8】检查 Cookie...', 'PlatformAPI');
      const cookies = document.cookie.split(';').map(c => {
        const [key, ...valueParts] = c.trim().split('=');
        return { key, value: valueParts.join('=') };
      });
      Utils.logger.info(`  找到 ${cookies.length} 个 Cookie`, 'PlatformAPI');

      let cookieUserId = null;
      const specialFormatCookies = [];

      cookies.forEach(({ key, value }) => {
        Utils.logger.info(`  - ${key}: ${value?.substring(0, 30)}${value?.length > 30 ? '...' : ''}`, 'PlatformAPI');

        if (USER_ID_COOKIE_NAMES.includes(key)) {
          if (value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            cookieUserId = value;
            Utils.logger.info(`  ✓ 发现 userId: ${hashUserId(value)}`, 'PlatformAPI');
          }
        }

        const uuidMatch = key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        if (uuidMatch) {
          const extractedUserId = uuidMatch[0].toUpperCase();
          specialFormatCookies.push({ key, extractedUserId });
          Utils.logger.info(`  ✓ 特殊格式 Cookie 键名包含 UUID: ${hashUserId(extractedUserId)}`, 'PlatformAPI');
        }
      });

      if (cookieUserId) {
        report.findings.push({ location: 'Cookie(常规)', userId: cookieUserId, confidence: 'high' });
      } else if (specialFormatCookies.length > 0) {
        report.findings.push({ location: 'Cookie(特殊格式)', userId: specialFormatCookies[0].extractedUserId, confidence: 'medium' });
        Utils.logger.info(`  ✓ 推荐使用特殊格式 Cookie 的 UUID: ${hashUserId(specialFormatCookies[0].extractedUserId)}`, 'PlatformAPI');
      } else {
        report.findings.push({ location: 'Cookie', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 5. 检查 localStorage
      Utils.logger.info('\n【5/8】检查 localStorage...', 'PlatformAPI');
      const localKeys = Object.keys(localStorage);
      Utils.logger.info(`  找到 ${localKeys.length} 个键`, 'PlatformAPI');

      let localUserId = null;
      localKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (key.toLowerCase().includes('user') || key.toLowerCase().includes('id')) {
          Utils.logger.info(`  - ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`, 'PlatformAPI');
        }
        if (value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
          if (!localUserId) {
            localUserId = value;
            Utils.logger.info(`  ✓ 发现可能的 userId: ${hashUserId(value)}`, 'PlatformAPI');
          }
        }
      });

      if (localUserId) {
        report.findings.push({ location: 'localStorage', userId: localUserId, confidence: 'high' });
      } else {
        report.findings.push({ location: 'localStorage', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 6. 检查全局变量
      Utils.logger.info('\n【6/8】检查全局变量...', 'PlatformAPI');
      const globalVarNames = ['userInfo', 'user', 'USER', '__USER__', 'currentUser', 'appUser', 'loginUser'];
      let globalUserId = null;

      globalVarNames.forEach(varName => {
        if (window[varName] !== undefined) {
          Utils.logger.info(`  - ${varName}: ${JSON.stringify(window[varName]).substring(0, 100)}`, 'PlatformAPI');
          try {
            const obj = window[varName];
            if (obj && typeof obj === 'object') {
              const possibleId = obj.userId || obj.userid || obj.uid || obj.id || obj.user_id;
              if (possibleId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(possibleId)) {
                globalUserId = possibleId;
                Utils.logger.info(`  ✓ 发现 userId: ${hashUserId(possibleId)}`, 'PlatformAPI');
              }
            }
          } catch {
            Utils.logger.debug(`    无法解析 ${varName}`, 'PlatformAPI');
          }
        }
      });

      if (globalUserId) {
        report.findings.push({ location: '全局变量', userId: globalUserId, confidence: 'medium' });
      } else {
        report.findings.push({ location: '全局变量', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 7. 检查内联脚本变量
      Utils.logger.info('\n【7/8】检查页面脚本变量...', 'PlatformAPI');
      const scripts = document.querySelectorAll('script:not([src])');
      Utils.logger.info(`  找到 ${scripts.length} 个内联脚本`, 'PlatformAPI');

      let scriptUserId = null;
      const maxScriptsToCheck = 10;

      scripts.forEach((script, index) => {
        if (index >= maxScriptsToCheck) return;

        const content = script.textContent;
        const patterns = [
          /var\s+userId\s*=\s*['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/i,
          /let\s+userId\s*=\s*['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/i,
          /const\s+userId\s*=\s*['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/i,
          /userId\s*[:=]\s*['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/i,
        ];

        patterns.forEach(pattern => {
          const match = content.match(pattern);
          if (match && !scriptUserId) {
            scriptUserId = match[1].toUpperCase();
            Utils.logger.info(`  ✓ 在脚本 ${index + 1} 中发现 userId: ${hashUserId(scriptUserId)}`, 'PlatformAPI');
          }
        });
      });

      if (scriptUserId) {
        report.findings.push({ location: '内联脚本', userId: scriptUserId, confidence: 'medium' });
      } else {
        report.findings.push({ location: '内联脚本', userId: null, confidence: 'none' });
        Utils.logger.warn('  ✗ 未找到 userId', 'PlatformAPI');
      }

      // 8. 生成诊断总结
      Utils.logger.info('\n========== 诊断总结 ==========', 'PlatformAPI');

      const findingsWithUserId = report.findings.filter(f => f.userId);
      if (findingsWithUserId.length > 0) {
        Utils.logger.info(`✓ 在 ${findingsWithUserId.length} 个位置找到可能的 userId:`, 'PlatformAPI');
        findingsWithUserId.forEach(finding => {
          Utils.logger.info(`  - ${finding.location} (${finding.confidence} 置信度): ${hashUserId(finding.userId)}`, 'PlatformAPI');
        });

        const prioritized = findingsWithUserId.sort((a, b) => {
          const confidenceOrder = { high: 3, medium: 2, low: 1 };
          return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
        })[0];

        Utils.logger.info(`\n推荐操作:`, 'PlatformAPI');
        Utils.logger.info(`  1. 使用来自 ${prioritized.location} 的 userId (置信度: ${prioritized.confidence})`, 'PlatformAPI');

        report.recommendedActions.push({
          type: 'use_found',
          location: prioritized.location,
          userId: prioritized.userId,
          confidence: prioritized.confidence,
        });
      } else {
        Utils.logger.warn('✗ 未在任何位置找到 userId', 'PlatformAPI');
        Utils.logger.info('\n可能的原因:', 'PlatformAPI');
        Utils.logger.info('  1. 未登录平台', 'PlatformAPI');
        Utils.logger.info('  2. 平台更新了认证机制', 'PlatformAPI');
        Utils.logger.info('  3. userId 存储在未检查的位置', 'PlatformAPI');

        report.recommendedActions.push({
          type: 'not_found',
          message: '请确认登录状态或联系开发者更新 userId 查找逻辑',
        });
      }

      Utils.logger.info('\n====================================\n', 'PlatformAPI');

      return report;
    }
  };

  /**
   * PlatformAPI Module - 平台 API 适配层（主入口）
   *
   * 提供对平台后端 API 的直接访问，支持：
   * - getVideoCourseChapter.do: 获取课程章节列表
   * - pagestudystatistics.do: 学习统计详情
   * - tracetime.do: 学习时间追踪
   *
   * 优势：减少 DOM 依赖，提高性能和稳定性
   */


  /**
   * 学习状态管理
   */
  const _studyState = {
    _studyTimeState: StudyTimeState.IDLE,
    _studyTimeInterval: null,
    _traceStartTime: null,
    _currentTraceParams: null,
    _warnedNoGMXHR: false,
    _studyTrackerWorker: null,

    _saveStudyState: (state) => {
      try {
        sessionStorage.setItem('ahgbjy_study_state', JSON.stringify(state));
        Utils.logger.debug(`学习状态已保存: chapterId=${state.chapterId}, stutime=${state.stutime}, elapsed=${state.elapsed}`, 'PlatformAPI');
      } catch (error) {
        Utils.logger.error('保存学习状态失败', error, 'PlatformAPI');
      }
    },

    _loadStudyState: () => {
      try {
        const stateStr = sessionStorage.getItem('ahgbjy_study_state');
        if (!stateStr) return null;
        const state = JSON.parse(stateStr);
        Utils.logger.debug(`发现已保存的学习状态: chapterId=${state.chapterId}, stutime=${state.stutime}`, 'PlatformAPI');
        return state;
      } catch (error) {
        Utils.logger.error('加载学习状态失败', error, 'PlatformAPI');
        return null;
      }
    },

    _clearStudyState: () => {
      try {
        sessionStorage.removeItem('ahgbjy_study_state');
        Utils.logger.debug('学习状态已清除', 'PlatformAPI');
      } catch (error) {
        Utils.logger.error('清除学习状态失败', error, 'PlatformAPI');
      }
    }
  };

  /**
   * PlatformAPI 主对象
   */
  const PlatformAPI = {
    // 继承学习状态
    ..._studyState,

    // 导入学习状态方法
    _saveStudyState: _studyState._saveStudyState,
    _loadStudyState: _studyState._loadStudyState,
    _clearStudyState: _studyState._clearStudyState,

    // 导入子模块功能
    hashUserId,
    validators,
    StudyTimeState,

    // 用户相关
    getUserId: UserResolver.getUserId,
    setUserId: (userId) => {
      if (userId) {
        sessionStorage.setItem('ahgbjy_user_id', userId);
        Utils.logger.debug(`保存 userId 到 sessionStorage: ${hashUserId(userId)}`, 'PlatformAPI');
      }
    },

    // 课程相关 API
    getVideoCourseChapter: CourseAPI.getVideoCourseChapter,
    checkUserCourse: CourseAPI.checkUserCourse,
    saveUserCourse: CourseAPI.saveUserCourse,

    // 进度相关 API
    getPageStudyStatistics: ProgressAPI.getPageStudyStatistics,
    traceTime: ProgressAPI.traceTime,
    videoTrace: ProgressAPI.videoTrace,
    getChapterStudyTime: ProgressAPI.getChapterStudyTime,

    // 学习追踪器
    studyTimeTracker: (options) => {
      const tracker = StudyTracker.createTracker(options);
      return {
        start: tracker.start,
        stop: tracker.stop,
        pause: tracker.pause,
        resume: tracker.resume,
      };
    },

    // 诊断工具
    diagnoseUserId: UserDiagnostics.diagnoseUserId,

    /**
     * 混合模式：智能选择 API 或 DOM 获取章节信息
     * @param {string} courseId - 课程 ID
     * @returns {Promise<Array|null>}
     */
    getChapterList: async (courseId) => {
      const chapters = await CourseAPI.getVideoCourseChapter(courseId);
      if (chapters && chapters.length > 0) {
        Utils.logger.debug(`优先使用 API 获取章节列表 (${chapters.length} 个)`, 'PlatformAPI');
        return chapters;
      }
      Utils.logger.debug('API 获取失败，回退到 DOM 解析', 'PlatformAPI');
      return null;
    },

    /**
     * 获取学习进度（混合模式）
     * @param {string} userId - 用户 ID
     * @param {string} courseId - 课程 ID
     * @param {string} chapterId - 章节 ID（可选）
     * @returns {Promise<Object|null>}
     */
    getStudyProgress: async (userId, courseId, chapterId = null) => {
      const stats = await ProgressAPI.getPageStudyStatistics(userId, courseId, chapterId);
      return stats;
    },

    /**
     * 检查 API 是否可用
     * @returns {Promise<boolean>}
     */
    isAvailable: async () => {
      try {
        const courseId = Utils.url.extractCourseId(window.location.href);
        const chapterId = Utils.url.extractChapterId(window.location.href);
        const userId = UserResolver.getUserId();

        Utils.logger.debug(`检测静音挂机 API 可用性... UserId: ${hashUserId(userId)}, CourseId: ${courseId}, ChapterId: ${chapterId}`, 'PlatformAPI');

        if (!userId || !courseId || !chapterId) {
          Utils.logger.debug('缺少必要参数', 'PlatformAPI');
          return false;
        }

        const testParams = {
          type: 'start',
          course_type: '1',
          user: userId,
          resource_id: chapterId,
          plantime: '60',
        };

        const response = await request('/pc/course/tracetime.do', testParams, 'POST');

        Utils.logger.debug(`tracetime.do 响应: ${JSON.stringify(response).substring(0, 100)}...`, 'PlatformAPI');
        return response !== null;
      } catch (error) {
        Utils.logger.error('API 检测失败', error, 'PlatformAPI');
        return false;
      }
    }
  };

  /**
   * Silent Mode - 静音模式模块
   *
   * 提供静音挂机相关功能：startSilentMode, directStudyFromListPage, directStudyFromThematicClass
   */


  /**
   * 静音模式处理器
   */
  const SilentMode = {
    /**
     * 启动静音挂机模式（使用 tracetime.do）
     * @param {Object} options - 配置选项
     * @returns {Object|null} 追踪器控制器
     */
    startSilentMode: (options) => {
      // 验证 options 参数
      if (!options || typeof options !== 'object') {
        Utils.logger.warn('startSilentMode 参数无效');
        return null;
      }

      const {
        duration = 1800, // 默认30分钟
        courseId,
        chapterId,
        userId,
        chapterName,
        courseTitle,
        onProgress,
        onComplete,
        onError,
      } = options;

      if (!chapterId) {
        Utils.logger.warn(`缺少必要参数: chapterId=${chapterId}`);
        return null;
      }

      if (!courseId) {
        Utils.logger.warn(`缺少必要参数: courseId=${courseId}`);
        return null;
      }

      if (typeof duration !== 'number' || duration <= 0) {
        Utils.logger.warn(`无效的学习时长: duration=${duration}`);
        return null;
      }

      // userId 可为 null（某些 API 可能不需要）
      Utils.logger.info(`启动静音模式: userId=${userId || 'null'}, chapterId=${chapterId}, courseId=${courseId}, duration=${duration}s`);

      return Utils.safeExecute(() => {

        const tracker = PlatformAPI.studyTimeTracker({
          duration,
          courseId,
          chapterId,
          userId,
          onStart: () => {
            // 发送学习开始通知
            Utils.notificationService.notifyChapterStart({
              chapterName: chapterName || `章节 ${chapterId}`,
              courseTitle: courseTitle || '未知课程',
              duration,
            });
            // 更新UI显示进度信息
            UI.updateBackgroundStatus(true, {
              chapterName: chapterName || `章节 ${chapterId}`,
              courseTitle: courseTitle || '未知课程',
              percent: 0,
            });
          },
          onProgress: (elapsed, total) => {
            onProgress?.(elapsed, total);
          },
          onComplete: () => {
            Utils.logger.info('静默学习完成');
            UI.updateStatus('静默学习已完成', 'success');
            onComplete?.();
          },
          onError: (err) => {
            Utils.logger.error(`静默学习错误: ${err}`);
            onError?.(err);
          },
        });

        const started = tracker.start();
        if (started) {
          Utils.logger.info(`静默模式已启动: 课程=${courseId}, 时长=${duration}秒`);
          UI.updateStatus('静默模式已启动', 'info');
        }

        return started ? tracker : null;
      }, '启动静音模式失败', null);
    },

    /**
     * 列表页直接学习（完全跳过播放页）
     * @param {Object} options - 配置选项
     * @returns {Promise<Object|null>}
     */
    directStudyFromListPage: async (options) => {
      const {
        courseId,
        courseTitle = '未知课程',
        onError = () => {},
      } = options;

      if (!courseId) {
        Utils.logger.error('directStudyFromListPage: 缺少 courseId');
        onError('缺少 courseId');
        return null;
      }

      return Utils.safeExecute(async () => {
        Utils.logger.info(`开始列表页直接学习: ${courseTitle} (${courseId})`);

        // 保存课程标题供后续使用
        sessionStorage.setItem('ahgbjy_current_course_title', courseTitle);

        // 1. 先跳转到详情页获取准确的章节信息
        Utils.logger.info('跳转到详情页获取准确章节信息...');

        // 保存上下文到 sessionStorage
        sessionStorage.setItem('ahgbjy_pending_course', JSON.stringify({
          courseId,
          courseTitle,
          fromListPage: true,
        }));

        // 跳转到详情页（使用 fetch_chapter 模式获取章节）
        const detailUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseId}&fetch_chapter=1`;
        window.location.href = detailUrl;

        onError('正在获取章节信息...');
        return null;
      }, '列表页直接学习失败', null);
    },

    /**
     * 专题班直接学习（使用静默模式）
     * @param {Object} options - 配置选项
     * @returns {Promise<Object|null>}
     */
    directStudyFromThematicClass: async (options) => {
      const {
        courseId,
        courseTitle = '未知课程',
        thematicClassId,
        onError = () => {},
      } = options;

      if (!courseId) {
        Utils.logger.error('directStudyFromThematicClass: 缺少 courseId');
        onError('缺少 courseId');
        return null;
      }

      if (!thematicClassId) {
        Utils.logger.error('directStudyFromThematicClass: 缺少 thematicClassId');
        onError('缺少专题班ID');
        return null;
      }

      return Utils.safeExecute(async () => {
        Utils.logger.info(`开始专题班直接学习: ${courseTitle} (${courseId}), 专题班: ${thematicClassId}`);

        // 保存课程标题供后续使用
        sessionStorage.setItem('ahgbjy_current_course_title', courseTitle);

        // 跳转到详情页（使用 fetch_chapter 模式获取章节）
        // 注意：不要调用 onError，Router.js 会通过返回值 null 判断正在跳转
        const detailUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseId}&fetch_chapter=1&thm=1&tid=${thematicClassId}`;
        window.location.href = detailUrl;
        return null;
      }, '专题班直接学习失败', null);
    }
  };

  /**
   * Progress Validator - 进度验证模块
   *
   * 提供进度验证功能：verifyProgressViaAPI, hybridProgressCheck, getEnhancedChapterInfo
   */


  /**
   * 进度验证器
   */
  const ProgressValidator = {
    /**
     * 使用 API 验证学习进度
     * @param {string} userId - 用户 ID
     * @param {string} courseId - 课程 ID
     * @param {string} chapterId - 章节 ID
     * @returns {Promise<Object|null>}
     */
    verifyProgressViaAPI: async (userId, courseId, chapterId = null) => {

      return Utils.safeExecute(async () => {
        const stats = await PlatformAPI.getStudyProgress(userId, courseId, chapterId);
        if (stats) {
          Utils.logger.info('API 进度验证成功');
          return stats;
        }
        return null;
      }, 'API 验证进度失败', null);
    },

    /**
     * 获取增强的章节信息（优先 API，回退 DOM）
     * @param {string} courseId - 课程 ID
     * @returns {Promise<Object>}
     */
    getEnhancedChapterInfo: async (courseId) => {
      // 1. 优先尝试 API
      const apiChapters = await ProgressValidator.getChaptersViaAPI(courseId);
      if (apiChapters && apiChapters.length > 0) {
        return { chapters: apiChapters, source: 'api' };
      }

      // 2. 回退到 DOM
      {
        Utils.logger.info('回退到 DOM 解析章节');
        return new Promise((resolve) => {
          ChapterManager.extractChapterInfo(courseId);
          // extractChapterInfo 是同步的，这里返回空让调用者知道需要 DOM
          resolve({ chapters: [], source: 'dom' });
        });
      }
    },

    /**
     * 使用 API 获取章节列表（替代 DOM 解析）
     * @param {string} courseId - 课程 ID
     * @returns {Promise<Array|null>}
     */
    getChaptersViaAPI: async (courseId) => {

      return Utils.safeExecute(async () => {
        const chapters = await PlatformAPI.getChapterList(courseId);
        if (chapters && chapters.length > 0) {
          Utils.logger.info(`API 获取到 ${chapters.length} 个章节`);
          return chapters;
        }
        Utils.logger.warn('API 获取章节失败，将回退到 DOM');
        return null;
      }, 'API 获取章节失败', null);
    },

    /**
     * 混合进度验证（优先 API，DOM 兜底）
     * @param {string} userId - 用户 ID
     * @param {string} courseId - 课程 ID
     * @param {string} chapterId - 章节 ID
     * @returns {Promise<{apiProgress: number|null, domProgress: number, source: string}>}
     */
    hybridProgressCheck: async (userId, courseId, chapterId = null) => {
      const result = {
        apiProgress: null,
        domProgress: -1,
        source: 'unknown',
      };

      // 1. 优先 API
      {
        const apiStats = await ProgressValidator.verifyProgressViaAPI(userId, courseId, chapterId);
        if (apiStats) {
          result.apiProgress = apiStats.progress || apiStats.percent || 0;
          result.source = 'api';
          Utils.logger.info(`API 进度: ${result.apiProgress}%`);
          return result;
        }
      }

      // 2. DOM 兜底
      const domProgress = ChapterManager.checkCourseCompletion();
      result.domProgress = domProgress ? 100 : 0;
      result.source = 'dom';
      Utils.logger.info(`DOM 进度: ${result.domProgress}%`);

      return result;
    },

    /**
     * 检测 API 是否可用
     * @returns {Promise<boolean>}
     */
    checkAPIAvailability: async () => {

      return Utils.safeExecute(async () => {
        const available = await PlatformAPI.isAvailable();
        Utils.logger.info(`API 可用性检测: ${available}`);
        return available;
      }, 'API 检测失败', false);
    }
  };

  /**
   * CourseHandler - 课程处理器主入口
   *
   * 提供课程选择、导航、章节管理和静音模式等完整功能。
   */


  /**
   * 课程处理器
   */
  const CourseHandler = {
    // 状态
    currentCourse: null,
    isProcessing: false,

    // 初始化
    init: () => {
      Utils.safeExecute(() => {
        // sync() 会自动从存储恢复状态到 sessionStorage
        const sessionState = Utils.stateManager.sync();
        if (sessionState.isThematicClass) {
          Utils.logger.info(`专题班模式已激活: ${sessionState.thematicClassId}`);
        }
        Utils.logger.info('课程处理器已初始化');
      }, '课程处理器初始化失败');
    },

    // 课程选择（委托给 CourseSelector）
    selectCourse: CourseSelector.selectCourse,
    extractCourseStatus: CourseSelector.extractCourseStatus,
    extractCourseTitle: CourseSelector.extractCourseTitle,

    // 课程导航（委托给 CourseNavigator）
    openCourse: (courseElement) => {
      CourseHandler.isProcessing = true;
      CourseNavigator.openCourse(courseElement);
    },
    handlePagination: CourseNavigator.handlePagination,
    switchCourseType: CourseNavigator.switchCourseType,
    returnToCourseList: CourseNavigator.returnToCourseList,

    // 章节管理（委托给 ChapterManager）
    extractChapterInfo: ChapterManager.extractChapterInfo,
    checkCourseCompletion: ChapterManager.checkCourseCompletion,
    findAndClickIncompleteChapter: ChapterManager.findAndClickIncompleteChapter,

    // 静音模式（委托给 SilentMode）
    startSilentMode: SilentMode.startSilentMode,
    directStudyFromListPage: SilentMode.directStudyFromListPage,
    directStudyFromThematicClass: SilentMode.directStudyFromThematicClass,

    // 进度验证（委托给 ProgressValidator）
    verifyProgressViaAPI: ProgressValidator.verifyProgressViaAPI,
    hybridProgressCheck: ProgressValidator.hybridProgressCheck,
    getEnhancedChapterInfo: ProgressValidator.getEnhancedChapterInfo,
    getChaptersViaAPI: ProgressValidator.getChaptersViaAPI,
    checkAPIAvailability: ProgressValidator.checkAPIAvailability,

    // 专题班处理（委托给 ThematicHandler）
    verifyThematicClassProgress: ThematicHandler.verifyThematicClassProgress,

    /**
     * 开始学习计时
     * @param {number} requiredSeconds - 需要的时间（秒）
     * @param {HTMLElement} completeButton - 完成按钮
     */
    startStudyTime: (requiredSeconds, completeButton) => {
      Utils.safeExecute(() => {
        const totalMs = requiredSeconds * 1000;
        const studyStartTime = Date.now();
        Utils.logger.info(`开始精确学习计时: ${requiredSeconds}秒`);

        const updateDisplay = () => {
          const elapsed = Date.now() - studyStartTime;
          const remainingMs = Math.max(0, totalMs - elapsed);
          const totalSecs = Math.ceil(remainingMs / 1000);
          const minutes = Math.floor(totalSecs / 60);
          const seconds = totalSecs % 60;
          if (remainingMs > 0) {
            UI.updateStatus(`学习中，剩余: ${minutes}:${seconds.toString().padStart(2, '0')}`, 'info');
          } else {
            UI.updateStatus('时长已达标，正在完成...', 'success');
            Utils.lifecycle.clearInterval(displayInterval);
          }
        };

        updateDisplay();
        const displayInterval = Utils.lifecycle.setInterval(updateDisplay, 1000);
        Utils.lifecycle.setTimeout(() => {
          Utils.lifecycle.clearInterval(displayInterval);
          if (completeButton && typeof completeButton.click === 'function') {
            Utils.logger.info('倒计时结束，触发完成按钮');
            completeButton.click();
            Utils.lifecycle.setTimeout(() => CourseHandler.handleStudyComplete(), 3000);
          }
        }, totalMs);
      }, '学习时间处理失败');
    },

    /**
     * 处理学习完成
     */
    handleStudyComplete: () => {
      Utils.safeExecute(() => {
        Utils.logger.info('章节学习完成，寻找下一步');
        const currentUrl = window.location.href;
        const courseId = Utils.url.extractCourseId(currentUrl);
        Utils.logger.debug(`任务完成处理 - 课程ID: ${courseId || '未知'}`, 'CourseHandler');

        if (courseId) {
            Utils.logger.debug(`记录已完成课程黑名单: ${courseId}`, 'CourseHandler');
            Utils.storage.addVisited(courseId);
            sessionStorage.setItem('last_completed_course', courseId);
        }

        CourseHandler.returnToCourseList();
      }, '学习完成处理失败');
    }
  };

  /**
   * Page Recognizer - 页面识别模块
   *
   * 根据 URL 模式识别当前页面类型。
   */


  /**
   * 页面类型枚举
   */
  const PageType = {
    HOME: 'home',
    LOGIN: 'login',
    COURSE_LIST: 'course_list',
    COURSE_DETAIL: 'course_detail',
    VIDEO_PLAYER: 'video_player',
    THEMATIC_CLASS_LIST: 'thematic_class_list',
    THEMATIC_CLASS_DETAIL: 'thematic_class_detail',
    UNKNOWN: 'unknown'
  };

  /**
   * 页面识别器
   */
  const PageRecognizer = {
    /**
     * 检测当前页面类型
     * @returns {string} 页面类型
     */
    detectCurrentPage: () => {
      const url = window.location.href;

      if (url.includes('/pc/login.do')) {
        return PageType.LOGIN;
      }
      if (url.includes('courselist.do')) {
        return PageType.COURSE_LIST;
      }
      if (url.includes('coursedetail.do')) {
        return PageType.COURSE_DETAIL;
      }
      if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
        return PageType.VIDEO_PLAYER;
      }
      if (url.includes('thematicclasslist.do')) {
        return PageType.THEMATIC_CLASS_LIST;
      }
      if (url.includes('thematicclassdetail.do')) {
        return PageType.THEMATIC_CLASS_DETAIL;
      }
      if (url.includes('ahgbjy.gov.cn')) {
        return PageType.HOME;
      }

      return PageType.UNKNOWN;
    },

    /**
     * 获取页面类型的可读名称
     * @param {string} pageType - 页面类型
     * @returns {string}
     */
    getPageTypeName: (pageType) => {
      const names = {
        [PageType.HOME]: '首页',
        [PageType.LOGIN]: '登录页',
        [PageType.COURSE_LIST]: '课程列表页',
        [PageType.COURSE_DETAIL]: '课程详情页',
        [PageType.VIDEO_PLAYER]: '视频播放页',
        [PageType.THEMATIC_CLASS_LIST]: '专题班列表页',
        [PageType.THEMATIC_CLASS_DETAIL]: '专题班详情页',
        [PageType.UNKNOWN]: '未知页面'
      };
      return names[pageType] || '未知页面';
    },

    /**
     * 检查是否为课程相关页面
     * @param {string} pageType - 页面类型
     * @returns {boolean}
     */
    isCoursePage: (pageType) => {
      return [
        PageType.COURSE_LIST,
        PageType.COURSE_DETAIL,
        PageType.VIDEO_PLAYER
      ].includes(pageType);
    },

    /**
     * 检查是否为专题班相关页面
     * @param {string} pageType - 页面类型
     * @returns {boolean}
     */
    isThematicPage: (pageType) => {
      return [
        PageType.THEMATIC_CLASS_LIST,
        PageType.THEMATIC_CLASS_DETAIL
      ].includes(pageType);
    },

    /**
     * 获取延迟执行函数
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     */
    createDelayedRunner: (fn, delay = 1000) => {
      return () => {
        Utils.lifecycle.setTimeout(fn, delay);
      };
    }
  };

  /**
   * List Page API Mode - 列表页 API 模式处理模块
   *
   * 处理课程列表页的自动化逻辑（API 模式，跳过播放页直接学习）。
   */


  /**
   * 列表页 API 模式处理器
   */
  const ListPageAPIMode = {
    /**
     * 处理课程列表页（API 模式 - 跳过播放页）
     * @returns {Promise<void>}
     */
    handleCourseListPageWithAPI: async () => {
      if (CourseHandler.isProcessing) return;
      CourseHandler.isProcessing = true;

      Utils.logger.info('开始处理课程列表页（API模式）', 'Router', true);

      // 详细日志：检查 sessionStorage 状态
      Utils.logger.debug('检查 sessionStorage 状态...', 'Router');
      const allKeys = Object.keys(sessionStorage);
      Utils.logger.debug(`sessionStorage 共有 ${allKeys.length} 个 keys`, 'Router');

      // 优先使用统一函数处理章节缓存
      const cacheHandled = await ListPageAPIMode.handleChapterCache({
        cacheKey: 'ahgbjy_course_chapters',
        onChapterComplete: async (courseInfo) => {
          Utils.notificationService.notifyChapterComplete({
            chapterName: courseInfo.chapters.find(ch => (ch.progress || 0) < 100)?.chaptername || '',
            courseTitle: courseInfo.courseTitle,
            isCourseComplete: false,
          });
          UI.updateStatus(`章节完成`, 'success');
          UI.updateBackgroundStatus(false);
          Utils.storage.addVisited(courseInfo.courseId);
          Utils.broadcastRefresh();
          const detailUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseInfo.courseId}&fetch_chapter=1`;
          window.location.href = detailUrl;
        },
        onError: (err) => {
          Utils.logger.error(`列表页静默模式错误: ${err}`);
        },
      });

      if (cacheHandled) {
        return;
      }

      // 备选：检查 ahgbjy_fetched_chapter（单个章节信息，无总章节数）
      const fetchedChapterRaw = sessionStorage.getItem('ahgbjy_fetched_chapter');
      Utils.logger.debug(`ahgbjy_fetched_chapter 原始值: ${fetchedChapterRaw ? '已设置' : '未设置'}`, 'Router');

      if (fetchedChapterRaw) {
        Utils.logger.info('检测到已获取的章节信息，直接启动静默模式...');
        try {
          const chapterInfo = JSON.parse(fetchedChapterRaw);
          sessionStorage.removeItem('ahgbjy_fetched_chapter');

          const { chapterId, chapterName, duration, courseId, learnedTime } = chapterInfo;
          const pendingCourse = sessionStorage.getItem('ahgbjy_pending_course');
          const courseTitle = pendingCourse ? JSON.parse(pendingCourse).courseTitle : chapterName;
          sessionStorage.removeItem('ahgbjy_pending_course');

          const durationMinutes = duration || 30;
          const durationSeconds = durationMinutes * 60;

          if (learnedTime && learnedTime > 0) {
            Utils.logger.info(`章节已学习时间: ${learnedTime}秒 (${Math.floor(learnedTime/60)}分钟)`);
            sessionStorage.setItem('ahgbjy_chapter_learned_time', JSON.stringify({ chapterId, learnedTime }));
          }
          Utils.logger.info(`使用获取的章节: ${chapterName} (${chapterId}), 时长: ${durationMinutes}分钟`);

          let lastPercent = -1;

          const tracker = CourseHandler.startSilentMode({
            duration: durationSeconds,
            courseId,
            chapterId,
            userId: null,
            chapterName,
            courseTitle,
            onProgress: (elapsed) => {
              const baseLearned = (learnedTime || 0);
              const currentLearned = baseLearned + elapsed;
              const percent = Math.min(100, Math.round((currentLearned / durationSeconds) * 100));

              if (percent !== lastPercent) {
                lastPercent = percent;
                UI.updateBackgroundStatus(true, {
                  chapterName,
                  courseTitle,
                  percent,
                  currentChapter: 1,
                  totalChapters: 1
                });
              }
            },
            onComplete: async () => {
              Utils.logger.info(`课程学习完成: ${chapterName}`);

              Utils.notificationService.notifyChapterComplete({
                chapterName,
                courseTitle,
                isCourseComplete: true,
              });

              UI.updateBackgroundStatus(false);

              try {
                Utils.logger.info('确保 tracetime 追踪已结束...');
                await PlatformAPI.traceTime('end', {
                  course_type: '1',
                  user: PlatformAPI.getUserId() || '',
                  resource_id: chapterId,
                });
              } catch (e) {
                Utils.logger.warn(`结束 tracetime 追踪失败: ${e.message}，继续执行`);
              }

              try {
                Utils.logger.info('尝试直接标记课程完成...');
                const saved = await PlatformAPI.saveUserCourse(courseId);
                Utils.logger.info(`saveUserCourse 结果: ${saved ? '成功' : '失败'}`);
              } catch (e) {
                Utils.logger.warn(`标记课程完成失败: ${e.message}，继续执行`);
              }

              Utils.storage.addVisited(courseId);
              Utils.broadcastRefresh();
              Utils.lifecycle.setTimeout(() => {
                CourseHandler.isProcessing = false;
                ListPageAPIMode.handleCourseListPageWithAPI();
              }, 2000);
            },
            onError: (err) => {
              Utils.logger.error(`静默模式错误: ${err}`);
              CourseHandler.isProcessing = false;
              ListPageAPIMode.handleCourseListPage();
            },
          });

          if (tracker) {
            Utils.logger.info('静默模式已启动');
            return;
          }
        } catch (error) {
          Utils.logger.error(`处理章节信息失败: ${error.message}`);
          sessionStorage.removeItem('ahgbjy_fetched_chapter');
        }
      }

      const currentType = Utils.url.getParam('coutype') || '1';
      const typeName = currentType === '1' ? '必修' : '选修';
      UI.updateStatus(`正在分析${typeName}课程列表...`, 'info');

      const handled = await ListPageAPIMode.handleChapterCache({
        cacheKey: 'ahgbjy_course_chapters',
        onChapterComplete: async (courseInfo) => {
          const incompleteCh = courseInfo.chapters.find(ch => (ch.progress || 0) < 100);
          Utils.notificationService.notifyChapterComplete({
            chapterName: incompleteCh?.chaptername || '',
            courseTitle: courseInfo.courseTitle,
            isCourseComplete: false,
          });
          UI.updateStatus(`章节完成`, 'success');
          UI.updateBackgroundStatus(false);
          Utils.storage.addVisited(courseInfo.courseId);
          Utils.broadcastRefresh();
          const detailUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseInfo.courseId}&fetch_chapter=1`;
          window.location.href = detailUrl;
        },
        onError: (err) => {
          Utils.logger.error(`静默模式错误: ${err}`);
        },
      });

      if (handled) {
        return;
      }

      // 1. 提取所有课程元素和 ID
      const targetSelector = CONFIG.SELECTORS.COURSE_LIST.CONTAINERS.join(', ');
      await Utils.waitForElement(targetSelector, 6000);

      const courses = Utils.$$(targetSelector);
      if (courses.length === 0) {
        Utils.logger.warn('未找到课程元素，回退到传统模式');
        CourseHandler.isProcessing = false;
        ListPageAPIMode.handleCourseListPage();
        return;
      }

      // 2. 提取课程 ID 和标题
      const courseItemsMap = new Map();
      for (const el of courses) {
        const courseId = Utils.url.extractCourseId(el);
        if (courseId) {
          if (courseItemsMap.has(courseId)) {
            Utils.logger.debug(`跳过重复的课程元素: ${courseId}`, 'Router');
            continue;
          }
          const title = CourseHandler.extractCourseTitle(el);
          const status = CourseHandler.extractCourseStatus(el);
          courseItemsMap.set(courseId, { element: el, courseId, title, status });
        }
      }

      const courseItems = Array.from(courseItemsMap.values());

      if (courseItems.length === 0) {
        Utils.logger.warn('无法提取课程ID，回退到传统模式');
        CourseHandler.isProcessing = false;
        ListPageAPIMode.handleCourseListPage();
        return;
      }

      Utils.logger.info(`找到 ${courseItems.length} 个课程`);

      // 3. 检测 userId 变化，防止多用户进度混淆
      const currentUserId = PlatformAPI.getUserId() || 'unknown';
      const lastUserId = sessionStorage.getItem('ahgbjy_last_user_id');
      if (lastUserId && lastUserId !== currentUserId) {
        Utils.logger.info(`用户变更: ${lastUserId} -> ${currentUserId}，清空已验证完成课程列表`);
        sessionStorage.removeItem('ahgbjy_verified_completed_courses');
      }
      sessionStorage.setItem('ahgbjy_last_user_id', currentUserId);

      // 4. 批量查询课程状态
      const courseIds = courseItems.map(item => item.courseId);
      let courseStatuses = {};

      if (CONFIG.PLATFORM_API.USE_BATCH_COURSE_STATUS_API) {
        Utils.logger.info(`批量查询课程状态: ${courseIds.length} 个课程`);
        try {
          courseStatuses = await PlatformAPI.checkUserCourse(courseIds);
          Utils.logger.info(`课程状态查询结果: ${JSON.stringify(courseStatuses)}`);

          const hasValidData = Object.keys(courseStatuses).length > 0;
          if (!hasValidData) {
            Utils.logger.warn('checkUserCourse API 无有效响应，忽略批量查询结果');
            courseStatuses = {};
          }
        } catch (error) {
          Utils.logger.warn(`checkUserCourse API 调用失败: ${error.message}，忽略批量查询结果`);
          courseStatuses = {};
        }
      } else {
        Utils.logger.info(`跳过批量查询（${courseIds.length} 个课程），使用页面 DOM 状态`);
      }

      // 4. 筛选需要学习的课程
      const visitedCourses = Utils.storage.getVisited();
      const verifiedCompletedMap = JSON.parse(sessionStorage.getItem('ahgbjy_verified_completed_courses') || '{}');
      const verifiedCompletedCourses = verifiedCompletedMap[currentUserId] || [];
      Utils.logger.debug(`用户 ${currentUserId} 的已验证完成课程列表: ${JSON.stringify(verifiedCompletedCourses)}`);

      const pendingCourses = [];

      for (const item of courseItems) {
        const { courseId, title, status } = item;

        if (verifiedCompletedCourses.includes(courseId)) {
          Utils.logger.info(`详情页验证完成，跳过课程: ${title} (${courseId})`);
          continue;
        }

        if (status === '已完成') {
          Utils.logger.info(`跳过已完成的课程: ${title}`);
          continue;
        }

        if (visitedCourses.includes(courseId)) {
          const apiStatus = courseStatuses[courseId];
          if (apiStatus && apiStatus.progress >= 100) {
            Utils.logger.info(`API确认课程已完成: ${title}`);
            continue;
          }
          Utils.logger.info(`从黑名单恢复课程: ${title}`);
          Utils.storage.removeVisited(courseId);
        }

        pendingCourses.push(item);
      }

      if (pendingCourses.length === 0) {
        Utils.logger.info('所有课程已完成，准备翻页');
        UI.updateStatus('当前页已学完，准备翻页...', 'success');
        const paginated = await CourseHandler.handlePagination();
        if (!paginated) CourseHandler.switchCourseType();
        CourseHandler.isProcessing = false;
        return;
      }

      // 5. 选择下一个课程 - 优先选择"学习中的课程"
      const nextCourse = pendingCourses.find(item => item.status === '学习中') || pendingCourses[0];
      Utils.logger.info(`选择课程: ${nextCourse.title} (${nextCourse.courseId}, 状态: ${nextCourse.status})`);

      if (Utils.globalLock.isLocked()) {
        UI.updateStatus('已有课程学习中...', 'warning');
        CourseHandler.isProcessing = false;
        return;
      }

      UI.updateStatus(`正在学习: ${nextCourse.title}`, 'info');
      sessionStorage.setItem('ahgbjy_current_course_title', nextCourse.title);

      Utils.logger.info(`调用 directStudyFromListPage: ${nextCourse.courseId}`);
      const tracker = await CourseHandler.directStudyFromListPage({
        courseId: nextCourse.courseId,
        courseTitle: nextCourse.title,
        onComplete: () => {
          Utils.logger.info(`课程学习完成: ${nextCourse.title}`);
          Utils.lifecycle.setTimeout(() => {
            CourseHandler.isProcessing = false;
            ListPageAPIMode.handleCourseListPageWithAPI();
          }, 2000);
        },
        onError: (err) => {
          Utils.logger.error(`直接学习失败: ${err}`);

          if (err && err.includes('正在获取')) {
            Utils.logger.info('正在获取章节信息，等待返回...');
            return;
          }

          Utils.logger.info('回退到传统模式（打开播放页）');
          CourseHandler.isProcessing = false;
          const courseElement = nextCourse.element;
          if (courseElement) {
            CourseHandler.openCourse(courseElement);
          } else {
            ListPageAPIMode.handleCourseListPage();
          }
        },
      });

      if (!tracker) {
        Utils.logger.warn('directStudyFromListPage 返回 null，触发 onError 回调');
      }
    },

    /**
     * 统一处理章节缓存启动静默模式
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    handleChapterCache: async (options) => {
      const { cacheKey = 'ahgbjy_course_chapters', onChapterComplete, onError } = options;

      try {
        const { valid: isCacheValid, data: courseInfo } = Utils.storage.validateCache(cacheKey);

        if (!isCacheValid) return false;

        Utils.logger.info(`使用缓存的章节信息，共 ${courseInfo.chapters.length} 个章节`);

        const chapterIndex = courseInfo.chapters.findIndex(ch => (ch.progress || 0) < 100);
        const incompleteChapter = chapterIndex >= 0 ? courseInfo.chapters[chapterIndex] : null;

        if (!incompleteChapter) {
          Utils.logger.info('所有章节已完成，清理缓存');
          sessionStorage.removeItem(cacheKey);
          const userId = PlatformAPI.getUserId() || 'unknown';
          Utils.storage.addVerifiedCompletedCourse(courseInfo.courseId, userId, courseInfo.courseTitle);
          Utils.storage.addVisited(courseInfo.courseId);
          CourseHandler.isProcessing = false;
          return false;
        }

        const currentChapterNum = chapterIndex + 1;
        const totalChapters = courseInfo.chapters.length;
        Utils.logger.info(`第 ${currentChapterNum} 个章节未完成: ${incompleteChapter.chaptername} (进度: ${incompleteChapter.progress}%)`);

        const userId = PlatformAPI.getUserId();
        if (!userId) {
          Utils.logger.error('无法获取 userId');
          sessionStorage.removeItem(cacheKey);
          CourseHandler.isProcessing = false;
          if (onError) onError('无法获取 userId');
          return false;
        }

        const durationSeconds = (incompleteChapter.duration || 30) * 60;
        const learnedSeconds = incompleteChapter.learnedTime || 0;
        const remainingSeconds = Math.max(0, durationSeconds - learnedSeconds);

        Utils.logger.info(`开始学习: ${incompleteChapter.chaptername}, 总时长: ${durationSeconds}秒, 已学: ${learnedSeconds}秒, 剩余: ${remainingSeconds}秒`);

        sessionStorage.removeItem(cacheKey);

        let lastPercent = -1;

        const tracker = CourseHandler.startSilentMode({
          duration: remainingSeconds,
          courseId: courseInfo.courseId,
          chapterId: incompleteChapter.chapterid,
          userId,
          chapterName: incompleteChapter.chaptername,
          courseTitle: courseInfo.courseTitle,
          onProgress: (elapsed) => {
            const currentLearned = learnedSeconds + elapsed;
            const percent = Math.min(100, Math.round((currentLearned / durationSeconds) * 100));
            if (percent !== lastPercent) {
              lastPercent = percent;
              UI.updateBackgroundStatus(true, {
                chapterName: incompleteChapter.chaptername,
                courseTitle: courseInfo.courseTitle,
                percent,
                currentChapter: currentChapterNum,
                totalChapters: totalChapters
              });
            }
          },
          onComplete: async () => {
            Utils.logger.info(`章节学习完成: ${incompleteChapter.chaptername}`);
            if (onChapterComplete) await onChapterComplete(courseInfo);
          },
          onError: (err) => {
            Utils.logger.error(`静默模式错误: ${err}`);
            CourseHandler.isProcessing = false;
            if (onError) onError(err);
          },
        });

        if (tracker) {
          Utils.logger.info('静默模式已启动');
          return true;
        }
      } catch (e) {
        Utils.logger.error(`解析章节缓存失败: ${e.message}`);
        sessionStorage.removeItem(cacheKey);
      }
      return false;
    },

    /**
     * 处理课程列表页（传统模式 - 回退用）
     * @returns {Promise<void>}
     */
    handleCourseListPage: async () => {
      if (CourseHandler.isProcessing) return;
      CourseHandler.isProcessing = true;

      Utils.logger.info('开始处理课程列表页面（传统模式回退）', 'Router', true);

      const currentType = Utils.url.getParam('coutype') || '1';
      const typeName = currentType === '1' ? '必修' : '选修';
      UI.updateStatus(`正在分析${typeName}课程列表...`, 'info');

      const targetSelector = CONFIG.SELECTORS.COURSE_LIST.CONTAINERS.join(', ');
      await Utils.waitForElement(targetSelector, 6000);

      let courses = Utils.$$(targetSelector);
      if (courses.length === 0) {
        Utils.logger.debug('尝试兜底方案：抓取所有包含课程链接的行', 'Router');
        courses = Utils.$$('tr').filter(tr => tr.querySelector('a[href*="courseid="]'));
      }

      const validCourses = courses.filter(el => Utils.url.extractCourseId(el));
      if (validCourses.length === 0) {
        UI.updateStatus('未找到课程元素', 'error');
        Utils.logger.warn('当前页面 HTML 结构可能已变动，请检查选择器', 'Router');
        CourseHandler.isProcessing = false;
        return;
      }

      Utils.logger.debug(`找到 ${validCourses.length} 个候选课程元素`, 'Router');

      const visitedCourses = Utils.storage.getVisited();
      const stats = { completed: 0, inBlacklist: 0 };

      validCourses.forEach(el => {
        const status = CourseHandler.extractCourseStatus(el);
        const courseId = Utils.url.extractCourseId(el);
        if (status === '已完成') {
          stats.completed++;
        }
        if (courseId && visitedCourses.includes(courseId)) {
          stats.inBlacklist++;
        }
      });

      Utils.logger.debug(`当前页统计 - 总数: ${validCourses.length}, 页面显示已完成: ${stats.completed}, 黑名单中: ${stats.inBlacklist}`, 'Router');

      if (validCourses.length > 0 && stats.completed === validCourses.length) {
        UI.updateStatus(' 当前页已学完，准备翻页或切换类型...', 'success');
        const paginated = await CourseHandler.handlePagination();
        if (!paginated) CourseHandler.switchCourseType();
        CourseHandler.isProcessing = false;
        return;
      }

      const next = CourseHandler.selectCourse(validCourses, visitedCourses);
      if (next) {
        if (Utils.globalLock.isLocked()) {
          UI.updateStatus('已有课程学习中...', 'warning');
          CourseHandler.isProcessing = false;
          return;
        }
        CourseHandler.openCourse(next);
      } else {
        Utils.logger.debug('未找到合适课程，重置记录重试...', 'Router');
        Utils.storage.clearVisited();
        Utils.lifecycle.setTimeout(() => {
          CourseHandler.isProcessing = false;
          ListPageAPIMode.handleCourseListPage();
        }, 2000);
      }
    }
  };

  /**
   * List Page Handler - 列表页处理主入口
   *
   * 导出列表页处理器，根据配置选择传统模式或 API 模式。
   */


  /**
   * 列表页处理器
   */
  const ListPageHandler = {
    /**
     * 处理课程列表页（根据配置选择模式）
     * @returns {Promise<void>}
     */
    handleCourseListPage: async () => {
      {
        return ListPageAPIMode.handleCourseListPageWithAPI();
      }
    },

    /**
     * 处理课程列表页（API 模式）
     * @returns {Promise<void>}
     */
    handleCourseListPageWithAPI: () => {
      return ListPageAPIMode.handleCourseListPageWithAPI();
    },

    /**
     * 处理章节缓存
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    handleChapterCache: (options) => {
      return ListPageAPIMode.handleChapterCache(options);
    }
  };

  /**
   * Chapter Fetcher - 章节获取模块
   *
   * 处理详情页的章节获取逻辑（fetch_chapter 模式）。
   */


  /**
   * 章节获取器
   */
  const ChapterFetcher = {
    /**
     * 处理获取章节模式
     * @returns {Promise<void>}
     */
    handleFetchChapterMode: async () => {
      Utils.logger.info('获取章节模式：开始提取章节信息...');

      const courseId = Utils.url.extractCourseId(window.location.href);
      if (!courseId) {
        Utils.logger.error('无法提取 courseId');
        CourseHandler.isProcessing = false;
        window.history.back();
        return;
      }

      const userId = PlatformAPI.getUserId();
      if (!userId) {
        Utils.logger.error('无法获取 userId');
        CourseHandler.isProcessing = false;
        window.history.back();
        return;
      }

      // 1. 预先获取整个课程的所有学习统计记录
      let courseStats = [];
      try {
        Utils.logger.info(`正在获取课程 ${courseId} 的完整学习统计...`);
        const response = await PlatformAPI.getPageStudyStatistics(userId, courseId);
        courseStats = Array.isArray(response) ? response : (response?.data || []);
        Utils.logger.info(`获取到 ${courseStats.length} 条课程学习记录`);
      } catch (e) {
        Utils.logger.warn(`获取课程统计失败: ${e.message}`);
      }

      // 2. 预先获取 API 定义的章节列表
      let apiChapters = [];
      try {
        apiChapters = await PlatformAPI.getVideoCourseChapter(courseId);
      } catch (e) {
        Utils.logger.warn(`获取 API 章节列表失败: ${e.message}`);
      }

      // 等待章节按钮加载
      await Utils.waitForElement('.playBtn[data-chapterid]', 5000);

      const chapterBtns = document.querySelectorAll('.playBtn[data-chapterid]');
      if (chapterBtns.length === 0) {
        Utils.logger.error('未找到章节按钮');
        CourseHandler.isProcessing = false;
        window.history.back();
        return;
      }

      Utils.logger.info(`找到 ${chapterBtns.length} 个章节按钮`);

      // 获取课程标题
      const courseTitle = document.querySelector('h3.title, .course-title, .coursename')?.textContent?.trim() ||
                         sessionStorage.getItem('ahgbjy_current_course_title') || '未知课程';

      // 处理每个章节
      const chapters = [];
      for (let i = 0; i < chapterBtns.length; i++) {
        const btn = chapterBtns[i];
        const chapterId = btn.getAttribute('data-chapterid');

        let chapterName = btn.getAttribute('data-chaptername');
        const chapterRow = btn.closest('tr');
        if (!chapterName || chapterName === '学习') {
          chapterName = Utils.dom.extractChapterName(chapterRow, i);
        }
        if (!chapterName) chapterName = `第${i + 1}章`;

        const duration = Utils.dom.extractDurationFromRow(chapterRow);
        const durationSeconds = duration * 60;

        // 进度判定逻辑：多源融合，取最大值
        const chapterRecords = courseStats.filter(item =>
          item.chapterid === chapterId ||
          item.chapterid === `ccid_${chapterId}` ||
          item.id === chapterId
        );
        const apiRecordsTime = chapterRecords.reduce((sum, item) =>
          sum + (item.cost || item.stutime || item.studyTime || 0), 0
        );
        const apiRecordsPercent = Math.min(100, Math.round((apiRecordsTime / durationSeconds) * 100));

        const apiChapterInfo = apiChapters.find(ch => ch.chapterid === chapterId);
        const apiReportedPercent = apiChapterInfo ? (apiChapterInfo.progress || 0) : 0;
        const apiReportedTime = Math.round((apiReportedPercent / 100) * durationSeconds);

        const domPercent = Utils.dom.extractProgressFromRow(chapterRow);
        const domLearnedTime = Math.round((domPercent / 100) * durationSeconds);

        const finalPercent = Math.max(apiRecordsPercent, apiReportedPercent, domPercent);
        const finalLearnedTime = Math.max(apiRecordsTime, apiReportedTime, domLearnedTime);

        if (finalPercent !== apiRecordsPercent) {
          Utils.logger.info(`章节 "${chapterName}" 进度同步: API记录=${apiRecordsPercent}%, API报告=${apiReportedPercent}%, DOM=${domPercent}% -> 最终使用=${finalPercent}%`);
        }

        chapters.push({
          chapterid: chapterId,
          chaptername: chapterName,
          duration,
          progress: finalPercent,
          learnedTime: finalLearnedTime,
        });
      }

      // 保存所有章节信息
      const courseInfo = {
        courseId,
        courseTitle,
        chapters,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('ahgbjy_course_chapters', JSON.stringify(courseInfo));
      Utils.logger.info(`已保存 ${chapters.length} 个章节的准确信息`);

      // 多级进度验证：最高优先级 - 详情页所有章节完成度
      const allChaptersCompleted = chapters.length > 0 && chapters.every(ch => (ch.progress || 0) >= 100);
      if (allChaptersCompleted) {
        const currentUserId = PlatformAPI.getUserId() || 'unknown';
        Utils.storage.addVerifiedCompletedCourse(courseId, currentUserId, courseTitle);
      }

      CourseHandler.isProcessing = false;

      // 检测是否为专题班模式
      const isThematicMode = Utils.url.getParam('thm') === '1';
      const thematicTid = Utils.url.getParam('tid');

      let returnUrl;
      if (isThematicMode && thematicTid) {
        returnUrl = `/pc/thematicclass/thematicclassdetail.do?tid=${thematicTid}`;
        Utils.logger.info(`返回专题班详情页继续学习: ${courseTitle}, tid=${thematicTid}`);
        sessionStorage.setItem('fromThematicLearning', 'true');
      } else {
        returnUrl = sessionStorage.getItem('ahgbjy_return_from_detail') ||
                          sessionStorage.getItem('lastListUrl') ||
                          `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=1`;
        Utils.logger.info(`返回列表页继续学习: ${courseTitle}`);
      }
      window.location.href = returnUrl;
    },

    /**
     * 处理普通详情页（非 fetch_chapter 模式）
     * @returns {Promise<void>}
     */
    handleNormalDetailPage: async () => {
      UI.updateStatus('分析章节进度...', 'info');
      const courseId = Utils.url.extractCourseId(window.location.href);
      if (!courseId) {
        CourseHandler.isProcessing = false;
        return;
      }

      // 尝试所有配置的章节按钮选择器
      let found = false;
      for (const selector of CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS) {
        try {
          await Utils.waitForElement(selector, 3000);
          found = true;
          Utils.logger.info(`找到章节按钮（使用选择器: ${selector}）`);
          break;
        } catch {
          // 继续尝试下一个选择器
        }
      }

      if (!found) {
        Utils.logger.error('未找到任何章节按钮，页面结构可能已改变');
        CourseHandler.isProcessing = false;
        return;
      }

      CourseHandler.extractChapterInfo(courseId);

      if (CourseHandler.checkCourseCompletion()) {
        const currentUserId = PlatformAPI.getUserId() || 'unknown';
        Utils.storage.addVerifiedCompletedCourse(courseId, currentUserId);

        UI.updateStatus(' 课程已学完！准备寻找新任务...', 'success');
        Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1500);
        return;
      }

      CourseHandler.findAndClickIncompleteChapter();
      Utils.lifecycle.setTimeout(() => { CourseHandler.isProcessing = false; }, 5000);
    }
  };

  /**
   * Silent Mode Handler - 静默模式处理模块
   *
   * 处理从静默模式返回的详情页逻辑。
   */


  /**
   * 静默模式处理器
   */
  const SilentModeHandler = {
    /**
     * 处理从静默模式返回的逻辑
     * @returns {Promise<void>}
     */
    handleFromSilentMode: async () => {
      Utils.logger.info('静默模式章节学习完成，检查是否还有未完成章节...');
      const courseId = Utils.url.extractCourseId(window.location.href);
      const userId = PlatformAPI.getUserId();

      if (courseId && userId) {
        try {
          const chapters = await PlatformAPI.getVideoCourseChapter(courseId);
          const allChapters = chapters || [];

          const incompleteChapter = allChapters.find(ch => {
            const progress = ch.progress || ch.learnedPercent || 0;
            return progress < 100;
          });

          if (incompleteChapter) {
            Utils.logger.info(`发现未完成章节: ${incompleteChapter.chaptername || incompleteChapter.name}，继续学习...`);
            CourseHandler.isProcessing = false;

            const courseTitle = sessionStorage.getItem('ahgbjy_current_course_title') || '课程';

            await CourseHandler.directStudyFromListPage({
              courseId,
              courseTitle,
              onComplete: () => {
                Utils.logger.info(`章节学习完成回调`);
              },
              onError: (err) => {
                Utils.logger.error(`章节学习失败: ${err}`);
              },
            });
            return;
          } else {
            Utils.logger.info('所有章节已完成，返回列表页...');
            CourseHandler.isProcessing = false;
            const lastListUrl = sessionStorage.getItem('lastListUrl') ||
              `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=1`;
            window.location.href = lastListUrl;
            return;
          }
        } catch (error) {
          Utils.logger.error(`检查章节进度失败: ${error.message}，返回列表页...`);
        }
      }

      Utils.logger.info('静默模式触发课程标记完成，返回列表页继续...');
      CourseHandler.isProcessing = false;
      const lastListUrl = sessionStorage.getItem('lastListUrl') ||
        `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=1`;
      window.location.href = lastListUrl;
    }
  };

  /**
   * Detail Page Handler - 详情页处理主入口
   *
   * 导出详情页处理器。
   */


  /**
   * 课程详情页处理器
   */
  const DetailPageHandler = {
    /**
     * 处理课程详情页
     * @returns {Promise<void>}
     */
    handleCourseDetailPage: async () => {
      if (CourseHandler.isProcessing) return;
      CourseHandler.isProcessing = true;

      Utils.logger.info('=== 开始处理课程详情页 ===');

      // 检测是否为静默模式跳转过来触发课程标记
      const isFromSilentMode = Utils.url.getParam('fromSilent') === '1';
      if (isFromSilentMode) {
        return SilentModeHandler.handleFromSilentMode();
      }

      // 尝试获取并保存 userId
      const userId = PlatformAPI.getUserId();
      if (userId) {
        Utils.logger.info(`详情页获取到 userId: ${userId}`);
        PlatformAPI.setUserId(userId);
      } else {
        Utils.logger.warn('详情页无法获取 userId，列表页直接学习模式可能受限');
      }

      // 检测是否为获取 userId 的特殊跳转
      const isGetUserIdMode = Utils.url.getParam('get_userid') === '1';
      if (isGetUserIdMode && userId) {
        Utils.logger.info('获取 userId 完成，返回列表页继续...');
        sessionStorage.setItem('fromUserIdFetch', 'true');
        const lastListUrl = sessionStorage.getItem('lastListUrl') ||
          `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=1`;
        window.location.href = lastListUrl;
        return;
      }

      // 检测是否为获取章节的特殊跳转
      const isFetchChapterMode = Utils.url.getParam('fetch_chapter') === '1';
      if (isFetchChapterMode) {
        return ChapterFetcher.handleFetchChapterMode();
      }

      // 从 URL 参数恢复专题班状态
      const isThematicUrl = Utils.url.getParam('thm') === '1';
      if (isThematicUrl) {
        const tid = Utils.url.getParam('tid');
        Utils.logger.info(`📥 从 URL 检测到专题班来源，恢复状态 tid=${tid}`);

        sessionStorage.setItem('learningMode', 'thematic');
        sessionStorage.setItem('isThematicClass', 'true');
        if (tid) {
          sessionStorage.setItem('currentThematicClassId', tid);
          Utils.stateManager.setThematicState(tid, 'thematic');
        }
      }

      if (sessionStorage.getItem('fromLearningPage') === 'true') {
        Utils.logger.info('从学习页面返回，强制刷新页面以更新进度显示');
        sessionStorage.removeItem('fromLearningPage');
        window.location.reload();
        return;
      }

      return ChapterFetcher.handleNormalDetailPage();
    }
  };

  /**
   * Video Page Handler - 视频页处理模块
   *
   * 处理视频播放页和 SCORM 课件页的自动化逻辑。
   */


  /**
   * 视频页处理器
   */
  const VideoPageHandler = {
    /**
     * 处理视频/课件播放页
     * @returns {Promise<void>}
     */
    handleVideoPage: async () => {
      Utils.safeExecute(async () => {
        if (window.studyPageProcessingStarted) return;
        window.studyPageProcessingStarted = true;

        // 在函数最开始就提取 courseId 并获取锁，减少竞态窗口
        const courseId = Utils.url.extractCourseId(window.location.href);
        if (courseId) {
          Utils.globalLock.acquire(courseId);
          Utils.tabManager.register();
          Utils.lifecycle.addEventListener(window, 'beforeunload', () => {
            Utils.tabManager.unregister();
            Utils.globalLock.release();
          });
          Utils.logger.info(`已获取全局播放锁: ${courseId}`);
        }

        const url = window.location.href;
        const isSCORM = url.includes('playscorm.do');
        const isVideo = url.includes('playvideo.do');

        Utils.logger.info(`处理学习页面 (${isSCORM ? 'SCORM课件' : 'Video课件'}版)`);
        UI.updateStatus('正在初始化播放...', 'info');

        // 提取并显示当前学习内容
        let courseTitle = '未知课程';
        if (isVideo) {
          courseTitle = document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER.COURSE_TITLE)?.textContent?.trim() || '未知课程';
        } else if (isSCORM) {
          const iframe = document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.IFRAME);
          const iframeTitle = iframe?.contentDocument?.title;
          courseTitle = iframeTitle || document.title?.replace(/ - 安徽干部教育在线.*/, '') || 'SCORM课件';
        }

        Utils.logger.info(`📚 正在学习: ${courseTitle}`);
        UI.updateStatus(`正在学习: ${courseTitle}`, 'info');

        const chapterId = Utils.url.extractChapterId(window.location.href);
        const prevProgress = parseInt(Utils.url.getParam('prev_progress') || '0');

        const getBtn = () => {
          const btn = document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER.COMPLETE_BTN) ||
                      document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.COMPLETE_BTN);
          if (btn) return btn;

          const all = document.querySelectorAll('a.btn, input[type="button"], button');
          for (const b of all) {
            const el = b;
            const t = el.textContent || el.value || '';
            if (t.includes('完成播放') || t.includes('确 定') || t.includes('结束学习')) return el;
          }
          return null;
        };

        let completeButton = getBtn();
        const bind = (btn) => {
          btn.addEventListener('click', () => {
            Utils.logger.debug('检测到完成播放动作 (手动/自动)', 'Router');
            Utils.globalLock.release();
            if (courseId) Utils.storage.addVisited(courseId);
            Utils.broadcastRefresh();
          }, true);
        };

        if (completeButton) bind(completeButton);
        else {
          Utils.logger.warn('未找到完成按钮，等待动态加载...', 'Router');
          Utils.lifecycle.setTimeout(() => {
            const b = getBtn();
            if (b) {
              Utils.logger.debug('动态补获到完成按钮', 'Router');
              bind(b);
            }
          }, 2000);
        }

        let totalSecs = 1800;
        if (courseId && chapterId) {
          const mins = Utils.storage.get(`duration_${courseId}_${chapterId}`);
          if (mins) {
            totalSecs = parseInt(mins) * 60;
            Utils.logger.debug(`使用详情页存储的时长估值: ${mins}分钟 (${totalSecs}秒)`, 'Router');
          }
        }

        const waitSecs = Math.max(Math.ceil(totalSecs * (100 - prevProgress) / 100) + 5, 10);
        Utils.logger.debug(`初始进度: ${prevProgress}%, 剩余比例: ${Math.round((100 - prevProgress))}%, 预计学习: ${waitSecs}秒`, 'Router');
        sessionStorage.setItem('fromLearningPage', 'true');

        // 优先尝试静音挂机模式
        if (courseId && chapterId) {
          Utils.logger.info('尝试静音挂机模式...');
          UI.updateStatus('正在检测 API 可用性...', 'info');

          const checkAndStartSilentMode = async () => {
            try {
              const userId = PlatformAPI.getUserId();
              Utils.logger.debug(`获取到 userId: ${userId}`, 'Router');

              const apiAvailable = await CourseHandler.checkAPIAvailability();
              if (apiAvailable) {
                Utils.logger.info('API 可用，启动静音挂机模式');
                UI.updateStatus('静音挂机模式已启动', 'info');

                const tracker = CourseHandler.startSilentMode({
                  duration: waitSecs,
                  courseId,
                  chapterId,
                  userId,
                  chapterName: chapterId,
                  courseTitle,
                  onComplete: () => {
                    Utils.logger.info('静音学习完成');
                    Utils.notificationService.notifyChapterComplete({
                      chapterName: chapterId,
                      courseTitle,
                      isCourseComplete: true,
                    });
                    CourseHandler.handleStudyComplete();
                  },
                  onError: (err) => {
                    Utils.logger.error(`静默模式错误: ${err}`);
                    Utils.logger.info('回退到传统视频播放模式');
                    CourseHandler.startStudyTime(waitSecs, completeButton);
                  },
                });

                if (tracker) {
                  return true;
                }
              }
              Utils.logger.info('API 不可用，使用传统视频播放模式');
              CourseHandler.startStudyTime(waitSecs, completeButton);
              return false;
            } catch (error) {
              Utils.logger.error(`检测 API 失败: ${error.message}`);
              CourseHandler.startStudyTime(waitSecs, completeButton);
              return false;
            }
          };

          checkAndStartSilentMode();
        } else {
          CourseHandler.startStudyTime(waitSecs, completeButton);
        }
      }, '学习页处理失败');
    }
  };

  /**
   * Thematic Page Handler - 专题班处理模块
   *
   * 处理专题班列表页和详情页的自动化逻辑。
   */


  /**
   * 专题班页面处理器
   */
  const ThematicPageHandler = {
    /**
     * 处理专题班列表页
     * @returns {Promise<void>}
     */
    handleThematicClassListPage: async () => {
      Utils.logger.debug('处理专题班列表页面', 'Router');
      UI.updateStatus('专题班列表页 - 等待手动选择专题班', 'info');

      const justFinished = sessionStorage.getItem('just_finished_thematic_class');
      if (justFinished) {
        UI.updateStatus(`已完成: ${justFinished}`, 'success');
        sessionStorage.removeItem('just_finished_thematic_class');
      }

      sessionStorage.removeItem('thematicListRetryCount');

      Utils.logger.debug('专题班列表页：脚本已暂停，等待用户手动进入专题班详情页', 'Router');
      UI.updateStatus('请手动选择要学习的专题班', 'info');
    },

    /**
     * 处理专题班详情页
     * @returns {Promise<void>}
     */
    handleThematicClassPage: async () => {
      Utils.safeExecute(async () => {
        if (CourseHandler.isProcessing) return;
        if (Utils.globalLock.isLocked() || Utils.tabManager.hasActivePlayer()) {
          Utils.logger.debug('专题班：检测到其他页面正在播放，停止当前操作', 'Router');
          UI.updateStatus('其他课程学习中...', 'warning');
          return;
        }
        CourseHandler.isProcessing = true;
        Utils.logger.debug('处理专题班课程页面', 'Router');
        UI.updateStatus('分析专题班课程...', 'info');

        const tid = Utils.url.getParam('tid');
        if (tid) {
          sessionStorage.setItem('currentThematicClassId', tid);
          Utils.stateManager.setThematicState(tid, 'thematic');
        }
        sessionStorage.setItem('isThematicClass', 'true');
        sessionStorage.setItem('learningMode', 'thematic');

        const userId = PlatformAPI.getUserId();
        if (!userId) {
          Utils.logger.error('专题班页面无法获取 userId，请确保已登录并访问过首页', 'Router');
          UI.updateStatus('无法获取 userId，请刷新页面', 'error');
          CourseHandler.isProcessing = false;
          return;
        }

        Utils.logger.info(`专题班页面获取到 userId: ${userId.substring(0, 4)}***${userId.substring(userId.length - 4)}`, 'Router');

        if (sessionStorage.getItem('fromThematicLearning') === 'true') {
          Utils.logger.debug('从专题班学习返回，继续寻找下一门', 'Router');
          sessionStorage.removeItem('fromThematicLearning');

          const handled = await ThematicPageHandler.handleChapterCache({
            cacheKey: 'ahgbjy_course_chapters',
            onChapterComplete: async () => {
              sessionStorage.setItem('fromThematicLearning', 'true');
              Utils.lifecycle.setTimeout(() => {
                window.location.reload();
              }, 1000);
            },
            onError: (err) => {
              Utils.logger.error(`专题班静默模式错误: ${err}`);
            },
          });

          if (handled) {
            return;
          }

          CourseHandler.isProcessing = false;
          Utils.lifecycle.setTimeout(() => ThematicPageHandler.handleThematicClassPage(), 1500);
          return;
        }

        // 支持两种选择器：旧版 .ke-box 和新版 #course div
        await Utils.waitForElement('#course a[href*="coursedetail.do"], .ke-box a[target="_blank"]', 5000);
        const courseLinks = [
          ...Utils.$$('#course a[href*="coursedetail.do"]'),
          ...Utils.$$('.ke-box a[target="_blank"]')
        ];
        if (courseLinks.length === 0) {
          UI.updateStatus('未找到专题班课程', 'error');
          CourseHandler.isProcessing = false;
          return;
        }

        Utils.logger.debug(`找到 ${courseLinks.length} 个课程`, 'Router');
        const visitedCourses = Utils.storage.getVisited();

        const verifiedCompletedMap = JSON.parse(sessionStorage.getItem('ahgbjy_verified_completed_courses') || '{}');
        const verifiedCompletedCourses = verifiedCompletedMap[userId] || [];
        Utils.logger.debug(`专题班用户 ${userId.substring(0, 4)}***${userId.substring(userId.length - 4)} 的已验证完成课程: ${JSON.stringify(verifiedCompletedCourses)}`);

        const availableCourses = courseLinks.filter(link => {
          const cid = Utils.url.extractCourseId(link.href);
          return cid && !verifiedCompletedCourses.includes(cid);
        });

        const result = Utils.dom.selectCourseByProgress(
          availableCourses,
          visitedCourses,
          (link) => Utils.dom.extractProgressFromThematicLink(link),
          (link) => Utils.url.extractCourseId(link.href)
        );

        const selectedLink = result.element;

        if (selectedLink) {
          UI.updateStatus('发现匹配课程，准备进入...', 'info');
          const progress = Utils.dom.extractProgressFromThematicLink(selectedLink);
          const cid = Utils.url.extractCourseId(selectedLink.href);
          const courseTitle = CourseHandler.extractCourseTitle(selectedLink);

          if (cid && progress > 0) {
            sessionStorage.setItem(`course_progress_${cid}`, progress.toString());
            Utils.logger.debug(`缓存课程进度: ${cid} = ${progress}%`, 'Router');
          }

          {
            Utils.logger.info(`专题班使用静默模式学习: ${courseTitle}`);
            await CourseHandler.directStudyFromThematicClass({
              courseId: cid,
              courseTitle,
              thematicClassId: tid,
              onComplete: () => {
                Utils.logger.info(`专题班课程学习完成: ${courseTitle}`);
                CourseHandler.isProcessing = false;
                sessionStorage.setItem('fromThematicLearning', 'true');
                Utils.lifecycle.setTimeout(() => {
                  window.location.reload();
                }, 2000);
              },
              onError: (err) => {
                Utils.logger.error(`专题班静默模式错误: ${err}`);
                CourseHandler.isProcessing = false;
              },
            });

            Utils.logger.info('正在获取章节信息...');
            return;
          }
        } else {
          const allCompleted = courseLinks.every(link => {
            const progress = Utils.dom.extractProgressFromThematicLink(link);
            const cid = Utils.url.extractCourseId(link.href);
            return progress === 100 || (cid && verifiedCompletedCourses.includes(cid));
          });
          if (!allCompleted && visitedCourses.length > 0) {
            Utils.storage.clearVisited();
            Utils.lifecycle.setTimeout(() => {
              CourseHandler.isProcessing = false;
              ThematicPageHandler.handleThematicClassPage();
            }, 2000);
          } else if (allCompleted) {
            const className = document.querySelector('.breadcrumb .active, .title')?.textContent?.trim() || '专题班';

            Utils.logger.debug('当前专题班所有课程已完成，终止所有动作', 'Router');
            UI.updateStatus(`当前专题班「${className}」已完成！`, 'success');
            Utils.notificationManager.send(`当前专题班「${className}」已完成！`);

            sessionStorage.setItem('just_finished_thematic_class', className);
            sessionStorage.removeItem('currentThematicClassId');
            sessionStorage.removeItem('learningMode');
            sessionStorage.removeItem('isThematicClass');
            sessionStorage.removeItem('fromThematicLearning');
            Utils.stateManager.clear();

            if (tid) {
              const visitedClasses = Utils.storage.get('ahgbjy_visited_thematic_classes', []);
              if (!visitedClasses.includes(tid)) {
                visitedClasses.push(tid);
                Utils.storage.set('ahgbjy_visited_thematic_classes', visitedClasses);
              }
            }

            CourseHandler.isProcessing = false;
            Utils.logger.debug('专题班课程完成，已终止所有跳转动作', 'Router');
            return;
          }
          CourseHandler.isProcessing = false;
        }
      }, '专题班处理失败');
    },

    /**
     * 处理专题班章节缓存
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    handleChapterCache: async (options) => {
      const { cacheKey = 'ahgbjy_course_chapters', onChapterComplete, onError } = options;

      try {
        const { valid: isCacheValid, data: courseInfo } = Utils.storage.validateCache(cacheKey);

        if (!isCacheValid) return false;

        Utils.logger.info(`专题班使用缓存的章节信息，共 ${courseInfo.chapters.length} 个章节`);

        const chapterIndex = courseInfo.chapters.findIndex(ch => (ch.progress || 0) < 100);
        const incompleteChapter = chapterIndex >= 0 ? courseInfo.chapters[chapterIndex] : null;

        if (!incompleteChapter) {
          Utils.logger.info('专题班所有章节已完成，清理缓存');
          sessionStorage.removeItem(cacheKey);
          CourseHandler.isProcessing = false;
          return true;
        }

        const userId = PlatformAPI.getUserId();
        if (!userId) {
          Utils.logger.error('无法获取 userId');
          sessionStorage.removeItem(cacheKey);
          CourseHandler.isProcessing = false;
          if (onError) onError('无法获取 userId');
          return false;
        }

        const durationSeconds = (incompleteChapter.duration || 30) * 60;
        const learnedSeconds = incompleteChapter.learnedTime || 0;
        const remainingSeconds = Math.max(0, durationSeconds - learnedSeconds);

        Utils.logger.info(`专题班开始学习: ${incompleteChapter.chaptername}, 剩余: ${remainingSeconds}秒`);

        sessionStorage.removeItem(cacheKey);

        const tracker = CourseHandler.startSilentMode({
          duration: remainingSeconds,
          courseId: courseInfo.courseId,
          chapterId: incompleteChapter.chapterid,
          userId,
          chapterName: incompleteChapter.chaptername,
          courseTitle: courseInfo.courseTitle,
          onProgress: (elapsed, total) => {
            const percent = Math.min(100, Math.round((elapsed / total) * 100));
            UI.updateBackgroundStatus(true, {
              chapterName: incompleteChapter.chaptername,
              courseTitle: courseInfo.courseTitle,
              percent,
              currentChapter: chapterIndex + 1,
              totalChapters: courseInfo.chapters.length,
            });
          },
          onComplete: async () => {
            Utils.logger.info(`专题班章节学习完成: ${incompleteChapter.chaptername}`);
            UI.clearCourseInfo();
            if (onChapterComplete) await onChapterComplete(courseInfo);
          },
          onError: (err) => {
            Utils.logger.error(`专题班静默模式错误: ${err}`);
            CourseHandler.isProcessing = false;
            UI.clearCourseInfo();
            if (onError) onError(err);
          },
        });

        if (tracker) {
          Utils.logger.info('专题班静默模式已启动');
          return true;
        }
      } catch (e) {
        Utils.logger.error(`解析专题班章节缓存失败: ${e.message}`);
        sessionStorage.removeItem(cacheKey);
      }
      return false;
    }
  };

  /**
   * Router Module - 路由协调器
   *
   * 负责页面识别和分发到对应的处理器。
   */

  const Router = {
    _initialized: false,

    /**
     * 初始化路由管理器
     */
    init: () => {
      if (Router._initialized) return;
      Router._initialized = true;

      Utils.safeExecute(() => {
        // 页面加载时清除可能残留的章节信息
        const url = window.location.href;
        const isListPage = url.includes('courselist.do') || url.includes('mycourse.do');

        if (isListPage) {
          const pendingCourse = sessionStorage.getItem('ahgbjy_pending_course');
          const oldChapter = sessionStorage.getItem('ahgbjy_fetched_chapter');

          if (oldChapter && !pendingCourse) {
            try {
              const chapterInfo = JSON.parse(oldChapter);
              if (chapterInfo.learnedTime && chapterInfo.learnedTime > 0) {
                Utils.logger.debug(`检测到刷新残留，保存 learnedTime: ${chapterInfo.learnedTime}秒`, 'Router');
                sessionStorage.setItem('ahgbjy_chapter_learned_time', JSON.stringify({
                  chapterId: chapterInfo.chapterId,
                  learnedTime: chapterInfo.learnedTime
                }));
              }
            } catch (e) {
              Utils.logger.error('解析章节信息失败', e, 'Router');
            }
            Utils.logger.debug('检测到刷新残留的章节信息（无 pending_course），清除', 'Router');
            sessionStorage.removeItem('ahgbjy_fetched_chapter');
          } else if (oldChapter && pendingCourse) {
            Utils.logger.debug('从详情页返回，保留章节信息', 'Router');
          }
        }

        Router.handleCurrentPage();
        Utils.logger.info('路由管理器已初始化', 'Router', true);
      }, '路由管理器初始化失败');
    },

    /**
     * 处理当前页面
     */
    handleCurrentPage: () => {
      Utils.safeExecute(() => {
        const url = window.location.href;
        Utils.stateManager.sync();

        const autoContinue = Utils.url.getParam('auto_continue') === 'true' ||
                             window.location.hash.includes('auto_continue=true');

        if (autoContinue) {
          Utils.logger.debug('检测到自动继续标记', 'Router');
        }

        if (url.includes('/pc/login.do')) {
          UI.updateStatus('登录页面 - 脚本已暂停', 'info');
          return;
        }

        const run = (fn, delay = 1000) => {
          Utils.lifecycle.setTimeout(fn, delay);
        };

        if (url.includes('courselist.do')) {
          const ct = Utils.url.getParam('coutype');
          if (ct) sessionStorage.setItem('lastCoutype', ct);

          const cleanUrl = url.split(/[?#]auto_continue=true/)[0].replace(/[?&]refresh_ts=\d+/, '').replace(/[?&]resumption_ts=\d+/, '');
          sessionStorage.setItem('lastListUrl', cleanUrl);

          run(() => Router.handleCourseListPage(), 1500);
        } else if (url.includes('coursedetail.do')) {
          run(() => Router.handleCourseDetailPage(), 1000);
        } else if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
          run(() => Router.handleVideoPage(), 100);
        } else if (url.includes('thematicclasslist.do')) {
          run(() => Router.handleThematicClassListPage(), 1000);
        } else if (url.includes('thematicclassdetail.do')) {
          run(() => Router.handleThematicClassPage(), 1000);
        } else {
          Router.handleHomePage();
        }
      }, '页面处理失败');
    },

    /**
     * 处理首页
     */
    handleHomePage: () => {
      UI.updateStatus('首页已加载', 'info');

      const userId = PlatformAPI.getUserId();
      if (userId) {
        Utils.logger.info(`✓ userID 已捕获: ${userId.substring(0, 4)}***${userId.substring(userId.length - 4)}`, 'Router', true);
        UI.updateStatus('✓ userID 已捕获', 'success');
      } else {
        Utils.logger.warn('userID 未捕获，如果遇到学习问题请刷新首页', 'Router', true);
        UI.updateStatus('⚠️ userID 未捕获', 'warn');
      }
    },

    /**
     * 处理课程列表页
     */
    handleCourseListPage: async () => {
      {
        Utils.logger.info('使用列表页直接学习模式');
        return ListPageHandler.handleCourseListPageWithAPI();
      }
    },

    /**
     * 处理课程列表页（API 模式）
     */
    handleCourseListPageWithAPI: () => {
      return ListPageHandler.handleCourseListPageWithAPI();
    },

    /**
     * 处理课程详情页
     */
    handleCourseDetailPage: () => {
      return DetailPageHandler.handleCourseDetailPage();
    },

    /**
     * 处理视频播放页
     */
    handleVideoPage: () => {
      return VideoPageHandler.handleVideoPage();
    },

    /**
     * 处理专题班列表页
     */
    handleThematicClassListPage: () => {
      return ThematicPageHandler.handleThematicClassListPage();
    },

    /**
     * 处理专题班详情页
     */
    handleThematicClassPage: () => {
      return ThematicPageHandler.handleThematicClassPage();
    },

    /**
     * 处理章节缓存
     */
    handleChapterCache: (options) => {
      return ListPageAPIMode.handleChapterCache(options);
    },

    /**
     * 获取当前页面类型
     * @returns {string}
     */
    getCurrentPageType: () => {
      return PageRecognizer.detectCurrentPage();
    }
  };

  /**
   * VideoAutoplayBlocker Module prevents unnecessary video playback to save resources.
   */

  const VideoAutoplayBlocker = {
    _initialized: false,
    _popupInterval: null,
    _videoObserver: null,

    init: () => {
      if (VideoAutoplayBlocker._initialized) return;
      VideoAutoplayBlocker._initialized = true;
      Utils.safeExecute(() => {
        Utils.logger.info('资源节省模式：视频播放控制启动');
        VideoAutoplayBlocker.blockAutoplay();
        VideoAutoplayBlocker.blockVideoPopups();
      }, '视频控制初始化失败');
    },

    blockAutoplay: () => {
      Utils.safeExecute(() => {
        const processVideo = (video) => {
          // Precise resource saving matching original script
          video.autoplay = false;
          video.muted = true;
          video.volume = 0;
          video.pause();
          
          video.addEventListener('play', (e) => {
            e.preventDefault();
            video.pause();
          }, true);

          // Visual optimization
          video.style.width = '1px';
          video.style.height = '1px';
          video.style.opacity = '0';
          video.setAttribute('controls', 'false');
        };

        document.querySelectorAll(CONFIG.SELECTORS.VIDEO).forEach(processVideo);

        VideoAutoplayBlocker._videoObserver = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              // Use type guard to ensure node is an Element
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = /** @type {HTMLElement} */ (node);
                if (element.tagName === 'VIDEO') processVideo(/** @type {HTMLVideoElement} */ (element));
                element.querySelectorAll('video').forEach(v => processVideo(/** @type {HTMLVideoElement} */ (v)));
              }
            });
          });
        });
        VideoAutoplayBlocker._videoObserver.observe(document.documentElement, { childList: true, subtree: true });
      }, '阻止自动播放失败');
    },

    blockVideoPopups: () => {
      Utils.safeExecute(() => {
        const hidePopups = () => {
          CONFIG.SELECTORS.POPUPS.forEach(selector => {
            const popup = document.querySelector(selector);
            if (popup) popup.remove();
          });
        };
        hidePopups();
        VideoAutoplayBlocker._popupInterval = Utils.lifecycle.setInterval(hidePopups, CONFIG.TIMEOUTS.POPUP_CHECK);
      }, '屏蔽弹窗设置失败');
    },

    cleanup: () => {
      Utils.safeExecute(() => {
        if (VideoAutoplayBlocker._popupInterval) {
          Utils.lifecycle.clearInterval(VideoAutoplayBlocker._popupInterval);
          VideoAutoplayBlocker._popupInterval = null;
        }
        if (VideoAutoplayBlocker._videoObserver) {
          try { VideoAutoplayBlocker._videoObserver.disconnect(); } catch { /* ignore */ }
          VideoAutoplayBlocker._videoObserver = null;
        }
        VideoAutoplayBlocker._initialized = false;
        Utils.logger.info('视频控制已清理');
      }, '视频控制清理失败');
    }
  };

  /**
   * Entry point for Anhui Cadre Education Auto Study Script.
   */

  const App = {
    _initialized: false,

    init: () => {
      // 防止重复初始化
      if (App._initialized) return;
      App._initialized = true;

      Utils.safeExecute(() => {
        // Connect Logger to UI and set dynamic prefix with version
        Utils.logger.prefix = `[安徽干部教育助手 V${CONFIG.VERSION}]`;
        // 设置 UI 回调 - 同时更新状态和日志区域
        Utils.logger.onUpdateUI = (msg, level) => {
          // updateStatus 内部已调用 appendLog，避免重复输出
          UI.updateStatus(msg, level);
        };
        Utils.logger.onClearUI = () => UI.clearLogs();
        Utils.logger.onUpdateBackgroundUI = (isBackground) => {
          // 简化：静默模式进行中时显示进度区块，否则显示统一状态
          // isBackground 参数不再影响 UI 显示（后台时用户看不到 UI）
          UI.updateBackgroundStatus(isBackground);
        };
        Utils.logger.onUpdateStatusUI = (msg, type) => UI.updateStatus(msg, type);

        Utils.logger.info(`安徽干部在线教育自动学习 启动`, 'App', true);
        
        if (window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1')) {
          Utils.logger.info('检测到后台模式标记', 'App', true);
          sessionStorage.setItem('isBackgroundMode', 'true');
        }

        // Initialize protection layer
        VideoAutoplayBlocker.init();
        Utils.setupProtection();

        if (document.readyState === 'loading') {
          Utils.lifecycle.addEventListener(document, 'DOMContentLoaded', App.start);
        } else {
          App.start();
        }
      }, '应用初始化失败');
    },

    start: () => {
      Utils.safeExecute(() => {
        if (!document.body) {
          Utils.lifecycle.setTimeout(App.start, 100);
          return;
        }

        Utils.logger.info('页面加载完成，启动主程序', 'App', true);

        Utils.tabManager.register();

        // Inject dependencies into monitor to avoid circular imports
        Utils.monitor.onCheckDetail = () => Router.handleCourseDetailPage();
        Utils.monitor.onNavigationChange = () => Router.handleCurrentPage();
        Utils.monitor.onResetProcessing = () => { CourseHandler.isProcessing = false; };

        Utils.monitor.init(Utils);
        WakeLockManager.init();

        sessionStorage.setItem('lastUrl', window.location.href);
        sessionStorage.setItem('lastActiveTime', Date.now().toString());

        UI.init();
        CourseHandler.init();
        Router.init();

        Utils.logger.info('所有模块启动完成', 'App', true);
      }, '应用启动失败');
    }
  };

  window.addEventListener('beforeunload', () => {
    Utils.safeExecute(() => {
      if (Utils.tabManager) Utils.tabManager.unregister();
      VideoAutoplayBlocker.cleanup?.();
      WakeLockManager.cleanup();
      Utils.lifecycle.cleanup();
      Utils.logger.info('应用已安全清理', 'App', true);
    }, '应用清理失败');
  });

  App.init();

})();
