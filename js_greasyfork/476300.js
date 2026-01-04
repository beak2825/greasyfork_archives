// ==UserScript==
// @name        PassThePopcorn - Hide Collections from missing.php
// @license     MIT
// @namespace   x__a/ptp
// @match       https://passthepopcorn.me/missing.php*
// @grant       none
// @version     1.3
// @author      x__a
// @description Hides missing results containing "/" or "Collection", most of which are collections.
// @downloadURL https://update.greasyfork.org/scripts/476300/PassThePopcorn%20-%20Hide%20Collections%20from%20missingphp.user.js
// @updateURL https://update.greasyfork.org/scripts/476300/PassThePopcorn%20-%20Hide%20Collections%20from%20missingphp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let state;

    main();

    function main() {
        if (!!document.getElementById('ptphc-controls')) {
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = `
            #ptphc-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: .5rem;
            }
            #ptphc-controls > a {
                padding: .7rem .5rem;
                border-radius: .5rem;
                background: rgba(255,255,255, .1);
                line-height: 0;
                border: 1px rgba(0,0,0, .5);
            }
        `;

        document.head.appendChild(style);

        initializeState();
    }

    function initializeState() {
        let savedState = localStorage.getItem('ptphc-state');

        if (savedState) {
            state = JSON.parse(savedState);
        } else {
            state = [
                {
                    id: 1,
                    search: ' / ',
                    hide: true
                },
                {
                    id: 2,
                    search: 'Collection',
                    hide: true
                }
            ];
        }

        updateState();
    }

    function updateState() {
        localStorage.setItem('ptphc-state', JSON.stringify(state));
        createControls();
        processItems();
    }

    function createControls() {
        const currentControls = document.getElementById('ptphc-controls');

        if (currentControls) {
            currentControls.remove();
        }

        let controls = document.createElement('div');
        controls.id = 'ptphc-controls';

        state.forEach(item => {
            let control = document.createElement('a');
            control.href = "#";
            control.setAttribute('data-id', item.id);
            control.innerHTML = `${item.hide ? 'Show' : 'Hide'} titles containing "${item.search}"`;
            control.addEventListener('click', (event) => onToggleOptionState(event));

            controls.appendChild(control);
        })

        document.querySelector('div.pagination--top').append(controls);
    }

    function processItems() {
        document
            .querySelectorAll('table.missing_table > tbody > tr > td > a[title="View Torrent"]')
            .forEach((torrent) => {
                const title = torrent.text
                const filteredItems = state
                    .filter(item => item.hide === true)
                    .map(item => item.search);

                if (title) {
                    torrent.parentNode.parentNode.style.display = null;

                    if (filteredItems.some(item => title.includes(item))) {
                        torrent.parentNode.parentNode.style.display = 'none';
                    }
                }
            });
    }

    function onToggleOptionState(event) {
        event.preventDefault();

        const id = event.target.getAttribute('data-id');
        const option = state.find(option => option.id === parseInt(id));
        const optionIndex = state.indexOf(option)

        let newOptionState = state[optionIndex];
        newOptionState.hide = !option.hide;

        updateState();
    }
})();