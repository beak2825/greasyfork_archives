// ==UserScript==
// @name         Inventory and Repair Script
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Perform actions on specific page with conditions and delays, with additional controls and persistent settings
// @match        https://my.lordswm.com/inventory.php
// @match        https://heroeswm.ru/inventory.php
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/497499/Inventory%20and%20Repair%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/497499/Inventory%20and%20Repair%20Script.meta.js
// ==/UserScript==


(function () {
        'use strict';

        if (!localStorage.getItem("nextTimeExecution")) {
            localStorage.setItem("nextTimeExecution", new Date().getTime());
        }

        // Function to get a random number between min and max (inclusive)
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Function to parse a time string like "2ч.17мин." into seconds
        function parseTimeToSeconds(timeStr) {
            var hoursMatch = timeStr.match(/(\d+)ч/);
            var minutesMatch = timeStr.match(/(\d+)мин/);

            var hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
            var minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

            return (hours * 3600) + (minutes * 60);
        }

        // Function to handle the inventory page actions
        function handleInventoryPage() {
            var repairButton;
            var maxPercentage = localStorage.getItem('repairPercentage');


            let peredachki = document.getElementById("all_trades_to_me").getElementsByClassName('inv_peredachka');

            for (let i = 0; i < peredachki.length; i++) {
                var paymentPercentage = parseFloat(peredachki[i].textContent.match(/\d+(?:\.\d+)?%/)[0]);
                if (paymentPercentage >= maxPercentage) {
                    maxPercentage = paymentPercentage + 1;
                    repairButton = peredachki[i].getElementsByClassName('inv_text_kukla_btn inv_text_kukla_btn_hover')[0].outerHTML;
                }
            }

            if (repairButton) {
                console.log(repairButton);
                let onclickMatch = repairButton.match(/onclick="([^"]*)"/);

                if (onclickMatch) {
                    let onclickAttr = onclickMatch[1];

                    // Use a regular expression to extract the URL
                    let urlMatch = onclickAttr.match(/trade_accept\.php\?tid=[^']+/);

                    if (urlMatch) {
                        let url = urlMatch[0]; // Get the first matched string
                        // Decode the HTML entities
                        url = url.replace(/&amp;/g, '&');
                        console.log(url);
                        // Get the origin of the current page
                        var origin = window.location.origin;

                        // Replace the URL with the origin of the current page
                        var newUrl = origin + '/' + url;

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: newUrl
                        });

                        window.location.reload();

                    } else {
                        console.log('URL not found');
                    }
                }
            }

        }


// Create the control panel for toggling the script, setting priority, and percentage input
// Create the control panel for toggling the script, setting priority, and percentage input
        function createControlPanel() {
            var controlPanel = document.createElement('div');
            controlPanel.style.position = 'fixed';
            controlPanel.style.top = '10px';
            controlPanel.style.right = '10px';
            controlPanel.style.backgroundColor = 'white';
            controlPanel.style.border = '1px solid black';
            controlPanel.style.padding = '10px';
            controlPanel.style.zIndex = '10000';

            // Toggle button
            var toggleButton = document.createElement('button');
            toggleButton.textContent = localStorage.getItem('scriptEnabled') === 'true' ? 'Включен' : 'Виключен';
            toggleButton.onclick = function () {
                var enabled = toggleButton.textContent === 'Виключен';
                toggleButton.textContent = enabled ? 'Включен' : 'Виключен';
                localStorage.setItem('scriptEnabled', enabled);
            };
            controlPanel.appendChild(toggleButton);
            controlPanel.appendChild(document.createElement('br'));

            var rebootTime = document.createElement('button');
            rebootTime.textContent = 'Сброс времени';
            rebootTime.onclick = function () {
                let time = new Date().getTime();
                localStorage.setItem('nextTimeExecution', time);
                window.location.reload();
            };
            controlPanel.appendChild(rebootTime);
            controlPanel.appendChild(document.createElement('br'));

            // Input for repair percentage
            var percentageLabel = document.createElement('label');
            percentageLabel.htmlFor = 'repairPercentageInput';
            percentageLabel.textContent = ' Процент:';
            controlPanel.appendChild(percentageLabel);
            var percentageInput = document.createElement('input');
            percentageInput.type = 'number';
            percentageInput.id = 'repairPercentageInput';
            percentageInput.value = localStorage.getItem('repairPercentage') || '100';
            percentageInput.oninput = function () {
                localStorage.setItem('repairPercentage', percentageInput.value);
            };
            controlPanel.appendChild(percentageInput);
            controlPanel.appendChild(document.createElement('br'));

            document.body.appendChild(controlPanel);
        }

// Main function to execute actions based on the current page
        function main() {
            if (new Date(parseInt(localStorage.getItem("nextTimeExecution"))) > new Date().getTime()) return;
            var scriptEnabled = localStorage.getItem('scriptEnabled') === 'true';
            if (!scriptEnabled) return;
            if (checkAndSetNextExecutionTime()) return;
            handleInventoryPage();
        }

        function checkAndSetNextExecutionTime() {
            var filterTab = document.getElementById('filter_tab6');
            if (filterTab) {
                filterTab.click();
            }
            // Wait a bit for the content to load
            var repairInfo = document.querySelector('div.inventory_repair_info');
            if (repairInfo) {
                var timeStr = repairInfo.textContent;
                let timeLeft = parseTimeToSeconds(timeStr);
                console.log("Time left: " + timeLeft);
                let nextTimeExecution = new Date();
                nextTimeExecution.setSeconds(nextTimeExecution.getSeconds() + timeLeft);
                localStorage.setItem("nextTimeExecution", nextTimeExecution.getTime());
                return true;
            }
            return false;
        }

// Create the control panel on page load
        window.addEventListener('load', function () {
            createControlPanel();
            setInterval(main, 5000);
        });
    }

)
();

