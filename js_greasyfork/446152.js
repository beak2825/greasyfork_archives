// ==UserScript==
// @name        hide-bumped-comments
// @version     0.2.0
// @match       https://www.bumped.org/*
// @namespace   bobo-hide-bumped-comments
// @description Hides brainrot comments section on bumped sites
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446152/hide-bumped-comments.user.js
// @updateURL https://update.greasyfork.org/scripts/446152/hide-bumped-comments.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  jQ.noConflict()
  jQ('.comments-area').hide()
  jQ('.comments-link').hide()
}

// load jQuery and execute the main function
addJQuery(main);