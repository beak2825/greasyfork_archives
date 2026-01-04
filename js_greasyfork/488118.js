// ==UserScript==
// @name        QQ阅读打印
// @namespace   Violentmonkey Scripts
// @match       https://book.qq.com/book-read/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/2/22 23:54:51
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488118/QQ%E9%98%85%E8%AF%BB%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/488118/QQ%E9%98%85%E8%AF%BB%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  // 添加保存按钮
  let buttonDiv = document.createElement('div')
  document.body.appendChild(buttonDiv)
  var saveButton = document.createElement('button')
  saveButton.textContent = '打印'
  saveButton.style.position = 'fixed'
  saveButton.style.top = '20px'
  saveButton.style.right = '20px'
  saveButton.style.zIndex = '9999'
  buttonDiv.appendChild(saveButton)

  // 点击按钮时将文章保存为PDF
  saveButton.addEventListener('click', function () {
    // 查找当前页面中 id 为 "article" 的元素
    var currentArticle = document.getElementById('article')

    if (!currentArticle) {
      console.log('No article found on the page.')
      return
    }

    // 移除当前 article 下的所有子元素
    while (currentArticle.firstChild) {
      currentArticle.removeChild(currentArticle.firstChild)
    }

    // 创建虚拟 iframe 元素
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none' // 将 iframe 隐藏起来，不影响用户界面

    // 将虚拟 iframe 添加到页面中
    document.body.appendChild(iframe)

    var currentPage = 1 // 当前加载的页数
    var nextPageURL

    function loadPage(pageNum) {
      console.log('第' + pageNum + '页')
      // 更新 iframe 的 src 属性以加载新页面
      nextPageURL = window.location.href.replace(/\d+$/, pageNum)
      iframe.src = nextPageURL
      // 更新按钮文本显示当前加载的页数
      saveButton.textContent = '加载第' + pageNum + '页...'
    }

    // 当 iframe 载入完成后执行回调函数
    iframe.onload = function () {
      // 获取 iframe 中 id 为 "article" 的子元素
      var iframeArticle = iframe.contentDocument.getElementById('article')

      if (iframeArticle) {
        // 将 iframeArticle 的子元素添加到当前页面的 "article" 元素下
        while (iframeArticle.firstChild) {
          currentArticle.appendChild(iframeArticle.firstChild)
        }

        // 打印换页
        currentArticle.lastElementChild.style.pageBreakAfter = 'always';

        // 检查是否重定向
        if (iframe.contentDocument.readyState === 'complete' && iframe.contentWindow.location.href !== nextPageURL) {
          console.log('Reached end of pages or redirected.')
          // 将 currentArticle 添加为 body 的第一个子元素
          document.body.insertBefore(currentArticle, document.body.firstChild)

          // 移除 body 后的所有 div 元素
          var nextSibling = currentArticle.nextSibling
          while (nextSibling) {
            var siblingToRemove = nextSibling
            nextSibling = siblingToRemove.nextSibling
            if (siblingToRemove.tagName === 'DIV') {
              siblingToRemove.parentNode.removeChild(siblingToRemove)
            }
          }

          // 调用 window 的打印功能
          window.print()
          return
        }

        // 继续加载下一页
        currentPage++
        loadPage(currentPage)
      } else {
        console.log("No 'article' found inside the iframe.")
        // 调用 window 的打印功能，只打印 article 元素的内容
        window.print(currentArticle.innerHTML)
      }
    }

    // 从第1页开始加载
    loadPage(currentPage)
  })
})()
