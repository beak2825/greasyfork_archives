// ==UserScript==
// @name         Channel Sidebar Remover
// @namespace    https://greasyfork.org/en/scripts/383278-channel-sidebar-remover
// @version      0.1
// @description  Just stripts the side of the window using jQuery.
// @author       xElite_V (Stop! You Violated The Law!)
// @match        https://www.twitch.tv/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383278/Channel%20Sidebar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/383278/Channel%20Sidebar%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".side-nav").remove();
})();