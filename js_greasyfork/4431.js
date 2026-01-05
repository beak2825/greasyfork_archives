// ==UserScript==
// @name        DZone article source redirector
// @namespace   dzone
// @description Redirects reposted DZone articles to their source
// @include     http://*.dzone.com/articles/*
// @include     https://*.dzone.com/articles/*
// @include     http://dzone.com/articles/*
// @include     https://dzone.com/articles/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4431/DZone%20article%20source%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/4431/DZone%20article%20source%20redirector.meta.js
// ==/UserScript==

function getLink() {
  var link = document.querySelector('div.attribution a');
  if (link) {
    return link;
  }
}

var tries = 1;
function checkLink(link) {
  console.debug('Checking link, try', tries++);
  if (link.href) {
    console.debug('Redirecting to ', link.href);
    window.location = link.href;
  } else if (tries < 10) {
    window.setTimeout(function() {
      checkLink(getLink());
    }, 2000);
  } else {
    console.debug('Article source not found.');
  };
}

console.debug('Looking for article source...');

var link = getLink();

if (link != undefined) {
  checkLink(link);
}