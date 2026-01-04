// ==UserScript==
// @name        Link to large screenshots on apps.apple.com
// @namespace   Violentmonkey Scripts
// @match       https://apps.apple.com/*/app/*
// @grant       none
// @version     1.1
// @author      -
// @description 19/11/2022, 2:23:02 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455070/Link%20to%20large%20screenshots%20on%20appsapplecom.user.js
// @updateURL https://update.greasyfork.org/scripts/455070/Link%20to%20large%20screenshots%20on%20appsapplecom.meta.js
// ==/UserScript==


function addLargeScreenshotLinks(){
  if(document.querySelector('.large-screenshot-links')) return
  Array.from(document.querySelectorAll('div[class*="screenshot"] picture source')).forEach(pic => {
    const src = pic.getAttribute('srcset').split(' ').at(-2)
    const largeSrc = src.slice(0, src.lastIndexOf('/')) + '/1600x0w.jpg'

    const aLink = document.createElement('a')
    aLink.setAttribute('class', 'large-screenshot-links')
    aLink.setAttribute('href', largeSrc)
    aLink.setAttribute('target', '_blank')

    pic.parentNode.insertAdjacentElement('beforebegin', aLink)

    aLink.appendChild(pic.parentNode)
  })
}

addLargeScreenshotLinks()

// The apps.apple.com site uses html5 history if you click to another app, so re-check about every second.
setInterval(addLargeScreenshotLinks, 800)