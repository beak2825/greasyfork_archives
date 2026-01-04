// ==UserScript==
// @name         Fix Reuters Links
// @description stop reuters intercepting clicks on anchor links
// @match        *://*.reuters.com/*
// @version 0.0.1.20250326201705
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/530916/Fix%20Reuters%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/530916/Fix%20Reuters%20Links.meta.js
// ==/UserScript==
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && (e.ctrlKey || e.metaKey)) {
    window.open(link.href, '_blank');
    e.stopImmediatePropagation();
  }
}, true);