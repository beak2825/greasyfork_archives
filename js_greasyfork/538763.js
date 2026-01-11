// ==UserScript==
// @name         Emby Functions Enhanced
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Add buttons on top of target element to generate thumbs and open path with enhanced error handling and performance
// @author       Wayne
// @match        http://192.168.0.47:10074/*
// @grant        GM.xmlHttpRequest
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538763/Emby%20Functions%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/538763/Emby%20Functions%20Enhanced.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration
  const CONFIG = {
    EMBY_LOCAL_ENDPOINT: 'http://192.168.0.47:10162/generate_thumb',
    DOPUS_LOCAL_ENDPOINT: 'http://127.0.0.1:58000',
    TOAST_DURATION: 5000,
    REQUEST_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    CHECK_INTERVAL: 300,
  }

  // State
  let lastProcessedPath = null
  let lastUrl = ''
  let buttonsContainer = null
  const state = {
    pendingRequests: new Set(),
  }

  // Utility: Validate path
  const validatePath = path => {
    return (
      path &&
      typeof path === 'string' &&
      path.trim().length > 0 &&
      (path.includes('/') || path.includes('\\'))
    )
  }

  // Utility: Sanitize path
  const sanitizePath = path => path?.trim().replace(/[<>:"|?*]/g, '_') || ''

  // Toast notification system - Pure Black Theme
  function showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const typeStyles = {
      info: {
        background: 'rgba(40, 40, 40, 0.95)',
        color: '#fff',
        icon: 'ℹ️'
      },
      success: {
        background: 'rgba(52, 199, 89, 0.95)',
        color: '#fff',
        icon: '✓'
      },
      error: {
        background: 'rgba(255, 59, 48, 0.95)',
        color: '#fff',
        icon: '✕'
      },
      warning: {
        background: 'rgba(255, 149, 0, 0.95)',
        color: '#fff',
        icon: '⚠'
      },
    }

    let container = document.getElementById('userscript-toast-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'userscript-toast-container'
      Object.assign(container.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: '10000',
        pointerEvents: 'none',
      })
      document.body.appendChild(container)
    }

    const toast = document.createElement('div')
    const style = typeStyles[type]

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 16px; font-weight: 600;">${style.icon}</span>
        <span>${message}</span>
      </div>
    `

    Object.assign(toast.style, {
      background: style.background,
      color: style.color,
      padding: '14px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      fontWeight: '500',
      maxWidth: '320px',
      wordWrap: 'break-word',
      opacity: '0',
      transform: 'translateX(100%) scale(0.9)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pointerEvents: 'auto',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    })

    container.appendChild(toast)

    requestAnimationFrame(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateX(0) scale(1)'
    })

    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateX(100%) scale(0.9)'
      setTimeout(() => {
        if (toast.parentNode) toast.remove()
      }, 400)
    }, duration)

    return toast
  }

  // HTTP Request wrapper
  async function makeRequest(url, options = {}) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        CONFIG.REQUEST_TIMEOUT
      )

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          console.error('HTTP 404 for URL:', url)
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out')
      }
      throw error
    }
  }

  // Request with retry
  async function makeRequestWithRetry(
    url,
    options = {},
    maxRetries = CONFIG.RETRY_ATTEMPTS
  ) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await makeRequest(url, options)
      } catch (error) {
        if (attempt === maxRetries) throw error
        console.warn(`Request attempt ${attempt + 1} failed:`, error.message)
        await new Promise(resolve =>
          setTimeout(resolve, CONFIG.RETRY_DELAY * (attempt + 1))
        )
      }
    }
  }

  // Thumbnail generation handler
  function createThumbnailHandler(mode, description) {
    return async path => {
      const sanitizedPath = sanitizePath(path)
      if (!validatePath(sanitizedPath)) {
        showToast('Invalid path provided', 'error')
        return
      }

      const loadingToast = showToast(
        `${description} for ${sanitizedPath}...`,
        'info'
      )

      try {
        const encodedPath = encodeURIComponent(sanitizedPath)
        const url = `${CONFIG.EMBY_LOCAL_ENDPOINT}?path=${encodedPath}&mode=${mode}`

        console.log(`Generating ${mode} thumb:`, sanitizedPath)

        await makeRequestWithRetry(url)
        loadingToast.remove()
        showToast(`${description} completed successfully`, 'success')
      } catch (error) {
        loadingToast.remove()
        showToast(
          `Failed to generate ${mode} thumbnail: ${error.message}`,
          'error'
        )
      }
    }
  }

  function sendDataToLocalServer(data, path) {
    let url = `${CONFIG.DOPUS_LOCAL_ENDPOINT}/${path}/`
    GM.xmlHttpRequest({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Open path in Directory Opus
  async function openPath(path) {
    try {
      const data = {
        full_path: path,
      }
      sendDataToLocalServer(data, 'openFolder')
      showToast('Path opened in Directory Opus', 'success')
      console.log('Opened in Directory Opus')
    } catch (error) {
      showToast(`Failed to open path: ${error.message}`, 'error')
    }
  }

  // Trim Input Dialog - Pure Black Theme
  function showTrimInputDialog(defaultStart = '', defaultEnd = '') {
    return new Promise(resolve => {
      const timeToSeconds = (h, m, s) =>
        parseInt(h || 0) * 3600 + parseInt(m || 0) * 60 + parseInt(s || 0)
      const parseDefaultTime = s => {
        if (!s) return { h: '', m: '', s: '' }
        let h = Math.floor(s / 3600),
          m = Math.floor((s % 3600) / 60),
          sec = s % 60
        return {
          h: String(h).padStart(2, '0'),
          m: String(m).padStart(2, '0'),
          s: String(sec).padStart(2, '0'),
        }
      }
      const defS = parseDefaultTime(defaultStart)
      const defE = parseDefaultTime(defaultEnd)

      // Overlay
      const overlay = document.createElement('div')
      overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:99999;display:flex;justify-content:center;align-items:center;animation:fadeIn 0.3s ease;`

      const modal = document.createElement('div')
      modal.style.cssText = `background:rgba(20,20,20,0.98);color:#fff;padding:32px;border-radius:20px;width:420px;max-width:90%;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column;gap:24px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 1px rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);animation:scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);`

      const style = document.createElement('style')
      style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `
      document.head.appendChild(style)

      const title = document.createElement('h3')
      title.textContent = 'Trim Video'
      title.style.cssText = `margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;text-align:center;`

      const createGroup = (label, def) => {
        const d = document.createElement('div')
        d.innerHTML = `<label style="display:block;margin-bottom:10px;font-size:13px;font-weight:600;color:#888;letter-spacing:0.3px;">${label}</label>
            <div style="display:flex;gap:10px;align-items:center;justify-content:center;">
                <input type="text" placeholder="00" value="${def.h}" maxlength="2" style="width:70px;padding:16px;background:#1a1a1a;border:2px solid #333;color:#fff;text-align:center;border-radius:12px;font-size:20px;font-weight:600;font-family:-apple-system,monospace;outline:none;transition:all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                <span style="color:#666;font-weight:600;font-size:20px;">:</span>
                <input type="text" placeholder="00" value="${def.m}" maxlength="2" style="width:70px;padding:16px;background:#1a1a1a;border:2px solid #333;color:#fff;text-align:center;border-radius:12px;font-size:20px;font-weight:600;font-family:-apple-system,monospace;outline:none;transition:all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                <span style="color:#666;font-weight:600;font-size:20px;">:</span>
                <input type="text" placeholder="00" value="${def.s}" maxlength="2" style="width:70px;padding:16px;background:#1a1a1a;border:2px solid #333;color:#fff;text-align:center;border-radius:12px;font-size:20px;font-weight:600;font-family:-apple-system,monospace;outline:none;transition:all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
            </div>`

        const inputs = d.querySelectorAll('input')
        inputs.forEach(input => {
          input.onfocus = () => {
            input.style.borderColor = '#007aff'
            input.style.background = '#252525'
          }
          input.onblur = () => {
            input.style.borderColor = '#333'
            input.style.background = '#1a1a1a'
          }
          input.addEventListener('focus', function () {
            this.select()
          })
          input.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '')
          })
        })

        return d
      }

      const startGroup = createGroup('START TIME', defS)
      const endGroup = createGroup('END TIME', defE)

      const btns = document.createElement('div')
      btns.style.cssText = `display:flex;gap:12px;margin-top:8px;`

      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = 'Cancel'
      cancelBtn.style.cssText = `flex:1;padding:14px 24px;border-radius:12px;border:1px solid #333;background:transparent;color:#fff;cursor:pointer;font-size:15px;font-weight:600;font-family:-apple-system;transition:all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);`
      cancelBtn.onmouseover = () => {
        cancelBtn.style.background = 'rgba(255,255,255,0.05)'
        cancelBtn.style.transform = 'scale(0.98)'
      }
      cancelBtn.onmouseout = () => {
        cancelBtn.style.background = 'transparent'
        cancelBtn.style.transform = 'scale(1)'
      }

      const okBtn = document.createElement('button')
      okBtn.textContent = 'Trim Video'
      okBtn.style.cssText = `flex:1;padding:14px 24px;border-radius:12px;border:none;background:#007aff;color:#fff;cursor:pointer;font-weight:600;font-size:15px;font-family:-apple-system;transition:all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);`
      okBtn.onmouseover = () => {
        okBtn.style.background = '#0051d5'
        okBtn.style.transform = 'scale(0.98)'
      }
      okBtn.onmouseout = () => {
        okBtn.style.background = '#007aff'
        okBtn.style.transform = 'scale(1)'
      }

      btns.append(cancelBtn, okBtn)
      modal.append(title, startGroup, endGroup, btns)
      overlay.append(modal)
      document.body.appendChild(overlay)

      const getInput = g => {
        const i = g.querySelectorAll('input')
        return timeToSeconds(i[0].value, i[1].value, i[2].value)
      }

      startGroup.querySelector('input').focus()

      cancelBtn.onclick = () => {
        overlay.style.opacity = '0'
        modal.style.transform = 'scale(0.9)'
        setTimeout(() => {
          document.body.removeChild(overlay)
          style.remove()
          resolve(null)
        }, 200)
      }
      okBtn.onclick = () => {
        const s = getInput(startGroup)
        const e = getInput(endGroup)
        const res = {}
        if (s > 0 || startGroup.querySelectorAll('input')[2].value === '00')
          res.start_sec = s
        if (e > 0 || endGroup.querySelectorAll('input')[2].value === '00')
          res.end_sec = e

        overlay.style.opacity = '0'
        modal.style.transform = 'scale(0.9)'
        setTimeout(() => {
          document.body.removeChild(overlay)
          style.remove()
          resolve(res)
        }, 200)
      }
    })
  }

  // Trim handler
  function createTrimHandler(mode, description) {
    return async path => {
      const sanitizedPath = sanitizePath(path)
      if (!validatePath(sanitizedPath)) {
        showToast('Invalid path provided', 'error')
        return
      }

      const trimSeconds = await showTrimInputDialog()
      if (trimSeconds === null) {
        showToast('Trim operation cancelled', 'info')
        return
      }

      const loadingToast = showToast(`${description}...`, 'info')

      try {
        const encodedPath = encodeURIComponent(sanitizedPath)
        const urlParams = new URLSearchParams()
        urlParams.append('path', encodedPath)
        urlParams.append('mode', mode)
        if (trimSeconds.start_sec !== undefined)
          urlParams.append('start_sec', trimSeconds.start_sec)
        if (trimSeconds.end_sec !== undefined)
          urlParams.append('end_sec', trimSeconds.end_sec)

        const url = `${CONFIG.EMBY_LOCAL_ENDPOINT}?${urlParams.toString()}`
        console.log(`${mode}:`, sanitizedPath, trimSeconds)

        await makeRequestWithRetry(url)
        loadingToast.remove()
        showToast(`${description} completed`, 'success')
      } catch (error) {
        loadingToast.remove()
        showToast(`Failed: ${error.message}`, 'error')
      }
    }
  }

  // Create button helper - Colorized Apple Style
  function createButton(text, onClick, bgColor, textColor = '#000') {
    const button = document.createElement('button')
    button.textContent = text
    button.onclick = onClick

    Object.assign(button.style, {
      padding: '10px 18px',
      fontSize: '13px',
      fontWeight: '600',
      color: textColor,
      background: bgColor,
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
      marginRight: '8px',
      marginBottom: '8px',
      letterSpacing: '-0.2px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    })

    button.onmouseenter = () => {
      button.style.transform = 'translateY(-2px) scale(1.02)'
      button.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)'
      button.style.filter = 'brightness(1.15)'
    }
    button.onmouseleave = () => {
      button.style.transform = 'translateY(0) scale(1)'
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
      button.style.filter = 'brightness(1)'
    }
    button.onmousedown = () => {
      button.style.transform = 'translateY(0) scale(0.98)'
    }
    button.onmouseup = () => {
      button.style.transform = 'translateY(-2px) scale(1.02)'
    }

    return button
  }

  // Utility: Check if element is visible
  const isVisible = elem => {
    return !!(
      elem.offsetWidth ||
      elem.offsetHeight ||
      elem.getClientRects().length
    )
  }

  // Find the active/visible media info header
  function findActiveHeader() {
    const headers = document.querySelectorAll('.mediaInfoHeader')
    for (const header of headers) {
      if (isVisible(header)) {
        return header
      }
    }
    return null
  }

  // Find path from the ACTIVE media source container
  function findPathForHeader(header) {
    const viewContainer =
      header.closest('.itemDetailPage') || header.parentElement.parentElement
    if (!viewContainer) return null

    const mediaSource = viewContainer.querySelector('.mediaSources')
    if (!mediaSource) return null

    const selectors = [
      'div:nth-child(2) > div > div:first-child',
      'div:first-child > div > div:first-child',
      'div div div:first-child',
    ]

    for (const sel of selectors) {
      const el = mediaSource.querySelector(sel)
      if (el && isVisible(el)) {
        const text = el.textContent.trim()
        if (validatePath(text) && text.length < 500) {
          return text
        }
      }
    }

    const walker = document.createTreeWalker(mediaSource, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim()
      if (validatePath(text) && text.length > 2) {
        if (text.includes('/') || text.includes('\\')) {
          return text
        }
      }
    }

    return null
  }

  // Main function to add buttons
  function tryAddButtons() {
    const currentUrl = location.href

    if (!currentUrl.includes('#!/item?id=')) {
      if (buttonsContainer) {
        buttonsContainer.remove()
        buttonsContainer = null
        lastProcessedPath = null
      }
      return
    }

    const activeHeader = findActiveHeader()
    if (!activeHeader) return

    const path = findPathForHeader(activeHeader)
    if (!path || !validatePath(path)) return

    const nextSibling = activeHeader.nextSibling
    const alreadyHasButtons =
      nextSibling &&
      nextSibling.id === 'emby-userscript-buttons' &&
      document.body.contains(nextSibling)

    if (alreadyHasButtons && lastProcessedPath === path) return

    if (buttonsContainer) {
      if (buttonsContainer !== nextSibling) {
        buttonsContainer = null
      } else if (lastProcessedPath !== path) {
        buttonsContainer.remove()
        buttonsContainer = null
      }
    }

    lastProcessedPath = path
    console.log('✅ Emby Enhanced: Adding buttons for path:', path)

    buttonsContainer = document.createElement('div')
    buttonsContainer.id = 'emby-userscript-buttons'

    // Get the computed style of the header to match alignment
    const headerStyles = window.getComputedStyle(activeHeader)
    const headerPaddingLeft = headerStyles.paddingLeft

    Object.assign(buttonsContainer.style, {
      marginBottom: '20px',
      marginTop: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      paddingLeft: headerPaddingLeft, // Align with header text
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      background: 'transparent',
      position: 'relative',
      zIndex: '100',
    })

    const singleThumbHandler = createThumbnailHandler(
      'single',
      'Generating single thumbnail'
    )
    const fullThumbHandler = createThumbnailHandler(
      'full',
      'Generating full thumbnail'
    )
    const skipThumbHandler = createThumbnailHandler(
      'skip',
      'Generating thumbnail (skip existing)'
    )
    const singleTrimHandler = createTrimHandler('trim', 'Trimming single video')
    const fullTrimHandler = createTrimHandler('fulltrim', 'Trimming all videos')

    const buttons = [
      createButton('📁 Open Path', () => openPath(path), '#FF9500'),
      createButton('🖼️ Single Thumb', () => singleThumbHandler(path), '#34C759'),
      createButton('🎬 Full Thumb', () => fullThumbHandler(path), '#007AFF'),
      createButton('⏭️ Skip Existing', () => skipThumbHandler(path), '#AF52DE'),
      createButton('✂️ Trim Single', () => singleTrimHandler(path), '#FF3B30'),
      createButton('✂️ Trim All', () => fullTrimHandler(path), '#FF2D55'),
    ]

    buttons.forEach(btn => buttonsContainer.appendChild(btn))

    if (activeHeader.nextSibling) {
      activeHeader.parentElement.insertBefore(
        buttonsContainer,
        activeHeader.nextSibling
      )
    } else {
      activeHeader.parentElement.appendChild(buttonsContainer)
    }
  }

  // Main check loop
  function startCheckLoop() {
    setInterval(() => {
      tryAddButtons()
    }, CONFIG.CHECK_INTERVAL)
  }

  // Initialize
  console.log('🚀 Emby Functions Enhanced v6.5 - Pure Black Apple UI')
  lastUrl = location.href
  startCheckLoop()
  setTimeout(tryAddButtons, 500)
})()