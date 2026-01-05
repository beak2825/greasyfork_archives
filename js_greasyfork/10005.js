// ==UserScript==
// @name        pikabu ads
// @namespace   pikabu_ads
// @description hide_pikabu_ads
// @include     *://pikabu.ru*
// @version     1.2
// @require  https://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10005/pikabu%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/10005/pikabu%20ads.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://code.jquery.com/jquery-2.1.3.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


function main() {
//$("div.inner_wrap").has ('A[href*="pikabu.ru/profile/ads"]').hide();   
  $("TABLE.inner_wrap.b-story.inner_wrap_visible").has ('A[href*="pikabu.ru/profile/ads"]').hide();   
}

// load jQuery and execute the main function
addJQuery(main);            

