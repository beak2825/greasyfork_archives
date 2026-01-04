// ==UserScript==
// @name         PH
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  获取视频信息
// @author       cc
// @match        *://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534832/PH.user.js
// @updateURL https://update.greasyfork.org/scripts/534832/PH.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const styleStr = `*{padding:0;margin:0;color:#000;}#float-nav{position:fixed;top:50%;right:2%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;z-index:9999}.nav-btn{width:50px;line-height:50px;border-radius:50%;background-color:#007bff;color:#fff;border:none;cursor:pointer;margin:5px 0}.dialog-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.1);display:flex;justify-content:center;align-items:center;z-index:10000}.dialog{position:relative;background:white;padding:3% 4%;display:flex;flex-direction:column;align-items:center;border-radius:8px;max-width:85%;min-width:60%;max-height:60%;min-height:10%;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.dialog-title{font-size:16px}#textToCopy{width:97%;margin:8px 0;max-height:90%;overflow:scroll;white-space:pre}.btn-bar{display:flex;width:150px;margin:0 auto;justify-content:space-between}.dialog-btn{width:60px;line-height:30px;background-color:#007bff;color:#fff;border:none;border-radius:5px;cursor:pointer}`

  const data = { model: '', works: [] }

  // 创建样式标签并插入页面
  function insertStyle() {
    const styleEl = document.createElement('style')
    styleEl.textContent = styleStr
    document.head.appendChild(styleEl)
  }

  function main() {
    // 插入样式
    insertStyle()
    // 创建悬浮导航并插入页面
    const floatNav = document.createElement('div')
    floatNav.id = 'float-nav'
    floatNav.innerHTML = `
        <button class="nav-btn" id="titleBtn">标题</button>
        <button class="nav-btn" id="urlBtn">链接</button>`
    document.querySelector('body').appendChild(floatNav)

    // 获取操作按钮并绑定点击事件
    const titleBtn = document.querySelector('#titleBtn')
    const urlBtn = document.querySelector('#urlBtn')

    titleBtn.addEventListener('click', () => getTitle(), false)
    urlBtn.addEventListener('click', () => getUrl(), false)
  }
  main()

  function init() {
    // 获取数据
    const ul = document.querySelector('#mostRecentVideosSection')
    const lis = Array.from(ul.children)
    const currentPageEl = document.querySelector('.page_current span')
    const currentPage = Number(currentPageEl.textContent)
    const model = document.querySelector('.name h1').textContent.trim()
    data.model = model
    data.works = getVideoUrl(lis)
  }

  function getTitle() {
    init()
    let titles = ''
    data.works.forEach(item => (titles += `${item.title}\n`))
    const dialogContent = { count: data.works.length, text: titles }
    createDialog(dialogContent, () => console.log('弹窗已关闭'))
  }

  function getUrl() {
    init()
    let urls = ''
    data.works.forEach(item => (urls += `${item.url}\n`))
    const dialogContent = { count: data.works.length, text: urls }
    createDialog(dialogContent, () => console.log('弹窗已关闭'))
  }

  function getVideoUrl(list = []) {
    const result = []
    list.forEach(item => {
      const a = item.querySelector('a')
      const img = a.querySelector('img')
      const url = a.href
      const title = removeEmojis(a.dataset.title).trim()
      const cover = img.src
      const date = parseDate(img.src)
      result.push({ url, title, cover, date })
    })
    console.log(data.works)
    return result
  }

  function removeEmojis(str) {
    const reg =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu
    return str.replace(reg, '').replace(/　/g, '')
  }

  function parseDate(url) {
    const dateStr = url.match(/\/20\d{4}\/\d{2}\//)[0]
    const date = dateStr.match(/\d/g).join('')
    return date
  }

  // 创建dialog提示框
  function createDialog(dialogContent, onClose) {
    // 创建弹窗覆盖层
    const overlay = document.createElement('div')
    overlay.className = 'dialog-overlay'
    // 创建弹窗内容
    const dialog = document.createElement('div')
    dialog.className = 'dialog'
    // 创建关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.className = 'dialog-btn'
    closeBtn.innerHTML = '关闭'
    closeBtn.onclick = function () {
      document.body.removeChild(overlay)
      if (onClose) onClose()
    }
    // 创建复制按钮
    const copyBtn = document.createElement('button')
    copyBtn.className = 'dialog-btn'
    copyBtn.innerHTML = '复制'
    copyBtn.onclick = function () {
      clickCopy(dialogContent.text)
    }
    // 添加消息内容
    const textEl = document.createElement('p')
    textEl.id = 'textToCopy'
    textEl.textContent = dialogContent.text
    // 添加布局P
    const btnBar = document.createElement('div')
    btnBar.className = 'btn-bar'
    // 添加标题
    const h3 = document.createElement('h3')
    h3.textContent = `一共有【${dialogContent.count}】条数据`
    h3.className = 'dialog-title'
    // 组装弹窗
    btnBar.appendChild(copyBtn)
    btnBar.appendChild(closeBtn)
    dialog.appendChild(h3)
    dialog.appendChild(textEl)
    dialog.appendChild(btnBar)
    overlay.appendChild(dialog)
    // 将弹窗添加到文档中
    document.body.appendChild(overlay)
  }

  // 点击复制
  async function clickCopy(text) {
    try {
      // 尝试将文本复制到剪贴板
      await navigator.clipboard.writeText(text)
      // 复制成功，更新状态显示
      alert('文本已复制到剪贴板！')
    } catch (err) {
      // 复制失败，更新状态显示
      alert('无法复制文本到剪贴板')
    }
  }
})
