// ==UserScript==
// @name         DeepSeek繁忙自动点击重试（适配新版deepseek重试提醒）
// @version      1.1.1
// @namespace    http://tampermonkey.net/
// @license      MIT
// @description  DeepSeek提示繁忙，自动点击重试，并显示操作状态通知
// @author       Dingning
// @include      *://chat.deepseek.com/*
// @icon         https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/deepseek-color.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526532/DeepSeek%E7%B9%81%E5%BF%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%87%8D%E8%AF%95%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88deepseek%E9%87%8D%E8%AF%95%E6%8F%90%E9%86%92%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526532/DeepSeek%E7%B9%81%E5%BF%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%87%8D%E8%AF%95%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88deepseek%E9%87%8D%E8%AF%95%E6%8F%90%E9%86%92%EF%BC%89.meta.js
// ==/UserScript==

; (function () {
  ; ('use strict')

  // 配置参数
  let CHECK_INTERVAL = 1
  let retryDelay = 1
  let maxRetryDelay = 60
  let retryCount = 0
  let threshold = 5
  let normalDelayIncrement = 2
  let fastFrequencyDelayIncrement = 30
  let retryTimeoutId = null
  let configPanel
  let countdownTimer = null
  let remainingTime = 0
  let isMonitoring = true
  let isPanelExpanded = true

  // 添加全局样式
  const addGlobalStyles = () => {
    const style = document.createElement('style')
    style.textContent = `
          input::placeholder { color: #999!important; opacity: 1!important; }
          input { color: #333!important; }
        .toggle-btn.paused { background: #ff3b30!important; }
        .collapse-btn {
              padding: 6px 10px;
              border: none;
              border-radius: 4px;
              background: #007aff;
              color: white;
              cursor: pointer;
              font-size: 12px;
              transition: background 0.2s ease;
          }
        .collapse-btn:hover {
              background: #0063cc;
          }
      `
    document.head.appendChild(style)
  }

  function normalizePathData(pathData) {
    if (!pathData) return ''
    // 移除所有空格并将连续的命令字母分开
    return pathData
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/([A-Za-z])([A-Za-z])/g, '$1 $2')
  }

  function findPathInAllSVGs(targetPathData, findAll = false) {
    // 获取页面中所有的SVG元素
    const svgElements = document.querySelectorAll('svg')
    const matches = []

    // 遍历每个SVG元素
    for (const svg of svgElements) {
      // 获取当前SVG中的所有path元素
      const pathElements = svg.querySelectorAll('path')

      // 遍历path元素查找匹配的路径数据
      for (const path of pathElements) {
        const pathData = path.getAttribute('d')

        // 比较路径数据（忽略空格差异）
        if (normalizePathData(pathData) === normalizePathData(targetPathData)) {
          if (!findAll) {
            // 只需要第一个匹配项时立即返回
            return path
          }
          matches.push(path)
        }
      }
    }

    // 返回所有匹配项或null
    return matches.length > 0 ? matches : null
  }

  const checkAndRetry = () => {
    if (!isMonitoring) return

    const loadingElements = document.querySelectorAll('.ds-loading')
    const hasLoading = loadingElements.length > 0

    const retryBtn = null

    // 查找所有匹配的路径元素
    const allMatches = findPathInAllSVGs(
      'M12 .5C18.351.5 23.5 5.649 23.5 12S18.351 23.5 12 23.5.5 18.351.5 12 5.649.5 12 .5zm-.225 4.8a.7.7 0 0 0-.528.224.703.703 0 0 0-.213.517.84.84 0 0 0 .056.304c.037.09.087.168.146.235l.809.831a.782.782 0 0 0-.147-.01 1.112 1.112 0 0 0-.157-.012 4.69 4.69 0 0 0-2.436.673 5.26 5.26 0 0 0-1.82 1.832c-.456.763-.685 1.617-.685 2.56 0 .966.232 1.845.696 2.639A5.33 5.33 0 0 0 9.36 16.99c.779.464 1.648.697 2.606.697.95 0 1.816-.233 2.595-.697a5.326 5.326 0 0 0 1.875-1.886 5.03 5.03 0 0 0 .696-2.606.716.716 0 0 0-.247-.55.754.754 0 0 0-.55-.236.78.78 0 0 0-.573.235.731.731 0 0 0-.236.551 3.46 3.46 0 0 1-.483 1.808c-.314.539-.741.97-1.28 1.292a3.44 3.44 0 0 1-1.797.482 3.44 3.44 0 0 1-1.797-.482 3.679 3.679 0 0 1-1.291-1.292 3.521 3.521 0 0 1-.472-1.808c0-.659.158-1.258.472-1.797a3.588 3.588 0 0 1 1.29-1.28 3.44 3.44 0 0 1 1.798-.484c.164 0 .3.008.404.023l-1.111 1.112a.722.722 0 0 0-.225.528c0 .21.07.386.213.528a.718.718 0 0 0 1.033-.012l2.246-2.246a.66.66 0 0 0 .203-.527.753.753 0 0 0-.203-.54l-2.223-2.268a.847.847 0 0 0-.247-.169.62.62 0 0 0-.28-.067z',
      true
    )
    if (allMatches.length) {
      hasBusyMessage = true
      retryBtn = allMatches[0].closest('.ds-icon-button')
    }

    if (!hasLoading && !hasBusyMessage) {
      if (retryCount > 0) createNotification('已重置重试次数和重试延迟', 'success')
      retryCount = 0
      retryDelay = 1
      if (configPanel) configPanel.style.display = 'none'
    } else if (hasBusyMessage) {
      if (configPanel) {
        configPanel.style.display = 'block'
        updateStatusDisplay()
      }
    }

    if (hasBusyMessage && !retryTimeoutId) {
      startCountdown(retryDelay)

      retryTimeoutId = setTimeout(() => {

        if (retryBtn) {
          retryBtn.click()
          retryCount++
          createNotification(`已点击重试，重试次数: ${retryCount}`, 'success')

          const toastContents = document.querySelectorAll('.ds-toast__content')
          for (const toast of toastContents) {
            if (toast.textContent === '你发送消息的频率过快，请稍后再发') {
              retryDelay = Math.min(retryDelay + fastFrequencyDelayIncrement, maxRetryDelay)
              createNotification(`检测到频率过快，延迟调整为 ${retryDelay} 秒`, 'warning')
              break
            }
          }

          if (retryCount >= threshold) {
            retryDelay = Math.min(retryDelay + normalDelayIncrement, maxRetryDelay)
            createNotification(`重试次数过多，延迟调整为 ${retryDelay} 秒`, 'warning')
          }
        }

        clearTimeout(retryTimeoutId)
        retryTimeoutId = null
      }, retryDelay * 1000)
    }
  }

  // 通知系统
  const createNotificationContainer = () => {
    const container = document.createElement('div')
    container.id = 'retry-notifications'
    container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 300px;
      `
    document.body.appendChild(container)
    return container
  }

  const createNotification = (message, type = 'info') => {
    const notification = document.createElement('div')
    notification.className = `retry-notification ${type}`
    notification.style.cssText = `
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 14px;
          color: #333;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 4px solid ${{
        success: '#52c41a',
        warning: '#faad14',
        info: '#1890ff'
      }[type]
      };
      `

    const icon = document.createElement('span')
    icon.textContent = { success: '✅', warning: '⚠️', info: 'ℹ️' }[type]
    notification.appendChild(icon)

    const text = document.createElement('span')
    text.textContent = message
    notification.appendChild(text)

    const container = document.getElementById('retry-notifications') || createNotificationContainer()
    container.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateX(0)'
    }, 50)

    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // 配置面板
  const createConfigPanel = () => {
    const panel = document.createElement('div')
    panel.id = 'config-panel'
    panel.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          background: rgba(255, 255, 255, 0.95);
          color: #414158;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 300px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          display: none;
      `

    // 折叠按钮
    const collapseBtn = document.createElement('button')
    collapseBtn.textContent = isPanelExpanded ? '折叠' : '展开'
    collapseBtn.className = 'collapse-btn'
    collapseBtn.addEventListener('click', () => {
      isPanelExpanded = !isPanelExpanded
      collapseBtn.textContent = isPanelExpanded ? '折叠' : '展开'
      if (isPanelExpanded) {
        panel.style.height = 'auto'
        panel.style.padding = '20px'
        buttonContainer.style.marginTop = '10px'
        saveButton.style.display = 'block'
        panel.querySelectorAll('.config-item').forEach(item => (item.style.display = 'flex'))
      } else {
        panel.style.height = 'auto'
        panel.style.padding = '10px'
        buttonContainer.style.marginTop = '0px'
        saveButton.style.display = 'none'
        panel.querySelectorAll('.config-item').forEach(item => (item.style.display = 'none'))
      }
    })
    panel.appendChild(collapseBtn)

    // 状态显示
    const statusContainer = document.createElement('div')
    statusContainer.style.cssText = `
          background: rgba(245, 245, 247, 0.8);
          border-radius: 8px;
          padding: 12px;
          min-width: 100px;
      `

    const createStatusRow = (title, value, id) => {
      const row = document.createElement('div')
      row.style.cssText = `
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
              font-size: 13px;
          `

      const titleSpan = document.createElement('span')
      titleSpan.textContent = title
      titleSpan.style.color = '#666'

      const valueSpan = document.createElement('span')
      valueSpan.id = id
      valueSpan.textContent = value
      valueSpan.style.cssText = `
              font-weight: 500;
              color: #1a1a1a;
          `

      row.append(titleSpan, valueSpan)
      return row
    }

    statusContainer.append(
      createStatusRow('检测状态', isMonitoring ? '运行中' : '已暂停', 'monitor-status'),
      createStatusRow('当前重试次数', retryCount, 'retry-count'),
      createStatusRow('下次尝试', '等待中', 'countdown')
    )
    panel.appendChild(statusContainer)

    // 配置项
    const createInputRow = (label, value) => {
      const row = document.createElement('div')
      row.style.cssText = `
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
          `

      const labelEl = document.createElement('label')
      labelEl.textContent = label
      labelEl.style.cssText = `
              font-size: 13px;
              color: #666;
              flex: 1;
          `

      const input = document.createElement('input')
      input.type = 'number'
      input.value = value
      input.placeholder = '输入数值'
      input.style.cssText = `
              width: 80px;
              padding: 6px 8px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 13px;
              background: rgba(255, 255, 255, 0.8);
          `

      row.append(labelEl, input)
      return { row, input }
    }

    const configs = [
      { label: '检查间隔 (秒)', value: CHECK_INTERVAL, action: v => (CHECK_INTERVAL = v) },
      { label: '初始延迟 (秒)', value: retryDelay, action: v => (retryDelay = v) },
      { label: '最大延迟 (秒)', value: maxRetryDelay, action: v => (maxRetryDelay = v) },
      { label: '重试阈值', value: threshold, action: v => (threshold = v) },
      { label: '正常增量 (秒)', value: normalDelayIncrement, action: v => (normalDelayIncrement = v) },
      { label: '过快增量 (秒)', value: fastFrequencyDelayIncrement, action: v => (fastFrequencyDelayIncrement = v) }
    ]

    configs.forEach(({ label, value, action }, index) => {
      const { row, input } = createInputRow(label, value)
      row.classList.add('config-item')
      if (!isPanelExpanded) {
        row.style.display = 'none'
      }
      input.addEventListener('input', () => {
        action(parseInt(input.value) || 1)
        clearInterval(checkIntervalId)
        checkIntervalId = setInterval(checkAndRetry, CHECK_INTERVAL * 1000)
      })
      panel.appendChild(row)
    })

    // 控制按钮和保存按钮容器
    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = `
          margin-top: 10px;
          display: flex;
          gap: 10px;
      `

    const toggleBtn = document.createElement('button')
    toggleBtn.textContent = '暂停检测'
    toggleBtn.className = 'toggle-btn'
    toggleBtn.style.cssText = `
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #007aff;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
      `

    toggleBtn.addEventListener('click', () => {
      isMonitoring = !isMonitoring
      toggleBtn.textContent = isMonitoring ? '暂停检测' : '继续检测'
      toggleBtn.classList.toggle('paused', !isMonitoring)
      createNotification(isMonitoring ? '已恢复自动检测' : '已暂停自动检测', isMonitoring ? 'success' : 'warning')

      if (isMonitoring) {
        clearInterval(checkIntervalId)
        checkIntervalId = setInterval(checkAndRetry, CHECK_INTERVAL * 1000)
      } else {
        clearInterval(checkIntervalId)
        clearTimeout(retryTimeoutId)
        retryTimeoutId = null
        remainingTime = 0
      }
      updateStatusDisplay()
    })

    buttonContainer.appendChild(toggleBtn)

    // 打开配置按钮（在折叠状态下显示）
    const openConfigBtn = document.createElement('button')
    openConfigBtn.textContent = '打开配置'
    openConfigBtn.style.cssText = `
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          background: #007aff;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
      `
    openConfigBtn.addEventListener('click', () => {
      isPanelExpanded = true
      collapseBtn.textContent = '折叠'
      panel.style.height = 'auto'
      panel.style.padding = '20px'
      panel.querySelectorAll('.config-item').forEach(item => (item.style.display = 'block'))
    })

    // 保存按钮
    const saveButton = document.createElement('button')
    saveButton.textContent = '保存配置'
    saveButton.style.cssText = `
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          background: #007aff;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
      `
    saveButton.addEventListener('mouseenter', () => (saveButton.style.background = '#0063cc'))
    saveButton.addEventListener('mouseleave', () => (saveButton.style.background = '#007aff'))
    saveButton.addEventListener('click', () => createNotification('配置已保存', 'success'))

    if (isPanelExpanded) {
      buttonContainer.appendChild(saveButton)
    } else {
      buttonContainer.appendChild(openConfigBtn)
    }

    panel.appendChild(buttonContainer)

    document.body.appendChild(panel)
    return panel
  }

  // 倒计时管理
  const startCountdown = seconds => {
    clearInterval(countdownTimer)
    remainingTime = seconds
    countdownTimer = setInterval(() => {
      remainingTime = Math.max(0, remainingTime - 1)
      updateStatusDisplay()
      if (remainingTime <= 0) clearInterval(countdownTimer)
    }, 1000)
  }

  const updateStatusDisplay = () => {
    document.getElementById('countdown').textContent = remainingTime > 0 ? `${remainingTime}秒` : '等待中'
    document.getElementById('retry-count').textContent = retryCount
    document.getElementById('monitor-status').textContent = isMonitoring ? '运行中' : '已暂停'
  }

  // 初始化
  addGlobalStyles()
  let checkIntervalId = setInterval(checkAndRetry, CHECK_INTERVAL * 1000)
  configPanel = createConfigPanel()

  window.addEventListener('beforeunload', () => {
    clearInterval(checkIntervalId)
    clearInterval(countdownTimer)
  })
})()
