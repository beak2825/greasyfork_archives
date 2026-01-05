// ==UserScript==
// @name         Hide Chat Button
// @namespace    pxgamer
// @version      0.1
// @description  Hides the chat button.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @require.     https://code.jquery.com/jquery-1.12.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/21195/Hide%20Chat%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/21195/Hide%20Chat%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.chatButton').hide();
})();
