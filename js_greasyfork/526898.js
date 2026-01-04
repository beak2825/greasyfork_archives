// ==UserScript==
// @name         Cartel Empire Market Notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows notifications for Cartel Empire market sales
// @author       Kwyy [2054]
// @match        https://cartelempire.online/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526898/Cartel%20Empire%20Market%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/526898/Cartel%20Empire%20Market%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'APIKEYHERE';
    const API_URL = `https://cartelempire.online/api/user?type=events&category=Item%20Market&key=${API_KEY}`;
    // Add your Discord webhook URL here
    const DISCORD_WEBHOOK = 'DISCORDWEBHOOKKEYHERE';

    // Request notification permission
    async function requestNotificationPermission() {
        if (!("Notification" in window)) {
            console.error("This browser does not support notifications");
            return false;
        }

        if (Notification.permission === "granted") {
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    }

    // Parse item details from description
    function parseDescription(description) {
        const regex = /(?:Bought|bought)(?: x(\d+))? (.+?) for a total of [£$]([0-9,]+)/;
        const match = description.match(regex);

        if (match) {
            return {
                quantity: match[1] ? parseInt(match[1]) : 1,
                item: match[2].trim(),
                price: parseInt(match[3].replace(/,/g, ''))
            };
        }

        const buyerRegex = /(.+?) bought(?: x(\d+))? (.+?) for a total of [£$]([0-9,]+)/;
        const buyerMatch = description.match(buyerRegex);

        if (buyerMatch) {
            return {
                buyer: buyerMatch[1],
                quantity: buyerMatch[2] ? parseInt(buyerMatch[2]) : 1,
                item: buyerMatch[3].trim(),
                price: parseInt(buyerMatch[4].replace(/,/g, ''))
            };
        }

        return null;
    }

    // Modify showNotification to also send to Discord
    function showNotification(event) {
        const details = parseDescription(event.description);
        if (!details) return;

        // Show browser notification
        const title = details.buyer ?
            `${details.buyer} bought ${details.item}` :
            `Market Sale: ${details.item}`;

        const options = {
            body: `Quantity: ${details.quantity}\nPrice: £${details.price.toLocaleString()}`,
            icon: '/favicon.ico',
            tag: event.id,
            requireInteraction: false,
            data: { url: 'https://cartelempire.online/Property' }
        };

        const notification = new Notification(title, options);
        notification.onclick = function() {
            window.open('https://cartelempire.online/Property', '_blank');
            notification.close();
        };

        // Send to Discord
        sendDiscordNotification(event, details);
    }

    // Send notification to Discord
    function sendDiscordNotification(event, details) {
        const embed = {
            title: details.buyer ?
                `${details.buyer} bought ${details.item}` :
                `Market Sale: ${details.item}`,
            description: `Quantity: ${details.quantity}\nPrice: £${details.price.toLocaleString()}`,
            color: 3066993, // Green color
            timestamp: new Date(event.created * 1000).toISOString()
        };

        const payload = {
            embeds: [embed]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onerror: function(error) {
                console.error('Error sending Discord notification:', error);
            }
        });
    }

    // Load seen events from localStorage with timestamp check
    function loadSeenEvents() {
        try {
            const stored = localStorage.getItem('marketNotifierSeen');
            const lastSync = localStorage.getItem('marketNotifierLastSync');

            // If data is too old (over 1 hour), start fresh
            if (!lastSync || (Date.now() - parseInt(lastSync)) > 3600000) {
                localStorage.setItem('marketNotifierLastSync', Date.now().toString());
                return new Set();
            }

            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (error) {
            console.error('Error loading seen events:', error);
            return new Set();
        }
    }

    // Save seen events to localStorage with timestamp
    function saveSeenEvents(events) {
        try {
            localStorage.setItem('marketNotifierSeen', JSON.stringify(Array.from(events)));
            localStorage.setItem('marketNotifierLastSync', Date.now().toString());
        } catch (error) {
            console.error('Error saving seen events:', error);
        }
    }

    // Add storage event listener to sync across tabs/windows
    window.addEventListener('storage', (e) => {
        if (e.key === 'marketNotifierSeen') {
            try {
                seenEvents = new Set(JSON.parse(e.newValue));
            } catch (error) {
                console.error('Error syncing events:', error);
            }
        }
    });

    // Keep track of seen events
    let seenEvents = loadSeenEvents();

    // Add a flag to track if a request is in progress
    let isChecking = false;

    // Show notifications only for recent events (within last 30 seconds)
    function isRecentEvent(timestamp) {
        const thirtySecondsAgo = Math.floor(Date.now() / 1000) - 30;
        return timestamp >= thirtySecondsAgo;
    }

    // Check for new market events
    function checkMarketEvents() {
        if (isChecking) return;

        isChecking = true;
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const events = data.events || [];

                    // Show notifications for new and recent events
                    events.forEach(event => {
                        if (!seenEvents.has(event.id) && isRecentEvent(event.created)) {
                            showNotification(event);
                            seenEvents.add(event.id);
                        }
                    });

                    // Limit size of seenEvents set and save
                    if (seenEvents.size > 1000) {
                        seenEvents = new Set(Array.from(seenEvents).slice(-500));
                    }
                    saveSeenEvents(seenEvents);

                } catch (error) {
                    console.error('Error processing market data:', error);
                } finally {
                    isChecking = false;
                }
            },
            onerror: function(error) {
                console.error('Error fetching market data:', error);
                isChecking = false;
            }
        });
    }

    // Add reset functionality (optional)
    function resetSeenEvents() {
        seenEvents.clear();
        saveSeenEvents(seenEvents);
    }

    // Initialize
    async function initialize() {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
            console.error("Notification permission not granted");
            return;
        }

        // Start checking for market events
        checkMarketEvents();
        setInterval(checkMarketEvents, 1000);
    }

    // Start the script
    initialize();
})();