// ==UserScript==
// @name        Adada Selectors
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  1-6 to select with submit
// @downloadURL https://update.greasyfork.org/scripts/390303/Adada%20Selectors.user.js
// @updateURL https://update.greasyfork.org/scripts/390303/Adada%20Selectors.meta.js
// ==/UserScript==
let test1
setTimeout(function(){
if ($("h3:contains('Read the conversation between a user and bot below')").length){
 window.focus();
    test1 = document.querySelector(`crowd-button`);

document.addEventListener("keydown", function(e){
    if (e.keyCode == 49 || e.keyCode == 97){
    document.querySelector(`[name="completely-disagree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
   else if (e.keyCode == 50 || e.keyCode == 98){
    document.querySelector(`[name="strongly-disagree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
 else if (e.keyCode == 51 || e.keyCode == 99){
    document.querySelector(`[name="disagree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
 else if (e.keyCode == 52 || e.keyCode == 100){
    document.querySelector(`[name="agree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
 else if (e.keyCode == 53 || e.keyCode == 101){
    document.querySelector(`[name="strongly-agree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
 else if (e.keyCode == 54 || e.keyCode == 102){
    document.querySelector(`[name="completely-agree"]`).click();
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
  });
}

},1200);