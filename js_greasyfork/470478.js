// ==UserScript==
// @name         faucetoshi Auto PTC
// @description  Automatically views all PTC ads on faucetoshi.com
// @version      1.0
// @author       OHEY
// @match        https://faucetoshi.com/ptc*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at       document-idle
// @noframes
// @namespace    https://greasyfork.org/pl/users/1122551
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470478/faucetoshi%20Auto%20PTC.user.js
// @updateURL https://update.greasyfork.org/scripts/470478/faucetoshi%20Auto%20PTC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        window.focus();
    }, 500);

    document.hasFocus = function() {
        return true;
    };

    var $ = window.jQuery.noConflict(true);

    $(document).ready(function() {
        setTimeout(function() {
            if (location.href.indexOf("/ptc/view") > -1) {
                var checkPTC = setInterval(function() {
                    if ($("#verify").is(":visible")) {
                        clearInterval(checkPTC);
                        if ($(".h-captcha").is(":visible")) {
                            document.title = "CAPTCHA!";
                            var hTimer = setInterval(function() {
                                if ($("[id^=h-captcha-response]").val().length > 32) {
                                    clearInterval(hTimer);
                                    $("form:first").submit();
                                }
                            }, 3000);
                        }
                    }
                }, 2000);
            } else if (location.href.indexOf("/ptc") > 0) {
                if ($("button.btn:contains('Go')").is(":visible")) {
                    $('.btn-primary:first').click();
                }
            }
        }, 3000);
    });

    setTimeout(function() {
        location.reload();
    }, 90000);
})();