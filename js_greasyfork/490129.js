// ==UserScript==
// @name         Don't forget your Xanax
// @namespace    http://tampermonkey.net/
// @version      2024-06-26
// @description  Reminds you to take your xanax when you have no drug cooldown
// @author       Shade
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/loader.php?sid=attack*
// @exclude      https://www.torn.com/pc.php*
// @exclude      https://www.torn.com/level2.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490129/Don%27t%20forget%20your%20Xanax.user.js
// @updateURL https://update.greasyfork.org/scripts/490129/Don%27t%20forget%20your%20Xanax.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        setTimeout(function() {
            var drugcd = document.querySelector("[aria-label^='Drug Cooldown:']");
            if (drugcd == null) {
                $("body").append('<div style="background-color: red; position:fixed; top:0; width:100%; z-index:99999; padding: 12px; text-align: center; color: white;">Take your damn Xanax</div>');
            }
        }, 5000);
    });
})();