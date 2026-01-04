// ==UserScript==
// @name         LAPLACE 弹幕助手 - 哔哩哔哩直播间独轮车、弹幕发送
// @namespace    https://greasyfork.org/users/1524935
// @version      2.2.0
// @description  这是 bilibili 直播间简易版独轮车，基于 quiet/thusiant cmd 版本 https://greasyfork.org/scripts/421507 继续维护而来
// @author       laplace-live
// @license      AGPL-3.0
// @icon         https://laplace.live/favicon.ico
// @match        *://live.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552241/LAPLACE%20%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%8B%AC%E8%BD%AE%E8%BD%A6%E3%80%81%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/552241/LAPLACE%20%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%8B%AC%E8%BD%AE%E8%BD%A6%E3%80%81%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

/**
 * API configs
 * @const {Object.<string, string>}
 */
const BASE_URL = {
  /**
   * Fetches room basic info
   * @method GET
   * @param {string} id - room ID
   */
  BILIBILI_ROOM_INIT: 'https://api.live.bilibili.com/room/v1/Room/room_init',

  /**
   * Send chat
   * @method POST
   * @param {string} web_location - SPM prefix
   * @param {string} w_rid - WBI signature
   * @param {string} wts - WBI timestamp
   */
  BILIBILI_MSG_SEND: 'https://api.live.bilibili.com/msg/send',

  /**
   * Chat config
   * @method POST
   */
  BILIBILI_MSG_CONFIG: 'https://api.live.bilibili.com/xlive/web-room/v1/dM/AjaxSetConfig',

  /**
   * Get danmaku config by group
   * @method GET
   * @param {string} room_id - room ID
   * @param {string} web_location - SPM prefix
   * @param {string} w_rid - WBI signature
   * @param {string} wts - WBI timestamp
   */
  BILIBILI_GET_DM_CONFIG: 'https://api.live.bilibili.com/xlive/web-room/v1/dM/GetDMConfigByGroup',

  LAPLACE_CHAT_AUDIT: 'https://edge-workers.laplace.cn/laplace/chat-audit',
  // REMOTE_KEYWORDS: 'https://raw.githubusercontent.com/laplace-live/public/refs/heads/master/artifacts/livesrtream-keywords.json',
  REMOTE_KEYWORDS: 'https://workers.vrp.moe/gh-raw/laplace-live/public/master/artifacts/livesrtream-keywords.json',
}

/**
 * @typedef {Object} DanmakuColor
 * @property {string} name - Color name
 * @property {string} color - Color value in decimal
 * @property {string} color_hex - Color value in hex
 * @property {number} status - Status (0: disabled, 1: enabled)
 * @property {number} weight - Weight for sorting
 * @property {number} color_id - Color ID
 * @property {number} origin - Origin group
 */

/**
 * @typedef {Object} DanmakuColorGroup
 * @property {string} name - Group name
 * @property {number} sort - Sort order
 * @property {DanmakuColor[]} color - Available colors in this group
 */

/**
 * @typedef {Object} DanmakuMode
 * @property {string} name - Mode name
 * @property {number} mode - Mode value (1: scroll, 4: bottom, 5: top)
 * @property {string} type - Mode type string
 * @property {number} status - Status (0: disabled, 1: enabled)
 */

/**
 * @typedef {Object} DanmakuConfigData
 * @property {DanmakuColorGroup[]} group - Color groups
 * @property {DanmakuMode[]} mode - Display modes
 */

/**
 * @typedef {Object} DanmakuConfigResponse
 * @property {number} code - Response code
 * @property {DanmakuConfigData} data - Config data
 * @property {string} message - Response message
 * @property {string} msg - Response msg
 */

/**
 * Gets the spm_prefix value from the meta tag for web_location
 * @returns {string} The spm_prefix value
 */
function getSpmPrefix() {
  const metaTag = document.querySelector('meta[name="spm_prefix"]')
  return metaTag?.getAttribute('content') || '444.8'
}

// Hijack XHR to get wbi_img, which takes Claude 2 mins to bypass LOL😁
/** @type {{img_key: string, sub_key: string}|null} */
let cachedWbiKeys = null

;(() => {
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url
    return originalOpen.apply(this, [method, url, ...rest])
  }

  XMLHttpRequest.prototype.send = function (...args) {
    if (this._url?.includes('/x/web-interface/nav')) {
      console.log('[LAPLACE Chatterbox Helper] Intercepted request:', this._url)

      this.addEventListener('load', function () {
        try {
          const data = JSON.parse(this.responseText)
          if (data?.data?.wbi_img) {
            console.log('[LAPLACE Chatterbox Helper] wbi_img:', data.data.wbi_img)

            // Extract keys from URLs
            const img_url = data.data.wbi_img.img_url
            const sub_url = data.data.wbi_img.sub_url

            // Extract filename without extension (the key is in the filename)
            const img_key = img_url.split('/').pop().split('.')[0]
            const sub_key = sub_url.split('/').pop().split('.')[0]

            cachedWbiKeys = { img_key, sub_key }
            console.log('[LAPLACE Chatterbox Helper] Extracted WBI keys:', cachedWbiKeys)
          } else {
            console.log('[LAPLACE Chatterbox Helper] Response received but wbi_img not found:', data)
          }
        } catch (err) {
          console.error('[LAPLACE Chatterbox Helper] Error parsing response:', err)
        }
      })
    }

    return originalSend.apply(this, args)
  }
})()

/**
 * Waits for WBI keys to become available via XHR interception
 * @param {number} timeout - Maximum time to wait in ms
 * @param {number} interval - Polling interval in ms
 * @returns {Promise<boolean>} True if keys are available, false if timeout
 */
async function waitForWbiKeys(timeout = 5000, interval = 100) {
  const startTime = Date.now()
  while (!cachedWbiKeys) {
    if (Date.now() - startTime > timeout) {
      return false
    }
    await new Promise(r => setTimeout(r, interval))
  }
  return true
}

/**
 * @typedef {Object} BilibiliWbiKeys
 * @property {string} img_key - Image key extracted from wbi_img
 * @property {string} sub_key - Sub key extracted from wbi_img
 */

/** @type {string[]|null} */
let availableDanmakuColors = null

// https://s1.hdslb.com/bfs/static/laputa-home/client/assets/vendor.7679ec63.js
// function getMixinKey(ae){var oe=[46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52]
const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41,
  13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34,
  44, 52,
]

/**
 * Computes MD5 hash of a string in 2025😁
 * @param {string} str - The string to hash
 * @returns {string} The MD5 hash in hexadecimal format
 */
function md5(str) {
  function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s))
  }

  function addUnsigned(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  function cmn(q, a, b, x, s, t) {
    return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b)
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t)
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t)
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  function convertToWordArray(str) {
    const wordArray = []
    for (let i = 0; i < str.length * 8; i += 8) {
      wordArray[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return wordArray
  }

  function wordToHex(value) {
    let hex = ''
    for (let i = 0; i < 4; i++) {
      hex += ((value >> (i * 8 + 4)) & 0x0f).toString(16) + ((value >> (i * 8)) & 0x0f).toString(16)
    }
    return hex
  }

  const x = convertToWordArray(str)
  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476

  x[str.length >> 2] |= 0x80 << ((str.length % 4) * 8)
  x[(((str.length + 8) >> 6) << 4) + 14] = str.length * 8

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a
    const oldB = b
    const oldC = c
    const oldD = d

    a = ff(a, b, c, d, x[i + 0], 7, 0xd76aa478)
    d = ff(d, a, b, c, x[i + 1], 12, 0xe8c7b756)
    c = ff(c, d, a, b, x[i + 2], 17, 0x242070db)
    b = ff(b, c, d, a, x[i + 3], 22, 0xc1bdceee)
    a = ff(a, b, c, d, x[i + 4], 7, 0xf57c0faf)
    d = ff(d, a, b, c, x[i + 5], 12, 0x4787c62a)
    c = ff(c, d, a, b, x[i + 6], 17, 0xa8304613)
    b = ff(b, c, d, a, x[i + 7], 22, 0xfd469501)
    a = ff(a, b, c, d, x[i + 8], 7, 0x698098d8)
    d = ff(d, a, b, c, x[i + 9], 12, 0x8b44f7af)
    c = ff(c, d, a, b, x[i + 10], 17, 0xffff5bb1)
    b = ff(b, c, d, a, x[i + 11], 22, 0x895cd7be)
    a = ff(a, b, c, d, x[i + 12], 7, 0x6b901122)
    d = ff(d, a, b, c, x[i + 13], 12, 0xfd987193)
    c = ff(c, d, a, b, x[i + 14], 17, 0xa679438e)
    b = ff(b, c, d, a, x[i + 15], 22, 0x49b40821)

    a = gg(a, b, c, d, x[i + 1], 5, 0xf61e2562)
    d = gg(d, a, b, c, x[i + 6], 9, 0xc040b340)
    c = gg(c, d, a, b, x[i + 11], 14, 0x265e5a51)
    b = gg(b, c, d, a, x[i + 0], 20, 0xe9b6c7aa)
    a = gg(a, b, c, d, x[i + 5], 5, 0xd62f105d)
    d = gg(d, a, b, c, x[i + 10], 9, 0x02441453)
    c = gg(c, d, a, b, x[i + 15], 14, 0xd8a1e681)
    b = gg(b, c, d, a, x[i + 4], 20, 0xe7d3fbc8)
    a = gg(a, b, c, d, x[i + 9], 5, 0x21e1cde6)
    d = gg(d, a, b, c, x[i + 14], 9, 0xc33707d6)
    c = gg(c, d, a, b, x[i + 3], 14, 0xf4d50d87)
    b = gg(b, c, d, a, x[i + 8], 20, 0x455a14ed)
    a = gg(a, b, c, d, x[i + 13], 5, 0xa9e3e905)
    d = gg(d, a, b, c, x[i + 2], 9, 0xfcefa3f8)
    c = gg(c, d, a, b, x[i + 7], 14, 0x676f02d9)
    b = gg(b, c, d, a, x[i + 12], 20, 0x8d2a4c8a)

    a = hh(a, b, c, d, x[i + 5], 4, 0xfffa3942)
    d = hh(d, a, b, c, x[i + 8], 11, 0x8771f681)
    c = hh(c, d, a, b, x[i + 11], 16, 0x6d9d6122)
    b = hh(b, c, d, a, x[i + 14], 23, 0xfde5380c)
    a = hh(a, b, c, d, x[i + 1], 4, 0xa4beea44)
    d = hh(d, a, b, c, x[i + 4], 11, 0x4bdecfa9)
    c = hh(c, d, a, b, x[i + 7], 16, 0xf6bb4b60)
    b = hh(b, c, d, a, x[i + 10], 23, 0xbebfbc70)
    a = hh(a, b, c, d, x[i + 13], 4, 0x289b7ec6)
    d = hh(d, a, b, c, x[i + 0], 11, 0xeaa127fa)
    c = hh(c, d, a, b, x[i + 3], 16, 0xd4ef3085)
    b = hh(b, c, d, a, x[i + 6], 23, 0x04881d05)
    a = hh(a, b, c, d, x[i + 9], 4, 0xd9d4d039)
    d = hh(d, a, b, c, x[i + 12], 11, 0xe6db99e5)
    c = hh(c, d, a, b, x[i + 15], 16, 0x1fa27cf8)
    b = hh(b, c, d, a, x[i + 2], 23, 0xc4ac5665)

    a = ii(a, b, c, d, x[i + 0], 6, 0xf4292244)
    d = ii(d, a, b, c, x[i + 7], 10, 0x432aff97)
    c = ii(c, d, a, b, x[i + 14], 15, 0xab9423a7)
    b = ii(b, c, d, a, x[i + 5], 21, 0xfc93a039)
    a = ii(a, b, c, d, x[i + 12], 6, 0x655b59c3)
    d = ii(d, a, b, c, x[i + 3], 10, 0x8f0ccc92)
    c = ii(c, d, a, b, x[i + 10], 15, 0xffeff47d)
    b = ii(b, c, d, a, x[i + 1], 21, 0x85845dd1)
    a = ii(a, b, c, d, x[i + 8], 6, 0x6fa87e4f)
    d = ii(d, a, b, c, x[i + 15], 10, 0xfe2ce6e0)
    c = ii(c, d, a, b, x[i + 6], 15, 0xa3014314)
    b = ii(b, c, d, a, x[i + 13], 21, 0x4e0811a1)
    a = ii(a, b, c, d, x[i + 4], 6, 0xf7537e82)
    d = ii(d, a, b, c, x[i + 11], 10, 0xbd3af235)
    c = ii(c, d, a, b, x[i + 2], 15, 0x2ad7d2bb)
    b = ii(b, c, d, a, x[i + 9], 21, 0xeb86d391)

    a = addUnsigned(a, oldA)
    b = addUnsigned(b, oldB)
    c = addUnsigned(c, oldC)
    d = addUnsigned(d, oldD)
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
}

/**
 * Applies character order scrambling encoding to imgKey and subKey
 * @param {string} orig - Original string to encode (imgKey + subKey concatenated)
 * @returns {string} Mixed key (first 32 characters)
 */
function getMixinKey(orig) {
  return mixinKeyEncTab
    .map(n => orig[n])
    .join('')
    .slice(0, 32)
}

/**
 * Adds wts field to request parameters and performs wbi signature
 * @param {Object.<string, string|number>} params - Request parameters
 * @param {BilibiliWbiKeys} wbiKeys - WBI keys object
 * @returns {string} Query string with w_rid and wts parameters
 */
function encodeWbi(params, wbiKeys) {
  const mixin_key = getMixinKey(wbiKeys.img_key + wbiKeys.sub_key)
  const currentTime = Math.round(Date.now() / 1000)
  const charaFilter = /[!'()*]/g

  // Add wts field
  /** @type {Object.<string, string|number>} */
  const paramsWithWts = { ...params, wts: currentTime }

  // Sort parameters by key (only for signature calculation)
  const sortedQuery = Object.keys(paramsWithWts)
    .sort()
    .map(key => {
      // Filter "!'()*" characters from value
      const resolvedValue = paramsWithWts[key]?.toString() || ''
      const value = resolvedValue.replace(charaFilter, '')
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')

  // Calculate w_rid
  const wbi_sign = md5(sortedQuery + mixin_key)

  // Build returned query string (maintain original order, wts at the end)
  const unsortedQuery = Object.keys(params)
    .map(key => {
      const resolvedValue = params[key]?.toString() || ''
      const value = resolvedValue.replace(charaFilter, '')
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')

  return `${unsortedQuery}&w_rid=${wbi_sign}&wts=${currentTime}`
}

/** @type {string[]} */
const MsgTemplates = GM_getValue('MsgTemplates', [])

/** @type {number} */
let activeTemplateIndex = GM_getValue('activeTemplateIndex', 0)

/** @type {Object.<string, number|boolean>} */
const scriptInitVal = {
  msgSendInterval: 1,
  maxLength: 20,
  maxLogLines: 1000,
  randomColor: false,
  randomInterval: false,
  randomChar: false,
  aiEvasion: false,
  forceScrollDanmaku: false,
}

for (const initVal in scriptInitVal) {
  if (GM_getValue(initVal) === undefined) GM_setValue(initVal, scriptInitVal[initVal])
}

/** @type {boolean} */
let sendMsg = false

/**
 * Splits a string into grapheme clusters (user-perceived characters)
 * @param {string} str - The string to split into graphemes
 * @returns {string[]} An array of grapheme clusters
 */
function getGraphemes(str) {
  const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })
  return Array.from(segmenter.segment(str), ({ segment }) => segment)
}

/**
 * Emoji-safe splitting text into parts based on maximum grapheme length
 * @param {string} text - The text to split
 * @param {number} maxLength - Maximum number of graphemes per part
 * @returns {string[]} An array of text parts, each within the maxLength
 */
function trimText(text, maxLength) {
  if (!text) return [text]

  const graphemes = getGraphemes(text)
  if (graphemes.length <= maxLength) return [text]

  const parts = []
  let currentPart = []
  let currentLength = 0

  for (const char of graphemes) {
    if (currentLength >= maxLength) {
      parts.push(currentPart.join(''))
      currentPart = [char]
      currentLength = 1
    } else {
      currentPart.push(char)
      currentLength++
    }
  }

  if (currentPart.length > 0) {
    parts.push(currentPart.join(''))
  }

  return parts
}

/**
 * Appends a message to a textarea log with a maximum line limit
 * @param {HTMLTextAreaElement} logElement - The textarea element to append to
 * @param {string} message - The message to append
 * @param {number} maxLines - Maximum number of lines to keep in the log
 * @returns {void}
 */
function appendToLimitedLog(logElement, message, maxLines) {
  const lines = logElement.value.split('\n')
  if (lines.length >= maxLines) {
    // Keep only the last (maxLines - 1) lines and add the new message
    lines.splice(0, lines.length - maxLines + 1)
  }
  lines.push(message)
  logElement.value = lines.join('\n')
  logElement.scrollTop = logElement.scrollHeight
}

/**
 * Extracts the room number from a Bilibili live room URL
 * @param {string} url - The URL to extract the room number from
 * @returns {string|undefined} The room number, or undefined if not found
 */
function extractRoomNumber(url) {
  const urlObj = new URL(url)
  const pathSegments = urlObj.pathname.split('/').filter(segment => segment !== '')
  const roomNumber = pathSegments.find(segment => Number.isInteger(Number(segment)))
  return roomNumber
}

/**
 * Adds a random soft hyphen character at a random position in the text
 * @param {string} text - The text to modify
 * @returns {string} The modified text with a random character inserted
 */
function addRandomCharacter(text) {
  if (!text || text.length === 0) return text

  const graphemes = getGraphemes(text)
  const randomIndex = Math.floor(Math.random() * (graphemes.length + 1))
  graphemes.splice(randomIndex, 0, '­')
  return graphemes.join('')
}

/**
 * Processes messages by splitting lines, optionally adding random characters, and trimming to max length
 * @param {string} text - The text containing messages (one per line)
 * @param {number} maxLength - Maximum grapheme length per message
 * @param {boolean} [addRandomChar=false] - Whether to add random characters to each line
 * @returns {string[]} An array of processed message strings
 */
function processMessages(text, maxLength, addRandomChar = false) {
  return text
    .split('\n')
    .flatMap(line => {
      // Add random character if enabled
      if (addRandomChar && line && line.trim()) {
        line = addRandomCharacter(line)
      }
      // Then trim based on maxLength
      return trimText(line, maxLength)
    })
    .filter(line => line?.trim())
}

/** @type {number|null} */
let cachedRoomId = null

/** @type {Function|null} */
let onRoomIdReadyCallback = null

/** @type {Map<string, string>|null} */
let replacementMap = null

;(() => {
  const check = setInterval(() => {
    /** @type {HTMLDivElement} */
    const toggleBtn = document.createElement('div')
    toggleBtn.id = 'toggleBtn'
    toggleBtn.textContent = '弹幕助手'
    toggleBtn.style.cssText = `
      position: fixed;
      right: 4px;
      bottom: 4px;
      z-index: 2147483647;
      cursor: pointer;
      background: #777;
      color: white;
      padding: 6px 8px;
      border-radius: 4px;
      user-select: none;
    `
    document.body.appendChild(toggleBtn)

    /** @type {HTMLDivElement} */
    const list = document.createElement('div')
    list.style.cssText = `
      position: fixed;
      right: 4px;
      bottom: calc(4px + 30px);
      z-index: 2147483647;
      background: var(--bg1, #fff);
      display: none;
      padding: 10px;
      box-shadow: 0 0 0 1px var(--Ga2, rgba(0, 0, 0, .2));
      border-radius: 4px;
      min-width: 50px;
      max-height: calc(100vh - 64px);
      overflow-y: auto;
      width: 300px;
    `

    list.innerHTML = `<div>
      <!-- Tab Navigation -->
      <div style="display: flex; margin-block: -5px .75em; margin-inline: -10px; padding: 0 10px; gap: .25em; border-bottom: 1px solid var(--Ga2, #ddd);">
        <button id="tab-dulunche" class="tab-btn" style="padding: .25em .75em; margin-bottom: -1px; border: none; background: none; cursor: pointer; border-bottom: 1px solid transparent;">独轮车</button>
        <button id="tab-fasong" class="tab-btn" style="padding: .25em .75em; margin-bottom: -1px; border: none; background: none; cursor: pointer; border-bottom: 1px solid transparent;">常规发送</button>
        <button id="tab-settings" class="tab-btn" style="padding: .25em .75em; margin-bottom: -1px; border: none; background: none; cursor: pointer; border-bottom: 1px solid transparent;">设置</button>
      </div>

      <!-- Tab Content: 独轮车 -->
      <div id="content-dulunche" class="tab-content" style="display: none;">
        <div style="margin: .5em 0; display: flex; align-items: center; flex-wrap: wrap; gap: .25em;">
          <button id="sendBtn">开启独轮车</button>
          <select id="templateSelect" style="width: 16ch;"></select>
          <button id="addTemplateBtn">新增</button>
          <button id="removeTemplateBtn">删除当前</button>
        </div>
        <textarea id="msgList" placeholder="在这输入弹幕，每行一句话，超过可发送字数的会自动进行分割" style="box-sizing: border-box; height: 100px; width: 100%; resize: vertical;"></textarea>
        <div style="margin: .5em 0;">
          <span id="msgCount"></span><span>间隔</span>
          <input id="msgSendInterval" style="width: 30px;" autocomplete="off" type="number" min="0" value="${GM_getValue('msgSendInterval')}" />
          <span>秒，</span>
          <span>超过</span>
          <input id="maxLength" style="width: 30px;" autocomplete="off" type="number" min="1" value="${GM_getValue('maxLength')}" />
          <span>字自动分段，</span>
          <span style="display: inline-flex; align-items: center; gap: .25em;">
            <input id="randomColor" type="checkbox" ${GM_getValue('randomColor') ? 'checked' : ''} />
            <label for="randomColor">随机颜色</label>
          </span>
          <span style="display: inline-flex; align-items: center; gap: .25em;">
            <input id="randomInterval" type="checkbox" ${GM_getValue('randomInterval') ? 'checked' : ''} />
            <label for="randomInterval">间隔增加随机性</label>
          </span>
          <span style="display: inline-flex; align-items: center; gap: .25em;">
            <input id="randomChar" type="checkbox" ${GM_getValue('randomChar') ? 'checked' : ''} />
            <label for="randomChar">随机字符</label>
          </span>
        </div>
      </div>

      <!-- Tab Content: 发送 -->
      <div id="content-fasong" class="tab-content" style="display: none;">
        <div style="margin: .5em 0;">
          <textarea id="fasongInput" placeholder="输入弹幕内容… (Enter 发送)" style="box-sizing: border-box; height: 50px; width: 100%; resize: vertical;"></textarea>
        </div>
        <div style="margin: .5em 0;">
          <span style="display: inline-flex; align-items: center; gap: .25em;">
            <input id="aiEvasion" type="checkbox" ${GM_getValue('aiEvasion') ? 'checked' : ''} />
            <label for="aiEvasion">AI规避（发送失败时自动检测敏感词并重试）</label>
          </span>
        </div>
      </div>

      <!-- Tab Content: 全局设置 -->
      <div id="content-settings" class="tab-content" style="display: none;">
        <!-- Remote Keyword Sync -->
        <div style="margin: .5em 0; padding-bottom: .5em; border-bottom: 1px solid var(--Ga2, #eee);">
          <div style="font-weight: bold; margin-bottom: .5em;">
            云端规则替换
            <a href="https://github.com/laplace-live/public/blob/master/artifacts/livesrtream-keywords.json" target="_blank" style="color: #288bb8; text-decoration: none;">我要贡献规则</a>
          </div>
          <div style="margin-block: .5em; color: #666;">
            每10分钟会自动同步云端替换规则
          </div>
          <div style="display: flex; gap: .5em; align-items: center; flex-wrap: wrap; margin-bottom: .5em;">
            <button id="syncRemoteBtn">同步</button>
            <button id="testRemoteBtn">测试云端词库</button>
            <span id="remoteKeywordsStatus" style="color: #666;">未同步</span>
          </div>
          <div id="remoteKeywordsInfo" style="color: #666;"></div>
        </div>

        <!-- Local Replacement Rules -->
        <div style="margin: .5em 0; padding-bottom: .5em; border-bottom: 1px solid var(--Ga2, #eee);">
          <div style="display: flex; gap: .5em; align-items: center; flex-wrap: wrap; margin-bottom: .5em;">
            <div style="font-weight: bold;">本地规则替换</div>
            <button id="testLocalBtn">测试本地词库</button>
          </div>
          <div style="margin-block: .5em; color: #666;">规则从上至下执行；本地规则总是最后执行</div>
          <div id="replacementRulesList" style="margin-bottom: .5em; max-height: 160px; overflow-y: auto;"></div>
          <div style="display: flex; gap: .25em; align-items: center; flex-wrap: wrap;">
            <input id="replaceFrom" placeholder="替换前" style="flex: 1; min-width: 80px;" />
            <span>→</span>
            <input id="replaceTo" placeholder="替换后" style="flex: 1; min-width: 80px;" />
            <button id="addRuleBtn">添加</button>
          </div>
        </div>

        <!-- Log Settings -->
        <div style="margin: .5em 0; padding-bottom: .5em; border-bottom: 1px solid var(--Ga2, #eee);">
          <div style="font-weight: bold; margin-bottom: .5em;">日志设置</div>
          <div style="display: flex; gap: .5em; align-items: center; flex-wrap: wrap;">
            <label for="maxLogLinesInput" style="color: #666;">最大日志行数:</label>
            <input id="maxLogLinesInput" type="number" min="1" max="1000" value="${GM_getValue('maxLogLines')}" style="width: 80px;" />
            <span style="color: #999; font-size: 0.9em;">(1-1000)</span>
          </div>
        </div>

        <!-- Other Settings -->
        <div style="margin: .5em 0;">
          <div style="font-weight: bold; margin-bottom: .5em;">其他设置</div>
          <div style="display: flex; gap: .5em; align-items: center; flex-wrap: wrap;">
            <span style="display: inline-flex; align-items: center; gap: .25em;">
              <input id="forceScrollDanmaku" type="checkbox" ${GM_getValue('forceScrollDanmaku') ? 'checked' : ''} />
              <label for="forceScrollDanmaku">脚本载入时强制配置弹幕位置为滚动方向</label>
            </span>
          </div>
        </div>
      </div>

      <!-- Global Log Area -->
      <details style="margin-top: .25em;">
        <summary style="cursor: pointer; user-select: none; font-weight: bold;">日志</summary>
        <textarea id="msgLogs" style="box-sizing: border-box; height: 80px; width: 100%; resize: vertical; margin-top: .5em;" placeholder="此处将输出日志（最多保留 ${GM_getValue('maxLogLines')} 条）" readonly></textarea>
      </details>
      </div>`

    document.body.appendChild(list)

    // Tab switching logic
    /** @type {string} */
    const activeTab = GM_getValue('activeTab', 'dulunche')

    /**
     * Switches to the specified tab and saves the state
     * @param {string} tabId - The tab identifier (dulunche or fasong)
     * @returns {void}
     */
    function switchTab(tabId) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none'
      })

      // Remove active state from all tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.borderBottom = '1px solid transparent'
        btn.style.fontWeight = 'normal'
      })

      // Show selected tab content
      const contentElement = document.getElementById(`content-${tabId}`)
      if (contentElement) {
        contentElement.style.display = 'block'
      }

      // Highlight active tab button
      const tabBtn = document.getElementById(`tab-${tabId}`)
      if (tabBtn) {
        tabBtn.style.borderBottom = '1px solid #36a185'
        tabBtn.style.fontWeight = 'bold'
      }

      // Save active tab
      GM_setValue('activeTab', tabId)
    }

    // Setup tab click handlers
    document.getElementById('tab-dulunche')?.addEventListener('click', () => {
      switchTab('dulunche')
    })

    document.getElementById('tab-fasong')?.addEventListener('click', () => {
      switchTab('fasong')
    })

    document.getElementById('tab-settings')?.addEventListener('click', () => {
      switchTab('settings')
    })

    // Restore last active tab
    switchTab(activeTab)

    /** @type {HTMLButtonElement} */
    const sendBtn = document.getElementById('sendBtn')
    /** @type {HTMLTextAreaElement} */
    const msgLogs = document.getElementById('msgLogs')
    /** @type {number} */
    const maxLogLines = GM_getValue('maxLogLines')

    sendBtn.addEventListener('click', () => {
      if (!sendMsg) {
        const currentTemplate = MsgTemplates[activeTemplateIndex] || ''
        if (!currentTemplate.trim()) {
          appendToLimitedLog(msgLogs, '⚠️ 当前模板为空，请先输入内容', maxLogLines)
          return
        }

        updateMessages()
        sendMsg = true
        sendBtn.textContent = '关闭独轮车'
        toggleBtn.style.background = 'rgb(0 186 143)'
      } else {
        sendMsg = false
        sendBtn.textContent = '开启独轮车'
        toggleBtn.style.background = 'rgb(166 166 166)'
      }
    })

    toggleBtn.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none'
    })

    /** @type {HTMLTextAreaElement} */
    const msgInput = document.getElementById('msgList')
    /** @type {HTMLSpanElement} */
    const msgCount = document.getElementById('msgCount')
    /** @type {HTMLInputElement} */
    const msgIntervalInput = document.getElementById('msgSendInterval')
    /** @type {HTMLInputElement} */
    const maxLengthInput = document.getElementById('maxLength')
    /** @type {HTMLInputElement} */
    const randomColorInput = document.getElementById('randomColor')
    /** @type {HTMLInputElement} */
    const randomIntervalInput = document.getElementById('randomInterval')
    /** @type {HTMLInputElement} */
    const randomCharInput = document.getElementById('randomChar')
    /** @type {HTMLSelectElement} */
    const templateSelect = document.getElementById('templateSelect')
    /** @type {HTMLButtonElement} */
    const addTemplateBtn = document.getElementById('addTemplateBtn')
    /** @type {HTMLButtonElement} */
    const removeTemplateBtn = document.getElementById('removeTemplateBtn')

    /**
     * Updates the current template with input content and refreshes message count
     * @returns {void}
     */
    function updateMessages() {
      const maxLength = parseInt(maxLengthInput.value, 10) || 20
      MsgTemplates[activeTemplateIndex] = msgInput.value
      GM_setValue('MsgTemplates', MsgTemplates)
      const Msg = processMessages(msgInput.value, maxLength)
      msgCount.textContent = `${Msg.length || 0} 条，`
    }

    /**
     * Updates the template select dropdown with current templates
     * @returns {void}
     */
    function updateTemplateSelect() {
      templateSelect.innerHTML = ''
      MsgTemplates.forEach((template, index) => {
        const option = document.createElement('option')
        option.value = index

        // Get first line of template and truncate to 20 characters
        const firstLine = template.split('\n')[0].trim()
        const preview = firstLine
          ? getGraphemes(firstLine).length > 10
            ? `${trimText(firstLine, 10)[0]}…`
            : firstLine
          : '(空)'

        option.textContent = `${index + 1}: ${preview}`
        templateSelect.appendChild(option)
      })
      templateSelect.value = activeTemplateIndex
      msgInput.value = MsgTemplates[activeTemplateIndex] || ''
      updateMessages()
    }

    templateSelect.addEventListener('change', () => {
      activeTemplateIndex = parseInt(templateSelect.value, 10)
      GM_setValue('activeTemplateIndex', activeTemplateIndex)
      msgInput.value = MsgTemplates[activeTemplateIndex] || ''
      updateMessages()
    })

    addTemplateBtn.addEventListener('click', () => {
      MsgTemplates.push('')
      activeTemplateIndex = MsgTemplates.length - 1
      GM_setValue('MsgTemplates', MsgTemplates)
      GM_setValue('activeTemplateIndex', activeTemplateIndex)
      updateTemplateSelect()
    })

    removeTemplateBtn.addEventListener('click', () => {
      if (MsgTemplates.length > 1) {
        MsgTemplates.splice(activeTemplateIndex, 1)
        activeTemplateIndex = Math.max(0, activeTemplateIndex - 1)
        GM_setValue('MsgTemplates', MsgTemplates)
        GM_setValue('activeTemplateIndex', activeTemplateIndex)
        updateTemplateSelect()
      }
    })

    msgInput.addEventListener('input', () => {
      updateMessages()
      updateTemplateSelect()
    })

    msgIntervalInput.addEventListener('input', () => {
      if (!(parseInt(msgIntervalInput.value, 10) >= 0)) msgIntervalInput.value = 0
      GM_setValue('msgSendInterval', msgIntervalInput.value)
    })

    randomColorInput.addEventListener('input', () => {
      GM_setValue('randomColor', randomColorInput.checked)
    })

    randomIntervalInput.addEventListener('input', () => {
      GM_setValue('randomInterval', randomIntervalInput.checked)
    })

    randomCharInput.addEventListener('input', () => {
      GM_setValue('randomChar', randomCharInput.checked)
    })

    maxLengthInput.addEventListener('input', () => {
      const value = parseInt(maxLengthInput.value, 10)
      if (value < 1) maxLengthInput.value = 1
      GM_setValue('maxLength', maxLengthInput.value)
      updateMessages()
    })

    updateTemplateSelect()

    // ===== 发送 Tab Features =====
    /** @type {Array<{from: string, to: string}>} */
    const replacementRules = GM_getValue('replacementRules', [])

    /** @type {HTMLTextAreaElement} */
    const fasongInput = document.getElementById('fasongInput')
    /** @type {HTMLInputElement} */
    const aiEvasionInput = document.getElementById('aiEvasion')
    /** @type {HTMLDivElement} */
    const replacementRulesList = document.getElementById('replacementRulesList')
    /** @type {HTMLInputElement} */
    const replaceFromInput = document.getElementById('replaceFrom')
    /** @type {HTMLInputElement} */
    const replaceToInput = document.getElementById('replaceTo')
    /** @type {HTMLButtonElement} */
    const addRuleBtn = document.getElementById('addRuleBtn')

    /**
     * Updates the display of replacement rules
     * @returns {void}
     */
    function updateReplacementRulesDisplay() {
      if (replacementRules.length === 0) {
        replacementRulesList.innerHTML = '<div style="color: #999;">暂无替换规则，请在下方添加</div>'
        return
      }

      replacementRulesList.innerHTML = replacementRules
        .map((rule, index) => {
          const fromDisplay = rule.from || '(空)'
          const toDisplay = rule.to || '(空)'
          return `
            <div style="display: flex; align-items: center; gap: .5em; padding: .2em; border-bottom: 1px solid var(--Ga2, #eee);">
              <span style="flex: 1; word-break: break-all; font-family: monospace;">${fromDisplay} → ${toDisplay}</span>
              <button class="remove-rule-btn" data-index="${index}" style="cursor: pointer; background: transparent; color: red; border: none; border-radius: 2px;">删除</button>
            </div>
          `
        })
        .join('')

      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-rule-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const index = parseInt(e.target.getAttribute('data-index'), 10)
          replacementRules.splice(index, 1)
          GM_setValue('replacementRules', replacementRules)
          buildReplacementMap() // Rebuild map when rules change
          updateReplacementRulesDisplay()
        })
      })
    }

    // Add new replacement rule
    addRuleBtn.addEventListener('click', () => {
      const from = replaceFromInput.value
      const to = replaceToInput.value

      if (!from) {
        appendToLimitedLog(msgLogs, '⚠️ 替换前的内容不能为空', maxLogLines)
        return
      }

      replacementRules.push({ from, to })
      GM_setValue('replacementRules', replacementRules)
      buildReplacementMap() // Rebuild map when rules change

      replaceFromInput.value = ''
      replaceToInput.value = ''

      updateReplacementRulesDisplay()
      // appendToLimitedLog(msgLogs, `✅ 已添加替换规则：${from} → ${to}`, maxLogLines);
    })

    // Allow Enter key to add rule in replace inputs
    replaceFromInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        addRuleBtn.click()
      }
    })

    replaceToInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        addRuleBtn.click()
      }
    })

    // AI Evasion functionality
    /**
     * Calls AI endpoint to detect sensitive words
     * @param {string} text - The text to check
     * @returns {Promise<{hasSensitiveContent: boolean, sensitiveWords?: string[], severity?: string, categories?: string[]}>}
     */
    async function detectSensitiveWords(text) {
      try {
        const resp = await fetch(BASE_URL.LAPLACE_CHAT_AUDIT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completionMetadata: {
              input: text,
            },
          }),
        })

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`)
        }

        const data = await resp.json()
        return data.completion || { hasSensitiveContent: false }
      } catch (error) {
        console.error('AI detection error:', error)
        appendToLimitedLog(msgLogs, `⚠️ AI检测服务出错：${error.message}`, maxLogLines)
        return { hasSensitiveContent: false }
      }
    }

    /**
     * Inserts invisible soft hyphen characters between each character of a word
     * @param {string} word - The word to modify
     * @returns {string} The word with invisible characters inserted
     */
    function insertInvisibleChars(word) {
      const graphemes = getGraphemes(word)
      return graphemes.join('­')
    }

    /**
     * Replaces sensitive words with versions that have invisible characters
     * @param {string} text - The original text
     * @param {string[]} sensitiveWords - Array of sensitive words to replace
     * @returns {string} Text with sensitive words replaced
     */
    function replaceSensitiveWords(text, sensitiveWords) {
      let result = text
      for (const word of sensitiveWords) {
        const modifiedWord = insertInvisibleChars(word)
        // Use global replace to handle all occurrences
        result = result.split(word).join(modifiedWord)
      }
      return result
    }

    // Send message functionality
    async function sendMessage() {
      const originalMessage = fasongInput.value.trim()

      if (!originalMessage) {
        appendToLimitedLog(msgLogs, '⚠️ 消息内容不能为空', maxLogLines)
        return
      }

      // Apply text replacements
      const processedMessage = applyReplacements(originalMessage)
      const wasReplaced = originalMessage !== processedMessage

      // Clear input immediately after getting the message
      fasongInput.value = ''

      try {
        // Use cached room ID, or fetch it if not available yet
        if (cachedRoomId === null) {
          cachedRoomId = await getRoomId()
        }
        const roomId = cachedRoomId
        const csrfToken = getCsrfToken()

        if (!csrfToken) {
          appendToLimitedLog(msgLogs, '❌ 未找到登录信息，请先登录 Bilibili', maxLogLines)
          return
        }

        const result = await sendDanmaku(processedMessage, roomId, csrfToken)

        if (result.success) {
          const displayMsg = wasReplaced ? `${originalMessage} → ${processedMessage}` : processedMessage
          appendToLimitedLog(msgLogs, `✅ 手动: ${displayMsg}`, maxLogLines)
        } else {
          let errorMsg = result.error || '未知错误'

          // Handle specific error codes
          if (result.error) {
            if (result.error.includes('f')) {
              errorMsg = 'f - 包含全局屏蔽词'
            } else if (result.error.includes('k')) {
              errorMsg = 'k - 包含房间屏蔽词'
            }
          }

          const displayMsg = wasReplaced ? `${originalMessage} → ${processedMessage}` : processedMessage
          appendToLimitedLog(msgLogs, `❌ 手动: ${displayMsg}，原因：${errorMsg}`, maxLogLines)

          // Try AI evasion if enabled
          const aiEvasionEnabled = GM_getValue('aiEvasion', false)
          if (aiEvasionEnabled) {
            appendToLimitedLog(msgLogs, `🤖 AI规避已启用，正在检测敏感词…`, maxLogLines)

            const detection = await detectSensitiveWords(processedMessage)

            if (detection.hasSensitiveContent && detection.sensitiveWords && detection.sensitiveWords.length > 0) {
              appendToLimitedLog(
                msgLogs,
                `🤖 检测到敏感词：${detection.sensitiveWords.join(', ')}，正在尝试规避…`,
                maxLogLines
              )

              const evadedMessage = replaceSensitiveWords(processedMessage, detection.sensitiveWords)
              const retryResult = await sendDanmaku(evadedMessage, roomId, csrfToken)

              if (retryResult.success) {
                appendToLimitedLog(msgLogs, `✅ AI规避成功: ${evadedMessage}`, maxLogLines)
              } else {
                appendToLimitedLog(msgLogs, `❌ AI规避失败: ${evadedMessage}，原因：${retryResult.error}`, maxLogLines)
              }
            } else {
              appendToLimitedLog(msgLogs, `⚠️ 无法检测到敏感词，请手动检查`, maxLogLines)
            }
          }
        }
      } catch (error) {
        appendToLimitedLog(msgLogs, `🔴 发送出错：${error.message}`, maxLogLines)
      }
    }

    // AI Evasion checkbox event listener
    aiEvasionInput.addEventListener('input', () => {
      GM_setValue('aiEvasion', aiEvasionInput.checked)
    })

    // Allow Enter to send message
    fasongInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })

    // Initialize replacement rules display
    updateReplacementRulesDisplay()

    // ===== Remote Keywords Sync =====

    const SYNC_INTERVAL = 10 * 60 * 1000 // 10 minutes in milliseconds

    /** @type {HTMLButtonElement} */
    const syncRemoteBtn = document.getElementById('syncRemoteBtn')
    /** @type {HTMLSpanElement} */
    const remoteKeywordsStatus = document.getElementById('remoteKeywordsStatus')
    /** @type {HTMLDivElement} */
    const remoteKeywordsInfo = document.getElementById('remoteKeywordsInfo')

    /**
     * Fetches remote keywords from GitHub
     * @returns {Promise<{global: {keywords: Object}, rooms: Array}>}
     */
    async function fetchRemoteKeywords() {
      const response = await fetch(BASE_URL.REMOTE_KEYWORDS)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    }

    /**
     * Syncs remote keywords and stores them locally
     * @returns {Promise<void>}
     */
    async function syncRemoteKeywords() {
      try {
        syncRemoteBtn.disabled = true
        syncRemoteBtn.textContent = '同步中…'
        remoteKeywordsStatus.textContent = '正在同步…'
        remoteKeywordsStatus.style.color = '#666'

        const data = await fetchRemoteKeywords()

        // Store the fetched data
        GM_setValue('remoteKeywords', data)
        GM_setValue('remoteKeywordsLastSync', Date.now())
        buildReplacementMap() // Rebuild map when remote keywords change

        // Update status
        updateRemoteKeywordsStatus()

        // appendToLimitedLog(msgLogs, '✅ 云端替换规则同步成功', maxLogLines)
      } catch (error) {
        remoteKeywordsStatus.textContent = `同步失败: ${error.message}`
        remoteKeywordsStatus.style.color = '#f44'
        appendToLimitedLog(msgLogs, `❌ 云端替换规则同步失败: ${error.message}`, maxLogLines)
      } finally {
        syncRemoteBtn.disabled = false
        syncRemoteBtn.textContent = '同步'
      }
    }

    /**
     * Updates the display of remote keywords status
     * @returns {void}
     */
    function updateRemoteKeywordsStatus() {
      const remoteKeywords = GM_getValue('remoteKeywords', null)
      const lastSync = GM_getValue('remoteKeywordsLastSync', null)

      if (!remoteKeywords || !lastSync) {
        remoteKeywordsStatus.textContent = '未同步'
        remoteKeywordsStatus.style.color = '#666'
        remoteKeywordsInfo.textContent = ''
        return
      }

      // Get current room ID
      const currentRoomId = cachedRoomId

      // Count keywords
      const globalCount = Object.keys(remoteKeywords.global?.keywords || {}).length
      let roomCount = 0

      if (currentRoomId) {
        const roomData = remoteKeywords.rooms?.find(r => r.room === currentRoomId)
        roomCount = Object.keys(roomData?.keywords || {}).length
      }

      const totalApplied = globalCount + roomCount

      // Format last sync time
      const syncDate = new Date(lastSync)
      const timeStr = syncDate.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      remoteKeywordsStatus.textContent = `最后同步: ${timeStr}`
      remoteKeywordsStatus.style.color = '#36a185'
      remoteKeywordsInfo.textContent = `当前房间共 ${totalApplied} 条规则（全局 ${globalCount} + 当前房间 ${roomCount}）`
    }

    // Manual sync button
    syncRemoteBtn.addEventListener('click', () => {
      syncRemoteKeywords()
    })

    // ===== Keyword Testing Utilities =====

    /**
     * Tests a single keyword pair
     * @param {string} originalKeyword - The original keyword to test
     * @param {string} replacedKeyword - The replacement keyword
     * @param {number} roomId - The room ID
     * @param {string} csrfToken - The CSRF token
     * @returns {Promise<{originalBlocked: boolean, replacedBlocked: boolean|null, originalError?: string, replacedError?: string}>}
     */
    async function testKeywordPair(originalKeyword, replacedKeyword, roomId, csrfToken) {
      const originalResult = await sendDanmaku(originalKeyword, roomId, csrfToken)
      let replacedResult = null

      if (!originalResult.success) {
        // Wait 2 seconds before testing replaced keyword
        await new Promise(r => setTimeout(r, 2000))
        replacedResult = await sendDanmaku(replacedKeyword, roomId, csrfToken)
      }

      return {
        originalBlocked: !originalResult.success,
        replacedBlocked: replacedResult ? !replacedResult.success : null,
        originalError: originalResult.error,
        replacedError: replacedResult?.error,
      }
    }

    /**
     * Logs the result of a keyword test
     * @param {Object} result - Test result
     * @param {string} replacedKeyword - The replacement keyword
     * @returns {number} 1 if original was blocked, 0 otherwise
     */
    function logTestResult(result, replacedKeyword) {
      if (result.originalBlocked) {
        appendToLimitedLog(
          msgLogs,
          `  ✅ 原词被屏蔽 (错误: ${result.originalError})，测试替换词: ${replacedKeyword}`,
          maxLogLines
        )

        if (result.replacedBlocked) {
          appendToLimitedLog(msgLogs, `  ❌ 替换词也被屏蔽 (错误: ${result.replacedError})`, maxLogLines)
        } else {
          appendToLimitedLog(msgLogs, `  ✅ 替换词未被屏蔽`, maxLogLines)
        }
        return 1
      } else {
        appendToLimitedLog(msgLogs, `  ⚠️ 原词未被屏蔽，请考虑提交贡献词条`, maxLogLines)
        return 0
      }
    }

    /**
     * Gets remote keywords organized by type
     * @returns {{globalKeywords: Array<{from: string, to: string}>, roomKeywords: Array<{from: string, to: string}>}}
     */
    function getRemoteKeywords() {
      const remoteKeywords = GM_getValue('remoteKeywords', null)
      const globalKeywords = []
      const roomKeywords = []

      if (remoteKeywords) {
        // Global keywords
        const globalKw = remoteKeywords.global?.keywords || {}
        for (const [from, to] of Object.entries(globalKw)) {
          if (from) {
            globalKeywords.push({ from, to })
          }
        }

        // Room-specific keywords
        if (cachedRoomId) {
          const roomData = remoteKeywords.rooms?.find(r => r.room === cachedRoomId)
          const roomKw = roomData?.keywords || {}
          for (const [from, to] of Object.entries(roomKw)) {
            if (from) {
              roomKeywords.push({ from, to })
            }
          }
        }
      }

      return { globalKeywords, roomKeywords }
    }

    /**
     * Validates prerequisites for testing
     * @returns {Promise<{valid: boolean, roomId?: number, csrfToken?: string}>}
     */
    async function validateTestPrerequisites() {
      // Ensure we have room ID
      if (cachedRoomId === null) {
        cachedRoomId = await getRoomId()
      }
      const roomId = cachedRoomId
      const csrfToken = getCsrfToken()

      if (!csrfToken) {
        appendToLimitedLog(msgLogs, '❌ 未找到登录信息，请先登录 Bilibili', maxLogLines)
        return { valid: false }
      }

      return { valid: true, roomId, csrfToken }
    }

    /** @type {HTMLButtonElement} */
    const testRemoteBtn = document.getElementById('testRemoteBtn')
    /** @type {HTMLButtonElement} */
    const testLocalBtn = document.getElementById('testLocalBtn')

    /**
     * Tests remote keywords (global + room-specific)
     * @returns {Promise<void>}
     */
    async function testRemoteKeywords() {
      const confirmed = confirm(
        '即将测试当前直播间的云端替换词，请避免在当前直播间正在直播时进行测试，否则可能会给主播造成困扰，是否继续？'
      )

      if (!confirmed) return

      testRemoteBtn.disabled = true
      testRemoteBtn.textContent = '测试中…'

      try {
        const { valid, roomId, csrfToken } = await validateTestPrerequisites()
        if (!valid) return

        const { globalKeywords, roomKeywords } = getRemoteKeywords()
        const totalCount = globalKeywords.length + roomKeywords.length

        if (totalCount === 0) {
          appendToLimitedLog(msgLogs, '⚠️ 没有云端替换词可供测试，请先同步云端规则', maxLogLines)
          return
        }

        appendToLimitedLog(
          msgLogs,
          `🔵 开始测试云端替换词 ${totalCount} 个（全局 ${globalKeywords.length} + 房间 ${roomKeywords.length}）`,
          maxLogLines
        )

        let testedCount = 0
        let totalBlockedCount = 0

        // Test global keywords
        if (globalKeywords.length > 0) {
          appendToLimitedLog(msgLogs, `\n📡 测试云端全局替换词 (${globalKeywords.length} 个)`, maxLogLines)
          let blockedCount = 0

          for (const { from, to } of globalKeywords) {
            testedCount++
            appendToLimitedLog(msgLogs, `[${testedCount}/${totalCount}] 测试: ${from}`, maxLogLines)

            const result = await testKeywordPair(from, to, roomId, csrfToken)
            const blocked = logTestResult(result, to)
            blockedCount += blocked
            totalBlockedCount += blocked

            // Wait 2 seconds before next test
            if (testedCount < totalCount) {
              await new Promise(r => setTimeout(r, 2000))
            }
          }

          appendToLimitedLog(
            msgLogs,
            `📡 全局替换词测试完成：${blockedCount}/${globalKeywords.length} 个原词被屏蔽`,
            maxLogLines
          )
        }

        // Test room-specific keywords
        if (roomKeywords.length > 0) {
          appendToLimitedLog(msgLogs, `\n🏠 测试云端房间专属替换词 (${roomKeywords.length} 个)`, maxLogLines)
          let blockedCount = 0

          for (const { from, to } of roomKeywords) {
            testedCount++
            appendToLimitedLog(msgLogs, `[${testedCount}/${totalCount}] 测试: ${from}`, maxLogLines)

            const result = await testKeywordPair(from, to, roomId, csrfToken)
            const blocked = logTestResult(result, to)
            blockedCount += blocked
            totalBlockedCount += blocked

            // Wait 2 seconds before next test
            if (testedCount < totalCount) {
              await new Promise(r => setTimeout(r, 2000))
            }
          }

          appendToLimitedLog(
            msgLogs,
            `🏠 房间专属替换词测试完成：${blockedCount}/${roomKeywords.length} 个原词被屏蔽`,
            maxLogLines
          )
        }

        appendToLimitedLog(
          msgLogs,
          `\n🔵 云端测试完成！共测试 ${totalCount} 个词，其中 ${totalBlockedCount} 个原词被屏蔽`,
          maxLogLines
        )
      } catch (error) {
        appendToLimitedLog(msgLogs, `🔴 测试出错：${error.message}`, maxLogLines)
      } finally {
        testRemoteBtn.disabled = false
        testRemoteBtn.textContent = '云端词库测试'
      }
    }

    /**
     * Tests local replacement rules
     * @returns {Promise<void>}
     */
    async function testLocalKeywords() {
      const confirmed = confirm(
        '即将测试本地替换词，请避免在当前直播间正在直播时进行测试，否则可能会给主播造成困扰，是否继续？'
      )

      if (!confirmed) return

      testLocalBtn.disabled = true
      testLocalBtn.textContent = '测试中…'

      try {
        const { valid, roomId, csrfToken } = await validateTestPrerequisites()
        if (!valid) return

        const localRules = GM_getValue('replacementRules', []).filter(rule => rule.from)

        if (localRules.length === 0) {
          appendToLimitedLog(msgLogs, '⚠️ 没有本地替换词可供测试，请先添加本地替换规则', maxLogLines)
          return
        }

        appendToLimitedLog(msgLogs, `🔵 开始测试本地替换词 ${localRules.length} 个`, maxLogLines)

        let testedCount = 0
        let blockedCount = 0

        for (const rule of localRules) {
          testedCount++
          appendToLimitedLog(msgLogs, `[${testedCount}/${localRules.length}] 测试: ${rule.from}`, maxLogLines)

          const result = await testKeywordPair(rule.from, rule.to, roomId, csrfToken)
          blockedCount += logTestResult(result, rule.to)

          // Wait 2 seconds before next test
          if (testedCount < localRules.length) {
            await new Promise(r => setTimeout(r, 2000))
          }
        }

        appendToLimitedLog(
          msgLogs,
          `\n🔵 本地测试完成！共测试 ${localRules.length} 个词，其中 ${blockedCount} 个原词被屏蔽`,
          maxLogLines
        )
      } catch (error) {
        appendToLimitedLog(msgLogs, `🔴 测试出错：${error.message}`, maxLogLines)
      } finally {
        testLocalBtn.disabled = false
        testLocalBtn.textContent = '本地词库测试'
      }
    }

    // Test button event listeners
    testRemoteBtn.addEventListener('click', () => {
      testRemoteKeywords()
    })

    testLocalBtn.addEventListener('click', () => {
      testLocalKeywords()
    })

    // Max log lines input
    /** @type {HTMLInputElement} */
    const maxLogLinesInput = document.getElementById('maxLogLinesInput')
    maxLogLinesInput.addEventListener('change', () => {
      let value = Number.parseInt(maxLogLinesInput.value, 10)
      // Validate range
      if (Number.isNaN(value) || value < 1) {
        value = 1
      } else if (value > 1000) {
        value = 1000
      }
      maxLogLinesInput.value = value.toString()
      GM_setValue('maxLogLines', value)
    })

    // Other Settings event listeners
    /** @type {HTMLInputElement} */
    const forceScrollDanmakuInput = document.getElementById('forceScrollDanmaku')
    forceScrollDanmakuInput.addEventListener('input', () => {
      GM_setValue('forceScrollDanmaku', forceScrollDanmakuInput.checked)
    })

    // Set the callback for when room ID is ready
    onRoomIdReadyCallback = updateRemoteKeywordsStatus

    // Auto-sync on load
    ;(async () => {
      const lastSync = GM_getValue('remoteKeywordsLastSync', null)
      const now = Date.now()

      // Sync if never synced or last sync was more than 30 minutes ago
      if (!lastSync || now - lastSync > SYNC_INTERVAL) {
        await syncRemoteKeywords()
      } else {
        updateRemoteKeywordsStatus()
      }
    })()

    // Auto-sync every 30 minutes
    setInterval(async () => {
      await syncRemoteKeywords()
    }, SYNC_INTERVAL)

    loop()
    clearInterval(check)
  }, 100)
})()

/**
 * Builds the replacement map from remote and local rules
 * Priority: remote global < remote room-specific < local rules
 * @returns {void}
 */
function buildReplacementMap() {
  const map = new Map()

  // Add remote keywords
  const remoteKeywords = GM_getValue('remoteKeywords', null)
  if (remoteKeywords) {
    // Add global keywords first
    const globalKeywords = remoteKeywords.global?.keywords || {}
    for (const [from, to] of Object.entries(globalKeywords)) {
      if (from) {
        map.set(from, to)
      }
    }

    // Add room-specific keywords (override global if same key)
    if (cachedRoomId) {
      const roomData = remoteKeywords.rooms?.find(r => r.room === cachedRoomId)
      const roomKeywords = roomData?.keywords || {}
      for (const [from, to] of Object.entries(roomKeywords)) {
        if (from) {
          map.set(from, to)
        }
      }
    }
  }

  // Add local rules (override remote if same key)
  const localRules = GM_getValue('replacementRules', [])
  for (const rule of localRules) {
    if (rule.from) {
      map.set(rule.from, rule.to)
    }
  }

  replacementMap = map
}

/**
 * Applies all replacement rules to the given text
 * Uses cached replacement map for efficiency
 * @param {string} text - The text to apply replacements to
 * @returns {string} The text with all replacements applied
 */
function applyReplacements(text) {
  // Build map on first use
  if (replacementMap === null) {
    buildReplacementMap()
  }

  let result = text
  for (const [from, to] of replacementMap.entries()) {
    result = result.split(from).join(to)
  }

  return result
}

/**
 * Gets the CSRF token from browser cookies
 * @returns {string|undefined} The CSRF token (bili_jct), or undefined if not found
 */
function getCsrfToken() {
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('bili_jct='))
    ?.split('bili_jct=')[1]
}

/**
 * Gets the room ID for a Bilibili live room
 * @param {string} [url] - The room URL (defaults to current page URL)
 * @returns {Promise<number>} The room ID
 */
async function getRoomId(url = window.location.href) {
  const shortUid = extractRoomNumber(url)

  try {
    const room = await fetch(`${BASE_URL.BILIBILI_ROOM_INIT}?id=${shortUid}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!room.ok) {
      throw new Error(`HTTP ${room.status}: ${room.statusText}`)
    }

    /** @type {{data: {room_id: number}}} */
    const roomData = await room.json()
    return roomData.data.room_id
  } catch (error) {
    console.error('Failed to get room ID:', error)
    throw error
  }
}

/**
 * Sends a single danmaku message to Bilibili live room
 * @param {string} message - The message text to send
 * @param {number} roomId - The room ID to send the message to
 * @param {string} csrfToken - The CSRF token for authentication
 * @returns {Promise<{success: boolean, message: string, error?: string}>} Result of the send operation
 */
async function sendDanmaku(message, roomId, csrfToken) {
  const form = new FormData()
  form.append('bubble', '2')
  form.append('msg', message)
  form.append('color', '16777215')
  form.append('mode', '1')
  form.append('room_type', '0')
  form.append('jumpfrom', '0')
  form.append('reply_mid', '0')
  form.append('reply_attr', '0')
  form.append('replay_dmid', '')
  form.append('statistics', '{"appId":100,"platform":5}')
  form.append('fontsize', '25')
  form.append('rnd', String(Math.floor(Date.now() / 1000)))
  form.append('roomid', String(roomId))
  form.append('csrf', csrfToken)
  form.append('csrf_token', csrfToken)

  try {
    // Add silly queries😁
    let query = ''
    if (cachedWbiKeys) {
      query = encodeWbi(
        {
          web_location: getSpmPrefix(),
        },
        cachedWbiKeys
      )
    }

    const url = `${BASE_URL.BILIBILI_MSG_SEND}?${query}`
    const resp = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: form,
    })

    /** @type {{message?: string, code?: number}} */
    const json = await resp.json()

    if (json.message) {
      return {
        success: false,
        message: message,
        error: json.message,
      }
    }

    return {
      success: true,
      message: message,
    }
  } catch (error) {
    return {
      success: false,
      message: message,
      error: error.message,
    }
  }
}

/**
 * Main loop function that handles sending messages to Bilibili live chat
 * Continuously checks if sendMsg is true and sends queued messages with configured intervals
 * @returns {Promise<void>}
 */
async function loop() {
  let count = 0
  /** @type {HTMLTextAreaElement} */
  const msgLogs = document.getElementById('msgLogs')
  /** @type {number} */
  const maxLogLines = GM_getValue('maxLogLines')

  // Fetch and cache room ID on first call
  if (cachedRoomId === null) {
    try {
      cachedRoomId = await getRoomId()
      buildReplacementMap() // Rebuild map with room-specific keywords
      // Update remote keywords status now that we have the room ID
      if (onRoomIdReadyCallback) {
        onRoomIdReadyCallback()
      }

      // Fetch danmaku config on script startup
      await waitForWbiKeys()
      if (cachedWbiKeys) {
        try {
          const configQuery = encodeWbi(
            {
              room_id: String(cachedRoomId),
              web_location: getSpmPrefix(),
            },
            cachedWbiKeys
          )
          const configUrl = `${BASE_URL.BILIBILI_GET_DM_CONFIG}?${configQuery}`
          /** @type {DanmakuConfigResponse} */
          const configResp = await fetch(configUrl, {
            method: 'GET',
            credentials: 'include',
          }).then(r => r.json())

          // Extract available colors from all groups
          if (configResp?.data?.group) {
            const colors = []
            for (const group of configResp.data.group) {
              for (const color of group.color) {
                // Only include enabled colors (status === 1)
                if (color.status === 1) {
                  colors.push(`0x${color.color_hex}`)
                }
              }
            }
            if (colors.length > 0) {
              availableDanmakuColors = colors
              console.log('[LAPLACE Chatterbox Helper] Available colors:', colors)
            }
          }
        } catch {
          // Silently fail - config fetch is non-critical
        }
      }

      // Initialize config on script startup (if enabled)
      const forceScrollDanmaku = GM_getValue('forceScrollDanmaku')
      if (forceScrollDanmaku) {
        const initCsrfToken = getCsrfToken()
        if (initCsrfToken) {
          const initConfigForm = new FormData()
          initConfigForm.append('room_id', String(cachedRoomId))
          initConfigForm.append('mode', '1')
          initConfigForm.append('csrf_token', initCsrfToken)
          initConfigForm.append('csrf', initCsrfToken)
          initConfigForm.append('visit_id', '')

          try {
            await fetch(BASE_URL.BILIBILI_MSG_CONFIG, {
              method: 'POST',
              credentials: 'include',
              body: initConfigForm,
            })
          } catch {
            // Silently fail - config init is non-critical
          }
        }
      }
    } catch (error) {
      appendToLimitedLog(msgLogs, `❌ 获取房间ID失败: ${error.message}`, maxLogLines)
      await new Promise(r => setTimeout(r, 5000))
      return // Exit and let the loop restart
    }
  }
  const roomId = cachedRoomId
  const csrfToken = getCsrfToken()

  while (true) {
    if (sendMsg) {
      const currentTemplate = MsgTemplates[activeTemplateIndex] || ''
      if (!currentTemplate.trim()) {
        appendToLimitedLog(msgLogs, '⚠️ 当前模板为空，已自动停止运行', maxLogLines)
        sendMsg = false
        const sendBtn = document.getElementById('sendBtn')
        const toggleBtn = document.getElementById('toggleBtn')
        sendBtn.textContent = '开启独轮车'
        toggleBtn.style.background = 'rgb(166 166 166)'
        continue
      }

      /** @type {number} */
      const msgSendInterval = GM_getValue('msgSendInterval')
      /** @type {boolean} */
      const enableRandomColor = GM_getValue('randomColor')
      /** @type {boolean} */
      const enableRandomInterval = GM_getValue('randomInterval')
      /** @type {boolean} */
      const enableRandomChar = GM_getValue('randomChar')
      const Msg = processMessages(currentTemplate, GM_getValue('maxLength'), enableRandomChar)

      for (const message of Msg) {
        if (sendMsg) {
          // Apply text replacements
          const originalMessage = message
          const processedMessage = applyReplacements(message)
          const wasReplaced = originalMessage !== processedMessage

          if (enableRandomColor) {
            // Use available colors from API or fallback to hardcoded set
            const colorSet = availableDanmakuColors || [
              '0xe33fff',
              '0x54eed8',
              '0x58c1de',
              '0x455ff6',
              '0x975ef9',
              '0xc35986',
              '0xff8c21',
              '0x00fffc',
              '0x7eff00',
              '0xffed4f',
              '0xff9800',
            ]
            const randomColor = colorSet[Math.floor(Math.random() * colorSet.length)]

            const configForm = new FormData()
            configForm.append('room_id', String(roomId))
            configForm.append('color', randomColor)
            configForm.append('csrf_token', csrfToken)
            configForm.append('csrf', csrfToken)
            configForm.append('visit_id', '')

            try {
              await fetch(BASE_URL.BILIBILI_MSG_CONFIG, {
                method: 'POST',
                credentials: 'include',
                body: configForm,
              })
            } catch {
              // Silently fail - color update is non-critical
            }
          }

          const result = await sendDanmaku(processedMessage, roomId, csrfToken)
          const displayMsg = wasReplaced ? `${originalMessage} → ${processedMessage}` : processedMessage
          const logMessage = result.success
            ? `✅ 自动: ${displayMsg}`
            : `❌ 自动: ${displayMsg}，原因：${result.error}。`

          appendToLimitedLog(msgLogs, logMessage, maxLogLines)

          const resolvedRandomInterval = enableRandomInterval ? Math.floor(Math.random() * 500) : 0
          await new Promise(r => setTimeout(r, msgSendInterval * 1000 - resolvedRandomInterval))
        }
      }

      count += 1
      appendToLimitedLog(msgLogs, `🔵第 ${count} 轮发送完成`, maxLogLines)
    } else {
      count = 0
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}
