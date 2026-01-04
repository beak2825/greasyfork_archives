// ==UserScript==
// @name         Save TEMU Category XHR
// @namespace    http://tampermonkey.net/
// @version      0.8.0.5
// @description  Allows save and download TEMU's listings
// @author       yhuang2
// @match         *://*.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/468130/Save%20TEMU%20Category%20XHR.user.js
// @updateURL https://update.greasyfork.org/scripts/468130/Save%20TEMU%20Category%20XHR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetUrl = "/api/poppy/v1/opt?scene=opt";
    let targetUrlBottom = "/api/poppy/v1/opt?scene=opt_landing_bottom_rec";

    let savedData = GM_getValue('savedData', {});
    if (!window.location.pathname.includes('login')) {
        let fileName = window.location.pathname.replace(/\//g, '').replace(".html", '');
        GM_setValue('fileName', fileName);
    }
    let fileCounter = GM_getValue('fileCounter', 0); // File counter
    let saveThreshold = 600; // Save threshold
    let itemCounter = Object.keys(savedData).length;
    let itemCounterTotal = GM_getValue('itemCounterTotal', 0); // Total item counter
    let countryCode = "";
    let currencyCode = "";
    let lowerPriceRange = "";
    let upperPriceRange = "";

    // To show the bottom status
    let bottomStatus = "";

    (function(send) {

        XMLHttpRequest.prototype.send = function(body) {
            // Check if this._url is set
            if (this._url && this._url.includes("/api/poppy/v1/opt?scene=opt")) {
                console.log(body)
            };

            if (this._url && this._url.includes("/api/poppy/v1/opt?scene=opt") && body && typeof body === 'string' && body.includes('filterItems')) {
                // Use Regex to get price range
                let match = body.match(/104:(-?\d+),(-?\d+)/);;
                if (match) {
                    lowerPriceRange = match[1];
                    upperPriceRange = match[2];
                    console.log('Lower Price Range:', lowerPriceRange);
                    console.log('Upper Price Range:', upperPriceRange);
                }
            }

            // call original send method
            send.call(this, body);
        };

    })(XMLHttpRequest.prototype.send);
    (function(open) {

        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {


            if (url.includes(targetUrl) && !url.includes(targetUrlBottom)) {
                this._url = url;
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {  // When the request is completed
                        try {
                            updateButtonStatus(false);
                            // Parse the response text
                            let data = JSON.parse(this.responseText);
                            let goodsList = data['result']['data']['goods_list'];
                            let addedTime = data['result']['server_time'];
                            countryCode = url.split('/')[1].toUpperCase();
                            if (countryCode.length >= 6) {
                                countryCode = "US";
                            }

                            if (countryCode.toLowerCase() == "api") {
                                countryCode = "US";
                            }

                            currencyCode = data['result']['data']['goods_list'][0]['price_info']['currency'];


                            // Loop through each element in the goods list
                            for (let i = 0; i < goodsList.length; i++) {
                                let goodsId = goodsList[i]['goods_id'];

                                // Add server time to the goods item
                                goodsList[i]['addedTime'] = addedTime;
                                goodsList[i]['countryCode'] = countryCode;

                                // Save each element in savedData
                                savedData[goodsId] = goodsList[i];
                            }

                            // Update the file name
                            if (!window.location.pathname.includes('login')) {
                                let fileName = window.location.pathname.replace(/\//g, '').replace(".html", '') + "_" + currencyCode;
                                fileName = fileName + `_${lowerPriceRange}_${upperPriceRange}`;
                                GM_setValue('fileName', fileName);
                            }

                            // Update the counter
                            itemCounter = Object.keys(savedData).length;
                            itemCounterTotal += goodsList.length; // Update total item counter

                            // Save and reset savedData if the number of keys is over the threshold
                            if (itemCounter >= saveThreshold) {
                                let blob = new Blob([JSON.stringify(savedData, null, 2)], {type : 'application/json'});
                                fileCounter++;
                                let fileName = GM_getValue('fileName', "");
                                saveAs(blob, `${fileName}_${String(fileCounter).padStart(4, '0')}_${new Date().toISOString().slice(0,10)}.json`);
                                savedData = {};
                                itemCounter = 0;
                                GM_setValue('savedData', savedData);
                                GM_setValue('fileCounter', fileCounter);
                            }


                            // Persist the saved data
                            GM_setValue('savedData', savedData);

                        } catch (e) {
                            console.error('Failed to save XHR response:', e);
                        }
                    }
                }, false);
            }

            // If the URL is the target bottom URL, update the bottom status
            if (url.includes(targetUrlBottom)) {
                let blob = new Blob([JSON.stringify(savedData, null, 2)], {type : 'application/json'});
                fileCounter++;
                let fileName = GM_getValue('fileName', "");
                saveAs(blob, `${fileName}_${String(fileCounter).padStart(4, '0')}_${new Date().toISOString().slice(0,10)}.json`);
                savedData = {};
                itemCounter = 0;
                GM_setValue('savedData', savedData);
                GM_setValue('fileCounter', fileCounter);
                bottomStatus = "You have scrolled to the bottom";
                updateButtonStatus(true);
            } else {
                updateButtonStatus(false);
            }

            // Update the counter display
            updateCounterCountryDisplay();

            open.call(this, method, url, async, user, pass);
        };

    })(XMLHttpRequest.prototype.open);

    function updateCounterCountryDisplay() {
        counterDisplay.textContent = "Count: " + itemCounterTotal + ". " + bottomStatus;

        if (lowerPriceRange != "") {
            priceDisplay.textContent = "Price Range: " + lowerPriceRange + " - " + upperPriceRange;
        } else {
            priceDisplay.textContent = "PLEASE SELECT A PRICE RANGE FIRST";
        }
        countryDisplay.textContent = "Country Code: " + countryCode + ". " + "Currency: " + currencyCode + ". ";


    }

    function updateButtonStatus(isBottom, isGenerating = false) {
        if (isGenerating) {
            buttonJson.textContent = "Generating Downloadable File...";
            buttonJson.disabled = true;
        } else if (isBottom) {
            buttonJson.style.color = "red";
            buttonJson.style.fontWeight = "bold";
            bottomStatusDisplay.style.color = "red";
        } else {
            buttonJson.style.color = "black";
            buttonJson.style.fontWeight = "normal";
            bottomStatusDisplay.style.color = "black";
        }
    }

    // Create a container for our elements
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '600px';
    container.style.right = '0';
    container.style.zIndex = '1000';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';
    container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(container);

    // Create the counter display
    let counterDisplay = document.createElement('p');
    counterDisplay.textContent = "Count: " + itemCounter;
    counterDisplay.style.fontSize = "20px";
    container.appendChild(counterDisplay);

    // Create the Country and Currency Display

    let countryDisplay = document.createElement('p');
    countryDisplay.textContent = "Country Code: " + countryCode;
    countryDisplay.style.fontSize = "20px";
    container.appendChild(countryDisplay);

    // Create the Price Display

    let priceDisplay = document.createElement('p');
    priceDisplay.textContent = "Select a price range";
    priceDisplay.style.fontSize = "20px";
    container.appendChild(priceDisplay);

    // Create the bottom status display
    let bottomStatusDisplay = document.createElement('p');
    bottomStatusDisplay.textContent = "";
    container.appendChild(bottomStatusDisplay);

    // Create the Export as JSON and Refresh button
    let buttonJson = document.createElement('button');
    buttonJson.textContent = "Export as JSON and Refresh";
    buttonJson.style.fontSize = "20px"
    buttonJson.onclick = function() {
        updateButtonStatus(false, true);
        setTimeout(function() {
            let blob = new Blob([JSON.stringify(savedData, null, 2)], {type : 'application/json'});
            let fileName = GM_getValue('fileName', "");
            fileCounter++;
            saveAs(blob, `${fileName}_${String(fileCounter).padStart(4, '0')}_${new Date().toISOString().slice(0,10)}.json`);
            savedData = {};
            itemCounter = 0;
            fileCounter = 0; // Reset file counter
            GM_setValue('savedData', savedData);
            GM_setValue('fileCounter', fileCounter);
            updateCounterCountryDisplay();
            updateButtonStatus(false, false);
            location.reload();
        }, 3000);
    };
    buttonJson.style.height = "100px";
    buttonJson.style.width = "300px";
    container.appendChild(buttonJson);


})();
