// ==UserScript==
// @name     Wordpress admin bar hider
// @description    Hide the admin bar on Wordpress websites when logged in
// @namespace Dan
// @author   Dan
// @include  *.electroplus.md/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/37770/Wordpress%20admin%20bar%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/37770/Wordpress%20admin%20bar%20hider.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;
$('#wpadminbar').hide();