// ==UserScript==
// @name          Bitbucket Disable Fancybox
// @namespace     https://bitbucket.org/
// @description   Disable fancybox fade-out animation
// @match         https://bitbucket.org/*
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/1724/Bitbucket%20Disable%20Fancybox.user.js
// @updateURL https://update.greasyfork.org/scripts/1724/Bitbucket%20Disable%20Fancybox.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
  script.addEventListener('load', function() {
    var script = document.createElement('script');
    script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // jQ replaces $ to avoid conflicts.
  jQ(document).on('click', '.fancybox-close', function() {
    jQ('.fancybox-wrap, #fancybox-overlay').hide();
  });
}

// load jQuery and execute the main function
addJQuery(main);
