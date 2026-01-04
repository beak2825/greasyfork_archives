// ==UserScript==
// @name         WhatNot Username Parser
// @namespace    http://tampermonkey.net/
// @version      2024-03-24.019
// @description  Parse sold events and send them to the system
// @author       You
// @match        https://www.whatnot.com/dashboard/live/*
// @match        https://www.whatnot.com/live/*
// @match        http://localhost:3000/break/*
// @match        https://whatnot-frontend.vercel.app/break/*
// @match        https://whatnot-frontend-psi.vercel.app/break/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/493638/WhatNot%20Username%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/493638/WhatNot%20Username%20Parser.meta.js
// ==/UserScript==

GM_addStyle(`
.mob-mobile-chat {
    height: 75vh;
}
.mob-chat {
 position: absolute;
 max-height: 90% !important;
 top: 10% !important;
}
.mob-chat > * > * > div {
 background-color: rgba(0, 0, 0, 0.75);
    border-radius: 10px;
    padding: 2px; 
}
.mob-price {
 position: absolute;
 z-index: 999;
 right: 0.5%;
 top: 0.5%;
 height: '';
 background-color: black;
 padding: 1%;
}
.mob-price * {
 font-size: 25px !important;
}
.mob-price-child {
}
.bottom-container {
 background-color: rgba(0, 0, 0, 0);
 height: 100% !important;
}
.mob-chat:first-child {
 height: 100% !important;
 background: '';
}
.mob-last-buyer-container > div:first-of-type {
 position: absolute !important;
 right: 1% !important;
 top: 1% !important;
 width: 50% !important;
}
.mob-last-buyer-container > div:first-of-type > :first-child {
 background-color: black;
}
.mob-chat-parent {
 justify-content: end !important;
}
.mob-online {
font-size: 25px
 position: absolute;
 left: 2%;
 top: 2%;
}
`);

(function() {
    'use strict';

    const currentURL = document.URL.toString()
    console.log(currentURL)

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function createToolsNode() {
        var parentNode = document.createElement('div');
        parentNode.style.position = 'fixed';
        parentNode.style.top = '50%';
        parentNode.style.right = '0';
        parentNode.style.transform = 'translateY(-50%)';
        parentNode.style.backgroundColor = 'green';
        parentNode.style.padding = '10px';
        parentNode.style.fontSize = '2em'; // 2 times bigger font size
        parentNode.style.zIndex = '9000'; // Set a high z-index
        document.body.appendChild(parentNode);
        return parentNode
    }

    let toolsNode = createToolsNode()

    // Add a dropdown list for selecting tools
    function createToolSelector(parentNode) {
        var toolSelector = document.createElement('select');
        toolSelector.style.marginBottom = '10px'; // Add some margin for spacing
        parentNode.appendChild(toolSelector);

        var button = document.createElement('button')
        button.textContent = 'X'
        parentNode.appendChild(button);

        button.addEventListener('click', function () {
            document.body.removeChild(toolsNode)
        })

        var toolContainer = document.createElement('div')
        parentNode.appendChild(toolContainer);

        // Define tool options
        var toolOptions = [
            { name: 'Username Parser', tool: createUsernameParserTool },
            { name: 'Chat Only', tool: createChatOnlyTool },
            { name: 'Notes', tool: createNotesTool},
            { name: 'Giveaway Alarm', tool: createGiveawayAlarmTool}
        ];

        // Populate dropdown options
        toolOptions.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            toolSelector.appendChild(optionElement);
        });

        // Function to hide all tool interfaces
        function hideAllToolInterfaces() {
            // Remove all child nodes from the parent node
            while (toolContainer.firstChild) {
                toolContainer.removeChild(toolContainer.firstChild);
            }
        }

        toolSelector.addEventListener('change', function() {
            var selectedTool = toolOptions.find(option => option.name === toolSelector.value);
            hideAllToolInterfaces()
            selectedTool.tool(toolContainer);
        });
        toolOptions[0].tool(toolContainer);
    }

    // Call createToolSelector to add the dropdown list
    createToolSelector(toolsNode);

    function createUsernameParserTool(parentNode) {
        function start() {
            if (currentURL.indexOf('live') !== -1) {
                var element = null;
                var usernameList = []

                const Teams = [
                    "Arizona Cardinals",
                    "Atlanta Falcons",
                    "Baltimore Ravens",
                    "Buffalo Bills",
                    "Carolina Panthers",
                    "Chicago Bears",
                    "Cincinnati Bengals",
                    "Cleveland Browns",
                    "Dallas Cowboys",
                    "Denver Broncos",
                    "Detroit Lions",
                    "Green Bay Packers",
                    "Houston Texans",
                    "Indianapolis Colts",
                    "Jacksonville Jaguars",
                    "Kansas City Chiefs",
                    "Las Vegas Raiders",
                    "Los Angeles Chargers",
                    "Los Angeles Rams",
                    "Miami Dolphins",
                    "Minnesota Vikings",
                    "New England Patriots",
                    "New Orleans Saints",
                    "New York Giants",
                    "New York Jets",
                    "Philadelphia Eagles",
                    "Pittsburgh Steelers",
                    "San Francisco 49ers",
                    "Seattle Seahawks",
                    "Tampa Bay Buccaneers",
                    "Tennessee Titans",
                    "Washington Commanders"
                ]
                function isATeamGiveaway(value) {
                    return Teams.filter(i => value.indexOf(i) !== -1).length > 0
                }

                let prev = null
                let id = setInterval(() => {
                    let buttons = Array.from(document.querySelectorAll('h5'))
                    let optionsButtons = buttons.filter(i => i.textContent == 'Sold')
                    let soldCategory = optionsButtons.length > 0 ? optionsButtons[0] : null
                    if (soldCategory === null) {
                        console.log("didn't find sold category")
                        return;
                    }
                    console.log('found sold category', soldCategory)
                    console.log(soldCategory)
                    soldCategory.style.backgroundColor = 'green';
                    console.log("Username parser is init")

                    let teamIds = new Map();
                    let giveawayIds = new Map();

                    function mouseHandler() {
                        clearInterval(id)
                        const observer = new MutationObserver(mutationsList => {
                            console.log(['mut list', mutationsList])
                            // Loop through each mutation in the mutationsList
                            for (let mutation of mutationsList) {
                                // Check if nodes were added
                                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                    console.log(['muts', mutation])
                                    // Process the added nodes
                                    mutation.addedNodes.forEach(addedNode => {
                                        try {
                                            let divItem = addedNode
                                            let attributes = divItem.attributes
                                            let index = attributes.getNamedItem('data-index')
                                            let isParsed = addedNode.getAttribute('data-parsed');
                                            console.log(['new added node', addedNode, index])
                                            if (isParsed) {
                                                console.log('parsed already')
                                                return
                                            }
                                            addedNode.setAttribute('data-parsed', 'true');
                                            console.log(['parsing', addedNode])
                                            setTimeout(() => {
                                                try {
                                                    const sentElement = document.createElement('div');
                                                    if (divItem.childNodes.length <= 0) {
                                                        console.log('wrong node 1', divItem)
                                                        return
                                                    }
                                                    let divListingItem = divItem.childNodes[0]
                                                    if (divListingItem.childNodes.length <= 0) {
                                                        console.log('wrong node 2', divListingItem)
                                                        return
                                                    }
                                                    let divDisplayFlex = divListingItem.childNodes[0]
                                                    if (divDisplayFlex.childNodes.length <= 0) {
                                                        console.log('wrong node 3', divDisplayFlex)
                                                        return
                                                    }
                                                    let divFlex = divDisplayFlex.childNodes[0]
                                                    if (divFlex.childNodes.length <= 0) {
                                                        console.log('wrong node 4', divFlex)
                                                        return
                                                    }

                                                    let entity = {customer: '?', price: 0, name: ''}

                                                    let wasSent = false
                                                    if (divFlex.childNodes.length > 7) {
                                                        let divColumn = divFlex.childNodes[4]
                                                        let p = divColumn.childNodes[2]
                                                        let span = p.childNodes[2]
                                                        let username = span.childNodes[0].wholeText

                                                        let productNameContainer = divFlex.childNodes[0]
                                                        let soldName = productNameContainer.innerText
                                                        console.log("found name", soldName, ", ", soldName.toLowerCase().indexOf("giveaway"), ", is givy: ", soldName.toLowerCase().indexOf("giveaway") != -1)
                                                        if (soldName.toLowerCase().indexOf("giveaway") != -1) {
                                                            entity = {customer: username, price: 0, name: soldName}
                                                            let id = soldName.split('#')[1]
                                                            if (giveawayIds.has(id)) {
                                                                wasSent = true
                                                            }
                                                            giveawayIds.set(id, true)
                                                            console.log("parsed giveaway id is ", id)
                                                        } else {
                                                            let priceParent = divFlex.childNodes[6]
                                                            let priceValue = priceParent.childNodes[0]
                                                            let price = parseInt(priceValue.wholeText.split('$')[1])
                                                            entity = {customer: username, price: price, name: soldName}
                                                            let id = soldName.split('#')[1]
                                                            if (teamIds.has(id)) {
                                                                wasSent = true
                                                            }
                                                            teamIds.set(id, true)
                                                            console.log("parsed team id is ", id)
                                                        }
                                                    } else {
                                                        let divDirColumn = divFlex.childNodes[2]
                                                        let p = divDirColumn.childNodes[2]
                                                        let span = p.childNodes[2]
                                                        let username = span.childNodes[0].wholeText

                                                        let productNameContainer = divFlex.childNodes[0]

                                                        entity = {customer: username, price: 0, name: productNameContainer.innerText}
                                                        let id = productNameContainer.innerText.split('#')[1]
                                                        if (giveawayIds.has(id)) {
                                                            wasSent = true
                                                        }
                                                        giveawayIds.set(id, true)
                                                        console.log("parsed giveaway id is ", id)
                                                    }

                                                    if (wasSent) {
                                                        // Set the text content
                                                        sentElement.textContent = 'Already added';

                                                        // Set the styles
                                                        sentElement.style.backgroundColor = 'red';
                                                        sentElement.style.color = 'white';
                                                        sentElement.style.padding = '5px'; // Optional: Add padding for better appearance
                                                        sentElement.style.borderRadius = '5px'; // Optional: Add rounded corners for better appearance

                                                        // Append the new element to the existing element
                                                        divListingItem.appendChild(sentElement);
                                                        console.log("skip, already added", entity.name)
                                                        return
                                                    } else {
                                                        // Set the text content
                                                        sentElement.textContent = 'Sent';

                                                        // Set the styles
                                                        sentElement.style.backgroundColor = 'green';
                                                        sentElement.style.color = 'white';
                                                        sentElement.style.padding = '5px'; // Optional: Add padding for better appearance
                                                        sentElement.style.borderRadius = '5px'; // Optional: Add rounded corners for better appearance

                                                        // Append the new element to the existing element
                                                        divListingItem.appendChild(sentElement);
                                                        console.log('setting entity to ', entity)
                                                        console.log('old value was ', GM_getValue('newEvent'))
                                                        GM_setValue('newEvent', entity)
                                                    }
                                                } catch (e) {
                                                    console.log('element is preparing: ', e)
                                                }
                                            }, 2000)
                                        } catch(e) {
                                            console.log('an error occured: ', e)
                                        }
                                    });
                                }
                            }
                        });


                        setTimeout(() => {
                            let eventLog = document.querySelector('[data-testid=virtuoso-item-list]');
                            console.log(eventLog)
                            if (!eventLog) {
                                console.log('event log is not found')
                                return
                            }
                            observer.observe(eventLog, {
                                childList: true,
                            });
                            console.log("New event observer is started")
                        }, 5000)
                        soldCategory.style.backgroundColor = 'red';
                        console.log("New event observer is init")
                    }
                    if (prev != null) {
                        prev.removeEventListener('click', mouseHandler)
                        prev.style.backgroundColor = '';
                    }
                    prev = soldCategory
                    soldCategory.addEventListener('click', mouseHandler)
                }, 10000)
                console.log("Username sender is started")
            } else {
                function setReactInput(node, value) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        'value').set;
                    nativeInputValueSetter.call(node, value);
                    const event = new Event('input', { bubbles: true });
                    node.dispatchEvent(event);
                }

                const newEventEvent = 'new_event_event'
                let price = 1
                setInterval(() => {
                    let event = GM_getValue('newEvent', null)
                    if (!event) {
                        console.log('new event not found yet')
                        return
                    }
                    console.log('got event', event)
                    GM_setValue("newEvent", null)
                    window.dispatchEvent(new CustomEvent(newEventEvent, { detail: {event: event} }));
                }, 1500)
                console.log("Username receiver is started")
                parentNode.removeChild(parentDiv)
            }
        }

        // Create a new div for the quantity tool
        var parentDiv = document.createElement('div');
        parentDiv.style.border = '1px solid black'; // Add border
        parentDiv.style.padding = '10px'; // Add padding for spacing

        // Create a button
        const dButton = document.createElement('button');
        dButton.textContent = 'Turn On';
        parentDiv.appendChild(dButton);

        dButton.addEventListener('click', async () => {
            dButton.disabled = true
            dButton.textContent = 'Is active';
            start()
        })

        parentNode.appendChild(parentDiv)
    }

    function createChatOnlyTool(parentNode) {
        function removeNonRelatedNodes(rootElement, targetElements) {
            const queue = [rootElement]; // Queue to traverse the DOM tree
            let targetHit = false;

            while (queue.length > 0) {
                const currentElement = queue.shift(); // Dequeue current element
                if (!targetHit) {
                    currentElement.style.height = '100%';
                    currentElement.style.width = '100%';
                }
                if (targetElements.includes(currentElement)) {
                    targetHit = true;
                }
                // Check if the current element is not related to any target elements
                if (!targetElements.some(targetElement => currentElement && targetElement && (currentElement === targetElement || currentElement.contains(targetElement) || targetElement.contains(currentElement)))) {
                    // Remove the current element
                    currentElement.style.display = "none"
                    //currentElement.parentNode.removeChild(currentElement);
                } else {
                    // Add the children of the current element to the queue for further traversal
                    Array.from(currentElement.children).forEach(child => queue.push(child));
                }
            }
        }

        // Create a new div for the quantity tool
        var parentDiv = document.createElement('div');
        parentDiv.style.border = '1px solid black'; // Add border
        parentDiv.style.padding = '10px'; // Add padding for spacing

        // Create a button
        const dButton = document.createElement('button');
        dButton.textContent = 'Clean page';
        parentDiv.appendChild(dButton);

        dButton.addEventListener('click', async () => {
            const rootElement = document.body;
            const chatWindow = document.querySelector('div[data-testid="virtuoso-item-list"]')
            let footer = document.querySelector('footer[class*="livePlayerFooter"]')
            chatWindow.classList.add('mob-chat')
            let chatWindowParent = chatWindow.parentNode
            chatWindowParent.classList.add('mob-chat-parent')

            function autoScrollToBottom(element) {
                // Create a mutation observer to watch for changes
                const observer = new MutationObserver(() => {
                    // Scroll to the bottom
                    element.scrollTop = element.scrollHeight;
                });

                // Start observing the element for DOM changes
                observer.observe(element, {
                    childList: true,  // Watch for child additions/removals
                    subtree: true,    // Watch all descendants, not just direct children
                    characterData: true // Watch for text content changes
                });

                // Initial scroll to bottom
                element.scrollTop = element.scrollHeight;

                return observer; // Return observer so it can be disconnected later if needed
            }

            let virtuosoList = chatWindowParent.parentNode
            if (virtuosoList) {
                const currentValue = virtuosoList.getAttribute('data-overlayscrollbars-viewport');
                if (currentValue) {
                    const updatedValue = currentValue.replace('scrollbarHidden', '').trim();
                    virtuosoList.setAttribute('data-overlayscrollbars-viewport', updatedValue);
                }
            }
            autoScrollToBottom(virtuosoList);

            footer.classList.add('bottom-container')
            const mobileChat = document.querySelector('div[class*="livePlayerMobileChat"]')
            mobileChat.classList.add('mob-mobile-chat')

            const targetElements = [
                chatWindow,
                document.querySelector('section[class*="livePlayerVideo"]'), //livestream
            ];
            console.log(targetElements);

            const priceDiv = footer.querySelector('footer[class*="livePlayerFooter"] > section > :nth-child(2)')
            targetElements.push(priceDiv)

            const header = document.querySelector('header[class*="livePlayerHeader"]')
            const online = header.querySelector(':nth-child(3)');
            targetElements.push(online)

            removeNonRelatedNodes(rootElement, targetElements); // Call the function to remove non-related nodes

            var styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.innerHTML = '#bottom-section-stream-container > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) * { background-color: rgba(0, 0, 0, 0.1) !important; }';
            document.head.appendChild(styleElement);

            function updateNestedStyles(element, property, value) {
                // Apply the style to the current element
                element.style[property] = value

                // Recursively apply the style to all child elements
                Array.from(element.children).forEach(child => {
                    updateNestedStyles(child, property, value);
                });
            }

            priceDiv.classList.add('mob-price')

            priceDiv.childNodes.forEach(i => {
                i.classList.add('mob-price-child')
            })
            // Call the function to update styles for all nested children
            updateNestedStyles(priceDiv, 'font-size', '35px');
            updateNestedStyles(priceDiv, 'line-height', '');
            footer.classList.add('mob-last-buyer-container')
            online.classList.add('mob-online')

            parentNode.removeChild(parentDiv);
        });


        parentNode.appendChild(parentDiv);
    }

    function createNotesTool(parentNode) {
        // Create a new div for the quantity tool
        const parentDiv = document.createElement('div');
        parentDiv.style.border = '1px solid black'; // Add border
        parentDiv.style.padding = '10px'; // Add padding for spacing

        // Create a textarea
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Notes';
        textarea.style.width = '150px'; // Adjust width as necessary
        textarea.rows = 4; // Set number of visible rows
        parentDiv.appendChild(textarea);

        // Create a button
        const setNotesButton = document.createElement('button');
        setNotesButton.textContent = 'Set notes';
        parentDiv.appendChild(setNotesButton);

        setNotesButton.addEventListener('click', () => {
            // Replace line breaks with "\n" character
            const text = textarea.value

            // Assuming you have a specific textarea to update
            const textAreaToUpdate = document.querySelector('textarea[placeholder*="notes"]');

            // Set the value of the specific textarea
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;
            nativeTextAreaValueSetter.call(textAreaToUpdate, text);

            // Dispatch input event to notify any listeners
            const event = new Event('input', { bubbles: true });
            textAreaToUpdate.dispatchEvent(event);
        });

        parentNode.appendChild(parentDiv);
    }

    let isGiveawayAlarmToolRunning = false;

    function createGiveawayAlarmTool(parentNode) {
        if (isGiveawayAlarmToolRunning) {
            console.log('Giveaway alarm tool is already running.');
            return;
        }

        isGiveawayAlarmToolRunning = true;
        let foundEntries = false;
        let isCheckingEntries = false;
        let rememberedEntriesDiv = null;

        function checkEntries() {
            if (isCheckingEntries) {
                console.log('checkEntries is already running.');
                return;
            }

            isCheckingEntries = true;

            // Check if rememberedEntriesDiv is still in the document
            if (rememberedEntriesDiv && !document.body.contains(rememberedEntriesDiv)) {
                rememberedEntriesDiv = null;
            }

            const entriesDiv = rememberedEntriesDiv || Array.from(document.querySelectorAll('div')).find(div => /^\d+ entries$/.test(div.textContent));
            console.log('Checking for entries div:', entriesDiv);

            if (entriesDiv) {
                if (!foundEntries) {
                    console.log('Entries div found for the first time.', entriesDiv);
                    rememberedEntriesDiv = entriesDiv;
                }
                foundEntries = true;
            } else if (foundEntries) {
                console.log('Entries div was found before but is now missing.');
                showAlarm();
                foundEntries = false;
                rememberedEntriesDiv = null;
            } else {
                console.log('Entries div not found.');
            }

            isCheckingEntries = false;
        }

        function showAlarm() {
            console.log('Showing alarm.');
            const alarmDiv = document.createElement('div');
            alarmDiv.textContent = 'Start the giveaway';
            alarmDiv.style.position = 'fixed';
            alarmDiv.style.top = '10%';
            alarmDiv.style.left = '25%'; // Center the div horizontally
            alarmDiv.style.width = '50%';
            alarmDiv.style.backgroundColor = 'red';
            alarmDiv.style.color = 'white';
            alarmDiv.style.textAlign = 'center';
            alarmDiv.style.padding = '10px';
            alarmDiv.style.zIndex = '10000';
            alarmDiv.style.fontSize = '2em'; // Increase text size
            alarmDiv.style.border = '5px solid white'; // Restore white border

            // Create a close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '50%';
            closeButton.style.right = '10px'; // Slight distance from the right border
            closeButton.style.transform = 'translateY(-50%)'; // Center vertically
            closeButton.style.fontSize = '1em'; // Set text size to 1em
            closeButton.style.padding = '5px'; // Add padding for spacing around text
            closeButton.style.backgroundColor = 'grey'; // Add grey background
            closeButton.style.border = '2px solid darkgrey'; // Add darkgrey border
            closeButton.addEventListener('click', () => {
                document.body.removeChild(alarmDiv);
            });

            alarmDiv.appendChild(closeButton);
            document.body.appendChild(alarmDiv);

            // Auto-close the alarm after 30 seconds
            setTimeout(() => {
                if (document.body.contains(alarmDiv)) {
                    document.body.removeChild(alarmDiv);
                }
            }, 30000);
        }

        console.log('Starting giveaway alarm tool.');
        setInterval(checkEntries, 1000);
    }

})();