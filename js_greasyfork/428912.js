// ==UserScript==
// @name         Gats.io - Anti Aimbot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  you can't use aimbot with this enabled
// @author       nitrogem35
// @match        https://gats.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428912/Gatsio%20-%20Anti%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/428912/Gatsio%20-%20Anti%20Aimbot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log = console.dir; //Allows console.log to be used
    var mouseX;
    var mouseY;
    var mouseAngle2;
    var centerX = document.body.clientWidth/2; 
    var centerY = document.body.clientHeight/2; //get height and width of screen
    var detections = 0;
    
    document.addEventListener('mousemove', function(event) { //get mouse coordinates and calculate the angle where your player should be facing
        mouseX = event.clientX;
        mouseY = event.clientY; 
        mouseAngle2 = Math.floor((angle(centerX,centerY,mouseX,mouseY)+360)%360); 
    });
    
    function angle(x1, y1, x2, y2) { //angle calculation function
        var angleRads = Math.atan2(y2 - y1, x2 - x1);
        var angleDegrees = angleRads * (180/Math.PI);
        return angleDegrees; 
    }
    
    setInterval(function() { //check mouse angle relative to player angle
        if(Math.abs(RD.pool[c3].playerAngle - mouseAngle2) > 30) {
            console.log('aimbot detected...');
            detections++; 
        }
        if(detections > 10) { //if aimbot is detected for more then 1s, close the connection
            RF.list[0].socket.close();
        }
    }, 100);
    
    setInterval(function() { //reset detetections every 4s to avoid accidental kick
        detections = 0; 
    }, 4000);
})();