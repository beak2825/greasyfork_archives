// ==UserScript==
// @name         Youtube auto translate to Bosnian
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  translate to Bosnian automatically.
// @author       ssait
// @match        https://www.youtube.com/watch*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387488/Youtube%20auto%20translate%20to%20Bosnian.user.js
// @updateURL https://update.greasyfork.org/scripts/387488/Youtube%20auto%20translate%20to%20Bosnian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translateToEnglish(){
        var sub = $('[role="menuitem"]:contains("Subtitles")');
        if(!sub.length) return;
        sub.click();
        var subc = $('[role="menuitemradio"]:contains("Bosnian")');
        if (subc.length) {
            subc.click();
        } else {
            var autoTrans = $('[role="menuitemradio"]:contains("Auto-translate")');
            if (!autoTrans.length) return;
            autoTrans.click();
            var autoTransC = $('[role="menuitemradio"]:contains("Bosnian")');
            if (!autoTransC.length) return;
            autoTransC.click();
        }
    }

    function onLoadStart(){
        $('.ytp-subtitles-button[aria-pressed="false"]').click();
        $('.ytp-settings-button').click();
        translateToEnglish();
        $('.ytp-settings-button').click();
    }
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();