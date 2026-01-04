// ==UserScript==
// @name         TC Keyboard Warrior
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/loader.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505123/TC%20Keyboard%20Warrior.user.js
// @updateURL https://update.greasyfork.org/scripts/505123/TC%20Keyboard%20Warrior.meta.js
// ==/UserScript==


/* QUERY SELECTORS
Start Attack:
div#defender button.torn-btn'

Weapons:
#weapon_main
#weapon_second
#weapon_melee
#weapon_temp
#weapon_fists
#weapon_boots
*/

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase()
  switch(key) {
    case "A":
      document.querySelector('div#defender button.torn-btn').click()
      break
    case "B":
      document.querySelector('#weapon_main').click()
      break
    case "C":
      document.querySelector('#weapon_second').click()
      break
    case "D":
      document.querySelector('#weapon_melee').click()
      break
    case "E":
      document.querySelector('#weapon_temp').click()
      break
    case "F":
      document.querySelector('#weapon_fists').click()
      break
    case "G":
      document.querySelector('#weapon_boots').click()
      break
    default:
      console.log(e)
  }
})