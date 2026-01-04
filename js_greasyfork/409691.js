// ==UserScript==
// @name         Kickstarter -- fix logo.
// @namespace    https://www.kickstarter.com
// @version      0.1
// @description  Kickstarter -- hide site making political point by manipulating data to fit its narrative.
// @author       Agamemnus
// @match        https://*.kickstarter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409691/Kickstarter%20--%20fix%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/409691/Kickstarter%20--%20fix%20logo.meta.js
// ==/UserScript==

void function () {
 'use strict'
 window.addEventListener('load', function () {
  let testInterval = setInterval(test, 20)
  test()
  function test () {
   let badLink = document.querySelector('a[href="https://blacklivesmatter.com/defundthepolice/"]')
   if (!badLink) return
   clearInterval(testInterval)
   badLink.parentNode.removeChild(badLink)
   let badLogo = document.querySelector('.fill-black')
   if (badLogo) {
    badLogo.classList.remove('.fill-black')
    badLogo.classList.add('fill-ksr10-green')
   }
  }
 })
}()