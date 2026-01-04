// ==UserScript==
// @name            [DEBUG] 信息显式化
// @version         2.9.2.20230314
// @namespace       laster2800
// @author          Laster2800
// @description     用 alert() 提示符合匹配规则的日志或未捕获异常，帮助开发者在日常使用网页时发现潜藏问题
// @homepageURL     https://greasyfork.org/zh-CN/scripts/429521
// @supportURL      https://greasyfork.org/zh-CN/scripts/429521/feedback
// @license         LGPL-3.0
// @include         *
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @run-at          document-start
// @compatible      edge 版本不小于 93
// @compatible      chrome 版本不小于 93
// @compatible      firefox 版本不小于 92
// @downloadURL https://update.greasyfork.org/scripts/429521/%5BDEBUG%5D%20%E4%BF%A1%E6%81%AF%E6%98%BE%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429521/%5BDEBUG%5D%20%E4%BF%A1%E6%81%AF%E6%98%BE%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const errorLog = console.error
  const gm = {
    id: 'gm429521',
    injectUpdate: 20230121,
    config: {},
    fn: {
      /**
       * 获取封装日志函数
       * @param {Object} console 控制台对象
       * @param {Function} log 日志函数
       * @param {string} type 类型
       * @param {string} [source] 源
       * @returns {Function} 封装日志函数
       */
      wrappedLog(console, log, type, source) {
        const { config, fn } = gm
        return (...args) => {
          Reflect.apply(log, console, args)
          try {
            if (config.enabled) {
              const m = [args, type]
              if (fn.match(m, config.include) && !fn.match(m, config.exclude)) {
                let msg = null
                if (args.length === 1) {
                  msg = (args[0] && typeof args[0] === 'object') ? JSON.stringify(args[0], null, 2) : args[0]
                } else {
                  msg = JSON.stringify(args, null, 2)
                }
                fn.explicit(msg, type, source)
              }
            }
          } catch (e) {
            innerError(e)
          }
        }
      },
      /**
       * 显式地显示信息
       * @param {*} msg 信息
       * @param {string} [type] 类型
       * @param {string} [source] 源
       */
      explicit(msg, type, source) {
        alert(`${GM_info.script.name}${type ? `\nTYPE: ${type}` : ''}${source ? `\nSOURCE: ${source}` : ''}\n\n${msg}`)
      },
      /**
       * @param {*} obj 匹配对象
       * @param {RegExp} regex 匹配正则表达式
       * @param {number} [depth=5] 匹配查找深度
       * @returns {boolean} 是否匹配成功
       */
      match(obj, regex, depth = 5) {
        return (obj && regex && depth > 0) ? inner(obj, depth, new WeakSet()) : false

        function inner(obj, depth, objSet) {
          if (!obj) return false
          // eslint-disable-next-line guard-for-in
          innerLoop: for (const key in obj) {
            if (regex.test(key)) return true
            try {
              const value = obj[key]
              if (value && (typeof value === 'object' || typeof value === 'function')) {
                if (value === obj) continue
                if (value === value.window) continue // exclude Window
                for (const type of [Function, Node, StyleSheet]) {
                  if (value instanceof type) continue innerLoop
                }

                if (regex.test(value.toString())) return true
                if (depth > 1) {
                  if (!objSet.has(value)) {
                    objSet.add(value)
                    if (inner(value, depth - 1, objSet)) return true
                  }
                }
              } else if (regex.test(String(value))) return true
            } catch { /* value that cannot be accessed */ }

          }
          return false
        }
      },
      /**
       * 检查更新
       * @param {string} source 源
       * @param {boolean} [injectAhead] 注入版版本超前
       */
      updateCheck(source, injectAhead) {
        if (injectAhead) {
          this.explicit(`「[DEBUG] 信息显式化」版本落后于「${source}」中的注入版。请在稍后弹出的新页面中获取最新版主脚本。\n若弹出页被浏览器阻止，请手动查看浏览器的「已阻止弹出窗口」，前往主脚本主页进行更新。`, 'UPDATE', source)
          window.open('https://greasyfork.org/zh-CN/scripts/429521')
        } else {
          this.explicit(`需要更新「[DEBUG] 信息显式化（注入版）」。请在稍后弹出的新页面中获取最新版 URL 并更新「${source}」中的「@require」属性值。\n若弹出页被浏览器阻止，请手动查看浏览器的「已阻止弹出窗口」，前往注入版主页进行更新。`, 'UPDATE', source)
          window.open('https://greasyfork.org/zh-CN/scripts/429525')
        }
      },
    },
  }
  unsafeWindow[Symbol.for('ExplicitMessage')] = gm

  try {
    // 配置
    const df = { include: '.*', exclude: '^LOG$' }
    const gmInclude = GM_getValue('include') ?? df.include
    const gmExclude = GM_getValue('exclude') ?? df.exclude
    gm.config.enabled = GM_getValue('enabled') ?? true
    gm.config.include = gmInclude ? new RegExp(gmInclude) : null
    gm.config.exclude = gmExclude ? new RegExp(gmExclude) : null

    // 日志
    const { console } = unsafeWindow
    for (const n of ['log', 'debug', 'info', 'warn', 'error']) {
      console[n] = gm.fn.wrappedLog(console, console[n], n.toUpperCase())
    }

    // 未捕获异常
    unsafeWindow.addEventListener('error', /** @param {ErrorEvent} event */ event => { // 常规
      try {
        if (!gm.config.enabled) return
        const message = event.error?.stack ?? event.message
        const m = [message, event.filename, 'Uncaught Exception (Normal)']
        if (gm.fn.match(m, gm.config.include) && !gm.fn.match(m, gm.config.exclude)) {
          gm.fn.explicit(message, 'Uncaught Exception (Normal)')
        }
      } catch (e) {
        innerError(e)
      }
    })
    unsafeWindow.addEventListener('unhandledrejection', /** @param {PromiseRejectionEvent} event */ event => { // Promise
      try {
        if (!gm.config.enabled) return
        const message = event.reason.stack ?? event.reason
        const m = [message, 'Uncaught Exception (in Promise)']
        if (gm.fn.match(m, gm.config.include) && !gm.fn.match(m, gm.config.exclude)) {
          gm.fn.explicit(message, 'Uncaught Exception (in Promise)')
        }
      } catch (e) {
        innerError(e)
      }
    })

    // 菜单
    if (self === top) { // frame 中不要执行
      const initScriptMenu = () => {
        const menuMap = {}
        menuMap.enabled = GM_registerMenuCommand(`当前${gm.config.enabled ? '开启' : '关闭'}`, () => {
          try {
            gm.config.enabled = confirm(`${GM_info.script.name}\n\n「确定」以开启功能，「取消」以关闭功能。`)
            GM_setValue('enabled', gm.config.enabled)
            for (const menuId of Object.values(menuMap)) {
              GM_unregisterMenuCommand(menuId)
            }
            initScriptMenu()
          } catch (e) {
            innerError(e)
          }
        })
        menuMap.filter = GM_registerMenuCommand('设置过滤器', () => {
          try {
            const sInclude = prompt(`${GM_info.script.name}\n\n设置匹配过滤器：`, gm.config.include?.source ?? df.include)
            if (typeof sInclude === 'string') {
              gm.config.include = sInclude ? new RegExp(sInclude) : null
              GM_setValue('include', sInclude)
            }
            const sExclude = prompt(`${GM_info.script.name}\n\n设置排除过滤器：`, gm.config.exclude?.source ?? df.exclude)
            if (typeof sExclude === 'string') {
              gm.config.exclude = sExclude ? new RegExp(sExclude) : null
              GM_setValue('exclude', sExclude)
            }
          } catch (e) {
            innerError(e)
          }
        })
        menuMap.help = GM_registerMenuCommand('使用说明', () => window.open('https://gitee.com/liangjiancang/userscript/blob/master/script/ExplicitMessage/README.md#使用说明'))
        menuMap.inject = GM_registerMenuCommand('获取注入版', () => window.open('https://greasyfork.org/zh-CN/scripts/429525'))
      }
      initScriptMenu()
    }
  } catch (e) {
    innerError(e)
  }

  /**
   * 内部错误
   * @param {*} e 错误
   */
  function innerError(e) {
    gm.fn.explicit(e, 'UNKNOWN', GM_info.script.name)
    errorLog('[UNKNOWN ERROR] %s: %o', GM_info.script.name, e)
  }
})()
