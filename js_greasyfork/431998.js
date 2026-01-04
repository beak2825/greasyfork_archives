/**
 * UserscriptAPIDom
 *
 * 依赖于 `UserscriptAPI`。
 * @version 1.2.4.20230314
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/UserscriptAPI UserscriptAPI}
 */
class UserscriptAPIDom {
  /**
   * @param {UserscriptAPI} api `UserscriptAPI`
   */
  constructor(api) {
    this.api = api
  }

  /**
   * 查找符合条件的祖先元素
   * @param {HTMLElement} target 目标元素
   * @param {(el: HTMLElement) => boolean} condition 条件
   * @param {boolean} [positioned] 以 `offsetParent` 而非 `parentElement` 上溯
   * @returns {HTMLElement} 符合条件的祖先元素
   */
  findAncestor(target, condition, positioned) {
    const p = positioned ? 'offsetParent' : 'parentElement'
    let element = target[p]
    while (element && !condition(element)) {
      element = element[p]
    }
    return element
  }

  /**
   * 设定元素位置，默认设定为绝对居中
   *
   * 要求该元素此时可见且尺寸为确定值（一般要求为块状元素）。
   * @param {HTMLElement} target 目标元素
   * @param {Object} [options] 选项
   * @param {string} [options.position='fixed'] 定位方式
   * @param {string} [options.top='50%'] `style.top`
   * @param {string} [options.left='50%'] `style.left`
   */
  setPosition(target, options) {
    options = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      ...options,
    }
    target.style.position = options.position
    const style = window.getComputedStyle(target)
    const top = (Number.parseFloat(style.height) + Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)) / 2
    const left = (Number.parseFloat(style.width) + Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)) / 2
    target.style.top = `calc(${options.top} - ${top}px)`
    target.style.left = `calc(${options.left} - ${left}px)`
  }

  /**
   * @typedef FadeTargetElement
   * @property {string} [fadeInDisplay] 渐显开始后的 `display` 样式。若没有设定：
   *  * 若当前 `display` 与 `fadeOutDisplay` 不同，默认值为当前 `display`。
   *  * 若当前 `display` 与 `fadeOutDisplay` 相同，默认值为 `block`。
   * @property {string} [fadeOutDisplay='none'] 渐隐开始后的 `display` 样式
   * @property {number} [fadeInTime] 渐显时间；缺省时，元素的 `transition-duration` 必须与 `api.options.fadeTime` 一致
   * @property {number} [fadeOutTime] 渐隐时间；缺省时，元素的 `transition-duration` 必须与 `api.options.fadeTime` 一致
   * @property {string} [fadeInFunction='ease-in-out'] 渐显效果，应为符合 `transition-timing-function` 的有效值
   * @property {string} [fadeOutFunction='ease-in-out'] 渐隐效果，应为符合 `transition-timing-function` 的有效值
   * @property {boolean} [fadeInNoInteractive] 渐显期间是否禁止交互
   * @property {boolean} [fadeOutNoInteractive] 渐隐期间是否禁止交互
   */
  /**
   * 处理 HTML 元素的渐显和渐隐
   * @param {boolean} inOut 渐显/渐隐
   * @param {HTMLElement & FadeTargetElement} target HTML 元素
   * @param {() => void} [callback] 渐显/渐隐完成的回调函数
   */
  fade(inOut, target, callback) {
    const { api } = this
    let transitionChanged = false
    const fadeId = Date.now() // 等同于当前时间戳，其意义在于保证对于同一元素，后执行的操作必将覆盖前的操作
    const fadeOutDisplay = target.fadeOutDisplay ?? 'none'
    target._fadeId = fadeId
    if (inOut) { // 渐显
      let displayChanged = false
      if (typeof target.fadeInTime === 'number' || target.fadeInFunction) {
        target.style.transition = `opacity ${target.fadeInTime ?? api.options.fadeTime}ms ${target.fadeInFunction ?? 'ease-in-out'}`
        transitionChanged = true
      }
      if (target.fadeInNoInteractive) {
        target.style.pointerEvents = 'none'
      }
      const originalDisplay = window.getComputedStyle(target).display
      let { fadeInDisplay } = target
      if (!fadeInDisplay) {
        fadeInDisplay = (originalDisplay !== fadeOutDisplay) ? originalDisplay : 'block'
      }
      if (originalDisplay !== fadeInDisplay) {
        target.style.display = fadeInDisplay
        displayChanged = true
      }
      setTimeout(() => {
        let success = false
        if (target._fadeId <= fadeId) {
          target.style.opacity = '1'
          success = true
        }
        setTimeout(() => {
          callback?.(success)
          if (target._fadeId <= fadeId) {
            if (transitionChanged) {
              target.style.transition = ''
            }
            if (target.fadeInNoInteractive) {
              target.style.pointerEvents = ''
            }
          }
        }, target.fadeInTime ?? api.options.fadeTime)
      }, displayChanged ? 10 : 0) // 此处的 10ms 是为了保证修改 display 后在浏览器上真正生效；按 HTML5 定义，浏览器需保证 display 在修改后 4ms 内生效，但实际上大部分浏览器貌似做不到，等个 10ms 再修改 opacity
    } else { // 渐隐
      if (typeof target.fadeOutTime === 'number' || target.fadeOutFunction) {
        target.style.transition = `opacity ${target.fadeOutTime ?? api.options.fadeTime}ms ${target.fadeOutFunction ?? 'ease-in-out'}`
        transitionChanged = true
      }
      if (target.fadeOutNoInteractive) {
        target.style.pointerEvents = 'none'
      }
      target.style.opacity = '0'
      setTimeout(() => {
        let success = false
        if (target._fadeId <= fadeId) {
          target.style.display = fadeOutDisplay
          success = true
        }
        callback?.(success)
        if (success) {
          if (transitionChanged) {
            target.style.transition = ''
          }
          if (target.fadeOutNoInteractive) {
            target.style.pointerEvents = ''
          }
        }
      }, target.fadeOutTime ?? api.options.fadeTime)
    }
  }
}

/* global UserscriptAPI */
// eslint-disable-next-line no-lone-blocks
{ UserscriptAPI.registerModule('dom', UserscriptAPIDom) }
