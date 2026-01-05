// ==UserScript==
// @name         Della Nelson (Chrome) + AHK
// @namespace    DCI
// @version      0.3
// @description  Opens CSV in tab. Focuses field. Hotkey for submit.
// @author       DCI
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/3131/Della%20Nelson%20%28Chrome%29%20%2B%20AHK.user.js
// @updateURL https://update.greasyfork.org/scripts/3131/Della%20Nelson%20%28Chrome%29%20%2B%20AHK.meta.js
// ==/UserScript==

// Click arrow next to downloaded file in Chrome's download bar
// Select "Always open files of this type" for the CSV file
// Chrome may need to be set as the default program for opening CSV files
// Chrome also requires the One Window extension to open into tabs

var TargetLink = $("a:contains('http')")
if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}

var field = document.getElementsByTagName('textarea')[0];
field.focus();

document.addEventListener( "keydown", kas, false);

function kas(i) { 
    
if ( i.keyCode == 112 ) { // F1 - Submit
i.preventDefault();
$('#submitButton').eq(0).click();}   
}

/*
;copy/paste

xbutton1::
sendinput ^a
sleep 100
sendinput ^c
sleep 100
sendinput ^w
sleep 100
sendinput ^v
return

;submit

xbutton2::
sendinput {f1}
return
*/