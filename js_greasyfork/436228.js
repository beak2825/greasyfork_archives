// ==UserScript==
// @name         Why Despacito?
// @license      MIT
// @version      0.1.0
// @description  Automatically dislikes Despacito :)
// @author       Martin Henry McWatters
// @match        https://www.youtube.com/watch?v=kJQP7kiw5Fk
// @grant        none
// @namespace    https://www.youtube.com/watch?v=kJQP7kiw5Fk
// @downloadURL https://update.greasyfork.org/scripts/436228/Why%20Despacito.user.js
// @updateURL https://update.greasyfork.org/scripts/436228/Why%20Despacito.meta.js
// ==/UserScript==

document.querySelector('button[aria-label^="dislike"]').click()