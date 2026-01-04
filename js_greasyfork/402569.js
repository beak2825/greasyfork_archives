// ==UserScript==
// @name         Gym Tab Hider
// @namespace    https://greasyfork.org/users/191331
// @version      2.2
// @description  Hide unwanted gym stats
// @author       FATU [1482556] | Re-designed by cryosis7 [926640]
// @match        https://www.torn.com/gym.php
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/402569/Gym%20Tab%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/402569/Gym%20Tab%20Hider.meta.js
// ==/UserScript==

'use strict'

window.onload = run;

async function run() {
    while (!document.querySelectorAll('div[class^="gymContent"] li').length)
        await new this.Promise(resolve => this.setTimeout(resolve, 50))

    insertCheckboxes();
    addCheckboxListeners();
    initialiseStoredSettings();
}

/**
 * Adds checkboxes into each gym stat
 */
function insertCheckboxes() {
    let statBoxes = document.querySelectorAll('div[class^="gymContent"] li');
    statBoxes.forEach(stat => {
        let statName = stat.className.split('_')[0];
        let checkbox = elementCreator('input', { type: 'checkbox', id: statName, name: statName, style: 'margin-right: 5px; vertical-align: middle' });
        let label = elementCreator('label', { for: statName, style: 'vertical-align: middle' }, '<b>Disable this stat?</b>');
        let checkboxWrapper = elementCreator('div', { style: 'margin: 5px' });
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        stat.querySelector('[class^="description"]').append(checkboxWrapper);
    });
}

/**
 * Goes through each checkbox, adding a listener to each one which will disable the gym stat when clicked.
 */
function addCheckboxListeners() {
    document.querySelectorAll('div[class^="gymContent"] input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let trainBox = document.querySelector(`li[class^="${checkbox.name}"] div[class^="inputWrapper"]`).parentElement;
            if (checkbox.checked) {
                trainBox.style['pointer-events'] = 'none';
                trainBox.style.opacity = '0.5';
            }
            else {
                trainBox.style['pointer-events'] = 'auto';
                trainBox.style.opacity = '1';
            }

            updateStoredSettings();
        });
    });
}

/**
 * Stores the checkbox settings in local memory.
 */
function updateStoredSettings() {
    let settings = {}
    document.querySelectorAll('div[class^="gymContent"] input[type="checkbox"]').forEach(checkbox => settings[checkbox.name] = checkbox.checked);

    GM_setValue('gymTabHiderSettings', settings);
}

/**
 * Retrieves the stored settings and initialises the checkboxes.
 */
function initialiseStoredSettings() {
    let storedSettings = GM_getValue('gymTabHiderSettings', {});
    for (let stat in storedSettings)
        if (storedSettings[stat]) {
            document.querySelector(`input[type="checkbox"][id=${stat}]`).checked = true;
            
            let trainBox = document.querySelector(`li[class^="${stat}"] div[class^="inputWrapper"]`).parentElement;
            trainBox.style['pointer-events'] = 'none';
            trainBox.style.opacity = '0.5';
        }
}


/**
 * Creates an HTML element according to the given parameters
 * 
 * @param {String} type The HTML type to create ('div')
 * @param {Object} attributes Attributes to set {'class': 'wrapper'}
 * @param {String} html 'Inner text/html to set'
 */
function elementCreator(type = 'div', attributes, html) {
    let el = document.createElement(type);
    for (let attribute in attributes)
        el.setAttribute(attribute, attributes[attribute])
    if (html) el.innerHTML = html;
    return el
}