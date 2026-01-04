// ==UserScript==
// @name         ClickYesOnAge
// @namespace    http://tampermonkey.net/
// @version      2024-01-23
// @description  Click "Yes"
// @author       BovBrew
// @match        https://www.finewineandgoodspirits.com/*
// @icon         https://www.finewineandgoodspirits.com/file/v3990053292507217215/general/&-favicon-16x16.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485518/ClickYesOnAge.user.js
// @updateURL https://update.greasyfork.org/scripts/485518/ClickYesOnAge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    clickOnceLoaded();
    function clickYes(){
        let confirmAge = document.getElementsByClassName("age-gate__cta");
        if (confirmAge) {
            try {
                let confirmButtons = confirmAge[0].getElementsByClassName("button");
                if(confirmButtons.length > 1 ) {
                    for (let i = 0; i < confirmButtons.length; i++) {
                        if (confirmButtons[i].innerText === "YES")confirmButtons[i].click();
                    }
                }else{
                    confirmButtons[0].click();
                }
            } catch (error) {
                if (document.getElementsByClassName("age-gate__cta").length > 0){
                    setInterval(function(){
                        clickOnceLoaded();
                    }, 250);
                } else {
                    setInterval(function(){
                        if (document.getElementsByClassName("age-gate__cta").length > 0){
                            setInterval(function(){
                                clickOnceLoaded();
                            }, 500);
                        };
                    }, 250);
                };
            };
        } else {
            console.log('No Confirmation Needed');
        };
    };

    // Function to check if all images are loaded
    function areAllImagesLoaded(){
        const images = document.querySelectorAll('img');
        for(const image of images){
            if(!image.complete) return false;
        };
        return true;
    };

    // Scroll to Focus Element on Page Once All Images Have Loaded
    function clickOnceLoaded() {
        const intervalId = setInterval(function(){
            if(areAllImagesLoaded()){
                clearInterval(intervalId);
                clickYes();
            }else{
                console.log('Images are still loading...');
            };
        }, 250);
    };
})();