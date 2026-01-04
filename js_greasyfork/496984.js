// ==UserScript==
// @name         XVideos Filter
// @namespace    XVideos Filter
// @version      0.1
// @description  Filter xvideos search results based on preferences
// @author       EmersonxD
// @match        https://www.xvideos.com/tags/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496984/XVideos%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/496984/XVideos%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define your search terms and preferences here
  var searchTerm = "conhece";
  var preferences = ["HD", "1080p", "longa"];

  // Get the search results page
  var url = `https://www.xvideos.com/tags/${searchTerm}`;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var soup = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      var videos = [];
      var videoElements = soup.querySelectorAll('div.thumb');
      for (var i = 0; i < videoElements.length; i++) {
        var video = videoElements[i];
        var title = video.querySelector('a.title').textContent.trim();
        var duration = video.querySelector('span.duration').textContent.trim();
        var quality = video.querySelector('span.quality').textContent.trim();
        
        if (preferences.every(p => quality.includes(p))) {
          videos.push({ title, duration, quality });
        }
      }
      
      // Print the filtered videos
      for (var i = 0; i < videos.length; i++) {
        console.log(`Title: ${videos[i].title}, Duration: ${videos[i].duration}, Quality: ${videos[i].quality}`);
      }
    }
  };
  xhr.send();
})();