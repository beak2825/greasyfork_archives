// ==UserScript==
// @name        Avatar Linker
// @namespace   Marascripts
// @description Looks up the solution to avatars.
// @author      marascript
// @version     2.0.1
// @grant       none
// @match       https://www.marapets.com/stalker.php*
// @match       https://www.marapets.com/avatars.php?missing=1*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510347/Avatar%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/510347/Avatar%20Linker.meta.js
// ==/UserScript==

/**
 * TODO: Add links to obtained avatars
 * TODO: Refactor functions
 */

;(async () => {
  'use strict'

  if (document.URL.includes('/avatars.php')) {
    const missingAvatars = document.querySelectorAll('#eachitemdiv')

    for (const avatar in missingAvatars) {
      missingAvatars[avatar].style.paddingBottom = '15px'

      if (!missingAvatars[avatar].querySelector('.offline')) {
        const name = missingAvatars[avatar]
          .querySelector('.itempadding .bigger')
          .innerText.replace(/ /g, '+')
        const link = document.createElement('a')
        const linkText = document.createTextNode('Check Solution')

        link.appendChild(linkText)
        link.href = `https://www.maraforce.com/avatars.php?search=${name}`
        link.target = '_blank'
        link.style.color = 'gray'
        link.style.fontWeight = 700

        missingAvatars[avatar].appendChild(link)
      }
    }
  }

  if (document.URL.includes('/stalker.php')) {
    const avatar = document
      .querySelector('.sbigger')
      ?.innerText.split(' Hidden Avatar')[0]

    if (avatar) {
      const urlEncodedAvatar = avatar.replace(/ /g, '+')
      const checkSolution = document.querySelector('.pricecheck').parentElement
      checkSolution.href = `https://www.maraforce.com/avatars.php?search=${urlEncodedAvatar}`
    }
  }
})()
