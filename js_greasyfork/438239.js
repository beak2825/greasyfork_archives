// ==UserScript==
// @name        Direct Download Patch for op1.fun
// @namespace   Violentmonkey Scripts
// @match       https://op1.fun/users/*/patches/*
// @grant       none
// @version     1.0
// @author      pckcml
// @description Replace the "Download" button href for the actual file URL, allowing you to download without needing to sign up
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438239/Direct%20Download%20Patch%20for%20op1fun.user.js
// @updateURL https://update.greasyfork.org/scripts/438239/Direct%20Download%20Patch%20for%20op1fun.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  let audioElement = document.querySelector('audio')
  let audioUrl = audioElement.src
  
  let qDownloadButton = document.getElementsByClassName('button primary download')
  let downloadButton = qDownloadButton[0]
  
  downloadButton.removeAttribute('data-remote');
  downloadButton.href = audioUrl
  downloadButton.download = audioUrl
  
})