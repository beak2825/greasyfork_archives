// ==UserScript==
// @name         Auto-awesome Turntable.fm
// @version      1.0
// @namespace    https://github.com/skullvalanche
// @description  Automatically clicks the 👍 button every 10s
// @author       skull@skullvalanche.com
// @match        https://turntable.fm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423519/Auto-awesome%20Turntablefm.user.js
// @updateURL https://update.greasyfork.org/scripts/423519/Auto-awesome%20Turntablefm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        document.querySelector("#room-view > div.room-renderer.mouse-map > div:nth-child(1) > div > div.awesome-button").click()
    }, 10000);
})();
