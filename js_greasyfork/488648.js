// ==UserScript==
// @name         Torn I-Hate-New-Stuff Favicon Fixer
// @match      https://www.torn.com/*
// @namespace    https://openuserjs.org/users/torn/favicon
// @version      13.37
// @description  Set Torn's favicon to the old one
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @author emeth
// @downloadURL https://update.greasyfork.org/scripts/488648/Torn%20I-Hate-New-Stuff%20Favicon%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/488648/Torn%20I-Hate-New-Stuff%20Favicon%20Fixer.meta.js
// ==/UserScript==

var faviconBase64 = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAA3Nzs3Nzs5OT03Nzs5OT09PUFGRkpOTlFPT1NISEw/P0M5OT03Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs8PEBMTFBoaGuBgYODg4Zvb3JRUVQ+PkI3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztAQERhYWVnZ2giIiIZGRlTU1RsbG9GRko3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztEREhzc3VtbW4AAAAAAABKSkqBgYNLS083Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztHR0p7e35+fn8AAAAAAABYWFiKioxOTlE3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztHR0p8fH+AgIEBAQEAAABZWVmMjI5PT1I3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztHR0p8fH+AgIEBAQEAAABZWVmLi41OTlE3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztHR0p8fH+AgIEBAQEAAABZWVmLi41OTlE3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs3NztHR0t8fH+AgIEBAQEAAABZWVmMjI5PT1M3Nzs3Nzs3Nzs3Nzs3Nzs3Nzs6Oj5DQ0dbW16Tk5WKiooBAQEAAABcXFyioqRiYmVDQ0c6Oj43Nzs3Nzs3Nzs3NztDQ0daWl2AgIG+vsCAgIACAgIAAABWVlbGxseFhYhaWl5DQ0c3Nzs3Nzs3Nzs3NztMTFB6enwuLi4kJCQUFBQAAAAAAAAMDAwiIiItLS16enxNTVE3Nzs3Nzs3Nzs3NztRUVSFhYgBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAACFhYhRUVQ3Nzs3Nzs3Nzs3NztMTFB4eHssLCwjIyMkJCQkJCQkJCQkJCQjIyMrKyx5eXxMTFA3Nzs3Nzs3Nzs3NztCQkZYWFt5eXyQkJOdnZ+enqCenqCdnZ+QkJN5eXxYWFtCQkY3Nzs3Nzs4ODw3Nzs6Oj5BQUVLS09SUlZWVlpXV1tXV1tWVlpSUlZLS09BQUU6Oj43Nzs3NzsAAGFtAAB5IAAATW8AAGwgAAAgUwAAcHAAAGcgAAAgRwAAdWkAAEluAABsAAAAT0MAAFNPAABMRQAATD0AAFBS';

function setFavicon(dataUrl) {

  var existingIcons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']");
  existingIcons.forEach(function(icon) {
    icon.parentNode.removeChild(icon);
  });

  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = dataUrl;

  document.getElementsByTagName('head')[0].appendChild(link);
}

setFavicon(faviconBase64);