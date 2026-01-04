// ==UserScript==
// @name         eb performance
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  eb performance test
// @author       timluo465
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471660/eb%20performance.user.js
// @updateURL https://update.greasyfork.org/scripts/471660/eb%20performance.meta.js
// ==/UserScript==

const defaultStyle = "font-size:14px";
const focalStyle = "font-weight:700;font-size:16px";

(function () {
  "use strict";
  console.log("开始初始化eb性能分析插件");
  const recordFuns = [];
  const moduleObj = {};

  const createInterval = function (callback) {
    const interval = setInterval(function () {
      const res = callback();

      if (res) {
        clearInterval(interval);
      }
    }, 20);
  };

  createInterval(function () {
    if (window.mobx) {
      initMobx();
    }
    return !!window.mobx;
  });

  createInterval(function () {
    if (window.React) {
      initReact();
    }
    return !!window.React;
  });

  const createPerformanceTimer = function (fn, opts) {
    return function (...args) {
      const { fnName = "" } = opts || {};
      const now = performance.now();
      const res = fn(...args);
      const last = performance.now();
      const time = (last - now).toString();
      const spentTime = time.substring(0, time.indexOf(".") + 3);

      if (spentTime > 5) {
        const consoleFun = spentTime > 50 ? console.error : console.warn;
        recordFuns.push({ func: this, time: spentTime });

        consoleFun(
          `%c${fnName}%c 耗时 %c${spentTime} ms%c， 参数为:%o \n${
            res ? `返回结果：%o` : "无返回结果"
          }`,
          focalStyle,
          defaultStyle,
          focalStyle,
          defaultStyle,
          args,
          res
        );
      }

      return res;
    };
  };

  const call = Function.prototype.call;

  Function.prototype.call = function () {
    const now = performance.now();
    const res = call.apply(this, arguments);
    const last = performance.now();
    const time = (last - now).toString();
    const spentTime = time.substring(0, time.indexOf(".") + 3);

    if (spentTime > 5) {
      const module = getModule();

      if (module) {
        const moduleName = `@weapp/${module}`;
        const consoleFun = spentTime > 50 ? console.error : console.warn;
        recordFuns.push({ func: this, time: spentTime });

        if (module && moduleObj[moduleName]) {
          const { all, serious } = moduleObj[moduleName];

          moduleObj[moduleName] = {
            ...moduleObj[moduleName],
            all: all + 1,
          };

          if(spentTime > 50){
            moduleObj[moduleName].serious = serious + 1;
          }
        } else {
          moduleObj[moduleName] = {
            moduleName: moduleName,
            all: 1,
            serious: 1,
          };
        }
        consoleFun(
          `%c未知方法执行耗时 %c${spentTime} ms%c，来源模块：%c@weapp/${module}%c \n点击定位方法：%o \n${
            res ? `返回结果：%o` : "无返回结果"
          }`,
          defaultStyle,
          focalStyle,
          defaultStyle,
          focalStyle,
          defaultStyle,
          this,
          res
        );
      }
    }
    return res;
  };

  function getModule(isMobx) {
    //创建一个Error来获取Error所在的位置及其堆栈跟踪
    const e = new Error();
    const regex = /\((.*):(\d+):(\d+)\)$/;

    if (!isMobx) {
      const stak = e.stack.split("\n");
      const match = regex.exec(stak[stak?.length - 1]);
      const module = match?.[1].match(/(?<=build\/).*?(?=\/static)/)?.[0] || "";

      return module;
    }
  }

  function initMobx() {
    const mobx = window.mobx;

    ["toJS", "computed", "runInAction"].forEach(function (act) {
      const originalFn = mobx[act];

      mobx[act] = createPerformanceTimer(originalFn, {
        fnName: `mobx.${act}`,
      });

      Object.keys(originalFn).forEach(function (key) {
        mobx[act][key] = originalFn[key];
      });
    });

    Object.keys(mobx.observable).forEach(function (action) {
      const originalFn = mobx.observable[action];

      mobx.observable[action] = createPerformanceTimer(originalFn, {
        fnName: `mobx.observable.${action}`,
      });
    });

    console.log("Mobx性能分析插件初始化完成！");
  }

  function initReact() {
    const React = window.React;

    [
      "useEffect",
      "useCallback",
      "useState",
      "useMemo",
      "useRef",
      "memo",
    ].forEach(function (hook) {
      const originalHook = React[hook];

      React[hook] = createPerformanceTimer(originalHook, {
        fnName: `React.${hook}`,
      });
    });

    console.log("React Hooks性能分析插件初始化完成！");
  }

  function print() {
    const printObj = [];
    const moduleArrays = [];
    Object.keys(moduleObj).forEach(function (key) {
      moduleArrays.push(moduleObj[key]);
    });
    const sortModuleArrays = moduleArrays.sort((a, b) => {
      return b.all - a.all;
    });

    sortModuleArrays.forEach((array) => {
      printObj.push({
        前端模块: array.moduleName,
        "问题数（所有）": array.all,
        "问题数（耗时大于50ms）": array.serious,
      });
    });

    console.table(printObj);
  }

  function getRecords() {
    const funs = [];
    const beyondThresholdFuns = [];
    const threshold = 50;
    let times = 0;

    recordFuns.forEach((recordFun) => {
      funs.push(recordFun);

      if (recordFun.time > threshold) {
        beyondThresholdFuns.push(recordFun);
        times++;
      }
    });

    console.log(
      `截至当前已发现性能问题点共计${recordFuns.length}个，大于${threshold}ms的问题共计${times}个 \n所有记录：%o\n大于${threshold}ms的记录：%o`,
      funs,
      beyondThresholdFuns
    );

    return;
  }
  window.performanceTools = { print, getRecords };
})();
