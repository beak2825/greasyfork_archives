// ==UserScript==
// @name         PnW non-VIP mass infra and land-purchaser
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to buy infra or land to a certain level in all cities.
// @author       RandomNoobster
// @match        https://politicsandwar.com/cities/
// @icon         https://politicsandwar.com/favicon.ico
// @license      MIT
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/457991/PnW%20non-VIP%20mass%20infra%20and%20land-purchaser.user.js
// @updateURL https://update.greasyfork.org/scripts/457991/PnW%20non-VIP%20mass%20infra%20and%20land-purchaser.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function refresh() {
        return new Promise(resolve => setTimeout(resolve, 10));
    }

    function httpGet(theUrl) {
        while(true) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
            console.log(xmlHttp) // for debugging
            if (xmlHttp.responseURL != "https://politicsandwar.com/human/") break;
            window.open("https://politicsandwar.com/human/", '_blank');
            alert("I encountered a captcha! Please complete it before continuing!");
        }
        var doc = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
        return doc;
    }

    function httpPost(theUrl, data) {
        console.log(theUrl, data)
        while(true) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
            xmlHttp.setRequestHeader("Accept", "application/json");
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(data);
            console.log(xmlHttp) // for debugging
            if (xmlHttp.responseURL != "https://politicsandwar.com/human/") break;
            window.open("https://politicsandwar.com/human/", '_blank');
            alert("I encountered a captcha! Please complete it before continuing!");
        }
        var doc = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
        return doc;
    }

    let links = document.querySelectorAll('.nationtable:not(#moreinfotable) tbody a');
    links.forEach(link => {
        link.target = "_blank";
    })

    // Get the form
    let form = document.querySelectorAll("#rightcolumn .center")[1];
    console.log(form)
    let br = document.createElement("br")

    let infraButton = document.createElement("input");
    let landButton = document.createElement("input");
    infraButton.type = landButton.type = "button";
    infraButton.className = landButton.className = "btn btn-primary"
    infraButton.style.width = landButton.style.width = "180px"

    infraButton.value = "Purchase Infrastructure";
    infraButton.onclick = purchase_infra;

    landButton.value = "Purchase Land";
    landButton.onclick = purchase_land;

    let landField = document.createElement("input")
    let infraField = document.createElement("input")
    infraField.type = landField.type = "text";
    infraField.pattern = landField.pattern = "^@";
    infraField.value = landField.value = "@2500";

    form.appendChild(br);
    form.appendChild(infraField);
    form.appendChild(infraButton);
    form.appendChild(br.cloneNode());
    form.appendChild(landField);
    form.appendChild(landButton);
    form.appendChild(br.cloneNode());

    async function purchase_land() {
        await purchase("Land")
    }

    async function purchase_infra() {
        await purchase("Infrastructure")
    }

    async function purchase(purchaseType) {
        var button;
        var field;
        var dataComponent;
        var tdIdx;

        if (purchaseType == "Infrastructure") {
            button = infraButton;
            field = infraField;
            dataComponent = `infra=${encodeURIComponent(field.value)}&land=`
            tdIdx = 1
        }
        else if (purchaseType == "Land") {
            button = landButton;
            field = landField;
            dataComponent = `infra=&land=${encodeURIComponent(field.value)}`
            tdIdx = 3
        }
        else {
            console.log("Error: purchaseType is not valid")
            return
        }

        let popup;
        if (isNaN(Number(field.value.replace(/@/g, '')))) {
            popup = `Your input was invalid! Examples of accepted inputs are 2500 or @2500.`
            confirm(popup);
            return;
        }
        else if (field.value[0] == "@") {
            popup = `Are you sure that you want to purchase up to ${field.value.substring(1)} ${purchaseType} in all cities?`
        }
        else {
            popup = `Are you sure that you want to purchase ${field.value} ${purchaseType} in all cities?\n\nNote that this will add ${field.value} ${purchaseType} to what you already have. In order to buy up to ${field.value}, you have to write "@${field.value}".`
        }
        let confirmation = confirm(popup)
        if (confirmation) {
            button.value = "Working...."
            button.disabled = true

            // Iterate through the unit types
            for (const link of links) {
                await refresh()
                let page = httpGet(link.href)
                let purchaseResult

                // Creating the result div
                let div = document.createElement("div")
                div.className = "alert alert-danger"
                let title = document.createElement("p")
                title.className = "bold"
                title.innerHTML = "Error:"
                let errorMessage = document.createElement("p")

                // Getting the token etc
                let token = page.querySelector('[name=token]').value
                let currentAmount = page.querySelectorAll('form > table > tbody > tr > td')[tdIdx].innerText
                console.log(currentAmount)
                console.log(field.value)
                console.log(parseFloat(currentAmount.replace(/,/g, '')))
                console.log(parseFloat(field.value.substring(1)))
                console.log(parseFloat(currentAmount.replace(/,/g, '')) >= parseFloat(field.value.replace(/@/g, '')))
                if (field.value[0] == '@' && parseFloat(currentAmount.replace(/,/g, '')) >= parseFloat(field.value.replace(/@/g, ''))) {
                    errorMessage.innerHTML = `No purchase was made for ${link.innerHTML} because you already have ${currentAmount} ${purchaseType}.`
                }
                else {
                    // Actually performing the purchase
                    let data = `${dataComponent}&submitcityform=Buy+%2F+Sell&token=${token}`
                    let response = httpPost(link.href, data)
                    purchaseResult = response.querySelector(".alert-success, .alert-danger")

                    if (!purchaseResult.innerText.includes("Error") && !purchaseResult.innerText.includes("successfully")) {
                        errorMessage = `No purchase was made for ${link.innerHTML} due to an unknown reason.`
                    }
                }

                // Printing out the results
                if (errorMessage.innerHTML) {
                    div.appendChild(title)
                    div.appendChild(errorMessage)
                    purchaseResult = div
                }

                console.log(purchaseResult)
                form.appendChild(purchaseResult)

            }
            button.value = `Purchase ${purchaseType}`
            button.disabled = false
        }
    }


})();