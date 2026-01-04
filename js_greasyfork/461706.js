// ==UserScript==
// @name         Pull to Refresh for Mobile Browser
// @namespace    Refresh
// @author    Andreyka_MD
// @version      1.0
// @description  Pull to refresh
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461706/Pull%20to%20Refresh%20for%20Mobile%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/461706/Pull%20to%20Refresh%20for%20Mobile%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var startY, endY, distance, isScrolling;

    function onTouchStart(e) {
        startY = e.touches[0].pageY;
        isScrolling = undefined;
    }

    function onTouchMove(e) {
        endY = e.touches[0].pageY;
        distance = endY - startY;
        if (distance > 0 && !isScrolling) {
            isScrolling = true;
            $('body').prepend('<div id="pull-to-refresh">Pull to refresh</div>');
        }
        if (isScrolling && distance > 60) {
            $('#pull-to-refresh').text('Уберите палец для обновление');
        } else {
            $('#pull-to-refresh').text('Дёрни вниз для обновы :)');
        }
    }

    function onTouchEnd(e) {
        if (isScrolling && distance > 60) {
            location.reload();
        }
        $('#pull-to-refresh').remove();
        startY = 0;
        endY = 0;
        distance = 0;
        isScrolling = false;
    }

    document.addEventListener('touchstart', onTouchStart, false);
    document.addEventListener('touchmove', onTouchMove, false);
    document.addEventListener('touchend', onTouchEnd, false);
})();
