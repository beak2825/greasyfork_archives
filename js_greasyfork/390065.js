// ==UserScript==
// @name        Node Openlink and quick select enter
// @author       Tehapollo
// @version      1.1
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Creates buttons to generate questions
// @downloadURL https://update.greasyfork.org/scripts/390065/Node%20Openlink%20and%20quick%20select%20enter.user.js
// @updateURL https://update.greasyfork.org/scripts/390065/Node%20Openlink%20and%20quick%20select%20enter.meta.js
// ==/UserScript==
let test
let test2
let url_win
setTimeout(function(){
    if ($("short-instructions:contains('Choose Yes if you see a shopping cart, or No if you do not.')").length) {
    test = document.querySelector(`crowd-classifier`);
    test2 = document.querySelector(`crowd-form`);
   window.focus();
 var website = $(`classification-target`).find('a').attr('href')
 var url_win = window.open(website,null, "height=700,width=1000,status=yes,toolbar=no,menubar=no,location=no")
 url_win.open()
document.addEventListener("keydown", function(e){
if (e.keyCode == 49 || e.keyCode == 97) {
url_win.close()
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
 },300);
}
else if (e.keyCode == 50|| e.keyCode == 98) {
setTimeout(function(){
test.shadowRoot.querySelector(`[type="submit"]`).click();
url_win.close()
},300);

    }
},1200);
    }
})();