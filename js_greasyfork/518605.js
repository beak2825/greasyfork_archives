// ==UserScript==
// @name         Clean Bilibili
// @namespace    https://ntnyq.com
// @version      0.0.8
// @description  Cleanup moot UI widgets from bilibili.
// @author       ntnyq (https://ntnyq.com)
// @license      MIT
// @homepageURL  https://github.com/ntnyq/clean-bilibili
// @supportURL   https://github.com/ntnyq/clean-bilibili
// @match        http*://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=live.bilibili.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/518605/Clean%20Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/518605/Clean%20Bilibili.meta.js
// ==/UserScript==

// @ts-check

/**
 * @typedef Logger
 * @property {(...args: any[]) => void} log log
 * @property {(...args: any[]) => void} warn warn
 * @property {(...args: any[]) => void} error error
 * @property {(...args: any[]) => void} info info
 */

/**
 * @typedef {() => boolean} Condition
 */

;(function () {
  'use strict'

  const SCRIPT_NAME = 'clean_bilibili'

  /**
   * Create logger
   * @returns {Logger} logger instance
   */
  function createLogger() {
    const prefix = `[${SCRIPT_NAME}]`
    return {
      log: (...args) => console.log(prefix, ...args),
      warn: (...args) => console.warn(prefix, ...args),
      error: (...args) => console.error(prefix, ...args),
      info: (...args) => console.info(prefix, ...args),
    }
  }
  const logger = createLogger()

  /**
   * Wait for elements to be ready
   * @param {string} selector - selector to watch
   * @returns {Promise<Element[]>} elements
   */
  function waitForElements(selector) {
    return new Promise(resolve => {
      if (document.querySelectorAll(selector).length > 0) {
        resolve(Array.from(document.querySelectorAll(selector)))
      }

      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector).length > 0) {
          resolve(Array.from(document.querySelectorAll(selector)))
          observer.disconnect()
        }
      })

      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      } catch {
        // If failed, try again in 100ms
        setTimeout(() => {
          resolve(waitForElements(selector))
        }, 100)
      }
    })
  }

  /**
   * Wait until conditions are met
   *
   * @param {Condition | Condition[]} conditions - conditions
   * @param {() => void} callback - callback
   */
  function waitUntil(conditions, callback) {
    const observer = new MutationObserver(() => {
      const matchCondition = Array.isArray(conditions)
        ? conditions.every(condition => condition())
        : conditions()

      if (!matchCondition) return

      callback()
      observer.disconnect()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  /**
   * Create UI for the options
   * @param {string} key - option key
   * @param {string} title - option title
   * @param {boolean} defaultValue - option default-value
   * @returns {{ value: boolean }} value ref
   */
  function useOption(key, title, defaultValue) {
    if (typeof GM_getValue === 'undefined') {
      return {
        value: defaultValue,
      }
    }
    let value = GM_getValue(key, defaultValue)
    const ref = {
      get value() {
        return value
      },
      set value(v) {
        value = v
        GM_setValue(key, v)
        location.reload()
      },
    }
    GM_registerMenuCommand(`${title}: ${value ? '✅' : '❌'}`, () => {
      ref.value = !value
    })
    return ref
  }

  const doc = document

  // Up 主投稿 创作中心
  const HIDE_UP_ENTRY = useOption('bilibili_hide_up_entry', 'Hide UP Entry', true)
  // 话题 - 动态页面
  const HIDE_TOPIC_PANEL = useOption('bilibili_hide_topic_panel', 'Hide Topic Panel', true)
  // 显示关注时间
  const ENABLE_FOLLOW_TIME = useOption('bilibili_enable_follow_time', 'Enable Follow Time', true)

  /** @type {string[]} */
  const HIDE_SELECTORS = [
    /**
     * ================================
     *              全局
     * ================================
     */
    // 游戏中心
    '.bili-header .left-entry .default-entry[href*="game.bilibili.com"]',
    // 会员购
    '.bili-header .left-entry .default-entry[href*="show.bilibili.com"]',
    // 漫画
    '.bili-header .left-entry .default-entry[href*="manga.bilibili.com"]',
    // 赛事
    '.bili-header .left-entry .default-entry[href*="www.bilibili.com/match"]',
    // 年度报告
    '.bili-header .left-entry .loc-entry.loc-moveclip',
    // 番剧
    '.bili-header .left-entry .default-entry[href*="www.bilibili.com/bangumi/play"]',
    '.bili-header .left-entry .left-loc-entry a[href*="www.bilibili.com/bangumi/play"]',
    // 下载客户端
    '.bili-header .left-entry .download-entry[href*="app.bilibili.com"]',
    // 桌面端提示
    '.desktop-download-tip',

    /**
     * ================================
     *              个人动态
     * ================================
     */
    // 轮播广告
    '.bili-dyn-ads',

    /**
     * ================================
     *              视频页面
     * ================================
     */
    // 右侧轮播
    '.slide-ad-exp', // also #slide_ad
    // 游戏推荐
    '.video-page-game-card-small',
    // 评论区顶部推荐 右侧推荐区底部
    '.ad-report.ad-floor-exp',

    /**
     * ================================
     *              用户空间
     * ================================
     */
    // 最近玩儿过的游戏
    '.s-space .col-2 .section.game',

    /**
     * ================================
     *              直播页面
     * ================================
     */
    '#head-info-vm .activity-gather-entry',

    ...(HIDE_UP_ENTRY.value ? ['.bili-header .right-entry a[href*="member.bilibili.com"]'] : []),

    ...(HIDE_TOPIC_PANEL.value ? ['.sticky .bili-dyn-topic-box'] : []),
  ].filter(Boolean)

  /** @type {string[]} */
  const INJECTED_STYLE = [
    // 隐藏元素
    `${HIDE_SELECTORS.join(',')} { display: none !important;}`,
  ]

  async function onUserSpace() {
    if (!ENABLE_FOLLOW_TIME.value) {
      return logger.info('Follow time disabled')
    }

    if (/^https?:\/\/space\.bilibili\.com\/\d{3,}/.test(location.href)) {
      const getSpaceMid = () => location.pathname.split('/').at(1)
      const mid = getSpaceMid()

      if (!mid) return

      /**  @type any */
      let res = await unsafeWindow.fetch(
        `https://api.bilibili.com/x/space/acc/relation?mid=${mid}`,
        {
          credentials: 'include',
        },
      )
      res = await res.json()

      const mtime = /** @type {number?} */ (res?.data?.relation?.mtime)

      if (!mtime) return logger.error('Failed to get follow time')

      const result = new Date(mtime * 1000).toLocaleString()

      const panel = doc.querySelector('.s-space .col-2')

      if (!panel) return
      const section = doc.createElement('div')

      section.classList.add('section')
      section.innerHTML = `
        <span>关注时间:</span>
        <strong>${result}</strong>
      `

      panel.prepend(section)
    }
  }

  async function hideShadowDOM() {
    const styleSheet = new CSSStyleSheet()
    styleSheet.replaceSync('#notice { display: none !important; }')
    document
      .querySelector('#commentapp bili-comments')
      ?.shadowRoot?.querySelector('bili-comments-header-renderer')
      ?.shadowRoot?.adoptedStyleSheets.push(styleSheet)
  }

  async function registerSevices() {
    waitForElements('#page-dynamic').then(onUserSpace)
    waitUntil(
      () => !!document.querySelector('#commentapp bili-comments'),
      () => {
        hideShadowDOM()
      },
    )
  }

  /**
   * Inject style
   */
  function injectStyle() {
    const el = doc.createElement('style')

    el.id = `${SCRIPT_NAME}_style`
    el.innerHTML = INJECTED_STYLE.join('')
    doc.head.append(el)

    logger.info('Style injected')
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', () => {
      injectStyle()
      registerSevices()
    })
  } else {
    injectStyle()
    registerSevices()
  }
})()