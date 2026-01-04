// ==UserScript==
// @name         Map Controls Hide
// @namespace    https://lazerpent.com
// @version      1.0
// @description  Toggle the display of the Torn map controls
// @author       Lazerpent
// @match        https://www.torn.com/city.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504889/Map%20Controls%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/504889/Map%20Controls%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stateKey = 'hide-controls';

    const style = document.createElement('style');
    style.textContent = `
        .hidden-container .leaflet-control-container {
            display: none;
        }
    `;
    document.head.appendChild(style);

    function injectSwitch() {
        const mapContainer = document.getElementById('map-cont');
        if (mapContainer && !document.getElementById('controls-switcher')) {
            const toggleHTML = document.createElement('div');
            toggleHTML.className = 'territory-info-toggle white-grad border-round m-top10 p10 t-gray-6';
            toggleHTML.innerHTML = `
                <div class="info">
                    <span class="inactive-mode hide">
                        Enable to hide map controls.
                    </span>
                    <span class="active-mode">
                        Map controls are being hidden.
                    </span>
                </div>
                <div class="btn-toggle-wrap torn-switcher">
                    <input type="checkbox" id="controls-switcher" switch="" class="active">
                    <label for="controls-switcher" data-on-label="on" data-off-label="off"></label>
                </div>`;
            mapContainer.appendChild(toggleHTML);

            const switcher = toggleHTML.querySelector('#controls-switcher');

            const savedState = localStorage.getItem(stateKey);
            const isHidden = savedState === 'true';
            switcher.checked = isHidden;
            applyState(isHidden, mapContainer, toggleHTML);

            switcher.addEventListener('change', function() {
                const newState = this.checked;
                localStorage.setItem(stateKey, newState);
                applyState(newState, mapContainer, toggleHTML);
            });
        }
    }

    function applyState(isHidden, mapContainer, toggleHTML) {
        if (isHidden) {
            mapContainer.classList.add('hidden-container');
            toggleHTML.querySelector('.inactive-mode').classList.add('hide');
            toggleHTML.querySelector('.active-mode').classList.remove('hide');
        } else {
            mapContainer.classList.remove('hidden-container');
            toggleHTML.querySelector('.inactive-mode').classList.remove('hide');
            toggleHTML.querySelector('.active-mode').classList.add('hide');
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                injectSwitch();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    injectSwitch();
})();