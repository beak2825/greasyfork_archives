// ==UserScript==
// @name         yachtworld modal stopper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Stops the modals on yachtworld
// @author       Zac
// @match        https://www.yachtworld.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480549/yachtworld%20modal%20stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/480549/yachtworld%20modal%20stopper.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Function to check if the modals exists and hide them
    const checkForModals = () => {
      if (document.getElementById('bdp-default-contact-modal'))
          document
          .getElementById('bdp-default-contact-modal')
          .style.display = 'none'

      if (document.querySelector('.ReactModalPortal'))
          document
          .querySelector('.ReactModalPortal')
          .style.display = 'none'
    }

    // Run the function initially
    checkForModals()

    // Also run the function whenever anything is added to the body
    new MutationObserver(checkForModals).observe(document.querySelector('body'), { childList: true, subtree: true })
})()