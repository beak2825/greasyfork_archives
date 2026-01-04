// ==UserScript==
// @name        dead post checker for Wykop.pl
// @namespace   Violentmonkey Scripts
// @match       https://*.wykop.pl/wpis/*
// @grant       none
// @version     1.1
// @author      LuK1337
// @description Prepends [DEAD] to document title if OP deletes their post
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457250/dead%20post%20checker%20for%20Wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/457250/dead%20post%20checker%20for%20Wykoppl.meta.js
// ==/UserScript==

let interval = setInterval(() => {
  var req = new XMLHttpRequest()
  req.onload = () => {
    if (req.status === 404) {
      clearInterval(interval)
      document.title = `[DEAD] ${document.title}`
    }
  }
  req.open('HEAD', document.location.pathname, true)
  req.send()
}, 20000)
