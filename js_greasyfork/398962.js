// ==UserScript==
// @name        Playback speed youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      cchudant
// @description 29/03/2020, 20:48:18
// @downloadURL https://update.greasyfork.org/scripts/398962/Playback%20speed%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/398962/Playback%20speed%20youtube.meta.js
// ==/UserScript==

(async () => {
  const wait = t => new Promise(r => setTimeout(r, t))
  const enumerate = n => Array(n).fill(0).map((_, i) => i)

  while (!document.querySelector('#primary #player'))
    await wait(100);

  const div = document.createElement('div')
  div.style = `
    padding: 5px 0px;
    margin-top: 5px;
  `

  document.querySelector('#primary #player')
    .appendChild(div)

  enumerate(3*4 + 1).map(i => {
    const rate = 1 + i / 4

    const btn = document.createElement('div')
    btn.innerText = `x${rate}`
    btn.style = `
      display: inline;
      background-color: lightgreen;
      padding: 5px 10px;
      border-radius: 5px;
      margin: 2px;
      cursor: pointer;
      font-size: 1.3em;
    `
    btn.addEventListener('click', () => {
      document.querySelector('video').playbackRate = rate
    })

    div.appendChild(btn)
  })

  console.log('Playback speed script loaded!')

})().catch(console.error)
