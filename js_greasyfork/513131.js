// ==UserScript==
// @name         树洞取关神器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  处理树洞的批量取关和收藏
// @author       BigMushroom
// @match        https://treehole.pku.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513131/%E6%A0%91%E6%B4%9E%E5%8F%96%E5%85%B3%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513131/%E6%A0%91%E6%B4%9E%E5%8F%96%E5%85%B3%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Script started");

    let enabled = false;
    let buttonColorClose = "#e1f2d9";
    let buttonColorOpen = "#f2dad9";
    let toastColor = "#a3a3a3";

    // Store references to the event handler so we can remove it later
    const eventHandler = function(event) {
        event.preventDefault();  // Prevent the default click action
        event.stopPropagation(); // Stop other event handlers from being triggered

        const item = event.currentTarget;
        const boxIdElement = item.querySelector(".box-id");
        if (boxIdElement) {
            const boxId = boxIdElement.textContent.trim().replace("#", "");
            console.log("Sending request for box ID:", boxId);
            sendApiRequest(item, boxId);  // Send the API request immediately
        }
    };

    // Create the toggle button
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "批量取关(收藏)已关闭";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.zIndex = "9999";
    toggleButton.style.backgroundColor = buttonColorClose;  // Default color (disabled)
    toggleButton.style.lineHeight = "2em";
    toggleButton.style.padding = "0 0.5rem";
    document.body.appendChild(toggleButton);

    // Create a function to show toast messages
    function showToast(message) {
        const toast = document.createElement("div");
        toast.innerText = message;
        toast.style.position = "fixed";
        toast.style.top = "10px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = toastColor;
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "10000";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 1000);
    }

    // Helper function to get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to update the box-header-badge number without affecting the icon
    function updateBadgeNumber(item, increment) {
        const badgeElement = item.querySelector('.box-header-badge');
        if (badgeElement) {
            // Find the text node that contains the number (ignoring the icon)
            const textNode = Array.from(badgeElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            let badgeNumber = parseInt(textNode ? textNode.textContent.trim() : "0") || 0;

            badgeNumber += increment;

            if (textNode) {
                textNode.textContent = ` ${badgeNumber} `; // Update number but keep space for icon
            } else {
                const newTextNode = document.createTextNode(` ${badgeNumber} `);
                badgeElement.insertBefore(newTextNode, badgeElement.firstChild);  // Insert new text node
            }
            badgeElement.style.display = ''; // Show badge if > 0
        }
    }

    // Function to send API request and update star status and badge number
    function sendApiRequest(item, boxId) {
        const pkuToken = getCookie('pku_token');
        const uuid = localStorage.getItem('pku-uuid');
        const xsrfToken = getCookie('XSRF-TOKEN');

        if (!pkuToken) {
            console.error("pku_token not found in cookies!");
            return;
        }

        if (!uuid) {
            console.error("UUID not found in localStorage!");
            return;
        }

        if (!xsrfToken) {
            console.error("XSRF token not found in cookies!");
            return;
        }

        const iconElement = item.querySelector('.icon');
        const isFavorited = iconElement.classList.contains('icon-star-ok');

        fetch(`https://treehole.pku.edu.cn/api/pku_attention/${boxId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${pkuToken}`,
                'UUID': uuid,
                'X-XSRF-TOKEN': xsrfToken,
                'Accept': 'application/json, text/plain, */*',
                'Connection': 'keep-alive',
                'Origin': 'https://treehole.pku.edu.cn',
                'Referer': 'https://treehole.pku.edu.cn/web/',
            }
        }).then(response => {
            if (response.ok) {
                if (isFavorited) {
                    iconElement.classList.remove('icon-star-ok');
                    iconElement.classList.add('icon-star');
                    updateBadgeNumber(item, -1);  // Decrease badge number
                    showToast('已取关 ' + boxId);
                } else {
                    iconElement.classList.remove('icon-star');
                    iconElement.classList.add('icon-star-ok');
                    updateBadgeNumber(item, 1);  // Increase badge number
                    showToast('已收藏 ' + boxId);
                }
            } else {
                console.error(`Failed for boxId: ${boxId}, Status: ${response.status}`);
            }
        }).catch(error => {
            console.error(`Error for boxId: ${boxId}`, error);
        });
    }

    // Function to add event listeners to flow items (both existing and new)
    function addEventListenersToFlowItems(items) {
        items.forEach(item => {
            item.addEventListener("click", eventHandler);
        });
    }

    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        console.log("MutationObserver triggered");
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && enabled) {
                // Check added nodes for flow items and add listeners
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const flowItems = node.querySelectorAll('.flow-item');
                        if (flowItems.length > 0) {
                            addEventListenersToFlowItems(flowItems);
                        } else if (node.classList && node.classList.contains('flow-item')) {
                            addEventListenersToFlowItems([node]);
                        }
                    }
                });
            }
        });
    });

    let flowContainer = null;

    // Function to add event listeners to all existing flow items
    function addEventListeners() {
        const flowItems = document.querySelectorAll('.flow-item');
        addEventListenersToFlowItems(flowItems);
    }

    // Function to remove event listeners from all flow items
    function removeEventListeners() {
        document.querySelectorAll('.flow-item').forEach(item => {
            item.removeEventListener("click", eventHandler);
        });
    }

    // Add event listener to toggle button
    toggleButton.addEventListener("click", () => {
        if (!flowContainer) {
            flowContainer = document.querySelector('#table_list');
        }
        
        enabled = !enabled;
        toggleButton.innerText = enabled ? "批量取关(收藏)已开启" : "批量取关(收藏)已关闭";
        toggleButton.style.backgroundColor = enabled ? buttonColorOpen : buttonColorClose;
        
        if (enabled) {
            observer.observe(flowContainer, { childList: true, subtree: true });
            addEventListeners();  // Add event listeners when enabled
        } else {
            observer.disconnect();
            removeEventListeners();  // Remove event listeners when disabled
        }
    });
})();
