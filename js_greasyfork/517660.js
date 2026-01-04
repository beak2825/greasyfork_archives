// ==UserScript==
// @name         Follow Tools
// @namespace    https://github.com/Ocyss
// @version      2024-11-19
// @description  自动按键, 实时余额转换
// @author       Ocyss_04
// @match        https://app.follow.is/*
// @match        https://app.follow.is/power
// @icon         https://www.google.com/s2/favicons?sz=64&domain=follow.is
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/517660/Follow%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/517660/Follow%20Tools.meta.js
// ==/UserScript==

(function () {
  'use strict'

  let isRunning = false
  let intervalId = null
  let overlay = null

  // 添加遮罩层样式
  GM_addStyle(`
        .auto-active-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
            cursor: not-allowed;
            border: 2px solid transparent;
        }
        .auto-active-overlay::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 4px solid rgba(0, 255, 0, 0.6);
            animation: glow 2s infinite;
        }
        @keyframes glow {
            0% {
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.6),
                            inset 0 0 10px rgba(0, 255, 0, 0.6);
                opacity: 1;
            }
            50% {
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.9),
                            inset 0 0 20px rgba(0, 255, 0, 0.9);
                opacity: 0.5;
            }
            100% {
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.6),
                            inset 0 0 10px rgba(0, 255, 0, 0.6);
                opacity: 1;
            }
        }
    `)

  // 创建遮罩层
  function createOverlay() {
    overlay = document.createElement('div')
    overlay.className = 'auto-active-overlay'
    overlay.addEventListener('click', stopAutoActive)
    document.body.appendChild(overlay)
  }

  // 移除遮罩层
  function removeOverlay() {
    if (overlay) {
      overlay.remove()
      overlay = null
    }
  }

  // 发送向下按键
  function sendDownArrow() {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      which: 40,
      bubbles: true,
    }))
  }

  // 开始自动活跃
  function startAutoActive() {
    if (!isRunning) {
      isRunning = true
      createOverlay()
      intervalId = setInterval(sendDownArrow, 3000)
      updateMenuCommand()
    }
  }

  // 停止自动活跃
  function stopAutoActive() {
    if (isRunning) {
      isRunning = false
      clearInterval(intervalId)
      removeOverlay()
      updateMenuCommand()
    }
  }
  let menuCommandId = null
  // 更新菜单
  function updateMenuCommand() {
    if (menuCommandId) {
      GM_unregisterMenuCommand(menuCommandId)
    }
    if (isRunning) {
      menuCommandId = GM_registerMenuCommand('🔴 停止自动刷活跃', stopAutoActive)
    } else {
      menuCommandId = GM_registerMenuCommand('🟢 开始自动刷活跃', startAutoActive)
    }
  }

  // 初始注册菜单
  updateMenuCommand()

  // 价格相关功能
  const TOKEN_ADDRESS = '0xe06af68f0c9e819513a6cd083ef6848e76c28cd8'
  const API_URL = `https://api.geckoterminal.com/api/v2/simple/networks/rss3-vsl-mainnet/token_price/${TOKEN_ADDRESS}`

  let currentPrice = 0

  // 获取代币价格
  async function fetchTokenPrice() {
    const response = await fetch(API_URL, {
      headers: { accept: 'application/json' },
    })
    const data = await response.json()
    currentPrice = Number.parseFloat(data.data.attributes.token_prices[TOKEN_ADDRESS])
    return currentPrice
  }

  // 计算总价值
  function calculateTotalPrice(amount) {
    return (amount * currentPrice).toFixed(2)
  }

  // 更新UI显示价格
  function updatePriceDisplay() {
    const balanceElements = document.evaluate(
    //   `//div[text()="余额"]/following-sibling::div[1]//span[contains(@class, "tabular-nums")]`,
      `//div[text()="余额"]/../../div[1]/following-sibling::div[position()<=2]//span[contains(@class, "tabular-nums") and not (contains(text(), "Lv"))]`,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    )
    console.log({ balanceElements })
    if (balanceElements.snapshotLength > 10) {
      for (let i = 0; i < balanceElements.snapshotLength; i++) {
        const element = balanceElements.snapshotItem(i)
        const amount = Number.parseFloat(element.textContent.replace(/,/g, ''))
        const span = document.createElement('span')
        span.className = 'token-price ml-2 text-sm text-gray-500'
        span.textContent = `≈ $${calculateTotalPrice(amount)}`
        element.appendChild(span)
      }
      return true
    }
    return false
  }

  // 初始化价格显示
  async function initPriceDisplay() {
    if (window.location.pathname !== '/power') {
      return
    }
    console.log('初始化价格')
    GM_addStyle(`
        .w-\[768px\] {
            width: 865px;
        }
    `)
    try {
      await fetchTokenPrice()
      const checkInterval = setInterval(() => {
        console.log('检查价格')
        if (updatePriceDisplay()) {
          clearInterval(checkInterval)
        }
      }, 500)

      // 10秒后如果还没找到元素，就清除定时器
      setTimeout(() => clearInterval(checkInterval), 10000)
    } catch (error) {
      console.error('Failed to fetch token price:', error)
    }
  }

  // 监听路由变化
  function listenToRouteChanges() {
    const pushState = history.pushState
    history.pushState = function () {
      pushState.apply(history, arguments)
      initPriceDisplay()
    }

    window.addEventListener('popstate', initPriceDisplay)
  }

  // 初始化
  initPriceDisplay()
  listenToRouteChanges()
})()
