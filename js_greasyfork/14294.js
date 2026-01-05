// ==UserScript==
// @name        ^SET Master
// @description Hoard+keys. F1=yes F2=no
// @namespace   DCI
// @include     https://www.mturk.com/mturk/*set+master*
// @include     https://www.mturk.com/mturk/*hitGroupId*
// @include     https://www.mturk.com/mturk/externalSubmit
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.1
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/14294/%5ESET%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/14294/%5ESET%20Master.meta.js
// ==/UserScript==

var HoardDelay = 0

var captchaAlert = "off"

var $j = jQuery.noConflict(true);

if (window.location.toString().indexOf('set+master') !== -1){searchPage()};

function searchPage(){
  var hoard = confirm("Begin hoarding?");
  if (hoard === true){runscript()};
  function runscript(){
    var hitLink = $j( "a:contains('View a HIT')" );
    window.open((hitLink[0] + "&prevRequester=hitGroupId0").replace('preview','previewandaccept'));
    
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event){
    var msg = event.data;
    if (msg === "hitGone9"){location.reload(true)}else {setTimeout(function(){sorter()},1000 * HoardDelay);};
    function sorter(){
    var groupNumber = msg.slice(-1);
    if (msg.toString().indexOf('hitUp') !== -1){
    window.open((hitLink[groupNumber] + "&prevRequester=hitGroupId" + groupNumber).replace('preview','previewandaccept'));}
    if (msg.toString().indexOf('hitGone') !== -1){
    window.open((hitLink[(Number(groupNumber) + 1)] + "&prevRequester=hitGroupId" + (Number(groupNumber) + 1)).replace('preview','previewandaccept'));}
    }
    }
  }
}

if (window.location.toString().indexOf('hitGroupId') !== -1){hitPage()};

function hitPage(){

var groupNumber = window.location.toString().slice(-1);

if(document.body.innerHTML.match('Finished with this HIT?')){
window.opener.postMessage("hitUp" + groupNumber, '*');
function closer(){
function receiveMessage(event){
var msg = event.data;
if (msg === "closeParent"){window.close();}}
window.addEventListener("message", receiveMessage, false);
}
closer();
}

if(document.body.innerHTML.match('There are no more available HITs')){
window.opener.postMessage("hitGone" + groupNumber, '*');
window.close();}

if(document.body.innerHTML.match('You have exceeded')){
setTimeout(function(){location.reload(true);},5000);}

if(document.body.innerHTML.match('You have accepted the maximum number of HITs allowed')){
setTimeout(function(){location.reload(true);},7000);}

if(document.body.innerHTML.match('please type this word')){
if (captchaAlert === "on"){alert("CAPTCHA")}}
 
}

if (window.location.toString().indexOf('externalSubmit') !== -1){
//var loading = $j( ":contains('Loading next hit')" );
//if (loading.length){window.parent.postMessage("closeParent", '*');}}
window.parent.postMessage("closeParent", '*');}

if (window.location.toString().indexOf('mturkcontent.com') !== -1){hitFrame()};

function hitFrame(){

var checkSETMasterAccount = $j( document ).find( 'a[href="http://www.set.tv/"]').text();

if ( checkSETMasterAccount ) {hotkeys()}

function hotkeys(){
  document.addEventListener( "keydown", press, false);
  function press(i) {
  if ( i.keyCode == 112 ) { //F1 -
  i.preventDefault();
  document.querySelectorAll("input[type='radio']")[0].click();
  document.getElementById('submitButton').click();
  }
  if ( i.keyCode == 113 ) { //F2 -
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[1].click();
  document.getElementById('submitButton').click();
  }
  }
  }
}  