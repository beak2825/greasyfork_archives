// ==UserScript==
// @name         Autotask improvement changes
// @namespace    http://tampermonkey.net/
// @version      13.2
// @description  Functions explained below
// @author       KLElisa
// @match        https://ww19.autotask.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470791/Autotask%20improvement%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/470791/Autotask%20improvement%20changes.meta.js
// ==/UserScript==
// *** FUNCTIONS ***
// CMDB Edit view
//1. Adds "Change to non-operational" button in Autotask CMDB Edit that sets status fields to 'Non-Operational' and 'Retired', and auto-fills the MS End Date with today’s date.
//2. Adds "Change to operational" button in Autotask CMDB Edit that sets status fields to 'Operational' and 'In Production' without modifying other fields or dates.
//3. Adds a persistent 'yellow box' to CMDB edit and detail views with detailed integration instructions for managing Configuration Items for integrated customers.
//4. Highlights critical CMDB field labels (e.g., Account, Status, Serial Number) in dark orange and bold to draw attention to fields required for integration sync.
// NOC new queue view
//5. Adds [C], [S], and [D] copy buttons to each ticket in the NOC new queue view to quickly copy the ticket number, service name, or device name.
//6. Highlights urgent or critical text in the NOC new queue view (e.g. SLA breaches, critical alerts) by changing background and text color to draw attention.
//7. Highlights tickets with the status "SMN Pending" in red text to make them stand out visually in ticket grids.
// Ticket views
//8. Converts plain-text URLs in ticket detail, edit, and time entry views into clickable hyperlinks.
//9. Adds "Copy WiFi AP name", "Copy Service name", and "Copy Device name" buttons to monitoring-related tickets.
//10. Automatically expands 'yellow box' content in ticket detail, edit, and time entry views by automatically clicking the "Show more" button.
//11. Highlights key ticket field labels (e.g., Contact, Queue, Priority) in dark orange and bold in the Ticket Edit view to improve visibility of important fields.
// Ticket notes
//12. Adds a "copy" button to each note in the ticket that copies the note’s text content.
//13. Adds a "paste to note" button next to each note that copies the note’s text and automatically pastes it into the new note box.
//14. Adds a global "Paste to note" button in the note toolbar that pastes the current clipboard content directly into the new note box.
//15. Displays a red reminder in the Quick Note box when additional contacts are present, advising the user to use the "New Note" button and follow Hein/Vaiscom-specific instructions if applicable.
//16. Displays a blue reminder in the Quick Note box when all customer contact fields (Contact, Additional Contacts, Additional Emails) are empty, prompting the user to verify if customer contact is needed.
// Ticket time entry
//17. Adds "DeviceUP-ENG+Replace" and "DeviceUP-FIN+Replace" buttons in Time Entry Summary Notes that auto-select the appropriate speed code and replace 'DEVICENAME' with the device name from the ticket title.
//18. Automatically selects the "NoteToCustomer" or "Integrated customers note" speed code in ticket time entry or new note page.
//19. Reduces excessive vertical spacing between speed code dropdown options.
// General quality of life changes
//20. Automatically hides the left sidebar panel on all Autotask pages to maximize workspace and reduce visual clutter.
//21. Increases the width of the global search and selection input box to 460px for improved usability and visibility of long search terms.
//22. Removes LiveLink, Kaseya, and other specified utility buttons from the Autotask header to declutter the interface and reduce distractions.
//23. Adjusts widget tab layout by allowing tab names to wrap and expanding their width for better readability and usability.
//24. Removes the right-hand sidebar panel from the interface to maximize usable screen space.
//25. Renames the "Dashboards" menu item to "Widgets" in the top navigation bar for clearer terminology.
//26. Adds a custom "Open Tickets" button to the top navigation bar that links directly to the user's ticket queue view.
//27. Replaces the "Calendar" navigation button with a "Search" button that redirects to the ticket search interface, improving quick access to search functionality.
//28. Adds a custom "CMDB" button to the top navigation bar that links directly to the Configuration Item search view for faster access.
//29. Adds a custom "Queue" button to the top navigation bar that links directly to a predefined ticket queue drilldown view.
//30. Replaces the Autotask logo in the top-left corner with bold white text labeled "Autotask" for a cleaner, text-based branding look.
//31. Added 'Clear' button in Ticket Edit mode to remove all secondary resources in one click.
//32. Autotask "Search, Open Tickets, CMDB, Queue" middle+right mouse clickable.
// *** FUNCTIONS ***

(function () {
    'use strict';

    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // [Dark/Light mode] Start of Dark/Light mode check
    function isDarkMode() {
        return Array.from(document.querySelectorAll('*')).some(function (element) {
            var computedStyle = window.getComputedStyle(element);
            return computedStyle.backgroundColor === 'rgb(17, 27, 34)' || computedStyle.backgroundColor === '#111b22';
        });
    }
    // [Dark/Light mode] End of Dark/Light mode check

    // [Adds [Change to operational/non-op] buttons to CMDB Edit mode] Start of change buttons for CMDB Edit
    function addButton(title, fields, values, updateNAandDate, buttonTitle) {
        const button = document.createElement('button');
        button.className = 'Button2 ButtonIcon2 NormalBackground';
        button.style.cssText = 'display: inline; margin-left: 5px; border-radius: 5px; background: #fff; color: #355460; height: 32px; padding-left: 8px; padding-right: 8px; font-size: 12px; font-weight: 600; letter-spacing: .2px; line-height: 16px; font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;';
        button.innerHTML = `<div class="Text2">${title}</div>`;
        button.title = buttonTitle;
        button.addEventListener('click', () => updateFields(fields, values, updateNAandDate));

        const hoverStyle = document.createElement('style');
        hoverStyle.textContent = '.Button2.ButtonIcon2.NormalBackground:hover {background-color: #e5e5e5 !important; color: #002a3a !important;}';
        document.head.appendChild(hoverStyle);

        const cancelButton = findElementByTextContent('.Text2', 'Cancel');
        if (!cancelButton) return console.log('Cancel button not found');

        const parentToolBarItem = cancelButton.closest('.ToolBarItem.Left');
        if (!parentToolBarItem) return console.log('Parent ToolBarItem not found');

        const grandParentToolBar = parentToolBarItem.closest('.ToolBar');
        const containerDiv = document.createElement('div');
        containerDiv.className = 'ToolBarItem Left';
        containerDiv.appendChild(button);
        grandParentToolBar.insertBefore(containerDiv, parentToolBarItem.nextSibling);
    }

    function findElementByTextContent(selector, text) {
        return Array.from(document.querySelectorAll(selector)).find(element => element.textContent.trim() === text.trim());
    }

    function formatDate(date) {
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    }

    function setMsEndDate() {
        const label = Array.from(document.querySelectorAll('.PrimaryText')).find(label => label.textContent.includes('MS End Date'));
        if (!label) return;
        const msEndDateInput = label.closest('.EditorLabelContainer1').nextElementSibling.querySelector('input[type="text"]');
        if (!msEndDateInput) return;
        msEndDateInput.value = formatDate(new Date());
        triggerInputEvent(msEndDateInput);
        triggerChangeEvent(msEndDateInput);
    }

    function updateFields(fields, values, updateNAandDate) {
        fields.forEach((title, i) => {
            const select = findSelectByOptionTitle(title);
            if (select) {
                setFieldValue(select, values[i]);
                triggerChangeEvent(select);
            }
        });

        if (updateNAandDate) {
            //['Reference Name', 'Customer Device Name', 'IP Address', 'MAC Address'].forEach(label => setFieldValueByLabel(label, '')); // 'N/A'
            //['Reference Name', 'Customer Device Name', 'IP Address', 'MAC Address', 'Device Location Comments', 'DNS Name', 'Default Gateway', 'Netmask'].forEach(label => setFieldValueByLabel(label, '')); // 'N/A'
            setMsEndDate();
        }
    }

    function findSelectByOptionTitle(optionTitle) {
        return Array.from(document.querySelectorAll('.DropDownList2')).find(select =>
                                                                            Array.from(select.querySelectorAll('option')).some(option => option.title === optionTitle)
                                                                           );
    }

    function setFieldValue(selectElement, optionValue) {
        selectElement.value = optionValue;
    }

    function triggerChangeEvent(element) {
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function setFieldValueByLabel(label, value) {
        const inputElement = findInputByLabel(label);
        if (inputElement) {
            inputElement.focus();
            inputElement.value = '';
            triggerInputEvent(inputElement);
            [...value].forEach(char => {
                inputElement.value += char;
                triggerInputEvent(inputElement);
                simulateKeyPress(inputElement);
            });
            triggerChangeEvent(inputElement);
        }
    }

    const simulateKeyPress = element => element.dispatchEvent(new KeyboardEvent('keypress', {
        bubbles: true,
        cancelable: true,
        key: element.value.slice(-1),
    }));

    const triggerInputEvent = element => element.dispatchEvent(new Event('input', { bubbles: true }));

    const findInputByLabel = label => Array.from(document.querySelectorAll('.PrimaryText')).find(lbl => lbl.textContent.trim() === label)?.closest('.EditorLabelContainer1').nextElementSibling.querySelector('input[type="text"]');

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/CRM\/InstalledProductEdit\.mvc.*/.test(window.location.href)) {
        waitForElements('.Button2.ButtonIcon2.NormalBackground', 200, 50, 'Button')
            .then(() => {
            addButton('Change to non-operational', ['Non-Operational', 'Retired'], ['29683071', '29683084'], true, 'Changes fields to Non-OP&Retired, End Date');
            addButton('Change to operational', ['Operational', 'In Production'], ['29683072', '29683076'], false, 'Changes fields to Operational&In Production');
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Adds [Change to operational/non-op] buttons to CMDB Edit mode] End of change buttons for CMDB Edit

    // [Adds [C,S,D] copy buttons to new queue] Start of copy buttons for new queue
    function QueueCopyButtons() {
        function copyQueueToClipboard(text) {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        }

        function addQueueCopyButton(element, buttonType, titleFunction) {
            const ticketContent = element.textContent.trim();
            const copyButton = document.createElement('button');
            copyButton.textContent = buttonType;
            copyButton.style.cssText += 'border-radius: 8px; font-weight: 600; font-size: 11px; padding: 1px 3px;';

            const buttonTitles = {
                'C': 'Copies the ticket number',
                'S': 'Copies service name',
                'D': 'Copies device name',
            };

            copyButton.title = buttonTitles[buttonType];
            const title = titleFunction(ticketContent);

            copyButton.addEventListener('mouseover', () => {
                if (isDarkMode()) {
                    copyButton.style.backgroundColor = '#14435a';
                } else {
                    copyButton.style.backgroundColor = '#CCCCCC';
                }

            });

            copyButton.addEventListener('mouseout', () => {
                if (isDarkMode()) {
                    copyButton.style.backgroundColor = 'transparent';
                } else {
                    copyButton.style.backgroundColor = 'transparent';
                }
            });

            copyButton.addEventListener('click', () => copyQueueToClipboard(title));

            if (isDarkMode()) {
                copyButton.style.cssText += `
                background: transparent;
                color: #199ed9;
                border: 1px solid #36454f;
            `;
            }
            else {
                copyButton.style.cssText += `
                background: transparent;
                color: #0077c7;
                border: 1px solid #e9ecee;

            `;
            }

            element.parentNode.insertBefore(copyButton, element);

            return copyButton;
        }

        document.querySelectorAll('.Display').forEach((displayElement) => {
            const ticketNumberElement = displayElement.querySelector('.TextCell.SA.Link.FW130.AL');
            if (ticketNumberElement) {
                addQueueCopyButton(ticketNumberElement, 'C', (title) => title);
            }

            const ticketTitleElement = displayElement.querySelector('.TextCell.SA.Link.LW200.HW800.R.AL');
            if (ticketTitleElement) {
                const sdContainer = document.createElement('div');
                sdContainer.style.display = 'inline-flex';
                const sButton = addQueueCopyButton(ticketTitleElement, 'S', (title) => extractQueueServiceName(title));
                const dButton = addQueueCopyButton(ticketTitleElement, 'D', (title) => extractQueueDeviceName(title));

                sdContainer.appendChild(sButton);
                sdContainer.appendChild(dButton);

                displayElement.insertBefore(sdContainer, ticketTitleElement);
            }
        });

        document.querySelectorAll('.Heading .TextCell').forEach((textCell) => {
            const label = textCell.querySelector('.Label');
            if (label.textContent === 'Title') {
                textCell.style.paddingLeft = '52px';
            }
        });

        function extractQueueServiceName(title) {
            title = title.replace(/^ALARM ESCALATION - /, '')
                .replace(/^WiFi AP /, '');

            const match = title.match(/^(.*?)\s*(monitored from|from)/i);
            return match ? match[1].trim() : title;
        }

        function extractQueueDeviceName(title) {
            if (title.includes("from")) {
                const match = title.match(/from\s*([^ ]+)/i);
                return match ? match[1].trim() : title;
            } else if (title.includes("is reported DOWN")) {
                const match = title.match(/\s*([^ ]+)\s*is reported/i);
                return match ? match[1].trim() : title;
            }
            return title;
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketGridWidgetDrilldown\.mvc.*/.test(window.location.href)) {
        waitForElements('.Display', 200, 50, 'Display')
            .then(() => {
            QueueCopyButtons();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Adds [C,S,D] copy buttons to new queue] End of copy buttons for new queue

    // [Makes https text into hyperlink in yellow box] Start of making links clickable
    function makeLinksClickable() {
        document.querySelectorAll('.Content.Expandable.FormatPreservation.Left, .ExpandableText').forEach(function (element) {
            if (!element.querySelector('.ShowMoreLessButton') && element.textContent.trim().toLowerCase() !== 'show more') {
                element.innerHTML = element.innerHTML.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');
            }
        });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketEdit\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TimeEntry\.mvc.*/.test(window.location.href)) {
        waitForElements('.Content.Expandable.FormatPreservation.Left, .ExpandableText', 200, 50, 'Content')
            .then(() => {
            makeLinksClickable();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Makes https text into hyperlink in yellow box] End of making links clickable

    // [Highlight text in queue] Start of text highlight in new queue
    function highlightQueueText() {
        const targetWords = ['[AUTO-CLOSES] First response breach in 10 min!!!', 'SLA breach in one hour!!!', '1 - Critical'];

        document.querySelectorAll('.TextCell, .ColorizedTextCell').forEach(cell => {
            const lowerCaseText = cell.innerText.toLowerCase();

            if (targetWords.some(word => lowerCaseText.includes(word.toLowerCase()))) {
                cell.style.backgroundColor = lowerCaseText.includes('1 - critical') ? 'red' : 'yellow';
                cell.style.color = lowerCaseText.includes('1 - critical') ? 'white' : 'black';
            }
        });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketGridWidgetDrilldown\.mvc.*/.test(window.location.href)) {
        waitForElements('.TextCell, .ColorizedTextCell', 1500, 10, 'TextCell')
            .then(() => {
            highlightQueueText();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Highlight text in queue] End of text highlight in new queue

    // [Copy Wifi AP/Service/Device name] Start of copy button for monitoring tickets
    function addMonTicketCopyButton(label, selector) {
        const match = Array.from(document.querySelectorAll('span')).find((element) =>
                                                                         element.textContent.includes(label)
                                                                        );

        if (match) {
            const labelText = label.replace(':', '');
            const textToCopy = match.textContent.split(label)[1].trim().split('\n')[0].trim();

            const copyButton = createMonTicketCopyButton(`Copy ${labelText}`, textToCopy);
            const copyMonToClipboardBtn = document.querySelector(selector);

            if (copyMonToClipboardBtn) {
                copyMonToClipboardBtn.parentElement.appendChild(copyButton);
            }
        }
    }

    function createMonTicketCopyButton(buttonText, textToCopy) {
        const copyButton = document.createElement('button');
        copyButton.textContent = buttonText;

        if (isDarkMode()) {
            copyButton.className = 'Button2 ButtonIcon2 NormalBackground';
            copyButton.style.cssText = `
                background: #192229;
                border: 1px solid #4e6973;
                color: #a9a9a9;
                display: inline;
                margin-left: 5px;
                border-radius: 5px;
                height: 24px;
                padding-left: 7px;
                padding-right: 7px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .2px;
                line-height: 16px;
                font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
            `;
        } else {
            copyButton.className = 'Button2 ButtonIcon2 NormalBackground';
            copyButton.style.cssText = `
                display: inline;
                margin-left: 5px;
                border-radius: 5px;
                background: #fff;
                color: #355460;
                height: 24px;
                padding-left: 7px;
                padding-right: 7px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .2px;
                line-height: 16px;
                font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
            `;
        }

        copyButton.title = textToCopy;
        copyButton.addEventListener('click', () => {
            const tempInput = document.createElement('input');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
        });

        return copyButton;
    }

    const hoverStyle = document.createElement('style');
    hoverStyle.textContent = `
    .Button2.ButtonIcon2.NormalBackground:hover,
    .Button2 NormalBackground GrayishHoverBackground,
    .GrayishHoverBackground:hover {
        background-color: ${isDarkMode() ? '#14435a' : '#e5e5e5'} !important;
        color: ${isDarkMode() ? '#a9a9a9' : '#002a3a'} !important;
    }
`;
    document.head.appendChild(hoverStyle);

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.CopyTextButton[title="Copy “ticket number – ticket title” to clipboard"]', 200, 50, 'CopyTextButton')
            .then(() => {
            addMonTicketCopyButton('WiFi AP name:', '.CopyTextButton[title="Copy “ticket number – ticket title” to clipboard"]');
            addMonTicketCopyButton('Service name:', '.CopyTextButton[title="Copy “ticket number – ticket title” to clipboard"]');
            addMonTicketCopyButton('Device name:', '.CopyTextButton[title="Copy “ticket number – ticket title” to clipboard"]');
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Copy Wifi AP/Service/Device name] End of copy button for monitoring tickets

    // [Copy / paste to note / Paste] Start of copy/paste buttons for ticket notes
    function createNoteCopyButton() {
        var copyButton = document.createElement('div');
        copyButton.className = 'LinkButton2';
        copyButton.innerHTML = '<div class="Text2">copy</div>';
        copyButton.title = 'Copy note text';
        copyButton.style.marginLeft = '8px';
        copyButton.addEventListener('click', function (event) {
            var messageText = getNoteMessageTextToCopy(this);
            copyNoteToClipboard(messageText);
        });
        return copyButton;
    }

    function createNoteCopyAndPasteButton() {
        var copyAndPasteButton = document.createElement('div');
        copyAndPasteButton.className = 'LinkButton2';
        copyAndPasteButton.innerHTML = '<div class="Text2">paste to note</div>';
        copyAndPasteButton.title = 'Paste note text into the note box';
        copyAndPasteButton.style.marginLeft = '10px';
        copyAndPasteButton.addEventListener('click', function (event) {
            var messageText = getNoteMessageTextToCopy(this);
            pasteNoteIntoNoteBox(messageText);
        });
        return copyAndPasteButton;
    }

    function getNoteMessageTextToCopy(button) {
        var conversationItem = button.closest('.ConversationItem');
        if (conversationItem) {
            var messageSpan = conversationItem.querySelector('.Message .Searchable span');
            var messageDiv = conversationItem.querySelector('.Message .ReadOnlyRichText.ImageViewerEnabled');

            if (messageSpan) {
                return messageSpan.textContent.trim();
            } else if (messageDiv) {
                return messageDiv.textContent.trim();
            }
        }
        return '';
    }

    function copyNoteToClipboard(text) {
        var tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    function pasteNoteIntoNoteBox(text) {
        const noteTextArea = document.querySelector('.TextArea2 textarea');
        if (noteTextArea) {
            noteTextArea.value = text;
            noteTextArea.style.height = '380px';
            noteTextArea.focus();

            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            noteTextArea.dispatchEvent(inputEvent);
        }
    }

    function addNoteCopyButtons() {
        var deleteButtons = document.querySelectorAll('.FooterActions .Text2');
        deleteButtons.forEach(function (deleteButton) {
            if (deleteButton.textContent === 'delete') {
                var copyButton = createNoteCopyButton();
                var copyAndPasteButton = createNoteCopyAndPasteButton();
                var parentContainer = deleteButton.closest('.FooterActions');
                if (parentContainer) {
                    parentContainer.appendChild(copyButton);
                    parentContainer.appendChild(copyAndPasteButton);
                }
            }
        });
    }

    function addNotePasteButton() {
        const activityTabShell = document.querySelector('.ActivityTabShell');

        if (activityTabShell) {
            const toolBar = activityTabShell.querySelector('.ToolBar');

            if (toolBar) {
                const toolBarItems = toolBar.querySelectorAll('.ToolBarItem.Left');
                const lastToolBarItem = toolBarItems[toolBarItems.length - 1];

                if (lastToolBarItem) {
                    const pasteButton = document.createElement('button');
                    pasteButton.textContent = 'Paste to note';
                    pasteButton.title = 'Paste clipboard text into the note box';

                    if (isDarkMode()) {
                        pasteButton.className = 'Button2 ButtonIcon2 NormalBackground';
                        pasteButton.style.cssText = `
                        background: #192229;
                        border: 1px solid #4e6973;
                        color: #a9a9a9;
                        display: inline;
                        margin-right: 10px;
                        margin-left: 5px;
                        border-radius: 5px;
                        height: 32px;
                        padding-left: 8px;
                        padding-right: 8px;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: .2px;
                        line-height: 16px;
                        font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
                    `;
                    } else {
                        pasteButton.className = 'Button2 ButtonIcon2 NormalBackground';
                        pasteButton.style.cssText = `
                        display: inline;
                        margin-right: 10px;
                        margin-left: 5px;
                        border-radius: 5px;
                        background: #fff;
                        color: #355460;
                        height: 32px;
                        padding-left: 8px;
                        padding-right: 8px;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: .2px;
                        line-height: 16px;
                        font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
                    `;
                    }

                    pasteButton.addEventListener('click', function () {
                        navigator.clipboard.readText()
                            .then(function (clipboardText) {
                            pasteNoteIntoNoteBox(clipboardText);
                        })
                            .catch(function (error) {
                            console.error('Failed to read clipboard data:', error);
                        });
                    });

                    const hoverStyle = document.createElement('style');
                    hoverStyle.textContent = `
    .Button2.ButtonIcon2.NormalBackground:hover,
    .Button2 NormalBackground GrayishHoverBackground,
    .GrayishHoverBackground:hover {
        background-color: ${isDarkMode() ? '#14435a' : '#e5e5e5'} !important;
        color: ${isDarkMode() ? '#a9a9a9' : '#002a3a'} !important;
    }
`;
                    document.head.appendChild(hoverStyle);

                    lastToolBarItem.insertAdjacentElement('afterend', pasteButton);
                }
            }
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.FooterActions .Text2', 2500, 50, 'deleteButtons')
            .then(addNoteCopyButtons)
            .catch(console.error);

        waitForElements('.ActivityTabShell', 200, 50, 'activityTabShell')
            .then(addNotePasteButton)
            .catch(console.error);
    }
    // [Copy / paste to note / Paste] End of copy/paste buttons for ticket notes

    // [Replace Devicename] Start of replace devicename button for summary notes in ticket time entry
    function addDevUPButton() {
        var internalNotesElement = Array.from(document.querySelectorAll('.LabelContainer1 .Text span.PrimaryText')).find(e => e.textContent === 'Summary Notes');
        if (internalNotesElement) {
            var devUpEngButton = createDevUPButton('customActionButtonEng', 'DeviceUP-ENG+Replace', 'Chooses DevUP speedcode and replaces DEVICENAME with devicename from ticket (English)', '#355460', 'DeviceUP - DeviceUP');

            var devUpFinButton = createDevUPButton('customActionButtonFin', 'DeviceUP-FIN+Replace', 'Chooses DevUP speedcode and replaces DEVICENAME with devicename from ticket (Finnish)', '#355460', 'DeviceUP-F - DeviceUP-F');

            var buttonWrapper = document.createElement('div');
            buttonWrapper.appendChild(devUpEngButton);
            buttonWrapper.appendChild(devUpFinButton);

            if (isDarkMode()) {
                buttonWrapper.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 10px;
            `;
            }

            internalNotesElement.closest('.LabelContainer1').appendChild(buttonWrapper);
        }
    }

    function createDevUPButton(id, text, title, color, speedCode) {
        var actionButton = document.createElement('button');
        actionButton.id = id;
        actionButton.innerHTML = text;
        actionButton.title = title;

        if (isDarkMode()) {
            actionButton.className = 'Button2 ButtonIcon2 NormalBackground';
            actionButton.style.cssText = `
            background: #192229;
            border: 1px solid #4e6973;
            color: #a9a9a9;
            display: inline;
            border-radius: 5px;
            height: 32px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .2px;
            line-height: 32px;
            font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
        `;
        } else {
            actionButton.className = 'Button2 ButtonIcon2 NormalBackground';
            actionButton.style.cssText = `
            display: inline;
            margin-left: 10px;
            border-radius: 5px;
            background: #fff;
            color: #355460;
            height: 24px;
            padding-left: 7px;
            padding-right: 7px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .2px;
            line-height: 16px;
            font-family: "Roboto", Arial, Helvetica, Tahoma, sans-serif;
        `;
        }

        const hoverStyle = document.createElement('style');
        hoverStyle.textContent = `
    .Button2.ButtonIcon2.NormalBackground:hover,
    .Button2 NormalBackground GrayishHoverBackground,
    .GrayishHoverBackground:hover {
        background-color: ${isDarkMode() ? '#14435a' : '#e5e5e5'} !important;
        color: ${isDarkMode() ? '#a9a9a9' : '#002a3a'} !important;
    }
`;

        document.head.appendChild(hoverStyle);

        actionButton.addEventListener('click', function () {
            chooseDevUPSpeedCode(speedCode);

            setTimeout(function () {
                var titleElement = document.querySelector('.IdentificationContainer.ReadOnly .Title .Text');
                var richtextbox = document.querySelector('.RichTextBox2 .ContentEditable2');

                if (titleElement && richtextbox) {
                    var titleTextModify = titleElement.textContent;
                    var titleTextCopy = modifyDevUPText(titleTextModify);

                    richtextbox.innerHTML = richtextbox.innerHTML.replace(/DEVICENAME/g, titleTextCopy);
                }
            }, 1000);
        });


        return actionButton;
    }

    function chooseDevUPSpeedCode(speedCode) {
        document.querySelector('.SingleItemSelector2 .SearchBox input').click();

        var speedCodeElement = Array.from(document.querySelectorAll('.SingleItemSelector2 .Text span')).find(e => e.textContent === speedCode);
        if (speedCodeElement) {
            speedCodeElement.closest('.Item').click();
        }
    }

    function modifyDevUPText(originalText) {
        var ignoredPrefixes = /^(ARE|INC|WINCT|WINC|CHG|RITM|KEMIN|IN0|ITASK)\S*/i;
        var textWithoutIgnoredPrefix = originalText.replace(ignoredPrefixes, '').trim();
        var keywords = ['is reported', 'down', 'monitored from', 'from'];
        var wifiAPPrefix = 'WiFi AP';
        var alarmEscalationPrefix = 'ALARM ESCALATION - ';

        textWithoutIgnoredPrefix = textWithoutIgnoredPrefix.replace(new RegExp('^' + wifiAPPrefix + '\\s*'), '');
        textWithoutIgnoredPrefix = textWithoutIgnoredPrefix.replace(new RegExp('^' + alarmEscalationPrefix + '\\s*'), '');

        for (var i = 0; i < keywords.length; i++) {
            var keywordIndex = textWithoutIgnoredPrefix.indexOf(keywords[i]);
            if (keywordIndex !== -1) {
                var trimmedText = textWithoutIgnoredPrefix.substring(0, keywordIndex).trim();
                var words = trimmedText.split(/\s+/);

                for (var j = 0; j < Math.min(2, words.length); j++) {
                    words[j] = words[j].replace(ignoredPrefixes, '').trim();
                }

                return words.join(' ').trim();
            }
        }

        return textWithoutIgnoredPrefix;
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TimeEntry\.mvc.*/.test(window.location.href)) {
        waitForElements('.LabelContainer1 .Text span.PrimaryText', 200, 50, 'internalNotesElement')
            .then(addDevUPButton)
            .catch(console.error);
    }
    // [Replace Devicename] End of replace devicename button for summary notes in ticket time entry

    // [Show more] Start of auto expand for show more button
    function clickShowMoreButton() {
        var showMoreButton = document.querySelector('.MessageBarContainer .ShowMoreLessButton');
        if (showMoreButton) {
            showMoreButton.click();
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketEdit\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TimeEntry\.mvc.*/.test(window.location.href)) {
        window.addEventListener('load', function () {
            waitForElements('.MessageBarContainer .ShowMoreLessButton', 200, 50, 'showMoreButton')
                .then(clickShowMoreButton)
                .catch(console.error);
        });
    }
    // [Show more] End of auto expand for show more button

    // [Note to customer speedcode] Start of automatically pick NoteToCustomer speedcode from dropdown menu
    function chooseNotetoCustSpeedCode() {
        const dropdown = document.querySelector('.SingleItemSelector2');
        const desiredValue1 = 'NoteToCust - NoteToCustomer';
        const desiredValue2 = 'OTK&Valmet - Integrated customers note (additional contact)';

        for (const option of dropdown.querySelectorAll('.Item[data-item-type="SingleText"]')) {
            const optionText = option.querySelector('.Text span').innerText;
            if (optionText === desiredValue1 || optionText === desiredValue2) {
                option.click();
                break;
            }
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TimeEntry\.mvc\/NewTicketTimeEntryPage.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/Note\.mvc\/NewTicketNotePage.*/.test(window.location.href)) {
        waitForElements('.SingleItemSelector2', 200, 50, 'dropdown')
            .then(chooseNotetoCustSpeedCode)
            .catch(console.error);
    }
    // [Note to customer speedcode] End of automatically pick NoteToCustomer speedcode from dropdown menu

    // [Large spaces between menu options] Start of removal of large spaces between speedcode options
    function modifyLargeSpacesCSS() {
        GM_addStyle('.ItemList > .Item { padding: 2px 2px !important; }');
        const groupHeader = document.querySelector('.GroupHeader[data-item-type="GroupHeader"]');
        if (groupHeader) {
            groupHeader.parentNode.removeChild(groupHeader);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.GroupHeader[data-item-type="GroupHeader"]', 200, 50, 'groupHeader')
            .then(modifyLargeSpacesCSS)
            .catch(console.error);
    }
    // [Large spaces between menu options] End of removal of large spaces between speedcode options

    // [Additional Contacts NB] Start of Additional Contacts reminder
    function checkAdditionalContacts() {
        let additionalContacts = document.querySelector('.ReadOnlyData.QuickEditEnabled .ExpandableDataItem.AdditionalContact');
        return additionalContacts !== null;
    }

    function checkHein() {
        let additionalContacts = document.querySelector('.ReadOnlyData.QuickEditEnabled .ExpandableDataItem.AdditionalContact');
        if (additionalContacts) {
            let contactText = additionalContacts.textContent;
            let keywords = ['Hein Netzwerktechni', 'Kemi mine Vaiscom'];
            return keywords.some(keyword => contactText.includes(keyword));
        }
        return false;
    }

    function addReminder() {
        let quickNoteBox = document.querySelector('.QuickNoteEditorContainer .Note');
        if (quickNoteBox) {
            let reminder = document.createElement('div');
            if (checkHein()) {
                reminder.innerHTML = 'NB! Additional Contacts are filled, use "New Note" button instead! <br> Add Hein/Vaiscom ticket number to front of our ticket title! <br> Remove Hein/Vaiscom contact from ticket if no need to contact them anymore.';
            } else {
                reminder.innerHTML = 'NB! Additional Contacts are filled, use "New Note" button instead!';
            }
            reminder.style.color = 'red';
            quickNoteBox.insertBefore(reminder, quickNoteBox.firstChild);
        }
    }


    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.QuickNoteEditorContainer .Note', 200, 50, 'Quick Note box')
            .then(() => {
            if (checkAdditionalContacts()) {
                addReminder();
            }
        })
            .catch(console.error);
    }
    // [Additional Contacts NB] End of Additional Contacts reminder


    // [Contacts NB] Start of Contacts reminder
    function findAdditionalContacts() {
        let fadditionalContacts = document.querySelector('.ReadOnlyData.QuickEditEnabled .ExpandableDataItem.AdditionalContact');
        //console.log('Additional Contacts:', fadditionalContacts !== null);
        return fadditionalContacts !== null;
    }

    function findContact() {
        let fcontactContainer = Array.from(document.querySelectorAll('.ReadOnlyData.QuickEditEnabled')).find(el => el.querySelector('.ReadOnlyLabelContainer .Text.ClickEnabled span').innerText === "Contact");
        let fcontact = fcontactContainer ? fcontactContainer.querySelector('.ReadOnlyValueContainer .Value').innerText.trim() : null;
        //console.log('Contact:', fcontact !== "");
        return fcontact !== "";
    }

    function findAdditionalEmails() {
        let fadditionalEmailsContainer = Array.from(document.querySelectorAll('.ReadOnlyData.QuickEditEnabled')).find(el => el.querySelector('.ReadOnlyLabelContainer .Text.ClickEnabled span').innerText === "Additional Emails");
        let fadditionalEmails = fadditionalEmailsContainer ? fadditionalEmailsContainer.querySelector('.ReadOnlyValueContainer .Value').innerText.trim() : null;
        //console.log('Additional Emails:', fadditionalEmails !== "");
        return fadditionalEmails !== "";
    }

    function addNBReminder() {
        let ignoredNumbers = ['29774099', '29697086', '29684514', '29696953'];
        if (ignoredNumbers.some(num => document.documentElement.innerHTML.includes(num))) {
            return;
        }

        let quickNoteBox = document.querySelector('.QuickNoteEditorContainer .Note');
        if (quickNoteBox) {
            let reminder = document.createElement('div');
            reminder.textContent = 'NB! All customer contact fields are empty! (Ignore if ticket doesnt need customer contacts)';
            reminder.style.color = 'blue';
            quickNoteBox.insertBefore(reminder, quickNoteBox.firstChild);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.QuickNoteEditorContainer .Note', 200, 50, 'Quick Note box')
            .then(() => {
            let checks = [findContact(), findAdditionalEmails(), findAdditionalContacts()];
            let trueCount = checks.filter(Boolean).length;
            if (trueCount === 0) {
                addNBReminder();
            }
        })
            .catch(console.error);
    }
    // [Contacts NB] End of Contacts reminder

    // [Adds [Yellow box to CMDB] Start of yellow box for CMDB
    function insertMessageBar() {
        // Create the custom message bar
        var messageBar = document.createElement('div');
        messageBar.className = 'MessageBarContainer Active';

        // Define your custom text as a variable
        var customText = '[Integrated customers] These fields should be filled to trigger a sync to customer via integration:\n' +
            'Account, Status, Install Date, Installed By, Product, Serial Number, Device Type\n\n' +
            'When creating or editing a CI, try to fill all of these fields (above fields included):\n' +
            'Location, Area, Device Location Comments, Contract, Billing Category, MS Start Date, Reference Name, Customer Device Name, IP Address, MAC Address, Backup, Model, ISP Connection ID, Operational Status, Lifecycle Status\n\n' +
            'If inactivating a CI:\n1. Keep Status:Active\n2. Fill MS End Date\n3. Change Operational Status:Non-Operational and Lifecycle Status:Retired\n\n' +
            'If integrated customer says our changes haven`t updated to their side, check that all above fields are filled correctly. Change Operational Status:Non-Operational and Lifecycle Status:Retired, save and wait a minute and then change it back.';

        // Use the customText variable in the innerHTML
        messageBar.innerHTML = '<div class="MessageBar MessageBarWarning" data-message-bar-key="AccountAlert"><div class="IconContainer MessageBarWarning"><div class="MessageBarIcon Exclamation"></div></div><div class="Content Expandable FormatPreservation Left">' + customText + '</div></div>';

        // Find the QuickLaunchBar and MainContainer elements
        var quickLaunchBar = document.querySelector('.QuickLaunchBar');
        var mainContainer = document.querySelector('.MainContainer');

        // Insert the custom message bar between the QuickLaunchBar and MainContainer
        if (quickLaunchBar && mainContainer) {
            mainContainer.parentNode.insertBefore(messageBar, mainContainer);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/CRM\/InstalledProductEdit\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/CRM\/InstalledProductDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.QuickLaunchBar', 200, 50, 'QuickLaunchBar')
            .then(() => {
            insertMessageBar();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Adds [Yellow box to CMDB] End of yellow box for CMDB

    // [Colors [CMDB field color] Start of field colors for CMDB
    const CMDBwords = ["Account", "Status", "Install Date", "Installed By", "Product", "Serial Number", "Device Type", "Location", "Area", "Device Location Comments", "Contract", "Billing Category", "MS Start Date", "Reference Name", "Customer Device Name", "IP Address", "MAC Address", "Backup", "Model", "ISP Connection ID", "Operational Status", "Lifecycle Status"];

    function CMDBWordColor() {
        CMDBwords.forEach(word => {
            const elements = document.querySelectorAll('.PrimaryText');
            elements.forEach(element => {
                if (element.textContent.trim() === word) {
                    element.style.color = 'DarkOrange';
                    element.style.fontWeight = 'bold';
                }
            });
        });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/CRM\/InstalledProductEdit\.mvc.*/.test(window.location.href) || /^https:\/\/ww\d+\.autotask\.net\/Mvc\/CRM\/InstalledProductDetail\.mvc.*/.test(window.location.href)) {
        waitForElements('.QuickLaunchBar', 200, 50, 'QuickLaunchBar')
            .then(() => {
            CMDBWordColor();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Colors [CMDB field color] End of field colors for CMDB

    // [Colors [Ticket field color] Start of field colors for ticket
    const Ticketwords = ["Account", "Contact", "Status", "Priority", "Ticket Type", "Issue Type", "Sub-Issue Type", "Queue", "Workqueue", "Primary Resource (Role)", "Secondary Resources (Role)", "Contract", "Additional Emails", "Additional Contacts", "Ticket Category"];

    function TicketWordColor() {
        Ticketwords.forEach(word => {
            const elements = document.querySelectorAll('.PrimaryText');
            elements.forEach(element => {
                if (element.textContent.trim() === word) {
                    element.style.color = 'DarkOrange';
                    element.style.fontWeight = 'bold';
                }
            });
        });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketEdit\.mvc.*/.test(window.location.href)) {
        waitForElements('.QuickLaunchBar', 200, 50, 'QuickLaunchBar')
            .then(() => {
            TicketWordColor();
        })
            .catch((error) => {
            console.error(error);
        });
    }
    // [Colors [Ticket field color] End of field colors for ticket

    // [Auto Hides the Left Sidebar] Start of sidebar hide
    function autoHideSidebar() {
        const collapseButton = document.querySelector('.c-side-panel-collapse-button');
        if (collapseButton && !collapseButton.classList.contains('c-side-panel-collapse-button--is-hidden')) {
            collapseButton.click();
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-side-panel-collapse-button', 200, 50, 'collapseButton')
            .then(autoHideSidebar)
            .catch(console.error);
    }
    // [Auto Hides the Left Sidebar] End of sidebar hide

    // [Search and selection wider] Start of making search and selection box wider
    function setSearchBoxWidth() {
        const searchBox = document.querySelector('.c-search-box__input-wrapper');
        if (searchBox) {
            searchBox.style.width = '460px';
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-search-box__input-wrapper', 200, 50, 'searchBox')
            .then(setSearchBoxWidth)
            .catch(console.error);
    }
    // [Search and selection wider] End of making search and selection box wider

    // [Removes LiveLink and Kaseya Button] Start of removing Livelink & Kaseya button
    function removeUtilityButtons() {
        const liveLinkButton = document.querySelector('.o-header-utility-menu-button[data-onyx-external-id="0B06uhrb"]');
        if (liveLinkButton) {
            liveLinkButton.remove();
        }

        const otherButton = document.querySelector('.o-header-utility-button[data-onyx-external-id="0B078U9W"]');
        if (otherButton) {
            otherButton.remove();
        }

        const newButton = document.querySelector('.c-button[data-onyx-external-id="0o07PHNH"]');
        if (newButton) {
            newButton.remove();
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    removeUtilityButtons();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.o-header-utility-menu-button[data-onyx-external-id="0B06uhrb"], .o-header-utility-button[data-onyx-external-id="0B078U9W"], .c-button[data-onyx-external-id="0o07PHNH"]', 200, 50, 'utilityButtons')
            .then(() => {
            removeUtilityButtons();
            observeDOMChanges();
        })
            .catch(console.error);
    }
    // [Removes LiveLink and Kaseya Button] End of removing Livelink & Kaseya button

    // [Adjusts the size of widget tabs] Start of widget tab adjust
    function adjustTabTitles() {
        GM_addStyle(`
        .c-tab-group__tab-area {
            display: flex;
            flex-wrap: wrap;
        }
        .o-tab {
            flex: 1 1 auto;
            min-width: 1px;
            max-width: 232px;
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
        }
        .o-tab__name {
            display: block;
            text-align: center;
        }
    `);
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-tab-group__tab-area', 200, 50, 'tabArea')
            .then(adjustTabTitles)
            .catch(console.error);
    }
    // [Adjusts the size of widget tabs] End of widget tab adjust

    // [Removes right sidebar] Start of removal of right sidebar
    function removeRightSidebar() {
        const rightSidebar = document.querySelector('.c-side-panel[data-onyx-external-id="0H06srOZ"]');
        if (rightSidebar) {
            rightSidebar.remove();
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-side-panel[data-onyx-external-id="0H06srOZ"]', 200, 50, 'rightSidebar')
            .then(removeRightSidebar)
            .catch(console.error);
    }
    // [Removes right sidebar] End of removal of right sidebar

    // [Renames Dashboards to Widgets] Start of rename of Dashboards
    function replaceDashboardsText() {
        const dashboardsButton = document.querySelector('.o-header-navigation-menu-button button[title="Dashboards"]');
        if (dashboardsButton) {
            const parentButton = dashboardsButton.closest('.o-header-navigation-menu-button');
            if (parentButton) {
                parentButton.querySelector('button').title = "Widgets";
                parentButton.querySelector('.o-header-navigation-menu-button__button__name').textContent = "Widgets";
            }
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.o-header-navigation-menu-button button[title="Dashboards"]', 200, 50, 'dashboardsButton')
            .then(replaceDashboardsText)
            .catch(console.error);
    }
    // [Renames Dashboards to Widgets] End of rename of Dashboards

    // [Tickets button to menu bar] Start of adding Tickets button
    function addTicketsButton() {
        const navButtonsContainer = document.querySelector('.c-header__navigation-buttons');
        if (navButtonsContainer) {
            const TicketsButton = document.createElement('div');
            TicketsButton.className = 'o-header-navigation-menu-button';

            const ticketsLink = document.createElement('a');
            ticketsLink.className = 'o-header-navigation-menu-button__button brand-theme';
            ticketsLink.href = "https://ww19.autotask.net/AutotaskOnyx/LandingPage?view=my-workspace-and-queues&view-data=eyJ1cmwiOiJodHRwczovL3d3MTkuYXV0b3Rhc2submV0L012Yy9TZXJ2aWNlRGVzay9NeVdvcmtzcGFjZUFuZFF1ZXVlc1RpY2tldHMubXZjL1N1bW1hcnkifQ%3D%3D";
            ticketsLink.title = "Open Tickets";
            ticketsLink.style.textDecoration = "none";

            ticketsLink.innerHTML = `
            <div class="o-header-navigation-menu-button__button__name o-font--body-regular">Open Tickets</div>
        `;

            TicketsButton.appendChild(ticketsLink);
            navButtonsContainer.appendChild(TicketsButton);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-header__navigation-buttons', 200, 50, 'navButtonsContainer')
            .then(addTicketsButton)
            .catch(console.error);
    }
    // [Tickets button to menu bar] End of adding Tickets button

    // [Replace Calendar with Search] Start of replace Calendar
    function replaceCalendarButton() {
        const calendarButton = document.querySelector('.o-header-navigation-menu-button button[title="Calendar"]');
        if (calendarButton) {
            const parentButton = calendarButton.closest('.o-header-navigation-menu-button');
            if (parentButton) {
                const searchLink = document.createElement('a');
                searchLink.className = 'o-header-navigation-menu-button__button brand-theme';
                searchLink.href = "https://ww19.autotask.net/AutotaskOnyx/LandingPage?view=ticket-search&view-data=eyJ1cmwiOiJodHRwczovL3d3MTkuYXV0b3Rhc2submV0L012Yy9TZXJ2aWNlRGVzay9UaWNrZXRHcmlkU2VhcmNoLm12Yy9JbmRleCJ9";
                searchLink.title = "Search";
                searchLink.style.textDecoration = "none";
                searchLink.innerHTML = `
                <div class="o-header-navigation-menu-button__button__name o-font--body-regular">Search</div>
            `;

                parentButton.innerHTML = '';
                parentButton.appendChild(searchLink);
            }
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.o-header-navigation-menu-button button[title="Calendar"]', 200, 50, 'calendarButton')
            .then(replaceCalendarButton)
            .catch(console.error);
    }
    // [Replace Calendar with Search] End of replace Calendar

    // [CMDB button to menu bar] Start of adding CMDB button
    function addCMDBButton() {
        const navButtonsContainer = document.querySelector('.c-header__navigation-buttons');
        if (navButtonsContainer) {
            const cmdbButton = document.createElement('div');
            cmdbButton.className = 'o-header-navigation-menu-button';

            const cmdbLink = document.createElement('a');
            cmdbLink.className = 'o-header-navigation-menu-button__button brand-theme';
            cmdbLink.href = "https://ww19.autotask.net/AutotaskOnyx/LandingPage?view=search-configuration-item&view-data=eyJ1cmwiOiJodHRwczovL3d3MTkuYXV0b3Rhc2submV0L012Yy9Dcm0vSW5zdGFsbGVkUHJvZHVjdEdyaWRTZWFyY2gubXZjL0luZGV4In0%3D";
            cmdbLink.title = "CMDB";
            cmdbLink.style.textDecoration = "none";

            cmdbLink.innerHTML = `
            <div class="o-header-navigation-menu-button__button__name o-font--body-regular">CMDB</div>
        `;

            cmdbButton.appendChild(cmdbLink);
            navButtonsContainer.appendChild(cmdbButton);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-header__navigation-buttons', 200, 50, 'navButtonsContainer')
            .then(addCMDBButton)
            .catch(console.error);
    }
    // [CMDB button to menu bar] End of adding CMDB button

    // [Queue button to menu bar] Start of adding Queue button
    function addQueueButton() {
        const navButtonsContainer = document.querySelector('.c-header__navigation-buttons');
        if (navButtonsContainer) {
            const queueButton = document.createElement('div');
            queueButton.className = 'o-header-navigation-menu-button';

            const queueLink = document.createElement('a');
            queueLink.className = 'o-header-navigation-menu-button__button brand-theme';
            queueLink.href = "https://ww19.autotask.net/Mvc/ServiceDesk/TicketGridWidgetDrilldown.mvc/PrimaryStandardDrilldown?null=&drillDownModel.ContentId=47%2C752&drillDownModel.ContentId_TC=12&drillDownModel.ContentTypeId=1&drillDownModel.ContentTypeId_TC=12&drillDownModel.PrimaryGroupByValue=29%2C683%2C377&drillDownModel.PrimaryGroupByValue_TC=12&drillDownModel.HasPrimaryGroupByValue=true&drillDownModel.SecondaryGroupByValue=&drillDownModel.HasSecondaryGroupByValue=false&drillDownModel.ReportOnFieldOptionId=&drillDownModel.ReportOnFieldOptionId_TC=10&drillDownModel.TabLevelFilterPrimaryValue=&drillDownModel.TabLevelFilterPrimaryValue_TC=10&drillDownModel.boardId=&drillDownModel.isPopOut=true";
            queueLink.title = "Queue";
            queueLink.style.textDecoration = "none";

            queueLink.innerHTML = `
            <div class="o-header-navigation-menu-button__button__name o-font--body-regular">Queue</div>
        `;

            queueButton.appendChild(queueLink);
            navButtonsContainer.appendChild(queueButton);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-header__navigation-buttons', 200, 50, 'navButtonsContainer')
            .then(addQueueButton)
            .catch(console.error);
    }
    // [Queue button to menu bar] End of adding Queue button

    // [Replace Autotask logo with text] Start of replacing logo
    function replaceLogoWithText() {
        const logoContainer = document.querySelector('.c-header__logo[data-onyx-external-id="0B06uhqW"]');
        if (logoContainer) {
            const logoImage = logoContainer.querySelector('img');
            if (logoImage) {
                logoImage.remove();
            }

            const logoText = document.createElement('div');
            logoText.className = 'o-header-navigation-menu-button__button__name o-font--body-regular';
            logoText.textContent = 'Autotask';
            logoText.style.color = 'white';
            logoText.style.fontWeight = 'bold';
            logoText.style.marginLeft = '10px';
            logoText.style.marginRight = '30px';

            logoContainer.appendChild(logoText);
        }
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.c-header__logo[data-onyx-external-id="0B06uhqW"]', 200, 50, 'logoContainer')
            .then(replaceLogoWithText)
            .catch(console.error);
    }
    // [Replace Autotask logo with text] End of replacing logo

    // [SMN Pending tickets in red color] Start of coloring SMN Pending
    function highlightSMNPending() {
        const elements = document.querySelectorAll('.ColorSwatch.ColorText.ColorizedTextCell');
        elements.forEach(element => {
            if (element.textContent.trim() === 'SMN Pending') {
                element.style.color = 'red';
            }
        });
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/.*/.test(window.location.href)) {
        waitForElements('.ColorSwatch.ColorText.ColorizedTextCell', 200, 50, 'smnPendingElements')
            .then(highlightSMNPending)
            .catch(console.error);
    }
    // [SMN Pending tickets in red color] End of coloring SMN Pending

    // [Clear Secondary Resources Button] Start
    function addClearSecondaryResourcesButton() {
        const labelSpans = Array.from(document.querySelectorAll('span.PrimaryText'));
        const secondaryLabel = labelSpans.find(span => span.textContent.includes('Secondary Resources'));

        if (!secondaryLabel) return;

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.title = 'Remove all secondary resources';
        clearButton.style.marginLeft = '10px';
        clearButton.style.padding = '2px 6px';
        clearButton.style.fontSize = '11px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.backgroundColor = '#ff4d4d';
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.borderRadius = '3px';
        clearButton.style.flexShrink = '0';
        clearButton.style.display = 'inline-block';
        clearButton.style.zIndex = '1000';
        clearButton.style.position = 'relative';

        clearButton.addEventListener('click', () => {
            const chipLists = Array.from(document.querySelectorAll('.ChipList.MultipleDataSelection'));
            chipLists.forEach(chipList => {
                const removeButtons = chipList.querySelectorAll('.RemoveButton');
                removeButtons.forEach(btn => btn.click());
            });
        });

        secondaryLabel.parentElement.appendChild(clearButton);
    }

    if (/^https:\/\/ww\d+\.autotask\.net\/Mvc\/ServiceDesk\/TicketEdit\.mvc.*/.test(window.location.href)) {
        const observer = new MutationObserver(() => {
            const secondaryLabelExists = Array.from(document.querySelectorAll('span.PrimaryText'))
            .some(span => span.textContent.includes('Secondary Resources'));
            if (secondaryLabelExists) {
                addClearSecondaryResourcesButton();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    // [Clear Secondary Resources Button] End
})();