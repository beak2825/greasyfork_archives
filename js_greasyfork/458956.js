// ==UserScript==
// @name        BugMeNot Copy to Clipboard
// @namespace   abdrool
// @match       https://bugmenot.com/view/*
// @grant       none
// @version     1.0
// @author      abdrool
// @description Adds a small button to copy passwords or usernames to clipboard.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458956/BugMeNot%20Copy%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/458956/BugMeNot%20Copy%20to%20Clipboard.meta.js
// ==/UserScript==

document.querySelectorAll("dd kbd").forEach(kbd => {
  let html_snippet = `
<span
	style="cursor: pointer; padding-left: 5px; font-family: monospace; filter: grayscale(100%); opacity: 70%;"
	onclick="navigator.clipboard.writeText('${kbd.innerText}')">
  	📋
</span>
`;
  kbd.insertAdjacentHTML("afterend", html_snippet);
})