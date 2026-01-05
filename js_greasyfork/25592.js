// ==UserScript==
// @name        LIHKG App Url Replacer
// @description app shared link redirect to na.cx (web)
// @author	123321
// @version 	1.5
// @include 	http*://lihkg.com/thread/*

// @namespace 1
// @downloadURL https://update.greasyfork.org/scripts/25592/LIHKG%20App%20Url%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/25592/LIHKG%20App%20Url%20Replacer.meta.js
// ==/UserScript==

document.location.replace(document.location.href.replace('lihkg.com', 'lihkg.na.cx'));