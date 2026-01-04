// ==UserScript==
// @name         GitHub 输入框添加折叠块
// @namespace    https://github.com/ltxhhz/github-auto-add-details/
// @version      0.3
// @description  在 markdown 输入框自动添加添加<details>标签
// @author       ltxhhz
// @license      MIT
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459047/GitHub%20%E8%BE%93%E5%85%A5%E6%A1%86%E6%B7%BB%E5%8A%A0%E6%8A%98%E5%8F%A0%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/459047/GitHub%20%E8%BE%93%E5%85%A5%E6%A1%86%E6%B7%BB%E5%8A%A0%E6%8A%98%E5%8F%A0%E5%9D%97.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const matches = ['https://github.com/*/*/issues/*', 'https://github.com/*/*/pull/*', 'https://github.com/*/*/compare/*', 'https://github.com/*/*/discussions/*']
  function matchUrl() {
    return matches.some(e => new RegExp(e.replace(/\*/g, '[^/]+')).test(location.href))
  }
  function insertText(e, content) {
    let startPos = e.selectionStart // 获取光标开始的位置
    let endPos = e.selectionEnd // 获取光标结束的位置
    if (startPos === undefined || endPos === undefined) return // 如果没有光标位置 不操作

    let oldTxt = e.value // 获取输入框的文本内容
    let result = oldTxt.substring(0, startPos) + content + oldTxt.substring(endPos) // 将文本插入
    e.value = result // 将拼接好的文本设置为输入框的值
    e.focus() // 重新聚焦输入框
    e.selectionStart = startPos + content.length // 设置光标开始的位置
    e.selectionEnd = startPos + content.length // 设置光标结束的位置
  }
  function cloneElementAfter(element) {
    if (!element) return

    // 克隆元素，包括所有子元素
    const clonedElement = element.cloneNode(true)

    // 插入克隆元素到原元素之后
    element.parentNode.insertBefore(clonedElement, element.nextSibling)
    return clonedElement
  }
  /**
   * 根据 toolbar 定位，添加功能
   * @date 2024-07-31
   * @param {Element} e
   * @returns {any}
   */
  function add(e) {
    if (e.querySelector('.add-collapse')) return
    const quote = e.querySelector('[data-md-button="quote"]').parentElement
    /**@type {Element} */
    const div = cloneElementAfter(quote)
    const [btn1, tip1] = div.children
    btn1.id = 'add-collapse-' + Math.random().toString(16).substring(2)
    btn1.dataset.analyticsEvent = ''
    tip1.id = 'tooltip-' + Math.random().toString(16).substring(2)
    tip1.setAttribute('for', btn1.id)
    tip1.setAttribute('aria-labelledby', btn1.id)
    tip1.dataset.hotkey = ''
    tip1.innerText = 'Collapse'
    div.classList.add('add-collapse')
    //#region
    btn1.innerHTML = `<svg t="1674907668027" class="octicon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1753" width="16" height="16"><path d="M491.904 380.638H112.171c-16.032 0-29.091 10.99-29.091 24.437 0 13.446 13.059 24.436 29.09 24.436h379.864c16.032 0 29.09-10.99 29.09-24.436-0.129-13.576-13.187-24.437-29.22-24.437z m0 216.049H112.171c-16.032 0-29.091 10.99-29.091 24.436 0 13.447 13.059 24.437 29.09 24.437h379.864c16.032 0 29.09-10.99 29.09-24.437-0.129-13.446-13.187-24.436-29.22-24.436z m-0.517 216.307H112.56c-16.291 0-29.608 10.99-29.608 24.436 0 13.447 13.188 24.437 29.608 24.437h378.828c16.42 0 29.608-10.99 29.608-24.437 0-13.446-13.188-24.436-29.608-24.436zM681.19 334.739h93.737v316.897c0 16.033 10.99 29.091 24.437 29.091 13.446 0 24.307-13.058 24.307-29.09V334.738h93.737c14.74 0 21.85-3.878 23.273-6.723 1.164-2.327-0.13-9.438-8.145-19.394l-102.53-128.258c-8.404-10.602-19.264-16.291-30.513-16.291-11.378 0-22.109 5.818-30.513 16.29L666.32 308.753c-7.886 9.955-9.18 17.066-8.016 19.393 0.905 2.716 8.146 6.594 22.885 6.594z" p-id="1754"></path><path d="M112.688 861.737h768c16.291 0 29.608-10.99 29.608-24.436s-13.188-24.436-29.608-24.436h-768c-16.29 0-29.608 10.99-29.608 24.436 0 13.576 13.188 24.436 29.608 24.436z m379.216-697.535H112.171c-16.032 0-29.091 10.99-29.091 24.436 0 13.447 13.059 24.437 29.09 24.437h379.864c16.032 0 29.09-10.99 29.09-24.437-0.129-13.446-13.187-24.436-29.22-24.436z" p-id="1755"></path></svg>`
    //#endregion
    btn1.onclick = function (e1) {
      insertText(
        e.parentElement.parentElement.querySelector('textarea'),
        `<details>
<summary>标题</summary>

\`\`\`
被折叠的内容
\`\`\`

</details>`
      )
    }
    // for (let i = 0; i < e.children.length; i++) {
    //   const e1 = e.children[i]
    //   if (e1.querySelector('md-quote')) {
    //     e1.insertBefore(a, e1.firstElementChild)
    //     break
    //   }
    // }
  }
  const _wr = function (type) {
    let orig = history[type]
    return function () {
      let rv = orig.apply(this, arguments)
      let e = new Event(type)
      e.arguments = arguments
      window.dispatchEvent(e)
      return rv
    }
  }
  history.pushState = _wr('pushState')
  history.replaceState = _wr('replaceState')

  // window.addEventListener('replaceState', function (e) {
  //   console.log('THEY DID IT AGAIN! replaceState 111111');
  // });
  window.addEventListener('pushState', function (e) {
    if (matchUrl()) {
      setTimeout(main, 500)
    }
  })

  function main(e) {
    const toolbars = document.querySelectorAll('markdown-toolbar')
    toolbars.forEach(add)
    console.log('添加 添加<details>标签 按钮')
    const observer = new MutationObserver((list, obs) => {
      list.forEach(e => {
        if (e.type == 'childList') {
          if (e.addedNodes.length) {
            e.addedNodes.forEach(e1 => {
              let a
              if (e1 instanceof Element && (a = e1.querySelector('markdown-toolbar'))) {
                add(a)
              }
            })
          }
        }
      })
    })
    observer.observe(document.querySelector('.new-discussion-timeline'), {
      childList: true,
      subtree: true
    }) //issue page
  }
  if (matchUrl()) {
    main()
  }
})()
