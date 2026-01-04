// ==UserScript==
// @name         PT - Recon
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  Recon peoples in faction.
// @author       Upsilon[3212478]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @connect      api.upsilon-cloud.uk
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/546001/PT%20-%20Recon.user.js
// @updateURL https://update.greasyfork.org/scripts/546001/PT%20-%20Recon.meta.js
// ==/UserScript==

(function () {
    // UPSILON - LIB
    'use strict';
    if (window.Ups?.showToast) return;

    window.Ups = window.Ups || {};

    const isPda = /tornpda/i.test(navigator.userAgent);

    window.Ups.showToast = (message, type = 'info', duration = 5000) => {
        const createToast = () => {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.position = 'fixed';
                container.style.bottom = '5%';
                container.style.right = '5%';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.zIndex = 100000;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.background = type === 'error' ? '#c0392b' : '#2c3e50';
            toast.style.color = 'white';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            toast.style.fontFamily = 'monospace';
            toast.style.whiteSpace = 'pre-wrap';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.addEventListener('transitionend', () => toast.remove());
            }, duration);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToast);
        } else {
            createToast();
        }
    };

    window.Ups.callAPI = function (url, method, requestObject, callback) {
        const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase());
        const useFetch = typeof GM_xmlhttpRequest !== 'function';

        if (useFetch) {
            const fetchOptions = {
                method: method,
                headers: {'Content-Type': 'application/json'}
            };

            if (isBodyMethod) {
                fetchOptions.body = typeof requestObject === 'string'
                    ? requestObject
                    : JSON.stringify(requestObject);
            }

            fetch(url, fetchOptions)
                .then(response => {
                    return response.json().then(data => ({status: response.status, data}));
                })
                .then(({status, response}) => {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.status >= 400) {
                            let errorMessage = 'Unknown error';
                            if (data.error) {
                                errorMessage = data.error;
                            } else if (data.Error) {
                                errorMessage = data.Error;
                            }

                            const error = new Error(errorMessage);
                            error.status = status;
                            error.data = data;

                            console.error(`[UpsLib] API Error (${status}):`, errorMessage);
                            callback && callback(error, null);
                            return;
                        }

                        callback && callback(null, data);
                    } catch (e) {
                        console.error("[UpsLib] Error processing JSON:", e);
                        callback && callback(e, null);
                    }
                })
                .catch(err => {
                    console.error("[UpsLib] Error while calling API:", err);
                    console.error("URL:", url);
                    console.error("Method:", method);
                    console.error("isPda:", isPda);
                    console.error("GM_xmlhttpRequest available:", typeof GM_xmlhttpRequest);
                    callback && callback(err, null);
                });
        } else {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: isBodyMethod
                    ? (typeof requestObject === 'string' ? requestObject : JSON.stringify(requestObject))
                    : undefined,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status >= 400) {
                            let errorMessage = 'Unknown error';
                            if (data.error) {
                                errorMessage = data.error;
                            } else if (data.Error) {
                                errorMessage = data.Error;
                            }

                            const error = new Error(errorMessage);
                            error.status = response.status;
                            error.data = data;

                            console.error(`[UpsLib] API Error (${response.status}):`, errorMessage);
                            callback && callback(error, null);
                            return;
                        }

                        callback && callback(null, data);
                    } catch (e) {
                        console.error("[UpsLib] Error processing JSON:", e);
                        callback && callback(e, null);
                    }
                },
                onerror: function (err) {
                    console.error("[UpsLib] Error while calling API:", err);
                    callback && callback(err, null);
                }
            });
        }
    };
})();

(async function() {
    'use strict';

    let API_KEY;
    let API_SERVER;
    const analyzedDataMap = new Map();
    const isPda = /tornpda/i.test(navigator.userAgent);
    const Ups = window.Ups;

    function getLocalStorage(key) {
        const value = window.localStorage.getItem(key);
        try {
            return JSON.parse(value) ?? undefined;
        } catch (err) {
            return undefined;
        }
    }

    function setLocalStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    const [GM_getValue, GM_setValue] =
        isPda || typeof window.GM_getValue !== 'function' || typeof window.GM_setValue !== 'function'
            ? [getLocalStorage, setLocalStorage]
            : [window.GM_getValue, window.GM_setValue];

    async function getOrPromptValue(storageKey, promptMessage, errorMessage) {
        let value = GM_getValue(storageKey);
        if (!value || value == '') {
            value = await prompt(promptMessage);
            if (value) {
                GM_setValue(storageKey, value);
            } else {
                alert(errorMessage);
                return null;
            }
        }
        return value;
    }

    async function getApiKey() {
        return await getOrPromptValue(
            'pt-recon-api-key',
            'Please enter your Torn API key to use PT-Recon:\n(This will only be shown once and stored locally)',
            'No API key provided. The PT-Recon script will not work.'
        );
    }

    async function getServerAddress() {
        return await getOrPromptValue(
            'pt-recon-server',
            'Please enter the PT-Recon server address:\n(This will only be shown once and stored locally)',
            'No server address provided. The PT-Recon script will not work.'
        );
    }

    function formatNumber(n) {
        try {
            return n.toLocaleString();
        } catch (e) {
            console.error("Erreur dans formatNumber:", e);
            return "-";
        }
    }

    function getCurrentProfileId() {
        const m = window.location.href.match(/XID=(\d+)/);
        return m ? m[1] : null;
    }

    function createSettingsAccordion() {
        if (document.querySelector('#pt-recon-settings')) return;

        const profileWrapper =
            document.querySelector('.profile-wrapper') ||
            document.querySelector('h4#skip-to-content.left')?.parentElement;
        if (!profileWrapper) return;

        const style = document.createElement('style');
        style.textContent = `
      details.ptd-settings-accordion {
        margin: 12px 0 0 0;
        border: 1px solid #2d2d2d;
        border-radius: 8px;
        background: #1e1e1e;
        color: #e9e9e9;
        overflow: hidden;
      }
      details.ptd-settings-accordion > summary {
        list-style: none;
        cursor: pointer;
        padding: 10px 14px;
        font-weight: 700;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #242424;
        border-bottom: 1px solid #2d2d2d;
      }
      details.ptd-settings-accordion > summary::-webkit-details-marker { display: none; }
      details.ptd-settings-accordion > summary:before {
        content: "▸";
        transition: transform .15s ease;
        font-size: 12px;
        opacity: .9;
      }
      details.ptd-settings-accordion[open] > summary:before { transform: rotate(90deg); }
      .ptd-settings-content {
        padding: 12px 14px 14px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        font-family: Consolas, Menlo, monospace;
      }
      .ptd-field {
        width: 80%;
      }
      .ptd-field label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #bfc7cf;
      }
      .ptd-field input[type="text"],
      .ptd-field input[type="number"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #3a3a3a;
        border-radius: 6px;
        background: #2b2b2b;
        color: #eee;
        outline: none;
      }
      .ptd-fieldset {
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        padding: 10px;
      }
      .ptd-fieldset legend {
        padding: 0 6px;
        font-weight: 600;
        color: #bfc7cf;
      }
      .ptd-checkbox { display: block; margin: 6px 0; }
      .ptd-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 4px;
      }
      .ptd-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
      }
      .ptd-btn.primary { background: #00bcd4; color: #000; }
      .ptd-btn.ghost { background: #424242; color: #fff; }
      
      #recon-apiKey {
        filter: blur(4px);
        transition: filter 0.2s ease;
      }

      #recon-apiKey:focus {
        filter: none;
      }
    `;
        document.head.appendChild(style);

        // ----- Structure du panneau -----
        const details = document.createElement('details');
        details.className = 'ptd-settings-accordion';
        details.id = 'pt-recon-settings';
        details.open = false;

        details.innerHTML = `
      <summary>⚙️ PT Recon Settings</summary>
      <div class="ptd-settings-content">
        <div class="ptd-field">
          <label>API Key</label>
          <input id="recon-apiKey" type="text" placeholder="Enter API Key...">
        </div>

        <div class="ptd-field">
          <label>Server URL</label>
          <input id="recon-server" type="text" placeholder="https://example.com">
        </div>

        <div class="ptd-actions">
          <button id="recon-save" class="ptd-btn primary" type="button">Save</button>
        </div>
      </div>
    `;

        profileWrapper.parentNode.insertBefore(details, profileWrapper.nextSibling);
        // console.log('[PT Recon] Accordion inserted under profile');

        const apiInput = document.getElementById("recon-apiKey");
        const serverInput = document.getElementById("recon-server");
        const saveBtn = document.getElementById("recon-save");

        apiInput.value = GM_getValue("pt-recon-api-key", "");
        serverInput.value = GM_getValue("pt-recon-server", "");

        if (!saveBtn) return;
        if (saveBtn.dataset.listenerAttached) return;

        saveBtn.dataset.listenerAttached = "true";
        saveBtn.addEventListener("click", () => {
            GM_setValue("pt-recon-api-key", apiInput.value.trim());
            GM_setValue("pt-recon-server", serverInput.value.trim());

            (window.Ups?.showToast || alert)("✅ Configuration applied with success.");
        });
    }


    const currentProfileId = getCurrentProfileId();
    if (currentProfileId) {
        const pollInterval = 150;
        const maxWait = 10000;
        let waited = 0;

        const id = setInterval(() => {
            const profileLink = document.querySelector('.settings-menu > .link > a:first-child');
            if (profileLink && profileLink.href) {
                const m = profileLink.href.match(/XID=(\d+)/);
                const localId = m ? m[1] : null;
                if (localId && localId === currentProfileId) {
                    createSettingsAccordion();
                } else {
                    console.log('[PT Recon UI] Not my profile — nothing to display.');
                }
                clearInterval(id);
                return;
            }
            waited += pollInterval;
            if (waited >= maxWait) {
                console.warn('[PT Recon UI] Timeout waiting for settings link; abort.');
                clearInterval(id);
            }
        }, pollInterval);
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
Xanax: ${userData.xanax_per_day_avg}/day ${userData.xanax_per_day_avg >= 2.5 ? '✔' : ''}
Hits: ${formatNumber(userData.total_hits_change)}/month ${userData.total_hits_change >= 100 ? '✔' : ''}
Time played:</b> ${hoursPerDay}/day ${userData.timeplayed_change >= 108000 ? '✔' : ''}
Networth: ${formatShort(userData.networth_change)}/month ${userData.networth_change >= 500000000 ? '✔' : ''}

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

            const url = `${API_SERVER}/pt-recon/user/messaged?api_key=${API_KEY}`;
            Ups.callAPI(
                url,
                'POST',
                payload,
                function (err, data) {
                    if (err) {
                        console.error('API call failed', err);
                        Ups.showToast(`API error: ${err.message}`, 'error');
                        return;
                    }

                    const userAnalysis = data.results && data.results.length > 0 ? data.results[0] : null;

                    if (userAnalysis) {
                        analyzedDataMap.set(userData.user_id, userAnalysis);
                        userData.analysis = userAnalysis;

                        if (!userData.row) {
                            const row = document.querySelector(`li.table-row .honorWrap___BHau4 a[href*="XID=${userData.user_id}"]`)?.closest('li.table-row');
                            if (row) userData.row = row;
                        }

                        Ups.showToast(`[PT-Recon] Requested user has been analyzed`);
                        assignColors([userData]);
                    } else {
                        console.warn(`No analysis results for user ${userData.username}`);
                    }
                }
            );
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

            switch (score) {
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
        const url = `${API_SERVER}/pt-recon/user?api_key=${API_KEY}`;

        Ups.callAPI(
            url,
            'POST',
            payload,
            function (err, data) {
                console.log("data:", data, err)
                if (err) {
                    console.error('API call failed', err);
                    Ups.showToast(`API error: ${err.message}`, 'error');
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

                    Ups.showToast(`[PT-Recon] Requested user has been analyzed`);
                    assignColors([user]);
                } else {
                    console.warn(`No analysis results for user ${user.username}`);
                        Ups.showToast(err.message, 'error');
                }
            }
        );
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

            const member = {username, id, level, row};
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
        const url = `${API_SERVER}/pt-recon/faction?api_key=${API_KEY}`

        Ups.callAPI(
            url,
            'POST',
            requestObject,
            function (err, data) {
                if (err) {
                    console.error('API call failed', err);
                    Ups.showToast(`API error: ${err.message}`, 'error');
                    return;
                }

                if (data.results === null) return;

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
            }
        );
    }

    function initializeExecution() {
        const observer = new MutationObserver(() => {
            const rows = document.querySelectorAll('li.table-row, ul.user-info-list-wrap>li');

            if (rows.length > 1) {
                observer.disconnect();
                const members = extractMembers(rows);
                fetchAnalyzeFactionData(members);

                startIconPersistenceWatcher(members);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

        if (API_SERVER) {
            console.log(`[PT-RECON] - Loaded successfully using ${API_SERVER}`);
        } else {
            console.error("API server URL not configured properly");
        }
    }

    async function initialize() {
        try {
            API_KEY = await getApiKey();
            if (!API_KEY) return;
            API_SERVER = await getServerAddress();
            if (!API_SERVER) return;

            initializeExecution();
        } catch (error) {
            console.error('Initialization error:', error);
            if (error.message.includes('faction is not authorized')) {
                Ups.showToast('Your faction is not authorized to use PT-Recon. Contact the script author for access.', 'error');
            } else if (error.message.includes('API key')) {
                Ups.showToast('Invalid API key. Please refresh the page and enter a valid key.', 'error');
            } else {
                Ups.showToast('Error initializing PT-Recon. Please try again later.', 'error');
            }
        }
    }

    function startIconPersistenceWatcher(members) {
        const observer = new MutationObserver(() => {
            members.forEach(member => {
                const existing = document.getElementById(`iconCustom___${member.id}`);
                if (!existing && member.row) {
                    if (window.location.href.includes("torn.com/factions.php")) {
                        addFactionIcon(member.row, member);
                    } else {
                        addCustomIcon(member.row, member);
                    }
                }
            });
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });
    }

    initialize();
})();