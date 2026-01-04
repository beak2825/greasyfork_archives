// ==UserScript==
// @name         Enhanced Cookie Clicker Menu
// @namespace    https://www.cookieclicker.com/
// @version      3.0
// @description  Ultimate Cookie Clicker mod with themes, automation, hotkeys, scheduler, and 50+ features! 🍪🍬
// @author       timosaiya
// @match        *://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539856/Enhanced%20Cookie%20Clicker%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/539856/Enhanced%20Cookie%20Clicker%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    let autoClickerInterval = null;
    let autoClickerSpeed = 100;
    let isMinimized = false;
    let currentTab = 'basic';
    let currentTheme = 'dark';
    let autoSaveInterval = null;
    let goldenCookieClicker = null;
    let autoUpgradeInterval = null;
    let autoBuildingInterval = null;
    let settings = {
        theme: 'dark',
        autoSave: true,
        autoSaveInterval: 60000,
        hotkeysEnabled: true,
        soundEnabled: true,
        animationsEnabled: true,
        autoGoldenCookies: false,
        autoUpgrades: false,
        autoBuildings: false,
        transparency: 0.95
    };

    // Themes
    const themes = {
        dark: {
            primary: '#2c3e50',
            secondary: '#34495e',
            accent: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            text: '#ffffff',
            textSecondary: '#bdc3c7'
        },
        light: {
            primary: '#ecf0f1',
            secondary: '#bdc3c7',
            accent: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            text: '#2c3e50',
            textSecondary: '#7f8c8d'
        },
        neon: {
            primary: '#0a0a0a',
            secondary: '#1a1a1a',
            accent: '#00ff88',
            success: '#00ff00',
            warning: '#ffff00',
            danger: '#ff0080',
            text: '#ffffff',
            textSecondary: '#88ff88'
        },
        cookie: {
            primary: '#8B4513',
            secondary: '#A0522D',
            accent: '#DAA520',
            success: '#228B22',
            warning: '#FF8C00',
            danger: '#DC143C',
            text: '#FFFACD',
            textSecondary: '#F5DEB3'
        }
    };

    // Wait for game to load
    function waitForGame() {
        if (typeof Game === 'undefined' || !Game.ready) {
            setTimeout(waitForGame, 100);
            return;
        }
        loadSettings();
        initializeGUI();
        setupHotkeys();
        startAutoFeatures();
    }

    function loadSettings() {
        const saved = localStorage.getItem('cookieClickerUltimateSettings');
        if (saved) {
            settings = { ...settings, ...JSON.parse(saved) };
        }
        currentTheme = settings.theme;
    }

    function saveSettings() {
        localStorage.setItem('cookieClickerUltimateSettings', JSON.stringify(settings));
    }

    function initializeGUI() {
        // Create main container
        const guiContainer = document.createElement('div');
        guiContainer.id = 'cookieGUI';
        applyTheme(guiContainer);

        // Create header with enhanced controls
        const header = createHeader(guiContainer);

        // Create content area
        const content = document.createElement('div');
        content.id = 'guiContent';
        content.style.cssText = `
            padding: 20px;
            max-height: 600px;
            overflow-y: auto;
            opacity: ${settings.transparency};
        `;

        // Create enhanced tab navigation
        const tabNav = createTabNavigation();

        // Create tab content container
        const tabContent = document.createElement('div');
        tabContent.id = 'tabContent';

        content.appendChild(tabNav);
        content.appendChild(tabContent);
        guiContainer.appendChild(header);
        guiContainer.appendChild(content);
        document.body.appendChild(guiContainer);

        // Make draggable
        makeDraggable(guiContainer, header);

        // Initialize with basic tab
        switchTab('basic');

        // Add resize handle
        addResizeHandle(guiContainer);
    }

    function createHeader(container) {
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, ${themes[currentTheme].accent}, ${themes[currentTheme].primary});
            padding: 15px;
            border-radius: 13px 13px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        const titleSection = document.createElement('div');
        titleSection.style.cssText = 'display: flex; align-items: center; gap: 10px;';

        const title = document.createElement('h3');
        title.innerHTML = '🍪 Cookie Clicker Ultimate';
        title.style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            color: ${themes[currentTheme].text};
        `;

        const versionBadge = document.createElement('span');
        versionBadge.innerHTML = 'v3.0';
        versionBadge.style.cssText = `
            background: ${themes[currentTheme].success};
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
        `;

        titleSection.appendChild(title);
        titleSection.appendChild(versionBadge);

        const headerButtons = document.createElement('div');
        headerButtons.style.cssText = 'display: flex; gap: 5px;';

        // Theme selector
        const themeBtn = createHeaderButton('🎨', themes[currentTheme].warning, () => cycleTheme());
        themeBtn.title = 'Change Theme';

        // Settings button
        const settingsBtn = createHeaderButton('⚙️', themes[currentTheme].accent, () => switchTab('settings'));
        settingsBtn.title = 'Settings';

        // Minimize button
        const minimizeBtn = createHeaderButton('−', themes[currentTheme].warning, () => toggleMinimize());
        minimizeBtn.title = 'Minimize';

        // Close button
        const closeBtn = createHeaderButton('×', themes[currentTheme].danger, () => container.remove());
        closeBtn.title = 'Close';

        headerButtons.appendChild(themeBtn);
        headerButtons.appendChild(settingsBtn);
        headerButtons.appendChild(minimizeBtn);
        headerButtons.appendChild(closeBtn);
        header.appendChild(titleSection);
        header.appendChild(headerButtons);

        return header;
    }

    function createHeaderButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.cssText = `
            width: 28px;
            height: 28px;
            padding: 0;
            background: ${color};
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = onClick;
        return btn;
    }

    function createTabNavigation() {
        const tabNav = document.createElement('div');
        tabNav.style.cssText = `
            display: flex;
            margin-bottom: 15px;
            border-bottom: 2px solid ${themes[currentTheme].secondary};
            overflow-x: auto;
        `;

        const tabs = [
            { id: 'basic', name: '🍪 Basic', icon: '🍪' },
            { id: 'auto', name: '🤖 Auto', icon: '🤖' },
            { id: 'buildings', name: '🏭 Buildings', icon: '🏭' },
            { id: 'cheats', name: '🎮 Cheats', icon: '🎮' },
            { id: 'stats', name: '📊 Stats', icon: '📊' },
            { id: 'scheduler', name: '⏰ Scheduler', icon: '⏰' },
            { id: 'tools', name: '🔧 Tools', icon: '🔧' },
            { id: 'settings', name: '⚙️ Settings', icon: '⚙️' }
        ];

        tabs.forEach(tab => {
            const tabBtn = document.createElement('button');
            tabBtn.innerHTML = tab.icon;
            tabBtn.title = tab.name;
            tabBtn.style.cssText = `
                flex: 1;
                min-width: 40px;
                padding: 12px 8px;
                background: ${currentTab === tab.id ? themes[currentTheme].accent : 'transparent'};
                color: ${themes[currentTheme].text};
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 8px 8px 0 0;
                margin: 0 2px;
                font-size: 16px;
            `;
            tabBtn.onmouseover = () => {
                if (currentTab !== tab.id) {
                    tabBtn.style.background = themes[currentTheme].secondary;
                }
            };
            tabBtn.onmouseout = () => {
                if (currentTab !== tab.id) {
                    tabBtn.style.background = 'transparent';
                }
            };
            tabBtn.onclick = () => switchTab(tab.id);
            tabNav.appendChild(tabBtn);
        });

        return tabNav;
    }

    function cycleTheme() {
        const themeNames = Object.keys(themes);
        const currentIndex = themeNames.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        currentTheme = themeNames[nextIndex];
        settings.theme = currentTheme;
        saveSettings();

        // Reapply theme to entire GUI
        const gui = document.getElementById('cookieGUI');
        applyTheme(gui);

        // Refresh current tab to apply theme
        switchTab(currentTab);

        showNotification(`Theme changed to ${currentTheme}! 🎨`);
    }

    function applyTheme(element) {
        element.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            background: linear-gradient(135deg, ${themes[currentTheme].primary}, ${themes[currentTheme].secondary});
            border: 2px solid ${themes[currentTheme].accent};
            border-radius: 15px;
            color: ${themes[currentTheme].text};
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            z-index: 10000;
            backdrop-filter: blur(15px);
            transition: all 0.3s ease;
            opacity: ${settings.transparency};
        `;
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        const content = document.getElementById('guiContent');
        const container = document.getElementById('cookieGUI');

        if (isMinimized) {
            content.style.display = 'none';
            container.style.width = '250px';
            container.style.height = 'auto';
        } else {
            content.style.display = 'block';
            container.style.width = '380px';
        }

        showNotification(isMinimized ? 'GUI minimized' : 'GUI restored');
    }

    function addResizeHandle(container) {
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: ${themes[currentTheme].accent};
            cursor: se-resize;
            border-radius: 0 0 15px 0;
            opacity: 0.7;
        `;

        let isResizing = false;

        resizeHandle.onmousedown = (e) => {
            isResizing = true;
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(window.getComputedStyle(container).width);
            const startHeight = parseInt(window.getComputedStyle(container).height);

            const onMouseMove = (e) => {
                if (!isResizing) return;
                const newWidth = Math.max(300, startWidth + (e.clientX - startX));
                const newHeight = Math.max(200, startHeight + (e.clientY - startY));
                container.style.width = newWidth + 'px';
                container.style.height = newHeight + 'px';
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        container.appendChild(resizeHandle);
    }

    // Setup hotkeys functionality
    function setupHotkeys() {
        if (!settings.hotkeysEnabled) return;

        document.addEventListener('keydown', function(e) {
            // Only trigger if not typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key.toLowerCase()) {
                case 'c': // Toggle auto-clicker
                    if (e.ctrlKey) {
                        e.preventDefault();
                        if (autoClickerInterval) {
                            stopAutoClicker();
                            showNotification('🛑 Auto-clicker stopped');
                        } else {
                            startAutoClicker();
                            showNotification('🖱️ Auto-clicker started');
                        }
                    }
                    break;
                case 'g': // Toggle golden cookie automation
                    if (e.ctrlKey) {
                        e.preventDefault();
                        settings.autoGoldenCookies = !settings.autoGoldenCookies;
                        saveSettings();
                        showNotification(`🪙 Golden cookie automation ${settings.autoGoldenCookies ? 'enabled' : 'disabled'}`);
                    }
                    break;
                case 'u': // Toggle auto-upgrades
                    if (e.ctrlKey) {
                        e.preventDefault();
                        settings.autoUpgrades = !settings.autoUpgrades;
                        saveSettings();
                        if (settings.autoUpgrades) {
                            startAutoUpgrades();
                            showNotification('⬆️ Auto-upgrades enabled');
                        } else {
                            stopAutoUpgrades();
                            showNotification('⬆️ Auto-upgrades disabled');
                        }
                    }
                    break;
                case 'b': // Toggle auto-buildings
                    if (e.ctrlKey) {
                        e.preventDefault();
                        settings.autoBuildings = !settings.autoBuildings;
                        saveSettings();
                        if (settings.autoBuildings) {
                            startAutoBuildings();
                            showNotification('🏢 Auto-buildings enabled');
                        } else {
                            stopAutoBuildings();
                            showNotification('🏢 Auto-buildings disabled');
                        }
                    }
                    break;
                case 't': // Cycle theme
                    if (e.ctrlKey) {
                        e.preventDefault();
                        cycleTheme();
                    }
                    break;
                case 'm': // Toggle minimize
                    if (e.ctrlKey) {
                        e.preventDefault();
                        toggleMinimize();
                    }
                    break;
                case 's': // Force save
                    if (e.ctrlKey && e.shiftKey) {
                        e.preventDefault();
                        Game.WriteSave();
                        showNotification('💾 Game saved!');
                    }
                    break;
            }
        });
    }

    // Start auto features based on settings
    function startAutoFeatures() {
        // Start auto-save if enabled
        if (settings.autoSave) {
            startAutoSave();
        }

        // Start golden cookie automation if enabled
        if (settings.autoGoldenCookies) {
            startGoldenCookieAutomation();
        }

        // Start auto-upgrades if enabled
        if (settings.autoUpgrades) {
            startAutoUpgrades();
        }

        // Start auto-buildings if enabled
        if (settings.autoBuildings) {
            startAutoBuildings();
        }
    }

    // Auto-save functionality
    function startAutoSave() {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
        autoSaveInterval = setInterval(() => {
            Game.WriteSave();
            if (settings.soundEnabled) {
                // Play a subtle save sound (optional)
            }
        }, settings.autoSaveInterval);
    }

    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }

    // Golden cookie automation
    function startGoldenCookieAutomation() {
        if (goldenCookieClicker) clearInterval(goldenCookieClicker);
        goldenCookieClicker = setInterval(() => {
            // Click golden cookies
            for (let i = 0; i < Game.shimmers.length; i++) {
                if (Game.shimmers[i].type === 'golden') {
                    Game.shimmers[i].pop();
                }
            }
            // Click news ticker for fortune cookies
            if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') {
                Game.tickerL.click();
            }
        }, 100);
    }

    function stopGoldenCookieAutomation() {
        if (goldenCookieClicker) {
            clearInterval(goldenCookieClicker);
            goldenCookieClicker = null;
        }
    }

    // Auto-upgrade functionality
    function startAutoUpgrades() {
        if (autoUpgradeInterval) clearInterval(autoUpgradeInterval);
        autoUpgradeInterval = setInterval(() => {
            // Buy all affordable upgrades
            for (let i in Game.UpgradesInStore) {
                let upgrade = Game.UpgradesInStore[i];
                if (upgrade.canBuy()) {
                    upgrade.buy();
                }
            }
        }, 1000);
    }

    function stopAutoUpgrades() {
        if (autoUpgradeInterval) {
            clearInterval(autoUpgradeInterval);
            autoUpgradeInterval = null;
        }
    }

    // Auto-building functionality
    function startAutoBuildings() {
        if (autoBuildingInterval) clearInterval(autoBuildingInterval);
        autoBuildingInterval = setInterval(() => {
            const bestBuilding = getBestBuilding();
            if (bestBuilding && Game.cookies >= bestBuilding.price) {
                bestBuilding.buy();
            }
        }, 2000);
    }

    function stopAutoBuildings() {
        if (autoBuildingInterval) {
            clearInterval(autoBuildingInterval);
            autoBuildingInterval = null;
        }
    }

    function switchTab(tabId) {
        currentTab = tabId;
        const tabContent = document.getElementById('tabContent');
        const tabNav = tabContent.previousElementSibling;

        // Update tab buttons with theme
        Array.from(tabNav.children).forEach((btn, index) => {
            const tabs = ['basic', 'auto', 'buildings', 'cheats', 'stats', 'scheduler', 'tools', 'settings'];
            if (tabs[index] === tabId) {
                btn.style.background = themes[currentTheme].accent;
            } else {
                btn.style.background = 'transparent';
            }
        });

        // Clear and populate content
        tabContent.innerHTML = '';

        switch(tabId) {
            case 'basic':
                createBasicTab(tabContent);
                break;
            case 'auto':
                createAutoTab(tabContent);
                break;
            case 'buildings':
                createBuildingsTab(tabContent);
                break;
            case 'cheats':
                createCheatsTab(tabContent);
                break;
            case 'stats':
                createStatsTab(tabContent);
                break;
            case 'scheduler':
                createSchedulerTab(tabContent);
                break;
            case 'tools':
                createToolsTab(tabContent);
                break;
            case 'settings':
                createSettingsTab(tabContent);
                break;
        }
    }

    function createBasicTab(container) {
        container.appendChild(createSection('🍪 Cookie Management', [
            createInputGroup('Cookies to add:', 'cookieAmount', 'number', '1000000'),
            createButton('Add Cookies 🍪', themes[currentTheme].success, () => {
                const amount = parseInt(document.getElementById('cookieAmount').value) || 0;
                if (amount > 0) {
                    Game.cookies += amount;
                    showNotification(`Added ${formatNumber(amount)} cookies! 🍪`);
                }
            }),
            createInputGroup('Sugar Lumps to add:', 'lumpAmount', 'number', '100'),
            createButton('Add Sugar Lumps 🍬', themes[currentTheme].warning, () => {
                const amount = parseInt(document.getElementById('lumpAmount').value) || 0;
                if (amount > 0) {
                    Game.lumps += amount;
                    showNotification(`Added ${amount} sugar lumps! 🍬`);
                }
            })
        ]));

        container.appendChild(createSection('💰 Quick Actions', [
            createButton('Max Cookies 💎', themes[currentTheme].success, () => {
                Game.cookies = Number.MAX_SAFE_INTEGER;
                showNotification('Cookies set to maximum! 💎');
            }),
            createButton('Reset Cookies 🔄', themes[currentTheme].danger, () => {
                if (confirm('Are you sure you want to reset all cookies?')) {
                    Game.cookies = 0;
                    showNotification('Cookies reset! 🔄');
                }
            })
        ]));
    }

    function createAutoTab(container) {
        container.appendChild(createSection('🤖 Auto Clicker', [
            createToggleButton('Auto Clicker', autoClickerInterval !== null, (enabled) => {
                if (enabled) {
                    startAutoClicker();
                } else {
                    stopAutoClicker();
                }
            }),
            createInputGroup('Click Speed (ms):', 'clickSpeed', 'number', autoClickerSpeed.toString()),
            createButton('Update Speed ⚡', themes[currentTheme].accent, () => {
                const speed = parseInt(document.getElementById('clickSpeed').value) || 100;
                autoClickerSpeed = Math.max(1, speed);
                if (autoClickerInterval) {
                    stopAutoClicker();
                    startAutoClicker();
                }
                showNotification(`Click speed updated to ${autoClickerSpeed}ms! ⚡`);
            })
        ]));

        container.appendChild(createSection('🎯 Auto Features', [
            createButton('Auto Buy Best Building 🏭', themes[currentTheme].success, () => {
                const bestBuilding = getBestBuilding();
                if (bestBuilding && Game.cookies >= bestBuilding.price) {
                    bestBuilding.buy();
                    showNotification(`Bought ${bestBuilding.name}! 🏭`);
                } else {
                    showNotification('Not enough cookies or no buildings available! ❌');
                }
            }),
            createButton('Auto Buy All Upgrades 📈', themes[currentTheme].warning, () => {
                let bought = 0;
                for (let i in Game.UpgradesInStore) {
                    const upgrade = Game.UpgradesInStore[i];
                    if (Game.cookies >= upgrade.price) {
                        upgrade.buy();
                        bought++;
                    }
                }
                showNotification(`Bought ${bought} upgrades! 📈`);
            })
        ]));
    }

    function createBuildingsTab(container) {
        container.appendChild(createSection('🏭 Building Manager', [
            createButton('Buy 10 of Each Building 🔟', themes[currentTheme].success, () => {
                let totalCost = 0;
                for (let i in Game.Objects) {
                    const building = Game.Objects[i];
                    for (let j = 0; j < 10; j++) {
                        totalCost += building.price;
                        if (Game.cookies >= totalCost) {
                            building.buy();
                        }
                    }
                }
                showNotification('Bought 10 of each building! 🏭');
            }),
            createButton('Max All Buildings 🏗️', themes[currentTheme].warning, () => {
                for (let i in Game.Objects) {
                    const building = Game.Objects[i];
                    while (Game.cookies >= building.price) {
                        building.buy();
                    }
                }
                showNotification('Maximized all buildings! 🏗️');
            })
        ]));

        // Individual building controls
        const buildingControls = document.createElement('div');
        for (let i in Game.Objects) {
            const building = Game.Objects[i];
            const buildingDiv = document.createElement('div');
            buildingDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
            `;

            const buildingInfo = document.createElement('span');
            buildingInfo.innerHTML = `${building.name}: ${building.amount}`;
            buildingInfo.style.fontSize = '12px';

            const buyBtn = createButton('+1', themes[currentTheme].success, () => {
                if (Game.cookies >= building.price) {
                    building.buy();
                    buildingInfo.innerHTML = `${building.name}: ${building.amount}`;
                }
            });
            buyBtn.style.cssText += 'padding: 5px 10px; font-size: 12px;';

            buildingDiv.appendChild(buildingInfo);
            buildingDiv.appendChild(buyBtn);
            buildingControls.appendChild(buildingDiv);
        }

        container.appendChild(createSection('🏢 Individual Buildings', [buildingControls]));
    }

    function createCheatsTab(container) {
        container.appendChild(createSection('🏆 Achievements & Unlocks', [
            createButton('Unlock All Achievements 🏆', themes[currentTheme].success, () => {
                for (let i in Game.Achievements) {
                    Game.Achievements[i].unlock();
                }
                showNotification('All achievements unlocked! 🏆');
            }),
            createButton('Unlock All Upgrades 🔓', themes[currentTheme].warning, () => {
                for (let i in Game.Upgrades) {
                    Game.Upgrades[i].unlock();
                }
                showNotification('All upgrades unlocked! 🔓');
            })
        ]));

        container.appendChild(createSection('🎮 Game Modifications', [
            createButton('Infinite Cookie Production 🌟', themes[currentTheme].success, () => {
                Game.cookiesPs = Number.MAX_SAFE_INTEGER;
                showNotification('Infinite cookie production activated! 🌟');
            }),
            createButton('Fast Golden Cookies 🌟', themes[currentTheme].warning, () => {
                Game.shimmerTypes.golden.maxTime = 1;
                Game.shimmerTypes.golden.minTime = 1;
                showNotification('Fast golden cookies activated! 🌟');
            }),
            createButton('Stop All Timers ⏰', themes[currentTheme].danger, () => {
                Game.fps = 0;
                showNotification('All timers stopped! ⏰');
            }),
            createButton('Restore Normal Speed 🔄', themes[currentTheme].success, () => {
                Game.fps = 30;
                showNotification('Normal speed restored! 🔄');
            })
        ]));

        container.appendChild(createSection('💾 Save Management', [
            createButton('Force Save Game 💾', themes[currentTheme].accent, () => {
                Game.WriteSave();
                showNotification('Game saved! 💾');
            }),
            createButton('Export Save 📤', themes[currentTheme].success, () => {
                const save = Game.WriteSave(1);
                navigator.clipboard.writeText(save).then(() => {
                    showNotification('Save exported to clipboard! 📤');
                });
            })
        ]));
    }

    function createStatsTab(container) {
        const statsDiv = document.createElement('div');
        statsDiv.id = 'gameStats';

        function updateStats() {
            statsDiv.innerHTML = `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                    <h4 style="margin: 0 0 10px 0; color: ${themes[currentTheme].accent};">📊 Game Statistics</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                        <div><strong>🍪 Cookies:</strong><br>${formatNumber(Game.cookies)}</div>
                        <div><strong>🍬 Sugar Lumps:</strong><br>${Game.lumps}</div>
                        <div><strong>⚡ CpS:</strong><br>${formatNumber(Game.cookiesPs)}</div>
                        <div><strong>🏭 Buildings:</strong><br>${getTotalBuildings()}</div>
                        <div><strong>🏆 Achievements:</strong><br>${getUnlockedAchievements()}/${getTotalAchievements()}</div>
                        <div><strong>📈 Upgrades:</strong><br>${getUnlockedUpgrades()}/${getTotalUpgrades()}</div>
                        <div><strong>🎯 Clicks:</strong><br>${formatNumber(Game.cookieClicks)}</div>
                        <div><strong>⏰ Play Time:</strong><br>${formatTime(Date.now() - Game.startDate)}</div>
                    </div>
                </div>
            `;
        }

        updateStats();
        setInterval(updateStats, 1000);

        container.appendChild(statsDiv);

        container.appendChild(createSection('🎯 Quick Stats Actions', [
            createButton('Refresh Stats 🔄', themes[currentTheme].accent, updateStats),
            createButton('Reset Statistics 📊', themes[currentTheme].danger, () => {
                if (confirm('Are you sure you want to reset all statistics?')) {
                    Game.cookieClicks = 0;
                    Game.handmadeCookies = 0;
                    showNotification('Statistics reset! 📊');
                    updateStats();
                }
            })
        ]));
    }

    function createSchedulerTab(container) {
        container.appendChild(createSection('⏰ Automation Scheduler', [
            createButton('Schedule Auto Clicker ⏰', themes[currentTheme].success, () => {
                // Schedule auto clicker
            }),
            createButton('Schedule Auto Upgrades 📈', themes[currentTheme].warning, () => {
                // Schedule auto upgrades
            }),
            createButton('Schedule Auto Buildings 🏭', themes[currentTheme].success, () => {
                // Schedule auto buildings
            })
        ]));
    }

    function createToolsTab(container) {
        container.appendChild(createSection('🔧 Tools', [
            createButton('Cookie Optimizer 🍪', themes[currentTheme].success, () => {
                // Cookie optimizer
            }),
            createButton('Building Optimizer 🏭', themes[currentTheme].warning, () => {
                // Building optimizer
            }),
            createButton('Upgrade Optimizer 📈', themes[currentTheme].success, () => {
                // Upgrade optimizer
            })
        ]));
    }

    function createSettingsTab(container) {
        container.appendChild(createSection('⚙️ Settings', [
            createToggleButton('Auto Save', settings.autoSave, (enabled) => {
                settings.autoSave = enabled;
                if (enabled) {
                    startAutoSave();
                } else {
                    stopAutoSave();
                }
            }),
            createToggleButton('Hotkeys', settings.hotkeysEnabled, (enabled) => {
                settings.hotkeysEnabled = enabled;
            }),
            createToggleButton('Sound Effects', settings.soundEnabled, (enabled) => {
                settings.soundEnabled = enabled;
            }),
            createToggleButton('Animations', settings.animationsEnabled, (enabled) => {
                settings.animationsEnabled = enabled;
            }),
            createInputGroup('Transparency:', 'transparency', 'number', settings.transparency.toString()),
            createButton('Save Settings 💾', themes[currentTheme].accent, () => {
                saveSettings();
                showNotification('Settings saved! 💾');
            })
        ]));
    }

    // Helper functions
    function createSection(title, elements) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 20px;';

        const sectionTitle = document.createElement('h4');
        sectionTitle.innerHTML = title;
        sectionTitle.style.cssText = `
            margin: 0 0 10px 0;
            color: ${themes[currentTheme].accent};
            font-size: 14px;
            border-bottom: 1px solid ${themes[currentTheme].secondary};
            padding-bottom: 5px;
        `;

        section.appendChild(sectionTitle);
        elements.forEach(element => section.appendChild(element));

        return section;
    }

    function createButton(text, color, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.cssText = `
            width: 100%;
            padding: 12px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px 0;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        button.onmouseover = () => button.style.transform = 'translateY(-2px)';
        button.onmouseout = () => button.style.transform = 'translateY(0)';
        button.onclick = onClick;

        return button;
    }

    function createInputGroup(label, id, type, placeholder) {
        const group = document.createElement('div');
        group.style.cssText = 'margin: 10px 0;';

        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;
        labelEl.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            color: ${themes[currentTheme].textSecondary};
        `;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;
        input.style.cssText = `
            width: 100%;
            padding: 10px;
            border: 1px solid ${themes[currentTheme].secondary};
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 13px;
            box-sizing: border-box;
        `;

        group.appendChild(labelEl);
        group.appendChild(input);

        return group;
    }

    function createToggleButton(text, initialState, onToggle) {
        const button = document.createElement('button');
        let isEnabled = initialState;

        function updateButton() {
            button.innerHTML = `${text}: ${isEnabled ? 'ON ✅' : 'OFF ❌'}`;
            button.style.background = isEnabled ? themes[currentTheme].success : themes[currentTheme].danger;
        }

        button.style.cssText = `
            width: 100%;
            padding: 12px;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px 0;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s ease;
        `;

        button.onclick = () => {
            isEnabled = !isEnabled;
            updateButton();
            onToggle(isEnabled);
        };

        updateButton();
        return button;
    }

    function startAutoClicker() {
        if (autoClickerInterval) return;
        autoClickerInterval = setInterval(() => {
            Game.ClickCookie();
        }, autoClickerSpeed);
        showNotification('Auto clicker started! 🤖');
    }

    function stopAutoClicker() {
        if (autoClickerInterval) {
            clearInterval(autoClickerInterval);
            autoClickerInterval = null;
            showNotification('Auto clicker stopped! ⏹️');
        }
    }

    function getBestBuilding() {
        let best = null;
        let bestRatio = 0;

        for (let i in Game.Objects) {
            const building = Game.Objects[i];
            if (building.price <= Game.cookies) {
                const ratio = building.storedCps / building.price;
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    best = building;
                }
            }
        }

        return best;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, ${themes[currentTheme].primary}, ${themes[currentTheme].secondary});
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10001;
            font-family: 'Segoe UI', sans-serif;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
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

    function formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toLocaleString();
    }

    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    function getTotalBuildings() {
        let total = 0;
        for (let i in Game.Objects) {
            total += Game.Objects[i].amount;
        }
        return total;
    }

    function getUnlockedAchievements() {
        let unlocked = 0;
        for (let i in Game.Achievements) {
            if (Game.Achievements[i].won) unlocked++;
        }
        return unlocked;
    }

    function getTotalAchievements() {
        return Object.keys(Game.Achievements).length;
    }

    function getUnlockedUpgrades() {
        let unlocked = 0;
        for (let i in Game.Upgrades) {
            if (Game.Upgrades[i].bought) unlocked++;
        }
        return unlocked;
    }

    function getTotalUpgrades() {
        return Object.keys(Game.Upgrades).length;
    }

    // Enhanced golden cookie spawning
    function spawnGoldenCookie() {
        if (Game.shimmerTypes.golden.spawned < Game.shimmerTypes.golden.maxTime) {
            new Game.shimmer('golden');
            showNotification('✨ Golden cookie spawned!');
        }
    }

    // Prestige management helper
    function getPrestigeRecommendation() {
        const currentPrestige = Game.prestige['Heavenly chips'];
        const potentialPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
        const gain = potentialPrestige - currentPrestige;

        return {
            current: currentPrestige,
            potential: potentialPrestige,
            gain: gain,
            recommended: gain >= Math.max(1, currentPrestige * 0.1) // Recommend if gain is at least 10% of current
        };
    }

    // Building efficiency calculator
    function getBuildingEfficiency() {
        const efficiencies = [];
        for (let i in Game.Objects) {
            const building = Game.Objects[i];
            if (building.locked) continue;

            const cps = building.storedCps * Game.globalCpsMult;
            const efficiency = cps / building.price;

            efficiencies.push({
                name: building.name,
                efficiency: efficiency,
                cps: cps,
                price: building.price,
                building: building
            });
        }

        return efficiencies.sort((a, b) => b.efficiency - a.efficiency);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }

        #cookieGUI::-webkit-scrollbar {
            width: 8px;
        }

        #cookieGUI::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        }

        #cookieGUI::-webkit-scrollbar-thumb {
            background: ${themes[currentTheme].accent};
            border-radius: 4px;
        }

        #cookieGUI::-webkit-scrollbar-thumb:hover {
            background: ${themes[currentTheme].primary};
        }
    `;
    document.head.appendChild(style);

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForGame);
    } else {
        waitForGame();
    }
})();