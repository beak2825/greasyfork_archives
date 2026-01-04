// ==UserScript==
// @name         WME UR Description Highlighter
// @namespace    mailto:russblau.waze@gmail.com
// @version      0.2
// @description  Apply a bright yellow highlight to UR description field
// @author       russblau
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://beta.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT/BSD/X11
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488983/WME%20UR%20Description%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/488983/WME%20UR%20Description%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".URCE-divDesc { background-color: yellow; }");
    GM_addStyle(".description.section .collapsible { background-color: yellow; }");
})();