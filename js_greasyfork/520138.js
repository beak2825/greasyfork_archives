// ==UserScript==
// @name         XJ封面下载
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  移除开屏广告和弹窗，一键获取标题，封面url，一键下载封面并按照标题重命名
// @author       若始
// @license      MIT
// @match        *://*.jjxx10.cc/*
// @match        *://*.jjxx11.cc/*
// @match        *://*.jjxx12.cc/*
// @match        *://*.jjxx13.cc/*
// @match        *://*.jjxx14.cc/*
// @match        *://*.jjxx15.cc/*
// @match        *://*.jjxx16.cc/*
// @match        *://*.jjxx17.cc/*
// @match        *://*.jjxx18.cc/*
// @match        *://*.jjxx19.cc/*
// @match        *://*.jjxx20.cc/*
// @match        *://*.jjxx21.cc/*
// @match        *://*.jjxx22.cc/*
// @match        *://*.jjxx23.cc/*
// @match        *://*.jjxx24.cc/*
// @match        *://*.jjxx25.cc/*
// @match        *://*.jjxx26.cc/*
// @match        *://*.jjxx27.cc/*
// @match        *://*.jjxx28.cc/*
// @match        *://*.jjxx29.cc/*
// @match        *://*.jjxx30.cc/*
// @match        *://*.jjxx31.cc/*
// @match        *://*.jjxx32.cc/*
// @match        *://*.jjxx33.cc/*
// @match        *://*.jjxx34.cc/*
// @match        *://*.jjxx35.cc/*
// @match        *://*.jjxx36.cc/*
// @match        *://*.jjxx37.cc/*
// @match        *://*.jjxx38.cc/*
// @match        *://*.jjxx39.cc/*
// @match        *://*.jjxx40.cc/*
// @match        *://*.jjxx41.cc/*
// @match        *://*.jjxx42.cc/*
// @match        *://*.jjxx43.cc/*
// @match        *://*.jjxx44.cc/*
// @match        *://*.jjxx45.cc/*
// @match        *://*.jjxx46.cc/*
// @match        *://*.jjxx47.cc/*
// @match        *://*.jjxx48.cc/*
// @match        *://*.jjxx49.cc/*
// @match        *://*.jjxx50.cc/*
// @match        *://*.jjxx51.cc/*
// @match        *://*.jjxx52.cc/*
// @match        *://*.jjxx53.cc/*
// @match        *://*.jjxx54.cc/*
// @match        *://*.jjxx55.cc/*
// @match        *://*.jjxx56.cc/*
// @match        *://*.jjxx57.cc/*
// @match        *://*.jjxx58.cc/*
// @match        *://*.jjxx59.cc/*
// @match        *://*.jjxx60.cc/*
// @match        *://*.jjxx61.cc/*
// @match        *://*.jjxx62.cc/*
// @match        *://*.jjxx63.cc/*
// @match        *://*.jjxx64.cc/*
// @match        *://*.jjxx65.cc/*
// @match        *://*.jjxx66.cc/*
// @match        *://*.jjxx67.cc/*
// @match        *://*.jjxx68.cc/*
// @match        *://*.jjxx69.cc/*
// @match        *://*.jjxx70.cc/*
// @match        *://*.jjxx71.cc/*
// @match        *://*.jjxx72.cc/*
// @match        *://*.jjxx73.cc/*
// @match        *://*.jjxx74.cc/*
// @match        *://*.jjxx75.cc/*
// @match        *://*.jjxx76.cc/*
// @match        *://*.jjxx77.cc/*
// @match        *://*.jjxx78.cc/*
// @match        *://*.jjxx79.cc/*
// @match        *://*.jjxx80.cc/*
// @match        *://*.jjxx81.cc/*
// @match        *://*.jjxx82.cc/*
// @match        *://*.jjxx83.cc/*
// @match        *://*.jjxx84.cc/*
// @match        *://*.jjxx85.cc/*
// @match        *://*.jjxx86.cc/*
// @match        *://*.jjxx87.cc/*
// @match        *://*.jjxx88.cc/*
// @match        *://*.jjxx89.cc/*
// @match        *://*.jjxx90.cc/*
// @match        *://*.jjxx91.cc/*
// @match        *://*.jjxx92.cc/*
// @match        *://*.jjxx93.cc/*
// @match        *://*.jjxx94.cc/*
// @match        *://*.jjxx95.cc/*
// @match        *://*.jjxx96.cc/*
// @match        *://*.jjxx97.cc/*
// @match        *://*.jjxx98.cc/*
// @match        *://*.jjxx99.cc/*
// @icon         ./favicon.ico
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/520138/XJ%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520138/XJ%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
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

// 移除广告
function removeAdvt() {
  setTimeout(() => {
    const splash = document.querySelector('.splash')
    if (splash) splash.remove()
    const vanOverlay = document.querySelector('.van-overlay')
    if (vanOverlay) {
      const advtDialog = vanOverlay.nextElementSibling
      if (advtDialog) advtDialog.remove()
      vanOverlay.remove()
    }
  }, 200)
}

// 主函数
function main() {
  removeAdvt()
  insertStyle()
  // 创建悬浮导航并插入页面
  const floatNav = document.createElement('div')
  floatNav.id = 'float-nav'
  floatNav.innerHTML = `
        <button class="nav-btn" id="titleBtn">标题</button>
        <button class="nav-btn" id="urlBtn">链接</button>
        <button class="nav-btn" id="downloadBtn">下载</button>`
  document.querySelector('body').appendChild(floatNav)

  // 获取操作按钮并绑定点击事件
  const titleBtn = document.querySelector('#titleBtn')
  const urlBtn = document.querySelector('#urlBtn')
  const downloadBtn = document.querySelector('#downloadBtn')
  titleBtn.addEventListener('click', () => getTitle(), false)
  urlBtn.addEventListener('click', () => getUrl(), false)
  downloadBtn.addEventListener('click', () => startDownload(), false)
}

// 获取标题并弹窗显示
function getTitle() {
  const items = document.querySelectorAll('.videos .title')
  let titles = ''
  items.forEach(el => (titles += `${el.textContent}\n`))
  const dialogContent = { count: items.length, text: titles }
  createDialog(dialogContent, () => console.log('弹窗已关闭'))
}

// 获取链接并弹窗显示
function getUrl() {
  const items = document.querySelectorAll('.videos .cover-img')
  let urls = ''
  items.forEach(el => (urls += `${el.src}\n`))
  const dialogContent = { count: items.length, text: urls }
  createDialog(dialogContent, () => console.log('弹窗已关闭'))
}

// 下载封面
function startDownload() {
  const parent = document.querySelector('.videos')
  const items = parent.children
  let i = 0
  const myTimer = setInterval(() => {
    if (i >= items.length - 1) {
      alert(`一共下载【${i+1}】个封面`)
      clearInterval(myTimer)
    }
    const url = items[i].querySelector('.cover-img').src
    const title = items[i].querySelector('.title').innerText
    const filename = rename(title)
    downloadFileByUrl(url, filename)
    i++
  }, 200)
  console.log(`一共有【${items.length}】个视频`)
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

// 重命名
function rename(name) {
  if (name.includes('香蕉秀')) {
    const filterNumReg = new RegExp(/\b\d+\b/g)
    const fileNumber = name.match(filterNumReg)
    if (!fileNumber) return name
    const number = fillZero(fileNumber[0], 4)
    const index = name.indexOf('-') + 1
    const title = name.substring(index, name.length)
    const filename = `XJX-${number} ${title}`
    name = filename
  }
  if (name.includes('蕉点')) {
    const fileNumber = chineseToNumber(name)
    const number = fillZero(fileNumber, 3)
    const index = name.indexOf('-') + 1
    const title = name.substring(index, name.length)
    const filename = `JDSY-${number} ${title}`
    name = filename
  }
  return name
}

// 通过链接下载图片
function downloadFileByUrl(url, filename) {
  const download = GM_download({
      url: url,
      name: filename,
      saveAs: true,
      conflictAction: 'uniquify'
  });
}

// 汉语数字转阿拉伯数字
function chineseToNumber(str) {
  const chineseToNumber = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }
  const chineseUnitToWeight = { '': 1, 十: 10, 百: 100, 千: 1000, 万: 10000, 亿: 100000000 }
  const chineseNumberStr = str.match(/第([\u4e00-\u9fa5]+)集/)[1]
  function chineseToArabic(chineseStr) {
    if (chineseStr == '十') return 10
    let result = 0
    let temp = 0
    let weight = 1
    for (let i = chineseStr.length - 1; i >= 0; i--) {
      const num = chineseToNumber[chineseStr[i]]
      const unit = chineseUnitToWeight[chineseStr[i + 1]] || 1
      if (typeof num === 'number') {
        temp += num * unit
      } else if (typeof unit === 'number') {
        weight = unit
        result += temp * weight
        temp = 0
      }
    }
    return result + temp
  }
  const arabicNumber = chineseToArabic(chineseNumberStr)
  return arabicNumber
}

// 前缀补0
function fillZero(number, length) {
  let numberStr = number.toString()
  let zerosNeeded = length - numberStr.length
  if (zerosNeeded > 0) {
    numberStr = '0'.repeat(zerosNeeded) + numberStr
  }
  return numberStr
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