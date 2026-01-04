// ==UserScript==
// @name         SGS Base
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  三国杀依赖脚本
// @author       ll
// @match       http://web.sanguosha.com/*
// @match       *://*.sanguosha.com/*
// @match       *://game.iwan4399.com/yxsgs/*
// @run-at      document-start
// @license      MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/478490/SGS%20Base.user.js
// @updateURL https://update.greasyfork.org/scripts/478490/SGS%20Base.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  window.SGSMODULE =
    window.SGSMODULE ||
    class MODULE {
      constructor() {
        window.WDVerSion = '1.0.0'
        this._module = []
        this.instance = null
        console._log = console.log
        console._log('%cBASE', 'font-weight: bold; color: white; background-color: #525288; padding: 1px 4px; border-radius: 4px;')
        const _log = (...args) => {
          console._log(...args)
          this._module.forEach((fn) => {
            fn(...args)
          })
        }
        Object.defineProperty(console, 'log', {
          get() {
            return _log
          },
          set() {
            return
          }
        })
      }
      static getInstance() {
        if (!this.instance) {
          this.instance = new MODULE()
        }
        return this.instance
      }
      addModule(fn) {
        this._module.push(fn)
      }
    }
})()
