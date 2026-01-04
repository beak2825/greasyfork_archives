
// ==UserScript==
// @name        Anonymous NextDNS
// @namespace   Violentmonkey Scripts
// @description Remove NextDNS anonymous account expiration modal popup without registration
// @match       *://my.nextdns.io/*
// @version     0.2.0
// @author      
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.5
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424744/Anonymous%20NextDNS.user.js
// @updateURL https://update.greasyfork.org/scripts/424744/Anonymous%20NextDNS.meta.js
// ==/UserScript==

(function () {
'use strict';

VM.observe(document.body, () => {
  // Find the target node
  const modalTitle = document.querySelector('.modal-title');

  if (modalTitle.textContent === "Expired") {
    // Remove modal
    const modal = document.querySelector(".modal");
    modal.remove();
    const modalBackdrop = document.querySelector(".modal-backdrop");
    modalBackdrop.remove(); // Remove hiding

    const root = document.querySelector("#root");
    root.setAttribute("aria-hidden", 'false');
    const body = document.querySelector("body");
    body.classList.remove("modal-open");
    body.style.overflow = "visible"; // disconnect observer

    return true;
  }
});

}());
