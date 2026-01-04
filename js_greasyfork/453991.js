// ==UserScript==
// @name         dblp 按条件隐藏论文
// @namespace    https://ipidkun.com
// @version      0.4
// @description  隐藏只命中作者的论文，隐藏非 CCF A、CCF B 等顶会的论文（依赖于显示会议级别的插件）
// @author       ipid
// @match        *://dblp.org/*
// @match        *://*.dblp.org/*
// @match        *://dblp.uni-trier.de/*
// @match        *://*.dblp.uni-trier.de/*
// @match        *://dblp2.uni-trier.de/*
// @match        *://*.dblp2.uni-trier.de/*
// @match        *://dblp.dagstuhl.de/*
// @match        *://*.dblp.dagstuhl.de/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453991/dblp%20%E6%8C%89%E6%9D%A1%E4%BB%B6%E9%9A%90%E8%97%8F%E8%AE%BA%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/453991/dblp%20%E6%8C%89%E6%9D%A1%E4%BB%B6%E9%9A%90%E8%97%8F%E8%AE%BA%E6%96%87.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const DEFAULT_SHOW_OPTION = false
  const OPTIONS = [
    ['CCF A', (x) => x.textContent.search(/CCF\s*A/) >= 0 ? '显示' : '弃权'],
    ['CCF B', (x) => x.textContent.search(/CCF\s*B/) >= 0 ? '显示' : '弃权'],
    ['CCF C', (x) => x.textContent.search(/CCF\s*C/) >= 0 ? '显示' : '弃权'],
    ['其它', (x) => x.textContent.search(/CCF\s*A|CCF\s*B|CCF\s*C/) < 0 ? '显示' : '弃权'],
    ['隐藏标题里没有关键词的论文', (x) => {
      const title = x.querySelector('span.title')

      // 当本规则启用时，如果标题里没有标黄，就进行一票否决，否则弃权
      //（弃权代表标题里有标黄，但是否显示要由 CCF 会议的规则决定）
      return title.querySelector('mark') == null ? '隐藏' : '弃权'
    }]
  ]

  const enabledFilterFuncs = new Set()

  function initializeEnvironment() {
    const style = document.createElement('style')
    style.textContent = String.raw`
        .ipid__opacity_transition {
          transition: opacity .4s ease-out;
        }

        .ipid__hide {
          opacity: .1;
        }

        .ipid__label {
          cursor: pointer;
          margin-right: 20px;
        }

        #ipid__filter_container {
          z-index: 1;
          padding: 20px;
          background: rgb(255 255 255);
          border-bottom: 2px #7d848a solid;
          top: 0;
          position: sticky;
          left: 29px;
          margin: -20px -20px -5px -20px;
        }
    `
    document.head.append(style)
  }

  function hideSpecificPapers() {
    if (!checkAndInsertFilter()) {
      return
    }

    const papers = document.querySelectorAll('li.entry')

    for (const paper of papers) {
      let show = DEFAULT_SHOW_OPTION

      for (const func of enabledFilterFuncs) {
        const currentVoteResult = func(paper)

        if (currentVoteResult === '显示') {
          show = true
        }
        if (currentVoteResult === '隐藏') {
          show = false

          // 一票否决
          break
        }
      }

      if (show) {
        paper.classList.remove('ipid__hide')
      } else if (!show) {
        paper.classList.add('ipid__hide')
        paper.classList.add('ipid__opacity_transition')
      }
    }
  }

  /**
   * 调用此函数可保证多选框被初始化。
   * @return {boolean} 当前是否在论文搜索页
   */
  function checkAndInsertFilter() {
    if (document.getElementById('completesearch-publs') == null) {
      return false
    }

    if (document.getElementById('ipid__filter_container') != null) {
      return true
    }

    enabledFilterFuncs.clear()

    const container = document.createElement('div')
    container.id = 'ipid__filter_container'

    for (const [filterName, filterFunc] of OPTIONS) {
      const label = document.createElement('label')
      label.classList.add('ipid__label')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = true
      enabledFilterFuncs.add(filterFunc)

      label.append(checkbox)
      label.append(document.createTextNode(filterName))

      checkbox.addEventListener('input', () => {
        if (checkbox.checked) {
          enabledFilterFuncs.add(filterFunc)
        } else {
          enabledFilterFuncs.delete(filterFunc)
        }

        hideSpecificPapers()
      })

      container.append(label)
    }

    document.querySelector('#completesearch-publs > .body').before(container)
    return true
  }

  initializeEnvironment()

  setInterval(() => {
    hideSpecificPapers()
  }, 1000)
})()