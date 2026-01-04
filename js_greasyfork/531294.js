// ==UserScript==
// @name        paul-graham-text-center
// @homepage
// @icon
// @version     0.2
// @description set paul graham page text to center
// @author      geoochi
// @license     MIT
// @grant       none
// @match       https://blog.samaltman.com/*
// @match       https://*.paulgraham.com/*
// @namespace https://greasyfork.org/users/1262095
// @downloadURL https://update.greasyfork.org/scripts/531294/paul-graham-text-center.user.js
// @updateURL https://update.greasyfork.org/scripts/531294/paul-graham-text-center.meta.js
// ==/UserScript==

;(function () {
  document.body.style.display = 'flex'
  document.body.style.justifyContent = 'center'
})()
