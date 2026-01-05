// ==UserScript==
// @name       Reddit: Append " - Reddit" to Title
// @version    0.2
// @description  Appends " - Reddit" to the end of the title of any page on reddit.
// @match      https://www.reddit.com/*
// @copyright  2013+, You
// @namespace https://greasyfork.org/users/14108
// @downloadURL https://update.greasyfork.org/scripts/11574/Reddit%3A%20Append%20%22%20-%20Reddit%22%20to%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/11574/Reddit%3A%20Append%20%22%20-%20Reddit%22%20to%20Title.meta.js
// ==/UserScript==

window.document.title += " - Reddit";