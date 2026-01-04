// ==UserScript==
// @name         直接跳转外链
// @namespace    jump_links
// @version      0.1.1
// @description  跳过中转页 直接外部链接 支持 知乎 简书
// @author       MoukJun
// @match        *://*.zhihu.com/*
// @match        *://*.jianshu.com/*
// @mathc        *://*.jianshu.com/*
// @grant GM_openInTab
// @grant GM_addStyle
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422992/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/422992/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var host = location.host

  function replaceLink(selector, replaceStr) {
    $(selector).each(function (index, item){
      var href = $(item).attr('href')
      if (href.indexOf(replaceStr) !== -1) {
        href = href.replace(replaceStr, '')
        var realLink = decodeURIComponent(href)
        $(item).attr('href', realLink)
        console.log(realLink)
      }
    })
  }

  var timer = null
  function executeTimer(selector, replaceStr) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () {
      replaceLink(selector, replaceStr)
    }, 500)
  }

  function zhihuRun () {
    executeTimer('a.external', 'https://link.zhihu.com/?target=')
    document.onscroll = function () {
      executeTimer('a.external', 'https://link.zhihu.com/?target=')
    }
  }

  function jianshuRun () {
    executeTimer('a', 'https://links.jianshu.com/go?to=')
    document.onscroll = function () {
      executeTimer('a', 'https://links.jianshu.com/go?to=')
    }
  }

  switch (host) {
    case 'www.zhihu.com':
      zhihuRun ()
      break
    case 'www.jianshu.com':
      jianshuRun()
      break
    default:
      break
  }
})();