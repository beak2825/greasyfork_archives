// ==UserScript==
// @name         Weapon and Armor stats
// @namespace    somenamespace
// @version      0.1
// @description  records min and max values for def, dmg and acc on the bazaar, auction, market and display case pages.  Stored in localStorage.itemstats as stringified json.
// @author       tos
// @match        *.torn.com/imarket.php*
// @match        *.torn.com/bazaar.php*
// @match        *.torn.com/amarket.php*
// @match        *.torn.com/displaycase.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29116/Weapon%20and%20Armor%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/29116/Weapon%20and%20Armor%20stats.meta.js
// ==/UserScript==

var stats;

loadStats();
function loadStats() {
    if(localStorage.itemstats) {
        stats = JSON.parse(localStorage.itemstats);
    }
    else {
        stats = {};
        alert('WARNING: "itemstats" not loaded from local storage. If this is the first time ');
    }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
        if (node.className) {
            var itemID;
            var acc = node.querySelector('.bonus-attachment-item-accuracy-bonus');
            var dmg = node.querySelector('.bonus-attachment-item-damage-bonus');
            var def = node.querySelector('.bonus-attachment-item-defence-bonus');
            if (acc) {
                loadStats();
                itemID = node.querySelector('.value-chart').getAttribute('itemID').replace('value-chart-', '');
                var accVal = parseFloat(acc.nextSibling.nodeValue);
                if (!stats[itemID]) {stats[itemID] = { 'acc': {'min': null, 'max': null}, 'dmg': {'min': null, 'max': null}, 'def': {'min': null, 'max': null}}; }
                if (stats[itemID].acc.min > accVal || stats[itemID].acc.min === null) {
                    stats[itemID].acc.min = accVal;
                    console.log('New min acc on ', itemID, accVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
                if (stats[itemID].acc.max < accVal || stats[itemID].acc.max === null) {
                    stats[itemID].acc.max = accVal;
                    console.log('New max acc on ', itemID, accVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
            }
            if (dmg) {
                loadStats();
                itemID = node.querySelector('.value-chart').getAttribute('itemID').replace('value-chart-', '');
                var dmgVal = parseFloat(dmg.nextSibling.nodeValue);
                if (!stats[itemID]) {stats[itemID] = { 'acc': {'min': null, 'max': null}, 'dmg': {'min': null, 'max': null}, 'def': {'min': null, 'max': null}}; }
                if (stats[itemID].dmg.min > dmgVal || stats[itemID].dmg.min === null) {
                    stats[itemID].dmg.min = dmgVal;
                    console.log('New min dmg on ', itemID, dmgVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
                if (stats[itemID].dmg.max < dmgVal || stats[itemID].dmg.max === null) {
                    stats[itemID].dmg.max = dmgVal;
                    console.log('New max dmg on ', itemID, dmgVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
            }
            if (def) {
                loadStats();
                itemID = node.querySelector('.value-chart').getAttribute('itemID').replace('value-chart-', '');
                var defVal = parseFloat(def.nextSibling.nodeValue);
                if (!stats[itemID]) {stats[itemID] = { 'acc': {'min': null, 'max': null}, 'dmg': {'min': null, 'max': null}, 'def': {'min': null, 'max': null}}; }
                if (stats[itemID].def.min > defVal || stats[itemID].def.min === null) {
                    stats[itemID].def.min = defVal;
                    console.log('New min def on ', itemID, defVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
                if (stats[itemID].def.max < defVal || stats[itemID].def.max === null) {
                    stats[itemID].def.max = defVal;
                    console.log('New max def on ', itemID, defVal);
                    localStorage.setItem('itemstats', JSON.stringify(stats));
                }
            }
        }
    }
  }
});

const marketWrap = document.querySelector('#item-market-main-wrap');
const bazaarWrap = document.querySelector('#bazaar-page-wrap');
const auctionWrap = document.querySelector('#auction-house-tabs');
const displaycaseWrap = document.querySelector('#display-page-wrap');

if (marketWrap) { observer.observe(marketWrap, { subtree: true, childList: true }); }
if (bazaarWrap) { observer.observe(bazaarWrap, { subtree: true, childList: true }); }
if (auctionWrap) { observer.observe(auctionWrap, { subtree: true, childList: true }); }
if (displaycaseWrap) { observer.observe(displaycaseWrap, { subtree: true, childList: true }); }




