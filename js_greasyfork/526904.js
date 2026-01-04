// ==UserScript==
// @name         View Listings Anytime
// @namespace    heartflower.torn
// @version      1.0.1
// @description  View your listings on the Points Market, Bazaar and Item Market even when the page is unavailable!
// @author       Heartflower [2626587]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544333/View%20Listings%20Anytime.user.js
// @updateURL https://update.greasyfork.org/scripts/544333/View%20Listings%20Anytime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change these variables if you don't want to use parts of the script
    let bazaar = true;
    let itemmarket = true;
    let pointsmarket = true;
    let listings = true;

    console.log('[HF] View Listings Running');

    let apiKey;
    let storedAPIKey = localStorage.getItem('hf-full-access-apiKey');

    if (storedAPIKey) {
        apiKey = storedAPIKey;
        if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
    } else {
        setAPIkey();
    }

    // VARIABLES TO USE LATER //
    let maximumCalls = 40;
    let apiCallCount = 0;
    let itemIDs = [];
    let itemUIDs = [];
    let userName = 'Unknown';
    let userID = '';
    let personalListings = [];
    let timestamp = 0;
    let hospitalTimestamp = 0;


    // API SETTINGS //

    function setAPIkey() {
        let enterAPIKey = prompt('Enter a full access API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-full-access-apiKey', enterAPIKey);
            alert('API key set succesfully');

            apiKey = enterAPIKey;

            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
        } else {
            alert('No valid API key entered!');

            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Set API key', setAPIkey);
        }
    }

    function removeAPIKey() {
        let wantToDelete = confirm('Are you sure you want to remove your API key?');

        if (wantToDelete) {
            localStorage.removeItem('hf-full-access-apiKey');
            alert('API key successfully removed.');
        } else {
            alert('API key not removed.');
        }
    }

    function createAPIlink(type, retries = 30) {
        let existingLink = document.body.querySelector('.hf-api-link');
        if (existingLink) existingLink.remove();

        let titleContainer = document.body.querySelector('.content-title');
        if (!titleContainer) titleContainer = document.body.querySelector('.info-msg');
        if (!titleContainer) {
            if (retries > 0) {
                setTimeout(() => createAPIlink(type, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for title container after 30 retries.');
            }
            return;
        }

        let msg = document.body.querySelector('.info-msg .msg');

        // Create the link to remove / add API key
        let div = document.createElement('div');
        if (msg) div = document.createElement('span');
        div.className = 'hf-api-link';
        div.style.marginLeft = '4px';
        div.style.marginBottom = '10px';
        div.style.color = 'var(--default-blue-color)';
        div.style.cursor = 'pointer';

        if (type === 'remove') {
            div.textContent = 'Remove your full access API key';

            div.addEventListener('click', function() {
                removeAPIKey();
            });
        } else if (type === 'add') {
            div.textContent = 'Enter your full access API key';

            div.addEventListener('click', function() {
                setAPIkey();
            });
        }

        if (msg) {
            msg.appendChild(div)
        } else {
            titleContainer.parentNode.insertBefore(div, titleContainer.nextSibling);
        }
    }



    // SIDEBAR //

    function createContainer(type, retries = 30) {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        if (mobile) {
            let headerMenu = document.body.querySelector('.leftMenu___md3Ch');
            createObserver(headerMenu);
            return;
        }

        let existingButton = document.body.querySelector(`.hf-view-listings-container-${type}`);
        if (existingButton) return;

        let toggleBlocks = document.body.querySelectorAll('.toggle-block___oKpdF');
        if (!toggleBlocks || toggleBlocks.length < 3) {
            if (retries > 0) {
                setTimeout(() => createContainer(type, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for sidebar after 30 retries.');
            }
            return;
        }

        let container = toggleBlocks[2].querySelector('.toggle-content___BJ9Q9');
        let classes = container.querySelector('div').classList;

        let listingsContainer = document.createElement('div');
        listingsContainer.classList.add(...classes);
        listingsContainer.classList.add(`hf-view-listings-container-${type}`);
        container.appendChild(listingsContainer);

        let titleDiv = document.createElement('div');
        titleDiv.textContent = `My ${type} Listings`;
        titleDiv.classList.add('area-row___iBD8N');
        titleDiv.style.padding = '5px 10px';
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.display = 'flex';
        titleDiv.style.justifyContent = 'space-between';
        listingsContainer.appendChild(titleDiv);

        if (type === 'Bazaar') {
            titleDiv.style.background = 'var(--title-msg-blue-gradient)';
        } else if (type === 'Market') {
            titleDiv.style.background = 'var(--title-msg-green-gradient)';
        }

        let arrow = document.createElement('span');
        arrow.textContent = '►';
        titleDiv.appendChild(arrow);

        titleDiv.addEventListener('click', function() {
            let arrowText = arrow.textContent;
            if (arrowText === '►') {
                arrow.textContent = '▼';

                showListings(type, listingsContainer);
            } else {
                arrow.textContent = '►';

                let scrollArea = listingsContainer.querySelector('.hf-view-listing-scrollarea');
                scrollArea.remove();
            }
        });
    }

    async function showListings(type, listingsContainer) {
        let scrollArea = document.createElement('div');
        scrollArea.classList.add('scrollarea', 'scroll-area___zOH66', 'hf-view-listing-scrollarea')
        listingsContainer.appendChild(scrollArea);

        let content = document.createElement('div');
        content.classList.add('scrollarea-content');
        scrollArea.appendChild(content);

        let ul = document.createElement('ul');
        ul.classList.add('list___NuD9d');
        ul.style.listStyle = 'disc';
        content.appendChild(ul);

        if (type === 'Bazaar') {
            fetchBazaar(ul);
        } else if (type === 'Market') {
            fetchMarket(ul);
        }

        let scrollbarContainer = document.createElement('div');
        scrollbarContainer.classList.add('scrollbar-container', 'vertical');
        scrollArea.appendChild(scrollbarContainer);

        let scrollbar = document.createElement('div');
        scrollbar.classList.add('scrollbar');
        scrollbarContainer.appendChild(scrollbar);

        // Scroll container setup
        let scrollTop = 0;

        let scrollAreaHeight = scrollArea.clientHeight;
        let contentHeight = content.scrollHeight;
        let scrollbarHeight = (scrollAreaHeight / contentHeight) * scrollAreaHeight;

        // Minimum height for usability
        scrollbarHeight = Math.max(scrollbarHeight, 140);
        scrollbar.style.height = `${scrollbarHeight}px`;

        function updateScroll() {
            const maxScrollContent = Math.max(0, content.scrollHeight - scrollArea.clientHeight);
            const maxScrollBar = Math.max(0, scrollArea.clientHeight - scrollbar.clientHeight);

            // Clamp scrollTop within bounds
            scrollTop = Math.min(Math.max(0, scrollTop), maxScrollContent);

            // Move content and scrollbar
            content.style.transform = `translateY(-${scrollTop}px)`;
            let scrollbarOffset = scrollTop / maxScrollContent * maxScrollBar || 0;
            scrollbar.style.transform = `translateY(${scrollbarOffset}px)`;
        }

        // Mouse wheel scrolling
        scrollArea.addEventListener('wheel', (e) => {
            e.preventDefault();

            // Optional: clamp delta speed
            let delta = Math.max(-60, Math.min(60, e.deltaY));

            const maxScrollContent = Math.max(0, content.scrollHeight - scrollArea.clientHeight);
            scrollTop = Math.min(Math.max(0, scrollTop + delta), maxScrollContent);

            updateScroll();
        });

        // Drag to scroll
        let isDragging = false;
        let dragStartY = 0;
        let initialScrollTop = 0;

        scrollbar.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            dragStartY = e.clientY;
            initialScrollTop = scrollTop;
            document.body.style.userSelect = 'none'; // Prevent text selection
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaY = e.clientY - dragStartY;
            const maxScrollContent = Math.max(0, content.scrollHeight - scrollArea.clientHeight);
            const maxScrollBar = Math.max(0, scrollArea.clientHeight - scrollbar.clientHeight);

            const scrollRatio = maxScrollContent / maxScrollBar;
            scrollTop = Math.min(Math.max(0, initialScrollTop + deltaY * scrollRatio), maxScrollContent);

            updateScroll();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });

        // Touch to scroll (mobile support)
        let touchStartY = 0;
        let touchInitialScrollTop = 0;

        scrollArea.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            touchStartY = e.touches[0].clientY;
            touchInitialScrollTop = scrollTop;
        }, { passive: false });

        scrollArea.addEventListener('touchmove', (e) => {
            if (!scrollArea.contains(e.target)) return;

            if (e.touches.length !== 1) return;
            e.preventDefault(); // prevent native scrolling

            const deltaY = touchStartY - e.touches[0].clientY;
            const maxScrollContent = Math.max(0, content.scrollHeight - scrollArea.clientHeight);
            scrollTop = Math.min(Math.max(0, touchInitialScrollTop + deltaY), maxScrollContent);

            updateScroll();
        }, { passive: false });

    }

    async function createList(type, ul, data, refreshed, mobile) {
        if (refreshed) {
            let lists = ul.querySelectorAll('li');
            for (let list of lists) {
                list.remove();
            }
        }

        for (let item of data) {
            let name = 'Unknown';
            let qty = 0;
            let price = 0;

            if (type === 'Bazaar') {
                name = item.name;
                // id = item.id;
                // img_src = `images/items/${id}/medium.png`;
                qty = item.quantity;
                price = item.price;
            } else if (type === 'Market') {
                name = item.item.name;
                qty = item.amount;
                price = item.price;
            }

            let totalPrice = price * qty;

            let li = document.createElement('li');
            li.style.margin = '0px 22px';
            li.style.display = 'list-item';
            li.style.padding = '0px';
            li.style.cursor = 'auto';
            li.style.height = 'auto';
            li.style.lineHeight = 'normal';
            li.style.marginBottom = '4px';
            li.textContent = `${name} (${qty})`;
            li.title = `$${totalPrice.toLocaleString('en-US')}`;
            ul.appendChild(li);
        }

        if (refreshed) {
            let span = ul.querySelector('.hf-refresh-span');
            ul.appendChild(span);
            return;
        }

        let refresh = document.createElement('span');
        refresh.classList.add('hf-refresh-span');
        refresh.textContent = 'Refresh my listings';
        refresh.style.marginTop = '4px';
        refresh.style.marginLeft = '8px';
        refresh.style.color = 'var(--default-blue-color)';
        refresh.style.cursor = 'pointer';
        refresh.style.paddingBottom = '8px';
        ul.parentNode.appendChild(refresh);

        refresh.addEventListener('click', function() {
            if (type === 'Bazaar') {
                fetchBazaar(ul, true);
            } else if (type === 'Market') {
                fetchMarket(ul, true);
            }
        });
    }

    function createMobileMenu(ul) {
        let existingMenu = document.body.querySelector('.hf-view-listings-menu');
        if (existingMenu) return;

        let li = document.createElement('li');
        li.classList.add('menu-item-link');
        li.classList.add('hf-view-listings-menu');
        li.style.paddingLeft = '12px';
        li.style.color = 'var(--default-color)';
        li.textContent = 'View Listings';
        ul.appendChild(li);

        li.addEventListener('click', function() {
            window.open('https://www.torn.com/hf-viewlistings', '_self');
        });
    }

    function changeMobilePage(retries = 30) {
        let title = document.body.querySelector('#skip-to-content');
        if (!title) {
            if (retries > 0) {
                setTimeout(() => changeMobilePage(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for title after 30 retries.');
            }
            return;
        }

        title.textContent = 'View Listings';

        let contentWrapper = document.body.querySelector('.content-wrapper');

        let errorWrap = contentWrapper.querySelector('.error-404');
        errorWrap.remove();

        let div = document.createElement('div');

        contentWrapper.appendChild(div);

        showMobileListings('Market', div);
        showMobileListings('Bazaar', div)
    }

    function showMobileListings(type, div) {
        let existingContainer = document.body.querySelector(`hf-listings-container-${type}`);
        if (existingContainer) return;

        let container = document.createElement('div');
        container.classList.add(`hf-listings-container-${type}`);

        let titleDiv = document.createElement('div');
        titleDiv.style.background = 'var(--title-msg-blue-gradient)';
        titleDiv.style.padding = '6px';
        titleDiv.style.borderRadius = '5px';
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.display = 'flex';
        titleDiv.style.justifyContent = 'space-between';
        titleDiv.style.alignItems = 'center';
        container.appendChild(titleDiv);

        let title = document.createElement('span');
        titleDiv.appendChild(title);

        let refresh = document.createElement('span');
        refresh.classList.add('link-icon-svg', 'refresh');
        refresh.innerHTML = `<svg style="width: 15px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14.47"><defs><style>.cls-1{opacity:0.35;}.cls-2{fill:var(--default-color);}.cls-3{fill:var(--default-color);}</style></defs><g id="Слой_2" data-name="Слой 2"><g id="icons"><g class="cls-1"><path class="cls-2" d="M1.68,7.74A5.05,5.05,0,0,1,11.5,6.05H8.42l3.84,4L16,6.05H13.26A6.74,6.74,0,1,0,11,13l-1.06-1.3A5.06,5.06,0,0,1,1.68,7.74"></path></g><path class="cls-3" d="M1.68,6.74A5.05,5.05,0,0,1,11.5,5.05H8.42l3.84,4L16,5.05H13.26A6.74,6.74,0,1,0,11,12l-1.06-1.3A5.06,5.06,0,0,1,1.68,6.74"></path></g></g></svg>`
        refresh.style.cursor = 'pointer';
        titleDiv.appendChild(refresh);

        refresh.addEventListener('click', function() {
            if (type === 'Bazaar') {
                fetchBazaar(ulContainer, true, true);
            } else if (type === 'Market') {
                fetchMarket(ulContainer, true, true);
            }
        });

        if (type === 'Market') {
            title.textContent = 'Item Market';
        } else if (type === 'Bazaar') {
            title.textContent = 'Bazaar';
            container.style.paddingTop = '20px';
        }

        let ulContainer = document.createElement('div');
        ulContainer.style.display = 'flex';
        ulContainer.style.justifyContent = 'space-between';

        if (type === 'Bazaar') {
            fetchBazaar(ulContainer, null, true);
        } else if (type === 'Market') {
            fetchMarket(ulContainer, null, true);
        }

        container.appendChild(ulContainer);
        div.appendChild(container);
    }

    function createMobileList(type, container, data, refreshed) {
        if (refreshed) {
            let uls = container.querySelectorAll('ul');
            for (let ul of uls) {
                ul.remove();
            }
        }

        let leftUl = document.createElement('ul');
        leftUl.style.listStyle = ('disc');
        leftUl.style.padding = '8px 0px 0px 20px';
        leftUl.style.flex = '1';
        container.appendChild(leftUl);

        let rightUl = document.createElement('ul');
        rightUl.style.listStyle = ('disc');
        rightUl.style.padding = '8px 0px 0px 20px';
        rightUl.style.flex = '1';
        container.appendChild(rightUl);

        data.forEach((item, index) => {
            let name = type === 'Bazaar' ? item.name : item.item.name;
            let qty = type === 'Bazaar' ? item.quantity : item.amount;
            let price = item.price;
            let totalPrice = qty * price;

            let li = document.createElement('li');
            li.textContent = `${name} (${qty})`;
            li.title = `$${totalPrice.toLocaleString('en-US')}`;
            li.style.marginBottom = '4px';

            (index % 2 === 0 ? leftUl : rightUl).appendChild(li);
        });
    }



    // POINTS MARKET //

    function pointsMarketPage(retries = 30) {
        let contentWrapper = document.body.querySelector('.content-wrapper');
        if (!contentWrapper) {
            if (retries > 0) {
                setTimeout(() => pointsMarketPage(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for content wrapper after 30 retries.');
            }
            return;
        }

        let brokenWindow = document.body.querySelector('.error-404');
        if (brokenWindow) brokenWindow.remove();

        let messageContainer = document.body.querySelector('.info-msg');
        let message = messageContainer.querySelector('.msg');
        let messageContent = 'This area is unavailable';
        if (message) messageContent = message.textContent;
        if (!messageContent.includes('This area is unavailable')) return;

        let originalTitle = document.querySelector('h4#skip-to-content');
        if (originalTitle) originalTitle.parentNode.remove();

        // Create the points market title as it's not usually there
        let titleContainer = document.createElement('div');

        let title = document.createElement('p');
        title.id = 'hf-pmv-title';
        title.textContent = 'Points Market';

        // Add a line break after the title
        let hrElement = document.createElement('hr');
        hrElement.className = 'page-head-delimiter m-top10 m-bottom10';

        titleContainer.appendChild(title);
        titleContainer.appendChild(hrElement);
        contentWrapper.insertBefore(titleContainer, contentWrapper.firstChild);

        // Change the message
        if (message) message.innerHTML = `The points market is fetched by the <p style='font-style:italic; display:inline'>View Listings Anytime</p> script with the help of the API!`;
        if (messageContainer) messageContainer.style.background = 'rgb(85,137,33)';

        fetchLogs();
        fetchHospitalTime();
        createAPIlink('remove');
    }


    // Fetch and display the time remaining in the hospital
    function changeTimer(data, messageContainer, message) {
        let status = data.status;
        hospitalTimestamp = status.until;

        let timeRemaining = 0;

        let timerElement = document.createElement('div');
        timerElement.id = 'hf-pmv-hospital-timer';
        timerElement.style.display = 'inline';
        timerElement.style.paddingLeft = '4px';

        message.insertBefore(timerElement, message.lastChild);

        updateTimer();
        setInterval(updateTimer, 100);

    }

    // Function to calculate remaining time
    function calculateTimeRemaining() {
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let timeDifference = hospitalTimestamp - currentTime;
        if (timeDifference <= 0) return "You're out of the hospital!";

        let days = Math.floor(timeDifference / (24 * 60 * 60));
        let hours = Math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((timeDifference % (60 * 60)) / 60);
        let seconds = timeDifference % 60;

        let remainingTime = "You will be out of the hospital in ";
        if (days > 0) remainingTime += `${days} ${days === 1 ? 'day' : 'days'}, `;
        if (hours > 0) remainingTime += `${hours} ${hours === 1 ? 'hour' : 'hours'}, `;
        if (minutes > 0) remainingTime += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and `;
        remainingTime += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        remainingTime += '.';

        return remainingTime;
    }

    // Function to update timer display
    function updateTimer(hospitalTimestamp) {
        let timerElement = document.getElementById('hf-pmv-hospital-timer');
        if (timerElement) {
            timerElement.textContent = calculateTimeRemaining(hospitalTimestamp);
        }
    }

    // Create the table
    function createPointsTable(data) {
        let contentWrapper = document.body.querySelector('.content-wrapper');
        if (!contentWrapper) return;

        let existingContainer = document.getElementById('hf-pmv-table');
        if (existingContainer) return;

        let tableRows = [];

        // Sort listing IDs by cost
        for (let listingID in data) {
            let listing = data[listingID];
            let cost = listing.cost;
            let quantity = listing.quantity;
            let totalCost = listing.total_cost;

            let row = {
                listingID: listingID,
                cost: cost,
                quantity: quantity,
                totalCost: totalCost
            };

            tableRows.push(row);
        }

        tableRows.sort((a, b) => a.cost - b.cost);

        // Create the table container
        let table = document.createElement('ul');
        table.id = 'hf-pmv-table';

        // Create the header row
        let headerRow = document.createElement('li');
        headerRow.className = 'hf-pmv-table-header';
        createPointsTableCell(headerRow, 'hf-pmv-cost', 'Cost');
        createPointsTableCell(headerRow, 'hf-pmv-qty', 'Quantity');
        createPointsTableCell(headerRow, 'hf-pmv-total', 'Total');
        table.appendChild(headerRow);

        // Loop through every listingID to fetch the necessary info
        for (let i = 0; i < tableRows.length; i++) {
            let row = tableRows[i];
            let numericListingID = parseInt(row.listingID);

            // Check if the listing ID is part of the personal listings fetched from the logs
            if (personalListings.includes(numericListingID)) {
                createPointsTableRow(table, 'self', row.listingID, row.cost, row.quantity, row.totalCost);
            } else {
                createPointsTableRow(table, 'other', row.listingID, row.cost, row.quantity, row.totalCost);
            }
        }

        contentWrapper.appendChild(table);
    }

    // Create a table row with the necessary data
    function createPointsTableRow(table, info, listingID, cost, quantity, totalCost) {
        let tableRow = document.createElement('li');
        tableRow.id = 'hf-pmv-' + listingID;
        tableRow.className = 'hf-pmv-table-row';

        let costText = cost.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0});
        createPointsTableCell(tableRow, 'hf-pmv-cost', costText)

        let quantityText = quantity.toLocaleString('en-US');
        createPointsTableCell(tableRow, 'hf-pmv-qty', quantityText)

        let totalCostText = totalCost.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0});
        createPointsTableCell(tableRow, 'hf-pmv-total', totalCostText)

        table.appendChild(tableRow);

        if (info === 'self') {
            tableRow.style.background = 'rgba(85,137,33,.5)';
        }
    }

    // Create a table cell with the necessary data
    function createPointsTableCell(tableRow, className, textContent) {
        let span = document.createElement('span');
        span.className = className;
        span.textContent = textContent;
        tableRow.appendChild(span);
    }

    // Add a refresh button
    function addRefreshButton() {
        let existingButton = document.getElementById('hf-refresh');
        if (existingButton) return;

        let timer = document.getElementById('hf-refresh-timer');
        if (timer) timer.remove();

        let title = document.getElementById('hf-pmv-title');

        let refreshButton = document.createElement('button');
        refreshButton.id = 'hf-refresh';
        refreshButton.style.float = 'right';
        refreshButton.innerHTML = `<svg class="hf-refresh-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14.47"><defs><style>.cls-1{opacity:0.35;}.cls-2{fill:#fff;}.cls-3{fill:#777;}</style></defs><g id="Слой_2" data-name="Слой 2"><g id="icons"><g class="cls-1"><path class="cls-2" d="M1.68,7.74A5.05,5.05,0,0,1,11.5,6.05H8.42l3.84,4L16,6.05H13.26A6.74,6.74,0,1,0,11,13l-1.06-1.3A5.06,5.06,0,0,1,1.68,7.74"></path></g><path class="cls-3" d="M1.68,6.74A5.05,5.05,0,0,1,11.5,5.05H8.42l3.84,4L16,5.05H13.26A6.74,6.74,0,1,0,11,12l-1.06-1.3A5.06,5.06,0,0,1,1.68,6.74"></path></g></g></svg>`;

        title.appendChild(refreshButton);

        // Add event listener to the button
        refreshButton.addEventListener('click', function() {
            location.reload();
        });

        let cls2 = refreshButton.querySelector('.cls-2');
        let cls3 = refreshButton.querySelector('.cls-3');

        // Add event listeners for hover
        refreshButton.addEventListener('mouseenter', function() {
            refreshButton.style.color = 'var(--default-blue-color)';
            cls2.style.fill = 'var(--default-blue-color)';
            cls3.style.fill = 'var(--default-blue-color)';
        });

        refreshButton.addEventListener('mouseleave', function() {
            refreshButton.style.color = 'var(--default-color)';
            cls2.style.fill = 'var(--default-color)';
            cls3.style.fill = 'var(--default-color)';
        });
    }

    // Add a timer to count down to refresh time
    function addTimer() {
        let refreshTimestamp = timestamp + 30;

        let intervalID = setInterval(() => {
            let currentTimestamp = Math.floor(Date.now() / 1000);
            let remainingTime = refreshTimestamp - currentTimestamp;

            if (remainingTime <= 0) {
                clearInterval(intervalID);
                addRefreshButton();
                return;
            }

            let title = document.getElementById('hf-pmv-title');
            let timer = document.getElementById('hf-refresh-timer');
            if (!timer) {
                timer = document.createElement('span');
                timer.id = 'hf-refresh-timer';
            }

            timer.textContent = remainingTime;

            title.appendChild(timer);

        }, 1000);
    }



    // BAZAAR AND MARKET //

    function bazaarPage() {
        let contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) return;

        let messageContent = document.querySelector('.msg.right-round');
        let originalText = messageContent.textContent;

        if (messageContent && (messageContent.textContent.includes('unavailable') || messageContent.textContent.includes('not available'))) {
            let newText = `${userName}'s bazaar is fetched by the "View Listings Anytime" script" with the help of the API!`;
            messageContent.textContent = newText;

            fetchBazaarData();
            createAPIlink('remove');
        }
    }

    function marketPage() {
        let contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) return;

        let messageContent = document.querySelector('.msg.right-round');
        let originalText = messageContent.textContent;

        if (messageContent && (messageContent.textContent.includes('unavailable') || messageContent.textContent.includes('not available'))) {
            let newText = `Your item market listings are fetched by the "View Listings Anytime" script" with the help of the API!`;
            messageContent.textContent = newText;

            fetchMarket(null, null, null, true);
            createAPIlink('remove');
        }
    }

    function createBazaarTable(data, market) {
        let contentWrapper = document.querySelector('.content-wrapper');

        let tableDiv = document.createElement('div');
        if (!market) tableDiv.style.paddingTop = '16px';
        if (market) tableDiv.style.marginTop = '-8px';

        // Scrollable wrapper
        let scrollWrapper = document.createElement('div');
        scrollWrapper.style.overflowX = 'auto';
        scrollWrapper.style.display = 'block';

        let table = document.createElement('table');
        table.style.margin = '0 auto';
        table.style.background = 'var(--default-bg-panel-color)';
        table.style.width = '100%';
        table.style.minWidth = '800px'; // Optional: force scroll on smaller screens

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        tbody.style.borderRadius = '5px';

        // Create table headers
        let headers = ['Image', 'Name', 'Bonus', 'Stock', 'Price each', 'Price total', 'Lowest price in market'];
        let headerRow = document.createElement('tr');
        headers.forEach(function(header) {
            let th = document.createElement('th');
            th.style.padding = '4px';
            th.textContent = header;
            th.style.background = 'var(--tabs-active-bg-gradient)';
            th.style.color = 'var(--default-color)';
            th.style.fontWeight = 'bold';
            th.style.textAlign = 'center';
            th.style.padding = '8px 4px';
            th.style.borderBottom = '1px solid grey';
            th.style.borderBottomColor = 'var(--default-panel-divider-outer-side-color)';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        data.forEach(function(item, index) {
            let row = document.createElement('tr');
            row.style.borderBottom = '1px solid grey';
            row.style.borderBottomColor = 'var(--default-panel-divider-outer-side-color)';

            if (market) {
                item.ID = item.item.id;
                item.UID = item.item.uid;
                item.name = item.item.name;
                item.quantity = item.amount;
                item.price = item.price;
            }

            let itemID = item.ID;
            let itemUID = item.UID;
            let bonusText = '';

            if (itemUID) {
                itemUIDs.push({ uid: itemUID, index: index });
                bonusText = 'Loading...';
            }

            itemIDs.push({ id: itemID, index: index });

            createBazaarCell('Image', row, itemID);
            createBazaarCell(item.name, row);
            createBazaarCell(bonusText, row);
            createBazaarCell(item.quantity, row);
            createBazaarCell(item.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }), row);
            createBazaarCell((item.quantity * item.price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }), row);
            createBazaarCell('Loading...', row);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        scrollWrapper.appendChild(table);
        tableDiv.appendChild(scrollWrapper);
        contentWrapper.appendChild(tableDiv);

        fetchMarketDataForItems();
        fetchItemDetailsForUIDs();
    }

    function createBazaarCell(text, row, itemID) {
        let cell = document.createElement('td');

        if (text == 'Image') {
            let img = document.createElement('img');
            img = document.createElement('img');
            img.src = `/images/items/${itemID}/large.png`;
            img.srcset = `/images/items/${itemID}/large.png 1x, /images/items/${itemID}/large@2x.png 2x, /images/items/${itemID}/large@3x.png 3x, /images/items/${itemID}/large@4x.png 4x`;
            img.alt = 'Item Image';
            img.style.height = '25px';
            cell.appendChild(img);
        } else {
            cell.textContent = text;
        }

        cell.style.color = 'var(--default-color)';
        cell.style.textAlign = 'center';
        cell.style.verticalAlign = 'middle';
        cell.style.padding = '4px';

        row.appendChild(cell);
    }


    function fetchMarketDataForItems() {
        let itemsToFetch = Math.min(maximumCalls, itemIDs.length);

        for (let i = 0; i < itemsToFetch; i++) {
            let { id, index } = itemIDs[i];
            fetchMarketData(id, index);
        }

        if (itemIDs.length > maximumCalls) {
            setTimeout(function () {
                fetchMarketDataForItems();
            }, 60000);
        }
    }

    function updateLowestPrice(data, index, itemID) {
        let lowestPrice = data.itemmarket.listings[0].price;

        // Update table with lowest bazaar price
        let table = document.querySelector('table');
        let cell = table.rows[index + 1].cells[6];
        cell.textContent = lowestPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractiondigits: 0, minimumFractionDigits: 0});

        // Remove from itemIDs
        itemIDs = itemIDs.filter(item => item.id !== itemID);
    }

    function fetchItemDetailsForUIDs() {
        let itemsToFetch = Math.min(maximumCalls, itemUIDs.length);

        for (let i = 0; i < itemsToFetch; i++) {
            let { uid, index } = itemUIDs[i];
            fetchItemDetails(uid, index);
        }

        if (itemIDs.length > maximumCalls) {
            setTimeout(function () {
                fetchItemDetailsForUIDs();
            }, 60000);
        }
    }

    function addBonusInfo(data, index, itemUID) {
        let rarity = data.itemdetails.rarity;
        if (rarity == 'None') rarity = '';

        let quality = data.itemdetails.quality;
        let bonuses = data.itemdetails.bonuses;

        let bonusText = '';

        if (bonuses) {
            if (Object.keys(bonuses).length === 1) {
                // If there is only one bonus
                let bonus = bonuses[Object.keys(bonuses)[0]];
                bonusText = `<p style="padding:4px">${bonus.value}% ${bonus.bonus}</p>`;
            } else if (Object.keys(bonuses).length === 2) {
                // If there are two bonuses
                Object.keys(bonuses).forEach(key => {
                    let bonus = bonuses[key];
                    bonusText += `<p style="padding:4px">${bonus.value}% ${bonus.bonus}</p>`;
                });
            }
        }

        // Update table with bonus text
        let table = document.querySelector('table');
        let cell = table.rows[index + 1].cells[2];
        cell.innerHTML = `<p style="padding:4px">${rarity}<p>${quality} Quality</p>${bonusText}`;

        // Remove from itemUIDs
        itemUIDs = itemUIDs.filter(item => item.uid !== itemUID);
    }



    // API FETCHERS //

    async function fetchBazaar(ul, refreshed, mobile) {
        let apiUrl = `https://api.torn.com/user/?selections=bazaar&key=${apiKey}&comment=ViewListingsAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let bazaar = data.bazaar;

            if (mobile) {
                createMobileList('Bazaar', ul, bazaar, refreshed);
            } else {
                createList('Bazaar', ul, bazaar, refreshed);
            }
        })
            .catch(error => console.error('Error fetching data: ' + error));

    }

    async function fetchMarket(ul, refreshed, mobile, page) {
        let apiUrl = `https://api.torn.com/v2/user/itemmarket?offset=0&key=${apiKey}&comment=ViewListingsAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let itemmarket = data.itemmarket;

            if (page) {
                createBazaarTable(itemmarket, true);
                apiCallCount++;
            }

            if (mobile) {
                createMobileList('Market', ul, itemmarket, refreshed);
            } else {
                createList('Market', ul, itemmarket, refreshed);
            }
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchHospitalTime() {
        let messageContainer = document.body.querySelector('.info-msg');
        let message = messageContainer.querySelector('.msg');
        if (!message) return;

        let apiUrl = `https://api.torn.com/user/?selections=basic&key=${apiKey}&comment=ViewPointsMarketAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            changeTimer(data, messageContainer, message)
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchLogs() {
        let apiUrl = `https://api.torn.com/user/?key=${apiKey}&selections=log&log=5000&comment=ViewListingsAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let logData = data.log;

            for (let logID in logData) {
                let log = logData[logID];
                let listingID = log.data.listing_id;

                personalListings.push(listingID);
            }

            fetchPointsMarket();
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchPointsMarket() {
        let apiUrl = `https://api.torn.com/market/?selections=pointsmarket,timestamp&key=${apiKey}&comment=ViewPointsMarketAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let pointsMarket = data.pointsmarket;
            timestamp = data.timestamp;

            addTimer();
            createPointsTable(pointsMarket);
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function findUsername() {
        let url = new URL(window.location.href);
        userID = url.searchParams.get('userId');

        let apiUrl = `https://api.torn.com/user/${userID}?key=${apiKey}&selections=basic&comment=ViewBazaarAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            userName = data.name;
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchBazaarData() {
        let apiUrl = `https://api.torn.com/user/${userID}?key=${apiKey}&selections=bazaar&comment=ViewListingsAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            createBazaarTable(data.bazaar);
            apiCallCount++;
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchOwnMarketData() {
        let apiUrl = `https://api.torn.com/v2/user/itemmarket?offset=0&key=${apiKey}&comment=ViewListingsAnytime`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            createBazaarTable(data.itemmarket, true);
            apiCallCount++;
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchMarketData(itemID, index) {
        let apiUrl = `https://api.torn.com/v2/market/${itemID}/itemmarket?offset=0&key=${apiKey}&comment=ViewBazaarAnytime`

        // Make the API call
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            if (data.itemmarket && data.itemmarket.listings && data.itemmarket.listings.length > 0) {
                updateLowestPrice(data, index, itemID)
            } else {
                throw new Error('No items found in the bazaar');
            }
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function fetchItemDetails(itemUID, index) {
        let apiUrl = `https://api.torn.com/torn/${itemUID}?selections=itemdetails&key=${apiKey}&comment=ViewBazaarAnytime`;

        // Make the API call
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            if (data.itemdetails) {
                addBonusInfo(data, index, itemUID);
            } else {
                throw new Error('No item details found');
            }
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }



    // HELPER FUNCTIONS //

    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('menu-items')) {
                            createMobileMenu(node);
                        }
                    });
                }

                let config = { attributes: true, childList: true, subtree: true, characterData: true };
                observer.observe(target, config);
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }


    function runScript() {
        if (listings) {
            createContainer('Bazaar');
            createContainer('Market');
        }

        if (window.location.href.includes('hf-viewlistings')) {
            changeMobilePage();
            if (apiKey) {
                createAPIlink('remove');
            } else {
                createAPIlink('add');
            }
        } else if (pointsmarket && window.location.href.includes('pmarket')) {
            pointsMarketPage();
        } else if (bazaar && window.location.href.includes('bazaar')) {
            findUsername();
            setTimeout(bazaarPage, 500);
        } else if (itemmarket && window.location.href.includes('ItemMarket')) {
            marketPage();
        }
    }

    runScript();

    // Attach click event listener to document body
    document.body.addEventListener('click', handleClick);

    // Function to run fetchItemQty() on click
    function handleClick(event) {
        runScript();
    }

    // STYLESHEET //

    GM_addStyle(`
        #hf-pmv-title {
            padding: 4px;
            color: var(--content-title-color);
            font-weight: 700;
            font-size: 22px;
            margin: 5px 0 -5px -4px
        }

        #hf-pmv-table {
            text-align: right;
            width: fit-content;
            margin: auto;
            color: var(--default-color);
            padding-top: 20px;
        }

        .hf-pmv-table-header {
            border-bottom: var(--default-panel-divider-outer-side-color) 1px solid;
            background: var(--title-black-gradient);
            border-radius: 5px 5px 0 0;
            width: fit-content;
            font-weight: bold;
            color: var(--tutorial-title-color);
        }

        .hf-pmv-table-row {
            border-bottom: var(--default-panel-divider-outer-side-color) 1px solid;
            border-top: var(--default-panel-divider-inner-side-color) 1px solid;
            background: var(--default-bg-panel-color);
            width: fit-content;
        }

        .hf-pmv-qty {
            border-left = 'var(--default-panel-divider-outer-side-color) 2px solid';
            border-right = 'var(--default-panel-divider-outer-side-color) 2px solid';
        }

        .hf-pmv-cost, .hf-pmv-qty {
            width: 100px;
            padding: 8px;
            display: inline-block;
        }

        .hf-pmv-total {
            width: 150px;
            padding: 8px;
            display: inline-block;
        }

        #hf-refresh {
            z-index: 9999;
            top: 188px;
            right: 475px;
            color: var(--default-color);
            cursor: pointer;
            width: 30px;
        }

        #hf-refresh-timer {
            float: right;
            font-size: 14px;
            margin-top: 6px;
            width: 30px;
            text-align: center;
        }

        .hf-refresh-svg {
            width: 14px
        }

        .hf-refresh-svg {
            margin-top: 4px;
        }

        @media only screen and (max-width: 785px) {
            .hf-pmv-total {
                width: 138px;
            }

            #hf-pmv-title {
                font-size: 14px;
            }

            .hf-refresh-svg, #hf-refresh-timer {
                margin-top: 0px;
            }

            #hf-refresh {
                margin-top: -2px;
            }
        }

        @media only screen and (max-width: 386px) {
            .hf-pmv-total {
               width: 100px;
            }

            .hf-pmv-cost, .hf-pmv-qty {
               width: 86px;
            }
        }
    `);

})();