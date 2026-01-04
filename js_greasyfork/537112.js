// ==UserScript==
// @name        The Hindu Ads Remover
// @description    Remove the full page ad on the Hindu news articles
// @version     1.0.0
// @author      techiev2
// @namespace   none
// @match       https://thehindu.com/*
// @match       https://www.thehindu.com/*
// @compatible  Chrome
// @compatible  Firefox
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537112/The%20Hindu%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/537112/The%20Hindu%20Ads%20Remover.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

document.addEventListener('DOMContentLoaded', () => {
    $$('.tp-modal, .tp-backdrop').forEach(el => el.parentElement.removeChild(el));
    document.body.classList.remove('tp-modal-open')
})