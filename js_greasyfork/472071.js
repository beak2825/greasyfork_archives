// ==UserScript==
// @name        Twitter X Icon - Twitter Bird
// @namespace   TwitterX
// @match       https://twitter.com/*
// @grant       GM.getResourceUrl
// @version     0.1.0
// @author      CY Fung
// @description Change Twitter X Icon to Twitter Brid
// @run-at      document-start
// @license     MIT
// @resource    twitter-bird https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@c311b568c0f90512162cbffdb3fbd326131009d1/icons/twitter-original.svg
// @downloadURL https://update.greasyfork.org/scripts/472071/Twitter%20X%20Icon%20-%20Twitter%20Bird.user.js
// @updateURL https://update.greasyfork.org/scripts/472071/Twitter%20X%20Icon%20-%20Twitter%20Bird.meta.js
// ==/UserScript==


(async () => {

  const resourceName = 'twitter-bird';

  const url = await GM.getResourceUrl(resourceName);

  let currentValue = localStorage.getItem('myCustomTwitterIcon');

  if (currentValue !== url) {

    localStorage.setItem('myCustomTwitterIcon', url);

    Promise.resolve().then(() => {
      document.dispatchEvent(new CustomEvent('change-my-twitter-icon'));
    });

  }


})();