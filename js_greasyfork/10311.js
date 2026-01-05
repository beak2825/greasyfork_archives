// ==UserScript==
// @name    	ikarma's Sequential PandA zings and mylikes + add your own for mturk
// @include 	https://www.mturk.com/mturk/previewandaccept*
// @grant   	GM_addStyle
// @description:en panda script

// @namespace https://greasyfork.org/users/
// @version 0.0.1
// @namespace https://greasyfork.org/users/9054
// @description panda script
// @downloadURL https://update.greasyfork.org/scripts/10311/ikarma%27s%20Sequential%20PandA%20zings%20and%20mylikes%20%2B%20add%20your%20own%20for%20mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/10311/ikarma%27s%20Sequential%20PandA%20zings%20and%20mylikes%20%2B%20add%20your%20own%20for%20mturk.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
	change introduced in GM 1.0.
	It restores the sandbox.
*/
 
//===[Settings]===\\
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\                                                          //==[Just change the url to use whatever sound you want]==\\


var urlsToLoad  = [
	   "https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ77D5RGXU0PW7M41I3C4S" // procore
    ,"https://www.mturk.com/mturk/previewandaccept?groupId=3SI493PTSWRNV2K9KNV25SFBTCTDZ4" //mylikes1
    ,"https://www.mturk.com/mturk/previewandaccept?groupId=389X50RO3UCP2CYKCYM14K9RJJI439" // 411
    ,"https://www.mturk.com/mturk/previewandaccept?groupId=30B721SJLR5BYYBNQJ0CVKJEQOZ0OB" // zing
    ,"https://www.mturk.com/mturk/previewandaccept?groupId=3EM4DVSA8U8J6KF08Q5EM8I2NYE308" //vq1
 
];
 
/*---  insure script fires after load:
*/
/* window.addEventListener ("load", FireTimer, false);
if (document.readyState == "complete") */ {
	FireTimer ();

}
//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);
 
function FireTimer () {
	if (document.getElementsByName("autoAcceptEnabled")[0]){
	setTimeout(function() { location.reload(true); }, 2000); // 1000 == 1 seconds
mCoinSound.play();
  	} else {
	setTimeout(function() { GotoNextURL(); }, 1); // 1000 == 1 seconds
                
	}
}
    
function GotoNextURL () {
	var numUrls 	= urlsToLoad.length;
	var urlIdx  	= urlsToLoad.indexOf (location.href);
	urlIdx++;
	if (urlIdx >= numUrls)
    	urlIdx = 0;
 
	location.href   = urlsToLoad[urlIdx];
}
