// ==UserScript==
// @name         RPGEN - screenshot
// @author       none
// @namespace    https://rpgen.us/dq/maps/
// @version      0.4
// @description  download image of canvas;
// @match        https://rpgen.org/dq/?map=*
// @grant        GM.registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436278/RPGEN%20-%20screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/436278/RPGEN%20-%20screenshot.meta.js
// ==/UserScript==
(window => {
    'use strict';
    const {$} = window;
    GM.registerMenuCommand('screenshot', () => {
        $('<a>').attr({
            href: $("canvas").get(1).toDataURL(),
            download: `RPGEN ${window.g_curDir}.png`
        }).get(0).click();
    });
})(window.unsafeWindow || window);