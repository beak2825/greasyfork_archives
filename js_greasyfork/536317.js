// ==UserScript==
// @name         RadioGoose Stations
// @namespace    rgenchantement
// @version      1.5
// @description  Affiche les stations 
// @author       veho
// @match        https://radiogoose.ru/play/
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536317/RadioGoose%20Stations.user.js
// @updateURL https://update.greasyfork.org/scripts/536317/RadioGoose%20Stations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles
    GM_addStyle(`
        .radio-goose-stations {
            position:fixed;left:20px;bottom:20px;z-index:9999;max-width:300px;
            background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);
            border:1px solid #ff4500;border-radius:12px;padding:15px;
        }
        .stations-title {
            color:#ff4500;font-size:1.2em;text-align:center;margin-bottom:10px;
        }
        .stations-list {
            display:grid;gap:8px;max-height:60vh;overflow-y:auto;
        }
        .station-item {
            padding:10px;border:1px solid #ff450033;border-radius:6px;
            background:transparent;color:#fff;cursor:pointer;
            transition:all 0.2s ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .station-item:hover {
            border-color:#ff4500;background:rgba(255,69,0,0.1);
        }
        .station-item.active {
            border-color:#ff4500;background:rgba(255,69,0,0.1);
            box-shadow:0 0 8px rgba(255,69,0,0.3);
        }
    `);

    const stationNamesMap = {
        "radiogoose": "Goose Radio",
        "bigroom": "Goose Bigroom",
        "dancecore": "Goose Denscore",
        "deep": "Goose Deep House",
        "drum": "Goose Drum",
        "electro": "Goose Electro",
        "hardstyle": "Goose Hardstyle",
        "midtempo": "Goose Midtempo",
        "oldschool": "Goose Oldschool",
        "phonk": "Goose Phonk",
        "rock": "Goose Rock",
        "rus": "Goose Rus",
        "technorave": "Goose Techno",
        "trance": "Goose Trance",
        "moscow_madness": "Moscow Madness"
    };

    function createList() {
        const container = document.createElement('div');
        container.className = 'radio-goose-stations';
        container.innerHTML = `<div class="stations-title">            <img src="https://image.noelshack.com/fichiers/2025/22/1/1748267933-music-note-icon-orange-neon-260nw-1129600895-removebg-preview.png"
                 alt="music icon"
                 style="height: 30px; display: inline-block; vertical-align: middle; margin-right: 5px;;"> Stations Disponibles</div><div class="stations-list"></div>`;
        document.body.appendChild(container);
        return container;
    }

    function fillStations(container) {
        const list = container.querySelector('.stations-list');
        list.innerHTML = '';
        document.querySelectorAll('#stations .station').forEach(button => {
            const hash = button.getAttribute('data-hash');
            const name = stationNamesMap[hash] || button.textContent.trim();
            const btn = document.createElement('button');
            btn.className = 'station-item';
            btn.dataset.hash = hash;
            btn.textContent = name;
            btn.onclick = () => button.click();
            list.appendChild(btn);
        });
    }

    function updateHighlight(container) {
        const list = container.querySelector('.stations-list');
        container.querySelectorAll('.station-item').forEach(btn => {
            const hash = btn.dataset.hash;
            const original = document.querySelector(`#stations .station[data-hash="${hash}"]`);
            const isActive = original?.classList.contains('is-active');
            btn.classList.toggle('active', isActive);

            if (isActive && !isInViewport(btn)) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        const parent = el.closest('.stations-list');
        const parentRect = parent.getBoundingClientRect();
        return rect.top >= parentRect.top && rect.bottom <= parentRect.bottom;
    }

    function observeChanges(container) {
        new MutationObserver(() => {
            fillStations(container);
            updateHighlight(container);
        }).observe(document.querySelector('#stations'), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Initialisation
    setTimeout(() => {
        const container = createList();
        fillStations(container);
        updateHighlight(container);
        observeChanges(container);
    }, 3000);
})();