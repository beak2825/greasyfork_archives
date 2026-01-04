// ==UserScript==
// @name         Idle Ant Farm Auto Clicker (Full Config + Tab Cycler + Save State)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Auto-click Upgrade, Buy, Purchase buttons, and cycle-click tabs (Colony, Evolution, Adventure) on idle-ant-farm.com. Remembers settings.
// @match        https://idle-ant-farm.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531866/Idle%20Ant%20Farm%20Auto%20Clicker%20%28Full%20Config%20%2B%20Tab%20Cycler%20%2B%20Save%20State%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531866/Idle%20Ant%20Farm%20Auto%20Clicker%20%28Full%20Config%20%2B%20Tab%20Cycler%20%2B%20Save%20State%29.meta.js
// ==/UserScript==


// Tampermonkey @run-at document-start
document.addEventListener('beforeload', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SOURCE') {
        e.preventDefault();
    }
}, true);


(function() {
    'use strict';

    const STORAGE_KEY = 'idleAntFarmSettings';

    const CONFIG = [{
            label: 'Auto Buy Evolution',
            match: (btn) => {
                const text = btn.textContent.trim().toLowerCase();
                return text.includes('transform') ;
            },
            highlight: 'yellow',
            interval: 1000
        },{
            label: 'Auto Buy Evolution max',
            match: (btn) => {
                const text = btn.textContent.trim().toLowerCase();
                return text.includes('buy max');
            },
            highlight: 'yellow',
            interval: 1000
        },
        {
            label: 'Auto Buy Column',
            match: (btn) => btn.textContent.trim().toLowerCase().includes('buy for'),
            highlight: 'yellow'
        },
        {
            label: 'Auto buy Adventure',
            match: (btn) => btn.textContent.trim().toLowerCase().includes('max all'),
            highlight: 'yellow'
        },
        {
            label: 'Auto Abandon Quest (bug)',
            match: () => {
                const bodyText = document.body.textContent.toLowerCase();
                const bugPhrases = ['50,000 bug', '150,000 bug', 'at 10,000 bugs', 'efeat 1,500 ', 'efeat 2,500 ', 'feat 750 ', 'efeat 1,000', 'efeat 500 ', 'ollect 1e1000 fo'];
                return bugPhrases.some(phrase => bodyText.includes(phrase));
            },
            getTarget: () => {
                return [...document.querySelectorAll('button')].find(btn =>
                    btn.textContent.toLowerCase().includes('abandon quest')
                );
            },
            highlight: 'yellow',
            interval: 300
        },
        {
            label: 'Upgrade Digestive Efficiency',
            match: (btn) => {
                const container = btn.closest('.upgrade-card');
                if (!container) return false;
                const headerText = container.querySelector('h3')?.textContent || '';
                return headerText.includes('Digestive Efficiency') &&
                    btn.textContent.trim() === 'Upgrade (1 level)';
            },
            highlight: 'yellow'
        },
        {
            label: 'Upgrade Colony Coordination',
            match: (btn) => {
                const container = btn.closest('.upgrade-card');
                if (!container) return false;
                const headerText = container.querySelector('h3')?.textContent || '';
                return headerText.includes('Colony Coordination') &&
                    btn.textContent.trim() === 'Upgrade (1 level)';
            },
            highlight: 'yellow'
        },
        {
            label: 'Upgrade Pheromone Enhancement',
            match: (btn) => {
                const container = btn.closest('.upgrade-card');
                if (!container) return false;
                const headerText = container.querySelector('h3')?.textContent || '';
                return headerText.includes('Pheromone Enhancement') &&
                    btn.textContent.trim() === 'Upgrade (1 level)';
            },
            highlight: 'yellow'
        },
        {
            label: 'Click Metamorphose',
            match: (btn) => btn.textContent.trim().toLowerCase().includes('metamorphose'),
            highlight: 'yellow'
        },
        {
            label: 'Click Queue All Filtered',
            match: (btn) => btn.textContent.trim().toLowerCase().includes('queue all filtered'),
            highlight: 'yellow',
            getTarget: () => {
                return [...document.querySelectorAll('button')].find(btn =>
                    btn.textContent.trim().toLowerCase().includes('queue all filtered')
                );
            },
            interval: 1000
        },
        {
            label: 'Click Ascend or Confirm Ascension',
            match: (btn) => {
                return btn.textContent.trim().toLowerCase().includes('ascend') ||
                    btn.textContent.trim().toLowerCase().includes('confirm ascension');
            },
            highlight: 'lime',
            getTarget: () => {
                return [...document.querySelectorAll('button')].find(btn =>
                    btn.textContent.trim().toLowerCase().includes('ascend') ||
                    btn.textContent.trim().toLowerCase().includes('confirm ascension')
                );
            },
            interval: 1000
        },
        {
            label: 'Click Feed All',
            match: (btn) => btn.textContent.trim().toLowerCase().includes('eed all'),
            highlight: 'orange',
            getTarget: () => {
                return [...document.querySelectorAll('button')].find(btn =>
                    btn.textContent.trim().toLowerCase().includes('feed all')
                );
            },
            interval: 1000
        },

        {
            label: 'Click Auto Feed Button',
            match: () => {
                // Look for a div containing the text "Auto Feed"
                const autoFeedDiv = [...document.querySelectorAll('span')]
                    .find(span => span.textContent.includes('Auto Feed'));
                return autoFeedDiv !== null;
            },
            highlight: 'orange',
            getTarget: () => {

                const autoFeedDiv = [...document.querySelectorAll('span')]
                    .find(span => span.textContent.includes('Auto Feed'));

                if (autoFeedDiv) {
                    const button = autoFeedDiv.closest('div.flex')?.querySelector('button');
                    // Check if the button has the class 'bg-gray-300'
                    if (button && button.classList.contains('bg-gray-300')) {
                        return button;
                    }
                }
                return null;
            },
            interval: 500 // Click every 1 second
        },

        {
            label: 'Click Auto Feed Essence Button',
            match: () => {
                // Look for a div containing the text "Auto Feed"
                const autoFeedDiv = [...document.querySelectorAll('span')]
                    .find(span => span.textContent.includes('Auto Feed (1% of essence'));
                return autoFeedDiv !== null;
            },
            highlight: 'orange',
            getTarget: () => {

                const autoFeedDiv = [...document.querySelectorAll('span')]
                    .find(span => span.textContent.includes('Auto Feed (1% of essence'));

                if (autoFeedDiv) {
                    const button = autoFeedDiv.closest('div.flex')?.querySelector('button');
                    // Check if the button has the class 'bg-gray-300'
                    if (button && button.classList.contains('bg-gray-300')) {
                        return button;
                    }
                }
                return null;
            },
            interval: 500 // Click every 1 second
        },


    ];

    const TAB_LABELS = ['evolution', 'colony', 'adventure', 'shop', 'quests', 'mega ant','colony'];
    const TAB_HIGHLIGHT = 'deepskyblue';
    const modal = document.createElement('div');

    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    Object.assign(modal.style, {
        position: 'fixed',
        top: '100px',
        left: '20px',
        zIndex: '9999',
        backgroundColor: '#333',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '300px',
        display: 'none'
    });
    document.body.appendChild(modal);

    const intervals = {};

    const saveState = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSettings));
    };

    const simulateClick = (el) => {
        ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            el.dispatchEvent(evt);
        });
    };

    const createButton = (config) => {
        const {
            label,
            match,
            highlight,
            getTarget
        } = config;
        const btn = document.createElement('button');
        btn.setAttribute('data-tm-created', 'true');
        Object.assign(btn.style, {
            padding: '6px 10px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f44336',
            color: '#fff'
        });

        const toggle = () => {
            const isRunning = !!intervals[label];
            if (isRunning) {
                clearInterval(intervals[label]);
                delete intervals[label];
                btn.textContent = `${label}: OFF`;
                btn.style.backgroundColor = '#f44336';
                savedSettings[label] = false;
            } else {
                intervals[label] = setInterval(() => {
                    let target;

                    if (typeof match === 'function' && !match.length) {
                        if (match()) {
                            target = typeof getTarget === 'function' ? getTarget() : null;
                        }
                    } else {
                        let elements = [...document.querySelectorAll('button')].filter(el =>
                            el.offsetParent !== null &&
                            !el.hasAttribute('data-tm-created') &&
                            match(el)
                        );
                        target = elements[elements.length - 1];
                    }

                    if (target) {
                        const original = target.style.backgroundColor;
                        target.style.backgroundColor = highlight || 'lime';
                        simulateClick(target);
                        setTimeout(() => {
                            target.style.backgroundColor = original;
                        }, 300);
                    }
                }, typeof config.interval === 'number' ? config.interval : 50);

                btn.textContent = `${label}: ON`;
                btn.style.backgroundColor = '#4CAF50';
                savedSettings[label] = true;
            }
            saveState();
        };

        btn.addEventListener('click', toggle);
        modal.appendChild(btn);

        if (savedSettings[label]) toggle();
        else btn.textContent = `${label}: OFF`;
    };

    CONFIG.forEach(createButton);

    (function setupTabCycler() {
        const label = 'Cycle Tabs';
        const btn = document.createElement('button');
        btn.setAttribute('data-tm-created', 'true');
        Object.assign(btn.style, {
            padding: '6px 10px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f44336',
            color: '#fff'
        });
        modal.appendChild(btn);

        let active = false;
        let index = 0;

        const cycle = async () => {
            if (!active) return;

            const targetText = TAB_LABELS[index].toLowerCase();

            // Try to find a visible <a> tag first
            let link = [...document.querySelectorAll('a')].find(a =>
                a.offsetParent !== null &&
                a.textContent.trim().toLowerCase().includes(targetText)
            );

            // If no visible <a> found, try a <button>, even if it's hidden
            if (!link) {
                link = [...document.querySelectorAll('button')].find(btn =>
                    btn.textContent.trim().toLowerCase().includes(targetText)
                );
            }

            if (link) {
                const original = link.style.backgroundColor;
                link.style.backgroundColor = TAB_HIGHLIGHT;
                simulateClick(link);
                setTimeout(() => {
                    link.style.backgroundColor = original;
                }, 300);
            }

            index = (index + 1) % TAB_LABELS.length;
            setTimeout(cycle, 5000);
        };


        const toggle = () => {
            active = !active;
            if (active) {
                btn.textContent = `${label}: ON`;
                btn.style.backgroundColor = '#4CAF50';
                savedSettings[label] = true;
                cycle();
            } else {
                btn.textContent = `${label}: OFF`;
                btn.style.backgroundColor = '#f44336';
                savedSettings[label] = false;
            }
            saveState();
        };

        btn.addEventListener('click', toggle);
        if (savedSettings[label]) toggle();
        else btn.textContent = `${label}: OFF`;
    })();

    const toggleModalBtn = document.createElement('button');
    toggleModalBtn.textContent = 'Show Config';
    Object.assign(toggleModalBtn.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: '9999',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    });
    document.body.appendChild(toggleModalBtn);

    toggleModalBtn.addEventListener('click', () => {
        const isHidden = modal.style.display === 'none';
        modal.style.display = isHidden ? 'flex' : 'none';
        toggleModalBtn.textContent = isHidden ? 'Hide Config' : 'Show Config';
    });
})();