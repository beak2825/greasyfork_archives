// ==UserScript==
// @name         一键跳转到github的dev编辑器页面
// @namespace    https://github.com/xxxily
// @homepage     https://github.com/xxxily
// @version      0.0.2
// @description  一键跳转到github的dev编辑器页面！
// @author       xxxily
// @match        https://github.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442408/%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E5%88%B0github%E7%9A%84dev%E7%BC%96%E8%BE%91%E5%99%A8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/442408/%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E5%88%B0github%E7%9A%84dev%E7%BC%96%E8%BE%91%E5%99%A8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

/**
 * 元素监听器
 * @param selector -必选
 * @param fn -必选，元素存在时的回调
 * @param shadowRoot -可选 指定监听某个shadowRoot下面的DOM元素
 * 参考：https://javascript.ruanyifeng.com/dom/mutationobserver.html
 */
 function ready (selector, fn, shadowRoot) {
  const win = window
  const docRoot = shadowRoot || win.document.documentElement
  if (!docRoot) return false
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver
  const listeners = docRoot._MutationListeners || []

  function $ready (selector, fn) {
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    })

    /* 增加监听对象 */
    if (!docRoot._MutationListeners || !docRoot._MutationObserver) {
      docRoot._MutationListeners = listeners
      docRoot._MutationObserver = new MutationObserver(() => {
        for (let i = 0; i < docRoot._MutationListeners.length; i++) {
          const item = docRoot._MutationListeners[i]
          check(item.selector, item.fn)
        }
      })

      docRoot._MutationObserver.observe(docRoot, {
        childList: true,
        subtree: true
      })
    }

    // 检查节点是否已经在DOM中
    check(selector, fn)
  }

  function check (selector, fn) {
    const elements = docRoot.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      element._MutationReadyList_ = element._MutationReadyList_ || []
      if (!element._MutationReadyList_.includes(fn)) {
        element._MutationReadyList_.push(fn)
        fn.call(element, element)
      }
    }
  }

  const selectorArr = Array.isArray(selector) ? selector : [selector]
  selectorArr.forEach(selector => $ready(selector, fn))
}

ready('a.btn', function (element) {
  if(!document.getElementById('goToDev') && element.innerText === 'Go to file'){
    const devBtn = document.createElement("a")
    devBtn.innerText = "Go to Dev"
    devBtn.id = "goToDev"
    devBtn.target = "_blank"
    devBtn.href = window.location.href.replace("github.com", "github.dev")
    devBtn.className = element.className
    element.parentNode.insertBefore(devBtn, element)
  }
})

// 旧的实现方式，需要document-end才能获取到元素，偶尔会有失败的情况，所以改成ready方式
// if(!document.getElementById('goToDev')){
//   const devBtn = document.createElement("a")
//   devBtn.innerText = "Go to Dev"
//   devBtn.id = "goToDev"
//   devBtn.target = "_blank"
//   devBtn.href = window.location.href.replace("github.com", "github.dev")

//   const btns = document.querySelectorAll("a.btn")
//   btns.forEach(btn => {
//     if(btn.innerText === "Go to file"){
//       devBtn.className = btn.className
//       btn.parentNode.insertBefore(devBtn, btn)
//     }
//   })
// }
