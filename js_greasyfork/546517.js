// ==UserScript==
// @name         FlatMMO Data Pages Beautifier
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Beautifies FlatMMO mining and woodcutting data pages with complete tool and resource level requirements
// @author       Pizza1337
// @match        https://flatmmo.com/data/mining.html
// @match        https://flatmmo.com/data/woodcutting.html
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546517/FlatMMO%20Data%20Pages%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/546517/FlatMMO%20Data%20Pages%20Beautifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current page type
    const pageType = window.location.pathname.includes('mining') ? 'mining' : 'woodcutting';
    const toolType = pageType === 'mining' ? 'pickaxe' : 'axe';
    const otherPage = pageType === 'mining' ? 'woodcutting' : 'mining';
    const otherPageUrl = pageType === 'mining' ?
        'https://flatmmo.com/data/woodcutting.html' :
        'https://flatmmo.com/data/mining.html';

    // Define available tools
    const tools = ['bronze', 'iron', 'silver', 'gold', 'promethium', 'titanium', 'ancient'];

    // Define level brackets
    const levelBrackets = [
        {min: 1, max: 9, label: '1-9'},
        {min: 10, max: 19, label: '10-19'},
        {min: 20, max: 29, label: '20-29'},
        {min: 30, max: 39, label: '30-39'},
        {min: 40, max: 49, label: '40-49'},
        {min: 50, max: 59, label: '50-59'},
        {min: 60, max: 69, label: '60-69'},
        {min: 70, max: 79, label: '70-79'},
        {min: 80, max: 89, label: '80-89'},
        {min: 90, max: 99, label: '90-99'},
        {min: 100, max: 100, label: '100'}
    ];

    // Define tool level requirements
    const toolLevelRequirements = {
        mining: {
            'bronze_pickaxe': 1,
            'iron_pickaxe': 10,
            'silver_pickaxe': 20,
            'gold_pickaxe': 30,
            'promethium_pickaxe': 50,
            'titanium_pickaxe': 65,
            'ancient_pickaxe': 90
        },
        woodcutting: {
            'bronze_axe': 1,
            'iron_axe': 10,
            'silver_axe': 20,
            'gold_axe': 30,
            'promethium_axe': 50,
            'titanium_axe': 65,
            'ancient_axe': 90
        }
    };

    const toolReqs = toolLevelRequirements[pageType];

    // Define level requirements for resources
    const resourceLevelRequirements = {
        mining: {
            'coal': 1,
            'copper': 1,
            'iron': 5,
            'silver': 15,
            'gold': 30,
            'promethium': 50,
            'titanium': 65,
            'giant_coal': 1,
            'giant_copper': 1,
            'giant_iron': 5
        },
        woodcutting: {
            'tree': 1,
            'oak_tree': 10,
            'willow_tree': 20,
            'maple_tree': 30,
            'mangrove_tree': 50,
            'haunted_tree': 65
        }
    };

    const levelReqs = resourceLevelRequirements[pageType];

    // Parse the original table data BEFORE clearing the page
    function parseTableData() {
        const data = [];
        const tables = document.getElementsByTagName('table');
        if (tables.length > 0) {
            const table = tables[0];
            const rows = table.getElementsByTagName('tr');
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                if (cells.length >= 7) {
                    const resourceName = cells[0].textContent.trim();
                    const toolName = cells[2].textContent.trim();
                    let xpValue = parseInt(cells[1].textContent.trim()) || 0;
                    if (resourceName === 'giant_coal') xpValue = 10;
                    if (resourceName === 'giant_copper') xpValue = 15;
                    if (resourceName === 'giant_iron') xpValue = 40;
                    const originalTicks = parseInt(cells[4].textContent.trim()) || 0;
                    const actualTicks = originalTicks + 1;
                    const ticksPerHour = 3600 / (actualTicks * 0.5);
                    const actualXpPerHour = xpValue * ticksPerHour;
                    data.push({
                        resource: resourceName,
                        xp: xpValue,
                        tool: toolName,
                        toolLevelRequired: toolReqs[toolName] || 1,
                        level: parseInt(cells[3].textContent.trim()) || 0,
                        ticks: actualTicks,
                        xpPerHour: actualXpPerHour,
                        levelRequired: levelReqs[resourceName] || 1
                    });
                }
            }
        }
        return data;
    }

    // Store the data BEFORE modifying the page
    const tableData = parseTableData();

    if (tableData.length === 0) {
        alert('Error: Could not parse data from the page. Please refresh and try again.');
        return;
    }

    // Store original order of resources
    const resourceOrder = {};
    const uniqueResources = [...new Set(tableData.map(item => item.resource))];
    uniqueResources.forEach((resource, index) => {
        resourceOrder[resource] = index;
    });

    // Fetch user level from hiscores API
    async function fetchUserLevel(username) {
        return new Promise((resolve) => {
            const apiUrl = `https://flatmmo.com/api/hiscores/${pageType}.php`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: { 'Accept': 'application/json' },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const searchUsername = username.toLowerCase().trim();
                        for (let i = 0; i < data.length; i++) {
                            const entry = data[i];
                            const entryUsername = entry.username ? entry.username.toLowerCase().trim() : '';
                            if (entryUsername === searchUsername) {
                                const levelField = `${pageType}_level`;
                                const level = parseInt(entry[levelField]);
                                if (!isNaN(level) && level > 0) {
                                    resolve(level);
                                    return;
                                }
                            }
                        }
                        resolve(null);
                    } catch (error) {
                        console.error('Error parsing API response:', error);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('Failed to fetch from API:', error);
                    resolve(null);
                }
            });
        });
    }

    // Inject modern styles
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', system-ui, -apple-system, sans-serif; background: #0a0e27; color: #e8e6e3; padding: 0; min-height: 100vh; overflow-x: hidden; }
        body::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 50%, rgba(120, 80, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%); pointer-events: none; z-index: 1; }
        .container { max-width: 1600px; margin: 0 auto; padding: 20px; position: relative; z-index: 2; }
        .header { text-align: center; padding: 60px 20px 40px; position: relative; }
        .header h1 { font-size: 4em; font-weight: 700; margin: 0; background: linear-gradient(135deg, #667eea 0%, #00ff88 50%, #00d4ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; letter-spacing: 3px; animation: glow 3s ease-in-out infinite; }
        @keyframes glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }
        .header p { margin-top: 10px; color: #8892b0; font-size: 1.2em; }
        .page-switcher { position: absolute; top: 20px; right: 20px; z-index: 10; }
        .page-switcher a { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 255, 136, 0.2)); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 12px; color: #00ff88; text-decoration: none; font-weight: 500; transition: all 0.3s; }
        .page-switcher a:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3); background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(0, 255, 136, 0.3)); }
        .user-section { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border-radius: 25px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
        .user-input-container { display: flex; gap: 15px; align-items: center; justify-content: center; flex-wrap: wrap; }
        .user-input-container label { color: #00ff88; font-weight: 500; }
        .user-input-container input { padding: 10px 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; font-family: inherit; width: 200px; }
        .user-input-container button { padding: 10px 20px; background: linear-gradient(135deg, #667eea, #00ff88); border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .user-input-container button:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3); }
        .user-level-display { margin-top: 15px; text-align: center; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 12px; border: 1px solid rgba(0, 255, 136, 0.2); }
        .user-level-display .level-text { font-size: 1.2em; color: #00ff88; font-weight: 600; }
        .tool-selector { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border-radius: 25px; padding: 30px; margin-bottom: 40px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
        .tool-selector h2 { margin: 0 0 25px 0; background: linear-gradient(90deg, #00ff88, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.5em; font-weight: 600; text-align: center; }
        .tool-grid { display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; }
        .tool-option { display: flex; flex-direction: column; align-items: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; min-width: 100px; }
        .tool-option::before { content: ''; position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%); transform: translate(-50%, -50%) scale(0); transition: transform 0.5s; }
        .tool-option:hover::before { transform: translate(-50%, -50%) scale(2); }
        .tool-option:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 40px rgba(0, 255, 136, 0.3); }
        .tool-option.active { background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 255, 136, 0.2)); border-color: #00ff88; box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); transform: scale(1.05); }
        .tool-option img { width: 56px; height: 56px; margin-bottom: 10px; filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)); position: relative; z-index: 1; }
        .tool-option span { font-size: 0.95em; font-weight: 500; text-transform: capitalize; position: relative; z-index: 1; }
        .filters { display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap; }
        .filter-group { display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.05); padding: 10px 20px; border-radius: 15px; }
        .filter-group label { color: #00ff88; font-weight: 500; font-size: 0.9em; }
        .filter-group select { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 8px 12px; border-radius: 10px; font-family: inherit; cursor: pointer; transition: all 0.3s; }
        .filter-group select:hover { background: rgba(255, 255, 255, 0.15); border-color: rgba(0, 255, 136, 0.5); }
        .filter-group select:focus { outline: none; border-color: #00ff88; box-shadow: 0 0 10px rgba(0, 255, 136, 0.3); }
        .filter-group select option { background: #1a1f3a; color: white; }
        .level-brackets { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .bracket-btn { padding: 8px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: #8892b0; cursor: pointer; transition: all 0.3s; font-weight: 500; font-size: 0.9em; }
        .bracket-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; transform: translateY(-2px); }
        .bracket-btn.active { background: linear-gradient(135deg, #667eea, #00ff88); border-color: transparent; color: white; }
        .bracket-btn.auto-selected { background: linear-gradient(135deg, #00ff88, #00d4ff); border-color: transparent; color: white; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
        .view-toggle { display: flex; gap: 10px; justify-content: center; margin: 30px 0; }
        .view-btn { padding: 12px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; cursor: pointer; transition: all 0.3s; font-weight: 500; }
        .view-btn.active { background: linear-gradient(135deg, #667eea, #00ff88); border-color: transparent; }
        .view-btn:hover:not(.active) { background: rgba(255, 255, 255, 0.1); }
        .stats-header { display: flex; justify-content: center; margin: 40px 0; }
        .stat-card { background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 255, 136, 0.2)); backdrop-filter: blur(10px); border-radius: 25px; padding: 30px 40px; text-align: center; border: 2px solid rgba(0, 255, 136, 0.3); transition: all 0.3s; position: relative; overflow: hidden; min-width: 400px; box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2); }
        .stat-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent); animation: shimmer 3s ease-in-out infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); } 50% { transform: translateX(0%) translateY(0%) rotate(45deg); } 100% { transform: translateX(100%) translateY(100%) rotate(45deg); } }
        .stat-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 25px 70px rgba(102, 126, 234, 0.3); }
        .stat-value { font-size: 3em; font-weight: 700; background: linear-gradient(135deg, #ffd700, #00ff88, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; text-shadow: 0 0 30px rgba(0, 255, 136, 0.5); }
        .stat-label { color: #00ff88; font-size: 1.2em; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; }
        .stat-sublabel { color: #e8e6e3; font-size: 1.1em; margin-top: 5px; font-weight: 500; }
        .stat-resource { color: #00d4ff; font-size: 1.3em; font-weight: 600; text-transform: capitalize; }
        .stat-level { color: #ffd700; font-weight: 700; }
        .resources-container { margin-top: 40px; }
        .resource-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .resource-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; transition: all 0.3s; cursor: pointer; }
        .resource-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 50px rgba(0, 255, 136, 0.2); border-color: rgba(0, 255, 136, 0.3); }
        .resource-header { padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 255, 136, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; }
        .resource-name { font-size: 1.3em; font-weight: 600; color: #00d4ff; text-transform: capitalize; display: flex; align-items: center; gap: 12px; }
        .resource-icon { width: 40px; height: 40px; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)); object-fit: contain; }
        .resource-levels { padding: 20px; max-height: 300px; overflow-y: auto; }
        .resource-levels::-webkit-scrollbar { width: 6px; }
        .resource-levels::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 3px; }
        .resource-levels::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #00ff88); border-radius: 3px; }
        .level-entry { display: grid; grid-template-columns: auto 1fr auto; gap: 15px; padding: 12px; margin-bottom: 10px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; align-items: center; transition: all 0.3s; }
        .level-entry:hover { background: rgba(255, 255, 255, 0.05); transform: translateX(5px); }
        .level-entry:last-child { margin-bottom: 0; }
        .level-badge { background: linear-gradient(135deg, #ff6b6b, #ff8e53); color: white; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 0.85em; }
        .level-stats { display: flex; gap: 20px; align-items: center; }
        .stat-item { display: flex; flex-direction: column; align-items: center; }
        .stat-item-value { font-weight: 600; color: #00ff88; font-size: 0.95em; }
        .stat-item-label { font-size: 0.75em; color: #8892b0; text-transform: uppercase; letter-spacing: 1px; }
        .xp-hour-badge { background: linear-gradient(135deg, #667eea, #764ba2); padding: 8px 16px; border-radius: 12px; font-weight: 600; font-size: 0.9em; white-space: nowrap; }
        .resource-list { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; animation: fadeIn 0.5s ease-in; }
        .list-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 255, 136, 0.1)); border-bottom: 2px solid rgba(0, 255, 136, 0.3); font-weight: 600; color: #00ff88; text-transform: uppercase; font-size: 0.9em; letter-spacing: 1px; }
        .list-item { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr; padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); align-items: center; transition: all 0.3s; cursor: pointer; }
        .list-item:hover { background: rgba(255, 255, 255, 0.05); transform: translateX(10px); }
        .list-item:last-child { border-bottom: none; }
        .list-resource { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #00d4ff; text-transform: capitalize; }
        .list-level { color: #ff6b6b; font-weight: 600; }
        .list-ticks { color: #00ff88; }
        .list-xp { color: #ffd700; font-weight: 500; }
        .sort-indicator { display: inline-block; margin-left: 5px; transition: transform 0.3s; }
        .sort-asc::after { content: '▲'; font-size: 0.8em; }
        .sort-desc::after { content: '▼'; font-size: 0.8em; }
        .hidden { display: none !important; }
        .empty-state { text-align: center; padding: 60px 20px; color: #8892b0; }
        .empty-state h3 { font-size: 1.5em; margin-bottom: 10px; color: #64748b; }
    `);

    // Create new UI
    document.body.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'container';
    const pageSwitcher = document.createElement('div');
    pageSwitcher.className = 'page-switcher';
    pageSwitcher.innerHTML = `<a href="${otherPageUrl}">${otherPage === 'mining' ? '⛏️' : '🪓'} Switch to ${otherPage.charAt(0).toUpperCase() + otherPage.slice(1)}</a>`;
    container.appendChild(pageSwitcher);
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `<h1>${pageType.charAt(0).toUpperCase() + pageType.slice(1)}</h1><p>Optimize your XP gains with the perfect tool and level combination</p>`;
    container.appendChild(header);
    const userSection = document.createElement('div');
    userSection.className = 'user-section';
    userSection.innerHTML = `<div class="user-input-container"><label>Username:</label><input type="text" id="usernameInput" placeholder="Enter your username"><button id="fetchLevelBtn">Fetch Level</button><button id="clearUserBtn" style="background: linear-gradient(135deg, #ff6b6b, #ff8e53);">Clear</button></div><div id="userLevelDisplay" class="user-level-display hidden"><div class="level-text">Loading...</div></div>`;
    container.appendChild(userSection);
    const toolSelector = document.createElement('div');
    toolSelector.className = 'tool-selector';
    toolSelector.innerHTML = `<h2>⚒️ Select Your Tool</h2><div class="tool-grid" id="toolGrid"></div><div class="filters"><div class="filter-group"><label>Level Range:</label><div class="level-brackets" id="levelBrackets"></div></div><div class="filter-group"><label>Sort by:</label><select id="sortBy"><option value="resource">Resource (Original Order)</option><option value="xpPerHour">XP per Hour</option></select></div></div>`;
    container.appendChild(toolSelector);
    const toolGrid = toolSelector.querySelector('#toolGrid');
    const levelBracketsContainer = toolSelector.querySelector('#levelBrackets');

    tools.forEach(tool => {
        const toolFullName = `${tool}_${toolType}`;
        const toolOption = document.createElement('div');
        toolOption.className = 'tool-option';
        toolOption.dataset.tool = toolFullName;
        const toolLevelReq = toolReqs[toolFullName] || 1;
        toolOption.innerHTML = `<img src="https://flatmmo.com/images/items/${toolFullName}.png" alt="${tool} ${toolType}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22 viewBox=%220 0 56 56%22><rect width=%2256%22 height=%2256%22 fill=%22%23444%22 rx=%228%22/><text x=%2228%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%23aaa%22 font-size=%2224%22>⚒️</text></svg>'"><span>${tool}</span><span class="tool-level-req" data-req-level="${toolLevelReq}" style="font-size: 0.75em; color: #ff6b6b;">Lvl ${toolLevelReq}</span>`;
        toolOption.addEventListener('click', () => filterByTool(toolFullName));
        toolGrid.appendChild(toolOption);
    });

    const allLevelsBtn = document.createElement('button');
    allLevelsBtn.className = 'bracket-btn active';
    allLevelsBtn.dataset.min = '1';
    allLevelsBtn.dataset.max = '100';
    allLevelsBtn.textContent = 'All Levels';
    allLevelsBtn.addEventListener('click', () => selectLevelBracket({min: 1, max: 100, label: 'All Levels'}));
    levelBracketsContainer.appendChild(allLevelsBtn);

    levelBrackets.forEach(bracket => {
        const bracketBtn = document.createElement('button');
        bracketBtn.className = 'bracket-btn';
        bracketBtn.dataset.min = bracket.min;
        bracketBtn.dataset.max = bracket.max;
        bracketBtn.textContent = bracket.label;
        bracketBtn.addEventListener('click', () => selectLevelBracket(bracket));
        levelBracketsContainer.appendChild(bracketBtn);
    });

    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle';
    viewToggle.innerHTML = `<button class="view-btn active" data-view="cards">📊 Card View</button><button class="view-btn" data-view="list">📋 List View</button>`;
    container.appendChild(viewToggle);
    const statsHeader = document.createElement('div');
    statsHeader.className = 'stats-header';
    statsHeader.id = 'statsHeader';
    container.appendChild(statsHeader);
    const resourcesContainer = document.createElement('div');
    resourcesContainer.className = 'resources-container';
    resourcesContainer.id = 'resourcesContainer';
    container.appendChild(resourcesContainer);
    document.body.appendChild(container);

    // State management
    let currentTool = GM_getValue('flatmmo_last_tool_' + pageType, 'all');
    let minLevelFilter = 1;
    let maxLevelFilter = 100;
    let currentView = 'cards';
    let sortBy = 'resource';
    let sortOrder = 'asc';
    let currentUsername = GM_getValue('flatmmo_username', '');
    let currentUserLevel = null;

    function selectLevelBracket(bracket) {
        minLevelFilter = bracket.min;
        maxLevelFilter = bracket.max;
        document.querySelectorAll('.bracket-btn').forEach(btn => {
            btn.classList.remove('active', 'auto-selected');
            if (btn.dataset.min == bracket.min && btn.dataset.max == bracket.max) {
                btn.classList.add('active');
            }
        });
        applyFilters();
    }

    function filterByTool(tool) {
        document.querySelectorAll('.tool-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.tool === tool);
        });
        if (currentTool === tool) {
            currentTool = 'all';
            document.querySelectorAll('.tool-option').forEach(opt => opt.classList.remove('active'));
        } else {
            currentTool = tool;
        }
        GM_setValue('flatmmo_last_tool_' + pageType, currentTool);
        applyFilters();
    }

    function findBestBracketForLevel(level) {
        for (let bracket of levelBrackets) {
            if (level >= bracket.min && level <= bracket.max) {
                return bracket;
            }
        }
        return {min: 1, max: 100, label: 'All Levels'};
    }

    function updateToolLevelColors() {
        document.querySelectorAll('.tool-option').forEach(option => {
            const levelSpan = option.querySelector('.tool-level-req');
            if (levelSpan) {
                const requiredLevel = parseInt(levelSpan.dataset.reqLevel, 10);
                if (currentUserLevel && currentUserLevel >= requiredLevel) {
                    levelSpan.style.color = '#00ff88';
                } else {
                    levelSpan.style.color = '#ff6b6b';
                }
            }
        });
    }

    async function fetchAndSetUserLevel(username) {
        const levelDisplay = document.getElementById('userLevelDisplay');
        const levelText = levelDisplay.querySelector('.level-text');
        levelDisplay.classList.remove('hidden');
        levelText.textContent = 'Fetching level...';
        const level = await fetchUserLevel(username);
        if (level !== null && level > 0) {
            currentUserLevel = level;
            levelText.innerHTML = `<strong style="color: #00d4ff;">${username}</strong><span style="color: #8892b0;">•</span> ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Lvl: <strong style="color: #ffd700;">${level}</strong>`;
            const bestBracket = findBestBracketForLevel(level);
            minLevelFilter = bestBracket.min;
            maxLevelFilter = bestBracket.max;
            document.querySelectorAll('.bracket-btn').forEach(btn => {
                btn.classList.remove('active', 'auto-selected');
                if (btn.dataset.min == bestBracket.min && btn.dataset.max == bestBracket.max) {
                    btn.classList.add('auto-selected');
                }
            });
            updateToolLevelColors();
            applyFilters();
        } else {
            levelText.innerHTML = `<span style="color: #ff6b6b;">⚠️ Username not found in hiscores</span><br><span style="color: #8892b0; font-size: 0.9em;">Make sure the username exists in the ${pageType} hiscores</span>`;
            currentUserLevel = null;
            updateToolLevelColors();
            applyFilters(); // Re-apply filters to update colors in summary card
        }
    }

    function updateStats(data) {
        const statsHeader = document.getElementById('statsHeader');
        if (data.length === 0) {
            statsHeader.innerHTML = `<div class="stat-card"><div class="stat-label">⚠️ No Data Available</div><div class="stat-sublabel">Try adjusting your filters or check level requirements</div></div>`;
            return;
        }
        const bestXp = Math.max(...data.map(d => d.xpPerHour));
        const bestItem = data.find(d => d.xpPerHour === bestXp);

        // Determine colors based on user level
        const resourceReqColor = (currentUserLevel && currentUserLevel >= bestItem.levelRequired) ? '#00ff88' : '#ff6b6b';
        const toolReqColor = (currentUserLevel && currentUserLevel >= bestItem.toolLevelRequired) ? '#00ff88' : '#ff6b6b';

        statsHeader.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">🏆 Best XP Per Hour</div>
                <div class="stat-value">${Math.round(bestXp).toLocaleString()}</div>
                <div class="stat-sublabel">
                    <span class="stat-resource">${bestItem.resource.replace(/_/g, ' ')}</span> at <span class="stat-level">Lvl ${bestItem.level}</span>
                </div>
                <div class="stat-sublabel" style="margin-top: 5px;">
                    <span style="color: ${resourceReqColor};">Resource requires Lvl ${bestItem.levelRequired}</span>
                    <span style="color: #8892b0;"> • </span>
                    <span style="color: ${toolReqColor};">Tool requires Lvl ${bestItem.toolLevelRequired}</span>
                </div>
                <div class="stat-sublabel" style="margin-top: 10px; opacity: 0.8;">
                    ${bestItem.tool.replace(/_/g, ' ')} • ${bestItem.ticks} ticks • ${bestItem.xp} XP per resource
                </div>
            </div>`;
    }

    function getResourceImage(resource) {
        if (pageType === 'woodcutting') {
            const treeImages = { 'tree': 'https://flatmmo.wiki/images/7/76/Normal_tree.png', 'oak_tree': 'https://flatmmo.wiki/images/c/cf/Oak_tree.png', 'willow_tree': 'https://flatmmo.wiki/images/1/19/Willow_tree.png', 'maple_tree': 'https://flatmmo.wiki/images/4/4b/Maple_tree.png', 'mangrove_tree': 'https://flatmmo.wiki/images/6/67/Mangrove_tree.png', 'haunted_tree': 'https://flatmmo.wiki/images/a/a7/Haunted_tree.png' };
            return treeImages[resource] || `https://flatmmo.com/images/items/${resource}.png`;
        } else if (pageType === 'mining') {
            const rockImages = { 'giant_coal': 'https://flatmmo.wiki/images/f/f8/Coal_rock.png', 'giant_copper': 'https://flatmmo.wiki/images/8/89/Copper_rock.png', 'giant_iron': 'https://flatmmo.wiki/images/d/db/Iron_rock.png' };
            return rockImages[resource] || `https://flatmmo.com/images/items/${resource}.png`;
        }
        return `https://flatmmo.com/images/items/${resource}.png`;
    }

    function renderCardView(data) {
        const container = document.getElementById('resourcesContainer');
        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No resources found</h3><p>Try adjusting your filters or selecting a different tool</p><p style="color: #ff6b6b; margin-top: 10px;">Note: Resources and tools you can't use at your level are hidden</p></div>`;
            return;
        }
        const groupedData = {};
        data.forEach(item => { if (!groupedData[item.resource]) { groupedData[item.resource] = []; } groupedData[item.resource].push(item); });
        Object.keys(groupedData).forEach(resource => groupedData[resource].sort((a, b) => a.level - b.level));
        const sortedResources = Object.keys(groupedData).sort((a, b) => { if (sortBy === 'xpPerHour') { const maxA = Math.max(...groupedData[a].map(item => item.xpPerHour)); const maxB = Math.max(...groupedData[b].map(item => item.xpPerHour)); return sortOrder === 'asc' ? maxA - maxB : maxB - maxA; } return resourceOrder[a] - resourceOrder[b]; });
        const cardsHtml = sortedResources.map(resource => {
            const levels = groupedData[resource];
            const levelReq = levels[0].levelRequired;
            const levelReqColor = (currentUserLevel && currentUserLevel >= levelReq) ? '#00ff88' : '#ff6b6b';
            return `<div class="resource-card"><div class="resource-header"><div class="resource-name"><img src="${getResourceImage(resource)}" class="resource-icon" onerror="this.style.display='none'">${resource.replace(/_/g, ' ')}</div><div style="color: ${levelReqColor}; font-size: 0.9em;">Requires Lvl ${levelReq}</div></div><div class="resource-levels">${levels.map(level => `<div class="level-entry"><div class="level-badge">Lvl ${level.level}</div><div class="level-stats"><div class="stat-item"><span class="stat-item-value">${level.ticks}</span><span class="stat-item-label">Ticks</span></div><div class="stat-item"><span class="stat-item-value">${level.xp}</span><span class="stat-item-label">XP</span></div></div><div class="xp-hour-badge">${Math.round(level.xpPerHour).toLocaleString()} xp/h</div></div>`).join('')}</div></div>`;
        }).join('');
        container.innerHTML = `<div class="resource-cards">${cardsHtml}</div>`;
    }

    function renderListView(data) {
        const container = document.getElementById('resourcesContainer');
        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No resources found</h3><p>Try adjusting your filters or selecting a different tool</p><p style="color: #ff6b6b; margin-top: 10px;">Note: Resources and tools you can't use at your level are hidden</p></div>`;
            return;
        }
        const sortedData = [...data].sort((a, b) => { if (sortBy === 'xpPerHour') { return sortOrder === 'asc' ? a.xpPerHour - b.xpPerHour : b.xpPerHour - a.xpPerHour; } const orderDiff = resourceOrder[a.resource] - resourceOrder[b.resource]; if (orderDiff !== 0) return orderDiff; return a.level - b.level; });
        const listHtml = `<div class="resource-list"><div class="list-header"><div class="sortable" data-sort="resource">Resource <span class="sort-indicator ${sortBy === 'resource' ? `sort-${sortOrder}` : ''}"></span></div><div>Req. Lvl</div><div>Your Lvl</div><div>Ticks</div><div>XP</div><div class="sortable" data-sort="xpPerHour">XP/Hour <span class="sort-indicator ${sortBy === 'xpPerHour' ? `sort-${sortOrder}` : ''}"></span></div></div>${sortedData.map(item => `<div class="list-item"><div class="list-resource"><img src="${getResourceImage(item.resource)}" class="resource-icon" onerror="this.style.display='none'">${item.resource.replace(/_/g, ' ')}</div><div class="list-level" style="color: #ff6b6b;">${item.levelRequired}</div><div class="list-level">${item.level}</div><div class="list-ticks">${item.ticks}</div><div class="list-xp">${item.xp}</div><div class="xp-hour-badge">${Math.round(item.xpPerHour).toLocaleString()} xp/h</div></div>`).join('')}</div>`;
        container.innerHTML = listHtml;
        container.querySelectorAll('.sortable').forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const newSortBy = header.dataset.sort;
                if (sortBy === newSortBy) { sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; } else { sortBy = newSortBy; sortOrder = sortBy === 'xpPerHour' ? 'desc' : 'asc'; }
                document.getElementById('sortBy').value = sortBy;
                applyFilters();
            });
        });
    }

    function applyFilters() {
        let filteredData = tableData;
        if (currentTool !== 'all') {
            filteredData = filteredData.filter(row => row.tool === currentTool);
        }
        filteredData = filteredData.filter(row => {
            const isInBracket = row.level >= minLevelFilter && row.level <= maxLevelFilter;
            const isResourceAvailable = row.levelRequired <= maxLevelFilter;
            const isToolAvailable = row.toolLevelRequired <= maxLevelFilter;
            return isInBracket && isResourceAvailable && isToolAvailable;
        });
        updateStats(filteredData);
        if (currentView === 'cards') {
            renderCardView(filteredData);
        } else {
            renderListView(filteredData);
        }
    }

    // Event listeners
    document.getElementById('fetchLevelBtn').addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value.trim();
        if (username) {
            GM_setValue('flatmmo_username', username);
            currentUsername = username;
            await fetchAndSetUserLevel(username);
        } else {
            alert('Please enter a username');
        }
    });

    document.getElementById('clearUserBtn').addEventListener('click', () => {
        GM_setValue('flatmmo_username', '');
        currentUsername = '';
        currentUserLevel = null;
        updateToolLevelColors();
        document.getElementById('usernameInput').value = '';
        document.getElementById('userLevelDisplay').classList.add('hidden');
        selectLevelBracket({min: 1, max: 100, label: 'All Levels'});
    });

    document.getElementById('usernameInput').addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const username = e.target.value.trim();
            if (username) {
                GM_setValue('flatmmo_username', username);
                currentUsername = username;
                await fetchAndSetUserLevel(username);
            }
        }
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        sortBy = e.target.value;
        sortOrder = sortBy === 'xpPerHour' ? 'desc' : 'asc';
        applyFilters();
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            applyFilters();
        });
    });

    // Initialize UI and load saved data
    function initialize() {
        if (currentTool !== 'all') {
            const lastSelectedToolEl = document.querySelector(`.tool-option[data-tool="${currentTool}"]`);
            if (lastSelectedToolEl) {
                lastSelectedToolEl.classList.add('active');
            }
        }
        if (currentUsername) {
            document.getElementById('usernameInput').value = currentUsername;
            fetchAndSetUserLevel(currentUsername);
        } else {
            applyFilters();
        }
    }

    initialize();

})();