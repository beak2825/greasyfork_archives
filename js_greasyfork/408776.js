// ==UserScript==
// @name DMS UserScripts Toolkit
// @author 稻米鼠
// @description A lib for easy to write userscript.
// @version 0.0.4
// ==UserScript==

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolkit = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @file DMS UserScripts Toolkit
 *
 * @author 稻米鼠
 * @version 0.0.3
 * @update 2020-8-29 09:06:16
 */

/**
 * @classdesc GreasyMonkey 脚本工具类
 *
 * 因脚本中一些基础功能函数需要复用，所以写了这个小的工具库。为对用户安全负责，并符合 GreasyFork 审核规则，代码未作压缩，仅用 Parcel 简单过了一下，一方面是为了用 babel 转码，另一方为后期分文件书写不同类别功能做准备。**这导致代码中注释未能精确对应，使用方法请依照此说明**。
 *
 * @export
 * @class Toolkit
 */
class Toolkit {
  /**
   * @summary 当前库的版本号
   * @name version
   * @memberof Toolkit
   */

  /**
   * @summary 当前是否处于 debug 状态。
   * @description **Debug 模式开启方法：** 手动为此脚本设置一个数据： `is_debug: 1`（在脚本设置页面中）。值可以任意，因为会当作字符串处理，所以不为空即为真。
   *
   * **注意：** 这需要 `GM_getValue` API 的支持
   * @memberof Toolkit
   */
  // debug 状态

  /**
   * @summary 引入方法
   * @description GreasyFork 发布地址： https://greasyfork.org/zh-CN/scripts/408776
   *
   * 请依照说明，在脚本元数据部分引入对应的最新地址。此工具库仍在更新中，所以请注意保持更新。
   *
   * * 会在控制台输出当前工具库的名称+版本号徽章
   * * 如果在初始化时传入了 `GM_info` 接口，并可用，会输出当前脚本的名称+版本号徽章
   * * 框架中页面不输出，避免重复输出
   * @constructor
   * @param {object} [GM={}] 其中放入会用到的 GreasyMonkey Api 对象
   * @example const DMSTookit = new DMS_UserScripts.Toolkit({GM_info, GM_getValue})
   * @memberof Toolkit
   */
  constructor() {
    let GM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _defineProperty(this, "version", '0.0.3');

    _defineProperty(this, "is_debug", false);

    // 获取需要用到的 API
    for (const key in GM) {
      this[key] = GM[key];
    } // 设定是否是开发状态


    this.is_debug = this.GM_getValue && this.GM_getValue('is_debug', false) ? true : false; // 输出版本标记

    if (self != top) return; // 框架中页面不输出，避免重复

    this.badge('DMS UserScripts Toolkit', this.version, 'https://script.izyx.xyz');

    if (this.GM_info && this.GM_info.script && this.GM_info.script.name && this.GM_info.script.version) {
      this.badge(this.GM_info.script.name, this.GM_info.script.version, this.GM_info.script.description ? this.GM_info.script.description : '', {
        rightBGColor: '#71baeb'
      });
    } // Debug 时输出获得的 API


    const ApiKeys = Object.keys(this).filter(key => /^GM_/.test(key));
    this.dblog.apply(this, ['Constructor - No. of Apis = ' + ApiKeys.length].concat(ApiKeys));
  }
  /* ====== 输出相关 ====== */

  /**
   * @summary 日志输出
   * @description 用 `console.info` 方法输出信息。如多条内容，则以折叠组的形式输出。主要为了便于 debug。
   * @param {string} by 由信息来源标识
   * @param  {...any} args 输出内容，任意多个参数
   * @example
   * DMSTookit.info('Demo', 'Some thing want to print to console.')  // 仅一项需输出内容
   * DMSTookit.info('Demo', 'Some thing want to print to console.', 'And more.')  // 多项输出内容
   * @memberof Toolkit
   */


  info(by) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (args.length > 1) {
      console.groupCollapsed(by + '： ');

      for (const arg of args) {
        console.info(arg);
      }

      console.groupEnd();
    } else if (args.length === 1) {
      console.info(by + '： ', args[0]);
    }
  }
  /**
   * @summary Debug 输出，仅开发时输出
   * @description 用 `.info` 方法输出。但仅在 `.is_debug` 为真时输出。这样在发布版本时可不删除这些调试内容。参数同 {@link Toolkit#info}
   * @param {string} by 由信息来源标识
   * @param  {...any} args 输出内容，任意多个参数
   * @memberof Toolkit
   */


  dblog() {
    if (this.is_debug) {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.info.apply(this, args);
    }
  }
  /**
   * @summary 徽章输出
   * @description 类似这种效果 ![](https://img.shields.io/badge/%E5%B7%A6%E4%BE%A7%E6%96%87%E5%AD%97-%E5%8F%B3%E4%BE%A7%E6%96%87%E5%AD%97-%23ffc107?style=flat&labelColor=555555)， 但并不一致。具体可在引用此库，并正确初始化后看控制台输出。其实除了好看也没什么特别的用途。
   * @param {string} leftText 徽章左侧文字
   * @param {string} rightText 徽章右侧文字
   * @param {string} endText 徽章后描述
   * @param {object} options={} 徽章配置项
   * * options.leftBGColor 左侧文字背景色
   * * options.leftColor 左侧文字颜色
   * * options.rightBGColor 右侧文字背景色
   * * options.rightColor 右侧文字颜色
   * @example
   * DMSTookit.badge(
   *   'DMS UserScripts Toolkit',
   *   DMSTookit.version,
   *   'https://greasyfork.org/zh-CN/scripts/408776'
   * )
   * @memberof Toolkit
   */


  badge(leftText, rightText, endText) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const opt = Object.assign({
      type: 'log',
      leftBGColor: '#555555',
      leftColor: '#ededed',
      rightBGColor: '#ffc107',
      rightColor: '#262318'
    }, options);
    console[opt.type]('%c' + leftText + '%c' + rightText + (endText ? '%c\n' + endText : ''), 'color: ' + opt.leftColor + '; ' + 'background-color: ' + opt.leftBGColor + '; ' + 'border-radius: 2px 0 0 2px;' + 'padding: 0 5px', 'color: ' + opt.rightColor + '; ' + 'background-color: ' + opt.rightBGColor + '; ' + 'border-radius: 0 2px 2px 0;' + 'padding: 0 5px;', '');
  }
  /* ====== 数据相关 ====== */

  /**
   * @summary 【私有】验证是否具有所需的 Api
   * @description 如无法获取此 API，且处于 debug 状态，则在控制台输出提示
   * @param {string} apiName API 的名称
   * @param {string} by='DMS_Toolkit' （可选）调用来源
   * @returns {boolean}
   * @memberof Toolkit
   * @private
   */


  hasGMApi(apiName) {
    let by = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DMS_Toolkit';
    if (this[apiName]) return true;
    this.dblog(by + ' - 未能获取 ' + apiName + ' 接口', '* 请检查初始化时是否传入对应接口', '* 脚本元数据中是否声明对该接口的使用');
    return false;
  }
  /**
   * @summary 获取存储中的数据
   * @description 基础方法，当接口不可用时会直接抛出错误，不建议直接使用。提供如下语法糖：
   * * `getGMData` 将 `type` 指定为 `GM`，然后省略此参数
   * * `getLocalData` 将 `type` 指定为 `local`，然后省略此参数
   * * `getSessionData` 将 `type` 指定为 `session`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   * @param {any} defaultValue=false 默认值，可省略
   */


  getData(type, dataName) {
    let defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    switch (type) {
      case 'GM':
        // 脚本管理器同宫的全局存储
        if (!this.hasGMApi('GM_getValue', 'getData')) {
          throw new Error("This API is not available.");
        } else {
          return this.GM_getValue(dataName, defaultValue);
        }

        break;

      case 'local':
        // localStorage
        if (!window.localStorage) {
          throw new Error("This API is not available.");
        } else {
          if (!localStorage.getItem(dataName)) {
            return defaultValue;
          } else {
            return JSON.parse(localStorage.getItem(dataName));
          }
        }

        break;

      case 'session':
        // sessionStorage
        if (!window.sessionStorage) {
          throw new Error("This API is not available.");
        } else {
          if (!sessionStorage.getItem(dataName)) {
            return defaultValue;
          } else {
            return JSON.parse(sessionStorage.getItem(dataName));
          }
        }

        break;

      case 'cookie':
        // cookies
        this.dblog('getData', 'The method of cookie operation is not yet available.');
        break;

      default:
        this.dblog('getData', 'Probably set the wrong type of get method.');
        throw new Error("Probably set the wrong type of get method.");
        break;
    }
  }

  getGMData() {
    try {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.getData.apply(this, ['GM'].concat(args));
    } catch (error) {
      this.dblog('getGMData', error.message);
    }
  }

  getLocalData() {
    try {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.getData.apply(this, ['local'].concat(args));
    } catch (error) {
      this.dblog('getLocalData', error.message);
    }
  }

  getSessionData() {
    try {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return this.getData.apply(this, ['session'].concat(args));
    } catch (error) {
      this.dblog('getSessionData', error.message);
    }
  }
  /**
   * @summary 设置存储中的数据
   * @description 基础方法，当接口不可用时会直接抛出错误，不建议直接使用。提供如下语法糖：
   * * `setGMData` 将 `type` 指定为 `GM`，然后省略此参数
   * * `setLocalData` 将 `type` 指定为 `local`，然后省略此参数
   * * `setSessionData` 将 `type` 指定为 `session`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   * @param {any} value 要写入的值，如不存在则删除该数据
   */


  setData(type, dataName, value) {
    // 如果不存在值则删除此数据
    if (typeof value === 'undefined') {
      this.removeData(type, dataName);
      this.dblog('setData', 'No value, and removed ' + dataName);
      return;
    }

    switch (type) {
      case 'GM':
        // 脚本管理器同宫的全局存储
        if (!this.hasGMApi('GM_setValue', 'setData')) {
          throw new Error("This API is not available.");
        } else {
          this.GM_setValue(dataName, value);
        }

        break;

      case 'local':
        // localStorage
        if (!window.localStorage) {
          throw new Error("This API is not available.");
        } else {
          localStorage.setItem(dataName, JSON.stringify(value));
        }

        break;

      case 'session':
        // sessionStorage
        if (!window.sessionStorage) {
          throw new Error("This API is not available.");
        } else {
          sessionStorage.setItem(dataName, JSON.stringify(value));
        }

        break;

      case 'cookie':
        // cookies
        this.dblog('setData', 'The method of cookie operation is not yet available.');
        break;

      default:
        this.dblog('setData', 'Probably set the wrong type of get method.');
        throw new Error("Probably set the wrong type of get method.");
        break;
    }
  }

  setGMData() {
    try {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      this.setData.apply(this, ['GM'].concat(args));
    } catch (error) {
      this.dblog('setGMData', error.message);
    }
  }

  setLocalData() {
    try {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      this.setData.apply(this, ['local'].concat(args));
    } catch (error) {
      this.dblog('setLocalData', error.message);
    }
  }

  setSessionData() {
    try {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      this.setData.apply(this, ['session'].concat(args));
    } catch (error) {
      this.dblog('setSessionData', error.message);
    }
  }
  /**
   * @summary 移除存储中的数据
   * @description 基础方法，当接口不可用时会直接抛出错误，不建议直接使用。提供如下语法糖：
   * * `removeGMData` 将 `type` 指定为 `GM`，然后省略此参数
   * * `removeLocalData` 将 `type` 指定为 `local`，然后省略此参数
   * * `removeSessionData` 将 `type` 指定为 `session`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   */


  removeData(type, dataName) {
    switch (type) {
      case 'GM':
        // 脚本管理器同宫的全局存储
        if (!this.hasGMApi('GM_deleteValue', 'removeData')) {
          throw new Error("This API is not available.");
        } else {
          this.GM_deleteValue(dataName);
        }

        break;

      case 'local':
        // localStorage
        if (!window.localStorage) {
          throw new Error("This API is not available.");
        } else {
          localStorage.removeItem(dataName);
        }

        break;

      case 'session':
        // sessionStorage
        if (!window.sessionStorage) {
          throw new Error("This API is not available.");
        } else {
          sessionStorage.removeItem(dataName);
        }

        break;

      case 'cookie':
        // cookies
        this.dblog('removeData', 'The method of cookie operation is not yet available.');
        break;

      default:
        this.dblog('removeData', 'Probably set the wrong type of get method.');
        throw new Error("Probably set the wrong type of get method.");
        break;
    }
  }

  removeGMData() {
    try {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      this.removeData.apply(this, ['GM'].concat(args));
    } catch (error) {
      this.dblog('removeGMData', error.message);
    }
  }

  removeLocalData() {
    try {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      this.removeData.apply(this, ['local'].concat(args));
    } catch (error) {
      this.dblog('removeLocalData', error.message);
    }
  }

  removeSessionData() {
    try {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      this.removeData.apply(this, ['session'].concat(args));
    } catch (error) {
      this.dblog('removeSessionData', error.message);
    }
  }
  /**
   * @summary 移除存储中的数据
   * @description 基础方法，当接口不可用时会直接抛出错误，不建议直接使用。提供如下语法糖：
   * * `removeGMData` 将 `type` 指定为 `GM`，然后省略此参数
   * * `removeLocalData` 将 `type` 指定为 `local`，然后省略此参数
   * * `removeSessionData` 将 `type` 指定为 `session`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   */


  listData(type) {
    switch (type) {
      case 'GM':
        // 脚本管理器同宫的全局存储
        if (!this.hasGMApi('GM_listValues', 'removeData')) {
          throw new Error("This API is not available.");
        } else {
          return this.GM_listValues();
        }

        break;

      case 'local':
        // localStorage
        if (!window.localStorage) {
          throw new Error("This API is not available.");
        } else {
          return new Array(localStorage.length).fill(0).map((e, i) => localStorage.key(i));
        }

        break;

      case 'session':
        // sessionStorage
        if (!window.sessionStorage) {
          throw new Error("This API is not available.");
        } else {
          return new Array(sessionStorage.length).fill(0).map((e, i) => sessionStorage.key(i));
        }

        break;

      case 'cookie':
        // cookies
        this.dblog('setData', 'The method of cookie operation is not yet available.');
        break;

      default:
        this.dblog('listData', 'Probably set the wrong type of get method.');
        throw new Error("Probably set the wrong type of get method.");
        break;
    }
  }

  listGMData() {
    try {
      return this.listData.apply(this, ['GM']);
    } catch (error) {
      this.dblog('listGMData', error.message);
    }
  }

  listLocalData() {
    try {
      return this.listData.apply(this, ['local']);
    } catch (error) {
      this.dblog('listLocalData', error.message);
    }
  }

  listSessionData() {
    try {
      return this.listData.apply(this, ['session']);
    } catch (error) {
      this.dblog('listSessionData', error.message);
    }
  }
  /**
   * @summary 代理存储中的数据对象
   * @description 基础方法，不建议直接使用。仅用 `new Proxy()` 方法简单代理了数据的 `get` 和 `set`，可以满足简单的数据操作需求，复杂情况请自行书写代理。提供如下语法糖：
   * * `proxyGMData` 将 `type` 指定为 `GM`，然后省略此参数
   * * `proxyLocalData` 将 `type` 指定为 `local`，然后省略此参数
   * * `proxySessionData` 将 `type` 指定为 `session`，然后省略此参数
   * * `proxyDataAuto` 脚本数据存储 API 可用的话 `type` 指定为 `GM`，否则为 `local` 即自动选择 `type`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   * @param {any} defaultValue={} 默认值，可省略
   */


  proxyData(type, dataName) {
    let defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (typeof defaultValue !== 'undefined' && !(defaultValue instanceof Object)) {
      this.dblog('The defaultValue must be an object, and the proxy method can only be used to observe a change in an object\'s property value.');
      return;
    }

    return new Proxy(defaultValue, {
      get: (target, property, receiver) => {
        return Object.assign(target, this.getData(type, dataName, {}))[property];
      },
      set: (target, property, value, receiver) => {
        Object.assign(target, this.getData(type, dataName, {}))[property] = value;

        try {
          this.setData(type, dataName, target);
          return true;
        } catch (error) {
          this.dblog('proxyData', error);
          return false;
        }
      }
    });
  }

  proxyGMData() {
    try {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      return this.proxyData.apply(this, ['GM'].concat(args));
    } catch (error) {
      this.dblog('proxyGMData', error.message);
    }
  }

  proxyLocalData() {
    try {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      return this.proxyData.apply(this, ['local'].concat(args));
    } catch (error) {
      this.dblog('proxyLocalData', error.message);
    }
  }

  proxySessionData() {
    try {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      return this.proxyData.apply(this, ['session'].concat(args));
    } catch (error) {
      this.dblog('proxySessionData', error.message);
    }
  }

  proxyDataAuto() {
    let type = 'local';

    if (this.hasGMApi('GM_getValue', 'proxyDataAuto') && this.hasGMApi('GM_setValue', 'proxyDataAuto')) {
      if (this.getGMData('GM_Can_be_Used', false)) {
        type = 'GM';
      } else {
        this.setGMData('GM_Can_be_Used', true);

        if (this.getGMData('GM_Can_be_Used', false)) {
          type = 'GM';
        }
      }
    }

    try {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      return this.proxyData.apply(this, [type].concat(args));
    } catch (error) {
      this.dblog('proxyDataAuto', error.message);
    }
  }
  /**
   * @summary 代理存储中的数据
   * @description 基础方法，不建议直接使用。针对存储的单个数据进行简单代理。提供如下语法糖：
   * * `proxyGMKey` 将 `type` 指定为 `GM`，然后省略此参数
   * * `proxyLocalKey` 将 `type` 指定为 `local`，然后省略此参数
   * * `proxySessionKey` 将 `type` 指定为 `session`，然后省略此参数
   * * `proxyKeyAuto` 脚本数据存储 API 可用的话 `type` 指定为 `GM`，否则为 `local` 即自动选择 `type`，然后省略此参数
   * @param {string} type 存储类型，可用值如下：
   * * `GM` 脚本管理器提供的数据存储
   * * `local` localStorage 数据
   * * `session` sessionStorage 数据
   * * `cookie` cookie 数据（暂未提供
   * @param {string} dataName 数据名称
   * @param {any} defaultValue=false 默认值，可省略
   * @returns {function} 返回一个方法，无参数运行则获取对应存储的值，有参数运行则将参数值写入存储
   */


  proxyKey(type, dataName) {
    let defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return value => {
      if (typeof value !== 'undefined') {
        this.setData(type, dataName, value);
      } else {
        return this.getData(type, dataName, defaultValue);
      }
    };
  }

  proxyGMKey() {
    try {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      return this.proxyKey.apply(this, ['GM'].concat(args));
    } catch (error) {
      this.dblog('proxyGMKey', error.message);
    }
  }

  proxyLocalKey() {
    try {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }

      return this.proxyKey.apply(this, ['local'].concat(args));
    } catch (error) {
      this.dblog('proxyLocalKey', error.message);
    }
  }

  proxySessionKey() {
    try {
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }

      return this.proxyKey.apply(this, ['session'].concat(args));
    } catch (error) {
      this.dblog('proxySessionKey', error.message);
    }
  }

  proxyKeyAuto() {
    let type = 'local';

    if (this.hasGMApi('GM_getValue', 'proxyKeyAuto') && this.hasGMApi('GM_setValue', 'proxyKeyAuto')) {
      if (this.getGMKey('GM_Can_be_Used', false)) {
        type = 'GM';
      } else {
        this.setGMKey('GM_Can_be_Used', true);

        if (this.getGMKey('GM_Can_be_Used', false)) {
          type = 'GM';
        }
      }
    }

    try {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }

      return this.proxyKey.apply(this, [type].concat(args));
    } catch (error) {
      this.dblog('proxyKeyAuto', error.message);
    }
  }
  /* ====== 菜单相关 ====== */

  /**
   * @summary 注册一个链接菜单
   * @description 需要如下 API：
   * * `GM_registerMenuCommand` 【必须】否则无法注册脚本菜单
   * * `GM_openInTab` 【可选】可以更稳定的在新窗口打开链接
   * @param {string} name 菜单的名称
   * @param {url} url 链接地址，含协议部分（`http://`，`https://`），否则可能按相对地址处理
   * @example DMSTookit.menuLink('更多脚本', 'https://script.izyx.xyz/')
   * @memberof Toolkit
   */


  menuLink(name, url) {
    if (!this.hasGMApi('GM_registerMenuCommand', 'menuLink')) return;
    GM_registerMenuCommand(name, () => {
      if (this.hasGMApi('GM_openInTab', 'menuLink')) {
        GM_openInTab(url);
        return;
      }

      window.open(url, '_blank');
    });
  }
  /**
   * @summary 注册一个切换菜单
   * @description 因为不同管理器下菜单的反注册方式不太一样，所以最稳妥的方法是切换后刷新页面。如果不刷新页面，会用两种方法尝试反注册菜单。需要如下 API：
   * * `GM_registerMenuCommand` 【必须】否则无法注册脚本菜单
   * * `GM_unregisterMenuCommand` 【可选】无刷新切换时用来反注册菜单
   * 提供如下语法糖：
   * * `menuToggle` 菜单标记位于某个数据对象的属性上，用此方法可略显简便，详细参数在后面
   * * `menuDebug` 注册一个 debug 状态的切换菜单，此方法无参数
   * @param {function} getter 获取菜单状态标记
   * @param {function} setter 设置菜单状态标记
   * @param {string} onName 启用状态菜单文字
   * @param {string} offName 禁用状态菜单文字
   * @param {boolean} reload=true 是否需要刷新页面，默认为是。当为否时会尝试两种方法反注册菜单，但并不推荐。
   * @param {function} callback 回调函数，当 `reload=false` 时可用，会传入当前菜单状态（`true`，`false`）
   * @memberof Toolkit
  */


  menuToggleBasic(getter, setter, onName, offName) {
    let reload = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    let callback = arguments.length > 5 ? arguments[5] : undefined;
    if (!this.hasGMApi('GM_registerMenuCommand', 'toggleMenu')) return;
    if (!reload && !this.hasGMApi('GM_unregisterMenuCommand', 'toggleMenu')) return;

    const registerMenu = () => {
      const nowState = getter();
      const menuName = nowState ? onName : offName;
      let menuMarkID;
      menuMarkID = GM_registerMenuCommand(menuName, () => {
        setter(!nowState);

        if (reload) {
          window.location.reload(1);
          return;
        }

        if (menuMarkID) {
          // Tampermonkey
          GM_unregisterMenuCommand(menuMarkID);
        } else {
          // Violentmonkey
          GM_unregisterMenuCommand(menuName);
        }

        registerMenu();
        if (callback) callback(!nowState);
      });
    };

    registerMenu();
  }
  /**
   * @summary 注册一个切换菜单，菜单标记位于储存数据对象的某个属性上
   * @param {object} optionsObject 选项数据对象，推荐使用上面 `proxyData` 方法代理的数据，这样改变后可以直接存储
   * @param {string} optionsProperty 选项对象中对应的属性名称
   * @param {string} onName 启用状态菜单文字
   * @param {string} offName 禁用状态菜单文字
   * @param {boolean} reload=true 是否需要刷新页面，默认为是。当为否时会尝试两种方法反注册菜单，但并不推荐。
   * @param {function} callback 回调函数，当 `reload=false` 时可用，会传入当前菜单状态（`true`，`false`）
   * @memberof Toolkit
  */


  menuToggle(optionsObject, optionsProperty) {
    for (var _len20 = arguments.length, args = new Array(_len20 > 2 ? _len20 - 2 : 0), _key20 = 2; _key20 < _len20; _key20++) {
      args[_key20 - 2] = arguments[_key20];
    }

    this.menuToggleBasic.apply(this, [() => {
      return optionsObject[optionsProperty];
    }, state => {
      optionsObject[optionsProperty] = state;
    }].concat(args));
  }

  menuDebug() {
    const isdebug = this.proxyGMKey('is_debug', false);
    this.menuToggleBasic(isdebug, isdebug, 'Debug opening……', 'Debug closed.');
  }
  /* ====== 页面变化监控 ====== */

  /**
   * @summary 创建页面元素变化监控
   * @description 用来实时跟踪页面元素变化，及时进行相应修改，但可能和页面程序产生冲突，在执行回调函数期间可能错过某些变化。仅作为对页面的元素的粗略追踪方法。
   * @param {object} targetEl 要监控的元素对象
   * @param {function} callback 元素发生变化时执行的函数，应该为一个异步函数，会在执行此函数之间停止监控，等待此函数执行结束后再次启动监控
   * @param {object} [obOptions={}] 监控设置项，参见： https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserverInit
   * @return {object} 一个对象，提供两个方法，`start` 开始此监控，`stop` 停止此监控
   * @memberof Toolkit
   */


  pageObserverInit(targetEl, callback) {
    let obOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const options = Object.assign({
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeOldValue: false,
      characterDataOldValue: false,
      attributeFilter: []
    }, obOptions);
    const observer = new MutationObserver(async (records, observer) => {
      observer.disconnect();
      await callback(records); // 页面处理完成之后重新监控页面变化

      observer.observe(targetEl, options);
    });
    return {
      start: () => {
        observer.observe(targetEl, options);
      },
      stop: () => {
        observer.disconnect();
      }
    };
  }
  /**
   * @summary 对 `MutationRecord` 对象的预处理
   * @description 根据变化类型将受到影响的元素放入数组并标记变化类型，方便后期直接通过对数组的遍历处理。
   * @param {*} records `MutationRecord` 对象。参见： https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord
   * @memberof Toolkit
   */


  recordsPreProcessing(records) {
    const result = [];
    records.forEach(el => {
      // 属性变化
      if (/^attributes$/i.test(el.type)) {
        result.push({
          'type': 'attributes',
          'el': el.target
        });
        return;
      } // 内容变化


      if (/^characterData$/i.test(el.type)) {
        result.push({
          'type': 'characterData',
          'el': el.target
        });
        return;
      } // 后代元素变化


      if (/^childList$/i.test(el.type)) {
        el.addedNodes.forEach(node => result.push({
          'type': 'childListAdd',
          'el': node
        }));
        el.removedNodes.forEach(node => result.push({
          'type': 'childListRemove',
          'el': node.parentElement
        }));
        return;
      }
    });
    return result;
  }
  /* ====== 基础 API 替代 ====== */

  /**
   * @summary 为页面添加样式
   * @description 当没有 `GM_addStyle` 接口或执行错误时，使用替代方法
   * @param {string} cssString 要注入页面的 CSS 字符串
   * @memberof Toolkit
   */


  addStyle(cssString) {
    if (this.hasGMApi('GM_addStyle', 'addStyle')) {
      try {
        GM_addStyle(cssString);
        return;
      } catch (error) {
        this.dblog('addStyle', error);
      }
    } // 重写添加 style 功能，以兼容无接口的运行环境


    const style = document.createElement('style'); // 添加额外 ID 便于识别

    style.id = 'expand-the-article-for-me';
    style.innerHTML = cssString;
    document.head.appendChild(style);
  }

}

exports.Toolkit = Toolkit;
},{}]},{},["epB2"], "DMS_UserScripts")