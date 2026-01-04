// ==UserScript==
// @name         YouTube自动展开&翻译评论
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动展开并翻译YouTube评论区回复
// @author       GeekXtop
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525770/YouTube%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%BF%BB%E8%AF%91%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525770/YouTube%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%BF%BB%E8%AF%91%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const clickTimeout = 3000

  // 自动点击"展开"按钮
  const clickExpandButtons = () => {
    // 精确匹配包含"展开"文本的按钮
    document
      .querySelectorAll('tp-yt-paper-button span.more-button')
      .forEach((btn) => {
        const button = btn.closest('tp-yt-paper-button')
        if (button && btn.textContent.trim() === '展开') {
          button.click()
          console.log('已展开评论')
        }
      })
  }

  // 自动点击翻译按钮（适配新版YouTube界面）
  const clickTranslateButtons = () => {
    document
      .querySelectorAll(
        'ytd-tri-state-button-view-model.translate-button.ytd-comment-view-model'
      )
      .forEach((btn) => {
        const button = btn.querySelector('tp-yt-paper-button')
        if (button && button.textContent.includes('翻译成中文（中国）')) {
          button.click()
          console.log('已触发翻译')
          // 添加防抖处理避免重复点击
          button.style.pointerEvents = 'none'
          setTimeout(() => (button.style.pointerEvents = 'auto'), clickTimeout)
        }
      })
  }

  // 主执行函数
  const main = () => {
    setTimeout(clickExpandButtons, clickTimeout)
    setTimeout(clickTranslateButtons, clickTimeout)
  }

  // 监听DOM变化以处理动态加载的评论
  const observer = new MutationObserver(main)
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    observer.observe(commentsSection, {
      childList: true,
      subtree: true,
    });
  } else {
    console.warn('找不到评论区，MutationObserver可能无法正常工作');
  }

  // 初始执行
  main()
})()
