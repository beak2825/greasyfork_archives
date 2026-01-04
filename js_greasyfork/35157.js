// ==UserScript==
// @name         Remove Youtube Activity Check
// @description  Removes youtube's new "are you still there" experiment
// @include      *://*.youtube.com/*
// @version      1.0
// @grant        none
// @namespace https://greasyfork.org/users/159236
// @downloadURL https://update.greasyfork.org/scripts/35157/Remove%20Youtube%20Activity%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/35157/Remove%20Youtube%20Activity%20Check.meta.js
// ==/UserScript==

(function() {

    'use strict';

    setInterval(function() {

        yt.util.activity.getTimeSinceActive = function xi() {
            return 0;
        };

    }, 1000);

})();