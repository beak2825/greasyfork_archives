// ==UserScript==
// @name        Imgur2Rimgo 
// @version     1.0
// @author      Lenicyl
// @license     GPLv3
// @description Redirects imgur links to rimgo
// @include     /^https?://i?.?imgur.com(/.*)?$/
// @run-at      document-start
// @grant       none
// @icon        https://rimgo.bus-hit.me/8xNZfJL.png
// @namespace   https://greasyfork.org/users/866309
// @downloadURL https://update.greasyfork.org/scripts/443855/Imgur2Rimgo.user.js
// @updateURL https://update.greasyfork.org/scripts/443855/Imgur2Rimgo.meta.js
// ==/UserScript==

window.location.replace("https://i.bcow.xyz/" + window.location.pathname + window.location.search)