// ==UserScript==
// @name         自动复制救援码
// @namespace    https://gist.github.com/2222
// @version      0.3
// @description  自动复制最左边第一个救援码，调整顺序后刷新网页生效
// @author       szh
// @include      /^https?:\/\/gbf.life/.*$/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/410951/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%95%91%E6%8F%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/410951/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%95%91%E6%8F%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const INTERVAL = 100    // 新ID最小触发间隔 ms
  const TAG_TIME = 4000   // 新ID标记时间 ms

  let timer
  let lastid
  const newTag = (node) => {
    $(node).addClass('new-copied-atcp')
    setTimeout(() => {
      $(node).removeClass('new-copied-atcp')
    }, TAG_TIME)
  }
  const clickNode = (node) => {
    let id = $(node).find('.rescue_id').text();
    if (lastid === id) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastid = id;
      $(node).addClass('clicked');
      newTag(node)
      GM_setClipboard(lastid, 'text')
    }, INTERVAL)
  }
  const start = () => {
    const mutationCallback = (mutationsList) => {
      for (let mutation of mutationsList) {
        const type = mutation.type
        const addedNodes = mutation.addedNodes
        if (type === 'childList' && addedNodes.length && addedNodes.length < 2) {
          Array.from(addedNodes).reverse().forEach(node => {
            if (node) {
              clickNode(node)
            }
          })
        }
      }
    }
    const obConfig = {
      subtree: true,
      childList: true
    }

    //const targetNode = document.querySelector('.mdl-list.gbfrf-tweets')
    const targetNode = document.querySelector('.panel .list-group')
    console.log(targetNode);
    const observer = new MutationObserver(mutationCallback)
    observer.observe(targetNode, obConfig)

    const addStyle = (css) => {
      const style = document.createElement('style')
      style.innerText = css
      document.head.appendChild(style)
    }

    addStyle(`
    .new-copied-atcp {
      background-color: #41a840;
    }
    `)
  }

  if (window.unsafeWindow) {
    unsafeWindow.addEventListener('load', start)
  } else {
    window.addEventListener('load', start)
  }
})()