// ==UserScript==
// @name         Make Twitter edgy again
// @namespace    http://twitter.com/pleximon
// @version      0.3
// @description  A fix for buttons and profile pictures.
// @author       Pleximon
// @match        twitter.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30665/Make%20Twitter%20edgy%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/30665/Make%20Twitter%20edgy%20again.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('*').css({borderRadius:'0%'});
})();