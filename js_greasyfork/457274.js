// ==UserScript==
// @name         知乎优化
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  优化知乎体验
// @author       share121
// @match        https://zhuanlan.zhihu.com/*/*
// @match        https://www.zhihu.com/*/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457274/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457274/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
function observe(callback, target, options) {
  function getAll(...nodes) {
    const tmp = [...nodes]
    for (let i = 0; i < tmp.length; i++) {
      tmp.push(...tmp[i].childNodes)
    }
    return tmp
  }
  const observer = new MutationObserver(mutationsList => {
    callback(
      mutationsList.map(mutation => {
        let _addedNodes = null
        let _removedNodes = null
        let _targetNodes = null
        return {
          type: mutation.type,
          target: mutation.target,
          attributeName: mutation.attributeName,
          attributeNamespace: mutation.attributeNamespace,
          oldValue: mutation.oldValue,
          nextSibling: mutation.nextSibling,
          previousSibling: mutation.previousSibling,
          get addedNodes() {
            _addedNodes !== null && _addedNodes !== void 0
              ? _addedNodes
              : (_addedNodes = getAll(...mutation.addedNodes))
            return _addedNodes
          },
          get removedNodes() {
            _removedNodes !== null && _removedNodes !== void 0
              ? _removedNodes
              : (_removedNodes = getAll(...mutation.removedNodes))
            return _removedNodes
          },
          get targetNodes() {
            _targetNodes !== null && _targetNodes !== void 0
              ? _targetNodes
              : (_targetNodes = getAll(mutation.target))
            return _targetNodes
          },
        }
      }),
      observer
    )
  })
  observer.observe(target, options)
  return observer
}
observe(
  mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(e => {
          if (e instanceof HTMLAnchorElement && /target=([^&]+)/.test(e.href)) {
            e.href = decodeURIComponent(e.href.match(/target=([^&]+)/)[1])
          }
        })
      } else if (mutation.type === 'attributes') {
        mutation.targetNodes.forEach(e => {
          if (e instanceof HTMLAnchorElement && /target=([^&]+)/.test(e.href)) {
            e.href = decodeURIComponent(e.href.match(/target=([^&]+)/)[1])
          }
        })
      }
    }
  },
  document,
  {
    attributeFilter: ['href'],
    childList: true,
    subtree: true,
  }
)
observe(
  (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(e => {
          if (
            e instanceof HTMLElement &&
            e.classList.contains('Modal-closeButton')
          ) {
            e.click()
            observer.disconnect()
          }
        })
      } else if (mutation.type === 'attributes') {
        mutation.targetNodes.forEach(e => {
          if (
            e instanceof HTMLElement &&
            e.classList.contains('Modal-closeButton')
          ) {
            e.click()
            observer.disconnect()
          }
        })
      }
    }
  },
  document,
  {
    attributeFilter: ['class'],
    childList: true,
    subtree: true,
  }
)
