// ==UserScript==
// @name         个人定制脚本
// @namespace    http://xxxily.co
// @version      0.1.1
// @license      LGPLv3
// @description  个人专用脚本
// @author       Blaze
// @match        *://*/*
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      GPL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413279/%E4%B8%AA%E4%BA%BA%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/413279/%E4%B8%AA%E4%BA%BA%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function (w) { if (w) { w.name = 'myscript'; } })();

class AssertionError extends Error {}
AssertionError.prototype.name = 'AssertionError';

/**
 * Minimal assert function
 * @param  {any} t Value to check if falsy
 * @param  {string=} m Optional assertion error message
 * @throws {AssertionError}
 */
function assert (t, m) {
  if (!t) {
    var err = new AssertionError(m);
    if (Error.captureStackTrace) Error.captureStackTrace(err, assert);
    throw err
  }
}

/* eslint-env browser */

let ls;
if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
  // A simple localStorage interface so that lsp works in SSR contexts. Not for persistant storage in node.
  const _nodeStorage = {};
  ls = {
    getItem (name) {
      return _nodeStorage[name] || null
    },
    setItem (name, value) {
      if (arguments.length < 2) throw new Error('Failed to execute \'setItem\' on \'Storage\': 2 arguments required, but only 1 present.')
      _nodeStorage[name] = (value).toString();
    },
    removeItem (name) {
      delete _nodeStorage[name];
    }
  };
} else {
  ls = window.localStorage;
}

var localStorageProxy = (name, opts = {}) => {
  assert(name, 'namepace required');
  const {
    defaults = {},
    lspReset = false,
    storageEventListener = true
  } = opts;

  const state = new EventTarget();
  try {
    const restoredState = JSON.parse(ls.getItem(name)) || {};
    if (restoredState.lspReset !== lspReset) {
      ls.removeItem(name);
      for (const [k, v] of Object.entries({
        ...defaults
      })) {
        state[k] = v;
      }
    } else {
      for (const [k, v] of Object.entries({
        ...defaults,
        ...restoredState
      })) {
        state[k] = v;
      }
    }
  } catch (e) {
    console.error(e);
    ls.removeItem(name);
  }

  state.lspReset = lspReset;

  if (storageEventListener && typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    window.addEventListener('storage', (ev) => {
      // Replace state with whats stored on localStorage... it is newer.
      for (const k of Object.keys(state)) {
        delete state[k];
      }
      const restoredState = JSON.parse(ls.getItem(name)) || {};
      for (const [k, v] of Object.entries({
        ...defaults,
        ...restoredState
      })) {
        state[k] = v;
      }
      opts.lspReset = restoredState.lspReset;
      state.dispatchEvent(new Event('update'));
    });
  }

  function boundHandler (rootRef) {
    return {
      get (obj, prop) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          return new Proxy(obj[prop], boundHandler(rootRef))
        } else if (typeof obj[prop] === 'function' && obj === rootRef && prop !== 'constructor') {
          // this returns bound EventTarget functions
          return obj[prop].bind(obj)
        } else {
          return obj[prop]
        }
      },
      set (obj, prop, value) {
        obj[prop] = value;
        try {
          ls.setItem(name, JSON.stringify(rootRef));
          rootRef.dispatchEvent(new Event('update'));
          return true
        } catch (e) {
          console.error(e);
          return false
        }
      }
    }
  }

  return new Proxy(state, boundHandler(state))
};

const defaultConfig = {
  debugTools: {
    /* 是否启用调试模式的全局标识 */
    debugModeTag: true,

    /* 是否开启eruda，可用于开启反调试的页面上 */
    eruda: true,
    vconsole: false,
    /* 是否启用debugger消除插件 */
    debuggerEraser: false,

    /* 代理console，防止console下的方法被重写后，而无法输出调试信息 */
    consoleProxy: true,

    /* 时间管理器插件配置 */
    timerManager: {
      enabled: false,
      /* 当使用clearTimer的相关方法取消定时器时，是否继续保留计时器的相关信息 */
      keepTimerState: true,
      /* 阻断所有setInterval、setTimeout的调用 */
      blockAll: false,
      /* 阻断上一次执行时长超过150ms的setInterval、setTimeout调用 */
      blockLongTask: true,
      /* 修改计时器的比率，使其执行时间变快或变慢 */
      rate: 1
    }
  },
  enhanceTools: {
    /* 是否开启水印擦除插件 */
    waterMarkEraser: true
  }
};

const config = localStorageProxy('_myscriptConfig_', {
  defaults: defaultConfig,
  lspReset: false,
  storageEventListener: false
});

/**
 * 由于tampermonkey对window对象进行了封装，我们实际访问到的window并非页面真实的window
 * 这就导致了如果我们需要将某些对象挂载到页面的window进行调试的时候就无法挂载了
 * 所以必须使用特殊手段才能访问到页面真实的window对象，于是就有了下面这个函数
 * @returns {Promise<void>}
 */
async function getPageWindow () {
  return new Promise(function (resolve, reject) {
    if (window._pageWindow) {
      return resolve(window._pageWindow)
    }

    const listenEventList = ['load', 'mousemove', 'scroll', 'get-page-window-event'];

    function getWin (event) {
      window._pageWindow = this;
      // debug.log('getPageWindow succeed', event)
      listenEventList.forEach(eventType => {
        window.removeEventListener(eventType, getWin, true);
      });
      resolve(window._pageWindow);
    }

    listenEventList.forEach(eventType => {
      window.addEventListener(eventType, getWin, true);
    });

    /* 自行派发事件以便用最短的时候获得pageWindow对象 */
    window.dispatchEvent(new window.Event('get-page-window-event'));
  })
}
getPageWindow();

/**
 * 通过同步的方式获取pageWindow
 * 注意同步获取的方式需要将脚本写入head，部分网站由于安全策略会导致写入失败，而无法正常获取
 * @returns {*}
 */
function getPageWindowSync (rawFunction) {
  if (window.unsafeWindow) return window.unsafeWindow
  if (document._win_) return document._win_

  try {
    rawFunction = rawFunction || window.__rawFunction__ || Function.prototype.constructor;
    // return rawFunction('return window')()
    // Function('return (function(){}.constructor("return this")());')
    return rawFunction('return (function(){}.constructor("var getPageWindowSync=1; return this")());')()
  } catch (e) {
    console.error('getPageWindowSync error', e);

    const head = document.head || document.querySelector('head');
    const script = document.createElement('script');
    script.appendChild(document.createTextNode('document._win_ = window'));
    head.appendChild(script);

    return document._win_
  }
}

/*!
 * @name         setDebugMode.js
 * @description  标识当前处于调试模式
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/08/11 14:47
 * @github       https://github.com/xxxily
 */

function setDebugMode () {
  /* 让脚本可以输出调试信息 */
  window._debugMode_ = true;

  const pageWindow = getPageWindowSync();

  /* 标识当前处于调试模式 */
  pageWindow.__debugMode__ = true;
  pageWindow._debugMode_ = true;

  /* 开发环境运行标识，只对遵循该标识的逻辑生效 */
  pageWindow._isDevEnv_ = true;

  /* 允许进行Mock标识，只对遵循该标识的逻辑生效 */
  pageWindow._isAllowMock_ = true;
}

/**
 * 元素监听器
 * @param selector -必选
 * @param fn -必选，元素存在时的回调
 * @param shadowRoot -可选 指定监听某个shadowRoot下面的DOM元素
 * 参考：https://javascript.ruanyifeng.com/dom/mutationobserver.html
 */
function ready (selector, fn, shadowRoot) {
  const win = window;
  const docRoot = shadowRoot || win.document.documentElement;
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  const listeners = docRoot._MutationListeners || [];

  function $ready (selector, fn) {
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    });

    /* 增加监听对象 */
    if (!docRoot._MutationListeners || !docRoot._MutationObserver) {
      docRoot._MutationListeners = listeners;
      docRoot._MutationObserver = new MutationObserver(() => {
        for (let i = 0; i < docRoot._MutationListeners.length; i++) {
          const item = docRoot._MutationListeners[i];
          check(item.selector, item.fn);
        }
      });

      docRoot._MutationObserver.observe(docRoot, {
        childList: true,
        subtree: true
      });
    }

    // 检查节点是否已经在DOM中
    check(selector, fn);
  }

  function check (selector, fn) {
    const elements = docRoot.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element._MutationReadyList_ = element._MutationReadyList_ || [];
      if (!element._MutationReadyList_.includes(fn)) {
        element._MutationReadyList_.push(fn);
        fn.call(element, element);
      }
    }
  }

  const selectorArr = Array.isArray(selector) ? selector : [selector];
  selectorArr.forEach(selector => $ready(selector, fn));
}

/**
 * DOM对象属性监听器
 * @param selector {String|Element} -必选 可以是选择器也可以是已存在的dom对象，如果是选择器则会调用ready进行监听
 * @param fn {Function} -必选 属性变化时的回调函数
 * @param attrFilter {String|Array} -可选 指定监听的属性，如果不指定将监听所有属性的变化
 * @param shadowRoot
 */
function attrObserver (selector, fn, attrFilter, shadowRoot) {
  if (!selector || !fn) return false
  function _attrObserver (element) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(fn);
    const observeOpts = {
      attributes: true,
      attributeOldValue: true
    };

    if (attrFilter) {
      attrFilter = Array.isArray(attrFilter) ? attrFilter : [attrFilter];
      observeOpts.attributeFilter = attrFilter;
    }

    observer.observe(element, observeOpts);
  }

  if (typeof selector === 'string' || Array.isArray(selector)) {
    ready(selector, element => _attrObserver(element), shadowRoot);
  } else if (/Element/.test(Object.prototype.toString.call(selector))) {
    _attrObserver(selector);
  } else {
    return false
  }
}

/*!
 * @name         utils.js
 * @description  数据类型相关的方法
 * @version      0.0.1
 * @author       Blaze
 * @date         22/03/2019 22:46
 * @github       https://github.com/xxxily
 */

/**
 * 准确地获取对象的具体类型 参见：https://www.talkingcoder.com/article/6333557442705696719
 * @param obj { all } -必选 要判断的对象
 * @returns {*} 返回判断的具体类型
 */
function getType (obj) {
  if (obj == null) {
    return String(obj)
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? (obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase()) ||
    /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase()
    : typeof obj
}

const isType = (obj, typeName) => getType(obj) === typeName;
const isObj = obj => isType(obj, 'object');
const isArr = obj => isType(obj, 'array');
const isFunction = obj => obj instanceof Function;

const quickSort = function (arr) {
  if (arr.length <= 1) { return arr }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
};

/*!
 * @name         url.js
 * @description  用于对url进行解析的相关方法
 * @version      0.0.1
 * @author       Blaze
 * @date         27/03/2019 15:52
 * @github       https://github.com/xxxily
 */

/**
 * 参考示例：
 * https://segmentfault.com/a/1190000006215495
 * 注意：该方法必须依赖浏览器的DOM对象
 */

function parseURL (url) {
  const a = document.createElement('a');
  a.href = url || window.location.href;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    origin: a.origin,
    search: a.search,
    query: a.search,
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    params: (function () {
      const ret = {};
      const seg = [];
      const paramArr = a.search.replace(/^\?/, '').split('&');

      for (let i = 0; i < paramArr.length; i++) {
        const item = paramArr[i];
        if (item !== '' && item.indexOf('=')) {
          seg.push(item);
        }
      }

      for (let j = 0; j < seg.length; j++) {
        const param = seg[j];
        const idx = param.indexOf('=');
        const key = param.substring(0, idx);
        const val = param.substring(idx + 1);
        if (!key) {
          ret[val] = null;
        } else {
          ret[key] = val;
        }
      }
      return ret
    })()
  }
}

/**
 * 简单的复制内容到剪贴板方法
 * @param text {String} -必选 要复制到剪贴板的内容
 * @returns {boolean} 复制成功或失败的状态
 */

function copyText (text = '') {
  let sucStatus = false;
  const input = document.createElement('input');

  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', text);
  document.body.appendChild(input);

  input.setSelectionRange(0, input.value.length);
  input.select();

  if (document.execCommand && document.execCommand('copy')) {
    document.execCommand('copy');
    sucStatus = true;
  }

  document.body.removeChild(input);

  return sucStatus
}

/*!
 * @name         loadScript.js
 * @description  用于动态加载为外部文件
 * @version      0.0.1
 * @author       Blaze
 * @date         12/08/2019 10:21
 * @github       https://github.com/xxxily
 */
const callbacks = {};

/**
 * 动态加载外部文件
 * @param type {String} -必选 要加载的文件类型，支持： script, link, iframe 三种类型标志
 * @param src {String} -必选 外部文件的地址
 * @param callback {Function} -必选 加载成功或失败时的回调
 * @param beforeAppend {Function} -可选 插入DOM执行加载动作前的钩子函数 一般iframe才需要此函数，执行提前处理好样式等操作
 * @param appendDom {el} -可选 指定将文件插入到哪个DOM里面，一般iframe才会使用此选项，不指定都是按默认规则插入
 */
function loadFile (type, src, callback, beforeAppend, appendDom) {
  if (!type || !/^(script|link|iframe)$/.test(type)) return false

  const existing = document.getElementById(src);
  const cb = callback || function () {};

  /* 每个链接有自己对应的回调队列 */
  if (!callbacks[src]) {
    callbacks[src] = [];
  }

  if (existing && existing._isLoaded_) {
    cb(null, existing);
  } else {
    callbacks[src].push(cb);
  }

  function handler (isSuc, el) {
    /* 执行回调队列 */
    for (const cb of callbacks[src]) {
      isSuc ? cb(null, el) : cb(new Error('Failed to load ' + src), el);
    }

    el.onerror = el.onload = el.onreadystatechange = null;
    delete callbacks[src];

    if (isSuc) {
      el._isLoaded_ = true;
    } else {
      /* 移除加载出错脚本，以便下个执行的函数可以尝试继续加载 */
      el.parentElement.removeChild(el);
    }
  }

  if (!existing) {
    /* 生成并注入脚本标签 */
    const el = document.createElement(type);
    el.id = src;

    /* 使用正确的连接属性 */
    if (/^(script|iframe)$/.test(type)) {
      el.src = src;
    } else {
      el.type = 'text/css';
      el.rel = 'stylesheet';
      el.href = src;
    }

    /* 获得正确的插入节点 */
    if (!appendDom || !appendDom.appendChild) {
      if (/^(script|link)$/.test(type)) {
        appendDom = document.getElementsByTagName('head')[0] || document.body;
      } else {
        appendDom = document.body;
      }
    }

    /* 处理相关事件 */
    el.onload = el.onreadystatechange = function () {
      if (!el._isLoaded_ && (!this.readyState || this.readyState === 'complete')) {
        handler(true, el);
      }
    };

    el.onerror = function () {
      handler(false, el);
    };

    if (beforeAppend instanceof Function) {
      beforeAppend(el, src);
    }

    /* 插入到dom元素，执行加载操作 */
    appendDom.appendChild(el);
  }
}

const loadScript = (src, callback) => loadFile('script', src, callback);

class Debug {
  constructor (msg) {
    const t = this;
    msg = msg || 'debug message:';
    t.log = t.createDebugMethod('log', null, msg);
    t.error = t.createDebugMethod('error', null, msg);
    t.info = t.createDebugMethod('info', null, msg);
  }

  create (msg) {
    return new Debug(msg)
  }

  createDebugMethod (name, color, tipsMsg) {
    name = name || 'info';

    const bgColorMap = {
      info: '#2274A5',
      log: '#95B46A',
      error: '#D33F49'
    };

    const handler = function () {
      if (!window._debugMode_) {
        return false
      }

      const curTime = new Date();
      const H = curTime.getHours();
      const M = curTime.getMinutes();
      const S = curTime.getSeconds();
      const msg = tipsMsg || 'debug message:';

      const arg = Array.from(arguments);
      arg.unshift(`color: white; background-color: ${color || bgColorMap[name] || '#95B46A'}`);
      arg.unshift(`%c [${H}:${M}:${S}] ${msg} `);
      window.console[name].apply(window.console, arg);
    };

    /**
     * 调试复杂数据的辅助函数
     * 例如将vue的data对象转换回普通对象数据进行输出
     * 又例如将本身可以解析为对象的字符串转成普通对象数据进行输出
     */
    handler.parse = function () {
      const arg = Array.from(arguments);
      arg.forEach((val, index) => {
        if (val) {
          if (val.__ob__ || isObj(val) || isArr(val)) {
            try {
              arg[index] = JSON.parse(JSON.stringify(val));
            } catch (e) {
              arg[index] = val;
            }
          } else if (typeof val === 'string') {
            const tmpObj = JSON.parse(JSON.stringify(val));
            if (isObj(tmpObj) || isArr(tmpObj)) {
              arg[index] = tmpObj;
            }
          }
        }
      });
      handler.apply(handler, arg);
    };

    return handler
  }

  isDebugMode () {
    return Boolean(window._debugMode_)
  }
}

var Debug$1 = new Debug();

/* 强制标识当前处于调试模式 */
// window._debugMode_ = true
const debug$1 = Debug$1.create('myscript message:');

/*!
 * @name      menuCommand.js
 * @version   0.0.1
 * @author    Blaze
 * @date      2019/9/21 14:22
 */

const monkeyMenu = {
  menuIds: {},
  on (title, fn, accessKey) {
    if (title instanceof Function) {
      title = title();
    }

    if (window.GM_registerMenuCommand) {
      const menuId = window.GM_registerMenuCommand(title, fn, accessKey);

      this.menuIds[menuId] = {
        title,
        fn,
        accessKey
      };

      return menuId
    }
  },

  off (id) {
    if (window.GM_unregisterMenuCommand) {
      delete this.menuIds[id];

      /**
       * 批量移除已注册的按钮时，在某些性能较差的机子上会留下数字title的菜单残留
       * 应该属于插件自身导致的BUG，暂时无法解决
       * 所以此处暂时不进行菜单移除，tampermonkey会自动对同名菜单进行合并
       */
      // return window.GM_unregisterMenuCommand(id)
    }
  },

  clear () {
    Object.keys(this.menuIds).forEach(id => {
      this.off(id);
    });
  },

  /**
   * 通过菜单配置进行批量注册，注册前会清空之前注册过的所有菜单
   * @param {array|function} menuOpts 菜单配置，如果是函数则会调用该函数获取菜单配置，并且当菜单被点击后会重新创建菜单，实现菜单的动态更新
   */
  build (menuOpts) {
    this.clear();

    if (Array.isArray(menuOpts)) {
      menuOpts.forEach(menu => {
        if (menu.disable === true) { return }
        this.on(menu.title, menu.fn, menu.accessKey);
      });
    } else if (menuOpts instanceof Function) {
      const menuList = menuOpts();
      if (Array.isArray(menuList)) {
        this._menuBuilder_ = menuOpts;

        menuList.forEach(menu => {
          if (menu.disable === true) { return }

          const menuFn = () => {
            try {
              menu.fn.apply(menu, arguments);
            } catch (e) {
              console.error('[monkeyMenu]', menu.title, e);
            }

            // 每次菜单点击后，重新注册菜单，这样可以确保菜单的状态是最新的
            setTimeout(() => {
              // console.log('[monkeyMenu rebuild]', menu.title)
              this.build(this._menuBuilder_);
            }, 100);
          };

          this.on(menu.title, menuFn, menu.accessKey);
        });
      } else {
        console.error('monkeyMenu build error, no menuList return', menuOpts);
      }
    }
  }
};

/* 防止解析出错的jsonParse */
function jsonParse (str) {
  let result = null;
  try {
    result = JSON.parse(str);
  } catch (e) {
    result = {};
    console.error(e);
  }
  result = result || {};
  return result
}

/*!
 * @name         autoRefresh.js
 * @description  自动刷新页面
 * @version      0.0.1
 * @author       Blaze
 * @date         2020/12/8 10:33
 * @github       https://github.com/xxxily
 */

/**
 * 自动刷新页面
 * @param timeout {undefined|number} -可选 当数值为undefined时候，自动读取本地localStorage里的配置执行相关逻辑
 * 当传入数值为-1时，则取消自动刷新逻辑，当为正数时，则表示指定刷新页面的时间间隔
 * @param selector {string} -可选 指定某个选择器，只有页面在指定的时间内依然无法读取到该选择器时才进行刷新
 * @returns {boolean}
 */
function autoRefresh (timeout, selector) {
  if (!timeout && !localStorage.getItem('_autoRefreshConfig_')) {
    return false
  }

  const conf = jsonParse(localStorage.getItem('_autoRefreshConfig_'));
  const urlId = encodeURIComponent(location.href);

  if (timeout === -1) {
    /* 取消页面自动刷新 */
    delete conf[urlId];
    localStorage.setItem('_autoRefreshConfig_', JSON.stringify(conf));
    clearTimeout(window._autoRefreshTimer_);
    alert('自动刷新取消成功~');
    return true
  } else if (typeof timeout === 'number') {
    /* 设置自动刷新 */
    conf[urlId] = {
      timeout,
      refreshCount: 0,
      selector: selector || ''
    };
    localStorage.setItem('_autoRefreshConfig_', JSON.stringify(conf));
    clearTimeout(window._autoRefreshTimer_);
  }

  /* 执行自动刷新 */
  if (conf[urlId] && conf[urlId].timeout) {
    let selectorReady = false;
    if (conf[urlId].selector) {
      ready(conf[urlId].selector, () => {
        selectorReady = true;
      });
    }

    window._autoRefreshTimer_ = setTimeout(async function () {
      if (selectorReady === true) {
        return true
      }

      conf[urlId].refreshCount += 1;
      localStorage.setItem('_autoRefreshConfig_', JSON.stringify(conf));
      window.location.reload();
    }, conf[urlId].timeout);
  }
}

/* 增加自动刷新功能的可视化操作按钮 */
monkeyMenu.on('自动刷新页面', () => {
  let timeout = prompt('设置刷新间隔/单位秒（-1表示取消刷新）', 10);
  timeout = Number(timeout);

  if (Number.isNaN(timeout)) {
    alert('请输入正确的时间间隔');
    return false
  }

  if (timeout >= 0) {
    autoRefresh(timeout * 1000);
  } else {
    autoRefresh(timeout);
  }
});

var autoRefreshMod = {
  autoRefresh: autoRefresh,
  async setup () {
    const win = await getPageWindow();
    win._autoRefresh_ = autoRefresh;

    /* 每个页面都要检查是否需要执行自动刷新逻辑 */
    autoRefresh();
  }
};

/*!
 * @name         showPassword.mod.js
 * @description  显示当前页面密码的模块
 * @version      0.0.1
 * @author       Blaze
 * @date         2020/12/8 11:02
 * @github       https://github.com/xxxily
 */

let hasInit = false;
function init$1 (el) {
  /* 支持直接复制密码域下的密码 */
  el.addEventListener('keydown', event => {
    if (event.ctrlKey && event.keyCode === 67) {
      setTimeout(() => { copyText(event.target.value); }, 100);
    }
  });

  if (hasInit) return
  hasInit = true;

  monkeyMenu.on('查看密码域内容', () => {
    const pwdEls = document.querySelectorAll('input[type="password"]');
    const pwdArr = [];

    pwdEls.forEach(pwdEl => {
      window.prompt('密码域内容：', pwdEl.value);
      copyText(pwdEl.value);
      pwdArr.push({
        el: pwdEl,
        pwd: pwdEl.value
      });
    });

    console.log('当前页面密码信息：', pwdArr);
  });
}

var showPasswordMod = {
  async setup () {
    ready('input[type="password"]', (el) => {
      init$1(el);
    });
  }
};

/*!
 * @name         keepPlayerQuality.mod.js
 * @description  锁定视频播放画质
 * @version      0.0.1
 * @author       Blaze
 * @date         2021/1/5 11:00
 * @github       https://github.com/xxxily
 */
const debug = Debug$1.create('myscript message:');

function keepYoutubeQuality () {
  const youtubeQualitySetting = [
    {
      describe: '2160p 画质',
      value: '2160p'
    },
    {
      describe: '1440p 画质',
      value: '1440p'
    },
    {
      describe: '1080p 画质',
      value: '1080p'
    },
    {
      describe: '720p 画质',
      value: '720p'
    },
    {
      describe: '480p 画质',
      value: '480p'
    },
    {
      describe: 'auto 画质',
      value: 'auto'
    }
  ];

  const customYtpQuality = localStorage.getItem('_ytpQuality_');

  youtubeQualitySetting.forEach(item => {
    let menuText = '[YouTube] ' + item.describe;
    if (customYtpQuality && customYtpQuality === item.value) {
      menuText += ' [ √ ]';
    }

    /* 生产指定画质菜单 */
    monkeyMenu.on(menuText, () => {
      localStorage.setItem('_ytpQuality_', item.value);

      setTimeout(() => {
        location.reload();
      }, 1000 * 1);
    });
  });

  ready(['#player-container .ytp-settings-menu'], element => {
    /* 通过模拟操作获取或设置视频画质 */
    function ytpQuality (quality, fallback) {
      let hasSetQuality = false;
      const qualityResult = [];
      const settingsMenu = document.querySelector('#player-container .ytp-settings-menu');
      const settingsBtn = document.querySelector('#player-container .ytp-settings-button');
      if (settingsMenu) {
        if (settingsMenu.style.display === 'none') {
          settingsMenu.style.opacity = 0;
          settingsBtn.click();
        }

        const menuitem = settingsMenu.querySelectorAll('.ytp-panel-menu .ytp-menuitem');
        /* 选中最后一项 */
        menuitem[menuitem.length - 1].click();

        const qualityMenuitem = settingsMenu.querySelectorAll('.ytp-quality-menu .ytp-panel-menu .ytp-menuitem');
        qualityMenuitem.forEach(el => {
          const txt = el.innerText;
          if (quality && txt.toLowerCase().startsWith(quality)) {
            el.click();
            debug.log('已设置视频画质：' + txt);
            hasSetQuality = true;
          }
          const checked = Boolean(el.getAttribute('aria-checked')) || false;
          qualityResult.push({
            quality: txt,
            checked,
            el
          });
        });

        /* 如果指定了画质，但是未被设置，说明没法命中指定画质，这时则指定当前可用的最优画质 */
        if (quality && !hasSetQuality && fallback) {
          const qNum = Number(quality.toLowerCase().split('p')[0]);

          if (qNum) {
            /* 找出比当前指定画质小的元素 */
            let tmpArr = [];
            const tmpObj = { };
            qualityResult.forEach(item => {
              const curQNum = Number(item.quality.toLowerCase().split('p')[0]);
              if (curQNum < qNum) {
                tmpArr.push(curQNum);
                tmpObj[curQNum] = item;
              }
            });
            tmpArr = quickSort(tmpArr);

            /* 设置符合当前条件下的最优画质 */
            const tagItem = tmpObj[tmpArr[tmpArr.length - 1]];
            if (tagItem && tagItem.el) {
              tagItem.el.click();
              hasSetQuality = true;
              debug.log('已设置视频画质：' + tagItem.quality);
            }
            // debug.log('---------------：', tmpArr, tmpObj, tagItem)
          }
        }

        /* 关闭设置面板 */
        setTimeout(function () {
          if (settingsMenu.style.display !== 'none') {
            settingsBtn.click();
          }
          setTimeout(function () {
            settingsMenu.style.opacity = 1;
          }, 600);
        }, 0);
      }

      if (settingsBtn && !qualityResult.length) {
        console.error('未获取到当前视频页面的画质信息');
      }

      return qualityResult
    }

    /* 自动记录选定的播放画质 */
    // setInterval(() => {
    //   saveCurYtpQuality()
    // }, 1000 * 5)

    function setYtpQualityByLocalStorageVal () {
      const customYtpQuality = localStorage.getItem('_ytpQuality_');
      if (customYtpQuality && customYtpQuality !== 'auto') {
        const quality = customYtpQuality.toLowerCase().split('p')[0] + 'p';
        ytpQuality(quality, true);
      }
    }

    setYtpQualityByLocalStorageVal();

    /* 视频地址发生改变时重新执行画质设置逻辑 */
    let pageUrl = location.href;
    attrObserver(['#player-container video'], () => {
      if (pageUrl !== location.href) {
        pageUrl = location.href;
        setYtpQualityByLocalStorageVal();
      }
    }, ['src']);
  });
}

const taskConf$1 = {
  match: [
    'youtube.com'
  ],
  describe: '记住播放画质',
  run: function () {
    /* 目前只适配了油管 */
    keepYoutubeQuality();
  }
};

var keepPlayerQualityMod = {
  setup (addTaskMap) {
    addTaskMap(taskConf$1);
  }
};

/*!
 * @name         superparse.mod.js
 * @description  在线视频下载解析
 * @version      0.0.1
 * @author       Blaze
 * @date         2021/1/5 9:59
 * @github       https://github.com/xxxily
 */

const taskConf = {
  match: [
    'superparse.com'
  ],
  describe: '解析视频下载地址',
  run: function () {
    const urlInfo = parseURL(window.top.location.href);
    if (!urlInfo.params.url) {
      return false
    }

    ready('input.form-control', function (el) {
      el.value = decodeURIComponent(urlInfo.params.url);
      document.querySelector('.input-group-btn button').click();
    });
  }
};

function addParseBtn () {
  if (location.host === 'superparse.com') {
    return false
  }

  // const supportHost = [
  //   'twitter.com',
  //   'youtube.com'
  // ]

  monkeyMenu.on('使用superparse解析视频地址', () => {
    const url = encodeURIComponent(window.top.location.href);
    if (window.GM_openInTab) {
      window.GM_openInTab('https://superparse.com/zh?url=' + url, true);
    }
  });
}

var superparseMod = {
  setup (addTaskMap) {
    addTaskMap(taskConf);
    addParseBtn();
  }
};

const modList = [
  autoRefreshMod,
  showPasswordMod,
  keepPlayerQualityMod,
  // searchEnhanceMod,
  superparseMod
];

/*!
 * @name         waterMarkEraser.js
 * @description  水印清除工具
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/25 14:03
 * @github       https://github.com/xxxily
 */

function hasWaterMarkFeature (el) {
  if (!el) {
    return false
  }

  let result = false;

  if (el.className && typeof el.className === 'string') {
    const className = el.className.toLowerCase().replace(/[-_]/g, '');
    if (className.indexOf('watermark') > -1) {
      result = true;
    }
  } else if (el.id && typeof el.id === 'string') {
    if (el.id.toLowerCase().indexOf('watermark') > -1) {
      result = true;
    }
  }

  // 进一步确认是否符合水印特征
  if (result) {
    const style = window.getComputedStyle(el);

    if (style.pointerEvents !== 'none') {
      result = false;
    }

    /* 通过判断是否存在众多设置为pointerEvents的元素来进一步确认其子节点是否存在水印特征 */
    const childNodes = el.querySelectorAll('*');
    let hasPointerEventsElCount = 0;

    if (childNodes.length > 20) {
      childNodes.forEach(child => {
        const style = window.getComputedStyle(child);
        if (style.pointerEvents === 'none') {
          hasPointerEventsElCount++;
        }
      });

      if (hasPointerEventsElCount > childNodes.length * 0.7) {
        result = true;
      }
    }

    if (!result) {
      console.log('[waterMarkEraser]', '发现watermark的相关标签，但未匹配已定义的水印特征', el);
    }
  }

  return result
}

function waterMarkEraser (shadowRoot) {
  const mObserver = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (hasWaterMarkFeature(node)) {
            setTimeout(() => { node.style.display = 'none'; }, 0);

            /* 延迟再次隐藏，防止水印被重新显示 */
            setTimeout(() => { node.style.display = 'none'; }, 1200);

            console.log('[waterMarkEraser]', node);
          }
        });
      }
    });
  });

  const docRoot = shadowRoot || window.document.documentElement;
  mObserver.observe(docRoot, {
    childList: true,
    subtree: true
  });
}

/*!
 * @name         debuggerEraser.js
 * @description  移除反调试的debugger字符串，让网站可正常启动调试工具
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/08/10 14:03
 * @github       https://github.com/xxxily
 */

/* eslint-disable no-eval */
window.__rawFunction__ = Function.prototype.constructor;
window.__rawEval__ = window.eval;

/**
 * 实现原理是对构建注入debugger匿名函数的文本进行检查，如果存在则对其进行移除
 * 相关文章：
 * [突破前端反调试--阻止页面不断debugger](https://segmentfault.com/a/1190000012359015)
 * [js检测开发者工具Devtools是否打开防调试](https://www.jianshu.com/p/82c70259364b)
 */
function registerDebuggerEraser (global, globalConfig = {}) {
  global = global || window;
  global.__rawFunction__ = global.__rawFunction__ || Function.prototype.constructor;
  global.__rawEval__ = global.__rawEval__ || global.eval;

  function hasDebuggerFeature (code) {
    return typeof code === 'string' && code.indexOf('debugger') > -1
  }

  const proxyHandler = {
    apply (target, ctx, args) {
      const code = args[0];
      if (hasDebuggerFeature(code)) {
        // console.warn('存在疑似的反调试代码，已对该代码进行屏蔽：', code)
        // args[0] = args[0].replace(/debugger/g, '')

        /* 抛出异常可以终止后续的代码执行，如果是循环检测，则可以终止掉循环 */
        args[0] = args[0].replace(/debugger/g, ';throw new Error();');
      }

      /* 保存运行的字符串代码记录，以便查看都运行了哪些字符串代码 */
      if (global._debugMode_) {
        global.__eval_code_list__ = global.__eval_code_list__ || [];
        if (global.__eval_code_list__.length < 500) {
          if (code && code.length > 3 && code.indexOf('debugger') === -1) {
            global.__eval_code_list__.push(code);
          }
        }

        /* 达到一定量时主动输出到控制台，以便查看 */
        if (global.__eval_code_list__.length === 100) {
          setTimeout(() => {
            console.warn(`[debuggerEraser][__eval_code_list__]${global.location.href}`, global.__eval_code_list__);
          }, 1500);
        }
      }

      /* getPageWindowSync标识 */
      if (code.indexOf('getPageWindowSync=1') > -1) {
        return Reflect.apply(...arguments)
      }

      let evalResult = null;

      try {
        evalResult = Reflect.apply(...arguments);
      } catch (e) {
        global.__debuggerEraserErrorCount__ = global.__debuggerEraserErrorCount__ || 1;
        global.__debuggerEraserErrorCount__++;

        if (global.__debuggerEraserErrorCount__ > 50) {
          global.__debuggerEraserErrorCount__ === 51 && console.error(`[debuggerEraser][${target.name}][error]`, '异常次数过多，不再输出相关错误', e);
        } else {
          if (target.name === 'eval') {
            console.error(`[debuggerEraser][${target.name}][error]`, '\n代理后eval只能获取到全局作用域，而要执行的代码字符串里却包含了局部作用域的变量，如果抛出了这个异常，基本都是这个原因。 \n参见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval \n', ...arguments, code, e);
          } else {
            console.error(`[debuggerEraser][${target.name}][error]`, ...arguments, code, e);
          }
        }
      }

      if (evalResult instanceof global.__rawFunction__) {
        evalResult = new Proxy(evalResult, {
          apply (target, ctx, args) {
            // TODO 对返回结果进行干预
            const evalExecResult = Reflect.apply(...arguments);

            /* 判断是否正在尝试通过eval、Function获取全新的window对象 */
            if (evalExecResult && evalExecResult.document && evalExecResult.setInterval) ;

            return evalExecResult
          }
        });
      }

      return evalResult
    }
  };

  const FunctionProxy = new Proxy(global.__rawFunction__, proxyHandler);
  global.Function = FunctionProxy;
  global.Function.prototype.constructor = FunctionProxy;

  /**
   * 直接调用eval能获取到局部作用域中的变量，而通过代理后的eval将变成间接调用，此时只能获取全局作用域中的变量
   * 这个特性导致了对eval进行代理，容易出现执行异常，导致网页运行异常
   * 具体说明参见下述文档：
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
   */
  const evalProxy = new Proxy(global.__rawEval__, proxyHandler);
  global.eval = evalProxy;

  /* 尝试自动代理真实页面window对象下的相关方法属性 */
  try {
    const pageWin = getPageWindowSync(window.__rawFunction__);
    if (pageWin && global !== pageWin && !pageWin.__rawFunction__) {
      registerDebuggerEraser(pageWin);
    }
  } catch (e) {
    console.error('[debuggerEraser][registerDebuggerEraser]', e);
  }
}

/*!
 * @name         timerManager.js
 * @description  setInterval和setTimeout的时间管理器
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/08/12 10:35
 * @github       https://github.com/xxxily
 */
window.__rawSetInterval__ = window.setInterval;
window.__rawSetTimeout__ = window.setTimeout;
window.__rawClearInterval__ = window.clearInterval;
window.__rawClearTimeout__ = window.clearTimeout;

function registerTimerManager (global, config) {
  global = global || window;
  global.__rawSetInterval__ = global.__rawSetInterval__ || global.setInterval;
  global.__rawSetTimeout__ = global.__rawSetTimeout__ || global.setTimeout;
  global.__rawClearInterval__ = global.__rawClearInterval__ || global.clearInterval;
  global.__rawClearTimeout__ = global.__rawClearTimeout__ || global.clearTimeout;
  global.__timerState__ = global.__timerState__ || {};

  config = Object.assign({
    keepTimerState: false,
    blockAll: false,
    blockLongTask: false,
    rate: 1
  }, config || {});

  const timerProxyHandler = {
    apply (target, ctx, args) {
      const timerFunc = args[0];

      const timerState = {
        id: null,
        func: timerFunc,
        delay: args[1],
        execInfo: {
          count: 0,
          duration: [],
          /* 最近一次的执行时间 */
          lastTime: 0
        }
      };

      const timerFuncProxy = new Proxy(timerFunc, {
        apply (timerFuncTarget, timerFuncCtx, timerFuncArgs) {
          /* 判断是否需要停止运行 */
          const lastDuration = timerState.execInfo.duration[timerState.execInfo.duration.length - 1];
          if (lastDuration && lastDuration > 150 && config.blockLongTask) {
            // !timerState.blocked && console.warn('[timerManager]该函数执行时间过长，已被终止运行', timerState)
            console.warn('[timerManager]该函数执行时间过长，已被终止运行', timerState);
            timerState.blocked = true;
            return false
          } else if (config.blockAll === true) {
            !timerState.blocked && console.warn('[timerManager][blockAll]', timerState);
            timerState.blocked = true;
            return false
          }

          timerState.execInfo.lastTime = Date.now();
          timerState.execInfo.count++;

          const startTime = Date.now();
          const execResult = Reflect.apply(...arguments);

          /* 保存最近100次的执行时长统计 */
          const duration = Date.now() - startTime;
          timerState.execInfo.duration.push(duration);
          if (timerState.execInfo.duration.length > 100) {
            timerState.execInfo.duration.shift();
          }

          /* 对执行时间过长的函数进行提示 */
          if (global._debugMode_ && duration > 50) {
            console.warn(`[timerManager]存在执行时间过长的Timer：${duration}ms`, timerState);
          }

          // console.info('[timerManager][exec]', timerState)

          return execResult
        }
      });

      /* 代理原来要执行的函数 */
      args[0] = timerFuncProxy;
      /* 按配置的时间比率设定计时器间隔 */
      args[1] = config.rate * args[1];

      const timerId = Reflect.apply(...arguments);
      timerState.id = timerId;
      global.__timerState__[timerId] = timerState;

      // console.log('[timerManager][create]', timerState)

      return timerId
    }
  };

  const clearTimerProxyHandler = {
    apply (target, ctx, args) {
      const timerId = args[0];
      const timerState = global.__timerState__[timerId];
      if (timerState) {
        if (config.keepTimerState) {
          /* 只是标注已被清除，但并不真正删除定时间注册的相关信息，以便进行观察，注意这样会导致内存不断堆积 */
          timerState.hasClear = true;
        } else {
          /* 移除timer的所有信息 */
          delete global.__timerState__[timerId];
        }
      }

      return Reflect.apply(...arguments)
    }
  };

  global.setInterval = new Proxy(global.__rawSetInterval__, timerProxyHandler);
  global.setTimeout = new Proxy(global.__rawSetTimeout__, timerProxyHandler);
  global.clearInterval = new Proxy(global.__rawClearInterval__, clearTimerProxyHandler);
  global.clearTimeout = new Proxy(global.__rawClearTimeout__, clearTimerProxyHandler);

  /* 尝试自动代理真实页面window对象下的相关方法属性 */
  try {
    const pageWin = getPageWindowSync();
    if (pageWin && global !== pageWin && !pageWin.__rawSetInterval__) {
      registerTimerManager(pageWin, config);
    }
  } catch (e) {
    console.error('[timerManager][registerTimerManager]', e);
  }
}

/*!
 * @name         consoleManager.js
 * @description  控制台管理器，解决console被屏蔽的问题
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/08/15 16:55
 * @github       https://github.com/xxxily
 */

function registerConsoleManager (global) {
  try {
    global = global || getPageWindowSync();
    global.__rawConsole__ = global.__rawConsole__ || global.console;

    function consoleMethodProxy (key) {
      global.__rawConsole__[`__raw${key}__`] = global.__rawConsole__[key];
      global.__rawConsole__[key] = new Proxy(global.__rawConsole__[key], {
        apply (target, ctx, args) {
          const rewriter = global.__rawConsole__.__rewriter__ || {};

          /* 执行重写函数 */
          if (rewriter[key] instanceof Function) {
            /**
             * TODO: https://www.magiceraser.io/ 网址执行重写函数会导致死循环错误
             * 待优化
             */
            // rewriter[key].apply(ctx, args)
          }

          /* 禁止clear的调用 */
          if (key === 'clear') {
            return true
          }

          return Reflect.apply(target, ctx, args)
        }
      });
    }

    Object.keys(global.__rawConsole__).forEach(key => {
      if (global.__rawConsole__[key] instanceof Function) {
        consoleMethodProxy(key);
      }
    });

    global.console = new Proxy(global.__rawConsole__, {
      set (target, key, value) {
        if (value instanceof Function && key !== '__rewriter__') {
          global.__rawConsole__.warn('[consoleManager][detect the rewrite operation]', key, value);
          global.__rawConsole__.__rewriter__ = global.__rawConsole__.__rewriter__ || {};
          global.__rawConsole__.__rewriter__[key] = value;

          /**
           * 禁止重写，必须返回true，否则在严格模式下会如下类型的错误：
           * Uncaught TypeError: 'set' on proxy: trap returned falsish for property 'xxx'
           */
          return true
        }

        // return Reflect.set(target, key, value)
      }
    });

    console.info('[consoleManager][register suc]', global.console);
  } catch (e) {
    console.error('[consoleManager]', e);
  }
}

function downloadJsonFile (fileName, json) {
  const content = JSON.stringify(json);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function initEruda () {
  if (!window.eruda) {
    loadScript('https://cdn.jsdelivr.net/npm/eruda@2.5.0/eruda.min.js', () => {
      if (window.eruda) {
        window.eruda.init();
      } else {
        debug$1.error('eruda init failed');
      }
    });
  } else {
    window.eruda.init();
  }
}

function initVconsole () {
  if (!window.VConsole) {
    loadScript('https://cdn.jsdelivr.net/npm/vconsole@3.14.6/dist/vconsole.min.js', () => {
      if (window.VConsole) {
        // eslint-disable-next-line no-new
        new window.VConsole();
      } else {
        debug$1.error('vconsole init failed');
      }
    });
  } else {
    // eslint-disable-next-line no-new
    new window.VConsole();
  }
}

/* 弱化元素的显示 */
function elementWeakened (el) {
  if (!el || !el.style) return

  el.style.opacity = 0.1;

  el.addEventListener('mouseenter', function () {
    el.style.opacity = 0.8;
  });

  el.addEventListener('mouseleave', function () {
    el.style.opacity = 0.1;
  });
}

/**
 * 任务队列
 * @type {[*]}
 */
const taskList = [
  {
    match: 'meta.appinn.net',
    describe: '小众软件体验优化',
    run: function () {
      ready('section#d-splash', function (element) {
        element.remove();
      });
    }
  },
  {
    match: 'inux.do',
    describe: 'inux.do体验优化',
    run: function () {
      ready('section#d-splash', function (element) {
        element.remove();
      });
    }
  },
  {
    match: 'douyin.com',
    describe: '抖音网页版体验优化',
    run: function () {

      /* 跳过标识为广告的视频 */
      function skipAdVideo (videoWrapEl, live) {
        const nextBtn = document.querySelector('div[data-e2e="video-switch-next-arrow"]');

        if (!nextBtn || (nextBtn && nextBtn.lastSkipTime && Date.now() - nextBtn.lastSkipTime < 600)) {
          return
        }

        const videoDescEl = videoWrapEl.querySelector('div.title[data-e2e="video-desc"]');

        if (videoDescEl && videoDescEl.innerText.endsWith('广告')) {
          nextBtn.click();
          nextBtn.lastSkipTime = Date.now();
        }

        if (live && videoWrapEl && videoWrapEl.innerText.includes('广告')) {
          nextBtn.click();
          nextBtn.lastSkipTime = Date.now();
        }
      }

      /* 使用MutationObserver监听如果发现#slidelist元素的子元素，或子元素属性发生变化，就执行回调函数 */
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            /* 视频处理 */
            const activeItem = document.querySelector('#slidelist div[data-e2e="feed-active-video"]');
            if (activeItem) {
              setTimeout(() => {
                skipAdVideo(activeItem);
                // setVideoTitle(activeItem)
              }, 100);
            }

            /* 直播处理 */
            const liveItem = document.querySelector('#slidelist div[data-e2e="feed-live"]>a');
            if (liveItem) {
              skipAdVideo(liveItem.parentNode, true);
            }
          }
        });
      });

      ready('#slidelist', function (element) {
        observer.observe(document.querySelector('#slidelist'), {
          attributes: true,
          childList: true,
          subtree: true
        });
      });

      ready('#videoSideBar .recommend-comment-login-mask', function (element) {
        element.style.display = 'none';
      });
    }
  },
  // {
  //   match: 'youtube.com',
  //   describe: '自动跳过youtube广告',
  //   run: function () {
  //     const startTime = new Date().getTime()

  //     const skipHandler = (element) => {
  //       const endTime = new Date().getTime()
  //       const time = endTime - startTime
  //       /* 过早触发会导致广告无法跳过 */
  //       if (time < 3000) {
  //         return false
  //       }

  //       /* 页面处于不可见状态时候也不触发 */
  //       if (document.hidden) {
  //         return false
  //       }

  //       element.click()
  //     }

  //     ready('.ytp-ad-skip-button', function (element) {
  //       skipHandler(element)
  //     })

  //     ready('.ytp-ad-skip-button-modern', function (element) {
  //       skipHandler(element)
  //     })
  //   }
  // },
  // {
  //   match: 'youtube.com',
  //   describe: '自动跳过开启广告展示的弹窗提醒',
  //   run: function () {
  //     ready('tp-yt-paper-dialog.ytd-popup-container', function (element) {
  //       if (element.innerText.includes('广告拦截')) {
  //         element.parentNode.removeChild(element)
  //       }
  //     })

  //     setInterval(function () {
  //       document.querySelectorAll('tp-yt-paper-dialog.ytd-popup-container').forEach(function (element) {
  //         if (element.innerText.includes('广告拦截')) {
  //           element.parentNode.removeChild(element)
  //         }
  //       })
  //     }, 600)
  //   }
  // },
  {
    match: 'youtube.com',
    describe: '隐藏油管Logo',
    run: function () {
      ready('#logo', function (element) {
        elementWeakened(element);
      });
    }
  },

  {
    match: 'google.com',
    describe: 'Google优化',
    run: function () {
      ready('img[alt=Google]', function (element) {
        elementWeakened(element);
      });

      ready('div.logo', function (element) {
        if (element.querySelector('img[alt=Google]')) {
          elementWeakened(element);
        }
      });
    }
  },

  {
    match: 'wenxuecity.com',
    describe: '忽略文学城弹框',
    run: function () {
      ready('.wxc-ab-root', function (element) {
        element.parentNode.removeChild(element);
        setInterval(function () {
          document.body.style.position = 'inherit';
        }, 120);
      });
    }
  },

  {
    match: 'baidu.com',
    describe: '过滤百度搜索结构的广告',
    disable: true,
    run: function () {
      function delBaiduAd () {
        const resultDom = document.querySelectorAll('#content_left>div');
        console.clear();
        console.log('百度广告过滤', resultDom);
        for (let i = 0; i < resultDom.length; i++) {
          const className = resultDom[i].className;
          if (!/result/.test(className)) {
            resultDom[i].remove();
          }
        }
      }

      delBaiduAd();
      setTimeout(function () {
        delBaiduAd();
      }, 1500);
    }
  },

  {
    match: 'btdx8.com',
    describe: '自动下载比特大雄的bt文件，减少人工点击次数',
    run: function () {
      // 种子文件介绍页
      if (/torrent/.test(window.location.href)) {
        const aimDom = document.querySelectorAll('#zdownload a');
        if (!aimDom || aimDom.length === 0) {
          console.error('当前页面没匹配到种子结果！');
          return false
        }
        if (aimDom.length > 1) {
          for (let i = 0; i < aimDom.length; i++) {
            aimDom[i].click();
          }
        } else {
          // 设置当前页面打开
          aimDom[0].setAttribute('target', '_self');
          aimDom[0].click();
        }
      }

      // 种子文件下载页
      if (/down\.php/.test(window.location.href)) {
        const aimDom = document.querySelectorAll('#down_verify_box .btn-orange');
        if (aimDom && aimDom.length === 1) {
          aimDom[0].click();
          const timeOut = setInterval(function () {
            const downA1 = document.getElementById('downA1');
            if (downA1) {
              const link = downA1.href.trim();
              if (link && link !== 'javascript:;') {
                downA1.setAttribute('target', '_self');
                downA1.click();
                clearTimeout(timeOut);
                setTimeout(function () {
                  window.top.close();
                }, 400);
              }
            }
          }, 550);
        }
      }
    }
  },

  {
    match: [
      'jianshu.com',
      'zhihu.com'
    ],
    describe: '去掉地址跳转被中转拦截',
    run: function () {
      ready('a', function (element) {
        const url = element.href;
        const splitStrArr = [
          'links.jianshu.com/go?to=',
          'link.zhihu.com/?target='
        ];

        for (let i = 0; i < splitStrArr.length; i++) {
          const splitStr = splitStrArr[i];
          if (url.includes(splitStr)) {
            const realUrl = decodeURIComponent(url.split(splitStr)[1]);
            element.href = realUrl;
            break
          }
        }
      });
    }
  },

  {
    match: [
      'blog.csdn.net',
      'zhihu.com'
    ],
    describe: '关闭烦人的登录弹窗',
    run: function () {
      ready(['.login-mark', 'div.Modal-backdrop'], element => {
        element.click();
        debug$1.log('检测到烦人的登录提示弹框，已主动为你关闭，如果又误关闭，请提醒作者优化脚本逻辑，或关掉该脚本');
      });
    }
  },

  {
    match: [
      'lanhuapp.com'
    ],
    describe: '解决蓝湖按键误触问题',
    run: function () {
      window.addEventListener('keyup', (event) => {
        console.log('stop keyup event', event);
        if (event.ctrlKey && event.key === 'ArrowRight') {
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false
        }
      }, true);
    }
  },

  {
    match: 'icloudnative.io',
    describe: 'icloudnative体验优化',
    run: function () {
      ready('.wrapper__left .join-us', function (element) {
        element.style.display = 'none';
      });
    }
  },

  {
    match: 'hi-linux.com',
    describe: 'Linux世界阅读体验优化',
    run: function () {
      ready('#vip-container', function (element) {
        setTimeout(() => {
          element.style.height = '100%';
          const readMore = element.querySelector('#read-more-wrap');
          readMore && (readMore.style.visibility = 'hidden');
        }, 1000);
      });
    }
  },

  {
    match: 'yiyan.baidu.com',
    describe: '文心去水印',
    run: function () {
      ready('#root', function (element) {
        // alert('文心去水印');
        setTimeout(() => {
          element.style.zIndex = '99999999999';
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.left = '0';
          element.style.width = '100%';
          element.style.height = '100%';
          element.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        }, 1000);
      });
    }
  },

  {
    match: 'processon.com',
    describe: 'ProcessOn模版下载',
    run: function () {
      async function downloadPos () {
        /* 发起get请求 */
        const id = location.pathname.replace('/view/', '');
        const url = `https://www.processon.com/api/personal/diagraming/getdef?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();
        const elements = JSON.parse(data.data.def);

        const posJson = {
          diagram: {
            elements
          },
          meta: {
            exportTime: '',
            member: '',
            diagramInfo: {
              creator: '',
              created: '',
              modified: '',
              title: elements.title,
              category: 'mind_free'
            },
            id: '',
            type: 'ProcessOn Schema File',
            version: '1.0'
          }
        };

        console.log(`[diagraming.pos][${elements.title}]`, posJson);
        downloadJsonFile(`${elements.title}.pos`, posJson);
        // alert('请在控制台查看数据')
      }

      if (location.href.includes('processon.com/view/')) {
        ready('.main-content .file_head_right', function (element) {
          const downBtn = document.createElement('button');
          downBtn.className = 'button file_head_right_item';
          downBtn.innerText = '下载POS文件';
          downBtn.addEventListener('click', downloadPos);
          element.appendChild(downBtn);
        });
      }
    }
  }
];

/*!
 * @name         menuManager.js
 * @description  菜单管理器
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/08/11 10:05
 * @github       https://github.com/xxxily
 */

function refreshPage (msg) {
  debug$1.log('[config]', JSON.stringify(config, null, 2));

  msg = msg || '配置已更改，马上刷新页面让配置生效？';
  const status = confirm(msg);
  if (status) {
    window.location.reload();
  }
}

let monkeyMenuList = [
  {
    title: '还原默认配置',
    fn: () => {
      localStorage.removeItem('_myscriptConfig_');
      refreshPage();
    }
  },
  {
    title: config.enhanceTools.waterMarkEraser ? '关闭waterMarkEraser' : '开启waterMarkEraser',
    fn: () => {
      config.enhanceTools.waterMarkEraser = !config.enhanceTools.waterMarkEraser;
      refreshPage();
    }
  },
  {
    title: config.debugTools.debuggerEraser ? '关闭debuggerEraser' : '开启debuggerEraser',
    fn: () => {
      config.debugTools.debuggerEraser = !config.debugTools.debuggerEraser;
      refreshPage();
    }
  },
  {
    title: config.debugTools.consoleProxy ? '关闭consoleProxy' : '开启consoleProxy',
    fn: () => {
      config.debugTools.consoleProxy = !config.debugTools.consoleProxy;
      refreshPage();
    }
  },
  {
    title: config.debugTools.timerManager.enabled ? '关闭timerManager' : '开启timerManager',
    fn: () => {
      config.debugTools.timerManager.enabled = !config.debugTools.timerManager.enabled;
      refreshPage();
    }
  },
  {
    title: config.debugTools.eruda ? '关闭eruda' : '开启eruda',
    fn: () => {
      config.debugTools.eruda = !config.debugTools.eruda;
      refreshPage();
    }
  },
  {
    title: config.debugTools.vconsole ? '关闭vconsole' : '开启vconsole',
    fn: () => {
      config.debugTools.vconsole = !config.debugTools.vconsole;
      refreshPage();
    }
  },
  {
    title: config.debugTools.debugModeTag ? '关闭【调试模式】标识' : '开启【调试模式】标识',
    fn: () => {
      config.debugTools.debugModeTag = !config.debugTools.debugModeTag;
      refreshPage();
    }
  }
];

/* 菜单构造函数（必须是函数才能在点击后动态更新菜单状态） */
function menuBuilder () {
  return monkeyMenuList
}

/* 注册动态菜单 */
function menuRegister () {
  monkeyMenu.build(menuBuilder);
}

/**
 * 增加菜单项
 * @param {Object|Array} menuOpts 菜单的配置项目，多个配置项目用数组表示
 */
function addMenu (menuOpts) {
  menuOpts = Array.isArray(menuOpts) ? menuOpts : [menuOpts];
  menuOpts = menuOpts.filter(item => item.title && !item.disabled);
  monkeyMenuList = monkeyMenuList.concat(menuOpts);

  console.log('[monkeyMenuList]', monkeyMenuList);

  /* 重新注册菜单 */
  menuRegister();
}

/* 用于获取全局唯一的id */
function getId () {
  let gID = window.GM_getValue('_global_id_');
  if (!gID) gID = 0;
  gID = Number(gID) + 1;
  window.GM_setValue('_global_id_', gID);
  return gID
}

/**
 * 获取当前TAB标签的Id号，可用于iframe确定自己是否处于同一TAB标签下
 * @returns {Promise<any>}
 */
function getTabId () {
  return new Promise((resolve, reject) => {
    window.GM_getTab(function (obj) {
      if (!obj.tabId) {
        obj.tabId = getId();
        window.GM_saveTab(obj);
      }
      resolve(obj.tabId);
    });
  })
}

/* 一开始就初始化好curTabId，这样后续就不需要异步获取Tabid，部分场景下需要用到 */
getTabId();

var blacklist = {
  urls: [],
  domains: [
    'challenges.cloudflare.com'
  ]
};

/* 劫持localStorage.setItem 方法，增加修改监听功能 */
const orignalLocalStorageSetItem = localStorage.setItem;
localStorage.setItem = function (key, newValue) {
  const setItemEvent = new Event('localStorageSetItemEvent');
  setItemEvent.newValue = newValue;
  setItemEvent.keyName = key;
  window.dispatchEvent(setItemEvent);

  /* 尝试对json对象进行兼容 */
  if (Object.prototype.toString.call(newValue) === '[object Object]') {
    try {
      newValue = JSON.stringify(newValue);
      arguments[1] = newValue;
    } catch (e) {
      console.error(e);
    }
  }

  orignalLocalStorageSetItem.apply(this, arguments);
};

/**
 * 匹配某个URL字段，然后运行对应的callback
 * @param matchItem (String|Array) -必选 要匹配的url字符串
 * @param callback (Function) -必选 要处理的回调方法
 */
function matchAndRun (matchItem, callback, conf) {
  conf = conf || {};

  if (typeof matchItem === 'undefined' || typeof callback !== 'function') {
    console.log('传入的参数不正确');
    return false
  }

  if (conf.disable) {
    return false
  }

  let hasMatchItem = false;
  matchItem = Array.isArray(matchItem) ? matchItem : [matchItem];
  matchItem.forEach((matchStr) => {
    const regEx = new RegExp(matchStr, 'i');
    if (regEx.test(window.location.href)) {
      hasMatchItem = true;
      callback(matchStr, conf);
      if (window !== top) {
        debug$1.log(`个人脚本规则在ifram里生效：${conf.describe || ''}`, conf);
      } else {
        debug$1.log(`个人脚本规则生效：${conf.describe || ''}`, conf);
      }
    }
  });

  if (hasMatchItem) {
    addMenu({
      title: conf.describe || 'no describe',
      disable: conf.disable || false,
      fn: () => {
        alert('当前匹配规则：\n' + JSON.stringify(conf.match, null, 2));
      }
    });
  }
}

/* 添加任务配置到TaskMap */
function addTaskMap (taskConfList) {
  taskConfList = Array.isArray(taskConfList) ? taskConfList : [taskConfList];
  taskConfList.forEach(taskConf => {
    if (isObj(taskConf) && taskConf.match && isFunction(taskConf.run)) {
      taskList.push(taskConf);
    }
  });
}

function runTaskMap (taskMap) {
  if (!taskMap || taskMap.length === 0) {
    console.log('没有要执行的任务队列！');
    return false
  }

  // 递归处理任务队列
  const taskLen = taskMap.length;
  for (let i = 0; i < taskLen; i++) {
    const item = taskMap[i];
    if (!item.disable) {
      matchAndRun(item.match, item.run, item);
    }
  }
}

function moduleSetup (mods) {
  if (!mods) return false

  mods = Array.isArray(mods) ? mods : [mods];
  mods.forEach(modItem => {
    if (modItem && isFunction(modItem.setup)) {
      if (modItem._isSetup_) return false

      modItem.setup(addTaskMap);
      modItem._isSetup_ = true;
    } else {
      debug$1.error('模块安装失败！', modItem);
    }
  });
}

/* 判断当前页面或当前域名是否在黑名单中 */
function isInBlacklist () {
  const currentUrl = window.location.href;
  const currentDomain = window.location.hostname;
  const isInBlacklist = blacklist.urls.includes(currentUrl) || blacklist.domains.includes(currentDomain);
  return isInBlacklist
}

/**
 * 脚本入口
 */
async function init (retryCount = 0) {
  if (isInBlacklist()) {
    console.warn('当前页面在黑名单中，不执行脚本！');
    return false
  }

  if (!window.document.documentElement) {
    setTimeout(() => {
      if (retryCount < 200) {
        init(retryCount + 1);
      } else {
        console.error('[myscript message:]', 'not documentElement detected!', window);
      }
    }, 10);

    return false
  } else if (retryCount > 0) {
    console.warn('[myscript message:]', 'documentElement detected!', retryCount, window);
  }

  /* 如果域名是yiyan.baidu.com，则强制开启eruda和debuggerEraser */
  matchAndRun('yiyan.baidu.com', (matchStr, conf) => {
    config.debugTools.eruda = true;
    config.debugTools.debuggerEraser = true;
  });

  /* 开启相关辅组插件 */
  config.debugTools.debugModeTag && setDebugMode();
  config.debugTools.consoleProxy && registerConsoleManager();
  config.debugTools.timerManager.enabled && registerTimerManager(window, config.debugTools.timerManager);
  config.enhanceTools.waterMarkEraser && waterMarkEraser();

  config.debugTools.debuggerEraser && registerDebuggerEraser(window, config);

  config.debugTools.eruda && initEruda();
  config.debugTools.vconsole && initVconsole();

  /* 注册菜单 */
  menuRegister();

  /* 注册相关模块 */
  moduleSetup(modList);

  /* 运行任务队列 */
  runTaskMap(taskList);

  debug$1.log(`[${location.href}]`, window, await getTabId());
  debug$1.log('init success, current config:', JSON.parse(JSON.stringify(config)));
}
init();
