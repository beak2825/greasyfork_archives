// ==UserScript==
// @name Twitter / X 回到顶部按钮
// @namespace twitter-top-button
// @version 1.0.1
// @description 在 Twitter / X 页面添加回到顶部按钮，支持快捷键 T
// @author ryanuo
// @match https://twitter.com/*
// @match https://x.com/*
// @grant none
// @run-at document-idle
// @license apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/545242/Twitter%20%20X%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/545242/Twitter%20%20X%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(() => {
  'use strict'
  const BUTTON_ID = 'tm-back-to-top-btn-ryanuo'
  const SCROLL_THRESHOLD = 300
  const style = `
    #${BUTTON_ID} {
      position: fixed;
      right: 20px;
      bottom: 28px;
      z-index: 999999;
      width: 46px;
      height: 46px;
      border-radius: 999px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      background: linear-gradient(135deg,#1d9bf0 0%,#0b7cd6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: translateY(10px) scale(0.98);
      transition: opacity 200ms ease, transform 200ms ease;
      font-size: 20px;
      user-select: none;
    }
    #${BUTTON_ID}.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #${BUTTON_ID}:hover {
      box-shadow: 0 12px 28px rgba(0,0,0,0.3);
      transform: translateY(-2px) scale(1.02);
    }
    #${BUTTON_ID}.hidden-for-input {
      opacity: 0.4;
    }
    /* small screens */
    @media (max-width:480px){
      #${BUTTON_ID} { right: 12px; bottom: 20px; width:42px; height:42px; font-size:18px; }
    }
  `
  function injectStyle(cssText) {
    const s = document.createElement('style')
    s.setAttribute('type', 'text/css')
    s.textContent = cssText
    document.head.appendChild(s)
  }
  function createButton() {
    const existBtn = document.getElementById(BUTTON_ID)
    if (existBtn)
      return existBtn
    const btn = document.createElement('div')
    btn.id = BUTTON_ID
    btn.setAttribute('role', 'button')
    btn.setAttribute('aria-label', '回到顶部 (按 T)')
    btn.title = '回到顶部 (按 T)'
    btn.innerHTML = '↑'
    btn.addEventListener('click', scrollToTop)
    document.body.appendChild(btn)
    return btn
  }
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function shouldShowButton() {
    return window.scrollY > SCROLL_THRESHOLD
  }
  function updateButtonVisibility(btn) {
    if (shouldShowButton())
      btn.classList.add('visible')
    else btn.classList.remove('visible')
  }
  function isTypingInInput() {
    const active = document.activeElement
    if (!active)
      return false
    const tag = active.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || active.isContentEditable
  }
  function setupKeyboardShortcuts(_btn) {
    window.addEventListener('keydown', (e) => {
      if ((e.key === 't' || e.key === 'T') && !isTypingInInput()) {
        e.preventDefault()
        scrollToTop()
      }
    })
  }
  function init() {
    injectStyle(style)
    let btn = createButton()
    updateButtonVisibility(btn)
    let ticking = false
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateButtonVisibility(btn)
          ticking = false
        })
        ticking = true
      }
    }, { passive: true })
    document.addEventListener('focusin', () => {
      btn.classList.toggle('hidden-for-input', isTypingInInput())
    })
    document.addEventListener('focusout', () => {
      btn.classList.toggle('hidden-for-input', isTypingInInput())
    })
    setupKeyboardShortcuts()
    const mo = new MutationObserver(() => {
      if (!document.getElementById(BUTTON_ID)) {
        btn = createButton()
        setupKeyboardShortcuts()
      }
    })
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true })
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  }
  else {
    init()
  }
})()
