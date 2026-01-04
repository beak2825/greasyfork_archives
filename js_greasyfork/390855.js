// ==UserScript==
// @name         Faction attack exclude
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide attack button from faction member pages
// @author       cooksie
// @match        https://www.torn.com/profiles.php?XID=*
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390855/Faction%20attack%20exclude.user.js
// @updateURL https://update.greasyfork.org/scripts/390855/Faction%20attack%20exclude.meta.js
// ==/UserScript==

const factionSelector = '.info-table li:nth-of-type(3)';
waitForKeyElements(factionSelector, function () {
    if ($(factionSelector).text().includes('Sport Club') || $(factionSelector).text().includes('Sport Club II') || $(factionSelector).text().includes('7th St. Assassins')) {
      $('.profile-button-attack').hide();
    }
});