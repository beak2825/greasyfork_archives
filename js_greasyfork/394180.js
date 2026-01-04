// ==UserScript==
// @name         Guru3D Keyboard Shortcuts
// @namespace    https://guru3d.com
// @version      1.0.1
// @description  Use arrow keys to navigate through articles.
// @author       RevoLand
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @include      *://*guru3d.com/articles*pages/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394180/Guru3D%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/394180/Guru3D%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    var previousPageLink = $('.pagelinkselected').prev().contents().attr('href');
    var nextPageLink = $('.pagelinkselected').next().contents().attr('href');
    var keys = {};

    $(document).keydown(function(e) {
        keys[e.which] = true;

        if (/*keys[17] && */keys[37] && previousPageLink != undefined) { // Ctrl + left arrow key
            window.location.href = window.location.origin + '/' + previousPageLink;
        }

        if (/*keys[17] && */keys[39] && nextPageLink != undefined) { // Ctrl + right arrow key
            window.location.href = window.location.origin + '/' + nextPageLink;
        }
    });

    $(document).keyup(function(e) {
        delete keys[e.which];
    });
})();