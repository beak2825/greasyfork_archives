// ==UserScript==
// @name         FCC Popup Fixer (Make All Links Open in Tabs)
// @version      1.0
// @description  Converts javascript:openWindow(...) to standard links that open in new tabs
// @match        *://apps.fcc.gov/*
// @grant        none
// @namespace https://greasyfork.org/users/1484279
// @downloadURL https://update.greasyfork.org/scripts/539550/FCC%20Popup%20Fixer%20%28Make%20All%20Links%20Open%20in%20Tabs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539550/FCC%20Popup%20Fixer%20%28Make%20All%20Links%20Open%20in%20Tabs%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const fixLinks = () => {
    document.querySelectorAll('a[href^="javascript:openWindow("]').forEach(a => {
      const match = a.getAttribute('href').match(/openWindow\('([^']+)'\)/);
      if (match && match[1]) {
        const realUrl = new URL(match[1], location.origin).href;
        a.setAttribute('href', realUrl);
        a.setAttribute('target', '_blank');
        a.removeAttribute('onclick'); // in case there's an extra click handler
      }
    });
  };

  // Run once after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLinks);
  } else {
    fixLinks();
  }
})();