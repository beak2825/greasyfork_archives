// ==UserScript==
// @name        TOI reader
// @namespace   http://www.cpdm.iisc.ernet.in/~biplab
// @description Read Times of india e-paper on smaller screen easy
// @include     http://epaperbeta.timesofindia.com/index.aspx?*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4377/TOI%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/4377/TOI%20reader.meta.js
// ==/UserScript==
// Load jQuery script explicitly. Required for google chrome
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//code.jquery.com/jquery-latest.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

addJQuery(function () {
  jQuery(".header, .logo").each(function() {
    $(this).css("display", "none");
  });
});

