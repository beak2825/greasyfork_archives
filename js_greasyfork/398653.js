// ==UserScript==
// @name         Better twOpenOriginalImage
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Force image size to fit window in twOpenOriginalImage
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @include      https://tweetdeck.twitter.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398653/Better%20twOpenOriginalImage.user.js
// @updateURL https://update.greasyfork.org/scripts/398653/Better%20twOpenOriginalImage.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const resetOverlayImageSize = () => {
    localStorage.setItem('twOpenOriginalImage_saved_image_size', 'fit-window')
  }

  const init = function () {
    this.addEventListener('click', resetOverlayImageSize)
  }

  const arriveOptions = {
    onceOnly: true,
    existing: true
  }

  document.arrive('#twOpenOriginalImage_image_overlay_container', arriveOptions, init)
  document.arrive('.twOpenOriginalImage_close_overlay', arriveOptions, init)

  resetOverlayImageSize()
})()
