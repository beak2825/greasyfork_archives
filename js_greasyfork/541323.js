// ==UserScript==
// @name         FoldingDeepSeek
// @name:zh-CN   DeepSeek折叠
// @namespace    https://greasyfork.org/users/1490581
// @version      1.1.2
// @description  TL;DR: 超弦领域折叠装置，启动！将DeepSeek酱的知识洪流压缩进克莱因瓶的口袋宇宙吧(◕ᴗ◕✿)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @match        https://chat.deepseek.com/*
// @author       quapyrus
// @supportURL   https://github.com/quapyrus/toolbox.qs/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541323/FoldingDeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/541323/FoldingDeepSeek.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  try {
    setTimeout(init, 1000)
  } catch (error) {
    console.error('DeepSeek折叠：出错啦，我什么都做不到……', error)
    return
  }


  function setFoldingDeepseekChatMonitor() {
    const ids = ['plugin-ui', 'return-button', 'toggle-button', 'copy-button', 'history-button']
    const exists = document.getElementById(ids[0])
    if (!exists) {
      return
    }
    document.getElementById('return-button').setAttribute('style', document.getElementById('toggle-button').getAttribute('style'))
    toggle()
    document.getElementById('qs-Deepseek-Chat-Monitor').addEventListener('click', toggle)
    document.getElementById('qs-navigation').classList.add('qs-Deepseek-Chat-Monitor')

    function toggle() {
      const hidden = exists.style.display === 'none'
      ids.forEach((v) => document.getElementById(v).style.display = hidden ? '' : 'none')
    }
  }

  function getRoot() { return Array.from(document.querySelectorAll('.ds-scroll-area div:has(>.ds-message)')) }

  function init() {


    // 插入导航面板和QsIcon模板
    document.getElementById('root').insertAdjacentHTML('beforeend', QsIcon.html)
    setFoldingDeepseekChatMonitor()

    const root = getRoot()
    for (var i = 1, length = root.length; i < length; i += 2) {
      insertFoldingActionBtn(root[i])
    }

    /// 插入单个回答折叠/展开按钮
    function insertFoldingActionBtn(root) {
      root.classList.add('qs-answer')
      const actions = root.querySelector('.ds-flex')
      if (!actions) {
        return
      }
      actions.firstChild.insertAdjacentHTML('afterbegin', '<qs-icon name="push-chevron-up" @click="toggleFolding"/>')
      actions.insertAdjacentHTML('afterbegin', '<qs-icon name="push-chevron-down" @click="toggleFolding"/>')
    }



    // const config = { childList: true, subtree: true }
    // const observer = new MutationObserver(fnMutationObserver)
    // observer.observe(document.querySelectorAll('.ds-scroll-area')[1], config)
    // // observer.disconnect()
    // function fnMutationObserver(mutationsList, observer) {
    //   if( !document.querySelector('qs-icon[name=qs-folding]').expand) {
    //     return
    //   }
    //   for(var mutation of mutationsList) {
    //     if (mutation.type === 'childList') {
    //       console.log('A child node has been added or removed.', mutationsList);
    //     }
    //   }
    // }





    QsIcon.removeHistory = async () => {
      const curr = document.querySelector('div.ds-scroll-area a.b64fb9ae[tabindex]>div>div[tabindex]')
      if (!curr) {
        //document.querySelector('div.ds-scroll-area div>div[tabindex]:has(>div[tabindex]>div.ds-icon:only-child>svg:only-child)').click()
        return
      }

      // 同天查找下一个历史
      var next = curr.parentElement.parentElement.nextElementSibling
      while (next && !next.matches('div.ds-scroll-area a[tabindex]:has(>div>div[tabindex])')) {
        next = next.nextElementSibling
      }
      // 没有，在前一天查找
      for (var i = curr.parentElement.parentElement.parentElement; !next && (i = i.nextElementSibling);) {
        next = i.querySelector('div.ds-scroll-area a[tabindex]')
      }

      curr.click()
      await new Promise(resolve => setTimeout(resolve, 100))
      document.querySelector('.ds-floating-container>.ds-theme>.ds-dropdown-menu.ds-elevated[role=menu]>.ds-dropdown-menu-option.ds-dropdown-menu-option--error').click()
      if (next) {
        for (var i = 0; i < 30 * 10; ++i) {
          await new Promise(resolve => setTimeout(resolve, 100))
          if (!document.querySelector('div.ds-scroll-area a.b64fb9ae[tabindex]>div>div[tabindex]')) {
            next.click()
            if (document.getElementById('qs-container').style.display !== 'none') {
              await new Promise(resolve => setTimeout(resolve, 500))
              QsIcon.buildNavigation();
            }
            break
          }
        }
      }
    }

    // 插入导航面板内容
    QsIcon.buildNavigation = () => {
      const root = getRoot()
      const items = []
      for (var i = 0, length = root.length; i < length; i += 2) {
        const index = i >> 1;
        root[i].id = `qs-question-${index}`
        const question = root[i].textContent
        //        console.log('DeepSeek折叠：', root[i], `qs.navigation[$i] == `, question)
        items.push(`
<a id="qs-item-${i}" class="qs-item" href="#qs-question-${index}" title="${question}">
  ${question}
</a>`)
      }
      document.getElementById('qs-container').innerHTML = items.join('')
    }

    // 展开/折叠导航面板
    QsIcon.toggleNavFolding = (_, target) => {
      const expand = target.parentNode.host.expand = !target.parentNode.host.expand
      //              if (() !== (name === 'chevron-down')) {
      target.style.display = 'none'
      target.parentNode.children[expand ? 1 : 0].style.display = ''

      const container = document.getElementById('qs-container')
      const btnSync = document.querySelector('#qs-navigation>div:first-child>qs-icon[name=sync]')
      if (!expand) {
        container.style.display = btnSync.style.display = 'none'
      } else if (container.style.display === 'none') {
        QsIcon.buildNavigation()
        container.style.display = btnSync.style.display = ''
      }
    }

    // 展开/折叠回答
    QsIcon.toggleFolding = (_, target, root) => {
      var flagFolding
      if (typeof target === 'boolean') {
        flagFolding = target
      } else {
        if (!root) {
          root = target.parentNode.host.closest('.qs-answer')
        }
        flagFolding = target.matches('[name$=up]')
      }
      if (flagFolding) {
        root.classList.add('qs-collapse')
      } else {
        root.classList.remove('qs-collapse')
      }
      const first = root.querySelector('div.ds-message')?.firstChild
      if (first && first.childElementCount > 3) {
        first.children[0].click()
      }
    }

    // 展开/折叠所有回答
    QsIcon.toggleAllFolding = (_, target) => {
      const root = getRoot()
      for (var i = 1, length = root.length; i < length; i += 2) {
        QsIcon.toggleFolding(_, target, root[i])
      }
    }
  }

  // 定义 ShadowDOM
  class QsIcon extends HTMLElement {
    constructor() {
      super()
      const templateElem = document.getElementById('template-qs-icon')
      const content = templateElem.content.cloneNode(true)

      const name = this.getAttribute('name')
      const flag = QsIcon.#map[name]
      var el
      for (var i = content.childElementCount - 1; i >= 0; i--) {
        const e = content.children[i]
        const eName = e.getAttribute('name')
        var includes = -1
        if (eName === name || (includes = flag?.indexOf(eName)) === 0) {
          el = e
        } else if (includes > 0) {
          e.style.display = 'none'
        } else {
          e.remove()
        }
      }
      const shadow = this.attachShadow({
        mode: 'closed'
      })
      shadow.appendChild(flag ? content : el)
      shadow.addEventListener('click', this.onClick)
    }

    onClick(e) {
      const target = e.target.viewportElement || e.target
      //            const name =target.getAttribute('name')

      QsIcon[target.parentNode.host.getAttribute('@click')]?.call(this, e, target)
    }

    static #map = {
      'qs-folding': ['chevron-down', 'chevron-up'],
    }

    static html = `
<div id="qs-navigation">
  <div>
    <qs-icon name="sync" @click="buildNavigation" title="刷新导航" style="display: none"></qs-icon>
    <button type="button" id="qs-Deepseek-Chat-Monitor" title="Deepseek Chat Monitor">🕒</button>
    <qs-icon name="deepseek-remove" @click="removeHistory" title="删除此对话"></qs-icon>
    <qs-icon name="push-chevron-up" @click="toggleAllFolding" title="折叠全部回答"></qs-icon>
    <qs-icon name="push-chevron-down" @click="toggleAllFolding" title="展开全部回答"></qs-icon>
    <qs-icon name="qs-folding" @click="toggleNavFolding" title="展开/收起导航"></qs-icon>
  </div>
  <div id="qs-container" style="display: none"></div>
</div>
<style>

  div#qs-navigation:not(.qs-Deepseek-Chat-Monitor)>div>button#qs-Deepseek-Chat-Monitor {
    display: none;
  }
  #toggle-button{
    display: none!important;
  }
  // #plugin-ui{
  //   top: 40px!important;
  // }
  /** logo **/
  div:not(.qs-collapse)>div:has(>svg:only-child[viewBox="0 0 30 30"]>path:only-child[fill="#4D6BFE"][fill-rule="nonzero"]) {
    height: 100%;
    border-radius: unset;
  }
  #qs-navigation {
    position: fixed;
    right: 48px;
    z-index: 999999;
    background: rgba(102, 204, 255, 0.3);
  }
  #qs-navigation>div:first-child {
    text-align: right;
    padding: 8px 16px 0 8px;
  }
  #qs-navigation>#qs-container {
    overflow: auto;
    width: 300px;
    max-height: 300px;
    padding: 0 8px 8px;
  }

  qs-icon {
    width: 24px;
    height: 24px;
  }

  .qs-item {
    display: block;
    padding: 0 4px 8px;
    color: #66CCFF;

    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  div.qs-collapse>div.ds-message {
    max-height: 200px;
    overflow: auto;
  }
  .qs-collapse:has(qs-icon[name$=down])>div:not(.ds-markdown,.ds-flex) {
    display: none;
  }

  .qs-collapse>div.ds-flex:last-child>div.ds-flex:nth-child(2)>:first-child[name$=up] {
    display: none;
  }
  div.ds-flex:last-child>:first-child[name$=down] {
    display: none;
  }
  .qs-collapse>div.ds-flex:last-child>:first-child[name$=down] {
    display: unset;
    border: 2px solid red;
    border-radius: 300px;
  }
//  .qs-collapse>div.ds-flex:nth-child(4)>qs-icon:first-child[name$=down],
//  div.ds-flex:nth-child(4)>div.ds-flex:nth-child(2)>qs-icon:first-child[name$=up] {
////    display: none;
//  }
//
//
//  div.ds-flex:nth-child(4)>qs-icon:first-child[name$=down], .qs-collapse>div.ds-flex:nth-child(4)>div.ds-flex:nth-child(2)>qs-icon:first-child[name$=up] {
//      display: none;
//  }
</style>
<template id="template-qs-icon">
    <svg name="deepseek-remove" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.3948 8.24785C5.89262 8.21027 6.32593 8.58498 6.36058 9.083L6.91194 17.0084V17.0423C6.91194 18.562 8.1119 19.8099 9.60009 19.8099H14.4119C15.905 19.8099 17.1001 18.563 17.1001 17.0423V17.009L17.6407 9.08428C17.6747 8.58626 18.1074 8.21098 18.6053 8.24783C19.099 8.28438 19.4706 8.71284 19.4369 9.20682L18.9 17.0774C18.8817 19.6322 16.8736 21.6849 14.4119 21.6849H9.60009C7.14544 21.6849 5.13073 19.6335 5.11207 17.0781L4.56455 9.20795C4.53019 8.71406 4.90112 8.28511 5.3948 8.24785Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21 5.75C21 6.26777 20.5803 6.6875 20.0625 6.6875H3.9375C3.41973 6.6875 3 6.26777 3 5.75C3 5.23223 3.41973 4.8125 3.9375 4.8125H20.0625C20.5803 4.8125 21 5.23223 21 5.75Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2 10.75C10.6971 10.75 11.1 11.1529 11.1 11.65L11.1 16.1C11.1 16.5971 10.6971 17 10.2 17C9.70299 17 9.30005 16.5971 9.30005 16.1L9.30005 11.65C9.30005 11.1529 9.70299 10.75 10.2 10.75Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7999 10.75C14.297 10.75 14.6999 11.1529 14.6999 11.65L14.6999 16.1C14.6999 16.5971 14.297 17 13.7999 17C13.3028 17 12.8999 16.5971 12.8999 16.1L12.8999 11.65C12.8999 11.1529 13.3028 10.75 13.7999 10.75Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.37093 2.87988C9.53733 2.5331 9.88788 2.3125 10.2725 2.3125H13.7269C14.1114 2.3125 14.462 2.53305 14.6284 2.87977L15.8048 5.33074L14.1949 6.16926L13.2436 4.1875H10.7558L9.80489 6.16916L8.19482 5.33084L9.37093 2.87988Z" fill="currentColor"></path></svg>
    
    
    <!-- https://css.gg/icon/ -->

    <svg name="chevron-down"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
        fill="currentColor"
      />
    </svg>

    <svg name="chevron-up"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
        fill="currentColor"
      />
    </svg>

    <svg name="sync"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.56079 10.6418L6.35394 3.94971L8.25402 5.84979C11.7312 3.6588 16.3814 4.07764 19.41 7.1063L17.9958 8.52052C15.7536 6.27827 12.3686 5.87519 9.71551 7.31128L11.2529 8.84869L4.56079 10.6418Z"
        fill="currentColor"
      />
      <path
        d="M19.4392 13.3581L17.646 20.0502L15.7459 18.1501C12.2688 20.3411 7.61857 19.9223 4.58991 16.8936L6.00413 15.4794C8.24638 17.7217 11.6313 18.1247 14.2844 16.6887L12.747 15.1512L19.4392 13.3581Z"
        fill="currentColor"
      />
    </svg>

    <svg name="push-chevron-up"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 16.929L6.41421 18.3432L12.0711 12.6863L17.7279 18.3432L19.1421 16.929L12.0711 9.85789L5 16.929Z"
        fill="currentColor"
      />
      <path d="M19 8H5V6H19V8Z" fill="currentColor" />
    </svg>

    <svg name="push-chevron-down"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.41421L6.41421 6L12.0711 11.6569L17.7279 6L19.1421 7.41421L12.0711 14.4853L5 7.41421Z"
        fill="currentColor"
      />
      <path d="M19 16.3432H5V18.3432H19V16.3432Z" fill="currentColor" />
    </svg>
</template>`
  }
  window.customElements.define('qs-icon', QsIcon)
})();
