// ==UserScript==
// @name         A-Peeling PPM Autograph Collector
// @namespace    https://popmundo.com/
// @version      1.0
// @description  Automatic Autograph Collector for PPM
// @author       Jeff Banana - 3547322
// @license      GNU GPLv3
// @icon         https://cdn.discordapp.com/avatars/1355319704763236474/78008f5cf0ec6c2eead2d11a3ee831a1.webp
// @match        https://*.popmundo.com/World/Popmundo.aspx/City/PeopleOnline/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/538606/A-Peeling%20PPM%20Autograph%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/538606/A-Peeling%20PPM%20Autograph%20Collector.meta.js
// ==/UserScript==

/* global $, jQuery */
/* eslint no-undef: "off" */

(function() {
    'use strict';

    // CONFIGURATION
    let MAX_BOOKS = GM_getValue('MAX_BOOKS', 1);
    let DELAY_MINUTES = GM_getValue('DELAY_MINUTES', 6);
    const STEP_DELAY = 2000;
    const PAGE_LOAD_TIMEOUT = 10000;
    const FORM_SUBMIT_WAIT = 3000; // Wait time after form submission

    // STATE
    let isRunning = false;
    let booksUsed = 0;
    let bookCooldowns = GM_getValue('bookCooldowns', {});
    let currentPosition = GM_getValue('currentPosition', 0);
    let isInCooldown = false;
    let currentTarget = "None";

    // UI CSS
    GM_addStyle(`
        #autograph-collector-ui {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            width: 400px;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow: auto;
            font-size: 14px;
        }
        #autograph-collector-ui h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #FFD700;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            font-size: 18px;
        }
        .status-container {
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
            background: #f8f8f8;
            border: 1px solid #eee;
        }
        .button-container {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }
        .collector-btn {
            flex: 1;
            padding: 10px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        #start-btn { background: #4CAF50; }
        #stop-btn { background: #f44336; }
        #config-btn { background: #2196F3; }
        .counter {
            font-weight: bold;
            margin-bottom: 8px;
        }
        .log-container {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 8px;
            background: #fafafa;
        }
        .log-entry {
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px dotted #eee;
            font-size: 13px;
        }
        .cooldown-active {
            background: #FFC107 !important;
            color: #333 !important;
        }
        .config-panel {
            margin-top: 10px;
            padding: 10px;
            background: #f0f8ff;
            border: 1px dashed #b3d9ff;
            border-radius: 4px;
        }
        .instructions {
            margin-top: 15px;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    `);

    // HELPER FUNCTIONS ===================================================
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const createHiddenIframe = (path, timeout = PAGE_LOAD_TIMEOUT) => {
        return new Promise(resolve => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://${window.location.hostname}${path}`;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const timer = setTimeout(() => {
                iframe.onload = null;
                resolve(iframe);
            }, timeout);

            iframe.onload = () => {
                clearTimeout(timer);
                resolve(iframe);
            };
        });
    };

    const getPeopleFromPage = () => {
        const people = [];
        $('#tablepeople tbody tr:not(.empty-row)').each(function() {
            const $row = $(this);
            const $link = $row.find('td:first-child a');
            const status = $row.find('td:nth-child(2)').text().trim();

            if (status.includes("Travelling") || status.includes("Airborne") || !$link.length) return;

            people.push({
                name: $link.text().trim(),
                id: $link.attr('href').split('/').pop(),
                status: status
            });
        });
        return people;
    };

    // UI FUNCTIONS ======================================================
    function updateButton(text, isDisabled) {
        const btn = $('#start-btn');
        btn.text(text);
        btn.prop('disabled', isDisabled);
        btn.css('background', isInCooldown ? '#FFC107' : (isDisabled ? '#ccc' : '#4CAF50'));
    }

    function updateBooksCounter() {
        $('#books-counter').text(`${booksUsed}/${MAX_BOOKS} books used`);
    }

    function updateTargetDisplay() {
        $('#target-display').text(`Processing: ${currentTarget}`);
        GM_setValue('currentPosition', currentPosition);
    }

    function addToLog(message, type) {
        const colors = {
            green: '#2e7d32',
            red: '#c62828',
            orange: '#f57f17',
            blue: '#0d47a1'
        };

        const timestamp = new Date().toLocaleTimeString();
        const entry = $(`<div class="log-entry" style="color: ${colors[type] || '#333'}">
            [${timestamp}] ${message}
        </div>`);

        $('#autograph-log').prepend(entry);
    }

    function createUI() {
        const uiHTML = `
            <div id="autograph-collector-ui">
                <h3>A-Peeling Autograph Collector</h3>
                <div class="status-container">
                    <div class="counter" id="books-counter">0/${MAX_BOOKS} books used</div>
                    <div class="counter" id="target-display">Processing: None</div>
                    <div id="status-message">Ready to start</div>
                </div>
                <div class="button-container">
                    <button id="start-btn" class="collector-btn">Start Collection</button>
                    <button id="stop-btn" class="collector-btn">Stop</button>
                    <button id="config-btn" class="collector-btn">Config</button>
                </div>
                <div class="config-panel" id="config-panel" style="display:none;">
                    <div>
                        <label>Max Books:
                            <input type="number" id="max-books" min="1" max="20" value="${MAX_BOOKS}">
                        </label>
                    </div>
                    <div>
                        <label>Cooldown (min):
                            <input type="number" id="cooldown-minutes" min="1" max="60" value="${DELAY_MINUTES}">
                        </label>
                    </div>
                    <div class="button-container">
                        <button id="save-config">Save</button>
                        <button id="reset-cooldowns">Reset Books</button>
                        <button id="reset-position">Reset Position</button>
                        <button id="clear-log">Clear Log</button>
                    </div>
                </div>
                <div class="log-container">
                    <div id="autograph-log"></div>
                </div>
                <div class="instructions">
                    <strong>Instructions:</strong>
                    <ol>
                        <li>Make sure to check the CONFIG button before starting.</li>
                        <li>Closing or refreshing this page will interrupt collection.</li>
                        <li>A few might fail, but just let it run through the list twice.</li>
                        <li>ONLY WORKS IF YOUR PPM IS IN UK ENGLISH. For now.</li>
                    </ol>
                </div>
            </div>
        `;
        $('body').append(uiHTML);

        // Event handlers
        $('#start-btn').click(startCollection);
        $('#stop-btn').click(stopCollection);
        $('#config-btn').click(() => $('#config-panel').toggle());

        $('#save-config').click(() => {
            const maxBooksVal = parseInt($('#max-books').val());
            const cooldownVal = parseInt($('#cooldown-minutes').val());

            MAX_BOOKS = isNaN(maxBooksVal) ? 3 : Math.max(1, maxBooksVal);
            DELAY_MINUTES = isNaN(cooldownVal) ? 6 : Math.max(1, cooldownVal);

            GM_setValue('MAX_BOOKS', MAX_BOOKS);
            GM_setValue('DELAY_MINUTES', DELAY_MINUTES);
            updateBooksCounter();
            addToLog('Configuration saved', 'green');
        });

        $('#reset-cooldowns').click(() => {
            bookCooldowns = {};
            GM_setValue('bookCooldowns', {});
            addToLog('Book cooldowns reset', 'green');
        });

        $('#reset-position').click(() => {
            currentPosition = 0;
            GM_setValue('currentPosition', 0);
            currentTarget = "None";
            updateTargetDisplay();
            addToLog('Position reset', 'green');
        });

        $('#clear-log').click(() => {
            $('#autograph-log').empty();
            addToLog('Log cleared', 'green');
        });
    }

    // CORE FUNCTIONALITY ================================================
    function stopCollection() {
        isRunning = false;
        isInCooldown = false;
        currentTarget = "None";
        updateTargetDisplay();
        updateButton('Start Collection', false);
        addToLog('Collection stopped', 'orange');
    }

    async function startCollection() {
        if (isRunning) return;
        isRunning = true;
        updateButton('Working...', true);
        addToLog('Starting collection', 'blue');

        try {
            while (isRunning) {
                const people = getPeopleFromPage();
                if (people.length === 0) {
                    addToLog('No characters found', 'orange');
                    await sleep(5000);
                    continue;
                }

                if (currentPosition >= people.length) {
                    currentPosition = 0;
                }

                let processed = 0;
                let hadSuccessfulCollection = false;
                let shouldStartCooldown = false;

                while (currentPosition < people.length && isRunning && !shouldStartCooldown) {
                    currentTarget = people[currentPosition].name;
                    updateTargetDisplay();

                    const result = await processPerson(people[currentPosition]);
                    await sleep(STEP_DELAY);

                    if (result.success) {
                        hadSuccessfulCollection = true;
                        currentPosition++; // Always move to next person after successful collection
                    } else {
                        if (result.noBooksAvailable) {
                            shouldStartCooldown = true;
                            booksUsed = MAX_BOOKS; // Force cooldown
                        } else {
                            currentPosition++; // Move to next person on failure
                        }
                    }

                    processed++;
                    if (booksUsed >= MAX_BOOKS) break;
                }

                if (booksUsed >= MAX_BOOKS || shouldStartCooldown) {
                    isInCooldown = true;
                    updateButton(`Cooldown: ${DELAY_MINUTES}m`, true);
                    addToLog(`Cooldown started for ${DELAY_MINUTES} minutes`, 'green');

                    const cooldownEnd = Date.now() + DELAY_MINUTES * 60000;
                    while (Date.now() < cooldownEnd && isRunning) {
                        const remaining = Math.ceil((cooldownEnd - Date.now()) / 60000);
                        updateButton(`Cooldown: ${remaining}m`, true);
                        await sleep(10000);
                    }

                    if (isRunning) {
                        booksUsed = 0;
                        isInCooldown = false;
                        updateBooksCounter();
                        addToLog('Cooldown complete', 'green');
                    }
                } else if (isRunning) {
                    addToLog('Finished list', 'green');
                    if (!hadSuccessfulCollection) {
                        currentPosition = 0;
                        currentTarget = "None";
                        updateTargetDisplay();
                    }
                    await sleep(5000);
                }
            }
        } catch (error) {
            addToLog(`System error: ${error.message}`, 'red');
        } finally {
            if (!isInCooldown) {
                stopCollection();
            }
        }
    }

    async function processPerson(person) {
        const charName = person.name;
        let success = false;
        let noBooksAvailable = false;

        try {
            // Step 1: Load character page
            const charIframe = await createHiddenIframe(`/World/Popmundo.aspx/Character/${person.id}`);
            const charDoc = charIframe.contentDocument || charIframe.contentWindow.document;
            const charText = charDoc.body.textContent || "";

            // Check for valid states
            if (charText.includes("Travelling") || charText.includes("Airborne")) {
                addToLog(`Skipping ${charName} (travelling/airborne)`, 'orange');
                return { success: false, noBooksAvailable: false };
            }

            // Step 2: Find interaction link
            const $charDoc = $(charDoc);
            let interactLink = $charDoc.find('#ctl00_cphRightColumn_ctl00_lnkInteract').attr('href');

            if (!interactLink) {
                interactLink = $charDoc.find('a:contains("Interact"), a:contains("Interagir")').first().attr('href');
            }

            if (!interactLink) {
                addToLog(`Skipping ${charName} (no interact link)`, 'orange');
                return { success: false, noBooksAvailable: false };
            }

            // Step 3: Load interaction page
            charIframe.src = interactLink;
            await new Promise(resolve => {
                charIframe.onload = resolve;
                setTimeout(resolve, PAGE_LOAD_TIMEOUT);
            });

            const interactDoc = charIframe.contentDocument || charIframe.contentWindow.document;
            const interactText = interactDoc.body.textContent || "";
            const $interactDoc = $(interactDoc);

            // Step 4: Check for valid interaction states
            if (interactText.includes("Locked")) {
                addToLog(`Skipping ${charName} (locked house)`, 'red');
                return { success: false, noBooksAvailable: false };
            }

            if (interactText.includes("has blocked you from using items")) {
                addToLog(`Skipping ${charName} (items blocked)`, 'orange');
                return { success: false, noBooksAvailable: false };
            }

            // Step 5: Find form elements
            const $select = $interactDoc.find('#ctl00_cphTopColumn_ctl00_ddlUseItem');
            const $submitBtn = $interactDoc.find('#ctl00_cphTopColumn_ctl00_btnUseItem');

            if (!$select.length || !$submitBtn.length) {
                if (interactText.includes("blocked you from using items")) {
                    addToLog(`Skipping ${charName} (items blocked)`, 'orange');
                } else {
                    addToLog(`Skipping ${charName} (form missing)`, 'orange');
                }
                return { success: false, noBooksAvailable: false };
            }

            // Step 6: Collect ALL autograph books
            const usableBooks = [];
            $select.find('option').each(function() {
                const text = $(this).text().trim();
                const id = $(this).val();

                if (text && id && id !== '') {
                    console.log(`Book option found: "${text}" (ID: ${id})`);
                }

                if (text.toLowerCase().includes('autograph book')) {
                    const lastUsed = bookCooldowns[id] || 0;
                    const cooldownPeriod = 300000; // 5 minutes

                    if (Date.now() - lastUsed > cooldownPeriod) {
                        usableBooks.push({ id, text });
                        console.log(`Usable book added: "${text}" (ID: ${id})`);
                    } else {
                        const remainingTime = Math.ceil((cooldownPeriod - (Date.now() - lastUsed)) / 60000);
                        console.log(`Book on cooldown: "${text}" (${remainingTime}m remaining)`);
                    }
                }
            });

            console.log(`Total usable books for ${charName}: ${usableBooks.length}`);

            if (usableBooks.length === 0) {
                addToLog(`No usable books for ${charName} - all on cooldown`, 'orange');
                return { success: false, noBooksAvailable: true };
            }

            // Step 7: Try each book until one works
            for (let bookIndex = 0; bookIndex < usableBooks.length; bookIndex++) {
                if (booksUsed >= MAX_BOOKS) break;

                const book = usableBooks[bookIndex];
                console.log(`Trying book ${bookIndex + 1}/${usableBooks.length}: "${book.text}" (ID: ${book.id}) for ${charName}`);

                const freshIframe = await createHiddenIframe(interactLink);
                const freshDoc = freshIframe.contentDocument || freshIframe.contentWindow.document;
                const $freshDoc = $(freshDoc);

                await sleep(1000);

                const $freshSelect = $freshDoc.find('#ctl00_cphTopColumn_ctl00_ddlUseItem');
                const $freshSubmitBtn = $freshDoc.find('#ctl00_cphTopColumn_ctl00_btnUseItem');

                if (!$freshSelect.length || !$freshSubmitBtn.length) {
                    addToLog(`Form elements missing for ${charName} on book ${bookIndex + 1}`, 'orange');
                    freshIframe.remove();
                    continue;
                }

                $freshSelect.val(book.id);
                console.log(`Selected book ID: ${book.id} in fresh form`);

                $freshSubmitBtn.click();
                await sleep(FORM_SUBMIT_WAIT);

                const resultDoc = freshIframe.contentDocument || freshIframe.contentWindow.document;
                const resultText = resultDoc.body.textContent || "";

                const successPhrases = [
                    "Could you please sign this for me?",
                    "autograph has been added",
                    "successfully signed",
                    "signed your autograph book",
                    "Thanks for the autograph"
                ];

                const isSuccess = successPhrases.some(phrase =>
                    resultText.toLowerCase().includes(phrase.toLowerCase())
                );

                if (isSuccess) {
                    booksUsed++;
                    bookCooldowns[book.id] = Date.now();
                    GM_setValue('bookCooldowns', bookCooldowns);
                    addToLog(`✓ Collected from ${charName} using book ${bookIndex + 1}`, 'green');
                    updateBooksCounter();
                    success = true;
                    freshIframe.remove();
                    break;
                } else if (resultText.includes("This item was used too recently")) {
                    bookCooldowns[book.id] = Date.now();
                    GM_setValue('bookCooldowns', bookCooldowns);
                    addToLog(`Book ${bookIndex + 1} on cooldown for ${charName}`, 'orange');
                    freshIframe.remove();
                    continue;
                } else {
                    const debugText = resultText.substring(0, 200).replace(/\s+/g, ' ').trim();
                    console.log(`Book ${bookIndex + 1} result for ${charName}:`, debugText);
                    freshIframe.remove();
                }

                await sleep(1000);
            }

            if (!success && usableBooks.length > 0) {
                addToLog(`Failed to collect from ${charName} (tried ${usableBooks.length} books)`, 'orange');
            }

        } catch (error) {
            addToLog(`Error processing ${charName}: ${error.message}`, 'red');
            console.error(`Full error for ${charName}:`, error);
        } finally {
            $('iframe[style*="display: none"]').remove();
        }

        return { success, noBooksAvailable };
    }

    // INITIALIZATION =====================================================
    $(function() {
        createUI();
        updateBooksCounter();
        updateTargetDisplay();
        addToLog('Script initialized - Fixed form handling v1.0', 'blue');

        if (GM_getValue('wasInCooldown', false)) {
            addToLog('Resuming from cooldown', 'blue');
            setTimeout(() => startCollection(), 2000);
        }
    });

    window.addEventListener('beforeunload', () => {
        if (isInCooldown) {
            GM_setValue('wasInCooldown', true);
        } else {
            GM_deleteValue('wasInCooldown');
        }
    });
})();