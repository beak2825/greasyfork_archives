// ==UserScript==
// @name         NGA论坛自定义表情包（自用改版）
// @namespace    https://github.com/biuuu
// @version      0.0.5
// @description  冲鸭
// @author       芭芭拉(原作者)
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442096/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E8%87%AA%E7%94%A8%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/442096/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E8%87%AA%E7%94%A8%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(async function() {
  'use strict';
  const addStyle = (css) => {
    const style = document.createElement('style')
    style.innerText = css
    document.head.appendChild(style)
  }

  const loadScript = async () => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'
    document.head.appendChild(script)
    return new Promise((rev, rej) => {
      script.onload = rev
      script.onerror = rej
    })
  }

  await loadScript()

  const randomNum = Math.floor(Math.random() * 1e5)

  addStyle(`
  .single_ttip2 .div3 > div {
    padding: 4px 4px 0 4px;
  }
  .single_ttip2 .div3 > div:empty {
    display: inline-block;
    padding: 0;
  }
  .sticker-${randomNum} img {
    max-height: 70px;
    cursor: pointer;
  }
  .sticker-${randomNum} {
    margin: 0.2em;
    
  }
  .single_ttip2 .block_txt_big {
    padding: 0 0.5em;
    cursor: pointer;
    outline: 0;
    margin-left: -0.2em;
    margin-right: 0.6em;
  }
  .single_ttip2 .block_txt_big:hover {
    filter: brightness(0.95);
  }
  .single_ttip2 .block_txt_big:active {
    filter: brightness(0.9);
  }
  .sticker-toolbar-${randomNum} {
    position: absolute;
    right: 53px;
    top: 0;
  }
  .sticker-import-${randomNum} {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  `)


  let boxId = null

  const sleep = function (time) {
    return new Promise(rev => {
      setTimeout(rev, time)
    })
  }

  let stickerMap = new Map([
    ['猫猫龙', [
      './mon_202203/24/mhQ17n-ki6zKeT8S2s-2u.png',
      './mon_202203/24/mhQ17n-d3kwKeT8S2s-2v.png',
      './mon_202203/25/mhQ17n-fcvlKfT8S2s-2v.png',
      './mon_202203/25/mhQ17n-30l7KeT8S2s-2v.png',
      './mon_202203/26/mhQ7i87-6rqiKeT8S2s-2v.png',
      './mon_202203/26/mhQ7i87-ryrKfT8S2s-2v.png',
      './mon_202203/26/mhQ17n-i953ZeT1kS3s-3k.gif',//勾引
      './mon_202203/26/mhQ17n-8vp3K13ToS35-28.gif',//揉...
      './mon_202203/26/mhQ0-ahyeK1jToS4w-5k.png'
    ]]
  ])

  let recentStickers = []
  try {
    let arr = JSON.parse(localStorage.getItem('custom-sticker'))
    if (Array.isArray(arr)) {
      stickerMap = new Map(arr)
    }
  } catch (e) {}

  try {
    recentStickers = JSON.parse(localStorage.getItem('recent-sticker'))
    if (!Array.isArray(recentStickers)) {
      recentStickers = []
    }
  } catch (e) {}

  const saveCustomSticker = (map = stickerMap) => {
    localStorage.setItem('custom-sticker', JSON.stringify([...map]))
  }

  window.saveRecentSticker = (sticker) => {
    if (recentStickers.includes(sticker)) return
    recentStickers.push(sticker)
    recentStickers = recentStickers.slice(-10)
    localStorage.setItem('recent-sticker', JSON.stringify(recentStickers))
  }

  const urlPrefix = 'https://img.nga.178.com/attachments'

  const resolveUrl = (src) => {
    let url = src
    if (/^https?\:\/\//.test(src)) {

    } else if (/^\.\//.test(src)) {
      url = `${urlPrefix}${src.replace(/^\./, '')}`
    } else if (/^[^\/]/.test(src)) {
      url = `${urlPrefix}/${src}`
    }
    return _.escape(url)
  }


  const insertStickers = async (stickerBox, list) => {
    let html = ''
    if (recentStickers.length) {
      recentStickers.forEach(sticker => {
        const src = resolveUrl(sticker)
        const safeSticker = _.escape(sticker)
        html += `
        <img onclick="window.saveRecentSticker('${safeSticker}');postfunc.addText('[img]${safeSticker}[/img]');postfunc.selectSmilesw._.hide()" src="${src}">
        `
      })
      html = `<div style="margin: 4px 0;
      border-bottom: 1px solid #dcc9b1;">${html}</div>`
    }
    for (let i = 0; i < list.length; i++) {
      let sticker = list[i]
      const src = resolveUrl(sticker)
      const safeSticker = _.escape(sticker)
      html += `
      <img onclick="window.saveRecentSticker('${safeSticker}');postfunc.addText('[img]${safeSticker}[/img]');postfunc.selectSmilesw._.hide()" src="${src}">
      `
      if (i && i % 60 === 0) {
        stickerBox.innerHTML = html
        await sleep(1000)
      }
    }
    stickerBox.innerHTML = html
  }

  const stickerLoaded = new Set()

  const changeBlock = (stickerBox, index) => {
    stickerBox.style.display = 'block'
    let blocks = stickerBox.parentNode.parentNode.querySelectorAll(`span>div:not(.sticker-${randomNum}-${index})`)
    blocks.forEach(item => item.style.display = 'none')
  }

  window.setSticker = (index) => {
    const stickerBox = document.getElementById(`block-${randomNum}-sticker-${index}`)
    if (stickerBox) {
      if (stickerBox.style.display === 'block') {
        stickerBox.style.display = 'none'
        return
      } else if (stickerLoaded.has(index)) {
        changeBlock(stickerBox, index)
        return
      }

      stickerLoaded.add(index)
      changeBlock(stickerBox, index)
      const list = ([...stickerMap])[index][1]
      insertStickers(stickerBox, list)
    }
  }

  const getStickers = (text) => {
    const list = text.split(/\r?\n/)
    if (list[0] !== '==NGA CUSTOM STICKER==') {
      alert('文件格式错误: 第一行必须是“==NGA CUSTOM STICKER==”')
      return
    }
    const stickers = new Map()
    list.forEach(txt => {
      if (txt.startsWith('#')) {
        let name = txt.slice(1, txt.length)
        if (name) {
          stickers.set(name, [])
        }
      } else if (/^(https?:\/\/|\.\/)/.test(txt)) {
        const arr = Array.from(stickers.values()).pop()
        if (arr && Array.isArray(arr)) {
          arr.push(txt)
        }
      }
    })
    if (stickers.size) {
      saveCustomSticker(stickers)
      if (confirm('导入成功，刷新页面后生效。是否立即刷新')) {
        location.reload()
      }
    } else {
      alert('没有找到有效的表情地址')
    }
  }

  const tryDownload = (content, filename) => {
    const eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    const blob = new Blob([content], { type: 'text/plain' })
    eleLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }

  window.importStickers = function (files) {
    if (!files.length) return
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target.result
      getStickers(text)
    }
    reader.readAsText(files[0])
  }

  window.exportStickers = function () {
    let arr = ['==NGA CUSTOM STICKER==', '']
    for (let [name, list] of stickerMap) {
      arr.push(`#${name}`)
      for (let src of list) {
        arr.push(src)
      }
      arr.push('')
    }
    const text = arr.join('\r\n')
    tryDownload(text, 'custom-sticker.txt')
  }

  let inserted = false
  const insertBtn = () => {
    if (inserted) return
    inserted = true
    let index = 0
    for (let [name] of stickerMap) {
      const safeName = _.escape(name)
      const btnBlock = document.querySelector(`#${boxId} .div3 .block_txt_big:last-child`)
      btnBlock.insertAdjacentHTML('afterend', `<button class="block_txt_big" onclick="window.setSticker(${index})">${safeName}</button>`)
      const stcBlock = document.querySelector(`#${boxId} .div3>span:last-child>div:last-child`)
      stcBlock.insertAdjacentHTML('afterend', `<div id="block-${randomNum}-sticker-${index}" class="sticker-${randomNum} sticker-${randomNum}-${index}"></div>`)
      index++
    }
    const box = document.querySelector(`#${boxId} .div1`)
    box.insertAdjacentHTML('afterend', `
      <div class="sticker-toolbar-${randomNum}">
      <button class="block_txt_big" style="position:relative;overflow:hidden">导入<input type="file" class="sticker-import-${randomNum}" onchange="window.importStickers(this.files)" accept=".txt"></button>
      <button class="block_txt_big" onclick="window.exportStickers()">导出</button>
      </div>
    `)
  }

  const mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      const type = mutation.type
      const addedNodes = mutation.addedNodes
      if (type === 'childList' && addedNodes.length && addedNodes.length < 2) {
        addedNodes.forEach(node => {
          if (/^commonwindow\d+$/.test(node.id) && node.querySelector('.tip_title .title').innerText === '插入表情') {
            boxId = node.id
            insertBtn()
          }
        })
      }
    }
  }

  const obConfig = {
    subtree: true,
    childList: true
  }

  const targetNode = document.body
  const observer = new MutationObserver(mutationCallback)
  observer.observe(targetNode, obConfig)
})();