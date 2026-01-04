// ==UserScript==
// @name         Lazy Crimes
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Adds a spam crime button for everybody that should've stayed on crimes 1.0
// @author       Heartflower [2626587]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540604/Lazy%20Crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/540604/Lazy%20Crimes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Lazy Crimes script running');

    // Variables to overwrite later on
    let nerve = 0;
    let currentHref = window.location.href;

    // See if there's any previously saved settings
    let settings = {};
    let savedSettings = JSON.parse(localStorage.getItem('hf-lazy-crimes-settings'));
    if (savedSettings) settings = savedSettings;

    // For compatibility with Profitability script
    let threshold = 0;
    let savedThreshold = Number(localStorage.getItem('hf-crime-profitability-threshold'));
    if (savedThreshold) threshold = savedThreshold;

    function crimePage(retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let list = document.body.querySelector('.virtualList___noLef');
        let items = list?.querySelectorAll('.virtual-item');

        // If DOM isn't fully loaded, try again
        if (!titleBar || !list || !items || items.length < 2) {
            if (retries > 0) {
                setTimeout(() => crimePage(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Crime Page items after 30 retries.');
            }
            return;
        }

        // Set variable for mobile to use later
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        // If there's no button container yet, create it
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) {
            btnContainer = createButtonContainer(titleBar);
        } else {
            // Don't keep adding buttons
            return;
        }

        // Create the "Lazy Crimes" button and check nerve value
        let button = createLazyButton();
        btnContainer.appendChild(button);
        disableButtons(nerve);

        // Variable to use later for certain crimes
        let ignoreNextClick = false;

        // If mobile scamming, make sure the icons stay up even if clicking the button
        if (mobile && window.location.href.includes('scamming')) {
            button.addEventListener('mousedown', (e) => {
                e.preventDefault(); // prevent focus shift
                e.stopImmediatePropagation(); // prevent other click handlers
                // button.click(); // trigger the actual click

                let force = true;
                button.dispatchEvent(new CustomEvent('click', {
                    detail: { force },
                    bubbles: true
                }));

                ignoreNextClick = true;

            });

            if (settings['Floating Button']) {
                button.classList.add('hf-floating-btn');
                let crimesApp = document.body.querySelector('.crimes-app');
                crimesApp.appendChild(button);
            }
        }

        if (window.location.href.includes('arson')) {
            button.addEventListener('mousedown', (e) => {
                e.preventDefault(); // prevent focus shift
                e.stopImmediatePropagation(); // prevent other click handlers

                let force = true;
                button.dispatchEvent(new CustomEvent('click', {
                    detail: { force },
                    bubbles: true
                }));

                ignoreNextClick = true;

            });
        }


        button.addEventListener('click', function () {
            // If already clicked with mousedown or other, then don't double click!
            if (ignoreNextClick && !event.detail.force) {
                ignoreNextClick = false;
                return;
            }

            // Find all "subcrimes"/items
            items = list.querySelectorAll('.virtual-item');
            let bestItem = null;

            // Different ways of finding the item to be clicked depending on the crime
            if (window.location.href.includes('searchforcash')) {
                bestItem = searchForCash(items);
            } else if (window.location.href.includes('shoplifting')) {
                bestItem = shoplifting(items);
            } else if (window.location.href.includes('pickpocketing')) {
                button.style.background = 'var(--default-blue-dark-color)';
                bestItem = pickpocketing(items);
            } else if (window.location.href.includes('hustling')) {
                bestItem = hustling(items);
            } else if (window.location.href.includes('cracking')) {
                bestItem = cracking(items);
            } else if (window.location.href.includes('forgery')) {
                forgery(items, false);
                return; // All the clicking is done in the forgery() function
            } else if (window.location.href.includes('scamming')) {
                scamming(items);
                return; // All the clicking is done in the scamming() function
            } else if (window.location.href.includes('arson')) {
                arson(items);
                return;
            } else {
                bestItem = items[0];
            }

            // If no item found, then return
            if (bestItem === null) {
                if (window.location.href.includes('pickpocketing')) {
                    button.title = 'No target found on last click';
                    button.classList.add('hf-no-target');
                } else if (window.location.href.includes('searchforcash') || window.location.href.includes('shoplifting') || window.location.href.includes('cracking')) {
                    button.title = 'No items found within preferred settings';
                    button.classList.add('hf-no-items');
                }

                return;
            }

            // Click the commit crime button if it exists and isn't disabled
            let commitButton = bestItem.querySelector('.commit-button');

            if (window.location.href.includes('hustling') && commitButton.classList.contains('disabled') && nerve >= 2) {
                button.title = `You don't have enough money on hand!`;
                button.classList.add('hf-no-money');
            } else {
                button.title = '';
            }

            if (commitButton && !commitButton.classList.contains('disabled')) commitButton.click();
        });

        // For shoplifting, create a Notorious button if enabled in settings
        if (window.location.href.includes('shoplifting') && settings.Notorious) {
            let notoriousBtn = createLazyButton();
            notoriousBtn.textContent = 'Notorious';
            notoriousBtn.classList.add('hf-notorious-btn');
            if (mobile) notoriousBtn.textContent = '100%';

            btnContainer.appendChild(notoriousBtn);
            disableButtons(nerve);

            notoriousBtn.addEventListener('click', function() {
                let item = shoplifting(items, true);
                let commitButton = item.querySelector('.commit-button');
                if (commitButton && !commitButton.classList.contains('disabled')) commitButton.click();
            });
        }

        // For mobile search for cash, make the "search for cash" smaller so the icons can actually appear
        if (mobile && window.location.href.includes('searchforcash')) {
            let title = document.body.querySelector('.title___uzsf7');
            title.style.fontSize = 'small';
        }

        // For scamming, check if the morale script is installed - if not, prompt user to do so
        if (window.location.href.includes('scamming')) {
            setTimeout(function() {
                let moraleScript = document.body.querySelector('.cm-sc-settings');
                if (!moraleScript) {
                    let icon = document.body.querySelector('.hf-lazy-crimes-info-icon');
                    if (icon) {
                        icon.style.cursor = 'pointer';
                        icon.title = `Please install tobytorn [1617955]'s Crime Morale Script`;
                        icon.addEventListener('click', function() {
                            window.open(`https://www.torn.com/forums.php#/p=threads&f=67&t=16430177&b=0&a=0rh=82&`, '_blank', 'noopener');
                        });
                    }

                    button.classList.add('hf-disabled');
                    button.title = `Please install tobytorn [1617955]'s Crime Morale Script`;
                    button.addEventListener('click', function(e) {
                        e.preventDefault(); // prevent focus shift
                        e.stopImmediatePropagation(); // prevent other click handlers
                        ignoreNextClick = true;

                        window.open(`https://www.torn.com/forums.php#/p=threads&f=67&t=16430177&b=0&a=0rh=82&`, '_blank', 'noopener');
                    });
                    button.classList.add('hf-no-crime-morale');
                }
            }, 500);
        }
    }

    // HELPER function to create a container for the buttons
    function createButtonContainer(titleBar) {
        let div = document.createElement('div');
        div.classList.add('hf-lazy-crimes-btn-container');

        titleBar.insertBefore(div, titleBar.children[1]);

        return div;
    }

    // HELPER function to create "lazy crimes" or even merit buttons
    function createLazyButton() {
        let button = document.createElement('button');
        button.classList.add('hf-lazy-crimes-button');
        button.textContent = `I AM LAZY`;

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        if (mobile) {
            button.textContent = 'LAZY';
            button.classList.add('hf-mobile');
        }

        // Safety measures for this thinking this is a Spam Crimes Too Fast script
        let text = 'I AM LAZY';
        let title = '';

        button.addEventListener('click', function (e) {
            if (button.classList.contains('hf-no-arson')) {
                button.title = 'No available arson found on last click';
                return;
            }

            text = button.textContent;
            title = button.title;

            if (button.disabled) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            button.classList.add('hf-processing');
            button.disabled = true;
            button.textContent = text + '...';
            button.title = 'Processing...';

            setTimeout(() => {
                button.textContent = text;
                button.classList.remove('hf-processing');
                button.disabled = false;

                if (button.classList.contains('hf-no-nerve')) return;

                button.title = '';
                button.style.transition = 'background-color 0.3s ease, width 0.3s ease';
                button.style.background = 'var(--default-blue-dark-color)';
            }, 500);
        });

        return button;
    }

    // HELPER function to find best item for SEARCH FOR CASH
    function searchForCash(items) {
        let profitability = document.body.querySelector('.hf-value');
        if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

        let highestPercentage = -Infinity;
        let bestItem = null;

        let bestValue = -Infinity;
        let bestValueItem = null;

        for (let item of items) {
            let commitBtn = item.querySelector('.commit-button');
            if (commitBtn.classList.contains('disabled')) continue;

            if (profitability && settings['Respect Threshold']) {
                let value = Number(item.getAttribute('data-hf-value'));
                if (value < threshold) continue;
            }

            let percentageElement = item.querySelector('.densityTooltipTrigger___VG9Wy');
            if (!percentageElement) continue;

            let percentage = percentageElement.getAttribute('aria-label');

            let match = percentage.match(/\((\d+)%\)/);
            if (match) {
                let number = parseInt(match[1], 10);

                if (number > highestPercentage) {
                    highestPercentage = number;
                    bestItem = item;
                }
            }

            if (profitability && settings['Prioritise Profitability']) {
                let value = Number(item.getAttribute('data-hf-value'));

                if (value > bestValue) {
                    bestValue = value;
                    bestValueItem = item;
                }
            }
        }

        if (profitability && settings['Prioritise Profitability'] && bestValueItem) {
            bestItem = bestValueItem;
        }

        return bestItem;
    }

    // MAIN function for BOOTLEGGING page
    function bootlegging(retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let genres = document.body.querySelectorAll('.genreStock___IT7ld');

        // If DOM hasn't fully loaded yet, try again
        if (!titleBar || !genres || genres.length < 2) {
            if (retries > 0) {
                setTimeout(() => bootlegging(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Bootlegging to load after 30 retries.');
            }
            return;
        }

        // Set variable to check if mobile user or not
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        // Create a button container of one doesn't exist yet
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) {
            btnContainer = createButtonContainer(titleBar);
        } else {
            // Don't keep adding buttons
            return;
        }

        // Create lazy crimes button and check nerve
        let button = createLazyButton();
        btnContainer.appendChild(button);
        disableButtons(nerve);

        button.addEventListener('click', function () {
            let count = document.body.querySelector('.count___hBmtm');

            // If no blank DVDs, enlarge the button to add them
            if (Number(count.textContent) === 0) {
                count.parentNode.click();

                // If not already clicked, click the add DVDs vyttib
                let alreadyClicked = button.getAttribute('count-clicked');
                if (!alreadyClicked) {
                    button.setAttribute('count-clicked', true);
                    return;
                }

                // If already clicked, add the DVDs
                setTimeout(function() {
                    let selectItemBtn = document.body.querySelector('.popover___KwcuU .buttonWrap___h7dcO');
                    selectItemBtn.click();

                    button.removeAttribute('count-clicked');

                    return;
                }, 500);

                return;
            }

            let commitButtons = document.body.querySelectorAll('.commit-button');
            let needStockElement = null;
            let needCopyingElement = null;

            // Ratio as per Emforus' guide
            let info = {
                'Action': 10 * 5,
                'Fantasy': 7 * 5,
                'Comedy': 7 * 5,
                'Drama': 5.5 * 5,
                'Thriller': 4 * 5,
                'Horror': 3 * 5,
                'Romance': 3 * 5,
                'Sci-Fi': 2 * 5,
            }

            // Loop through all genres until you find one that doesn't have enough stock yet
            for (let genre of genres) {
                let name = genre.querySelector('.genreName___kBqTz').textContent;
                let stock = Number(genre.querySelector('.currentStock___Bh9_b').textContent.replace(/,/g,''));
                let currentlyBusy = Number(genre.querySelector('.statusText___fRZso').textContent.replace('copying', '').replace('queued', '').replace(/,/g,'').trim());

                if (info[name] !== undefined && stock < info[name]) {
                    needStockElement = genre;
                }

                if (info[name] !== undefined && (currentlyBusy + stock) < info[name]) {
                    needCopyingElement = genre;
                    break;
                }
            }

            if (needCopyingElement || needStockElement) {
                if (needCopyingElement) needStockElement = needCopyingElement;

                // Copy more of the needed stock!
                let selected = needStockElement.classList.contains('selected___UvibX');

                if (!selected) {
                    // If already selected, copy
                    needStockElement.click();
                } else {
                    // If not already selected, select
                    if (!commitButtons[0].classList.contains('disabled')) commitButtons[0].click();
                }
            } else {
                // Sell stock
                commitButtons[1].click();
            }
        });

        // Add "Online Entrepreneur" merit button if enabled
        if (settings['Online Entrepreneur']) {
            let onlineBtn = createLazyButton();
            onlineBtn.textContent = 'Online Entrepreneur';
            onlineBtn.classList.add('hf-online-btn');
            if (mobile) onlineBtn.textContent = 'ON';

            btnContainer.appendChild(onlineBtn);
            disableButtons(nerve);

            onlineBtn.addEventListener('click', function () {
                let commitButtons = document.body.querySelectorAll('.commit-button');

                if (!commitButtons[2].textContent.includes('Collect') || !document.body.querySelector('.input___Pgrid')) {
                    console.warn('[HF Lazy Crimes] Online store does not exist yet');
                    commitButtons[2].click();
                    return;
                } else {
                    // If the online store is disabled, enable
                    let input = document.body.querySelector('.input___Pgrid');
                    let onlineEnabled = input.checked;
                    if (!onlineEnabled) input.click();

                    return;
                }

                let needStockElement = null;
                let needCopyingElement = null;

                let info = {
                    'Action': (10 * 482) + (10 * 5),
                    'Fantasy': (7 * 482) + (7 * 5),
                    'Comedy': (7 * 482) + (7 * 5),
                    'Drama': (5.5 * 482) + (5.5 * 5),
                    'Thriller': (4 * 482) + (4 * 5),
                    'Horror': (3 * 482) + (3 * 5),
                    'Romance': (3 * 482) + (3 * 5),
                    'Sci-Fi': (2 * 482) + (2 * 5),
                }

                for (let genre of genres) {
                    let name = genre.querySelector('.genreName___kBqTz').textContent;
                    let stock = Number(genre.querySelector('.currentStock___Bh9_b').textContent.replace(/,/g,''));
                    let currentlyBusy = Number(genre.querySelector('.statusText___fRZso').textContent.replace('copying', '').replace('queued', '').replace(/,/g,'').trim());

                    if (info[name] !== undefined && stock < info[name]) {
                        needStockElement = genre;
                    }

                    if (info[name] !== undefined && (currentlyBusy + stock) < info[name]) {
                        needCopyingElement = genre;
                        break;
                    }
                }

                if (needCopyingElement || needStockElement) {
                    if (needCopyingElement) needStockElement = needCopyingElement;

                    // Copy more of the needed stock!
                    let selected = needStockElement.classList.contains('selected___UvibX');

                    if (!selected) {
                        // If already selected, copy
                        needStockElement.click();
                    } else {
                        // If not already selected, select
                        commitButtons[0].click();
                    }
                } else {
                    // Sell stock
                    commitButtons[1].click();
                }
            });
        }

        // Add "Cinephile" merit button if enabled
        if (settings.Cinephile) {
            let cineBtn = createLazyButton();
            cineBtn.textContent = 'Cinephile';
            cineBtn.classList.add('hf-cine-btn');
            if (mobile) cineBtn.textContent = '10K';

            btnContainer.appendChild(cineBtn);
            disableButtons(nerve);

            let needCopyingElement = null;

            cineBtn.addEventListener('click', function () {
                let count = document.body.querySelector('.count___hBmtm');
                if (Number(count.textContent) === 0) {
                    count.parentNode.click();

                    setTimeout(function() {
                        let selectItemBtn = document.body.querySelector('.popover___KwcuU .buttonWrap___h7dcO');
                        selectItemBtn.style.position = 'fixed';
                        selectItemBtn.style.zIndex = 99999;
                        selectItemBtn.style.scale = '2000%';
                        selectItemBtn.style.top = '0px';
                    }, 500);

                    return;
                }

                let cinephileStatistics = {};

                let possibleGenres = ['action', 'comedy', 'drama', 'fantasy', 'horror', 'romance', 'thriller', 'sci-fi'];

                let preferredGenre = null;

                let statistics = document.body.querySelectorAll('.statistic___YkyjL');
                for (let statistic of statistics) {
                    let label = statistic.querySelector('.label___gPPwp');
                    label = label.textContent.toLowerCase();
                    if (!label.includes('dvds sold')) continue;
                    label = label.replace(' dvds sold', '').trim();

                    let value = statistic.querySelector('.value___S0RNN');
                    value = Number(value.textContent.replace(/,/g, ''));

                    cinephileStatistics[label] = value;

                    if (value < 10000) {
                        preferredGenre = label;
                    }
                }

                for (let genre of possibleGenres) {
                    if (!cinephileStatistics[genre]) {
                        cinephileStatistics[genre] = 0;
                        preferredGenre = genre;
                    }
                }

                if (!preferredGenre) {
                    cineBtn.title = 'Cinephile merit should already be done';
                    cineBtn.classList.add('hf-no-cinephile');
                    console.warn('Cinephile merit should already be done');
                    return;
                }

                let commitButtons = document.body.querySelectorAll('.commit-button');

                let minTotal = Infinity;

                for (let genre of genres) {
                    let name = genre.querySelector('.genreName___kBqTz').textContent;

                    if (!cinephileStatistics[name.toLowerCase()]) continue;
                    if (cinephileStatistics[name.toLowerCase()] >= 10000) continue;

                    let stock = Number(genre.querySelector('.currentStock___Bh9_b').textContent.replace(/,/g,''));
                    let currentlyBusy = Number(genre.querySelector('.statusText___fRZso').textContent.replace('copying', '').replace('queued', '').replace(/,/g,'').trim());
                    let total = stock + currentlyBusy;

                    let totalWithSold = Number(cinephileStatistics[name.toLowerCase()]) + total;
                    if (totalWithSold < 10000 && ((totalWithSold + 1000) < minTotal)) {
                        minTotal = totalWithSold;
                        needCopyingElement = genre;
                    }
                }

                if (needCopyingElement) {
                    // Copy more of the needed stock!
                    let selected = needCopyingElement.classList.contains('selected___UvibX');

                    if (!selected) {
                        // If already selected, copy
                        needCopyingElement.click();
                    } else {
                        // If not already selected, select
                        if (!commitButtons[0].classList.contains('disabled')) commitButtons[0].click();
                    }
                } else {
                    // Sell stock
                    if (!commitButtons[1].classList.contains('disabled')) commitButtons[1].click();
                }
            });
        }

    }

    // MAIN function for the GRAFFITI page
    function graffiti(retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let list = document.body.querySelector('.virtualList___noLef');
        let items = list?.querySelectorAll('.virtual-item');

        // If DOM hasn't fully loaded yet, try again
        if (!titleBar || !list || !items || items.length < 2) {
            if (retries > 0) {
                setTimeout(() => graffiti(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Crime Page items after 30 retries.');
            }
            return;
        }

        // Create button container if it doesn't exist yet
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) {
            btnContainer = createButtonContainer(titleBar);
        } else {
            // Don't keep adding buttons
            return;
        }

        // Create the lazy crimes button
        let button = createLazyButton();
        btnContainer.appendChild(button);
        disableButtons(nerve);

        let icon = document.body.querySelector('.hf-lazy-crimes-icon');

        button.addEventListener('click', function (event) {
            for (let item of items) {
                let tags = Number(item.querySelector('.tagsCount___meTI4').textContent);

                if (tags < 500) {
                    // Do the first one it finds below 500
                    let sprayCanButton = item.querySelector('.sprayCanButton___URxYK');
                    let unselected = sprayCanButton.querySelector('.dim___AtLY0');

                    // If no can selected, make black spray can EXTRA big
                    if (unselected) {
                        sprayCanButton.click();

                        let alreadyClicked = button.getAttribute('count-clicked');
                        if (!alreadyClicked) {
                            button.setAttribute('count-clicked', true);
                            return;
                        }

                        setTimeout(function() {
                            let rect = button.getBoundingClientRect();
                            let selectCanButton = document.body.querySelector('.buttonWrap___h7dcO');
                            selectCanButton.click();

                            button.removeAttribute('count-clicked');

                            return;
                        }, 500);

                        break;
                    } else {
                        // Do the graffiti
                        let commitButton = item.querySelector('.commit-button');
                        if (!commitButton.classList.contains('disabled')) commitButton.click();
                        break;
                    }
                }
            }
        });
    }

    // MAIN function for the SEARCH FOR CASH merits
    function searchForCashMerits(retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let list = document.body.querySelector('.virtualList___noLef');
        let items = list?.querySelectorAll('.virtual-item');

        // If DOM isn't fully loaded, try again
        if (!titleBar || !list || !items || items.length < 2) {
            if (retries > 0) {
                setTimeout(() => searchForCashMerits(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Crime Page items after 30 retries.');
            }
            return;
        }

        // Variable to check if mobile user or bit
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        // Find button container or add if it doesn't exist
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) btnContainer = createButtonContainer(titleBar);

        // Create the spoiled rotten button if enabled
        if (settings['Spoiled Rotten']) {
            let spoiledBtn = createLazyButton();
            spoiledBtn.textContent = 'Spoiled Rotten';
            if (mobile) spoiledBtn.textContent = 'R';
            spoiledBtn.classList.add('hf-spoiled-btn');
            btnContainer.appendChild(spoiledBtn);
            disableButtons(nerve);

            spoiledBtn.addEventListener('click', function () {
                items = list.querySelectorAll('.virtual-item');

                let trash = items[0];
                let commitButton = trash.querySelector('.commit-button');
                if (commitButton && !commitButton.classList.contains('disabled')) commitButton.click();
            });
        }

        // Create the shorte thing button if enabled
        if (settings['Shore Thing']) {
            let sandBtn = createLazyButton();
            sandBtn.textContent = 'Shore Thing';
            if (mobile) sandBtn.textContent = 'S';
            sandBtn.classList.add('hf-sand-btn');
            btnContainer.appendChild(sandBtn);
            disableButtons(nerve);

            sandBtn.addEventListener('click', function () {
                items = list.querySelectorAll('.virtual-item');

                let sand = items[3];
                let commitButton = sand.querySelector('.commit-button');
                if (commitButton) commitButton.click();
            });
        }
    }

    // HELPER function to decide best item in SHOPLIFTING crime
    function shoplifting(items, notorious) {
        let profitability = document.body.querySelector('.hf-value');
        if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

        let highestDisabled = 0;
        let safestCrime = null;
        let sweetNotoriety = 0;
        let bobNotoriety = 0;

        let bestValue = -Infinity;
        let bestValueItem = null;

        for (let item of items) {
            if (profitability && settings['Respect Threshold']) {
                let value = Number(item.getAttribute('data-hf-value'));
                if (value < threshold) continue;
            }

            let disabled = 0;

            let securities = item.querySelectorAll('.securityMeasure___Zhpzp');
            for (let security of securities) {
                if (security.classList.contains('blank___L7Z5b')) continue;
                if (!security.classList.contains('disabled___Enrnq')) continue;
                disabled++;
            }

            let notorietyElement = item.querySelector('.notorietyBar___hikrJ');
            let notoriety = notorietyElement.getAttribute('aria-label');
            if (notoriety !== 'No notoriety') {
                notoriety = Math.ceil(Number(notoriety.replace('Notoriety: ', '').replace('%', '')));
            } else {
                notoriety = 0;
            }

            if (profitability && settings['Prioritise Profitability'] && notoriety < 90) {
                let value = Number(item.getAttribute('data-hf-value'));

                if (value > bestValue) {
                    bestValue = value;
                    bestValueItem = item;
                }
            }

            if (notorious) {
                if (notoriety === 100) continue;
                safestCrime = item;
                break;
            } else {
                if (item === items[0]) sweetNotoriety = notoriety;
                if (item === items[1]) bobNotoriety = notoriety;

                if (disabled > highestDisabled && notoriety < 90) {
                    highestDisabled = disabled;
                    safestCrime = item;
                }
            }
        }

        if (!safestCrime && (!settings['Respect Threshold'] && profitability)) {
            if (sweetNotoriety < 90) {
                safestCrime = items[0]; // sweet shop
            } else if (bobNotoriety < 90) {
                safestCrime = items[1]; // bits n bob
            } else {
                safestCrime = items[0]; // sweet shop
            }
        }

        if (settings['Prioritise Profitability'] && bestValueItem && profitability) {
            safestCrime = bestValueItem;
        }

        return safestCrime;
    }

    // HELPER function to decide best item for PICKPOCKETING crime
    function pickpocketing(items) {
        let profitability = document.body.querySelector('.hf-value');
        if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

        // Variable to check if mobile user or bit
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let availableTarget = null;

        let skillElement = document.body.querySelector('.progressFill___zsgNm');
        let skill = Number(skillElement.getAttribute('aria-label').replace('Crime skill: ', ''));

        let targets = {
            'Drunk man': { minskill: 1, maxskill: 20, avoidphsyical: 'Muscular', avoidactivity: 'Distracted' },
            'Drunk woman': { minskill: 1, maxskill: 20, avoidphysical: null, avoidactivity: 'Distracted' },
            'Elderly man': { minskill: 1, maxskill: 20, avoidphysical: null, avoidactivity: null },
            'Elderly woman': { minskill: 1, maxskill: 20, avoidphysical: null, avoidactivity: null },
            'Homeless person': { minskill: 1, maxskill: 20, avoidphysical: null, avoidactivity: 'Loitering' },
            'Junkie': { minskill: 1, maxskill: 25, avoidphysical: 'Muscular', avoidactivity: 'Loitering' },
            'Young man': { minskill: 20, maxskill: 70, avoidphysical: null, avoidactivity: null },
            'Young woman': { minskill: 20, maxskill: 70, avoidphysical: null, avoidactivity: null },
            'Student': { minskill: 20, maxskill: 70, avoidphysical: 'Athletic', avoidactivity: null },
            'Laborer': { minskill: 20, maxskill: 70, avoidphysical: null, avoidactivity: 'Distracted' },
            'Postal worker': { minskill: 20, maxskill: 70, avoidphysical: null, avoidactivity: null },
            'Rich kid': { minskill: 40, maxskill: 90, avoidphysical: null, avoidactivity: null },
            'Sex worker': { minskill: 40, maxskill: 90, avoidphysical: null, avoidactivity: null },
            'Thug': { minskill: 40, maxskill: 90, avoidphysical: null, avoidactivity: null },
            'Businessman': { minskill: 65, maxskill: 100, avoidphysical: 'Skinny', avoidactivity: 'Walking' },
            'Businesswoman': { minskill: 65, maxskill: 100, avoidphysical: 'Heavy', avoidactivity: 'Walking' },
            'Gang member': { minskill: 65, maxskill: 100, avoidphysical: 'Muscular', avoidactivity: null },
            'Jogger': { minskill: 65, maxskill: 100, avoidphysical: null, avoidactivity: null },
            'Cyclist': { minskill: 90, maxskill: 100, avoidphysical: null, avoidactivity: null },
        }

        let activityIcons = {
            'Cycling': 0,
            'Distracted': -34,
            'Music': -102,
            'Loitering': -136,
            'Phone': -170,
            'Running': -204,
            'Soliciting': -238,
            'Stumbling': -272,
            'Walking': -306,
            'Begging': -340
        };

        let bestValue = -Infinity;
        let bestValueItem = null;

        for (let item of items) {
            let story = item.querySelector('.story___GmRvQ');
            if (story) continue;

            if (item.textContent === '') continue;
            let titleAndProps = item.querySelector('.titleAndProps___DdeVu div').textContent; // e.g. Young Man, Cyclist
            titleAndProps = titleAndProps.split(' (')[0]; // removes " (Moderately Unsafe)" and similar

            let physicalProps = item.querySelector('.physicalProps___E5YrR').textContent; // e.g. Athletic (info), Skinny (info)
            let activity = item.querySelector('.activity___e7mdA').textContent; // e.g. Walking, Distracted
            let commitButton = item.querySelector('.commit-button');

            if (mobile) {
                let activityIcon = item.querySelector('.icon___VfCk2');
                let background = Number(getComputedStyle(activityIcon).backgroundPositionY.replace('px', '').trim());
                activity = Object.keys(activityIcons).find(key => activityIcons[key] === background);
            }

            if (commitButton.classList.contains('disabled')) continue;
            if (!targets[titleAndProps]) continue;
            if (physicalProps.includes(targets[titleAndProps].avoidphysical)) continue;
            if (activity.includes(targets[titleAndProps].avoidactivity)) continue;
            if (skill < targets[titleAndProps].minskill) continue;

            if (settings['Respect Threshold'] && profitability) {
                let value = Number(item.getAttribute('data-hf-value'));
                if (value < threshold) continue;
            }

            if (settings['Prioritise Profitability'] && profitability) {
                let value = Number(item.getAttribute('data-hf-value'));

                if (value > bestValue) {
                    bestValue = value;
                    bestValueItem = item;
                }
            } else {
                availableTarget = item;
                break;
            }
        }

        if (settings['Prioritise Profitability'] && bestValueItem && profitability) {
            availableTarget = bestValueItem;
        }

        return availableTarget;
    }

    // MAIN function for the BURGLARY page
    function burglary(retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let categories = document.body.querySelectorAll('.targetCategoryButton___Rjnpf');

        // If page hasn't fully loaded yet, try again
        if (!titleBar || !categories || categories.length < 3) {
            if (retries > 0) {
                setTimeout(() => burglary(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Burglary categories after 30 retries.');
            }
            return;
        }

        // Variable to check if user is mobile user or not
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        // Minimum confidence level
        let preferredProgress = 80;
        if (settings.MinimumBurglaryConfidence) {
            preferredProgress = Number(settings.MinimumBurglaryConfidence);
        }

        // Add button container if it doesn't exist yet
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) {
            btnContainer = createButtonContainer(titleBar);
        } else {
            // Don't keep adding buttons
            return;
        }

        // Create button
        let button = createLazyButton();
        btnContainer.appendChild(button);
        disableButtons(nerve);

        button.addEventListener('click', function () {
            let profitability = document.body.querySelector('.hf-value');
            if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

            let list = document.body.querySelector('.virtualList___noLef');
            let items = list?.querySelectorAll('.virtual-item');

            if (items.length > 1) {
                for (let item of items) {
                    if (item === items[0]) continue;

                    let progressBar = Number(item.querySelector('.progressBar___JhMrP').getAttribute('aria-label').replace('Confidence ', '').replace('%', ''));
                    let commitButtons = item.querySelectorAll('.commit-button');

                    // Make sure you scout until you've reached 80 confidence
                    if (progressBar < preferredProgress && !commitButtons[0].classList.contains('disabled')) {
                        commitButtons[0].click();
                        return;
                    } else if (progressBar >= preferredProgress && !commitButtons[1].classList.contains('disabled')) {
                        commitButtons[1].click();
                        return;
                    }
                }
            }

            let residentialValues = ['Any Residential', 'Tool Shed', 'Beach Hut', 'Mobile Home', 'Bungalow',
                                     'Cottage', 'Apartment', 'Suburban Home', 'Secluded Cabin', 'Farmhouse',
                                     'Lake House', 'Luxury Villa', 'Manor House'];
            let commercialValues = ['Any Commercial', 'Self Storage Facility',
                                    'Postal Office', 'Funeral Directors', 'Market', 'Cleaning Agency', 'Barbershop',
                                    'Liquor Store', 'Dentists Office', 'Chiropractors', 'Recruitment Agency',
                                    'Advertising Agency'];
            let industrialValues = ['Any Industrial', 'Shipyard', 'Dockside Warehouse', 'Farm Storage Unit',
                                    'Printing Works', 'Brewery', 'Truckyard', 'Old Factory', 'Slaughterhouse', 'Paper Mill',
                                    'Foundry', 'Fertilizer Plant']

            let dropdownList = items[0].querySelector('.dropdownList ul');
            let dropdownOptions = dropdownList.querySelectorAll('li');

            if (settings.PreferredBurglaryScout) {
                let categoryGroups = [
                    { values: residentialValues, index: 0, name: 'Residential' },
                    { values: commercialValues, index: 1, name: 'Commercial' },
                    { values: industrialValues, index: 2, name: 'Industrial' }
                ];

                for (let group of categoryGroups) {
                    if (group.values.includes(settings.PreferredBurglaryScout)) {
                        // Select main category if not already selected
                        if (!categories[group.index].classList.contains('selected___m5crj')) {
                            categories[group.index].click();
                            return;
                        }

                        for (let option of dropdownOptions) {
                            let id = option.id;
                            id = id.replace(/-/g, ' ').replace(/\d+$/, '').replace('option', '').trim();
                            if (id === 'Farm Storage') id = 'Farm Storage Unit';

                            if (id === settings.PreferredBurglaryScout) {
                                if (option.classList.contains('selected')) {
                                    if (profitability && settings['Respect Threshold']) {
                                        let value = document.body.querySelector('.hf-selected-dropdown-value').textContent.replace(/\D/g, '').trim();
                                        if (value < threshold) {
                                            let button = document.body.querySelector('.hf-lazy-crimes-button');
                                            button.title = 'Preferred target does not align with minimum threshold settings!';
                                            button.classList.add('hf-below-threshold');

                                            return;
                                        }
                                    }

                                    // Time to scout!
                                    let scoutButton = document.body.querySelector('.commit-button');
                                    scoutButton.click();
                                    return;
                                } else {
                                    // Select the preferred option
                                    option.click();
                                    return;
                                }
                            }

                        }
                    }
                }
            }

            // Scout any residential if no preferred settings and as fallback
            categories = document.body.querySelectorAll('.targetCategoryButton___Rjnpf');
            if (!categories[0].classList.contains('selected___m5crj')) {
                categories[0].click();
                return;
            }

            for (let option of dropdownOptions) {
                let id = option.id;
                id = id.replace(/-/g, ' ').replace(/\d+$/, '').replace('option', '').trim();
                if (id !== 'Any Residential') continue;

                if (option.classList.contains('selected')) {
                    // Time to scout!
                    let scoutButton = document.body.querySelector('.commit-button');
                    scoutButton.click();
                    return;
                } else {
                    // Select the preferred option
                    option.click();
                    return;
                }
            }
        });

        // Add "key to the city" button if enabled
        if (settings['Key to the City']) {
            let targets = {
                'Tool Shed': 'Residential',
                'Beach Hut': 'Residential',
                'Mobile Home': 'Residential',
                'Bungalow': 'Residential',
                'Cottage': 'Residential',
                'Apartment': 'Residential',
                'Suburban Home': 'Residential',
                'Secluded Cabin': 'Residential',
                'Farmhouse': 'Residential',
                'Lake House': 'Residential',
                'Luxury Villa': 'Residential',
                'Manor House': 'Residential',
                'Self Storage Facility': 'Commercial',
                'Postal Office': 'Commercial',
                'Funeral Directors': 'Commercial',
                'Market': 'Commercial',
                'Cleaning Agency': 'Commercial',
                'Barbershop': 'Commercial',
                'Liquor Store': 'Commercial',
                'Dentists Office': 'Commercial',
                'Chiropractors': 'Commercial',
                'Recruitment Agency': 'Commercial',
                'Advertising Agency': 'Commercial',
                'Shipyard': 'Industrial',
                'Dockside Warehouse': 'Industrial',
                'Farm Storage Unit': 'Industrial',
                'Printing Works': 'Industrial',
                'Brewery': 'Industrial',
                'Truckyard': 'Industrial',
                'Old Factory': 'Industrial',
                'Slaughterhouse': 'Industrial',
                'Paper Mill': 'Industrial',
                'Foundry': 'Industrial',
                'Fertilizer Plant': 'Industrial'
            }

            let keyBtn = createLazyButton();
            keyBtn.textContent = 'Key to the City';
            if (mobile) keyBtn.textContent = 'KEY';
            keyBtn.classList.add('hf-key-btn');
            btnContainer.appendChild(keyBtn);
            disableButtons(nerve);

            keyBtn.addEventListener('click', function () {
                let done = false;

                // Check amount already burgled out of 10k
                for (let target in targets) {
                    let statistics = document.body.querySelectorAll('.statistic___YkyjL');
                    for (let statistic of statistics) {
                        let label = statistic.querySelector('.label___gPPwp').textContent.replace('burgled', '').trim();
                        let value = statistic.querySelector('.value___S0RNN').textContent;
                        value = parseInt(value.split('/')[0].trim(), 10);

                        if (target === label && value > 0) {
                            delete targets[target];
                        }
                    }
                }

                // User has already gotten the merit
                if (Object.keys(targets).length === 0) {
                    done = true;
                    return;
                }

                categories = document.body.querySelectorAll('.targetCategoryButton___Rjnpf');
                let list = document.body.querySelector('.virtualList___noLef');
                let items = list?.querySelectorAll('.virtual-item');

                for (let target in targets) {
                    for (let item of items) {
                        let itemName = item.querySelector('.crimeOptionSection___hslpu').textContent;

                        // Scout and burgle the still required targets for the merit
                        if (itemName.includes(target)) {
                            let progressBar = Number(item.querySelector('.progressBar___JhMrP').getAttribute('aria-label').replace('Confidence ', '').replace('%', ''));
                            let commitButtons = item.querySelectorAll('.commit-button');

                            if (progressBar < preferredProgress && !commitButtons[0].classList.contains('disabled')) {
                                commitButtons[0].click();
                                done = true;
                                break;
                            } else if (progressBar >= preferredProgress && !commitButtons[1].classList.contains('disabled')) {
                                commitButtons[1].click();
                                done = true;
                                break;
                            }
                        }
                    }

                    if (done) return;

                    // If none available, then turn on the category of what still needs to be done
                    let categoryIndex = {
                        'Residential': 0,
                        'Commercial': 1,
                        'Industrial': 2
                    };

                    let type = targets[target];
                    let index = categoryIndex[type];

                    if (index !== undefined) {
                        if (!categories[index].classList.contains('selected___m5crj')) {
                            let disabled = categories[index].getAttribute('aria-disabled');
                            if (disabled == false) continue;

                            categories[index].click();
                            done = true;
                            break;
                        } else {
                            let scoutButton = document.body.querySelector('.commit-button');

                            let disabled = scoutButton.getAttribute('aria-disabled');
                            if (disabled == false) continue;

                            scoutButton.click();
                            done = true;
                            break;
                        }
                    }

                    if (done) return;
                }
            });
        }
    }

    // HELPER function to find best item for HUSTLING crime
    function hustling(items) {
        let preferredCrime = null;

        for (let item of items) {
            let audience = item.querySelector('.audienceSection___f3jVs');
            if (audience) {
                let info = audience.querySelector('.srOnly___Nqywa').textContent;

                // If no audience, gather audience
                if (info && info === 'No audience') {
                    let commitButton = item.querySelector('.commit-button');
                    commitButton.click();
                    return;
                }
            }

            let technique = item.querySelector('.techniqueBar___JaXl6');
            if (!technique) continue;
            technique = technique.getAttribute('aria-label').replace('Technique: ', '');

            // Unlock all techniques first
            let [ currentTech, maxTech ] = technique.match(/\d+/g).map(Number);
            if (currentTech === maxTech) continue;

            preferredCrime = item;
            break;
        }

        // If all techniques unlocked
        if (!preferredCrime) preferredCrime = items[1]; // Cornhole

        return preferredCrime;
    }

    // MAIN function for the DISPOSAL crime
    function disposal(retries = 30) {
        let info = {
            'Biological Waste': 'Sink',
            'Body Part': 'Dissolve',
            'Building Debris': 'Sink',
            'Dead Body': 'Bury',
            'Documents': 'Burn',
            'Firearm': 'Sink',
            'General Waste': 'Bury',
            'Industrial Waste': 'Sink',
            'Murder Weapon': 'Sink',
            'Old Furniture': 'Burn',
            'Broken Appliance': 'Sink',
            'Vehicle': 'Burn',
        };

        if (settings['No Dissolving']) info['Body Part'] = 'Abandon';

        if (settings['Always Abandon']) {
            Object.keys(info).forEach(key => {
                info[key] = 'Abandon';
            });
        }

        let nerveSpent = {
            'Abandon': 6,
            'Bury': 8,
            'Burn': 10,
            'Sink': 12,
            'Dissolve': 14,
        }

        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
        let list = document.body.querySelector('.virtualList___noLef');
        let items = list?.querySelectorAll('.virtual-item');

        // If DOM isn't fully loaded, try again
        if (!titleBar || !list || !items || items.length < 2) {
            if (retries > 0) {
                setTimeout(() => disposal(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Disposal items after 30 retries.');
            }
            return;
        }

        // Variable to check if mobile user
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        // Add button container if it doesn't exist yet
        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) {
            btnContainer = createButtonContainer(titleBar);
        } else {
            // Don't keep adding buttons
            return;
        }

        // Create lazy crimes button
        let button = createLazyButton();
        btnContainer.appendChild(button);
        disableButtons(nerve);

        let bestValue = -Infinity;
        let bestValueItem = null;
        let bestNerve = Infinity;

        button.addEventListener('click', function () {
            let profitability = document.body.querySelector('.hf-value');
            if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

            bestValue = -Infinity;
            bestValueItem = null;
            bestNerve = Infinity;

            items = list.querySelectorAll('.virtual-item');
            let firstItem = items[1];
            let stop = false;

            for (let item of items) {
                let commitButton = item.querySelector('.commit-button');
                if (!commitButton) continue;

                if (commitButton.classList.contains('disabled')) {
                    let ariaLabel = commitButton.getAttribute('aria-label');
                    if (ariaLabel === 'You have already disposed of this object') continue;
                    if (ariaLabel !== `You haven't selected a disposal method`) continue;
                }

                let text = item.textContent;

                if (profitability && settings['Respect Threshold']) {
                    let value = Number(item.getAttribute('data-hf-value'));
                    if (value < threshold) continue;
                }

                if (profitability && settings['Prioritise Profitability']) {
                    let value = Number(item.getAttribute('data-hf-value'));

                    if (value > bestValue) {
                        bestValue = value;
                        bestValueItem = item;
                    }

                    continue;
                }

                let methods = item.querySelectorAll('.methodButton___lCgpf');
                if (!methods || methods.length < 2) continue;

                let nameElement = item.querySelector('.crimeOptionSection___hslpu');
                let name = item.querySelector('.crimeOptionSection___hslpu')?.firstChild?.textContent.trim();
                if (!name) name = item.querySelector('.crimeOptionSection___hslpu').textContent.trim();

                if (settings['Low Nerve First']) {
                    let preferredMethod = info[name];
                    let nerveNeeded = nerveSpent[preferredMethod];
                    if (nerveNeeded < bestNerve) {
                        bestNerve = nerveNeeded;
                        bestValueItem = item;
                    }

                    continue;
                }

                for (let method of methods) {
                    let type = method.getAttribute('aria-label');

                    // If preferred method isn't selected yet, select it - else do the crime
                    if (info[name] && info[name] === type) {
                        if (!method.classList.contains('selected___TKH3R')) {
                            method.click();
                        } else {
                            if (commitButton.classList.contains('disabled')) continue;
                            commitButton.click();
                        }

                        stop = true;
                        break;
                    }
                }

                if (stop) break;
            }

            if (profitability && settings['Prioritise Profitability']) {
                if (bestValueItem) {
                    let methods = bestValueItem.querySelectorAll('.methodButton___lCgpf');

                    let nameElement = bestValueItem.querySelector('.crimeOptionSection___hslpu');
                    let name = bestValueItem.querySelector('.crimeOptionSection___hslpu')?.firstChild?.textContent.trim();
                    if (!name) name = bestValueItem.querySelector('.crimeOptionSection___hslpu').textContent.trim();

                    let recommendedMethod = bestValueItem.querySelector('.hf-value')?.firstChild?.textContent.replace(':', '').trim();
                    if (!recommendedMethod) return;

                    for (let method of methods) {
                        let parentNode = method.parentNode;
                        if (mobile && !parentNode.classList.contains('methodPicker___gvX5B')) continue;

                        let type = method.getAttribute('aria-label');

                        let commitButton = bestValueItem.querySelector('.commit-button');

                        // If preferred method isn't selected yet, select it - else do the crime
                        if (recommendedMethod === type) {
                            if (!method.classList.contains('selected___TKH3R')) {
                                method.click();
                            } else {
                                if (commitButton.classList.contains('disabled')) continue;
                                commitButton.click();
                                commitButton.remove();
                            }

                            stop = true;
                            break;
                        }
                    }
                } else {
                    button.title = 'No items found above preferred profitability threshold';
                    button.classList.add('hf-below-threshold');
                }
            }

            if (settings['Low Nerve First']) {
                if (bestValueItem) {
                    let commitButton = bestValueItem.querySelector('.commit-button');

                    let methods = bestValueItem.querySelectorAll('.methodButton___lCgpf');

                    let nameElement = bestValueItem.querySelector('.crimeOptionSection___hslpu');
                    let name = bestValueItem.querySelector('.crimeOptionSection___hslpu')?.firstChild?.textContent.trim();
                    if (!name) name = bestValueItem.querySelector('.crimeOptionSection___hslpu').textContent.trim();

                    for (let method of methods) {
                        let type = method.getAttribute('aria-label');

                        // If preferred method isn't selected yet, select it - else do the crime
                        if (info[name] && info[name] === type) {
                            if (!method.classList.contains('selected___TKH3R')) {
                                method.click();
                            } else {
                                if (commitButton.classList.contains('disabled')) continue;

                                commitButton.click();
                                commitButton.remove();
                            }

                            stop = true;
                            break;
                        }
                    }

                }
            }
        });

        // Add dissolving agent button if enabled
        if (settings['Dissolving Agent']) {
            let dissolvingBtn = createLazyButton();
            dissolvingBtn.textContent = 'Dissolving Agent';
            if (mobile) dissolvingBtn.textContent = 'ACID';
            dissolvingBtn.classList.add('hf-dissolving-btn');
            btnContainer.appendChild(dissolvingBtn);
            disableButtons(nerve);

            let deadBody = false;
            for (let item of items) {
                let nameElement = item.querySelector('.crimeOptionSection___hslpu');
                if (!nameElement) continue;

                let name = nameElement?.firstChild.textContent.trim();
                if (!name) name = nameElement.textContent.trim();

                if (name === 'Dead Body') {
                    deadBody = true;
                }
            }

            // If no dead body, then add a warning for it
            if (!deadBody || deadBody === false) {
                setTimeout(function() {
                    dissolvingBtn.classList.add('hf-disabled');
                    dissolvingBtn.title = 'No Dead Body in sight!';
                    dissolvingBtn.classList.add('hf-no-body');
                }, 10);

                dissolvingBtn.classList.add('hf-disabled');
                dissolvingBtn.title = 'No Dead Body in sight!';

                return;
            }

            dissolvingBtn.addEventListener('click', function() {
                items = list.querySelectorAll('.virtual-item');

                for (let item of items) {
                    let methods = item.querySelectorAll('.methodButton___lCgpf');
                    if (!methods || methods.length < 2) continue;

                    let nameElement = item.querySelector('.crimeOptionSection___hslpu');
                    let name = item.querySelector('.crimeOptionSection___hslpu')?.firstChild?.textContent.trim();
                    if (!name) name = bestValueItem.querySelector('.crimeOptionSection___hslpu').textContent.trim();

                    // Dissolve the dead body if found
                    if (name === 'Dead Body') {
                        let commitButton = item.querySelector('.commit-button');
                        let method = methods[4];

                        if (!method.classList.contains('selected___TKH3R')) {
                            method.click();
                            return;
                        } else {
                            if (commitButton.classList.contains('disabled')) continue;
                            commitButton.click();
                            return;
                        }
                    }
                }
            });
        }
    }

    // HELPER function to find the best item for the CRACKING crime
    function cracking(items) {
        let profitability = document.body.querySelector('.hf-value');
        if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

        let leastTries = Infinity;
        let bestItem = null;

        let bestValue = -Infinity;
        let bestValueItem = null;

        for (let item of items) {
            let commitButton = item.querySelector('.commit-button');
            if (!commitButton) continue;

            if (commitButton.classList.contains('disabled')) continue;

            if (profitability && settings['Respect Threshold']) {
                let value = Number(item.getAttribute('data-hf-value'));
                if (value < threshold) continue;
            }

            if (profitability && settings['Prioritise Profitability']) {
                let value = Number(item.getAttribute('data-hf-value'));
                if (value > bestValue) {
                    bestValue = value;
                    bestValueItem = item;
                }

                continue;
            }

            let type = item.querySelector('.title___kEtkc');

            // Finish started crackings first
            if (type) type = type.textContent;

            if (!type) {
                let nerveNeeded = item.querySelector('.nerve___i4mpF')
                if (!nerveNeeded) continue;

                nerveNeeded = nerve.textContent;
                if (Number(nerveNeeded) === 5) type = 'crack';
            }

            if (type && type == 'crack') {
                bestItem = item;
                return bestItem;
            }

            let slotDummies = item.querySelectorAll('.charSlotDummy___s11h5');
            let slots = item.querySelectorAll('.charSlot___b_S9h');

            let tries = 0;

            for (let slot of slots) {
                let discovered = slot.querySelector('.discoveredChar___mmchE');
                if (discovered) continue;

                let input = slot.querySelector('input');
                if (!input) input = slot;

                let ariaLabel = input.getAttribute('aria-label');
                let encryption = (ariaLabel.match(/(\d+)\s+encryption/) || [0, 0])[1] * 1;
                encryption = encryption + 1;
                tries += encryption
            }

            if (tries < leastTries) {
                leastTries = tries;
                bestItem = item;
            }
        }

        if (profitability && settings['Prioritise Profitability'] && bestValueItem) {
            bestItem = bestValueItem;
        }

        return bestItem;
    }

    // HELPER function to find and click the best item in the FORGERY crime
    function forgery(items, forced = false) {
        let profitability = document.body.querySelector('.hf-value');
        if (!profitability && (settings['Respect Threshold'] || settings['Prioritise Profitability'])) noProfitabilityDetected();

        let done = false;

        if (items.length < 2 || forced) {
            let item = items[0];
            let dropdown = item.querySelector('.dropdownMainWrapper___PjDiT');
            if (!dropdown) return null;

            if (settings.PreferredForgeryProject) {
                let dropdownList = dropdown.querySelector('.dropdownList ul');

                let options = dropdownList.querySelectorAll('li');

                for (let option of options) {
                    let id = option.id;
                    id = id.replace(/-/g, ' ').replace(/\d+$/, '').replace('option', '').trim();

                    if (id !== settings.PreferredForgeryProject) continue;

                    if (option.classList.contains('selected')) {

                        if (profitability && settings['Respect Threshold']) {
                            let value = document.body.querySelector('.hf-selected-dropdown-value').textContent.replace(/\D/g, '').trim();
                            if (value < threshold) {
                                let button = document.body.querySelector('.hf-lazy-crimes-button');
                                button.title = 'Preferred project does not align with minimum threshold settings!';
                                button.classList.add('hf-below-threshold');

                                return;
                            }
                        }

                        // Time to begin project!
                        let commitButton = document.body.querySelector('.commit-button');
                        commitButton.click();
                        return;
                    } else {
                        // Select the preferred project
                        option.click();
                        return;
                    }
                }

                return;
            } else {
                let current = dropdown.querySelector('.optionWithLevelRequirement___cHH35').textContent;

                if (current.includes('Parking Permit')) {
                    // Begin project
                    let commitButton = item.querySelector('.commit-button');
                    commitButton.click();
                    return null;
                } else {
                    // Select parking permit
                    let dropdownLI = item.querySelector('#option-Parking-Permit-212');
                    dropdownLI.click();
                    return null;
                }
            }
        } else {
            let bestValue = -Infinity;
            let bestValueItem = null;

            for (let item of items) {
                let dropdown = item.querySelector('.dropdownMainWrapper___PjDiT');
                if (dropdown) continue;

                if (profitability && settings['Respect Threshold']) {
                    let value = Number(item.getAttribute('data-hf-value'));
                    if (value < threshold) continue;
                }

                if (profitability && settings['Prioritise Profitability']) {
                    let value = Number(item.getAttribute('data-hf-value'));
                    if (value > bestValue) {
                        let commitButton = item.querySelector('.commit-button');
                        if (commitButton.classList.contains('disabled')) continue;

                        bestValue = value;
                        bestValueItem = item;
                    }

                    continue;
                }


                let materials = item.querySelectorAll('.itemCell___aZaUE');

                // If some material is unavailable, then select it
                for (let material of materials) {
                    if (!material) continue;

                    let amountLeft = material.querySelector('span')?.textContent?.replace('%', '');
                    if (amountLeft == 0) {
                        let consume = material.querySelector('.consume___VXIEH');
                        if (consume) continue;

                        let unavailable = item.classList.contains('hf-unavailable-inventory');
                        if (unavailable) continue;

                        material.parentNode.click();

                        let selectItemBtn = null;

                        setTimeout(function() {
                            selectItemBtn = document.body.querySelector('.importItemPopover___ACpCG .buttonWrap___h7dcO');
                            if (!selectItemBtn) {
                                item.classList.add('hf-unavailable-inventory');

                                return;
                            }

                            selectItemBtn.classList.add('hf-select-item-btn');
                        }, 500);

                        done = true;
                        break;
                    }
                }

                if (done) break;

                let commitButton = item.querySelector('.commit-button');
                if (commitButton.classList.contains('disabled')) continue;

                commitButton.click();
                done = true;
                break;
            }

            if (bestValueItem) {
                let commitButton = bestValueItem.querySelector('.commit-button');
                if (commitButton.classList.contains('disabled')) return;

                commitButton.click();
                done = true;
            }

            if (!done) forgery(items, true);
            return null;
        }
    }

    // HELPER function to find and click the best item in the SCAMMING crime
    function scamming(items, forcespam = false) {
        let done = false;

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let commitButtons = document.body.querySelectorAll('.commit-button');

        // If emails less than 20k, farm emails
        let emails = Number(document.body.querySelector('.count___dBcR7').textContent.replaceAll(',', ''));
        if (emails < 20000 && !commitButtons[0].classList.contains('disabled')) {
            commitButtons[0].click();
            done = true;
            return;
        }

        if (done) return;

        let scraperPhisher = document.body.querySelectorAll('.scraperPhisher___oy1Wn');

        // If scraper wanted and not available, try to get it
        if (settings.Scraper) {
            if (!scraperPhisher || scraperPhisher.length < 1) {
                commitButtons[0].click();
                done = true;
                return;
            } else {
                let found = false;

                for (let icon of scraperPhisher) {
                    let ariaLabel = icon.getAttribute('aria-label');
                    if (ariaLabel === "Scraper active") found = true;
                }

                if (found === false && !commitButtons[0].classList.contains('disabled')) {
                    commitButtons[0].click();
                    done = true;
                    return;
                }
            }
        }

        if (done) return;

        // If phisher wanted and not available, try to get it
        if (settings.Phisher) {
            if (!scraperPhisher || scraperPhisher.length < 1) {
                commitButtons[0].click();
                done = true;
                return;
            } else {
                let found = false;

                for (let icon of scraperPhisher) {
                    let ariaLabel = icon.getAttribute('aria-label');
                    if (ariaLabel === "Phisher active") found = true;
                }

                if (found === false && !commitButtons[0].classList.contains('disabled')) {
                    commitButtons[0].click();
                    done = true;
                    return;
                }
            }
        }

        if (done) return;

        let levelInfo = {
            'delivery scam': 1,
            'family scam': 1,
            'prize scam': 1,
            'charity scam': 20,
            'tech support scam': 20,
            'vacation scam': 40,
            'tax scam': 40,
            'advance-fee scam': 60,
            'job scam': 60,
            'romance scam': 80,
            'investment scam': 80,
        };

        if (items.length < 4 || forcespam) {
            // fetch selected dropdown
            let selectedDropdown = document.body.querySelector('.dropdownMainWrapper___PjDiT');

            let dropdown = document.body.querySelector('.dropdown-additional-content');

            // Reverse array to start high to low
            let options = Array.from(dropdown.querySelectorAll('li')).reverse();

            // If diminished, then find not-diminished options
            for (let option of options) {
                if (option.classList.contains('diminished')) continue;

                if (option.getAttribute('aria-disabled') == 'true') continue;

                let optionName = [...option.querySelector('.optionWithLevelRequirement___cHH35').childNodes]
                .find(node => node.nodeType === Node.TEXT_NODE)?.textContent.trim() || '';

                let selectedName = [...selectedDropdown.querySelector('.optionWithLevelRequirement___cHH35').childNodes]
                .find(node => node.nodeType === Node.TEXT_NODE)?.textContent.trim() || '';

                let level = levelInfo[optionName.toLowerCase()];

                if (level < settings.ScammingMinLevel) continue;

                if (optionName === selectedName) {
                    let diminished = selectedDropdown.querySelector('button .diminishedIconWrapper___ntun9');
                    if (!diminished && !commitButtons[1].classList.contains('disabled')) {
                        commitButtons[1].click();
                        done = true;
                        return;
                    }
                }

                option.click();
                done = true;
                return;
            }

            if (!done) {
                let button = document.body.querySelector('.hf-lazy-crimes-button');
                button.title = 'No spam waves recommended within preferred settings';
                button.classList.add('hf-below-threshold');
                done = true;
                return;
            }
        }

        if (done) return;

        let options = ['strong', 'soft', 'back', 'accelerate', 'capitalize', 'dollar'];

        for (let item of items) {
            let emails = item.querySelector('.emailAddresses___ky_qG');
            if (emails) continue;

            let dropdown = item.querySelector('.dropdownMainWrapper___PjDiT');
            if (dropdown) continue;

            let abandonInfo = item.querySelector('.abandon-confirmation');
            if (abandonInfo && !abandonInfo.classList.contains('hidden___omYpZ')) {
                abandonInfo.querySelector('button').click();
                done = true;
                return;
            }

            let commitButton = item.querySelector('.commit-button');
            if (!commitButton) continue;

            let hesitation = item.querySelector('.hesitation___Hk0Ed');
            if (hesitation) continue;

            let buttonLabel = commitButton.getAttribute('aria-label');
            if (buttonLabel === 'You have already scammed this target') continue;

            let read = commitButton.querySelector('.noNerveCost___BCwZI');
            if (mobile && !read) read = commitButton.querySelector('#iconmonstr-eye-6-2');

            if (read && !commitButton.classList.contains('disabled')) {
                commitButton.click();
                done = true;
                return;
            }

            let crime = item.querySelector('.crime-option');
            let moraleInfo = crime.getAttribute('data-cm-action');
            if (!moraleInfo) continue;

            if (moraleInfo === "abandon") {
                if (!mobile) {
                    let quitButton = item.querySelector('.avatarButton___AQjYM');
                    if (quitButton) {
                        quitButton.click();
                        done = true;
                        return;
                    }
                } else {
                    // Just skip the target on mobile
                    continue;
                }
            }

            if (buttonLabel === 'Resolve, 3 nerve') {
                commitButton.click();
                done = true;
                return;
            }

            let index = options.findIndex(option => moraleInfo === option);
            if (index < 0) continue;

            // Different layout for mobile
            if (mobile) {
                let unselected = item.querySelector('.responseToggleQuestionMark___eHwpF');
                let responseWrapper = item.querySelector('.tabletResponseSelector___pEUzk');

                if (responseWrapper && !unselected) {
                    // If no response selected yet, select response in responsewrapper

                    let selected = null;
                    let recommended = null;

                    let responses = item.querySelectorAll('.response-type-button');
                    let selectedElement = item.querySelector('.selectedTabletResponseTypeCircle___pY4g4 g');

                    if (selectedElement) {
                        selected = selectedElement.id;
                        let recommendedElement = responses[index].querySelector('g');
                        recommended = recommendedElement.id;
                    } else {
                        selectedElement = item.querySelector('.capitalize___DVAmV');;
                        selected = 'capitalize';
                        recommended = 'capitalize';
                    }

                    if (recommended && selected && recommended === selected) {
                        if (commitButton.classList.contains('disabled')) continue;

                        commitButton.click();
                        done = true;
                        return;
                    } else {
                        responses[index].click();
                        done = true;
                        return;
                    }

                } else if (!responseWrapper) {
                    // If no response selected yet and responsewrapper not available, open responsewrapper

                    let expandButton = item.querySelector('.expandResponseTypeButton___RQkvW');
                    expandButton.click();
                    done = true;
                    return;
                } else if (!unselected) {
                    // If response selected, do crime

                    if (commitButton.classList.contains('disabled')) continue;

                    commitButton.click();
                    done = true;
                    return;
                } else {
                    // If no response selected, select response

                    let responses = item.querySelectorAll('.response-type-button');

                    responses[index].click();
                    done = true;
                    return;
                }
            } else {
                // Not mobile, but desktop

                let responses = item.querySelectorAll('.response-type-button');

                if (!responses[index].classList.contains('selected___jDOCY')) {
                    // If no response selected, select it
                    responses[index].click();
                    done = true;
                    return;
                } else {
                    // If response selected, do the crime
                    if (commitButton.classList.contains('disabled')) continue;

                    commitButton.click();
                    done = true;
                    return;
                }
            }
        }

        if (!done) {
            // If no available items, spam some instead
            scamming(items, true);
        }
    }

    let arsoncrimes = [];

    function arson(items) {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let parsed = document.body.querySelector('.hf-parsed');

        if (!parsed) {
            parseArson(items);
        }

        let currentLevel = Number(document.body.querySelector('.statistic___YkyjL .value___S0RNN').textContent);

        let previous = document.body.querySelector('.hf-previous-action');

        let nextStepsPrevious = previous?.getAttribute('hf-next-steps')?.split(',') || [];

        let skip = false;
        if (nextStepsPrevious.includes('skip')) {
            skip = true;
        }

        let previousCommitBtn = previous?.querySelector('commit-button');
        let disabled = previousCommitBtn?.classList.contains('disabled');

        if (nextStepsPrevious.includes('commit') && disabled) {
            skip = true;
        }

        let lazyBtn = document.body.querySelector('.hf-lazy-crimes-button');

        let next;

        if (previous && nextStepsPrevious && nextStepsPrevious.length && nextStepsPrevious.length >= 1 && !skip) {
            next = previous;
        } else {
            let commitCandidate = null;

            for (let item of items) {
                if (previous && item === previous) continue;

                let nextSteps = item.getAttribute('hf-next-steps')?.split(',') || [];

                if (nextSteps.includes('skip')) {
                    continue;
                }

                let hasCommit = nextSteps.includes('commit');
                let commitBtn = item.querySelector('commit-button');
                let disabled = commitBtn?.classList.contains('disabled');

                // Skip those pesky damage requirements or empty crimes
                if (!nextSteps || !nextSteps.length || nextSteps.includes('skip')) continue;

                // For higher nerve: prefer non-commit, remember a commit in case we need it
                if (nerve > 15) {
                    if (hasCommit) {
                        if (!commitCandidate) commitCandidate = item;
                        continue;
                    }

                    next = item;
                    break;
                }

                // For low nerve: only take commit items
                if (!hasCommit) continue;

                next = item;
                break;
            }

            // Fallback for nerve > 15: use commitCandidate if nothing else found
            if (!next && nerve > 15 && commitCandidate) next = commitCandidate;
        }

        if (!next) {

            // Warning no more arsons possible due to nerve or otherwise
            lazyBtn.title = 'No available arson found on last click';

            lazyBtn.classList.add('hf-no-arson');

            return;
        }

        next.classList.add('hf-previous-action');

        let nextSteps = next.getAttribute('hf-next-steps')?.split(',');

        let commitBtn = next.querySelector('.commit-button');

        // PreferredLiquids' || item === 'PreferredSolids' || item === 'PreferredGases
        // let steps = nextSteps.split(','); // turns "gasoline,lighter,..." into ["gasoline","lighter",...]
        for (let step of nextSteps) {
            next.classList.add('hf-previous-action');

            if (step === 'commit') {
                if (commitBtn.classList.contains('disabled')) {
                    let failedBtn = next.querySelector('.dismissButton___PjSEg');
                    if (failedBtn && !failedBtn.classList.contains('disabled')) {
                        failedBtn.click();
                    }

                    let ariaLabel = commitBtn.getAttribute('aria-label');
                    if (ariaLabel.includes(`You don't have the required item`)) {
                        next.title = `Please buy the item required for this crime. Skipping for now...`;
                    }

                    return;
                }

                commitBtn.click();

                let buttonTitle = mobile
                ? commitBtn.getAttribute('aria-label')?.split(',')[0]
                : commitBtn?.querySelector('.title___kEtkc')?.textContent?.trim() || '';

                if (buttonTitle !== 'Collect') {
                    if (nerve < 15) {
                        next.classList.remove('hf-previous-action');
                    }

                    setTimeout(() => parseArson([next]), 30);
                } else {
                    next.setAttribute('hf-next-steps', 'skip');
                }

                return;
            } else if (step === 'lighter') {
                let lighterSettings = [
                    settings[`PreferredLighter-0`], // (Windproof) Lighter
                    settings[`PreferredLighter-1`], // Molotov Cocktail
                    settings[`PreferredLighter-2`] // Flamethrower
                ];

                // Default fallback order
                let preferredIndex = 0;
                let firstBackupIndex = 1;
                let secondBackupIndex = 2;

                // Build mapping based on their selected rank (1 = preferred, 2 = first backup, 3 = second backup)
                lighterSettings.forEach((rank, index) => {
                    if (rank == 1) preferredIndex = index;
                    else if (rank == 2) firstBackupIndex = index;
                    else if (rank == 3) secondBackupIndex = index;
                });

                selectArsonItem(step, next, '.igniters___sGPAS .button___TEova', ['Windproof Lighter selected', 'Lighter selected', 'Molotov Cocktail selected', 'Flamethrower selected'], preferredIndex, [firstBackupIndex, secondBackupIndex]);
                break;
            } else if (step === 'flamethrower') {
                selectArsonItem(step, next, '.igniters___sGPAS .button___TEova', ['Flamethrower selected'], 2, [0, 1]);
                break;
            } else if (step === 'liquids') {
                let liquidSettings = [
                    settings[`PreferredLiquids-0`], // Gasoline
                    settings[`PreferredLiquids-1`], // Diesel
                    settings[`PreferredLiquids-2`] // Kerosene
                ];

                // Default fallback order
                let preferredIndex = 0;
                let firstBackupIndex = 1;
                let secondBackupIndex = 2;

                // Build mapping based on their selected rank (1 = preferred, 2 = first backup, 3 = second backup)
                liquidSettings.forEach((rank, index) => {
                    if (rank == 1) preferredIndex = index;
                    else if (rank == 2) firstBackupIndex = index;
                    else if (rank == 3) secondBackupIndex = index;
                });

                selectArsonItem(step, next, '.liquids___Q3XGp .button___TEova', ['Gasoline selected', 'Diesel selected', 'Kerosene selected'], preferredIndex, [firstBackupIndex, secondBackupIndex]);
                break;
            } else if (step === 'solids') {
                let solidSettings = [
                    settings[`PreferredSolids-0`], // Potassium Nitrate
                    settings[`PreferredSolids-1`], // Magnesium Shavings
                    settings[`PreferredSolids-2`] // Thermite
                ];

                // Default fallback order
                let preferredIndex = 0;
                let firstBackupIndex = 1;
                let secondBackupIndex = 2;

                // Build mapping based on their selected rank (1 = preferred, 2 = first backup, 3 = second backup)
                solidSettings.forEach((rank, index) => {
                    if (rank == 1) preferredIndex = index;
                    else if (rank == 2) firstBackupIndex = index;
                    else if (rank == 3) secondBackupIndex = index;
                });

                selectArsonItem(step, next, '.solids___BMIq8 .button___TEova', ['Potassium Nitrate selected', 'Magnesium Shavings selected', 'Thermite selected'], preferredIndex, [firstBackupIndex, secondBackupIndex]);
                break;
            } else if (step === 'gases') {
                let gasesSettings = [
                    settings[`PreferredGases-0`], // Oxygen Tank
                    settings[`PreferredGases-1`], // Methane Tank
                    settings[`PreferredGases-2`] // Hydrogen Tank
                ];

                // Default fallback order
                let preferredIndex = 0;
                let firstBackupIndex = 1;
                let secondBackupIndex = 2;

                // Build mapping based on their selected rank (1 = preferred, 2 = first backup, 3 = second backup)
                gasesSettings.forEach((rank, index) => {
                    if (rank == 1) preferredIndex = index;
                    else if (rank == 2) firstBackupIndex = index;
                    else if (rank == 3) secondBackupIndex = index;
                });

                selectArsonItem(step, next, '.gases___fvdZW .button___TEova', ['Oxygen Tank selected', 'Methane Tank selected', 'Hydrogen Tank selected'], preferredIndex, [firstBackupIndex, secondBackupIndex]);
                break;
            } else if (step === 'gasoline') {
                selectArsonItem(step, next, '.liquids___Q3XGp .button___TEova', ['Gasoline selected'], 0);
                break;
            } else if (step === 'diesel') {
                selectArsonItem(step, next, '.liquids___Q3XGp .button___TEova', ['Diesel selected'], 1);
                break;
            } else if (step === 'magnesium') {
                selectArsonItem(step, next, '.solids___BMIq8 .button___TEova', ['Magnesium Shavings selected'], 1);
                break;
            }
        }
    }


    function selectArsonItem(step, crime, itemSelectors, selectedLabels, index, backupIndexes) {
        let itemBtn = crime.querySelector('.itemButton___Y_SMO');
        let ariaLabel = itemBtn.getAttribute('aria-label');
        let expanded = crime.classList.contains('hf-expanded');
        let selected = selectedLabels.some(label => ariaLabel === label);

        let itemSelectBtn = document.body.querySelectorAll(itemSelectors)[index];

        let test = document.body.querySelector('.igniters___sGPAS .button___TEova');

        let nextSteps = crime.getAttribute('hf-next-steps')?.split(',');

        if (selected) {
            // Commit button
            let commitBtn = crime.querySelector('.commit-button');
            if (commitBtn.classList.contains('disabled')) return;
            commitBtn.click();

            nextSteps = nextSteps.filter(anyStep => anyStep !== step);
            crime.setAttribute('hf-next-steps', nextSteps.join(','));

            if (!nextSteps.length) {
                crime.setAttribute('hf-next-steps', 'skip');

                let crimesApp = document.querySelector('.crimes-app');
                createObserver(crimesApp);
            }
        } else {
            if (expanded) {
                if (!itemSelectBtn) {
                    console.warn('Something went wrong. Exiting button click');
                    return;
                }

                let lockIcon = itemSelectBtn.querySelector('.lockIcon___h2PQr');
                let silhouette = itemSelectBtn.querySelector('.silhouette___xNt7X'); // Has unlocked, but not in inventory
                if (!lockIcon && silhouette) lockIcon = silhouette;

                if (lockIcon) {
                    if (!backupIndexes) {
                        // Give warning to buy item - link to item
                        // Check if locked, else say need to do unique or smth

                        if (silhouette) {
                            crime.title = `Please buy the item required for the step "${step}". Skipping for now...`
                        } else {
                            crime.title = `You have not yet unlocked the required item for the step ${step}. Skipping for now...`
                        }

                        return;
                    }

                    let backups = false;

                    for (let backupIndex of backupIndexes) {
                        itemSelectBtn = document.body.querySelectorAll(itemSelectors)[backupIndex];
                        let newLockIcon = itemSelectBtn.querySelector('.lockIcon___h2PQr');
                        let newSilhouette = itemSelectBtn.querySelector('.silhouette___xNt7X'); // Has unlocked, but not in inventory
                        if (!newLockIcon && newSilhouette) newLockIcon = newSilhouette

                        if (newLockIcon) {
                            continue;
                        } else {
                            backups = true;
                        }
                    }

                    if (!backups) {
                        // Give warning to buy item - link to item
                        // Check if locked, else say need to do unique or smth

                        if (silhouette) {
                            crime.title = `Please buy the item required for the step "${step}". Skipping for now...`
                        } else {
                            crime.title = `You have not yet unlocked the required item for ${step}. Skipping for now...`
                        }

                        return;
                    }
                }

                itemSelectBtn.click();

                crime.classList.remove('hf-expanded');

                return;
            } else {
                itemBtn.click();

                crime.classList.add('hf-expanded');

                return;
            }
        }
    }

    function parseArson(items) {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        for (let item of items) {
            let scenarioTitleElement = item.querySelector(mobile ? '.titleMeterIcons___xfLVM' : '.titleAndScenario___uWExi');
            if (!scenarioTitleElement) continue;

            let title = scenarioTitleElement.querySelector('div')?.textContent?.trim() || '';
            let scenario = scenarioTitleElement.querySelector('.scenario___msSka')?.textContent?.trim() || '';
            let responderStatus = item.querySelector('.responderStatus___yrWz5')?.getAttribute('aria-label') || '';
            let buildingDamage = item.querySelector('.buildingDamage___St7d7')?.getAttribute('aria-label') || '';
            let requestIcons = item.querySelectorAll('.requestIcons___MTCKd .requestIcon___do0I_');
            let type = requestIcons[0]?.getAttribute('aria-label') || '';

            let requests = new Set();
            let tooltipWrappers = item.querySelectorAll('.requestIcons___MTCKd .tooltipWrapperForC5___wR9EY');
            for (let tooltip of tooltipWrappers) {
                let label = tooltip.getAttribute('aria-label');
                if (label) requests.add(label);
            }

            for (let icon of [...requestIcons].slice(1)) {
                let label = icon.getAttribute('aria-label');
                if (label) requests.add(label);
            }

            let fireMeter = item.querySelector('.fireMeter___cexDs')?.getAttribute('aria-label') || '';

            let commitBtn = item.querySelector('.commit-button');
            let buttonTitle = mobile
            ? commitBtn.getAttribute('aria-label')?.split(',')[0]
            : commitBtn?.querySelector('.title___kEtkc')?.textContent?.trim() || '';

            if (!buttonTitle) {
                setTimeout(() => parseArson([item]), 50);
                continue;
            }

            if (buttonTitle == 'Inquire' || buttonTitle == 'Breach' || buttonTitle == 'Plant' || buttonTitle == 'Collect') {
                item.setAttribute('hf-next-steps', 'commit');
            } else if (buildingDamage !== 'Building with no visible damage') {
                // Skipping for now for no duplicate arsons upon refresh
            } else if (requests.has('Total destruction required')) {
                // Skipping for now ~ possibly too complex to lazify

                item.setAttribute('hf-next-steps', 'skip');

                // item.setAttribute('hf-min-destruction', 100);
                // item.setAttribute('hf-warning', 'damage');
            } else if ([...requests].some(req => /more than.*damage required/i.test(req))) {
                // Skipping for now ~ possibly too complex to lazify

                // let match = [...requests]
                // .map(req => req.match(/more than\s*(\d+)%\s*damage required/i))
                // .find(Boolean);

                // let damageRequired = match ? parseInt(match[1], 10) : 0;

                // console.log("More than this damage required:", damageRequired, item);

                item.setAttribute('hf-next-steps', 'skip');
                // item.setAttribute('hf-min-destruction', damageRequired);
                // item.setAttribute('hf-warning', 'damage');
            } else if ([...requests].some(req => /less than.*damage required/i.test(req))) {
                // Skipping for now ~ possibly too complex to lazify

                // let match = [...requests]
                // .map(req => req.match(/less than\s*(\d+)%\s*damage required/i))
                // .find(Boolean);

                // let damageRequired = match ? parseInt(match[1], 10) : 0;

                // console.log("LESS than this damage required:", damageRequired, item);

                item.setAttribute('hf-next-steps', 'skip');
                // item.setAttribute('hf-max-destruction', damageRequired);
                // item.setAttribute('hf-warning', 'damage');
            } else if ([...requests].some(req => /between.*damage required/i.test(req))) {
                // Skipping for now ~ possibly too complex to lazify

                // let match = [...requests]
                // .map(req => req.match(/between\s*(\d+)%\s*and\s*(\d+)%\s*damage required/i))
                // .find(Boolean);

                // let minDamageRequired = match ? parseInt(match[1], 10) : 0;
                // let maxDamageRequired = match ? parseInt(match[2], 10) : 0;

                // console.log("Min damage required:", minDamageRequired, item);
                // console.log("Max damage required:", maxDamageRequired, item);

                item.setAttribute('hf-next-steps', 'skip');
                // item.setAttribute('hf-min-destruction', minDamageRequired);
                // item.setAttribute('hf-max-destruction', maxDamageRequired);
                // item.setAttribute('hf-warning', 'damage');
            } else if (requests.has('Accelerant requested: Gaseous')) {
                item.setAttribute('hf-next-steps', 'gases,lighter');
                item.setAttribute('hf-warning', 'gaseous');
            } else if (requests.has('Accelerant requested: Liquids')) {
                item.setAttribute('hf-next-steps', 'liquids,lighter');
                item.setAttribute('hf-warning', 'gaseous');
            } else if (requests.has('Accelerant requested: Solids')) {
                // Need to check if this is correct

                item.setAttribute('hf-next-steps', 'solids,lighter');
                item.setAttribute('hf-warning', 'gaseous');
            } else if (requests.has('Accidental cause requested')) {
                item.setAttribute('hf-next-steps', 'gases,lighter');
                item.setAttribute('hf-warning', 'accidental');
            } else if (requests.has('High-visibility fire requested')) {
                item.setAttribute('hf-next-steps', 'diesel,flamethrower,magnesium');
                item.setAttribute('hf-warning', 'visibility');
            } else if (requests.has('Highly-suspicious fire requested')) {
                item.setAttribute('hf-next-steps', 'gasoline,lighter,magnesium');
                item.setAttribute('hf-warning', 'visibility');
            } else if ([...requests].some(r => r.startsWith('Accelerant requested:'))) {
                // Can't find info on others so will have to wait until some spawn... or not
            } else {
                // Gasoline, fire
                item.setAttribute('hf-next-steps', 'liquids,lighter');
            }

            // For gathering info, can remove upon publishing --
            let crime = {
                title,
                scenario,
                responderStatus,
                buildingDamage,
                type,
                requests: [...requests],
                fireMeter,
                buttonTitle
            };

            // Check for duplicates — identical except buttonTitle
            let isDuplicate = arsoncrimes.some(c =>
                                               c.title === crime.title &&
                                               c.scenario === crime.scenario &&
                                               c.responderStatus === crime.responderStatus &&
                                               c.buildingDamage === crime.buildingDamage &&
                                               c.type === crime.type &&
                                               JSON.stringify(c.requests) === JSON.stringify(crime.requests) &&
                                               c.fireMeter === crime.fireMeter
                                              );

            if (!isDuplicate) arsoncrimes.push(crime);
        }

        // If no ideal target reached, do "forced" rerun of the function

        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        btnContainer.classList.add('hf-parsed');
    }

    // Add the information button to the title bar
    function addInfoButton(info, retries = 30) {
        let titleBar = document.body.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');

        // If DOM isn't fully loaded, try again
        if (!titleBar) {
            if (retries > 0) {
                setTimeout(() => addInfoButton(info, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Crime Page items after 30 retries.');
            }
            return;
        }

        let icon = document.createElement('div');
        icon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" stroke="var(--default-base-navy-color)" stroke-width="2" fill="none" />
  <text x="12" y="13" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="var(--default-base-navy-color)" font-family="Arial, sans-serif">
    LC
  </text>
</svg>`;
        icon.classList.add('hf-lazy-crimes-info-icon');
        icon.title = info;

        // Different icon size on mobile due to size issues
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        if (mobile) {
            icon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" stroke="var(--default-base-navy-color)" stroke-width="2" fill="none" />
  <text x="12" y="13" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="var(--default-base-navy-color)" font-family="Arial, sans-serif">
    LC
  </text>
</svg>`;

            icon.classList.add('hf-mobile');
        }

        let btnContainer = document.body.querySelector('.hf-lazy-crimes-btn-container');
        if (!btnContainer) btnContainer = createButtonContainer(titleBar);

        btnContainer.appendChild(icon);
        disableButtons(nerve);

        return icon;
    }

    // Check the nerve bar to see if nerve is running out and give warning if it is
    function checkNerveBar(retries = 30) {
        let nerveBar = document.body.querySelector('.nerve___AyYv_');

        // If DOM isn't fully loaded, try again
        if (!nerveBar) {
            if (retries > 0) {
                setTimeout(() => checkNerveBar(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for nerve bar after 30 retries.');
            }
            return;
        }

        let barValue = nerveBar.querySelector('.bar-value___NTdce');
        let nerveValue = barValue.childNodes[0];
        nerve = Number(nerveValue.textContent);

        disableButtons(nerve);

        // Keep checking nerve
        createObserver(nerveValue);
    }

    // HELPER function to create a mutation observer and check nerve
    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    // console.log('Character change', mutation.target, mutation.target.parentNode.classList);
                    // Disable buttons if nerve goes down

                    if (mutation.target.parentNode.classList.contains('bar-value___NTdce')) {
                        nerve = Number(mutation.target.textContent);
                        disableButtons(nerve);
                    } else if (mutation.target.parentNode.classList.contains('title___kEtkc') && ['Inquire', 'Breach', 'Plant', 'Collect'].includes(mutation.target.textContent)) {
                        let crime = mutation.target.parentNode.parentNode.parentNode.parentNode.parentNode;

                        crime.setAttribute('hf-next-steps', 'commit');
                    }
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    // HELPER function to disable buttons and give a warning if (running) out of nerve
    function disableButtons(currentNerve) {
        let buttons = document.body.querySelectorAll('.hf-lazy-crimes-button');

        const config = {
            searchforcash: [{ min: 2, message: "You don't have enough nerve" }],
            bootlegging: [
                { min: 2, message: "You don't have enough nerve" },
                { min: 5, message: "You're running out of nerve" },
            ],
            graffiti: [{ min: 3, message: "You don't have enough nerve" }],
            shoplifting: [{ min: 4, message: "You don't have enough nerve" }],
            pickpocketing: [{ min: 5, message: "You don't have enough nerve" }],
            burglary: [
                { min: 2, message: "You don't have enough nerve" },
                { min: 6, message: "You're running out of nerve" },
            ],
            hustling: [
                { min: 2, message: "You don't have enough nerve" },
                { min: 4, message: "You're running out of nerve" },
            ],
            disposal: [
                { min: 6, message: "You don't have enough nerve" },
                { min: 14, message: "You're running out of nerve" },
            ],
            cracking: [{ min: 7, message: "You don't have enough nerve" }],
            forgery: [{ min: 5, message: "You don't have enough nerve" }],
            scamming: [
                { min: 3, message: "You don't have enough nerve" },
                { min: 8, message: "You're running out of nerve" },
            ],
            arson: [
                { min: 3, message: "You don't have enough nerve" },
                { min: 15, message: "You're running out of nerve" },
            ],
        };

        for (let key in config) {
            if (window.location.href.includes(key)) {
                const requirement = config[key].find(r => currentNerve < r.min);
                const disabled = Boolean(requirement);
                const title = requirement?.message || '';

                for (let button of buttons) {
                    if (button.classList.contains('hf-no-arson')) {
                        button.title = 'No available arson found on last click';
                        continue;
                    }

                    if (button.classList.contains('hf-no-body')) continue;
                    if (button.classList.contains('hf-no-crime-morale')) continue;

                    button.style.background = disabled
                        ? 'var(--default-tabs-disabled-color)'
                    : 'var(--default-blue-dark-color)';
                    button.title = title;

                    if (title.length > 1) button.classList.add('hf-no-nerve');

                    // Disable click events if message is "You don't have enough nerve"
                    if (title === "You don't have enough nerve") {
                        // Store existing click handler, if needed
                        if (!button.dataset.eventsDisabled) button.dataset.eventsDisabled = "true";
                        button.addEventListener('click', preventClick, true);
                    } else {
                        // Re-enable if previously disabled
                        button.classList.remove('hf-no-nerve');

                        button.removeEventListener('click', preventClick, true);
                        if (button.dataset.eventsDisabled) delete button.dataset.eventsDisabled;
                    }
                }
                break;
            }
        }
    }

    // HELPER function to prevent click when nerve empty
    function preventClick(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    // Add settings button to the crime hub
    function addSettings(retries = 30) {
        let headerElement = document.body.querySelector('.crimes-app-header');
        if (!headerElement) {
            if (retries > 0) {
                setTimeout(() => addSettings(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for the crime hub after 30 retries.');
            }
            return;
        }

        let icon = document.createElement('div');
        icon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" stroke="var(--default-base-navy-color)" stroke-width="2" fill="none" />
  <text x="12" y="13" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="var(--default-base-navy-color)" font-family="Arial, sans-serif">
    LC
  </text>
</svg>`;
        icon.classList.add('hf-lazy-crimes-icon');
        icon.addEventListener('click', function() {
            createModal();
        });

        let link = headerElement.querySelector('.link___bH5rN');

        headerElement.insertBefore(icon, link);

        return;
    }

    // HELPER function to create the SETTINGS modal
    function createModal() {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let cachedSettings = settings;

        let modal = document.createElement('div');
        modal.classList.add('hf-lazy-modal');

        let titleContainer = document.createElement('div');
        titleContainer.textContent = 'Lazy Crimes Settings';
        titleContainer.classList.add('hf-lazy-title-container');

        let scrollContainer = document.createElement('div');
        scrollContainer.classList.add('hf-lazy-scroll-container');

        let mainContainer = document.createElement('div');
        mainContainer.classList.add('hf-lazy-main-container');
        scrollContainer.appendChild(mainContainer);

        let creditSpan = document.createElement('span');
        creditSpan.innerHTML = `Powered by <a href="https://www.torn.com/profiles.php?XID=2626587" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Heartflower [2626587]</a>
        and <a href="https://www.torn.com/profiles.php?XID=2535044" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Emforus [2535044]</a>'s guides.
        Requires the <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16430177&b=0&a=0rh=82&" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Crime Morale Script</a>
        by <a href="https://www.torn.com/profiles.php?XID=1617955" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">tobytorn [1617955]</a> for Scamming to work.`;
        creditSpan.classList.add('hf-credit-span');
        mainContainer.appendChild(creditSpan);

        let checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('hf-checkbox-container');

        let infoSpan = document.createElement('span');
        infoSpan.textContent = 'Enable/disable which crimes you want the Lazy Crimes button and/or merit button(s) to appear for here.';
        checkboxDiv.appendChild(infoSpan);

        let crimes = {
            'Enable All': [],
            'Search For Cash': ['Spoiled Rotten', 'Shore Thing'],
            'Bootlegging': ['Cinephile', 'Online Entrepreneur'],
            'Graffiti': [],
            'Shoplifting': ['Notorious'],
            'Pickpocketing': [],
            'Card Skimming': [],
            'Burglary': ['Key to the City', 'PreferredBurglaryScout', 'MinimumBurglaryConfidence'],
            'Hustling': [],
            'Disposal': ['Dissolving Agent', 'No Dissolving', 'Always Abandon', 'Low Nerve First'],
            'Cracking': [],
            'Forgery': ['PreferredForgeryProject'],
            'Scamming': ['Scraper', 'Phisher', 'ScammingMinLevel', 'Floating Button'],
            'Arson': ['PreferredLighter', 'PreferredLiquids', 'PreferredSolids' ,'PreferredGases'],
        }

        for (let crime in crimes) {
            // Create container for the crime
            let crimeContainer = document.createElement('div');
            crimeContainer.classList.add('hf-lazy-crime-container');

            // Add toggle for the main crime
            addToggle(crimeContainer, crime);

            // If there are subitems, add toggles for each
            if (crimes[crime].length > 0) {
                for (let item of crimes[crime]) {
                    if (item === 'ScammingMinLevel') {
                        let toggleContainer = document.createElement('div');
                        toggleContainer.classList.add('hf-lazy-toggle-container');
                        toggleContainer.classList.add('hf-sub-settings');

                        let explanationSpan = document.createElement('span');
                        explanationSpan.textContent = 'Minimum Level:';
                        toggleContainer.appendChild(explanationSpan);

                        createNumberInput('ScammingMinLevel', toggleContainer);

                        crimeContainer.appendChild(toggleContainer);

                        continue;
                    } else if (item === 'MinimumBurglaryConfidence') {
                        let toggleContainer = document.createElement('div');
                        toggleContainer.classList.add('hf-lazy-toggle-container');
                        toggleContainer.classList.add('hf-sub-settings');

                        let explanationSpan = document.createElement('span');
                        explanationSpan.textContent = 'Minimum Confidence:';
                        toggleContainer.appendChild(explanationSpan);

                        createNumberInput('MinimumBurglaryConfidence', toggleContainer);

                        crimeContainer.appendChild(toggleContainer);

                        continue;
                    } else if (item === 'PreferredBurglaryScout') {
                        let toggleContainer = document.createElement('div');
                        toggleContainer.classList.add('hf-lazy-toggle-container');
                        toggleContainer.classList.add('hf-sub-settings');

                        let values = ['Any Residential', 'Tool Shed', 'Beach Hut', 'Mobile Home', 'Bungalow',
                                      'Cottage', 'Apartment', 'Suburban Home', 'Secluded Cabin', 'Farmhouse',
                                      'Lake House', 'Luxury Villa', 'Manor House', 'Any Commercial', 'Self Storage Facility',
                                      'Postal Office', 'Funeral Directors', 'Market', 'Cleaning Agency', 'Barbershop',
                                      'Liquor Store', 'Dentists Office', 'Chiropractors', 'Recruitment Agency',
                                      'Advertising Agency', 'Any Industrial', 'Shipyard', 'Dockside Warehouse', 'Farm Storage Unit',
                                      'Printing Works', 'Brewery', 'Truckyard', 'Old Factory', 'Slaughterhouse', 'Paper Mill',
                                      'Foundry', 'Fertilizer Plant'];

                        let explanationSpan = document.createElement('span');
                        explanationSpan.textContent = 'Preferred Scout:';
                        toggleContainer.appendChild(explanationSpan);

                        createDataList(toggleContainer, values, 'PreferredBurglaryScout');

                        crimeContainer.appendChild(toggleContainer);

                        continue;
                    } else if (item === 'PreferredForgeryProject') {
                        let toggleContainer = document.createElement('div');
                        toggleContainer.classList.add('hf-lazy-toggle-container');
                        toggleContainer.classList.add('hf-sub-settings');

                        let values = [`Driver's License`, 'Parking Permit', 'Concert Ticket',
                                      'Birth Certificate', 'Diploma', 'License Plate', 'Skeleton Key',
                                      'Prescription', 'Travel Visa', 'ID Badge', 'Police Badge',
                                      'Bank Check', 'ATM Key', 'Passport'];

                        let explanationSpan = document.createElement('span');
                        explanationSpan.textContent = 'Preferred Project:';
                        toggleContainer.appendChild(explanationSpan);

                        createDataList(toggleContainer, values, 'PreferredForgeryProject');

                        crimeContainer.appendChild(toggleContainer);

                        continue;
                    } else if (item === 'PreferredLighter' || item === 'PreferredLiquids' || item === 'PreferredSolids' || item === 'PreferredGases') {
                        let toggleContainer = document.createElement('div');
                        toggleContainer.classList.add('hf-lazy-toggle-container');
                        toggleContainer.classList.add('hf-sub-settings');
                        toggleContainer.classList.add('hf-arson-priorities-container');

                        let lighters = ['(Windproof) Lighter', 'Molotov Cocktail', 'Flamethrower'];
                        let liquids = ['Gasoline', 'Diesel', 'Kerosene'];
                        let solids = ['Potassium Nitrate', 'Magnesium Shavings', 'Thermite'];
                        let gases = ['Oxygen Tank', 'Methane Tank', 'Hydrogen Tank'];

                        let options = [];
                        let text = '';

                        if (item === 'PreferredLighter') {
                            text = 'Preferred Lighters:';
                            options = lighters;
                        } else if (item === 'PreferredLiquids') {
                            text = 'Preferred Liquids:';
                            options = liquids;
                        } else if (item === 'PreferredSolids') {
                            text = 'Preferred Solids:';
                            options = solids;
                        } else if (item === 'PreferredGases') {
                            text = 'Preferred Gases:';
                            options = gases;
                        }

                        let explanationSpan = document.createElement('span');
                        explanationSpan.textContent = `${text} (rank 1-3 with 1 highest priority):`;
                        toggleContainer.appendChild(explanationSpan);

                        let optionsContainer = document.createElement('ul');
                        optionsContainer.classList.add('hf-arson-priorities-subcontainer');
                        toggleContainer.appendChild(optionsContainer);

                        for (let [index, option] of options.entries()) {
                            let subContainer = document.createElement('li');
                            let subSpan = document.createElement('span');
                            subSpan.textContent = `${option}:`;
                            subContainer.appendChild(subSpan);

                            createNumberInput(`${item}-${index}`, subContainer, 3, index + 1);

                            optionsContainer.appendChild(subContainer);
                        }

                        crimeContainer.appendChild(toggleContainer);

                        continue;
                    } else if (item === 'Floating Button' && !mobile) {
                        continue;
                    }

                    let toggle = addToggle(crimeContainer, item, crimes[crime]);
                    toggle.style.marginLeft = '20px';
                }
            }

            // Append container to the page (adjust target parent as needed)
            checkboxDiv.appendChild(crimeContainer);
        }

        let profitabilityInfo = document.createElement('span');
        profitabilityInfo.innerHTML = `Compatibility with the <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16382463&b=0&a=0" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Crime Profitability</a> script:`
        profitabilityInfo.classList.add('hf-profitability-info');
        checkboxDiv.appendChild(profitabilityInfo);


        let profitabilityExtraInfo = document.createElement('span');
        profitabilityExtraInfo.textContent = '(Search for Cash, Shoplifting, Pickpocketing, Disposal, Cracking, Forgery)'
        profitabilityExtraInfo.classList.add('hf-profitability-extra-info');
        checkboxDiv.appendChild(profitabilityExtraInfo);

        let profitability = document.body.querySelector('.hf-sort-button');
        if (!profitability) {
            profitabilityExtraInfo.textContent = `The Crime Profitability script cannot be detected. To avoid issues, all compatibility settings are automatically disabled.`;
            settings['Respect Threshold'] = false;
            settings['Prioritise Profitability'] = false;

            localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));
        } else {
            let profitabilitySettings = ['Enable All', 'Respect Threshold', 'Prioritise Profitability']
            for (let setting of profitabilitySettings) {
                // Create container for the crime
                let profitabilityContainer = document.createElement('div');
                profitabilityContainer.classList.add('hf-profitability-container');

                if (mobile) profitabilityContainer.classList.add('hf-mobile');

                addToggle(profitabilityContainer, setting, 'Profitability');

                // Append container to the page (adjust target parent as needed)
                checkboxDiv.appendChild(profitabilityContainer);
            }
        }

        mainContainer.appendChild(checkboxDiv);

        // Create a container for "Done" and "Cancel" buttons
        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('hf-lazy-button-container');

        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('hf-lazy-cancel-btn');
        cancelButton.addEventListener('click', function () {
            settings = cachedSettings;
            localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));
            modal.remove();
        });
        buttonContainer.appendChild(cancelButton);

        let doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.classList.add('hf-lazy-done-btn');
        doneButton.addEventListener('click', function () {
            location.reload();
            modal.remove();
        });
        buttonContainer.appendChild(doneButton);

        modal.appendChild(titleContainer);
        modal.appendChild(scrollContainer);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);

        return modal;
    }

    // HELPER function to add the checkbox toggle in the SETTINGS modal
    function addToggle(container, labelText, mainCrime) {
        let toggleContainer = document.createElement('div');
        toggleContainer.classList.add('hf-lazy-toggle-container');

        let text = document.createElement('span');
        text.textContent = labelText;
        text.classList.add('hf-label-text');

        let label = document.createElement('label');
        label.classList.add('switch');

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('hf-checkbox');
        if (mainCrime === 'Profitability') input.classList.add('hf-profitability-toggles');

        input.checked = true; // Check on by default

        let span = document.createElement('span');
        span.classList.add('slider', 'round');

        let savedInfo = settings[labelText];

        if (savedInfo === true) input.checked = true;
        if (!savedInfo || savedInfo === false) input.checked = false;

        if (labelText === 'Enable All') input.checked = false;

        settings[labelText] = input.checked;
        localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));

        toggleContainer.appendChild(label);
        toggleContainer.appendChild(text);
        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(toggleContainer);

        // Add event listener to detect changes in the checkbox state
        input.addEventListener('change', function(event) {
            const isSynthetic = event.__synthetic === true;

            if (input.checked) {
                settings[labelText] = true;
                localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));

                if (isSynthetic) return;

                if (labelText === 'Enable All') {
                    let inputs = document.body.querySelectorAll('.hf-checkbox');
                    if (mainCrime === 'Profitability') inputs = document.body.querySelectorAll('.hf-profitability-toggles');

                    for (let otherInput of inputs) {
                        if (otherInput === input) continue;
                        if (mainCrime !== 'Profitability' && otherInput.classList.contains('hf-profitability-toggles')) continue;

                        otherInput.checked = true;
                        let changeEvent = new Event('change', { bubbles: true });
                        changeEvent.__synthetic = true;
                        otherInput.dispatchEvent(changeEvent);
                    }

                    text.textContent = 'Disable All';
                    return;
                }

                if (mainCrime) {
                    let specificInput = container.querySelector('.hf-checkbox');
                    if (specificInput !== input) {
                        specificInput.checked = true;
                        let changeEvent = new Event('change', { bubbles: true });
                        changeEvent.__synthetic = true;
                        specificInput.dispatchEvent(changeEvent);
                    }
                }
            } else {
                settings[labelText] = false;
                localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));

                if (isSynthetic) return;

                if (labelText === 'Enable All' || labelText === 'Disable All') {
                    let inputs = document.body.querySelectorAll('.hf-checkbox');
                    if (mainCrime === 'Profitability') inputs = document.body.querySelectorAll('.hf-profitability-toggles');

                    for (let otherInput of inputs) {
                        if (otherInput === input) continue;

                        if (mainCrime !== 'Profitability' && otherInput.classList.contains('hf-profitability-toggles')) continue;

                        otherInput.checked = false;
                        let changeEvent = new Event('change', { bubbles: true });
                        changeEvent.__synthetic = true;
                        otherInput.dispatchEvent(changeEvent);
                    }

                    text.textContent = 'Enable All';
                    return;
                }
            }
        });

        return toggleContainer;
    }

    function noProfitabilityDetected() {
        let icon = document.body.querySelector('.hf-lazy-crimes-info-icon');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.title = `Please install the Crime Profitability Script or disable Crime Profitability Settings`;
            icon.addEventListener('click', function() {
                window.open(`https://www.torn.com/forums.php#/p=threads&f=67&t=16382463&b=0&a=0`, '_blank', 'noopener');
            });
        }
    }

    // HELPER FUNCTION to create a real Number input
    function createNumberInput(setting, element, max, value) {
        if (!value) value = 1

        let input = document.createElement('input');
        input.className = 'hf-number-input';
        input.type = 'number';
        input.min = 1;
        input.max = 80;
        input.value = settings[setting] || value;
        if (setting === 'MinimumBurglaryConfidence') input.value = settings[setting] || 80;
        if (max) input.max = max;

        element.appendChild(input);

        input.addEventListener('input', function () {
            settings[setting] = input.value;
            localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));
        });

        return input;
    }


    // HELPER FUNCTION to create a "Number" input
    function createTextNumberInput(element) {
        let input = document.createElement('input');
        input.className = 'hf-text-number-input';
        input.type = 'text'; // Allow '5K', '1.2M', etc.
        //input.value = threshold.toLocaleString('en-US') || '';

        element.appendChild(input);

        input.addEventListener('keydown', function (e) {
            let allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
                '.', 'k', 'K', 'm', 'M', 'b', 'B', ','
            ];

            let isDigit = e.key >= '0' && e.key <= '9';
            if (!isDigit && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', function () {
            let rawValue = input.value.trim().toUpperCase();
            let parsedValue = parseShorthandNumber(rawValue);

            if (!isNaN(parsedValue)) {
                input.value = parsedValue.toLocaleString('en-US');

                threshold = parsedValue;
                localStorage.setItem('hf-crime-profitability-threshold', parsedValue);
            }
        });

        return input;
    }

    // HELPER FUNCTION to parse shorthand numbers
    function parseShorthandNumber(str) {
        str = str.replace(/,/g, ''); // Remove commas

        if (/^\d+(\.\d+)?$/.test(str)) {
            return parseFloat(str);
        }

        let match = str.match(/^(\d+(\.\d+)?)([KMB])$/);
        if (!match) return NaN;

        let number = parseFloat(match[1]);
        let suffix = match[3];

        switch (suffix) {
            case 'K': return number * 1_000;
            case 'M': return number * 1_000_000;
            case 'B': return number * 1_000_000_000;
            default: return NaN;
        }
    }

    // HELPER FUNCTION to create a datalist
    function createDataList(element, values, setting) {
        let dataListContainer = document.createElement('div');
        dataListContainer.classList.add('hf-datalist-container');

        let input = document.createElement('input');
        input.classList.add('hf-datalist-input');

        // Generate a unique ID for the datalist
        let dataListId = `datalist-${setting}`;
        input.setAttribute('list', dataListId);
        if (settings[setting]) {
            input.value = settings[setting];
        } else {
            if (setting === 'PreferredBurglaryScout') {
                input.value = 'Any Residential';
            } else if (setting === 'PreferredForgeryProject') {
                input.value = 'Parking Permit';
            }
        }

        // Add an input event listener
        input.addEventListener('input', function () {
            settings[setting] = input.value;
            localStorage.setItem('hf-lazy-crimes-settings', JSON.stringify(settings));
        });

        dataListContainer.appendChild(input);

        let dataList = document.createElement('datalist');
        dataList.id = dataListId; // Assign the ID so input can link to it

        values.forEach((value) => {
            let option = document.createElement('option');
            option.value = value;
            dataList.appendChild(option);
        });

        dataListContainer.appendChild(dataList);
        element.appendChild(dataListContainer);
    }

    // Check if there's a page chance - if yes, rerun script
    function handlePageChange() {
        if (window.location.href === currentHref) return;

        let existingIcon = document.body.querySelector('.hf-lazy-crimes-icon');
        if (existingIcon) existingIcon.remove();

        let existingButton = document.body.querySelector('.hf-lazy-crimes-button');
        if (existingButton) existingButton.remove();

        findHref();

        currentHref = window.location.href;
    }

    // run if button click
    function handleButtonClick(event) {
        setTimeout(() => {
            handlePageChange();
        }, 500);
    }

    function findHref() {
        checkNerveBar();

        let href = window.location.href;
        currentHref = href;

        let crimes = ['Search for Cash', 'Spoiled Rotten', 'Shore Thing', 'Bootlegging', 'Cinephile', 'Online Entrepreneur',
                      'Graffiti', 'Shoplifting', 'Notorious', 'Pickpocketing', 'Card Skimming', 'Burglary', 'Key to the City',
                      'Hustling', 'Disposal', 'Dissolving Agent', 'Cracking', 'Forgery', 'Scamming', 'Scraper', 'Phisher'];

        if (!settings || Object.keys(settings).length === 0) {
            settings = {};

            for (let crime of crimes) {
                settings[crime] = true;
            }

            settings['Respect Threshold'] = false;
            settings['Prioritise Profitability'] = false;
            settings.ScammingMinLevel = 1;
        }

        if (!settings.Arson) {
            settings.Arson = true;
        }

        if (href.includes('searchforcash')) {
            if (settings['Search For Cash']) {
                crimePage();
                searchForCashMerits(); // merits - trash & sand
                if (settings['Spoiled Rotten'] && settings['Shore Thing']) {
                    addInfoButton(`The spam button chooses the highest percentage crime.<br><b>Shore Thing</b> looks for sand at the beach.<br><b>Spoiled Rotten</b> looks for rotten food in the trash.`);
                } else if (settings['Spoiled Rotten']) {
                    addInfoButton(`The spam button chooses the highest percentage crime.<br><b>Spoiled Rotten</b> looks for rotten food in the trash.`);
                } else if (settings['Shore Thing']) {
                    addInfoButton(`The spam button chooses the highest percentage crime.<br><b>Shore Thing</b> looks for sand at the beach.`);
                } else {
                    addInfoButton(`The spam button chooses the highest percentage crime.`);
                }
            }
        } else if (href.includes('bootlegging')) {
            if (settings.Bootlegging) {
                bootlegging();
                if (settings.Cinephile && settings['Online Entrepreneur']) {
                    addInfoButton(`The spam button copies DVDs per Emforus [2535044]'s ratio and once enough DVDs are copied, sells them.*<br><b>Cinephile</b> copies DVDs for any crime not yet at 10,000 DVDs.*
                <br>Online Entrepreneur</b> sets up an online shop and turns it on in order to work on the customers needed for this merit.<br>*Please note that this does not keep in mind the currently queued DVDs.`);
                } else if (settings.Cinephile) {
                    addInfoButton(`The spam button copies DVDs per Emforus [2535044]'s ratio and once enough DVDs are copied, sells them.*<br><b>Cinephile</b> copies DVDs for any crime not yet at 10,000 DVDs.*
                <br>*Please note that this does not keep in mind the currently queued DVDs.`);
                } else if (settings['Online Entrepreneur']) {
                    addInfoButton(`The spam button copies DVDs per Emforus [2535044]'s ratio and once enough DVDs are copied, sells them.*
                <br>Online Entrepreneur</b> sets up an online shop and turns it on in order to work on the customers needed for this merit.<br>*Please note that this does not keep in mind the currently queued DVDs.`);
                } else {
                    addInfoButton(`The spam button copies DVDs per Emforus [2535044]'s ratio and once enough DVDs are copied, sells them.*
                <br>*Please note that this does not keep in mind the currently queued DVDs.`);
                }
            }
        } else if (href.includes('graffiti')) {
            if (settings.Graffiti) {
                graffiti();
                addInfoButton(`The spam button brings each district to 500 first before moving to the next and thus should also work if you aim for both merits.`);
            }
        } else if (href.includes('shoplifting')) {
            if (settings.Shoplifting) {
                crimePage();
                if (settings.Notorious) {
                    addInfoButton(`The spam button redirects to:<br>(1) Any disabled securities with < 80 notoriety<br>(2) Sweet Shop or Bits 'n' Bobs with < 80 notoriety<br>(3) Sweet Shop<br><br>
                For the <b>Notorious</b> merit please have a LOT of nerve on standby.`);
                } else {
                    addInfoButton(`The spam button redirects to:<br>(1) Any disabled securities with < 80 notoriety<br>(2) Sweet Shop or Bits 'n' Bobs with < 80 notoriety<br>(3) Sweet Shop`);
                }
            }
        } else if (href.includes('pickpocketing')) {
            if (settings.Pickpocketing) {
                crimePage();
                addInfoButton(`The spam button redirects to the earliest safe target based on Emforus [2535044]'s guide.<br><br>
            For the <b>Pig Rustler</b> merit, just wait for a running cop to appear and try pickpocketing him. Be aware this might lose you a lot of CS in a lot of tries.`);
            }
        } else if (href.includes ('cardskimming')) {
            if (settings['Card Skimming']) addInfoButton(`Just take a moment to spam Bus Stations, forget about it for a month, then spam collect.`);
        } else if (href.includes('burglary')) {
            if (settings.Burglary) {
                burglary();
                if (settings['Key to the City']) {
                    addInfoButton(`The spam button by default scouts any residential, then cases it to about 80% and then collects it.<br><br><b>Key to the City</b> spawns, cases and burgles whichever target you've not burgled yet.`);
                } else {
                    addInfoButton(`The spam button by default scouts any residential, then cases it to about 80% and then collects it.`);
                }
            }
        } else if (href.includes('hustling')) {
            if (settings.Hustling) {
                crimePage();
                addInfoButton(`The spam button gathers 1 audience and keeps spamming lose until nerve is empty. It works on whichever technique you haven't completed yet, so should technically work for the <b>Tekkers</b> merit.
                <span style="color:var(--default-base-important-color)"> PLEASE NOTE THIS WILL MAKE YOU LOSE MONEY! Remember to keep enough money on hand at all times!</span>`);
            }
        } else if (href.includes('disposal')) {
            if (settings.Disposal) {
                disposal();
                if (settings['Dissolving Agent']) {
                    addInfoButton(`The spam button selects the proposed method for the first available crime as per Emforus [2535044]'s guide and then finishes the crime. <span style="color:var(--default-base-important-color)">You need to make sure you have the required item available in order for the crime to be possible.</span><br><br>
            <b>Dissolving Agent</b> attempts to dissolve a dead body in acid when available (and visible on the page!)`);
                } else {
                    addInfoButton(`The spam button selects the proposed method for the first available crime as per Emforus [2535044]'s guide and then finishes the crime.`);
                }
            }
        } else if (href.includes('cracking')) {
            if (settings.Cracking) {
                crimePage();
                addInfoButton(`The spam button chooses:<br>(1) Any finished crackings<br>(2) The cracking with the lowest amount of characters<br><br>The <b>Character Assassination</b> merit is simply not possible by spamming, sorry!`);
            }
        } else if (href.includes('forgery')) {
            if (settings.Forgery) {
                crimePage();
                addInfoButton(`The spam button by default spams parking permits.<span style="color:var(--default-base-important-color)"> Please make sure you have enough Cardstock and Adhesive Plastic in your inventory.</span>
            You should be able to get the <b>Assembly Line</b> merit by simply spamming enough crimes at once.`);
            }
        } else if (href.includes('scamming')) {
            if (settings.Scamming) {
                crimePage();
                addInfoButton(`The spam button:<br>(1) Farms e-mails up to 20k<br>(2) Launches spam waves if no available targets<br>(3) Finishes targets based on tobytorn [1617955]'s Crime Morale Script info.<br><br>
                Merits should be doable with the Crime Morale script as well.<br><br><span style="color:var(--default-base-important-color)">Be sure to disable scraper/phisher if you haven't done the educations yet.</span>`);
            }
        } else if (href.includes('arson')) {
            if (settings.Arson) {
                crimePage();
                addInfoButton(`<span style="color:var(--default-base-important-color)">CURRENTLY IN BETA, MIGHT HAVE BUGS, PROCEED WITH CAUTION</span><br>The crime will currently skip any damage-related arsons due to overcomplexity.<br>For specifics on how the script works, check out <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16481795&b=0&a=0">the forum post</a>`);
            }
        } else {
            addSettings();
        }
    }

    if (!window.lazyCrimesInjected) {
        window.lazyCrimesInjected = true;

        findHref();

        // Checking arrows and document click handler only work like half of the time, so interval
        setInterval(handlePageChange, 200);

        // Attach click event listener
        document.body.addEventListener('click', handleButtonClick);
    }

    function addStyle(css) {
        let style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    addStyle(`
        .hf-floating-btn {
            z-index: 999999;
            position: fixed;
            font-size: 15px;
            top: 270px;
            left: 20px;
        }

        .hf-lazy-crimes-btn-container {
            display: flex;
            align-items: center;
            height: 20px;
            margin-right: auto;
            margin-left: 8px;
        }

        .hf-lazy-crimes-button {
            background: var(--default-blue-dark-color);
            color: var(--btn-color);
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        .hf-lazy-crimes-button.hf-mobile {
            font-size: smaller;
        }

        .hf-lazy-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: var(--sidebar-area-bg-attention);
            border: 2px solid var(--default-tabs-color);
            border-radius: 15px;
            max-width: 400px;
            z-index: 9999;
            max-height: 60vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            line-height: normal;
        }

        .hf-lazy-title-container {
            font-size: x-large;
            font-weight: bolder;
            padding-bottom: 8px;
        }

        .hf-lazy-scroll-container {
            max-height: 100%;
            flex: 1;
            overflow-y: auto;
            margin-top: 10px;
        }

        .hf-lazy-main-container {
            display: flex;
            flex-direction: column;
        }

        .hf-checkbox-container {
            display: flex;
            flex-direction: column;
            padding-top: 15px;
        }

        .hf-lazy-crime-container {
            display: flex;
            flex-direction: column;
        }

        .hf-lazy-toggle-container {
            display: flex;
            align-items: center;
            padding-top: 5px;
        }

        .hf-lazy-toggle-container.hf-sub-settings {
          margin-left: 20px;
          padding-top: 2px !important;
        }

        .hf-profitability-info {
            padding-top: 20px;
            font-size: larger;
            font-weight: bold;
        }

        .hf-profitability-extra-info {
            padding: 5px 0px;
        }

        .hf-profitability-container {
            display: flex;
        }

        .hf-lazy-button-container {
            display: flex;
            justify-content: space-between;
            padding-top: 15px;
        }

        .hf-lazy-cancel-btn {
            color: black;
            border: 1px solid black;
            border-radius: 5px;
            background-color: #ccc;
            cursor: pointer;
        }

        .hf-lazy-cancel-btn:hover {
            font-weight: bold;
        }

        .hf-lazy-done-btn {
            color: black;
            border: 1px solid black;
            border-radius: 5px;
            background-color: #ccc;
            cursor: pointer;
        }

        .hf-lazy-done-btn:hover {
            font-weight: bold;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 20px;
            height: 10px;
            top: 1px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 10px;
            width: 10px;
            background-color: white;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            transform: translateX(10px);
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        .hf-no-target, .hf-no-items, .hf-no-money, .hf-no-cinephile, .hf-below-threshold, .hf-no-arson {
            background: var(--default-base-important-color) !important;
        }

        .hf-notorious-btn {
            margin-left: 8px;
        }

        .hf-processing {
            background: var(--default-tabs-disabled-color);
            transition: background-color 0.3s ease, width 0.3s ease;
        }

        .hf-spoiled-btn, .hf-sand-btn, .hf-key-btn, .hf-dissolving-btn, .hf-online-btn, .hf-cine-btn {
            margin-left: 8px;
        }

        .hf-disabled {
            background: var(--default-tabs-disabled-color);
        }

        .hf-select-item-btn {
            position: fixed !important;
            z-index: 99999 !important;
            scale: 2000% !important;
            top: 0px !important;
        }

        .hf-lazy-crimes-info-icon {
            margin-left: 6px;
            cursor: help;
        }

        .hf-lazy-crimes-info-icon.hf-mobile {
            margin-right: 6px;
            margin-top: 2px;
        }

        .hf-lazy-crimes-icon {
            cursor: pointer;
        }

        .hf-credit-span {
            padding-bottom: 8px;
        }

        .hf-profitability-container.hf-mobile {
            flex-direction: column;
        }

        .hf-label-text {
            padding-left: 5px;
        }

        .hf-number-input {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid black;
            width: 35px;
            height: 6px;
            margin-left: 5px;
        }

        .hf-text-number-input {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid black;
            background: #ccc;
            width: 70px;
        }

        .hf-datalist-container {
            display: flex;
            align-items: center;
            margin-left: 5px;
        }

        .hf-datalist-input {
            border: 1px solid black;
            border-radius: 5px;
            padding: 2px 4px;
            width: 130px;
        }

        .hf-arson-priorities-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hf-arson-priorities-subcontainer {
          list-style: inside;
          margin-left: 8px;
        }
    `);
})();