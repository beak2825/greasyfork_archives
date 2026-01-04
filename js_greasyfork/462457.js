// ==UserScript==
// @name         LH-开启一键审批
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  一键通过所有审批节点
// @author       zhaosai
// @match        https://bpm3uat.longfor.com:9553/
// @icon         https://www.longfor.com/favicon.ico
// @grant        none
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/462457/LH-%E5%BC%80%E5%90%AF%E4%B8%80%E9%94%AE%E5%AE%A1%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462457/LH-%E5%BC%80%E5%90%AF%E4%B8%80%E9%94%AE%E5%AE%A1%E6%89%B9.meta.js
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


;(function () {
  'use strict'

  const showBtn = () => {
    const {
      location: { hash }
    } = window

    if (hash.includes('&access=1')) {
      return
    }

    const openAuditBtn = document.createElement('button')
    openAuditBtn.innerText = '开启一键审批'
    openAuditBtn.style.cssText = `
      position: fixed;
      z-index: 999999;
      bottom: 55px;
      left: 2px;
      padding: 8px 16px;
      background: darkblue;
      border: 1px solid deepskyblue;
      border-radius: 4px;
      color: rgb(255, 255, 255);
      font-size: 16px;
      cursor: pointer;
    `

    openAuditBtn.onclick = () => {
      const {
        location: { href }
      } = window
      const auditParam = '&access=1'

      location.href = href + auditParam
      setTimeout(() => {
        location.reload()
      })
    }

    document.body.appendChild(openAuditBtn)
  }
  showBtn()
})()
