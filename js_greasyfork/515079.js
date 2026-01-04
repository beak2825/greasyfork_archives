// ==UserScript==
// @name        Event Item Clicker
// @namespace   Marascripts
// @description Click event boxes when they appear.
// @author      marascripts
// @version     1.0.2
// @grant       GM.setValue
// @grant       GM.getValue
// @match       https://www.marapets.com/*
// @match       https://www.marapets.com/pumpkin.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/515079/Event%20Item%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/515079/Event%20Item%20Clicker.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const clickedItems = await GM.getValue('clicked', 0)

  const boxToClick = document.querySelector('.birthdayeventbox a')
    ? document.querySelector('.birthdayeventbox a')
    : document.querySelector('.pumpkineventbox a')

  if (boxToClick) {
    GM.setValue('clicked', clickedItems + 1)
    window.open(
      boxToClick.href,
      'eventitem',
      'width=100,height=100,top=0,left=0,resizable=no'
    )
  }

  function showCount() {
    const bigImage = document.querySelector('.mainfeature_art')
    const span = document.createElement('h2')
    span.innerText = `You have found ${clickedItems} items`
    bigImage.appendChild(span)
  }

  // TODO: Add birthday
  if (location.pathname === '/pumpkin.php') {
    showCount()
  }
})()
