// ==UserScript==
// @name FC2ppvdb Enhanced Search
// @namespace http://tampermonkey.net/
// @version 1.3
// @description 增强在 `fc2ppvdb.com` 网站上的浏览和搜索
// @author ErrorRua
// @match https://fc2ppvdb.com/*
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// @grant GM_saveTab
// @grant GM_download
// @connect bt4gprx.com
// @connect localhost
// @connect *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536016/FC2ppvdb%20Enhanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/536016/FC2ppvdb%20Enhanced%20Search.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // 请求重试相关常量
  const BT4G_REQUEST_DELAY_MS = 1000 // 直接请求BT4G时的间隔
  const PROXY_BT4G_REQUEST_DELAY_MS = 0 // 通过代理请求BT4G时的间隔

  // 主队列重试逻辑常量
  const MAX_FC2_ITEM_RETRIES = 3 // FC2项目最大重试次数
  const FC2_ITEM_RETRY_DELAY_MS = 5000 // 主队列中项目重试的延迟时间

  // 调试相关变量和配置
  const DEBUG_MODE = GM_getValue("DEBUG_MODE", false) // 默认关闭调试模式
  const DEBUG_LOG_MAX = GM_getValue("DEBUG_LOG_MAX", 500) // 日志最大条数
  let debugLogs = [] // 日志内存缓存

  const MAX_CONSECUTIVE_REQUEST_ERRORS = 5 // 最大连续请求错误次数
  let consecutiveRequestErrors = 0 // 当前连续请求错误次数
  let isScriptEnabled = true // 控制脚本是否继续运行的标志

  // 添加停止脚本的函数
  function stopScript() {
    isScriptEnabled = false
    consecutiveRequestErrors = 0
    observer.disconnect() // 断开观察器
    fc2ItemsToProcessQueue.clear() // 清空处理队列
    debugLog("脚本已停止：观察器已断开，处理队列已清空", "SCRIPT_STOPPED")
  }

  // 添加代理服务器配置
  const DEFAULT_PROXY_SERVER_URL = "http://localhost:15000" // 默认本地地址
  const PROXY_SERVER_URL = GM_getValue(
    "PROXY_SERVER_URL",
    DEFAULT_PROXY_SERVER_URL
  )
  let useProxy = GM_getValue("USE_PROXY", true) // 默认使用代理
  let batchSubmitEnabled = GM_getValue("BATCH_SUBMIT_ENABLED", false) // 默认关闭批量提交

  // 测试代理服务器连接并返回Promise
  function testProxyServerConnection(url) {
    return new Promise((resolve, reject) => {
      const testUrl = `${url}/health`
      debugLog(`测试代理服务器: ${testUrl}`, "PROXY_TEST")

      GM_xmlhttpRequest({
        method: "GET",
        url: testUrl,
        timeout: 5000,
        onload: function (response) {
          if (response.status === 200) {
            try {
              const result = JSON.parse(response.responseText)
              if (result.status === "ok") {
                debugLog("代理服务器测试成功", "PROXY_TEST_SUCCESS")
                resolve(true)
              } else {
                debugLog(
                  `代理服务器测试异常响应: ${response.responseText}`,
                  "PROXY_TEST_FAIL"
                )
                reject(new Error("代理服务器响应异常"))
              }
            } catch (e) {
              debugLog(`代理服务器测试解析错误: ${e.message}`, "PROXY_TEST_ERROR")
              reject(new Error("代理服务器响应格式错误"))
            }
          } else {
            debugLog(
              `代理服务器测试失败: HTTP ${response.status}`,
              "PROXY_TEST_FAIL"
            )
            reject(new Error(`代理服务器连接失败，HTTP状态码: ${response.status}`))
          }
        },
        onerror: function (error) {
          debugLog(
            `代理服务器测试错误: ${error.error || "未知错误"}`,
            "PROXY_TEST_ERROR"
          )
          reject(new Error(`代理服务器连接错误: ${error.error || "未知错误"}`))
        },
        ontimeout: function () {
          debugLog("代理服务器测试超时", "PROXY_TEST_TIMEOUT")
          reject(new Error("代理服务器连接超时"))
        },
      })
    })
  }

  // 初始化函数
  async function initializeScript() {
    if (useProxy) {
      try {
        await testProxyServerConnection(PROXY_SERVER_URL)
        debugLog("代理服务器连接成功，继续执行脚本", "INIT_SUCCESS")
        // 继续执行脚本的其他初始化操作
        startDomObserver()
        debouncedScanAndEnqueueFc2Items()
      } catch (error) {
        debugLog(`代理服务器连接失败: ${error.message}`, "INIT_FAIL")
        alert(`代理服务器连接失败: ${error.message}\n脚本已停止运行。`)
        stopScript()
        return
      }
    } else {
      // 如果不使用代理，直接继续执行
      debugLog("不使用代理模式，直接执行脚本", "INIT_DIRECT")
      startDomObserver()
      debouncedScanAndEnqueueFc2Items()
    }
  }

  // 启动脚本
  initializeScript()

  // 防抖函数
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // 调试日志函数
  function debugLog(message, type = "INFO") {
    if (!DEBUG_MODE) return

    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}][${type}] ${message}`

    // 输出到控制台
    console.log(logEntry)
    GM_log(logEntry)

    // 添加到日志缓存
    debugLogs.push(logEntry)
    if (debugLogs.length > DEBUG_LOG_MAX) {
      debugLogs.shift() // 超出最大条数时删除最旧的日志
    }

    // 将日志保存到本地存储
    GM_setValue("FC2_DEBUG_LOGS", debugLogs)
  }

  // 配置代理服务器
  function configureProxyServer() {
    const currentUrl = GM_getValue("PROXY_SERVER_URL", DEFAULT_PROXY_SERVER_URL)
    const newUrl = prompt("请输入代理服务器地址:", currentUrl)
    if (newUrl !== null && newUrl.trim() !== "") {
      GM_setValue("PROXY_SERVER_URL", newUrl.trim())
      alert(`代理服务器地址已更新为: ${newUrl.trim()}`)
      // 可选：测试新的代理服务器
      testProxyServer(newUrl.trim())
    }
  }

  // 测试代理服务器连接
  function testProxyServer(url) {
    const testUrl = `${url}/health`
    debugLog(`测试代理服务器: ${testUrl}`, "PROXY_TEST")

    GM_xmlhttpRequest({
      method: "GET",
      url: testUrl,
      timeout: 5000,
      onload: function (response) {
        if (response.status === 200) {
          try {
            const result = JSON.parse(response.responseText)
            if (result.status === "ok") {
              alert("代理服务器连接成功!")
              debugLog("代理服务器测试成功", "PROXY_TEST_SUCCESS")
            } else {
              alert("代理服务器响应异常，请检查配置。")
              debugLog(
                `代理服务器测试异常响应: ${response.responseText}`,
                "PROXY_TEST_FAIL"
              )
            }
          } catch (e) {
            alert("代理服务器响应格式错误。")
            debugLog(`代理服务器测试解析错误: ${e.message}`, "PROXY_TEST_ERROR")
          }
        } else {
          alert(`代理服务器连接失败，HTTP状态码: ${response.status}`)
          debugLog(
            `代理服务器测试失败: HTTP ${response.status}`,
            "PROXY_TEST_FAIL"
          )
        }
      },
      onerror: function (error) {
        alert(`代理服务器连接错误: ${error.error || "未知错误"}`)
        debugLog(
          `代理服务器测试错误: ${error.error || "未知错误"}`,
          "PROXY_TEST_ERROR"
        )
      },
      ontimeout: function () {
        alert("代理服务器连接超时。")
        debugLog("代理服务器测试超时", "PROXY_TEST_TIMEOUT")
      },
    })
  }

  // 清除调试日志
  function clearDebugLogs() {
    debugLogs = []
    GM_setValue("FC2_DEBUG_LOGS", debugLogs)
    debugLog("日志已清除", "SYSTEM")
  }

  // 切换调试模式
  function toggleDebugMode() {
    const newMode = !DEBUG_MODE
    GM_setValue("DEBUG_MODE", newMode)
    alert(`调试模式已${newMode ? "开启" : "关闭"}`)
    location.reload() // 重新加载页面应用新设置
  }
  // 导出日志到剪贴板
  function exportLogsToClipboard() {
    const logs = GM_getValue("FC2_DEBUG_LOGS", [])
    if (logs.length === 0) {
      alert("没有可导出的日志")
      return
    }

    const logsText = logs.join("\n")
    navigator.clipboard
      .writeText(logsText)
      .then(() => {
        alert(`已复制 ${logs.length} 条日志到剪贴板`)
      })
      .catch((err) => {
        alert(`复制失败: ${err}`)
        console.error("复制失败:", err)
      })
  }

  // 导出日志到文件
  function exportLogsToFile() {
    const logs = GM_getValue("FC2_DEBUG_LOGS", [])
    if (logs.length === 0) {
      alert("没有可导出的日志")
      return
    }

    const logsText = debugLogs.join("\n")
    const blob = new Blob([logsText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .split("Z")[0]
    const filename = `fc2_debug_logs_${timestamp}.txt`

    // 尝试使用GM_download (Tampermonkey API)
    try {
      if (typeof GM_download === "function") {
        GM_download({
          url: url,
          name: filename,
          saveAs: true,
          onload: () => {
            debugLog(`日志文件已保存: ${filename}`, "EXPORT")
            URL.revokeObjectURL(url)
          },
          onerror: (error) => {
            debugLog(
              `保存日志文件失败: ${
                error.error || error.statusText || "未知错误"
              }`,
              "ERROR"
            )
            URL.revokeObjectURL(url)
            // 如果GM_download失败，回退到创建下载链接的方法
            createDownloadLink(url, filename)
          },
        })
        return
      }
    } catch (e) {
      console.error("GM_download 不可用:", e)
    }

    // 回退方法：创建下载链接
    createDownloadLink(url, filename)
  }

  // 创建下载链接的辅助函数
  function createDownloadLink(url, filename) {
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = filename
    downloadLink.style.display = "none"
    document.body.appendChild(downloadLink)

    downloadLink.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
    }, 100)

    debugLog(`日志文件已导出: ${filename}`, "EXPORT")
  }

  // 本地缓存键名和过期时间（毫秒）
  const SEARCH_RESULT_CACHE_KEY = "fc2_bt4g_cache"
  const CACHE_EXPIRATION_MS = 12 * 60 * 60 * 1000 // 12小时
  // 读取本地缓存
  function loadSearchResultCache() {
    try {
      const rawCache = localStorage.getItem(SEARCH_RESULT_CACHE_KEY)
      debugLog(
        `读取本地缓存: ${
          rawCache ? rawCache.substring(0, 100) + "..." : "无缓存"
        }`,
        "CACHE"
      )
      if (!rawCache) return {}
      const cacheData = JSON.parse(rawCache)
      // 清理过期
      const now = Date.now()
      let expiredCount = 0
      Object.keys(cacheData).forEach((key) => {
        if (
          !cacheData[key] ||
          !cacheData[key].timestamp ||
          now - cacheData[key].timestamp > CACHE_EXPIRATION_MS
        ) {
          delete cacheData[key]
          expiredCount++
        }
      })
      if (expiredCount > 0) {
        debugLog(`清理了 ${expiredCount} 个过期缓存项`, "CACHE")
      }
      return cacheData
    } catch (err) {
      debugLog(`读取缓存出错: ${err.message}`, "ERROR")
      return {}
    }
  }

  // 保存本地缓存
  function saveSearchResultCache(cache) {
    try {
      localStorage.setItem(SEARCH_RESULT_CACHE_KEY, JSON.stringify(cache))
      // debugLog(`保存缓存: ${Object.keys(cache).length} 个项目`, "CACHE") // 此日志过于频繁，注释掉
    } catch (err) {
      debugLog(`保存缓存出错: ${err.message}`, "ERROR")
    }
  }

  // 通过ID删除缓存的函数
  function removeSearchResultCacheById(fc2Id) {
    if (typeof fc2Id !== "string" && typeof fc2Id !== "number") {
      console.error("removeSearchResultCacheById: fc2Id 必须是字符串或数字")
      debugLog("removeSearchResultCacheById: fc2Id 必须是字符串或数字", "ERROR")
      return
    }
    const idStr = String(fc2Id)
    if (searchResultsCache[idStr]) {
      delete searchResultsCache[idStr]
      saveSearchResultCache(searchResultsCache)
      console.log(`缓存已删除: ${idStr}`)
      debugLog(`缓存已删除: ${idStr}`, "CACHE_MANAGE")
    } else {
      console.log(`未找到缓存: ${idStr}`)
      debugLog(`未找到缓存: ${idStr}`, "CACHE_MANAGE")
    }
  }

  // 搜索结果缓存，避免重复请求
  let searchResultsCache = loadSearchResultCache()

  // 添加样式
  const style = document.createElement("style")
  style.textContent = `
        .fc2-id-container {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            line-height: inherit;
            z-index: 10;
        }
        .search-buttons {
            display: none;
            position: absolute;
            top: 100%;  /* 放在编号元素下方 */
            left: 0;    /* 左对齐 */
            z-index: 1000;
            background: #1f2937;
            border-radius: 4px;
            padding: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            white-space: nowrap;
            margin-top: 2px; /* 添加一点间距 */
        }
        .search-buttons::before {
            content: '';
            position: absolute;
            top: -15px;  /* 创建检测区域 */
            left: 0;
            right: 0;
            height: 15px;  /* 增加检测高度 */
        }
        .fc2-id-container:hover .search-buttons.has-results,
        .search-buttons.has-results:hover {
            display: flex;
            gap: 4px;
        }
        .search-button {
            padding: 2px 8px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            transition: background 0.2s;
            white-space: nowrap;
        }
        .bt4g-button {
            background: #3b82f6;
        }
        .missav-button {
            background: #dc2626;
        }
        .preview-button {
            background: #10b981;
        }
        .search-button:hover {
            filter: brightness(1.1);
        }
        .fc2-id-container > span {
            display: inline-block;
            position: relative;
        }
        .search-status {
            position: absolute;
            top: 100%;
            left: 0;
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
            background: rgba(31, 41, 55, 0.9);
            padding: 2px 4px;
            border-radius: 3px;
            white-space: nowrap;
        }
        .loading {
            color: #f59e0b;
        }
        .success {
            color: #10b981;
        }
        .error {
            color: #ef4444;
        }

        /* 调试模式指示器 */
        .debug-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #22c55e;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .debug-indicator .status-dot {
            width: 8px;
            height: 8px;
            background-color: #22c55e;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
        }

        /* 预览对话框样式 */
        .preview-dialog {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1f2937;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 95vw;
            max-height: 90vh;
            overflow: auto;
            width: 1200px;
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #1f2937;
        }
        .preview-dialog::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .preview-dialog::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 4px;
        }
        .preview-dialog::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
        }
        .preview-dialog::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
        }
        .preview-dialog.active {
            display: block;
        }
        .preview-dialog-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
        }
        .preview-dialog-overlay.active {
            display: block;
        }
        .preview-dialog-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        }
        .preview-dialog-content {
            margin-top: 20px;
        }
        .preview-dialog-content img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
        }
        .preview-dialog-content video {
            max-width: 100%;
            margin-bottom: 10px;
        }
    `
  document.head.appendChild(style)
  // 创建调试状态指示器
  function createDebugIndicator() {
    if (!DEBUG_MODE) return

    // 更新样式以支持新的功能
    const indicatorStyle = document.createElement("style")
    indicatorStyle.textContent = `
      .debug-indicator {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #22c55e;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      .debug-indicator .status-dot {
        width: 8px;
        height: 8px;
        background-color: #22c55e;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      .debug-menu {
        position: absolute;
        bottom: 100%;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 4px;
        /* margin-bottom: 5px; */ /* 移除此行以消除间隙 */
        min-width: 120px;
        display: none;
        flex-direction: column;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      }
      .debug-indicator:hover .debug-menu {
        display: flex;
      }
      .debug-menu-item {
        padding: 6px 12px;
        color: white;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 12px;
      }
      .debug-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .debug-menu-item:last-child {
        border-bottom: none;
      }
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `
    document.head.appendChild(indicatorStyle)

    const indicator = document.createElement("div")
    indicator.className = "debug-indicator"

    const statusDot = document.createElement("span")
    statusDot.className = "status-dot"

    const text = document.createElement("span")
    const count = debugLogs.length
    text.textContent = `调试模式 (${count})`

    // 创建菜单
    const menu = document.createElement("div")
    menu.className = "debug-menu"

    // 添加菜单项
    const menuItems = [
      { text: "导出到剪贴板", action: exportLogsToClipboard },
      { text: "导出到文件", action: exportLogsToFile },
      { text: "清除日志", action: clearDebugLogs },
      { text: "关闭调试模式", action: toggleDebugMode },
    ]

    menuItems.forEach((item) => {
      const menuItem = document.createElement("div")
      menuItem.className = "debug-menu-item"
      menuItem.textContent = item.text
      menuItem.addEventListener("click", (e) => {
        e.stopPropagation()
        item.action()
      })
      menu.appendChild(menuItem)
    })

    indicator.appendChild(statusDot)
    indicator.appendChild(text)
    indicator.appendChild(menu)

    // 点击显示日志条数
    indicator.addEventListener("click", () => {
      const count = debugLogs.length
      text.textContent = `调试模式 (${count})`
    })

    document.body.appendChild(indicator)
    debugLog("调试状态指示器已创建", "UI")

    // 定期更新日志计数
    setInterval(() => {
      const count = debugLogs.length
      text.textContent = `调试模式 (${count})`
    }, 5000)
  }

  // 初始化调试指示器
  setTimeout(createDebugIndicator, 1000)

  // 切换是否使用代理
  function toggleUseProxy() {
    useProxy = !useProxy
    GM_setValue("USE_PROXY", useProxy)
    alert(`通过代理请求BT4G已${useProxy ? "开启" : "关闭"}`)
    // 可能需要重新加载或清除缓存以使更改立即生效
    searchResultsCache = {} // 清空缓存，以便重新检查
    saveSearchResultCache(searchResultsCache)
    fc2ItemsProcessed.clear() // 清除已处理记录，强制重新扫描
    // 重新扫描并处理页面上的项目
    scanAndEnqueueFc2Items()
    triggerFc2ItemsProcessing()
  }

  const fc2ItemRetryAttempts = new Map() // 记录FC2 ID的重试次数 (fc2Id -> attemptCount)

  // 通过代理服务器检查BT4G是否有搜索结果
  function checkBT4GAvailability(fc2Id) {
    // 首先检查脚本是否已禁用
    if (!isScriptEnabled) {
      debugLog("脚本已停止运行", "SCRIPT_DISABLED")
      return Promise.resolve({ status: "SCRIPT_DISABLED" })
    }

    // 首先检查缓存
    if (searchResultsCache[fc2Id] !== undefined) {
      debugLog(
        `BT4G缓存命中: ${fc2Id}, 结果: ${searchResultsCache[fc2Id].result}`,
        "BT4G_CACHE_HIT"
      )
      return Promise.resolve({
        status: searchResultsCache[fc2Id].result ? "SUCCESS" : "NOT_FOUND",
      })
    }

    // 使用代理服务器而非直接请求BT4G
    const proxyUrl = `${PROXY_SERVER_URL}/check_bt4g/${encodeURIComponent(
      fc2Id
    )}`

    return new Promise((resolve) => {
      if (!useProxy) {
        // 如果不使用代理，则直接请求 BT4G
        debugLog(`直接请求BT4G: ${fc2Id}`, "BT4G_DIRECT_REQUEST")
        const searchUrl = `https://bt4gprx.com/search/${encodeURIComponent(
          fc2Id
        )}`
        GM_xmlhttpRequest({
          method: "GET",
          url: searchUrl,
          onload: function (response) {
            if (response.status === 200) {
              debugLog(`BT4G响应: ${fc2Id}, 状态: 200. 分析内容中...`, "BT4G")
              consecutiveRequestErrors = 0 // 成功响应，重置错误计数器
              try {
                const parser = new DOMParser()
                const doc = parser.parseFromString(
                  response.responseText,
                  "text/html"
                )
                if (doc.querySelector(".list-group")) {
                  debugLog(
                    `BT4G分析: ${fc2Id}, 找到 .list-group. 视为有结果。`,
                    "BT4G_SUCCESS"
                  )
                  resolve({ status: "SUCCESS" })
                } else {
                  debugLog(
                    `BT4G分析: ${fc2Id}, 状态200但未找到.list-group，将由主队列重试`,
                    "BT4G_NO_RESULT_RETRY"
                  )
                  resolve({ status: "RETRY_MAIN_QUEUE" })
                }
              } catch (e) {
                debugLog(
                  `BT4G响应解析错误: ${fc2Id}, ${e.message}. 视为无结果。`,
                  "ERROR"
                )
                resolve({ status: "FAILED" })
              }
            } else if (response.status === 404) {
              debugLog(
                `BT4G响应: ${fc2Id}, 状态: 404. 视为无结果 (目标未找到)。`,
                "BT4G_NOT_FOUND"
              )
              consecutiveRequestErrors = 0 // 404是预期内的"未找到"，重置错误计数器
              resolve({ status: "NOT_FOUND" })
            } else {
              debugLog(
                `BT4G响应: ${fc2Id}, 状态: ${response.status}. 视为无结果。`,
                "BT4G_FAIL"
              )
              consecutiveRequestErrors++
              if (consecutiveRequestErrors >= MAX_CONSECUTIVE_REQUEST_ERRORS) {
                alert("BT4G请求连续多次失败，脚本已停止运行。请检查网络连接或BT4G服务状态(被暂时封禁)。")
                stopScript()
              }
              resolve({ status: "FAILED" })
            }
          },
          onerror: function (error) {
            debugLog(
              `BT4G请求错误: ${fc2Id}, ${error.error || "未知错误"}`,
              "ERROR"
            )
            consecutiveRequestErrors++
            if (consecutiveRequestErrors >= MAX_CONSECUTIVE_REQUEST_ERRORS) {
              alert("BT4G请求连续多次失败，脚本已停止运行。请检查网络连接或BT4G服务状态(被暂时封禁)。")
              stopScript()
            }
            resolve({ status: "FAILED" })
          },
        })
        return
      }

      debugLog(`请求代理服务器: ${proxyUrl}`, "PROXY_REQUEST")
      GM_xmlhttpRequest({
        method: "GET",
        url: proxyUrl,
        onload: function (response) {
          if (response.status === 200) {
            try {
              const result = JSON.parse(response.responseText)
              debugLog(`代理响应: ${fc2Id}, 状态: ${result.status}`, "PROXY")
              consecutiveRequestErrors = 0 // 成功响应，重置错误计数器

              if (result.status === "success") {
                if (result.has_results) {
                  debugLog(`代理分析: ${fc2Id}, 有资源。`, "PROXY_SUCCESS")
                  resolve({ status: "SUCCESS" })
                } else {
                  debugLog(`代理分析: ${fc2Id}, 无资源。`, "PROXY_NO_RESULT")
                  resolve({ status: "RETRY_MAIN_QUEUE" })
                }
              } else if (result.status === "not_found") {
                debugLog(
                  `代理响应: ${fc2Id}, 状态: not_found。视为无资源。`,
                  "PROXY_NOT_FOUND"
                )
                resolve({ status: "NOT_FOUND" })
              } else {
                debugLog(
                  `代理响应错误: ${fc2Id}, ${result.message || "未知错误"}`,
                  "ERROR"
                )
                resolve({ status: "RETRY_MAIN_QUEUE" })
              }
            } catch (e) {
              debugLog(`代理响应解析错误: ${fc2Id}, ${e.message}`, "ERROR")
              resolve({ status: "RETRY_MAIN_QUEUE" })
            }
          } else {
            debugLog(
              `代理请求失败: ${fc2Id}, HTTP状态: ${response.status}`,
              "PROXY_FAIL"
            )
            consecutiveRequestErrors++
            if (consecutiveRequestErrors >= MAX_CONSECUTIVE_REQUEST_ERRORS) {
              alert("代理请求连续多次失败，脚本已停止运行。请检查代理服务器配置或BT4G服务状态(被暂时封禁)。")
              stopScript()
            }
            resolve({ status: "RETRY_MAIN_QUEUE" })
          }
        },
        onerror: function (error) {
          debugLog(
            `代理请求错误: ${fc2Id}, ${error.error || "未知错误"}`,
            "ERROR"
          )
          consecutiveRequestErrors++
          if (consecutiveRequestErrors >= MAX_CONSECUTIVE_REQUEST_ERRORS) {
            alert("代理请求连续多次失败，脚本已停止运行。请检查代理服务器配置或BT4G服务状态(被暂时封禁)。")
            stopScript()
          }
          resolve({ status: "FAILED" })
        },
      })
    })
  }

  // 添加已处理ID记录集合
  const fc2ItemsProcessed = new Set()

  // ====== FC2项目主处理队列及状态 ======
  const fc2ItemsToProcessQueue = new Set()
  let isProcessingFc2ItemsQueue = false

  // 处理单个FC2项目及其DOM元素
  async function processSingleFc2Item(fc2Id, itemElement) {
    debugLog(`开始处理单个FC2项目: ${fc2Id}`, "FC2_ITEM_PROCESS")

    // 确保容器存在或创建它
    let itemContainer = itemElement.parentElement.classList.contains(
      "fc2-id-container"
    )
      ? itemElement.parentElement
      : null
    let searchButtonsContainer
    let statusDisplaySpan

    if (!itemContainer) {
      const originalStyle = window.getComputedStyle(itemElement)
      itemContainer = document.createElement("div")
      itemContainer.className = "fc2-id-container"
      const topValue = originalStyle.top === "auto" ? "0px" : originalStyle.top
      const leftValue =
        originalStyle.left === "auto" ? "0px" : originalStyle.left

      itemContainer.style.cssText = `
              position: absolute;
              top: ${topValue};
              left: ${leftValue};
              z-index: 10;
          `
      const parent = itemElement.parentNode
      if (parent) {
        parent.style.position = "relative"
        parent.insertBefore(itemContainer, itemElement)
        itemContainer.appendChild(itemElement)
      } else {
        debugLog(`FC2项目 ${fc2Id} 没有父节点，无法插入容器`, "ERROR")
        return "FAILED" // 返回状态
      }

      searchButtonsContainer = document.createElement("div")
      searchButtonsContainer.className = "search-buttons"

      statusDisplaySpan = document.createElement("span")
      statusDisplaySpan.className = "search-status loading"
      statusDisplaySpan.textContent = "检查中..."
      itemContainer.appendChild(statusDisplaySpan)

      const bt4gSearchButton = document.createElement("button")
      bt4gSearchButton.className = "search-button bt4g-button"
      bt4gSearchButton.textContent = "BT4G"
      bt4gSearchButton.onclick = (e) => {
        e.stopPropagation()
        GM_openInTab(`https://bt4gprx.com/search/${fc2Id}`, { active: true })
      }

      const missavSearchButton = document.createElement("button")
      missavSearchButton.className = "search-button missav-button"
      missavSearchButton.textContent = "Missav"
      missavSearchButton.onclick = (e) => {
        e.stopPropagation()
        GM_openInTab(`https://missav.ws/cn/search/${fc2Id}`, { active: true })
      }

      const previewButton = document.createElement("button")
      previewButton.className = "search-button preview-button"
      previewButton.textContent = "预览"
      previewButton.onclick = (e) => {
        e.stopPropagation()
        showPreview(fc2Id)
      }

      searchButtonsContainer.appendChild(bt4gSearchButton)
      searchButtonsContainer.appendChild(missavSearchButton)
      searchButtonsContainer.appendChild(previewButton)
      itemContainer.appendChild(searchButtonsContainer)

      itemContainer.addEventListener("mouseenter", () => {
        if (searchButtonsContainer.classList.contains("has-results")) {
          searchButtonsContainer.style.display = "flex"
        }
      })
      itemContainer.addEventListener("mouseleave", () => {
        searchButtonsContainer.style.display = "none"
      })
    } else {
      searchButtonsContainer = itemContainer.querySelector(".search-buttons")
      statusDisplaySpan = itemContainer.querySelector(".search-status")
      if (statusDisplaySpan) {
        // 重置状态以便重新检查
        statusDisplaySpan.className = "search-status loading"
        statusDisplaySpan.textContent = "检查中..."
        statusDisplaySpan.style.display = "block"
      }
    }

    const bt4gCheckResult = await checkBT4GAvailability(fc2Id)
    const status = bt4gCheckResult.status

    if (status === "SUCCESS") {
      searchResultsCache[fc2Id] = { result: true, timestamp: Date.now() }
      saveSearchResultCache(searchResultsCache)
      if (searchButtonsContainer)
        searchButtonsContainer.classList.add("has-results")
      if (statusDisplaySpan) {
        statusDisplaySpan.className = "search-status success"
        statusDisplaySpan.textContent = "有资源"
        setTimeout(() => {
          if (statusDisplaySpan) statusDisplaySpan.style.display = "none"
        }, 2000)
      }
      itemElement.dataset.processed = "true" // 标记为已完全处理
      fc2ItemsProcessed.add(fc2Id) // 添加到已处理集合
    } else if (status === "NOT_FOUND") {
      searchResultsCache[fc2Id] = { result: false, timestamp: Date.now() }
      saveSearchResultCache(searchResultsCache)
      if (searchButtonsContainer)
        searchButtonsContainer.classList.remove("has-results")
      if (statusDisplaySpan) {
        statusDisplaySpan.className = "search-status error"
        statusDisplaySpan.textContent = "无资源"
        statusDisplaySpan.style.display = "block"
      }
      itemElement.dataset.processed = "true" // 标记为已完全处理 (即使没有结果)
      fc2ItemsProcessed.add(fc2Id)
    } else if (status === "RETRY_MAIN_QUEUE") {
      if (statusDisplaySpan) {
        statusDisplaySpan.className = "search-status loading" // 或特定的"重试中"样式
        statusDisplaySpan.textContent = "等待重试..."
        statusDisplaySpan.style.display = "block"
      }
      // 不标记为已处理，不缓存
    } else if (status === "FAILED") {
      if (statusDisplaySpan) {
        statusDisplaySpan.className = "search-status error"
        statusDisplaySpan.textContent = "检查失败"
        statusDisplaySpan.style.display = "block"
      }
      // 不标记为已处理，不缓存 (允许将来手动或自动重试)
    }

    debugLog(
      `完成处理单个FC2项目: ${fc2Id}，状态: ${status}`,
      "FC2_ITEM_PROCESS_DONE"
    )
    return status // 返回状态给主队列处理器
  }

  // 处理FC2项目队列
  async function processFc2ItemsQueue() {
    if (!isScriptEnabled) {
      debugLog("脚本已停止运行，不再处理队列", "SCRIPT_DISABLED")
      return
    }
    
    if (isProcessingFc2ItemsQueue && fc2ItemsToProcessQueue.size === 0) {
      isProcessingFc2ItemsQueue = false
      debugLog("FC2项目处理队列在处理中变为空", "FC2_QUEUE_EMPTY_MID_PROCESS")
      return
    }
    if (fc2ItemsToProcessQueue.size === 0) {
      debugLog("FC2项目处理队列为空，无需处理", "FC2_QUEUE_EMPTY")
      isProcessingFc2ItemsQueue = false
      return
    }
    if (isProcessingFc2ItemsQueue) {
      debugLog(
        "FC2项目队列已在处理中，跳过本次触发",
        "FC2_QUEUE_BUSY_SKIP_TRIGGER"
      )
      return
    }

    isProcessingFc2ItemsQueue = true
    debugLog(
      `开始处理FC2项目队列，共${fc2ItemsToProcessQueue.size}项`,
      "FC2_QUEUE_START"
    )

    // 如果启用了批量提交功能，使用批量处理
    if (batchSubmitEnabled && useProxy) {
      const fc2Ids = Array.from(fc2ItemsToProcessQueue)
      debugLog(`批量提交队列中的 ${fc2Ids.length} 个FC2编号`, "BATCH_SUBMIT_START")

      // 分离需要批量处理和已缓存的编号
      const uncachedIds = []
      const cachedResults = new Map()

      fc2Ids.forEach(fc2Id => {
        if (searchResultsCache[fc2Id] !== undefined) {
          cachedResults.set(fc2Id, searchResultsCache[fc2Id])
          fc2ItemsToProcessQueue.delete(fc2Id)
        } else {
          uncachedIds.push(fc2Id)
        }
      })

      // 处理已缓存的编号
      if (cachedResults.size > 0) {
        debugLog(`从缓存中处理 ${cachedResults.size} 个编号`, "BATCH_CACHE_PROCESS")
        for (const [fc2Id, cacheData] of cachedResults) {
          const itemElement = Array.from(document.querySelectorAll("div.relative span.top-0"))
            .find(el => el.textContent.trim() === fc2Id)
          if (itemElement) {
            processSingleFc2Item(fc2Id, itemElement)
          }
        }
      }

      // 如果有未缓存的编号，进行批量处理
      if (uncachedIds.length > 0) {
        debugLog(`批量处理 ${uncachedIds.length} 个未缓存的编号`, "BATCH_PROCESS_UNCACHED")
        try {
          const response = await fetch(`${PROXY_SERVER_URL}/check_batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fc2_ids: uncachedIds })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          
          if (result.status === 'success') {
            let successCount = 0
            let notFoundCount = 0
            let errorCount = 0

            result.results.forEach(item => {
              // 从队列中移除已处理的编号
              fc2ItemsToProcessQueue.delete(item.fc2_id)

              if (item.status === 'success' && item.has_results) {
                successCount++
                searchResultsCache[item.fc2_id] = { result: true, timestamp: Date.now() }
                // 更新UI显示
                const itemElement = Array.from(document.querySelectorAll("div.relative span.top-0"))
                  .find(el => el.textContent.trim() === item.fc2_id)
                if (itemElement) {
                  processSingleFc2Item(item.fc2_id, itemElement)
                }
              } else if (item.status === 'not_found') {
                notFoundCount++
                searchResultsCache[item.fc2_id] = { result: false, timestamp: Date.now() }
                // 更新UI显示
                const itemElement = Array.from(document.querySelectorAll("div.relative span.top-0"))
                  .find(el => el.textContent.trim() === item.fc2_id)
                if (itemElement) {
                  processSingleFc2Item(item.fc2_id, itemElement)
                }
              } else {
                errorCount++
                // 对于错误的情况，将编号重新加入队列
                fc2ItemsToProcessQueue.add(item.fc2_id)
              }
            })

            saveSearchResultCache(searchResultsCache)
            debugLog(`批量提交完成: ${successCount}个有资源, ${notFoundCount}个无资源, ${errorCount}个错误`, "BATCH_SUBMIT_DONE")
            
            // 如果还有错误项，触发队列处理
            if (errorCount > 0) {
              triggerFc2ItemsProcessing()
            }
          } else {
            throw new Error(result.message || '未知错误')
          }
        } catch (error) {
          debugLog(`批量提交失败: ${error.message}`, "BATCH_SUBMIT_ERROR")
          // 批量提交失败时，回退到单个处理
          processFc2ItemsIndividually()
        }
      } else {
        debugLog("所有编号都已缓存，无需批量处理", "BATCH_ALL_CACHED")
      }
    } else {
      // 使用原有的单个处理逻辑
      processFc2ItemsIndividually()
    }

    isProcessingFc2ItemsQueue = false
    debugLog("FC2项目队列当前批次处理完成", "FC2_QUEUE_BATCH_DONE")
    
    // 检查是否仍有项目
    if (fc2ItemsToProcessQueue.size > 0) {
      debugLog(
        "FC2队列批处理后仍有项目，触发下一次处理",
        "FC2_QUEUE_TRIGGER_POST_BATCH"
      )
      triggerFc2ItemsProcessing()
    }
  }

  // 单个处理FC2项目的函数
  async function processFc2ItemsIndividually() {
    const idsToProcessThisBatch = Array.from(fc2ItemsToProcessQueue)

    for (const fc2Id of idsToProcessThisBatch) {
      fc2ItemsToProcessQueue.delete(fc2Id)
      debugLog(
        `从FC2队列取出: ${fc2Id}，处理后队列剩余: ${fc2ItemsToProcessQueue.size}`,
        "FC2_QUEUE_PROCESS"
      )

      const itemElement = Array.from(
        document.querySelectorAll("div.relative span.top-0")
      ).find(
        (el) =>
          el.textContent.trim() === fc2Id &&
          !el.dataset.processed &&
          !fc2ItemsProcessed.has(fc2Id) &&
          !(
            el.parentElement &&
            el.parentElement.classList.contains("fc2-id-container") &&
            el.dataset.processed === "true"
          )
      )

      if (!itemElement) {
        debugLog(
          `未找到FC2 ID ${fc2Id} 对应的DOM元素或已被永久处理，跳过`,
          "FC2_QUEUE_SKIP_NO_ELEMENT"
        )
        fc2ItemRetryAttempts.delete(fc2Id)
        continue
      }

      if (
        fc2ItemsProcessed.has(fc2Id) &&
        itemElement.dataset.processed === "true"
      ) {
        debugLog(
          `FC2 ID ${fc2Id} 已被处理 (循环内检查)，跳过`,
          "FC2_QUEUE_SKIP_PROCESSED"
        )
        fc2ItemRetryAttempts.delete(fc2Id)
        continue
      }

      const isCached = searchResultsCache[fc2Id] !== undefined
      const itemStatus = await processSingleFc2Item(fc2Id, itemElement)

      if (itemStatus === "RETRY_MAIN_QUEUE") {
        let attempts = fc2ItemRetryAttempts.get(fc2Id) || 0
        attempts++
        if (attempts <= MAX_FC2_ITEM_RETRIES) {
          fc2ItemRetryAttempts.set(fc2Id, attempts)
          debugLog(
            `FC2 ID ${fc2Id} 将在 ${FC2_ITEM_RETRY_DELAY_MS}ms 后重试 (尝试 ${attempts}/${MAX_FC2_ITEM_RETRIES})`,
            "FC2_QUEUE_RETRY_SCHEDULE"
          )
          setTimeout(() => {
            const currentElement = Array.from(
              document.querySelectorAll("div.relative span.top-0")
            ).find((el) => el.textContent.trim() === fc2Id)

            if (
              currentElement &&
              !fc2ItemsProcessed.has(fc2Id) &&
              currentElement.dataset.processed !== "true"
            ) {
              fc2ItemsToProcessQueue.add(fc2Id)
              debugLog(
                `FC2 ID ${fc2Id} 已重新加入队列进行重试`,
                "FC2_QUEUE_RETRY_ADD"
              )
              triggerFc2ItemsProcessing()
            } else {
              debugLog(
                `FC2 ID ${fc2Id} 在重试前已被处理或消失，取消重试`,
                "FC2_QUEUE_RETRY_CANCEL"
              )
              fc2ItemRetryAttempts.delete(fc2Id)
            }
          }, FC2_ITEM_RETRY_DELAY_MS)
        } else {
          debugLog(
            `FC2 ID ${fc2Id} 达到最大重试次数 (${MAX_FC2_ITEM_RETRIES})，标记为无资源`,
            "FC2_QUEUE_MAX_RETRIES"
          )
          fc2ItemRetryAttempts.delete(fc2Id)
          if (
            itemElement.parentElement &&
            itemElement.parentElement.classList.contains("fc2-id-container")
          ) {
            const statusSpan =
              itemElement.parentElement.querySelector(".search-status")
            if (statusSpan) {
              statusSpan.className = "search-status error"
              statusSpan.textContent = "重试失败"
              statusSpan.style.display = "block"
            }
          }
          searchResultsCache[fc2Id] = { result: false, timestamp: Date.now() }
          saveSearchResultCache(searchResultsCache)
          itemElement.dataset.processed = "true"
          fc2ItemsProcessed.add(fc2Id)
        }
      } else if (
        itemStatus === "SUCCESS" ||
        itemStatus === "NOT_FOUND" ||
        itemStatus === "FAILED"
      ) {
        fc2ItemRetryAttempts.delete(fc2Id)
        if (itemStatus === "FAILED" && !fc2ItemsProcessed.has(fc2Id)) {
          itemElement.dataset.processed = "true"
          fc2ItemsProcessed.add(fc2Id)
          debugLog(
            `FC2 ID ${fc2Id} 处理失败且不重试，标记为已处理`,
            "FC2_PROCESS_FAILED_FINAL"
          )
        }
      }

      const willBeRetriedViaTimeout =
        itemStatus === "RETRY_MAIN_QUEUE" &&
        (fc2ItemRetryAttempts.get(fc2Id) || 0) < MAX_FC2_ITEM_RETRIES

      const currentDelay = useProxy
        ? PROXY_BT4G_REQUEST_DELAY_MS
        : BT4G_REQUEST_DELAY_MS

      if (
        !isCached &&
        !willBeRetriedViaTimeout &&
        idsToProcessThisBatch.indexOf(fc2Id) < idsToProcessThisBatch.length - 1
      ) {
        debugLog(
          `[FC2 队列延迟] ID ${fc2Id} (未缓存, ${
            useProxy ? "代理" : "直连"
          }) 已处理。在处理下一项前延迟 ${currentDelay}ms。`,
          "FC2_DELAY"
        )
        await new Promise((resolve) => setTimeout(resolve, currentDelay))
      } else if (
        isCached &&
        !willBeRetriedViaTimeout &&
        idsToProcessThisBatch.indexOf(fc2Id) < idsToProcessThisBatch.length - 1
      ) {
        debugLog(
          `[FC2 队列缓存] ID ${fc2Id} (已缓存) 已处理。最小/无延迟。`,
          "FC2_DELAY_SKIP"
        )
      }
    }
  }

  function triggerFc2ItemsProcessing() {
    if (fc2ItemsToProcessQueue.size > 0 && !isProcessingFc2ItemsQueue) {
      debugLog("触发FC2项目队列处理", "FC2_QUEUE_TRIGGER")
      processFc2ItemsQueue()
    } else {
      if (isProcessingFc2ItemsQueue) {
        debugLog("FC2项目队列正在处理中，本次不启动新批次", "FC2_QUEUE_BUSY")
      }
      if (fc2ItemsToProcessQueue.size === 0) {
        debugLog("FC2项目队列为空，不启动处理", "FC2_QUEUE_EMPTY")
      }
    }
  }

  // DOM扫描与入队函数
  function scanAndEnqueueFc2Items() {
    if (!isScriptEnabled) {
      debugLog("脚本已停止运行，不再扫描新项目", "SCRIPT_DISABLED")
      return 0
    }

    const fc2IdElementSelector = "div.relative span.top-0"
    const fc2IdElements = document.querySelectorAll(fc2IdElementSelector)
    let newItemsEnqueuedCount = 0

    for (const element of fc2IdElements) {
      if (element.dataset.processed) continue
      if (
        element.parentElement &&
        element.parentElement.classList.contains("fc2-id-container")
      )
        continue

      const fc2IdText = element.textContent.trim()
      if (!/^\d+$/.test(fc2IdText)) continue

      if (fc2ItemsProcessed.has(fc2IdText)) {
        if (!element.dataset.processed) {
          element.dataset.processed = "true"
          debugLog(
            `标记已在fc2ItemsProcessed中的元素 ${fc2IdText} 为 processed`,
            "SCAN_ENQUEUE_MARK_PROCESSED"
          )
        }
        continue
      }

      if (!fc2ItemsToProcessQueue.has(fc2IdText)) {
        fc2ItemsToProcessQueue.add(fc2IdText)
        newItemsEnqueuedCount++
        debugLog(
          `FC2 ID ${fc2IdText} 加入处理队列，当前队列长度: ${fc2ItemsToProcessQueue.size}`,
          "SCAN_ENQUEUE_ADD"
        )
      }
    }

    if (newItemsEnqueuedCount > 0) {
      debugLog(
        `扫描完成，${newItemsEnqueuedCount} 个新FC2 ID加入队列`,
        "SCAN_ENQUEUE_DONE"
      )
      triggerFc2ItemsProcessing()
    } else if (fc2IdElements.length > 0) {
      // debugLog("扫描完成，未发现新的未处理FC2 ID", "SCAN_ENQUEUE_IDLE") // 此日志过于频繁，注释掉
    }
    return newItemsEnqueuedCount
  }

  // 强制刷新当前页面所有FC2编号的BT4G搜索（忽略缓存）
  function forceRefreshAllFc2Items() {
    debugLog("强制刷新所有FC2项目的BT4G搜索", "ACTION_FORCE_REFRESH")
    const fc2IdElementSelector = "div.relative span.top-0"
    const fc2IdElements = document.querySelectorAll(fc2IdElementSelector)
    debugLog(`找到 ${fc2IdElements.length} 个FC2元素需要刷新`, "REFRESH_START")

    let clearedCacheCount = 0
    fc2ItemRetryAttempts.clear() // 清空FC2项目重试计数
    debugLog("强制刷新：清空FC2项目重试计数", "REFRESH_CLEAR_RETRIES")
    fc2IdElements.forEach((element) => {
      const fc2IdText = element.textContent.trim()
      if (!/^\d+$/.test(fc2IdText)) return
      delete searchResultsCache[fc2IdText]
      clearedCacheCount++
      debugLog(`清除缓存: ${fc2IdText}`, "CACHE_CLEAR")
    })

    saveSearchResultCache(searchResultsCache)
    debugLog(`已清除 ${clearedCacheCount} 个缓存项`, "CACHE_CLEAR_DONE")

    let restoredElementsCount = 0
    fc2IdElements.forEach((element) => {
      if (
        element.parentElement &&
        element.parentElement.classList.contains("fc2-id-container")
      ) {
        const container = element.parentElement
        const parent = container.parentElement
        parent.replaceChild(element, container)
        restoredElementsCount++
      }
      element.removeAttribute("data-processed")

      const fc2IdText = element.textContent.trim()
      if (/^\d+$/.test(fc2IdText)) {
        fc2ItemsProcessed.delete(fc2IdText)
      }
    })

    debugLog(`已恢复 ${restoredElementsCount} 个元素原始结构`, "DOM_RESTORE")
    debouncedScanAndEnqueueFc2Items()
  }

  // 切换批量提交功能
  function toggleBatchSubmit() {
    batchSubmitEnabled = !batchSubmitEnabled
    GM_setValue("BATCH_SUBMIT_ENABLED", batchSubmitEnabled)
    alert(`批量提交功能已${batchSubmitEnabled ? "开启" : "关闭"}`)
  }

  // 注册菜单命令
  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("强制刷新BT4G搜索", forceRefreshAllFc2Items)
    GM_registerMenuCommand("配置代理服务器", configureProxyServer)
    GM_registerMenuCommand("切换调试模式", toggleDebugMode)
    GM_registerMenuCommand("清除调试日志", clearDebugLogs)
    GM_registerMenuCommand("导出日志到剪贴板", exportLogsToClipboard)
    GM_registerMenuCommand("导出日志到文件", exportLogsToFile)
    GM_registerMenuCommand(
      `切换代理状态 (当前: ${useProxy ? "使用代理" : "直连BT4G"})`,
      toggleUseProxy
    )
    GM_registerMenuCommand(
      `切换批量提交 (当前: ${batchSubmitEnabled ? "开启" : "关闭"})`,
      toggleBatchSubmit
    )
  }

  const debouncedScanAndEnqueueFc2Items = debounce(() => {
    debugLog(
      "DOM变动或强制刷新触发 (debounced)，开始扫描并入队FC2项目",
      "OBSERVER_SCAN_TRIGGER"
    )
    scanAndEnqueueFc2Items()
  }, 500)

  let observingBody = false // 跟踪是否正在观察document.body

  // MutationObserver配置
  const observer = new MutationObserver(mutationCallbackLogic)

  // MutationObserver的回调逻辑
  function mutationCallbackLogic(mutationsList, currentObserverInstance) {
    let isRelevantChangeDetected = false

    for (const mutation of mutationsList) {
      const target = mutation.target

      // 过滤器 1: 忽略在已处理容器内部发生的更改。
      // 这应该是初始设置后由脚本自身引起的更改的最常见情况。
      if (
        target.nodeType === Node.ELEMENT_NODE &&
        target.closest(".fc2-id-container")
      ) {
        // debugLog(`观察器: 忽略 .fc2-id-container 内部的变动。目标: ${target.tagName}, 类型: ${mutation.type}`, "OBSERVER_IGNORE_INTERNAL");
        continue // 忽略此变动，检查下一个
      }

      // 过滤器 2: 忽略脚本在FC2 ID元素上设置 'data-processed' 属性。
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-processed" &&
        target.nodeType === Node.ELEMENT_NODE &&
        target.matches("div.relative span.top-0") // FC2 ID 元素的选择器
      ) {
        // debugLog(`观察器: 忽略 'data-processed' 属性更改。目标: ${target.tagName}`, "OBSERVER_IGNORE_DATA_PROCESSED");
        continue // 忽略此变动
      }

      if (mutation.type === "childList") {
        // 过滤器 3: 忽略主容器的添加。
        const addedNodes = Array.from(mutation.addedNodes)
        if (
          addedNodes.some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList?.contains("fc2-id-container")
          )
        ) {
          // debugLog(`观察器: 忽略 .fc2-id-container 的添加。`, "OBSERVER_IGNORE_ADD_CONTAINER");
          continue // 忽略此变动
        }

        // 过滤器 4: 忽略我们刚刚标记为 'data-processed' 的FC2 ID span的移除 (可能是我们移动了它)。
        const removedNodes = Array.from(mutation.removedNodes)
        if (
          removedNodes.some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node.matches("div.relative span.top-0") && // 是一个FC2 ID元素
              node.dataset.processed === "true" // 并且我们已经标记了它
          )
        ) {
          // debugLog(`观察器: 忽略一个 'data-processed' FC2 ID span 的移除 (可能正在被移动)。`, "OBSERVER_IGNORE_MOVE");
          continue // 忽略此变动
        }
      }

      // 如果以上过滤器都没有捕获到变动，则认为它是相关的。
      // debugLog(`观察器: 检测到相关变动。类型: ${mutation.type}, 目标: ${target.nodeName || 'text_node'}, 属性: ${mutation.attributeName || ''}`, "OBSERVER_RELEVANT_MUTATION");
      isRelevantChangeDetected = true
      break // 一个相关的变动就足够了
    }

    // 将观察器从 body 切换到 #writer-articles 的逻辑
    if (observingBody) {
      const targetContainer = document.getElementById("writer-articles")
      if (targetContainer) {
        debugLog(
          `检测到目标容器 writer-articles 出现，重新配置观察器`,
          "OBSERVER"
        )
        currentObserverInstance.disconnect() // 停止观察 document.body
        // 使用相同的观察器实例观察新目标
        observer.observe(targetContainer, {
          childList: true,
          subtree: true,
        })
        observingBody = false
        isRelevantChangeDetected = true // 主容器的出现是一个相关事件
      }
    }

    if (isRelevantChangeDetected) {
      // debugLog("观察器: 由于相关更改，调用 debouncedScanAndEnqueueFc2Items。", "OBSERVER_TRIGGER_SCAN");
      debouncedScanAndEnqueueFc2Items()
    } else {
      // debugLog("观察器: 过滤变动后未检测到相关更改。", "OBSERVER_NO_RELEVANT_CHANGES");
    }
  }

  // 启动观察器函数
  function startDomObserver() {
    const targetContainer = document.getElementById("writer-articles")
    if (targetContainer) {
      debugLog(`找到目标容器writer-articles，开始观察`, "OBSERVER_START_TARGET")
      observer.observe(targetContainer, {
        childList: true,
        subtree: true,
      })
      observingBody = false
    } else {
      debugLog(
        `未找到目标容器writer-articles，将观察整个 body`,
        "OBSERVER_START_BODY"
      )
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
      observingBody = true
    }
  }
  // 启动观察器
  debugLog(`启动DOM观察器`, "INIT_OBSERVER")
  startDomObserver()
  // 初始调用
  debouncedScanAndEnqueueFc2Items()

  // 处理搜索页面跳转
  if (window.location.pathname === "/search") {
    debugLog(`检测到搜索页面`, "PAGE_SEARCH_DETECTED")
    const searchParams = new URLSearchParams(window.location.search)
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      debugLog(`搜索关键词: ${searchQuery}`, "PAGE_SEARCH_QUERY")
      checkBT4GAvailability(searchQuery).then((result) => {
        // result is an object {status: "..."}
        debugLog(
          `搜索关键词 ${searchQuery} 检查结果: ${
            result.status === "SUCCESS" ? "有资源" : "无资源或检查失败" // 更准确的日志
          }`,
          "PAGE_SEARCH_RESULT"
        )
        if (result.status === "SUCCESS") {
          const bt4gSearchUrl = `https://bt4gprx.com/search/${encodeURIComponent(
            searchQuery
          )}`
          debugLog(`自动跳转到: ${bt4gSearchUrl}`, "PAGE_SEARCH_REDIRECT")
          GM_openInTab(bt4gSearchUrl, { active: true })
        }
      })
      return // 结束脚本执行，因为已在搜索页面处理
    }
  }

  // 将需要从控制台调用的函数暴露到window对象
  if (DEBUG_MODE) {
    const targetWindow =
      typeof unsafeWindow !== "undefined" ? unsafeWindow : window
    targetWindow.fc2EnhancedSearch = {
      removeCacheById: removeSearchResultCacheById,
      getCache: () => searchResultsCache,
      getDebugLogs: () => debugLogs,
      clearDebugLogs: clearDebugLogs,
      toggleDebugMode: toggleDebugMode,
      forceRefreshBT4G: forceRefreshAllFc2Items,
      getFc2ItemProcessQueue: () => Array.from(fc2ItemsToProcessQueue),
      processFc2ItemQueueAsync: processFc2ItemsQueue,
      getFc2ItemRetryAttempts: () =>
        Object.fromEntries(fc2ItemRetryAttempts.entries()), // 用于调试重试
      testProxyServer: testProxyServer, // 新增调试方法
      getCurrentProxyUrl: () => PROXY_SERVER_URL, // 新增调试方法
      reenableScript: () => { // 修改重新启用脚本的功能
        isScriptEnabled = true
        consecutiveRequestErrors = 0
        debugLog("脚本已重新启用", "SCRIPT_REENABLED")
        startDomObserver() // 重新启动观察器
        debouncedScanAndEnqueueFc2Items() // 重新开始扫描
      },
      isScriptEnabled: () => isScriptEnabled // 新增检查脚本状态的功能
    }
    debugLog(
      `调试函数已挂载到 ${
        typeof unsafeWindow !== "undefined" ? "unsafeWindow" : "window"
      }.fc2EnhancedSearch`,
      "INIT"
    )
  }

  // 预览功能相关函数
  function showPreview(fc2Id) {
    const previewUrlHost = "https://baihuse.com"
    const previewUrl_Page = previewUrlHost + "/fc2daily/detail/FC2-PPV-" + fc2Id

    // 创建对话框和遮罩
    let dialog = document.querySelector('.preview-dialog')
    let overlay = document.querySelector('.preview-dialog-overlay')
    
    if (!dialog) {
      dialog = document.createElement('div')
      dialog.className = 'preview-dialog'
      document.body.appendChild(dialog)
      
      const closeButton = document.createElement('button')
      closeButton.className = 'preview-dialog-close'
      closeButton.textContent = '×'
      closeButton.onclick = () => {
        dialog.classList.remove('active')
        overlay.classList.remove('active')
      }
      dialog.appendChild(closeButton)
      
      const content = document.createElement('div')
      content.className = 'preview-dialog-content'
      dialog.appendChild(content)
    }
    
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.className = 'preview-dialog-overlay'
      overlay.onclick = () => {
        dialog.classList.remove('active')
        overlay.classList.remove('active')
      }
      document.body.appendChild(overlay)
    }

    const content = dialog.querySelector('.preview-dialog-content')
    content.innerHTML = '<div style="text-align: center; color: white;">加载中...</div>'
    
    dialog.classList.add('active')
    overlay.classList.add('active')

    GM_xmlhttpRequest({
      method: "GET",
      url: previewUrl_Page,
      onload: (response) => {
        if (response.status === 200) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(response.responseText, "text/html")
          const images = doc.querySelectorAll('img')
          const videos = doc.querySelectorAll('video')
          
          if (images.length < 2 && videos.length === 0) {
            content.innerHTML = '<div style="text-align: center; color: white;">暂无预览</div>'
            return
          }

          content.innerHTML = ''
          
          // 处理图片
          for (let i = 1; i < images.length - 1; i++) {
            const path = new URL(images[i].src).pathname
            const imgSrc = previewUrlHost + path
            
            const img = document.createElement('img')
            img.src = imgSrc
            img.style.width = '100%'
            img.style.height = 'auto'
            img.style.marginBottom = '10px'
            content.appendChild(img)
          }

          // 处理视频
          videos.forEach(v => {
            const path = new URL(v.src).pathname
            const videoSrc = previewUrlHost + path
            
            const video = document.createElement('video')
            video.src = videoSrc
            video.loop = true
            video.muted = true
            video.controls = true
            video.style.width = '100%'
            video.style.marginBottom = '10px'
            content.appendChild(video)
          })
        } else {
          content.innerHTML = '<div style="text-align: center; color: white;">加载失败</div>'
        }
      },
      onerror: () => {
        content.innerHTML = '<div style="text-align: center; color: white;">加载失败</div>'
      }
    })
  }
})()
