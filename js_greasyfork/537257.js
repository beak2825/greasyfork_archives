// ==UserScript==
// @name         Torn Flight Helper - Rehab Mode
// @namespace    http://tampermonkey.net/
// @version      0.3
 // @license MIT 
// @description  Travel helper for Torn City rehab trips. Guides to Switzerland and checks funds before traveling.
// @author
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537257/Torn%20Flight%20Helper%20-%20Rehab%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/537257/Torn%20Flight%20Helper%20-%20Rehab%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REHAB_MODE_KEY = 'rehab_mode_active';

    // Helper: wait until an element exists
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 300);
    }

    // Insert Rehab Flight button into Torn sidebar
    function insertFlightHelperButton() {
        const checkExist = setInterval(() => {
            const homeBtn = document.querySelector('#nav-home');
            if (!homeBtn || document.querySelector('#nav-flight-helper')) return;

            const newBtnWrapper = document.createElement('div');
            newBtnWrapper.className = 'area-desktop___bpqAS';
            newBtnWrapper.id = 'nav-flight-helper';

            const innerDiv = document.createElement('div');
            innerDiv.className = 'area-row___iBD8N';

            const a = document.createElement('a');
            a.href = '#';
            a.className = 'desktopLink___SG2RU';
            a.onclick = e => {
                e.preventDefault();
                // Set rehab mode active
                localStorage.setItem(REHAB_MODE_KEY, 'true');
                // Redirect to travel agency
                window.location.href = 'https://www.torn.com/page.php?sid=travel';
            };

            a.innerHTML = `
                <span class="svgIconWrap___AMIqR">
                    <span class="defaultIcon___iiNis mobile___paLva">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </span>
                <span class="linkName___FoKha">Rehab Flight</span>
            `;

            innerDiv.appendChild(a);
            newBtnWrapper.appendChild(innerDiv);
            homeBtn.parentNode.insertBefore(newBtnWrapper, homeBtn.nextSibling);
            clearInterval(checkExist);
        }, 500);
    }

    // Handle travel page actions when rehab mode is active
    function handleTravelPage() {
        const rehabMode = localStorage.getItem(REHAB_MODE_KEY);
        if (rehabMode !== 'true') return;

        // Show popup reminder
        setTimeout(() => {
            alert("Don't forget to withdraw funds!");
        }, 800);

        // Wait for travel pins to appear
        waitForElement('.pin___FilUD', () => {
            const pins = document.querySelectorAll('.pin___FilUD');

            pins.forEach(pin => {
                const isSwitzerland = pin.style.backgroundImage.includes('pinpoints_switzerland');
                if (!isSwitzerland) {
                    pin.style.display = 'none';
                } else {
                    // Highlight Switzerland
                    pin.style.border = '2px solid lime';
                    pin.style.borderRadius = '50%';
                    // Scroll into view
                    pin.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            // Attach event listener to Travel button for Switzerland
            waitForElement('button[aria-label="Travel to Switzerland"]', (travelBtn) => {
                travelBtn.addEventListener('click', handleSwitzerlandTravelClick);
            });
        });

        // We still clear rehab mode here — no infinite mode
        localStorage.removeItem(REHAB_MODE_KEY);
    }

    // When user tries to travel to Switzerland
    function handleSwitzerlandTravelClick(e) {
        e.preventDefault(); // Stop the click temporarily

        const moneyElement = document.querySelector('#user-money');
        if (!moneyElement) {
            alert('Cannot find your money amount. Proceeding anyway.');
            e.target.click();
            return;
        }

        const moneyStr = moneyElement.getAttribute('data-money') || "0";
        const moneyAmount = parseInt(moneyStr.replace(/[^0-9]/g, ''), 10);

        if (isNaN(moneyAmount)) {
            alert('Problem reading your cash. Proceeding anyway.');
            e.target.click();
            return;
        }

        if (moneyAmount < 2500) {
            if (confirm(`You only have $${moneyAmount.toLocaleString()}. Is that enough to rehab?`)) {
                // User says yes — continue normal travel
                e.target.click();
            } else {
                // User says no — redirect to stocks page
                window.location.href = 'https://www.torn.com/page.php?sid=stocks';
            }
        } else {
            // Good money — just proceed
            e.target.click();
        }
    }

    // --- Initialization
    insertFlightHelperButton();

    if (window.location.href.includes('page.php?sid=travel')) {
        handleTravelPage();
    }
})();
