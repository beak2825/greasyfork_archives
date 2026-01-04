// ==UserScript==
// @name         阿里云邮箱自动登陆sample
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  阿里云邮箱自动登陆简易版
// @author       CListery
// @match        *://qiye.aliyun.com/login/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531737/%E9%98%BF%E9%87%8C%E4%BA%91%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86sample.user.js
// @updateURL https://update.greasyfork.org/scripts/531737/%E9%98%BF%E9%87%8C%E4%BA%91%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86sample.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const KEY_P = 'sample-ali-mail-p'

  GM_registerMenuCommand('配置KEY', function () {
    let userInput = prompt('请输入：', GM_getValue(KEY_P, ''))
    if (userInput !== null) {
      GM_setValue(KEY_P, userInput)
    }
  })

  let p = GM_getValue(KEY_P, null)
  if (!p) {
    return
  }

  window.search_checkbox_task = setInterval(() => {
    console.log('search Privacy Policy checkbox...')

    document
      .querySelectorAll('#rc-tabs-0-panel-ACCOUNT_PASSWORD form label > span')
      .forEach((labelEl) => {
        if (labelEl.textContent == '已阅读并同意：隐私政策、产品服务协议') {
          clearInterval(window.search_checkbox_task)
          console.log('change checkbox')
          // function setNativeChecked(checkbox, value) {
          //   const lastValue = checkbox.checked
          //   checkbox.checked = value

          //   const clickEvent = new Event('click', { isTrusted: true, bubbles: true })

          //   // 兼容 React 的内部事件系统
          //   const tracker = checkbox._valueTracker
          //   if (tracker) {
          //     tracker.setValue(lastValue)
          //   }

          //   checkbox.dispatchEvent(clickEvent)
          // }

          // let checkboxEl = labelEl.parentElement.querySelector('input')
          // setNativeChecked(checkboxEl, true)
          labelEl.click()

          window.search_login_task = setInterval(() => {
            console.log('search Login Button...')
            document.querySelectorAll('button span').forEach((loginButton) => {
              if (loginButton.textContent == '登 录') {
                clearInterval(window.search_login_task)
                console.log('hold Login Button')
                setInterval(() => {
                  document
                    .querySelectorAll('#rc-tabs-0-panel-ACCOUNT_PASSWORD input')
                    .forEach((pwdInputEl) => {
                      if (pwdInputEl.placeholder == '输入密码') {
                        console.log('login...')

                        function setReactInput(input, value) {
                          if (!input) return
                          const lastValue = input.value
                          input.value = value
                          const event = new Event('input', { bubbles: true })
                          // React 18+ 内部有 value tracker 机制，需要同步
                          const tracker = input._valueTracker
                          if (tracker) tracker.setValue(lastValue)
                          input.dispatchEvent(event)
                        }
                        setReactInput(pwdInputEl, p)

                        loginButton.parentElement.click()
                      }
                    })
                }, 100)
              }
            })
          }, 100)
        }
      })
  }, 100)
})()
