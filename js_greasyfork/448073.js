// ==UserScript==
// @name        MDN English Only
// @namespace   jvbf Userscripts
// @match       *://developer.mozilla.org/*
// @grant       none
// @version     1.0
// @author      jvbf
// @license     MIT
// @description Redirect all translated MDN pages to the English version
// @downloadURL https://update.greasyfork.org/scripts/448073/MDN%20English%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/448073/MDN%20English%20Only.meta.js
// ==/UserScript==

function check() {
  if (/mozilla\.org\/\w\w-?\w?\w?\//.test(window.location.href)) {
    var current = window.location.href.match(/mozilla\.org\/(\w\w-?\w?\w?)\//)[1]
    if (current != 'en-US') {
      window.location.href = window.location.href.replace(current, 'en-US')
    }
  }
}

setInterval(check, 1000)
check()