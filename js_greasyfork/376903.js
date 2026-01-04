// ==UserScript==
// @name torrentproject2 - remove magnet link redirects
// @namespace Violentmonkey Scripts
// @match https://torrentproject2.se/*
// @description This script removes the redirect on magnet links on the site torrentproject2.se
// @grant none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/376903/torrentproject2%20-%20remove%20magnet%20link%20redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/376903/torrentproject2%20-%20remove%20magnet%20link%20redirects.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('.download_magnet + a')).forEach(link => {
  if(link.href && link.href.startsWith('https://mylink.me.uk')){
    link.href = decodeURIComponent(link.href.slice(26))
  }
})