// ==UserScript==
// @name         Imgur user link hijacker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces submitting user link with link directly to their albums and adds a Submitted link to link directly to submitted images
// @author       Chris Harry
// @match        *://*.imgur.com/gallery/*
// @match        *://*.imgur.com/a/*
// @match        *://*.imgur.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368085/Imgur%20user%20link%20hijacker.user.js
// @updateURL https://update.greasyfork.org/scripts/368085/Imgur%20user%20link%20hijacker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href = window.jQuery('.post-account').attr('href');
    
    var hrefParts = href.split('/');
    
    var newHref = "http://" + hrefParts[2] + ".imgur.com/all";

    window.jQuery('.post-account').attr('href', newHref);

    window.jQuery('.post-title-meta.font-opensans-semibold').append("<a href=\"http://imgur.com/user/" + hrefParts[2] + "/submitted\"> Submitted</a>");
    
})();