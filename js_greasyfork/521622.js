// ==UserScript==
// @name         Linux DO 助手 (Clash导入+快捷评论)
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  为 Linux DO 论坛添加Clash订阅导入和快捷评论功能
// @author       ltw
// @match        https://linux.do/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/521622/Linux%20DO%20%E5%8A%A9%E6%89%8B%20%28Clash%E5%AF%BC%E5%85%A5%2B%E5%BF%AB%E6%8D%B7%E8%AF%84%E8%AE%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521622/Linux%20DO%20%E5%8A%A9%E6%89%8B%20%28Clash%E5%AF%BC%E5%85%A5%2B%E5%BF%AB%E6%8D%B7%E8%AF%84%E8%AE%BA%29.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // =============== 样式定义 ===============
  const style = document.createElement("style")
  style.textContent = `
        .clash-import-btn {
            margin-left: 0;
            padding: 4px 12px;
            background: linear-gradient(145deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .clash-import-wrapper {
            display: inline-block;
            margin-left: 6px;
            vertical-align: baseline;
        }
        .clash-import-btn:hover {
            background: linear-gradient(145deg, #45a049, #388e3c);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .clash-import-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
    `
  document.head.appendChild(style)

  // =============== Clash导入功能 ===============
  // 订阅链接正则表达式
  const subscriptionPattern = /https?:\/\/[^\s<>"']+?(?:token=)[^\s<>"']+/gi
  // 非全局版本用于判断/提取，避免全局正则 lastIndex 副作用
  const subscriptionTestPattern = new RegExp(subscriptionPattern.source, "i")

  // 记录已处理的URL，避免重复添加按钮
  const processedUrls = new Set()

  // 检查URL是否已有对应的按钮
  function hasClashButton(url) {
    const encodedUrl = btoa(url).replace(/=/g, "")
    return !!document.querySelector(`[data-clash-url="${encodedUrl}"]`)
  }

  // 导入到Clash
  async function importToClash(url) {
    try {
      const clashProtocol = `clash://install-config?url=${encodeURIComponent(
        url
      )}&name=${encodeURIComponent("导入的配置")}`

      const link = document.createElement("a")
      link.style.display = "none"
      link.href = clashProtocol
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (e) {
      alert("导入失败,请确保已安装Clash并正确配置")
    }
  }

  // 创建导入按钮
  function createImportButton(url) {
    const encodedUrl = btoa(url).replace(/=/g, "")
    const button = document.createElement("button")
    button.className = "clash-import-btn"
    button.textContent = "导入到Clash"
    button.type = "button"
    button.dataset.clashUrl = encodedUrl
    button.onclick = e => {
      e.preventDefault()
      e.stopPropagation()
      importToClash(url)
    }
    return button
  }

  // 为文本节点添加导入按钮
  function processTextNode(node) {
    // 如果节点是空的或者不是文本节点，直接返回
    if (!node || !node.textContent) return

    // 获取节点的文本内容
    const text = node.textContent

    // 使用正则表达式查找所有匹配的URL
    const matches = text.matchAll(subscriptionPattern)
    let insertionPoint = node
    for (const match of matches) {
      const fullUrl = match[0]

      // 如果URL已经处理过，跳过
      if (processedUrls.has(fullUrl) || hasClashButton(fullUrl)) continue

      // 创建并插入按钮（放在链接/文本之后，避免插入到 <a> 内部）
      const button = createImportButton(fullUrl)
      const wrapper = document.createElement("span")
      wrapper.className = "clash-import-wrapper"
      wrapper.appendChild(button)

      if (insertionPoint && insertionPoint.parentElement) {
        const anchorAncestor = insertionPoint.parentElement.closest("a")
        if (anchorAncestor && anchorAncestor.parentElement) {
          anchorAncestor.parentElement.insertBefore(wrapper, anchorAncestor.nextSibling)
        } else {
          insertionPoint.parentElement.insertBefore(wrapper, insertionPoint.nextSibling)
          insertionPoint = wrapper
        }
        processedUrls.add(fullUrl)
      }
    }
  }

  // 为链接添加导入按钮
  function addImportButton(element) {
    // 优先使用 href；若无 href，从文本中精确提取第一个订阅链接，避免带上按钮文字
    let url = element.href || ""
    if (!url) {
      const text = element.textContent || ""
      const m = text.match(subscriptionTestPattern)
      url = m ? m[0] : ""
    }
    if (!url || !subscriptionTestPattern.test(url)) return

    // 如果已经处理过，直接返回
    if (processedUrls.has(url) || hasClashButton(url)) return

    const button = createImportButton(url)
    const wrapper = document.createElement("span")
    wrapper.className = "clash-import-wrapper"
    wrapper.appendChild(button)
    element.parentNode.insertBefore(wrapper, element.nextSibling)
    processedUrls.add(url)
  }

  // 清理重复按钮
  function cleanupDuplicateButtons() {
    const processedButtonUrls = new Set()
    document.querySelectorAll(".clash-import-btn").forEach(button => {
      const url = button.dataset.clashUrl
      if (processedButtonUrls.has(url)) {
        button.remove()
      } else {
        processedButtonUrls.add(url)
      }
    })
  }

  // =============== 快捷评论功能 ===============
  // 默认快捷评论列表
  const quickComments = [
    "感谢分享 🙏",
    "直接起飞 🚀",
    "感谢大佬分享 ✨",
    "学习了,收藏! 📚",
    "涨知识了 🧠",
    "学到了学到了 ✌️",
    "mark一下,以后用得着 🔖",
    "太强了吧 🚀",
    "学习ing... 📝",
    "收藏了,慢慢消化 🤓",
    "大佬tql 🎉",
    "学习了,学习了 💪",
    "参与参与✌️"
  ]

  // 创建快捷评论面板
  function createQuickCommentPanel() {
    const panel = document.createElement("div")
    panel.style.cssText = `
        position: fixed;
        right: 80px;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(145deg, #e8f4f8, #d5e6f3);
        padding: 15px;
        border-radius: 16px;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.1),
                    -5px -5px 15px rgba(255,255,255,0.5);
        width: 160px;
        z-index: 999;
        transition: all 0.3s ease;
    `

    // 添加标题
    const title = document.createElement("div")
    title.textContent = "✨ 快捷评论"
    title.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: center;
        color: #2c3e50;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        padding-bottom: 10px;
        border-bottom: 2px solid #b8d4e8;
    `
    panel.appendChild(title)

    // 添加快捷评论按钮
    quickComments.forEach(comment => {
      const button = document.createElement("button")
      button.textContent = comment
      button.style.cssText = `
            display: block;
            width: 100%;
            margin: 8px 0;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(145deg, #f0f9ff, #d8e9f3);
            box-shadow: 3px 3px 6px rgba(0,0,0,0.1),
                        -3px -3px 6px rgba(255,255,255,0.8);
            cursor: pointer;
            font-size: 13px;
            color: #444;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        `

      button.addEventListener("mouseover", () => {
        button.style.cssText += `
                transform: translateY(-2px);
                background: linear-gradient(145deg, #e6e6e6, #ffffff);
                color: #2980b9;
                box-shadow: 4px 4px 8px rgba(0,0,0,0.15),
                            -4px -4px 8px rgba(255,255,255,0.9);
            `
      })

      button.addEventListener("mouseout", () => {
        button.style.cssText = button.getAttribute("style").replace(/transform:[^;]+;/, "")
        button.style.background = "linear-gradient(145deg, #f0f9ff, #d8e9f3)"
        button.style.color = "#444"
      })

      button.addEventListener("mousedown", () => {
        button.style.cssText += `
                transform: scale(0.95);
                box-shadow: 2px 2px 4px rgba(0,0,0,0.1),
                            -2px -2px 4px rgba(255,255,255,0.8);
            `
      })

      button.addEventListener("mouseup", () => {
        button.style.transform = "scale(1)"
      })

      button.addEventListener("click", () => {
        const replyButton = document.querySelector(".reply.create")
        if (replyButton) {
          insertComment(comment)
        }
      })

      panel.appendChild(button)
    })

    // 添加面板hover效果
    panel.addEventListener("mouseover", () => {
      panel.style.transform = "translateY(-50%) scale(1.02)"
      panel.style.boxShadow = "6px 6px 20px rgba(0,0,0,0.15), -6px -6px 20px rgba(255,255,255,0.6)"
    })

    panel.addEventListener("mouseout", () => {
      panel.style.transform = "translateY(-50%) scale(1)"
      panel.style.boxShadow = "5px 5px 15px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.8)"
    })

    return panel
  }

  // 插入评论到输入框
  function insertComment(comment) {
    const replyButton = document.querySelector('.reply.create[aria-label*="#1"]')
    if (replyButton) {
      replyButton.click()
      setTimeout(() => {
        const editor = document.querySelector(".d-editor-textarea-wrapper textarea")
        if (editor) {
          editor.value = comment
          editor.dispatchEvent(new Event("input", { bubbles: true }))
          editor.dispatchEvent(new Event("change", { bubbles: true }))
          editor.focus()
        }
      }, 500)
    }
  }

  // =============== 通用功能 ===============
  // 检查是否为帖子页面
  function isPostPage() {
    const hasCommentFeature = document.querySelector(".timeline-controls")
    return !!hasCommentFeature
  }

  // 处理页面内容
  function processContent() {
    if (!isPostPage()) {
      return
    }

    // 处理Clash导入按钮
    const links = document.querySelectorAll("a")
    links.forEach(addImportButton)

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false)
    while (walker.nextNode()) {
      processTextNode(walker.currentNode)
    }

    // 清理可能存在的重复按钮
    cleanupDuplicateButtons()

    // 处理快捷评论面板
    const hasPanel = document.querySelector(".quick-comment-panel")
    if (!hasPanel) {
      const panel = createQuickCommentPanel()
      panel.classList.add("quick-comment-panel")
      document.body.appendChild(panel)
    }
  }

  // 初始化函数
  function init() {
    // 初始化时清空已处理URL集合
    processedUrls.clear()

    // 初始处理
    processContent()

    // 监听URL变化
    let lastUrl = location.href
    new MutationObserver(() => {
      const url = location.href
      if (url !== lastUrl) {
        lastUrl = url
        // URL变化时清空已处理URL集合
        processedUrls.clear()
        // 移除旧的评论面板
        const oldPanel = document.querySelector(".quick-comment-panel")
        if (oldPanel) {
          oldPanel.remove()
        }
        // 延迟一段时间等待页面加载完成
        setTimeout(() => {
          // 检查是否为帖子页面
          if (!isPostPage()) {
            // 不是帖子页面时移除评论面板
            const panel = document.querySelector(".quick-comment-panel")
            if (panel) {
              panel.remove()
            }
            return
          }
          processContent()
        }, 500)
      }
    }).observe(document.body, { subtree: true, childList: true })

    // 监听DOM变化
    const observer = new MutationObserver(() => {
      // 检查是否为帖子页面
      if (!isPostPage()) {
        // 不是帖子页面时移除评论面板
        const panel = document.querySelector(".quick-comment-panel")
        if (panel) {
          panel.remove()
        }
        return
      }
      processContent()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
