// ==UserScript==
// @name         Misskey Hashflags
// @namespace    https://midra.me/
// @version      1.0.5
// @description  TwitterのHashflagsをMisskeyに表示するやつ
// @author       Midra
// @license      MIT
// @match        https://*/*
// @icon         https://raw.githubusercontent.com/misskey-dev/assets/main/icon.png
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/475204/Misskey%20Hashflags.user.js
// @updateURL https://update.greasyfork.org/scripts/475204/Misskey%20Hashflags.meta.js
// ==/UserScript==

// @ts-check

/**
 * @typedef TwitterHashflag
 * @property {string}  hashtag
 * @property {string}  asset_url
 * @property {number}  starting_timestamp_ms
 * @property {number}  ending_timestamp_ms
 * @property {boolean} is_hashfetti_enabled
 */

;(async () => {
  'use strict'

  const HASHFLAGS_UPDATE_INTERVAL = 2 * 60 * 60 * 1000

  const isTwitter =
    location.href.startsWith('https://twitter.com/') ||
    location.href.startsWith('https://x.com/')
  const isMisskey =
    document
      .querySelector('meta[name="application-name"]')
      ?.getAttribute('content') === 'Misskey'

  if (!isTwitter && !isMisskey) return

  /** @type {TwitterHashflag[]} */
  const hashflags = GM_getValue('hashflags', [])
  /** @type {TwitterHashflag[]} */
  const activeHashflags = hashflags
    .filter((v) => Date.now() < v.ending_timestamp_ms)
    .map((v) => ((v.hashtag = v.hashtag.toLowerCase()), v))
  const activeHashtags = activeHashflags.map((v) => v.hashtag)

  /**
   * @param {string} [hashtag]
   * @returns {TwitterHashflag | undefined}
   */
  const getHashflag = (hashtag) => {
    if (!hashtag) return

    const hashflag =
      activeHashflags[activeHashtags.indexOf(hashtag.toLowerCase())]

    if (
      hashflag &&
      hashflag.starting_timestamp_ms <= Date.now() &&
      Date.now() < hashflag.ending_timestamp_ms
    ) {
      return hashflag
    }
  }

  /**
   * @param {Element} target
   */
  const addHashflags = (target) => {
    if (activeHashflags.length === 0) return

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const hashtags = target.querySelectorAll('a[href^="/tags/"]')
    for (const tag of hashtags) {
      if (tag.classList.contains('hasTwitterHashflag')) continue

      const text = tag.textContent
      if (!text?.startsWith('#')) continue

      const hashflag = getHashflag(text.substring(1))
      if (hashflag) {
        const img = document.createElement('img')
        img.classList.add('twitter_hashflag')
        img.src = hashflag.asset_url
        tag.appendChild(img)
        tag.classList.add('hasTwitterHashflag')
      }
    }
  }

  // /**
  //  * @param {Element} target
  //  */
  // const removeHashflags = (target) => {
  //   for (const elm of target.getElementsByClassName('twitter_hashflag')) {
  //     elm.remove()
  //   }
  //   for (const elm of target.getElementsByClassName('hasTwitterHashflag')) {
  //     elm.classList.remove('hasTwitterHashflag')
  //   }
  // }

  // Twitter (Hashflagsの取得・保存)
  if (isTwitter) {
    console.log('[Misskey Hashflags] Twitter')

    const lastUpdated = GM_getValue('hashflags_lastupdated', 0)
    if (HASHFLAGS_UPDATE_INTERVAL < Date.now() - lastUpdated) {
      try {
        const res = await fetch('https://twitter.com/i/api/1.1/hashflags.json')
        /** @type {TwitterHashflag[]} */
        const json = await res.json()

        if (json && 0 < json.length) {
          GM_setValue('hashflags', json)
          GM_setValue('hashflags_lastupdated', Date.now())

          console.log('[Misskey Hashflags] Hashflagsを保存しました')
        }
      } catch (e) {
        console.error('[Misskey Hashflags]', e)
      }
    }
  }
  // Misskey
  else if (isMisskey) {
    console.log('[Misskey Hashflags] Misskey')

    addHashflags(document.body)

    /** @type {MutationObserverInit} */
    const obs_options = {
      childList: true,
      subtree: true,
    }
    const obs = new MutationObserver((mutations) => {
      obs.disconnect()

      for (const mutation of mutations) {
        if (!(mutation.target instanceof HTMLElement)) continue

        if (0 < mutation.addedNodes.length) {
          addHashflags(mutation.target)
        }
      }

      obs.observe(document.body, obs_options)
    })

    obs.observe(document.body, obs_options)

    // style
    const style = document.createElement('style')
    style.textContent = `
    .twitter_hashflag {
      display: inline-block;
      height: 1.1em;
      margin: 0 2px -0.15em;
    }
    `
    document.body.appendChild(style)
  }
})()
