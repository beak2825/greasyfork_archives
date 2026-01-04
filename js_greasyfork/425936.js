// ==UserScript==
// @name         SAMissionReminder
// @namespace    bzzt
// @version      0.0.4
// @description  Remind about mission when landing in South Africa. Disable mouse clicks until the correct text is entered
// @author       bzzt [2465413]
// @match        *.torn.com/index.php
// @run-at       document-idle   // document-idle is the default run-at setting
// @downloadURL https://update.greasyfork.org/scripts/425936/SAMissionReminder.user.js
// @updateURL https://update.greasyfork.org/scripts/425936/SAMissionReminder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const country = document.getElementById('skip-to-content');
    if (country && country.innerText.match(/South Africa/)) {
        var blockingdiv = document.createElement('div');
        blockingdiv.style = 'background-color: rgba(127, 1, 1, 0.333); position: fixed; bottom: 0; left: 0; right: 0; top: 0; z-index:1000000';
        document.body.appendChild(blockingdiv);
        var chk = '';
        while (chk != 'mission') {
            chk = prompt('Remember the mission.\n\nType "mission"');
        }
        blockingdiv.parentNode.removeChild(blockingdiv);
    }
})();
