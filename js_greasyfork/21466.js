// ==UserScript==
// @name         Block Users from Blogroll
// @namespace    pxgamer
// @version      0.2
// @description  Allows you to block selected users from the blogroll.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21466/Block%20Users%20from%20Blogroll.user.js
// @updateURL https://update.greasyfork.org/scripts/21466/Block%20Users%20from%20Blogroll.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    // Begin Blocklist
    var blocklist = [
        /*'TheDels'*/
    ];
    // End Blocklist

    $('#blogroll li .explanation a.plain.aclColor_').each(
        function() {
            for (var i = 0; i < blocklist.length; i++) {
                if ($(this).text() == blocklist[i]) {
                    $(this).parent().parent().hide();
                }
            }
        }
    );
})();
