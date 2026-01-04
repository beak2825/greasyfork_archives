// ==UserScript==
// @name        Demonlords, Gold/Rarity filter
// @namespace   Violentmonkey Scripts
// @match       http://www.demonlords.de/main.php?location=karte*
// @grant       none
// @version     1.3
// @author      Sci
// @description 7/12/2021, 6:24:20 PM
// @downloadURL https://update.greasyfork.org/scripts/429492/Demonlords%2C%20GoldRarity%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/429492/Demonlords%2C%20GoldRarity%20filter.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.addEventListener('load', function () {

    const mapLegend = document.getElementById('maplegend');
    let enableBox = document.createElement('input');
    let rarityPicker = document.createElement('select');
    rarityPicker.style.marginRight = '0.3rem';
    const rarityText = ['🔘', '🟢', '🔵', '🟣', '🟠'];
    for (let i = 0; i < 5; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerText = rarityText[i];
        rarityPicker.appendChild(option);
    }
    enableBox.type = 'checkbox';
    let minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.step = '50';
    minInput.min = '0';
    minInput.style.width = '70px';
    minInput.style.marginRight = '0.3rem';
    let maxInput = minInput.cloneNode();
    let avgDisplay = document.createElement('span');
    mapLegend.parentNode.insertBefore(enableBox, mapLegend);
    mapLegend.parentNode.insertBefore(minInput, mapLegend);
    mapLegend.parentNode.insertBefore(maxInput, mapLegend);
    mapLegend.parentNode.insertBefore(rarityPicker, mapLegend);
    mapLegend.parentNode.insertBefore(document.createElement('br'), mapLegend);
    mapLegend.parentNode.insertBefore(avgDisplay, mapLegend);
    mapLegend.parentNode.insertBefore(document.createElement('br'), mapLegend);
    minInput.value = localStorage.getItem('goldFilterValueMin');
    maxInput.value = localStorage.getItem('goldFilterValueMax');
    enableBox.checked = JSON.parse(localStorage.getItem('filterOn'));
    rarityPicker.value = localStorage.getItem('rarity');
    let currentMax = 0;

    const applyFilter = (min, max) => {
        if (enableBox.checked) {
            min = parseInt(min);
            max = parseInt(max);
            if (min > max) minInput.value = maxInput.value;
            let bounty = 0, rarity = 0, total = 0, sum = 0, sumR = 0;
            let bounties = []
            for (let entry in mapData) {
                if (mapData[entry]['mondata'] != false) {
                    bounty = mapData[entry]['mondata'][mapData[entry]['mondata'].length - 1];
                    rarity = mapData[entry]['mondata'][mapData[entry]['mondata'].length - 2];
                    field = document.getElementById('m' + entry.substring(5));
                    if (!field.src.includes('pink')) {
                        total++;
                        sum += bounty;
                        sumR += rarity;
                        bounties.push(bounty);
                        field.src = (bounty >= min && bounty <= max && rarity >= parseInt(rarityPicker.value)) ? 'images/shared/dl4/grafikpack-full/map/mon.png' : 'images/shared/dl4/grafikpack-full/map/monrot.png';
                    }
                }
            }
            bounties.sort((a, b) => a - b);
            currentMax = bounties[bounties.length - 1];
            avgDisplay.innerText = "Durchschnitt: " + (sum / total).toFixed(0) + " Max: " + currentMax + " Median: " + bounties[(bounties.length / 2).toFixed(0)];
        } else {
            removeFilter();
        }
        localStorage.setItem('goldFilterValueMax', max);
        localStorage.setItem('goldFilterValueMin', min);
    };

    applyFilter(minInput.value, maxInput.value);
    avgDisplay.onclick = (e) => { maxInput.value = currentMax; applyFilter(minInput.value, currentMax); };
    minInput.oninput = (e) => { applyFilter(e.target.value, maxInput.value); };
    maxInput.oninput = (e) => { applyFilter(minInput.value, e.target.value); };
    enableBox.oninput = (e) => { localStorage.setItem('filterOn', enableBox.checked); applyFilter(minInput.value, maxInput.value); };
    rarityPicker.oninput = (e) => { localStorage.setItem('rarity', rarityPicker.value); applyFilter(minInput.value, maxInput.value); };


}, false);

