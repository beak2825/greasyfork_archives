// ==UserScript==
// @name        Venue Quality
// @namespace   DCI
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/preview
// @include     https://www.mturk.com/mturk/continue*
// @include     https://www.mturk.com/mturk/preview?prevRequester*
// @include     https://www.mturk.com/mturk/previewandaccept?groupId=3EM4DVSA8U8J6KF08Q5EM8I2NYE308&isPreviousIFrame=true&prevRequester=farmer*
// @version     1.4
// @grant       GM_log
// @require     http://code.jquery.com/jquery-latest.min.js
// @description does some stuff
// @downloadURL https://update.greasyfork.org/scripts/20837/Venue%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/20837/Venue%20Quality.meta.js
// ==/UserScript==

var textsearch = $( ":contains('Are These Venues The Same?')" );
if (textsearch.length){
    
    $('.overview-wrapper').eq(0).hide();
    
    var QCs = ['Charles Playhouse Second Stage','Beacon Theatre','The Sinclair','Apollo Theater','B.B. King Blues Club and Grill','Howard Theatre','Festival Pier','The Masonic', 'Wrigley Field', 'Susquehanna Bank Center', 'Staples Center', 'Count Basie Theatre', 'New Jersey Performing Arts Center','Hollywood Casino Amphitheatre','MetLife Stadium','South Shore Music Circus','Wolf Trap Filene Center','Pantages Theatre'];
    
    for (var f = 0; f < QCs.length; f++){
        if (document.body.innerHTML.indexOf(QCs[f]) !== -1){
            document.querySelectorAll("input[type='radio']")[1].click();
        }
    }

    function submit(){
        document.getElementsByName('/submit')[0].click();
    }  
    document.querySelectorAll("input[type='radio']")[0].onclick = submit;
    document.querySelectorAll("input[type='radio']")[1].onclick = submit;  
}

function press(i) {
	if ( i.keyCode == 65 ) { //A - YES
		document.querySelectorAll("input[type='radio']")[0].click();
	}
	if ( i.keyCode == 70 ) { //F - NO
		document.querySelectorAll("input[type='radio']")[1].click();
	}
}
document.addEventListener( "keydown", press, false); 

/*
if (window.location.toString().indexOf('https://www.mturk.com/mturk/submit') !== -1){
	var textsearch1 = $( ":contains('Your results have been submitted to Venue Quality')" );
	if (textsearch1.length){
		window.close();
	}
}
*/



