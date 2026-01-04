// ==UserScript==
// @name         not thing for surviv.io
// author        dead
// @namespace    http://tampermonkey.net/
// @version      2.0
// @icon         https://surviv.io/favicon.ico
// @description  some thing to change main screen background and not my code
// @license MIT

// Extra Information
// Made by: no body
// For: surviv.io


// <========== MATCH ==========> \\

// @match        http://surviv.io/*
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @match        http://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        https://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        http://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @match        https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/439703/not%20thing%20for%20survivio.user.js
// @updateURL https://update.greasyfork.org/scripts/439703/not%20thing%20for%20survivio.meta.js
// ==/UserScript==
// <==========GUN_HUD==========> \\



(function() {
    document.querySelector('#background').style.cssText = 'background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/1200px-M104_ngc4594_sombrero_galaxy_hi-res.jpg)'

})();