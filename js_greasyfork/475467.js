// ==UserScript==
// @name         Torn Fast Slots
// @namespace    https://github.com/SOLiNARY
// @version      0.3
// @description  Makes slots stop instantly. Works for every spin except first.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=slots
// @match        https://www.torn.com/page.php?sid=slots
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/475467/Torn%20Fast%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/475467/Torn%20Fast%20Slots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAjax = $.ajax;

    $.ajax = function (options) {
        if (options.data != null && options.data.sid == 'slotsData' && options.data.step == 'play') {
            const originalSuccess = options.success;
            options.success = function (data, textStatus, jqXHR) {
                if (data.error) delete data.error;
                if (data.errorMsg) delete data.errorMsg;
                data.barrelsAnimationSpeed = 0;
                if (originalSuccess) {
                    originalSuccess(data, textStatus, jqXHR);
                }
            };
        }

        return originalAjax(options);
    }

    function enableBetButtons() {
        document.querySelectorAll(".slots-btn-list .betbtn").forEach(btn => {
            btn.classList.remove("disabled");
        });
    }

    function disableBetButtons() {
        document.querySelectorAll(".slots-btn-list .betbtn").forEach(btn => {
            btn.classList.add("disabled");
        });
    }

    function watchBarrelsSpinAndStop(delay = 60) {
        const barrels = document.querySelectorAll("#barrel0, #barrel1, #barrel2");
        let timers = new Map();
        let stopped = new Map();

        barrels.forEach(barrel => stopped.set(barrel, true));

        barrels.forEach(barrel => {
            const observer = new MutationObserver(() => {
                disableBetButtons();
                stopped.set(barrel, false);
                clearTimeout(timers.get(barrel));
                timers.set(barrel, setTimeout(() => {
                    stopped.set(barrel, true);
                    if ([...stopped.values()].every(Boolean)) {
                        enableBetButtons();
                    }
                }, delay));
            });

            observer.observe(barrel, {
                attributes: true,
                attributeFilter: ["style"]
            });
        });
    }

    var o = setInterval(() => {
        if($('#barrels').length == 1){
            clearInterval(o)
            watchBarrelsSpinAndStop();
        }
    }, 100);
})();