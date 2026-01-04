// ==UserScript==
// @name         JD Relay URL Modifier
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Append __wsmode__=9 to relay*.jd.com/file/design?xxx URLs
// @author       Your Name
// @match        *://relay.jd.com/file*
// @match        *://relay-test.jd.com/file*
// @match        *://relay0.jd.com/file*
// @match        *://ling.jd.com/file*
// @match        *://ling-design.jd.com/file*
// @match        *://ling-test.jd.com/file*
// @match        *://ling-pre.jd.com/file*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520495/JD%20Relay%20URL%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/520495/JD%20Relay%20URL%20Modifier.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  const inFile = window.location.pathname.startsWith("/file/design")
  // 从 localStorage 获取状态
  let isEnabled = localStorage.getItem("wsmodeEnabled") === "true"

  // 创建按钮
  let button = document.createElement("button")
  // 添加图标和文字
  button.innerHTML = isEnabled ? 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> 单身模式' : 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg> 单身模式'
  button.style.position = "fixed"
  button.style.bottom = localStorage.getItem("buttonBottom") || "60px"
  button.style.right = localStorage.getItem("buttonRight") || "10px"
  button.style.zIndex = "1000"
  button.style.padding = "10px 15px"
  button.style.border = "none"
  button.style.borderRadius = "5px"
  button.style.color = "white"
  button.style.cursor = "pointer"
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
  button.style.display = "flex"
  button.style.alignItems = "center"
  button.style.gap = "5px"
  button.style.fontSize = "14px"
  button.style.fontWeight = "bold"
  button.style.transition = "all 0.2s ease"
  document.body.appendChild(button)

  // 设置按钮初始状态
  button.style.backgroundColor = isEnabled ? "#28a745" : "#dc3545"

  // 按钮拖拽功能
  let isDragging = false
  let offsetX, offsetY
  let dragStartTime = 0
  let hasMoved = false

  button.addEventListener("mousedown", (e) => {
    isDragging = true
    hasMoved = false
    dragStartTime = Date.now()
    offsetX = e.clientX - button.getBoundingClientRect().left
    offsetY = e.clientY - button.getBoundingClientRect().top
    button.style.transition = "none" // 禁用动画
    button.style.opacity = "0.8" // 拖动时透明度变化
  })

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      hasMoved = true
      const newRight = window.innerWidth - e.clientX - (button.offsetWidth - offsetX)
      const newBottom = window.innerHeight - e.clientY - (button.offsetHeight - offsetY)
      button.style.right = `${Math.max(0, newRight)}px`
      button.style.bottom = `${Math.max(0, newBottom)}px`
    }
  })

  document.addEventListener("mouseup", (e) => {
    if (isDragging) {
      const dragEndTime = Date.now()
      const dragDuration = dragEndTime - dragStartTime
      
      button.style.opacity = "1" // 恢复透明度
      button.style.transition = "background-color 0.2s ease" // 恢复动画
      
      // 保存位置到 localStorage
      localStorage.setItem("buttonRight", button.style.right)
      localStorage.setItem("buttonBottom", button.style.bottom)
      
      // 只有在非拖拽情况下才触发点击事件（短时间内没有移动鼠标）
      if (!hasMoved && dragDuration < 200) {
        toggleMode()
      }
      
      isDragging = false
    }
  })

  // 抽取切换模式的逻辑为单独的函数
  function toggleMode() {
    const previousState = isEnabled
    isEnabled = !isEnabled
    localStorage.setItem("wsmodeEnabled", isEnabled)
    button.style.backgroundColor = isEnabled ? "#28a745" : "#dc3545"
    button.innerHTML = isEnabled ? 
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> 单身模式' : 
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg> 单身模式'
    // 通知其他页面
    localStorage.setItem("wsmodeChanged", Date.now())

    // 如果在 inFile 页面并且 wsmode 状态有变化，刷新页面
    if (inFile && previousState !== isEnabled) {
      if (isEnabled && !url.searchParams.has("__wsmode__")) {
        url.searchParams.append("__wsmode__", "9")
      } else if (!isEnabled && url.searchParams.has("__wsmode__")) {
        url.searchParams.delete("__wsmode__")
      }
      window.location.replace(url.toString())
    }
  }

  // 获取当前 URL
  let url = new URL(window.location.href)

  // 检查是否已经有 __wsmode__ 参数并且功能开启
  if (inFile) {
    if (isEnabled && !url.searchParams.has("__wsmode__")) {
      // 添加 __wsmode__ 参数
      url.searchParams.append("__wsmode__", "9")
      // 重定向到新的 URL
      window.location.replace(url.toString())
    }
  }

  // 监听新打开的 /file/design 页面
  window.addEventListener("message", (event) => {
    console.log("Received message from relay.jd.com:", event)
    if (
      event.origin === location.origin &&
      event.data === "checkWsmode"
    ) {
      event.source.postMessage({ wsmodeEnabled: isEnabled }, event.origin)
    }
  })

  // 在 /file/design 页面中检查 __wsmode__ 参数
  if (inFile) {
    window.addEventListener("message", (event) => {
      if (
        event.origin === location.origin &&
        typeof event.data.wsmodeEnabled !== "undefined"
      ) {
        if (event.data.wsmodeEnabled) {
          if (!url.searchParams.has("__wsmode__")) {
            url.searchParams.append("__wsmode__", "9")
            window.location.replace(url.toString())
          }
        } else {
          if (url.searchParams.has("__wsmode__")) {
            url.searchParams.delete("__wsmode__")
            window.location.replace(url.toString())
          }
        }
      }
    })
  }

  // 监听 localStorage 变化
  window.addEventListener("storage", (event) => {
    if (event.key === "wsmodeChanged") {
      isEnabled = localStorage.getItem("wsmodeEnabled") === "true"
      button.style.backgroundColor = isEnabled ? "#28a745" : "#dc3545"
      button.innerHTML = isEnabled ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> 单身模式' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg> 单身模式'
      if (inFile) {
        if (isEnabled && !url.searchParams.has("__wsmode__")) {
          url.searchParams.append("__wsmode__", "9")
          window.location.replace(url.toString())
        } else if (!isEnabled && url.searchParams.has("__wsmode__")) {
          url.searchParams.delete("__wsmode__")
          window.location.replace(url.toString())
        }
      }
    }
  })
})()
