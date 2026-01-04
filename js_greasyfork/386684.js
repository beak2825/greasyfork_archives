// ==UserScript==
// @name         YouTube Age Restriction Bypass
// @namespace    https://greasyfork.org/users/221926
// @version      1.5.r
// @description  Watch restricted videos without having to log in.
// @include      https://m.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386684/YouTube%20Age%20Restriction%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/386684/YouTube%20Age%20Restriction%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const NEW_LAYOUT_PLAYER_CONTAINER_ID = 'player-container'
  const NEW_LAYOUT_ERROR_SCREEN_ID = 'error-screen'
  const OLD_LAYOUT_SIDEBAR_MODULES_ID = 'watch7-sidebar-modules'
  const NEW_LAYOUT_RELATED_ITEM_TEMPLATE = rv => `<a href="/watch?v=${rv.id}" style="text-decoration:none;display:block;margin-bottom:8px;" title="${rv.title}"><table style="border-collapse:collapse"><td style="position:relative;padding:0"><img src="${rv.iurlmq}" style="width:168px;height:94px;display:block;margin-right:8px"><span style="position:absolute;bottom:0;right:8px;margin:4px;color:var(--ytd-thumbnail-badge_-_color,#fff);background-color:var(--ytd-thumbnail-badge_-_background-color,rgba(0,0,0,.8));padding:2px 4px;border-radius:2px;letter-spacing:.5px;font-size:1.2rem;font-weight:500;line-height:1.2rem">${rv.duration}</span></td><td style="vertical-align:top;"><span style="display:block;margin:0 0 4px 0;max-height:3.2rem;overflow:hidden;font-size:1.4rem;font-weight:500;line-height:1.6rem;color:var(--yt-primary-text-color,rgba(255,255,255,0.88));">${rv.title}</span><div style="color:var(--ytd-metadata-line-color,var(--yt-spec-text-secondary,#aaa));font-size:1.3rem;font-weight:400;line-height:1.8rem;">${rv.author}<br>${rv.short_view_count_text}</div></td></table></a>`
  const OLD_LAYOUT_RELATED_ITEM_TEMPLATE = rv => `<div class="video-list-item related-list-item show-video-time related-list-item-compact-video"><div class="content-wrapper"><a href="/watch?v=${rv.id}" class="content-link spf-link yt-uix-sessionlink spf-link"><span dir="ltr" class="title">${rv.title}</span><span class="stat attribution"><span class="">${rv.author}</span></span><span class="stat view-count">${rv.short_view_count_text}</span></a></div><div class="thumb-wrapper"><a href="/watch?v=${rv.id}" class="thumb-link spf-link yt-uix-sessionlink" tabindex="-1" rel=" spf-prefetch nofollow" aria-hidden="true"><span class="yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related"><img alt="" src="${rv.iurlmq}" style="top: 0px" aria-hidden="true" width="168" height="94"><span class="video-time">${rv.duration}</span></span></a></div></div>`

  let player = null
  let related = null
  let currentVideoId = null

  // General
  function escapeHTML (str) {
    return document.createElement('div').appendChild(document.createTextNode(str)).parentNode.innerHTML
  }

  // DOM
  function removeNode (n) {
    if (n != null && n.parentNode != null) { n.parentNode.removeChild(n) }
  }

  function asyncQuerySelector (query, token = {}) {
    return new Promise((resolve, reject) => {
      const ival = setInterval(function () {
        const el = document.querySelector(query)
        if (el != null) { clearInterval(ival); resolve(el) }
      }, 100)
      token.cancel = () => { clearInterval(ival); reject() }
    })
  }

  // YouTube
  function getVideoId () {
    return new URLSearchParams(location.search).get('v')
  }

  function getVideoStart () {
    const t = new URLSearchParams(location.search).get('t') || 0
    if (!isNaN(t)) { return +t }
    let multipliers = { h: 3600, m: 60, s: 1 }
    return t.match(/[0-9]+[a-z]/g)
      .map(str => str.slice(0, -1) * multipliers[str.slice(-1)])
      .reduce((a, b) => a + b)
  }

  function isInitialVideoAndAgeRestricted (videoId = getVideoId()) {
    // https://greasyfork.org/scripts/371261
    return window.ytInitialPlayerResponse != null &&
      typeof window.ytInitialPlayerResponse.playabilityStatus.desktopLegacyAgeGateReason != 'undefined' &&
      window.ytInitialPlayerResponse.playabilityStatus.desktopLegacyAgeGateReason &&
      window.ytInitialPlayerResponse.videoDetails.videoId === videoId
  }

  // Script
  const newLayout = Object.freeze({
    restrictedVideoIds: [],
    fallbackLink: (() => {
      const span = document.createElement('span')
      span.innerText = 'Click here if the video is age restricted'
      span.style = 'font-size:1.6rem;margin-top:1rem;color:#fff;cursor:pointer;text-decoration:underline'
      span.onclick = () => { reset(); newLayout.unrestrict() }
      return span
    })(),
    checkDOMAndPrepare () {
      let signInButton = null
      const errorScreenInfoDiv = document.querySelector('#error-screen #info')
      if (errorScreenInfoDiv != null) {
        // signInButton
        signInButton = errorScreenInfoDiv.getElementsByTagName('yt-button-renderer')[0]
        removeNode(signInButton) // avoids false positives
        // fallbackLink
        removeNode(newLayout.fallbackLink)
        errorScreenInfoDiv.appendChild(newLayout.fallbackLink)
      }
      return signInButton != null
    },
    checkAndPrepare (videoId = getVideoId()) {
      const DOMCheck = newLayout.checkDOMAndPrepare()
      const inArray = newLayout.restrictedVideoIds.includes(videoId) // signInButton may not have been recreated while navigating back/forward, check array too
      if (DOMCheck || inArray || isInitialVideoAndAgeRestricted(videoId)) {
        if (!inArray) { newLayout.restrictedVideoIds.push(videoId) }
        return true
      }
      return false
    },
    unrestrict (videoId = getVideoId(), options = {}) {
      const oldPlayer = document.getElementById(NEW_LAYOUT_PLAYER_CONTAINER_ID)
      // pause video (useful when coming back from an unrestricted video)
      document.querySelectorAll('video').forEach(el => el.pause())
      // player
      createPlayer(videoId, oldPlayer.parentNode)
      player.id = oldPlayer.id
      player.className = oldPlayer.className
      // related
      const rs = document.getElementById('related-skeleton')
      if (rs != null && rs.parentNode != null) {
        rs.style.display = 'none'
        showRelatedVideos(videoId, rs.parentNode, NEW_LAYOUT_RELATED_ITEM_TEMPLATE)
      }
      // remove/hide blocking elements
      document.querySelectorAll('[player-unavailable]').forEach(el => el.removeAttribute('player-unavailable'))
      removeNode(document.querySelector('#player.skeleton'))
      oldPlayer.style.display = 'none';
      (options.errorScreen || document.getElementById(NEW_LAYOUT_ERROR_SCREEN_ID)).style.display = 'none'
    },
    checkAndUnrestrict (videoId, options) {
      if (newLayout.checkAndPrepare(videoId)) { newLayout.unrestrict(videoId, options) }
    },
    reset () {
      (document.getElementById(NEW_LAYOUT_PLAYER_CONTAINER_ID) || { style: {} }).style.display = '';
      (document.getElementById(NEW_LAYOUT_ERROR_SCREEN_ID) || { style: {} }).style.display = ''
    }
  })

  const oldLayout = Object.freeze({
    check () {
      return document.getElementById('watch7-player-age-gate-content') != null
    },
    unrestrict (videoId = getVideoId(), options = {}) {
      const playerParentNode = document.getElementById('player-unavailable')
      playerParentNode.innerHTML = ''
      createPlayer(videoId, playerParentNode)
      showRelatedVideos(videoId, options.sidebarModulesContainer || document.getElementById(OLD_LAYOUT_SIDEBAR_MODULES_ID), OLD_LAYOUT_RELATED_ITEM_TEMPLATE).then(() => { related.className = 'video-list' })
    },
    checkAndUnrestrict (videoId, options) {
      if (oldLayout.check()) { oldLayout.unrestrict(videoId, options) }
    },
    reset () {}
  })

  function createPlayer (videoId, parentNode) {
    player = document.createElement('iframe')
    player.src = `https://m.youtube.com/embed/${videoId}?start=${getVideoStart()}&autoplay=1`
    player.style = 'border:0;width:100%;height:100%'
    player.setAttribute('allowfullscreen', '') // firefox
    parentNode.appendChild(player)
  }

  async function showRelatedVideos (videoId, parentNode, itemTemplate) {
    let innerHTML = ''
    const videoInfo = await fetch('https://m.youtube.com/get_video_info?asv=3&video_id=' + videoId).then(res => res.text())
    if (videoId !== getVideoId()) { return }
    new URLSearchParams(videoInfo).get('rvs').split(',').forEach(str => {
      const rv = new URLSearchParams(str)
      if (rv.has('title')) {
        innerHTML += itemTemplate({
          id: rv.get('id'),
          author: escapeHTML(rv.get('author')),
          title: escapeHTML(rv.get('title')),
          duration: Math.floor(rv.get('length_seconds') / 60) + ':' + ('0' + (rv.get('length_seconds') % 60)).substr(-2),
          iurlmq: rv.get('iurlmq'),
          short_view_count_text: rv.get('short_view_count_text')
        })
      }
    })
    related = document.createElement('div')
    related.innerHTML = innerHTML
    parentNode.appendChild(related)
  }

  function reset () {
    removeNode(player)
    removeNode(related)
    newLayout.reset()
    oldLayout.reset()
  }

  function checkAndUnrestrict () {
    const videoId = getVideoId()
    if (videoId === currentVideoId) { return }
    currentVideoId = videoId
    reset() // useful when coming back from a restricted video
    if (videoId == null) { return }

    const newLayoutToken = { cancel: () => {} }
    const oldLayoutToken = { cancel: () => {} }
    asyncQuerySelector('#' + NEW_LAYOUT_ERROR_SCREEN_ID, newLayoutToken).then(errorScreen => {
      oldLayoutToken.cancel()
      if (videoId !== currentVideoId) { return }
      newLayout.checkAndUnrestrict(videoId, { errorScreen })
    }).catch(() => {})
    asyncQuerySelector('#' + OLD_LAYOUT_SIDEBAR_MODULES_ID, oldLayoutToken).then(sidebarModulesContainer => {
      newLayoutToken.cancel()
      if (videoId !== currentVideoId) { return }
      oldLayout.checkAndUnrestrict(videoId, { sidebarModulesContainer })
    }).catch(() => {})
  }

  // new layout; chrome: prevents redirection to the last unrestricted video or /watch?v=undefined when leaving fullscreen; non-theater: prevents the parent nodes of the iframe from being hidden
  addEventListener('fullscreenchange', (ev) => { if (newLayout.restrictedVideoIds.includes(getVideoId())) { ev.stopImmediatePropagation() } }, true)

  // new layout; getEventListeners(window)
  addEventListener('yt-navigate-start', reset)
  addEventListener('yt-navigate-finish', checkAndUnrestrict)
  // old layout; getEventListeners(window)
  addEventListener('spfdone', checkAndUnrestrict)
  // fallback
  setTimeout(checkAndUnrestrict, 100)
  setTimeout(checkAndUnrestrict, 2000)
  new MutationObserver(checkAndUnrestrict).observe(document.getElementsByTagName('title')[0] || document, { childList: true, subtree: true })
})()
