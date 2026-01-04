// ==UserScript==
// @name                 Replace Ugly Avatars
// @name:zh-CN           赐你个头像吧
// @namespace            https://github.com/utags/replace-ugly-avatars
// @homepageURL          https://github.com/utags/replace-ugly-avatars#readme
// @supportURL           https://github.com/utags/replace-ugly-avatars/issues
// @version              0.5.3
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
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM_addValueChangeListener
// @grant                GM_removeValueChangeListener
// @grant                GM_addElement
// @grant                GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/472616/Replace%20Ugly%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/472616/Replace%20Ugly%20Avatars.meta.js
// ==/UserScript==
//
;(() => {
  "use strict"
  var listeners = {}
  var getValue = async (key) => {
    const value = await GM.getValue(key)
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  var setValue = async (key, value) => {
    if (value !== void 0) {
      const newValue = JSON.stringify(value)
      if (listeners[key]) {
        const oldValue = await GM.getValue(key)
        await GM.setValue(key, newValue)
        if (newValue !== oldValue) {
          for (const func of listeners[key]) {
            func(key, oldValue, newValue)
          }
        }
      } else {
        await GM.setValue(key, newValue)
      }
    }
  }
  var deleteValue = async (key) => GM.deleteValue(key)
  var _addValueChangeListener = (key, func) => {
    listeners[key] = listeners[key] || []
    listeners[key].push(func)
    return () => {
      if (listeners[key] && listeners[key].length > 0) {
        for (let i3 = listeners[key].length - 1; i3 >= 0; i3--) {
          if (listeners[key][i3] === func) {
            listeners[key].splice(i3, 1)
          }
        }
      }
    }
  }
  var addValueChangeListener = (key, func) => {
    if (typeof GM_addValueChangeListener !== "function") {
      console.warn("Do not support GM_addValueChangeListener!")
      return _addValueChangeListener(key, func)
    }
    const listenerId = GM_addValueChangeListener(key, func)
    return () => {
      GM_removeValueChangeListener(listenerId)
    }
  }
  var doc = document
  if (typeof String.prototype.replaceAll !== "function") {
    String.prototype.replaceAll = String.prototype.replace
  }
  var $ = (selectors, element) => (element || doc).querySelector(selectors)
  var $$ = (selectors, element) => [
    ...(element || doc).querySelectorAll(selectors),
  ]
  var getRootElement = (type) =>
    type === 1
      ? doc.head || doc.body || doc.documentElement
      : type === 2
      ? doc.body || doc.documentElement
      : doc.documentElement
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addElement = (parentNode, tagName, attributes) => {
    if (typeof parentNode === "string") {
      return addElement(null, parentNode, tagName)
    }
    if (!tagName) {
      return
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
    element ? element.getAttribute(name) : null
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
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
            element[name] = createHTML(value)
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
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
        style[key] = values[key].replace("!important", "")
      }
    }
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
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
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
  var sleep = async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, time)
    })
  }
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
    const result = Number.parseInt(number, 10)
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
  var runWhenDomReady = (func) => {
    if (doc.readyState === "interactive" || doc.readyState === "complete") {
      return func()
    }
    const handler = () => {
      if (doc.readyState === "interactive" || doc.readyState === "complete") {
        func()
        removeEventListener(doc, "readystatechange", handler)
      }
    }
    addEventListener(doc, "readystatechange", handler)
  }
  var escapeHTMLPolicy =
    typeof trustedTypes !== "undefined" &&
    typeof trustedTypes.createPolicy === "function"
      ? trustedTypes.createPolicy("beuEscapePolicy", {
          createHTML: (string) => string,
        })
      : void 0
  var createHTML = (html) => {
    return escapeHTMLPolicy ? escapeHTMLPolicy.createHTML(html) : html
  }
  var addElement2 =
    typeof GM_addElement === "function"
      ? (parentNode, tagName, attributes) => {
          if (typeof parentNode === "string") {
            return addElement2(null, parentNode, tagName)
          }
          if (!tagName) {
            return
          }
          if (!parentNode) {
            parentNode = /^(script|link|style|meta)$/.test(tagName)
              ? getRootElement(1)
              : getRootElement(2)
          }
          if (typeof tagName === "string") {
            let attributes2
            if (attributes) {
              const entries1 = []
              const entries2 = []
              for (const entry of Object.entries(attributes)) {
                if (/^(on\w+|innerHTML)$/.test(entry[0])) {
                  entries2.push(entry)
                } else {
                  entries1.push(entry)
                }
              }
              attributes = Object.fromEntries(entries1)
              attributes2 = Object.fromEntries(entries2)
            }
            const element = GM_addElement(null, tagName, attributes)
            setAttributes(element, attributes2)
            parentNode.append(element)
            return element
          }
          setAttributes(tagName, attributes)
          parentNode.append(tagName)
          return tagName
        }
      : addElement
  var addStyle = (styleText) =>
    addElement2(null, "style", { textContent: styleText })
  var registerMenuCommand = (name, callback, accessKey) => {
    if (window !== top) {
      return
    }
    if (typeof GM.registerMenuCommand !== "function") {
      console.warn("Do not support GM.registerMenuCommand!")
      return
    }
    GM.registerMenuCommand(name, callback, accessKey)
  }
  var style_default =
    '#browser_extension_settings_container{--browser-extension-settings-background-color: #f2f2f7;--browser-extension-settings-text-color: #444444;--browser-extension-settings-link-color: #217dfc;--sb-track-color: #00000000;--sb-thumb-color: #33334480;--sb-size: 2px;--font-family: "helvetica neue", "microsoft yahei", arial, sans-serif;position:fixed;top:10px;right:30px;max-height:90%;height:600px;overflow:hidden;display:none;z-index:100000;border-radius:5px;-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important}#browser_extension_settings_container .browser_extension_settings_wrapper{display:flex;height:100%;overflow:hidden;background-color:var(--browser-extension-settings-background-color);font-family:var(--font-family)}#browser_extension_settings_container .browser_extension_settings_wrapper h1,#browser_extension_settings_container .browser_extension_settings_wrapper h2{border:none;color:var(--browser-extension-settings-text-color);padding:0;font-family:var(--font-family);line-height:normal;letter-spacing:normal}#browser_extension_settings_container .browser_extension_settings_wrapper h1{font-size:26px;font-weight:800;margin:18px 0}#browser_extension_settings_container .browser_extension_settings_wrapper h2{font-size:18px;font-weight:600;margin:14px 0}#browser_extension_settings_container .browser_extension_settings_wrapper footer{display:flex;justify-content:center;flex-direction:column;font-size:11px;margin:10px auto 0px;background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}#browser_extension_settings_container .browser_extension_settings_wrapper footer a{color:var(--browser-extension-settings-link-color) !important;font-family:var(--font-family);text-decoration:none;padding:0}#browser_extension_settings_container .browser_extension_settings_wrapper footer p{text-align:center;padding:0;margin:2px;line-height:13px;font-size:11px;color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}#browser_extension_settings_container .browser_extension_settings_wrapper a.navigation_go_previous{color:var(--browser-extension-settings-link-color);cursor:pointer;display:none}#browser_extension_settings_container .browser_extension_settings_wrapper a.navigation_go_previous::before{content:"< "}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container{overflow-x:auto;box-sizing:border-box;padding:10px 15px;background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color)}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div{background-color:#fff;font-size:14px;border-top:1px solid #ccc;padding:6px 15px 6px 15px}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a:visited,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a:visited{display:flex;justify-content:space-between;align-items:center;cursor:pointer;text-decoration:none;color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a:hover,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a:visited:hover,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a:hover,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a:visited:hover{text-decoration:none;color:var(--browser-extension-settings-text-color)}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a span,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div a:visited span,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a span,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div a:visited span{margin-right:10px;line-height:24px;font-family:var(--font-family)}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div.active,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div:hover,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div.active,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div:hover{background-color:#e4e4e6}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div.active a,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div.active a{cursor:default}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div:first-of-type,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div:first-of-type{border-top:none;border-top-right-radius:10px;border-top-left-radius:10px}#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .installed_extension_list div:last-of-type,#browser_extension_settings_container .browser_extension_settings_wrapper .extension_list_container .related_extension_list div:last-of-type{border-bottom-right-radius:10px;border-bottom-left-radius:10px}#browser_extension_settings_container .thin_scrollbar{scrollbar-color:var(--sb-thumb-color) var(--sb-track-color);scrollbar-width:thin}#browser_extension_settings_container .thin_scrollbar::-webkit-scrollbar{width:var(--sb-size)}#browser_extension_settings_container .thin_scrollbar::-webkit-scrollbar-track{background:var(--sb-track-color);border-radius:10px}#browser_extension_settings_container .thin_scrollbar::-webkit-scrollbar-thumb{background:var(--sb-thumb-color);border-radius:10px}#browser_extension_settings_main{min-width:250px;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;padding:10px 15px;background-color:var(--browser-extension-settings-background-color);color:var(--browser-extension-settings-text-color);font-family:var(--font-family)}#browser_extension_settings_main h2{text-align:center;margin:5px 0 0}#browser_extension_settings_main .option_groups{background-color:#fff;padding:6px 15px 6px 15px;border-radius:10px;display:flex;flex-direction:column;margin:10px 0 0}#browser_extension_settings_main .option_groups .action{font-size:14px;padding:6px 0 6px 0;color:var(--browser-extension-settings-link-color);cursor:pointer}#browser_extension_settings_main .bes_external_link{font-size:14px;padding:6px 0 6px 0}#browser_extension_settings_main .bes_external_link a,#browser_extension_settings_main .bes_external_link a:visited,#browser_extension_settings_main .bes_external_link a:hover{color:var(--browser-extension-settings-link-color);font-family:var(--font-family);text-decoration:none;cursor:pointer}#browser_extension_settings_main .option_groups textarea{font-size:12px;margin:10px 0 10px 0;height:100px;width:100%;border:1px solid #a9a9a9;border-radius:4px;box-sizing:border-box}#browser_extension_settings_main .switch_option,#browser_extension_settings_main .select_option{display:flex;justify-content:space-between;align-items:center;padding:6px 0 6px 0;font-size:14px}#browser_extension_settings_main .option_groups>*{border-top:1px solid #ccc}#browser_extension_settings_main .option_groups>*:first-child{border-top:none}#browser_extension_settings_main .bes_option>.bes_icon{width:24px;height:24px;margin-right:10px}#browser_extension_settings_main .bes_option>.bes_title{margin-right:10px;flex-grow:1}#browser_extension_settings_main .bes_option>.bes_select{box-sizing:border-box;background-color:#fff;height:24px;padding:0 2px 0 2px;margin:0;border-radius:6px;border:1px solid #ccc}#browser_extension_settings_main .option_groups .bes_tip{position:relative;margin:0;padding:0 15px 0 0;border:none;max-width:none;font-size:14px}#browser_extension_settings_main .option_groups .bes_tip .bes_tip_anchor{cursor:help;text-decoration:underline}#browser_extension_settings_main .option_groups .bes_tip .bes_tip_content{position:absolute;bottom:15px;left:0;background-color:#fff;color:var(--browser-extension-settings-text-color);text-align:left;padding:10px;display:none;border-radius:5px;-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important}#browser_extension_settings_main .option_groups .bes_tip .bes_tip_anchor:hover+.bes_tip_content,#browser_extension_settings_main .option_groups .bes_tip .bes_tip_content:hover{display:block}#browser_extension_settings_main .option_groups .bes_tip p,#browser_extension_settings_main .option_groups .bes_tip pre{margin:revert;padding:revert}#browser_extension_settings_main .option_groups .bes_tip pre{font-family:Consolas,panic sans,bitstream vera sans mono,Menlo,microsoft yahei,monospace;font-size:13px;letter-spacing:.015em;line-height:120%;white-space:pre;overflow:auto;background-color:#f5f5f5;word-break:normal;overflow-wrap:normal;padding:.5em;border:none}#browser_extension_settings_main .container{--button-width: 51px;--button-height: 24px;--toggle-diameter: 20px;--color-off: #e9e9eb;--color-on: #34c759;width:var(--button-width);height:var(--button-height);position:relative;padding:0;margin:0;flex:none;user-select:none}#browser_extension_settings_main input[type=checkbox]{opacity:0;width:0;height:0;position:absolute}#browser_extension_settings_main .switch{width:100%;height:100%;display:block;background-color:var(--color-off);border-radius:calc(var(--button-height)/2);border:none;cursor:pointer;transition:all .2s ease-out}#browser_extension_settings_main .switch::before{display:none}#browser_extension_settings_main .slider{width:var(--toggle-diameter);height:var(--toggle-diameter);position:absolute;left:2px;top:calc(50% - var(--toggle-diameter)/2);border-radius:50%;background:#fff;box-shadow:0px 3px 8px rgba(0,0,0,.15),0px 3px 1px rgba(0,0,0,.06);transition:all .2s ease-out;cursor:pointer}#browser_extension_settings_main input[type=checkbox]:checked+.switch{background-color:var(--color-on)}#browser_extension_settings_main input[type=checkbox]:checked+.switch .slider{left:calc(var(--button-width) - var(--toggle-diameter) - 2px)}#browser_extension_side_menu{min-height:80px;width:30px;opacity:0;position:fixed;top:80px;right:0;padding-top:20px;z-index:10000}#browser_extension_side_menu:hover{opacity:1}#browser_extension_side_menu button{cursor:pointer;width:24px;height:24px;padding:0;border:none;background-color:rgba(0,0,0,0);background-image:none}#browser_extension_side_menu button svg{width:24px;height:24px}#browser_extension_side_menu button:hover{opacity:70%}#browser_extension_side_menu button:active{opacity:100%}@media(max-width: 500px){#browser_extension_settings_container{right:10px}#browser_extension_settings_container .extension_list_container{display:none}#browser_extension_settings_container .extension_list_container.bes_active{display:block}#browser_extension_settings_container .extension_list_container.bes_active+div{display:none}#browser_extension_settings_main a.navigation_go_previous{display:block}}'
  function createSwitch(options = {}) {
    const container = createElement("label", { class: "container" })
    const checkbox = createElement(
      "input",
      options.checked ? { type: "checkbox", checked: "" } : { type: "checkbox" }
    )
    addElement2(container, checkbox)
    const switchElm = createElement("span", { class: "switch" })
    addElement2(switchElm, "span", { class: "slider" })
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
  var besVersion = 51
  var openButton =
    '<svg viewBox="0 0 60.2601318359375 84.8134765625" version="1.1" xmlns="http://www.w3.org/2000/svg" class=" glyph-box" style="height: 9.62969px; width: 6.84191px;"><g transform="matrix(1 0 0 1 -6.194965820312518 77.63671875)"><path d="M66.4551-35.2539C66.4551-36.4746 65.9668-37.5977 65.0391-38.4766L26.3672-76.3672C25.4883-77.1973 24.4141-77.6367 23.1445-77.6367C20.6543-77.6367 18.7012-75.7324 18.7012-73.1934C18.7012-71.9727 19.1895-70.8496 19.9707-70.0195L55.5176-35.2539L19.9707-0.488281C19.1895 0.341797 18.7012 1.41602 18.7012 2.68555C18.7012 5.22461 20.6543 7.12891 23.1445 7.12891C24.4141 7.12891 25.4883 6.68945 26.3672 5.81055L65.0391-32.0312C65.9668-32.959 66.4551-34.0332 66.4551-35.2539Z"></path></g></svg>'
  var openInNewTabButton =
    '<svg viewBox="0 0 72.127685546875 72.2177734375" version="1.1" xmlns="http://www.w3.org/2000/svg" class=" glyph-box" style="height: 8.19958px; width: 8.18935px;"><g transform="matrix(1 0 0 1 -12.451127929687573 71.3388671875)"><path d="M84.5703-17.334L84.5215-66.4551C84.5215-69.2383 82.7148-71.1914 79.7852-71.1914L30.6641-71.1914C27.9297-71.1914 26.0742-69.0918 26.0742-66.748C26.0742-64.4043 28.1738-62.4023 30.4688-62.4023L47.4609-62.4023L71.2891-63.1836L62.207-55.2246L13.8184-6.73828C12.9395-5.85938 12.4512-4.73633 12.4512-3.66211C12.4512-1.31836 14.5508 0.878906 16.9922 0.878906C18.1152 0.878906 19.1895 0.488281 20.0684-0.439453L68.5547-48.877L76.6113-58.0078L75.7324-35.2051L75.7324-17.1387C75.7324-14.8438 77.7344-12.6953 80.127-12.6953C82.4707-12.6953 84.5703-14.6973 84.5703-17.334Z"></path></g></svg>'
  var settingButton =
    '<svg viewBox="0 0 16 16" version="1.1">\n<path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"></path>\n</svg>'
  function initI18n(messageMaps, language) {
    language = (language || navigator.language).toLowerCase()
    const language2 = language.slice(0, 2)
    let messagesDefault
    let messagesLocal
    for (const entry of Object.entries(messageMaps)) {
      const langs = new Set(
        entry[0]
          .toLowerCase()
          .split(",")
          .map((v) => v.trim())
      )
      const value = entry[1]
      if (langs.has(language)) {
        messagesLocal = value
      }
      if (langs.has(language2) && !messagesLocal) {
        messagesLocal = value
      }
      if (langs.has("en")) {
        messagesDefault = value
      }
      if (langs.has("en-us") && !messagesDefault) {
        messagesDefault = value
      }
    }
    if (!messagesLocal) {
      messagesLocal = {}
    }
    if (!messagesDefault || messagesDefault === messagesLocal) {
      messagesDefault = {}
    }
    return function (key, ...parameters) {
      let text = messagesLocal[key] || messagesDefault[key] || key
      if (parameters && parameters.length > 0 && text !== key) {
        for (let i3 = 0; i3 < parameters.length; i3++) {
          text = text.replaceAll(
            new RegExp("\\{".concat(i3 + 1, "\\}"), "g"),
            String(parameters[i3])
          )
        }
      }
      return text
    }
  }
  var messages = {
    "settings.title": "Settings",
    "settings.otherExtensions": "Other Extensions",
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
    "settings.displaySettingsButtonInSideMenu":
      "\u5728\u4FA7\u8FB9\u680F\u83DC\u5355\u4E2D\u663E\u793A\u8BBE\u7F6E\u6309\u94AE",
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
  var i = initI18n({
    "en,en-US": en_default,
    "zh,zh-CN": zh_cn_default,
  })
  var lang = navigator.language
  var locale
  if (lang === "zh-TW" || lang === "zh-HK") {
    locale = "zh-TW"
  } else if (lang.includes("zh")) {
    locale = "zh-CN"
  } else {
    locale = "en"
  }
  var relatedExtensions = [
    {
      id: "utags",
      title: i("settings.extensions.utags.title"),
      url: "https://greasyfork.org/".concat(
        locale,
        "/scripts/460718-utags-add-usertags-to-links"
      ),
    },
    {
      id: "links-helper",
      title: i("settings.extensions.links-helper.title"),
      description:
        "\u5728\u65B0\u6807\u7B7E\u9875\u4E2D\u6253\u5F00\u7B2C\u4E09\u65B9\u7F51\u7AD9\u94FE\u63A5\uFF0C\u56FE\u7247\u94FE\u63A5\u8F6C\u56FE\u7247\u6807\u7B7E\u7B49",
      url: "https://greasyfork.org/".concat(
        locale,
        "/scripts/464541-links-helper"
      ),
    },
    {
      id: "v2ex.rep",
      title: i("settings.extensions.v2ex.rep.title"),
      url: "https://greasyfork.org/".concat(
        locale,
        "/scripts/466589-v2ex-rep-%E4%B8%93%E6%B3%A8%E6%8F%90%E5%8D%87-v2ex-%E4%B8%BB%E9%A2%98%E5%9B%9E%E5%A4%8D%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C"
      ),
    },
    {
      id: "v2ex.min",
      title: i("settings.extensions.v2ex.min.title"),
      url: "https://greasyfork.org/".concat(
        locale,
        "/scripts/463552-v2ex-min-v2ex-%E6%9E%81%E7%AE%80%E9%A3%8E%E6%A0%BC"
      ),
    },
    {
      id: "replace-ugly-avatars",
      title: i("settings.extensions.replace-ugly-avatars.title"),
      url: "https://greasyfork.org/".concat(
        locale,
        "/scripts/472616-replace-ugly-avatars"
      ),
    },
    {
      id: "more-by-pipecraft",
      title: i("settings.extensions.more-by-pipecraft.title"),
      url: "https://greasyfork.org/".concat(locale, "/users/1030884-pipecraft"),
    },
  ]
  var getInstalledExtesionList = () => {
    return $(".extension_list_container .installed_extension_list")
  }
  var getRelatedExtesionList = () => {
    return $(".extension_list_container .related_extension_list")
  }
  var isInstalledExtension = (id) => {
    const list = getInstalledExtesionList()
    if (!list) {
      return false
    }
    const installed = $('[data-extension-id="'.concat(id, '"]'), list)
    return Boolean(installed)
  }
  var addCurrentExtension = (extension) => {
    const list = getInstalledExtesionList()
    if (!list) {
      return
    }
    if (isInstalledExtension(extension.id)) {
      return
    }
    const element = createInstalledExtension(extension)
    list.append(element)
    const list2 = getRelatedExtesionList()
    if (list2) {
      updateRelatedExtensions(list2)
    }
  }
  var activeExtension = (id) => {
    const list = getInstalledExtesionList()
    if (!list) {
      return false
    }
    for (const element of $$(".active", list)) {
      removeClass(element, "active")
    }
    const installed = $('[data-extension-id="'.concat(id, '"]'), list)
    if (installed) {
      addClass(installed, "active")
    }
  }
  var activeExtensionList = () => {
    const extensionListContainer = $(".extension_list_container")
    if (extensionListContainer) {
      addClass(extensionListContainer, "bes_active")
    }
  }
  var deactiveExtensionList = () => {
    const extensionListContainer = $(".extension_list_container")
    if (extensionListContainer) {
      removeClass(extensionListContainer, "bes_active")
    }
  }
  var createInstalledExtension = (installedExtension) => {
    const div = createElement("div", {
      class: "installed_extension",
      "data-extension-id": installedExtension.id,
    })
    const a = addElement2(div, "a", {
      onclick: installedExtension.onclick,
    })
    addElement2(a, "span", {
      textContent: installedExtension.title,
    })
    const svg = addElement2(a, "svg")
    svg.outerHTML = createHTML(openButton)
    return div
  }
  var updateRelatedExtensions = (container) => {
    const relatedExtensionElements = $$("[data-extension-id]", container)
    if (relatedExtensionElements.length > 0) {
      for (const relatedExtensionElement of relatedExtensionElements) {
        if (
          isInstalledExtension(
            relatedExtensionElement.dataset.extensionId || "noid"
          )
        ) {
          relatedExtensionElement.remove()
        }
      }
    } else {
      container.innerHTML = createHTML("")
    }
    for (const relatedExtension of relatedExtensions) {
      if (
        isInstalledExtension(relatedExtension.id) ||
        $('[data-extension-id="'.concat(relatedExtension.id, '"]'), container)
      ) {
        continue
      }
      if ($$("[data-extension-id]", container).length >= 4) {
        return
      }
      const div4 = addElement2(container, "div", {
        class: "related_extension",
        "data-extension-id": relatedExtension.id,
      })
      const a = addElement2(div4, "a", {
        href: relatedExtension.url,
        target: "_blank",
      })
      addElement2(a, "span", {
        textContent: relatedExtension.title,
      })
      const svg = addElement2(a, "svg")
      svg.outerHTML = createHTML(openInNewTabButton)
    }
  }
  function createExtensionList(installedExtensions) {
    const div = createElement("div", {
      class: "extension_list_container thin_scrollbar",
    })
    addElement2(div, "h1", { textContent: i("settings.title") })
    const div2 = addElement2(div, "div", {
      class: "installed_extension_list",
    })
    for (const installedExtension of installedExtensions) {
      if (isInstalledExtension(installedExtension.id)) {
        continue
      }
      const element = createInstalledExtension(installedExtension)
      div2.append(element)
    }
    addElement2(div, "h2", { textContent: i("settings.otherExtensions") })
    const div3 = addElement2(div, "div", {
      class: "related_extension_list",
    })
    updateRelatedExtensions(div3)
    return div
  }
  var prefix = "browser_extension_settings_"
  var randomId = String(Math.round(Math.random() * 1e4))
  var settingsContainerId = prefix + "container_" + randomId
  var settingsElementId = prefix + "main_" + randomId
  var getSettingsElement = () => $("#" + settingsElementId)
  var getSettingsStyle = () =>
    style_default
      .replaceAll(/browser_extension_settings_container/gm, settingsContainerId)
      .replaceAll(/browser_extension_settings_main/gm, settingsElementId)
  var storageKey = "settings"
  var settingsOptions
  var settingsTable = {}
  var settings = {}
  async function getSettings() {
    var _a
    return (_a = await getValue(storageKey)) != null ? _a : {}
  }
  async function saveSettingsValue(key, value) {
    const settings2 = await getSettings()
    settings2[key] =
      settingsTable[key] && settingsTable[key].defaultValue === value
        ? void 0
        : value
    await setValue(storageKey, settings2)
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
    await setValue(storageKey, settings2)
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
      settingsContainer.style.display = "none"
    }
    removeEventListener(document, "click", onDocumentClick, true)
    removeEventListener(document, "keydown", onDocumentKeyDown, true)
  }
  var onDocumentClick = (event) => {
    const target = event.target
    if (
      target == null ? void 0 : target.closest(".".concat(prefix, "container"))
    ) {
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
            const checkbox = $(
              "#"
                .concat(
                  settingsElementId,
                  ' .option_groups .switch_option[data-key="'
                )
                .concat(key, '"] input')
            )
            if (checkbox) {
              checkbox.checked = getSettingsValue(key)
            }
            break
          }
          case "select": {
            const options = $$(
              "#"
                .concat(
                  settingsElementId,
                  ' .option_groups .select_option[data-key="'
                )
                .concat(key, '"] .bes_select option')
            )
            for (const option of options) {
              option.selected = option.value === String(getSettingsValue(key))
            }
            break
          }
          case "textarea": {
            const textArea = $(
              "#"
                .concat(
                  settingsElementId,
                  ' .option_groups textarea[data-key="'
                )
                .concat(key, '"]')
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
  function getSettingsContainer() {
    const container = $(".".concat(prefix, "container"))
    if (container) {
      const theVersion = parseInt10(container.dataset.besVersion, 0)
      if (theVersion < besVersion) {
        container.id = settingsContainerId
        container.dataset.besVersion = String(besVersion)
      }
      return container
    }
    return addElement2(doc.body, "div", {
      id: settingsContainerId,
      class: "".concat(prefix, "container"),
      "data-bes-version": besVersion,
      style: "display: none;",
    })
  }
  function getSettingsWrapper() {
    const container = getSettingsContainer()
    return (
      $(".".concat(prefix, "wrapper"), container) ||
      addElement2(container, "div", {
        class: "".concat(prefix, "wrapper"),
      })
    )
  }
  function initExtensionList() {
    const wrapper = getSettingsWrapper()
    if (!$(".extension_list_container", wrapper)) {
      const list = createExtensionList([])
      wrapper.append(list)
    }
    addCurrentExtension({
      id: settingsOptions.id,
      title: settingsOptions.title,
      onclick: showSettings,
    })
  }
  function createSettingsElement() {
    let settingsMain = getSettingsElement()
    if (!settingsMain) {
      const wrapper = getSettingsWrapper()
      for (const element of $$(".".concat(prefix, "main"))) {
        element.remove()
      }
      settingsMain = addElement2(wrapper, "div", {
        id: settingsElementId,
        class: "".concat(prefix, "main thin_scrollbar"),
      })
      addElement2(settingsMain, "a", {
        textContent: "Settings",
        class: "navigation_go_previous",
        onclick() {
          activeExtensionList()
        },
      })
      if (settingsOptions.title) {
        addElement2(settingsMain, "h2", { textContent: settingsOptions.title })
      }
      const optionGroups = []
      const getOptionGroup = (index) => {
        if (index > optionGroups.length) {
          for (let i3 = optionGroups.length; i3 < index; i3++) {
            optionGroups.push(
              addElement2(settingsMain, "div", {
                class: "option_groups",
              })
            )
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
  function addSideMenu() {
    if (!getSettingsValue("displaySettingsButtonInSideMenu")) {
      return
    }
    const menu =
      $("#browser_extension_side_menu") ||
      addElement2(doc.body, "div", {
        id: "browser_extension_side_menu",
        "data-bes-version": besVersion,
      })
    const button = $("button[data-bes-version]", menu)
    if (button) {
      const theVersion = parseInt10(button.dataset.besVersion, 0)
      if (theVersion >= besVersion) {
        return
      }
      button.remove()
    }
    addElement2(menu, "button", {
      type: "button",
      "data-bes-version": besVersion,
      title: i("settings.menu.settings"),
      onclick() {
        setTimeout(showSettings, 1)
      },
      innerHTML: settingButton,
    })
  }
  function addCommonSettings(settingsTable3) {
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
    settingsTable3.displaySettingsButtonInSideMenu = {
      title: i("settings.displaySettingsButtonInSideMenu"),
      defaultValue: !(
        typeof GM === "object" && typeof GM.registerMenuCommand === "function"
      ),
      group: maxGroup + 1,
    }
  }
  function handleShowSettingsUrl() {
    if (location.hash === "#bes-show-settings") {
      setTimeout(showSettings, 100)
    }
  }
  async function showSettings() {
    const settingsContainer = getSettingsContainer()
    const settingsMain = createSettingsElement()
    await updateOptions()
    settingsContainer.style.display = "block"
    addEventListener(document, "click", onDocumentClick, true)
    addEventListener(document, "keydown", onDocumentKeyDown, true)
    activeExtension(settingsOptions.id)
    deactiveExtensionList()
  }
  var initSettings = async (options) => {
    settingsOptions = options
    settingsTable = options.settingsTable || {}
    addCommonSettings(settingsTable)
    addValueChangeListener(storageKey, async () => {
      settings = await getSettings()
      await updateOptions()
      addSideMenu()
      if (typeof options.onValueChange === "function") {
        options.onValueChange()
      }
    })
    settings = await getSettings()
    runWhenHeadExists(() => {
      addStyle(getSettingsStyle())
    })
    runWhenDomReady(() => {
      initExtensionList()
      addSideMenu()
    })
    registerMenuCommand(i("settings.menu.settings"), showSettings, "o")
    handleShowSettingsUrl()
  }
  var content_default =
    '#rua_container .change_button{position:absolute;box-sizing:border-box;width:20px;height:20px;padding:1px;border:1px solid;cursor:pointer;color:#0d6efd;z-index:10001}#rua_container .change_button.advanced{color:#00008b;display:none}#rua_container .change_button.hide{display:none}#rua_container .change_button:active,#rua_container .change_button.active{opacity:50%;transition:all .2s}#rua_container:hover .change_button{display:block !important}img.rua_fadeout{opacity:10%;transition:all 1s ease-out}[data-replace-ugly-avatars*="v2ex.co"] #Main .header .fr a img{width:73px;height:73px}[data-replace-ugly-avatars*="v2ex.co"] td[width="48"] img{width:48px;height:48px}'
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
        return fetchRamdomAvatar()
      }
    }
  }
  var storageKey2 = "gfriendsData"
  async function initRamdomAvatar() {
    if (cachedData && cachedData.length > 0) {
      return
    }
    cachedData = await getValue(storageKey2)
    if (cachedData) {
      setTimeout(async () => {
        const data = await fetchRamdomAvatar()
        if (data) {
          await setValue(storageKey2, data)
        }
      }, 1e3 * 60)
    } else {
      const data = await fetchRamdomAvatar()
      if (data) {
        cachedData = data
        await setValue(storageKey2, data)
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
        return fetchRamdomAvatar2()
      }
    }
  }
  var storageKey3 = "uglyAvatarData"
  async function initRamdomAvatar2() {
    if (cachedData2 && cachedData2.length > 0) {
      return
    }
    cachedData2 = await getValue(storageKey3)
    if (cachedData2) {
      setTimeout(async () => {
        const data = await fetchRamdomAvatar2()
        if (data) {
          await setValue(storageKey3, data)
        }
      }, 1e3 * 60)
    } else {
      const data = await fetchRamdomAvatar2()
      if (data) {
        cachedData2 = data
        await setValue(storageKey3, data)
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
  var messages3 = {
    "settings.enableCurrentSite": "Enable on current site",
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
  }
  var en_default2 = messages3
  var messages4 = {
    "settings.enableCurrentSite":
      "\u5728\u5F53\u524D\u7F51\u7AD9\u542F\u7528\u811A\u672C",
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
  }
  var zh_cn_default2 = messages4
  var i2 = initI18n({
    "en,en-US": en_default2,
    "zh,zh-CN": zh_cn_default2,
  })
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
    const values = (await getValue(storageKey4)) || {}
    values[userName] = src
    await setValue(storageKey4, values)
  }
  async function saveAvatars(newValues) {
    let values = (await getValue(storageKey4)) || {}
    values = Object.assign(values, newValues)
    await setValue(storageKey4, values)
  }
  async function clearAvatarData() {
    await deleteValue(storageKey4)
  }
  var cachedValues = {}
  async function reloadCachedValues() {
    cachedValues = (await getValue(storageKey4)) || {}
  }
  function getChangedAavatar(userName) {
    return cachedValues[userName]
  }
  async function initStorage(options) {
    addValueChangeListener(storageKey4, async () => {
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
  var host2 = location.host
  var suffix = host2.includes("v2ex") ? "" : "_" + host2
  var isEnabledByDefault = () => {
    if (host2.includes("xxxxxxxx")) {
      return false
    }
    return true
  }
  var settingsTable2 = {
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
  }
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
    const changeButton2 =
      $(".change_button.advanced", container) ||
      addElement2(container, "button", {
        innerHTML: changeIcon,
        class: "change_button advanced",
        async onclick() {
          addClass(changeButton2, "active")
          setTimeout(() => {
            removeClass(changeButton2, "active")
          }, 200)
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = prompt(i2("prompt.enterAvatarLink"), "")
          if (avatarUrl) {
            changeAvatar(currentTarget, avatarUrl, true)
            await saveAvatar(userName, avatarUrl)
          }
        },
      })
    removeClass(changeButton, "hide")
    removeClass(changeButton2, "hide")
    const pos = getOffsetPosition(element)
    const leftOffset =
      element.clientWidth - changeButton.clientWidth > 20
        ? element.clientWidth - changeButton.clientWidth
        : element.clientWidth - 1
    changeButton.style.top = pos.top + "px"
    changeButton.style.left = pos.left + leftOffset + "px"
    changeButton2.style.top = pos.top + changeButton.clientHeight + "px"
    changeButton2.style.left = pos.left + leftOffset + "px"
    const mouseoutHandler = () => {
      addClass(changeButton, "hide")
      addClass(changeButton2, "hide")
      removeEventListener(element, "mouseout", mouseoutHandler)
    }
    addEventListener(element, "mouseout", mouseoutHandler)
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
      await initSettings({
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
        async onValueChange() {
          await onSettingsChange()
        },
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
      addElement2("style", {
        textContent: content_default,
        id: "rua_tyle",
      })
    })
    addEventListener(doc, "mouseover", (event) => {
      const target = event.target
      if (!isAvatar(target)) {
        return
      }
      addChangeButton(target)
    })
    addEventListener(doc, "visibilitychange", () => {
      if (!doc.hidden) {
        scanAvatars()
      }
    })
    await initStorage({
      avatarValueChangeListener() {
        scanAvatars()
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
