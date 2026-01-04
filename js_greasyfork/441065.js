// ==UserScript==
// @name        noah image type checker
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  checks hit type
// @downloadURL https://update.greasyfork.org/scripts/441065/noah%20image%20type%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/441065/noah%20image%20type%20checker.meta.js
// ==/UserScript==
(function check() {
if ($("p:contains('Image 1')").length && $("p:contains('Image 2')").length) {
if ( !$(`[id="crowd-elements-loading-dimmer"]`).length ){

////Colors////
var type = $(`[slot="short-instructions"] > p`).eq(0).text()
if (type == "Which image is higher quality?") {
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").style.backgroundColor = "lightblue";
}
if (type == "Which image is more realistic?") {
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").style.backgroundColor = "lightgreen";
}
if ($("b:contains('Text:')").length){
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").style.backgroundColor = 'pink';
}
///////////

document.addEventListener("keydown", function(e){
if (e.keyCode == 49 ||e.keyCode == 97){
setTimeout(function(){
document.querySelector("FORM > *").shadowRoot.querySelector(`[type="submit"]`).click();
},200);}

else if (e.keyCode == 50 ||e.keyCode == 98){
setTimeout(function(){
document.querySelector("FORM > *").shadowRoot.querySelector(`[type="submit"]`).click();
},200);}
});

window.focus();
}

else if ( $(`[id="crowd-elements-loading-dimmer"]`).length ){
setTimeout(function(){
check();

    return;

},50);
}
}
})();



