// ==UserScript==
// @name         Auto bitcoin chest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Derg
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403760/Auto%20bitcoin%20chest.user.js
// @updateURL https://update.greasyfork.org/scripts/403760/Auto%20bitcoin%20chest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = setInterval(() => {
  document.querySelectorAll('[data-test-selector="community-points-summary"] > :last-child > .tw-transition > * > * > *').forEach((a) => a.click());
  console.log('clicking on bitcoin chest at ' + (new Date()).toLocaleTimeString());
}, 30000);
console.log('bitcoin chest interval id ' + id);
})();