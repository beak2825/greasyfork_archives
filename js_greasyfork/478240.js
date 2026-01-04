// ==UserScript==
// @name         极客时间训练营自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  需要检测你的 url 是否包含roomid，userid，dn（用户名），dp（密码）
// @author       polarisdu
// @match        https://view.csslcloud.net/api/view/index?roomid=*&userid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csslcloud.net
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478240/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%AE%AD%E7%BB%83%E8%90%A5%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478240/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%AE%AD%E7%BB%83%E8%90%A5%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const url = new URL(window.location.href)
  const sp = url.searchParams
  const dn = sp.get('dn')
  const dp = sp.get('dp')
  if (!dn || !dp) {
    alert('缺少 dn 或 dp 参数')
    return
  }

  const autologin = () => {
    const login = document.querySelector('.login-btn')
    if (login) {
      login.click()
      const observer = new MutationObserver(function (mutationsList, observer) {
        const name = document.querySelector('.el-input__inner[type=text]')
        const pw = document.querySelector('.el-input__inner[type=password]')
        if (name && pw) {
          name.value = decodeURI(dn)
          pw.value = decodeURI(dp)
          const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
          })
          name.dispatchEvent(inputEvent)
          pw.dispatchEvent(inputEvent)
          document.querySelector('.join-room-btn').click()
        } else {
          console.error('name & password write fail')
        }
        observer.disconnect()
      })
      const config = { childList: true, subtree: true }
      observer.observe(document.documentElement, config)
    } else {
      setTimeout(autologin(), 1000)
    }
  }
  window.addEventListener(
    'load',
    function () {
      autologin()
    },
    false
  )
})()
