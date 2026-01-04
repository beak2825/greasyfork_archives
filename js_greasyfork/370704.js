// ==UserScript==
// @name     Redirect Slashdot entries to source
// @description   Automatically redirects to the source of a Slashdot article
// @version  4
// @grant    none
// @noframes
// @include  /https?://(\w*\.)?slashdot.org/story/.+$/
// @namespace https://greasyfork.org/users/4654
// @downloadURL https://update.greasyfork.org/scripts/370704/Redirect%20Slashdot%20entries%20to%20source.user.js
// @updateURL https://update.greasyfork.org/scripts/370704/Redirect%20Slashdot%20entries%20to%20source.meta.js
// ==/UserScript==

const sources = document.getElementsByClassName('story-sourcelnk');
const timeout = 2000;

if (sources.length > 0) {
  console.log('Found this source for the article, redirecting to', sources[0].href, 'in', timeout, 'ms');
  window.setTimeout(() => window.location = sources[0].href, timeout);
}