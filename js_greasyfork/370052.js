// ==UserScript==
// @name           Youtube Old Site Design
// @namespace      https://twitter.com/collinchaffin
// @description    Restore Youtube's Old Site Design
// @author         Collin Chaffin
// @include        http://www.youtube.com/*
// @include        https://www.youtube.com/*
// @homepage       https://twitter.com/collinchaffin
// @run-at         document-start
// @grant          none
// @version        1.0.4
// @history        Initial release
// @history        URL change is no longer needed
// @history        On 08-16-2018 Youtube borked it's layout - added fix
// @history        Fix requires waiting for dom elements removing from this script to avoid having to add external handlers at this time
// @history        Re-added new code to properly fix the 08-16-2018 layout issue (thanks to reddit user pop1040 for posting the code)

// @downloadURL https://update.greasyfork.org/scripts/370052/Youtube%20Old%20Site%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/370052/Youtube%20Old%20Site%20Design.meta.js
// ==/UserScript==

(function() {
	'use strict'; 
	
	//BEGIN LOGGING
	var date = new Date();
	date.setTime(date.getTime());
	console.log(date);
	console.log('BEGIN :: Youtube Old Site Design Script...');
	console.log('------------------------------------------');

	//GLOBAL VARIABLES TO CHANGE IF NEEDED
	var targetPrefs={'f5':'30030','f6':'8'};
	
	//Fix the URL:
	//  NOTE: Once this is changed and refreshed, it is normal to see youtube remove the
	//        appended parameter(s) after the redirect
	//
	//  NOTE:  NO LONGER NEEDED!!  HERE FOR HISTORICAL PURPOSES ONLY!!
	/*
	var ytUrl=window.location.href;
	if (ytUrl.indexOf('disable_polymer')===-1){
		if (ytUrl.indexOf('?') > 0) {
			ytUrl+='&';
		} else {
			ytUrl+='?';
		}
		console.log('Fixing URL');
		ytUrl+='disable_polymer=1';
		window.location.href=ytUrl;
	}
	*/
	
	//Fix the cookie:
	//  Loop through every param/value only under PREF (once verified is set) and
	//  for each of the global PREF values (targetPrefs), either change or add as necessary
	var prefStr=document.cookie.split(' ').filter(o=>o.indexOf('PREF=')!==-1)[0] || 'PREF=';
	var prefEntries=prefStr.substr(5).split('&');
	var found=false;
	var changed=false;
	for (var i=0; i<prefEntries.length; i++) {			
		for(let [key,value] of Object.entries(targetPrefs)) {	
			var found=false;
			for (var i=0; i<prefEntries.length; i++) {
				if (prefEntries[i].indexOf(key) === 0) {
					found=true;
					if (prefEntries[i].substr(key.length+1)!==value) {
						console.log('Fixing ' + key);
						prefEntries[i] = value;
						changed=true;
					}
				}
			}
			if (!found) {
				console.log('Adding '+key);
				prefEntries.push(key+'='+value);
				changed=true;
			}
		}
	}
	
	//Fix the most recent layout blunder (will not make change if okay!):	
	//Credit to reddit user pop1040 for offering up with this code to work with running on-start compatible with this script
	//for correcting on navigation to a new video
	window.addEventListener("spfdone", function(e){
	if(!document.getElementById("content").classList.contains('content-alignment')){
		document.getElementById('content').classList.add('content-alignment');
		console.log('Fixing wide layout issue');
	}
	});

	//for when you load a video directly
	window.addEventListener("load", function(event) {
	if(!document.getElementById("content").classList.contains('content-alignment')){
	  document.getElementById('content').classList.add('content-alignment');
	  console.log('Fixing wide layout issue');
	}
	});
	
	
	//Commit or do nothing:
	//  Did we change anything? If so, commit the change and refresh the page, otherwise do nothing
	if (changed) {
		var newCookie='PREF=' + prefEntries.join('&') + ';domain=.youtube.com;path=/';
		console.log('Writing changed preference cookie with: '+ newCookie);
		document.cookie=newCookie;
		window.setTimeout(location.reload.bind(location,true),100);
	}
	
	//FINISH LOGGING
	console.log('FINISH :: Youtube Old Site Design Script...');
	console.log('-------------------------------------------');
})();
