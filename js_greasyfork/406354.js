// ==UserScript==
// @name         Auto collect Twitch chat bounty
// @version      0.7
// @description  Periodically send emulated mouse click events to the bounty icon of the Twitch chat, which immediatelly collects the bounty.
// @author       fischly
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/662249
// @downloadURL https://update.greasyfork.org/scripts/406354/Auto%20collect%20Twitch%20chat%20bounty.user.js
// @updateURL https://update.greasyfork.org/scripts/406354/Auto%20collect%20Twitch%20chat%20bounty.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intervalID = setInterval(function() {
        let ele = document.querySelector('.community-points-summary').lastElementChild.querySelector('button');
        if (ele) {
            ele.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    }, 2000);
})();