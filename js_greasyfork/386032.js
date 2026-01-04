// ==UserScript==
// @name         Fill Bank Vault
// @namespace    https://greasyfork.org/en/scripts/386032-fill-bank-vault
// @version      1.0
// @description  Gives you several monetary values to pre-fill the property vault fields
// @author       cryosis7 [926640]
// @match        *.torn.com/properties.php*
// @downloadURL https://update.greasyfork.org/scripts/386032/Fill%20Bank%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/386032/Fill%20Bank%20Vault.meta.js
// ==/UserScript==

'use strict'

const amounts = ['1m', '5m', '10m', '20m', '30m'];

setObserver();

/**
 * Watches the properties page and loads the buttons when the vault is visible.
 */
function setObserver() {
    if (document.querySelector('#properties-page-wrap'))
        new MutationObserver(mutations => mutations.forEach(mutation => {
            console.log(mutations)
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('property-option')) {
                    console.log(node);
                    addButtons()
                }
            })
        })).observe(document.querySelector('#properties-page-wrap'), { childList: true })
}

/**
 * Adds the buttons to the dom and a listener on the withdraw/deposit buttons.
 */
function addButtons() {
    if (!document.querySelectorAll('.preset-btn').length) {
        let presetTitle = elementCreator('div', { 'class': 'title-black top-round m-top10', 'role': 'heading', 'aria-level': '5' }, 'Vault Presets')
        let presetButtons = elementCreator('div', { 'class': 'cont-gray bottom-round' })
        amounts.forEach(x => presetButtons.appendChild(elementCreator('button', { 'class': 'torn-btn preset-btn', 'style': 'margin:5px' }, '$' + x)));
        let presetContainer = elementCreator('div', { 'class': 'preset-container-wrap' }, null, [presetTitle, presetButtons]);

        presetContainer.querySelectorAll('.preset-btn').forEach(button => button.addEventListener('click', () => {
            Array.from(document.querySelectorAll('.input-money-group'))
                .filter(inputFields => inputFields.querySelector('[name="withdraw"]') || inputFields.querySelector('[name="deposit"]'))
                .forEach(element => {
                    element.querySelector(['input[type="text"]']).value = button.innerText.replace('$', '');
                    element.querySelector(['input[type="text"]']).click();
                })
        }));

        let vaultNode = document.querySelector('div.vault-wrap');
        vaultNode.parentNode.insertBefore(presetContainer, vaultNode.previousElementSibling);
    }
}

/**
 * Creates an HTML element according to the given parameters
 * 
 * @param {String} type The HTML type to create ('div')
 * @param {Object} attributes Attributes to set {'class': 'wrapper'}
 * @param {String} innerHtml Inner text/html
 * @param {Array} innerElements Any elements to insert into the new node
 */
function elementCreator(type = 'div', attributes, innerHtml, innerElements) {
    let el = document.createElement(type);
    for (let attribute in attributes)
        el.setAttribute(attribute, attributes[attribute])
    if (innerHtml) el.innerHTML = innerHtml;
    for (let index in innerElements)
        el.appendChild(innerElements[index]);
    return el
}