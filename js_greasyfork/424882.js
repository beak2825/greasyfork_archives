// ==UserScript==
// @name         一键复制
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/424882/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/424882/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
  'use strict'
  $('body').on('click', '*', function (event) {
    if (event.altKey) {
      event.preventDefault()
      event.stopPropagation()
      let text = $(this).text().trim() || $(this).val()
      if (text) {
        text = text
          .replace(/[:：]$/, '')
          .replace(/^'(.*)'$/, '$1')
          .replace(/^"(.*)"$/, '$1')
        if (text) {
          highlight(event.target)
          GM_setClipboard(text)
        }
      } else if ($(this).find('input')) {
        const val = $(this).find('input').eq(0).val()
        if (val) {
          highlight($(this).find('input')[0])
          GM_setClipboard(val)
        }
      }
    }
  })

  let addedList = []
  if (location.origin === 'https://codesign.qq.com') {
    setInterval(() => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(item => {
        if (!addedList.includes(item.src)) {
          addedList.push(item.src)
          if (item.contentDocument?.body) {
            $(item.contentDocument.body).on('click', '*', function (event) {
              if (event.altKey) {
                event.preventDefault()
                event.stopPropagation()
                let text = $(this).text().trim() || $(this).val()
                if (text) {
                  text = text
                    .replace(/[:：]$/, '')
                    .replace(/^'(.*)'$/, '$1')
                    .replace(/^"(.*)"$/, '$1')
                  if (text) {
                    highlight(event.target, item)
                    GM_setClipboard(text)
                  }
                } else if ($(this).find('input')) {
                  const val = $(this).find('input').eq(0).val()
                  if (val) {
                    highlight($(this).find('input')[0], item)
                    GM_setClipboard(val)
                  }
                }
              }
            })
          }

        }
      })
    }, 300)
  }

  function highlight(clickedElement, doc) {
    let d = document
    let frameX = 0
    let frameY = 0
    if (doc) {
      d = doc.contentDocument
      const rect = doc.getBoundingClientRect()
      frameX = rect.x
      frameY = rect.y
    }
    const rect = clickedElement.getBoundingClientRect()
    const frame = d.createElement('div')
    frame.style.position = 'absolute'
    frame.style.top = frameY + rect.top + window.scrollY - 4 + 'px'
    frame.style.left = frameX + rect.left + window.scrollX - 4 + 'px'
    frame.style.width = rect.width + 8 + 'px'
    frame.style.height = rect.height + 8 + 'px'
    frame.style.border = 'solid 2px gold'
    frame.style.borderRadius = '5px'
    frame.style.zIndex = '99999'
    frame.style.pointerEvents = 'none'
    document.body.appendChild(frame)
    $(frame).fadeIn(300, 'swing').delay(500).fadeOut(500, 'swing')
  }
})();
