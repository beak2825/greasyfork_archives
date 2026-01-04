// ==UserScript==
// @name         Open in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Always open a new tab
// @author       JackCodeTW
// @license      MIT
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514528/Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/514528/Open%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function externalize() {
    document.querySelectorAll('a')
      .forEach((r) => {
        if (!r.hasAttribute('target')) {
          r.setAttribute('target', '_blank')
        }
      })
  }

  ////////////////////////////////////////

  function run() {
    externalize()
  }

  run()
})()
