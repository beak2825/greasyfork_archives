// ==UserScript==
// @name         vue-debug-helper
// @name:en      vue-debug-helper
// @name:zh      Vue调试分析助手
// @name:zh-TW   Vue調試分析助手
// @name:ja      Vueデバッグ分析アシスタント
// @namespace    https://github.com/xxxily/vue-debug-helper
// @homepage     https://github.com/xxxily/vue-debug-helper
// @version      0.0.22
// @description  Vue components debug helper
// @description:en  Vue components debug helper
// @description:zh  Vue组件探测、统计、分析辅助脚本
// @description:zh-TW  Vue組件探測、統計、分析輔助腳本
// @description:ja  Vueコンポーネントの検出、統計、分析補助スクリプト
// @author       ankvps
// @icon         https://cdn.jsdelivr.net/gh/xxxily/vue-debug-helper@main/logo.png
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// @grant        GM_getResourceText
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
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/core.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/md5.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-contextmenu@2.9.2/dist/jquery.contextMenu.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-contextmenu@2.9.2/dist/jquery.ui.position.min.js
// @resource     contextMenuCss https://cdn.jsdelivr.net/npm/jquery-contextmenu@2.9.2/dist/jquery.contextMenu.min.css
// @run-at       document-start
// @connect      127.0.0.1
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/444075/vue-debug-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/444075/vue-debug-helper.meta.js
// ==/UserScript==
(function (w) { if (w) { w._vueDebugHelper_ = 'https://github.com/xxxily/vue-debug-helper'; } })();

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
    state.addEventListener('storage', (ev) => {
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

/**
 * 对特定数据结构的对象进行排序
 * @param {object} obj 一个对象，其结构应该类似于：{key1: [], key2: []}
 * @param {boolean} reverse -可选 是否反转、降序排列，默认为false
 * @param {object} opts -可选 指定数组的配置项，默认为{key: 'key', value: 'value'}
 * @param {object} opts.key -可选 指定对象键名的别名，默认为'key'
 * @param {object} opts.value -可选 指定对象值的别名，默认为'value'
 * @returns {array} 返回一个数组，其结构应该类似于：[{key: key1, value: []}, {key: key2, value: []}]
 */
const objSort = (obj, reverse, opts = { key: 'key', value: 'value' }) => {
  const arr = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && Array.isArray(obj[key])) {
      const tmpObj = {};
      tmpObj[opts.key] = key;
      tmpObj[opts.value] = obj[key];
      arr.push(tmpObj);
    }
  }

  arr.sort((a, b) => {
    return a[opts.value].length - b[opts.value].length
  });

  reverse && arr.reverse();
  return arr
};

/**
 * 根据指定长度创建空白数据
 * @param {number} size -可选 指str的重复次数，默认为1024次，如果str为单个单字节字符，则意味着默认产生1Mb的空白数据
 * @param {string|number|any} str - 可选 指定数据的字符串，默认为'd'
 */
function createEmptyData (count = 1024, str = 'd') {
  const arr = [];
  arr.length = count + 1;
  return arr.join(str)
}

/**
 * 将字符串分隔的过滤器转换为数组形式的过滤器
 * @param {string|array} filter - 必选 字符串或数组，字符串支持使用 , |符号对多个项进行分隔
 * @returns {array}
 */
function toArrFilters (filter) {
  filter = filter || [];

  /* 如果是字符串，则支持通过, | 两个符号来指定多个组件名称的过滤器 */
  if (typeof filter === 'string') {
    /* 移除前后的, |分隔符，防止出现空字符的过滤规则 */
    filter.replace(/^(,|\|)/, '').replace(/(,|\|)$/, '');

    if (/\|/.test(filter)) {
      filter = filter.split('|');
    } else {
      filter = filter.split(',');
    }
  }

  filter = filter.map(item => item.trim());

  return filter
}

/**
 * 将某个过滤器的字符串添加到指定的过滤器集合里
 * @param {object} obj helper.config
 * @param {string} filtersName
 * @param {string} str
 * @returns
 */
function addToFilters (obj, filtersName, str) {
  const strType = typeof str;
  if (!obj || !filtersName || !str || !(strType === 'string' || strType === 'number')) {
    return
  }

  const filters = obj[filtersName];
  if (!filters) {
    obj[filtersName] = [str];
  } else if (Array.isArray(filters)) {
    if (filters.includes(str)) {
      /* 将str提到最后 */
      const index = filters.indexOf(str);
      filters.splice(index, 1);
      filters.push(str);
    } else {
      filters.push(str);
    }

    /* 去重 */
    obj[filtersName] = Array.from(new Set(filters));
  }
}

/**
 * 字符串过滤器和字符串的匹配方法
 * @param {string} filter -必选 过滤器的字符串
 * @param {string} str -必选 要跟过滤字符串进行匹配的字符串
 * @returns
 */
function stringMatch (filter, str) {
  let isMatch = false;

  if (!filter || !str) {
    return isMatch
  }

  filter = String(filter);
  str = String(str);

  /* 带星表示进行模糊匹配，且不区分大小写 */
  if (/\*/.test(filter)) {
    filter = filter.replace(/\*/g, '').toLocaleLowerCase();
    if (str.toLocaleLowerCase().indexOf(filter) > -1) {
      isMatch = true;
    }
  } else if (str.includes(filter)) {
    isMatch = true;
  }

  return isMatch
}

/**
 * 判断某个字符串是否跟filters相匹配
 * @param {array|string} filters - 必选 字符串或数组，字符串支持使用 , |符号对多个项进行分隔
 * @param {string|number} str - 必选 一个字符串或数字，用于跟过滤器进行匹配判断
 */
function filtersMatch (filters, str) {
  if (!filters || !str) {
    return false
  }

  filters = Array.isArray(filters) ? filters : toArrFilters(filters);
  str = String(str);

  let result = false;
  for (let i = 0; i < filters.length; i++) {
    const filter = String(filters[i]);

    if (stringMatch(filter, str)) {
      result = true;
      break
    }
  }

  return result
}

const inBrowser = typeof window !== 'undefined';

function getVueDevtools () {
  return inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__
}

function copyToClipboard (text) {
  if (inBrowser) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

function openInTab (url, opts) {
  if (window.GM_openInTab) {
    window.GM_openInTab(url, opts || {
      active: true,
      insert: true,
      setParent: true
    });
  }
}

window.vueDebugHelper = {
  /* 存储全部未被销毁的组件对象 */
  components: {},
  /* 存储全部创建过的组件的概要信息，即使销毁了概要信息依然存在 */
  componentsSummary: {},
  /* 基于componentsSummary的组件情况统计 */
  componentsSummaryStatistics: {},
  /* 已销毁的组件概要信息列表 */
  destroyList: [],
  /* 基于destroyList的组件情况统计 */
  destroyStatistics: {},

  config: {
    inspect: {
      enabled: false
    },

    contextMenu: {
      /* 简化菜单，将部分菜单项放到更多菜单的子项中 */
      simplify: false
    },

    performanceObserver: {
      enabled: false,
      // https://runebook.dev/zh-CN/docs/dom/performanceentry/entrytype
      entryTypes: ['element', 'navigation', 'resource', 'mark', 'measure', 'paint', 'longtask']
    },

    /* 控制接口缓存 */
    ajaxCache: {
      enabled: false,
      filters: ['*'],

      /* 设置缓存多久失效，默认为1天 */
      expires: 1000 * 60 * 60 * 24
    },

    blockAjax: {
      enabled: false,
      filters: []
    },

    replaceAjax: {
      enabled: false,
      replaceRules: []
    },

    /* 测量选择器时间差 */
    measureSelectorInterval: {
      selector1: '',
      selector2: ''
    },

    /* 是否在控制台打印组件生命周期的相关信息 */
    lifecycle: {
      show: false,
      filters: ['created'],
      componentFilters: []
    },

    /* 查找组件的过滤器配置 */
    findComponentsFilters: [],

    /* 阻止组件创建的过滤器 */
    blockFilters: [],

    devtools: true,

    /* 改写Vue.component */
    hackVueComponent: false,

    /* 给组件注入空白数据的配置信息 */
    dd: {
      enabled: false,
      filters: [],
      count: 1024
    }
  }
};

const helper = window.vueDebugHelper;

/* 配置信息跟localStorage联动 */
const state = localStorageProxy('vueDebugHelperConfig', {
  defaults: helper.config,
  lspReset: false,
  storageEventListener: false
});
helper.config = state;

const methods = {
  objSort,
  createEmptyData,
  /* 清除全部helper的全部记录数据，以便重新统计 */
  clearAll () {
    helper.components = {};
    helper.componentsSummary = {};
    helper.componentsSummaryStatistics = {};
    helper.destroyList = [];
    helper.destroyStatistics = {};
  },

  /**
   * 对当前的helper.components进行统计与排序
   * 如果一直没运行过清理函数，则表示统计页面创建至今依然存活的组件对象
   * 运行过清理函数，则表示统计清理后新创建且至今依然存活的组件对象
   */
  componentsStatistics (reverse = true) {
    const tmpObj = {};

    Object.keys(helper.components).forEach(key => {
      const component = helper.components[key];

      tmpObj[component._componentName]
        ? tmpObj[component._componentName].push(component)
        : (tmpObj[component._componentName] = [component]);
    });

    return objSort(tmpObj, reverse, {
      key: 'componentName',
      value: 'componentInstance'
    })
  },

  /**
   * 对componentsSummaryStatistics进行排序输出，以便可以直观查看组件的创建情况
   */
  componentsSummaryStatisticsSort (reverse = true) {
    return objSort(helper.componentsSummaryStatistics, reverse, {
      key: 'componentName',
      value: 'componentsSummary'
    })
  },

  /**
   * 对destroyList进行排序输出，以便可以直观查看组件的销毁情况
   */
  destroyStatisticsSort (reverse = true) {
    return objSort(helper.destroyStatistics, reverse, {
      key: 'componentName',
      value: 'destroyList'
    })
  },

  /**
   * 对destroyList进行排序输出，以便可以直观查看组件的销毁情况
   */
  getDestroyByDuration (duration = 1000) {
    const destroyList = helper.destroyList;
    const destroyListLength = destroyList.length;
    const destroyListDuration = destroyList.map(item => item.duration).sort();
    const maxDuration = Math.max(...destroyListDuration);
    const minDuration = Math.min(...destroyListDuration);
    const avgDuration = destroyListDuration.reduce((a, b) => a + b, 0) / destroyListLength;
    const durationRange = maxDuration - minDuration;
    const durationRangePercent = (duration - minDuration) / durationRange;

    return {
      destroyList,
      destroyListLength,
      destroyListDuration,
      maxDuration,
      minDuration,
      avgDuration,
      durationRange,
      durationRangePercent
    }
  },

  initComponentInfo (vm) {
    if (vm && !vm._componentTag) {
      const tag = vm.$vnode?.tag || vm.$options?._componentTag || vm._uid;
      vm._componentTag = tag;
      vm._componentName = isNaN(Number(tag)) ? tag.replace(/^vue-component-\d+-/, '') : 'anonymous-component';
      vm._componentChain = this.getComponentChain(vm);

      /* 判断是否为函数式组件，函数式组件无状态 (没有响应式数据)，也没有实例，也没生命周期概念 */
      if (vm._componentName === 'anonymous-component' && !vm.$parent && !vm.$vnode) {
        vm._componentName = 'functional-component';
      }
    }
  },

  /**
   * 获取组件的调用链信息
   */
  getComponentChain (component, moreDetail = false) {
    const result = [];
    let current = component;
    let deep = 0;

    while (current && deep < 50) {
      deep++;

      /**
       * 由于脚本注入的运行时间会比应用创建时间晚，所以会导致部分先创建的组件缺少相关信息
       * 这里尝试对部分信息进行修复，以便更好的查看组件的创建情况
       */
      if (!current._componentTag) {
        const tag = current.$vnode?.tag || current.$options?._componentTag || current._uid;
        current._componentTag = tag;
        current._componentName = isNaN(Number(tag)) ? tag.replace(/^vue-component-\d+-/, '') : 'anonymous-component';
      }

      if (moreDetail) {
        result.push({
          tag: current._componentTag,
          name: current._componentName,
          componentsSummary: helper.componentsSummary[current._uid] || null
        });
      } else {
        result.push(current._componentName);
      }

      current = current.$parent;
    }

    if (moreDetail) {
      return result
    } else {
      return result.join(' -> ')
    }
  },

  printLifeCycleInfo (lifecycleFilters, componentFilters) {
    lifecycleFilters = toArrFilters(lifecycleFilters);
    componentFilters = toArrFilters(componentFilters);

    helper.config.lifecycle = {
      show: true,
      filters: lifecycleFilters,
      componentFilters: componentFilters
    };
  },
  notPrintLifeCycleInfo () {
    helper.config.lifecycle.show = false;
  },

  /**
   * 查找组件
   * @param {string|array} filters 组件名称或组件uid的过滤器，可以是字符串或者数组，如果是字符串多个过滤选可用,或|分隔
   * 如果过滤项是数字，则跟组件的id进行精确匹配，如果是字符串，则跟组件的tag信息进行模糊匹配
   * @returns {object} {components: [], componentNames: []}
   */
  findComponents (filters) {
    filters = toArrFilters(filters);

    /* 对filters进行预处理，如果为纯数字则表示通过id查找组件 */
    filters = filters.map(filter => {
      if (/^\d+$/.test(filter)) {
        return Number(filter)
      } else {
        return filter
      }
    });

    helper.config.findComponentsFilters = filters;

    const result = {
      components: [],
      globalComponents: [],
      destroyedComponents: []
    };

    /* 在helper.components里进行组件查找 */
    const components = helper.components;
    const keys = Object.keys(components);
    for (let i = 0; i < keys.length; i++) {
      const component = components[keys[i]];

      for (let j = 0; j < filters.length; j++) {
        const filter = filters[j];

        if (typeof filter === 'number' && component._uid === filter) {
          result.components.push(component);
          break
        } else if (typeof filter === 'string') {
          const { _componentTag, _componentName } = component;

          if (stringMatch(filter, _componentTag) || stringMatch(filter, _componentName)) {
            result.components.push(component);
            break
          }
        }
      }
    }

    /* 进行全局组件查找 */
    const globalComponentsKeys = Object.keys(helper.Vue.options.components);
    for (let i = 0; i < globalComponentsKeys.length; i++) {
      const key = String(globalComponentsKeys[i]);
      const component = helper.Vue.options.components[globalComponentsKeys[i]];

      if (filtersMatch(filters, key)) {
        const tmpObj = {};
        tmpObj[key] = component;
        result.globalComponents.push(tmpObj);
      }
    }

    helper.destroyList.forEach(item => {
      for (let j = 0; j < filters.length; j++) {
        const filter = filters[j];

        if (typeof filter === 'number' && item.uid === filter) {
          result.destroyedComponents.push(item);
          break
        } else if (typeof filter === 'string') {
          if (stringMatch(filter, item.tag) || stringMatch(filter, item.name)) {
            result.destroyedComponents.push(item);
            break
          }
        }
      }
    });

    return result
  },

  findNotContainElementComponents () {
    const result = [];
    const keys = Object.keys(helper.components);
    keys.forEach(key => {
      const component = helper.components[key];
      const elStr = Object.prototype.toString.call(component.$el);
      if (!/(HTML|Comment)/.test(elStr)) {
        result.push(component);
      }
    });

    return result
  },

  /**
   * 阻止组件的创建
   * @param {string|array} filters 组件名称过滤器，可以是字符串或者数组，如果是字符串多个过滤选可用,或|分隔
   */
  blockComponents (filters) {
    filters = toArrFilters(filters);
    helper.config.blockFilters = filters;
  },

  /**
   * 给指定组件注入大量空数据，以便观察组件的内存泄露情况
   * @param {Array|string} filter -必选 指定组件的名称，如果为空则表示注入所有组件
   * @param {number} count -可选 指定注入空数据的大小，单位Kb，默认为1024Kb，即1Mb
   * @returns
   */
  dd (filter, count = 1024) {
    filter = toArrFilters(filter);
    helper.config.dd = {
      enabled: true,
      filters: filter,
      count
    };
  },
  /* 禁止给组件注入空数据 */
  undd () {
    helper.config.dd = {
      enabled: false,
      filters: [],
      count: 1024
    };

    /* 删除之前注入的数据 */
    Object.keys(helper.components).forEach(key => {
      const component = helper.components[key];
      component.$data && delete component.$data.__dd__;
    });
  },

  toggleDevtools () {
    helper.config.devtools = !helper.config.devtools;
  }
};

helper.methods = methods;

class Debug {
  constructor (msg, printTime = false) {
    const t = this;
    msg = msg || 'debug message:';
    t.log = t.createDebugMethod('log', null, msg);
    t.error = t.createDebugMethod('error', null, msg);
    t.info = t.createDebugMethod('info', null, msg);
    t.warn = t.createDebugMethod('warn', null, msg);
  }

  create (msg) {
    return new Debug(msg)
  }

  createDebugMethod (name, color, tipsMsg) {
    name = name || 'info';

    const bgColorMap = {
      info: '#2274A5',
      log: '#95B46A',
      warn: '#F5A623',
      error: '#D33F49'
    };

    const printTime = this.printTime;

    return function () {
      if (!window._debugMode_) {
        return false
      }

      const msg = tipsMsg || 'debug message:';

      const arg = Array.from(arguments);
      arg.unshift(`color: white; background-color: ${color || bgColorMap[name] || '#95B46A'}`);

      if (printTime) {
        const curTime = new Date();
        const H = curTime.getHours();
        const M = curTime.getMinutes();
        const S = curTime.getSeconds();
        arg.unshift(`%c [${H}:${M}:${S}] ${msg} `);
      } else {
        arg.unshift(`%c ${msg} `);
      }

      window.console[name].apply(window.console, arg);
    }
  }

  isDebugMode () {
    return Boolean(window._debugMode_)
  }
}

var Debug$1 = new Debug();

var debug = Debug$1.create('vueDebugHelper:');

/**
 * 打印生命周期信息
 * @param {Vue} vm vue组件实例
 * @param {string} lifeCycle vue生命周期名称
 * @returns
 */
function printLifeCycle (vm, lifeCycle) {
  const lifeCycleConf = helper.config.lifecycle || { show: false, filters: ['created'], componentFilters: [] };

  if (!vm || !lifeCycle || !lifeCycleConf.show) {
    return false
  }

  const file = vm.options?.__file || vm.$options?.__file || '';

  const { _componentTag, _componentName, _componentChain, _createdHumanTime, _uid } = vm;
  let info = `[${lifeCycle}] tag: ${_componentTag}, uid: ${_uid}, createdTime: ${_createdHumanTime}, chain: ${_componentChain}`;

  if (file) {
    info += `, file: ${file}`;
  }

  const matchComponentFilters = lifeCycleConf.componentFilters.length === 0 || filtersMatch(lifeCycleConf.componentFilters, _componentName);
  if (lifeCycleConf.filters.includes(lifeCycle) && matchComponentFilters) {
    debug.log(info);
  }
}

function mixinRegister (Vue) {
  if (!Vue || !Vue.mixin) {
    debug.error('未检查到VUE对象，请检查是否引入了VUE，且将VUE对象挂载到全局变量window.Vue上');
    return false
  }

  Vue.mixin({
    beforeCreate: function () {
      // const tag = this.$options?._componentTag || this.$vnode?.tag || this._uid
      helper.methods.initComponentInfo(this);

      this._createdTime = Date.now();
      /* 增加人类方便查看的时间信息 */
      const timeObj = new Date(this._createdTime);
      this._createdHumanTime = `${timeObj.getHours()}:${timeObj.getMinutes()}:${timeObj.getSeconds()}`;

      helper.components[this._uid] = this;

      /**
       * 收集所有创建过的组件信息，此处只存储组件的基础信息，没销毁的组件会包含组件实例
       * 严禁对组件内其它对象进行引用，否则会导致组件实列无法被正常回收
       */
      const componentSummary = {
        uid: this._uid,
        name: this._componentName,
        tag: this._componentTag,
        createdTime: this._createdTime,
        createdHumanTime: this._createdHumanTime,
        // 0 表示还没被销毁
        destroyTime: 0,
        // 0 表示还没被销毁，duration可持续当当前查看时间
        duration: 0,
        component: this,
        chain: this._componentChain
      };
      helper.componentsSummary[this._uid] = componentSummary;

      /* 添加到componentsSummaryStatistics里，生成统计信息 */
      Array.isArray(helper.componentsSummaryStatistics[this._componentName])
        ? helper.componentsSummaryStatistics[this._componentName].push(componentSummary)
        : (helper.componentsSummaryStatistics[this._componentName] = [componentSummary]);

      printLifeCycle(this, 'beforeCreate');
    },
    created: function () {
      /* 增加空白数据，方便观察内存泄露情况 */
      if (helper.config.dd.enabled) {
        let needDd = false;

        if (helper.config.dd.filters.length === 0) {
          needDd = true;
        } else {
          for (let index = 0; index < helper.config.dd.filters.length; index++) {
            const filter = helper.config.dd.filters[index];
            if (filter === this._componentName || String(this._componentName).endsWith(filter)) {
              needDd = true;
              break
            }
          }
        }

        if (needDd) {
          const count = helper.config.dd.count * 1024;
          const componentInfo = `tag: ${this._componentTag}, uid: ${this._uid}, createdTime: ${this._createdHumanTime}`;

          /* 此处必须使用JSON.stringify对产生的字符串进行消费，否则没法将内存占用上去 */
          this.$data.__dd__ = JSON.stringify(componentInfo + ' ' + helper.methods.createEmptyData(count, this._uid));

          console.log(`[dd success] ${componentInfo} chain: ${this._componentChain}`);
        }
      }

      printLifeCycle(this, 'created');
    },
    beforeMount: function () {
      printLifeCycle(this, 'beforeMount');
    },
    mounted: function () {
      printLifeCycle(this, 'mounted');
    },
    beforeUpdate: function () {
      printLifeCycle(this, 'beforeUpdate');
    },
    activated: function () {
      printLifeCycle(this, 'activated');
    },
    deactivated: function () {
      printLifeCycle(this, 'deactivated');
    },
    updated: function () {
      printLifeCycle(this, 'updated');
    },
    beforeDestroy: function () {
      printLifeCycle(this, 'beforeDestroy');
    },
    destroyed: function () {
      printLifeCycle(this, 'destroyed');

      if (this._componentTag) {
        const uid = this._uid;
        const name = this._componentName;
        const destroyTime = Date.now();

        /* helper里的componentSummary有可能通过调用clear函数而被清除掉，所以需进行判断再更新赋值 */
        const componentSummary = helper.componentsSummary[this._uid];
        if (componentSummary) {
          /* 补充/更新组件信息 */
          componentSummary.destroyTime = destroyTime;
          componentSummary.duration = destroyTime - this._createdTime;

          helper.destroyList.push(componentSummary);

          /* 统计被销毁的组件信息 */
          Array.isArray(helper.destroyStatistics[name])
            ? helper.destroyStatistics[name].push(componentSummary)
            : (helper.destroyStatistics[name] = [componentSummary]);

          /* 删除已销毁的组件实例 */
          delete componentSummary.component;
        }

        // 解除引用关系
        delete this._componentTag;
        delete this._componentChain;
        delete this._componentName;
        delete this._createdTime;
        delete this._createdHumanTime;
        delete this.$data.__dd__;
        delete helper.components[uid];
      } else {
        console.error('存在未被正常标记的组件，请检查组件采集逻辑是否需完善', this);
      }
    }
  });
}

/*!
 * @name      menuCommand.js
 * @version   0.0.1
 * @author    Blaze
 * @date      2019/9/21 14:22
 */

const monkeyMenu = {
  menuIds: {},
  on (title, fn, accessKey) {
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
      return window.GM_unregisterMenuCommand(id)
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

/**
 * 简单的i18n库
 */

class I18n {
  constructor (config) {
    this._languages = {};
    this._locale = this.getClientLang();
    this._defaultLanguage = '';
    this.init(config);
  }

  init (config) {
    if (!config) return false

    const t = this;
    t._locale = config.locale || t._locale;
    /* 指定当前要是使用的语言环境，默认无需指定，会自动读取 */
    t._languages = config.languages || t._languages;
    t._defaultLanguage = config.defaultLanguage || t._defaultLanguage;
  }

  use () {}

  t (path) {
    const t = this;
    let result = t.getValByPath(t._languages[t._locale] || {}, path);

    /* 版本回退 */
    if (!result && t._locale !== t._defaultLanguage) {
      result = t.getValByPath(t._languages[t._defaultLanguage] || {}, path);
    }

    return result || ''
  }

  /* 当前语言值 */
  language () {
    return this._locale
  }

  languages () {
    return this._languages
  }

  changeLanguage (locale) {
    if (this._languages[locale]) {
      this._languages = locale;
      return locale
    } else {
      return false
    }
  }

  /**
   * 根据文本路径获取对象里面的值
   * @param obj {Object} -必选 要操作的对象
   * @param path {String} -必选 路径信息
   * @returns {*}
   */
  getValByPath (obj, path) {
    path = path || '';
    const pathArr = path.split('.');
    let result = obj;

    /* 递归提取结果值 */
    for (let i = 0; i < pathArr.length; i++) {
      if (!result) break
      result = result[pathArr[i]];
    }

    return result
  }

  /* 获取客户端当前的语言环境 */
  getClientLang () {
    return navigator.languages ? navigator.languages[0] : navigator.language
  }
}

var zhCN = {
  help: '插件帮助中心',
  about: '关于',
  issues: '反馈',
  setting: '设置',
  hotkeys: '快捷键',
  donate: '赞赏',
  docs: '文档',
  quit: '退出',
  update: '更新',
  refreshPage: '刷新页面',
  debugHelper: {
    viewVueDebugHelperObject: 'vueDebugHelper对象',
    componentsStatistics: '当前存活组件统计',
    destroyStatisticsSort: '已销毁组件统计',
    componentsSummaryStatisticsSort: '全部组件混合统计',
    getDestroyByDuration: '组件存活时间信息',
    clearAll: '清空统计信息',
    printLifeCycleInfo: '打印组件生命周期信息',
    notPrintLifeCycleInfo: '取消组件生命周期信息打印',
    printLifeCycleInfoPrompt: {
      lifecycleFilters: '输入要打印的生命周期名称，多个可用,或|分隔，支持的值：beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|activated|deactivated|beforeDestroy|destroyed',
      componentFilters: '输入要打印的组件名称，多个可用,或|分隔，不输入则打印所有组件，字符串后面加*可执行模糊匹配'
    },
    findComponents: '查找组件',
    findComponentsPrompt: {
      filters: '输入要查找的组件名称，或uid，多个可用,或|分隔，字符串后面加*可执行模糊匹配'
    },
    findNotContainElementComponents: '查找不包含DOM对象的组件',
    blockComponents: '阻断组件的创建',
    blockComponentsPrompt: {
      filters: '输入要阻断的组件名称，多个可用,或|分隔，输入为空则取消阻断，字符串后面加*可执行模糊匹配'
    },
    dd: '数据注入（dd）',
    undd: '取消数据注入（undd）',
    ddPrompt: {
      filter: '组件过滤器（如果为空，则对所有组件注入）',
      count: '指定注入数据的重复次数（默认1024）'
    },
    toggleHackVueComponent: '改写/还原Vue.component',
    hackVueComponent: {
      hack: '改写Vue.component',
      unhack: '还原Vue.component'
    },
    toggleInspect: '切换Inspect',
    inspectStatus: {
      on: '开启Inspect',
      off: '关闭Inspect'
    },
    togglePerformanceObserver: '开启/关闭性能观察',
    performanceObserverStatus: {
      on: '开启性能观察',
      off: '关闭性能观察'
    },
    performanceObserverPrompt: {
      entryTypes: '输入要观察的类型，多个类型可用,或|分隔，支持的类型有：element,navigation,resource,mark,measure,paint,longtask',
      notSupport: '当前浏览器不支持性能观察'
    },
    enableAjaxCacheTips: '接口缓存功能已开启',
    disableAjaxCacheTips: '接口缓存功能已关闭',
    toggleAjaxCache: '开启/关闭接口缓存',
    ajaxCacheStatus: {
      on: '开启接口缓存',
      off: '关闭接口缓存'
    },
    clearAjaxCache: '清空接口缓存数据',
    clearAjaxCacheTips: '接口缓存数据已清空',
    jaxCachePrompt: {
      filters: '输入要缓存的接口地址，多个可用,或|分隔，字符串后面加*可执行模糊匹配',
      expires: '输入缓存过期时间，单位为分钟，默认为1440分钟（即24小时）'
    },
    toggleBlockAjax: '开启/关闭接口请求拦截',
    blockAjax: {
      enabled: '开启接口请求拦截',
      disable: '关闭接口请求拦截',
      prompt: {
        filters: '输入要拦截的接口地址，多个可用,或|分隔，字符串后面加*可执行模糊匹配'
      }
    },

    measureSelectorInterval: '测量选择器时间差',
    measureSelectorIntervalPrompt: {
      selector1: '输入起始选择器',
      selector2: '输入结束选择器'
    },
    selectorReadyTips: '元素已就绪',
    devtools: {
      enabled: '自动开启vue-devtools',
      disable: '禁止开启vue-devtools'
    },
    simplifyMode: {
      enabled: '简化右键菜单',
      disable: '展开全部菜单'
    }
  },
  contextMenu: {
    consoleComponent: '查看组件',
    consoleComponentData: '查看组件数据',
    consoleComponentProps: '查看组件props',
    consoleComponentChain: '查看组件调用链',
    consoleParentComponent: '查看父组件',
    componentAction: '相关操作',
    copyFilePath: '复制文件路径',
    copyComponentName: '复制组件名称',
    copyComponentData: '复制组件$data',
    copyComponentProps: '复制组件$props',
    copyComponentTag: '复制组件标签',
    copyComponentUid: '复制组件uid',
    copyComponentChian: '复制组件调用链',
    findComponents: '查找组件',
    printLifeCycleInfo: '打印生命周期信息',
    blockComponents: '阻断组件',
    more: '更多'
  }
};

var enUS = {
  about: 'about',
  issues: 'feedback',
  setting: 'settings',
  hotkeys: 'Shortcut keys',
  donate: 'donate',
  quit: 'quit',
  refreshPage: 'Refresh the page',
  debugHelper: {
    viewVueDebugHelperObject: 'vueDebugHelper object',
    componentsStatistics: 'Current surviving component statistics',
    destroyStatisticsSort: 'Destroyed component statistics',
    componentsSummaryStatisticsSort: 'All components mixed statistics',
    getDestroyByDuration: 'Component survival time information',
    clearAll: 'Clear statistics',
    printLifeCycleInfo: 'Print component life cycle information',
    notPrintLifeCycleInfo: 'Cancel the printing of component life cycle information',
    printLifeCycleInfoPrompt: {
      lifecycleFilters: 'Enter the lifecycle name to be printed, multiple available, or | separated, supported values: beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|activated|deactivated|beforeDestroy|destroyed',
      componentFilters: 'Enter the name of the component to be printed, multiple available, or | separated, if not input, print all components, add * after the string to perform fuzzy matching'
    },
    findComponents: 'Find Components',
    findComponentsPrompt: {
      filters: 'Enter the name of the component to find, or uid, multiple available, or | separated, followed by * to perform fuzzy matching'
    },
    findNotContainElementComponents: 'Find components that do not contain DOM objects',
    blockComponents: 'Block the creation of components',
    blockComponentsPrompt: {
      filters: 'Enter the name of the component to be blocked, multiple available, or | separated, the input is empty to cancel the blocking, add * after the string to perform fuzzy matching'
    },
    dd: 'Data injection (dd)',
    undd: 'Cancel data injection (undd)',
    ddPrompt: {
      filter: 'Component filter (if empty, inject all components)',
      count: 'Specify the number of repetitions of injected data (default 1024)'
    },
    toggleHackVueComponent: 'Rewrite/restore Vue.component',
    hackVueComponent: {
      hack: 'Rewrite Vue.component',
      unhack: 'Restore Vue.component'
    },
    toggleInspect: 'Toggle Inspect',
    inspectStatus: {
      on: 'Enable Inspect',
      off: 'Turn off Inspect'
    },
    togglePerformanceObserver: 'Turn on/off performance observation',
    performanceObserverStatus: {
      on: 'Enable performance observation',
      off: 'Turn off performance observation'
    },
    performanceObserverPrompt: {
      entryTypes: 'Enter the type to be observed, multiple types are available, or | separated, the supported types are: element, navigation, resource, mark, measure, paint, longtask',
      notSupport: 'The current browser does not support performance observation'
    },
    enableAjaxCacheTips: 'The interface cache function is enabled',
    disableAjaxCacheTips: 'The interface cache function has been closed',
    toggleAjaxCache: 'Enable/disable interface cache',
    ajaxCacheStatus: {
      on: 'Enable interface cache',
      off: 'Turn off the interface cache'
    },
    clearAjaxCache: 'Clear interface cache data',
    clearAjaxCacheTips: 'The interface cache data has been cleared',
    jaxCachePrompt: {
      filters: 'Enter the interface address to be cached, multiple available, or | separated, followed by * to perform fuzzy matching',
      expires: 'Enter the cache expiration time in minutes, the default is 1440 minutes (ie 24 hours)'
    },
    measureSelectorInterval: 'Measure selector time difference',
    measureSelectorIntervalPrompt: {
      selector1: 'input start selector',
      selector2: 'input end selector'
    },
    selectorReadyTips: 'The element is ready',
    devtools: {
      enabled: 'Automatically enable vue-devtools',
      disable: 'Disable to enable vue-devtools'
    }
  },
  contextMenu: {
    consoleComponent: 'View component',
    consoleComponentData: 'View component data',
    consoleComponentProps: 'View component props',
    consoleComponentChain: 'View the component call chain',
    consoleParentComponent: 'View parent component',
    componentAction: 'Related actions',
    copyFilePath: 'Copy file path',
    copyComponentName: 'Copy component name',
    copyComponentData: 'Copy component $data',
    copyComponentProps: 'Copy component $props',
    copyComponentTag: 'Copy component tag',
    copyComponentUid: 'Copy component uid',
    copyComponentChian: 'Copy component call chain',
    findComponents: 'Find Components',
    printLifeCycleInfo: 'Print life cycle information',
    blockComponents: 'Block Components'
  }
};

var zhTW = {
  about: '關於',
  issues: '反饋',
  setting: '設置',
  hotkeys: '快捷鍵',
  donate: '讚賞',
  quit: '退出',
  refreshPage: '刷新頁面',
  debugHelper: {
    viewVueDebugHelperObject: 'vueDebugHelper對象',
    componentsStatistics: '當前存活組件統計',
    destroyStatisticsSort: '已銷毀組件統計',
    componentsSummaryStatisticsSort: '全部組件混合統計',
    getDestroyByDuration: '組件存活時間信息',
    clearAll: '清空統計信息',
    printLifeCycleInfo: '打印組件生命週期信息',
    notPrintLifeCycleInfo: '取消組件生命週期信息打印',
    printLifeCycleInfoPrompt: {
      lifecycleFilters: '輸入要打印的生命週期名稱，多個可用,或|分隔，支持的值：beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|activated|deactivated|beforeDestroy|destroyed',
      componentFilters: '輸入要打印的組件名稱，多個可用,或|分隔，不輸入則打印所有組件，字符串後面加*可執行模糊匹配'
    },
    findComponents: '查找組件',
    findComponentsPrompt: {
      filters: '輸入要查找的組件名稱，或uid，多個可用,或|分隔，字符串後面加*可執行模糊匹配'
    },
    findNotContainElementComponents: '查找不包含DOM對象的組件',
    blockComponents: '阻斷組件的創建',
    blockComponentsPrompt: {
      filters: '輸入要阻斷的組件名稱，多個可用,或|分隔，輸入為空則取消阻斷，字符串後面加*可執行模糊匹配'
    },
    dd: '數據注入（dd）',
    undd: '取消數據注入（undd）',
    ddPrompt: {
      filter: '組件過濾器（如果為空，則對所有組件注入）',
      count: '指定注入數據的重複次數（默認1024）'
    },
    toggleHackVueComponent: '改寫/還原Vue.component',
    hackVueComponent: {
      hack: '改寫Vue.component',
      unhack: '還原Vue.component'
    },
    toggleInspect: '切換Inspect',
    inspectStatus: {
      on: '開啟Inspect',
      off: '關閉Inspect'
    },
    togglePerformanceObserver: '開啟/關閉性能觀察',
    performanceObserverStatus: {
      on: '開啟性能觀察',
      off: '關閉性能觀察'
    },
    performanceObserverPrompt: {
      entryTypes: '輸入要觀察的類型，多個類型可用,或|分隔，支持的類型有：element,navigation,resource,mark,measure,paint,longtask',
      notSupport: '當前瀏覽器不支持性能觀察'
    },
    enableAjaxCacheTips: '接口緩存功能已開啟',
    disableAjaxCacheTips: '接口緩存功能已關閉',
    toggleAjaxCache: '開啟/關閉接口緩存',
    ajaxCacheStatus: {
      on: '開啟接口緩存',
      off: '關閉接口緩存'
    },
    clearAjaxCache: '清空接口緩存數據',
    clearAjaxCacheTips: '接口緩存數據已清空',
    jaxCachePrompt: {
      filters: '輸入要緩存的接口地址，多個可用,或|分隔，字符串後面加*可執行模糊匹配',
      expires: '輸入緩存過期時間，單位為分鐘，默認為1440分鐘（即24小時）'
    },
    measureSelectorInterval: '測量選擇器時間差',
    measureSelectorIntervalPrompt: {
      selector1: '輸入起始選擇器',
      selector2: '輸入結束選擇器'
    },
    selectorReadyTips: '元素已就緒',
    devtools: {
      enabled: '自動開啟vue-devtools',
      disable: '禁止開啟vue-devtools'
    }
  },
  contextMenu: {
    consoleComponent: '查看組件',
    consoleComponentData: '查看組件數據',
    consoleComponentProps: '查看組件props',
    consoleComponentChain: '查看組件調用鏈',
    consoleParentComponent: '查看父組件',
    componentAction: '相關操作',
    copyFilePath: '複製文件路徑',
    copyComponentName: '複製組件名稱',
    copyComponentData: '複製組件$data',
    copyComponentProps: '複製組件$props',
    copyComponentTag: '複製組件標籤',
    copyComponentUid: '複製組件uid',
    copyComponentChian: '複製組件調用鏈',
    findComponents: '查找組件',
    printLifeCycleInfo: '打印生命週期信息',
    blockComponents: '阻斷組件'
  }
};

const messages = {
  'zh-CN': zhCN,
  zh: zhCN,
  'zh-HK': zhTW,
  'zh-TW': zhTW,
  'en-US': enUS,
  en: enUS,
};

/*!
 * @name         i18n.js
 * @description  vue-debug-helper的国际化配置
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/04/26 14:56
 * @github       https://github.com/xxxily
 */

const i18n = new I18n({
  defaultLanguage: 'en',
  /* 指定当前要是使用的语言环境，默认无需指定，会自动读取 */
  // locale: 'zh-TW',
  languages: messages
});

/*!
 * @name         index.js
 * @description  hookJs JS AOP切面编程辅助库
 * @version      0.0.1
 * @author       Blaze
 * @date         2020/10/22 17:40
 * @github       https://github.com/xxxily
 */

const win = typeof window === 'undefined' ? global : window;
const toStr = Function.prototype.call.bind(Object.prototype.toString);
/* 特殊场景，如果把Boolean也hook了，很容易导致调用溢出，所以是需要使用原生Boolean */
const toBoolean = Boolean.originMethod ? Boolean.originMethod : Boolean;
const util = {
  toStr,
  isObj: obj => toStr(obj) === '[object Object]',
  /* 判断是否为引用类型，用于更宽泛的场景 */
  isRef: obj => typeof obj === 'object',
  isReg: obj => toStr(obj) === '[object RegExp]',
  isFn: obj => obj instanceof Function,
  isAsyncFn: fn => toStr(fn) === '[object AsyncFunction]',
  isPromise: obj => toStr(obj) === '[object Promise]',
  firstUpperCase: str => str.replace(/^\S/, s => s.toUpperCase()),
  toArr: arg => Array.from(Array.isArray(arg) ? arg : [arg]),

  debug: {
    log () {
      let log = win.console.log;
      /* 如果log也被hook了，则使用未被hook前的log函数 */
      if (log.originMethod) { log = log.originMethod; }
      if (win._debugMode_) {
        log.apply(win.console, arguments);
      }
    }
  },
  /* 获取包含自身、继承、可枚举、不可枚举的键名 */
  getAllKeys (obj) {
    const tmpArr = [];
    for (const key in obj) { tmpArr.push(key); }
    const allKeys = Array.from(new Set(tmpArr.concat(Reflect.ownKeys(obj))));
    return allKeys
  }
};

class HookJs {
  constructor (useProxy) {
    this.useProxy = useProxy || false;
    this.hookPropertiesKeyName = '_hookProperties' + Date.now();
  }

  hookJsPro () {
    return new HookJs(true)
  }

  _addHook (hookMethod, fn, type, classHook) {
    const hookKeyName = type + 'Hooks';
    const hookMethodProperties = hookMethod[this.hookPropertiesKeyName];
    if (!hookMethodProperties[hookKeyName]) {
      hookMethodProperties[hookKeyName] = [];
    }

    /* 注册（储存）要被调用的hook函数，同时防止重复注册 */
    let hasSameHook = false;
    for (let i = 0; i < hookMethodProperties[hookKeyName].length; i++) {
      if (fn === hookMethodProperties[hookKeyName][i]) {
        hasSameHook = true;
        break
      }
    }

    if (!hasSameHook) {
      fn.classHook = classHook || false;
      hookMethodProperties[hookKeyName].push(fn);
    }
  }

  _runHooks (parentObj, methodName, originMethod, hookMethod, target, ctx, args, classHook, hookPropertiesKeyName) {
    const hookMethodProperties = hookMethod[hookPropertiesKeyName];
    const beforeHooks = hookMethodProperties.beforeHooks || [];
    const afterHooks = hookMethodProperties.afterHooks || [];
    const errorHooks = hookMethodProperties.errorHooks || [];
    const hangUpHooks = hookMethodProperties.hangUpHooks || [];
    const replaceHooks = hookMethodProperties.replaceHooks || [];
    const execInfo = {
      result: null,
      error: null,
      args: args,
      type: ''
    };

    function runHooks (hooks, type) {
      let hookResult = null;
      execInfo.type = type || '';
      if (Array.isArray(hooks)) {
        hooks.forEach(fn => {
          if (util.isFn(fn) && classHook === fn.classHook) {
            hookResult = fn(args, parentObj, methodName, originMethod, execInfo, ctx);
          }
        });
      }
      return hookResult
    }

    const runTarget = (function () {
      if (classHook) {
        return function () {
          // eslint-disable-next-line new-cap
          return new target(...args)
        }
      } else {
        return function () {
          return target.apply(ctx, args)
        }
      }
    })();

    const beforeHooksResult = runHooks(beforeHooks, 'before');
    /* 支持终止后续调用的指令 */
    if (beforeHooksResult && beforeHooksResult === 'STOP-INVOKE') {
      return beforeHooksResult
    }

    if (hangUpHooks.length || replaceHooks.length) {
      /**
       * 当存在hangUpHooks或replaceHooks的时候是不会触发原来函数的
       * 本质上来说hangUpHooks和replaceHooks是一样的，只是外部的定义描述不一致和分类不一致而已
       */
      runHooks(hangUpHooks, 'hangUp');
      runHooks(replaceHooks, 'replace');
    } else {
      if (errorHooks.length) {
        try {
          execInfo.result = runTarget();
        } catch (err) {
          execInfo.error = err;
          const errorHooksResult = runHooks(errorHooks, 'error');
          /* 支持执行错误后不抛出异常的指令 */
          if (errorHooksResult && errorHooksResult === 'SKIP-ERROR') ; else {
            throw err
          }
        }
      } else {
        execInfo.result = runTarget();
      }
    }

    /**
     * 执行afterHooks，如果返回的是Promise，理论上应该进行进一步的细分处理
     * 但添加细分处理逻辑后发现性能下降得比较厉害，且容易出现各种异常，所以决定不在hook里处理Promise情况
     * 下面是原Promise处理逻辑，添加后会导致以下网站卡死或无法访问：
     * wenku.baidu.com
     * https://pubs.rsc.org/en/content/articlelanding/2021/sc/d1sc01881g#!divAbstract
     * https://www.elsevier.com/connect/coronavirus-information-center
     */
    // if (execInfo.result && execInfo.result.then && util.isPromise(execInfo.result)) {
    //   execInfo.result.then(function (data) {
    //     execInfo.result = data
    //     runHooks(afterHooks, 'after')
    //     return Promise.resolve.apply(ctx, arguments)
    //   }).catch(function (err) {
    //     execInfo.error = err
    //     runHooks(errorHooks, 'error')
    //     return Promise.reject.apply(ctx, arguments)
    //   })
    // }

    runHooks(afterHooks, 'after');

    return execInfo.result
  }

  _proxyMethodcGenerator (parentObj, methodName, originMethod, classHook, context, proxyHandler) {
    const t = this;
    const useProxy = t.useProxy;
    let hookMethod = null;

    /* 存在缓存则使用缓存的hookMethod */
    if (t.isHook(originMethod)) {
      hookMethod = originMethod;
    } else if (originMethod[t.hookPropertiesKeyName] && t.isHook(originMethod[t.hookPropertiesKeyName].hookMethod)) {
      hookMethod = originMethod[t.hookPropertiesKeyName].hookMethod;
    }

    if (hookMethod) {
      if (!hookMethod[t.hookPropertiesKeyName].isHook) {
        /* 重新标注被hook状态 */
        hookMethod[t.hookPropertiesKeyName].isHook = true;
        util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`);
      }
      return hookMethod
    }

    /* 使用Proxy模式进行hook可以获得更多特性，但性能也会稍差一些 */
    if (useProxy && Proxy) {
      /* 注意：使用Proxy代理，hookMethod和originMethod将共用同一对象 */
      const handler = { ...proxyHandler };

      /* 下面的写法确定了proxyHandler是无法覆盖construct和apply操作的 */
      if (classHook) {
        handler.construct = function (target, args, newTarget) {
          context = context || this;
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, context, args, true, t.hookPropertiesKeyName)
        };
      } else {
        handler.apply = function (target, ctx, args) {
          ctx = context || ctx;
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, ctx, args, false, t.hookPropertiesKeyName)
        };
      }

      hookMethod = new Proxy(originMethod, handler);
    } else {
      hookMethod = function () {
        /**
         * 注意此处不能通过 context = context || this
         * 然后通过把context当ctx传递过去
         * 这将导致ctx引用错误
         */
        const ctx = context || this;
        return t._runHooks(parentObj, methodName, originMethod, hookMethod, originMethod, ctx, arguments, classHook, t.hookPropertiesKeyName)
      };

      /* 确保子对象和原型链跟originMethod保持一致 */
      const keys = Reflect.ownKeys(originMethod);
      keys.forEach(keyName => {
        try {
          Object.defineProperty(hookMethod, keyName, {
            get: function () {
              return originMethod[keyName]
            },
            set: function (val) {
              originMethod[keyName] = val;
            }
          });
        } catch (err) {
          // 设置defineProperty的时候出现异常，可能导致hookMethod部分功能确实，也可能不受影响
          util.debug.log(`[proxyMethodcGenerator] hookMethod defineProperty abnormal.  hookMethod:${methodName}, definePropertyName:${keyName}`, err);
        }
      });
      hookMethod.prototype = originMethod.prototype;
    }

    const hookMethodProperties = hookMethod[t.hookPropertiesKeyName] = {};

    hookMethodProperties.originMethod = originMethod;
    hookMethodProperties.hookMethod = hookMethod;
    hookMethodProperties.isHook = true;
    hookMethodProperties.classHook = classHook;

    util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`);

    return hookMethod
  }

  _getObjKeysByRule (obj, rule) {
    let excludeRule = null;
    let result = rule;

    if (util.isObj(rule) && rule.include) {
      excludeRule = rule.exclude;
      rule = rule.include;
      result = rule;
    }

    /**
     * for in、Object.keys与Reflect.ownKeys的区别见：
     * https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E9%81%8D%E5%8E%86
     */
    if (rule === '*') {
      result = Object.keys(obj);
    } else if (rule === '**') {
      result = Reflect.ownKeys(obj);
    } else if (rule === '***') {
      result = util.getAllKeys(obj);
    } else if (util.isReg(rule)) {
      result = util.getAllKeys(obj).filter(keyName => rule.test(keyName));
    }

    /* 如果存在排除规则，则需要进行排除 */
    if (excludeRule) {
      result = Array.isArray(result) ? result : [result];
      if (util.isReg(excludeRule)) {
        result = result.filter(keyName => !excludeRule.test(keyName));
      } else if (Array.isArray(excludeRule)) {
        result = result.filter(keyName => !excludeRule.includes(keyName));
      } else {
        result = result.filter(keyName => excludeRule !== keyName);
      }
    }

    return util.toArr(result)
  }

  /**
   * 判断某个函数是否已经被hook
   * @param fn {Function} -必选 要判断的函数
   * @returns {boolean}
   */
  isHook (fn) {
    if (!fn || !fn[this.hookPropertiesKeyName]) {
      return false
    }
    const hookMethodProperties = fn[this.hookPropertiesKeyName];
    return util.isFn(hookMethodProperties.originMethod) && fn !== hookMethodProperties.originMethod
  }

  /**
   * 判断对象下的某个值是否具备hook的条件
   * 注意：具备hook条件和能否直接修改值是两回事，
   * 在进行hook的时候还要检查descriptor.writable是否为false
   * 如果为false则要修改成true才能hook成功
   * @param parentObj
   * @param keyName
   * @returns {boolean}
   */
  isAllowHook (parentObj, keyName) {
    /* 有些对象会设置getter，让读取值的时候就抛错，所以需要try catch 判断能否正常读取属性 */
    try { if (!parentObj[keyName]) return false } catch (e) { return false }
    const descriptor = Object.getOwnPropertyDescriptor(parentObj, keyName);
    return !(descriptor && descriptor.configurable === false)
  }

  /**
   * hook 核心函数
   * @param parentObj {Object} -必选 被hook函数依赖的父对象
   * @param hookMethods {Object|Array|RegExp|string} -必选 被hook函数的函数名或函数名的匹配规则
   * @param fn {Function} -必选 hook之后的回调方法
   * @param type {String} -可选 默认before，指定运行hook函数回调的时机，可选字符串：before、after、replace、error、hangUp
   * @param classHook {Boolean} -可选 默认false，指定是否为针对new（class）操作的hook
   * @param context {Object} -可选 指定运行被hook函数时的上下文对象
   * @param proxyHandler {Object} -可选 仅当用Proxy进行hook时有效，默认使用的是Proxy的apply handler进行hook，如果你有特殊需求也可以配置自己的handler以实现更复杂的功能
   * 附注：不使用Proxy进行hook，可以获得更高性能，但也意味着通用性更差些，对于要hook HTMLElement.prototype、EventTarget.prototype这些对象里面的非实例的函数往往会失败而导致被hook函数执行出错
   * @returns {boolean}
   */
  hook (parentObj, hookMethods, fn, type, classHook, context, proxyHandler) {
    classHook = toBoolean(classHook);
    type = type || 'before';

    if ((!util.isRef(parentObj) && !util.isFn(parentObj)) || !util.isFn(fn) || !hookMethods) {
      return false
    }

    const t = this;

    hookMethods = t._getObjKeysByRule(parentObj, hookMethods);
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] does not support modification`);
        return false
      }

      const descriptor = Object.getOwnPropertyDescriptor(parentObj, methodName);
      if (descriptor && descriptor.writable === false) {
        Object.defineProperty(parentObj, methodName, { writable: true });
      }

      const originMethod = parentObj[methodName];
      let hookMethod = null;

      /* 非函数无法进行hook操作 */
      if (!util.isFn(originMethod)) {
        return false
      }

      hookMethod = t._proxyMethodcGenerator(parentObj, methodName, originMethod, classHook, context, proxyHandler);

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName];
      if (hookMethodProperties.classHook !== classHook) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] Cannot support functions hook and classes hook at the same time `);
        return false
      }

      /* 使用hookMethod接管需要被hook的方法 */
      if (parentObj[methodName] !== hookMethod) {
        parentObj[methodName] = hookMethod;
      }

      t._addHook(hookMethod, fn, type, classHook);
    });
  }

  /* 专门针对new操作的hook，本质上是hook函数的别名，可以少传classHook这个参数，并且明确语义 */
  hookClass (parentObj, hookMethods, fn, type, context, proxyHandler) {
    return this.hook(parentObj, hookMethods, fn, type, true, context, proxyHandler)
  }

  /**
   * 取消对某个函数的hook
   * @param parentObj {Object} -必选 要取消被hook函数依赖的父对象
   * @param hookMethods {Object|Array|RegExp|string} -必选 要取消被hook函数的函数名或函数名的匹配规则
   * @param type {String} -可选 默认before，指定要取消的hook类型，可选字符串：before、after、replace、error、hangUp，如果不指定该选项则取消所有类型下的所有回调
   * @param fn {Function} -必选 取消指定的hook回调函数，如果不指定该选项则取消对应type类型下的所有回调
   * @returns {boolean}
   */
  unHook (parentObj, hookMethods, type, fn) {
    if (!util.isRef(parentObj) || !hookMethods) {
      return false
    }

    const t = this;
    hookMethods = t._getObjKeysByRule(parentObj, hookMethods);
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        return false
      }

      const hookMethod = parentObj[methodName];

      if (!t.isHook(hookMethod)) {
        return false
      }

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName];
      const originMethod = hookMethodProperties.originMethod;

      if (type) {
        const hookKeyName = type + 'Hooks';
        const hooks = hookMethodProperties[hookKeyName] || [];

        if (fn) {
          /* 删除指定类型下的指定hook函数 */
          for (let i = 0; i < hooks.length; i++) {
            if (fn === hooks[i]) {
              hookMethodProperties[hookKeyName].splice(i, 1);
              util.debug.log(`[unHook ${hookKeyName} func] ${util.toStr(parentObj)} ${methodName}`, fn);
              break
            }
          }
        } else {
          /* 删除指定类型下的所有hook函数 */
          if (Array.isArray(hookMethodProperties[hookKeyName])) {
            hookMethodProperties[hookKeyName] = [];
            util.debug.log(`[unHook all ${hookKeyName}] ${util.toStr(parentObj)} ${methodName}`);
          }
        }
      } else {
        /* 彻底还原被hook的函数 */
        if (util.isFn(originMethod)) {
          parentObj[methodName] = originMethod;
          delete parentObj[methodName][t.hookPropertiesKeyName];

          // Object.keys(hookMethod).forEach(keyName => {
          //   if (/Hooks$/.test(keyName) && Array.isArray(hookMethod[keyName])) {
          //     hookMethod[keyName] = []
          //   }
          // })
          //
          // hookMethod.isHook = false
          // parentObj[methodName] = originMethod
          // delete parentObj[methodName].originMethod
          // delete parentObj[methodName].hookMethod
          // delete parentObj[methodName].isHook
          // delete parentObj[methodName].isClassHook

          util.debug.log(`[unHook method] ${util.toStr(parentObj)} ${methodName}`);
        }
      }
    });
  }

  /* 源函数运行前的hook */
  before (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'before', classHook, context, proxyHandler)
  }

  /* 源函数运行后的hook */
  after (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'after', classHook, context, proxyHandler)
  }

  /* 替换掉要hook的函数，不再运行源函数，换成运行其他逻辑 */
  replace (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'replace', classHook, context, proxyHandler)
  }

  /* 源函数运行出错时的hook */
  error (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'error', classHook, context, proxyHandler)
  }

  /* 底层实现逻辑与replace一样，都是替换掉要hook的函数，不再运行源函数，只不过是为了明确语义，将源函数挂起不再执行，原则上也不再执行其他逻辑，如果要执行其他逻辑请使用replace hook */
  hangUp (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'hangUp', classHook, context, proxyHandler)
  }
}

var hookJs = new HookJs();

/*!
 * @name         vueHooks.js
 * @description  对Vue对象进行的hooks封装
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/10 14:11
 * @github       https://github.com/xxxily
 */

const hookJsPro = hookJs.hookJsPro();

let vueComponentHook = null;

const vueHooks = {
  /* 对extend进行hooks封装，以便进行组件阻断 */
  blockComponents (Vue, config) {
    hookJsPro.before(Vue, 'extend', (args, parentObj, methodName, originMethod, execInfo, ctx) => {
      const extendOpts = args[0];
      // extendOpts.__file && debug.info(`[extendOptions:${extendOpts.name}]`, extendOpts.__file)

      const hasBlockFilter = config.blockFilters && config.blockFilters.length;
      if (hasBlockFilter && extendOpts.name && filtersMatch(config.blockFilters, extendOpts.name)) {
        debug.info(`[block component]: name: ${extendOpts.name}`);
        return 'STOP-INVOKE'
      }
    });

    /* 禁止因为阻断组件的创建而导致的错误提示输出，减少不必要的信息噪音 */
    hookJsPro.before(Vue.util, 'warn', (args) => {
      const msg = args[0];
      if (msg.includes('STOP-INVOKE')) {
        return 'STOP-INVOKE'
      }
    });
  },

  hackVueComponent (Vue, callback) {
    if (vueComponentHook) {
      debug.warn('[Vue.component] you have already hacked');
      return
    }

    vueComponentHook = (args, parentObj, methodName, originMethod, execInfo, ctx) => {
      const name = args[0];
      const opts = args[1];

      if (callback instanceof Function) {
        callback.apply(Vue, args);
      } else {
        /* 打印全局组件的注册信息 */
        if (Vue.options.components[name]) {
          debug.warn(`[Vue.component][REPEAT][old-cid:${Vue.options.components[name].cid}]`, name, opts);
        } else {
          debug.log('[Vue.component]', name, opts);
        }
      }
    };

    hookJsPro.before(Vue, 'component', vueComponentHook);
    debug.log(i18n.t('debugHelper.hackVueComponent.hack') + ' (success)');
  },

  unHackVueComponent (Vue) {
    if (vueComponentHook) {
      hookJsPro.unHook(Vue, 'component', 'before', vueComponentHook);
      vueComponentHook = null;
      debug.log(i18n.t('debugHelper.hackVueComponent.unhack') + ' (success)');
    } else {
      debug.warn('[Vue.component] you have not hack vue component, not need to unhack');
    }
  }
};

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

// Save original XMLHttpRequest as _rxhr
var realXhr = '_rxhr';

var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];

function configEvent (event, xhrProxy) {
  var e = {};
  for (var attr in event) e[attr] = event[attr];
  // xhrProxy instead
  e.target = e.currentTarget = xhrProxy;
  return e
}

function hook (proxy, win) {
  win = win || window;
  // Avoid double hookAjax
  win[realXhr] = win[realXhr] || win.XMLHttpRequest;

  win.XMLHttpRequest = function () {
    // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
    // guarantee that all attributes are on the prototype。
    // Instead, hooking XMLHttpRequest instance can avoid this problem.

    var xhr = new win[realXhr]();

    // Generate all callbacks(eg. onload) are enumerable (not undefined).
    for (var i = 0; i < events.length; ++i) {
      if (xhr[events[i]] === undefined) xhr[events[i]] = null;
    }

    for (var attr in xhr) {
      var type = '';
      try {
        type = typeof xhr[attr]; // May cause exception on some browser
      } catch (e) {
      }
      if (type === 'function') {
        // hookAjax methods of xhr, such as `open`、`send` ...
        this[attr] = hookFunction(attr);
      } else {
        Object.defineProperty(this, attr, {
          get: getterFactory(attr),
          set: setterFactory(attr),
          enumerable: true
        });
      }
    }
    var that = this;
    xhr.getProxy = function () {
      return that
    };
    this.xhr = xhr;
  };

  Object.assign(win.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });

  // Generate getter for attributes of xhr
  function getterFactory (attr) {
    return function () {
      var v = this.hasOwnProperty(attr + '_') ? this[attr + '_'] : this.xhr[attr];
      var attrGetterHook = (proxy[attr] || {}).getter;
      return attrGetterHook && attrGetterHook(v, this) || v
    }
  }

  // Generate setter for attributes of xhr; by this we have an opportunity
  // to hookAjax event callbacks （eg: `onload`） of xhr;
  function setterFactory (attr) {
    return function (v) {
      var xhr = this.xhr;
      var that = this;
      var hook = proxy[attr];
      // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
      if (attr.substring(0, 2) === 'on') {
        that[attr + '_'] = v;
        xhr[attr] = function (e) {
          e = configEvent(e, that);
          var ret = proxy[attr] && proxy[attr].call(that, xhr, e);
          ret || v.call(that, e);
        };
      } else {
        // If the attribute isn't writable, generate proxy attribute
        var attrSetterHook = (hook || {}).setter;
        v = attrSetterHook && attrSetterHook(v, that) || v;
        this[attr + '_'] = v;
        try {
          // Not all attributes of xhr are writable(setter may undefined).
          xhr[attr] = v;
        } catch (e) {
        }
      }
    }
  }

  // Hook methods of xhr.
  function hookFunction (fun) {
    return function () {
      var args = [].slice.call(arguments);
      if (proxy[fun]) {
        var ret = proxy[fun].call(this, args, this.xhr);
        // If the proxy return value exists, return it directly,
        // otherwise call the function of xhr.
        if (ret) return ret
      }
      return this.xhr[fun].apply(this.xhr, args)
    }
  }

  // Return the real XMLHttpRequest
  return win[realXhr]
}

function unHook (win) {
  win = win || window;
  if (win[realXhr]) win.XMLHttpRequest = win[realXhr];
  win[realXhr] = undefined;
}

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

var eventLoad = events[0];
var eventLoadEnd = events[1];
var eventTimeout = events[2];
var eventError = events[3];
var eventReadyStateChange = events[4];
var eventAbort = events[5];

var singleton;
var prototype = 'prototype';

function proxy (proxy, win) {
  if (singleton) {
    throw new Error('Proxy already exists')
  }

  singleton = new Proxy$1(proxy, win);
  return singleton
}

function unProxy (win) {
  singleton = null;
  unHook(win);
}

function trim (str) {
  return str.replace(/^\s+|\s+$/g, '')
}

function getEventTarget (xhr) {
  return xhr.watcher || (xhr.watcher = document.createElement('a'))
}

function triggerListener (xhr, name) {
  var xhrProxy = xhr.getProxy();
  var callback = 'on' + name + '_';
  var event = configEvent({ type: name }, xhrProxy);
  xhrProxy[callback] && xhrProxy[callback](event);
  var evt;
  if (typeof (Event) === 'function') {
    evt = new Event(name, { bubbles: false });
  } else {
    // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11
    evt = document.createEvent('Event');
    evt.initEvent(name, false, true);
  }
  getEventTarget(xhr).dispatchEvent(evt);
}

function Handler (xhr) {
  this.xhr = xhr;
  this.xhrProxy = xhr.getProxy();
}

Handler[prototype] = Object.create({
  resolve: function resolve (response) {
    var xhrProxy = this.xhrProxy;
    var xhr = this.xhr;
    xhrProxy.readyState = 4;
    xhr.resHeader = response.headers;
    xhrProxy.response = xhrProxy.responseText = response.response;
    xhrProxy.statusText = response.statusText;
    xhrProxy.status = response.status;
    triggerListener(xhr, eventReadyStateChange);
    triggerListener(xhr, eventLoad);
    triggerListener(xhr, eventLoadEnd);
  },
  reject: function reject (error) {
    this.xhrProxy.status = 0;
    triggerListener(this.xhr, error.type);
    triggerListener(this.xhr, eventLoadEnd);
  }
});

function makeHandler (next) {
  function sub (xhr) {
    Handler.call(this, xhr);
  }

  sub[prototype] = Object.create(Handler[prototype]);
  sub[prototype].next = next;
  return sub
}

var RequestHandler = makeHandler(function (rq) {
  var xhr = this.xhr;
  rq = rq || xhr.config;
  xhr.withCredentials = rq.withCredentials;
  xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
  for (var key in rq.headers) {
    xhr.setRequestHeader(key, rq.headers[key]);
  }
  xhr.send(rq.body);
});

var ResponseHandler = makeHandler(function (response) {
  this.resolve(response);
});

var ErrorHandler = makeHandler(function (error) {
  this.reject(error);
});

function Proxy$1 (proxy, win) {
  var onRequest = proxy.onRequest;
  var onResponse = proxy.onResponse;
  var onError = proxy.onError;

  function handleResponse (xhr, xhrProxy) {
    var handler = new ResponseHandler(xhr);
    var ret = {
      response: xhrProxy.response,
      status: xhrProxy.status,
      statusText: xhrProxy.statusText,
      config: xhr.config,
      headers: xhr.resHeader || xhr.getAllResponseHeaders().split('\r\n').reduce(function (ob, str) {
        if (str === '') return ob
        var m = str.split(':');
        ob[m.shift()] = trim(m.join(':'));
        return ob
      }, {})
    };
    if (!onResponse) return handler.resolve(ret)
    onResponse(ret, handler);
  }

  function onerror (xhr, xhrProxy, error, errorType) {
    var handler = new ErrorHandler(xhr);
    error = { config: xhr.config, error: error, type: errorType };
    if (onError) {
      onError(error, handler);
    } else {
      handler.next(error);
    }
  }

  function preventXhrProxyCallback () {
    return true
  }

  function errorCallback (errorType) {
    return function (xhr, e) {
      onerror(xhr, this, e, errorType);
      return true
    }
  }

  function stateChangeCallback (xhr, xhrProxy) {
    if (xhr.readyState === 4 && xhr.status !== 0) {
      handleResponse(xhr, xhrProxy);
    } else if (xhr.readyState !== 4) {
      triggerListener(xhr, eventReadyStateChange);
    }
    return true
  }

  return hook({
    onload: preventXhrProxyCallback,
    onloadend: preventXhrProxyCallback,
    onerror: errorCallback(eventError),
    ontimeout: errorCallback(eventTimeout),
    onabort: errorCallback(eventAbort),
    onreadystatechange: function (xhr) {
      return stateChangeCallback(xhr, this)
    },
    open: function open (args, xhr) {
      var _this = this;
      var config = xhr.config = { headers: {} };
      config.method = args[0];
      config.url = args[1];
      config.async = args[2];
      config.user = args[3];
      config.password = args[4];
      config.xhr = xhr;
      var evName = 'on' + eventReadyStateChange;
      if (!xhr[evName]) {
        xhr[evName] = function () {
          return stateChangeCallback(xhr, _this)
        };
      }

      // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，
      // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。
      //
      // 如果没有请求拦截器，则不用阻断xhr.open调用
      if (onRequest) return true
    },
    send: function (args, xhr) {
      var config = xhr.config;
      config.withCredentials = xhr.withCredentials;
      config.body = args[0];
      if (onRequest) {
        // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.
        // However, XHR's event handler may not be set until xhr.send is called in
        // the user's code, so we use `setTimeout` to avoid this situation
        var req = function () {
          onRequest(config, new RequestHandler(xhr));
        };
        config.async === false ? req() : setTimeout(req);
        return true
      }
    },
    setRequestHeader: function (args, xhr) {
      // Collect request headers
      xhr.config.headers[args[0].toLowerCase()] = args[1];
      return true
    },
    addEventListener: function (args, xhr) {
      var _this = this;
      if (events.indexOf(args[0]) !== -1) {
        var handler = args[1];
        getEventTarget(xhr).addEventListener(args[0], function (e) {
          var event = configEvent(e, _this);
          event.type = args[0];
          event.isTrusted = true;
          handler.call(_this, event);
        });
        return true
      }
    },
    getAllResponseHeaders: function (_, xhr) {
      var headers = xhr.resHeader;
      if (headers) {
        var header = '';
        for (var key in headers) {
          header += key + ': ' + headers[key] + '\r\n';
        }
        return header
      }
    },
    getResponseHeader: function (args, xhr) {
      var headers = xhr.resHeader;
      if (headers) {
        return headers[(args[0] || '').toLowerCase()]
      }
    }
  }, win)
}

/*!
 * @name         fetch-proxy.js
 * @description  fetch请求hook，用法保持跟 https://github.com/wendux/Ajax-hook 的xhr-proxy一致，以便支持fetch请求的监听和修改
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/20 16:18
 * @github       https://github.com/xxxily
 */

/**
 * 虽然此库用法保持跟Ajax-hook一致，但由于fetch最终对请求结果的消费方式与XMLHttpRequest不一样，
 * 所以在进行hook操作时必须加以区分
 *
 * 具体请参考：
 * https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
 *
 * 为了区别判断，将在onRequest, onResponse, onError的第三个参数标识是否为fetch请求，如果为true，则说明是是fetch请求
 * 然后按需对fetch对象进行区分处理即可
 */

const realFetch = '_rFetch_';

function makeHandler$1 (resolve, reject, next) {
  return Object.create({
    resolve,
    reject,
    next
  })
}

function fetchProxy (proxy = {}, win) {
  win = win || window;
  win[realFetch] = win[realFetch] || win.fetch;

  const { onRequest, onResponse, onError } = proxy;

  function customFetch () {
    /**
     * 提前锁定fetch，防止在onRequest进行异步操作时，
     * 外部触发了unFetchHook，再去找win[realFetch]已经查无此fetch了
     */
    const fetch = win[realFetch] || win.fetch;

    const t = this;
    let fetchResolve = function () {};
    let fetchReject = function () {};
    const args = arguments;
    const config = args[1] || {};

    /* 保持config参数结构跟Ajax-hook一致 */
    config.url = args[0];
    config.headers = config.headers || {};
    if (!config.method) {
      config.method = 'GET';
    } else {
      config.method = config.method.toUpperCase();
    }

    /* 发起真实请求 */
    async function gotoFetch (config) {
      const url = config.url;
      // delete config.url
      const args = [url, config];

      if (fetch === customFetch) {
        throw new Error('[fetch loop] fetch is equal to customFetch')
      }

      const response = await fetch.apply(t, args).catch((err) => {
        if (onError instanceof Function) {
          const errorHandler = makeHandler$1(fetchResolve, fetchReject, function (err) { fetchReject(err); });
          onError(err, errorHandler, true);
        } else {
          throw err
        }
      });

      if (onResponse instanceof Function) {
        const responseHandler = makeHandler$1(fetchResolve, fetchReject, function (response) { fetchResolve(response); });

        response.config = config;
        onResponse(response, responseHandler, true);
      } else {
        /* 完成请求 */
        fetchResolve(response);
      }
    }

    /* 判断由谁来发起真实的请求 */
    if (onRequest instanceof Function) {
      const requestHandler = makeHandler$1(fetchResolve, fetchReject, function (config) { gotoFetch(config); });
      onRequest(config, requestHandler, true);
    } else {
      gotoFetch(config);
    }

    /* 返回个空的promise，让gotoFetch进行真实的请求处理，并进行promise控制 */
    return new Promise((resolve, reject) => {
      fetchResolve = function (result) { resolve(result); };
      fetchReject = function (err) { reject(err); };
    })
  }

  win.fetch = customFetch;
}

function unFetchProxy (win) {
  win = win || window;
  if (win[realFetch]) {
    win.fetch = win[realFetch];
    delete win[realFetch];
  }
}

/* 使用示例 */
// fetchProxy({
//   onRequest: async (config, handler, isFetch) => {
//     console.log('[fetchHooks onRequest]', config.url, config)
//     handler.next(config)
//   },
//   onError: (err, handler, isFetch) => {
//     handler.next(err)
//   },
//   onResponse: async (response, handler, isFetch) => {
//     console.log('[fetchHooks onResponse]', response)

//     /* 当和Ajax-hook混合使用时，需要判断isFetch，进行区分处理 */
//     if (isFetch) {
//       const res = response.clone()
//       const result = await res.json().catch((err) => {
//         // 解析出错，忽略报错
//         if (err) {}
//       })
//       console.log('[fetchHooks onResponse json]', result)
//     }

//     handler.next(response)
//   }
// }, window)

/*!
 * @name         fetch-proxy.js
 * @description  fetch请求hook，用法保持跟 https://github.com/wendux/Ajax-hook 的xhr-proxy一致，以便支持fetch请求的监听和修改
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/20 16:18
 * @github       https://github.com/xxxily
 */

function networkProxy (proxyConf = {}, win) {
  proxy(proxyConf, win);
  fetchProxy(proxyConf, win);
}

function unNetworkProxy (win) {
  unProxy(win);
  unFetchProxy(win);
}

/*!
 * @name         cacheStore.js
 * @description  接口请求缓存存储管理模块
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/13 09:36
 * @github       https://github.com/xxxily
 */
const localforage = window.localforage;
const CryptoJS = window.CryptoJS;

function md5 (str) {
  return CryptoJS.MD5(str).toString()
}

function createHash (config) {
  if (config._hash_) {
    return config._hash_
  }

  let url = config.url || '';

  /**
   * 如果检测到url使用了时间戳来防止缓存，则进行替换，进行缓存
   * TODO
   * 注意，这很可能会导致误伤，例如url上的时间戳并不是用来清理缓存的，而是某个时间点的参数
   */
  if (/=\d{13}/.test(url)) {
    url = url.replace(/=\d{13}/, '=cache');
  }

  let hashStr = url + config.method;

  if (config.method.toUpperCase() === 'POST') {
    hashStr += JSON.stringify(config.data) + JSON.stringify(config.body);
  }

  const hash = md5(hashStr);

  // if (url.includes('weixin.qq.com')) {
  //   hash = md5(config.url.replace(/\?\S+/, ''))
  // }

  config._hash_ = hash;

  return hash
}

class CacheStore {
  constructor (opts = {
    localforageConfig: {}
  }) {
    this.store = localforage.createInstance(Object.assign({
      name: 'vue-debug-helper-cache',
      storeName: 'ajax-cache'
    }, opts.localforageConfig));

    /* 外部应该使用同样的hash生成方法，否则无法正常命中缓存规则 */
    this.createHash = createHash;
  }

  async getCache (config) {
    const hash = createHash(config);
    const data = await this.store.getItem(hash);
    return data
  }

  async setCache (response, isFetch) {
    const headers = response.headers || {};
    let isJsonResult = String(headers['content-type']).includes('application/json');

    let resData = response.response || null;
    if (isFetch && response.clone) {
      const res = response.clone();
      const resJson = await res.json().catch((err) => {
      });

      if (resJson) {
        isJsonResult = true;
        resData = JSON.stringify(resJson);
      }
    }

    if (resData && isJsonResult) {
      const hash = createHash(response.config);
      await this.store.setItem(hash, resData);

      /* 设置缓存的时候顺便更新缓存相关的基础信息，注意，该信息并不能100%被同步到本地 */
      await this.updateCacheInfo(response.config);

      debug.log(`[cacheStore setCache][${hash}] ${response.config.url}`, response);
    }
  }

  async getCacheInfo (config) {
    const hash = config ? this.createHash(config) : '';
    if (this._cacheInfo_) {
      return hash ? this._cacheInfo_[hash] : this._cacheInfo_
    }

    /* 在没将cacheInfo加载到内存前，只能单线程获取cacheInfo，防止多线程获取cacheInfo时出现问题 */
    if (this._takeingCacheInfo_) {
      const getCacheInfoHanderList = this._getCacheInfoHanderList_ || [];
      const P = new Promise((resolve, reject) => {
        getCacheInfoHanderList.push({
          resolve,
          config
        });
      });
      this._getCacheInfoHanderList_ = getCacheInfoHanderList;
      return P
    }

    this._takeingCacheInfo_ = true;
    const cacheInfo = await this.store.getItem('ajaxCacheInfo') || {};
    this._cacheInfo_ = cacheInfo;

    delete this._takeingCacheInfo_;
    if (this._getCacheInfoHanderList_) {
      this._getCacheInfoHanderList_.forEach(async (handler) => {
        handler.resolve(await this.getCacheInfo(handler.config));
      });
      delete this._getCacheInfoHanderList_;
    }

    return hash ? cacheInfo[hash] : cacheInfo
  }

  async updateCacheInfo (config) {
    const cacheInfo = await this.getCacheInfo();

    if (config) {
      const hash = createHash(config);
      if (hash && config) {
        const info = {
          url: config.url,
          cacheTime: Date.now()
        };

        // 增加或更新缓存的基本信息
        cacheInfo[hash] = info;
      }
    }

    if (!this._updateCacheInfoIsWorking_) {
      this._updateCacheInfoIsWorking_ = true;
      await this.store.setItem('ajaxCacheInfo', cacheInfo);
      this._updateCacheInfoIsWorking_ = false;
    }
  }

  /**
   * 清理已过期的缓存数据
   * @param {number} expires 指定过期时间，单位：毫秒
   * @returns
   */
  async cleanCache (expires) {
    if (!expires) {
      return
    }

    const cacheInfo = await this.getCacheInfo();
    const cacheInfoKeys = Object.keys(cacheInfo);
    const now = Date.now();

    const storeKeys = await this.store.keys();

    const needKeepKeys = cacheInfoKeys.filter(key => now - cacheInfo[key].cacheTime < expires);
    needKeepKeys.push('ajaxCacheInfo');

    const clearResult = [];

    /* 清理不需要的数据 */
    storeKeys.forEach((key) => {
      if (!needKeepKeys.includes(key)) {
        clearResult.push(this._cacheInfo_[key] || key);

        this.store.removeItem(key);
        delete this._cacheInfo_[key];
      }
    });

    /* 更新缓存信息 */
    if (clearResult.length) {
      await this.updateCacheInfo();
      debug.log('[cacheStore cleanCache] clearResult:', clearResult);
    }
  }

  async get (key) {
    const data = await this.store.getItem(key);
    debug.log('[cacheStore]', key, data);
    return data
  }

  async set (key, data) {
    await this.store.setItem(key, data);
    debug.log('[cacheStore]', key, data);
  }

  async remove (key) {
    await this.store.removeItem(key);
    debug.log('[cacheStore]', key);
  }

  async clear () {
    await this.store.clear();
    debug.log('[cacheStore] clear');
  }

  async keys () {
    const keys = await this.store.keys();
    debug.log('[cacheStore] keys', keys);
    return keys
  }
}

var cacheStore = new CacheStore();

/*!
 * @name         ajaxHooks.js
 * @description  底层请求hook
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/12 17:46
 * @github       https://github.com/xxxily
 */

/**
 * 判断是否符合进行缓存控制操作的条件
 * @param {object} config
 * @returns {boolean}
 */
function useCache (config) {
  const ajaxCache = helper.config.ajaxCache;
  if (ajaxCache.enabled) {
    return filtersMatch(ajaxCache.filters, config.url)
  } else {
    return false
  }
}

function isNeedBlockAjax (config) {
  const blockAjax = helper.config.blockAjax;
  if (blockAjax.enabled) {
    return filtersMatch(blockAjax.filters, config.url)
  } else {
    return false
  }
}

let ajaxHooksWin = window;

const ajaxHooks = {
  hook (win = ajaxHooksWin) {
    networkProxy({
      onRequest: async (config, handler, isFetch) => {
        const fetchTips = isFetch ? 'fetch ' : '';

        if (isNeedBlockAjax(config)) {
          handler.reject(new Error('ajax blocked'));
          debug.warn(`[ajaxHooks][blocked]${fetchTips}${config.method} ${config.url}`, config);
          return false
        }

        let hitCache = false;
        if (useCache(config)) {
          const cacheInfo = await cacheStore.getCacheInfo(config);
          const cache = await cacheStore.getCache(config);

          if (cache && cacheInfo) {
            const isExpires = Date.now() - cacheInfo.cacheTime > helper.config.ajaxCache.expires;

            if (!isExpires) {
              if (isFetch) {
                const customResponse = new Response(cache, {
                  status: 200,
                  statusText: 'ok',
                  url: config.url,
                  headers: new Headers({
                    'Content-Type': 'application/json'
                  })
                });
                handler.resolve(customResponse);
              } else {
                handler.resolve({
                  config: config,
                  status: 200,
                  headers: { 'content-type': 'application/json' },
                  response: cache
                });
              }

              hitCache = true;
            }
          }
        }

        if (hitCache) {
          debug.warn(`[ajaxHooks] use cache:${fetchTips}${config.method} ${config.url}`, config);
        } else {
          handler.next(config);
        }
      },

      onError: (err, handler, isFetch) => {
        handler.next(err);
      },

      onResponse: async (response, handler, isFetch) => {
        if (useCache(response.config)) {
          // 加入缓存
          cacheStore.setCache(response, isFetch);
        }

        handler.next(response);
      }
    }, win);
  },

  unHook (win = ajaxHooksWin, force = false) {
    if (force === true) {
      unNetworkProxy(win);
    } else {
      if (!helper.config.ajaxCache.enabled && !helper.config.blockAjax.enabled && !helper.config.replaceAjax.enabled) {
        unNetworkProxy(win);
      }
    }
  },

  init (win) {
    ajaxHooksWin = win;

    if (helper.config.ajaxCache.enabled || helper.config.blockAjax.enabled || helper.config.replaceAjax.enabled) {
      ajaxHooks.hook(ajaxHooksWin);
    }

    /* 定时清除接口的缓存数据，防止不断堆积 */
    setTimeout(() => {
      cacheStore.cleanCache(helper.config.ajaxCache.expires);
    }, 1000 * 10);
  }
};

/*!
 * @name         performanceObserver.js
 * @description  进行性能监测结果的打印
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/11 10:39
 * @github       https://github.com/xxxily
 */

const performanceObserver = {
  observer: null,
  init () {
    if (typeof PerformanceObserver === 'undefined') {
      debug.log(i18n.t('debugHelper.performanceObserver.notSupport'));
      return false
    }

    if (performanceObserver.observer && performanceObserver.observer.disconnect) {
      performanceObserver.observer.disconnect();
    }

    /* 不进行性能观察 */
    if (!helper.config.performanceObserver.enabled) {
      performanceObserver.observer = null;
      return false
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/observe
    performanceObserver.observer = new PerformanceObserver(function (list, observer) {
      if (!helper.config.performanceObserver.enabled) {
        return
      }

      const entries = list.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        debug.info(`[performanceObserver ${entry.entryType}]`, entry);
      }
    });

    // https://runebook.dev/zh-CN/docs/dom/performanceentry/entrytype
    performanceObserver.observer.observe({ entryTypes: helper.config.performanceObserver.entryTypes });
  }
};

/*!
 * @name         inspect.js
 * @description  vue组件审查模块
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/10 18:25
 * @github       https://github.com/xxxily
 */

const overlaySelector = 'vue-debugger-overlay';
const $ = window.$;
let currentComponent = null;

const inspect = {
  findComponentsByElement (el) {
    let result = null;
    let deep = 0;
    let parent = el;
    while (parent) {
      if (deep >= 50) {
        break
      }

      if (parent.__vue__) {
        result = parent;
        break
      }

      deep++;
      parent = parent.parentNode;
    }

    return result
  },

  getComponentInstance (el) {
    let vueComponent = el && el.__vue__ ? el.__vue__ : null;

    /* 忽略transition */
    if (vueComponent && vueComponent?.$options._componentTag === 'transition' && vueComponent.$parent) {
      vueComponent = vueComponent.$parent;
    }

    return vueComponent
  },

  initContextMenu () {
    if (this._hasInitContextMenu_) {
      return
    }

    function createComponentMenuItem (vueComponent, deep = 0) {
      let componentMenu = {};
      if (vueComponent) {
        helper.methods.initComponentInfo(vueComponent);

        componentMenu = {
          consoleComponent: {
            name: `${i18n.t('contextMenu.consoleComponent')} <${vueComponent._componentName}>`,
            icon: 'fa-eye',
            callback: function (key, options) {
              debug.log(`[vueComponent] ${vueComponent._componentTag}`, vueComponent);
            }
          },
          consoleComponentData: {
            name: `${i18n.t('contextMenu.consoleComponentData')} <${vueComponent._componentName}>`,
            icon: 'fa-eye',
            callback: function (key, options) {
              debug.log(`[vueComponentData] ${vueComponent._componentTag}`, vueComponent.$data);
            }
          },
          consoleComponentProps: {
            name: `${i18n.t('contextMenu.consoleComponentProps')} <${vueComponent._componentName}>`,
            icon: 'fa-eye',
            callback: function (key, options) {
              debug.log(`[vueComponentProps] ${vueComponent._componentTag}`, vueComponent.$props);
            }
          }
          // consoleComponentChain: {
          //   name: `${i18n.t('contextMenu.consoleComponentChain')} <${vueComponent._componentName}>`,
          //   icon: 'fa-eye',
          //   callback: function (key, options) {
          //     debug.log(`[vueComponentMethods] ${vueComponent._componentTag}`, vueComponent._componentChain)
          //   }
          // }
        };
      }

      if (vueComponent.$parent && deep <= 5) {
        componentMenu.parentComponent = {
          name: `${i18n.t('contextMenu.consoleParentComponent')} <${vueComponent.$parent._componentName}>`,
          icon: 'fa-eye',
          items: createComponentMenuItem(vueComponent.$parent, deep + 1)
        };
      }

      const file = vueComponent.options?.__file || vueComponent.$options?.__file || '';
      let copyFilePath = {};
      if (file) {
        copyFilePath = {
          copyFilePath: {
            name: `${i18n.t('contextMenu.copyFilePath')}`,
            icon: 'fa-copy',
            callback: function (key, options) {
              debug.log(`[componentFilePath ${vueComponent._componentName}] ${file}`);
              copyToClipboard(file);
            }
          }
        };
      }

      componentMenu.componentAction = {
        name: `${i18n.t('contextMenu.componentAction')} <${vueComponent._componentName}>`,
        icon: 'fa-cog',
        items: {
          ...copyFilePath,
          copyComponentName: {
            name: `${i18n.t('contextMenu.copyComponentName')} <${vueComponent._componentName}>`,
            icon: 'fa-copy',
            callback: function (key, options) {
              copyToClipboard(vueComponent._componentName);
            }
          },
          copyComponentData: {
            name: `${i18n.t('contextMenu.copyComponentData')} <${vueComponent._componentName}>`,
            icon: 'fa-copy',
            callback: function (key, options) {
              const data = JSON.stringify(vueComponent.$data, null, 2);
              debug.log(`[vueComponentData] ${vueComponent._componentName}`, JSON.parse(data));
              debug.log(data);
              copyToClipboard(data);
            }
          },
          copyComponentProps: {
            name: `${i18n.t('contextMenu.copyComponentProps')} <${vueComponent._componentName}>`,
            icon: 'fa-copy',
            callback: function (key, options) {
              const props = JSON.stringify(vueComponent.$props, null, 2);
              debug.log(`[vueComponentProps] ${vueComponent._componentName}`, JSON.parse(props));
              debug.log(props);
              copyToClipboard(props);
            }
          },
          // copyComponentTag: {
          //   name: `${i18n.t('contextMenu.copyComponentTag')} <${vueComponent._componentName}>`,
          //   icon: 'fa-copy',
          //   callback: function (key, options) {
          //     copyToClipboard(vueComponent._componentTag)
          //   }
          // },
          copyComponentUid: {
            name: `${i18n.t('contextMenu.copyComponentUid')} -> ${vueComponent._uid}`,
            icon: 'fa-copy',
            callback: function (key, options) {
              copyToClipboard(vueComponent._uid);
            }
          },
          copyComponentChian: {
            name: `${i18n.t('contextMenu.copyComponentChian')}`,
            icon: 'fa-copy',
            callback: function (key, options) {
              debug.log(`[vueComponentChain] ${vueComponent._componentName}`, vueComponent._componentChain);
              copyToClipboard(vueComponent._componentChain);
            }
          },
          findComponents: {
            name: `${i18n.t('contextMenu.findComponents')} <${vueComponent._componentName}>`,
            icon: 'fa-search',
            callback: function (key, options) {
              functionCall.findComponents(vueComponent._componentName);
            }
          },
          printLifeCycleInfo: {
            name: `${i18n.t('contextMenu.printLifeCycleInfo')} <${vueComponent._componentName}>`,
            icon: 'fa-print',
            callback: function (key, options) {
              functionCall.printLifeCycleInfo(vueComponent._componentName);
            }
          },
          blockComponents: {
            name: `${i18n.t('contextMenu.blockComponents')} <${vueComponent._componentName}>`,
            icon: 'fa-ban',
            callback: function (key, options) {
              functionCall.blockComponents(vueComponent._componentName);
            }
          }
        }
      };

      return componentMenu
    }

    $.contextMenu({
      selector: 'body.vue-debug-helper-inspect-mode',
      zIndex: 2147483647,
      className: 'vue-debug-helper-context-menu',
      build: function ($trigger, e) {
        const conf = helper.config;
        const vueComponent = inspect.getComponentInstance(currentComponent);

        let componentMenu = {};
        if (vueComponent) {
          componentMenu = createComponentMenuItem(vueComponent);
          componentMenu.componentMenuSeparator = '---------';
        }

        const componentsStatisticsInfo = {
          componentsStatistics: {
            name: i18n.t('debugHelper.componentsStatistics'),
            icon: 'fa-thin fa-info-circle',
            callback: functionCall.componentsStatistics
          },
          componentsSummaryStatisticsSort: {
            name: i18n.t('debugHelper.componentsSummaryStatisticsSort'),
            icon: 'fa-thin fa-info-circle',
            callback: functionCall.componentsSummaryStatisticsSort
          },
          destroyStatisticsSort: {
            name: i18n.t('debugHelper.destroyStatisticsSort'),
            icon: 'fa-regular fa-trash',
            callback: functionCall.destroyStatisticsSort
          },
          clearAll: {
            name: i18n.t('debugHelper.clearAll'),
            icon: 'fa-regular fa-close',
            callback: functionCall.clearAll
          }
        };

        const commonMenu = {
          findComponents: {
            name: i18n.t('debugHelper.findComponents'),
            icon: 'fa-regular fa-search',
            callback: () => {
              functionCall.findComponents();
            }
          },
          blockComponents: {
            name: i18n.t('debugHelper.blockComponents'),
            icon: 'fa-regular fa-ban',
            callback: () => {
              functionCall.blockComponents();
            }
          },
          printLifeCycleInfo: {
            name: conf.lifecycle.show ? i18n.t('debugHelper.notPrintLifeCycleInfo') : i18n.t('debugHelper.printLifeCycleInfo'),
            icon: 'fa-regular fa-life-ring',
            callback: () => {
              conf.lifecycle.show ? functionCall.notPrintLifeCycleInfo() : functionCall.printLifeCycleInfo();
            }
          },
          dd: {
            name: conf.dd.enabled ? i18n.t('debugHelper.undd') : i18n.t('debugHelper.dd'),
            icon: 'fa-regular fa-arrows-alt',
            callback: conf.dd.enabled ? functionCall.undd : functionCall.dd
          },
          toggleHackVueComponent: {
            name: conf.hackVueComponent ? i18n.t('debugHelper.hackVueComponent.unhack') : i18n.t('debugHelper.hackVueComponent.hack'),
            icon: 'fa-regular fa-bug',
            callback: functionCall.toggleHackVueComponent
          },
          componentFunSeparator: '---------',
          toggleAjaxCache: {
            name: conf.ajaxCache.enabled ? i18n.t('debugHelper.ajaxCacheStatus.off') : i18n.t('debugHelper.ajaxCacheStatus.on'),
            icon: 'fa-regular fa-database',
            callback: functionCall.toggleAjaxCache
          },
          clearAjaxCache: {
            name: i18n.t('debugHelper.clearAjaxCache'),
            icon: 'fa-regular fa-database',
            callback: functionCall.clearAjaxCache
          },
          toggleBlockAjax: {
            name: conf.blockAjax.enabled ? i18n.t('debugHelper.blockAjax.disable') : i18n.t('debugHelper.blockAjax.enabled'),
            icon: 'fa-regular fa-ban',
            callback: functionCall.toggleBlockAjax
          },
          togglePerformanceObserver: {
            name: conf.performanceObserver.enabled ? i18n.t('debugHelper.performanceObserverStatus.off') : i18n.t('debugHelper.performanceObserverStatus.on'),
            icon: 'fa-regular fa-paint-brush',
            callback: functionCall.togglePerformanceObserver
          },
          measureSelectorInterval: {
            name: i18n.t('debugHelper.measureSelectorInterval'),
            icon: 'fa-regular fa-clock-o',
            callback: functionCall.measureSelectorInterval
          },
          commonEndSeparator: '---------'
        };

        const moreMenu = {
          ...(conf.contextMenu.simplify ? commonMenu : {}),
          help: {
            name: i18n.t('help'),
            icon: 'fa-regular fa-question-circle',
            items: {
              docs: {
                name: i18n.t('docs'),
                icon: 'fa-regular fa-book',
                callback: () => { openInTab('https://github.com/xxxily/vue-debug-helper'); }
              },
              about: {
                name: i18n.t('about'),
                icon: 'fa-regular fa-info-circle',
                callback: () => { openInTab('https://github.com/xxxily/vue-debug-helper'); }
              },
              issues: {
                name: i18n.t('issues'),
                icon: 'fa-regular fa-bug',
                callback: () => { openInTab('https://github.com/xxxily/vue-debug-helper/issues'); }
              },
              update: {
                name: i18n.t('update'),
                icon: 'fa-regular fa-refresh',
                callback: () => { openInTab('https://greasyfork.org/zh-CN/scripts/444075'); }
              }
            }
          },
          toggleSimplifyMode: {
            name: conf.contextMenu.simplify ? i18n.t('debugHelper.simplifyMode.disable') : i18n.t('debugHelper.simplifyMode.enabled'),
            icon: 'fa-regular fa-compress',
            callback: functionCall.toggleSimplifyMode
          },
          toggleInspect: {
            name: conf.inspect.enabled ? i18n.t('debugHelper.inspectStatus.off') : i18n.t('debugHelper.inspectStatus.on'),
            icon: 'fa-regular fa-eye',
            callback: functionCall.toggleInspect
          }
        };

        const menu = {
          callback: function (key, options) {
            debug.log(`[contextMenu] ${key}`);
          },
          items: {
            refresh: {
              name: i18n.t('refreshPage'),
              icon: 'fa-refresh',
              callback: function (key, options) {
                window.location.reload();
              }
            },
            sep0: '---------',
            ...componentMenu,
            ...componentsStatisticsInfo,
            statisticsSeparator: '---------',
            ...(conf.contextMenu.simplify ? {} : commonMenu),
            more: {
              name: i18n.t('contextMenu.more'),
              icon: 'fa-ellipsis-h',
              items: {
                ...moreMenu
              }
            },
            quit: {
              name: i18n.t('quit'),
              icon: 'fa-close',
              callback: function ($element, key, item) {
                return 'context-menu-icon context-menu-icon-quit'
              }
            }
          }
        };

        return menu
      }
    });

    /* 主动触发右键，解决部分右键菜单已被提前注册且禁止冒泡导致右键无法触发的问题 */
    document.addEventListener('contextmenu', function (e) {
      helper.config.inspect.enabled && $('body.vue-debug-helper-inspect-mode').contextMenu({ x: e.pageX, y: e.pageY });
    }, true);

    this._hasInitContextMenu_ = true;
  },

  setOverlay (el) {
    let overlay = document.querySelector('#' + overlaySelector);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlaySelector;

      const infoBox = document.createElement('div');
      infoBox.className = 'vue-debugger-component-info';

      const styleDom = document.createElement('style');
      styleDom.appendChild(document.createTextNode(`
        .vue-debug-helper-context-menu {
          font-size: 14px;
        }
        #${overlaySelector} {
          position: fixed;
          z-index: 2147483647;
          background-color: rgba(65, 184, 131, 0.15);
          padding: 5px;
          font-size: 11px;
          pointer-events: none;
          box-size: border-box;
          border-radius: 3px;
          overflow: visible;
        }

        #${overlaySelector} .vue-debugger-component-info {
          position: absolute;
          top: -30px;
          left: 0;
          line-height: 1.5;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          background-color: #fff;
          font-family: monospace; 
          font-size: 11px;
          color: rgb(51, 51, 51); 
          text-align: center; 
          border: 1px solid rgba(65, 184, 131, 0.5); 
          background-clip: padding-box;
          pointer-events: none;
          white-space: nowrap;
        }
      `));

      overlay.appendChild(infoBox);
      document.body.appendChild(styleDom);
      document.body.appendChild(overlay);
    }

    /* 批量设置样式，减少样式扰动 */
    const rect = el.getBoundingClientRect();
    const overlayStyle = [
      `width: ${rect.width}px;`,
      `height: ${rect.height}px;`,
      `top: ${rect.top}px;`,
      `left: ${rect.left}px;`,
      'display: block;'
    ].join(' ');
    overlay.setAttribute('style', overlayStyle);

    const vm = inspect.getComponentInstance(el);
    if (vm) {
      helper.methods.initComponentInfo(vm);
      const name = vm._componentName || vm._componentTag || vm._uid;
      const infoBox = overlay.querySelector('.vue-debugger-component-info');

      infoBox.innerHTML = [
        '<span style="opacity: 0.6;">&lt;</span>',
        `<span style="font-weight: bold; color: rgb(9, 171, 86);">${name}</span>`,
        '<span style="opacity: 0.6;">&gt;</span>',
        `<span style="opacity: 0.5; margin-left: 6px;">${Math.round(rect.width)}<span style="margin-right: 2px; margin-left: 2px;">×</span>${Math.round(rect.height)}</span>`
      ].join('');

      rect.y < 32 ? (infoBox.style.top = '0') : (infoBox.style.top = '-30px');
    }

    $(document.body).addClass('vue-debug-helper-inspect-mode');
    inspect.initContextMenu();
  },

  clearOverlay () {
    $(document.body).removeClass('vue-debug-helper-inspect-mode');
    const overlay = document.querySelector('#vue-debugger-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },

  init (Vue) {
    document.body.addEventListener('mouseover', (event) => {
      if (!helper.config.inspect.enabled) {
        return
      }

      const componentEl = inspect.findComponentsByElement(event.target);

      if (componentEl) {
        currentComponent = componentEl;
        inspect.setOverlay(componentEl);
      } else {
        currentComponent = null;
      }
    });
  }
};

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
  if (!docRoot) return false
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

/*!
 * @name         functionCall.js
 * @description  统一的提供外部功能调用管理模块
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/04/27 17:42
 * @github       https://github.com/xxxily
 */

const functionCall = {
  toggleInspect () {
    helper.config.inspect.enabled = !helper.config.inspect.enabled;
    debug.log(`${i18n.t('debugHelper.toggleInspect')} success (${helper.config.inspect.enabled})`);

    if (!helper.config.inspect.enabled) {
      inspect.clearOverlay();
    }
  },
  viewVueDebugHelperObject () {
    debug.log(i18n.t('debugHelper.viewVueDebugHelperObject'), helper);
  },
  componentsStatistics () {
    const result = helper.methods.componentsStatistics();
    let total = 0;

    /* 提供友好的可视化展示方式 */
    console.table && console.table(result.map(item => {
      total += item.componentInstance.length;
      return {
        componentName: item.componentName,
        count: item.componentInstance.length
      }
    }));

    debug.log(`${i18n.t('debugHelper.componentsStatistics')} (total:${total})`, result);
  },
  destroyStatisticsSort () {
    const result = helper.methods.destroyStatisticsSort();
    let total = 0;

    /* 提供友好的可视化展示方式 */
    console.table && console.table(result.map(item => {
      const durationList = item.destroyList.map(item => item.duration);
      const maxDuration = Math.max(...durationList);
      const minDuration = Math.min(...durationList);
      const durationRange = maxDuration - minDuration;
      total += item.destroyList.length;

      return {
        componentName: item.componentName,
        count: item.destroyList.length,
        avgDuration: durationList.reduce((pre, cur) => pre + cur, 0) / durationList.length,
        maxDuration,
        minDuration,
        durationRange,
        durationRangePercent: (1000 - minDuration) / durationRange
      }
    }));

    debug.log(`${i18n.t('debugHelper.destroyStatisticsSort')} (total:${total})`, result);
  },
  componentsSummaryStatisticsSort () {
    const result = helper.methods.componentsSummaryStatisticsSort();
    let total = 0;

    /* 提供友好的可视化展示方式 */
    console.table && console.table(result.map(item => {
      total += item.componentsSummary.length;
      return {
        componentName: item.componentName,
        count: item.componentsSummary.length
      }
    }));

    debug.log(`${i18n.t('debugHelper.componentsSummaryStatisticsSort')} (total:${total})`, result);
  },
  getDestroyByDuration () {
    const destroyInfo = helper.methods.getDestroyByDuration();
    console.table && console.table(destroyInfo.destroyList);
    debug.log(i18n.t('debugHelper.getDestroyByDuration'), destroyInfo);
  },
  clearAll () {
    helper.methods.clearAll();
    debug.log(i18n.t('debugHelper.clearAll'));
  },

  printLifeCycleInfo (str) {
    addToFilters(helper.config.lifecycle, 'componentFilters', str);

    const lifecycleFilters = window.prompt(i18n.t('debugHelper.printLifeCycleInfoPrompt.lifecycleFilters'), helper.config.lifecycle.filters.join(','));
    const componentFilters = window.prompt(i18n.t('debugHelper.printLifeCycleInfoPrompt.componentFilters'), helper.config.lifecycle.componentFilters.join(','));

    if (lifecycleFilters !== null && componentFilters !== null) {
      debug.log(i18n.t('debugHelper.printLifeCycleInfo'));
      helper.methods.printLifeCycleInfo(lifecycleFilters, componentFilters);
    }
  },

  notPrintLifeCycleInfo () {
    debug.log(i18n.t('debugHelper.notPrintLifeCycleInfo'));
    helper.methods.notPrintLifeCycleInfo();
  },

  findComponents (str) {
    addToFilters(helper.config, 'findComponentsFilters', str);

    const filters = window.prompt(i18n.t('debugHelper.findComponentsPrompt.filters'), helper.config.findComponentsFilters.join(','));
    if (filters !== null) {
      debug.log(i18n.t('debugHelper.findComponents'), helper.methods.findComponents(filters));
    }
  },

  findNotContainElementComponents () {
    debug.log(i18n.t('debugHelper.findNotContainElementComponents'), helper.methods.findNotContainElementComponents());
  },

  blockComponents (str) {
    addToFilters(helper.config, 'blockFilters', str);

    const filters = window.prompt(i18n.t('debugHelper.blockComponentsPrompt.filters'), helper.config.blockFilters.join(','));
    if (filters !== null) {
      helper.methods.blockComponents(filters);
      debug.log(i18n.t('debugHelper.blockComponents'), filters);
    }
  },

  dd () {
    const filter = window.prompt(i18n.t('debugHelper.ddPrompt.filter'), helper.config.dd.filters.join(','));
    const count = window.prompt(i18n.t('debugHelper.ddPrompt.count'), helper.config.dd.count);

    if (filter !== null && count !== null) {
      debug.log(i18n.t('debugHelper.dd'));
      helper.methods.dd(filter, Number(count));
    }
  },

  undd () {
    debug.log(i18n.t('debugHelper.undd'));
    helper.methods.undd();
  },

  toggleHackVueComponent () {
    helper.config.hackVueComponent ? vueHooks.unHackVueComponent() : vueHooks.hackVueComponent();
    helper.config.hackVueComponent = !helper.config.hackVueComponent;
  },

  togglePerformanceObserver () {
    helper.config.performanceObserver.enabled = !helper.config.performanceObserver.enabled;

    if (helper.config.performanceObserver.enabled) {
      let entryTypes = window.prompt(i18n.t('debugHelper.performanceObserverPrompt.entryTypes'), helper.config.performanceObserver.entryTypes.join(','));
      if (entryTypes) {
        const entryTypesArr = toArrFilters(entryTypes);
        const supportEntryTypes = ['element', 'navigation', 'resource', 'mark', 'measure', 'paint', 'longtask'];

        /* 过滤出支持的entryTypes */
        entryTypes = entryTypesArr.filter(item => supportEntryTypes.includes(item));

        if (entryTypes.length !== entryTypesArr.length) {
          debug.warn(`some entryTypes not support, only support: ${supportEntryTypes.join(',')}`);
        }

        helper.config.performanceObserver.entryTypes = entryTypes;

        performanceObserver.init();
      } else {
        alert('entryTypes is empty');
      }
    }

    debug.log(`${i18n.t('debugHelper.togglePerformanceObserver')} success (${helper.config.performanceObserver.enabled})`);
  },

  useAjaxCache () {
    helper.config.ajaxCache.enabled = true;

    const filters = window.prompt(i18n.t('debugHelper.jaxCachePrompt.filters'), helper.config.ajaxCache.filters.join(','));
    const expires = window.prompt(i18n.t('debugHelper.jaxCachePrompt.expires'), helper.config.ajaxCache.expires / 1000 / 60);

    if (filters && expires) {
      helper.config.ajaxCache.filters = toArrFilters(filters);

      if (!isNaN(Number(expires))) {
        helper.config.ajaxCache.expires = Number(expires) * 1000 * 60;
      }

      ajaxHooks.hook();

      debug.log(`${i18n.t('debugHelper.enableAjaxCacheTips')}`);
    }
  },

  disableAjaxCache () {
    helper.config.ajaxCache.enabled = false;
    ajaxHooks.unHook();
    debug.log(`${i18n.t('debugHelper.disableAjaxCacheTips')}`);
  },

  toggleAjaxCache () {
    if (helper.config.ajaxCache.enabled) {
      functionCall.disableAjaxCache();
    } else {
      functionCall.useAjaxCache();
    }
  },

  async clearAjaxCache () {
    await cacheStore.store.clear();
    debug.log(`${i18n.t('debugHelper.clearAjaxCacheTips')}`);
  },

  useBlockAjax () {
    helper.config.blockAjax.enabled = true;

    const filters = window.prompt(i18n.t('debugHelper.blockAjax.prompt.filters'), helper.config.blockAjax.filters.join(','));
    if (filters) {
      helper.config.blockAjax.filters = toArrFilters(filters);
      ajaxHooks.hook();
      debug.log(`${i18n.t('debugHelper.blockAjax.enabled')} success (${helper.config.blockAjax.filters.join(',')})`);
    }
  },

  disableBlockAjax () {
    helper.config.blockAjax.enabled = false;
    ajaxHooks.unHook();
    debug.log(`${i18n.t('debugHelper.blockAjax.disable')} success`);
  },

  toggleBlockAjax () {
    if (helper.config.blockAjax.enabled) {
      functionCall.disableBlockAjax();
    } else {
      functionCall.useBlockAjax();
    }
  },

  addMeasureSelectorInterval (selector1, selector2) {
    let result = {};
    if (!functionCall._measureSelectorArr) {
      functionCall._measureSelectorArr = [];
    }

    function measure (element) {
      // debug.log(`[measure] ${i18n.t('debugHelper.measureSelectorInterval')}`, element)

      const selector1 = helper.config.measureSelectorInterval.selector1;
      const selector2 = helper.config.measureSelectorInterval.selector2;
      const selectorArr = [selector1, selector2];
      selectorArr.forEach(selector => {
        if (selector && element.parentElement && element.parentElement.querySelector(selector)) {
          result[selector] = {
            time: Date.now(),
            element: element
          };

          debug.info(`${i18n.t('debugHelper.selectorReadyTips')}: ${selector}`, element);
        }
      });

      if (Object.keys(result).length >= 2) {
        const time = ((result[selector2].time - result[selector1].time) / 1000).toFixed(2);

        debug.info(`[[${selector1}] -> [${selector2}]] time: ${time}s`);
        result = {};
      }
    }

    if (selector1 && selector2) {
      helper.config.measureSelectorInterval.selector1 = selector1;
      helper.config.measureSelectorInterval.selector2 = selector2;

      const selectorArr = [selector1, selector2];
      selectorArr.forEach(selector => {
        if (!functionCall._measureSelectorArr.includes(selector)) {
          // 防止重复注册
          functionCall._measureSelectorArr.push(selector);

          ready(selector, measure);
        }
      });
    } else {
      debug.log('selector is empty, please input selector');
    }
  },

  initMeasureSelectorInterval () {
    const selector1 = helper.config.measureSelectorInterval.selector1;
    const selector2 = helper.config.measureSelectorInterval.selector2;
    if (selector1 && selector2) {
      functionCall.addMeasureSelectorInterval(selector1, selector2);
      debug.log('[measureSelectorInterval] init success');
    }
  },

  measureSelectorInterval () {
    const selector1 = window.prompt(i18n.t('debugHelper.measureSelectorIntervalPrompt.selector1'), helper.config.measureSelectorInterval.selector1);
    const selector2 = window.prompt(i18n.t('debugHelper.measureSelectorIntervalPrompt.selector2'), helper.config.measureSelectorInterval.selector2);

    if (!selector1 && !selector2) {
      helper.config.measureSelectorInterval.selector1 = '';
      helper.config.measureSelectorInterval.selector2 = '';
    }

    functionCall.addMeasureSelectorInterval(selector1, selector2);
  },

  toggleSimplifyMode () {
    helper.config.contextMenu.simplify = !helper.config.contextMenu.simplify;
    const msg = helper.config.contextMenu.simplify ? i18n.t('debugHelper.simplifyMode.enabled') : i18n.t('debugHelper.simplifyMode.disable');
    debug.log(`${msg} success`);
  }
};

/*!
 * @name         menu.js
 * @description  vue-debug-helper的菜单配置
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/04/25 22:28
 * @github       https://github.com/xxxily
 */

const vueStatus = {
  status: ''
};

function menuRegister (vueDetectStatus) {
  vueStatus.status = vueDetectStatus;

  function menuBuilder () {
    const conf = helper.config;
    let menuList = [];

    if (vueStatus.status) {
      if (vueStatus.status === 'initing') {
        menuList.push({
          title: 'Vue Detecting...',
          fn: () => { debug.log('Vue Detecting...'); }
        });
      } else if (vueStatus.status === 'failed') {
        menuList.push({
          title: 'Vue not detected',
          fn: () => { debug.log('Vue not detected'); }
        });
      } else if (vueStatus.status === 'success') {
        const vueMenu = [
          {
            title: conf.inspect.enabled ? i18n.t('debugHelper.inspectStatus.off') : i18n.t('debugHelper.inspectStatus.on'),
            fn: () => { functionCall.toggleInspect(); }
          },
          {
            title: i18n.t('debugHelper.viewVueDebugHelperObject'),
            fn: () => { functionCall.viewVueDebugHelperObject(); }
          },
          {
            title: i18n.t('debugHelper.componentsStatistics'),
            fn: () => { functionCall.componentsStatistics(); }
          },
          {
            title: i18n.t('debugHelper.componentsSummaryStatisticsSort'),
            fn: () => { functionCall.componentsSummaryStatisticsSort(); }
          },
          {
            title: i18n.t('debugHelper.destroyStatisticsSort'),
            fn: () => { functionCall.destroyStatisticsSort(); }
          },
          {
            title: i18n.t('debugHelper.clearAll'),
            fn: () => { functionCall.clearAll(); }
          },
          {
            title: i18n.t('debugHelper.getDestroyByDuration'),
            fn: () => { functionCall.getDestroyByDuration(); }
          },
          {
            title: i18n.t('debugHelper.findComponents'),
            fn: () => { functionCall.findComponents(); }
          },
          {
            title: i18n.t('debugHelper.blockComponents'),
            fn: () => { functionCall.blockComponents(); }
          },
          {
            title: conf.lifecycle.show ? i18n.t('debugHelper.notPrintLifeCycleInfo') : i18n.t('debugHelper.printLifeCycleInfo'),
            fn: () => { conf.lifecycle.show ? functionCall.notPrintLifeCycleInfo() : functionCall.printLifeCycleInfo(); }
          },
          {
            title: conf.dd.enabled ? i18n.t('debugHelper.undd') : i18n.t('debugHelper.dd'),
            fn: () => { conf.dd.enabled ? functionCall.undd() : functionCall.dd(); }
          },
          {
            title: conf.hackVueComponent ? i18n.t('debugHelper.hackVueComponent.unhack') : i18n.t('debugHelper.hackVueComponent.hack'),
            fn: () => { functionCall.toggleHackVueComponent(); }
          },
          {
            title: helper.config.devtools ? i18n.t('debugHelper.devtools.disable') : i18n.t('debugHelper.devtools.enabled'),
            fn: () => { helper.methods.toggleDevtools(); }
          }
        ];
        menuList = menuList.concat(vueMenu);
      }
    }

    const commonMenu = [
      {
        title: conf.ajaxCache.enabled ? i18n.t('debugHelper.ajaxCacheStatus.off') : i18n.t('debugHelper.ajaxCacheStatus.on'),
        fn: () => { functionCall.toggleAjaxCache(); }
      },
      {
        title: i18n.t('debugHelper.clearAjaxCache'),
        fn: () => { functionCall.clearAjaxCache(); }
      },
      {
        title: conf.blockAjax.enabled ? i18n.t('debugHelper.blockAjax.disable') : i18n.t('debugHelper.blockAjax.enabled'),
        fn: () => { functionCall.toggleBlockAjax(); }
      },
      {
        title: conf.performanceObserver.enabled ? i18n.t('debugHelper.performanceObserverStatus.off') : i18n.t('debugHelper.performanceObserverStatus.on'),
        fn: () => { functionCall.togglePerformanceObserver(); }
      },
      {
        title: i18n.t('debugHelper.measureSelectorInterval'),
        fn: () => { functionCall.measureSelectorInterval(); }
      },
      {
        title: i18n.t('issues'),
        fn: () => { openInTab('https://github.com/xxxily/vue-debug-helper/issues'); }
      },
      {
        disable: true,
        title: i18n.t('donate'),
        fn: () => { openInTab('https://cdn.jsdelivr.net/gh/xxxily/vue-debug-helper@main/donate.png'); }
      }
    ];

    menuList = menuList.concat(commonMenu);
    return menuList
  }

  /* 注册动态菜单 */
  monkeyMenu.build(menuBuilder);
}

const isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false;

// 绑定事件
function addEvent (object, event, method) {
  if (object.addEventListener) {
    object.addEventListener(event, method, false);
  } else if (object.attachEvent) {
    object.attachEvent(`on${event}`, () => { method(window.event); });
  }
}

// 修饰键转换成对应的键码
function getMods (modifier, key) {
  const mods = key.slice(0, key.length - 1);
  for (let i = 0; i < mods.length; i++) mods[i] = modifier[mods[i].toLowerCase()];
  return mods
}

// 处理传的key字符串转换成数组
function getKeys (key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等
  const keys = key.split(','); // 同时设置多个快捷键，以','分割
  let index = keys.lastIndexOf('');

  // 快捷键可能包含','，需特殊处理
  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys
}

// 比较修饰键的数组
function compareArray (a1, a2) {
  const arr1 = a1.length >= a2.length ? a1 : a2;
  const arr2 = a1.length >= a2.length ? a2 : a1;
  let isIndex = true;

  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }
  return isIndex
}

// Special Keys
const _keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
};

// Modifier Keys
const _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
const modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',

  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
const _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
const _handlers = {};

// F1~F12 special key
for (let k = 1; k < 20; k++) {
  _keyMap[`f${k}`] = 111 + k;
}

// https://github.com/jaywcjlove/hotkeys

let _downKeys = []; // 记录摁下的绑定键
let winListendFocus = false; // window是否已经监听了focus事件
let _scope = 'all'; // 默认热键范围
const elementHasBindEvent = []; // 已绑定事件的节点记录

// 返回键码
const code = (x) => _keyMap[x.toLowerCase()] ||
  _modifier[x.toLowerCase()] ||
  x.toUpperCase().charCodeAt(0);

// 设置获取当前范围（默认为'所有'）
function setScope (scope) {
  _scope = scope || 'all';
}
// 获取当前范围
function getScope () {
  return _scope || 'all'
}
// 获取摁下绑定键的键值
function getPressedKeyCodes () {
  return _downKeys.slice(0)
}

// 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true
function filter (event) {
  const target = event.target || event.srcElement;
  const { tagName } = target;
  let flag = true;
  // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
  if (
    target.isContentEditable ||
    ((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly)
  ) {
    flag = false;
  }
  return flag
}

// 判断摁下的键是否为某个键，返回true或者false
function isPressed (keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }
  return _downKeys.indexOf(keyCode) !== -1
}

// 循环删除handlers中的所有 scope(范围)
function deleteScope (scope, newScope) {
  let handlers;
  let i;

  // 没有指定scope，获取scope
  if (!scope) scope = getScope();

  for (const key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  }

  // 如果scope被删除，将scope重置为all
  if (getScope() === scope) setScope(newScope || 'all');
}

// 清除修饰键
function clearModifier (event) {
  let key = event.keyCode || event.which || event.charCode;
  const i = _downKeys.indexOf(key);

  // 从列表中清除按压过的键
  if (i >= 0) {
    _downKeys.splice(i, 1);
  }
  // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题
  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  }

  // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除
  if (key === 93 || key === 224) key = 91;
  if (key in _mods) {
    _mods[key] = false;

    // 将修饰键重置为false
    for (const k in _modifier) if (_modifier[k] === key) hotkeys[k] = false;
  }
}

function unbind (keysInfo, ...args) {
  // unbind(), unbind all keys
  if (!keysInfo) {
    Object.keys(_handlers).forEach((key) => delete _handlers[key]);
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach((info) => {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    // support old method
    // eslint-disable-line
    let [scope, method] = args;
    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }
    eachUnbind({
      key: keysInfo,
      scope,
      method,
      splitKey: '+'
    });
  }
}

// 解除绑定某个范围的快捷键
const eachUnbind = ({
  key, scope, method, splitKey = '+'
}) => {
  const multipleKeys = getKeys(key);
  multipleKeys.forEach((originKey) => {
    const unbindKeys = originKey.split(splitKey);
    const len = unbindKeys.length;
    const lastKey = unbindKeys[len - 1];
    const keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return
    // 判断是否传入范围，没有就获取范围
    if (!scope) scope = getScope();
    const mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    _handlers[keyCode] = _handlers[keyCode].filter((record) => {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      const isMatchingMethod = method ? record.method === method : true;
      return !(
        isMatchingMethod &&
        record.scope === scope &&
        compareArray(record.mods, mods)
      )
    });
  });
};

// 对监听对应快捷键的回调函数进行处理
function eventHandler (event, handler, scope, element) {
  if (handler.element !== element) {
    return
  }
  let modifiersMatch;

  // 看它是否在当前范围
  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;

    for (const y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (
          (!_mods[y] && handler.mods.indexOf(+y) > -1) ||
          (_mods[y] && handler.mods.indexOf(+y) === -1)
        ) {
          modifiersMatch = false;
        }
      }
    }

    // 调用处理程序，如果是修饰键不做处理
    if (
      (handler.mods.length === 0 &&
        !_mods[16] &&
        !_mods[18] &&
        !_mods[17] &&
        !_mods[91]) ||
      modifiersMatch ||
      handler.shortcut === '*'
    ) {
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();
        else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
}

// 处理keydown事件
function dispatch (event, element) {
  const asterisk = _handlers['*'];
  let key = event.keyCode || event.which || event.charCode;

  // 表单控件过滤 默认表单控件不触发快捷键
  if (!hotkeys.filter.call(this, event)) return

  // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样
  if (key === 93 || key === 224) key = 91;

  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */
  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */
  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach((keyName) => {
    const keyNum = modifierMap[keyName];
    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true;

    // 将特殊字符的key注册到 hotkeys 上
    for (const k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }

    if (!asterisk) return
  }

  // 将 modifierMap 里面的修饰键绑定到 event 中
  for (const e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */
  if (event.getModifierState && (!(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph'))) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }

    _mods[17] = true;
    _mods[18] = true;
  }

  // 获取范围 默认为 `all`
  const scope = getScope();
  // 对任何快捷键都需要做的处理
  if (asterisk) {
    for (let i = 0; i < asterisk.length; i++) {
      if (
        asterisk[i].scope === scope &&
        ((event.type === 'keydown' && asterisk[i].keydown) ||
        (event.type === 'keyup' && asterisk[i].keyup))
      ) {
        eventHandler(event, asterisk[i], scope, element);
      }
    }
  }
  // key 不在 _handlers 中返回
  if (!(key in _handlers)) return

  for (let i = 0; i < _handlers[key].length; i++) {
    if (
      (event.type === 'keydown' && _handlers[key][i].keydown) ||
      (event.type === 'keyup' && _handlers[key][i].keyup)
    ) {
      if (_handlers[key][i].key) {
        const record = _handlers[key][i];
        const { splitKey } = record;
        const keyShortcut = record.key.split(splitKey);
        const _downKeysCurrent = []; // 记录当前按键键值
        for (let a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }
        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope, element);
        }
      }
    }
  }
}

// 判断 element 是否已经绑定事件
function isElementBind (element) {
  return elementHasBindEvent.indexOf(element) > -1
}

function hotkeys (key, option, method) {
  _downKeys = [];
  const keys = getKeys(key); // 需要处理的快捷键列表
  let mods = [];
  let scope = 'all'; // scope默认为all，所有范围都有效
  let element = document; // 快捷键事件绑定节点
  let i = 0;
  let keyup = false;
  let keydown = true;
  let splitKey = '+';

  // 对为设定范围的判断
  if (method === undefined && typeof option === 'function') {
    method = option;
  }

  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line
    if (option.element) element = option.element; // eslint-disable-line
    if (option.keyup) keyup = option.keyup; // eslint-disable-line
    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line
    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
  }

  if (typeof option === 'string') scope = option;

  // 对于每个快捷键进行处理
  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表
    mods = [];

    // 如果是组合快捷键取得组合快捷键
    if (key.length > 1) mods = getMods(_modifier, key);

    // 将非修饰键转化为键码
    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键

    // 判断key是否在_handlers中，不在就赋一个空数组
    if (!(key in _handlers)) _handlers[key] = [];
    _handlers[key].push({
      keyup,
      keydown,
      scope,
      mods,
      shortcut: keys[i],
      method,
      key: keys[i],
      splitKey,
      element
    });
  }
  // 在全局document上设置快捷键
  if (typeof element !== 'undefined' && !isElementBind(element) && window) {
    elementHasBindEvent.push(element);
    addEvent(element, 'keydown', (e) => {
      dispatch(e, element);
    });
    if (!winListendFocus) {
      winListendFocus = true;
      addEvent(window, 'focus', () => {
        _downKeys = [];
      });
    }
    addEvent(element, 'keyup', (e) => {
      dispatch(e, element);
      clearModifier(e);
    });
  }
}

function trigger (shortcut, scope = 'all') {
  Object.keys(_handlers).forEach((key) => {
    const data = _handlers[key].find((item) => item.scope === scope && item.shortcut === shortcut);
    if (data && data.method) {
      data.method();
    }
  });
}

const _api = {
  setScope,
  getScope,
  deleteScope,
  getPressedKeyCodes,
  isPressed,
  filter,
  trigger,
  unbind,
  keyMap: _keyMap,
  modifier: _modifier,
  modifierMap
};
for (const a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}

if (typeof window !== 'undefined') {
  const _hotkeys = window.hotkeys;
  hotkeys.noConflict = (deep) => {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }
    return hotkeys
  };
  window.hotkeys = hotkeys;
}

/*!
 * @name         hotKeyRegister.js
 * @description  vue-debug-helper的快捷键配置
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/04/26 14:37
 * @github       https://github.com/xxxily
 */

function hotKeyRegister () {
  const hotKeyMap = {
    'shift+alt+i': functionCall.toggleInspect,
    'shift+alt+a,shift+alt+ctrl+a': functionCall.componentsSummaryStatisticsSort,
    'shift+alt+l': functionCall.componentsStatistics,
    'shift+alt+d': functionCall.destroyStatisticsSort,
    'shift+alt+c': functionCall.clearAll,
    'shift+alt+e': function (event, handler) {
      if (helper.config.dd.enabled) {
        functionCall.undd();
      } else {
        functionCall.dd();
      }
    }
  };

  Object.keys(hotKeyMap).forEach(key => {
    hotkeys(key, hotKeyMap[key]);
  });
}

/*!
 * @name         vueDetector.js
 * @description  检测页面是否存在Vue对象
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/04/27 11:43
 * @github       https://github.com/xxxily
 */

function mutationDetector (callback, shadowRoot) {
  const win = window;
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  const docRoot = shadowRoot || win.document.documentElement;
  const maxDetectTries = 1500;
  const timeout = 1000 * 10;
  const startTime = Date.now();
  let detectCount = 0;
  let detectStatus = false;

  if (!MutationObserver) {
    debug.warn('MutationObserver is not supported in this browser');
    return false
  }

  let mObserver = null;
  const mObserverCallback = (mutationsList, observer) => {
    if (detectStatus) {
      return
    }

    /* 超时或检测次数过多，取消监听 */
    if (Date.now() - startTime > timeout || detectCount > maxDetectTries) {
      debug.warn('mutationDetector timeout or detectCount > maxDetectTries, stop detect');
      if (mObserver && mObserver.disconnect) {
        mObserver.disconnect();
        mObserver = null;
      }
    }

    for (let i = 0; i < mutationsList.length; i++) {
      detectCount++;
      const mutation = mutationsList[i];
      if (mutation.target && mutation.target.__vue__) {
        let Vue = Object.getPrototypeOf(mutation.target.__vue__).constructor;
        while (Vue.super) {
          Vue = Vue.super;
        }

        /* 检测成功后销毁观察对象 */
        if (mObserver && mObserver.disconnect) {
          mObserver.disconnect();
          mObserver = null;
        }

        detectStatus = true;
        callback && callback(Vue);
        break
      }
    }
  };

  mObserver = new MutationObserver(mObserverCallback);
  mObserver.observe(docRoot, {
    attributes: true,
    childList: true,
    subtree: true
  });
}

/**
 * 检测页面是否存在Vue对象，方法参考：https://github.com/vuejs/devtools/blob/main/packages/shell-chrome/src/detector.js
 * @param {window} win windwod对象
 * @param {function} callback 检测到Vue对象后的回调函数
 */
function vueDetect (win, callback) {
  let delay = 1000;
  let detectRemainingTries = 10;
  let detectSuc = false;

  // Method 1: MutationObserver detector
  mutationDetector((Vue) => {
    if (!detectSuc) {
      debug.info(`------------- Vue mutation detected (${Vue.version}) -------------`);
      detectSuc = true;
      callback(Vue);
    }
  });

  function runDetect () {
    if (detectSuc) {
      return false
    }

    // Method 2: Check  Vue 3
    const vueDetected = !!(win.__VUE__);
    if (vueDetected) {
      debug.info(`------------- Vue global detected (${win.__VUE__.version}) -------------`);
      detectSuc = true;
      callback(win.__VUE__);
      return
    }

    // Method 3: Scan all elements inside document
    const all = document.querySelectorAll('*');
    let el;
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i];
        break
      }
    }
    if (el) {
      let Vue = Object.getPrototypeOf(el.__vue__).constructor;
      while (Vue.super) {
        Vue = Vue.super;
      }
      debug.info(`------------- Vue dom detected (${Vue.version}) -------------`);
      detectSuc = true;
      callback(Vue);
      return
    }

    if (detectRemainingTries > 0) {
      detectRemainingTries--;

      if (detectRemainingTries >= 7) {
        setTimeout(() => {
          runDetect();
        }, 40);
      } else {
        setTimeout(() => {
          runDetect();
        }, delay);
        delay *= 5;
      }
    }
  }

  setTimeout(() => {
    runDetect();
  }, 40);
}

/*!
 * @name         vueConfig.js
 * @description  对Vue的配置进行修改
 * @version      0.0.1
 * @author       xxxily
 * @date         2022/05/10 15:15
 * @github       https://github.com/xxxily
 */

function vueConfigInit (Vue, config) {
  if (Vue.config) {
    /* 自动开启Vue的调试模式 */
    if (config.devtools) {
      Vue.config.debug = true;
      Vue.config.devtools = true;
      Vue.config.performance = true;

      setTimeout(() => {
        const devtools = getVueDevtools();
        if (devtools) {
          if (!devtools.enabled) {
            if (/^3\.*/.test(Vue.version)) {
              // https://github.com/vuejs/core/blob/main/packages/runtime-core/src/devtools.ts
              devtools.emit('app:init', Vue, Vue.version, {
                Fragment: 'Fragment',
                Text: 'Text',
                Comment: 'Comment',
                Static: 'Static'
              });

              const unmount = Vue.unmount.bind(Vue);
              Vue.unmount = function () {
                devtools.emit('app:unmount', Vue);
                unmount();
              };
            } else {
              // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/index.js
              devtools.emit('init', Vue);

              // 注册vuex store，参考vuex源码
              if (Vue.$store) {
                Vue.$store._devtoolHook = devtools;
                devtools.emit('vuex:init', Vue.$store);
                devtools.on('vuex:travel-to-state', function (targetState) {
                  Vue.$store.replaceState(targetState);
                });
                Vue.$store.subscribe(function (mutation, state) {
                  devtools.emit('vuex:mutation', mutation, state);
                });
              }
            }

            debug.info('vue devtools init emit.');
          }
        } else {
          debug.info('vue devtools check failed.');
        }
      }, 200);
    } else {
      Vue.config.debug = false;
      Vue.config.devtools = false;
      Vue.config.performance = false;
    }
  } else {
    debug.log('Vue.config is not defined');
  }
}

/**
 * 判断是否处于Iframe中
 * @returns {boolean}
 */
function isInIframe () {
  return window !== window.top
}

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
// getPageWindow()

/**
 * 通过同步的方式获取pageWindow
 * 注意同步获取的方式需要将脚本写入head，部分网站由于安全策略会导致写入失败，而无法正常获取
 * @returns {*}
 */
function getPageWindowSync () {
  if (document._win_) return document._win_

  const head = document.head || document.querySelector('head');
  const script = document.createElement('script');
  script.appendChild(document.createTextNode('document._win_ = window'));
  head.appendChild(script);

  return document._win_
}

let registerStatus = 'init';
window._debugMode_ = true;

/* 注入相关样式到页面 */
if (window.GM_getResourceText && window.GM_addStyle) {
  const contextMenuCss = window.GM_getResourceText('contextMenuCss');
  window.GM_addStyle(contextMenuCss);
}

function init (win) {
  /* 注册接口拦截功能和接口数据缓存功能 */
  ajaxHooks.init(win);

  if (isInIframe()) {
    debug.log('running in iframe, skip init', window.location.href);
    return false
  }

  if (registerStatus === 'initing') {
    return false
  }

  /* 注册性能观察的功能 */
  performanceObserver.init();

  /* 注册选择器测量辅助功能 */
  functionCall.initMeasureSelectorInterval();

  registerStatus = 'initing';

  /* 首次菜单注册 */
  menuRegister('initing');

  vueDetect(win, function (Vue) {
    /* 挂载到window上，方便通过控制台调用调试 */
    helper.Vue = Vue;
    win.vueDebugHelper = helper;

    /* 注册阻断Vue组件的功能 */
    vueHooks.blockComponents(Vue, helper.config);

    /* 注册打印全局组件注册信息的功能 */
    if (helper.config.hackVueComponent) {
      vueHooks.hackVueComponent(Vue);
    }

    /* 对Vue相关配置进行初始化 */
    vueConfigInit(Vue, helper.config);

    mixinRegister(Vue);
    menuRegister('success');
    hotKeyRegister();

    inspect.init(Vue);

    debug.log('vue debug helper register success');
    registerStatus = 'success';
  });

  setTimeout(() => {
    if (registerStatus !== 'success') {
      menuRegister('failed');
      debug.warn('vue debug helper register failed, please check if vue is loaded .', win.location.href);
    }
  }, 1000 * 10);
}

let win$1 = null;
try {
  win$1 = getPageWindowSync();
  if (win$1) {
    init(win$1);
  }
} catch (e) {
  debug.error('getPageWindowSync failed', e);
}
(async function () {
  if (!win$1) {
    win$1 = await getPageWindow();
    init(win$1);
  }
})();
