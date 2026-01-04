// ==UserScript==
// @name         Raptor一键反解
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键反解
// @author       chengpengfei05
// @match        https://raptor.mws.sankuai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532316/Raptor%E4%B8%80%E9%94%AE%E5%8F%8D%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/532316/Raptor%E4%B8%80%E9%94%AE%E5%8F%8D%E8%A7%A3.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 添加弹窗样式
  const style = document.createElement('style')
  style.textContent = `
    .raptor-reverse-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .raptor-reverse-modal.active {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
    }
    .raptor-reverse-content {
      position: relative;
      width: 90%;
      height: 90%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.3s ease;
    }
    .raptor-reverse-modal.active .raptor-reverse-content {
      transform: scale(1);
    }
    .raptor-reverse-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .raptor-reverse-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 1;
      transition: background-color 0.2s ease;
    }
    .raptor-reverse-close:hover {
      background: #f5f5f5;
    }
  `
  document.head.appendChild(style)

  // 创建弹窗容器
  const modal = document.createElement('div')
  modal.className = 'raptor-reverse-modal'
  modal.innerHTML = `
    <div class="raptor-reverse-content">
      <div class="raptor-reverse-close">×</div>
      <iframe class="raptor-reverse-iframe"></iframe>
    </div>
  `
  document.body.appendChild(modal)

  // 获取弹窗相关元素
  const closeBtn = modal.querySelector('.raptor-reverse-close')
  const iframe = modal.querySelector('.raptor-reverse-iframe')
  const content = modal.querySelector('.raptor-reverse-content')

  // 阻止内容区域的事件冒泡
  content.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  // 处理 iframe 的鼠标事件
  iframe.addEventListener('mouseover', () => {
    // 当鼠标在 iframe 上时，禁用底层页面的滚动
    document.body.style.overflow = 'hidden'
  })

  iframe.addEventListener('mouseout', () => {
    // 当鼠标离开 iframe 时，恢复底层页面的滚动
    document.body.style.overflow = ''
  })

  function closeModal() {
    // 先清空 iframe 的 src，避免继续加载
    iframe.src = ''
    // 恢复底层页面的滚动
    document.body.style.overflow = ''
    // 移除 active 类，触发过渡动画
    modal.classList.remove('active')
    // 动画结束后完全隐藏
    setTimeout(() => {
      modal.style.display = 'none'
    }, 300)
  }

  // 添加关闭事件
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation() // 阻止事件冒泡
    closeModal()
  })

  // 点击弹窗外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // 处理键盘事件
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active') && e.key === 'Escape') {
      closeModal()
    }
  })

  const presetsAPP = {
    'rn_mc_deal-moma-4': 'deal-moma-4',
    'rn_mc_deal-kdb': 'deal-kdb',
    'rn_mc_moma-poi-detail': 'moma-poi-detail',
    'rn_mc_moma-visit-ground': 'moma-visit-ground',
    'rn_mc_moma-visit': 'moma-visit',
    'rn_mc_moma-visit-middle-customer': 'moma-visit-middle-customer',
    'rn_mc_moma-bml-map': 'moma-bml-map',
    'rn_mc_moma-home': 'moma-home',
    'rn_mc_moma-competition-data-board': 'moma-competition-data-board',
    'rn_meishi_popcornmrn-1710-2778': 'meishi_popcornmrn-1710-2778',
    'rn_mc_merchant-dish': 'merchant-dish',
    'rn_mc_moma-dish': 'moma-dish',
    'rn_mc_dianping-dish': 'dianping-dish',
    'rn_mc_fdc-material-moma': 'fdc-material-moma',
    'rn_mc_fdc-material-kdb': 'fdc-material-kdb',
    'rn_mc_merchant-poi-info': 'merchant-poi-info',
    'rn_mc_moma-visit-warning': 'moma-visit-warning'
  }

  // Helper function to parse JSON safely
  function safeJSONParse(str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      return null
    }
  }

  // Helper function to generate URL parameters
  function generateURLParams(params) {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  // 修改 createLink 函数
  function createLink(targetElement, url, text) {
    if (!targetElement) return

    const link = document.createElement('a')
    link.href = '#'
    link.textContent = text || '点我反解🚀'
    link.style.marginLeft = '10px'
    link.style.cursor = 'pointer'

    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation() // 阻止事件冒泡
      // 显示弹窗
      modal.style.display = 'flex'
      // 触发重排，确保过渡动画生效
      void modal.offsetWidth
      modal.classList.add('active')
      // 设置 iframe src
      iframe.src = url
    })

    targetElement.appendChild(link)
  }

  // Helper function to stringify query parameters
  function stringifyQuery(obj) {
    if (!obj || typeof obj !== 'object') {
      return ''
    }

    return Object.entries(obj)
      .filter(([_, value]) => value != null) // Filter out null/undefined
      .map(([key, value]) => {
        // Handle arrays
        if (Array.isArray(value)) {
          return value
            .map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
            .join('&')
        }
        // Handle objects
        if (typeof value === 'object') {
          return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value))
        }
        // Handle primitive values
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')
  }

  function extractFileLocations(errorString) {
    try {
      // 匹配 文件名.js:行号:列号 的模式
      const regex = /[a-zA-Z0-9_-]+\.js:\d+:\d+/g
      const matches = errorString.match(regex) || []
      return matches
    } catch (error) {
      console.error('Extract file locations failed:', error)
      return []
    }
  }

  // Main function to initialize the script
  function init() {
    let jsonData
    let platform

    const appNameEle = document.querySelector('#app div.error-title div.error-title-left div.project-header > span.name')
    const appName = appNameEle ? appNameEle.textContent : ''
    const formatAppName = presetsAPP[appName]

    // Example of finding and parsing JSON content
    const jsonElement = document.querySelector('#app div.modal__content div.row__content')
    if (jsonElement) {
      jsonData = safeJSONParse(jsonElement.textContent)
    }

    // platform
    const platformElement = document.querySelector('#app div.os-img--android')
    platform = platformElement ? 'android' : 'ios'

    // Find the target element for link insertion
    const targetElements = document.querySelectorAll(
      '#app div.modal__content div.stack-con.stack-con--border > ol > li'
    )
    targetElements.forEach(targetElement => {
      if (targetElement) {
        // Example URL - replace with your actual URL
        const textContent = extractFileLocations(targetElement.textContent)
        const loc = textContent && textContent.length > 0 ? textContent[0] : ''
        if (!loc) return
        createLink(
          targetElement,
          `https://recorder.hfe.test.sankuai.com/mrn/reverse?${stringifyQuery({
            loc: loc,
            bundleVersion: jsonData.bundleVersion || '1.0.0',
            platform,
            appName,
          })}`,
          '点我反解🚀'
        )
      }
    })
  }

  // Run the script after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Re-run on dynamic content changes
  const observer = new MutationObserver(mutations => {
    // 检查变更是否包含我们关心的元素
    const shouldInit = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        return node.matches?.('div.right-modal.detail-modal') || node.matches?.('ol.source-list')
      })
    })

    if (shouldInit) {
      init()
    }
  })

  observer.observe(document.querySelector('#app div.modal__content') || document.body, {
    childList: true,
    subtree: true,
  })
})()
