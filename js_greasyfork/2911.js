// ==UserScript==
// @name        Semwiz Autofill "Good" and Link Open (Firefox)
// @namespace   DCI
// @description Autofills "Good" and auto opens Semwiz links in new tabs in Firefox.
// @include     https://www.mturkcontent.com/dynamic/hit*
// @include     https://s3.amazonaws.com*
// @version     1.3
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/2911/Semwiz%20Autofill%20%22Good%22%20and%20Link%20Open%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2911/Semwiz%20Autofill%20%22Good%22%20and%20Link%20Open%20%28Firefox%29.meta.js
// ==/UserScript==

var needles = new Array("Search Quality Evaluation");
var haystack = document.body.innerHTML;
var my_pattern, my_matches, found = "";
for (var i=0; i<needles.length; i++){
  my_pattern = eval("/" + needles[i] + "/gi");
  my_matches = haystack.match(my_pattern);
  if (my_matches){
    found += "\n" + my_matches.length + " found for " + needles[i]; 
  }
}
if (found != ""){

$('input[name="docEval1"]').eq(2).click(); 

$('input[name="docEval2"]').eq(2).click(); 

$('input[name="docEval3"]').eq(2).click(); 

$('input[name="docEval4"]').eq(2).click(); 

$('input[name="docEval5"]').eq(2).click(); 

$('input[name="docEval6"]').eq(2).click(); 

var TargetLink = $("a:contains('Document 1')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var TargetLink = $("a:contains('Document 2')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var TargetLink = $("a:contains('Document 3')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var TargetLink = $("a:contains('Document 4')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var TargetLink = $("a:contains('Document 5')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var TargetLink = $("a:contains('Document 6')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');} 
    
}