// ==UserScript==
// @name         Remove reddit nsfw block
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  Unblocks reddit nsfw blocker on browser so you don't have to install app XD
// @author       Cranio
// @match        https://www.reddit.com/*
// @match        https://www.tampermonkey.net/scripts.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499945/Remove%20reddit%20nsfw%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/499945/Remove%20reddit%20nsfw%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bundleName = 'desktop_rpl_nsfw_blocking_modal';
    const element = document.querySelector(`[bundlename="${bundleName}"]`);

    element.remove();
})();