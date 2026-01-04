// ==UserScript==
// @name         Remote Shell Font Fixer
// @version      0.1.0
// @description  Use a nerd font in the Raspberry Pi remote shell interface.
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Remote%20Shell%20Font%20Fixer]%20
// @match        https://connect.raspberrypi.com/devices/*/remote-shell-session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raspberrypi.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530198/Remote%20Shell%20Font%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/530198/Remote%20Shell%20Font%20Fixer.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function() {
    "use strict";
    GM_addStyle(`
        [style="letter-spacing: -5.30081px;"] {
            font-size: 17px!important;
            letter-spacing: -5.30081px!important;
        }
        .xterm-rows > div > span {
            font-family: Mononoki Nerd Font Mono!important;
            letter-spacing: 0.011687px!important;
        }
    `);
})();