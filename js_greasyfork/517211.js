// ==UserScript==
// @name         Vision sport
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fetch and update data from Vision Sport for any match and display it on example.com
// @match        https://example.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.vision-sport.fr
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517211/Vision%20sport.user.js
// @updateURL https://update.greasyfork.org/scripts/517211/Vision%20sport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousHash = null;

    function getMatchIdFromUrl() {
        const matchIdPattern = /live\/(\d+)/;
        const match = window.location.href.match(matchIdPattern);
        return match ? match[1] : null;
    }

    function fetchData(matchId) {
        const visionSportUrl = `https://www.vision-sport.fr/lives/live.php?match=${matchId}&t=c&allstats=1`;

        console.log(`Načítám data pro zápas ID: ${matchId}`);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: visionSportUrl,
                onload: function(response) {
                    const text = response.responseText;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    const divA_vs_B = doc.querySelector('#a_vs_b');
                    const divDroite = doc.querySelector('#div_droite');

                    if (divA_vs_B && divDroite) {
                        resolve({ divA_vs_B, divDroite });
                    } else {
                        console.error('Požadované divy nebyly nalezeny.');
                        reject('Požadované divy nebyly nalezeny.');
                    }
                },
                onerror: function(error) {
                    console.error('Chyba při načítání dat:', error);
                    reject(error);
                }
            });
        });
    }

    function generateContainer() {
        let container = document.getElementById('vision-sport-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'vision-sport-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function createAndAppendDiv(id, content) {
        const divContainer = document.getElementById(id) || document.createElement('div');
        divContainer.id = id;
        divContainer.innerHTML = content;
        return divContainer;
    }

    async function updateContent() {
        const matchId = getMatchIdFromUrl();

        if (matchId) {
            console.log(`Načítám obsah pro zápas ID: ${matchId}`); // Ladicí log
            try {
                const data = await fetchData(matchId);
                if (data) {
                    const container = generateContainer();

                    if (data.divA_vs_B) {
                        const divA_vs_BContainer = createAndAppendDiv('a_vs_b-container', data.divA_vs_B.outerHTML);
                        container.appendChild(divA_vs_BContainer);
                    }

                    if (data.divDroite) {
                        const divDroiteContainer = createAndAppendDiv('div_droite-container', data.divDroite.outerHTML);
                        container.appendChild(divDroiteContainer);
                    }

                    window.location.hash = `https://vision-sport/live/${matchId}`;
                }
            } catch (error) {
                console.error("Chyba při zpracování dat:", error);
            }
        } else {
            console.warn("ID zápasu nebylo nalezeno ve URL.");
        }
    }

    function getHash(obj) {
        return JSON.stringify(obj).split("").reduce((acc, char) => {
            acc = ((acc << 5) - acc) + char.charCodeAt(0);
            return acc & acc;
        }, 0);
    }

    async function checkDataAndUpdate() {
        const matchId = getMatchIdFromUrl();
        if (matchId) {
            console.log(`Aktuální hash v URL: ${window.location.hash}`);

            try {
                const data = await fetchData(matchId);

                if (data) {
                    const newHash = getHash(data);
                    if (newHash !== previousHash) {
                        console.log('Změna detekována, aktualizuji obsah...');
                        await updateContent();
                        previousHash = newHash;
                    }
                }
            } catch (error) {
                console.log('Nezískal jsem žádná data pro tento zápas.');
            }
        }
    }

    setInterval(checkDataAndUpdate, 5000);

    let currentMatchId = getMatchIdFromUrl();
    setInterval(function() {
        const newMatchId = getMatchIdFromUrl();
        if (newMatchId && newMatchId !== currentMatchId) {
            currentMatchId = newMatchId;
            window.location.reload();
        }
    }, 1000);
})();
