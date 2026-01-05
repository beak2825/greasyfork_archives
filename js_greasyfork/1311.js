// ==UserScript==
// @name Piriform update redirect
// @version 3.1
// @description Redirect Piriform product (CCleaner, Defraggler, Recuva, Speccy) update check pages to their respective builds pages.
// @namespace raina
// @include /^https?:\/\/www\.ccleaner\.com\/.+\/update/
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/1311/Piriform%20update%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/1311/Piriform%20update%20redirect.meta.js
// ==/UserScript==
history.replaceState({}, "builds", "builds");
window.location.href = "./builds";
