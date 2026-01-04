// ==UserScript==
// @name         NGA论坛自定义表情包（钟离改版）
// @namespace    https://github.com/biuuu(原作者)
// @version      0.0.1
// @description  自改，把个人论坛表情包迁移到nga上
// @author       芭芭拉(原作者)
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449722/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E9%92%9F%E7%A6%BB%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449722/NGA%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E9%92%9F%E7%A6%BB%E6%94%B9%E7%89%88%EF%BC%89.meta.js
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
    ['morax.beauty',['./mon_202208/17/-4ada3Q2q-63o4K5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-b798K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-2m5zZfToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-3disK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-dadgK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hrt1K12ToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-6819K12ToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-6bqwK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-k7lbK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hzwaK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-d4eoK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-6774K28ToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-kfgxK10ToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-33p3KrToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-l968K1tToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-l1tkK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-5b2rK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-jrpbK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-edvlKxToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-k55zKgT8S2o-2o.gif', './mon_202208/17/-4ada3Q2q-agb0K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-lc12K1kToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-46uiKvToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-b29gKoToS2o-2o.gif', './mon_202208/17/-4ada3Q2q-c1lpKjToS4l-46.gif', './mon_202208/17/-4ada3Q2q-jw5hK2fToS3c-3c.gif', './mon_202208/17/-4ada3Q2q-d64aK1gToS2s-3d.gif', './mon_202208/17/-4ada3Q2q-jvu5KiToS3c-3c.gif', './mon_202208/17/-4ada3Q2q-j5dmK12ToS35-28.gif', './mon_202208/17/-4ada3Q2q-jzm4K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-d8jnK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-jv75K5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-7bpiKwToS5k-6j.png', './mon_202208/17/-4ada3Q2q-gpbsK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-9xa6K7T8S2l-2o.png', './mon_202208/17/-4ada3Q2q-36esK5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hpqrK7T8S2f-2o.png', './mon_202208/17/-4ada3Q2q-axaqK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hv3kKoToS3c-40.png', './mon_202208/17/-4ada3Q2q-aq6fK4T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-3lhcK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hnj3K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-9wntK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-36aoKmToS3c-3c.png', './mon_202208/17/-4ada3Q2q-hbxdK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-2268K6T8S2o-2l.png', './mon_202208/17/-4ada3Q2q-e621K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-7bi3K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-d5fK5T8S2e-2o.png', './mon_202208/17/-4ada3Q2q-e8rvK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-dbo0K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-5vnhK5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-kegrK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-5m2dK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-k171K8T8S2n-2o.png', './mon_202208/17/-4ada3Q2q-d4cwK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-az21K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4d3kK4T8S2g-2o.png', './mon_202208/17/-4ada3Q2q-in15K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4969K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-a4u7K8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-3ecgK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-h8q5K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-aeq1K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-a5s8K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-gjr7K5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-7lsdK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-70zoK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-czkkK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-5mjcK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-d3c8K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hr6oK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-f2v8K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-73e7K5T8S2o-2l.png', './mon_202208/17/-4ada3Q2q-kvn8K8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-b1ihK6T8S2o-2l.png', './mon_202208/17/-4ada3Q2q-3mgmK6T8S2o-2j.png', './mon_202208/17/-4ada3Q2q-ibl0K4T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-awcjK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-442kK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-i9d7K8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-bikyK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-47l9K5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-iqz7K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-byziK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-5bpxK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-jypaK8T8S2o-2l.png', './mon_202208/17/-4ada3Q2q-d8qlK9T8S2o-2h.png', './mon_202208/17/-4ada3Q2q-6kkcK5T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-dy8jKkToS3c-3c.png', './mon_202208/17/-4ada3Q2q-50eoK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4duiK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-ikdqK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-b9txK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-3pojK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hr35K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-9vsvK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-2zwtK7T8S2o-2i.png', './mon_202208/17/-4ada3Q2q-hmf9K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-aokkK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-3i7nKeT8S2o-2o.png', './mon_202208/17/-4ada3Q2q-hahkK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-ad02K7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-2sfuK7T8S2o-2i.png', './mon_202208/17/-4ada3Q2q-hkraK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-j25cKlToS3c-3c.png', './mon_202208/17/-4ada3Q2q-bbq1K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4ccdK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-j3giKiToS3c-3c.png', './mon_202208/17/-4ada3Q2q-baqwK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4epnKnToS3c-3p.png', './mon_202208/17/-4ada3Q2q-j7psK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-cnscK6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-59vfK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-k4z5K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-ctx7K6T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-588fK6T8S2o-2c.png', './mon_202208/17/-4ada3Q2q-ep15KdT8S2i-23.png', './mon_202208/17/-4ada3Q2q-j002KhT8S2o-2r.png', './mon_202208/17/-4ada3Q2q-5epwKgT8S2s-2i.png', './mon_202208/17/-4ada3Q2q-5zcoKoToS3c-3c.png', './mon_202208/17/-4ada3Q2q-krt2KmToS3c-3c.png', './mon_202208/17/-4ada3Q2q-e8zkK2T8S24-26.png', './mon_202208/17/-4ada3Q2q-14vsKnToS3c-37.png', './mon_202208/17/-4ada3Q2q-5piuKgT8S2i-2q.png', './mon_202208/17/-4ada3Q2q-clf5K2T8S23-23.png', './mon_202208/17/-4ada3Q2q-5nb7KiToS3c-34.png', './mon_202208/17/-4ada3Q2q-j9blKlToS3c-2z.png', './mon_202208/17/-4ada3Q2q-ceh9KgT8S2s-2w.png', './mon_202208/17/-4ada3Q2q-540qK6ToS4l-48.png', './mon_202208/17/-4ada3Q2q-c185KnToS3c-45.png', './mon_202208/17/-4ada3Q2q-4x22KmToS3c-3j.png', './mon_202208/17/-4ada3Q2q-i6hzK7T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-bevdK8T8S2o-2o.png', './mon_202208/17/-4ada3Q2q-4mf9K8T8S2o-2d.png', './mon_202208/17/-4ada3Q2q-ikstK5T8S2o-2o.png']
    ]]);
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