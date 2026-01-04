// ==UserScript==
// @name         Seagm最小化客服窗口
// @namespace    http://tampermonkey.net/
// @version      0.2
// @homeurl     https://greasyfork.org/zh-CN/scripts/395015
// @description  Seagm页面加载后自动最小化客服窗口
// @author       xiandanin
// @match        https://*.seagm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395015/Seagm%E6%9C%80%E5%B0%8F%E5%8C%96%E5%AE%A2%E6%9C%8D%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/395015/Seagm%E6%9C%80%E5%B0%8F%E5%8C%96%E5%AE%A2%E6%9C%8D%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let minimize = false

  const body = document.querySelector('body')
  if (body != null) {
    const observer = new MutationObserver(function (mutations, observer) {
      if (minimize) {
        return
      }
      const iframe = document.querySelector('*[data-test-id="ChatWidgetWindow-iframe"]')
      if (iframe && iframe.contentWindow) {
        const node = iframe.contentWindow.document.querySelector('div[__jx__id="___$_14__minimize_container"]')
        if (node) {
          console.info(node)
          node.click()
          minimize = true
        }
      }
    })
    observer.observe(body, {
      childList: true
    })
  }
})();