// ==UserScript==
// @name         Dan's Input Focuser
// @namespace    dans-input-focuser
// @version      0.3.6
// @description  Set focus to the specified input field.
// @author       Jack
// @match        https://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473909/Dan%27s%20Input%20Focuser.user.js
// @updateURL https://update.greasyfork.org/scripts/473909/Dan%27s%20Input%20Focuser.meta.js
// ==/UserScript==

// "url" is string
// "url_exact" is bool
// "input_name" is string, example "caseNumber", "[aria-label = 'Search']"
// "input_get" is string, only "id" or "query"
let input_focus_list = [
  {
    "url"        : "https://www.courts.mo.gov/cnet/caseNoSearch.do",
    "url_exact"  : true,
    "input_name" : "caseNumber",
    "input_get"  : "id"
  },
  {
    "url"        : "https://www.imdb.com/",
    "url_exact"  : false,
    "input_name" : "suggestion-search",
    "input_get"  : "id"
  },
//   {
//     "url"        : "stackoverflow.com",
//     "url_exact"  : false,
//     "input_name" : "[aria-label = 'Search']",
//     "input_get"  : "query"
//   },
]

window.addEventListener('load', function() {
  for (const item of input_focus_list) {
    if (window.location.href.includes(item.url)) {
      if (item.url_exact && window.location.href != item.url) {
        break;
      } else {
        if (item.input_get == "id") {
          document.getElementById(item.input_name).focus();
        } else if (item.input_get == "query") {
          document.querySelector(item.input_name).focus();
        }
      }
    }
  }
});