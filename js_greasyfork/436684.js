// ==UserScript==
// @name         QuickSearch
// @name:zh-CN   QuickSearch
// @namespace    https://github.com/zitup
// @version      1.0.3
// @description  Use '/' to quickly focus on the search input
// @description:zh-cn 按 `'/'` 键快速聚焦并滚动到搜索输入框处。
// @author       zitup
// @homepage     https://github.com/zitup/quick-search
// @include      *
// @exclude      https://www.google.com/*
// @exclude      https://www.google.com.hk/*
// @exclude      https://github.com/*
// @exclude      https://developer.mozilla.org/*
// @icon         https://www.google.com/s2/favicons?domain=w3.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436684/QuickSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/436684/QuickSearch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 监听键盘输入 '/' 搜索
  document.addEventListener('keydown', (e) => {
      if (
          e.key === '/' &&
          !e.metaKey &&
          !e.ctrlKey &&
          !["TEXTAREA", "INPUT"].includes(e.target.tagName)
      ) {
          main()
      }
  })

  function main() {
      // 选择第一个 type 为 search 或存在 autofocus 且在页面显示的
      const autofocusOrSearch = document.querySelector('input[autofocus],input[type=search]')
      if (autofocusOrSearch && isVisible(autofocusOrSearch)) {
          focusAndScrollIntoView(autofocusOrSearch)
          return
      }

      // 选择第一个 id/class 中包含[search]关键词且在页面显示的
      const idOrClassContainSearch = document.querySelectorAll('input[id*=search],input[class*=search]')
      if (idOrClassContainSearch.length) {
          const element = findInNodeList(idOrClassContainSearch)
          if (element) {
              focusAndScrollIntoView(element)
              return
          }
      }

      // 选择第一个 placeholder 中包含[search/搜索]关键词且在页面显示的
      const placeholderContainSearch = document.querySelectorAll('input[placeholder*=search],input[placeholder*=搜索]')
      if (placeholderContainSearch.length) {
          const element = findInNodeList(placeholderContainSearch)
          if (element) {
              focusAndScrollIntoView(element)
              return
          }
      }

      // 选择第一个在页面显示的
      const textInputTypes = ['hidden', 'button', 'checkbox', 'color', 'file', 'image', 'radio', 'range', 'reset', 'submit']
      const selector = textInputTypes.map(t => `[type=${t}]`).join(',')
      const firstInput = document.querySelector(`input:not(${selector})`)
      if (firstInput && isVisible(firstInput)) {
          focusAndScrollIntoView(firstInput)
          return
      }
  }

  // 判断 NodeList 中是否有可用的
  function findInNodeList(list) {
      return [].find.call(list, (item) => isVisible(item))
  }

  // 判断元素是否可见
  function isVisible(element) {
      const style = getComputedStyle(element)
      return (
          !!element.getClientRects().length &&
          style.visibility !== 'hidden' &&
          style.width !== 0 &&
          style.height !== 0 &&
          style.opacity !== 0
      )
  }

  // 聚焦元素并滚动到视野
  function focusAndScrollIntoView(element) {
      event.preventDefault();
      const pos = element.value.length;
      element.setSelectionRange(pos, pos)
      element.focus()
      window.scrollTo({top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth'});
  }
})();
