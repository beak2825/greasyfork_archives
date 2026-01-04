// ==UserScript==
// @name         MonkeyDebugger
// @namespace    https://github.com/JiyuShao/greasyfork-scripts
// @version      2024-07-18
// @description  Debug js using monkey patch
// @author       Jiyu Shao <jiyu.shao@gmail.com>
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @require https://update.greasyfork.org/scripts/496315/1392531/QuickMenu.js
// @downloadURL https://update.greasyfork.org/scripts/496316/MonkeyDebugger.user.js
// @updateURL https://update.greasyfork.org/scripts/496316/MonkeyDebugger.meta.js
// ==/UserScript==

/* eslint-disable no-eval */
(function () {
  'use strict';

  // 定义通用的补丁代码给 new Function 与 eval 使用
  const patchCode = `
    debugger;
  `;

  // 保存原始的 Function 构造器
  const originalFunction = unsafeWindow.Function.prototype.constructor;
  const addFnPatchCode = function (fn) {
    const finalFn = function (...args) {
      if (!args.length) return fn.apply(this, args);
      args[args.length - 1] = `${patchCode}; ${args[args.length - 1]}`;
      return fn.apply(this, args);
    };
    finalFn.prototype = originalFunction.prototype;
    Object.defineProperty(finalFn.prototype, 'constructor', {
      value: finalFn,
      writable: true,
      configurable: true,
    });
    return finalFn;
  };
  const removeFnDebugger = function () {
    const finalFn = function (...args) {
      if (!args.length) return originalFunction.apply(this, args);
      args[args.length - 1] = args[args.length - 1].replace(/debugger/g, '');
      return originalFunction.apply(this, args);
    };
    finalFn.prototype = originalFunction.prototype;
    Object.defineProperty(finalFn.prototype, 'constructor', {
      value: finalFn,
      writable: true,
      configurable: true,
    });
    return finalFn;
  };
  QuickMenu.add({
    name: '开启 Function 调试',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: (value) => {
      if (value === 'on') {
        // 替换全局的 Function constructor
        unsafeWindow.Function = addFnPatchCode();
      } else if (value === 'off') {
        // 替换全局的 Function constructor
        unsafeWindow.Function = removeFnDebugger();
      }
    },
  });

  // 保存原始的 eval 函数
  const originalEval = unsafeWindow.eval;
  const addEvalPatchCode = function () {
    return function (...args) {
      if (!args.length) return originalEval.apply(this, args);
      args[0] = `${patchCode}; ${args[0]}`;
      return originalEval.apply(this, args);
    };
  };
  const removeEvalDebugger = function () {
    return function (...args) {
      if (!args.length) return originalEval.apply(this, args);
      args[0] = args[0].replace(/debugger/g, '');
      return originalEval.apply(this, args);
    };
  };
  QuickMenu.add({
    name: '开启 eval 调试',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: (value) => {
      if (value === 'on') {
        // 替换全局的 eval 函数
        unsafeWindow.eval = addEvalPatchCode();
      } else if (value === 'off') {
        unsafeWindow.eval = removeEvalDebugger();
      }
    },
  });

  const originalDefineProperty = unsafeWindow.Object.defineProperty;
  // 覆盖 `Error` 对象的 `message` 属性的 getter
  const removeErrorMessageGetter = () => {
    return function (obj, prop, descriptor) {
      if (obj instanceof Error && prop === 'message') {
        delete descriptor.get;
        delete descriptor.set;
      }
      return originalDefineProperty.call(Object, obj, prop, descriptor);
    };
  };
  // https://github.com/fz6m/console-ban/tree/master
  QuickMenu.add({
    name: '解除 console-ban 限制',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: (value) => {
      if (value === 'on') {
        unsafeWindow.Object.defineProperty = removeErrorMessageGetter();
      } else if (value === 'off') {
        unsafeWindow.Object.defineProperty = originalDefineProperty;
      }
    },
  });

  const originalFetch = unsafeWindow.fetch;
  QuickMenu.add({
    name: 'Fetch with credentials',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return true;
    },
    callback: (value) => {
      if (value === 'on') {
        unsafeWindow.fetch = function (input, init) {
          init = init || {};
          init.credentials = 'include';
          return originalFetch(input, init);
        };
      } else if (value === 'off') {
        unsafeWindow.fetch = originalFetch;
      }
    },
  });

  QuickMenu.add({
    name: '清空菜单缓存',
    type: 'button',
    shouldInitRun: false,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: () => {
      QuickMenu.clearStore();
    },
  });
})();
