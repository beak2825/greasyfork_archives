// ==UserScript==
// @name         fix netflix caption
// @namespace    http://www.chaochaogege.com
// @match        https://www.netflix.com/*
// @description  help fix netflix caption
// @require https://greasyfork.org/scripts/402597-monitor-dom-change/code/monitor%20dom%20change.js?version=801281
// @run-at document-end
// @version 0.0.1.20220623162631
// @downloadURL https://update.greasyfork.org/scripts/446920/fix%20netflix%20caption.user.js
// @updateURL https://update.greasyfork.org/scripts/446920/fix%20netflix%20caption.meta.js
// ==/UserScript==
 
!function fixedNetflixCaptions() {
  const over = document.querySelector('body')
  let container = document.querySelector('body')
  function start() {
    function addMultipleListener(target, events, fn, useCapture) {
      for (const e of events) {
        target.addEventListener(e, fn, useCapture)
      }
    }
    addMultipleListener(container, ['click', 'touchstart', 'mouseout', 'mousedown', 'mousemove'], e => {
      for (let idx = 0; idx < 5; idx++) {
        if (e.path[idx].className.includes('player-timedtext-text-container')) {
          e.stopPropagation()
          return
        }
      }
    }, true)
    monitordom(over, (lists) => {
      if (lists.addedNodes.length > 0) {
        const n = lists.addedNodes[0]
        if (typeof n.className== 'string') {
          console.log(n)
          if (n.className.includes('player-timedtext-text-container')) {
            let stylelists = n.style
            stylelists['user-select'] = 'text'
          }
        }
      }
    }, { attributes: true, childList: true, subtree: true })
  }
  start()
}()