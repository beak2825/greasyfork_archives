// ==UserScript==
// @name         Scenario Flowchart Generator + Rewards
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Generate Mermaid flowchart and provide reward data
// @author       Allenone[2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM.xmlHttpRequest
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/530657/Scenario%20Flowchart%20Generator%20%2B%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/530657/Scenario%20Flowchart%20Generator%20%2B%20Rewards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE_URL = 'https://tornprobability.com:3000/api';
    const FLOWCHART_CONTAINER_STYLE = `
        padding: 20px;
        background: #333;
        color: #fff;
        z-index: 9999;
        position: fixed;
        top: 80px;
        right: 10px;
        border: 2px solid #444;
        max-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    `;

    const log = (...args) => console.log('[ScenarioGenerator]', ...args);
    const logError = (...args) => console.error('[ScenarioGenerator]', ...args);

    // Mermaid Code Generation
    function generateMermaidCode(scenarios) {
        // Sort scenarios by scenarioId in descending order
        scenarios.sort((a, b) => parseInt(b.scenarioId) - parseInt(a.scenarioId));
        const nodesByKey = new Map(); // key -> [{ node, scenarioId }]
        const edges = new Set();
        const finalNodesRewards = new Map();

        // Step 1: Collect all nodes and edges, grouping nodes by key
        scenarios.forEach(scenario => {
            if (scenario.events.length > 0) {
                const finalEvent = scenario.events[scenario.events.length - 1];
                const rewards = scenario.rewards || {};
                const rewardParts = [];
                if (rewards.respect) rewardParts.push(`Respect: ${rewards.respect}`);
                if (rewards.scope) rewardParts.push(`Scope: ${rewards.scope}`);
                if (rewards.money) rewardParts.push(`Money: ${rewards.money}`);
                if (rewards.items?.length) rewardParts.push(`Items: ${rewards.items.map(i => `${i.name} x${i.quantity}`).join(', ')}`);
                if (rewardParts.length > 0) {
                    finalNodesRewards.set(finalEvent.key, ` Rewards: ${rewardParts.join(', ')}`);
                } else if (finalEvent.key.includes('S')) {
                    finalNodesRewards.set(finalEvent.key, '');
                }
            }
            scenario.events.forEach(event => {
                const node = { key: event.key, text: event.text, previous: event.previous, scenarioId: scenario.scenarioId };
                if (!nodesByKey.has(event.key)) {
                    nodesByKey.set(event.key, []);
                }
                nodesByKey.get(event.key).push({ node, scenarioId: scenario.scenarioId });
                if (event.previous && !isCheckNode(event.previous)) {
                    edges.add(JSON.stringify({ from: event.previous, to: event.key }));
                }
            });
        });

        // Step 2: Select the node with the highest scenarioId for each key
        const nodes = new Map(); // key -> { key, text, previous }
        nodesByKey.forEach((nodeList, key) => {
            // Sort nodes by scenarioId (descending) and take the first (most recent)
            const selectedNode = nodeList.sort((a, b) => parseInt(b.scenarioId) - parseInt(a.scenarioId))[0].node;
            nodes.set(key, selectedNode);
        });

        // Step 3: Handle check nodes
        nodes.forEach((node, key) => {
            if (isCheckNode(key)) {
                const passKeyOrig = key.replace(/(C\d+)\]$/, '$1P]');
                const failKeyOrig = key.replace(/(C\d+)\]$/, '$1F]');
                edges.add(JSON.stringify({ from: key, to: passKeyOrig, label: 'Pass' }));
                edges.add(JSON.stringify({ from: key, to: failKeyOrig, label: 'Fail' }));
                [passKeyOrig, failKeyOrig].forEach(newKey => {
                    if (!nodes.has(newKey)) {
                        nodes.set(newKey, { key: newKey, text: 'Unknown', previous: key, scenarioId: node.scenarioId });
                    }
                });
            }
        });

        // Step 4: Generate Mermaid code
        let mermaidCode = '%% Copy to https://mermaid.live or draw.io\n';
        mermaidCode += 'flowchart LR\n';
        nodes.forEach((node, key) => {
            const cleanKey = sanitizeId(key);
            let label = node.text.replace(/"/g, '#quot;');
            if (finalNodesRewards.has(node.key)) {
                label += finalNodesRewards.get(node.key);
                mermaidCode += ` ${cleanKey}([${label}])\n`; // Ovals for reward nodes
            } else if (isCheckNode(node.key)) {
                mermaidCode += ` ${cleanKey}{"${label}"}\n`; // Diamonds for check nodes
            } else if (!node.key.includes('-C')) {
                mermaidCode += ` ${cleanKey}(["${label}"])\n`; // Ovals for endpoints
            } else {
                mermaidCode += ` ${cleanKey}["${label}"]\n`; // Rectangles for others
            }
        });
        const edgeArray = Array.from(edges).map(e => JSON.parse(e));
        edgeArray.forEach(edge => {
            const fromId = sanitizeId(edge.from);
            const toId = sanitizeId(edge.to);
            mermaidCode += edge.label
                ? ` ${fromId} -- "${edge.label}" --> ${toId}\n`
            : ` ${fromId} --> ${toId}\n`;
        });

        // Step 5: Custom styling
        mermaidCode += "\n%% Custom Styling\n";
        nodes.forEach((node, key) => {
            const cleanKey = sanitizeId(key);
            let fillColor, strokeColor;
            if (finalNodesRewards.has(node.key)) {
                fillColor = '#006400'; // Dark green for success/reward nodes
                strokeColor = '#ce93d8';
            } else if (node.key.includes('F') && !node.key.includes('-C')) {
                fillColor = '#C62828'; // Red for endpoint fail nodes
                strokeColor = '#E57373';
            } else if (node.key.endsWith('P]') && !node.key.includes('-C')) {
                fillColor = '#2E7D32'; // Green for endpoint pass nodes
                strokeColor = '#81C784';
            } else if (isCheckNode(node.key)) {
                fillColor = '#616161'; // Grey for check nodes
                strokeColor = '#BDBDBD';
            } else {
                fillColor = '#424242'; // Default grey for other nodes
                strokeColor = '#90A4AE';
            }
            mermaidCode += ` style ${cleanKey} fill:${fillColor},stroke:${strokeColor},stroke-width:2px;\n`;
        });
        mermaidCode += "\n%% Custom Edge Styling\n";
        edgeArray.forEach((edge, index) => {
            if (edge.label === 'Pass') {
                mermaidCode += ` linkStyle ${index} stroke:#2E7D32,stroke-width:2px;\n`;
            } else if (edge.label === 'Fail') {
                mermaidCode += ` linkStyle ${index} stroke:#C62828,stroke-width:2px;\n`;
            }
        });

        return mermaidCode;
    }

    // Reward Statistics Generation
    function generateRewardStats(scenarios) {
        // Group scenarios by finalKey
        const groupedScenarios = scenarios.reduce((acc, scenario) => {
            if (!acc[scenario.finalKey]) {
                acc[scenario.finalKey] = [];
            }
            acc[scenario.finalKey].push(scenario.rewards);
            return acc;
        }, {});

        // Process each group
        const results = Object.entries(groupedScenarios).map(([finalKey, rewardsList]) => {
            // Extract respect values
            const respectValues = rewardsList.map(r => r.respect);
            // Extract money values (assuming money is the reward value when no items present)
            const rewardValues = rewardsList.map(r => r.money || 0);
            // Process item rewards
            const items = rewardsList
            .filter(r => r.items)
            .map(r => r.items)
            .flat();
            // Group items by name and collect quantities
            const itemQuantities = items.reduce((acc, item) => {
                if (!acc[item.name]) {
                    acc[item.name] = [];
                }
                acc[item.name].push(item.quantity);
                return acc;
            }, {});

            // Calculate item stats
            const deduplicatedItems = Object.entries(itemQuantities).map(([name, quantities]) => {
                const totalQuantity = quantities.reduce((a, b) => a + b, 0);
                if (totalQuantity > 1 && quantities.length > 1) {
                    // Calculate range stats if total quantity > 1 and there are multiple occurrences
                    return {
                        name,
                        quantity: totalQuantity,
                        range: {
                            lowest: Math.min(...quantities),
                            highest: Math.max(...quantities),
                            average: Number((quantities.reduce((a, b) => a + b, 0) / quantities.length).toFixed(2))
                        }
                    };
                }
                // Return simple format if total quantity <= 1 or only one occurrence
                return {
                    name,
                    quantity: totalQuantity
                };
            });

            // Calculate stats
            const respectStats = {
                highest: Math.max(...respectValues),
                lowest: Math.min(...respectValues),
                average: Number((respectValues.reduce((a, b) => a + b, 0) / respectValues.length).toFixed(2))
            };
            const rewardStats = {
                highest: Math.max(...rewardValues),
                lowest: Math.min(...rewardValues),
                average: Number((rewardValues.reduce((a, b) => a + b, 0) / rewardValues.length).toFixed(2))
            };

            return {
                finalKey,
                sampleSize: rewardsList.length,
                respect: respectStats,
                rewards: rewardStats,
                ...(deduplicatedItems.length > 0 && { items: deduplicatedItems })
            };
        });

        // Sort results by finalKey for consistent output
        results.sort((a, b) => a.finalKey.localeCompare(b.finalKey));

        // Prepare output as in OCresults
        const output = results.map(result => ({
            [result.finalKey]: {
                Respect: result.respect,
                'Rewards (Money)': result.rewards,
                'Sample Size': result.sampleSize,
                ...(result.items && { Items: result.items })
            }
        }));

        return JSON.stringify(output, null, 2);
    }

    // Utility Functions
    const isCheckNode = key => /\[.*-C\d+\]$/.test(key);
    const sanitizeId = key => key.replace(/[\[\]\.\-\s]/g, '_');

    // Fetch Data Functions
    function fetchScenarioData(name, callback) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `${API_BASE_URL}/scenarios?name=${encodeURIComponent(name)}`,
            onload: (response) => {
                try {
                    const scenarios = JSON.parse(response.responseText);
                    callback(scenarios);
                } catch (err) {
                    logError('Failed to parse scenarios response:', err);
                    callback([]);
                }
            },
            onerror: (err) => {
                logError('Failed to fetch scenarios:', err);
                callback([]);
            }
        });
    }

    function fetchRewardData(name, callback) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `${API_BASE_URL}/scenario-rewards?name=${encodeURIComponent(name)}`,
            onload: (response) => {
                try {
                    const scenarios = JSON.parse(response.responseText);
                    callback(scenarios);
                } catch (err) {
                    logError('Failed to parse rewards response:', err);
                    callback([]);
                }
            },
            onerror: (err) => {
                logError('Failed to fetch rewards:', err);
                callback([]);
            }
        });
    }

    // UI Creation
    function createUI() {
        const container = document.createElement('div');
        container.style = FLOWCHART_CONTAINER_STYLE;

        const title = document.createElement('h3');
        title.textContent = 'Scenario Generator';
        title.style = 'margin: 0 0 10px 0; color: #fff;';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter scenario name (e.g., Ace in the Hole)';
        nameInput.style = 'width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;';

        const modeSelect = document.createElement('select');
        modeSelect.style = 'width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;';
        const flowchartOption = document.createElement('option');
        flowchartOption.value = 'flowchart';
        flowchartOption.textContent = 'Flowchart';
        const rewardsOption = document.createElement('option');
        rewardsOption.value = 'rewards';
        rewardsOption.textContent = 'Reward Stats';
        modeSelect.appendChild(flowchartOption);
        modeSelect.appendChild(rewardsOption);

        const generateButton = document.createElement('button');
        generateButton.textContent = 'Generate & Copy';
        generateButton.style = 'width: 100%; padding: 8px; margin-bottom: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
        generateButton.addEventListener('mouseover', () => { generateButton.style.background = '#45a049'; });
        generateButton.addEventListener('mouseout', () => { generateButton.style.background = '#4CAF50'; });

        const status = document.createElement('div');
        status.style = 'font-size: 0.9em; color: #ccc;';

        generateButton.addEventListener('click', () => {
            const scenarioName = nameInput.value.trim();
            if (!scenarioName) {
                status.textContent = 'Please enter a scenario name';
                setTimeout(() => status.textContent = '', 2000);
                return;
            }

            const mode = modeSelect.value;
            if (mode === 'flowchart') {
                fetchScenarioData(scenarioName, (scenarios) => {
                    if (scenarios.length === 0) {
                        status.textContent = 'No scenarios found';
                        setTimeout(() => status.textContent = '', 2000);
                        return;
                    }
                    const mermaidCode = generateMermaidCode(scenarios);
                    navigator.clipboard.writeText(mermaidCode)
                        .then(() => {
                        status.textContent = `Copied ${scenarios.length} scenario(s)!`;
                        setTimeout(() => status.textContent = '', 2000);
                    })
                        .catch(err => {
                        logError('Copy failed:', err);
                        status.textContent = 'Copy failed';
                        setTimeout(() => status.textContent = '', 2000);
                    });
                });
            } else if (mode === 'rewards') {
                fetchRewardData(scenarioName, (scenarios) => {
                    if (scenarios.length === 0) {
                        status.textContent = 'No rewards found';
                        setTimeout(() => status.textContent = '', 2000);
                        return;
                    }
                    const statsMarkdown = generateRewardStats(scenarios);
                    navigator.clipboard.writeText(statsMarkdown)
                        .then(() => {
                        status.textContent = `Copied reward stats for ${Object.keys(scenarios.reduce((acc, s) => { acc[s.finalKey] = true; return acc; }, {})).length} keys!`;
                        setTimeout(() => status.textContent = '', 2000);
                    })
                        .catch(err => {
                        logError('Copy failed:', err);
                        status.textContent = 'Copy failed';
                        setTimeout(() => status.textContent = '', 2000);
                    });
                });
            }
        });

        container.append(title, nameInput, modeSelect, generateButton, status);
        document.body.appendChild(container);
    }

    // Initialization
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', createUI)
    : createUI();
})();