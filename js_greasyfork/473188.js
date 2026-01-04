// ==UserScript==
// @name        Hide mouse-over pop-ups for games - gog.com
// @description Hides GOG's pop-up game info that shows when you hover your mouse on a game 
// @supportURL https://github.com/solarfl4re/gog-userscript/issues
// @namespace   imyavetra
// @match       https://www.gog.com/*
// @grant       none
// @version     1.0
// @author      imyavetra
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473188/Hide%20mouse-over%20pop-ups%20for%20games%20-%20gogcom.user.js
// @updateURL https://update.greasyfork.org/scripts/473188/Hide%20mouse-over%20pop-ups%20for%20games%20-%20gogcom.meta.js
// ==/UserScript==


s = document.createElement('style')
s.innerText = "product-tile-extended-portal { display: none !important; }"
document.getElementsByTagName('head')[0].appendChild(s)