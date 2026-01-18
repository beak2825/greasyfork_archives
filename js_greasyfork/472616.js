// ==UserScript==
// @name                 Replace Ugly Avatars
// @name:zh-CN           赐你个头像吧
// @namespace            https://github.com/utags/replace-ugly-avatars
// @homepageURL          https://github.com/utags/replace-ugly-avatars#readme
// @supportURL           https://github.com/utags/replace-ugly-avatars/issues
// @version              0.6.4
// @description          🔃 Replace specified user's avatar (profile photo) and username (nickname)
// @description:zh-CN    🔃 换掉别人的头像与昵称
// @icon                 data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%230d6efd' class='bi bi-arrow-repeat' viewBox='0 0 16 16'%3E %3Cpath d='M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z'/%3E %3Cpath fill-rule='evenodd' d='M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'/%3E %3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                https://*.v2ex.com/*
// @match                https://*.v2ex.co/*
// @match                https://linux.do/*
// @match                https://v2hot.pipecraft.net/*
// @run-at               document-start
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM.getValue
// @grant                GM.deleteValue
// @grant                GM.setValue
// @grant                GM_addElement
// @grant                GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/472616/Replace%20Ugly%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/472616/Replace%20Ugly%20Avatars.meta.js
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
  async function deleteValue(key) {
    await updateValue(key, void 0, async () => {
      if (typeof GM !== "undefined" && typeof GM.deleteValue === "function") {
        await GM.deleteValue(key)
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
  var runWhenHeadExists = (func) => {
    if (!doc.head) {
      headFuncArray.push(func)
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
  async function saveSettingsValues(values) {
    const settings2 = await getSettings()
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        const value = values[key]
        settings2[key] =
          settingsTable[key] && settingsTable[key].defaultValue === value
            ? void 0
            : value
      }
    }
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
    '#rua_container .change_button{position:absolute;box-sizing:border-box;width:20px;height:20px;padding:1px;border:1px solid;cursor:pointer;color:#0d6efd;z-index:10001}#rua_container .change_button.more{color:#00008b;display:none}#rua_container .change_button.hide{display:none}#rua_container .change_button:active,#rua_container .change_button.active{opacity:50%;transition:all .2s}#rua_container:hover .change_button{display:block !important}#rua_container .rua_menu{position:absolute;box-sizing:border-box;min-width:160px;max-width:260px;padding:4px 0;background:#fff;border:1px solid rgba(0,0,0,.15);border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.2);z-index:10002}#rua_container .rua_menu.hide{display:none}#rua_container .rua_menu_item{display:block;width:100%;padding:4px 8px;box-sizing:border-box;text-align:left;background:rgba(0,0,0,0);border:0;cursor:pointer;font-size:12px;line-height:1.4;color:#333}#rua_container .rua_menu_item:hover{background:#f0f0f0}#rua_container .rua_menu_item.rua_menu_close{border-top:1px solid #e5e5e5;margin-top:4px;padding-top:6px;color:#666}img.rua_fadeout{opacity:10%;transition:all 1s ease-out}[data-replace-ugly-avatars*="v2ex.co"] #Main .header .fr a img{width:73px;height:73px}[data-replace-ugly-avatars*="v2ex.co"] td[width="48"] img{width:48px;height:48px}'
  function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  var cachedData
  function getRamdomAvatar() {
    if (cachedData && cachedData.length > 0) {
      let avatar = cachedData[getRandomInt(0, cachedData.length)]
      avatar = encodeURIComponent(avatar).replaceAll("%2F", "/")
      return "https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/".concat(
        avatar,
        "&w=96&h=96&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp"
      )
    }
    setTimeout(initRamdomAvatar)
  }
  var retryCount = 0
  async function fetchRamdomAvatar() {
    const url =
      "https://cdn.jsdelivr.net/gh/utags/random-avatars@2025021816/public/gfriends-".concat(
        getRandomInt(1, 101),
        ".json"
      )
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return await response.json()
      }
    } catch (error) {
      console.error(error)
      retryCount++
      if (retryCount < 3) {
        await sleep(1e3)
        const data = await fetchRamdomAvatar()
        return data
      }
    }
  }
  var storageKey2 = "gfriendsData"
  async function initRamdomAvatar() {
    if (cachedData && cachedData.length > 0) {
      return
    }
    const data = await getValue2(storageKey2)
    if (data && Array.isArray(data) && data.length > 0) {
      cachedData = data
      setTimeout(async () => {
        const data2 = await fetchRamdomAvatar()
        if (data2) {
          await setValue2(storageKey2, data2)
        }
      }, 1e3 * 60)
    } else {
      const data2 = await fetchRamdomAvatar()
      if (data2) {
        cachedData = data2
        await setValue2(storageKey2, data2)
      }
    }
  }
  var cachedData2
  function getRamdomAvatar2() {
    if (cachedData2 && cachedData2.length > 0) {
      const avatar = cachedData2[getRandomInt(0, cachedData2.length)]
      return "https://cdn.jsdelivr.net/gh/utags/ugly-avatar-generated@main/".concat(
        avatar
      )
    }
    setTimeout(initRamdomAvatar2)
  }
  var retryCount2 = 0
  async function fetchRamdomAvatar2() {
    const url =
      "https://cdn.jsdelivr.net/gh/utags/random-avatars@2025021816/public/ugly-avatar/ugly-avatar-".concat(
        getRandomInt(1, 11),
        ".json"
      )
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        return await response.json()
      }
    } catch (error) {
      console.error(error)
      retryCount2++
      if (retryCount2 < 3) {
        await sleep(1e3)
        const data = await fetchRamdomAvatar2()
        return data
      }
    }
  }
  var storageKey3 = "uglyAvatarData"
  async function initRamdomAvatar2() {
    if (cachedData2 && cachedData2.length > 0) {
      return
    }
    const data = await getValue2(storageKey3)
    if (data && Array.isArray(data) && data.length > 0) {
      cachedData2 = data
      setTimeout(async () => {
        const data2 = await fetchRamdomAvatar2()
        if (data2) {
          await setValue2(storageKey3, data2)
        }
      }, 1e3 * 60)
    } else {
      const data2 = await fetchRamdomAvatar2()
      if (data2) {
        cachedData2 = data2
        await setValue2(storageKey3, data2)
      }
    }
  }
  var styles = [
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "avataaars-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "bottts",
    "bottts-neutral",
    "croodles",
    "croodles-neutral",
    "fun-emoji",
    "icons",
    "identicon",
    "initials",
    "lorelei",
    "lorelei-neutral",
    "micah",
    "miniavs",
    "notionists",
    "notionists-neutral",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
    "shapes",
    "thumbs",
    "ugly-avatar",
    "gfriends",
  ]
  var allAvatarStyleList = styles
  function getRandomFlipParameter(style) {
    if (style === "initials" || style === "identicon") {
      return ""
    }
    const values = [false, false, false, false, true]
    const value = values[getRandomInt(0, values.length)]
    return value ? "&flip=true" : ""
  }
  function getRandomRadiusParameter(style) {
    const values = [0, 0, 0, 10, 10, 10, 20, 20, 30, 50]
    const value = values[getRandomInt(0, values.length)]
    return value ? "&radius=" + value : ""
  }
  function getRandomBackgroundColorParameter(style) {
    const values = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "ffffff",
      "b6e3f4",
      "c0aede",
      "d1d4f9",
      "ffd5dc",
      "ffdfbf",
    ]
    let value = values[getRandomInt(0, values.length)]
    if ((style === "initials" || style === "icons") && value === "ffffff") {
      value = ""
    }
    return value ? "&backgroundColor=" + value : ""
  }
  function getRandomAvatar(prefix2, styleList) {
    const styles2 =
      !styleList || styleList.length === 0 ? allAvatarStyleList : styleList
    const randomStyle = styles2[getRandomInt(0, styles2.length)]
    if (randomStyle === "ugly-avatar") {
      return getRamdomAvatar2()
    }
    if (randomStyle === "gfriends") {
      return getRamdomAvatar()
    }
    return (
      "https://api.dicebear.com/6.x/"
        .concat(randomStyle, "/svg?seed=")
        .concat(prefix2, ".")
        .concat(Date.now()) +
      getRandomFlipParameter(randomStyle) +
      getRandomRadiusParameter(randomStyle) +
      getRandomBackgroundColorParameter(randomStyle)
    )
  }
  var changeIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">\n<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>\n<path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>\n</svg>'
  var messages14 = {
    "settings.enableCurrentSite": "Enable for the current site",
    "settings.autoReplaceAll": "Automatically replace all avatars",
    "settings.autoReplaceAll.confirm":
      "Are you sure you want to automatically replace all avatars?",
    "settings.clearData": "Clear the replaced avatar data",
    "settings.clearData.confirm":
      "Are you sure you want to delete all replaced avatar data?",
    "settings.clearData.done": "Done!",
    "settings.title": "Replace Ugly Avatars",
    "settings.information":
      "After changing the settings, reload the page to take effect",
    "settings.report": "Report and Issue...",
    "alert.needsSelectOneAavatar":
      "At least one avatar style needs to be enabled",
    "prompt.enterAvatarLink": "Please enter the avatar link",
    "popup.settings": "Settings",
    "menu.randomAvatar": "Random avatar",
    "menu.customAvatarUrl": "Custom avatar URL",
    "menu.toggleOriginalAvatar": "Toggle original avatar",
    "menu.restoreAndClear": "Restore and clear record",
    "menu.close": "Close",
  }
  var en_default2 = messages14
  var messages15 = {
    "settings.enableCurrentSite": "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528",
    "settings.autoReplaceAll":
      "\u81EA\u52A8\u66FF\u6362\u5168\u90E8\u5934\u50CF",
    "settings.autoReplaceAll.confirm":
      "\u786E\u5B9A\u8981\u81EA\u52A8\u66FF\u6362\u5168\u90E8\u5934\u50CF\u5417\uFF1F",
    "settings.clearData":
      "\u6E05\u7A7A\u88AB\u66FF\u6362\u7684\u5934\u50CF\u6570\u636E",
    "settings.clearData.confirm":
      "\u786E\u5B9A\u8981\u5220\u9664\u6240\u6709\u88AB\u66FF\u6362\u7684\u5934\u50CF\u6570\u636E\u5417\uFF1F",
    "settings.clearData.done": "\u5220\u9664\u5B8C\u6BD5!",
    "settings.title": "\u8D50\u4F60\u4E2A\u5934\u50CF\u5427",
    "settings.information":
      "\u66F4\u6539\u8BBE\u7F6E\u540E\uFF0C\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\u5373\u53EF\u751F\u6548",
    "settings.report": "\u53CD\u9988\u95EE\u9898",
    "alert.needsSelectOneAavatar":
      "\u81F3\u5C11\u9700\u8981\u542F\u7528\u4E00\u79CD\u5934\u50CF\u98CE\u683C",
    "prompt.enterAvatarLink": "\u8BF7\u8F93\u5165\u5934\u50CF\u94FE\u63A5",
    "popup.settings": "\u8BBE\u7F6E",
    "menu.randomAvatar": "\u968F\u673A\u5934\u50CF",
    "menu.customAvatarUrl": "\u81EA\u5B9A\u4E49\u5934\u50CF\u94FE\u63A5",
    "menu.toggleOriginalAvatar":
      "\u4E34\u65F6\u5207\u6362\u539F\u59CB\u5934\u50CF",
    "menu.restoreAndClear":
      "\u6062\u590D\u539F\u5934\u50CF\u5E76\u6E05\u9664\u8BB0\u5F55",
    "menu.close": "\u5173\u95ED",
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
  var site = {
    matches: /^linux\.do$/,
    getAvatarElements() {
      return $$(
        [
          'img[src^="https://linux.do/user_avatar/linux.do/"]',
          'img[src^="/user_avatar/linux.do/"]',
          'img[src^="https://cdn.linux.do/user_avatar/"]',
          'img[src^="https://linux.do/letter_avatar_proxy/"]',
          'img[src^="/letter_avatar_proxy/"]',
          'img[src^="https://linux.do/letter_avatar/"]',
          'img[src^="/letter_avatar/"]',
          'img[src^="https://cdn.linux.do/letter_avatar_proxy/"]',
          'img[src^="https://cdn.linux.do/letter_avatar/"]',
          "img[data-rua-org-src]",
        ].join(",")
      )
    },
    getUserName(element) {
      const src =
        getAttribute(element, "data-rua-org-src") ||
        getAttribute(element, "src")
      if (!src) {
        return
      }
      if (src.includes("letter_avatar_proxy")) {
        const name2 = src.replace(
          /.*\/letter_avatar_proxy\/v4\/letter\/(\w\/[^/]+)\/.*/,
          "$1"
        )
        return name2.toLowerCase()
      }
      if (src.includes("letter_avatar/")) {
        const name2 = src.replace(/.*\/letter_avatar\/(\w+)\/.*/, "$1")
        return name2.toLowerCase()
      }
      const name = src.replace(/.*\/user_avatar\/linux\.do\/([^/]+)\/.*/, "$1")
      return name.toLowerCase()
    },
  }
  var linux_do_default = site
  var site2 = {
    matches: /v2ex\.com$|^v2hot\.|v2ex\.co$/,
    getAvatarElements() {
      return $$('.avatar,a[href*="/member/"] img')
    },
    getUserName,
  }
  function getUserName(element) {
    if (!element) {
      return
    }
    const userNameElement = $('a[href*="/member/"]', element)
    if (userNameElement) {
      const userName = (/member\/(\w+)/.exec(userNameElement.href) || [])[1]
      if (userName) {
        return userName.toLowerCase()
      }
      return
    }
    return getUserName(element.parentElement)
  }
  var v2ex_com_default = site2
  var sites = [
    //
    v2ex_com_default,
    linux_do_default,
  ]
  var defaultSite = {
    matches: /.*/,
    getAvatarElements() {
      return []
    },
    getUserName(element) {
      return ""
    },
  }
  function matchedSite(hostname2) {
    for (const s of sites) {
      if (s.matches.test(hostname2)) {
        return s
      }
    }
    return defaultSite
  }
  var hostname = location.hostname
  var currentSite = matchedSite(hostname)
  var host = location.host
  var storageKey4 = host.includes("v2ex")
    ? "avatar:v2ex.com"
    : "avatar:".concat(host)
  async function saveAvatar(userName, src) {
    const values = (await getValue2(storageKey4)) || {}
    values[userName] = src
    await setValue2(storageKey4, values)
  }
  async function removeAvatar(userName) {
    const values = (await getValue2(storageKey4)) || {}
    const newValues = {}
    for (const [key, value] of Object.entries(values)) {
      if (key !== userName) {
        newValues[key] = value
      }
    }
    await setValue2(storageKey4, newValues)
  }
  async function saveAvatars(newValues) {
    let values = (await getValue2(storageKey4)) || {}
    values = Object.assign(values, newValues)
    await setValue2(storageKey4, values)
  }
  async function clearAvatarData() {
    await deleteValue(storageKey4)
  }
  var cachedValues = {}
  async function reloadCachedValues() {
    cachedValues = (await getValue2(storageKey4)) || {}
  }
  function getChangedAavatar(userName) {
    return cachedValues[userName]
  }
  async function initStorage(options) {
    await addValueChangeListener2(storageKey4, async () => {
      await reloadCachedValues()
      if (options && typeof options.avatarValueChangeListener === "function") {
        options.avatarValueChangeListener()
      }
    })
    await reloadCachedValues()
    console.log(
      "The number of avatars that have been replaced:",
      Object.keys(cachedValues).length
    )
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
            "replace-ugly-avatars:show-settings"
          ) {
            void showSettings2()
          }
        })
  }
  var config = {
    all_frames: true,
    run_at: "document_start",
  }
  var host2 = location.host
  var suffix = host2.includes("v2ex") ? "" : "_" + host2
  var isEnabledByDefault = () => {
    if (host2.includes("xxxxxxxx")) {
      return false
    }
    return true
  }
  var getSettingsTable = () => ({
    ["enableCurrentSite_".concat(host2)]: {
      title: i2("settings.enableCurrentSite"),
      defaultValue: isEnabledByDefault(),
    },
    ["style-adventurer".concat(suffix)]: {
      title: "Adventurer",
      icon: "https://api.dicebear.com/6.x/adventurer/svg?seed=JD",
      defaultValue: true,
      group: 2,
    },
    ["style-adventurer-neutral".concat(suffix)]: {
      title: "Adventurer Neutral",
      icon: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-avataaars".concat(suffix)]: {
      title: "Avataaars",
      icon: "https://api.dicebear.com/6.x/avataaars/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-avataaars-neutral".concat(suffix)]: {
      title: "Avataaars Neutral",
      icon: "https://api.dicebear.com/6.x/avataaars-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-big-ears".concat(suffix)]: {
      title: "Big Ears",
      icon: "https://api.dicebear.com/6.x/big-ears/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-big-ears-neutral".concat(suffix)]: {
      title: "Big Ears Neutral",
      icon: "https://api.dicebear.com/6.x/big-ears-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-big-smile".concat(suffix)]: {
      title: "Big Smile",
      icon: "https://api.dicebear.com/6.x/big-smile/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-bottts".concat(suffix)]: {
      title: "Bottts",
      icon: "https://api.dicebear.com/6.x/bottts/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-bottts-neutral".concat(suffix)]: {
      title: "Bottts Neutral",
      icon: "https://api.dicebear.com/6.x/bottts-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-croodles".concat(suffix)]: {
      title: "Croodles",
      icon: "https://api.dicebear.com/6.x/croodles/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-croodles-neutral".concat(suffix)]: {
      title: "Croodles Neutral",
      icon: "https://api.dicebear.com/6.x/croodles-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-fun-emoji".concat(suffix)]: {
      title: "Fun Emoji",
      icon: "https://api.dicebear.com/6.x/fun-emoji/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-icons".concat(suffix)]: {
      title: "Icons",
      icon: "https://api.dicebear.com/6.x/icons/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-identicon".concat(suffix)]: {
      title: "Identicon",
      icon: "https://api.dicebear.com/6.x/identicon/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-initials".concat(suffix)]: {
      title: "Initials",
      icon: "https://api.dicebear.com/6.x/initials/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-lorelei".concat(suffix)]: {
      title: "Lorelei",
      icon: "https://api.dicebear.com/6.x/lorelei/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-lorelei-neutral".concat(suffix)]: {
      title: "Lorelei Neutral",
      icon: "https://api.dicebear.com/6.x/lorelei-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-micah".concat(suffix)]: {
      title: "Micah",
      icon: "https://api.dicebear.com/6.x/micah/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-miniavs".concat(suffix)]: {
      title: "Miniavs",
      icon: "https://api.dicebear.com/6.x/miniavs/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-notionists".concat(suffix)]: {
      title: "Notionists",
      icon: "https://api.dicebear.com/6.x/notionists/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-notionists-neutral".concat(suffix)]: {
      title: "Notionists Neutral",
      icon: "https://api.dicebear.com/6.x/notionists-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-open-peeps".concat(suffix)]: {
      title: "Open Peeps",
      icon: "https://api.dicebear.com/6.x/open-peeps/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-personas".concat(suffix)]: {
      title: "Personas",
      icon: "https://api.dicebear.com/6.x/personas/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-pixel-art".concat(suffix)]: {
      title: "Pixel Art",
      icon: "https://api.dicebear.com/6.x/pixel-art/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-pixel-art-neutral".concat(suffix)]: {
      title: "Pixel Art Neutral",
      icon: "https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-shapes".concat(suffix)]: {
      title: "Shapes",
      icon: "https://api.dicebear.com/6.x/shapes/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-thumbs".concat(suffix)]: {
      title: "Thumbs",
      icon: "https://api.dicebear.com/6.x/thumbs/svg?seed=JD",
      defaultValue: false,
      group: 2,
    },
    ["style-ugly-avatar".concat(suffix)]: {
      title: "Ugly Avatar",
      icon: "https://cdn.jsdelivr.net/gh/utags/ugly-avatar-generated@main/svg/00/0010afd433ff844eb3da1d22515a96f8.svg",
      defaultValue: false,
      group: 2,
    },
    ["style-gfriends".concat(suffix)]: {
      title: "Japan Girl Friends (NSFW)",
      icon: "https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/8-Honnaka/%E8%91%89%E6%9C%88%E3%81%BF%E3%82%8A%E3%81%82.jpg%3Ft%3D1644908887&w=96&h=96&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp",
      defaultValue: false,
      group: 2,
    },
    ["autoReplaceAll".concat(suffix)]: {
      title: i2("settings.autoReplaceAll"),
      defaultValue: false,
      onConfirmChange(checked) {
        if (checked) {
          return confirm(i2("settings.autoReplaceAll.confirm"))
        }
        return true
      },
      group: 3,
    },
    clearData: {
      title: i2("settings.clearData"),
      type: "action",
      async onclick() {
        if (confirm(i2("settings.clearData.confirm"))) {
          await clearAvatarData()
          setTimeout(() => {
            alert(i2("settings.clearData.done"))
          })
        }
      },
      group: 4,
    },
  })
  var avatarStyleList = []
  function updateAvatarStyleList() {
    avatarStyleList = allAvatarStyleList.filter((style) =>
      getSettingsValue("style-".concat(style).concat(suffix))
    )
    if (avatarStyleList.length === 0 && !doc.hidden) {
      setTimeout(async () => {
        alert(i2("alert.needsSelectOneAavatar"))
        await saveSettingsValues({
          ["style-adventurer".concat(suffix)]: true,
        })
        const firstStyleOption = $(
          '.browser_extension_settings_container [data-key="style-adventurer'.concat(
            suffix,
            '"]'
          )
        )
        if (firstStyleOption) {
          firstStyleOption.scrollIntoView({ block: "nearest" })
        }
      }, 200)
    }
    if (getSettingsValue("style-ugly-avatar".concat(suffix))) {
      setTimeout(initRamdomAvatar2)
    }
    if (getSettingsValue("style-gfriends".concat(suffix))) {
      setTimeout(initRamdomAvatar)
    }
  }
  var lastValueOfEnableCurrentSite = true
  var lastValueOfAutoReplaceAll = false
  async function onSettingsChange() {
    const locale = getSettingsValue("locale") || getPrefferedLocale()
    resetI18n2(locale)
    if (getSettingsValue("enableCurrentSite_".concat(host2))) {
      if (!lastValueOfEnableCurrentSite) {
        if ($("#rua_tyle")) {
          scanAvatars()
        } else {
          await main()
        }
      }
    } else if (lastValueOfEnableCurrentSite) {
      for (const element of $$("img[data-rua-org-src]")) {
        if (
          element.dataset.ruaOrgSrc &&
          element.src !== element.dataset.ruaOrgSrc
        ) {
          element.src = element.dataset.ruaOrgSrc
        }
      }
    }
    lastValueOfEnableCurrentSite = getSettingsValue(
      "enableCurrentSite_".concat(host2)
    )
    if (
      getSettingsValue("autoReplaceAll".concat(suffix)) &&
      !lastValueOfAutoReplaceAll &&
      !doc.hidden
    ) {
      lastValueOfAutoReplaceAll = true
      scanAvatars()
    }
    lastValueOfAutoReplaceAll = getSettingsValue(
      "autoReplaceAll".concat(suffix)
    )
    updateAvatarStyleList()
  }
  function isAvatar(element) {
    if (!element || element.tagName !== "IMG") {
      return false
    }
    if (element.dataset.ruaUserName) {
      return true
    }
    return false
  }
  var currentTarget
  function addChangeButton(element) {
    currentTarget = element
    const container =
      $("#rua_container") ||
      addElement2(doc.body, "div", {
        id: "rua_container",
      })
    const changeButton =
      $(".change_button.quick", container) ||
      addElement2(container, "button", {
        innerHTML: changeIcon,
        class: "change_button quick",
        async onclick() {
          addClass(changeButton, "active")
          setTimeout(() => {
            removeClass(changeButton, "active")
          }, 200)
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = getRandomAvatar(userName, avatarStyleList)
          if (avatarUrl) {
            changeAvatar(currentTarget, avatarUrl, true)
            await saveAvatar(userName, avatarUrl)
          }
        },
      })
    const menu =
      $(".rua_menu", container) ||
      addElement2(container, "div", {
        class: "rua_menu hide",
      })
    if (!menu.dataset.initialized) {
      menu.dataset.initialized = "1"
      addElement2(menu, "button", {
        class: "rua_menu_item rua_menu_random",
        textContent: i2("menu.randomAvatar"),
        async onclick() {
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = getRandomAvatar(userName, avatarStyleList)
          if (avatarUrl) {
            changeAvatar(currentTarget, avatarUrl, true)
            await saveAvatar(userName, avatarUrl)
          }
        },
      })
      addElement2(menu, "button", {
        class: "rua_menu_item rua_menu_advanced",
        textContent: i2("menu.customAvatarUrl"),
        async onclick() {
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = prompt(i2("prompt.enterAvatarLink"), "")
          if (avatarUrl) {
            changeAvatar(currentTarget, avatarUrl, true)
            await saveAvatar(userName, avatarUrl)
          }
        },
      })
      addElement2(menu, "button", {
        class: "rua_menu_item rua_menu_toggle",
        textContent: i2("menu.toggleOriginalAvatar"),
        async onclick() {
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const changedAvatar = getChangedAavatar(userName)
          if (!currentTarget.dataset.ruaOrgSrc || !changedAvatar) {
            return
          }
          const isOriginal =
            currentTarget.src === currentTarget.dataset.ruaOrgSrc
          const targetSrc = isOriginal
            ? changedAvatar
            : currentTarget.dataset.ruaOrgSrc
          changeAvatar(currentTarget, targetSrc, true)
        },
      })
      addElement2(menu, "button", {
        class: "rua_menu_item rua_menu_restore",
        textContent: i2("menu.restoreAndClear"),
        async onclick() {
          const userName = currentTarget.dataset.ruaUserName || "noname"
          if (currentTarget.dataset.ruaOrgSrc) {
            changeAvatar(currentTarget, currentTarget.dataset.ruaOrgSrc, true)
            await removeAvatar(userName)
          }
        },
      })
      addElement2(menu, "button", {
        class: "rua_menu_item rua_menu_close",
        textContent: i2("menu.close"),
        onclick() {
          addClass(menu, "hide")
          menu.style.display = "none"
        },
      })
    }
    const changeButton2 =
      $(".change_button.more", container) ||
      addElement2(container, "button", {
        textContent: "...",
        class: "change_button more",
        async onclick() {
          addClass(changeButton2, "active")
          setTimeout(() => {
            removeClass(changeButton2, "active")
          }, 200)
          removeClass(menu, "hide")
          const targetElement = currentTarget || element
          updateMenuItemsVisibility(targetElement)
          const pos2 = getOffsetPosition(targetElement)
          const scrollTop = window.scrollY || doc.documentElement.scrollTop || 0
          const scrollLeft =
            window.scrollX || doc.documentElement.scrollLeft || 0
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          menu.style.visibility = "hidden"
          menu.style.display = "block"
          const menuWidth = menu.offsetWidth
          const menuHeight = menu.offsetHeight
          let top = pos2.top
          let left = pos2.left + targetElement.clientWidth
          if (left + menuWidth > scrollLeft + viewportWidth) {
            left = pos2.left - menuWidth
          }
          if (left < scrollLeft) {
            left = scrollLeft
          }
          if (top + menuHeight > scrollTop + viewportHeight) {
            top = scrollTop + viewportHeight - menuHeight
          }
          if (top < scrollTop) {
            top = scrollTop
          }
          menu.style.top = "".concat(top, "px")
          menu.style.left = "".concat(left, "px")
          menu.style.visibility = "visible"
        },
      })
    removeClass(changeButton, "hide")
    removeClass(changeButton2, "hide")
    const pos = getOffsetPosition(element)
    if (changeButton) {
      const leftOffset =
        element.clientWidth - changeButton.clientWidth > 20
          ? element.clientWidth - changeButton.clientWidth
          : element.clientWidth - 1
      changeButton.style.top = pos.top + "px"
      changeButton.style.left = pos.left + leftOffset + "px"
      if (changeButton2) {
        changeButton2.style.top = pos.top + changeButton.clientHeight + "px"
        changeButton2.style.left = pos.left + leftOffset + "px"
      }
    }
    const mouseoutHandler = () => {
      addClass(changeButton, "hide")
      addClass(changeButton2, "hide")
      removeEventListener(element, "mouseout", mouseoutHandler)
    }
    addEventListener(element, "mouseout", mouseoutHandler)
  }
  function updateMenuItemsVisibility(target) {
    const menu = $(".rua_menu")
    const avatar = target || currentTarget
    if (!menu || !avatar) {
      return
    }
    const userName = avatar.dataset.ruaUserName || "noname"
    const hasChangedAvatar =
      Boolean(avatar.dataset.ruaOrgSrc) && Boolean(getChangedAavatar(userName))
    const toggleItem = $(".rua_menu_toggle", menu)
    const restoreItem = $(".rua_menu_restore", menu)
    if (toggleItem) {
      toggleItem.style.display = hasChangedAvatar ? "" : "none"
    }
    if (restoreItem) {
      restoreItem.style.display = hasChangedAvatar ? "" : "none"
    }
  }
  function changeAvatar(element, src, animation = false) {
    if (element.ruaLoading) {
      return
    }
    if (!element.dataset.ruaOrgSrc) {
      const orgSrc = element.dataset.src || element.src
      element.dataset.ruaOrgSrc = orgSrc
    }
    element.ruaLoading = true
    const imgOnloadHandler = () => {
      if (element.src !== src) {
        return
      }
      element.ruaLoading = false
      removeClass(element, "rua_fadeout")
      removeEventListener(element, "load", imgOnloadHandler)
      removeEventListener(element, "error", imgOnloadHandler)
    }
    if (animation) {
      addClass(element, "rua_fadeout")
    } else {
      element.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    }
    addEventListener(element, "load", imgOnloadHandler)
    addEventListener(element, "error", imgOnloadHandler)
    element.src = src
  }
  var scanAvatars = throttle(async () => {
    if (doc.hidden || !getSettingsValue("enableCurrentSite_".concat(host2))) {
      return
    }
    const newValues = {}
    const avatars = currentSite.getAvatarElements()
    for (const avatar of avatars) {
      let userName = avatar.dataset.ruaUserName
      if (!userName) {
        userName = currentSite.getUserName(avatar)
        if (!userName) {
          console.error("Can't get username", avatar, userName)
          continue
        }
        avatar.dataset.ruaUserName = userName
        setAttributes(avatar, {
          loading: "lazy",
          decoding: "async",
          referrerpolicy: "no-referrer",
          rel: "noreferrer",
        })
      }
      const newAvatarSrc = getChangedAavatar(userName)
      if (newAvatarSrc && avatar.src !== newAvatarSrc) {
        changeAvatar(avatar, newAvatarSrc)
      } else if (!newAvatarSrc) {
        if (
          avatar.dataset.ruaOrgSrc &&
          avatar.src !== avatar.dataset.ruaOrgSrc
        ) {
          avatar.src = avatar.dataset.ruaOrgSrc
        }
        if (lastValueOfAutoReplaceAll && Object.keys(newValues).length < 3) {
          const avatarUrl = getRandomAvatar(userName, avatarStyleList)
          if (avatarUrl) {
            newValues[userName] = avatarUrl
          } else {
            setTimeout(scanAvatars, 100)
          }
        }
      }
    }
    if (lastValueOfAutoReplaceAll && Object.keys(newValues).length > 0) {
      await saveAvatars(newValues)
    }
  }, 300)
  async function main() {
    await runOnce("main", async () => {
      await initSettings(() => {
        const settingsTable2 = getSettingsTable()
        return {
          id: "replace-ugly-avatars",
          title: i2("settings.title"),
          footer: "\n    <p>"
            .concat(
              i2("settings.information"),
              '</p>\n    <p>\n    <a href="https://github.com/utags/replace-ugly-avatars/issues" target="_blank">\n    '
            )
            .concat(
              i2("settings.report"),
              '\n    </a></p>\n    <p>Made with \u2764\uFE0F by\n    <a href="https://www.pipecraft.net/" target="_blank">\n      Pipecraft\n    </a></p>'
            ),
          settingsTable: settingsTable2,
          availableLocales: getAvailableLocales(),
          async onValueChange() {
            await onSettingsChange()
          },
        }
      })
    })
    lastValueOfEnableCurrentSite = getSettingsValue(
      "enableCurrentSite_".concat(host2)
    )
    lastValueOfAutoReplaceAll = getSettingsValue(
      "autoReplaceAll".concat(suffix)
    )
    if (!getSettingsValue("enableCurrentSite_".concat(host2))) {
      return
    }
    updateAvatarStyleList()
    runWhenHeadExists(() => {
      addElement2(doc.head, "style", {
        textContent: content_default,
        id: "rua_tyle",
      })
    })
    addEventListener(doc, "mouseover", (event) => {
      const target = event.target
      if (!isAvatar(target)) {
        return
      }
      if ($(".rua_menu:not(.hide)")) {
        return
      }
      addChangeButton(target)
    })
    addEventListener(doc, "keydown", (event) => {
      if (event.key === "Escape") {
        const menu = $(".rua_menu")
        if (menu) {
          addClass(menu, "hide")
          menu.style.display = "none"
        }
      }
    })
    addEventListener(doc, "visibilitychange", () => {
      if (!doc.hidden) {
        scanAvatars()
      }
    })
    await initStorage({
      avatarValueChangeListener() {
        scanAvatars()
        updateMenuItemsVisibility()
      },
    })
    if ($("img")) {
      scanAvatars()
    }
    const observer = new MutationObserver(() => {
      scanAvatars()
    })
    observer.observe(doc, {
      childList: true,
      subtree: true,
    })
  }
  runWhenHeadExists(async () => {
    if (doc.documentElement.dataset.replaceUglyAvatars === void 0) {
      doc.documentElement.dataset.replaceUglyAvatars = "".concat(host2)
      await main()
    }
  })
})()
