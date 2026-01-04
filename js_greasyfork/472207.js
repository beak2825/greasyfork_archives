// ==UserScript==
// @name         Wikipedia Decent Layout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wikipedia classic (vector) layout
// @author       Bas Blanken
// @match        *://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472207/Wikipedia%20Decent%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/472207/Wikipedia%20Decent%20Layout.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const vectorUrl = function (inputUrl) {
    let url = new URL(inputUrl)
    let params = new URLSearchParams(url.search)

    if (!params.has('useskin') || params.get('useskin') !== 'vector') {
      params.set('useskin', 'vector')
      url.search = params.toString()
    }

    return url.href
  }

  const current = window.location.href
  const parsedUrl = vectorUrl(current)

  if (parsedUrl !== current) {
    window.location.replace(parsedUrl)
  }

  for (const link of document.links) {
    const linkUrl = new URL(link.href)
    const hostNameParts = linkUrl.hostname.split('.')
    const linkHostName = hostNameParts.slice(-2).join('.')
    if (linkHostName === 'wikipedia.org') {
      const parsedLinkUrl = vectorUrl(linkUrl.href)
      if (parsedLinkUrl !== linkUrl.href) {
        link.href = parsedLinkUrl
      }
    }
  }
})()
