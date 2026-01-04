// ==UserScript==
// @name         Streamlined Upkeep Manager 1.5
// @namespace    upkeep,zero.torn
// @version      1.5
// @description  Manage and pay upkeeps more efficiently
// @author       Combined by Aria and Jeff Bezas
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513581/Streamlined%20Upkeep%20Manager%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/513581/Streamlined%20Upkeep%20Manager%2015.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // API token management
    function manageApiToken() {
        let apiToken = localStorage.getItem('tornApiToken');
        if (!apiToken) {
            apiToken = prompt("Please enter your Torn API token key:");
            if (apiToken) {
                localStorage.setItem('tornApiToken', apiToken);
            }
        }
        return apiToken;
    }
    function getRFC() {
        var rfc = $.cookie('rfc_v');
        if (!rfc) {
            var cookies = document.cookie.split('; ');
            for (var i in cookies) {
                var cookie = cookies[i].split('=');
                if (cookie[0] == 'rfc_v') {
                    return cookie[1];
                }
            }
        }
        return rfc;
    }

    function addUpkeepButtons(apiToken, button) {
        console.log("Adding Buttons");
        if (button == 0) {
            const upkeepButton = $('<button id="Upkeep" style="color: var(--default-blue-color); cursor: pointer; margin-right: 10px;">Pay Upkeep</button>');
            $('div.content-title > h4').append(upkeepButton);
            upkeepButton.on('click', async () => {
                //alert("2 aler");
                let flag = localStorage.getItem('Flag');
                if (flag == 0){
                    alert("Unable to do that while traveling abroad.");
                    return;
                }
                const enteredAmount = Number($('#amountInput').val());
                if (enteredAmount > 0) {
                    const propertyId = await fetchPropertyId(apiToken);
                    pay(enteredAmount, propertyId);
                    let currentAmt = localStorage.getItem('FeesAmount');
                    let newVal = currentAmt - enteredAmount;
                    //alert(newVal);
                    localStorage.setItem('FeesAmount', newVal);
                    alert("Payment successful");
                    $('#Upkeep').text(`Pay Upkeep | Total: $${newVal}`);
                } else {
                    alert("Please enter a valid amount.");
                }
            });
            return upkeepButton;
        }
        if (button == 1) {
            const upkeepButton2 = $('<button id="Upkeep2" style="color: var(--default-blue-color); cursor: pointer; margin-right: 10px;">Check Balance</button>');
            $('div.content-title > h4').append(upkeepButton2);
            upkeepButton2.on('click', () => {
                let balance = localStorage.getItem('Balance') || 0;
                let balance2 = balance.toString().replace(/,/g, ''); // Remove commas

                let feesAmt2 = localStorage.getItem('FeesAmount'); //Attemot to get last fee amount before going over seas
            let number2 = feesAmt2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //Testing

            balance = Number(balance);
            feesAmt2 = Number(feesAmt2);
            //alert(`Fees: ${feesAmt2} and Bal: ${number3}`);
            let dif = feesAmt2-balance; //Number4 = Upkeep Total - Balance, if this is less than 0, should equal to Upkeep Total
                if (dif < 0){
                    balance2 = feesAmt2;
                }
                alert(balance2); // Check if upkeep-bal is less than 0, if so, pay upkeep instead

                //let formattedAmount = balance.replace(/^.|.$/g, '').trim();

                //alert(balance2);
                $('#amountInput').val(balance2);
                let feesAmt = localStorage.getItem('FeesAmount');
                let formattedNumber = feesAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $('#Upkeep').text(`Pay Upkeep | Total: $${formattedNumber}`);

                //alert(`Current Balance: $${balance}`);
            });
            return upkeepButton2;
        }
        if (button == 2) {
            const resultSpan = $('<span id="Result" style="font-size: 12px; font-weight: 100;"></span>');
            $('div.content-title > h4').append(resultSpan);
            return resultSpan;
        }
        if (button == 3) {
            const resetButton = $('<button id="ResetKey" style="color: var(--default-red-color); cursor: pointer;">Reset API Key</button>');
            resetButton.on('click', () => {
                const newApiToken = prompt("Please enter your new Torn API token key:");
                if (newApiToken) {
                    localStorage.setItem('tornApiToken', newApiToken);
                    $('#Result').text('API token updated.').css('color', 'green');
                } else {
                    $('#Result').text('No API token provided.').css('color', 'red');
                }
            });
            $('div.content-title > h4').append(resetButton);
        }
    }
    // Fetch Property ID
    async function fetchPropertyId(apiToken) {
        console.log("Fetching Property ID...");
        const apiURL = `https://api.torn.com/user/?key=${apiToken}&comment=StreamlinedUpkeepManager&selections=properties`;
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            const propertyIds = Object.keys(data.properties);
            //console.log("Fetched Property IDs:", propertyIds);
            return propertyIds.length > 0 ? propertyIds[0] : null;
        } catch (error) {
            console.error('Error fetching property ID:', error);
            return null;
        }
    }

    // Pay upkeep function
    function pay(toPay, propertyID) {
        console.log(`Attempting to pay upkeep of: $${toPay} for Property ID: ${propertyID}`);
        $("#Upkeep").text("Processing...").prop("disabled", true);

        $.post(`https://www.torn.com/properties.php?rfcv=${getRFC()}`, {
            step: "upkeepProperty",
            pay: toPay,
            ID: propertyID
        })
            .done(function(response) {
            response = JSON.parse(response);
            if (response.success) {
                console.log("Payment successful");
                //$("#Upkeep").text("Paid");
            } else {
                console.error("Payment failed:", response.error);
                alert("Payment failed:", response.error);
                //$("#U").text("Payment Failed");
            }
        })
            .fail(function() {
            console.error("Network error during payment");
            $("#Upkeep").text("Payment Failed");
        })
            .always(function() {
            $("#Upkeep").prop("disabled", false);
        });
    }

    // Function to fetch and format amount
    function fetchAndFormatAmountFromFeesSpan(feesSpan) {
        const textContent = feesSpan.textContent;
        const amountMatch = textContent.match(/\$([\d,]+)/); // Updated regex to match dollar sign

        if (amountMatch && amountMatch[1]) {
            const amount = amountMatch[1].replace(/,/g, ''); // Remove commas
            console.log("Extracted Amount: ", amount); // Log the number without commas
            localStorage.setItem('FeesAmount', amount); // Save to local storage
            return Number(amount);
        } else {
            console.log("Amount not found in text content.", amountMatch);
            return 0; // Return 0 if not found
        }
    }

    // Main function to run the script
    async function main() {
        console.log("Starting...");
        const apiToken = manageApiToken();
        if (!apiToken) {
            //apiToken = 0;
            addUpkeepButtons(0, 2);
            $('#Result').text('No API token provided.').css('color', 'red');
            return;
        }

        const bodyElement = document.querySelector("#body");
        if (bodyElement && bodyElement.getAttribute("data-traveling") === 'true' || (document.querySelector("#mainContainer > div.content-wrapper.autumn.travelling"))) { // Travel check
            //$('#Result').text("You can't do that while Traveling.").css('color', 'red');
            let feesAmt2 = localStorage.getItem('FeesAmount'); //Attemot to get last fee amount before going over seas
            let number2 = feesAmt2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //Testing
            let balance = localStorage.getItem("Balance");
            balance = balance.toString().replace(/,/g, '');
            balance = Number(balance);
            feesAmt2 = Number(feesAmt2);
            //alert(`Fees: ${feesAmt2} and Bal: ${number3}`);
            let dif = feesAmt2-balance; //Number4 = Upkeep Total - Balance, if this is less than 0, should equal to Upkeep Total
            //number4 = number4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //alert(dif);

            const flag = 0;
            localStorage.setItem('Flag', flag);
            addUpkeepButtons(apiToken, 0);
            $('#Upkeep').text(`Current Upkeep: $${number2}\nYou can pay when you get back`);
            return; // Exit the function if traveling
        }
        const resultSpan = addUpkeepButtons(apiToken, 2); // Create result span


        const feesSpan = document.querySelector("#item20230685 > div.bottom-round > div > ul > li.last > span.desc");
        if (feesSpan) {
            const toPay = fetchAndFormatAmountFromFeesSpan(feesSpan); // Get the amount from feesSpan

            console.log("To Pay: ", toPay); // Log the amount to pay


            // Create input field and buttons
            const upkeepButton = addUpkeepButtons(apiToken, 0); // Add the first upkeep button
            const upkeepButton2 = addUpkeepButtons(apiToken, 1); // Add the second upkeep button
            const inputField = $('<input type="number" id="amountInput" placeholder="Enter amount" />');
            $('div.content-title > h4').append(inputField);
            //addUpkeepButtons(apiToken, 0);

            // Append input field and button to the result area
            //$('#Result').append(inputField);

            // Event listener for Enter key press
            inputField.on('keypress', function(event) {
                if (event.which === 13) { // Enter key
                    const enteredAmount = Number($(this).val());
                    if (enteredAmount > 0) {
                        pay(enteredAmount, propertyId); // Call pay function with entered amount

                        let newVal = toPay - enteredAmount;
                        localStorage.setItem('FeesAmount', newVal);
                        let formattedNumber = newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        alert("Payment successful");
                        $('#Upkeep').text(`Pay Upkeep | Total: $${formattedNumber}`);
                    } else {
                        alert("Please enter a valid amount.");
                    }
                }
            });

            // Initialize the Pay Upkeep button
            upkeepButton.on('click', function() {
                alert("1 aler");
                const enteredAmount = Number(inputField.val());
                if (enteredAmount > 0) {
                    pay(enteredAmount, propertyId); // Call pay function with entered amount
                } else {
                    alert("Please enter a valid amount.");
                }
            });
        } else {
            console.log("Fees span element not found.");
        }

        const balSpan = document.querySelector("#user-money");
        if (balSpan) {
            let balance = balSpan.textContent;
            balance = balance.match(/\$([\d,]+)/);
            console.log("User Balance: ", balance[1]); //Remember to set value without commas, or always set with commas, only when need int, replace commas, then Number()
            localStorage.setItem('Balance', balance[1]);
            //addUpkeepButtons(apiToken, 1);

        } else {
            console.log("Balance span element not found.");
        }

        const propertyId = await fetchPropertyId(apiToken);
        if (!propertyId) {
            $('#Result').text('Failed to retrieve property ID.').css('color', 'red');
            return;
        }
    }

    // Call main function to start the script
    main();
})(jQuery);