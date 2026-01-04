// ==UserScript==
// @name         Highlight enemy profile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hightlights the profile container if user is an enemy
// @author       cookctorn
// @match        https://www.torn.com/profiles.php?XID=*
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390294/Highlight%20enemy%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/390294/Highlight%20enemy%20profile.meta.js
// ==/UserScript==

const container = '.profile-buttons .profile-container';
waitForKeyElements(container, function () {
    if ($(container).find('.profile-button-addToEnemyList.red').length) {
       $(container).css('background-color', 'red');
    }
});