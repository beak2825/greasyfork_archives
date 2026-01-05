// ==UserScript==
// @name        dailymail_words
// @namespace   dailymailwords
// @description hide_dailymail_words
// @include     *dailymail.co.uk*
// @version     1.0
// @require  https://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10061/dailymail_words.user.js
// @updateURL https://update.greasyfork.org/scripts/10061/dailymail_words.meta.js
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
  $("div.sch-result").has ("p.sch-res-preview:contains('boozy')").hide();  
  $("div.sch-result").has ('A[href*="binge"]').hide();  
  $("div.sch-result").has ('A[href*="boozy"]').hide();  
}

// load jQuery and execute the main function
addJQuery(main);            
