// ==UserScript==
// @name         Pure Essence Edit Links
// @namespace    http://pure-essence.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://pure-essence.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14385/Pure%20Essence%20Edit%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/14385/Pure%20Essence%20Edit%20Links.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
jQuery(document).ready(function() {
    var $editLinks = jQuery('.post-edit-link');
    $editLinks.each(function() {
        var postId = jQuery(this).attr('href').replace('https://wordpress.com/post/pure-essence.net/', '');
        jQuery(this).attr('href', 'https://pe20110517.wordpress.com/wp-admin/post.php?post=' + postId + '&action=edit');
    });
});