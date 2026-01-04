// ==UserScript==
// @name            ilovemusic.de Adblocker
// @name:de         ilovemusic.de Adblocker
// @version         1.0.3
// @description     Adblocker for ilovemusic.de that disables preroll ads
// @description:de  Adblocker für ilovemusic.de, der die Preroll-Werbungen deaktiviert
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/ilovemusic.de-adblocker
// @license         MIT
// @match           https://ilovemusic.de/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/437559/ilovemusicde%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437559/ilovemusicde%20Adblocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (ilr3 && ilr3.radio && ilr3.radio.preroll) {
        ilr3.radio.preroll.shouldPlay = function() {
            return 0;
        }
    }
})();