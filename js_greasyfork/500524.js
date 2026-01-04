// ==UserScript==
// @name         ZoneMinder PTZ Arrow Keys
// @namespace    http://tampermonkey.net/
// @version      2024-07-13 8
// @description  ZoneMinder PTZ Arrow Keys mapped to keyboard keys
// @author       Colin M Paterson
// @match        https://192.168.1.101/zm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.101
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500524/ZoneMinder%20PTZ%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/500524/ZoneMinder%20PTZ%20Arrow%20Keys.meta.js
// ==/UserScript==

//Remember to reload the browser after making a change to this code...

/*
Keyboard Arrow keys            :       Mapped to software buttons (Up, Down, Left, Right)
Enter Key                      :       Zoom In
Space Bar                      :       Zoom Out
1,2,3,4,5,6,7,8,9              :       Mapped to Preset Buttons
*/

// left, right, up, down arrow buttons mapped to keyboard arrow keys. Zoom in and Zoom out keys mapped to Enter key and Space Bar. Preset buttons mapped to keyboard numerical keys (1 to 9).
// (1) Using jQuery, I initially disable the arrow keys default purpose
// (2) I use jquery in order to simulate a button click on a Zoneminder arrow button (left, right, up, down arrow buttons,Zoom in, Zoom out)

function DisableArrowKeys() {
        var ar = new Array(37, 38, 39, 40);
        $(document).keydown(function(e) {
            var key = e.which;
            if ($.inArray(key, ar) > -1) {
                e.preventDefault();
                return false;
           }
            return true;
        });
    }
DisableArrowKeys()

$(document).keydown(function(e){
    if (e.which == 37) { $("div.arrowBtn.leftBtn").click(); return false; } //Left Arrow Key
    if (e.which == 39) { $("div.arrowBtn.rightBtn").click(); return false; } //Right Arrow Key
    if (e.which == 38) { $("div.arrowBtn.upBtn").click(); return false; } //Up Arrow Key
    if (e.which == 40) { $("div.arrowBtn.downBtn").click(); return false;} //Down Arrow Key
    //if (e.which == 13) { $("div.longArrowBtn.upBtn").click(); return false; } //Enter Key
    //if (e.which == 32) { $("div.longArrowBtn.downBtn").click(); return false;} //Space Bar Key
    if (e.which == 13) {controlCmd('zoomConTele',event,0,-1); return false; } //Enter Key
    if (e.which == 32) {controlCmd('zoomConWide',event,0,1);  return false;} //Space Bar Key

// Zoneminder Preset Keys. Map the keyboard numerical keys to the Zoneminder Preset Buttons (1 to 9). Zoneminder is running a function called controlCmd('presetGoto1')

    if (e.which == 49) { controlCmd('presetGoto1'); return false;} //Preset key 1
    if (e.which == 50) { controlCmd('presetGoto2'); return false;} //Preset key 2
    if (e.which == 51) { controlCmd('presetGoto3'); return false;} //Preset key 3
    if (e.which == 52) { controlCmd('presetGoto4'); return false;} //Preset key 4
    if (e.which == 53) { controlCmd('presetGoto5'); return false;} //Preset key 5
    if (e.which == 54) { controlCmd('presetGoto6'); return false;} //Preset key 6
    if (e.which == 55) { controlCmd('presetGoto7'); return false;} //Preset key 7
    if (e.which == 56) { controlCmd('presetGoto8'); return false;} //Preset key 8
    if (e.which == 57) { controlCmd('presetGoto9'); return false;} //Preset key 9
}); 