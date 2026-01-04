// ==UserScript==
// @name         GC Show/Hide TP Lots in Inventory
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.2
// @description  Adds a toggle to your GC Inventory to show/hide your trading post lots.
// @author       sanjix
// @match        https://www.grundos.cafe/inventory/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489927/GC%20ShowHide%20TP%20Lots%20in%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/489927/GC%20ShowHide%20TP%20Lots%20in%20Inventory.meta.js
// ==/UserScript==
var mainInvent = document.querySelector('.inventory');
var tpText = document.querySelector('p.inv-trading-items-title');
var toggle = document.createElement('span');
toggle.textContent = '▲';
toggle.style.paddingLeft = '3px';
toggle.style.color = '#990000';
console.log(toggle);
var tpLots = document.querySelector('.inventory:last-child');
var toggleLink = document.createElement('a');
toggleLink.className = 'tp-toggle-link';
var rule = document.createElement('hr');
rule.style.backgroundColor = '#990000';
rule.style.height = '3px';
rule.style.display = 'none';

function showHide(el) {
    if (el.style.display == 'grid') {
        toggle.textContent = '▼';
        el.style.display = 'none';
        rule.style.display = 'block';
    } else if (el.style.display == 'none') {
        toggle.textContent = '▲';
        el.style.display = 'grid';
        rule.style.display = 'none';
    }
}

if (tpText != null) {
    tpLots.style.display = 'grid';
    mainInvent.after(toggleLink);
    toggleLink.appendChild(tpText);
    tpText.appendChild(toggle);
    toggleLink.after(rule);
    toggleLink.addEventListener('click',(event) => {
        showHide(tpLots);
    });
}