// ==UserScript==
// @name         Youtube auto traslate in italiano
// @namespace    https://greasyfork.org/users/237458
// @version      0.2
// @description  traslate  automatica
// @author       figuccio
// @namespace    https://greasyfork.org/users/237458
// @match        https://*.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390205/Youtube%20auto%20traslate%20in%20italiano.user.js
// @updateURL https://update.greasyfork.org/scripts/390205/Youtube%20auto%20traslate%20in%20italiano.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translateToEnglish(){
        var sub = $('[role="menuitem"]:contains("Subtitles")');
        if(!sub.length) return;
        sub.click();
        var subc = $('[role="menuitemradio"]:contains("Italian")');
        if (subc.length) {
            subc.click();
        } else {
            var autoTrans = $('[role="menuitemradio"]:contains("Auto-translate")');
            if (!autoTrans.length) return;
            autoTrans.click();
            var autoTransC = $('[role="menuitemradio"]:contains("Italian")');
            if (!autoTransC.length) return;
            autoTransC.click();
        }
    }

    function onLoadStart(){
        $('.ytp-subtitles-button[aria-pressed="false').click();
        $('.ytp-settings-button').click();
        translateToEnglish();
        $('.ytp-settings-button').click();
    }
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();

