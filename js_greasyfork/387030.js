// ==UserScript==
// @name         Background playback on YouTube and niconico
// @namespace    https://ciffelia.com/
// @version      3.0.0
// @description  Enable background playback on m.youtube.com, music.youtube.com and sp.nicovideo.jp
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://sp.nicovideo.jp/watch/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387030/Background%20playback%20on%20YouTube%20and%20niconico.user.js
// @updateURL https://update.greasyfork.org/scripts/387030/Background%20playback%20on%20YouTube%20and%20niconico.meta.js
// ==/UserScript==

(() => {
  'use strict'

  Object.defineProperties(document, {
    hidden: { value: false },
    visibilityState: { value: 'visible' }
  })
})()
