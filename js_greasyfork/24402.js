// ==UserScript==
// @name          gaia online fix guild navbar
// @description   makes the navbar look better
// @author        N1T30WL 
// @homepage      http://www.gaiaonline.com/*
// @incluce       http://www.gaiaonline.com/guilds/*
// @include       http://www.gaiaonline.com/guilds-home/*
// @include       http://www.gaiaonline.com/guilds/viewforum.*
// @include       http://www.gaiaonline.com/guilds/memberlist/id.*
// @include       http://www.gaiaonline.com/guilds/admin/id.*
// @include       http://www.gaiaonline.com/guilds/admin/invite/id.*
// @include       http://www.gaiaonline.com/guilds/admin/requests/id.*
// @include       http://www.gaiaonline.com/guilds/admin/logs/id.*
// @include       http://www.gaiaonline.com/guilds/?gmode=edit&guild_id*
// @include       http://www.gaiaonline.com/guilds/admin/forums/id.*
// @include       http://www.gaiaonline.com/guilds/admin/changeowner/id.*
// @include       http://www.gaiaonline.com/friendchats/guild/*
// @include       http://www.gaiaonline.com/guilds/?gmode=quitguild&guild_id*
// @include       http://www.gaiaonline.com/guilds-home/loyal-s-bazaar/g.417791/*
// @include       http://www.gaiaonline.com/guilds-home/club-verge-guild/g.408137/*
// @include       http://www.gaiaonline.com/guilds-home/scas/g.57415/*
// @version       1.1
// @namespace https://greasyfork.org/users/66491
// @downloadURL https://update.greasyfork.org/scripts/24402/gaia%20online%20fix%20guild%20navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/24402/gaia%20online%20fix%20guild%20navbar.meta.js
// ==/UserScript==
(function() {var css = ["#content .gaia_navigation_tabs .tab {",
"    text-align: center;",
"    display: block;",
"    margin: -1 -1 -1 0px;",
"    height: 28px;",
"    float: left;",
"    border: 1px solid white;",
"    background: lightblue;",
"}",
"#content .gaia_navigation_tabs .tab.current_tab {",
"    background-color: lightblue;",
"    color: white;",
"    border-bottom: 1px solid white;",
"}",
"#content .gaia_navigation_tabs .tab a {",
"    color: #5A4564;",
"    font-weight: normal;",
"    line-height: 28px;",
"    text-decoration: none;",
"    display: block;",
"    white-space:nowrap;}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();