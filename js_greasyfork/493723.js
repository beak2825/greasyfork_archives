// ==UserScript==
// @name         Disable OA Boss Map Animations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  (Might help with FPS drops when bossmap is open) Disables outpost attack animations on the Boss Map page of DFProfiler
// @author       MiseryOG
// @match        https://www.dfprofiler.com/bossmap
// @match        http://www.dfprofiler.com/bossmap
// @match        dfprofiler.com/bossmap
// @match        test2.dfprofiler.com/bossmap
// @match        https://test2.dfprofiler.com/bossmap
// @match        http://test2.dfprofiler.com/bossmap
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dfprofiler.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493723/Disable%20OA%20Boss%20Map%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/493723/Disable%20OA%20Boss%20Map%20Animations.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
        #boss-table .outpostAttack {
            animation: none !important;
        }
    `);
})();