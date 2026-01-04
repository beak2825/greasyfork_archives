// ==UserScript==
// @name         share-link-copy
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  快捷复制便于分享的页面标题和URL，支持自定义快捷键，支持设置是否保留URL参数
// @license      MIT
// @author       Lainbo
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMTAgMTM0aDc3NXY1ODNIMTEweiIvPjxwYXRoIGQ9Ik02MjUgNjg0LjhjMjcuNSAwIDUxLTkuOCA3MC42LTI5LjMgMTkuNi0xOS42IDI5LjQtNDMuMSAyOS4zLTcwLjcgMC0yNy41LTkuOC01MS4xLTI5LjMtNzAuNi0xOS41LTE5LjUtNDMuMS0yOS4zLTcwLjYtMjkuNC0xMi41IDAtMjQuNCAyLjMtMzUuNiA2LjktMTEuMiA0LjYtMjEuNCAxMC42LTMwLjYgMTguMUw0MjUgNDQyLjN2LTE1bDEzMy44LTY3LjVjOS4yIDcuNSAxOS40IDEzLjUgMzAuNiAxOC4xczIzLjEgNi45IDM1LjYgNi45YzI3LjUgMCA1MS05LjggNzAuNi0yOS40IDE5LjYtMTkuNiAyOS40LTQzLjEgMjkuMy03MC42IDAtMjcuNS05LjgtNTEuMS0yOS4zLTcwLjYtMTkuNS0xOS41LTQzLjEtMjkuMy03MC42LTI5LjQtMjcuNi0uMS01MS4xIDkuNy03MC42IDI5LjQtMTkuNSAxOS43LTI5LjMgNDMuMi0yOS40IDcwLjZ2Ny41bC0xMzMuOCA2Ny41Yy05LjItNy41LTE5LjQtMTMuNi0zMC42LTE4LjFzLTIzLjEtNi45LTM1LjYtNi45Yy0yNy41IDAtNTEgOS44LTcwLjYgMjkuNC0xOS42IDE5LjYtMjkuNCA0My4xLTI5LjQgNzAuNiAwIDI3LjUgOS44IDUxIDI5LjQgNzAuNiAxOS42IDE5LjYgNDMuMiAyOS40IDcwLjYgMjkuMyAxMi41IDAgMjQuNC0yLjMgMzUuNi02LjggMTEuMy00LjYgMjEuNS0xMC42IDMwLjYtMTguMUw1MjUgNTc3LjN2Ny41YzAgMjcuNSA5LjggNTEgMjkuNCA3MC43IDE5LjYgMTkuNiA0My4xIDI5LjQgNzAuNiAyOS4zbS00MjUgMTUwbC0xMTUgMTE1Yy0xNS44IDE1LjgtMzQgMTkuNC01NC40IDEwLjZDMTAuMiA5NTEuOCAwIDkzNi4xIDAgOTEzLjZWMTM0LjhjMC0yNy41IDkuOC01MSAyOS40LTcwLjZTNzIuNSAzNC45IDEwMCAzNC44aDgwMGMyNy41IDAgNTEuMSA5LjggNzAuNiAyOS40IDE5LjYgMTkuNiAyOS40IDQzLjEgMjkuNCA3MC42djYwMGMwIDI3LjUtOS44IDUxLjEtMjkuNCA3MC42LTE5LjYgMTkuNi00My4xIDI5LjQtNzAuNiAyOS40SDIwMHoiIGZpbGw9IiMxNjVkZmYiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/511569/share-link-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/511569/share-link-copy.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // Toggle linux.do user param appending for topic links.
  const ENABLE_LINUX_DO_USER_PARAM = true

  GM_addStyle(`
    .els-notification-Pfq0X5 {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #2da44e;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: 9999;
    }
    .modal-overlay-8W2Q7t {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    }
    .modal-content-1Zb3tL {
      background-color: #f6f8fa;
      padding: 24px;
      border-radius: 6px;
      width: 460px;
      box-shadow: 0 8px 24px rgba(140,149,159,0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .modal-title-cKu8SM {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #24292f;
    }
    .modal-description-KM3XGv {
      font-size: 14px;
      color: #57606a;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .modal-content-1Zb3tL input[type="text"], .modal-content-1Zb3tL textarea {
      width: 100%;
      margin-bottom: 16px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
      color: #24292f;
      vertical-align: middle;
      background-color: #ffffff;
      background-repeat: no-repeat;
      background-position: right 8px center;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      box-shadow: inset 0 1px 0 rgba(208,215,222,0.2);
      box-sizing: border-box;
    }
    .modal-content-1Zb3tL textarea {
      height: 100px;
      resize: vertical;
    }
    .modal-content-1Zb3tL button {
      color: #ffffff;
      background-color: #2da44e;
      padding: 5px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      border: 1px solid;
      border-radius: 6px;
      appearance: none;
      user-select: none;
      margin-left: 8px;
    }
    .modal-content-1Zb3tL button.cancel {
      color: #24292f;
      background-color: #f6f8fa;
      border-color: rgba(27,31,36,0.15);
    }
    .modal-content-1Zb3tL button:hover {
      background-color: #2c974b;
    }
    .modal-content-1Zb3tL button.cancel:hover {
      background-color: #f3f4f6;
    }
    .modal-hint-8yFDJi {
      font-size: 10px;
      color: #57606a;
      line-height: 1.1;
      font-style: italic;
      margin: 0;
      user-select: none;
    }
    #els-domains-7u6z9U {
      resize: none;
      margin-top: 12px;
    }
    .modal-buttons-L5xkyU {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
    .modal-checkbox-container-2Tgu5E {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .modal-checkbox-container-2Tgu5E input[type="checkbox"] {
      margin-right: 8px;
      width: auto;
    }
    .modal-checkbox-container-2Tgu5E label {
      font-size: 14px;
      color: #24292f;
      user-select: none;
    }
    .modal-content-1Zb3tL input[type="text"]:focus, .modal-content-1Zb3tL textarea:focus {
      outline: none;
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
    }
  `)

  // 从存储中获取保留参数的域名列表，如果没有则使用默认值
  let domainsToKeepParams = GM_getValue('domainsToKeepParams', ['youtube.com', 'google.com'])

  // 获取保存的快捷键，默认为 'alt+c'
  let shortcut = GM_getValue('easyLinkShareShortcut', 'alt+c')
  // 获取保存的 Markdown 格式快捷键，默认为 'alt+shift+c'
  let markdownShortcut = GM_getValue('easyLinkShareMarkdownShortcut', 'alt+shift+c')

  // 添加新的 GM_getValue 调用来获取列表模式
  let isBlacklistMode = GM_getValue('isBlacklistMode', false)

  // 用来跟踪模态框是否打开
  let isModalOpen = false

  // 修改 URL 处理函数
  function processUrl(url, domainsToKeepParams) {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // 域名在列表中
    const isInList = domainsToKeepParams.some(d => domain.endsWith(d))

    if (isBlacklistMode) {
      // 黑名单模式：如果域名在列表中，则移除参数
      if (isInList) {
        return `${urlObj.origin}${urlObj.pathname}`
      }
    }
    else {
      // 白名单模式：如果域名不在列表中，则移除参数
      if (!isInList) {
        return `${urlObj.origin}${urlObj.pathname}`
      }
    }

    return url
  }

  function getLinuxDoUserIdFromDom() {
    const toggleButton = document.getElementById('toggle-current-user')
    if (!toggleButton) {
      return null
    }

    const avatarImg = toggleButton.querySelector('img')
    if (!avatarImg) {
      return null
    }

    const src = avatarImg.getAttribute('src') || ''
    const match = src.match(/\/user_avatar\/[^/]+\/([^/]+)\//)
    return match ? match[1] : null
  }

  function appendLinuxDoUserParam(url) {
    if (!ENABLE_LINUX_DO_USER_PARAM) {
      return url
    }

    let urlObj
    try {
      urlObj = new URL(url)
    }
    catch (error) {
      return url
    }

    if (urlObj.hostname !== 'linux.do') {
      return url
    }

    if (!urlObj.pathname.includes('/t/topic')) {
      return url
    }

    const userId = getLinuxDoUserIdFromDom()
    if (!userId) {
      return url
    }

    urlObj.searchParams.set('u', userId)
    return urlObj.toString()
  }

  // 创建通知功能
  function createNotification() {
    return function showNotification(message) {
      const notification = document.createElement('div')
      notification.className = 'els-notification-Pfq0X5'
      notification.textContent = message
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.style.opacity = '1'
      }, 10)

      setTimeout(() => {
        notification.style.opacity = '0'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
  }

  const showNotification = createNotification()

  function getCodePenTitle() {
    try {
      // 尝试从父窗口获取标题
      return { title: window.parent.document.title, error: false }
    }
    catch (error) {
      // 如果无法访问父窗口，使用当前文档的标题
      return {
        title: document.title.replace(' - CodePen', ''),
        error: true,
      }
    }
  }

  // 修改复制链接的主要函数
  function copyLink(isMarkdown = false) {
    let url = window.location.href
    let title = document.title
    let showError = false

    // 特殊处理 CodePen
    if (url.includes('cdpn.io')) {
      try {
        url = window.parent.location.href
        const result = getCodePenTitle()
        title = result.title
        showError = result.error
      }
      catch (error) {
        showError = true
      }
    }

    if (showError) {
      showNotification('当前页面焦点可能在iframe中，请切换到主窗口进行复制')
      return // 如果出错，直接返回，不执行复制操作
    }

    url = processUrl(url, domainsToKeepParams)
    url = appendLinuxDoUserParam(url)

    const text = isMarkdown ? `[${title}](${url})` : `${title}\n${url}`

    GM_setClipboard(text, 'text')
    showNotification(isMarkdown ? 'Markdown 格式链接已复制到剪贴板！' : '链接已复制到剪贴板！')
  }

  // 解析快捷键字符串
  function parseShortcut(shortcutStr) {
    const parts = shortcutStr.toLowerCase().split('+')
    return {
      altKey: parts.includes('alt') || parts.includes('option'),
      ctrlKey: parts.includes('ctrl') || parts.includes('control'),
      shiftKey: parts.includes('shift'),
      metaKey: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
      keys: parts.filter(part => !['alt', 'ctrl', 'control', 'shift', 'meta', 'win', 'option', 'cmd', 'command'].includes(part)),
    }
  }

  // 修改设置界面创建函数
  function createSettingsUI(options) {
    const { shortcut, markdownShortcut, domainsToKeepParams, isBlacklistMode, onSave } = options

    const modalHTML = `
      <div class="modal-overlay-8W2Q7t">
        <div class="modal-content-1Zb3tL">
          <div class="modal-title-cKu8SM">设置</div>
          <div class="modal-description-KM3XGv">设置快捷键组合以快速复制页面标题和链接。按 ESC 键撤销更改。</div>
          <input type="text" id="els-shortcut" placeholder="按下快捷键组合" value="${shortcut}" readonly>
          <div class="modal-description-KM3XGv">设置快捷键组合以复制 Markdown 格式的链接：</div>
          <input type="text" id="els-markdown-shortcut" placeholder="按下快捷键组合" value="${markdownShortcut}" readonly>
          <div class="modal-description-KM3XGv">参数去除模式：</div>
          <div class="modal-checkbox-container-2Tgu5E">
            <input type="checkbox" id="els-blacklist-mode" ${isBlacklistMode ? 'checked' : ''}>
            <label for="els-blacklist-mode">黑名单模式（勾选后，列表中的域名复制时将不保留参数）</label>
          </div>
          <div class="modal-description-KM3XGv" id="els-domains-description-Cgt5uR">设置需要${isBlacklistMode ? '移除' : '保留'}参数的域名（每行一个）：</div>
          <div class="modal-hint-8yFDJi" id="els-domains-hint-0DAupg">当前为${isBlacklistMode ? '黑名单' : '白名单'}模式。${isBlacklistMode ? '列表中的域名将不保留参数，其他域名将保留参数。' : '列表中的域名将保留参数，其他域名将不保留参数。'}</div>
          <textarea id="els-domains-7u6z9U">${domainsToKeepParams.join('\n')}</textarea>
          <div class="modal-buttons-L5xkyU">
           <button id="els-cancel-W3OUcP" class="cancel">取消</button>
           <button id="els-save-e8UfX6">保存</button>
          </div>
        </div>
      </div>
    `

    const modalContainer = document.createElement('div')
    modalContainer.innerHTML = modalHTML

    // 使用 top.document.body 而不是 document.body
    top.document.body.appendChild(modalContainer)

    const markdownShortcutInput = document.getElementById('els-markdown-shortcut')
    const shortcutInput = document.getElementById('els-shortcut')
    const domainsTextarea = document.getElementById('els-domains-7u6z9U')
    let listeningForShortcut = false
    let currentShortcut = []
    let currentMarkdownShortcut = []
    let listeningForMarkdownShortcut = false

    function resetShortcut() {
      shortcutInput.value = shortcut.toLowerCase()
      currentShortcut = shortcut.toLowerCase().split('+')
      listeningForShortcut = false
    }

    function resetMarkdownShortcut() {
      markdownShortcutInput.value = markdownShortcut.toLowerCase()
      currentMarkdownShortcut = markdownShortcut.toLowerCase().split('+')
      listeningForMarkdownShortcut = false
    }

    function closeSettings() {
      // 修改这里: 从 top.document.body 中移除
      top.document.body.removeChild(modalContainer)
      document.removeEventListener('keydown', escapeHandler)
      isModalOpen = false
    }

    function escapeHandler(e) {
      if (e.key === 'Escape') {
        resetShortcut()
        resetMarkdownShortcut()
        domainsTextarea.value = domainsToKeepParams.join('\n')
      }
    }

    document.addEventListener('keydown', escapeHandler)

    shortcutInput.addEventListener('focus', () => {
      if (listeningForMarkdownShortcut) {
        resetMarkdownShortcut()
      }
      listeningForShortcut = true
      currentShortcut = []
      shortcutInput.value = '按下快捷键组合...'
    })

    markdownShortcutInput.addEventListener('focus', () => {
      if (listeningForShortcut) {
        resetShortcut()
      }
      listeningForMarkdownShortcut = true
      currentMarkdownShortcut = []
      markdownShortcutInput.value = '按下快捷键组合...'
    })

    document.addEventListener('keydown', (e) => {
      if (listeningForShortcut || listeningForMarkdownShortcut) {
        e.preventDefault()
        if (e.code === 'Escape') {
          listeningForShortcut ? resetShortcut() : resetMarkdownShortcut()
          return
        }
        const currentArray = listeningForShortcut ? currentShortcut : currentMarkdownShortcut
        const inputElement = listeningForShortcut ? shortcutInput : markdownShortcutInput

        if (['AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight', 'MetaLeft', 'MetaRight'].includes(e.code)) {
          const modifier = e.code.replace('Left', '').replace('Right', '').toLowerCase()
          if (!currentArray.includes(modifier)) {
            currentArray.push(modifier)
          }
        }
        else {
          const keyDisplay = getKeyDisplay(e.code)
          if (!currentArray.includes(keyDisplay)) {
            currentArray.push(keyDisplay)
          }
          listeningForShortcut = false
          listeningForMarkdownShortcut = false
        }
        inputElement.value = currentArray.join('+')
      }
    })

    document.addEventListener('keyup', (e) => {
      if ((listeningForShortcut || listeningForMarkdownShortcut) && ['alt', 'control', 'shift', 'meta'].includes(e.key.toLowerCase())) {
        listeningForShortcut = false
        listeningForMarkdownShortcut = false
      }
    })

    const blacklistModeCheckbox = document.getElementById('els-blacklist-mode')
    const domainsDescription = document.getElementById('els-domains-description-Cgt5uR')
    const domainsHint = document.getElementById('els-domains-hint-0DAupg')

    blacklistModeCheckbox.addEventListener('change', (e) => {
      const isBlacklist = e.target.checked
      domainsDescription.textContent = `设置需要${isBlacklist ? '移除' : '保留'}参数的域名（每行一个）：`
      domainsHint.textContent = `当前为${isBlacklist ? '黑名单' : '白名单'}模式。${isBlacklist ? '列表中的域名将不保留参数，其他域名将保留参数。' : '列表中的域名将保留参数，其他域名将不保留参数。'}`
    })

    document.getElementById('els-save-e8UfX6').addEventListener('click', () => {
      const newShortcut = shortcutInput.value
      const newMarkdownShortcut = markdownShortcutInput.value
      const newDomains = domainsTextarea.value.split('\n').filter(d => d.trim() !== '')
      const newIsBlacklistMode = blacklistModeCheckbox.checked

      onSave({
        shortcut: newShortcut,
        markdownShortcut: newMarkdownShortcut,
        domainsToKeepParams: newDomains,
        isBlacklistMode: newIsBlacklistMode,
      })

      closeSettings()
    })

    document.getElementById('els-cancel-W3OUcP').addEventListener('click', closeSettings)

    return closeSettings
  }

  // 修改打开设置界面函数
  function openSettings() {
    isModalOpen = true
    createSettingsUI({
      shortcut,
      markdownShortcut,
      domainsToKeepParams,
      isBlacklistMode,
      onSave: (newSettings) => {
        shortcut = newSettings.shortcut
        markdownShortcut = newSettings.markdownShortcut
        domainsToKeepParams = newSettings.domainsToKeepParams
        isBlacklistMode = newSettings.isBlacklistMode
        GM_setValue('easyLinkShareShortcut', shortcut)
        GM_setValue('easyLinkShareMarkdownShortcut', markdownShortcut)
        GM_setValue('domainsToKeepParams', domainsToKeepParams)
        GM_setValue('isBlacklistMode', isBlacklistMode)
        isModalOpen = false
      },
    })
  }
  function getKeyDisplay(code) {
    const keyMap = {
      Digit1: '1',
      Digit2: '2',
      Digit3: '3',
      Digit4: '4',
      Digit5: '5',
      Digit6: '6',
      Digit7: '7',
      Digit8: '8',
      Digit9: '9',
      Digit0: '0',
      KeyA: 'a',
      KeyB: 'b',
      KeyC: 'c',
      KeyD: 'd',
      KeyE: 'e',
      KeyF: 'f',
      KeyG: 'g',
      KeyH: 'h',
      KeyI: 'i',
      KeyJ: 'j',
      KeyK: 'k',
      KeyL: 'l',
      KeyM: 'm',
      KeyN: 'n',
      KeyO: 'o',
      KeyP: 'p',
      KeyQ: 'q',
      KeyR: 'r',
      KeyS: 's',
      KeyT: 't',
      KeyU: 'u',
      KeyV: 'v',
      KeyW: 'w',
      KeyX: 'x',
      KeyY: 'y',
      KeyZ: 'z',
    }
    return keyMap[code] || code.toLowerCase()
  }

  function matchShortcut(e, shortcut) {
    return (e.altKey === shortcut.altKey
         && e.ctrlKey === shortcut.ctrlKey
         && e.shiftKey === shortcut.shiftKey
         && e.metaKey === shortcut.metaKey
         && shortcut.keys.every(key => getKeyDisplay(e.code) === key.toLowerCase()))
  }

  // 修改快捷键监听
  document.addEventListener('keydown', (e) => {
    // 如果模态框打开，不响应复制快捷键
    if (isModalOpen) { return }

    const normalShortcut = parseShortcut(shortcut)
    const mdShortcut = parseShortcut(markdownShortcut)

    if (matchShortcut(e, normalShortcut)) {
      e.preventDefault()
      copyLink(false)
    }
    else if (matchShortcut(e, mdShortcut)) {
      e.preventDefault()
      copyLink(true)
    }
  })

  // 注册油猴菜单命令
  GM_registerMenuCommand('设置', openSettings)
})()
