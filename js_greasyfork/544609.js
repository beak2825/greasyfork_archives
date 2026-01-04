// ==UserScript==
// @name         显示 B 站视频评论 IP 归属地
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  The video comment ip of bilibili is displayed
// @author       showlotus
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @homepage     https://github.com/showlotus/tampermonkey-scripts/blob/main/packages/bilibili-comment-ip
// @supportURL   https://github.com/showlotus/tampermonkey-scripts/issues
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544609/%E6%98%BE%E7%A4%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%20IP%20%E5%BD%92%E5%B1%9E%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/544609/%E6%98%BE%E7%A4%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%20IP%20%E5%BD%92%E5%B1%9E%E5%9C%B0.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const logger = {
    info: (...args) => {
      console.info('%c[bilibili-comment-ip]', 'color: #2196F3', ...args)
    },
    warn: (...args) => {
      console.warn('%c[bilibili-comment-ip]', 'color: #FF9800', ...args)
    },
    error: (...args) => {
      console.error('%c[bilibili-comment-ip]', 'color: #F44336', ...args)
    }
  }

  logger.info('🚀 start...')

  const PROXY_URL_LIST = [
    'api.bilibili.com/x/v2/reply/wbi/main',
    'api.bilibili.com/x/v2/reply/reply'
  ]

  const isTargetUrl = url => {
    return PROXY_URL_LIST.some(proxyUrl => url.includes(proxyUrl))
  }

  // 保存原始的 fetch 函数
  const originalFetch = window.fetch

  // 重写 fetch 函数
  window.fetch = async function (input, init) {
    // 安全地获取 URL
    let url
    try {
      if (typeof input === 'string') {
        url = input
      } else if (input instanceof Request) {
        url = input.url
      } else if (input && input.url) {
        url = input.url
      } else {
        // 如果无法获取 URL，直接使用原始 fetch
        return originalFetch(input, init)
      }
    } catch (error) {
      logger.warn('⚠️ [Fetch] 无法解析请求 URL:', error)
      return originalFetch(input, init)
    }

    // 检查是否是目标 API
    if (isTargetUrl(url)) {
      logger.info('🚀 [Fetch] 拦截到 Bilibili 评论请求:', url)

      try {
        // 获取请求参数
        const urlObj = new URL(url, window.location.origin)
        const params = Object.fromEntries(urlObj.searchParams.entries())
        logger.info('📋 [Fetch] 请求参数:', params)

        // 发起原始请求
        const response = await originalFetch(input, init)

        // 克隆响应以便读取
        const responseClone = response.clone()
        const responseData = await responseClone.json()

        logger.info('✅ [Fetch] 原始请求成功，返回真实数据')
        logger.info('📊 [Fetch] 原始响应数据:', responseData)

        // 修改响应数据
        responseData?.data?.replies?.forEach(reply => {
          reply.member.uname += ` <${reply.reply_control.location}>`

          reply.replies?.forEach(rp => {
            rp.member.uname += ` <${rp.reply_control.location}>`
          })
        })

        logger.info('🔧 [Fetch] 修改后的响应数据:', responseData)

        // 返回修改后的响应
        return new Response(JSON.stringify(responseData), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })
      } catch (error) {
        logger.error('❌ [Fetch] 原始请求失败:', error)
        throw error
      }
    }

    // 对于其他请求，使用原始的 fetch
    return originalFetch(input, init)
  }
})()
