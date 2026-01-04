// ==UserScript==
// @name         Wordle Tools
// @namespace    CCCC_David
// @version      0.2.0
// @description  Some enhancements of the Wordle game.
// @author       CCCC_David
// @match        https://www.powerlanguage.co.uk/wordle/
// @match        https://www.nytimes.com/games/wordle/index.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439310/Wordle%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/439310/Wordle%20Tools.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const SUCCESS_MSG_TIMEOUT = 3000;

    const allowedPolicy = window.trustedTypes?.createPolicy?.('allowedPolicy', {createHTML: (x) => x});
    const createTrustedHTML = (html) => (allowedPolicy ? allowedPolicy.createHTML(html) : html);

    let puzzleList = null;

    const getPuzzleList = async () => {
        if (puzzleList) {
            return puzzleList;
        }
        try {
            for (const el of document.getElementsByTagName('script')) {
                const scriptSrc = el.src;
                if (/\bmain\.\w+\.js$/u.test(scriptSrc ?? '')) {
                    // eslint-disable-next-line no-await-in-loop
                    const res = await fetch(scriptSrc, {
                        method: 'GET',
                        mode: 'same-origin',
                        redirect: 'follow',
                    });
                    // eslint-disable-next-line no-await-in-loop
                    const jsCode = await res.text();
                    puzzleList = JSON.parse(jsCode.match(/\["cigar".*?"shave"\]/u)[0]);
                    return puzzleList;
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
        return null;
    };

    const appendPuzzleIdToTitle = (gameAppElement, puzzleId) => {
        const puzzleIdInTitleSpan = document.createElement('span');
        puzzleIdInTitleSpan.id = 'wordle-tools-puzzle-id-in-title';
        puzzleIdInTitleSpan.innerText = puzzleId;
        gameAppElement.$game.parentElement.querySelector('div[class="title"]').appendChild(puzzleIdInTitleSpan);
    };

    const clearGameState = (gameAppElement) => {
        localStorage.removeItem('gameState');
        localStorage.removeItem('nyt-wordle-state');
        gameAppElement.gameStatus = 'IN_PROGRESS';
        gameAppElement.canInput = true;
        gameAppElement.boardState = new Array(6).fill('');
        gameAppElement.evaluations = new Array(6).fill(null);
        gameAppElement.letterEvaluations = {};
        gameAppElement.rowIndex = 0;
        gameAppElement.tileIndex = 0;
        gameAppElement.restoringFromLocalStorage = false;
        for (const row of gameAppElement.$game.getElementsByTagName('game-row')) {
            row.removeAttribute('letters');
            for (const tile of row.shadowRoot.querySelectorAll('game-tile')) {
                tile.removeAttribute('letter');
                tile.removeAttribute('evaluation');
                tile.removeAttribute('reveal');
            }
        }
        for (const button of gameAppElement.$keyboard.shadowRoot.querySelectorAll('button')) {
            button.removeAttribute('data-state');
            button.classList.remove('fade');
        }
        gameAppElement.$game.querySelector('#game-toaster').innerHTML = '';
    };

    const clearStatistics = () => {
        localStorage.removeItem('statistics');
        localStorage.removeItem('nyt-wordle-statistics');
    };

    const jumpToPuzzleId = (gameAppElement, settingsShadowRoot, puzzleId) => {
        clearGameState(gameAppElement);
        gameAppElement.dayOffset = puzzleId;
        gameAppElement.solution = puzzleList[puzzleId % puzzleList.length];
        gameAppElement.$game.parentElement.querySelector('#wordle-tools-puzzle-id-in-title').innerText = puzzleId;
        settingsShadowRoot.getElementById('puzzle-number').innerText = `#${puzzleId}`;
    };

    const handleGameAppElement = async (gameAppElement) => {
        if (!gameAppElement) {
            return;
        }

        window.gameApp = gameAppElement;
        await getPuzzleList();

        const appendSettingsItems = (gameSettingsElement) => {
            if (!gameSettingsElement) {
                return;
            }

            const settingsShadowRoot = gameSettingsElement.shadowRoot;
            const settingsSection = settingsShadowRoot.querySelector('div[class="sections"] > section');

            const showSuccessMsg = (message, insertBeforeNode, enableElements) => {
                const successMsgElement = document.createElement('span');
                successMsgElement.innerText = message;
                successMsgElement.style.color = 'var(--color-correct)';
                insertBeforeNode.parentElement.insertBefore(successMsgElement, insertBeforeNode);
                setTimeout(() => {
                    successMsgElement.remove();
                    for (const el of enableElements) {
                        el.disabled = false;
                    }
                }, SUCCESS_MSG_TIMEOUT);
            };

            const jumpItem = document.createElement('div');
            settingsSection.appendChild(jumpItem);
            jumpItem.outerHTML = createTrustedHTML(`
                <div class="setting">
                    <div class="text">
                        <div class="title">Jump to Puzzle #</div>
                    </div>
                    <div class="control">
                        <input type="text" id="wordle-tools-jump-target-id" style="width: 3em;">
                        <button id="wordle-tools-jump-to-puzzle">Jump</button>
                    </div>
                </div>
            `);
            const jumpButton = settingsShadowRoot.getElementById('wordle-tools-jump-to-puzzle');
            const jumpInput = settingsShadowRoot.getElementById('wordle-tools-jump-target-id');
            jumpInput.value = gameAppElement.dayOffset;
            jumpButton.addEventListener('click', (e) => {
                const button = e.target;
                const inputBox = button.parentElement.querySelector('input');
                const puzzleId = parseInt(inputBox.value, 10);
                if (Number.isNaN(puzzleId) || puzzleId < 0) {
                    inputBox.value = gameAppElement.dayOffset;
                    return;
                }
                button.disabled = true;
                inputBox.disabled = true;
                inputBox.value = puzzleId;
                jumpToPuzzleId(gameAppElement, settingsShadowRoot, puzzleId);
                showSuccessMsg('Jumped to ', inputBox, [button, inputBox]);
            });
            jumpInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    jumpButton.click();
                }
            });

            const clearStateItem = document.createElement('div');
            settingsSection.appendChild(clearStateItem);
            clearStateItem.outerHTML = createTrustedHTML(`
                <div class="setting">
                    <div class="text">
                        <div class="title">Clear Current Game State</div>
                    </div>
                    <div class="control">
                        <button id="wordle-tools-clear-game-state">Clear</button>
                    </div>
                </div>
            `);
            settingsShadowRoot.getElementById('wordle-tools-clear-game-state').addEventListener('click', (e) => {
                const button = e.target;
                button.disabled = true;
                clearGameState(gameAppElement);
                showSuccessMsg('Cleared ', button, [button]);
            });

            const clearStatsItem = document.createElement('div');
            settingsSection.appendChild(clearStatsItem);
            clearStatsItem.outerHTML = createTrustedHTML(`
                <div class="setting">
                    <div class="text">
                        <div class="title">Clear Game Statistics</div>
                    </div>
                    <div class="control">
                        <button id="wordle-tools-clear-statistics">Clear</button>
                    </div>
                </div>
            `);
            settingsShadowRoot.getElementById('wordle-tools-clear-statistics').addEventListener('click', (e) => {
                const button = e.target;
                button.disabled = true;
                clearStatistics();
                showSuccessMsg('Cleared ', button, [button]);
            });

            const feedbackSection = settingsShadowRoot.querySelectorAll('div[class="sections"] > section')[1];
            const wordleToolsMarker = document.createElement('div');
            feedbackSection.appendChild(wordleToolsMarker);
            wordleToolsMarker.outerHTML = createTrustedHTML(`
                <div class="setting">
                    <div class="text">
                        <div class="title">Wordle Tools v0.2.0 Enabled</div>
                    </div>
                </div>
            `);
        };

        const gameSettingsObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const el of mutation.addedNodes) {
                        if (el.nodeName.toLowerCase() === 'game-settings') {
                            appendSettingsItems(el);
                        }
                    }
                }
            }
        });

        gameSettingsObserver.observe(gameAppElement.$game, {
            subtree: true,
            childList: true,
        });

        appendSettingsItems(gameAppElement.$game.getElementsByTagName('game-settings')[0]);
        appendPuzzleIdToTitle(gameAppElement, gameAppElement.dayOffset);
    };

    const gameAppObserver = new MutationObserver(async (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const el of mutation.addedNodes) {
                    if (el.nodeName.toLowerCase() === 'game-app') {
                        // eslint-disable-next-line no-await-in-loop
                        await handleGameAppElement(el);
                    }
                }
            }
        }
    });

    gameAppObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
    });

    await handleGameAppElement(document.getElementsByTagName('game-app')[0]);
})();