// ==UserScript==
// @name     CollabVM Dark Mode
// @version  1.1
// @grant    none
// @include *://computernewb.com/collab-vm/
// @include *://computernewb.com/collab-vm/user-vm/
// @namespace cvmdarkmoderedirect
// @description Auto redirect CollabVM and UserVM to dark mode.
// @license Public Domain
// @downloadURL https://update.greasyfork.org/scripts/445725/CollabVM%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/445725/CollabVM%20Dark%20Mode.meta.js
// ==/UserScript==
if (window.location.pathname == "/collab-vm/") {
 window.location = "https://computernewb.com/collab-vm/themes/dark/"
}
if (window.location.pathname == "/collab-vm/user-vm/") {
 window.location = "http://computernewb.com/collab-vm/user-vm/themes/dark/"
}