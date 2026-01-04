// ==UserScript==
// @name           x-twitter-add-to-list-button
// @name:ja        x-twitter-add-to-list-button
// @namespace      x-twitter
// @version        0.2.2
// @description    1-click "add user to [xyz] list" button next to usernames while scrolling your x (twitter) feed (be sure to edit the variable "lists")
// @description:ja リストにワンクリックで追加するボタンを表示します（変数"lists"を必ず編集してください）
// @author         fuwawascoco
// @match          https://twitter.com/*
// @match          https://mobile.twitter.com/*
// @match          https://x.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/486615/x-twitter-add-to-list-button.user.js
// @updateURL https://update.greasyfork.org/scripts/486615/x-twitter-add-to-list-button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lists = ['waitlist', 'illustrators', 'animators']; // be sure to change to the NAME of your lists (not IDs)
    const checkInterval = 512; // ms
    const tryInterval = 64; // ms
    const maxRetries = 100; // maximum number of retries to avoid infinite loops

    function createNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }

    function retryUntilSuccess(newTab, selector, innerText, callback) {
        let attempts = 0;
        const intervalID = setInterval(() => {
            let element;
            const elements = newTab.document.querySelectorAll(selector);
            if (innerText != '') {
                element = Array.from(elements).find(el => el.textContent.trim() === innerText);
            } else {
                element = elements[0];
            }
            if (element && element.offsetParent != null) { // Check if element is visible
                clearInterval(intervalID);
                callback(element);
            }
            if (++attempts >= maxRetries) {
                clearInterval(intervalID);
                console.error(`Failed to find element: ${selector} with innerText: ${innerText}`);
                createNotification(`"${innerText}" was not found, please edit the script to update the variable "lists" with your own names.`);
                newTab.close();
            }
        }, tryInterval);
    }

    function onClick(userProfile, list) {
        const newTab = open(userProfile);
        newTab.addEventListener('beforeunload', () => clearInterval(intervalID));

        retryUntilSuccess(newTab, 'button[aria-label="More"][data-testid="userActions"]', '', moreButton => {
            moreButton.click();
            retryUntilSuccess(newTab, 'a[href="/i/lists/add_member"][role="menuitem"]', '', listButton => {
                listButton.click();
                retryUntilSuccess(newTab, '[aria-modal="true"]', '', modal => {
                    let attempts = 0;
                    const intervalID = setInterval(() => {
                        const listSpan = Array.from(modal.getElementsByTagName('span')).find(span => span.textContent === list);
                        if (listSpan) {
                            clearInterval(intervalID);
                            const checkbox = listSpan.closest('[role="checkbox"]');
                            if (checkbox && checkbox.getAttribute('aria-checked') === 'false') {
                                checkbox.click();
                            }
                        } else if (++attempts >= maxRetries) {
                            clearInterval(intervalID);
                            createNotification(`"${list}" was not found, please edit the script to update the variable "lists" with your own names.`);
                            newTab.close();
                        }
                    }, tryInterval);
                });
            });
        });
    }

    function createButton(userProfile, list) {
        const button = document.createElement('button');
        button.style.fontSize = '90%';
        button.style.margin = '0 0.25em';
        button.textContent = list;
        button.addEventListener('click', () => onClick(userProfile, list));
        return button;
    }

    function createButtonContainer(userProfile) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.left = '2%';
        container.style.opacity = 0.5;
        lists.forEach(list => container.appendChild(createButton(userProfile, list)));
        container.classList.add('listButtons');
        return container;
    }

    function addButtons() {
        const nodes = document.querySelectorAll('[data-testid="User-Name"]:not(:has(.listButtons))');
        nodes.forEach(node => {
            const userProfile = node.querySelector('a')?.href || '';
            if (userProfile) {
                node.appendChild(createButtonContainer(userProfile));
            }
        });
    }

    setInterval(addButtons, checkInterval);
})();