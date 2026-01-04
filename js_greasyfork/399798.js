// ==UserScript==
// @name     Always Show Zoom Web Client
// @description Always show the web client link on zoom.us meeting join pages, even if the host has asked Zoom to hide it by default.
// @version  1.1
// @grant    none
// @include https://zoom.us/j/*
// @include https://*.zoom.us/j/*
// @include https://zoom.us/s/*
// @include https://*.zoom.us/s/*
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/399798/Always%20Show%20Zoom%20Web%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/399798/Always%20Show%20Zoom%20Web%20Client.meta.js
// ==/UserScript==

function showWebClientLink() {
  let results = document.getElementsByClassName('webclient')

  results[0].classList.remove('hideme')
}

showWebClientLink()
