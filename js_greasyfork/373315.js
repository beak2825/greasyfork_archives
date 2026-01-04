// ==UserScript==
// @name         DGUT 校园网自动登录
// @namespace    https://gplane.win/
// @version      0.2.0
// @description  自动登录 DGUT 的校园网。
// @author       Pig Fang <g-plane@hotmail.com>
// @license      MIT
// @copyright    2018-present, Pig Fang
// @create       2018-10-16
// @lastmodified 2018-11-30
// @supportURL   https://github.com/g-plane/dgut-network-login
// @match        *://172.31.252.91/eportal/index.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373315/DGUT%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373315/DGUT%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const STORAGE_KEY_USERNAME = 'autologinu'
  const STORAGE_KEY_PASSWORD = 'autologinp'

  /** @type {HTMLInputElement} */
  const elUsername = document.querySelector('#username')
  /** @type {HTMLInputElement} */
  const elPassword = document.querySelector('#pwd')
  /** @type {HTMLAnchorElement} */
  const elSubmit = document.querySelector('#loginLink')

  const username = localStorage.getItem(STORAGE_KEY_USERNAME)
  const password = localStorage.getItem(STORAGE_KEY_PASSWORD)

  if (!username || !password) {
    elSubmit.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY_USERNAME, elUsername.value)
      localStorage.setItem(STORAGE_KEY_PASSWORD, btoa(elPassword.value))
    })

    return
  }

  elUsername.value = username
  elPassword.value = atob(password)
  elSubmit.click()
})()
