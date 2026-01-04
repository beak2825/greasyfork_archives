// ==UserScript==
// @name         Open YouTube App
// @description YouTube開く
// @version      1.0.0
// @author       asportnoy
// @match        *://*.youtube.com/*
// @exclude-match *://*.youtube.com/redirect*
// @namespace https://greasyfork.org/users/730674
// @downloadURL https://update.greasyfork.org/scripts/443578/Open%20YouTube%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/443578/Open%20YouTube%20App.meta.js
// ==/UserScript==
window.location.href = `youtube://${window.location.pathname.slice(1)}${
	window.location.search
}${window.location.hash}`;