// ==UserScript==
// @name         Moomoo.io 1.8.0 HUE Hider & Interactive Menu
// @version      1
// @description  Toggle a menu with the "Esc" key, where you can choose items to delete or keep, hide or reveal everything.
// @author       seryo
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478573/Moomooio%20180%20HUE%20Hider%20%20Interactive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/478573/Moomooio%20180%20HUE%20Hider%20%20Interactive%20Menu.meta.js
// ==/UserScript==

function sco() {
    return document.activeElement.id.toLowerCase() === 'chatbox';
}

function saia() {
    return document.activeElement.id.toLowerCase() === 'allianceinput';
}

function samo() {
    return document.activeElement.id.toLowerCase() === 'alliancemenu';
}

function shhk() {
    return !sco() && !saia();
}

function anshhk () {
    return !sco() && !samo();
}

(function() {
    const menuContainer = document.createElement('div');
    Object.assign(menuContainer.style, {
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fontFamily: 'Hammersmith One, sans-serif',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        overflowY: 'auto',
        maxHeight: '80%',
    });
    menuContainer.innerHTML = `
    <h1 style="font-size: 28px;">HUE Hider</h1>
    <hr>
    ${generateDropdown('Materials', ['food', 'wood', 'stone', 'gold'])}
    <hr>
    ${generateDropdown('Icons', ['actionBars', 'chatButton', 'shopMenu', 'allianceMenu'])}
    <hr>
    ${generateDropdown('Others', ['ageText', 'ageBar', 'minimap', 'leaderboard', 'killCounter', 'pingDisplay'])}
    <hr>
    <button id="hideAllButton">Hide All</button>
    <button id="showAllButton">Show All</button>
`;

function generateDropdown(title, checkboxes) {
    return `
        <div>
            <p class="dropdown">${title}</p>
            <div class="dropdown-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out;">
                ${checkboxes.map(checkbox => `
                    <label><input type="checkbox" checked id="${checkbox}Checkbox"> ${capitalizeFirstLetter(checkbox)}</label><br>
                `).join('')}
            </div>
        </div>
    `;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const dropdowns = menuContainer.querySelectorAll('.dropdown-content');
const dropdownTriggers = menuContainer.querySelectorAll('.dropdown');

dropdownTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', function() {
        const content = dropdowns[index];
        if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
            dropdowns.forEach((dropdown, i) => {
                if (i !== index) {
                    dropdown.style.maxHeight = "0";
                }
            });

            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = "0";
        }
    });
});

document.body.appendChild(menuContainer);

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 && anshhk() && storeMenu.style.display !== 'block') {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'block';
        } else {
            menuContainer.style.display = 'none';
            dropdowns.forEach(dropdown => {
                dropdown.style.maxHeight = '0';
            });
        }
    }
});

const foodCheckbox = document.getElementById('foodCheckbox');
const woodCheckbox = document.getElementById('woodCheckbox');
const stoneCheckbox = document.getElementById('stoneCheckbox');
const goldCheckbox = document.getElementById('goldCheckbox');
const actionBarsCheckbox = document.getElementById('actionBarsCheckbox');
const chatButtonCheckbox = document.getElementById('chatButtonCheckbox');
const shopMenuCheckbox = document.getElementById('shopMenuCheckbox');
const allianceMenuCheckbox = document.getElementById('allianceMenuCheckbox');
const ageTextCheckbox = document.getElementById('ageTextCheckbox');
const ageBarCheckbox = document.getElementById('ageBarCheckbox');
const minimapCheckbox = document.getElementById('minimapCheckbox');
const leaderboardCheckbox = document.getElementById('leaderboardCheckbox');
const killCounterCheckbox = document.getElementById('killCounterCheckbox');
const pingDisplayCheckbox = document.getElementById('pingDisplayCheckbox');

function toggleElementVisibility(elementId, shouldShow) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = shouldShow ? 'block' : 'none';
    }
}

foodCheckbox.addEventListener('change', function() {
    toggleElementVisibility('foodDisplay', foodCheckbox.checked);
});

woodCheckbox.addEventListener('change', function() {
    toggleElementVisibility('woodDisplay', woodCheckbox.checked);
});

stoneCheckbox.addEventListener('change', function() {
    toggleElementVisibility('stoneDisplay', stoneCheckbox.checked);
});

goldCheckbox.addEventListener('change', function() {
    toggleElementVisibility('scoreDisplay', goldCheckbox.checked);
});

actionBarsCheckbox.addEventListener('change', function() {
    toggleElementVisibility('actionBar', actionBarsCheckbox.checked);
});

chatButtonCheckbox.addEventListener('change', function() {
    toggleElementVisibility('chatButton', chatButtonCheckbox.checked);
});

shopMenuCheckbox.addEventListener('change', function() {
    toggleElementVisibility('storeButton', shopMenuCheckbox.checked);
});

allianceMenuCheckbox.addEventListener('change', function() {
    toggleElementVisibility('allianceButton', allianceMenuCheckbox.checked);
});

ageTextCheckbox.addEventListener('change', function() {
    toggleElementVisibility('ageText', ageTextCheckbox.checked);
});

ageBarCheckbox.addEventListener('change', function() {
    toggleElementVisibility('ageBarContainer', ageBarCheckbox.checked);
});

minimapCheckbox.addEventListener('change', function() {
    toggleElementVisibility('mapDisplay', minimapCheckbox.checked);
});

leaderboardCheckbox.addEventListener('change', function() {
    toggleElementVisibility('leaderboard', leaderboardCheckbox.checked);
});

killCounterCheckbox.addEventListener('change', function() {
    toggleElementVisibility('killCounter', killCounterCheckbox.checked);
});

pingDisplayCheckbox.addEventListener('change', function() {
    toggleElementVisibility('pingDisplay', pingDisplayCheckbox.checked);
});

function toggleAllElements(checked) {
    const checkboxes = [
        foodCheckbox, woodCheckbox, stoneCheckbox, goldCheckbox,
        actionBarsCheckbox, chatButtonCheckbox, shopMenuCheckbox,
        allianceMenuCheckbox, ageTextCheckbox, ageBarCheckbox,
        minimapCheckbox, leaderboardCheckbox, killCounterCheckbox,
        pingDisplayCheckbox
    ];

    checkboxes.forEach(checkbox => checkbox.checked = checked);

    const elementsToToggle = [
        'foodDisplay', 'woodDisplay', 'stoneDisplay', 'scoreDisplay',
        'actionBar', 'chatButton', 'storeButton', 'allianceButton',
        'ageText', 'ageBarContainer', 'mapDisplay', 'leaderboard',
        'killCounter', 'pingDisplay'
    ];

    elementsToToggle.forEach(element => toggleElementVisibility(element, checked));
}

const hideAllButton = document.getElementById('hideAllButton');
hideAllButton.addEventListener('click', function() {
    toggleAllElements(false);
});

const showAllButton = document.getElementById('showAllButton');
showAllButton.addEventListener('click', function() {
    toggleAllElements(true);
});
})();