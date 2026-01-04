// ==UserScript==
// @name         TinyChatOnBeforeLoad
// @namespace    r9kdeathcult
// @version      0.1
// @description  TinyChatOnBeforeLoad blahh
// @author       r9kdeathcult
// @match        https://tinychat.com/room/*
// @exclude      https://tinychat.com/room/*?1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374439/TinyChatOnBeforeLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/374439/TinyChatOnBeforeLoad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var th = document.getElementsByTagName('body')[0];
    var s = document.createElement('script');
    s.innerHTML = "window.onbeforeunload = function(e) { return 'REALLY???'; };";
    th.appendChild(s);
})();