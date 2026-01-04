// ==UserScript==
// @name         Nomad's Quick Revive
// @namespace    http://tampermonkey.net/
// @version      1.3.8
// @description  The fastest way to request a revive from Nomad Medical: with a button on your main page, you're just a click away from being in the hands of our great revivers.
// @author       LilyWaterbug [2608747]
// @match        https://www.torn.com/*
// @connect      lilywaterbug.art
// @connect      lilywaterbug.alwaysdata.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519496/Nomad%27s%20Quick%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/519496/Nomad%27s%20Quick%20Revive.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        API_URL: 'https://lilywaterbug.alwaysdata.net/torn-api',
        WEBHOOK_URL: 'http://lilywaterbug.art:20564/webhook',
        MOBILE_BREAKPOINT: 768,
        MIN_HOSPITAL_TIME: 2
    };

    // State
    const state = {
        currentUrl: '',
        profileButtonsCreated: new Set(),
        mainButtonAdded: false
    };

    // Utility functions
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => p.querySelectorAll(s);
    const isMobile = () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    const isDarkMode = () => $('#body')?.classList.contains('dark-mode');

    const getSidebar = () => {
        const key = Object.keys(sessionStorage).find(k => /sidebarData\d+/.test(k));
        try { return key ? JSON.parse(sessionStorage.getItem(key)) : null; }
        catch { return null; }
    };

    // Check if target is visually in hospital
    const isTargetInHospital = () => {
        // Check for "In hospital" text in profile container
        const mainDesc = $('.profile-container .main-desc');
        if (mainDesc && mainDesc.textContent.toLowerCase().includes('in hospital')) {
            return true;
        }

        // Check for hospital icon in user status
        const hospitalIcon = $('li[class*="user-status"][class*="Hospital"]');
        if (hospitalIcon) {
            return true;
        }

        return false;
    };

    // Check if target's last action is 400+ days ago
    const isTargetInactive = () => {
        const lastActionSpan = $('.user-information-section + .user-info-value span');
        if (!lastActionSpan) return false;

        const text = lastActionSpan.textContent.trim().toLowerCase();

        // Match patterns like "400 days ago", "1 year ago", etc.
        const daysMatch = text.match(/(\d+)\s*days?\s*ago/);
        if (daysMatch) {
            const days = parseInt(daysMatch[1], 10);
            return days >= 400;
        }

        // Handle "X year(s) ago" - always 400+ days
        const yearsMatch = text.match(/(\d+)\s*years?\s*ago/);
        if (yearsMatch) {
            return true;
        }

        return false;
    };

    // Load CSS
    const loadCSS = () => {
        GM_addStyle(`
            #quick-revive-button { background: #D32F2F!important; color: #FFF!important; border: none!important; border-radius: 5px!important; cursor: pointer!important; font-weight: bold!important; text-align: center!important; -webkit-text-stroke: 0.2px #FFF!important; box-shadow: 0 0 0 2px #f2f2f2, 0 0 0 4px #D32F2F!important; transition: all 0.3s ease!important; }
            #quick-revive-button:hover { background: #B71C1C!important; transform: scale(1.05)!important; }
            #nomad-profile-revive-btn { transition: all 0.3s ease!important; }
            #nomad-profile-revive-btn:hover { transform: scale(1.1)!important; filter: brightness(1.2)!important; }
            @media (min-width: 769px) { #quick-revive-button { margin: 10px auto!important; padding: 2.5px 15px!important; display: block!important; font-size: 14px!important; }}
            @media (max-width: 768px) { #quick-revive-button { margin: 6.5px 0!important; padding: 3px 10px!important; display: inline-block!important; font-size: 12px!important; position: absolute!important; }}
        `);
    };

    // API request wrapper
    const apiRequest = (endpoint, params = {}) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.API_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ endpoint, params }),
            onload: r => {
                if (r.status === 200) {
                    try { resolve(JSON.parse(r.responseText)); }
                    catch { reject('Parse error'); }
                } else reject(`Status ${r.status}`);
            },
            onerror: () => reject('Request failed')
        });
    });

    // Webhook request
    const sendWebhook = data => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.WEBHOOK_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            onload: r => r.status === 200 ? resolve() : reject(),
            onerror: reject
        });
    });

    // Create main button
    const createMainButton = container => {
        if ($('#quick-revive-button') || state.mainButtonAdded) return;

        state.mainButtonAdded = true;

        const btn = Object.assign(document.createElement('button'), {
            id: 'quick-revive-button',
            innerText: isMobile() ? 'Nurse' : 'Nurse Nomad',
            onclick: async () => {
                const sidebar = getSidebar();
                const userName = sidebar?.user?.name || 'Unknown';
                const userId = sidebar?.user?.userID || 'Unknown';

                if (userName === 'Unknown' || userId === 'Unknown') {
                    return alert('Error: Unable to extract user information.');
                }

                try {
                    const data = await apiRequest(`user/${userId}`);
                    const { status, states, revivable, faction } = data;

                    if (status?.state !== 'Hospital') return alert('You are not hospitalized right now.');

                    const hospitalTs = states?.hospital_timestamp;
                    if (!hospitalTs) return alert('Could not determine hospital time.');

                    const minutesInHospital = Math.floor((Date.now() / 1000 - hospitalTs) / 60);
                    if (-minutesInHospital < CONFIG.MIN_HOSPITAL_TIME) {
                        return alert('You must have more than 2 minutes left in the hospital to request a revive.');
                    }

                    if (!revivable) return alert('Turn on your revives!');

                    await sendWebhook({
                        function: 'revive',
                        usuario: `${userName} [${userId}]`,
                        status: status?.description || 'N/A',
                        faction: faction?.faction_name || 'No Faction',
                        faction_url: faction?.faction_id ?
                            `https://www.torn.com/factions.php?step=profile&ID=${faction.faction_id}#/` : 'No Faction URL',
                        details: status?.details || 'No Details'
                    });
                    alert('Revive request sent successfully!');
                } catch (e) {
                    console.error('Main revive error:', e);
                    alert('Failed to send revive request.');
                }
            }
        });

        if (isMobile()) {
            btn.style.position = 'absolute';
            const menuBtn = $('.top_header_button.header-menu-icon');
            if (menuBtn) {
                const rect = menuBtn.getBoundingClientRect();
                btn.style.top = `${rect.top}px`;
                btn.style.left = `${rect.right + 10}px`;
            } else {
                btn.style.top = '10px';
                btn.style.right = '20px';
            }
            const menuContainer = $('.header-menu.left.leftMenu___md3Ch.dropdown-menu');
            menuContainer?.parentNode?.appendChild(btn);
        } else {
            container.appendChild(btn);
        }
    };

    // Create profile button
    const createProfileButton = (container, targetId) => {
        // Check if our button already exists
        if ($('#nomad-profile-revive-btn')) return;

        // Check if we already created for this profile
        if (state.profileButtonsCreated.has(targetId)) return;

        // Extract the target's name from the page
        const targetNameElement = $('.profile-container .profile-container-description .profile-container-description-status h4 > span.m-hide');
        const targetName = targetNameElement?.textContent?.trim() || 'Unknown';

        // Create the button
        const btn = Object.assign(document.createElement('a'), {
            id: 'nomad-profile-revive-btn',
            href: '#',
            className: 'profile-button profile-button-revive active',
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 480 480" class="icon___oJODA"><path d="M249.84 479.52c-6.048 0-12.024 0-18.144-.216-.504-.576-1.008-1.08-1.512-1.44-3.96-2.952-8.424-5.472-11.952-8.928-16.92-16.632-33.624-33.48-50.472-50.256-.864-.936-1.872-1.8-2.88-2.664-3.888 2.736-7.272 5.976-11.304 7.992-14.544 7.272-29.736 7.848-45.072 2.664-12.168-4.104-20.376-12.888-25.992-24.192-4.32-8.784-4.536-18.36-4.68-27.864-.288-14.04-.144-28.08 0-42.12 0-2.664-.72-4.608-2.664-6.624-20.736-20.52-41.256-41.184-61.92-61.704-4.68-4.608-8.784-9.432-11.088-15.624-.144-.432-.936-.576-1.44-.864 0-4.608 0-9.144.216-13.896.576-.576 1.08-1.008 1.224-1.512 1.872-5.4 4.896-10.008 9-14.04 21.456-21.384 42.912-42.912 64.296-64.368.936-.936 1.944-2.304 2.016-3.528.144-9.144-.072-18.36.144-27.576.288-15.264.36-30.6 1.224-45.864.72-11.232 6.192-20.736 14.256-28.296 11.664-10.872 25.848-13.824 41.4-12.384 10.8 1.008 19.8 5.4 27.432 13.032 2.88 2.952 6.048 5.688 9.288 8.784.576-.576 1.44-1.296 2.304-2.16 15.264-15.264 30.456-30.528 45.72-45.72C222.912 6.48 226.8 3.168 232.056 2.088c.288 0 .36-.864.504-1.368 5.328 0 10.584 0 15.984.216 8.208 3.168 13.608 9.648 19.44 15.48 15.408 15.408 30.888 30.888 46.368 46.296 1.8 1.8 3.816 3.528 5.904 5.544.36-.864.576-1.224.72-1.656 4.968-12.888 13.896-22.176 26.712-27.216 9.504-3.816 19.584-4.176 29.736-2.808 9.288 1.296 17.28 5.184 24.192 11.16 12.24 10.512 15.984 24.768 16.2 40.104.36 23.832.36 47.736 0 71.568 0 5.04 1.584 8.496 4.968 11.88 16.488 16.272 32.832 32.616 49.104 49.176 2.376 2.448 3.816 5.76 5.832 8.64.72 1.008 1.656 1.8 2.52 2.736 0 5.328 0 10.584-.216 15.984-.576.36-1.152.576-1.224.936-1.224 4.752-3.744 8.568-7.416 11.808-3.744 3.312-7.128 6.912-10.584 10.512-4.176 4.32-8.208 8.784-12.456 13.032-4.32 4.32-8.856 8.352-13.248 12.672-5.184 5.112-10.368 10.224-15.408 15.48-.936 1.008-1.656 2.664-1.728 4.032-.144 8.568 0 17.136-.072 25.704 0 11.016.216 22.032-.288 32.976-.36 7.704-.72 15.696-2.952 22.968-4.464 13.896-13.536 24.408-28.008 28.872-20.52 6.336-39.528 4.392-55.44-11.736-2.304-2.376-4.824-4.536-7.56-7.056-1.728 1.944-3.528 4.176-5.472 6.192-3.888 3.96-7.776 7.92-11.736 11.808-4.824 4.68-9.792 9.216-14.544 13.968-4.032 4.032-7.704 8.28-11.664 12.312-4.824 4.68-9.936 9.072-14.544 13.968-4.392 4.752-8.928 9-14.832 11.808-.432.216-.648.936-1.008 1.44M401.832 335.16c0-81 0-162-.072-243 0-4.392-.072-8.784-.792-13.104-1.584-10.08-6.696-18-15.984-22.68-8.208-4.248-17.064-3.672-25.776-2.664-3.384.36-6.84 1.728-9.864 3.384-11.448 6.264-15.84 16.92-15.912 29.16-.216 61.2-.072 122.4-.072 183.6 0 1.368 0 2.808 0 4.392-3.744 0-7.128.072-10.44-.072-1.08-.072-2.376-.576-3.024-1.296-2.52-2.88-4.752-5.904-7.056-8.928-10.44-13.464-20.736-27-31.248-40.32-10.296-12.96-20.88-25.704-31.176-38.664-10.152-12.672-20.016-25.632-30.024-38.448-6.912-8.712-13.896-17.352-20.808-26.064-8.064-10.08-15.912-20.232-23.976-30.312-6.192-7.776-12.312-15.624-19.008-22.968-3.816-4.248-8.424-8.064-13.176-11.16-5.76-3.672-12.6-2.736-19.08-2.808-14.256-.288-26.784 9.936-29.16 23.688-1.152 6.624-.864 13.536-.864 20.304-.072 96.696-.072 193.392.072 290.088 0 6.696 2.592 12.744 7.056 17.64 10.8 11.88 24.984 13.32 38.88 9.144 14.976-4.536 21.456-14.76 21.528-30.24.432-61.56.144-123.12.144-184.68 0-1.296 0-2.52 0-4.032 3.744 0 7.056-.144 10.44.072 1.296.144 3.024.792 3.816 1.872 7.704 9.36 15.264 18.864 22.824 28.44 10.224 13.104 20.376 26.28 30.672 39.312 11.304 14.328 22.68 28.512 33.984 42.696s22.68 28.296 33.912 42.48c10.008 12.672 19.8 25.56 29.736 38.232 3.384 4.32 6.84 8.64 10.584 12.744 5.76 6.264 11.808 12.528 20.664 14.04 4.968.864 10.224.504 15.336.36 2.304-.072 4.68-.576 6.84-1.368 13.896-5.328 20.736-16.56 20.952-31.32.144-15.624.072-31.176.072-47.52m-179.28-54.792C208.08 262.08 193.608 243.792 178.56 224.712c0 2.088 0 3.24 0 4.392 0 49.896 0 99.792-.072 149.688 0 2.088-.504 4.248-.648 6.336-.216 2.376.072 4.392 2.088 6.408 10.8 10.512 21.384 21.312 32.04 32.04 9.576 9.576 19.08 19.152 28.512 28.656 22.104-22.176 44.064-44.136 66.024-66.096-6.48-8.064-13.176-16.344-19.872-24.552-2.664-3.384-5.256-6.912-7.992-10.368-5.976-7.56-11.952-15.12-18-22.68-3.312-4.248-6.696-8.424-10.008-12.672-5.4-6.84-10.728-13.752-16.128-20.592-3.888-4.824-7.704-9.648-11.952-14.904M235.44 33.48c-15.408 15.408-30.816 30.816-46.296 46.296 42.48 53.712 84.744 107.208 127.656 161.496 0-1.584 0-2.016 0-2.448 0-44.208.072-88.344-.072-132.48 0-1.368-.72-3.024-1.656-3.96-4.608-4.824-9.432-9.504-14.112-14.184-12.816-12.816-25.632-25.704-38.448-38.52-7.272-7.2-14.472-14.4-21.6-21.6-1.872 1.872-3.528 3.456-5.472 5.4m-158.328 190.08c0-10.368 0-20.736 0-31.464-16.272 16.344-32.184 32.256-48.24 48.312 15.48 16.128 31.104 32.4 46.656 48.672.504-.504 1.08-1.008 1.584-1.512 0-21.096 0-42.192 0-64.008m341.136 6.48c0 14.688 0 29.304 0 45 11.52-11.592 22.248-22.464 33.048-33.264 1.944-1.944.36-2.88-.792-4.032-10.152-10.152-20.304-20.304-30.528-30.528-.432-.432-.936-.72-1.584-1.296-.072.648-.072.864-.072 1.08 0 7.488 0 14.904-.072 23.04Z"></path></svg>`,
            onclick: async e => {
                e.preventDefault();

                // Get requester info
                let reqName, reqId;
                if (isMobile()) {
                    const sidebar = getSidebar();
                    reqName = sidebar?.user?.name || 'Unknown';
                    reqId = sidebar?.user?.userID || 'Unknown';
                } else {
                    const el = $('.menu-info-row___YG31c .menu-value___gLaLR');
                    reqName = el?.textContent.trim();
                    reqId = el?.getAttribute('href')?.match(/XID=(\d+)/)?.[1];

                    // Fallback to sidebar if menu isn't available
                    if (!reqName || !reqId) {
                        const sidebar = getSidebar();
                        reqName = sidebar?.user?.name || 'Unknown';
                        reqId = sidebar?.user?.userID || 'Unknown';
                    }
                }

                if (!reqName || !reqId || reqName === 'Unknown') {
                    return alert('Error: Unable to extract requester information.');
                }

                try {
                    // Get requester faction info
                    const reqData = await apiRequest(`user/${reqId}`, { selections: 'faction' });

                    // Get target's current info
                    const targetData = await apiRequest(`user/${targetId}`);

                    // Verify target is still in hospital and revivable
                    if (targetData.status?.state !== 'Hospital') {
                        return alert('This player is no longer in the hospital.');
                    }

                    if (!targetData.revivable) {
                        return alert('This player has revives disabled.');
                    }

                    await sendWebhook({
                        function: 'profile-revive',
                        requester: `${reqName} [${reqId}]`,
                        requester_faction: reqData.faction?.faction_name || 'No Faction',
                        requester_faction_url: reqData.faction?.faction_id ?
                            `https://www.torn.com/factions.php?step=profile&ID=${reqData.faction.faction_id}#/` : 'No Faction URL',
                        target: `${targetData.name || targetName} [${targetId}]`,
                        target_status: targetData.status?.description || 'N/A',
                        target_faction: targetData.faction?.faction_name || 'No Faction',
                        target_faction_url: targetData.faction?.faction_id ?
                            `https://www.torn.com/factions.php?step=profile&ID=${targetData.faction.faction_id}#/` : 'No Faction URL',
                        details: targetData.status?.details || 'No Details'
                    });

                    alert('Profile revive request sent successfully!');
                    alert('Disclaimer: Remember to pay 1M or a Xanax to the person reviving your target.');
                } catch (err) {
                    console.error('Profile revive error:', err);
                    alert('Failed to send profile revive request.');
                }
            }
        });

        btn.setAttribute('aria-label', 'Request Nomad Revive');
        btn.setAttribute('data-is-tooltip-opened', 'false');

        container.appendChild(btn);
        state.profileButtonsCreated.add(targetId);
    };

    // Clean up function
    const cleanupProfileState = () => {
        const btn = $('#nomad-profile-revive-btn');
        if (btn) btn.remove();
        state.profileButtonsCreated.clear();
    };

    // Main page handler
    const handlePage = () => {
        const url = window.location.href;

        // Profile page
        if (url.includes('/profiles.php?XID=')) {
            const userId = url.match(/XID=(\d+)/)?.[1];

            if (userId && !$('#nomad-profile-revive-btn')) {
                const checkForContainer = () => {
                    const container = $('.buttons-wrap .buttons-list');

                    if (!container) return false;

                    // First check if target is visually in hospital
                    if (!isTargetInHospital()) {
                        return true; // Container found, but target not in hospital
                    }

                    // If target is inactive (400+ days), skip API check and add button directly
                    if (isTargetInactive()) {
                        createProfileButton(container, userId);
                        return true;
                    }

                    // Target is in hospital and active - check via API if they're revivable
                    apiRequest(`user/${userId}`)
                        .then(data => {
                        if (data?.status?.state === 'Hospital' && data?.revivable) {
                            createProfileButton(container, userId);
                        }
                    })
                        .catch(err => console.error('Profile eligibility check failed:', err));

                    return true;
                };

                // Try immediately
                if (!checkForContainer()) {
                    // If not ready, wait a bit and try again
                    setTimeout(checkForContainer, 500);
                    setTimeout(checkForContainer, 1000);
                    setTimeout(checkForContainer, 2000);
                }
            }
        }

        // Main page button
        const mainContainer = isMobile() ?
            $('.header-buttons-wrapper') :
            $('.toggle-content___BJ9Q9 .content___GVtZ_');
        if (mainContainer && !$('#quick-revive-button')) {
            createMainButton(mainContainer);
        }
    };

    // Initialize
    const init = () => {
        loadCSS();
        state.currentUrl = window.location.href;
        handlePage();

        // Observer for page changes
        const observer = new MutationObserver(() => {
            if (state.currentUrl !== window.location.href) {
                state.currentUrl = window.location.href;
                cleanupProfileState();
                state.mainButtonAdded = false;
            }
            handlePage();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();