// ==UserScript==
// @name        安大校园网自动登录 - 172.16.253.3
// @namespace   Violentmonkey Scripts
// @match       http://172.16.253.3/*
// @grant       none
// @version     1.0
// @author      lownz
// @license MIT
// @description 2022/9/20 21:39:03
// @downloadURL https://update.greasyfork.org/scripts/451888/%E5%AE%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20-%20172162533.user.js
// @updateURL https://update.greasyfork.org/scripts/451888/%E5%AE%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20-%20172162533.meta.js
// ==/UserScript==
function delayedAlert() {
  timeoutID = window.setTimeout(login, 2000);
}
function login() {
account = document.querySelector('input[type="text"]')
console.log(account)
pwd = document.querySelector('input[type="password"]')
submit = document.querySelector('input[type="submit"]')
account.value = '输入你的账号'
pwd.value = '输入你的密码'
submit.click()
}
delayedAlert()