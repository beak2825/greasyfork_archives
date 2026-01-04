// ==UserScript==
// @name         miro_hide_ui
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  hides miro ui, refresh miro after enable/disable
// @author       ryan_revo
// @match        https://miro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456632/miro_hide_ui.user.js
// @updateURL https://update.greasyfork.org/scripts/456632/miro_hide_ui.meta.js
// ==/UserScript==

GM_addStyle ( `
    .desktop-ui {
        display: none !important;
    }
` );