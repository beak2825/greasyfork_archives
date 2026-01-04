// ==UserScript==
// @name        Base64 link decoder
// @namespace   Violentmonkey Scripts
// @match       *://lemmy.dbzer0.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      sweepline
// @description Replaces any base64 encoded link in a <code> block as that is the normal format for links on the instance
// @downloadURL https://update.greasyfork.org/scripts/468920/Base64%20link%20decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/468920/Base64%20link%20decoder.meta.js
// ==/UserScript==

function decodeURLS() {
    while (true) {
    // We must do FIRST_ORDERED_NODE_TYPE runs many times as the iterator dies in NODE_ITERATOR_TYPE if the dom changes.
    let xpath = document.evaluate("//code[contains(text(),'aHR0c')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (xpath.singleNodeValue == null) {
      break;
    }
    const decoded = atob(xpath.singleNodeValue.innerText)
    xpath.singleNodeValue.innerHTML = `<a href="${decoded}">${decoded}</a>`;
  }
}

// First load replace
window.addEventListener('load', decodeURLS, {once: true, capture: false});

// For listening on navigation
const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      setTimeout(decodeURLS, 300);
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;