// ==UserScript==
// @name         Arch Wiki old skin.
// @version      1.0.1
// @description  Use the old Arch Linux wiki skin.
// @author       Xyne
// @match        *://wiki.archlinux.org/*
// @namespace    https://bbs.archlinux.org/viewtopic.php?id=272800
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/438625/Arch%20Wiki%20old%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/438625/Arch%20Wiki%20old%20skin.meta.js
// ==/UserScript==

// Update the location's query parameters from a dictionary.
function updateQueryStringParameters(parameters) {
  return window.location.protocol + "//"
        + window.location.host
        + window.location.pathname
        + '?' + parameters.toString()
        + window.location.hash
        ;
}

// Add the expected query parameter if it is missing and redirect.
try {
  var query_params = new URLSearchParams(window.location.search);
  const key = 'useskinversion'
  const value = '1'
  if (! (query_params.has(key)))
  {
    query_params.set(key, value);
    url = updateQueryStringParameters(query_params);
    console.log('redirecting to ' + url);
    document.location = url;
  }
} catch (e) {}