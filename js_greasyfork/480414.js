// ==UserScript==
// @name        Fix YouTube Embeds - quartersnacks.com
// @namespace   Violentmonkey Scripts
// @match       https://quartersnacks.com/*
// @grant
// @version     1.0
// @author      Michael Gale <https://www.michaelgale.dev>
// @description 21/11/2023, 1:23:44 pm
// @esversion   11
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480414/Fix%20YouTube%20Embeds%20-%20quartersnackscom.user.js
// @updateURL https://update.greasyfork.org/scripts/480414/Fix%20YouTube%20Embeds%20-%20quartersnackscom.meta.js
// ==/UserScript==

setTimeout(() => {
  const iframes = [...document?.querySelectorAll('.embed-responsive > iframe')]

  iframes?.forEach(iframe => {
    const newSrc = iframe
      ?.src
      ?.replace('http://', 'https://')

    iframe.src = newSrc
  })

}, 2000)

