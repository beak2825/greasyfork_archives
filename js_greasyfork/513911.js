// ==UserScript==
// @name         Chain. Link. Interruption. Timer.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chain watching thing
// @author       cazy
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=1134973
// @grant        GM_xmlhttpRequest
// @connect      torn.com
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/513911/Chain%20Link%20Interruption%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/513911/Chain%20Link%20Interruption%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
	if (typeof waitOnce === "undefined") {
		waitOnce = true;
	}
	if (typeof interval === "undefined") {
		interval = 300;
	}
	if (typeof maxIntervals === "undefined") {
		maxIntervals = -1;
	}
	var targetNodes = (typeof selectorOrFunction === "function")
			? selectorOrFunction()
			: document.querySelectorAll(selectorOrFunction);

	var targetsFound = targetNodes && targetNodes.length > 0;
	if (targetsFound) {
		targetNodes.forEach(function(targetNode) {
			var attrAlreadyFound = "data-userscript-alreadyFound";
			var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
			if (!alreadyFound) {
				var cancelFound = callback(targetNode);
				if (cancelFound) {
					targetsFound = false;
				}
				else {
					targetNode.setAttribute(attrAlreadyFound, true);
				}
			}
		});
	}

	if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
		maxIntervals -= 1;
		setTimeout(function() {
			waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
		}, interval);
	}
}
    var playing = false;
    let alertSound;
    let triggerMinutes = 1; // default notification trigger at 1 minute left
    let isDropdownOpen = false; // Flag to track if dropdown is open
    let originalChainBar; // To store the original chain bar element
    let menu;
    let pressTimer; // Variable to store press start time
    const longPressThreshold = 500; // Threshold for long press in milliseconds


    /*
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
        sendNotification("Script Error", `${message} at ${source}:${lineno}`);
        return true; // Prevents the error from propagating further
    };
    */

    // Function to create and display the dropdown menu
    function createDropdownMenu() {
        const dropdown = document.createElement('div');
        dropdown.id = 'chain-notify-settings';
        dropdown.style.top = '10vh'; // Set the distance from the top
        dropdown.style.left = '0'; // Align the dropdown to the left edge of the sidebar
        dropdown.style.padding = '10px';
        dropdown.style.background = '#333';
        dropdown.style.color = '#fff';
        dropdown.style.border = '1px solid #555';
        dropdown.style.zIndex = '1000';
        dropdown.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.3)';
        dropdown.style.transition = 'all 0.3s ease';

        const label = document.createElement('label');
        label.innerText = "Set Notification Time (minutes):";
        dropdown.appendChild(label);

        const select = document.createElement('select');
        for (let i = 1; i <= 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            if (i === triggerMinutes) option.selected = true;
            select.appendChild(option);
        }
        select.addEventListener('contextmenu',(event)=>event.stopImmediatePropagation());
        select.addEventListener('change', () => {
            triggerMinutes = parseInt(select.value);
        });
        dropdown.appendChild(select);

        return dropdown;
    }

    // Handle showing and hiding the dropdown menu
    function toggleDropdownMenu(chainBar, content) {
        const existingDropdown = document.getElementById('chain-notify-settings');

        if (isDropdownOpen) {
            menu.replaceWith(originalChainBar);
            isDropdownOpen = false;
        } else {
            originalChainBar = chainBar; // Store the original element
            menu = createDropdownMenu(); // Open dropdown if not present
            menu.addEventListener('contextmenu',(event) => {
                event.preventDefault();
                menu.replaceWith(originalChainBar);
                isDropdownOpen = false;
            });
            chainBar.replaceWith(menu);
            isDropdownOpen = true; // Set flag to track dropdown is open
        }
        return menu;
    }

    // Wait for the chain timer link and add the click event for dropdown
    waitForKeyElements('a.chain-bar___vjdPL', (element) => {
        console.log("Loaded chain bar");
        const chainBar = document.querySelector('a.chain-bar___vjdPL');
        const content = document.querySelector('div.content___GVtZ_');

        // Right-click to toggle settings
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            toggleDropdownMenu(chainBar, content);
        });

        // Long press (auto-trigger after 500ms)
        element.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                const menu = toggleDropdownMenu(chainBar, content); // Toggle settings automatically after 500ms
                menu.addEventListener('mousedown', () => {
                    pressTimer = setTimeout(() => {
                        const menu = toggleDropdownMenu(chainBar, content); // Toggle settings automatically after 500ms
                    }, longPressThreshold); // Set the timer to toggle after the threshold
                });

                menu.addEventListener('mouseup', (event) => {
                    clearTimeout(pressTimer); // Clear the timer if mouseup happens before 500ms
                });
            }, longPressThreshold); // Set the timer to toggle after the threshold
        });

        element.addEventListener('mouseup', (event) => {
            clearTimeout(pressTimer); // Clear the timer if mouseup happens before 500ms
        });




        // Style the chain bar
        chainBar.style.border = '2px solid #b1b14d'; // Add subtle yellow border
        chainBar.style.boxShadow = '0px 0px 10px 2px #b1b14d'; // Add glow effect
    });

    // Function to send notifications
    function sendNotification(title, message) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Chain timer notification logic
    waitForKeyElements("p.bar-timeleft___B9RGV", () => {
        console.log("loaded chain timer");
        setInterval(function() {
            if (playing) return;
            const timerElement = document.querySelector("p.bar-timeleft___B9RGV");

            if (alertSound===undefined){
                alertSound= new Audio("https://dl.sndup.net/6hn2k/really%20loud%20siren.mp3");
                alertSound.onended=() => playing=false;}
            if (timerElement) {
                const timeLeft = timerElement.textContent.trim();
                const [minutes, seconds] = timeLeft.split(":").map(Number);

                if ((minutes < triggerMinutes && seconds < 60) && (minutes!=0 || seconds!=0)) {
                    alertSound.play().catch((error) => {
                        console.log(error);
                        console.log("Interact with the page to allow audio");
                        document.body.querySelectorAll('span.headline-content')[0].children[0].innerHTML =
                            `<span style="color:red;">PLEASE INTERACT WITH THE PAGE TO ALLOW AUDIO TO BE PLAYED</span>`;
                        playing = true;
                        setTimeout(() => { playing = false; }, 5000);
                        return;
                    });
                    playing = true;
                    console.log("playing audio");
                }
            }
        }, 1000); // Check every second
    });

})();
