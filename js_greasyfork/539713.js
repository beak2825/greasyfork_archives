// ==UserScript==
// @name         Auto-apply reddit Preferences
// @description  Automatically POSTs preferred settings and reloads the page to apply them
// @match        https://safereddit.com/*
// @match https://redlib.catsarch.com/*
// @version 0.0.1.20250706143824
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539713/Auto-apply%20reddit%20Preferences.user.js
// @updateURL https://update.greasyfork.org/scripts/539713/Auto-apply%20reddit%20Preferences.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Avoid repeated POSTs by setting a flag in-memory for the session
  if (sessionStorage.getItem('saferedditSettingsApplied') === 'true') return;

  // Define your preferences
  const prefs = new URLSearchParams({
    theme: 'system',
    remove_default_feeds: 'off',
    front_page: 'all',
    layout: 'card',
    wide: 'off',
    video_quality: 'best',
    post_sort: 'new',
    comment_sort: 'new',
    blur_spoiler: 'on',
    autoplay_videos: 'off',
    fixed_navbar: 'on',
    hide_sidebar_and_summary: 'off',
    use_hls: 'on',
    hide_hls_notification: 'on',
    hide_awards: 'off',
    hide_score: 'off',
    disable_visit_reddit_confirmation: 'off'
  });

  fetch('/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: prefs.toString()
  }).then(() => {
    sessionStorage.setItem('saferedditSettingsApplied', 'true');
    window.location.reload();
  });
})();
