// ==UserScript==
// @name         GitHub Old Feed
// @namespace    https://github.com/EastSun5566
// @version      0.0.8
// @description  Simply use `github.com/dashboard-feed` to bring back the old GitHub feed
// @author       Michael Wang
// @license      MIT
// @homepageURL  https://github.com/EastSun5566
// @match        https://github.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477955/GitHub%20Old%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/477955/GitHub%20Old%20Feed.meta.js
// ==/UserScript==

// @ts-check

(function () {
  fetch('https://github.com/dashboard-feed')
    .then((res) => res.text())
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const oldFeed = doc.querySelector('main');

      const dashboard = document.getElementById('dashboard');
      if (dashboard && oldFeed) dashboard.replaceWith(oldFeed);
    })
    .catch((err) => console.error('Failed to fetch old feed', err));
}());
