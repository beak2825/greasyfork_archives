// ==UserScript==
// @name         Redirect YouTube to WaniKani 30
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Lockout window for WaniKani reviews, prompt for API token if not set, check hourly, and optionally check for lessons. Active only between 5 AM and 11 PM. Opens WaniKani in a new tab and pauses YouTube video. Supports snooze functionality.
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502579/Redirect%20YouTube%20to%20WaniKani%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/502579/Redirect%20YouTube%20to%20WaniKani%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lockoutDiv, lockoutMessage, reviewCounter, triggeredByButton = false;

    // Function to create and show the lockout window
    function showLockoutWindow(reviews) {
        if (!document.body) {
            console.error('Document body not available.');
            return;
        }

        if (!lockoutDiv) {
            lockoutDiv = document.createElement('div');
            lockoutDiv.style.position = 'fixed';
            lockoutDiv.style.top = '0';
            lockoutDiv.style.left = '0';
            lockoutDiv.style.width = '100%';
            lockoutDiv.style.height = '100%';
            lockoutDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            lockoutDiv.style.color = 'white';
            lockoutDiv.style.zIndex = '10000';
            lockoutDiv.style.display = 'flex';
            lockoutDiv.style.flexDirection = 'column';
            lockoutDiv.style.alignItems = 'center';
            lockoutDiv.style.justifyContent = 'center';
            lockoutDiv.style.fontFamily = 'Arial, sans-serif';
            lockoutDiv.style.padding = '20px';
            lockoutDiv.style.boxSizing = 'border-box';

            lockoutMessage = document.createElement('div');
            lockoutMessage.style.fontSize = '24px';
            lockoutMessage.style.marginBottom = '20px';
            lockoutMessage.setAttribute('role', 'alert');
            lockoutMessage.setAttribute('aria-live', 'assertive');
            lockoutDiv.appendChild(lockoutMessage);

            reviewCounter = document.createElement('div');
            reviewCounter.style.fontSize = '18px';
            reviewCounter.style.marginBottom = '30px';
            lockoutDiv.appendChild(reviewCounter);

            let checkApiButton = document.createElement('button');
            checkApiButton.innerText = 'Check API';
            checkApiButton.style.padding = '10px 20px';
            checkApiButton.style.fontSize = '16px';
            checkApiButton.style.cursor = 'pointer';
            checkApiButton.style.backgroundColor = '#2E8B57';
            checkApiButton.style.color = 'white';
            checkApiButton.style.border = 'none';
            checkApiButton.style.borderRadius = '5px';
            checkApiButton.onclick = function() {
                triggeredByButton = true; // Set flag to indicate button click
                checkWaniKani();
            };
            checkApiButton.setAttribute('aria-label', 'Check API for updates');
            lockoutDiv.appendChild(checkApiButton);

            let wanikaniButton = document.createElement('button');
            wanikaniButton.innerText = 'Go to WaniKani';
            wanikaniButton.style.padding = '10px 20px';
            wanikaniButton.style.fontSize = '16px';
            wanikaniButton.style.cursor = 'pointer';
            wanikaniButton.style.backgroundColor = '#4682B4';
            wanikaniButton.style.color = 'white';
            wanikaniButton.style.border = 'none';
            wanikaniButton.style.borderRadius = '5px';
            wanikaniButton.style.marginTop = '10px';
            wanikaniButton.onclick = () => {
                window.open('https://www.wanikani.com', '_blank');
            };
            wanikaniButton.setAttribute('aria-label', 'Go to WaniKani in a new tab');
            lockoutDiv.appendChild(wanikaniButton);

            if (GM_getValue('enableSnooze', true)) {
                let snoozeButton = document.createElement('button');
                snoozeButton.innerText = 'Snooze for 1 hour';
                snoozeButton.style.padding = '10px 20px';
                snoozeButton.style.fontSize = '16px';
                snoozeButton.style.cursor = 'pointer';
                snoozeButton.style.backgroundColor = '#FFA500';
                snoozeButton.style.color = 'white';
                snoozeButton.style.border = 'none';
                snoozeButton.style.borderRadius = '5px';
                snoozeButton.style.marginTop = '10px';
                snoozeButton.onclick = function() {
                    let lastSnooze = GM_getValue('lastSnooze', 0);
                    let now = Date.now();
                    if (now - lastSnooze >= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
                        GM_setValue('lastSnooze', now);
                        removeLockoutWindow();
                        setTimeout(checkWaniKani, 60 * 60 * 1000); // 1 hour in milliseconds
                    } else {
                        alert('Snooze can only be used once every 24 hours.');
                    }
                };
                snoozeButton.setAttribute('aria-label', 'Snooze for 1 hour');
                lockoutDiv.appendChild(snoozeButton);
            }

            document.body.appendChild(lockoutDiv);
            pauseYouTubeVideo(); // Pause the video when the lockout screen appears
        }

        lockoutMessage.innerText = 'Reviews are available! Complete your reviews on WaniKani.';
        reviewCounter.innerText = `Remaining reviews: ${reviews}`;
    }

    // Function to pause the YouTube video
    function pauseYouTubeVideo() {
        const video = document.querySelector('video');
        if (video) {
            video.pause();
        }
    }

    // Function to remove the lockout window
    function removeLockoutWindow() {
        if (lockoutDiv) {
            lockoutDiv.remove();
            lockoutDiv = null;
        }
    }

    // Function to check WaniKani API
    function checkWaniKani() {
        let apiToken = GM_getValue('wanikaniApiToken');
        let checkLessons = GM_getValue('checkLessons', null);
        let enableSnooze = GM_getValue('enableSnooze', null);
        let currentTime = Date.now();
        let currentHour = new Date().getHours();

        if (currentHour < 5 || currentHour >= 23) {
            console.log('Outside of active hours (5 AM to 11 PM). No check performed.');
            scheduleNextCheck(getNextAllowedTime());
            return;
        }

        if (!apiToken) {
            apiToken = prompt('Please enter your WaniKani API token:');
            if (apiToken) {
                GM_setValue('wanikaniApiToken', apiToken);
                GM_setValue('checkLessons', null);
                GM_setValue('enableSnooze', null);
                alert('Your API token is stored. Note: Storing sensitive data in browser storage carries some risk.');
            } else {
                console.error('No API token provided.');
                return;
            }
        }

        if (checkLessons === null || enableSnooze === null) {
            if (checkLessons === null) {
                if (confirm('Would you like to activate lesson checking as well?')) {
                    GM_setValue('checkLessons', true);
                } else {
                    GM_setValue('checkLessons', false);
                }
            }

            if (enableSnooze === null) {
                if (confirm('Would you like to enable the snooze functionality?')) {
                    GM_setValue('enableSnooze', true);
                } else {
                    GM_setValue('enableSnooze', false);
                }
            }

            scheduleNextCheck(getNextAllowedTime());
            return;
        }

        let apiUrl = 'https://api.wanikani.com/v2/assignments?immediately_available_for_review=true';
        if (checkLessons) {
            apiUrl += '&immediately_available_for_lessons=true';
        }

        console.log('API URL:', apiUrl);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Wanikani-Revision': '20170710'
            },
            onload: function(response) {
                try {
                    if (response.status === 401) {
                        console.error('Invalid API token. Please update your token.');
                        GM_setValue('wanikaniApiToken', '');
                        alert('Invalid API token. Please enter a valid token.');
                        return;
                    }

                    const data = JSON.parse(response.responseText);
                    const totalCount = data.total_count;

                    console.log('Total Count:', totalCount);

                    if (totalCount > 0) {
                        showLockoutWindow(totalCount);
                    } else {
                        console.log('No reviews available. Lockout window can be closed.');
                        removeLockoutWindow();
                        if (triggeredByButton) {
                            triggerConfetti(); // Trigger confetti for celebration
                        }
                    }

                    GM_setValue('lastCheck', currentTime);
                    triggeredByButton = false; // Reset flag after API check
                } catch (error) {
                    console.error('Error parsing API response:', error);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data:', error);
            }
        });

        scheduleNextCheck(getNextAllowedTime());
    }

    // Function to schedule the next check at the next allowed time
    function scheduleNextCheck(nextCheckTime) {
        let currentTime = Date.now();
        let timeUntilNextCheck = nextCheckTime.getTime() - currentTime;
        console.log(`Scheduling next check in ${timeUntilNextCheck / 1000} seconds.`);
        setTimeout(checkWaniKani, timeUntilNextCheck);
    }

    // Function to get the next allowed time for checking (5 AM to 11 PM)
    function getNextAllowedTime() {
        let now = new Date();
        let hour = now.getHours();
        now.setMinutes(2, 0, 0); // Ensure the next check is always 2 minutes past the hour
        if (hour < 5) {
            now.setHours(5); // Set to 5:02 AM
        } else if (hour >= 23) {
            now.setHours(5); // Set to 5:02 AM next day
            now.setDate(now.getDate() + 1);
        } else {
            now.setHours(hour + 1); // Next hour at 2 minutes past the hour
        }
        return now;
    }

    // Function to trigger confetti celebration
    function triggerConfetti() {
        const confettiScript = document.createElement('script');
        confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        confettiScript.onload = function() {
            confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 }
            });
        };
        document.body.appendChild(confettiScript);
    }

    // Run the check initially when the document is ready
    window.onload = function() {
        checkWaniKani();
    };
})();