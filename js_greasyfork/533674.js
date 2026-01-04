// ==UserScript==
// @name         RR Taken (Debug Version with Class WebSocket Hook)
// @namespace    takenrr.torn
// @version      1.6.1
// @description  Game filter + WebSocket class-based override + full logging + no feature removals
// @author       Whiskey_Jack
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533674/RR%20Taken%20%28Debug%20Version%20with%20Class%20WebSocket%20Hook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533674/RR%20Taken%20%28Debug%20Version%20with%20Class%20WebSocket%20Hook%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OriginalWebSocket = window.WebSocket;

    class WebSocketMonitor extends OriginalWebSocket {
        constructor(...args) {
            super(...args);
            console.log('[RR Taken] WebSocket constructor hooked:', args[0]);

            this.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const message = data?.push?.pub?.data?.message;
                    const action = message?.action;

                    if (message?.namespace === 'russianRoulette') {
                        console.log('[RR Taken] RR Message received:', message);

                        const expiredGame = message?.data?.expiredGame;
                        if (action === 'gameRemovedFromList') {
                            insertData(expiredGame, 'Taken');
                        } else if (action === 'gameRemoved') {
                            insertData(expiredGame, 'Cancelled');
                        }
                    }
                } catch (e) {
                    console.warn('[RR Taken] Failed to parse WS message:', event.data, e);
                }
            });

            const originalSend = this.send;
            this.send = function (data) {
                console.log('[RR Taken] >>> Sent:', data);
                return originalSend.call(this, data);
            };
        }
    }

    window.WebSocket = WebSocketMonitor;
    Object.setPrototypeOf(WebSocketMonitor, OriginalWebSocket);
    Object.setPrototypeOf(WebSocketMonitor.prototype, OriginalWebSocket.prototype);

    let gamesData = {};
    const audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    let audioEnabled = false;

    function enableAudio() {
        if (!audioEnabled) {
            audio.play().then(() => {
                audioEnabled = true;
                audio.pause();
            }).catch((e) => {
                console.log('[RR Taken] Audio play blocked:', e);
            });
        }
    }

    function filterAdd() {
        if ($('div[class^="titleContainer"]').length > 0) {
            const filter = $('<input type="text" id="filterValue" placeholder="Enter value or =value">');
            $('div[class^="titleContainer"]').append(filter);

            document.addEventListener('click', enableAudio, { once: true });
            document.getElementById('filterValue').addEventListener('input', enableAudio, { once: true });

            console.log('[RR Taken] Filter input added.');
        } else {
            console.log('[RR Taken] Waiting for title container...');
            setTimeout(filterAdd, 300);
        }
    }

    function filterGameDiv(gameDiv) {
        const filterValueRaw = $('#filterValue').val();
        let filterValue = 0;
        let exactMatch = false;

        if (filterValueRaw && filterValueRaw.startsWith('=')) {
            filterValue = parseInt(filterValueRaw.slice(1));
            exactMatch = true;
        } else {
            filterValue = parseInt(filterValueRaw) || 0;
        }

        const starterAnchor = gameDiv.find('.honorWrap___BHau4 a[rel="noopener noreferrer"]');
        if (starterAnchor.length > 0) {
            const startedLink = starterAnchor.attr('href');
            const userIdMatch = startedLink.match(/XID=(\d+)/);
            const gameId = gameDiv.attr('id');
            const gameAmount = parseInt(gameDiv.find('div[class^="betBlock"]').attr('aria-label')?.split(':')[1] ?? 0);

            if (!gamesData[gameId]) {
                gamesData[gameId] = [starterAnchor.text(), startedLink];
                console.log(`[RR Taken] Game tracked: ${gameId} | ${starterAnchor.text()} | $${gameAmount}`);
            }

            const shouldHide = exactMatch ? gameAmount !== filterValue : gameAmount < filterValue;

            if (shouldHide) {
                gameDiv.hide();
                delete gamesData[gameId];
            } else {
                gameDiv.show();
            }
        } else {
            console.warn("[RR Taken] Starter anchor not found in game div:", gameDiv.attr('id'));
        }
    }

    function insertData(id, resultG) {
        const gameId = String(id);
        if (gamesData[gameId]) {
            const [starterName, starterUrl] = gamesData[gameId];
            const userId = starterUrl.split('XID=')[1];
            const resultStyle = resultG === "Cancelled" ? 'style="color: green; font-size: 14px;"' : '';
            const insertD = $(`<a href="${starterUrl}" target="_blank">${starterName}</a>: <span ${resultStyle}>${resultG}</span> <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${userId}" target="_blank">Attack</a>`);

            const target = $('.title-black').eq(1);
            console.log(`[RR Taken] insertData called for ${id} with result "${resultG}". Inserting element...`);

            if (target.length > 0) {
                target.html(insertD);
            } else {
                const gameDiv = $(`#${id}`);
                if (gameDiv.length > 0) {
                    gameDiv.after($(`<div class="rr-alert">${insertD.html()}</div>`));
                } else {
                    console.warn("[RR Taken] Could not find DOM target for ID:", id);
                }
            }

            delete gamesData[gameId];

            if (resultG === "Cancelled" && audioEnabled) {
                audio.play();
            }

            setTimeout(() => {
                $('.rr-alert').fadeOut(500, function () { $(this).remove(); });
            }, 5000);
        } else {
            console.warn("[RR Taken] insertData() called but ID not in gamesData:", gameId);
        }
    }

    function observeNewGames() {
        const targetNode = document.querySelector('div[class^="rowsWrap"]');
        if (!targetNode) {
            console.log('[RR Taken] rowsWrap not found. Retrying...');
            setTimeout(observeNewGames, 300);
            return;
        }

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            filterGameDiv($(node));
                        }
                    });
                }
            }
        });

        observer.observe(targetNode, config);
        console.log('[RR Taken] MutationObserver bound to rowsWrap.');
    }

    // Wait for page load to attach filter + observer
    window.addEventListener('load', () => {
        filterAdd();
        observeNewGames();

        setInterval(() => {
            $('div[class^="rowsWrap"] > div').each(function () {
                filterGameDiv($(this));
            });
        }, 300);
    });
})();


