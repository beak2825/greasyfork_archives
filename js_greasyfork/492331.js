// ==UserScript==
// @name         98手机网页版搜索助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  98手机网页版搜索助手..
// @author       bbbyqq
// @match        *://*/search.php?mod=forum*
// @match        *://*/home.php?mod=space*
// @grant        GM_addStyle
// @license      bbbyqq
// @downloadURL https://update.greasyfork.org/scripts/492331/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492331/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const excludes = {
    description: '排除关键词',
    keywords: [
      '求',
      '约定',
      'SHA1'
    ]
  }

  let excludesWrapper = document.createElement('div')
  excludesWrapper.className = 'excludes-wrapper'
  excludesWrapper.innerHTML = `<span>${excludes.description}：</span>`
  document.querySelector('#searchform')?.append(excludesWrapper)
  document.querySelector('.threadlist')?.prepend(excludesWrapper)

  // 从浏览器缓存中获取勾选状态
  let checkedList = JSON.parse(localStorage.getItem('checkedList')) || []
  removeSearchResult()

  excludes.keywords.forEach(item => {
    var excludes = document.querySelector('.excludes-wrapper')
    var label = document.createElement('label')
    label.className = 'excludes-item'
    label.innerHTML = `<input type="checkbox" value="${item}" ${checkedList.some(val => item === val) ? 'checked' : ''}/>${item}`
    excludes.appendChild(label)
  })

  let css = `
        .excludes-wrapper {
          font-size: 20px;
          display: flex;
          align-items: center;
          font-weight: 700;
          flex-wrap: wrap;
        }
        .excludes-item {
          margin-right: 10px;
        }
        .excludes-item input {
          margin-right: 5px;
        }
      `
  GM_addStyle(css)

  removeNodes()

  // 删除重复元素
  function removeNodes() {
    const wrapperNodeList = document.querySelectorAll('.excludes-wrapper');
    if (wrapperNodeList.length > 1) {
      for (let i = 1; i < wrapperNodeList.length; i++) {
        wrapperNodeList[i].parentNode.removeChild(wrapperNodeList[i])
      }
    }
  }

  // 监听勾选状态
  document.querySelectorAll('.excludes-item input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked
      const checkedValue = e.target.value
      if (isChecked) {
        checkedList.push(checkedValue)
      } else {
        checkedList = checkedList.filter(val => val !== checkedValue)
      }
      // 数组去重
      checkedList = Array.from(new Set(checkedList))
      // 浏览器缓存保存勾选状态
      localStorage.setItem('checkedList', JSON.stringify(checkedList))
      removeSearchResult()
    })
  })

  // 隐藏拥有关键词的元素
  function removeSearchResult() {
    const searchList = document.querySelectorAll('.threadlist ul li')
    searchList.forEach(item => {
      if (checkedList.some(val => item.innerHTML.toLowerCase().includes(val.toLowerCase()))) {
        item.style.display = 'none'
      } else {
        item.style.removeProperty('display')
      }
    })
  }
})()
