// ==UserScript==
// @name torrentproject2.com - remove magnet link redirects 2021 fix
// @namespace Violentmonkey Scripts
// @match https://torrentproject2.com/*
// @description This script removes the redirect on magnet links on the site torrentproject2.com
// @grant none
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/428971/torrentproject2com%20-%20remove%20magnet%20link%20redirects%202021%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428971/torrentproject2com%20-%20remove%20magnet%20link%20redirects%202021%20fix.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('.download_magnet + a')).forEach(link => {
  if(link.href && link.href.startsWith('https://mylink.cx')){
    link.href = decodeURIComponent(link.href.slice(23))
  }
})