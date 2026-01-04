// ==UserScript==
// @name         Market Who's Okay?!
// @namespace    heartflower.torn
// @version      1.0
// @description  Highlights whoever is "Okay" on the item market
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/521589/Market%20Who%27s%20Okay%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521589/Market%20Who%27s%20Okay%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKeys = ['apiKey1', 'apiKey2'];
    let alerted = false;

    let currentPage = window.location.href;

    function PCorMobile(click) {
        let categoriesWrapper = document.body.querySelector('.categoriesWrapper___MaSH4');

        if (categoriesWrapper) {
            // PC
            // Listen for the full item list to appear;
            createObserver(document.body, document.body);

            // If full item list already there
            let sellerListWrapper = document.body.querySelector('.sellerListWrapper___PN32N');
            if (sellerListWrapper) {
                // Find current rows
                findElements(sellerListWrapper, '.rowWrapper___me3Ox');

                // For new rows added
                createObserver(sellerListWrapper, '.rowWrapper___me3Ox');
            }
        } else {
            // Mobile
            if (currentPage.includes('itemID') || click === true) {
                // Full item list, find the element
                findElement(document.body, '.sellerList___e4C9_');
            }
        }
    }

    // Create a mutation observer to watch for changes on the page
    function createObserver(parent, className) {
        let target;

        if (className === document.body) {
            target = document.body;
        } else {
            target = document.body.querySelector(className);
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            newNodeObserved(node);
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    // Function for when the change on the page has been detected
    function newNodeObserved(node) {
        if (node.classList.contains('sellerListWrapper___PN32N') || node.classList.contains('sellerList___kgAh_')) {
            // Find current rows
            findElements(node, '.rowWrapper___me3Ox');

            // For new rows added
            createObserver(node, '.rowWrapper___me3Ox');
        } else if (node.classList.contains('rowWrapper___me3Ox')) {
            // PC rowwrapper added afterwards'
            fetchUserId(node);
        } else if (node.classList.contains('sellerRow___Ca2pK')) {
            // Mobile sellerrow added afterwards
            fetchUserId(node);
        }
    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }

        if (className === '.sellerList___e4C9_') {
            // Find current rows
            findElements(element, '.sellerRow___Ca2pK');

            // For new rows added
            createObserver(document.body, '.sellerList___e4C9_');
        }
    }

    function findElements(parent, className) {
        let elements = parent.querySelectorAll(className);
        if (!elements || elements.length < 1) {
            setTimeout(() => findElements(parent, className), 100);
            return;
        }

        if (className === '.sellerRow___Ca2pK') {
            elements.forEach(row => {
                fetchUserId(row);
            });
        } else if (className === '.rowWrapper___me3Ox') {
            elements.forEach(wrapper => {
                let row = wrapper.querySelector('.sellerRow___AI0m6');
                fetchUserId(row);
            });
        }

    }

    function fetchUserId(listing) {
        let userInfoHead = listing.querySelector('.userInfoHead___LXxjB');
        if (userInfoHead) {
            // Header row on mobile
            return;
        }

        let userElement = listing.querySelector('.userInfoWrapper___B2a2P');
        let user = userElement.textContent;

        if (user === 'Anonymous') {
            // Anon, can't mug :(
        } else {
            let profileLink = userElement.querySelector('.honorWrap___BHau4 a');
            let userId = profileLink.href.replace('https://www.torn.com/profiles.php?XID=','');;

            fetchStatus(userId, listing);
        }

    }

    // Fetch their last action
    function fetchStatus(userId, listing) {
        let apiUrl = ``;
        let apiKey = getRandomKey();

        apiUrl = `https://api.torn.com/v2/user?key=${apiKey}&selections=basic&id=${userId}`;

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

                if (alerted === false) {
                    if (data.error.error.includes('Too many requests')) {
                        alert('Too many API calls. Go touch some grass for a minute or grab some extra ones!');
                    } else {
                        alert('API returned an error: ' + data.error.error);
                    }
                    alerted = true;
                }

                return;
            }

            let status = data.status.state; // Okay - Traveling - Hospital
            if (status === 'Okay') {
                listing.style.background = 'var(--sidebar-area-bg-available-active)';
            }
        })
            .catch(error => {
            console.error('Error fetching data: ' + error.message);
            throw error;
        });
    }

    function getRandomKey() {
        let index = Math.floor(Math.random() * apiKeys.length);
        return apiKeys[index];
    }

    setTimeout(PCorMobile, 200);

    // Listen for the user to click anything on the page
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if it's a page chance - if yes, rerun script
    function handleButtonClick(event) {
        let clickedElement = event.target;

        // Use a slight delay to allow the URL change to occur after the click
        setTimeout(() => {
            if (clickedElement.classList.contains('title___Zkrpo') || clickedElement.classList.contains('actionButton___pb_Da') || clickedElement.tagName === 'path') {
                alerted = false;
                PCorMobile(true);
            }

            let newPage = window.location.href;
            if (newPage !== currentPage) {
                alerted = false;
                currentPage = newPage;
                // Listen for the full item list to appear;
                PCorMobile();
            }
        }, 200);
    }

})();