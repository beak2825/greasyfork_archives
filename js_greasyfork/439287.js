// ==UserScript==
// @name        geocaching.com external url warning remover
// @namespace   https://greasyfork.org/users/870516
// @match       https://www.geocaching.com/geocache/*
// @match       https://www.geocaching.com/seek/cache_details.aspx*
// @version     1.1
// @author      mustakorppi
// @grant        GM_addStyle
// @license MIT
// @description Overrides the new nag screen on geocaching.com's cache listings when clicking external urls. This also adds target="_blank" attribute to any such links so that they open in a new tab.
// @downloadURL https://update.greasyfork.org/scripts/439287/geocachingcom%20external%20url%20warning%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/439287/geocachingcom%20external%20url%20warning%20remover.meta.js
// ==/UserScript==

var addresses = document.querySelectorAll("#ctl00_ContentBody_LongDescription a")

for (var i = 0; i < addresses.length; i++) {
  addresses[i].addEventListener("click", function() {
    event.stopImmediatePropagation();
  },true);
  addresses[i].setAttribute('target', '_blank');
}