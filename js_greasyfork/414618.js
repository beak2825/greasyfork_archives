// ==UserScript==
// @name         PianoMarvelShorcut
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        https://pianomarvel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414618/PianoMarvelShorcut.user.js
// @updateURL https://update.greasyfork.org/scripts/414618/PianoMarvelShorcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //Shorcut keys for Tao Bien Lai handler
    function tao_bien_lai(e) {
        //Check if shorcut is pressed
        try {
            if (e.ctrlKey && e.keyCode == 219 || e.keyCode == 219) {
                //Click the element Ctrl + [
                console.log('Previous Excercise')
                document.getElementsByClassName("fa fa-backward fa-2x mt-4")[0].click()
            }


            //Ctrl + ]
            if (e.ctrlKey && e.keyCode == 221 || e.keyCode == 221) {
                console.log('Next Excercise')
                document.getElementsByClassName("fa fa-forward fa-2x mt-4")[0].click()
            }
        } catch (error) {
            console.log('Có lỗi xảy ra: ' + error.message)
        }
    }
    // register the handler
    document.addEventListener('keyup', tao_bien_lai, false);


})();