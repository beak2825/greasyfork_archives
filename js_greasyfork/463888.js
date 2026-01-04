// ==UserScript==
// @name         禅道密码自动填充登录
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  禅道--懒人专用的密码填充插件
// @author       zeMing
// @match        *://*.project.chinachdu.com/*
// @match        *://*.project.chinachdu.com/user-login*
// @icon         https://zentao.net/favicon.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/463888/%E7%A6%85%E9%81%93%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/463888/%E7%A6%85%E9%81%93%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

/**
 *                  前言
 * 感谢使用，本脚本针对的是禅道的免登录密码自动填充。你作为使用者，应该具备一定的IT知识。
 * 代码的第7行、第8行代表的是脚本的运行网址。作者使用的为project.chinachdu.com所有的页面
 *
 * 你需要做的是：
 * 将代码的第7行、第8行进行修改，否则无法正常使用该脚本。(重要)！
 * 至于怎么修改，可百度@match规则。(重要)！
 *
 */

/*
  jQuery CDN
  //@require https://cdn.staticfile.org/jquery/3.6.4/jquery.min.js
*/

/*
  2023-11-08 1.[优化]: 代码重构、优化

  2023-11-03 1.[优化]: 逻辑优化

  2023-04-19 1.[新增]: 默认选中-保持登陆

  2023-04-14 1.[修复]: 只在登陆页面加载脚本

  2023-04-13 1.[新增]: 密码填充简易版
*/

(function() {
  'use strict';
  /* globals jQuery, $, waitForKeyElements */

  // 解构简易化，勿动
  const { log } = console
  let userInfo = {
    name: '',
    pass: '',
  }
  log('已加载自动填充密码脚本！')
  const userNameDom = document.querySelector('input[type="text"][name="account"]')
  const userPassDom = document.querySelector('input[type="password"][name="password"]')
  const keepLoginDom = document.querySelector('input[type="checkbox"][name="keepLogin[]"]') || document.getElementById("keepLoginon")
  const submitDom = document.getElementById("submit")

  submitDom && submitDom.addEventListener('click', function() {
    userInfo = {
      name: userNameDom.value,
      pass: userPassDom.value,
    }
    GM_setValue('userInfoKey', userInfo)
  })

  if (userNameDom || userPassDom) {
    const jsonUser = GM_getValue('userInfoKey')
    const keys = GM_listValues()
    if (!jsonUser) return
    let { name: storageName, pass: storagePass } = jsonUser || {}
    let { name, pass} = userInfo
    userNameDom.value = name || storageName
    userPassDom.value = pass || storagePass
    keepLoginDom.checked = keepLoginDom.checked || true
    if (name || pass) return
    submitDom.click()
  }
})()
