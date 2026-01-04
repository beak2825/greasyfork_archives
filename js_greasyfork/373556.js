// ==UserScript==
// @name         timeout
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Sorry rc.  It had to be done.
// @author       rc
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373556/timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/373556/timeout.meta.js
// ==/UserScript==
(function() {
    TimeOutClick = function() {
        TimeOut = document.getElementsByClassName('hud-spell-icon')[1];
        TimeOut.attributes.class.value = 'hud-spell-icon';
        TimeOut.click();

        };
    timer = null;
    script = function(e) {
        switch (e.code) {
            case "KeyG":
                if (timer === null) {
                    timer = setInterval(function() {
                        TimeOutClick();
                    }, 0);
                } else {
                    clearInterval(timer);
                    timer = null;
                }
        }
    };
    document.addEventListener('keydown', function(e) {
        script(e);
    });
})()