// ==UserScript==
// @name        Unlimited Revision Notes
// @namespace   Violentmonkey Scripts
// @match       http*://*.savemyexams.com/*/*/*/revision-notes/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      Naviamold
// @description Removes the 10 use free limit on revision notes
// @downloadURL https://update.greasyfork.org/scripts/493291/Unlimited%20Revision%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/493291/Unlimited%20Revision%20Notes.meta.js
// ==/UserScript==

localStorage.removeItem("SME.revision-note-views")