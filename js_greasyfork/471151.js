// ==UserScript==
// @name         Mastodon Elk UI - black background color - ElkZone ElkApp
// @namespace    https://greasyfork.org/en/scripts/471151-mastodon-elk-ui-black-background-color-elkzone-elkapp
// @version      0.23
// @description  Change background color of Elk Zone aka ElkApp to be completely black like Twitter
// @author       Cragsand
// @match        https://elk.universeodon.com/*
// @match        https://elk.infosec.exchange/*
// @match        https://elk.zone/*
// @match        https://main.elk.zone/*
// @match        https://mementomori.social/*
// @grant        none
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/471151/Mastodon%20Elk%20UI%20-%20black%20background%20color%20-%20ElkZone%20ElkApp.user.js
// @updateURL https://update.greasyfork.org/scripts/471151/Mastodon%20Elk%20UI%20-%20black%20background%20color%20-%20ElkZone%20ElkApp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change background to black like Twitter
    document.documentElement.style.setProperty('--c-bg-base', 'black');
    document.documentElement.style.setProperty('--color-brand-mastodon-bg', 'black');
})();