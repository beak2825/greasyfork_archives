// ==UserScript==
// @name         LH-显示龙湖账号
// @namespace    https://greasyfork.org/zh-CN/scripts/441343
// @version      0.2
// @description  显示当前登录人的OA账号
// @author       zhaosai
// @match        *://*.longfor.com/*
// @match        *://*.longfor.uat/*
// @match        *://*.longhu.net/*
// @icon         https://www.longfor.com/favicon.ico
// @grant        none
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/441343/LH-%E6%98%BE%E7%A4%BA%E9%BE%99%E6%B9%96%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441343/LH-%E6%98%BE%E7%A4%BA%E9%BE%99%E6%B9%96%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

/**
 * Copyright 2012 LearnZS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const getCookie = (key) => {
  return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')
}

;(function () {
  'use strict'
  const curUser = localStorage.getItem('TY_USER_ID') || localStorage.getItem('LOGR_USER_ID')
  const token = getCookie('CASTGC') || getCookie('account')

  console.log(`当前登录账号：${curUser}, TOKEN: ${token}`)
  const floatEl = document.createElement('div')
  floatEl.style.cssText = `
        position: fixed;
        z-index: 999999999;
        top: 0;
        left: 0;
        padding: 5px;
        background: rgba(0, 0, 0, 0.3);
        color: rgba(255,255,0,1);
        font-size: 16px;
        letter-spacing: 1px;
        /* pointer-events: none; */
      `
  floatEl.className = 'lhPlugin'
  floatEl.innerText = `oaAccount：${curUser} `

  const tokenEl = document.createElement('button')
  tokenEl.innerText = 'token'
  tokenEl.onclick = () => {
    const succText = '复制成功，CASTGC值：' + token
    const errText = '复制失败，手动复制吧，CASTGC值：' + token

    navigator.clipboard.writeText(token).then(() => alert(succText)).catch((err) => alert(errText))
  }

  floatEl.appendChild(tokenEl)
  top.document.body.appendChild(floatEl)
})()
