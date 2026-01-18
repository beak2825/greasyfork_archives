// ==UserScript==
// @name        安徽干部教育在线自动学习
// @description 安徽干部教育在线自动学习脚本，支持自动播放、自动跳转、防暂停
// @namespace   http://tampermonkey.net/
// @version     1.5.8
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
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

/**
 * 安徽干部教育在线自动学习脚本 (UserScript)
 * -------------------------------------------------------------------------
 * 版本: V1.5.8
 * 更新: 2026-01-17
 * 作者: Moker32
 *
 * [说明] V1.5.8
 * • Bug修复：修复专题班状态管理中的方法调用问题，提升状态同步稳定性
 * • 代码优化：清理冗余配置和未使用代码，减少约28行无效代码
 * • 结构改进：优化选择器配置，提升代码可维护性
 * -------------------------------------------------------------------------
 */

(function () {
  'use strict';

  /**
   * Global configuration for the script.
   * All selectors, timeout values, and storage keys must be defined here.
   */
  const CONFIG = {
    VERSION: '1.5.8',
    TIMEOUTS: {
      DEFAULT_WAIT: 2000,
      POPUP_CHECK: 5000,
      WAKE_LOCK_FALLBACK: 30000,
      LONG_ACTIVITY_CHECK: 300000
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
          '.cmt7'
        ]},
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
        COMPLETE_BTN: '#completebtn'
      }
    },
    STORAGE_KEYS: {
      VISITED_COURSES: 'visitedCourses',
      GLOBAL_APP_STATE: 'global_app_state',
      PLAY_LOCK: 'ahgbjy_play_lock',
      TAB_TABLE: 'ahgbjy_tab_table',
      REMOTE_REFRESH: 'remote_refresh_signal'
    }
  };

  /**
   * Specialized logger with prefixing and UI integration.
   */
  const Logger = {
    prefix: '[安徽干部教育助手]',
    _format: (level, msg) => {
      const time = new Date().toLocaleTimeString();
      return `${Logger.prefix} [${time}] [${level.toUpperCase()}] ${msg}`;
    },
    info: (msg, updateUI = false) => {
      console.log(Logger._format('info', msg));
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'info');
    },
    success: (msg, updateUI = true) => {
      console.log('%c' + Logger._format('success', msg), 'color: green; font-weight: bold;');
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'success');
    },
    warn: (msg, updateUI = true) => {
      console.warn(Logger._format('warn', msg));
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'warning');
    },
    error: (msg, errorObj = null) => {
      const fullMsg = errorObj ? `${msg} | Error: ${errorObj.message}` : msg;
      console.error(Logger._format('error', fullMsg));
      if (errorObj) console.debug(errorObj);
      if (Logger.onUpdateUI) Logger.onUpdateUI(msg, 'error');
    },
    onUpdateUI: null
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
        url = (typeof global !== 'undefined' && typeof global.getLocationHref === 'function')
          ? global.getLocationHref()
          : window.location.href;
      }
      const regex = new RegExp(`[?&#]${name}=([^&#]*)`);
      const match = url.match(regex);
      return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
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
      // Deep copy for arrays/objects to prevent reference issues
      return val ? JSON.parse(JSON.stringify(val)) : val;
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
      const url = (typeof global !== 'undefined' && typeof global.getLocationHref === 'function')
        ? global.getLocationHref()
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
        // Revert to 15 seconds for fast response to closed tabs
        return Object.values(table).some(tab => 
          tab.type === 'player' && 
          (!courseId || String(tab.courseId) === String(courseId)) && 
          (now - tab.timestamp < 15000)
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

  const GlobalLock = {
    lockKey: CONFIG.STORAGE_KEYS.PLAY_LOCK,
    
    isLocked: () => {
      const lockData = StorageUtils.get(GlobalLock.lockKey, null);
      if (!lockData) return false;

      const now = Date.now();
      const lockAge = now - lockData.timestamp;

      // Definitive expiration: 5 minutes
      if (lockAge > 300000) {
        Logger.info('全局锁已超时(5分钟)，自动释放');
        return false;
      }

      // Active zombie lock detection: 35 seconds without heartbeat
      // This allows immediate action instead of waiting for BackgroundMonitor
      if (lockAge > 35000) {
        Logger.warn(`检测到僵死锁 (Course: ${lockData.courseId})，心跳停止 ${Math.round(lockAge/1000)}秒，主动释放`);
        GlobalLock.forceRelease();
        return false;
      }

      return true;
    },
    
    heartbeat: () => {
      if (sessionStorage.getItem('currentlyStudying') !== 'true') return;
      const courseId = sessionStorage.getItem('currentLockCourseId');
      if (!courseId) return;

      StorageUtils.set(GlobalLock.lockKey, {
        courseId: courseId,
        timestamp: Date.now()
      });
    },

    acquire: (courseId) => {
      sessionStorage.setItem('currentlyStudying', 'true');
      sessionStorage.setItem('currentLockCourseId', courseId);
      GlobalLock.heartbeat();
      Logger.info(`已获取全局播放锁: ${courseId}`);
    },
    
    release: () => {
      const currentCourseId = sessionStorage.getItem('currentLockCourseId');
      const lockData = StorageUtils.get(GlobalLock.lockKey, null);
      if (lockData && String(lockData.courseId) === String(currentCourseId)) {
        GlobalLock.forceRelease();
      }
      sessionStorage.removeItem('currentlyStudying');
      sessionStorage.removeItem('currentLockCourseId');
    },

    forceRelease: () => {
      if (typeof GM_setValue === 'function') {
        GM_setValue(GlobalLock.lockKey, null);
      }
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

    init: (utils) => {
      if (BackgroundMonitor._initialized) return;
      BackgroundMonitor._initialized = true;
      BackgroundMonitor.utils = utils;

      utils.safeExecute(() => {
        // Initialize signal baseline
        BackgroundMonitor.lastSignalTime = utils.storage.get(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, 0);
        utils.logger.info(` 初始化刷新信号基准: ${BackgroundMonitor.lastSignalTime}`);

        // Listen for remote refresh signals (event-driven approach)
        if (typeof GM_addValueChangeListener === 'function') {
          BackgroundMonitor._refreshListenerId = GM_addValueChangeListener(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, (name, oldVal, newVal, remote) => {
            if (remote) {
              utils.logger.info(' 收到远程刷新信号，准备更新课程列表');
              const currentUrl = window.location.href;
              // Only respond on course list, thematic class detail, or course detail pages
              if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                // Status update injected via logger callback
                if (utils.logger.onUpdateStatusUI) utils.logger.onUpdateStatusUI('课程已完成，正在刷新列表...', 'success');

                // Force refresh: add timestamp to prevent caching
                const urlObj = new URL(window.location.href);
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
        if (BackgroundMonitor.keepAliveWorker) {
          try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch (_) {}
          try { BackgroundMonitor.keepAliveWorker.terminate(); } catch (_) {}
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
          try { URL.revokeObjectURL(url); } catch (_) {}
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
          const currentUrl = window.location.href;
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
          const rawPushState = history.pushState;
          const rawReplaceState = history.replaceState;
          const wrap = (fn) => function(...args) {
            const ret = fn.apply(this, args);
            try { notify(); } catch (_) {}
            return ret;
          };
          history.pushState = wrap(rawPushState);
          history.replaceState = wrap(rawReplaceState);
          utils.lifecycle.addCleanup(() => {
            history.pushState = rawPushState;
            history.replaceState = rawReplaceState;
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
        const currentUrl = window.location.href;

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

            // Heartbeat check: Revert to 35 seconds for responsive self-healing
            const silenceDuration = now - lockData.timestamp;
            if (silenceDuration > 35000) {
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
        const currentUrl = window.location.href;
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
        // Remove value change listener
        if (BackgroundMonitor._refreshListenerId && typeof GM_removeValueChangeListener === 'function') {
          GM_removeValueChangeListener(BackgroundMonitor._refreshListenerId);
          BackgroundMonitor._refreshListenerId = null;
        }

        if (BackgroundMonitor.keepAliveWorker) {
          try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch (_) {}
          try { BackgroundMonitor.keepAliveWorker.terminate(); } catch (_) {}
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
   * Central utility entry point.
   */

  /**
   * @typedef {Object} UtilsType
   * @property {typeof Logger} logger
   * @property {typeof URLUtils} url
   * @property {typeof StorageUtils} storage
   * @property {typeof TabManager} tabManager
   * @property {typeof GlobalLock} globalLock
   * @property {typeof StateManager} stateManager
   * @property {typeof BackgroundMonitor} monitor
   */

  /** @type {UtilsType & Object} */
  const Utils = {
    logger: Logger,
    url: URLUtils,
    storage: StorageUtils,
    tabManager: TabManager,
    globalLock: GlobalLock,
    stateManager: StateManager,
    monitor: BackgroundMonitor,

    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),

    broadcastRefresh: () => {
      if (typeof GM_setValue === 'function') {
        GM_setValue('remote_refresh_signal', Date.now());
        GM_setValue('force_reload_requested', true);
      }
    },

    lifecycle: {
      _intervals: new Set(),
      _timeouts: new Set(),
      _listeners: [],
      _observers: new Set(),
      _cleaners: [],
      addCleanup(fn) { if (typeof fn === 'function') this._cleaners.push(fn); },
      setInterval(fn, ms) {
        const id = setInterval(fn, ms);
        this._intervals.add(id);
        return id;
      },
      clearInterval(id) {
        if (id) { clearInterval(id); this._intervals.delete(id); }
      },
      setTimeout(fn, ms) {
        const id = setTimeout(() => { this._timeouts.delete(id); fn(); }, ms);
        this._timeouts.add(id);
        return id;
      },
      clearTimeout(id) {
        if (id) { clearTimeout(id); this._timeouts.delete(id); }
      },
      addEventListener(target, type, handler, options) {
        if (!target || typeof target.addEventListener !== 'function') return;
        target.addEventListener(type, handler, options);
        this._listeners.push({ target, type, handler, options });
      },
      addObserver(observer) {
        if (observer) this._observers.add(observer);
        return observer;
      },
      cleanup() {
        for (const ob of this._observers) try { ob.disconnect(); } catch (_) {}
        this._observers.clear();
        for (const { target, type, handler, options } of this._listeners) try { target.removeEventListener(type, handler, options); } catch (_) {}
        this._listeners = [];
        for (const id of this._intervals) try { clearInterval(id); } catch (_) {}
        this._intervals.clear();
        for (const id of this._timeouts) try { clearTimeout(id); } catch (_) {}
        this._timeouts.clear();
        for (const fn of this._cleaners) try { fn(); } catch (_) {}
        this._cleaners = [];
      }
    },

    safeExecute: (func, context = '未知操作') => {
      try {
        return func();
      } catch (error) {
        Logger.error(`[运行时异常] 在 ${context} 发生错误: ${error.message}`, error);
        return null;
      }
    },

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

    wait: (ms) => new Promise(resolve => Utils.lifecycle.setTimeout(resolve, ms)),

    waitForElement: (selector, timeout = 10000) => {
      return new Promise((resolve, reject) => {
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
            resolve(el);
          }
        });

        const startObserver = () => {
          const target = document.body || document.documentElement;
          observer.observe(target, { childList: true, subtree: true });
        };

        if (document.body) startObserver();
        else {
          const bodyCheck = setInterval(() => {
            if (document.body) {
              clearInterval(bodyCheck);
              startObserver();
            }
          }, 50);
        }

        Utils.lifecycle.setTimeout(() => {
          observer.disconnect();
          reject(new Error(`等待元素超时: ${selector}`));
        }, timeout);
      });
    },

    dom: {
      smartClick: (element, description = '点击操作') => {
        return Utils.safeExecute(() => {
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
            Utils.lifecycle.setTimeout(() => {
              if (window.location.href === currentUrl) {
                Logger.info(`${description}: 页面未响应，执行备用点击`);
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              }
            }, 2000);
          }
          return true;
        }, `点击失败: ${description}`) || false;
      }
    },

    navigateTo: (url, reason = '页面跳转') => {
      Utils.safeExecute(() => {
        Logger.info(`${reason}: ${url}`);
        sessionStorage.setItem('returning', 'true');
        window.location.href = url;
        Utils.lifecycle.setTimeout(() => {
          if (!window.location.href.includes(url.split('?')[0])) {
            window.location.assign(url);
          }
        }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
      }, `导航失败: ${url}`);
    },

    notificationManager: {
      title: '安徽干部教育自动学习',
      send(text, options = {}) {
        const title = this.title;
        const icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';
        if (typeof GM_notification === 'function') {
          GM_notification({ text, title, image: icon, highlight: true, silent: false, timeout: 10000, onclick: () => window.focus(), ...options });
        } else if ('Notification' in window && Notification.permission === 'granted') {
          const n = new Notification(title, { body: text, icon, ...options });
          n.onclick = () => { window.focus(); n.close(); };
        }
      }
    },

    extractMinutes: text => {
      if (!text) return 30;
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1]) : 30;
    },

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
                try { fullUrl = new URL(url, window.location.href).href; } catch (e) { fullUrl = url; }
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
    }
  };

  /**
   * UI Manager for the script.
   * Fully restored matching original script UI and inline styles.
   */

  const UI = {
    init: () => {
      Utils.safeExecute(() => {
        if (document.body) UI.createPanel();
        else {
          const check = setInterval(() => {
            if (document.body) { clearInterval(check); UI.createPanel(); }
          }, 50);
        }
      }, 'UI初始化失败');
    },

    createPanel: () => {
      Utils.safeExecute(() => {
        if (document.getElementById('study-assistant-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'study-assistant-panel';
        // Restored exact inline styles from original script
        panel.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 300px; background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; font-family: Arial, sans-serif; font-size: 12px;';
        
        panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; color: #333;">安徽干部教育助手 V${CONFIG.VERSION}</div>
        <div id="status-display" style="padding: 8px; background: #f5f5f5; border-radius: 3px; margin-bottom: 10px; min-height: 20px;">脚本加载中...</div>
        <div id="background-status" style="padding: 5px; background: #e8f5e8; border-radius: 3px; font-size: 11px; text-align: center;">前台运行中</div>
      `;

        document.body.appendChild(panel);
        UI.updateStatus('脚本已就绪', 'info');
      }, 'UI面板创建失败');
    },

    updateStatus: (message, type = 'info') => {
      Utils.safeExecute(() => {
        const statusEl = document.getElementById('status-display');
        if (statusEl) {
          const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
          };
          statusEl.textContent = message;
          statusEl.style.color = colors[type] || colors.info;
        }
      }, '状态更新失败');
    },

    updateBackgroundStatus: (isBackground) => {
      Utils.safeExecute(() => {
        const bgEl = document.getElementById('background-status');
        if (bgEl) {
          if (isBackground) {
            bgEl.textContent = '后台运行中';
            bgEl.style.background = '#fff3cd';
          } else {
            bgEl.textContent = '前台运行中';
            bgEl.style.background = '#e8f5e8';
          }
        }
      }, '后台状态更新失败');
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
      } catch (error) {
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
          // 轻微的DOM活动
          document.title = document.title;

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
   * CourseHandler Module manages course selection, study timing, and state.
   */

  const CourseHandler = {
    currentCourse: null,
    isProcessing: false,

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

    openCourse: (courseElement) => {
      if (!courseElement) return;
      Utils.safeExecute(() => {
        let courseTitle = CourseHandler.extractCourseTitle(courseElement);
        
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

        CourseHandler.isProcessing = true;
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
            Utils.logger.info(`🎯 专题班模式：跳转携带参数 thm=1, tid=${tid}`);
          }

          Utils.logger.info(`导航至: ${playUrl}`);
          Utils.navigateTo(playUrl, '打开课程');
        } else {
          Utils.logger.info('未找到直接链接，尝试点击元素');
          Utils.dom.smartClick(courseElement, '打开课程');
        }
      }, '打开课程失败');
    },

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
            Utils.logger.info(' 倒计时结束，触发完成按钮');
            completeButton.click();
            Utils.lifecycle.setTimeout(() => CourseHandler.handleStudyComplete(), 3000);
          }
        }, totalMs);
      }, '学习时间处理失败');
    },

    handleStudyComplete: () => {
      Utils.safeExecute(() => {
        Utils.logger.info('章节学习完成，寻找下一步');
        const currentUrl = window.location.href;
        const courseId = Utils.url.extractCourseId(currentUrl);
        console.log(` 任务完成处理 - 课程ID: ${courseId || '未 知'}`);

        if (courseId) {
            console.log(` 记录已完成课程黑名单: ${courseId}`);
            Utils.storage.addVisited(courseId);
            sessionStorage.setItem('last_completed_course', courseId);
        }

        CourseHandler.returnToCourseList();
      }, '学习完成处理失败');
    },

    selectCourse: (courseElements, visitedCourses) => {
      console.log(`开始选择课程，共 ${courseElements.length} 个课程，已访问 ${visitedCourses.length} 个`);

      // Priority 1: "Learning" status
      for (const el of courseElements) {
        const status = CourseHandler.extractCourseStatus(el);
        const courseId = Utils.url.extractCourseId(el);
        console.log(`检查课程 - ID: ${courseId}, 状态: "${status}", 已访问: ${visitedCourses.includes(courseId)}`);

        if (status === "学习中") {
          if (!visitedCourses.includes(courseId)) {
            console.log(' 找到学习中的课程（未访问）');
            return el;
          } else {
            console.log(` 发现误入黑名单的"学习中"课程: ${courseId}，正在移除黑名单记录并恢复学习...`);
            Utils.storage.removeVisited(courseId);
            return el;
          }
        }
      }

      // Priority 2: "Not Started" status (or anything not "Completed")
      for (const el of courseElements) {
        const status = CourseHandler.extractCourseStatus(el);
        const courseId = Utils.url.extractCourseId(el);

        if (status && status !== "已完成") {
          if (!visitedCourses.includes(courseId)) {
            console.log(` 选择未完成课程: ${courseId} (状态: "${status}")`);
            return el;
          }
        }
      }

      console.log('未找到合适的课程');
      return null;
    },

    extractCourseStatus: (el) => {
      if (!el) return null;

      // 1. Image based detection (highest priority)
      const findImg = (selector) => el.querySelector(selector) || (el.tagName === 'TD' && el.closest('tr')?.querySelector(selector));

      // IMPORTANT: Check specific image src, NOT class="yx" (all status images share this class)
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
    },

    handlePagination: async () => {
      try {
        const pagination = Utils.$('.pagination');
        if (!pagination) {
          console.error('未找到分页元素');
          return false;
        }
        const pageLinks = pagination.querySelectorAll('a[href]');
        console.log(`找到 ${pageLinks.length} 个分页链接`);
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
        console.error('未找到下一页按钮');
        return false;
      } catch (e) {
        console.error(`分页处理错误: ${e.message}`);
        return false;
      }
    },

    switchCourseType: () => {
      Utils.safeExecute(() => {
        const currentType = Utils.url.getParam('coutype') || '1';
        const otherType = currentType === '1' ? '0' : '1';
        console.log(`当前课程类型: ${currentType === '1' ? '必修' : ' 选修'}`);
        
        const flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
        Utils.storage.set(flagKey, 'true');
        sessionStorage.setItem(`verified_type_${currentType}`, 'true');

        const requiredCompleted = Utils.storage.get('requiredCoursesCompleted', 'false');
        const electiveCompleted = Utils.storage.get('electiveCoursesCompleted', 'false');
        const requiredVerified = sessionStorage.getItem('verified_type_1') === 'true';
        const electiveVerified = sessionStorage.getItem('verified_type_0') === 'true';
        
        if (requiredCompleted === 'true' && electiveCompleted === 'true' && requiredVerified && electiveVerified) {
          console.log(' 所有课程均已通过本次会话验证并确认完成！');
          Utils.logger.success(' 所有课程均已通过本次会话验证并确认完成！');
          UI.updateStatus(' 所有课程已完成！', 'success');
          Utils.notificationManager.send('恭喜！所有必修和选修课程均已完成！');
          alert(' 恭喜！所有必修和选修课程均已完成！');
          return;
        }
        
        if (currentType === '1') {
          console.log(' 必修页学完，准备切换到选修课程进行验证');
          UI.updateStatus('切换到选修课程...', 'info');
        } else {
          console.log(' 选修页学完，准备切换到必修课程进行验证');
          UI.updateStatus('切换到必修课程...', 'info');
        }
        
        const targetUrl = `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=${otherType}`;
        Utils.navigateTo(targetUrl, '切换类型');
      }, '类型切换失败');
    },

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

        console.log(`找到 ${chapters.length} 个章节`);

        chapters.forEach((button, index) => {
          Utils.safeExecute(() => {
            const chapterId = button.getAttribute('data-chapterid');
            if (!chapterId) return;

            const row = button.closest('tr');
            if (!row) return;

            // 改进的时长和进度提取逻辑
            let totalMinutes = 30;  // 默认30分钟
            let learnedPercent = 0;

            // 获取所有单元格
            const cells = row.querySelectorAll('td');

            // 查找包含"分钟"的单元格（时长）
            for (const cell of cells) {
              const text = cell.textContent.trim();
              if (text.includes('分钟')) {
                totalMinutes = Utils.extractMinutes(text);
                console.log(`章节${index + 1}时长: ${totalMinutes}分钟`);
                break;
              }
            }

            // 查找包含"%"的单元格（进度）
            for (const cell of cells) {
              const text = cell.textContent.trim();
              const match = text.match(/(\d+)%/);
              if (match) {
                learnedPercent = parseInt(match[1]);
                console.log(`章节${index + 1}进度: ${learnedPercent}%`);
                break;
              }
            }

            // 如果上面没找到，尝试使用col-md-2选择器
            if (totalMinutes === 30) {
              const colMd2Cells = row.querySelectorAll('td.col-md-2');
              if (colMd2Cells.length >= 1) {
                const timeText = colMd2Cells[0].textContent;
                if (timeText.includes('分钟')) {
                  totalMinutes = Utils.extractMinutes(timeText);
                  console.log(`章节${index + 1}时长（备用）: ${totalMinutes}分钟`);
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
                  console.log(`章节${index + 1}进度（备用）: ${learnedPercent}%`);
                }
              }
            }

            const key = `duration_${courseId}_${chapterId}`;
            Utils.storage.set(key, totalMinutes.toString());
            console.log(`章节${index + 1}总时长已记录: ${totalMinutes}分钟`);
          }, `章节${index + 1}信息提取错误`);
        });
      }, '章节信息处理错误');
    },

    /**
     * 验证专题班列表页的实际课程进度
     * 通过检查专题班页面中该课程的实际显示进度来确认是否真的完成
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
    },

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

            // 查找进度信息
            const cells = row.querySelectorAll('td');
            let hasProgress = false;

            for (const cell of cells) {
              const text = cell.textContent.trim();
              const match = text.match(/(\d+)%/);
              if (match) {
                hasProgress = true;
                const progress = parseInt(match[1]);
                if (progress === 100) {
                  completedCount++;
                } else {
                  allCompleted = false;
                  Utils.logger.info(`章节${index + 1}未完成: ${progress}%`);
                }
                break;
              }
            }

            // 如果没找到进度%，尝试检查是否有"已完成"文本
            if (!hasProgress) {
              if (row.textContent.includes('已完成')) {
                completedCount++;
              } else {
                allCompleted = false;
              }
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

    extractChapterName: (row, chapterIndex) => {
      if (!row) return `第${chapterIndex + 1}章`;

      try {
        // Debug logging
        console.log(`分析第${chapterIndex + 1}个章节，row结构:`, {
          tds: row.querySelectorAll('td').length,
          text: row.textContent.substring(0, 200)
        });

        // Method 1: Cell analysis - iterate through all TD cells
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
            console.log(`  从单元格提取章节名: "${text}"`);
            return text;
          }
        }

        // Method 2: Pattern matching in row text
        const rowText = row.textContent;
        const patterns = [
          /第[一二三四五六七八九十\d]+章[\s:：]*([^\n]{2,30})/,
          /[一二三四五六七八九十]+、[ \t]*([^\n]{2,30})/,
          /\d+[\.、][ \t]*([^\n]{2,30})/,
          /第\d+节[\s:：]*([^\n]{2,30})/,
          /章[\s:：]*([^\n]{2,30})/,
          /节[\s:：]*([^\n]{2,30})/
        ];

        for (const pattern of patterns) {
          const match = rowText.match(pattern);
          if (match && match[1]) {
            const title = match[1].trim();
            if (title.length > 2) {
              console.log(`  从模式匹配提取章节名: "${title}"`);
              return title;
            }
          }
        }

        // Method 3: Text block analysis - find longest meaningful text
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
          // Sort by length (descending) and take the longest
          textBlocks.sort((a, b) => b.length - a.length);
          const longest = textBlocks[0].trim();
          console.log(`  从文本块分析提取章节名: "${longest}"`);
          return longest;
        }

        // Fallback
        console.log(`  未找到章节名，使用默认值`);
        return `第${chapterIndex + 1}章`;
      } catch (error) {
        console.error(`章节${chapterIndex + 1}名称提取错误:`, error);
        return `第${chapterIndex + 1}章`;
      }
    },

    findAndClickIncompleteChapter: () => {
      Utils.safeExecute(() => {
        const courseId = Utils.url.extractCourseId(window.location.href);

        // 首先检查全局锁，或者是否已有该课程的活跃标签页
        if (Utils.globalLock.isLocked() || (courseId && Utils.tabManager.hasActivePlayer(courseId))) {
          console.log(`检测到全局锁占用或已存在该课程的活跃播放页 (${courseId})，进入带超时的等待模式...`);
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
              CourseHandler.findAndClickIncompleteChapter();
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

        console.log('查找未完成章节');

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

          let progress = 0;
          const cells = row.querySelectorAll('td');

          // 查找进度信息
          for (const cell of cells) {
            const text = cell.textContent;
            const match = text.match(/(\d+)%/);
            if (match) {
              progress = parseInt(match[1]);
              break;
            }
          }

          // 如果没找到进度%，检查是否有"已完成"文本
          if (progress === 0 && row.textContent.includes('已完成')) {
            progress = 100;
          }

          if (progress < 100) {
            const chapterName = CourseHandler.extractChapterName(row, i);
            console.log(`找到未完成章节"${chapterName}"（进度：${progress}%），准备点击`);
            UI.updateStatus(`进入章节：${chapterName}（进度：${progress}%）`, 'info');

            const chapterId = btn.getAttribute('data-chapterid');
            const courseId = Utils.url.extractCourseId(window.location.href);

            if (chapterId && courseId) {
              // 修复：在打开播放页之前立即设置临时锁，防止竞态条件
              Utils.globalLock.acquire(courseId);
              Utils.logger.info(`已设置临时锁: ${courseId}，准备打开播放页`);

              let playUrl = `/pc/course/playvideo.do?courseid=${courseId}&chapterid=${chapterId}&bg_mode=1&prev_progress=${progress}`;
              playUrl = new URL(playUrl, window.location.href).href;
              console.log(` 强力后台跳转: ${playUrl}`);
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
        console.log('所有章节已完成，验证专题班列表页进度...');
        const currentCourseId = Utils.url.extractCourseId(window.location.href);

        // 异步验证专题班列表页进度
        CourseHandler.verifyThematicClassProgress(currentCourseId).then((actualProgress) => {
          if (actualProgress >= 0 && actualProgress < 100) {
            // 列表页显示未完成,详情页显示已完成 -> 进度不同步
            Utils.logger.warn(`⚠️ 进度不同步: 详情页100% vs 列表页${actualProgress}%`);
            UI.updateStatus(`等待服务器同步进度... (${actualProgress}%)`, 'warning');

            // 延迟后刷新当前页面重新检查
            Utils.lifecycle.setTimeout(() => {
              Utils.logger.info('刷新课程详情页以重新获取进度');
              sessionStorage.setItem('fromLearningPage', 'true');
              window.location.reload();
            }, 3000);
          } else {
            // 真正完成了,标记为已访问
            console.log('✅ 课程真正完成，标记为已访问并返回列表');
            if (currentCourseId) {
              Utils.storage.addVisited(currentCourseId);
              // 清除进度缓存
              sessionStorage.removeItem(`course_progress_${currentCourseId}`);
            }
            UI.updateStatus('课程已完成，返回列表', 'success');
            Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1000);
          }
        }).catch((e) => {
          // 验证失败,按原逻辑处理
          Utils.logger.warn(`进度验证失败: ${e.message}, 按原逻辑标记为完成`);
          if (currentCourseId) {
            Utils.storage.addVisited(currentCourseId);
          }
          UI.updateStatus('课程已完成，返回列表', 'success');
          Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1000);
        });

        return false;
      }, '查找未完成章节失败');
      return false;
    },

    returnToCourseList: () => {
      Utils.safeExecute(() => {
        const currentUrl = window.location.href;
        const isPlaybackPage = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
        const isBgMode = window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1') || sessionStorage.getItem('isBackgroundMode') === 'true';

        const currentCourseId = Utils.url.extractCourseId(currentUrl);
        console.log(` 任务完成处理 - 课程ID: ${currentCourseId || '未知'}`);

        // 1. First record to blacklist
        if (currentCourseId) {
            console.log(` 记录已完成课程黑名单: ${currentCourseId}`);
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
          console.log(' 播放页：尝试关闭窗口');
          Utils.lifecycle.setTimeout(() => {
            window.close();
            Utils.lifecycle.setTimeout(() => {
              if (!window.closed) {
                  console.log('️ 窗口关闭失败，执行强制跳转返回列表');
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
            console.log('🔗 返回判断：基于 URL 参数（专题班模式）');
          } else if (isThematicSession) {
            console.log('💾 返回判断：基于 sessionStorage（专题班模式）');
          } else if (isThematicGM) {
            console.log('🌐 返回判断：基于 GM存储（专题班模式）');
          } else {
            console.log('📚 返回判断：普通课程模式');
          }

          let backUrl = '';
          if (isThematic) {
              const tid = sessionStorage.getItem('currentThematicClassId') || Utils.url.getParam('tid');
              backUrl = tid ? `/pc/thematicclass/thematicclassdetail.do?tid=${tid}` : '/pc/thematicclass/thematicclasslist.do';
              console.log(' 专题班章节完成，退回到专题班列表:', backUrl);
              sessionStorage.setItem('fromThematicLearning', 'true');
          } else {
              const lastListUrl = sessionStorage.getItem('lastListUrl');
              if (lastListUrl) {
                  backUrl = lastListUrl;
                  console.log(' 普通课程章节完成，退回到最后访问的列表页:', backUrl);
              } else {
                  const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                  backUrl = `/pc/course/courselist.do?coutype=${coursetype}`;
                  console.log(' 普通课程章节完成，退回到主课表首页:', backUrl);
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
          console.log(' 列表页/其他：强制刷新当前页');
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
   * Router Module handles page navigation and triggers specific handlers.
   */

  const Router = {
    init: () => {
      Utils.safeExecute(() => {
        Router.handleCurrentPage();
        console.log('路由管理器已初始化');
      }, '路由管理器初始化失败');
    },
    
    handleCurrentPage: () => {
      Utils.safeExecute(() => {
        const url = window.location.href;
        Utils.stateManager.sync();
        
        const autoContinue = Utils.url.getParam('auto_continue') === 'true' || 
                             window.location.hash.includes('auto_continue=true');
        
        if (autoContinue) {
          console.log('检测到自动继续标记');
          // Do not use replaceState to wipe params, as it removes critical info like pagenum
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
          
          // Strip instructions before saving lastListUrl to prevent pollution
          const cleanUrl = url.split(/[?#]auto_continue=true/)[0].replace(/[?&]refresh_ts=\d+/, '').replace(/[?&]resumption_ts=\d+/, '');
          sessionStorage.setItem('lastListUrl', cleanUrl);
          
          run(() => Router.handleCourseListPage(), 1500);
        } else if (url.includes('coursedetail.do')) {
          run(() => Router.handleCourseDetailPage(), 1000);
        } else if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
          // 修复：减少延迟，从1000ms改为100ms，加快锁获取
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

    handleHomePage: () => {
      UI.updateStatus('首页已加载，请手动进入课程列表', 'info');
      console.log('首页已加载，脚本不会自动跳转到课程列表');
    },

    handleCourseListPage: async () => {
      Utils.safeExecute(async () => {
        if (CourseHandler.isProcessing) return;
        CourseHandler.isProcessing = true;

        console.log('开始处理课程列表页面');

        const currentType = Utils.url.getParam('coutype') || '1';
        const typeName = currentType === '1' ? '必修' : '选修';
        UI.updateStatus(`正在分析${typeName}课程列表...`, 'info');
        
        const targetSelector = CONFIG.SELECTORS.COURSE_LIST.CONTAINERS.join(', ');
        await Utils.waitForElement(targetSelector, 6000);
        
        let courses = Utils.$$(targetSelector);
        if (courses.length === 0) {
          console.log('尝试兜底方案：抓取所有包含课程链接的行');
          courses = Utils.$$('tr').filter(tr => tr.querySelector('a[href*="courseid="]'));
        }

        const validCourses = courses.filter(el => Utils.url.extractCourseId(el));
        if (validCourses.length === 0) {
          UI.updateStatus('未找到课程元素', 'error');
          console.log('当前页面 HTML 结构可能已变动，请检查选择器');
          CourseHandler.isProcessing = false;
          return;
        }

        console.log(`找到 ${validCourses.length} 个候选课程元素`);

        const visitedCourses = Utils.storage.getVisited();
        const stats = { completed: 0, inBlacklist: 0 };

        validCourses.forEach(el => {
          const status = CourseHandler.extractCourseStatus(el);
          const courseId = Utils.url.extractCourseId(el);
          // Only count courses with explicit "已完成" status as completed
          // Blacklist should NOT be used for completion statistics - it's only for avoiding revisits
          if (status === '已完成') {
            stats.completed++;
          }
          // Track blacklist separately for debugging
          if (courseId && visitedCourses.includes(courseId)) {
            stats.inBlacklist++;
          }
        });

        console.log(`当前页统计 - 总数: ${validCourses.length}, 页面显示已完成: ${stats.completed}, 黑名单中: ${stats.inBlacklist}`);

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
          console.log('未找到合适课程，重置记录重试...');
          Utils.storage.clearVisited();
          Utils.lifecycle.setTimeout(() => {
            CourseHandler.isProcessing = false;
            Router.handleCourseListPage();
          }, 2000);
        }
      }, '列表页处理失败');
    },

    handleCourseDetailPage: async () => {
      Utils.safeExecute(async () => {
        if (CourseHandler.isProcessing) return;
        CourseHandler.isProcessing = true;

        Utils.logger.info('=== 开始处理课程详情页 ===');

        // 从 URL 参数恢复专题班状态（最高优先级，避免 sessionStorage/GM存储过期导致丢失）
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
          } catch (e) {
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
          UI.updateStatus(' 课程已学完！准备寻找新任务...', 'success');
          Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1500);
          return;
        }

        CourseHandler.findAndClickIncompleteChapter();
        Utils.lifecycle.setTimeout(() => { CourseHandler.isProcessing = false; }, 5000);
      }, '详情页处理失败');
    },

    handleVideoPage: async () => {
      Utils.safeExecute(async () => {
        // @ts-ignore
        if (window.studyPageProcessingStarted) return;
        // @ts-ignore
        window.studyPageProcessingStarted = true;

        // 修复：在函数最开始就提取courseId并获取锁，减少竞态窗口
        const courseId = Utils.url.extractCourseId(window.location.href);
        if (courseId) {
          Utils.globalLock.acquire(courseId);
          Utils.lifecycle.addEventListener(window, 'beforeunload', () => Utils.globalLock.release());
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
          // SCORM课件可能需要从iframe或其他位置获取标题
          const iframeTitle = document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.IFRAME)?.contentDocument?.title;
          courseTitle = iframeTitle || document.title?.replace(/ - 安徽干部教育在线.*/, '') || 'SCORM课件';
        }

        Utils.logger.info(`📚 正在学习: ${courseTitle}`);
        UI.updateStatus(`正在学习: ${courseTitle}`, 'info');

        const chapterId = Utils.url.extractChapterId(window.location.href);
        const prevProgress = parseInt(Utils.url.getParam('prev_progress') || '0');

        const getBtn = () => {
          // 优先使用 ID 选择器（最快最准确）
          const btn = document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER.COMPLETE_BTN) ||
                      document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.COMPLETE_BTN);
          if (btn) return btn;

          // 兜底方案：通过文本内容查找
          const all = document.querySelectorAll('a.btn, input[type="button"], button');
          for (const b of all) {
            const el = /** @type {HTMLInputElement | HTMLButtonElement} */ (b);
            const t = el.textContent || el.value || '';
            if (t.includes('完成播放') || t.includes('确 定') || t.includes('结束学习')) return el;
          }
          return null;
        };

        let completeButton = getBtn();
        const bind = (btn) => {
          btn.addEventListener('click', () => {
            console.log(' 检测到完成播放动作 (手动/自动)');
            Utils.globalLock.release();
            if (courseId) Utils.storage.addVisited(courseId);
            Utils.broadcastRefresh();
          }, true);
        };

        if (completeButton) bind(completeButton);
        else {
          console.warn('未找到完成按钮，等待动态加载...');
          Utils.lifecycle.setTimeout(() => { 
            const b = getBtn(); 
            if (b) {
              console.log(' 动态补获到完成按钮');
              bind(b); 
            }
          }, 2000);
        }

        let totalSecs = 1800;
        if (courseId && chapterId) {
          const mins = Utils.storage.get(`duration_${courseId}_${chapterId}`);
          if (mins) {
            totalSecs = parseInt(mins) * 60;
            console.log(` 使用详情页存储的时长估值: ${mins}分钟 (${totalSecs}秒)`);
          }
        }

        const waitSecs = Math.max(Math.ceil(totalSecs * (100 - prevProgress) / 100) + 5, 10);
        console.log(` 初始进度: ${prevProgress}%, 剩余比例: ${Math.round((100 - prevProgress))}%, 预计学习: ${waitSecs}秒`);
        sessionStorage.setItem('fromLearningPage', 'true');
        CourseHandler.startStudyTime(waitSecs, completeButton);
      }, '学习页处理失败');
    },

    handleThematicClassListPage: async () => {
      console.log('处理专题班列表页面');
      UI.updateStatus('专题班列表页 - 等待手动选择专题班', 'info');

      const justFinished = sessionStorage.getItem('just_finished_thematic_class');
      if (justFinished) {
        UI.updateStatus(`已完成: ${justFinished}`, 'success');
        sessionStorage.removeItem('just_finished_thematic_class');
      }

      // 清理重试计数（如果有的话）
      sessionStorage.removeItem('thematicListRetryCount');

      console.log('⏸️ 专题班列表页：脚本已暂停，等待用户手动进入专题班详情页');
      UI.updateStatus('请手动选择要学习的专题班', 'info');
    },

    handleThematicClassPage: async () => {
      Utils.safeExecute(async () => {
          if (CourseHandler.isProcessing) return;
          // 修复：统一检查逻辑，同时检查全局锁和活跃播放页
          if (Utils.globalLock.isLocked() || Utils.tabManager.hasActivePlayer()) {
              console.log(' 专题班：检测到其他页面正在播放，停止当前操作');
              UI.updateStatus('其他课程学习中...', 'warning');
              return;
          }
          CourseHandler.isProcessing = true;
          console.log('处理专题班课程页面');
          UI.updateStatus('分析专题班课程...', 'info');

          const tid = Utils.url.getParam('tid');
          if (tid) {
              sessionStorage.setItem('currentThematicClassId', tid);
              Utils.stateManager.setThematicState(tid, 'thematic');
          }
          sessionStorage.setItem('isThematicClass', 'true');
          sessionStorage.setItem('learningMode', 'thematic');

          if (sessionStorage.getItem('fromThematicLearning') === 'true') {
              console.log(' 从专题班学习返回，继续寻找下一门');
              sessionStorage.removeItem('fromThematicLearning');
              // 使用延迟重试代替立即刷新，确保 DOM 完全渲染
              CourseHandler.isProcessing = false;
              Utils.lifecycle.setTimeout(() => Router.handleThematicClassPage(), 1500);
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

          console.log(`找到 ${courseLinks.length} 个课程`);
          const visitedCourses = Utils.storage.getVisited();

          // 增强的进度提取函数，支持两种样式
          const extractProgress = (link) => {
              // 方法1: 旧版样式 - 从 <p> 标签提取 (格式: "学习进度:XX%")
              const oldStyleText = link.querySelector('p')?.textContent || '';
              const oldMatch = oldStyleText.match(/(\d+)%/);
              if (oldMatch) return parseInt(oldMatch[1]);

              // 方法2: 新版样式 - 从 .progress-bar 元素提取
              const progressBar = link.querySelector('.progress-bar');
              if (progressBar) {
                  const barText = progressBar.textContent || '';
                  const barStyle = progressBar.getAttribute('style') || '';
                  // 优先从文本内容提取 (如 "80%")
                  const textMatch = barText.match(/(\d+)%/);
                  if (textMatch) return parseInt(textMatch[1]);
                  // 备用: 从 style 属性提取 (如 "width:80%")
                  const styleMatch = barStyle.match(/width:\s*(\d+)%/);
                  if (styleMatch) return parseInt(styleMatch[1]);
              }

              return 0; // 默认为未开始
          };

          let selectedLink = null;
          // 优先选择进行中的课程 (0% < progress < 100%)
          for (const link of courseLinks) {
              const progress = extractProgress(link);
              const cid = Utils.url.extractCourseId(link.href);
              if (progress > 0 && progress < 100 && cid) {
                  console.log(` 发现进行中课程: ${cid} (${progress}%)`);
                  if (!Utils.globalLock.isLocked()) {
                      selectedLink = link;
                      break;
                  }
              }
          }
          // 如果没有进行中的课程，选择未开始的课程
          if (!selectedLink) {
              for (const link of courseLinks) {
                  const progress = extractProgress(link);
                  const cid = Utils.url.extractCourseId(link.href);
                  if (progress === 0 && cid && !visitedCourses.includes(cid)) {
                      console.log(` 发现未开始课程: ${cid}`);
                      selectedLink = link;
                      break;
                  }
              }
          }

          if (selectedLink) {
              UI.updateStatus('发现匹配课程，准备进入...', 'info');
              // 缓存课程进度到sessionStorage,供详情页验证使用（兼容两种样式）
              const progress = extractProgress(selectedLink);
              const cid = Utils.url.extractCourseId(selectedLink.href);
              if (cid && progress > 0) {
                  sessionStorage.setItem(`course_progress_${cid}`, progress.toString());
                  console.log(`📊 缓存课程进度: ${cid} = ${progress}%`);
              }
              CourseHandler.openCourse(selectedLink);
          } else {
              // 检查是否所有课程都已完成（兼容两种样式）
              const allCompleted = courseLinks.every(link => {
                  const progress = extractProgress(link);
                  return progress === 100;
              });
              if (!allCompleted && visitedCourses.length > 0) {
                  Utils.storage.clearVisited();
                  Utils.lifecycle.setTimeout(() => {
                      CourseHandler.isProcessing = false;
                      Router.handleThematicClassPage();
                  }, 2000);
              } else if (allCompleted) {
                  const className = document.querySelector('.breadcrumb .active, .title')?.textContent?.trim() || '专题班';

                  // 终止所有动作，标记当前专题班已完成
                  console.log('✅ 当前专题班所有课程已完成，终止所有动作');
                  UI.updateStatus(`当前专题班「${className}」已完成！`, 'success');
                  Utils.notificationManager.send(`当前专题班「${className}」已完成！`);

                  // 清理所有专题班相关状态
                  sessionStorage.setItem('just_finished_thematic_class', className);
                  sessionStorage.removeItem('currentThematicClassId');
                  sessionStorage.removeItem('learningMode');
                  sessionStorage.removeItem('isThematicClass');
                  sessionStorage.removeItem('fromThematicLearning');
                  Utils.stateManager.clear();

                  // 记录到已完成的专题班列表
                  if (tid) {
                      const visitedClasses = Utils.storage.get('ahgbjy_visited_thematic_classes', []);
                      if (!visitedClasses.includes(tid)) {
                          visitedClasses.push(tid);
                          Utils.storage.set('ahgbjy_visited_thematic_classes', visitedClasses);
                      }
                  }

                  // 不再跳转，停止在当前页面
                  CourseHandler.isProcessing = false;
                  console.log('🛑 专题班课程完成，已终止所有跳转动作');
                  return;
              }
              CourseHandler.isProcessing = false;
          }
      }, '专题班处理失败');
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
          try { VideoAutoplayBlocker._videoObserver.disconnect(); } catch (_) {}
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
    init: () => {
      Utils.safeExecute(() => {
        // Connect Logger to UI and set dynamic prefix with version
        Utils.logger.prefix = `[安徽干部教育助手 V${CONFIG.VERSION}]`;
        Utils.logger.onUpdateUI = (msg, type) => UI.updateStatus(msg, type);

        Utils.logger.info(`安徽干部在线教育自动学习 启动`);
        
        if (window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1')) {
          Utils.logger.info('检测到后台模式标记');
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

        Utils.logger.info('页面加载完成，启动主程序');

        Utils.tabManager.register();
        
        // Inject dependencies into monitor to avoid circular imports
        Utils.monitor.onCheckDetail = () => Router.handleCourseDetailPage();
        Utils.monitor.onNavigationChange = () => Router.handleCurrentPage();
        Utils.monitor.onResetProcessing = () => { CourseHandler.isProcessing = false; };
        Utils.logger.onUpdateBackgroundUI = (isBackground) => UI.updateBackgroundStatus(isBackground);
        Utils.logger.onUpdateStatusUI = (msg, type) => UI.updateStatus(msg, type);
        
        Utils.monitor.init(Utils);
        WakeLockManager.init();

        sessionStorage.setItem('lastUrl', window.location.href);
        sessionStorage.setItem('lastActiveTime', Date.now().toString());

        UI.init();
        CourseHandler.init();
        Router.init();
        
        Utils.logger.info('所有模块启动完成');
      }, '应用启动失败');
    }
  };

  window.addEventListener('beforeunload', () => {
    Utils.safeExecute(() => {
      if (Utils.tabManager) Utils.tabManager.unregister();
      VideoAutoplayBlocker.cleanup?.();
      WakeLockManager.cleanup();
      Utils.lifecycle.cleanup();
      Utils.logger.info('应用已安全清理');
    }, '应用清理失败');
  });

  App.init();

})();
