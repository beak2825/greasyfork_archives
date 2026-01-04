// ==UserScript==
// @name         YouTube - アイコン画像を保存
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @license      MIT
// @description  YouTubeのチャンネルページでアイコン画像をクリックすると画像を保存できるスクリプトです。
// @author       You
// @match        *://*.youtube.com/user/*
// @match        *://*.youtube.com/channel/*
// @match        *://*.youtube.com/c/*
// @icon         https://www.youtube.com/s/desktop/fe7279a7/img/favicon_144.png
// @grant        GM_download
// @require      https://greasyfork.org/scripts/443079-easy-logger/code/easy-logger.js?version=1038070
// @require      https://greasyfork.org/scripts/443087-wait-for-selector/code/wait-for-selector.js?version=1038171
// @downloadURL https://update.greasyfork.org/scripts/417899/YouTube%20-%20%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E7%94%BB%E5%83%8F%E3%82%92%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/417899/YouTube%20-%20%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E7%94%BB%E5%83%8F%E3%82%92%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

'use strict'
/* ----- Customize ----- */
/*
 * 保存時のファイル名のテンプレート
 * サンプル：
 * 「{channel.id} - {channel.username}」 -> 「UCxxxxxxxxxxxxxxxxxxxxxx - xxxxxx」
 * 「{asset.yymmdd} {asset.hhmmss}-{date.millisecond}」 -> 「xxxx-xx-xx xx-xx-xx-xxx」
 *
 * channel
 *   id // チャンネルid
 *   username // チャンネル名
 * date
 *   year // 年
 *   month // 月
 *   date // 日
 *   day // 曜日
 *   hour // 時
 *   minute // 分
 *   second // 秒
 *   milliseconds // ミリ秒
 * asset
 *   yymmdd // 「yy-mm-dd」形式の日付
 *   hhmmss // 「hh-mm-ss」形式の時刻
 */
const FILENAME_TEMPLATE = '{channel.id} - {channel.username}'

/* 保存時のファイルのサイズ */
const FILE_SIZE = 88
/* --------------------- */

const logger = new EasyLogger()
  .setLevel('info')
  .setCategory('youtube_save_icon_image')

/**
 * @template T
 * @param {unknown} obj
 * @param {string} propertyPath
 * @returns {T}
 */
const getProperty = (obj, propertyPath) => {
  let result = obj

  for (const property of propertyPath.split('.')) {
    const value = result[property]

    if (typeof value === 'undefined') {
      return
    }

    result = value
  }

  return result
}

/**
 * @param {string} template
 * @param {any} templateResolveMap
 * @returns {string}
 */
const resolveTemplate = (template, templateResolveMap) => template.replace(/\{(\w+(?:\.\w+)*)\}/g, (_match, propertyPath) => (
  getProperty(templateResolveMap, propertyPath) || ''
))

const createTemplateResolveMap = async () => {
  const [id, username] = await fetch(location.href)
    .then(res => res.text())
    .then(text => text.match(/"channelId":"([\w\-]+)","title":"([^"]*?)"/))
    .then(m => m.slice(1).map(v => (
      v.replace(/\\u[\da-z]{4}/g, u => (
        String.fromCodePoint(Number(u.charAt(/^\\u/, '0x')))
      ))
    )))
  const now = new Date()
  const yymmdd = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(v => v.toString().padStart(2, '0'))
  const [year, month, date] = yymmdd
  const hhmmss = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(v => v.toString().padStart(2, '0'))
  const [hour, minute, second] = hhmmss

  return {
    channel: { id, username },
    date: {
      year, month, date,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
      hour, minute, second,
      millisecond: now.getMilliseconds()
    },
    asset: {
      yymmdd: yymmdd.join('-'),
      hhmmss: hhmmss.join('-')
    }
  }
}

/**
 * @param {string} styleText
 * @returns {HTMLStyleElement}
 */
const createStyleElement = styleText => {
  const styleElement = document.createElement('style')

  styleElement.textContent = styleText

  document.head.append(styleElement)

  return styleElement
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
const sha256Text = async text => (
  Array.from(new Uint8Array(
    await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(text)
    )
  ))
    .map(n => (n
      .toString(16)
      .padStart(2, '0')
    ))
    .join('')
)

const main = async () => {
  const parent = await waitForSelector('#channel-header-container yt-img-shadow', 10000)
  const icon = parent.getElementsByTagName('img')[0]
  const coverClassName = `userscript-${await sha256Text(Date.now().toString())}`

  createStyleElement(`
  .${coverClassName} {
    width: ${icon.offsetWidth}px;
    height: ${icon.offsetWidth}px;
    position: fixed;
    border-radius: 50%;
  }

  .${coverClassName}:hover {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .${coverClassName}:hover::before {
    content: "保存";
    font-size: 1.75rem;
  }
  `)

  const cover = document.createElement('div')

  cover.classList.add(coverClassName)
  parent.insertBefore(cover, icon)

  const templateResolveMap = await createTemplateResolveMap()

  cover.addEventListener('click', () => GM_download({
    url: icon.src,
    name: resolveTemplate(FILENAME_TEMPLATE, templateResolveMap),
    saveAs: false,
    onload: () => logger.info('保存完了'),
    onerror: err => logger.error(err),
    ontimeout: () => logger.error('タイムアウト')
  }))
}

main().catch(err => logger.fatal(err))