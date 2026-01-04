// ==UserScript==
// @name         Applications Stats
// @namespace    heartflower.torn
// @version      1.0
// @description  Shows an extra button in the "Applications" tab, upon clicking it, xan/playtime/streak stats for that user will show
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/525899/Applications%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/525899/Applications%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let applicants = {};

    let apiKey = '';
    let storedApiKey = localStorage.getItem('hf-public-apiKey');
    if (storedApiKey) {
        apiKey = storedApiKey;
        if (window.location.href.includes('application')) {
            findElement(document.body, '.applicationListWrapper___XKuvO');
        }
    } else {
        setApiKey();
    }

    let style = document.createElement('style');
    style.innerHTML = `
    @media (max-width: 768px) {
        .lvl___SCpev, .expires___vcX0k {
            display: none !important;
        }

        .view___ImiSB {
            width: 14% !important;
        }

        .hf-stats-header, .hf-stats-cell {
            width: 15% !important;
        }

        .hf-stats-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
    }
    `;

    // Append the style element to the head
    document.head.appendChild(style);

    // Set API key in local storage
    function setApiKey(force) {
        if (apiKey === '' || force === true) {
            let enterApiKey = prompt('Please enter a public API key');
            if (enterApiKey !== null && enterApiKey.trim() !== '') {
                localStorage.setItem('hf-public-apiKey', enterApiKey);
                alert('API key set succesfully');

                apiKey = enterApiKey;

                GM_registerMenuCommand('Change API key', setApiKey);

                if (window.location.href.includes('application')) {
                    findElement(document.body, '.applicationListWrapper___XKuvO');
                }
            } else {
                alert('No valid API key entered!');
                GM_registerMenuCommand('Set API key', setApiKey);
            }
        }
    }

    // Add a new table header called "Stats"
    function addTableHeader(headers) {
        let application = headers.querySelector('.application___h343U');
        application.style.width = '31%';

        let span = document.createElement('span');
        span.className = 'tableCell___lm2Uc hf-stats-header';
        span.textContent = 'Stats';
        span.style.width = '6%';
        span.style.justifyContent = 'center';
        headers.appendChild(span);
    }

    // Add a new row cell with a "stats" button
    function addRowCell(wrapper) {
        let rows = wrapper.querySelectorAll('.rowWrapper___UyTAC');
        if (!rows || rows.length < 1) {
            setTimeout(() => addRowCell(wrapper), 100);
            return;
        }

        rows.forEach(row => {
            let tableRow = row.querySelector('.tableRow___G42km');

            let application = tableRow.querySelector('.application___h343U');
            application.style.width = '31%';

            let cell = document.createElement('div');
            cell.className = 'tableCell___lm2Uc hf-stats-cell';
            cell.style.width = '6%';
            cell.style.justifyContent = 'center';

            let button = createStatisticsSvg();
            button.addEventListener('click', function() {
                if (button.classList.contains('hf-active')) {
                    button.classList.remove('hf-active');
                    let infoWrapper = row.querySelector('.hf-infowrapper');
                    infoWrapper.remove();
                    return;
                }

                button.classList.add('hf-active');

                let honorWrap = tableRow.querySelector('.honorWrap___BHau4');
                let link = honorWrap.querySelector('a');
                let href = link.getAttribute('href');
                let userId = href.replace('/profiles.php?XID=', '');

                fetchStats(userId);
                addInfoWrapper(row, userId);
            });

            cell.appendChild(button);
            tableRow.appendChild(cell);
        });
    }

    // Create the statistics SVG button
    function createStatisticsSvg() {
        // Create the SVG namespace
        let xmlns = "http://www.w3.org/2000/svg";

        // Create the SVG element
        let svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute("class", "default___XXAGt profileButtonIcon");
        svg.setAttribute("fill", "url(#faction)");
        svg.setAttribute("stroke", "#d4d4d4");
        svg.setAttribute("stroke-width", "0");
        svg.setAttribute("width", "46");
        svg.setAttribute("height", "46");
        svg.setAttribute("viewBox", "585.6 178 46 46");
        svg.setAttribute("filter", "var(--faction-default-icon-filter)");
        svg.style.scale = '75%';

        // Create the path element
        let path = document.createElementNS(xmlns, "path");
        path.setAttribute("d", "M600,208h-4v-4h4Zm6,0h-4v-8h4Zm6,0h-4V195h4Zm6,0h-4V189h4Zm1,2H595v2h24Z");

        // Append the path to the SVG
        svg.appendChild(path);

        // Create the button element
        let button = document.createElement('button');
        button.style.cursor = 'pointer';

        // Append the SVG to the button
        button.appendChild(svg);

        return button;
    }

    // Add a container and input all the elements
    function addInfoWrapper(row, userId) {
        let infoWrapper = document.createElement('div');
        infoWrapper.className = 'infoWrapper___Xf9Tf hf-infowrapper';
        infoWrapper.style.display = 'flex';
        infoWrapper.style.justifyContent = 'space-around';

        row.appendChild(infoWrapper);

        addStatsWrapper(infoWrapper, '', 'xantaken');
        addStatsWrapper(infoWrapper, '', 'timeplayed');
        addStatsWrapper(infoWrapper, '', 'activestreak');

        findStats(userId, 'current', 'xantaken');
        findStats(userId, 'daily', 'xantaken');

        findStats(userId, 'current', 'timeplayed');
        findStats(userId, 'daily', 'timeplayed');

        findStats(userId, 'current', 'bestactivestreak');
        findStats(userId, 'daily', 'activestreak');
    }

    // Add an element for each stat
    function addStatsWrapper(infoWrapper, text, stat) {
        let statsWrapper = document.createElement('div');
        statsWrapper.classList.add('hf-stats-wrapper');
        statsWrapper.classList.add('hf-' + stat);
        statsWrapper.style.borderTop = '1px solid var(--default-panel-divider-inner-side-color)';
        statsWrapper.style.padding = '10px';

        let daily = document.createElement('span');
        daily.classList.add('hf-daily-stat');

        let alltime = document.createElement('span');
        alltime.classList.add('hf-alltime-stat');

        if (stat === 'xantaken') {
            daily.textContent = 'fetching xanax / day';
            alltime.textContent = ' (fetching all-time)';
        } else if (stat === 'timeplayed') {
            daily.textContent = 'fetching playtime / day';
            alltime.textContent = ' (fetching all-time)';
            statsWrapper.style.borderRight = '1px solid var(--default-panel-divider-outer-side-color)';
            statsWrapper.style.borderLeft = '1px solid var(--default-panel-divider-outer-side-color)';
        } else if (stat === 'activestreak') {
            daily.textContent = 'fetching current streak';
            alltime.textContent = ' (fetching best)';
            statsWrapper.classList.add('hf-bestactivestreak');
        }

        statsWrapper.appendChild(daily);
        statsWrapper.appendChild(alltime);
        infoWrapper.appendChild(statsWrapper);
    }

    // Find the stats in the script's memory
    function findStats(userId, type, stat) {
        if (
            !applicants[userId] || // Check if user doesn't exist
            Object.keys(applicants[userId] || {}).length === 0 || // Or if the user data is empty
            (!applicants[userId].current && !applicants[userId].lastmonth) // Or if both current and lastmonth are missing
        ) {
            setTimeout(() => findStats(userId, type, stat), 100);
            return;
        }

        if (!applicants[userId].lastmonth || Object.keys(applicants[userId].lastmonth).length === 0) {
            let infoWrapper = document.body.querySelector('.hf-infowrapper');
            infoWrapper.style.padding = '10px';
            infoWrapper.textContent = 'Something went wrong: no data found for user';
            return;
        }

        if (stat === 'bestactivestreak') {
            let best = applicants[userId].current[stat];
            findStatsWrapper('bestactivestreak', best, null);
        } else if (stat === 'activestreak') {
            let current = applicants[userId].current[stat];
            findStatsWrapper(stat, null, current);
        } else if (type === 'daily') {
            let difference = applicants[userId].current[stat] - applicants[userId].lastmonth[stat];
            let daily = parseFloat(difference / applicants[userId].days).toFixed(2);
            findStatsWrapper(stat, null, daily);
        } else if (type === 'current') {
            let total = applicants[userId].current[stat];
            findStatsWrapper(stat, total, null);
        }
    }

    // Figure out where the stats need to be added on the page
    function findStatsWrapper(stat, current, daily) {
        let statsWrapper = document.body.querySelector('.hf-' + stat);
        if (!statsWrapper) {
            setTimeout(() => findStatsWrapper(stat, current, daily), 100);
            return;
        }

        let element;

        if (daily && daily !== 0) {
            element = statsWrapper.querySelector('.hf-daily-stat');
        } else if (current && current !== 0) {
            element = statsWrapper.querySelector('.hf-alltime-stat');
        }

        if (!element) {
            statsWrapper.textContent = 'Error';
            return;
        }

        let text;
        switch (stat) {
            case 'xantaken':
                text = daily ? `${daily} xanax / day` : ` (${current.toLocaleString('en-US')} all-time)`;
                break;
            case 'timeplayed':
                text = daily ? `${parseFloat(daily / 3600).toFixed(2)}h playtime / day` : ` (${parseInt(current / 3600).toLocaleString('en-US')}h all-time)`;
                break;
            case 'activestreak':
                text = `${daily.toLocaleString('en-US')}d current streak`;
                break;
            case 'bestactivestreak':
                text = ` (${current.toLocaleString('en-US')}d best)`;
                break;
        }

        if (text) {
            element.textContent = text;
        }
    }

    // Fetch personal stats for a certain user ID
    function fetchStats(userId) {
        let today = new Date();
        let todaytimestamp = Math.floor(today.getTime() / 1000);

        let lastMonth = new Date();
        lastMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
        let lastmonthtimestamp = Math.floor(lastMonth.getTime() / 1000);

        let oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        let days = Math.round(Math.abs((today - lastMonth) / oneDay));

        fetchApi(userId, 'current', todaytimestamp, days);
        fetchApi(userId, 'lastmonth', lastmonthtimestamp);
    }

    // Fetch the api for certain personal stats for a certain user ID and timestamp
    function fetchApi(userId, type, timestamp, days) {
        let stats;
        if (type === 'current') {
            stats = 'xantaken,timeplayed,activestreak,bestactivestreak';
        } else if (type === 'lastmonth') {
            stats = 'xantaken,timeplayed';
        }

        let apiUrl = `https://api.torn.com/v2/user/${userId}/personalstats?stat=${stats}&timestamp=${timestamp}&key=${apiKey}`;

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

            let result = {};
            data.personalstats.forEach(stat => {
                result[stat.name] = stat.value;
            });

            // Initialize the userId object if it doesn't exist
            if (!applicants[userId]) {
                applicants[userId] = {};
            }

            // Save the result under the correct type
            if (type === 'current') {
                applicants[userId].current = result;
                applicants[userId].days = days;
            } else if (type === 'lastmonth') {
                applicants[userId].lastmonth = result;
            }
        })
            .catch(error => {
            console.error('Error fetching data: ' + error.message);
            throw error;
        });
    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }

        if (className === '.applicationListWrapper___XKuvO') {
            findElement(element, '.tableHeader___aUfYy');
            findElement(element, '.rowsWrapper___RuEaw');
        } else if (className === '.tableHeader___aUfYy') {
            addTableHeader(element);
        } else if (className === '.rowsWrapper___RuEaw') {
            addRowCell(element);
        }
    }

})();