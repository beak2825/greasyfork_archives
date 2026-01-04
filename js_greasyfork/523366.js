// ==UserScript==
// @name         得到提取器（简洁版）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  提取得到所有听书信息导出 json。（打造自己读书阅读网站）
// @author       qqlcx5
// @match        https://www.dedao.cn/category/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dedao.cn
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523366/%E5%BE%97%E5%88%B0%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523366/%E5%BE%97%E5%88%B0%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /**
   * 提取所有卡片的信息
   * Extracts information from all cards
   */
  function extractAllCardsInfo() {
    // 选择所有卡片的容器
    const cards = document.querySelectorAll('.source-card-container')

    if (cards.length === 0) {
      console.warn('未找到卡片信息 (No cards found)')
      return
    }

    // 存储所有卡片的信息
    const allCardsInfo = []

    cards.forEach((card) => {
      // 提取封面图片URL
      const coverImg = card.querySelector('.cover-img')
      const coverUrl = coverImg ? coverImg.src : null

      // 提取标题
      const titleElement = card.querySelector('.source-card-title')
      const title = titleElement ? titleElement.textContent.trim() : null

      // 提取副标题（介绍）
      const subtitleElement = card.querySelector('.source-card-subtitle')
      const subtitle = subtitleElement ? subtitleElement.textContent.trim() : null

      // 提取学习次数
      const learnCountElement = card.querySelector('.learn-count')
      const learnCount = learnCountElement ? learnCountElement.textContent.trim() : null

      // 提取评分
      const scoreElement = card.querySelector('.odob-score-num')
      const score = scoreElement ? scoreElement.textContent.trim() : null

      // 提取书籍数量
      const durationElement = card.querySelector('.odob-duration')
      const duration = durationElement ? durationElement.textContent.trim() : null

      // 将提取的信息存储为对象
      const cardInfo = {
        coverUrl,
        title,
        subtitle,
        learnCount,
        duration,
        score,
      }

      allCardsInfo.push(cardInfo)
    })

    // 根据 learnCount 进行排序
    allCardsInfo.sort((a, b) => {
      const aCount = parseLearnCount(a.learnCount)
      const bCount = parseLearnCount(b.learnCount)
      return bCount - aCount
    })

    console.info('提取到的所有卡片信息:', allCardsInfo)

    // 导出信息为JSON格式
    const jsonInfo = JSON.stringify(allCardsInfo, null, 2)
    console.info('导出的JSON信息:', jsonInfo)

    // 将信息复制到剪贴板
    GM_setClipboard(jsonInfo)
    notifyUser('所有卡片信息已复制到剪贴板。')
  }

  /**
   * 解析 learnCount 字符串为数字
   * Parses the learnCount string into a number
   * @param {string} learnCount - 学习次数字符串 (Learn count string)
   * @returns {number} - 解析后的数字 (Parsed number)
   */
  function parseLearnCount(learnCount) {
    if (!learnCount) return 0

    // 处理 "已学完" 和 "已听XX%" 的情况
    if (learnCount.includes('已学完')) {
      return Infinity // 已学完的卡片排在前面
    } else if (learnCount.includes('已听')) {
      const percentage = parseFloat(learnCount.match(/\d+/)[0])
      return percentage
    } else if (learnCount.includes('万次学习')) {
      const count = parseFloat(learnCount) * 10000
      return count
    } else if (learnCount.includes('次学习')) {
      const count = parseFloat(learnCount)
      return count
    }

    return 0
  }

  /**
   * 显示提示通知给用户
   * Displays a notification to the user
   * @param {string} message - 要显示的消息 (Message to display)
   */
  function notifyUser(message) {
    // 创建通知元素
    const notification = document.createElement('div')
    notification.textContent = message

    // 样式设计 (Styling)
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      backgroundColor: '#333',
      color: '#fff',
      padding: '10px 15px',
      borderRadius: '5px',
      opacity: '0',
      transition: 'opacity 0.5s',
      zIndex: '10000',
      fontSize: '13px',
    })

    document.body.appendChild(notification)

    // 触发动画
    setTimeout(() => {
      notification.style.opacity = '1'
    }, 100) // Slight delay to allow transition

    // 自动淡出和移除
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500) // 等待淡出完成
    }, 3000) // 显示3秒
  }

  /**
   * 自动滚动到页面底部
   * Automatically scrolls to the bottom of the page
   */
  function autoScrollToBottom() {
    // 监听页面内容的变化
    const observer = new MutationObserver(() => {
      // 滚动到页面底部
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth', // 平滑滚动
      })
    })

    // 配置观察选项：监听子节点的变化
    const config = {
      childList: true,
      subtree: true,
    }

    // 开始观察页面主体
    observer.observe(document.body, config)

    // 初始滚动到底部
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }

  /**
   * 初始化脚本
   * Initializes the userscript
   */
  function initializeScript() {
    // 创建一个按钮来触发信息提取
    const button = document.createElement('button')
    button.textContent = '提取所有卡片信息'

    // 样式设计 (Styling)
    Object.assign(button.style, {
      position: 'fixed',
      right: '20px',
      bottom: '100px',
      padding: '12px 20px',
      backgroundColor: '#FF4D4F',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      fontSize: '14px',
      zIndex: '10000',
      transition: 'background-color 0.3s, transform 0.3s',
    })

    // 鼠标悬停效果 (Hover Effects)
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#FF7875'
      button.style.transform = 'scale(1.05)'
    })

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#FF4D4F'
      button.style.transform = 'scale(1)'
    })

    // 点击事件 (Click Event)
    button.addEventListener('click', extractAllCardsInfo)

    // 添加按钮到页面主体 (Append button to the body)
    document.body.appendChild(button)

    console.info('卡片信息提取脚本已启用。')

    // 启动自动滚动
    autoScrollToBottom()
  }

  // 等待页面内容加载完毕后初始化脚本
  // Wait for the DOM to be fully loaded before initializing
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeScript()
  } else {
    document.addEventListener('DOMContentLoaded', initializeScript)
  }
})()