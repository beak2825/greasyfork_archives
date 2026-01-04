// ==UserScript==
// @name         Disable Auto Popping Designer Pane for online office
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Completely kill the Designer pane in PowerPoint Online
// @match        https://*.office.com/*
// @match        https://*.powerpoint.office.com/*
// @match        https://*.officeapps.live.com/*
// @match        https://*.sharepoint.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540741/Disable%20Auto%20Popping%20Designer%20Pane%20for%20online%20office.user.js
// @updateURL https://update.greasyfork.org/scripts/540741/Disable%20Auto%20Popping%20Designer%20Pane%20for%20online%20office.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to hide any possible Designer pane containers
    const css = `
      /* the main “FarPane” container */
      #FarPane,
      /* fallback if the ID is different */
      #FarPaneRegion,
      /* the task-pane wrapper on the right */
      .WACTaskPaneContainerRight,
      /* the Designer pane itself */
      .DesignerPane {
        display: none !important;
      }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);

    // As a safety, also watch for any new panes being inserted and kill them
    const observer = new MutationObserver((records, obs) => {
      let removed = false;
      document.querySelectorAll('#FarPane, #FarPaneRegion, .WACTaskPaneContainerRight, .DesignerPane')
        .forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
            removed = true;
          }
        });
      if (removed) {
        console.log('[TM] Designer pane hidden');
      }
    });

    // Start observing as soon as <body> exists
    const start = () => {
      const body = document.body;
      if (!body) return setTimeout(start, 50);
      observer.observe(body, { childList: true, subtree: true });
      // one last manual pass
      observer.takeRecords();
    };
    start();
})();