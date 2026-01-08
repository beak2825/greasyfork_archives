// ==UserScript==
// @name                 🔗 Links Helper
// @name:zh-CN           🔗 链接助手
// @namespace            https://github.com/utags/links-helper
// @homepageURL          https://github.com/utags/links-helper#readme
// @supportURL           https://github.com/utags/links-helper/issues
// @version              0.11.5
// @description          Open external links in a new tab, open internal links matching the specified rules in a new tab, convert text to hyperlinks, convert image links to image tags(<img>), parse Markdown style links and image tags, parse BBCode style links and image tags
// @description:zh-CN    支持所有网站在新标签页中打开第三方网站链接（外链），在新标签页中打开符合指定规则的本站链接，解析文本链接为超链接，微信公众号文本转可点击的超链接，图片链接转图片标签，解析 Markdown 格式链接与图片标签，解析 BBCode 格式链接与图片标签
// @icon                 https://wsrv.nl/?w=128&h=128&url=https%3A%2F%2Fraw.githubusercontent.com%2Futags%2Flinks-helper%2Frefs%2Fheads%2Fmain%2Fassets%2Ficon.png
// @author               Pipecraft
// @license              MIT
// @match                https://*/*
// @match                http://*/*
// @exclude              *://github.dev/*
// @exclude              *://challenges.cloudflare.com/*
// @exclude              *://js.stripe.com/*
// @exclude              *://m.stripe.network/*
// @exclude              *://www.googletagmanager.com/*
// @exclude              *://googleads.g.doubleclick.net/*
// @exclude              *://ep2.adtrafficquality.google/*
// @exclude              *://www.google.com/recaptcha/*
// @run-at               document-start
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM.getValue
// @grant                GM.deleteValue
// @grant                GM.setValue
// @grant                GM_addElement
// @grant                GM.registerMenuCommand
// @grant                GM.openInTab
// @grant                GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/464541/%F0%9F%94%97%20Links%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464541/%F0%9F%94%97%20Links%20Helper.meta.js
// ==/UserScript==
//
;(() => {
  "use strict"
  var __defProp = Object.defineProperty
  var __getOwnPropSymbols = Object.getOwnPropertySymbols
  var __hasOwnProp = Object.prototype.hasOwnProperty
  var __propIsEnum = Object.prototype.propertyIsEnumerable
  var __knownSymbol = (name, symbol) =>
    (symbol = Symbol[name])
      ? symbol
      : /* @__PURE__ */ Symbol.for("Symbol." + name)
  var __typeError = (msg) => {
    throw TypeError(msg)
  }
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
  var __await = function (promise, isYieldStar) {
    this[0] = promise
    this[1] = isYieldStar
  }
  var __yieldStar = (value) => {
    var obj = value[__knownSymbol("asyncIterator")],
      isAwait = false,
      method,
      it = {}
    if (obj == null) {
      obj = value[__knownSymbol("iterator")]()
      method = (k) => (it[k] = (x) => obj[k](x))
    } else {
      obj = obj.call(value)
      method = (k) =>
        (it[k] = (v) => {
          if (isAwait) {
            isAwait = false
            if (k === "throw") throw v
            return v
          }
          isAwait = true
          return {
            done: false,
            value: new __await(
              new Promise((resolve) => {
                var x = obj[k](v)
                if (!(x instanceof Object)) __typeError("Object expected")
                resolve(x)
              }),
              1
            ),
          }
        })
    }
    return (
      (it[__knownSymbol("iterator")] = () => it),
      method("next"),
      "throw" in obj
        ? method("throw")
        : (it.throw = (x) => {
            throw x
          }),
      "return" in obj && method("return"),
      it
    )
  }
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
      Object.entries(messageMaps).map(([locale, messages16]) => [
        locale.toLowerCase(),
        messages16,
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
    for (const [i3, parameter] of parameters.entries()) {
      const regex = getParameterRegex(i3 + 1)
      result = result.replace(regex, String(parameter))
    }
    return result
  }
  function getPrefferedLocale() {
    return extractLocaleFromNavigator() || "en"
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
      for (let i3 = 0; i3 < a.length; i3++) {
        if (!deepEqual(a[i3], b[i3])) {
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
  function setPolling(enabled) {
    pollingEnabled = enabled
    if (!enabled) {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId)
        pollingIntervalId = null
      }
    } else if (valueChangeListeners.size > 0) {
      startPolling()
    }
  }
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
  var removeAttribute = (element, name) => {
    if (element && element.removeAttribute) {
      element.removeAttribute(name)
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
  var runWhenHeadExists = (func) => {
    if (!doc.head) {
      headFuncArray.push(func)
      startObserveHeadBodyExists()
      return
    }
    func()
  }
  var runWhenBodyExists = (func) => {
    if (!doc.body) {
      bodyFuncArray.push(func)
      startObserveHeadBodyExists()
      return
    }
    func()
  }
  var throttle = (func, interval) => {
    let timeoutId = null
    let next = false
    const handler = (...args) => {
      if (timeoutId) {
        next = true
      } else {
        func.apply(void 0, args)
        timeoutId = setTimeout(() => {
          timeoutId = null
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
          for (let i3 = optionGroups.length; i3 < index; i3++) {
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
              let timeoutId
              const div = addElement2(optionGroup, "div", {
                class: "bes_textarea",
              })
              addElement2(div, "textarea", {
                "data-key": key,
                placeholder: item.placeholder || "",
                onkeyup(event) {
                  const textArea = event.target
                  if (timeoutId) {
                    clearTimeout(timeoutId)
                    timeoutId = void 0
                  }
                  timeoutId = setTimeout(async () => {
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
  function addCommonSettings(settingsTable2, options) {
    let maxGroup = 0
    for (const key in settingsTable2) {
      if (Object.hasOwn(settingsTable2, key)) {
        const item = settingsTable2[key]
        const group = item.group || 1
        if (group > maxGroup) {
          maxGroup = group
        }
      }
    }
    if (options.locale) {
      settingsTable2.locale = {
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
    const availableLocales3 = options.availableLocales
    addCommonSettings(settingsTable, {
      locale: Boolean(
        availableLocales3 == null ? void 0 : availableLocales3.length
      ),
    })
    if (availableLocales3 == null ? void 0 : availableLocales3.length) {
      initAvailableLocales(availableLocales3)
      const localeSelect = settingsTable.locale
      localeSelect.options = {
        [i("settings.systemLanguage")]: "",
      }
      for (const locale of availableLocales3) {
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
    ".lh_selected_element{border:solid 1px red;cursor:not-allowed}a[data-lh-erased-href],a[data-lh-erased-href]:hover{cursor:default;pointer-events:none;text-decoration:none}"
  var messages14 = {
    "settings.enable": "Enable for all sites",
    "settings.enableCurrentSite": "Enable for the current site",
    "settings.enableCustomRulesForTheCurrentSite":
      "Enable custom rules for the current site",
    "settings.customRulesPlaceholder":
      "/* Custom rules for internal URLs, matching URLs will be opened in new tabs */",
    "settings.customRulesTipTitle": "Examples",
    "settings.customRulesTipContent":
      "<p>Custom rules for internal URLs, matching URLs will be opened in new tabs</p>\n  <p>\n  - One line per url pattern<br>\n  - All URLs contains '/posts' or '/users/'<br>\n  <pre>/posts/\n/users/</pre>\n\n  - Regex is supported<br>\n  <pre>^/(posts|members)/d+</pre>\n\n  - '*' for all URLs<br>\n  - Exclusion rules: prefix '!' to exclude matching URLs<br>\n  <pre>!/posts/\n!^/users/\\d+\n!*</pre>\n  </p>",
    "settings.enableLinkToImgForCurrentSite":
      "Enable converting image links to image tags for the current site",
    "settings.enableTextToLinksForCurrentSite":
      "Enable converting text links to hyperlinks for the current site",
    "settings.enableTreatSubdomainsAsSameSiteForCurrentSite":
      "Treat subdomains as the same site for the current site",
    "settings.enableOpenInternalLinksInCurrentTab":
      "Open internal links in current tab for *all sites* (override default)",
    "settings.enableOpenInternalLinksInCurrentTabForCurrentSite":
      "Open internal links in current tab for the current site (override default)",
    "settings.enableOpenNewTabInBackground":
      "Open new tab in background for *all sites*",
    "settings.enableOpenNewTabInBackgroundForCurrentSite":
      "Open new tab in background for the current site",
    "settings.convertTextToLinks": "Convert text links to hyperlinks",
    "settings.convertLinksToImages": "Convert image links to image tags",
    "settings.eraseLinks": "Erase Links",
    "settings.restoreLinks": "Restore Links",
    "settings.title": "\u{1F517} Links Helper",
    "settings.information":
      "After changing the settings, reload the page to take effect",
    "settings.report": "Report and Issue...",
    "popup.settings": "Settings",
  }
  var en_default2 = messages14
  var messages15 = {
    "settings.enable": "\u5728\u6240\u6709\u7F51\u7AD9\u542F\u7528",
    "settings.enableCurrentSite": "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528",
    "settings.enableCustomRulesForTheCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u81EA\u5B9A\u4E49\u89C4\u5219",
    "settings.customRulesPlaceholder":
      "/* \u5185\u90E8\u94FE\u63A5\u7684\u81EA\u5B9A\u4E49\u89C4\u5219\uFF0C\u5339\u914D\u7684\u94FE\u63A5\u4F1A\u5728\u65B0\u7A97\u53E3\u6253\u5F00 */",
    "settings.customRulesTipTitle": "\u793A\u4F8B",
    "settings.customRulesTipContent":
      "<p>\u5185\u90E8\u94FE\u63A5\u7684\u81EA\u5B9A\u4E49\u89C4\u5219\uFF0C\u5339\u914D\u7684\u94FE\u63A5\u4F1A\u5728\u65B0\u7A97\u53E3\u6253\u5F00</p>\n  <p>\n  - \u6BCF\u884C\u4E00\u6761\u89C4\u5219<br>\n  - \u6240\u6709\u5305\u542B '/posts' \u6216 '/users/' \u7684\u94FE\u63A5<br>\n  <pre>/posts/\n/users/</pre>\n\n  - \u652F\u6301\u6B63\u5219\u8868\u8FBE\u5F0F<br>\n  <pre>^/(posts|members)/d+</pre>\n\n  - '*' \u4EE3\u8868\u5339\u914D\u6240\u6709\u94FE\u63A5<br>\n  - \u6392\u9664\u89C4\u5219\uFF1A\u4EE5 '!' \u5F00\u5934\uFF0C\u5339\u914D\u5219\u6392\u9664\uFF08\u4E0D\u5728\u65B0\u7A97\u53E3\u6253\u5F00\uFF09<br>\n  <pre>!/posts/\n!^/users/\\d+\n!*</pre>\n  </p>",
    "settings.enableLinkToImgForCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u5C06\u56FE\u7247\u94FE\u63A5\u81EA\u52A8\u8F6C\u6362\u4E3A\u56FE\u7247\u6807\u7B7E",
    "settings.enableTextToLinksForCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u5C06\u6587\u672C\u94FE\u63A5\u89E3\u6790\u4E3A\u8D85\u94FE\u63A5",
    "settings.enableTreatSubdomainsAsSameSiteForCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u5C06\u4E8C\u7EA7\u57DF\u540D\u89C6\u4E3A\u540C\u4E00\u7F51\u7AD9",
    "settings.enableOpenInternalLinksInCurrentTab":
      "\u5728*\u6240\u6709\u7F51\u7AD9*\u542F\u7528\u5728\u5F53\u524D\u6807\u7B7E\u9875\u6253\u5F00\u7AD9\u5185\u94FE\u63A5\uFF08\u8986\u76D6\u7F51\u7AD9\u9ED8\u8BA4\u884C\u4E3A\uFF09",
    "settings.enableOpenInternalLinksInCurrentTabForCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u5728\u5F53\u524D\u6807\u7B7E\u9875\u6253\u5F00\u7AD9\u5185\u94FE\u63A5\uFF08\u8986\u76D6\u7F51\u7AD9\u9ED8\u8BA4\u884C\u4E3A\uFF09",
    "settings.enableOpenNewTabInBackground":
      "\u5728*\u6240\u6709\u7F51\u7AD9*\u542F\u7528\u5728\u540E\u53F0\u6253\u5F00\u65B0\u6807\u7B7E\u9875",
    "settings.enableOpenNewTabInBackgroundForCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u5728\u540E\u53F0\u6253\u5F00\u65B0\u6807\u7B7E\u9875",
    "settings.convertTextToLinks":
      "\u5C06\u6587\u672C\u94FE\u63A5\u8F6C\u6362\u4E3A\u8D85\u94FE\u63A5",
    "settings.convertLinksToImages":
      "\u5C06\u56FE\u7247\u94FE\u63A5\u8F6C\u6362\u4E3A\u56FE\u7247\u6807\u7B7E",
    "settings.eraseLinks":
      "\u53BB\u9664\u6307\u5B9A\u533A\u57DF\u7684\u94FE\u63A5",
    "settings.restoreLinks": "\u6062\u590D\u53BB\u9664\u7684\u94FE\u63A5",
    "settings.title": "\u{1F517} \u94FE\u63A5\u52A9\u624B",
    "settings.information":
      "\u66F4\u6539\u8BBE\u7F6E\u540E\uFF0C\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u5373\u53EF\u751F\u6548",
    "settings.report": "\u53CD\u9988\u95EE\u9898",
    "popup.settings": "\u8BBE\u7F6E",
  }
  var zh_cn_default2 = messages15
  var availableLocales2 =
    /** @type {const} */
    ["en", "zh"]
  initAvailableLocales(availableLocales2)
  var localeMap2 = {
    zh: zh_cn_default2,
    "zh-cn": zh_cn_default2,
    en: en_default2,
  }
  var i2 = initI18n(localeMap2, getPrefferedLocale())
  function resetI18n2(locale) {
    i2 = initI18n(localeMap2, locale || getPrefferedLocale())
  }
  function getAvailableLocales() {
    return availableLocales2
  }
  var openInBackgroundTab = (url) => {
    if (false) {
      void chrome.runtime.sendMessage({
        type: "open_background_tab",
        url,
      })
      return
    }
    if (typeof GM !== "undefined" && typeof GM.openInTab === "function") {
      void GM.openInTab(url, { active: false, insert: true })
      return
    }
    if (typeof GM_openInTab === "function") {
      GM_openInTab(url, { active: false, insert: true })
      return
    }
    globalThis.open(url, "_blank")
    globalThis.focus()
  }
  var setLinkTargetToBlank = (element) => {
    setAttribute(element, "target", "_blank")
    addAttribute(element, "rel", "noopener")
  }
  var removeLinkTargetBlank = (element) => {
    if (getAttribute(element, "target") === "_blank") {
      removeAttribute(element, "target")
    }
  }
  var STOP_PROPAGATION_SITES = [".zhihu.com"]
  var BLACKLIST_CLASSES = ["bili-watch-later"]
  var BLACKLIST_TEXT_REGEX =
    /稍后再看|已添加|Save to Watch later|Added|稍後觀看|已新增|陣間至睇/
  var isBlacklisted = (el) => {
    if (BLACKLIST_CLASSES.some((cls) => hasClass(el, cls))) {
      return true
    }
    const text = el.textContent
    if (
      text &&
      text.length < 50 &&
      hasClass(el, "b-tooltip-wrapper") &&
      BLACKLIST_TEXT_REGEX.test(text)
    ) {
      return true
    }
    return false
  }
  var handleLinkClick = (event, deps) => {
    if (
      event instanceof MouseEvent &&
      (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    ) {
      return
    }
    let anchorElement
    if (event.composedPath) {
      const path = event.composedPath()
      for (const target of path) {
        if (target instanceof HTMLElement && isBlacklisted(target)) {
          return
        }
        if (target.tagName === "A") {
          anchorElement = target
          break
        }
      }
    }
    if (!anchorElement) {
      anchorElement = event.target
      while (anchorElement && anchorElement.tagName !== "A") {
        if (isBlacklisted(anchorElement)) {
          return
        }
        anchorElement = anchorElement.parentNode
      }
    }
    if (anchorElement) {
      const shouldOpen = deps.shouldOpenInNewTab(anchorElement)
      if (shouldOpen) {
        setLinkTargetToBlank(anchorElement)
      }
      const isNewTab =
        shouldOpen ||
        (!deps.enableOpenInternalLinksInCurrentTab &&
          getAttribute(anchorElement, "target") === "_blank")
      if (isNewTab) {
        event.stopImmediatePropagation()
        event.stopPropagation()
        if (deps.enableBackground) {
          event.preventDefault()
          openInBackgroundTab(anchorElement.href)
        }
      } else if (deps.enableOpenInternalLinksInCurrentTab) {
        if (
          STOP_PROPAGATION_SITES.some((site) => deps.hostname.includes(site))
        ) {
          event.stopImmediatePropagation()
        }
        removeLinkTargetBlank(anchorElement)
      }
    }
  }
  function* getAllAnchors(root = document) {
    const elements = root.querySelectorAll("a")
    for (const element of elements) {
      yield element
    }
    const allElements = root.querySelectorAll("*")
    for (const element of allElements) {
      if (element.shadowRoot) {
        yield* __yieldStar(getAllAnchors(element.shadowRoot))
      }
    }
  }
  var lastTarget
  var handleMouseOver = (event) => {
    const target = event.target
    if (!target || target === lastTarget) {
      return
    }
    if (lastTarget) {
      removeClass(lastTarget, "lh_selected_element")
    }
    lastTarget = target
    while (lastTarget && !$("a", lastTarget)) {
      lastTarget = lastTarget.parentElement
    }
    if (lastTarget) {
      addClass(lastTarget, "lh_selected_element")
    }
  }
  var handleMouseClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    if (lastTarget) {
      for (const element of $$("a[href]", lastTarget)) {
        const href = getAttribute(element, "href")
        if (href) {
          setAttribute(element, "data-lh-erased-href", href)
          element.removeAttribute("href")
        }
      }
      removeClass(lastTarget, "lh_selected_element")
    }
    removeEventListener(doc, "mouseover", handleMouseOver, true)
    removeEventListener(doc, "click", handleMouseClick, true)
    return false
  }
  function eraseLinks() {
    addEventListener(doc, "mouseover", handleMouseOver, true)
    addEventListener(doc, "click", handleMouseClick, true)
  }
  function restoreLinks() {
    for (const element of $$("a[data-lh-erased-href]")) {
      const href = getAttribute(element, "data-lh-erased-href")
      if (href) setAttribute(element, "href", href)
      delete element.dataset.lhErasedHref
    }
  }
  var image_url_default = {
    "imgur.com": [
      "https?://imgur.com/(\\w+)($|\\?) -> https://i.imgur.com/$1.png # ex: https://imgur.com/gi2b1rj",
      "https?://imgur.com/(\\w+)\\.(\\w+) -> https://i.imgur.com/$1.$2 # ex: https://imgur.com/gi2b1rj.png",
    ],
    "imgur.io": [
      "https?://imgur.io/(\\w+)($|\\?) -> https://i.imgur.com/$1.png # ex: https://imgur.io/gi2b1rj",
      "https?://imgur.io/(\\w+)\\.(\\w+) -> https://i.imgur.com/$1.$2 # ex: https://imgur.io/gi2b1rj.png",
    ],
    "i.imgur.com": [
      "https?://i.imgur.com/(\\w+)($|\\?) -> https://i.imgur.com/$1.png",
    ],
    "camo.githubusercontent.com": [
      "https://camo.githubusercontent.com/.* # This is a img url, no need to replace value",
    ],
  }
  var cachedRules = {}
  var getHostname = (url) => (/https?:\/\/([^/]+)/.exec(url) || [])[1]
  var processRule = (rule, href) => {
    var _a
    let pattern
    let replacement
    const cachedRule = cachedRules[rule]
    try {
      if (cachedRule) {
        pattern = cachedRule.pattern
        replacement = cachedRule.replacement
      } else {
        const result = rule.replace(/ #.*/, "").split("->")
        const patternString = result[0].trim()
        pattern = new RegExp(
          patternString.startsWith("http")
            ? "^" + patternString
            : patternString,
          "i"
        )
        replacement = (_a = result[1]) == null ? void 0 : _a.trim()
        cachedRules[rule] = { pattern, replacement }
      }
      if (pattern.test(href)) {
        return replacement ? href.replace(pattern, replacement) : href
      }
    } catch (error) {
      console.error(error)
    }
  }
  var convertImgUrl = (href) => {
    if (!href) {
      return
    }
    const hostname2 = getHostname(href)
    if (Object.hasOwn(image_url_default, hostname2)) {
      for (const rule of image_url_default[hostname2]) {
        const newHref = processRule(rule, href)
        if (newHref) {
          return newHref
        }
      }
    }
  }
  var createImgTagString = (src, text) =>
    '<img src="'
      .concat(src, '" title="')
      .concat(text || "image", '" alt="')
      .concat(
        text || "image",
        '" role="img" style="max-width: 100% !important; vertical-align: bottom;" loading="lazy" referrerpolicy="no-referrer" rel="noreferrer" data-lh-status="1"/>'
      )
  var bindOnError = () => {
    for (const element of $$('img[data-lh-status="1"]')) {
      setAttribute(element, "data-lh-status", "2")
      addEventListener(element, "error", (event) => {
        const img = event.target
        const anchor = img.parentElement
        const imgSrc = getAttribute(img, "src")
        if (imgSrc) {
          img.outerHTML = createHTML(imgSrc)
        }
        if ((anchor == null ? void 0 : anchor.tagName) === "A") {
          setStyle(anchor, "opacity: 50%;")
          setAttribute(anchor, "data-message", "failed to load image")
        }
      })
    }
  }
  var anchorElementToImgElement = (anchor, href, text) => {
    anchor.innerHTML = createHTML(createImgTagString(href, text))
    setAttribute(anchor, "target", "_blank")
    addAttribute(anchor, "rel", "noopener")
    addAttribute(anchor, "rel", "noreferrer")
  }
  var linkToImg = (anchor) => {
    if (
      !anchor ||
      anchor.childElementCount !== 0 ||
      (anchor.childNodes[0] && anchor.childNodes[0].nodeType !== 3) ||
      anchor.closest("td h1,td h2,td h3,td h4,td h5")
    ) {
      return
    }
    const href = anchor.href
    const text = anchor.textContent || href
    const newHref = convertImgUrl(href)
    if (newHref) {
      anchorElementToImgElement(anchor, newHref, text)
    } else if (
      /^https:[^?]+\.(?:jpg|jpeg|jpe|bmp|png|gif|webp|ico|svg)/i.test(href)
    ) {
      anchorElementToImgElement(anchor, href, text)
    }
  }
  var base = location.origin
  var extractCanonicalId = (href) => {
    try {
      const u = new URL(href, base)
      const p = u.pathname.toLowerCase()
      let m = /^(\/t\/\d+)(?:\/|$)/.exec(p)
      if (m) return m[1]
      m = /^(\/t\/[^/]+\/\d+)(?:\/|$)/.exec(p)
      if (m) return m[1]
      m = /^(\/d\/\d+(?:-[^/]+)?)(?:\/|$)/.exec(p)
      if (m) return m[1]
      const f = p + u.search
      m = /^(\/watch\?v=[\w-]+)/.exec(f)
      if (m) return m[1]
    } catch (e) {}
    return void 0
  }
  var getBaseDomain = (h) => {
    const host2 = (h || "").toLowerCase().replace(/^www\./, "")
    if (
      /^\d+(?:\.\d+){3}$/.test(host2) ||
      host2 === "localhost" ||
      host2.includes(":")
    ) {
      return host2
    }
    const parts = host2.split(".").filter(Boolean)
    if (parts.length <= 2) return host2
    const secondLevelDomains = /* @__PURE__ */ new Set([
      "co",
      "com",
      "org",
      "net",
      "edu",
      "gov",
      "mil",
      "ac",
    ])
    const secondLast = parts.at(-2)
    const baseSegments = secondLevelDomains.has(secondLast) ? 3 : 2
    return parts.slice(-baseSegments).join(".")
  }
  var getWithoutOrigin = (url) => url.replace(/(^https?:\/\/[^/]+)/, "")
  var getCanonicalHost = (host2) => host2.replace(/^www\./, "")
  var shouldOpenInNewTab = (element, context) => {
    var _a
    const {
      currentUrl: currentUrl2,
      currentCanonicalId: currentCanonicalId2,
      origin: origin2,
      host: host2,
      currentBaseDomain: currentBaseDomain2,
      enableTreatSubdomainsSameSite: enableTreatSubdomainsSameSite2,
      enableCustomRules: enableCustomRules2,
      customRules: customRules2,
    } = context
    const url = element.href
    if (
      !url ||
      !/^https?:\/\//.test(url) ||
      ((_a = element.getAttribute("href")) == null
        ? void 0
        : _a.startsWith("#")) ||
      url === currentUrl2
    ) {
      return false
    }
    if (getCanonicalHost(element.host) !== getCanonicalHost(host2)) {
      if (
        enableTreatSubdomainsSameSite2 &&
        currentBaseDomain2 &&
        getBaseDomain(element.hostname) === currentBaseDomain2
      ) {
      } else {
        return true
      }
    }
    const rules = (customRules2 || "").split("\n")
    if (enableCustomRules2 && rules.length > 0) {
      if (currentCanonicalId2) {
        const canonicalId = extractCanonicalId(url)
        if (canonicalId && canonicalId === currentCanonicalId2) {
          removeLinkTargetBlank(element)
          return false
        }
      }
      const hrefWithoutOrigin = getWithoutOrigin(url)
      for (let rule of rules) {
        rule = rule.trim()
        if (rule.length === 0) {
          continue
        }
        const isExclude = rule.startsWith("!")
        const pattern = isExclude ? rule.slice(1).trim() : rule
        if (pattern.length === 0) {
          continue
        }
        if (pattern === "*") {
          return !isExclude
        }
        try {
          const regexp = new RegExp(pattern)
          if (regexp.test(hrefWithoutOrigin)) {
            return !isExclude
          }
        } catch (error) {
          console.log(error.message)
          if (hrefWithoutOrigin.includes(pattern)) {
            return !isExclude
          }
        }
      }
    }
    return false
  }
  var ignoredTags = /* @__PURE__ */ new Set([
    "A",
    "BUTTON",
    "SVG",
    "PATH",
    "G",
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "CODE",
    "PRE",
    "TEMPLATE",
    "FILE-ATTACHMENT",
    "NOSCRIPT",
    "TITLE",
  ])
  var urlPattern =
    "\\b((?:https?:\\/\\/(?:[\\w-.]+\\.[a-z]{2,15}|localhost|(?:\\d{1,3}\\.){3}\\d{1,3}))(?::\\d+)?(?:\\/[\\w-/%.~+:;!@=&?#]*)?)"
  var linkPattern1 = new RegExp(
    "!\\[([^\\[\\]]*)\\]\\((?:\\s|<br/?>)*".concat(
      urlPattern,
      "(?:\\s|<br/?>)*\\)"
    ),
    "gim"
  )
  var linkPattern2 = new RegExp(
    "\\[([^\\[\\]]*)\\]\\((?:\\s|<br/?>)*".concat(
      urlPattern,
      "(?:\\s|<br/?>)*\\)"
    ),
    "gim"
  )
  var linkPattern3 = new RegExp(urlPattern, "gim")
  var linkPattern4 = new RegExp(
    "\\[img\\](?:\\s|<br/?>)*".concat(urlPattern, "(?:\\s|<br/?>)*\\[/img\\]"),
    "gim"
  )
  var linkPattern5 = new RegExp(
    "\\[url\\](?:\\s|<br/?>)*".concat(urlPattern, "(?:\\s|<br/?>)*\\[/url\\]"),
    "gim"
  )
  var linkPattern6 = new RegExp(
    "\\[url=".concat(urlPattern, "\\]([^\\[\\]]+)\\[/url\\]"),
    "gim"
  )
  var replaceMarkdownImgLinks = (text) => {
    if (text.search(linkPattern1) >= 0) {
      text = text.replaceAll(linkPattern1, (m, p1, p2) =>
        createImgTagString(convertImgUrl(p2) || p2, p1)
      )
    }
    return text
  }
  var replaceMarkdownLinks = (text) => {
    if (text.search(linkPattern2) >= 0) {
      text = text.replaceAll(linkPattern2, (m, p1, p2) =>
        '<a href="'
          .concat(p2, '">')
          .concat(p1.replaceAll(/<br>$/gi, ""), "</a>")
      )
    }
    return text
  }
  var replaceTextLinks = (text) => {
    if (text.search(linkPattern3) >= 0) {
      text = text.replaceAll(linkPattern3, (m, p1) =>
        '<a href="'.concat(p1, '">').concat(p1, "</a>")
      )
    }
    return text
  }
  var replaceBBCodeImgLinks = (text) => {
    if (text.search(linkPattern4) >= 0) {
      text = text.replaceAll(linkPattern4, (m, p1) =>
        createImgTagString(convertImgUrl(p1) || p1, p1)
      )
    }
    return text
  }
  var replaceBBCodeLinks = (text) => {
    if (text.search(linkPattern5) >= 0) {
      text = text.replaceAll(linkPattern5, (m, p1) =>
        '<a href="'.concat(p1, '">').concat(p1, "</a>")
      )
    }
    if (text.search(linkPattern6) >= 0) {
      text = text.replaceAll(linkPattern6, (m, p1, p2) =>
        '<a href="'.concat(p1, '">').concat(p2, "</a>")
      )
    }
    return text
  }
  var textToLink = (textNode, previousText) => {
    var _a, _b
    const textContent = (_a = textNode.textContent) != null ? _a : ""
    const parentNode = textNode.parentNode
    const mergedText = previousText + textContent
    if (
      !parentNode ||
      textNode.nodeName !== "#text" ||
      textContent.trim().length === 0 ||
      mergedText.trim().length < 3
    ) {
      return
    }
    if (textContent.includes("://")) {
      const original = textContent
      let newContent = original
      if (new RegExp("\\[.*]\\(", "ms").test(original)) {
        newContent = replaceMarkdownImgLinks(newContent)
        newContent = replaceMarkdownLinks(newContent)
      }
      if (/\[(img|url)]|\[url=/.test(textContent)) {
        newContent = replaceBBCodeImgLinks(newContent)
        newContent = replaceBBCodeLinks(newContent)
      }
      if (newContent === original) {
        newContent = replaceTextLinks(original)
      } else {
        newContent = newContent.replaceAll(
          new RegExp(
            "(<a(?:\\s[^<>]*)?>.*?<\\/a>)|(<img(?:\\s[^<>]*)?\\/?>)|(.+?(?=(?:<a|<img))|.+$)",
            "gims"
          ),
          (m, p1, p2) => (p1 || p2 ? m : replaceTextLinks(m))
        )
      }
      if (newContent !== original) {
        const span = createElement("span")
        span.innerHTML = createHTML(newContent)
        textNode.after(span)
        textNode.remove()
        return true
      }
    }
    const parentTextContent = (_b = parentNode.textContent) != null ? _b : ""
    if (
      new RegExp("\\[.*]\\(", "ms").test(mergedText) &&
      (parentTextContent.search(linkPattern2) >= 0 ||
        $$("img", parentNode).length > 0)
    ) {
      const original = parentNode.innerHTML
      const newContent = original
        .replaceAll(new RegExp("\\[.*]\\([^[\\]()]+?\\)", "gims"), (m) =>
          m
            .replaceAll(
              /<img[^<>]*\ssrc=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>/gim,
              "$1"
            )
            .replaceAll(
              /\((?:\s|<br\/?>)*<a[^<>]*\shref=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>\1<\/a>(?:\s|<br\/?>)*\)/gim,
              "($1)"
            )
        )
        .replaceAll(
          new RegExp("\\[!\\[.*]\\([^()]+\\)]\\([^[\\]()]+?\\)", "gims"),
          (m) =>
            m
              .replaceAll(
                /<img[^<>]*\ssrc=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>/gim,
                "$1"
              )
              .replaceAll(
                /\((?:\s|<br\/?>)*<a[^<>]*\shref=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>\1<\/a>(?:\s|<br\/?>)*\)/gim,
                "($1)"
              )
        )
      if (newContent !== original) {
        let newContent2 = replaceMarkdownImgLinks(newContent)
        newContent2 = replaceMarkdownLinks(newContent2)
        if (newContent2 !== newContent) {
          parentNode.innerHTML = createHTML(newContent2)
          return true
        }
      }
    }
    if (
      /\[(img|url)]|\[url=/.test(textContent) &&
      parentTextContent.search(/\[(img|url)[^\]]*]([^[\]]*?)\[\/\1]/) >= 0
    ) {
      const original = parentNode.innerHTML
      let before = ""
      let after = original
      let count = 0
      while (before !== after && count < 5) {
        count++
        before = after
        after = before.replaceAll(
          /\[(img|url)[^\]]*]([^[\]]+?)\[\/\1]/gim,
          (m, p1) => {
            let tagsRemoved
            let converted
            if (p1 === "img") {
              tagsRemoved = m
                .replaceAll(
                  /<img[^<>]*\ssrc=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>/gim,
                  "$1"
                )
                .replaceAll(
                  /\[img](?:\s|<br\/?>)*<a[^<>]*\shref=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>\1<\/a>(?:\s|<br\/?>)*\[\/img]/gim,
                  "[img]$1[/img]"
                )
              converted = replaceBBCodeImgLinks(tagsRemoved)
            } else {
              tagsRemoved = m
                .replaceAll(
                  /\[url](?:\s|<br\/?>)*<a[^<>]*\shref=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>\1<\/a>(?:\s|<br\/?>)*\[\/url]/gim,
                  "[url]$1[/url]"
                )
                .replaceAll(
                  /\[url=<a[^<>]*\shref=['"]?(http[^'"]+)['"]?(\s[^<>]*)?>\1<\/a>]/gim,
                  "[url=$1]"
                )
              converted = replaceBBCodeLinks(tagsRemoved)
            }
            return converted === tagsRemoved ? m : converted
          }
        )
      }
      const newContent = after
      if (newContent !== original) {
        parentNode.innerHTML = createHTML(newContent)
        return true
      }
    }
  }
  var fixAnchorTag = (anchorElement) => {
    var _a
    const href = anchorElement.href
    const textContent = (_a = anchorElement.textContent) != null ? _a : ""
    const nextSibling = anchorElement.nextSibling
    if (
      anchorElement.childElementCount === 0 &&
      href.includes(")") &&
      textContent.includes(")")
    ) {
      const index = textContent.indexOf(")")
      const removed = textContent.slice(Math.max(0, index))
      anchorElement.textContent = textContent.slice(0, Math.max(0, index))
      anchorElement.href = anchorElement.href.slice(
        0,
        Math.max(0, href.indexOf(")"))
      )
      if (nextSibling && nextSibling.nodeType === 3) {
        nextSibling.textContent = removed + nextSibling.textContent
      } else {
        anchorElement.after(doc.createTextNode(removed))
      }
    }
  }
  var isCodeViewer = (element) =>
    hasClass(element, "diff-view") ||
    hasClass(element, "diff") ||
    hasClass(element, "react-code-lines") ||
    hasClass(element, "virtual-blame-wrapper") ||
    Boolean($('[role="code"]', element))
  var scanAndConvertChildNodes = (parentNode) => {
    if (
      !parentNode ||
      (parentNode.nodeType !== 1 && parentNode.nodeType !== 11)
    ) {
      return
    }
    const isShadowRoot = parentNode.nodeType === 11
    if (!isShadowRoot) {
      const element = parentNode
      if (
        !element.tagName ||
        ignoredTags.has(element.tagName.toUpperCase()) ||
        isCodeViewer(element)
      ) {
        if (element.tagName === "A") {
          fixAnchorTag(element)
        }
        return
      }
      if (element.shadowRoot) {
        scanAndConvertChildNodes(element.shadowRoot)
      }
    }
    let previousText = ""
    for (const child of parentNode.childNodes) {
      try {
        if (child.nodeName === "#text") {
          if (textToLink(child, previousText)) {
            scanAndConvertChildNodes(parentNode)
            break
          }
          previousText += child.textContent
        } else if (child.nodeName === "BR") {
          previousText += "\n"
        } else {
          previousText = ""
          scanAndConvertChildNodes(child)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  var origin = location.origin
  var host = location.host
  var hostname = location.hostname
  var currentUrl
  var currentCanonicalId
  var enableCustomRules = false
  var customRules = ""
  var enableTreatSubdomainsSameSite = false
  var enableBackground = false
  var enableOpenInternalLinksInCurrentTab = false
  var enableLinkToImg = false
  var enableTextToLinks = false
  var cachedFlag = 0
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
            "links-helper:show-settings"
          ) {
            void showSettings2()
          }
        })
  }
  var config = {
    all_frames: true,
    run_at: "document_start",
  }
  var getSettingsTable = () => {
    let groupNumber = 1
    return {
      enable: {
        title: i2("settings.enable"),
        defaultValue: true,
      },
      ["enableCurrentSite_".concat(host)]: {
        title: i2("settings.enableCurrentSite"),
        defaultValue: true,
      },
      ["enableCustomRulesForCurrentSite_".concat(host)]: {
        title: i2("settings.enableCustomRulesForTheCurrentSite"),
        defaultValue: false,
      },
      ["customRulesForCurrentSite_".concat(host)]: {
        title: i2("settings.enableCustomRulesForTheCurrentSite"),
        defaultValue: "",
        placeholder: i2("settings.customRulesPlaceholder"),
        type: "textarea",
        group: ++groupNumber,
      },
      customRulesTip: {
        title: i2("settings.customRulesTipTitle"),
        type: "tip",
        tipContent: i2("settings.customRulesTipContent"),
        group: groupNumber,
      },
      ["enableOpenNewTabInBackground"]: {
        title: i2("settings.enableOpenNewTabInBackground"),
        defaultValue: false,
        group: ++groupNumber,
      },
      ["enableOpenNewTabInBackgroundForCurrentSite_".concat(host)]: {
        title: i2("settings.enableOpenNewTabInBackgroundForCurrentSite"),
        defaultValue: void 0,
        group: groupNumber,
      },
      ["enableOpenInternalLinksInCurrentTab"]: {
        title: i2("settings.enableOpenInternalLinksInCurrentTab"),
        defaultValue: false,
        group: ++groupNumber,
      },
      ["enableOpenInternalLinksInCurrentTabForCurrentSite_".concat(host)]: {
        title: i2("settings.enableOpenInternalLinksInCurrentTabForCurrentSite"),
        defaultValue: void 0,
        group: groupNumber,
      },
      ["enableTreatSubdomainsAsSameSiteForCurrentSite_".concat(host)]: {
        title: i2("settings.enableTreatSubdomainsAsSameSiteForCurrentSite"),
        defaultValue: false,
        group: ++groupNumber,
      },
      ["enableTextToLinksForCurrentSite_".concat(host)]: {
        title: i2("settings.enableTextToLinksForCurrentSite"),
        defaultValue: Boolean(/v2ex\.com|localhost/.test(host)),
        group: ++groupNumber,
      },
      ["enableLinkToImgForCurrentSite_".concat(host)]: {
        title: i2("settings.enableLinkToImgForCurrentSite"),
        defaultValue: Boolean(/v2ex\.com|localhost/.test(host)),
        group: groupNumber,
      },
      convertTextToLinks: {
        title: i2("settings.convertTextToLinks"),
        type: "action",
        async onclick() {
          hideSettings()
          scanAndConvertChildNodes(doc.body)
        },
        group: ++groupNumber,
      },
      convertLinksToImages: {
        title: i2("settings.convertLinksToImages"),
        type: "action",
        async onclick() {
          hideSettings()
          for (const element of getAllAnchors()) {
            try {
              linkToImg(element)
            } catch (error) {
              console.error(error)
            }
          }
        },
        group: groupNumber,
      },
      eraseLinks: {
        title: i2("settings.eraseLinks"),
        type: "action",
        async onclick() {
          hideSettings()
          eraseLinks()
        },
        group: groupNumber,
      },
      restoreLinks: {
        title: i2("settings.restoreLinks"),
        type: "action",
        async onclick() {
          hideSettings()
          restoreLinks()
        },
        group: groupNumber,
      },
    }
  }
  var currentBaseDomain = getBaseDomain(hostname)
  var shouldOpenInNewTab2 = (element) =>
    shouldOpenInNewTab(element, {
      currentUrl,
      currentCanonicalId,
      origin,
      host,
      currentBaseDomain,
      enableTreatSubdomainsSameSite,
      enableCustomRules,
      customRules,
    })
  function onSettingsChange() {
    cachedFlag++
    const locale = getSettingsValue("locale") || getPrefferedLocale()
    resetI18n2(locale)
    enableCustomRules = Boolean(
      getSettingsValue("enableCustomRulesForCurrentSite_".concat(host))
    )
    customRules =
      getSettingsValue("customRulesForCurrentSite_".concat(host)) || ""
    enableTreatSubdomainsSameSite = Boolean(
      getSettingsValue(
        "enableTreatSubdomainsAsSameSiteForCurrentSite_".concat(host)
      )
    )
    {
      const siteSetting = getSettingsValue(
        "enableOpenNewTabInBackgroundForCurrentSite_".concat(host)
      )
      const globalSetting = getSettingsValue("enableOpenNewTabInBackground")
      enableBackground = Boolean(
        siteSetting != null ? siteSetting : globalSetting
      )
    }
    {
      const siteSetting = getSettingsValue(
        "enableOpenInternalLinksInCurrentTabForCurrentSite_".concat(host)
      )
      const globalSetting = getSettingsValue(
        "enableOpenInternalLinksInCurrentTab"
      )
      enableOpenInternalLinksInCurrentTab = Boolean(
        siteSetting != null ? siteSetting : globalSetting
      )
    }
    enableLinkToImg = Boolean(
      getSettingsValue("enableLinkToImgForCurrentSite_".concat(host))
    )
    enableTextToLinks = Boolean(
      getSettingsValue("enableTextToLinksForCurrentSite_".concat(host))
    )
    scanNodes()
  }
  var scanAnchors = () => {
    if (currentUrl !== location.href) {
      currentUrl = location.href
      currentCanonicalId = extractCanonicalId(currentUrl)
    }
    let elementCount = 0
    for (const element of getAllAnchors()) {
      if (element.__links_helper_scaned === cachedFlag) {
        continue
      }
      elementCount++
      element.__links_helper_scaned = cachedFlag
      try {
        if (shouldOpenInNewTab2(element)) {
          setLinkTargetToBlank(element)
        } else if (enableOpenInternalLinksInCurrentTab) {
          removeLinkTargetBlank(element)
        }
      } catch (error) {
        console.error(error)
      }
      if (enableLinkToImg) {
        try {
          linkToImg(element)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
  var scanNodes = throttle(() => {
    if (enableTextToLinks) {
      scanAndConvertChildNodes(doc.body)
    }
    scanAnchors()
    bindOnError()
  }, 500)
  async function main() {
    setPolling(true)
    await initSettings(() => {
      const settingsTable2 = getSettingsTable()
      return {
        id: "links-helper",
        title: i2("settings.title"),
        footer: "\n    <p>"
          .concat(
            i2("settings.information"),
            '</p>\n    <p>\n    <a href="https://github.com/utags/links-helper/issues" target="_blank">\n    '
          )
          .concat(
            i2("settings.report"),
            '\n    </a></p>\n    <p>Made with \u2764\uFE0F by\n    <a href="https://www.pipecraft.net/" target="_blank">\n      Pipecraft\n    </a></p>'
          ),
        settingsTable: settingsTable2,
        availableLocales: getAvailableLocales(),
        async onValueChange() {
          onSettingsChange()
        },
        onViewUpdate(settingsMainView) {
          const group2 = $(".option_groups:nth-of-type(2)", settingsMainView)
          if (group2) {
            group2.style.display = getSettingsValue(
              "enableCustomRulesForCurrentSite_".concat(host)
            )
              ? "block"
              : "none"
          }
          {
            const siteSetting = getSettingsValue(
              "enableOpenInternalLinksInCurrentTabForCurrentSite_".concat(host)
            )
            const globalSetting = getSettingsValue(
              "enableOpenInternalLinksInCurrentTab"
            )
            if (globalSetting !== void 0 && siteSetting === void 0) {
              const checkbox = settingsMainView.querySelector(
                '[data-key="enableOpenInternalLinksInCurrentTabForCurrentSite_'.concat(
                  host,
                  '"] input[type="checkbox"]'
                )
              )
              if (checkbox) {
                checkbox.checked = globalSetting
              }
            }
          }
          {
            const siteSetting = getSettingsValue(
              "enableOpenNewTabInBackgroundForCurrentSite_".concat(host)
            )
            const globalSetting = getSettingsValue(
              "enableOpenNewTabInBackground"
            )
            if (globalSetting !== void 0 && siteSetting === void 0) {
              const checkbox = settingsMainView.querySelector(
                '[data-key="enableOpenNewTabInBackgroundForCurrentSite_'.concat(
                  host,
                  '"] input[type="checkbox"]'
                )
              )
              if (checkbox) {
                checkbox.checked = globalSetting
              }
            }
          }
          {
            const enableTextToLinks2 = getSettingsValue(
              "enableTextToLinksForCurrentSite_".concat(host)
            )
            const element = settingsMainView.querySelector(
              '[data-key="convertTextToLinks"]'
            )
            if (element) {
              element.style.display = enableTextToLinks2 ? "none" : "block"
            }
          }
          {
            const enableLinkToImg2 = getSettingsValue(
              "enableLinkToImgForCurrentSite_".concat(host)
            )
            const element = settingsMainView.querySelector(
              '[data-key="convertLinksToImages"]'
            )
            if (element) {
              element.style.display = enableLinkToImg2 ? "none" : "block"
            }
          }
        },
      }
    })
    if (
      !getSettingsValue("enable") ||
      !getSettingsValue("enableCurrentSite_".concat(host))
    ) {
      return
    }
    onSettingsChange()
    runWhenHeadExists(() => {
      addStyle(content_default)
    })
    addEventListener(
      doc,
      "click",
      (event) => {
        handleLinkClick(event, {
          enableBackground,
          enableOpenInternalLinksInCurrentTab,
          hostname,
          shouldOpenInNewTab: shouldOpenInNewTab2,
        })
      },
      true
    )
    const observer = new MutationObserver((mutationsList) => {
      scanNodes()
    })
    const startObserver = () => {
      observer.observe(doc.body, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }
    runWhenBodyExists(() => {
      startObserver()
    })
    scanNodes()
  }
  runWhenHeadExists(async () => {
    if (doc.documentElement.dataset.linksHelper === void 0) {
      doc.documentElement.dataset.linksHelper = ""
      await main()
    }
  })
})()
