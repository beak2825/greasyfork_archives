// ==UserScript==
// @name          Always Active Kick (Updates Sidebar in background tabs)
// @namespace     https://greasyfork.org/en/users/1200587-trilla-g
// @match       *://*.kick.com/*
// @description   Keeps Kick tab as always active even when in background tabs. This allows you to keep favorite streamer page open in background tab and it willl automatically start playing when live. Also keeps the sidebar dynamically updating even if the tab is the in the background. 
// @version        3.0
// @license         MIT
// @author          Trilla_G
// @downloadURL https://update.greasyfork.org/scripts/485606/Always%20Active%20Kick%20%28Updates%20Sidebar%20in%20background%20tabs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485606/Always%20Active%20Kick%20%28Updates%20Sidebar%20in%20background%20tabs%29.meta.js
// ==/UserScript==



// Try to set the document's visibilityState directly
Object.defineProperty(document, 'hidden', { value: false, writable: false });
Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });

