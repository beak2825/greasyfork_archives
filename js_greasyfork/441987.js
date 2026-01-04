// ==UserScript==
// @name         KillerTuxedo's Userscript
// @namespace    u/platformerking
// @version      0.1
// @description  automatically run `toggleOverlay` function on load
// @author       u/platformerking
// @match        https://ADD-YOUR-LINK-HERE.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441987/KillerTuxedo%27s%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/441987/KillerTuxedo%27s%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => { unsafeWindow.toggleOverlay('quick_search_box', true) }
})();