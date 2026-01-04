// ==UserScript==
// @name        PGI Data Science Negative Reaction Quick Submit Keys
// @author       Tehapollo
// @version      1.1
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  submits stuff
// @downloadURL https://update.greasyfork.org/scripts/390223/PGI%20Data%20Science%20Negative%20Reaction%20Quick%20Submit%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/390223/PGI%20Data%20Science%20Negative%20Reaction%20Quick%20Submit%20Keys.meta.js
// ==/UserScript==

let test
let test2
let url_win
setTimeout(function(){
    if ($("short-instructions:contains('A sentence is relevant to Negative Reaction to Government Policy if it:')").length) {
    test = document.querySelector(`crowd-classifier`);
    test2 = document.querySelector(`crowd-form`);
   window.focus();
document.addEventListener("keydown", function(e){
if (e.keyCode == 49 || e.keyCode == 97) {
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
 },300);
}
else if (e.keyCode == 50|| e.keyCode == 98) {
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 51|| e.keyCode == 99) {
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 52|| e.keyCode == 100) {
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
},1200);
    }
})();