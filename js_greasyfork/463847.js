// ==UserScript==
// @name         CSGOCLICKER - AUTO OPEN CASES !
// @namespace    http://Xingy.xyz/
// @version      1.1
// @description  csgoclicker.net
// @author       XingyCoderXYZ
// @match        https://csgoclicker.net/caseopener/open/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463847/CSGOCLICKER%20-%20AUTO%20OPEN%20CASES%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/463847/CSGOCLICKER%20-%20AUTO%20OPEN%20CASES%20%21.meta.js
// ==/UserScript==

(function () {
    //vars

    var valueToKeep = parseFloat(localStorage.getItem("valueToKeep")) || 100;//Value of skins to keep, if 100 then sells items under 100 dollars
    var wallet = minWallet + 1; //no need 2 change this.
    var minWallet = 10 //Incase the mission scrip has an error, the script will stop running, if u have less then the amount given in ur wallet.
    var autoOpenCaseBool = true;
    var casesAmount = 0;

    let stats;

    // Check if local storage is accessible
    function getStats() {
        try {
            stats = JSON.parse(localStorage.getItem("stats") || {});
        } catch (e) {
            console.error("Local storage is not accessible:", e);
        }

        // If savedStats is null or undefined, local storage is not accessible or the "stats" key does not exist in local storage
        if (!stats) {
            console.log("No saved stats found");

            // Create a new stats object
            const newStats = {
                casesOpened: 0,
                totalEarnings: 0,
            };

            // Save the new stats object to local storage
            try {
                localStorage.setItem("stats", JSON.stringify(newStats));
                console.log("New stats object created:", newStats);
            } catch (e) {
                console.error("Unable to save new stats object:", e);
            }
        } else {
            console.log("Saved stats:", stats);
        }
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function Main() {

        //Get cases owned
        document.querySelector('.casesOwned').addEventListener("DOMCharacterDataModified", function (event) { casesAmount = parseInt(event.newValue.replace("Owned: ", "")) });
        //Get wallet balance
        document.querySelector('.wallet').addEventListener("DOMCharacterDataModified", function (event) { wallet = parseFloat(event.newValue.replace("$", "").replace(",", "")) });

        //Helper functions

        async function openCase() {
            document.querySelector('.openCase.btn')?.click()
            stats.casesOpened++;
            let opening = true;
            while (opening) {
                await delay(1000);
                if (document.querySelector('.openCase.btn:not(.pressed)')) {
                    opening = false;
                }
            }

        }
        function buyCase() {
            document.querySelector('.buyCase.btn.navy.center')?.click();
        }

        function closeSellWindow() {
            document.querySelector('.fas.fa-times')?.click();
        }

        //sell items below value to keep
        function sellItemsBelowValueToKeep() {
            const sellToggle = document.querySelector(".sellToggle");

            if (!sellToggle?.className.includes('on')) {
                sellToggle.click();
            }

            const items = document.querySelector('.invItems.vb-content');

            for (let i = 0; i < items.children.length; i++) {
                const item = items.children[i];
                const itemPrice = parseFloat(item.querySelector('.price').innerText.replace("$", "").replace(",", ""));
                if (itemPrice < valueToKeep) {
                    item.click();
                }
            }
            document.querySelector('.sellItemsButton.btn.navy.extra-thin').click()
            sellToggle.click();
        }


        const openCaseLoop = async () => {
            // Close sell window if open
            closeSellWindow();
            // toggle off popup
            document.querySelector('.disablePopup:not(.toggled)')?.click();
            //Get amount of cases
            if (wallet < minWallet) {
                localStorage.setItem("stats", JSON.stringify(stats));
                console.log(wallet)
                return location.reload();
            }
            if (casesAmount <= 100) {
                buyCase();
            }

            // Open case
            await openCase();


            // Get unboxed item price
            const priceElements = document.querySelectorAll('.price');
            const lastPriceElement = priceElements[priceElements.length - 1];
            const priceText = lastPriceElement.innerText.replace("$", "").replace(",", "");
            const unboxedItemPrice = parseFloat(priceText);

            // Sell items
            sellItemsBelowValueToKeep();

            stats.totalEarnings += (unboxedItemPrice - 2.5);
            console.log('Unboxed skin price: ', unboxedItemPrice);
            console.log('Stats: ', stats);
            if (autoOpenCaseBool) {
                openCaseLoop();
            }
        }



        //Gui
        function createGui() {
            // Create a div element to hold the GUI
            var guiDiv = document.createElement('div');
            guiDiv.style.position = 'fixed';
            guiDiv.style.top = '0';
            guiDiv.style.right = '415px';
            guiDiv.style.backgroundColor = 'white';
            guiDiv.style.padding = '10px';
            guiDiv.style.border = '1px solid black';
            guiDiv.style.zIndex = 1111
            guiDiv.style.display = 'flex';
            guiDiv.style.flexDirection = 'column';
            guiDiv.style.rowGap = '5px';

            // Create input fields for each variable and add them to the GUI div

            var settings = document.createElement('div');
            settings.classList.add('navLink')
            settings.innerText = 'Settings';

            settings.addEventListener('click', function () {
                if (guiDiv.style.display === 'none') {
                    guiDiv.style.display = 'flex';
                } else {
                    guiDiv.style.display = 'none';
                }
            });

            document.querySelector(".navLinksRight").appendChild(settings);

            // Min wallet
            // Div wrapper for the input and label
            var divWrapper = document.createElement('div');
            divWrapper.style.display = 'flex';
            divWrapper.style.flexDirection = 'row';
            divWrapper.style.columnGap = '5px';
            guiDiv.appendChild(divWrapper);

            // Label
            var minWalletLable = document.createElement('label');
            minWalletLable.innerHTML = 'Min balance in wallet:';
            divWrapper.appendChild(minWalletLable);

            // Input
            var minWalletInput = document.createElement('input');
            minWalletInput.type = "text";
            minWalletInput.value = minWallet;
            minWalletInput.addEventListener('input', function () {
                const inputVal = minWalletInput.value;
                if (!isNaN(inputVal)) {
                    minWallet = inputVal;
                } else {
                    minWalletInput.value = minWallet;
                }
            });
            divWrapper.appendChild(minWalletInput);


            // Value to keep input
            // Div wrapper for the input and label
            divWrapper = document.createElement('div');
            divWrapper.style.display = 'flex';
            divWrapper.style.flexDirection = 'row';
            divWrapper.style.columnGap = '5px';
            guiDiv.appendChild(divWrapper);

            // Label
            var valueToKeepLable = document.createElement('label');
            valueToKeepLable.innerHTML = 'Value to keep:';
            divWrapper.appendChild(valueToKeepLable);

            // Input
            var valueToKeepInput = document.createElement('input');
            valueToKeepInput.type = "text";
            valueToKeepInput.value = valueToKeep;
            valueToKeepInput.addEventListener('input', function () {
                const inputVal = valueToKeepInput.value;
                if (!isNaN(inputVal)) {
                    valueToKeep = inputVal;
                    localStorage.setItem("valueToKeep", valueToKeep);
                    sellItemsBelowValueToKeepBtn.innerHTML = `Sell below ${valueToKeep}`;
                } else {
                    valueToKeepInput.value = valueToKeep;
                }
            });
            divWrapper.appendChild(valueToKeepInput);


            // Sell items below value to keep button
            var sellItemsBelowValueToKeepBtn = document.createElement('button');
            sellItemsBelowValueToKeepBtn.innerHTML = `Sell below ${valueToKeep}`;
            sellItemsBelowValueToKeepBtn.addEventListener('click', function () {
                sellItemsBelowValueToKeep();
            });
            guiDiv.appendChild(sellItemsBelowValueToKeepBtn);

            // Toggle autoopencase
            // Sell items below value to keep button
            var autoOpenCaseBtn = document.createElement('button');
            autoOpenCaseBtn.innerHTML = `Auto open cases: ${autoOpenCaseBool ? "ON" : "OFF"}`;
            autoOpenCaseBtn.addEventListener('click', function () {
                autoOpenCaseBool = !autoOpenCaseBool;
                autoOpenCaseBtn.innerHTML = `Auto open cases: ${autoOpenCaseBool ? "ON" : "OFF"}`;
                if (autoOpenCaseBool) {
                    openCaseLoop();
                }
            });
            guiDiv.appendChild(autoOpenCaseBtn);


            // Add the GUI div to the page
            document.body.appendChild(guiDiv);
        }


        sellItemsBelowValueToKeep();
        createGui()


        if (autoOpenCaseBool) {
            openCaseLoop();
        }
    }

    setTimeout(async () => {
        document.querySelectorAll(".sortOption")[0]?.click();
        getStats();;
        Main();
    }, 5000)

    setTimeout(function () {
        localStorage.setItem("stats", JSON.stringify(stats));
        location.reload();
    }, (3600000 / 2));

})();