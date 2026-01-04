// ==UserScript==
// @name         Salt's Auto Repeat
// @version      1.2
// @description  Adds specified count auto repeat to Shalzuth's WOTV tools
// @author       Salt#0484
// @match        https://wotv.shalzuth.com/Wotv
// @match        http://wotv.shalzuth.com/Wotv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shalzuth.com
// @namespace https://greasyfork.org/users/1014554
// @downloadURL https://update.greasyfork.org/scripts/458582/Salt%27s%20Auto%20Repeat.user.js
// @updateURL https://update.greasyfork.org/scripts/458582/Salt%27s%20Auto%20Repeat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        const repeatInput = document.createElement("input");
        const raidButton = document.createElement("button");
        const battleFooter = document.querySelector(".modal-footer");
        const buttonText = document.createTextNode("Auto Repeat");

        repeatInput.setAttribute("type", "number");
        repeatInput.setAttribute("style", "width:40px;");
        repeatInput.setAttribute("id", "repeatcount");

        raidButton.appendChild(buttonText);
        raidButton.setAttribute("class", "btn btn-primary");
        raidButton.setAttribute("id", "autorepeat");

        battleFooter.appendChild(repeatInput);
        battleFooter.appendChild(raidButton);

        const el = document.getElementById("autorepeat");
        el.addEventListener("click", repeatRaid, false);
        // Hide the build in repeat function (it is not as good)
        document.getElementById("repeatNum").setAttribute("style", "display:none;");
        document.getElementById("repeatCount").setAttribute("style", "display:none;");
    });

    function repeatRaid(zEvent){

        let counter = document.getElementById("repeatcount").value;

        if (document.querySelector("#battleResultsList").textContent === "Battle failed...") {
            return false;
        } else if (counter < 1) { return false;
        } else if (document.getElementById("repeatBattle").style.display !== "none") {
            console.log("attempting repeat");
            counter = counter-1;
            document.getElementById("repeatcount").value = counter;
            repeatBattle();
            repeatRaid();
        } else {
            setTimeout(() => {repeatRaid()},1000)
            console.log("Looping");
        }
    };



    var monitorInterval;
    var isMonitoring = false;

    // Create the toggle button
    var toggleButton = document.createElement("button");
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = 'Auto NRG Refill';
    toggleButton.style.marginLeft = "5px";
    toggleButton.onclick = toggleMonitor; // Add onClick event to the button

    // Create a MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if the NRG button is present
            var nrgButton = document.querySelector('#accountInfo button.active');
            if (nrgButton && !document.getElementById('toggleButton')) {
                // If NRG button is present and toggle button isn't, append toggle button after NRG button
                nrgButton.insertAdjacentElement('afterend', toggleButton);
                console.log('Toggle button has been appended.');
            }
        });
    });

    // Start observing #accountInfo for changes in the child list
    var accountInfo = document.getElementById('accountInfo');
    observer.observe(accountInfo, { childList: true });

    // Separate function for the toggle button click event
    function toggleMonitor() {
        var button = document.getElementById('toggleButton');

        if (isMonitoring) {
            // If the monitor is currently running, stop it.
            clearInterval(monitorInterval);
            console.log('Monitoring has been stopped.');
            button.textContent = 'Auto Refill: OFF';
        } else {
            // If the monitor is currently stopped, start it.
            console.log('Starting to monitor...');
            monitorInterval = setInterval(function() {
                var accountInfoText = accountInfo.textContent;
                var nrgSubstring = accountInfoText.split("NRG")[1].split("/")[0];
                var nrgValue = nrgSubstring.trim();
                console.log('Current NRG value: ' + nrgValue);

                if(parseInt(nrgValue) < 200) {
                    console.log('NRG value is less than 200. Running recoverAp...');
                    recoverAp(3);
                }
            }, 10000);
            button.textContent = 'Auto Refill: ON';
        }

        // Toggle the monitoring state.
        isMonitoring = !isMonitoring;
    }



})

();