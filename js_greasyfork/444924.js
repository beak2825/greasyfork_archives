// ==UserScript==
// @name         NGA千律人偶ac娘表情包
// @version      0.4
// @description  欢迎来到，支配剧场
// @author       ringo-x
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @grant        none
// @namespace https://greasyfork.org/users/913843
// @downloadURL https://update.greasyfork.org/scripts/444924/NGA%E5%8D%83%E5%BE%8B%E4%BA%BA%E5%81%B6ac%E5%A8%98%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/444924/NGA%E5%8D%83%E5%BE%8B%E4%BA%BA%E5%81%B6ac%E5%A8%98%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==
// 原脚本名称       NGA论坛自定义表情包
// 原脚本作者       芭芭拉 https://github.com/biuuu
// 表情包作者       听风抚叶
// 表情包原帖       https://bbs.nga.cn/read.php?tid=31887636

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
    ['人偶AC娘', [
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-g8ttK5T8S3a-3a.jpg', //blink
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-fz36K6T8S3a-3a.jpg', //扇子笑
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-gnvgK6T8S3a-3a.jpg', //惊
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-gp2fK6T8S3a-3a.jpg', //抠鼻
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3doeK6T8S3a-3a.jpg', //委屈
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3gz6K6T8S3a-3a.jpg', //喷
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-3qppK7T8S3a-3a.jpg', //咦
        'https://img.nga.178.com/attachments/mon_202205/13/mfQn7k0-457pK6T8S3a-3a.jpg', //
        'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-gqndK6T8S3a-3a.jpg', //哭
        'https://img.nga.178.com/attachments/mon_202205/13/mfQsn40-jjplK6T8S3a-3a.jpg', //智慧墨镜
        'https://img.nga.178.com/attachments/mon_202205/13/mfQsn40-js57K6T8S3a-3a.jpg', //花痴
        'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-aqayK6T8S3a-3a.jpg', // 囧
        'https://img.nga.178.com/attachments/mon_202205/13/mfQ0-b6k5K6T8S3a-3a.jpg', // 羞
        'https://img.nga.178.com/attachments/mon_202205/13/mfQ6f40-7fz7K6T8S3a-3a.jpg', // 呆
        'https://img.nga.178.com/attachments/mon_202205/13/mfQ6f40-8kwiK6T8S3a-3a.jpg', // 偷笑
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-a27pK6T8S3a-3a.jpg', //冷
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-ap7qK6T8S3a-3a.jpg', //嘲笑1
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-axo8K6T8S3a-3a.jpg', //
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-bqmqKfToS67-5z.jpg', //big胆（大）
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-c5whK6T8S3a-3a.jpg', //big胆
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-i3ikK6T8S3a-3a.jpg', //抢镜
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hjj9K6T8S3a-3a.jpg', //晕1
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hendK7T8S3a-3a.jpg', //晕2
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-dbjxK6T8S3a-3a.jpg', //9600+300
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-d8v3K6T8S3a-3a.jpg', //扭曲琪厨
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-3tldK6T8S3a-3a.jpg', //琪宝写真
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-3my3K6T8S3a-3a.jpg', //如何瞬大
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-kj39K6T8S3a-3a.jpg', //凌乱
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-cdvK6T8S3a-3a.jpg', //嘲笑
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-gpnyK6T8S3a-3a.jpg', //赞同
        'https://img.nga.178.com/attachments/mon_202205/14/mfQ17r-hx58K6T8S3a-3a.jpg', //妹汁
    ]],
  ])

  let recentStickers = []
//   try {
//     let arr = JSON.parse(localStorage.getItem('custom-sticker'))
//     if (Array.isArray(arr)) {
//       stickerMap = new Map(arr)
//     }
//   } catch (e) {}

  try {
    recentStickers = JSON.parse(localStorage.getItem('recent-sticker'))
    if (!Array.isArray(recentStickers)) {
      recentStickers = []
    }
  } catch (e) {}

  window.saveRecentSticker = (sticker) => {
    if (recentStickers.includes(sticker)) return
    recentStickers.push(sticker)
    recentStickers = recentStickers.slice(-10)
    localStorage.setItem('recent-sticker', JSON.stringify(recentStickers))
  }

  const urlPrefix = '.'

  const resolveUrl = (src) => {
    return src
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