// ==UserScript==
// @name         MD封面下载
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一键获取标题，封面url，下载封面并按照标题重命名
// @author       cc
// @license      MIT
// @match        *://imadou.cc/*
// @icon         ./favicon.ico
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/521786/MD%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521786/MD%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

;(function () {
  const styleStr = `*{padding:0;margin:0}#float-nav{position:fixed;top:50%;right:2%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;z-index:9999}.nav-btn{width:50px;line-height:50px;border-radius:50%;background-color:#007bff;color:#fff;border:none;cursor:pointer;margin:5px 0}.dialog-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.1);display:flex;justify-content:center;align-items:center;z-index:10000}.dialog{position:relative;background:white;padding:3% 4%;display:flex;flex-direction:column;align-items:center;border-radius:8px;max-width:85%;min-width:60%;max-height:60%;min-height:10%;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.dialog-title{font-size:16px}#textToCopy{width:97%;margin:8px 0;max-height:90%;overflow:scroll;white-space:pre}.btn-bar{display:flex;width:150px;margin:0 auto;justify-content:space-between}.dialog-btn{width:60px;line-height:30px;background-color:#007bff;color:#fff;border:none;border-radius:5px;cursor:pointer}`

  main()

  // 创建样式标签并插入页面
  function insertStyle() {
    const styleEl = document.createElement('style')
    styleEl.textContent = styleStr
    document.head.appendChild(styleEl)
  }

  // 主函数
  function main() {
    insertStyle()
    // 创建悬浮导航并插入页面
    const floatNav = document.createElement('div')
    floatNav.id = 'float-nav'
    floatNav.innerHTML = `
        <button class="nav-btn" id="titleBtn">标题</button>
        <button class="nav-btn" id="urlBtn">链接</button>
        <button class="nav-btn" id="downloadBtn1">下载1</button>
        <button class="nav-btn" id="downloadBtn2">下载2</button>`
    document.querySelector('body').appendChild(floatNav)

    // 获取操作按钮并绑定点击事件
    const titleBtn = document.querySelector('#titleBtn')
    const urlBtn = document.querySelector('#urlBtn')
    const downloadBtn1 = document.querySelector('#downloadBtn1')
    const downloadBtn2 = document.querySelector('#downloadBtn2')
    titleBtn.addEventListener('click', () => getTitle(), false)
    urlBtn.addEventListener('click', () => getUrl(), false)
    downloadBtn1.addEventListener('click', () => startDownload(true), false)
    downloadBtn2.addEventListener('click', () => startDownload(false), false)
  }

  // 获取标题并弹窗显示
  function getTitle() {
    const items = document.querySelectorAll('.row .stui-vodlist__media h3')
    let titles = ''
    items.forEach(el => (titles += `${el.textContent}\n`))
    const dialogContent = { count: items.length, text: titles }
    createDialog(dialogContent, () => console.log('弹窗已关闭'))
  }

  // 获取链接并弹窗显示
  function getUrl() {
    const items = document.querySelectorAll('.row .stui-vodlist__media .thumb a')
    let urls = ''
    items.forEach(el => (urls += `${el.getAttribute('data-original')}\n`))
    const dialogContent = { count: items.length, text: urls }
    createDialog(dialogContent, () => console.log('弹窗已关闭'))
  }

  // 重命名
  function rename(name) {
    if (!name.includes('.')) return name
    const filterNumReg = new RegExp(/\b\d+\b/g)
    const fileNumber = name.match(filterNumReg)
    if (!fileNumber) return name
    const filename = name.split('.')[1]
    return filename
  }

  // 重命名2
  function rename2(name) {
    if (!name.includes('.')) return name
    const filterNumReg = new RegExp(/\b\d+\b/g)
    const fileNumber = name.match(filterNumReg)
    if (!fileNumber) return name
    const title = name.split('.')
    if (title.length == 4) {
      return `${title[1]} ${title[3]} ${title[2]}`
    } else {
      return title[1]
    }
  }

  // 下载封面
  function startDownload(params) {
    const items = document.querySelectorAll('.row .stui-vodlist__media .thumb a')
    let i = 0
    const myTimer = setInterval(() => {
      if (i >= items.length - 1) {
        alert(`一共下载【${i + 1}】个封面`)
        clearInterval(myTimer)
      }
      const url = items[i].getAttribute('data-original')
      const name = items[i].title
      params ? downloadFileByUrl(url, rename(name) + '.jpg') : downloadFileByUrl(url, rename2(name) + '.jpg')
      i++
    }, 200)
    console.log(`一共有【${items.length}】个视频`)
  }

  // 通过链接下载图片
  function downloadFileByUrl(url, filename) {
    const download = GM_download({
      url: url,
      name: filename,
      saveAs: true,
      conflictAction: 'uniquify',
    })
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
})()
