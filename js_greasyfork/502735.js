// ==UserScript==
// @name         ニコニコ動画 ダークモード (自動)
// @description  視聴ページのテーマを強制的にシステムに合わせるやつ
// @namespace    https://midra.me/
// @version      1.0.0
// @author       Midra
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.nicovideo.jp/favicon.ico
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/502735/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%83%80%E3%83%BC%E3%82%AF%E3%83%A2%E3%83%BC%E3%83%89%20%28%E8%87%AA%E5%8B%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502735/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%83%80%E3%83%BC%E3%82%AF%E3%83%A2%E3%83%BC%E3%83%89%20%28%E8%87%AA%E5%8B%95%29.meta.js
// ==/UserScript==

void (() => {
  const setTheme = (theme) => {
    document.body.dataset.colorScheme = theme
  }

  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  setTheme(mq.matches ? 'dark' : 'light')

  mq.addEventListener('change', () => {
    setTheme(mq.matches ? 'dark' : 'light')
  })
})()
