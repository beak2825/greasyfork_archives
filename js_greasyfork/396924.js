// ==UserScript==
// @name         Ruqqus Stylesheets
// @namespace    http://ruqqus.com/
// @version      0.3
// @description  this is meant just to help make the website interface a little easier to handle, and is not intended as a best style implementation, also it may cease to work for future site updates
// @source       https://www.ruqqus.com/post/16p
// @source       https://openuserjs.org/scripts/jasonkhanlar/Ruqqus_Stylesheets/source
// @source       https://greasyfork.org/en/scripts/396924-ruqqus-stylesheets/code
// @author       Jason Khanlar
// @copyright    2020, jasonkhanlar (https://openuserjs.org/users/jasonkhanlar / https://greasyfork.org/en/users/449983-jasonkhanlar)
// @license      MIT
// @match        https://www.ruqqus.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396924/Ruqqus%20Stylesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/396924/Ruqqus%20Stylesheets.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author jasonkhanlar
// ==/OpenUserJS==

(function() {
    'use strict';

    // Left sidebar scale
    GM_addStyle('#sidebar-left { height: auto; min-height: 100vh; }');

    // A links (hover)
    GM_addStyle('a:hover { color: #766bd3; }');

    // Page navigation links color (hover)
    GM_addStyle('.page-link:hover { color: #766bd3; }');

    // Home page

    // Home page title color
    GM_addStyle('#main-content-col > .guild-border-top > .col > .justify-content-between > .font-weight-bold { color: #ACACAC !important }');

    // Home page sort dropdown color (hover) -- make sure to not include #dropdownMenuButton:hover for other pages that have different styles for some reason
    GM_addStyle('.justify-content-between #dropdownMenuButton:hover { color: #8c8d94 !important; }');

    // Home page sort dropdown color (when expanded) -- make sure to not include #dropdownMenuButton:hover for other pages that have different styles for some reason
    GM_addStyle('.justify-content-between #dropdownMenuButton[aria-expanded=true] { color: #8c8d94 !important; }');

    // Home page sort dropdown option color (hover)
    GM_addStyle('#main-content-col > .border-bottom .justify-content-between .dropdown-menu .dropdown-item:hover { color: #cfcfcf !important; }');

    // Guild browse page

    // Guild browse page guild name color
    GM_addStyle('div[id^=board-] .card-title { color: #ACACAC; }');
    GM_addStyle('div[id^=board-] .card-title:hover { color: #766bd3; }');

    // Guild browse page duild description color
    GM_addStyle('div[id^=board-] .card-text { color: #ACACAC; }');

    // Guild content page

    // Guild content page post entry (gover) text color
    GM_addStyle('#guild .posts .card:hover a { color: #8c8d94; }');
    GM_addStyle('#guild .posts .card:hover a:hover { color: #ff8f66; text-decoration: none; }');
    GM_addStyle('#guild .posts .card:hover a:hover .fas { color: #ff8f66; }');
    GM_addStyle('#guild .posts .card:hover .score { color: #6c6d74; }');

    // User page

    // User page text color on variable background image
    GM_addStyle('#userpage .jumbotron .mb-2, #userpage .jumbotron .font-weight-normal, #userpage .jumbotron .mt-2 { color: #acacac; text-shadow: 1px 1px 1px #444, -1px -1px 1px #bbb; }');

    // Thread post page

    // post-body
    GM_addStyle('#thread #post-body { display: block !important; }');
})();