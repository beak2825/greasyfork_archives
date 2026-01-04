// ==UserScript==
// @name         fextralife, block stream
// @description  block the twitch stream on fextralife
// @version      1.6
// @author       Tobias L
// @include        *.wiki.fextralife.com/*
// @license      GPL-3.0-only
// @namespace    https://github.com/WhiteG00se/User-Scripts
// @downloadURL https://update.greasyfork.org/scripts/445334/fextralife%2C%20block%20stream.user.js
// @updateURL https://update.greasyfork.org/scripts/445334/fextralife%2C%20block%20stream.meta.js
// ==/UserScript==

let fextraStream = document.querySelector("#video-stream-container")
if (fextraStream != null) {
	fextraStream.remove()
}
