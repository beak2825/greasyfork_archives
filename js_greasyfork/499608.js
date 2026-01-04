// ==UserScript==
// @name         Викупай трохи нє?))0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Съемка видео, к сожалению, разрешена
// @author       rumpear
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499608/%D0%92%D0%B8%D0%BA%D1%83%D0%BF%D0%B0%D0%B9%20%D1%82%D1%80%D0%BE%D1%85%D0%B8%20%D0%BD%D1%94%29%290.user.js
// @updateURL https://update.greasyfork.org/scripts/499608/%D0%92%D0%B8%D0%BA%D1%83%D0%BF%D0%B0%D0%B9%20%D1%82%D1%80%D0%BE%D1%85%D0%B8%20%D0%BD%D1%94%29%290.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var deathURL = 'https://www.youtube.com/watch?v=VtvB9Q_J904';

    function diesFromCringe() {
        history.pushState(null, null, deathURL);
        window.location.href = deathURL;
    }

    if (window.location.pathname === '/') {
        diesFromCringe();
    }
})();