// ==UserScript==
// @name         Kill Scoob
// @name:ru      Kill Scoob
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  kills the script that triggers the stupid Scooby Weekends joke. sorry BitView, but this gag is way too intrusive for own good.
// @description:ru грохает скрипт что триггерит тупую пасхалку Scooby Weekends. прости BitView, но этот гэг уже черезчур назойлив. 
// @author       tomohaze
// @match        https://www.bitview.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitview.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499893/Kill%20Scoob.user.js
// @updateURL https://update.greasyfork.org/scripts/499893/Kill%20Scoob.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", (event) => {
        document.querySelector('.yt-alert-content script').remove()
    });
})();