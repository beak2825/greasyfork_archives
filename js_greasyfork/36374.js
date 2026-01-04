// ==UserScript==
// @name         Linkshrink-skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically skips linkshrink without wait
// @author       giuseppe-dandrea
// @match        http*://linkshrink.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36374/Linkshrink-skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/36374/Linkshrink-skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    linkshrink_bypass();


    function linkshrink_bypass() {
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            if ($('#btd').length === 1) {
                $('#btd').trigger('click');
                window.close();
            }
            else {
                linkshrink_bypass();
            }
        });
}
})();