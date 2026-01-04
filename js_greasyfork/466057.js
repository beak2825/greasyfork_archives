// ==UserScript==
// @name         CoolMathGames Auto /play (Free Adless Fullscreen)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Automatically add /play to the end of the URL on CoolMathGames game pages removing the ads and making the game fullscreen, excluding specified URLs.
// @author       niceEli
// @match        https://*.coolmathgames.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466057/CoolMathGames%20Auto%20play%20%28Free%20Adless%20Fullscreen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466057/CoolMathGames%20Auto%20play%20%28Free%20Adless%20Fullscreen%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  async function getExcludedUrls() {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://niceeli.github.io/cmgExclude.txt');
      xhr.onload = function() {
        if (xhr.status === 200) {
          var excludedUrls = xhr.responseText.trim().split('\n');
          resolve(excludedUrls);
        } else {
          reject(xhr.status);
        }
      };
      xhr.onerror = function() {
        reject(xhr.status);
      };
      xhr.send();
    });
  }

  async function redirectToPlayUrl() {
    var excludedUrls = await getExcludedUrls();
    if (
      location.href.indexOf('coolmathgames.com') > -1 &&
      location.href.indexOf('/0-') > -1 &&
      location.href.indexOf('/play') == -1 &&
      !isExcludedUrl(location.href, excludedUrls)
    ) {
      location.href += '/play';
    }
  }

  function isExcludedUrl(url, excludedUrls) {
    return excludedUrls.some(function(excludedUrl) {
      return url.indexOf(excludedUrl) > -1;
    });
  }
  redirectToPlayUrl();
})();
