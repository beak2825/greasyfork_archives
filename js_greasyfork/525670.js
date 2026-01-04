// ==UserScript==
// @name         RW Hosp Timers
// @namespace    heartflower.torn
// @version      1.0.10
// @description  Puts hospital timers on the ranked warring table with help of the API
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/525670/RW%20Hosp%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/525670/RW%20Hosp%20Timers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Hosp Timer Script Running');

    let memberIntervals = new Map();
    let opponentFaction = false;
    let currentFaction = false;
    let fetchInterval = null;

    let apiKey = '';
    let storedApiKey = localStorage.getItem('hf-public-apiKey');

    if (storedApiKey) {
        apiKey = storedApiKey;
        findElements();
    } else {
        setApiKey();
    }

    function findElements() {
        findElement(document.body, '.enemy-faction');
        findElement(document.body, '.your-faction');
        findElement(document.body, '.opponentFactionName___vhESM');
        findElement(document.body, '.currentFactionName___eq7n8');
        getStarted();
    }

    function getStarted() {
        if (!opponentFaction && !currentFaction) {
            setTimeout(() => getStarted(), 10);
            return;
        }

        let fromTimestamp = Math.floor(Date.now() / 1000);
        fetchApi(opponentFaction, fromTimestamp);
        fetchApi(currentFaction, fromTimestamp);
        setTimer();

        if (fetchInterval) return;

        fetchInterval = setInterval(() => {
            let fromTimestamp = Math.floor(Date.now() / 1000);
            fetchApi(opponentFaction, fromTimestamp);
            fetchApi(currentFaction, fromTimestamp);
        }, 3000);

        setInterval(() => {
            setTimer();
            findDescAsc();
        }, 1000);
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if it's a page chance - if yes, rerun script
    function handleButtonClick(event) {
        let clickedElement = event.target;

        if (clickedElement.classList.contains('status___i8NBb')) {
            let enemy = document.body.querySelector('.enemy-faction');
            let yours = document.body.querySelector('.your-faction');

            let desc = clickedElement.querySelector('.desc___S5bx1');
            let asc = clickedElement.querySelector('.asc___e08kZ');

            if (desc) {
                sortByHospital(enemy, 'desc');
                sortByHospital(yours, 'desc');
            } else if (asc) {
                sortByHospital(enemy, 'asc');
                sortByHospital(yours, 'asc');
            }
        } else {
            let hospital = document.body.querySelector('.hf-hospital');
            if (hospital) return;
            setTimeout(findElements, 50);
        }
    }

    function findDescAsc() {
        let tabMenus = document.body.querySelectorAll('.tabMenuCont___v65Yc');

        let enemy = document.body.querySelector('.enemy-faction');
        let yours = document.body.querySelector('.your-faction');

        tabMenus.forEach(tabMenu => {
            let header = tabMenu.querySelector('.white-grad');
            let status = header.querySelector('.status___i8NBb');

            let desc = status.querySelector('.desc___S5bx1');
            let asc = status.querySelector('.asc___e08kZ');

            let activeIcon = status.querySelector('.activeIcon___pGiua');

            if (activeIcon && desc) {
                sortByHospital(enemy, 'desc');
                sortByHospital(yours, 'desc');
            } else if (activeIcon && asc) {
                sortByHospital(enemy, 'asc');
                sortByHospital(yours, 'asc');
            }
        });
    }

    function setApiKey(force) {
        if (apiKey === '' || force === true) {
            let enterApiKey = prompt('Please enter a public API key');
            if (enterApiKey !== null && enterApiKey.trim() !== '') {
                localStorage.setItem('hf-public-apiKey', enterApiKey);
                alert('API key set succesfully');

                apiKey = enterApiKey;

                GM_registerMenuCommand('Change API key', setApiKey);
                findElement(document.body, '.members-list');
            } else {
                alert('No valid API key entered!');
                GM_registerMenuCommand('Set API key', setApiKey);
            }
        }
    }


    function sortByHospital(element, type) {
        let members = Array.from(element.querySelectorAll('.hf-hospital'));
        if (!members || members.length < 1) {
            setTimeout(() => sortByHospital(element, type), 10);
            return;
        }

        // Separate members with the 'hf-hosp-timestamp' attribute from others
        let membersWithTimestamp = members.filter(member => {
            let status = member.querySelector('.status___i8NBb');
            return status && status.hasAttribute('hf-hosp-timestamp');
        });

        let membersWithoutTimestamp = members.filter(member => {
            let status = member.querySelector('.status___i8NBb');
            return !status || !status.hasAttribute('hf-hosp-timestamp');
        });

        // Sort members with the 'hf-hosp-timestamp' attribute based on 'type'
        membersWithTimestamp.sort((a, b) => {
            let statusA = a.querySelector('.status___i8NBb');
            let statusB = b.querySelector('.status___i8NBb');

            let timestampA = parseInt(statusA.getAttribute('hf-hosp-timestamp'), 10);
            let timestampB = parseInt(statusB.getAttribute('hf-hosp-timestamp'), 10);

            // If type is "desc", sort lowest first, otherwise sort highest first
            if (type === 'desc') {
                return timestampA - timestampB; // Lowest to highest
            } else if (type === 'asc') {
                return timestampB - timestampA; // Highest to lowest
            }
            return 0; // Default to no sorting if type is invalid
        });

        // Separate 'Okay' members from the members without the timestamp
        let okayMembers = membersWithoutTimestamp.filter(member => {
            let status = member.querySelector('.status___i8NBb');
            return status && status.textContent === 'Okay';
        });

        let otherMembersWithoutTimestamp = membersWithoutTimestamp.filter(member => {
            let status = member.querySelector('.status___i8NBb');
            return status && status.textContent !== 'Okay';
        });

        // Combine the sorted members (timestamp members first) and 'Okay' members first
        let finalSortedMembers = [
            ...okayMembers,
            ...membersWithTimestamp,
            ...otherMembersWithoutTimestamp
        ];

        // Reappend sorted members (timestamp members first, then Okay, then others)
        finalSortedMembers.forEach(member => member.parentNode.appendChild(member));
    }



    function fetchApi(factionId, fromTimestamp) {
        if (!window.location.href.includes('rank')) return;

        let apiUrl = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${apiKey}&from=${fromTimestamp}`;

        fetch(apiUrl)
            .then(response => {
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch data. Status: ${response.status} (${response.statusText}). ` +
                    `API URL: ${apiUrl}`
                );
            }
            return response.json();
        })
            .then(data => {
            if (data.error) {
                console.error(`API returned an error. Code: ${data.error.code}, Message: ${data.error.error}.`);
                //alert('API returned an error: ' + data.error.error);
                return;
            }

            let members = data.members;

            let availableMembers = members
            .map(member => ({ id: member.id, until: member.status.until }));

            availableMembers.forEach(({ id, until }) => {
                findMemberId(id, until);
            });

            let travelingMembers = members
            .filter(member => member.status.state == 'Traveling' || member.status.state == 'Abroad')
            .map(member => ({ id: member.id, state: member.status.state }));

            travelingMembers.forEach(({ id, state }) => {
                findMemberId(id, 0, state);
            });

        })
            .catch(error => {
            console.error('Error fetching data: ' + error.message);
            throw error;
        });
    }

    function findMemberId(wantedId, timestamp, flying) {
        let members = document.body.querySelectorAll('.hf-hospital');
        if (!members || members.length < 1) {
            setTimeout(() => findMemberId(wantedId, timestamp), 10);
            return;
        }

        members.forEach(member => {
            let memberId = member.getAttribute('data-hf-userid');

            if (memberId == wantedId) {
                let status = member.querySelector('.status');
                let statusText = status.textContent;

                if (flying) {
                    status.removeAttribute('hf-hosp-timestamp');
                    status.textContent = flying;
                    status.style.color = 'var(--user-status-blue-color)';
                } else if (status) {
                    if (timestamp == null) {
                        status.removeAttribute('hf-hosp-timestamp');

                        if (statusText !== 'Traveling' && statusText !== 'Abroad') {
                            status.textContent = 'Okay';
                            status.style.color = 'var(--user-status-green-color)';
                        }
                    } else {
                        status.setAttribute('hf-hosp-timestamp', timestamp);
                        status.style.color = 'var(--user-status-red-color)';
                    }
                }
            }
        });
    }

    function setTimer() {
        let members = document.body.querySelectorAll('.hf-hospital');
        if (!members || members.length < 1) {
            setTimeout(() => setTimer(), 10);
            return;
        }

        members.forEach(member => {
            let status = member.querySelector('.status');
            if (status) {
                let timestamp = status.getAttribute('hf-hosp-timestamp');

                if (timestamp) {
                    let timeRemaining = calculateTimeRemaining(timestamp);

                    if (timeRemaining.includes('d')) {
                        status.style.fontSize = 'smaller';
                    } else {
                        status.style.fontSize = '';
                    }
                    status.textContent = timeRemaining;
                }
            }
        });
    }

    function calculateTimeRemaining(timestamp) {
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let timeDifference = timestamp - currentTime;

        if (timeDifference <= 0) {
            return "Okay";
        }

        let days = Math.floor(timeDifference / (24 * 60 * 60));
        let hours = Math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((timeDifference % (60 * 60)) / 60);
        let seconds = timeDifference % 60;
        let remainingTime = '';

        // Days
        if (days > 0) {
            remainingTime += `${days}d `;
        }

        // Hours
        if (hours > 0) {
            if (hours < 10) {
                remainingTime += `0`;
            }
            remainingTime += `${hours}:`;
        } else {
            remainingTime += `00:`;
        }

        // Minutes
        if (minutes > 0) {
            if (minutes < 10) {
                remainingTime += `0`;
            }
            remainingTime += `${minutes}:`;
        } else {
            remainingTime += `00:`;
        }

        // Seconds
        if (seconds < 10) {
            remainingTime += `0`;
        }
        remainingTime += `${seconds}`;

        return remainingTime.trim(); // Remove trailing space
    }

    function addMemberId(table, type) {
        let members;
        if (type === 'enemy') {
            members = table.querySelectorAll('.enemy___uiAJH');
        } else if (type === 'yours') {
            members = table.querySelectorAll('.your___yQhKC');
        }

        members.forEach(member => {
            let honorWrap = member.querySelector('.honorWrap___BHau4');
            let link = honorWrap.querySelector('a');
            let href = link.getAttribute('href');
            href = href.replace('/profiles.php?XID=', '');
            member.setAttribute('data-hf-userid', href);

            let status = member.querySelector('.status___i8NBb');
            member.classList.add('hf-hospital');
        });
    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }

        if (className === '.enemy-faction') {
            addMemberId(element, 'enemy');
        } else if (className === '.your-faction') {
            addMemberId(element, 'yours');
        } else if (className === '.opponentFactionName___vhESM') {
            opponentFaction = element.href.replace('https://www.torn.com/factions.php?step=profile&ID=','');
        } else if (className === '.currentFactionName___eq7n8') {
            currentFaction = element.href.replace('https://www.torn.com/factions.php?step=profile&ID=','');
        }
    }

    function addRemoveLink() {
        let links = document.getElementById('top-page-links-list');
        if (!links) {
            setTimeout(() => addRemoveLink(), 100);
            return;
        }

        let existingSpan = document.body.querySelector('.hf-delete-key-link');

        let span;
        if (!existingSpan) {
            span = document.createElement('div');
            span.className = 'hf-delete-key-link';
            span.textContent = '[HF] Delete API Key';
            span.style.lineHeight = '25px';
            span.style.float = 'right';
            span.style.cursor = 'pointer';
            span.style.color = 'var(--default-blue-color)';
            span.style.marginRight = '20px';

            links.appendChild(span);
        } else {
            span = existingSpan;
        }

        span.addEventListener('click', function() {
            removeAPIKey();
        });
    }

    function removeAPIKey() {
        let areYouSure = confirm('[HF - RW Hosp Timers] Are you sure you want to remove your public API key?');
        if (areYouSure) {
            localStorage.removeItem('hf-public-apiKey');
            alert('API key removed!');
        } else {
            alert('API key not removed!');
        }
    }

    addRemoveLink();

})();