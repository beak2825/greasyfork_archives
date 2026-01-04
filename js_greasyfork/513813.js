// ==UserScript==
// @name         스테이크 10분 리로드 stake.jp 사용
// @description  Automatic reloads every 10 minutes. updated for latest Stake website. Will work forever!
// @author       elate
// @version      2023.14.23
// @match        https://stake.jp/*
// @match        https://stake.jp/casino/home?tab=reload&modal=vip&currency=*
// @match        https://stake.jp/?tab=reload&modal=vip&currency=*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/513813/%EC%8A%A4%ED%85%8C%EC%9D%B4%ED%81%AC%2010%EB%B6%84%20%EB%A6%AC%EB%A1%9C%EB%93%9C%20stakejp%20%EC%82%AC%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/513813/%EC%8A%A4%ED%85%8C%EC%9D%B4%ED%81%AC%2010%EB%B6%84%20%EB%A6%AC%EB%A1%9C%EB%93%9C%20stakejp%20%EC%82%AC%EC%9A%A9.meta.js
// ==/UserScript==

setInterval(function() {
  window.location.replace("https://stake.jp/?tab=reload&modal=vip&currency=btc")
}, 25000)

setInterval(function() {
document.querySelectorAll("button[type='submit']")[0].click()
}, 1500)

