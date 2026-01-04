// ==UserScript==
// @name         显示bug评审后的title
// @namespace    http://www.akuvox.com/
// @version      0.0.1
// @description  title show
// @author       liuchaoming
// @match        http://192.168.10.17/zentao/bug-browse-*.html*
// @match        http://zentao.akuvox.local/zentao/bug-browse-*.html*
// @match        http://192.168.10.17/zentao/my-bug*.html*
// @match        http://zentao.akuvox.local/zentao/my-bug*.html*
// @match        http://192.168.10.17/zentao/qa/
// @match        http://zentao.akuvox.local/zentao/qa/
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520278/%E6%98%BE%E7%A4%BAbug%E8%AF%84%E5%AE%A1%E5%90%8E%E7%9A%84title.user.js
// @updateURL https://update.greasyfork.org/scripts/520278/%E6%98%BE%E7%A4%BAbug%E8%AF%84%E5%AE%A1%E5%90%8E%E7%9A%84title.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  function getNodeByText(text) {
    const xpath = `//*[contains(text(), '${text}')]`
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue
  }

  // 获取标题
  async function getTitle() {
    try {
      const res = await fetch('http://192.168.10.52:43382/bug_review/list', {
        method: 'GET'
      })
      const result = await res?.json()
      // debugger
      if (!result?.success) return
      //debugger
      result.data.forEach((item) => {
        // debugger
        if (item.originBugTitle) {
          //debugger
          const node = getNodeByText(item.originBugTitle)
          if (node) {
            node.innerText = item.bugTitle
          }
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  window.addEventListener('load', () => {
    getTitle()
  })
})()
