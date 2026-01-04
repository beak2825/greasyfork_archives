// ==UserScript==
// @name         Vocabulary.com Auto Speak
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  trigger speak for each word
// @author       hrmthw
// @match        https://www.vocabulary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375458/Vocabularycom%20Auto%20Speak.user.js
// @updateURL https://update.greasyfork.org/scripts/375458/Vocabularycom%20Auto%20Speak.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        this.last_is_mon_hidden = this.last_is_mon_hidden || false;
        var moniDiv = document.getElementsByClassName("wordtools")[0]
        var moniDisp = moniDiv.getAttribute('class')
        var is_mon_hidden = moniDisp.includes('hidden')

        if (is_mon_hidden != this.last_is_mon_hidden && !is_mon_hidden) {
            var lis = document.getElementsByClassName('listen')[0];
            if (lis) lis.click();
        }

        this.last_is_mon_hidden = is_mon_hidden;
    }

    //--- 150 is a good compromise between UI response and browser load.
    window.setInterval(checkForMoniDisplayChange, 250);

})();