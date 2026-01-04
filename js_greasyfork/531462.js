// ==UserScript==
// @name         Fake Date with Controls
// @namespace    fake-date-script
// @version      1.3
// @description  Set a fake date in your browser globally using Tampermonkey with UI controls
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531462/Fake%20Date%20with%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/531462/Fake%20Date%20with%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we should use real time
    const useRealTime = localStorage.getItem('fakeDate_useRealTime') === 'true';

    // Use a stored date or the default one
    const storedDate = localStorage.getItem('fakeDateValue') || '2025-04-01T00:00:00.000Z';
    let fakeDateValue = storedDate;
    let fakeDate = new Date(fakeDateValue);
    let fakeTimestamp = fakeDate.getTime();
    let baseTime = Date.now(); // Capture the real time when script loads

    // If useRealTime is true, set timeDifference to 0
    let timeDifference = useRealTime ? 0 : (fakeTimestamp - baseTime);
    const OriginalDate = Date;

    function FakeDate(...args) {
        if (args.length === 0) {
            // Return current fake date when no args provided
            return new OriginalDate(OriginalDate.now() + timeDifference);
        }
        return new OriginalDate(...args);
    }

    // Ensure all static methods are properly copied
    FakeDate.now = function() {
        return OriginalDate.now() + timeDifference;
    };

    FakeDate.parse = OriginalDate.parse;
    FakeDate.UTC = OriginalDate.UTC;

    // Properly copy prototype chain
    FakeDate.prototype = OriginalDate.prototype;
    FakeDate.toString = function() { return OriginalDate.toString(); };
    FakeDate[Symbol.species] = OriginalDate;

    // Override Date
    window.Date = FakeDate;

    // Override performance.now() to align with fake date
    if (window.performance && window.performance.now) {
        const originalNow = window.performance.now.bind(window.performance);
        const perfTimeOrigin = performance.timeOrigin || 0;

        window.performance.now = function() {
            return originalNow() + (timeDifference);
        };

        // Update timeOrigin if it exists
        if ('timeOrigin' in window.performance) {
            Object.defineProperty(window.performance, 'timeOrigin', {
                get: function() {
                    return perfTimeOrigin + timeDifference;
                }
            });
        }
    }

    // Add UI functions
    function updateTimeDisplay() {
        const displayElem = document.getElementById('fake-time-display');
        if (displayElem) {
            displayElem.textContent = `Current Time: ${new Date().toLocaleString()}`;
        }

        // Update status indicator
        const statusElem = document.getElementById('time-status');
        if (statusElem) {
            if (useRealTime) {
                statusElem.textContent = '(REAL TIME)';
                statusElem.style.color = '#4CAF50';
            } else {
                statusElem.textContent = '(FAKE TIME)';
                statusElem.style.color = '#f44336';
            }
        }
    }

    // Create control panel when DOM is ready
    function createControlPanel() {
        // Add styles
        const styles = `
            #fake-date-control {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
                width: 280px;
            }
            #fake-date-control button {
                margin-right: 5px;
                margin-top: 5px;
                padding: 5px 10px;
                border-radius: 3px;
                border: 1px solid #ccc;
                background: #f0f0f0;
                cursor: pointer;
            }
            #fake-date-control button:hover {
                background: #e0e0e0;
            }
            #fake-time-display {
                margin-bottom: 5px;
                font-weight: bold;
            }
            #time-status {
                margin-bottom: 10px;
                font-weight: bold;
            }
            #refresh-page {
                background-color: #4CAF50 !important;
                color: white;
            }
            #reset-date {
                background-color: #f44336 !important;
                color: white;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'fake-date-control';
        panel.innerHTML = `
            <div id="fake-time-display">Current Time: ${new Date().toLocaleString()}</div>
            <div id="time-status">${useRealTime ? '(REAL TIME)' : '(FAKE TIME)'}</div>
            <input type="datetime-local" id="fake-date-input">
            <div>
                <button id="set-date">Set Date</button>
                <button id="reset-date">Reset to Real Time</button>
            </div>
            <div>
                <button id="refresh-page">Refresh Page</button>
                <button id="hide-panel">Hide Panel</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Set initial input value
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('fake-date-input').value = `${year}-${month}-${day}T${hours}:${minutes}`;

        // Add event listeners
        document.getElementById('set-date').addEventListener('click', function() {
            const dateInput = document.getElementById('fake-date-input').value;
            if (dateInput) {
                localStorage.setItem('fakeDateValue', new Date(dateInput).toISOString());
                localStorage.setItem('fakeDate_useRealTime', 'false');
                alert('Date set! Click Refresh to apply changes.');
            }
        });

        document.getElementById('reset-date').addEventListener('click', function() {
            localStorage.setItem('fakeDate_useRealTime', 'true');
            alert('Reset to real time! Click Refresh to apply changes.');
        });

        document.getElementById('refresh-page').addEventListener('click', function() {
            window.location.reload();
        });

        document.getElementById('hide-panel').addEventListener('click', function() {
            panel.style.display = 'none';

            // Create show button
            const showButton = document.createElement('button');
            showButton.textContent = useRealTime ? '🕒' : '🕒*';
            showButton.style.position = 'fixed';
            showButton.style.bottom = '10px';
            showButton.style.right = '10px';
            showButton.style.zIndex = '9999';
            showButton.style.padding = '5px 10px';
            showButton.style.borderRadius = '3px';
            showButton.style.border = '1px solid #ccc';
            showButton.style.background = useRealTime ? '#f0f0f0' : '#ffecec';
            showButton.style.cursor = 'pointer';
            showButton.addEventListener('click', function() {
                panel.style.display = 'block';
                showButton.remove();
            });
            document.body.appendChild(showButton);
        });

        // Update time display every second
        setInterval(updateTimeDisplay, 1000);
    }

    // Create control panel once the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        setTimeout(createControlPanel, 500);
    }

    console.log('Fake Date script loaded. Current fake date:', new Date().toISOString(), 'Using real time:', useRealTime);
})();
