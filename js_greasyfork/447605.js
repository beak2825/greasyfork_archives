// ==UserScript==
// @name         Fix KampusMerdeka Saved Item Bug
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix KampusMerdeka website bug on saved program list page that keeps resetting the data to the first 5 item
// @author       Dhipa
// @match        https://kampusmerdeka.kemdikbud.go.id/profile/saved-items/magang
// @icon         https://kampusmerdeka.kemdikbud.go.id/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447605/Fix%20KampusMerdeka%20Saved%20Item%20Bug.user.js
// @updateURL https://update.greasyfork.org/scripts/447605/Fix%20KampusMerdeka%20Saved%20Item%20Bug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const {fetch: origFetch} = window;
    const blockedUrl = "https://api.kampusmerdeka.kemdikbud.go.id/mbkm/mahasiswa/activities/saved/1?offset=0&limit=5";
    let hasBeenCalled = false;
    window.fetch = async (...args) => {
        if (args[0] === blockedUrl) {
            if (hasBeenCalled) throw new TypeError();
            else hasBeenCalled = true;
        }
        return await origFetch(...args);
    };

})();