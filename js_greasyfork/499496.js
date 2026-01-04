// ==UserScript==
// @name         FT Kit
// @namespace    http://tampermonkey.net/
// @version      3
// @description  FT Kit Helper
// @author       Drei
// @match        https://info.foodtecsolutions.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499496/FT%20Kit.user.js
// @updateURL https://update.greasyfork.org/scripts/499496/FT%20Kit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof GM_setValue !== 'undefined' && typeof GM_getValue !== 'undefined') {

        var customButtons = GM_getValue('customButtons', {});

        window.setRescheduleDate = function(daysAhead, buttonText) {
            // Your existing setRescheduleDate logic
        };

        function findTextAreaElement(names) {
            for (const name of names) {
                var element = document.querySelector(`textarea[name="${name}"]`);
                if (element) {
                    return element;
                }
            }
            return null;
        }

        function createButton(label, clickHandler) {
            var button = document.createElement('button');
            button.innerHTML = label;
            button.style.display = 'block';
            button.style.margin = '10px auto';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#d8401d';
            button.style.color = '#fff';
            button.style.border = '1px solid #d8401d';
            button.style.borderRadius = '25px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', clickHandler);
            return button;
        }

        function createDeleteButton(label, clickHandler) {
            var button = document.createElement('span');
            button.innerHTML = 'X';
            button.style.display = 'inline-block';
            button.style.marginLeft = '10px';
            button.style.padding = '2px 5px';
            button.style.backgroundColor = '#ff0000';
            button.style.color = '#fff';
            button.style.border = '1px solid #ff0000';
            button.style.borderRadius = '25px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', clickHandler);
            button.setAttribute('data-label', label);
            return button;
        }

        function addFtKitContainer() {
            var ftKitContainer = document.createElement('div');
            ftKitContainer.id = 'ftKitContainer';
            ftKitContainer.style.position = 'fixed';
            ftKitContainer.style.top = '0';
            ftKitContainer.style.right = '-240px';
            ftKitContainer.style.height = '100%';
            ftKitContainer.style.width = '240px';
            ftKitContainer.style.backgroundColor = '#fff';
            ftKitContainer.style.borderLeft = '1px solid #ccc';
            ftKitContainer.style.transition = 'right 0.3s ease-in-out';
            ftKitContainer.style.zIndex = '9999';
            ftKitContainer.style.overflow = 'hidden';
            ftKitContainer.style.textAlign = 'center';

            var generalHeader = document.createElement('div');
            generalHeader.classList.add('header');
            generalHeader.style.marginTop = '20px';
            generalHeader.style.padding = '10px';
            generalHeader.style.color = '#000';
            generalHeader.innerHTML = 'General';

            var toggleMarcosButton = createButton("Toggle Pizza World", function() {
                const rows = document.querySelectorAll('tr.even-row, tr.odd-row');
                const searchText = "Pizza World";
                rows.forEach(row => {
                    const anchor = row.querySelector('td a');
                    if (anchor && anchor.innerText.includes(searchText)) {
                        row.style.display = row.style.display === 'none' ? '' : 'none';
                    }
                });
            });

            var clickCogButton = createButton('Click Cogs', function() {
                const spans = document.querySelectorAll('span.fa.fa-cog');
                spans.forEach(span => {
                    span.click();
                });
            });

            var overnightHeader = document.createElement('div');
            overnightHeader.classList.add('header');
            overnightHeader.style.marginTop = '20px';
            overnightHeader.style.padding = '10px';
            overnightHeader.style.color = '#000';
            overnightHeader.innerHTML = 'Overnight';

            function setRescheduleDate(daysAhead, buttonText) {
                var rescheduleInput = document.getElementById('rescheduleDate');
                var prioritySelect = document.getElementById('Priority');
                var textElement = findTextAreaElement(['Text', 'Reason']);
                var callerEmailInput = document.getElementById('CallerEmail');
                var defaultCallerInfoBtn = document.getElementById('defaultCallerInfoBtn');

                if (callerEmailInput && callerEmailInput.value.trim() === '' && defaultCallerInfoBtn) {
                    defaultCallerInfoBtn.click();
                }

                if (prioritySelect && prioritySelect.value !== 'S') {
                    prioritySelect.value = 'S';
                    triggerChangeEvent(prioritySelect);
                }

                if (rescheduleInput) {
                    var nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + daysAhead);
                    nextDate.setHours(3, 0, 0, 0);

                    var formattedDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear().toString().slice(-2)}, ${nextDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

                    rescheduleInput.value = formattedDate;

                    if (textElement) {
                        textElement.textContent = buttonText;
                    }
                }
            }

            function handleOnCloseButtonClick() {
                var resolutionTextarea = findTextAreaElement(['Text', 'Reason']);
                var closeAuthorizerInput = document.querySelector('input[name="CLOSE_AUTHORIZER"]');

                if (resolutionTextarea) {
                    resolutionTextarea.value = 'All Set';
                    triggerChangeEvent(resolutionTextarea);
                }

                if (closeAuthorizerInput) {
                    closeAuthorizerInput.value = 'ON';
                    triggerChangeEvent(closeAuthorizerInput);
                }
            }

            var update3AMButton = createButton('Update 3AM', function() {
                setRescheduleDate(1, 'To Overnight');
            });

            var a77PushButton = createButton('A77 Push', function() {
                setRescheduleDate(2, 'Pushing Forward 2 days');
            });

            var onCloseButton = createButton('ON Close', handleOnCloseButtonClick);

            ftKitContainer.appendChild(generalHeader);
            ftKitContainer.appendChild(toggleMarcosButton);
            ftKitContainer.appendChild(clickCogButton);
            ftKitContainer.appendChild(overnightHeader);
            ftKitContainer.appendChild(update3AMButton);
            ftKitContainer.appendChild(a77PushButton);
            ftKitContainer.appendChild(onCloseButton);

            var customButtonsHeader = document.createElement('div');
            customButtonsHeader.classList.add('header');
            customButtonsHeader.style.marginTop = '20px';
            customButtonsHeader.style.padding = '10px';
            customButtonsHeader.style.color = '#000';
            customButtonsHeader.innerHTML = 'Custom Buttons';

            ftKitContainer.appendChild(customButtonsHeader);

            var addCustomButton = createButton('+', function() {
                showCustomButtonModal();
            });
            addCustomButton.style.backgroundColor = '#28a745';
            addCustomButton.style.border = '1px solid #28a745';
            ftKitContainer.appendChild(addCustomButton);

            var editButton = createButton('Edit', function() {
                toggleDeleteButtons();
            });
            editButton.style.backgroundColor = '#ffc107';
            editButton.style.border = '1px solid #ffc107';
            ftKitContainer.appendChild(editButton);

            // Recreate custom buttons
            for (let label in customButtons) {
                if (customButtons.hasOwnProperty(label)) {
                    var buttonConfig = customButtons[label];
                    var customButton = createButton(label, function() {
                        handleCustomButtonClick(label);
                    });
                    var deleteButton = createDeleteButton(label, function(event) {
                        deleteCustomButton(event.target.getAttribute('data-label'));
                    });
                    customButton.style.display = 'inline-block';
                    ftKitContainer.appendChild(customButton);
                    customButton.parentNode.insertBefore(deleteButton, customButton.nextSibling);
                    deleteButton.style.display = 'none'; // Hide delete button initially
                }
            }

            document.body.appendChild(ftKitContainer);
        }

        function toggleDeleteButtons() {
            var deleteButtons = document.querySelectorAll('#ftKitContainer span[data-label]');
            deleteButtons.forEach(button => {
                button.style.display = button.style.display === 'none' ? 'inline-block' : 'none';
            });
        }

        function deleteCustomButton(label) {
            delete customButtons[label];
            GM_setValue('customButtons', customButtons);
            location.reload(); // Reload to apply changes
        }

        function triggerChangeEvent(element) {
            var event = new Event('change', {
                bubbles: true,
                cancelable: true,
            });
            element.dispatchEvent(event);
        }

        function handleFtKitButtonClick() {
            var ftKitContainer = document.getElementById('ftKitContainer');
            if (!ftKitContainer) {
                addFtKitContainer();
            }

            setTimeout(function() {
                ftKitContainer = document.getElementById('ftKitContainer');
                if (ftKitContainer) {
                    var currentRight = parseInt(ftKitContainer.style.right, 10);
                    if (currentRight === 0 || isNaN(currentRight)) {
                        ftKitContainer.style.right = '-240px';
                    } else {
                        ftKitContainer.style.right = '0';
                    }
                }
            }, 10);
        }

        var ftKitButton = document.createElement('button');
        ftKitButton.id = 'ftKitButton';
        ftKitButton.innerHTML = 'FT Kit';
        ftKitButton.style.position = 'fixed';
        ftKitButton.style.top = '50%';
        ftKitButton.style.right = '0';
        ftKitButton.style.transform = 'translateY(-50%)';
        ftKitButton.style.backgroundColor = '#d8401d';
        ftKitButton.style.color = '#fff';
        ftKitButton.style.padding = '15px';
        ftKitButton.style.border = 'none';
        ftKitButton.style.borderRadius = '5px 0 0 5px';
        ftKitButton.style.cursor = 'pointer';
        ftKitButton.style.zIndex = '10000';
        ftKitButton.addEventListener('click', handleFtKitButtonClick);
        document.body.appendChild(ftKitButton);

        function showCustomButtonModal() {
            var customButtonLabel = prompt('Enter label for the custom button:');
            if (customButtonLabel !== null && customButtonLabel.trim() !== '') {
                var daysAhead = parseInt(prompt('Enter number of days ahead:'), 10);
                var buttonText = prompt('Enter text for the button:');
                var additionalActionsConfirmation = confirm('Do you want to specify additional actions?');
                var additionalActions = null;

                if (additionalActionsConfirmation) {
                    var additionalActionsCode = prompt('Enter JavaScript code for additional actions:');
                    additionalActions = new Function(additionalActionsCode);
                }

                customButtons[customButtonLabel] = {
                    daysAhead: daysAhead,
                    text: buttonText,
                    additionalActions: additionalActions,
                };

                GM_setValue('customButtons', customButtons);

                var customButton = createButton(customButtonLabel, function() {
                    handleCustomButtonClick(customButtonLabel);
                });
                var deleteButton = createDeleteButton(customButtonLabel, function(event) {
                    deleteCustomButton(event.target.getAttribute('data-label'));
                });
                customButton.style.display = 'inline-block';
                var ftKitContainer = document.getElementById('ftKitContainer');
                ftKitContainer.appendChild(customButton);
                customButton.parentNode.insertBefore(deleteButton, customButton.nextSibling);
                deleteButton.style.display = 'none'; // Hide delete button initially
            }
        }

        function handleCustomButtonClick(label) {
            var customButtonConfig = customButtons[label];
            if (customButtonConfig) {
        // Retrieve the settings for the custom button
                var daysAhead = customButtonConfig.daysAhead;
                var buttonText = customButtonConfig.text;
                // Call the setRescheduleDate function with the retrieved settings
                setRescheduleDate(daysAhead, buttonText);
                // Perform additional actions if specified
                if (customButtonConfig.additionalActions) {
            customButtonConfig.additionalActions();
        }
    }
        }

    } else {
        console.error('GM_setValue and GM_getValue are not defined. Make sure you are using Tampermonkey.');
    }

})();
