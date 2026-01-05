// ==UserScript==
// @name Tate - Tag Runner Photos with bib number - $0.02 
// @description Does some stuff.
// @version 1.1
// @author DCI
// @namespace http://www.redpandanetwork.org
// @icon https://dl.dropboxusercontent.com/u/353548/rpav.jpg
// @include https://www.mturkcontent.com/*
// @require http://code.jquery.com/jquery-latest.min.js
// @groupId 354DQCRRHIZ6M4IS9RNUQU4ZGB1SL5
// @frameurl https://www.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3LG268AV386EAJ9CVAPBD6O1A3WER2 
// @downloadURL https://update.greasyfork.org/scripts/12656/Tate%20-%20Tag%20Runner%20Photos%20with%20bib%20number%20-%20%24002.user.js
// @updateURL https://update.greasyfork.org/scripts/12656/Tate%20-%20Tag%20Runner%20Photos%20with%20bib%20number%20-%20%24002.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

var textsearch = $j( ":contains('Please find the runners number')" );
if (textsearch.length){runscript()}

function runscript(){

var images = document.getElementsByTagName('img');
    for (var f = 0; f < images.length; f++){
        $j('img').eq(f).css('height','400px');
        $j('img').eq(f).css('width','600px');}
        
        $j('input[type="text"]').first().focus();


window.scrollBy(0, 500);    

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 112 ) { //F1 - 
i.preventDefault();
submit();
}
}    
        
$j('input[type="checkbox"]')[0].onclick = submit;

function submit(){
$j('#submitButton').click();}

}