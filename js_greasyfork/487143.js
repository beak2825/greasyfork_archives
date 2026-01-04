// ==UserScript==
// @name         Fediverse Hashflags
// @namespace    https://midra.me/
// @version      2.1.3
// @description  X(Twitter)のHashflags(Hashmojis)をMisskey, Mastodon, Bluesky, TOKIMEKIで表示
// @author       Midra
// @license      MIT
// @match        https://*/*
// @icon         https://hashmojis.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/487143/Fediverse%20Hashflags.user.js
// @updateURL https://update.greasyfork.org/scripts/487143/Fediverse%20Hashflags.meta.js
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

void (async () => {
  'use strict'

  const HASHFLAGS_UPDATE_INTERVAL = 2 * 60 * 60 * 1000

  const service = {
    twitter:
      location.href.startsWith('https://twitter.com/') ||
      location.href.startsWith('https://x.com/'),
    misskey:
      document
        .querySelector('meta[name="application-name"]')
        ?.getAttribute('content') === 'Misskey',
    mastodon:
      document.querySelector(
        '#mastodon, #mastodon-svg-logo, #mastodon-svg-logo-full'
      ) !== null,
    // bluesky: location.href.startsWith('https://bsky.app/'),
    tokimeki:
      location.href.startsWith('https://tokimeki.blue/') ||
      location.href.startsWith('https://tokimekibluesky.vercel.app/'),
  }

  if (!Object.values(service).some((v) => v)) return

  /** @type {TwitterHashflag[]} */
  const hashflags = GM_getValue('hashflags', [])
  /** @type {TwitterHashflag[]} */
  const activeHashflags = hashflags
    .filter((v) => Date.now() < v.ending_timestamp_ms)
    .map((v) => ((v.hashtag = v.hashtag.toLowerCase()), v))
  const activeHashtags = activeHashflags.map((v) => v.hashtag)

  /**
   * @type {Console['log']}
   */
  const log = (...data) => console.log('[Fediverse Hashflags]', ...data)
  /**
   *  @type {Console['error']}
   */
  const error = (...data) => console.error('[Fediverse Hashflags]', ...data)

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
    const hashtags = target.querySelectorAll(
      'a[href*="/tags/"], a[href^="/search?q="]'
    )

    for (const tag of hashtags) {
      const tagUrl = new URL(tag.href)

      if (
        !tag.classList.contains('twitter-hashflag-wrap') &&
        ((service.tokimeki && tagUrl.pathname === '/search') ||
          tagUrl.pathname.startsWith('/tags/'))
      ) {
        const text = tag.textContent

        if (!text?.startsWith('#')) continue

        const hashflag = getHashflag(text.substring(1))

        if (hashflag) {
          const img = document.createElement('img')
          img.classList.add('twitter-hashflag')
          img.src = hashflag.asset_url
          tag.appendChild(img)
          tag.classList.add('twitter-hashflag-wrap')
        }
      }
    }
  }

  // /**
  //  * @param {Element} target
  //  */
  // const removeHashflags = (target) => {
  //   for (const elm of target.getElementsByClassName('twitter-hashflag')) {
  //     elm.remove()
  //   }

  //   for (const elm of target.getElementsByClassName('twitter-hashflag-wrap')) {
  //     elm.classList.remove('twitter-hashflag-wrap')
  //   }
  // }

  // Twitter (Hashflagsの取得・保存)
  if (service.twitter) {
    log('Twitter')

    const lastUpdated = GM_getValue('hashflags_lastupdated', 0)

    if (HASHFLAGS_UPDATE_INTERVAL < Date.now() - lastUpdated) {
      try {
        const res = await fetch('https://x.com/i/api/1.1/hashflags.json')
        /** @type {TwitterHashflag[]} */
        const json = await res.json()

        if (json && 0 < json.length) {
          GM_setValue('hashflags', json)
          GM_setValue('hashflags_lastupdated', Date.now())

          log('Hashflagsを保存しました')
        }
      } catch (err) {
        error(err)
      }
    }
  } else {
    if (service.misskey) log('Misskey')
    if (service.mastodon) log('Mastodon')
    // if (service.bluesky) console.log('Bluesky')
    if (service.tokimeki) log('TOKIMEKI (Bluesky)')

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
    GM_addStyle(`
      .twitter-hashflag-wrap {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.2em;
      }
      .twitter-hashflag {
        height: 1.2em;
        margin-top: -0.125em;
      }
    `)
  }
})()
