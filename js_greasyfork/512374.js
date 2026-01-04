// ==UserScript==
// @name         Poe Delete All Chats For a Bot
// @namespace    http://tampermonkey.net/
// @version      2024-10-12-14:40
// @description  Adds a button to delete all chats on poe.com/chats?bot=* for a bot
// @author       https://www.reddit.com/user/Rizean/
// @match        https://poe.com/chats?bot=*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/512374/Poe%20Delete%20All%20Chats%20For%20a%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/512374/Poe%20Delete%20All%20Chats%20For%20a%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Restore console if necessary
    if (!("console" in window) || !("firebug" in console)) {

        console.log = null;
        console.log;         // null

        delete console.log;

        // Original by Xaerxess
        var i = document.createElement('iframe');
        i.style.display = 'none';
        document.body.appendChild(i);
        window.console = i.contentWindow.console;

    }

    let deleteButton = null;

    // Function to check if the current URL matches the target pattern
    function isTargetPage() {
        return window.location.href.match(/^https:\/\/poe\.com\/chats\?bot=.*$/);
    }

    // Function to access getAPISig
    function getGetAPISigFunction() {
        return new Promise((resolve, reject) => {
            getWebpackRequire().then((webpackRequire) => {
                try {
                    const getAPISig = findGetAPISigModule(webpackRequire);
                    if (getAPISig) {
                        resolve(getAPISig);
                    } else {
                        reject('getAPISig function not found.');
                    }
                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        });
    }

    // Function to access the webpack require function
    function getWebpackRequire() {
        return new Promise((resolve, reject) => {
            // Wait until webpackChunk_N_E is available
            const checkInterval = setInterval(() => {
                if (window.webpackChunk_N_E) {
                    clearInterval(checkInterval);
                    let webpackRequire;
                    window.webpackChunk_N_E.push([
                        [Math.random()],
                        {},
                        (req) => {
                            webpackRequire = req;
                        }
                    ]);
                    if (webpackRequire) {
                        resolve(webpackRequire);
                    } else {
                        reject('Webpack require function not found.');
                    }
                }
            }, 100);
        });
    }

    // Function to find getAPISig in the modules
    function findGetAPISigModule(webpackRequire) {
        const moduleIds = Object.keys(webpackRequire.m);
        for (const id of moduleIds) {
            try {
                const mod = webpackRequire(id);
                if (mod && mod.S && typeof mod.S === 'function') {
                    // Additional checks to confirm it's getAPISig
                    if (mod.S.toString().includes('window.bR8qjbJA8tZobI7Iu')) {
                        return mod.S;
                    }
                }
            } catch (e) {
                // Ignore errors from requiring certain modules
            }
        }
        throw new Error('getAPISig function not found in modules.');
    }

    // Initialize the script after the DOM is fully loaded
    function init() {
        console.debug('Initializing Delete All Chats script');

        // Get getAPISig function (your existing code to get getAPISig)
        getGetAPISigFunction().then((getAPISig) => {
            window.getAPISig = getAPISig;

            // Check if we're on the target page
            if (isTargetPage()) {
                createDeleteButton();
            }

            // Start monitoring URL changes
            monitorUrlChanges();
        }).catch((error) => {
            console.error('Failed to get getAPISig function:', error);
            alert('Failed to initialize script. Cannot find getAPISig function.');
        });
    }

    // Wait for the DOM to be fully loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    // Function to create and style the "Delete All Chats" button
    function createDeleteButton() {
        if (deleteButton) return; // Button already exists

        deleteButton = document.createElement('button');
        deleteButton.id = 'deleteAllChatsButton';
        deleteButton.innerText = 'Delete All Chats';
        deleteButton.style.position = 'fixed';
        deleteButton.style.top = '10px';
        deleteButton.style.right = '20px';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.backgroundColor = '#ff4d4d';
        deleteButton.style.color = '#fff';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '5px';
        deleteButton.style.fontSize = '16px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.zIndex = '9999';

        deleteButton.addEventListener('click', function () {
            handleDeleteAllChats(deleteButton);
        });

        document.body.appendChild(deleteButton);
        console.debug('Delete All Chats button created');
    }

    // Function to remove the button
    function removeDeleteButton() {
        if (deleteButton) {
            deleteButton.remove();
            deleteButton = null;
            console.debug('Delete All Chats button removed');
        }
    }

    // Function to handle URL changes
    function monitorUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.debug(`URL changed to ${currentUrl}`);

                if (isTargetPage()) {
                    createDeleteButton();
                } else {
                    removeDeleteButton();
                }
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // Function to retrieve chat IDs to delete
    function getChatsToDelete() {
        try {
            const nextDataElement = document.getElementById('__NEXT_DATA__');
            if (!nextDataElement) {
                console.error('Error: No element with id __NEXT_DATA__ found');
                alert('Failed to retrieve chats to delete.');
                return [];
            }
            const nextDataText = nextDataElement.textContent;
            const nextData = JSON.parse(nextDataText);
            // Verify the data structure
            if (!nextData.props || !nextData.props.pageProps || !nextData.props.pageProps.data ||
                !nextData.props.pageProps.data.mainQuery || !nextData.props.pageProps.data.mainQuery.filteredChats) {
                console.error('Error: Unexpected __NEXT_DATA__ structure');
                alert('Failed to retrieve chats to delete. Unexpected data structure.');
                return [];
            }
            const chatsToDelete = nextData.props.pageProps.data.mainQuery.filteredChats.edges.map(ele => ele.node.chatId);
            console.debug(`Chats to delete: ${chatsToDelete.length}`);
            return chatsToDelete;
        } catch (error) {
            console.error(`Error parsing chat data: ${error}`);
            alert('Failed to retrieve chats to delete.');
            return [];
        }
    }

    // Function to delete a single chat
    function deleteChat(chatId) {
        const body = JSON.stringify({
            "queryName": "useDeleteChat_deleteChat_Mutation",
            "variables": {"chatId": chatId},
            "extensions": {"hash": "5df4cb75c0c06e086b8949890b1871a9f8b9e431a930d5894d08ca86e9260a18"}
        });

        console.debug(`Deleting chat: ${chatId}`);

        // Use getAPISig to generate the poe-tag-id
        const poeFormkey = '9169cf63ae40d696ddeb9eda5b1bc5ae';
        const poeTagId = window.getAPISig(body, poeFormkey);

        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "poe-formkey": poeFormkey,
                "poe-queryname": "useDeleteChat_deleteChat_Mutation",
                "poe-tag-id": poeTagId,
                "poe-tchannel": "poe-chan66-8888-janvsvsyxqebuurmbggs",
                "poegraphql": "0"
            },
            body: body,
            credentials: "include" // Ensures cookies are included in the request
        };

        console.debug({request});

        return fetch("https://poe.com/api/gql_POST", request)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for chatId ${chatId}`);
                }
                return response.json();
            })
            .then(data => {
                console.debug(`Successfully deleted chat ${chatId}`);
            })
            .catch(error => {
                console.debug(`Error deleting chat ${chatId}: ${error}`);
            });
    }

    // Function to handle the delete process
    function handleDeleteAllChats(button) {
        console.debug('Delete All Chats button clicked');
        button.disabled = true;
        button.innerText = 'Deleting...';

        const chatsToDelete = getChatsToDelete();

        if (chatsToDelete.length === 0) {
            console.debug('No chats to delete');
            button.disabled = false;
            button.innerText = 'Delete All Chats';
            return;
        }

        // Delete chats sequentially to avoid overwhelming the server
        (async () => {
            for (const chatId of chatsToDelete) {
                await deleteChat(chatId);
                // Optional: Add a small delay between requests
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            alert('All chats have been deleted.');
            console.debug('All chats have been deleted.');
            // Optionally, reload the page to reflect changes
            // location.reload();
        })()
            .catch(error => {
                console.debug(`Error during deletion process: ${error}`);
                alert('An error occurred while deleting chats.');
            })
            .finally(() => {
                button.disabled = false;
                button.innerText = 'Delete All Chats';
            });
    }

})();

