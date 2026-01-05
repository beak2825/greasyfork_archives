// ==UserScript==
// @name         Lichess auto confirm resign [deprecated, use setting]
// @namespace    http://github.com/flugsio
// @version      0.2
// @description  Automatically confirms resign
// @author       flugsio
// @include        /\.lichess\.org\/\w{12}$/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/12241/Lichess%20auto%20confirm%20resign%20%5Bdeprecated%2C%20use%20setting%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/12241/Lichess%20auto%20confirm%20resign%20%5Bdeprecated%2C%20use%20setting%5D.meta.js
// ==/UserScript==

$('.button.resign-confirm').on('click', function() { lichess.socket.send('resign'); });