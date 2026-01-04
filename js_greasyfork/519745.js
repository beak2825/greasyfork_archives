// ==UserScript==
// @name        Modrinth Version Filter
// @match       https://modrinth.com/collection/*/mods
// @grant       none
// @version     1.0.1
// @author      https://github.com/Staninna
// @description Ever spent hours clicking through mod pages like a lost villager in a maze? 
//             Fear not! This script is like having a coordinated army of parrots checking 
//             version numbers for you. No more manual hunting - we've automated that 
//             tedious task faster than you can say "Creeper? Aww man!" 🦜✨
// @esversion   11
// @license     MIT
// @namespace https://greasyfork.org/users/1406392
// @downloadURL https://update.greasyfork.org/scripts/519745/Modrinth%20Version%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/519745/Modrinth%20Version%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFilterSetup = false;
    let processingMods = false;

    function setupModVersionFilter() {
        if (isFilterSetup) return;

        const nav = document.querySelector('.navigation-card');
        if (!nav) return;

        if (document.getElementById('mcVersionFilter')) return;

        isFilterSetup = true;
        initializeFilter(nav);
    }

    function initializeFilter(nav) {
        const filterDiv = document.createElement('div');
        filterDiv.style.display = 'flex';
        filterDiv.style.alignItems = 'center';
        filterDiv.style.marginLeft = 'auto';
        filterDiv.style.marginRight = '16px';
        filterDiv.innerHTML = `
            <input type="text" id="mcVersionFilter" placeholder="MC Version (e.g. 1.20.1)"
                   style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; margin-right: 8px; width: 160px;">
            <button id="filterButton"
                    style="padding: 4px 12px; background: var(--color-brand); color: white; border-radius: 4px; font-size: 14px;">
                Filter
            </button>
        `;
        nav.appendChild(filterDiv);

        if (!processingMods) {
            processModCards();
        }
    }

    function cleanVersions(versions) {
        return versions
            .filter(v => /^\d+\.\d+(\.\d+)?$/.test(v))
            .sort((a, b) => {
                const partsA = a.split('.').map(Number);
                const partsB = b.split('.').map(Number);
                for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                    const partA = partsA[i] || 0;
                    const partB = partsB[i] || 0;
                    if (partA !== partB) return partB - partA;
                }
                return 0;
            });
    }

    async function processModCards() {
        if (processingMods) return;
        processingMods = true;

        const modCards = document.querySelectorAll('.project-card');
        const modVersions = new Map();

        // Create array of promises for all mod version fetches
        const fetchPromises = Array.from(modCards).map(async card => {
            if (card.querySelector('.mod-versions-display')) return null;

            const link = card.querySelector('a[href^="/mod/"]')?.getAttribute('href');
            if (!link) return null;

            const modId = link.split('/mod/')[1];

            try {
                const response = await fetch(`https://api.modrinth.com/v2/project/${modId}/version`);
                const versions = await response.json();
                return { card, versions };
            } catch (error) {
                console.error(`Error fetching versions for mod ${modId}:`, error);
                return null;
            }
        });

        try {
            // Wait for all fetches to complete
            const results = await Promise.all(fetchPromises);

            // Process results and update UI
            results.forEach(result => {
                if (!result) return;

                const { card, versions } = result;
                const gameVersions = cleanVersions([...new Set(versions.flatMap(v => v.game_versions))]);
                modVersions.set(card, gameVersions);

                // Add version display
                const statsDiv = card.querySelector('.stats');
                if (statsDiv) {
                    const versionDiv = document.createElement('div');
                    versionDiv.classList.add('mod-versions-display');
                    versionDiv.style.fontSize = '0.875rem';
                    versionDiv.style.color = 'var(--color-text-secondary)';
                    versionDiv.style.marginTop = '8px';
                    versionDiv.textContent = `MC: ${gameVersions.slice(0, 3).join(', ')}${gameVersions.length > 3 ? '...' : ''}`;
                    statsDiv.appendChild(versionDiv);
                }
            });

            setupFilterHandlers(modVersions);
        } catch (error) {
            console.error('Error processing mod versions:', error);
        } finally {
            processingMods = false;
        }
    }

    function setupFilterHandlers(modVersions) {
        const filterButton = document.getElementById('filterButton');
        const filterInput = document.getElementById('mcVersionFilter');

        const newFilterButton = filterButton.cloneNode(true);
        const newFilterInput = filterInput.cloneNode(true);
        filterButton.parentNode.replaceChild(newFilterButton, filterButton);
        filterInput.parentNode.replaceChild(newFilterInput, filterInput);

        function filterMods() {
            const filterVersion = newFilterInput.value.trim();
            if (!filterVersion) return;

            modVersions.forEach((versions, card) => {
                card.style.display = versions.includes(filterVersion) ? 'block' : 'none';
            });
        }

        newFilterButton.addEventListener('click', filterMods);
        newFilterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterMods();
        });
    }

    let debounceTimeout;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const shouldSetup = mutations.some(mutation =>
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && node.querySelector?.('.project-card')
                )
            );
            if (shouldSetup) {
                isFilterSetup = false;
                setupModVersionFilter();
            }
        }, 500);
    });

    // Wait 5 seconds before starting the script
    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
        setupModVersionFilter();
    }, 5000);

})();