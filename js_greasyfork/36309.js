// ==UserScript==
// @name            IMDb URL cleaner
// @namespace       Rennex/IMDb-cleaner
// @version         1.1
// @description     Removes crap from IMDb URLs
// @author          Rennex
// @include         http*://*.imdb.*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/36309/IMDb%20URL%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/36309/IMDb%20URL%20cleaner.meta.js
// ==/UserScript==

var origloc = location.href

// clean up the hostname
var loc = origloc.replace(/(akas|former)\.imdb\.(com|de|it|fr)/, "www.imdb.com")
// we need to redirect if the hostname changed
var redirect = (loc != origloc)

// clean up query string crap
loc = loc.replace(/([\?&])ref_=[^&#]*&?/, "$1").replace(/[\?&]($|#)/, "$1")

if (redirect) location.href = loc
else if (loc != origloc) history.replaceState(null, "", loc.replace(/^https?:\/\/[^\/]+/, ""))

