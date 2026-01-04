// ==UserScript==
// @name                 V2EX.REP - 专注提升 V2EX 主题回复浏览体验
// @name:zh-CN           V2EX.REP - 专注提升 V2EX 主题回复浏览体验
// @namespace            https://github.com/v2hot/v2ex.rep
// @homepageURL          https://github.com/v2hot/v2ex.rep#readme
// @supportURL           https://github.com/v2hot/v2ex.rep/issues
// @version              1.6.5
// @description          专注提升 V2EX 主题回复浏览体验的浏览器扩展/用户脚本。主要功能有 ✅ 修复有被 block 的用户时错位的楼层号；✅ 回复时自动带上楼层号；✅ 显示热门回复；✅ 显示被引用的回复；✅ 查看用户在当前主题下的所有回复与被提及的回复；✅ 自动预加载所有分页，支持解析显示跨页面引用；✅ 回复时上传图片；✅ 无感自动签到；✅ 懒加载用户头像图片；✅ 一直显示感谢按钮 🙏；✅ 一直显示隐藏回复按钮 🙈；✅ 快速发送感谢/快速隐藏回复（no confirm）等。
// @description:zh-CN    专注提升 V2EX 主题回复浏览体验的浏览器扩展/用户脚本。主要功能有 ✅ 修复有被 block 的用户时错位的楼层号；✅ 回复时自动带上楼层号；✅ 显示热门回复；✅ 显示被引用的回复；✅ 查看用户在当前主题下的所有回复与被提及的回复；✅ 自动预加载所有分页，支持解析显示跨页面引用；✅ 回复时上传图片；✅ 无感自动签到；✅ 懒加载用户头像图片；✅ 一直显示感谢按钮 🙏；✅ 一直显示隐藏回复按钮 🙈；✅ 快速发送感谢/快速隐藏回复（no confirm）等。
// @icon                 https://www.v2ex.com/favicon.ico
// @author               Pipecraft
// @license              MIT
// @match                https://*.v2ex.com/*
// @match                https://*.v2ex.co/*
// @run-at               document-start
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM.getValue
// @grant                GM.deleteValue
// @grant                GM.setValue
// @grant                GM_addElement
// @grant                GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/466589/V2EXREP%20-%20%E4%B8%93%E6%B3%A8%E6%8F%90%E5%8D%87%20V2EX%20%E4%B8%BB%E9%A2%98%E5%9B%9E%E5%A4%8D%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/466589/V2EXREP%20-%20%E4%B8%93%E6%B3%A8%E6%8F%90%E5%8D%87%20V2EX%20%E4%B8%BB%E9%A2%98%E5%9B%9E%E5%A4%8D%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==
//
;(() => {
  "use strict"
  var __defProp = Object.defineProperty
  var __getOwnPropSymbols = Object.getOwnPropertySymbols
  var __hasOwnProp = Object.prototype.hasOwnProperty
  var __propIsEnum = Object.prototype.propertyIsEnumerable
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value)
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
      }
    return a
  }
  function deepEqual(a, b) {
    if (a === b) {
      return true
    }
    if (
      typeof a !== "object" ||
      a === null ||
      typeof b !== "object" ||
      b === null
    ) {
      return false
    }
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false
    }
    if (Array.isArray(a)) {
      if (a.length !== b.length) {
        return false
      }
      for (let i2 = 0; i2 < a.length; i2++) {
        if (!deepEqual(a[i2], b[i2])) {
          return false
        }
      }
      return true
    }
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      return false
    }
    for (const key of keysA) {
      if (
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !deepEqual(a[key], b[key])
      ) {
        return false
      }
    }
    return true
  }
  var valueChangeListeners = /* @__PURE__ */ new Map()
  var valueChangeListenerIdCounter = 0
  var valueChangeBroadcastChannel = new BroadcastChannel(
    "gm_value_change_channel"
  )
  var lastKnownValues = /* @__PURE__ */ new Map()
  var pollingIntervalId = null
  var pollingEnabled = false
  function startPolling() {
    if (pollingIntervalId || isNativeListenerSupported() || !pollingEnabled)
      return
    pollingIntervalId = setInterval(async () => {
      const keys = new Set(
        Array.from(valueChangeListeners.values()).map((l) => l.key)
      )
      for (const key of keys) {
        const newValue = await getValue(key)
        if (!lastKnownValues.has(key)) {
          lastKnownValues.set(key, newValue)
          continue
        }
        const oldValue = lastKnownValues.get(key)
        if (!deepEqual(oldValue, newValue)) {
          lastKnownValues.set(key, newValue)
          triggerValueChangeListeners(key, oldValue, newValue, true)
          valueChangeBroadcastChannel.postMessage({ key, oldValue, newValue })
        }
      }
    }, 1500)
  }
  var getScriptHandler = () => {
    if (typeof GM !== "undefined" && GM.info) {
      return GM.info.scriptHandler || ""
    }
    return ""
  }
  var scriptHandler = getScriptHandler().toLowerCase()
  var isIgnoredHandler =
    scriptHandler === "tamp" || scriptHandler.includes("stay")
  var shouldCloneValue = () =>
    scriptHandler === "tamp" || // ScriptCat support addValueChangeListener, don't need to clone
    scriptHandler.includes("stay")
  var isNativeListenerSupported = () =>
    !isIgnoredHandler &&
    typeof GM !== "undefined" &&
    typeof GM.addValueChangeListener === "function"
  function triggerValueChangeListeners(key, oldValue, newValue, remote) {
    const list = Array.from(valueChangeListeners.values()).filter(
      (l) => l.key === key
    )
    for (const l of list) {
      l.callback(key, oldValue, newValue, remote)
    }
  }
  valueChangeBroadcastChannel.addEventListener("message", (event) => {
    const { key, oldValue, newValue } = event.data
    if (shouldCloneValue()) {
      void setValue(key, newValue)
    } else {
      lastKnownValues.set(key, newValue)
      triggerValueChangeListeners(key, oldValue, newValue, true)
    }
  })
  async function getValue(key, defaultValue) {
    if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
      try {
        const value = await GM.getValue(key, defaultValue)
        if (value && typeof value === "object" && shouldCloneValue()) {
          return JSON.parse(JSON.stringify(value))
        }
        return value
      } catch (error) {
        console.warn("GM.getValue failed", error)
      }
    }
    return defaultValue
  }
  async function updateValue(key, newValue, updater) {
    let oldValue
    if (!isNativeListenerSupported()) {
      oldValue = await getValue(key)
    }
    await updater()
    if (!isNativeListenerSupported()) {
      if (deepEqual(oldValue, newValue)) {
        return
      }
      lastKnownValues.set(key, newValue)
      triggerValueChangeListeners(key, oldValue, newValue, false)
      valueChangeBroadcastChannel.postMessage({ key, oldValue, newValue })
    }
  }
  async function setValue(key, value) {
    await updateValue(key, value, async () => {
      if (typeof GM !== "undefined") {
        if (value === void 0 || value === null) {
          if (typeof GM.deleteValue === "function") {
            await GM.deleteValue(key)
          }
        } else if (typeof GM.setValue === "function") {
          await GM.setValue(key, value)
        }
      }
    })
  }
  async function addValueChangeListener(key, callback) {
    if (
      isNativeListenerSupported() &&
      typeof GM !== "undefined" &&
      typeof GM.addValueChangeListener === "function"
    ) {
      return GM.addValueChangeListener(key, callback)
    }
    const id = ++valueChangeListenerIdCounter
    valueChangeListeners.set(id, { key, callback })
    if (!lastKnownValues.has(key)) {
      void getValue(key).then((v) => {
        lastKnownValues.set(key, v)
      })
    }
    startPolling()
    return id
  }
  function safeJsonParse(jsonString, defaultValue) {
    if (jsonString === void 0 || jsonString === null) {
      return defaultValue
    }
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      return defaultValue
    }
  }
  function safeJsonParseWithFallback(jsonString) {
    if (jsonString === void 0) {
      return void 0
    }
    if (jsonString === null) {
      return null
    }
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      return jsonString
    }
  }
  async function getValue2(key, defaultValue) {
    const val = await getValue(key)
    return safeJsonParse(val, defaultValue)
  }
  async function setValue2(key, value) {
    await setValue(
      key,
      value === void 0 || value === null ? void 0 : JSON.stringify(value)
    )
  }
  async function addValueChangeListener2(key, func) {
    return addValueChangeListener(key, (k, oldVal, newVal, remote) => {
      const parsedOld = safeJsonParseWithFallback(oldVal)
      const parsedNew = safeJsonParseWithFallback(newVal)
      func(k, parsedOld, parsedNew, remote)
    })
  }
  var doc = document
  var win = globalThis
  if (typeof String.prototype.replaceAll !== "function") {
    String.prototype.replaceAll = String.prototype.replace
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
    }
  }
  var removeEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.removeEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.removeEventListener(type, listener, options)
    }
  }
  var getAttribute = (element, name) =>
    element && element.getAttribute
      ? element.getAttribute(name) || void 0
      : void 0
  var setAttribute = (element, name, value) => {
    if (element && element.setAttribute) {
      element.setAttribute(name, value)
    }
  }
  var addAttribute = (element, name, value) => {
    const orgValue = getAttribute(element, name)
    if (!orgValue) {
      setAttribute(element, name, value)
    } else if (!orgValue.includes(value)) {
      setAttribute(element, name, orgValue + " " + value)
    }
  }
  var addClass = (element, className) => {
    if (!element || !element.classList) {
      return
    }
    element.classList.add(className)
  }
  var removeClass = (element, className) => {
    if (!element || !element.classList) {
      return
    }
    element.classList.remove(className)
  }
  var hasClass = (element, className) => {
    if (!element || !element.classList) {
      return false
    }
    return element.classList.contains(className)
  }
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = String(values[key]).replace("!important", "")
      }
    }
  }
  var tt = globalThis.trustedTypes
  var escapeHTMLPolicy =
    tt !== void 0 && typeof tt.createPolicy === "function"
      ? tt.createPolicy("beuEscapePolicy", {
          createHTML: (string) => string,
        })
      : void 0
  var createHTML = (html) =>
    escapeHTMLPolicy ? escapeHTMLPolicy.createHTML(html) : html
  var getRootElement = (type) =>
    type === 1
      ? doc.head || doc.body || doc.documentElement
      : type === 2
        ? doc.body || doc.documentElement
        : doc.documentElement
  var setAttributes = (element, attributes) => {
    if (element && attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (value === void 0) {
            continue
          }
          if (/^(value|textContent|innerText)$/.test(name)) {
            element[name] = value
          } else if (/^(innerHTML)$/.test(name)) {
            element.innerHTML = createHTML(value)
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, String(value))
          }
        }
      }
    }
    return element
  }
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addElement = (parentNode, tagName, attributes) => {
    if (typeof parentNode === "string") {
      return addElement(null, parentNode, tagName)
    }
    if (!tagName) {
      return void 0
    }
    if (!parentNode) {
      parentNode = /^(script|link|style|meta)$/.test(tagName)
        ? getRootElement(1)
        : getRootElement(2)
    }
    if (typeof tagName === "string") {
      const element = createElement(tagName, attributes)
      parentNode.append(element)
      return element
    }
    setAttributes(tagName, attributes)
    parentNode.append(tagName)
    return tagName
  }
  var $ = (selector, context = doc) =>
    (context ? context.querySelector(selector) : void 0) || void 0
  var $$ = (selector, context = doc) =>
    // @ts-ignore
    [...(context ? context.querySelectorAll(selector) : [])]
  var actionHref = "javascript:;"
  var getOffsetPosition = (element, referElement) => {
    const position = { top: 0, left: 0 }
    referElement = referElement || doc.body
    while (element && element !== referElement) {
      position.top += element.offsetTop
      position.left += element.offsetLeft
      element = element.offsetParent
    }
    return position
  }
  var runOnceCache = {}
  var runOnce = async (key, func) => {
    if (Object.hasOwn(runOnceCache, key)) {
      return runOnceCache[key]
    }
    const result = await func()
    if (key) {
      runOnceCache[key] = result
    }
    return result
  }
  var cacheStore = {}
  var makeKey = (key) => (Array.isArray(key) ? key.join(":") : key)
  var cache = {
    get: (key) => cacheStore[makeKey(key)],
    add(key, value) {
      cacheStore[makeKey(key)] = value
    },
  }
  var sleep = async (time) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, time)
    })
  var parseInt10 = (number, defaultValue) => {
    if (typeof number === "number" && !Number.isNaN(number)) {
      return number
    }
    if (typeof defaultValue !== "number") {
      defaultValue = Number.NaN
    }
    if (!number) {
      return defaultValue
    }
    const result = Number.parseInt(String(number), 10)
    return Number.isNaN(result) ? defaultValue : result
  }
  var rootFuncArray = []
  var headFuncArray = []
  var bodyFuncArray = []
  var headBodyObserver
  var startObserveHeadBodyExists = () => {
    if (headBodyObserver) {
      return
    }
    headBodyObserver = new MutationObserver(() => {
      if (doc.head && doc.body) {
        headBodyObserver.disconnect()
      }
      if (doc.documentElement && rootFuncArray.length > 0) {
        for (const func of rootFuncArray) {
          func()
        }
        rootFuncArray.length = 0
      }
      if (doc.head && headFuncArray.length > 0) {
        for (const func of headFuncArray) {
          func()
        }
        headFuncArray.length = 0
      }
      if (doc.body && bodyFuncArray.length > 0) {
        for (const func of bodyFuncArray) {
          func()
        }
        bodyFuncArray.length = 0
      }
    })
    headBodyObserver.observe(doc, {
      childList: true,
      subtree: true,
    })
  }
  var runWhenBodyExists = (func) => {
    if (!doc.body) {
      bodyFuncArray.push(func)
      startObserveHeadBodyExists()
      return
    }
    func()
  }
  var isVisible = (element) => {
    const el = element
    if (typeof el.checkVisibility === "function") {
      return el.checkVisibility()
    }
    return element.offsetParent !== null
  }
  var isTouchScreen = () => "ontouchstart" in win
  var throttle = (func, interval) => {
    let timeoutId2 = null
    let next = false
    const handler = (...args) => {
      if (timeoutId2) {
        next = true
      } else {
        func.apply(void 0, args)
        timeoutId2 = setTimeout(() => {
          timeoutId2 = null
          if (next) {
            next = false
            handler()
          }
        }, interval)
      }
    }
    return handler
  }
  var addElement2 =
    typeof GM_addElement === "function"
      ? (parentNode, tagName, attributes) => {
          if (typeof parentNode === "string") {
            return addElement2(null, parentNode, tagName)
          }
          if (!tagName) {
            return void 0
          }
          if (!parentNode) {
            parentNode = /^(script|link|style|meta)$/.test(tagName)
              ? getRootElement(1)
              : getRootElement(2)
          }
          if (typeof tagName === "string") {
            let attributes1
            let attributes2
            if (attributes) {
              const entries1 = []
              const entries2 = []
              for (const entry of Object.entries(attributes)) {
                if (/^(on\w+|innerHTML|class|data-.+)$/.test(entry[0])) {
                  entries2.push(entry)
                } else {
                  entries1.push(entry)
                }
              }
              attributes1 = Object.fromEntries(entries1)
              attributes2 = Object.fromEntries(entries2)
            }
            try {
              const element = GM_addElement(tagName, attributes1 || {})
              setAttributes(element, attributes2)
              parentNode.append(element)
              return element
            } catch (error) {
              console.error("GM_addElement error:", error)
              return addElement(parentNode, tagName, attributes)
            }
          }
          setAttributes(tagName, attributes)
          parentNode.append(tagName)
          return tagName
        }
      : addElement
  var addStyle = (styleText) =>
    addElement2(null, "style", { textContent: styleText })
  var registerMenuCommand = async (name, callback, options) => {
    if (globalThis.self !== globalThis.top) {
      return 0
    }
    if (typeof GM.registerMenuCommand !== "function") {
      console.warn("Do not support GM.registerMenuCommand!")
      return 0
    }
    try {
      return await GM.registerMenuCommand(name, callback, options)
    } catch (error) {
      if (typeof options === "object") {
        try {
          return await GM.registerMenuCommand(name, callback, options.accessKey)
        } catch (error_) {
          console.error("GM.registerMenuCommand error:", error_)
        }
      } else {
        console.error("GM.registerMenuCommand error:", error)
      }
      return 0
    }
  }
  var style_default =
    ':host{all:initial;--browser-extension-settings-background-color: #f2f2f7;--browser-extension-settings-text-color: #444444;--browser-extension-settings-link-color: #217dfc;--browser-extension-settings-border-radius: 8px;--browser-extension-settings-group-background-color: #ffffff;--browser-extension-settings-group-separator-color: #cccccc;--darkreader-border--browser-extension-settings-group-background-color: #303436;--darkreader-bg--browser-extension-settings-group-background-color: #303436;--darkreader-bg--browser-extension-settings-group-separator-color: #181a1b;--sb-track-color: #00000000;--sb-thumb-color: #33334480;--sb-size: 2px;--font-family: "helvetica neue", "microsoft yahei", arial, sans-serif}:host .browser_extension_settings_v2_wrapper{position:fixed;top:10px;right:30px;display:none;z-index:2147483647;border-radius:var(--browser-extension-settings-border-radius);-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important;display:flex;background-color:var(--browser-extension-settings-background-color);font-family:var(--font-family);border-radius:var(--browser-extension-settings-border-radius)}:host .browser_extension_settings_v2_wrapper h1,:host .browser_extension_settings_v2_wrapper h2{border:none;color:var(--browser-extension-settings-text-color);padding:0;font-family:var(--font-family);line-height:normal;letter-spacing:normal}:host .browser_extension_settings_v2_wrapper h1{font-size:26px;font-weight:800;margin:18px 0}:host .browser_extension_settings_v2_wrapper h2{font-size:18px;font-weight:600;margin:14px 0}:host .browser_extension_settings_v2_wrapper footer{display:flex;justify-content:center;flex-direction:column;font-size:11px;margin:10px auto 0px;background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}:host .browser_extension_settings_v2_wrapper footer a{color:var(--browser-extension-settings-link-color) !important;font-family:var(--font-family);text-decoration:none;padding:0}:host .browser_extension_settings_v2_wrapper footer p{text-align:center;padding:0;margin:2px;line-height:13px;font-size:11px;color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}:host .thin_scrollbar{scrollbar-color:var(--sb-thumb-color) var(--sb-track-color);scrollbar-width:thin}:host .thin_scrollbar::-webkit-scrollbar{width:var(--sb-size)}:host .thin_scrollbar::-webkit-scrollbar-track{background:var(--sb-track-color);border-radius:10px}:host .thin_scrollbar::-webkit-scrollbar-thumb{background:var(--sb-thumb-color);border-radius:10px}.browser_extension_settings_v2_main{min-width:300px;max-height:90vh;overflow-y:auto;overflow-x:hidden;border-radius:var(--browser-extension-settings-border-radius);box-sizing:border-box;padding:10px 15px;background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}.browser_extension_settings_v2_main h2{text-align:center;margin:5px 0 0}.browser_extension_settings_v2_main .close-button{cursor:pointer;width:18px;height:18px;opacity:.5;transition:opacity .2s}.browser_extension_settings_v2_main .close-button:hover{opacity:1}.browser_extension_settings_v2_main .option_groups{background-color:var(--browser-extension-settings-group-separator-color);padding:0;border-style:solid;border-color:var(--browser-extension-settings-group-background-color);border-width:6px 15px;border-radius:10px;display:flex;flex-direction:column;gap:1px;margin:10px 0 0}.browser_extension_settings_v2_main .option_groups .action{font-size:14px;padding:6px 0 6px 0;color:var(--browser-extension-settings-link-color);cursor:pointer}.browser_extension_settings_v2_main .bes_external_link{font-size:14px;padding:6px 0 6px 0}.browser_extension_settings_v2_main .bes_external_link a,.browser_extension_settings_v2_main .bes_external_link a:visited,.browser_extension_settings_v2_main .bes_external_link a:hover{color:var(--browser-extension-settings-link-color);font-family:var(--font-family);text-decoration:none;cursor:pointer}.browser_extension_settings_v2_main .option_groups textarea{background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color);font-size:12px;margin:10px 0 10px 0;padding:4px 8px;height:100px;width:100%;border:1px solid #a9a9a9;border-radius:4px;box-sizing:border-box}.browser_extension_settings_v2_main .switch_option,.browser_extension_settings_v2_main .select_option{display:flex;justify-content:space-between;align-items:center;padding:6px 0 6px 0;font-size:14px}.browser_extension_settings_v2_main .option_groups>*{background-color:var(--browser-extension-settings-group-background-color)}.browser_extension_settings_v2_main .bes_option>.bes_icon{width:24px;height:24px;margin-right:10px}.browser_extension_settings_v2_main .bes_option>.bes_title{margin-right:10px;flex-grow:1}.browser_extension_settings_v2_main .bes_option>.bes_select{color:var(--browser-extension-settings-text-color);box-sizing:border-box;background-color:var(--browser-extension-settings-group-background-color);height:24px;padding:0 2px 0 2px;margin:0;border-radius:6px;border:1px solid #ccc}.browser_extension_settings_v2_main .option_groups .bes_tip{position:relative;margin:0;padding:0 15px 0 0;border:none;max-width:none;font-size:14px}.browser_extension_settings_v2_main .option_groups .bes_tip .bes_tip_anchor{cursor:help;text-decoration:underline}.browser_extension_settings_v2_main .option_groups .bes_tip .bes_tip_content{position:absolute;bottom:15px;left:0;background-color:#fff;color:var(--browser-extension-settings-text-color);text-align:left;overflow-y:auto;max-height:300px;padding:10px;display:none;border-radius:5px;-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important}.browser_extension_settings_v2_main .option_groups .bes_tip .bes_tip_anchor:hover+.bes_tip_content,.browser_extension_settings_v2_main .option_groups .bes_tip .bes_tip_content:hover{display:block}.browser_extension_settings_v2_main .option_groups .bes_tip p,.browser_extension_settings_v2_main .option_groups .bes_tip pre{margin:revert;padding:revert}.browser_extension_settings_v2_main .option_groups .bes_tip pre{font-family:Consolas,panic sans,bitstream vera sans mono,Menlo,microsoft yahei,monospace;font-size:13px;letter-spacing:.015em;line-height:120%;white-space:pre;overflow:auto;background-color:#f5f5f5;word-break:normal;overflow-wrap:normal;padding:.5em;border:none}.browser_extension_settings_v2_main .bes_switch_container{--button-width: 51px;--button-height: 24px;--toggle-diameter: 20px;--color-off: #e9e9eb;--color-on: #34c759;width:var(--button-width);height:var(--button-height);position:relative;padding:0;margin:0;flex:none;user-select:none}.browser_extension_settings_v2_main input[type=checkbox]{opacity:0;width:0;height:0;position:absolute}.browser_extension_settings_v2_main .bes_switch{width:100%;height:100%;display:block;background-color:var(--color-off);border-radius:calc(var(--button-height)/2);border:none;cursor:pointer;transition:all .2s ease-out}.browser_extension_settings_v2_main .bes_switch::before{display:none}.browser_extension_settings_v2_main .bes_slider{width:var(--toggle-diameter);height:var(--toggle-diameter);position:absolute;left:2px;top:calc(50% - var(--toggle-diameter)/2);border-radius:50%;background:#fff;box-shadow:0px 3px 8px rgba(0,0,0,.15),0px 3px 1px rgba(0,0,0,.06);transition:all .2s ease-out;cursor:pointer}.browser_extension_settings_v2_main input[type=checkbox]:checked+.bes_switch{background-color:var(--color-on)}.browser_extension_settings_v2_main input[type=checkbox]:checked+.bes_switch .bes_slider{left:calc(var(--button-width) - var(--toggle-diameter) - 2px)}@media(max-width: 500px){:host{right:10px}.browser_extension_settings_v2_main{max-height:85%}}'
  var availableLocales = ["en"]
  var regexCache = /* @__PURE__ */ new Map()
  function initAvailableLocales(array) {
    availableLocales = array
      .map((locale) => locale.trim().toLowerCase())
      .filter(Boolean)
  }
  function isLocale(locale) {
    return locale ? availableLocales.includes(locale.toLowerCase()) : false
  }
  function extractLocaleFromNavigator() {
    if (typeof navigator === "undefined") {
      return void 0
    }
    const languages = navigator.languages || [navigator.language]
    for (const language of languages) {
      const normalizedLang = language.toLowerCase()
      const baseLang = normalizedLang.split("-")[0]
      if (isLocale(normalizedLang)) {
        return normalizedLang
      }
      if (baseLang && isLocale(baseLang)) {
        return baseLang
      }
    }
    return void 0
  }
  function getParameterRegex(index) {
    const pattern = "\\{".concat(index, "\\}")
    if (!regexCache.has(pattern)) {
      regexCache.set(pattern, new RegExp(pattern, "g"))
    }
    return regexCache.get(pattern)
  }
  function initI18n(messageMaps, language) {
    const validLanguage =
      typeof language === "string" && language.trim() ? language.trim() : void 0
    const targetLanguage = (validLanguage || getPrefferedLocale()).toLowerCase()
    const baseLanguage = targetLanguage.split("-")[0]
    const { mergedMessages } = resolveMessageMaps(
      messageMaps,
      targetLanguage,
      baseLanguage
    )
    return function (key, ...parameters) {
      const text = mergedMessages[key] || key
      return parameters.length > 0 && text !== key
        ? interpolateParameters(text, parameters)
        : text
    }
  }
  function resolveMessageMaps(messageMaps, targetLanguage, baseLanguage) {
    const normalizedMaps = Object.fromEntries(
      Object.entries(messageMaps).map(([locale, messages14]) => [
        locale.toLowerCase(),
        messages14,
      ])
    )
    let mergedMessages = {}
    const englishMessages = normalizedMaps.en || normalizedMaps["en-us"] || {}
    mergedMessages = __spreadValues({}, englishMessages)
    if (
      isLocale(baseLanguage) &&
      normalizedMaps[baseLanguage] &&
      baseLanguage !== "en" &&
      baseLanguage !== "en-us"
    ) {
      mergedMessages = __spreadValues(
        __spreadValues({}, mergedMessages),
        normalizedMaps[baseLanguage]
      )
    }
    if (
      isLocale(targetLanguage) &&
      normalizedMaps[targetLanguage] &&
      targetLanguage !== baseLanguage
    ) {
      mergedMessages = __spreadValues(
        __spreadValues({}, mergedMessages),
        normalizedMaps[targetLanguage]
      )
    }
    return { mergedMessages }
  }
  function interpolateParameters(text, parameters) {
    let result = text
    for (const [i2, parameter] of parameters.entries()) {
      const regex = getParameterRegex(i2 + 1)
      result = result.replace(regex, String(parameter))
    }
    return result
  }
  function getPrefferedLocale() {
    return extractLocaleFromNavigator() || "en"
  }
  function createSwitch(options = {}) {
    const container = createElement("label", { class: "bes_switch_container" })
    const checkbox = createElement(
      "input",
      options.checked ? { type: "checkbox", checked: "" } : { type: "checkbox" }
    )
    addElement2(container, checkbox)
    const switchElm = createElement("span", { class: "bes_switch" })
    addElement2(switchElm, "span", { class: "bes_slider" })
    addElement2(container, switchElm)
    if (options.onchange) {
      addEventListener(checkbox, "change", options.onchange)
    }
    return container
  }
  function createSwitchOption(icon, text, options) {
    if (typeof text !== "string") {
      return createSwitchOption(void 0, icon, text)
    }
    const div = createElement("div", { class: "switch_option bes_option" })
    if (icon) {
      addElement2(div, "img", { src: icon, class: "bes_icon" })
    }
    addElement2(div, "span", { textContent: text, class: "bes_title" })
    div.append(createSwitch(options))
    return div
  }
  var besVersion = 81
  var messages = {
    "settings.title": "Settings",
    "settings.otherExtensions": "Other Extensions",
    "settings.locale": "Language",
    "settings.systemLanguage": "System Language",
    "settings.displaySettingsButtonInSideMenu":
      "Display Settings Button in Side Menu",
    "settings.menu.settings": "\u2699\uFE0F Settings",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Add usertags to links",
    "settings.extensions.links-helper.title": "\u{1F517} Links Helper",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX Minimalist (\u6781\u7B80\u98CE\u683C)",
    "settings.extensions.replace-ugly-avatars.title": "Replace Ugly Avatars",
    "settings.extensions.more-by-pipecraft.title":
      "Find more useful userscripts",
  }
  var en_default = messages
  var messages2 = {
    "settings.title": "\u8BBE\u7F6E",
    "settings.otherExtensions": "\u5176\u4ED6\u6269\u5C55",
    "settings.locale": "\u8BED\u8A00",
    "settings.systemLanguage": "\u7CFB\u7EDF\u8BED\u8A00",
    "settings.displaySettingsButtonInSideMenu":
      "\u5728\u4FA7\u8FB9\u83DC\u5355\u4E2D\u663E\u793A\u8BBE\u7F6E\u6309\u94AE",
    "settings.menu.settings": "\u2699\uFE0F \u8BBE\u7F6E",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F \u5C0F\u9C7C\u6807\u7B7E (UTags) - \u4E3A\u94FE\u63A5\u6DFB\u52A0\u7528\u6237\u6807\u7B7E",
    "settings.extensions.links-helper.title":
      "\u{1F517} \u94FE\u63A5\u52A9\u624B",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \u6781\u7B80\u98CE\u683C",
    "settings.extensions.replace-ugly-avatars.title":
      "\u8D50\u4F60\u4E2A\u5934\u50CF\u5427",
    "settings.extensions.more-by-pipecraft.title":
      "\u66F4\u591A\u6709\u8DA3\u7684\u811A\u672C",
  }
  var zh_cn_default = messages2
  var messages3 = {
    "settings.title": "\u8A2D\u5B9A",
    "settings.otherExtensions": "\u5176\u4ED6\u64F4\u5145\u529F\u80FD",
    "settings.locale": "\u8A9E\u8A00",
    "settings.systemLanguage": "\u7CFB\u7D71\u8A9E\u8A00",
    "settings.displaySettingsButtonInSideMenu":
      "\u5728\u5074\u908A\u9078\u55AE\u4E2D\u986F\u793A\u8A2D\u5B9A\u6309\u9215",
    "settings.menu.settings": "\u2699\uFE0F \u8A2D\u5B9A",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F \u5C0F\u9B5A\u6A19\u7C64 (UTags) - \u70BA\u9023\u7D50\u6DFB\u52A0\u7528\u6236\u6A19\u7C64",
    "settings.extensions.links-helper.title":
      "\u{1F517} \u9023\u7D50\u52A9\u624B",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \u6975\u7C21\u98A8\u683C",
    "settings.extensions.replace-ugly-avatars.title":
      "\u8CDC\u4F60\u500B\u982D\u50CF\u5427",
    "settings.extensions.more-by-pipecraft.title":
      "\u66F4\u591A\u6709\u8DA3\u7684\u8173\u672C",
  }
  var zh_hk_default = messages3
  var messages4 = {
    "settings.title": "\u8A2D\u5B9A",
    "settings.otherExtensions": "\u5176\u4ED6\u64F4\u5145\u529F\u80FD",
    "settings.locale": "\u8A9E\u8A00",
    "settings.systemLanguage": "\u7CFB\u7D71\u8A9E\u8A00",
    "settings.displaySettingsButtonInSideMenu":
      "\u5728\u5074\u908A\u9078\u55AE\u4E2D\u986F\u793A\u8A2D\u5B9A\u6309\u9215",
    "settings.menu.settings": "\u2699\uFE0F \u8A2D\u5B9A",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F \u5C0F\u9B5A\u6A19\u7C64 (UTags) - \u70BA\u9023\u7D50\u65B0\u589E\u4F7F\u7528\u8005\u6A19\u7C64",
    "settings.extensions.links-helper.title":
      "\u{1F517} \u9023\u7D50\u52A9\u624B",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \u6975\u7C21\u98A8\u683C",
    "settings.extensions.replace-ugly-avatars.title":
      "\u66FF\u63DB\u919C\u964B\u7684\u982D\u50CF",
    "settings.extensions.more-by-pipecraft.title":
      "\u66F4\u591A\u6709\u8DA3\u7684\u8173\u672C",
  }
  var zh_tw_default = messages4
  var messages5 = {
    "settings.title": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    "settings.otherExtensions":
      "\u0414\u0440\u0443\u0433\u0438\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F",
    "settings.locale": "\u042F\u0437\u044B\u043A",
    "settings.systemLanguage":
      "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439 \u044F\u0437\u044B\u043A",
    "settings.displaySettingsButtonInSideMenu":
      "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0432 \u0431\u043E\u043A\u043E\u0432\u043E\u043C \u043C\u0435\u043D\u044E",
    "settings.menu.settings":
      "\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u0442\u0435\u0433\u0438 \u043A \u0441\u0441\u044B\u043B\u043A\u0430\u043C",
    "settings.extensions.links-helper.title":
      "\u{1F517} \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0441\u0441\u044B\u043B\u043E\u043A",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C",
    "settings.extensions.replace-ugly-avatars.title":
      "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0435\u043A\u0440\u0430\u0441\u0438\u0432\u044B\u0435 \u0430\u0432\u0430\u0442\u0430\u0440\u044B",
    "settings.extensions.more-by-pipecraft.title":
      "\u041D\u0430\u0439\u0442\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0445 \u0441\u043A\u0440\u0438\u043F\u0442\u043E\u0432",
  }
  var ru_default = messages5
  var messages6 = {
    "settings.title": "\uC124\uC815",
    "settings.otherExtensions":
      "\uAE30\uD0C0 \uD655\uC7A5 \uD504\uB85C\uADF8\uB7A8",
    "settings.locale": "\uC5B8\uC5B4",
    "settings.systemLanguage": "\uC2DC\uC2A4\uD15C \uC5B8\uC5B4",
    "settings.displaySettingsButtonInSideMenu":
      "\uC0AC\uC774\uB4DC \uBA54\uB274\uC5D0 \uC124\uC815 \uBC84\uD2BC \uD45C\uC2DC",
    "settings.menu.settings": "\u2699\uFE0F \uC124\uC815",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - \uB9C1\uD06C\uC5D0 \uC0AC\uC6A9\uC790 \uD0DC\uADF8 \uCD94\uAC00",
    "settings.extensions.links-helper.title":
      "\u{1F517} \uB9C1\uD06C \uB3C4\uC6B0\uBBF8",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \uBBF8\uB2C8\uBA40 \uC2A4\uD0C0\uC77C",
    "settings.extensions.replace-ugly-avatars.title":
      "\uBABB\uC0DD\uAE34 \uC544\uBC14\uD0C0 \uAD50\uCCB4",
    "settings.extensions.more-by-pipecraft.title":
      "\uB354 \uC720\uC6A9\uD55C \uC0AC\uC6A9\uC790 \uC2A4\uD06C\uB9BD\uD2B8 \uCC3E\uAE30",
  }
  var ko_default = messages6
  var messages7 = {
    "settings.title": "\u8A2D\u5B9A",
    "settings.otherExtensions":
      "\u305D\u306E\u4ED6\u306E\u62E1\u5F35\u6A5F\u80FD",
    "settings.locale": "\u8A00\u8A9E",
    "settings.systemLanguage": "\u30B7\u30B9\u30C6\u30E0\u8A00\u8A9E",
    "settings.displaySettingsButtonInSideMenu":
      "\u30B5\u30A4\u30C9\u30E1\u30CB\u30E5\u30FC\u306B\u8A2D\u5B9A\u30DC\u30BF\u30F3\u3092\u8868\u793A",
    "settings.menu.settings": "\u2699\uFE0F \u8A2D\u5B9A",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - \u30EA\u30F3\u30AF\u306B\u30E6\u30FC\u30B6\u30FC\u30BF\u30B0\u3092\u8FFD\u52A0",
    "settings.extensions.links-helper.title":
      "\u{1F517} \u30EA\u30F3\u30AF\u30D8\u30EB\u30D1\u30FC",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX \u30DF\u30CB\u30DE\u30EB\u30B9\u30BF\u30A4\u30EB",
    "settings.extensions.replace-ugly-avatars.title":
      "\u919C\u3044\u30A2\u30D0\u30BF\u30FC\u3092\u7F6E\u304D\u63DB\u3048\u308B",
    "settings.extensions.more-by-pipecraft.title":
      "\u3088\u308A\u4FBF\u5229\u306A\u30E6\u30FC\u30B6\u30FC\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u898B\u3064\u3051\u308B",
  }
  var ja_default = messages7
  var messages8 = {
    "settings.title": "Param\xE8tres",
    "settings.otherExtensions": "Autres extensions",
    "settings.locale": "Langue",
    "settings.systemLanguage": "Langue du syst\xE8me",
    "settings.displaySettingsButtonInSideMenu":
      "Afficher le bouton de param\xE8tres dans le menu lat\xE9ral",
    "settings.menu.settings": "\u2699\uFE0F Param\xE8tres",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Ajouter des balises utilisateur aux liens",
    "settings.extensions.links-helper.title": "\u{1F517} Assistant de liens",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title": "v2ex.min - Style minimaliste V2EX",
    "settings.extensions.replace-ugly-avatars.title":
      "Remplacer les avatars laids",
    "settings.extensions.more-by-pipecraft.title":
      "Trouver plus de scripts utilisateur utiles",
  }
  var fr_default = messages8
  var messages9 = {
    "settings.title": "Einstellungen",
    "settings.otherExtensions": "Andere Erweiterungen",
    "settings.locale": "Sprache",
    "settings.systemLanguage": "Systemsprache",
    "settings.displaySettingsButtonInSideMenu":
      "Einstellungsschaltfl\xE4che im Seitenmen\xFC anzeigen",
    "settings.menu.settings": "\u2699\uFE0F Einstellungen",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Benutzer-Tags zu Links hinzuf\xFCgen",
    "settings.extensions.links-helper.title": "\u{1F517} Link-Assistent",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - V2EX Minimalistischer Stil",
    "settings.extensions.replace-ugly-avatars.title":
      "H\xE4ssliche Avatare ersetzen",
    "settings.extensions.more-by-pipecraft.title":
      "Weitere n\xFCtzliche Benutzerskripte finden",
  }
  var de_default = messages9
  var messages10 = {
    "settings.title": "Impostazioni",
    "settings.otherExtensions": "Altre estensioni",
    "settings.locale": "Lingua",
    "settings.systemLanguage": "Lingua del sistema",
    "settings.displaySettingsButtonInSideMenu":
      "Mostra pulsante impostazioni nel menu laterale",
    "settings.menu.settings": "\u2699\uFE0F Impostazioni",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Aggiungi tag utente ai collegamenti",
    "settings.extensions.links-helper.title":
      "\u{1F517} Assistente collegamenti",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title": "v2ex.min - Stile minimalista V2EX",
    "settings.extensions.replace-ugly-avatars.title":
      "Sostituisci avatar brutti",
    "settings.extensions.more-by-pipecraft.title":
      "Trova pi\xF9 script utente utili",
  }
  var it_default = messages10
  var messages11 = {
    "settings.title": "Configuraci\xF3n",
    "settings.otherExtensions": "Otras extensiones",
    "settings.locale": "Idioma",
    "settings.systemLanguage": "Idioma del sistema",
    "settings.displaySettingsButtonInSideMenu":
      "Mostrar bot\xF3n de configuraci\xF3n en el men\xFA lateral",
    "settings.menu.settings": "\u2699\uFE0F Configuraci\xF3n",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Agregar etiquetas de usuario a los enlaces",
    "settings.extensions.links-helper.title": "\u{1F517} Asistente de enlaces",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title": "v2ex.min - Estilo minimalista V2EX",
    "settings.extensions.replace-ugly-avatars.title":
      "Reemplazar avatares feos",
    "settings.extensions.more-by-pipecraft.title":
      "Encontrar m\xE1s scripts de usuario \xFAtiles",
  }
  var es_default = messages11
  var messages12 = {
    "settings.title": "Configura\xE7\xF5es",
    "settings.otherExtensions": "Outras extens\xF5es",
    "settings.locale": "Idioma",
    "settings.systemLanguage": "Idioma do sistema",
    "settings.displaySettingsButtonInSideMenu":
      "Exibir bot\xE3o de configura\xE7\xF5es no menu lateral",
    "settings.menu.settings": "\u2699\uFE0F Configura\xE7\xF5es",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Adicionar tags de usu\xE1rio aos links",
    "settings.extensions.links-helper.title": "\u{1F517} Assistente de links",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title": "v2ex.min - Estilo minimalista V2EX",
    "settings.extensions.replace-ugly-avatars.title":
      "Substituir avatares feios",
    "settings.extensions.more-by-pipecraft.title":
      "Encontrar mais scripts de usu\xE1rio \xFAteis",
  }
  var pt_default = messages12
  var messages13 = {
    "settings.title": "C\xE0i \u0111\u1EB7t",
    "settings.otherExtensions": "Ti\u1EC7n \xEDch m\u1EDF r\u1ED9ng kh\xE1c",
    "settings.locale": "Ng\xF4n ng\u1EEF",
    "settings.systemLanguage": "Ng\xF4n ng\u1EEF h\u1EC7 th\u1ED1ng",
    "settings.displaySettingsButtonInSideMenu":
      "Hi\u1EC3n th\u1ECB n\xFAt c\xE0i \u0111\u1EB7t trong menu b\xEAn",
    "settings.menu.settings": "\u2699\uFE0F C\xE0i \u0111\u1EB7t",
    "settings.extensions.utags.title":
      "\u{1F3F7}\uFE0F UTags - Th\xEAm th\u1EBB ng\u01B0\u1EDDi d\xF9ng v\xE0o li\xEAn k\u1EBFt",
    "settings.extensions.links-helper.title":
      "\u{1F517} Tr\u1EE3 l\xFD li\xEAn k\u1EBFt",
    "settings.extensions.v2ex.rep.title":
      "V2EX.REP - \u4E13\u6CE8\u63D0\u5347 V2EX \u4E3B\u9898\u56DE\u590D\u6D4F\u89C8\u4F53\u9A8C",
    "settings.extensions.v2ex.min.title":
      "v2ex.min - Phong c\xE1ch t\u1ED1i gi\u1EA3n V2EX",
    "settings.extensions.replace-ugly-avatars.title":
      "Thay th\u1EBF avatar x\u1EA5u",
    "settings.extensions.more-by-pipecraft.title":
      "T\xECm th\xEAm script ng\u01B0\u1EDDi d\xF9ng h\u1EEFu \xEDch",
  }
  var vi_default = messages13
  var localeMap = {
    en: en_default,
    "en-us": en_default,
    zh: zh_cn_default,
    "zh-cn": zh_cn_default,
    "zh-hk": zh_hk_default,
    "zh-tw": zh_tw_default,
    ru: ru_default,
    "ru-ru": ru_default,
    ko: ko_default,
    "ko-kr": ko_default,
    ja: ja_default,
    "ja-jp": ja_default,
    fr: fr_default,
    "fr-fr": fr_default,
    de: de_default,
    "de-de": de_default,
    it: it_default,
    "it-it": it_default,
    es: es_default,
    "es-es": es_default,
    pt: pt_default,
    "pt-pt": pt_default,
    "pt-br": pt_default,
    vi: vi_default,
    "vi-vn": vi_default,
  }
  var localeNames = {
    en: "English",
    "en-us": "English (US)",
    zh: "\u4E2D\u6587",
    "zh-cn": "\u4E2D\u6587 (\u7B80\u4F53)",
    "zh-hk": "\u4E2D\u6587 (\u9999\u6E2F)",
    "zh-tw": "\u4E2D\u6587 (\u53F0\u7063)",
    ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    "ru-ru": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    ko: "\uD55C\uAD6D\uC5B4",
    "ko-kr": "\uD55C\uAD6D\uC5B4",
    ja: "\u65E5\u672C\u8A9E",
    "ja-jp": "\u65E5\u672C\u8A9E",
    fr: "Fran\xE7ais",
    "fr-fr": "Fran\xE7ais",
    de: "Deutsch",
    "de-de": "Deutsch",
    it: "Italiano",
    "it-it": "Italiano",
    es: "Espa\xF1ol",
    "es-es": "Espa\xF1ol",
    pt: "Portugu\xEAs",
    "pt-pt": "Portugu\xEAs",
    "pt-br": "Portugu\xEAs (Brasil)",
    vi: "Ti\u1EBFng Vi\u1EC7t",
    "vi-vn": "Ti\u1EBFng Vi\u1EC7t",
  }
  var locales = Object.keys(localeMap)
  initAvailableLocales(locales)
  var i = initI18n(localeMap, getPrefferedLocale())
  function resetI18n(locale) {
    i = initI18n(localeMap, locale || getPrefferedLocale())
  }
  var prefix = "browser_extension_settings_v2_"
  var getSettingsElement = () => {
    const wrapper = getSettingsWrapper()
    return (
      (wrapper == null
        ? void 0
        : wrapper.querySelector(".".concat(prefix, "main"))) || void 0
    )
  }
  var storageKey = "settings"
  var settingsOptions
  var settingsTable = {}
  var settings = {}
  async function getSettings() {
    let settings2 = await getValue2(storageKey)
    if (!settings2 || typeof settings2 !== "object") {
      settings2 = {}
    }
    return settings2
  }
  async function saveSettingsValue(key, value) {
    const settings2 = await getSettings()
    settings2[key] =
      settingsTable[key] && settingsTable[key].defaultValue === value
        ? void 0
        : value
    await setValue2(storageKey, settings2)
  }
  function getSettingsValue(key) {
    var _a
    return Object.hasOwn(settings, key)
      ? settings[key]
      : (_a = settingsTable[key]) == null
        ? void 0
        : _a.defaultValue
  }
  var closeModal = () => {
    const settingsContainer = getSettingsContainer()
    if (settingsContainer) {
      settingsContainer.remove()
    }
    removeEventListener(doc, "click", onDocumentClick, true)
    removeEventListener(doc, "keydown", onDocumentKeyDown, true)
    removeEventListener(win, "beforeShowSettings", onBeforeShowSettings, true)
  }
  function hideSettings() {
    var _a
    if (win.self !== win.top) {
      ;(_a = win.top) == null
        ? void 0
        : _a.postMessage(
            {
              type: "bes-hide-settings",
              id: settingsOptions == null ? void 0 : settingsOptions.id,
            },
            "*"
          )
      return
    }
    closeModal()
  }
  function isSettingsShown() {
    const settingsContainer = $(".".concat(prefix, "container"))
    return Boolean(settingsContainer)
  }
  var onDocumentClick = (event) => {
    var _a
    const path =
      ((_a = event.composedPath) == null ? void 0 : _a.call(event)) || []
    const insideContainer = path.some((node) => {
      var _a2
      return (
        node instanceof HTMLElement &&
        ((_a2 = node.classList) == null
          ? void 0
          : _a2.contains("".concat(prefix, "container")))
      )
    })
    if (insideContainer) {
      return
    }
    closeModal()
  }
  var onDocumentKeyDown = (event) => {
    if (event.defaultPrevented) {
      return
    }
    if (event.key === "Escape") {
      closeModal()
      event.preventDefault()
    }
  }
  async function updateOptions() {
    if (!getSettingsElement()) {
      return
    }
    for (const key in settingsTable) {
      if (Object.hasOwn(settingsTable, key)) {
        const item = settingsTable[key]
        const type = item.type || "switch"
        switch (type) {
          case "switch": {
            const root = getSettingsElement()
            const checkbox = $(
              '.option_groups .switch_option[data-key="'.concat(
                key,
                '"] input'
              ),
              root
            )
            if (checkbox) {
              checkbox.checked = getSettingsValue(key)
            }
            break
          }
          case "select": {
            const root = getSettingsElement()
            const options = $$(
              '.option_groups .select_option[data-key="'.concat(
                key,
                '"] .bes_select option'
              ),
              root
            )
            for (const option of options) {
              option.selected = option.value === String(getSettingsValue(key))
            }
            break
          }
          case "textarea": {
            const root = getSettingsElement()
            const textArea = $(
              '.option_groups textarea[data-key="'.concat(key, '"]'),
              root
            )
            if (textArea) {
              textArea.value = getSettingsValue(key)
            }
            break
          }
          default: {
            break
          }
        }
      }
    }
    if (typeof settingsOptions.onViewUpdate === "function") {
      const settingsMain = createSettingsElement()
      settingsOptions.onViewUpdate(settingsMain)
    }
  }
  function getSettingsContainer(create = false) {
    const container = $(".".concat(prefix, "container"))
    if (container) {
      const theVersion = parseInt10(container.dataset.besVersion, 0)
      if (theVersion < besVersion) {
        container.dataset.besVersion = String(besVersion)
      }
      return container
    }
    if (create) {
      return addElement2(doc.documentElement, "div", {
        class: "".concat(prefix, "container"),
        "data-bes-version": besVersion,
      })
    }
  }
  function getSettingsShadowRoot() {
    const container = getSettingsContainer(true)
    if (container == null ? void 0 : container.attachShadow) {
      return container.shadowRoot || container.attachShadow({ mode: "open" })
    }
    return void 0
  }
  function getSettingsWrapper() {
    const shadow = getSettingsShadowRoot()
    if (!shadow) {
      const container = getSettingsContainer(true)
      return (
        $(".".concat(prefix, "wrapper"), container) ||
        addElement2(container, "div", { class: "".concat(prefix, "wrapper") })
      )
    }
    let wrapper = shadow.querySelector(".".concat(prefix, "wrapper"))
    if (!wrapper) {
      wrapper = createElement("div", { class: "".concat(prefix, "wrapper") })
      shadow.append(wrapper)
      const existStyle = shadow.querySelector("style")
      if (!existStyle) {
        const styleElm = createElement("style")
        styleElm.textContent = style_default
        shadow.append(styleElm)
      }
    }
    return wrapper
  }
  function createSettingsElement() {
    let settingsMain = getSettingsElement()
    if (!settingsMain) {
      const wrapper = getSettingsWrapper()
      for (const element of $$(".".concat(prefix, "main"))) {
        element.remove()
      }
      settingsMain = addElement2(wrapper, "div", {
        class: "".concat(prefix, "main thin_scrollbar"),
      })
      const header = addElement2(settingsMain, "header", {
        style: "display: flex; justify-content: flex-end;",
      })
      addElement2(header, "div", {
        class: "close-button",
        innerHTML: createHTML(
          '<svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        ),
        onclick: hideSettings,
      })
      if (settingsOptions.title) {
        addElement2(settingsMain, "h2", { textContent: settingsOptions.title })
      }
      const optionGroups = []
      const getOptionGroup = (index) => {
        if (index > optionGroups.length) {
          for (let i2 = optionGroups.length; i2 < index; i2++) {
            const optionGroup = addElement2(settingsMain, "div", {
              class: "option_groups",
            })
            if (optionGroup) optionGroups.push(optionGroup)
          }
        }
        return optionGroups[index - 1]
      }
      for (const key in settingsTable) {
        if (Object.hasOwn(settingsTable, key)) {
          const item = settingsTable[key]
          const type = item.type || "switch"
          const group = item.group || 1
          const optionGroup = getOptionGroup(group)
          switch (type) {
            case "switch": {
              const switchOption = createSwitchOption(item.icon, item.title, {
                async onchange(event) {
                  const checkbox = event.target
                  if (checkbox) {
                    let result = true
                    if (typeof item.onConfirmChange === "function") {
                      result = item.onConfirmChange(checkbox.checked)
                    }
                    if (result) {
                      await saveSettingsValue(key, checkbox.checked)
                    } else {
                      checkbox.checked = !checkbox.checked
                    }
                  }
                },
              })
              switchOption.dataset.key = key
              addElement2(optionGroup, switchOption)
              break
            }
            case "textarea": {
              let timeoutId2
              const div = addElement2(optionGroup, "div", {
                class: "bes_textarea",
              })
              addElement2(div, "textarea", {
                "data-key": key,
                placeholder: item.placeholder || "",
                onkeyup(event) {
                  const textArea = event.target
                  if (timeoutId2) {
                    clearTimeout(timeoutId2)
                    timeoutId2 = void 0
                  }
                  timeoutId2 = setTimeout(async () => {
                    if (textArea) {
                      await saveSettingsValue(key, textArea.value.trim())
                    }
                  }, 100)
                },
              })
              break
            }
            case "action": {
              addElement2(optionGroup, "a", {
                "data-key": key,
                class: "action",
                textContent: item.title,
                onclick: item.onclick,
              })
              break
            }
            case "externalLink": {
              const div4 = addElement2(optionGroup, "div", {
                class: "bes_external_link",
              })
              addElement2(div4, "a", {
                "data-key": key,
                textContent: item.title,
                href: item.url,
                target: "_blank",
              })
              break
            }
            case "select": {
              const div = addElement2(optionGroup, "div", {
                class: "select_option bes_option",
                "data-key": key,
              })
              if (item.icon) {
                addElement2(div, "img", { src: item.icon, class: "bes_icon" })
              }
              addElement2(div, "span", {
                textContent: item.title,
                class: "bes_title",
              })
              const select = addElement2(div, "select", {
                class: "bes_select",
                async onchange() {
                  await saveSettingsValue(key, select.value)
                },
              })
              for (const option of Object.entries(item.options)) {
                addElement2(select, "option", {
                  textContent: option[0],
                  value: option[1],
                })
              }
              break
            }
            case "tip": {
              const tip = addElement2(optionGroup, "div", {
                class: "bes_tip",
              })
              addElement2(tip, "a", {
                class: "bes_tip_anchor",
                textContent: item.title,
              })
              const tipContent = addElement2(tip, "div", {
                class: "bes_tip_content",
                innerHTML: createHTML(item.tipContent),
              })
              break
            }
            default: {
              break
            }
          }
        }
      }
      if (settingsOptions.footer) {
        const footer = addElement2(settingsMain, "footer")
        footer.innerHTML = createHTML(
          typeof settingsOptions.footer === "string"
            ? settingsOptions.footer
            : '<p>Made with \u2764\uFE0F by\n      <a href="https://www.pipecraft.net/" target="_blank">\n        Pipecraft\n      </a></p>'
        )
      }
    }
    return settingsMain
  }
  function addCommonSettings(settingsTable3, options) {
    let maxGroup = 0
    for (const key in settingsTable3) {
      if (Object.hasOwn(settingsTable3, key)) {
        const item = settingsTable3[key]
        const group = item.group || 1
        if (group > maxGroup) {
          maxGroup = group
        }
      }
    }
    if (options.locale) {
      settingsTable3.locale = {
        title: i("settings.locale"),
        type: "select",
        defaultValue: "",
        options: {},
        group: ++maxGroup,
      }
    }
  }
  function handleShowSettingsUrl() {
    const hashString = "#!show-settings-".concat(settingsOptions.id)
    if (location.hash === hashString) {
      setTimeout(showSettings, 100)
      history.replaceState({}, "", location.href.replace(hashString, ""))
    }
  }
  function onBeforeShowSettings() {
    closeModal()
  }
  async function showSettings() {
    var _a
    if (win.self !== win.top) {
      ;(_a = win.top) == null
        ? void 0
        : _a.postMessage(
            {
              type: "bes-show-settings",
              id: settingsOptions == null ? void 0 : settingsOptions.id,
            },
            "*"
          )
      return
    }
    closeModal()
    const event = new CustomEvent("beforeShowSettings")
    win.dispatchEvent(event)
    addEventListener(win, "beforeShowSettings", onBeforeShowSettings, true)
    createSettingsElement()
    await updateOptions()
    addEventListener(doc, "click", onDocumentClick, true)
    addEventListener(doc, "keydown", onDocumentKeyDown, true)
  }
  var lastLocale
  var resetSettingsUI = (optionsProvider) => {
    lastLocale = getSettingsValue("locale") || getPrefferedLocale()
    resetI18n(lastLocale)
    const options = optionsProvider()
    settingsOptions = options
    settingsTable = __spreadValues({}, options.settingsTable)
    const availableLocales2 = options.availableLocales
    addCommonSettings(settingsTable, {
      locale: Boolean(
        availableLocales2 == null ? void 0 : availableLocales2.length
      ),
    })
    if (availableLocales2 == null ? void 0 : availableLocales2.length) {
      initAvailableLocales(availableLocales2)
      const localeSelect = settingsTable.locale
      localeSelect.options = {
        [i("settings.systemLanguage")]: "",
      }
      for (const locale of availableLocales2) {
        const lowerCaseLocale = locale.toLowerCase()
        const displayName = localeNames[lowerCaseLocale] || locale
        localeSelect.options[displayName] = locale
      }
    }
  }
  var initSettings = async (optionsProvider) => {
    await addValueChangeListener2(storageKey, async () => {
      settings = await getSettings()
      await updateOptions()
      const newLocale = getSettingsValue("locale") || getPrefferedLocale()
      if (lastLocale !== newLocale) {
        const isShown = isSettingsShown()
        closeModal()
        resetI18n(newLocale)
        lastLocale = newLocale
        setTimeout(() => {
          resetSettingsUI(optionsProvider)
        }, 50)
        if (isShown) {
          setTimeout(showSettings, 100)
        }
      }
      if (typeof settingsOptions.onValueChange === "function") {
        settingsOptions.onValueChange()
      }
    })
    settings = await getSettings()
    resetSettingsUI(optionsProvider)
    setTimeout(() => {
      resetSettingsUI(optionsProvider)
    }, 50)
    void registerMenuCommand(i("settings.menu.settings"), showSettings, {
      accessKey: "o",
    })
    addEventListener(win, "message", (event) => {
      if (
        !event.data ||
        event.data.id !==
          (settingsOptions == null ? void 0 : settingsOptions.id)
      ) {
        return
      }
      if (event.data.type === "bes-show-settings") {
        void showSettings()
      } else if (event.data.type === "bes-hide-settings") {
        hideSettings()
      }
    })
    handleShowSettingsUrl()
  }
  var content_default =
    'a.icon_button{opacity:1 !important;visibility:visible;margin-right:14px}a.icon_button:last-child{margin-right:0}a.icon_button svg{vertical-align:text-top}body .v2p-controls{opacity:1}body .v2p-controls>a.icon_button{margin-right:0}body .v2p-controls div a{margin-right:15px}body .v2p-controls div a:last-child{margin-right:0}body .v2p-controls a[onclick^=replyOne]{opacity:1 !important}.sticky_rightbar #Rightbar{position:sticky;top:0;max-height:100vh;overflow-y:auto;overflow-x:hidden;--sb-track-color: #00000000;--sb-thumb-color: #33334480;--sb-size: 2px;scrollbar-color:rgba(0,0,0,0) rgba(0,0,0,0);scrollbar-width:thin}.sticky_rightbar #Rightbar:hover{scrollbar-color:var(--sb-thumb-color) var(--sb-track-color)}.sticky_rightbar #Rightbar::-webkit-scrollbar{width:var(--sb-size)}.sticky_rightbar #Rightbar::-webkit-scrollbar-track{background:rgba(0,0,0,0);border-radius:10px}.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-track{background:var(--sb-track-color)}.sticky_rightbar #Rightbar::-webkit-scrollbar-thumb{background:rgba(0,0,0,0);border-radius:10px}.sticky_rightbar #Rightbar:hover::-webkit-scrollbar-thumb{background:var(--sb-thumb-color)}.sticky_rightbar #Rightbar .v2p-tool-box{position:unset}.related_replies_container .related_replies{position:absolute;z-index:10000;width:100%;-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important}.related_replies_container .related_replies_before::before{content:"";display:block;width:100%;height:10000px;position:absolute;margin-top:-10000px;background-color:#334;opacity:50%}.related_replies_container .related_replies_after::after{content:"";display:block;width:100%;height:10000px;position:absolute;background-color:#334;opacity:50%}.related_replies_container.no_replies .related_replies_before::before,.related_replies_container.no_replies .related_replies_after::after{display:none}.related_replies_container .tabs{position:sticky;top:0;display:flex;justify-content:center;z-index:10001}.related_replies_container .tabs a{cursor:pointer}a.no{background-color:rgba(0,0,0,0) !important;color:#1484cd !important;border:1px solid #1484cd;border-radius:3px !important;opacity:1 !important}.cited_floor_number{color:#1484cd !important;cursor:pointer}.reply_content .cell.cited_reply{scale:.85;background-color:#f5f5f5;border:1px solid var(--box-border-color);white-space:initial}.reply_content .cell.cited_reply::after{content:"";display:block;position:absolute;left:0;bottom:0;width:100%;height:100%;opacity:.45;background-color:var(--box-background-color)}.reply_content .cell.cited_reply:hover::after{display:none}.reply_content .cell.cited_reply .vr_wrapper{max-height:150px;overflow:auto;--sb-track-color: #00000000;--sb-thumb-color: #33334480;--sb-size: 2px;scrollbar-color:var(--sb-thumb-color) var(--sb-track-color);scrollbar-width:thin}.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar{width:var(--sb-size)}.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-track{background:var(--sb-track-color);border-radius:10px}.reply_content .cell.cited_reply .vr_wrapper::-webkit-scrollbar-thumb{background:var(--sb-thumb-color);border-radius:10px}[data-vr-opaticy-of-cited-replies="0"] .reply_content .cell.cited_reply::after{display:none}[data-vr-opaticy-of-cited-replies="1"] .reply_content .cell.cited_reply::after{opacity:.2}[data-vr-opaticy-of-cited-replies="3"] .reply_content .cell.cited_reply::after{opacity:.6}.v2p-indent .cell.cited_reply,.v2p-indent .reply_content+.reply_content,.v2p-indent .reply_content+.reply_content+.v2p-expand-btn,.v2p-indent .v2p-collapsed:has(.reply_content+.reply_content)::before,.comment .comment .cell.cited_reply{display:none !important}#top_replies .cell .vr_wrapper{position:relative;max-height:150px;overflow:hidden}#top_replies .cell .vr_wrapper::after{content:"";display:block;position:absolute;bottom:0;width:100%;height:5px;opacity:.8;background-color:var(--box-background-color)}.sticky_paging{position:sticky;bottom:0;background-color:var(--box-background-color) !important;border-top:1px solid var(--box-border-color);z-index:90}.reply-box-sticky{z-index:91}.Night .reply_content .cell.cited_reply{background-color:#1d1f21}.vr_upload_image{cursor:pointer}.vr_upload_image.vr_button_disabled,.vr_upload_image.vr_button_disabled:hover{cursor:default;text-decoration:none;color:var(--color-fade)}.sticky_topic_buttons .topic_buttons,.sticky_topic_buttons .topic_buttons_mobile{position:sticky;bottom:0;background-color:var(--box-background-color) !important;border-top:1px solid var(--box-border-color)}.sticky_topic_buttons .header+.cell{border-bottom:none}'
  var addLinkToAvatars = (replyElement) => {
    var _a, _b
    const memberLink = $('a[href^="/member/"]', replyElement)
    if (
      memberLink &&
      ((_a = memberLink.firstChild) == null ? void 0 : _a.tagName) === "IMG"
    ) {
      return
    }
    const avatar = $("img.avatar", replyElement)
    if (memberLink && avatar) {
      if (((_b = avatar.parentElement) == null ? void 0 : _b.tagName) === "A") {
        return
      }
      const memberLink2 = createElement("a", {
        href: getAttribute(memberLink, "href"),
      })
      avatar.after(memberLink2)
      memberLink2.append(avatar)
    }
  }
  var getReplyElements = () => {
    const firstReply = $('.box .cell[id^="r_"]')
    if (firstReply == null ? void 0 : firstReply.parentElement) {
      const v2exPolishModel = $(".v2p-model-mask")
      return $$('.cell[id^="r_"]', firstReply.parentElement).filter((reply) => {
        if (v2exPolishModel && reply.closest(".v2p-model-mask")) {
          return false
        }
        return true
      })
    }
    return []
  }
  var cachedReplyElements
  var getCachedReplyElements = () => {
    if (!cachedReplyElements) {
      if (doc.readyState === "loading") {
        return getReplyElements()
      }
      cachedReplyElements = getReplyElements()
    }
    return cachedReplyElements
  }
  var resetCachedReplyElements = () => {
    cachedReplyElements = void 0
  }
  var getReplyId = (replyElement) => {
    if (!replyElement) {
      return ""
    }
    let id = replyElement.dataset.id
    if (id) {
      return id
    }
    id = replyElement.id.replace(/((top|related|cited)_)?r_/, "")
    replyElement.dataset.id = id
    return id
  }
  var getFloorNumberElement = (replyElement) =>
    replyElement ? $(".no", replyElement) : void 0
  var getFloorNumber = (replyElement) => {
    if (!replyElement) {
      return 0
    }
    let floorNumber = parseInt10(replyElement.dataset.floorNumber)
    if (floorNumber) {
      return floorNumber
    }
    const numberElement = getFloorNumberElement(replyElement)
    if (numberElement) {
      floorNumber = parseInt10(numberElement.textContent, 0)
      replyElement.dataset.floorNumber = String(floorNumber)
      return floorNumber
    }
    return 0
  }
  var cloneReplyElement = (
    replyElement,
    wrappingTable = false,
    keepCitedReplies = false
  ) => {
    const cloned = replyElement.cloneNode(true)
    const floorNumber = $(".no", cloned)
    const toolbox = $(".fr", cloned)
    if (toolbox && floorNumber) {
      const floorNumber2 = createElement("a", {
        class: "no",
        textContent: floorNumber.textContent,
      })
      addEventListener(floorNumber2, "click", (event) => {
        replyElement.scrollIntoView({ block: "start" })
        event.preventDefault()
        event.stopPropagation()
      })
      toolbox.innerHTML = ""
      toolbox.append(floorNumber2)
    }
    const cells = $$(".cell,.v2p-topic-reply-ref,.nested", cloned)
    for (const cell of cells) {
      if (keepCitedReplies && hasClass(cell, "cited_reply")) {
        continue
      }
      cell.remove()
    }
    if (wrappingTable) {
      const table = cloned.firstElementChild
      if (table && table.tagName === "TABLE") {
        const wrapper = createElement("div", {
          class: "vr_wrapper",
        })
        table.after(wrapper)
        wrapper.append(table)
      }
    }
    return cloned
  }
  var sortReplyElementsByFloorNumberCompareFn = (a, b) =>
    getFloorNumber(a) - getFloorNumber(b)
  var parseUrl = () => {
    const matched = /\/t\/(\d+)(?:.+\bp=(\d+))?/.exec(location.href) || []
    const topicId = matched[1]
    const page = parseInt10(matched[2], 1)
    return { topicId, page }
  }
  var getRepliesCount = () => {
    const elements = $$(".box .cell .gray")
    for (const element of elements) {
      const matched = /(\d+)\s条回复/.exec(element.textContent || "") || []
      if (matched[1]) {
        return parseInt10(matched[1], 0)
      }
    }
    return 0
  }
  var getMemberIdFromMemberLink = (memberLink) => {
    if (!memberLink) {
      return
    }
    return (/member\/(\w+)/.exec(memberLink.href) || [])[1]
  }
  var getReplyAuthorMemberId = (replyElement) => {
    if (!replyElement) {
      return
    }
    const memberLink = $('a[href^="/member/"]', replyElement)
    return getMemberIdFromMemberLink(memberLink)
  }
  var getReplyElementByMemberIdAndFloorNumber = (
    memberId,
    floorNumber,
    type = 0
  ) => {
    if (!memberId || !floorNumber) {
      return
    }
    const replyElements = getCachedReplyElements()
    const length = replyElements.length
    const reverse = floorNumber > length / 2
    let nearestReply
    let nearestReplyGap = 1e3
    for (let i2 = 0; i2 < length; i2++) {
      const replyElement = replyElements[reverse ? length - i2 - 1 : i2]
      const memberId2 = getReplyAuthorMemberId(replyElement)
      if (memberId2 !== memberId) {
        continue
      }
      const floorNumber2 = getFloorNumber(replyElement)
      if (floorNumber2 === floorNumber) {
        return replyElement
      }
      if (type === 1 && floorNumber2 > floorNumber) {
        continue
      }
      if (type === 2 && floorNumber2 < floorNumber) {
        continue
      }
      if (
        !nearestReply ||
        Math.abs(floorNumber - floorNumber2) < nearestReplyGap
      ) {
        nearestReply = replyElement
        nearestReplyGap = Math.abs(floorNumber - floorNumber2)
      }
    }
    return nearestReply
  }
  var getPagingPreviousButtons = () =>
    $$(".normal_page_right").map((right) => right.previousElementSibling)
  var getPagingNextButtons = () => $$(".normal_page_right")
  var getReplyInputElement = () => $("#reply_content")
  function insertTextToReplyInput(text) {
    const replyTextArea = getReplyInputElement()
    if (replyTextArea) {
      const startPos = replyTextArea.selectionStart
      const endPos = replyTextArea.selectionEnd
      const valueToStart = replyTextArea.value.slice(0, startPos)
      const valueFromEnd = replyTextArea.value.slice(endPos)
      replyTextArea.value = ""
        .concat(valueToStart)
        .concat(text)
        .concat(valueFromEnd)
      replyTextArea.focus()
      const newPos = startPos + text.length
      replyTextArea.selectionStart = newPos
      replyTextArea.selectionEnd = newPos
    }
  }
  var replaceReplyInputText = (find, replace, dispatchInputEvent = false) => {
    const replyTextArea = getReplyInputElement()
    if (replyTextArea) {
      const value = replyTextArea.value
      if (typeof value === "string") {
        const index = value.indexOf(find)
        if (index === -1) {
          return
        }
        const endPos = replyTextArea.selectionEnd
        const newValue = value.replace(find, replace)
        replyTextArea.value = newValue
        replyTextArea.focus()
        const newPos =
          index > endPos ? endPos : endPos + newValue.length - value.length
        replyTextArea.selectionStart = newPos
        replyTextArea.selectionEnd = newPos
        if (dispatchInputEvent) {
          replyTextArea.dispatchEvent(new Event("input"))
        }
      }
    }
  }
  var getOnce = () => {
    const onceElement = $("#once")
    if (onceElement == null ? void 0 : onceElement.value) {
      return onceElement.value
    }
    const html = doc.body.innerHTML
    const once = (/once=(\d+)/.exec(html) || [])[1]
    return once
  }
  var addlinkToCitedFloorNumbers = (replyElement) => {
    const content = $(".reply_content", replyElement)
    const memberLinks = $$('a[href^="/member/"]', content)
    for (const memberLink of memberLinks) {
      const previousTextNode = memberLink.previousSibling
      const memberId = getMemberIdFromMemberLink(memberLink)
      if (
        previousTextNode &&
        previousTextNode.nodeType === 3 &&
        previousTextNode.textContent &&
        previousTextNode.textContent.endsWith("@") &&
        memberId
      ) {
        let nextTextNode = memberLink.nextSibling
        while (nextTextNode) {
          if (
            nextTextNode.tagName === "BR" ||
            !nextTextNode.textContent ||
            nextTextNode.textContent.trim().length === 0
          ) {
            nextTextNode = nextTextNode.nextSibling
          } else {
            break
          }
        }
        if (
          !nextTextNode ||
          nextTextNode.nodeType !== 3 ||
          !nextTextNode.textContent ||
          !/^\s*#\d+/.test(nextTextNode.textContent)
        ) {
          continue
        }
        const match = /^(\s*)(#(\d+))(.*)/.exec(nextTextNode.textContent)
        if (!match) {
          continue
        }
        if (match[1]) {
          nextTextNode.before(doc.createTextNode(match[1]))
        }
        if (match[2]) {
          const element = createElement("a", {
            class: "cited_floor_number",
            textContent: match[2],
            "data-member-id": memberId,
            "data-floor-number": match[3],
          })
          nextTextNode.before(element)
        }
        nextTextNode.textContent = match[4]
      }
    }
    runOnce("addlinkToCitedFloorNumbers:document-onclick", () => {
      addEventListener(doc, "click", (event) => {
        const target = event.target
        if (hasClass(target, "cited_floor_number")) {
          const memberId = target.dataset.memberId
          const floorNumber = parseInt10(target.dataset.floorNumber)
          const citedReplyElement = getReplyElementByMemberIdAndFloorNumber(
            memberId,
            floorNumber
          )
          if (citedReplyElement) {
            citedReplyElement.scrollIntoView({ block: "start" })
            event.preventDefault()
            event.stopPropagation()
          }
        }
      })
    })
  }
  var alwaysShowHideButton = (replyElement) => {
    const hideButton = $('a[onclick*="ignoreReply"]', replyElement)
    if (hideButton && !hasClass(hideButton, "icon_button")) {
      addAttribute(hideButton, "class", "icon_button")
      if (!$(".v2p-controls", replyElement)) {
        hideButton.innerHTML =
          '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>'
      }
      const nextSibling = hideButton.nextSibling
      if (nextSibling && nextSibling.nodeType === 3) {
        nextSibling.textContent = ""
      }
    }
  }
  var alwaysShowThankButton = (replyElement) => {
    const thankButton = $('a[onclick*="thankReply"]', replyElement)
    if (thankButton && !hasClass(thankButton, "icon_button")) {
      addAttribute(thankButton, "class", "icon_button")
      if (!$(".v2p-controls", replyElement)) {
        thankButton.innerHTML =
          '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89346 2.35248C3.49195 2.35248 2.35248 3.49359 2.35248 4.90532C2.35248 6.38164 3.20954 7.9168 4.37255 9.33522C5.39396 10.581 6.59464 11.6702 7.50002 12.4778C8.4054 11.6702 9.60608 10.581 10.6275 9.33522C11.7905 7.9168 12.6476 6.38164 12.6476 4.90532C12.6476 3.49359 11.5081 2.35248 10.1066 2.35248C9.27059 2.35248 8.81894 2.64323 8.5397 2.95843C8.27877 3.25295 8.14623 3.58566 8.02501 3.88993C8.00391 3.9429 7.98315 3.99501 7.96211 4.04591C7.88482 4.23294 7.7024 4.35494 7.50002 4.35494C7.29765 4.35494 7.11523 4.23295 7.03793 4.04592C7.01689 3.99501 6.99612 3.94289 6.97502 3.8899C6.8538 3.58564 6.72126 3.25294 6.46034 2.95843C6.18109 2.64323 5.72945 2.35248 4.89346 2.35248ZM1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.0084 1.35248 6.73504 1.76049 7.20884 2.2953C7.32062 2.42147 7.41686 2.55382 7.50002 2.68545C7.58318 2.55382 7.67941 2.42147 7.79119 2.2953C8.265 1.76049 8.99164 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>'
      }
    }
  }
  var fetchOnce = async () => {
    const url = ""
      .concat(location.protocol, "//")
      .concat(location.host, "/poll_once")
    const response = await fetch(url)
    try {
      if (response.status === 200) {
        return await response.text()
      }
    } catch (error) {
      console.error("[V2EX.REP] Unable to refresh once", error)
    }
  }
  var updateOnce = async () => {
    const once = await fetchOnce()
    if (once) {
      globalThis.once = once
      if ($("#once")) {
        $("#once").value = once
      }
      const links = $$('a[href*="once="]')
      for (const link of links) {
        const href = getAttribute(link, "href")
        setAttribute(
          link,
          "href",
          href.replace(/once=\d+/, "once=".concat(once))
        )
      }
    }
  }
  var storageKey2 = "dailyCheckIn"
  var retryCount = 0
  var fetchCheckInApi = async (once) => {
    const url = ""
      .concat(location.protocol, "//")
      .concat(location.host, "/mission/daily/redeem?once=")
      .concat(once)
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return await response.text()
      }
    } catch (error) {
      console.error(error)
      retryCount++
      if (retryCount < 3) {
        await sleep(1e3)
        return fetchCheckInApi(once)
      }
    }
  }
  var dailyCheckIn = async () => {
    var _a
    if ($('a[href*="/signin"]')) {
      return
    }
    const once = getOnce()
    if (!once) {
      return
    }
    const lastCheckInDate = await getValue2(storageKey2)
    if (lastCheckInDate) {
      const now = Date.now()
      if (
        now - lastCheckInDate < 864e5 &&
        new Date(now).getUTCDate() === new Date(lastCheckInDate).getUTCDate()
      ) {
        return
      }
    }
    const result = await fetchCheckInApi(once)
    if (
      result.includes("\u6BCF\u65E5\u767B\u5F55\u5956\u52B1\u5DF2\u9886\u53D6")
    ) {
      console.info("[V2EX.REP] \u7B7E\u5230\u6210\u529F")
      await setValue2(storageKey2, Date.now())
      const checkInLink = $('a[href^="/mission/daily"]')
      if (checkInLink) {
        const box = checkInLink.closest(".box")
        if (box) {
          ;(_a = box.nextElementSibling) == null ? void 0 : _a.remove()
          box.remove()
        }
      }
    } else {
      console.error("[V2EX.REP] \u7B7E\u5230\u5931\u8D25")
    }
    await updateOnce()
  }
  var isTouchScreen1 = isTouchScreen()
  var timeoutId
  var scrollPositionStack = []
  var showModalReplies = (replies, referElement, memberId, type) => {
    var _a
    const main2 = $("#Main") || $(".content")
    if (!main2) {
      return
    }
    if (doc.scrollingElement) {
      scrollPositionStack.push(doc.scrollingElement.scrollTop)
    }
    setStyle(main2, "position: relative;")
    const replyElement = $("#Main")
      ? referElement.closest("#Main .cell")
      : referElement.closest(".cell")
    const relatedBox =
      replyElement == null ? void 0 : replyElement.closest(".related_replies")
    if (replyElement && relatedBox) {
      const lastRelatedRepliesBox = $$(".related_replies_container").pop()
      if (
        lastRelatedRepliesBox == null
          ? void 0
          : lastRelatedRepliesBox.contains(replyElement)
      ) {
      } else {
        closeModal2(true)
      }
    } else {
      closeModal2()
    }
    const container = addElement2(main2, "div", {
      class: "related_replies_container",
    })
    const box = addElement2(container, "div", {
      class: "box related_replies related_replies_before",
    })
    const box2 = addElement2(container, "div", {
      class: "box related_replies related_replies_after",
    })
    box.innerHTML = ""
    box2.innerHTML = ""
    const tabs = addElement2(box, "div", {
      class: "box tabs inner",
    })
    addElement2(tabs, "a", {
      class: !type || type === "all" ? "tab_current" : "tab",
      href: actionHref,
      textContent: "\u5168\u90E8\u56DE\u590D",
      onclick() {
        showRelatedReplies(referElement, memberId)
      },
    })
    addElement2(tabs, "a", {
      class: type === "posted" ? "tab_current" : "tab",
      href: actionHref,
      textContent: "\u4EC5 ".concat(
        memberId,
        " \u53D1\u8868\u7684\u56DE\u590D"
      ),
      onclick() {
        showRelatedReplies(referElement, memberId, "posted")
      },
    })
    const replyId = replyElement ? getReplyId(replyElement) : void 0
    const floorNumber = replyElement ? getFloorNumber(replyElement) : 0
    let beforeCount = 0
    let afterCount = 0
    replies.sort(sortReplyElementsByFloorNumberCompareFn)
    for (const reply of replies) {
      const replyId2 = getReplyId(reply)
      const floorNumber2 = getFloorNumber(reply)
      if (replyId === replyId2) {
        continue
      }
      if (floorNumber > floorNumber2) {
        box.append(reply)
        beforeCount++
      } else {
        box2.append(reply)
        afterCount++
      }
    }
    if (beforeCount === 0 && afterCount === 0) {
      addElement2(box, "div", {
        class: "cell",
        innerHTML:
          '<span class="fade">\u672C\u9875\u9762\u6CA1\u6709\u5176\u4ED6\u56DE\u590D</span>',
      })
      if (!type || type === "all") {
        tabs.remove()
        addClass(container, "no_replies")
        addEventListener(
          referElement,
          "mouseout",
          () => {
            container.remove()
            scrollPositionStack.pop()
          },
          { once: true }
        )
      }
    }
    if (beforeCount === 0 && afterCount > 0) {
      addElement2(box, "div", {
        class: "cell",
        innerHTML:
          '<span class="fade">\u8FD9\u6761\u56DE\u590D\u540E\u9762\u8FD8\u6709 '.concat(
            afterCount,
            " \u6761\u56DE\u590D</span>"
          ),
      })
    }
    if (beforeCount > 0 && afterCount === 0) {
      addElement2(box2, "div", {
        class: "cell",
        innerHTML:
          '<span class="fade">\u8FD9\u6761\u56DE\u590D\u524D\u9762\u8FD8\u6709 '.concat(
            beforeCount,
            " \u6761\u56DE\u590D</span>"
          ),
      })
    }
    const width = main2.offsetWidth + "px"
    if (replyElement) {
      const offsetTop = getOffsetPosition(replyElement, main2).top
      const height = box.offsetHeight || box.clientHeight
      const height2 = replyElement.offsetHeight || replyElement.clientHeight
      setStyle(box, {
        top: offsetTop - height + "px",
        width,
      })
      setStyle(box2, {
        top: offsetTop + height2 + "px",
        width,
      })
    } else if (afterCount > 0) {
      ;(_a = box2.firstChild) == null ? void 0 : _a.before(tabs)
      const headerElement =
        referElement == null ? void 0 : referElement.closest(".header")
      if (headerElement) {
        const offsetTop = getOffsetPosition(headerElement, main2).top
        const height2 = headerElement.offsetHeight || headerElement.clientHeight
        setStyle(box2, {
          top: offsetTop + height2 + "px",
          width,
        })
        box.remove()
      } else {
        const firstReply = $('.box .cell[id^="r_"]')
        const offsetTop = firstReply
          ? Math.max(getOffsetPosition(firstReply, main2).top, win.scrollY)
          : win.scrollY
        setStyle(box, {
          top: offsetTop + "px",
          width,
        })
        setStyle(box2, {
          top: offsetTop + "px",
          width,
        })
        box2.scrollIntoView({ block: "start" })
      }
    } else {
      box.remove()
      box2.remove()
    }
  }
  var filterRepliesPostedByMember = (memberIds) => {
    const replies = []
    const replyElements = getCachedReplyElements()
    for (const replyElement of replyElements) {
      const memberLink = $('a[href^="/member/"]', replyElement)
      if (!memberLink) {
        continue
      }
      const memberId = (/member\/(\w+)/.exec(memberLink.href) || [])[1]
      if (memberIds.includes(memberId)) {
        const cloned = cloneReplyElement(replyElement, true, true)
        cloned.id = "related_" + replyElement.id
        replies.push(cloned)
      }
    }
    return replies
  }
  var filterRepliesByPosterOrMentioned = (memberId) => {
    const replies = []
    const replyElements = getCachedReplyElements()
    for (const replyElement of replyElements) {
      const memberLink = $(
        'a[href^="/member/'.concat(memberId, '"]'),
        replyElement
      )
      if (!memberLink) {
        continue
      }
      let cloned = cloneReplyElement(replyElement, true)
      const memberLink2 = $('a[href^="/member/'.concat(memberId, '"]'), cloned)
      if (!memberLink2) {
        continue
      }
      cloned = cloneReplyElement(replyElement, true, true)
      cloned.id = "related_" + replyElement.id
      replies.push(cloned)
    }
    return replies
  }
  var showRelatedReplies = (memberLink, memberId, type) => {
    const replies =
      type === "posted"
        ? filterRepliesPostedByMember([memberId])
        : filterRepliesByPosterOrMentioned(memberId)
    showModalReplies(replies, memberLink, memberId, type)
  }
  var onMouseOver = (event) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = void 0
    }
    const memberLink = event.target
    timeoutId = setTimeout(() => {
      const memberId = (/member\/(\w+)/.exec(memberLink.href) || [])[1]
      if (memberId) {
        showRelatedReplies(memberLink, memberId)
      }
    }, 700)
  }
  var onMouseOut = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = void 0
    }
  }
  var closeModal2 = (closeLast = false) => {
    for (const element of $$(".related_replies_container").reverse()) {
      element.remove()
      const scrollPosition = scrollPositionStack.pop()
      if (scrollPosition !== void 0 && doc.scrollingElement) {
        doc.scrollingElement.scrollTop = scrollPosition
      }
      if (closeLast) {
        break
      }
    }
  }
  var onDocumentClick2 = (event) => {
    const target = event.target
    if (target.closest(".utags_ul")) {
      if (
        hasClass(target, "utags_captain_tag") ||
        hasClass(target, "utags_captain_tag2")
      ) {
        event.preventDefault()
      }
      return
    }
    if (isTouchScreen1) {
      const memberLink = target.closest('a[href^="/member/"]')
      if (memberLink && !$("img", memberLink)) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
    }
    const floorNumberElement = target.closest(".related_replies a.no")
    if (floorNumberElement) {
      closeModal2()
      return
    }
    const lastRelatedRepliesBox = $$(".related_replies_container").pop()
    const relatedReply = target.closest(".related_replies .cell")
    if (
      relatedReply &&
      (lastRelatedRepliesBox == null
        ? void 0
        : lastRelatedRepliesBox.contains(relatedReply))
    ) {
      return
    }
    const relatedRepliesBox = target.closest(".related_replies_container")
    if (relatedRepliesBox) {
      closeModal2(true)
      return
    }
    closeModal2()
  }
  var onDocumentKeyDown2 = (event) => {
    if (event.defaultPrevented) {
      return
    }
    if (event.key === "Escape") {
      closeModal2(true)
    }
  }
  var filterRepliesByUser = (toogle) => {
    if (toogle) {
      const memberLinks = $$('a[href^="/member/"]')
      for (const memberLink of memberLinks) {
        if (!memberLink.boundEvent) {
          addEventListener(memberLink, "mouseover", onMouseOver, true)
          addEventListener(memberLink, "mouseout", onMouseOut)
          if (isTouchScreen1) {
            addEventListener(memberLink, "touchstart", onMouseOver, true)
          }
          memberLink.boundEvent = true
        }
      }
      if (!doc.boundEvent) {
        addEventListener(doc, "click", onDocumentClick2, true)
        addEventListener(doc, "keydown", onDocumentKeyDown2)
        doc.boundEvent = true
      }
    } else if (doc.boundEvent) {
      closeModal2()
      removeEventListener(doc, "click", onDocumentClick2, true)
      removeEventListener(doc, "keydown", onDocumentKeyDown2)
      doc.boundEvent = false
      const memberLinks = $$('a[href^="/member/"]')
      for (const memberLink of memberLinks) {
        if (memberLink.boundEvent) {
          removeEventListener(memberLink, "mouseover", onMouseOver, true)
          removeEventListener(memberLink, "mouseout", onMouseOut)
          if (isTouchScreen1) {
            removeEventListener(memberLink, "touchstart", onMouseOver, true)
          }
          memberLink.boundEvent = false
        }
      }
    }
  }
  var retryCount2 = 0
  var getTopicReplies = async (topicId, replyCount) => {
    const cached = cache.get(["getTopicReplies", topicId, replyCount])
    if (cached) {
      return cached
    }
    const url = ""
      .concat(location.protocol, "//")
      .concat(location.host, "/api/replies/show.json?topic_id=")
      .concat(topicId)
      .concat(replyCount ? "&replyCount=" + String(replyCount) : "")
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        const result = await response.json()
        cache.add(["getTopicReplies", topicId, replyCount], result)
        return result
      }
    } catch (error) {
      console.error(error)
      retryCount2++
      if (retryCount2 < 3) {
        await sleep(1e3)
        return getTopicReplies(topicId, replyCount)
      }
    }
  }
  var updateFloorNumber = (replyElement, newFloorNumber) => {
    const numberElement = getFloorNumberElement(replyElement)
    if (numberElement) {
      if (!numberElement.dataset.orgNumber) {
        const orgNumber = parseInt10(numberElement.textContent)
        if (orgNumber) {
          numberElement.dataset.orgNumber = String(orgNumber)
        }
      }
      numberElement.textContent = String(newFloorNumber)
      replyElement.dataset.floorNumber = String(newFloorNumber)
    }
  }
  var updateAllFloorNumberById = (id, newFloorNumber) => {
    for (const replyElement of $$(
      "#r_"
        .concat(id, ",\n     #top_r_")
        .concat(id, ",\n     #related_r_")
        .concat(id, ",\n     #cited_r_")
        .concat(id)
    )) {
      updateFloorNumber(replyElement, newFloorNumber)
    }
  }
  var printHiddenReplies = (hiddenReplies) => {
    for (const reply of hiddenReplies) {
      console.group(
        "[V2EX.REP] \u5C4F\u853D\u6216\u9690\u85CF\u7684\u56DE\u590D: #"
          .concat(reply.floorNumber, ", \u7528\u6237 ID: ")
          .concat(reply.userId, ", \u56DE\u590D ID: ")
          .concat(reply.replyId, ", \u56DE\u590D\u5185\u5BB9: ")
      )
      console.info(reply.replyContent)
      console.groupEnd()
    }
  }
  var updateReplyElements = (replies, replyElements, page = 1) => {
    let floorNumberOffset = 0
    let hiddenCount = 0
    let hiddenCount2 = 0
    const dataOffSet = (page - 1) * 100
    const length = Math.min(replies.length - (page - 1) * 100, 100)
    const hiddenReplies = []
    for (let i2 = 0; i2 < length; i2++) {
      const realFloorNumber = i2 + dataOffSet + 1
      const reply = replies[i2 + dataOffSet]
      const id = reply.id
      const element = $("#r_" + id)
      const member = reply.member || {}
      if (!element) {
        hiddenReplies.push({
          floorNumber: realFloorNumber,
          userId: member.username,
          replyId: reply.id,
          replyContent: reply.content,
        })
        hiddenCount++
        continue
      }
      if (!isVisible(element)) {
        hiddenReplies.push({
          floorNumber: realFloorNumber,
          userId: member.username,
          replyId: reply.id,
          replyContent: reply.content,
        })
        hiddenCount2++
      }
      element.found = true
      if (hiddenCount > 0) {
        const numberElement = getFloorNumberElement(element)
        if (numberElement) {
          const orgNumber = parseInt10(
            numberElement.dataset.orgNumber || numberElement.textContent
          )
          if (orgNumber) {
            numberElement.dataset.orgNumber = String(orgNumber)
            floorNumberOffset = realFloorNumber - orgNumber
          }
          numberElement.textContent = String(realFloorNumber)
        }
        updateAllFloorNumberById(id, realFloorNumber)
      }
    }
    console.info(
      "[V2EX.REP] page: "
        .concat(page, ", floorNumberOffset: ")
        .concat(floorNumberOffset, ", hiddenCount: ")
        .concat(hiddenCount + hiddenCount2)
    )
    if (floorNumberOffset > 0) {
      for (const element of replyElements) {
        if (element.found) {
          continue
        }
        const id = getReplyId(element)
        const numberElement = getFloorNumberElement(element)
        if (numberElement) {
          const orgNumber = parseInt10(
            numberElement.dataset.orgNumber || numberElement.textContent
          )
          if (orgNumber) {
            numberElement.dataset.orgNumber = String(orgNumber)
            numberElement.textContent = String(orgNumber + floorNumberOffset)
            updateAllFloorNumberById(id, orgNumber + floorNumberOffset)
          }
        }
      }
    }
    printHiddenReplies(hiddenReplies)
    win.dispatchEvent(new Event("floorNumberUpdated"))
  }
  var isRunning = false
  var splitArrayPerPages = (replyElements) => {
    if (
      !replyElements ||
      replyElements.length === 0 ||
      !replyElements[0].dataset.page
    ) {
      return
    }
    const replyElementsPerPages = []
    let lastPage
    let replyElementsPerPage = []
    for (const reply of replyElements) {
      if (reply.dataset.page !== lastPage) {
        lastPage = reply.dataset.page
        const page = parseInt10(reply.dataset.page)
        replyElementsPerPage = replyElementsPerPages[page - 1] || []
        replyElementsPerPages[page - 1] = replyElementsPerPage
      }
      replyElementsPerPage.push(reply)
    }
    return replyElementsPerPages
  }
  var startFix = async (
    topicId,
    page,
    displayNumber,
    replyElements,
    forceUpdate = false
  ) => {
    if (isRunning) {
      return
    }
    isRunning = true
    const replies = await getTopicReplies(
      topicId,
      forceUpdate ? displayNumber : void 0
    )
    if (replies) {
      const replyElementsPerPages = splitArrayPerPages(replyElements)
      if (replyElementsPerPages) {
        for (let i2 = 0; i2 < replyElementsPerPages.length; i2++) {
          const replyElementsPerPage = replyElementsPerPages[i2]
          if (
            !replyElementsPerPage ||
            (replyElementsPerPage.length > 0 &&
              (displayNumber === replyElementsPerPage.length ||
                displayNumber % 100 === replyElementsPerPage.length % 100 ||
                replyElementsPerPage.length % 100 === 0))
          ) {
            continue
          }
          updateReplyElements(replies, replyElementsPerPage, i2 + 1)
        }
      } else {
        updateReplyElements(replies, replyElements, page)
      }
      if (replies.length < displayNumber) {
        console.info("[V2EX.REP] API data outdated, re-fetch it")
        setTimeout(async () => {
          await startFix(topicId, page, displayNumber, replyElements, true)
        }, 100)
      }
    }
    isRunning = false
  }
  var fixReplyFloorNumbers = async (replyElements) => {
    if (isRunning) {
      return
    }
    const result = parseUrl()
    const topicId = result.topicId
    const page = result.page
    if (!topicId) {
      return
    }
    const displayNumber = getRepliesCount()
    if (
      replyElements.length > 0 &&
      (displayNumber === replyElements.length ||
        displayNumber % 100 === replyElements.length % 100 ||
        replyElements.length % 100 === 0)
    ) {
      return
    }
    await startFix(topicId, page, displayNumber, replyElements)
  }
  var restoreImgSrc = throttle(() => {
    for (const img of $$("img[data-src]")) {
      setAttribute(img, "src", getAttribute(img, "data-src"))
      delete img.dataset.src
    }
  }, 500)
  var lazyLoadAvatars = (replyElement) => {
    const avatar = $("img.avatar", replyElement)
    if (avatar) {
      if (getAttribute(avatar, "loading") === "lazy" || avatar.complete) {
        return
      }
      const src = getAttribute(avatar, "src")
      setAttribute(avatar, "loading", "lazy")
      setAttribute(avatar, "data-src", src)
      setAttribute(
        avatar,
        "src",
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      )
      if (doc.readyState === "complete") {
        setTimeout(restoreImgSrc)
      } else {
        addEventListener(win, "load", restoreImgSrc)
      }
    }
  }
  var retryCount3 = 0
  var getTopicPage = async (topicId, page = 1) => {
    const url = ""
      .concat(location.protocol, "//")
      .concat(location.host, "/t/")
      .concat(topicId, "?p=")
      .concat(page)
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return await response.text()
      }
    } catch (error) {
      console.error(error, "page ".concat(page))
      retryCount3++
      if (retryCount3 < 10) {
        await sleep(1e3)
        return getTopicPage(topicId, page)
      }
    }
  }
  var getReplyElements2 = (html) => {
    const htmlNode = createElement("html")
    htmlNode.innerHTML = html
    return $$('.cell[id^="r_"]', htmlNode)
  }
  var insertReplyElementsToPage = (replyElements, page, inertPoint) => {
    if (!replyElements || replyElements.length === 0 || !inertPoint) {
      return
    }
    for (const replyElement of replyElements) {
      replyElement.dataset.page = String(page)
      if (getSettingsValue("lazyLoadAvatars")) {
        lazyLoadAvatars(replyElement)
      }
      inertPoint.before(replyElement)
    }
  }
  var gotoPage = (page, event) => {
    if (!page) {
      return
    }
    history.pushState(null, "", "?p=".concat(page))
    const main2 = $("#Main") || $(".content")
    const firstReply = $('.cell[data-page="'.concat(page, '"]'), main2)
    if (firstReply) {
      firstReply.scrollIntoView({ block: "start" })
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    for (const pagingElement of $$(".page_current,.page_normal")) {
      if (pagingElement.textContent === String(page)) {
        removeClass(pagingElement, "page_normal")
        addClass(pagingElement, "page_current")
      } else {
        removeClass(pagingElement, "page_current")
        addClass(pagingElement, "page_normal")
      }
    }
    for (const pageInput of $$(".page_input")) {
      pageInput.value = String(page)
    }
    const repliesCount = getRepliesCount()
    const totalPage = Math.ceil(repliesCount / 100)
    for (const button of getPagingPreviousButtons()) {
      if (String(page) === "1") {
        addClass(button, "disable_now")
      } else {
        removeClass(button, "disable_now")
      }
    }
    for (const button of getPagingNextButtons()) {
      if (String(page) === String(totalPage)) {
        addClass(button, "disable_now")
      } else {
        removeClass(button, "disable_now")
      }
    }
  }
  var updatePagingElements = () => {
    runOnce("loadMultiPages:updatePagingElements", () => {
      for (const pagingElement of $$(".page_current,.page_normal")) {
        let element = pagingElement
        if (pagingElement.tagName === "SPAN") {
          const page = pagingElement.textContent
          if (page) {
            const urlObj = new URL(location.href)
            urlObj.searchParams.set("p", page)
            const href = urlObj.toString()
            const aElement = createElement("a", {
              href,
              class: getAttribute(pagingElement, "class"),
            })
            aElement.textContent = page
            pagingElement.replaceWith(aElement)
            element = aElement
          }
        }
        addEventListener(element, "click", (event) => {
          const page = element.textContent
          gotoPage(page, event)
        })
      }
      for (const pageInput of $$(".page_input")) {
        pageInput.removeAttribute("onkeydown")
        addEventListener(
          pageInput,
          "keydown",
          (event) => {
            var _a
            if (event.key === "Enter") {
              gotoPage((_a = event.target) == null ? void 0 : _a.value, event)
              return false
            }
          },
          true
        )
      }
      const buttons = [...getPagingPreviousButtons(), ...getPagingNextButtons()]
      for (const button of buttons) {
        button.removeAttribute("onclick")
        button.removeAttribute("onmouseover")
        button.removeAttribute("onmousedown")
        button.removeAttribute("onmouseleave")
        addEventListener(
          button,
          "mouseover",
          (event) => {
            if (!hasClass(button, "disable_now")) {
              addClass(button, "hover_now")
            }
            event.preventDefault()
            event.stopImmediatePropagation()
          },
          true
        )
        addEventListener(
          button,
          "mousedown",
          (event) => {
            if (!hasClass(button, "disable_now")) {
              addClass(button, "active_now")
            }
            event.preventDefault()
            event.stopImmediatePropagation()
          },
          true
        )
        addEventListener(
          button,
          "mouseleave",
          (event) => {
            removeClass(button, "hover_now")
            removeClass(button, "active_now")
            event.preventDefault()
            event.stopImmediatePropagation()
          },
          true
        )
        addEventListener(
          button,
          "click",
          (event) => {
            var _a
            if (!hasClass(button, "disable_now")) {
              const page = parseInt10(
                (_a = $(".page_input")) == null ? void 0 : _a.value
              )
              if (page) {
                if (hasClass(button, "normal_page_right")) {
                  gotoPage(page + 1, event)
                } else {
                  gotoPage(page - 1, event)
                }
              }
            }
            setTimeout(() => {
              removeClass(button, "hover_now")
              removeClass(button, "active_now")
            }, 100)
            event.preventDefault()
            event.stopImmediatePropagation()
          },
          true
        )
      }
    })
  }
  var loadMultiPages = async () => {
    const repliesCount = getRepliesCount()
    console.info("[V2EX.REP] \u603B\u56DE\u590D\u6570", repliesCount)
    if (repliesCount > 100) {
      const result = parseUrl()
      const topicId = result.topicId
      const currentPage = result.page
      const totalPage = Math.ceil(repliesCount / 100)
      const orgReplyElements = getCachedReplyElements()
      if (orgReplyElements.length === 0) {
        return
      }
      const firstReply = orgReplyElements[0]
      const pageElement = orgReplyElements.at(-1).nextElementSibling
      addClass(pageElement, "sticky_paging")
      updatePagingElements()
      for (const replyElement of orgReplyElements) {
        replyElement.dataset.page = String(currentPage)
      }
      for (let i2 = 1; i2 <= totalPage; i2++) {
        if (i2 === currentPage) {
          continue
        }
        console.info("[V2EX.REP] Fetching page", i2)
        const html = await getTopicPage(topicId, i2)
        if (html) {
          const replyElements = getReplyElements2(html)
          insertReplyElementsToPage(
            replyElements,
            i2,
            i2 < currentPage ? firstReply : pageElement
          )
          win.dispatchEvent(new Event("replyElementsLengthUpdated"))
        }
        await sleep(1e3)
      }
    }
  }
  var quickHideReply = (replyElement) => {
    const hideButton = $('a[onclick*="ignoreReply"]', replyElement)
    if (hideButton) {
      const onclick = getAttribute(hideButton, "onclick")
      if (!onclick.includes("confirm")) {
        return
      }
      setAttribute(
        hideButton,
        "onclick",
        onclick.replace(/.*(ignoreReply\(.+\)).*/, "$1")
      )
      setAttribute(hideButton, "href", actionHref)
      hideButton.outerHTML = hideButton.outerHTML
    }
  }
  var state = 0
  var scrollIntoView = (element) => {
    if (element) {
      element.scrollIntoView({ block: "start" })
    }
  }
  var quickNavigation = () => {
    runOnce("quickNavigation", () => {
      const main2 = $("#Main") || $(".content")
      if (!main2) {
        return
      }
      const isMobile = hasClass(main2, "content")
      addEventListener(doc, "dblclick", (event) => {
        const target = event.target
        if (
          target &&
          ["TEXTAREA", "INPUT", "IMG", "A"].includes(target.tagName)
        ) {
          return
        }
        const selection = win.getSelection()
        if (
          (target == null ? void 0 : target.closest(".box,.cell,.inner")) &&
          selection &&
          !selection.isCollapsed &&
          selection.toString().trim().length > 0
        ) {
          return
        }
        const boxes = $$(".box", main2)
        switch (state++) {
          case 0: {
            scrollIntoView(isMobile ? boxes[2] : boxes[1])
            break
          }
          case 1: {
            scrollIntoView(isMobile ? boxes[3] : boxes[2])
            break
          }
          default: {
            scrollIntoView(boxes[0])
            state = 0
            break
          }
        }
      })
    })
  }
  var quickSendThank = (replyElement) => {
    const thankButton = $('a[onclick*="thankReply"]', replyElement)
    if (thankButton) {
      const replyId = replyElement.id.replace("r_", "")
      const onclick = getAttribute(thankButton, "onclick")
      if (!onclick.includes("confirm")) {
        return
      }
      setAttribute(
        thankButton,
        "onclick",
        onclick.replace(/.*(thankReply\(.+\)).*/, "$1")
      )
      setAttribute(thankButton, "href", actionHref)
      if (hasClass(thankButton.parentElement, "v2p-controls")) {
        const div = createElement("div", {
          id: "thank_area_" + replyId,
        })
        thankButton.after(div)
        const hideButton = $('a[onclick*="ignoreReply"]', replyElement)
        if (hideButton) {
          div.append(hideButton)
        }
        div.append(thankButton)
      }
      thankButton.outerHTML = thankButton.outerHTML
    }
  }
  var replaceState = (newHref) => {
    history.replaceState(null, "", newHref)
  }
  var getVisitedUrl = (href, replyCount) =>
    href.replace(/[?#].*|$/, "#reply".concat(replyCount))
  var markAsVisited = (href, replyCount) => {
    for (
      let count = Math.max(replyCount - 10, 1);
      count <= replyCount;
      count++
    ) {
      replaceState(getVisitedUrl(href, count))
    }
  }
  var removeLocationHash = () => {
    const href = location.href
    const hash = location.hash
    const replyCount = getRepliesCount()
    if (hash == null ? void 0 : hash.startsWith("#reply")) {
      if (replyCount) {
        markAsVisited(href, replyCount)
      }
      replaceState(href.replace(/#.*/, ""))
    } else if (replyCount) {
      markAsVisited(href, replyCount)
      replaceState(href)
    }
  }
  function setFavition(url, type) {
    const element = $('link[rel="shortcut icon"]')
    if (element) {
      setAttributes(element, {
        href: url,
        type: type || "image/png",
      })
    }
  }
  function replaceToGithub() {
    setFavition(
      "https://github.githubassets.com/favicons/favicon.svg",
      "image/svg+xml"
    )
    if (doc.title.includes("V2EX")) {
      doc.title =
        "Issues \xB7 " +
        (doc.title.replace(/( - V2EX|V2EX › |V2EX)/, "") || "github")
    }
  }
  function replaceToAvatar() {
    const main2 = $("#Main") || $(".content")
    if (!main2) {
      return
    }
    const avatar = $('.header img.avatar, td[width="73"] img.avatar', main2)
    if (avatar) {
      setFavition(avatar.src)
      if (!avatar.setFaviconHandler) {
        avatar.setFaviconHandler = true
        addEventListener(avatar, "load", () => {
          setFavition(avatar.src)
        })
      }
    } else {
      setFavition("https://www.v2ex.com/static/favicon.ico")
    }
  }
  function replaceToDefault() {
    const main2 = $("#Main") || $(".content")
    if (!main2) {
      return
    }
    const avatar = $('td[width="73"] img.avatar', main2)
    if (avatar) {
      setFavition(avatar.src)
    } else {
      setFavition("https://www.v2ex.com/static/favicon.ico")
    }
  }
  function replaceFavicon(type) {
    if (type === "github") {
      replaceToGithub()
    } else if (type === "avatar") {
      replaceToAvatar()
    } else {
      replaceToDefault()
    }
  }
  var replyWithFloorNumber = (replyElement, forceUpdate = false) => {
    const replyButton = $('a[onclick^="replyOne"]', replyElement)
    if (replyButton) {
      setAttribute(replyButton, "href", actionHref)
      const onclick = getAttribute(replyButton, "onclick") || ""
      if (onclick.includes("#") && !forceUpdate) {
        return
      }
      const number = getFloorNumber(replyElement)
      if (number) {
        setAttribute(
          replyButton,
          "onclick",
          onclick.replace(
            /replyOne\('(\w+)(?: .*)?'\)/,
            "replyOne('$1 #".concat(number, "')")
          )
        )
        replyButton.outerHTML = replyButton.outerHTML
      }
    }
  }
  var showCitedReplies = (
    replyElement,
    showPreviousCitedReplies,
    forceUpdate = false
  ) => {
    if (
      !forceUpdate &&
      (replyElement.dataset.showCitedReplies || $(".v2p-color-mode-toggle"))
    ) {
      return
    }
    const floorNumber = getFloorNumber(replyElement)
    if (!floorNumber) {
      return
    }
    replyElement.dataset.showCitedReplies = "done"
    for (const element of $$(".cited_reply", replyElement)) {
      element.remove()
    }
    const content = $(".reply_content", replyElement)
    const memberLinks = $$('a[href^="/member/"]', content)
    let hasCitedReplies = false
    for (const memberLink of memberLinks) {
      const textNode = memberLink.previousSibling
      let nextElement = memberLink.nextSibling
      let target = memberLink
      let citedFloorNumber
      if (
        textNode &&
        textNode.nodeType === 3 &&
        textNode.textContent &&
        textNode.textContent.endsWith("@")
      ) {
        const memberId = getMemberIdFromMemberLink(memberLink)
        if (!memberId) {
          continue
        }
        while (
          nextElement &&
          (nextElement.tagName === "BR" ||
            !nextElement.textContent ||
            nextElement.textContent.trim().length === 0 ||
            hasClass(nextElement, "utags_ul"))
        ) {
          target = nextElement
          nextElement = nextElement.nextSibling
        }
        if (nextElement && hasClass(nextElement, "cited_floor_number")) {
          target = nextElement
          citedFloorNumber = parseInt10(nextElement.dataset.floorNumber)
        }
        let citedReplyElement
        if (citedFloorNumber) {
          citedReplyElement = getReplyElementByMemberIdAndFloorNumber(
            memberId,
            citedFloorNumber
          )
        }
        if (!citedReplyElement) {
          citedReplyElement = getReplyElementByMemberIdAndFloorNumber(
            memberId,
            floorNumber - 1,
            1
          )
        }
        if (citedReplyElement) {
          if (
            citedReplyElement.nextElementSibling === replyElement &&
            !hasCitedReplies &&
            showPreviousCitedReplies !== "1"
          ) {
            continue
          }
          const cloned = cloneReplyElement(citedReplyElement, true)
          cloned.removeAttribute("id")
          addClass(cloned, "cited_reply")
          target.after(cloned)
          hasCitedReplies = true
        }
      }
    }
  }
  var done = false
  var reset = () => {
    const element = $("#top_replies")
    if (element) {
      const sep20 = element.previousElementSibling
      if (hasClass(sep20, "sep20")) {
        sep20.remove()
      }
      element.remove()
    }
  }
  var showTopReplies = (replyElements, toggle, forceUpdate = false) => {
    if (!toggle) {
      reset()
      removeClass($("#Wrapper"), "sticky_rightbar")
      done = false
      return
    }
    if (done && !forceUpdate) {
      return
    }
    done = true
    reset()
    addClass($("#Wrapper"), "sticky_rightbar")
    const topReplies = replyElements
      .filter((reply) => {
        var _a
        const heartElement = $('img[alt="\u2764\uFE0F"],.v2p-icon-heart', reply)
        if (heartElement) {
          const childReplies = $$(".reply_content,.cell", reply)
          for (const child of childReplies) {
            if (child.contains(heartElement)) {
              return false
            }
          }
          const thanked = parseInt10(
            (_a = heartElement.nextSibling) == null ? void 0 : _a.textContent,
            0
          )
          if (thanked > 0) {
            reply.thanked = thanked
            return true
          }
        }
        return false
      })
      .sort((a, b) =>
        b.thanked === a.thanked
          ? sortReplyElementsByFloorNumberCompareFn(a, b)
          : b.thanked - a.thanked
      )
    if (topReplies.length > 0) {
      const box = createElement("div", {
        class: "box",
        id: "top_replies",
        innerHTML:
          '<div class="cell"><div class="fr"></div><span class="fade">\u5F53\u524D\u9875\u70ED\u95E8\u56DE\u590D</span></div>',
      })
      for (const element of topReplies) {
        const cloned = cloneReplyElement(element, true)
        cloned.id = "top_" + element.id
        const ago = $(".ago", cloned)
        if (ago) {
          ago.before(createElement("br"))
        }
        box.append(cloned)
      }
      const appendPosition = $("#Rightbar .box")
      const sep20 = createElement("div", {
        class: "sep20",
      })
      if (appendPosition) {
        appendPosition.after(box)
        appendPosition.after(sep20)
      }
    }
  }
  var stickyTopicButtons = (toggle = false) => {
    const main2 = $("#Main") || $(".content")
    if (!main2) {
      return
    }
    if (hasClass(main2, "content")) {
      const buttons = $(".inner", main2)
      if (buttons) {
        addClass(buttons, "topic_buttons_mobile")
      }
    }
    const added = hasClass(main2, "sticky_topic_buttons")
    if (toggle && !added) {
      addClass(main2, "sticky_topic_buttons")
    } else if (!toggle && added) {
      removeClass(main2, "sticky_topic_buttons")
    }
  }
  var imgurClientIdPool = [
    "3107b9ef8b316f3",
    "442b04f26eefc8a",
    "59cfebe717c09e4",
    "60605aad4a62882",
    "6c65ab1d3f5452a",
    "83e123737849aa9",
    "9311f6be1c10160",
    "c4a4a563f698595",
    "81be04b9e4a08ce",
  ]
  async function uploadImageToImgur(file) {
    const formData = new FormData()
    formData.append("image", file)
    const clientIds = [...imgurClientIdPool]
    for (let i2 = clientIds.length - 1; i2 > 0; i2--) {
      const j = Math.floor(Math.random() * (i2 + 1))
      ;[clientIds[i2], clientIds[j]] = [clientIds[j], clientIds[i2]]
    }
    let lastError
    for (const clientId of clientIds) {
      try {
        const response = await fetch("https://api.imgur.com/3/upload", {
          method: "POST",
          headers: { Authorization: "Client-ID ".concat(clientId) },
          body: formData,
        })
        if (response.ok) {
          const responseData = await response.json()
          if (responseData.success) {
            return responseData.data.link
          }
        }
        lastError = new Error("\u4E0A\u4F20\u5931\u8D25")
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
      }
    }
    throw lastError || new Error("\u4E0A\u4F20\u5931\u8D25")
  }
  var handleUploadImage = (file) => {
    const detail = { file }
    win.dispatchEvent(new CustomEvent("uploadImageStart", { detail }))
    uploadImageToImgur(file)
      .then((imgLink) => {
        detail.imgLink = imgLink
        win.dispatchEvent(new CustomEvent("uploadImageSuccess", { detail }))
      })
      .catch(() => {
        win.dispatchEvent(new CustomEvent("uploadImageFailed", { detail }))
      })
  }
  var handleClickUploadImage = () => {
    const imgInput = document.createElement("input")
    imgInput.style.display = "none"
    imgInput.type = "file"
    imgInput.accept = "image/*"
    imgInput.multiple = true
    addEventListener(imgInput, "change", () => {
      const selectedFiles = imgInput.files
      if (selectedFiles) {
        for (const file of selectedFiles) {
          handleUploadImage(file)
        }
      }
    })
    imgInput.click()
  }
  var init = () => {
    const replyTextArea = getReplyInputElement()
    if (!replyTextArea) {
      return
    }
    const appendPosition = $("#reply-box > div > div")
    if (!appendPosition) {
      return
    }
    setAttribute(
      replyTextArea,
      "placeholder",
      "\u60A8\u53EF\u4EE5\u5728\u56DE\u590D\u6846\u5185\u76F4\u63A5\u7C98\u8D34\u56FE\u7247\u6216\u62D6\u62FD\u56FE\u7247\u6587\u4EF6\u81F3\u56DE\u590D\u6846\u5185\u4E0A\u4F20"
    )
    const uploadTip = "+ \u63D2\u5165\u56FE\u7247"
    const placeholder = "[\u4E0A\u4F20\u56FE\u7247\u4E2D...]"
    addElement2(appendPosition, "span", {
      class: "snow",
      textContent: " \xB7 ",
    })
    const uploadButton = createElement("a", {
      class: "vr_upload_image",
      textContent: uploadTip,
    })
    appendPosition.append(uploadButton)
    addEventListener(uploadButton, "click", () => {
      if (!hasClass(uploadButton, "vr_button_disabled")) {
        handleClickUploadImage()
      }
    })
    addEventListener(
      doc,
      "paste",
      (event) => {
        var _a
        if (!(event instanceof ClipboardEvent)) {
          return
        }
        const replyTextArea2 = getReplyInputElement()
        if (
          !(replyTextArea2 == null ? void 0 : replyTextArea2.matches(":focus"))
        ) {
          return
        }
        const items = (_a = event.clipboardData) == null ? void 0 : _a.items
        if (!items) {
          return
        }
        const imageItems = Array.from(items).filter((item) =>
          item.type.includes("image")
        )
        if (imageItems.length > 0) {
          event.preventDefault()
          event.stopPropagation()
          for (const item of imageItems) {
            const file = item.getAsFile()
            if (file) {
              handleUploadImage(file)
            }
          }
        }
      },
      true
    )
    addEventListener(
      replyTextArea,
      "drop",
      (event) => {
        var _a
        if (!(event instanceof DragEvent)) {
          return
        }
        const files = (_a = event.dataTransfer) == null ? void 0 : _a.files
        if (files == null ? void 0 : files.length) {
          for (const file of files) {
            if (file.type.includes("image")) {
              event.preventDefault()
              event.stopImmediatePropagation()
              handleUploadImage(file)
            }
          }
        }
      },
      true
    )
    addEventListener(win, {
      uploadImageStart(event) {
        if (!event.detail) {
          return
        }
        const detail = event.detail
        const fileName = detail.file.name || "noname"
        detail.placeholder = placeholder.replace(
          /]/,
          " (".concat(fileName, ")]")
        )
        const replyTextArea2 = getReplyInputElement()
        if (replyTextArea2) {
          insertTextToReplyInput(
            replyTextArea2.value.trim().length > 0 &&
              replyTextArea2.selectionStart > 0
              ? "\n".concat(detail.placeholder, "\n")
              : "".concat(detail.placeholder, "\n")
          )
        }
      },
      uploadImageSuccess(event) {
        if (!event.detail) {
          return
        }
        const detail = event.detail
        removeClass(uploadButton, "vr_button_disabled")
        uploadButton.textContent = uploadTip
        replaceReplyInputText(
          detail.placeholder || placeholder,
          detail.imgLink || "",
          true
        )
      },
      uploadImageFailed(event) {
        if (!event.detail) {
          return
        }
        const detail = event.detail
        removeClass(uploadButton, "vr_button_disabled")
        uploadButton.textContent = uploadTip
        replaceReplyInputText(detail.placeholder || placeholder, "")
        alert(
          "[V2EX.REP] \u274C \u4E0A\u4F20\u56FE\u7247\u5931\u8D25\uFF0C\u8BF7\u6253\u5F00\u63A7\u5236\u53F0\u67E5\u770B\u539F\u56E0"
        )
      },
    })
  }
  var uploadImage = () => {
    const replyTextArea = getReplyInputElement()
    if (!replyTextArea) {
      return
    }
    runOnce("uploadImage:init", init)
  }
  if (false) {
    const runtime =
      (_c = (_a = globalThis.chrome) == null ? void 0 : _a.runtime) != null
        ? _c
        : (_b = globalThis.browser) == null
          ? void 0
          : _b.runtime
    ;(_d = runtime == null ? void 0 : runtime.onMessage) == null
      ? void 0
      : _d.addListener((message) => {
          if (
            (message == null ? void 0 : message.type) ===
            "v2ex.rep:show-settings"
          ) {
            void showSettings2()
          }
        })
  }
  var config = {
    matches: ["https://*.v2ex.com/*", "https://*.v2ex.co/*"],
    run_at: "document_start",
  }
  var settingsTable2 = {
    fixReplyFloorNumbers: {
      title: "\u4FEE\u590D\u697C\u5C42\u53F7",
      defaultValue: true,
    },
    replyWithFloorNumber: {
      title: "\u56DE\u590D\u65F6\u5E26\u4E0A\u697C\u5C42\u53F7",
      defaultValue: true,
    },
    showTopReplies: {
      title: "\u663E\u793A\u70ED\u95E8\u56DE\u590D",
      defaultValue: true,
    },
    showCitedReplies: {
      title: "\u663E\u793A\u88AB\u5F15\u7528\u7684\u56DE\u590D",
      defaultValue: true,
    },
    opaticyOfCitedReplies: {
      title:
        "\u88AB\u5F15\u7528\u7684\u56DE\u590D\u4E0A\u9762\u906E\u7F69\u7684\u4E0D\u900F\u660E\u5EA6",
      type: "select",
      defaultValue: "2",
      options: {
        无遮罩: "0",
        低: "1",
        中: "2",
        高: "3",
      },
    },
    showPreviousCitedReplies: {
      title:
        "\u88AB\u5F15\u7528\u7684\u56DE\u590D\u662F\u524D\u4E00\u4E2A\u697C\u5C42\u65F6",
      type: "select",
      defaultValue: "0",
      options: {
        不显示: "0",
        始终显示: "1",
      },
    },
    filterRepliesByUser: {
      title:
        "\u67E5\u770B\u7528\u6237\u5728\u5F53\u524D\u4E3B\u9898\u4E0B\u7684\u6240\u6709\u56DE\u590D\u4E0E\u88AB\u63D0\u53CA\u7684\u56DE\u590D",
      description:
        "\u9F20\u6807\u79FB\u81F3\u7528\u6237\u540D\uFF0C\u4F1A\u663E\u793A\u8BE5\u7528\u6237\u5728\u5F53\u524D\u4E3B\u9898\u4E0B\u7684\u6240\u6709\u56DE\u590D\u4E0E\u88AB\u63D0\u53CA\u7684\u56DE\u590D",
      defaultValue: true,
    },
    loadMultiPages: {
      title: "\u9884\u52A0\u8F7D\u6240\u6709\u5206\u9875",
      defaultValue: true,
    },
    uploadImage: {
      title: "\u56DE\u590D\u65F6\u4E0A\u4F20\u56FE\u7247",
      defaultValue: true,
    },
    dailyCheckIn: {
      title: "\u6BCF\u65E5\u81EA\u52A8\u7B7E\u5230",
      defaultValue: true,
    },
    lazyLoadAvatars: {
      title: "\u61D2\u52A0\u8F7D\u7528\u6237\u5934\u50CF\u56FE\u7247",
      defaultValue: false,
    },
    quickSendThank: {
      title: "\u5FEB\u901F\u53D1\u9001\u611F\u8C22",
      defaultValue: false,
    },
    alwaysShowThankButton: {
      title: "\u4E00\u76F4\u663E\u793A\u611F\u8C22\u6309\u94AE",
      defaultValue: false,
    },
    quickHideReply: {
      title: "\u5FEB\u901F\u9690\u85CF\u56DE\u590D",
      defaultValue: false,
    },
    alwaysShowHideButton: {
      title: "\u4E00\u76F4\u663E\u793A\u9690\u85CF\u56DE\u590D\u6309\u94AE",
      defaultValue: false,
    },
    removeLocationHash: {
      title: "\u53BB\u6389 URL \u4E2D\u7684 #replyXX",
      defaultValue: true,
    },
    stickyTopicButtons: {
      title:
        "\u4E3B\u9898\u5185\u5BB9\u5E95\u90E8\u56FA\u5B9A\u663E\u793A\u6309\u94AE\u680F",
      defaultValue: true,
    },
    quickNavigation: {
      title: "\u53CC\u51FB\u7A7A\u767D\u5904\u5FEB\u901F\u5BFC\u822A",
      defaultValue: false,
    },
    replaceFavicon: {
      title: "\u66F4\u6362 favicon \u56FE\u6807",
      type: "select",
      defaultValue: "default",
      options: {
        默认: "default",
        GitHub: "github",
        用户头像: "avatar",
      },
    },
  }
  var fixedReplyFloorNumbers = false
  async function applyAll() {
    const domReady =
      doc.readyState === "interactive" || doc.readyState === "complete"
    const domCompleted = doc.readyState === "complete"
    const mainContentReady = Boolean($("#Wrapper"))
    if (domCompleted && mainContentReady && getSettingsValue("dailyCheckIn")) {
      runOnce("dailyCheckIn", () => {
        setTimeout(dailyCheckIn, 1e3)
      })
    }
    replaceFavicon(getSettingsValue("replaceFavicon"))
    if (domReady && mainContentReady && /\/t\/\d+/.test(location.href)) {
      if (doc.documentElement && doc.documentElement.dataset) {
        const opaticyOfCitedReplies = getSettingsValue("opaticyOfCitedReplies")
        doc.documentElement.dataset.vrOpaticyOfCitedReplies =
          opaticyOfCitedReplies
      }
      const replyElements = getReplyElements()
      for (const replyElement of replyElements) {
        if (!$(".reply_content", replyElement)) {
          continue
        }
        if (getSettingsValue("lazyLoadAvatars")) {
          lazyLoadAvatars(replyElement)
        }
        addLinkToAvatars(replyElement)
        if (getSettingsValue("replyWithFloorNumber")) {
          replyWithFloorNumber(replyElement)
        }
        if (getSettingsValue("alwaysShowThankButton")) {
          alwaysShowThankButton(replyElement)
        }
        if (getSettingsValue("alwaysShowHideButton")) {
          alwaysShowHideButton(replyElement)
        }
        if (getSettingsValue("quickSendThank")) {
          quickSendThank(replyElement)
        }
        if (getSettingsValue("quickHideReply")) {
          quickHideReply(replyElement)
        }
        addlinkToCitedFloorNumbers(replyElement)
        if (getSettingsValue("showCitedReplies")) {
          showCitedReplies(
            replyElement,
            getSettingsValue("showPreviousCitedReplies")
          )
        }
      }
      showTopReplies(replyElements, getSettingsValue("showTopReplies"))
      stickyTopicButtons(getSettingsValue("stickyTopicButtons"))
      filterRepliesByUser(getSettingsValue("filterRepliesByUser"))
      if (getSettingsValue("fixReplyFloorNumbers") && !fixedReplyFloorNumbers) {
        await fixReplyFloorNumbers(replyElements)
      }
      if (getSettingsValue("uploadImage")) {
        uploadImage()
      }
      if (getSettingsValue("removeLocationHash")) {
        runOnce("main:removeLocationHash", removeLocationHash)
      }
      if (getSettingsValue("quickNavigation")) {
        quickNavigation()
      }
      if (domCompleted && getSettingsValue("loadMultiPages")) {
        runOnce("main:loadMultiPages", () => {
          setTimeout(loadMultiPages, 1e3)
        })
      }
    }
  }
  async function main() {
    await initSettings(() => ({
      id: "v2ex.rep",
      title: "V2EX.REP",
      footer:
        '\n    <p>\u66F4\u6539\u8BBE\u7F6E\u540E\uFF0C\u9700\u8981\u91CD\u65B0\u52A0\u8F7D\u9875\u9762</p>\n    <p>\n    <a href="https://github.com/v2hot/v2ex.rep/issues" target="_blank">\n    \u95EE\u9898\u53CD\u9988\n    </a></p>\n    <p>Made with \u2764\uFE0F by\n    <a href="https://www.pipecraft.net/" target="_blank">\n      Pipecraft\n    </a></p>',
      settingsTable: settingsTable2,
      async onValueChange() {
        await applyAll()
      },
    }))
    addStyle(content_default)
    const resetCachedReplyElementsThenApplyAll = async () => {
      resetCachedReplyElements()
      await applyAll()
    }
    addEventListener(win, {
      floorNumberUpdated() {
        fixedReplyFloorNumbers = true
        if (
          getSettingsValue("replyWithFloorNumber") ||
          getSettingsValue("showCitedReplies")
        ) {
          const replyElements = getReplyElements()
          for (const replyElement of replyElements) {
            if (getSettingsValue("replyWithFloorNumber")) {
              replyWithFloorNumber(replyElement, true)
            }
            if (getSettingsValue("showCitedReplies")) {
              showCitedReplies(
                replyElement,
                getSettingsValue("showPreviousCitedReplies"),
                true
              )
            }
          }
        }
      },
      async replyElementsLengthUpdated() {
        await resetCachedReplyElementsThenApplyAll()
        const replyElements = getCachedReplyElements()
        for (const replyElement of replyElements) {
          if (getSettingsValue("showCitedReplies")) {
            showCitedReplies(
              replyElement,
              getSettingsValue("showPreviousCitedReplies"),
              true
            )
          }
        }
        showTopReplies(replyElements, getSettingsValue("showTopReplies"), true)
        if (getSettingsValue("fixReplyFloorNumbers")) {
          await fixReplyFloorNumbers(replyElements)
        }
      },
    })
    addEventListener(
      doc,
      "readystatechange",
      resetCachedReplyElementsThenApplyAll
    )
    await applyAll()
    const scanNodes = throttle(async () => {
      await applyAll()
    }, 500)
    addEventListener(doc, "visibilitychange", async () => {
      if (!doc.hidden) {
        await applyAll()
      }
    })
    const observer = new MutationObserver((mutationsList) => {
      scanNodes()
    })
    observer.observe($("#Main") || doc, {
      childList: true,
      subtree: true,
    })
  }
  runWhenBodyExists(async () => {
    if (doc.documentElement.dataset.v2exRep === void 0) {
      doc.documentElement.dataset.v2exRep = ""
      await main()
    }
  })
})()
