// ==UserScript==
// @name         去除知乎关键词搜索和高亮功能，以及点开评论后可以点击遮罩层关闭评论
// @namespace    tao'sSecondScript
// @version      2.3.2
// @description  展开文章的时候，再次点击，去除知乎无用的搜索和高亮功能，太傻逼了，导致我剪切后的文章总有莫名奇妙的图标和超链接
// @author       谷雨
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510112/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2%E5%92%8C%E9%AB%98%E4%BA%AE%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%BB%A5%E5%8F%8A%E7%82%B9%E5%BC%80%E8%AF%84%E8%AE%BA%E5%90%8E%E5%8F%AF%E4%BB%A5%E7%82%B9%E5%87%BB%E9%81%AE%E7%BD%A9%E5%B1%82%E5%85%B3%E9%97%AD%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/510112/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2%E5%92%8C%E9%AB%98%E4%BA%AE%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%BB%A5%E5%8F%8A%E7%82%B9%E5%BC%80%E8%AF%84%E8%AE%BA%E5%90%8E%E5%8F%AF%E4%BB%A5%E7%82%B9%E5%87%BB%E9%81%AE%E7%BD%A9%E5%B1%82%E5%85%B3%E9%97%AD%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
(function () {
  'use strict';
  // 页面滚动到顶部
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 1000)
  // 点击遮罩层关闭评论
  document.addEventListener('click', function (e) {
    const ele = e.target
    const style = getComputedStyle(ele)
    if (style.backgroundColor === 'rgba(0, 0, 0, 0.65)') {
      const svg = document.querySelector('.Zi--Close')
      if (svg) {
        e.stopPropagation()
        svg.parentElement.click();
      }
    }
  })

  // 去除搜索和高亮功能
  let move = false
  function removeHighlight(richContent) {
    const collapsedEle = richContent.classList.contains('.is-collapsed')
    if (!collapsedEle) {
      const hightlightOne = richContent.querySelector('.RichContent-EntityWord')
      if (hightlightOne && hightlightOne.style.display !== 'none') {
        const hightlight = richContent.querySelectorAll('.RichContent-EntityWord')
        hightlight.forEach(item => {
          if (item.style.display !== 'none') {
            const text = item.textContent
            item.insertAdjacentText('afterend', text)
            item.style.display = 'none'
          }
        })
      }
    }
  }

  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    }
  }

  document.addEventListener('mousemove', throttle((e) => {
    move = true
    const ele = e.target
    const parentEle = ele && ele.closest('.RichContent')
    if (parentEle && !parentEle.classList.contains('is-collapsed')) {
      removeHighlight(parentEle)
    }
  }, 1000))

  document.addEventListener('mouseover', throttle((e) => {
    move = true
    const ele = e.target
    const parentEle = ele && (ele.closest('.RichContent') || ele.closest('.Post-Main'))
    if (parentEle && !parentEle.classList.contains('is-collapsed')) {
      removeHighlight(parentEle)
    }
  }, 1000))

  document.addEventListener('click', e => {
    move = false
    const x = e.clientX
    const y = e.clientY
    setTimeout(() => {
      if (!move) {
        const ele = document.elementFromPoint(x, y)
        const parentEle = ele && (ele.closest('.List-item') || ele.closest('.Card'))
        const richContent = parentEle && parentEle.querySelector('.RichContent')
        if (richContent && !richContent.classList.contains('is-collapsed')) {
          removeHighlight(richContent)
        }
      }
    }, 1000)
  })

})();