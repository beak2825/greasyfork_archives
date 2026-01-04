/* exported UserscriptAPI */
/**
 * UserscriptAPI
 *
 * 需要引入模块方可工作，详见 `README.md`。
 * @version 2.2.1.20230314
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/UserscriptAPI UserscriptAPI}
 */
class UserscriptAPI {
  /** @type {{[name: string]: Function}} 可访问模块 */
  static #modules = {}
  /** @type {string[]} 待添加模块样式队列 */
  #moduleCssQueue = []

  /**
   * @param {Object} [options] 选项
   * @param {string} [options.id='default'] 标识符
   * @param {string} [options.label] 日志标签，为空时不设置标签
   * @param {Object} [options.wait] `wait` API 默认选项（默认值见构造器代码）
   * @param {Object} [options.wait.condition] `wait` 条件 API 默认选项
   * @param {Object} [options.wait.element] `wait` 元素 API 默认选项
   * @param {number} [options.fadeTime=400] UI 渐变时间
   */
  constructor(options) {
    this.options = {
      id: 'default',
      label: null,
      fadeTime: 400,
      ...options,
      wait: {
        condition: {
          callback: result => this.logger.info(result),
          interval: 100,
          timeout: 10000,
          onTimeout: options => this.logger[options.stopOnTimeout ? 'error' : 'warn']('executeAfterConditionPassed: TIMEOUT', options),
          stopOnTimeout: true,
          stopCondition: null,
          onStop: options => this.logger.error('executeAfterConditionPassed: STOP', options),
          stopInterval: 50,
          stopTimeout: 0,
          onError: (options, e) => this.logger.error('executeAfterConditionPassed: ERROR', options, e),
          stopOnError: true,
          timePadding: 0,
          ...options?.wait?.condition,
        },
        element: {
          base: document,
          exclude: null,
          callback: el => this.logger.info(el),
          subtree: true,
          multiple: false,
          repeat: false,
          throttleWait: 100,
          timeout: 10000,
          onTimeout: options => this.logger[options.stopOnTimeout ? 'error' : 'warn']('executeAfterElementLoaded: TIMEOUT', options),
          stopOnTimeout: false,
          stopCondition: null,
          onStop: options => this.logger.error('executeAfterElementLoaded: STOP', options),
          onError: (options, e) => this.logger.error('executeAfterElementLoaded: ERROR', options, e),
          stopOnError: true,
          timePadding: 0,
          ...options?.wait?.element,
        },
      },
    }

    /** @type {UserscriptAPIDom} */
    this.dom = this.#getModuleInstance('dom')
    /** @type {UserscriptAPIMessage} */
    this.message = this.#getModuleInstance('message')
    /** @type {UserscriptAPIWait} */
    this.wait = this.#getModuleInstance('wait')
    /** @type {UserscriptAPIWeb} */
    this.web = this.#getModuleInstance('web')

    if (!this.message) {
      this.message = {
        api: this,
        alert: this.base.alert,
        confirm: this.base.confirm,
        prompt: this.base.prompt,
      }
    }

    for (const css of this.#moduleCssQueue) {
      this.base.addStyle(css)
    }
  }

  /**
   * 注册模块
   * @param {string} name 模块名称
   * @param {Object} module 模块类
   */
  static registerModule(name, module) {
    this.#modules[name] = module
  }

  /**
   * 获取模块实例
   * @param {string} name 模块名称
   * @returns {Object} 模块实例，无对应模块时返回 `null`
   */
  #getModuleInstance(name) {
    const module = UserscriptAPI.#modules[name]
    return module ? new module(this) : null
  }

  /**
   * 初始化模块样式（仅应在模块构造器中使用）
   * @param {string} css 样式
   */
  initModuleStyle(css) {
    this.#moduleCssQueue.push(css)
  }

  /**
   * UserscriptAPIBase
   * @version 1.3.0.20240827
   */
  base = new class UserscriptAPIBase {
    /**
     * @param {UserscriptAPI} api `UserscriptAPI`
     */
    constructor(api) {
      this.api = api
    }

    /**
     * 添加样式
     * @param {string} css 样式
     * @param {Document | DocumentFragment} [doc=document] 文档
     * @returns {HTMLStyleElement} `<style>`
     */
    addStyle(css, doc = document) {
      const { api } = this
      let style = null
      if (doc instanceof Document) {
        style = doc.createElement('style')
        style.className = `${api.options.id}-style`
        style.textContent = css
        const parent = doc.head || doc.documentElement
        if (parent) {
          parent.append(style)
        } else { // 极端情况下会出现，DevTools 网络+CPU 双限制可模拟
          api.wait?.waitForConditionPassed({
            condition: () => doc.head || doc.documentElement,
            timeout: 0,
          }).then(parent => parent.append(style))
        }
      } else if (doc instanceof DocumentFragment) {
        style = document.createElement('style')
        style.className = `${api.options.id}-style`
        style.textContent = css
        doc.appendChild(style)
      }
      return style
    }

    /**
     * 判断给定 URL 是否匹配
     * @param {RegExp | RegExp[]} regex 用于判断是否匹配的正则表达式，或正则表达式数组
     * @param {'OR' | 'AND'} [mode='OR'] 匹配模式
     * @returns {boolean} 是否匹配
     */
    urlMatch(regex, mode = 'OR') {
      let result = false
      const { href } = location
      if (Array.isArray(regex)) {
        if (regex.length > 0) {
          if (mode === 'AND') {
            result = true
            for (const ex of regex) {
              if (!ex.test(href)) {
                result = false
                break
              }
            }
          } else if (mode === 'OR') {
            for (const ex of regex) {
              if (ex.test(href)) {
                result = true
                break
              }
            }
          }
        }
      } else {
        result = regex.test(href)
      }
      return result
    }

    /**
     * 初始化 `urlchange` 事件
     * @example
     *  window.addEventListener('urlchange', e => { ... })
     *  window.addEventListener('urlchange', e => e.stopPropagation(), true)
     *  window.onurlchange = function(e) { ... }
     * @see {@link https://stackoverflow.com/a/52809105 How to detect if URL has changed after hash in JavaScript}
     * @see {@link https://stackoverflow.com/a/69342637 Event bubbles before captured on `window`}
     */
    initUrlchangeEvent() {
      const win = typeof unsafeWindow === 'object' ? unsafeWindow : window
      if (win[Symbol.for('onurlchange')] === undefined) {
        let url = new URL(location.href)
        const dispatchEvent = () => {
          const event = new CustomEvent('urlchange', {
            detail: { prev: url, curr: new URL(location.href) },
            bubbles: true,
          })
          url = event.detail.curr
          if (typeof window.onurlchange === 'function') { // 若直接调用则 eventPhase 不对，且会有一些其他问题
            // 这一方案只能让事件处理器属性在最后被激活，但正确的顺序是：https://stackoverflow.com/a/49806959
            // 要实现正确的顺序，需用 defineProperty 定义 onurlchange，但 Tampermonkey 已经定义了该属性
            // 尽管目前 Tampermonkey 定义的属性是可写的，但为了向前兼容性及简化代码考虑，决定采用当前方案
            window.addEventListener('urlchange', window.onurlchange, { once: true })
          }
          document.dispatchEvent(event) // 在 window 上 dispatch 不能确保在冒泡前捕获，至少目前是这样
        }

        history.pushState = (f => (...args) => {
          const ret = Reflect.apply(f, history, args)
          dispatchEvent()
          return ret
        })(history.pushState)
        history.replaceState = (f => (...args) => {
          const ret = Reflect.apply(f, history, args)
          dispatchEvent()
          return ret
        })(history.replaceState)
        window.addEventListener('popstate', () => {
          dispatchEvent()
        })
        win[Symbol.for('onurlchange')] = true
      }
    }

    /**
     * 生成消抖函数
     * @param {Function} fn 目标函数
     * @param {number} [wait=0] 消抖延迟
     * @param {Object} [options] 选项
     * @param {boolean} [options.leading] 是否在延迟开始前调用目标函数
     * @param {boolean} [options.trailing=true] 是否在延迟结束后调用目标函数
     * @param {number} [options.maxWait=0] 最大延迟时间（非准确），`0` 表示禁用
     * @returns {Function} 消抖函数 `debounced`，可调用 `debounced.cancel()` 取消执行
     */
    debounce(fn, wait = 0, options = {}) {
      options = {
        leading: false,
        trailing: true,
        maxWait: 0,
        ...options,
      }

      let tid = null
      let start = null
      let execute = null
      let callback = null

      /** @this {*} thisArg */
      function debounced(...args) {
        execute = () => {
          Reflect.apply(fn, this, args)
          execute = null
        }
        callback = () => {
          if (options.trailing) {
            execute?.()
          }
          tid = null
          start = null
        }

        if (tid) {
          clearTimeout(tid)
          if (options.maxWait > 0 && Date.now() - start > options.maxWait) {
            callback()
          }
        }

        if (!tid && options.leading) {
          execute?.()
        }

        if (!start) {
          start = Date.now()
        }

        tid = setTimeout(callback, wait)
      }

      debounced.cancel = function() {
        if (tid) {
          clearTimeout(tid)
          tid = null
          start = null
        }
      }

      return debounced
    }

    /**
     * 生成节流函数
     * @param {Function} fn 目标函数
     * @param {number} [wait=0] 节流延迟（非准确）
     * @returns {Function} 节流函数 `throttled`，可调用 `throttled.cancel()` 取消执行
     */
    throttle(fn, wait = 0) {
      return this.debounce(fn, wait, {
        leading: true,
        trailing: true,
        maxWait: wait,
      })
    }

    /**
     * 创建基础提醒对话框（异步）
     *
     * 若没有引入 `message` 模块，可使用 `api.message.alert()` 引用该方法。
     * @param {string} msg 信息
     */
    alert(msg) {
      const { label } = this.api.options
      return new Promise(resolve => {
        resolve(alert(`${label ? `${label}\n\n` : ''}${msg}`))
      })
    }

    /**
     * 创建基础确认对话框（异步）
     *
     * 若没有引入 `message` 模块，可使用 `api.message.confirm()` 引用该方法。
     * @param {string} msg 信息
     * @returns {Promise<boolean>} 用户输入
     */
    confirm(msg) {
      const { label } = this.api.options
      return new Promise(resolve => {
        resolve(confirm(`${label ? `${label}\n\n` : ''}${msg}`))
      })
    }

    /**
     * 创建基础输入对话框（异步）
     *
     * 若没有引入 `message` 模块，可使用 `api.message.prompt()` 引用该方法。
     * @param {string} msg 信息
     * @param {string} [val] 默认值
     * @returns {Promise<string>} 用户输入
     */
    prompt(msg, val) {
      const { label } = this.api.options
      return new Promise(resolve => {
        resolve(prompt(`${label ? `${label}\n\n` : ''}${msg}`, val))
      })
    }
  }(this)

  /**
   * UserscriptAPILogger
   * @version 1.2.0.20210925
   */
  logger = new class UserscriptAPILogger {
    #logCss = `
      background-color: black;
      color: white;
      border-radius: 2px;
      padding: 2px;
      margin-right: 4px;
    `

    /**
     * @param {UserscriptAPI} api `UserscriptAPI`
     */
    constructor(api) {
      this.api = api
    }

    /**
     * 打印格式化日志
     * @param {'info' | 'warn' | 'error'} fn 日志函数名
     * @param {*[]} message 日志信息
     */
    #log(fn, ...message) {
      const output = console[fn]
      const label = this.api.options.label ?? ''
      const causes = []
      let template = null
      if (message.length > 0) {
        const types = []
        for (const [idx, m] of message.entries()) {
          if (m) {
            types.push(typeof m === 'string' ? '%s' : '%o')
            if (m instanceof Error && m.cause !== undefined) {
              causes.push(m.cause)
            }
          } else {
            if (m === undefined) {
              message[idx] = '[undefined]'
            } else if (m === null) {
              message[idx] = '[null]'
            } else if (m === '') {
              message[idx] = '[empty string]'
            }
            types.push(typeof message[idx] === 'string' ? '%s' : '%o')
          }
        }
        template = types.join(', ')
      } else {
        template = '[undefined]'
      }
      output(`%c${label}%c${template}`, this.#logCss, null, ...message)
      for (const [idx, cause] of causes.entries()) {
        output(`%c${label}%c${idx + 1}-th error is caused by %o`, this.#logCss, null, cause)
      }
    }

    /**
     * 打印日志
     * @param {*[]} message 日志信息
     */
    info(...message) {
      this.#log('info', ...message)
    }

    /**
     * 打印警告日志
     * @param {*[]} message 警告日志信息
     */
    warn(...message) {
      this.#log('warn', ...message)
    }

    /**
     * 打印错误日志
     * @param {*[]} message 错误日志信息
     */
    error(...message) {
      this.#log('error', ...message)
    }
  }(this)
}
