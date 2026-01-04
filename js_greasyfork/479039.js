// ==UserScript==
// @name        Expand small chat on Linkedin
// @namespace   Violentmonkey Scripts
// @match       https://www.linkedin.com/messaging/*
// @grant       none
// @version     0.1
// @author      Siarhei Siniak
// @license Unlicense
// @description 11/4/2023, 8:44:59 PM

// @inject-into document
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/479039/Expand%20small%20chat%20on%20Linkedin.user.js
// @updateURL https://update.greasyfork.org/scripts/479039/Expand%20small%20chat%20on%20Linkedin.meta.js
// ==/UserScript==

setTimeout(() => {
  let $$ = (s) => [document.querySelector(s)];
  $$('#messaging .scaffold-layout__content')[0].setAttribute('style', 'display: unset');
  $$('#main')[0].setAttribute('style', 'height: 100vh');
  $$('.scaffold-layout__aside')[0].setAttribute('style', 'display: none')

}, 3000)