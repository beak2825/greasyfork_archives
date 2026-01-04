// ==UserScript==
// @name         CSDN 优化
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  优化 CSDN 体验
// @author       share121
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457272/CSDN%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457272/CSDN%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

window.addEventListener(
  'copy',
  e => (e.stopImmediatePropagation?.(), e.stopPropagation(), !1),
  !0
)
setTimeout(() => {
  document
    .querySelectorAll('a')
    .forEach(e =>
      e.addEventListener(
        'click',
        a => (
          a.stopImmediatePropagation?.(),
          a.stopPropagation(),
          (e.target = '_blank'),
          !1
        ),
        !0
      )
    )
}, 500)
document.querySelectorAll('pre, code').forEach(e => {
  e.style.cssText +=
    '-webkit-touch-callout:auto;-webkit-user-select:auto;-khtml-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto;'
})
document.querySelectorAll('.hljs-button.signin').forEach(e => {
  e.onclick = a => {
    a.stopPropagation()
    navigator.clipboard.writeText(e.parentNode.innerText).then(() => {
      e.dataset.title = '复制成功'
      setTimeout(() => {
        e.dataset.title = '复制'
      }, 3000)
    })
  }
  e.dataset.title = '复制'
})
let tmp = setInterval(() => {
  let button = document.querySelector('#passportbox > span')
  if (button) {
    clearInterval(tmp)
    button.click()
  }
})
document.querySelector('#article_content').style.height = 'auto'
document.querySelector('.hide-article-box.hide-article-pos')?.remove()
document.querySelector('#blogExtensionBox')?.remove()
document.querySelectorAll('.look-more-preCode').forEach(e => e.click())
document
  .querySelectorAll('.newcomment-list .ellipsis')
  .forEach(e => e.classList.remove('ellipsis'))
