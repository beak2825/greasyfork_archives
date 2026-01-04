// ==UserScript==
// @name         Torn OC Scenario Tracker
// @namespace    http://tampermonkey.net/
// @version      3.21
// @description  Tracks completed organized crime scenarios by intercepting XHR and Fetch requests
// @author       Allenone[2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/530656/Torn%20OC%20Scenario%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/530656/Torn%20OC%20Scenario%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINT = 'https://tornprobability.com:3000/api/scenarios';
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const request = GM_xmlhttpRequest || GM.xmlHttpRequest;

    const processedScenarios = new Set(GM_getValue('processedScenarios', []));

    async function submitScenarioData(scenarioData) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: API_ENDPOINT,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(scenarioData),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve();
                    } else {
                        reject(new Error('API error'));
                    }
                },
                onerror: reject
            });
        });
    }

    function sanitizeRoleName(name) {
        if (!name || typeof name !== 'string') return 'Unknown';
        const sanitized = name.replace(/^[-\_]+|[-\_]+$/g, '').trim(); // Remove leading/trailing - and _
        return sanitized.length > 0 ? sanitized : 'Unknown'; // Return 'Unknown' if empty
    }

    function buildRoleMappings(playerSlots) {
        const memberRoles = new Map();
        const sortedSlots = playerSlots.slice().sort((a, b) => {
            const posA = parseInt(a.key.match(/\d+/)?.[0] || 0, 10);
            const posB = parseInt(b.key.match(/\d+/)?.[0] || 0, 10);
            return posA - posB;
        });

        const roleRegistry = new Map();
        sortedSlots.forEach(slot => {
            const role = sanitizeRoleName(slot.name);
            roleRegistry.set(role, (roleRegistry.get(role) || 0) + 1);
        });

        const roleCounts = new Map();
        sortedSlots.forEach(slot => {
            const role = sanitizeRoleName(slot.name);
            const total = roleRegistry.get(role);
            const count = (roleCounts.get(role) || 0) + 1;
            roleCounts.set(role, count);
            const displayName = total > 1 ? `${role} ${count}` : role;
            memberRoles.set(`userId-${slot.player.ID}`, displayName);
        });

        return memberRoles;
    }

    function replaceUserIdsWithRoles(text, roleMappings) {
        let modifiedText = text;
        roleMappings.forEach((role, userId) => {
            modifiedText = modifiedText.replace(new RegExp(`\\b${userId}\\b`, 'gi'), role);
        });
        return modifiedText;
    }

    function enhanceScenarioEvents(events) {
        return events.map((event, index, arr) => {
            const enhanced = { ...event };
            if (index > 0) {
                enhanced.previous = arr[index - 1].key;
                if (enhanced.previous === '[Prelude]' && !event.key.startsWith('[A0')) {
                    enhanced.previous = '[Prelude]';
                }
            }
            return enhanced;
        });
    }

    function processScenario(scenario) {
        const scenarioId = String(scenario.ID);
        if (processedScenarios.has(scenarioId)) return;

        const roleMappings = buildRoleMappings(scenario.playerSlots);
        const events = scenario.scenario.scenes.map(scene => {
            const dialogue = scene.dialogues[0];
            return {
                key: dialogue.id,
                text: replaceUserIdsWithRoles(dialogue.description, roleMappings)
            };
        });

        const scenarioData = {
            name: scenario.scenario.name,
            scenarioId: scenarioId,
            preRequisiteCrimeID: scenario.preRequisiteCrimeID !== undefined ? String(scenario.preRequisiteCrimeID) : null,
            rewards: {
                respect: scenario.rewards.faction.respect || 0,
                scope: scenario.rewards.faction.scope || 0,
                money: scenario.rewards.faction.cash || 0,
                items: scenario.rewards.faction.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1
                }))
            },
            events: enhanceScenarioEvents(events)
        };

        submitScenarioData(scenarioData)
            .then(() => {
            processedScenarios.add(scenarioId);
            GM_setValue('processedScenarios', Array.from(processedScenarios));
        })
            .catch(() => {});
    }

    // Fetch Interception (natural requests)
    const win = (unsafeWindow || window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        let isCompletedGroup = false;
        if (config?.body instanceof FormData) {
            isCompletedGroup = config.body.get('group') === 'Completed';
        } else if (config?.body) {
            isCompletedGroup = config.body.toString().includes('group=Completed');
        }

        if (!isCompletedGroup) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.success && json.data) {
                json.data.forEach(processScenario);
            }
        } catch (err) {}
        return response;
    };
})();