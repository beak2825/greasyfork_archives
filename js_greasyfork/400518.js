/**
 * 強烈建議您：先行開啟虛擬交易之後，再執行安裝，或更新版本；並在虛擬交易中，嘗試之後再應用於真實交易之上。
 *
 * Strong Recommended: Turn on the virtual mode at first, and install or update
 * with a new version, and make sure you have tried it in virtual mode before
 * real trading.
 *
 * Changelog:
 *   https://github.com/hilezir/etoro-better-ui/releases
 *
 * Website:
 *   https://www.notion.so/hilezi/eToro-better-UI-day-trading-helper-enhancement--4fe69cd704434ff1b82f0cd48dd219c3
 *
 * Donation:
 *   https://www.notion.so/hilezi/Free-and-Donations-ab484fc786bf44f8b19a017fdbe4a698
 */

// ==UserScript==
// @name            eToro Better UI 當沖外掛
// @name:en         eToro Better UI Trading Plugin
// @description     本套件不提供「自動程式交易」的功能，本套件的核心思想是在盡可能不破壞 eToro 的介面上，介入提升用戶體驗。因此你仍然應該由自己作主下單交易。100% 開源程式碼，免費安裝並使用。
// @description:en  An extension in order to improve Better UI/UX on the eToro system. 100% Open Source on Github can be inspected or verify, no worries.
// @version         0.39.0
// @author          https://www.etoro.com/people/aqzhyi
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @match           https://*.etoro.com/*
// @match           https://etoro.com/*
// @exclude         https://*.etoro.com/chat
// @exclude         https://*.etoro.com/chats
// @exclude         https://*.etoro.com/*/chat
// @exclude         https://*.etoro.com/*/chats
// @run-at          document-idle
// @noframes
// @namespace       http://tampermonkey.net/

///////////////////** 甜豬的雲端（developer site） */
// @connect         etoro-plugins.netlify.app

///////////////////** 開源程式碼庫（open sources hosting） */
// @connect         cdn.jsdelivr.net
// @connect         cdnjs.cloudflare.com

///////////////////** 台灣臺灣銀行（Taiwan Bank） */
// @connect         bot.com.tw

///////////////////** 馬國大眾銀行（PBE Bank） */
// @connect         www.pbebank.com

///////////////////** 本地開發專用（for the plugin development） */
// @connect         127.0.0.1
// @connect         localhost
// @downloadURL https://update.greasyfork.org/scripts/400518/eToro%20Better%20UI%20%E7%95%B6%E6%B2%96%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/400518/eToro%20Better%20UI%20%E7%95%B6%E6%B2%96%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

// @ts-check

try {
  const urlOfCloud = `https://etoro-plugins.netlify.app/etoro-better-ui.latest.js`
  const urlOfDev = `http://127.0.0.1:9000/etoro-better-ui.latest.js`

  console.info('🟡 etoro-better-ui... loading...')

  const messageOfUnknownError = `🔴 ERROR: etoro-better-ui has been failed to loaded.`

  loadScript(urlOfDev)
    .then(() => {
      console.info(`💚 正在啟動本地開發版`)
    })
    .catch(() => {
      return loadScript(urlOfCloud)
    })
} catch (error) {
  if (error instanceof Error) {
    alert(error.message)
  } else {
    alert(`ERROR: etoro-better-ui has been failed to loaded.`)
  }
}

function loadScript(
  /** @type {string} */
  url,
) {
  const __DEV__ = url.includes('127.0.0.1') || url.includes('localhost')

  return new Promise((resolve, reject) => {
    window['GM_xmlhttpRequest']({
      url: url,
      nocache: __DEV__ ? true : undefined,
      headers: __DEV__
        ? undefined
        : {
            'Cache-Control': 'max-age=720',
          },
      /** Revalidate maybe cached content */
      revalidate: true,
      onload: event => {
        console.info('🟠 etoro-better-ui... almost done...')
        eval(event.responseText)
        console.info('🟢 etoro-better-ui... has been loaded...')
        resolve(true)
      },
      onerror: error => {
        reject(
          new Error('🔴 ERROR: etoro-better-ui has been failed to loaded.'),
        )
      },
    })
  })
}
