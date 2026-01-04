// ==UserScript==
// @name Steam Trading Cards Link Replacer
// @description Replaces the "Steam Trading Cards" link in the Steam Store with a link to the actual list of trading cards in the Steam Market
// @version 1.0.1
// @author guihkx
// @match https://store.steampowered.com/app/*
// @license MIT; https://opensource.org/licenses/MIT
// @run-at document-idle
// @namespace https://github.com/guihkx
// @icon https://steamcommunity-a.akamaihd.net/economy/emoticonlarge/tradingcard
// @homepageURL https://github.com/guihkx/user-scripts
// @supportURL https://github.com/guihkx/user-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/433407/Steam%20Trading%20Cards%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/433407/Steam%20Trading%20Cards%20Link%20Replacer.meta.js
// ==/UserScript==

/**
 * Changelog:
 *
 * v1.0.1 (2025-01-03):
 * - Fix element injection.
 *
 * v1.0.0 (2020-04-28):
 * - First release
 */

;(() => {
  'use strict'

  const tCardsSection = document.querySelector(
    '#category_block img.category_icon[src*="ico_cards.png"]'
  )

  if (tCardsSection === null) {
    return
  }
  const appId = window.location.pathname.split('/')[2]
  const tCardsLink = tCardsSection.parentElement.parentElement

  const marketUrl = new URL('https://steamcommunity.com/market/search')
  marketUrl.searchParams.set('appid', '753')
  marketUrl.searchParams.set('category_753_Game[]', `tag_app_${appId}`)
  marketUrl.searchParams.set('category_753_item_class[]', 'tag_item_class_2')
  marketUrl.searchParams.set('q', '')
  marketUrl.hash = '#p1_name_asc'

  tCardsLink.href = marketUrl
  tCardsLink.target = '_blank'
})()
