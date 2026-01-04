// ==UserScript==
// @name        知乎日报 - 更新 title
// @match       https://daily.zhihu.com/*
// @version      1.1
// @description  根据知乎日报的标题更新页面 title 标签
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/445200/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%20-%20%E6%9B%B4%E6%96%B0%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/445200/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%20-%20%E6%9B%B4%E6%96%B0%20title.meta.js
// ==/UserScript==

const questionTitle = document.querySelector('.DailyHeader-title').innerText
const expectedTitle = `${questionTitle} - 知乎日报`

/**
 * 知乎日报使用 React Helmet 更新 title 。
 * React Helmet 使用 `document.title = xxx` 来更新 title ，所以无法使用 MutationObserver
 * hijack document.title
 */
document.__defineSetter__('title', function (val) {
  if (val != expectedTitle) {
    return
  }
  document.querySelector('title').childNodes[0].nodeValue = expectedTitle
})

document.title = expectedTitle
