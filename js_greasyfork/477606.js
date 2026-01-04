// ==UserScript==
// @name        Clickable Magnets
// @namespace   Violentmonkey Scripts
// @match       *://lemmy.dbzer0.com/*
// @grant       none
// @version     1.0.1
// @license     MIT
// @author      sweepline's https://greasyfork.org/en/scripts/468920-base64-link-decoder, slightly modified by ram
// @description Makes any magnet link in a <code> block clickable across the instance
// @downloadURL https://update.greasyfork.org/scripts/477606/Clickable%20Magnets.user.js
// @updateURL https://update.greasyfork.org/scripts/477606/Clickable%20Magnets.meta.js
// ==/UserScript==

function decodeURLS() {
    while (true) {
    // We must do FIRST_ORDERED_NODE_TYPE runs many times as the iterator dies in NODE_ITERATOR_TYPE if the dom changes.
    let xpath = document.evaluate("//code[contains(text(),'magnet:?')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (xpath.singleNodeValue == null) {
      break;
    }
    const magnet = xpath.singleNodeValue.innerText
    xpath.singleNodeValue.innerHTML = `<a href="${magnet}">${decodeURIComponent(magnet)}</a>`;
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