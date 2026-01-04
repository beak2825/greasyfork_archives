// ==UserScript==
// @name         Hide StackOverflow Sidebars
// @namespace    http://tampermonkey.net/
// @version      2024-01-21b
// @description  The minimum viable StackOverflow UI while removing all distractions
// @author       Kristian Rados
// @license      MIT

// @match        *://superuser.com/questions/*
// @match        *://stackoverflow.com/questions/*
// @match        *://askubuntu.com/questions/*
// @match        *://serverfault.com/questions/*
// @match        *://*.stackexchange.com/questions/*
// @downloadURL https://update.greasyfork.org/scripts/485370/Hide%20StackOverflow%20Sidebars.user.js
// @updateURL https://update.greasyfork.org/scripts/485370/Hide%20StackOverflow%20Sidebars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove left sidebar (I have not used it a single time in my life)
    var removables = ['left-sidebar']; // Can add more IDs here
    for (var i = 0; i < removables.length; i++) {
        var element = document.getElementById(removables[i]);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }
    document.getElementById("content").style.border="none";

    // Make question and answers take up whole width of page
    document.getElementById("content").style.margin="0";
    document.getElementById("content").style.width="100%";
    document.getElementById("content").style.maxWidth="none";

    // Moves Linked and Related questions to bottom of page
    // COMMENT OUT this line if you prefer them next to the question
    document.getElementById("mainbar").style.width="auto";

    // Clean up right sidebar
    // Adapted from https://github.com/ShivanKaul/SidebarOverflow/blob/master/extension/src/remove.js
    var hiring = document.getElementById("hireme");
    var meta = document.getElementById("sidebar").children[0];
    var hot_network_qs = document.getElementById("hot-network-questions");
    var chat = document.getElementById("chat-feature");
    if (hiring) {
        hiring.parentNode.removeChild(hiring);
    }
    if (meta) {
        meta.parentNode.removeChild(meta);
    }
    if (hot_network_qs) {
        hot_network_qs.parentNode.removeChild(hot_network_qs);
    }
    if (chat) {
        chat.parentNode.removeChild(chat);
    }
})();