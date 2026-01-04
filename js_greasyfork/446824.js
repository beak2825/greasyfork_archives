// ==UserScript==
// @name         ニコニコ動画 引用コメントツール
// @namespace    https://midra.me
// @version      4.0.0
// @description  dアニメストア ニコニコ支店の引用コメント関連のツール
// @author       Midra
// @license      MIT
// @match        https://www.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_openInTab
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/446824/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%BC%95%E7%94%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/446824/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%BC%95%E7%94%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

void (async () => {
  /** @type {typeof GM_getValue| undefined} */
  let getValue
  /** @type {typeof GM_setValue | undefined} */
  let setValue
  /** @type {typeof GM_openInTab | undefined} */
  let openInTab

  try {
    getValue = GM_getValue
    setValue = GM_setValue
    openInTab = GM_openInTab
  } catch {
    try {
      getValue = GM.getValue
      setValue = GM.setValue
      openInTab = GM.openInTab
    } catch {}
  }

  if (
    typeof getValue !== 'function' ||
    typeof setValue !== 'function' ||
    typeof openInTab !== 'function'
  ) {
    return
  }

  if (!(await getValue('ect_v4_opened'))) {
    const url =
      'https://github.com/Midra429/ExtraCommentTools/releases/tag/v4.0.0'

    openInTab(url, { active: true })
    setValue('ect_v4_opened', true)
  }
})()
