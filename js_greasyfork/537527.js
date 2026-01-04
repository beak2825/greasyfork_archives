// ==UserScript==
// @name         FF Target Finder 
// @version      1.7
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @description  Chain Target gatherer using FF data 
// @author       Davrone
// @license      N/A
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/537527/FF%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/537527/FF%20Target%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        position: { x: 20, y: 100 },
        currentPreset: 'easy',
        presets: {
            easy: {
                name: 'Easy Targets',
                color: '#28a745',
                targetFF: { min: 0.5, max: 2.0 },
                description: 'FF 0.5-2.0 (Easy wins)'
            },
            medium: {
                name: 'Medium Targets',
                color: '#ffc107',
                targetFF: { min: 2.0, max: 3.5 },
                description: 'FF 2.0-3.5 (Moderate challenge)'
            },
            hard: {
                name: 'Hard Targets',
                color: '#dc3545',
                targetFF: { min: 3.5, max: 5.0 },
                description: 'FF 3.5-5.0 (Difficult fights)'
            },
            extreme: {
                name: 'Extreme Targets',
                color: '#6f42c1',
                targetFF: { min: 5.0, max: 50.0 },
                description: 'FF 5.0-50.0 (Nearly impossible)'
            },
            custom: {
                name: 'Custom Range',
                color: '#17a2b8',
                targetFF: { min: 1.0, max: 3.0 },
                description: 'Custom FF range'
            }
        },
        openInNewTab: false,
        actionType: 'attack',
        passiveCollection: true,
        validateOnVisit: true, // Check and update FF scores when revisiting targets
        blacklist: [],
        ffDatabase: {}, // { userID: { ff: 2.34, lastUpdated: 1234567890, visits: 3, lastValidated: 1234567890, selectedFromDB: false } }
        usedTargets: [], // Track recently used targets to avoid repeats
        statistics: {
            totalTargets: 0,
            successfulAttacks: 0,
            averageFF: 0,
            lastUsed: null,
            databaseSize: 0,
            profilesVisited: 0,
            ffScouterDetected: false,
            dataUpdates: 0, // Track how many times we've updated existing records
            ffDistribution: { easy: 0, medium: 0, hard: 0, extreme: 0, noData: 0 }
        }
    };

    let config = loadConfig();
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentPage = { type: null, userId: null };

    // Load configuration from localStorage
    function loadConfig() {
        try {
            const saved = localStorage.getItem('tornPassiveFFTargetFinder');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Migrate old database format if needed
                if (parsed.ffDatabase) {
                    Object.keys(parsed.ffDatabase).forEach(id => {
                        const data = parsed.ffDatabase[id];
                        if (typeof data === 'number') {
                            // Very old format: just FF score
                            parsed.ffDatabase[id] = {
                                ff: data,
                                lastUpdated: Date.now(),
                                visits: 1,
                                lastValidated: Date.now(),
                                selectedFromDB: false
                            };
                        } else if (data.timestamp && !data.lastUpdated) {
                            // Old format: convert timestamp to lastUpdated
                            parsed.ffDatabase[id] = {
                                ff: data.ff,
                                lastUpdated: data.timestamp,
                                visits: data.visits || 1,
                                lastValidated: data.timestamp,
                                selectedFromDB: false
                            };
                        } else if (!data.lastValidated) {
                            // Missing validation timestamp
                            data.lastValidated = data.lastUpdated || Date.now();
                            data.selectedFromDB = data.selectedFromDB || false;
                        }
                    });
                }
                return { ...DEFAULT_CONFIG, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load config:', e);
        }
        return { ...DEFAULT_CONFIG };
    }

    // Save configuration to localStorage
    function saveConfig() {
        try {
            // Update database size statistic
            config.statistics.databaseSize = Object.keys(config.ffDatabase).length;
            localStorage.setItem('tornPassiveFFTargetFinder', JSON.stringify(config));
        } catch (e) {
            console.error('Failed to save config:', e);
        }
    }

    // Validate and update FF data for existing database entries
    function validateFFData(userId, currentFF) {
        const existing = config.ffDatabase[userId];
        if (!existing) return false;

        let updated = false;
        const now = Date.now();

        // Update validation timestamp
        existing.lastValidated = now;
        existing.visits++;

        // Check if FF score has changed
        if (currentFF !== null && currentFF !== existing.ff) {
            const oldFF = existing.ff;
            existing.ff = currentFF;
            existing.lastUpdated = now;
            config.statistics.dataUpdates++;
            updated = true;

            // Show notification for changes
            showToast(`📊 FF Updated: User ${userId} changed from ${oldFF} to ${currentFF}`, 'info');
            console.log(`[FF Target Finder] Updated FF for user ${userId}: ${oldFF} → ${currentFF}`);
        } else {
            // Even if FF didn't change, show a subtle validation message
            showToast(`✅ FF Validated: User ${userId} confirmed at ${currentFF}`, 'subtle');
        }

        return updated;
    }

    // Detect what page we're on
    function detectCurrentPage() {
        const url = window.location.href;

        // Profile pages
        const profileMatch = url.match(/profiles\.php\?XID=(\d+)/);
        if (profileMatch) {
            return { type: 'profile', userId: parseInt(profileMatch[1]) };
        }

        // Attack pages
        const attackMatch = url.match(/loader\.php\?sid=attack&user2ID=(\d+)/);
        if (attackMatch) {
            return { type: 'attack', userId: parseInt(attackMatch[1]) };
        }

        return { type: 'other', userId: null };
    }

    // Parse FF score from FF Scouter display
    function parseFFScoreFromPage() {
        const ffElement = document.querySelector('#ff-scouter-run-once');
        if (!ffElement) return null;

        const text = ffElement.textContent || ffElement.innerText || '';

        // Look for patterns like "FairFight: 2.34"
        const patterns = [
            /FairFight:\s*(\d+\.?\d*)/i,
            /FF\s*(\d+\.?\d*)/i,
            /(\d+\.?\d*)\s*\(/i // Number followed by parentheses
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const score = parseFloat(match[1]);
                if (score > 0 && score <= 50) { // Reasonable FF range
                    return score;
                }
            }
        }

        // Check for "No data"
        if (text.toLowerCase().includes('no data') || text.toLowerCase().includes('no ff')) {
            return 'no_data';
        }

        return null;
    }

    // Passively collect FF data from current page
    function collectFFData() {
        if (!config.passiveCollection) return;

        const page = detectCurrentPage();
        if (!page.userId) return;

        // Wait a moment for FF Scouter to load
        setTimeout(() => {
            const ffScore = parseFFScoreFromPage();
            
            if (ffScore !== null && ffScore !== 'no_data') {
                // Only store profiles that have actual FF data
                const existing = config.ffDatabase[page.userId];

                if (existing) {
                    // Validate and potentially update existing data
                    const wasUpdated = validateFFData(page.userId, ffScore);

                    // Check if target is still in desired range if it was selected from DB
                    if (existing.selectedFromDB && config.validateOnVisit) {
                        const preset = config.presets[config.currentPreset];
                        if (!isFFInRange(ffScore, preset)) {
                            showToast(`⚠️ Target FF changed! Now ${ffScore} (wanted ${preset.targetFF.min}-${preset.targetFF.max})`, 'warning');
                        }
                        // Reset the flag after validation
                        existing.selectedFromDB = false;
                    }
                } else {
                    // New entry with actual FF data
                    config.ffDatabase[page.userId] = {
                        ff: ffScore,
                        lastUpdated: Date.now(),
                        visits: 1,
                        lastValidated: Date.now(),
                        selectedFromDB: false,
                        lastPageType: page.type
                    };

                    config.statistics.profilesVisited++;
                    showToast(`🆕 New Profile Added: User ${page.userId} with FF ${ffScore}`, 'success');
                    console.log(`[FF Target Finder] Collected new FF ${ffScore} for user ${page.userId}`);
                }

                if (!config.statistics.ffScouterDetected) {
                    config.statistics.ffScouterDetected = true;
                    showToast('FF Scouter detected! Starting passive data collection.', 'success');
                }

                saveConfig();
                updateStatsDisplay();
            } else if (ffScore === 'no_data') {
                // Profile has no FF data - remove from database if it exists
                const existing = config.ffDatabase[page.userId];
                if (existing) {
                    delete config.ffDatabase[page.userId];
                    showToast(`🗑️ Removed User ${page.userId}: No FF data available`, 'info');
                    console.log(`[FF Target Finder] Removed user ${page.userId} - no FF data`);
                    saveConfig();
                    updateStatsDisplay();
                } else {
                    // Just show a subtle notification that we checked but found nothing
                    showToast(`📊 Checked User ${page.userId}: No FF data found`, 'subtle');
                }

                if (!config.statistics.ffScouterDetected) {
                    config.statistics.ffScouterDetected = true;
                    showToast('FF Scouter detected! Starting passive data collection.', 'success');
                }
            }
            // If ffScore is null, FF Scouter probably hasn't loaded yet or isn't present
        }, 2000); // Wait 2 seconds for FF Scouter to load
    }

    // Import database with smart conflict resolution
    function importDatabase(importedData) {
        const result = {
            added: 0,
            updated: 0,
            skipped: 0,
            blacklisted: 0
        };

        // Validate imported data structure
        if (!importedData || typeof importedData !== 'object') {
            throw new Error('Invalid database format');
        }

        Object.keys(importedData).forEach(userId => {
            const importedProfile = importedData[userId];
            const userIdNum = parseInt(userId);

            // Skip if user is blacklisted
            if (config.blacklist.includes(userIdNum)) {
                result.blacklisted++;
                return;
            }

            // Validate profile data structure
            if (!importedProfile || typeof importedProfile !== 'object') {
                console.warn(`[FF Target Finder] Skipping invalid profile data for user ${userId}`);
                return;
            }

            // Normalize imported profile data
            const normalizedProfile = {
                ff: importedProfile.ff,
                lastUpdated: importedProfile.lastUpdated || importedProfile.timestamp || Date.now(),
                visits: 0, // Reset visits for imported data
                lastValidated: importedProfile.lastValidated || importedProfile.lastUpdated || importedProfile.timestamp || Date.now(),
                selectedFromDB: false
            };

            // Only import profiles that have actual FF data
            if (normalizedProfile.ff === 'no_data' || normalizedProfile.ff === null || normalizedProfile.ff === undefined) {
                result.skipped++;
                return;
            }

            const existingProfile = config.ffDatabase[userId];

            if (!existingProfile) {
                // New profile - add it
                config.ffDatabase[userId] = normalizedProfile;
                result.added++;
            } else {
                // Profile exists - compare timestamps to decide if we should update
                const existingTimestamp = existingProfile.lastUpdated || 0;
                const importedTimestamp = normalizedProfile.lastUpdated || 0;

                if (importedTimestamp > existingTimestamp) {
                    // Imported data is newer - update FF and timestamps, but preserve visit count
                    existingProfile.ff = normalizedProfile.ff;
                    existingProfile.lastUpdated = normalizedProfile.lastUpdated;
                    existingProfile.lastValidated = normalizedProfile.lastValidated;
                    // Keep existing visits count
                    result.updated++;
                } else {
                    // Existing data is newer or same - skip
                    result.skipped++;
                }
            }
        });

        return result;
    }
    function addBlacklistButton() {
        const page = detectCurrentPage();
        if (page.type !== 'profile' || !page.userId) return;

        // Remove existing button if present
        const existingButton = document.getElementById('ttf-blacklist-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Check if user is already blacklisted
        const isBlacklisted = config.blacklist.includes(page.userId);

        // Find a good location to insert the button (try multiple selectors)
        const targetSelectors = [
            '.profile-buttons', // Common profile button container
            '.profile-container .title-black', // Profile title area
            '.profile-wrapper .content-title', // Another common area
            '.user-info-blacklist-wrap', // Torn's blacklist area
            '.profile-mini-stats', // Stats area
            'h4[class*="title"]' // Generic title
        ];

        let buttonContainer = null;
        for (const selector of targetSelectors) {
            buttonContainer = document.querySelector(selector);
            if (buttonContainer) break;
        }

        // If no standard container found, try to find any profile-related element
        if (!buttonContainer) {
            buttonContainer = document.querySelector('[class*="profile"]') || 
                             document.querySelector('[id*="profile"]') ||
                             document.querySelector('.content-wrapper');
        }

        if (!buttonContainer) {
            console.log('[FF Target Finder] Could not find suitable location for blacklist button');
            return;
        }

        // Create the blacklist button
        const blacklistButton = document.createElement('div');
        blacklistButton.id = 'ttf-blacklist-button';
        blacklistButton.innerHTML = `
            <button class="ttf-profile-blacklist-btn ${isBlacklisted ? 'blacklisted' : ''}" 
                    title="${isBlacklisted ? 'Remove from FF Blacklist' : 'Add to FF Blacklist'}">
                <span class="ttf-blacklist-icon">${isBlacklisted ? '✓' : '🚫'}</span>
                <span class="ttf-blacklist-text">${isBlacklisted ? 'Blacklisted' : 'Blacklist'}</span>
            </button>
        `;

        // Insert the button
        if (buttonContainer.classList.contains('title-black') || buttonContainer.tagName === 'H4') {
            // Insert after title elements
            buttonContainer.parentNode.insertBefore(blacklistButton, buttonContainer.nextSibling);
        } else {
            // Insert at the beginning of container
            buttonContainer.insertBefore(blacklistButton, buttonContainer.firstChild);
        }

        // Add click event listener
        const button = blacklistButton.querySelector('.ttf-profile-blacklist-btn');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (config.blacklist.includes(page.userId)) {
                // Remove from blacklist
                config.blacklist = config.blacklist.filter(id => id !== page.userId);
                button.classList.remove('blacklisted');
                button.title = 'Add to FF Blacklist';
                button.querySelector('.ttf-blacklist-icon').textContent = '🚫';
                button.querySelector('.ttf-blacklist-text').textContent = 'Blacklist';
                showToast(`User ${page.userId} removed from blacklist`, 'success');
            } else {
                // Add to blacklist
                config.blacklist.push(page.userId);
                button.classList.add('blacklisted');
                button.title = 'Remove from FF Blacklist';
                button.querySelector('.ttf-blacklist-icon').textContent = '✓';
                button.querySelector('.ttf-blacklist-text').textContent = 'Blacklisted';
                showToast(`User ${page.userId} added to blacklist`, 'info');
            }
            
            saveConfig();
            updateMainButton(); // Update match counts
        });
    }

    // Get FF difficulty category
    function getFFCategory(ff) {
        if (ff <= 2) return 'easy';
        if (ff <= 3.5) return 'medium';
        if (ff <= 5) return 'hard';
        return 'extreme';
    }

    // Check if FF score is within target range
    function isFFInRange(ff, preset) {
        if (!ff || !preset.targetFF) return false;
        return ff >= preset.targetFF.min && ff <= preset.targetFF.max;
    }

    // Find target from database with no-repeat logic
    function findTargetFromDatabase() {
        const preset = config.presets[config.currentPreset];
        const validTargets = [];

        // Filter database for suitable targets
        Object.keys(config.ffDatabase).forEach(userId => {
            const data = config.ffDatabase[userId];
            const id = parseInt(userId);

            // Skip blacklisted users
            if (config.blacklist.includes(id)) return;

            // Check FF range (all entries now have valid FF data)
            if (isFFInRange(data.ff, preset)) {
                const target = {
                    id,
                    ff: data.ff,
                    visits: data.visits,
                    daysSinceUpdate: Math.floor((Date.now() - data.lastUpdated) / (24 * 60 * 60 * 1000)),
                    daysSinceValidation: Math.floor((Date.now() - (data.lastValidated || data.lastUpdated)) / (24 * 60 * 60 * 1000))
                };
                validTargets.push(target);
            }
        });

        if (validTargets.length === 0) {
            return null;
        }

        // Initialize or validate usedTargets array for current preset
        if (!config.usedTargets) {
            config.usedTargets = [];
        }

        // Filter out recently used targets
        const availableTargets = validTargets.filter(target => 
            !config.usedTargets.includes(target.id)
        );

        let selectedTargets;
        
        if (availableTargets.length === 0) {
            // All targets have been used - reset the used list and use all targets
            config.usedTargets = [];
            selectedTargets = validTargets;
            console.log('[FF Target Finder] All targets used, resetting rotation');
            showToast('🔄 Target rotation reset - starting fresh cycle', 'info');
        } else {
            // Use available (unused) targets
            selectedTargets = availableTargets;
        }

        // Sort by visits (ascending) then by days since validation (descending) for variety and freshness
        selectedTargets.sort((a, b) => {
            if (a.visits !== b.visits) return a.visits - b.visits; // Less visited first
            return b.daysSinceValidation - a.daysSinceValidation; // Older validation first (needs refresh)
        });

        // Select random from top 5 to add variety while maintaining quality
        const topTargets = selectedTargets.slice(0, Math.min(5, selectedTargets.length));
        const selectedTarget = topTargets[Math.floor(Math.random() * topTargets.length)];

        // Add to used targets list
        config.usedTargets.push(selectedTarget.id);
        
        // Mark that this target was selected from database for validation
        config.ffDatabase[selectedTarget.id].selectedFromDB = true;

        console.log(`[FF Target Finder] Selected target ${selectedTarget.id} (${config.usedTargets.length}/${validTargets.length} used in current cycle)`);

        return selectedTarget;
    }

    // Generate random fallback target
    function getRandomFallbackTarget() {
        let attempts = 0;
        while (attempts < 10) {
            const targetID = Math.floor(Math.random() * (config.searchRange.max - config.searchRange.min + 1)) + config.searchRange.min;
            if (!config.blacklist.includes(targetID)) {
                return { id: targetID, ff: null };
            }
            attempts++;
        }
        return null;
    }

    // Get smart target
    function getSmartTarget() {
        const dbSize = Object.keys(config.ffDatabase).length;

        // If database is completely empty, don't provide any targets
        if (dbSize === 0) {
            showToast('Database is empty! Visit some profiles first to start building your FF database.', 'warning');
            return null;
        }

        // Try to find target from database
        const dbTarget = findTargetFromDatabase();
        if (dbTarget) {
            return dbTarget;
        }

        // If database exists but no targets match the current preset, offer fallback
        const preset = config.presets[config.currentPreset];
        showToast(`No targets found for FF range ${preset.targetFF.min}-${preset.targetFF.max}. Visit more profiles or try a different preset.`, 'warning');
        return null;
    }

    // Update statistics
    function updateStats(ff = null) {
        if (ff !== null) {
            const category = getFFCategory(ff);
            config.statistics.ffDistribution[category]++;

            // Update average FF based on database entries
            const allFFScores = Object.values(config.ffDatabase).map(data => data.ff).filter(ff => ff && ff !== 'no_data');
            if (allFFScores.length > 0) {
                config.statistics.averageFF = allFFScores.reduce((sum, ff) => sum + ff, 0) / allFFScores.length;
            }
        }

        config.statistics.lastUsed = new Date().toISOString();
        saveConfig();
        updateStatsDisplay();
    }

    // Create main button
    function createMainButton() {
        const dbSize = Object.keys(config.ffDatabase).length;
        const preset = config.presets[config.currentPreset];

        let dbInfo;
        if (dbSize === 0) {
            dbInfo = "DB: Empty - Visit profiles first!";
        } else {
            const validTargets = Object.values(config.ffDatabase).filter(data =>
                isFFInRange(data.ff, preset)
            ).length;
            dbInfo = `DB: ${dbSize} | Matches: ${validTargets}`;
        }

        const button = document.createElement('div');
        button.id = 'tornTargetFinder';
        button.innerHTML = `
            <div class="ttf-button" id="ttf-chain-button">
                <span class="ttf-icon">🎯</span>
                <span class="ttf-text">Chain</span>
            </div>
            <div class="ttf-preset" id="ttf-preset-button">
                <div class="ttf-preset-name">${preset.name}</div>
                <div class="ttf-preset-desc">${preset.description}</div>
                <div class="ttf-database-info">${dbInfo}</div>
            </div>
        `;

        // Apply positioning
        button.style.cssText = `
            position: fixed;
            left: ${config.position.x}px;
            top: ${config.position.y}px;
            z-index: 10000;
            cursor: pointer;
            user-select: none;
            font-family: Arial, sans-serif;
        `;

        // Add event listeners
        const chainButton = button.querySelector('#ttf-chain-button');
        const presetButton = button.querySelector('#ttf-preset-button');

        chainButton.addEventListener('click', handleChainClick);
        presetButton.addEventListener('click', handlePresetCycle);
        button.addEventListener('contextmenu', handleRightClick);
        button.addEventListener('mousedown', handleMouseDown);

        return button;
    }

    // Create settings panel
    function createSettingsPanel() {
        const dbSize = Object.keys(config.ffDatabase).length;
        const ffScouterStatus = config.statistics.ffScouterDetected ? '✅ Detected' : '❌ Not Detected';

        // Calculate database stats
        const dbStats = {
            easy: 0, medium: 0, hard: 0, extreme: 0
        };
        Object.values(config.ffDatabase).forEach(data => {
            const category = getFFCategory(data.ff);
            dbStats[category]++;
        });

        const panel = document.createElement('div');
        panel.id = 'tornTargetSettings';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="ttf-settings">
                <div class="ttf-header">
                    <h3>Passive FF Database Target Finder</h3>
                    <button class="ttf-close">×</button>
                </div>

                <div class="ttf-section">
                    <h4>Database Status</h4>
                    <div class="ttf-db-status">
                        <div class="ttf-status-grid">
                            <div>FF Scouter: <span class="ttf-status-indicator">${ffScouterStatus}</span></div>
                            <div>Database Size: <span>${dbSize} profiles</span></div>
                            <div>Profiles Visited: <span>${config.statistics.profilesVisited}</span></div>
                            <div>Data Updates: <span>${config.statistics.dataUpdates || 0}</span></div>
                        </div>
                        <div class="ttf-database-breakdown">
                            <h5>Database Breakdown:</h5>
                            <div class="ttf-db-bars">
                                <div class="ttf-db-bar easy">Easy (≤2.0): ${dbStats.easy}</div>
                                <div class="ttf-db-bar medium">Medium (2.0-3.5): ${dbStats.medium}</div>
                                <div class="ttf-db-bar hard">Hard (3.5-5.0): ${dbStats.hard}</div>
                                <div class="ttf-db-bar extreme">Extreme (>5.0): ${dbStats.extreme}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>How Self-Validation Works</h4>
                    <div class="ttf-how-it-works">
                        <div class="ttf-step">
                            <strong>📊 Passive Collection:</strong> As you browse profiles, the script reads FF scores from FF Scouter and builds your database permanently.
                        </div>
                        <div class="ttf-step">
                            <strong>🎯 Smart Targeting:</strong> When you click "Chain", it selects a target from your database that matches your FF range. <strong>Database must have entries first!</strong>
                        </div>
                        <div class="ttf-step">
                            <strong>✅ Auto-Validation:</strong> When you visit the selected profile, it checks if their FF score has changed and updates your database.
                        </div>
                        <div class="ttf-step">
                            <strong>⚠️ Range Alerts:</strong> If a target's FF score has moved outside your desired range, you'll get a warning notification.
                        </div>
                        <div class="ttf-step">
                            <strong>🚫 One-Click Blacklist:</strong> On profile pages, click the red "Blacklist" button to instantly exclude someone from future targeting.
                        </div>
                        <div class="ttf-step">
                            <strong>🚀 Getting Started:</strong> Visit some profiles (attack, bounties, search, etc.) to start building your database, then use "Chain" for intelligent targeting.
                        </div>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Collection Settings</h4>
                    <div class="ttf-collection-settings">
                        <label><input type="checkbox" id="passiveCollection" ${config.passiveCollection ? 'checked' : ''}> Enable Passive Collection</label>
                        <label><input type="checkbox" id="validateOnVisit" ${config.validateOnVisit ? 'checked' : ''}> Validate Targets When Visited</label>
                        <button id="exportDatabase">Export Database</button>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Fair Fight Presets</h4>
                    <div class="ttf-presets">
                        ${Object.entries(config.presets).map(([key, preset]) => {
                            const matches = Object.values(config.ffDatabase).filter(data =>
                                isFFInRange(data.ff, preset)
                            ).length;
                            return `
                            <div class="ttf-preset-item ${key === config.currentPreset ? 'active' : ''}" data-preset="${key}">
                                <div class="ttf-preset-color" style="background: ${preset.color}"></div>
                                <div class="ttf-preset-info">
                                    <div class="ttf-preset-title">${preset.name}</div>
                                    <div class="ttf-preset-details">${preset.description} | Available: ${matches}</div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Preset Configuration</h4>
                    <div class="ttf-preset-config">
                        <div class="ttf-config-row">
                            <label>Preset Name: <input type="text" id="presetName" value="${config.presets[config.currentPreset].name}"></label>
                            <label>Color: <input type="color" id="presetColor" value="${config.presets[config.currentPreset].color}"></label>
                        </div>
                        <div class="ttf-config-row">
                            <label>Min Fair Fight: <input type="number" id="presetMinFF" value="${config.presets[config.currentPreset].targetFF.min}" step="0.1" min="0" max="50"></label>
                            <label>Max Fair Fight: <input type="number" id="presetMaxFF" value="${config.presets[config.currentPreset].targetFF.max}" step="0.1" min="0" max="50"></label>
                        </div>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Action Settings</h4>
                    <div class="ttf-action-settings">
                        <label><input type="radio" name="actionType" value="attack" ${config.actionType === 'attack' ? 'checked' : ''}> Attack Target</label>
                        <label><input type="radio" name="actionType" value="profile" ${config.actionType === 'profile' ? 'checked' : ''}> View Profile</label>
                        <label><input type="checkbox" id="openInNewTab" ${config.openInNewTab ? 'checked' : ''}> Open in New Tab</label>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Statistics</h4>
                    <div class="ttf-stats">
                        <div class="ttf-stats-grid">
                            <div>Average FF: <span id="averageFF">${config.statistics.averageFF ? config.statistics.averageFF.toFixed(2) : 'N/A'}</span></div>
                            <div>Database Size: <span id="databaseSize">${config.statistics.databaseSize}</span></div>
                            <div>Data Updates: <span id="dataUpdates">${config.statistics.dataUpdates || 0}</span></div>
                            <div>Profiles Visited: <span id="profilesVisited">${config.statistics.profilesVisited}</span></div>
                        </div>
                        <button id="resetStats">Reset Statistics</button>
                    </div>
                </div>

                <div class="ttf-section">
                    <h4>Blacklist Management</h4>
                    <div class="ttf-blacklist">
                        <input type="number" id="blacklistInput" placeholder="User ID to blacklist">
                        <button id="addToBlacklist">Add</button>
                        <div class="ttf-blacklist-items">
                            ${config.blacklist.map(id => `<span class="ttf-blacklist-item">${id} <button onclick="removeFromBlacklist(${id})">×</button></span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        setupEventListeners(panel);
        return panel;
    }

    // Setup event listeners
    function setupEventListeners(panel) {
        // Close button
        panel.querySelector('.ttf-close').addEventListener('click', () => panel.style.display = 'none');

        // Collection settings
        panel.querySelector('#passiveCollection').addEventListener('change', (e) => {
            config.passiveCollection = e.target.checked;
            saveConfig();
            updateMainButton();
        });

        panel.querySelector('#validateOnVisit').addEventListener('change', (e) => {
            config.validateOnVisit = e.target.checked;
            saveConfig();
        });

        // Database management
        panel.querySelector('#exportDatabase').addEventListener('click', () => {
            const data = JSON.stringify(config.ffDatabase, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ff_database_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        // Preset selection
        panel.querySelectorAll('.ttf-preset-item').forEach(item => {
            item.addEventListener('click', () => {
                config.currentPreset = item.dataset.preset;
                saveConfig();
                updateMainButton();
                updatePresetConfig();
                
                // Update active state without recreating the entire panel
                panel.querySelectorAll('.ttf-preset-item').forEach(p => p.classList.remove('active'));
                item.classList.add('active');
                
                // Update the available counts for all presets
                panel.querySelectorAll('.ttf-preset-item').forEach(presetItem => {
                    const presetKey = presetItem.dataset.preset;
                    const preset = config.presets[presetKey];
                    const matches = Object.values(config.ffDatabase).filter(data =>
                        isFFInRange(data.ff, preset)
                    ).length;
                    const detailsEl = presetItem.querySelector('.ttf-preset-details');
                    if (detailsEl) {
                        detailsEl.textContent = `${preset.description} | Available: ${matches}`;
                    }
                });
            });
        });

        // Preset configuration
        ['presetName', 'presetColor', 'presetMinFF', 'presetMaxFF'].forEach(id => {
            panel.querySelector(`#${id}`).addEventListener('change', (e) => {
                const preset = config.presets[config.currentPreset];
                switch(id) {
                    case 'presetName':
                        preset.name = e.target.value;
                        break;
                    case 'presetColor':
                        preset.color = e.target.value;
                        break;
                    case 'presetMinFF':
                        preset.targetFF.min = parseFloat(e.target.value);
                        break;
                    case 'presetMaxFF':
                        preset.targetFF.max = parseFloat(e.target.value);
                        break;
                }
                preset.description = `FF ${preset.targetFF.min}-${preset.targetFF.max}`;
                saveConfig();
                updateMainButton();
                updateSettingsPanel();
            });
        });

        // Action settings
        panel.querySelectorAll('input[name="actionType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                config.actionType = e.target.value;
                saveConfig();
            });
        });

        panel.querySelector('#openInNewTab').addEventListener('change', (e) => {
            config.openInNewTab = e.target.checked;
            saveConfig();
        });

        // Statistics
        panel.querySelector('#resetStats').addEventListener('click', () => {
            config.statistics = {
                averageFF: 0,
                lastUsed: null,
                databaseSize: Object.keys(config.ffDatabase).length,
                profilesVisited: 0,
                dataUpdates: 0,
                ffScouterDetected: config.statistics.ffScouterDetected,
                ffDistribution: { easy: 0, medium: 0, hard: 0, extreme: 0 }
            };
            saveConfig();
            updateStatsDisplay();
        });

        // Blacklist
        panel.querySelector('#addToBlacklist').addEventListener('click', () => {
            const input = panel.querySelector('#blacklistInput');
            const id = parseInt(input.value);
            if (id && !config.blacklist.includes(id)) {
                config.blacklist.push(id);
                saveConfig();
                input.value = '';
                updateSettingsPanel();
            }
        });
    }

    // Event handlers
    function handleChainClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isDragging) return;

        const target = getSmartTarget();
        if (!target) {
            showToast('No suitable targets found. Visit more profiles to build your database!', 'warning');
            return;
        }

        const url = config.actionType === 'attack'
            ? `https://www.torn.com/loader.php?sid=attack&user2ID=${target.id}`
            : `https://www.torn.com/profiles.php?XID=${target.id}`;

        updateStats(target.ff);

        if (config.openInNewTab) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }

    function handlePresetCycle(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isDragging) return;

        const presetKeys = Object.keys(config.presets);
        const currentIndex = presetKeys.indexOf(config.currentPreset);
        const nextIndex = (currentIndex + 1) % presetKeys.length;
        config.currentPreset = presetKeys[nextIndex];
        saveConfig();
        updateMainButton();
    }

    function handleRightClick(e) {
        e.preventDefault();
        const panel = document.getElementById('tornTargetSettings');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function handleMouseDown(e) {
        if (e.button === 0) { // Left click
            isDragging = true;
            const button = document.getElementById('tornTargetFinder');
            const rect = button.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseMove(e) {
        if (!isDragging) return;

        const button = document.getElementById('tornTargetFinder');
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        config.position.x = Math.max(0, Math.min(window.innerWidth - 150, newX));
        config.position.y = Math.max(0, Math.min(window.innerHeight - 100, newY));

        button.style.left = config.position.x + 'px';
        button.style.top = config.position.y + 'px';
    }

    function handleMouseUp() {
        if (isDragging) {
            isDragging = false;
            saveConfig();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // Prevent click event after drag
            setTimeout(() => isDragging = false, 100);
        }
    }

    // Utility functions

    function updateMainButton() {
        const button = document.getElementById('tornTargetFinder');
        if (!button) return;

        const preset = config.presets[config.currentPreset];
        const dbSize = Object.keys(config.ffDatabase).length;

        let dbInfo;
        if (dbSize === 0) {
            dbInfo = "DB: Empty - Visit profiles first!";
        } else {
            const validTargets = Object.values(config.ffDatabase).filter(data =>
                data.ff !== 'no_data' && isFFInRange(data.ff, preset)
            ).length;
            dbInfo = `DB: ${dbSize} | Matches: ${validTargets}`;
        }

        const presetNameEl = button.querySelector('.ttf-preset-name');
        const presetDescEl = button.querySelector('.ttf-preset-desc');
        const dbInfoEl = button.querySelector('.ttf-database-info');

        if (presetNameEl) presetNameEl.textContent = preset.name;
        if (presetDescEl) presetDescEl.textContent = preset.description;
        if (dbInfoEl) dbInfoEl.textContent = dbInfo;

        button.style.setProperty('--preset-color', preset.color);
    }

    function updatePresetConfig() {
        const panel = document.getElementById('tornTargetSettings');
        if (!panel || panel.style.display === 'none') return;

        const preset = config.presets[config.currentPreset];
        panel.querySelector('#presetName').value = preset.name;
        panel.querySelector('#presetColor').value = preset.color;
        panel.querySelector('#presetMinFF').value = preset.targetFF.min;
        panel.querySelector('#presetMaxFF').value = preset.targetFF.max;
    }

    function updateSettingsPanel() {
        const panel = document.getElementById('tornTargetSettings');
        if (panel) {
            panel.remove();
            document.body.appendChild(createSettingsPanel());
        }
    }

    function updateStatsDisplay() {
        const panel = document.getElementById('tornTargetSettings');
        if (panel && panel.style.display !== 'none') {
            panel.querySelector('#averageFF').textContent = config.statistics.averageFF ? config.statistics.averageFF.toFixed(2) : 'N/A';
            panel.querySelector('#databaseSize').textContent = config.statistics.databaseSize;

            // Update fields if they exist
            const dataUpdatesEl = panel.querySelector('#dataUpdates');
            if (dataUpdatesEl) dataUpdatesEl.textContent = config.statistics.dataUpdates || 0;

            const profilesVisitedEl = panel.querySelector('#profilesVisited');
            if (profilesVisitedEl) profilesVisitedEl.textContent = config.statistics.profilesVisited;
        }

        // Update main button
        updateMainButton();
    }

    function showToast(message, type = 'default') {
        const toast = document.createElement('div');

        // Set colors and duration based on type
        let backgroundColor, borderColor, duration;
        switch (type) {
            case 'success':
                backgroundColor = '#1a4d2e';
                borderColor = '#28a745';
                duration = 4000;
                break;
            case 'info':
                backgroundColor = '#1a2332';
                borderColor = '#17a2b8';
                duration = 3500;
                break;
            case 'warning':
                backgroundColor = '#4d3319';
                borderColor = '#ffc107';
                duration = 5000;
                break;
            case 'subtle':
                backgroundColor = '#2a2a2a';
                borderColor = '#6c757d';
                duration = 2000;
                break;
            default:
                backgroundColor = '#1a1a1a';
                borderColor = '#444';
                duration = 4000;
        }

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 13px;
            max-width: 350px;
            border: 1px solid ${borderColor};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: opacity 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Stack multiple toasts
        const existingToasts = document.querySelectorAll('[style*="position: fixed"][style*="top: 20px"]');
        if (existingToasts.length > 1) {
            toast.style.top = (20 + (existingToasts.length - 1) * 60) + 'px';
        }

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Global function for blacklist removal
    window.removeFromBlacklist = function(id) {
        config.blacklist = config.blacklist.filter(item => item !== id);
        saveConfig();
        updateSettingsPanel();
    };

    // Add CSS styles
    function addStyles() {
        const styles = `
            #tornTargetFinder {
                --preset-color: ${config.presets[config.currentPreset].color};
            }

            .ttf-button {
                background: linear-gradient(135deg, var(--preset-color), color-mix(in srgb, var(--preset-color) 80%, black));
                color: white;
                padding: 10px 14px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                border: 2px solid rgba(255,255,255,0.2);
                min-width: 130px;
            }

            .ttf-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                border-color: rgba(255,255,255,0.4);
            }

            .ttf-preset {
                background: rgba(0,0,0,0.4);
                color: white;
                padding: 6px 8px;
                border-radius: 6px;
                font-size: 11px;
                text-align: left;
                margin-top: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid rgba(255,255,255,0.1);
                min-width: 130px;
            }

            .ttf-preset:hover {
                background: rgba(0,0,0,0.6);
                border-color: rgba(255,255,255,0.3);
                transform: scale(1.02);
            }

            .ttf-preset-name {
                font-weight: bold;
                margin-bottom: 2px;
            }

            .ttf-preset-desc {
                font-size: 9px;
                opacity: 0.8;
                margin-bottom: 2px;
            }

            .ttf-database-info {
                font-size: 8px;
                opacity: 0.7;
                color: #4CAF50;
            }

            .ttf-icon {
                font-size: 18px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
            }

            .ttf-text {
                font-weight: bold;
                font-size: 14px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }

            /* Blacklist button styles */
            .ttf-profile-blacklist-btn {
                background: linear-gradient(135deg, #dc3545, #c82333);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                margin: 8px 0;
                border: 1px solid rgba(255,255,255,0.2);
            }

            .ttf-profile-blacklist-btn:hover {
                background: linear-gradient(135deg, #c82333, #bd2130);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
                border-color: rgba(255,255,255,0.4);
            }

            .ttf-profile-blacklist-btn.blacklisted {
                background: linear-gradient(135deg, #28a745, #1e7e34);
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
            }

            .ttf-profile-blacklist-btn.blacklisted:hover {
                background: linear-gradient(135deg, #1e7e34, #1c7430);
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
            }

            .ttf-blacklist-icon {
                font-size: 14px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
            }

            .ttf-blacklist-text {
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }

            .ttf-settings {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                color: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                max-width: 700px;
                max-height: 85vh;
                overflow-y: auto;
                z-index: 10001;
                border: 1px solid #333;
            }

            .ttf-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                border-bottom: 2px solid #333;
                padding-bottom: 12px;
            }

            .ttf-header h3 {
                margin: 0;
                color: #f0f0f0;
                font-size: 20px;
            }

            .ttf-close {
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
            }

            .ttf-section {
                margin-bottom: 24px;
                padding: 16px;
                background: #242424;
                border-radius: 8px;
                border: 1px solid #333;
            }

            .ttf-section h4 {
                margin: 0 0 12px 0;
                color: #4CAF50;
                border-left: 4px solid #4CAF50;
                padding-left: 10px;
                font-size: 16px;
            }

            .ttf-status-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            .ttf-status-grid div {
                background: #2a2a2a;
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid #444;
                font-size: 13px;
            }

            .ttf-database-breakdown h5 {
                margin: 0 0 8px 0;
                color: #ffc107;
            }

            .ttf-db-bars .ttf-db-bar {
                background: #2a2a2a;
                padding: 6px 10px;
                margin: 4px 0;
                border-radius: 4px;
                border-left: 4px solid #666;
                font-size: 12px;
            }

            .ttf-db-bar.easy { border-left-color: #28a745; }
            .ttf-db-bar.medium { border-left-color: #ffc107; }
            .ttf-db-bar.hard { border-left-color: #fd7e14; }
            .ttf-db-bar.extreme { border-left-color: #dc3545; }
            .ttf-db-bar.no-data { border-left-color: #6c757d; }

            .ttf-how-it-works {
                background: #1a2332;
                border: 1px solid #2196F3;
                padding: 12px;
                border-radius: 6px;
                font-size: 13px;
            }

            .ttf-step {
                margin: 8px 0;
                color: #bbdefb;
                line-height: 1.4;
            }

            .ttf-preset-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                margin: 6px 0;
                background: #2a2a2a;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                border: 2px solid transparent;
            }

            .ttf-preset-item:hover {
                background: #333;
                border-color: #555;
            }

            .ttf-preset-item.active {
                background: #1565c0;
                border-color: #42a5f5;
            }

            .ttf-preset-color {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                flex-shrink: 0;
            }

            .ttf-preset-info {
                flex: 1;
            }

            .ttf-preset-title {
                font-weight: bold;
                font-size: 14px;
            }

            .ttf-preset-details {
                font-size: 12px;
                color: #aaa;
                margin-top: 2px;
            }

            .ttf-config-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin: 8px 0;
            }

            .ttf-config-row label {
                display: block;
                margin-bottom: 4px;
            }

            .ttf-collection-settings label, .ttf-action-settings label {
                display: block;
                margin: 10px 0;
                cursor: pointer;
            }

            .ttf-collection-settings input, .ttf-config-row input, .ttf-blacklist input {
                background: #333;
                border: 1px solid #555;
                color: white;
                padding: 6px 10px;
                border-radius: 4px;
                margin-left: 8px;
                width: 120px;
            }

            .ttf-collection-settings button {
                background: #17a2b8;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin: 4px 4px 4px 0;
                font-size: 12px;
            }

            .ttf-stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            .ttf-stats-grid div {
                background: #2a2a2a;
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid #444;
            }

            .ttf-stats button {
                background: #dc3545;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 12px;
            }

            .ttf-blacklist button {
                background: #28a745;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 8px;
            }

            .ttf-blacklist-items {
                margin-top: 12px;
            }

            .ttf-blacklist-item {
                display: inline-block;
                background: #555;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                margin: 4px 4px 4px 0;
                font-size: 12px;
            }

            .ttf-blacklist-item button {
                background: #dc3545;
                margin-left: 6px;
                padding: 2px 6px;
                font-size: 10px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Initialize the script
    function init() {
        addStyles();
        document.body.appendChild(createMainButton());
        document.body.appendChild(createSettingsPanel());
        updateMainButton();

        // Start passive collection if on a profile/attack page
        currentPage = detectCurrentPage();
        if (currentPage.userId) {
            collectFFData();
            addBlacklistButton(); // Add blacklist button on profile pages
        }

        // Set up page navigation detection
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                currentPage = detectCurrentPage();
                if (currentPage.userId && config.passiveCollection) {
                    collectFFData();
                    addBlacklistButton(); // Add blacklist button on profile pages
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();