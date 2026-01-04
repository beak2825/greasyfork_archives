// ==UserScript==
// @name         WME Hide Tooltip
// @version      1.0.1
// @description  Hide Tooltip in Waze Map Editor
// @author       Falcon4Tech
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/205544
// @downloadURL https://update.greasyfork.org/scripts/498962/WME%20Hide%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/498962/WME%20Hide%20Tooltip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'wz-tooltip-content { display: none !important; }';

    document.head.appendChild(style);
})();