// ==UserScript==
// @name         Clean Gamer.com.tw Forum Links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cleans up gamer.com.tw redirect links
// @author       CY Fung
// @match        https://forum.gamer.com.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473044/Clean%20Gamercomtw%20Forum%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/473044/Clean%20Gamercomtw%20Forum%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const safeHosts = [
    'github.com', 'forum.gamer.com.tw', 'greasyfork.org', 'github.io',
    'www.jsdelivr.com', 'jsdelivr.com', 'cdnjs.com',
    'www.photopea.com', 'photopea.com', 'chat.openai.com', 'openai.com'
  ];

  // TODO function for testing if a link is safe
  function isLinkSafe(url) {
    // TODO: implement the actual safety check
    let uo = null;
    try {
      uo = new URL(url);
    } catch (e) {
      return false;
    }
    if (uo && uo.hostname) {
      if (safeHosts.includes(uo.hostname)) return true;
    }
    return false;
  }

  const clickHandler = (evt) => {
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  };

  function fixAnchor(decodedURL) {
    for (const anchor of document.querySelectorAll(`a[href^="${decodedURL}"]`)) {
      anchor.addEventListener('click', clickHandler, true);
      anchor.removeAttribute('onclick');
      anchor.onclick = null;
      anchor.setAttribute("data-cleaned", "true");
    }
  }

  function cleanLinks() {
    const anchors = document.querySelectorAll('a[href^="https://ref.gamer.com.tw/redir.php?url=https"]:not([data-cleaned]), a[onclick]:not([data-cleaned])');

    anchors.forEach(anchor => {
      anchor.setAttribute("data-cleaned", "pending");
      let anchorHref = anchor.getAttribute('href');
      let match = anchorHref.match(/url=([^&]*)/);
      match = match && match[1] ? decodeURIComponent(match[1]) : anchorHref;
      if (match && match.startsWith('https://')) {
        const decodedURL = match;
        if (isLinkSafe(decodedURL)) {
          anchor.setAttribute('href', decodedURL);
          Promise.resolve(decodedURL).then(fixAnchor);
        }
      }
    });
  }

  const observer = new MutationObserver(cleanLinks);
  observer.observe(document.body, { childList: true, subtree: true });

  // First triggering after setting up the MutationObserver
  cleanLinks();
})();
