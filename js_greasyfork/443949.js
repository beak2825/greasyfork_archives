// ==UserScript==
// @name         Dark Room Hatchery - Update Bios
// @author       https://greasyfork.org/en/users/547396
// @description  A private tool to update hatchery bios with the link back and scry.
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/dragon/*
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/443949/Dark%20Room%20Hatchery%20-%20Update%20Bios.user.js
// @updateURL https://update.greasyfork.org/scripts/443949/Dark%20Room%20Hatchery%20-%20Update%20Bios.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* settings */
    const enable = true,
          salesTab = '1718922',
          hatcheryCode = '[center][url=https://www1.flightrising.com/forums/baz/2810651/1][img]https://i.imgur.com/uqgQ9DC.gif[/img][/url][center]';

    /* elements */
    const editBio = document.getElementById('dragon-profile-edit-bio'),
          breadcrumbs = document.getElementsByClassName('breadcrumbs')[0],
          lairTab = breadcrumbs.getElementsByTagName('a')[1].href.split('/')[5],
          dragonID = document.getElementsByClassName('dragon-profile-header-number')[0].innerText,
          nID = dragonID.substring(2, dragonID.length-1),
          runScript = (salesTab == lairTab && enable) ? init() : false;


    /* lets goooooo */
    function init() {
        let bioBox = document.getElementById('message'),
            currentBio = bioBox.value,
            copiedScry = navigator.clipboard.readText(),
            appendMessage = currentBio + hatcheryCode;

        // do not append if it already exists
        if (!currentBio.includes(hatcheryCode)) {
            const scryElement = document.createElement('iframe');
            scryElement.src = 'https://www1.flightrising.com/scrying/predict/' + nID;
            scryElement.width = '1px';
            scryElement.height = '1px';
            document.body.appendChild(scryElement);

            // apply data
            setTimeout( function() {
                editBio.click();
                bioBox.innerHTML = appendMessage;

                let letsgo = navigator.clipboard.readText().then(
                    clipText => bioBox.innerHTML += clipText
                );

                // save it
                setTimeout( function() {
                    const saveBio = document.getElementById('dragon-profile-save-bio');
                    saveBio.click();
                    document.body.focus();
                }, 2000);

            }, 1500);
        }
    };
})();