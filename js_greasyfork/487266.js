// ==UserScript==
// @name         Torn Trade Notification
// @namespace    http://tampermonkey.net/
// @version      3.00
// @description  Notifies when a user adds items to a trade
// @author       Weav3r [1853324]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/487266/Torn%20Trade%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/487266/Torn%20Trade%20Notification.meta.js
// ==/UserScript==

(async function() {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace YOUR_API_KEY_HERE with your FULL ACCESS API key
    const checkInterval = 60000; // Time to run in milliseconds (default: 60000)

    async function fetchUserDetails(userId) {
        const cachedUser = GM_getValue(`user_${userId}`);
        if (cachedUser) return cachedUser;

        const url = `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`;
        const response = await fetch(url).catch(console.error);
        if (!response) return;

        const data = await response.json().catch(console.error);
        if (!data || !data.name) return;

        GM_setValue(`user_${userId}`, data.name);
        return data.name;
    }

    async function checkTrades() {
        const now = Math.floor(Date.now() / 1000);
        const url = `https://api.torn.com/user/?selections=log&log=4482,4413&key=${apiKey}`;
        const response = await fetch(url).catch(console.error);
        if (!response) return;

        const data = await response.json().catch(console.error);
        if (!data || !data.log) return;

        for (const logId in data.log) {
            const log = data.log[logId];
            let tradeId;

            if (log.log === 4413) {
                tradeId = log.data.trade_id.toString();
            } else {
                if (typeof log.data.trade_id !== 'string') continue;
                const tradeIdMatch = log.data.trade_id.match(/ID=(\d+)/);
                if (!tradeIdMatch) continue;
                tradeId = tradeIdMatch[1];
            }

            const timestamp = log.timestamp;
            if (now - timestamp > 180) continue;

            if ((log.log === 4482 || log.log === 4413) && !GM_getValue(`notified_${tradeId}_${timestamp}`)) {
                const userName = await fetchUserDetails(log.data.user);
                if (!userName) continue;

                let notificationText = log.log === 4482 ? `${userName} has added items to your trade. Click to view` : `${userName} has declined the trade. Click to view`;

                GM_notification({
                    text: notificationText,
                    title: "Trade Update",
                    onclick: () => window.open(`https://www.torn.com/trade.php#step=view&ID=${tradeId}`, '_blank')
                });
                GM_setValue(`notified_${tradeId}_${timestamp}`, true);
            }
        }
    };

    await checkTrades();
    setInterval(checkTrades, checkInterval);
})();