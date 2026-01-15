// ==UserScript==
// @name        安徽干部教育在线自动学习
// @description 安徽干部教育在线自动学习脚本，支持自动播放、自动跳转、防暂停
// @namespace   http://tampermonkey.net/
// @version     1.5.6
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
 * 版本: V1.5.6
 * 更新: 2026-01-14
 * 作者: Moker32
 *
 * [说明] V1.5.6
 * • 专题班优化：URL 参数传递专题班状态，提升跨页面稳定性
 * • 流程增强：三重保险检测专题班模式（URL参数 > sessionStorage > GM存储）
 * • 兼容性：改进测试辅助函数支持
 * -------------------------------------------------------------------------
 */

(function () {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c),
        u = i.value;
    } catch (n) {
      return void e(n);
    }
    i.done ? t(u) : Promise.resolve(u).then(r, o);
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this,
        e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(void 0);
      });
    };
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: true
            } : {
              done: false,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = true,
      u = false;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = true, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _regenerator() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
    var e,
      t,
      r = "function" == typeof Symbol ? Symbol : {},
      n = r.iterator || "@@iterator",
      o = r.toStringTag || "@@toStringTag";
    function i(r, n, o, i) {
      var c = n && n.prototype instanceof Generator ? n : Generator,
        u = Object.create(c.prototype);
      return _regeneratorDefine(u, "_invoke", function (r, n, o) {
        var i,
          c,
          u,
          f = 0,
          p = o || [],
          y = false,
          G = {
            p: 0,
            n: 0,
            v: e,
            a: d,
            f: d.bind(e, 4),
            d: function (t, r) {
              return i = t, c = 0, u = e, G.n = r, a;
            }
          };
        function d(r, n) {
          for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
            var o,
              i = p[t],
              d = G.p,
              l = i[2];
            r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
          }
          if (o || r > 1) return a;
          throw y = true, n;
        }
        return function (o, p, l) {
          if (f > 1) throw TypeError("Generator is already running");
          for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
            i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
            try {
              if (f = 2, i) {
                if (c || (o = "next"), t = i[o]) {
                  if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                  if (!t.done) return t;
                  u = t.value, c < 2 && (c = 0);
                } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
                i = e;
              } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
            } catch (t) {
              i = e, c = 1, u = t;
            } finally {
              f = 1;
            }
          }
          return {
            value: t,
            done: y
          };
        };
      }(r, o, i), true), u;
    }
    var a = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    t = Object.getPrototypeOf;
    var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
        return this;
      }), t),
      u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
    function f(e) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
      return this;
    }), _regeneratorDefine(u, "toString", function () {
      return "[object Generator]";
    }), (_regenerator = function () {
      return {
        w: i,
        m: f
      };
    })();
  }
  function _regeneratorDefine(e, r, n, t) {
    var i = Object.defineProperty;
    try {
      i({}, "", {});
    } catch (e) {
      i = 0;
    }
    _regeneratorDefine = function (e, r, n, t) {
      function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      }
      r ? i ? i(e, r, {
        value: n,
        enumerable: !t,
        configurable: !t,
        writable: !t
      }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
    }, _regeneratorDefine(e, r, n, t);
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /**
   * Global configuration for the script.
   * All selectors, timeout values, and storage keys must be defined here.
   */
  var CONFIG = {
    VERSION: '1.5.6',
    TIMEOUTS: {
      DEFAULT_WAIT: 2000,
      POPUP_CHECK: 5000,
      WAKE_LOCK_FALLBACK: 30000,
      LONG_ACTIVITY_CHECK: 300000
    },
    SELECTORS: {
      VIDEO: 'video',
      POPUPS: ['.video-popup', '.video-ad', '.video-overlay', '.player-popup', '.media-popup', '.video-dialog'],
      COURSE_LIST: {
        CONTAINERS: ['.lbms tbody tr', '.ke-box', 'tr[id*="ucheck"]', 'tr:has(td[id*="ucheck"])', 'td[id*="ucheck-list"]',
        // 新增：更通用的选择器
        'tr:has(a[href*="courseid="])', '.coursecard', '.cmt7']},
      COURSE_DETAIL: {
        // 新增：课程详情页选择器
        CHAPTER_BUTTONS: ['.playBtn[data-chapterid]', 'button[data-chapterid]', 'a.playBtn', '.chapter-play-btn']},
      VIDEO_PLAYER: {
        COURSE_TITLE: '#coursenametitle',
        COMPLETE_BTN: '#completebtn'},
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
      REMOTE_REFRESH: 'remote_refresh_signal'}
  };

  /**
   * Specialized logger with prefixing and UI integration.
   */
  var Logger = {
    prefix: '[安徽干部教育助手]',
    _format: function _format(level, msg) {
      var time = new Date().toLocaleTimeString();
      return "".concat(Logger.prefix, " [").concat(time, "] [").concat(level.toUpperCase(), "] ").concat(msg);
    },
    info: function info(msg) {
      var updateUI = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      console.log(Logger._format('info', msg));
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'info');
    },
    success: function success(msg) {
      var updateUI = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      console.log('%c' + Logger._format('success', msg), 'color: green; font-weight: bold;');
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'success');
    },
    warn: function warn(msg) {
      var updateUI = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      console.warn(Logger._format('warn', msg));
      if (updateUI && Logger.onUpdateUI) Logger.onUpdateUI(msg, 'warning');
    },
    error: function error(msg) {
      var errorObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var fullMsg = errorObj ? "".concat(msg, " | Error: ").concat(errorObj.message) : msg;
      console.error(Logger._format('error', fullMsg));
      if (errorObj) console.debug(errorObj);
      if (Logger.onUpdateUI) Logger.onUpdateUI(msg, 'error');
    },
    onUpdateUI: null
  };

  /**
   * URL parsing utilities.
   */
  var URLUtils = {
    extractCourseId: function extractCourseId(input) {
      var _input$querySelector;
      if (!input) return null;

      // 1. Try extracting from ID attribute (e.g. ucheck-listGUID)
      if (typeof input !== 'string' && input.id) {
        var idMatch = input.id.match(/([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i);
        if (idMatch) return idMatch[1];
      }

      // 2. Try extracting from href or element text
      var str = typeof input === 'string' ? input : (input === null || input === void 0 ? void 0 : input.href) || (input === null || input === void 0 || (_input$querySelector = input.querySelector('a')) === null || _input$querySelector === void 0 ? void 0 : _input$querySelector.href) || '';
      var match = str.match(/courseid=([0-9A-F-]{36})/i) || str.match(/courseid=(\d+)/);
      return match ? match[1] : null;
    },
    extractChapterId: function extractChapterId(url) {
      var match = url.match(/chapterid=([0-9A-F-]{36})/i) || url.match(/chapterid=(\d+)/);
      return match ? match[1] : null;
    },
    getParam: function getParam(name, url) {
      // Use global helper if available (for testing), otherwise use window.location.href
      if (!url && typeof window !== 'undefined') {
        url = typeof global !== 'undefined' && typeof global.getLocationHref === 'function' ? global.getLocationHref() : window.location.href;
      }
      var regex = new RegExp("[?&#]".concat(name, "=([^&#]*)"));
      var match = url.match(regex);
      return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
    }
  };

  /**
   * Enhanced storage manager with write caching.
   */
  var StorageUtils = {
    _writeCache: {},
    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    get: function get(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var val = defaultValue;
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
    set: function set(key, value) {
      var stringifiedValue = JSON.stringify(value);
      if (StorageUtils._writeCache[key] === stringifiedValue) {
        return;
      }
      if (typeof GM_setValue === 'function') {
        console.log("[Storage] Saving ".concat(key, ":"), value);
        GM_setValue(key, value);
        StorageUtils._writeCache[key] = stringifiedValue;
      }
    },
    getVisited: function getVisited() {
      return StorageUtils.get(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
    },
    addVisited: function addVisited(courseId) {
      var visited = StorageUtils.getVisited();
      if (!visited.includes(courseId)) {
        visited.push(courseId);
        StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, visited);
      }
    },
    removeVisited: function removeVisited(courseId) {
      var visited = StorageUtils.getVisited();
      var index = visited.indexOf(courseId);
      if (index > -1) {
        visited.splice(index, 1);
        StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, visited);
      }
    },
    clearVisited: function clearVisited() {
      StorageUtils.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
    }
  };

  /**
   * Tab and session management across multiple pages.
   */
  var TabManager = {
    tableKey: CONFIG.STORAGE_KEYS.TAB_TABLE,
    currentTabId: Date.now() + '_' + Math.floor(Math.random() * 1000),
    register: function register() {
      if (typeof GM_getValue !== 'function') return;
      var table = GM_getValue(TabManager.tableKey, {});
      // Use global helper if available (for testing), otherwise use window.location.href
      var url = typeof global !== 'undefined' && typeof global.getLocationHref === 'function' ? global.getLocationHref() : window.location.href;
      var type = url.includes('playvideo.do') || url.includes('playscorm.do') ? 'player' : 'manager';
      table[TabManager.currentTabId] = {
        type: type,
        url: url,
        courseId: URLUtils.extractCourseId(url),
        timestamp: Date.now()
      };
      GM_setValue(TabManager.tableKey, table);
      Logger.info("Tab \u6CE8\u518C\u6210\u529F: ".concat(TabManager.currentTabId, " (").concat(type, ")"));
    },
    heartbeat: function heartbeat() {
      if (typeof GM_getValue !== 'function') return;
      var table = GM_getValue(TabManager.tableKey, {});
      if (table[TabManager.currentTabId]) {
        table[TabManager.currentTabId].timestamp = Date.now();
        GM_setValue(TabManager.tableKey, table);
      } else {
        TabManager.register();
      }
    },
    hasActivePlayer: function hasActivePlayer(courseId) {
      if (typeof GM_getValue === 'function') {
        var table = GM_getValue(TabManager.tableKey, {});
        var now = Date.now();
        // Revert to 15 seconds for fast response to closed tabs
        return Object.values(table).some(function (tab) {
          return tab.type === 'player' && (!courseId || String(tab.courseId) === String(courseId)) && now - tab.timestamp < 15000;
        });
      }
      return false;
    },
    cleanup: function cleanup() {
      if (typeof GM_getValue === 'function') {
        var table = GM_getValue(TabManager.tableKey, {});
        var now = Date.now();
        var changed = false;
        for (var id in table) {
          // Revert to 60 seconds for cleanup
          if (now - table[id].timestamp > 60000 || id === TabManager.currentTabId) {
            delete table[id];
            changed = true;
          }
        }
        if (changed) GM_setValue(TabManager.tableKey, table);
      }
    },
    unregister: function unregister() {
      if (typeof GM_getValue !== 'function') return;
      var table = GM_getValue(TabManager.tableKey, {});
      delete table[TabManager.currentTabId];
      GM_setValue(TabManager.tableKey, table);
    }
  };

  /**
   * Global mutex for video playback.
   */
  var GlobalLock = {
    lockKey: CONFIG.STORAGE_KEYS.PLAY_LOCK,
    isLocked: function isLocked() {
      var lockData = StorageUtils.get(GlobalLock.lockKey, null);
      if (!lockData) return false;
      var now = Date.now();
      var lockAge = now - lockData.timestamp;

      // Definitive expiration: 5 minutes
      if (lockAge > 300000) {
        Logger.info('全局锁已超时(5分钟)，自动释放');
        return false;
      }

      // Active zombie lock detection: 35 seconds without heartbeat
      // This allows immediate action instead of waiting for BackgroundMonitor
      if (lockAge > 35000) {
        Logger.warn("\u68C0\u6D4B\u5230\u50F5\u6B7B\u9501 (Course: ".concat(lockData.courseId, ")\uFF0C\u5FC3\u8DF3\u505C\u6B62 ").concat(Math.round(lockAge / 1000), "\u79D2\uFF0C\u4E3B\u52A8\u91CA\u653E"));
        GlobalLock.forceRelease();
        return false;
      }
      return true;
    },
    heartbeat: function heartbeat() {
      if (sessionStorage.getItem('currentlyStudying') !== 'true') return;
      var courseId = sessionStorage.getItem('currentLockCourseId');
      if (!courseId) return;
      StorageUtils.set(GlobalLock.lockKey, {
        courseId: courseId,
        timestamp: Date.now()
      });
    },
    acquire: function acquire(courseId) {
      sessionStorage.setItem('currentlyStudying', 'true');
      sessionStorage.setItem('currentLockCourseId', courseId);
      GlobalLock.heartbeat();
      Logger.info("\u5DF2\u83B7\u53D6\u5168\u5C40\u64AD\u653E\u9501: ".concat(courseId));
    },
    release: function release() {
      var currentCourseId = sessionStorage.getItem('currentLockCourseId');
      var lockData = StorageUtils.get(GlobalLock.lockKey, null);
      if (lockData && String(lockData.courseId) === String(currentCourseId)) {
        GlobalLock.forceRelease();
      }
      sessionStorage.removeItem('currentlyStudying');
      sessionStorage.removeItem('currentLockCourseId');
    },
    forceRelease: function forceRelease() {
      if (typeof GM_setValue === 'function') {
        GM_setValue(GlobalLock.lockKey, null);
      }
      Logger.info('全局播放锁已强制释放');
    }
  };

  /**
   * Global state manager for cross-tab session persistence.
   */
  var StateManager = {
    stateKey: CONFIG.STORAGE_KEYS.GLOBAL_APP_STATE,
    _lastSync: 0,
    sync: function sync() {
      var now = Date.now();
      if (now - StateManager._lastSync < 1000) {
        return StateManager._getCurrentSession();
      }
      StateManager._lastSync = now;
      var appState = StorageUtils.get(StateManager.stateKey, null);
      if (appState && now - appState.timestamp > 1800000) {
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
    _getCurrentSession: function _getCurrentSession() {
      return {
        learningMode: sessionStorage.getItem('learningMode'),
        thematicClassId: sessionStorage.getItem('currentThematicClassId'),
        isThematicClass: sessionStorage.getItem('isThematicClass') === 'true'
      };
    },
    setThematicState: function setThematicState(thematicClassId) {
      var learningMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'thematic';
      StorageUtils.set(StateManager.stateKey, {
        thematicClassId: thematicClassId,
        learningMode: learningMode,
        timestamp: Date.now()
      });
      StateManager.sync();
    },
    getThematicState: function getThematicState() {
      return StorageUtils.get(StateManager.stateKey, null);
    },
    clear: function clear() {
      StorageUtils.set(StateManager.stateKey, null);
      ['currentThematicClassId', 'learningMode', 'isThematicClass'].forEach(function (k) {
        return sessionStorage.removeItem(k);
      });
    }
  };

  /**
   * BackgroundMonitor handles page visibility, keep-alive, and self-healing.
   */
  var BackgroundMonitor = {
    isVisible: typeof document !== 'undefined' ? !document.hidden : true,
    backgroundTime: 0,
    keepAliveWorker: null,
    lastSignalTime: 0,
    _initialized: false,
    _forceCheckInterval: null,
    _visibilityHandler: null,
    _refreshListenerId: null,
    // Callback registry to avoid circular dependencies
    onCheckDetail: null,
    onListRefresh: null,
    utils: null,
    // Will be injected

    init: function init(utils) {
      if (BackgroundMonitor._initialized) return;
      BackgroundMonitor._initialized = true;
      BackgroundMonitor.utils = utils;
      utils.safeExecute(function () {
        // Initialize signal baseline
        BackgroundMonitor.lastSignalTime = utils.storage.get(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, 0);
        utils.logger.info(" \u521D\u59CB\u5316\u5237\u65B0\u4FE1\u53F7\u57FA\u51C6: ".concat(BackgroundMonitor.lastSignalTime));

        // Listen for remote refresh signals (event-driven approach)
        if (typeof GM_addValueChangeListener === 'function') {
          BackgroundMonitor._refreshListenerId = GM_addValueChangeListener(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, function (name, oldVal, newVal, remote) {
            if (remote) {
              utils.logger.info(' 收到远程刷新信号，准备更新课程列表');
              var currentUrl = window.location.href;
              // Only respond on course list, thematic class detail, or course detail pages
              if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                // Status update injected via logger callback
                if (utils.logger.onUpdateStatusUI) utils.logger.onUpdateStatusUI('课程已完成，正在刷新列表...', 'success');

                // Force refresh: add timestamp to prevent caching
                var urlObj = new URL(window.location.href);
                urlObj.searchParams.set('_t', String(Date.now()));
                utils.lifecycle.setTimeout(function () {
                  return window.location.href = urlObj.href;
                }, 1500);
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
    handleVisibilityChange: function handleVisibilityChange() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        BackgroundMonitor.isVisible = !document.hidden;
        // UI update is handled via logger callback or direct reference
        if (utils.logger.onUpdateBackgroundUI) utils.logger.onUpdateBackgroundUI(!BackgroundMonitor.isVisible);
        if (!BackgroundMonitor.isVisible) {
          BackgroundMonitor.backgroundTime = Date.now();
        } else {
          utils.logger.info('页面恢复前台，检查刷新信号');
          BackgroundMonitor.checkPendingActions();
        }
      }, '可见性变化处理失败');
    },
    createKeepAliveWorker: function createKeepAliveWorker() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        if (BackgroundMonitor.keepAliveWorker) {
          try {
            BackgroundMonitor.keepAliveWorker.postMessage('stop');
          } catch (_) {}
          try {
            BackgroundMonitor.keepAliveWorker.terminate();
          } catch (_) {}
          BackgroundMonitor.keepAliveWorker = null;
        }
        var tickInterval = 10000; // 统一心跳间隔为10秒
        var workerScript = "\n        let interval = null;\n        let isActive = true;\n        const startKeepAlive = () => {\n          interval = setInterval(() => {\n            if (isActive) {\n              postMessage({type: 'tick', timestamp: Date.now()});\n            }\n          }, ".concat(tickInterval, ");\n        };\n        startKeepAlive();\n        self.onmessage = function(e) {\n          if (e.data === 'stop') {\n            isActive = false;\n            if (interval) clearInterval(interval);\n          }\n        };\n      ");
        var blob = new Blob([workerScript], {
          type: 'application/javascript'
        });
        var url = URL.createObjectURL(blob);
        var worker = new Worker(url);
        utils.lifecycle.addCleanup(function () {
          try {
            URL.revokeObjectURL(url);
          } catch (_) {}
        });
        var tickCount = 0;
        worker.onmessage = function (e) {
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
    setupNavigationWatch: function setupNavigationWatch() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        var notify = function notify() {
          var currentUrl = window.location.href;
          var lastUrl = sessionStorage.getItem('lastUrl') || '';
          if (currentUrl.includes('/pc/login.do')) return;
          if (currentUrl !== lastUrl) {
            utils.logger.info("\u68C0\u6D4B\u5230\u9875\u9762\u53D8\u5316: ".concat(lastUrl, " -> ").concat(currentUrl));
            sessionStorage.setItem('lastUrl', currentUrl);
            // Router handling is injected
            if (BackgroundMonitor.onNavigationChange) BackgroundMonitor.onNavigationChange();
          }
        };
        var hookHistory = function hookHistory() {
          var rawPushState = history.pushState;
          var rawReplaceState = history.replaceState;
          var wrap = function wrap(fn) {
            return function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              var ret = fn.apply(this, args);
              try {
                notify();
              } catch (_) {}
              return ret;
            };
          };
          history.pushState = wrap(rawPushState);
          history.replaceState = wrap(rawReplaceState);
          utils.lifecycle.addCleanup(function () {
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
    checkPendingActions: function checkPendingActions() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        var currentUrl = window.location.href;
        if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do') || currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do')) {
          var now = Date.now();

          // 0. Grace period for newly opened courses (prevent self-healing from killing new tabs)
          // Check both GM and sessionStorage for maximum reliability
          var lastOpenTimeGM = typeof GM_getValue === 'function' ? GM_getValue('last_course_open_time', 0) : 0;
          var lastOpenTimeSS = parseInt(sessionStorage.getItem('last_course_open_time') || '0');
          var lastOpenTime = Math.max(lastOpenTimeGM, lastOpenTimeSS);
          if (now - lastOpenTime < 25000) {
            // 增加到25秒宽限期
            return;
          }

          // 1. Crash recovery / Orphan lock detection (Simplified & Robust)
          var lockData = utils.storage.get(CONFIG.STORAGE_KEYS.PLAY_LOCK, null);
          if (lockData && lockData.courseId) {
            var isCurrentPagePlayer = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
            var isCurrentCourseMatch = currentUrl.includes(String(lockData.courseId));
            if (isCurrentPagePlayer && isCurrentCourseMatch) {
              return;
            }

            // Heartbeat check: Revert to 35 seconds for responsive self-healing
            var silenceDuration = now - lockData.timestamp;
            if (silenceDuration > 35000) {
              utils.logger.warn("\u68C0\u6D4B\u5230\u50F5\u6B7B\u9501 (Course: ".concat(lockData.courseId, ")\uFF0C\u5FC3\u8DF3\u505C\u6B62\u5DF2\u8D85\u8FC7 ").concat(Math.round(silenceDuration / 1000), "\u79D2\uFF0C\u89E6\u53D1\u81EA\u6108\u91CD\u8BD5"));
              utils.globalLock.forceRelease();

              // Need to reset engine state
              if (BackgroundMonitor.onResetProcessing) BackgroundMonitor.onResetProcessing();

              // Refresh to find next task
              utils.lifecycle.setTimeout(function () {
                return window.location.reload();
              }, 1000);
              return;
            }
          }
        }
      }, '检查待执行动作失败');
    },
    // 检查长时间无活动状态
    checkLongActivity: function checkLongActivity() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        var currentUrl = window.location.href;
        var lastActiveTime = sessionStorage.getItem('lastActiveTime');
        if (lastActiveTime && currentUrl.includes('coursedetail.do')) {
          var elapsed = Date.now() - parseInt(lastActiveTime);
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
    cleanup: function cleanup() {
      var utils = BackgroundMonitor.utils;
      utils.safeExecute(function () {
        // Remove value change listener
        if (BackgroundMonitor._refreshListenerId && typeof GM_removeValueChangeListener === 'function') {
          GM_removeValueChangeListener(BackgroundMonitor._refreshListenerId);
          BackgroundMonitor._refreshListenerId = null;
        }
        if (BackgroundMonitor.keepAliveWorker) {
          try {
            BackgroundMonitor.keepAliveWorker.postMessage('stop');
          } catch (_) {}
          try {
            BackgroundMonitor.keepAliveWorker.terminate();
          } catch (_) {}
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
  var Utils = {
    logger: Logger,
    url: URLUtils,
    storage: StorageUtils,
    tabManager: TabManager,
    globalLock: GlobalLock,
    stateManager: StateManager,
    monitor: BackgroundMonitor,
    $: function $(s) {
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
      return c.querySelector(s);
    },
    $$: function $$(s) {
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
      return Array.from(c.querySelectorAll(s));
    },
    broadcastRefresh: function broadcastRefresh() {
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
      addCleanup: function addCleanup(fn) {
        if (typeof fn === 'function') this._cleaners.push(fn);
      },
      setInterval: function (_setInterval) {
        function setInterval(_x, _x2) {
          return _setInterval.apply(this, arguments);
        }
        setInterval.toString = function () {
          return _setInterval.toString();
        };
        return setInterval;
      }(function (fn, ms) {
        var id = setInterval(fn, ms);
        this._intervals.add(id);
        return id;
      }),
      clearInterval: function (_clearInterval) {
        function clearInterval(_x3) {
          return _clearInterval.apply(this, arguments);
        }
        clearInterval.toString = function () {
          return _clearInterval.toString();
        };
        return clearInterval;
      }(function (id) {
        if (id) {
          clearInterval(id);
          this._intervals["delete"](id);
        }
      }),
      setTimeout: function (_setTimeout) {
        function setTimeout(_x4, _x5) {
          return _setTimeout.apply(this, arguments);
        }
        setTimeout.toString = function () {
          return _setTimeout.toString();
        };
        return setTimeout;
      }(function (fn, ms) {
        var _this = this;
        var id = setTimeout(function () {
          _this._timeouts["delete"](id);
          fn();
        }, ms);
        this._timeouts.add(id);
        return id;
      }),
      clearTimeout: function (_clearTimeout) {
        function clearTimeout(_x6) {
          return _clearTimeout.apply(this, arguments);
        }
        clearTimeout.toString = function () {
          return _clearTimeout.toString();
        };
        return clearTimeout;
      }(function (id) {
        if (id) {
          clearTimeout(id);
          this._timeouts["delete"](id);
        }
      }),
      addEventListener: function addEventListener(target, type, handler, options) {
        if (!target || typeof target.addEventListener !== 'function') return;
        target.addEventListener(type, handler, options);
        this._listeners.push({
          target: target,
          type: type,
          handler: handler,
          options: options
        });
      },
      addObserver: function addObserver(observer) {
        if (observer) this._observers.add(observer);
        return observer;
      },
      cleanup: function cleanup() {
        var _iterator = _createForOfIteratorHelper(this._observers),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var ob = _step.value;
            try {
              ob.disconnect();
            } catch (_) {}
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        this._observers.clear();
        var _iterator2 = _createForOfIteratorHelper(this._listeners),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _step2.value,
              target = _step2$value.target,
              type = _step2$value.type,
              handler = _step2$value.handler,
              options = _step2$value.options;
            try {
              target.removeEventListener(type, handler, options);
            } catch (_) {}
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        this._listeners = [];
        var _iterator3 = _createForOfIteratorHelper(this._intervals),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var id = _step3.value;
            try {
              clearInterval(id);
            } catch (_) {}
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        this._intervals.clear();
        var _iterator4 = _createForOfIteratorHelper(this._timeouts),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _id = _step4.value;
            try {
              clearTimeout(_id);
            } catch (_) {}
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        this._timeouts.clear();
        var _iterator5 = _createForOfIteratorHelper(this._cleaners),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var fn = _step5.value;
            try {
              fn();
            } catch (_) {}
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        this._cleaners = [];
      }
    },
    safeExecute: function safeExecute(func) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '未知操作';
      try {
        return func();
      } catch (error) {
        Logger.error("[\u8FD0\u884C\u65F6\u5F02\u5E38] \u5728 ".concat(context, " \u53D1\u751F\u9519\u8BEF: ").concat(error.message), error);
        return null;
      }
    },
    retry: function retry(func) {
      var maxRetries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
      var errorMsg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '重试失败';
      var attempts = 0;
      var _attempt = function attempt() {
        try {
          var result = func();
          if (result !== false && result !== null && result !== undefined) {
            return result;
          }
        } catch (error) {
          Logger.error("\u5C1D\u8BD5 ".concat(attempts + 1, " \u5931\u8D25"), error);
        }
        attempts++;
        if (attempts < maxRetries) {
          Utils.lifecycle.setTimeout(_attempt, delay);
        } else {
          Logger.error("".concat(errorMsg, ": \u5DF2\u8FBE\u6700\u5927\u91CD\u8BD5\u6B21\u6570"));
        }
      };
      _attempt();
    },
    wait: function wait(ms) {
      return new Promise(function (resolve) {
        return Utils.lifecycle.setTimeout(resolve, ms);
      });
    },
    waitForElement: function waitForElement(selector) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
      return new Promise(function (resolve, reject) {
        var check = function check() {
          var el = document.querySelector(selector);
          if (el) return el;
          return null;
        };
        var existing = check();
        if (existing) return resolve(existing);
        var observer = new MutationObserver(function () {
          var el = check();
          if (el) {
            observer.disconnect();
            resolve(el);
          }
        });
        var startObserver = function startObserver() {
          var target = document.body || document.documentElement;
          observer.observe(target, {
            childList: true,
            subtree: true
          });
        };
        if (document.body) startObserver();else {
          var bodyCheck = setInterval(function () {
            if (document.body) {
              clearInterval(bodyCheck);
              startObserver();
            }
          }, 50);
        }
        Utils.lifecycle.setTimeout(function () {
          observer.disconnect();
          reject(new Error("\u7B49\u5F85\u5143\u7D20\u8D85\u65F6: ".concat(selector)));
        }, timeout);
      });
    },
    dom: {
      smartClick: function smartClick(element) {
        var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '点击操作';
        return Utils.safeExecute(function () {
          if (!element) {
            Logger.error("".concat(description, ": \u5143\u7D20\u4E0D\u5B58\u5728"));
            return false;
          }
          Logger.info("\u6267\u884C: ".concat(description));
          var currentUrl = window.location.href;
          var isNewTab = element.tagName === 'A' && element.getAttribute('target') === '_blank';
          var href = element.getAttribute('href');
          if (isNewTab && href && (href.includes('playvideo.do') || href.includes('playscorm.do'))) {
            Logger.info("\u540E\u53F0\u9759\u9ED8\u6253\u5F00\u89C6\u9891\u9875\u9762: ".concat(href));
            if (typeof GM_openInTab === 'function') {
              GM_openInTab(href, {
                active: false,
                insert: true,
                setParent: true
              });
              return true;
            }
          }
          element.click();
          if (!isNewTab) {
            Utils.lifecycle.setTimeout(function () {
              if (window.location.href === currentUrl) {
                Logger.info("".concat(description, ": \u9875\u9762\u672A\u54CD\u5E94\uFF0C\u6267\u884C\u5907\u7528\u70B9\u51FB"));
                element.dispatchEvent(new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true
                }));
              }
            }, 2000);
          }
          return true;
        }, "\u70B9\u51FB\u5931\u8D25: ".concat(description)) || false;
      }
    },
    navigateTo: function navigateTo(url) {
      var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '页面跳转';
      Utils.safeExecute(function () {
        Logger.info("".concat(reason, ": ").concat(url));
        sessionStorage.setItem('returning', 'true');
        window.location.href = url;
        Utils.lifecycle.setTimeout(function () {
          if (!window.location.href.includes(url.split('?')[0])) {
            window.location.assign(url);
          }
        }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
      }, "\u5BFC\u822A\u5931\u8D25: ".concat(url));
    },
    notificationManager: {
      title: '安徽干部教育自动学习',
      send: function send(text) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var title = this.title;
        var icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';
        if (typeof GM_notification === 'function') {
          GM_notification(_objectSpread2({
            text: text,
            title: title,
            image: icon,
            highlight: true,
            silent: false,
            timeout: 10000,
            onclick: function onclick() {
              return window.focus();
            }
          }, options));
        } else if ('Notification' in window && Notification.permission === 'granted') {
          var n = new Notification(title, _objectSpread2({
            body: text,
            icon: icon
          }, options));
          n.onclick = function () {
            window.focus();
            n.close();
          };
        }
      }
    },
    extractMinutes: function extractMinutes(text) {
      if (!text) return 30;
      var match = text.match(/(\d+)/);
      return match ? parseInt(match[1]) : 30;
    },
    setupProtection: function setupProtection() {
      Utils.safeExecute(function () {
        if (typeof unsafeWindow !== 'undefined') {
          unsafeWindow.alert = function (msg) {
            return console.log("[\u5C4F\u853D\u5F39\u7A97] alert: ".concat(msg));
          };
          unsafeWindow.confirm = function (msg) {
            console.log("[\u81EA\u52A8\u786E\u8BA4] confirm: ".concat(msg));
            return true;
          };
          unsafeWindow.prompt = function () {
            console.log('[屏蔽弹窗] prompt');
            return '';
          };
          unsafeWindow.focus = function () {
            return console.log('窗口聚焦请求被屏蔽');
          };
          var originalOpen = unsafeWindow.open;
          unsafeWindow.open = function (url, target, features) {
            if (url && typeof url === 'string' && (url.includes('playvideo.do') || url.includes('playscorm.do'))) {
              var fullUrl = url;
              if (!url.startsWith('http')) {
                try {
                  fullUrl = new URL(url, window.location.href).href;
                } catch (e) {
                  fullUrl = url;
                }
              }
              if (!fullUrl.includes('#bg_mode=1')) fullUrl += '#bg_mode=1';
              console.log("\u62E6\u622A window.open \u5F39\u7A97\uFF0C\u8F6C\u4E3A\u540E\u53F0\u9759\u9ED8\u6253\u5F00: ".concat(fullUrl));
              if (typeof GM_openInTab === 'function') {
                GM_openInTab(fullUrl, {
                  active: false,
                  insert: true
                });
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
  var UI = {
    panel: null,
    stats: {
      startTime: Date.now(),
      coursesCompleted: 0,
      backgroundTime: 0
    },
    init: function init() {
      Utils.safeExecute(function () {
        if (document.body) UI.createPanel();else {
          var check = setInterval(function () {
            if (document.body) {
              clearInterval(check);
              UI.createPanel();
            }
          }, 50);
        }
      }, 'UI初始化失败');
    },
    createPanel: function createPanel() {
      Utils.safeExecute(function () {
        if (document.getElementById('study-assistant-panel')) return;
        var panel = document.createElement('div');
        panel.id = 'study-assistant-panel';
        // Restored exact inline styles from original script
        panel.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 300px; background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; font-family: Arial, sans-serif; font-size: 12px;';
        panel.innerHTML = "\n        <div style=\"font-weight: bold; margin-bottom: 10px; color: #333;\">\u5B89\u5FBD\u5E72\u90E8\u6559\u80B2\u52A9\u624B V".concat(CONFIG.VERSION, "</div>\n        <div id=\"status-display\" style=\"padding: 8px; background: #f5f5f5; border-radius: 3px; margin-bottom: 10px; min-height: 20px;\">\u811A\u672C\u52A0\u8F7D\u4E2D...</div>\n        <div id=\"background-status\" style=\"padding: 5px; background: #e8f5e8; border-radius: 3px; font-size: 11px; text-align: center;\">\u524D\u53F0\u8FD0\u884C\u4E2D</div>\n      ");
        document.body.appendChild(panel);
        UI.panel = panel;
        UI.updateStatus('脚本已就绪', 'info');
      }, 'UI面板创建失败');
    },
    updateStatus: function updateStatus(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      Utils.safeExecute(function () {
        var statusEl = document.getElementById('status-display');
        if (statusEl) {
          var colors = {
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
    updateBackgroundStatus: function updateBackgroundStatus(isBackground) {
      Utils.safeExecute(function () {
        var bgEl = document.getElementById('background-status');
        if (bgEl) {
          if (isBackground) {
            bgEl.textContent = '后台运行中';
            bgEl.style.background = '#fff3cd';
            UI.stats.backgroundTime = Date.now();
          } else {
            bgEl.textContent = '前台运行中';
            bgEl.style.background = '#e8f5e8';
          }
        }
      }, '后台状态更新失败');
    }
  };

  var WakeLockManager = {
    wakeLock: null,
    fallbackInterval: null,
    _visibilityHandler: null,
    init: function init() {
      Utils.safeExecute(function () {
        WakeLockManager.requestWakeLock();
        WakeLockManager.setupFallbackKeepAwake();
        WakeLockManager.handleVisibilityChange();
        Utils.logger.info('防休眠系统已启动');
      }, '防休眠初始化失败');
    },
    requestWakeLock: function () {
      var _requestWakeLock = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              if (!('wakeLock' in navigator)) {
                _context.n = 2;
                break;
              }
              _context.n = 1;
              return navigator.wakeLock.request('screen');
            case 1:
              WakeLockManager.wakeLock = _context.v;
              Utils.logger.info('Wake Lock已激活，系统保持唤醒状态');
              WakeLockManager.wakeLock.addEventListener('release', function () {
                Utils.logger.info('Wake Lock已释放');
              });
              _context.n = 3;
              break;
            case 2:
              Utils.logger.warn('浏览器不支持Wake Lock API，使用备用方案');
            case 3:
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _context.v;
              Utils.logger.warn('Wake Lock请求失败，使用备用方案');
            case 5:
              return _context.a(2);
          }
        }, _callee, null, [[0, 4]]);
      }));
      function requestWakeLock() {
        return _requestWakeLock.apply(this, arguments);
      }
      return requestWakeLock;
    }(),
    setupFallbackKeepAwake: function setupFallbackKeepAwake() {
      Utils.safeExecute(function () {
        // 定期活动保持系统唤醒
        if (WakeLockManager.fallbackInterval) {
          Utils.lifecycle.clearInterval(WakeLockManager.fallbackInterval);
        }
        WakeLockManager.fallbackInterval = Utils.lifecycle.setInterval(function () {
          // 轻微的DOM活动
          document.title = document.title;

          // 偶尔发送心跳请求
          if (Math.random() < 0.1) {
            fetch(window.location.href, {
              method: 'HEAD'
            })["catch"](function () {});
          }
        }, CONFIG.TIMEOUTS.WAKE_LOCK_FALLBACK);
        Utils.logger.info('备用防休眠机制已启动');
      }, '备用防休眠设置失败');
    },
    handleVisibilityChange: function handleVisibilityChange() {
      if (WakeLockManager._visibilityHandler) return;
      WakeLockManager._visibilityHandler = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(!document.hidden && !WakeLockManager.wakeLock)) {
                _context2.n = 1;
                break;
              }
              _context2.n = 1;
              return WakeLockManager.requestWakeLock();
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      Utils.lifecycle.addEventListener(document, 'visibilitychange', WakeLockManager._visibilityHandler);
    },
    cleanup: function cleanup() {
      Utils.safeExecute(function () {
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

  var CourseHandler = {
    currentCourse: null,
    isProcessing: false,
    init: function init() {
      Utils.safeExecute(function () {
        var appState = Utils.stateManager.getThematicState();
        if (appState) {
          Utils.logger.info("\u4ECE\u5B58\u50A8\u6062\u590D\u72B6\u6001: ".concat(JSON.stringify(appState)));
          sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
          sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
          sessionStorage.setItem('isThematicClass', 'true');
        }
        Utils.stateManager.sync();
        Utils.logger.info('课程处理器已初始化');
      }, '课程处理器初始化失败');
    },
    openCourse: function openCourse(courseElement) {
      if (!courseElement) return;
      Utils.safeExecute(function () {
        var courseTitle = CourseHandler.extractCourseTitle(courseElement);

        // If still unknown, try a last-ditch search in document title
        if (courseTitle === '未知课程') {
          var pageTitle = document.querySelector('h3.title, .coursename, .breadcrumb .active');
          if (pageTitle) courseTitle = pageTitle.textContent.trim();
        }

        // Final protection: Never open if title is missing
        if (!courseTitle || courseTitle === '未知课程') {
          var cid = Utils.url.extractCourseId(courseElement) || '未知ID';
          Utils.logger.error("\u65E0\u6CD5\u8BC6\u522B\u8BFE\u7A0B\u6807\u9898 (ID: ".concat(cid, ")\uFF0C\u653E\u5F03\u6253\u5F00\u4EE5\u9632\u6B62\u903B\u8F91\u51B2\u7A81"));
          UI.updateStatus('错误：课程名解析失败', 'error');
          return;
        }
        CourseHandler.isProcessing = true;
        courseTitle = courseTitle.substring(0, 40); // Increased limit

        Utils.logger.info("\u51C6\u5907\u6253\u5F00\u8BFE\u7A0B: ".concat(courseTitle));
        UI.updateStatus("\u6B63\u5728\u6253\u5F00: ".concat(courseTitle), 'info');
        Utils.notificationManager.send("\u5F00\u59CB\u5B66\u4E60\uFF1A".concat(courseTitle));

        // Signal BackgroundMonitor to pause self-healing checks for a while (use GM_setValue for cross-tab sync)
        if (typeof GM_setValue === 'function') {
          GM_setValue('last_course_open_time', Date.now());
        }
        sessionStorage.setItem('last_course_open_time', Date.now().toString());
        var courseId = Utils.url.extractCourseId(courseElement);
        if (courseId) {
          var playUrl = "https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=".concat(courseId);

          // 检测是否为专题班模式，携带来源信息到 URL
          var isThematic = sessionStorage.getItem('learningMode') === 'thematic' || sessionStorage.getItem('isThematicClass') === 'true';
          if (isThematic) {
            var tid = sessionStorage.getItem('currentThematicClassId');
            playUrl += "&thm=1"; // 标记专题班模式
            if (tid) playUrl += "&tid=".concat(tid); // 携带专题班ID
            Utils.logger.info("\uD83C\uDFAF \u4E13\u9898\u73ED\u6A21\u5F0F\uFF1A\u8DF3\u8F6C\u643A\u5E26\u53C2\u6570 thm=1, tid=".concat(tid));
          }
          Utils.logger.info("\u5BFC\u822A\u81F3: ".concat(playUrl));
          Utils.navigateTo(playUrl, '打开课程');
        } else {
          Utils.logger.info('未找到直接链接，尝试点击元素');
          Utils.dom.smartClick(courseElement, '打开课程');
        }
      }, '打开课程失败');
    },
    startStudyTime: function startStudyTime(requiredSeconds, completeButton) {
      Utils.safeExecute(function () {
        var totalMs = requiredSeconds * 1000;
        var studyStartTime = Date.now();
        Utils.logger.info("\u5F00\u59CB\u7CBE\u786E\u5B66\u4E60\u8BA1\u65F6: ".concat(requiredSeconds, "\u79D2"));
        var updateDisplay = function updateDisplay() {
          var elapsed = Date.now() - studyStartTime;
          var remainingMs = Math.max(0, totalMs - elapsed);
          var totalSecs = Math.ceil(remainingMs / 1000);
          var minutes = Math.floor(totalSecs / 60);
          var seconds = totalSecs % 60;
          if (remainingMs > 0) {
            UI.updateStatus("\u5B66\u4E60\u4E2D\uFF0C\u5269\u4F59: ".concat(minutes, ":").concat(seconds.toString().padStart(2, '0')), 'info');
          } else {
            UI.updateStatus('时长已达标，正在完成...', 'success');
            Utils.lifecycle.clearInterval(displayInterval);
          }
        };
        updateDisplay();
        var displayInterval = Utils.lifecycle.setInterval(updateDisplay, 1000);
        Utils.lifecycle.setTimeout(function () {
          Utils.lifecycle.clearInterval(displayInterval);
          if (completeButton && typeof completeButton.click === 'function') {
            Utils.logger.info(' 倒计时结束，触发完成按钮');
            completeButton.click();
            Utils.lifecycle.setTimeout(function () {
              return CourseHandler.handleStudyComplete();
            }, 3000);
          }
        }, totalMs);
      }, '学习时间处理失败');
    },
    handleStudyComplete: function handleStudyComplete() {
      Utils.safeExecute(function () {
        Utils.logger.info('章节学习完成，寻找下一步');
        var currentUrl = window.location.href;
        var courseId = Utils.url.extractCourseId(currentUrl);
        console.log(" \u4EFB\u52A1\u5B8C\u6210\u5904\u7406 - \u8BFE\u7A0BID: ".concat(courseId || '未 知'));
        if (courseId) {
          console.log(" \u8BB0\u5F55\u5DF2\u5B8C\u6210\u8BFE\u7A0B\u9ED1\u540D\u5355: ".concat(courseId));
          Utils.storage.addVisited(courseId);
          sessionStorage.setItem('last_completed_course', courseId);
        }
        CourseHandler.returnToCourseList();
      }, '学习完成处理失败');
    },
    selectCourse: function selectCourse(courseElements, visitedCourses) {
      console.log("\u5F00\u59CB\u9009\u62E9\u8BFE\u7A0B\uFF0C\u5171 ".concat(courseElements.length, " \u4E2A\u8BFE\u7A0B\uFF0C\u5DF2\u8BBF\u95EE ").concat(visitedCourses.length, " \u4E2A"));

      // Priority 1: "Learning" status
      var _iterator = _createForOfIteratorHelper(courseElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          var status = CourseHandler.extractCourseStatus(el);
          var courseId = Utils.url.extractCourseId(el);
          console.log("\u68C0\u67E5\u8BFE\u7A0B - ID: ".concat(courseId, ", \u72B6\u6001: \"").concat(status, "\", \u5DF2\u8BBF\u95EE: ").concat(visitedCourses.includes(courseId)));
          if (status === "学习中") {
            if (!visitedCourses.includes(courseId)) {
              console.log(' 找到学习中的课程（未访问）');
              return el;
            } else {
              console.log(" \u53D1\u73B0\u8BEF\u5165\u9ED1\u540D\u5355\u7684\"\u5B66\u4E60\u4E2D\"\u8BFE\u7A0B: ".concat(courseId, "\uFF0C\u6B63\u5728\u79FB\u9664\u9ED1\u540D\u5355\u8BB0\u5F55\u5E76\u6062\u590D\u5B66\u4E60..."));
              Utils.storage.removeVisited(courseId);
              return el;
            }
          }
        }

        // Priority 2: "Not Started" status (or anything not "Completed")
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(courseElements),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _el = _step2.value;
          var _status = CourseHandler.extractCourseStatus(_el);
          var _courseId = Utils.url.extractCourseId(_el);
          if (_status && _status !== "已完成") {
            if (!visitedCourses.includes(_courseId)) {
              console.log(" \u9009\u62E9\u672A\u5B8C\u6210\u8BFE\u7A0B: ".concat(_courseId, " (\u72B6\u6001: \"").concat(_status, "\")"));
              return _el;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      console.log('未找到合适的课程');
      return null;
    },
    extractCourseStatus: function extractCourseStatus(el) {
      if (!el) return null;

      // 1. Image based detection (highest priority)
      var findImg = function findImg(selector) {
        var _el$closest;
        return el.querySelector(selector) || el.tagName === 'TD' && ((_el$closest = el.closest('tr')) === null || _el$closest === void 0 ? void 0 : _el$closest.querySelector(selector));
      };

      // IMPORTANT: Check specific image src, NOT class="yx" (all status images share this class)
      if (findImg("img[src*='ywc']")) return "已完成";
      if (findImg("img[src*='xxz']")) return "学习中";

      // 2. Class based detection
      var hasClass = function hasClass(cls) {
        var _el$closest2;
        return el.classList.contains(cls) || el.querySelector("span.".concat(cls)) || el.tagName === 'TD' && ((_el$closest2 = el.closest('tr')) === null || _el$closest2 === void 0 ? void 0 : _el$closest2.querySelector("span.".concat(cls)));
      };
      if (hasClass('green2')) return "已完成";
      if (hasClass('orange')) return "学习中";

      // 3. Text based detection with correct priority order
      var text = el.textContent || "";
      var parentTR = el.tagName === 'TD' ? el.closest('tr') : null;
      var combinedText = text + (parentTR ? parentTR.textContent : "");

      // Priority 1: Explicit "学习中" status (highest priority to avoid false positives)
      if (combinedText.includes("学习中")) return "学习中";

      // Priority 2: Explicit "已完成" status
      if (combinedText.includes("已完成")) return "已完成";

      // Priority 3: 100% progress (only if not "学习中")
      if (combinedText.includes("100%")) return "已完成";
      return "未开始";
    },
    extractCourseTitle: function extractCourseTitle(el) {
      if (!el) return '未知课程';

      // Safer cleaning: targets labels while preserving course name parts
      var clean = function clean(t) {
        if (!t) return '';
        return t.replace(/\[.*?\]/g, '') // Remove [Label]
        .replace(/(新课|学习中|已完成|进行中|未开始|必修|选修|学分|学时|课时|%)/g, '').replace(/\s+/g, ' ').trim();
      };

      // 0. Special case: If el is a status span (.coursespan), find sibling or parent elements
      if (el.classList.contains('coursespan') || el.id.includes('ucheck') && !el.id.includes('ucheck-list')) {
        // Try to find parent container with course info
        var parentRow = el.closest('tr');
        if (parentRow) {
          // Find the title TD in the same row
          var _titleTd = parentRow.querySelector('td[id*="ucheck-list"]');
          if (_titleTd) {
            var t = clean(_titleTd.textContent);
            if (t.length > 2) return t;
          }
        }

        // Try to find sibling course card container
        var parentCard = el.closest('.coursecard, .cmt7, .ke-box');
        if (parentCard) {
          var titleEl = parentCard.querySelector('.coursetxt, .detail-title, .title, .course-name, h4, h5');
          if (titleEl) {
            var _t = clean(titleEl.textContent);
            if (_t.length > 2) return _t;
          }
        }

        // Try to find sibling link with course ID
        var courseId = el.id.replace(/ucheck/, '') || el.getAttribute('data-courseid');
        if (courseId) {
          var _el$parentElement;
          var siblingLink = (_el$parentElement = el.parentElement) === null || _el$parentElement === void 0 ? void 0 : _el$parentElement.querySelector("a[href*=\"courseid=".concat(courseId, "\"]"));
          if (siblingLink) {
            var _t2 = clean(siblingLink.textContent);
            if (_t2.length > 2) return _t2;
          }
        }
      }

      // 1. Check all course links and find the one with meaningful text content
      var allLinks = el.querySelectorAll('a[href*="courseid="]');
      if (allLinks.length > 0) {
        // Try each link to find one with valid title text
        var _iterator3 = _createForOfIteratorHelper(allLinks),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var link = _step3.value;
            // First check for specific title class inside the link
            var specificTitle = link.querySelector('.detail-title, .course-name, .title');
            if (specificTitle) {
              var _t4 = clean(specificTitle.textContent);
              if (_t4.length > 2) return _t4;
            }

            // Then check the link's own textContent and title attribute
            var linkText = clean(link.textContent || link.getAttribute('title'));
            if (linkText.length > 2) return linkText;
          }

          // If el itself is an anchor
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        if (el.tagName === 'A') {
          var _t3 = clean(el.textContent || el.getAttribute('title'));
          if (_t3.length > 2) return _t3;
        }
      }

      // 2. Check for TD elements with course title (specific structure: td[id*="ucheck-list"])
      var titleTd = el.querySelector('td[id*="ucheck-list"]') || (el.tagName === 'TD' && el.id.includes('ucheck-list') ? el : null);
      if (titleTd) {
        var _t5 = clean(titleTd.textContent);
        if (_t5.length > 2) return _t5;
      }

      // 3. Attribute check
      var attrTitle = el.getAttribute('title') || el.getAttribute('data-original-title');
      if (attrTitle && clean(attrTitle).length > 2) return clean(attrTitle);

      // 4. Search the entire row if el is part of a table
      var row = el.tagName === 'TR' ? el : el.closest('tr');
      if (row) {
        // Find specific title element in the row first
        var rowTitle = row.querySelector('.detail-title, .title, .course-name');
        if (rowTitle) return clean(rowTitle.textContent);

        // Find the longest text node in the row that isn't a label
        var candidates = Array.from(row.querySelectorAll('td, a, span')).map(function (node) {
          return clean(node.textContent);
        }).filter(function (t) {
          return t.length > 4 && !/^\d+$/.test(t);
        }).sort(function (a, b) {
          return b.length - a.length;
        });
        if (candidates.length > 0) return candidates[0];
      }

      // 5. Common title selectors
      var found = el.querySelector('.detail-title, .title, .course-name, h4, h5, .coursename, .coursetxt');
      if (found && clean(found.textContent).length > 2) return clean(found.textContent);
      var finalText = clean(el.textContent);
      return finalText.length > 2 ? finalText : '未知课程';
    },
    handlePagination: function () {
      var _handlePagination = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var pagination, pageLinks, _iterator4, _step4, link, text, href, fullUrl, _t6, _t7;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              pagination = Utils.$('.pagination');
              if (pagination) {
                _context.n = 1;
                break;
              }
              console.error('未找到分页元素');
              return _context.a(2, false);
            case 1:
              pageLinks = pagination.querySelectorAll('a[href]');
              console.log("\u627E\u5230 ".concat(pageLinks.length, " \u4E2A\u5206\u9875\u94FE\u63A5"));
              _iterator4 = _createForOfIteratorHelper(pageLinks);
              _context.p = 2;
              _iterator4.s();
            case 3:
              if ((_step4 = _iterator4.n()).done) {
                _context.n = 5;
                break;
              }
              link = _step4.value;
              text = link.textContent.trim();
              if (!(text === '>' || text === '»' || text.includes('下一页') || text.toLowerCase().includes('next'))) {
                _context.n = 4;
                break;
              }
              href = link.getAttribute('href');
              if (!href) {
                _context.n = 4;
                break;
              }
              fullUrl = new URL(href, window.location.href).href;
              Utils.logger.info("\u627E\u5230\u4E0B\u4E00\u9875\u6309\u94AE\uFF0C\u8DF3\u8F6C\u5230: ".concat(fullUrl));
              UI.updateStatus('跳转到下一页');
              window.location.href = fullUrl;
              return _context.a(2, true);
            case 4:
              _context.n = 3;
              break;
            case 5:
              _context.n = 7;
              break;
            case 6:
              _context.p = 6;
              _t6 = _context.v;
              _iterator4.e(_t6);
            case 7:
              _context.p = 7;
              _iterator4.f();
              return _context.f(7);
            case 8:
              console.error('未找到下一页按钮');
              return _context.a(2, false);
            case 9:
              _context.p = 9;
              _t7 = _context.v;
              console.error("\u5206\u9875\u5904\u7406\u9519\u8BEF: ".concat(_t7.message));
              return _context.a(2, false);
          }
        }, _callee, null, [[2, 6, 7, 8], [0, 9]]);
      }));
      function handlePagination() {
        return _handlePagination.apply(this, arguments);
      }
      return handlePagination;
    }(),
    switchCourseType: function switchCourseType() {
      Utils.safeExecute(function () {
        var currentType = Utils.url.getParam('coutype') || '1';
        var otherType = currentType === '1' ? '0' : '1';
        console.log("\u5F53\u524D\u8BFE\u7A0B\u7C7B\u578B: ".concat(currentType === '1' ? '必修' : ' 选修'));
        var flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
        Utils.storage.set(flagKey, 'true');
        sessionStorage.setItem("verified_type_".concat(currentType), 'true');
        var requiredCompleted = Utils.storage.get('requiredCoursesCompleted', 'false');
        var electiveCompleted = Utils.storage.get('electiveCoursesCompleted', 'false');
        var requiredVerified = sessionStorage.getItem('verified_type_1') === 'true';
        var electiveVerified = sessionStorage.getItem('verified_type_0') === 'true';
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
        var targetUrl = "https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=".concat(otherType);
        Utils.navigateTo(targetUrl, '切换类型');
      }, '类型切换失败');
    },
    extractChapterInfo: function extractChapterInfo(courseId) {
      Utils.safeExecute(function () {
        // 尝试所有配置的章节按钮选择器
        var chapters = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);

        // 如果找不到，尝试其他选择器
        if (chapters.length === 0) {
          var _iterator5 = _createForOfIteratorHelper(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var selector = _step5.value;
              chapters = Utils.$$(selector);
              if (chapters.length > 0) {
                Utils.logger.info("\u4F7F\u7528\u9009\u62E9\u5668 ".concat(selector, " \u627E\u5230 ").concat(chapters.length, " \u4E2A\u7AE0\u8282"));
                break;
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
        console.log("\u627E\u5230 ".concat(chapters.length, " \u4E2A\u7AE0\u8282"));
        chapters.forEach(function (button, index) {
          Utils.safeExecute(function () {
            var chapterId = button.getAttribute('data-chapterid');
            if (!chapterId) return;
            var row = button.closest('tr');
            if (!row) return;

            // 改进的时长和进度提取逻辑
            var totalMinutes = 30; // 默认30分钟
            var learnedPercent = 0;

            // 获取所有单元格
            var cells = row.querySelectorAll('td');

            // 查找包含"分钟"的单元格（时长）
            var _iterator6 = _createForOfIteratorHelper(cells),
              _step6;
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var cell = _step6.value;
                var text = cell.textContent.trim();
                if (text.includes('分钟')) {
                  totalMinutes = Utils.extractMinutes(text);
                  console.log("\u7AE0\u8282".concat(index + 1, "\u65F6\u957F: ").concat(totalMinutes, "\u5206\u949F"));
                  break;
                }
              }

              // 查找包含"%"的单元格（进度）
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            var _iterator7 = _createForOfIteratorHelper(cells),
              _step7;
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var _cell = _step7.value;
                var _text = _cell.textContent.trim();
                var _match = _text.match(/(\d+)%/);
                if (_match) {
                  learnedPercent = parseInt(_match[1]);
                  console.log("\u7AE0\u8282".concat(index + 1, "\u8FDB\u5EA6: ").concat(learnedPercent, "%"));
                  break;
                }
              }

              // 如果上面没找到，尝试使用col-md-2选择器
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
            if (totalMinutes === 30) {
              var colMd2Cells = row.querySelectorAll('td.col-md-2');
              if (colMd2Cells.length >= 1) {
                var timeText = colMd2Cells[0].textContent;
                if (timeText.includes('分钟')) {
                  totalMinutes = Utils.extractMinutes(timeText);
                  console.log("\u7AE0\u8282".concat(index + 1, "\u65F6\u957F\uFF08\u5907\u7528\uFF09: ").concat(totalMinutes, "\u5206\u949F"));
                }
              }
            }
            if (learnedPercent === 0) {
              var _colMd2Cells = row.querySelectorAll('td.col-md-2');
              if (_colMd2Cells.length >= 2) {
                var progressText = _colMd2Cells[1].textContent;
                var match = progressText.match(/(\d+)%/);
                if (match) {
                  learnedPercent = parseInt(match[1]);
                  console.log("\u7AE0\u8282".concat(index + 1, "\u8FDB\u5EA6\uFF08\u5907\u7528\uFF09: ").concat(learnedPercent, "%"));
                }
              }
            }
            var key = "duration_".concat(courseId, "_").concat(chapterId);
            Utils.storage.set(key, totalMinutes.toString());
            console.log("\u7AE0\u8282".concat(index + 1, "\u603B\u65F6\u957F\u5DF2\u8BB0\u5F55: ").concat(totalMinutes, "\u5206\u949F"));
          }, "\u7AE0\u8282".concat(index + 1, "\u4FE1\u606F\u63D0\u53D6\u9519\u8BEF"));
        });
      }, '章节信息处理错误');
    },
    checkCourseCompletion: function checkCourseCompletion() {
      return Utils.safeExecute(function () {
        Utils.logger.info('检查课程完成状态');

        // 方法1: 检查所有章节的进度是否都是100%
        var chapters = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);
        if (chapters.length === 0) {
          // 尝试其他选择器
          var _iterator8 = _createForOfIteratorHelper(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS),
            _step8;
          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var selector = _step8.value;
              var found = Utils.$$(selector);
              if (found.length > 0) {
                chapters.push.apply(chapters, _toConsumableArray(found));
                break;
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }
        if (chapters.length > 0) {
          var allCompleted = true;
          var completedCount = 0;
          chapters.forEach(function (button, index) {
            var row = button.closest('tr');
            if (!row) return;

            // 查找进度信息
            var cells = row.querySelectorAll('td');
            var hasProgress = false;
            var _iterator9 = _createForOfIteratorHelper(cells),
              _step9;
            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var cell = _step9.value;
                var text = cell.textContent.trim();
                var match = text.match(/(\d+)%/);
                if (match) {
                  hasProgress = true;
                  var progress = parseInt(match[1]);
                  if (progress === 100) {
                    completedCount++;
                  } else {
                    allCompleted = false;
                    Utils.logger.info("\u7AE0\u8282".concat(index + 1, "\u672A\u5B8C\u6210: ").concat(progress, "%"));
                  }
                  break;
                }
              }

              // 如果没找到进度%，尝试检查是否有"已完成"文本
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }
            if (!hasProgress) {
              if (row.textContent.includes('已完成')) {
                completedCount++;
              } else {
                allCompleted = false;
              }
            }
          });
          Utils.logger.info("\u8BFE\u7A0B\u8FDB\u5EA6: ".concat(completedCount, "/").concat(chapters.length, " \u7AE0\u8282\u5DF2\u5B8C\u6210"));

          // 所有章节都完成才算课程完成
          return allCompleted && completedCount === chapters.length && chapters.length > 0;
        }

        // 方法2: 兜底方案 - 检查最后一个col-md-2元素
        var colMd2Elements = document.getElementsByClassName('col-md-2');
        if (colMd2Elements.length > 0) {
          var lastElement = colMd2Elements[colMd2Elements.length - 1];
          var spans = lastElement.getElementsByTagName('span');
          if (spans.length > 0) {
            var progressText = spans[0].textContent || spans[0].innerHTML;
            Utils.logger.info("\u4F7F\u7528\u515C\u5E95\u65B9\u6848\u68C0\u67E5\u8FDB\u5EA6: ".concat(progressText));
            return progressText === '100' || progressText === '100%';
          }
        }
        Utils.logger.warn('无法确定课程完成状态，默认为未完成');
        return false;
      }, '课程完成状态检查错误', false);
    },
    extractChapterName: function extractChapterName(row, chapterIndex) {
      if (!row) return "\u7B2C".concat(chapterIndex + 1, "\u7AE0");
      try {
        // Debug logging
        console.log("\u5206\u6790\u7B2C".concat(chapterIndex + 1, "\u4E2A\u7AE0\u8282\uFF0Crow\u7ED3\u6784:"), {
          tds: row.querySelectorAll('td').length,
          text: row.textContent.substring(0, 200)
        });

        // Method 1: Cell analysis - iterate through all TD cells
        var cells = row.querySelectorAll('td');
        var _iterator0 = _createForOfIteratorHelper(cells),
          _step0;
        try {
          for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
            var cell = _step0.value;
            var text = cell.textContent.trim();

            // Skip cells with progress, time, numbers only, or play buttons
            if (!text || text.includes('%') || text.includes('分钟') || /^\d+$/.test(text) || cell.querySelector('.playBtn') || text.includes('进入') || text.includes('播放')) {
              continue;
            }

            // Found a meaningful text
            if (text.length > 2) {
              console.log("  \u4ECE\u5355\u5143\u683C\u63D0\u53D6\u7AE0\u8282\u540D: \"".concat(text, "\""));
              return text;
            }
          }

          // Method 2: Pattern matching in row text
        } catch (err) {
          _iterator0.e(err);
        } finally {
          _iterator0.f();
        }
        var rowText = row.textContent;
        var patterns = [/第[一二三四五六七八九十\d]+章[\s:：]*([^\n]{2,30})/, /[一二三四五六七八九十]+、[ \t]*([^\n]{2,30})/, /\d+[\.、][ \t]*([^\n]{2,30})/, /第\d+节[\s:：]*([^\n]{2,30})/, /章[\s:：]*([^\n]{2,30})/, /节[\s:：]*([^\n]{2,30})/];
        for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
          var pattern = _patterns[_i];
          var match = rowText.match(pattern);
          if (match && match[1]) {
            var title = match[1].trim();
            if (title.length > 2) {
              console.log("  \u4ECE\u6A21\u5F0F\u5339\u914D\u63D0\u53D6\u7AE0\u8282\u540D: \"".concat(title, "\""));
              return title;
            }
          }
        }

        // Method 3: Text block analysis - find longest meaningful text
        var textBlocks = rowText.split(/[\n\t]+/).filter(function (block) {
          var trimmed = block.trim();
          return trimmed.length > 2 && !trimmed.includes('%') && !trimmed.includes('分钟') && !/^\d+$/.test(trimmed) && !trimmed.includes('进入') && !trimmed.includes('播放');
        });
        if (textBlocks.length > 0) {
          // Sort by length (descending) and take the longest
          textBlocks.sort(function (a, b) {
            return b.length - a.length;
          });
          var longest = textBlocks[0].trim();
          console.log("  \u4ECE\u6587\u672C\u5757\u5206\u6790\u63D0\u53D6\u7AE0\u8282\u540D: \"".concat(longest, "\""));
          return longest;
        }

        // Fallback
        console.log("  \u672A\u627E\u5230\u7AE0\u8282\u540D\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u503C");
        return "\u7B2C".concat(chapterIndex + 1, "\u7AE0");
      } catch (error) {
        console.error("\u7AE0\u8282".concat(chapterIndex + 1, "\u540D\u79F0\u63D0\u53D6\u9519\u8BEF:"), error);
        return "\u7B2C".concat(chapterIndex + 1, "\u7AE0");
      }
    },
    findAndClickIncompleteChapter: function findAndClickIncompleteChapter() {
      Utils.safeExecute(function () {
        var courseId = Utils.url.extractCourseId(window.location.href);

        // 首先检查全局锁，或者是否已有该课程的活跃标签页
        if (Utils.globalLock.isLocked() || courseId && Utils.tabManager.hasActivePlayer(courseId)) {
          console.log("\u68C0\u6D4B\u5230\u5168\u5C40\u9501\u5360\u7528\u6216\u5DF2\u5B58\u5728\u8BE5\u8BFE\u7A0B\u7684\u6D3B\u8DC3\u64AD\u653E\u9875 (".concat(courseId, ")\uFF0C\u8FDB\u5165\u9759\u9ED8\u7B49\u5F85\u6A21\u5F0F..."));
          UI.updateStatus('课程已在其他页面运行中，等待中...', 'warning');
          // Do not reload manually. BackgroundMonitor will handle zombie locks (>35s),
          // and player completion will trigger a remote refresh signal.
          return false;
        }
        console.log('查找未完成章节');

        // 尝试所有配置的章节按钮选择器
        var playButtons = Utils.$$(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS[0]);
        if (playButtons.length === 0) {
          var _iterator1 = _createForOfIteratorHelper(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS),
            _step1;
          try {
            for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
              var selector = _step1.value;
              playButtons = Utils.$$(selector);
              if (playButtons.length > 0) {
                Utils.logger.info("\u4F7F\u7528\u9009\u62E9\u5668 ".concat(selector, " \u627E\u5230 ").concat(playButtons.length, " \u4E2A\u7AE0\u8282\u6309\u94AE"));
                break;
              }
            }
          } catch (err) {
            _iterator1.e(err);
          } finally {
            _iterator1.f();
          }
        }
        if (playButtons.length === 0) {
          Utils.logger.error('未找到任何章节按钮');
          return false;
        }
        Utils.logger.info("\u627E\u5230 ".concat(playButtons.length, " \u4E2A\u7AE0\u8282"));
        for (var i = 0; i < playButtons.length; i++) {
          var btn = playButtons[i];
          var row = btn.closest('tr');
          if (!row) continue;
          var progress = 0;
          var cells = row.querySelectorAll('td');

          // 查找进度信息
          var _iterator10 = _createForOfIteratorHelper(cells),
            _step10;
          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var cell = _step10.value;
              var text = cell.textContent;
              var match = text.match(/(\d+)%/);
              if (match) {
                progress = parseInt(match[1]);
                break;
              }
            }

            // 如果没找到进度%，检查是否有"已完成"文本
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
          if (progress === 0 && row.textContent.includes('已完成')) {
            progress = 100;
          }
          if (progress < 100) {
            var chapterName = CourseHandler.extractChapterName(row, i);
            console.log("\u627E\u5230\u672A\u5B8C\u6210\u7AE0\u8282\"".concat(chapterName, "\"\uFF08\u8FDB\u5EA6\uFF1A").concat(progress, "%\uFF09\uFF0C\u51C6\u5907\u70B9\u51FB"));
            UI.updateStatus("\u8FDB\u5165\u7AE0\u8282\uFF1A".concat(chapterName, "\uFF08\u8FDB\u5EA6\uFF1A").concat(progress, "%\uFF09"), 'info');
            var chapterId = btn.getAttribute('data-chapterid');
            var _courseId2 = Utils.url.extractCourseId(window.location.href);
            if (chapterId && _courseId2) {
              var playUrl = "/pc/course/playvideo.do?courseid=".concat(_courseId2, "&chapterid=").concat(chapterId, "&bg_mode=1&prev_progress=").concat(progress);
              playUrl = new URL(playUrl, window.location.href).href;
              console.log(" \u5F3A\u529B\u540E\u53F0\u8DF3\u8F6C: ".concat(playUrl));
              if (typeof GM_openInTab === 'function') {
                GM_openInTab(playUrl, {
                  active: false,
                  insert: true
                });
              } else {
                window.open(playUrl);
              }
            } else {
              Utils.dom.smartClick(btn, '进入章节');
            }
            return true;
          }
        }
        console.log('所有章节已完成，标记课程为已访问并返回列表');
        var currentCourseId = Utils.url.extractCourseId(window.location.href);
        if (currentCourseId) {
          Utils.storage.addVisited(currentCourseId);
        }
        UI.updateStatus('课程已完成，返回列表', 'success');
        Utils.lifecycle.setTimeout(function () {
          return CourseHandler.returnToCourseList();
        }, 1000);
        return false;
      }, '查找未完成章节失败');
      return false;
    },
    returnToCourseList: function returnToCourseList() {
      Utils.safeExecute(function () {
        var currentUrl = window.location.href;
        var isPlaybackPage = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
        var isBgMode = window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1') || sessionStorage.getItem('isBackgroundMode') === 'true';
        var currentCourseId = Utils.url.extractCourseId(currentUrl);
        console.log(" \u4EFB\u52A1\u5B8C\u6210\u5904\u7406 - \u8BFE\u7A0BID: ".concat(currentCourseId || '未知'));

        // 1. First record to blacklist
        if (currentCourseId) {
          console.log(" \u8BB0\u5F55\u5DF2\u5B8C\u6210\u8BFE\u7A0B\u9ED1\u540D\u5355: ".concat(currentCourseId));
          Utils.storage.addVisited(currentCourseId);
          sessionStorage.setItem('last_completed_course', currentCourseId);
        }

        // 2. Set refresh flags
        GM_setValue('remote_refresh_signal', Date.now());
        GM_setValue('force_reload_requested', true);

        // 3. Release lock last
        Utils.globalLock.release();
        Utils.notificationManager.send('课程学习已完成，准备进入下一门。');
        var refreshContext = {
          timestamp: Date.now(),
          courseId: currentCourseId,
          url: currentUrl,
          learningMode: sessionStorage.getItem('learningMode')
        };
        GM_setValue('refresh_context', JSON.stringify(refreshContext));
        if (isPlaybackPage || isBgMode) {
          console.log(' 播放页：尝试关闭窗口');
          Utils.lifecycle.setTimeout(function () {
            window.close();
            Utils.lifecycle.setTimeout(function () {
              if (!window.closed) {
                console.log('️ 窗口关闭失败，执行强制跳转返回列表');
                var coursetype = sessionStorage.getItem('lastCoutype') || '1';
                window.location.href = "https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=".concat(coursetype);
              }
            }, 1000);
          }, 500);
        } else if (currentUrl.includes('coursedetail.do')) {
          // 三重保险：URL参数 > sessionStorage > GM存储
          var isThematicUrl = Utils.url.getParam('thm') === '1';
          var isThematicSession = sessionStorage.getItem('learningMode') === 'thematic' || sessionStorage.getItem('isThematicClass') === 'true';
          var appState = Utils.stateManager.getThematicState();
          var isThematicGM = (appState === null || appState === void 0 ? void 0 : appState.learningMode) === 'thematic';
          var isThematic = isThematicUrl || isThematicSession || isThematicGM;

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
          var backUrl = '';
          if (isThematic) {
            var tid = sessionStorage.getItem('currentThematicClassId') || Utils.url.getParam('tid');
            backUrl = tid ? "/pc/thematicclass/thematicclassdetail.do?tid=".concat(tid) : '/pc/thematicclass/thematicclasslist.do';
            console.log(' 专题班章节完成，退回到专题班列表:', backUrl);
            sessionStorage.setItem('fromThematicLearning', 'true');
          } else {
            var lastListUrl = sessionStorage.getItem('lastListUrl');
            if (lastListUrl) {
              backUrl = lastListUrl;
              console.log(' 普通课程章节完成，退回到最后访问的列表页:', backUrl);
            } else {
              var coursetype = sessionStorage.getItem('lastCoutype') || '1';
              backUrl = "/pc/course/courselist.do?coutype=".concat(coursetype);
              console.log(' 普通课程章节完成，退回到主课表首页:', backUrl);
            }
          }

          // Final protection: strip fragment and instructions before navigation
          var urlObj = new URL(backUrl, window.location.origin);
          urlObj.searchParams["delete"]('refresh_ts');
          urlObj.searchParams["delete"]('auto_continue');
          urlObj.hash = '';
          urlObj.searchParams.set('refresh_ts', Date.now().toString());
          urlObj.searchParams.set('auto_continue', 'true');
          window.location.replace(urlObj.href);
        } else {
          console.log(' 列表页/其他：强制刷新当前页');
          var _urlObj = new URL(window.location.href);
          _urlObj.hash = ''; // Clear fragment
          _urlObj.searchParams.set('refresh_ts', Date.now().toString());
          _urlObj.searchParams.set('auto_continue', 'true');
          window.location.replace(_urlObj.href);
        }
      }, '返回逻辑执行失败');
    }
  };

  var Router = {
    init: function init() {
      Utils.safeExecute(function () {
        Router.handleCurrentPage();
        console.log('路由管理器已初始化');
      }, '路由管理器初始化失败');
    },
    handleCurrentPage: function handleCurrentPage() {
      Utils.safeExecute(function () {
        var url = window.location.href;
        Utils.stateManager.sync();
        var autoContinue = Utils.url.getParam('auto_continue') === 'true' || window.location.hash.includes('auto_continue=true');
        if (autoContinue) {
          console.log('检测到自动继续标记');
          // Do not use replaceState to wipe params, as it removes critical info like pagenum
        }
        if (url.includes('/pc/login.do')) {
          UI.updateStatus('登录页面 - 脚本已暂停', 'info');
          return;
        }
        var run = function run(fn) {
          var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
          Utils.lifecycle.setTimeout(fn, delay);
        };
        if (url.includes('courselist.do')) {
          var ct = Utils.url.getParam('coutype');
          if (ct) sessionStorage.setItem('lastCoutype', ct);

          // Strip instructions before saving lastListUrl to prevent pollution
          var cleanUrl = url.split(/[?#]auto_continue=true/)[0].replace(/[?&]refresh_ts=\d+/, '').replace(/[?&]resumption_ts=\d+/, '');
          sessionStorage.setItem('lastListUrl', cleanUrl);
          run(function () {
            return Router.handleCourseListPage();
          }, 1500);
        } else if (url.includes('coursedetail.do')) {
          run(function () {
            return Router.handleCourseDetailPage();
          }, 1000);
        } else if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
          run(function () {
            return Router.handleVideoPage();
          }, 1000);
        } else if (url.includes('thematicclasslist.do')) {
          run(function () {
            return Router.handleThematicClassListPage();
          }, 1000);
        } else if (url.includes('thematicclassdetail.do')) {
          run(function () {
            return Router.handleThematicClassPage();
          }, 1000);
        } else {
          Router.handleHomePage();
        }
      }, '页面处理失败');
    },
    handleHomePage: function handleHomePage() {
      UI.updateStatus('首页已加载，请手动进入课程列表', 'info');
      console.log('首页已加载，脚本不会自动跳转到课程列表');
    },
    handleCourseListPage: function () {
      var _handleCourseListPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              Utils.safeExecute(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
                var currentType, typeName, targetSelector, courses, validCourses, visitedCourses, stats, paginated, next;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      if (!CourseHandler.isProcessing) {
                        _context.n = 1;
                        break;
                      }
                      return _context.a(2);
                    case 1:
                      CourseHandler.isProcessing = true;
                      console.log('开始处理课程列表页面');
                      currentType = Utils.url.getParam('coutype') || '1';
                      typeName = currentType === '1' ? '必修' : '选修';
                      UI.updateStatus("\u6B63\u5728\u5206\u6790".concat(typeName, "\u8BFE\u7A0B\u5217\u8868..."), 'info');
                      targetSelector = CONFIG.SELECTORS.COURSE_LIST.CONTAINERS.join(', ');
                      _context.n = 2;
                      return Utils.waitForElement(targetSelector, 6000);
                    case 2:
                      courses = Utils.$$(targetSelector);
                      if (courses.length === 0) {
                        console.log('尝试兜底方案：抓取所有包含课程链接的行');
                        courses = Utils.$$('tr').filter(function (tr) {
                          return tr.querySelector('a[href*="courseid="]');
                        });
                      }
                      validCourses = courses.filter(function (el) {
                        return Utils.url.extractCourseId(el);
                      });
                      if (!(validCourses.length === 0)) {
                        _context.n = 3;
                        break;
                      }
                      UI.updateStatus('未找到课程元素', 'error');
                      console.log('当前页面 HTML 结构可能已变动，请检查选择器');
                      CourseHandler.isProcessing = false;
                      return _context.a(2);
                    case 3:
                      console.log("\u627E\u5230 ".concat(validCourses.length, " \u4E2A\u5019\u9009\u8BFE\u7A0B\u5143\u7D20"));
                      visitedCourses = Utils.storage.getVisited();
                      stats = {
                        completed: 0,
                        inBlacklist: 0
                      };
                      validCourses.forEach(function (el) {
                        var status = CourseHandler.extractCourseStatus(el);
                        var courseId = Utils.url.extractCourseId(el);
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
                      console.log("\u5F53\u524D\u9875\u7EDF\u8BA1 - \u603B\u6570: ".concat(validCourses.length, ", \u9875\u9762\u663E\u793A\u5DF2\u5B8C\u6210: ").concat(stats.completed, ", \u9ED1\u540D\u5355\u4E2D: ").concat(stats.inBlacklist));
                      if (!(validCourses.length > 0 && stats.completed === validCourses.length)) {
                        _context.n = 5;
                        break;
                      }
                      UI.updateStatus(' 当前页已学完，准备翻页或切换类型...', 'success');
                      _context.n = 4;
                      return CourseHandler.handlePagination();
                    case 4:
                      paginated = _context.v;
                      if (!paginated) CourseHandler.switchCourseType();
                      CourseHandler.isProcessing = false;
                      return _context.a(2);
                    case 5:
                      next = CourseHandler.selectCourse(validCourses, visitedCourses);
                      if (!next) {
                        _context.n = 7;
                        break;
                      }
                      if (!Utils.globalLock.isLocked()) {
                        _context.n = 6;
                        break;
                      }
                      UI.updateStatus('已有课程学习中...', 'warning');
                      CourseHandler.isProcessing = false;
                      return _context.a(2);
                    case 6:
                      CourseHandler.openCourse(next);
                      _context.n = 8;
                      break;
                    case 7:
                      console.log('未找到合适课程，重置记录重试...');
                      Utils.storage.clearVisited();
                      Utils.lifecycle.setTimeout(function () {
                        CourseHandler.isProcessing = false;
                        Router.handleCourseListPage();
                      }, 2000);
                    case 8:
                      return _context.a(2);
                  }
                }, _callee);
              })), '列表页处理失败');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function handleCourseListPage() {
        return _handleCourseListPage.apply(this, arguments);
      }
      return handleCourseListPage;
    }(),
    handleCourseDetailPage: function () {
      var _handleCourseDetailPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              Utils.safeExecute(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
                var isThematicUrl, tid, courseId, found, _iterator, _step, selector, _t2;
                return _regenerator().w(function (_context3) {
                  while (1) switch (_context3.p = _context3.n) {
                    case 0:
                      if (!CourseHandler.isProcessing) {
                        _context3.n = 1;
                        break;
                      }
                      return _context3.a(2);
                    case 1:
                      CourseHandler.isProcessing = true;
                      Utils.logger.info('=== 开始处理课程详情页 ===');

                      // 从 URL 参数恢复专题班状态（最高优先级，避免 sessionStorage/GM存储过期导致丢失）
                      isThematicUrl = Utils.url.getParam('thm') === '1';
                      if (isThematicUrl) {
                        tid = Utils.url.getParam('tid');
                        Utils.logger.info("\uD83D\uDCE5 \u4ECE URL \u68C0\u6D4B\u5230\u4E13\u9898\u73ED\u6765\u6E90\uFF0C\u6062\u590D\u72B6\u6001 tid=".concat(tid));
                        sessionStorage.setItem('learningMode', 'thematic');
                        sessionStorage.setItem('isThematicClass', 'true');
                        if (tid) {
                          sessionStorage.setItem('currentThematicClassId', tid);
                          Utils.stateManager.setThematicState(tid, 'thematic');
                        }
                      }
                      if (!(sessionStorage.getItem('fromLearningPage') === 'true')) {
                        _context3.n = 2;
                        break;
                      }
                      Utils.logger.info('从学习页面返回，强制刷新页面以更新进度显示');
                      sessionStorage.removeItem('fromLearningPage');
                      window.location.reload();
                      return _context3.a(2);
                    case 2:
                      UI.updateStatus('分析章节进度...', 'info');
                      courseId = Utils.url.extractCourseId(window.location.href);
                      if (courseId) {
                        _context3.n = 3;
                        break;
                      }
                      CourseHandler.isProcessing = false;
                      return _context3.a(2);
                    case 3:
                      // 尝试所有配置的章节按钮选择器
                      found = false;
                      _iterator = _createForOfIteratorHelper(CONFIG.SELECTORS.COURSE_DETAIL.CHAPTER_BUTTONS);
                      _context3.p = 4;
                      _iterator.s();
                    case 5:
                      if ((_step = _iterator.n()).done) {
                        _context3.n = 10;
                        break;
                      }
                      selector = _step.value;
                      _context3.p = 6;
                      _context3.n = 7;
                      return Utils.waitForElement(selector, 3000);
                    case 7:
                      found = true;
                      Utils.logger.info("\u627E\u5230\u7AE0\u8282\u6309\u94AE\uFF08\u4F7F\u7528\u9009\u62E9\u5668: ".concat(selector, "\uFF09"));
                      return _context3.a(3, 10);
                    case 8:
                      _context3.p = 8;
                      _context3.v;
                    case 9:
                      _context3.n = 5;
                      break;
                    case 10:
                      _context3.n = 12;
                      break;
                    case 11:
                      _context3.p = 11;
                      _t2 = _context3.v;
                      _iterator.e(_t2);
                    case 12:
                      _context3.p = 12;
                      _iterator.f();
                      return _context3.f(12);
                    case 13:
                      if (found) {
                        _context3.n = 14;
                        break;
                      }
                      Utils.logger.error('未找到任何章节按钮，页面结构可能已改变');
                      CourseHandler.isProcessing = false;
                      return _context3.a(2);
                    case 14:
                      CourseHandler.extractChapterInfo(courseId);
                      if (!CourseHandler.checkCourseCompletion()) {
                        _context3.n = 15;
                        break;
                      }
                      UI.updateStatus(' 课程已学完！准备寻找新任务...', 'success');
                      Utils.lifecycle.setTimeout(function () {
                        return CourseHandler.returnToCourseList();
                      }, 1500);
                      return _context3.a(2);
                    case 15:
                      CourseHandler.findAndClickIncompleteChapter();
                      Utils.lifecycle.setTimeout(function () {
                        CourseHandler.isProcessing = false;
                      }, 5000);
                    case 16:
                      return _context3.a(2);
                  }
                }, _callee3, null, [[6, 8], [4, 11, 12, 13]]);
              })), '详情页处理失败');
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }));
      function handleCourseDetailPage() {
        return _handleCourseDetailPage.apply(this, arguments);
      }
      return handleCourseDetailPage;
    }(),
    handleVideoPage: function () {
      var _handleVideoPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              Utils.safeExecute(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
                var url, isSCORM, isVideo, courseTitle, _document$querySelect, _document$querySelect2, _document$title, iframeTitle, courseId, chapterId, prevProgress, getBtn, completeButton, bind, totalSecs, mins, waitSecs;
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      if (!window.studyPageProcessingStarted) {
                        _context5.n = 1;
                        break;
                      }
                      return _context5.a(2);
                    case 1:
                      // @ts-ignore
                      window.studyPageProcessingStarted = true;
                      url = window.location.href;
                      isSCORM = url.includes('playscorm.do');
                      isVideo = url.includes('playvideo.do');
                      Utils.logger.info("\u5904\u7406\u5B66\u4E60\u9875\u9762 (".concat(isSCORM ? 'SCORM课件' : 'Video课件', "\u7248)"));
                      UI.updateStatus('正在初始化播放...', 'info');

                      // 提取并显示当前学习内容
                      courseTitle = '未知课程';
                      if (isVideo) {
                        courseTitle = ((_document$querySelect = document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER.COURSE_TITLE)) === null || _document$querySelect === void 0 || (_document$querySelect = _document$querySelect.textContent) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.trim()) || '未知课程';
                      } else if (isSCORM) {
                        // SCORM课件可能需要从iframe或其他位置获取标题
                        iframeTitle = (_document$querySelect2 = document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.IFRAME)) === null || _document$querySelect2 === void 0 || (_document$querySelect2 = _document$querySelect2.contentDocument) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.title;
                        courseTitle = iframeTitle || ((_document$title = document.title) === null || _document$title === void 0 ? void 0 : _document$title.replace(/ - 安徽干部教育在线.*/, '')) || 'SCORM课件';
                      }
                      Utils.logger.info("\uD83D\uDCDA \u6B63\u5728\u5B66\u4E60: ".concat(courseTitle));
                      UI.updateStatus("\u6B63\u5728\u5B66\u4E60: ".concat(courseTitle), 'info');
                      courseId = Utils.url.extractCourseId(window.location.href);
                      chapterId = Utils.url.extractChapterId(window.location.href);
                      prevProgress = parseInt(Utils.url.getParam('prev_progress') || '0');
                      if (courseId) {
                        Utils.globalLock.acquire(courseId);
                        Utils.lifecycle.addEventListener(window, 'beforeunload', function () {
                          return Utils.globalLock.release();
                        });
                      }
                      getBtn = function getBtn() {
                        // 优先使用 ID 选择器（最快最准确）
                        var btn = document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER.COMPLETE_BTN) || document.querySelector(CONFIG.SELECTORS.SCORM_PLAYER.COMPLETE_BTN);
                        if (btn) return btn;

                        // 兜底方案：通过文本内容查找
                        var all = document.querySelectorAll('a.btn, input[type="button"], button');
                        var _iterator2 = _createForOfIteratorHelper(all),
                          _step2;
                        try {
                          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                            var b = _step2.value;
                            var el = /** @type {HTMLInputElement | HTMLButtonElement} */b;
                            var t = el.textContent || el.value || '';
                            if (t.includes('完成播放') || t.includes('确 定') || t.includes('结束学习')) return el;
                          }
                        } catch (err) {
                          _iterator2.e(err);
                        } finally {
                          _iterator2.f();
                        }
                        return null;
                      };
                      completeButton = getBtn();
                      bind = function bind(btn) {
                        btn.addEventListener('click', function () {
                          console.log(' 检测到完成播放动作 (手动/自动)');
                          Utils.globalLock.release();
                          if (courseId) Utils.storage.addVisited(courseId);
                          Utils.broadcastRefresh();
                        }, true);
                      };
                      if (completeButton) bind(completeButton);else {
                        console.warn('未找到完成按钮，等待动态加载...');
                        Utils.lifecycle.setTimeout(function () {
                          var b = getBtn();
                          if (b) {
                            console.log(' 动态补获到完成按钮');
                            bind(b);
                          }
                        }, 2000);
                      }
                      totalSecs = 1800;
                      if (courseId && chapterId) {
                        mins = Utils.storage.get("duration_".concat(courseId, "_").concat(chapterId));
                        if (mins) {
                          totalSecs = parseInt(mins) * 60;
                          console.log(" \u4F7F\u7528\u8BE6\u60C5\u9875\u5B58\u50A8\u7684\u65F6\u957F\u4F30\u503C: ".concat(mins, "\u5206\u949F (").concat(totalSecs, "\u79D2)"));
                        }
                      }
                      waitSecs = Math.max(Math.ceil(totalSecs * (100 - prevProgress) / 100) + 5, 10);
                      console.log(" \u521D\u59CB\u8FDB\u5EA6: ".concat(prevProgress, "%, \u5269\u4F59\u6BD4\u4F8B: ").concat(Math.round(100 - prevProgress), "%, \u9884\u8BA1\u5B66\u4E60: ").concat(waitSecs, "\u79D2"));
                      sessionStorage.setItem('fromLearningPage', 'true');
                      CourseHandler.startStudyTime(waitSecs, completeButton);
                    case 2:
                      return _context5.a(2);
                  }
                }, _callee5);
              })), '学习页处理失败');
            case 1:
              return _context6.a(2);
          }
        }, _callee6);
      }));
      function handleVideoPage() {
        return _handleVideoPage.apply(this, arguments);
      }
      return handleVideoPage;
    }(),
    handleThematicClassListPage: function () {
      var _handleThematicClassListPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var justFinished, links, visitedClasses, retryCount, maxRetries, _iterator3, _step3, link, tid, _t3;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              console.log('处理专题班列表页面');
              UI.updateStatus('分析专题班列表...', 'info');
              justFinished = sessionStorage.getItem('just_finished_thematic_class');
              if (justFinished) {
                UI.updateStatus("\u5DF2\u5B8C\u6210: ".concat(justFinished, "\uFF0C\u6B63\u5728\u626B\u63CF\u65B0\u4EFB\u52A1..."), 'success');
                sessionStorage.removeItem('just_finished_thematic_class');
              }
              _context7.n = 1;
              return Utils.waitForElement('a[href*="thematicclassdetail.do"]', 5000);
            case 1:
              links = Utils.$$('a[href*="thematicclassdetail.do"]');
              if (!(links.length > 0)) {
                _context7.n = 9;
                break;
              }
              visitedClasses = Utils.storage.get('ahgbjy_visited_thematic_classes', []); // 获取重试计数，防止无限循环
              retryCount = parseInt(sessionStorage.getItem('thematicListRetryCount') || '0');
              maxRetries = 3;
              _iterator3 = _createForOfIteratorHelper(links);
              _context7.p = 2;
              _iterator3.s();
            case 3:
              if ((_step3 = _iterator3.n()).done) {
                _context7.n = 5;
                break;
              }
              link = _step3.value;
              tid = Utils.url.getParam('tid', link.href) || Utils.url.extractCourseId(link.href);
              if (!(tid && !visitedClasses.includes(tid))) {
                _context7.n = 4;
                break;
              }
              console.log("\u8FDB\u5165\u4E13\u9898\u73ED: ".concat(tid));
              visitedClasses.push(tid);
              Utils.storage.set('ahgbjy_visited_thematic_classes', visitedClasses);
              Utils.dom.smartClick(link, '进入专题班');
              // 成功进入新专题班，重置重试计数
              sessionStorage.removeItem('thematicListRetryCount');
              return _context7.a(2);
            case 4:
              _context7.n = 3;
              break;
            case 5:
              _context7.n = 7;
              break;
            case 6:
              _context7.p = 6;
              _t3 = _context7.v;
              _iterator3.e(_t3);
            case 7:
              _context7.p = 7;
              _iterator3.f();
              return _context7.f(7);
            case 8:
              // 所有专题班都已访问过
              if (visitedClasses.length > 0) {
                if (retryCount < maxRetries) {
                  console.log("\u6240\u6709\u4E13\u9898\u73ED\u90FD\u5DF2\u8BBF\u95EE\u8FC7\uFF0C\u6E05\u9664\u8BB0\u5F55\u91CD\u8BD5 (".concat(retryCount + 1, "/").concat(maxRetries, ")"));
                  Utils.storage.set('ahgbjy_visited_thematic_classes', []);
                  sessionStorage.setItem('thematicListRetryCount', retryCount + 1);
                  Utils.lifecycle.setTimeout(function () {
                    return Router.handleThematicClassListPage();
                  }, 2000);
                } else {
                  console.log('达到最大重试次数，可能所有专题班已完成');
                  UI.updateStatus('所有专题班已完成或需要手动检查', 'warning');
                  sessionStorage.removeItem('thematicListRetryCount');
                }
              } else {
                UI.updateStatus('所有专题班已完成！', 'success');
                sessionStorage.removeItem('thematicListRetryCount');
              }
              _context7.n = 10;
              break;
            case 9:
              UI.updateStatus('未找到专题班', 'error');
            case 10:
              return _context7.a(2);
          }
        }, _callee7, null, [[2, 6, 7, 8]]);
      }));
      function handleThematicClassListPage() {
        return _handleThematicClassListPage.apply(this, arguments);
      }
      return handleThematicClassListPage;
    }(),
    handleThematicClassPage: function () {
      var _handleThematicClassPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              Utils.safeExecute(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
                var tid, courseLinks, visitedCourses, selectedLink, _iterator4, _step4, _link$querySelector3, _link, _p, _match, _progress, _cid, _iterator5, _step5, _link$querySelector, link, p, match, progress, cid, allCompleted, _document$querySelect3, className, visitedClasses, _t4, _t5;
                return _regenerator().w(function (_context8) {
                  while (1) switch (_context8.p = _context8.n) {
                    case 0:
                      if (!CourseHandler.isProcessing) {
                        _context8.n = 1;
                        break;
                      }
                      return _context8.a(2);
                    case 1:
                      if (!Utils.globalLock.isLocked()) {
                        _context8.n = 2;
                        break;
                      }
                      console.log(' 专题班：检测到其他页面正在播放，停止当前操作');
                      UI.updateStatus('其他课程学习中...', 'warning');
                      return _context8.a(2);
                    case 2:
                      CourseHandler.isProcessing = true;
                      console.log('处理专题班课程页面');
                      UI.updateStatus('分析专题班课程...', 'info');
                      tid = Utils.url.getParam('tid');
                      if (tid) {
                        sessionStorage.setItem('currentThematicClassId', tid);
                        Utils.stateManager.setThematicState(tid, 'thematic');
                      }
                      sessionStorage.setItem('isThematicClass', 'true');
                      sessionStorage.setItem('learningMode', 'thematic');
                      if (!(sessionStorage.getItem('fromThematicLearning') === 'true')) {
                        _context8.n = 3;
                        break;
                      }
                      console.log(' 从专题班学习返回，继续寻找下一门');
                      sessionStorage.removeItem('fromThematicLearning');
                      // 使用延迟重试代替立即刷新，确保 DOM 完全渲染
                      CourseHandler.isProcessing = false;
                      Utils.lifecycle.setTimeout(function () {
                        return Router.handleThematicClassPage();
                      }, 1500);
                      return _context8.a(2);
                    case 3:
                      _context8.n = 4;
                      return Utils.waitForElement('#course a[href*="coursedetail.do"], .ke-box a[target="_blank"]', 5000);
                    case 4:
                      courseLinks = [].concat(_toConsumableArray(Utils.$$('#course a[href*="coursedetail.do"]')), _toConsumableArray(Utils.$$('.ke-box a[target="_blank"]')));
                      if (!(courseLinks.length === 0)) {
                        _context8.n = 5;
                        break;
                      }
                      UI.updateStatus('未找到专题班课程', 'error');
                      CourseHandler.isProcessing = false;
                      return _context8.a(2);
                    case 5:
                      console.log("\u627E\u5230 ".concat(courseLinks.length, " \u4E2A\u8BFE\u7A0B"));
                      visitedCourses = Utils.storage.getVisited();
                      selectedLink = null;
                      _iterator4 = _createForOfIteratorHelper(courseLinks);
                      _context8.p = 6;
                      _iterator4.s();
                    case 7:
                      if ((_step4 = _iterator4.n()).done) {
                        _context8.n = 9;
                        break;
                      }
                      _link = _step4.value;
                      _p = ((_link$querySelector3 = _link.querySelector('p')) === null || _link$querySelector3 === void 0 ? void 0 : _link$querySelector3.textContent) || '';
                      _match = _p.match(/(\d+)%/);
                      _progress = _match ? parseInt(_match[1]) : 0;
                      _cid = Utils.url.extractCourseId(_link.href);
                      if (!(_progress > 0 && _progress < 100 && _cid)) {
                        _context8.n = 8;
                        break;
                      }
                      console.log(" \u53D1\u73B0\u8FDB\u884C\u4E2D\u8BFE\u7A0B: ".concat(_cid, " (").concat(_progress, "%)"));
                      if (Utils.globalLock.isLocked()) {
                        _context8.n = 8;
                        break;
                      }
                      selectedLink = _link;
                      return _context8.a(3, 9);
                    case 8:
                      _context8.n = 7;
                      break;
                    case 9:
                      _context8.n = 11;
                      break;
                    case 10:
                      _context8.p = 10;
                      _t4 = _context8.v;
                      _iterator4.e(_t4);
                    case 11:
                      _context8.p = 11;
                      _iterator4.f();
                      return _context8.f(11);
                    case 12:
                      if (selectedLink) {
                        _context8.n = 19;
                        break;
                      }
                      _iterator5 = _createForOfIteratorHelper(courseLinks);
                      _context8.p = 13;
                      _iterator5.s();
                    case 14:
                      if ((_step5 = _iterator5.n()).done) {
                        _context8.n = 16;
                        break;
                      }
                      link = _step5.value;
                      p = ((_link$querySelector = link.querySelector('p')) === null || _link$querySelector === void 0 ? void 0 : _link$querySelector.textContent) || '';
                      match = p.match(/(\d+)%/);
                      progress = match ? parseInt(match[1]) : 0;
                      cid = Utils.url.extractCourseId(link.href);
                      if (!((progress === 0 || !match) && cid && !visitedCourses.includes(cid))) {
                        _context8.n = 15;
                        break;
                      }
                      console.log(" \u53D1\u73B0\u672A\u5F00\u59CB\u8BFE\u7A0B: ".concat(cid));
                      selectedLink = link;
                      return _context8.a(3, 16);
                    case 15:
                      _context8.n = 14;
                      break;
                    case 16:
                      _context8.n = 18;
                      break;
                    case 17:
                      _context8.p = 17;
                      _t5 = _context8.v;
                      _iterator5.e(_t5);
                    case 18:
                      _context8.p = 18;
                      _iterator5.f();
                      return _context8.f(18);
                    case 19:
                      if (selectedLink) {
                        UI.updateStatus('发现匹配课程，准备进入...', 'info');
                        CourseHandler.openCourse(selectedLink);
                      } else {
                        allCompleted = courseLinks.every(function (link) {
                          var _link$querySelector2;
                          return (((_link$querySelector2 = link.querySelector('p')) === null || _link$querySelector2 === void 0 ? void 0 : _link$querySelector2.textContent) || '').includes('100%');
                        });
                        if (!allCompleted && visitedCourses.length > 0) {
                          Utils.storage.clearVisited();
                          Utils.lifecycle.setTimeout(function () {
                            CourseHandler.isProcessing = false;
                            Router.handleThematicClassPage();
                          }, 2000);
                        } else if (allCompleted) {
                          className = ((_document$querySelect3 = document.querySelector('.breadcrumb .active, .title')) === null || _document$querySelect3 === void 0 || (_document$querySelect3 = _document$querySelect3.textContent) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.trim()) || '专题班';
                          sessionStorage.setItem('just_finished_thematic_class', className);
                          if (tid) {
                            visitedClasses = Utils.storage.get('ahgbjy_visited_thematic_classes', []);
                            if (!visitedClasses.includes(tid)) {
                              visitedClasses.push(tid);
                              Utils.storage.set('ahgbjy_visited_thematic_classes', visitedClasses);
                            }
                          }
                          UI.updateStatus('所有专题班课程已完成！', 'success');
                          sessionStorage.removeItem('currentThematicClassId');
                          sessionStorage.removeItem('learningMode');
                          sessionStorage.removeItem('isThematicClass');
                          sessionStorage.removeItem('fromThematicLearning');
                          Utils.stateManager.clear();
                          Utils.lifecycle.setTimeout(function () {
                            Utils.navigateTo('/pc/thematicclass/thematicclasslist.do', '返回专题班列表');
                          }, 3000);
                        }
                        CourseHandler.isProcessing = false;
                      }
                    case 20:
                      return _context8.a(2);
                  }
                }, _callee8, null, [[13, 17, 18, 19], [6, 10, 11, 12]]);
              })), '专题班处理失败');
            case 1:
              return _context9.a(2);
          }
        }, _callee9);
      }));
      function handleThematicClassPage() {
        return _handleThematicClassPage.apply(this, arguments);
      }
      return handleThematicClassPage;
    }()
  };

  /**
   * VideoAutoplayBlocker Module prevents unnecessary video playback to save resources.
   */
  var VideoAutoplayBlocker = {
    _initialized: false,
    _popupInterval: null,
    _videoObserver: null,
    init: function init() {
      if (VideoAutoplayBlocker._initialized) return;
      VideoAutoplayBlocker._initialized = true;
      Utils.safeExecute(function () {
        Utils.logger.info('资源节省模式：视频播放控制启动');
        VideoAutoplayBlocker.blockAutoplay();
        VideoAutoplayBlocker.blockVideoPopups();
      }, '视频控制初始化失败');
    },
    blockAutoplay: function blockAutoplay() {
      Utils.safeExecute(function () {
        var processVideo = function processVideo(video) {
          // Precise resource saving matching original script
          video.autoplay = false;
          video.muted = true;
          video.volume = 0;
          video.pause();
          video.addEventListener('play', function (e) {
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
        VideoAutoplayBlocker._videoObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
              // Use type guard to ensure node is an Element
              if (node.nodeType === Node.ELEMENT_NODE) {
                var element = /** @type {HTMLElement} */node;
                if (element.tagName === 'VIDEO') processVideo(/** @type {HTMLVideoElement} */element);
                element.querySelectorAll('video').forEach(function (v) {
                  return processVideo(/** @type {HTMLVideoElement} */v);
                });
              }
            });
          });
        });
        VideoAutoplayBlocker._videoObserver.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }, '阻止自动播放失败');
    },
    blockVideoPopups: function blockVideoPopups() {
      Utils.safeExecute(function () {
        var hidePopups = function hidePopups() {
          CONFIG.SELECTORS.POPUPS.forEach(function (selector) {
            var popup = document.querySelector(selector);
            if (popup) popup.remove();
          });
        };
        hidePopups();
        VideoAutoplayBlocker._popupInterval = Utils.lifecycle.setInterval(hidePopups, CONFIG.TIMEOUTS.POPUP_CHECK);
      }, '屏蔽弹窗设置失败');
    },
    cleanup: function cleanup() {
      Utils.safeExecute(function () {
        if (VideoAutoplayBlocker._popupInterval) {
          Utils.lifecycle.clearInterval(VideoAutoplayBlocker._popupInterval);
          VideoAutoplayBlocker._popupInterval = null;
        }
        if (VideoAutoplayBlocker._videoObserver) {
          try {
            VideoAutoplayBlocker._videoObserver.disconnect();
          } catch (_) {}
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
  var App = {
    init: function init() {
      Utils.safeExecute(function () {
        // Connect Logger to UI and set dynamic prefix with version
        Utils.logger.prefix = "[\u5B89\u5FBD\u5E72\u90E8\u6559\u80B2\u52A9\u624B V".concat(CONFIG.VERSION, "]");
        Utils.logger.onUpdateUI = function (msg, type) {
          return UI.updateStatus(msg, type);
        };
        Utils.logger.info("\u5B89\u5FBD\u5E72\u90E8\u5728\u7EBF\u6559\u80B2\u81EA\u52A8\u5B66\u4E60 \u542F\u52A8");
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
    start: function start() {
      Utils.safeExecute(function () {
        if (!document.body) {
          Utils.lifecycle.setTimeout(App.start, 100);
          return;
        }
        Utils.logger.info('页面加载完成，启动主程序');
        Utils.tabManager.register();

        // Inject dependencies into monitor to avoid circular imports
        Utils.monitor.onCheckDetail = function () {
          return Router.handleCourseDetailPage();
        };
        Utils.monitor.onNavigationChange = function () {
          return Router.handleCurrentPage();
        };
        Utils.monitor.onResetProcessing = function () {
          CourseHandler.isProcessing = false;
        };
        Utils.logger.onUpdateBackgroundUI = function (isBackground) {
          return UI.updateBackgroundStatus(isBackground);
        };
        Utils.logger.onUpdateStatusUI = function (msg, type) {
          return UI.updateStatus(msg, type);
        };
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
  window.addEventListener('beforeunload', function () {
    Utils.safeExecute(function () {
      var _Autoplay$cleanup;
      if (Utils.tabManager) Utils.tabManager.unregister();
      (_Autoplay$cleanup = VideoAutoplayBlocker.cleanup) === null || _Autoplay$cleanup === void 0 || _Autoplay$cleanup.call(VideoAutoplayBlocker);
      WakeLockManager.cleanup();
      Utils.lifecycle.cleanup();
      Utils.logger.info('应用已安全清理');
    }, '应用清理失败');
  });
  App.init();

})();
