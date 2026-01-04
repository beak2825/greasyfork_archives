// ==UserScript==
// @name        TSR Fast Download
// @namespace   Violentmonkey Scripts
// @match       https://www.thesimsresource.com/downloads/download/itemId/*
// @grant       none
// @version     1.0
// @author      xpaz <paz.yt>
// @description 18/08/2020, 21:47:21
// @downloadURL https://update.greasyfork.org/scripts/408950/TSR%20Fast%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/408950/TSR%20Fast%20Download.meta.js
// ==/UserScript==

setTimeout(function(){location.href = 'https://www.thesimsresource.com/downloads/thankyou/id/'+location.pathname.split('/downloads/download/itemId/')[1]},6500)
