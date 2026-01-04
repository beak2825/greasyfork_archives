// ==UserScript==
// @name              Jumps males automatically in ChatRandom
// @version           0.0.1
// @description       Jumps males automatically
// @author            Ezerhorden
// @match             *://chatrandom.*
// @require           https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at            document-end
// @namespace         WHatTheHell
// @downloadURL https://update.greasyfork.org/scripts/379420/Jumps%20males%20automatically%20in%20ChatRandom.user.js
// @updateURL https://update.greasyfork.org/scripts/379420/Jumps%20males%20automatically%20in%20ChatRandom.meta.js
// ==/UserScript==

$(document).ready(function() {
  setInterval(function() {
    if($("#gender.gndr_male").is(":visible")){
      $("#right_button").trigger("click");
    }
  }, 500);
});