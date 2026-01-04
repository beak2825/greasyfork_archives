// ==UserScript==
// @name         Zive.cz
// @version      1.1.4
// @description  Živě CZ
// @copyright    2023, Engy
// @author       engycz@gmail.com
// @license      MIT
// @match        https://*.zive.cz/*
// @icon         https://www.google.com/s2/favicons?domain=zive.cz
// @grant        none
// @namespace https://greasyfork.org/users/1132330
// @downloadURL https://update.greasyfork.org/scripts/471359/Zivecz.user.js
// @updateURL https://update.greasyfork.org/scripts/471359/Zivecz.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(function() {
        if ($("[title='Povolit reklamu']").length > 0) {
            $("[title='Povolit reklamu']").parent().parent().parent().parent().remove()
        }
        //$("a[title='Zatím zavřít']").removeAttr("disabled");
        //$("a[title='Zatím zavřít']").click()
    }, 1000);
})();