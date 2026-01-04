// ==UserScript==
// @name        icon park 一键复制
// @namespace   Violentmonkey Scripts
// @match       https://iconpark.oceanengine.com/official*
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @description 2024/11/13 17:49:24
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517139/icon%20park%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/517139/icon%20park%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
document.body.addEventListener('click', (event) => {
  const matchedNode = findParentElement(event.srcElement, item => {
    return item.classList.contains('icon-base-wrapper')
  })
  console.log(matchedNode, 111)
  if (matchedNode) {
    const iconName = matchedNode.querySelector('.icon-base-view-text.name').innerText
    GM_setClipboard(`icon="${iconName}"`)
    highlight(matchedNode)
  }
})

function findParentElement(element, matchFunction) {
  // 从当前元素开始，逐级向上查找父级元素
  while (element && element !== document.body) {
    // 如果匹配方法返回 true，则返回当前元素
    if (matchFunction(element)) {
      return element;
    }
    // 否则继续查找父级元素
    element = element.parentElement;
  }
  // 如果没有找到匹配的元素，返回 null
  return null;
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
  $(frame).fadeIn(300, 'swing').delay(300).fadeOut(200, 'swing')
}