// ==UserScript==
// @name           Egg Finder
// @namespace td2925934.com
// @description Find Torn easter eggs
// @version        0.3.0
// @match          https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/491311/Egg%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/491311/Egg%20Finder.meta.js
// ==/UserScript==

const getEgg = () => document.getElementById('easter-egg-hunt-root')

new MutationObserver(async(_, obs) => {
  const egg = getEgg()
  const buttons = egg.querySelectorAll('button')
  if (egg && (buttons.length > 0)) {
    alert('There appears to be an egg on this page!')
    buttons.forEach((button, { children }) => {
      button.style.top = '40%'
      button.style.left = '40%'
      button.style.height = '20%'
      button.style.width = '20%'
      button.style.position = 'fixed'
      button.style.border = '5px solid red'

      const particles = children[children.length - 1]

      children[0].style.height = '100%'
      particles.style.left = '0'
      particles.style.width = '100%'
      particles.style.height = '100%'
    })

    obs.disconnect()
  }
}).observe(document, {
  attributes: false, childList: true, characterData: false, subtree: true,
})