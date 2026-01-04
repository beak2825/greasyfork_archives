// ==UserScript==
// @name         Albert.io Question Scraper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Scrape Albert.io questions and answer choices, very basic
// @author       You
// @match        https://*.albert.io/*
// @grant        GM_addStyle
// @license     GPL-3.0-or-later
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532458/Albertio%20Question%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/532458/Albertio%20Question%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .albert-dl-btn {
            background-color: #4080BD;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s;
            z-index: 9999;
        }
        .albert-dl-btn:hover {
            background-color: #336699;
        }
        .albert-primary-btn {
            background-color: #4080BD;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            margin: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .albert-primary-btn:hover {
            background-color: #336699;
        }
        .albert-danger-btn {
            background-color: #dc3545;
            color: white;
        }
        .albert-danger-btn:hover {
            background-color: #bd2130;
        }
        .albert-success-btn {
            background-color: #28a745;
            color: white;
        }
        .albert-success-btn:hover {
            background-color: #218838;
        }
        .albert-dl-all-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #4080BD;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .albert-scraper-panel {
            position: fixed;
            top: 50px;
            right: 10px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
            max-width: 400px;
            font-family: Arial, sans-serif;
        }
        .albert-question-count {
            margin-bottom: 10px;
            font-weight: bold;
        }
        .albert-option-row {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        .albert-option-label {
            flex-grow: 1;
            margin-right: 10px;
            font-size: 14px;
        }
        .albert-checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .albert-checkbox {
            margin-right: 8px;
        }
        .albert-progress {
            margin-top: 10px;
            background-color: #f0f0f0;
            border-radius: 4px;
            height: 20px;
            overflow: hidden;
            display: none;
        }
        .albert-progress-bar {
            background-color: #4080BD;
            height: 100%;
            width: 0%;
            transition: width 0.3s;
        }
        .albert-progress-text {
            text-align: center;
            margin-top: 5px;
            font-size: 12px;
        }
        .albert-question-checkbox {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 9999;
        }
        .albert-checkbox-label {
            font-size: 12px;
            cursor: pointer;
        }
        .albert-tab-container {
            margin-bottom: 15px;
        }
        .albert-tab {
            display: inline-block;
            padding: 8px 15px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            cursor: pointer;
        }
        .albert-tab.active {
            background-color: #4080BD;
            color: white;
        }
        .albert-tab-content {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 0 4px 4px 4px;
        }
        .albert-input-group {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .albert-input-label {
            flex-grow: 1;
            margin-right: 10px;
        }
        .albert-input {
            width: 70px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .albert-switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 24px;
        }
        .albert-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .albert-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .albert-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .albert-slider {
            background-color: #4080BD;
        }
        input:checked + .albert-slider:before {
            transform: translateX(21px);
        }
        .albert-status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
        }
        .albert-status-badge.active {
            background-color: #28a745;
            color: white;
        }
        .albert-status-badge.inactive {
            background-color: #dc3545;
            color: white;
        }
        .albert-status-badge.pending {
            background-color: #ffc107;
            color: black;
        }
        .albert-divider {
            margin: 15px 0;
            border-top: 1px solid #eee;
        }
        .albert-section-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .albert-counter {
            font-weight: bold;
            color: #4080BD;
        }
        .albert-textarea {
            width: 100%;
            height: 150px;
            margin-top: 10px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            resize: vertical;
        }
        .albert-button-container {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .albert-debug {
            position: fixed;
            bottom: 10px;
            left: 10px;
            padding: 8px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            font-size: 10px;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

    let foundQuestions = [];
    let selectedQuestions = [];
    let autoNavigationActive = false;
    let autoNavigationDelay = 2000;
    let questionsProcessed = 0;
    let totalQuestionsToProcess = 0;
    let collectedContent = '';
    let currentQuestionNumber = 1;
    let debugMode = false;

    window.addEventListener('load', function() {
        setTimeout(initScraper, 2000);
    });

    function initScraper() {
        console.log('Albert.io Question Scraper is running...');

        findAndProcessQuestions();

        addScanButton();

        observeDOMChanges();
    }

    function findAndProcessQuestions() {

        foundQuestions = [];

        const questions = document.querySelectorAll('.question-wrapper, .question-container, .question');

        if (questions && questions.length > 0) {
            console.log(`Found ${questions.length} question(s) with standard selectors`);
            processQuestions(Array.from(questions));
        } else {
            console.log('No questions found with standard selectors. Trying alternative approach...');
            scanForQuestions();
        }
    }

    function processQuestions(questions) {

        foundQuestions = questions;

        if (questions.length > 0) {
            addScraperPanel(questions);
        }

        questions.forEach((question, index) => {
            addSelectionToQuestion(question, index);
            addDownloadButton(question, index);
        });
    }

    function addSelectionToQuestion(questionElement, index) {

        if (questionElement.querySelector('.albert-question-checkbox')) {
            return;
        }

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'albert-question-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `albert-question-${index}`;
        checkbox.className = 'albert-checkbox';
        checkbox.dataset.index = index;
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (!selectedQuestions.includes(index)) {
                    selectedQuestions.push(index);
                }
            } else {
                const selectedIndex = selectedQuestions.indexOf(index);
                if (selectedIndex > -1) {
                    selectedQuestions.splice(selectedIndex, 1);
                }
            }
            updateSelectedCount();
        });

        const label = document.createElement('label');
        label.className = 'albert-checkbox-label';
        label.htmlFor = `albert-question-${index}`;
        label.textContent = 'Select';

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        const insertTarget = questionElement.querySelector('.question-wrapper__heading') ||
                            questionElement.querySelector('.mcq-option') ||
                            questionElement;

        insertTarget.style.position = 'relative';
        insertTarget.appendChild(checkboxContainer);
    }

    function downloadTextAsFile(filename, text) {
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.href = url;
        element.download = filename;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();

        setTimeout(function() {
            document.body.removeChild(element);
            URL.revokeObjectURL(url);
        }, 100);
    }

    function extractQuestionContent(questionElement = null) {
        let questionText = '';
        let questionTitle = '';
        let questionNumber = currentQuestionNumber;
        let optionsFound = false;

        if (!questionElement) {

            questionElement = document.querySelector('.practice-view__question-area') ||
                             document.querySelector('.question-wrapper') ||
                             document.querySelector('.question-container') ||
                             document.querySelector('.question') ||
                             document.body;
        }

        if (debugMode) {
            logDebug(`Extracting from ${questionElement.className}`);
        }

        const titleElem = document.querySelector('.student-practice-view-toolbar__title');
        if (titleElem) {
            questionTitle = titleElem.textContent.trim();
            questionText += "Title: " + questionTitle + "\n\n";
        }

        const questionNumElem = document.querySelector('[data-testid="question-dropdown-navigator__toggle-button"]');
        if (questionNumElem) {
            const questionNumText = questionNumElem.textContent.trim();
            const match = questionNumText.match(/Question\s+(\d+)/i);
            if (match && match[1]) {
                questionNumber = parseInt(match[1]);
                questionText += "Question " + questionNumber + "\n\n";
            } else {
                questionText += "Question " + questionNumber + "\n\n";
            }
        } else {
            questionText += "Question " + questionNumber + "\n\n";
        }

        const instructions = document.querySelector('.question-wrapper__body, .instructions-pane');
        if (instructions) {
            const markdownContent = instructions.querySelector('.markdown-renderer-v2');
            if (markdownContent) {
                questionText += markdownContent.textContent.trim() + "\n\n";
            } else {
                questionText += instructions.textContent.trim() + "\n\n";
            }
        }

        let options = document.querySelectorAll('.mcq-option-eliminator');
        if (options && options.length > 0) {
            questionText += "Options:\n";
            optionsFound = true;

            options.forEach((option) => {
                const letterElement = option.querySelector('.mcq-option__letter');
                const contentElement = option.querySelector('.mcq-option__content');

                if (letterElement && contentElement) {
                    const letter = letterElement.textContent.trim();
                    const content = contentElement.textContent.trim();
                    questionText += letter + ") " + content + "\n";
                }
            });

            questionText += "\n";

            if (debugMode) {
                logDebug(`Found ${options.length} options with method 1`);
            }
        }

        if (!optionsFound) {
            options = document.querySelectorAll('.mcq-option-accessible-wrapper');
            if (options && options.length > 0) {
                questionText += "Options:\n";
                optionsFound = true;

                options.forEach((option) => {
                    const letterElement = option.querySelector('.mcq-option__letter');
                    const contentElement = option.querySelector('.mcq-option__content');

                    if (letterElement && contentElement) {
                        const letter = letterElement.textContent.trim();
                        const content = contentElement.textContent.trim();
                        questionText += letter + ") " + content + "\n";
                    }
                });

                questionText += "\n";

                if (debugMode) {
                    logDebug(`Found ${options.length} options with method 2`);
                }
            }
        }

        if (!optionsFound) {
            options = document.querySelectorAll('label[for^="input-"]');
            if (options && options.length > 0) {
                questionText += "Options:\n";
                optionsFound = true;

                options.forEach((option, index) => {
                    const letterElement = option.querySelector('.mcq-option__letter');
                    const contentElement = option.querySelector('.mcq-option__content');

                    const letter = letterElement ? letterElement.textContent.trim() : String.fromCharCode(65 + index);

                    const content = contentElement
                        ? contentElement.textContent.trim()
                        : option.textContent.replace(letter, '').trim();

                    questionText += letter + ") " + content + "\n";
                });

                questionText += "\n";

                if (debugMode) {
                    logDebug(`Found ${options.length} options with method 3`);
                }
            }
        }

        if (!optionsFound) {
            const selector = '[class*="option" i]:not(.albert-option-row):not(.albert-option-label)';
            options = document.querySelectorAll(selector);
            if (options && options.length > 0) {
                questionText += "Options:\n";
                optionsFound = true;

                options.forEach((option, index) => {

                    const letter = String.fromCharCode(65 + index);

                    let content = option.textContent.trim();

                    content = content.replace(/^[A-E][)\]]?\s*/, '');

                    questionText += letter + ") " + content + "\n";
                });

                questionText += "\n";

                if (debugMode) {
                    logDebug(`Found ${options.length} options with method 4`);
                }
            }
        }

        if (debugMode) {
            logDebug(`Options found: ${optionsFound}`);
        }

        const explanation = document.querySelector('.explanation-content, .explanation');
        if (explanation) {
            questionText += "Explanation:\n" + explanation.textContent.trim() + "\n";
        }

        const tables = document.querySelectorAll('table');
        if (tables && tables.length > 0) {
            tables.forEach((table, idx) => {
                questionText += `\nTable ${idx + 1}:\n`;

                const headers = table.querySelectorAll('th');
                if (headers.length > 0) {
                    const headerRow = Array.from(headers).map(th => th.textContent.trim());
                    questionText += headerRow.join(' | ') + '\n';
                    questionText += '-'.repeat(headerRow.join(' | ').length) + '\n';
                }

                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {

                    if (row.querySelector('th')) return;

                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        questionText += Array.from(cells).map(td => td.textContent.trim()).join(' | ') + '\n';
                    }
                });

                questionText += '\n';
            });
        }

        return {
            text: questionText,
            number: questionNumber,
            optionsFound: optionsFound
        };
    }

    function addDownloadButton(questionElement, index) {

        if (questionElement.querySelector('.albert-dl-btn')) {
            return;
        }

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'albert-dl-btn';
        downloadBtn.innerText = 'Save as TXT';
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            downloadCurrentQuestion(questionElement);
        });

        const insertTarget = questionElement.querySelector('.question-wrapper__heading') ||
                             questionElement.querySelector('.mcq-option') ||
                             questionElement;

        insertTarget.style.position = 'relative';
        insertTarget.appendChild(downloadBtn);
    }

    function downloadCurrentQuestion(questionElement) {
        const extract = extractQuestionContent(questionElement);
        const content = extract.text;
        let filename = `albert_question_${extract.number}.txt`;

        const contentLines = content.split('\n');
        if (contentLines.length > 0 && contentLines[0].startsWith('Title:')) {
            const title = contentLines[0].replace('Title:', '').trim();
            filename = `albert_${title.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_q${extract.number}.txt`;
        }

        if (content.trim() !== '') {
            downloadTextAsFile(filename, content);

            if (autoNavigationActive) {
                questionsProcessed++;
                updateAutoNavigationStatus();
            }
        } else {
            alert('Could not extract question content. Please try using the "Scan for Questions" button.');
        }
    }

    function addScraperPanel(questions) {

        if (document.querySelector('.albert-scraper-panel')) {
            updateScraperPanel(questions);
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'albert-scraper-panel';

        const tabContainer = document.createElement('div');
        tabContainer.className = 'albert-tab-container';

        const autoNavTab = document.createElement('div');
        autoNavTab.className = 'albert-tab active';
        autoNavTab.textContent = 'Auto Collector';
        autoNavTab.dataset.tab = 'autonav';

        const manualTab = document.createElement('div');
        manualTab.className = 'albert-tab';
        manualTab.textContent = 'Manual Selection';
        manualTab.dataset.tab = 'manual';

        tabContainer.appendChild(autoNavTab);
        tabContainer.appendChild(manualTab);
        panel.appendChild(tabContainer);

        const tabContent = document.createElement('div');
        tabContent.className = 'albert-tab-content';
        panel.appendChild(tabContent);

        const autoNavContent = document.createElement('div');
        autoNavContent.id = 'albert-autonav-tab';

        const autoNavDescription = document.createElement('p');
        autoNavDescription.innerText = 'Automatically navigate through all questions, collecting them into a single file.';
        autoNavContent.appendChild(autoNavDescription);

        const delayGroup = document.createElement('div');
        delayGroup.className = 'albert-input-group';

        const delayLabel = document.createElement('label');
        delayLabel.className = 'albert-input-label';
        delayLabel.innerText = 'Delay between questions (ms)';

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.min = '1000';
        delayInput.max = '10000';
        delayInput.step = '500';
        delayInput.value = autoNavigationDelay;
        delayInput.className = 'albert-input';
        delayInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value >= 1000 && value <= 10000) {
                autoNavigationDelay = value;
            } else {
                this.value = autoNavigationDelay;
                alert('Please enter a value between 1000 and 10000 milliseconds');
            }
        });

        delayGroup.appendChild(delayLabel);
        delayGroup.appendChild(delayInput);

        autoNavContent.appendChild(delayGroup);

        const debugGroup = document.createElement('div');
        debugGroup.className = 'albert-input-group';

        const debugLabel = document.createElement('label');
        debugLabel.className = 'albert-input-label';
        debugLabel.innerText = 'Debug Mode';

        const debugSwitch = document.createElement('label');
        debugSwitch.className = 'albert-switch';

        const debugCheckbox = document.createElement('input');
        debugCheckbox.type = 'checkbox';
        debugCheckbox.checked = debugMode;
        debugCheckbox.addEventListener('change', function() {
            debugMode = this.checked;
            if (debugMode) {
                addDebugPanel();
            } else {
                removeDebugPanel();
            }
        });

        const debugSlider = document.createElement('span');
        debugSlider.className = 'albert-slider';

        debugSwitch.appendChild(debugCheckbox);
        debugSwitch.appendChild(debugSlider);

        debugGroup.appendChild(debugLabel);
        debugGroup.appendChild(debugSwitch);

        autoNavContent.appendChild(debugGroup);

        const statusGroup = document.createElement('div');
        statusGroup.className = 'albert-input-group';

        const statusLabel = document.createElement('label');
        statusLabel.className = 'albert-input-label';
        statusLabel.innerText = 'Auto-Collection Status';

        const statusBadge = document.createElement('span');
        statusBadge.className = 'albert-status-badge inactive';
        statusBadge.id = 'albert-autonav-status';
        statusBadge.innerText = 'Inactive';

        statusGroup.appendChild(statusLabel);
        statusGroup.appendChild(statusBadge);

        autoNavContent.appendChild(statusGroup);

        const counterGroup = document.createElement('div');
        counterGroup.className = 'albert-input-group';

        const counterLabel = document.createElement('label');
        counterLabel.className = 'albert-input-label';
        counterLabel.innerText = 'Questions Collected';

        const counterValue = document.createElement('span');
        counterValue.className = 'albert-counter';
        counterValue.id = 'albert-questions-processed';
        counterValue.innerText = '0';

        counterGroup.appendChild(counterLabel);
        counterGroup.appendChild(counterValue);

        autoNavContent.appendChild(counterGroup);

        const divider = document.createElement('div');
        divider.className = 'albert-divider';
        autoNavContent.appendChild(divider);

        const textareaLabel = document.createElement('div');
        textareaLabel.className = 'albert-section-title';
        textareaLabel.innerText = 'Collected Content';
        autoNavContent.appendChild(textareaLabel);

        const contentTextarea = document.createElement('textarea');
        contentTextarea.className = 'albert-textarea';
        contentTextarea.id = 'albert-collected-content';
        contentTextarea.readOnly = true;
        contentTextarea.placeholder = 'Collected question content will appear here...';
        contentTextarea.value = collectedContent;
        autoNavContent.appendChild(contentTextarea);

        const downloadCollectedBtn = document.createElement('button');
        downloadCollectedBtn.className = 'albert-primary-btn';
        downloadCollectedBtn.innerText = 'Download Collected Content';
        downloadCollectedBtn.id = 'albert-download-collected';
        downloadCollectedBtn.addEventListener('click', function() {
            downloadCollectedContent();
        });
        downloadCollectedBtn.style.width = '100%';
        downloadCollectedBtn.style.marginTop = '10px';

        autoNavContent.appendChild(downloadCollectedBtn);

        const navBtnGroup = document.createElement('div');
        navBtnGroup.className = 'albert-button-container';

        const startNavBtn = document.createElement('button');
        startNavBtn.className = 'albert-primary-btn albert-success-btn';
        startNavBtn.innerText = 'Start Auto-Collection';
        startNavBtn.id = 'albert-start-autonav';
        startNavBtn.addEventListener('click', function() {
            startAutoNavigation();
        });

        const stopNavBtn = document.createElement('button');
        stopNavBtn.className = 'albert-primary-btn albert-danger-btn';
        stopNavBtn.innerText = 'Stop';
        stopNavBtn.id = 'albert-stop-autonav';
        stopNavBtn.style.display = 'none';
        stopNavBtn.addEventListener('click', function() {
            stopAutoNavigation();
        });

        navBtnGroup.appendChild(startNavBtn);
        navBtnGroup.appendChild(stopNavBtn);

        autoNavContent.appendChild(navBtnGroup);

        tabContent.appendChild(autoNavContent);

        const manualContent = document.createElement('div');
        manualContent.id = 'albert-manual-tab';
        manualContent.style.display = 'none';

        const countDisplay = document.createElement('div');
        countDisplay.className = 'albert-question-count';
        countDisplay.innerText = `Found ${questions.length} question(s)`;
        countDisplay.id = 'albert-question-count';
        manualContent.appendChild(countDisplay);

        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'albert-question-count';
        selectedDisplay.style.fontSize = '12px';
        selectedDisplay.innerText = `Selected: 0 question(s)`;
        selectedDisplay.id = 'albert-selected-count';
        manualContent.appendChild(selectedDisplay);

        const selectionOptions = document.createElement('div');
        selectionOptions.className = 'albert-option-row';

        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'albert-dl-btn';
        selectAllBtn.innerText = 'Select All';
        selectAllBtn.addEventListener('click', function() {
            selectedQuestions = [];
            for (let i = 0; i < questions.length; i++) {
                selectedQuestions.push(i);
                const checkbox = document.getElementById(`albert-question-${i}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
            updateSelectedCount();
        });

        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.className = 'albert-dl-btn';
        deselectAllBtn.innerText = 'Deselect All';
        deselectAllBtn.addEventListener('click', function() {
            selectedQuestions = [];
            for (let i = 0; i < questions.length; i++) {
                const checkbox = document.getElementById(`albert-question-${i}`);
                if (checkbox) {
                    checkbox.checked = false;
                }
            }
            updateSelectedCount();
        });

        selectionOptions.appendChild(selectAllBtn);
        selectionOptions.appendChild(deselectAllBtn);
        manualContent.appendChild(selectionOptions);

        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'albert-dl-btn';
        downloadAllBtn.style.width = '100%';
        downloadAllBtn.style.marginTop = '10px';
        downloadAllBtn.innerText = 'Download All as One File';
        downloadAllBtn.addEventListener('click', function() {
            downloadAllQuestionsAsOne(questions);
        });

        manualContent.appendChild(downloadAllBtn);

        const downloadSelectedBtn = document.createElement('button');
        downloadSelectedBtn.className = 'albert-dl-btn';
        downloadSelectedBtn.style.width = '100%';
        downloadSelectedBtn.style.marginTop = '10px';
        downloadSelectedBtn.innerText = 'Download Selected as One File';
        downloadSelectedBtn.addEventListener('click', function() {
            if (selectedQuestions.length === 0) {
                alert('Please select at least one question to download.');
                return;
            }
            downloadSelectedQuestionsAsOne(questions);
        });

        manualContent.appendChild(downloadSelectedBtn);

        tabContent.appendChild(manualContent);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'albert-dl-btn';
        closeBtn.innerText = 'Close';
        closeBtn.style.marginTop = '15px';
        closeBtn.addEventListener('click', function() {
            panel.style.display = 'none';
            toggleButton.style.display = 'block';
        });
        tabContent.appendChild(closeBtn);

        document.body.appendChild(panel);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'albert-dl-all-btn';
        toggleButton.innerText = 'Albert.io Scraper';
        toggleButton.addEventListener('click', function() {
            panel.style.display = 'block';
            toggleButton.style.display = 'none';
        });

        document.body.appendChild(toggleButton);

        autoNavTab.addEventListener('click', function() {
            setActiveTab('autonav');
        });

        manualTab.addEventListener('click', function() {
            setActiveTab('manual');
        });
    }

    function addDebugPanel() {
        if (document.getElementById('albert-debug-panel')) {
            return;
        }

        const debugPanel = document.createElement('div');
        debugPanel.id = 'albert-debug-panel';
        debugPanel.className = 'albert-debug';
        debugPanel.textContent = 'Debug mode active';
        document.body.appendChild(debugPanel);
    }

    function removeDebugPanel() {
        const debugPanel = document.getElementById('albert-debug-panel');
        if (debugPanel) {
            debugPanel.remove();
        }
    }

    function logDebug(message) {
        console.log('[Albert.io Scraper] ' + message);

        const debugPanel = document.getElementById('albert-debug-panel');
        if (debugPanel) {
            debugPanel.textContent = message;
        }
    }

    function startAutoNavigation() {
        if (autoNavigationActive) {
            return;
        }

        questionsProcessed = 0;
        collectedContent = '';

        const contentTextarea = document.getElementById('albert-collected-content');
        if (contentTextarea) {
            contentTextarea.value = '';
        }

        const questionNavbar = document.querySelector('[data-testid="question-dropdown-navigator__toggle-button"]');
        if (questionNavbar) {
            const navbarText = questionNavbar.textContent.trim();
            const match = navbarText.match(/Question\s+\d+\s+\/\s+(\d+)/i);
            if (match && match[1]) {
                totalQuestionsToProcess = parseInt(match[1]);
            }
        }

        if (!totalQuestionsToProcess) {
            totalQuestionsToProcess = 100;
        }

        document.getElementById('albert-autonav-status').innerText = 'Active';
        document.getElementById('albert-autonav-status').className = 'albert-status-badge active';
        document.getElementById('albert-start-autonav').style.display = 'none';
        document.getElementById('albert-stop-autonav').style.display = 'block';

        autoNavigationActive = true;

        processCurrentQuestion();
    }

    function stopAutoNavigation() {
        autoNavigationActive = false;

        document.getElementById('albert-autonav-status').innerText = 'Stopped';
        document.getElementById('albert-autonav-status').className = 'albert-status-badge inactive';
        document.getElementById('albert-start-autonav').style.display = 'block';
        document.getElementById('albert-stop-autonav').style.display = 'none';
    }

    function processCurrentQuestion() {
        if (!autoNavigationActive) {
            return;
        }

        setTimeout(() => {

            const extract = extractQuestionContent();

            if (extract.text.trim() !== '') {

                collectedContent += `==================== QUESTION ${extract.number} ====================\n\n`;
                collectedContent += extract.text;
                collectedContent += '\n\n';

                const contentTextarea = document.getElementById('albert-collected-content');
                if (contentTextarea) {
                    contentTextarea.value = collectedContent;
                    contentTextarea.scrollTop = contentTextarea.scrollHeight;
                }

                questionsProcessed++;
                updateAutoNavigationStatus();

                if (debugMode) {
                    logDebug(`Question ${extract.number}: Options found = ${extract.optionsFound}`);
                }
            } else {
                if (debugMode) {
                    logDebug('No content extracted for current question');
                }
            }

            setTimeout(navigateToNextQuestion, autoNavigationDelay);
        }, 1000);
    }

    function navigateToNextQuestion() {
        if (!autoNavigationActive) {
            return;
        }

        const nextButton = document.querySelector('[data-testid="question-dropdown-navigator__next-button"]');

        if (nextButton && !nextButton.disabled) {

            nextButton.click();

            setTimeout(processCurrentQuestion, 1000);
        } else {

            console.log('Reached the end of the questions');
            stopAutoNavigation();
            alert(`Auto-collection complete! Collected ${questionsProcessed} questions. You can now download the content.`);
        }
    }

    function downloadCollectedContent() {
        if (collectedContent.trim() === '') {
            alert('No content has been collected yet. Please start auto-collection first.');
            return;
        }

        let assignmentName = document.querySelector('.student-practice-view-toolbar__title')?.textContent.trim() || 'questions';
        assignmentName = assignmentName.substring(0, 30).replace(/[^a-z0-9]/gi, '_');

        const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);

        downloadTextAsFile(`albert_${assignmentName}_all_${questionsProcessed}_questions_${timeStamp}.txt`, collectedContent);
    }

    function updateAutoNavigationStatus() {
        const counterElement = document.getElementById('albert-questions-processed');
        if (counterElement) {
            counterElement.innerText = `${questionsProcessed} / ${totalQuestionsToProcess}`;
        }
    }

    function updateScraperPanel(questions) {

        const countDisplay = document.getElementById('albert-question-count');
        if (countDisplay) {
            countDisplay.innerText = `Found ${questions.length} question(s)`;
        }

        const contentTextarea = document.getElementById('albert-collected-content');
        if (contentTextarea) {
            contentTextarea.value = collectedContent;
        }

        updateSelectedCount();
    }

    function setActiveTab(tabName) {

        const tabs = document.querySelectorAll('.albert-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        const autoNavContent = document.getElementById('albert-autonav-tab');
        const manualContent = document.getElementById('albert-manual-tab');

        autoNavContent.style.display = tabName === 'autonav' ? 'block' : 'none';
        manualContent.style.display = tabName === 'manual' ? 'block' : 'none';
    }

    function updateSelectedCount() {
        const selectedDisplay = document.getElementById('albert-selected-count');
        if (selectedDisplay) {
            selectedDisplay.innerText = `Selected: ${selectedQuestions.length} question(s)`;
        }
    }

    function downloadAllQuestionsAsOne(questions) {
        let allContent = '';
        let validQuestions = 0;

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const extract = extractQuestionContent(question);

            if (extract.text.trim() !== '') {
                validQuestions++;
                allContent += `==================== QUESTION ${extract.number} ====================\n\n`;
                allContent += extract.text;
                allContent += '\n\n';
            }
        }

        if (allContent.trim() !== '') {

            let assignmentName = document.querySelector('.student-practice-view-toolbar__title')?.textContent.trim() || 'questions';
            assignmentName = assignmentName.substring(0, 30).replace(/[^a-z0-9]/gi, '_');

            const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);

            downloadTextAsFile(`albert_${assignmentName}_all_${validQuestions}_questions_${timeStamp}.txt`, allContent);
        } else {
            alert('Could not extract any question content.');
        }
    }

    function downloadSelectedQuestionsAsOne(questions) {
        if (selectedQuestions.length === 0) {
            alert('Please select at least one question to download.');
            return;
        }

        let allContent = '';
        let validQuestions = 0;

        for (const index of selectedQuestions) {
            if (index >= 0 && index < questions.length) {
                const question = questions[index];
                const extract = extractQuestionContent(question);

                if (extract.text.trim() !== '') {
                    validQuestions++;
                    allContent += `==================== QUESTION ${extract.number} ====================\n\n`;
                    allContent += extract.text;
                    allContent += '\n\n';
                }
            }
        }

        if (allContent.trim() !== '') {

            let assignmentName = document.querySelector('.student-practice-view-toolbar__title')?.textContent.trim() || 'questions';
            assignmentName = assignmentName.substring(0, 30).replace(/[^a-z0-9]/gi, '_');

            const timeStamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);

            downloadTextAsFile(`albert_${assignmentName}_selected_${validQuestions}_questions_${timeStamp}.txt`, allContent);
        } else {
            alert('Could not extract any question content from selected questions.');
        }
    }

    function scanForQuestions() {

        const potentialQuestions = [];

        const albertElements = document.querySelectorAll('.markdown-renderer-v2, .question-statement, .mcq-option');
        if (albertElements.length > 0) {

            let commonParents = [];
            albertElements.forEach(el => {

                let parent = el;
                for (let i = 0; i < 3; i++) {
                    if (parent.parentElement) parent = parent.parentElement;
                }
                if (parent && !commonParents.includes(parent)) {
                    commonParents.push(parent);
                }
            });

            commonParents.forEach(parent => {
                if (!potentialQuestions.includes(parent)) {
                    potentialQuestions.push(parent);
                }
            });
        }

        const allElements = document.querySelectorAll('div:not([class*="albert-"]), section, article');
        allElements.forEach(element => {
            const text = element.innerText;

            if (
                (text.includes('Question') && text.length > 100) ||
                /[A-E]\)\s/.test(text) ||
                (element.querySelector('table') && text.includes('Instructions')) ||
                (text.match(/p-value|t-test|confidence interval/i) && text.length > 200)
            ) {

                let isContained = false;
                for (const potentialQuestion of potentialQuestions) {
                    if (potentialQuestion.contains(element) && potentialQuestion !== element) {
                        isContained = true;
                        break;
                    }
                }

                if (!isContained && element.offsetHeight > 100) {
                    potentialQuestions.push(element);
                }
            }
        });

        if (potentialQuestions.length > 0) {
            console.log(`Found ${potentialQuestions.length} potential question elements`);
            processQuestions(potentialQuestions);
        } else {
            console.log('No potential questions found');

            const message = document.createElement('div');
            message.style.position = 'fixed';
            message.style.top = '10px';
            message.style.left = '10px';
            message.style.padding = '10px';
            message.style.backgroundColor = '#f8d7da';
            message.style.color = '#721c24';
            message.style.borderRadius = '4px';
            message.style.zIndex = '9999';
            message.innerHTML = 'No questions detected. Try using the "Scan for Questions" button manually.';
            document.body.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 5000);
        }
    }

    function addScanButton() {
        const scanBtn = document.createElement('button');
        scanBtn.className = 'albert-dl-btn';
        scanBtn.innerText = 'Scan for Questions';
        scanBtn.style.position = 'fixed';
        scanBtn.style.bottom = '10px';
        scanBtn.style.left = '10px';
        scanBtn.style.zIndex = '9999';
        scanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scanForQuestions();
        });
        document.body.appendChild(scanBtn);
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldRescan = false;

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {

                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1) {
                            if (
                                (node.classList && (
                                    node.classList.contains('question-wrapper') ||
                                    node.classList.contains('question-container') ||
                                    node.classList.contains('question')
                                )) ||
                                node.querySelector('.question-wrapper, .question-container, .question, .mcq-option')
                            ) {
                                shouldRescan = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldRescan) {
                console.log('New question content detected, rescanning...');

                setTimeout(findAndProcessQuestions, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();