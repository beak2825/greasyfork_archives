// ==UserScript==
// @name         codepen 代码提取器
// @namespace    https://xxxily.
// @version      0.0.1
// @license      MIT
// @description  提取 codepen 上的代码并转换成 Markdown 格式，从而实现一键迁移至code-flux平台。
// @author       Blaze
// @match        *://*.codepen.io/*
// @match        *://*.jsbin.com/*
// @match        *://*.jsfiddle.net/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532280/codepen%20%E4%BB%A3%E7%A0%81%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532280/codepen%20%E4%BB%A3%E7%A0%81%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 添加样式
  GM_addStyle(`
        .code-extractor-btn {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 10px;
            cursor: pointer;
            border-radius: 4px;
            line-height: 32px;
        }
        .code-extractor-btn:hover {
            background-color: #45a049;
        }
        .code-extractor-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 4px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: opacity 0.3s;
        }
    `)

  // 检查页面上是否有 CodeMirror 实例
  function checkForCodeMirror () {
    const codeMirrors = document.querySelectorAll('.CodeMirror')
    if (codeMirrors.length > 0) {
      // 检查是否存在指定的 DOM 元素
      const targetButton = document.querySelector('#main-header button[title="Love"]')
      if (targetButton) {
        // 检查是否已经插入了提取按钮
        if (!document.querySelector('.code-extractor-btn')) {
          // 创建提取按钮
          const extractButton = document.createElement('button')
          extractButton.className = 'code-extractor-btn'
          extractButton.textContent = '提取代码'
          extractButton.addEventListener('click', extractCodeToMarkdown)

          // 插入按钮到目标按钮前面
          targetButton.parentNode.insertBefore(extractButton, targetButton)
        }
      } else {
        // 如果没有找到目标按钮，可以考虑添加一个悬浮按钮或其他方式
        console.log('未找到目标按钮，但页面上存在 CodeMirror 实例')
      }
    }
  }

  // 显示消息提示
  function showMessage (message) {
    // 移除可能存在的旧消息
    const oldMessage = document.querySelector('.code-extractor-message')
    if (oldMessage) {
      oldMessage.remove()
    }

    // 创建新消息元素
    const messageEl = document.createElement('div')
    messageEl.className = 'code-extractor-message'
    messageEl.textContent = message
    document.body.appendChild(messageEl)

    // 2秒后自动消失
    setTimeout(() => {
      messageEl.style.opacity = '0'
      setTimeout(() => {
        messageEl.remove()
      }, 300)
    }, 2000)
  }

  // 从 HTML 代码中提取 title
  function extractTitleFromHtml (htmlCode) {
    const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i)
    return titleMatch ? titleMatch[1].trim() : null
  }

  // 获取代码的语言
  function getLanguageFromMode (mode) {
    if (!mode) return ''

    // 处理可能的对象形式
    if (typeof mode === 'object' && mode.name) {
      mode = mode.name
    }

    // 映射 CodeMirror 模式到 Markdown 语言标识符
    const modeMap = {
      javascript: 'javascript',
      'text/javascript': 'javascript',
      js: 'javascript',
      html: 'html',
      htmlmixed: 'html',
      'text/html': 'html',
      css: 'css',
      'text/css': 'css',
      xml: 'xml',
      python: 'python',
      ruby: 'ruby',
      php: 'php',
      clike: 'c',
      java: 'java'
      // 可以根据需要添加更多映射
    }

    return modeMap[mode] || ''
  }

  // 提取代码并转换为 Markdown
  function extractCodeToMarkdown () {
    const codeMirrors = document.querySelectorAll('.CodeMirror')
    if (codeMirrors.length === 0) {
      showMessage('未找到 CodeMirror 实例')
      return
    }

    const pageTitle = document.title
    let markdownContent = `# ${pageTitle}\n\n`

    codeMirrors.forEach((cm, index) => {
      if (cm && cm.CodeMirror) {
        const editor = cm.CodeMirror
        const code = editor.getValue()
        const mode = editor.getMode ? editor.getMode() : (editor.options ? editor.options.mode : '')
        const language = getLanguageFromMode(mode)

        // 如果是 HTML 代码，尝试提取 title
        if (language === 'html' && index === 0) {
          const htmlTitle = extractTitleFromHtml(code)
          if (htmlTitle) {
            markdownContent = `# ${htmlTitle}\n\n`
          }
        }

        markdownContent += `\`\`\`${language}\n${code}\n\`\`\`\n\n`
      } else if (cm.__vue__ && cm.__vue__.cminstance) {
        // 处理某些 Vue 封装的 CodeMirror
        const editor = cm.__vue__.cminstance
        const code = editor.getValue()
        const mode = editor.getMode ? editor.getMode() : (editor.options ? editor.options.mode : '')
        const language = getLanguageFromMode(mode)

        if (language === 'html' && index === 0) {
          const htmlTitle = extractTitleFromHtml(code)
          if (htmlTitle) {
            markdownContent = `# ${htmlTitle}\n\n`
          }
        }

        markdownContent += `\`\`\`${language}\n${code}\n\`\`\`\n\n`
      } else {
        // 尝试其他可能的 CodeMirror 实例获取方式
        try {
          const instance = cm.querySelector('.CodeMirror-code')
          if (instance) {
            const code = Array.from(instance.querySelectorAll('.CodeMirror-line'))
              .map(line => line.textContent)
              .join('\n')

            markdownContent += `\`\`\`\n${code}\n\`\`\`\n\n`
          }
        } catch (e) {
          console.error('提取代码时出错:', e)
        }
      }
    })

    // 复制到剪贴板
    GM_setClipboard(markdownContent)
    showMessage('代码已成功复制到剪贴板！')
  }

  // 页面加载完成后检查 CodeMirror
  window.addEventListener('load', checkForCodeMirror)

  // 定期检查 CodeMirror 是否被动态加载，最多检查10次
  let checkCount = 0
  const checkInterval = setInterval(() => {
    checkForCodeMirror()
    checkCount++

    // 如果已经找到 CodeMirror 实例或者已经检查了10次，则停止检查
    if (document.querySelectorAll('.CodeMirror').length > 0 || checkCount >= 10) {
      clearInterval(checkInterval)
    }
  }, 1000)
})()
