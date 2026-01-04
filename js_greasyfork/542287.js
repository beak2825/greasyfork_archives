// ==UserScript==
// @name         YouTube - Hide Mic Button
// @version      1.0
// @description  Hides the voice-search mic button and blocks it's asset requests on YouTube. Only works on youtube.com
// @author       Mane
// @license      CCO-1.0
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/542287/YouTube%20-%20Hide%20Mic%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542287/YouTube%20-%20Hide%20Mic%20Button.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1) CSS injection to hide UI
  const css = `
    /* Desktop mic button in search bar */
    button#voice-search-button,
    /* aria-label fallback */
    button[aria-label="Search with your voice"],
    /* Web Components renderers */
    ytd-microphone-container-renderer,
    ytd-microphone-button-renderer {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // 2) Monkey-patch fetch() to drop mic asset requests
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    const url = resource instanceof Request ? resource.url : resource;
    if (url.includes('microphone') || url.includes('voice_search')) {
      return Promise.resolve(new Response('', {
        status: 204,
        statusText: 'No Content',
        headers: { 'Content-Type': 'application/octet-stream' }
      }));
    }
    return originalFetch.apply(this, arguments);
  };

  // 3) Monkey-patch XHR to abort mic asset requests
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._shouldBlock = url && (url.includes('microphone') || url.includes('voice_search'));
    return origOpen.apply(this, arguments);
  };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (this._shouldBlock) {
      return this.abort();
    }
    return origSend.apply(this, arguments);
  };

  // 4) MutationObserver fallback to catch dynamic inserts
  function removeMicElements() {
    document.querySelectorAll(
      'button#voice-search-button,' +
      'button[aria-label="Search with your voice"],' +
      'ytd-microphone-container-renderer,' +
      'ytd-microphone-button-renderer'
    ).forEach(el => el.remove());
  }
  const observer = new MutationObserver(removeMicElements);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial cleanup
  removeMicElements();
})();
