// ==UserScript==
// @name         NetFlix Auto-Skip Intro
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically skips the intro on Netflix if the "Skip" button is present.
// @author       NineSun Development
// @match        https://www.netflix.com/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397009/NetFlix%20Auto-Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/397009/NetFlix%20Auto-Skip%20Intro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const skip = document.querySelector('.skip-credits > a');
        if ( skip ){
            skip.click();
        }
    }, 250);
})();