// ==UserScript==
// @name        YouTube Theme
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/berrygarden*
// @grant       none
// @version     1.0
// @author      -
// @description Berrygarden
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527738/YouTube%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/527738/YouTube%20Theme.meta.js
// ==/UserScript==

(()=>{
  'use strict';

  $('.gardenToolwater1:eq(0)').on('click', () => {
    $('img[src="//staticpokeheroes.com/img/berrygarden/berries/0/all.png"]').each((i, r) => {
      $(r).click()
    })
  })
})()