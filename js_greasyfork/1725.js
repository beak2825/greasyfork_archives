// ==UserScript==
// @name          Bitbucket Whitespaces
// @namespace     https://bitbucket.org/
// @description   Show hidden symbols (spaces, tabs)
// @match         https://bitbucket.org/*
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/1725/Bitbucket%20Whitespaces.user.js
// @updateURL https://update.greasyfork.org/scripts/1725/Bitbucket%20Whitespaces.meta.js
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
  jQ('.udiff-line .source').each(function() {
    jQ(this).html(
      jQ(this).html()
      .replace(
        /^([ \+\-].*?)\s+$/,
        '$1<span style="color: red">[trailing whitespaces]</span>'
      )
      .replace(
        /\t/g,
        '<span style="color: red">»    </span>'
      )
    );
  });
}

// load jQuery and execute the main function
addJQuery(main);
