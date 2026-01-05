// ==UserScript==
// @name         Enterpriseify Enterprise
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http://enterprise*
// @include      http://sykes.office*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16963/Enterpriseify%20Enterprise.user.js
// @updateURL https://update.greasyfork.org/scripts/16963/Enterpriseify%20Enterprise.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

(function() {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/124817/908365/P0OqSaQKEG82jb8/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}());