// ==UserScript==
// @name         还我票票拳
// @namespace    https://www.bilibili.com
// @version      1.0.0
// @description  恢复bilibili2025动画角色人气大赏表演赛实时票数显示
// @author       MotooriKashin
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/blackboard/era/jQ8lQ7PHbp32izw3.html
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542169/%E8%BF%98%E6%88%91%E7%A5%A8%E7%A5%A8%E6%8B%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/542169/%E8%BF%98%E6%88%91%E7%A5%A8%E7%A5%A8%E6%8B%B3.meta.js
// ==/UserScript==

const MODULES = `
"use strict";
(() => {
  // src/utils/hook/Proxy.ts
  var ProxyHook;
  ((ProxyHook2) => {
    function onChange(target, callback) {
      return new Proxy(target, {
        deleteProperty: (target2, p) => {
          const oldVlue = Reflect.get(target2, p);
          queueMicrotask(() => callback(target2, p, oldVlue));
          return Reflect.deleteProperty(target2, p);
        },
        set: (target2, p, newValue, receiver) => {
          const oldVlue = Reflect.get(target2, p);
          queueMicrotask(() => callback(target2, p, oldVlue, newValue));
          return Reflect.set(target2, p, newValue, receiver);
        },
        get: (target2, p, receiver) => {
          const res = Reflect.get(target2, p, receiver);
          if (typeof res === "object" && String(res) === "[object Object]") {
            return onChange(res, callback);
          } else if (Array.isArray(res)) {
            return onChange(res, callback);
          }
          return res;
        }
      });
    }
    ProxyHook2.onChange = onChange;
    function property(target, propertyKey, propertyValue, configurable = true) {
      try {
        Reflect.defineProperty(target, propertyKey, {
          configurable,
          set: (v) => true,
          get: () => {
            Reflect.defineProperty(target, propertyKey, { configurable: true, value: propertyValue });
            return propertyValue;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    ProxyHook2.property = property;
    function modify(target, propertyKey, callback, once = false) {
      try {
        let value = target[propertyKey];
        value && (value = callback(value));
        Reflect.defineProperty(target, propertyKey, {
          configurable: true,
          set: (v) => {
            value = callback(v);
            return true;
          },
          get: () => {
            if (once) {
              Reflect.deleteProperty(target, propertyKey);
              Reflect.set(target, propertyKey, value);
            }
            return value;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    ProxyHook2.modify = modify;
  })(ProxyHook || (ProxyHook = {}));

  // src/main/era/index.ts
  var Era = class {
    constructor() {
      this.init();
    }
    init() {
      ProxyHook.modify(globalThis, "__initialState", (d) => {
        if (d && typeof d === "object" && "Moe2025MatchPc" in d) {
          d.Moe2025MatchPc.forEach((d2) => {
            delete d2.enableSearch;
            delete d2.showPagination;
            d2.showVotes = true;
          });
        }
        return d;
      });
      ProxyHook.modify(globalThis, "__BILIACT_EVAPAGEDATA__", (d) => {
        return JSON.parse(JSON.stringify(d), (key, value) => {
          switch (key) {
            case "props": {
              if ("activityCode" in value && value.activityCode === "menggamecode") {
                delete value.enableSearch;
                delete value.showPagination;
                value.showVotes = true;
              }
              return value;
            }
            default: {
              return value;
            }
          }
        });
      });
    }
  };

  // src/main/era/userscript.ts
  /^\\/blackboard\\/era/.test(location.pathname) && new Era();
})();

//@ sourceURL=bilibili-moe2025-vote.js`;

new Function("GM", MODULES)(GM);
