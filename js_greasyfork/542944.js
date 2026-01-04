// ==UserScript==
// @name         Indeed Show Post Date V1
// @version      V1
// @description  Displays the "days ago" post-date badge on Indeed job pages, as well as a MM/DD/YYYY badge
// @author       Tato288 (made with genAI, so uhh, not really)
// @license      MIT
// @match        https://*.indeed.com/viewjob?*
// @grant        none
// @namespace https://greasyfork.org/users/1496168
// @downloadURL https://update.greasyfork.org/scripts/542944/Indeed%20Show%20Post%20Date%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/542944/Indeed%20Show%20Post%20Date%20V1.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Helper to find the age text once
  function extractAge() {
    for (let script of document.getElementsByTagName('script')) {
      const txt = script.textContent;
      if (!txt) continue;
      const m = txt.match(/"age"\s*:\s*"([^"]+\s+days?\s+ago)"/);
      if (m) return m[1];
    }
    return null;
  }

  // Builds a badge element with given text and styling
  function buildBadge(text, backgroundColor = '#0073b1') {
    const badge = document.createElement('div');
    badge.className = 'indeed-postdate-badge';
    badge.textContent = text;
    badge.style.cssText = `
      display: inline-block;
      margin-left: 8px;
      padding: 2px 6px;
      font-size: 0.85em;
      font-weight: 600;
      color: #fff;
      background: ${backgroundColor};
      border-radius: 3px;
      vertical-align: middle;
    `;
    return badge;
  }

  // Inserts badges into the title container
  function insertBadges(container, ageText) {
    // If already injected, skip
    if (container.parentNode.querySelector('.indeed-postdate-badge')) return;

    // 1) Age badge
    const ageBadge = buildBadge(`Posted: ${ageText}`);
    container.parentNode.insertBefore(ageBadge, container.nextSibling);

    // 2) Absolute date badge, only if not "30+ days ago"
    if (!/30\+/.test(ageText)) {
      const daysMatch = ageText.match(/(\d+)\s+days?/);
      if (daysMatch) {
        const daysAgo = parseInt(daysMatch[1], 10);
        const now = new Date();
        now.setDate(now.getDate() - daysAgo);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const yyyy = now.getFullYear();
        const dateBadge = buildBadge(`${mm}/${dd}/${yyyy}`, '#005582');
        // insert to the right of the age badge
        ageBadge.parentNode.insertBefore(dateBadge, ageBadge.nextSibling);
      }
    }

    console.log('✅ Indeed Post‑Date V1: badges injected/persisted');
  }

  // Main init after page load
  function init() {
    const ageText = extractAge();
    if (!ageText) {
      console.warn('⚠️ Indeed Post‑Date V1: age text not found');
      return;
    }

    // Target the title container
    const titleContainer = document.querySelector('.jobsearch-JobInfoHeader-title-container');
    if (!titleContainer) {
      console.warn('⚠️ Indeed Post‑Date V1: title container not found');
      return;
    }

    // Initial insert
    insertBadges(titleContainer, ageText);

    // Observe for re-renders
    const parent = titleContainer.parentNode;
    const observer = new MutationObserver(() => {
      insertBadges(titleContainer, ageText);
    });
    observer.observe(parent, { childList: true });
    console.log('🔄 Indeed Post‑Date V1: MutationObserver attached');
  }

  // Wait for the header container to appear, then run init
  const readyInterval = setInterval(() => {
    if (document.querySelector('.jobsearch-JobInfoHeader-title-container')) {
      clearInterval(readyInterval);
      init();
    }
  }, 500);

})();
