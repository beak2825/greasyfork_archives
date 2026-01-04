// ==UserScript==
// @name         Enhanced Keno Tracker
// @namespace    http://zachwozn.com/
// @version      2.7
// @description  Track Keno numbers with multi-round support. Allows adding/overwriting on import. Pick counts can sorted by frequency or number.
// @author       zachwozn
// @match        https://www.torn.com/page.php?sid=keno
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541128/Enhanced%20Keno%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/541128/Enhanced%20Keno%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LS_KEY_POSITION = 'kenoTrackerPosition';
    const LS_KEY_PICK_COUNTS = 'kenoNumberPickCounts';
    const LS_KEY_SORT_ORDER = 'kenoCountSortOrder';
    const LS_KEY_TOTAL_ROUNDS = 'kenoTotalRounds';

    function createUI() {
        const container = document.createElement('div');
        container.id = 'kenoUI';
        Object.assign(container.style, {
            position: 'fixed',
            top: `${getPosition().top}px`,
            left: `${getPosition().left}px`,
            backgroundColor: '#1e293b',
            color: '#f9fafb',
            padding: '20px',
            borderRadius: '10px',
            zIndex: '9999',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            maxWidth: '350px',
            overflowY: 'auto',
            textAlign: 'center',
            fontSize: '14px',
            resize: 'both',
            overflow: 'auto',
            minWidth: '250px',
            minHeight: '200px',
            cursor: 'grab'
        });

        const style = document.createElement('style');
        style.textContent = `
            #kenoUI *, #kenoUI *:focus, #kenoUI *:active, #kenoUI *:hover { outline: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent !important; }
            #kenoUI h3, #kenoUI h4 { border: none !important; background: none !important; padding: 0 !important; margin: 0 0 5px 0 !important; }
            #kenoUI #winningNumbers, #kenoUI #lostNumbers { margin-top: 0 !important; display: flex !important; flex-wrap: wrap !important; gap: 5px !important; justify-content: center; }
            #kenoUI #numberCountDisplay { margin-top: 0 !important; }
            #kenoUI #winningNumbers li, #kenoUI #lostNumbers li { display: inline-block !important; margin: 0 !important; padding: 2px 5px; border-radius: 3px; background-color: #2d3748; }
            #kenoUI #winningNumbersSection, #kenoUI #lostNumbersSection { margin-bottom: 15px !important; }
            #kenoUI, #winningNumbers, #lostNumbers, #numberCountDisplay { scrollbar-width: thin; scrollbar-color: #718096 #1e293b; }
            #kenoUI::-webkit-scrollbar { width: 8px; height: 8px; }
            #kenoUI::-webkit-scrollbar-track { background: transparent; }
            #kenoUI::-webkit-scrollbar-thumb { background-color: #4a5568; border-radius: 10px; border: 2px solid #1e293b; }
            #kenoUI::-webkit-scrollbar-thumb:hover { background-color: #718096; }
        `;
        document.head.appendChild(style);

        const title = document.createElement('h3');
        title.textContent = 'Keno Tracker';
        Object.assign(title.style, { fontSize: '18px', fontWeight: 'bold', cursor: 'grab' });
        container.appendChild(title);

        const roundsInfo = document.createElement('div');
        roundsInfo.id = 'kenoRoundsInfo';
        Object.assign(roundsInfo.style, { fontSize: '12px', color: '#a0aec0', marginBottom: '15px', marginTop: '-2px' });
        container.appendChild(roundsInfo);

        const winningSection = document.createElement('div');
        winningSection.id = 'winningNumbersSection';
        const winningTitle = document.createElement('h4');
        winningTitle.textContent = 'System Winning Numbers:';
        winningSection.appendChild(winningTitle);
        const winningList = document.createElement('ul');
        winningList.id = 'winningNumbers';
        Object.assign(winningList.style, { listStyleType: 'none', padding: '5px', maxHeight: '100px', overflowY: 'auto', border: '1px solid #4a5568', borderRadius: '5px' });
        winningSection.appendChild(winningList);
        container.appendChild(winningSection);

        const lostSection = document.createElement('div');
        lostSection.id = 'lostNumbersSection';
        const lostTitle = document.createElement('h4');
        lostTitle.textContent = 'System Lost Numbers:';
        lostSection.appendChild(lostTitle);
        const lostList = document.createElement('ul');
        lostList.id = 'lostNumbers';
        Object.assign(lostList.style, { listStyleType: 'none', padding: '5px', maxHeight: '100px', overflowY: 'auto', border: '1px solid #4a5568', borderRadius: '5px' });
        lostSection.appendChild(lostList);
        container.appendChild(lostSection);

        const countSection = document.createElement('div');
        countSection.id = 'countSection';
        const countHeader = document.createElement('div');
        Object.assign(countHeader.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' });
        const countTitle = document.createElement('h4');
        countTitle.textContent = 'System Pick Counts:';
        countHeader.appendChild(countTitle);
        const sortButton = document.createElement('button');
        sortButton.id = 'countSortToggle';
        Object.assign(sortButton.style, { fontSize: '11px', padding: '2px 6px', cursor: 'pointer', backgroundColor: '#4a5568', color: 'white', border: '1px solid #718096', borderRadius: '4px' });
        sortButton.addEventListener('click', () => {
            countSortOrder = (countSortOrder === 'byPick') ? 'byNumber' : 'byPick';
            localStorage.setItem(LS_KEY_SORT_ORDER, countSortOrder);
            updateDisplay();
        });
        countHeader.appendChild(sortButton);
        countSection.appendChild(countHeader);
        const numberCount = document.createElement('div');
        numberCount.id = 'numberCountDisplay';
        Object.assign(numberCount.style, { maxHeight: '150px', overflowY: 'auto', padding: '10px', backgroundColor: '#2d3748', borderRadius: '5px', marginBottom: '20px', textAlign: 'left', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: '5px' });
        countSection.appendChild(numberCount);
        container.appendChild(countSection);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All Data';
        Object.assign(clearButton.style, { backgroundColor: '#ef4444', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s ease', width: '100%', marginBottom: '10px' });
        clearButton.onmouseover = () => clearButton.style.backgroundColor = '#dc2626';
        clearButton.onmouseout = () => clearButton.style.backgroundColor = '#ef4444';
        clearButton.addEventListener('click', clearData);
        container.appendChild(clearButton);

        const ioContainer = document.createElement('div');
        Object.assign(ioContainer.style, { display: 'flex', gap: '10px', justifyContent: 'center' });
        const importButton = document.createElement('button');
        importButton.textContent = 'Import Data';
        Object.assign(importButton.style, { backgroundColor: '#2563eb', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s ease', flex: '1' });
        importButton.addEventListener('click', importData);
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Data';
        Object.assign(exportButton.style, { backgroundColor: '#16a34a', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s ease', flex: '1' });
        exportButton.addEventListener('click', exportData);
        ioContainer.appendChild(importButton);
        ioContainer.appendChild(exportButton);
        container.appendChild(ioContainer);

        document.body.appendChild(container);
        setupDrag(container);
    }

    function setupDrag(element) {
        let isDragging = false, offsetX, offsetY;
        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.closest('button, ul, #numberCountDisplay')) return;
            const isDraggableArea = e.target === element || e.target.closest('h3, h4');
            if (isDraggableArea) {
                isDragging = true;
                const rect = element.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                element.style.cursor = 'grabbing';
            }
        });
        document.addEventListener('mousemove', (e) => { if (isDragging) { e.preventDefault(); element.style.left = `${e.clientX - offsetX}px`; element.style.top = `${e.clientY - offsetY}px`; } });
        document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; element.style.cursor = 'grab'; savePosition(element.style.left, element.style.top); } });
    }

    let numberPickCounts, countSortOrder, totalRounds;
    let roundsToPlay = 0;
    let roundsProcessedInSession = 0;

    function savePosition(left, top) { localStorage.setItem(LS_KEY_POSITION, JSON.stringify({ top: parseInt(top), left: parseInt(left) })); }
    function getPosition() { return JSON.parse(localStorage.getItem(LS_KEY_POSITION)) || { top: 20, left: 20 }; }

    function clearData() {
        if (confirm('Are you sure you want to clear ALL tracker data? This action cannot be undone.')) {
            localStorage.removeItem(LS_KEY_PICK_COUNTS);
            localStorage.removeItem(LS_KEY_TOTAL_ROUNDS);
            numberPickCounts = {};
            totalRounds = 0;
            updateDisplay();
            alert('All Keno tracker data has been cleared.');
        }
    }

    function exportData() {
        const exportObject = {
            pickCounts: numberPickCounts,
            totalRounds: totalRounds
        };
        const data = JSON.stringify(exportObject, null, 2);
        if (!data || data === '{}') {
            alert('No data to export.');
            return;
        }
        navigator.clipboard.writeText(data).then(() => {
            alert('Keno tracker data has been copied to your clipboard.');
        }).catch(err => {
            console.error('Failed to copy data: ', err);
            prompt('Could not automatically copy. Please copy the data manually:', data);
        });
    }

    // UPDATED: Imports both pick counts and total rounds
    function importData() {
        const rawData = prompt('Paste your exported Keno tracker data here:');
        if (!rawData) return;

        let parsedData;
        try {
            parsedData = JSON.parse(rawData);
            if (typeof parsedData !== 'object' || parsedData === null || !('pickCounts' in parsedData) || !('totalRounds' in parsedData)) {
                throw new Error('Data is not in the correct format. It must contain "pickCounts" and "totalRounds".');
            }
        } catch (error) {
            alert('Import failed. The data provided was not valid.');
            console.error('Import error:', error);
            return;
        }

        const importMethod = prompt("How would you like to import?\n\nType 'overwrite' to replace all existing data.\nType 'add' to sum the imported data with your existing data.", "add");
        if (!importMethod) return;

        const method = importMethod.toLowerCase();
        if (method === 'overwrite') {
            if (confirm('This will completely REPLACE all current data. Are you sure?')) {
                numberPickCounts = parsedData.pickCounts;
                totalRounds = parsedData.totalRounds;
            }
        } else if (method === 'add') {
            if (confirm('This will ADD the imported counts and rounds to your current data. Are you sure?')) {
                // Add pick counts
                for (const number in parsedData.pickCounts) {
                    if (Object.hasOwnProperty.call(parsedData.pickCounts, number)) {
                        numberPickCounts[number] = (numberPickCounts[number] || 0) + (parsedData.pickCounts[number] || 0);
                    }
                }
                // Add rounds
                totalRounds += parsedData.totalRounds;
            }
        } else {
            alert('Invalid import method. Action cancelled.');
            return;
        }

        localStorage.setItem(LS_KEY_PICK_COUNTS, JSON.stringify(numberPickCounts));
        localStorage.setItem(LS_KEY_TOTAL_ROUNDS, totalRounds.toString());
        updateDisplay();
        alert('Data imported successfully!');
    }


    function updateDisplay() {
        const winningList = document.getElementById('winningNumbers');
        const lostList = document.getElementById('lostNumbers');
        const numberCountDisplay = document.getElementById('numberCountDisplay');
        const sortButton = document.getElementById('countSortToggle');
        const roundsInfo = document.getElementById('kenoRoundsInfo');
        if (!winningList || !lostList || !numberCountDisplay || !roundsInfo) return;

        winningList.innerHTML = ''; lostList.innerHTML = ''; numberCountDisplay.innerHTML = '';
        roundsInfo.textContent = `Total Rounds Tracked: ${totalRounds}`;

        const currentWinners = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.winning')).map(el => el.textContent);
        const currentLosers = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.lost')).map(el => el.textContent);
        if (currentWinners.length === 0 && currentLosers.length === 0) {
            winningList.textContent = 'No numbers drawn yet.';
            lostList.textContent = 'No numbers drawn yet.';
        } else {
            if (currentWinners.length > 0) {
                currentWinners.sort((a, b) => parseInt(a) - parseInt(b)).forEach(number => { const li = document.createElement('li'); li.textContent = number; li.style.color = '#38b2ac'; winningList.appendChild(li); });
            } else { winningList.textContent = 'No winning numbers.'; }
            if (currentLosers.length > 0) {
                currentLosers.sort((a, b) => parseInt(a) - parseInt(b)).forEach(number => { const li = document.createElement('li'); li.textContent = number; li.style.color = '#e53e3e'; lostList.appendChild(li); });
            } else { lostList.textContent = 'No lost numbers.'; }
        }

        const sortedNumberKeys = Object.keys(numberPickCounts);
        if (countSortOrder === 'byPick') {
            sortedNumberKeys.sort((a, b) => numberPickCounts[b] - numberPickCounts[a]);
            if(sortButton) sortButton.textContent = 'Sort by Pick Count';
        } else {
            sortedNumberKeys.sort((a, b) => parseInt(a) - parseInt(b));
            if(sortButton) sortButton.textContent = 'Sort by #';
        }

        const totalPicks = Object.values(numberPickCounts).reduce((sum, count) => sum + count, 0);
        if (sortedNumberKeys.length > 0) {
            sortedNumberKeys.forEach(number => {
                const span = document.createElement('span');
                const count = numberPickCounts[number];
                let percentageText = '';
                if (totalPicks > 0) {
                    const percentage = (count / totalPicks) * 100;
                    percentageText = ` (${percentage.toFixed(1)}%)`;
                }
                span.textContent = `${number}: ${count}${percentageText}`;
                Object.assign(span.style, { padding: '3px 5px', backgroundColor: '#4a5568', borderRadius: '3px' });
                numberCountDisplay.appendChild(span);
            });
        } else {
            numberCountDisplay.textContent = 'No numbers picked yet';
        }
    }

    function _processKenoRoundResults(winnersSnapshot, losersSnapshot) {
        if (winnersSnapshot.length === 0 && losersSnapshot.length === 0) return;

        let numbersProcessed = false;
        [...winnersSnapshot, ...losersSnapshot].forEach(number => {
            numberPickCounts[number] = (numberPickCounts[number] || 0) + 1;
            numbersProcessed = true;
        });

        if (numbersProcessed) {
            roundsProcessedInSession++;
            totalRounds++;
            localStorage.setItem(LS_KEY_PICK_COUNTS, JSON.stringify(numberPickCounts));
            localStorage.setItem(LS_KEY_TOTAL_ROUNDS, totalRounds);
            updateDisplay();
        }
    }

    const debounce = (func, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func.apply(this, a), delay); }; };
    const processKenoRoundResultsDebounced = debounce(_processKenoRoundResults, 500);

    const observer = new MutationObserver(() => {
        if (roundsToPlay > 0 && roundsProcessedInSession >= roundsToPlay) { return; }
        const currentWinnersSnapshot = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.winning')).map(el => el.textContent);
        const currentLosersSnapshot = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.lost')).map(el => el.textContent);
        if (currentWinnersSnapshot.length > 0 || currentLosersSnapshot.length > 0) {
            processKenoRoundResultsDebounced(currentWinnersSnapshot, currentLosersSnapshot);
        } else {
            updateDisplay();
        }
    });

    function initializeKenoTracker() {
        numberPickCounts = JSON.parse(localStorage.getItem(LS_KEY_PICK_COUNTS)) || {};
        countSortOrder = localStorage.getItem(LS_KEY_SORT_ORDER) || 'byPick';
        totalRounds = parseInt(localStorage.getItem(LS_KEY_TOTAL_ROUNDS)) || 0;

        createUI();
        updateDisplay();
        observer.observe(document.querySelector('#kenoGame #boardContainer'), { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('#playBtn') || e.target.matches('#repeatBtn')) {
                roundsToPlay = parseInt(document.getElementById('roundsAmount').textContent) || 1;
                roundsProcessedInSession = 0;
            } else if (e.target.matches('#clearBtn')) {
                roundsToPlay = 0;
                roundsProcessedInSession = 0;
            }
        });

        const initialWinners = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.winning')).map(el => el.textContent);
        const initialLosers = Array.from(document.querySelectorAll('#kenoGame #boardContainer span.lost')).map(el => el.textContent);
        if (initialWinners.length > 0 || initialLosers.length > 0) {
            roundsToPlay = 1;
            roundsProcessedInSession = 0;
            processKenoRoundResultsDebounced(initialWinners, initialLosers);
        }
    }

    const initInterval = setInterval(() => {
        if (document.querySelector('#kenoGame #boardContainer')) {
            clearInterval(initInterval);
            initializeKenoTracker();
        }
    }, 500);
})();