// ==UserScript==
// @name         Freebitco.in Auto Roll, Auto WoF (work with tiers hcaptcha resolver) 08/2023
// @namespace    
// @version      0.3
// @description  Please use my Referal-Link https://freebitco.in/?r=1748546, if you find the script useful and want to donate, please use bc1qwdsgre7gzy4z63ujsev9mfkv68f33jykdzeypj
// @author       PredatorBzh
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
 
// @downloadURL https://update.greasyfork.org/scripts/472729/Freebitcoin%20Auto%20Roll%2C%20Auto%20WoF%20%28work%20with%20tiers%20hcaptcha%20resolver%29%20082023.user.js
// @updateURL https://update.greasyfork.org/scripts/472729/Freebitcoin%20Auto%20Roll%2C%20Auto%20WoF%20%28work%20with%20tiers%20hcaptcha%20resolver%29%20082023.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let url = window.location.href;
 
    // Initialize buyLottery variable and number_ticket variable
    let buyLottery = false; //Default is false, set to true if you want to buy lottery ticket after every roll
    let number_ticket = 1; //Default is 1
 
    $(document).ready(function() {
        console.log("Status: Page loaded.");
        // Detect the hCaptcha container
        let hCaptchaContainer = document.querySelector('div.h-captcha');
        // If the hCaptcha container is present
        if (hCaptchaContainer) {
            console.log("hCaptcha is present on the page.");
            // Wait for the captcha to be resolved
            waitForCaptcha(function() {
                console.log("Captcha has been resolved!");
                play();
            });
        } else {
            console.log("hCaptcha is not present on the page.");
            play();
        }
    });
 
  
 
    function buy_lottery_ticket(number_of_ticket) {
        // Select the element using its class
        let element = document.querySelector('.lottery_link');
 
        // Check if the element was successfully selected
        if (element) {
            element.click();
 
            $(document).ready(function() {
                // Find the input element by its ID and set its value to "number_of_ticket"
                let inputElement = document.getElementById('lottery_tickets_purchase_count');
                if (inputElement) {
                    inputElement.value = number_of_ticket;
                }
 
                // Find the button element by its ID and simulate a click
                let buyButton = document.getElementById('purchase_lottery_tickets_button');
                if (buyButton) {
                    buyButton.click();
                }
            });
        } else {
            console.log("The element was not found.");
        }
    }

    function checkCaptchaResolved() {
        // Get the hCaptcha response textarea
        let hCaptchaResponse = document.querySelector('textarea[id^="h-captcha-response-"]');

        // If the textarea contains any value, hCaptcha is likely resolved
        if (hCaptchaResponse && hCaptchaResponse.value.trim() !== "") {
            return true; // Return true if resolved
        } else {
            return false; // Return false if not resolved
        }
    }

    // Function to wait for the captcha to be resolved
    function waitForCaptcha(callback) {
        let captchaCheckInterval = setInterval(function() {
            if (checkCaptchaResolved()) {
                clearInterval(captchaCheckInterval);
                callback();
            }
        }, 1000); // Check every 1 second
    }

    function play(){

        //AutoRoll after 2s
        setTimeout(function() {
            let timeRemainingDiv = document.getElementById("time_remaining");
            // Check if the element with the specific ID is available
            if (timeRemainingDiv && timeRemainingDiv.innerHTML.trim() !== "") {
                console.log("We do nothing");
            } else {
                // Click
                $('#free_play_form_button').click();
                //Buy lottery ticket after 5s
                setTimeout(function() {
                    if (buyLottery){
                        buy_lottery_ticket(number_ticket)
                    }
                }, 5000);
            }
        }, 2000);
 
        //Open WoF tab after 15s
        setTimeout(function() {
            //Reload the page to see if there is WoF div present
            if (!sessionStorage.getItem('justReloaded')) {
                // Set the flag and then reload
                sessionStorage.setItem('justReloaded', 'true');
                location.reload();
            } else {
                // remove the flag
                sessionStorage.removeItem('justReloaded');
            }
 
 
            // Search for the div by its ID
            let div = document.getElementById("free_wof_spins_msg");
 
            if (div) {
                // Search for the link inside the div
                let link = div.querySelector('a[href="https://freebitco.in/static/html/wof/wof-premium.html"]');
 
                if (link) {
                    // Simulate a click event
                    let clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('click', true, true);
                    link.dispatchEvent(clickEvent);
                    //Wait 2s to close the div
                     setTimeout(function() {
                         // Select the element using its class and onclick attribute
                         let specificCloseButton = document.querySelector('.close[onclick="CloseAlertMsg(\'free_wof_spins\',1);"]');
 
                         // Check if the element exists and then click on it
                         if (specificCloseButton) {
                             specificCloseButton.click();
                         } else {
                             console.log("The specific close button was not found.");
                         }
                    }, 2000);
                } else {
                    console.log("The 'Play them here!' link was not found.");
                }
            } else {
                console.log("The div with ID 'free_wof_spins_msg' does not exist.");
            }
        }, 10000);
        
        // Play WoF and close the tab
        if (url.includes("https://freebitco.in/static/html/wof/wof-premium.html")) {
            $(document).ready(function() {
                setTimeout(function() {
                    // Find all buttons with the class 'play-but'
                    let buttons = document.querySelectorAll(".play-but");
     
                    // Filter the button with the text "PLAY ALL"
                    let playAllButton = Array.from(buttons).find(button => button.textContent.trim() === "PLAY ALL");
     
                    if (playAllButton) {
                        // Simulate a click event
                        let clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent('click', true, true);
                        playAllButton.dispatchEvent(clickEvent);
                    } else {
                        console.log("The button with the text 'PLAY ALL' was not found.");
                    }
     
                    //Wait 5 seconds to close the tab
                    setTimeout(function() {
                        window.close();
                    }, 5000);
                }, 4000);
            });
        } else {
            console.log("This is not the page we are looking for.");
        }
    }

})();