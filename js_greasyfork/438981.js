// ==UserScript==
// @name         屏蔽抖音直播礼物弹幕
// @namespace    https://github.com/XiaoMiku01
// @version      0.1
// @description  屏蔽抖音直播礼物弹幕。
// @include      https://live.douyin.com/*
// @author       XiaoMiku01
// @match        https://gist.github.com/XiaoMiku01/e552ea03e8cc2e8bc95f6bba6e7c14c0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/438981/%E5%B1%8F%E8%94%BD%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/438981/%E5%B1%8F%E8%94%BD%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
  window.onload = () => {
    const style = ".qeIYDuLt {display:none;}"
    const element = document.createElement('style')
    element.innerText = style
    document.body.appendChild(element)
  }
})();