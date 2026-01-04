// ==UserScript==
// @name         Original sized pics from .su
// @version      1.0
// @description  Sometime the picture is linked with .md on servers with .su domain. This is a very simple script to remove that .md and reloads with the original size
// @author       You
// @match        https://*.su/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1417181
// @downloadURL https://update.greasyfork.org/scripts/522193/Original%20sized%20pics%20from%20su.user.js
// @updateURL https://update.greasyfork.org/scripts/522193/Original%20sized%20pics%20from%20su.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentURL () {
        return window.location.href
    }

    const url = getCurrentURL()

    if (window.location.href.includes(".su") && window.location.href.includes(".md")) {
        window.location.replace(window.location.href.replace('.md',''));
    }
})();