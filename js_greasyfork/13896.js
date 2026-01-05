// ==UserScript==
// @name Emily McHale - Find the missing post code for these restaurants - $0.05
// @version 1.0
// @author DCI
// @namespace redpandanetwork.org
// @icon https://dl.dropboxusercontent.com/u/353548/rpav.jpg 
// @require http://code.jquery.com/jquery-latest.min.js
// @groupId 3S8DC08I2JU6LJM4L17QQ9MUZ1AEJ7
// @auto_approve 0.3333333333333333 days
// @timer 60 minutes
// @quals HIT approval rate (%) is not less than 98
// @frameurl https://s3.amazonaws.com/mturk_bulk/hits/163223815/5IdN6XJKyUU7XiZn47hiQw.html?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3TKXBROM5TQGWOPEZFN715Z4PZBIJK
// @description Windowed
// @grant GM_setValue
// @grant GM_getValue
// @include *
// @downloadURL https://update.greasyfork.org/scripts/13896/Emily%20McHale%20-%20Find%20the%20missing%20post%20code%20for%20these%20restaurants%20-%20%24005.user.js
// @updateURL https://update.greasyfork.org/scripts/13896/Emily%20McHale%20-%20Find%20the%20missing%20post%20code%20for%20these%20restaurants%20-%20%24005.meta.js
// ==/UserScript==

//////Settings/////////

var panda = "https://www.mturk.com/mturk/previewandaccept?groupId=3TKXBROM5TQGWOPEZFN715Z4PZBIJK"
var frameDomain = "https://s3.amazonaws.com"
var textActivator = "For this restaurant below, find the postal code"

//change to panda and run to test
var panda = "https://dl.dropboxusercontent.com/u/353548/Test%20Pages/emilymchale.html"

var iframeHeight = "50%"
var iframeWidth = "35%"
var iframeLeft = "65%"
var iframeTop = "50%"
var iframeFocus = "off"

var firstLinkLaunch = "off"
var secondLinkLaunch = "off"
var googleSearch = "on"
var pasting = "on"
var autoSubOnPaste = "on"
var radioSub = "off"
var radioNoSub = "off"
var checkBoxes = "off"
var scrollDown = "on"

var submitKey = 123 // F12

var field1PasteKey = 112 // F1
var field2PasteKey = 113 // F2
var field3PasteKey = 114 // F3
var field4PasteKey = 115 // F4
var field5PasteKey = 116 // F5
var field6PasteKey = 117 // F6
var field7PasteKey = 118 // F7
var field8PasteKey = 119 // F8
var field9PasteKey = 120 // F9

var radio1Key = 112 // F1
var radio2Key = 113 // F2
var radio3Key = 114 // F3
var radio4Key = 115 // F4
var radio5Key = 116 // F5 

var checkbox1Key = 112 // F1
var checkbox2Key = 113 // F2
var checkbox3Key = 114 // F3
var checkbox4Key = 115 // F4
var checkbox5Key = 116 // F5 

//////////////////////


if (window.location.toString().indexOf(frameDomain) !== -1){hitFrame()};

function hitFrame(){if(document.body.innerHTML.match(textActivator)){

var $j = jQuery.noConflict(true);

window.parent.postMessage("window loaded boss", '*');

function done(){window.parent.postMessage("all done boss", '*');}

function submit(){$j('#submitButton').eq(0).click(); done();}

document.body.style.backgroundColor = "white"; 

var xlink = ""

if (firstLinkLaunch === "on"){var xlink = document.getElementsByTagName('a')[0].href;}
if (secondLinkLaunch === "on"){var xlink = document.getElementsByTagName('a')[1].href;}

function google(){
var restaurant = document.getElementsByTagName('strong')[0].innerHTML;
  var city = document.getElementsByTagName('b')[0].innerHTML;
  var state = document.getElementsByTagName('b')[1].innerHTML;
  var country = document.getElementsByTagName('b')[2].innerHTML;
  var searchTerm = (restaurant + city + ", " + state + ", " + country);
  var searchTerm = searchTerm.split(' ').join('%20');
  var xlink = "https://www.google.com/search?q=" + searchTerm;
  window.parent.postMessage("ExternalUrl" + xlink, '*');
  GM_setValue("xlink", xlink);
}

if (googleSearch === "on"){google()}

function rSub(){
    
  function press(i) {
  if ( i.keyCode == radio1Key ) {
  i.preventDefault();
  document.querySelectorAll("input[type='radio']")[0].click();
  submit();
  }
  if ( i.keyCode == radio2Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[1].click();
  submit();
  }
  if ( i.keyCode == radio3Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[2].click();
  submit();
  }
  if ( i.keyCode == radio4Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[3].click();
  submit();
  }
  if ( i.keyCode == radio5Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[4].click();
  submit();
  }
  }
  document.addEventListener( "keydown", press, false);
}

if (radioSub === "on"){radios()}

function radios(){
    
  function press(i) {
  if ( i.keyCode == radio1Key ) {
  i.preventDefault();
  document.querySelectorAll("input[type='radio']")[0].click();
  submit();
  }
  if ( i.keyCode == radio2Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[1].click();
  submit();
  }
  if ( i.keyCode == radio3Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[2].click();
  submit();
  }
  if ( i.keyCode == radio4Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[3].click();
  submit();
  }
  if ( i.keyCode == radio5Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='radio']")[4].click();
  submit();
  }
  }
  document.addEventListener( "keydown", press, false);
}

if (radioNoSub === "on"){radios()}

function checkbox(){
    
  function press(i) {
  if ( i.keyCode == checkbox1Key ) {
  i.preventDefault();
  document.querySelectorAll("input[type='checkbox']")[0].click();
  }
  if ( i.keyCode == checkbox2Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='checkbox']")[1].click();
  }
  if ( i.keyCode == checkbox3Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='checkbox']")[2].click();
  }
  if ( i.keyCode == checkbox4Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='checkbox']")[3].click();
  }
  if ( i.keyCode == checkbox5Key ) {
  i.preventDefault()
  document.querySelectorAll("input[type='checkbox']")[4].click();;
  }
  }
  document.addEventListener( "keydown", press, false);
}

if (checkBoxes === "on"){checkbox()}

function paste(){

  //add placeholder text to all text fields
  var textfields = document.querySelectorAll("input[type='text']") 
  for (var f = 0; f < textfields.length; f++){
  textfields[f].placeholder = "F" + (f + 1) + " to paste highlighted text here. Send blank for NA."  
  }

//postMessage listener
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
var msg = event.data;
  
  // Paste highlighted 
  if (msg.toString().indexOf('submitHITplz') !== -1){submit()}
  if (msg.toString().indexOf('Fmarker') !== -1){
  i = msg.substr(7, 1); 
  function autosub(){if(autoSubOnPaste === "on"){setTimeout(function(){submit();},1000);}}
  if (msg.toString().length > 8){document.querySelectorAll("input[type='text']")[i-1].value = msg.substring(8);autosub()} 
  if (msg.toString().length === 8){document.querySelectorAll("input[type='text']")[i-1].value = 'NA';autosub()}
  } 
}
}

if (pasting === "on"){paste()}

if (scrollDown === "on"){window.scrollTo(0,2000);}


function subby(i) {
if ( i.keyCode == submitKey ) 
i.preventDefault();
submit();}
document.addEventListener( "keydown", subby, false);

}
}

if (window.location.toString().indexOf((GM_getValue("xlink")).substring(10)) !== -1){external()}

function external(){

var iframe = document.createElement('iframe');

iframe.src = (GM_getValue("frameUrl"));
$(iframe).css('height', iframeHeight);
$(iframe).css('width', iframeWidth);
$(iframe).css('left', iframeLeft); 
$(iframe).css('top', iframeTop); 
$(iframe).css('position', 'fixed');
$('html').eq(0).append(iframe); 

//Message listener (HIT submitted)
  function receiveMessage(event){
  var msg = event.data; 
  if (msg === "window loaded boss" && iframeFocus === "on"){iframe.contentWindow.focus();}
  if (msg === "all done boss"){window.location.replace(panda);}
}
  window.addEventListener("message", receiveMessage, false);

function searchwindowkeys(){
//Send highlighted to opener
  function GetSelectedText () {
    if (window.getSelection) {
      var range = window.getSelection ();
      offtext = range.toString ();}}
    
  function press(i) {
    if ( i.keyCode == field1PasteKey ) {
    i.preventDefault()
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker1" + offtext, '*');
    }
    
    if ( i.keyCode == field2PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker2" + offtext, '*');
    }
    if ( i.keyCode == field3PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker3" + offtext, '*');
    }
    if ( i.keyCode == field4PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker4" + offtext, '*');
    }
    if ( i.keyCode == field5PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker5" + offtext, '*');
    }
    if ( i.keyCode == field6PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker6" + offtext, '*');
    }
    if ( i.keyCode == field7PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker7" + offtext, '*');
    }
    if ( i.keyCode == field8PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker8" + offtext, '*');
    }
    if ( i.keyCode == field9PasteKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("Fmarker9" + offtext, '*');
    }
    if ( i.keyCode == submitKey ) {
    i.preventDefault();
    GetSelectedText();
    iframe.contentWindow.postMessage("submitHITplz", '*');
    }
    }
    
    document.addEventListener( "keydown", press, false);
  }

if (pasting === "on"){searchwindowkeys()}



}

if (window.location.toString().indexOf(panda) !== -1){parentHit()}

function parentHit(){

var frameUrl = document.getElementsByTagName('iframe')[0].src;

GM_setValue("frameUrl", frameUrl);

//Message listener (url)
  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
  var msg = event.data; 
  if (msg.toString().indexOf('ExternalUrl') !== -1){
  window.location.replace(msg.substring(11));
}}
}
