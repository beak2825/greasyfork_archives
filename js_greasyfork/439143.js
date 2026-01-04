// ==UserScript==
// @name            YouTube Video Ad Clicker
// @description     Automatically Click Video Ads
// @version         1.0.0
// @author          badbrain
// @namespace       patchmonkey
// @license         MIT
// @match           https://www.youtube.com/*
// @run-at          document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439143/YouTube%20Video%20Ad%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/439143/YouTube%20Video%20Ad%20Clicker.meta.js
// ==/UserScript==


const PLAYER_CLASS = '.html5-video-player'

const PLAYER_EVENT = 'yt-player-updated'

const AD_SHOWING = 'ad-showing'

const AD_INTERRUPTING = 'ad-interrupting'

const SKIP_BUTTON = 'ytp-ad-skip-button'


const tags = [
  'ytd-promoted-sparkles-web-renderer',
  'ytd-display-ad-renderer',
  '#masthead-ad',
  '#player-ads',
  '.video-ads'
]


const comp = (f, g) => x => g(f(x))

const compose = (...f) => f.reduce(comp)

const query = x => y => y.querySelector(x)

const target = x => x.target

const index = x => y => y[x]


const process = el => {
  if (!el.classList.contains(AD_SHOWING)) return
  if (!el.classList.contains(AD_INTERRUPTING)) return
  const button = el.querySelector(`.${SKIP_BUTTON}`)
  if (button) button.click()
}

const mutations = new MutationObserver(compose(index(0), target, process))

const observe = x => mutations.observe(x, { attributeFilter: ['class'] })

const start = compose(query(PLAYER_CLASS), observe)

document.head
.appendChild(document.createElement('style'))
.appendChild(document.createTextNode(`${tags.join(',')} { display: none !important; }`))

window.addEventListener(PLAYER_EVENT, compose(target, start))

Promise.resolve(document.body).then(start).catch(e => e)
