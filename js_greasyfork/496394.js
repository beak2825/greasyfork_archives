// ==UserScript==
// @name         Fetch Stats On Search
// @namespace    heartflower.torn
// @version      1.0.2
// @description  Fetch personal stats (last month, daily, lifetime) on the advanced search page
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/496394/Fetch%20Stats%20On%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/496394/Fetch%20Stats%20On%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let API_KEY = '';
    let storedAPIKey = localStorage.getItem('hf-public-apiKey');

    // Set an empty variable to use later
    let CURRENT_STATS = '';

    if (storedAPIKey) {
        API_KEY = storedAPIKey;
        GM_registerMenuCommand('Change API key', function() { setAPIKey('', true); });
        findUsers();
    } else {
        setAPIKey();
        findUsers();
    }

    // If the page changes, rerun the script
    window.addEventListener('hashchange', findUsers);

    function setAPIKey(user, force) {
        if (API_KEY === '' || force === true) {
            let enterAPIKey = prompt('Please enter a public API key');

            if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
                localStorage.setItem('hf-public-apiKey', enterAPIKey);
                alert('API key set succesfully');

                let buttons = document.body.querySelectorAll('.hf-btn torn-btn');
                buttons.forEach(button => {
                    button.style.background = '';

                    if (user && user !== '') {
                        createContainer(button, user);
                    }
                });

                GM_registerMenuCommand('Change API key', setAPIKey);
            } else {
                alert('No valid API key entered!');
                GM_registerMenuCommand('Set API key', setAPIKey);
            }
        }
    }

    function findUsers() {
        let wrapper = document.body.querySelector('.user-info-list-wrap');
        if (!wrapper) {
            // If the page hasn't fully loaded in yet, try again in a bit
            setTimeout(findUsers, 100);
            return;
        }

        let users = Array.from(wrapper.children).filter(child => !child.classList.contains('last')); // Only fetch children
        if (!users || users.length < 1) {
            // If the page hasn't fully loaded in yet, try again in a bit
            setTimeout(findUsers, 100);
            return;
        }

        users.forEach(user => {
            addButton(user);
        });
    }

    function addButton(user) {
        let icons = user.querySelector('.user-icons');
        icons.style.display = 'inline-flex';
        icons.style.alignItems = 'center';

        let button = document.createElement('button');
        button.className = 'hf-btn torn-btn';
        button.textContent = 'show stats';
        button.style.lineHeight = 'normal';
        button.style.fontSize = '12px';
        button.style.height = '25px';
        button.style.width = '90px';

        icons.appendChild(button);

        if (API_KEY === '') {
            button.style.background = 'var(--default-bg-red-hover-color)';
        }

        button.addEventListener('click', function() {
            if (API_KEY === '') {
                setAPIKey(user);
            } else {
                createContainer(button, user);
            }
        });
    }

    function createContainer(button, user) {
        let userClass = user.className;
        let userID = userClass.replace('user', '');

        if (button.textContent === 'show stats') {
            let stats = document.createElement('div');
            stats.className = 'hf-stats-' + userClass;
            stats.style.padding = '10px';
            stats.style.borderBottom = '1px solid var(--default-panel-divider-outer-side-color)';

            let title = document.createElement('div');
            title.className = 'hf-title-span';
            title.textContent = 'Calling API...';
            title.style.paddingBottom = '5px';
            title.style.fontWeight = 'bold';
            title.style.color = 'var(--default-base-pink-color)';
            stats.appendChild(title);

            let container = document.createElement('div');
            container.className = 'hf-stats-container';
            stats.appendChild(container);

            button.textContent = 'hide stats';
            user.insertAdjacentElement('afterend', stats);

            fetchPersonalStats(userID, container);
        } else {
            let stats = document.body.querySelector('.hf-stats-' + userClass);
            button.textContent = 'show stats';
            stats.remove();
        }
    }

    function fetchPersonalStats(userID, container) {
        let today = new Date();
        let lastMonth = new Date();
        lastMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

        let oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        let days = Math.round(Math.abs((today - lastMonth) / oneDay));

        lastMonth = Math.floor(lastMonth.getTime() / 1000);
        today = Math.floor(today.getTime() / 1000);

        let stats = 'xantaken,useractivity,rankedwarhits,refills,attackswon,respectforfaction';
        let statsArray = stats.split(',');

        statsArray.forEach(stat => {
            let statElement = createStatElement(stat, userID);
            container.appendChild(statElement);
        });

        callAPI(userID, today, stats, 'current', container, days, lastMonth);
    }

    function createStatElement(stat, userID) {
        let div = document.createElement('div');
        div.className = stat + '-' + userID;
        div.style.paddingBottom = '5px';

        let title = document.createElement('span');
        title.style.paddingRight = '5px';
        title.style.fontWeight = 'bold';

        let titles = {
            useractivity: 'User activity: ',
            xantaken: 'Xanax taken: ',
            rankedwarhits: 'Ranked war hits: ',
            refills: 'Refills: ',
            attackswon: 'Attacks won: ',
            respectforfaction: 'Respect for faction: '
        };

        let readableName = titles[stat];
        title.textContent = readableName;
        div.appendChild(title);

        let monthly = document.createElement('span');
        monthly.className = 'monthly'
        monthly.textContent = 'Monthly';
        div.appendChild(monthly);

        let daily = document.createElement('span');
        daily.className = 'daily'
        daily.textContent = '(Daily Average)';
        daily.style.padding = '0px 5px';
        div.appendChild(daily);

        let lifetime = document.createElement('span');
        lifetime.className = 'lifetime'
        lifetime.textContent = '[Lifetime]';
        div.appendChild(lifetime);

        return div;
    }

    function callAPI(userID, timestamp, stats, type, container, days, lastMonth) {
        let apiUrl = `https://api.torn.com/user/${userID}?key=${API_KEY}&timestamp=${timestamp}&stat=${stats}&comment=FetchRecentStats&selections=personalstats`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            // Do something
            let personalstats = data.personalstats;

            let statsArray = stats.split(',');

            if (type === 'current') {
                CURRENT_STATS = personalstats;

                statsArray.forEach(stat => {
                    if (stat === 'useractivity') {
                        let hours = parseInt(parseInt(personalstats[stat]) / 3600).toFixed(2);
                        displayStats(container, stat, userID, hours, 'lifetime');
                    } else {
                        displayStats(container, stat, userID, personalstats[stat], 'lifetime');
                    }

                });

                callAPI(userID, lastMonth, stats, 'previous', container, days);

            } else if (type === 'previous') {
                statsArray.forEach(stat => {
                    let difference = parseInt(CURRENT_STATS[stat]) - parseInt(personalstats[stat]);

                    if (stat === 'useractivity') {
                        let hours = (difference / 3600).toFixed(2);
                        difference = hours;
                    }

                    displayStats(container, stat, userID, difference, 'monthly');
                    let daily = (difference / parseInt(days)).toFixed(2);
                    displayStats(container, stat, userID, daily, 'daily');
                });
            }
        })
            .catch(error => {
            console.error('Error fetching data: ' + error);
            throw error;
        });
    }

    function displayStats(container, stat, userID, amount, type) {
        let parent = container.querySelector(`.${stat}-${userID}`);
        let element = parent.querySelector(`.${type}`);

        if (type === 'lifetime') {
            element.textContent = `[${parseFloat(amount).toLocaleString()}]`;
        } else if (type === 'monthly') {
            element.textContent = `${parseFloat(amount).toLocaleString()}`;
        } else if (type === 'daily') {
            element.textContent = `(${parseFloat(amount).toLocaleString()})`;
            let span = container.parentNode.querySelector('.hf-title-span');
            span.textContent = 'Last Month (Daily Average) [Lifetime]';
        }
    }

})();