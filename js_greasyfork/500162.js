// ==UserScript==
// @name         farmrpg.com bot
// @namespace    http://tampermonkey.net/
// @version      2024-08-23
// @description  try to take over the world!
// @author       You
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500162/farmrpgcom%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/500162/farmrpgcom%20bot.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to append multiple links next to the element with ID "homebtn"
    function appendLinks(links) {
        const homeBtn = document.getElementById('homebtn');

        if (homeBtn) {
            links.forEach(linkDetails => {
                const newLink = document.createElement('a');
                newLink.href = linkDetails.href || "#";
                newLink.className = linkDetails.className || "button";
                newLink.style.fontSize = linkDetails.fontSize || "12px";
                newLink.style.paddingLeft = linkDetails.paddingLeft || "5px";
                newLink.style.paddingRight = linkDetails.paddingRight || "8px";
                newLink.innerHTML = linkDetails.innerHTML || "";

                // Insert the new link right after the homeBtn
                homeBtn.parentNode.insertBefore(newLink, homeBtn.nextSibling);
            });
        } else {
            console.log('Element with ID "homebtn" not found');
        }
    }

    // Define the links to be appended
    const linksToAppend = [
        { href: "bank.php", innerHTML: 'Bank' },
        { href: "market.php", innerHTML: 'Sell Inv' },
        { href: "steakmarket.php", innerHTML: 'Steak' },
        { href: "workshop.php", innerHTML: 'Workshop' },
        { href: "store.php", innerHTML: 'Store' },
        { href: "pets.php", innerHTML: 'Pets' },
        { href: "explore.php", innerHTML: 'Explore' }
    ];

    // Call the function to append the links
    appendLinks(linksToAppend);

    // General function to check the element and style the link
    function checkAndStyleLink(progressBarSelector, linkText, linkSelector = 'a') {
        const progressBar = document.querySelector(progressBarSelector);
        if (progressBar && (progressBar.style.width === '100%' || progressBarSelector !== '.c-progress-bar-fill.pb11')) {
            const targetLink = Array.from(document.querySelectorAll(linkSelector)).find(link => link.textContent.includes(linkText));
            if (targetLink) {
                console.log(`Found link with text "${linkText}"`);
                targetLink.focus();
                targetLink.style.border = '2px solid green';
                targetLink.click();
            } else {
                console.log(`Link with text "${linkText}" not found`);
            }
        }
    }

    // Function to check if the selected option in a <select> element is "Nothing Selected" and click a link
    function buyMoreSeedsIfEmpty() {
        const selectElement = document.querySelector('.seedid.inlineinputlg');
        if (selectElement) {
            const outOfSeedsOption = Array.from(selectElement.options).some(option => option.text.includes("Out of seeds"));
            if (outOfSeedsOption) {
                const targetLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent.includes('Buy more Seeds'));
                if (targetLink) {
                    console.log(`Found link because "Out of seeds" is present`);
                    targetLink.focus();
                    targetLink.style.border = '2px solid green';
                    targetLink.click();
                    return;
                } else {
                    console.log('Link not found when "Out of seeds" is present');
                }
            }
        }
    }

    // Function to loop through elements with the class "close-panel", find the last one containing the word "silver", highlight it, and click the closest ".buybtn" within it
    function buyLatestSeed() {
        const panels = document.querySelectorAll('.list-block > ul > li.close-panel');
        let lastPanelWithSilver = null;
        let lastPanelStop = false;

        panels.forEach(panel => {
            if (!lastPanelStop && panel.textContent.includes('Silver')) {
                lastPanelWithSilver = panel;
            } else {
                lastPanelStop = true;
            }
        });

        if (lastPanelWithSilver) {
            console.log('Found last close-panel with the word "silver"');
            lastPanelWithSilver.style.border = '2px solid green';
            const buyBtn = lastPanelWithSilver.querySelector('.buybtn');
            if (buyBtn) {
                console.log('Found closest buybtn');
                buyBtn.style.border = '2px solid green';
                buyBtn.click();
            } else {
                console.log('No closest buybtn found');
            }
        } else {
            console.log('No close-panel found with the word "silver"');
        }
    }

    // Functions to pet animals
    function petChicken() {
        const colAutoElements = document.querySelectorAll('.col-auto');

        for (let element of colAutoElements) {
            const aLink = element.querySelector('a[href*="namechicken.php"]');
            const spanElement = element.querySelector('[style*="color:red"]');

            if (aLink && spanElement) {
                aLink.click();

                setTimeout(() => {
                    const petChickenBtn = document.querySelector('.petchickenbtn');
                    if (petChickenBtn) {
                        petChickenBtn.click();
                    }
                }, 800);

                break;
            }
        }
    }

    function petCow() {
        const colAutoElements = document.querySelectorAll('.col-auto');

        for (let element of colAutoElements) {
            const aLink = element.querySelector('a[href*="namecow.php"]');
            const spanElement = element.querySelector('[style*="color:red"]');

            if (aLink && spanElement) {
                aLink.click();

                setTimeout(() => {
                    const petCowBtn = document.querySelector('.petcowbtn');
                    if (petCowBtn) {
                        petCowBtn.click();
                    }
                }, 800);

                break;
            }
        }
    }

    function petClaimItems() {
        const colAutoElements = document.querySelectorAll('.col-auto');

        for (let element of colAutoElements) {
            const aLink = element.querySelector('a[href*="pet.php"]');
            const spanElement = element.querySelector('[style*="color:red"]');

            if (aLink && spanElement) {
                aLink.click();

                setTimeout(() => {
                    const petCowBtn = document.querySelector('.petcowbtn');
                    if (petCowBtn) {
                        petCowBtn.click();
                    }
                }, 800);

                break;
            }
        }
    }

    // Exploration function
    function explore() {
        function checkAndClickStamina() {
            var staminaElement = document.getElementById("stamina");

            if (staminaElement) {
                var staminaValue = parseInt(staminaElement.innerText || staminaElement.value, 10);

                if (staminaValue > 1) {
                    staminaElement.click();
                }

                if (staminaValue === 5) {
                    clearInterval(intervalId);
                }
            }
        }

        var intervalId = setInterval(checkAndClickStamina, 876);
    }

    // Workshop functions
    function workshop() {
        let buttons = document.querySelectorAll('.craftitems ul .close-panel .item-after button.btngreen');

        if (buttons.length > 0) {
            let randomIndex = Math.floor(Math.random() * buttons.length);
            let randomButton = buttons[randomIndex];
            randomButton.click();
        }
    }

    function favWorkshop() {
        const buttons = document.querySelectorAll('.favcraftitems .craftbtn');

        buttons.forEach(button => {
            if (button.textContent.includes('Silver')) {
                button.click();
                console.log('Clicked a Silver button in the fav workshop');
                return;
            }
        });
    }

    // Function to autobuy nails or iron
    function autobuyNailsIron() {
        // Select all elements with the class "close-panel"
        const panels = document.querySelectorAll('.close-panel');

        panels.forEach(panel => {
            // Check if the panel contains the words "Nails" or "Iron"
            if (panel.textContent.includes('Nails') || panel.textContent.includes('Iron')) {
                // Find the buy button within the panel that contains the word "Silver"
                const buyBtn = Array.from(panel.querySelectorAll('.buybtn'))
                    .find(button => button.textContent.includes('Silver'));

                if (buyBtn) {
                    // If a matching buy button is found, click it
                    console.log('Found and clicked a buy button containing "Silver" within a panel containing "Nails" or "Iron".');
                    buyBtn.click();
                } else {
                    console.log('No buy button containing "Silver" found within this panel.');
                }
            }
        });
    }

    // Task functions grouped into categories
    const tasks = {
        myFarmTasks: [
            () => buyMoreSeedsIfEmpty(),
            () => checkAndStyleLink('.c-progress-bar-fill.pb11', 'Harvest All'),
            () => checkAndStyleLink('.plantseed.button', 'Plant All'),
            () => checkAndStyleLink('.actions-modal-button', 'Yes')
        ],
        claimRewardTasks: [
            () => checkAndStyleLink('.button.btngreen.claimbtn', 'Claim Reward', 'button')
        ],
        claimMailboxTasks: [
            () => checkAndStyleLink('.button.btnpurple', 'mailbox'),
            () => checkAndStyleLink('.close-notification.foralert', 'Mailbox'),
            () => checkAndStyleLink('.item-title', 'Collect All Mail Items', 'div.item-title')
        ],
        generalTasks: [
            () => checkAndStyleLink('.modal-button.modal-button-bold', 'OK', 'span'),
            () => checkAndStyleLink('.collectsrbtn', 'Collect', 'button'),
            () => checkAndStyleLink('div.actions-modal-button:nth-of-type(2)', 'Yes', 'div.actions-modal-button'),
            () => checkAndStyleLink('.ready', ' READY!', 'span'),
            () => checkAndStyleLink('.collectbtn', 'Collect', 'a')
        ],
        buyLatestSeed: [
            () => buyLatestSeed()
        ],
        petAnimal: [
            () => petChicken(),
            () => petCow(),
            () => petClaimItems()
        ],
        explore: [
            () => explore()
        ],
        workshop: [
            () => workshop()
        ],
        favWorkshop: [
            () => favWorkshop()
        ],
        autobuyNailsIron: [
            () => autobuyNailsIron()
        ]
    };

    // Function to start or stop tasks based on user interaction
    let intervals = {};

    function toggleTask(taskName, isEnabled) {
        if (isEnabled) {
            intervals[taskName] = tasks[taskName].map(fn => setInterval(fn, 800));
        } else {
            if (intervals[taskName]) {
                intervals[taskName].forEach(clearInterval);
                delete intervals[taskName];
            }
        }
        localStorage.setItem(taskName, isEnabled ? 'enabled' : 'disabled');
    }

    // Initialize task control UI
    function initializeUI() {
        const button = document.createElement('button');
        button.innerText = 'Toggle Tasks';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '999999';
        document.body.appendChild(button);

        const modal = document.createElement('div');
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.bottom = '50px';
        modal.style.right = '10px';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '1px solid black';
        modal.style.zIndex = '999999';
        document.body.appendChild(modal);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.onclick = () => { modal.style.display = 'none'; };
        modal.appendChild(closeButton);

        for (const taskName in tasks) {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = localStorage.getItem(taskName) === 'enabled';
            checkbox.onchange = () => toggleTask(taskName, checkbox.checked);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(taskName));
            modal.appendChild(label);
            modal.appendChild(document.createElement('br'));

            toggleTask(taskName, checkbox.checked);
        }

        button.onclick = () => { modal.style.display = 'block'; };
    }

    initializeUI();
})();
