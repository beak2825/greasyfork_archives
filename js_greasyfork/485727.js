// ==UserScript==
// @name         verpeliculasonline.org subtituladas.com link shortener bypass
// @version      1.1
// @description  Bypass helper for the link shortener
// @author       Rust1667
// @match        https://subtituladas.com/enlace/*
// @match        https://verpeliculasonline.org/enlace/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485727/verpeliculasonlineorg%20subtituladascom%20link%20shortener%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485727/verpeliculasonlineorg%20subtituladascom%20link%20shortener%20bypass.meta.js
// ==/UserScript==

// Modify the link "Descargar Torrent" removing the link shortener
(function() {
    'use strict';

    // Find the <a> element
    var linkElement = document.getElementById('link');
    if (linkElement) {
        var linkUrl = linkElement.href;

        // Check if '?s=' exists in the URL
        if (linkUrl.includes('?s=')) {
            var sIndex = linkUrl.indexOf('?s=') + 3; // 3 is the length of '?s='
            var extractedUrl = linkUrl.substring(sIndex);

            // Modify the href attribute of the <a> element
            linkElement.href = extractedUrl;
        }
    }
})();


// Boost the timer
function boostTimers() {
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;

  Object.defineProperty(window, 'setTimeout', {
    value: function(func, delay) {
      if (delay === 1000) {
        delay = 50;
      }
      return originalSetTimeout.apply(this, arguments);
    }
  });

  Object.defineProperty(window, 'setInterval', {
    value: function(func, delay) {
      if (delay === 1000) {
        delay = 50;
      }
      return originalSetInterval.apply(this, arguments);
    }
  });
}

boostTimers();