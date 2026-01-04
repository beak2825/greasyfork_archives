// ==UserScript==
// @name            NCU Auto Login - 南昌大学校园网、深澜软件校园网自动登录
// @description     南昌大学校园网自动登录，支持教工、校园网、移动、电信、联通
// @namespace       ncu-auto-login
// @match           *://*/srun_portal_*
// @grant           none
// @version         1.2.2
// @author          Viki <i@viki.moe> (https://github.com/vikiboss)
// @create          2023/10/07 16:00:00
// @lastmodified    2023/10/07
// @feedback-url    https://github.com/vikiboss/ncu-auto-login-script/issues
// @github          https://github.com/vikiboss/ncu-auto-login-script
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/453670/NCU%20Auto%20Login%20-%20%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E3%80%81%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453670/NCU%20Auto%20Login%20-%20%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E3%80%81%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

const config = {
  type: '', // 账号类型：为空是教职工，@ncu 是校园网，@cmcc 是移动，@ndcard 是电信，@unicom 是联通
  username: '', // 账号
  password: '', // 密码，如果不想使用明文，可以使用 base64 密码，base64 密码可以在控制台执行 window.btoa("密码") 得到
  isBase64: false, // 如果是 base64 密码请将 isBase64 字段改为 true
}

const KEY = 'srun_config'

;(() => {
  window.addEventListener('load', () => {
    if (!config.username || !config.password) {
      try {
        const _config = JSON.parse(localStorage.getItem(KEY) || '{}')
        Object.assign(config, _config)
      } catch (e) {
        console.log('自动登录失败，错误信息：', e)
      }
    } else {
      localStorage.setItem(KEY, JSON.stringify(config))
    }

    const userInput = document.querySelector('#username')
    const passInput = document.querySelector('#password')
    const domainSelect = document.querySelector('#domain')
    const loginButton = document.querySelector('#login')

    const list = [userInput, passInput, domainSelect, loginButton, config.username, config.password]

    if (list.some(e => !e)) return

    const pwd = config.isBase64 ? window.atob(config.password) : config.password

    userInput.value = config.username
    passInput.value = pwd
    domainSelect.value = config.type

    loginButton.click()
  })
})()
