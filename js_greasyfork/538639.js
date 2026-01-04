// ==UserScript==
// @name         Torn Faction Respect Leaderboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track faction member respect gains and display leaderboard
// @author       Edgeworthy
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538639/Torn%20Faction%20Respect%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/538639/Torn%20Faction%20Respect%20Leaderboard.meta.js
// ==/UserScript==

(function() {
'use strict';

if (window.tornFactionLeaderboard) {
console.log('Torn Faction Leaderboard already loaded');
return;
}
window.tornFactionLeaderboard = true;

let respectData = {};
let isCollecting = false;
let totalCollected = 0;
let capturedRfcv = null;
let currentFromTo = null; // Track current URL parameters

const originalFetch = window.fetch;
window.fetch = function(...args) {
const url = args[0];

if (typeof url === 'string') {
const rfcvMatch = url.match(/[?&]rfcv=([a-f0-9]+)/i);
if (rfcvMatch && !capturedRfcv) {
capturedRfcv = rfcvMatch[1];
console.log('Captured rfcv token from request:', capturedRfcv);
}

if (url.includes('page.php?sid=factionsNews&step=list')) {
return originalFetch.apply(this, arguments)
.then(response => {
const clonedResponse = response.clone();
clonedResponse.json().then(data => {
if (data.success && data.list) {
processFactionsNews(data.list);
totalCollected += data.list.length;
updateLeaderboard();
}
}).catch(err => {
console.log('Error processing faction news:', err);
});
return response;
});
}
}

return originalFetch.apply(this, arguments);
};

async function collectAllFactionNews() {
if (isCollecting) {
alert('Already collecting data, please wait...');
return;
}

isCollecting = true;
totalCollected = 0;
respectData = {}; // Clear existing data when starting new collection

try {
const dateFrom = document.getElementById('leaderboard-date-from') ? document.getElementById('leaderboard-date-from').value : null;
const dateTo = document.getElementById('leaderboard-date-to') ? document.getElementById('leaderboard-date-to').value : null;
const actionFilter = document.getElementById('leaderboard-action-filter') ? document.getElementById('leaderboard-action-filter').value : 'attacked';

let fromTimestamp = null;
let toTimestamp = null;

if (dateFrom) {
fromTimestamp = Math.floor(new Date(dateFrom).getTime() / 1000);
}
if (dateTo) {
toTimestamp = Math.floor(new Date(dateTo + 'T23:59:59').getTime() / 1000);
}

const currentUrl = new URL(window.location.href);
const stepParam = currentUrl.searchParams.get('step') || 'your';
const typeParam = currentUrl.searchParams.get('type') || '2';

const finalFromParam = fromTimestamp ? fromTimestamp.toString() : currentUrl.searchParams.get('from');
const finalToParam = toTimestamp ? toTimestamp.toString() : currentUrl.searchParams.get('to');

const searchParam = actionFilter === 'all' ? 'attacked' : actionFilter;

updateCollectionStatus(`Starting collection... (${dateFrom || 'no start'} to ${dateTo || 'no end'}, ${actionFilter})`);

let rfcv = await getRfcvToken();
if (!rfcv) {
updateCollectionStatus('Could not get validation token. Try refreshing the page first.');
isCollecting = false;
return;
}

let startFrom = null;
let pageCount = 0;
let hitDateBoundary = false;
const maxPages = 100;

while (pageCount < maxPages && !hitDateBoundary) {
pageCount++;
updateCollectionStatus(`Collecting page ${pageCount}... (${totalCollected} entries) [startFrom: ${startFrom ? startFrom.substring(0, 10) + '...' : 'initial'}]`);

let apiUrl = `https://www.torn.com/page.php?sid=factionsNews&step=list&rfcv=${rfcv}`;

try {
const formData = new FormData();
formData.append('step', stepParam);
formData.append('type', typeParam);
if (finalFromParam) formData.append('from', finalFromParam);
if (finalToParam) formData.append('to', finalToParam);
if (startFrom) formData.append('startFrom', startFrom);
if (searchParam !== 'attacked') formData.append('search', searchParam);

console.log('Making request to:', apiUrl);
console.log('Form data:', Object.fromEntries(formData.entries()));

const response = await fetch(apiUrl, {
method: 'POST',
headers: {
'Accept': '*/*',
'X-Requested-With': 'XMLHttpRequest',
'Referer': window.location.href,
'Origin': 'https://www.torn.com',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-origin'
},
body: formData,
credentials: 'same-origin'
});

console.log('Response status:', response.status);
const data = await response.json();
console.log('Response data sample:', {
success: data.success,
listLength: data.list ? data.list.length : 0,
startFrom: data.startFrom,
newEventsAmount: data.newEventsAmount
});

if (!data.success) {
updateCollectionStatus('API returned error. Stopping collection.');
break;
}

if (!data.list || data.list.length === 0) {
updateCollectionStatus(`Collection complete! Processed ${pageCount-1} pages with ${totalCollected} entries.`);
break;
}

// Check if we've hit our date boundaries
if (dateFrom || dateTo) {
const fromDate = dateFrom ? new Date(dateFrom) : null;
const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

// Check first and last items in this batch for date boundaries
const firstItem = data.list[0];
const lastItem = data.list[data.list.length - 1];

if (firstItem && lastItem) {
const firstItemDate = parseDate(firstItem.date, firstItem.time);
const lastItemDate = parseDate(lastItem.date, lastItem.time);

console.log(`Date range check - First: ${firstItemDate.toISOString()}, Last: ${lastItemDate.toISOString()}`);
if (fromDate) console.log(`From boundary: ${fromDate.toISOString()}`);
if (toDate) console.log(`To boundary: ${toDate.toISOString()}`);

// If we're past our "to" date (older than), stop collecting
if (toDate && lastItemDate < toDate) {
console.log('Hit "to" date boundary, stopping collection');
hitDateBoundary = true;
}

// If we're before our "from" date (newer than), stop collecting
if (fromDate && firstItemDate > fromDate) {
console.log('Hit "from" date boundary, stopping collection');
hitDateBoundary = true;
}
}
}

// Process this page's data
const processedCount = processFactionsNews(data.list, dateFrom, dateTo);
totalCollected += processedCount;

// Get the startFrom for the next page
startFrom = data.startFrom;

// If we got fewer items than expected, we might be at the end
if (data.list.length < 25) {
updateCollectionStatus(`Reached end of data. Processed ${pageCount} pages with ${totalCollected} entries.`);
break;
}

await new Promise(resolve => setTimeout(resolve, 100));

} catch (error) {
console.error('Error fetching page:', error);
updateCollectionStatus(`Error on page ${pageCount}: ${error.message}`);
break;
}
}

if (pageCount >= maxPages) {
updateCollectionStatus(`Reached maximum page limit (${maxPages}). Collection stopped.`);
} else if (hitDateBoundary) {
updateCollectionStatus(`Hit date boundary. Processed ${pageCount} pages with ${totalCollected} entries.`);
}

} catch (error) {
console.error('Collection error:', error);
updateCollectionStatus(`Collection failed: ${error.message}`);
}

isCollecting = false;
updateLeaderboard();

setTimeout(() => {
updateCollectionStatus('');
}, 5000);
}

function parseDate(dateStr, timeStr) {
// Parse Torn date format (DD/MM/YY) and time (HH:MM:SS)
const [day, month, year] = dateStr.split('/');
const fullYear = parseInt('20' + year);
const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));

if (timeStr) {
const [hours, minutes, seconds] = timeStr.split(':');
date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
}

return date;
}

function updateCollectionStatus(message) {
const statusElement = document.getElementById('leaderboard-status');
if (statusElement) {
statusElement.textContent = message;
statusElement.style.display = message ? 'block' : 'none';
}
}

async function getRfcvToken() {
if (capturedRfcv) {
console.log('Using captured rfcv:', capturedRfcv);
return capturedRfcv;
}

try {
const currentUrl = new URL(window.location.href);
const rfcvFromUrl = currentUrl.searchParams.get('rfcv');
if (rfcvFromUrl) {
capturedRfcv = rfcvFromUrl;
console.log('Found rfcv in current URL:', capturedRfcv);
return capturedRfcv;
}
} catch (error) {
console.log('Error checking URL:', error);
}

try {
const pageHTML = document.documentElement.innerHTML;
const rfcvMatch = pageHTML.match(/pages\.php[^"']*[?&]rfcv=([a-f0-9]+)/i);
if (rfcvMatch) {
capturedRfcv = rfcvMatch[1];
console.log('Found rfcv in page HTML pages.php URL:', capturedRfcv);
return capturedRfcv;
}

const newsMatch = pageHTML.match(/factionsNews[^"']*[?&]rfcv=([a-f0-9]+)/i);
if (newsMatch) {
capturedRfcv = newsMatch[1];
console.log('Found rfcv in factionsNews URL:', capturedRfcv);
return capturedRfcv;
}
} catch (error) {
console.log('Error searching page HTML:', error);
}

try {
updateCollectionStatus('Trying to capture token from network request...');

const response = await fetch(window.location.href, {
method: 'GET',
headers: {
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'Referer': window.location.href,
'User-Agent': navigator.userAgent
},
credentials: 'same-origin'
});
const html = await response.text();

const rfcvMatch = html.match(/[?&]rfcv=([a-f0-9]+)/i);
if (rfcvMatch) {
capturedRfcv = rfcvMatch[1];
console.log('Found rfcv in response:', capturedRfcv);
return capturedRfcv;
}

} catch (error) {
console.log('Error trying network request:', error);
}

return null;
}

function processFactionsNews(newsList, dateFrom = null, dateTo = null) {
let processedCount = 0;
const fromDate = dateFrom ? new Date(dateFrom) : null;
const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

newsList.forEach(item => {
const message = item.message;

// Parse the date of this item
const itemDate = parseDate(item.date, item.time);

// Skip items outside our date range if filtering is active
if (fromDate && itemDate < fromDate) {
console.log(`Skipping item from ${itemDate.toISOString()} - before start date`);
return;
}
if (toDate && itemDate > toDate) {
console.log(`Skipping item from ${itemDate.toISOString()} - after end date`);
return;
}

const attackMatch = message.match(/<a href="profiles\.php\?XID=(\d+)">([^<]+)<\/a><\/font> attacked.*?\(\+([0-9.]+)\)/);
const mugMatch = message.match(/<a href="profiles\.php\?XID=(\d+)">([^<]+)<\/a><\/font> mugged.*?\(\+([0-9.]+)\)/);
const hospMatch = message.match(/<a href="profiles\.php\?XID=(\d+)">([^<]+)<\/a><\/font> hospitalized.*?\(\+([0-9.]+)\)/);

let match = attackMatch || mugMatch || hospMatch;
let actionType = attackMatch ? 'attack' : (mugMatch ? 'mug' : (hospMatch ? 'hospitalized' : null));

if (match) {
const userId = match[1];
const userName = match[2];
const respect = parseFloat(match[3]);

if (!respectData[userId]) {
respectData[userId] = {
name: userName,
totalRespect: 0,
attacks: 0,
mugs: 0,
hospitalizations: 0,
lastSeen: item.date + ' ' + item.time
};
}

respectData[userId].totalRespect += respect;
respectData[userId].name = userName;
respectData[userId].lastSeen = item.date + ' ' + item.time;

if (actionType === 'attack') respectData[userId].attacks++;
else if (actionType === 'mug') respectData[userId].mugs++;
else if (actionType === 'hospitalized') respectData[userId].hospitalizations++;

processedCount++;
}
});

console.log(`Processed ${processedCount} valid items out of ${newsList.length} total items in this batch`);
return processedCount;
}

function createIntegratedLeaderboard() {
// Find the faction news container
const newsContainer = document.querySelector('.listWrapper___lJjf7');
if (!newsContainer) {
console.log('Could not find news container');
return;
}

// Create the leaderboard section that looks like Torn's native UI
const leaderboardSection = document.createElement('div');
leaderboardSection.id = 'faction-leaderboard-section';
leaderboardSection.style.cssText = 'margin: 20px 0; background: #1a1a1a; border: 1px solid #333; border-radius: 5px;';

leaderboardSection.innerHTML = `
<div style="background: #2a2a2a; padding: 15px; border-bottom: 1px solid #333; border-radius: 5px 5px 0 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #ddd; font-size: 16px; font-weight: bold;">📊 Faction Respect Leaderboard</h3>
        <div>
            <button id="collect-all-data" class="torn-btn" style="background: #4CAF50; margin-right: 10px; padding: 6px 12px; font-size: 11px;">COLLECT ALL</button>
            <button id="clear-leaderboard-data" class="torn-btn" style="background: #f44336; padding: 6px 12px; font-size: 11px;">CLEAR</button>
        </div>
    </div>

    <div id="leaderboard-filters" style="display: none; background: #333; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
        <div style="display: flex; gap: 15px; align-items: end; flex-wrap: wrap;">
            <div>
                <label style="display: block; color: #ccc; margin-bottom: 5px; font-size: 12px;">From Date:</label>
                <input type="date" id="leaderboard-date-from" style="padding: 5px; border: 1px solid #555; background: #222; color: #ddd; border-radius: 3px;">
            </div>
            <div>
                <label style="display: block; color: #ccc; margin-bottom: 5px; font-size: 12px;">To Date:</label>
                <input type="date" id="leaderboard-date-to" style="padding: 5px; border: 1px solid #555; background: #222; color: #ddd; border-radius: 3px;">
            </div>
            <div>
                <label style="display: block; color: #ccc; margin-bottom: 5px; font-size: 12px;">Action Type:</label>
                <select id="leaderboard-action-filter" style="padding: 5px; border: 1px solid #555; background: #222; color: #ddd; border-radius: 3px;">
                    <option value="attacked">Attacks</option>
                    <option value="mugged">Mugs</option>
                    <option value="hospitalized">Hospitalizations</option>
                </select>
            </div>
            <div>
                <button id="apply-leaderboard-filters" class="torn-btn" style="background: #4CAF50; padding: 6px 12px; font-size: 11px;">Collect Filtered</button>
                <button id="clear-leaderboard-filters" class="torn-btn" style="background: #FF9800; margin-left: 5px; padding: 6px 12px; font-size: 11px;">Reset</button>
            </div>
        </div>
    </div>

    <div id="leaderboard-status" style="display: none; background: #444; color: #ffa500; padding: 8px; border-radius: 3px; font-size: 11px; margin-bottom: 10px;"></div>
</div>

<div id="leaderboard-content" style="padding: 0;">
    <div style="text-align: center; color: #888; padding: 40px;">
        <p style="margin-bottom: 10px;">No faction respect data collected yet.</p>
        <p style="font-size: 12px; opacity: 0.7;">Click "COLLECT ALL" to gather data from current faction news, or use "Filters" for specific timeframes.</p>
    </div>
</div>
`;

// Insert before the news list
newsContainer.parentNode.insertBefore(leaderboardSection, newsContainer);

// Add event listeners
document.getElementById('collect-all-data').onclick = () => {
collectAllFactionNews();
};

document.getElementById('clear-leaderboard-data').onclick = () => {
if (confirm('Clear all collected respect data?')) {
respectData = {};
totalCollected = 0;
updateLeaderboard();
}
};

document.getElementById('apply-leaderboard-filters').onclick = () => {
const filters = document.getElementById('leaderboard-filters');
filters.style.display = 'none';
collectAllFactionNews();
};

document.getElementById('clear-leaderboard-filters').onclick = () => {
document.getElementById('leaderboard-date-from').value = '';
document.getElementById('leaderboard-date-to').value = '';
document.getElementById('leaderboard-action-filter').value = 'attacked';
respectData = {};
totalCollected = 0;
updateLeaderboard();
};

console.log('Faction leaderboard integrated into UI');
}

function updateLeaderboard() {
const content = document.getElementById('leaderboard-content');
if (!content) return;

const sortedUsers = Object.entries(respectData).sort(([,a], [,b]) => b.totalRespect - a.totalRespect);

if (sortedUsers.length === 0) {
content.innerHTML = `
<div style="text-align: center; color: #888; padding: 40px;">
    <p style="margin-bottom: 10px;">No faction respect data collected yet.</p>
    <p style="font-size: 12px; opacity: 0.7;">Click "COLLECT ALL" to gather data from current faction news, or use "Filters" for specific timeframes.</p>
</div>
`;
return;
}

// Create leaderboard content
let html = `
<div style="background: #2a2a2a; padding: 10px; border-top: 1px solid #333;">
    <div style="color: #ccc; font-size: 12px; margin-bottom: 10px;">
        📈 ${sortedUsers.length} players tracked | ${totalCollected} entries processed
    </div>
</div>
<ul class="listWrapper___lJjf7" style="margin: 0; list-style: none;">
`;

sortedUsers.forEach(([userId, data], index) => {
const totalActions = data.attacks + data.mugs + data.hospitalizations;
const avgRespect = totalActions > 0 ? (data.totalRespect / totalActions).toFixed(2) : '0.00';

// Create rank icon based on position
let rankIcon = '';
if (index === 0) rankIcon = '🥇';
else if (index === 1) rankIcon = '🥈';
else if (index === 2) rankIcon = '🥉';
else rankIcon = `#${index + 1}`;

html += `
<li class="listItemWrapper___XHSAe" style="list-style: none;">
    <div class="listItem___qQf5B">
        <div class="contentGroup___qYtG6" tabindex="0" role="button">
            <p class="message___RSW3S">
                <font class="t-green">
                    <span style="font-weight: bold; margin-right: 10px;">${rankIcon}</span>
                    <font class="t-blue">
                        <a href="profiles.php?XID=${userId}">${data.name}</a>
                    </font>
                    gained <strong style="color: #4CAF50;">+${data.totalRespect.toFixed(2)}</strong> respect
                    <span style="color: #888; font-size: 11px;">
                        (${totalActions} actions, ${avgRespect} avg)
                    </span>
                </font>
            </p>
        </div>
    </div>
</li>
`;
});

html += '</ul>';
content.innerHTML = html;
}

function checkForLeaderboard() {
// Check if leaderboard exists, if not create it
const existingLeaderboard = document.getElementById('faction-leaderboard-section');
const newsContainer = document.querySelector('.listWrapper___lJjf7');

if (!existingLeaderboard && newsContainer) {
console.log('Leaderboard not found, creating...');
createIntegratedLeaderboard();
}

// Check if URL parameters changed
checkUrlParametersChanged();
}

function checkUrlParametersChanged() {
const currentUrl = new URL(window.location.href);
const fromParam = currentUrl.searchParams.get('from');
const toParam = currentUrl.searchParams.get('to');
const newFromTo = `${fromParam || 'none'}-${toParam || 'none'}`;

if (currentFromTo === null) {
// First time, just store current values
currentFromTo = newFromTo;
console.log('Initial URL parameters:', newFromTo);
} else if (currentFromTo !== newFromTo) {
// Parameters changed, clear data
console.log('URL parameters changed from', currentFromTo, 'to', newFromTo);
console.log('Clearing collected data due to URL parameter change');
respectData = {};
totalCollected = 0;
currentFromTo = newFromTo;
updateLeaderboard();
// Show notification
updateCollectionStatus('URL parameters changed - data cleared. Click COLLECT ALL to gather new data.');
setTimeout(() => {
updateCollectionStatus('');
}, 3000);
}
}

function init() {
if (!window.location.href.includes('torn.com/factions.php')) {
return;
}

// Initial check for leaderboard
checkForLeaderboard();

// Set up continuous monitoring for tab changes and URL changes
const checkInterval = setInterval(() => {
if (!window.location.href.includes('torn.com/factions.php')) {
clearInterval(checkInterval);
return;
}
checkForLeaderboard();
}, 2000); // Check every 2 seconds

// Also listen for hash changes and popstate events
window.addEventListener('hashchange', () => {
console.log('Hash changed, checking leaderboard...');
setTimeout(checkForLeaderboard, 500);
});

window.addEventListener('popstate', () => {
console.log('Popstate event, checking leaderboard...');
setTimeout(checkForLeaderboard, 500);
});

// Listen for pushstate/replacestate (Torn's navigation)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
originalPushState.apply(history, arguments);
console.log('PushState detected, checking leaderboard...');
setTimeout(checkForLeaderboard, 500);
};

history.replaceState = function() {
originalReplaceState.apply(history, arguments);
console.log('ReplaceState detected, checking leaderboard...');
setTimeout(checkForLeaderboard, 500);
};

console.log('Torn Faction Respect Leaderboard script loaded with tab change monitoring');
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}

})();