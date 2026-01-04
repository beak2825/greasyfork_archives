// ==UserScript==
// @name          Torn Workstats Viewer
// @namespace     http://tampermonkey.net/
// @version       100.0
// @description   Show total working stats on profile company and faction pages
// @match         https://www.torn.com/profiles.php*
// @match         https://www.torn.com/joblist.php*
// @match         https://www.torn.com/factions.php*
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       api.torn.com
// @author        aquagloop
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538101/Torn%20Workstats%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/538101/Torn%20Workstats%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornApiKey';

    const fetchWorkStats = (userId, apiKey) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/user/${userId}/hof?key=${apiKey}`,
                headers: {
                    Accept: 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(data.error.error);
                        } else {
                            resolve(data.hof?.working_stats?.value || 0);
                        }
                    } catch (e) {
                        reject('Failed to parse response');
                    }
                },
                onerror: () => reject('Network error')
            });
        });
    };

    const formatStats = (value) => {
        if (value >= 1000) {
            return Math.round(value / 100) / 10 + 'k';
        }
        return value.toLocaleString();
    };

    const isMobileView = () => window.matchMedia("only screen and (max-width: 768px)").matches;

    const handleProfilePage = async (apiKey) => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');
        if (!userId) return;

        try {
            const totalStats = await fetchWorkStats(userId, apiKey);
            const jobLi = Array.from(document.querySelectorAll('li')).find(li => {
                const span = li.querySelector('.user-information-section span.bold');
                return span && span.textContent.trim() === 'Job';
            });

            if (jobLi) {
                const workstatsLi = document.createElement('li');
                workstatsLi.innerHTML = `<div class="user-information-section"><span class="bold">Work Stats</span></div><div class="user-info-value"><span>${totalStats.toLocaleString()}</span></div>`;
                jobLi.parentNode.insertBefore(workstatsLi, jobLi.nextSibling);
            }
        } catch (error) {
            console.error('Workstats error on profile page:', error);
        }
    };

    const handleCompanyPage = async (apiKey) => {
        const employeesList = document.querySelector('ul.employees-list');
        if (!employeesList) return;

        const employeeItems = employeesList.querySelectorAll('li');
        for (const item of employeeItems) {
            const userLink = item.querySelector('.employee a.user.name');
            if (userLink) {
                const match = userLink.href.match(/XID=(\d+)/);
                const userId = match ? match[1] : null;

                if (userId) {
                    try {
                        const totalStats = await fetchWorkStats(userId, apiKey);

                        if (isMobileView()) {
                            const rankLi = item.querySelector('.rank');
                            if (rankLi) {
                                const workStatsDiv = document.createElement('div');
                                workStatsDiv.style.cssText = 'padding: 5px 0 0 10px; font-weight: bold; font-size: 14px;';
                                workStatsDiv.textContent = `Work Stats: ${totalStats.toLocaleString()}`;
                                rankLi.parentNode.insertBefore(workStatsDiv, rankLi.nextSibling);
                            }
                        } else {
                            const rankLi = item.querySelector('.rank');
                            if (rankLi) {
                                const formattedStats = formatStats(totalStats);
                                const statsSpan = document.createElement('span');
                                statsSpan.style.marginLeft = '5px';
                                statsSpan.style.fontWeight = 'bold';
                                statsSpan.textContent = formattedStats;
                                rankLi.appendChild(statsSpan);
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching work stats for user ${userId}:`, error);
                    }
                }
            }
        }
    };

    const handleFactionPage = async (apiKey) => {
        const membersList = document.querySelector('ul.table-body');
        if (!membersList) return;

        const memberItems = membersList.querySelectorAll('li.table-row');
        for (const item of memberItems) {
            const userLink = item.querySelector('a[href*="/profiles.php?XID="]');
            if (userLink) {
                const match = userLink.href.match(/XID=(\d+)/);
                const userId = match ? match[1] : null;

                if (userId) {
                    try {
                        const totalStats = await fetchWorkStats(userId, apiKey);
                        const positionCell = item.querySelector('.positionCol___WXhYA') || item.querySelector('.positionCol___Lk6E4');
                        if (positionCell) {
                            const formattedStats = formatStats(totalStats);
                            const statsSpan = document.createElement('span');
                            statsSpan.textContent = formattedStats;
                            statsSpan.style.cssText = 'margin-left: 5px; font-weight: bold;';
                            positionCell.appendChild(statsSpan);
                        }
                    } catch (error) {
                        console.error(`Error fetching work stats for user ${userId}:`, error);
                    }
                }
            }
        }
    };

    const main = async () => {
        let apiKey = await GM_getValue(STORAGE_KEY, null);
        if (!apiKey) {
            apiKey = prompt('Enter your Torn API key:');
            if (!apiKey) {
                alert('No API key entered. Work stats will not be displayed.');
                return;
            }
            await GM_setValue(STORAGE_KEY, apiKey);
        }

        try {
            await fetchWorkStats('1', apiKey);

            if (window.location.pathname.includes('profiles.php')) {
                await handleProfilePage(apiKey);
            } else if (window.location.pathname.includes('joblist.php')) {
                await handleCompanyPage(apiKey);
            } else if (window.location.pathname.includes('factions.php')) {
                await handleFactionPage(apiKey);
            }
        } catch (error) {
            console.error('API key validation error:', error);
            if (error === 'Incorrect key' || error === 2) {
                await GM_setValue(STORAGE_KEY, null);
                alert('Invalid API key. Reload the page to enter a new one.');
            } else {
                alert(`Error: ${error}`);
            }
        }
    };

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.profile-container') || document.querySelector('.employees-list') || document.querySelector('.members-list')) {
            main();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();