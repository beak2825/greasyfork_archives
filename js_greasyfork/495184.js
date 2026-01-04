// ==UserScript==
// @name        keepitanonymous
// @name:zh-CN  保持匿名
// @description 隐藏页面上的账号信息，如：用户名，手机，邮箱
// @namespace   maoxuner.gitee.io
// @author      maoxuner
// @version     0.3.0
// @license     GPLv3
// @match       *://*/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @homepageURL https://gitee.com/maoxuner
// @downloadURL https://update.greasyfork.org/scripts/495184/keepitanonymous.user.js
// @updateURL https://update.greasyfork.org/scripts/495184/keepitanonymous.meta.js
// ==/UserScript==

(function (window) {
  'use strict';

  /* no89757        切换输入框文字显隐        aptx4869 */

  const className = 'password-dots-regular'
  const styleElement = GM_addStyle(`
    @font-face {
      font-family: "Password Dots Regular";
      src: url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.eot");
      src: url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.eot?#iefix")format("embedded-opentype"),
      url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.woff2")format("woff2"),
      url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.woff")format("woff"),
      url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.ttf")format("truetype"),
      url("https://db.onlinewebfonts.com/t/2767b18dd6a611e3ce83d0bfe4729cb4.svg#Password Dots Regular")format("svg");
    }
    input.password-dots-regular {
      font-family: "Password Dots Regular";
    }
    input.password-dots-regular::placeholder {
      font-family: none;
    }
  `)
  window.document.querySelector('head').appendChild(styleElement)

  // 切换输入框文字显隐
  const STATE_SHOW = 1
  const STATE_HIDE = 0
  function switchInputText(element, state = null) {
    if (element.classList.contains(className)) {
      if (STATE_HIDE !== state) {  // 非强制隐藏，则显示
        // 显示输入框文字
        if (1 === element.classList.length) {
          element.removeAttribute('class')
        } else {
          element.classList.remove(className)
        }

        return true
      }
    } else {
      if (STATE_SHOW !== state) {  // 非强制显示，则隐藏
        // 隐藏输入框文字
        element.classList.add(className)

        return true
      }
    }

    return false
  }

  /* laravel        自动隐藏输入框文字        hohai */

  // 判断是否是隐私信息输入框
  function isPrivacyInput(element) {
    const identifier = ['username', 'user', 'name', 'email', 'mail', 'phone', 'telephone', 'tel', 'mobilephone', 'mobile', 'login', 'account']

    return 'text' === element.type && (element.name && identifier.includes(element.name) || 'username' === element.autocomplete) || 'email' === element.type || 'tel' === element.type
  }

  // 显示所有
  function showAllInputText() {
    let ret = 0
    window.document.querySelectorAll('input.' + className)
      .forEach(element => switchInputText(element, STATE_SHOW) && ret++)
    return ret
  }

  // 隐藏所有
  function hideAllInputText() {
    let ret = 0
    window.document.querySelectorAll('input')
      .forEach(element => isPrivacyInput(element) && switchInputText(element, STATE_HIDE) && ret++)
    return ret
  }

  // 注册菜单
  const TITLE_MESSAGE = '无法作用于嵌套页面'
  GM_registerMenuCommand('显示所有', showAllInputText, { title: TITLE_MESSAGE })
  GM_registerMenuCommand('隐藏所有', hideAllInputText, { title: TITLE_MESSAGE })

  // 切换自动隐藏
  const MODE_KEY = 'mode'
  const MODE_OFF = 0
  const MODE_ON1 = 1
  const MODE_ON2 = 2
  function switchAutoHideInputText() {
    const mode = (GM_getValue(MODE_KEY, MODE_OFF) + 1) % 3

    GM_setValue(MODE_KEY, mode)
    registerAutoHideMenu(mode)
  }

  // 注册自动隐藏菜单
  function registerAutoHideMenu(mode) {
    const id = 'DDRaceNetwork'
    switch (mode) {
      case MODE_OFF:
        GM_registerMenuCommand('切换自动隐藏模式（当前：关闭）', switchAutoHideInputText, { id, title: '当前不会自动隐藏', autoClose: false })
        break
      case MODE_ON1:
        GM_registerMenuCommand('切换自动隐藏模式（当前：普通）', switchAutoHideInputText, { id, title: '页面加载完成后立即隐藏', autoClose: false })
        break
      case MODE_ON2:
        GM_registerMenuCommand('切换自动隐藏模式（当前：增强）', switchAutoHideInputText, { id, title: '页面加载完成后持续隐藏（适用于嵌套页面）', autoClose: false })
        break
    }
  }

  // 初始化
  const mode = GM_getValue(MODE_KEY, MODE_OFF)
  registerAutoHideMenu(mode)
  switch (mode) {
    case MODE_ON1:
      hideAllInputText()
      break
    case MODE_ON2:
      let times = 0
      const id = setInterval(() => {
        times++
        (hideAllInputText() || times >= 50) && clearInterval(id)
      }, 100)
      break
  }
})(window)
