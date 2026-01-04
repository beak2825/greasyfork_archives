// ==UserScript==
// @name         Shortcut Project Color Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix Shortcut to show project colors
// @author       BP
// @match        https://app.shortcut.com/*
// @icon         https://www.google.com/s2/favicons?domain=shortcut.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433066/Shortcut%20Project%20Color%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/433066/Shortcut%20Project%20Color%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const run = () => {
        if (document.visibilityState != 'visible') return;
        $('.story-badge--project:not(.color-fixed)').each(function() {
            const color = $(this).children().css('color');
            $(this).addClass('color-fixed').hide();
            $(this).parents('.story').css({borderLeftColor: color});
        });
    };

    setInterval(run, 1000);
})();