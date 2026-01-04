// ==UserScript==
// @name        slashdot de-hostify links
// @namespace   slashdot
// @description remove hostnames from slashdot domains
// @include     https://slashdot.org/*
// @version     0.1a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/386746/slashdot%20de-hostify%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/386746/slashdot%20de-hostify%20links.meta.js
// ==/UserScript==
var pattern = /^https:\/\/.*\.slashdot\.org\//
var pattern2 = /^\/\/.*\.slashdot\.org\//
anchor = document.getElementsByTagName('a');
for (i = 0; i < anchor.length; i++) {
  if (pattern.test(anchor[i].href)) {
    anchor[i].href = anchor[i].href.replace(pattern, 'https://slashdot.org/');
  }
  if (pattern2.test(anchor[i].href)) {
    anchor[i].href = anchor[i].href.replace(pattern2, '//slashdot.org/');
  }
}