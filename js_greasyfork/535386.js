// ==UserScript==
// @name        YouTube → Supabase Deduplicator & Blocker (with ID logging)
// @description Hide any recommended videos whose IDs already exist in your Supabase table, and log those IDs
// @match       https://www.youtube.com/*
// @run-at      document-end
// @version 0.0.1.20250510181837
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535386/YouTube%20%E2%86%92%20Supabase%20Deduplicator%20%20Blocker%20%28with%20ID%20logging%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535386/YouTube%20%E2%86%92%20Supabase%20Deduplicator%20%20Blocker%20%28with%20ID%20logging%29.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  // 1. Supabase configuration
  const SUPABASE_URL = 'https://haughsijawbsqwumuryg.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdWdoc2lqYXdic3F3dW11cnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODE3MjYsImV4cCI6MjA0OTA1NzcyNn0.stESUMuJEs4CNBWGtxZr1XNp2XpnQeXmKkq3fNaVE-c';
  const TABLE = 'youtube_recommended_videos_table';
  const ID_COLUMN = 'video_id_column';
 
  // 2. Skip search/results or channel pages
  if (location.pathname.startsWith('/results') || location.pathname.startsWith('/@')) {
    return;
  }
 
  // 3. Data structures & selectors
  const existingIds = new Set();
  const ITEM_SELECTOR = 'ytd-rich-item-renderer'; /*, ytd-rich-grid-media, ytd-video-renderer*/
  const TITLE_LINK_SEL = 'a#video-title-link';
 
  // 4. Utility to extract ?v= from a link
  function getVideoId(href) {
    try {
      const url = new URL(href);
      return url.searchParams.get('v');
    } catch {
      return null;
    }
  }
 
  // 5. Hide one item if its ID is in existingIds
  function filterItem(item) {
    const linkEl = item.querySelector(TITLE_LINK_SEL);
    if (!linkEl) return;
 
    const id = getVideoId(linkEl.href);
    if (id && existingIds.has(id)) {
      item.style.display = 'none';
      //item.textContent = 'This video was blocked because it was found in the Supabase database.';
      //item.style.color = 'gray';
 
    }
  }
 
  // 6. Scan all current items
  function scanPage() {
    document.querySelectorAll(ITEM_SELECTOR).forEach(filterItem);
  }
 
  // 7. Fetch existing IDs from Supabase and log them
  async function fetchExistingIds() {
    const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=${ID_COLUMN}`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) {
      console.error('Failed to fetch existing IDs:', res.status, res.statusText);
      return;
    }
    const rows = await res.json();
    for (const row of rows) {
      if (row[ID_COLUMN]) {
        existingIds.add(row[ID_COLUMN]);
      }
    }
    // Log the imported IDs
    console.log('Imported video IDs from Supabase:', Array.from(existingIds));
  }
 
  // 8. Initialization
  (async () => {
    await fetchExistingIds();
    scanPage();
 
    // 9. Watch for newly added nodes (infinite scroll, dynamic loading)
    new MutationObserver(mutations => {
      const path = location.pathname;
      if (path.startsWith('/results') || path.startsWith('/@')) return;
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches(ITEM_SELECTOR)) {
            filterItem(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll(ITEM_SELECTOR).forEach(filterItem);
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
 
    // 10. Also re-scan after YouTube navigation
    window.addEventListener('yt-navigate-finish', () => {
      const path = location.pathname;
      if (path.startsWith('/results') || path.startsWith('/@')) return;
      scanPage();
    });
  })();
 
})();