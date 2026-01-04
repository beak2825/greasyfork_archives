// ==UserScript==
// @name         Pluralsight Auto Continue Script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Source: https://gist.github.com/satyendrakumarsingh/c2f0b08281c78e95d8db6f74c93ed3eb
// @author       You
// @include      https://*pluralsight.com/*
// @include      http://*pluralsight.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pluralsight.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456621/Pluralsight%20Auto%20Continue%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/456621/Pluralsight%20Auto%20Continue%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let autoNext = () => {
  Array.from(document.querySelectorAll('button'))
    .filter(b => b.textContent === 'Continue to next module')
    .forEach(b => b.click());
};
setInterval(autoNext, 2500);
})();