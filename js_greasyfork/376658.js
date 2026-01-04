// ==UserScript==
// @name         不要翻译github上的代码
// @namespace    http://floatsyi.com/
// @version      0.6.0
// @description  避免google网页翻译github站点中的代码
// @author       floatsyi
// @license      MIT
// @include      *://github.com*
// @include      *://gist.github.com*
// @match        *://github.com*
// @match        *://gist.github.com*
// @downloadURL https://update.greasyfork.org/scripts/376658/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91github%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/376658/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91github%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;(function () {
  'use strict'
  // debug log
  const isDev = false
  const log = (...args) => {
    isDev && console.log(args)
  }

  const debounce = function (func, wait) {
    var lastCallTime
    var lastThis
    var lastArgs
    var timerId

    function startTimer(timerExpired, wait) {
      return setTimeout(timerExpired, wait)
    }

    function remainingWait(time) {
      const timeSinceLastCall = time - lastCallTime
      const timeWaiting = wait - timeSinceLastCall
      return timeWaiting
    }

    function shoudInvoking(time) {
      return lastCallTime !== undefined && time - lastCallTime >= wait
    }

    function timerExpired() {
      const time = Date.now()
      if (shoudInvoking(time)) {
        return invokeFunc()
      }
      timerId = startTimer(timerExpired, remainingWait(time))
    }

    function invokeFunc() {
      timerId = undefined
      const args = lastArgs
      const thisArg = lastThis
      let result = func.apply(thisArg, args)
      lastArgs = lastThis = undefined
      return result
    }

    function debounced(...args) {
      let time = Date.now()
      lastThis = this
      lastArgs = args
      lastCallTime = time
      if (timerId === undefined) {
        timerId = startTimer(timerExpired, wait)
      }
    }

    return debounced
  }

  const notranslate = (node) => void node.classList.add('notranslate')

  function doNotTranslateTab() {
      const tab = document.querySelector(
        '.UnderlineNav-body'
      )
      notranslate(tab)
  }

  function doNotTranslateTable() {
      const tables = document.querySelectorAll('#readme table')
      ;[...tables].forEach(notranslate)
  }

  function doNotTranslateGist() {
    if (window.location.href.match('/gist.github.com/') !== null) {
      const gist = document.querySelectorAll('.file')
      const pres = document.querySelectorAll('pre')
      ;[...gist, ...pres].forEach(notranslate)
    }
  }

  function doNotTranslateFilenamesAndDirectories() {
    const fileAndDirectory = document.querySelectorAll(
      '.Box.mb-3, .file-navigation'
    )
    ;[...fileAndDirectory].forEach(notranslate)
  }

  function doNotTranslateCodeContentPages() {
    const isCodeContentPages = window.location.href.match('/blob/') !== null
    const isNotMD = window.location.href.match('.md') === null
    if (isCodeContentPages && isNotMD) {
      const main = document.querySelector('main')
      notranslate(main)
    }
  }

  function doNotTranslateReferenceCode() {
    // github 会自动给 .sg-mounted 的子节点 code 加 .sg-mounted class 这里要 加个 div 排除出去
    const referenceCodes = document.querySelectorAll(
      'div.border.rounded-1.my-2'
    )
    for (const referenceCode of [...referenceCodes]) {
      notranslate(referenceCode)
    }
  }

  function doNotTranslateTitle() {
    ;['1', '2', '3', '4', '5', '6'].forEach((item) => {
      const itemEle = document.querySelectorAll(`h${item}`)
      // 没找到就退出
      if (!itemEle) return false
      ;[...itemEle].forEach((el) => {
        // 如果是 issues 标题就退出
        if (el.classList.contains('gh-header-title')) return false
        notranslate(el)
      })
    })
  }

  function doNotTranslateCode() {
    const files = document.querySelectorAll('.file')
    const pres = document.querySelectorAll('pre')

    if (files.length > 0) {
      if (window.location.href.search(/.md/i) !== -1) {
        if (pres.length > 0) {
          pres.forEach(notranslate)
        }
      } else {
        files.forEach(notranslate)
      }
    } else if (pres.length > 0) {
      pres.forEach(notranslate)
    }
  }

  // 监听DOM变更
  const githubTV = document.querySelector('body')
  const isGitHub =
    window.location.href.search(/github.com/i) !== -1 && !!githubTV

  const option = {
    childList: true,
    subtree: true,
  }

  let time = 0

  function doNotTranslate(mutations, observer) {
    // 处于过于频繁的 DOM 变更时, 暂停监听 50ms, 并放弃累积的未处理的变更事件
    if (time >= 20) {
      observer.disconnect()
      observer.takeRecords()
      time = 0
      setTimeout(function () {
        isGitHub && observer.observe(githubTV, option)
      }, 50)
    }
    // 如果是编辑页就退出
    if (window.location.href.match('/edit/') !== null) return false

    // 不要翻译代码
    doNotTranslateCode()
    // 不要翻译引用代码
    doNotTranslateReferenceCode()
    // 不要翻译文件名与目录
    doNotTranslateFilenamesAndDirectories()
    // 不要翻译代码内容页
    doNotTranslateCodeContentPages()
    // 不要翻译标题
    doNotTranslateTitle()
    // 不要翻译 gist 页面的代码
    doNotTranslateGist()
    // 不要翻译表格
    doNotTranslateTable()
    // 不要翻译标签栏
    doNotTranslateTab()
    time++
    log(`第${time}次执行: doNotTranslate`)
  }

  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  const mo = new MutationObserver(debounce(doNotTranslate, 50))
  isGitHub && mo.observe(githubTV, option)
})()
