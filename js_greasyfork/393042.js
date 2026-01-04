// ==UserScript==
// @name        我看到哪里啦？！
// @namespace   回到上次阅读位置
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 让页面重新滚到上次阅读的位置。
// @downloadURL https://update.greasyfork.org/scripts/393042/%E6%88%91%E7%9C%8B%E5%88%B0%E5%93%AA%E9%87%8C%E5%95%A6%EF%BC%9F%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/393042/%E6%88%91%E7%9C%8B%E5%88%B0%E5%93%AA%E9%87%8C%E5%95%A6%EF%BC%9F%EF%BC%81.meta.js
// ==/UserScript==

const scrollToBottomAndThenReTry = (d, oldPos, times=0)=>{
  if(d.scrollHeight >= oldPos){
    d.scrollTop = oldPos
    return
  }
  if(++times > 20) return
  d.scrollTop = d.scrollHeight
  window.setTimeout(()=>{
    scrollToBottomAndThenReTry(d, oldPos, times)
  }, 3000)
}

window.addEventListener('load', ()=>{
  const keyName = 'lastPosWhichISee-'+window.location.href
  const oldPos = localStorage.getItem(keyName)
  if(!oldPos) return
  const d = document.documentElement
  scrollToBottomAndThenReTry(d, oldPos)
})
window.addEventListener('scroll', ()=>{
  const keyName = 'lastPosWhichISee-'+window.location.href
  const nowPos = document.documentElement.scrollTop
  if(nowPos){
    localStorage.setItem(keyName, nowPos)
  }
})
