// ==UserScript==
// @name               AdBlock Script for WebView
// @name:zh-CN         套壳油猴的广告拦截脚本
// @author             Lemon399
// @version            2.8.7
// @description        Parse ABP Cosmetic rules to CSS and apply it.
// @description:zh-CN  将 ABP 中的元素隐藏规则转换为 CSS 使用
// @resource           jiekouAD https://fastly.jsdelivr.net/gh/damengzhu/banad@main/jiekouAD.txt
// @resource           CSSRule https://fastly.jsdelivr.net/gh/damengzhu/abpmerge@main/CSSRule.txt
// @match              http://*/*
// @match              https://*/*
// @run-at             document-start
// @grant              unsafeWindow
// @grant              GM_registerMenuCommand
// @grant              GM.registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM.unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM.getValue
// @grant              GM_deleteValue
// @grant              GM.deleteValue
// @grant              GM_setValue
// @grant              GM.setValue
// @grant              GM_addStyle
// @grant              GM.addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM.xmlHttpRequest
// @grant              GM_getResourceText
// @grant              GM.getResourceText
// @grant              GM_download
// @grant              GM.download
// @grant              GM_listValues
// @grant              GM.listValues
// @namespace          https://lemon399-bitbucket-io.vercel.app/
// @source             https://gitee.com/lemon399/tampermonkey-cli/tree/master/projects/abp_parse
// @source             https://bitbucket.org/lemon399/tampermonkey-cli/src/master/projects/abp_parse/
// @connect            fastly.jsdelivr.net
// @copyright          GPL-3.0
// @license            GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/452314/AdBlock%20Script%20for%20WebView.user.js
// @updateURL https://update.greasyfork.org/scripts/452314/AdBlock%20Script%20for%20WebView.meta.js
// ==/UserScript==
/* 以下部分是脚本猫的脚本配置，使用其他脚本管理器请忽略 */

/* ==UserConfig==
配置:
  rules:
    title: 自定义规则
    description: 添加自定义的 ABP 隐藏规则
    type: textarea
    rows: 10
    default: |-
      ! 不支持的规则和开头为 ! 的行会忽略
      !
      ! 由于语法限制，此处规则中
      ! 一个反斜杠需要改成两个，像这样 \\
  css:
    title: 隐藏 CSS
    description: 隐藏广告使用的 CSS
    type: textarea
    rows: 7
    default: |-
      {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
  timeout:
    title: 规则下载超时
    description: 更新规则时，规则下载超时时间
    type: number
    default: 10000
    min: 0
    unit: 毫秒
  headTimeout:
    title: 获取规则信息超时
    description: 更新规则时，获取规则信息 (HEAD 请求) 超时时间
    type: number
    default: 2000
    min: 0
    unit: 毫秒
  tryCount:
    title: CSS 注入尝试次数
    description: 某些框架会重建页面，需要多次注入，只有检测到 CSS 不存在时才会尝试再次注入
    type: number
    default: 5
    min: 0
    unit: 次
  tryTimeout:
    title: CSS 注入尝试间隔
    description: 两次注入尝试的间隔时间
    type: number
    default: 500
    min: 100
    unit: 毫秒
  autoCleanSize:
    title: 自动清空预存
    description: 预存超过此大小自动清空，0 关闭
    type: number
    default: 0
    min: 0
    unit: 字节

==/UserConfig== */

/* 脚本猫 脚本配置 结束 */
/* eslint-disable no-redeclare, no-unused-vars, require-yield, no-prototype-builtins */
/* global GM_info, GM, unsafeWindow, GM_registerMenuCommand, GM_unregisterMenuCommand, GM_getValue, GM_deleteValue, GM_setValue, GM_addStyle, GM_xmlhttpRequest, GM_getResourceText, GM_download, GM_listValues */

(function () {
  "use strict";

  const $presets = {
    userConfig: {
      rules: `
! 不支持的规则和开头为 ! 的行会忽略
!
! 由于语法限制，此处规则中
! 一个反斜杠需要改成两个，像这样 \\

`,
      css: `{
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }`,
      timeout: 10000,
      headTimeout: 2000,
      tryCount: 5,
      tryTimeout: 500,
      autoCleanSize: 0,
    },
    onlineRules: [
      {
        标识: `jiekouAD`,
        地址: `https://fastly.jsdelivr.net/gh/damengzhu/banad@main/jiekouAD.txt`,
        在线更新: true,
        筛选后存储: true,
      },
      {
        标识: `CSSRule`,
        地址: `https://fastly.jsdelivr.net/gh/damengzhu/abpmerge@main/CSSRule.txt`,
        在线更新: true,
        筛选后存储: false,
      },
    ],
  };
  let $listeners = [],
    $hasStorEvListener = false;
  const $polyfills = {
    GM_info:
      typeof GM_info == "object"
        ? GM_info
        : {
            script: {
              author: "Lemon399",
              copyright: "GPL-3.0",
              description: "Parse ABP Cosmetic rules to CSS and apply it.",
              excludes: [],
              excludeMatches: [],
              grant: [
                "unsafeWindow",
                "GM_registerMenuCommand",
                "GM.registerMenuCommand",
                "GM_unregisterMenuCommand",
                "GM.unregisterMenuCommand",
                "GM_getValue",
                "GM.getValue",
                "GM_deleteValue",
                "GM.deleteValue",
                "GM_setValue",
                "GM.setValue",
                "GM_addStyle",
                "GM.addStyle",
                "GM_xmlhttpRequest",
                "GM.xmlHttpRequest",
                "GM_getResourceText",
                "GM.getResourceText",
                "GM_download",
                "GM.download",
                "GM_listValues",
                "GM.listValues",
              ],
              includes: [],
              matches: ["http://*/*", "https://*/*"],
              name: "AdBlock Script for WebView",
              namespace: "https://lemon399-bitbucket-io.vercel.app/",
              noframes: false,
              "run-at": "document-start",
              resources: [
                {
                  name: "jiekouAD",
                  url: "https://fastly.jsdelivr.net/gh/damengzhu/banad@main/jiekouAD.txt",
                },
                {
                  name: "CSSRule",
                  url: "https://fastly.jsdelivr.net/gh/damengzhu/abpmerge@main/CSSRule.txt",
                },
              ],
              unwrap: false,
              version: "2.8.7",
            },
            scriptWillUpdate: false,
          },
    parseValue: function parseValue(stored) {
      var _a;
      let value = void 0;
      const valid =
        typeof stored == "string" &&
        stored.startsWith("[") &&
        stored.endsWith("]");
      try {
        value = valid
          ? (_a = JSON.parse(stored)[0]) !== null && _a !== void 0
            ? _a
            : void 0
          : void 0;
      } catch (_b) {
        value = void 0;
      }
      switch (value) {
        case "__$NaN": {
          value = Number.NaN;
          break;
        }
        case "__$UdF": {
          value = void 0;
          break;
        }
        case "__$FnT": {
          value = Infinity;
          break;
        }
        case "__$XnT": {
          value = -Infinity;
          break;
        }
      }
      return value;
    },
    unsafeWindow: typeof unsafeWindow == "object" ? unsafeWindow : window,
    GM_registerMenuCommand:
      typeof GM_registerMenuCommand == "function"
        ? GM_registerMenuCommand
        : void 0,
    GM_unregisterMenuCommand:
      typeof GM_unregisterMenuCommand == "function"
        ? GM_unregisterMenuCommand
        : void 0,
    GM_getValue:
      typeof GM_getValue == "function"
        ? GM_getValue
        : function DM_getValue(key, defaultValue) {
            const stor = globalThis.localStorage.getItem(
              "$DMValue$AdBlock Script for WebView$" + key,
            );
            return typeof stor == "string" &&
              stor.startsWith("[") &&
              stor.endsWith("]")
              ? $polyfills.parseValue(stor)
              : defaultValue;
          },
    GM_deleteValue:
      typeof GM_deleteValue == "function"
        ? GM_deleteValue
        : function DM_deleteValue(key) {
            for (const [id, listenerArray] of $listeners.entries()) {
              if (listenerArray[0] === key) {
                const oldValue = $polyfills.GM_getValue(key);
                listenerArray[1].call(
                  {
                    id,
                    key,
                    cb: listenerArray[1],
                  },
                  key,
                  oldValue,
                  undefined,
                  false,
                );
              }
            }
            globalThis.localStorage.removeItem(
              "$DMValue$AdBlock Script for WebView$" + key,
            );
          },
    GM_setValue:
      typeof GM_setValue == "function"
        ? GM_setValue
        : function DM_setValue(key, value) {
            const wrap = [];
            switch (typeof value) {
              case "function":
              case "bigint": {
                wrap[0] = value.toString();
                break;
              }
              case "undefined": {
                wrap[0] = "__$UdF";
                break;
              }
              case "number": {
                if (Number.isNaN(value)) {
                  wrap[0] = "__$NaN";
                } else if (Number.isFinite(value)) {
                  wrap[0] = value > 0 ? "__$FnT" : "__$XnT";
                } else {
                  wrap[0] = value;
                }
                break;
              }
              default: {
                wrap[0] = value;
              }
            }
            const packed = JSON.stringify(wrap);
            for (const [id, listenerArray] of $listeners.entries()) {
              if (listenerArray[0] === key) {
                const oldValue = $polyfills.GM_getValue(key);
                listenerArray[1].call(
                  {
                    id,
                    key,
                    cb: listenerArray[1],
                  },
                  key,
                  oldValue,
                  value,
                  false,
                );
              }
            }
            globalThis.localStorage.setItem(
              "$DMValue$AdBlock Script for WebView$" + key,
              packed,
            );
          },
    GM_addStyle:
      typeof GM_addStyle == "function"
        ? GM_addStyle
        : function DM_addStyle(css) {
            const styleElement = document.createElement("style");
            styleElement.textContent = css;
            function addStyle() {
              const parent = document.head;
              parent.append(styleElement);
            }
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", addStyle);
            } else {
              addStyle();
            }
            return styleElement;
          },
    GM_xmlhttpRequest:
      typeof GM_xmlhttpRequest == "function" ? GM_xmlhttpRequest : void 0,
    GM_getResourceText:
      typeof GM_getResourceText == "function" ? GM_getResourceText : void 0,
    GM_download:
      // 以下浏览器的 GM_download 不支持 blob: 需要使用 Polyfill
      typeof GM_download == "function" &&
      // X 浏览器
      !GM_download.toString().includes("mbrowser.GM_download") &&
      // Via 浏览器
      !GM_download.toString().includes("via_gm.download") &&
      // MDM 浏览器
      !(
        typeof window.moe == "object" &&
        typeof window.moe.download == "function"
      ) &&
      // 海阔世界 / 嗅觉
      !GM_download.toString().includes("window.open") &&
      // Rains 浏览器
      !Array.isArray(GM_download.toString().match(/load\(\) {};$/))
        ? GM_download
        : function DM_download(objectOrURL, filename) {
            const linkElement = document.createElement("a");
            if (typeof objectOrURL == "object") {
              linkElement.href = objectOrURL.url;
              linkElement.download = objectOrURL.name;
              if (objectOrURL.onload) {
                linkElement.addEventListener("click", objectOrURL.onload);
              }
            } else {
              linkElement.href = objectOrURL;
              linkElement.download =
                filename !== null && filename !== void 0 ? filename : "";
            }
            linkElement.style.cssText = "position:absolute;top:-100%";
            document.body.append(linkElement);
            setTimeout(() => {
              linkElement.click();
              linkElement.remove();
            }, 0);
            return {
              abort: () => void 0,
            };
          },
    GM_listValues:
      typeof GM_listValues == "function"
        ? GM_listValues
        : function DM_listValues() {
            const keysArray = [];
            for (
              let index = 0;
              index < globalThis.localStorage.length;
              index++
            ) {
              const key = globalThis.localStorage.key(index);
              if (
                key === null || key === void 0
                  ? void 0
                  : key.startsWith("$DMValue$AdBlock Script for WebView$")
              ) {
                keysArray.push(
                  key.replace("$DMValue$AdBlock Script for WebView$", ""),
                );
              }
            }
            return keysArray;
          },
    GM:
      typeof GM == "object"
        ? GM
        : {
            getValue: function DM_getValue4(...args) {
              return Promise.resolve($polyfills.GM_getValue(...args));
            },
            deleteValue: function DM_deleteValue4(...args) {
              return Promise.resolve($polyfills.GM_deleteValue(...args));
            },
            setValue: function DM_setValue4(...args) {
              return Promise.resolve($polyfills.GM_setValue(...args));
            },
            addStyle: function DM_addStyle4(...args) {
              return Promise.resolve($polyfills.GM_addStyle(...args));
            },
            download: function DM_download4(...args) {
              return Promise.resolve($polyfills.GM_download(...args));
            },
            listValues: function DM_listValues4(...args) {
              return Promise.resolve($polyfills.GM_listValues(...args));
            },
          },
  };
  (function (preset, tm) {
    "use strict";

    /******************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P
          ? value
          : new P(function (resolve) {
              resolve(value);
            });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    typeof SuppressedError === "function"
      ? SuppressedError
      : function (error, suppressed, message) {
          var e = new Error(message);
          return (
            (e.name = "SuppressedError"),
            (e.error = error),
            (e.suppressed = suppressed),
            e
          );
        };
    const data = {
      isFrame: tm.unsafeWindow.self !== tm.unsafeWindow.top,
      isClean: false,
      disabled: false,
      saved: false,
      update: true,
      updating: false,
      alertLog: false,
      receivedRules: "",
      customRules: preset.userConfig.rules,
      allRules: "",
      genHideCss: "",
      genExtraCss: "",
      spcHideCss: "",
      spcExtraCss: "",
      bRules: [],
      appliedLevel: 0,
      appliedCount: 0,
      mutex: "__lemon__abp__parser__$__",
      preset: preset.userConfig.css,
      timeout: preset.userConfig.timeout,
      headTimeout: preset.userConfig.headTimeout,
      tryCount: preset.userConfig.tryCount,
      tryTimeout: preset.userConfig.tryTimeout,
      autoCleanSize: preset.userConfig.autoCleanSize,
    };
    const defaultValues = {
      get black() {
        return "";
      },
      get rules() {
        return {};
      },
      get css() {
        return {
          needUpdate: true,
          genHideCss: "",
          genExtraCss: "",
          spcHideCss: "",
          spcExtraCss: "",
        };
      },
      get time() {
        return "0/0/0 0:0:0";
      },
      get etags() {
        return {};
      },
      get brules() {
        return [];
      },
      get hash() {
        return "";
      },
    };
    const values = {
        black(value) {
          return __awaiter(this, void 0, void 0, function* () {
            if (value === void 0) {
              const arrayString = yield gmValue(
                "get",
                false,
                "ajs_disabled_domains",
                defaultValues.black,
              );
              return typeof arrayString == "string" && arrayString.length > 0
                ? arrayString.split(",")
                : [];
            } else {
              yield gmValue(
                "set",
                false,
                "ajs_disabled_domains",
                value === null ? null : value.join(","),
              );
              return void 0;
            }
          });
        },
        rules(value) {
          return __awaiter(this, void 0, void 0, function* () {
            return value === void 0
              ? yield gmValue(
                  "get",
                  true,
                  "ajs_saved_abprules",
                  defaultValues.rules,
                )
              : yield gmValue("set", true, "ajs_saved_abprules", value);
          });
        },
        css(value_1) {
          return __awaiter(
            this,
            arguments,
            void 0,
            function* (value, host = location.hostname) {
              return value === void 0
                ? yield gmValue(
                    "get",
                    true,
                    `ajs_saved_styles_${host}`,
                    defaultValues.css,
                  )
                : yield gmValue("set", true, `ajs_saved_styles_${host}`, value);
            },
          );
        },
        time(value) {
          return __awaiter(this, void 0, void 0, function* () {
            return value === void 0
              ? yield gmValue("get", false, "ajs_rules_ver", defaultValues.time)
              : yield gmValue("set", false, "ajs_rules_ver", value);
          });
        },
        etags(value) {
          return __awaiter(this, void 0, void 0, function* () {
            return value === void 0
              ? yield gmValue(
                  "get",
                  true,
                  "ajs_rules_etags",
                  defaultValues.etags,
                )
              : yield gmValue("set", true, "ajs_rules_etags", value);
          });
        },
        brules(value) {
          return __awaiter(this, void 0, void 0, function* () {
            return value === void 0
              ? yield gmValue(
                  "get",
                  true,
                  "ajs_modifier_rules",
                  defaultValues.brules,
                )
              : yield gmValue("set", true, "ajs_modifier_rules", value);
          });
        },
        hash(value) {
          return __awaiter(this, void 0, void 0, function* () {
            return value === void 0
              ? yield gmValue(
                  "get",
                  false,
                  "ajs_custom_hash",
                  defaultValues.hash,
                )
              : yield gmValue("set", false, "ajs_custom_hash", value);
          });
        },
      },
      menus = {
        /** 禁用拦截菜单 */
        disable: {
          id: void 0,
          text() {
            return Promise.resolve(
              `在此域名${data.disabled ? "启用" : "禁用"}拦截`,
            );
          },
        },
        /** 更新规则菜单 */
        update: {
          id: void 0,
          text() {
            return __awaiter(this, void 0, void 0, function* () {
              var _a;
              const time =
                (_a = yield values.time()) !== null && _a !== void 0 ? _a : "0";
              return data.updating
                ? "正在更新..."
                : `点击更新 ${time.startsWith("0") ? "未知时间" : time}`;
            });
          },
        },
        /** 清空规则菜单 */
        count: {
          id: void 0,
          text() {
            return __awaiter(this, void 0, void 0, function* () {
              var _a;
              const abpRules =
                (_a = yield values.rules()) !== null && _a !== void 0
                  ? _a
                  : defaultValues.rules;
              let ruleCount = 0;
              for (const rules of Object.values(abpRules)) {
                ruleCount += rules.split("\n").length;
              }
              const cssCounts = yield getCssLength();
              return data.isClean
                ? `已清空，点击${data.disabled ? "刷新网页" : "重新加载规则"}`
                : `点击清空，规则 ${String(ruleCount)} 预存 ${cssCounts.join(",")}`;
            });
          },
        },
        /** 导出报告菜单 */
        export: {
          id: void 0,
          text() {
            let cssCount = "";
            if (!data.disabled) {
              if ((data.appliedLevel & 1) == 0) {
                cssCount += data.genHideCss + data.genExtraCss;
              }
              if ((data.appliedLevel & 2) == 0) {
                cssCount += data.spcHideCss + data.spcExtraCss;
              }
            }
            return Promise.resolve(
              `下载统计报告 ${data.saved ? `CSS ${String(cssCount.split("*/").length - 1)}` : `规则 ${String(data.appliedCount)} / ${String(data.allRules.split("\n").length)}`}`,
            );
          },
        },
      };
    /**
     * 选择合适的 油猴/模拟 接口
     * @param {(Function | undefined)} gm1 GM_xxx
     * @param {(Function | undefined)} gm4 GM.xxx
     * @returns {(Function | undefined)} 合适的接口 或者 undefined
     */
    function gmChooser(gm1, gm4) {
      var _a;
      const gm1dm =
        gm1 === null || gm1 === void 0 ? void 0 : gm1.name.startsWith("DM_");
      const gm4dm =
        gm4 === null || gm4 === void 0 ? void 0 : gm4.name.startsWith("DM_");
      if (gm1 && gm4) {
        if (gm1dm === gm4dm) {
          return gm1;
        } else {
          return gm1dm ? gm4 : gm1;
        }
      } else {
        return (_a = gm1 !== null && gm1 !== void 0 ? gm1 : gm4) !== null &&
          _a !== void 0
          ? _a
          : void 0;
      }
    }
    /**
     * 添加/删除/替换 油猴脚本菜单项
     * @async
     * @param {string} name 菜单项的 key
     * @param {Function} cb 点击菜单项回调，不指定即删除菜单项
     * @returns {Promise.<void>}
     */
    function gmMenu(name, callback) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const id =
          (_a = menus[name].id) !== null && _a !== void 0 ? _a : void 0;
        const gmr = gmChooser(
          tm.GM_registerMenuCommand,
          tm.GM.registerMenuCommand,
        );
        const gmu = gmChooser(
          tm.GM_unregisterMenuCommand,
          tm.GM.unregisterMenuCommand,
        );
        if (typeof gmr != "function" || data.isFrame) return;
        if (id !== void 0 && typeof gmu == "function") {
          menus[name].id = void 0;
          yield gmu(id);
        }
        if (typeof callback == "function") {
          menus[name].id = yield gmr(yield menus[name].text(), callback);
        }
        return;
      });
    }
    function gmValue(action, json, key, value) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        switch (action) {
          case "get": {
            try {
              let v =
                (_a = gmChooser(tm.GM_getValue, tm.GM.getValue)) === null ||
                _a === void 0
                  ? void 0
                  : _a(key, json ? JSON.stringify(value) : value);
              v = v instanceof Promise ? yield v : v;
              return json && typeof v == "string" ? JSON.parse(v) : v;
            } catch (error) {
              return value;
            }
          }
          case "set": {
            try {
              return value === null || value === void 0
                ? void ((_b = gmChooser(
                    tm.GM_deleteValue,
                    tm.GM.deleteValue,
                  )) === null || _b === void 0
                    ? void 0
                    : _b(key))
                : void ((_c = gmChooser(tm.GM_setValue, tm.GM.setValue)) ===
                    null || _c === void 0
                    ? void 0
                    : _c(key, json ? JSON.stringify(value) : value));
            } catch (error) {
              return void ((_d = gmChooser(
                tm.GM_deleteValue,
                tm.GM.deleteValue,
              )) === null || _d === void 0
                ? void 0
                : _d(key));
            }
          }
        }
      });
    }
    /**
     * 获取脚本猫用户配置，非脚本猫返回默认值
     * @async
     * @param {string} prop 用户配置项 key
     * @returns {Promise.<*>} 用户配置项的值
     */
    function getUserConfig(property) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return (_a = yield gmValue("get", false, `配置.${property}`)) !==
          null && _a !== void 0
          ? _a
          : preset.userConfig[property];
      });
    }
    /**
     * 可靠的向页面注入 CSS，失败自动重试
     * @async
     * @param {string} css 需要注入的 CSS
     * @param {number} [pass=0] 当前重试次数，留空
     * @returns {Promise.<void>} 返回空的 Promise
     */
    function addStyle(css_1) {
      return __awaiter(this, arguments, void 0, function* (css, pass = 0) {
        var _a;
        if (pass >= data.tryCount) return;
        const element = yield (_a = gmChooser(
          tm.GM_addStyle,
          tm.GM.addStyle,
        )) === null || _a === void 0
          ? void 0
          : _a(css);
        if (
          typeof element == "object" &&
          !document.documentElement.contains(element)
        ) {
          globalThis.setTimeout(() => {
            void addStyle(css, pass + 1);
          }, data.tryTimeout);
        }
        return;
      });
    }
    /**
     * 异步 GM_xmlhttpRequest 封装
     * @async
     * @param details GM_xmlhttpRequest 的 details
     * @returns 返回 Promise
     *
     * 成功 resolve GM_xmlhttpRequest onload Response
     *
     * 失败 reject 如下对象
     * ```ts
     * type XhrError = {
     *   error: "noxhr" | "abort" | "error" | "timeout" | "Via timeout";
     *   resp?: Response;
     * }
     * ```
     */
    function promiseXhr(details) {
      return __awaiter(this, void 0, void 0, function* () {
        const timeout =
          details.method === "HEAD" ? data.headTimeout : data.timeout;
        let loaded = false;
        const gmXhr = gmChooser(tm.GM_xmlhttpRequest, tm.GM.xmlHttpRequest);
        if (typeof gmXhr != "function") {
          throw {
            error: "noxhr",
          };
        }
        return yield new Promise((resolve, reject) => {
          gmXhr(
            Object.assign(
              {
                onload(event_) {
                  loaded = true;
                  resolve(event_);
                },
                onabort(event_) {
                  loaded = true;
                  reject({
                    error: "abort",
                    resp: event_,
                  });
                },
                onerror(event_) {
                  loaded = true;
                  reject({
                    error: "error",
                    resp: event_,
                  });
                },
                ontimeout(event_) {
                  loaded = true;
                  reject({
                    error: "timeout",
                    resp: event_,
                  });
                },
                onreadystatechange(event_) {
                  // Via 浏览器超时中断，不给成功状态...
                  if (event_.readyState === 3) {
                    setTimeout(() => {
                      if (!loaded) {
                        reject({
                          error: "Via timeout",
                          resp: event_,
                        });
                      }
                    }, timeout);
                  }
                },
                timeout,
              },
              details,
            ),
          );
        });
      });
    }
    /**
     * GM_getResourceText 代理
     * @async
     * @param {string} key `@resource` 的 key
     * @returns {(?string | undefined)} GM_getResourceText 的返回，不支持的返回 undefined
     */
    function getRuleFromResource(key) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          return yield (_a = gmChooser(
            tm.GM_getResourceText,
            tm.GM.getResourceText,
          )) === null || _a === void 0
            ? void 0
            : _a(key);
        } catch (error) {
          return null;
        }
      });
    }
    /**
     * 保证只运行一次
     * @async
     * @param {string} key 互斥字符串
     * @param {Function} func 运行函数
     * @returns {Promise.<*>} Promise，重复运行或失败 reject
     */
    function runOnce(key, function_) {
      return __awaiter(this, void 0, void 0, function* () {
        if (key in tm.unsafeWindow) {
          return yield Promise.reject(new Error(key));
        }
        tm.unsafeWindow[key] = true;
        const result = yield function_();
        return result;
      });
    }
    /**
     * GM_download 代理
     * @param {string} url 下载 url
     * @param {string} name 文件名
     */
    function downUrl(url, name) {
      tm.GM_download({
        url,
        name,
      });
    }
    /**
     * 检查域名是否有预存，不指定域名则返回有预存的域名数组
     * @async
     * @param {?string} host 域名
     * @returns {Promise.<(boolean | string[])>} 域名是否有预存 / 有预存的域名数组
     */
    function getSavedHosts(host) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const keys =
          (_b = yield (_a = gmChooser(tm.GM_listValues, tm.GM.listValues)) ===
            null || _a === void 0
            ? void 0
            : _a()) !== null && _b !== void 0
            ? _b
            : [];
        const domains = (
          Array.isArray(keys)
            ? keys
            : // Rains
              Object.keys(keys)
        )
          .filter((key) => key.startsWith("ajs_saved_styles_"))
          .map((key) => key.replace("ajs_saved_styles_", ""));
        return host ? domains.includes(host) : domains;
      });
    }
    /**
     * 获取篡改猴脚本注释
     * @returns {string} 脚本注释，不支持返回空字符串
     */
    function getComment() {
      var _a, _b;
      return (_b =
        (_a = tm.GM_info.script.options) === null || _a === void 0
          ? void 0
          : _a.comment) !== null && _b !== void 0
        ? _b
        : "";
    }
    /**
     * 获取预存域名数量和预存总大小
     * @async
     * @returns {Promise.<number[]>} [预存域名数量, 预存总大小]
     */
    function getCssLength() {
      return __awaiter(this, void 0, void 0, function* () {
        const savedHosts = yield getSavedHosts();
        let savedChars = 0;
        for (const savedHost of savedHosts) {
          const co = yield values.css(void 0, savedHost);
          savedChars += JSON.stringify(co).length;
        }
        return [savedHosts.length, savedChars];
      });
    }

    /**
     * @adguard/extended-css - v2.1.1 - Thu Dec 19 2024
     * https://github.com/AdguardTeam/ExtendedCss#homepage
     * Copyright (c) 2024 AdGuard. Licensed GPL-3.0
     */
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    /**
     * Possible ast node types.
     *
     * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
     * during ExtendedCss import into other libraries.
     */
    const NODE = {
      SELECTOR_LIST: "SelectorList",
      SELECTOR: "Selector",
      REGULAR_SELECTOR: "RegularSelector",
      EXTENDED_SELECTOR: "ExtendedSelector",
      ABSOLUTE_PSEUDO_CLASS: "AbsolutePseudoClass",
      RELATIVE_PSEUDO_CLASS: "RelativePseudoClass",
    };
    /**
     * Class needed for creating ast nodes while selector parsing.
     * Used for SelectorList, Selector, ExtendedSelector.
     */
    class AnySelectorNode {
      /**
       * Creates new ast node.
       *
       * @param type Ast node type.
       */
      constructor(type) {
        _defineProperty(this, "children", []);
        this.type = type;
      }
      /**
       * Adds child node to children array.
       *
       * @param child Ast node.
       */
      addChild(child) {
        this.children.push(child);
      }
    }
    /**
     * Class needed for creating RegularSelector ast node while selector parsing.
     */
    class RegularSelectorNode extends AnySelectorNode {
      /**
       * Creates RegularSelector ast node.
       *
       * @param value Value of RegularSelector node.
       */
      constructor(value) {
        super(NODE.REGULAR_SELECTOR);
        this.value = value;
      }
    }
    /**
     * Class needed for creating RelativePseudoClass ast node while selector parsing.
     */
    class RelativePseudoClassNode extends AnySelectorNode {
      /**
       * Creates RegularSelector ast node.
       *
       * @param name Name of RelativePseudoClass node.
       */
      constructor(name) {
        super(NODE.RELATIVE_PSEUDO_CLASS);
        this.name = name;
      }
    }
    /**
     * Class needed for creating AbsolutePseudoClass ast node while selector parsing.
     */
    class AbsolutePseudoClassNode extends AnySelectorNode {
      /**
       * Creates AbsolutePseudoClass ast node.
       *
       * @param name Name of AbsolutePseudoClass node.
       */
      constructor(name) {
        super(NODE.ABSOLUTE_PSEUDO_CLASS);
        _defineProperty(this, "value", "");
        this.name = name;
      }
    }
    const LEFT_SQUARE_BRACKET = "[";
    const RIGHT_SQUARE_BRACKET = "]";
    const LEFT_PARENTHESIS = "(";
    const RIGHT_PARENTHESIS = ")";
    const LEFT_CURLY_BRACKET = "{";
    const RIGHT_CURLY_BRACKET = "}";
    const BRACKET = {
      SQUARE: {
        LEFT: LEFT_SQUARE_BRACKET,
        RIGHT: RIGHT_SQUARE_BRACKET,
      },
      PARENTHESES: {
        LEFT: LEFT_PARENTHESIS,
        RIGHT: RIGHT_PARENTHESIS,
      },
      CURLY: {
        LEFT: LEFT_CURLY_BRACKET,
        RIGHT: RIGHT_CURLY_BRACKET,
      },
    };
    const SLASH = "/";
    const BACKSLASH = "\\";
    const SPACE = " ";
    const COMMA = ",";
    const DOT = ".";
    const SEMICOLON = ";";
    const COLON = ":";
    const SINGLE_QUOTE = "'";
    const DOUBLE_QUOTE = '"'; // do not consider hyphen `-` as separated mark
    // to avoid pseudo-class names splitting
    // e.g. 'matches-css' or 'if-not'
    const CARET = "^";
    const DOLLAR_SIGN = "$";
    const EQUAL_SIGN = "=";
    const TAB = "\t";
    const CARRIAGE_RETURN = "\r";
    const LINE_FEED = "\n";
    const FORM_FEED = "\f";
    const WHITE_SPACE_CHARACTERS = [
      SPACE,
      TAB,
      CARRIAGE_RETURN,
      LINE_FEED,
      FORM_FEED,
    ]; // for universal selector and attributes
    const ASTERISK = "*";
    const ID_MARKER = "#";
    const CLASS_MARKER = DOT;
    const DESCENDANT_COMBINATOR = SPACE;
    const CHILD_COMBINATOR = ">";
    const NEXT_SIBLING_COMBINATOR = "+";
    const SUBSEQUENT_SIBLING_COMBINATOR = "~";
    const COMBINATORS = [
      DESCENDANT_COMBINATOR,
      CHILD_COMBINATOR,
      NEXT_SIBLING_COMBINATOR,
      SUBSEQUENT_SIBLING_COMBINATOR,
    ];
    const SUPPORTED_SELECTOR_MARKS = [
      LEFT_SQUARE_BRACKET,
      RIGHT_SQUARE_BRACKET,
      LEFT_PARENTHESIS,
      RIGHT_PARENTHESIS,
      LEFT_CURLY_BRACKET,
      RIGHT_CURLY_BRACKET,
      SLASH,
      BACKSLASH,
      SEMICOLON,
      COLON,
      COMMA,
      SINGLE_QUOTE,
      DOUBLE_QUOTE,
      CARET,
      DOLLAR_SIGN,
      ASTERISK,
      ID_MARKER,
      CLASS_MARKER,
      DESCENDANT_COMBINATOR,
      CHILD_COMBINATOR,
      NEXT_SIBLING_COMBINATOR,
      SUBSEQUENT_SIBLING_COMBINATOR,
      TAB,
      CARRIAGE_RETURN,
      LINE_FEED,
      FORM_FEED,
    ];
    const SUPPORTED_STYLE_DECLARATION_MARKS = [
      // divider between property and value in declaration
      COLON,
      // divider between declarations
      SEMICOLON,
      // sometimes is needed for value wrapping
      // e.g. 'content: "-"'
      SINGLE_QUOTE,
      DOUBLE_QUOTE,
      // needed for quote escaping inside the same-type quotes
      BACKSLASH,
      // whitespaces
      SPACE,
      TAB,
      CARRIAGE_RETURN,
      LINE_FEED,
      FORM_FEED,
    ]; // absolute:
    const CONTAINS_PSEUDO = "contains";
    const HAS_TEXT_PSEUDO = "has-text";
    const ABP_CONTAINS_PSEUDO = "-abp-contains";
    const MATCHES_CSS_PSEUDO = "matches-css";
    const MATCHES_CSS_BEFORE_PSEUDO = "matches-css-before";
    const MATCHES_CSS_AFTER_PSEUDO = "matches-css-after";
    const MATCHES_ATTR_PSEUDO_CLASS_MARKER = "matches-attr";
    const MATCHES_PROPERTY_PSEUDO_CLASS_MARKER = "matches-property";
    const XPATH_PSEUDO_CLASS_MARKER = "xpath";
    const NTH_ANCESTOR_PSEUDO_CLASS_MARKER = "nth-ancestor";
    const CONTAINS_PSEUDO_NAMES = [
      CONTAINS_PSEUDO,
      HAS_TEXT_PSEUDO,
      ABP_CONTAINS_PSEUDO,
    ];
    /**
     * Pseudo-class :upward() can get number or selector arg
     * and if the arg is selector it should be standard, not extended
     * so :upward pseudo-class is always absolute.
     */
    const UPWARD_PSEUDO_CLASS_MARKER = "upward";
    /**
     * Pseudo-class `:remove()` and pseudo-property `remove`
     * are used for element actions, not for element selecting.
     *
     * Selector text should not contain the pseudo-class
     * so selector parser should consider it as invalid
     * and both are handled by stylesheet parser.
     */
    const REMOVE_PSEUDO_MARKER = "remove"; // relative:
    const HAS_PSEUDO_CLASS_MARKER = "has";
    const ABP_HAS_PSEUDO_CLASS_MARKER = "-abp-has";
    const HAS_PSEUDO_CLASS_MARKERS = [
      HAS_PSEUDO_CLASS_MARKER,
      ABP_HAS_PSEUDO_CLASS_MARKER,
    ];
    const IS_PSEUDO_CLASS_MARKER = "is";
    const NOT_PSEUDO_CLASS_MARKER = "not";
    const ABSOLUTE_PSEUDO_CLASSES = [
      CONTAINS_PSEUDO,
      HAS_TEXT_PSEUDO,
      ABP_CONTAINS_PSEUDO,
      MATCHES_CSS_PSEUDO,
      MATCHES_CSS_BEFORE_PSEUDO,
      MATCHES_CSS_AFTER_PSEUDO,
      MATCHES_ATTR_PSEUDO_CLASS_MARKER,
      MATCHES_PROPERTY_PSEUDO_CLASS_MARKER,
      XPATH_PSEUDO_CLASS_MARKER,
      NTH_ANCESTOR_PSEUDO_CLASS_MARKER,
      UPWARD_PSEUDO_CLASS_MARKER,
    ];
    const RELATIVE_PSEUDO_CLASSES = [
      ...HAS_PSEUDO_CLASS_MARKERS,
      IS_PSEUDO_CLASS_MARKER,
      NOT_PSEUDO_CLASS_MARKER,
    ];
    const SUPPORTED_PSEUDO_CLASSES = [
      ...ABSOLUTE_PSEUDO_CLASSES,
      ...RELATIVE_PSEUDO_CLASSES,
    ]; // these pseudo-classes should be part of RegularSelector value
    // if its arg does not contain extended selectors.
    // the ast will be checked after the selector is completely parsed
    const OPTIMIZATION_PSEUDO_CLASSES = [
      NOT_PSEUDO_CLASS_MARKER,
      IS_PSEUDO_CLASS_MARKER,
    ];
    /**
     * ':scope' is used for extended pseudo-class :has(), if-not(), :is() and :not().
     */
    const SCOPE_CSS_PSEUDO_CLASS = ":scope";
    /**
     * ':after' and ':before' are needed for :matches-css() pseudo-class
     * all other are needed for :has() limitation after regular pseudo-elements.
     *
     * @see {@link https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54} [case 3]
     */
    const REGULAR_PSEUDO_ELEMENTS = {
      AFTER: "after",
      BACKDROP: "backdrop",
      BEFORE: "before",
      CUE: "cue",
      CUE_REGION: "cue-region",
      FIRST_LETTER: "first-letter",
      FIRST_LINE: "first-line",
      FILE_SELECTION_BUTTON: "file-selector-button",
      GRAMMAR_ERROR: "grammar-error",
      MARKER: "marker",
      PART: "part",
      PLACEHOLDER: "placeholder",
      SELECTION: "selection",
      SLOTTED: "slotted",
      SPELLING_ERROR: "spelling-error",
      TARGET_TEXT: "target-text",
    }; // ExtendedCss does not support at-rules
    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    const AT_RULE_MARKER = "@";
    const CONTENT_CSS_PROPERTY = "content";
    const PSEUDO_PROPERTY_POSITIVE_VALUE = "true";
    const DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE = "global";
    const NO_SELECTOR_ERROR_PREFIX = "Selector should be defined";
    const STYLE_ERROR_PREFIX = {
      NO_STYLE: "No style declaration found",
      NO_SELECTOR: `${NO_SELECTOR_ERROR_PREFIX} before style declaration in stylesheet`,
      INVALID_STYLE: "Invalid style declaration",
      UNCLOSED_STYLE: "Unclosed style declaration",
      NO_PROPERTY: "Missing style property in declaration",
      NO_VALUE: "Missing style value in declaration",
      NO_STYLE_OR_REMOVE:
        "Style should be declared or :remove() pseudo-class should used",
      NO_COMMENT: "Comments are not supported",
    };
    const NO_AT_RULE_ERROR_PREFIX = "At-rules are not supported";
    const REMOVE_ERROR_PREFIX = {
      INVALID_REMOVE: "Invalid :remove() pseudo-class in selector",
      NO_TARGET_SELECTOR: `${NO_SELECTOR_ERROR_PREFIX} before :remove() pseudo-class`,
      MULTIPLE_USAGE:
        "Pseudo-class :remove() appears more than once in selector",
      INVALID_POSITION:
        "Pseudo-class :remove() should be at the end of selector",
    };
    const MATCHING_ELEMENT_ERROR_PREFIX = "Error while matching element";
    const MAX_STYLE_PROTECTION_COUNT = 50;
    /**
     * Regexp that matches backward compatible syntaxes.
     */
    const REGEXP_VALID_OLD_SYNTAX =
      /\[-(?:ext)-([a-z-_]+)=(["'])((?:(?=(\\?))\4.)*?)\2\]/g;
    /**
     * Marker for checking invalid selector after old-syntax normalizing by selector converter.
     */
    const INVALID_OLD_SYNTAX_MARKER = "[-ext-";
    /**
     * Complex replacement function.
     * Undo quote escaping inside of an extended selector.
     *
     * @param match     Whole matched string.
     * @param name      Group 1.
     * @param quoteChar Group 2.
     * @param rawValue  Group 3.
     *
     * @returns Converted string.
     */
    const evaluateMatch = (match, name, quoteChar, rawValue) => {
      // Unescape quotes
      const re = new RegExp(`([^\\\\]|^)\\\\${quoteChar}`, "g");
      const value = rawValue.replace(re, `$1${quoteChar}`);
      return `:${name}(${value})`;
    }; // ':scope' pseudo may be at start of :has() argument
    // but ExtCssDocument.querySelectorAll() already use it for selecting exact element descendants
    const SCOPE_MARKER_REGEXP = /\(:scope >/g;
    const SCOPE_REPLACER = "(>";
    const MATCHES_CSS_PSEUDO_ELEMENT_REGEXP =
      /(:matches-css)-(before|after)\(/g;
    const convertMatchesCss = (
      match,
      extendedPseudoClass,
      regularPseudoElement,
    ) => {
      // ':matches-css-before('  -->  ':matches-css(before, '
      // ':matches-css-after('   -->  ':matches-css(after, '
      return `${extendedPseudoClass}${BRACKET.PARENTHESES.LEFT}${regularPseudoElement}${COMMA}`;
    };
    /**
     * Handles old syntax and :scope inside :has().
     *
     * @param selector Trimmed selector to normalize.
     *
     * @returns Normalized selector.
     * @throws An error on invalid old extended syntax selector.
     */
    const normalize = (selector) => {
      const normalizedSelector = selector
        .replace(REGEXP_VALID_OLD_SYNTAX, evaluateMatch)
        .replace(SCOPE_MARKER_REGEXP, SCOPE_REPLACER)
        .replace(MATCHES_CSS_PSEUDO_ELEMENT_REGEXP, convertMatchesCss); // validate old syntax after normalizing
      // e.g. '[-ext-matches-css-before=\'content:  /^[A-Z][a-z]'
      if (normalizedSelector.includes(INVALID_OLD_SYNTAX_MARKER)) {
        throw new Error(
          `Invalid extended-css old syntax selector: '${selector}'`,
        );
      }
      return normalizedSelector;
    };
    /**
     * Prepares the rawSelector before tokenization:
     * 1. Trims it.
     * 2. Converts old syntax `[-ext-pseudo-class="..."]` to new one `:pseudo-class(...)`.
     * 3. Handles :scope pseudo inside :has() pseudo-class arg.
     *
     * @param rawSelector Selector with no style declaration.
     * @returns Prepared selector with no style declaration.
     */
    const convert = (rawSelector) => {
      const trimmedSelector = rawSelector.trim();
      return normalize(trimmedSelector);
    };
    /**
     * Possible token types.
     *
     * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
     * during ExtendedCss import into other libraries.
     */
    const TOKEN_TYPE = {
      MARK: "mark",
      WORD: "word",
    };
    /**
     * Splits `input` string into tokens.
     *
     * @param input Input string to tokenize.
     * @param supportedMarks Array of supported marks to considered as `TOKEN_TYPE.MARK`;
     * all other will be considered as `TOKEN_TYPE.WORD`.
     *
     * @returns Array of tokens.
     */
    const tokenize = (input, supportedMarks) => {
      // buffer is needed for words collecting while iterating
      let wordBuffer = ""; // result collection
      const tokens = [];
      const selectorSymbols = input.split(""); // iterate through selector chars and collect tokens
      selectorSymbols.forEach((symbol) => {
        if (supportedMarks.includes(symbol)) {
          // if anything was collected to the buffer before
          if (wordBuffer.length > 0) {
            // now it is time to stop buffer collecting and save is as "word"
            tokens.push({
              type: TOKEN_TYPE.WORD,
              value: wordBuffer,
            }); // reset the buffer
            wordBuffer = "";
          } // save current symbol as "mark"
          tokens.push({
            type: TOKEN_TYPE.MARK,
            value: symbol,
          });
          return;
        } // otherwise collect symbol to the buffer
        wordBuffer += symbol;
      }); // save the last collected word
      if (wordBuffer.length > 0) {
        tokens.push({
          type: TOKEN_TYPE.WORD,
          value: wordBuffer,
        });
      }
      return tokens;
    };
    /**
     * Prepares `rawSelector` and splits it into tokens.
     *
     * @param rawSelector Raw css selector.
     *
     * @returns Array of tokens supported for selector.
     */
    const tokenizeSelector = (rawSelector) => {
      const selector = convert(rawSelector);
      return tokenize(selector, SUPPORTED_SELECTOR_MARKS);
    };
    /**
     * Splits `attribute` into tokens.
     *
     * @param attribute Input attribute.
     *
     * @returns Array of tokens supported for attribute.
     */
    const tokenizeAttribute = (attribute) => {
      // equal sigh `=` in attribute is considered as `TOKEN_TYPE.MARK`
      return tokenize(attribute, [...SUPPORTED_SELECTOR_MARKS, EQUAL_SIGN]);
    };
    /**
     * Some browsers do not support Array.prototype.flat()
     * e.g. Opera 42 which is used for browserstack tests.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat}
     *
     * @param input Array needed to be flatten.
     *
     * @returns Flatten array.
     * @throws An error if array cannot be flatten.
     */
    const flatten = (input) => {
      const stack = [];
      input.forEach((el) => stack.push(el));
      const res = [];
      while (stack.length) {
        // pop value from stack
        const next = stack.pop();
        if (!next) {
          throw new Error("Unable to make array flat");
        }
        if (Array.isArray(next)) {
          // push back array items, won't modify the original input
          next.forEach((el) => stack.push(el));
        } else {
          res.push(next);
        }
      } // reverse to restore input order
      return res.reverse();
    };
    /**
     * Returns first item from `array`.
     *
     * @param array Input array.
     *
     * @returns First array item, or `undefined` if there is no such item.
     */
    const getFirst = (array) => {
      return array[0];
    };
    /**
     * Returns last item from array.
     *
     * @param array Input array.
     *
     * @returns Last array item, or `undefined` if there is no such item.
     */
    const getLast = (array) => {
      return array[array.length - 1];
    };
    /**
     * Returns array item which is previous to the last one
     * e.g. for `[5, 6, 7, 8]` returns `7`.
     *
     * @param array Input array.
     *
     * @returns Previous to last array item, or `undefined` if there is no such item.
     */
    const getPrevToLast = (array) => {
      return array[array.length - 2];
    };
    /**
     * Takes array of ast node `children` and returns the child by the `index`.
     *
     * @param array Array of ast node children.
     * @param index Index of needed child in the array.
     * @param errorMessage Optional error message to throw.
     *
     * @returns Array item at `index` position.
     * @throws An error if there is no child with specified `index` in array.
     */
    const getItemByIndex = (array, index, errorMessage) => {
      const indexChild = array[index];
      if (!indexChild) {
        throw new Error(
          errorMessage || `No array item found by index ${index}`,
        );
      }
      return indexChild;
    };
    const NO_REGULAR_SELECTOR_ERROR =
      "At least one of Selector node children should be RegularSelector";
    /**
     * Checks whether the type of `astNode` is SelectorList.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === SelectorList.
     */
    const isSelectorListNode = (astNode) => {
      return (
        (astNode === null || astNode === void 0 ? void 0 : astNode.type) ===
        NODE.SELECTOR_LIST
      );
    };
    /**
     * Checks whether the type of `astNode` is Selector.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === Selector.
     */
    const isSelectorNode = (astNode) => {
      return (
        (astNode === null || astNode === void 0 ? void 0 : astNode.type) ===
        NODE.SELECTOR
      );
    };
    /**
     * Checks whether the type of `astNode` is RegularSelector.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === RegularSelector.
     */
    const isRegularSelectorNode = (astNode) => {
      return (
        (astNode === null || astNode === void 0 ? void 0 : astNode.type) ===
        NODE.REGULAR_SELECTOR
      );
    };
    /**
     * Checks whether the type of `astNode` is ExtendedSelector.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === ExtendedSelector.
     */
    const isExtendedSelectorNode = (astNode) => {
      return astNode.type === NODE.EXTENDED_SELECTOR;
    };
    /**
     * Checks whether the type of `astNode` is AbsolutePseudoClass.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === AbsolutePseudoClass.
     */
    const isAbsolutePseudoClassNode = (astNode) => {
      return (
        (astNode === null || astNode === void 0 ? void 0 : astNode.type) ===
        NODE.ABSOLUTE_PSEUDO_CLASS
      );
    };
    /**
     * Checks whether the type of `astNode` is RelativePseudoClass.
     *
     * @param astNode Ast node.
     *
     * @returns True if astNode.type === RelativePseudoClass.
     */
    const isRelativePseudoClassNode = (astNode) => {
      return (
        (astNode === null || astNode === void 0 ? void 0 : astNode.type) ===
        NODE.RELATIVE_PSEUDO_CLASS
      );
    };
    /**
     * Returns name of `astNode`.
     *
     * @param astNode AbsolutePseudoClass or RelativePseudoClass node.
     *
     * @returns Name of `astNode`.
     * @throws An error on unsupported ast node or no name found.
     */
    const getNodeName = (astNode) => {
      if (astNode === null) {
        throw new Error("Ast node should be defined");
      }
      if (
        !isAbsolutePseudoClassNode(astNode) &&
        !isRelativePseudoClassNode(astNode)
      ) {
        throw new Error(
          "Only AbsolutePseudoClass or RelativePseudoClass ast node can have a name",
        );
      }
      if (!astNode.name) {
        throw new Error("Extended pseudo-class should have a name");
      }
      return astNode.name;
    };
    /**
     * Returns value of `astNode`.
     *
     * @param astNode RegularSelector or AbsolutePseudoClass node.
     * @param errorMessage Optional error message if no value found.
     *
     * @returns Value of `astNode`.
     * @throws An error on unsupported ast node or no value found.
     */
    const getNodeValue = (astNode, errorMessage) => {
      if (astNode === null) {
        throw new Error("Ast node should be defined");
      }
      if (
        !isRegularSelectorNode(astNode) &&
        !isAbsolutePseudoClassNode(astNode)
      ) {
        throw new Error(
          "Only RegularSelector ot AbsolutePseudoClass ast node can have a value",
        );
      }
      if (!astNode.value) {
        throw new Error(
          errorMessage ||
            "Ast RegularSelector ot AbsolutePseudoClass node should have a value",
        );
      }
      return astNode.value;
    };
    /**
     * Returns only RegularSelector nodes from `children`.
     *
     * @param children Array of ast node children.
     *
     * @returns Array of RegularSelector nodes.
     */
    const getRegularSelectorNodes = (children) => {
      return children.filter(isRegularSelectorNode);
    };
    /**
     * Returns the first RegularSelector node from `children`.
     *
     * @param children Array of ast node children.
     * @param errorMessage Optional error message if no value found.
     *
     * @returns Ast RegularSelector node.
     * @throws An error if no RegularSelector node found.
     */
    const getFirstRegularChild = (children, errorMessage) => {
      const regularSelectorNodes = getRegularSelectorNodes(children);
      const firstRegularSelectorNode = getFirst(regularSelectorNodes);
      if (!firstRegularSelectorNode) {
        throw new Error(errorMessage || NO_REGULAR_SELECTOR_ERROR);
      }
      return firstRegularSelectorNode;
    };
    /**
     * Returns the last RegularSelector node from `children`.
     *
     * @param children Array of ast node children.
     *
     * @returns Ast RegularSelector node.
     * @throws An error if no RegularSelector node found.
     */
    const getLastRegularChild = (children) => {
      const regularSelectorNodes = getRegularSelectorNodes(children);
      const lastRegularSelectorNode = getLast(regularSelectorNodes);
      if (!lastRegularSelectorNode) {
        throw new Error(NO_REGULAR_SELECTOR_ERROR);
      }
      return lastRegularSelectorNode;
    };
    /**
     * Returns the only child of `node`.
     *
     * @param node Ast node.
     * @param errorMessage Error message.
     *
     * @returns The only child of ast node.
     * @throws An error if none or more than one child found.
     */
    const getNodeOnlyChild = (node, errorMessage) => {
      if (node.children.length !== 1) {
        throw new Error(errorMessage);
      }
      const onlyChild = getFirst(node.children);
      if (!onlyChild) {
        throw new Error(errorMessage);
      }
      return onlyChild;
    };
    /**
     * Takes ExtendedSelector node and returns its only child.
     *
     * @param extendedSelectorNode ExtendedSelector ast node.
     *
     * @returns AbsolutePseudoClass or RelativePseudoClass.
     * @throws An error if there is no specific pseudo-class ast node.
     */
    const getPseudoClassNode = (extendedSelectorNode) => {
      return getNodeOnlyChild(
        extendedSelectorNode,
        "Extended selector should be specified",
      );
    };
    /**
     * Takes RelativePseudoClass node and returns its only child
     * which is relative SelectorList node.
     *
     * @param pseudoClassNode RelativePseudoClass.
     *
     * @returns Relative SelectorList node.
     * @throws An error if no selector list found.
     */
    const getRelativeSelectorListNode = (pseudoClassNode) => {
      if (!isRelativePseudoClassNode(pseudoClassNode)) {
        throw new Error(
          "Only RelativePseudoClass node can have relative SelectorList node as child",
        );
      }
      return getNodeOnlyChild(
        pseudoClassNode,
        `Missing arg for :${getNodeName(pseudoClassNode)}() pseudo-class`,
      );
    };
    const ATTRIBUTE_CASE_INSENSITIVE_FLAG = "i";
    /**
     * Limited list of available symbols before slash `/`
     * to check whether it is valid regexp pattern opening.
     */
    const POSSIBLE_MARKS_BEFORE_REGEXP = {
      COMMON: [
        // e.g. ':matches-attr(/data-/)'
        BRACKET.PARENTHESES.LEFT,
        // e.g. `:matches-attr('/data-/')`
        SINGLE_QUOTE,
        // e.g. ':matches-attr("/data-/")'
        DOUBLE_QUOTE,
        // e.g. ':matches-attr(check=/data-v-/)'
        EQUAL_SIGN,
        // e.g. ':matches-property(inner./_test/=null)'
        DOT,
        // e.g. ':matches-css(height:/20px/)'
        COLON,
        // ':matches-css-after( content  :   /(\\d+\\s)*me/  )'
        SPACE,
      ],
      CONTAINS: [
        // e.g. ':contains(/text/)'
        BRACKET.PARENTHESES.LEFT,
        // e.g. `:contains('/text/')`
        SINGLE_QUOTE,
        // e.g. ':contains("/text/")'
        DOUBLE_QUOTE,
      ],
    };
    /**
     * Checks whether the passed token is supported extended pseudo-class.
     *
     * @param tokenValue Token value to check.
     *
     * @returns True if `tokenValue` is one of supported extended pseudo-class names.
     */
    const isSupportedPseudoClass = (tokenValue) => {
      return SUPPORTED_PSEUDO_CLASSES.includes(tokenValue);
    };
    /**
     * Checks whether the passed pseudo-class `name` should be optimized,
     * i.e. :not() and :is().
     *
     * @param name Pseudo-class name.
     *
     * @returns True if `name` is one if pseudo-class which should be optimized.
     */
    const isOptimizationPseudoClass = (name) => {
      return OPTIMIZATION_PSEUDO_CLASSES.includes(name);
    };
    /**
     * Checks whether next to "space" token is a continuation of regular selector being processed.
     *
     * @param nextTokenType Type of token next to current one.
     * @param nextTokenValue Value of token next to current one.
     *
     * @returns True if next token seems to be a part of current regular selector.
     */
    const doesRegularContinueAfterSpace = (nextTokenType, nextTokenValue) => {
      // regular selector does not continues after the current token
      if (!nextTokenType || !nextTokenValue) {
        return false;
      }
      return (
        COMBINATORS.includes(nextTokenValue) ||
        nextTokenType === TOKEN_TYPE.WORD || // e.g. '#main *:has(> .ad)'
        nextTokenValue === ASTERISK ||
        nextTokenValue === ID_MARKER ||
        nextTokenValue === CLASS_MARKER || // e.g. 'div :where(.content)'
        nextTokenValue === COLON || // e.g. "div[class*=' ']"
        nextTokenValue === SINGLE_QUOTE || // e.g. 'div[class*=" "]'
        nextTokenValue === DOUBLE_QUOTE ||
        nextTokenValue === BRACKET.SQUARE.LEFT
      );
    };
    /**
     * Checks whether the regexp pattern for pseudo-class arg starts.
     * Needed for `context.isRegexpOpen` flag.
     *
     * @param context Selector parser context.
     * @param prevTokenValue Value of previous token.
     * @param bufferNodeValue Value of bufferNode.
     *
     * @returns True if current token seems to be a start of regexp pseudo-class arg pattern.
     * @throws An error on invalid regexp pattern.
     */
    const isRegexpOpening = (context, prevTokenValue, bufferNodeValue) => {
      const lastExtendedPseudoClassName = getLast(
        context.extendedPseudoNamesStack,
      );
      if (!lastExtendedPseudoClassName) {
        throw new Error(
          "Regexp pattern allowed only in arg of extended pseudo-class",
        );
      } // for regexp pattens the slash should not be escaped
      // const isRegexpPatternSlash = prevTokenValue !== BACKSLASH;
      // regexp pattern can be set as arg of pseudo-class
      // which means limited list of available symbols before slash `/`;
      // for :contains() pseudo-class regexp pattern should be at the beginning of arg
      if (CONTAINS_PSEUDO_NAMES.includes(lastExtendedPseudoClassName)) {
        return POSSIBLE_MARKS_BEFORE_REGEXP.CONTAINS.includes(prevTokenValue);
      }
      if (
        prevTokenValue === SLASH &&
        lastExtendedPseudoClassName !== XPATH_PSEUDO_CLASS_MARKER
      ) {
        const rawArgDesc = bufferNodeValue
          ? `in arg part: '${bufferNodeValue}'`
          : "arg";
        throw new Error(
          `Invalid regexp pattern for :${lastExtendedPseudoClassName}() pseudo-class ${rawArgDesc}`,
        );
      } // for other pseudo-classes regexp pattern can be either the whole arg or its part
      return POSSIBLE_MARKS_BEFORE_REGEXP.COMMON.includes(prevTokenValue);
    };
    /**
     * Checks whether the attribute starts.
     *
     * @param tokenValue Value of current token.
     * @param prevTokenValue Previous token value.
     *
     * @returns True if combination of current and previous token seems to be **a start** of attribute.
     */
    const isAttributeOpening = (tokenValue, prevTokenValue) => {
      return tokenValue === BRACKET.SQUARE.LEFT && prevTokenValue !== BACKSLASH;
    };
    /**
     * Checks whether the attribute ends.
     *
     * @param context Selector parser context.
     *
     * @returns True if combination of current and previous token seems to be **an end** of attribute.
     * @throws An error on invalid attribute.
     */
    const isAttributeClosing = (context) => {
      var _getPrevToLast;
      if (!context.isAttributeBracketsOpen) {
        return false;
      } // valid attributes may have extra spaces inside.
      // we get rid of them just to simplify the checking and they are skipped only here:
      //   - spaces will be collected to the ast with spaces as they were declared is selector
      //   - extra spaces in attribute are not relevant to attribute syntax validity
      //     e.g. 'a[ title ]' is the same as 'a[title]'
      //          'div[style *= "MARGIN" i]' is the same as 'div[style*="MARGIN"i]'
      const noSpaceAttr = context.attributeBuffer.split(SPACE).join(""); // tokenize the prepared attribute string
      const attrTokens = tokenizeAttribute(noSpaceAttr);
      const firstAttrToken = getFirst(attrTokens);
      const firstAttrTokenType =
        firstAttrToken === null || firstAttrToken === void 0
          ? void 0
          : firstAttrToken.type;
      const firstAttrTokenValue =
        firstAttrToken === null || firstAttrToken === void 0
          ? void 0
          : firstAttrToken.value; // signal an error on any mark-type token except backslash
      // e.g. '[="margin"]'
      if (
        firstAttrTokenType === TOKEN_TYPE.MARK && // backslash is allowed at start of attribute
        // e.g. '[\\:data-service-slot]'
        firstAttrTokenValue !== BACKSLASH
      ) {
        // eslint-disable-next-line max-len
        throw new Error(
          `'[${context.attributeBuffer}]' is not a valid attribute due to '${firstAttrTokenValue}' at start of it`,
        );
      }
      const lastAttrToken = getLast(attrTokens);
      const lastAttrTokenType =
        lastAttrToken === null || lastAttrToken === void 0
          ? void 0
          : lastAttrToken.type;
      const lastAttrTokenValue =
        lastAttrToken === null || lastAttrToken === void 0
          ? void 0
          : lastAttrToken.value;
      if (lastAttrTokenValue === EQUAL_SIGN) {
        // e.g. '[style=]'
        throw new Error(
          `'[${context.attributeBuffer}]' is not a valid attribute due to '${EQUAL_SIGN}'`,
        );
      }
      const equalSignIndex = attrTokens.findIndex((token) => {
        return token.type === TOKEN_TYPE.MARK && token.value === EQUAL_SIGN;
      });
      const prevToLastAttrTokenValue =
        (_getPrevToLast = getPrevToLast(attrTokens)) === null ||
        _getPrevToLast === void 0
          ? void 0
          : _getPrevToLast.value;
      if (equalSignIndex === -1) {
        // if there is no '=' inside attribute,
        // it must be just attribute name which means the word-type token before closing bracket
        // e.g. 'div[style]'
        if (lastAttrTokenType === TOKEN_TYPE.WORD) {
          return true;
        }
        return (
          prevToLastAttrTokenValue === BACKSLASH && // some weird attribute are valid too
          // e.g. '[class\\"ads-article\\"]'
          (lastAttrTokenValue === DOUBLE_QUOTE || // e.g. "[class\\'ads-article\\']"
            lastAttrTokenValue === SINGLE_QUOTE)
        );
      } // get the value of token next to `=`
      const nextToEqualSignToken = getItemByIndex(
        attrTokens,
        equalSignIndex + 1,
      );
      const nextToEqualSignTokenValue = nextToEqualSignToken.value; // check whether the attribute value wrapper in quotes
      const isAttrValueQuote =
        nextToEqualSignTokenValue === SINGLE_QUOTE ||
        nextToEqualSignTokenValue === DOUBLE_QUOTE; // for no quotes after `=` the last token before `]` should be a word-type one
      // e.g. 'div[style*=margin]'
      //      'div[style*=MARGIN i]'
      if (!isAttrValueQuote) {
        if (lastAttrTokenType === TOKEN_TYPE.WORD) {
          return true;
        } // otherwise signal an error
        // e.g. 'table[style*=border: 0px"]'
        throw new Error(
          `'[${context.attributeBuffer}]' is not a valid attribute`,
        );
      } // otherwise if quotes for value are present
      // the last token before `]` can still be word-type token
      // e.g. 'div[style*="MARGIN" i]'
      if (
        lastAttrTokenType === TOKEN_TYPE.WORD &&
        (lastAttrTokenValue === null || lastAttrTokenValue === void 0
          ? void 0
          : lastAttrTokenValue.toLocaleLowerCase()) ===
          ATTRIBUTE_CASE_INSENSITIVE_FLAG
      ) {
        return prevToLastAttrTokenValue === nextToEqualSignTokenValue;
      } // eventually if there is quotes for attribute value and last token is not a word,
      // the closing mark should be the same quote as opening one
      return lastAttrTokenValue === nextToEqualSignTokenValue;
    };
    /**
     * Checks whether the `tokenValue` is a whitespace character.
     *
     * @param tokenValue Token value.
     *
     * @returns True if `tokenValue` is a whitespace character.
     */
    const isWhiteSpaceChar = (tokenValue) => {
      if (!tokenValue) {
        return false;
      }
      return WHITE_SPACE_CHARACTERS.includes(tokenValue);
    };
    /**
     * Checks whether the passed `str` is a name of supported absolute extended pseudo-class,
     * e.g. :contains(), :matches-css() etc.
     *
     * @param str Token value to check.
     *
     * @returns True if `str` is one of absolute extended pseudo-class names.
     */
    const isAbsolutePseudoClass = (str) => {
      return ABSOLUTE_PSEUDO_CLASSES.includes(str);
    };
    /**
     * Checks whether the passed `str` is a name of supported relative extended pseudo-class,
     * e.g. :has(), :not() etc.
     *
     * @param str Token value to check.
     *
     * @returns True if `str` is one of relative extended pseudo-class names.
     */
    const isRelativePseudoClass = (str) => {
      return RELATIVE_PSEUDO_CLASSES.includes(str);
    };
    /**
     * Returns the node which is being collected
     * or null if there is no such one.
     *
     * @param context Selector parser context.
     *
     * @returns Buffer node or null.
     */
    const getBufferNode = (context) => {
      if (context.pathToBufferNode.length === 0) {
        return null;
      } // buffer node is always the last in the pathToBufferNode stack
      return getLast(context.pathToBufferNode) || null;
    };
    /**
     * Returns the parent node to the 'buffer node' — which is the one being collected —
     * or null if there is no such one.
     *
     * @param context Selector parser context.
     *
     * @returns Parent node of buffer node or null.
     */
    const getBufferNodeParent = (context) => {
      // at least two nodes should exist — the buffer node and its parent
      // otherwise return null
      if (context.pathToBufferNode.length < 2) {
        return null;
      } // since the buffer node is always the last in the pathToBufferNode stack
      // its parent is previous to it in the stack
      return getPrevToLast(context.pathToBufferNode) || null;
    };
    /**
     * Returns last RegularSelector ast node.
     * Needed for parsing of the complex selector with extended pseudo-class inside it.
     *
     * @param context Selector parser context.
     *
     * @returns Ast RegularSelector node.
     * @throws An error if:
     * - bufferNode is absent;
     * - type of bufferNode is unsupported;
     * - no RegularSelector in bufferNode.
     */
    const getContextLastRegularSelectorNode = (context) => {
      const bufferNode = getBufferNode(context);
      if (!bufferNode) {
        throw new Error("No bufferNode found");
      }
      if (!isSelectorNode(bufferNode)) {
        throw new Error("Unsupported bufferNode type");
      }
      const lastRegularSelectorNode = getLastRegularChild(bufferNode.children);
      context.pathToBufferNode.push(lastRegularSelectorNode);
      return lastRegularSelectorNode;
    };
    /**
     * Updates needed buffer node value while tokens iterating.
     * For RegularSelector also collects token values to context.attributeBuffer
     * for proper attribute parsing.
     *
     * @param context Selector parser context.
     * @param tokenValue Value of current token.
     *
     * @throws An error if:
     * - no bufferNode;
     * - bufferNode.type is not RegularSelector or AbsolutePseudoClass.
     */
    const updateBufferNode = (context, tokenValue) => {
      const bufferNode = getBufferNode(context);
      if (bufferNode === null) {
        throw new Error("No bufferNode to update");
      }
      if (isAbsolutePseudoClassNode(bufferNode)) {
        bufferNode.value += tokenValue;
      } else if (isRegularSelectorNode(bufferNode)) {
        bufferNode.value += tokenValue;
        if (context.isAttributeBracketsOpen) {
          context.attributeBuffer += tokenValue;
        }
      } else {
        // eslint-disable-next-line max-len
        throw new Error(
          `${bufferNode.type} node cannot be updated. Only RegularSelector and AbsolutePseudoClass are supported`,
        );
      }
    };
    /**
     * Adds SelectorList node to context.ast at the start of ast collecting.
     *
     * @param context Selector parser context.
     */
    const addSelectorListNode = (context) => {
      const selectorListNode = new AnySelectorNode(NODE.SELECTOR_LIST);
      context.ast = selectorListNode;
      context.pathToBufferNode.push(selectorListNode);
    };
    /**
     * Adds new node to buffer node children.
     * New added node will be considered as buffer node after it.
     *
     * @param context Selector parser context.
     * @param type Type of node to add.
     * @param tokenValue Optional, defaults to `''`, value of processing token.
     *
     * @throws An error if no bufferNode.
     */
    const addAstNodeByType = function (context, type) {
      let tokenValue =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      const bufferNode = getBufferNode(context);
      if (bufferNode === null) {
        throw new Error("No buffer node");
      }
      let node;
      if (type === NODE.REGULAR_SELECTOR) {
        node = new RegularSelectorNode(tokenValue);
      } else if (type === NODE.ABSOLUTE_PSEUDO_CLASS) {
        node = new AbsolutePseudoClassNode(tokenValue);
      } else if (type === NODE.RELATIVE_PSEUDO_CLASS) {
        node = new RelativePseudoClassNode(tokenValue);
      } else {
        // SelectorList || Selector || ExtendedSelector
        node = new AnySelectorNode(type);
      }
      bufferNode.addChild(node);
      context.pathToBufferNode.push(node);
    };
    /**
     * The very beginning of ast collecting.
     *
     * @param context Selector parser context.
     * @param tokenValue Value of regular selector.
     */
    const initAst = (context, tokenValue) => {
      addSelectorListNode(context);
      addAstNodeByType(context, NODE.SELECTOR); // RegularSelector node is always the first child of Selector node
      addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
    };
    /**
     * Inits selector list subtree for relative extended pseudo-classes, e.g. :has(), :not().
     *
     * @param context Selector parser context.
     * @param tokenValue Optional, defaults to `''`, value of inner regular selector.
     */
    const initRelativeSubtree = function (context) {
      let tokenValue =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      addAstNodeByType(context, NODE.SELECTOR_LIST);
      addAstNodeByType(context, NODE.SELECTOR);
      addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
    };
    /**
     * Goes to closest parent specified by type.
     * Actually updates path to buffer node for proper ast collecting of selectors while parsing.
     *
     * @param context Selector parser context.
     * @param parentType Type of needed parent node in ast.
     */
    const upToClosest = (context, parentType) => {
      for (let i = context.pathToBufferNode.length - 1; i >= 0; i -= 1) {
        var _context$pathToBuffer;
        if (
          ((_context$pathToBuffer = context.pathToBufferNode[i]) === null ||
          _context$pathToBuffer === void 0
            ? void 0
            : _context$pathToBuffer.type) === parentType
        ) {
          context.pathToBufferNode = context.pathToBufferNode.slice(0, i + 1);
          break;
        }
      }
    };
    /**
     * Returns needed buffer node updated due to complex selector parsing.
     *
     * @param context Selector parser context.
     *
     * @returns Ast node for following selector parsing.
     * @throws An error if there is no upper SelectorNode is ast.
     */
    const getUpdatedBufferNode = (context) => {
      // it may happen during the parsing of selector list
      // which is an argument of relative pseudo-class
      // e.g. '.banner:has(~span, ~p)'
      // parser position is here  ↑
      // so if after the comma the buffer node type is SelectorList and parent type is RelativePseudoClass
      // we should simply return the current buffer node
      const bufferNode = getBufferNode(context);
      if (
        bufferNode &&
        isSelectorListNode(bufferNode) &&
        isRelativePseudoClassNode(getBufferNodeParent(context))
      ) {
        return bufferNode;
      }
      upToClosest(context, NODE.SELECTOR);
      const selectorNode = getBufferNode(context);
      if (!selectorNode) {
        throw new Error(
          "No SelectorNode, impossible to continue selector parsing by ExtendedCss",
        );
      }
      const lastSelectorNodeChild = getLast(selectorNode.children);
      const hasExtended =
        lastSelectorNodeChild &&
        isExtendedSelectorNode(lastSelectorNodeChild) && // parser position might be inside standard pseudo-class brackets which has space
        // e.g. 'div:contains(/а/):nth-child(100n + 2)'
        context.standardPseudoBracketsStack.length === 0;
      const supposedPseudoClassNode =
        hasExtended && getFirst(lastSelectorNodeChild.children);
      let newNeededBufferNode = selectorNode;
      if (supposedPseudoClassNode) {
        // name of pseudo-class for last extended-node child for Selector node
        const lastExtendedPseudoName =
          hasExtended && supposedPseudoClassNode.name;
        const isLastExtendedNameRelative =
          lastExtendedPseudoName &&
          isRelativePseudoClass(lastExtendedPseudoName);
        const isLastExtendedNameAbsolute =
          lastExtendedPseudoName &&
          isAbsolutePseudoClass(lastExtendedPseudoName);
        const hasRelativeExtended =
          isLastExtendedNameRelative &&
          context.extendedPseudoBracketsStack.length > 0 &&
          context.extendedPseudoBracketsStack.length ===
            context.extendedPseudoNamesStack.length;
        const hasAbsoluteExtended =
          isLastExtendedNameAbsolute &&
          lastExtendedPseudoName === getLast(context.extendedPseudoNamesStack);
        if (hasRelativeExtended) {
          // return relative selector node to update later
          context.pathToBufferNode.push(lastSelectorNodeChild);
          newNeededBufferNode = supposedPseudoClassNode;
        } else if (hasAbsoluteExtended) {
          // return absolute selector node to update later
          context.pathToBufferNode.push(lastSelectorNodeChild);
          newNeededBufferNode = supposedPseudoClassNode;
        }
      } else if (hasExtended) {
        // return selector node to add new regular selector node later
        newNeededBufferNode = selectorNode;
      } else {
        // otherwise return last regular selector node to update later
        newNeededBufferNode = getContextLastRegularSelectorNode(context);
      } // update the path to buffer node properly
      context.pathToBufferNode.push(newNeededBufferNode);
      return newNeededBufferNode;
    };
    /**
     * Checks values of few next tokens on colon token `:` and:
     *  - updates buffer node for following standard pseudo-class;
     *  - adds extended selector ast node for following extended pseudo-class;
     *  - validates some cases of `:remove()` and `:has()` usage.
     *
     * @param context Selector parser context.
     * @param selector Selector.
     * @param tokenValue Value of current token.
     * @param nextTokenValue Value of token next to current one.
     * @param nextToNextTokenValue Value of token next to next to current one.
     *
     * @throws An error on :remove() pseudo-class in selector
     * or :has() inside regular pseudo limitation.
     */
    const handleNextTokenOnColon = (
      context,
      selector,
      tokenValue,
      nextTokenValue,
      nextToNextTokenValue,
    ) => {
      if (!nextTokenValue) {
        throw new Error(
          `Invalid colon ':' at the end of selector: '${selector}'`,
        );
      }
      if (!isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
        if (nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER) {
          // :remove() pseudo-class should be handled before
          // as it is not about element selecting but actions with elements
          // e.g. 'body > div:empty:remove()'
          throw new Error(
            `${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`,
          );
        } // if following token is not an extended pseudo
        // the colon should be collected to value of RegularSelector
        // e.g. '.entry_text:nth-child(2)'
        updateBufferNode(context, tokenValue); // check the token after the pseudo and do balance parentheses later
        // only if it is functional pseudo-class (standard with brackets, e.g. ':lang()').
        // no brackets balance needed for such case,
        // parser position is on first colon after the 'div':
        // e.g. 'div:last-child:has(button.privacy-policy__btn)'
        if (
          nextToNextTokenValue &&
          nextToNextTokenValue === BRACKET.PARENTHESES.LEFT && // no brackets balance needed for parentheses inside attribute value
          // e.g. 'a[href="javascript:void(0)"]'   <-- parser position is on colon `:`
          // before `void`           ↑
          !context.isAttributeBracketsOpen
        ) {
          context.standardPseudoNamesStack.push(nextTokenValue);
        }
      } else {
        // it is supported extended pseudo-class.
        // Disallow :has() inside the pseudos accepting only compound selectors
        // https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54 [2]
        if (
          HAS_PSEUDO_CLASS_MARKERS.includes(nextTokenValue) &&
          context.standardPseudoNamesStack.length > 0
        ) {
          // eslint-disable-next-line max-len
          throw new Error(
            `Usage of :${nextTokenValue}() pseudo-class is not allowed inside regular pseudo: '${getLast(context.standardPseudoNamesStack)}'`,
          );
        } else {
          // stop RegularSelector value collecting
          upToClosest(context, NODE.SELECTOR); // add ExtendedSelector to Selector children
          addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
        }
      }
    };
    // e.g. ':is(.page, .main) > .banner' or '*:not(span):not(p)'
    const IS_OR_NOT_PSEUDO_SELECTING_ROOT = `html ${ASTERISK}`;
    /**
     * Checks if there are any ExtendedSelector node in selector list.
     *
     * @param selectorList Ast SelectorList node.
     *
     * @returns True if `selectorList` has any inner ExtendedSelector node.
     */
    const hasExtendedSelector = (selectorList) => {
      return selectorList.children.some((selectorNode) => {
        return selectorNode.children.some((selectorNodeChild) => {
          return isExtendedSelectorNode(selectorNodeChild);
        });
      });
    };
    /**
     * Converts selector list of RegularSelector nodes to string.
     *
     * @param selectorList Ast SelectorList node.
     *
     * @returns String representation for selector list of regular selectors.
     */
    const selectorListOfRegularsToString = (selectorList) => {
      // if there is no ExtendedSelector in relative SelectorList
      // it means that each Selector node has single child — RegularSelector node
      // and their values should be combined to string
      const standardCssSelectors = selectorList.children.map((selectorNode) => {
        const selectorOnlyChild = getNodeOnlyChild(
          selectorNode,
          "Ast Selector node should have RegularSelector node",
        );
        return getNodeValue(selectorOnlyChild);
      });
      return standardCssSelectors.join(`${COMMA}${SPACE}`);
    };
    /**
     * Updates children of `node` replacing them with `newChildren`.
     * Important: modifies input `node` which is passed by reference.
     *
     * @param node Ast node to update.
     * @param newChildren Array of new children for ast node.
     *
     * @returns Updated ast node.
     */
    const updateNodeChildren = (node, newChildren) => {
      node.children = newChildren;
      return node;
    };
    /**
     * Recursively checks whether the ExtendedSelector node should be optimized.
     * It has to be recursive because RelativePseudoClass has inner SelectorList node.
     *
     * @param currExtendedSelectorNode Ast ExtendedSelector node.
     *
     * @returns True is ExtendedSelector should be optimized.
     */
    const shouldOptimizeExtendedSelector = (currExtendedSelectorNode) => {
      if (currExtendedSelectorNode === null) {
        return false;
      }
      const extendedPseudoClassNode = getPseudoClassNode(
        currExtendedSelectorNode,
      );
      const pseudoName = getNodeName(extendedPseudoClassNode);
      if (isAbsolutePseudoClass(pseudoName)) {
        return false;
      }
      const relativeSelectorList = getRelativeSelectorListNode(
        extendedPseudoClassNode,
      );
      const innerSelectorNodes = relativeSelectorList.children; // simple checking for standard selectors in arg of :not() or :is() pseudo-class
      // e.g. 'div > *:is(div, a, span)'
      if (isOptimizationPseudoClass(pseudoName)) {
        const areAllSelectorNodeChildrenRegular = innerSelectorNodes.every(
          (selectorNode) => {
            try {
              const selectorOnlyChild = getNodeOnlyChild(
                selectorNode,
                "Selector node should have RegularSelector",
              ); // it means that the only child is RegularSelector and it can be optimized
              return isRegularSelectorNode(selectorOnlyChild);
            } catch (e) {
              return false;
            }
          },
        );
        if (areAllSelectorNodeChildrenRegular) {
          return true;
        }
      } // for other extended pseudo-classes than :not() and :is()
      return innerSelectorNodes.some((selectorNode) => {
        return selectorNode.children.some((selectorNodeChild) => {
          if (!isExtendedSelectorNode(selectorNodeChild)) {
            return false;
          } // check inner ExtendedSelector recursively
          // e.g. 'div:has(*:not(.header))'
          return shouldOptimizeExtendedSelector(selectorNodeChild);
        });
      });
    };
    /**
     * Returns optimized ExtendedSelector node if it can be optimized
     * or null if ExtendedSelector is fully optimized while function execution
     * which means that value of `prevRegularSelectorNode` is updated.
     *
     * @param currExtendedSelectorNode Current ExtendedSelector node to optimize.
     * @param prevRegularSelectorNode Previous RegularSelector node.
     *
     * @returns Ast node or null.
     */
    const getOptimizedExtendedSelector = (
      currExtendedSelectorNode,
      prevRegularSelectorNode,
    ) => {
      if (!currExtendedSelectorNode) {
        return null;
      }
      const extendedPseudoClassNode = getPseudoClassNode(
        currExtendedSelectorNode,
      );
      const relativeSelectorList = getRelativeSelectorListNode(
        extendedPseudoClassNode,
      );
      const hasInnerExtendedSelector =
        hasExtendedSelector(relativeSelectorList);
      if (!hasInnerExtendedSelector) {
        // if there is no extended selectors for :not() or :is()
        // e.g. 'div:not(.content, .main)'
        const relativeSelectorListStr =
          selectorListOfRegularsToString(relativeSelectorList);
        const pseudoName = getNodeName(extendedPseudoClassNode); // eslint-disable-next-line max-len
        const optimizedExtendedStr = `${COLON}${pseudoName}${BRACKET.PARENTHESES.LEFT}${relativeSelectorListStr}${BRACKET.PARENTHESES.RIGHT}`;
        prevRegularSelectorNode.value = `${getNodeValue(prevRegularSelectorNode)}${optimizedExtendedStr}`;
        return null;
      } // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const optimizedRelativeSelectorList =
        optimizeSelectorListNode(relativeSelectorList);
      const optimizedExtendedPseudoClassNode = updateNodeChildren(
        extendedPseudoClassNode,
        [optimizedRelativeSelectorList],
      );
      return updateNodeChildren(currExtendedSelectorNode, [
        optimizedExtendedPseudoClassNode,
      ]);
    };
    /**
     * Combines values of `previous` and `current` RegularSelector nodes.
     * It may happen during the optimization when ExtendedSelector between RegularSelector node was optimized.
     *
     * @param current Current RegularSelector node.
     * @param previous Previous RegularSelector node.
     */
    const optimizeCurrentRegularSelector = (current, previous) => {
      previous.value = `${getNodeValue(previous)}${SPACE}${getNodeValue(current)}`;
    };
    /**
     * Optimizes ast Selector node.
     *
     * @param selectorNode Ast Selector node.
     *
     * @returns Optimized ast node.
     * @throws An error while collecting optimized nodes.
     */
    const optimizeSelectorNode = (selectorNode) => {
      // non-optimized list of SelectorNode children
      const rawSelectorNodeChildren = selectorNode.children; // for collecting optimized children list
      const optimizedChildrenList = [];
      let currentIndex = 0; // iterate through all children in non-optimized ast Selector node
      while (currentIndex < rawSelectorNodeChildren.length) {
        const currentChild = getItemByIndex(
          rawSelectorNodeChildren,
          currentIndex,
          "currentChild should be specified",
        ); // no need to optimize the very first child which is always RegularSelector node
        if (currentIndex === 0) {
          optimizedChildrenList.push(currentChild);
        } else {
          const prevRegularChild = getLastRegularChild(optimizedChildrenList);
          if (isExtendedSelectorNode(currentChild)) {
            // start checking with point is null
            let optimizedExtendedSelector = null; // check whether the optimization is needed
            let isOptimizationNeeded =
              shouldOptimizeExtendedSelector(currentChild); // update optimizedExtendedSelector so it can be optimized recursively
            // i.e. `getOptimizedExtendedSelector(optimizedExtendedSelector)` below
            optimizedExtendedSelector = currentChild;
            while (isOptimizationNeeded) {
              // recursively optimize ExtendedSelector until no optimization needed
              // e.g. div > *:is(.banner:not(.block))
              optimizedExtendedSelector = getOptimizedExtendedSelector(
                optimizedExtendedSelector,
                prevRegularChild,
              );
              isOptimizationNeeded = shouldOptimizeExtendedSelector(
                optimizedExtendedSelector,
              );
            } // if it was simple :not() of :is() with standard selector arg
            // e.g. 'div:not([class][id])'
            // or   '.main > *:is([data-loaded], .banner)'
            // after the optimization the ExtendedSelector node become part of RegularSelector
            // so nothing to save eventually
            // otherwise the optimized ExtendedSelector should be saved
            // e.g. 'div:has(:not([class]))'
            if (optimizedExtendedSelector !== null) {
              optimizedChildrenList.push(optimizedExtendedSelector); // if optimization is not needed
              const optimizedPseudoClass = getPseudoClassNode(
                optimizedExtendedSelector,
              );
              const optimizedPseudoName = getNodeName(optimizedPseudoClass); // parent element checking is used to apply :is() and :not() pseudo-classes as extended.
              // as there is no parentNode for root element (html)
              // so element selection should be limited to it's children
              // e.g. '*:is(:has(.page))' -> 'html *:is(has(.page))'
              // or   '*:not(:has(span))' -> 'html *:not(:has(span))'
              if (
                getNodeValue(prevRegularChild) === ASTERISK &&
                isOptimizationPseudoClass(optimizedPseudoName)
              ) {
                prevRegularChild.value = IS_OR_NOT_PSEUDO_SELECTING_ROOT;
              }
            }
          } else if (isRegularSelectorNode(currentChild)) {
            // in non-optimized ast, RegularSelector node may follow ExtendedSelector which should be optimized
            // for example, for 'div:not(.content) > .banner' schematically it looks like
            // non-optimized ast: [
            //   1. RegularSelector: 'div'
            //   2. ExtendedSelector: 'not(.content)'
            //   3. RegularSelector: '> .banner'
            // ]
            // which after the ExtendedSelector looks like
            // partly optimized ast: [
            //   1. RegularSelector: 'div:not(.content)'
            //   2. RegularSelector: '> .banner'
            // ]
            // so second RegularSelector value should be combined with first one
            // optimized ast: [
            //   1. RegularSelector: 'div:not(.content) > .banner'
            // ]
            // here we check **children of selectorNode** after previous optimization if it was
            const lastOptimizedChild = getLast(optimizedChildrenList) || null;
            if (isRegularSelectorNode(lastOptimizedChild)) {
              optimizeCurrentRegularSelector(currentChild, prevRegularChild);
            }
          }
        }
        currentIndex += 1;
      }
      return updateNodeChildren(selectorNode, optimizedChildrenList);
    };
    /**
     * Optimizes ast SelectorList node.
     *
     * @param selectorListNode SelectorList node.
     *
     * @returns Optimized ast node.
     */
    const optimizeSelectorListNode = (selectorListNode) => {
      return updateNodeChildren(
        selectorListNode,
        selectorListNode.children.map((s) => optimizeSelectorNode(s)),
      );
    };
    /**
     * Optimizes ast:
     * If arg of :not() and :is() pseudo-classes does not contain extended selectors,
     * native Document.querySelectorAll() can be used to query elements.
     * It means that ExtendedSelector ast nodes can be removed
     * and value of relevant RegularSelector node should be updated accordingly.
     *
     * @param ast Non-optimized ast.
     *
     * @returns Optimized ast.
     */
    const optimizeAst = (ast) => {
      // ast is basically the selector list of selectors
      return optimizeSelectorListNode(ast);
    };
    // https://github.com/AdguardTeam/ExtendedCss/issues/115
    const XPATH_PSEUDO_SELECTING_ROOT = "body";
    const NO_WHITESPACE_ERROR_PREFIX =
      "No white space is allowed before or after extended pseudo-class name in selector";
    /**
     * Parses selector into ast for following element selection.
     *
     * @param selector Selector to parse.
     *
     * @returns Parsed ast.
     * @throws An error on invalid selector.
     */
    const parse = (selector) => {
      const tokens = tokenizeSelector(selector);
      const context = {
        ast: null,
        pathToBufferNode: [],
        extendedPseudoNamesStack: [],
        extendedPseudoBracketsStack: [],
        standardPseudoNamesStack: [],
        standardPseudoBracketsStack: [],
        isAttributeBracketsOpen: false,
        attributeBuffer: "",
        isRegexpOpen: false,
        shouldOptimize: false,
      };
      let i = 0;
      while (i < tokens.length) {
        const token = tokens[i];
        if (!token) {
          break;
        } // Token to process
        const { type: tokenType, value: tokenValue } = token; // needed for SPACE and COLON tokens checking
        const nextToken = tokens[i + 1];
        const nextTokenType =
          nextToken === null || nextToken === void 0 ? void 0 : nextToken.type;
        const nextTokenValue =
          nextToken === null || nextToken === void 0 ? void 0 : nextToken.value; // needed for limitations
        // - :not() and :is() root element
        // - :has() usage
        // - white space before and after pseudo-class name
        const nextToNextToken = tokens[i + 2];
        const nextToNextTokenValue =
          nextToNextToken === null || nextToNextToken === void 0
            ? void 0
            : nextToNextToken.value; // needed for COLON token checking for none-specified regular selector before extended one
        // e.g. 'p, :hover'
        // or   '.banner, :contains(ads)'
        const previousToken = tokens[i - 1];
        const prevTokenType =
          previousToken === null || previousToken === void 0
            ? void 0
            : previousToken.type;
        const prevTokenValue =
          previousToken === null || previousToken === void 0
            ? void 0
            : previousToken.value; // needed for proper parsing of regexp pattern arg
        // e.g. ':matches-css(background-image: /^url\(https:\/\/example\.org\//)'
        const previousToPreviousToken = tokens[i - 2];
        const prevToPrevTokenValue =
          previousToPreviousToken === null || previousToPreviousToken === void 0
            ? void 0
            : previousToPreviousToken.value;
        let bufferNode = getBufferNode(context);
        switch (tokenType) {
          case TOKEN_TYPE.WORD:
            if (bufferNode === null) {
              // there is no buffer node only in one case — no ast collecting has been started
              initAst(context, tokenValue);
            } else if (isSelectorListNode(bufferNode)) {
              // add new selector to selector list
              addAstNodeByType(context, NODE.SELECTOR);
              addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
            } else if (isRegularSelectorNode(bufferNode)) {
              updateBufferNode(context, tokenValue);
            } else if (isExtendedSelectorNode(bufferNode)) {
              // No white space is allowed between the name of extended pseudo-class
              // and its opening parenthesis
              // https://www.w3.org/TR/selectors-4/#pseudo-classes
              // e.g. 'span:contains (text)'
              if (
                isWhiteSpaceChar(nextTokenValue) &&
                nextToNextTokenValue === BRACKET.PARENTHESES.LEFT
              ) {
                throw new Error(`${NO_WHITESPACE_ERROR_PREFIX}: '${selector}'`);
              }
              const lowerCaseTokenValue = tokenValue.toLowerCase(); // save pseudo-class name for brackets balance checking
              context.extendedPseudoNamesStack.push(lowerCaseTokenValue); // extended pseudo-class name are parsed in lower case
              // as they should be case-insensitive
              // https://www.w3.org/TR/selectors-4/#pseudo-classes
              if (isAbsolutePseudoClass(lowerCaseTokenValue)) {
                addAstNodeByType(
                  context,
                  NODE.ABSOLUTE_PSEUDO_CLASS,
                  lowerCaseTokenValue,
                );
              } else {
                // if it is not absolute pseudo-class, it must be relative one
                // add RelativePseudoClass with tokenValue as pseudo-class name to ExtendedSelector children
                addAstNodeByType(
                  context,
                  NODE.RELATIVE_PSEUDO_CLASS,
                  lowerCaseTokenValue,
                ); // for :not() and :is() pseudo-classes parsed ast should be optimized later
                if (isOptimizationPseudoClass(lowerCaseTokenValue)) {
                  context.shouldOptimize = true;
                }
              }
            } else if (isAbsolutePseudoClassNode(bufferNode)) {
              // collect absolute pseudo-class arg
              updateBufferNode(context, tokenValue);
            } else if (isRelativePseudoClassNode(bufferNode)) {
              initRelativeSubtree(context, tokenValue);
            }
            break;
          case TOKEN_TYPE.MARK:
            switch (tokenValue) {
              case COMMA:
                if (
                  !bufferNode ||
                  (typeof bufferNode !== "undefined" && !nextTokenValue)
                ) {
                  // consider the selector is invalid if there is no bufferNode yet (e.g. ', a')
                  // or there is nothing after the comma while bufferNode is defined (e.g. 'div, ')
                  throw new Error(`'${selector}' is not a valid selector`);
                } else if (isRegularSelectorNode(bufferNode)) {
                  if (context.isAttributeBracketsOpen) {
                    // the comma might be inside element attribute value
                    // e.g. 'div[data-comma="0,1"]'
                    updateBufferNode(context, tokenValue);
                  } else {
                    // new Selector should be collected to upper SelectorList
                    upToClosest(context, NODE.SELECTOR_LIST);
                  }
                } else if (isAbsolutePseudoClassNode(bufferNode)) {
                  // the comma inside arg of absolute extended pseudo
                  // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                  updateBufferNode(context, tokenValue);
                } else if (isSelectorNode(bufferNode)) {
                  // new Selector should be collected to upper SelectorList
                  // if parser position is on Selector node
                  upToClosest(context, NODE.SELECTOR_LIST);
                }
                break;
              case SPACE:
                // it might be complex selector with extended pseudo-class inside it
                // and the space is between that complex selector and following regular selector
                // parser position is on ` ` before `span` now:
                // e.g. 'div:has(img).banner span'
                // so we need to check whether the new ast node should be added (example above)
                // or previous regular selector node should be updated
                if (
                  isRegularSelectorNode(bufferNode) && // no need to update the buffer node if attribute value is being parsed
                  // e.g. 'div:not([id])[style="position: absolute; z-index: 10000;"]'
                  // parser position inside attribute    ↑
                  !context.isAttributeBracketsOpen
                ) {
                  bufferNode = getUpdatedBufferNode(context);
                }
                if (isRegularSelectorNode(bufferNode)) {
                  // standard selectors with white space between colon and name of pseudo
                  // are invalid for native document.querySelectorAll() anyway,
                  // so throwing the error here is better
                  // than proper parsing of invalid selector and passing it further.
                  // first of all do not check attributes
                  // e.g. div[style="text-align: center"]
                  if (
                    !context.isAttributeBracketsOpen && // check the space after the colon and before the pseudo
                    // e.g. '.block: nth-child(2)
                    ((prevTokenValue === COLON &&
                      nextTokenType === TOKEN_TYPE.WORD) || // or after the pseudo and before the opening parenthesis
                      // e.g. '.block:nth-child (2)
                      (prevTokenType === TOKEN_TYPE.WORD &&
                        nextTokenValue === BRACKET.PARENTHESES.LEFT))
                  ) {
                    throw new Error(`'${selector}' is not a valid selector`);
                  } // collect current tokenValue to value of RegularSelector
                  // if it is the last token or standard selector continues after the space.
                  // otherwise it will be skipped
                  if (
                    !nextTokenValue ||
                    doesRegularContinueAfterSpace(
                      nextTokenType,
                      nextTokenValue,
                    ) || // we also should collect space inside attribute value
                    // e.g. `[onclick^="window.open ('https://example.com/share?url="]`
                    // parser position             ↑
                    context.isAttributeBracketsOpen
                  ) {
                    updateBufferNode(context, tokenValue);
                  }
                }
                if (isAbsolutePseudoClassNode(bufferNode)) {
                  // space inside extended pseudo-class arg
                  // e.g. 'span:contains(some text)'
                  updateBufferNode(context, tokenValue);
                }
                if (isRelativePseudoClassNode(bufferNode)) {
                  // init with empty value RegularSelector
                  // as the space is not needed for selector value
                  // e.g. 'p:not( .content )'
                  initRelativeSubtree(context);
                }
                if (isSelectorNode(bufferNode)) {
                  // do NOT add RegularSelector if parser position on space BEFORE the comma in selector list
                  // e.g. '.block:has(> img) , .banner)'
                  if (
                    doesRegularContinueAfterSpace(nextTokenType, nextTokenValue)
                  ) {
                    // regular selector might be after the extended one.
                    // extra space before combinator or selector should not be collected
                    // e.g. '.banner:upward(2) .block'
                    //      '.banner:upward(2) > .block'
                    // so no tokenValue passed to addAnySelectorNode()
                    addAstNodeByType(context, NODE.REGULAR_SELECTOR);
                  }
                }
                break;
              case DESCENDANT_COMBINATOR:
              case CHILD_COMBINATOR:
              case NEXT_SIBLING_COMBINATOR:
              case SUBSEQUENT_SIBLING_COMBINATOR:
              case SEMICOLON:
              case SLASH:
              case BACKSLASH:
              case SINGLE_QUOTE:
              case DOUBLE_QUOTE:
              case CARET:
              case DOLLAR_SIGN:
              case BRACKET.CURLY.LEFT:
              case BRACKET.CURLY.RIGHT:
              case ASTERISK:
              case ID_MARKER:
              case CLASS_MARKER:
              case BRACKET.SQUARE.LEFT:
                // it might be complex selector with extended pseudo-class inside it
                // and the space is between that complex selector and following regular selector
                // e.g. 'div:has(img).banner'   // parser position is on `.` before `banner` now
                //      'div:has(img)[attr]'    // parser position is on `[` before `attr` now
                // so we need to check whether the new ast node should be added (example above)
                // or previous regular selector node should be updated
                if (COMBINATORS.includes(tokenValue)) {
                  if (bufferNode === null) {
                    // cases where combinator at very beginning of a selector
                    // e.g. '> div'
                    // or   '~ .banner'
                    // or even '+js(overlay-buster)' which not a selector at all
                    // but may be validated by FilterCompiler so error message should be appropriate
                    throw new Error(`'${selector}' is not a valid selector`);
                  }
                  bufferNode = getUpdatedBufferNode(context);
                }
                if (bufferNode === null) {
                  // no ast collecting has been started
                  // e.g. '.banner > p'
                  // or   '#top > div.ad'
                  // or   '[class][style][attr]'
                  // or   '*:not(span)'
                  initAst(context, tokenValue);
                  if (isAttributeOpening(tokenValue, prevTokenValue)) {
                    // e.g. '[class^="banner-"]'
                    context.isAttributeBracketsOpen = true;
                  }
                } else if (isRegularSelectorNode(bufferNode)) {
                  if (
                    tokenValue === BRACKET.CURLY.LEFT &&
                    !(context.isAttributeBracketsOpen || context.isRegexpOpen)
                  ) {
                    // e.g. 'div { content: "'
                    throw new Error(`'${selector}' is not a valid selector`);
                  } // collect the mark to the value of RegularSelector node
                  updateBufferNode(context, tokenValue);
                  if (isAttributeOpening(tokenValue, prevTokenValue)) {
                    // needed for proper handling element attribute value with comma
                    // e.g. 'div[data-comma="0,1"]'
                    context.isAttributeBracketsOpen = true;
                  }
                } else if (isAbsolutePseudoClassNode(bufferNode)) {
                  // collect the mark to the arg of AbsolutePseudoClass node
                  updateBufferNode(context, tokenValue); // 'isRegexpOpen' flag is needed for brackets balancing inside extended pseudo-class arg
                  if (
                    tokenValue === SLASH &&
                    context.extendedPseudoNamesStack.length > 0
                  ) {
                    if (
                      prevTokenValue === SLASH &&
                      prevToPrevTokenValue === BACKSLASH
                    ) {
                      // it may be specific url regexp pattern in arg of pseudo-class
                      // e.g. ':matches-css(background-image: /^url\(https:\/\/example\.org\//)'
                      // parser position is on final slash before `)`                        ↑
                      context.isRegexpOpen = false;
                    } else if (prevTokenValue && prevTokenValue !== BACKSLASH) {
                      if (
                        isRegexpOpening(
                          context,
                          prevTokenValue,
                          getNodeValue(bufferNode),
                        )
                      ) {
                        context.isRegexpOpen = !context.isRegexpOpen;
                      } else {
                        // otherwise force `isRegexpOpen` flag to `false`
                        context.isRegexpOpen = false;
                      }
                    }
                  }
                } else if (isRelativePseudoClassNode(bufferNode)) {
                  // add SelectorList to children of RelativePseudoClass node
                  initRelativeSubtree(context, tokenValue);
                  if (isAttributeOpening(tokenValue, prevTokenValue)) {
                    // besides of creating the relative subtree
                    // opening square bracket means start of attribute
                    // e.g. 'div:not([class="content"])'
                    //      'div:not([href*="window.print()"])'
                    context.isAttributeBracketsOpen = true;
                  }
                } else if (isSelectorNode(bufferNode)) {
                  // after the extended pseudo closing parentheses
                  // parser position is on Selector node
                  // and regular selector can be after the extended one
                  // e.g. '.banner:upward(2)> .block'
                  // or   '.inner:nth-ancestor(1)~ .banner'
                  if (COMBINATORS.includes(tokenValue)) {
                    addAstNodeByType(
                      context,
                      NODE.REGULAR_SELECTOR,
                      tokenValue,
                    );
                  } else if (!context.isRegexpOpen) {
                    // it might be complex selector with extended pseudo-class inside it.
                    // parser position is on `.` now:
                    // e.g. 'div:has(img).banner'
                    // so we need to get last regular selector node and update its value
                    bufferNode = getContextLastRegularSelectorNode(context);
                    updateBufferNode(context, tokenValue);
                    if (isAttributeOpening(tokenValue, prevTokenValue)) {
                      // handle attribute in compound selector after extended pseudo-class
                      // e.g. 'div:not(.top)[style="z-index: 10000;"]'
                      // parser position    ↑
                      context.isAttributeBracketsOpen = true;
                    }
                  }
                } else if (isSelectorListNode(bufferNode)) {
                  // add Selector to SelectorList
                  addAstNodeByType(context, NODE.SELECTOR); // and RegularSelector as it is always the first child of Selector
                  addAstNodeByType(context, NODE.REGULAR_SELECTOR, tokenValue);
                  if (isAttributeOpening(tokenValue, prevTokenValue)) {
                    // handle simple attribute selector in selector list
                    // e.g. '.banner, [class^="ad-"]'
                    context.isAttributeBracketsOpen = true;
                  }
                }
                break;
              case BRACKET.SQUARE.RIGHT:
                if (isRegularSelectorNode(bufferNode)) {
                  // unescaped `]` in regular selector allowed only inside attribute value
                  if (
                    !context.isAttributeBracketsOpen &&
                    prevTokenValue !== BACKSLASH
                  ) {
                    // e.g. 'div]'
                    // eslint-disable-next-line max-len
                    throw new Error(
                      `'${selector}' is not a valid selector due to '${tokenValue}' after '${getNodeValue(bufferNode)}'`,
                    );
                  } // needed for proper parsing regular selectors after the attributes with comma
                  // e.g. 'div[data-comma="0,1"] > img'
                  if (isAttributeClosing(context)) {
                    context.isAttributeBracketsOpen = false; // reset attribute buffer on closing `]`
                    context.attributeBuffer = "";
                  } // collect the bracket to the value of RegularSelector node
                  updateBufferNode(context, tokenValue);
                }
                if (isAbsolutePseudoClassNode(bufferNode)) {
                  // :xpath() expended pseudo-class arg might contain square bracket
                  // so it should be collected
                  // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                  updateBufferNode(context, tokenValue);
                }
                break;
              case COLON:
                // No white space is allowed between the colon and the following name of the pseudo-class
                // https://www.w3.org/TR/selectors-4/#pseudo-classes
                // e.g. 'span: contains(text)'
                if (
                  isWhiteSpaceChar(nextTokenValue) &&
                  nextToNextTokenValue &&
                  SUPPORTED_PSEUDO_CLASSES.includes(nextToNextTokenValue)
                ) {
                  throw new Error(
                    `${NO_WHITESPACE_ERROR_PREFIX}: '${selector}'`,
                  );
                }
                if (bufferNode === null) {
                  // no ast collecting has been started
                  if (nextTokenValue === XPATH_PSEUDO_CLASS_MARKER) {
                    // limit applying of "naked" :xpath pseudo-class
                    // https://github.com/AdguardTeam/ExtendedCss/issues/115
                    initAst(context, XPATH_PSEUDO_SELECTING_ROOT);
                  } else if (
                    nextTokenValue === UPWARD_PSEUDO_CLASS_MARKER ||
                    nextTokenValue === NTH_ANCESTOR_PSEUDO_CLASS_MARKER
                  ) {
                    // selector should be specified before :nth-ancestor() or :upward()
                    // e.g. ':nth-ancestor(3)'
                    // or   ':upward(span)'
                    throw new Error(
                      `${NO_SELECTOR_ERROR_PREFIX} before :${nextTokenValue}() pseudo-class`,
                    );
                  } else {
                    // make it more obvious if selector starts with pseudo with no tag specified
                    // e.g. ':has(a)' -> '*:has(a)'
                    // or   ':empty'  -> '*:empty'
                    initAst(context, ASTERISK);
                  } // bufferNode should be updated for following checking
                  bufferNode = getBufferNode(context);
                }
                if (isSelectorListNode(bufferNode)) {
                  // bufferNode is SelectorList after comma has been parsed.
                  // parser position is on colon now:
                  // e.g. 'img,:not(.content)'
                  addAstNodeByType(context, NODE.SELECTOR); // add empty value RegularSelector anyway as any selector should start with it
                  // and check previous token on the next step
                  addAstNodeByType(context, NODE.REGULAR_SELECTOR); // bufferNode should be updated for following checking
                  bufferNode = getBufferNode(context);
                }
                if (isRegularSelectorNode(bufferNode)) {
                  // it can be extended or standard pseudo
                  // e.g. '#share, :contains(share it)'
                  // or   'div,:hover'
                  // of   'div:has(+:contains(text))'  // position is after '+'
                  if (
                    (prevTokenValue && COMBINATORS.includes(prevTokenValue)) ||
                    prevTokenValue === COMMA
                  ) {
                    // case with colon at the start of string - e.g. ':contains(text)'
                    // is covered by 'bufferNode === null' above at start of COLON checking
                    updateBufferNode(context, ASTERISK);
                  }
                  handleNextTokenOnColon(
                    context,
                    selector,
                    tokenValue,
                    nextTokenValue,
                    nextToNextTokenValue,
                  );
                }
                if (isSelectorNode(bufferNode)) {
                  // e.g. 'div:contains(text):'
                  if (!nextTokenValue) {
                    throw new Error(
                      `Invalid colon ':' at the end of selector: '${selector}'`,
                    );
                  } // after the extended pseudo closing parentheses
                  // parser position is on Selector node
                  // and there is might be another extended selector.
                  // parser position is on colon before 'upward':
                  // e.g. 'p:contains(PR):upward(2)'
                  if (isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
                    // if supported extended pseudo-class is next to colon
                    // add ExtendedSelector to Selector children
                    addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
                  } else if (
                    nextTokenValue.toLowerCase() === REMOVE_PSEUDO_MARKER
                  ) {
                    // :remove() pseudo-class should be handled before
                    // as it is not about element selecting but actions with elements
                    // e.g. '#banner:upward(2):remove()'
                    throw new Error(
                      `${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`,
                    );
                  } else {
                    // otherwise it is standard pseudo after extended pseudo-class in complex selector
                    // and colon should be collected to value of previous RegularSelector
                    // e.g. 'body *:not(input)::selection'
                    //      'input:matches-css(padding: 10):checked'
                    bufferNode = getContextLastRegularSelectorNode(context);
                    handleNextTokenOnColon(
                      context,
                      selector,
                      tokenValue,
                      nextTokenType,
                      nextToNextTokenValue,
                    );
                  }
                }
                if (isAbsolutePseudoClassNode(bufferNode)) {
                  // :xpath() pseudo-class should be the last of extended pseudo-classes
                  if (
                    getNodeName(bufferNode) === XPATH_PSEUDO_CLASS_MARKER &&
                    nextTokenValue &&
                    SUPPORTED_PSEUDO_CLASSES.includes(nextTokenValue) &&
                    nextToNextTokenValue === BRACKET.PARENTHESES.LEFT
                  ) {
                    throw new Error(
                      `:xpath() pseudo-class should be the last in selector: '${selector}'`,
                    );
                  } // collecting arg for absolute pseudo-class
                  // e.g. 'div:matches-css(width:400px)'
                  updateBufferNode(context, tokenValue);
                }
                if (isRelativePseudoClassNode(bufferNode)) {
                  if (!nextTokenValue) {
                    // e.g. 'div:has(:'
                    throw new Error(
                      `Invalid pseudo-class arg at the end of selector: '${selector}'`,
                    );
                  } // make it more obvious if selector starts with pseudo with no tag specified
                  // parser position is on colon inside :has() arg
                  // e.g. 'div:has(:contains(text))'
                  // or   'div:not(:empty)'
                  initRelativeSubtree(context, ASTERISK);
                  if (!isSupportedPseudoClass(nextTokenValue.toLowerCase())) {
                    // collect the colon to value of RegularSelector
                    // e.g. 'div:not(:empty)'
                    updateBufferNode(context, tokenValue); // parentheses should be balanced only for functional pseudo-classes
                    // e.g. '.yellow:not(:nth-child(3))'
                    if (nextToNextTokenValue === BRACKET.PARENTHESES.LEFT) {
                      context.standardPseudoNamesStack.push(nextTokenValue);
                    }
                  } else {
                    // add ExtendedSelector to Selector children
                    // e.g. 'div:has(:contains(text))'
                    upToClosest(context, NODE.SELECTOR);
                    addAstNodeByType(context, NODE.EXTENDED_SELECTOR);
                  }
                }
                break;
              case BRACKET.PARENTHESES.LEFT:
                // start of pseudo-class arg
                if (isAbsolutePseudoClassNode(bufferNode)) {
                  // no brackets balancing needed inside
                  // 1. :xpath() extended pseudo-class arg
                  // 2. regexp arg for other extended pseudo-classes
                  if (
                    getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER &&
                    context.isRegexpOpen
                  ) {
                    // if the parentheses is escaped it should be part of regexp
                    // collect it to arg of AbsolutePseudoClass
                    // e.g. 'div:matches-css(background-image: /^url\\("data:image\\/gif;base64.+/)'
                    updateBufferNode(context, tokenValue);
                  } else {
                    // otherwise brackets should be balanced
                    // e.g. 'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                    context.extendedPseudoBracketsStack.push(tokenValue); // eslint-disable-next-line max-len
                    if (
                      context.extendedPseudoBracketsStack.length >
                      context.extendedPseudoNamesStack.length
                    ) {
                      updateBufferNode(context, tokenValue);
                    }
                  }
                }
                if (isRegularSelectorNode(bufferNode)) {
                  // continue RegularSelector value collecting for standard pseudo-classes
                  // e.g. '.banner:where(div)'
                  if (context.standardPseudoNamesStack.length > 0) {
                    updateBufferNode(context, tokenValue);
                    context.standardPseudoBracketsStack.push(tokenValue);
                  } // parentheses inside attribute value should be part of RegularSelector value
                  // e.g. 'div:not([href*="window.print()"])'   <-- parser position
                  // is on the `(` after `print`       ↑
                  if (context.isAttributeBracketsOpen) {
                    updateBufferNode(context, tokenValue);
                  }
                }
                if (isRelativePseudoClassNode(bufferNode)) {
                  // save opening bracket for balancing
                  // e.g. 'div:not()'  // position is on `(`
                  context.extendedPseudoBracketsStack.push(tokenValue);
                }
                break;
              case BRACKET.PARENTHESES.RIGHT:
                if (isAbsolutePseudoClassNode(bufferNode)) {
                  // no brackets balancing needed inside
                  // 1. :xpath() extended pseudo-class arg
                  // 2. regexp arg for other extended pseudo-classes
                  if (
                    getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER &&
                    context.isRegexpOpen
                  ) {
                    // if closing bracket is part of regexp
                    // simply save it to pseudo-class arg
                    updateBufferNode(context, tokenValue);
                  } else {
                    // remove stacked open parentheses for brackets balance
                    // e.g. 'h3:contains((Ads))'
                    // or   'div:xpath(//h3[contains(text(),"Share it!")]/..)'
                    context.extendedPseudoBracketsStack.pop();
                    if (getNodeName(bufferNode) !== XPATH_PSEUDO_CLASS_MARKER) {
                      // for all other absolute pseudo-classes except :xpath()
                      // remove stacked name of extended pseudo-class
                      context.extendedPseudoNamesStack.pop(); // eslint-disable-next-line max-len
                      if (
                        context.extendedPseudoBracketsStack.length >
                        context.extendedPseudoNamesStack.length
                      ) {
                        // if brackets stack is not empty yet,
                        // save tokenValue to arg of AbsolutePseudoClass
                        // parser position on first closing bracket after 'Ads':
                        // e.g. 'h3:contains((Ads))'
                        updateBufferNode(context, tokenValue);
                      } else if (
                        context.extendedPseudoBracketsStack.length >= 0 &&
                        context.extendedPseudoNamesStack.length >= 0
                      ) {
                        // assume it is combined extended pseudo-classes
                        // parser position on first closing bracket after 'advert':
                        // e.g. 'div:has(.banner, :contains(advert))'
                        upToClosest(context, NODE.SELECTOR);
                      }
                    } else {
                      // for :xpath()
                      // eslint-disable-next-line max-len
                      if (
                        context.extendedPseudoBracketsStack.length <
                        context.extendedPseudoNamesStack.length
                      ) {
                        // remove stacked name of extended pseudo-class
                        // if there are less brackets than pseudo-class names
                        // with means last removes bracket was closing for pseudo-class
                        context.extendedPseudoNamesStack.pop();
                      } else {
                        // otherwise the bracket is part of arg
                        updateBufferNode(context, tokenValue);
                      }
                    }
                  }
                }
                if (isRegularSelectorNode(bufferNode)) {
                  if (context.isAttributeBracketsOpen) {
                    // parentheses inside attribute value should be part of RegularSelector value
                    // e.g. 'div:not([href*="window.print()"])'   <-- parser position
                    // is on the `)` after `print(`       ↑
                    updateBufferNode(context, tokenValue);
                  } else if (
                    context.standardPseudoNamesStack.length > 0 &&
                    context.standardPseudoBracketsStack.length > 0
                  ) {
                    // standard pseudo-class was processing.
                    // collect the closing bracket to value of RegularSelector
                    // parser position is on bracket after 'class' now:
                    // e.g. 'div:where(.class)'
                    updateBufferNode(context, tokenValue); // remove bracket and pseudo name from stacks
                    context.standardPseudoBracketsStack.pop();
                    const lastStandardPseudo =
                      context.standardPseudoNamesStack.pop();
                    if (!lastStandardPseudo) {
                      // standard pseudo should be in standardPseudoNamesStack
                      // as related to standardPseudoBracketsStack
                      throw new Error(
                        `Parsing error. Invalid selector: ${selector}`,
                      );
                    } // Disallow :has() after regular pseudo-elements
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c54 [3]
                    if (
                      Object.values(REGULAR_PSEUDO_ELEMENTS).includes(
                        lastStandardPseudo,
                      ) && // check token which is next to closing parentheses and token after it
                      // parser position is on bracket after 'foo' now:
                      // e.g. '::part(foo):has(.a)'
                      nextTokenValue === COLON &&
                      nextToNextTokenValue &&
                      HAS_PSEUDO_CLASS_MARKERS.includes(nextToNextTokenValue)
                    ) {
                      // eslint-disable-next-line max-len
                      throw new Error(
                        `Usage of :${nextToNextTokenValue}() pseudo-class is not allowed after any regular pseudo-element: '${lastStandardPseudo}'`,
                      );
                    }
                  } else {
                    // extended pseudo-class was processing.
                    // e.g. 'div:has(h3)'
                    // remove bracket and pseudo name from stacks
                    context.extendedPseudoBracketsStack.pop();
                    context.extendedPseudoNamesStack.pop();
                    upToClosest(context, NODE.EXTENDED_SELECTOR); // go to upper selector for possible selector continuation after extended pseudo-class
                    // e.g. 'div:has(h3) > img'
                    upToClosest(context, NODE.SELECTOR);
                  }
                }
                if (isSelectorNode(bufferNode)) {
                  // after inner extended pseudo-class bufferNode is Selector.
                  // parser position is on last bracket now:
                  // e.g. 'div:has(.banner, :contains(ads))'
                  context.extendedPseudoBracketsStack.pop();
                  context.extendedPseudoNamesStack.pop();
                  upToClosest(context, NODE.EXTENDED_SELECTOR);
                  upToClosest(context, NODE.SELECTOR);
                }
                if (isRelativePseudoClassNode(bufferNode)) {
                  // save opening bracket for balancing
                  // e.g. 'div:not()'  // position is on `)`
                  // context.extendedPseudoBracketsStack.push(tokenValue);
                  if (
                    context.extendedPseudoNamesStack.length > 0 &&
                    context.extendedPseudoBracketsStack.length > 0
                  ) {
                    context.extendedPseudoBracketsStack.pop();
                    context.extendedPseudoNamesStack.pop();
                  }
                }
                break;
              case LINE_FEED:
              case FORM_FEED:
              case CARRIAGE_RETURN:
                // such characters at start and end of selector should be trimmed
                // so is there is one them among tokens, it is not valid selector
                throw new Error(`'${selector}' is not a valid selector`);
              case TAB:
                // allow tab only inside attribute value
                // as there are such valid rules in filter lists
                // e.g. 'div[style^="margin-right: auto;	text-align: left;',
                // parser position                      ↑
                if (
                  isRegularSelectorNode(bufferNode) &&
                  context.isAttributeBracketsOpen
                ) {
                  updateBufferNode(context, tokenValue);
                } else {
                  // otherwise not valid
                  throw new Error(`'${selector}' is not a valid selector`);
                }
            }
            break;
          // no default statement for Marks as they are limited to SUPPORTED_SELECTOR_MARKS
          // and all other symbol combinations are tokenized as Word
          // so error for invalid Word will be thrown later while element selecting by parsed ast
          default:
            throw new Error(`Unknown type of token: '${tokenValue}'`);
        }
        i += 1;
      }
      if (context.ast === null) {
        throw new Error(`'${selector}' is not a valid selector`);
      }
      if (
        context.extendedPseudoNamesStack.length > 0 ||
        context.extendedPseudoBracketsStack.length > 0
      ) {
        // eslint-disable-next-line max-len
        throw new Error(
          `Unbalanced brackets for extended pseudo-class: '${getLast(context.extendedPseudoNamesStack)}'`,
        );
      }
      if (context.isAttributeBracketsOpen) {
        throw new Error(
          `Unbalanced attribute brackets in selector: '${selector}'`,
        );
      }
      return context.shouldOptimize ? optimizeAst(context.ast) : context.ast;
    };
    const natives = {
      MutationObserver:
        window.MutationObserver || window.WebKitMutationObserver,
    };
    /**
     * Class NativeTextContent is needed to intercept and save the native Node textContent getter
     * for proper work of :contains() pseudo-class as it may be mocked.
     *
     * @see {@link https://github.com/AdguardTeam/ExtendedCss/issues/127}
     */
    class NativeTextContent {
      /**
       * Native Node.
       */
      /**
       * Native Node textContent getter.
       */
      /**
       * Stores native node.
       */
      constructor() {
        this.nativeNode = window.Node || Node;
      }
      /**
       * Sets native Node textContext getter to `getter` class field.
       */
      setGetter() {
        var _Object$getOwnPropert;
        this.getter =
          (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(
            this.nativeNode.prototype,
            "textContent",
          )) === null || _Object$getOwnPropert === void 0
            ? void 0
            : _Object$getOwnPropert.get;
      }
    }
    const nativeTextContent = new NativeTextContent();
    /**
     * Returns textContent of passed domElement.
     *
     * @param domElement DOM element.
     *
     * @returns DOM element textContent.
     */
    const getNodeTextContent = (domElement) => {
      if (nativeTextContent.getter) {
        return nativeTextContent.getter.apply(domElement);
      } // if ExtendedCss.init() has not been executed and there is no nodeTextContentGetter,
      // use simple approach, especially when init() is not really needed, e.g. local tests
      return domElement.textContent || "";
    };
    /**
     * Returns element selector text based on it's tagName and attributes.
     *
     * @param element DOM element.
     *
     * @returns String representation of `element`.
     */
    const getElementSelectorDesc = (element) => {
      let selectorText = element.tagName.toLowerCase();
      selectorText += Array.from(element.attributes)
        .map((attr) => {
          return `[${attr.name}="${element.getAttribute(attr.name)}"]`;
        })
        .join("");
      return selectorText;
    };
    /**
     * Returns path to a DOM element as a selector string.
     *
     * @param inputEl Input element.
     *
     * @returns String path to a DOM element.
     * @throws An error if `inputEl` in not instance of `Element`.
     */
    const getElementSelectorPath = (inputEl) => {
      if (!(inputEl instanceof Element)) {
        throw new Error("Function received argument with wrong type");
      }
      let el;
      el = inputEl;
      const path = []; // we need to check '!!el' first because it is possible
      // that some ancestor of the inputEl was removed before it
      while (!!el && el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.id && typeof el.id === "string") {
          selector += `#${el.id}`;
          path.unshift(selector);
          break;
        }
        let sibling = el;
        let nth = 1;
        while (sibling.previousElementSibling) {
          sibling = sibling.previousElementSibling;
          if (
            sibling.nodeType === Node.ELEMENT_NODE &&
            sibling.nodeName.toLowerCase() === selector
          ) {
            nth += 1;
          }
        }
        if (nth !== 1) {
          selector += `:nth-of-type(${nth})`;
        }
        path.unshift(selector);
        el = el.parentElement;
      }
      return path.join(" > ");
    };
    /**
     * Checks whether the element is instance of HTMLElement.
     *
     * @param element Element to check.
     *
     * @returns True if `element` is HTMLElement.
     */
    const isHtmlElement = (element) => {
      return element instanceof HTMLElement;
    };
    /**
     * Takes `element` and returns its parent element.
     *
     * @param element Element.
     * @param errorMessage Optional error message to throw.
     *
     * @returns Parent of `element`.
     * @throws An error if element has no parent element.
     */
    const getParent = (element, errorMessage) => {
      const { parentElement } = element;
      if (!parentElement) {
        throw new Error(errorMessage || "Element does no have parent element");
      }
      return parentElement;
    };
    /**
     * Checks whether the `error` has `message` property which type is string.
     *
     * @param error Error object.
     *
     * @returns True if `error` has message.
     */
    const isErrorWithMessage = (error) => {
      return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      );
    };
    /**
     * Converts `maybeError` to error object with message.
     *
     * @param maybeError Possible error.
     *
     * @returns Error object with defined `message` property.
     */
    const toErrorWithMessage = (maybeError) => {
      if (isErrorWithMessage(maybeError)) {
        return maybeError;
      }
      try {
        return new Error(JSON.stringify(maybeError));
      } catch {
        // fallback in case if there is an error happened during the maybeError stringifying
        // like with circular references for example
        return new Error(String(maybeError));
      }
    };
    /**
     * Returns error message from `error`.
     * May be helpful to handle caught errors.
     *
     * @param error Error object.
     *
     * @returns Message of `error`.
     */
    const getErrorMessage = (error) => {
      return toErrorWithMessage(error).message;
    };
    const logger = {
      /**
       * Safe console.error version.
       */
      error:
        typeof console !== "undefined" && console.error && console.error.bind
          ? console.error.bind(window.console)
          : console.error,
      /**
       * Safe console.info version.
       */
      info:
        typeof console !== "undefined" && console.info && console.info.bind
          ? console.info.bind(window.console)
          : console.info,
    };
    /**
     * Returns string without suffix.
     *
     * @param str Input string.
     * @param suffix Needed to remove.
     *
     * @returns String without suffix.
     */
    const removeSuffix = (str, suffix) => {
      const index = str.indexOf(suffix, str.length - suffix.length);
      if (index >= 0) {
        return str.substring(0, index);
      }
      return str;
    };
    /**
     * Replaces all `pattern`s with `replacement` in `input` string.
     * String.replaceAll() polyfill because it is not supported by old browsers, e.g. Chrome 55.
     *
     * @see {@link https://caniuse.com/?search=String.replaceAll}
     *
     * @param input Input string to process.
     * @param pattern Find in the input string.
     * @param replacement Replace the pattern with.
     *
     * @returns Modified string.
     */
    const replaceAll = (input, pattern, replacement) => {
      if (!input) {
        return input;
      }
      return input.split(pattern).join(replacement);
    };
    /**
     * Converts string pattern to regular expression.
     *
     * @param str String to convert.
     *
     * @returns Regular expression converted from pattern `str`.
     */
    const toRegExp = (str) => {
      if (str.startsWith(SLASH) && str.endsWith(SLASH)) {
        return new RegExp(str.slice(1, -1));
      }
      const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(escaped);
    };
    /**
     * Converts any simple type value to string type,
     * e.g. `undefined` -> `'undefined'`.
     *
     * @param value Any type value.
     *
     * @returns String representation of `value`.
     */
    const convertTypeIntoString = (value) => {
      let output;
      switch (value) {
        case undefined:
          output = "undefined";
          break;
        case null:
          output = "null";
          break;
        default:
          output = value.toString();
      }
      return output;
    };
    /**
     * Converts instance of string value into other simple types,
     * e.g. `'null'` -> `null`, `'true'` -> `true`.
     *
     * @param value String-type value.
     *
     * @returns Its own type representation of string-type `value`.
     */
    const convertTypeFromString = (value) => {
      const numValue = Number(value);
      let output;
      if (!Number.isNaN(numValue)) {
        output = numValue;
      } else {
        switch (value) {
          case "undefined":
            output = undefined;
            break;
          case "null":
            output = null;
            break;
          case "true":
            output = true;
            break;
          case "false":
            output = false;
            break;
          default:
            output = value;
        }
      }
      return output;
    };
    const SAFARI_USER_AGENT_REGEXP =
      /\sVersion\/(\d{2}\.\d)(.+\s|\s)(Safari)\//;
    const isSafariBrowser = SAFARI_USER_AGENT_REGEXP.test(navigator.userAgent);
    /**
     * Checks whether the browser userAgent is supported.
     *
     * @param userAgent User agent of browser.
     *
     * @returns False only for Internet Explorer.
     */
    const isUserAgentSupported = (userAgent) => {
      // do not support Internet Explorer
      if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
        return false;
      }
      return true;
    };
    /**
     * Checks whether the current browser is supported.
     *
     * @returns False for Internet Explorer, otherwise true.
     */
    const isBrowserSupported = () => {
      return isUserAgentSupported(navigator.userAgent);
    };
    /**
     * CSS_PROPERTY is needed for style values normalization.
     *
     * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
     * during ExtendedCss import into other libraries.
     */
    const CSS_PROPERTY = {
      BACKGROUND: "background",
      BACKGROUND_IMAGE: "background-image",
      CONTENT: "content",
      OPACITY: "opacity",
    };
    const REGEXP_ANY_SYMBOL = ".*";
    const REGEXP_WITH_FLAGS_REGEXP = /^\s*\/.*\/[gmisuy]*\s*$/;
    /**
     * Removes quotes for specified content value.
     *
     * For example, content style declaration with `::before` can be set as '-' (e.g. unordered list)
     * which displayed as simple dash `-` with no quotes.
     * But CSSStyleDeclaration.getPropertyValue('content') will return value
     * wrapped into quotes, e.g. '"-"', which should be removed
     * because filters maintainers does not use any quotes in real rules.
     *
     * @param str Input string.
     *
     * @returns String with no quotes for content value.
     */
    const removeContentQuotes = (str) => {
      return str.replace(/^(["'])([\s\S]*)\1$/, "$2");
    };
    /**
     * Adds quotes for specified background url value.
     *
     * If background-image is specified **without** quotes:
     * e.g. 'background: url(data:image/gif;base64,R0lGODlhAQA7)'.
     *
     * CSSStyleDeclaration.getPropertyValue('background-image') may return value **with** quotes:
     * e.g. 'background: url("data:image/gif;base64,R0lGODlhAQA7")'.
     *
     * So we add quotes for compatibility since filters maintainers might use quotes in real rules.
     *
     * @param str Input string.
     *
     * @returns String with unified quotes for background url value.
     */
    const addUrlPropertyQuotes = (str) => {
      if (!str.includes('url("')) {
        const re = /url\((.*?)\)/g;
        return str.replace(re, 'url("$1")');
      }
      return str;
    };
    /**
     * Adds quotes to url arg for consistent property value matching.
     */
    const addUrlQuotesTo = {
      regexpArg: (str) => {
        // e.g. /^url\\([a-z]{4}:[a-z]{5}/
        // or /^url\\(data\\:\\image\\/gif;base64.+/
        const re = /(\^)?url(\\)?\\\((\w|\[\w)/g;
        return str.replace(re, '$1url$2\\(\\"?$3');
      },
      noneRegexpArg: addUrlPropertyQuotes,
    };
    /**
     * Escapes regular expression string.
     *
     * @see {@link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp}
     *
     * @param str Input string.
     *
     * @returns Escaped regular expression string.
     */
    const escapeRegExp = (str) => {
      // should be escaped . * + ? ^ $ { } ( ) | [ ] / \
      // except of * | ^
      const specials = [
        ".",
        "+",
        "?",
        "$",
        "{",
        "}",
        "(",
        ")",
        "[",
        "]",
        "\\",
        "/",
      ];
      const specialsRegex = new RegExp(`[${specials.join("\\")}]`, "g");
      return str.replace(specialsRegex, "\\$&");
    };
    /**
     * Converts :matches-css() arg property value match to regexp.
     *
     * @param rawValue Style match value pattern.
     *
     * @returns Arg of :matches-css() converted to regular expression.
     */
    const convertStyleMatchValueToRegexp = (rawValue) => {
      let value;
      if (rawValue.startsWith(SLASH) && rawValue.endsWith(SLASH)) {
        // For regex patterns double quotes `"` and backslashes `\` should be escaped
        value = addUrlQuotesTo.regexpArg(rawValue);
        value = value.slice(1, -1);
      } else {
        // For non-regex patterns parentheses `(` `)` and square brackets `[` `]`
        // should be unescaped, because their escaping in filter rules is required
        value = addUrlQuotesTo.noneRegexpArg(rawValue);
        value = value.replace(/\\([\\()[\]"])/g, "$1");
        value = escapeRegExp(value); // e.g. div:matches-css(background-image: url(data:*))
        value = replaceAll(value, ASTERISK, REGEXP_ANY_SYMBOL);
      }
      return new RegExp(value, "i");
    };
    /**
     * Makes some properties values compatible.
     *
     * @param propertyName Name of style property.
     * @param propertyValue Value of style property.
     *
     * @returns Normalized values for some CSS properties.
     */
    const normalizePropertyValue = (propertyName, propertyValue) => {
      let normalized = "";
      switch (propertyName) {
        case CSS_PROPERTY.BACKGROUND:
        case CSS_PROPERTY.BACKGROUND_IMAGE:
          // sometimes url property does not have quotes
          // so we add them for consistent matching
          normalized = addUrlPropertyQuotes(propertyValue);
          break;
        case CSS_PROPERTY.CONTENT:
          normalized = removeContentQuotes(propertyValue);
          break;
        case CSS_PROPERTY.OPACITY:
          // https://bugs.webkit.org/show_bug.cgi?id=93445
          normalized = isSafariBrowser
            ? (Math.round(parseFloat(propertyValue) * 100) / 100).toString()
            : propertyValue;
          break;
        default:
          normalized = propertyValue;
      }
      return normalized;
    };
    /**
     * Returns domElement style property value
     * by css property name and standard pseudo-element.
     *
     * @param domElement DOM element.
     * @param propertyName CSS property name.
     * @param regularPseudoElement Standard pseudo-element — '::before', '::after' etc.
     *
     * @returns String containing the value of a specified CSS property.
     */
    const getComputedStylePropertyValue = (
      domElement,
      propertyName,
      regularPseudoElement,
    ) => {
      const style = window.getComputedStyle(domElement, regularPseudoElement);
      const propertyValue = style.getPropertyValue(propertyName);
      return normalizePropertyValue(propertyName, propertyValue);
    };
    /**
     * Parses arg of absolute pseudo-class into 'name' and 'value' if set.
     *
     * Used for :matches-css() - with COLON as separator,
     * for :matches-attr() and :matches-property() - with EQUAL_SIGN as separator.
     *
     * @param pseudoArg Arg of pseudo-class.
     * @param separator Divider symbol.
     *
     * @returns Parsed 'matches' pseudo-class arg data.
     */
    const getPseudoArgData = (pseudoArg, separator) => {
      const index = pseudoArg.indexOf(separator);
      let name;
      let value;
      if (index > -1) {
        name = pseudoArg.substring(0, index).trim();
        value = pseudoArg.substring(index + 1).trim();
      } else {
        name = pseudoArg;
      }
      return {
        name,
        value,
      };
    };
    /**
     * Parses :matches-css() pseudo-class arg
     * where regular pseudo-element can be a part of arg
     * e.g. 'div:matches-css(before, color: rgb(255, 255, 255))'    <-- obsolete `:matches-css-before()`.
     *
     * @param pseudoName Pseudo-class name.
     * @param rawArg Pseudo-class arg.
     *
     * @returns Parsed :matches-css() pseudo-class arg data.
     * @throws An error on invalid `rawArg`.
     */
    const parseStyleMatchArg = (pseudoName, rawArg) => {
      const { name, value } = getPseudoArgData(rawArg, COMMA);
      let regularPseudoElement = name;
      let styleMatchArg = value; // check whether the string part before the separator is valid regular pseudo-element,
      // otherwise `regularPseudoElement` is null, and `styleMatchArg` is rawArg
      if (!Object.values(REGULAR_PSEUDO_ELEMENTS).includes(name)) {
        regularPseudoElement = null;
        styleMatchArg = rawArg;
      }
      if (!styleMatchArg) {
        throw new Error(
          `Required style property argument part is missing in :${pseudoName}() arg: '${rawArg}'`,
        );
      } // if regularPseudoElement is not `null`
      if (regularPseudoElement) {
        // pseudo-element should have two colon marks for Window.getComputedStyle() due to the syntax:
        // https://www.w3.org/TR/selectors-4/#pseudo-element-syntax
        // ':matches-css(before, content: ads)' ->> '::before'
        regularPseudoElement = `${COLON}${COLON}${regularPseudoElement}`;
      }
      return {
        regularPseudoElement,
        styleMatchArg,
      };
    };
    /**
   * Checks whether the domElement is matched by :matches-css() arg.
   *
   * @param argsData Pseudo-class name, arg, and dom element to check.
   *
   @returns True if DOM element is matched.
   * @throws An error on invalid pseudo-class arg.
   */
    const isStyleMatched = (argsData) => {
      const { pseudoName, pseudoArg, domElement } = argsData;
      const { regularPseudoElement, styleMatchArg } = parseStyleMatchArg(
        pseudoName,
        pseudoArg,
      );
      const { name: matchName, value: matchValue } = getPseudoArgData(
        styleMatchArg,
        COLON,
      );
      if (!matchName || !matchValue) {
        throw new Error(
          `Required property name or value is missing in :${pseudoName}() arg: '${styleMatchArg}'`,
        );
      }
      let valueRegexp;
      try {
        valueRegexp = convertStyleMatchValueToRegexp(matchValue);
      } catch (e) {
        logger.error(getErrorMessage(e));
        throw new Error(
          `Invalid argument of :${pseudoName}() pseudo-class: '${styleMatchArg}'`,
        );
      }
      const value = getComputedStylePropertyValue(
        domElement,
        matchName,
        regularPseudoElement,
      );
      return valueRegexp && valueRegexp.test(value);
    };
    /**
     * Validates string arg for :matches-attr() and :matches-property().
     *
     * @param arg Pseudo-class arg.
     *
     * @returns True if 'matches' pseudo-class string arg is valid.
     */
    const validateStrMatcherArg = (arg) => {
      if (arg.includes(SLASH)) {
        return false;
      }
      if (!/^[\w-]+$/.test(arg)) {
        return false;
      }
      return true;
    };
    /**
     * Returns valid arg for :matches-attr() and :matcher-property().
     *
     * @param rawArg Arg pattern.
     * @param [isWildcardAllowed=false] Flag for wildcard (`*`) using as pseudo-class arg.
     *
     * @returns Valid arg for :matches-attr() and :matcher-property().
     * @throws An error on invalid `rawArg`.
     */
    const getValidMatcherArg = function (rawArg) {
      let isWildcardAllowed =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : false;
      // if rawArg is missing for pseudo-class
      // e.g. :matches-attr()
      // error will be thrown before getValidMatcherArg() is called:
      // name or arg is missing in AbsolutePseudoClass
      let arg;
      if (
        rawArg.length > 1 &&
        rawArg.startsWith(DOUBLE_QUOTE) &&
        rawArg.endsWith(DOUBLE_QUOTE)
      ) {
        rawArg = rawArg.slice(1, -1);
      }
      if (rawArg === "") {
        // e.g. :matches-property("")
        throw new Error("Argument should be specified. Empty arg is invalid.");
      }
      if (rawArg.startsWith(SLASH) && rawArg.endsWith(SLASH)) {
        // e.g. :matches-property("//")
        if (rawArg.length > 2) {
          arg = toRegExp(rawArg);
        } else {
          throw new Error(`Invalid regexp: '${rawArg}'`);
        }
      } else if (rawArg.includes(ASTERISK)) {
        if (rawArg === ASTERISK && !isWildcardAllowed) {
          // e.g. :matches-attr(*)
          throw new Error(`Argument should be more specific than ${rawArg}`);
        }
        arg = replaceAll(rawArg, ASTERISK, REGEXP_ANY_SYMBOL);
        arg = new RegExp(arg);
      } else {
        if (!validateStrMatcherArg(rawArg)) {
          throw new Error(`Invalid argument: '${rawArg}'`);
        }
        arg = rawArg;
      }
      return arg;
    };
    /**
     * Parses pseudo-class argument and returns parsed data.
     *
     * @param pseudoName Extended pseudo-class name.
     * @param pseudoArg Extended pseudo-class argument.
     *
     * @returns Parsed pseudo-class argument data.
     * @throws An error if attribute name is missing in pseudo-class arg.
     */
    const getRawMatchingData = (pseudoName, pseudoArg) => {
      const { name: rawName, value: rawValue } = getPseudoArgData(
        pseudoArg,
        EQUAL_SIGN,
      );
      if (!rawName) {
        throw new Error(
          `Required attribute name is missing in :${pseudoName} arg: ${pseudoArg}`,
        );
      }
      return {
        rawName,
        rawValue,
      };
    };
    /**
   * Checks whether the domElement is matched by :matches-attr() arg.
   *
   * @param argsData Pseudo-class name, arg, and dom element to check.
   *
   @returns True if DOM element is matched.
   * @throws An error on invalid arg of pseudo-class.
   */
    const isAttributeMatched = (argsData) => {
      const { pseudoName, pseudoArg, domElement } = argsData;
      const elementAttributes = domElement.attributes; // no match if dom element has no attributes
      if (elementAttributes.length === 0) {
        return false;
      }
      const { rawName: rawAttrName, rawValue: rawAttrValue } =
        getRawMatchingData(pseudoName, pseudoArg);
      let attrNameMatch;
      try {
        attrNameMatch = getValidMatcherArg(rawAttrName);
      } catch (e) {
        const errorMessage = getErrorMessage(e);
        logger.error(errorMessage);
        throw new SyntaxError(errorMessage);
      }
      let isMatched = false;
      let i = 0;
      while (i < elementAttributes.length && !isMatched) {
        const attr = elementAttributes[i];
        if (!attr) {
          break;
        }
        const isNameMatched =
          attrNameMatch instanceof RegExp
            ? attrNameMatch.test(attr.name)
            : attrNameMatch === attr.name;
        if (!rawAttrValue) {
          // for rules with no attribute value specified
          // e.g. :matches-attr("/regex/") or :matches-attr("attr-name")
          isMatched = isNameMatched;
        } else {
          let attrValueMatch;
          try {
            attrValueMatch = getValidMatcherArg(rawAttrValue);
          } catch (e) {
            const errorMessage = getErrorMessage(e);
            logger.error(errorMessage);
            throw new SyntaxError(errorMessage);
          }
          const isValueMatched =
            attrValueMatch instanceof RegExp
              ? attrValueMatch.test(attr.value)
              : attrValueMatch === attr.value;
          isMatched = isNameMatched && isValueMatched;
        }
        i += 1;
      }
      return isMatched;
    };
    /**
     * Parses raw :matches-property() arg which may be chain of properties.
     *
     * @param input Argument of :matches-property().
     *
     * @returns Arg of :matches-property() as array of strings or regular expressions.
     * @throws An error on invalid chain.
     */
    const parseRawPropChain = (input) => {
      if (
        input.length > 1 &&
        input.startsWith(DOUBLE_QUOTE) &&
        input.endsWith(DOUBLE_QUOTE)
      ) {
        input = input.slice(1, -1);
      }
      const chainChunks = input.split(DOT);
      const chainPatterns = [];
      let patternBuffer = "";
      let isRegexpPattern = false;
      let i = 0;
      while (i < chainChunks.length) {
        const chunk = getItemByIndex(
          chainChunks,
          i,
          `Invalid pseudo-class arg: '${input}'`,
        );
        if (
          chunk.startsWith(SLASH) &&
          chunk.endsWith(SLASH) &&
          chunk.length > 2
        ) {
          // regexp pattern with no dot in it, e.g. /propName/
          chainPatterns.push(chunk);
        } else if (chunk.startsWith(SLASH)) {
          // if chunk is a start of regexp pattern
          isRegexpPattern = true;
          patternBuffer += chunk;
        } else if (chunk.endsWith(SLASH)) {
          isRegexpPattern = false; // restore dot removed while splitting
          // e.g. testProp./.{1,5}/
          patternBuffer += `.${chunk}`;
          chainPatterns.push(patternBuffer);
          patternBuffer = "";
        } else {
          // if there are few dots in regexp pattern
          // so chunk might be in the middle of it
          if (isRegexpPattern) {
            patternBuffer += chunk;
          } else {
            // otherwise it is string pattern
            chainPatterns.push(chunk);
          }
        }
        i += 1;
      }
      if (patternBuffer.length > 0) {
        throw new Error(`Invalid regexp property pattern '${input}'`);
      }
      const chainMatchPatterns = chainPatterns.map((pattern) => {
        if (pattern.length === 0) {
          // e.g. '.prop.id' or 'nested..test'
          throw new Error(
            `Empty pattern '${pattern}' is invalid in chain '${input}'`,
          );
        }
        let validPattern;
        try {
          validPattern = getValidMatcherArg(pattern, true);
        } catch (e) {
          logger.error(getErrorMessage(e));
          throw new Error(
            `Invalid property pattern '${pattern}' in property chain '${input}'`,
          );
        }
        return validPattern;
      });
      return chainMatchPatterns;
    };
    /**
     * Checks if the property exists in the base object (recursively).
     *
     * @param base Element to check.
     * @param chain Array of objects - parsed string property chain.
     * @param [output=[]] Result acc.
     *
     * @returns Array of parsed data — representation of `base`-related `chain`.
     */
    const filterRootsByRegexpChain = function (base, chain) {
      let output =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      const tempProp = getFirst(chain);
      if (chain.length === 1) {
        let key;
        for (key in base) {
          if (tempProp instanceof RegExp) {
            if (tempProp.test(key)) {
              output.push({
                base,
                prop: key,
                value: base[key],
              });
            }
          } else if (tempProp === key) {
            output.push({
              base,
              prop: tempProp,
              value: base[key],
            });
          }
        }
        return output;
      } // if there is a regexp prop in input chain
      // e.g. 'unit./^ad.+/.src' for 'unit.ad-1gf2.src unit.ad-fgd34.src'),
      // every base keys should be tested by regexp and it can be more that one results
      if (tempProp instanceof RegExp) {
        const nextProp = chain.slice(1);
        const baseKeys = [];
        for (const key in base) {
          if (tempProp.test(key)) {
            baseKeys.push(key);
          }
        }
        baseKeys.forEach((key) => {
          var _Object$getOwnPropert;
          const item =
            (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(
              base,
              key,
            )) === null || _Object$getOwnPropert === void 0
              ? void 0
              : _Object$getOwnPropert.value;
          filterRootsByRegexpChain(item, nextProp, output);
        });
      }
      if (base && typeof tempProp === "string") {
        var _Object$getOwnPropert2;
        const nextBase =
          (_Object$getOwnPropert2 = Object.getOwnPropertyDescriptor(
            base,
            tempProp,
          )) === null || _Object$getOwnPropert2 === void 0
            ? void 0
            : _Object$getOwnPropert2.value;
        chain = chain.slice(1);
        if (nextBase !== undefined) {
          filterRootsByRegexpChain(nextBase, chain, output);
        }
      }
      return output;
    };
    /**
   * Checks whether the domElement is matched by :matches-property() arg.
   *
   * @param argsData Pseudo-class name, arg, and dom element to check.
   *
   @returns True if DOM element is matched.
   * @throws An error on invalid prop in chain.
   */
    const isPropertyMatched = (argsData) => {
      const { pseudoName, pseudoArg, domElement } = argsData;
      const { rawName: rawPropertyName, rawValue: rawPropertyValue } =
        getRawMatchingData(pseudoName, pseudoArg); // chained property name cannot include '/' or '.'
      // so regex prop names with such escaped characters are invalid
      if (rawPropertyName.includes("\\/") || rawPropertyName.includes("\\.")) {
        throw new Error(
          `Invalid :${pseudoName} name pattern: ${rawPropertyName}`,
        );
      }
      let propChainMatches;
      try {
        propChainMatches = parseRawPropChain(rawPropertyName);
      } catch (e) {
        const errorMessage = getErrorMessage(e);
        logger.error(errorMessage);
        throw new SyntaxError(errorMessage);
      }
      const ownerObjArr = filterRootsByRegexpChain(
        domElement,
        propChainMatches,
      );
      if (ownerObjArr.length === 0) {
        return false;
      }
      let isMatched = true;
      if (rawPropertyValue) {
        let propValueMatch;
        try {
          propValueMatch = getValidMatcherArg(rawPropertyValue);
        } catch (e) {
          const errorMessage = getErrorMessage(e);
          logger.error(errorMessage);
          throw new SyntaxError(errorMessage);
        }
        if (propValueMatch) {
          for (let i = 0; i < ownerObjArr.length; i += 1) {
            var _ownerObjArr$i;
            const realValue =
              (_ownerObjArr$i = ownerObjArr[i]) === null ||
              _ownerObjArr$i === void 0
                ? void 0
                : _ownerObjArr$i.value;
            if (propValueMatch instanceof RegExp) {
              isMatched = propValueMatch.test(convertTypeIntoString(realValue));
            } else {
              // handle 'null' and 'undefined' property values set as string
              if (realValue === "null" || realValue === "undefined") {
                isMatched = propValueMatch === realValue;
                break;
              }
              isMatched = convertTypeFromString(propValueMatch) === realValue;
            }
            if (isMatched) {
              break;
            }
          }
        }
      }
      return isMatched;
    };
    /**
   * Checks whether the textContent is matched by :contains arg.
   *
   * @param argsData Pseudo-class name, arg, and dom element to check.
   *
   @returns True if DOM element is matched.
   * @throws An error on invalid arg of pseudo-class.
   */
    const isTextMatched = (argsData) => {
      const { pseudoName, pseudoArg, domElement } = argsData;
      const textContent = getNodeTextContent(domElement);
      let isTextContentMatched;
      let pseudoArgToMatch = pseudoArg;
      if (
        pseudoArgToMatch.startsWith(SLASH) &&
        REGEXP_WITH_FLAGS_REGEXP.test(pseudoArgToMatch)
      ) {
        // regexp arg
        const flagsIndex = pseudoArgToMatch.lastIndexOf("/");
        const flagsStr = pseudoArgToMatch.substring(flagsIndex + 1);
        pseudoArgToMatch = pseudoArgToMatch
          .substring(0, flagsIndex + 1)
          .slice(1, -1)
          .replace(/\\([\\"])/g, "$1");
        let regex;
        try {
          regex = new RegExp(pseudoArgToMatch, flagsStr);
        } catch (e) {
          throw new Error(
            `Invalid argument of :${pseudoName}() pseudo-class: ${pseudoArg}`,
          );
        }
        isTextContentMatched = regex.test(textContent);
      } else {
        // none-regexp arg
        pseudoArgToMatch = pseudoArgToMatch.replace(/\\([\\()[\]"])/g, "$1");
        isTextContentMatched = textContent.includes(pseudoArgToMatch);
      }
      return isTextContentMatched;
    };
    /**
     * Validates number arg for :nth-ancestor() and :upward() pseudo-classes.
     *
     * @param rawArg Raw arg of pseudo-class.
     * @param pseudoName Pseudo-class name.
     *
     * @returns Valid number arg for :nth-ancestor() and :upward().
     * @throws An error on invalid `rawArg`.
     */
    const getValidNumberAncestorArg = (rawArg, pseudoName) => {
      const deep = Number(rawArg);
      if (Number.isNaN(deep) || deep < 1 || deep >= 256) {
        throw new Error(
          `Invalid argument of :${pseudoName} pseudo-class: '${rawArg}'`,
        );
      }
      return deep;
    };
    /**
     * Returns nth ancestor by 'deep' number arg OR undefined if ancestor range limit exceeded.
     *
     * @param domElement DOM element to find ancestor for.
     * @param nth Depth up to needed ancestor.
     * @param pseudoName Pseudo-class name.
     *
     * @returns Ancestor element found in DOM, or null if not found.
     * @throws An error on invalid `nth` arg.
     */
    const getNthAncestor = (domElement, nth, pseudoName) => {
      let ancestor = null;
      let i = 0;
      while (i < nth) {
        ancestor = domElement.parentElement;
        if (!ancestor) {
          throw new Error(
            `Out of DOM: Argument of :${pseudoName}() pseudo-class is too big — '${nth}'.`,
          );
        }
        domElement = ancestor;
        i += 1;
      }
      return ancestor;
    };
    /**
     * Validates standard CSS selector.
     *
     * @param selector Standard selector.
     *
     * @returns True if standard CSS selector is valid.
     */
    const validateStandardSelector = (selector) => {
      let isValid;
      try {
        document.querySelectorAll(selector);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      return isValid;
    };
    /**
     * Wrapper to run matcher `callback` with `args`
     * and throw error with `errorMessage` if `callback` run fails.
     *
     * @param callback Matcher callback.
     * @param argsData Args needed for matcher callback.
     * @param errorMessage Error message.
     *
     * @returns True if `callback` returns true.
     * @throws An error if `callback` fails.
     */
    const matcherWrapper = (callback, argsData, errorMessage) => {
      let isMatched;
      try {
        isMatched = callback(argsData);
      } catch (e) {
        logger.error(getErrorMessage(e));
        throw new Error(errorMessage);
      }
      return isMatched;
    };
    /**
     * Generates common error message to throw while matching element `propDesc`.
     *
     * @param propDesc Text to describe what element 'prop' pseudo-class is trying to match.
     * @param pseudoName Pseudo-class name.
     * @param pseudoArg Pseudo-class arg.
     *
     * @returns Generated error message string.
     */
    const getAbsolutePseudoError = (propDesc, pseudoName, pseudoArg) => {
      // eslint-disable-next-line max-len
      return `${MATCHING_ELEMENT_ERROR_PREFIX} ${propDesc}, may be invalid :${pseudoName}() pseudo-class arg: '${pseudoArg}'`;
    };
    /**
     * Checks whether the domElement is matched by absolute extended pseudo-class argument.
     *
     * @param domElement Page element.
     * @param pseudoName Pseudo-class name.
     * @param pseudoArg Pseudo-class arg.
     *
     * @returns True if `domElement` is matched by absolute pseudo-class.
     * @throws An error on unknown absolute pseudo-class.
     */
    const isMatchedByAbsolutePseudo = (domElement, pseudoName, pseudoArg) => {
      let argsData;
      let errorMessage;
      let callback;
      switch (pseudoName) {
        case CONTAINS_PSEUDO:
        case HAS_TEXT_PSEUDO:
        case ABP_CONTAINS_PSEUDO:
          callback = isTextMatched;
          argsData = {
            pseudoName,
            pseudoArg,
            domElement,
          };
          errorMessage = getAbsolutePseudoError(
            "text content",
            pseudoName,
            pseudoArg,
          );
          break;
        case MATCHES_CSS_PSEUDO:
        case MATCHES_CSS_AFTER_PSEUDO:
        case MATCHES_CSS_BEFORE_PSEUDO:
          callback = isStyleMatched;
          argsData = {
            pseudoName,
            pseudoArg,
            domElement,
          };
          errorMessage = getAbsolutePseudoError("style", pseudoName, pseudoArg);
          break;
        case MATCHES_ATTR_PSEUDO_CLASS_MARKER:
          callback = isAttributeMatched;
          argsData = {
            domElement,
            pseudoName,
            pseudoArg,
          };
          errorMessage = getAbsolutePseudoError(
            "attributes",
            pseudoName,
            pseudoArg,
          );
          break;
        case MATCHES_PROPERTY_PSEUDO_CLASS_MARKER:
          callback = isPropertyMatched;
          argsData = {
            domElement,
            pseudoName,
            pseudoArg,
          };
          errorMessage = getAbsolutePseudoError(
            "properties",
            pseudoName,
            pseudoArg,
          );
          break;
        default:
          throw new Error(`Unknown absolute pseudo-class :${pseudoName}()`);
      }
      return matcherWrapper(callback, argsData, errorMessage);
    };
    const findByAbsolutePseudoPseudo = {
      /**
       * Returns list of nth ancestors relative to every dom node from domElements list.
       *
       * @param domElements DOM elements.
       * @param rawPseudoArg Number arg of :nth-ancestor() or :upward() pseudo-class.
       * @param pseudoName Pseudo-class name.
       *
       * @returns Array of ancestor DOM elements.
       */
      nthAncestor: (domElements, rawPseudoArg, pseudoName) => {
        const deep = getValidNumberAncestorArg(rawPseudoArg, pseudoName);
        const ancestors = domElements
          .map((domElement) => {
            let ancestor = null;
            try {
              ancestor = getNthAncestor(domElement, deep, pseudoName);
            } catch (e) {
              logger.error(getErrorMessage(e));
            }
            return ancestor;
          })
          .filter(isHtmlElement);
        return ancestors;
      },
      /**
       * Returns list of elements by xpath expression, evaluated on every dom node from domElements list.
       *
       * @param domElements DOM elements.
       * @param rawPseudoArg Arg of :xpath() pseudo-class.
       *
       * @returns Array of DOM elements matched by xpath expression.
       */
      xpath: (domElements, rawPseudoArg) => {
        const foundElements = domElements.map((domElement) => {
          const result = [];
          let xpathResult;
          try {
            xpathResult = document.evaluate(
              rawPseudoArg,
              domElement,
              null,
              window.XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
              null,
            );
          } catch (e) {
            logger.error(getErrorMessage(e));
            throw new Error(
              `Invalid argument of :xpath() pseudo-class: '${rawPseudoArg}'`,
            );
          }
          let node = xpathResult.iterateNext();
          while (node) {
            if (isHtmlElement(node)) {
              result.push(node);
            }
            node = xpathResult.iterateNext();
          }
          return result;
        });
        return flatten(foundElements);
      },
      /**
       * Returns list of closest ancestors relative to every dom node from domElements list.
       *
       * @param domElements DOM elements.
       * @param rawPseudoArg Standard selector arg of :upward() pseudo-class.
       *
       * @returns Array of closest ancestor DOM elements.
       * @throws An error if `rawPseudoArg` is not a valid standard selector.
       */
      upward: (domElements, rawPseudoArg) => {
        if (!validateStandardSelector(rawPseudoArg)) {
          throw new Error(
            `Invalid argument of :upward pseudo-class: '${rawPseudoArg}'`,
          );
        }
        const closestAncestors = domElements
          .map((domElement) => {
            // closest to parent element should be found
            // otherwise `.base:upward(.base)` will return itself too, not only ancestor
            const parent = domElement.parentElement;
            if (!parent) {
              return null;
            }
            return parent.closest(rawPseudoArg);
          })
          .filter(isHtmlElement);
        return closestAncestors;
      },
    };
    /**
     * Calculated selector text which is needed to :has(), :is() and :not() pseudo-classes.
     * Contains calculated part (depends on the processed element)
     * and value of RegularSelector which is next to selector by.
     *
     * Native Document.querySelectorAll() does not select exact descendant elements
     * but match all page elements satisfying the selector,
     * so extra specification is needed for proper descendants selection
     * e.g. 'div:has(> img)'.
     *
     * Its calculation depends on extended selector.
     */
    /**
     * Combined `:scope` pseudo-class and **child** combinator — `:scope>`.
     */
    const scopeDirectChildren = `${SCOPE_CSS_PSEUDO_CLASS}${CHILD_COMBINATOR}`;
    /**
     * Combined `:scope` pseudo-class and **descendant** combinator — `:scope `.
     */
    const scopeAnyChildren = `${SCOPE_CSS_PSEUDO_CLASS}${DESCENDANT_COMBINATOR}`;
    /**
     * Type for relative pseudo-class helpers args.
     */
    /**
     * Returns the first of RegularSelector child node for `selectorNode`.
     *
     * @param selectorNode Ast Selector node.
     * @param pseudoName Name of relative pseudo-class.
     *
     * @returns Ast RegularSelector node.
     */
    const getFirstInnerRegularChild = (selectorNode, pseudoName) => {
      return getFirstRegularChild(
        selectorNode.children,
        `RegularSelector is missing for :${pseudoName}() pseudo-class`,
      );
    }; // TODO: fix for <forgiving-relative-selector-list>
    // https://github.com/AdguardTeam/ExtendedCss/issues/154
    /**
     * Checks whether the element has all relative elements specified by pseudo-class arg.
     * Used for :has() pseudo-class.
     *
     * @param argsData Relative pseudo-class helpers args data.
     *
     * @returns True if **all selectors** from argsData.relativeSelectorList is **matched** for argsData.element.
     */
    const hasRelativesBySelectorList = (argsData) => {
      const { element, relativeSelectorList, pseudoName } = argsData;
      return relativeSelectorList.children // Array.every() is used here as each Selector node from SelectorList should exist on page
        .every((selectorNode) => {
          // selectorList.children always starts with regular selector as any selector generally
          const relativeRegularSelector = getFirstInnerRegularChild(
            selectorNode,
            pseudoName,
          );
          let specifiedSelector = "";
          let rootElement = null;
          const regularSelector = getNodeValue(relativeRegularSelector);
          if (
            regularSelector.startsWith(NEXT_SIBLING_COMBINATOR) ||
            regularSelector.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)
          ) {
            /**
             * For matching the element by "element:has(+ next-sibling)" and "element:has(~ sibling)"
             * we check whether the element's parentElement has specific direct child combination,
             * e.g. 'h1:has(+ .share)' -> `h1Node.parentElement.querySelectorAll(':scope > h1 + .share')`.
             *
             * @see {@link https://www.w3.org/TR/selectors-4/#relational}
             */
            rootElement = element.parentElement;
            const elementSelectorText = getElementSelectorDesc(element);
            specifiedSelector = `${scopeDirectChildren}${elementSelectorText}${regularSelector}`;
          } else if (regularSelector === ASTERISK) {
            /**
             * :scope specification is needed for proper descendants selection
             * as native element.querySelectorAll() does not select exact element descendants
             * e.g. 'a:has(> img)' -> `aNode.querySelectorAll(':scope > img')`.
             *
             * For 'any selector' as arg of relative simplicity should be set for all inner elements
             * e.g. 'div:has(*)' -> `divNode.querySelectorAll(':scope *')`
             * which means empty div with no child element.
             */
            rootElement = element;
            specifiedSelector = `${scopeAnyChildren}${ASTERISK}`;
          } else {
            /**
             * As it described above, inner elements should be found using `:scope` pseudo-class
             * e.g. 'a:has(> img)' -> `aNode.querySelectorAll(':scope > img')`
             * OR '.block(div > span)' -> `blockClassNode.querySelectorAll(':scope div > span')`.
             */
            specifiedSelector = `${scopeAnyChildren}${regularSelector}`;
            rootElement = element;
          }
          if (!rootElement) {
            throw new Error(
              `Selection by :${pseudoName}() pseudo-class is not possible`,
            );
          }
          let relativeElements;
          try {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            relativeElements = getElementsForSelectorNode(
              selectorNode,
              rootElement,
              specifiedSelector,
            );
          } catch (e) {
            logger.error(getErrorMessage(e)); // fail for invalid selector
            throw new Error(
              `Invalid selector for :${pseudoName}() pseudo-class: '${regularSelector}'`,
            );
          }
          return relativeElements.length > 0;
        });
    };
    /**
     * Checks whether the element is an any element specified by pseudo-class arg.
     * Used for :is() pseudo-class.
     *
     * @param argsData Relative pseudo-class helpers args data.
     *
     * @returns True if **any selector** from argsData.relativeSelectorList is **matched** for argsData.element.
     */
    const isAnyElementBySelectorList = (argsData) => {
      const { element, relativeSelectorList, pseudoName } = argsData;
      return relativeSelectorList.children // Array.some() is used here as any selector from selector list should exist on page
        .some((selectorNode) => {
          // selectorList.children always starts with regular selector
          const relativeRegularSelector = getFirstInnerRegularChild(
            selectorNode,
            pseudoName,
          );
          /**
           * For checking the element by 'div:is(.banner)'
           * we check whether the element's parentElement has any specific direct child.
           */
          const rootElement = getParent(
            element,
            `Selection by :${pseudoName}() pseudo-class is not possible`,
          );
          /**
           * So we calculate the element "description" by it's tagname and attributes for targeting
           * and use it to specify the selection
           * e.g. `div:is(.banner)` --> `divNode.parentElement.querySelectorAll(':scope > .banner')`.
           */
          const specifiedSelector = `${scopeDirectChildren}${getNodeValue(relativeRegularSelector)}`;
          let anyElements;
          try {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            anyElements = getElementsForSelectorNode(
              selectorNode,
              rootElement,
              specifiedSelector,
            );
          } catch (e) {
            // do not fail on invalid selectors for :is()
            return false;
          } // TODO: figure out how to handle complex selectors with extended pseudo-classes
          // (check readme - extended-css-is-limitations)
          // because `element` and `anyElements` may be from different DOM levels
          return anyElements.includes(element);
        });
    };
    /**
     * Checks whether the element is not an element specified by pseudo-class arg.
     * Used for :not() pseudo-class.
     *
     * @param argsData Relative pseudo-class helpers args data.
     *
     * @returns True if **any selector** from argsData.relativeSelectorList is **not matched** for argsData.element.
     */
    const notElementBySelectorList = (argsData) => {
      const { element, relativeSelectorList, pseudoName } = argsData;
      return relativeSelectorList.children // Array.every() is used here as element should not be selected by any selector from selector list
        .every((selectorNode) => {
          // selectorList.children always starts with regular selector
          const relativeRegularSelector = getFirstInnerRegularChild(
            selectorNode,
            pseudoName,
          );
          /**
           * For checking the element by 'div:not([data="content"])
           * we check whether the element's parentElement has any specific direct child.
           */
          const rootElement = getParent(
            element,
            `Selection by :${pseudoName}() pseudo-class is not possible`,
          );
          /**
           * So we calculate the element "description" by it's tagname and attributes for targeting
           * and use it to specify the selection
           * e.g. `div:not(.banner)` --> `divNode.parentElement.querySelectorAll(':scope > .banner')`.
           */
          const specifiedSelector = `${scopeDirectChildren}${getNodeValue(relativeRegularSelector)}`;
          let anyElements;
          try {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            anyElements = getElementsForSelectorNode(
              selectorNode,
              rootElement,
              specifiedSelector,
            );
          } catch (e) {
            // fail on invalid selectors for :not()
            logger.error(getErrorMessage(e)); // eslint-disable-next-line max-len
            throw new Error(
              `Invalid selector for :${pseudoName}() pseudo-class: '${getNodeValue(relativeRegularSelector)}'`,
            );
          } // TODO: figure out how to handle up-looking pseudo-classes inside :not()
          // (check readme - extended-css-not-limitations)
          // because `element` and `anyElements` may be from different DOM levels
          return !anyElements.includes(element);
        });
    };
    /**
     * Selects dom elements by value of RegularSelector.
     *
     * @param regularSelectorNode RegularSelector node.
     * @param root Root DOM element.
     * @param specifiedSelector @see {@link SpecifiedSelector}.
     *
     * @returns Array of DOM elements.
     * @throws An error if RegularSelector node value is an invalid selector.
     */
    const getByRegularSelector = (
      regularSelectorNode,
      root,
      specifiedSelector,
    ) => {
      const selectorText = specifiedSelector
        ? specifiedSelector
        : getNodeValue(regularSelectorNode);
      let selectedElements = [];
      try {
        selectedElements = Array.from(root.querySelectorAll(selectorText));
      } catch (e) {
        throw new Error(
          `Error: unable to select by '${selectorText}' — ${getErrorMessage(e)}`,
        );
      }
      return selectedElements;
    };
    /**
     * Returns list of dom elements filtered or selected by ExtendedSelector node.
     *
     * @param domElements Array of DOM elements.
     * @param extendedSelectorNode ExtendedSelector node.
     *
     * @returns Array of DOM elements.
     * @throws An error on unknown pseudo-class,
     * absent or invalid arg of extended pseudo-class, etc.
     */
    const getByExtendedSelector = (domElements, extendedSelectorNode) => {
      let foundElements = [];
      const extendedPseudoClassNode = getPseudoClassNode(extendedSelectorNode);
      const pseudoName = getNodeName(extendedPseudoClassNode);
      if (isAbsolutePseudoClass(pseudoName)) {
        // absolute extended pseudo-classes should have an argument
        const absolutePseudoArg = getNodeValue(
          extendedPseudoClassNode,
          `Missing arg for :${pseudoName}() pseudo-class`,
        );
        if (pseudoName === NTH_ANCESTOR_PSEUDO_CLASS_MARKER) {
          // :nth-ancestor()
          foundElements = findByAbsolutePseudoPseudo.nthAncestor(
            domElements,
            absolutePseudoArg,
            pseudoName,
          );
        } else if (pseudoName === XPATH_PSEUDO_CLASS_MARKER) {
          // :xpath()
          try {
            document.createExpression(absolutePseudoArg, null);
          } catch (e) {
            throw new Error(
              `Invalid argument of :${pseudoName}() pseudo-class: '${absolutePseudoArg}'`,
            );
          }
          foundElements = findByAbsolutePseudoPseudo.xpath(
            domElements,
            absolutePseudoArg,
          );
        } else if (pseudoName === UPWARD_PSEUDO_CLASS_MARKER) {
          // :upward()
          if (Number.isNaN(Number(absolutePseudoArg))) {
            // so arg is selector, not a number
            foundElements = findByAbsolutePseudoPseudo.upward(
              domElements,
              absolutePseudoArg,
            );
          } else {
            foundElements = findByAbsolutePseudoPseudo.nthAncestor(
              domElements,
              absolutePseudoArg,
              pseudoName,
            );
          }
        } else {
          // all other absolute extended pseudo-classes
          // e.g. contains, matches-attr, etc.
          foundElements = domElements.filter((element) => {
            return isMatchedByAbsolutePseudo(
              element,
              pseudoName,
              absolutePseudoArg,
            );
          });
        }
      } else if (isRelativePseudoClass(pseudoName)) {
        const relativeSelectorList = getRelativeSelectorListNode(
          extendedPseudoClassNode,
        );
        let relativePredicate;
        switch (pseudoName) {
          case HAS_PSEUDO_CLASS_MARKER:
          case ABP_HAS_PSEUDO_CLASS_MARKER:
            relativePredicate = (element) =>
              hasRelativesBySelectorList({
                element,
                relativeSelectorList,
                pseudoName,
              });
            break;
          case IS_PSEUDO_CLASS_MARKER:
            relativePredicate = (element) =>
              isAnyElementBySelectorList({
                element,
                relativeSelectorList,
                pseudoName,
              });
            break;
          case NOT_PSEUDO_CLASS_MARKER:
            relativePredicate = (element) =>
              notElementBySelectorList({
                element,
                relativeSelectorList,
                pseudoName,
              });
            break;
          default:
            throw new Error(`Unknown relative pseudo-class: '${pseudoName}'`);
        }
        foundElements = domElements.filter(relativePredicate);
      } else {
        // extra check is parser missed something
        throw new Error(`Unknown extended pseudo-class: '${pseudoName}'`);
      }
      return foundElements;
    };
    /**
     * Returns list of dom elements which is selected by RegularSelector value.
     *
     * @param domElements Array of DOM elements.
     * @param regularSelectorNode RegularSelector node.
     *
     * @returns Array of DOM elements.
     * @throws An error if RegularSelector has not value.
     */
    const getByFollowingRegularSelector = (
      domElements,
      regularSelectorNode,
    ) => {
      // array of arrays because of Array.map() later
      let foundElements = [];
      const value = getNodeValue(regularSelectorNode);
      if (value.startsWith(CHILD_COMBINATOR)) {
        // e.g. div:has(> img) > .banner
        foundElements = domElements.map((root) => {
          const specifiedSelector = `${SCOPE_CSS_PSEUDO_CLASS}${value}`;
          return getByRegularSelector(
            regularSelectorNode,
            root,
            specifiedSelector,
          );
        });
      } else if (
        value.startsWith(NEXT_SIBLING_COMBINATOR) ||
        value.startsWith(SUBSEQUENT_SIBLING_COMBINATOR)
      ) {
        // e.g. div:has(> img) + .banner
        // or   div:has(> img) ~ .banner
        foundElements = domElements.map((element) => {
          const rootElement = element.parentElement;
          if (!rootElement) {
            // do not throw error if there in no parent for element
            // e.g. '*:contains(text)' selects `html` which has no parentElement
            return [];
          }
          const elementSelectorText = getElementSelectorDesc(element);
          const specifiedSelector = `${scopeDirectChildren}${elementSelectorText}${value}`;
          const selected = getByRegularSelector(
            regularSelectorNode,
            rootElement,
            specifiedSelector,
          );
          return selected;
        });
      } else {
        // space-separated regular selector after extended one
        // e.g. div:has(> img) .banner
        foundElements = domElements.map((root) => {
          const specifiedSelector = `${scopeAnyChildren}${getNodeValue(regularSelectorNode)}`;
          return getByRegularSelector(
            regularSelectorNode,
            root,
            specifiedSelector,
          );
        });
      } // foundElements should be flattened
      // as getByRegularSelector() returns elements array, and Array.map() collects them to array
      return flatten(foundElements);
    };
    /**
     * Returns elements nodes for Selector node.
     * As far as any selector always starts with regular part,
     * it selects by RegularSelector first and checks found elements later.
     *
     * Relative pseudo-classes has it's own subtree so getElementsForSelectorNode is called recursively.
     *
     * 'specifiedSelector' is needed for :has(), :is(), and :not() pseudo-classes
     * as native querySelectorAll() does not select exact element descendants even if it is called on 'div'
     * e.g. ':scope' specification is needed for proper descendants selection for 'div:has(> img)'.
     * So we check `divNode.querySelectorAll(':scope > img').length > 0`.
     *
     * @param selectorNode Selector node.
     * @param root Root DOM element.
     * @param specifiedSelector Needed element specification.
     *
     * @returns Array of DOM elements.
     * @throws An error if there is no selectorNodeChild.
     */
    const getElementsForSelectorNode = (
      selectorNode,
      root,
      specifiedSelector,
    ) => {
      let selectedElements = [];
      let i = 0;
      while (i < selectorNode.children.length) {
        const selectorNodeChild = getItemByIndex(
          selectorNode.children,
          i,
          "selectorNodeChild should be specified",
        );
        if (i === 0) {
          // any selector always starts with regular selector
          selectedElements = getByRegularSelector(
            selectorNodeChild,
            root,
            specifiedSelector,
          );
        } else if (isExtendedSelectorNode(selectorNodeChild)) {
          // filter previously selected elements by next selector nodes
          selectedElements = getByExtendedSelector(
            selectedElements,
            selectorNodeChild,
          );
        } else if (isRegularSelectorNode(selectorNodeChild)) {
          selectedElements = getByFollowingRegularSelector(
            selectedElements,
            selectorNodeChild,
          );
        }
        i += 1;
      }
      return selectedElements;
    };
    /**
     * Selects elements by ast.
     *
     * @param ast Ast of parsed selector.
     * @param doc Document.
     *
     * @returns Array of DOM elements.
     */
    const selectElementsByAst = function (ast) {
      let doc =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : document;
      const selectedElements = []; // ast root is SelectorList node;
      // it has Selector nodes as children which should be processed separately
      ast.children.forEach((selectorNode) => {
        selectedElements.push(...getElementsForSelectorNode(selectorNode, doc));
      }); // selectedElements should be flattened as it is array of arrays with elements
      const uniqueElements = [...new Set(flatten(selectedElements))];
      return uniqueElements;
    };
    /**
     * Class of ExtCssDocument is needed for caching.
     * For making cache related to each new instance of class, not global.
     */
    class ExtCssDocument {
      /**
       * Cache with selectors and their AST parsing results.
       */
      /**
       * Creates new ExtCssDocument and inits new `astCache`.
       */
      constructor() {
        this.astCache = new Map();
      }
      /**
       * Saves selector and it's ast to cache.
       *
       * @param selector Standard or extended selector.
       * @param ast Selector ast.
       */
      saveAstToCache(selector, ast) {
        this.astCache.set(selector, ast);
      }
      /**
       * Returns ast from cache for given selector.
       *
       * @param selector Standard or extended selector.
       *
       * @returns Previously parsed ast found in cache, or null if not found.
       */
      getAstFromCache(selector) {
        const cachedAst = this.astCache.get(selector) || null;
        return cachedAst;
      }
      /**
       * Returns selector ast:
       * - if cached ast exists — returns it;
       * - if no cached ast — saves newly parsed ast to cache and returns it.
       *
       * @param selector Standard or extended selector.
       *
       * @returns Ast for `selector`.
       */
      getSelectorAst(selector) {
        let ast = this.getAstFromCache(selector);
        if (!ast) {
          ast = parse(selector);
        }
        this.saveAstToCache(selector, ast);
        return ast;
      }
      /**
       * Selects elements by selector.
       *
       * @param selector Standard or extended selector.
       *
       * @returns Array of DOM elements.
       */
      querySelectorAll(selector) {
        const ast = this.getSelectorAst(selector);
        return selectElementsByAst(ast);
      }
    }
    const extCssDocument = new ExtCssDocument();
    /**
     * Converts array of `entries` to object.
     * Object.fromEntries() polyfill because it is not supported by old browsers, e.g. Chrome 55.
     * Only first two elements of `entries` array matter, other will be skipped silently.
     *
     * @see {@link https://caniuse.com/?search=Object.fromEntries}
     *
     * @param entries Array of pairs.
     *
     * @returns Object converted from `entries`.
     */
    const getObjectFromEntries = (entries) => {
      const object = {};
      entries.forEach((el) => {
        const [key, value] = el;
        object[key] = value;
      });
      return object;
    };
    const DEBUG_PSEUDO_PROPERTY_KEY = "debug";
    /**
     * Checks the presence of :remove() pseudo-class and validates it while parsing the selector part of css rule.
     *
     * @param rawSelector Selector which may contain :remove() pseudo-class.
     *
     * @returns Parsed selector data with selector and styles.
     * @throws An error on invalid :remove() position.
     */
    const parseRemoveSelector = (rawSelector) => {
      /**
       * No error will be thrown on invalid selector as it will be validated later
       * so it's better to explicitly specify 'any' selector for :remove() pseudo-class by '*',
       * e.g. '.banner > *:remove()' instead of '.banner > :remove()'.
       */
      // ':remove()'
      // eslint-disable-next-line max-len
      const VALID_REMOVE_MARKER = `${COLON}${REMOVE_PSEUDO_MARKER}${BRACKET.PARENTHESES.LEFT}${BRACKET.PARENTHESES.RIGHT}`; // ':remove(' - needed for validation rules like 'div:remove(2)'
      const INVALID_REMOVE_MARKER = `${COLON}${REMOVE_PSEUDO_MARKER}${BRACKET.PARENTHESES.LEFT}`;
      let selector;
      let shouldRemove = false;
      const firstIndex = rawSelector.indexOf(VALID_REMOVE_MARKER);
      if (firstIndex === 0) {
        // e.g. ':remove()'
        throw new Error(
          `${REMOVE_ERROR_PREFIX.NO_TARGET_SELECTOR}: '${rawSelector}'`,
        );
      } else if (firstIndex > 0) {
        if (firstIndex !== rawSelector.lastIndexOf(VALID_REMOVE_MARKER)) {
          // rule with more than one :remove() pseudo-class is invalid
          // e.g. '.block:remove() > .banner:remove()'
          throw new Error(
            `${REMOVE_ERROR_PREFIX.MULTIPLE_USAGE}: '${rawSelector}'`,
          );
        } else if (
          firstIndex + VALID_REMOVE_MARKER.length <
          rawSelector.length
        ) {
          // remove pseudo-class should be last in the rule
          // e.g. '.block:remove():upward(2)'
          throw new Error(
            `${REMOVE_ERROR_PREFIX.INVALID_POSITION}: '${rawSelector}'`,
          );
        } else {
          // valid :remove() pseudo-class position
          selector = rawSelector.substring(0, firstIndex);
          shouldRemove = true;
        }
      } else if (rawSelector.includes(INVALID_REMOVE_MARKER)) {
        // it is not valid if ':remove()' is absent in rule but just ':remove(' is present
        // e.g. 'div:remove(0)'
        throw new Error(
          `${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${rawSelector}'`,
        );
      } else {
        // there is no :remove() pseudo-class in rule
        selector = rawSelector;
      }
      const stylesOfSelector = shouldRemove
        ? [
            {
              property: REMOVE_PSEUDO_MARKER,
              value: PSEUDO_PROPERTY_POSITIVE_VALUE,
            },
          ]
        : [];
      return {
        selector,
        stylesOfSelector,
      };
    };
    /**
     * Parses cropped selector part found before `{`.
     *
     * @param selectorBuffer Buffered selector to parse.
     * @param extCssDoc Needed for caching of selector ast.
     *
     * @returns Parsed validation data for cropped part of stylesheet which may be a selector.
     * @throws An error on unsupported CSS features, e.g. at-rules.
     */
    const parseSelectorRulePart = (selectorBuffer, extCssDoc) => {
      let selector = selectorBuffer.trim();
      if (selector.startsWith(AT_RULE_MARKER)) {
        throw new Error(`${NO_AT_RULE_ERROR_PREFIX}: '${selector}'.`);
      }
      let removeSelectorData;
      try {
        removeSelectorData = parseRemoveSelector(selector);
      } catch (e) {
        logger.error(getErrorMessage(e));
        throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
      }
      let stylesOfSelector = [];
      let success = false;
      let ast;
      try {
        selector = removeSelectorData.selector;
        stylesOfSelector = removeSelectorData.stylesOfSelector; // validate found selector by parsing it to ast
        // so if it is invalid error will be thrown
        ast = extCssDoc.getSelectorAst(selector);
        success = true;
      } catch (e) {
        success = false;
      }
      return {
        success,
        selector,
        ast,
        stylesOfSelector,
      };
    };
    /**
     * Creates a map for storing raw results of css rules parsing.
     * Used for merging styles for same selector.
     *
     * @returns Map where **key** is `selector`
     * and **value** is object with `ast` and `styles`.
     */
    const createRawResultsMap = () => {
      return new Map();
    };
    /**
     * Saves rules data for unique selectors.
     *
     * @param rawResults Previously collected results of parsing.
     * @param rawRuleData Parsed rule data.
     *
     * @throws An error if there is no rawRuleData.styles or rawRuleData.ast.
     */
    const saveToRawResults = (rawResults, rawRuleData) => {
      const { selector, ast, rawStyles } = rawRuleData;
      if (!rawStyles) {
        throw new Error(`No style declaration for selector: '${selector}'`);
      }
      if (!ast) {
        throw new Error(`No ast parsed for selector: '${selector}'`);
      }
      const storedRuleData = rawResults.get(selector);
      if (!storedRuleData) {
        rawResults.set(selector, {
          ast,
          styles: rawStyles,
        });
      } else {
        storedRuleData.styles.push(...rawStyles);
      }
    };
    /**
     * Checks whether the 'remove' property positively set in styles
     * with only one positive value - 'true'.
     *
     * @param styles Array of styles.
     *
     * @returns True if there is 'remove' property with 'true' value in `styles`.
     */
    const isRemoveSetInStyles = (styles) => {
      return styles.some((s) => {
        return (
          s.property === REMOVE_PSEUDO_MARKER &&
          s.value === PSEUDO_PROPERTY_POSITIVE_VALUE
        );
      });
    };
    /**
     * Returns 'debug' property value which is set in styles.
     *
     * @param styles Array of styles.
     *
     * @returns Value of 'debug' property if it is set in `styles`,
     * or `undefined` if the property is not found.
     */
    const getDebugStyleValue = (styles) => {
      const debugStyle = styles.find((s) => {
        return s.property === DEBUG_PSEUDO_PROPERTY_KEY;
      });
      return debugStyle === null || debugStyle === void 0
        ? void 0
        : debugStyle.value;
    };
    /**
     * Prepares final RuleData.
     * Handles `debug` and `remove` in raw rule data styles.
     *
     * @param rawRuleData Raw data of selector css rule parsing.
     *
     * @returns Parsed ExtendedCss rule data.
     * @throws An error if rawRuleData.ast or rawRuleData.rawStyles not defined.
     */
    const prepareRuleData = (rawRuleData) => {
      const { selector, ast, rawStyles } = rawRuleData;
      if (!ast) {
        throw new Error(`AST should be parsed for selector: '${selector}'`);
      }
      if (!rawStyles) {
        throw new Error(`Styles should be parsed for selector: '${selector}'`);
      }
      const ruleData = {
        selector,
        ast,
      };
      const debugValue = getDebugStyleValue(rawStyles);
      const shouldRemove = isRemoveSetInStyles(rawStyles);
      let styles = rawStyles;
      if (debugValue) {
        // get rid of 'debug' from styles
        styles = rawStyles.filter(
          (s) => s.property !== DEBUG_PSEUDO_PROPERTY_KEY,
        ); // and set it as separate property only if its value is valid
        // which is 'true' or 'global'
        if (
          debugValue === PSEUDO_PROPERTY_POSITIVE_VALUE ||
          debugValue === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE
        ) {
          ruleData.debug = debugValue;
        }
      }
      if (shouldRemove) {
        // no other styles are needed to apply if 'remove' is set
        ruleData.style = {
          [REMOVE_PSEUDO_MARKER]: PSEUDO_PROPERTY_POSITIVE_VALUE,
        };
        /**
         * 'content' property is needed for ExtCssConfiguration.beforeStyleApplied().
         *
         * @see {@link BeforeStyleAppliedCallback}
         */
        const contentStyle = styles.find(
          (s) => s.property === CONTENT_CSS_PROPERTY,
        );
        if (contentStyle) {
          ruleData.style[CONTENT_CSS_PROPERTY] = contentStyle.value;
        }
      } else {
        // otherwise all styles should be applied.
        // every style property will be unique because of their converting into object
        if (styles.length > 0) {
          const stylesAsEntries = styles.map((style) => {
            const { property, value } = style;
            return [property, value];
          });
          const preparedStyleData = getObjectFromEntries(stylesAsEntries);
          ruleData.style = preparedStyleData;
        }
      }
      return ruleData;
    };
    /**
     * Combines previously parsed css rules data objects
     * into rules which are ready to apply.
     *
     * @param rawResults Previously parsed css rules data objects.
     *
     * @returns Parsed ExtendedCss rule data.
     */
    const combineRulesData = (rawResults) => {
      const results = [];
      rawResults.forEach((value, key) => {
        const selector = key;
        const { ast, styles: rawStyles } = value;
        results.push(
          prepareRuleData({
            selector,
            ast,
            rawStyles,
          }),
        );
      });
      return results;
    };
    /**
     * Trims `rawStyle` and splits it into tokens.
     *
     * @param rawStyle Style declaration block content inside curly bracket — `{` and `}` —
     * can be a single style declaration or a list of declarations.
     *
     * @returns Array of tokens supported for style declaration block.
     */
    const tokenizeStyleBlock = (rawStyle) => {
      const styleDeclaration = rawStyle.trim();
      return tokenize(styleDeclaration, SUPPORTED_STYLE_DECLARATION_MARKS);
    };
    /**
     * Describes possible style declaration parts.
     *
     * IMPORTANT: it is used as 'const' instead of 'enum' to avoid side effects
     * during ExtendedCss import into other libraries.
     */
    const DECLARATION_PART = {
      PROPERTY: "property",
      VALUE: "value",
    };
    /**
     * Checks whether the quotes has been opened for style value.
     *
     * @param context Style block parser context.
     *
     * @returns True if style value has already opened quotes.
     */
    const isValueQuotesOpen = (context) => {
      return context.bufferValue !== "" && context.valueQuoteMark !== null;
    };
    /**
     * Saves parsed property and value to collection of parsed styles.
     * Prunes context buffers for property and value.
     *
     * @param context Style block parser context.
     */
    const collectStyle = (context) => {
      context.styles.push({
        property: context.bufferProperty.trim(),
        value: context.bufferValue.trim(),
      }); // reset buffers
      context.bufferProperty = "";
      context.bufferValue = "";
    };
    /**
     * Handles token which is supposed to be a part of style **property**.
     *
     * @param context Style block parser context.
     * @param styleBlock Whole style block which is being parsed.
     * @param token Current token.
     *
     * @throws An error on invalid token.
     */
    const processPropertyToken = (context, styleBlock, token) => {
      const { value: tokenValue } = token;
      switch (token.type) {
        case TOKEN_TYPE.WORD:
          if (context.bufferProperty.length > 0) {
            // e.g. 'padding top: 0;' - current tokenValue is 'top' which is not valid
            throw new Error(
              `Invalid style property in style block: '${styleBlock}'`,
            );
          }
          context.bufferProperty += tokenValue;
          break;
        case TOKEN_TYPE.MARK:
          // only colon and whitespaces are allowed while style property parsing
          if (tokenValue === COLON) {
            if (context.bufferProperty.trim().length === 0) {
              // e.g. such style block: '{ : none; }'
              throw new Error(
                `Missing style property before ':' in style block: '${styleBlock}'`,
              );
            } // the property successfully collected
            context.bufferProperty = context.bufferProperty.trim(); // prepare for value collecting
            context.processing = DECLARATION_PART.VALUE; // the property buffer shall be reset after the value is successfully collected
          } else if (WHITE_SPACE_CHARACTERS.includes(tokenValue));
          else {
            // if after the property there is anything other than ':' except whitespace, this is a parse error
            // https://www.w3.org/TR/css-syntax-3/#consume-declaration
            throw new Error(
              `Invalid style declaration in style block: '${styleBlock}'`,
            );
          }
          break;
        default:
          throw new Error(
            `Unsupported style property character: '${tokenValue}' in style block: '${styleBlock}'`,
          );
      }
    };
    /**
     * Handles token which is supposed to be a part of style **value**.
     *
     * @param context Style block parser context.
     * @param styleBlock Whole style block which is being parsed.
     * @param token Current token.
     *
     * @throws An error on invalid token.
     */
    const processValueToken = (context, styleBlock, token) => {
      const { value: tokenValue } = token;
      if (token.type === TOKEN_TYPE.WORD) {
        // simply collect to buffer
        context.bufferValue += tokenValue;
      } else {
        // otherwise check the mark
        switch (tokenValue) {
          case COLON:
            // the ':' character inside of the value should be inside of quotes
            // otherwise the value is not valid
            // e.g. 'content: display: none'
            // parser is here        ↑
            if (!isValueQuotesOpen(context)) {
              // eslint-disable-next-line max-len
              throw new Error(
                `Invalid style value for property '${context.bufferProperty}' in style block: '${styleBlock}'`,
              );
            } // collect the colon inside quotes
            // e.g. 'content: "test:123"'
            // parser is here      ↑
            context.bufferValue += tokenValue;
            break;
          case SEMICOLON:
            if (isValueQuotesOpen(context)) {
              // ';' inside quotes is part of style value
              // e.g. 'content: "test;"'
              context.bufferValue += tokenValue;
            } else {
              // otherwise the value is successfully collected
              // save parsed style
              collectStyle(context); // prepare for value collecting
              context.processing = DECLARATION_PART.PROPERTY;
            }
            break;
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE:
            // if quotes are not open
            if (context.valueQuoteMark === null) {
              // save the opening quote mark for later comparison
              context.valueQuoteMark = tokenValue;
            } else if (
              !context.bufferValue.endsWith(BACKSLASH) && // otherwise a quote appeared in the value earlier,
              // and non-escaped quote should be checked whether it is a closing quote
              context.valueQuoteMark === tokenValue
            ) {
              context.valueQuoteMark = null;
            } // always save the quote to the buffer
            // but after the context.bufferValue is checked for BACKSLASH above
            // e.g. 'content: "test:123"'
            //      'content: "\""'
            context.bufferValue += tokenValue;
            break;
          case BACKSLASH:
            if (!isValueQuotesOpen(context)) {
              // eslint-disable-next-line max-len
              throw new Error(
                `Invalid style value for property '${context.bufferProperty}' in style block: '${styleBlock}'`,
              );
            } // collect the backslash inside quotes
            // e.g. ' content: "\"" '
            // parser is here   ↑
            context.bufferValue += tokenValue;
            break;
          case SPACE:
          case TAB:
          case CARRIAGE_RETURN:
          case LINE_FEED:
          case FORM_FEED:
            // whitespace should be collected only if the value collecting started
            // which means inside of the value
            // e.g. 'width: 100% !important'
            // parser is here   ↑
            if (context.bufferValue.length > 0) {
              context.bufferValue += tokenValue;
            } // otherwise it can be omitted
            // e.g. 'width:  100% !important'
            // here        ↑
            break;
          default:
            throw new Error(`Unknown style declaration token: '${tokenValue}'`);
        }
      }
    };
    /**
     * Parses css rule style block.
     *
     * @param rawStyleBlock Style block to parse.
     *
     * @returns Array of style declarations.
     * @throws An error on invalid style block.
     */
    const parseStyleBlock = (rawStyleBlock) => {
      const styleBlock = rawStyleBlock.trim();
      const tokens = tokenizeStyleBlock(styleBlock);
      const context = {
        // style declaration parsing always starts with 'property'
        processing: DECLARATION_PART.PROPERTY,
        styles: [],
        bufferProperty: "",
        bufferValue: "",
        valueQuoteMark: null,
      };
      let i = 0;
      while (i < tokens.length) {
        const token = tokens[i];
        if (!token) {
          break;
        }
        if (context.processing === DECLARATION_PART.PROPERTY) {
          processPropertyToken(context, styleBlock, token);
        } else if (context.processing === DECLARATION_PART.VALUE) {
          processValueToken(context, styleBlock, token);
        } else {
          throw new Error("Style declaration parsing failed");
        }
        i += 1;
      } // unbalanced value quotes
      // e.g. 'content: "test} '
      if (isValueQuotesOpen(context)) {
        throw new Error(
          `Unbalanced style declaration quotes in style block: '${styleBlock}'`,
        );
      } // collected property and value have not been saved to styles;
      // it is possible for style block with no semicolon at the end
      // e.g. such style block: '{ display: none }'
      if (context.bufferProperty.length > 0) {
        if (context.bufferValue.length === 0) {
          // e.g. such style blocks:
          //   '{ display:  }'
          //   '{ remove }'
          // eslint-disable-next-line max-len
          throw new Error(
            `Missing style value for property '${context.bufferProperty}' in style block '${styleBlock}'`,
          );
        }
        collectStyle(context);
      } // rule with empty style block
      // e.g. 'div { }'
      if (context.styles.length === 0) {
        throw new Error(STYLE_ERROR_PREFIX.NO_STYLE);
      }
      return context.styles;
    };
    /**
     * Returns array of positions of `{` in `cssRule`.
     *
     * @param cssRule CSS rule.
     *
     * @returns Array of left curly bracket indexes.
     */
    const getLeftCurlyBracketIndexes = (cssRule) => {
      const indexes = [];
      for (let i = 0; i < cssRule.length; i += 1) {
        if (cssRule[i] === BRACKET.CURLY.LEFT) {
          indexes.push(i);
        }
      }
      return indexes;
    }; // TODO: use `extCssDoc` for caching of style block parser results
    /**
     * Parses CSS rule into rules data object:
     * 1. Find the last `{` mark in the rule
     *    which supposed to be a divider between selector and style block.
     * 2. Validates found string part before the `{` via selector parser; and if:
     *  - parsing failed – get the previous `{` in the rule,
     *    and validates a new rule part again [2];
     *  - parsing successful — saves a found rule part as selector and parses the style block.
     *
     * @param rawCssRule Single CSS rule to parse.
     * @param extCssDoc ExtCssDocument which is used for selector ast caching.
     *
     * @returns Array of rules data which contains:
     *   - selector as string;
     *   - ast to query elements by;
     *   - map of styles to apply.
     * @throws An error on invalid css rule syntax:
     *   - unsupported CSS features – comments and at-rules
     *   - invalid selector or style block.
     */
    const parseRule = (rawCssRule, extCssDoc) => {
      var _rawRuleData$selector;
      const cssRule = rawCssRule.trim();
      if (
        cssRule.includes(`${SLASH}${ASTERISK}`) &&
        cssRule.includes(`${ASTERISK}${SLASH}`)
      ) {
        throw new Error(STYLE_ERROR_PREFIX.NO_COMMENT);
      }
      const leftCurlyBracketIndexes = getLeftCurlyBracketIndexes(cssRule); // rule with style block but no selector
      // e.g. '{ display: none; }'
      if (getFirst(leftCurlyBracketIndexes) === 0) {
        throw new Error(NO_SELECTOR_ERROR_PREFIX);
      }
      let selectorData; // if rule has `{` but there is no `}`
      if (
        leftCurlyBracketIndexes.length > 0 &&
        !cssRule.includes(BRACKET.CURLY.RIGHT)
      ) {
        throw new Error(
          `${STYLE_ERROR_PREFIX.NO_STYLE} OR ${STYLE_ERROR_PREFIX.UNCLOSED_STYLE}`,
        );
      }
      if (
        // if rule has no `{`
        leftCurlyBracketIndexes.length === 0 || // or `}`
        !cssRule.includes(BRACKET.CURLY.RIGHT)
      ) {
        try {
          // the whole css rule considered as "selector part"
          // which may contain :remove() pseudo-class
          selectorData = parseSelectorRulePart(cssRule, extCssDoc);
          if (selectorData.success) {
            var _selectorData$stylesO;
            // rule with no style block has valid :remove() pseudo-class
            // which is parsed into "styles"
            // e.g. 'div:remove()'
            // but also it can be just selector with no styles
            // e.g. 'div'
            // which should not be considered as valid css rule
            if (
              ((_selectorData$stylesO = selectorData.stylesOfSelector) ===
                null || _selectorData$stylesO === void 0
                ? void 0
                : _selectorData$stylesO.length) === 0
            ) {
              throw new Error(STYLE_ERROR_PREFIX.NO_STYLE_OR_REMOVE);
            }
            return {
              selector: selectorData.selector.trim(),
              ast: selectorData.ast,
              rawStyles: selectorData.stylesOfSelector,
            };
          } else {
            // not valid selector
            throw new Error("Invalid selector");
          }
        } catch (e) {
          throw new Error(getErrorMessage(e));
        }
      }
      let selectorBuffer;
      let styleBlockBuffer;
      const rawRuleData = {
        selector: "",
      }; // css rule should be parsed from its end
      for (let i = leftCurlyBracketIndexes.length - 1; i > -1; i -= 1) {
        const index = leftCurlyBracketIndexes[i];
        if (!index) {
          throw new Error(
            `Impossible to continue, no '{' to process for rule: '${cssRule}'`,
          );
        } // selector is before `{`, style block is after it
        selectorBuffer = cssRule.slice(0, index); // skip curly brackets
        styleBlockBuffer = cssRule.slice(index + 1, cssRule.length - 1);
        selectorData = parseSelectorRulePart(selectorBuffer, extCssDoc);
        if (selectorData.success) {
          var _rawRuleData$rawStyle;
          // selector successfully parsed
          rawRuleData.selector = selectorData.selector.trim();
          rawRuleData.ast = selectorData.ast;
          rawRuleData.rawStyles = selectorData.stylesOfSelector; // style block should be parsed
          // TODO: add cache for style block parsing
          const parsedStyles = parseStyleBlock(styleBlockBuffer);
          (_rawRuleData$rawStyle = rawRuleData.rawStyles) === null ||
          _rawRuleData$rawStyle === void 0
            ? void 0
            : _rawRuleData$rawStyle.push(...parsedStyles); // stop rule parsing
          break;
        } else {
          // if selector was not parsed successfully
          // continue with next index of `{`
          continue;
        }
      }
      if (
        ((_rawRuleData$selector = rawRuleData.selector) === null ||
        _rawRuleData$selector === void 0
          ? void 0
          : _rawRuleData$selector.length) === 0
      ) {
        // skip the rule as selector
        throw new Error("Selector in not valid");
      }
      return rawRuleData;
    };
    /**
     * Parses array of CSS rules into array of rules data objects.
     * Invalid rules are skipped and not applied,
     * and the errors are logged.
     *
     * @param rawCssRules Array of rules to parse.
     * @param extCssDoc Needed for selector ast caching.
     *
     * @returns Array of parsed valid rules data.
     */
    const parseRules$1 = (rawCssRules, extCssDoc) => {
      const rawResults = createRawResultsMap();
      const warnings = []; // trim all rules and find unique ones
      const uniqueRules = [...new Set(rawCssRules.map((r) => r.trim()))];
      uniqueRules.forEach((rule) => {
        try {
          saveToRawResults(rawResults, parseRule(rule, extCssDoc));
        } catch (e) {
          // skip the invalid rule
          const errorMessage = getErrorMessage(e);
          warnings.push(`'${rule}' - error: '${errorMessage}'`);
        }
      }); // log info about skipped invalid rules
      if (warnings.length > 0) {
        logger.info(`Invalid rules:\n  ${warnings.join("\n  ")}`);
      }
      return combineRulesData(rawResults);
    };
    const REGEXP_DECLARATION_END = /[;}]/g;
    const REGEXP_DECLARATION_DIVIDER = /[;:}]/g;
    const REGEXP_NON_WHITESPACE = /\S/g;
    /**
     * Interface for stylesheet parser context.
     */
    /**
     * Resets rule data buffer to init value after rule successfully collected.
     *
     * @param context Stylesheet parser context.
     */
    const restoreRuleAcc = (context) => {
      context.rawRuleData = {
        selector: "",
      };
    };
    /**
     * Parses cropped selector part found before `{` previously.
     *
     * @param context Stylesheet parser context.
     * @param extCssDoc Needed for caching of selector ast.
     *
     * @returns Parsed validation data for cropped part of stylesheet which may be a selector.
     * @throws An error on unsupported CSS features, e.g. at-rules.
     */
    const parseSelectorPart = (context, extCssDoc) => {
      let selector = context.selectorBuffer.trim();
      if (selector.startsWith(AT_RULE_MARKER)) {
        throw new Error(`${NO_AT_RULE_ERROR_PREFIX}: '${selector}'.`);
      }
      let removeSelectorData;
      try {
        removeSelectorData = parseRemoveSelector(selector);
      } catch (e) {
        logger.error(getErrorMessage(e));
        throw new Error(`${REMOVE_ERROR_PREFIX.INVALID_REMOVE}: '${selector}'`);
      }
      if (context.nextIndex === -1) {
        if (selector === removeSelectorData.selector) {
          // rule should have style or pseudo-class :remove()
          throw new Error(
            `${STYLE_ERROR_PREFIX.NO_STYLE_OR_REMOVE}: '${context.cssToParse}'`,
          );
        } // stop parsing as there is no style declaration and selector parsed fine
        context.cssToParse = "";
      }
      let stylesOfSelector = [];
      let success = false;
      let ast;
      try {
        selector = removeSelectorData.selector;
        stylesOfSelector = removeSelectorData.stylesOfSelector; // validate found selector by parsing it to ast
        // so if it is invalid error will be thrown
        ast = extCssDoc.getSelectorAst(selector);
        success = true;
      } catch (e) {
        success = false;
      }
      if (context.nextIndex > 0) {
        // slice found valid selector part off
        // and parse rest of stylesheet later
        context.cssToParse = context.cssToParse.slice(context.nextIndex);
      }
      return {
        success,
        selector,
        ast,
        stylesOfSelector,
      };
    };
    /**
     * Recursively parses style declaration string into `Style`s.
     *
     * @param context Stylesheet parser context.
     * @param styles Array of styles.
     *
     * @throws An error on invalid style declaration.
     * @returns A number index of the next `}` in `this.cssToParse`.
     */
    const parseUntilClosingBracket = (context, styles) => {
      // Expects ":", ";", and "}".
      REGEXP_DECLARATION_DIVIDER.lastIndex = context.nextIndex;
      let match = REGEXP_DECLARATION_DIVIDER.exec(context.cssToParse);
      if (match === null) {
        throw new Error(
          `${STYLE_ERROR_PREFIX.INVALID_STYLE}: '${context.cssToParse}'`,
        );
      }
      let matchPos = match.index;
      let matched = match[0];
      if (matched === BRACKET.CURLY.RIGHT) {
        const declarationChunk = context.cssToParse.slice(
          context.nextIndex,
          matchPos,
        );
        if (declarationChunk.trim().length === 0) {
          // empty style declaration
          // e.g. 'div { }'
          if (styles.length === 0) {
            throw new Error(
              `${STYLE_ERROR_PREFIX.NO_STYLE}: '${context.cssToParse}'`,
            );
          } // else valid style parsed before it
          // e.g. '{ display: none; }' -- position is after ';'
        } else {
          // closing curly bracket '}' is matched before colon ':'
          // trimmed declarationChunk is not a space, between ';' and '}',
          // e.g. 'visible }' in style '{ display: none; visible }' after part before ';' is parsed
          throw new Error(
            `${STYLE_ERROR_PREFIX.INVALID_STYLE}: '${context.cssToParse}'`,
          );
        }
        return matchPos;
      }
      if (matched === COLON) {
        const colonIndex = matchPos; // Expects ";" and "}".
        REGEXP_DECLARATION_END.lastIndex = colonIndex;
        match = REGEXP_DECLARATION_END.exec(context.cssToParse);
        if (match === null) {
          throw new Error(
            `${STYLE_ERROR_PREFIX.UNCLOSED_STYLE}: '${context.cssToParse}'`,
          );
        }
        matchPos = match.index;
        matched = match[0]; // Populates the `styleMap` key-value map.
        const property = context.cssToParse
          .slice(context.nextIndex, colonIndex)
          .trim();
        if (property.length === 0) {
          throw new Error(
            `${STYLE_ERROR_PREFIX.NO_PROPERTY}: '${context.cssToParse}'`,
          );
        }
        const value = context.cssToParse.slice(colonIndex + 1, matchPos).trim();
        if (value.length === 0) {
          throw new Error(
            `${STYLE_ERROR_PREFIX.NO_VALUE}: '${context.cssToParse}'`,
          );
        }
        styles.push({
          property,
          value,
        }); // finish style parsing if '}' is found
        // e.g. '{ display: none }' -- no ';' at the end of declaration
        if (matched === BRACKET.CURLY.RIGHT) {
          return matchPos;
        }
      } // matchPos is the position of the next ';'
      // crop 'cssToParse' and re-run the loop
      context.cssToParse = context.cssToParse.slice(matchPos + 1);
      context.nextIndex = 0;
      return parseUntilClosingBracket(context, styles); // Should be a subject of tail-call optimization.
    };
    /**
     * Parses next style declaration part in stylesheet.
     *
     * @param context Stylesheet parser context.
     *
     * @returns Array of style data objects.
     */
    const parseNextStyle = (context) => {
      const styles = [];
      const styleEndPos = parseUntilClosingBracket(context, styles); // find next rule after the style declaration
      REGEXP_NON_WHITESPACE.lastIndex = styleEndPos + 1;
      const match = REGEXP_NON_WHITESPACE.exec(context.cssToParse);
      if (match === null) {
        context.cssToParse = "";
        return styles;
      }
      const matchPos = match.index; // cut out matched style declaration for previous selector
      context.cssToParse = context.cssToParse.slice(matchPos);
      return styles;
    };
    /**
     * Parses stylesheet of rules into rules data objects (non-recursively):
     * 1. Iterates through stylesheet string.
     * 2. Finds first `{` which can be style declaration start or part of selector.
     * 3. Validates found string part via selector parser; and if:
     *  - it throws error — saves string part to buffer as part of selector,
     *    slice next stylesheet part to `{` [2] and validates again [3];
     *  - no error — saves found string part as selector and starts to parse styles (recursively).
     *
     * @param rawStylesheet Raw stylesheet as string.
     * @param extCssDoc ExtCssDocument which uses cache while selectors parsing.
     * @throws An error on unsupported CSS features, e.g. comments or invalid stylesheet syntax.
     * @returns Array of rules data which contains:
     * - selector as string;
     * - ast to query elements by;
     * - map of styles to apply.
     */
    const parseStylesheet = (rawStylesheet, extCssDoc) => {
      const stylesheet = rawStylesheet.trim();
      if (
        stylesheet.includes(`${SLASH}${ASTERISK}`) &&
        stylesheet.includes(`${ASTERISK}${SLASH}`)
      ) {
        throw new Error(
          `${STYLE_ERROR_PREFIX.NO_COMMENT} in stylesheet: '${stylesheet}'`,
        );
      }
      const context = {
        // any stylesheet should start with selector
        isSelector: true,
        // init value of parser position
        nextIndex: 0,
        // init value of cssToParse
        cssToParse: stylesheet,
        // buffer for collecting selector part
        selectorBuffer: "",
        // accumulator for rules
        rawRuleData: {
          selector: "",
        },
      };
      const rawResults = createRawResultsMap();
      let selectorData; // context.cssToParse is going to be cropped while its parsing
      while (context.cssToParse) {
        if (context.isSelector) {
          // find index of first opening curly bracket
          // which may mean start of style part and end of selector one
          context.nextIndex = context.cssToParse.indexOf(BRACKET.CURLY.LEFT); // rule should not start with style, selector is required
          // e.g. '{ display: none; }'
          if (context.selectorBuffer.length === 0 && context.nextIndex === 0) {
            throw new Error(
              `${STYLE_ERROR_PREFIX.NO_SELECTOR}: '${context.cssToParse}'`,
            );
          }
          if (context.nextIndex === -1) {
            // no style declaration in rule
            // but rule still may contain :remove() pseudo-class
            context.selectorBuffer = context.cssToParse;
          } else {
            // collect string parts before opening curly bracket
            // until valid selector collected
            context.selectorBuffer += context.cssToParse.slice(
              0,
              context.nextIndex,
            );
          }
          selectorData = parseSelectorPart(context, extCssDoc);
          if (selectorData.success) {
            // selector successfully parsed
            context.rawRuleData.selector = selectorData.selector.trim();
            context.rawRuleData.ast = selectorData.ast;
            context.rawRuleData.rawStyles = selectorData.stylesOfSelector;
            context.isSelector = false; // save rule data if there is no style declaration
            if (context.nextIndex === -1) {
              saveToRawResults(rawResults, context.rawRuleData); // clean up ruleContext
              restoreRuleAcc(context);
            } else {
              // skip the opening curly bracket at the start of style declaration part
              context.nextIndex = 1;
              context.selectorBuffer = "";
            }
          } else {
            // if selector was not successfully parsed parseSelectorPart(), continue stylesheet parsing:
            // save the found bracket to buffer and proceed to next loop iteration
            context.selectorBuffer += BRACKET.CURLY.LEFT; // delete `{` from cssToParse
            context.cssToParse = context.cssToParse.slice(1);
          }
        } else {
          var _context$rawRuleData$;
          // style declaration should be parsed
          const parsedStyles = parseNextStyle(context); // styles can be parsed from selector part if it has :remove() pseudo-class
          // e.g. '.banner:remove() { debug: true; }'
          (_context$rawRuleData$ = context.rawRuleData.rawStyles) === null ||
          _context$rawRuleData$ === void 0
            ? void 0
            : _context$rawRuleData$.push(...parsedStyles); // save rule data to results
          saveToRawResults(rawResults, context.rawRuleData);
          context.nextIndex = 0; // clean up ruleContext
          restoreRuleAcc(context); // parse next rule selector after style successfully parsed
          context.isSelector = true;
        }
      }
      return combineRulesData(rawResults);
    };
    /**
     * Checks whether passed `arg` is number type.
     *
     * @param arg Value to check.
     *
     * @returns True if `arg` is number and not NaN.
     */
    const isNumber = (arg) => {
      return typeof arg === "number" && !Number.isNaN(arg);
    };
    /**
     * The purpose of ThrottleWrapper is to throttle calls of the function
     * that applies ExtendedCss rules. The reasoning here is that the function calls
     * are triggered by MutationObserver and there may be many mutations in a short period of time.
     * We do not want to apply rules on every mutation so we use this helper to make sure
     * that there is only one call in the given amount of time.
     */
    class ThrottleWrapper {
      /**
       * Creates new ThrottleWrapper.
       * The {@link callback} should be executed not more often than {@link ThrottleWrapper.THROTTLE_DELAY_MS}.
       *
       * @param callback The callback.
       */
      constructor(callback) {
        this.callback = callback;
        this.executeCallback = this.executeCallback.bind(this);
      }
      /**
       * Calls the {@link callback} function and update bounded throttle wrapper properties.
       */
      executeCallback() {
        this.lastRunTime = performance.now();
        if (isNumber(this.timerId)) {
          clearTimeout(this.timerId);
          delete this.timerId;
        }
        this.callback();
      }
      /**
       * Schedules the {@link executeCallback} function execution via setTimeout.
       * It may triggered by MutationObserver job which may occur too ofter, so we limit the function execution:
       *
       * 1. If {@link timerId} is set, ignore the call, because the function is already scheduled to be executed;
       *
       * 2. If {@link lastRunTime} is set, we need to check the time elapsed time since the last call. If it is
       * less than {@link ThrottleWrapper.THROTTLE_DELAY_MS}, we schedule the function execution after the remaining time.
       *
       * Otherwise, we execute the function asynchronously to ensure that it is executed
       * in the correct order with respect to DOM events, by deferring its execution until after
       * those tasks have completed.
       */
      run() {
        if (isNumber(this.timerId)) {
          // there is a pending execution scheduled
          return;
        }
        if (isNumber(this.lastRunTime)) {
          const elapsedTime = performance.now() - this.lastRunTime;
          if (elapsedTime < ThrottleWrapper.THROTTLE_DELAY_MS) {
            this.timerId = window.setTimeout(
              this.executeCallback,
              ThrottleWrapper.THROTTLE_DELAY_MS - elapsedTime,
            );
            return;
          }
        }
        /**
         * We use `setTimeout` instead `requestAnimationFrame`
         * here because requestAnimationFrame can be delayed for a long time
         * when the browser saves battery or the engine is heavily loaded.
         */
        this.timerId = window.setTimeout(this.executeCallback);
      }
    }
    _defineProperty(ThrottleWrapper, "THROTTLE_DELAY_MS", 150);
    const LAST_EVENT_TIMEOUT_MS = 10;
    const IGNORED_EVENTS = [
      "mouseover",
      "mouseleave",
      "mouseenter",
      "mouseout",
    ];
    const SUPPORTED_EVENTS = [
      // keyboard events
      "keydown",
      "keypress",
      "keyup",
      // mouse events
      "auxclick",
      "click",
      "contextmenu",
      "dblclick",
      "mousedown",
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseover",
      "mouseout",
      "mouseup",
      "pointerlockchange",
      "pointerlockerror",
      "select",
      "wheel",
    ]; // 'wheel' event makes scrolling in Safari twitchy
    // https://github.com/AdguardTeam/ExtendedCss/issues/120
    const SAFARI_PROBLEMATIC_EVENTS = ["wheel"];
    /**
     * We use EventTracker to track the event that is likely to cause the mutation.
     * The problem is that we cannot use `window.event` directly from the mutation observer call
     * as we're not in the event handler context anymore.
     */
    class EventTracker {
      /**
       * Creates new EventTracker.
       */
      constructor() {
        _defineProperty(this, "getLastEventType", () => this.lastEventType);
        _defineProperty(this, "getTimeSinceLastEvent", () => {
          if (!this.lastEventTime) {
            return null;
          }
          return Date.now() - this.lastEventTime;
        });
        this.trackedEvents = isSafariBrowser
          ? SUPPORTED_EVENTS.filter(
              (event) => !SAFARI_PROBLEMATIC_EVENTS.includes(event),
            )
          : SUPPORTED_EVENTS;
        this.trackedEvents.forEach((eventName) => {
          document.documentElement.addEventListener(
            eventName,
            this.trackEvent,
            true,
          );
        });
      }
      /**
       * Callback for event listener for events tracking.
       *
       * @param event Any event.
       */
      trackEvent(event) {
        this.lastEventType = event.type;
        this.lastEventTime = Date.now();
      }
      /**
       * Checks whether the last caught event should be ignored.
       *
       * @returns True if event should be ignored.
       */
      isIgnoredEventType() {
        const lastEventType = this.getLastEventType();
        const sinceLastEventTime = this.getTimeSinceLastEvent();
        return (
          !!lastEventType &&
          IGNORED_EVENTS.includes(lastEventType) &&
          !!sinceLastEventTime &&
          sinceLastEventTime < LAST_EVENT_TIMEOUT_MS
        );
      }
      /**
       * Stops event tracking by removing event listener.
       */
      stopTracking() {
        this.trackedEvents.forEach((eventName) => {
          document.documentElement.removeEventListener(
            eventName,
            this.trackEvent,
            true,
          );
        });
      }
    }
    /**
     * We are trying to limit the number of callback calls by not calling it on all kind of "hover" events.
     * The rationale behind this is that "hover" events often cause attributes modification,
     * but re-applying extCSS rules will be useless as these attribute changes are usually transient.
     *
     * @param mutations DOM elements mutation records.
     * @returns True if all mutations are about attributes changes, otherwise false.
     */
    function shouldIgnoreMutations(mutations) {
      // ignore if all mutations are about attributes changes
      return !mutations.some((m) => m.type !== "attributes");
    }
    /**
     * Adds new {@link context.domMutationObserver} instance and connect it to document.
     *
     * @param context ExtendedCss context.
     */
    function observeDocument(context) {
      if (context.isDomObserved) {
        return;
      } // enable dynamically added elements handling
      context.isDomObserved = true;
      context.domMutationObserver = new natives.MutationObserver(
        (mutations) => {
          if (!mutations || mutations.length === 0) {
            return;
          }
          const eventTracker = new EventTracker();
          if (
            eventTracker.isIgnoredEventType() &&
            shouldIgnoreMutations(mutations)
          ) {
            return;
          } // save instance of EventTracker to context
          // for removing its event listeners on disconnectDocument() while mainDisconnect()
          context.eventTracker = eventTracker;
          context.scheduler.run();
        },
      );
      context.domMutationObserver.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["id", "class"],
      });
    }
    /**
     * Disconnect from {@link context.domMutationObserver}.
     *
     * @param context ExtendedCss context.
     */
    function disconnectDocument(context) {
      if (!context.isDomObserved) {
        return;
      } // disable dynamically added elements handling
      context.isDomObserved = false;
      if (context.domMutationObserver) {
        context.domMutationObserver.disconnect();
      } // clean up event listeners
      if (context.eventTracker) {
        context.eventTracker.stopTracking();
      }
    }
    const CONTENT_ATTR_PREFIX_REGEXP = /^("|')adguard.+?/;
    /**
     * Removes affectedElement.node from DOM.
     *
     * @param context ExtendedCss context.
     * @param affectedElement Affected element.
     */
    const removeElement = (context, affectedElement) => {
      const { node } = affectedElement;
      affectedElement.removed = true;
      const elementSelector = getElementSelectorPath(node); // check if the element has been already removed earlier
      const elementRemovalsCounter =
        context.removalsStatistic[elementSelector] || 0; // if removals attempts happened more than specified we do not try to remove node again
      if (elementRemovalsCounter > MAX_STYLE_PROTECTION_COUNT) {
        logger.error(
          `ExtendedCss: infinite loop protection for selector: '${elementSelector}'`,
        );
        return;
      }
      if (node.parentElement) {
        node.parentElement.removeChild(node);
        context.removalsStatistic[elementSelector] = elementRemovalsCounter + 1;
      }
    };
    /**
     * Sets style to the specified DOM node.
     *
     * @param node DOM element.
     * @param style Style to set.
     */
    const setStyleToElement = (node, style) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }
      Object.keys(style).forEach((prop) => {
        // Apply this style only to existing properties
        // We cannot use hasOwnProperty here (does not work in FF)
        if (
          typeof node.style.getPropertyValue(prop.toString()) !== "undefined"
        ) {
          let value = style[prop];
          if (!value) {
            return;
          } // do not apply 'content' style given by tsurlfilter
          // which is needed only for BeforeStyleAppliedCallback
          if (
            prop === CONTENT_CSS_PROPERTY &&
            value.match(CONTENT_ATTR_PREFIX_REGEXP)
          ) {
            return;
          } // First we should remove !important attribute (or it won't be applied')
          value = removeSuffix(value.trim(), "!important").trim();
          node.style.setProperty(prop, value, "important");
        }
      });
    };
    /**
     * Checks the required properties of `affectedElement`
     * **before** `beforeStyleApplied()` execution.
     *
     * @param affectedElement Affected element.
     *
     * @returns False if there is no `node` or `rules`
     * or `rules` is not an array.
     */
    const isIAffectedElement = (affectedElement) => {
      return (
        "node" in affectedElement &&
        "rules" in affectedElement &&
        affectedElement.rules instanceof Array
      );
    };
    /**
     * Checks the required properties of `affectedElement`
     * **after** `beforeStyleApplied()` execution.
     * These properties are needed for proper internal usage.
     *
     * @param affectedElement Affected element.
     *
     * @returns False if there is no `node` or `rules`
     * or `rules` is not an array.
     */
    const isAffectedElement = (affectedElement) => {
      return (
        "node" in affectedElement &&
        "originalStyle" in affectedElement &&
        "rules" in affectedElement &&
        affectedElement.rules instanceof Array
      );
    };
    /**
     * Applies style to the specified DOM node.
     *
     * @param context ExtendedCss context.
     * @param rawAffectedElement Object containing DOM node and rule to be applied.
     *
     * @throws An error if affectedElement has no style to apply.
     */
    const applyStyle = (context, rawAffectedElement) => {
      if (rawAffectedElement.protectionObserver) {
        // style is already applied and protected by the observer
        return;
      }
      let affectedElement;
      if (context.beforeStyleApplied) {
        if (!isIAffectedElement(rawAffectedElement)) {
          throw new Error(
            "Returned IAffectedElement should have 'node' and 'rules' properties",
          );
        }
        affectedElement = context.beforeStyleApplied(rawAffectedElement);
        if (!affectedElement) {
          throw new Error(
            "Callback 'beforeStyleApplied' should return IAffectedElement",
          );
        }
      } else {
        affectedElement = rawAffectedElement;
      }
      if (!isAffectedElement(affectedElement)) {
        throw new Error(
          "Returned IAffectedElement should have 'node' and 'rules' properties",
        );
      }
      const { node, rules } = affectedElement;
      for (let i = 0; i < rules.length; i += 1) {
        const rule = rules[i];
        const selector =
          rule === null || rule === void 0 ? void 0 : rule.selector;
        const style = rule === null || rule === void 0 ? void 0 : rule.style;
        const debug = rule === null || rule === void 0 ? void 0 : rule.debug; // rule may not have style to apply
        // e.g. 'div:has(> a) { debug: true }' -> means no style to apply, and enable debug mode
        if (style) {
          if (style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE) {
            removeElement(context, affectedElement);
            return;
          }
          setStyleToElement(node, style);
        } else if (!debug) {
          // but rule should not have both style and debug properties
          throw new Error(
            `No style declaration in rule for selector: '${selector}'`,
          );
        }
      }
    };
    /**
     * Reverts style for the affected object.
     *
     * @param affectedElement Affected element.
     */
    const revertStyle = (affectedElement) => {
      if (affectedElement.protectionObserver) {
        affectedElement.protectionObserver.disconnect();
      }
      affectedElement.node.style.cssText = affectedElement.originalStyle;
    };
    /**
     * ExtMutationObserver is a wrapper over regular MutationObserver with one additional function:
     * it keeps track of the number of times we called the "ProtectionCallback".
     *
     * We use an instance of this to monitor styles added by ExtendedCss
     * and to make sure these styles are recovered if the page script attempts to modify them.
     *
     * However, we want to avoid endless loops of modification if the page script repeatedly modifies the styles.
     * So we keep track of the number of calls and observe() makes a decision
     * whether to continue recovering the styles or not.
     */
    class ExtMutationObserver {
      /**
       * Extra property for keeping 'style fix counts'.
       */
      /**
       * Creates new ExtMutationObserver.
       *
       * @param protectionCallback Callback which execution should be counted.
       */
      constructor(protectionCallback) {
        this.styleProtectionCount = 0;
        this.observer = new natives.MutationObserver((mutations) => {
          if (!mutations.length) {
            return;
          }
          this.styleProtectionCount += 1;
          protectionCallback(mutations, this);
        });
      }
      /**
       * Starts to observe target element,
       * prevents infinite loop of observing due to the limited number of times of callback runs.
       *
       * @param target Target to observe.
       * @param options Mutation observer options.
       */
      observe(target, options) {
        if (this.styleProtectionCount < MAX_STYLE_PROTECTION_COUNT) {
          this.observer.observe(target, options);
        } else {
          logger.error("ExtendedCss: infinite loop protection for style");
        }
      }
      /**
       * Stops ExtMutationObserver from observing any mutations.
       * Until the `observe()` is used again, `protectionCallback` will not be invoked.
       */
      disconnect() {
        this.observer.disconnect();
      }
    }
    const PROTECTION_OBSERVER_OPTIONS = {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["style"],
    };
    /**
     * Creates MutationObserver protection callback.
     *
     * @param styles Styles data object.
     *
     * @returns Callback for styles protection.
     */
    const createProtectionCallback = (styles) => {
      const protectionCallback = (mutations, extObserver) => {
        if (!mutations[0]) {
          return;
        }
        const { target } = mutations[0];
        extObserver.disconnect();
        styles.forEach((style) => {
          setStyleToElement(target, style);
        });
        extObserver.observe(target, PROTECTION_OBSERVER_OPTIONS);
      };
      return protectionCallback;
    };
    /**
     * Sets up a MutationObserver which protects style attributes from changes.
     *
     * @param node DOM node.
     * @param rules Rule data objects.
     * @returns Mutation observer used to protect attribute or null if there's nothing to protect.
     */
    const protectStyleAttribute = (node, rules) => {
      if (!natives.MutationObserver) {
        return null;
      }
      const styles = [];
      rules.forEach((ruleData) => {
        const { style } = ruleData; // some rules might have only debug property in style declaration
        // e.g. 'div:has(> a) { debug: true }' -> parsed to boolean `ruleData.debug`
        // so no style is fine, and here we should collect only valid styles to protect
        if (style) {
          styles.push(style);
        }
      });
      const protectionObserver = new ExtMutationObserver(
        createProtectionCallback(styles),
      );
      protectionObserver.observe(node, PROTECTION_OBSERVER_OPTIONS);
      return protectionObserver;
    };
    const STATS_DECIMAL_DIGITS_COUNT = 4;
    /**
     * A helper class for applied rule stats.
     */
    class TimingStats {
      /**
       * Creates new TimingStats.
       */
      constructor() {
        this.appliesTimings = [];
        this.appliesCount = 0;
        this.timingsSum = 0;
        this.meanTiming = 0;
        this.squaredSum = 0;
        this.standardDeviation = 0;
      }
      /**
       * Observe target element and mark observer as active.
       *
       * @param elapsedTimeMs Time in ms.
       */
      push(elapsedTimeMs) {
        this.appliesTimings.push(elapsedTimeMs);
        this.appliesCount += 1;
        this.timingsSum += elapsedTimeMs;
        this.meanTiming = this.timingsSum / this.appliesCount;
        this.squaredSum += elapsedTimeMs * elapsedTimeMs;
        this.standardDeviation = Math.sqrt(
          this.squaredSum / this.appliesCount - Math.pow(this.meanTiming, 2),
        );
      }
    }
    /**
     * Makes the timestamps more readable.
     *
     * @param timestamp Raw timestamp.
     *
     * @returns Fine-looking timestamps.
     */
    const beautifyTimingNumber = (timestamp) => {
      return Number(timestamp.toFixed(STATS_DECIMAL_DIGITS_COUNT));
    };
    /**
     * Improves timing stats readability.
     *
     * @param rawTimings Collected timings with raw timestamp.
     *
     * @returns Fine-looking timing stats.
     */
    const beautifyTimings = (rawTimings) => {
      return {
        appliesTimings: rawTimings.appliesTimings.map((t) =>
          beautifyTimingNumber(t),
        ),
        appliesCount: beautifyTimingNumber(rawTimings.appliesCount),
        timingsSum: beautifyTimingNumber(rawTimings.timingsSum),
        meanTiming: beautifyTimingNumber(rawTimings.meanTiming),
        standardDeviation: beautifyTimingNumber(rawTimings.standardDeviation),
      };
    };
    /**
     * Prints timing information if debugging mode is enabled.
     *
     * @param context ExtendedCss context.
     */
    const printTimingInfo = (context) => {
      if (context.areTimingsPrinted) {
        return;
      }
      context.areTimingsPrinted = true;
      const timingsLogData = {};
      context.parsedRules.forEach((ruleData) => {
        if (ruleData.timingStats) {
          const { selector, style, debug, matchedElements } = ruleData; // style declaration for some rules is parsed to debug property and no style to apply
          // e.g. 'div:has(> a) { debug: true }'
          if (!style && !debug) {
            throw new Error(
              `Rule should have style declaration for selector: '${selector}'`,
            );
          }
          const selectorData = {
            selectorParsed: selector,
            timings: beautifyTimings(ruleData.timingStats),
          }; // `ruleData.style` may contain `remove` pseudo-property
          // and make logs look better
          if (
            style &&
            style[REMOVE_PSEUDO_MARKER] === PSEUDO_PROPERTY_POSITIVE_VALUE
          ) {
            selectorData.removed = true; // no matchedElements for such case as they are removed after ExtendedCss applied
          } else {
            selectorData.styleApplied = style || null;
            selectorData.matchedElements = matchedElements;
          }
          timingsLogData[selector] = selectorData;
        }
      });
      if (Object.keys(timingsLogData).length === 0) {
        return;
      } // add location.href to the message to distinguish frames
      logger.info(
        "[ExtendedCss] Timings in milliseconds for %o:\n%o",
        window.location.href,
        timingsLogData,
      );
    };
    /**
     * Finds affectedElement object for the specified DOM node.
     *
     * @param affElements Array of affected elements — context.affectedElements.
     * @param domNode DOM node.
     * @returns Found affectedElement or undefined.
     */
    const findAffectedElement = (affElements, domNode) => {
      return affElements.find((affEl) => affEl.node === domNode);
    };
    /**
     * Applies specified rule and returns list of elements affected.
     *
     * @param context ExtendedCss context.
     * @param ruleData Rule to apply.
     * @returns List of elements affected by the rule.
     */
    const applyRule = (context, ruleData) => {
      // debugging mode can be enabled in two ways:
      // 1. for separate rules - by `{ debug: true; }`
      // 2. for all rules simultaneously by:
      //   - `{ debug: global; }` in any rule
      //   - positive `debug` property in ExtCssConfiguration
      const isDebuggingMode = !!ruleData.debug || context.debug;
      let startTime;
      if (isDebuggingMode) {
        startTime = performance.now();
      }
      const { ast } = ruleData;
      const nodes = []; // selector can be successfully parser into ast with no error
      // but its applying by native Document.querySelectorAll() still may throw an error
      // e.g. 'div[..banner]'
      try {
        nodes.push(...selectElementsByAst(ast));
      } catch (e) {
        // log the error only in debug mode
        if (context.debug) {
          logger.error(getErrorMessage(e));
        }
      }
      nodes.forEach((node) => {
        let affectedElement = findAffectedElement(
          context.affectedElements,
          node,
        );
        if (affectedElement) {
          affectedElement.rules.push(ruleData);
          applyStyle(context, affectedElement);
        } else {
          // Applying style first time
          const originalStyle = node.style.cssText;
          affectedElement = {
            node,
            // affected DOM node
            rules: [ruleData],
            // rule to be applied
            originalStyle,
            // original node style
            protectionObserver: null, // style attribute observer
          };
          applyStyle(context, affectedElement);
          context.affectedElements.push(affectedElement);
        }
      });
      if (isDebuggingMode && startTime) {
        const elapsedTimeMs = performance.now() - startTime;
        if (!ruleData.timingStats) {
          ruleData.timingStats = new TimingStats();
        }
        ruleData.timingStats.push(elapsedTimeMs);
      }
      return nodes;
    };
    /**
     * Applies filtering rules.
     *
     * @param context ExtendedCss context.
     */
    const applyRules = (context) => {
      const newSelectedElements = []; // some rules could make call - selector.querySelectorAll() temporarily to change node id attribute
      // this caused MutationObserver to call recursively
      // https://github.com/AdguardTeam/ExtendedCss/issues/81
      disconnectDocument(context);
      context.parsedRules.forEach((ruleData) => {
        const nodes = applyRule(context, ruleData);
        Array.prototype.push.apply(newSelectedElements, nodes); // save matched elements to ruleData as linked to applied rule
        // only for debugging purposes
        if (ruleData.debug) {
          ruleData.matchedElements = nodes;
        }
      }); // Now revert styles for elements which are no more affected
      let affLength = context.affectedElements.length; // do nothing if there is no elements to process
      while (affLength) {
        const affectedElement = context.affectedElements[affLength - 1];
        if (!affectedElement) {
          break;
        }
        if (!newSelectedElements.includes(affectedElement.node)) {
          // Time to revert style
          revertStyle(affectedElement);
          context.affectedElements.splice(affLength - 1, 1);
        } else if (!affectedElement.removed) {
          // Add style protection observer
          // Protect "style" attribute from changes
          if (!affectedElement.protectionObserver) {
            affectedElement.protectionObserver = protectStyleAttribute(
              affectedElement.node,
              affectedElement.rules,
            );
          }
        }
        affLength -= 1;
      } // After styles are applied we can start observe again
      observeDocument(context);
      printTimingInfo(context);
    };
    /**
     * Result of selector validation.
     */
    /**
     * Main class of ExtendedCss lib.
     *
     * Parses css stylesheet with any selectors (passed to its argument as styleSheet),
     * and guarantee its applying as mutation observer is used to prevent the restyling of needed elements by other scripts.
     * This style protection is limited to 50 times to avoid infinite loop (MAX_STYLE_PROTECTION_COUNT).
     * Our own ThrottleWrapper is used for styles applying to avoid too often lib reactions on page mutations.
     *
     * Constructor creates the instance of class which should be run be `apply()` method to apply the rules,
     * and the applying can be stopped by `dispose()`.
     *
     * Can be used to select page elements by selector with `query()` method (similar to `Document.querySelectorAll()`),
     * which does not require instance creating.
     */
    class ExtendedCss {
      /**
       * Creates new ExtendedCss.
       *
       * @param configuration ExtendedCss configuration.
       */
      constructor(configuration) {
        if (!configuration) {
          throw new Error("ExtendedCss configuration should be provided.");
        }
        this.applyRulesCallbackListener =
          this.applyRulesCallbackListener.bind(this);
        this.context = {
          beforeStyleApplied: configuration.beforeStyleApplied,
          debug: false,
          affectedElements: [],
          isDomObserved: false,
          removalsStatistic: {},
          parsedRules: [],
          scheduler: new ThrottleWrapper(this.applyRulesCallbackListener),
        }; // TODO: throw an error instead of logging and handle it in related products.
        if (!isBrowserSupported()) {
          logger.error("Browser is not supported by ExtendedCss");
          return;
        } // at least 'styleSheet' or 'cssRules' should be provided
        if (!configuration.styleSheet && !configuration.cssRules) {
          throw new Error(
            "ExtendedCss configuration should have 'styleSheet' or 'cssRules' defined.",
          );
        } // 'styleSheet' and 'cssRules' are optional
        // and both can be provided at the same time
        // so both should be parsed and applied in such case
        if (configuration.styleSheet) {
          // stylesheet parsing can fail on some invalid selectors
          try {
            this.context.parsedRules.push(
              ...parseStylesheet(configuration.styleSheet, extCssDocument),
            );
          } catch (e) {
            // eslint-disable-next-line max-len
            throw new Error(
              `Pass the rules as configuration.cssRules since configuration.styleSheet cannot be parsed because of: '${getErrorMessage(e)}'`,
            );
          }
        }
        if (configuration.cssRules) {
          this.context.parsedRules.push(
            ...parseRules$1(configuration.cssRules, extCssDocument),
          );
        } // true if set in configuration
        // or any rule in styleSheet has `debug: global`
        this.context.debug =
          configuration.debug ||
          this.context.parsedRules.some((ruleData) => {
            return ruleData.debug === DEBUG_PSEUDO_PROPERTY_GLOBAL_VALUE;
          });
        if (
          this.context.beforeStyleApplied &&
          typeof this.context.beforeStyleApplied !== "function"
        ) {
          // eslint-disable-next-line max-len
          throw new Error(
            `Invalid configuration. Type of 'beforeStyleApplied' should be a function, received: '${typeof this.context.beforeStyleApplied}'`,
          );
        }
      }
      /**
       * Invokes {@link applyRules} function with current app context.
       *
       * This method is bound to the class instance in the constructor because it is called
       * in {@link ThrottleWrapper} and on the DOMContentLoaded event.
       */
      applyRulesCallbackListener() {
        applyRules(this.context);
      }
      /**
       * Initializes ExtendedCss.
       *
       * Should be executed on page ASAP,
       * otherwise the :contains() pseudo-class may work incorrectly.
       */
      init() {
        /**
         * Native Node textContent getter must be intercepted as soon as possible,
         * and stored as it is needed for proper work of :contains() pseudo-class
         * because DOM Node prototype 'textContent' property may be mocked.
         *
         * @see {@link https://github.com/AdguardTeam/ExtendedCss/issues/127}
         */
        nativeTextContent.setGetter();
      }
      /**
       * Applies stylesheet rules on page.
       */
      apply() {
        applyRules(this.context);
        if (document.readyState !== "complete") {
          document.addEventListener(
            "DOMContentLoaded",
            this.applyRulesCallbackListener,
            false,
          );
        }
      }
      /**
       * Disposes ExtendedCss and removes our styles from matched elements.
       */
      dispose() {
        disconnectDocument(this.context);
        this.context.affectedElements.forEach((el) => {
          revertStyle(el);
        });
        document.removeEventListener(
          "DOMContentLoaded",
          this.applyRulesCallbackListener,
          false,
        );
      }
      /**
       * Exposed for testing purposes only.
       *
       * @returns Array of AffectedElement data objects.
       */
      getAffectedElements() {
        return this.context.affectedElements;
      }
      /**
       * Returns a list of the document's elements that match the specified selector.
       * Uses ExtCssDocument.querySelectorAll().
       *
       * @param selector Selector text.
       * @param [noTiming=true] If true — do not print the timings to the console.
       *
       * @throws An error if selector is not valid.
       * @returns A list of elements that match the selector.
       */
      static query(selector) {
        let noTiming =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : true;
        if (typeof selector !== "string") {
          throw new Error("Selector should be defined as a string.");
        }
        const start = performance.now();
        try {
          return extCssDocument.querySelectorAll(selector);
        } finally {
          const end = performance.now();
          if (!noTiming) {
            logger.info(
              `[ExtendedCss] Elapsed: ${Math.round((end - start) * 1000)} μs.`,
            );
          }
        }
      }
      /**
       * Validates selector.
       *
       * @param inputSelector Selector text to validate.
       *
       * @returns Result of selector validation.
       */
      static validate(inputSelector) {
        try {
          // ExtendedCss in general supports :remove() in selector
          // but ExtendedCss.query() does not support it as it should be parsed by stylesheet parser.
          // so for validation we have to handle selectors with `:remove()` in it
          const { selector } = parseRemoveSelector(inputSelector);
          ExtendedCss.query(selector);
          return {
            ok: true,
            error: null,
          };
        } catch (e) {
          // not valid input `selector` should be logged eventually
          const error = `Error: Invalid selector: '${inputSelector}' -- ${getErrorMessage(e)}`;
          return {
            ok: false,
            error,
          };
        }
      }
    }
    const /** 元素规则 */ CRRE =
        /^(\[\$domain=)?(~?[\w-]+(?:(?:\.[\w-]+)*\.(?:[\w-]+|\*))?(?:[,|]~?[\w-]+(?:(?:\.[\w-]+)*\.(?:[\w-]+|\*))?)*)?]?(#@?\$?\??#)([^\s+@^][^@]*(?:["'([]+.*["')\]]+)*[^@]*)\s*$/,
      /** 基本规则 */
      BRRE =
        /^@@?(?:\/(.*[^\\])\/|(\|\|?)?(https?:\/\/)?([^\s"<>`]+?[^|]?))?\$((?:(?:~?[\w-]+(?:=[^$]+)?|_+)(?:[^\\],|$))+)/,
      /** 预存 CSS */
      CCRE =
        /^\/\*\s(\d)(\|)?(.+?)\s\*\/\s((.+?)\s*(?:{\s*[A-Za-z-]+\s*:\s*.+}|,))\s*$/,
      /** 预存注释 */
      CMRE = /\/\*\s*\d.+?\s*\*\//g,
      /** CSS 选择器 */
      CSRE = /^(.+?)\s*{\s*[A-Za-z-]+\s*:\s*.+}\s*$/,
      BROptions = [
        "elemhide",
        "ehide",
        "specifichide",
        "shide",
        "generichide",
        "ghide",
      ],
      CRFlags = ["##", "#@#", "#?#", "#@?#", "#$#", "#@$#", "#$?#", "#@$?#"],
      styleBoxes = ["genHideCss", "genExtraCss", "spcHideCss", "spcExtraCss"];
    /**
     * 处理 禁用元素隐藏规则
     * @param rule 禁用元素隐藏规则
     * @returns 失败返回 null，成功返回 { rule: BRule; bad: boolean }
     */
    function bRuleSpliter(rule) {
      const group = BRRE.exec(rule);
      if (!group) {
        return null;
      }
      const [, regex, pipe, proto, body, option] = group,
        options = option.split(","),
        separatorChar = String.raw`[^\w\.%-]`,
        anyChar = '(?:[^\\s"<>`]*)',
        eh = hasSome(options, ["elemhide", "ehide"]),
        sh = hasSome(options, ["specifichide", "shide"]),
        gh = hasSome(options, ["generichide", "ghide"]);
      let domains = [];
      for (const opt of options) {
        if (opt.startsWith("domain=")) {
          domains = opt.slice(7).split("|");
        }
      }
      let match = "";
      if (regex) {
        match = regex;
      } else if (body) {
        match += pipe
          ? proto
            ? `^${proto}`
            : `^https?://(?:[\\w-]+\\.)*?`
          : `^${anyChar}`;
        match += body
          .replaceAll(/[$()+.[\\\]{}-]/g, String.raw`\$&`)
          .replaceAll("^", "$^")
          .replace(/\|$/, "$")
          .replaceAll("|", String.raw`\|`)
          .replace(/\*$/, "")
          .replaceAll("*", anyChar)
          .replace(/\$\^$/, `(?:${separatorChar}.*|$)`)
          .replaceAll("$^", separatorChar);
      } else if (domains.length > 0) {
        match = domains;
      }
      return {
        rule: {
          rule,
          match,
          level: eh || (gh && sh) ? 3 : sh ? 2 : gh ? 1 : 0,
        },
        bad: options.includes("badfilter"),
      };
    }
    /**
     * 判断是否为禁用元素隐藏规则
     * @param {string} rule ABP 规则
     * @returns {boolean} 判断结果
     */
    function isBasicRule(rule) {
      return BRRE.test(rule) && hasSome(rule, BROptions);
    }
    /**
     * 检查 BRule 对象是否匹配应用地址
     * @param {?BRule} rule BRule 对象
     * @param {string=} url 应用地址
     * @returns {number} 应用级别，不匹配返回 0
     */
    function bRuleParser(rule, url = location.href) {
      return rule
        ? (Array.isArray(rule.match) && domainChecker(rule.match)[0]) ||
          (!Array.isArray(rule.match) && new RegExp(rule.match).test(url))
          ? rule.level
          : 0
        : 0;
    }
    /**
     * 裁剪提取 ETag
     * @param {?string} header 请求头中的 ETag 属性字符串
     * @returns {?string} ETag 属性字符串，未找到返回 null
     */
    function getEtag(header) {
      var _a;
      let result = null;
      if (!header) {
        return null;
      }
      for (const re of [
        /[Ee|][Tt|]ag[:=]\s?\[?(?:W\/)?"(?:gz\[)?(\w+)]?"]?/,
        // 海阔世界
        /^(?:W\/)?"(?:gz\[)?(\w+)]?"/,
      ]) {
        result !== null && result !== void 0
          ? result
          : (result = header.match(re));
      }
      return (_a =
        result === null || result === void 0 ? void 0 : result[1]) !== null &&
        _a !== void 0
        ? _a
        : null;
    }
    /**
     * 检查 ABP 域名范围是否匹配当前域名
     * @param {string[]} domains 一组 ABP 域名
     * @param {string=} currDomain 当前域名
     * @returns {boolean[]} [ 是否匹配, 是否是通用规则 ]
     */
    function domainChecker(domains, currentDomain = location.hostname) {
      var _a;
      const results = [],
        invResults = [],
        urlSuffix =
          (_a = /\.+?[\w-]+$/.exec(currentDomain)) === null || _a === void 0
            ? void 0
            : _a[0];
      let totalResult = [0, false],
        black = false,
        white = false,
        match = false;
      for (let domain of domains) {
        const invert = domain.startsWith("~");
        if (invert) {
          domain = domain.slice(1);
        }
        if (domain.endsWith(".*") && urlSuffix) {
          domain = domain.replace(".*", urlSuffix);
        }
        const result = currentDomain.endsWith(domain);
        if (invert) {
          if (result) {
            white = true;
          }
          invResults.push([domain.length, !result]);
        } else {
          if (result) {
            black = true;
          }
          results.push([domain.length, result]);
        }
      }
      if (results.length > 0 && !black) {
        match = false;
      } else if (invResults.length > 0 && !white) {
        match = true;
      } else {
        for (const r of results) {
          if (r[0] >= totalResult[0] && r[1]) {
            totalResult = r;
          }
        }
        for (const r of invResults) {
          if (r[0] >= totalResult[0] && !r[1]) {
            totalResult = r;
          }
        }
        match = totalResult[1];
      }
      return [match, results.length === 0];
    }
    /**
     * 检查“句子”内容或“给定单词”中是否存在任一“匹配单词”
     * @param {(string | string[])} str 一个“句子”或一组“给定单词”
     * @param {string[]} arr 一组“匹配单词”
     * @returns {boolean} 结果
     */
    function hasSome(string_, array) {
      return array.some((word) => string_.includes(word));
    }
    /**
     * 处理 ABP 元素隐藏规则
     * @param {string} rule ABP 元素隐藏规则
     * @returns {(Rule | undefined)} Rule 对象，失败返回 undefined
     */
    function ruleLoader(rule) {
      if (
        hasSome(rule, [
          ":matches-path(",
          ":min-text-length(",
          ":watch-attr(",
          ":-abp-properties(",
          ":matches-property(",
        ])
      ) {
        return;
      }
      rule = rule.trim();
      // 如果 #$# 不包含 {} 就排除
      // 可以尽量排除 Snippet Filters
      if (
        /(?:\w|\*|]|^)#\$#/.test(rule) &&
        !/{\s*[A-Za-z-]+\s*:\s*.+}\s*$/.test(rule)
      ) {
        return;
      }
      // ## -> #?#
      if (
        /(?:\w|\*|]|^)#@?\$?#/.test(rule) &&
        hasSome(rule, [
          ":has(",
          ":-abp-has(",
          "[-ext-has=",
          ":has-text(",
          ":contains(",
          ":-abp-contains(",
          "[-ext-contains=",
          ":matches-css(",
          "[-ext-matches-css=",
          ":matches-css-before(",
          "[-ext-matches-css-before=",
          ":matches-css-after(",
          "[-ext-matches-css-after=",
          ":matches-attr(",
          ":nth-ancestor(",
          ":upward(",
          ":xpath(",
          ":remove()",
          ":not(",
        ])
      ) {
        rule = rule.replace(/(\w|\*|]|^)#(@?\$?)#/, "$1#$2?#");
      }
      // :style(...) 转换
      // example.com#?##id:style(color: red)
      // example.com#$?##id { color: red }
      if (rule.includes(":style(")) {
        rule = rule
          .replace(/(\w|\*|]|^)#(@?)(\??)#/, "$1#$2$$$3#")
          .replace(/:style\(\s*/, " { ")
          .replace(/\s*\)$/, " }");
      }
      // 解构
      const group = CRRE.exec(rule);
      if (group) {
        const [, isDomain, place = "*", flag, sel] = group,
          type = CRFlags.indexOf(flag),
          [match, generic] =
            place === "*"
              ? [true, true]
              : domainChecker(place.split(isDomain ? "|" : ","));
        if (sel && match) {
          return {
            black: type % 2 ? "white" : "black",
            type: Math.floor(type / 2),
            place: (isDomain ? "|" : "") + place,
            generic,
            sel,
          };
        }
      }
    }
    /**
     * 转换 Rule 对象为 CSS 规则或选择器
     * @param {Rule} rule Rule 对象
     * @param {string} preset 默认 CSS 声明，需要带 {}
     * @param {boolean} full css 值，`true` CSS 规则，`false` 选择器带逗号
     * @returns 返回如下对象
     * ```ts
     * type cssO = {
     *   // CSS 规则或选择器
     *   css: string;
     *   // 选择器
     *   sel: string;
     *   // Rule 对象中是否包含 CSS 声明
     *   isStyle: boolean;
     * }
     * ```
     */
    function ruleToCss(rule, preset, full) {
      var _a, _b;
      const isStyle = /}\s*$/.test(rule.sel);
      return {
        css: `/* ${String(rule.type)}${rule.place} */ ${rule.sel + (isStyle ? "" : ",")} \n`,
        sel: isStyle
          ? (_b =
              (_a = CSRE.exec(rule.sel)) === null || _a === void 0
                ? void 0
                : _a[1]) !== null && _b !== void 0
            ? _b
            : rule.sel
          : rule.sel,
        isStyle,
      };
    }
    /**
     * 转换 CSS 规则为 ABP 规则 AdGuard 格式
     * @param {string} css CSS 规则
     * @returns 返回如下对象，失败返回 null
     * ```ts
     * type abpO = {
     *   // ABP 规则
     *   abp: string;
     *   // 选择器
     *   sel: string;
     *   // 规则类型
     *   type: 0 | 1 | 2 | 3;
     * }
     * ```
     */
    function cssToAbp(css) {
      var _a;
      const flags = ["##", "#?#", "#$#", "#$?#"];
      const [, typeString, isDomain, place, style, sel] =
        (_a = CCRE.exec(css)) !== null && _a !== void 0 ? _a : [];
      if (typeString === void 0) {
        return null;
      }
      const type = Number.parseInt(typeString);
      return {
        abp: `${place === "*" ? "" : isDomain ? `[$domain=${place}]` : place}${flags[type]}${type >= 2 ? style : sel}`,
        type,
        sel,
      };
    }
    /**
     * 给 URL 添加时间戳，防止缓存
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest#%E7%BB%95%E8%BF%87%E7%BC%93%E5%AD%98
     * @param {string} url 原始 URL
     * @returns {string} 处理后的 URL
     */
    function addTimeParameter(url) {
      return url + (url.includes("?") ? "&" : "?") + String(Date.now());
    }

    /**
     * 处理所有 BRule 对象，统计得出应用级别
     *
     * 应用级别：
     *
     * 0 应用所有规则
     *
     * 1 只应用特定规则
     *
     * 2 只应用通用规则
     *
     * 3 禁用所有规则
     * @async
     * @returns {Promise.<number>} 应用级别
     */
    function parseBRules() {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        data.appliedLevel = 0;
        const brules =
          (_a = yield values.brules()) !== null && _a !== void 0
            ? _a
            : defaultValues.brules;
        for (const br of brules) {
          const level = bRuleParser(br);
          if (level > 0) {
            data.bRules.push(br);
            if (level !== data.appliedLevel) {
              data.appliedLevel = data.appliedLevel === 0 ? level : 3;
            }
          }
        }
        return data.appliedLevel;
      });
    }
    /**
     * 根据 CSS 容器编号和应用级别，计算是否应用 CSS
     *
     * CSS 容器编号：
     *
     * 0 通用标准 CSS 规则
     *
     * 1 通用扩充 CSS 规则
     *
     * 2 特定标准 CSS 规则
     *
     * 3 特定扩充 CSS 规则
     * @param {number} type CSS 容器编号
     * @returns {boolean} 是否应用 CSS
     */
    function canApplyCss(type) {
      return (data.appliedLevel & (type >= 2 ? 2 : 1)) == 0;
    }

    /**
     * 清空存储规则并更新脚本菜单
     */
    function cleanRules() {
      return __awaiter(this, void 0, void 0, function* () {
        if (
          confirm(`是否清空存储规则 ?

如果要卸载脚本，点击 确定 以后不要刷新，也不要打开任何新页面，
（如果可以）立即清空脚本存储（全选，删除，填 {}，保存），然后删除脚本`)
        ) {
          yield values.rules(null);
          yield values.time(null);
          yield values.etags(null);
          yield values.brules(null);
          const saves = yield getSavedHosts();
          for (const save of saves) {
            yield values.css(null, save);
          }
          data.isClean = true;
          yield gmMenu("update");
          yield gmMenu("export");
          yield gmMenu("count", () => {
            location.reload();
          });
          return;
        }
      });
    }
    /**
     * 生成并自动下载广告拦截报告
     */
    function reportRecord() {
      let text = "";
      function pushRecord(css) {
        const match = cssToAbp(css);
        if (match === null) return;
        const { abp: item, type, sel } = match,
          count =
            type % 2 === 1
              ? ExtendedCss.query(sel).length
              : document.querySelectorAll(sel).length;
        if (count > 0) {
          text += `
! 匹配元素数量: ${String(count)}
${item}
`;
        }
      }
      for (const br of data.bRules) {
        if (br.level > 0) {
          text += `
! 禁用${["", "通用", "特定", "所有"][br.level]}元素隐藏
${br.rule}
`;
        }
      }
      for (const [index, box] of styleBoxes.entries()) {
        if (canApplyCss(index)) {
          for (const css of data[box]
            .split("\n")
            .filter((css, index_, csss) => csss.indexOf(css) === index_))
            pushRecord(css);
        }
      }
      if (text.length > 0) {
        const blobUrl = URL.createObjectURL(
          new Blob([
            `[Adblock Plus 2.0]
! 应用地址:
! ${location.href}
${text}`,
          ]),
        );
        downUrl(blobUrl, `拦截报告_${location.hostname}.txt`);
      } else {
        alert("这个页面没有任何规则生效");
      }
    }
    /**
     * 切换网站禁用状态并自动刷新
     */
    function switchDisabledStat() {
      return __awaiter(this, void 0, void 0, function* () {
        const disaList = yield values.black();
        const disas = disaList !== null && disaList !== void 0 ? disaList : [];
        data.disabled = !disas.includes(location.hostname);
        if (data.disabled) {
          disas.push(location.hostname);
        } else {
          disas.splice(disas.indexOf(location.hostname), 1);
        }
        yield values.black(disas);
        location.reload();
      });
    }

    /**
     * 保存预存的 CSS
     * @async
     * @returns {Promise.<void>}
     */
    function saveCss() {
      return __awaiter(this, void 0, void 0, function* () {
        if (data.autoCleanSize > 0) {
          const cssLength = yield getCssLength();
          if (cssLength[1] >= data.autoCleanSize) {
            const saves = yield getSavedHosts();
            for (const host of saves) {
              yield values.css(null, host);
            }
            yield gmMenu("count", cleanRules);
          }
        }
        const styles = {
          needUpdate: false,
          genHideCss: data.genHideCss,
          genExtraCss: data.genExtraCss,
          spcHideCss: data.spcHideCss,
          spcExtraCss: data.spcExtraCss,
        };
        yield values.css(styles);
        return;
      });
    }
    /**
     * 读取预存的 CSS
     * @async
     * @returns {Promise.<void>}
     */
    function readCss() {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const styles =
          (_a = yield values.css()) !== null && _a !== void 0
            ? _a
            : defaultValues.css;
        if (!hasSome(Object.keys(styles), styleBoxes)) {
          yield values.css(defaultValues.css);
          return;
        }
        for (const sname of styleBoxes) {
          if (styles[sname].length > 0) {
            data.saved = true;
            data.update =
              (_b = styles.needUpdate) !== null && _b !== void 0 ? _b : true;
            data[sname] = styles[sname];
          }
        }
        return;
      });
    }

    /**
     * 计算自定义规则的 Hash
     * @async
     * @param {boolean} saveHash 是否存储 Hash
     * @returns {Promise.<string>} Hash
     */
    function getCustomHash(saveHash) {
      return __awaiter(this, void 0, void 0, function* () {
        if (location.protocol === "https:") {
          const hash = new Uint32Array(
            yield globalThis.crypto.subtle.digest(
              "SHA-1",
              yield new Blob([data.customRules]).arrayBuffer(),
            ),
          ).toString();
          if (saveHash) {
            yield values.hash(hash);
          }
          return hash;
        } else {
          return defaultValues.hash;
        }
      });
    }
    /**
     * 从各个来源收集规则
     * @async
     * @param {boolean} apply 是否立即应用规则
     * @returns {Promise.<void>} 返回空的 Promise
     */
    function initRules(apply) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let abpRules = defaultValues.rules;
        data.receivedRules = "";
        abpRules =
          (_a = yield values.rules()) !== null && _a !== void 0
            ? _a
            : defaultValues.rules;
        for (const rule of preset.onlineRules) {
          const resourceRule = yield getRuleFromResource(rule.标识);
          if (resourceRule && !abpRules[rule.标识]) {
            abpRules[rule.标识] = resourceRule;
          }
        }
        for (const name of Object.keys(abpRules)) {
          data.receivedRules += "\n" + abpRules[name];
        }
        data.allRules = data.customRules + data.receivedRules;
        if (apply) {
          yield parseRules();
        }
        return;
      });
    }
    /**
     * 将所有支持的 ABP 规则筛选后转换为 CSS 和 BRule 对象
     * @async
     * @returns {Promise.<void>} 返回空的 Promise
     */
    function parseRules() {
      return __awaiter(this, void 0, void 0, function* () {
        const bRuleSet = new Set(),
          bRuleBad = [],
          hRules = [
            {
              rules: new Map(),
              whites: new Set(),
            },
            {
              rules: new Map(),
              whites: new Set(),
            },
            {
              rules: new Map(),
              whites: new Set(),
            },
            {
              rules: new Map(),
              whites: new Set(),
            },
          ];
        function addRule(rule, box) {
          const { css, sel, isStyle } = ruleToCss(rule, data.preset);
          const index = (box % 2) + (rule.generic ? 0 : 2);
          const checkResult = ExtendedCss.validate(sel);
          const typeError = isStyle && rule.type < 2;
          if (checkResult.ok && !typeError) {
            data[styleBoxes[index]] += css;
            data.appliedCount++;
          } else {
            console.error(
              "选择器检查错误:",
              rule,
              typeError || checkResult.error,
            );
          }
        }
        for (const rule of data.allRules.split("\n")) {
          if (isBasicRule(rule)) {
            const brule = bRuleSpliter(rule);
            if (brule) {
              if (brule.bad) {
                bRuleBad.push(brule.rule);
              } else {
                bRuleSet.add(brule.rule);
              }
            }
          } else {
            const ruleObject = ruleLoader(rule);
            if (ruleObject !== undefined) {
              if (ruleObject.black === "black") {
                if (!hRules[ruleObject.type].whites.has(ruleObject.sel)) {
                  hRules[ruleObject.type].rules.set(ruleObject.sel, ruleObject);
                }
              } else {
                if (hRules[ruleObject.type].rules.has(ruleObject.sel)) {
                  hRules[ruleObject.type].rules.delete(ruleObject.sel);
                }
                hRules[ruleObject.type].whites.add(ruleObject.sel);
              }
            }
          }
        }
        for (const brule of bRuleBad) bRuleSet.delete(brule);
        yield values.brules([...bRuleSet]);
        for (const [type, rules] of hRules.entries()) {
          for (const rule of rules.rules) addRule(rule[1], type);
        }
        for (const box of styleBoxes) {
          if (data[box] !== "") {
            data[box] +=
              "html > head:valid " +
              data.preset.replaceAll(/^\s{2,}/g, " ").replaceAll("\n", "");
          }
        }
        yield gmMenu("count", cleanRules);
        yield saveCss();
        if (!data.saved) {
          yield styleApply();
        }
        return;
      });
    }
    /**
     * 应用规则
     * @async
     * @returns {Promise.<void>} 返回空的 Promise
     */
    function styleApply() {
      return __awaiter(this, void 0, void 0, function* () {
        if ((yield parseBRules()) === 3) return;
        for (const type of [0, 1, 2, 3]) {
          if (canApplyCss(type)) {
            styleApplyExec(type);
          }
        }
        yield gmMenu("export", reportRecord);
        return;
      });
    }
    /**
     * 应用 CSS
     * @param {number} type CSS 容器编号
     */
    function styleApplyExec(type) {
      const csss = data[styleBoxes[type]]
        .replace(CMRE, "")
        .replaceAll("\n", "");
      if (csss !== "") {
        new ExtendedCss({
          styleSheet: csss,
        }).apply();
        if (!(type % 2 == 1)) {
          void addStyle(csss);
        }
      }
    }

    /**
     * 注册/刷新 更新脚本菜单
     * @async
     */
    function makeInitMenu() {
      return __awaiter(this, void 0, void 0, function* () {
        yield gmMenu("count", cleanRules);
        yield gmMenu("update", () => {
          performUpdate(true)
            .then(() => {
              location.reload();
            })
            .catch(() => {});
        });
        return;
      });
    }
    /**
     * 从 Response 的请求头部提取 ETag
     * @param resp Response
     * @returns {?string} ETag，未找到返回 null
     */
    function extrEtag(resp) {
      const etag = getEtag(
        typeof resp.headers == "object"
          ? // 海阔世界
            resp.headers.etag[0]
          : typeof resp.responseHeaders == "string"
            ? // Tampermonkey
              resp.responseHeaders
            : // Appara
              resp.getAllResponseHeaders(),
      );
      return etag;
    }
    /**
     * 获取订阅规则：存储规则
     * @async
     * @param rule 订阅规则对象
     * @param resp Response
     * @returns {Promise.<void>}
     */
    function storeRule(rule, resp) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _c;
        let savedRules = defaultValues.rules;
        savedRules =
          (_a = yield values.rules()) !== null && _a !== void 0
            ? _a
            : defaultValues.rules;
        if (resp.responseText) {
          savedRules[rule.标识] = rule.筛选后存储
            ? resp.responseText
                .split("\n")
                .filter((rule) => CRRE.test(rule) || isBasicRule(rule))
                .join("\n")
            : resp.responseText;
          yield values.rules(savedRules);
          if (savedRules[rule.标识].length > 0) {
            const etag = extrEtag(resp),
              savedEtags =
                (_c = yield values.etags()) !== null && _c !== void 0
                  ? _c
                  : defaultValues.etags;
            if (etag) {
              savedEtags[rule.标识] = etag;
              yield values.etags(savedEtags);
            }
          }
          data.receivedRules += "\n" + savedRules[rule.标识];
        }
        return;
      });
    }
    /**
     * 获取订阅规则：下载内容
     * @async
     * @param rule 订阅规则对象
     * @returns {Promise.<boolean>} 下载是否成功 (内容不为空)
     */
    function fetchRuleBody(rule) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const url = addTimeParameter(rule.地址);
        const getResp = yield promiseXhr({
          method: "GET",
          responseType: "text",
          url,
        }).catch((error) => {
          console.error("规则:", url, "下载错误:", error);
        });
        if (
          (_a =
            getResp === null || getResp === void 0
              ? void 0
              : getResp.responseText) === null || _a === void 0
            ? void 0
            : _a.length
        ) {
          yield storeRule(rule, getResp);
          return true;
        } else {
          return false;
        }
      });
    }
    /**
     * 获取订阅规则：判断 ETag 并更新
     * @async
     * @param rule 订阅规则对象
     * @param resp Response
     * @returns {Promise.<void>}
     */
    function fetchRuleGet(rule, resp) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const etag = extrEtag(resp),
          savedEtags = yield values.etags();
        if (
          (_a = resp.responseText) === null || _a === void 0
            ? void 0
            : _a.length
        ) {
          yield storeRule(rule, resp);
          return etag ===
            (savedEtags === null || savedEtags === void 0
              ? void 0
              : savedEtags[rule.标识])
            ? Promise.reject(new Error("ETag 一致"))
            : undefined;
        } else {
          if (
            etag ===
            (savedEtags === null || savedEtags === void 0
              ? void 0
              : savedEtags[rule.标识])
          ) {
            throw new Error("ETag 一致");
          } else {
            return (yield fetchRuleBody(rule))
              ? undefined
              : Promise.reject(new Error("GET 失败"));
          }
        }
      });
    }
    /**
     * 获取订阅规则：获取 ETag
     * @async
     * @param rule 订阅规则对象
     * @returns {Promise.<void>}
     */
    function fetchRule(rule) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let headRespError = {};
        const url = addTimeParameter(rule.地址);
        const headResp = yield promiseXhr({
          method: "HEAD",
          responseType: "text",
          url,
        }).catch((error) => {
          headRespError = error;
          console.error("规则:", url, "HEAD 错误:", error);
        });
        if (headResp) {
          yield fetchRuleGet(rule, headResp);
          return;
        } else {
          // Via HEAD 会超时，但可以得到 ETag
          if (
            (_a = headRespError.resp) === null || _a === void 0
              ? void 0
              : _a.responseHeaders
          ) {
            yield fetchRuleGet(rule, headRespError.resp);
          } else {
            throw new Error("HEAD 失败");
          }
          return;
        }
      });
    }
    /**
     * 获取订阅规则：主函数
     * @async
     * @returns {Promise.<void>}
     */
    function fetchRules() {
      return __awaiter(this, void 0, void 0, function* () {
        let hasUpdate = preset.onlineRules.length;
        data.updating = true;
        yield gmMenu("update", () => void 0);
        for (const rule of preset.onlineRules) {
          if (rule.在线更新) {
            yield fetchRule(rule).catch((error) => {
              console.error("获取规则", rule, "发生错误:", error);
              hasUpdate--;
            });
          } else {
            hasUpdate--;
          }
        }
        yield values.time(new Date().toLocaleString("zh-CN"));
        data.updating = false;
        yield makeInitMenu();
        if (hasUpdate > 0) {
          for (const host of yield getSavedHosts()) {
            if (host === location.hostname) {
              yield initRules(true);
            } else {
              const save = yield values.css(void 0, host);
              if (save) {
                save.needUpdate = true;
                yield values.css(save, host);
              }
            }
          }
        }
        return;
      });
    }
    /**
     * 更新订阅规则
     * @async
     * @param {boolean} force 无条件更新
     * @returns {Promise.<void>}
     */
    function performUpdate(force) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const oldTime = new Date(
          (_a = yield values.time()) !== null && _a !== void 0
            ? _a
            : defaultValues.time,
        ).getDate();
        const newTime = new Date().getDate();
        return data.isFrame
          ? Promise.reject(new Error("是 iframe"))
          : force || oldTime !== newTime
            ? fetchRules()
            : Promise.resolve();
      });
    }
    function main() {
      return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!location.protocol.startsWith("http")) return;
        // 初始化 data
        const blacks = yield values.black();
        data.disabled =
          (_a =
            blacks === null || blacks === void 0
              ? void 0
              : blacks.includes(location.hostname)) !== null && _a !== void 0
            ? _a
            : false;
        data.preset = yield getUserConfig("css");
        data.timeout = yield getUserConfig("timeout");
        data.tryCount = yield getUserConfig("tryCount");
        data.tryTimeout = yield getUserConfig("tryTimeout");
        data.headTimeout = yield getUserConfig("headTimeout");
        data.customRules = yield getUserConfig("rules");
        data.autoCleanSize = yield getUserConfig("autoCleanSize");
        data.customRules += "\n" + getComment();
        let finish = false;
        yield gmMenu("disable", switchDisabledStat);
        if (data.disabled) {
          yield gmMenu("count", cleanRules);
          return;
        }
        if (yield getSavedHosts(location.hostname)) {
          yield readCss();
        }
        const hashNow = yield getCustomHash(false);
        const hashStored = yield values.hash();
        saved: {
          yield makeInitMenu();
          if (hashStored !== hashNow) {
            yield getCustomHash(true);
            yield initRules(true);
            break saved;
          }
          if (data.saved) {
            yield styleApply();
            if (!data.update) break saved;
          }
          yield initRules(false);
          if (data.receivedRules.length === 0) {
            yield performUpdate(true);
            yield gmMenu("count");
            yield initRules(true);
            finish = true;
          } else yield parseRules();
        }
        if (!finish) {
          try {
            yield performUpdate(false);
          } catch (error) {
            console.warn("iframe:", location.href, "取消更新:", error);
          }
        }
      });
    }
    void runOnce(data.mutex, main);
  })($presets, $polyfills);
})();
