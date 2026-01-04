// ==UserScript==
// @name         Old-flavour functional Menéame
// @namespace    https://old.meneame.net/
// @version      0.1
// @description  This script allows you to use the old and stable version of Menéame.
// @author       Nobody but me
// @match        https://www.meneame.net/*
// @icon         https://www.google.com/s2/favicons?domain=meneame.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437292/Old-flavour%20functional%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/437292/Old-flavour%20functional%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oldPath = window.location.href;
    var newPath = "https://"+oldPath.replace(/^[^.]*/, 'old')
    console.log("[old-meneame] Redirigiendo a: "+newPath);
    window.location = newPath;
})();