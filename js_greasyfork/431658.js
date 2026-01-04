// ==UserScript==
// @name        Haggler - neopets.com
// @namespace   https://greasyfork.org/users/780470
// @match       *://www.neopets.com/haggle.phtml*
// @grant       none
// @version     1.1
// @author      Tombaugh Regio
// @description Automatically sets offered price
// @license     MIT
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/431658/Haggler%20-%20neopetscom.user.js
// @updateURL https://update.greasyfork.org/scripts/431658/Haggler%20-%20neopetscom.meta.js
// ==/UserScript==

function setOffer() {
  const offers = ['.offer:last-of-type', '#shopkeeper_makes_deal'].reduce((a, b) => [...a, parseInt(document.querySelector(b).textContent.match(/[\d,]+/)[0].split(",").join(""))], [])
  const yourOffer = Math.round((offers[0] === 0) ? offers.at(-1) * 0.3 : offers.reduce((a, b) => a + b, 0) / offers.length)
  
  if (offers[0] === 0) GM.setValue("lowestOffer", Math.round(offers.at(-1) * 0.75))
  
  return GM.getValue("lowestOffer", yourOffer).then(lowestOffer => (offers.at(-1) === lowestOffer) ? lowestOffer - 5 : yourOffer).catch(error => console.log(error))
}

setOffer().then(offer => document.querySelector('input[name="current_offer"]').value = offer).catch(error => console.log(error))