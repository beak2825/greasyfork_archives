// ==UserScript==
// @name DevTools 全功能防护
// @namespace devtools-full-function-protection
// @version 2.0.1
// @description 一站式解除网页的防调试、重定向、右键屏蔽，同时屏蔽 disable-devtool / devtools-detector，让 DevTools 自由使用。
// @author ryanuo
// @match *://*/*
// @grant none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/546048/DevTools%20%E5%85%A8%E5%8A%9F%E8%83%BD%E9%98%B2%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/546048/DevTools%20%E5%85%A8%E5%8A%9F%E8%83%BD%E9%98%B2%E6%8A%A4.meta.js
// ==/UserScript==

(() => {
  'use strict'
  if (!(document instanceof XMLDocument)) {
    const slice = Array.prototype.slice
    Array.prototype.slice = function (...args) {
      if (args.length === 0 && Array.prototype.every.call(
        this,
        v => v && typeof v === 'object' && typeof v.name === 'string' && typeof v.isOpen === 'function' && typeof v.isEnable === 'function',
      )) {
        Array.prototype.slice = slice
        return []
      }
      return slice.apply(this, args)
    }
    const assign = Object.assign
    Object.assign = function (...args) {
      if (args.length === 2 && typeof args[0] === 'function' && typeof args[1] === 'object' && args[1] !== null && typeof args[1].isDevToolOpened === 'function' && typeof args[1].version === 'string' && typeof args[1].isRunning === 'boolean' && typeof args[1].isSuspend === 'boolean') {
        Object.assign = assign
        const result = Object.assign(...args)
        console.log('[补丁] 检测到 disable-devtool 组件 → 已拦截:', result)
        return Object.assign(
          () => {
            console.trace('disable-devtool 被调用')
          },
          args[1],
        )
      }
      return assign.call(this, ...args)
    }
  }
  function blockRedirect(obj, prop) {
    try {
      Object.defineProperty(obj, prop, {
        configurable: true,
        get: () => window.location,
        set: v => console.warn(`[拦截] ${prop} 修改 ->`, v),
      })
    }
    catch {
    }
  }
  blockRedirect(window, 'location')
  blockRedirect(window.top, 'location');
  ['assign', 'replace', 'reload'].forEach((fn) => {
    try {
      window.location[fn] = url => console.warn(`[拦截] location.${fn}(${url})`);
      (window.top?.location)[fn] = url => console.warn(`[拦截] top.location.${fn}(${url})`)
    }
    catch {
    }
  })
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase())) {
        e.stopImmediatePropagation()
      }
      if (e.keyCode === 123) {
        e.preventDefault()
        e.stopImmediatePropagation()
        console.warn('[拦截] F12 键被按下')
      }
    },
    true,
  )
  window.addEventListener(
    'contextmenu',
    e => e.stopImmediatePropagation(),
    true,
  )
  const _debugger = Function.prototype.constructor
  Function.prototype.constructor = function (str) {
    if (str.includes('debugger')) {
      console.warn('[拦截] debugger 注入')
      return function () {
      }
    }
    return _debugger(str)
  }
  const _setInterval = window.setInterval
  window.setInterval = function (fn, delay, ...args) {
    if (fn && fn.toString().match(/debugger|devtools|console/)) {
      console.warn('[拦截] 可疑 setInterval ->', fn.toString().slice(0, 50))
      return 0
    }
    return _setInterval(fn, delay, ...args)
  }
  Object.defineProperty(window, 'onbeforeunload', {
    set: () => console.warn('[拦截] onbeforeunload 设置'),
    get: () => null,
  })
  const devtoolsDetector = /./
  devtoolsDetector.toString = () => ''
  window.devtoolsDetector = devtoolsDetector
  console.log('%c[DevTools 全功能防护已启用]', 'color: green; font-weight: bold;')
})()
