// ==UserScript==
// @name         Harvest time tracker simplifier
// @namespace    https://bengrant.dev
// @version      0.2
// @description  Hide the header and footer for a simple tracking experience
// @author       Ben Grant
// @match        https://*.harvestapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410006/Harvest%20time%20tracker%20simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/410006/Harvest%20time%20tracker%20simplifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let header = document.getElementById('global-header');
    let footer = document.getElementById('global-footer');
    let hidden = false;

    function action(hide) {
        if (hide) {
            header.style.display = 'none';
            footer.style.display = 'none';
        } else {
            header.style.display = 'block';
            footer.style.display = 'block';
        }
        hidden = hide;
    }

    action(true);

    document.onkeyup = (e) => {
        if (e.keyCode === 72) { // H
            action(!hidden);
        }
    };
})();