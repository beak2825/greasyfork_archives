// ==UserScript==
// @name         fixed youtube captions
// @namespace    http://www.chaochaogege.com
// @version      0.9.1
// @description  Some of youtube entancer of mine
// @author       iamwwc
// @match        https://www.youtube.com/*
// @grant        none
// @require https://greasyfork.org/scripts/402597-monitor-dom-change/code/monitor%20dom%20change.js?version=801281
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522778/fixed%20youtube%20captions.user.js
// @updateURL https://update.greasyfork.org/scripts/522778/fixed%20youtube%20captions.meta.js
// ==/UserScript==

!function youtubeofmine() {
  const over = document.querySelector('body')
  let container = document.querySelector('body')
  function start() {
    // const subtitlesdiv = document.querySelector('.caption-window')
    function addMultipleListener(target, events, fn, useCapture) {
      for (const e of events) {
        target.addEventListener(e, fn, useCapture)
      }
    }
    addMultipleListener(container, ['click', 'touchstart', 'mouseout', 'mousedown', 'mousemove', 'dragstart'], e => {
  if (e.target.closest('.caption-window')) {
    e.stopPropagation()
    // 只在dragstart事件时阻止默认行为
    if (e.type === 'dragstart') {
      e.preventDefault()
    }
    return
  }
}, true)
    monitordom(over, (lists) => {
      if (lists.addedNodes.length > 0) {
        const n = lists.addedNodes[0]
        if (typeof n.className == 'string') {
          if (n.className.includes('ytp-caption-segment')) {
            let stylelists = n.style
            stylelists['user-select'] = 'text'
          }
        }
      }
    }, { attributes: true, childList: true, subtree: true })
  }
  start()
}()