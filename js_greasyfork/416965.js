// ==UserScript==
// @name         Runn.io - Toggle Tentative Only
// @namespace    https://parall.ax/
// @version      0.1
// @description  Shows just the tentative stuff if the toggle is on.
// @author       James Hall
// @match        https://app.runn.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416965/Runnio%20-%20Toggle%20Tentative%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/416965/Runnio%20-%20Toggle%20Tentative%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        setInterval(function() {
            $('.bp3-switch').each(function () {
                var $elem = $(this);
                if ($elem.data('click-init')) {
                    return true;
                }
                $elem.data('click-init', true);
                $elem.on('click', function () {
                    if($('.bp3-control input').is(':checked')) {
                        setTimeout(function() {
                            $('.sticky-row-wrapper').each(function() {
                                if(!$(this).text().includes('Tentative')) {
                                    $(this).hide();
                                }
                            });
                        }, 200);
                    } else {
                        setTimeout(function() {
                            $('.sticky-row-wrapper').each(function() {
                                $(this).show();
                            });
                        }, 200);
                    }
                });
            });
        }, 1000);

    });
})();