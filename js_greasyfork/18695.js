// ==UserScript==
// @name        linkedin-clean-url
// @description Cleans the tracking stuff from LinkedIn URLs.
// @homepageURL https://github.com/caglartoklu/linkedin-clean-url.user.js
// @author      Caglar Toklu
// @version     1.0.0
// @date        2016-04-11
// @namespace   https://github.com/caglartoklu/greasemonkey
// @license     BSD 2-Clause
// @copyright   2016, Caglar Toklu
// @include     http://*linkedin.com/*
// @include     https://*linkedin.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18695/linkedin-clean-url.user.js
// @updateURL https://update.greasyfork.org/scripts/18695/linkedin-clean-url.meta.js
// ==/UserScript==

// if you use this script,
// https://www.linkedin.com/pulse/some-topic-some-guy?trk=eml-b...
// becomes:
// https://www.linkedin.com/pulse/some-topic-some-guy

// also, the following:
// https://www.linkedin.com/home?trk=nav_responsive_tab_home
// becomes:
// https://www.linkedin.com/home

// This script does not increase the security, nor it provides privacy.
// LinkedIn will still be able to track you.

(function () {

  var debugPrint = function (message) {
    var indicator = "linkedin-clean-url.user.js : ";
    var debugMode = false;
    if (debugMode) {
      console.log(indicator + message);
    }
  };

  var deleteAfter = function (haystack, needle) {
    // Returns a copy of haystack where all the characters after needle is removed.
    // If needle does not occur in haystack, then haystack will be returned as it is.
    // haystack: string, the big string.
    // needle: string, the small string to be found.
    var result = haystack;
    var position = haystack.indexOf(needle);
    if (position > - 1) {
      result = haystack.substr(0, position);
    }
    return result;
  };

  var cleanLinkedInUrl = function (url) {
    var needle = '?trk=';
    return deleteAfter(url, needle);
  };

  var currentUrl = window.location.href;
  var newUrl = cleanLinkedInUrl(window.location.href);
  if (currentUrl != newUrl) {
    // change the URL if and only if has tracking.
    window.location.replace(newUrl);
  }
}());
