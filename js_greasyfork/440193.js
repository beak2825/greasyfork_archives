// ==UserScript==
// @name        高亮显示豆瓣追踪ID
// @namespace   Violentmonkey Scripts
// @match       https://www.douban.com/group/topic/*
// @grant       none
// @version     1.0.2
// @author      -
// @description 本脚本将豆瓣网页上隐蔽的追踪ID高亮显示，并予以移除。
// @grant       GM_addStyle
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/440193/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%BF%BD%E8%B8%AAID.user.js
// @updateURL https://update.greasyfork.org/scripts/440193/%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%BF%BD%E8%B8%AAID.meta.js
// ==/UserScript==

GM_addStyle(`
.track {
  color: red !important;
  font-size: 10px !important;
  font-weight: bold !important;
  overflow: visible !important;
}
`)

function removeTracker() {
  const trackers = document.querySelectorAll('.track')
  if (!trackers.length) {
    alert('未找到本页上的豆瓣追踪 ID，有可能是更换了显示方式。请谨慎截图！')
  }
  trackers.forEach((tracker) => {
    tracker.innerText = '已移除此处的豆瓣追踪ID'
    tracker.title = '点击隐藏本提示'
    tracker.addEventListener('click', (ev) => {
      tracker.style.display = 'none'
    })
  })
}

setTimeout(removeTracker, 1000)
