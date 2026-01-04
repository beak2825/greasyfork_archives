// ==UserScript==
// @name        Art Question Answering Dataset Cleansing
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  checks and does things
// @downloadURL https://update.greasyfork.org/scripts/394441/Art%20Question%20Answering%20Dataset%20Cleansing.user.js
// @updateURL https://update.greasyfork.org/scripts/394441/Art%20Question%20Answering%20Dataset%20Cleansing.meta.js
// ==/UserScript==

setTimeout(function(){
if ($("p:contains('TASK:')").length){
 var tabcycle = 0
 window.focus();
 window.focus();
 document.querySelector(`[value=">Minor grammatical errors"]`).click();
 document.querySelector(`[value="Exist"]`).click();
 document.querySelector(`[value="Incorrect"]`).click();
 document.querySelector(`[class="row"] > [class="col-sm-6 col-sm-offset-3"] > p:nth-child(1)`).scrollIntoView();
}

document.addEventListener("keydown", function(e){
if (e.keyCode == 13){
document.querySelector(`[form-action="submit"]`).click();
}
else if (e.keyCode == 9 && tabcycle == 0){
document.querySelector(`[method="post"] > crowd-radio-group:nth-child(1)`).focus();
tabcycle = 1
}
else if (e.keyCode == 9 && tabcycle == 1){
document.querySelector(`[method="post"] > crowd-radio-group:nth-child(3)`).focus();
tabcycle = 2
}
else if (e.keyCode == 9 && tabcycle == 2){
document.querySelector(`[method="post"] > crowd-radio-group:nth-child(5)`).focus();
tabcycle = 0
}
else if (e.keyCode == 97 && tabcycle == 1){
document.querySelector(`[value="No grammatical errors"]`).click();
}
else if (e.keyCode == 98 && tabcycle == 1){
document.querySelector(`[value=">Minor grammatical errors"]`).click();
}
else if (e.keyCode == 99 && tabcycle == 1){
document.querySelector(`[value="Major grammatical errors"]`).click();
}
else if (e.keyCode == 97 && tabcycle == 2){
document.querySelector(`[value="Exist"]`).click();
}
else if (e.keyCode == 98 && tabcycle == 2){
document.querySelector(`[value="Not exist"]`).click();
}
else if (e.keyCode == 97 && tabcycle == 0){
document.querySelector(`[value="Correct"]`).click();
 }
else if (e.keyCode == 98 && tabcycle == 0){
document.querySelector(`[value="Incorrect"]`).click();
}
});
},2000);