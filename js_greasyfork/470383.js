// ==UserScript==
// @name         TC All Alone
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470383/TC%20All%20Alone.user.js
// @updateURL https://update.greasyfork.org/scripts/470383/TC%20All%20Alone.meta.js
// ==/UserScript==

setTimeout(() => {
  for (const div of document.querySelectorAll('div[class^=userStatus]')) {
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt " filter="" fill="url(&quot;#svg_status_offline&quot;)" stroke="#fff" stroke-width="0" width="13" height="13" viewBox="-1.5 -1.2 14 14"><g xmlns="http://www.w3.org/2000/svg"><path d="M0,6a6,6,0,1,1,6,6A6,6,0,0,1,0,6Z"></path><path d="M3,5H9V7H3Z" fill="#f2f2f2"></path></g></svg>'
  }
}, 3000)