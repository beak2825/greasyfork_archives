// ==UserScript==
// @name         IMDb.com enable right click on images
// @namespace    https://openuserjs.org/users/cuzi
// @license      GPL-3.0-or-later
// @copyright    2020, cuzi (https://openuserjs.org/users/cuzi)
// @version      1.1.2
// @description  Enable right click on images in the IMDb.com media viewer
// @author       cuzi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @match        https://www.imdb.com/*
// @match        https://m.imdb.com/*
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/406269/IMDbcom%20enable%20right%20click%20on%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/406269/IMDbcom%20enable%20right%20click%20on%20images.meta.js
// ==/UserScript==

/* jshint asi: true, esversion: 8 */

(function () {
  'use strict'

  function highestQuality (ev) {
    if (!ev || ev.button !== 1) {
      return
    }
    const src = this.currentSrc.replace(/\.[^/.]*_[^/.]*\.+([^./]*)$/, '.$1')
    GM.openInTab(src)
  }

  window.setInterval(function () {
    /* old before 2022-03-16 */
    document.querySelectorAll('div[class*="PortraitContainer"],div[class*="LandscapeContainer"]').forEach(function (div) {
      div.style.zIndex = 2
    })

    /* new 2022-03-16 */
    document.querySelectorAll('.media-viewer div>img[srcset][data-image-id]').forEach(function (img) {
      img.removeEventListener('mouseup', highestQuality)
      if (img.clientWidth) {
        // Downsize the image container so it won't overlap the arrows for navigation
        img.parentNode.style.width = img.clientWidth + 'px'
        // Bring image container to the front
        img.parentNode.style.zIndex = 2
        // Try to load highest quality src on wheel click
        img.addEventListener('mouseup', highestQuality)
        img.title = 'Mouse wheel click to open highest quality\nRight click to open context menu'
      } else {
        // Reset if image size is not loaded yet
        img.parentNode.style.width = ''
        img.parentNode.style.zIndex = ''
      }
    })
  }, 700)
})()
