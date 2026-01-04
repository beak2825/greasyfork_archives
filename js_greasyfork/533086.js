// ==UserScript==
// @name         Torn Job Filter Toggles
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Adds toggles to hide users with specific jobs on Torn user search pages, with optional exemption for top positions
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533086/Torn%20Job%20Filter%20Toggles.user.js
// @updateURL https://update.greasyfork.org/scripts/533086/Torn%20Job%20Filter%20Toggles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ Script loaded');

    const toggleGroupId = 'jobFilterToggleGroup';

    const jobKeywords = [
        'Hospital',
        'Education System',
        'Casino',
        'Courthouse',
        'Army',
        'Grocery Store'
    ];

    const topJobTitles = {
        'Hospital': 'Brain Surgeon at the Hospital',
        'Education System': 'Principal in the Education System',
        'Courthouse': 'Federal Judge at the Courthouse',
        'Army': 'General in the Army',
        'Grocery Store': 'Manager at the Grocery Store',
        'Casino': 'Casino President at the Casino'
    };

    function normalizeTitle(title) {
        return title?.toLowerCase() || '';
    }

    function jobMatches(title, keyword) {
        const lowerTitle = normalizeTitle(title);
        return lowerTitle.includes('job') && lowerTitle.includes(keyword.toLowerCase());
    }

    function isTopPosition(title, keyword) {
        const normalizedTitle = title.trim().toLowerCase();
        const topTitle = topJobTitles[keyword]?.trim().toLowerCase();
        if (normalizedTitle.includes("vice")) return false;
        return normalizedTitle.includes(topTitle);
    }

    function getUserCardFromIcon(icon) {
        return icon.closest('li[class^="user"]');
    }

    function getJobIcons() {
        const icons = Array.from(document.querySelectorAll('li.iconShow[title*="Job"]'));
        console.log(`🔍 Found ${icons.length} job icons`);
        return icons;
    }

    function getActiveFilters() {
        const active = {};
        jobKeywords.forEach(keyword => {
            const checkbox = document.getElementById(`jobToggle-${keyword}`);
            active[keyword] = checkbox?.checked;
        });
        return active;
    }

    function filterUsers() {
        console.log('🔁 Filtering users');
        const activeFilters = getActiveFilters();
        const icons = getJobIcons();
        const allowTop = document.getElementById(`jobToggle-topExempt`)?.checked;

        icons.forEach(icon => {
            const title = icon.getAttribute('title');
            const card = getUserCardFromIcon(icon);
            if (!card) return;

            let shouldHide = false;

            for (const keyword of jobKeywords) {
                if (activeFilters[keyword] && jobMatches(title, keyword)) {
                    if (allowTop && isTopPosition(title, keyword)) {
                        shouldHide = false;
                    } else {
                        shouldHide = true;
                        break;
                    }
                }
            }

            card.style.display = shouldHide ? 'none' : '';
        });
    }

    function createJobCheckbox(keyword) {
        const label = document.createElement('label');
        label.style.marginRight = '12px';
        label.style.fontWeight = 'normal';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `jobToggle-${keyword}`;
        checkbox.style.marginRight = '4px';
        checkbox.addEventListener('change', filterUsers);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`Hide ${keyword}`));
        return label;
    }

    function createMasterCheckbox() {
        const label = document.createElement('label');
        label.style.marginRight = '16px';
        label.style.fontWeight = 'bold';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `jobToggle-master`;
        checkbox.style.marginRight = '6px';
        checkbox.addEventListener('change', () => {
            const checked = checkbox.checked;
            jobKeywords.forEach(keyword => {
                const jobBox = document.getElementById(`jobToggle-${keyword}`);
                if (jobBox) jobBox.checked = checked;
            });
            filterUsers();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`Hide All Blocked Jobs`));
        return label;
    }

    function createTopJobCheckbox() {
        const label = document.createElement('label');
        label.style.marginRight = '16px';
        label.style.fontWeight = 'normal';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `jobToggle-topExempt`;
        checkbox.style.marginRight = '4px';
        checkbox.checked = true;
        checkbox.addEventListener('change', filterUsers);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`Show Top Positions`));
        return label;
    }

    function insertToggles() {
        console.log('⚙️ Attempting to insert toggle UI...');
        const container = document.querySelector('.content-title') || document.querySelector('.title-black');

        if (!container) {
            console.warn('❌ Container not found');
            return;
        }

        if (document.getElementById(toggleGroupId)) {
            console.log('⚠️ Toggle group already exists');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = toggleGroupId;
        wrapper.style.marginTop = '8px';
        wrapper.style.display = 'flex';
        wrapper.style.flexWrap = 'wrap';
        wrapper.style.alignItems = 'center';

        wrapper.appendChild(createMasterCheckbox());
        wrapper.appendChild(createTopJobCheckbox());

        jobKeywords.forEach(keyword => {
            wrapper.appendChild(createJobCheckbox(keyword));
        });

        container.appendChild(wrapper);
        console.log('✅ Toggles inserted');
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                console.log('📦 DOM mutation detected — inserting toggles');
                insertToggles();
                filterUsers();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('👁️ Observer started');

    setTimeout(() => {
        console.log('⏱️ Timeout reached — inserting toggles manually');
        insertToggles();
        filterUsers();
    }, 1000);
})();
