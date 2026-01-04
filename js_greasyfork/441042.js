// ==UserScript==
// @name         Bet365 赔率提醒
// @namespace    https://github.com/aaronchen233
// @version      4.3
// @description  当Bet365的赔率大于2时，提醒用户的脚本
// @author       aaronchen
// @match        https://www.bet365.com/*
// @include      /^https://www\.365(365|-)[0-9]{3}\.com/.*$/
// @icon         https://www.bet365.com/sportsbook-static/favicons/main-favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/441042/Bet365%20%E8%B5%94%E7%8E%87%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/441042/Bet365%20%E8%B5%94%E7%8E%87%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const btn = document.createElement('button'),
    aud = document.createElement('audio'),
    obs1 = new MutationObserver(() => {
      betslip = document.querySelector('.bss-StandardBetslip')
      betslip?.appendChild(btn) && obs1.disconnect()
    }),
    config = { childList: true, subtree: true },
    oddsThreshold = 2,
    labels = [`赔率大于${oddsThreshold}提醒`, '提醒已开启'],
    obs2 = new MutationObserver(() => {
      const odds = betslip.querySelector('.bsc-OddsDropdownLabel').childNodes[0]
        .innerHTML
      if (odds >= oddsThreshold) {
        obs2.disconnect()
        aud.currentTime = 0
        aud.muted = false
        updateLabel()
      }
    })
  let betslip,
    muteCount = 0,
    state = 0

  const updateLabel = () => {
    state = (state + 1) % labels.length
    btn.innerHTML = labels[state]
  }

  btn.innerHTML = labels[state]
  btn.style.cssText =
    'width: 100%; height: 48px; border: none; background-color: rgb(95, 74, 139); font-size: 14px; font-weight: 700; color: #fff; cursor: pointer;'

  aud.src = 'https://freesound.org/data/previews/91/91926_7037-lq.mp3'
  aud.muted = true
  document.body.appendChild(aud)

  aud.addEventListener('ended', async () => {
    if (!aud.muted) {
      muteCount = (muteCount + 1) % 3
      aud.muted = muteCount === 0
    }
    aud.currentTime = 0
    await aud.play()
  })

  obs1.observe(document.body, config)

  btn.addEventListener('click', () => {
    updateLabel()
    state ? obs2.observe(betslip, config) : obs2.disconnect()
    aud.paused && aud.play()
  })
})()
