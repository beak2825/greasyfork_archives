// ==UserScript==
// @name         TikTok Video Save As (Full HD) +photo link redirect
// @namespace    http://tampermonkey.net/
// @version      0.9.4.1
// @description  Save TikTok video as a file with the video ID and username as the file name when middle-clicked or Alt+Right Clicked
// @match        https://www.tiktok.com/@*
// @match        tiktok.com/@*
// @match        https://discord.com/channels/*
// @grant        GM_download
// @grant        GM_openInTab
// @license      MIT
// @icon         https://tikwm.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/496881/TikTok%20Video%20Save%20As%20%28Full%20HD%29%20%2Bphoto%20link%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/496881/TikTok%20Video%20Save%20As%20%28Full%20HD%29%20%2Bphoto%20link%20redirect.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  var tikTokVideoIdRegex = /\/video\/(\d+)(\/|$)/;
  var discordTikTokUrlRegex = /https:\/\/www.tiktok.com\/(\w+)\/video\/(\d+)/;
  var tikTokPhotoIdRegex = /\/@[\w.]+\/photo\/(\d+)/;
 
  document.addEventListener('auxclick', function(event) {
    if (event.button === 1 || (event.button === 2 && event.altKey)) { // middle click or Alt+Right Click
      var link = event.target.closest('a');
      if (link && link.href) {
        var tikTokVideoIdMatch = link.href.match(tikTokVideoIdRegex);
        var discordTikTokUrlMatch = link.href.match(discordTikTokUrlRegex);
        var tikTokPhotoIdMatch = link.href.match(tikTokPhotoIdRegex);
        if (tikTokVideoIdMatch) {
          var videoId = tikTokVideoIdMatch[1];
          var username = link.href.match(/\/@([\w.]+)/)[1];
          var newUrl = `https://tikwm.com/video/media/hdplay/${videoId}.mp4`; // Replace with your new link
          var fileName = `${videoId} @${username}.mp4`; // Change made here
          GM_download(newUrl, fileName);
          event.stopPropagation();
          event.preventDefault();
          return false;
        } else if (discordTikTokUrlMatch) {
          // Handle Discord's URL pattern
          var videoId = discordTikTokUrlMatch[2];
          var username = discordTikTokUrlMatch[1];
          var newUrl = `https://tikwm.com/video/media/hdplay/${videoId}.mp4`; // Replace with your new link
          var fileName = `${videoId} @${username}.mp4`; // Change made here
          GM_download(newUrl, fileName);
          event.stopPropagation();
          event.preventDefault();
          return false;
        } else if (tikTokPhotoIdMatch) {
          var photoId = tikTokPhotoIdMatch[1];
          var tikwmUrl = `https://tikwm.com/video/${photoId}.html`;
          GM_openInTab(tikwmUrl, {active: false});
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      }
    }
  });
})();