// ==UserScript==
// @name         跳转 VIP 视频解析
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @license      MIT
// @description  在视频页跳转 VIP 视频解析网站
// @author       [Ares-Chang](https://github.com/Ares-Chang)
// @match        https://v.qq.com/*
// @match        https://www.mgtv.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.youku.com/*
// @match        https://v.youku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgtv.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529992/%E8%B7%B3%E8%BD%AC%20VIP%20%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/529992/%E8%B7%B3%E8%BD%AC%20VIP%20%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

/**
 * 以下代码为互联网收集，仅供学习参考，如有版权问题，请联系我删除
 */
(function() {
  'use strict';

  const list = [
    'https://jx.77flv.cc/?url=',
    'https://jx.dmflv.cc/?url=',
    'https://jx.xymp4.cc/?url=',
    'https://www.yemu.xyz/?url=',
    'https://jx.xmflv.com/?url=',
    'https://jx.7kjx.com/?url=',
    'https://www.8090.la/8090/?url=',
    'https://api.qianqi.net/vip/?url=',
    'https://jx.mmkv.cn/tv.php?url=',
    'https://jx.973973.xyz/?url=',
    'https://jx.2s0.cn/player/?url=',
    'https://jx.nnxv.cn/tv.php?url=',
  ]

  // 从本地存储加载配置
  const loadConfig = () => {
    const config = localStorage.getItem('vip-parse-config')
    if (config) {
      try {
        const parsed = JSON.parse(config)
        return {
          isDarkTheme: parsed.isDarkTheme || false,
          position: parsed.position || { right: '20px', bottom: '20px' },
          lastUsedIndex: parsed.lastUsedIndex ?? -1
        }
      } catch (e) {
        console.error('配置解析错误，使用默认配置')
      }
    }
    return {
      isDarkTheme: false,
      position: { right: '20px', bottom: '20px' },
      lastUsedIndex: -1
    }
  }

  // 保存配置到本地存储
  const saveConfig = (config) => {
    try {
      localStorage.setItem('vip-parse-config', JSON.stringify(config))
    } catch (e) {
      console.error('配置保存失败', e)
    }
  }

  const config = loadConfig()

  // 创建按钮
  const btn = document.createElement('button')
  btn.className = 'vip-parse-btn'
  btn.setAttribute('title', 'VIP视频解析')
  Object.assign(btn.style, config.position)
  document.body.appendChild(btn)

  // 创建弹窗
  const modal = document.createElement('div')
  modal.className = 'vip-parse-modal'

  // 生成解析接口列表HTML
  const generateListHTML = () => {
    // 重新排序列表，将上次使用的放在最前面
    let sortedList = [...list]
    let lastUsedHtml = ''
    let otherHtml = ''

    if (config.lastUsedIndex >= 0) {
      const lastUsed = sortedList[config.lastUsedIndex]
      lastUsedHtml = `
        <div class="vip-parse-item last-used" data-index="${config.lastUsedIndex}">
          <span class="item-name">解析接口 ${config.lastUsedIndex + 1}</span>
          <span class="last-used-badge">上次使用</span>
        </div>
      `
    }

    otherHtml = sortedList
      .map((url, index) => {
        if (index === config.lastUsedIndex) return ''
        return `
          <div class="vip-parse-item" data-index="${index}">
            <span class="item-name">解析接口 ${index + 1}</span>
          </div>
        `
      })
      .filter(Boolean)
      .join('')

    return `
      ${lastUsedHtml}
      ${lastUsedHtml && otherHtml ? '<div class="vip-parse-divider"></div>' : ''}
      ${otherHtml}
    `
  }

  // 更新弹窗内容
  const updateModalContent = () => {
    modal.innerHTML = `
      <div class="vip-parse-modal-header">
        <h3>选择解析接口</h3>
        <div class="theme-toggle">
          <span class="theme-icon">${config.isDarkTheme ? '🌜' : '🌞'}</span>
        </div>
        <div class="close-btn">✕</div>
      </div>
      <div class="vip-parse-list">
        ${generateListHTML()}
      </div>
    `
  }

  updateModalContent()
  document.body.appendChild(modal)

  // 设置初始主题
  if (config.isDarkTheme) {
    document.body.classList.add('vip-dark-theme')
  }

  // 主题切换功能
  let isDarkTheme = config.isDarkTheme
  
  modal.addEventListener('click', (e) => {
    const themeToggle = e.target.closest('.theme-toggle')
    if (themeToggle) {
      isDarkTheme = !isDarkTheme
      document.body.classList.toggle('vip-dark-theme')
      themeToggle.querySelector('.theme-icon').textContent = isDarkTheme ? '🌜' : '🌞'
      config.isDarkTheme = isDarkTheme
      saveConfig(config)
    }
  })

  // 按钮拖动功能
  let isDragging = false
  let startX, startY, startLeft, startTop
  let dragStartTime = 0
  let hasMoved = false

  const updateButtonPosition = (left, top) => {
    const rect = btn.getBoundingClientRect()
    const maxX = window.innerWidth - rect.width
    const maxY = window.innerHeight - rect.height

    // 确保按钮不会超出视窗
    const newLeft = Math.min(Math.max(0, left), maxX)
    const newTop = Math.min(Math.max(0, top), maxY)

    // 计算距离边缘的位置
    const right = window.innerWidth - newLeft - rect.width
    const bottom = window.innerHeight - newTop - rect.height

    // 更新按钮位置
    const position = {}
    if (newLeft <= maxX / 2) {
      position.left = `${newLeft}px`
      position.right = 'auto'
    } else {
      position.right = `${right}px`
      position.left = 'auto'
    }

    if (newTop <= maxY / 2) {
      position.top = `${newTop}px`
      position.bottom = 'auto'
    } else {
      position.bottom = `${bottom}px`
      position.top = 'auto'
    }

    Object.assign(btn.style, position)
    config.position = position
    saveConfig(config)
  }

  btn.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return // 只响应左键
    isDragging = true
    hasMoved = false
    dragStartTime = Date.now()
    startX = e.clientX
    startY = e.clientY
    const rect = btn.getBoundingClientRect()
    startLeft = rect.left
    startTop = rect.top
    btn.style.transition = 'none'
    btn.style.cursor = 'grabbing'
    modal.style.display = 'none' // 开始拖动时关闭弹窗

    // 防止拖动时页面选择
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'

    // 阻止事件冒泡和默认行为
    e.stopPropagation()
    e.preventDefault()
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    // 只有移动超过 5px 才认为是拖动
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true
      e.preventDefault()
      e.stopPropagation() // 阻止事件冒泡
      updateButtonPosition(startLeft + deltaX, startTop + deltaY)
    }
  }, { passive: false }) // 添加 passive: false 以确保可以调用 preventDefault

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return
    isDragging = false
    btn.style.transition = 'all 0.3s ease'
    btn.style.cursor = 'grab'
    // 移除可能的全局选择限制
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
  })

  // 添加额外的事件监听以确保能捕获到鼠标释放
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return
    isDragging = false
    btn.style.transition = 'all 0.3s ease'
    btn.style.cursor = 'grab'
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
  }, true)

  // 添加鼠标离开窗口的保护措施
  window.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false
      btn.style.transition = 'all 0.3s ease'
      btn.style.cursor = 'grab'
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  })

  // 添加失去焦点的保护措施
  window.addEventListener('blur', () => {
    if (isDragging) {
      isDragging = false
      btn.style.transition = 'all 0.3s ease'
      btn.style.cursor = 'grab'
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  })

  // 点击按钮切换弹窗显示状态
  btn.addEventListener('click', (e) => {
    // 如果有拖动行为，不触发点击
    if (hasMoved) {
      e.preventDefault()
      return
    }
    const btnRect = btn.getBoundingClientRect()
    const isVisible = window.getComputedStyle(modal).display === 'block'
    
    if (!isVisible) {
      // 根据按钮位置调整弹窗位置
      if (btnRect.left <= window.innerWidth / 2) {
        modal.style.left = `${btnRect.right + 20}px`
        modal.style.right = 'auto'
      } else {
        modal.style.right = `${window.innerWidth - btnRect.left + 20}px`
        modal.style.left = 'auto'
      }

      if (btnRect.top <= window.innerHeight / 2) {
        modal.style.top = btnRect.top + 'px'
        modal.style.bottom = 'auto'
      } else {
        modal.style.bottom = `${window.innerHeight - btnRect.bottom}px`
        modal.style.top = 'auto'
      }
    }

    modal.style.display = isVisible ? 'none' : 'block'
  })

  // 点击关闭按钮
  modal.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.close-btn')
    if (closeBtn) {
      e.stopPropagation()
      modal.style.display = 'none'
    }

    const item = e.target.closest('.vip-parse-item')
    if (item) {
      const index = parseInt(item.dataset.index)
      const parseUrl = list[index]
      const currentUrl = window.location.href
      config.lastUsedIndex = index
      saveConfig(config)
      updateModalContent() // 更新列表显示
      window.open(parseUrl + currentUrl, '_blank')
    }
  })

  // 点击页面其他区域关闭弹窗
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !btn.contains(e.target)) {
      modal.style.display = 'none'
    }
  })

  // 样式定义
  const style = document.createElement('style')
  style.textContent = `
    .vip-parse-btn {
      position: fixed;
      z-index: 9999;
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: grab;
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0;
      user-select: none;
    }
    .vip-parse-btn:active {
      cursor: grabbing;
    }
    .vip-parse-btn::before {
      content: "🎬";
      font-size: 24px;
    }
    .vip-parse-btn::after {
      content: "VIP视频解析";
      position: absolute;
      background: var(--tooltip-bg);
      color: var(--tooltip-text);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      white-space: nowrap;
      right: 60px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .vip-parse-btn:hover {
      background: var(--primary-hover);
      transform: scale(1.1);
      box-shadow: 0 4px 12px var(--shadow-color);
    }
    .vip-parse-btn:hover::after {
      opacity: 1;
      visibility: visible;
    }
    .vip-parse-modal {
      display: none;
      position: fixed;
      background: var(--modal-bg);
      border-radius: 16px;
      box-shadow: var(--modal-shadow);
      z-index: 10000;
      width: 280px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      user-select: none;
    }
    .vip-parse-modal * {
      user-select: none;
    }
    .vip-parse-modal-header {
      padding: 16px;
      background: var(--header-bg);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .vip-parse-modal-header h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 16px;
      font-weight: 600;
      flex: 1;
    }
    .theme-toggle {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 8px;
      background: var(--toggle-bg);
      transition: all 0.3s ease;
    }
    .theme-toggle:hover {
      background: var(--toggle-hover);
    }
    .theme-icon {
      font-size: 18px;
    }
    .vip-parse-modal .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      color: var(--text-color);
      border-radius: 8px;
      background: var(--close-bg);
      transition: all 0.2s ease;
    }
    .vip-parse-modal .close-btn:hover {
      background: var(--close-hover);
      transform: rotate(90deg);
    }
    .vip-parse-list {
      max-height: 360px;
      overflow-y: auto;
      padding: 12px;
    }
    .vip-parse-divider {
      height: 1px;
      background: var(--border-color);
      margin: 12px 0;
      opacity: 0.6;
    }
    .vip-parse-list::-webkit-scrollbar {
      width: 6px;
    }
    .vip-parse-list::-webkit-scrollbar-thumb {
      background: var(--scroll-thumb);
      border-radius: 3px;
    }
    .vip-parse-list::-webkit-scrollbar-track {
      background: var(--scroll-track);
    }
    .vip-parse-item {
      padding: 12px 16px;
      background: var(--item-bg);
      color: var(--text-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      margin-bottom: 8px;
      border: 1px solid var(--item-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .vip-parse-item:last-child {
      margin-bottom: 0;
    }
    .vip-parse-item:hover {
      background: var(--item-hover);
      transform: translateX(4px);
    }
    .vip-parse-item.last-used {
      background: var(--last-used-bg);
      border-color: var(--last-used-border);
      margin-bottom: 0;
    }
    .last-used-badge {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--badge-bg);
      color: var(--badge-text);
    }

    /* 亮色主题 */
    :root {
      --primary-color: #3B82F6;
      --primary-hover: #2563EB;
      --modal-bg: #FFFFFF;
      --header-bg: #F8FAFC;
      --text-color: #1E293B;
      --border-color: #E2E8F0;
      --item-bg: #F1F5F9;
      --item-hover: #E2E8F0;
      --item-border: #E2E8F0;
      --close-bg: #F1F5F9;
      --close-hover: #E2E8F0;
      --toggle-bg: #F1F5F9;
      --toggle-hover: #E2E8F0;
      --scroll-thumb: #CBD5E1;
      --scroll-track: #F1F5F9;
      --tooltip-bg: #1E293B;
      --tooltip-text: #FFFFFF;
      --shadow-color: rgba(59, 130, 246, 0.3);
      --modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      --last-used-bg: #EFF6FF;
      --last-used-border: #93C5FD;
      --badge-bg: #3B82F6;
      --badge-text: #FFFFFF;
    }

    /* 暗色主题 */
    .vip-dark-theme .vip-parse-modal {
      --modal-bg: #1E293B;
      --header-bg: #0F172A;
      --text-color: #F1F5F9;
      --border-color: #334155;
      --item-bg: #334155;
      --item-hover: #475569;
      --item-border: #475569;
      --close-bg: #334155;
      --close-hover: #475569;
      --toggle-bg: #334155;
      --toggle-hover: #475569;
      --scroll-thumb: #475569;
      --scroll-track: #334155;
      --tooltip-bg: #F1F5F9;
      --tooltip-text: #1E293B;
      --shadow-color: rgba(59, 130, 246, 0.5);
      --modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      --last-used-bg: #1E40AF;
      --last-used-border: #3B82F6;
      --badge-bg: #60A5FA;
      --badge-text: #1E293B;
    }

    /* 添加全局样式覆盖 */
    .vip-parse-btn {
      pointer-events: auto !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    .vip-parse-btn * {
      pointer-events: none !important;
    }
    .vip-parse-modal {
      pointer-events: auto !important;
    }
  `
  document.head.appendChild(style)

  // 添加样式重置
  const resetStyle = document.createElement('style')
  resetStyle.textContent = `
    .mgtv-player-wrap * {
      pointer-events: auto !important;
    }
  `
  document.head.appendChild(resetStyle)
})();