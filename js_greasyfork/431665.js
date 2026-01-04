// ==UserScript==
// @name         Neopets: Scorchy slots
// @author       Tombaugh Regio
// @version      1.1
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        *://www.neopets.com/games/slots.phtml
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431665/Neopets%3A%20Scorchy%20slots.user.js
// @updateURL https://update.greasyfork.org/scripts/431665/Neopets%3A%20Scorchy%20slots.meta.js
// ==/UserScript==

if (document.querySelector('input[type="checkbox"]')) {
  Array
    .from(document.querySelectorAll('input[type="checkbox"]'))
    .reduce((prev, checkbox, i) => {
      const PRIZES = ["baggold", "mappiece", "faerie", "bell", "peach", "apple", "melon", "grapes", "strawberry", "cherry"]
      const value = document.querySelectorAll(".frame tbody tr:nth-of-type(2) img")[i].src.match(/(?:http(s*):\/\/images.neopets.com\/games\/slots\/)(\S+)(?=_\d.gif)/)[2]

      const priority = PRIZES.reduce((prize, curr, j) => (curr === value) ? prize = j : prize, 0)
      
      return [...prev, {checkbox: checkbox, position: i, priority: priority}]
    }, [])
    .sort((a, b) => (a.priority < b.priority) ? -1 : (a.priority > b.priority) ? 1 : (a.position < b.position) ? -1 : 1)
    .filter((slot, i, slots) => {
      const {checkbox, position, priority} = slot
      const isSame = i == 0 || priority == slots[i - 1].priority
      const isNext = i == 0 || position - slots[i - 1].position == 1

      if (priority == slots[0].priority && isSame && isNext) return slot
    })
    .forEach(a => a.checkbox.checked = true)
}

window.setTimeout(() => document.querySelector('.content input[type="submit"]') ? document.querySelector('.content input[type="submit"]').click() : false, 1000 + Math.random() * 2000)