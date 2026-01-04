// ==UserScript==
// @name         Mackolik Přegenerování Zápasů
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Skript, který přegeneruje názvy týmů na hlavní stránce podle detailu zápasu na Mackolik.com
// @author       Michal
// @match        https://www.mackolik.com/canli-sonuclar
// @match        https://www.mackolik.com/futbol/canli-sonuclar
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503412/Mackolik%20P%C5%99egenerov%C3%A1n%C3%AD%20Z%C3%A1pas%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/503412/Mackolik%20P%C5%99egenerov%C3%A1n%C3%AD%20Z%C3%A1pas%C5%AF.meta.js
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
        const header = document.querySelector('.page-section-header');
        if (!header) {
            console.error('Element .page-section-header nebyl nalezen.');
            return;
        }

        const button = document.createElement('button');
        button.textContent = 'Přegenerování';
        button.style.position = 'relative';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 15px';
        button.style.background = 'linear-gradient(90deg, #003087 33.33%, #FFD700 33.33%, #FFD700 66.66%, #A12830 66.66%)';
        button.style.color = '#000000';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = 'none';
        button.style.fontSize = '18px';
        button.style.textShadow = '2px 2px 4px rgba(255, 255, 255, 0.7)';
        button.style.fontWeight = 'bold';
        button.style.fontWeight = '900';
        button.style.fontFamily = 'Roboto, sans-serif';
        button.style.zIndex = 9999;
        button.style.transition = 'color 0.2s';
        button.style.fontSize = '18px';
        button.style.fontWeight = '700';
        button.style.lineHeight = '28px';
     

        header.style.position = 'relative';
        header.appendChild(button);

        const progressContainer = document.createElement('div');
        progressContainer.style.position = 'absolute';
        progressContainer.style.top = '50%';
        progressContainer.style.left = '50%';
        progressContainer.style.transform = 'translate(-50%, -50%)';
        progressContainer.style.color = '#ffffff';
        progressContainer.style.fontSize = '14px';
        progressContainer.style.fontFamily = 'Roboto, sans-serif';
        progressContainer.style.fontWeight = '500';
        header.appendChild(progressContainer);

        button.addEventListener('click', async function() {
            button.textContent = 'Načítá se...';
            button.disabled = true;

            const success = await retryUntilSuccess(5, 3000, progressContainer);
            if (success) {
                progressContainer.textContent = 'Načítání dokončeno';
            } else {
                progressContainer.textContent = 'Chyba, zkuste znovu';
            }
            button.textContent = 'Přegenerování';
            button.disabled = false;
        });
    }

    async function updateMatchUrl(match, attempt = 1) {
        const originalUrl = match.getAttribute('data-match-url');
        try {
            const response = await fetch(originalUrl);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            let canonicalLink = doc.querySelector('link[rel="canonical"]');

            if (!canonicalLink) {
                console.warn('Canonical link not found for', originalUrl);
                canonicalLink = { href: originalUrl };
            }

            const newUrl = canonicalLink.href;

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

            localStorage.setItem(`match-${originalUrl}`, 'success');

        } catch (error) {
            console.error(`Error updating match URL (attempt ${attempt}):`, error);

            console.error(`Failed to update match: ${originalUrl}`);

            if (attempt <= 3) {
                await wait(3000 * attempt);
                return updateMatchUrl(match, attempt + 1);
            }

            throw error;
        }
    }

    async function batchUpdateMatches(batchSize = 50, progressContainer) {
        const matches = Array.from(document.querySelectorAll('.match-row__match-content'));
        let index = 0;
        let failedMatches = [];

        while (index < matches.length) {
            const batch = matches.slice(index, index + batchSize);
            const updatePromises = batch.map(match => updateMatchUrl(match).catch(() => failedMatches.push(match)));

            await Promise.all(updatePromises);

            index += batchSize;

            let progress = Math.round((index / matches.length) * 100);
            progress = Math.min(progress, 100);
            progressContainer.textContent = `Načítání: ${progress}%`;
        }

        return failedMatches;
    }

    async function checkFailedMatches(failedMatches, progressContainer) {
        progressContainer.textContent = 'Probíhá kontrola...';

        const retryPromises = failedMatches.map(match => updateMatchUrl(match).catch(() => null));
        await Promise.all(retryPromises);

        const stillFailedMatches = failedMatches.filter(match => {
            const originalUrl = match.getAttribute('data-match-url');
            return !localStorage.getItem(`match-${originalUrl}`);
        });

        return stillFailedMatches.length === 0;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryUntilSuccess(maxAttempts = 5, retryDelay = 1000, progressContainer) {
        let attempt = 0;
        let failedMatches = [];

        while (attempt < maxAttempts) {
            if (attempt === 0) {
                failedMatches = await batchUpdateMatches(50, progressContainer);
            } else {
                const allSuccessful = await checkFailedMatches(failedMatches, progressContainer);
                if (allSuccessful) {
                    progressContainer.textContent = 'Načítání dokončeno';
                    return true;
                }
            }

            attempt++;
            await wait(retryDelay * attempt);
        }

        progressContainer.textContent = 'Načítání selhalo';
        return false;
    }

    addRobotoFont();
    createButton();

})();