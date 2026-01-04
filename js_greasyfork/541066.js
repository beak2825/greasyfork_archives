// ==UserScript==
// @name         JC Task Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Track Jurisdiction Change tasks from Quip
// @author       Arjun Bridgelal
// @match        https://quip-amazon.com/tP7kA63aBaaR/Jurisdiction-Configuration-Q1-2025-Tracker*
// @match        https://quip-amazon.com/BbaaAYz9OOQ7/Jurisdiction-Configuration-Q2-2025-Tracker*
// @match        https://quip-amazon.com/b0w8Awc6xyjW/Jurisdiction-Configuration-Q3-2025-Tracker*
// @match        https://quip-amazon.com/o3q3AgLHlYn2/Jurisdiction-Configuration-Q4-2025-Tracker*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541066/JC%20Task%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/541066/JC%20Task%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const QUIP_SOURCES = {
        'Q1': { id: 'tP7kA63aBaaR', name: 'JC Q1' },
        'Q2': { id: 'BbaaAYz9OOQ7', name: 'JC Q2' },
        'Q3': { id: 'b0w8Awc6xyjW', name: 'JC Q3' },
        'Q4': { id: 'o3q3AgLHlYn2', name: 'JC Q4' }
    };

    const API_TOKEN = 'ZE1HOU1BcE9UNVk=|1782085439|ygCv5CrNibKxK1yz4beV84m4h6KMVD8Zf2ae/KCP33o=';
    const BASE_URL = 'https://platform.quip-amazon.com';
    const OWNERS = ['Akhil', 'Arjun', 'Mari', 'Christian', 'Rene', 'Gaby', 'Preeti'];

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
        stationCodeColor: '#E0E0E0'    // Same as text color for dark theme
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
        stationCodeColor: '#004d98',    // Dark blue for station codes
        dropdownBg: '#FFFFFF',
        dropdownHover: '#F0F0F0'
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
        stationCodeColor: '#D4006A',    // Darker pink for station codes
        columnHeaders: {
            notStarted: '#FFB6C1',
            inProgress: '#FF69B4',
            completed: '#FF1493',
            blocked: '#FF00FF',
            toBeRevised: '#DB7093'
        },
       dropdownBg: '#FFF0F5',        // Theme picker dropdown
    dropdownHover: '#FFB6C1',     // Theme picker hover
    controlDropdowns: {           // New property for control dropdowns
        background: '#FF69B4',    // Background for Quarter/Owner/Week dropdowns
        optionBg: '#FF69B4',      // Background for dropdown options
        optionHover: '#FF1493',   // Background when hovering over options
        text: '#FFFFFF'           // Text color for dropdown options
    }
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
        stationCodeColor: '#ffed02',    // Yellow for station codes
        columnHeaders: {
            notStarted: '#004d98',
            inProgress: '#edbb00',
            completed: '#a50044',
            blocked: '#8b003a',
            toBeRevised: '#0060c0'
        },
        dropdownBg: '#004d98',
        dropdownHover: '#0060c0'
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
        stationCodeColor: '#FFFFFF',    // Bright green for station codes
        columnHeaders: {
    notStarted: '#1B5E20',    // Dark forest green
        inProgress: '#2E7D32',    // Medium forest green
        completed: '#388E3C',     // Forest green
        blocked: '#8B0000',       // Dark red (for contrast)
        toBeRevised: '#4A5D23'    // Olive green
},
        dropdownBg: '#1A2F1A',
        dropdownHover: '#234023',
    },
};



    // Task type colors
    const TASK_TYPE_COLORS = {
        'TBD': '#4D4D4D',        // Gray
        'NSL': '#0066CC',        // Blue
        'JC': '#16A085',         // Green Blue
        'JC + OJ': '#8E44AD',    // Purple
        'JC + OJ + SWA': '#2980B9', // Dark Blue
        'OJ': '#E74C3C',         // Red
        'OJ + OJ': '#C0392B',    // Dark Red
        'HB': '#27AE60',         // Green
        'JC + HB': '#2C3E50',    // Dark Blue Gray
        'HB-L': '#3498DB',       // Light Blue
        'HUB': '#9B59B6',        // Purple
        'CLOSE': '#E67E22',      // Orange
        'SWA': '#F1C40F',        // Yellow
        'SD': '#1ABC9C',         // Turquoise
        'EXCL': '#34495E',       // Navy Blue
        'CR': '#16A085',         // Green Blue
        'PT': '#2980B9',         // Dark Blue
        'TI': '#8E44AD',         // Purple
        'SD-CS': '#27AE60',      // Green
        'N/A': '#95A5A6'         // Light Gray
    };

    // CSS Styles
    const STYLES = `
        .jc-board {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 1200px;
            max-width: 1200px;
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
            padding: 5px;
            background: #2D2D2D;
            color: #E0E0E0;
            border: 1px solid #3D3D3D;
            border-radius: 4px;
            width: 120px;
        }

        .refresh-button {
            padding: 6px 12px;
            background: #0066CC;
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
            text-align: center;
        }

        .not-started .column-header { background: #2D2D2D; }
        .in-progress .column-header { background: #0066CC; }
        .completed .column-header { background: #16A085; }
        .blocked .column-header { background: #E74C3C; }
        .to-be-revised .column-header { background: #8E44AD; }

        .column-content {
            overflow-y: auto;
            padding: 10px;
            flex-grow: 1;
        }

        .task-card {
            background: #1E1E1E;
            margin-bottom: 8px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #3D3D3D;
        }

        .task-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .task-type {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            color: #FFFFFF;
        }

        .task-id {
            color: #0066CC;
            text-decoration: none;
        }

        .task-title {
            color: #E0E0E0;
            font-weight: bold;
            margin: 5px 0;
        }

        .task-info {
            color: #A0A0A0;
            font-size: 11px;
        }

        .status-text {
            color: #E0E0E0;
            font-size: 12px;
            margin-left: 15px;
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
    `;

        // Add styles to page
    GM_addStyle(STYLES);

    // Helper Functions
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

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
            const maxLeft = window.innerWidth - element.offsetWidth;

            element.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
            element.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
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
            collapsed: element.classList.contains('collapsed')
        };
        localStorage.setItem('jcBoard_position', JSON.stringify(position));
    }

    function loadPosition(element) {
        const position = localStorage.getItem('jcBoard_position');
        if (position) {
            const { top, left, collapsed } = JSON.parse(position);
            if (top && left) {
                element.style.top = top;
                element.style.left = left;
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

    function applyColorScheme(themeName) {
    const theme = COLOR_SCHEMES[themeName];
    const styles = `
        .jc-board {
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
            background: ${theme.background};
            color: ${theme.textColor};
            border: 1px solid ${theme.border};
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

        .task-card {
            background: ${theme.cardBackground};
            border: 1px solid ${theme.border};
            color: ${theme.textColor};
        }

         .task-id {
            color: ${theme.taskIdColor || theme.textColor} !important;
        }

        .task-info {
            color: ${theme.secondaryText};
        }

        .status-text {
            color: ${theme.textColor};
        }

        .collapse-btn {
            color: ${theme.textColor};
        }

        .collapse-btn:hover {
            color: ${theme.secondaryText};
        }

        .column-content::-webkit-scrollbar-track {
            background: ${theme.columnBackground};
        }

        .column-content::-webkit-scrollbar-thumb {
            background-color: ${theme.border};
            border: 2px solid ${theme.columnBackground};
        }

        /* Column header colors */
        ${theme.columnHeaders ? `
            .not-started .column-header {
                background: ${theme.columnHeaders.notStarted};
                color: ${themeName === 'gaby' ? theme.textColor : '#FFFFFF'};
            }
            .in-progress .column-header {
                background: ${theme.columnHeaders.inProgress};
                color: ${themeName === 'mari' ? '#000000' : '#FFFFFF'};
            }
            .completed .column-header {
                background: ${theme.columnHeaders.completed};
                color: #FFFFFF;
            }
            .blocked .column-header {
                background: ${theme.columnHeaders.blocked};
                color: #FFFFFF;
            }
            .to-be-revised .column-header {
                background: ${theme.columnHeaders.toBeRevised};
                color: #FFFFFF;
            }
        ` : ''}

        /* Dropdown styles */
        .theme-dropdown {
            background: ${theme.dropdownBg || theme.background};
            border-color: ${theme.border};
        }

        .theme-option {
            color: ${theme.textColor};
        }

        .theme-option:hover {
            background: ${theme.dropdownHover || theme.buttonHover};
        }
        /* Control Dropdowns Styling */
        .control-group select {
            padding: 5px 30px 5px 10px;
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
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        .control-group select option {
            background-color: ${theme.controlDropdowns?.optionBg || theme.background};
            color: ${theme.controlDropdowns?.text || theme.textColor};
        }

        .control-group select option:hover,
        .control-group select option:focus {
            background-color: ${theme.controlDropdowns?.optionHover || theme.buttonHover};
        }
    `;

    // Remove existing dynamic styles
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Add new styles
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-theme-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Reformat existing task cards with new theme colors
    reformatTaskCards(theme);

    // Save theme preference
    localStorage.setItem('jcBoard_theme', themeName);
}


    // Create and initialize the board
    function createJCBoard() {
        const board = document.createElement('div');
        board.className = 'jc-board';

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


        // Add collapse button
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'collapse-btn';
        collapseBtn.textContent = '▲';
        collapseBtn.onclick = function(e) {
            e.stopPropagation();
            board.classList.toggle('collapsed');
            this.textContent = board.classList.contains('collapsed') ? '▼' : '▲';
            savePosition(board);
        };

        board.innerHTML = `
    <div class="board-header">
        <div class="controls">
            <div class="control-group">
                <label>Quarter:</label>
                <select id="quarter-select">
                    <option value="All">All</option>
                    ${Object.keys(QUIP_SOURCES).map(q =>
                        `<option value="${q}">${q}</option>`
                    ).join('')}
                </select>
            </div>
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
                <label>Week:</label>
                <select id="week-select">
                    <option value="All">All</option>
                </select>
            </div>
            <button class="refresh-button" id="refresh-btn">⟳ Refresh</button>
        </div>
        <span class="status-text" id="status-text">Select an owner and click Refresh</span>
    </div>
    <div class="columns-container">
        <div class="column not-started">
            <div class="column-header">Not Started (0)</div>
            <div class="column-content" id="not-started-column"></div>
        </div>
        <div class="column in-progress">
            <div class="column-header">In Progress (0)</div>
            <div class="column-content" id="in-progress-column"></div>
        </div>
        <div class="column completed">
            <div class="column-header">Completed (0)</div>
            <div class="column-content" id="completed-column"></div>
        </div>
        <div class="column blocked">
            <div class="column-header">Blocked (0)</div>
            <div class="column-content" id="blocked-column"></div>
        </div>
        <div class="column to-be-revised">
            <div class="column-header">To Be Revised (0)</div>
            <div class="column-content" id="to-be-revised-column"></div>
        </div>
    </div>
`;


    // Add the theme selector before the collapse button
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

    function initializeEventListeners() {
    // Refresh button listener
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTasks);
    }

    // Theme selector listeners
    const themeIcon = document.querySelector('.theme-icon');
    const themeDropdown = document.querySelector('.theme-dropdown');

    if (themeIcon && themeDropdown) {
        // Toggle dropdown when clicking theme icon
        themeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            themeDropdown.classList.remove('show');
        });

        // Theme option selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = e.target.dataset.theme;
                applyColorScheme(theme);
                themeDropdown.classList.remove('show');
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('jcBoard_theme') || 'dark';
        applyColorScheme(savedTheme);
    }

    // Quarter select listener
    const quarterSelect = document.getElementById('quarter-select');
    if (quarterSelect) {
        quarterSelect.addEventListener('change', () => {
            const weekSelect = document.getElementById('week-select');
            if (weekSelect) {
                weekSelect.innerHTML = '<option value="All">All</option>';
            }
        });
    }

    // Owner select listener
    const ownerSelect = document.getElementById('owner-select');
    if (ownerSelect) {
        // Load saved owner preference if any
        const savedOwner = localStorage.getItem('jcBoard_owner');
        if (savedOwner) {
            ownerSelect.value = savedOwner;
        }

        ownerSelect.addEventListener('change', (e) => {
            localStorage.setItem('jcBoard_owner', e.target.value);
        });
    }

    // Prevent dropdown from closing when clicking inside it
    themeDropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // ESC key to close dropdown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            themeDropdown?.classList.remove('show');
        }
    });
}


    // Create a task card
    function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    const taskTypeColor = TASK_TYPE_COLORS[task.task_type] || '#95A5A6';
    const theme = COLOR_SCHEMES[localStorage.getItem('jcBoard_theme') || 'dark'];

    // Function to wrap station codes in colored span
    const formatTitle = (title) => {
        // This regex will match station codes (2-3 letters followed by numbers)
        return title.replace(/([A-Z]{2,3}\d+)/g, (match) => {
            return `<span style="color: ${theme.stationCodeColor}; font-weight: bold;">${match}</span>`;
        });
    };

    card.innerHTML = `
        <div class="task-header">
            <span class="task-type" style="background-color: ${taskTypeColor};">${task.task_type || 'N/A'}</span>
            <span class="task-quarter-week">${task.quarter} - ${task.week}</span>
        </div>
        <div class="task-title">
            <a href="${task.link}" class="task-id" target="_blank">#${task.id}</a>
            ${formatTitle(task.title)}
        </div>
        <div class="task-info">
            <span>Owner: ${task.owner}</span>
            <span>Status: ${task.status}</span>
        </div>
    `;

    return card;
}

function reformatTaskCards(theme) {
    const taskTitles = document.querySelectorAll('.task-title');
    taskTitles.forEach(titleDiv => {
        // Get the original title text (excluding the task ID)
        const taskId = titleDiv.querySelector('.task-id').outerHTML;
        const originalText = titleDiv.innerHTML
            .replace(taskId, '')
            .replace(/<span style="color: [^>]+>/g, '')
            .replace(/<\/span>/g, '');

        // Reformat with new theme color
        const formattedText = originalText.replace(/([A-Z]{2,3}\d+)/g, (match) => {
            return `<span style="color: ${theme.stationCodeColor}; font-weight: bold;">${match}</span>`;
        });

        titleDiv.innerHTML = `${taskId}${formattedText}`;
    });
}


    // Update status text
    function updateStatus(message, type = 'info') {
        const statusText = document.getElementById('status-text');
        const colors = {
            info: '#E0E0E0',      // Light gray
            success: '#16A085',    // Green
            error: '#E74C3C',      // Red
            warning: '#F39C12'     // Orange
        };
        statusText.textContent = message;
        statusText.style.color = colors[type];
    }

        // Fetch data from Quip
    async function fetchQuipData(quipId) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${BASE_URL}/1/threads/${quipId}`,
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


    // Refresh tasks
    async function refreshTasks() {
        const owner = document.getElementById('owner-select').value;
        if (!owner) {
            updateStatus('Please select an owner first', 'warning');
            return;
        }

        updateStatus('Fetching tasks...', 'info');

        // Clear existing tasks
        const columns = ['not-started', 'in-progress', 'completed', 'blocked', 'to-be-revised'];
        columns.forEach(col => {
            document.getElementById(`${col}-column`).innerHTML = '';
        });

        const tasks = {
            'not-started': [],
            'in-progress': [],
            'completed': [],
            'blocked': [],
            'to-be-revised': []
        };

        try {
            const selectedQuarter = document.getElementById('quarter-select').value;
            const selectedWeek = document.getElementById('week-select').value;
            const quipDocs = selectedQuarter === 'All' ?
                Object.entries(QUIP_SOURCES) :
                [[selectedQuarter, QUIP_SOURCES[selectedQuarter]]];

            const weeksFound = new Set();
            let totalTasks = 0;

            for (const [quarter, quipInfo] of quipDocs) {
                const data = await fetchQuipData(quipInfo.id);
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.html, 'text/html');

                const tables = doc.querySelectorAll('table');
                tables.forEach(table => {
                    const weekNum = table.getAttribute('title')?.trim();
                    if (weekNum?.startsWith('WK')) {
                        weeksFound.add(weekNum);

                        if (selectedWeek !== 'All' && selectedWeek !== weekNum) {
                            return;
                        }

                        const rows = table.querySelectorAll('tr');
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 19) {  // Make sure we have all columns including R
                                const ownerText = cells[14].textContent.trim();

                                if (ownerText === owner) {
                                    const task = {
                                        id: cells[0].textContent.trim(),
                                        title: cells[1].textContent.trim(),
                                        status: cells[2].textContent.trim(),
                                        week: weekNum,
                                        owner: ownerText,
                                        quarter: quarter,
                                        task_type: cells[18].textContent.trim(), // Column R
                                        link: cells[0].querySelector('a')?.href || '#'
                                    };

                                    // Categorize task
                                    const status = task.status.toLowerCase();
                                    if (status.includes('not started') || status.includes('pending') || status.includes('tracked')) {
                                        tasks['not-started'].push(task);
                                    } else if (status.includes('in progress') || status.includes('in-progress')) {
                                        tasks['in-progress'].push(task);
                                    } else if (status.includes('complete') || status.includes('completed')) {
                                        tasks['completed'].push(task);
                                    } else if (status.includes('blocked') || status.includes('on hold')) {
                                        tasks['blocked'].push(task);
                                    } else if (status.includes('to be revised')) {
                                        tasks['to-be-revised'].push(task);
                                    }

                                    totalTasks++;
                                }
                            }
                        });
                    }
                });
            }

            // Update week filter options
            const weekSelect = document.getElementById('week-select');
            const currentValue = weekSelect.value;
            weekSelect.innerHTML = '<option value="All">All</option>' +
                Array.from(weeksFound).sort().map(week =>
                    `<option value="${week}" ${week === currentValue ? 'selected' : ''}>${week}</option>`
                ).join('');

            // Display tasks
            Object.entries(tasks).forEach(([column, columnTasks]) => {
                const columnElement = document.getElementById(`${column}-column`);
                const headerElement = columnElement.parentElement.querySelector('.column-header');
                headerElement.textContent = `${headerElement.textContent.split('(')[0]}(${columnTasks.length})`;

                columnTasks.sort((a, b) => (a.quarter + a.week).localeCompare(b.quarter + b.week));
                columnTasks.forEach(task => {
                    columnElement.appendChild(createTaskCard(task));
                });
            });

            updateStatus(`Found ${totalTasks} tasks`, 'success');

        } catch (error) {
            console.error('Error refreshing tasks:', error);
            updateStatus('Error fetching tasks', 'error');
        }
    }

    // Initialize the board when the page loads
    createJCBoard();

})();
