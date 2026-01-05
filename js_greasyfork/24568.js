// ==UserScript==
// @name         Tohla - OMTraffic
// @namespace    http://www.tohla.com/
// @version      1.08
// @description  Earn money with OmegleBOT!
// @author       MartinFalldur
// @match        http://www.tohla.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24568/Tohla%20-%20OMTraffic.user.js
// @updateURL https://update.greasyfork.org/scripts/24568/Tohla%20-%20OMTraffic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
var adMessage = '<img style="margin: -5px 0;" src="http://www.freeiconspng.com/uploads/heart-icon-14.png" width="20px;" height="20px;"> Hi babe <img style="margin: -5px 0;" src="http://www.freeiconspng.com/uploads/heart-icon-14.png" width="20px;" height="20px;">, i am female,  you want to see my sexy video? >> <a style="color:#F83434; text-decoration:none" href="http://bit.ly/2jv4OPn" target="_blank" > http://bit.ly/2jv4OPn</a> <<';
var disconnectInterval = 5;
var btn = document.getElementById('buttondiv');
var s = -1; //used to calculate intervals
// Used to indicate the current state
	// 1   =  Disconnect (start)
	// 1.5 =  Connect
	// 2   =  Send spam message
	// 3   =  Reconnect to a new stranger (after interval)
	// 4   =  Sit idle until stranger disconnects
var step = 1;


function curTime() {
    return new Date().getTime();
}

// Tohla page itself defines the following functions:
// Connect();
// Disconnect();
// SendMessage();

function loop() {
    if (step == 1) {
        Disconnect();
        step = 1.5;
        s = curTime();  
    }
    
    if (step == 1.5 && (curTime() - s) >= 1000) {
        Connect();
        s = curTime();
        step = 2;
    }
    
    if (step == 2 && btn.value == 'Disconnect') {
        document.getElementById('textdiv').value = adMessage;
		SendMessage();
		
        console.log('[BOT] Sending message');
        
        if (disconnectInterval > 0) {
			step = 3;
		} else {
			step = 4;
		}
        s = curTime();
    } else if (btn.value != 'Disconnect') {
        console.log('[BOT] Awaiting connection...');
    }
    
    if ((step == 3 && (curTime() - s) >= disconnectInterval) || (step == 4 && btn.value == 'New')) {
		console.log('[BOT] Reconnecting to new stranger...');
        step = 1;
    }
}

setInterval(loop, 50);
})();