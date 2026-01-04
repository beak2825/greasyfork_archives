// ==UserScript==
// @name         不翻译英文网站上的代码
// @namespace    http://codeexpander.com/
// @version      1.0.3
// @description  避免google网页翻译任何英文站点中的代码, 持续更新
// @author       xudaolong
// @license      MIT
// @match        http://*/*
// @include      https://*/*
// @downloadURL https://update.greasyfork.org/scripts/394305/%E4%B8%8D%E7%BF%BB%E8%AF%91%E8%8B%B1%E6%96%87%E7%BD%91%E7%AB%99%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/394305/%E4%B8%8D%E7%BF%BB%E8%AF%91%E8%8B%B1%E6%96%87%E7%BD%91%E7%AB%99%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;(function () {
  'use strict'
  // debug log
  const isDev = false
  const log = (...args) => {
    isDev && console.log(args)
  }
  const style = 'font-size: inherit;'
  const addCodeEle = function (ele) {
    ele.innerHTML = '<code>' + ele.innerHTML + '</code>'
  }
  const addCodeEleNoColor = function (ele) {
    ele.innerHTML = '<code style="background: transparent;font-family: --system;">' + String(ele.innerHTML).trim() + '</code>'
  }
  const addCodeEleWithTextNoColor = function (ele) {
    var txt=document.createElement("span");
    txt.innerHTML= `${ele.innerHTML}`;
    ele.innerHTML = `<code style="background: transparent">${ele.innerHTML}</code>`
    if(ele.nextSibling){
      ele.parentNode.insertBefore(txt, ele.nextSibling);
    }else{
      ele.parentNode.appendChild(txt);
    }
  }
  const hasCodeEleChild = function (ele) {
    return !!ele.querySelector('code')
  }
  const addPreEle = function (ele) {
    ele.innerHTML = `<pre style= "${style}"><code style="${style}">${
      ele.innerHTML
    }</code></pre>`
  }
  const hasPreEleChild = function (ele) {
    return !!ele.querySelector('code')
  }
  const _ = {}
  _.debounce = function (func, wait) {
    var lastCallTime
    var lastThis
    var lastArgs
    var timerId

    function startTimer (timerExpired, wait) {
      return setTimeout(timerExpired, wait)
    }

    function remainingWait (time) {
      const timeSinceLastCall = time - lastCallTime
      const timeWaiting = wait - timeSinceLastCall
      return timeWaiting
    }

    function shoudInvoking (time) {
      return lastCallTime !== undefined && time - lastCallTime >= wait
    }

    function timerExpired () {
      const time = Date.now()
      if (shoudInvoking(time)) {
        return invokeFunc()
      }
      timerId = startTimer(timerExpired, remainingWait(time))
    }

    function invokeFunc () {
      timerId = undefined
      const args = lastArgs
      const thisArg = lastThis
      let result = func.apply(thisArg, args)
      lastArgs = lastThis = undefined
      return result
    }

    function debounced (...args) {
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

  // 不要翻译文件名与目录
  const doNotTranslateFilenamesAndDirectories = () => {
    const fileAndDirectory = document.querySelectorAll(
      '.file-wrap .js-navigation-item .js-navigation-open'
    )
    ;[...fileAndDirectory].forEach(item => {
      if (!hasPreEleChild(item)) {
        addCodeEleNoColor(item)
      }
    })
  }

  // 不要翻译代码内容页
  const doNotTranslateCodeContentPages = () => {
    const codeContainer = document.querySelector('.js-file-line-container')
    if (codeContainer) {
      const main = document.querySelector('main')
      if (main.parentNode.nodeName !== 'CODE') {
        main.parentNode.innerHTML = `<code>${main.parentNode.innerHTML}</code>`
      }
    }
  }

  // 不要翻译标题
  const doNotTranslateTitle = () => {
    ;['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong'].forEach(item => {
      const itemEle = document.querySelectorAll(item)
      // 没找到就退出
      if (!itemEle) return false
      ;[...itemEle].forEach(el => {
        // 如果是 issues 标题就退出
        if (el.classList.contains('gh-header-title')) return false
        if (!hasCodeEleChild(el)) {
          addCodeEleNoColor(el)
        }
      })
    })
    ///**
    ;['li a', 'p a'].forEach(item => {
      const itemEle = document.querySelectorAll(item)
      // 没找到就退出
      if (!itemEle) return false
      ;[...itemEle].forEach(el => {
        // 如果是 issues 标题就退出
        if (el.classList.contains('gh-header-title')) return false
        if (!hasCodeEleChild(el)) {
          addCodeEleNoColor(el)
        }
      })
    })
    //**/
  }

  // 不要翻译代码
  const doNotTranslateCode = () => {
    const files = document.querySelectorAll('.file')
    const pres = document.querySelectorAll('pre')

    if (files.length > 0) {
      if (window.location.href.search(/.md/i) !== -1) {
        if (pres.length > 0) {
          pres.forEach(function (pre) {
            if (!hasCodeEleChild(pre)) addCodeEle(pre)
          })
        }
      } else {
        files.forEach(function (file) {
          if (!hasCodeEleChild(file)) addCodeEle(file)
        })
      }
    } else if (pres.length > 0) {
      pres.forEach(function (pre) {
        if (!hasCodeEleChild(pre)) addCodeEle(pre)
      })
    }
  }

  const option = {
    childList: true,
    subtree: true
  }

  let time = 0

  const initObserve = (observer) => {
      observer.observe(document.querySelector('body'), option)
  }

  const doNotTranslate = function (mutations, observer) {
    // 处于过于频繁的 DOM 变更时, 暂停监听 50ms, 并放弃累积的未处理的变更事件
    if (time >= 20) {
      observer.disconnect()
      observer.takeRecords()
      time = 0
      setTimeout(function () {
        initObserve()
      }, 50)
    }

    // 不要翻译文件名与目录
    doNotTranslateFilenamesAndDirectories()
    // 不要翻译代码内容页
    doNotTranslateCodeContentPages()
    // 不要翻译代码
    doNotTranslateCode()
    // 不要翻译标题
    doNotTranslateTitle()

    time++
    log(`第${time}次执行: doNotTranslate`)
  }

  const noZhPage = () => {
    return ['zh-CN'].includes(document.getElementsByTagName('html')[0].lang) || /.*[\u4e00-\u9fa5]+.*$/.test((document.head.querySelector("title") || {}).text)
  }

  if(noZhPage()) return

  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  const mo = new MutationObserver(_.debounce(doNotTranslate, 50))
  initObserve(mo)
})()
