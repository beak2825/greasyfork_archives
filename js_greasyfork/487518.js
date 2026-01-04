// ==UserScript==
// @name Keep D2L active
// @description periodically reloads D2L page in order to keep the user logged in 
// @match https://dallascollege.brightspace.com/d2l/*
// @version 0.0.3
// @namespace https://greasyfork.org/users/1137107
// @downloadURL https://update.greasyfork.org/scripts/487518/Keep%20D2L%20active.user.js
// @updateURL https://update.greasyfork.org/scripts/487518/Keep%20D2L%20active.meta.js
// ==/UserScript==
setInterval(() => {
   location.reload(); 
}, 3600000);