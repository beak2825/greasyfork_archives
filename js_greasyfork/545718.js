// ==UserScript==
// @name         LWM The One Script
// @author       ImmortalRegis
// @namespace    https://www.lordswm.com/pl_info.php?id=6736731
// @version      v0.1
// @description  Will keep track of all your needs. Timer or otherwise.
// @match        https://www.lordswm.com/*
// @match        https://www.heroeswm.ru/*
// @grant		 GM.notification
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545718/LWM%20The%20One%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/545718/LWM%20The%20One%20Script.meta.js
// ==/UserScript==
/*


@grant unsafeWindow -is required to grab the thieves guild timer. to parse the war.php pages. i've disabled this method for now alternative method is better because it detects losses as well.
@grant GM.notification -this is for the windows notification.

Join the discord to give me feedback - https://discord.com/invite/mbYt5TT

If you really like the script, gifts are welcome - https://www.lordswm.com/pl_info.php?id=6736731
*/
(function () {
    'use strict';

    // ========== Schedules Constants ==========

    const MODULES = {
        hunt: {
            name: 'Hunters Guild',
            enabledKey: 'mod_hunt_enabled',
            alertKey: 'mod_hunt_alert',
            timerKey: 'mod_hunt_timer',
            lastCheckedKey: 'mod_hunt_last_checked',
            notifiedKey: 'mod_hunt_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl:'/map.php'
        },
        mg: {
            name: 'Mercenaries Guild',
            enabledKey: 'mod_mg_enabled',
            alertKey: 'mod_mg_alert',
            timerKey: 'mod_mg_timer',
            lastCheckedKey: 'mod_mg_last_checked',
            notifiedKey: 'mod_mg_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mercenary_guild.php'
        },
        laborers: {
            name: 'Laborers Guild',
            enabledKey: 'mod_labor_enabled',
            alertKey: 'mod_labor_alert',
            timerKey: 'mod_labor_timer',
            lastCheckedKey: 'mod_labor_last_checked',
            notifiedKey: 'mod_labor_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/map.php'
        },
        smith: {
            name: 'Smiths Guild',
            enabledKey: 'mod_smith_enabled',
            alertKey: 'mod_smith_alert',
            timerKey: 'mod_smith_timer',
            lastCheckedKey: 'mod_smith_last_checked',
            notifiedKey: 'mod_smith_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mod_workbench.php'
        },
        enchant: {
            name: 'Enchanters Guild',
            enabledKey: 'mod_enchant_enabled',
            alertKey: 'mod_enchant_alert',
            timerKey: 'mod_enchant_timer',
            lastCheckedKey: 'mod_enchant_last_checked',
            notifiedKey: 'mod_enchant_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mod_workbench.php'
        },
        thieves: {
            name: 'Thieves Guild',
            enabledKey: 'mod_thieves_enabled',
            alertKey: 'mod_thieves_alert',
            timerKey: 'mod_thieves_timer',
            lastCheckedKey: 'mod_thieves_checked',
            notifiedKey: 'mod_thieves_notified',
            lastWarIdKey: 'mod_thieves_last_warid', //this will parse the battle page, needs unsafe window
            showInPanel: true,
            defaultEnabled: true,
            defaultAlert: true,
            moduleUrl: '/map.php',
        },
    };

    const PLAYERINFO = {
        premiumKey: 'player_premium_status',
        signValue: 'player_sign_value'
    };

    const WINDOWS_NOTIFICATION_ENABLE = true; //true would give windows notifications

    let minimized = false;

    const recheckCooldownShort = 2 * 60 * 1000; //2 minutes cooldown used for HG and MG
    const recheckCooldownMedium = 10 * 60 * 1000; //10 minutes cooldown used for TG
    const recheckCooldownLong = 15 * 60 * 1000; //15 min cooldown for smith or enchant pages

    const setFlag = (key, val) => {
        localStorage.setItem(key, JSON.stringify(val));
        if (key === BRCFLAGS.setSaved || key === BRCFLAGS.isReady || key === BRCFLAGS.setName) {
            updatePanelStatus(); // live update
        }
    };

    const getFlag = (key, def = null) => {
        const val = JSON.parse(localStorage.getItem(key) || JSON.stringify(def));
        return val;
    };
    // Mimic getValue using localStorage
    const getValue = async (key, defaultValue = null) => {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? defaultValue : JSON.parse(raw);
        } catch (e) {
            console.warn(`Failed to parse stored value for "${key}":`, e);
            return defaultValue;
        }
    };

    // Mimic setValue using localStorage
    const setValue = async (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Failed to store value for "${key}":`, e);
        }
    };



    // ========== UI Elements ==========

    function createPanel() {
        let panel = document.getElementById('lwm_scheduler_panel');
        if (panel) {
            panel.remove();
        }
        panel = document.createElement('div');
        panel.id = 'lwm_scheduler_panel';
        panel.className = 'lwm_custom_container';
        panel.innerHTML = `
            <div class="lwm_custom_decor_top"></div>
            <div class="lwm_custom_decor_bottom"></div>
		    <div class="lwm_custom_header" id="lwm-header">
            <strong id="lwm-title" title="Minimize Panel">Schedules </strong>
            <span id="lwm-settings" title="Settings">&#9881;</span>
            </div>
            <div id="lwm-modules"></div>
        `;
        document.body.appendChild(panel);
        setupListeners();
        document.getElementById('lwm-modules').style.display = minimized ? 'none' : 'block';
        document.getElementById('lwm-title').textContent = minimized ? 'Schedules ▽' : 'Schedules 🜂';
        document.getElementById('lwm-title').title= minimized ? 'Show Panel' : 'Hide Panel';
    }

    function setupListeners() {
        const title = document.getElementById('lwm-title');
        title.addEventListener('click', () => {
            minimized = !minimized;
            title.textContent = minimized ? 'Schedules ▽' : 'Schedules 🜂';
            title.title= minimized ? 'Show Panel' : 'Hide Panel';
            setValue('panel_minimized', minimized);
            document.getElementById('lwm-modules').style.display = minimized ? 'none' : 'block';
        });
        document.getElementById('lwm-settings').addEventListener('click', showSettingsPopup);
    }

    function showSettingsPopup() {
        let modal = document.getElementById('lwm-settings-popup');
        if (modal) {
            modal.remove();
            return;
        }
        modal = document.createElement('div');
        modal.id = 'lwm-settings-popup';

        modal.className = 'lwm_custom_container lwm_custom_popup_centered';
        modal.innerHTML = `
            <div>
                <h3>Module Settings</h3>
                <strong>Timer Modules</strong>
                <div id="lwm-settings-list"></div>
                <button id="close-settings">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        renderSettingsList();
        document.getElementById('close-settings').addEventListener('click', () => modal.remove());
    }

    async function renderSettingsList() {
        const list = document.getElementById('lwm-settings-list');
        list.innerHTML = '';
        for (const [key, mod] of Object.entries(MODULES)) {
            const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
            const alertEnabled = await getValue(mod.alertKey, mod.defaultAlert);

            const div = document.createElement('div');
            div.innerHTML = `
                <label>
                    <input type="checkbox" data-key="${key}" data-type="enabled" ${enabled ? 'checked' : ''}>
                    Enable ${mod.name}
                </label>
                <label>
                    <input type="checkbox" data-key="${key}" data-type="alert" ${alertEnabled ? 'checked' : ''}>
                    Alert for ${mod.name}
                </label>
            `;
            list.appendChild(div);
        }

        list.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', async (e) => {
                const modKey = e.target.dataset.key;
                const type = e.target.dataset.type;
                const storageKey = type === 'enabled' ? MODULES[modKey].enabledKey : MODULES[modKey].alertKey;
                await setValue(storageKey, e.target.checked);
                if (type === 'enabled') renderModules(); // Refresh modules in panel
            });
        });
        renderOtherSettings();

    }

    // ========== Module UI & Logic ==========

    async function renderModules() {
        const container = document.getElementById('lwm-modules');
        container.innerHTML = '';

        for (const [key, mod] of Object.entries(MODULES)) {
            const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
            if (!enabled) continue;

            const timeLeft = await getTimeLeft(mod.timerKey);
            const div = document.createElement('div');
            div.className = 'lwm_custom_module';
            div.innerHTML = `
                <div><strong>${mod.name}</strong></div>
                <div id="status-${key}">Time left: ${formatTime(timeLeft)}</div>
            `;

            div.addEventListener('click', () => {
                if (key === 'hunt' || key === 'mg'){
                    if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                        void guildPointsThresholdEnabled (key, HG_MG_GOANYWAY, HG_MG_ENABLESKIP, false );
                    } else
                    {
                        const url = mod.moduleUrl;
                        if (url) {
                            window.location.href = url;
                        }
                    }
                }
                else {
                    const url = mod.moduleUrl;
                    if (url) {
                        window.location.href = url;
                    }
                }
            });
            container.appendChild(div);
            startModuleCountdown(key, mod);
        }
        await renderOtherModules();
    }

    async function startModuleCountdown(key, mod) {
        const statusEl = document.getElementById(`status-${key}`);
        const timerKey = mod.timerKey;
        const alertKey = mod.alertKey;
        const notifiedKey = mod.notifiedKey;

        const interval = setInterval(async () => {
            const now = Date.now();
            const stored = await getValue(timerKey);

            // Handle special cases: if stored is not a valid number
            const availableAt = +stored;
            if (isNaN(availableAt)) {
                clearInterval(interval);
                statusEl.textContent = stored; // Directly display status string
                return;
            }

            const timeLeft = Math.max(0, availableAt - now);

            if (timeLeft <= 0) {
                clearInterval(interval);
                statusEl.textContent = 'Ready!';

                const alertEnabled = await getValue(alertKey, mod.defaultAlert);
                const alreadyNotified = await getValue(notifiedKey, false);

                if (key === 'hunt' || key === 'mg') {
                    if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                        void guildPointsThresholdEnabled(key, HG_MG_GOANYWAY, HG_MG_ENABLESKIP, HG_MG_NOALERTS);
                    } else if (alertEnabled && !alreadyNotified) {
                        setValue(notifiedKey, true);
                        const confirmJump = confirm(`⏰ ${mod.name} is ready! Go now?`);
                        if (confirmJump) {
                            const url = mod.moduleUrl;
                            if (url) window.location.href = url;
                        }
                    }
                }
                else if (alertEnabled && !alreadyNotified) {
                    setValue(notifiedKey, true);

                    if (WINDOWS_NOTIFICATION_ENABLE)
                    {
                        GM.notification({
                            title: "LWM Timers Panel",
                            text: "Your " + mod.name + " timer is ready!",
                            timeout: 10000, // in milliseconds (510 seconds)
                            onclick: function() {
                                window.focus(); // bring browser window to front when clicked
                            },
                            //image: "https://www.lordswm.com/i/icon_hunters.gif" // optional
                        });
                    }
                    else {
                        const confirmJump = confirm(`⏰ ${mod.name} is ready! Go now?`);
                        if (confirmJump) {
                            const url = mod.moduleUrl;
                            if (url) window.location.href = url;
                        }
                    }
                }



                //alert(`🛠️ ${mod.name} status: Ready!`);
                //setValue(notifiedKey, true);
            }
            else {
                statusEl.textContent = 'Time left: ' + formatTime(timeLeft);
            }
        }, 1000);
    }

    async function getTimeLeft(timerKey) {
        const target = await getValue(timerKey, 0);
        return Math.max(0, target - Date.now());
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    async function fetchAndParse(url, parserFn) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
            const html = await resp.text();
            await parserFn(html); // supports both sync and async functions
        } catch (err) {
            console.error(`[fetchAndParse] Failed to fetch ${url}:`, err);
        }
    }

    // ========== All Timer Modules ==========


    // ========== Hunt Module ==========

    async function initHuntModule() {
        const mod = MODULES.hunt;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        if (timer > now) return;

        if (location.pathname === '/map.php') {
            parseHuntPage(document.documentElement.innerHTML);
        } else {
            if (now - lastChecked > recheckCooldownShort) {
                fetchAndParse('https://www.lordswm.com/map.php', parseHuntPage);
            }
        }
    }

    function parseHuntPage(text) {
        const mod = MODULES.hunt;
        setValue(mod.lastCheckedKey, Date.now());
        const matches = [...text.matchAll(/MapHunterDelta\s*=\s*(\d+);/g)];
        if (matches.length < 2) return false; // parsing failed;

        const seconds = parseInt(matches[1][1], 10);
        const futureTime = Date.now() + seconds * 1000 + 5000; // 5 seconds buffer

        setValue(mod.timerKey, futureTime);
        setValue(mod.notifiedKey, false);
        return true; // parsing success
    }

    // ========== HG and MG point threshold check ==========
    const HG_MG_THRESHOLD_FLAG = 'hg_mg_threshold_enabled';
    const HG_THRESHOLD_KEY = 'hg_threshold_saved';
    const MG_THRESHOLD_KEY = 'mg_threshold_saved';
    const HG_MG_GOANYWAY = false;
    const HG_MG_ENABLESKIP = true;
    const HG_MG_NOALERTS = true;


    function injectHGMGThresholdSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(HG_MG_THRESHOLD_FLAG, false);
        const savedHG = getFlag(HG_THRESHOLD_KEY, '');
        const savedMG = getFlag(MG_THRESHOLD_KEY, '');

        const div = document.createElement('div');
        div.id = 'hg_mg_threshold_settings_wrapper';
        div.innerHTML = `
        <strong>Hunt/Merc Auto Skip</strong>
        <label>
            <input type="checkbox" id="hg_mg_threshold_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable at
        </label>
        <label>HG:
            <input type="number" id="hg_threshold_input" placeholder="2" value="${savedHG}" style="width: 30px" maxlength="1" size="1" pattern="\\d{1,5}" />
        </label>
        <label>MG:
            <input type="number" id="mg_threshold_input" placeholder="2" value="${savedMG}" style="width: 30px" maxlength="1" size="1" pattern="\\d{1,5}" />
        </label>
    `;

        container.appendChild(div);

        // Checkbox toggle
        div.querySelector('#hg_mg_threshold_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(HG_MG_THRESHOLD_FLAG, enabled);
            setTimeout(() => location.reload(), STANDARD_DELAY);
        });

        // Input for HG threshold
        div.querySelector('#hg_threshold_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 1 && num <= 5) {
                setFlag(HG_THRESHOLD_KEY, num);
            } else {
                alert("Invalid HG threshold. Enter a number from 1 to 5.");
                e.target.value = '';
            }

        });

        // Input for MG threshold
        div.querySelector('#mg_threshold_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 1 && num <= 5) {
                setFlag(MG_THRESHOLD_KEY, num);
            } else {
                alert("Invalid MG threshold. Enter a number from 1 to 5.");
                e.target.value = '';
            }
        });
    }

    async function guildPointsThresholdEnabled (key, goAnyway = false, skipEnabled = true, noAlerts = false){
        if (!getFlag(HG_MG_THRESHOLD_FLAG, false)) return;

        let result, module, confirmJump;
        let skipped = false;
        let html;

        const mod = MODULES[key];
        if (key === 'mg') module = 'MG';
        if (key === 'hunt') module = 'HG';
        const url= 'https://www.lordswm.com' + mod.moduleUrl;

        if (module){
            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
                html = await resp.text();
                result = parseGuildPointsReward(html, module);
            } catch (err) {
                console.error(`[fetch] Failed to fetch data`, err);
                setValue(mod.timerKey, "Unable to Fetch"); // ✅ prevent re-triggering
                return;
            }
        }

        if (result) {
            console.log(module+` Reward: +${result.points} points`);
            if (result.meetsThreshold) {
                if(!noAlerts){
                    confirmJump = confirm(`🔥 This ${module} rewards +${result.points} points! Worth doing. Go there?`);
                }
                setValue(mod.timerKey, `Reward: +${result.points} points`);
            }
            else {
                if (skipEnabled) {
                    let skipurl = '';
                    if (module === 'HG') {
                        skipurl = 'https://www.lordswm.com/map.php?action=skip';
                    } else if (module === 'MG') {
                        const sign = await getValue(PLAYERINFO.signValue, '');
                        skipurl = 'https://www.lordswm.com/mercenary_guild.php?action=skip&sign=' + sign;
                    }

                    if (skipurl) {
                        console.log(`⚡ Skipping ${module} quest via: ${skipurl}`);
                        await fetch(skipurl);
                        skipped = true;
                        setValue(mod.timerKey, `Skipped: +${result.points} points`);
                        console.log(`🔁 Quest skipped. Refreshing page in 2 minutes...`);
                        if (!location.pathname.includes('war.php'))
                        {

                            setTimeout(() => {
                                location.reload()
                                //initSchedulesPanel();
                            }, recheckCooldownShort+10000);
                        }
                    }
                } else {
                    if(!noAlerts){
                        confirmJump = confirm(`😐 Only +${result.points} points. You may want to skip this ${module}. Go there?`);
                    }
                }
            }
        }
        else {
            let parsedSuccessfully = false;
            // Try parsing the reward/timer normally
            if (module === 'HG') parsedSuccessfully = parseHuntPage(html);
            if (module === 'MG') parsedSuccessfully = parseMGPage(html);
            console.log(`❌ No ${module} reward info found.`);
            if (!parsedSuccessfully) {
                setValue(mod.timerKey, "Reward: Unknown"); // only set if parsing failed
            } //prevents a retry loop
            if (!goAnyway && !noAlerts) {
                confirmJump = confirm(`😐 Could not find points for ${module}. Go there anyway?`);
            }
        }

        if (!skipped && (confirmJump || goAnyway)) {
            window.location.href = url;
        }
        renderModules();
    }

    function parseGuildPointsReward(html, type) {
        const regex = new RegExp(`<b>\\+(\\d+)\\s*${type}\\s*points<\\/b>`, 'gi');
        let match;
        let maxPoints = 0;

        while ((match = regex.exec(html)) !== null) {
            const points = parseInt(match[1], 10);
            if (points > maxPoints) maxPoints = points;
        }

        if (maxPoints > 0) {
            const hgThreshold = getFlag(HG_THRESHOLD_KEY, 2);
            const mgThreshold = getFlag(MG_THRESHOLD_KEY, 2);

            const threshold = type === 'HG' ? hgThreshold : mgThreshold;
            return {
                points: maxPoints,
                meetsThreshold: maxPoints >= threshold
            };
        }
        else {

            // ✅ Fallback: detect gold reward structure like "Award: <b>100</b> gold" or army info for hunts
            const fallbackGoldRegex = type === 'HG' ? /army_info\.php/ : /Award:\s*<b>\d+<\/b>\s*gold/i;
            if (fallbackGoldRegex.test(html)) {
                return {
                    points: 1, // inferred reward
                    meetsThreshold: false
                };
            }
            else {
                return null;
            }
        }// no quest reward found at all
    }

    // ========== Enchanters Guild Module ==========

    async function initEnchantModule() {
        const mod = MODULES.enchant;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        // Don't re-fetch if timer is still active
        if (timer > now) return;

        if (location.pathname === '/mod_workbench.php') {
            parseEnchantPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownLong) { // fetch cooldown
            fetchAndParse('https://www.lordswm.com/mod_workbench.php', parseEnchantPage);
        }
    }

    function parseEnchantPage(text) {
        const mod = MODULES.enchant;
        setValue(mod.lastCheckedKey, Date.now());
        const match = text.match(/Complete in: (\d{1,2} h\.)?\s*(\d{1,2} min)?/i);
        if (!match) return;

        let totalMs = 0;
        if (match[1]) {
            const hours = parseInt(match[1].match(/\d+/)[0], 10);
            totalMs += hours * 60 * 60 * 1000;
        }
        if (match[2]) {
            const minutes = parseInt(match[2].match(/\d+/)[0], 10);
            totalMs += (minutes + 1) * 60 * 1000; // +1 to be safe
        }

        if (totalMs > 0) {
            const readyAt = Date.now() + totalMs;
            setValue(mod.timerKey, readyAt);
            setValue(mod.notifiedKey, false); // reset notification
        }
    }

    // ========== Smiths Guild Module ==========

    async function initSmithModule() {
        const mod = MODULES.smith;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        if (timer > now) return;

        if (location.pathname === '/mod_workbench.php') {
            parseSmithPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownLong) {
            fetchAndParse('https://www.lordswm.com/mod_workbench.php', parseSmithPage);
        }
    }

    function parseSmithPage(text) {
        const mod = MODULES.smith;
        setValue(mod.lastCheckedKey, Date.now());
        const match = text.match(/Under repair another (\d{1,2} h\.\s*)?(\d{1,2} min)/i);
        if (!match) return;

        let totalMs = 0;
        if (match[1]) {
            const hours = parseInt(match[1].match(/\d+/)[0], 10);
            totalMs += hours * 60 * 60 * 1000;
        }
        if (match[2]) {
            const minutes = parseInt(match[2].match(/\d+/)[0], 10);
            totalMs += (minutes + 1) * 60 * 1000; // +1 to be safe
        }

        if (totalMs > 0) {
            const readyAt = Date.now() + totalMs;
            setValue(mod.timerKey, readyAt);
            setValue(mod.notifiedKey, false);
        }
    }

    // ========== Mercenary Guild Module ==========

    async function initMGModule() {
        const mod = MODULES.mg;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        if (timer > now) return;

        if (location.pathname === '/mercenary_guild.php') {
            parseMGPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownShort) {
            fetchAndParse('https://www.lordswm.com/mercenary_guild.php', parseMGPage);
        }
    }

    function parseMGPage(text) {
        const mod = MODULES.mg;
        setValue(mod.lastCheckedKey, Date.now());
        const matchDiffLoc = text.match(/You are in a different location\./i);
        if (matchDiffLoc) setValue(mod.timerKey, "Different Location.");
        const match = text.match(/Come back in (\d{1,2}) min/i);
        if (!match) return false; // parsing failed;

        const minutes = parseInt(match[1], 10);
        const totalMs = (minutes + 1) * 60 * 1000; // +1 min to account for rounding

        const readyAt = Date.now() + totalMs;
        setValue(mod.timerKey, readyAt);
        setValue(mod.notifiedKey, false);
        return true; // parsing success
    }

    // ========== Laborers Guild Module ==========

    async function initLaborersModule() {
        const mod = MODULES.laborers;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        if (typeof timer === 'number' && timer > now) return;

        if (location.pathname.startsWith('/object-info.php')) {
            parseLaborersFromObjectInfo();
        }	else if (location.pathname === '/home.php') {
            parseLaborersFromHome();
        } 	else if (now - lastChecked > recheckCooldownShort) {
            fetchAndParse('https://www.lordswm.com/home.php', parseLaborersFromHome);
        }
    }

    function parseLaborersFromHome(html) {
        const mod = MODULES.laborers;
        setValue(mod.lastCheckedKey, Date.now());
        let text;
        if (window.location.pathname === '/home.php'){
            const header = document.querySelector('#set_mobile_max_width');
            if (!header) return;

            text = header.innerText;
        }
        else {
            text = html;
        }

        if (text.includes('You are currently unemployed')) {
            setValue(mod.timerKey, 'Unemployed.');
            setValue(mod.lastCheckedKey, Date.now());
            setValue(mod.notifiedKey, false);
            return;
        }

        // Case: cooldown - enroll again in X min
        const cooldownMatch = text.match(/You may enroll again in (\d{1,2}) min/i);
        if (cooldownMatch) {
            const minutes = parseInt(cooldownMatch[1], 10);
            const endTime = Date.now() + (minutes + 1) * 60 * 1000;

            setValue(mod.timerKey, endTime);
            setValue(mod.notifiedKey, false);
            return;
        }

        // Case: currently employed since HH:MM
        const match = text.match(/since\s+(\d{1,2}):(\d{2})/);
        if (match) {
            const [_, h, m] = match.map(Number);

            const now = new Date();
            const utc3Date = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                h - 3, // from UTC+3 to UTC
                m
            ));

            const endTime = utc3Date.getTime() + 60 * 60 * 1000 + 60 * 1000;

            setValue(mod.timerKey, endTime);
            setValue(mod.notifiedKey, false);
        }
    }

    function parseLaborersFromObjectInfo() {
        const mod = MODULES.laborers;
        setValue(mod.lastCheckedKey, Date.now());
        const match = document.body.textContent.match(/(enrolled|устроены)/i);
        if (!match) return;

        const endTime = Date.now() + 60 * 60 * 1000;

        setValue(mod.timerKey, endTime);
        setValue(mod.notifiedKey, false);
    }

    // ========== Thieves Guild Module ==========

    async function initThievesModule() {
        const mod = MODULES.thieves;
        const enabled = await getValue(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;

        const timer = await getValue(mod.timerKey, 0);
        const now = Date.now();

        if (location.pathname === '/war.php') {
            //   await checkThievesBattle(); // This will handle setting the timer if needed via battle
        }
        if (location.pathname === '/pl_warlog.php') {
            parseThievesLogPage(document.documentElement.innerHTML); //document.documentElement.innerHTML  .textContent
        }

        if (timer > now) return;

        const userId = getCookie("pl_id");
        if (!userId) return console.warn("User ID not found.");

        const lastChecked = await getValue(mod.lastCheckedKey, 0);
        if (now - lastChecked < recheckCooldownMedium) return;

        setValue(mod.lastCheckedKey, now);
        fetchAndParse(`https://www.lordswm.com/pl_warlog.php?id=${userId}`, parseThievesLogPage);

    }

    function parseThievesLogPage(html) {
        const mod = MODULES.thieves;
        const isPremium = getValue('mod_premium_status', false); // already saved in initThievesModule
        const lines = html.split('<BR>').filter(Boolean);
        const now = Date.now();

        for (const line of lines) {
            if (!line.includes('Caravan')) continue;
            if (!/<b>Caravan/.test(line)) continue; // bold = you lost

            const timeMatch = line.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
            if (!timeMatch) continue;

            const [_, y, m, d, h, min] = timeMatch.map(Number);
            const utcPlus3 = new Date(Date.UTC(y, m - 1, d, h - 3, min)); // convert UTC+3 to UTC
            const timestamp = utcPlus3.getTime();

            if (now - timestamp > 60 * 60 * 1000) continue; // older than 1 hour

            const cooldown = (isPremium ? 42 : 60) * 60 * 1000;
            const readyAt = timestamp + cooldown;

            getValue(mod.timerKey, 0).then(existingTime => {
                if (readyAt > existingTime) {
                    setValue(mod.timerKey, readyAt);
                    setValue(mod.notifiedKey, false);
                }
            });

            break; // only care about first match
        }
    }

    async function checkThievesBattle() {
        const match = unsafeWindow.run_all?.toString();
        if (!match) return;
        const mod=MODULES.thieves;

        const btype = match.match(/btype\|(\d+)/)?.[1];
        const plid = match.match(/plid1\|(\d+)/)?.[1];
        const warid = new URLSearchParams(window.location.search).get("warid");
        const userId = getCookie("pl_id");

        if (btype === "66" && plid === userId && warid) {
            const lastWarId = await getValue(mod.lastWarIdKey, 0);
            if (Number(warid) > Number(lastWarId)) {
                const isPremium = await getValue(PLAYERINFO.premiumKey, false);
                const cooldown = (isPremium ? 42 : 60) * 60 * 1000;
                const expireAt = Date.now() + cooldown;

                await setValue(mod.timerKey, expireAt);
                await setValue(mod.lastCheckedKey, Date.now());
                await setValue(mod.lastWarIdKey, warid);
                await setValue(mod.notifiedKey, false);
            }
        }
    }

    // ========== Relevant Player Info ==========

    function detectPremium() {
        // Always reset first
        setValue(PLAYERINFO.premiumKey, false);

        const isPremium = !!document.body.innerHTML.match(/star\.png/);
        setValue(PLAYERINFO.premiumKey, isPremium);
    }

    function detectSignValue() {
        // Reset stored value
        setValue(PLAYERINFO.signValue, null);

        const logoutLink = document.querySelector('a[href*="logout.php"][href*="sign="]');
        if (logoutLink) {
            const url = new URL(logoutLink.href, location.origin);
            const sign = url.searchParams.get('sign');
            if (sign) {
                setValue(PLAYERINFO.signValue, sign);
                //console.log('🔐 Detected sign value:', sign);
            } else {
                //console.warn('⚠️ Sign param missing in logout link');
            }
        } else {
            //console.warn('⚠️ Logout link with sign not found');
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // ========== Battle Ready Set Checker ==========

    const STANDARD_DELAY = 2000;
    let ring_slot_avoid = 8;

    const BRCFLAGS = {
        enabled: 'brc_enabled',
        setSaved: 'brc_set_saved',
        isReady: 'brc_ready',
        artNames: 'brc_art_names',
        setLock: 'brc_set_locked',
        setName: 'brc_set_name'
    };
    let myArts = [];
    let statusEl, setNameEl, nameDisplayEl;

    async function setCheckerPanel() {
        //if (window.location.pathname === '/war.php') return;
        if(!getFlag(BRCFLAGS.enabled, false)) return;

        const container = document.querySelector('#lwm-modules');
        if (!container) return console.warn("Scheduler module container not found!");

        const div = document.createElement('div');
        div.className = 'lwm-module';
        div.id = 'brc_scheduler_module';

        div.innerHTML = `
            <div><span><strong>Set Checker:</strong> <span id="brc_set_name_display">-</span></span><br>
                 <span><strong>Status:</strong> <span id="brc_status">Loading...</span></span>
            </div>
        `;

        container.appendChild(div);

        // Reference handles
        statusEl = div.querySelector('#brc_status');
        nameDisplayEl = div.querySelector('#brc_set_name_display');

        updatePanelStatus();

        // Click-to-reset functionality
        statusEl.style.cursor = 'pointer';
        statusEl.title = 'Click to reset and recheck';
        statusEl.addEventListener('click', () => {
            const saved = getFlag(BRCFLAGS.setSaved, 0);
            const ready = getFlag(BRCFLAGS.isReady, 0);
            if (saved && ready) {
                setFlag(BRCFLAGS.isReady, 0);
                statusEl.textContent = 'Recheck Triggered 🔄';
                setTimeout(updatePanelStatus, STANDARD_DELAY);
                initSetChecker();
                //setTimeout(() => location.reload(), STANDARD_DELAY);
            }
        });


    }

    function updatePanelStatus() {
        const saved = getFlag(BRCFLAGS.setSaved, 0);
        const ready = getFlag(BRCFLAGS.isReady, 0);
        const setName = getFlag(BRCFLAGS.setName, '');
        if (statusEl)
        {
            statusEl.textContent = saved
                ? (ready ? 'Ready ✅' : 'Not Ready ❌')
            : 'Set Not Saved ⚠️';
        }
        if (nameDisplayEl)
        {
            nameDisplayEl.textContent = setName || '-';
        }
    }

    function getEquippedArtNames() {
        const equippedIds = [];
        document.querySelectorAll('[onClick^="javascript: try_undress("]').forEach(el => {
            const match = el.getAttribute('onClick').match(/try_undress\((\d+)\)/);
            if (match) equippedIds.push(Number(match[1]));
        });
        const equippedNames = equippedIds.map(id => {
            const artPage = Object.values(arts).find(a => a.id === id);
            if (!artPage) {
                console.warn(`[Set Checker] No art object found for equipped ID ${id}`);
                return '[UNKNOWN]';
            }
            return artPage.name + (artPage.suffix || '');
        });
        return equippedNames;
    }

    function isMatchingSet(equippedNames, savedNames) {
        const match = savedNames.every(name => equippedNames.includes(name)) &&
              equippedNames.length === savedNames.length;
        return match;
    }

    function equipMissingItems(savedNames, myArts, ring_slot_avoid) {
        const equippedIds = Object.values(myArts)
        .filter(art => art.dressed)
        .map(art => art.id);
        const equippedNames = equippedIds
        .map(id => {
            const art = Object.values(myArts).find(art => art.id === id);
            return art ? art.name + (art.suffix || '') : null;
        })
        .filter(Boolean);
        const savedCount = {};
        const equippedCount = {};
        savedNames.forEach(name => savedCount[name] = (savedCount[name] || 0) + 1);
        equippedNames.forEach(name => equippedCount[name] = (equippedCount[name] || 0) + 1);
        const missing = [];
        for (const name in savedCount) {
            const diff = savedCount[name] - (equippedCount[name] || 0);
            for (let i = 0; i < diff; i++) missing.push(name);
        }
        const alreadyUsedIds = new Set(equippedIds);
        const tasks = [];
        for (const name of missing) {
            const candidates = Object.values(myArts).filter(art =>
                                                            (art.name + (art.suffix || '')) === name &&
                                                            Number(art.durability1) > 0 &&
                                                            !alreadyUsedIds.has(art.id)
                                                           );
            if (candidates.length === 0) {
                alert(`[Set Checker] No spare art found for "${name}". Disabling.`);
                setFlag(BRCFLAGS.enabled, false);
                return Promise.reject(`Missing artifact "${name}"`);
            }
            const artToUse = candidates[0];
            alreadyUsedIds.add(artToUse.id);
            tasks.push(() => callTryDressByIdWithPromise(artToUse.id, ring_slot_avoid));
        }
        if (tasks.length === 0) return Promise.resolve();
        return tasks.reduce((promise, taskFn) => {
            return promise.then(() => taskFn()).then(() => STANDARD_DELAY);
        }, Promise.resolve());
    }

    function callTryDressByIdWithPromise(id, ring_slot_avoid = 8) {
        return new Promise((resolve, reject) => {
            const url = `inventory.php?dress=${id}&js=1&last_ring_dress=${ring_slot_avoid}&rand=${Math.random() * 1000000}`;
            console.log(`[BRC] Trying to equip ID ${id} with slot avoid = ${ring_slot_avoid}`);
            if (ring_slot_avoid === 8)
            {	ring_slot_avoid = 9;
            }
            else if (ring_slot_avoid === 9)
            {	ring_slot_avoid = 8;
            }
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log(`[BRC] Successfully equipped ${id}`);
                    resolve();
                } else {
                    reject(`[BRC] Failed to equip ${id} - status ${xhr.status}`);
                }
            };
            xhr.onerror = () => reject(`[BRC] Network error equipping ${id}`);
            xhr.send();
        });
    }

    async function getInventoryDataFromBackend() {
        try {
            const response = await fetch('/inventory.php', {
                credentials: 'same-origin'
            });
            const htmlText = await response.text();
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            // Extract arts array from embedded JS
            const myArtsScript = [...doc.querySelectorAll('script')]
            .map(s => s.textContent)
            .find(text => text.includes('arts=new Array();'));
            //console.log("[Raw JS Arts Block]", myArtsScript.slice(-1000));
            let myArtsI = [];
            let artsMap = {};
            if (myArtsScript) {
                const propRegex = /arts\[(\d+)]\[['"]?(\w+)['"]?]\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|(\d+)|null|true|false);/g;
                let match;
                while ((match = propRegex.exec(myArtsScript)) !== null) {
                    const artId = parseInt(match[1]);
                    const key = match[2];
                    let value = match[3] ?? match[4] ?? match[5]; // string or number
                    // Try to parse values into appropriate types
                    if (value === undefined) {
                        const raw = match[0];
                        if (raw.includes('= null;')) value = null;
                        else if (raw.includes('= true;')) value = true;
                        else if (raw.includes('= false;')) value = false;
                        else value = "";
                    } else if (!isNaN(value)) {
                        value = Number(value);
                    }
                    if (!artsMap[artId]) {
                        artsMap[artId] = { id: artId }; // include art ID
                    }
                    artsMap[artId][key] = value;
                }
                myArtsI = Object.values(artsMap);
            }
            //console.log("[Parsed Arts Sample]", myArtsI.slice(0, 3));
            return myArtsI;
        } catch (err) {
            console.error("[Inventory Fetch Error]", err);
            return null;
        }
    }

    function getRingSlotAvoid(myArts) {
        const ringSlots = new Set();
        for (const art of Object.values(myArts)) {
            if (art.slot === 8 && art.dressed !== 0) {
                ringSlots.add(art.dressed);
            }
        }
        // If slot 8 is used, avoid 8 → use 9
        if (ringSlots.has(8) && !ringSlots.has(9)) return 8;
        if (ringSlots.has(9) && !ringSlots.has(8)) return 9;
        // If both are empty or both used, default to 8
        return 8;
    }

    async function undressAllItems() {
        try {
            const rand = Math.random() * 1000000;
            const url = `https://www.lordswm.com/inventory.php?all_off=100&js=1&rand=${rand}`;
            const response = await fetch(url, {
                credentials: 'same-origin'
            });
            const result = await response.text(); // this is usually an empty or small response
            console.log("[Undress All] Request sent successfully", result);
            return true;
        } catch (err) {
            console.error("[Undress All] Error sending undress request", err);
            return false;
        }
    }

    // ========== Battle Ready Set Checker init ==========

    function injectSetCheckerSettings() {
        const container = document.getElementById('lwm-settings-list');
        // Avoid duplicate injection
        //if (document.getElementById('brc_settings_wrapper')) return;

        const setCheckerEnabled = getFlag(BRCFLAGS.enabled, false);
        const setCheckerLocked = getFlag(BRCFLAGS.setLock, false);

        const div = document.createElement('div');
        div.id = 'brc_settings_wrapper';
        div.innerHTML = `
        <hr>
        <strong>Set Checker</strong>
        <label>
            <input type="checkbox" id="brc_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Set Checker
        </label>
        <label>
            <input type="checkbox" id="brc_lock_checkbox" ${setCheckerLocked ? 'checked' : ''}>
            Set Locked
        </label>
    `;

        container.appendChild(div);

        div.querySelector('#brc_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BRCFLAGS.enabled, enabled);
            if (!getFlag(BRCFLAGS.setLock, false))
            {setFlag(BRCFLAGS.setSaved, 0);}
            initSetChecker();
            renderModules();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });

        div.querySelector('#brc_lock_checkbox').addEventListener('change', (e) => {
            const locked = e.target.checked;
            setFlag(BRCFLAGS.setLock, locked);
        });
    }

    async function initSetChecker() {
        /*document.addEventListener('click', (e) => {
            if (e.target.id === 'lwm-settings') {
                // Delay to let the popup render
                setTimeout(injectSetCheckerSettings, 50);
            }
        });*/

        if (window.location.pathname === '/war.php') {
            setFlag(BRCFLAGS.isReady, 0);
        }
        else if (window.location.pathname === '/inventory.php') {
            //createFloatingPanel();

            if (!getFlag(BRCFLAGS.enabled, false)) {
                return;
            }
            const saved = getFlag(BRCFLAGS.setSaved, 0);
            if (!saved) {
                const DefaultSetName = "Standard";
                const confirmSaveSet = prompt('[Set Checker] Save current set using name - ', DefaultSetName);
                if (confirmSaveSet === null) // User cancelled
                {
                    console.warn('[Set Checker] User declined to save current set.');
                    return;
                }
                const names = getEquippedArtNames();
                setFlag(BRCFLAGS.artNames, names);
                setFlag(BRCFLAGS.setSaved, 1);
                setFlag(BRCFLAGS.setName, confirmSaveSet);
                alert('[Set Checker] Set saved successfully.');
                return;
            }
            const savedNames = getFlag(BRCFLAGS.artNames, []);
            const equippedNames = getEquippedArtNames();
            console.log("Saved set");
            console.log(savedNames);
            console.log("Equipped set");
            console.log(equippedNames);

        }
        else {
            //createFloatingPanel();

            if (!getFlag(BRCFLAGS.enabled, false)) return;
            if (!getFlag(BRCFLAGS.setSaved, 0)) {
                alert('[Set Checker] No saved set found. Please visit inventory.php and save a set.');
                return;
            }
            if (getFlag(BRCFLAGS.isReady, true)) return;
            myArts = await getInventoryDataFromBackend();
            if (!myArts) return;
            ring_slot_avoid = getRingSlotAvoid(myArts);
            const equippedNames = Object.values(myArts)
            .filter(art => art.dressed)
            .map(art => art.name + (art.suffix || ''));
            const savedNames = getFlag(BRCFLAGS.artNames, []);
            if (isMatchingSet(equippedNames, savedNames)) {
                setFlag(BRCFLAGS.isReady, 1);
                console.log("[Set Checker] Success — Correct artifacts are already equipped.");
                return;
            }
            console.warn('[Set Checker] Mismatch — equipping missing items...');
            try {
                await equipMissingItems(savedNames, myArts, ring_slot_avoid);
                const refreshedmyArts = await getInventoryDataFromBackend();
                const finalEquippedNames = Object.values(refreshedmyArts)
                .filter(art => art.dressed)
                .map(art => art.name + (art.suffix || ''));
                setFlag(BRCFLAGS.isReady, isMatchingSet(finalEquippedNames, savedNames) ? 1 : 0);
                if (!isMatchingSet(finalEquippedNames, savedNames))
                {
                    await undressAllItems();
                    setTimeout(() => {
                        location.reload();
                    }, STANDARD_DELAY);
                }
            } catch (err) {
                console.error('[Set Checker] Error during equipping:', err);
                setFlag(BRCFLAGS.isReady, 0);
            }

        }
    }

    // ========== Dark Mode Experimental ==========

    const DARK_MODE_FLAG = 'dark_mode_enabled';

    function enableDarkMode(){
        if (!getFlag(DARK_MODE_FLAG, false)) return;
        // 🎨 Color constants
        const mainTextColor = `#d0d0d0`;
        const mainBGColor = `#2e2e2e`;
        const panelColor = `#1e1e1e`;
        const containerColor = `#262626`;
        const headerColor = `#1b1b1b`;
        const buttonText = `#e0c090`;
        const linkColor = `#b0b0b0`;

        const style = document.createElement('style');
        style.id = 'lwm_dark_theme';
        style.textContent = `
        html, body {
            background-color: ${mainBGColor} !important;
            color: ${mainTextColor} !important;
        }

        table, td, th {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
            background-image: none !important;
        }

        input, select, textarea, button {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
            border: 1px solid #666 !important;
        }

        a {
            color: ${linkColor} !important;
        }

        a:hover {
            color: #ddd !important;
        }

        .home_container_block,
        .home_pers_block,
        .home_left_landscape_mobile,
        .map_container_block,
        .global_container_block,
        .global_container_block_header,
        .global_table_div,
        .global_table_div_no_lines,
        .global_table_bg_color,
        .global_notice {
            background-color: ${containerColor} !important;
            color: ${mainTextColor} !important;
            background-image: none !important;
        }

        .global_container_block_header {
            font-weight: bold;
            background-color: ${headerColor} !important;
            border-bottom: 1px solid #555;
        }

        .home_button3,
        .home_button_text_left3 {
            color: ${buttonText} !important;
            background-color: transparent !important;
        }

        button, .button, input[type="submit"], input[type="button"] {
            background-color: #555 !important;
            color: ${mainTextColor} !important;
            border: 1px solid #999 !important;
            padding: 3px 8px;
            border-radius: 4px;
        }

        .wbwhite, .wbwhite2, .wbwhite3 {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
        }

        .sh_dd_container, .sh_dd_container div {
            background-color: #3b2f23 !important;
            color: #fad49f !important;
            border-color: #e2b77d !important;
        }

        iframe, .banner_top, .adv, .adv_right {
            display: none !important;
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }
    `;
        document.head.appendChild(style);
    }

    function injectDarkModeSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(DARK_MODE_FLAG, false);

        const div = document.createElement('div');
        div.id = 'dark_mode_settings_wrapper';
        div.innerHTML = `
        <strong>Dark Mode</strong>
        <label>
            <input type="checkbox" id="dark_mode_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Dark Mode
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#dark_mode_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(DARK_MODE_FLAG, enabled);
            enableDarkMode();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    // ========== Incoming Transfers Alert ==========

    const INCOMING_ART_KEY_LAST_CHECK = 'lwm_incoming_arts_last_check';
    const INCOMING_ART_FLAG = 'lwm_incoming_arts_enabled';
    const INCOMING_ARTS_TRANSFERS_LIST = 'lwm_incoming_arts_transfer_list';

    function injectIncomingArtSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(INCOMING_ART_FLAG, false);

        const div = document.createElement('div');
        div.id = 'incoming_art_settings_wrapper';
        div.innerHTML = `
        <strong>Incoming Arts</strong>
        <label>
            <input type="checkbox" id="incoming_art_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Incoming Art Transfer Alerts
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#incoming_art_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(INCOMING_ART_FLAG, enabled);
            incomingTransferAlerts();
            renderModules();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    async function incomingArtPanel() {
        if (!getFlag(INCOMING_ART_FLAG, false)) return;

        const container = document.querySelector('#lwm-modules');
        if (!container) return console.warn("Scheduler module container not found!");

        const incomingTransfers = await getStoredTransfers(); // assumes list of TIDs
        const artCount = incomingTransfers.length;

        if (artCount === 0) return; // don't display anything

        const div = document.createElement('div');
        div.className = 'lwm-module';
        div.id = 'incoming_arts_module';

        div.innerHTML = `
        <div><span><strong>Incoming Arts:</strong> <span id="incoming_arts_display">${artCount}</span></span></div>
    `;

        container.appendChild(div);
    }
    async function getStoredTransfers() {
        const raw = await getValue(INCOMING_ARTS_TRANSFERS_LIST, '[]');
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    async function incomingTransferAlerts(){
        if (!getFlag(INCOMING_ART_FLAG, false)) return;

        async function checkForNewTransfers(currentList) {
            //console.log('incoming transfer module triggered 3');
            const previousList = await getStoredTransfers();
            const newTransfers = currentList.filter(tid => !previousList.includes(tid));

            if (newTransfers.length > 0) {
                alert("📦 You have incoming transfers!");
            }

            await saveTransfers(currentList);
        }

        async function saveTransfers(tidList) {
            await setValue(INCOMING_ARTS_TRANSFERS_LIST, JSON.stringify(tidList));
        }



        function extractIncomingTransfers(html) {
            //console.log('incoming transfer module triggered 2.');
            let text;
            if (window.location.pathname === '/inventory.php'){
                const header = document;
                text = header.innerText;
            }
            else {
                text = html;
            }
            const regex = /trade_accept\.php\?tid=(\d+)/g;
            const matches = [];
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push(match[1]); // only store the tid number
            }
            //return matches;
            setValue(INCOMING_ART_KEY_LAST_CHECK, Date.now());
            checkForNewTransfers(matches);
        }

        async function initIncomingTransfers() {
            const lastChecked = await getValue(INCOMING_ART_KEY_LAST_CHECK, 0);
            const now = Date.now();
            //console.log('incoming transfer module triggered.');

            if (location.pathname === '/inventory.php') {
                extractIncomingTransfers();
            } 	else if (now - lastChecked > recheckCooldownLong) {
                fetchAndParse('https://www.lordswm.com/inventory.php', extractIncomingTransfers);
            }
        }

        initIncomingTransfers();
    }

    // ========== Inventory To Auction Lot ==========

    const INV_TO_LOT_KEY = 'lwm_post_new_lot';
    const INV_TO_LOT_FLAG = 'lwm_post_new_lot_enabled';

    function injectInvToLotSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(INV_TO_LOT_FLAG, false);

        const div = document.createElement('div');
        div.id = 'inv_to_lot_settings_wrapper';
        div.innerHTML = `
        <strong>Inv to Lot</strong>
        <label>
            <input type="checkbox" id="inv_to_lot_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Inventory to Auction Lot
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#inv_to_lot_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(INV_TO_LOT_FLAG, enabled);
            inventoryToAuctionLot();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function inventoryToAuctionLot(){
        if (!getFlag(INV_TO_LOT_FLAG, false)) return;

        function createButton(artTransferName) {
            const wrapper = document.createElement('div');
            wrapper.className = 'inv_item_select lwm-transfer-btn';

            const btn = document.createElement('img');
            btn.className = 'inv_item_select inv_item_select_img';
            btn.src = 'https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65';
            btn.title = 'Sell on Market';
            btn.addEventListener('click', () => {
                setValue(INV_TO_LOT_KEY, artTransferName);
                console.log('saved the art'+ artTransferName);
                openAuctionNewLogPage();
            });

            wrapper.appendChild(btn);
            return wrapper;
        }

        function injectButton() {
            const menu = document.getElementById('inv_menu');
            const idx = parseInt(menu?.getAttribute('art_idx'), 10);

            if (isNaN(idx) || !arts || !arts[idx]) return;

            const artTransferName = arts[idx].art_id + '@' + arts[idx].id;
            //console.log(artTransferName);
            const container = document.getElementById('inv_item_buttons');

            const old = container.querySelector('.lwm-transfer-btn');
            if (old) old.remove();

            const newBtn = createButton(artTransferName);
            container.appendChild(newBtn);
        }

        function addToInvMenu() {
            const target = document.getElementById('inv_menu');
            if (!target) return;

            const observer = new MutationObserver(() => {
                if (target.style.display !== 'none') {
                    injectButton();
                }
            });

            observer.observe(target, {
                attributes: true,
                attributeFilter: ['style', 'art_idx'],
            });
        }

        function openAuctionNewLogPage(){
            const url='https://www.lordswm.com/auction_new_lot.php';
            window.location.href = url;
        }

        if (location.pathname === '/inventory.php') {
            addToInvMenu();
        } else if (location.pathname === '/auction_new_lot.php') {
            (async () => {
                const artToSelect = await getValue(INV_TO_LOT_KEY, null);
                if (artToSelect) {
                    const sel = document.querySelector('#sel');
                    if (sel) {
                        sel.value = artToSelect;
                        console.log('✅ sel set to:', artToSelect);
                        setTimeout(() => {
                            sel.dispatchEvent(new Event('change'));
                            //console.log('✅ Change event dispatched after delay.');
                        }, 700); // 100ms delay is usually enough, 700 to be careful
                    } else {
                        //console.warn('❌ #sel not found on auction_new_lot.php');
                    }

                    const countInput = document.querySelector('#anl_count');
                    setTimeout(() => {
                        if (countInput) {
                            countInput.value = '1';
                        }
                    }, 1000);

                    setValue(INV_TO_LOT_KEY, null); //after everything, clear the value
                    //console.log('Stored art value cleared.');
                }
                else{
                    //console.log('No art stored for sale.');
                }
            })();
        }
    }

    // ========== Rational Seller ==========

    const RATIONAL_AUCTIONS_FLAG = 'rational_auctions_enabled';
    const RATIONAL_SELLER_FLAG = 'rational_seller_enabled';

    function injectRationalAuctionsSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(RATIONAL_AUCTIONS_FLAG, false);

        const div = document.createElement('div');
        div.id = 'rational_auctions_settings_wrapper';
        div.innerHTML = `
        <strong>Rational Auctions</strong>
        <label>
            <input type="checkbox" id="rational_auctions_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Auction Page CPB calcs
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#rational_auctions_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(RATIONAL_AUCTIONS_FLAG, enabled);
            rationalMarketEnjoyer();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function injectRationalSellerSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(RATIONAL_SELLER_FLAG, false);

        const div = document.createElement('div');
        div.id = 'rational_seller_settings_wrapper';
        div.innerHTML = `
        <strong>Rational Seller</strong>
        <label>
            <input type="checkbox" id="rational_seller_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Auction New Lot Assist
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#rational_seller_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(RATIONAL_SELLER_FLAG, enabled);
            rationalMarketEnjoyer();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function rationalMarketEnjoyer() {
        'use strict';
        const goldImg = '<img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="24" height="24" title="Cost">&nbsp;';
        let table, rows, artId;
        const artCache = new Map();
        const STORAGE_KEY = 'lwm_art_data_cache';
        const SMITH_SETTINGS_KEY = 'lwm_smith_settings';

        //#region smith and cache functions
        function smithEffiInput() {
            return parseFloat(document.getElementById('smithEffi')?.value || 90);
        }

        function smithChargeInput() {
            return parseFloat(document.getElementById('smithCharge')?.value || 102);
        }

        function loadSmithSettings() {
            try {
                return JSON.parse(localStorage.getItem(SMITH_SETTINGS_KEY)) || { effi: 90, charge: 102 };
            } catch {
                return { effi: 90, charge: 102 };
            }
        }

        function saveSmithSettings(effi, charge) {
            localStorage.setItem(SMITH_SETTINGS_KEY, JSON.stringify({ effi, charge }));
        }

        function loadCacheFromStorage() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            try {
                const obj = JSON.parse(raw);
                for (const [key, val] of Object.entries(obj)) {
                    artCache.set(key, val);
                }
            } catch (e) {
                console.warn("Failed to parse the art cache: ", e);
            }
        }

        function saveCacheToStorage() {
            const obj = Object.fromEntries(artCache);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        }
        //#endregion

        function AuctionPageMarketTableRows(context = document, skipHeaders = false) {
            const xpath = "//td[contains(text(),'Bids')]";
            const bidsEl = context.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const table = bidsEl?.parentNode?.parentNode;
            if (!table) return { table: null, rows: [] };

            const rows = Array.from(table.children);
            return { table, rows: skipHeaders ? rows.slice(2) : rows };
        }

        function AuctionPageAddColumns() {
            const header = rows[1];
            let labels = [];
            let cacheA = artCache.get(artId);
            const lowestCPB = cacheA?.lowestCPB ?? null;
            if (lowestCPB !== null)
            { labels = ['CPB', 'Repair Till', 'Total Fights', 'Shop CPB']; }
            else labels = ['CPB', 'Repair Till', 'Total Fights'];
            labels.forEach(label => {
                const td = document.createElement('td');
                td.innerHTML = `<span align="center">${label}</span>`;
                td.setAttribute('width', '100');
                header.appendChild(td);
            });
        }

        function AuctionPageAddSmithSettings() {
            const settings = rows[0];
            settings.children[0].colSpan = 2;
            settings.children[1].align = "center";
            settings.children[1].colSpan = 3;

            const { effi, charge } = loadSmithSettings();

            const td = document.createElement('td');
            td.align = "center";
            td.colSpan = 4;
            td.innerHTML = `
		<b>Cost Per Battle</b><br>
		Effi.: <input type="number" id="smithEffi" value="${effi}" style="width: 40px">%
		| Cost: <input type="number" id="smithCharge" value="${charge}" style="width: 45px">%
		`;
            settings.appendChild(td);

            setTimeout(() => {
                document.getElementById('smithEffi').addEventListener('change', () => {
                    saveSmithSettings(smithEffiInput(), smithChargeInput());
                    location.reload(); // full re-calc
                });
                document.getElementById('smithCharge').addEventListener('change', () => {
                    saveSmithSettings(smithEffiInput(), smithChargeInput());
                    location.reload(); // full re-calc
                });
            }, 100);
        }

        async function fetchRepairCost(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.repairCost) {
                    console.log(`[Cache] ✅ Found Repair Cost for ${artId} via cache`);
                    return Number(entry.repairCost);
                }
            }
            const url = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(url);
            const html = await resp.text();
            const value = Number(html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0]?.replace(',', '').trim()) || 0;
            console.log(`[Cache] ❌ Had to fetch Repair Cost for ${artId} via website`);
            let updated = artCache.get(artId) || {};
            updated.repairCost = value;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return value;
        }

        async function fetchMarketURL(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.marketURL) {
                    console.log(`[Cache] ✅ Found marketURL for ${artId} in cache`);
                    return entry.marketURL;
                }
            }
            const artInfoUrl = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(artInfoUrl);
            const html = await resp.text();
            const match = html.match(/auction\.php\?cat=[^"]+art_type=[^"]+/);
            if (!match) {
                console.warn(`[MarketURL] ❌ No market link found for artId ${artId}`);
                return null;
            }
            const rawUrl = match[0].replace(/&amp;/g, '&');
            const marketURL = `https://www.lordswm.com/${rawUrl}`;
            console.log(`[MarketURL] ❌ Had to fetch marketURL for ${artId}`);
            const updated = artCache.get(artId) || {};
            updated.marketURL = marketURL;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return marketURL;
        }

        function cpbCalc(currDura, maxDura, iniCost, repCost, effi, charge) {
            let tempMaxDura = maxDura;
            let totDura = currDura;
            let totCost = iniCost;

            const se = effi / 100;
            const sc = charge / 100;

            let minCPB = totCost / totDura;
            let optDura = tempMaxDura;
            let optFights = totDura;

            for (let i = 1; i <= maxDura; i++) {
                totCost += repCost * sc;
                const restored = Math.floor(tempMaxDura * se);
                totDura += restored;
                const cpb = totCost / totDura;

                tempMaxDura -= 1;

                if (cpb <= minCPB) {
                    minCPB = cpb;
                    optDura = tempMaxDura;
                    optFights = totDura;
                }
            }

            return [minCPB.toFixed(2), optDura, optFights];
        }

        async function AuctionPageCPB() {
            const rowData = [];

            for (let i = 2; i < rows.length; i++) {
                const cells = rows[i].children;
                const info = cells[0].textContent;
                const price = Number(cells[2].textContent.replace(/,/g, '').match(/\d+/)?.[0] || 0);

                const name = info.split('-')[1]?.split('[')[0]?.trim() || '';

                let durabilityText = info.split("Durability: ")[1] || "";
                if (durabilityText.includes("pcs")) {
                    durabilityText = durabilityText.substring(0, durabilityText.length - 6);
                }

                let [cur, max] = durabilityText.split('/') || [0, 0];
                cur = parseInt(cur, 10);
                max = parseInt(max.match(/\d+/)?.[0] || 0);

                rowData.push({ row: rows[i], name, price, cur, max });
            }
            let cacheA = artCache.get(artId);
            let repCost = await fetchRepairCost(artId);
            let shopCost = cacheA?.shopCost || 0;
            let lowestCPB = cacheA?.lowestCPB ?? null;

            for (const data of rowData) {
                const [cpb, till, fights] = cpbCalc(
                    data.cur, data.max, data.price, repCost,
                    smithEffiInput(), smithChargeInput()
                );

                const cpbCell = `<td width="100">${cpb}</td>`;
                const tillCell = `<td width="100">0/${till}</td>`;
                const fightCell = `<td width="100">${fights}</td>`;
                if (lowestCPB !== null){
                    let mapCPBCell = `<td width="100">-</td>`;
                    if (shopCost > 0 && lowestCPB !== null) {
                        const highlight = parseFloat(lowestCPB) < parseFloat(cpb) ? ' style="color:red;font-weight:bold"' : '';
                        mapCPBCell = `<td width="100"${highlight}>${lowestCPB}</td>`;
                    }

                    data.row.innerHTML += cpbCell + tillCell + fightCell + mapCPBCell; }
                else {
                    data.row.innerHTML += cpbCell + tillCell + fightCell;
                }
            }
        }

        function AuctionPageAutoSort() {
            const waitForDropdown = setInterval(() => {
                const dropdown = document.getElementById('ss');
                if (!dropdown || dropdown.dataset.cpbEnhanced) return;
                dropdown.dataset.cpbEnhanced = 'true';

                const cpbOption = new Option("Cost per Battle: Ascending", "304");
                dropdown.appendChild(cpbOption);

                // Remove default onchange handler to prevent reload
                dropdown.removeAttribute("onchange");

                dropdown.addEventListener('change', e => {
                    const value = dropdown.value;
                    if (value === "304") {
                        e.preventDefault();
                        e.stopPropagation();
                        AuctionPageSorting();
                        return false;
                    } else if (value === "0") {
                        e.preventDefault();
                        location.reload();
                        return false;
                    } else {
                        const form = dropdown.closest('form');
                        if (form) form.submit();
                    }
                });
                dropdown.value = "304";
                AuctionPageSorting();
                clearInterval(waitForDropdown);
            }, 300);
        }

        function AuctionPageSorting() {
            const dataRows = rows.slice(2);
            dataRows.sort((a, b) => parseFloat(a.children[5].textContent) - parseFloat(b.children[5].textContent));
            for (const row of dataRows) table.appendChild(row);
        }

        async function NewLotFindMarketFetch(artId) {
            try {
                const { effi, charge } = loadSmithSettings();
                const marketUrl = await fetchMarketURL(artId);
                const marketHtml = await (await fetch(marketUrl)).text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(marketHtml, 'text/html');
                const xpath = "//td[contains(text(),'Bids')]";
                const bidsEl = document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const table = bidsEl?.parentNode?.parentNode;
                if (!table) {
                    console.warn("[Market Table] Not found.");
                    return;
                }

                const rows = Array.from(table.children).slice(2); // Skip header
                console.log(`[Market Table] Found ${rows.length} data rows.`);

                const repCost = await fetchRepairCost(artId);
                const resultTable = [];
                for (const row of rows) {
                    const cells = row.children;
                    const info = cells[0]?.textContent;
                    const bidsCol = cells[1]?.textContent.trim();
                    const priceText = cells[2]?.textContent.replace(/,/g, '') || '';

                    let type = 'uncapped';
                    if (bidsCol.includes("Buy now")) type = 'fixed';
                    else if (bidsCol.includes("Buyout price")) type = 'capped';

                    const price = Number(priceText.match(/\d+/)?.[0] || 0);
                    if (price <= 0) continue;

                    let durabilityText = info.split("Durability: ")[1] || "";
                    if (durabilityText.includes("pcs")) {
                        durabilityText = durabilityText.substring(0, durabilityText.length - 6);
                    }

                    const [curRaw, maxRaw] = durabilityText.split('/');
                    const cur = parseInt(curRaw, 10);
                    const max = parseInt(maxRaw?.match(/\d+/)?.[0] || 0);
                    if (!cur || !max || max < cur) continue;

                    const [cpb] = cpbCalc(cur, max, price, repCost, 90, 100);

                    resultTable.push({
                        cur,
                        max,
                        price,
                        cpb: parseFloat(cpb),
                        type
                    });
                }

                if (resultTable.length === 0) {
                    console.warn(`⚠️ No valid lots found for ${artId}`);
                } else {
                    console.log(`✅ Parsed ${resultTable.length} valid lots.`);
                    console.table(resultTable);
                }
                NewLotAnalyzeMarketTable(resultTable);

            } catch (e) {
                console.error(`[Error] Failed to fetch or parse market data:`, e);
            }
        }

        async function fetchFacilityMinPrice(artId) {
            const url = `https://www.lordswm.com/ecostat_details.php?r=${artId}`;
            try {
                const res = await fetch(url);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const tables = Array.from(doc.querySelectorAll('table'));
                let minPrice = Infinity;

                for (const table of tables) {
                    const firstRow = table.querySelector('tr');
                    if (!firstRow || !firstRow.textContent.includes('Facility')) continue;

                    const rows = table.querySelectorAll('tr');
                    for (let i = 1; i < rows.length; i++) {
                        const cells = rows[i].querySelectorAll('td');
                        if (cells.length < 4) continue;
                        const priceText = cells[3].textContent.replace(/,/g, '').trim();
                        const price = parseInt(priceText);
                        if (!isNaN(price) && price < minPrice) {
                            minPrice = price;
                        }
                    }
                }

                return isFinite(minPrice) ? minPrice : null;

            } catch (err) {
                console.error("[Facility Fetch Error]", err);
                return null;
            }
        }

        async function parseAndCacheArtInfo(artId, html) {

            const doc = document;
            const repairMatch = html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0];
            const repairCost = repairMatch ? Number(repairMatch.replace(',', '').trim()) : 0;

            const shopBox = doc.querySelector('.s_art_inside');
            const shopTable = shopBox?.querySelector('table');
            let shopCost = 0;
            let durability = null;
            let shopCPB = null;
            let facilityPrice = null;
            let facilityCPB = null;
            let lowestCPB = null;

            if (shopTable) {
                const cells = shopTable.querySelectorAll('td');
                for (let i = 0; i < cells.length; i += 2) {
                    const icon = cells[i]?.querySelector('img');
                    const qty = Number(cells[i + 1]?.textContent.replace(',', '').trim());
                    if (!icon || isNaN(qty)) continue;

                    switch (icon.getAttribute('title')) {
                        case 'Gold': shopCost += qty; break;
                        case 'Ore':
                        case 'Wood': shopCost += qty * 180; break;
                        case 'Gems':
                        case 'Sulfur':
                        case 'Mercury':
                        case 'Crystals': shopCost += qty * 360; break;
                    }
                }

                if (shopCost > 0) {
                    durability = parseInt(doc.body.innerText.match(/Durability:\s*(\d+)\s*$/m)?.[1] || '') || null;
                    shopCPB = parseFloat((shopCost / durability).toFixed(1));
                    facilityPrice = await fetchFacilityMinPrice(artId);

                    const lastRow = shopTable.rows[shopTable.rows.length - 1];
                    const tdEq = doc.createElement('td');
                    let extras = '';
                    if (shopCPB) extras += ` (CPB: ${shopCPB})`;

                    if (facilityPrice) {
                        extras += `, Facility: ${facilityPrice}`;
                        facilityCPB = parseFloat((facilityPrice / durability).toFixed(1));
                        extras += ` (${facilityCPB})`;
                    }

                    tdEq.innerHTML = `&nbsp;&nbsp;=&nbsp;&nbsp;${goldImg}`;
                    lastRow.appendChild(tdEq);

                    const tdVal = doc.createElement('td');
                    tdVal.innerHTML = `${shopCost}${extras}`;
                    lastRow.appendChild(tdVal);

                    lowestCPB = facilityCPB !== null ? Math.min(shopCPB, facilityCPB) : shopCPB;
                }
            }

            const marketLinkMatch = html.match(/auction\.php\?cat=[^"]+art_type=[^"]+/);
            if (!marketLinkMatch) {
                console.warn(`[Cache] ❌ No market URL found for ${artId}`);
                return;
            }

            const rawUrl = marketLinkMatch[0].replace(/&amp;/g, '&');
            const marketURL = `https://www.lordswm.com/${rawUrl}`;
            const artURL = `https://www.lordswm.com/art_info.php?id=${artId}`;

            // ✅ Add/Update in artCache map
            artCache.set(artId, {
                repairCost,
                shopCost,
                shopDurability: durability,
                shopCPB: shopCPB ? parseFloat(shopCPB.toFixed(2)) : null,
                facilityPrice,
                facilityCPB,
                lowestCPB,
                artURL,
                marketURL,
            });

            // 💾 Save using the existing save function
            saveCacheToStorage();
            console.log(`[Cache] Stored for ${artId}:`, artCache.get(artId));
        }

        function NewLotPriceFromCPB(currDura, maxDura, repCost, effi, charge, targetCPB) {
            const se = effi / 100;
            const sc = charge / 100;

            let bestPrice = null;
            let bestRepairCount = 0;
            let bestTotalFights = 0;

            let tempMaxDura = maxDura;
            let totalFights = currDura;

            for (let i = 0; i <= maxDura; i++) {
                const totalCost = targetCPB * totalFights;
                const repairCostTotal = repCost * sc * i;
                const iniCost = totalCost - repairCostTotal;

                if (bestPrice === null || iniCost > bestPrice) {
                    bestPrice = iniCost;
                    bestRepairCount = i;
                    bestTotalFights = totalFights;
                }
                const restored = Math.floor(tempMaxDura * se);
                totalFights += restored;
                tempMaxDura -= 1;
            }
            return [bestPrice.toFixed(2), bestRepairCount, bestTotalFights];
        }

        function NewLotInsertCustomFlexBox() {
            const target = document.querySelector('#set_mobile_max_width');
            if (!target || !target.parentNode) {
                console.warn('❌ Could not find #set_mobile_max_width or its parent');
                return;
            }
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'stretch';
            wrapper.style.gap = '5px';
            wrapper.style.marginTop = '5px';

            target.style.width = '50%';
            target.parentNode.insertBefore(wrapper, target);
            wrapper.appendChild(target);

            const customBox = document.createElement('div');
            customBox.className = 'global_container_block eco_container_block';
            customBox.id = 'custom-flex-box';
            customBox.style.width = '50%';
            customBox.style.display = 'flex';
            customBox.style.justifyContent = 'flex-start';
            customBox.style.flexDirection = 'column';
            customBox.style.paddingLeft = '0.5em';
            customBox.style.paddingRight = '0.5em';

            const customHeader = document.createElement('div');
            customHeader.className = 'global_container_block_header';
            customHeader.id = 'rational-seller-header';
            customHeader.textContent = '🔧 Rational Seller';
            customBox.appendChild(customHeader);

            const customContent = document.createElement('div');
            customContent.textContent = 'Select an item to post a new lot with.';
            customContent.id = 'rational-seller-pre-text';
            customContent.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';
            customBox.appendChild(customContent);

            const separator1 = document.createElement('div');
            separator1.className = 'separator2';
            customBox.appendChild(separator1);

            const fields = [
                { label: 'Current durability', id: 'curr_dura' },
                { label: 'Max durability', id: 'max_dura' },
                { label: 'Repair cost', id: 'repair_cost' },
                { label: 'Target cost per battle', id: 'target_cpb' },
                { label: 'Recommended market price', id: 'recommended_price' }
            ];

            fields.forEach(field => {
                const container = document.createElement('div');
                container.style.margin = '4px 0';

                const label = document.createElement('label');
                label.textContent = field.label + ': ';
                label.setAttribute('for', field.id);
                label.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';

                const input = document.createElement('input');
                input.type = 'text';
                input.id = field.id;
                input.style = 'width: 100px;';

                container.appendChild(label);
                container.appendChild(input);
                customBox.appendChild(container);
            });

            const separator2 = document.createElement('div');
            separator2.className = 'separator2';
            customBox.appendChild(separator2);

            const customContent2 = document.createElement('div');
            customContent2.textContent = 'Here will show the results from current market lots.';
            customContent2.id = 'rational-seller-post-text';
            customContent2.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';
            customContent2.style.whiteSpace = 'pre-wrap';
            customBox.appendChild(customContent2);

            wrapper.id = 'flex-wrapper';
            wrapper.appendChild(customBox);
            document.querySelector('#target_cpb').addEventListener('input', function () {
                const curr = parseInt(document.querySelector('#curr_dura').value);
                const max = parseInt(document.querySelector('#max_dura').value);
                const rep = parseFloat(document.querySelector('#repair_cost').value);
                const targetCPB = parseFloat(document.querySelector('#target_cpb').value);

                if (isNaN(curr) || isNaN(max) || isNaN(rep) || isNaN(targetCPB)) return;

                const effi = 90; // Smith efficiency % fixed
                const charge = 100; // Smith charge % fixed

                const [price] = NewLotPriceFromCPB(curr, max, rep, effi, charge, targetCPB);
                const roundedPrice = Math.floor(price / 100) * 100;
                document.querySelector('#recommended_price').value = roundedPrice;
            });
        }

        function StyleAddSeparator() {
            if (!document.querySelector('style[data-injected="separator2"]')) {
                const style = document.createElement('style');
                style.setAttribute('data-injected', 'separator2');
                style.textContent = `
            .separator2 {
				width: 95%;
				height: 1px;
				margin: .45em .7em;
				background-color: #bdb6a8;
             }`;
                document.head.appendChild(style);
            }
        }

        function NewLotGetOptionDurability(optionText) {
            const match = optionText.match(/(\d+)\s*\/\s*(\d+)/);
            if (!match) return { cur: 0, max: 0 };

            const cur = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            return { cur, max };
        }

        function NewLotAnalyzeMarketTable(resultTable) {
            const selected = [];
            const usedIndexes = new Set();

            function pickOneRow(filterFn, sortFn) {
                const filtered = resultTable
                .map((row, index) => ({ ...row, _index: index }))
                .filter(filterFn);

                if (!filtered.length) return;

                const best = filtered.sort(sortFn)[0];

                if (!usedIndexes.has(best._index)) {
                    usedIndexes.add(best._index);
                    selected.push(best);
                }
            }

            // 1. Lowest CPB of type 'fixed'
            pickOneRow(
                row => row.type === 'fixed',
                (a, b) => a.cpb - b.cpb
            );

            // 2. Among 'fixed', select lowest CPB from lots with max durability == highest
            const fixedWithMaxDurability = resultTable
            .map((row, index) => ({ ...row, _index: index }))
            .filter(row => row.type === 'fixed');

            if (fixedWithMaxDurability.length) {
                const maxDura = Math.max(...fixedWithMaxDurability.map(r => r.max));
                pickOneRow(
                    row => row.type === 'fixed' && row.max === maxDura,
                    (a, b) => a.cpb - b.cpb
                );
            }

            // 3. Highest CPB of type 'uncapped'
            pickOneRow(
                row => row.type === 'uncapped',
                (a, b) => b.cpb - a.cpb
            );

            // 4. Lowest CPB of type 'capped'
            pickOneRow(
                row => row.type === 'capped',
                (a, b) => a.cpb - b.cpb
            );
            console.table(selected);
            NewLotDisplayHighlights(selected);
            NewLotSelectBestArtLot(resultTable);
        }

        function NewLotDisplayHighlights(lots) {
            console.log("triggered highlights in textbox");
            const lines = lots.map((lot, i) => {
                return `lot ${i + 1} - ${lot.cur}/${lot.max} for ${lot.price} , cpb = ${lot.cpb.toFixed(2)} , type = ${lot.type}`;
            });

            const output = lines.join('\n');
            const box = document.querySelector('#rational-seller-post-text');
            if (box) {
                box.textContent = output;
            } else {
                console.warn("⚠️ #rational-seller-post-text element not found.");
            }

        }

        function NewLotSelectBestArtLot(lots) {
            console.log("triggered single best lot finder");
            const fixedLots = lots.filter(lot => lot.type === 'fixed');
            if (fixedLots.length === 0) {
                const cappedLots = lots.filter(lot => lot.type === 'capped');
                return cappedLots.sort((a, b) => a.cpb - b.cpb)[0] || null;
            }

            // Sort by CPB ascending
            const sorted = [...fixedLots].sort((a, b) => a.cpb - b.cpb);

            const top3 = sorted.slice(0, 3);

            const best = top3.reduce((acc, lot) => {
                if (!acc || lot.max > acc.max) return lot;
                return acc;
            }, null);
            document.querySelector('#target_cpb').value = best.cpb;

            setTimeout(() => {
                document.querySelector('#target_cpb').dispatchEvent(new Event('input'));
            }, 0);
        }

        function NewLotSelectBestElementPrice(lots) {
            console.log("🔍 Selecting best element lot with 3rd-price strategy");

            const fixedLots = lots.filter(lot => lot.type === 'fixed').sort((a, b) => a.price - b.price);

            let best = null;

            if (fixedLots.length >= 3) {
                best = fixedLots[2];
            } else if (fixedLots.length > 0) {
                best = fixedLots[fixedLots.length - 1];
            } else {
                const cappedLots = lots.filter(lot => lot.type === 'capped').sort((a, b) => a.price - b.price);
                if (cappedLots.length > 0) {
                    best = cappedLots[0];
                }
            }

            if (best) {
                setTimeout(() => {
                    document.querySelector('#recommended_price').value = best.price;
                }, 0);
            } else {
                console.warn("⚠️ No valid element lots found to recommend.");
            }
        }

        async function NewLotFetchElements(artType) {
            try {
                const marketUrl = `https://www.lordswm.com/auction.php?cat=elements&art_type=${artType}`;
                console.log(`[Element] ✅ Found Market URL: ${marketUrl}`);
                const marketHtml = await (await fetch(marketUrl)).text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(marketHtml, 'text/html');
                const xpath = "//td[contains(text(),'Bids')]";
                const bidsEl = document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const table = bidsEl?.parentNode?.parentNode;
                if (!table) {
                    console.warn("[Market Table] Not found.");
                    return;
                }
                //because this is elements, keep only Price and Type
                const rows = Array.from(table.children).slice(2);
                console.log(`[Market Table] Found ${rows.length} data rows.`);

                const resultTable = [];
                for (const row of rows) {
                    const cells = row.children;
                    const info = cells[0]?.textContent;
                    const bidsCol = cells[1]?.textContent.trim();
                    const priceText = cells[2]?.textContent.replace(/,/g, '') || '';

                    let type = 'uncapped';
                    if (bidsCol.includes("Buy now")) type = 'fixed';
                    else if (bidsCol.includes("Buyout price")) type = 'capped';

                    const price = Number(priceText.match(/\d+/)?.[0] || 0);
                    if (price <= 0) continue;

                    resultTable.push({
                        price,
                        type
                    });
                }
                if (resultTable.length === 0) {
                    console.warn(`⚠️ No valid lots found for ${artId}`);
                } else {
                    console.log(`✅ Parsed ${resultTable.length} valid lots.`);
                    console.table(resultTable); // ← View the table directly in console
                }
                NewLotSelectBestElementPrice(resultTable);
            } catch (e) {
                console.error(`[Error] Failed to fetch or parse market data:`, e);
            }
        }

        async function mainAuctionNewLot() {
            if (!getFlag(RATIONAL_SELLER_FLAG, false)) return;
            if (!location.pathname.includes('auction_new_lot.php')) return;

            const sel = document.querySelector('#sel');
            if (!sel) return;

            StyleAddSeparator();
            window.addEventListener('load', NewLotInsertCustomFlexBox);

            sel.addEventListener('change', async () => {
                const val = sel.value;
                console.log(`[Step 1] Selected value: ${val}`);
                const selectedText = sel.options[sel.selectedIndex].textContent;
                if (val.includes("@")) {
                    artId = val.split("@")[0];
                    await NewLotFindMarketFetch(artId);
                    const { cur, max } = NewLotGetOptionDurability(selectedText);
                    let repairCost = await fetchRepairCost(artId);

                    document.querySelector('#repair_cost').value = repairCost;
                    document.querySelector('#curr_dura').value = cur;
                    document.querySelector('#max_dura').value = max;
                    document.querySelector('#rational-seller-pre-text').textContent = 'Selected '+ selectedText;
                }
                else if (val.includes("EL_")){
                    const ELEMENT_NAME_TO_ART_TYPE = {
                        "abrasive": "abrasive",
                        "fern flower": "fern_flower",
                        "fire crystal": "fire_crystal",
                        "ice crystal": "ice_crystal",
                        "meteorite shard": "meteorit",
                        "moonstone": "moon_stone",
                        "tiger`s claw": "tiger_tusk",
                        "toadstool": "badgrib",
                        "viper venom": "snake_poison",
                        "windflower": "wind_flower",
                        "witch bloom": "witch_flower"
                    };
                    const name = selectedText.split(' (')[0].trim().toLowerCase();
                    const artType = ELEMENT_NAME_TO_ART_TYPE[name];
                    if (!artType) {
                        console.warn(`[Element] ❌ No mapping found for element name: "${name}"`);
                        return;
                    }
                    document.querySelector('#repair_cost').value = "";
                    document.querySelector('#curr_dura').value = "";
                    document.querySelector('#max_dura').value = "";
                    document.querySelector('#target_cpb').value = "";
                    document.querySelector('#rational-seller-post-text').textContent = "";
                    document.querySelector('#rational-seller-pre-text').textContent = 'Selected ' + selectedText;
                    NewLotFetchElements(artType);
                }
                else {
                    console.log("[Step 0] Not an artifact or element, aborting.");
                    return;
                }

            });
        }

        async function mainAuctionPage() {
            if (!getFlag(RATIONAL_AUCTIONS_FLAG, false)) return;
            if (!location.pathname.includes('auction.php')) return;

            const excludedCategories = ['part', 'elements', 'obj_share', 'cert', 'dom'];
            const cat = new URL(location.href).searchParams.get("cat");
            if (excludedCategories.includes(cat) || !cat) return;

            artId = new URL(location.href).searchParams.get("art_type");
            if (!artId) return;
            console.log('Found Art = '+ artId);
            const result = AuctionPageMarketTableRows(document);
            table = result.table;
            rows = result.rows;
            AuctionPageAddSmithSettings();
            AuctionPageAddColumns();
            await AuctionPageCPB();
            AuctionPageAutoSort();
        }

        async function mainArtInfo() {
            if (!location.pathname.includes('art_info.php')) return;

            const url = new URL(location.href);
            const artId = url.searchParams.get("id");

            const html = document.body.innerHTML;
            await parseAndCacheArtInfo(artId, html);
        }

        loadCacheFromStorage();
        mainAuctionNewLot();
        mainArtInfo();
        mainAuctionPage();
    }

    // ========== Bulk Transfer Arts ==========

    const BULK_TRANSFER_FLAG = 'bulk_transfer_enabled';

    function injectBulkTransferSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(BULK_TRANSFER_FLAG, false);

        const div = document.createElement('div');
        div.id = 'bulk_transfer_settings_wrapper';
        div.innerHTML = `
        <strong>Bulk Transfer Arts</strong>
        <label>
            <input type="checkbox" id="bulk_transfer_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable bulk repair, sales, and lease
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#bulk_transfer_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BULK_TRANSFER_FLAG, enabled);
            initbulkTransferArts();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function initbulkTransferArts(){

        if (!getFlag(BULK_TRANSFER_FLAG, false)) return;
        if (!location.pathname.includes('inventory.php')) return;

        let artId, repairContainer, leaseContainer;
        let broken_arts = [];
        let REPAIR_PRICE = 101;
        const artCache = new Map();
        const STORAGE_KEY = 'lwm_art_data_cache';

        function h(el, attrs = {}, ...children) {
            let element = document.createElement(el);
            Object.entries(attrs).forEach(([key, value]) => {
                element[key] = value;
            });
            if (children.length > 0) {
                element.append(...children);
            }
            return element;
        }
        let enterSmithName = h("input", {
            type: "text",
            required: "true",
            name: "nick",
            placeholder: "Enter smith name",
        });
        let transferBulkIcon = h("img", {
            src: "https://dcdn.lordswm.com/i/inv_im/btn_art_transfer.png",
            className: "show_hint inv_item_select_img",
        });
        transferBulkIcon.setAttribute("hwm_hint_added", "1");
        transferBulkIcon.setAttribute("hint", "Transfer");
        addHints(transferBulkIcon);

        let transferBulk = h(
            "button",
            { className: "inv_item_select inv_item_select_img", type: "submit" },
            transferBulkIcon
        );
        transferBulk.style.border = "none";
        transferBulk.style.background = "none";

        function loadCacheFromStorage() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            try {
                const obj = JSON.parse(raw);
                for (const [key, val] of Object.entries(obj)) {
                    artCache.set(key, val);
                }
            } catch (e) {
                console.warn("Failed to parse the art cache: ", e);
            }
        }

        loadCacheFromStorage();

        function saveCacheToStorage() {
            const obj = Object.fromEntries(artCache);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        }

        async function fetchRepairCost(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.repairCost) {
                    console.log(`[Cache] ✅ Found Repair Cost for ${artId} via cache`);
                    return Number(entry.repairCost);
                }
            }
            const url = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(url);
            const html = await resp.text();
            const valueRaw = html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0];
            const value = valueRaw ? Number(valueRaw.replace(',', '').trim()) : null;

            console.log(`[Cache] ❌ Had to fetch Repair Cost for ${artId} via website`);
            let updated = artCache.get(artId) || {};
            updated.repairCost = value;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return value ?? 0;
        }

        function addHints(el) {
            el.addEventListener("mousemove", show_hwm_hint);
            el.addEventListener("touchstart", show_hwm_hint);
            el.addEventListener("mouseout", hide_hwm_hint);
            el.addEventListener("touchend", hide_hwm_hint);
        }
        let actions = h(
            "form",
            { className: "filter_tabs_block_outer" },
            h("div", { className: "lwm_GM_smith_name" }, enterSmithName, transferBulk),
            h("div", { className: "separator2" }),
            h("input", {
                id: "rep_price",
                type: "text",
                className: "lwm_GM_repair_price",
                readonly: true,
                value: "The repair cost is set to " + REPAIR_PRICE + "%",
            }),
            h("div", { className: "separator2" }),
            h("div", { className: "lwm_GM_pricing_table" }, ...createRepairPriceTable())
        );
        const leaseToggleBtn = h("button", {
            textContent: "Switch to Lease/Sell",
            type: "button",
            style: `
    width: 100%;
    padding: 0.3em;
    font-family: verdana, geneva, arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    color: #592c08;
    background: #f4ecd3;
    border: 1px solid #5d413a;
    cursor: pointer;
    text-align: center;
    text-decoration: underline;
  `,
            onclick: () => {
                leaseContainer = createLeaseSellContainer(); // (or create once if static)
                mount(leaseContainer);
            },
        });
        (async () => {
            for (let art of arts) {
                if (art.durability1 == 0) {
                    let artEl = h("div", {
                        innerHTML: art.html,
                        className: "inventory_item_div",
                    });

                    const cost = await fetchRepairCost(art.art_id);

                    if (cost === null || cost === 0) {
                        artEl.querySelector(".cre_mon_image1").style.filter =
                            "sepia(0.3) grayscale(0.7)";
                        artEl.querySelector(".cre_mon_image2").style.filter =
                            "sepia(1) grayscale(0.3)";
                    } else {
                        artEl.addEventListener("click", () => {
                            art.bulk_repair_selected = !art.bulk_repair_selected;
                            artEl.classList.toggle("lwm_GM_selected_border");
                        });
                        addHints(artEl.querySelector(".cre_mon_image2"));
                    }

                    broken_arts.push(artEl);
                }
            }




            repairContainer = h(
                "div",
                { className: "container_block_right", id: "repair-container" },
                h(
                    "div",
                    { className: "container_block" },
                    // ⬇️ Insert button and separator inline at the top
                    h("div", {}, leaseToggleBtn),
                    h("div", { className: "separator2" }),
                    // ⬇️ Then Broken Items line
                    h(
                        "div",
                        { className: "arts_predmeti" },
                        document.createTextNode(
                            "Broken Items: " +
                            broken_arts.length +
                            " / " +
                            arts.filter((_) => _.slot >= 0).length
                        )
                    ),
                    h("div", { className: "separator2" }),
                    actions,
                    h("div", { className: "separator2" }),
                    h("div", { className: "inventory_block" }, ...(broken_arts.length ? broken_arts : [h("div", { textContent: "No broken artifacts found." })]))
                )
            );

            repairContainer.style.width = "100%";
            repairContainer.style.flex = "2";
            repairContainer.style.height = "fit-content";

            container_inventory.querySelector(".container_block_right").style.width = "";
            container_inventory.querySelector(".container_block_right").style.flex = "2";
            container_inventory.querySelector(".container_block_right").style.height = "fit-content";

            mount(repairContainer);
        })();


        function addBump(event) {
            if (event.target.dataset.mode === "bump") {
                REPAIR_PRICE = REPAIR_PRICE + Number(event.target.dataset.size);
            } else {
                REPAIR_PRICE = Number(event.target.dataset.size);
            }
            document.getElementById("rep_price").value =
                "The repair cost is set to " + REPAIR_PRICE + "%";
        }

        function createRepairPriceTable() {
            let table = [];
            for (let i = 10; i <= 100; i += 10) {
                let btn = h("button", { textContent: i + "%", type: "button" });
                btn.dataset.mode = "fixed";
                btn.dataset.size = i;
                btn.addEventListener("click", addBump);
                table.push(btn);
            }
            let plusOneBtn = h("button", { textContent: "+" + 1 + "%", type: "button" });
            plusOneBtn.dataset.mode = "bump";
            plusOneBtn.dataset.size = 1;
            plusOneBtn.addEventListener("click", addBump);
            table.push(plusOneBtn);
            let plusTenBtn = h("button", { textContent: "+" + 10 + "%", type: "button" });
            plusTenBtn.dataset.mode = "bump";
            plusTenBtn.dataset.size = 10;
            plusTenBtn.addEventListener("click", addBump);
            table.push(plusTenBtn);
            let resetBtn = h("button", { textContent: "Reset", type: "button" });
            resetBtn.dataset.mode = "fixed";
            resetBtn.dataset.size = 101;
            resetBtn.addEventListener("click", addBump);
            table.push(resetBtn);
            return table;
        }

        actions.addEventListener("submit", async (event) => {
            transferBulk.type = "button";
            event.preventDefault();
            event.stopPropagation();
            let form = new FormData(event.target);
            let selectedArts = arts.filter((_) => _.bulk_repair_selected);
            let toBeFixed;

            if (selectedArts.length > 0) {
                toBeFixed = selectedArts;
            } else {
                toBeFixed = [];
                for (const art of arts) {
                    if (art.durability1 == 0) {
                        const cost = await fetchRepairCost(art.art_id);
                        if (cost !== 0) {
                            toBeFixed.push(art);
                        }
                    }
                }
            }

            for (const artToBeFixed of toBeFixed) {
                const baseRepairCost = await fetchRepairCost(artToBeFixed.art_id); // use await here
                if (baseRepairCost == 0) continue;

                let body = new URLSearchParams();
                body.set("nick", form.get("nick"));
                body.set("id", artToBeFixed.id);
                body.set("sendtype", "5");
                body.set("dtime", "0");
                body.set("bcount", "0");
                body.set("art_id", "");
                body.set("rep_price", (baseRepairCost * (REPAIR_PRICE / 100)).toFixed(0));
                body.set("sign", sign);

                await fetch("https://www.lordswm.com/art_transfer.php", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        referer: `https://www.lordswm.com/art_transfer.php?id=${artToBeFixed.id}`,
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    redirect: "manual",
                    body,
                }).catch(() => {});
            }
            window.location.reload();
        });

        function showRepairContainer() {
            const existing = document.getElementById("lease-sell-container");
            if (existing) existing.remove();
            container_inventory.appendChild(repairContainer);
        }

        function createLeaseSellContainer() {
            const leaseArts = arts.filter(a => a.durability1 >= 0 && a.slot >= 0 && a.transfer_ok === 1);
            const leaseArtElements = leaseArts.map(art => {
                const el = h("div", {
                    innerHTML: art.html,
                    className: "inventory_item_div",
                });

                art.bulk_lease_selected = false;
                el.addEventListener("click", () => {
                    art.bulk_lease_selected = !art.bulk_lease_selected;
                    el.classList.toggle("lwm_GM_selected_border");
                });

                addHints(el.querySelector(".cre_mon_image2"));
                return el;
            });

            const enterNickForLease = h("input", {
                type: "text",
                required: true,
                name: "nick",
                placeholder: "Enter recipient name",
            });

            const priceInput = h("input", {
                type: "number",
                name: "gold",
                min: "0",
                placeholder: "Price",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const priceLabel = h("label", { textContent: "Specify Price", style: "margin-right: 1em;" });

            const sendtype1 = h("input", {
                type: "radio",
                name: "sendtype",
                value: "1",
                id: "sendtype1",
                checked: true,
            });
            const sendtypeLabel1 = h("label", {
                htmlFor: "sendtype1",
                textContent: "Transfer into ownership",
                style: "margin-right: 1em;",
            });

            const sendtype2 = h("input", {
                type: "radio",
                name: "sendtype",
                value: "2",
                id: "sendtype2",
            });
            const sendtypeLabel2 = h("label", {
                htmlFor: "sendtype2",
                textContent: "Transfer with recall in",
            });

            const dtimeInput = h("input", {
                type: "number",
                name: "dtime",
                min: "0",
                placeholder: "Days",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const dtimeLabel = h("label", { textContent: "Recall in days", style: "margin-right: 1em;" });

            const bcountInput = h("input", {
                type: "number",
                name: "bcount",
                min: "0",
                placeholder: "Combats",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const bcountLabel = h("label", { textContent: "No. of combats" });

            const repPriceHidden = h("input", {
                type: "hidden",
                name: "rep_price",
                value: "0",
            });

            const leaseTransferImg = h("img", {
                src: "https://dcdn.lordswm.com/i/inv_im/btn_art_transfer.png",
                className: "show_hint inv_item_select_img",
            });
            leaseTransferImg.setAttribute("hint", "Transfer All");
            leaseTransferImg.setAttribute("hwm_hint_added", "1");
            addHints(leaseTransferImg);

            const leaseSubmitBtn = h(
                "button",
                {
                    className: "inv_item_select inv_item_select_img",
                    type: "submit",
                    style: "border: none; background: none;",
                },
                leaseTransferImg
            );

            const leaseFormRow = h("div", { className: "lwm_GM_smith_name" }, enterNickForLease, leaseSubmitBtn);

            const leaseForm = h(
                "form",
                {
                    className: "filter_tabs_block_outer",
                    id: "lease-form"
                },
                leaseFormRow,
                h("div", { className: "separator2" }),
                h("div", { className: "lwm_GM_smith_name" }, priceInput, priceLabel),
                h("div", { className: "separator2" }),
                h("div", {}, sendtype1, sendtypeLabel1, sendtype2, sendtypeLabel2),
                h("div", { className: "separator2" }),
                h("div", { className: "lwm_GM_smith_name" }, dtimeInput, dtimeLabel, bcountInput, bcountLabel),
                repPriceHidden
            );

            leaseForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const form = new FormData(event.target);

                const selectedArts = arts.filter((a) => a.bulk_lease_selected);

                for (const artToSend of selectedArts) {
                    const body = new URLSearchParams();
                    body.set("nick", form.get("nick"));
                    body.set("id", artToSend.id);
                    body.set("sendtype", form.get("sendtype")); // 1 or 2
                    body.set("dtime", form.get("dtime") || "0");
                    body.set("bcount", form.get("bcount") || "0");
                    body.set("art_id", "");
                    body.set("rep_price", "0");
                    body.set("gold", form.get("gold") || "0");
                    body.set("sign", sign);

                    await fetch("https://www.lordswm.com/art_transfer.php", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            referer: `https://www.lordswm.com/art_transfer.php?id=${artToSend.id}`,
                            "content-type": "application/x-www-form-urlencoded",
                        },
                        redirect: "manual",
                        body,
                    }).catch(() => {});
                }

                window.location.reload();
            });

            const backToRepairBtn = h("button", {
                textContent: "Switch to Repairs",
                type: "button",
                style: `
    width: 100%;
    padding: 0.3em;
    font-family: verdana, geneva, arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    color: #592c08;
    background: #f4ecd3;
    border: 1px solid #5d413a;
    cursor: pointer;
    text-align: center;
    text-decoration: underline;
  `,
                onclick: () => {
                    mount(repairContainer);
                },
            });


            const leaseContainer = h(
                "div",
                { className: "container_block_right", id: "lease-sell-container" },
                h(
                    "div",
                    { className: "container_block" },
                    h("div", {}, backToRepairBtn),
                    h("div", { className: "separator2" }),
                    h(
                        "div",
                        { className: "arts_predmeti" },
                        document.createTextNode(`Leasable / Sellable Items: ${leaseArts.length}`)
                    ),
                    h("div", { className: "separator2" }),
                    leaseForm,
                    h("div", { className: "separator2" }),
                    h("div", { className: "inventory_block" }, ...leaseArtElements)
                )
            );

            leaseContainer.style.width = "100%";
            leaseContainer.style.flex = "2";
            leaseContainer.style.height = "fit-content";

            return leaseContainer;
        }

        function addStyle(){
            const style = document.createElement("style");
            style.innerText = `
.lwm_GM_selected_border {
border: 2px solid green;
}.lwm_GM_smith_name {
display: flex;
	align-items: center;
gap: 0.4em;
}.lwm_GM_pricing_table {
width: min-content;
gap: 0.4em 0.4em;
display: grid;
	grid-template-columns: repeat(4, 1fr);
	place-items: center;
}.lwm_GM_pricing_table > button {
padding: 1em;
width: 70px;
border: 1px #5d413a solid;
background: none;
cursor: pointer;
	font-size: 9pt;
color: #592c08;
	font-weight: bold;
	text-decoration: underline;
	font-family: verdana, geneva, arial cyr;
}input.lwm_GM_repair_price {
width: 300px;
background: none;
border: none;
}.inventory_block {
justify-content: flex-start !important;
}
`;
            document.head.appendChild(style);
        }

        addStyle();

        function mount(containerToShow) {
            document.getElementById("repair-container")?.remove();
            document.getElementById("lease-sell-container")?.remove();
            container_inventory.appendChild(containerToShow);
            alwaysShowDurability();
        }

        function alwaysShowDurability() {
            document.querySelectorAll('.art_durability_hidden').forEach(el => {
                el.style.display = 'block';
            });
        }

        alwaysShowDurability();

    }

    // ========== Endless Inventory Sets ==========

    const MORE_INV_SETS_FLAG = 'more_inv_sets_enabled';

    function injectMoreInvSetsSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(MORE_INV_SETS_FLAG, false);

        const div = document.createElement('div');
        div.id = 'more_inv_sets_settings_wrapper';
        div.innerHTML = `
        <strong>More Inventory Sets</strong>
        <label>
            <input type="checkbox" id="more_inv_sets_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Additional Set slots
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#more_inv_sets_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(MORE_INV_SETS_FLAG, enabled);
            initMoreInvSets();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function initMoreInvSets() {

        if (!getFlag(MORE_INV_SETS_FLAG, false)) return;
        if (!location.pathname.includes('inventory.php')) return;

        'use strict';
        const STORAGE_KEY = 'lwm_custom_inventory_sets';

        function loadSets() {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        }

        function saveSets(sets) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
        }

        function getEquippedArtifactIds() {
            const equipped = [];
            document.querySelectorAll('[onClick^="javascript: try_undress("]').forEach(el => {
                const match = el.getAttribute('onClick').match(/try_undress\((\d+)\)/);
                if (match) equipped.push(Number(match[1]));
            });
            return equipped;
        }


        function createButton(label, onClick, style = '') {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = 'btn_standard inv_cut_text btn_txt_hover';
            btn.style.cursor = 'pointer';
            btn.style.height = '24px';
            btn.style.fontSize = '12px';
            btn.style.fontFamily = 'Arial, Helvetica, sans-serif';
            btn.style.textAlign = 'center';
            btn.style.padding = '0px 6px';
            btn.style.outline = 'none';
            btn.style.border = 'none';
            //btn.title = label;
            if (style) Object.assign(btn.style, style);
            btn.addEventListener('click', onClick);
            return btn;
        }

        function refreshButtons() {
            const container = document.querySelector('#container_inventory > div.container_block_left > div > div.inv_note_kukla');
            if (!container) return;
            const existing = document.getElementById('custom-set-buttons');
            if (existing) existing.remove();
            const wrapper = document.createElement('div');
            wrapper.id = 'custom-set-buttons';
            wrapper.className = 'inv_hidden_block inv_hidden_block_showed';
            const sets = loadSets();
            sets.forEach((set, index) => {
                wrapper.appendChild(createButton(`${set.name}`, () => loadSet(set)));
                wrapper.appendChild(createButton(`Delete ${index+11}`, () => {
                    if (confirm(`Delete set "${set.name}"?`)) {
                        sets.splice(index, 1);
                        saveSets(sets);
                        refreshButtons();
                    }
                }));
            });

            wrapper.appendChild(createButton('Create New Set', () => {
                localStorage.setItem("LWM_createSetFlag", "true");
                location.reload();
            }, { fontWeight: 'bold', title: 'Create a New Custom Set' }));
            wrapper.style.display = 'grid';
            wrapper.style.gridTemplateColumns = 'auto auto';
            wrapper.style.gap = '4px 8px';
            container.appendChild(wrapper);
        }

        function callTryDressByIdWithPromise(id) {
            return new Promise((resolve, reject) => {
                const art = Object.values(arts).find(a => a.id == id);
                if (!art) return reject(`Artifact ${id} not found in arts`);
                const k = art.pos_dress;
                const url = `inventory.php?dress=${id}&js=1&last_ring_dress=${last_ring_dress}&rand=${Math.random() * 1000000}`;
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve();
                        } else {
                            reject(`Failed to equip artifact ${id}: ${xhr.status}`);
                        }
                    }
                };
                xhr.send(null);
            });
        }

        function createProgressBox(total) {
            let box = document.createElement('div');
            box.id = 'equipProgressBox';
            box.style.position = 'fixed';
            box.style.top = '50%';
            box.style.left = '50%';
            box.style.transform = 'translate(-50%, -50%)';
            box.style.background = 'rgba(0, 0, 0, 0.85)';
            box.style.color = '#fff';
            box.style.padding = '20px 30px';
            box.style.borderRadius = '10px';
            box.style.zIndex = '9999';
            box.style.fontSize = '16px';
            box.style.fontWeight = 'bold';
            box.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
            box.textContent = `Equipping artifacts... 0 of ${total} equipped`;
            document.body.appendChild(box);
        }

        function updateProgressBox(current, total) {
            const box = document.getElementById('equipProgressBox');
            if (box) box.textContent = `Equipping artifacts... ${current} of ${total} equipped`;
        }

        function removeProgressBox() {
            const box = document.getElementById('equipProgressBox');
            if (box) box.remove();
        }


        async function loadSet(set) {
            const undressBtn = document.getElementById('undress_all_div');
            const ids = set.ids;
            const total = ids.length;
            if (undressBtn) undressBtn.click();
            createProgressBox(total);
            await new Promise(r => setTimeout(r, 1000));

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                try {
                    await callTryDressByIdWithPromise(id);
                    console.log(`Equipped ${id}`);
                } catch (err) {
                    console.warn(err);
                }
                updateProgressBox(i + 1, total);
            }
            console.log("All artifacts attempted.");
            removeProgressBox();
            location.reload();

        }

        window.addEventListener("load", () => {
            if (localStorage.getItem("LWM_createSetFlag") === "true") {
                localStorage.removeItem("LWM_createSetFlag");
                const equipped = getEquippedArtifactIds();
                if (equipped.length === 0) {
                    alert("No artifacts are currently equipped.");
                    return;
                }
                const name = prompt("Enter a name for this set:");
                if (!name) return;
                const sets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                sets.push({ name, ids: equipped });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
                alert("Set saved successfully!");
            }
        });
        window.addEventListener('load', () => {
            refreshButtons();
        });

    }

    // ========== Master Panel Visibility ==========

    const MASTER_PANEL_FLAG = 'master_panel_enabled';
    //if (!getFlag(MASTER_PANEL_FLAG, true)) return;
    function injectMasterPanelSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(MASTER_PANEL_FLAG, true); //defaults to true

        const div = document.createElement('div');
        div.id = 'master_panel_settings_wrapper';
        div.innerHTML = `
        <strong>Master Panel</strong>
        <label>
            <input type="checkbox" id="master_panel_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable the Floating Window Panel
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#master_panel_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(MASTER_PANEL_FLAG, enabled);
            createPanel();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    // ========== Battle Tooltip ==========
    /*
	const BATTLE_TOOLTIP_FLAG = 'battle_tooltip_enabled';

    function injectBattleTooltipSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(BATTLE_TOOLTIP_FLAG, false);

        const div = document.createElement('div');
        div.id = 'battle_tooltip_settings_wrapper';
        div.innerHTML = `
        <strong>Battle Tooltip</strong>
        <label>
            <input type="checkbox" id="battle_tooltip_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable melee and magic damage helper
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#battle_tooltip_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BATTLE_TOOLTIP_FLAG, enabled);
			initBattleDamageCalcTooltips();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }


// How to use-
// 1.) Shows the damage of all stacks from one side to a selected stack on the other side.
// 2.) If you hover over one creature, press 'E' (Russian 'У'), and do the same with another, the damage from the first to the second will appear in the chat. Additional selections and animation speed settings are in the battle settings.
// that damage coefficient setting just says how much of the enemy will die from the attack
// Distance between stacks – The distance between the attacking and defending stacks, selected using arrow keys in the text field below. Affects archer damage type (melee/ranged, straight/curved shot), scatter, and other distance-dependent abilities.
// If you set "Distance: 1", the archer is considered blocked.
// If distance > 1, the archer is considered unblocked, even if an enemy is adjacent.
// the chat will always show the magic damage if you click open, just select which target it is and itll show damage from every spell on enemy team.
//
*/

    // ========== New Module ==========
    // ========== New Module ==========
    // ========== New Module ==========
    // ========== New Module ==========

    async function renderOtherModules(){
        incomingArtPanel();
        setCheckerPanel();
    }

    function renderOtherSettings(){
        injectMasterPanelSettings();
        injectSetCheckerSettings();
        injectRationalAuctionsSettings();
        injectRationalSellerSettings();
        injectDarkModeSettings();
        injectInvToLotSettings();
        injectIncomingArtSettings();
        injectBulkTransferSettings();
        injectMoreInvSetsSettings();
        injectHGMGThresholdSettings();
        injectBattleTooltipSettings();
    }

    // ========== Start ==========

    function injectFloatingPanelStyles() {
        if (!document.querySelector('style[data-injected="floating_panel"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-injected', 'floating_panel');
            style.textContent = `
		/* Main container styled like sh_dd_container */
.lwm_custom_container {
    z-index: 1000;
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: inline-block;
    padding: .5em .5em 1em .5em;
    background:
        url(https://www.lordswm.com/i/new_top/mm_dd_decorS.png) no-repeat,
        url(https://www.lordswm.com/i/new_top/mm_dd_decorS.png) no-repeat,
        url(https://www.lordswm.com/i/new_top/mm_dd_tile.jpg) top left,
        #314657;
    background-position:
        -32px 100%,
        calc(100% + 32px) 100%,
        top left;
    background-size:
        64px 16px,
        64px 16px,
        auto;
    border-radius: 6px;
    box-shadow:
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 0 0 1px #e2b77d,
        0 1px 7px rgba(0,0,0,.7);
    color: #fad49f;
    font-family: Arial, sans-serif;
    font-size: 12px;
    min-width: 180px;
}

/* Decorative elements
.lwm_custom_decor_top {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(https://www.lordswm.com/i/new_top/mm_decor3.png) no-repeat center;
}
.lwm_custom_decor_bottom {
    width: 8px;
    height: 8px;
    position: absolute;
    bottom: 1px;
    left: 50%;
    transform: translate(-50%, 50%);
    background: url(https://www.lordswm.com/i/new_top/mm_decor2.png) no-repeat center;
} */

/* Header */
.lwm_custom_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-bottom: 4px;
    cursor: pointer;
}
/* Each module/row block */
.lwm_custom_module {
    min-width: 145px;
    color: #fad49f;
    cursor: pointer;
    padding: .5em;
    margin: 5px 8px;
    text-align: center;
    background-color: #866c4f;
    border-radius: 4px;
    transition-duration: .1s;
    box-shadow:
        inset 0 0 0 1px #e2b77d,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -13px 5px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
    text-shadow: 0 0 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,1);
}
.lwm_custom_module:hover {
    filter: brightness(110%);
    box-shadow:
        0 0 10px #fad49f,
        inset 0 0 0 1px #fad49f,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -5px 10px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
}
/* Settings popup */
.lwm_custom_popup_centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #e2b77d;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 1001;
    min-width: 360px;
    max-width: 360px;
    min-height: 440px;
    max-height: 440px;
    box-shadow: 0 0 10px rgba(0,0,0,0.7);
    font-size: 13px;
}
`;
            document.head.appendChild(style);
        }
    }

async function initSchedulesPanel() {
    minimized = await getValue('panel_minimized', false);
    if (window.location.pathname === '/home.php'){
        detectPremium();
        detectSignValue();
    }
    if (window.location.pathname === '/war.php') {
        minimized = true;
    }
    if (window.location.pathname === '/pers_navlinks.php') {
        //window.addEventListener('load', () => {
        const form = document.querySelector('form[name="tt"]');
        if (!form) return;

        const container = document.createElement('div');
        container.style.marginTop = '20px';
        container.innerHTML = `
                <hr>
                <h3>LWM Scheduler Module Settings</h3>
                <div id="lwm-settings-list"></div>
            `;
            form.appendChild(container);
            renderSettingsList(); // Same function for the settings
            //});
        }

        if (!getFlag(MASTER_PANEL_FLAG, true))
        {
            return;
        }
        else {
            createPanel();
            await renderModules();
        }
        await initHuntModule();
        await initSmithModule();
        await initEnchantModule();
        await initMGModule();
        await initLaborersModule();
        await initThievesModule();

        if (window.location.pathname === '/war.php') {
            setTimeout(() => {
                setValue(MODULES.thieves.lastCheckedKey, 0);
                setValue(MODULES.hunt.lastCheckedKey, 0);
                setValue(MODULES.mg.lastCheckedKey, 0);
            }, 10000);
            //this will reset thieves check timer if you start a battle.
        }
        //setTimeout(() => initSchedulesPanel(), recheckCooldownShort+10000);
    }

(async function main() {
    injectFloatingPanelStyles();

    enableDarkMode();
    inventoryToAuctionLot();
    rationalMarketEnjoyer();
    initbulkTransferArts();
    initMoreInvSets();
    await initSchedulesPanel();
    await incomingTransferAlerts();
    await initSetChecker();
    //initBattleDamageCalcTooltips();
    //if (!location.pathname.includes('auction_new_lot.php')) return;
})();

})();
