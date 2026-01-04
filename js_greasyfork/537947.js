// ==UserScript==
// @name         Torn - PT-Recon (outdated - to delete)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Recon peoples in faction
// @author       Upsilon[3212478]
// @match        https://www.torn.com/page.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/537947/Torn%20-%20PT-Recon%20%28outdated%20-%20to%20delete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537947/Torn%20-%20PT-Recon%20%28outdated%20-%20to%20delete%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_API_KEY = "YOUR UPS API KEY";

    function promptApiKey() {
        if (DEFAULT_API_KEY != "YOUR UPS API KEY") {
            GM_setValue("ups_api_key", DEFAULT_API_KEY);
            return DEFAULT_API_KEY;
        };
        const userKey = prompt("Enter your UPS API KEY :", GM_getValue("ups_api_key") || DEFAULT_API_KEY);
        if (userKey) {
            GM_setValue("ups_api_key", userKey);
            console.log("Key registered !");
            return userKey;
        }
        return null;
    }

    let apiKey = GM_getValue("ups_api_key");
    if (!apiKey) {
        apiKey = promptApiKey();
        if (!apiKey) {
            console.error("Script can't run without UPS API Key. :'(");
            return;
        }
    }
    const analyzedDataMap = new Map();

    function showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '5%';
        toast.style.right = '5%';
        toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
        toast.style.color = 'white';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        toast.style.fontFamily = 'monospace';
        toast.style.whiteSpace = 'pre-wrap';
        toast.style.zIndex = 100000;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    function formatNumber(n) {
        return n.toLocaleString();
    }

    function formatShort(value) {
        const absValue = Math.abs(value);
        let formatted;

        if (absValue >= 1e9) {
            formatted = (absValue / 1e9).toFixed(1) + 'B';
        } else if (absValue >= 1e6) {
            formatted = (absValue / 1e6).toFixed(1) + 'M';
        } else if (absValue >= 1e3) {
            formatted = (absValue / 1e3).toFixed(1) + 'K';
        } else {
            formatted = absValue.toString();
        }

        if (value > 0) {
            return '+' + formatted;
        } else if (value < 0) {
            return '-' + formatted;
        } else {
            return formatted;
        }
    }

    function formatTimePlayed(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    function showUserModal(userData) {
        const existingModal = document.getElementById('pt-recon-modal');
        if (existingModal) existingModal.remove();
        const hoursPerDay = (userData.timeplayed_change / 30 / 3600).toFixed(2);

        const modal = document.createElement('div');
        modal.id = 'pt-recon-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#222';
        modal.style.border = '2px solid #444';
        modal.style.borderRadius = '8px';
        modal.style.padding = '20px';
        modal.style.zIndex = 99999;
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.fontFamily = 'monospace';
        modal.style.maxWidth = '400px';
        modal.style.whiteSpace = 'pre-wrap';

        modal.innerHTML = `<p>
<b>${userData.name}</b> Profile – Level ${userData.level}

<b>Summary:</b>
Xanax: ${userData.xanax_per_day_avg}/day ${userData.xanax_per_day_avg >= 2.5 ? '✔' : '' }
Hits: ${formatNumber(userData.total_hits_change)}/month ${userData.total_hits_change >= 100 ? '✔' : '' }
Time played:</b> ${hoursPerDay}/day ${userData.timeplayed_change >= 108000 ? '✔' : '' }
Networth: ${formatShort(userData.networth_change)}/month ${userData.networth_change >= 500000000 ? '✔' : '' }

<b>Additional Informations:</b>
Refills: ${userData.refills_per_day_avg}/day
Cans: ${userData.cans_per_day_avg}/day
Alcohol: ${userData.alcohol_per_day_avg}/day
Boosters: ${userData.booster_change}/month
SES: ${formatNumber(userData.total_ses)}
<b></b>
`;

        const checkboxWrapper = document.createElement('label');
        checkboxWrapper.style.display = 'flex';
        checkboxWrapper.style.alignItems = 'center';
        checkboxWrapper.style.marginTop = '12px';
        checkboxWrapper.style.gap = '8px';
        checkboxWrapper.style.color = 'white';
        checkboxWrapper.style.fontFamily = 'monospace';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!userData.messaged;

        checkbox.onchange = () => {
            const payload = {
                user_id: userData.user_id
            };

            const url = `https://api.upsilon-cloud.uk/pt-recon/user/messaged?api_key=${apiKey}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(payload),
                onload: function (res) {
                    const data = JSON.parse(res.responseText);
                    if (data.status !== 200) {
                        //const message = `[PT-Recon] Unexpected response ${res.status}\nURL: ${url}\nPayload:\n${JSON.stringify(payload, null, 2)}\nResponse:\n${res.responseText}`;
                        //console.warn(message);
                        //showToast(message, 'error', 8000);
                        return;
                    }
                    showToast(`[PT-Recon] Messaged status updated`);
                },
                onerror: function (err) {
                    console.error("Failed to toggle messaged:", err);
                    showToast(`[PT-Recon] Error updating messaged`, 'error');
                }
            });
        };

        const labelText = document.createElement('span');
        labelText.textContent = 'Message sent?';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(labelText);
        modal.appendChild(checkboxWrapper);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '12px';
        closeButton.style.display = 'block';
        closeButton.style.color = 'white';
        closeButton.onclick = () => modal.remove();

        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }

    function updateIconMessagedOverlay(userId, show) {
        const iconLi = document.getElementById(`iconCustom___${userId}`);
        if (!iconLi) return;

        let overlay = iconLi.querySelector('.pt-recon-checkmark');

        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'pt-recon-checkmark';
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.right = '0';
                overlay.style.background = 'limegreen';
                overlay.style.color = 'white';
                overlay.style.borderRadius = '50%';
                overlay.style.width = '10px';
                overlay.style.height = '10px';
                overlay.style.fontSize = '10px';
                overlay.style.textAlign = 'center';
                overlay.style.lineHeight = '10px';
                overlay.textContent = '✓';
                iconLi.style.position = 'relative';
                iconLi.appendChild(overlay);
            }
        } else if (overlay) {
            overlay.remove();
        }
    }


    function computeScore(user) {
        let score = 0;
        if (user.xanax_per_day_avg >= 2.5) score++;
        if (user.timeplayed_change >= 108000) score++;
        if (user.total_hits_change >= 100) score++;
        if (user.networth_change >= 500000000) score++;
        return score;
    }

    function assignColors(analyzedUsers) {
        analyzedUsers.forEach(user => {
            const score = computeScore(analyzedDataMap.get(user.id));

            let bgColor;

            switch(score) {
                case 4:
                    bgColor = 'rgba(0, 100, 0, 0.5)';
                    break;
                case 3:
                    bgColor = 'rgba(154, 205, 50, 0.5)';
                    break;
                case 2:
                    bgColor = 'rgba(255, 165, 0, 0.5)';
                    break;
                case 1:
                case 0:
                    bgColor = 'rgba(255, 99, 71, 0.5)';
                    break;
                default:
                    bgColor = 'transparent';
            }

            if (user.row) user.row.style.backgroundColor = bgColor;
            updateIconMessagedOverlay(user.id, analyzedDataMap.get(user.id).messaged);
        });
    }

    function onCustomIconClick(user) {
        if (analyzedDataMap.has(user.id)) {
            const data = analyzedDataMap.get(user.id);
            showUserModal(data);
            return;
        }

        const payload = {
            id: user.id,
            username: user.username,
            level: user.level
        };
        const url = `https://api.upsilon-cloud.uk/pt-recon/user?api_key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function (res) {
                const data = JSON.parse(res.responseText);
                if (data.status !== 200) {
                    //const message = `[PT-Recon] Unexpected response ${res.status}\nURL: ${url}\nPayload:\n${JSON.stringify(payload, null, 2)}\nResponse:\n${res.responseText}`;
                    //console.warn(message);
                    //showToast(message, 'error', 8000);
                    return;
                }
                const userAnalysis = data.results && data.results.length > 0 ? data.results[0] : null;

                if (userAnalysis) {
                    analyzedDataMap.set(user.id, userAnalysis);

                    user.analysis = userAnalysis;

                    if (!user.row) {
                        const row = document.querySelector(`li.table-row .honorWrap___BHau4 a[href*="XID=${user.id}"]`)?.closest('li.table-row');
                        if (row) user.row = row;
                    }

                    showToast(`[PT-Recon] Requested user has been analyzed`);
                    assignColors([user]);
                    showUserModal(user, userAnalysis);
                } else {
                    console.warn(`No analysis results for user ${user.username}`);
                }
            },
            onerror: function (err) {
                console.error(`Error analysing ${user.username}`, err);
            }
        });
    }

    function extractMembers() {
        const rows = document.querySelectorAll('li.table-row, ul.user-info-list-wrap>li');
        const members = [];

        rows.forEach(row => {
            const profileLink = row.querySelector('a[href^="/profiles.php?XID="], a.user.name[href^="/profiles.php?XID="]');
            if (!profileLink) return;

            const idMatch = profileLink.href.match(/XID=(\d+)/);
            if (!idMatch) return;
            const id = parseInt(idMatch[1]);

            let username = '';
            const nameSpans = profileLink.querySelectorAll('span[data-char]');
            if (nameSpans.length > 0) {
                username = Array.from(nameSpans).map(s => s.dataset.char).join('');
            } else {
                username = profileLink.textContent.trim();
            }

            let level = 0;
            const levelElement = row.querySelector('.lvlCol___kf6Ag, .lvlCol___NAW6T, .level .value');
            if (levelElement) {
                level = parseInt(levelElement.textContent.trim()) || 0;
            }

            const member = { username, id, level, row };
            if (window.location.href.includes("https://www.torn.com/factions.php")) {
                addFactionIcon(row, member);
            } else if (window.location.href.includes("https://www.torn.com/page.php")) {
                addCustomIcon(row, member);
            }

            members.push(member);
        });

        return members;
    }

    function addFactionIcon(row, member) {
        const iconContainerParent = row.querySelector('.member-icons, .user-icons');
        if (!iconContainerParent) return;

        const iconsList = iconContainerParent.querySelector('ul');
        if (!iconsList) return;

        if (iconContainerParent.querySelector(`#iconCustom___${member.id}`)) return;

        iconsList.style.width = 'initial';
        iconContainerParent.style.display = 'flex';
        iconContainerParent.style.justifyContent = 'flex-start';

        const icon = document.createElement('div');
        icon.id = `iconCustom___${member.id}`;
        icon.className = 'iconShow';
        icon.title = 'PT-RECON';
        icon.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin-left: 6px;
    `;
        icon.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="11" stroke="#2C3E50" stroke-width="2" fill="#1A252F"/>
  <circle cx="12" cy="12" r="7" stroke="#1ABC9C" stroke-width="1" fill="none" />
  <circle cx="12" cy="12" r="4" stroke="#1ABC9C" stroke-width="1" fill="none" />
  <path d="M12 12 L20 12 A8 8 0 0 0 12 4 Z" fill="rgba(26, 188, 156, 0.4)" />
  <circle cx="12" cy="12" r="2" fill="#1ABC9C" />
</svg>
`;

        icon.onclick = () => onCustomIconClick(member);
        iconContainerParent.appendChild(icon);
    }

    function addCustomIcon(row, member) {
        const iconContainerParent = row.querySelector('.member-icons, .user-icons');
        if (!iconContainerParent) return;

        const iconsList = iconContainerParent.querySelector('ul');
        if (!iconsList) return;

        if (iconContainerParent.querySelector(`#iconCustom___${member.id}`)) return;

        iconsList.style.width = 'initial';
        iconsList.parentElement.style.display = 'flex';
        iconsList.parentElement.style.justifyContent = 'flex-start';

        const icon = document.createElement('div');
        icon.id = `iconCustom___${member.id}`;
        icon.className = 'iconShow';
        icon.title = 'PT-RECON';
        icon.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin-left: 4px;
    `;
        icon.innerHTML = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="11" stroke="#2C3E50" stroke-width="2" fill="#1A252F"/>
  <circle cx="12" cy="12" r="7" stroke="#1ABC9C" stroke-width="1" fill="none" />
  <circle cx="12" cy="12" r="4" stroke="#1ABC9C" stroke-width="1" fill="none" />
  <path d="M12 12 L20 12 A8 8 0 0 0 12 4 Z" fill="rgba(26, 188, 156, 0.4)" />
  <circle cx="12" cy="12" r="2" fill="#1ABC9C" />
</svg>
`;

        icon.onclick = () => onCustomIconClick(member);
        iconsList.after(icon);
    }

    function fetchAnalyzeFactionData(members) {
        const requestObject = {users: members.map(m => ({id: m.id, username: m.username, level: m.level}))};
        const url = `https://api.upsilon-cloud.uk/pt-recon/faction?api_key=${apiKey}`

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestObject),
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status !== 200) {
                        //const message = `[PT-Recon] Unexpected response ${data.status}\nURL: ${url}\nPayload:\n${JSON.stringify(data.results, null, 2)}\nResponse:\n${data.responseText}`;
                        //console.warn(message);
                        //showToast(message, 'error', 8000);
                        return;
                    }

                    const resultsById = new Map(data.results.map(user => [user.user_id, user]));

                    const analyzedUsers = members.filter(user => {
                        const analysis = resultsById.get(user.id);
                        if (analysis) {
                            analyzedDataMap.set(user.id, analysis);
                            user.analysis = analysis;
                            return true;
                        }
                        return false;
                    });

                    assignColors(analyzedUsers);
                    showToast(`[PT-Recon] Faction have been gathered successfully`);
                } catch (e) {
                    console.error("Error processing JSON:", e);
                }
            },
            onerror: function (err) {
                console.error("Error while calling pt-group: /analyze/faction:", err);
            }
        });
    }

    const observer = new MutationObserver(() => {
        const rows = document.querySelectorAll('li.table-row, ul.user-info-list-wrap>li');

        if (rows.length > 1) {
            observer.disconnect();
            const members = extractMembers(rows);
            fetchAnalyzeFactionData(members);
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();