// ==UserScript==
// @name        AutoScroll1234
// @namespace   
// @description AutoScroll-自动滚屏
// @include     http*
// @version     v1.6
// @author      nosura
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428338/AutoScroll1234.user.js
// @updateURL https://update.greasyfork.org/scripts/428338/AutoScroll1234.meta.js
// ==/UserScript==

// 滚动条在Y轴上的滚动距离
function getScrollTop() {
  let scrollTop = 0
  let bodyScrollTop = 0
  let documentScrollTop = 0
  if (document.body) {
    bodyScrollTop = document.body.scrollTop
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
  return scrollTop
}
// 文档的总高度
function getScrollHeight() {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0
      ? bodyScrollHeight
      : documentScrollHeight
  return scrollHeight
}
// 浏览器视口的高度
function getWindowHeight() {
  return document.body.clientHeight
}

let timer
let startAt = Date.now()

window.onscroll = () => {
  if (getScrollTop() + getWindowHeight() >= getScrollHeight()) {
    if (Date.now() - startAt < 8000) {
      setTimeout(() => {
        window.location.reload()
      }, Date.now() - startAt )
    } else {
      window.location.reload()
    }
  }
}

window.onload = () => {
  setTimeout(() => {
    if (getScrollTop() + getWindowHeight() >= getScrollHeight()) {
      setTimeout(() => {
        window.location.reload()
      }, 8000)
    } else {
      setInterval(() => {
        window.scroll(0, window.scrollY + 1)
      }, 50)
    }
  }, 2000)
}