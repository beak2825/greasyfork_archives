// ==UserScript==
// @name        YouTube → Supabase Logger (Homepage Only)
// @description Inserts each YouTube video ID into your Supabase table exactly once—only on the homepage feed
// @match       https://www.youtube.com/*
// @run-at      document-end
// @version 0.0.1.20250508203757
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535380/YouTube%20%E2%86%92%20Supabase%20Logger%20%28Homepage%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535380/YouTube%20%E2%86%92%20Supabase%20Logger%20%28Homepage%20Only%29.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  // 0. Bail out if not on the homepage feed
  const p = location.pathname;
  // skip video watch pages, search/results, and any channel pages
  if (
    p.startsWith('/watch')    ||  // individual video page
    p.startsWith('/results')  ||  // search results
    p.startsWith('/@')        ||  // “@channel” handle
    p.startsWith('/channel')  ||  // standard channel URL
    p.startsWith('/c')           // custom channel URL
  ) {
    return;
  }
 
  // 1. Supabase configuration
  const SUPABASE_URL = 'https://haughsijawbsqwumuryg.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdWdoc2lqYXdic3F3dW11cnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODE3MjYsImV4cCI6MjA0OTA1NzcyNn0.stESUMuJEs4CNBWGtxZr1XNp2XpnQeXmKkq3fNaVE-c';
  const TABLE         = 'youtube_recommended_videos_table';
 
  // 2. Track which IDs have been sent
  const seen = new Set();
 
  // 3. Extract the “v” parameter from any YouTube URL
  function getVideoId(href) {
    try {
      const u = new URL(href);
      return u.searchParams.get('v');
    } catch {
      return null;
    }
  }
 
  // 4. POST one new video ID to Supabase
  function insertVideoId(id) {
    fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify([{ video_id_column: id }])
    });
  }
 
  // 5. Find every “/watch” link on the homepage feed,
  //    skip ones in `seen`, send the rest
  function logAndSend() {
    document.querySelectorAll('a[href*="/watch"]').forEach(link => {
      const id = getVideoId(link.href);
      if (id && !seen.has(id)) {
        seen.add(id);
        insertVideoId(id);
      }
    });
  }
 
  // 6. Initial scan
  logAndSend();
 
  // 7. Re-scan whenever YouTube injects more items (infinite scroll)
  new MutationObserver(logAndSend)
    .observe(document.body, { childList: true, subtree: true });
 
})();