// ==UserScript==
// @name         让我直接跳转好吗
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.4
// @description  网页中的外链直接跳出去而不再被拦一道
// @author       windeng
// @match        *://*.zhihu.com/*
// @match        *://c.pc.qq.com/*
// @match        *://*.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431920/%E8%AE%A9%E6%88%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%A5%BD%E5%90%97.user.js
// @updateURL https://update.greasyfork.org/scripts/431920/%E8%AE%A9%E6%88%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%A5%BD%E5%90%97.meta.js
// ==/UserScript==

function gaoZhihu() {
  if (!window.location.href.match('zhihu.com')) return

  let run = () => {
    let cnt = 0
    let aList = document.querySelectorAll('a')
    for (let a of aList) {
      const href = a.getAttribute('href')
      const matches = href.match(/link\.zhihu\.com\/?\?target=(.*)/)
      // console.log('?', href, matches)
      if (matches) {
        const url = decodeURIComponent(matches[1])
        a.setAttribute('href', url)
        // console.log(`${href} => ${url}`)
        ++cnt
      }
    }
    return cnt > 0
  }

  run()

  let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  let observer = new MutationObserver(function (mutations) {
    run()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function gaoQQ() {
  if (!window.location.href.match('c.pc.qq.com')) return

  const matches = window.location.search.match(/pfurl=([^&$]*)/)
  if (matches) {
    let url = decodeURIComponent(matches[1])
    console.log('QQ url', url)
    if (!url.startsWith('http') && !url.startsWith('//')) url = '//' + url
    window.location.href = url
  }
}

function gaoJianshu() {
  if (!window.location.href.match('jianshu.com')) return

  let run = () => {
    let cnt = 0
    let aList = document.querySelectorAll('a')
    for (let a of aList) {
      const href = a.getAttribute('href')
      const matches = href.match(/links.jianshu.com\/go\?to=([^&$]*)/)
      // console.log('?', href, matches)
      if (matches) {
        const url = decodeURIComponent(matches[1])
        a.setAttribute('href', url)
        // console.log(`${href} => ${url}`)
        ++cnt
      }
    }
    return cnt > 0
  }

  run()

  let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  let observer = new MutationObserver(function (mutations) {
    run()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

(function () {
  'use strict';

  // Your code here...
  gaoZhihu()
  gaoQQ()
  gaoJianshu()
})();