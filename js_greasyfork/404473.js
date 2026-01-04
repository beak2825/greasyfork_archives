// ==UserScript==
// @name ff14angler-cracker
// @version 0.1
// @description bypass adblock checking for ff14-angler
// @match https://cn.ff14angler.com/*
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-body
// @namespace https://greasyfork.org/users/576674
// @downloadURL https://update.greasyfork.org/scripts/404473/ff14angler-cracker.user.js
// @updateURL https://update.greasyfork.org/scripts/404473/ff14angler-cracker.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var nodes = $('.adsbygoogle')
    nodes.removeClass('adsbygoogle')
    nodes.addClass('idk')
})();
