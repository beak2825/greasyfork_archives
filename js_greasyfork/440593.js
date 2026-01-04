// ==UserScript==
// @name         Fix middle mouse on images
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.0
// @description  Fixes middle mouse click on images in Discord by changing the wrapper settings
// @author       nixx quality <nixx@is-fantabulo.us>
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/440593/Fix%20middle%20mouse%20on%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/440593/Fix%20middle%20mouse%20on%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.imageClickable-A5lRqS { z-index: -1 !important; }')
})();