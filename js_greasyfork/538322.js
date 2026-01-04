// ==UserScript==
// @name         Target Hunter Extended
// @version      3.1
// @namespace    http://tampermonkey.net/
// @description  A configurable target finder with level, battle stats, job, and company filtering
// @author       devilsfallguy [3317459]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/538322/Target%20Hunter%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/538322/Target%20Hunter%20Extended.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Torn job types for filtering
    const TORN_JOBS = {
        1: 'Unemployed',
        2: 'Grocery Store',
        3: 'Law Firm',
        4: 'Hair Salon',
        5: 'Army',
        6: 'Casino',
        7: 'Education',
        8: 'Oil Rig',
        9: 'Medical',
        10: 'Car Dealership',
        11: 'Gun Shop',
        12: 'Flower Shop',
        13: 'Zoo',
        14: 'Night Club',
        15: 'Candle Shop',
        16: 'Cyber Cafe'
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        minID: 3000000,
        maxID: 3400000,
        minLevel: 1,
        maxLevel: 100,
        apiKey: '',
        maxRetries: 15,
        openInNewTab: false,
        useAttackLink: true,

        // Battle stats filtering
        useBattleStatsFilter: false,
        battleStatsFilterType: 'total', // 'total' or 'individual'

        // Total battle stats
        minTotalStats: 0,
        maxTotalStats: 1000000000,

        // Individual stats
        minStrength: 0,
        maxStrength: 1000000000,
        minDefense: 0,
        maxDefense: 1000000000,
        minSpeed: 0,
        maxSpeed: 1000000000,
        minDexterity: 0,
        maxDexterity: 1000000000,

        // Job filtering
        useJobFilter: false,
        jobFilterType: 'include', // 'include' or 'exclude'
        selectedJobs: [], // Array of job IDs to include/exclude

        // Last Action filtering
        useLastActionFilter: false,
        lastActionFilterType: 'include', // 'include' or 'exclude'
        selectedTimeRanges: [], // Array of time ranges

        // Company/Faction filtering
        useCompanyFilter: false,
        companyFilterType: 'exclude', // 'include' or 'exclude'
        companyFilterMethod: 'any', // 'any' (any faction) or 'specific' (specific factions)
        selectedCompanies: [], // Array of faction IDs to include/exclude
        companySearchText: '' // Text input for faction names
    };

    // Load settings from storage
    function loadSettings() {
        const settings = {};
        Object.keys(DEFAULT_SETTINGS).forEach(key => {
            const value = GM_getValue(key, DEFAULT_SETTINGS[key]);
            // Parse arrays from storage
            if (key === 'selectedJobs' || key === 'selectedCompanies' || key === 'selectedTimeRanges') {
                settings[key] = typeof value === 'string' ? JSON.parse(value || '[]') : value;
            } else {
                settings[key] = value;
            }
        });
        return settings;
    }

    // Save settings to storage
    function saveSettings(settings) {
        Object.keys(settings).forEach(key => {
            // Stringify arrays for storage
            if (key === 'selectedJobs' || key === 'selectedCompanies' || key === 'selectedTimeRanges') {
                GM_setValue(key, JSON.stringify(settings[key]));
            } else {
                GM_setValue(key, settings[key]);
            }
        });
    }

    let settings = loadSettings();

    // Utility function for random number generation
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Check user profile via API
    async function getUserProfile(userID) {
        if (!settings.apiKey) {
            console.warn('No API key provided - skipping profile check');
            return null;
        }

        try {
            let selections = ['profile'];

            if (settings.useBattleStatsFilter) {
                selections.push('battlestats');
            }

            if (settings.useJobFilter || settings.useJobTypeFilter || settings.usePrivateCompanyFilter || settings.useCompanyFilter || settings.useLastActionFilter) {
                selections.push('basic');
            }

            const selectionsStr = selections.join(',');
            const response = await fetch(`https://api.torn.com/user/${userID}?selections=${selectionsStr}&key=${settings.apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.warn(`API Error for user ${userID}:`, data.error);
                return null;
            }

            return {
                level: data.level,
                job: data.job ? {
                    job_id: data.job.job_id,
                    company_id: data.job.company_id,
                    company_name: data.job.company_name
                } : null,
                faction: data.faction ? {
                    faction_id: data.faction.faction_id,
                    faction_name: data.faction.faction_name
                } : null,
                last_action: data.last_action ? {
                    timestamp: data.last_action.timestamp,
                    relative: data.last_action.relative,
                    status: data.last_action.status
                } : null,
                battlestats: data.strength ? {
                    strength: data.strength,
                    defense: data.defense,
                    speed: data.speed,
                    dexterity: data.dexterity,
                    total: data.strength + data.defense + data.speed + data.dexterity
                } : null
            };
        } catch (error) {
            console.warn(`Failed to fetch user ${userID}:`, error);
            return null;
        }
    }

    // Check if target meets battle stats criteria
    function meetsBattleStatsCriteria(battlestats) {
        if (!settings.useBattleStatsFilter || !battlestats) {
            return true;
        }

        if (settings.battleStatsFilterType === 'total') {
            return battlestats.total >= settings.minTotalStats && battlestats.total <= settings.maxTotalStats;
        } else {
            return battlestats.strength >= settings.minStrength && battlestats.strength <= settings.maxStrength &&
                   battlestats.defense >= settings.minDefense && battlestats.defense <= settings.maxDefense &&
                   battlestats.speed >= settings.minSpeed && battlestats.speed <= settings.maxSpeed &&
                   battlestats.dexterity >= settings.minDexterity && battlestats.dexterity <= settings.maxDexterity;
        }
    }

    // Check if target meets job criteria
    function meetsJobCriteria(job) {
        if (!settings.useJobFilter) {
            return true;
        }

        if (settings.selectedJobs.length === 0) {
            return true; // No jobs selected means include all
        }

        const userJobId = job ? job.job_id : 1; // Default to unemployed
        const isJobSelected = settings.selectedJobs.includes(userJobId);

        if (settings.jobFilterType === 'include') {
            return isJobSelected;
        } else { // exclude
            return !isJobSelected;
        }
    }

    // Check if target meets last action criteria
    function meetsLastActionCriteria(lastAction) {
        if (!settings.useLastActionFilter) {
            return true;
        }

        if (settings.selectedTimeRanges.length === 0) {
            return true; // No time ranges selected means include all
        }

        if (!lastAction || !lastAction.timestamp) {
            return false; // No last action data available
        }

        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const lastActionTime = lastAction.timestamp;
        const timeDiff = now - lastActionTime;

        // Convert time differences to seconds
        const timeRanges = {
            '7days': 7 * 24 * 60 * 60,
            '1week': 7 * 24 * 60 * 60,
            '1month': 30 * 24 * 60 * 60,
            '3months': 90 * 24 * 60 * 60,
            '6months': 180 * 24 * 60 * 60,
            '1year': 365 * 24 * 60 * 60,
            'over1year': 365 * 24 * 60 * 60,
            'over2years': 730 * 24 * 60 * 60
        };

        let matchesTimeRange = false;

        for (const selectedRange of settings.selectedTimeRanges) {
            switch (selectedRange) {
                case '7days':
                case '1week':
                    if (timeDiff <= timeRanges[selectedRange]) {
                        matchesTimeRange = true;
                    }
                    break;
                case '1month':
                    if (timeDiff <= timeRanges['1month'] && timeDiff > timeRanges['7days']) {
                        matchesTimeRange = true;
                    }
                    break;
                case '3months':
                    if (timeDiff <= timeRanges['3months'] && timeDiff > timeRanges['1month']) {
                        matchesTimeRange = true;
                    }
                    break;
                case '6months':
                    if (timeDiff <= timeRanges['6months'] && timeDiff > timeRanges['3months']) {
                        matchesTimeRange = true;
                    }
                    break;
                case '1year':
                    if (timeDiff <= timeRanges['1year'] && timeDiff > timeRanges['6months']) {
                        matchesTimeRange = true;
                    }
                    break;
                case 'over1year':
                    if (timeDiff > timeRanges['over1year'] && timeDiff <= timeRanges['over2years']) {
                        matchesTimeRange = true;
                    }
                    break;
                case 'over2years':
                    if (timeDiff > timeRanges['over2years']) {
                        matchesTimeRange = true;
                    }
                    break;
            }

            if (matchesTimeRange) break; // Found a match, no need to check other ranges
        }

        if (settings.lastActionFilterType === 'include') {
            return matchesTimeRange;
        } else { // exclude
            return !matchesTimeRange;
        }
    }

    // Check if target meets company/faction criteria
    function meetsCompanyCriteria(faction) {
        if (!settings.useCompanyFilter) {
            return true;
        }

        // If filtering for "any faction" members
        if (settings.companyFilterMethod === 'any') {
            const hasCompany = faction && faction.faction_id && faction.faction_id > 0;

            if (settings.companyFilterType === 'include') {
                return hasCompany; // Must be in any faction
            } else { // exclude
                return !hasCompany; // Must not be in any faction
            }
        }

        // If filtering for specific factions
        if (settings.companyFilterMethod === 'specific') {
            if (settings.selectedCompanies.length === 0) {
                return true; // No specific companies selected means include all
            }

            const userFactionId = faction ? faction.faction_id : 0;
            const isFactionSelected = settings.selectedCompanies.includes(userFactionId);

            if (settings.companyFilterType === 'include') {
                return isFactionSelected;
            } else { // exclude
                return !isFactionSelected;
            }
        }

        return true;
    }

    // Find a random target within criteria
    async function findRandomTarget() {
        let attempts = 0;
        const maxAttempts = settings.maxRetries;

        console.log('Starting target search with criteria:', {
            useJobFilter: settings.useJobFilter,
            useLastActionFilter: settings.useLastActionFilter,
            useCompanyFilter: settings.useCompanyFilter,
            useBattleStatsFilter: settings.useBattleStatsFilter
        });

        while (attempts < maxAttempts) {
            const randID = getRandomNumber(settings.minID, settings.maxID);
            console.log(`Attempt ${attempts + 1}/${maxAttempts}: Checking user ${randID}`);

            // If no API key is set, just return the random ID
            if (!settings.apiKey) {
                console.log('No API key - returning random ID');
                return { id: randID, profile: null };
            }

            const profile = await getUserProfile(randID);

            if (profile) {
                console.log(`Profile found for ${randID}:`, {
                    level: profile.level,
                    jobId: profile.job?.job_id,
                    companyName: profile.job?.company_name,
                    factionName: profile.faction?.faction_name,
                    lastAction: profile.last_action?.relative,
                    totalStats: profile.battlestats?.total
                });

                const meetsLevel = profile.level >= settings.minLevel && profile.level <= settings.maxLevel;
                const meetsBattleStats = meetsBattleStatsCriteria(profile.battlestats);
                const meetsJob = meetsJobCriteria(profile.job);
                const meetsLastAction = meetsLastActionCriteria(profile.last_action);
                const meetsCompany = meetsCompanyCriteria(profile.faction);

                console.log(`Filter results for ${randID}:`, {
                    meetsLevel,
                    meetsBattleStats,
                    meetsJob,
                    meetsLastAction,
                    meetsCompany
                });

                if (meetsLevel && meetsBattleStats && meetsJob && meetsLastAction && meetsCompany) {
                    let logMessage = `Found target: ID ${randID}, Level ${profile.level}`;

                    if (profile.job && profile.job.job_id > 1) {
                        if (profile.job.job_id > 16) {
                            // Private company job
                            logMessage += `, Job: Private Company (${profile.job.company_name || 'Unknown'})`;
                        } else {
                            // NPC job
                            logMessage += `, Job: ${TORN_JOBS[profile.job.job_id] || 'Unknown'}`;
                        }
                    } else {
                        logMessage += `, Job: Unemployed`;
                    }

                    if (profile.faction) {
                        logMessage += `, Faction: ${profile.faction.faction_name}`;
                    }

                    if (profile.last_action) {
                        logMessage += `, Last Action: ${profile.last_action.relative}`;
                    }

                    if (profile.battlestats) {
                        logMessage += `, Total Stats: ${formatNumber(profile.battlestats.total)}`;
                    }

                    console.log(logMessage);
                    return { id: randID, profile: profile };
                } else {
                    console.log(`User ${randID} filtered out`);
                }
            } else {
                console.log(`No profile data for ${randID}`);
            }

            attempts++;

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        console.warn(`Could not find target within criteria after ${maxAttempts} attempts`);
        return null;
    }

    // Create settings panel
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 100000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            min-width: 500px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        `;

        const jobCheckboxes = Object.entries(TORN_JOBS).map(([id, name]) =>
            `<label style="display: block; margin: 2px 0; font-size: 12px;">
                <input type="checkbox" value="${id}" ${settings.selectedJobs.includes(parseInt(id)) ? 'checked' : ''}> ${name}
            </label>`
        ).join('');

        panel.innerHTML = `
            <h3 style="margin-top: 0; color: #4CAF50;">Target Finder Settings</h3>

            <div style="border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Basic Settings</h4>
                <div style="margin-bottom: 10px;">
                    <label>Min User ID:</label><br>
                    <input type="number" id="minID" value="${settings.minID}" style="width: 100%; padding: 5px; margin-top: 2px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Max User ID:</label><br>
                    <input type="number" id="maxID" value="${settings.maxID}" style="width: 100%; padding: 5px; margin-top: 2px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>API Key (required for filtering):</label><br>
                    <input type="password" id="apiKey" value="${settings.apiKey}" style="width: 100%; padding: 5px; margin-top: 2px;" placeholder="Get from torn.com/preferences.php#tab=api">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Max Retries:</label><br>
                    <input type="number" id="maxRetries" value="${settings.maxRetries}" style="width: 100%; padding: 5px; margin-top: 2px;" min="1" max="50">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>
                        <input type="checkbox" id="openInNewTab" ${settings.openInNewTab ? 'checked' : ''}> Open in new tab
                    </label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label>
                        <input type="checkbox" id="useAttackLink" ${settings.useAttackLink ? 'checked' : ''}> Use attack link (unchecked = profile link)
                    </label>
                </div>
            </div>

            <div style="border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Level Filter</h4>
                <div style="margin-bottom: 10px;">
                    <label>Min Level:</label><br>
                    <input type="number" id="minLevel" value="${settings.minLevel}" style="width: 100%; padding: 5px; margin-top: 2px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>Max Level:</label><br>
                    <input type="number" id="maxLevel" value="${settings.maxLevel}" style="width: 100%; padding: 5px; margin-top: 2px;">
                </div>
            </div>

            <div style="border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Job Filter</h4>
                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="useJobFilter" ${settings.useJobFilter ? 'checked' : ''}> Enable job filtering
                    </label>
                </div>

                <div id="jobFilterOptions" style="display: ${settings.useJobFilter ? 'block' : 'none'};">
                    <div style="margin-bottom: 15px;">
                        <label>Filter Type:</label><br>
                        <select id="jobFilterType" style="width: 100%; padding: 5px; margin-top: 2px;">
                            <option value="include" ${settings.jobFilterType === 'include' ? 'selected' : ''}>Include only selected jobs</option>
                            <option value="exclude" ${settings.jobFilterType === 'exclude' ? 'selected' : ''}>Exclude selected jobs</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label>Select Jobs:</label><br>
                        <div style="max-height: 150px; overflow-y: auto; border: 1px solid #555; padding: 10px; margin-top: 5px; background: #333;">
                            <div style="margin-bottom: 10px;">
                                <button type="button" id="selectAllJobs" style="background: #666; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 11px;">Select All</button>
                                <button type="button" id="clearAllJobs" style="background: #666; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">Clear All</button>
                            </div>
                            <div id="jobCheckboxes" style="columns: 2; column-gap: 15px;">
                                ${jobCheckboxes}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Last Action Filter</h4>
                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="useLastActionFilter" ${settings.useLastActionFilter ? 'checked' : ''}> Enable last action filtering
                    </label>
                </div>

                <div id="lastActionFilterOptions" style="display: ${settings.useLastActionFilter ? 'block' : 'none'};">
                    <div style="margin-bottom: 15px;">
                        <label>Filter Type:</label><br>
                        <select id="lastActionFilterType" style="width: 100%; padding: 5px; margin-top: 2px;">
                            <option value="include" ${settings.lastActionFilterType === 'include' ? 'selected' : ''}>Include only selected ranges</option>
                            <option value="exclude" ${settings.lastActionFilterType === 'exclude' ? 'selected' : ''}>Exclude selected ranges</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label>Select Time Ranges:</label><br>
                        <div style="border: 1px solid #555; padding: 10px; margin-top: 5px; background: #333;">
                            <div style="margin-bottom: 10px;">
                                <button type="button" id="selectAllTimeRanges" style="background: #666; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 11px;">Select All</button>
                                <button type="button" id="clearAllTimeRanges" style="background: #666; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">Clear All</button>
                            </div>
                            <div id="timeRangeCheckboxes" style="columns: 2; column-gap: 15px;">
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="7days" ${settings.selectedTimeRanges.includes('7days') ? 'checked' : ''}> Last 7 days
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="1week" ${settings.selectedTimeRanges.includes('1week') ? 'checked' : ''}> Last week
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="1month" ${settings.selectedTimeRanges.includes('1month') ? 'checked' : ''}> Last month
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="3months" ${settings.selectedTimeRanges.includes('3months') ? 'checked' : ''}> Last 3 months
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="6months" ${settings.selectedTimeRanges.includes('6months') ? 'checked' : ''}> Last 6 months
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="1year" ${settings.selectedTimeRanges.includes('1year') ? 'checked' : ''}> Last year
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="over1year" ${settings.selectedTimeRanges.includes('over1year') ? 'checked' : ''}> Over 1 year ago
                                </label>
                                <label style="display: block; margin: 2px 0; font-size: 12px;">
                                    <input type="checkbox" value="over2years" ${settings.selectedTimeRanges.includes('over2years') ? 'checked' : ''}> Over 2 years ago
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Company/Faction Filter</h4>
                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="useCompanyFilter" ${settings.useCompanyFilter ? 'checked' : ''}> Enable company filtering
                    </label>
                </div>

                <div id="companyFilterOptions" style="display: ${settings.useCompanyFilter ? 'block' : 'none'};">
                    <div style="margin-bottom: 15px;">
                        <label>Filter Type:</label><br>
                        <select id="companyFilterType" style="width: 100%; padding: 5px; margin-top: 2px;">
                            <option value="include" ${settings.companyFilterType === 'include' ? 'selected' : ''}>Include selected</option>
                            <option value="exclude" ${settings.companyFilterType === 'exclude' ? 'selected' : ''}>Exclude selected</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label>Filter Method:</label><br>
                        <select id="companyFilterMethod" style="width: 100%; padding: 5px; margin-top: 2px;">
                            <option value="any" ${settings.companyFilterMethod === 'any' ? 'selected' : ''}>Any faction membership</option>
                            <option value="specific" ${settings.companyFilterMethod === 'specific' ? 'selected' : ''}>Specific factions</option>
                        </select>
                    </div>

                    <div id="specificCompanyOptions" style="display: ${settings.companyFilterMethod === 'specific' ? 'block' : 'none'};">
                        <div style="margin-bottom: 10px;">
                            <label>Faction IDs (comma-separated):</label><br>
                            <input type="text" id="selectedCompanies" value="${settings.selectedCompanies.join(',')}" style="width: 100%; padding: 5px; margin-top: 2px;" placeholder="e.g., 12345,67890">
                            <small style="color: #aaa;">Enter faction IDs you want to include/exclude</small>
                        </div>
                    </div>
                </div>
            </div>

            <div style="padding-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #FFA500;">Battle Stats Filter</h4>
                <div style="margin-bottom: 15px;">
                    <label>
                        <input type="checkbox" id="useBattleStatsFilter" ${settings.useBattleStatsFilter ? 'checked' : ''}> Enable battle stats filtering
                    </label>
                </div>

                <div id="battleStatsOptions" style="display: ${settings.useBattleStatsFilter ? 'block' : 'none'};">
                    <div style="margin-bottom: 15px;">
                        <label>Filter Type:</label><br>
                        <select id="battleStatsFilterType" style="width: 100%; padding: 5px; margin-top: 2px;">
                            <option value="total" ${settings.battleStatsFilterType === 'total' ? 'selected' : ''}>Total Battle Stats</option>
                            <option value="individual" ${settings.battleStatsFilterType === 'individual' ? 'selected' : ''}>Individual Stats</option>
                        </select>
                    </div>

                    <div id="totalStatsFilter" style="display: ${settings.battleStatsFilterType === 'total' ? 'block' : 'none'};">
                        <div style="margin-bottom: 10px;">
                            <label>Min Total Stats:</label><br>
                            <input type="number" id="minTotalStats" value="${settings.minTotalStats}" style="width: 100%; padding: 5px; margin-top: 2px;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label>Max Total Stats:</label><br>
                            <input type="number" id="maxTotalStats" value="${settings.maxTotalStats}" style="width: 100%; padding: 5px; margin-top: 2px;">
                        </div>
                    </div>

                    <div id="individualStatsFilter" style="display: ${settings.battleStatsFilterType === 'individual' ? 'block' : 'none'};">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label>Min Strength:</label><br>
                                <input type="number" id="minStrength" value="${settings.minStrength}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Max Strength:</label><br>
                                <input type="number" id="maxStrength" value="${settings.maxStrength}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Min Defense:</label><br>
                                <input type="number" id="minDefense" value="${settings.minDefense}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Max Defense:</label><br>
                                <input type="number" id="maxDefense" value="${settings.maxDefense}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Min Speed:</label><br>
                                <input type="number" id="minSpeed" value="${settings.minSpeed}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Max Speed:</label><br>
                                <input type="number" id="maxSpeed" value="${settings.maxSpeed}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Min Dexterity:</label><br>
                                <input type="number" id="minDexterity" value="${settings.minDexterity}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                            <div>
                                <label>Max Dexterity:</label><br>
                                <input type="number" id="maxDexterity" value="${settings.maxDexterity}" style="width: 100%; padding: 5px; margin-top: 2px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button id="saveSettings" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Save Settings</button>
                <button id="cancelSettings" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Cancel</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners for dynamic UI
        const useJobFilterCheckbox = panel.querySelector('#useJobFilter');
        const jobFilterOptions = panel.querySelector('#jobFilterOptions');
        const useLastActionFilterCheckbox = panel.querySelector('#useLastActionFilter');
        const lastActionFilterOptions = panel.querySelector('#lastActionFilterOptions');
        const useCompanyFilterCheckbox = panel.querySelector('#useCompanyFilter');
        const companyFilterOptions = panel.querySelector('#companyFilterOptions');
        const companyFilterMethod = panel.querySelector('#companyFilterMethod');
        const specificCompanyOptions = panel.querySelector('#specificCompanyOptions');
        const useBattleStatsCheckbox = panel.querySelector('#useBattleStatsFilter');
        const battleStatsOptions = panel.querySelector('#battleStatsOptions');
        const filterTypeSelect = panel.querySelector('#battleStatsFilterType');
        const totalStatsFilter = panel.querySelector('#totalStatsFilter');
        const individualStatsFilter = panel.querySelector('#individualStatsFilter');

        // Job filter toggle
        useJobFilterCheckbox.addEventListener('change', function() {
            jobFilterOptions.style.display = this.checked ? 'block' : 'none';
        });

        // Last action filter toggle
        useLastActionFilterCheckbox.addEventListener('change', function() {
            lastActionFilterOptions.style.display = this.checked ? 'block' : 'none';
        });

        // Company filter toggle
        useCompanyFilterCheckbox.addEventListener('change', function() {
            companyFilterOptions.style.display = this.checked ? 'block' : 'none';
        });

        // Company filter method toggle
        companyFilterMethod.addEventListener('change', function() {
            specificCompanyOptions.style.display = this.value === 'specific' ? 'block' : 'none';
        });

        // Job checkbox management
        panel.querySelector('#selectAllJobs').addEventListener('click', function() {
            const checkboxes = panel.querySelectorAll('#jobCheckboxes input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = true);
        });

        panel.querySelector('#clearAllJobs').addEventListener('click', function() {
            const checkboxes = panel.querySelectorAll('#jobCheckboxes input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
        });

        // Time range checkbox management
        panel.querySelector('#selectAllTimeRanges').addEventListener('click', function() {
            const checkboxes = panel.querySelectorAll('#timeRangeCheckboxes input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = true);
        });

        panel.querySelector('#clearAllTimeRanges').addEventListener('click', function() {
            const checkboxes = panel.querySelectorAll('#timeRangeCheckboxes input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
        });

        useBattleStatsCheckbox.addEventListener('change', function() {
            battleStatsOptions.style.display = this.checked ? 'block' : 'none';
        });

        filterTypeSelect.addEventListener('change', function() {
            totalStatsFilter.style.display = this.value === 'total' ? 'block' : 'none';
            individualStatsFilter.style.display = this.value === 'individual' ? 'block' : 'none';
        });

        // Save settings
        panel.querySelector('#saveSettings').addEventListener('click', () => {
            settings.minID = parseInt(panel.querySelector('#minID').value);
            settings.maxID = parseInt(panel.querySelector('#maxID').value);
            settings.minLevel = parseInt(panel.querySelector('#minLevel').value);
            settings.maxLevel = parseInt(panel.querySelector('#maxLevel').value);
            settings.apiKey = panel.querySelector('#apiKey').value;
            settings.maxRetries = parseInt(panel.querySelector('#maxRetries').value);
            settings.openInNewTab = panel.querySelector('#openInNewTab').checked;
            settings.useAttackLink = panel.querySelector('#useAttackLink').checked;

            // Job filtering settings
            settings.useJobFilter = panel.querySelector('#useJobFilter').checked;
            settings.jobFilterType = panel.querySelector('#jobFilterType').value;

            const selectedJobCheckboxes = panel.querySelectorAll('#jobCheckboxes input[type="checkbox"]:checked');
            settings.selectedJobs = Array.from(selectedJobCheckboxes).map(cb => parseInt(cb.value));

            // Last action filtering settings
            settings.useLastActionFilter = panel.querySelector('#useLastActionFilter').checked;
            settings.lastActionFilterType = panel.querySelector('#lastActionFilterType').value;

            const selectedTimeRangeCheckboxes = panel.querySelectorAll('#timeRangeCheckboxes input[type="checkbox"]:checked');
            settings.selectedTimeRanges = Array.from(selectedTimeRangeCheckboxes).map(cb => cb.value);

            // Company filtering settings
            settings.useCompanyFilter = panel.querySelector('#useCompanyFilter').checked;
            settings.companyFilterType = panel.querySelector('#companyFilterType').value;
            settings.companyFilterMethod = panel.querySelector('#companyFilterMethod').value;

            const companyIds = panel.querySelector('#selectedCompanies').value;
            settings.selectedCompanies = companyIds ? companyIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];

            settings.useBattleStatsFilter = panel.querySelector('#useBattleStatsFilter').checked;
            settings.battleStatsFilterType = panel.querySelector('#battleStatsFilterType').value;

            settings.minTotalStats = parseInt(panel.querySelector('#minTotalStats').value) || 0;
            settings.maxTotalStats = parseInt(panel.querySelector('#maxTotalStats').value) || 1000000000;

            settings.minStrength = parseInt(panel.querySelector('#minStrength').value) || 0;
            settings.maxStrength = parseInt(panel.querySelector('#maxStrength').value) || 1000000000;
            settings.minDefense = parseInt(panel.querySelector('#minDefense').value) || 0;
            settings.maxDefense = parseInt(panel.querySelector('#maxDefense').value) || 1000000000;
            settings.minSpeed = parseInt(panel.querySelector('#minSpeed').value) || 0;
            settings.maxSpeed = parseInt(panel.querySelector('#maxSpeed').value) || 1000000000;
            settings.minDexterity = parseInt(panel.querySelector('#minDexterity').value) || 0;
            settings.maxDexterity = parseInt(panel.querySelector('#maxDexterity').value) || 1000000000;

            saveSettings(settings);
            panel.style.display = 'none';

            showNotification('Settings saved successfully!', 'success');
        });

        panel.querySelector('#cancelSettings').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        return panel;
    }

    // Show notification with target details
    function showNotification(message, type = 'info', details = null) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        let content = message;
        if (details && details.profile) {
            content += `<br><strong>Level:</strong> ${details.profile.level}`;

            if (details.profile.job && details.profile.job.job_id > 1) {
                if (details.profile.job.job_id > 16) {
                    // Private company job
                    content += `<br><strong>Job:</strong> Private Company`;
                    if (details.profile.job.company_name) {
                        content += ` (${details.profile.job.company_name})`;
                    }
                } else {
                    // NPC job
                    content += `<br><strong>Job:</strong> ${TORN_JOBS[details.profile.job.job_id] || 'Unknown'}`;
                }
            } else {
                content += `<br><strong>Job:</strong> Unemployed`;
            }

            if (details.profile.faction) {
                content += `<br><strong>Faction:</strong> ${details.profile.faction.faction_name}`;
            }

            if (details.profile.last_action) {
                content += `<br><strong>Last Action:</strong> ${details.profile.last_action.relative}`;
            }

            if (details.profile.battlestats) {
                content += `<br><strong>Total Stats:</strong> ${formatNumber(details.profile.battlestats.total)}`;
                if (settings.battleStatsFilterType === 'individual') {
                    content += `<br><small>STR: ${formatNumber(details.profile.battlestats.strength)} | DEF: ${formatNumber(details.profile.battlestats.defense)}<br>SPD: ${formatNumber(details.profile.battlestats.speed)} | DEX: ${formatNumber(details.profile.battlestats.dexterity)}</small>`;
                }
            }
        }

        notification.innerHTML = content;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 6000);
    }

    // Create main UI
    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 27%;
            right: 0;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;

        // Main button
        const mainButton = document.createElement('button');
        mainButton.innerHTML = '🎯 Find Target';
        mainButton.style.cssText = `
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // Settings button
        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        settingsButton.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 8px;
            border-radius: 0 5px 5px 0;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-left: 1px solid rgba(255,255,255,0.3);
        `;

        container.appendChild(mainButton);
        container.appendChild(settingsButton);

        const settingsPanel = createSettingsPanel();

        // Event listeners
        mainButton.addEventListener('click', async function() {
            mainButton.disabled = true;
            mainButton.innerHTML = '🔍 Searching...';

            try {
                const result = await findRandomTarget();

                if (result) {
                    const linkType = settings.useAttackLink ? 'attack' : 'profile';
                    const profileLink = settings.useAttackLink
                        ? `https://www.torn.com/loader.php?sid=attack&user2ID=${result.id}`
                        : `https://www.torn.com/profiles.php?XID=${result.id}`;

                    if (settings.openInNewTab) {
                        window.open(profileLink, '_blank');
                    } else {
                        window.location.href = profileLink;
                    }

                    showNotification(`Target found: ${result.id}`, 'success', result);
                } else {
                    showNotification('No suitable target found. Try adjusting your filters or increasing max retries.', 'error');
                }
            } catch (error) {
                console.error('Error finding target:', error);
                showNotification('Error occurred while finding target', 'error');
            } finally {
                mainButton.disabled = false;
                mainButton.innerHTML = '🎯 Find Target';
            }
        });

        settingsButton.addEventListener('click', function() {
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(container);
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();