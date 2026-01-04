// ==UserScript==
// @name         Extra Attacking Info Flav
// @namespace    flav.torn.com
// @version      1.2.6
// @description  Show hospital time, online status and more attack buttons on the attacking page
// @author       Flav
// @match        https://www.torn.com/loader.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502267/Extra%20Attacking%20Info%20Flav.user.js
// @updateURL https://update.greasyfork.org/scripts/502267/Extra%20Attacking%20Info%20Flav.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[HF ATTACKING] Inner width: ' + window.innerWidth + ' / Inner height: ' + window.innerHeight);

    let splitMode = window.matchMedia("(max-width: 999px)");
    let mobile = window.matchMedia("(max-width: 600px)");

    let bigButton = false;

    let apiKey = '';
    let storedAPIKey = localStorage.getItem('hf-public-apiKey');

    if (storedAPIKey) {
        apiKey = storedAPIKey;
    }

    // Current user info
    let url = new URL(window.location.href);
    let userID = url.searchParams.get("user2ID");
    let userName = 'Unknown';
    let hospitalTimestamp = 0;
    let status = 'Unknown';

    // Stalker info
    let stalkerModus = false;
    let stalkedUserID = '2619860';
    let stalkedUserName = 'Unknown';
    let stalkerStatus = 'Unknown';
    let hospitalReason = '';

    // Function to add the message
    function enterAPIMessage() {
        let titleContainer = document.querySelector('.titleContainer___QrlWP');
        if (titleContainer) {
            let link = document.createElement('a');
            link.id = 'hf-enter-api';
            link.href = '#'; // Set a placeholder href
            link.textContent = `Click here to enter your (public) API key to load the user's activity and hospital timer.`;
            link.style.display = 'flex';
            link.style.flex = '1';
            link.style.justifyContent = 'end';

            titleContainer.appendChild(link);

            // Add click event listener to the link
            link.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent the default link behavior
                promptAPIKey();
            });
        }
    }

    function promptAPIKey() {
        let enterAPIKey = prompt('Enter a public API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-public-apiKey', enterAPIKey);
            apiKey = enterAPIKey;

            alert('API key set succesfully');

            let APImessage = document.getElementById('hf-enter-api');

            if (APImessage) {
                APImessage.remove();
            }

            runAPIscript();
        } else {
            alert('No valid API key entered!');
        }
    }

    function addCheckbox() {
        let titleContainer = document.querySelector('.titleContainer___QrlWP');
        if (titleContainer) {
            let checkboxDiv = document.createElement('div');
            checkboxDiv.style.paddingLeft = '25px';
            /*
                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = 'button-checkbox';
                        checkbox.style.verticalAlign = 'bottom';
            
                        let span = document.createElement('span');
                        span.textContent = 'Big button';
                        span.style.paddingLeft = '4px';
            
                        checkboxDiv.appendChild(checkbox);
                        checkboxDiv.appendChild(span);
                        */

            if (mobile.matches) {
                let mobileContainer = document.getElementById('hf-eai-mobile-container');
                mobileContainer.appendChild(checkboxDiv);

                checkboxDiv.style.paddingLeft = '0px';
                checkboxDiv.style.paddingBottom = '8px';
                checkboxDiv.style.marginTop = '8px';
            } else {
                titleContainer.appendChild(checkboxDiv);
            }
            /*
                        checkbox.addEventListener('change', handleCheckboxChange);
                        */
        }
    }

    function handleCheckboxChange() {
        let checkbox = document.getElementById('button-checkbox');
        let buttons = document.querySelectorAll('#extra-button');

        bigButton = checkbox.checked;
        buttons.forEach(button => button.remove());
        addButtons();
    }

    // Function to wait for an element to be loaded
    function waitForElement(selector, callback) {
        let el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(function () {
                waitForElement(selector, callback);
            }, 500);
        }
    }

    // Function to either add four small buttons or one big button
    function addButtons() {
        if (bigButton == true) {
            addButton('159px', 'big');
        } else if (bigButton == false) {
            addButton('190px', 'small'); // Primary weapon
            addButton('290px', 'small'); // Secondary weapon
            addButton('390px', 'small'); // Melee weapon
            addButton('490px', 'small'); // Temporary weapon
        }
    }

    // Function to add button
    function addButton(topCoordination, height) {
        let wrapContainer = document.querySelector('.players___eKiHL');
        let originalButton = document.querySelector('.dialogButtons___nX4Bz .torn-btn.btn___RxE8_.silver');

        if (mobile.matches) {
            wrapContainer = document.querySelector('.playersModelWrap___dkqHO');

            let headerWrapper = document.querySelector('.appHeaderWrapper___uyPti');

            let mobileContainer = document.getElementById('hf-eai-mobile-container');

            if (!mobileContainer) {
                let hr = document.createElement('hr')
                hr.className = 'delimiter___zFh2E';

                mobileContainer = document.createElement('div');
                mobileContainer.id = 'hf-eai-mobile-container';

                headerWrapper.appendChild(mobileContainer);
                headerWrapper.appendChild(hr);
            }
        }

        let rightCoordination = '';

        if (wrapContainer && originalButton) {
            let button = document.createElement('button');
            button.id = topCoordination == '390px' ? 'melee-button' : 'extra-button';
            button.type = 'submit';
            button.className = originalButton.className;
            button.setAttribute('i-data', originalButton.getAttribute('i-data'));
            button.textContent = originalButton.textContent;
            button.style.position = 'absolute';
            button.style.top = topCoordination;
            button.style.left = '650px';
            button.style.zIndex = '9999';

            if (height == 'big') {
                button.style.left = '798px';
                button.style.height = '452px';
                button.style.width = '155px';
            }

            // Media query for mobile & split mode
            if (mobile.matches) {
                console.log('mobile');
                if (height == 'small') {
                    button.style.width = '70px';
                    button.style.height = '50px';
                    button.style.lineHeight = 'normal';
                    button.style.left = '5px';

                    if (topCoordination === '190px') {
                        button.style.top = '261px';
                    } else if (topCoordination === '290px') {
                        button.style.top = '337px';
                    } else if (topCoordination === '390px') {
                        button.style.top = '413px';
                    } else if (topCoordination === '490px') {
                        button.style.top = '488px';
                    }
                } else if (height == 'big') {
                    button.style.top = '260px';
                    button.style.left = '5px';
                    button.style.height = '451px';
                    button.style.width = '76px';
                }
            } else if (splitMode.matches) {
                console.log('split');
                if (height == 'small') {
                    button.style.left = '340px';
                } else if (height == 'big') {
                    button.style.top = '155px';
                    button.style.left = '327px';
                    button.style.height = '451px';
                    button.style.width = '143px';
                }
            }

            let preloaderWrap = document.createElement('div');
            preloaderWrap.className = 'preloader-wrap';
            let preloader = document.createElement('div');
            preloader.className = 'dzsulb-preloader preloader-fountain';
            for (let i = 1; i <= 4; i++) {
                let fountainG = document.createElement('div');
                fountainG.id = 'fountainG_' + i;
                fountainG.className = 'fountainG';
                preloader.appendChild(fountainG);
            }
            preloaderWrap.appendChild(preloader);
            button.appendChild(preloaderWrap);

            wrapContainer.appendChild(button);

            // Click event handler for the copied button
            button.addEventListener('click', function (event) {
                // Trigger click event on the actual button
                originalButton.click();

                if (event.target.id === "melee-button") {
                    const clickTime = getRandomInt(50, 100);

                    setTimeout(() => {
                        document.getElementById("weapon_melee").click();
                        document.onkeydown = (event) => {
                            if (event.key === "Enter") {
                                // if mug button exists click that else click melee

                                if ($(".torn-btn.btn___RxE8_.silver").length > 0) {
                                    $(".torn-btn.btn___RxE8_.silver")[1].click();
                                }
                                else {
                                    //Add your Enter event code here, like this.
                                    document.getElementById("weapon_melee").click();
                                }
                            }
                        }

                    }, clickTime);
                }

                // Prevent the default behavior of the copied button
                event.preventDefault();
            });

            if (topCoordination == '390px') {
                document.getElementById("melee-button").focus();

                //$($('.dialogButtons___nX4Bz button')[1]).click()
            }

            // Create a MutationObserver to watch for changes in the original button's classes
            let observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // Update the classes of the copied button to match the original button's classes
                    button.className = originalButton.className;
                });
            });

            // Start observing changes in the original button's classes
            observer.observe(originalButton, { attributes: true, attributeFilter: ['class'] });

            // Create a MutationObserver to watch for changes in the DOM
            let observerDOM = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // If the original button is removed from the DOM, remove the copied button as well
                    if (!document.contains(originalButton)) {
                        button.remove();
                        // Disconnect the observer once the button is removed
                        observer.disconnect();
                        observerDOM.disconnect();
                    }
                });
            });

            // Start observing changes in the DOM
            observerDOM.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Function to fetch the API
    function fetchAPI() {
        let apiUrl = `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}&comment=TryItPage`;

        // Make the API call
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                status = data.last_action.status;
                hospitalTimestamp = data.states.hospital_timestamp;
                hospitalReason = data.status.details;
                userName = data.name;
            })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchStalkerAPI() {
        let apiUrl = `https://api.torn.com/user/${stalkedUserID}?selections=profile&key=${apiKey}&comment=TryItPage`;

        // Make the API call
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                stalkerStatus = data.last_action.status;
                stalkedUserName = data.name;
            })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    // Function to calculate remaining time
    function calculateTimeRemaining() {
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let timeDifference = hospitalTimestamp - currentTime;

        if (timeDifference <= 0) {
            return "Out of hospital";
        }

        let days = Math.floor(timeDifference / (24 * 60 * 60));
        let hours = Math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((timeDifference % (60 * 60)) / 60);
        let seconds = timeDifference % 60;

        let remainingTime = hospitalReason + ': ';

        // Days
        if (days > 0) {
            remainingTime += `${days} ${days === 1 ? 'day' : 'days'}, `;
        }

        // Hours
        if (hours > 0) {
            remainingTime += `${hours} ${hours === 1 ? 'hour' : 'hours'}, `;
        }

        // Minutes
        if (minutes > 0) {
            remainingTime += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, `;
        }

        // Seconds
        remainingTime += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;

        return remainingTime;
    }

    // Create timer element and append to page
    function createTimerElement() {
        let titleContainer = document.querySelector('.titleContainer___QrlWP');
        if (titleContainer) {
            let timerElement = document.createElement('div');
            timerElement.id = 'hospital-timer';
            timerElement.style.display = 'flex';
            timerElement.style.flex = '1';
            timerElement.style.justifyContent = 'right';
            timerElement.style.paddingRight = '25px';

            if (mobile.matches) {
                let mobileContainer = document.getElementById('hf-eai-mobile-container');
                mobileContainer.appendChild(timerElement);

                timerElement.style.paddingRight = '0px';
                timerElement.style.paddingBottom = '8px';
                timerElement.style.justifyContent = '';
            } else {
                titleContainer.appendChild(timerElement);
            }

            updateTimer();
        }
    }

    // Function to update timer display
    function updateTimer(hospitalTimestamp) {
        let timerElement = document.getElementById('hospital-timer');
        if (timerElement) {
            timerElement.innerHTML = calculateTimeRemaining(hospitalTimestamp);
        }
    }

    function addStatus(info) {
        let titleContainer = document.querySelector('.titleContainer___QrlWP');

        if (!titleContainer) {
            return;
        }

        let statusContainer = document.createElement('div');
        statusContainer.style.display = 'flex';
        statusContainer.style.paddingRight = '25px';
        statusContainer.id = 'activity-status';

        if (info == 'stalker') {
            statusContainer.id = 'stalker-status';

            let userNameParagraph = document.createElement('p');
            userNameParagraph.id = 'user-name-paragraph';
            userNameParagraph.textContent = stalkedUserName + ':';
            statusContainer.appendChild(userNameParagraph);
        } else if (info == 'activity') {
            statusContainer.id = 'activity-status';

            if (stalkerModus == true) {
                let userNameParagraph = document.createElement('p');
                userNameParagraph.id = 'user-name-paragraph';
                userNameParagraph.textContent = userName + ':';
                statusContainer.appendChild(userNameParagraph);
            }
        }

        let circle = document.createElement('div');
        circle.id = 'activity-circle';
        circle.style.width = '15px';
        circle.style.height = '15px';
        circle.style.borderRadius = '50px';
        circle.style.marginLeft = '4px';

        let textDiv = document.createElement('div');
        textDiv.id = 'activity-text';
        textDiv.style.alignSelf = 'center';
        textDiv.style.paddingLeft = '5px';

        statusContainer.appendChild(circle);
        statusContainer.appendChild(textDiv);

        if (mobile.matches) {
            statusContainer.style.paddingRight = '0px';
            statusContainer.style.marginBottom = '8px';

            let mobileContainer = document.getElementById('hf-eai-mobile-container');

            if (stalkerModus == true) {
                if (info == 'activity') {
                    statusContainer.style.paddingLeft = '25px';
                }

                let container = document.getElementById('hf-eai-status-container');

                if (!container) {
                    container = document.createElement('div');
                    container.id = 'hf-eai-status-container';
                    container.style.display = 'flex';
                }

                container.appendChild(statusContainer);
                mobileContainer.appendChild(container);

            } else if (stalkerModus == false) {
                mobileContainer.appendChild(statusContainer);
            }

        } else {
            titleContainer.appendChild(statusContainer);
        }

        updateStatus();
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateStatus() {
        let statusElement = document.getElementById('activity-status');
        let stalkerElement = document.getElementById('stalker-status');

        if (statusElement) {
            if (stalkerModus == true) {
                let userNameParagraph = statusElement.querySelector('#user-name-paragraph');
                userNameParagraph.textContent = userName + ':';
                userNameParagraph.style.alignSelf = 'center';
            }

            let circle = statusElement.querySelector('#activity-circle');
            let textDiv = statusElement.querySelector('#activity-text');

            if (status == 'Unknown') {
                circle.style.background = 'purple';
                textDiv.textContent = 'Unknown';
            } else if (status == 'Online') {
                circle.style.background = 'green';
                textDiv.textContent = 'Online';
            } else if (status == 'Idle') {
                circle.style.background = 'orange';
                textDiv.textContent = 'Idle';
            } else if (status == 'Offline') {
                circle.style.background = 'red';
                textDiv.textContent = 'Offline';
            }
        }

        if (stalkerElement) {
            let circle = stalkerElement.querySelector('#activity-circle');
            let textDiv = stalkerElement.querySelector('#activity-text');

            let userNameParagraph = stalkerElement.querySelector('#user-name-paragraph');
            userNameParagraph.textContent = stalkedUserName + ':';
            userNameParagraph.style.alignSelf = 'center';

            if (stalkerStatus == 'Unknown') {
                circle.style.background = 'purple';
                textDiv.textContent = 'Unknown';
            } else if (stalkerStatus == 'Online') {
                circle.style.background = 'green';
                textDiv.textContent = 'Online';
            } else if (stalkerStatus == 'Idle') {
                circle.style.background = 'orange';
                textDiv.textContent = 'Idle';
            } else if (stalkerStatus == 'Offline') {
                circle.style.background = 'red';
                textDiv.textContent = 'Offline';
            }
        }
    }

    function formatCompactNumber(number) {
        if (number < 1000) {
            return number;
        } else if (number >= 1000 && number < 1_000_000) {
            return (number / 1000).toFixed(1) + "K";
        } else if (number >= 1_000_000 && number < 1_000_000_000) {
            return (number / 1_000_000).toFixed(1) + "M";
        } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
            return (number / 1_000_000_000).toFixed(1) + "B";
        } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
            return (number / 1_000_000_000_000).toFixed(1) + "T";
        }
    }

    function waitForStatElement() {
        const BSP_KEY = 'tdup.battleStatsPredictor.cache.prediction.';
        let statsDiv = document.querySelectorAll('div.tt-stats-estimate-attacks');
        if (statsDiv.length > 0) {
            const bspStats = window.localStorage.getItem(BSP_KEY + userID);
            if (bspStats) {
                const userBs = JSON.parse(bspStats).TBS;
                statsDiv[1].innerHTML = formatCompactNumber(userBs);
            }
        } else {
            setTimeout(function () {
                waitForStatElement();
            }, 100);
        }
    }

    function runAPIscript() {
        fetchAPI();
        setInterval(fetchAPI, 30000);
        fetchStalkerAPI();
        setInterval(fetchStalkerAPI, 3000);
        createTimerElement();
        setInterval(updateTimer, 100);

        if (stalkerModus === true) {
            addStatus('stalker');
        }

        addStatus('activity');
        setInterval(updateStatus, 100);


        waitForStatElement();


    }




    // Wait for the coreWrap___LtSEy element to load
    waitForElement('.coreWrap___LtSEy', function (coreWrap) {
        // Wait for the appHeaderWrapper___uyPti element to load
        waitForElement('.appHeaderWrapper___uyPti', function (appHeaderWrapper) {
            // Wait for the topSection___U7sVi element to load
            waitForElement('.playersModelWrap___dkqHO', function (topSection) {
                // Wait for the titleContainer___QrlWP element to load
                waitForElement('.dialogButtons___nX4Bz', function (titleContainer) {
                    // Add the button
                    addButtons();
                    addCheckbox();

                    //$(".dialogButtons___nX4Bz button").focus();

                    if (apiKey == '') {
                        enterAPIMessage();
                    } else {
                        runAPIscript();
                    }
                });
            });
        });
    });


})();