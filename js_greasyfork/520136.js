// ==UserScript==
// @name         狗狗网站封面下载
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一键获取标题，封面url，下载封面并按照标题重命名
// @author       cc
// @match        *://*.pipigou810.top/*
// @match        *://*.pipigou811.top/*
// @match        *://*.pipigou812.top/*
// @match        *://*.pipigou813.top/*
// @match        *://*.pipigou814.top/*
// @match        *://*.pipigou815.top/*
// @match        *://*.pipigou816.top/*
// @match        *://*.pipigou817.top/*
// @match        *://*.pipigou818.top/*
// @match        *://*.pipigou819.top/*
// @match        *://*.pipigou820.top/*
// @match        *://*.pipigou821.top/*
// @match        *://*.pipigou822.top/*
// @match        *://*.pipigou823.top/*
// @match        *://*.pipigou824.top/*
// @match        *://*.pipigou825.top/*
// @match        *://*.pipigou826.top/*
// @match        *://*.pipigou827.top/*
// @match        *://*.pipigou828.top/*
// @match        *://*.pipigou829.top/*
// @match        *://*.pipigou830.top/*
// @match        *://*.pipigou831.top/*
// @match        *://*.pipigou832.top/*
// @match        *://*.pipigou833.top/*
// @match        *://*.pipigou834.top/*
// @match        *://*.pipigou835.top/*
// @match        *://*.pipigou836.top/*
// @match        *://*.pipigou837.top/*
// @match        *://*.pipigou838.top/*
// @match        *://*.pipigou839.top/*
// @match        *://*.pipigou840.top/*
// @match        *://*.pipigou841.top/*
// @match        *://*.pipigou842.top/*
// @match        *://*.pipigou843.top/*
// @match        *://*.pipigou844.top/*
// @match        *://*.pipigou845.top/*
// @match        *://*.pipigou846.top/*
// @match        *://*.pipigou847.top/*
// @match        *://*.pipigou848.top/*
// @match        *://*.pipigou849.top/*
// @match        *://*.pipigou850.top/*
// @match        *://*.pipigou851.top/*
// @match        *://*.pipigou852.top/*
// @match        *://*.pipigou853.top/*
// @match        *://*.pipigou854.top/*
// @match        *://*.pipigou855.top/*
// @match        *://*.pipigou856.top/*
// @match        *://*.pipigou857.top/*
// @match        *://*.pipigou858.top/*
// @match        *://*.pipigou859.top/*
// @match        *://*.pipigou860.top/*
// @match        *://*.pipigou861.top/*
// @match        *://*.pipigou862.top/*
// @match        *://*.pipigou863.top/*
// @match        *://*.pipigou864.top/*
// @match        *://*.pipigou865.top/*
// @match        *://*.pipigou866.top/*
// @match        *://*.pipigou867.top/*
// @match        *://*.pipigou868.top/*
// @match        *://*.pipigou869.top/*
// @match        *://*.pipigou870.top/*
// @match        *://*.pipigou871.top/*
// @match        *://*.pipigou872.top/*
// @match        *://*.pipigou873.top/*
// @match        *://*.pipigou874.top/*
// @match        *://*.pipigou875.top/*
// @match        *://*.pipigou876.top/*
// @match        *://*.pipigou877.top/*
// @match        *://*.pipigou878.top/*
// @match        *://*.pipigou879.top/*
// @match        *://*.pipigou880.top/*
// @match        *://*.pipigou881.top/*
// @match        *://*.pipigou882.top/*
// @match        *://*.pipigou883.top/*
// @match        *://*.pipigou884.top/*
// @match        *://*.pipigou885.top/*
// @match        *://*.pipigou886.top/*
// @match        *://*.pipigou887.top/*
// @match        *://*.pipigou888.top/*
// @match        *://*.pipigou889.top/*
// @match        *://*.pipigou890.top/*
// @match        *://*.pipigou891.top/*
// @match        *://*.pipigou892.top/*
// @match        *://*.pipigou893.top/*
// @match        *://*.pipigou894.top/*
// @match        *://*.pipigou895.top/*
// @match        *://*.pipigou896.top/*
// @match        *://*.pipigou897.top/*
// @match        *://*.pipigou898.top/*
// @match        *://*.pipigou899.top/*
// @icon         ./favicon.ico
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/520136/%E7%8B%97%E7%8B%97%E7%BD%91%E7%AB%99%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520136/%E7%8B%97%E7%8B%97%E7%BD%91%E7%AB%99%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {

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
  const items = document.querySelectorAll('.page-content>.row h6')
  let titles = ''
  items.forEach(el => (titles += `${el.textContent}\n`))
  const dialogContent = { count: items.length, text: titles }
  createDialog(dialogContent, () => console.log('弹窗已关闭'))
}

// 获取链接并弹窗显示
function getUrl() {
  const items = document.querySelectorAll('.page-content>.row img')
  let urls = ''
  items.forEach(el => (urls += `${el.src}\n`))
  const dialogContent = { count: items.length, text: urls }
  createDialog(dialogContent, () => console.log('弹窗已关闭'))
}

// 下载封面
function startDownload(isOne) {
  const items = document.querySelectorAll('.page-content>.row img')
  let i = 0
  const myTimer = setInterval(() => {
    if (i >= items.length - 1) {
      alert(`一共下载【${i+1}】个封面`)
      clearInterval(myTimer)
    }
    const url = isOne ? items[i].src : items[i].getAttribute('data-img-replace')
    const name = items[i].src.split('/')[4]+'.jpg'
    downloadFileByUrl(url, name)
    i++
  }, 200)
  console.log(`一共有【${items.length}】个视频`)
}

// 通过链接下载图片
function downloadFileByUrl(url, filename) {
    //GM_download(url, filename);
    const download = GM_download({
        url: url,
        name: filename,
        saveAs: true,
        conflictAction: 'uniquify'
    });
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


})();