// ==UserScript==
// @name         Webpage Editor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enable this script to edit any webpage. Disable this script to stop editing. You need this extension to use Webpage Editor: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
// @author       You
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netlify.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450079/Webpage%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/450079/Webpage%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.body.contentEditable = 'true'; document.designMode='on'; alert("Successfully enabled Webpage Editor"); alert("Disable this script and refresh to disable Webpage Editor"); void 0;
})();