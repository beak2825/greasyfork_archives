// ==UserScript==
// @name         imomoe
// @version      0.0.1
// @include      http://www.imomoe.io/player/*
// @include      https://api.xiaomingming.org/cloud/*
// @description  add next
// @namespace    https://greasyfork.org/users/164996a
// @downloadURL https://update.greasyfork.org/scripts/391400/imomoe.user.js
// @updateURL https://update.greasyfork.org/scripts/391400/imomoe.meta.js
// ==/UserScript==
const m = document.querySelector('iframe[src]')
const c = document.querySelector('div.dplayer-icons-right')
const dp = unsafeWindow.dp
if (dp) {
  dp.play()
  const next = () => {
    window.top.postMessage('next', '*')
  }
  c.insertAdjacentHTML(
    'afterbegin',
    "<button id='next' class='dplayer-quality dplayer-icon dplayer-quality-icon'>下一集</button>"
  )
  const b = document.querySelector('#next')
  b.addEventListener('click', next)
  window.addEventListener('message', e => {
    if (e.data === 'next unavailable') {
      b.remove()
    }
  })
  dp.on('ended', next)
} else if (m) {
  m.focus()
  let a, b
  for (let i of document.querySelectorAll('.movurls')) {
    a = [...i.querySelectorAll('a')]
    b = a.findIndex(i => i.href === window.location.href)
    if (b === -1) continue
    a = a[b + 1]
    if (a) a = a.href
    break
  }
  document
    .querySelectorAll('.movurls a')
    .forEach(i => i.setAttribute('target', '_self'))
  window.addEventListener('message', e => {
    if (e.data === 'next') {
      window.location.href = a
    }
  })
  ;(async () => {
    await new Promise(r => setTimeout(r, 5000))
    if (!a) m.contentWindow.postMessage('next unavailable', '*')
  })()
}
