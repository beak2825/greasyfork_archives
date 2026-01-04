// ==UserScript==
// @name         Gaben let me see my emotes!
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  Improved *steam activity* emoticon container.
// @author       Cerberus814 (https://steamcommunity.com/id/cerberus814/)
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443327/Gaben%20let%20me%20see%20my%20emotes%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443327/Gaben%20let%20me%20see%20my%20emotes%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .emoticon_popup_ctn  { height:380px; z-index: 1200 !important; }
    .emoticon_popup_content { max-height: 380px !important; resize:vertical; }

    `);
    // Enjoy this little script :) id/Cerberus814.
})();