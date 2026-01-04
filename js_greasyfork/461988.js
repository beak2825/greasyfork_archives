// ==UserScript==
// @name         Prime Gaming Code Grabber
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Grab game, bundle, and key information from Amazon Gaming
// @author       SpoobGPT
// @match        https://gaming.amazon.com/my-collection*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461988/Prime%20Gaming%20Code%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/461988/Prime%20Gaming%20Code%20Grabber.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    let gameLog = loadGameLog();

    function loadGameLog() {
        let logData = localStorage.getItem('gameLog');
        if (logData) {
            return JSON.parse(logData);
        } else {
            return [];
        }
    }

    function saveGameLog() {
        localStorage.setItem('gameLog', JSON.stringify(gameLog));
    }

function readGamesFromDOM() {
    let games = new Set();
    let chunks = $('body').find('div');

    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        let deliveredData = $(chunk).find('p.tw-amazon-ember-bold.tw-c-text-alt-2.tw-ellipsis.tw-font-size-7.tw-line-clamp-1.tw-line-clamp-1.tw-md-font-size-4.tw-sm-font-size-5[data-a-target="claim-entry-list_label-text"][title="Delivered"]');

        if (deliveredData.length > 0) {
            // Skip this entry if it has the "Delivered" text
            continue;
        }

        let gameData = $(chunk).find('h3.tw-c-text-alt-2.tw-ellipsis.tw-font-size-7.tw-line-height-body.tw-md-font-size-5.tw-sm-font-size-6[title]');
        let bundleData = $(chunk).find('h3.tw-amazon-ember-bold.tw-c-text-inverted.tw-ellipsis.tw-font-size-6.tw-line-clamp-2.tw-md-font-size-4.tw-sm-font-size-5.tw-strong.tw-word-break-word[title]');
        let keyData = $(chunk).find('input[type="text"]');

        if (gameData.length > 0 && bundleData.length > 0 && keyData.length > 0) {
            let game = gameData.attr('title');
            let bundle = bundleData.attr('title');
            let key = keyData.val();
            if (key) {
                games.add(JSON.stringify({ game, bundle, key }));
            }
        }
    }

    return Array.from(games).map(JSON.parse);
}

    function createShowDataButton() {
        let button = $('<button>Show Data</button>').css({
            'position': 'fixed',
            'bottom': '10px',
            'right': '10px',
            'padding': '10px 20px',
            'background-color': '#333',
            'color': '#fff',
            'border': 'none',
            'border-radius': '5px',
            'cursor': 'pointer'
        }).click(function() {
            let games = readGamesFromDOM();
            updateGameLog(games);
            let output = '';
            for (let i = 0; i < games.length; i++) {
                output += `${games[i].game} - ${games[i].bundle} :\n${games[i].key}\n\n`;
            }
            let stats = `Entries: ${games.length} Last logged: ${new Date().toLocaleString()}`;
            alert(output + '\n\n' + stats);
        });

        $('body').append(button);
    }

    function createLogButton() {
        let button = $('<button>Show Log</button>').css({
            'position': 'fixed',
            'bottom': '50px',
            'right': '10px',
            'padding': '10px 20px',
            'background-color': '#333',
            'color': '#fff',
            'border': 'none',
            'border-radius': '5px',
            'cursor': 'pointer'
        }).click(function() {
            let output = '';
            for (let i = 0; i < gameLog.length; i++) {
                output += `- ${gameLog[i].game} - ${gameLog[i].bundle}:\n  ${gameLog[i].key}\n  First seen: ${gameLog[i].timestamp}\n\n`;
            }
            alert(output);
        });

        $('body').append(button);
    }
function createClearLogButton() {
    let button = $('<button>Clear Log</button>').css({
        'position': 'fixed',
        'bottom': '90px',
        'right': '10px',
        'padding': '10px 20px',
        'background-color': '#333',
        'color': '#fff',
        'border': 'none',
        'border-radius': '5px',
        'cursor': 'pointer'
    }).click(function() {
        if (confirm('Are you sure you want to clear the log? This action cannot be undone.')) {
            gameLog = [];
            localStorage.removeItem('gameLog');
            alert('Log cleared.');
        }
    });

    $('body').append(button);
}
    function updateGameLog(games) {
        let currentTime = new Date().toLocaleString();
        let newEntries = false;

        games.forEach(game => {
            let exists = gameLog.some(log => log.game === game.game && log.bundle === game.bundle && log.key === game.key);
            if (!exists) {
                gameLog.push({ ...game, timestamp: currentTime });
                newEntries = true;
            }
        });

        if (newEntries) {
            gameLog.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
            saveGameLog();
        }
    }

function createButton() {
    createShowDataButton();
    createLogButton();
    createClearLogButton();
}

    createButton();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if ($('h3.tw-c-text-alt-2.tw-ellipsis.tw-font-size-7.tw-line-height-body.tw-md-font-size-5.tw-sm-font-size-6[title]').length > 0) {
                    createButtons();
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

})(jQuery.noConflict(true));