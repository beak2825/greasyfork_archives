// ==UserScript==
// @name         Wodify Temporary Fixes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Temporary code fixes for Wodify visual issues.
// @author       Ollebac
// @match        https://app.wodify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wodify.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481638/Wodify%20Temporary%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/481638/Wodify%20Temporary%20Fixes.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

    const customCSS = `
      p > span {
        color: white !important;
        background-color: transparent !important;
      }`;

    $("<style>").prop("type", "text/css").html(customCSS).appendTo("head");
})();