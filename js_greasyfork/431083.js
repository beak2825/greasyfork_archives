// ==UserScript==
// @name         Hide ads clicker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto clicks the hide ads button
// @author       Roboapple
// @match        https://beta.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/431083/Hide%20ads%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/431083/Hide%20ads%20clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Active");
    
    //calls the check every 10th of a second.  im bad at javescript so idk how to invoke it based on the appearance of the html element.
    setInterval(function(){ CheckForButton();}, 100);
})();

function CheckForButton(){

    //checks if the button is there and if so click it
    if(document.getElementsByClassName("MuiButtonBase-root MuiIconButton-root")){

        for (let i = 0; i < document.getElementsByClassName("MuiButtonBase-root MuiIconButton-root").length; i++) {
            if(document.getElementsByClassName("MuiButtonBase-root MuiIconButton-root")[i].ariaLabel == "close"){
                document.getElementsByClassName("MuiButtonBase-root MuiIconButton-root")[i].click();
                console.log("clicked!");
            }
        }
    }
}