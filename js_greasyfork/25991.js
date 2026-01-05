// ==UserScript==
// @name         Riemurasia AdBlock PopUp Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove AdBlock PopUp
// @author       Anis Moubarik
// @match        https://www.riemurasia.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25991/Riemurasia%20AdBlock%20PopUp%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/25991/Riemurasia%20AdBlock%20PopUp%20Remover.meta.js
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
  jQ("#lightboxOverlay").remove();
  jQ("#lightbox").remove();
  jQ("#mhprknk").remove();
  jQ(".media").css("opacity", 1);
}

// load jQuery and execute the main function
addJQuery(main);