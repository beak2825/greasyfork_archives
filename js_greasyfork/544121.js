// ==UserScript==
// @name         Hide Youtube player controls.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide Youtube player controls. Press key 'h' to hide or show player contols.
// @author       noushadbug
// @match        *://*.youtube.com/watch?*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544121/Hide%20Youtube%20player%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/544121/Hide%20Youtube%20player%20controls.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var key = 72; // h
    var hide = 0;
 
    function logKey(e){
        switch(e.keyCode){
                case key:
                    if(hide == 0){
                        // hide the elements that are on the YouTube video player using CSS
                        document.getElementsByClassName('ytp-chrome-top')[0].style.visibility = 'hidden';
                        document.getElementsByClassName('ytp-chrome-controls')[0].style.visibility = 'hidden';
                        document.getElementsByClassName('ytp-gradient-top')[0].style.visibility = 'hidden';
                        document.getElementsByClassName('ytp-gradient-bottom')[0].style.visibility = 'hidden';
                        document.getElementsByClassName('ytp-progress-bar')[0].style.visibility = 'hidden';
                        document.getElementsByClassName('ytp-progress-bar-container')[0].style.visibility = 'hidden';
                        hide = 1;
                    }else{
                        // show the elements that are on the YouTube video player using CSS
                        document.getElementsByClassName('ytp-chrome-top')[0].style.visibility = 'visible';
                        document.getElementsByClassName('ytp-chrome-controls')[0].style.visibility = 'visible';
                        document.getElementsByClassName('ytp-gradient-top')[0].style.visibility = 'visible';
                        document.getElementsByClassName('ytp-gradient-bottom')[0].style.visibility = 'visible';
                        document.getElementsByClassName('ytp-progress-bar')[0].style.visibility = 'visible';
                        document.getElementsByClassName('ytp-progress-bar-container')[0].style.visibility = 'visible';
                        hide = 0;
                    }
                    break;
       }
    }
    document.addEventListener("keydown", logKey);
})();