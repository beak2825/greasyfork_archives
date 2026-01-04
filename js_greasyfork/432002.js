/**
 * UserscriptAPIWait
 *
 * 依赖于 `UserscriptAPI`。
 * @version 1.3.2.20230314
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/UserscriptAPI UserscriptAPI}
 */
class UserscriptAPIWait {
  /**
   * @param {UserscriptAPI} api `UserscriptAPI`
   */
  constructor(api) {
    this.api = api
  }

  /**
   * @typedef waitConditionOptions
   * @property {() => (* | Promise)} condition 条件，当 `condition()` 返回的 `result` 为真值时达成条件
   * @property {(result: *) => void} [callback] 当达成条件时执行 `callback(result)`
   * @property {number} [interval] 检测时间间隔
   * @property {number} [timeout] 检测超时时间，检测时间超过该值时终止检测；设置为 `0` 时永远不会超时
   * @property {(options: waitConditionOptions) => void} [onTimeout] 检测超时时执行 `onTimeout()`
   * @property {boolean} [stopOnTimeout] 检测超时时是否终止检测
   * @property {() => (* | Promise)} [stopCondition] 终止条件，当 `stopCondition()` 返回的 `stopResult` 为真值时终止检测
   * @property {(options: waitConditionOptions) => void} [onStop] 终止条件达成时执行 `onStop()`（包括终止条件的二次判断达成）
   * @property {number} [stopInterval] 终止条件二次判断期间的检测时间间隔
   * @property {number} [stopTimeout] 终止条件二次判断期间的检测超时时间，设置为 `0` 时禁用终止条件二次判断
   * @property {(options: waitConditionOptions, e: Error) => void} [onError] 条件检测过程中发生错误时执行 `onError(e)`
   * @property {boolean} [stopOnError] 条件检测过程中发生错误时，是否终止检测
   * @property {number} [timePadding] 等待 `timePadding`ms 后才开始执行；包含在 `timeout` 中，因此不能大于 `timeout`
   */
  /**
   * 在条件达成后执行操作
   *
   * 当条件达成后，如果不存在终止条件，那么直接执行 `callback(result)`。
   *
   * 当条件达成后，如果存在终止条件，且 `stopTimeout` 大于 0，则还会在接下来的 `stopTimeout` 时间内判断是否达成终止条件，称为终止条件的二次判断。如果在此期间，终止条件通过，则表示依然不达成条件，故执行 `onStop()` 而非 `callback(result)`。如果在此期间，终止条件一直失败，则顺利通过检测，执行 `callback(result)`。
   *
   * @param {waitConditionOptions} options 选项；缺失选项用 `api.options.wait.condition` 填充
   * @returns {() => boolean} 执行后终止检测的函数
   */
  executeAfterConditionPassed(options) {
    options = {
      ...this.api.options.wait.condition,
      ...options,
    }
    let stop = false
    let endTime = null
    endTime = (options.timeout === 0) ? 0 : Math.max(Date.now() + options.timeout - options.timePadding, 1)
    const task = async () => {
      if (stop) return
      let result = null
      try {
        result = await options.condition()
      } catch (e) {
        options.onError?.(options, e)
        if (options.stopOnError) {
          stop = true
        }
      }
      if (stop) return
      const stopResult = await options.stopCondition?.()
      if (stopResult) {
        stop = true
        options.onStop?.(options)
      } else if (endTime !== 0 && Date.now() > endTime) {
        if (options.stopOnTimeout) {
          stop = true
        } else {
          endTime = 0
        }
        options.onTimeout?.(options)
      } else if (result) {
        stop = true
        if (options.stopCondition && options.stopTimeout > 0) {
          this.executeAfterConditionPassed({
            condition: options.stopCondition,
            callback: () => options.onStop(options),
            interval: options.stopInterval,
            timeout: options.stopTimeout,
            onTimeout: () => options.callback(result),
          })
        } else {
          options.callback(result)
        }
      }
      if (!stop) {
        setTimeout(task, options.interval)
      }
    }
    setTimeout(async () => {
      if (stop) return
      await task()
      if (stop) return
      setTimeout(task, options.interval)
    }, options.timePadding)
    return () => { stop = true }
  }

  /**
   * @typedef waitElementOptions
   * @property {string} selector 该选择器指定要等待加载的元素 `element`
   * @property {HTMLElement} [base] 基元素
   * @property {HTMLElement[]} [exclude] 若 `element` 在其中则跳过，并继续检测
   * @property {(element: HTMLElement) => void} [callback] 当 `element` 加载成功时执行 `callback(element)`
   * @property {boolean} [subtree] 是否将检测范围扩展为基元素的整棵子树
   * @property {boolean} [multiple] 若一次检测到多个目标元素，是否在所有元素上执行回调函数（否则只处理第一个结果）
   * @property {boolean} [repeat] `element` 加载成功后是否继续检测
   * @property {number} [throttleWait] 检测节流时间（非准确）
   * @property {number} [timeout] 检测超时时间，检测时间超过该值时终止检测；设置为 `0` 时永远不会超时
   * @property {(options: waitElementOptions) => void} [onTimeout] 检测超时时执行 `onTimeout()`
   * @property {boolean} [stopOnTimeout] 检测超时时是否终止检测
   * @property {() => (* | Promise)} [stopCondition] 终止条件，当 `stopCondition()` 返回的 `stopResult` 为真值时终止检测
   * @property {(options: waitElementOptions) => void} [onStop] 终止条件达成时执行 `onStop()`
   * @property {(options: waitElementOptions, e: Error) => void} [onError] 检测过程中发生错误时执行 `onError(e)`
   * @property {boolean} [stopOnError] 检测过程中发生错误时，是否终止检测
   * @property {number} [timePadding] 等待 `timePadding`ms 后才开始执行；包含在 `timeout` 中，因此不能大于 `timeout`
   */
  /**
   * 在元素加载完成后执行操作
   *
   * 若执行时已存在对应元素，则针对已存在的对应元素同步执行 `callback(element)`。
   *
   * ```text
   * +──────────+────────+───────────────────────────────────+
   *   multiple | repeat | 说明
   * +──────────+────────+───────────────────────────────────+
   *   false    | false  | 查找第一个匹配元素，然后终止查找
   *   true     | false  | 查找所有匹配元素，然后终止查找
   *   false    | true   | 查找最后一个非标记匹配元素，并标记所有
   *            |        | 匹配元素，然后继续监听元素插入
   *   true     | true   | 查找所有非标记匹配元素，并标记所有匹配
   *            |        | 元素，然后继续监听元素插入
   * +──────────+────────+───────────────────────────────────+
   * ```
   *
   * @param {waitElementOptions} options 选项；缺失选项用 `api.options.wait.element` 填充
   * @returns {() => boolean} 执行后终止检测的函数
   */
  executeAfterElementLoaded(options) {
    const { api } = this
    options = {
      ...api.options.wait.element,
      ...options,
    }

    let loaded = false
    let stopped = false
    let tid = null // background timer id
    let insertUnrealElementListener = false

    let excluded = null
    if (options.exclude) {
      excluded = new WeakSet(options.exclude)
    } else if (options.repeat) {
      excluded = new WeakSet()
    }
    const valid = el => !(excluded?.has(el))

    const stop = () => {
      if (!stopped) {
        stopped = true
        ob.disconnect()
        if (insertUnrealElementListener) {
          document.removeEventListener('insert-unreal-element', core)
          insertUnrealElementListener = false
        }
        if (tid) {
          clearTimeout(tid)
          tid = null
        }
      }
    }

    const singleTask = el => {
      let success = false
      try {
        if (valid(el)) {
          success = true // success 指查找成功，回调出错不影响
          options.repeat && excluded.add(el)
          options.callback(el)
        }
      } catch (e) {
        if (options.stopOnError) {
          throw e
        } else {
          options.onError?.(options, e)
        }
      }
      return success
    }
    const task = root => {
      let success = false
      if (options.multiple) {
        for (const el of root.querySelectorAll(options.selector)) {
          success = singleTask(el) || success
        }
      } else if (options.repeat) {
        const elements = root.querySelectorAll(options.selector)
        for (let i = elements.length - 1; i >= 0; i--) {
          const el = elements[i]
          if (success) {
            if (valid(el)) {
              excluded.add(el)
            }
          } else {
            success = singleTask(el)
          }
        }
      } else {
        const el = root.querySelector(options.selector)
        success = el && singleTask(el)
      }
      loaded ||= success
      if (loaded && !options.repeat) {
        stop()
      }
      return success
    }
    const throttledTask = options.throttleWait > 0 ? api.base.throttle(task, options.throttleWait) : task

    const core = () => {
      if (stopped) return
      try {
        if (options.stopCondition?.()) {
          stop()
          options.onStop?.(options)
          return
        }
        throttledTask(options.base)
      } catch (e) {
        options.onError?.(options, e)
        if (options.stopOnError) {
          stop()
        }
      }
    }
    const ob = new MutationObserver(core)

    const main = () => {
      if (stopped) return
      try {
        if (options.stopCondition?.()) {
          stop()
          options.onStop?.(options)
          return
        }
        task(options.base)
      } catch (e) {
        options.onError?.(options, e)
        if (options.stopOnError) {
          stop()
        }
      }
      if (stopped) return
      ob.observe(options.base, {
        childList: true,
        subtree: options.subtree,
      })
      // 重复加入的元素可能存在于 DocumentFragment 中，需要特殊的检测手段
      if (options.repeat) {
        initInsertUnrealElementEventDispatcher()
        document.addEventListener('insert-unreal-element', core)
        insertUnrealElementListener = true
      }
      if (options.timeout > 0) {
        tid = setTimeout(() => {
          if (stopped) return
          tid = null
          if (!loaded) {
            if (options.stopOnTimeout) {
              stop()
            }
            options.onTimeout?.(options)
          } else { // 只要检测到，无论重复与否，都不算超时；需永久检测必须设 timeout 为 0
            stop()
          }
        }, Math.max(options.timeout - options.timePadding, 0))
      }
    }
    options.timePadding > 0 ? setTimeout(main, options.timePadding) : main()
    return stop

    /**
     * 初始化 insert-unreal-element 事件分发器
     *
     * 覆盖一系列插入节点的方法，以便在插入 DocumentFragment 向 doucment 分发 insert-unreal-element 事件。
     */
    function initInsertUnrealElementEventDispatcher() {
      const win = typeof unsafeWindow === 'object' ? unsafeWindow : window
      if (win[Symbol.for('insert-unreal-element-event-dispatcher')] === undefined) {
        const dispatch = (target, fns) => {
          for (const fn of fns) {
            const orig = target.prototype[fn]
            target.prototype[fn] = function(...args) {
              const result = Reflect.apply(orig, this, args)
              for (const arg of args) {
                if (arg instanceof DocumentFragment) {
                  document.dispatchEvent(new CustomEvent('insert-unreal-element'))
                  break
                }
              }
              return result
            }
          }
        }
        dispatch(Node, ['appendChild', 'insertBefore', 'replaceChild'])
        dispatch(Element, ['after', 'append', 'before', 'insertAdjacentElement', 'prepend', 'replaceWith'])
        win[Symbol.for('insert-unreal-element-event-dispatcher')] = true
      }
    }
  }

  /**
   * 等待条件达成
   *
   * 执行细节类似于 {@link executeAfterConditionPassed}。在原来执行 `callback(result)` 的地方执行 `resolve(result)`，被终止或超时执行 `reject()`。
   * @param {Object} options 选项；缺失选项用 `api.options.wait.condition` 填充
   * @param {() => (* | Promise)} options.condition 条件，当 `condition()` 返回的 `result` 为真值时达成条件
   * @param {number} [options.interval] 检测时间间隔
   * @param {number} [options.timeout] 检测超时时间，检测时间超过该值时终止检测；设置为 `0` 时永远不会超时
   * @param {boolean} [options.stopOnTimeout] 检测超时时是否终止检测
   * @param {() => (* | Promise)} [options.stopCondition] 终止条件，当 `stopCondition()` 返回的 `stopResult` 为真值时终止检测
   * @param {number} [options.stopInterval] 终止条件二次判断期间的检测时间间隔
   * @param {number} [options.stopTimeout] 终止条件二次判断期间的检测超时时间，设置为 `0` 时禁用终止条件二次判断
   * @param {boolean} [options.stopOnError] 条件检测过程中发生错误时，是否终止检测
   * @param {number} [options.timePadding] 等待 `timePadding`ms 后才开始执行；包含在 `timeout` 中，因此不能大于 `timeout`
   * @returns {Promise} `result`
   * @throws 等待超时、达成终止条件、等待错误时抛出
   * @see executeAfterConditionPassed
   */
  waitForConditionPassed(options) {
    const { api } = this
    return new Promise((resolve, reject) => {
      this.executeAfterConditionPassed({
        ...options,
        callback: result => resolve(result),
        onTimeout: options => {
          if (options.stopOnTimeout) {
            reject(new Error('waitForConditionPassed: TIMEOUT', { cause: options }))
          } else {
            api.logger.warn('waitForConditionPassed: TIMEOUT', options)
          }
        },
        onStop: options => {
          reject(new Error('waitForConditionPassed: STOP', { cause: options }))
        },
        onError: (options, e) => {
          reject(new Error('waitForConditionPassed: ERROR', { cause: [options, e] }))
        },
      })
    })
  }

  /**
   * 等待元素加载完成
   *
   * 执行细节类似于 {@link executeAfterElementLoaded}。在原来执行 `callback(element)` 的地方执行 `resolve(element)`，被终止或超时执行 `reject()`。
   * @param {Object} options 选项；缺失选项用 `api.options.wait.element` 填充
   * @param {string} options.selector 该选择器指定要等待加载的元素 `element`
   * @param {HTMLElement} [options.base] 基元素
   * @param {HTMLElement[]} [options.exclude] 若 `element` 在其中则跳过，并继续检测
   * @param {boolean} [options.subtree] 是否将检测范围扩展为基元素的整棵子树
   * @param {number} [options.throttleWait] 检测节流时间（非准确）
   * @param {number} [options.timeout] 检测超时时间，检测时间超过该值时终止检测；设置为 `0` 时永远不会超时
   * @param {() => (* | Promise)} [options.stopCondition] 终止条件，当 `stopCondition()` 返回的 `stopResult` 为真值时终止检测
   * @param {() => void} [options.onStop] 终止条件达成时执行 `onStop()`
   * @param {boolean} [options.stopOnTimeout] 检测超时时是否终止检测
   * @param {boolean} [options.stopOnError] 检测过程中发生错误时，是否终止检测
   * @param {number} [options.timePadding] 等待 `timePadding`ms 后才开始执行；包含在 `timeout` 中，因此不能大于 `timeout`
   * @returns {Promise<HTMLElement>} `element`
   * @throws 等待超时、达成终止条件、等待错误时抛出
   * @see executeAfterElementLoaded
   */
  waitForElementLoaded(options) {
    const { api } = this
    return new Promise((resolve, reject) => {
      this.executeAfterElementLoaded({
        ...options,
        callback: element => resolve(element),
        onTimeout: options => {
          if (options.stopOnTimeout) {
            reject(new Error('waitForElementLoaded: TIMEOUT', { cause: options }))
          } else {
            api.logger.warn('waitForElementLoaded: TIMEOUT', options)
          }
        },
        onStop: options => {
          reject(new Error('waitForElementLoaded: STOP', { cause: options }))
        },
        onError: (options, e) => {
          reject(new Error('waitForElementLoaded: ERROR', { cause: [options, e] }))
        },
      })
    })
  }

  /**
   * 元素加载选择器
   *
   * 执行细节类似于 {@link executeAfterElementLoaded}。在原来执行 `callback(element)` 的地方执行 `resolve(element)`，被终止或超时执行 `reject()`。
   * @param {string} selector 该选择器指定要等待加载的元素 `element`
   * @param {HTMLElement} [base=api.options.wait.element.base] 基元素
   * @param {boolean} [stopOnTimeout=api.options.wait.element.stopOnTimeout] 检测超时时是否终止检测
   * @returns {Promise<HTMLElement>} `element`
   * @throws 等待超时、达成终止条件、等待错误时抛出
   * @see executeAfterElementLoaded
   */
  $(selector, base = this.api.options.wait.element.base, stopOnTimeout = this.api.options.wait.element.stopOnTimeout) {
    const { api } = this
    return new Promise((resolve, reject) => {
      this.executeAfterElementLoaded({
        selector, base, stopOnTimeout,
        callback: element => resolve(element),
        onTimeout: options => {
          if (options.stopOnTimeout) {
            reject(new Error('waitQuerySelector: TIMEOUT', { cause: options }))
          } else {
            api.logger.warn('waitQuerySelector: TIMEOUT', options)
          }
        },
        onStop: options => {
          reject(new Error('waitQuerySelector: STOP', { cause: options }))
        },
        onError: (options, e) => {
          reject(new Error('waitQuerySelector: ERROR', { cause: [options, e] }))
        },
      })
    })
  }
}

/* global UserscriptAPI */
// eslint-disable-next-line no-lone-blocks
{ UserscriptAPI.registerModule('wait', UserscriptAPIWait) }
