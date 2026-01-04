// ==UserScript==
// @name        Milovana: Ultimate Hentai Lottery of Denial 2 v2
// @namespace   Violentmonkey Scripts
// @match       https://milovana.com/webteases/showtease.php?id=41749*
// @grant       none
// @version     1.4.0
// @author      wompi72
// @description All help utilities and stat tracking for Ultimate Hentai Lottery of Denial 2 on Milovana.com
// @downloadURL https://update.greasyfork.org/scripts/541258/Milovana%3A%20Ultimate%20Hentai%20Lottery%20of%20Denial%202%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/541258/Milovana%3A%20Ultimate%20Hentai%20Lottery%20of%20Denial%202%20v2.meta.js
// ==/UserScript==


(function () {
    // START SCRIPT DIFFERENCE BETWEEN 1 and 2: 2222222222222222222222222222222222222
    const STORAGE_PREFIX = 'hentai_denial_2_';
    const PANEL_TITLE = "Hentai Denial Helper 2 ";
    const BASE_URL = "https://milovana.com/webteases/showtease.php?id=41749";
    const PAGES_START = 4;
    const PAGES_END = 206;
    const DEFAULT_DIFFICULTY = 'Moderate';

    const DIFFICULTY_CONSTS = {
        Weak: {
            CHASTITY_MAX_DEFAULT: 5,
            PAUSE_AFTER_EDGE: 50,
            PAUSE_AFTER_UNAUTHORIZED_EDGE: 60,
            PAGES_UNTIL_PAUSE: 4,
            PAUSE_DURATION_HOURS: 12,
            PENALTY_FOR_RO: "MAX",
            POINTS_PENALTY_FOR_RO: 500,
            POINTS_PENALTY_FOR_LEAVING: 0,
            CHASTITY_PENALTY_FOR_LEAVING: 0,
            ALT_LABELS: []
        },
        Moderate: {
            CHASTITY_MAX_DEFAULT: 14,
            PAUSE_AFTER_EDGE: 40,
            PAUSE_AFTER_UNAUTHORIZED_EDGE: 40,
            PAGES_UNTIL_PAUSE: 6,
            PAUSE_DURATION_HOURS: 12,
            PENALTY_FOR_RO: "MAX",
            POINTS_PENALTY_FOR_RO: 500,
            POINTS_PENALTY_FOR_LEAVING: 150,
            CHASTITY_PENALTY_FOR_LEAVING: 7,
            ALT_LABELS: ["Chastity"],
        },
        Hard: {
            CHASTITY_MAX_DEFAULT: 28,
            PAUSE_AFTER_EDGE: 30,
            PAUSE_AFTER_UNAUTHORIZED_EDGE: 30,
            PAGES_UNTIL_PAUSE: 8,
            PAUSE_DURATION_HOURS: 12,
            PENALTY_FOR_RO: "MAX",
            POINTS_PENALTY_FOR_RO: 500,
            POINTS_PENALTY_FOR_LEAVING: 300,
            CHASTITY_PENALTY_FOR_LEAVING: 14,
            ALT_LABELS: ["Hardcore"],
        },
        Extreme: {
            CHASTITY_MAX_DEFAULT: 50,
            PAUSE_AFTER_EDGE: 20,
            PAUSE_AFTER_UNAUTHORIZED_EDGE: 20,
            PAGES_UNTIL_PAUSE: 10,
            PAUSE_DURATION_HOURS: 12,
            PENALTY_FOR_RO: "MAX",
            POINTS_PENALTY_FOR_RO: 500,
            POINTS_PENALTY_FOR_LEAVING: 500,
            CHASTITY_PENALTY_FOR_LEAVING: 30,
            ALT_LABELS: ["Insane"],
        },
    }
    // END SCRIPT DIFFERENCE BETWEEN 1 and 2: 2222222222222222222222222222222222222

    const STORAGE = {
        SESSION_ACTIVE: STORAGE_PREFIX + 'session_active',
        CURRENT_DIFFICULTY: STORAGE_PREFIX + 'current_difficulty',
        POINTS: STORAGE_PREFIX + 'points',
        EDGES: STORAGE_PREFIX + 'edges',
        UNAUTHORIZED: STORAGE_PREFIX + 'unauthorized',
        EDGES_TO_DO: STORAGE_PREFIX + 'edges_to_do',
        TOTAL_PAGES: STORAGE_PREFIX + 'total_pages',
        PAGES_SINCE_PAUSE: STORAGE_PREFIX + 'pages_since_pause',
        PAUSE_ACTIVE: STORAGE_PREFIX + 'pause_active',
        PAUSE_END_TIMESTAMP: STORAGE_PREFIX + 'pause_end_timestamp',
        PANEL_VISIBLE: STORAGE_PREFIX + 'panel_visible',
        CHASTITY_VALUE: `${STORAGE_PREFIX}chastity_value`,
        CHASTITY_MAX: `${STORAGE_PREFIX}chastity_max`,
        CHASTITY_EXTRA: `${STORAGE_PREFIX}chastity_extra`,
        REVISITED_SITES: `${STORAGE_PREFIX}revisited_pages`,
        GODDESS_VISITED: `${STORAGE_PREFIX}goddess_visited_count`,
        LAST_PAGE: `${STORAGE_PREFIX}last_page`,
        MODIFIERS: `${STORAGE_PREFIX}modifiers`,
        BETWEEN_SESSION_DATA: `${STORAGE_PREFIX}between_session_data`,
        METRONOME_VOLUME: `${STORAGE_PREFIX}metronome_volume`,
        RNG_MIN: `${STORAGE_PREFIX}rng_min`,
        RNG_MAX: `${STORAGE_PREFIX}rng_max`,
        METRONOME_BPM: `${STORAGE_PREFIX}metronome_bpm`,
        NOTES: `${STORAGE_PREFIX}notes`,
        BLOCK_SOUND_AFTER_EDGE: `${STORAGE_PREFIX}block_sound_after_edge`,
        SESSION_START: `${STORAGE_PREFIX}session_start`,
        SESSION_HISTORY: `${STORAGE_PREFIX}session_history`,
    };

    const currentDifficultyKey = localStorage.getItem(STORAGE.CURRENT_DIFFICULTY) || DEFAULT_DIFFICULTY;
    const CONSTS = DIFFICULTY_CONSTS[currentDifficultyKey] || DIFFICULTY_CONSTS[DEFAULT_DIFFICULTY];

    // START SCRIPT DIFFERENCE BETWEEN NORMAL AND COMBI: 2222222222222222222222222222222222222
    function getRandomURL() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        const randomPage = getRandomInt(PAGES_START, PAGES_END);
        return generateTeaseUrl(randomPage);
    }

    function replacePageWithAnchors(node) {
        if (!node || !(node instanceof Node)) return;
        node.innerHTML = node.innerHTML.replace(/page (\d+)/g, (match, num) => {
            return `<a href="${generateTeaseUrl(num)}">${match}</a>`;
        });
    }

    function generateTeaseUrl(pageNumber) {
        return `${BASE_URL}&p=${pageNumber}#t`;
    }

    let currentPageNumber = null;

    function getCurrentPageNumber() {
        if (currentPageNumber !== null) {
            return currentPageNumber;
        }
        const match = window.location.href.match(/[?&]p=(\d+)/);
        currentPageNumber = match ? parseInt(match[1], 10) : 0;
        return currentPageNumber;
    }

    function getTeaseAndPageNumber() {
        return `${getCurrentPageNumber()}`
    }

    function isPageReload() {
        const _currentPageNumber = getTeaseAndPageNumber();
        if (_currentPageNumber < PAGES_START) {
            return false
        }
        return _currentPageNumber == localStorage.getItem(STORAGE.LAST_PAGE);
    }
    // END SCRIPT DIFFERENCE BETWEEN NORMAL AND COMBI: 2222222222222222222222222222222222222

    // Main
    (function () {
        function addCSS() {
            const style = document.createElement('style');
            style.textContent = `
#my-extension-panel {
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 435px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 999999;
    font-family: sans-serif;
}
#my-extension-header {
    background: #f1f1f1;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}
#my-extension-content {
    padding: 10px;
    display: block;
}
.stat-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 14px;
}
.stat-group {
    display: flex;
    align-items: center;
    gap: 4px;
}
.stat-label {
    font-weight: bold;
}
.stat-value {
    min-width: 20px;
    text-align: right;
}
.stat-controls {
    display: flex;
    flex-direction: column;
}
.stat-controls button {
    width: 14px;
    height: 14px;
    font-size: 5px;
    line-height: 12px;
    padding: 0;
    margin: 0;
    text-align: center;
    border: 1px solid #aaa;
    border-radius: 2px;
    background-color: #f9f9f9;
    cursor: pointer;
}
.stat-row input {
    font-size: 12px;
    padding: 2px;
}
.stat-row button,
.stat-row select {
    font-size: 10px;
    height: auto;
}
#pause-countdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.9);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 5rem;
    z-index: 1000000;
}
#pause-timer-text {
    margin-bottom: 2rem;
}
#pause-countdown-overlay button {
    font-size: 2rem;
    padding: 1rem 2rem;
    cursor: pointer;
}
.three-minute-reminder {
    position: fixed;
    bottom: 200px;
    left: 50%;
    background-color: #f00;
    color: #fff;
    padding: 10px;
    display: none;
    z-index: 99999;
    font-size: 2rem;
}
.fixed-element {
    position: fixed;
    bottom: 200px;
    left: 50%;
    background-color: #f00;
    color: #fff;
    padding: 10px;
    display: none;
    z-index: 99999;
    font-size: 2rem;
    transform: translateX(-50%); /* Center it horizontally */
}
.revisited-display {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #ffeb3b;
    font-size: 1.2rem;
    padding: 10px;
    text-align: center;
    z-index: 100000;
    display: none; /* Initially hidden */
}

.dictionary-display {
    position: fixed;
    top: 50px;
    right: 0;
    width: 300px;
    max-height: 400px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    overflow-y: auto;
    z-index: 100001;
    display: none; /* Initially hidden */
}

.dictionary-close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 2px 5px;
}
.modifier-dialog {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 50%;
    background-color: #ffffff;
    border-top: 2px solid #ccc;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
    padding: 0px 15px 15px 15px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
}
.rng-dialog {
    bottom: unset;
    left: unset;
    top: 0;
    right: 0;
    width: 500px;
}

.modifier-close-btn {
    align-self: flex-end;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: #333;
}

.modifier-close-btn:hover {
    color: #f44336;
}

.modifier-input-row {
    display: flex;
    gap: 10px; /* Space between inputs */
    margin-bottom: 15px;
    flex-wrap: wrap;
}
.modifier-input-row > p {
    margin-top: auto;
    margin-bottom: auto;
}

.modifier-input {
    padding: 5px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modifier-input[type="text"],
textarea.modifier-input {
    flex: 2;
}
textarea.modifier-input {
    resize: vertical;
}

.modifier-input[type="number"] {
    width: 60px; /* Fixed size for 3-digit numbers */
    height: 1.5rem;
    margin: auto;
}

.modifier-btn {
    padding: 10px;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
}

.modifier-submit-btn {
    align-self: flex-start;
}

.modifier-description {
    font-size: 0.9rem;
}
.modifiers-list-container {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
}

.modifier-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}

.modifier-description {
    flex: 1;
    font-size: 0.9rem;
}

.modifier-counter {
    width: 40px;
    text-align: center;
    font-size: 0.9rem;
}

.modifier-counter-btn {
    padding: 0 5px;
    font-size: 0.9rem;
    cursor: pointer;
}
.modifiers-list-container {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    max-height: 300px;
    overflow-y: auto;
}
.chastity-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000000000000;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

/* End Date Styles */
.end-date-display {
    margin-bottom: 20px;
    font-size: 20px;
}

/* Countdown Styles */
.countdown-display {
    margin-bottom: 20px;
    font-size: 18px;
}

.countdown-display.expired {
    color: #ff4d4d;
    font-weight: bold;
}

.end-early-button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.2s ease-in-out;
}
.font-small {
    font-size: 10px !important;
    gap: 2px;
}
.modifier-trigger-preview {
    position: fixed;
    top: 5px;
    left: 10px;
    background-color: #eee;
    border: 1px solid #ccc;
    padding: 4px 8px;
    font-size: 10px;
    z-index: 10000000;
    border-radius: 4px;
    font-family: sans-serif;
    max-width: 90vw;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
        `;
            document.head.appendChild(style);
        }

        function highlightDifficultyElements(node) {
            if (!node || !(node instanceof Node)) return;

            const currentDifficultyKey = localStorage.getItem(STORAGE.CURRENT_DIFFICULTY);
            const activeTags = localStorage.getItem(STORAGE.COMMA_SEPARATED_ACTIVE_TAGS)
                ?.split(',')
                .map(tag => tag.trim().toLowerCase()) || [];
            if (!currentDifficultyKey) return;

            const activeColor = '#00779b91';
            const inactiveColor = '#970000a8';

            const difficulties = Object.keys(DIFFICULTY_CONSTS);

            node.innerHTML = node.innerHTML.replace(/\[(.*?)\]/g, (match, contentInside) => {
                // Check for difficulty match (case-sensitive)
                const matchedDifficulty = difficulties.find(diffKey => {
                    const difficulty = DIFFICULTY_CONSTS[diffKey];
                    return diffKey === contentInside || difficulty.ALT_LABELS.includes(contentInside);
                });

                if (matchedDifficulty) {
                    const matchedIndex = difficulties.indexOf(matchedDifficulty);
                    const currentIndex = difficulties.indexOf(currentDifficultyKey);

                    const styleColor = matchedIndex <= currentIndex ? activeColor : inactiveColor;
                    return `<span style="color: ${styleColor}; font-weight: bold;">${match}</span>`;
                }

                // Check (case-insensitive) for active tags, with spaces trimmed
                if (activeTags.includes(contentInside.toLowerCase().trim())) {
                    return `<span style="color: ${activeColor}; font-weight: bold;">${match}</span>`;
                }

                // Mark unmatched content with a tooltip
                return `<span style="color: ${inactiveColor}; font-weight: bold;" title="Edit variables to enable Tags.">${match}</span>`;
            });
        }

        function registerShortcuts() {
            document.addEventListener('keydown', function (event) {
                if (isEditable(event.target)) return;

                if (event.altKey && event.code === 'KeyE') {
                    event.preventDefault();
                    if (MetronomeManager.isMetronomeActive()) {
                        MetronomeManager.addEdge();
                    } else {
                        EdgeManager.addEdge();
                    }
                }

                if (event.altKey && event.code === 'KeyW') {
                    if (MetronomeManager.isMetronomeActive()) {
                        MetronomeManager.addEdgeWithoutPoints();
                    } else {
                        EdgeManager.addEdgeWithoutPoints();
                    }
                }

                if (event.altKey && event.code === 'KeyT') {
                    if (MetronomeManager.isMetronomeActive()) {
                        MetronomeManager.addUnauthorizedEdge();
                    } else {
                        EdgeManager.addUnauthorizedEdge();
                    }
                }

                if (event.altKey && event.code === 'KeyT') {
                    if (MetronomeManager.isMetronomeActive()) {
                        MetronomeManager.addUnauthorizedEdge();
                    } else {
                        EdgeManager.addUnauthorizedEdge();
                    }
                }

                if (event.altKey && event.code === 'KeyQ') {
                    MetronomeManager.changeBpmAndUpdate(10)
                }

                if (event.altKey && event.code === 'KeyA') {
                    MetronomeManager.changeBpmAndUpdate(-10)
                }
            });
        }

        function createPanel() {
            const panel = document.createElement('div');
            panel.id = 'my-extension-panel';
            const header = document.createElement('div');
            header.id = 'my-extension-header';
            const content = document.createElement('div');
            content.id = 'my-extension-content';

            const savedVisible = localStorage.getItem(STORAGE.PANEL_VISIBLE) !== 'false';
            const isVisible = savedVisible || !SessionActiveManager.is_active();

            content.style.display = isVisible ? 'block' : 'none';

            const currentDifficulty = localStorage.getItem(STORAGE.CURRENT_DIFFICULTY);
            const difficultyLabel = currentDifficulty ? ` - ${currentDifficulty}` : '';

            header.textContent = PANEL_TITLE + difficultyLabel + (isVisible ? '▼' : '▲');

            header.addEventListener('click', () => {
                const visible = content.style.display !== 'none';
                const newVisible = !visible;
                content.style.display = newVisible ? 'block' : 'none';
                header.textContent = PANEL_TITLE + difficultyLabel + (newVisible ? '▼' : '▲');
                localStorage.setItem(STORAGE.PANEL_VISIBLE, newVisible);
            });

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            return content;
        }

        class PointsManager {
            static valueDisplay = null;

            static addRow() {
                const container = document.getElementById('my-extension-content');
                const row = document.createElement('div');
                row.className = 'stat-row';

                const label = document.createElement('span');
                label.className = 'stat-label';
                label.textContent = 'Points: ';

                this.valueDisplay = document.createElement('span');
                this.valueDisplay.className = 'stat-value points-display';
                this.valueDisplay.textContent = parseInt(localStorage.getItem(STORAGE.POINTS), 10) || 0;

                const input = document.createElement('input');
                input.type = 'number';
                input.step = '1';
                input.style.width = '60px';
                input.style.marginLeft = '10px';

                const button = document.createElement('button');
                button.textContent = 'Update';
                button.title = "Add the points from the input to your points."
                button.style.marginLeft = '5px';
                button.addEventListener('click', () => {
                    const delta = parseInt(input.value, 10);
                    this.changePoints(delta);
                    input.value = '';
                });

                row.appendChild(label);
                row.appendChild(this.valueDisplay);
                row.appendChild(input);
                row.appendChild(button);
                row.appendChild(StorageManager.addStorageButton());
                container.appendChild(row);
            }

            static changePoints(delta) {
                if (!isNaN(delta)) {
                    let currentPoints = parseInt(localStorage.getItem(STORAGE.POINTS), 10) || 0;
                    currentPoints += delta;
                    localStorage.setItem(STORAGE.POINTS, currentPoints);
                    this.valueDisplay.textContent = currentPoints;
                }
            }
        }

        function addChastityRow() {
            const row = document.createElement('div');
            row.className = 'stat-row';

            const container = document.getElementById('my-extension-content');

            const groups = [
                {label: 'Chastity', key: STORAGE.CHASTITY_VALUE, defaultValue: 0},
                {label: 'max', key: STORAGE.CHASTITY_MAX, defaultValue: CONSTS.CHASTITY_MAX_DEFAULT},
                {label: 'extra', key: STORAGE.CHASTITY_EXTRA, defaultValue: 0},
            ];

            groups.forEach(({label, key, defaultValue}) => {
                const groupEl = document.createElement('div');
                groupEl.className = 'stat-group';

                const labelEl = document.createElement('span');
                labelEl.className = 'stat-label';
                labelEl.textContent = `${label}: `;

                const valueEl = document.createElement('span');
                valueEl.className = 'stat-value';
                let value = parseInt(localStorage.getItem(key), 10);
                if (isNaN(value)) value = defaultValue;
                valueEl.textContent = value;

                function update(newValue) {
                    value = newValue;
                    valueEl.textContent = value;
                    localStorage.setItem(key, value);
                }

                const controls = document.createElement('div');
                controls.className = 'stat-controls';

                const btnPlus = document.createElement('button');
                btnPlus.textContent = '+';
                btnPlus.title = "Add one day."
                btnPlus.addEventListener('click', () => update(value + 1));

                const btnMinus = document.createElement('button');
                btnMinus.textContent = '−';
                btnMinus.title = "Remove one day"
                btnMinus.addEventListener('click', () => update(value - 1));

                controls.appendChild(btnPlus);
                controls.appendChild(btnMinus);

                groupEl.appendChild(labelEl);
                groupEl.appendChild(valueEl);
                groupEl.appendChild(controls);

                row.appendChild(groupEl);
            });

            container.appendChild(row);
        }

        class SoundManager {
            static audioContext = new (window.AudioContext || window.webkitAudioContext)();
            static playSound(frequency = 440, duration = 0.1, volume = 0.5, waveform = 'sine') {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }

                const oscillator = this.audioContext.createOscillator();
                oscillator.type = waveform;
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

                const gainNode = this.audioContext.createGain();
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);

                oscillator.onended = () => {
                    console.log("Sound finished playing.");
                };
            }
        }

        class EdgeManager {
            static edgeCount = null;
            static edgeCountThisPage = 0;
            static edgeCountDisplay = null;

            static unauthorizedCount = null;
            static unauthorizedCountThisPage = 0;
            static unauthorizedCountDisplay = null;

            static countdownTimer = null;
            static countdownDisplay = null;

            static edgesToDoCounter = null;



            static addRow() {
                const container = document.getElementById('my-extension-content');
                const row = document.createElement('div');
                row.className = 'stat-row';

                const entries = [
                    { label: 'Edges', key: STORAGE.EDGES },
                    { label: 'unauthorized', key: STORAGE.UNAUTHORIZED }
                ];

                entries.forEach(({ label, key }) => {
                    let val = parseInt(localStorage.getItem(key), 10) || 0;

                    const group = document.createElement('div');
                    group.className = 'stat-group';

                    const labelEl = document.createElement('span');
                    labelEl.className = 'stat-label';
                    labelEl.textContent = `${label}: `;

                    const valueEl = document.createElement('span');
                    valueEl.className = 'stat-value';
                    valueEl.textContent = `${val} (0)`;
                    valueEl.title = "In parenthesis the amount from last page load/reload";

                    const btn = document.createElement('button');
                    btn.textContent = '+';

                    const controls = document.createElement('div');
                    controls.className = 'stat-controls';
                    controls.appendChild(btn);
                    if (label === "Edges") {
                        this.edgeCount = val;
                        this.edgeCountDisplay = valueEl;

                        this.edgesToDoCounter = document.createElement('input');
                        this.edgesToDoCounter.type = 'number';
                        this.edgesToDoCounter.style.width = '50px';
                        this.edgesToDoCounter.value = parseInt(localStorage.getItem(STORAGE.EDGES_TO_DO)) || 0;
                        this.edgesToDoCounter.title = "If you have multiple edges to do, input them here, and they will be counted down";

                        this.edgesToDoCounter.addEventListener('change', (e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            localStorage.setItem(STORAGE.EDGES_TO_DO, newValue);
                        });

                        btn.addEventListener('click', () => {
                            this.addEdge();
                        });
                        btn.title = "Add an edge and 10 points. (Alt + E)";

                        const btn2 = document.createElement('button');
                        btn2.textContent = '(+)';
                        btn2.title = "Add an edge but no points. (Alt + W)";
                        btn2.addEventListener('click', () => {
                            this.addEdgeWithoutPoints();
                        });
                        controls.appendChild(btn2);

                        group.appendChild(labelEl);
                        group.appendChild(valueEl);
                        group.appendChild(controls);
                        group.appendChild(this.edgesToDoCounter);
                    } else {
                        this.unauthorizedCount = val;
                        this.unauthorizedCountDisplay = valueEl;

                        btn.title = "Add an unauthorized edge and remove 20 points. (Alt + T)";
                        btn.addEventListener('click', () => {
                            this.addUnauthorizedEdge();
                        });

                        group.appendChild(labelEl);
                        group.appendChild(valueEl);
                        group.appendChild(controls);
                    }

                    row.appendChild(group);
                });

                const countdown = document.createElement('span');
                countdown.className = 'stat-countdown';
                countdown.style.display = 'none';
                row.appendChild(countdown);
                this.countdownDisplay = countdown;

                container.appendChild(row);

                const pauseRow = document.createElement('div');
                pauseRow.className = 'stat-row font-small';
                pauseRow.style.marginTop = '10px';

                const pauseEdgeLabel = document.createElement('label');
                pauseEdgeLabel.textContent = 'Pause E (seconds):';

                this.pauseAfterEdge = CONSTS.PAUSE_AFTER_EDGE;
                const pauseEdgeInput = document.createElement('input');
                pauseEdgeInput.type = 'number';
                pauseEdgeInput.value = this.pauseAfterEdge;
                pauseEdgeInput.style.width = '35px';
                pauseEdgeInput.className = "font-small";
                pauseEdgeInput.addEventListener('change', (e) => {
                    this.pauseAfterEdge = parseInt(e.target.value) || CONSTS.PAUSE_AFTER_EDGE;
                });

                const pauseUnauthorizedLabel = document.createElement('label');
                pauseUnauthorizedLabel.textContent = 'Pause U (seconds):';
                pauseUnauthorizedLabel.style.marginLeft = '15px';


                this.pauseAfterUnauthorizedEdge = CONSTS.PAUSE_AFTER_UNAUTHORIZED_EDGE;
                const pauseUnauthorizedInput = document.createElement('input');
                pauseUnauthorizedInput.type = 'number';
                pauseUnauthorizedInput.value = this.pauseAfterUnauthorizedEdge;
                pauseUnauthorizedInput.style.width = '35px';
                pauseUnauthorizedInput.className = "font-small";
                pauseUnauthorizedInput.addEventListener('change', (e) => {
                    this.pauseAfterUnauthorizedEdge = parseInt(e.target.value) || CONSTS.PAUSE_AFTER_UNAUTHORIZED_EDGE;
                });

                pauseRow.appendChild(pauseEdgeLabel);
                pauseRow.appendChild(pauseEdgeInput);
                pauseRow.appendChild(pauseUnauthorizedLabel);
                pauseRow.appendChild(pauseUnauthorizedInput);

                container.appendChild(pauseRow);
            }

            static addEdge(add_points=true) {
                this.edgeCount++;
                this.edgeCountThisPage++;
                this.edgeCountDisplay.textContent = `${this.edgeCount} (${this.edgeCountThisPage})`;
                localStorage.setItem(STORAGE.EDGES, this.edgeCount);

                const newEdgesToDo = Math.max(parseInt(this.edgesToDoCounter.value) - 1 || 0, 0);
                this.edgesToDoCounter.value = newEdgesToDo;
                localStorage.setItem(STORAGE.EDGES_TO_DO, newEdgesToDo);
                if (add_points) {
                    PointsManager.changePoints(10);
                }
                this.startCountdown(this.pauseAfterEdge);
            }

            static addEdgeWithoutPoints() {
                this.addEdge(false);
            }

            static addUnauthorizedEdge() {
                this.unauthorizedCount++;
                this.unauthorizedCountThisPage++;
                this.unauthorizedCountDisplay.textContent = `${this.unauthorizedCount} (${this.unauthorizedCountThisPage})`;
                localStorage.setItem(STORAGE.UNAUTHORIZED, this.unauthorizedCount);

                PointsManager.changePoints(-20);
                this.startCountdown(this.pauseAfterUnauthorizedEdge);
            }

            static startCountdown(duration) {
                if (this.countdownTimer) {
                    clearInterval(this.countdownTimer);
                }

                this.countdownDisplay.style.display = 'inline-block';
                this.countdownDisplay.classList = 'font-small';

                let remainingTime = duration;
                this.countdownDisplay.textContent = `Pause: ${remainingTime}s`;

                this.countdownTimer = setInterval(() => {
                    remainingTime--;

                    if (remainingTime <= 0) {
                        clearInterval(this.countdownTimer);
                        this.playClickSound();
                        this.countdownDisplay.style.display = 'none';
                    } else {
                        this.countdownDisplay.textContent = `Pausing: ${remainingTime}s`;
                    }
                }, 1000);
            }

            static playClickSound(frequency = 660, duration = 0.1, volume = 0.5, waveform = 'triangle') {
                const blockSoundAfterEdge = localStorage.getItem(STORAGE.BLOCK_SOUND_AFTER_EDGE);
                if (blockSoundAfterEdge && blockSoundAfterEdge !== "false") {
                    return;
                }
                SoundManager.playSound(frequency, duration, volume, waveform);
            }
        }

        class MetronomeManager {
            static isRunning = false;

            static beatCount = 0;
            static bpmIntervalId = null;
            static bpmInput = null;
            static volumeSlider = null;
            static beatCounterDisplay = null;
            static timerDisplay = null;
            static startButton = null;
            static stopButton = null;
            static edgeButton = null;
            static noPointsButton = null;
            static unauthorizedButton = null;
            static audioContext = new (window.AudioContext || window.webkitAudioContext)();
            static timerIntervalId = null;
            static totalTimeElapsed = 0;
            static volumeGainNode = null;
            static isPaused = false;
            static bpmUpdatePending = false;
            static durationInput = null;
            static maxStrokesInput = null;
            static pauseTimeoutId = null;

            static addBpmButton() {
                const bpmButton = document.createElement("button");
                bpmButton.textContent = "Metronome";
                bpmButton.className = "modifier-add-btn";
                bpmButton.title = "Open Metronome Menu";
                bpmButton.addEventListener("click", () => this.showBpmDialog());
                return bpmButton;
            }

            static showBpmDialog() {
                const existingDialog = document.getElementById("bpm-dialog");
                if (existingDialog) {
                    this.stopMetronome();
                    existingDialog.remove();
                    return;
                }

                const dialog = document.createElement("div");
                dialog.id = "bpm-dialog";
                dialog.className = "modifier-dialog";

                const closeButton = document.createElement("button");
                closeButton.textContent = "×";
                closeButton.className = "modifier-close-btn";
                closeButton.addEventListener("click", () => {
                    this.stopMetronome();
                    dialog.remove();
                });

                const inputRow = document.createElement("div");
                inputRow.className = "modifier-input-row";

                const bpmLabel = document.createElement("p");
                bpmLabel.textContent = "Set BPM:";

                this.bpmInput = document.createElement("input");
                this.bpmInput.type = "number";
                this.bpmInput.className = "modifier-input";
                this.bpmInput.style.margin = 0;
                const metronome_bpm = localStorage.getItem(STORAGE.METRONOME_BPM);
                this.bpmInput.value = metronome_bpm ? parseFloat(metronome_bpm) : 120;

                const volumeLabel = document.createElement("p");
                volumeLabel.textContent = "Volume:";

                this.volumeSlider = document.createElement("input");
                this.volumeSlider.type = "range";
                this.volumeSlider.min = 0;
                this.volumeSlider.max = 1;
                this.volumeSlider.step = 0.01;
                const savedVolume = localStorage.getItem(STORAGE.METRONOME_VOLUME);
                this.volumeSlider.value = savedVolume ? parseFloat(savedVolume) : 0.5;
                this.volumeSlider.className = "modifier-slider";
                this.volumeSlider.addEventListener("input", () => {
                    this.updateVolume(this.volumeSlider.value);
                    localStorage.setItem(STORAGE.METRONOME_VOLUME, this.volumeSlider.value);
                });

                // New Duration input
                const durationLabel = document.createElement("p");
                durationLabel.textContent = "Duration (seconds):";

                this.durationInput = document.createElement("input");
                this.durationInput.type = "number";
                this.durationInput.min = 0;
                this.durationInput.className = "modifier-input";
                this.durationInput.style.margin = 0;


                const maxStrokesLabel = document.createElement("p");
                maxStrokesLabel.textContent = "Max Strokes:";

                this.maxStrokesInput = document.createElement("input");
                this.maxStrokesInput.type = "number";
                this.maxStrokesInput.min = 0;
                this.maxStrokesInput.className = "modifier-input";
                this.maxStrokesInput.style.margin = 0;

                this.startButton = document.createElement("button");
                this.startButton.textContent = "Start";
                this.startButton.className = "modifier-btn modifier-submit-btn";
                this.startButton.addEventListener("click", () => {
                    this.beatCounterDisplay.textContent = `Strokes: ${this.beatCount}`;
                    this.startMetronome();
                });

                this.stopButton = document.createElement("button");
                this.stopButton.textContent = "Stop";
                this.stopButton.className = "modifier-btn modifier-submit-btn";
                this.stopButton.addEventListener("click", () => this.stopMetronome());

                this.edgeButton = document.createElement("button");
                this.edgeButton.textContent = "Edge";
                this.edgeButton.title = "Add an edge (+ 10 Points) and pause the metronome (Alt+E)";
                this.edgeButton.className = "modifier-btn modifier-submit-btn";
                this.edgeButton.addEventListener("click", () => this.addEdge());

                this.noPointsButton = document.createElement("button");
                this.noPointsButton.textContent = "Edge (No Points)";
                this.noPointsButton.title = "Add an edge and pause the metronome (Alt+W)";
                this.noPointsButton.className = "modifier-btn modifier-submit-btn";
                this.noPointsButton.addEventListener("click", () => this.addEdgeWithoutPoints());

                this.unauthorizedButton = document.createElement("button");
                this.unauthorizedButton.textContent = "Unauthorized";
                this.unauthorizedButton.title = "Add an unauthorized edge (- 20 Points) and pause the metronome (Alt+T)";
                this.unauthorizedButton.className = "modifier-btn modifier-submit-btn";
                this.unauthorizedButton.addEventListener("click", () => this.addUnauthorizedEdge());

                this.beatCounterDisplay = document.createElement("p");
                this.beatCounterDisplay.textContent = `Strokes: ${this.beatCount}`;
                this.beatCounterDisplay.style.minWidth = "5rem";

                this.timerDisplay = document.createElement("p");
                this.timerDisplay.textContent = "Time Elapsed: 00:00:00";
                this.timerDisplay.style.minWidth = "9rem";

                inputRow.append(
                    bpmLabel,
                    this.bpmInput,
                    this.startButton,
                    this.stopButton,
                    this.beatCounterDisplay,
                    this.timerDisplay,
                    this.edgeButton,
                    this.noPointsButton,
                    this.unauthorizedButton,
                    volumeLabel,
                    this.volumeSlider,
                    durationLabel,
                    this.durationInput,
                    maxStrokesLabel,
                    this.maxStrokesInput,
                );

                dialog.append(closeButton, inputRow);
                document.body.appendChild(dialog);
                this.setButtonsActive(false);

                this.volumeGainNode = this.audioContext.createGain();
                this.volumeGainNode.gain.value = this.volumeSlider.value;
                this.volumeGainNode.connect(this.audioContext.destination);
            }

            static startMetronome() {
                const maxStrokes = parseFloat(this.maxStrokesInput.value);
                const durationLimit = parseFloat(this.durationInput.value);

                if (maxStrokes && this.beatCount >= maxStrokes) {
                    alert("Max stroke count already reached!");
                    return;
                } else if (durationLimit && this.totalTimeElapsed >= durationLimit) {
                    alert("Duration already reached!");
                    return;
                }

                this.setBpmAndUpdate(parseFloat(this.bpmInput.value));

                if (this.isRunning) {
                    return;
                }

                this.isRunning = true;
                this.bpmUpdatePending = false;
                this.startBeatInterval();
                this.startTimer();
                ThreeMinuteReminder.disableTimer();
                this.setButtonsActive(true);
            }

            static startBeatInterval() {
                const interval = (60 / parseFloat(this.bpmInput.value)) * 1000;

                this.bpmIntervalId = setInterval(() => {
                    if (this.isPaused) return;

                    const maxStrokes = parseFloat(this.maxStrokesInput.value); // Dynamically fetch value
                    const durationLimit = parseFloat(this.durationInput.value); // Dynamically fetch value

                    this.updateBeat();

                    if (maxStrokes && this.beatCount >= maxStrokes) {
                        this.stopMetronome();
                    } else if (durationLimit && this.totalTimeElapsed >= durationLimit) {
                        this.stopMetronome();
                    }

                    if (this.bpmUpdatePending) {
                        clearInterval(this.bpmIntervalId);
                        this.bpmIntervalId = null;
                        this.bpmUpdatePending = false;
                        this.startBeatInterval(); // Re-initiate with new BPM or settings
                    }
                }, interval);
            }

            static updateBeat() {
                this.beatCount++;
                this.beatCounterDisplay.textContent = `Strokes: ${this.beatCount}`;
                this.playClickSound();
            }

            static stopMetronome() {
                ThreeMinuteReminder.restartTimer();
                this.setButtonsActive(false);

                if (this.bpmIntervalId) {
                    clearInterval(this.bpmIntervalId);
                    this.bpmIntervalId = null;
                }
                this.stopTimer();
                MetronomeManager.isRunning = false;
            }

            static pauseMetronome(duration) {
                if (this.isPaused) {
                    clearTimeout(this.pauseTimeoutId); // Clear the existing pause timeout if paused
                }

                ThreeMinuteReminder.disableTimer();
                this.setButtonsActive(false, false);
                this.isPaused = true;

                if (this.bpmIntervalId) {
                    clearInterval(this.bpmIntervalId);
                    this.bpmIntervalId = null;
                }

                this.pauseTimeoutId = setTimeout(() => {
                    if (!document.getElementById("bpm-dialog")) {
                        this.isPaused = false;
                        return;
                    }

                    this.isPaused = false;
                    this.startBeatInterval();
                    this.setButtonsActive(true);
                }, duration * 1000);
            }

            static changeBpmAndUpdate(bpmChange) {
                const currentBpm = parseFloat(this.bpmInput.value);
                const newBpm = currentBpm + bpmChange;
                this.setBpmAndUpdate(newBpm);
            }

            static setBpmAndUpdate(newBpm) {
                this.bpmInput.value = newBpm;
                localStorage.setItem(STORAGE.METRONOME_BPM, newBpm);

                if (this.bpmIntervalId && !this.isPaused) {
                    this.bpmUpdatePending = true;
                }
            }

            static startTimer() {
                if (this.timerIntervalId) return;

                this.timerIntervalId = setInterval(() => {
                    this.totalTimeElapsed++;
                    const hours = String(Math.floor(this.totalTimeElapsed / 3600)).padStart(2, "0");
                    const minutes = String(Math.floor((this.totalTimeElapsed % 3600) / 60)).padStart(2, "0");
                    const seconds = String(this.totalTimeElapsed % 60).padStart(2, "0");

                    this.timerDisplay.textContent = `Time Elapsed: ${hours}:${minutes}:${seconds}`;
                }, 1000);
            }

            static stopTimer() {
                if (this.timerIntervalId) {
                    clearInterval(this.timerIntervalId);
                    this.timerIntervalId = null;
                }
            }

            static updateVolume(value) {
                if (this.volumeGainNode) {
                    this.volumeGainNode.gain.value = value;
                }
            }

            static playClickSound() {
                const volume = parseFloat(this.volumeSlider.value);
                SoundManager.playSound(440, 0.1, volume, 'sine');
            }

            static setButtonsActive(allButtons, startButton = true) {
                this.startButton.disabled = !startButton;
                this.startButton.textContent = (allButtons || (!allButtons && !startButton)) ? "Update" : "Start";
                this.stopButton.disabled = !allButtons;
                this.edgeButton.disabled = !allButtons;
                this.noPointsButton.disabled = !allButtons;
                this.unauthorizedButton.disabled = !allButtons;
            }

            static addEdge() {
                EdgeManager.addEdge();
                this.pauseMetronome(EdgeManager.pauseAfterEdge);
            }

            static addEdgeWithoutPoints() {
                EdgeManager.addEdgeWithoutPoints();
                this.pauseMetronome(EdgeManager.pauseAfterEdge);
            }

            static addUnauthorizedEdge() {
                EdgeManager.addUnauthorizedEdge();
                this.pauseMetronome(EdgeManager.pauseAfterUnauthorizedEdge);
            }

            static isMetronomeActive() {
                return this.bpmIntervalId !== null || this.timerIntervalId !== null;
            }
        }

        class RandomNumberManager {
            static addRNGButton() {
                const rngButton = document.createElement("button");
                rngButton.textContent = "RNG";
                rngButton.className = "modifier-add-btn";
                rngButton.title = "Open Random Number Generator"
                rngButton.addEventListener("click", () => this.showRandomDialog());
                return rngButton;
            }

            static showRandomDialog() {
                const existingDialog = document.getElementById("random-dialog");
                if (existingDialog) {
                    existingDialog.remove();
                    return;
                }

                const dialog = document.createElement("div");
                dialog.id = "random-dialog";
                dialog.className = "rng-dialog modifier-dialog";

                const closeButton = document.createElement("button");
                closeButton.textContent = "×";
                closeButton.className = "modifier-close-btn";
                closeButton.title = "Close";
                closeButton.addEventListener("click", () => dialog.remove());

                const inputRow = document.createElement("div");
                inputRow.className = "modifier-input-row";

                const minLabel = document.createElement("p");
                minLabel.textContent = "Min:";

                this.minInput = document.createElement("input");
                this.minInput.type = "number";
                this.minInput.className = "modifier-input";

                const maxLabel = document.createElement("p");
                maxLabel.textContent = "Max:";

                this.maxInput = document.createElement("input");
                this.maxInput.type = "number";
                this.maxInput.className = "modifier-input";

                const teaseContent = document.getElementById('tease_content');
                const rangeMatch = teaseContent ? teaseContent.textContent.match(/(\d+)\s*-\s*(\d+)/) : null;

                this.minInput.value = rangeMatch ? rangeMatch[1] : 1;
                this.maxInput.value = rangeMatch ? rangeMatch[2] : 5;

                this.generateButton = document.createElement("button");
                this.generateButton.textContent = "Generate";
                this.generateButton.title = "Creates random number (including the minimum and maximum)";
                this.generateButton.className = "modifier-btn modifier-submit-btn";

                this.resultDisplay = document.createElement("p");
                this.resultDisplay.textContent = "Random Number: ";
                this.resultDisplay.className = "modifier-result-display";

                this.generateButton.addEventListener("click", () => {
                    const min = parseFloat(this.minInput.value);
                    const max = parseFloat(this.maxInput.value);

                    if (isNaN(min) || isNaN(max) || min > max) {
                        alert("Please enter valid min and max values where min ≤ max.");
                        return;
                    }

                    this.resultDisplay.textContent = "Random Number: ...";
                    const delay = 250;

                    setTimeout(() => {
                        const randomNumber = this.generateRandomNumber(min, max);
                        this.resultDisplay.textContent = `Random Number: ${randomNumber}`;
                        console.log(`Rolled random number: ${randomNumber}`);
                    }, delay);
                });

                inputRow.appendChild(minLabel);
                inputRow.appendChild(this.minInput);
                inputRow.appendChild(maxLabel);
                inputRow.appendChild(this.maxInput);
                inputRow.appendChild(this.generateButton);
                inputRow.appendChild(this.resultDisplay);

                dialog.appendChild(closeButton);
                dialog.appendChild(inputRow);

                document.body.appendChild(dialog);
            }

            static generateRandomNumber(min, max) {
                // Generates a whole number between min and max (inclusive)
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }

        function addPagesPauseRow() {
            const container = document.getElementById('my-extension-content');
            const row = document.createElement('div');
            row.className = 'stat-row';
            row.id = 'pages-pause-row';

            // Pages label
            const pagesLabel = document.createElement('span');
            pagesLabel.className = 'stat-label';
            pagesLabel.textContent = 'Pages: ';

            // Pages value
            const pagesValue = document.createElement('span');
            pagesValue.className = 'stat-value pages-count';
            // Will be initialized later

            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.title = `Decrease the pages count by once (If a page was counted by accident).`;
            minusButton.addEventListener('click', () => {
                let totalPages = parseInt(localStorage.getItem(STORAGE.TOTAL_PAGES), 10);
                let pagesSincePause = parseInt(localStorage.getItem(STORAGE.PAGES_SINCE_PAUSE), 10);
                totalPages = Math.max(1, totalPages - 1);
                pagesSincePause = Math.max(1, pagesSincePause - 1);

                localStorage.setItem(STORAGE.TOTAL_PAGES, totalPages);
                localStorage.setItem(STORAGE.PAGES_SINCE_PAUSE, pagesSincePause);

                updatePagesPauseRow(totalPages, pagesSincePause)
            });

            // Pause button
            const pauseBtn = document.createElement('button');
            pauseBtn.textContent = 'Pause';
            pauseBtn.title = `Start your pause for up to ${CONSTS.PAUSE_DURATION_HOURS} hours (after you completed the page)`;
            pauseBtn.style.marginLeft = '5px';
            pauseBtn.disabled = true;
            pauseBtn.classList.add('pause-btn');
            pauseBtn.addEventListener('click', () => PauseManager.startPause());

            row.appendChild(pagesLabel);
            row.appendChild(pagesValue);
            row.appendChild(minusButton);
            row.appendChild(pauseBtn);
            row.appendChild(MetronomeManager.addBpmButton());
            row.appendChild(RandomNumberManager.addRNGButton());
            container.appendChild(row);
        }

        function updatePagesPauseRow(totalPages, pagesSincePause) {
            const pagesValue = document.querySelector('.pages-count');
            if (pagesValue) {
                pagesValue.textContent = `${totalPages}, ${pagesSincePause}/${CONSTS.PAGES_UNTIL_PAUSE}`;
            }
        }

        function addRevisitedGoddessRow() {
            const container = document.getElementById('my-extension-content');
            const row = document.createElement('div');
            row.className = 'stat-row';

            function addRevisitedPagesPart() {
                let revisitedPages = JSON.parse(localStorage.getItem(STORAGE.REVISITED_SITES)) || {};
                const teaseId = getCurrentTeaseId();
                const currentPageNumber = getCurrentPageNumber();

                if (!revisitedPages[teaseId]) {
                    revisitedPages[teaseId] = {};
                }
                if (!isPageReload()) {
                    if (currentPageNumber in revisitedPages[teaseId]) {
                        revisitedPages[teaseId][currentPageNumber] += 1;
                    } else {
                        revisitedPages[teaseId][currentPageNumber] = 1;
                    }
                }

                localStorage.setItem(STORAGE.REVISITED_SITES, JSON.stringify(revisitedPages));

                const revisitedGroup = document.createElement('div');
                revisitedGroup.className = 'stat-group';

                const revisitedLabel = document.createElement('span');
                revisitedLabel.className = 'stat-label';
                revisitedLabel.textContent = `Visited this Page:`;

                const revisitedValue = document.createElement('span');
                revisitedValue.className = 'stat-value';
                revisitedValue.textContent = `${revisitedPages[teaseId][currentPageNumber]} time(s)`;

                revisitedGroup.appendChild(revisitedLabel);
                revisitedGroup.appendChild(revisitedValue);
                row.appendChild(revisitedGroup);
            }

            function addGoddessessPart() {
                let goddessPages = JSON.parse(localStorage.getItem(STORAGE.GODDESS_VISITED)) || {};
                if (Array.isArray(goddessPages)) {
                    goddessPages = { "downwards_compatible": goddessPages };
                }
                const teaseId = getCurrentTeaseId();
                const currentPageNumber = getCurrentPageNumber();

                if (!goddessPages[teaseId]) {
                    goddessPages[teaseId] = {};
                }

                const teaseContentDiv = document.getElementById('tease_content');
                const rawHTML = teaseContentDiv ? teaseContentDiv.innerHTML : '';

                // Step 1: Try to find the Goddess name(s) in first 300 characters, stopping at newline or <br>
                const rawStart = rawHTML.substring(0, 300);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = rawStart.replace(/<br\s*\/?>/gi, '\n');
                const textLike = tempDiv.innerText || tempDiv.textContent || '';

                const goddessNames = [];
                const lines = textLike.split(/\n|\r/);
                for (const line of lines) {
                    if (/god+ess(es)?/i.test(line)) { // there is at least one error where it is written godess
                        goddessNames.push(line.trim());
                    }
                }

                // Create UI elements
                const goddessGroup = document.createElement('div');
                goddessGroup.className = 'stat-group';

                const goddessLabel = document.createElement('span');
                goddessLabel.className = 'stat-label';
                goddessLabel.textContent = 'Goddess:';

                const totalGoddessCount = Object.values(goddessPages).reduce(
                    (sum, teaseData) => sum + Object.keys(teaseData).length,
                    0
                );

                const goddessCounter = document.createElement('span');
                goddessCounter.className = 'stat-value';
                goddessCounter.textContent = totalGoddessCount;

                const goddessPlusBtn = document.createElement('button');
                goddessPlusBtn.textContent = '+';
                goddessPlusBtn.title = "Register that you visited the current Goddess. Only counts each Goddess once.";

                const isDisabled = goddessNames.length === 0 || goddessPages[teaseId][currentPageNumber];
                goddessPlusBtn.disabled = isDisabled;

                const buttons = [goddessPlusBtn];

                goddessPlusBtn.addEventListener('click', registerGoddess);

                // Step 2: Find and bold the name(s) + add Register Visit button(s)
                if (goddessNames.length > 0) {
                    const walker = document.createTreeWalker(teaseContentDiv, NodeFilter.SHOW_TEXT, null, false);
                    const lowerNames = goddessNames.map(name => name.toLowerCase());

                    while (walker.nextNode()) {
                        const node = walker.currentNode;
                        const matchName = lowerNames.find(name => node.nodeValue.toLowerCase().includes(name));
                        if (matchName) {
                            const parent = node.parentNode;
                            const idx = node.nodeValue.toLowerCase().indexOf(matchName);

                            const before = document.createTextNode(node.nodeValue.substring(0, idx));
                            const bold = document.createElement('strong');
                            bold.textContent = node.nodeValue.substring(idx, idx + matchName.length);
                            const after = document.createTextNode(node.nodeValue.substring(idx + matchName.length));

                            const registerBtn = document.createElement('button');
                            registerBtn.className = 'stat-button';
                            registerBtn.textContent = 'Register Visit';
                            registerBtn.title = "Register your visit to this Goddess.";
                            registerBtn.disabled = isDisabled;
                            registerBtn.addEventListener('click', registerGoddess);

                            buttons.push(registerBtn);

                            const fragment = document.createDocumentFragment();
                            fragment.appendChild(before);
                            fragment.appendChild(bold);
                            fragment.appendChild(registerBtn);
                            fragment.appendChild(after);

                            parent.replaceChild(fragment, node);
                        }
                    }
                }

                function registerGoddess() {
                    if (!goddessPages[teaseId][currentPageNumber] && goddessNames.length > 0) {
                        goddessPages[teaseId][currentPageNumber] = goddessNames.join(', ');
                        localStorage.setItem(STORAGE.GODDESS_VISITED, JSON.stringify(goddessPages));

                        const updatedTotalGoddessCount = Object.values(goddessPages).reduce(
                            (sum, teaseData) => sum + Object.keys(teaseData).length,
                            0
                        );
                        goddessCounter.textContent = updatedTotalGoddessCount;
                        disableAllButtons();
                    }
                }

                function disableAllButtons() {
                    buttons.forEach((btn) => btn.disabled = true);
                }

                // Add elements to DOM
                goddessGroup.appendChild(goddessLabel);
                goddessGroup.appendChild(goddessCounter);
                goddessGroup.appendChild(goddessPlusBtn);
                row.appendChild(goddessGroup);
            }

            addRevisitedPagesPart();
            addGoddessessPart();
            container.appendChild(row);
        }

        function countPageView() {
            const isPaused = localStorage.getItem(STORAGE.PAUSE_ACTIVE) === 'true';
            if (isPaused) {
                return; // Skip counting if pause is active
            }


            let totalPages = parseInt(localStorage.getItem(STORAGE.TOTAL_PAGES), 10);
            let pagesSincePause = parseInt(localStorage.getItem(STORAGE.PAGES_SINCE_PAUSE), 10);

            if (isNaN(totalPages)) totalPages = 0;
            if (isNaN(pagesSincePause)) pagesSincePause = 0;

            if (!isPageReload()) {
                totalPages++;
                pagesSincePause++;
            }

            localStorage.setItem(STORAGE.TOTAL_PAGES, totalPages);
            localStorage.setItem(STORAGE.PAGES_SINCE_PAUSE, pagesSincePause);

            updatePagesPauseRow(totalPages, pagesSincePause);

            const pauseBtn = document.querySelector('#pages-pause-row .pause-btn');
            if (pauseBtn) pauseBtn.disabled = pagesSincePause < CONSTS.PAGES_UNTIL_PAUSE;
        }

        class StorageManager {
            static addStorageButton() {
                const storageButton = document.createElement("button");
                storageButton.textContent = "Edit Variables";
                storageButton.className = "modifier-add-btn";
                storageButton.title = "Open Variable Editor";
                storageButton.addEventListener("click", () => this.showStorageDialog());
                return storageButton;
            }

            static showStorageDialog() {
                const existingDialog = document.getElementById("storage-dialog");

                // Remove existing dialog if already open
                if (existingDialog) {
                    existingDialog.remove();
                    return;
                }

                // Create storage modal dialog
                const dialog = document.createElement("div");
                dialog.id = "storage-dialog";
                dialog.className = "modifier-dialog";

                const closeButton = document.createElement("button");
                closeButton.textContent = "×";
                closeButton.className = "modifier-close-btn";
                closeButton.title = "Close";
                closeButton.addEventListener("click", () => dialog.remove());

                // Add a title for the dialog
                const title = document.createElement("h3");
                title.textContent = "Edit Variables";
                title.style.marginBottom = "10px";

                // Add a warning text
                const warning = document.createElement("p");
                warning.textContent =
                    "⚠ Warning: Editing variables manually can break the plugin if incorrect values are input. Proceed with caution!";
                warning.style.color = "#f44336";
                warning.style.fontWeight = "bold";
                warning.style.marginBottom = "15px";

                dialog.appendChild(closeButton);
                dialog.appendChild(title);
                dialog.appendChild(warning);

                // Dynamically build the list of storage variables
                const storageList = document.createElement("div");
                storageList.className = "modifiers-list-container";

                Object.keys(STORAGE).forEach((key) => {
                    const storageKey = STORAGE[key];
                    const currentValue = localStorage.getItem(storageKey) || "";

                    // Create a row for each storage variable
                    const row = document.createElement("div");
                    row.className = "modifier-row";

                    // Label for the storage variable
                    const label = document.createElement("span");
                    label.className = "modifier-description";
                    label.textContent = key.replace("_", " ");

                    let input;
                    const textAreaKeys = [STORAGE.MODIFIERS, STORAGE.BETWEEN_SESSION_DATA, STORAGE.SESSION_HISTORY]

                    if (textAreaKeys.includes(storageKey)) {
                        input = document.createElement("textarea");
                        input.className = "modifier-input";
                        input.rows = "5";
                        input.value = currentValue;
                    } else {
                        input = document.createElement("input");
                        input.className = "modifier-input";
                        input.type = "text";
                        input.value = currentValue;
                    }

                    // Button to save the value
                    const saveButton = document.createElement("button");
                    saveButton.className = "modifier-btn";
                    saveButton.textContent = "Save";
                    saveButton.title = "Save changes for this variable";

                    saveButton.addEventListener("click", () => {
                        localStorage.setItem(storageKey, input.value);
                    });

                    row.appendChild(label);
                    row.appendChild(input);
                    row.appendChild(saveButton);

                    storageList.appendChild(row);
                });

                dialog.appendChild(storageList);

                document.body.appendChild(dialog);
            }
        }

        class NotesManager {
            static addNotesButton() {
                const notesButton = document.createElement("button");
                notesButton.textContent = "Notes";
                notesButton.className = "modifier-add-btn";
                notesButton.title = "Open Notes Editor";
                notesButton.addEventListener("click", () => this.showNotesDialog());
                return notesButton;
            }

            static showNotesDialog() {
                const existingDialog = document.getElementById("notes-dialog");

                if (existingDialog) {
                    existingDialog.remove();
                    return;
                }

                const dialog = document.createElement("div");
                dialog.id = "notes-dialog";
                dialog.className = "modifier-dialog";

                const closeButton = document.createElement("button");
                closeButton.textContent = "×";
                closeButton.className = "modifier-close-btn";
                closeButton.title = "Close";
                closeButton.addEventListener("click", () => dialog.remove());

                const title = document.createElement("h3");
                title.textContent = "Add/Edit Notes";
                title.style.marginBottom = "10px";

                const textArea = document.createElement("textarea");
                textArea.id = "notes-textarea";
                textArea.className = "modifier-input";
                textArea.style.height = "150px";
                textArea.style.resize = "vertical";
                textArea.value = localStorage.getItem(STORAGE.NOTES) || "";

                const saveButton = document.createElement("button");
                saveButton.textContent = "Save Notes";
                saveButton.className = "modifier-btn modifier-submit-btn";
                saveButton.style.marginTop = "10px";
                saveButton.addEventListener("click", () => {
                    const notes = textArea.value;
                    localStorage.setItem(STORAGE.NOTES, notes);
                });

                dialog.appendChild(closeButton);
                dialog.appendChild(title);
                dialog.appendChild(textArea);
                dialog.appendChild(saveButton);

                document.body.appendChild(dialog);
            }
        }

        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, "\\$&");
            const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
            const results = regex.exec(url);
            if (!results) return null;
            return decodeURIComponent(results[2] || '');
        }

        class ThreeMinuteReminder {
            static timeoutId = null;
            static overlay = null;
            static disabled = false;
            static userDisabled = false;
            static startDate = null;

            static init() {
                const isPaused = localStorage.getItem(STORAGE.PAUSE_ACTIVE) === 'true';
                if (isPaused) {
                    this.disabled = true;
                    return;
                }

                this.startDate = new Date();
                this.createOverlay();
                this.startTimeout();
                this.attachEventListeners();
            }

            static addDisableReminderButton() {
                const disableButton = document.createElement("button");
                disableButton.textContent = "Disable 3-Min Reminder";
                disableButton.className = "disable-reminder-btn";
                disableButton.title = "Disable 3min reminder";

                disableButton.addEventListener("click", () => {
                    this.disableTimer();
                    this.userDisabled = true;

                    disableButton.disabled = true;
                    disableButton.textContent = "Reminder Disabled";
                });

                return disableButton;
            }

            static createOverlay() {
                this.overlay = document.createElement('div');
                this.overlay.className = 'chastity-overlay';

                const message = document.createElement('div');
                message.className = 'reminder-message';
                message.innerText = 'You have not interacted for more than 3 minutes.';
                this.overlay.appendChild(message);

                const buttonDoingSomething = document.createElement('button');
                buttonDoingSomething.className = 'end-early-button';
                buttonDoingSomething.innerText = 'I was doing something for the tease';
                buttonDoingSomething.addEventListener('click', () => {
                    this.overlay.style.display = 'none';
                    this.startTimeout();
                });
                this.overlay.appendChild(buttonDoingSomething);

                const pauseButton = document.createElement('button');
                pauseButton.className = 'end-early-button'; // Reuse the same button style
                pauseButton.innerText = 'It was a mistake, and I need to start my pause now.';
                pauseButton.addEventListener('click', () => {
                    this.overlay.style.display = 'none';
                    PauseManager.startPause();
                    this.disableTimer();
                });

                const pagesSincePause = parseInt(localStorage.getItem(STORAGE.PAGES_SINCE_PAUSE), 10) || 0;
                pauseButton.disabled = pagesSincePause < CONSTS.PAGES_UNTIL_PAUSE;
                this.overlay.appendChild(pauseButton);

                const endSessionButton = document.createElement('button');
                endSessionButton.className = 'end-early-button';
                endSessionButton.innerText = 'End this session without permission.';
                endSessionButton.addEventListener('click', () =>
                    SessionEndManager.endSession(
                        "without_permission",
                        "denied",
                        this.startDate
                    )
                );
                this.overlay.appendChild(endSessionButton);

                document.body.appendChild(this.overlay);
                this.overlay.style.display = 'none';
            }

            static showOverlay() {
                this.overlay.style.display = 'flex'; // Display overlay
            }

            static startTimeout() {
                this.disabled = false;
                this._startTimeout();
            }

            static _startTimeout() {
                if (this.userDisabled) return;

                if (this.disabled === true) {
                    return;
                }
                this.clearTimer();
                this.timeoutId = setTimeout(() => this.showOverlay(), 180000); // 3 minutes
            }

            static disableTimer() {
                this.disabled = false;
                if (this.timeoutId !== null) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = null;
                }
            }

            static restartTimer() {
                this.disabled = false;
                if (this.timeoutId === null) {
                    this.startTimeout();
                }
            }

            static clearTimer() {
                if (this.timeoutId !== null) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = null;
                }
            }

            static attachEventListeners() {
                // Restart timeout on any body click
                document.body.addEventListener('click', this._startTimeout.bind(this), true);
            }
        }

        // --- Pause UI ---
        let pauseIntervalId = null;

        class PauseManager {
            static startPause(isResume = false) {
                if (!isResume) {
                    // If no resume, initialize pause settings
                    ThreeMinuteReminder.disableTimer();
                    localStorage.setItem(STORAGE.PAGES_SINCE_PAUSE, 0);
                    localStorage.setItem(STORAGE.PAUSE_ACTIVE, 'true');
                    const pauseEnd = Date.now() + CONSTS.PAUSE_DURATION_HOURS * 3600 * 1000;
                    localStorage.setItem(STORAGE.PAUSE_END_TIMESTAMP, pauseEnd);
                }

                // Hide the main panel UI
                const panelContent = document.getElementById('my-extension-content');
                if (panelContent) panelContent.style.display = 'none';

                // Show the pause overlay
                let countdownOverlay = document.getElementById('pause-countdown-overlay');
                if (!countdownOverlay) {
                    countdownOverlay = document.createElement('div');
                    countdownOverlay.id = 'pause-countdown-overlay';
                    countdownOverlay.innerHTML = `
                        <div id="pause-timer-text" style="margin-bottom:2rem;"></div>
                        <button style="font-size: 2rem; padding: 1rem 2rem; cursor: pointer;">
                          Stop Pause and Roll
                        </button>
                      `;

                    countdownOverlay.querySelector('button').addEventListener('click', () => {
                        PauseManager.stopPause(true);
                    });

                    document.body.appendChild(countdownOverlay);
                }
                countdownOverlay.style.display = 'flex';

                PauseManager.updatePauseTimer(); // Show the initial timer text
                if (!pauseIntervalId) {
                    pauseIntervalId = setInterval(PauseManager.updatePauseTimer, 1000); // Keep updating the countdown
                }
            }

            static updatePauseTimer() {
                const timerText = document.getElementById('pause-timer-text');
                if (!timerText) return;

                const pauseEnd = parseInt(localStorage.getItem(STORAGE.PAUSE_END_TIMESTAMP), 10);
                const now = Date.now();
                const diffMs = pauseEnd - now;

                if (diffMs <= 0) {
                    PauseManager.stopPause(false);
                    return;
                }

                const totalSeconds = Math.floor(diffMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                timerText.textContent = `Pause: ${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            static stopPause(redirectAfterStop) {
                clearInterval(pauseIntervalId);
                pauseIntervalId = null;

                // Hide the pause overlay
                const countdownOverlay = document.getElementById('pause-countdown-overlay');
                if (countdownOverlay) countdownOverlay.style.display = 'none';


                // Clear pause-related local storage keys
                localStorage.setItem(STORAGE.PAUSE_ACTIVE, 'false');
                localStorage.removeItem(STORAGE.PAUSE_END_TIMESTAMP);

                if (redirectAfterStop) {
                    window.location.href = getRandomURL();
                }
            }

            static checkAndResumePause() {
                const pauseEnd = parseInt(localStorage.getItem(STORAGE.PAUSE_END_TIMESTAMP), 10);
                const now = Date.now();

                if (!isNaN(pauseEnd) && pauseEnd > now) {
                    PauseManager.startPause(true); // Resume the pause
                } else {
                    PauseManager.stopPause(false); // Cleanup any leftover pause UI or data
                }
            }

            static handlePauseLogic() {
                const isPaused = localStorage.getItem(STORAGE.PAUSE_ACTIVE) === 'true';
                const pauseEnd = parseInt(localStorage.getItem(STORAGE.PAUSE_END_TIMESTAMP), 10) || 0;

                if (isPaused && Date.now() < pauseEnd) {
                    PauseManager.startPause(true); // Continue active pause
                    return true;
                }

                if (isPaused && Date.now() >= pauseEnd) {
                    PauseManager.stopPause(true); // Pause has expired
                    return true;
                }

                return false; // No active pause
            }
        }

        class ModifierManager {
            static only_after_session = false;
            static has_warning = false;

            static addRow() {
                const container = document.getElementById('my-extension-content'); // Panel container
                const row = document.createElement('div');
                row.className = 'stat-row';

                // Create and append elements to the row
                const label = this.createLabel();
                const modifierCountElement = this.createModifierCountElement();
                const plusButton = this.createPlusButton();
                const eyeButton = this.createEyeButton(container);

                row.appendChild(label);
                row.appendChild(modifierCountElement);
                row.appendChild(plusButton);
                row.appendChild(eyeButton);
                row.appendChild(NotesManager.addNotesButton());
                row.appendChild(ThreeMinuteReminder.addDisableReminderButton());
                container.appendChild(row);
                this.displayTriggerPreview();
            }

            static initModifierDetection() {
                const teaseContent = document.getElementById('tease_content');
                this.detectAndReplaceModifiersInContent(teaseContent);
            }

            static detectAndReplaceModifiersInContent(node) {
                if (!node) return;

                const regex = /\{Modifier}([\s\S]*?)\{\/?Modifier}/g;
                const content = node.innerHTML;

                const matches = [...content.matchAll(regex)];

                if (matches.length) {
                    let modifiedContent = content;

                    matches.forEach((match, index) => {
                        const originalText = match[0];
                        const modifierText = match[1];

                        const placeholderId = `modifier-btn-placeholder-${index}`;

                        const updatedText = `
                <span>
                    <strong>{Modifier}</strong>${modifierText}<strong>{/Modifier}</strong>
                    <span id="${placeholderId}"></span>
                </span>
            `.trim();

                        modifiedContent = modifiedContent.replace(originalText, updatedText);
                    });

                    node.innerHTML = modifiedContent;

                    matches.forEach((match, index) => {
                        const placeholder = document.getElementById(`modifier-btn-placeholder-${index}`);
                        if (placeholder) {
                            const addButton = this.createAddModifierButton(match[1].trim());
                            placeholder.replaceWith(addButton);
                        }
                    });
                }
            }

            static createAddModifierButton(modifierText) {
                const plainText = modifierText.replace(/<[^>]+>/g, ''); // Remove any HTML from the modifier text
                const addButton = document.createElement('button');
                addButton.className = 'modifier-add-btn';
                addButton.textContent = 'Add Modifier';
                addButton.addEventListener('click', () => {
                    this.showModifierDialog(plainText.trim()); // Use the cleaned plain text
                });
                return addButton;
            }

            static createLabel() {
                const label = document.createElement('span');
                label.className = 'stat-label';
                label.textContent = 'Modifiers: ';
                return label;
            }

            static createModifierCountElement() {
                const countElement = document.createElement('span');
                countElement.id = 'modifier-count';
                countElement.textContent = this.getModifiersCount(); // Initial count
                countElement.style.fontWeight = 'bold';
                countElement.style.marginRight = '10px'; // Add spacing
                return countElement;
            }

            static getModifiersCount() {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                return modifiers.length; // Return the count of modifiers
            }

            static updateModifierCount() {
                const countElement = document.getElementById('modifier-count');
                if (countElement) {
                    const count = this.getModifiersCount();
                    countElement.innerHTML = '';

                    const countText = document.createTextNode(count);
                    countElement.appendChild(countText);

                    if (this.has_warning) {
                        const warning = document.createElement('span');
                        warning.textContent = ' !';
                        warning.style.color = '#ff0000b0';
                        warning.style.fontWeight = 'bold';
                        warning.style.marginLeft = '5px';
                        countElement.appendChild(warning);
                    }
                }
            }

            static updateModifiersList(listContainer) {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                listContainer.innerHTML = '';

                const filteredModifiers = modifiers.filter(mod => this.only_after_session ? mod.appliesAfterSession : true);
                filteredModifiers.forEach((mod, idx) => {
                    const modRow = this.createModifierRow(mod, idx, listContainer);
                    listContainer.appendChild(modRow);
                });

                this.displayTriggerPreview();
            }

            static createModifierRow(modifier, index, listContainer) {
                const modifierRow = document.createElement('div');
                modifierRow.className = 'modifier-row'

                const description = document.createElement('span');
                const trigger = modifier.trigger ? `${modifier.trigger}: ` : ''


                description.innerHTML = `${trigger}${modifier.description.replace(/\n/g, '<br>')}
                    <br>(${modifier.pageNumber})`
                    + (modifier.appliesAfterSession ? ' (Applies After Session)' : ''); // Preserve line breaks using <br>

                description.className = 'modifier-description';

                const counter = document.createElement('span');
                counter.textContent = modifier.counter || 0;
                counter.className = 'modifier-counter';

                const buttonContainer = this.createButtonContainer(modifier, index, listContainer);

                modifierRow.appendChild(description);
                modifierRow.appendChild(counter);
                modifierRow.appendChild(buttonContainer);

                return modifierRow;
            }

            static createButtonContainer(modifier, index, listContainer) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'column';
                buttonContainer.style.gap = '5px';

                const plusButton = this.createCounterButton('+', () => {
                    modifier.counter = (modifier.counter || 0) + 1;
                    this.updateStorage(modifier, index, listContainer);
                }, "Increase the counter.");

                const minusButton = this.createCounterButton('-', () => {
                    modifier.counter = Math.max(0, (modifier.counter || 0) - 1);
                    this.updateStorage(modifier, index, listContainer);
                }, "Decrease the counter.");

                const deleteButton = this.createDeleteButton(() => {
                    this.deleteModifierFromStorage(index, listContainer);
                });

                buttonContainer.appendChild(plusButton);
                buttonContainer.appendChild(minusButton);
                buttonContainer.appendChild(deleteButton);

                return buttonContainer;
            }

            static createCounterButton(text, onClick, title=null) {
                const button = document.createElement('button');
                button.textContent = text;
                button.className = 'modifier-counter-btn';
                if (title !== null) {
                    button.title = title
                }
                button.addEventListener('click', onClick);
                return button;
            }

            static createDeleteButton(onClick) {
                const button = document.createElement('button');
                button.textContent = '🗑️';
                button.className = 'modifier-counter-btn';
                button.style.backgroundColor = '#ff4d4d'; // Red background
                button.style.color = '#fff'; // White text
                button.title = "Delete this Modifier.";
                button.addEventListener('click', onClick);
                return button;
            }

            static updateStorage(modifier, index, listContainer) {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                modifiers[index] = modifier;
                localStorage.setItem(STORAGE.MODIFIERS, JSON.stringify(modifiers));
                this.updateModifiersList(listContainer);
            }

            static deleteModifierFromStorage(index, listContainer) {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                modifiers.splice(index, 1);
                localStorage.setItem(STORAGE.MODIFIERS, JSON.stringify(modifiers));
                this.updateModifiersList(listContainer);
                this.updateModifierCount();
            }

            static createPlusButton() {
                const plusButton = document.createElement('button');
                plusButton.textContent = '+';
                plusButton.className = 'modifier-add-btn';
                plusButton.title = "Open Dialog to add a new Modifier."
                plusButton.addEventListener('click', () => this.showModifierDialog());
                return plusButton;
            }

            static showModifierDialog(defaultText = '') {
                const existingDialog = document.getElementById('modifier-dialog');
                if (existingDialog) existingDialog.remove();

                const dialog = document.createElement('div');
                dialog.id = 'modifier-dialog';
                dialog.className = 'modifier-dialog';

                const closeButton = this.createCloseButton(dialog);
                const inputRow = this.createInputRow(defaultText);
                const submitButton = this.createSubmitButton(dialog, inputRow);

                dialog.appendChild(closeButton);
                dialog.appendChild(inputRow.row);
                dialog.appendChild(inputRow.checkboxContainer);
                dialog.appendChild(submitButton);

                document.body.appendChild(dialog);
            }

            static createCloseButton(dialog) {
                const closeButton = document.createElement('button');
                closeButton.textContent = '×';
                closeButton.className = 'modifier-close-btn';
                closeButton.addEventListener('click', () => dialog.remove());
                return closeButton;
            }

            static createInputRow(defaultText = '') {
                const inputRow = document.createElement('div');
                inputRow.className = 'modifier-input-row';

                const descriptionInput = document.createElement('textarea');
                descriptionInput.placeholder = 'Enter description...';
                descriptionInput.value = defaultText;
                descriptionInput.rows = 3;
                descriptionInput.className = 'modifier-input';

                const counterInput = document.createElement('input');
                counterInput.type = 'number';
                counterInput.placeholder = '0';
                counterInput.step = '1';
                counterInput.className = 'modifier-input';

                const triggerInput = document.createElement('input');
                triggerInput.type = 'text';
                triggerInput.placeholder = 'Trigger (optional)';
                triggerInput.className = 'modifier-input';

                const checkboxContainer = this.createCheckboxContainer();

                inputRow.appendChild(descriptionInput);
                inputRow.appendChild(counterInput);
                inputRow.appendChild(triggerInput);

                return {
                    row: inputRow,
                    checkboxContainer,
                    descriptionInput,
                    counterInput,
                    triggerInput
                };
            }

            static createCheckboxContainer() {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.display = 'flex';
                checkboxContainer.style.flexDirection = 'column';

                // Applies After Session Checkbox
                const appliesAfterSessionContainer = document.createElement('div');
                const appliesAfterSessionCheckbox = document.createElement('input');
                appliesAfterSessionCheckbox.type = 'checkbox';
                appliesAfterSessionCheckbox.className = 'modifier-checkbox';

                const appliesAfterSessionLabel = document.createElement('label');
                appliesAfterSessionLabel.textContent = 'Applies After Session';

                appliesAfterSessionContainer.appendChild(appliesAfterSessionCheckbox);
                appliesAfterSessionContainer.appendChild(appliesAfterSessionLabel);

                // Decrement on New Page Checkbox
                const decrementContainer = document.createElement('div');
                const decrementCheckbox = document.createElement('input');
                decrementCheckbox.type = 'checkbox';
                decrementCheckbox.className = 'decrement-checkbox'; // New checkbox for decrementing

                const decrementLabel = document.createElement('label');
                decrementLabel.textContent = 'Decrement on New Page';

                decrementContainer.appendChild(decrementCheckbox);
                decrementContainer.appendChild(decrementLabel);

                // Add both checkboxes to the container
                checkboxContainer.appendChild(appliesAfterSessionContainer);
                checkboxContainer.appendChild(decrementContainer);

                return checkboxContainer;
            }

            static createSubmitButton(dialog, inputRow) {
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Add Modifier';
                submitButton.className = 'modifier-btn modifier-submit-btn';
                submitButton.addEventListener('click', () => {
                    const description = inputRow.descriptionInput.value.trim();
                    const counter = inputRow.counterInput.value ? parseInt(inputRow.counterInput.value, 10) : null;
                    const trigger = inputRow.triggerInput.value.trim();
                    const appliesAfterSession = inputRow.checkboxContainer.querySelector('.modifier-checkbox').checked;
                    const decrementOnNewPage = inputRow.checkboxContainer.querySelector('.decrement-checkbox').checked;
                    const pageNumber = getTeaseAndPageNumber();

                    if (description) {
                        this.addModifierToStorage(description, counter, appliesAfterSession, pageNumber, decrementOnNewPage, trigger);
                        this.updateModifierCount();
                        dialog.remove();
                    } else {
                        alert('Please enter a valid description.');
                    }
                });

                return submitButton;
            }

            static addModifierToStorage(description, counter, appliesAfterSession, pageNumber, decrementOnNewPage = false, trigger = '') {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                modifiers.push({ description, counter, appliesAfterSession, decrementOnNewPage, pageNumber, trigger });
                localStorage.setItem(STORAGE.MODIFIERS, JSON.stringify(modifiers));

                const modifiersListContainer = document.getElementById('modifiers-list-container');
                if (modifiersListContainer) {
                    this.updateModifiersList(modifiersListContainer);
                }
                this.displayTriggerPreview();
            }

            static displayTriggerPreview() {
                const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];
                const triggers = modifiers.map(m => m.trigger).filter(Boolean);
                let preview = document.getElementById('modifier-trigger-preview');

                if (triggers.length > 0) {
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.id = 'modifier-trigger-preview';
                        preview.className = 'modifier-trigger-preview';
                        document.body.appendChild(preview);
                    }
                    preview.innerHTML = '';
                    const item = document.createElement('div');
                    item.textContent = "Modifier Triggers:";
                    preview.appendChild(item);

                    triggers.forEach(trigger => {
                        const item = document.createElement('div');
                        item.textContent = trigger;
                        preview.appendChild(item);
                    });
                } else if (preview) {
                    preview.remove();
                }
            }

            static createEyeButton(container) {
                const eyeButton = document.createElement('button');
                eyeButton.textContent = 'Show';
                eyeButton.className = 'modifier-eye-btn';
                eyeButton.title = "Toggle display of current modifiers."
                eyeButton.addEventListener('click', () => this.toggleModifiersList(container));
                return eyeButton;
            }

            static toggleModifiersList(container) {
                const modifiersListContainer = document.getElementById('modifiers-list-container');
                if (modifiersListContainer) {
                    modifiersListContainer.style.display =
                        modifiersListContainer.style.display === 'none' ? 'block' : 'none';
                } else {
                    const listContainer = document.createElement('div');
                    listContainer.id = 'modifiers-list-container';
                    listContainer.className = 'modifiers-list-container';
                    this.updateModifiersList(listContainer);
                    container.appendChild(listContainer);
                }
            }

            static countDownOnNewPage() {
                if (!isPageReload()) { // Check if it is not a page reload
                    const modifiers = JSON.parse(localStorage.getItem(STORAGE.MODIFIERS)) || [];

                    let updated = false;

                    // Decrement counters for modifiers with decrementOnNewPage enabled
                    modifiers.forEach((modifier) => {
                        if (modifier.decrementOnNewPage && (modifier.counter || modifier.counter === 0)) {
                            modifier.counter -= 1;
                            updated = true;

                            if (modifier.counter <= 0) {
                                this.has_warning = true;
                                console.log("warning")
                            }
                        }
                    });

                    if (updated) {
                        localStorage.setItem(STORAGE.MODIFIERS, JSON.stringify(modifiers));

                        const modifiersListContainer = document.getElementById('modifiers-list-container');
                        if (modifiersListContainer) {
                            this.updateModifiersList(modifiersListContainer);
                        }

                        this.updateModifierCount();
                    }
                }
            }
        }

        class SessionEndManager {
            static REASON_OPTIONS = {
                send_away: 'Send away',
                ruined_o: 'Accidental Orgasm',
                without_permission: 'Without permission'
            };

            static _REASON_PENALTIES = {
                send_away: { chastityAdjustment: 0, pointsPenalty: 0, chastityNextSession: 0 },
                ruined_o: { chastityAdjustment: CONSTS.PENALTY_FOR_RO, pointsPenalty: CONSTS.POINTS_PENALTY_FOR_RO, chastityNextSession: 0 },
                without_permission: { chastityAdjustment: 0, pointsPenalty: CONSTS.POINTS_PENALTY_FOR_LEAVING, chastityNextSession: CONSTS.CHASTITY_PENALTY_FOR_LEAVING }
            };

            static DETAIL_OPTIONS = {
                full: 'Full Orgasm',
                ruined: 'Ruined Orgasm',
                denied: 'Denied',
            };

            static VALID_DETAILS = {
                send_away: ['full', 'ruined', 'denied'],
                ruined_o: ['ruined'],
                without_permission: ['denied']
            };

            static addRow() {
                const container = document.getElementById('my-extension-content');
                const endSessionRow = document.createElement('div');
                endSessionRow.className = 'stat-row';

                // Dropdown 1 (Reason of session end)
                const reasonDropdown = document.createElement('select');
                reasonDropdown.title = 'Reason of session end';

                Object.entries(SessionEndManager.REASON_OPTIONS).forEach(([value, text]) => {
                    const reasonOptionElement = document.createElement('option');
                    reasonOptionElement.value = value;
                    reasonOptionElement.textContent = text;
                    reasonDropdown.appendChild(reasonOptionElement);
                });

                // Dropdown 2 (Dependent options)
                const detailsDropdown = document.createElement('select');
                detailsDropdown.title = 'Details';

                const updateDetailsDropdown = () => {
                    const selectedReason = reasonDropdown.value;
                    const validDetails = SessionEndManager.VALID_DETAILS[selectedReason] || [];

                    detailsDropdown.innerHTML = ''; // Clear the current options

                    validDetails.forEach(detailValue => {
                        const detailOptionElement = document.createElement('option');
                        detailOptionElement.value = detailValue;
                        detailOptionElement.textContent = SessionEndManager.DETAIL_OPTIONS[detailValue];
                        detailsDropdown.appendChild(detailOptionElement);
                    });
                };

                // Attach event listener to update detailsDropdown
                reasonDropdown.addEventListener('change', updateDetailsDropdown);
                updateDetailsDropdown(); // Initialize on load with default selection

                // Button for ending the session
                const endSessionButton = document.createElement('button');
                endSessionButton.textContent = 'End Session';
                endSessionButton.addEventListener('click', () => {
                    const reason = reasonDropdown.value;
                    const detail = detailsDropdown.value;
                    SessionEndManager.endSession(reason, detail);
                });

                // Button for history
                const historyButton = this.createSessionHistoryButton(container);

                // Assemble the row
                endSessionRow.appendChild(reasonDropdown);
                endSessionRow.appendChild(detailsDropdown);
                endSessionRow.appendChild(endSessionButton);
                endSessionRow.appendChild(historyButton);
                container.appendChild(endSessionRow);
            }

            static createSessionHistoryButton(container) {
                const historyButton = document.createElement('button');
                historyButton.textContent = 'History';
                historyButton.addEventListener('click', () => {
                    this.displaySessionHistory(container);
                });
                return historyButton;
            }

            static getChastityValues() {
                const chastity = Math.max(parseInt(localStorage.getItem(STORAGE.CHASTITY_VALUE)) || 1, 1);
                const chastity_max = parseInt(localStorage.getItem(STORAGE.CHASTITY_MAX)) || CONSTS.CHASTITY_MAX_DEFAULT;
                const extra_chastity = parseInt(localStorage.getItem(STORAGE.CHASTITY_EXTRA)) || 0;

                return { chastity, chastity_max, extra_chastity };
            }

            static endSession(reason, o_type, start_date = null) {
                if (!confirm(`Are you sure you want to end the session for reason '${SessionEndManager.REASON_OPTIONS[reason]}' with orgasm type: '${SessionEndManager.DETAIL_OPTIONS[o_type]}'?`)) {
                    return
                }

                const { chastity, chastity_max, extra_chastity } = this.getChastityValues();

                let actual_chastity = chastity;
                const penaltyConfig = this._REASON_PENALTIES[reason] || {};

                if (Number.isFinite(penaltyConfig.chastityAdjustment)) {
                    actual_chastity += penaltyConfig.chastityAdjustment;
                } else if (penaltyConfig.chastityAdjustment === 'MAX') {
                    actual_chastity = chastity_max;
                } else if (penaltyConfig.chastityAdjustment === 'AT_LEAST_HALF') {
                    const halfChastity = Math.ceil(chastity_max / 2);
                    actual_chastity = Math.max(actual_chastity, halfChastity);
                }

                const chastity_next_session = penaltyConfig.chastityNextSession;
                const chastity_duration_in_days = Math.min(actual_chastity, chastity_max) + extra_chastity;

                const pointsPenalty = penaltyConfig.pointsPenalty || 0;
                this._endSession(reason, o_type, chastity_duration_in_days, pointsPenalty, chastity_next_session,start_date);
            }

            static _endSession(reason, o_type, chastity_duration_in_days, penalty_points, chastity_next_session, start_date = null) {
                const startDateTime = start_date ? new Date(start_date) : new Date();

                const endDateTime = new Date(startDateTime);
                endDateTime.setDate(endDateTime.getDate() + chastity_duration_in_days);
                endDateTime.setHours(endDateTime.getHours() - 2);

                const sessionData = {
                    difficulty: localStorage.getItem(STORAGE.CURRENT_DIFFICULTY) || 'Unknown',
                    points: parseInt(localStorage.getItem(STORAGE.POINTS)) || 0,
                    pages: parseInt(localStorage.getItem(STORAGE.TOTAL_PAGES)) || 0,
                    edges: parseInt(localStorage.getItem(STORAGE.EDGES)) || 0,
                    unauthorized: parseInt(localStorage.getItem(STORAGE.UNAUTHORIZED)) || 0,
                    session_start: localStorage.getItem(STORAGE.SESSION_START),
                    session_end: new Date().toISOString(),
                    end_reason: reason,
                    o_type: o_type,
                    final_chastity: chastity_duration_in_days,
                };

                const sessionHistory = JSON.parse(localStorage.getItem(STORAGE.SESSION_HISTORY)) || [];
                sessionHistory.push(sessionData);

                localStorage.setItem(STORAGE.SESSION_HISTORY, JSON.stringify(sessionHistory));


                const sessionEndData = {
                    can_restart_now: false,
                    end_date: endDateTime.toISOString(),
                    penalty_points: penalty_points,
                    chastity_next_session: chastity_next_session,
                };
                localStorage.setItem(STORAGE.BETWEEN_SESSION_DATA, JSON.stringify(sessionEndData));
                localStorage.setItem(STORAGE.SESSION_ACTIVE, false);

                window.location.href = BASE_URL;
            }

            static displaySessionHistory(container) {
                const historyContainer = document.getElementById('session-history-container');
                if (historyContainer) {
                    // If container exists, toggle its visibility
                    historyContainer.style.display =
                        historyContainer.style.display === 'none' ? 'block' : 'none';
                } else {
                    // Create the container for the session history
                    const listContainer = document.createElement('div');
                    listContainer.id = 'session-history-container';
                    listContainer.className = 'modifiers-list-container';
                    this.updateSessionHistory(listContainer);
                    container.appendChild(listContainer);
                }
            }

            static updateSessionHistory(listContainer) {
                const sessionHistory = JSON.parse(localStorage.getItem(STORAGE.SESSION_HISTORY)) || [];
                const reversedSessionHistory = [...sessionHistory].reverse();

                listContainer.innerHTML = '';

                reversedSessionHistory.forEach((sessionData, index) => {
                    const sessionId = reversedSessionHistory.length - index;
                    const historyRow = this.createSessionHistoryRow(sessionData, sessionId);
                    listContainer.appendChild(historyRow);
                });
            }

            static createSessionHistoryRow(sessionData, sessionId) {
                const row = document.createElement('div');
                row.className = 'modifier-row'; // Reuse the row styling class

                const sessionStart = new Date(sessionData.session_start);
                const sessionEnd = new Date(sessionData.session_end);
                const today = new Date();
                const timeDifference = today - sessionEnd;
                const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days

                row.textContent = `
                    Session ${sessionId}:
                    Difficulty: ${sessionData.difficulty}, 
                    Points: ${sessionData.points}, 
                    Pages: ${sessionData.pages}, 
                    Edges: ${sessionData.edges}, 
                    Unauthorized Edges: ${sessionData.unauthorized}, 
                    End Reason: ${SessionEndManager.REASON_OPTIONS[sessionData.end_reason]}, 
                    Orgasm Type: ${SessionEndManager.DETAIL_OPTIONS[sessionData.o_type]}, 
                    Final Chastity: ${sessionData.final_chastity} days, 
                    Session Start: 
                    Session End: ${sessionEnd.toLocaleString()} (${daysAgo} days ago)
                `;

                return row;
            }
        }

        class ChastityBetweenSessionManager {
            static init() {
                const chastity_data = JSON.parse(localStorage.getItem(STORAGE.BETWEEN_SESSION_DATA)) || null;
                if (!chastity_data || chastity_data.can_restart_now) return false;

                const overlay = document.createElement('div');
                overlay.className = 'chastity-overlay';

                let end_date = new Date(chastity_data.end_date);

                // Container for the next session date and the "+1 Day" button
                const endDateDisplayContainer = document.createElement('div');
                endDateDisplayContainer.className = 'end-date-display-container';

                const endDateDisplay = document.createElement('span'); // Use a span for the date text
                endDateDisplay.className = 'end-date-display';

                // Update the date display text
                const updateEndDateDisplay = () => {
                    endDateDisplay.textContent = `Next Session Date: ${end_date.toLocaleString()}`;
                };
                updateEndDateDisplay();

                // "+1 Day" button
                const addOneDayButton = document.createElement('button');
                addOneDayButton.className = 'add-one-day-button';
                addOneDayButton.textContent = '+1 Day';
                addOneDayButton.title = "Add a day more to you chastity sentence"
                addOneDayButton.addEventListener('click', () => {
                    // Add 1 day to the end_date
                    end_date.setDate(end_date.getDate() + 1);

                    // Update the storage with the new end_date
                    chastity_data.end_date = end_date.toISOString();
                    localStorage.setItem(STORAGE.BETWEEN_SESSION_DATA, JSON.stringify(chastity_data));

                    updateEndDateDisplay(); // Refresh the displayed date
                });

                // Append the span and button together in the container
                endDateDisplayContainer.appendChild(endDateDisplay);
                endDateDisplayContainer.appendChild(addOneDayButton);

                // Countdown display
                const countdownDisplay = document.createElement('div');
                countdownDisplay.className = 'countdown-display';

                const updateCountdown = () => {
                    const now = new Date();
                    const timeRemaining = end_date - now;

                    // If the remaining time is 0 or less, end the session
                    if (timeRemaining <= 0) {
                        chastity_data.can_restart_now = true;
                        localStorage.setItem(STORAGE.BETWEEN_SESSION_DATA, JSON.stringify(chastity_data));
                        localStorage.setItem(STORAGE.SESSION_ACTIVE, false);
                        window.location.href = BASE_URL;
                        return true;
                    }

                    // Calculate remaining time in days, hours, minutes, and seconds
                    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                    // Update the countdown display text
                    countdownDisplay.textContent = `Time Remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
                };

                updateCountdown();
                const countdownInterval = setInterval(updateCountdown, 1000);

                const endEarlyButton = document.createElement('button');
                endEarlyButton.className = 'end-early-button';
                endEarlyButton.textContent = 'End Chastity Sentence Early';
                endEarlyButton.addEventListener('click', () => {
                    // Confirm the action with the user
                    const confirmEnd = confirm('Are you a little weakling that really wants to end your chastity sentence early?');
                    if (confirmEnd) {
                        chastity_data.can_restart_now = true;
                        localStorage.setItem(STORAGE.BETWEEN_SESSION_DATA, JSON.stringify(chastity_data));
                        localStorage.setItem(STORAGE.SESSION_ACTIVE, false);
                        window.location.href = BASE_URL;
                    }
                });

                // Modifiers section using ModifierManager
                const modifiersTitle = document.createElement('h3');
                modifiersTitle.textContent = 'Modifiers';
                modifiersTitle.className = 'modifiers-title';

                const modifiersContainer = document.createElement('div');
                modifiersContainer.className = 'modifiers-container';

                ModifierManager.only_after_session = true;
                ModifierManager.updateModifiersList(modifiersContainer);

                overlay.appendChild(endDateDisplayContainer);
                overlay.appendChild(countdownDisplay);
                overlay.appendChild(endEarlyButton);
                overlay.appendChild(modifiersTitle);
                overlay.appendChild(modifiersContainer);
                document.body.appendChild(overlay);

                return true;
            }
        }

        class SessionActiveManager {
            static last_session_data = null;

            static is_active() {
                this.last_session_data = JSON.parse(localStorage.getItem(STORAGE.BETWEEN_SESSION_DATA)) || null;
                return localStorage.getItem(STORAGE.SESSION_ACTIVE) === "true" || false;
            }

            static addSessionStartRow() {
                const container = document.getElementById('my-extension-content');
                const row = document.createElement('div');
                row.className = 'stat-row';

                const dropdown = document.createElement('select');
                Object.keys(DIFFICULTY_CONSTS).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = key;
                    dropdown.appendChild(option);
                });


                const currentDifficulty = localStorage.getItem(STORAGE.CURRENT_DIFFICULTY);
                if (currentDifficulty && DIFFICULTY_CONSTS[currentDifficulty]) {
                    dropdown.value = currentDifficulty;
                } else {
                    dropdown.selectedIndex = 0;
                }

                const dropdownLabel = document.createElement('span');
                dropdownLabel.className = 'session-label';
                dropdownLabel.textContent = 'Select Difficulty: ';

                const startButton = document.createElement('button');
                startButton.textContent = 'Start Session';
                startButton.addEventListener('click', () => {
                    this.startSession(dropdown);
                });

                row.appendChild(dropdownLabel);
                row.appendChild(dropdown);
                row.appendChild(startButton);

                container.appendChild(row);
            }

            static startSession(dropdown) {
                const selectedDifficulty = dropdown.value;

                this.resetSessionValues(selectedDifficulty);

                localStorage.setItem(STORAGE.CURRENT_DIFFICULTY, selectedDifficulty);
                localStorage.setItem(STORAGE.SESSION_ACTIVE, true);
                localStorage.setItem(STORAGE.SESSION_START, new Date().toISOString());

                window.location.href = getRandomURL();
            }

            static resetSessionValues(difficultyKey) {
                Object.values(STORAGE).forEach(key => {
                    if (key === STORAGE.MODIFIERS) {
                        const modifiers = JSON.parse(localStorage.getItem(key)) || [];
                        const filteredModifiers = modifiers.filter(modifier => {
                            return modifier.appliesAfterSession !== false; // Keep only those where appliesAfterSession is true or undefined
                        });

                        localStorage.setItem(key, JSON.stringify(filteredModifiers));
                    } else if (key === STORAGE.NOTES || key === STORAGE.SESSION_HISTORY) {
                        // dont reset notes/history
                    } else {
                        localStorage.removeItem(key);
                    }
                });

                const difficultyDefaults = DIFFICULTY_CONSTS[difficultyKey];

                if (difficultyDefaults) {
                    // Set the default values from the chosen difficulty
                    Object.keys(difficultyDefaults).forEach(constKey => {
                        const storageKey = STORAGE[constKey.replace('_DEFAULT', '').toUpperCase()]; // Match corresponding STORAGE key (ignoring "_DEFAULT" suffix)
                        if (storageKey) {
                            localStorage.setItem(storageKey, difficultyDefaults[constKey]);
                        }
                    });
                }

                if (this.last_session_data) {
                    if (this.last_session_data.penalty_points) {
                        localStorage.setItem(STORAGE.POINTS, -this.last_session_data.penalty_points);
                    }
                    if (this.last_session_data.chastity_next_session) {
                        localStorage.setItem(STORAGE.CHASTITY_VALUE, -this.last_session_data.chastity_next_session);
                    }
                }

                localStorage.removeItem(STORAGE.BETWEEN_SESSION_DATA);
            }

            static addDataRow() {
                const container = document.getElementById('my-extension-content');
                const row = document.createElement('div');
                row.className = 'stat-row';

                row.appendChild(SessionEndManager.createSessionHistoryButton(container));
                row.appendChild(StorageManager.addStorageButton());
                container.appendChild(row);
            }
        }

        // --- Main function to roll new page, increment counters ---
        function setRandomUrl() {
            const randomUrl = getRandomURL()

            const original = document.getElementsByClassName("link")[0];
            const clone = original.cloneNode(true);
            clone.children[0].innerHTML = "Roll";
            clone.children[0].href = randomUrl;

            original.parentElement.appendChild(clone);

            const element = document.querySelector('.tease_pic');

            if (element) {
                element.parentElement.href = randomUrl;
            }
        }

        // --- Initialization ---
        addCSS();

        PauseManager.handlePauseLogic();
        const teaseText = document.querySelector("#tease_content > p.text");
        replacePageWithAnchors(teaseText);
        highlightDifficultyElements(teaseText);


        if (ChastityBetweenSessionManager.init()) {
            return;
        }
        const panelContent = createPanel();
        if (!SessionActiveManager.is_active()) {
            SessionActiveManager.addSessionStartRow();
            SessionActiveManager.addDataRow();

            return;
        }
        PauseManager.checkAndResumePause();
        PointsManager.addRow();
        addChastityRow();
        EdgeManager.addRow();
        addPagesPauseRow();
        addRevisitedGoddessRow();
        ModifierManager.addRow();
        ModifierManager.countDownOnNewPage();
        ModifierManager.initModifierDetection();
        SessionEndManager.addRow();
        countPageView();
        ThreeMinuteReminder.init();
        registerShortcuts();

        setRandomUrl();
        isPageReload();
    })();
})();
function isEditable(el) {
    return el && (
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.isContentEditable
    );
}


function disableRedirectOnSpacebar() {
    const handleKey = function(e) {
        if ((e.code === 'Space' || e.key === ' ' || e.keyCode === 32)) {
            const target = e.target;

            if (isEditable(target)) {
                // Allow spacebar behavior inside inputs by manually dispatching
                e.stopImmediatePropagation();
                e.preventDefault();

                // Create and dispatch a new event to simulate a space input
                const evt = new InputEvent("input", {
                    bubbles: true,
                    cancelable: true,
                    inputType: "insertText",
                    data: " ",
                    dataTransfer: null
                });

                if (target.setRangeText) {
                    target.setRangeText(" ", target.selectionStart, target.selectionEnd, "end");
                    target.dispatchEvent(evt);
                } else {
                    // Fallback for contenteditable
                    document.execCommand("insertText", false, " ");
                }

            } else {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
    };

    window.addEventListener('keydown', handleKey, true);
    window.addEventListener('keypress', handleKey, true);
}

disableRedirectOnSpacebar();
