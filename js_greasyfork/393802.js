// ==UserScript==
// @name         Fix TwitCasting volume
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Fix audio volume in twitcasting.tv
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @include      https://twitcasting.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393802/Fix%20TwitCasting%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/393802/Fix%20TwitCasting%20volume.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const videoElm = document.querySelector('.tw-video')
  if (!videoElm) return

  const audioCtx = new AudioContext()

  const gainNode = audioCtx.createGain()
  gainNode.gain.value = 10.0

  const source = audioCtx.createMediaElementSource(videoElm)
  source.connect(gainNode)
  gainNode.connect(audioCtx.destination)
})()
