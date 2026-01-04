// ==UserScript==
// @name         YouTubeライブ チャット 日本語フィルタ
// @namespace    https://midra.me
// @version      1.6
// @description  日本語以外(アカウント名とメッセージの両方が日本語じゃない)のコメントの透明度を下げるやつです。
// @author       Midra
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/441015/YouTube%E3%83%A9%E3%82%A4%E3%83%96%20%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/441015/YouTube%E3%83%A9%E3%82%A4%E3%83%96%20%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.meta.js
// ==/UserScript==

// @ts-check

{
  'use strict'

  if (window !== window.parent) {
    /**
     * 日本語かどうか判定
     * @param {string} str 判定する文字列
     * @description CJKの記号と句読点(一部)、平仮名、片仮名+片仮名拡張、CJK統合漢字、全角ASCII+全角括弧+半角CJK句読点+半角片仮名
     * @see {@link https://www.asahi-net.or.jp/~ax2s-kmtn/ref/unicode/index.html}
     */
    const isJapanese = (str) => /[\u3000-\u3020\u3040-\u309F\u30A0-\u31FF\u4E00-\u9FFF\uFF00-\uFF9F]/.test(str)
  
    const obs = new MutationObserver(mutationList => {
      obs.disconnect()
      mutationList.forEach(({ target }) => {
        if (!(target instanceof HTMLElement)) return
        if (target.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
          const author = target.querySelector('#author-name')?.textContent
          const msgElem = target.querySelector('#message')
          const message = msgElem?.textContent
          const hasText = [...(msgElem?.childNodes || [])].find(v => v.nodeType === Node.TEXT_NODE) !== undefined
          if (hasText && author !== undefined && message !== undefined && !isJapanese(author) && !isJapanese(message)) {
            target.classList.add('mid-yt-notjp')
          }
        }
      })
      obs.observe(document.body, { childList: true, subtree: true })
    })
    obs.observe(document.body, { childList: true, subtree: true })
  
    document.head.insertAdjacentHTML('beforeend',
      `
      <style>
      .mid-yt-notjp > * {
        opacity: 0.25 !important;
      }
      </style>
      `
    )
  }
}