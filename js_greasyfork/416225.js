// ==UserScript==
// @name         Twitch Auto Points Claimer 
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  Get Simple floating chest
// @author       Bash62
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416225/Twitch%20Auto%20Points%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/416225/Twitch%20Auto%20Points%20Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var numPoints = 0;
    var compteurAsLoaded = false;
    var label = document.createElement("p");




    //Check if box is active
    function checkPage(){

     // Check if the user is looking at a stream
        if(document.body.contains(document.getElementsByClassName('community-points-summary')[0])){
            //Check if loot is claimable.
            if(document.body.contains(document.getElementsByClassName("community-points-summary tw-align-items-center tw-flex tw-full-height")[0].getElementsByTagName("BUTTON")[1])){
                              var boutton = document.getElementsByClassName("community-points-summary tw-align-items-center tw-flex tw-full-height")[0].getElementsByTagName("BUTTON")[1];
                              boutton.click();
                              numPoints+=50;
                              updateCompteur();

                                      }

        }
    }

    // update numPoints :

    function updateCompteur(){
        label.innerHTML = "+" + numPoints.toString();

    }


    // Setup a numPoints that shows the number of channel points earned

    function setCompteur(){
        if(document.body.contains(document.getElementsByClassName("tw-align-items-center tw-flex tw-flex-wrap tw-full-width tw-justify-content-end tw-mg-l-1 tw-mg-t-05")[0])){
            compteurAsLoaded = true;
            var base = document.getElementsByClassName("tw-align-items-center tw-flex tw-flex-wrap tw-full-width tw-justify-content-end tw-mg-l-1 tw-mg-t-05")[0];
            label.innerHTML = "+" + numPoints.toString();
            base.appendChild(label);
        }
        else{
            // While page is not loaded wait
            // When page is loaded : setCompteur()
            setTimeout(function(){
                console.log("Waiting for page to fully load.");
                setCompteur();

            }, 1000);

        }
    }



    function main() {
        setTimeout(function() {


            setCompteur();
            checkPage();
            main();



        }, 5000);
    }

    main();

})();