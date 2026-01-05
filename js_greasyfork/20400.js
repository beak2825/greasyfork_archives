/* eslint-env greasemonkey, browser */
// ==UserScript==
// @name         byr-signature
// @namespace    weibo.com/flowmemo
// @version      0.2.1
// @description  为北邮人论坛发帖添加个性签名
// @author       flowmemo
// @match        *://bbs.byr.cn/*
// @match        *://bbs6.byr.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @supportURL   https://github.com/flowmemo/byr-signature
// @downloadURL https://update.greasyfork.org/scripts/20400/byr-signature.user.js
// @updateURL https://update.greasyfork.org/scripts/20400/byr-signature.meta.js
// ==/UserScript==

; (function () {
  'use strict'
  const _DEBUG = false
  const log = (function () {
    if (_DEBUG) return console.log.bind(console)
    else return Function.prototype
  })()

  log('init')
  const added = new WeakSet()

  const defaultSig =
    `————
示例签名: 微博 [url=http://weibo.com/flowmemo][color=#0000FF]@flowmemo[/color][/url] , 现在主要写JavaScript. 关注广泛, 欢迎交流.
修改签名请到[url=https://bbs.byr.cn/#!article/WWWTechnology/post][color=#0000FF]这里[/color][/url]
[url=https://github.com/flowmemo/byr-signature][color=#0000FF]此签名通过「北邮人签名档」脚本发送[/color][/url]`

  function getUsername () {
    const user = document.querySelector('.u-login-id a')
    if (!user) {
      log('cannot find username')
      return false
    }
    const username = user.title
    return username
  }

  function getSig () {
    const username = getUsername()
    if (!username) return false
    const signature = GM_getValue('sig-' + username, defaultSig)
    return signature
  }

  function addPostSig () {
    log('addPostSig')
    const div = document.getElementById('post_content')
    if (!div || added.has(div)) return false
    added.add(div)
    div.value += '\n' + getSig()
    addSigPanel()
    return true
  }

  function addQuickSig () {
    log('addQuickSig')
    const div = document.getElementsByName('content')[0]
    if (!div || added.has(div)) return false
    added.add(div)
    div.value += '\n' + getSig()
    log('add value')
    return true
  }

  function addSigPanel () {
    log('sigPanel')
    const div = document.createElement('div')
    const postItems = document.getElementsByClassName('post-list-item')
    const referNode = postItems[postItems.length - 2]
    referNode.appendChild(div)
    div.outerHTML =
      `<br><br><div>
       <div class="post-m">byr-signature自定义签名</div>
       <div class="byr-signature" style="border:1px solid #c9d7f1;padding:5px;width:680px">
       <textarea class="post-textarea" name="sig-content" placeholder="在此输入你的签名"></textarea><br>
       </div><p><input name="saveSig" type="button" value="保存"> 保存后刷新页面生效（注意保存你的发帖内容） </p></div>`

    const userSig = document.getElementsByName('sig-content')[0]
    userSig.value = getSig()
    const saveButton = document.getElementsByName('saveSig')[0]

    const username = getUsername()
    if (!username) return false
    saveButton.addEventListener('click', function () {
      log('save')
      log('username', username)
      GM_setValue('sig-' + username, userSig.value)
    })
  }

  function onPageChange () {
    log('onPageChange')
    const URL = window.location.href
    if (URL.indexOf('#!article') === -1 || URL.indexOf('edit') > -1) return
    if (window.location.href.match(/post/)) {
      log(addPostSig())
    } else log(addQuickSig())
  }
  onPageChange()
  const observer = new MutationObserver(onPageChange)
  observer.observe(document.body, {childList: true, subtree: true})
})()
