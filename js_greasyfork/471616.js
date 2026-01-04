// ==UserScript==
// @name         RTS Teacher to Company Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just redirect
// @author       Kurome
// @match        https://rtschool.s20.online/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471616/RTS%20Teacher%20to%20Company%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/471616/RTS%20Teacher%20to%20Company%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let splittedPath = window.location.pathname.split('/');
    if (splittedPath[1] === 'teacher'){
    splittedPath[1] = 'company';
    window.location = splittedPath.join('/') + window.location.search
}
})();