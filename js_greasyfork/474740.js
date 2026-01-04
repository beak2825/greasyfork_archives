// ==UserScript==
// @name        Rewrite Microsoft Safe Links
// @include     https://outlook.office.com/*
// @author      Pieter Bos
// @description Rewrites links starting with "https://*.safelinks.protection.outlook.com" to link to the website immediately. This feature comes from "Microsoft Defender for Office 365". Also disables any scanning for potential phishing sites, see also https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links-about?view=o365-worldwide
// @license     CC-BY-2.0
// @version     2
// @grant       none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1167928
// @downloadURL https://update.greasyfork.org/scripts/474740/Rewrite%20Microsoft%20Safe%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/474740/Rewrite%20Microsoft%20Safe%20Links.meta.js
// ==/UserScript==

const URL_PATTERN = new RegExp('^https://[a-zA-Z0-9]+\\.safelinks\\.protection\\.outlook\\.com/');

const config = { childList: true, subtree: true, characterData: false, attributes: true };

const onMutate = (mutationList, observer) => {
  for(const mutation of mutationList) {
    for(const addedNode of mutation.addedNodes) {
      for(const anchor of addedNode.querySelectorAll('a')) {
        try {
          if(!URL_PATTERN.test(anchor.href)) continue;
          const params = new URLSearchParams(new URL(anchor.href).search);
          if(!params.has('url')) continue;


          if(anchor.textContent === anchor.href) anchor.textContent = params.get('url');
          anchor.href = params.get('url');

          // Delete onclick event handler that goes to safelinks anyway by cloning the element
          const freshElem = anchor.cloneNode(true);
          anchor.replaceWith(freshElem);
        } catch {}
      }
    }
  }
};

const observer = new MutationObserver(onMutate);
observer.observe(document, config);
