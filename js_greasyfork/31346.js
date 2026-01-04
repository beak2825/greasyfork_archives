// ==UserScript==
// @name         StackExchange: No Hot Questions
// @namespace    http://blaisorblade.github.io/sx-no-hot
// @version      0.1
// @description  Hide hot network questions from StackExchange network
// @author       Blaisorblade
// @match        https://*.stackexchange.com/*
// @match        https://stackoverflow.com/*
// @match        https://superuser.com/*
// @match        https://serverfault.com/*
// @match        https://mathoverflow.net/*
// @match        https://askubuntu.com/*
// @match        https://stackapps.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31346/StackExchange%3A%20No%20Hot%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/31346/StackExchange%3A%20No%20Hot%20Questions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#hot-network-questions").hide();
})();