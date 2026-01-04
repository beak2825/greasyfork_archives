// ==UserScript==
// @license MIT
// @name        解决甘特图中里程碑重叠的问题 - myhexin.com
// @namespace   Violentmonkey Scripts
// @match       http://cf.myhexin.com/pages/viewpage.action
// @grant       none
// @version     1.0
// @author      -
// @description 2023/10/20 11:22:16
// @downloadURL https://update.greasyfork.org/scripts/478210/%E8%A7%A3%E5%86%B3%E7%94%98%E7%89%B9%E5%9B%BE%E4%B8%AD%E9%87%8C%E7%A8%8B%E7%A2%91%E9%87%8D%E5%8F%A0%E7%9A%84%E9%97%AE%E9%A2%98%20-%20myhexincom.user.js
// @updateURL https://update.greasyfork.org/scripts/478210/%E8%A7%A3%E5%86%B3%E7%94%98%E7%89%B9%E5%9B%BE%E4%B8%AD%E9%87%8C%E7%A8%8B%E7%A2%91%E9%87%8D%E5%8F%A0%E7%9A%84%E9%97%AE%E9%A2%98%20-%20myhexincom.meta.js
// ==/UserScript==
window.onload = () => {
  document.querySelectorAll('.heading-expand-body').forEach((container) => {
  [...container.querySelectorAll('.roadmap-macro-view >svg >g >g:nth-child(3) text')]
   .sort((a, b) => a.getAttribute('x') - b.getAttribute('x')).forEach((it, idx) => it.style = `transform:translateY(${(idx%3-1) * 20}px)`)
  })
}
