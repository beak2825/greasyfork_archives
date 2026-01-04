// ==UserScript==
// @author       Lete114
// @version      0.1
// @license      MIT License
// @name         ChatGPT 错误自动刷新
// @description  (自用脚本) 报错自动刷新，并填充之前报错的提问内容，保活
// @match        https://chat.openai.com/*
// @icon         https://chat.openai.com/favicon.ico
// @namespace    https://github.com/Lete114/my-tampermonkey-scripts
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/464471/ChatGPT%20%E9%94%99%E8%AF%AF%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464471/ChatGPT%20%E9%94%99%E8%AF%AF%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const $ = (Selector, el) => (el || document).querySelector(Selector)
  const $$ = (Selector, el) => (el || document).querySelectorAll(Selector)

  const key = 'ChatGPT_question_cache'
  const activateURL = 'https://chat.openai.com/api/auth/session'
  const activateSecond = Number(localStorage.getItem('activateSecond')) || 60
  let activateMinute = Number(localStorage.getItem('activateMinute')) || 10

  let activateTimer = activateChatGPT(activateSecond)
  function activateChatGPT(ms) {
    return setInterval(() => {
      fetch(activateURL).then((response) => {
        if (response.ok) return
        // 请求错误时重试 1 次
        // 如果重试后依然错误，则重新加载页面
        fetch(activateURL).then((response) => {
          if (response.ok) return
          location.reload()
        })
      })
    }, ms * 1000)
  }

  let currentTabPageVisibilityTimer
  document.addEventListener('visibilitychange', handlerCurrentTabPageVisibility)
  function handlerCurrentTabPageVisibility() {
    if (document.hidden) {
      currentTabPageVisibilityTimer = setTimeout(() => {
        clearInterval(activateTimer)
      }, activateMinute * 60 * 1000)
    } else {
      clearTimeout(currentTabPageVisibilityTimer)
    }
  }

  const promptTimeout = '离开ChatGPT标签页超过指定时间后停止激活(默认10分钟)'
  GM_registerMenuCommand(promptTimeout, () => {
    const minute = Number(window.prompt(promptTimeout, activateMinute))
    if (minute) {
      activateMinute = minute
      localStorage.setItem('activateMinute', minute)
    }
  })

  const promptActivate = '多少秒激活一次ChatGPT(默认60秒)建议设置30秒'
  GM_registerMenuCommand(promptActivate, function () {
    const second = Number(window.prompt(promptActivate, activateSecond))
    if (second) {
      clearInterval(activateTimer)
      localStorage.setItem('activateSecond', second)
      activateTimer = activateChatGPT(second)
    }
  })

  window.addEventListener('load', () => {
    const value = sessionStorage.getItem(key)
    if (!value) return
    const id = setInterval(() => {
      const input = $('textarea')
      const mask = $$('.rounded-sm')
      if (!input || !(mask && mask.length)) return
      if (!input.value) input.value = value
      input.nextElementSibling.removeAttribute('disabled')
      // 如果需要自动提交就解开下方代码的注释
      // input.parentElement.querySelector('button').click()
      sessionStorage.setItem(key, '')
      clearInterval(id)
    }, 2000)
  })

  const id = setInterval(() => {
    const el = $$('.border-red-500')
    if (el && el.length) {
      // 灰色 div 容器（ChatGPT 回复）
      const ai = $$('div.bg-gray-50')
      const last = ai[ai.length - 1]
      if (last.textContent) {
        sessionStorage.setItem(
          key,
          $('.whitespace-pre-wrap', last.previousSibling).textContent
        )
        clearInterval(id)
        location.reload()
      }
    }
  }, 500)
})()
