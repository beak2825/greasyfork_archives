// ==UserScript==
// @name         Redirect twimg to :orig
// @namespace    https://prometheus-systems.co.za/
// @version      0.0.6
// @description  Redirect twimg image URLs to enforce name=orig for full-resolution images
// @author       rwdcameron
// @license      GPLv2
// @supportURL   mailto://rwd.cameron@prometheus-systems.co.za?Subject=twimg-resizer
// @match        *://pbs.twimg.com/media/*
// @exclude      *://pbs.twimg.com/media/*?*name=orig*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535481/Redirect%20twimg%20to%20%3Aorig.user.js
// @updateURL https://update.greasyfork.org/scripts/535481/Redirect%20twimg%20to%20%3Aorig.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);

    // If the 'name' variable is already set to 'orig' do nothing
    if (params.get('name') === 'orig') return;

    // Set the 'name' variable to 'orig'
    params.set('name', 'orig');

    const newUrl = window.location.origin + window.location.pathname + '?' + params.toString() + window.location.hash;
    window.location.replace(newUrl);
})();
