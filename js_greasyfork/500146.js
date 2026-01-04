// ==UserScript==
// @name         Quore PM Auto Clicker
// @description  Automatically clicks start and finish on PMs within Quore matching given names.  This makes it much easier to close out 80 PMs every month.
// @namespace    https://app.quore.com/
// @match        https://app.quore.com/pm/qpm.php*
// @license      MIT
// @version      2024-06-29
// @downloadURL https://update.greasyfork.org/scripts/500146/Quore%20PM%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/500146/Quore%20PM%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetPMs = [
        'Smoke Detectors (Guest Rooms)',
        'Monthly Fire Extinguisher Log',
        'Monthly Exit Sign Lights Log'
    ];

    const $name = '#pmform > div.pageinfoheader > div.sectitleTxt-Serf';
    const $button = '#pmbuttonfooter > div.circleBase.active:nth-child(1) > div > center';

    console.log('tamper monkey is running');

    //Ignore if this isn't a targetted PM name.
    if (!targetPMs.includes($($name).text())) {
        console.log('not targetted');
        return;
    }

    //Click if button says start, then repeat
    if ($($button).text() === 'Start') {
        console.log('clicking');
        $($button).click();
    }

    //Click if button says close
    if ($($button).text() === 'Close') {
        console.log('clicking');
        $($button).click();
    }


    //Close window when finished.
    if (false) {
        console.log('closing out');
        window.close();
    }

})();