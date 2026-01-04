// ==UserScript==
// @name        Noah Words
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  check boxes with hotkeys
// @downloadURL https://update.greasyfork.org/scripts/405951/Noah%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/405951/Noah%20Words.meta.js
// ==/UserScript==
let fushadow
setTimeout(function(doesstuff){
if ($("p:contains('Imagine you saw the comment in red on a post or picture on social media.')").length){
window.focus();
document.querySelector(`[value="none"]`).click();
fushadow = document.querySelector(`crowd-form`);
document.addEventListener("keydown", function(e){
if (e.keyCode == 97){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="slang"]`).click();
}
else if (e.keyCode == 98){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="offensive"]`).click();
}
else if (e.keyCode == 99){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="swear"]`).click();
}
else if (e.keyCode == 100){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="religious"]`).click();
}
else if (e.keyCode == 101){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="proper"]`).click();
}
else if (e.keyCode == 102){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="gender"]`).click();
}
else if (e.keyCode == 103){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="misspelled"]`).click();
}
else if (e.keyCode == 104){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="sexist"]`).click();
}
else if (e.keyCode == 105){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="political"]`).click();
}
else if (e.keyCode == 109){
$(`[value="none"]`).prop('checked', false);
document.querySelector(`[value="personal"]`).click();
}
else if (e.keyCode == 192){
setTimeout(function(){
fushadow.shadowRoot.querySelector(`[type="submit"]`).click();
},300);
}
});
}
},500);