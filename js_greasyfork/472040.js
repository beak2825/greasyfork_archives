// ==UserScript==
// @name        invidious video channelNom
// @namespace   userscript
// @include     https://iv.nboeck.de/watch*
// @include     https://invidious.lunar.icu/watch*
// @include     https://invidious.flokinet.to/watch*
// @include     https://invidious.slipfox.xyz/watch*
// @include     https://invidious.snopyta.org/watch*
// @include     https://invidious.0011.lt/watch*
// @include     https://onion.tube/watch*
// @include     https://invidious.tiekoetter.com/watch*
// @include     https://invidious.projectsegfau.lt/watch*
// @include     https://vid.priv.au/watch*
// @include     https://yt.artemislena.eu/watch*
// @include     https://inv.bp.projectsegfau.lt/watch*
// @include     https://invidious.protokolla.fi/watch*
// @include     https://vid.puffyan.us/watch*
// @include     https://inv.makerlab.tech/watch*
// @include     https://inv.tux.pizza/watch*
// @include     https://yt.oelrichsgarcia.de/watch*
// @include     https://invidious.no-logs.com/watch*
// @include     https://iv.melmac.space/watch*
// @include     https://invidious.io.lol/watch*
// @include     https://invidious.privacydev.net/watch*
// @include     https://iv.ggtyler.dev/watch*
// @include     https://yewtu.be/watch*
// @include     https://inv.in.projectsegfau.lt/watch*
// @include     https://invidious.perennialte.ch/watch*
// @include     https://inv.zzls.xyz/watch*
// @include     https://iv.datura.network/watch*
// @version     2024.2.16
// @history     2023.07.27 priv.au | 2021.12.25 8:36 PM
// @grant       none
// @description add invidious video channel name to title
// @downloadURL https://update.greasyfork.org/scripts/472040/invidious%20video%20channelNom.user.js
// @updateURL https://update.greasyfork.org/scripts/472040/invidious%20video%20channelNom.meta.js
// ==/UserScript==


var channelNom = document.querySelector("#channel-name");
if(channelNom){
	let channelNomText = channelNom.textContent;
    if(document.title.indexOf(channelNomText)!=-1){
        alert("already has channel name");
    } else {
        document.title += " > youtube > "+channelNomText;
    }
} else {alert("invidious DOM error: no channel name found")}