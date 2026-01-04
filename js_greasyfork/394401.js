// ==UserScript==
// @name         NGA论坛明日方舟表情包
// @namespace    https://gist.github.com/biuuu
// @version      0.0.2
// @description  将 喵舔酱@NGA 制作的明日方舟AC娘表情加入到表情列表中
// @author       露莉亚
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394401/NGA%E8%AE%BA%E5%9D%9B%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/394401/NGA%E8%AE%BA%E5%9D%9B%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const addStyle = (css) => {
    const style = document.createElement('style')
    style.innerText = css
    document.head.appendChild(style)
  }

  addStyle(`
  .single_ttip2 .div3 > div {
    padding: 4px 4px 0 4px;
  }
  .single_ttip2 .div3 > div:empty {
    display: inline-block;
    padding: 0;
  }
  .arknights-sticker img {
    max-height: 70px;
    cursor: pointer;
  }
  .arknights-sticker {
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
  `)

  let boxId = null

  const sleep = function (time) {
    return new Promise(rev => {
      setTimeout(rev, time)
    })
  }

  const stickers = ['./mon_201912/30/-klbw3Q5-fuj9K10ToS3q-46.png','./mon_201912/30/-klbw3Q5-kmr4KqToS3p-46.png','./mon_201912/29/-klbw3Q5-emqK18ToS4f-46.png','./mon_201912/29/-klbw3Q5-6fmdK18ToS40-46.png','./mon_201912/29/-klbw3Q5-g4bbK1dToS3x-46.png','./mon_201912/29/-klbw3Q5-5rsuK1aToS42-46.png','./mon_201912/29/-klbw3Q5-89j0KoToS3t-46.png','./mon_201912/29/-klbw3Q5-j3o3KsToS3z-46.png','./mon_201912/29/-klbw3Q5-3t8yK1dToS4a-46.png','./mon_201912/29/-klbw3Q5-9tlaK17ToS46-46.png','./mon_201912/29/-klbw3Q5-j5ilK13ToS3i-46.png','./mon_201912/29/-klbw3Q5-44dxK11ToS4f-46.png','./mon_201912/29/-klbw3Q5-a3tpK15ToS3s-46.png','./mon_201912/29/-klbw3Q5-cltzK19ToS4b-46.png','./mon_201912/29/-klbw3Q5-6v17KsToS3i-46.png','./mon_201912/29/-klbw3Q5-10z9K19ToS40-46.png','./mon_201912/29/-klbw3Q5-4fgyK14ToS3h-46.png','./mon_201912/29/-klbw3Q5-abnsK1aToS45-46.png','./mon_201912/29/-klbw3Q5-g3n0K1fToS3v-46.png','./mon_201912/29/-klbw3Q5-jkb3K17ToS3u-46.png','./mon_201912/29/-klbw3Q5-dhifK19ToS3r-46.png','./mon_201912/29/-klbw3Q5-ggu8KtToS4v-46.png','./mon_201912/29/-klbw3Q5-7ne8K1bToS47-46.png','./mon_201912/29/-klbw3Q5-12mgK1fToS4b-46.png','./mon_201912/29/-klbw3Q5-9zy7K19ToS42-46.png','./mon_201912/29/-klbw3Q5-3v1pK15ToS3n-46.png','./mon_201912/29/-klbw3Q5-j5wfK1dToS4n-46.png','./mon_201912/29/-klbw3Q5-d4jeK19ToS3o-46.png','./mon_201912/29/-klbw3Q5-fsf9K18ToS3x-46.png','./mon_201912/29/-klbw3Q5-2q1sKoToS3t-46.png'
  ]
  let recentStickers = []
  try {
    recentStickers = JSON.parse(localStorage.getItem('arknights:sticker'))
    if (!Array.isArray(recentStickers)) {
      recentStickers = []
    }
  } catch (e) {}
  window.saveRecentarknightsSticker = (sticker) => {
    if (recentStickers.includes(sticker)) return
    recentStickers.push(sticker)
    recentStickers = recentStickers.slice(-10)
    localStorage.setItem('arknights:sticker', JSON.stringify(recentStickers))
  }
  const insertStickers = async (stickerBox) => {
    let html = ''
    if (recentStickers.length) {
      recentStickers.forEach(sticker => {
        const src = `https://img.nga.178.com/attachments/${sticker.slice(2)}`
        html += `
        <img onclick="window.saveRecentarknightsSticker('${sticker}');postfunc.addText('[img]${sticker}[/img]');postfunc.dialog.w._.hide()" src="${src}">
        `
      })
      html = `<div style="margin: 4px 0;
      border-bottom: 1px solid #dcc9b1;">${html}</div>`
    }
    for (let i = 0; i < stickers.length; i++) {
      let sticker = stickers[i]
      const src = `https://img.nga.178.com/attachments/${sticker.slice(2)}`
      html += `
      <img onclick="window.saveRecentarknightsSticker('${sticker}');postfunc.addText('[img]${sticker}[/img]');postfunc.dialog.w._.hide()" src="${src}">
      `
      if (i && i % 60 === 0) {
        stickerBox.innerHTML = html
        await sleep(1000)
      }
    }
    stickerBox.innerHTML = html
  }

  window.setarknightsSticker = (btn) => {
    const stickerBox = document.getElementById('block-arknights-sticker')
    if (stickerBox) {
      if (stickerBox.style.display === 'block') {
        stickerBox.style.display = 'none'
        return
      } else if (stickerBox.style.display === 'none') {
        stickerBox.style.display = 'block'
        let btns = stickerBox.parentNode.parentNode.querySelectorAll('span>div:not(.arknights-sticker)')
        btns.forEach(item => item.style.display = 'none')
        return
      }

      stickerBox.style.display = 'block'
      insertStickers(stickerBox)
    }
  }

  const insertBtn = () => {
    if (document.querySelector('button#arknights-sticker')) return
    const btnBlock = document.querySelector(`#${boxId} .div3 .block_txt_big:last-child`)
    btnBlock.insertAdjacentHTML('afterend', '<button id="arknights-sticker" class="block_txt_big" onclick="window.setarknightsSticker(this)">arknights</button>')
    const stcBlock = document.querySelector(`#${boxId} .div3>span:last-child>div:last-child`)
    stcBlock.insertAdjacentHTML('afterend', '<div id="block-arknights-sticker" class="arknights-sticker"></div>')
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