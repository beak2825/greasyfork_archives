// ==UserScript==
// @name        A9 Megascript: Captcha Friendly Version
// @description Hoards, Fills, Hotkeys, Closes. F1=Submit.
// @namespace   DCI
// @include     https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=A9%20validate&minReward=0.00&qualifiedFor=on&x=7&y=11
// @include     https://www.mturk.com/mturk/*a9hoard*
// @include     https://www.mturk.com/mturk/externalSubmit
// @include     https://www.mturkcontent.com/dynamic*
// @version     1.5
// @grant       GM_openInTab
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/11422/A9%20Megascript%3A%20Captcha%20Friendly%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/11422/A9%20Megascript%3A%20Captcha%20Friendly%20Version.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

var ScanDelay = 5

var HoardDelay = 1

if (window.location.toString().indexOf("searchbar") != -1) {searchscrape();}

function searchscrape(){

document.title = "A9 Hoarder";

var textsearch = $j( ":contains('Review and validate an image')" );
if (textsearch.length){hitsup()}

else

{setTimeout(function(){location.reload(true)},1000*ScanDelay)}

}

function hitsup(){

setTimeout(function(){location.reload(true)},30000);

chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
chimeSound.play(); 
    
var previewLinks = $j('a[href*="/preview?groupId"]');

var suffix = "&isPreviousIFrame=true&prevRequester=a9hoard";

if (previewLinks.length > 0){window.open((previewLinks[0] + suffix + 0).replace('preview','previewandaccept'))};  
  
window.addEventListener("message", receiveMessage, false);
function receiveMessage(q){
var msg = q.data;
if (msg.length > 1){window.open(msg)} else {switcher()};    
function switcher(){   
var i = Number(msg) + 1;
if (i < previewLinks.length){
    window.open((previewLinks[i] + suffix + i).replace('preview','previewandaccept'));}}
}
}

if (window.location.toString().indexOf("a9hoard") != -1) {
    listen();
    }
function listen(){   
window.addEventListener("message", receiveMessage, false);
function receiveMessage(q){
var msg = q.data;
if (msg == "a9closeplz"){window.close()}
}
}


var submit = $j( ":contains('Loading next hit')" );
if (submit.length){
    window.parent.postMessage("a9closeplz", '*');}
    
if (window.location.toString().indexOf("mturkcontent.com/dynamic") != -1) {
radios();}

function radios(){
var textsearch = $j( ":contains('Target image category')" );
if (textsearch.length){runscript()}

function runscript (){

$j('input[type="radio"]').eq(0).click();
$j('input[type="radio"]').eq(3).click();
$j('input[type="radio"]').eq(5).click();
$j('input[type="radio"]').eq(6).click();
$j('input[type="radio"]').eq(9).click();
$j('input[type="radio"]').eq(11).click();
$j('input[type="checkbox"]').eq(6).prop('checked', true);

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 112 ) { //F1 - 
i.preventDefault();
$j('#submitButton').click();
}
}
}
}

if (window.location.toString().indexOf("a9hoard") != -1) {
   
captchacheck()};

function captchacheck(){
    
if ($j('input[name="userCaptchaResponse"]').length > 0)
{alert("CAPTCHA"); }
else {
var hitNumber = window.location.toString().slice(-1);
resumecheck();}
}
   
function resumecheck(){
if (document.getElementsByName("autoAcceptEnabled")[0]) {
{setTimeout(function(){if (window.opener){window.opener.postMessage(window.location.toString(), '*')}},1000*HoardDelay)}    
} else {
     {setTimeout(function(){window.close()},0100)}
 if (window.opener){window.opener.postMessage(hitNumber, '*');}                                               
    
    }
}
