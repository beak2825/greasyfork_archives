// ==UserScript==
// @name        Alex Simoes Check
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  checks and does things
// @downloadURL https://update.greasyfork.org/scripts/390878/Alex%20Simoes%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/390878/Alex%20Simoes%20Check.meta.js
// ==/UserScript==

let test1
let test2
let test3
let test4
let test5
let test6
let test7
setTimeout(function(){
if ($("p:contains('Is this a restaurant? (If answer is No, disregard the rest of the questions, submit and move on)')").length){
 window.focus();
 test1 = document.querySelector(`crowd-button`);
 test2 = document.querySelector(`crowd-input`);
 test3 = document.querySelector("crowd-input[name=openyesno]");
 test4 = document.querySelector("crowd-input[name=website]");
 test5 = document.querySelector("crowd-input[name=business_address]");
 test6 = document.querySelector("crowd-input[name=business_phone]");
 test7 = document.querySelector("crowd-input[name=yelp]");
 var restaurant = test2.shadowRoot.querySelector(`[id="input-1"]`).value;
 var restaurantOC = test3.shadowRoot.querySelector(`[id="input-2"]`).value;
 if (restaurant == "No") {
test3.shadowRoot.querySelector("input[name=openyesno]").value = ""
test4.shadowRoot.querySelector("input[name=website]").value = ""
test5.shadowRoot.querySelector("input[name=business_address]").value = ""
test6.shadowRoot.querySelector("input[name=business_phone]").value = ""
test7.shadowRoot.querySelector("input[name=yelp]").value = "" }

else if (restaurant == "Yes" && restaurantOC == "No"){
test4.shadowRoot.querySelector("input[name=website]").value = ""
test5.shadowRoot.querySelector("input[name=business_address]").value = ""
test6.shadowRoot.querySelector("input[name=business_phone]").value = ""
test7.shadowRoot.querySelector("input[name=yelp]").value = "" }
}

document.addEventListener("keydown", function(e){
    if (e.keyCode == 49 || e.keyCode == 97){
test2.shadowRoot.querySelector("input[name=restaurantyesno]").value = "No"
test3.shadowRoot.querySelector("input[name=openyesno]").value = ""
test4.shadowRoot.querySelector("input[name=website]").value = ""
test5.shadowRoot.querySelector("input[name=business_address]").value = ""
test6.shadowRoot.querySelector("input[name=business_phone]").value = ""
test7.shadowRoot.querySelector("input[name=yelp]").value = ""
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
      }
else if (e.keyCode == 50 || e.keyCode == 98){
test2.shadowRoot.querySelector("input[name=restaurantyesno]").value = "Yes"
test3.shadowRoot.querySelector("input[name=openyesno]").value = "No"
test4.shadowRoot.querySelector("input[name=website]").value = ""
test5.shadowRoot.querySelector("input[name=business_address]").value = ""
test6.shadowRoot.querySelector("input[name=business_phone]").value = ""
test7.shadowRoot.querySelector("input[name=yelp]").value = ""
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
}
else if (e.keyCode == 51 || e.keyCode == 99){
test2.shadowRoot.querySelector("input[name=restaurantyesno]").value = "No"
test3.shadowRoot.querySelector("input[name=openyesno]").value = ""
test4.shadowRoot.querySelector("input[name=website]").value = ""
test5.shadowRoot.querySelector("input[name=business_address]").value = ""
test6.shadowRoot.querySelector("input[name=business_phone]").value = ""
test7.shadowRoot.querySelector("input[name=yelp]").value = ""
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
}
else if (e.keyCode == 13){
setTimeout(function(){
test1.shadowRoot.querySelector(`[type="submit"]`).click();
},250);
}
});
},3500);
