// ==UserScript==
// @name         Old Reddit Is Back
// @description  Redirects www/new/np reddit to old.reddit while preserving media functionality
// @author       SeaMLess
// @match        *://www.reddit.com/*
// @match        *://new.reddit.com/*
// @match        *://np.reddit.com/*
// @version      1.04
// @license      GPL-3.0-or-later
// @run-at       document-start
// @icon         https://i.ibb.co/QrzsjPV/icon.png
// @namespace https://greasyfork.org/en/users/1045307-seamless
// @downloadURL https://update.greasyfork.org/scripts/462222/Old%20Reddit%20Is%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/462222/Old%20Reddit%20Is%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const exclude = ['/gallery', '/media', '/poll'];
    const allowed = ['www.reddit.com', 'new.reddit.com', 'np.reddit.com'];
    
    if (window.location.hostname === 'old.reddit.com' ||
        !allowed.includes(window.location.hostname) ||
        exclude.some(path => window.location.pathname.startsWith(path))) {
        return;
    }
    
    window.location.replace(window.location.href.replace(window.location.hostname, 'old.reddit.com'));
})();
