// ==UserScript==
// @name        Slitheriomods
// @namespace   ph0t0shop
// @description Slitherio team up
// @match       http://slither.io/*
// @match       https://slither.io/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18534/Slitheriomods.user.js
// @updateURL https://update.greasyfork.org/scripts/18534/Slitheriomods.meta.js
// ==/UserScript==

function addScript() {
var jsScript = document.createElement('script');

jsScript.setAttribute('type', 'text/javascript');

jsScript.setAttribute('src', 'http://pastebin.com/raw/LBVKA4vz');

document.getElementsByTagName('head')[0].appendChild(jsScript);
}

addScript();