// ==UserScript==
// @name         Plug.dj RCS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto run RCS in Plug.dj
// @author       Salomão Neto <salomaosnff3@gmail.com>
// @match        https://plug.dj/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400284/Plugdj%20RCS.user.js
// @updateURL https://update.greasyfork.org/scripts/400284/Plugdj%20RCS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        $.getScript('https://code.radiant.dj/rcs.min.js');
    });
})();