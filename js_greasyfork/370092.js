// ==UserScript==
// @name           Remove AngularJS From Angular Search
// @description:en    This script simply removes "AngularJS" from google searches containing the word "Angular".
// @include        /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp|imgres)/
// @run-at         document-start
// @grant          none
// @version 0.0.1.20180706155432
// @namespace https://greasyfork.org/users/194918
// @description This script simply removes "AngularJS" from google searches containing the word "Angular".
// @downloadURL https://update.greasyfork.org/scripts/370092/Remove%20AngularJS%20From%20Angular%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/370092/Remove%20AngularJS%20From%20Angular%20Search.meta.js
// ==/UserScript==

if (
  !location.href.toLowerCase().includes('angularjs') &&
  location.href.toLowerCase().includes('angular')
) {
  var newLocation = location.href.replace(/angular/i, 'Angular+-AngularJS');
  location.replace(newLocation);
}