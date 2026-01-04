// ==UserScript==
// @name         NSL Task Tracker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Track New Station Launch tasks from Quip
// @author       Arjun Bridgelal
// @match        https://quip-amazon.com/zBDTAOB6aabb/New-Station-Launch-Tracker-NA-COSM-2025*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541067/NSL%20Task%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/541067/NSL%20Task%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const QUIP_ID = 'zBDTAOB6aabb';
    const API_TOKEN = 'ZE1HOU1BcE9UNVk=|1782085439|ygCv5CrNibKxK1yz4beV84m4h6KMVD8Zf2ae/KCP33o=';
    const BASE_URL = 'https://platform.quip-amazon.com';
    const OWNERS = ['RG', 'MD', 'AM', 'GS', 'AB', 'PT', 'CM', 'EA', 'PK', 'DS'];

    const BUSINESS_TYPE_COLORS = {
    default: {
        'AMZL': '#0066CC',        // Blue
        'AMXL': '#8E44AD',        // Dark Purple
        'RSR': '#16A085',         // Green Blue
        'NA SSD': '#2980B9',      // Dark Blue
        'EU SSD': '#8E44AD',      // Purple
        'RSR HB Launch': '#2C3E50', // Dark Blue Gray
        'RSR HUB Launch': '#3498DB', // Light Blue
        'RSR SD Launch': '#1ABC9C'   // Turquoise
    },
    gaby: {
        'AMZL': '#FF1493',        // Deep Pink
        'AMXL': '#FF00FF',        // Magenta
        'RSR': '#FF69B4',         // Hot Pink
        'NA SSD': '#FFB6C1',      // Light Pink
        'EU SSD': '#DB7093',      // Pale Violet Red
        'RSR HB Launch': '#DDA0DD', // Plum
        'RSR HUB Launch': '#FF66FF', // Light Magenta
        'RSR SD Launch': '#FFC0CB'   // Pink
    }
};

    const GABY_BUSINESS_COLORS = {
    'AMZL': '#FF1493',        // Deep Pink
    'AMXL': '#FF00FF',        // Magenta
    'RSR': '#FF69B4',         // Hot Pink
    'NA SSD': '#FFB6C1',      // Light Pink
    'EU SSD': '#DB7093',      // Pale Violet Red
    'RSR HB Launch': '#DDA0DD', // Plum
    'RSR HUB Launch': '#FF66FF', // Light Magenta
    'RSR SD Launch': '#FFC0CB'   // Pink
};


        const TAB_CONFIG = {
        'AMZL': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 7
        },
        'AMXL': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 7
        },
        'RSR': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 11
        },
        'NA SSD': {
            'station_column': 1,
            'tdays_column': 6,
            'owner_column': 11
        },
        'EU SSD': {
            'station_column': 1,
            'tdays_column': 5,
            'owner_column': 7
        },
        'RSR HB Launch': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 10
        },
        'RSR HUB Launch': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 10
        },
        'RSR SD Launch': {
            'station_column': 1,
            'tdays_column': 3,
            'owner_column': 10
        }
    };

    const COLOR_SCHEMES = {
        dark: {
            name: 'Dark Mode',
            background: '#1E1E1E',
            boardBackground: '#1E1E1E',
            headerBackground: '#2D2D2D',
            columnBackground: '#2D2D2D',
            cardBackground: '#1E1E1E',
            textColor: '#E0E0E0',
            secondaryText: '#A0A0A0',
            border: '#3D3D3D',
            buttonBackground: '#0066CC',
            buttonHover: '#0052A3',
            stationCodeColor: '#E0E0E0',
            columnHeaders: {
                inProgress: '#243575',
                completed: '#363945'
            }
        },
        light: {
            name: 'Light Mode',
            background: '#FFFFFF',
            boardBackground: '#F5F5F5',
            headerBackground: '#FFFFFF',
            columnBackground: '#FFFFFF',
            cardBackground: '#FFFFFF',
            textColor: '#333333',
            secondaryText: '#444444',
            border: '#DDDDDD',
            buttonBackground: '#0066CC',
            buttonHover: '#0052A3',
            stationCodeColor: '#004d98',
            columnHeaders: {
                inProgress: '#0066CC',
                completed: '#28A745'
            }
        },
        gaby: {
            name: 'Gaby Mode',
            background: '#FFF0F5',
            boardBackground: '#FFF0F5',
            headerBackground: '#FFB6C1',
            columnBackground: '#FFF0F5',
            cardBackground: '#FFFFFF',
            textColor: '#FF1493',
            secondaryText: '#D4006A',
            border: '#FF69B4',
            buttonBackground: '#FF1493',
            buttonHover: '#FF69B4',
            stationCodeColor: '#D4006A',
            columnHeaders: {
                inProgress: '#FF69B4',
                completed: '#FF1493'
            },
            dropdownBg: '#FF69B4',
            dropdownHover: '#FF1493'
        },
        mari: {
            name: 'Mari Mode',
            background: '#a50044',
            boardBackground: '#a50044',
            headerBackground: '#004d98',
            columnBackground: '#004d98',
            cardBackground: '#a50044',
            textColor: '#FFFFFF',
            secondaryText: '#edbb00',
            border: '#004d98',
            buttonBackground: '#ffed02',
            buttonHover: '#e6d502',
            stationCodeColor: '#ffed02',
            columnHeaders: {
                inProgress: '#edbb00',
                completed: '#a50044'
            }
        },
        arjun: {
            name: 'Arjun Mode',
            background: '#1A2F1A',
            boardBackground: '#1A2F1A',
            headerBackground: '#0D1F0D',
            columnBackground: '#234023',
            cardBackground: '#000000',
            textColor: '#E0E0E0',
            secondaryText: '#A0C0A0',
            border: '#2D4D2D',
            buttonBackground: '#006400',
            buttonHover: '#008000',
            stationCodeColor: '#00FF00',
            columnHeaders: {
                inProgress: '#1B5E20',
                completed: '#388E3C'
            }
        }
    };


        const STYLES = `
    .nsl-board {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 600px;
        max-width: 600px;
        background: #1E1E1E;
        color: #E0E0E0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        z-index: 9999;
        font-family: Arial, sans-serif;
        padding-top: 20px;
        overflow: hidden;
    }

    .board-header {
        background: #2D2D2D;
        padding: 15px;
        border-radius: 8px 8px 0 0;
        border-bottom: 1px solid #3D3D3D;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
    }

    .controls {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .control-group label {
        color: #E0E0E0;
        font-size: 12px;
    }

    .control-group select {
        padding: 5px 30px 5px 10px;
        background: #2D2D2D;
        color: #E0E0E0;
        border: 1px solid #3D3D3D;
        border-radius: 4px;
        width: 120px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        background-image:
            linear-gradient(45deg, transparent 50%, #E0E0E0 50%),
            linear-gradient(135deg, #E0E0E0 50%, transparent 50%);
        background-position:
            calc(100% - 20px) calc(1em + 2px),
            calc(100% - 15px) calc(1em + 2px);
        background-size:
            5px 5px,
            5px 5px;
        background-repeat: no-repeat;
    }

    .control-group select option {
        background-color: #2D2D2D;
        color: #E0E0E0;
    }

    .control-group select:hover {
        border-color: #4D4D4D;
    }

    .control-group select:focus {
        outline: none;
        border-color: #0066CC;
    }


    .refresh-button {
        padding: 6px 12px;
        background: #243575;
        color: #FFFFFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .refresh-button:hover {
        background: #0052A3;
    }

    .columns-container {
        display: flex;
        gap: 10px;
        padding: 15px;
        height: 600px;
        overflow: hidden;
    }

    .column {
        flex: 1;
        background: #2D2D2D;
        border-radius: 4px;
        border: 1px solid #3D3D3D;
        display: flex;
        flex-direction: column;
    }

    .column-header {
        padding: 10px;
        font-weight: bold;
        border-bottom: 1px solid #3D3D3D;
        color: #FFFFFF;
    }

    .column-content {
        overflow-y: auto;
        padding: 10px;
        flex-grow: 1;
    }

    .station-card {
        background: #1E1E1E;
        margin-bottom: 8px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #3D3D3D;
    }

    .station-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }

    .business-type {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        color: #FFFFFF;
    }

    .tdays {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    min-width: 35px;
    display: inline-block;
    text-align: center;
}


    .station-name {
        color: #E0E0E0;
        font-weight: bold;
        margin: 5px 0;
    }

    .status-text {
        color: #E0E0E0;
        font-size: 12px;
        margin-left: 15px;
    }

    .theme-selector {
        position: absolute;
        right: 45px;
        top: 5px;
        z-index: 10001;
    }

    .theme-icon {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
    }

    .theme-dropdown {
        position: absolute;
        right: 0;
        top: 100%;
        background: var(--dropdown-bg, #2D2D2D);
        border: 1px solid var(--border-color, #3D3D3D);
        border-radius: 4px;
        display: none;
        min-width: 150px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .theme-dropdown.show {
        display: block;
    }

    .theme-option {
        padding: 8px 12px;
        cursor: pointer;
        color: var(--text-color, #E0E0E0);
    }

    .theme-option:hover {
        background: var(--hover-bg, #3D3D3D);
    }

    .collapse-btn {
        position: absolute;
        right: 10px;
        top: 5px;
        background: none;
        border: none;
        color: #E0E0E0;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
        z-index: 10000;
    }

    .collapse-btn:hover {
        color: #FFFFFF;
    }

    .collapsed .columns-container {
        display: none;
    }

    .collapsed {
        height: auto;
        width: auto;
        min-width: 200px;
    }

    /* Scrollbar Styles */
    .column-content::-webkit-scrollbar {
        width: 8px;
    }

    .column-content::-webkit-scrollbar-track {
        background: #2D2D2D;
    }

    .column-content::-webkit-scrollbar-thumb {
        background-color: #3D3D3D;
        border-radius: 20px;
        border: 2px solid #2D2D2D;
    }

    .column-content::-webkit-scrollbar-thumb:hover {
        background-color: #4D4D4D;
    }
`;

    // Add styles to page
    GM_addStyle(STYLES);


        function applyColorScheme(themeName) {
        const theme = COLOR_SCHEMES[themeName];
        const styles = `
            .nsl-board {
                background: ${theme.boardBackground};
                color: ${theme.textColor};
                border: 2px solid ${theme.border};
            }

            .board-header {
                background: ${theme.headerBackground};
                border-bottom: 1px solid ${theme.border};
            }

            .control-group label {
                color: ${theme.textColor};
            }

            .control-group select {
        background-color: ${theme.controlDropdowns?.background || theme.background};
        color: ${theme.controlDropdowns?.text || theme.textColor};
        border: 1px solid ${theme.border};
        background-image:
            linear-gradient(45deg, transparent 50%, ${theme.controlDropdowns?.text || theme.textColor} 50%),
            linear-gradient(135deg, ${theme.controlDropdowns?.text || theme.textColor} 50%, transparent 50%);
        background-position:
            calc(100% - 20px) calc(1em + 2px),
            calc(100% - 15px) calc(1em + 2px);
        background-size:
            5px 5px,
            5px 5px;
        background-repeat: no-repeat;
    }

    .control-group select option {
        background-color: ${theme.controlDropdowns?.optionBg || theme.background};
        color: ${theme.controlDropdowns?.text || theme.textColor};
    }

    .control-group select:hover {
        border-color: ${theme.buttonHover};
    }

    .control-group select:focus {
        outline: none;
        border-color: ${theme.buttonBackground};
    }


            .refresh-button {
                background: ${theme.buttonBackground};
                color: ${themeName === 'mari' ? 'black' : 'white'};
            }

            .refresh-button:hover {
                background: ${theme.buttonHover};
            }

            .column {
                background: ${theme.columnBackground};
                border: 1px solid ${theme.border};
            }

            .station-card {
                background: ${theme.cardBackground};
                border: 1px solid ${theme.border};
            }

            .station-name {
                color: ${theme.stationCodeColor};
            }

            .status-text {
                color: ${theme.textColor};
            }

            .collapse-btn {
                color: ${theme.textColor};
            }

            .in-progress .column-header {
                background: ${theme.columnHeaders.inProgress};
            }

            .completed .column-header {
                background: ${theme.columnHeaders.completed};
            }

            .theme-dropdown {
                background: ${theme.background};
                border-color: ${theme.border};
            }

            .theme-option {
                color: ${theme.textColor};
            }

            .theme-option:hover {
                background: ${theme.buttonHover};
            }

            .column-content::-webkit-scrollbar-track {
                background: ${theme.columnBackground};
            }

            .column-content::-webkit-scrollbar-thumb {
                background-color: ${theme.border};
                border: 2px solid ${theme.columnBackground};
            }
        `;

         const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) {
        existingStyle.remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-theme-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    localStorage.setItem('nslBoard_theme', themeName);

    // Only refresh if an owner is selected
    const ownerSelect = document.getElementById('owner-select');
    if (ownerSelect && ownerSelect.value) {
        refreshStations();
    }
}


    function createNSLBoard() {
        const board = document.createElement('div');
        board.className = 'nsl-board';

        // Create theme selector
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <button class="theme-icon">🎨</button>
            <div class="theme-dropdown">
                ${Object.entries(COLOR_SCHEMES).map(([key, theme]) => `
                    <div class="theme-option" data-theme="${key}">
                        ${theme.name}
                    </div>
                `).join('')}
            </div>
        `;

        // Create collapse button
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'collapse-btn';
        collapseBtn.textContent = '▲';
        collapseBtn.onclick = function(e) {
            e.stopPropagation();
            board.classList.toggle('collapsed');
            this.textContent = board.classList.contains('collapsed') ? '▼' : '▲';
            savePosition(board);
        };

        // Create the rest of the board content
        const content = `
            <div class="board-header">
                <div class="controls">
                    <div class="control-group">
                        <label>Owner:</label>
                        <select id="owner-select">
                            <option value="">Select Owner</option>
                            ${OWNERS.map(owner =>
                                `<option value="${owner}">${owner}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Business Type:</label>
                        <select id="business-type-select">
                            <option value="All">All</option>
                            ${Object.keys(TAB_CONFIG).map(type =>
                                `<option value="${type}">${type}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <button class="refresh-button" id="refresh-btn">⟳ Refresh</button>
                </div>
                <span class="status-text" id="status-text">Select an owner and click Refresh</span>
            </div>
            <div class="columns-container">
                <div class="column in-progress">
                    <div class="column-header">In Progress (0)</div>
                    <div class="column-content" id="in-progress-column"></div>
                </div>
                <div class="column completed">
                    <div class="column-header">Completed (0)</div>
                    <div class="column-content" id="completed-column"></div>
                </div>
            </div>
        `;

        board.innerHTML = content;
        board.insertBefore(themeSelector, board.firstChild);
        board.insertBefore(collapseBtn, board.firstChild);
        document.body.appendChild(board);

        // Make the board draggable by the header
        const header = board.querySelector('.board-header');
        makeDraggable(board, header);

        // Load saved position
        loadPosition(board);

        initializeEventListeners();
    }

        function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const originalWidth = element.offsetWidth;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target !== handle) return;
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

            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;

            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - originalWidth;

            element.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
            element.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
            element.style.width = originalWidth + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            savePosition(element);
        }
    }

    function savePosition(element) {
        const position = {
            top: element.style.top,
            left: element.style.left,
            width: element.style.width,
            collapsed: element.classList.contains('collapsed')
        };
        localStorage.setItem('nslBoard_position', JSON.stringify(position));
    }

    function loadPosition(element) {
        const position = localStorage.getItem('nslBoard_position');
        if (position) {
            const { top, left, width, collapsed } = JSON.parse(position);
            if (top && left) {
                element.style.top = top;
                element.style.left = left;
            }
            if (width) {
                element.style.width = width;
            }
            if (collapsed) {
                element.classList.add('collapsed');
                const collapseBtn = element.querySelector('.collapse-btn');
                if (collapseBtn) {
                    collapseBtn.textContent = '▼';
                }
            }
        }
    }

    function initializeEventListeners() {
        document.getElementById('refresh-btn').addEventListener('click', refreshStations);

        const themeIcon = document.querySelector('.theme-icon');
        const themeDropdown = document.querySelector('.theme-dropdown');

        if (themeIcon && themeDropdown) {
            themeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                themeDropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                themeDropdown.classList.remove('show');
            });

            document.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const theme = e.target.dataset.theme;
                    applyColorScheme(theme);
                    themeDropdown.classList.remove('show');
                });
            });

            const savedTheme = localStorage.getItem('nslBoard_theme') || 'dark';
            applyColorScheme(savedTheme);
        }

        themeDropdown?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                themeDropdown?.classList.remove('show');
            }
        });
    }

    function createStationCard(station, businessType, tdays) {
    const card = document.createElement('div');
    card.className = 'station-card';
    const tdayColor = getTDayColor(tdays);
    const currentTheme = localStorage.getItem('nslBoard_theme') || 'dark';
    const theme = COLOR_SCHEMES[currentTheme];
    const businessTypeColor = currentTheme === 'gaby'
        ? (GABY_BUSINESS_COLORS[businessType] || '#FF69B4')
        : (BUSINESS_TYPE_COLORS[businessType] || '#4CAF50');

    // Adjust text colors and background based on theme
    const stationNameColor = theme.stationCodeColor || theme.textColor;
    const tdayTextColor = currentTheme === 'gaby' ? '#FFFFFF' : tdayColor;
    const tdayBackground = currentTheme === 'gaby' ? '#FF69B4' :
                          currentTheme === 'mari' ? '#004d98' :
                          theme.columnBackground || '#2D2D2D';

    card.innerHTML = `
        <div class="station-header">
            <span class="business-type" style="background-color: ${businessTypeColor}; color: #FFFFFF;">${businessType}</span>
            <span class="tdays" style="color: ${tdayTextColor}; background-color: ${tdayBackground};">T${tdays}</span>
        </div>
        <div class="station-name" style="color: ${stationNameColor};">${station}</div>
    `;

    // Add specific styles for Gaby theme
    if (currentTheme === 'gaby') {
        card.style.boxShadow = '0 2px 4px rgba(255,20,147,0.1)';
        card.style.border = '1px solid #FF69B4';
    }

    return card;
}

    function updateStatus(message, type = 'info') {
        const statusText = document.getElementById('status-text');
        const theme = COLOR_SCHEMES[localStorage.getItem('nslBoard_theme') || 'dark'];
        const colors = {
            info: theme.textColor,
            success: theme.buttonBackground,
            error: '#FF0000',
            warning: '#FFA500'
        };
        statusText.textContent = message;
        statusText.style.color = colors[type];
    }

    function getTDayColor(tdays) {
        if (tdays === 'Launch') return '#E8F5E9';
        const t = parseInt(tdays);
        if (isNaN(t)) return '#E8F5E9';
        if (t > 22) return '#4CAF50';
        if (t >= 15) return '#FFA500';
        return '#FF0000';
    }

    async function fetchQuipData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${BASE_URL}/1/threads/${QUIP_ID}`,
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`Failed to fetch data: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function refreshStations() {
    const owner = document.getElementById('owner-select').value;
    if (!owner) {
        updateStatus('Please select an owner first', 'warning');
        return;
    }

    updateStatus('Fetching stations...', 'info');

    // Clear existing stations
    document.getElementById('in-progress-column').innerHTML = '';
    document.getElementById('completed-column').innerHTML = '';

    try {
        const data = await fetchQuipData();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.html, 'text/html');

        const selectedBusinessType = document.getElementById('business-type-select').value;
        let inProgressCount = 0;
        let completedCount = 0;

        console.log('Fetching data for owner:', owner); // Debug log

        const tables = doc.querySelectorAll('table');
        tables.forEach(table => {
            const title = table.getAttribute('title')?.trim() || '';

            if (title in TAB_CONFIG && (selectedBusinessType === 'All' || selectedBusinessType === title)) {
                const config = TAB_CONFIG[title];
                const rows = table.querySelectorAll('tr');

                // Skip header row
                for (let i = 1; i < rows.length; i++) {
                    const cells = rows[i].querySelectorAll('td');
                    if (cells.length > config.owner_column) {
                        const ownerText = cells[config.owner_column].textContent.trim();

                        if (ownerText === owner) {
                            const station = cells[config.station_column].textContent.trim();
                            const tdays = cells[config.tdays_column].textContent.trim();

                            console.log('Found station:', station, 'for owner:', owner); // Debug log

                            const card = createStationCard(station, title, tdays);

                            if (tdays === 'Launch') {
                                document.getElementById('completed-column').appendChild(card);
                                completedCount++;
                            } else {
                                document.getElementById('in-progress-column').appendChild(card);
                                inProgressCount++;
                            }
                        }
                    }
                }
            }
        });

        const inProgressHeader = document.querySelector('.in-progress .column-header');
        const completedHeader = document.querySelector('.completed .column-header');
        inProgressHeader.textContent = `In Progress (${inProgressCount})`;
        completedHeader.textContent = `Completed (${completedCount})`;

        // Update status
        const totalCount = inProgressCount + completedCount;
        const businessTypeText = selectedBusinessType !== 'All' ? ` in ${selectedBusinessType}` : '';
        updateStatus(`Found ${totalCount} stations for ${owner}${businessTypeText}`, 'success');

    } catch (error) {
        console.error('Error refreshing stations:', error);
        updateStatus('Error fetching stations', 'error');
    }
}


    // Initialize the board when the page loads
    createNSLBoard();

})();
