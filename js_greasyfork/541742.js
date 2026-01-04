// ==UserScript==
// @name        Old Reddit Autocheck Search
// @description Autocheck the local & nsfw checkboxes.
// @version     1.0
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://old.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/541742/Old%20Reddit%20Autocheck%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/541742/Old%20Reddit%20Autocheck%20Search.meta.js
// ==/UserScript==

let search = document.getElementById('search')
if (!search) return

let checkboxes = search.querySelectorAll('input[type=checkbox]')
for (let c of checkboxes) {
  c.checked = true
}
