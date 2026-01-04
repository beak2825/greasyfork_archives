// ==UserScript==
// @name         NGA论坛自定义表情包
// @namespace    https://github.com/biuuu
// @version      0.0.4
// @description  冲鸭
// @author       芭芭拉
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422369/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/422369/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
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
    width: 962px;
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
    ['原神', [
      './mon_202103/01/i2Q16r-9dvkK6T8S1o-1o.png',
      './mon_202103/01/i2Q16r-j3x7KaT8S1o-1o.png',
      './mon_202103/01/i2Q16r-708aK9T8S1o-1o.png',
      './mon_202103/01/i2Q16r-g3c4K7T8S1o-1o.png',
      './mon_202103/01/i2Q16r-3s4iK7T8S1o-1o.png',
      './mon_202103/01/i2Q16r-ctnwK8T8S1o-1o.png',
      './mon_202103/01/i2Q16r-nikK9T8S1o-1o.png',
      './mon_202103/01/i2Q16r-9ii9K7T8S1o-1o.png',
      './mon_202103/01/i2Q16r-ilggK8T8S1o-1o.png',
      './mon_202103/01/i2Q16r-5v44K9T8S1o-1o.png',
      './mon_202103/01/i2Q16r-enk2K6T8S1o-1o.png',
      './mon_202103/01/i2Q16r-2dfkK8T8S1o-1o.png',
      './mon_202103/01/i2Q16r-dmbuK7T8S1o-1o.png',
      './mon_202103/01/i2Q16r-12xiK7T8S1o-1o.png',
      './mon_202103/01/i2Q16r-9tq0K6T8S1o-1o.png',
      './mon_202103/01/i2Q16r-it1bK8T8S1o-1o.png'
    ]],
    ['GBF',[
      './mon_201903/16/fkQ5-i23xK9T8S3c-3c.png',
      './mon_201903/16/fkQ5-1xyeKbT8S3c-3c.png'
    ]],
    ['闪耀色彩', [
      './mon_202102/27/-77rdlQj09-9h6dKcT8S2x-2g.png',
      './mon_202102/27/-77rdlQj09-brf3KhT8S2s-2g.png',
      './mon_202102/27/-77rdlQj09-ki6tKhT8S2s-2g.png',
      './mon_202102/27/-77rdlQj09-77piKeT8S2i-2g.png',
      './mon_202102/27/-77rdlQj09-fpreKiToS2x-2g.png',
      './mon_202102/27/-77rdlQj09-3cqxKiToS2x-2g.png',
      './mon_202102/27/-77rdlQj09-d9fpKmToS2x-2g.png',
      './mon_202102/27/-77rdlQj09-19pdKhToS2x-2g.png',
      './mon_202102/27/-77rdlQj09-ac3aKjToS2x-2g.png'
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