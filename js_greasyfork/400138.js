// ==UserScript==
// @name         一加社区自动抽奖
// @namespace    https://1silencer.github.io/
// @version      0.3.4
// @description  页面地址有更换或者网页样式更换请及时反馈
// @author       Silencer
// @match        *://*.oneplusbbs.com/plugin-choujiang.html
// @icon         https://www.oneplusbbs.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400138/%E4%B8%80%E5%8A%A0%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/400138/%E4%B8%80%E5%8A%A0%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==



// 这个是个人需要哈,抽完奖的跳转,默认是不跳转,我是跑去逛社区,自己设定就好了
const config = {
  // 时间单位是秒
  time: 6,

  jump: false,
  url: 'https://www.oneplusbbs.com/forum-117-1-filter-author-orderby-dateline.html'
}



setInterval((function main() {

  if (document.querySelector('.ma_about_me').innerText.includes('登录')) {
    document.querySelector('.ma_about_me a').click()
  }
  if (document.querySelector('#my_ret_cjtimes').innerText != '0') {
    document.querySelector('.lot-btn').click()
  } else if (config.jump || localStorage.jump === '1') {
    location.href = config.url
  }

  return main
})(), config.time * 1000)
