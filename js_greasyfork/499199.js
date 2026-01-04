// ==UserScript==
// @name        AO3: Marked For Later In The Sidebar
// @version     1.0.1
// @description Adds a direct link to marked for later in the sidebar of profiles under history
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/Userscripts
// @match       *://archiveofourown.org/users/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499199/AO3%3A%20Marked%20For%20Later%20In%20The%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/499199/AO3%3A%20Marked%20For%20Later%20In%20The%20Sidebar.meta.js
// ==/UserScript==

var username = window.location.href.split("/")[4];

$('ul.navigation.actions:nth(4) li:nth-child(3)').after("<a href='/users/" + username + "/readings?show=to-read'>Marked For Later</a>");
