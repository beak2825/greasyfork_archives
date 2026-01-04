// ==UserScript==
// @name         WhatNot Quantity
// @namespace    http://tampermonkey.net/
// @version      2024-04-19.002
// @description  This is a new description.
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @match        https://www.whatnot.com/dashboard/listings*
// @downloadURL https://update.greasyfork.org/scripts/493499/WhatNot%20Quantity.user.js
// @updateURL https://update.greasyfork.org/scripts/493499/WhatNot%20Quantity.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log('initting tools')

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

    function createQuantityTool(parentNode) {
        console.log('quantity tool is initting')
        async function upkeepQuantity() {
            while (true) {
                if (!isRunning) {
                    console.log('disabled')
                    break
                }
                let tbody = document.querySelectorAll('tbody')[0]
                console.log('iterating', tbody, tbody.childNodes)
                for (let tr of Array.from(tbody.childNodes).reverse()) {
                    let availabilityTd = tr.childNodes[4]
                    let parent = availabilityTd.childNodes[0]
                    let div = parent.childNodes[0]

                    if (div.innerText != '0' ) {
                        //console.log('no', div)
                        continue
                    }

                    div.click()
                    setTimeout(() => {
                        let quantity = document.querySelector('[name="quantity"]')
                        console.log(quantity)
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype,
                            'value').set;
                        console.log('set from', quantity.value, 1)
                        nativeInputValueSetter.call(quantity, 1);
                        const event = new Event('input', { bubbles: true });
                        quantity.dispatchEvent(event);
                        setTimeout(() => {
                            let commonParent = quantity.parentNode.parentNode.parentNode.parentNode
                            let buttons = commonParent.childNodes[1]
                            let updateButton = buttons.childNodes[1]
                            console.log('click', quantity.value)
                            updateButton.click()
                        }, 1000)
                    }, 1000)
                    console.log('sleeping iteration')
                    await sleep(5000)
                }

                console.log('sleeping while')
                await sleep(1000)
                console.log('going to inactive')
                document.querySelector('[value="Inactive"]').click()
                await sleep(10000)
                console.log('going to active')
                document.querySelector('[value="Active"]').click()
                await sleep(60000)
            }
        }

        // Create a new div for the quantity tool
        var quantityDiv = document.createElement('div');
        quantityDiv.style.border = '1px solid black'; // Add border
        quantityDiv.style.padding = '10px'; // Add padding for spacing
        parentNode.appendChild(quantityDiv);

        // Add text "Quantity" above the button
        var quantityText = document.createElement('div');
        quantityText.textContent = 'Quantity';
        quantityDiv.appendChild(quantityText);

        var button = document.createElement('button');
        button.innerHTML = 'Start';
        button.style.width = '100px'; // Adjust width as necessary
        button.style.height = '50px'; // Adjust height as necessary
        button.style.fontSize = '1em'; // Reset font size for button
        quantityDiv.appendChild(button);
        parentNode.appendChild(quantityDiv)

        var isRunning = false;

        // Function to start/stop action
        function toggleAction() {
            let oldIsRunning = isRunning
            isRunning = !isRunning;
            if (oldIsRunning) {
                // Stop action
                console.log('Action will be stopped after current cycle');
                button.innerHTML = 'Start';
                parentNode.style.backgroundColor = 'green'; // Reset background color
                // Add your stop action code here
            } else {
                // Start action
                console.log('Action started');
                button.innerHTML = 'Stop';
                parentNode.style.backgroundColor = 'red'; // Apply green background color
                // Add your start action code here
                upkeepQuantity()
            }
        }
        // Attach click event listener to the button
        button.addEventListener('click', toggleAction);
        console.log('quantity tool was init')
    }

    function createSleepFeedback(parentNode) {
        //Time node
        var timeNode = document.createElement('div');
        timeNode.innerHTML = 'Time left: 0'; // Initial text
        parentNode.appendChild(timeNode);// Example function to update the time left text

        function updateTimeLeft(time) {
            timeNode.innerHTML = 'Time left: ' + time;
        }

        return (delay) => {
            let totalTime = delay / 1000
            updateTimeLeft(totalTime)
            let intervalId = setInterval(() => {
                totalTime -= 0.1
                updateTimeLeft(Math.round(totalTime * 10) / 10);
            }, 100)
            let promise = (new Promise((resolve) => setTimeout(resolve, delay))).then(() => {
                clearInterval( intervalId)
                updateTimeLeft(0)
            })
            return promise
        }
    }

    function createDuplicateTool(parentNode) {
        // Create a new div for the quantity tool
        var parentDiv = document.createElement('div');
        parentDiv.style.border = '1px solid black'; // Add border
        parentDiv.style.padding = '10px'; // Add padding for spacing

        // Add text "Quantity" above the button
        var quantityText = document.createElement('div');
        quantityText.textContent = 'Duplicate';
        parentDiv.appendChild(quantityText);

        // Create a text input
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '';
        input.style.width = '50px'; // Adjust width as necessary
        parentDiv.appendChild(input);

        // Create a button
        const dButton = document.createElement('button');
        dButton.textContent = 'Duplicate';
        parentDiv.appendChild(dButton);

        var duplicateAmountNode = document.createElement('div');
        duplicateAmountNode.innerHTML = 'Items left: 0'; // Initial text
        parentDiv.appendChild(duplicateAmountNode);

        parentNode.appendChild(parentDiv);

        // Add click event listener to the button
        dButton.addEventListener('click', async () => {
            // Read the value from the input field
            let duplicateAmount = parseInt(input.value);
            if (duplicateAmount <= 0 || duplicateAmount == NaN) {
                console.log('invalid amount', input.value)
                return
            }

            dButton.disabled = true
            for (;duplicateAmount >= 1; duplicateAmount--) {
                updateDuplicateAmountLeft(duplicateAmount)
                await sleep(1000)
                let optionsButton = null
                while (!optionsButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let optionsButtons = buttons.filter(i => i.innerText == 'Options')
                    if (optionsButtons.length > 0 && !optionsButtons[0].disabled) {
                        console.log('options button found', optionsButtons[0])
                        optionsButton = optionsButtons[0]
                    } else {
                        console.log('no options button found')
                        await sleep(1000)
                    }
                }
                await sleep(1000)
                optionsButton.click()
                let duplicateButton = null
                while (!duplicateButton) {
                    let buttons = Array.from(document.querySelectorAll('a'))
                    let duplicateButtons = buttons.filter(i => i.textContent.includes("Duplicate listing"))
                    if (duplicateButtons.length > 0 && !duplicateButtons[0].disabled) {
                        console.log('duplicate button found', duplicateButtons[0])
                        duplicateButton = duplicateButtons[0]
                    } else {
                        console.log('no duplicate button found')
                        await sleep(1000)
                    }
                }
                await sleep(1000)
                duplicateButton.click()
                let reviewButton = null
                while (!reviewButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let reviewButtons = buttons.filter(i => i.innerText == 'Review Listing')
                    if (reviewButtons.length > 0 && !reviewButtons[0].disabled) {
                        console.log('review button found', reviewButtons[0])
                        reviewButton = reviewButtons[0]
                    } else {
                        console.log('no review button found')
                        await sleep(1000)
                    }
                }
                await sleep(1000)
                reviewButton.click()
                let listButton = null
                while (!listButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let listButtons = buttons.filter(i => i.innerText == 'List Now')
                    if (listButtons.length > 0 && !listButtons[0].disabled) {
                        console.log('list button found', listButtons[0])
                        listButton = listButtons[0]
                    } else {
                        console.log('no list button found')
                        await sleep(1000)
                    }
                }
                await sleep(1000)
                listButton.click()
            }
            updateDuplicateAmountLeft(0)
            dButton.disabled = false
        });

        // Example function to update the time left text
        function updateDuplicateAmountLeft(amount) {
            duplicateAmountNode.innerHTML = 'Items left: ' + amount;
        }
    }

    let currentSet = 0
    const OBJECTS_KEY = 'boxes_'
    function getCurrentObjectsKey() {
        return OBJECTS_KEY + currentSet
    }

    let objects = []

    function updateCurrentObjects() {
        localStorage.setItem(getCurrentObjectsKey(), JSON.stringify(objects));
    }

    function loadCurrentObjects() {
        objects = JSON.parse(localStorage.getItem(getCurrentObjectsKey()) ?? '[]')
    }

    loadCurrentObjects()

    let currentPrefix = ''
    const CURRENT_PREFIX = 'CURRENT_PREFIX'
    function updateCurrentPrefix() {
        console.log('saving', currentPrefix)
        localStorage.setItem(CURRENT_PREFIX, currentPrefix);
    }

    function loadCurrentPrefix() {
        currentPrefix = localStorage.getItem(CURRENT_PREFIX)
    }

    loadCurrentPrefix()

    var editBreakOverlay

    function createEditBreakTool(parentNode) {
        // Create a new div for the "Edit break" tool
        var editBreakSection = document.createElement('div');
        editBreakSection.style.border = '1px solid black'; // Add border
        editBreakSection.style.padding = '10px'; // Add padding for spacing

        // Add text "Quantity" above the button
        var quantityText = document.createElement('div');
        quantityText.textContent = 'Auctions';
        editBreakSection.appendChild(quantityText);

        // Create a button for the "Edit break" tool
        var editBreakButton = document.createElement('button');
        editBreakButton.textContent = 'Edit break';
        editBreakButton.addEventListener('click', function() {
            toggleOverlay(); // Toggle overlay on button click
        });
        editBreakSection.appendChild(editBreakButton);

        // Create a text input under the "Edit break" button
        var breakTextInputDiv = document.createElement('div');
        var breakTextInput = document.createElement('input');
        breakTextInput.type = 'text';
        breakTextInput.style.width = '200px';
        breakTextInputDiv.appendChild(breakTextInput);
        editBreakSection.appendChild(breakTextInputDiv)

        async function changeDescription(value) {
            let tbody = document.querySelectorAll('tbody')[0]
            console.log('iterating', tbody, tbody.childNodes)
            for (let tr of Array.from(tbody.childNodes).reverse()) {
                let titleTd = tr.childNodes[1]
                let flex = titleTd.childNodes[0]
                let flex2 = flex.childNodes[0]
                let parent = flex2.childNodes[1]

                parent.click()
                await sleep(500)
                parent.click()
                let optionsButton = null
                while (!optionsButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let optionsButtons = buttons.filter(i => i.innerText === 'Options')
                    if (optionsButtons.length > 0 && !optionsButtons[0].disabled) {
                        console.log('update button found', optionsButtons[0])
                        optionsButton = optionsButtons[0]
                    } else {
                        console.log('no update button found')
                        await sleep(1000)
                    }
                }

                let buttonsParent = optionsButton.parentNode
                let editButton = buttonsParent.childNodes[1]
                await sleep(250)
                editButton.click()

                await sleep(250)
                let description = null
                while (!description) {
                    description = document.querySelector('input[name="description"]')
                    if (!description) {
                        console.log('no description field found')
                        await sleep(1000)
                    }
                }

                console.log(description)
                console.log('set from', description.value, value)
                description.dispatchEvent(new Event('input', { bubbles: true }));
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value').set;
                nativeInputValueSetter.call(description, value);
                const event = new Event('input', { bubbles: true });
                description.dispatchEvent(event);
                await sleep(1000)

                let reviewButton = null
                while (!reviewButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let reviewButtons = buttons.filter(i => i.innerText == 'Review Listing')
                    if (reviewButtons.length > 0 && !reviewButtons[0].disabled) {
                        console.log('review button found', reviewButtons[0])
                        reviewButton = reviewButtons[0]
                    } else {
                        console.log('no review button found')
                        await sleep(1000)
                    }
                }
                await sleep(500)
                reviewButton.click()
                let listButton = null
                while (!listButton) {
                    let buttons = Array.from(document.querySelectorAll('button'))
                    let listButtons = buttons.filter(i => i.innerText == 'List Now')
                    if (listButtons.length > 0 && !listButtons[0].disabled) {
                        console.log('list button found', listButtons[0])
                        listButton = listButtons[0]
                    } else {
                        console.log('no list button found')
                        await sleep(1000)
                    }
                }
                await sleep(500)
                listButton.click()
                await sleep(500)
            }
        }

        var setDescriptionButton = document.createElement('button');
        setDescriptionButton.textContent = 'Set All';
        setDescriptionButton.addEventListener('click', function() {
            changeDescription(breakTextInput.value); // Toggle overlay on button click
        });

        editBreakSection.appendChild(setDescriptionButton);
        parentNode.appendChild(editBreakSection)

        function toggleOverlay() {
            editBreakOverlay.style.display = editBreakOverlay.style.display === 'none' ? 'block' : 'none'
        }

        function createEditBreakOverlay() {
            editBreakOverlay = document.createElement('div');
            editBreakOverlay.id = 'editBreakOverlay';
            editBreakOverlay.style.display = 'none'
            editBreakOverlay.style.position = 'fixed';
            editBreakOverlay.style.top = '0';
            editBreakOverlay.style.left = '0';
            editBreakOverlay.style.width = '100%';
            editBreakOverlay.style.height = '100%';
            editBreakOverlay.style.backgroundColor = 'rgb(0, 0, 0)'; // Semi-transparent black background
            editBreakOverlay.style.zIndex = '9999';

            var buttonsDiv = document.createElement('div')
            buttonsDiv.style.position = 'absolute';
            buttonsDiv.style.top = '10px';
            buttonsDiv.style.right = '10px';

            var closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.display = 'block'
            closeButton.addEventListener('click', function() {
                toggleOverlay(); // Close overlay on close button click
            });
            buttonsDiv.appendChild(closeButton);
            let prefixDiv = document.createElement('div')

            const prefixLabel = document.createElement('label');
            prefixLabel.textContent = 'Prefix: ';
            prefixLabel.style.color = 'white';
            const prefixInput = document.createElement('input');
            prefixInput.type = 'text';
            prefixInput.value = currentPrefix;
            prefixInput.style.width = '250px';
            prefixInput.addEventListener('input', () => {
                currentPrefix = prefixInput.value;
                updateCurrentPrefix()
            });
            prefixDiv.appendChild(prefixLabel);
            prefixDiv.appendChild(prefixInput);
            buttonsDiv.appendChild(prefixDiv);

            function setDescription() {
                let description = currentPrefix + ' '
                objects.forEach((object, index) => {
                    description += `${object.amount} - ${object.name};   `
                })
                breakTextInput.value = description
            }

            var setButton = document.createElement('button');
            setButton.textContent = 'Set description';
            setButton.style.display = 'block'
            setButton.addEventListener('click', function() {
                setDescription(); // Close overlay on close button click
                setTimeout(() => {
                    console.log('trying to close')
                    toggleOverlay()
                }, 250)
            });
            buttonsDiv.appendChild(setButton);

            editBreakOverlay.appendChild(buttonsDiv);

            let setDiv = document.createElement('div')

            const presetLabel = document.createElement('label');
            presetLabel.textContent = 'Preset: ';
            presetLabel.style.color = 'white';
            const presetInput = document.createElement('input');
            presetInput.type = 'number';
            presetInput.value = currentSet;
            presetInput.style.width = '35px';
            presetInput.addEventListener('input', () => {
                currentSet = parseInt(presetInput.value);
                loadCurrentObjects();
                createObjectInputs()
            });
            setDiv.appendChild(presetLabel);
            setDiv.appendChild(presetInput);

            editBreakOverlay.appendChild(setDiv);

            let objectsParent = document.createElement('div');
            objectsParent.style.display = 'inline-block'; // Make the parent div shrink-wrap its contents
            editBreakOverlay.appendChild(objectsParent);

            // Create add button
            var addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.style.position = 'relative';
            addButton.addEventListener('click', function() {
                addObject();
            });
            editBreakOverlay.appendChild(addButton);

            document.body.appendChild(editBreakOverlay);

            function createObjectInputs() {
                while (objectsParent.firstChild) {
                    objectsParent.removeChild(objectsParent.firstChild);
                }

                objects.forEach((object, index) => {
                    const objectDiv = document.createElement('div');
                    objectDiv.style.border = '1px solid black';
                    objectDiv.style.padding = '10px';
                    objectDiv.style.marginBottom = '10px';

                    const nameLabel = document.createElement('label');
                    nameLabel.textContent = 'Name: ';
                    nameLabel.style.color = 'white';
                    const nameInput = document.createElement('input');
                    nameInput.type = 'text';
                    nameInput.value = object.name;
                    nameInput.style.width = '250px';
                    nameInput.addEventListener('input', () => {
                        object.name = nameInput.value;
                        updateCurrentObjects();
                    });

                    const amountLabel = document.createElement('label');
                    amountLabel.textContent = 'Amount: ';
                    amountLabel.style.color = 'white';
                    const amountInput = document.createElement('input');
                    amountInput.type = 'number';
                    amountInput.value = object.amount;
                    amountInput.style.width = '35px';
                    amountInput.addEventListener('input', () => {
                        object.amount = parseInt(amountInput.value);
                        updateCurrentObjects();
                    });

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.addEventListener('click', () => {
                        objects.splice(index, 1);
                        updateCurrentObjects();
                        createObjectInputs(); // Re-render inputs after removing an object
                    });

                    objectDiv.appendChild(nameLabel);
                    objectDiv.appendChild(nameInput);
                    objectDiv.appendChild(amountLabel);
                    objectDiv.appendChild(amountInput);
                    objectDiv.appendChild(removeButton);

                    objectsParent.appendChild(objectDiv);
                });

            }

            function addObject() {
                objects.push({ name: '', amount: 0 });
                updateCurrentObjects();
                createObjectInputs();
            }

            createObjectInputs()
        }

        createEditBreakOverlay()
    }

    let sleep = createSleepFeedback(toolsNode)

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
            { name: 'Quantity', tool: createQuantityTool },
            { name: 'Duplicate', tool: createDuplicateTool },
            { name: 'Edit Break', tool: createEditBreakTool }
            // Add more options as needed
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
        toolOptions[0].tool(toolContainer)
    }

    // Call createToolSelector to add the dropdown list
    createToolSelector(toolsNode);

//    createQuantityTool(toolsNode)
    //  createDuplicateTool(toolsNode)
    //createEditBreakTool(toolsNode)

    console.log('tools were init')
})();