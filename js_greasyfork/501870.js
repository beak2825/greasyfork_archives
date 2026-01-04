// ==UserScript==
// @name         PoE Trade CSS fixes
// @namespace    danbr-scripts
// @version      0.1.6
// @description  Restyles PoE trade website with some colors to make it easier to navigate most common search filters. The code only installs the CSS.
// @author       danrbr
// @match        https://www.pathofexile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @run-at       document-start
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501870/PoE%20Trade%20CSS%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/501870/PoE%20Trade%20CSS%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disabled for POE2
    if (window.location.href.includes("/trade2/")) {
        return
    }

    const panelIndexes = {
        armour: 3,
        sockets: 4,
        attributes: 5,
        map: 6,
        miscellanious: 10,
        tradeFilters: 11,
    };

    const propertiesIndex = {
        strength: 2,
        dexterity: 3,
        intelligence: 4,
        socketscount: 1,
        socketslink: 2,
        armour: 1,
        evasion: 2,
        energyShield: 3,
        quality: 1,
        itemlevel:2,
        arealevel: 5,
        corpsetype: 24,
        crucible: 26,
        synthesised: 8,
        corrupted: 13,
        mirrored: 14,
        foreseeing: 18,
        talismanTier: 19,
        storedExp: 20,
        stackSize: 21,
        altArt: 22,
        foil: 23,
        scourgeTier: 25,
        buyoutPrice: 6,
    };
    const colors = {
        red: '#a04949',
        green: '#49a05c',
        blue: '#4979a0',
        darkRed: '#532525',
        darkGreen: '#24442b',
        darkBlue: '#2c3f4e',
        mirror: '#587670',
        darkGold: '#5f5311',
        disabledGrey: '#4b4b4b',
    };


    const tradeCSSFixes = `
/**** Style inserted by the greasemonkey script 'Poe Trade CSS fixes' ****/

/* Changing background colors of commonly used filters */
div.filter-group:nth-of-type(${panelIndexes.armour}) .filter.filter-property:nth-of-type(${propertiesIndex.armour}) .filter-title  {
    background-color: ${colors.darkRed} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.armour}) .filter.filter-property:nth-of-type(${propertiesIndex.evasion}) .filter-title  {
    background-color: ${colors.darkGreen} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.armour}) .filter.filter-property:nth-of-type(${propertiesIndex.energyShield}) .filter-title  {
    background-color: ${colors.darkBlue} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.attributes}) .filter.filter-property:nth-of-type(${propertiesIndex.strength}) .filter-title  {
    background-color: ${colors.red} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.attributes}) .filter.filter-property:nth-of-type(${propertiesIndex.dexterity}) .filter-title  {
    background-color: ${colors.green} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.attributes}) .filter.filter-property:nth-of-type(${propertiesIndex.intelligence}) .filter-title  {
    background-color: ${colors.blue} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.sockets}) .filter.filter-property:nth-of-type(${propertiesIndex.socketscount}) .filter-title  {
    background-color: ${colors.mirror} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.sockets}) .filter.filter-property:nth-of-type(${propertiesIndex.socketslink}) .filter-title  {
    background-color: ${colors.mirror} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.map}) .filter.filter-property:nth-of-type(${propertiesIndex.arealevel}) .filter-title  {
    background-color: ${colors.darkGold} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.itemlevel}) .filter-title  {
    background-color: ${colors.darkGreen} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.quality}) .filter-title  {
    background-color: ${colors.green} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.synthesised}) .filter-title  {
    background-color: ${colors.darkBlue} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.corrupted}) .filter-title  {
    background-color: ${colors.red} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.mirrored}) .filter-title  {
    background-color: ${colors.mirror} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.tradeFilters}) .filter.filter-property:nth-of-type(${propertiesIndex.buyoutPrice}) .filter-title  {
    background-color: ${colors.darkGold} !IMPORTANT;
}

/* Toning down the text color of the lesser commonly used filters, many of which are only relevant in Standard leagues */
div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.corpsetype}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.crucible}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.foreseeing}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.talismanTier}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.storedExp}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.stackSize}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.altArt}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.foil}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

div.filter-group:nth-of-type(${panelIndexes.miscellanious}) .filter.filter-property:nth-of-type(${propertiesIndex.scourgeTier}) .filter-title  {
    color: ${colors.disabledGrey} !IMPORTANT;
}

/* Changing background of YES, NO options, except for the 'Collapse Listings by Account', since it is No by default, and rarely changed */

div.filter-group:not(:last-child) .multiselect__tags:has(> .multiselect__input[placeholder="Yes"]) {
    background-color: ${colors.darkGreen} !IMPORTANT;
}

div.filter-group:not(:last-child) .multiselect__tags:has(> .multiselect__input[placeholder="No"])  {
    background-color: ${colors.darkRed} !IMPORTANT;
}
    `
    GM_addStyle(tradeCSSFixes)


})();