// ==UserScript==
// @name         ShipHawk Full Ship Mode Margins
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.shiphawk.com/app/orders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/461899/ShipHawk%20Full%20Ship%20Mode%20Margins.user.js
// @updateURL https://update.greasyfork.org/scripts/461899/ShipHawk%20Full%20Ship%20Mode%20Margins.meta.js
// ==/UserScript==


(function(open) {
    XMLHttpRequest.prototype.open = function() {
        var currId = null;
        this.addEventListener("readystatechange", function(data) {
            if (data.currentTarget.responseURL.indexOf("shiphawk.com/api/v4/web/orders/find") > 0 ) {

                var info = JSON.parse(data.currentTarget.response);
                var referenceNumbers = info.reference_numbers;
                var grossProfit = parseFloat(referenceNumbers.find(function(element) {
                    return element.name == "Gross Profit";
                })?.value);

                // Select the button and get its original onclick function
                var button;

                var interval = setInterval(function() {
                    button = document.querySelector('.MuiButton-contained[data-test-id="ship-button"]');
                    if(button){

                        clearInterval(interval);
                        var originalOnclick = button.getAttribute('onclick');

                        // Define a new onclick function that performs the logic and prompts the user
                        button.onclick = function(event) {
                            var rate = parseFloat(document.querySelector('[data-test-id="proposed-rate"] button div').textContent.replace(/[^0-9\.]/g, ''));
                            // Check if the margin on the order is good
                            var isMarginGood = checkMargin(grossProfit, rate);


                            if(!isMarginGood){
                                var confirmMessage = "The margin on this order is not good. Do you want to continue anyway? Negative Margin: $" + (grossProfit - rate).toFixed(2);
                                if (window.confirm(confirmMessage)) {
                                    // If the user selects "yes", call the original onclick function with the event object
                                    eval(originalOnclick);
                                } else {
                                    // If the user selects "cancel", prevent the default behavior of the button
                                    event.preventDefault();
                                }
                            }

                        };
                    }
                }, 250);

            }
        }, false);

        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);


function checkMargin(margin, rate) {
    console.log("margin: " + margin)
    console.log("rate: " + rate)

    //if they havent fetched rate yet, allow them to ship?
    if(isNaN(rate)) return true;

    return (margin - rate > 0);
}
