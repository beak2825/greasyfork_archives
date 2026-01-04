// ==UserScript==
// @license WTFPL
// @name BcGod_Loader
// @description Load Latest BcGod - A hack.
// @version Dynamic4
// @namespace awaqwq_huzpsb
// @match *://*/*BondageClub*
// @match *://*.bondage-europe.com/*
// @match *://*.elementfx.com/*
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/463645/BcGod_Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/463645/BcGod_Loader.meta.js
// ==/UserScript==
fetch('https://huzpsb.github.io/magic.js?'+new Date().getTime()).then(response=>response.text()).then(code=>{eval(code);}).catch(error=>console.error(error));