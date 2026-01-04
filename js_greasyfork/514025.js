// ==UserScript==
// @name         NextUp.Game Enhancer
// @namespace    PrimeMinister
// @version      2.0
// @description  Shows the names of the streamers for each clip on NextUp Game voting page
// @author       Kier
// @match        https://nextup.game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514025/NextUpGame%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/514025/NextUpGame%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getStreamerInfo() {
        const scriptTag = document.querySelector('#__NEXT_DATA__');
        if (!scriptTag) return {};

        const jsonData = JSON.parse(scriptTag.textContent);
        const streamers = jsonData?.props?.pageProps?.event?.streamers;
        if (!streamers) return {};

        return streamers.reduce((acc, streamer) => {
            acc[streamer.id] = streamer.kick_username;
            return acc;
        }, {});
    }

    function addStreamerNames(streamer1, streamer2, elo1, elo2) {
        const targetDiv = document.querySelector('.space-y-4');
        if (!targetDiv) return;
        if (document.querySelector('.streamer-info')) return;
        const streamerInfoDiv = document.createElement('div');
        streamerInfoDiv.className = 'text-center text-lg font-bold mt-2 streamer-info';
        streamerInfoDiv.textContent = `${streamer1} (${elo1}) vs ${streamer2} (${elo2})`;
        streamerInfoDiv.addEventListener('click', () => {
            const textToCopy = `${streamer1}: ${elo1}\n${streamer2}: ${elo2}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showPopup('Streamer ELO ratings copied to clipboard');
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        });

        targetDiv.appendChild(streamerInfoDiv);
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'clipboard-popup';
        popup.textContent = message;
        document.body.appendChild(popup);
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        }, 2000);
    }

    async function fetchClipData(streamerInfo) {
        try {
            const response = await fetch('https://api.nextup.game/v1/votes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success && data.data && data.data.clips) {
                const clipA = data.data.clips.a;
                const clipB = data.data.clips.b;

                const streamer1 = streamerInfo[clipA.streamer_id] || 'Unknown Streamer 1';
                const streamer2 = streamerInfo[clipB.streamer_id] || 'Unknown Streamer 2';
                const elo1 = clipA.elo_rating;
                const elo2 = clipB.elo_rating;

                addStreamerNames(streamer1, streamer2, elo1, elo2);
            }
        } catch (error) {
            console.error('Error fetching clip data:', error);
        }
    }

    function main() {
        const streamerInfo = getStreamerInfo();
        if (Object.keys(streamerInfo).length > 0) {
            fetchClipData(streamerInfo);
        }
    }

    function observePageChanges() {
        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };

        const callback = function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (!document.querySelector('.streamer-info') && window.location.pathname === '/vote') {
                        setTimeout(main, 1000);
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        if (targetNode) {
            observer.observe(targetNode, config);
        }
    }

    function observeUrlChanges() {
        let lastPathname = window.location.pathname;
        setInterval(() => {
            if (window.location.pathname !== lastPathname) {
                lastPathname = window.location.pathname;
                if (lastPathname === '/vote') {
                    main();
                    observePageChanges();
                }
            }
        }, 500);
    }

    setTimeout(() => {
        if (window.location.pathname === '/vote') {
            main();
            observePageChanges();
        }
        observeUrlChanges();
    }, 1500);
})();
