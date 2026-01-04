// ==UserScript==
// @name        David Kang Submit Keys
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  numpad keys can submit too
// @downloadURL https://update.greasyfork.org/scripts/395486/David%20Kang%20Submit%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/395486/David%20Kang%20Submit%20Keys.meta.js
// ==/UserScript==

let fushadow
setTimeout(function(doesstuff){
if ($("h2:contains('Which category best describes this expense?')").length){
window.focus();
fushadow = document.querySelector(`crowd-classifier`);
var TargetLink = "https://www.bing.com/search?q="
let term = $(`[slot="classification-target"] > p:nth-child(2) `).text()
let termtrim = term.replace("Name:", '').trim()
$(`classification-target`).append (
    '<br><iframe src="'+TargetLink+ termtrim +'" target="_top" width="100%" height="500px" border="0px" >'
);





document.addEventListener("keydown", function(e){
if (e.keyCode == 105){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);}
else if (e.keyCode == 97){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 98){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 99){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 100){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 101){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 102){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 103){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
else if (e.keyCode == 104){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
});


}
},1200);