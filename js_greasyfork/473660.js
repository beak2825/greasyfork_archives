// ==UserScript==
// @name         v2free auto check in
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  v2free auto check in script
// @author       xx
// @match        https://v2free.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2free.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473660/v2free%20auto%20check%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/473660/v2free%20auto%20check%20in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(
        () => {
            $.ajax({ type: "POST", url: "/user/checkin" });
        },
        24 * 60 * 60 *1000
    )
})();