// ==UserScript==
// @name         Winner Selection Script v.1.8.1 Beta
// @description  Automates the process of picking winners from the first post's like list in forum giveaways.
// @namespace    https://github.com/Zw3tty/WinnerSelectionScript
// @version      1.8.1 Beta
// @author       NotZw3tty
// @match        https://gamesense.pub/forums/viewtopic.php?id=*
// @match        https://gamesense.pub/forums/pmsnew.php?mdl=post
// @grant        none
// @supportURL   https://github.com/Zw3tty/WinnerSelectionScript/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483354/Winner%20Selection%20Script%20v181%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/483354/Winner%20Selection%20Script%20v181%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global cache for frequently accessed DOM elements
    let cachedCsrfToken, cachedSubject, cachedMessage;

    const CONFIG = {
        forceUIDAddButtons: 1,
        messagingDelay: 30000,
        messagingURL: 'https://gamesense.pub/forums/pmsnew.php?mdl=post',
    };

    // Helper Function for Logging Errors
    function logError(context, error) {
        console.error(`Error in ${context}:`, error);
        alert(`An error occurred in ${context}. Check the console for more details.`);
    }

    // Function to extract error messages from HTML response
    function extractErrorMessages(htmlResponse) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlResponse, 'text/html');
            const errorListItems = doc.querySelectorAll('#posterror .error-list li strong');
            return Array.from(errorListItems).map(el => el.textContent);
        } catch (error) {
            logError('extractErrorMessages', error);
            return [];
        }
    }

    // sendMessagesToWinners: Sends automated messages to a list of winners.
    // This function iterates over each username, sending a message, and handles potential errors with retries.
    async function sendMessagesToWinners(usernames) {
        try {
            if (!cachedCsrfToken || !cachedSubject || !cachedMessage) {
                cachedCsrfToken = document.querySelector('input[name="csrf_hash"]').value;
                cachedSubject = document.querySelector('input[name="req_subject"]').value;
                cachedMessage = document.querySelector('textarea[name="req_message"]').value;
            }
            let successCount = 0;
            let failCount = 0;
            let failedUsernames = [];
            let detailedErrors = [];

            const progressLabel = document.createElement('label');
            progressLabel.textContent = `Current messages sent: 0 out of ${usernames.length}.\n Please stay on this window so the process does not get interfered.`;

            const buttonsContainer = document.querySelector('form#post .buttons');
            if (buttonsContainer) {
                buttonsContainer.insertAdjacentElement('afterend', progressLabel);
            } else {
                document.body.appendChild(progressLabel);
            }
    
            for (const username of usernames) {
                let attempts = 0;
                let result;
    
                while (!result?.success && attempts < 3) {
                    result = await sendMessageToWinner(username, cachedSubject, cachedMessage, cachedCsrfToken);
    
                    if (result.success) {
                        successCount++;
                        break;
                    } else {
                        if (result?.errors && result.errors.length > 0) {
                            break;
                        }
                        attempts++;
                        await new Promise(resolve => setTimeout(resolve, 30000));
                    }
                }
    
                if (!result?.success) {
                    failCount++;
                    failedUsernames.push(username);
                    if (result?.errors) {
                        detailedErrors.push({ username, errorMessages: result.errors });
                    }
                }
    
                progressLabel.textContent = `Current messages sent: ${successCount + failCount} out of ${usernames.length}.\n Please stay on this window so the process does not get interfered.`;

                await new Promise(resolve => setTimeout(resolve, CONFIG.messagingDelay));
            }
    
            let alertMessage = `${successCount}/${usernames.length} messages sent successfully.`;
            if (failedUsernames.length > 0) {
                alertMessage += `\nFailed to send messages to: ${failedUsernames.join(', ')}`;
                if (detailedErrors.length > 0) {
                    const errorDetails = detailedErrors.map(e => `${e.username}: ${e.errorMessages.join(', ')}`).join('\n');
                    alertMessage += `\nError details:\n${errorDetails}`;
                }
            }

            if (progressLabel.parentNode) {
                progressLabel.parentNode.removeChild(progressLabel);
            }
            alert(alertMessage);
        } catch (error) {
            logError('sendMessagesToWinners', error);
        }
    }

    // sendMessageToWinner: Sends a message to an individual winner.
    // It takes the winner's username, subject, message, and csrfToken, and performs a POST request.
    async function sendMessageToWinner(winnerUsername, subject, message, csrfToken) {
        try {
            const params = new URLSearchParams({
                'csrf_hash': csrfToken,
                'req_addressee': winnerUsername,
                'req_subject': subject,
                'req_message': message,
                'submit': 'Submit'
            });
    
            const response = await fetch(CONFIG.messagingURL, {
                method: 'POST',
                body: params,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    
            const responseBody = await response.text();

            if (responseBody.includes('id="posterror"')) {
                const errors = extractErrorMessages(responseBody);
                return { success: false, errors };
            } else {
                return { success: true };
            }
        } catch (error) {
            console.error(`Error in sendMessageToWinner for ${winnerUsername}:`, error);
            return { success: false, errors: [error.message] };
        }
    }

    // getUserData: Extracts user data from the like list.
    // This function parses the list of users who liked a post and retrieves their usernames and IDs.
    function getUserData(likelistId) {
        try {
            const users = [];
            document.querySelectorAll(`#${likelistId} li a`).forEach(element => {
                const username = element.textContent.trim();
                const uid = getUserIdFromHref(element.href);
                if (uid && !element.classList.contains('usergroup-6')) {
                    users.push({ username, uid });
                }
            });
            return users;
        } catch (error) {
            logError('getUserData', error);
            return [];
        }
    }

    // pickWinners: Randomly selects a specified number of winners from a list of users.
    // Utilizes the cryptographic API for better randomness in selection.
    function pickWinners(userData, numberOfWinners) {
        try {
            if (numberOfWinners < 1 || numberOfWinners > userData.length) {
                alert(`Invalid number of winners. Please choose a number between 1 and ${userData.length}`);
                return [];
            }

            const winners = [];
            while (winners.length < numberOfWinners) {
                if (userData.length === 0) break;
                const randomIndex = window.crypto.getRandomValues(new Uint32Array(1))[0] % userData.length;
                winners.push(userData.splice(randomIndex, 1)[0]);
            }

            return winners;
        } catch (error) {
            logError('pickWinners', error);
            return [];
        }
    }

    // generateWinnersOutput: Generates a formatted string of winners based on user-selected format.
    // Offers multiple formatting options for displaying the list of winners.
    function generateWinnersOutput(winners) {
        try {
            const formatFunctions = {
                '1': user => `@${user.username} (ID: ${user.uid})`,
                '2': user => `${user.username} (ID: ${user.uid})`,
                '3': user => `@${user.username}`,
                '4': user => `${user.username}`,
                '5': user => `@${user.username} (ID: ${user.uid})\n`,
                '6': user => `${user.username} (ID: ${user.uid})\n`,
                '7': user => `@${user.username}\n`,
                '8': user => `${user.username}\n`,
            };
    
            let formatChoice;
            do {
                formatChoice = prompt(
                    "Choose the output format:\n" +
                    "1: @Username (ID: XXXXX)\n" +
                    "2: Username (ID: XXXXX)\n" +
                    "3: @Username\n" +
                    "4: Username\n" +
                    "5: @Username (ID: XXXXX), each on new line\n" +
                    "6: Username (ID: XXXXX), each on new line\n" +
                    "7: @Username, each on new line\n" +
                    "8: Username, each on new line\n" +
                    "Enter a number from 1 to 8:"
                );
            } while (formatChoice && !(formatChoice in formatFunctions));
    
            const formatFunction = formatFunctions[formatChoice || '1'];
    
            return "Winners:\n" + winners.map(formatFunction).join(formatChoice >= '5' ? '' : ', ');
        } catch (error) {
            logError('generateWinnersOutput', error);
            return '';
        }
    }

    // getUserIdFromHref: Extracts the user ID from a given href string.
    // Parses the href attribute of an anchor tag to find the user ID.
    function getUserIdFromHref(href) {
        try {
            if (!href) {
                throw new Error("href is null or undefined.");
            }
    
            const match = href.match(/id=(\d+)/);
            return match ? match[1] : null;
        } catch (error) {
            logError('getUserIdFromHref', error);
            return null;
        }
    }

    // addButtonsToFirstPostFoot: Adds 'Pick Winners' and 'Copy Winners' buttons to the first post's footer.
    // Only adds buttons if certain conditions are met, such as user permissions and page type.
    function addButtonsToFirstPostFoot() {
        try {
            const navProfileLink = document.querySelector('#navprofile a');
            const postAuthorLink = document.querySelector('.postleft dt a');
            const firstPostFootRight = document.querySelector('.postfootright > ul');
    
            if (!navProfileLink || !postAuthorLink || !firstPostFootRight) {
                console.log('Required elements not found on the page for adding buttons.');
                return;
            }
    
            const loggedInUserId = getUserIdFromHref(navProfileLink.href);
            const postAuthorId = getUserIdFromHref(postAuthorLink.href);
    
            if (!loggedInUserId || !postAuthorId) {
                throw new Error("Unable to retrieve user IDs.");
            }
    
            if (CONFIG.forceUIDAddButtons === 1 || loggedInUserId === postAuthorId) {
                const pickWinnersLink = createButton('Pick Winners');
                const pickWinnersLi = wrapInListItem(pickWinnersLink);
                firstPostFootRight.appendChild(pickWinnersLi);
    
                let copyWinnersLiRef = { current: null };
    
                pickWinnersLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    handlePickWinnersClick(firstPostFootRight, pickWinnersLink, copyWinnersLiRef);
                });
            } else {
                console.log('User is not the author of the post and force add is disabled, not adding Giveaway Picker buttons.');
            }
        } catch (error) {
            logError('addButtonsToFirstPostFoot', error);
        }
    }    

    // addMessagingInterface: Sets up the UI for bulk messaging winners.
    // Adds input fields and a button to the messaging page for sending messages to multiple winners.
    function addMessagingInterface() {
        try {
            const txtAreaDiv = document.querySelector('.inform .infldset.txtarea');
            const buttonsContainer = document.querySelector('.buttons');
            const previewButton = document.querySelector('input[name="preview"]');
    
            if (!txtAreaDiv || !buttonsContainer || !previewButton) {
                console.log('Required elements not found on the page for adding messaging interface.');
                return;
            }
    
            const bulkLabel = document.createElement('label');
            bulkLabel.className = 'required';
            bulkLabel.innerHTML = '<strong>Winners <span>(Separated by commas)</span></strong><br>';
    
            const bulkInput = document.createElement('input');
            bulkInput.type = 'text';
            bulkInput.className = 'longinput';
            bulkInput.name = 'usernames';
    
            bulkLabel.appendChild(bulkInput);
            txtAreaDiv.appendChild(bulkLabel);
    
            const subjectInput = document.querySelector('input[name="req_subject"]');
            const messageInput = document.querySelector('textarea[name="req_message"]');
    
            const messageWinnersButton = document.createElement('input');
            messageWinnersButton.type = 'button';
            messageWinnersButton.value = 'Message Winners';
    
            previewButton.insertAdjacentElement('afterend', messageWinnersButton);
    
            messageWinnersButton.addEventListener('click', () => {
                const usernames = bulkInput.value.split(',').map(u => u.trim().replace(/^@/, ''));
                if (!usernames.length || !subjectInput.value.trim() || !messageInput.value.trim()) {
                    alert('Please provide the following details:\n- Usernames\n- Subject\n- Message');
                    return;
                }
    
                const estimatedTimeMinutes = Math.ceil(usernames.length * CONFIG.messagingDelay / 60000);
                alert(`This will take around ${estimatedTimeMinutes} minutes. Please do not close this window or turn off your PC.`);
                sendMessagesToWinners(usernames);
            });
        } catch (error) {
            logError('addMessagingInterface', error);
        }
    }    

    function createButton(text) {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = '#';
        button.style.color = '#60a0dc';
        button.style.fontSize = '11px';
        button.style.cursor = 'pointer';
        return button;
    }

    function wrapInListItem(element) {
        const listItem = document.createElement('li');
        listItem.className = 'postpickgw';
        listItem.appendChild(element);
        return listItem;
    }

    // handlePickWinnersClick: Event handler for 'Pick Winners' button click.
    // Manages the process of winner selection and displaying the output.
    async function handlePickWinnersClick(container, pickWinnersLink, copyWinnersLiRef) {
        try {
            const likelistId = document.querySelector('ul.likelist').id;
            const numberOfWinners = prompt("Enter the number of winners: ");
            if (!numberOfWinners) return;

            const userData = getUserData(likelistId);
            const winners = pickWinners(userData, parseInt(numberOfWinners, 10));
            if (winners && winners.length > 0) {
                const winnersText = generateWinnersOutput(winners);
                alert(winnersText);
    
                if (!copyWinnersLiRef.current) {
                    copyWinnersLiRef.current = createCopyWinnersButton(winnersText);
                    container.appendChild(copyWinnersLiRef.current);
                }
            } else {
                alert("No winners were selected.");
            }
        } catch (error) {
            logError('handlePickWinnersClick', error);
        }
    }

    // createCopyWinnersButton: Creates a button for copying the list of winners to the clipboard.
    // When clicked, it copies the formatted list of winners to the user's clipboard.
    function createCopyWinnersButton(winnersText) {
        const copyWinnersButton = createButton('Copy Winners');
        copyWinnersButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(winnersText).then(function() {
                alert('Winners copied to clipboard!');
            }, function(err) {
                logError('copyWinnersButton', err);
            });
        });
        return wrapInListItem(copyWinnersButton);
    }

    // initializeWinnerSelectionScriptWithMessaging: Main function to initialize the script.
    // Checks the current page and initializes the appropriate functionalities.
    function initializeWinnerSelectionScriptWithMessaging() {
        try {
            const url = window.location.href;

            if (url.includes('https://gamesense.pub/forums/viewtopic.php?id=')) {
                addButtonsToFirstPostFoot();
            }
    
            if (url.includes('https://gamesense.pub/forums/pmsnew.php?mdl=post')) {
                addMessagingInterface();
            }
        } catch (error) {
            logError('initializeWinnerSelectionScriptWithMessaging', error);
        }
    }
    
    initializeWinnerSelectionScriptWithMessaging();
})();