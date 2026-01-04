// ==UserScript==
// @name         PFQ Profile Autoclicker
// @namespace    https://pokefarm.com/
// @version      1.0.0
// @author       PokéFarmer
// @description  PFQ Profile Autoclicker is deisgned to help with Delta points in conjunction with Tor browser
// @match        https://pokefarm.com/user/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404345/PFQ%20Profile%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/404345/PFQ%20Profile%20Autoclicker.meta.js
// ==/UserScript==

;(function ($) {
  const shuffle = (array) => array.sort(() => Math.random() - 0.5)
  const sleep = (miliseconds) => new Promise((resolve) => setTimeout(resolve, miliseconds))

  const berryTable = {
    sour: 'aspear',
    spicy: 'cheri',
    dry: 'chesto',
    sweet: 'pecha',
    bitter: 'rawst',
  }

  const clickOnAction = async () => {
    if ($('#partybox').length || $('div.party').length) {
      if ($('div.action div.berrybuttons').length) {
        while ($('div.action div.berrybuttons').length) {
          const flavourForAny = shuffle(['sour', 'spicy', 'dry', 'sweet', 'bitter']).shift()
          const up = $('div.action div.berrybuttons')[0].dataset.up.replace('any', flavourForAny)
          const selectedBerry = $($('div.action div.berrybuttons')[0]).find(`a[data-berry="${berryTable[up]}"]`)

          if (selectedBerry.length) {
            selectedBerry.click()
            await sleep(100)
          }
        }
      }

      if ($('div.action a[data-berry]').length) {
        while ($('div.action a[data-berry]').length) {
          $('div.action a[data-berry]')[0].click()
          await sleep(100)
        }
      }

      if ($('div.action a[data-hatch]').length) {
        while ($('div.action a[data-hatch]').length) {
          $('div.action a[data-hatch]')[0].click()
          await sleep(100)
        }
      }

      await sleep(300)
    } else {
      await sleep(1000)
    }

    await clickOnAction()
  }

  clickOnAction()
})(jQuery)
