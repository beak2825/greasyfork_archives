// ==UserScript==
// @name         TikTok to TikWM Redirect
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Redirect TikTok video links to tikwm.com in a new tab when middle-clicked
// @match        https://www.tiktok.com/@*
// @match        https://discord.com/channels/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/496861/TikTok%20to%20TikWM%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/496861/TikTok%20to%20TikWM%20Redirect.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var videoIdRegex = /video\/(\d+)/;

  document.addEventListener('auxclick', function(event) {
    if (event.button === 1) { // middle click
      var link = event.target.closest('a');
      if (link && link.href) {
        var videoIdMatch = link.href.match(videoIdRegex);
        if (videoIdMatch) {
          var videoId = videoIdMatch[1];
          var tikwmUrl = `https://tikwm.com/video/${videoId}.html`;
          GM_openInTab(tikwmUrl, {active: false});
          event.stopPropagation();
          event.preventDefault();
          return false;
        } else if (link.href.includes('https://www.tiktok.com/')) {
          // Handle Discord's URL pattern
          var discordTikTokUrlRegex = /https:\/\/www.tiktok.com\/(\w+)\/video\/(\d+)/;
          var discordTikTokUrlMatch = link.href.match(discordTikTokUrlRegex);
          if (discordTikTokUrlMatch) {
            var videoId = discordTikTokUrlMatch[2];
            var tikwmUrl = `https://tikwm.com/video/${videoId}.html`;
            GM_openInTab(tikwmUrl, {active: false});
            event.stopPropagation();
            event.preventDefault();
            return false;
          }
        }
      }
    }
  });
})();