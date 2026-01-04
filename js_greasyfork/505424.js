// ==UserScript==
// @name         Mackolik Přegenerování Zápasů
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Skript, který přegeneruje názvy týmů na hlavní stránce podle detailu zápasu na Mackolik.com
// @author       Michal, Martin
// @match        https://www.mackolik.com/canli-sonuclar
// @match        https://www.mackolik.com/futbol/canli-sonuclar
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505424/Mackolik%20P%C5%99egenerov%C3%A1n%C3%AD%20Z%C3%A1pas%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/505424/Mackolik%20P%C5%99egenerov%C3%A1n%C3%AD%20Z%C3%A1pas%C5%AF.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function addRobotoFont() {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Přegenerování';
        button.style.position = 'fixed';
        button.style.top = '100px';
        button.style.left = '50px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.style.fontSize = '18px';
        button.style.fontWeight = '700';
        button.style.fontFamily = 'Roboto, sans-serif';
        button.style.zIndex = 10000;
        button.style.lineHeight = '38px';

        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#0056b3';
        });

        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#007bff';
        });

        // Přidáme tlačítko přímo do těla dokumentu
        document.body.appendChild(button);

        const progressContainer = document.createElement('div');
        progressContainer.style.position = 'fixed';
        progressContainer.style.top = '100px';
        progressContainer.style.left = '50px';
        progressContainer.style.color = '#ffffff';
        progressContainer.style.fontSize = '14px';
        progressContainer.style.fontFamily = 'Roboto, sans-serif';
        progressContainer.style.fontWeight = '500';
        progressContainer.style.zIndex = 10000;
        document.body.appendChild(progressContainer);

        button.addEventListener('click', async function() {
            button.textContent = 'Načítá se...';
            button.disabled = true;

            const success = await retryUntilSuccess(5, 1000, progressContainer);
            if (success) {
                button.textContent = 'Přegenerování';
            } else {
                button.textContent = 'Přegenerování';
            }
            button.disabled = false;
        });
    }

    const canonicalUrls = [];

    async function updateMatchUrl(match) {
        const originalUrl = match.getAttribute('data-match-url');
        try {
            const response = await fetch(originalUrl);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const canonicalLink = doc.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                const newUrl = canonicalLink.href;
                canonicalUrls.push(newUrl);

                match.setAttribute('data-match-url', newUrl);

                const homeTeam = doc.querySelector('.team-home .team-name');
                const awayTeam = doc.querySelector('.team-away .team-name');

                if (homeTeam && awayTeam) {
                    const homeTeamText = homeTeam.textContent.trim();
                    const awayTeamText = awayTeam.textContent.trim();

                    const homeTeamElement = match.querySelector('.match-row__team-name--home .match-row__team-name-text');
                    const awayTeamElement = match.querySelector('.match-row__team-name--away .match-row__team-name-text');

                    if (homeTeamElement && awayTeamElement) {
                        homeTeamElement.textContent = homeTeamText;
                        awayTeamElement.textContent = awayTeamText;
                    }
                }
            } else {
                console.warn('Canonical link not found for', originalUrl);
                throw new Error('Canonical link not found');
            }
        } catch (error) {
            console.error('Error updating match URL:', error);
            throw error;
        }
    }

    async function processVisibleMatches(batchSize = 100, progressContainer) {
        const matches = Array.from(document.querySelectorAll('.match-row__match-content'));
        const updatePromises = matches.map(updateMatchUrl);

        try {
            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Batch update failed:', error);
        }

        const progress = Math.round((document.documentElement.scrollTop + window.innerHeight) / document.documentElement.scrollHeight * 100);
        progressContainer.textContent = `Načítání: ${progress}%`;

        return matches.length < batchSize;
    }

    function scrollByDistance(distance) {
        window.scrollBy(0, distance);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryUntilSuccess(maxAttempts = 5, retryDelay = 1000, progressContainer) {
        let attempt = 0;
        let reachedEnd = false;

        while (attempt < maxAttempts && !reachedEnd) {
            reachedEnd = await processVisibleMatches(50, progressContainer);

            if (!reachedEnd) {
                scrollByDistance(999999);
                await wait(3000);
            }

            attempt++;
        }

        if (reachedEnd) {
            progressContainer.textContent = 'Načítání dokončeno';
            console.log('Nalezené canonical URL odkazy:');
            canonicalUrls.forEach(url => console.log(url));
            return true;
        } else {
            progressContainer.textContent = 'Načítání selhalo';
            return false;
        }
    }

    addRobotoFont();

    createButton();

})();
