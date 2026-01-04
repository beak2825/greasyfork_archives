// ==UserScript==
// @name Kattis Stats Links
// @description Adds some convenience links to stats in problems in Kattis
// @version 1
// @include https://open.kattis.com/*
// @namespace https://greasyfork.org/users/8233
// @grant    none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/456441/Kattis%20Stats%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/456441/Kattis%20Stats%20Links.meta.js
// ==/UserScript==


// create stat link from given URL
function makeStatLinkNode(url) {
  var ret = document.createElement('a');
  ret.href = url + '/statistics';
  ret.innerText = ' (stats)';
  return ret;
}


// add stat link behind any <a> element that has href going to URL that has a "problems/(somename)" part
var links = document.querySelectorAll('a');
for (const a of links) {
  if (a.getAttribute('href') !== null && a.getAttribute('href').match(/problems\/[0-9a-z]*/i) !== null) {
    var newa = makeStatLinkNode(a.getAttribute('href'));
    a.parentElement.appendChild(newa);
  }
}


// add stat link behind a problm name in problem page itself
var urlparts = window.location.toString().split('/');
if (urlparts[urlparts.length - 2] == 'problems') {
  var heading = document.querySelector('.book-page-heading');
  var newa = makeStatLinkNode(window.location);
  heading.appendChild(newa);
}
