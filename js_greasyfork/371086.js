// ==UserScript==
// @name         AutoNextWord for Shanbay
// @namespace    http://tampermonkey.net/
// @version      2018.08.12
// @description  Auto move to next word when you are trying to resite the vocabulary with Shanbay
// @author       Aaron Liu
// @match        *://www.shanbay.com/bdc/review/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/371086/AutoNextWord%20for%20Shanbay.user.js
// @updateURL https://update.greasyfork.org/scripts/371086/AutoNextWord%20for%20Shanbay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const waitBeforeClickingNext = 15 * 1000;
    const waitBeforeClickingKnown = 12 * 1000;

    var nextTimer;
    var knownTimer;



    var clickKnown = () => {
        var $known = $('.test-answers .known');

        if ($known.length > 0)
            knownTimer = setTimeout(() => {
                $known.click();

                clickNext();
            }, waitBeforeClickingKnown);
    };

    var clickNext = () => {
        var $next = $('.continue-button');

        if ($next.length > 0)
            nextTimer = setTimeout(() => {
                $next.click();

                clickKnown();
            }, waitBeforeClickingNext);
    };

    clickKnown();
})();