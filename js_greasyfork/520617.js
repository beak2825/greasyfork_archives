// ==UserScript==
// @name         No Privacy popup bloxd
// @version      1.2
// @description  Removes the privacy policy popup on bloxd.
// @author       Quazut
// @match        *://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        *://bloxdhop.io/*
// @match        *://bloxdk12.com/*
// @match        *://doodlecube.io/*
// @match        *://eviltower.io/*
// @match        *://1219647973806571553.discordsays.com/*
// @license      GPL-3.0-only
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/520617/No%20Privacy%20popup%20bloxd.user.js
// @updateURL https://update.greasyfork.org/scripts/520617/No%20Privacy%20popup%20bloxd.meta.js
// ==/UserScript==
(new MutationObserver((mutationList, observer) => {
  if(document.querySelector(".PromptPopupBodyPrimaryButton")) { document.querySelector(".PromptPopupBodyPrimaryButton").click();}
})).observe(
  document.documentElement,
  {
    childList: true,
    attributes: true,
    subtree: true
  }
);
