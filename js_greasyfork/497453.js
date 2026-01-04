// ==UserScript==
// @name         Bounty Who
// @namespace    heartflower.torn
// @version      2.0.3
// @description  Filter members based on last action, status and bounties
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/bounties.php?p=add&XID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/497453/Bounty%20Who.user.js
// @updateURL https://update.greasyfork.org/scripts/497453/Bounty%20Who.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Bounty Who Script Running');

    let apiKey = '';
    let storedApiKey = localStorage.getItem('hf-limited-apiKey');
    let currentPage = window.location.href;

    if (storedApiKey) {
        apiKey = storedApiKey;
        if (currentPage.includes('tab=info') || currentPage.includes('faction-info')) {
            findElement(document.body, '.members-list');
        } else if (currentPage.includes('bounties')) {
            let userId = currentPage.replace('https://www.torn.com/bounties.php?p=add&XID=','');
            fetchYataSpy(userId);
        }
    } else {
        setApiKey();
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if it's a page chance - if yes, rerun script
    function handleButtonClick(event) {
        let clickedElement = event.target;

        // Use a slight delay to allow the URL change to occur after the click
        setTimeout(() => {
            let newPage = window.location.href;
            if (newPage === currentPage) {
                return;
            }
            currentPage = newPage;

            if (storedApiKey) {
                apiKey = storedApiKey;
                if (currentPage.includes('factions.php?step=your&type=1#/tab=info')) {
                    findElement(document.body, '.members-list');
                } else if (currentPage.includes('https://www.torn.com/bounties.php?p=add')) {
                    let userId = currentPage.replace('https://www.torn.com/bounties.php?p=add&XID=','');
                    fetchYataSpy(userId);
                }
            } else {
                setApiKey();
            }
        }, 50);

    }

    function setApiKey(force) {
        if (apiKey === '' || force === true) {
            let enterApiKey = prompt('Please enter a limited API key');
            if (enterApiKey !== null && enterApiKey.trim() !== '') {
                localStorage.setItem('hf-limited-apiKey', enterApiKey);
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

    // Find the member container
    function addRunFunctionButton(membersList) {
        let container = membersList.parentNode;

        // Create "Bounty Div" button container
        let div = document.createElement('div');
        div.className = 'hf-run-bounty-filter';
        div.textContent = 'Run bounty filter';
        div.style.marginTop = '10px';
        div.style.padding = '10px';
        div.style.background = 'var(--default-bg-17-gradient)';
        div.style.borderRadius = '5px';
        div.style.cursor = 'pointer';
        div.style.fontWeight = 'bold';

        container.insertBefore(div, container.firstChild);

        // Add event listener so the script runs only on click
        div.addEventListener('click', function() {
            let textContent = div.textContent;
            if (textContent === 'Run bounty filter') {
                // Run the script
                startFiltering(div, membersList);
            } else {
                location.reload();
            }
        });
    }

    // Filter members
    function startFiltering(div, membersList) {
        div.textContent = `Filtering members based on: `

        let span = document.createElement('span');
        span.style.fontWeight = 'normal';
        span.textContent = `(1) Last action: 30+ minutes ago,
                            (2) Currently out of hospital,
                            (3) Not bountied yet`;

        div.appendChild(span);
        div.style.background = 'var(--default-bg-19-gradient)';
        div.title = 'Click to refresh page';

        if (membersList) {
            // Run script
            fetchApi();
            findElement(membersList, '.table-body');
        }
    }

    function fetchApi() {
        let apiUrl = `https://api.torn.com/v2/faction/members?striptags=true&key=${apiKey}`;

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
                alert('API returned an error: ' + data.error.error);
                return;
            }

            let members = data.members;
            let availableMembers = members
            .filter(member =>
                    (member.is_revivable === false || member.is_revivable == 'Unknown') && // Only include members that are not revivable
                    member.status.state === "Okay" && // Only include members with "Okay" status
                    !checkTimestamp(member.last_action.timestamp) // Only include members whose last action was within X minutes
                   )
            .sort((a, b) => b.last_action.timestamp - a.last_action.timestamp) // Sort by timestamp (ascending)
            .map(member => member.id); // Map to get only the IDs

            if (availableMembers.length < 1) {
                let textDiv = document.body.querySelector('.hf-run-bounty-filter');
                textDiv.textContent = 'Nobody to bounty. Good job';
                textDiv.style.background = 'var(--default-bg-18-gradient)';
                return;
            }

            availableMembers.forEach(memberId => {
                findMemberId(memberId);
                darkenUnavailable();
            });

        })
            .catch(error => {
            console.error('Error fetching data: ' + error.message);
            throw error;
        });
    }

    function checkTimestamp(timestamp) {
        let minutes = 30;
        let seconds = minutes * 60;
        let currentTime = Math.floor(Date.now() / 1000);

        let active;
        if ((currentTime - timestamp) > seconds) {
            active = false;
        } else {
            active = true;
        }

        return active;
    }

    function findMemberId(wantedId) {
        let members = document.body.querySelectorAll('.hf-bounty');
        if (!members || members.length < 1) {
            setTimeout(() => findMemberId(wantedId), 10);
            return;
        }

        members.forEach(member => {
            let memberId = member.getAttribute('data-hf-userid');
            if (memberId == wantedId) {
                member.parentNode.insertBefore(member, member.parentNode.firstChild);
                addBountyButton(member, wantedId);
                member.classList.add('hf-verified-bounty');
                member.style.opacity = '';
            }
        });
    }

    function darkenUnavailable() {
        let textDiv = document.body.querySelector('.hf-run-bounty-filter');
        let verified = document.body.querySelectorAll('.hf-verified-bounty');
        if (!verified || verified.length < 1) {
            textDiv.textContent = 'Nobody to bounty. Good job';
            textDiv.style.background = 'var(--default-bg-18-gradient)';
            setTimeout(() => darkenUnavailable, 10);
            return;
        }

        startFiltering(textDiv);

        let members = document.body.querySelectorAll('.table-row');
        members.forEach(member => {
            let memberId = member.getAttribute('data-hf-userid');
            if (memberId == 2080088) {
                member.style.background = 'var(--sidebar-area-bg-attention)';
            }

            if (!member.classList.contains('hf-verified-bounty')) {
                member.style.opacity = '0.5'; // Example: darken by reducing opacity
            }
        });
    }

    function addMemberId(table) {
        let members = table.querySelectorAll('.table-row');
        members.forEach(member => {
            let honorWrap = member.querySelector('.honorWrap___BHau4');
            let link = honorWrap.querySelector('a');
            let href = link.getAttribute('href');
            href = href.replace('/profiles.php?XID=', '');
            member.setAttribute('data-hf-userid', href);

            let bounty = member.querySelector('[id*="icon13"]');
            let hospital = member.querySelector('[id*="icon15"]');
            let traveling = member.querySelector('[id*="icon71"]');
            let edhospital = member.querySelector('[id*="icon82"]');
            if (!hospital && !bounty && !traveling && !edhospital) {
                member.classList.add('hf-bounty');
            }
        });
    }

    function addBountyButton(member, userId) {
        member.parentNode.insertBefore(member, member.parentNode.firstChild);

        let icons = member.querySelector('.member-icons');
        icons.style.display = 'flex';
        icons.style.justifyContent = 'space-between';

        // Create button
        let button = document.createElement('button');
        button.className = 'torn-btn';
        button.textContent = 'Bounty';
        button.style.height = '20px';
        button.style.lineHeight = 'normal';
        button.style.fontSize = '12px';
        button.style.paddingTop = '2.5px';

        icons.appendChild(button);

        button.addEventListener('click', function() {
            let url = `https://www.torn.com/bounties.php?p=add&XID=${userId}`
            window.open(url, '_blank');

            // Remove button and bump member to bottom
            button.remove();
            member.parentNode.appendChild(member);
            member.style.opacity = '50%';
        });
    }

    function fetchYataSpy(userId) {
        const url = `https://yata.yt/api/v1/bs/${userId}?key=${apiKey}`;

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: function(response) {
                response.response ??= JSON.parse(response.responseText); // In order for it to work with Torn PDA
                let stats = response.response[userId].total;

                let money;
                if (stats < 100000000) {
                    money = 300000;
                } else if (stats < 1000000000) {
                    money = 400000;
                } else {
                    money = 500000;
                }

                findElement(document.body, '.add-bounties', money);
            },
            onerror: function(response) {
                console.error('Error sending data:', response);
            }
        });
    }

    function enterBountyMoney(inputDiv, money) {
        let inputs = inputDiv.querySelectorAll('input');

        inputs.forEach(input => {
            input.value = money;

            // Create and dispatch the event
            let event = new Event('input', {
                bubbles: true
            });

            input.dispatchEvent(event);
        });
    }

    // Find an element based on className
    function findElement(parent, className, money) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className, money), 100);
            return;
        }

        if (className === '.members-list') {
            addRunFunctionButton(element);
        } else if (className === '.table-body') {
            addMemberId(element);
        } else if (className === '.add-bounties') {
            findElement(element, '.input-money-group', money);
        } else if (className === '.input-money-group') {
            enterBountyMoney(element, money);
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
        let areYouSure = confirm('[HF - Bounty Who] Are you sure you want to remove your limited API key?');
        if (areYouSure) {
            localStorage.removeItem('hf-limited-apiKey');
            alert('API key removed!');
        } else {
            alert('API key not removed!');
        }
    }

    addRemoveLink();

})();