// ==UserScript==
// @name           AdsBypasser
// @namespace      AdsBypasser
// @description    Bypass Ads
// @author         Hasan-Abbas
// @version        7.29.0
// @license        BSD
// @homepageURL    https://adsbypasser.github.io/
// @supportURL     https://github.com/adsbypasser/adsbypasser/issues
// @icon           https://raw.githubusercontent.com/adsbypasser/adsbypasser/v7.29.0/resources/img/logo.png
// @grant          GM_deleteValue
// @grant          GM_getResourceURL
// @grant          GM_getValue
// @grant          GM_info
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM.deleteValue
// @grant          GM.getResourceUrl
// @grant          GM.getValue
// @grant          GM.info
// @grant          GM.openInTab
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @resource       alignCenter https://raw.githubusercontent.com/adsbypasser/adsbypasser/v7.29.0/resources/css/align_center.css
// @resource       scaleImage https://raw.githubusercontent.com/adsbypasser/adsbypasser/v7.29.0/resources/css/scale_image.css
// @resource       bgImage https://raw.githubusercontent.com/adsbypasser/adsbypasser/v7.29.0/resources/img/imagedoc-darknoise.png
// @noframes
// @run-at         document-start
// @include        http://*
// @include        https://*
// @connect        *
// @downloadURL https://update.greasyfork.org/scripts/525833/AdsBypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/525833/AdsBypasser.meta.js
// ==/UserScript==

(() => {
  "use strict";
  var __webpack_modules__ = ([
    ,
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        AdsBypasserError: () => (AdsBypasserError),
        every: () => (every),
        find: () => (find),
        forEach: () => (forEach),
        isString: () => (isString),
        map: () => (map),
        none: () => (none),
        nop: () => (nop),
        partial: () => (partial),
        tryEvery: () => (tryEvery),
        wait: () => (wait)
      });
      class AdsBypasserError extends Error {
        constructor(message) {
          super(message);
        }
        get name() {
          return 'AdsBypasserError';
        }
      }
      function forEach(collection, fn) {
        if (isArrayLike(collection)) {
          return Array.prototype.forEach.call(collection, fn);
        }
        return Object.keys(collection).forEach((k) => {
          return fn(collection[k], k, collection);
        });
      }
      function every(collection, fn) {
        if (isArrayLike(collection)) {
          return Array.prototype.every.call(collection, fn);
        }
        return Object.keys(collection).every((k) => {
          return fn(collection[k], k, collection);
        });
      }
      function map(collection, fn) {
        if (isArrayLike(collection)) {
          return Array.prototype.map.call(collection, fn);
        }
        const mapped = Object.assign({}, collection);
        Object.getOwnPropertyNames(mapped).forEach((k) => {
          mapped[k] = fn(collection[k], k, collection);
        });
        return mapped;
      }
      function find(collection, fn) {
        for (const [k, v] of enumerate(collection)) {
          const r = fn(v, k, collection);
          if (r !== none) {
            return [k, v, r];
          }
        }
        return [none, none, none];
      }
      function* enumerate(collection) {
        if (isArrayLike(collection)) {
          yield* Array.prototype.entries.call(collection);
          return;
        }
        const keys = Object.getOwnPropertyNames(collection);
        for (const k of keys) {
          yield [k, collection[k]];
        }
      }
      function isArrayLike(collection) {
        return Array.isArray(collection) || isNodeList(collection);
      }
      function isNodeList(collection) {
        return collection.constructor.name === 'NodeList';
      }
      function partial(fn, ...args) {
        if (typeof fn !== 'function') {
          throw new AdsBypasserError('must give a function');
        }
        return (...innerArgs) => {
          return fn(...args.concat(innerArgs));
        };
      }
      function isString(value) {
        return (typeof value === 'string') || (value instanceof String);
      }
      function nop() {
      }
      const none = nop;
      function wait(msDelay) {
        return new Promise((resolve) => {
          setTimeout(resolve, msDelay);
        });
      }
      function tryEvery(msInterval, fn) {
        return new Promise((resolve) => {
          const handle = setInterval(function () {
            const result = fn();
            if (result !== none) {
              clearInterval(handle);
              resolve(result);
            }
          }, msInterval);
        });
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        findHandler: () => (findHandler),
        register: () => (register)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      const patterns = [];
      function register(pattern) {
        patterns.push(pattern);
      }
      function dispatchByObject(rule, url_6) {
        const matched = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.map)(rule, (pattern, part) => {
          if (pattern instanceof RegExp) {
            return url_6[part].match(pattern);
          }
          if (Array.isArray(pattern)) {
            const [, , r] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(pattern, (sp) => {
              const m = url_6[part].match(sp);
              return m || util_core__WEBPACK_IMPORTED_MODULE_0__.none;
            });
            return r !== util_core__WEBPACK_IMPORTED_MODULE_0__.none ? r : null;
          }
          throw new util_core__WEBPACK_IMPORTED_MODULE_0__.AdsBypasserError('invalid rule');
        });
        const passed = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.every)(matched, (v) => {
          return !!v;
        });
        return passed ? matched : null;
      }
      function dispatchByRegExp(rule, url_1) {
        return url_1.match(rule);
      }
      function dispatchByArray(rules, url_1, url_3, url_6) {
        const [, , r] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(rules, (rule) => {
          const m = dispatch(rule, url_1, url_3, url_6);
          return m ? m : util_core__WEBPACK_IMPORTED_MODULE_0__.none;
        });
        return r !== util_core__WEBPACK_IMPORTED_MODULE_0__.none ? r : null;
      }
      function dispatchByString(rule, url_3) {
        let scheme = /\*|https?|file|ftp|chrome-extension/;
        let host = /\*|(\*\.)?([^/*]+)/;
        let path = /\/.*/;
        let tmp = `^(${scheme.source})://(${host.source})?(${path.source})$`;
        let up = new RegExp(tmp);
        const matched = rule.match(up);
        if (!matched) {
          return null;
        }
        scheme = matched[1];
        host = matched[2];
        const wc = matched[3];
        const sd = matched[4];
        path = matched[5];
        if (scheme === '*' && !/https?/.test(url_3.scheme)) {
          return null;
        }
        if (scheme !== url_3.scheme) {
          return null;
        }
        if (scheme !== 'file' && host !== '*') {
          if (wc) {
            up = url_3.host.indexOf(sd);
            if (up < 0 || up + sd.length !== url_3.host.length) {
              return null;
            }
          } else if (host !== url_3.host) {
            return null;
          }
        }
        tmp = path.replace(/[*.[\]?+#]/g, (c) => {
          if (c === '*') {
            return '.*';
          }
          return '\\' + c;
        });
        path = new RegExp(`^${tmp}$`);
        if (!path.test(url_3.path)) {
          return null;
        }
        return url_3;
      }
      function dispatchByFunction(rule, url_1, url_3, url_6) {
        return rule(url_1, url_3, url_6);
      }
      function dispatch(rule, url_1, url_3, url_6) {
        if (Array.isArray(rule)) {
          return dispatchByArray(rule, url_1, url_3, url_6);
        }
        if (typeof rule === 'function') {
          return dispatchByFunction(rule, url_1, url_3, url_6);
        }
        if (rule instanceof RegExp) {
          return dispatchByRegExp(rule, url_1);
        }
        if ((0, util_core__WEBPACK_IMPORTED_MODULE_0__.isString)(rule)) {
          return dispatchByString(rule, url_3);
        }
        return dispatchByObject(rule, url_6);
      }
      function findHandler() {
        const url_1 = window.location.toString();
        const url_3 = {
          scheme: window.location.protocol.slice(0, -1),
          host: window.location.host,
          path: window.location.pathname + window.location.search + window.location.hash,
        };
        const url_6 = {
          scheme: window.location.protocol,
          host: window.location.hostname,
          port: window.location.port,
          path: window.location.pathname,
          query: window.location.search,
          hash: window.location.hash,
        };
        const [i, pattern, matched] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(patterns, (pattern) => {
          const m = dispatch(pattern.rule, url_1, url_3, url_6);
          return m ? m : util_core__WEBPACK_IMPORTED_MODULE_0__.none;
        });
        if (i === util_core__WEBPACK_IMPORTED_MODULE_0__.none) {
          return null;
        }
        if (!pattern.start && !pattern.ready) {
          return null;
        }
        return {
          start: pattern.start ? (0, util_core__WEBPACK_IMPORTED_MODULE_0__.partial)(pattern.start, matched) : util_core__WEBPACK_IMPORTED_MODULE_0__.nop,
          ready: pattern.ready ? (0, util_core__WEBPACK_IMPORTED_MODULE_0__.partial)(pattern.ready, matched) : util_core__WEBPACK_IMPORTED_MODULE_0__.nop,
        };
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        GMAPI: () => (GMAPI),
        rawUSW: () => (rawUSW),
        usw: () => (usw)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      const rawUSW = getUnsafeWindow();
      const usw = getUnsafeWindowProxy();
      const GMAPI = getGreaseMonkeyAPI();
      function getUnsafeWindow() {
        let w = null;
        try {
          w = unsafeWindow;
        } catch (e) {
          try {
            w = (0, eval)('this').global;
          } catch (e) {
          }
        }
        return w ? w : (0, eval)('this').window;
      }
      function getGreaseMonkeyAPI() {
        if (rawUSW.global) {
          return null;
        }
        const gm = {};
        if (typeof GM_openInTab === 'function') {
          gm.openInTab = GM_openInTab;
        } else {
          gm.openInTab = GM.openInTab;
        }
        if (typeof GM_getValue === 'function') {
          gm.getValue = (name, default_) => {
            return Promise.resolve(GM_getValue(name, default_));
          };
        } else {
          gm.getValue = GM.getValue;
        }
        if (typeof GM_setValue === 'function') {
          gm.setValue = (name, value) => {
            return Promise.resolve(GM_setValue(name, value));
          };
        } else {
          gm.setValue = GM.setValue;
        }
        if (typeof GM_deleteValue === 'function') {
          gm.deleteValue = (name) => {
            return Promise.resolve(GM_deleteValue(name));
          };
        } else {
          gm.deleteValue = GM.deleteValue;
        }
        if (typeof GM_xmlhttpRequest === 'function') {
          gm.xmlHttpRequest = GM_xmlhttpRequest;
        } else {
          gm.xmlHttpRequest = GM.xmlHttpRequest;
        }
        if (typeof GM_registerMenuCommand === 'function') {
          gm.registerMenuCommand = GM_registerMenuCommand;
        } else {
          gm.registerMenuCommand = util_core__WEBPACK_IMPORTED_MODULE_0__.nop;
        }
        if (typeof GM_getResourceURL === 'function') {
          gm.getResourceUrl = (resourceName) => {
            return Promise.resolve(GM_getResourceURL(resourceName));
          };
        } else if (typeof GM === 'object' && GM && GM.getResourceUrl) {
          gm.getResourceUrl = GM.getResourceUrl;
        }
        return gm;
      }
      function getGMInfo() {
        if (typeof GM_info === 'object' && GM_info) {
          return GM_info;
        } else if (typeof GM === 'object' && GM && GM.info) {
          return GM.info;
        } else {
          return {};
        }
      }
      const MAGIC_KEY = '__adsbypasser_reverse_proxy__';
      function getUnsafeWindowProxy() {
        const isGreaseMonkey = getGMInfo().scriptHandler === 'Greasemonkey';
        if (!isGreaseMonkey) {
          return rawUSW;
        }
        const decorator = {
          set(target, key, value) {
            if (key === MAGIC_KEY) {
              return false;
            } else {
              target[key] = clone(value);
            }
            return true;
          },
          get(target, key) {
            if (key === MAGIC_KEY) {
              return target;
            }
            const value = target[key];
            const type = typeof value;
            if (value === null || (type !== 'function' && type !== 'object')) {
              return value;
            }
            return new Proxy(value, decorator);
          },
          apply(target, self, args) {
            args = Array.prototype.slice.call(args);
            if (target === unsafeWindow.Object.defineProperty) {
              args[0] = args[0][MAGIC_KEY];
            }
            if (target === unsafeWindow.Function.apply) {
              self = self[MAGIC_KEY];
              args[1] = Array.prototype.slice.call(args[1]);
            }
            if (target === unsafeWindow.document.querySelector) {
              self = self[MAGIC_KEY];
            }
            if (target === unsafeWindow.document.write) {
              self = self[MAGIC_KEY];
            }
            const usargs = clone(args);
            return target.apply(self, usargs);
          },
          construct(target, args) {
            args = Array.prototype.slice.call(args);
            args.unshift(undefined);
            const usargs = clone(args);
            const bind = unsafeWindow.Function.prototype.bind;
            return new (bind.apply(target, usargs));
          },
        };
        return new Proxy(unsafeWindow, decorator);
      }
      function clone(safe) {
        if (safe === null || !(safe instanceof Object)) {
          return safe;
        }
        if (safe === unsafeWindow) {
          return safe;
        }
        if (safe instanceof String) {
          return safe.toString();
        }
        if (safe instanceof Function) {
          return exportFunction(safe, unsafeWindow, {
            allowCrossOriginArguments: true,
          });
        }
        if (safe instanceof Array) {
          const unsafe = new unsafeWindow.Array();
          for (let i = 0; i < safe.length; ++i) {
            unsafe.push(clone(safe[i]));
          }
          return unsafe;
        }
        const unsafe = new unsafeWindow.Object();
        (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(safe, (v, k) => {
          unsafe[k] = clone(v);
        });
        return unsafe;
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        dumpConfig: () => (dumpConfig),
        loadConfig: () => (loadConfig)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      var util_dispatcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
      var util_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
      const MANIFEST = [
        {
          key: 'version',
          default_: 0,
          verify(v) {
            return typeof v === 'number' && v >= 0;
          },
          normalize: toNumber,
        },
        {
          key: 'align_center',
          default_: true,
          verify: isBoolean,
          normalize: toBoolean,
        },
        {
          key: 'change_background',
          default_: true,
          verify: isBoolean,
          normalize: toBoolean,
        },
        {
          key: 'redirect_image',
          default_: true,
          verify: isBoolean,
          normalize: toBoolean,
        },
        {
          key: 'scale_image',
          default_: true,
          verify: isBoolean,
          normalize: toBoolean,
        },
        {
          key: 'log_level',
          default_: 1,
          verify(v) {
            return typeof v === 'number' && v >= 0 && v <= 2;
          },
          normalize: toNumber,
        },
      ];
      const PATCHES = [
        async () => {
          const alignCenter = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('align_center');
          const changeBackground = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('change_background');
          const scaleImage = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('scale_image');
          const redirectImage = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('redirect_image');
          const ac = typeof alignCenter === 'boolean';
          if (typeof changeBackground !== 'boolean') {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('change_background', ac ? alignCenter : true);
          }
          if (typeof scaleImage !== 'boolean') {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('scale_image', ac ? alignCenter : true);
          }
          if (!ac) {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('align_center', true);
          }
          if (typeof redirectImage !== 'boolean') {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('redirect_image', true);
          }
        },
        async () => {
          const externalServerSupport = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('external_server_support');
          if (typeof externalServerSupport !== 'boolean') {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('external_server_support', false);
          }
        },
        async () => {
          const logLevel = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('log_level');
          if (typeof logLevel !== 'number') {
            await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('log_level', 1);
          }
        },
        async () => {
          await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.deleteValue('external_server_support');
        },
      ];
      function isBoolean(v) {
        return typeof v === 'boolean';
      }
      function toBoolean(v) {
        return !!v;
      }
      function toNumber(v) {
        return parseInt(v, 10);
      }
      async function senityCheck() {
        let verifyResults = MANIFEST.map(async (descriptor) => {
          const rv = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue(descriptor.key);
          return descriptor.verify(rv);
        });
        verifyResults = await Promise.all(verifyResults);
        const ok = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.every)(verifyResults, v => v);
        if (!ok) {
          await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('version', 0);
        }
      }
      async function migrate() {
        let currentVersion = await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('version');
        if (currentVersion !== 0 && !currentVersion) {
          throw new util_core__WEBPACK_IMPORTED_MODULE_0__.AdsBypasserError('invalid version');
        }
        while (currentVersion < PATCHES.length) {
          PATCHES[currentVersion]();
          ++currentVersion;
        }
        await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue('version', currentVersion);
      }
      async function loadConfig() {
        await senityCheck();
        await migrate();
        (0, util_dispatcher__WEBPACK_IMPORTED_MODULE_1__.register)({
          rule: {
            host: /^adsbypasser\.github\.io$/,
            path: /^\/configure\.html$/,
          },
          async ready() {
            await waitForPage();
            util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.commit = async (data) => {
              for (const [k, v] of Object.entries(data)) {
                await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.setValue(k, v);
              }
            };
            util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.render({
              version: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('version'),
              options: {
                align_center: {
                  type: 'checkbox',
                  value: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('align_center'),
                  label: 'Align Center',
                  help: 'Align image to the center if possible. (default: enabled)',
                },
                change_background: {
                  type: 'checkbox',
                  value: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('change_background'),
                  label: 'Change Background',
                  help: 'Use Firefox-like image background if possible. (default: enabled)',
                },
                redirect_image: {
                  type: 'checkbox',
                  value: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('redirect_image'),
                  label: 'Redirect Image',
                  help: [
                    'Directly open image link if possible. (default: enabled)',
                    'If disabled, redirection will only works on link shortener sites.',
                  ].join('<br/>\n'),
                },
                scale_image: {
                  type: 'checkbox',
                  value: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('scale_image'),
                  label: 'Scale Image',
                  help: 'When image loaded, scale it to fit window if possible. (default: enabled)',
                },
                log_level: {
                  type: 'select',
                  value: await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue('log_level'),
                  menu: [
                    [0, '0 (quiet)'],
                    [1, '1 (default)'],
                    [2, '2 (verbose)'],
                  ],
                  label: 'Log Level',
                  help: [
                    'Log level in developer console. (default: 1)',
                    '0 will not print anything in console.',
                    '1 will only print logs on affected sites.',
                    '2 will print on any sites.',
                  ].join('<br/>\n'),
                },
              },
            });
          },
        });
      }
      function waitForPage() {
        return new Promise((resolve) => {
          const i = setInterval(() => {
            if (util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.render) {
              clearInterval(i);
              resolve();
            }
          }, 50);
        });
      }
      async function dumpConfig() {
        let rv = MANIFEST.map(async (descriptor) => {
          return [descriptor.key, await util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.getValue(descriptor.key)];
        });
        rv = await Promise.all(rv);
        const o = {};
        for (const [k, v] of rv) {
          o[k] = v;
        }
        return o;
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        debug: () => (debug),
        info: () => (info),
        warn: () => (warn)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      const quiet = false;
      function log(method, args) {
        if (quiet) {
          return;
        }
        args = Array.prototype.slice.call(args);
        if ((0, util_core__WEBPACK_IMPORTED_MODULE_0__.isString)(args[0])) {
          args[0] = 'AdsBypasser: ' + args[0];
        } else {
          args.unshift('AdsBypasser:');
        }
        const f = console[method];
        if (typeof f === 'function') {
          f.apply(console, args);
        }
      }
      function debug() {
        log('debug', arguments);
      }
      function info() {
        log('info', arguments);
      }
      function warn() {
        log('warn', arguments);
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      var _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^ak\.sv$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          const any = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('html');
          any.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(6000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[class="download_button"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?apunkasoftware\.net$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div#proceed-now > a#dlink');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^thefileslocker\.net$/,
        },
        async ready() {
          const button = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#downloadbtn');
          button.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^(www\.)?indishare\.org$/,
            /^uploadrar\.com$/,
          ],
        },
        async ready() {
          const btn = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('button#downloadbtn.downloadbtn');
          btn.removeAttribute('disabled');
          btn.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^infidrive\.net$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(40000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('button.inline-flex:nth-child(2)');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^k2s\.cc$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(35000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a.link-to-file');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^katfile\.com$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[id="dlink"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?keeplinks\.org$/,
        },
        async ready() {
          const button = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('[id="btnproceedsubmit"]');
          button.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: 'https://www.mirrored.to/files/*',
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.col-sm.centered.extra-top a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host:
            /^multiup\.io$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-info.btn-lg.btn-block');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.onlinefreecourse\.net$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[class="btn btn-success"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^sfile\.mobi$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const btn = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#download');
          btn.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^uploadhaven\.com$/,
          path: /^\/download\//,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(18000);
          const f = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-submit-free.btn-download-free');
          f.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^usersdrive\.com$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-download');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^1ink\.cc$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#countingbtn');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^1link\.club$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#download.btn');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^1v\.to$/,
          path: /^\/t\/[a-zA-Z0-9/=]+/,
        },
        async start() {
          const path = window.location.href.replace('/t/', '/saliendo/');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host:
            /^a2zapk\.io$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#dlbtn li a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^adfoc\.us$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.skip');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^adshnk\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(16000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('button[class="ui right labeled icon button primary huge fluid"]');
          b.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(18000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[id="final_redirect"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.adz7short\.space$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#continue');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(10000);
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^bcvc\.ink$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(5000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#getLink');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?biglistofwebsites\.com$/,
          path: /^\/go\/(\w+\.\w+)$/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink('http://' + m.path[1]);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: [
          {
            host: /^(www\.)?([a-zA-Z0-9]+\.)?binbox\.io$/,
            path: /\/o\/([a-zA-Z0-9]+)/,
          }
        ],
        async start(m) {
          const direct_link = window.atob(m.path[1]);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(direct_link);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^bioskopkeren\.boo$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          const c = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.reklamgec');
          c.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^boost\.ink$/,
        },
        async start() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('body').getAttribute('result');
          if (b) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(atob(b));
          } else {
            return;
          }
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^cocoleech\.com$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-block.btn-success');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^cpmlink\.net$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#btn-main');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^ctr\.sh$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-primary.btn-captcha');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^cutpaid\.com$/,
        },
        async ready() {
          let a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-primary');
          if (a) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(20000);
            a.click();
          }
          a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(9000);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.dlink3\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('[class="myButton"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^dlupload\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(3500);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-block.btn-primary.text-white.shadow.m-1.position-relative.up-tooltip-container');
          b.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(6000);
          const btn = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-block.continue-btn-bg');
          btn.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^earnlink\.io$/,
        },
        async ready() {
          const directUrl = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/"([^"]+)"\)\.html\("Continue"\)/);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(directUrl[1]);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^forex-trnd\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(10000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.get-link');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^exeo\.app$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.link-button.button');
          a.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(2000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.link-button');
          b.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(6000);
          const c = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.link-button.get-link');
          c.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^fc-lc\.(com|xyz)$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(2000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-primary.btn-captcha.mb-4');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^loaninsurehub\.com$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#glink');
          if (b) {
            b.click();
          }
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('#overlay');
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#surl');
          if (a) {
            a.click();
          }
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^fir3\.net$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-success.btn-lg.get-link');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^get-click2\.blogspot\.com$/,
        },
        async ready() {
          const clbt = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('button#gotolink');
          clbt.removeAttribute('disabled');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1);
          clbt.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^getthot\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.skip-btn');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^gplinks\.co$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const d = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.get-link');
          d.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^hen-tay\.net$/,
          path: /^\/go\//,
        },
        async ready() {
          const h = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#download_url div a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(h.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^hotshorturl\.com$/,
        },
        async ready() {
          const frame = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('frame[scrolling=yes]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(frame.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^icutlink\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(10000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^zegtrends\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div > button.bsub');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imagetwist\.netlify\.app$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-dark');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule:
        {
          host: /^www\.javlibrary\.com$/,
          query: /url=([^&]+)/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(decodeURIComponent(m.query[1]));
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^kimochi\.info$/,
          path: /^\/inter$/
        },
        async ready() {
          const ma = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a#next');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(ma.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?kingofshrink\.com$/,
        },
        async ready() {
          const l = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#textresult > a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(l.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^linegee\.net$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('p.kecil a');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^link\.turkdown\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(5000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^link1s\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(10000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-success.btn-lg.get-link');
          b.click();
        },
      });
      (function () {
        _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
          rule: {
            host: [
              /^adsafelink\.com$/,
              /^birdurls\.com$/,
              /^dz4link\.com$/,
              /^(linkmoni|shrinkcash)\.com$/,
              /^shrt10\.com$/,
              /^tmearn\.net$/,
              /^vinaurl\.net$/,
              /^payskip\.org$/,
              /^clik\.pw$/,
              /^miniurl\.pw$/,
              /^aylink\.co$/,
              /^(clk|oko)\.sh$/,
              /^cpmlink\.pro$/,
              /^gitlink\.pro$/,
              /^megalink\.pro$/,
              /^met\.bz/,
              /^mitly\.us$/,
              /^oke\.io$/,
              /^pahe\.plus$/,
              /^pingit\.im$/,
              /^thotpacks\.xyz$/,
            ],
          },
          async ready() {
            const handler = new RecaptchaHandler();
            await handler.call();
          },
        });
        class AbstractHandler {
          constructor() {
            this._overlaySelector = [
              '[class$="Overlay"]',
              '#__random_class_name__',
              '#headlineatas',
              '#myModal',
              '.opacity_wrapper',
              '#overlay',
            ].join(', ');
            this._formSelector = [
              '#go-link',
              '.go-link',
              '#originalLink.get-link',
              'form[action="/links/go"]',
            ].join(', ');
          }
          removeOverlay() {
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove(this._overlaySelector);
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.block(this._overlaySelector, document.body);
            setInterval(() => {
              document.body.style.overflow = 'initial';
            }, 500);
          }
          removeFrame() {
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('iframe');
          }
          async call() {
            const ok = await this.prepare();
            if (!ok) {
              return;
            }
            const mw = await this.getMiddleware();
            if (!mw) {
              this.withoutMiddleware();
              return;
            }
            const url = await this.getURL(mw);
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(url);
          }
        }
        class RecaptchaHandler extends AbstractHandler {
          async prepare() {
            this.removeOverlay();
            const f = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#captchaShortlink, div.g-recaptcha');
            if (!f) {
              return true;
            }
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.info('recaptcha detected, stop');
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.info('trying to listen submit button');
            const b = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#invisibleCaptchaShortlink');
            if (!b) {
              return false;
            }
          }
          async submitListen(b) {
            const o = new MutationObserver(() => {
              if (!b.disabled) {
                b.click();
              }
            });
            o.observe(b, {
              attributes: true,
            });
          }
          async getMiddleware() {
            return await getJQueryForm(this._formSelector);
          }
          withoutMiddleware() {
            const f = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#link-view');
            f.submit();
          }
          async getURL(jForm) {
            while (true) {
              await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
              try {
                const url = await getURLFromJQueryForm(jForm);
                if (url) {
                  return url;
                }
              } catch (e) {
                _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.warn(e);
              }
            }
          }
        }
        async function getJQueryForm(selector) {
          let jQuery = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.$;
          while (!jQuery) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(50);
            jQuery = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.$;
          }
          const f = jQuery(selector);
          if (f.length > 0) {
            return f;
          }
          return null;
        }
        function getURLFromJQueryForm(jForm) {
          return new Promise((resolve, reject) => {
            if (jForm.is('a') && jForm.attr('href')) {
              resolve(jForm.attr('href'));
            }
            const jQuery = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.$;
            jQuery.ajax({
              dataType: 'json',
              type: 'POST',
              url: jForm.attr('action'),
              data: jForm.serialize(),
              success: (result) => {
                if (result.url) {
                  resolve(result.url);
                } else {
                  reject(new _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.AdsBypasserError(result.message));
                }
              },
              error: (xhr, status, error) => {
                _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.warn(xhr, status, error);
                reject(new _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.AdsBypasserError('request error'));
              },
            });
          });
        }
      })();
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^n\.fcd\.su$/,
        },
        async ready() {
          const btn = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a.btn:nth-child(2)');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(btn.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^linkpoi\.me$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(6000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-primary.btn-block.redirect.get-link');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^linkshrink\.net$/,
          path: /^\/[a-zA-Z0-9]+$/,
        },
        async start() {
          _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window._impspcabe = 0;
        },
        async ready() {
          let l = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/revC\("([^"]+)"\)/);
          l = atob(l[1]);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink('/' + l);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^linksly\.co$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-primary');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^go\.linksly\.co$/,
            /^go\.bitcosite\.com$/,
          ],
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^lnk2\.cc$/,
          path: /^\/go\//,
        },
        async ready() {
          _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('iframe, .popupOverlay');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(18000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#getLink');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.lolinez\.com$/,
          query: /\?(.+)/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(m.query[1]);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^mangalist\.org$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-primary.url.text-center');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host:
            /^mylink\.us$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div.skip_btn a');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^nmac\.to$/,
          path: /^\/dl\/(.+)/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-medium.btn-block');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^noriskdomain\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(10000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.uk-button-primary.go-to-button');
          b.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.uk-button-primary.go-to-button');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^noweconomy\.live$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('[class="btn-main get-link"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.oni\.vn$/,
        },
        async ready() {
          _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('iframe');
          let data = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/data:"([^"]+)"/);
          if (!data) {
            throw new _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.AdsBypasserError('pattern changed');
          }
          data = data[1];
          const url = await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.get('/click.html', data);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(url);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^otomi-games\.com$/,
          path: /^\/go\//
        },
        async ready() {
          const ma = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#wpsafe-link a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(ma.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?ouo\.(io|press)$/,
          path: /(^\/\w+$|^\/go\/\w+$)/,
        },
        async ready() {
          (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('form').submit();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^paylinnk\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(2000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div.banner.banner-captcha');
          a.click();
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-success.btn-lg.get-link');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^icerik\.site$/,
          path: /^\/go/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(500);
          const button = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#get_link_btn');
          button.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^realsht\.mobi$/,
          ],
        },
        async ready() {
          const n = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#download_link');
          n.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^preview\.rlu\.ru$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#content > .long_url > a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host:
            /^segmentnext\.com$/,
          path: /^\/interstitial\.html$/,
          query: /return_url=([^&]+)/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(decodeURIComponent(m.query[1]));
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^shink\.me$/,
            /^shon\.xyz$/,
          ],
        },
        async ready() {
          const f = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#skip');
          f.submit();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(short|srt)\.am$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(5000);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink('', {
            post: {
              _image: 'Continue',
            },
          });
        },
      });
      (function () {
        const hostRules = [
          /^(cllkme|clkmein|corneey|ceesty)\.com$/,
          /^(destyy|festyy|gestyy)\.com$/,
          /^sh\.st$/,
        ];
        _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
          rule: {
            host: hostRules,
            path: /^\/[\d\w]+/,
          },
          async ready() {
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('iframe');
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.removeAllTimer();
            const m = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/sessionId: "([\d\w]+)",/);
            if (m) {
              afterGotSessionId(m[1]);
              return;
            }
            const o = new MutationObserver((mutations) => {
              mutations.forEach(() => {
                const m = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/sessionId: "([\d\w]+)",/);
                if (m) {
                  o.disconnect();
                  afterGotSessionId(m[1]);
                }
              });
            });
            o.observe(document.body, {
              childList: true,
            });
          },
        });
        function afterGotSessionId(sessionId) {
          const X_NewRelic_ID = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/xpid:"([^"]+)"/);
          const data = {
            adSessionId: sessionId,
          };
          const header = {
            Accept: 'application/json, text/javascript',
          };
          if (X_NewRelic_ID) {
            header['X-NewRelic-ID'] = X_NewRelic_ID;
          }
          const i = setInterval(function () {
            _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.get('/shortest-url/end-adsession', data, header).then(function (text) {
              const r = JSON.parse(text);
              if (r.status == 'ok' && r.destinationUrl) {
                clearInterval(i);
                _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.removeAllTimer();
                const url = decodeURIComponent(r.destinationUrl);
                return _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(url);
              }
            });
          }, 1000);
        }
      })();
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^shortlinkto\.biz$/,
            /^uplinkto\.hair$/,
          ],
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.view-well a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?shortly\.xyz$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^shortmoz\.link$/,
        },
        async ready() {
          const button = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-primary.btn-block');
          button.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?similarsites\.com$/,
          path: /^\/goto\/([^?]+)/
        },
        async start(m) {
          let l = m.path[1];
          if (!/^https?:\/\//.test(l)) {
            l = 'http://' + l;
          }
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(l);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^spacetica\.com$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn.btn-primary.btn-xs');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.spaste\.com$/,
          path: /^\/site\//,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(15000);
          (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#template-contactform-submit').click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^stfly\.(me|xyz)$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-captcha.m-2.form-send');
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^blogbux\.net$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-captcha.m-2.form-send');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^techtrendmakers\.com$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-captcha.m-2.form-send.step_btn');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(6000);
          b.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?supercheats\.com$/,
          path: /^\/interstitial\.html$/,
          query: /(?:\?|&)oldurl=([^&]+)(?:$|&)/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(m.query[1]);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^swzz\.xyz$/,
          path: /^\/link\//,
        },
        async ready() {
          const g = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a.btn.btn-primary');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(g.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^techgeek\.digital$/,
        },
        async ready() {
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('[class="btn-main get-link"]');
          if (b) {
            b.click();
          }
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[class="btn-main get-link"]');
          if (a) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
          }
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^thinfi\.com$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div p a');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^go\.tnshort\.net$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(3000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('a[class="btn btn-success btn-lg get-link"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^tribuntekno\.com$/,
        },
        async ready() {
          const b = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#lite-human-verif-button');
          if (b) {
            b.click();
          }
          const c = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#lite-start-sora-button');
          if (c) {
            c.click();
          }
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^tutwuri\.id$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#btn-1');
          a.click();
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(12000);
          const b = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#btn-2');
          b.click();
          const c = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#btn-3');
          c.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^urlbluemedia\.shop$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(7000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('input#nut');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /(^|\.)urlcash\.(com|org)$/,
            /^(detonating|smilinglinks|pornyhost|urlgalleries)\.com$/,
            /^looble\.net$/,
            /^xxxs\.org$/,
          ],
        },
        async ready() {
          if (_ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window && _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.linkDestUrl) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(_ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.linkDestUrl);
            return;
          }
          const matches = document.body.innerHTML.match(/linkDestUrl = '(.+)'/);
          if (matches) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(matches[1]);
            return;
          }
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?vzturl\.com$/,
        },
        async ready() {
          const frame = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('frame[scrolling=yes]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(frame.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^xpshort\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(8000);
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.btn-success.btn-lg.get-link');
          a.click();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/ia-[aio]\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/ia-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/ib-[aior]\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/ib-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/i-[ai1]\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/i-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/x-[aor]\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/x-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/y-[ao1]\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/y-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^22pixx\.xyz$/,
          path: /^\/x-i\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/x', '/y');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^abload\.de$/,
            /^imageup\.ru$/,
          ],
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^acidimg\.cc$/,
            /^imx\.to$/,
          ],
        },
        async ready() {
          let a = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#continuebutton, .button');
          if (a) {
            a.click();
          }
          a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.centred');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(a.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^bayimg\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#mainImage');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^beeimg\.com$/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#beeimage');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.casimages\.com$/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('div.logo a img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^cubeupload\.com$/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('img.galleryBigImg');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(depic|dpic)\.me$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#pic');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.directupload\.net$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#ImgFrame');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^fastpic\.org$/,
          path: /^\/view\//,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#picContainer img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^crownimg\.com$/,
            /^fotokiz\.com$/,
            /^imgbaron\.com$/,
            /^imgsen\.com$/,
            /^imgsto\.com$/,
            /^kropic\.com$/,
            /^kvador\.com$/,
            /^picbaron\.com$/,
            /^picdollar\.com$/,
            /^pics4upload\.com$/,
            /^silverpic\.com$/,
            /^barbit\.net$/,
            /^pics4you\.net$/,
            /^imgstar\.eu$/,
            /^www\.fappic\.com$/,
          ],
        },
        async ready() {
          const i = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('img.pic');
          if (i) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
            return;
          }
          const f = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('form');
          f.submit();
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.fotosik\.pl$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.simple-photo img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.hostpic\.org$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#photo');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.imagebam\.com$/,
        },
        async ready() {
          let a = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#continue > a');
          if (a) {
            a.click();
          }
          a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.main-image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(a.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imageban\.ru$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#img_main');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        }
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imagehaha\.com$/,
          path: /\/*\/.*/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('img.img-responsive');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: 'https://www.imagehost.at/image/*',
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('meta[property="og:image"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.content);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.imagenetz\.de$/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.img-rounded.img-responsive');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imageshack\.com$/,
          path: /^\/i\//,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#lp-image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule:
        {
          host: [
            /^imagetwist\.com$/,
            /^imagenpic\.com$/,
            /^imagexport\.com$/,
            /^imageshimage\.com$/,
            /^croea\.com$/,
            /^vipr\.im$/,
          ]
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('img.pic');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        }
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imageupper\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.imagevenue\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#main-image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule:
        {
          host: [
            /^cloudgallery\.net$/,
            /^imgair\.net$/,
            /^imgblaze\.net$/,
            /^imgfrost\.net$/,
            /^img[a-z]{2,10}\.(sbs|shop)$/,
            /^pic[a-z]{2,10}\.(sbs|shop)$/,
            /^pix[a-z]{2,10}\.sbs$/,
          ],
        },
        async ready() {
          const matches = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.searchFromScripts(/imgbg\.src = "([^"]+)";/);
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(matches[1]);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^(imgbase|picforall)\.ru$/,
          ],
        },
        async ready() {
          let i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#pay_thumb_img img');
          i = i.getAttribute('onclick');
          i = i.match(/mshow\('(.+)'\)/);
          i = i[1];
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^imgbb\.com$/,
            /^ibb\.co$/,
          ],
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.image-viewer-container img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgbox\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^2i\.(cz|sk)$/,
            /^(picnew|rintor)\.space$/,
            /^[0-9]{1,3}xpics\.space$/,
            /^imgcloud\.pw$/,
            /^pilot007\.org$/,
            /^img\.javstore\.net$/,
            /^www\.imghit\.com$/,
            /^xxxaddicted\.top$/,
          ],
          path: /^\/(image|i)\/.*/,
        },
        async ready() {
          const l = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('link[rel="image_src"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(l.href);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgdawgknuttz\.com$/,
        },
        async ready() {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.wait(1000);
          let a = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('.button');
          if (a) {
            a.click();
          }
          a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.centred');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(a.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^(www\.)?imgdrive\.net$/,
            /^(www\.)?(imgtaxi|imgwallet|imgadult)\.com$/,
          ],
        },
        async ready() {
          let m = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('meta[property="og:image"]');
          m = m.content.replace('small', 'big');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(m);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgflip\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#im');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        }
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: [
          {
            host: [
              /^imgking\.co$/,
              /^imgkings\.com$/,
            ],
            path: /^\/img*.*\.html/,
          },
        ],
        async ready() {
          const url = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.window.linkid;
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(url);
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('img[alt]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgprime\.com$/,
        },
        async ready() {
          let a = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#continuetoimage a');
          if (a) {
            await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(a.href);
            return;
          }
          a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('center a img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(a.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgspice\.com$/,
        },
        async ready() {
          const o = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#imgpreview.pic');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(o.src);
        }
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgtraffic\.com$/,
          path: /^\/a-1\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/a-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgtraffic\.com$/,
          path: /^\/i-1\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/i-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgtraffic\.com$/,
          path: /^\/n-1\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/n-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^imgtraffic\.com$/,
          path: /^\/z-1\/(.+)\.jpeg\.html/,
        },
        async start() {
          const path = window.location.href.replace('/z-', '/').replace('.html', '');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(path);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: [
          'https://4fuk.me/upload/en/*',
          'https://555fap.com/upload/en/*',
          'https://ai18.pics/upload/en/*',
          'https://cnpics.org/upload/en/*',
          'https://cnxx.me/upload/en/*',
          'https://cosplay18.pics/upload/en/*',
          'https://idol69.net/upload/en/*',
          'https://javball.com/upload/en/*',
          'https://javsunday.com/upload/en/*',
          'https://kin8-av.com/upload/en/*',
          'https://ovabee.com/upload/en/*',
          'https://pig69.com/upload/en/*',
          'https://porn4f.com/upload/en/*',
        ],
        async ready() {
          const m = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('meta[property="og:image"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(m.content);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^keptarolo\.hu$/,
          path: /^(\/[^/]+\/[^/]+)$/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage('http://www.keptarolo.hu/kep' + m.path[1]);
        },
      });
      (function () {
        _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
          rule: {
            host: [
              /^miragepics\.com$/,
              /^foto-pic\.net$/,
            ],
            path: /^\/viewer\.php$/,
            query: /file=([^&]+)/,
          },
          start: helper,
        });
        async function helper(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage('/images/' + m.query[1]);
        }
      })();
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.mrjh\.org$/,
          path: /^\/gallery\.php$/,
          query: /^\?entry=(.+)$/,
        },
        async ready(m) {
          const url = m.query[1];
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage('/' + url);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.noelshack\.com$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('meta[property="og:image"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.content);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^dewimg\.com$/,
            /^outletpic\.com$/,
            /^pictwn\.com$/,
            /^picyield\.com$/,
            /^tezzpic\.com$/,
          ],
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('center > img.picview');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.pic-upload\.de$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.preview_picture_2b');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^picstate\.com$/,
          path: /^\/view\/full\/.*/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#image_container a img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^picturedent\.org$/,
            /^everest\.picturedent\.org$/,
            /^pacific\.picturedent\.org$/,
          ],
          path: /^\/image\//,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#full_img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?pimpandhost\.com$/,
          path: /^\/image\/\d+/,
          query: /^\?size=original/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#overflow-wrapper img.original');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?pimpandhost\.com$/,
          path: /^\/image\/\d+/,
        },
        async start(m) {
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openLink(m.path + '?size=original');
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: [
          {
            host: /^(www\.)?pixhost\.to$/,
            path: /^\/show\//,
          },
          {
            host: [
              /^3xplanet\.(com|net)$/,
              /^javtenshi\.com$/,
              /^jav-load\.com$/,
              /^uncenav\.com$/,
            ],
            path: /^\/viewimage\//,
          }
        ],
        async ready() {
          _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.remove('iframe, #ad');
          let o = _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.$('#all');
          if (o) {
            o.style.display = '';
          }
          o = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#show_image, #image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(o.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^(www\.)?pixroute\.com$/,
        },
        async ready() {
          const o = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#download_box img#imgpreview.pic');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(o.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^postimg\.cc$/,
            /^postlmg\.cc$/,
            /^pixxxels\.cc$/,
          ],
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#main-image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^prnt\.sc$/,
          ],
          path: /\.html$/,
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: [
            /^prnt\.sc$/,
          ],
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#screenshot-image');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^pronpic\.org$/,
        },
        async ready() {
          const urlBaseImg = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('table.new_table2:nth-child(1) img.link');
          const baseUrl = urlBaseImg.src.split('th_')[0];
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('table.new_table2:nth-child(2) img.link');
          const url = baseUrl + img.src.split('th_')[1];
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(url);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^starimage\.club$/,
          path: /^\/image\/.+$/,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('input#embed-code-2.text-input').getAttribute('value');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^thotimg\.xyz$/,
        },
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('center > img');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: [
          {
            host: [
              /^img\.trafficimage\.club$/,
              /^trafficimage\.club$/,
            ],
            path: /^\/image\//,
          },
          {
            host: /^im\.ge$/,
            path: /^\/i\//,
          },
        ],
        async ready() {
          const img = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('meta[property="og:image"]');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(img.content);
        }
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^www\.turboimagehost\.com$/,
          path: /^\/p\//,
        },
        async ready() {
          const i = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('#imageid');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(i.src);
        },
      });
      _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__._.register({
        rule: {
          host: /^xxxwebdlxxx\.(org|top)$/,
        },
        async ready() {
          const a = (0, _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$)('.centred, .centred_resized');
          await _ADSBYPASSER_NAMESPACE___WEBPACK_IMPORTED_MODULE_0__.$.openImage(a.src);
        },
      });
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        $: () => ($),
        _: () => (_)
      });
      var util_ajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
      var util_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
      var util_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
      var util_dispatcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
      var util_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
      var util_image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
      var util_link__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
      var util_logger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5);
      var util_misc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(13);
      var util_platform__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3);
      const _ = {
        AdsBypasserError: util_core__WEBPACK_IMPORTED_MODULE_2__.AdsBypasserError,
        evil: util_misc__WEBPACK_IMPORTED_MODULE_8__.evil,
        find: util_core__WEBPACK_IMPORTED_MODULE_2__.find,
        forEach: util_core__WEBPACK_IMPORTED_MODULE_2__.forEach,
        generateRandomIP: util_misc__WEBPACK_IMPORTED_MODULE_8__.generateRandomIP,
        info: util_logger__WEBPACK_IMPORTED_MODULE_7__.info,
        none: util_core__WEBPACK_IMPORTED_MODULE_2__.none,
        partial: util_core__WEBPACK_IMPORTED_MODULE_2__.partial,
        register: util_dispatcher__WEBPACK_IMPORTED_MODULE_3__.register,
        tryEvery: util_core__WEBPACK_IMPORTED_MODULE_2__.tryEvery,
        wait: util_core__WEBPACK_IMPORTED_MODULE_2__.wait,
        warn: util_logger__WEBPACK_IMPORTED_MODULE_7__.warn,
      };
      function $(selector, context) {
        return (0, util_dom__WEBPACK_IMPORTED_MODULE_4__.querySelector)(selector, context);
      }
      $.$ = util_dom__WEBPACK_IMPORTED_MODULE_4__.querySelectorOrNull;
      $.$$ = util_dom__WEBPACK_IMPORTED_MODULE_4__.querySelectorAll;
      $.block = util_dom__WEBPACK_IMPORTED_MODULE_4__.block;
      $.get = util_ajax__WEBPACK_IMPORTED_MODULE_0__.get;
      $.getCookie = util_cookie__WEBPACK_IMPORTED_MODULE_1__.getCookie;
      $.nuke = util_misc__WEBPACK_IMPORTED_MODULE_8__.nuke;
      $.openImage = util_image__WEBPACK_IMPORTED_MODULE_5__.openImage;
      $.openLink = util_link__WEBPACK_IMPORTED_MODULE_6__.openLink;
      $.post = util_ajax__WEBPACK_IMPORTED_MODULE_0__.post;
      $.remove = util_dom__WEBPACK_IMPORTED_MODULE_4__.remove;
      $.removeAllTimer = util_misc__WEBPACK_IMPORTED_MODULE_8__.removeAllTimer;
      $.resetCookies = util_cookie__WEBPACK_IMPORTED_MODULE_1__.resetCookies;
      $.searchFromScripts = util_dom__WEBPACK_IMPORTED_MODULE_4__.searchFromScripts;
      $.setCookie = util_cookie__WEBPACK_IMPORTED_MODULE_1__.setCookie;
      $.toDOM = util_dom__WEBPACK_IMPORTED_MODULE_4__.toDOM;
      $.window = util_platform__WEBPACK_IMPORTED_MODULE_9__.usw;
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        get: () => (get),
        post: () => (post)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      var util_platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
      var util_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
      class AjaxError extends util_core__WEBPACK_IMPORTED_MODULE_0__.AdsBypasserError {
        constructor(method, url, data, headers, status, response) {
          super(`${method} ${url} got ${status}`);
          this._method = method;
          this._url = url;
          this._data = data;
          this._headers = headers;
          this._status = status;
          this._response = response;
        }
        get name() {
          return 'AjaxError';
        }
        get method() {
          return this._method;
        }
        get url() {
          return this._url;
        }
        get data() {
          return this._data;
        }
        get headers() {
          return this._headers;
        }
        get status() {
          return this._status;
        }
        get response() {
          return this._response;
        }
      }
      function* flattenObject(object) {
        if (!object) {
          return;
        }
        for (const [k, v] of Object.entries(object)) {
          if (Array.isArray(v)) {
            for (const v_ of v) {
              yield [[k, ''], v_];
            }
          } else if (typeof v === 'object') {
            for (const [k_, v_] of flattenObject(v)) {
              yield [[k, ...k_], v_];
            }
          } else {
            yield [[k], v];
          }
        }
      }
      function flattenKey(keyList) {
        const [head, ...rest] = keyList;
        return `${head}${rest.map(_ => `[${_}]`)}`;
      }
      function deepJoin(prefix, object) {
        const keys = Object.getOwnPropertyNames(object);
        const mapped = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.map)(keys, (k) => {
          const v = object[k];
          const key = `${prefix}[${k}]`;
          if (typeof v === 'object') {
            return deepJoin(key, v);
          }
          const tmp = [key, v].map(encodeURIComponent);
          return tmp.join('=');
        });
        return mapped.join('&');
      }
      function toQuery(data) {
        const type = typeof data;
        if (data === null || (type !== 'string' && type !== 'object')) {
          return '';
        }
        if (type === 'string') {
          return data;
        }
        if (data instanceof String) {
          return data.toString();
        }
        const keys = Object.getOwnPropertyNames(data);
        return (0, util_core__WEBPACK_IMPORTED_MODULE_0__.map)(keys, (k) => {
          const v = data[k];
          if (typeof v === 'object') {
            return deepJoin(k, v);
          }
          const tmp = [k, v].map(encodeURIComponent);
          return tmp.join('=');
        }).join('&');
      }
      function toForm(data) {
        const type = typeof data;
        if (data === null || (type !== 'string' && type !== 'object')) {
          return '';
        }
        if (type === 'string') {
          return data;
        }
        if (data instanceof String) {
          return data.toString();
        }
        const form = new FormData();
        for (const [k, v] of flattenObject(data)) {
          form.append(flattenKey(k), v);
        }
        return form;
      }
      function ajax(method, url, data, headers) {
        (0, util_logger__WEBPACK_IMPORTED_MODULE_2__.debug)('ajax', method, url, data, headers);
        const l = document.createElement('a');
        l.href = url;
        const reqHost = l.hostname;
        const overrideHeaders = {
          Host: reqHost || window.location.host,
          Origin: window.location.origin,
          Referer: window.location.href,
          'X-Requested-With': 'XMLHttpRequest',
        };
        (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(overrideHeaders, (v, k) => {
          if (headers[k] === util_core__WEBPACK_IMPORTED_MODULE_0__.none) {
            delete headers[k];
          } else {
            headers[k] = v;
          }
        });
        if (data) {
          if (headers['Content-Type'].indexOf('json') >= 0) {
            data = JSON.stringify(data);
          } else if (headers['Content-Type'].indexOf('multipart') >= 0) {
            data = toForm(data);
          } else {
            data = toQuery(data);
          }
          headers['Content-Length'] = data.length;
        }
        return new Promise((resolve, reject) => {
          util_platform__WEBPACK_IMPORTED_MODULE_1__.GMAPI.xmlHttpRequest({
            method: method,
            url: url,
            data: data,
            headers: headers,
            onload(response) {
              response = (typeof response.responseText !== 'undefined') ? response : this;
              if (response.status !== 200) {
                reject(new AjaxError(method, url, data, headers, response.status, response.responseText));
              } else {
                resolve(response.responseText);
              }
            },
            onerror(response) {
              response = (typeof response.responseText !== 'undefined') ? response : this;
              reject(new AjaxError(method, url, data, headers, response.status, response.responseText));
            },
          });
        });
      }
      function get(url, data, headers) {
        data = toQuery(data);
        data = data ? '?' + data : '';
        headers = headers || {};
        return ajax('GET', url + data, '', headers);
      }
      function post(url, data, headers) {
        const h = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        };
        if (headers) {
          (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(headers, (v, k) => {
            h[k] = v;
          });
        }
        return ajax('POST', url, data, h);
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        getCookie: () => (getCookie),
        resetCookies: () => (resetCookies),
        setCookie: () => (setCookie)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      function setCookie(key, value) {
        document.cookie = `${key}=${value};path=${location.pathname};`;
      }
      function getCookie(key) {
        let [, c,] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(document.cookie.split(';'), (v) => {
          const k = v.replace(/^\s*([a-zA-Z0-9-_]+)=.+$/, '$1');
          if (k !== key) {
            return util_core__WEBPACK_IMPORTED_MODULE_0__.none;
          }
        });
        if (c === util_core__WEBPACK_IMPORTED_MODULE_0__.none) {
          return null;
        }
        c = c.replace(/^\s*[a-zA-Z0-9-_]+=([^;]+).?$/, '$1');
        if (!c) {
          return null;
        }
        return c;
      }
      function resetCookies() {
        const a = document.domain;
        const b = document.domain.replace(/^www\./, '');
        const c = document.domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2');
        const d = (new Date(1e3)).toUTCString();
        (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(document.cookie.split(';'), (v) => {
          const k = v.replace(/^\s*(\w+)=.+$/, '$1');
          document.cookie = `${k}=;expires=${d};`;
          document.cookie = `${k}=;path=/;expires=${d};`;
          const e = (a, b, c) => `${a}=;path=/;domain=${b};expires=${c};`;
          document.cookie = e(k, a, d);
          document.cookie = e(k, b, d);
          document.cookie = e(k, c, d);
        });
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        block: () => (block),
        querySelector: () => (querySelector),
        querySelectorAll: () => (querySelectorAll),
        querySelectorOrNull: () => (querySelectorOrNull),
        remove: () => (remove),
        searchFromScripts: () => (searchFromScripts),
        toDOM: () => (toDOM)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      var util_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
      class DomNotFoundError extends util_core__WEBPACK_IMPORTED_MODULE_0__.AdsBypasserError {
        constructor(selector) {
          super(`\`${selector}\` not found`);
        }
        get name() {
          return 'DomNotFoundError';
        }
      }
      function querySelector(selector, context) {
        if (!context || !context.querySelector) {
          context = document;
        }
        const n = context.querySelector(selector);
        if (!n) {
          throw new DomNotFoundError(selector);
        }
        return n;
      }
      function querySelectorOrNull(selector, context) {
        try {
          return querySelector(selector, context);
        } catch (e) {
          return null;
        }
      }
      function querySelectorAll(selector, context) {
        if (!context || !context.querySelectorAll) {
          context = document;
        }
        const ns = context.querySelectorAll(selector);
        return ns;
      }
      function toDOM(rawHTML) {
        try {
          const parser = new DOMParser();
          const DOMHTML = parser.parseFromString(rawHTML, 'text/html');
          return DOMHTML;
        } catch (e) {
          throw new util_core__WEBPACK_IMPORTED_MODULE_0__.AdsBypasserError('could not parse HTML to DOM');
        }
      }
      function remove(selector, context) {
        const nodes = querySelectorAll(selector, context);
        (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(nodes, (e) => {
          (0, util_logger__WEBPACK_IMPORTED_MODULE_1__.debug)('removed', e);
          e.remove();
        });
      }
      function block(selector, context = null) {
        if (!context) {
          context = document;
        }
        let fn = null;
        if ((0, util_core__WEBPACK_IMPORTED_MODULE_0__.isString)(selector)) {
          fn = () => {
            remove(selector, context);
          };
        } else if (typeof selector === 'function') {
          fn = (mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (selector(node)) {
                node.parentNode.removeChild(node);
              }
            });
          };
        } else {
          throw new TypeError('wrong selector');
        }
        const o = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            fn(mutation);
          });
        });
        o.observe(context, {
          childList: true,
          subtree: true,
        });
      }
      function searchFromScriptsByRegExp(pattern, context) {
        const scripts = querySelectorAll('script', context);
        const [, , m] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(scripts, (s) => {
          const m = s.textContent.match(pattern);
          if (!m) {
            return util_core__WEBPACK_IMPORTED_MODULE_0__.none;
          }
          return m;
        });
        if (m === util_core__WEBPACK_IMPORTED_MODULE_0__.none) {
          return null;
        }
        return m;
      }
      function searchFromScriptsByString(pattern, context) {
        const scripts = querySelectorAll('script', context);
        const [, m,] = (0, util_core__WEBPACK_IMPORTED_MODULE_0__.find)(scripts, (s) => {
          const m = s.textContent.indexOf(pattern);
          if (m < 0) {
            return util_core__WEBPACK_IMPORTED_MODULE_0__.none;
          }
          return m;
        });
        if (m === util_core__WEBPACK_IMPORTED_MODULE_0__.none) {
          return null;
        }
        return m.textContent;
      }
      function searchFromScripts(pattern, context) {
        if (pattern instanceof RegExp) {
          return searchFromScriptsByRegExp(pattern, context);
        } else if ((0, util_core__WEBPACK_IMPORTED_MODULE_0__.isString)(pattern)) {
          return searchFromScriptsByString(pattern, context);
        } else {
          return null;
        }
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        openImage: () => (openImage)
      });
      var util_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
      var util_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
      var util_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
      var util_misc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
      var util_platform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
      async function openImage(imgSrc, options) {
        options = options || {};
        const replace = !!options.replace;
        const referer = !!options.referer;
        if (replace) {
          await replaceBody(imgSrc);
          return;
        }
        const redirectImage = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getValue('redirect_image');
        if (redirectImage) {
          await (0, util_link__WEBPACK_IMPORTED_MODULE_0__.openLink)(imgSrc, {
            referer: referer,
          });
        }
      }
      function enableScrolling() {
        const o = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        o.style.overflow = '';
      }
      function toggleShrinking() {
        this.classList.toggle('adsbypasser-shrinked');
      }
      function checkScaling() {
        const nw = this.naturalWidth;
        const nh = this.naturalHeight;
        const cw = document.documentElement.clientWidth;
        const ch = document.documentElement.clientHeight;
        if ((nw > cw || nh > ch) && !this.classList.contains('adsbypasser-resizable')) {
          this.classList.add('adsbypasser-resizable');
          this.classList.add('adsbypasser-shrinked');
          this.addEventListener('click', toggleShrinking);
        } else if ((nw <= cw && nh <= ch) && this.classList.contains('adsbypasser-resizable')) {
          this.removeEventListener('click', toggleShrinking);
          this.classList.remove('adsbypasser-shrinked');
          this.classList.remove('adsbypasser-resizable');
        }
      }
      async function scaleImage(i) {
        const siURL = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getResourceUrl('scaleImage');
        appendStyleURL(siURL);
        if (i.naturalWidth && i.naturalHeight) {
          checkScaling.call(i);
        } else {
          i.addEventListener('load', checkScaling);
        }
        let h = 0;
        window.addEventListener('resize', () => {
          window.clearTimeout(h);
          h = window.setTimeout(checkScaling.bind(i), 100);
        });
      }
      async function changeBackground() {
        const bgImage = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getResourceUrl('bgImage');
        document.body.style.backgroundColor = '#222222';
        document.body.style.backgroundImage = `url('${bgImage}')`;
      }
      async function alignCenter() {
        const acURL = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getResourceUrl('alignCenter');
        appendStyleURL(acURL);
      }
      function injectStyle(d, i) {
        (0, util_dom__WEBPACK_IMPORTED_MODULE_1__.remove)('style, link[rel=stylesheet]');
        d.id = 'adsbypasser-wrapper';
        i.id = 'adsbypasser-image';
      }
      function appendStyleURL(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.head.appendChild(link);
      }
      async function replaceBody(imgSrc) {
        const redirectImage = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getValue('redirect_image');
        if (!redirectImage) {
          return;
        }
        if (!imgSrc) {
          (0, util_logger__WEBPACK_IMPORTED_MODULE_2__.warn)('false url');
          return;
        }
        (0, util_logger__WEBPACK_IMPORTED_MODULE_2__.info)(`replacing body with \`${imgSrc}\` ...`);
        (0, util_misc__WEBPACK_IMPORTED_MODULE_3__.removeAllTimer)();
        enableScrolling();
        document.body = document.createElement('body');
        const d = document.createElement('div');
        document.body.appendChild(d);
        const i = document.createElement('img');
        i.src = imgSrc;
        d.appendChild(i);
        const ac = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getValue('align_center');
        const si = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getValue('scale_image');
        if (ac || si) {
          injectStyle(d, i);
        }
        if (ac) {
          await alignCenter();
        }
        const cb = await util_platform__WEBPACK_IMPORTED_MODULE_4__.GMAPI.getValue('change_background');
        if (cb) {
          await changeBackground();
        }
        if (si) {
          await scaleImage(i);
        }
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        openLink: () => (openLink)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      var util_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
      function prepare(e) {
        if (!document.body) {
          document.body = document.createElement('body');
        }
        document.body.appendChild(e);
        return (0, util_core__WEBPACK_IMPORTED_MODULE_0__.wait)(0);
      }
      async function get(url) {
        const a = document.createElement('a');
        a.href = url;
        let clicked = false;
        a.addEventListener('click', (event) => {
          event.stopPropagation();
          clicked = true;
        }, true);
        await prepare(a);
        a.click();
        const tick = setInterval(() => {
          if (clicked) {
            (0, util_logger__WEBPACK_IMPORTED_MODULE_1__.info)('already clicked');
            clearInterval(tick);
            return;
          }
          (0, util_logger__WEBPACK_IMPORTED_MODULE_1__.info)('try again');
          a.click();
        }, 500);
      }
      async function post(path, params) {
        params = params || {};
        const form = document.createElement('form');
        form.method = 'post';
        form.action = path;
        (0, util_core__WEBPACK_IMPORTED_MODULE_0__.forEach)(params, (value, key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        await prepare(form);
        form.submit();
      }
      async function openLink(to, options) {
        if (!(0, util_core__WEBPACK_IMPORTED_MODULE_0__.isString)(to) && !to) {
          (0, util_logger__WEBPACK_IMPORTED_MODULE_1__.warn)('false URL');
          return;
        }
        options = options || {};
        const withReferer = typeof options.referer === 'undefined' ? true : options.referer;
        const postData = options.post;
        const from = window.location.toString();
        (0, util_logger__WEBPACK_IMPORTED_MODULE_1__.info)(`${from} -> ${to}`);
        if (postData) {
          await post(to, postData);
          return;
        }
        if (withReferer) {
          await get(to);
          return;
        }
        window.top.location.replace(to);
      }
    }),
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        evil: () => (evil),
        generateRandomIP: () => (generateRandomIP),
        nuke: () => (nuke),
        removeAllTimer: () => (removeAllTimer)
      });
      var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      var util_platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
      var util_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
      function removeAllTimer() {
        let handle = window.setInterval(util_core__WEBPACK_IMPORTED_MODULE_0__.nop, 10);
        while (handle > 0) {
          window.clearInterval(handle--);
        }
        handle = window.setTimeout(util_core__WEBPACK_IMPORTED_MODULE_0__.nop, 10);
        while (handle > 0) {
          window.clearTimeout(handle--);
        }
      }
      function nuke(url) {
        try {
          util_platform__WEBPACK_IMPORTED_MODULE_1__.usw.document.write('nuked by AdsBypasser, leading to ...<br/>');
        } catch (e) {
          (0, util_logger__WEBPACK_IMPORTED_MODULE_2__.warn)('nuke failed', e);
        }
        const a = document.createElement('a');
        a.href = url;
        a.textContent = url;
        document.body.appendChild(a);
      }
      function generateRandomIP() {
        return [0, 0, 0, 0].map(() => {
          return Math.floor(Math.random() * 256);
        }).join('.');
      }
      function evil(script) {
        return ((
          GM,
          GM_deleteValue,
          GM_getResourceURL,
          GM_getValue,
          GM_openInTab,
          GM_registerMenuCommand,
          GM_setValue,
          GM_xmlhttpRequest,
          unsafeWindow,
          window,
        ) => {
          return eval(script);
        })();
      }
    })
  ]);
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  })();
  (() => {
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();
  var __webpack_exports__ = {};
  __webpack_require__.r(__webpack_exports__);
  var util_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
  var util_dispatcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
  var util_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
  var util_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
  var util_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
  var _ADSBYPASSER_HANDLERS___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
  const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  function disableWindowOpen() {
    try {
      util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.open = function () {
        return {
          closed: false,
        };
      };
    } catch (e) {
      (0, util_logger__WEBPACK_IMPORTED_MODULE_4__.warn)('cannot mock window.open');
    }
    util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.alert = util_core__WEBPACK_IMPORTED_MODULE_0__.nop;
    util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.confirm = util_core__WEBPACK_IMPORTED_MODULE_0__.nop;
  }
  function disableLeavePrompt(element) {
    if (!element) {
      return;
    }
    const seal = {
      set: function () {
        (0, util_logger__WEBPACK_IMPORTED_MODULE_4__.info)('blocked onbeforeunload');
      },
    };
    element.onbeforeunload = undefined;
    if (isSafari) {
      element.__defineSetter__('onbeforeunload', seal.set);
    } else {
      util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.Object.defineProperty(element, 'onbeforeunload', {
        configurable: true,
        enumerable: false,
        get: undefined,
        set: seal.set,
      });
    }
    const oael = element.addEventListener;
    const nael = function (type) {
      if (type === 'beforeunload') {
        (0, util_logger__WEBPACK_IMPORTED_MODULE_4__.info)('blocked addEventListener onbeforeunload');
        return;
      }
      return oael.apply(this, arguments);
    };
    element.addEventListener = nael;
  }
  function changeTitle() {
    document.title += ' - AdsBypasser';
  }
  async function beforeDOMReady(handler) {
    const config = await (0, util_config__WEBPACK_IMPORTED_MODULE_3__.dumpConfig)();
    (0, util_logger__WEBPACK_IMPORTED_MODULE_4__.info)('working on\n%s \nwith\n%s', window.location.toString(), JSON.stringify(config));
    disableLeavePrompt(util_platform__WEBPACK_IMPORTED_MODULE_2__.usw);
    disableWindowOpen();
    await handler.start();
  }
  async function afterDOMReady(handler) {
    disableLeavePrompt(util_platform__WEBPACK_IMPORTED_MODULE_2__.usw.document.body);
    changeTitle();
    await handler.ready();
  }
  function waitDOM() {
    return new Promise((resolve) => {
      if (document.readyState !== 'loading') {
        resolve();
        return;
      }
      document.addEventListener('DOMContentLoaded', () => {
        resolve();
      });
    });
  }
  async function main() {
    if (util_platform__WEBPACK_IMPORTED_MODULE_2__.rawUSW.top !== util_platform__WEBPACK_IMPORTED_MODULE_2__.rawUSW.self) {
      return;
    }
    util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.registerMenuCommand('AdsBypasser - Configure', () => {
      util_platform__WEBPACK_IMPORTED_MODULE_2__.GMAPI.openInTab('https://adsbypasser.github.io/configure.html');
    });
    await (0, util_config__WEBPACK_IMPORTED_MODULE_3__.loadConfig)();
    const handler = (0, util_dispatcher__WEBPACK_IMPORTED_MODULE_1__.findHandler)();
    if (handler) {
      await beforeDOMReady(handler);
      await waitDOM();
      await afterDOMReady(handler);
      return;
    }
  }
  main().catch((e) => {
    (0, util_logger__WEBPACK_IMPORTED_MODULE_4__.warn)(e);
  });
})()
  ;