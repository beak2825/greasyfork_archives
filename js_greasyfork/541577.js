// ==UserScript==
// @name         StackExchange dark mode work-in-progress
// @version      2025july4
// @description  From https://meta.stackexchange.com/a/407981/290021
// @author       daniel.z.tg and Vitaly Zdanevich
// @match        https://*.askubuntu.com/*
// @match        https://*.mathoverflow.net/*
// @match        https://*.serverfault.com/*
// @match        https://*.stackapps.com/*
// @match        https://*.stackexchange.com/*
// @match        https://superuser.com/*
// @run-at       document-body
// @namespace https://greasyfork.org/users/22859
// @downloadURL https://update.greasyfork.org/scripts/541577/StackExchange%20dark%20mode%20work-in-progress.user.js
// @updateURL https://update.greasyfork.org/scripts/541577/StackExchange%20dark%20mode%20work-in-progress.meta.js
// ==/UserScript==

// NOT working for all sites
document.body.classList.add('theme-dark');
