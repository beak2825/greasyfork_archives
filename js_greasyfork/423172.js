// ==UserScript==
// @name         自动复制救援码
// @namespace    https://gist.github.com/biuuu
// @version      0.4
// @description  自动复制最左边第一个救援码，调整顺序后刷新网页生效
// @author       biuuu
// @include      /^https?:\/\/gbf\.life.*$/
// @include      /^https?:\/\/gbs\.eriri\.net.*$/
// @include      /^https?:\/\/eriri\.net\/gbs.*$/
// @include      /^https?:\/\/.+-raidfinder\.herokuapp\.com.*$/
// @include      /^https?:\/\/gbf-raidfinder\.aikats\.us.*$/
// @include      /^https?:\/\/gbf-raidfinder\.la-foret\.me.*$/
// @include      /^https?:\/\/gbf-tbw\.tk/.*$/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/423172/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%95%91%E6%8F%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/423172/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E6%95%91%E6%8F%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const INTERVAL = 100    // 新ID最小触发间隔 ms
  const TAG_TIME = 5000   // 新ID标记时间 ms
  const URL = location.href
  const isEriri = URL.includes('eriri')
  const isGbfLife = URL.includes('gbf.life')

  let timer
  let lastid
  const newTag = (node) => {
    node.classList.add('new-copied-atcp')
    setTimeout(() => {
      node.classList.remove('new-copied-atcp')
    }, TAG_TIME)
  }
  const clickNode = (node) => {
    if (lastid === node.dataset.raidid) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastid = node.dataset.raidid
      node.classList.add('gbfrf-tweet--copied')
      newTag(node)
      GM_setClipboard(lastid, 'text')
    }, INTERVAL)
  }
  const clickNodeEriri = (node) => {
    const nodeId = node.querySelector('p.id')
    const nodeA = node.tagName === 'A' ? node : node.querySelector('a')
    if (!nodeId) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastid = nodeId.textContent
      nodeA.dataset.copied = true
      node.setAttribute('copied', 'true')
      newTag(node)
      GM_setClipboard(lastid, 'text')
    }, INTERVAL)
  }
  const clickNodeGbfLife = (node) => {
    const nodeId = node.querySelector('.rescue_id')
    if (!nodeId) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      lastid = nodeId.textContent
      node.classList.add('clicked')
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
            if (node.nodeType !== Node.ELEMENT_NODE) return
            if (isEriri) {
              if (node.classList.contains('req')) {
                clickNodeEriri(node)
              }
            } else if (node.classList.contains('list-group-item')) {
              clickNodeGbfLife(node)
            } else if (node.dataset && node.dataset.raidid) {
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

    let selector = '.mdl-list.gbfrf-tweets'
    if (isEriri) {
      selector = '#center .body'
    } else if (isGbfLife) {
      selector = '.list-group'
    }

    const targetNode = document.querySelector(selector)
    const observer = new MutationObserver(mutationCallback)
    observer.observe(targetNode, obConfig)

    const addStyle = (css) => {
      const style = document.createElement('style')
      style.innerText = css
      document.head.appendChild(style)
    }

    addStyle(`
    .new-copied-atcp {
      background-color: rgb(197 3 56 / 45%) !important;
    }
    `)
  }

  const main = () => {
    setTimeout(start, 1000)
  }

  if (window.unsafeWindow) {
    unsafeWindow.addEventListener('load', main)
  } else {
    window.addEventListener('load', main)
  }
})()