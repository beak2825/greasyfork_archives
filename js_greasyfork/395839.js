// ==UserScript==
// @name         Vagrant Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Log into vagrant automagically
// @author       You
// @match        http://192.168.33.22/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395839/Vagrant%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/395839/Vagrant%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mail = jQuery('input#edit-name');
    var pass = jQuery('input#edit-pass');
    if(pass.length && mail.length){
        pass.val('admin');
        mail.val('admin@quodata.de');
        jQuery('#edit-submit').click();
    }
})();