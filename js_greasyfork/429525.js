/**
 * ExplicitMessage_Inject
 * @file [DEBUG] 信息显式化（注入版）
 * @version 1.6.0.20230121
 * @author Laster2800
 */

(function() {
  'use strict'

  const win = typeof unsafeWindow === 'object' ? unsafeWindow : window
  const m = win[Symbol.for('ExplicitMessage')]
  if (!m?.fn?.wrappedLog) return
  if (typeof unsafeWindow !== 'object') {
    m.fn.explicit('注入版不支持 @grant none 脚本。此类脚本的日志使用主版本即可捕获。')
    return
  }
  let updateAlerted = false
  const injectVersion = 20230121
  const cs = console
  const fn = {}
  for (const k of ['log', 'debug', 'info', 'warn', 'error']) {
    const log = cs[k]
    fn[k] = (...args) => { // 首次执行进行初始化
      if (injectVersion !== m.injectUpdate) {
        if (!updateAlerted) {
          updateAlerted = true
          m.fn.updateCheck?.(GM_info.script.name, injectVersion > m.injectUpdate)
        }
        fn[k] = log
      } else {
        // 替换初始化方法，以后执行直接调用封装日志方法
        fn[k] = m.fn.wrappedLog(cs, log, k.toUpperCase(), GM_info.script.name)
      }
      Reflect.apply(fn[k], cs, args)
    }
  }

  // 日志方法可能会被包括脚本管理器在内的第三方定义为 configurable: false 属性，
  // 因而只能采取最稳定可靠的 Proxy 方案。
  // 此处 console（至少）是脚本管理器提供的代理控制台对象，并非全局 console。
  // eslint-disable-next-line no-global-assign
  console = new Proxy(cs, { get: (o, p) => (p in fn ? fn[p] : o[p]) })
})()
