// ==UserScript==
// @name         125bt_auto
// @version      0.0.1
// @include      http://www.125bt.com/play/*
// @include      http://www.125bt.com/static/player/*
// @include      https://youku.cdn-163.com/share/*
// @include      https://youku.com-youku.com/share/*
// @include      https://iqiyi.com-l-iqiyi.com/share/*
// @include      https://tudou.com-l-tudou.com/share/*
// @description  auto next and fullscreen
// @namespace    https://greasyfork.org/users/164996a
// @downloadURL https://update.greasyfork.org/scripts/381726/125bt_auto.user.js
// @updateURL https://update.greasyfork.org/scripts/381726/125bt_auto.meta.js
// ==/UserScript==
const m = document.querySelector('iframe:not([id])')
const c = document.querySelector('a.payactive')
const f = document.querySelector('button.dplayer-full-icon')
const p = document.querySelector('button.dplayer-play-icon')
const v = document.querySelector('video')
let l
if (f && v && p) {
  // video dom
  if (v.paused) p.click()
  l = window.addEventListener('message', e => {
    if (e.data === 'fullscreen') {
      window.removeEventListener('message', l)
      f.click()
    }
  })
  v.addEventListener(
    'ended',
    () => {
      window.top.postMessage('next')
    },
    { once: true }
  )
} else if (m && c) {
  // main dom
  m.focus()
  ;(async () => {
    await new Promise(r => setTimeout(r, 500))
    m.contentWindow.postMessage('fullscreen', '*')
    let n = c.parentElement.nextElementSibling
    n = n && n.firstElementChild
    if (!n) return
    l = window.addEventListener('message', e => {
      if (e.data === 'next') {
        window.removeEventListener('message', l)
        n.click()
      }
    })
  })()
}
