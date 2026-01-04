// ==UserScript==
// @name         DisableAnimation
// @name:zh-CN   禁用动画
// @description  Disable animation on page
// @description:zh-CN  禁用网页上的动画效果
// @namespace    https://greasyfork.org/users/197529
// @version      0.7.2
// @author       kkocdko
// @license      Unlicense
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391083/DisableAnimation.user.js
// @updateURL https://update.greasyfork.org/scripts/391083/DisableAnimation.meta.js
// ==/UserScript==
'use strict'

runInGrobal(() => {
  window.requestAnimationFrame = callback => setTimeout(callback, 200)
})

document.head.insertAdjacentHTML('beforeend', `<style>

*,
*::before,
*::after {
  animation: none !important;
  transition: none !important;
}

</style>`)

function runInGrobal (callback) {
  const scriptEl = document.createElement('script')
  scriptEl.textContent = callback.toString()
  document.head.appendChild(scriptEl)
}
