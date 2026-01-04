// ==UserScript==
// @name         Mine-Craft User API Profile Formatter Mine-Craft.io - Mine-Craft.fun
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Format user profiles :D
// @author       Junes
// @match        https://mine-craft.io/api/users/*
// @match        https://mine-craft.fun/api/users/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514078/Mine-Craft%20User%20API%20Profile%20Formatter%20Mine-Craftio%20-%20Mine-Craftfun.user.js
// @updateURL https://update.greasyfork.org/scripts/514078/Mine-Craft%20User%20API%20Profile%20Formatter%20Mine-Craftio%20-%20Mine-Craftfun.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const years = Math.floor(seconds / 31536000);
        const months = Math.floor((seconds % 31536000) / 2592000);
        const days = Math.floor((seconds % 2592000) / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        let timeString = [];
        if (years > 0) timeString.push(years + " year" + (years > 1 ? "s" : ""));
        if (months > 0) timeString.push(months + " month" + (months > 1 ? "s" : ""));
        if (days > 0) timeString.push(days + " day" + (days > 1 ? "s" : ""));
        if (days === 0) {
            if (hours > 0) timeString.push(hours + " hour" + (hours > 1 ? "s" : ""));
            if (minutes > 0) timeString.push(minutes + " minute" + (minutes > 1 ? "s" : ""));
            if (remainingSeconds > 0) timeString.push(remainingSeconds + " second" + (remainingSeconds > 1 ? "s" : ""));
        }
        return timeString.length > 0 ? timeString.join(", ") + " ago" : "just now";
    }
    function formatSpan(color, text) {
        return `<span style="color: ${color};">${text}</span>`;
    }
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function cleanFormat(text) {
        return text.replace(/§[0-9a-zA-Z]/g, '').trim();
    }
    fetch(window.location.href)
        .then(response => response.json())
        .then(data => {
            const user = data.user;
            const registeredDate = new Date(user.date_register * 1000);
            const lastLoginDate = new Date(user.last_login * 1000);
            const lastActiveDate = new Date(user.last_active * 1000);
            const lastOfflineDate = new Date(user.last_offline * 1000);
            const formattedProfile = `
${formatSpan('turquoise', '- User Profile of:')} ${formatSpan('orange', cleanFormat(user.nickname))}
${formatSpan('turquoise', '- User ID:')} ${formatSpan('orange', user.id)}
${formatSpan('turquoise', '- Nickname:')} ${formatSpan('orange', cleanFormat(user.nickname))}
${formatSpan('turquoise', '- Type:')} ${formatSpan('orange', user.type)}
${formatSpan('turquoise', '- Role ID:')} ${formatSpan('orange', user.role_id)}
${formatSpan('turquoise', '- Prefix:')} ${formatSpan('orange', cleanFormat(user.prefix))}
${formatSpan('turquoise', '- Email:')} ${formatSpan('orange', user.email)}
${formatSpan('turquoise', '- Skin ID:')} ${formatSpan('orange', user.skin_id)}
${formatSpan('turquoise', '- Balance:')} ${formatSpan('orange', formatNumberWithCommas(user.balance))}
${formatSpan('turquoise', '- Date Registered:')} ${formatSpan('orange', registeredDate.toLocaleString())} - ${formatSpan('red', timeAgo(registeredDate))}
${formatSpan('turquoise', '- Last Login:')} ${formatSpan('orange', lastLoginDate.toLocaleString())} - ${formatSpan('red', timeAgo(lastLoginDate))}
${formatSpan('turquoise', '- Last Active:')} ${formatSpan('orange', lastActiveDate.toLocaleString())} - ${formatSpan('red', timeAgo(lastActiveDate))}
${formatSpan('turquoise', '- Last Offline:')} ${formatSpan('orange', lastOfflineDate.toLocaleString())} - ${formatSpan('red', timeAgo(lastOfflineDate))}
${formatSpan('turquoise', '- Ad Block:')} ${formatSpan('orange', user.ad_block)}
${formatSpan('turquoise', '- Online:')} ${formatSpan('orange', user.online)}
${formatSpan('turquoise', '- Invisible:')} ${formatSpan('orange', user.invisible)}
${formatSpan('turquoise', '- Calls:')} ${formatSpan('orange', user.calls)}
${formatSpan('turquoise', '- Transfers:')} ${formatSpan('orange', user.transfers)}
${formatSpan('turquoise', '- Friends:')} ${formatSpan('orange', user.friends)}
${formatSpan('turquoise', '- Verified:')} ${formatSpan('orange', user.verified)}
${formatSpan('turquoise', '- Legend:')} ${formatSpan('orange', user.legend)}
${formatSpan('turquoise', '- Disabled:')} ${formatSpan('orange', user.disabled)}
${formatSpan('turquoise', '- Bot:')} ${formatSpan('orange', user.bot)}
${formatSpan('turquoise', '- No Ads:')} ${formatSpan('orange', user.no_ads)}
${formatSpan('turquoise', '- Search Tag:')} ${formatSpan('orange', cleanFormat(user.search_tag))}
${formatSpan('turquoise', '- About:')}
${formatSpan('lightgreen', cleanFormat(user.about))}
`;
            document.body.innerHTML = `<pre>${formattedProfile}</pre>`;
        });
})();
