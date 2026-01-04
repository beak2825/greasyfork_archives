// ==UserScript==
// @name Roblox 2021 style
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.0.0
// @description Makes ROBLOX.com look like it did in 2010
// @author legosavant
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @include http://roblox.com/*
// @include https://roblox.com/*
// @include http://*.roblox.com/*
// @include https://*.roblox.com/*
// @downloadURL https://update.greasyfork.org/scripts/437252/Roblox%202021%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/437252/Roblox%202021%20style.meta.js
// ==/UserScript==

(function() {
let css = `
/*roblox 2010*/
/*
* REQUIRED!!!!: BTROBLOX EXTENSION
REQUIRED settings: 
Navigation: Keep sidebar open (ON) | modify buttons ->> Show home, messages, friends, money. EVERYTHING ELSE DISABLED |
Home: Show friend Usernames, DO NOT Show more friends
Profile: Embed Inventory, Show last online
Groups: Check every box in "group redesign options"
Game Details: Add Server List Pager
Inventory: Inventory Ttools
WIP: Check all
*/
.light-theme .alert-loading {
    background:transparent
}
.light-theme .text {
    color:#000
}
.light-theme .roblox-popover-container.rplus-quick-info-widget{
    margin:0
}
.dark-theme .alert-warning, .light-theme .alert-warning, .dark-theme .alert-success, .light-theme .alert-success {
    margin-top:-16px
}
body {
    margin:0 auto;
    font: normal 8pt/normal Verdana,sans-serif;
}
#wrap {
    min-height:500px
}
#rbx-body:not(.dark-theme) #wrap {
    background: #F8FCFF url(https://i.imgur.com/IWoUAsL.jpg) repeat-x;
}
#rbx-body:not(.dark-theme) #wrap:before {
    content:"";
    display:inline-block;
    background: transparent url(https://i.imgur.com/cVYW9Iu.jpg) no-repeat scroll center top;
    width: 100%;
    overflow: auto;
    background-position-y:-0px;
    height:500px;
    position:absolute
}
#rbx-body.dark-theme #wrap {
    background:#333 url(https://i.imgur.com/C12ShmQ.png)
}
#navigation-container {
    max-width:930px;
    margin:0 auto;
    color:#fff;
}
.gotham-font div, .gotham-font .font-title, .gotham-font .h1, .gotham-font .h2, .gotham-font h1, .gotham-font h2 {
    font-family:Verdana, Sans-Serif;
    font-weight:400
}
.light-theme .checkbox input[type="checkbox"]:checked + label::before {
    background-color:#00a2ff;
    border-color:#00a2ff
}
.dark-theme .shimmer, .dark-theme .shimmer-lines .shimmer-line, .light-theme .shimmer, .light-theme .shimmer-lines .shimmer-line, .shimmer-lines .dark-theme .shimmer-line, .shimmer-lines .light-theme .shimmer-line {
    display:none
}
.item-card-container .item-card-thumb-container {
    background:transparent
}
.rbx-tabs-horizontal .rbx-tab .rbx-tab-heading.active {
    box-shadow:none!important
}
[data-btr-page="inventory"] .content{
    background:#fff!important;
    max-width:900px;
    padding:0 10px
}
.dark-theme[data-btr-page="inventory"] .content{
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x!important
}
[data-internal-page-name="Settings"] .content, [data-internal-page-name="PlayerSearch"] .content {
    max-width:900px;
    padding:0 10px
}
/*feet*/
body#rbx-body .container-footer {
    padding:0;
    background:none;
}
.footer .footer-links, .footer .footer-link {
    margin:0
}
.footer {
    max-width:920px;
    border-left:5px solid #ddd;
    border-right:5px solid #ddd;
    background:#e5f1fd;
    box-sizing:content-box;
    position:relative
}
.dark-theme .footer{
    border-color: #333;
    color: #FFF;
    background: #424A4F
}
.copyright-container {
    margin:0;
    border:0;
    padding:0
}
.footer .footer-links a {
    color:blue!Important;
    font-size:11px!Important;
    margin:0
}
.dark-theme .footer .footer-links a, .dark-theme.gotham-font .text-name:link {
    color:#AFCDE0!important
}
.container-main {
    padding-bottom:60px;
}
.copyright-container .footer-note {
    font-size:9px!important;
    color:transparent;
    margin:0;
    line-height:1.1
}
.copyright-container .col-sm-6:nth-child(1) {
    width:auto;
    padding-right:0px
}
.copyright-container .col-md-9:nth-child(2) {
    width:85%
}
.copyright-container .footer-note:before {
    content:"ROBLOX, 'Online Building Toy', characters, logos, names, and all related indicia are trademarks of ROBLOX CORPORATION, ©2021. ROBLOX Corp. is not affliated with Lego, MegaBloks, Bionicle, Pokemon, Nintendo, Lincoln Logs, Yu Gi Oh, K'nex, Tinkertoys, Erector Set, or the Pirates of the Caribbean. ARrrr! Use of this site signifies your acceptance of the Terms and Conditions.";
    font-size:9px!important;
    color:#000;
}
.copyright-container .language-selector-wrapper .input-group-btn .input-dropdown-btn .icon-globe {
    display:none
}
/*nav*/
.rbx-header .rbx-navbar li:hover {
    border-color:transparent!important
}
.rbx-header .container-fluid {
    background-color: #6e99c9;
    position:static;
    margin-top:72px;
    border-left:0;
    border-right:0;
    height:38px;
    width:900px
}
.dark-theme .rbx-header .container-fluid{
    background:#477594
}
.btr-no-hamburger #header .rbx-navbar-header {
    position:absolute;
    margin-left:35%;
    top:0px;
    display:block
    
}
.light-theme .icon-logo, .dark-theme .icon-logo {
    background:none;
    width:254px;
    height:59px;
}
.light-theme .rbx-header, .dark-theme .rbx-header {
    height:110px;
    background:#e5f1fd no-repeat url(https://i.imgur.com/zglNji8.png) 10px 0;
    border:1px solid transparent;
    border-bottom:0;
    width:900px;
    margin:0 auto;
    position:static;
    border-left: 5px solid #DDD;
    border-right: 5px solid #DDD;
    padding:0 10px;
    box-sizing:content-box
}
.dark-theme .rbx-header {
    background:#424A4F no-repeat url(https://i.imgur.com/iWeE2cF.png) 10px 0;
    border-left-color:#333;
    border-right-color:#333
}
.rbx-header .rbx-navbar {
    height:36px;
    margin:0
}
.rbx-header .navbar-search {
    border-radius:0;
    border:1px solid;
    margin-top:3px;
    position:absolute;
    bottom:50px;
    left:8px;
    width:55px;
    font-size:12px
}
.dropdown-menu {
    border-radius:0
}
.rbx-header .navbar-search .navbar-search-option a {
    padding:4px;
    height:36px!important;
}
.rbx-header .navbar-search .navbar-search-option a .icon-menu-shop {
    display:none
}
.rbx-header .navbar-search .navbar-search-option .new-navbar-search-anchor .navbar-list-option-icon {
    display:none
}
.rbx-header .navbar-search:focus-within {
    width:300px
}
.rbx-header .navbar-search .input-field {
    font-size:12px
}
.input-group .input-group-btn .input-addon-btn {
    display:none
}
.rbx-header .rbx-navbar-right {
    position:absolute;
    right:14px;
    top:14px;
    background:#fff;
    border:1px solid;
}
#rbx-body .rbx-header .navbar-search .input-field {
    padding:0 0 0 4px;
    border-radius:0
}
.rbx-header .rbx-navbar li .nav-menu-title {
    padding:0
}
.rbx-header .rbx-navbar li {
    flex-grow:0
}
.rbx-header .rbx-navbar {
    min-width:330px
}
.light-theme .rbx-header .text-header, .light-theme .rbx-header .text-header:visited, .dark-theme .rbx-header .text-header, .dark-theme .rbx-header .text-header:visited {
    color:#fff;
    font-size:0px;
    font-family:"arial";
    padding:0;
    line-height:1.8;
    border-left: 1px solid #FFF;
}
#rbx-body .rbx-header li:last-child .text-header {
    border-left:none;
    width:128px;
}
.text-header:hover:before {
    text-decoration:underline
}
.text-header[href="/home"]:before {
    content:"My ROBLOX";
    font-size:18px;
    padding-left:14px;
    color:#fff;
    padding-right:9px;
}
.text-header[href="/discover"]:before {
    content:"Games";
    font-size:18px;
    color:#fff;
    padding-left:9px;
    padding-right:9px
}
.text-header[href="/catalog"]:before {
    content:"Catalog";
    font-size:18px;
    color:#fff;
    padding-left:9px;
    padding-right:9px
    
}
.text-header[href="/develop"]:before {
    content:"Build";
    font-size:18px;
    color:#fff;
    padding-left:9px;
    padding-right:9px
}
#rbx-body .icon-nav-notification-stream {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -35px -245px;
    opacity:.3;
    width:20px;
    height:28px
}
a:hover  .icon-nav-notification-stream, .icon-nav-notification-stream:hover, a:hover .icon-nav-notification-stream, button:hover .icon-nav-notification-stream {
    opacity:.5;
    background-position:-35px -244px!important;
}
.icon-nav-message-btr {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    filter:invert(1)!important
}
.icon-nav-friend-btr {
    filter:invert(1)
}
a:hover .icon-nav-message-btr {
    background-position:0 -20px
}
.icon-nav-friend-btr {
    background:url(https://i.imgur.com/iA7MsgL.png) 0 160px;
    width:20px;
    height:20px
}
a:hover .icon-nav-friend-btr {
    background-position:0 140px
}
#nav-robux-icon .icon-robux-28x28, #rbx-body .icon-robux-28x28 {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    background-position:0 -80px;
    filter:invert(.75)
}
#nav-robux-icon .icon-robux-28x28:hover, .light-theme .icon-robux-28x28:hover {
    background-position:0 -100px
}
#rbx-body .icon-nav-settings {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    background-position:0 -180px;
    filter:invert(.75)
}
#rbx-body .icon-nav-settings:hover {
    background-position:0 -160px
}
.rbx-header .rbx-navbar-icon-group li span[class^="rbx-text"] {
    color:green;
    font-size:11px;
}
#rbx-body #header .btr-nav-notif, .light-theme .notification, #rbx-body .notification-blue, #rbx-body .notification-red {
    border-radius:0;
    padding:0;
    width:13px;
    height:13px;
    font-size:11px;
    min-width:0;
    line-height:1;
    font-family:Verdana;
    margin:0;
    font-weight:400;
    border:0;
    background:red;
    color:#fff
}
#rbx-body #header .btr-nav-notif {
    padding-bottom:.5px;
    margin-top:1px;
    padding-left:1px;
}
.rbx-header .rbx-navbar-icon-group li .nav-setting-highlight {
    line-height:1.1
}
.rbx-header .rbx-navbar-icon-group li span[class^="rbx-text"] {
    min-width:10px
}
/*sidebar*/
#left-navigation-container {
    margin:0 auto;
}
#rbx-body .rbx-left-col {
    width:210px;
    margin:0 auto;
    position:static;
    box-shadow:none
}
.rbx-left-col ul, .rbx-left-col li {
    padding:0;
    margin:0
}
.rbx-left-col .rbx-scrollbar .left-col-list {
    display:flex;
    padding-top:0px;
    font-family:"Arial";
}
.btr-no-hamburger .rbx-left-col .rbx-scrollbar {
    width:230%;;
    overflow:hidden!Important;
    top:-2px
}
.simplebar-wrapper {
    max-width:000px
}
.simplebar-content {
    height:100%;
}
.simplebar-content ul {
    height:32px
}
.rbx-left-col li span[class^="icon"] {
    display:none
}.rbx-left-col > ul
.rbx-left-col .rbx-scrollbar .left-col-list li:last-child, .rbx-left-col .rbx-scrollbar .left-col-list li:nth-last-child(3), .left-col-list li:nth-last-child(4), .left-col-list li:nth-last-child(2), .left-col-list li:nth-last-child(5), .left-col-list li:nth-last-child(6) {
    display:none
}
#navigation .rbx-divider, .simplebar-track.simplebar-horizontal {
    display:none
}
.rbx-left-col {
    position:relative;
    height:36px;
    margin-top:-36px!important;
    z-index:1030;
    background:transparent!important
}
.rbx-left-col > ul {
    position:absolute;
    top:-70px;
    left:-344px
}
.rbx-left-col li {
    border-left:1px solid #fff;
}
.rbx-left-col > ul li {
    border:none
}
.rbx-left-col li .text-nav .avatar-headshot-xs {
    display:none
}
.rbx-left-col li .text-nav .font-header-2 {
    color:#fff;
    font-size:18px;
    margin:0;
    padding-right:9px;
    padding-left:9px;
    padding-top:3px
}
.rbx-left-col li .text-nav .font-header-2:hover {
    text-decoration:underline
}
#navigation > ul > li div {
    color:#444
}
.dark-theme #navigation > ul > li div {
    color:#eee
}
#left-navigation-container > #navigation > ul .font-header-2{
    font-size:12px;
    font-weight:700;
    font-family:Verdana
}
#left-navigation-container > #navigation > ul .font-header-2:before {
    content:"Logged in as "
}
#navigation-container * {
    overflow:visible!important
}
/*worldwide pages*/
.light-theme .alert-info {
    background:orange;
}
.container-header {
    margin:0;
}
.light-theme .section-content {
    background:none
}
.dark-theme .section-content {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
}
.gotham-font .text, .gotham-font body, .gotham-font button, .gotham-font html, .gotham-font input, .gotham-font pre, .gotham-font select, .gotham-font textarea {
    font-family:Verdana
}
#rbx-body .input-group-btn .input-dropdown-btn {
    border-radius:0;
    background:#fff;
    width:auto
}
.btr-profile-favorites .input-group-btn {
    width:auto
}
.input-group-btn .input-dropdown-btn .rbx-selection-label {
    line-height:16px;
    font-size:14px;
    color:#000;
    font-family:Verdana;
}
.input-group-btn .input-dropdown-btn span[class^="icon"] {
    margin-top:0
}
.avatar-card-fullbody .avatar-card-image, .avatar-card-fullbody .avatar-card-link, .avatar .avatar-card-image, .avatar .avatar-card-link {
    border-radius:0
}
body.btr-no-hamburger .container-main, body.btr-no-hamburger .nav-container .nav-content {
    margin:0
}
.light-theme .content {
    background:#e5f1fd;
    border-left:5px solid #ddd;
    border-right:5px solid #ddd;
    box-sizing:content-box
}
.dark-theme .content {
    background:#424A4F;
    border-left:5px solid #333;
    border-right:5px solid #333;
    box-sizing:content-box
}
#rbx-body .btn-control-sm, .profile-avatar-left .enable-three-dee,  #rbx-body .btn-control-md, #rbx-body .btn-primary-md, #rbx-body .btn-alert-md, #rbx-body .btn-secondary-md, #rbx-body .btn-primary-sm, #rbx-body .btn-secondary-xs:link, .avatar-thumbnail .toggle-three-dee, #rbx-body .btn-growth-lg, #rbx-body .avatar-card-btns .accept-friend, #rbx-body .btn-primary-xs, #rbx-body .request-error-page-content .action-buttons .btn-primary-md:link, .premium-landing-page .membership-section .subscribe-button {
    background-color: #fff;
    border: solid 1px #333;
    color: #333;
    font-family: Verdana, Sans-Serif;
    font-size: 10px;
    padding: 3px 10px 3px 10px;
    border-radius:0
}
#rbx-body.dark-theme .btn-control-sm,.dark-theme .profile-avatar-left .enable-three-dee,  #rbx-body.dark-theme .btn-control-md, #rbx-body.dark-theme .btn-primary-md, #rbx-body.dark-theme .btn-alert-md, #rbx-body.dark-theme .btn-secondary-md, #rbx-body.dark-theme .btn-primary-sm, #rbx-body.dark-theme .btn-secondary-xs:link, .dark-theme .avatar-thumbnail .toggle-three-dee, #rbx-body.dark-theme .btn-growth-lg, #rbx-body.dark-theme .avatar-card-btns .accept-friend, #rbx-body.dark-theme .btn-primary-xs, #rbx-body.dark-theme .request-error-page-content .action-buttons .btn-primary-md:link,.dark-theme .premium-landing-page .membership-section .subscribe-button {
    background:#444;
    color:#fff
}
#rbx-body .btn-control-sm:hover, .profile-avatar-left .enable-three-dee:hover, #rbx-body .btn-control-md:hover, #rbx-body .btn-primary-md:hover, #rbx-body .btn-alert-md:hover, #rbx-body .btn-secondary-md:hover, .light-theme .btn-primary-sm:hover, .light-theme .btn-secondary-xs:link:hover, .avatar-thumbnail .toggle-three-dee:hover, #rbx-body .btn-secondary-xs.active, #rbx-body .avatar-card-btns .accept-friend:hover, .light-theme .avatar-card-btns .accept-friend,#rbx-body .btn-primary-xs, #rbx-body .request-error-page-content .action-buttons .btn-primary-md:hover, .premium-landing-page .membership-section .subscribe-button:hover {
    background-color: #6e99c9;
    color: #fff;
    border-radius:0
}
.input-group-btn .dropdown-menu li a {
    padding:1px 2px 1px 6px;
    font-size:13px;
    color:#333
}
.dark-theme .input-group-btn .dropdown-menu li a, .dark-theme .btn-primary-sm:link {
    color:#fff
}
.light-theme .btn-primary-sm:link {
    color:#333
}
.see-all-link-icon {
    font-size:10px!important;
}
.see-all-link-icon:after {
    content:none
}
.light-theme .btn-alert-md {
    color:red;
    border-color:red
}
.light-theme .btn-growth-lg {
    width:auto;
    margin-right:5px;
    min-width:60px
}
.light-theme .btn-growth-lg:hover {
    background:#49b745;
    color:#fff;
    border:1px solid #000;
}
[ng-href="https://www.roblox.com/users/1/profile/"] {
    text-transform:Uppercase
}
.light-theme .checkbox input[type="checkbox"] + label::before {
    border-radius:0;
    background:transparent
}
.light-theme .checkbox input[type="checkbox"]:checked + label::before {
    background:#6e99c9;
    border:1px solid #000
}
.light-theme .btn-secondary-xs, .light-theme .btn-primary-xs {
    border-radius:0
}
/*home*/
.section.home-friends .see-all-link-icon {
    background:none;
    border:none;
    padding-right:20px;
    padding-top:8px
}
.game-carousel .grid-item-container { /*thumbnail size*/
    width:138.5px
}
[data-internal-page-name="Home"] .content {
    width:920px
}
.home-header-container {
    display:none
}
.light-theme .section-content.remove-panel {
    background:#fff;
    border:2px solid #6e99c9
}
.dark-theme .section-content.remove-panel {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
    border:2px solid #477594
}
.container-header.people-list-header {
    margin:0;
    border-bottom:0;
    margin-right:10px;
    margin-left:10px;
    background:#6e99c9
}
.game-carousel {
    border:2px solid #6e99c9;
    background:#fff;
    padding:2px 0 0 5px;
    margin-left:10px;
    margin-right:10px
}
.game-home-page-container .game-home-page-carousel-title {
    background:#6e99c9;
    margin:0;
    border-bottom:0;
    padding: 0;
    margin-left:10px;
    margin-right:10px
}
.dark-theme .game-carousel {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
    border:2px solid #477594
}
.dark-theme .game-home-page-container .game-home-page-carousel-title,.dark-theme[data-internal-page-name="Home"] .container-header.people-list-header {
    background:#477594;
    border:2px solid #477594
}
.people-list-container .container-header h3, .game-home-page-container .game-home-page-carousel-title .font-header-1 {
    font-family:"Verdana";
    font-size:16px;
    font-weight:700;
    color:#fff;
    padding: 3px
}
.gotham-font.light-theme .see-all-link-icon, .gotham-font h3 {
    font-family:"Verdana";
    font-size:16px;
    font-weight:500;
    color:#333;
}
.dark-theme.gotham-font h3 {
    color:#fff
}
#rbx-body .game-card-container .game-card-name {
    font-size: .7em;
    font-weight: bold;
    font-family:Verdana, Sans-Serif;
    line-height:16px;
    color:blue;
    margin:0
}
#rbx-body.dark-theme .game-card-container .game-card-name {
    color:#AFCDE0
}
.game-card-container .game-card-name:hover {
    text-decoration:underline
}
.game-card-container thumbnail-2d, .game-card-thumb-container, #rbx-body .thumbnail-2d-container {
    border-radius:0!important;
    border:1px solid #000
}
.game-card-link .game-card-info .no-vote, .game-card-link .game-card-info .playing-counts-label, .game-card-link .game-card-info .vote-percentage-label {
    font-size:.65em;
    color:#000;
    padding:0
}
.dark-theme .game-card-link .game-card-info .vote-percentage-label {
    color:#fff
}
.game-card-link .game-card-info .playing-counts-label {
    color:red;
    top:-10px;
    position:relative;
    line-height:1;
    font-weight:bold;
    min-width:94px
}
.game-name-title, .game-tile .game-name-title {
    max-height:48px
}
.game-card-link .game-card-info .vote-percentage-label:before {
    content:"Voted: ";
    font-weight:bold
}
.game-card-link .game-card-info .playing-counts-label:after {
    content:" players online"
}
.dark-theme .game-card-info .info-label.icon-votes-gray, .dark-theme .game-card-info .info-label.icon-votes-gray-white-70, .icon-rating-sm, .light-theme .game-card-info .info-label.icon-votes-gray, .light-theme .game-card-info .info-label.icon-votes-gray-white-70, .dark-theme .game-card-info .info-label.icon-playing-counts-gray, .dark-theme .game-card-info .info-label.icon-playing-counts-gray-white-70, .icon-currently-playing-sm, .light-theme .game-card-info .info-label.icon-playing-counts-gray, .light-theme .game-card-info .info-label.icon-playing-counts-gray-white-70 {
    display:none
}
.game-card-thumb-container::before {
    content:none
}
.game-card-container thumbnail-2d .game-card-thumb, .game-card-thumb-container .game-card-thumb {
    border-radius:0
}
/*games*/
.scroller.next {
    right:-40px
}
[data-btr-page="games"] .content {
    border-top:5px solid #ddd;
    margin-top:-5px;
}
.dark-theme[data-btr-page="games"] .content {
    border-color:#333
}
[data-btr-page="games"] .footer {
    max-width:none;
}
[data-btr-page="games"] .container-main {
    padding-bottom:54px
}
.dark-theme .game-cards .game-card, .light-theme .game-cards .game-card {
    margin-bottom:0
}
.game-tile-list {
    background:#fff;
    border:2px solid #6e99c9;
    height:240px;
    padding-top:2px;
    padding-left:2px;
    border-left:0;
    border-right:0
}
.dark-theme .game-tile-list {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x
}
.games-list-container.is-windows .container-header.games-filter-changer{
    margin:0;
}
.light-theme .horizontal-scroller .scroller, .light-theme .scroller.disabled {
    border:2px solid #6e99c9;
    background:#fff
}
.games-list-container.is-windows .container-header.games-filter-changer h3, #settings-container .container-header{
    background:#6e99c9;
    padding:0 15px;
    color:#fff;
    font-family:Verdana;
    font-weight:700
}
.light-theme .scroller:focus, .light-theme .scroller:hover {
    background:#fff
}
.light-theme .game-card-native-ad {
    background:none
}
/*catalog*/
.item-card-thumb-container, .item-card-thumb-container .item-card-thumb, .item-card-thumb-container div[class^="icon-"], .item-card-thumb-container span[class^="icon-"] {
    border-radius:0
}
.light-theme .thumbnail-2d-container {
    background:#fff;
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-thumb-container, .container-main .splash.catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-thumb-container {
    height:112px;
    width:112px
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-container, .container-main .splash.catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-container {
    width:112px;
    margin:0
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card, .container-main .splash.catalog-full-screen .catalog-results .item-cards-stackable .item-card {
    width:123px
}
#rbx-body .item-card-container .item-card-caption {
    padding-top:1px
}
.light-theme .item-card-container .item-card-name {
    margin:0;
    color:blue;
    font-size:9.6px;
    font-weight:bold;
    font-family:verdana
}
.dark-theme .item-card-container .item-card-name {
    color:#AFCDE0;
    margin:0;
    font-size:9.6px;
    font-weight:bold;
    font-family:verdana
}
.item-card-container .item-card-name:hover {
    text-decoration:underline
}
.item-card-container .icon-robux-16x16 {
    display:none
}
#rbx-body .text-robux-tile {
    color:green;
    font-size:8.5px;
    font-weight:bold
}
#rbx-body .text-robux-tile:before {
    content:"R$";
}
[ng-class="{'text-robux-tile': item.isFree}"]:before, [ng-class="{'text-robux-tile': item.Product.IsFree}"]:before {
    content:none!important
}
[ng-class="{'text-robux-tile': item.isFree}"], [ng-class="{'text-robux-tile': item.Product.IsFree}"] {
    font-size:10px!important
}
.btr-robuxToCash-tile {
    color:green;
    font-size:8.5px;
    font-weight:bold
}
.item-cards-stackable .item-card-price {
    top:-12px;
    position:relative;
    height:18px
}
[data-internal-page-name="Catalog"] .item-card-container .item-card-thumb-container span{
    border:none!important
}
.btr-catalog .item-card-container .btr-item-card-more .btr-updated-label {
    letter-spacing:-1px
}
.catalog-container .catalog-results .results-container {
    background:#fff;
    border:2px solid #6e99c9;
    margin-right:10px
}
.dark-theme .catalog-container .catalog-results .results-container {
        border: 2px solid #477594;
    color: #FFF;
    background: #243a4a url(http://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
}
.btr-catalog#rbx-body .btr-item-card-more {
    pointer-events: unset;
    visibility: visible;
    opacity: 1;
    max-height: 50px;
    transition:none;
    border:none;
    box-shadow:none;
    background:transparent;
    margin-top:-13px;
    padding-left:2px
}
#rbx-body .item-card-label, #rbx-body .store-card-add-label, #rbx-body .store-card-price {
    color:#000;
    font-size:8.5px;
    font-weight:bold
}
#rbx-body.dark-theme .item-card-label, #rbx-body.dark-theme .store-card-add-label, #rbx-body.dark-theme .store-card-price {
    color:#fff
}
.text-overflow.item-card-label span{
    font-weight:normal
}
.light-theme .icon-default-economy-small, .light-theme .icon-robux-16x16, .light-theme .icon-robux-gold-16x16, .light-theme .icon-robux-gray-16x16, .light-theme .icon-robux-white-16x16 {
    display:none
}
.strike-through {
    color:green
}
.strike-through:before {
    Content:"R$ "
}
#rbx-body .item-card .item-card-thumb-container::before {
    content:none
}
.search-options .btn-text, #rbx-body .catalog-content .search-options .menu-link.active, #rbx-body .catalog-content .search-options .menu-link:hover {
    color:blue;
    font-size:12px;
    line-height:15px
}
.dark-theme .search-options .btn-text, #rbx-body.dark-theme .catalog-content .search-options .menu-link.active, #rbx-body.dark-theme .catalog-content .search-options .menu-link:hover {
    color:#AFCDE0
}
.light-theme .catalog-content .search-options .menu-link:hover {
    text-decoration:underline
}
.light-theme .catalog-content .search-options .menu-link.active {
    font-weight:bold
}
.catalog-container .search-bar-placement-right .heading {
    font-weight:700;
    font-family:Verdana;
    font-size:0px;
    position:absolute;
    left:15px;
    color:#fff;
    padding-top:16px;
}
.catalog-container .search-bar-placement-right .heading:before {
    content:"Catalog";
    font-size:18px
}
#rbx-body .catalog-content .search-options .search-options-form {
    border:2px solid #6e99c9;
    margin-top:20px;
    margin-left:10px;
    background:#fff
}
#rbx-body.dark-theme .catalog-content .search-options .search-options-form {
    border: 2px solid #477594;
    color: #FFF;
    background: #243a4a url(http://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
}
#rbx-body .input-field {
    border-radius:0;
}
#rbx-body #catalog-content .input-group .input-field {
    padding:0 0 0 4px;
     border-radius:0;
     height:30px;
     margin-top:2px
}
#rbx-body #catalog-content .input-group-btn .input-dropdown-btn {
    padding:0 0 0 4px;
    border-radius:0;
    height:30px;
    margin-top:2px;
    background:#fff;
    margin-left:4px;
    border-color:#ccc
}
#rbx-body #catalog-content .input-group-btn .input-dropdown-btn span {
    color:#000;
    font-family:verdana
}
.breadcrumbs .sort-dropdown {
    min-width:10px;
    margin-right:10px
}
#catalog-content .breadcrumbs{
    margin-bottom:0;
    background:#6e99c9
}
[catalog-breadcrumbs=""] {
    margin-right:10px;
}
.breadcrumbs .breadcrumb-container {
    padding-top:5px;
    margin:0;
}
.breadcrumbs .breadcrumb-container a {
    color:#fff!important;
    font-weight:700;
    font-family:Verdana
}
.catalog-container .search-container {
    margin-bottom:0
}
.catalog-container .search-container {
    margin:0 auto;
    float:none
}
#catalog-content .search-bars.search-bar-placement-right {
    background-color: #006699;
    border: solid 2px #6e99c9;
    max-width:900px;
    margin:0 auto;
    padding-bottom:2px;
    border-top:0
}
.dark-theme #catalog-content .search-bars.search-bar-placement-right {
    border-color:#477594
}
[data-btr-page="catalog"] .content {
    padding-top:0;
    max-width:920px!important;
    margin:0 auto!important
}
.icon-limited-label {
    background:url(https://www.roblox.com/images/assetIcons/limited.png) no-repeat 0;
    margin-left:3px;
    margin-bottom:1px
}
.icon-limited-unique-label {
    background:url(https://www.roblox.com/images/assetIcons/limitedunique.png) no-repeat 0;
    margin-left:3px;
    margin-bottom:1px
}
.btr-robuxToCash-tile {
    vertical-align:initial
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card {
    height:auto
}
/*profile*/
    /*profile header start*/
[data-internal-page-name="Profile"] #navigation-container {
    max-width:1072px;
    width:1072px;
}
[data-internal-page-name="Profile"] .rbx-header {
    width:100%;
    padding:0;
    margin-left:-5px;
    background-repeat:repeat-x;
    background-position-x:75px
}
[data-internal-page-name="Profile"] .rbx-header .container-fluid {
    width:100%;
    padding-left:94px;
}
[data-internal-page-name="Profile"] .rbx-left-col {
    width:192px
}
[data-internal-page-name="Profile"] .rbx-left-col > ul {
    left:-440px
}
    /*profile header end*/
.btr-profile .btr-games-list .btr-game-playbutton-container .btn-primary-lg {
    width:250px;
    height:48px;
    color:transparent
}
[data-internal-page-name="Profile"] .footer{
    max-width:1072px
}
.btr-profile .people-list-header .see-all-link-icon {
    color:yellow!important;
    font-size:16px!important;
    font-weight:700;
    padding:2px 0 0 0
}
.profile-header .profile-avatar-image {
    display:none
}
.profile-header .header-caption .header-title, .profile-display-name, .profile-header .header-caption .header-details  {
    display:block;
    width:max-content
}
.profile-header .header-caption {
    width:100%;
    height:auto
}
.profile-header .profile-header-content {
    width:520px;
    background:#6e99c9;
    margin:0 0 0 10px;
    position:absolute;
    padding:0 5px
}
.dark-theme .profile-header .profile-header-content,.dark-theme.btr-profile .container-header {
    background:#4D7FA1;
    border:2px solid #477594
}

.light-theme .btr-profile-about > .section-content {
    background:#fff;
    border:2px solid #6e99c9;
    margin-bottom:10px;
    padding:0 5px;
    border-top:0
}
.dark-theme .btr-profile-about > .section-content {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;;
    border:2px solid #477594;
    margin-bottom:10px;
    padding:0 5px;
    border-top:0
}

.profile-about .profile-about-content .profile-about-content-text, .profile-about .remove-panel .description-container .personal-field-description {
    font-size:11px;
    font-family:"Verdana";
    line-height:20px;
    color:#000;
}
.dark-theme .profile-about .profile-about-content .profile-about-content-text,.dark-theme .profile-about .remove-panel .description-container .personal-field-description, .dark-theme .profile-stats-container .profile-stat .text-lead, .dark-theme .profile-stats-container .profile-stat .text-label, .dark-theme .profile-header .header-caption .header-details .details-info div, .dark-theme .profile-header .header-caption .header-details .details-info li .font-header-2 {
    color:#fff
}
/*.profile-about .profile-about-content {
    position:absolute;
    top:60px;
    width:42%;
    height:auto;
    right:5px
}*/
.btr-profile .container-header.people-list-header  {
    margin:0
}
.btr-profile .profile-about-content .profile-about-text {
    line-height:1em
}
.btr-profile .profile-about-content .text-link {
    color:blue;
    font-size:11px
}
.dark-theme.btr-profile .profile-about-content .text-link {
    color:#AFCDE0
}
.btr-profile .btr-profile-left .btr-profile-about .container-header {
    height:0;
    min-height:0;
    padding:0
}
.profile-header .header-caption .header-title .profile-name, .profile-header .profile-display-name {
    font-size:16px;
    font-family:"Verdana";
    font-weight:700;
    color:#fff;
}
.profile-header .profile-display-name {
    font-size:13px!important;
    color:#fff;
    width:100%;
    text-align:center;
    font-weight:400!important
}
.profile-header .header-caption .header-title .icon-premium-medium {
    background:no-repeat url(https://www.roblox.com/images/icons/overlay_bcOnly.png);
    width:66px;
    height:19px;
    margin-left:-66px;
    position:absolute;
    left:66px;
    bottom:-270px;
    z-index:99;
}
.toggle-target .content-height {
    height:178px
}
.content-overflow-toggle.content-overflow-toggle-off {
    background:none;
}
.profile-header .header-caption .header-title, .profile-header .header-caption .header-title .profile-name {
    width:100%;
    text-align:center;
    margin:0
}
.profile-about .profile-social-networks .profile-social {
    transform:scale(.8)
}
.profile-about .profile-social-networks li {
    margin:0
}
.btr-profile-about.profile-about {
    margin-top:42px
}
.profile-about .profile-social-networks {
    position:absolute;
    z-index:99999;
    top:-40px
}
.btr-profile .btr-header-status-parent {
    padding:0
}

.light-theme .profile-avatar-left {
    padding:0
}
.btr-profile .profile-avatar-right.visible {
    width:490px
}
.btr-profile .profile-avatar-left .btr-toggle-items, .profile-avatar-left .enable-three-dee {
    left:0;
    right:auto
}
.profile-avatar-left .enable-three-dee {
    bottom:32px;
    top:auto;
    min-height:16px
}
.btr-profile .btr-header-status-text {
    font-family:Verdana;
    font-size:11px
}
.btr-profile .btr-games-list .btr-game-button .btr-game-title {
        font: bold 11px/normal Verdana, sans-serif;
}
.profile-avatar-left  .thumbnail-2d-container{
    border:none
}
.btr-profile .btr-games-list .btr-game-button {
    padding:1px 10px;
    background-color: #ccc;
    border-bottom: solid 1px #000;
    border-top: solid 1px #000;
    line-height:.8
}
.btr-profile .btr-games-list .btr-game-button:hover {
    background:#6e99c9;
    color:#fff
}
.btr-profile .btr-games-list .btr-game {
    margin-top:1px;
    margin-bottom:1px
}
.profile-about .container-header h3 {
    display:none
}

#games-switcher.section-content {
    padding:0;
    border:2px solid #6e99c9;
    background:#fff
}
.dark-theme #games-switcher.section-content{
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;;
    border:2px solid #477594;
}
.btr-profile .profile-container .profile-game .container-header {
    display:none
}
.btr-profile .container-header {
    min-height:16px;
    color: #333;
    margin-bottom:0;
}
.btr-profile .container-header h3 {
    padding:0;
}
.profile-container .badge-list {
    overflow:visible
}
.btr-profile .container-header {
    background-color: #6e99c9;
    color: #333;
    padding:5px 12px;
    line-height:1;
    margin-top:0;
}
.btr-profile-favorites .input-group-btn {
    margin:0
}
.btr-profile  .section-content.remove-panel {
    border:none
}
.dark-theme.btr-profile .section-content {
    border:2px solid #477594
}
.btr-profile .btr-profile-left {
    padding-left:10px
}
.btr-profile .btr-profile-right {
    padding-right:10px
}
.btr-profile-bottom, .btr-profile-playerbadges, .btr-profile-groups, #roblox-badges-container, .btr-profile-favorites {
    border:2px solid #6e99c9;
    margin-top:5px;
}

.dark-theme .btr-profile-bottom, .dark-theme .btr-profile-playerbadges, .dark-theme .btr-profile-groups, .dark-theme #roblox-badges-container,.dark-theme .btr-profile-favorites {
    border:none
}
.btr-profile-bottom {
    margin:5px 10px 0 10px
}
.profile-stats-container .profile-stat .text-label, .profile-header .header-caption .header-details .details-info li .font-header-2, .profile-header .header-caption .header-details .details-info div {
    white-space:initial;
    font-size:11px;
    color:#000;
    width:max-content;
    margin:0 auto;
    font-family:"Comic Sans MS"
}
.profile-header .header-caption .header-details .details-info li .font-header-2 {
    margin-right:4px;
    line-height:2
}
.profile-header .header-caption .header-details .details-info li a {
    line-height:1
}
.profile-header .header-caption .header-details {
    position:absolute;
    right:0;
    top:42px;
    z-index:99;
    display:flex;
    flex-direction:column
}
.profile-header .header-caption .header-details .details-info li, .profile-header .header-caption .header-details .details-actions li {
    padding-right:0;
    padding-left:10px;
}
.profile-header .header-caption .header-details .details-info {
    order:1;
}
.profile-header .header-caption .header-details .details-actions.desktop-action {
    margin-left:auto
}
.profile-stats-container .profile-stat .text-lead {
    white-space:initial;
    font-size:12px;
    color:#000;
    width:max-content;
    margin:0 auto;
    font-family:"Comic Sans MS";
    cursor: help;
    border-bottom: 1px dotted #000;
}
.btr-profile .profile-stats-container {
    border:none;
    margin:0;
    padding-bottom:3px
}
.btr-profile .profile-about-footer {
    font-size:10px;
    font-family:"Comic Sans MS";
}
.btr-profile .text-lead.slide-item-members-count, .btr-profile .text-lead.text-overflow.slide-item-my-rank{
    font-size:12px;
    color:#555;
    width:max-content
}
.dark-theme.btr-profile .text-lead.slide-item-members-count, .dark-theme.btr-profile .text-lead.text-overflow.slide-item-my-rank {
    color:#fff
}
.btr-profile .btr-games-list .btr-game-playbutton-container.btr-place-prohibited {
    font-size:12px;
    color:red;
    opacity:1
}
.btr-profile .text-lead.slide-item-members-count:after {
    content:" players online";
    cursor:text
}
.btr-profile .text-lead.text-overflow.slide-item-my-rank:before {
    content:"Visited ";
    cursor:text
}
.btr-profile .text-lead.text-overflow.slide-item-my-rank:after {
    content:" times";
    cursor:text
}
.btr-profile .text-label.slide-item-stat-title {
    display:none
}
.btr-profile .btr-games-list .btr-game-stats .list-item {
    display:flex;
}
.btr-profile .btr-games-list .btr-game-info {
    height:auto;
    padding-top:0
}
.btr-profile .btr-games-list .btr-game-desc {
    font-size:11px;
    color:#555;
    border:1px dashed;
    max-height:300px;
    padding-top:0;
    padding-left:8px;
    padding-right:8px;
    line-height:1.5
}
.btr-profile .btr-games-list .btr-game-desc.expanded {
    padding-bottom:0;
}
.btr-profile .btr-games-list .btr-game-desc .btr-toggle-description {
    display:none
}
.dark-theme.btr-profile .btr-games-list .btr-game-desc {
    background: #222;
    border-bottom: 1px solid #777;
    border-right: 1px solid #777;
    border-left: 1px solid #777;
    border-top-color:#777;
    color:#fff
}
.profile-container .asset-item span[title] {
    width:75px;
    height:125px;
    border:0}
.btr-profile #roblox-badges-container .badge-list > .list-item .asset-thumb-container {
    transform:none
}
#roblox-badges-container .see-all-link {
    display:none
}
.btr-profile .container-header h3 {
    width:100%;
    text-align:center;
    color:#fff;
    font:700 16px Verdana;
}
.btr-profile .people-list-header  h3 {
    width:87%;
    padding-left:74px
}
.btr-profile .btr-profile-favorites h3 {
    width:48%;
    padding-left:210px
}
.profile-name-history .text-pastname {
    color:#000!important
}
.home-friends .thumbnail-2d-container {
    border:none
}
.home-friends .thumbnail-2d-container img, .home-friends .section-content.remove-panel {
    background:#fff;
    border-top:0;
}
.dark-theme .home-friends .thumbnail-2d-container img,.dark-theme .home-friends .section-content.remove-panel, .dark-theme .game-main-content .game-calls-to-action, .dark-theme #game-detail-page .rbx-tabs-horizontal {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;;
    border:2px solid #477594;
}
[data-btr-page="home"] .home-friends .section-content.remove-panel {
    margin:0 10px
}
#roblox-badges-container .section-content {
    padding:10px;
    margin-bottom:0;
}
.btr-profile #roblox-badges-container .badge-list {
    max-height:350px
}
.btr-profile #roblox-badges-container .badge-list > .list-item .item-name, .people-list .friend .friend-name {
    color:blue;
    font-family:"Verdana";
    font-size:11px
}
.light-theme .game-card-container .game-card-name-secondary {
    font-size:10px;
    color:#000
}
.profile-container .asset-item span[title^='Veteran'] {
    background:no-repeat url("http://www.roblox.com/images/Badges/Veteran-75x75.png?v=2");
}
.profile-container .asset-item span[title^='Warr'] {
    background:no-repeat url("http://images.rbxcdn.com/14652f1598ba5520515965b4038214c0.png");
}
.profile-container .asset-item span[title^='Combat'] {
    background:no-repeat url("http://images.rbxcdn.com/d111059fca163b9824716cff2fe4aec5.png");
}
.profile-container .asset-item span[title^='Bloxxer'] {
    background:no-repeat url("http://images.rbxcdn.com/4cb4d69560f1f3478c314b24a52d2644.png");
}
.profile-container .asset-item span[title^='Inviter'] {
    background:no-repeat url("http://images.rbxcdn.com/156b077267b7848d38df4471e2a2c540.png");
}
.profile-container .asset-item span[title^='Administrator'] {
    background:no-repeat url("http://images.rbxcdn.com/ae42d1c6cd258306303423a69b1ed7bf.png");
}
.profile-container .asset-item span[title^='Friendship'] {
    background:no-repeat url("http://images.rbxcdn.com/46c15f2030a8c68ab1ff4329765e515a.png");
}
.profile-container .asset-item span[title^='Homestead'] {
    background:no-repeat url("http://images.rbxcdn.com/26bdc9274d6c2520b3d72ebaa71e50f7.png");
}
.profile-container .asset-item span[title^='Bricksmith'] {
    background:no-repeat url("http://images.rbxcdn.com/4e483c695695b47c92591825929d1059.png") 8px 0;
    background-size:54px 75px
}
.profile-container .asset-item span[title^='Welcome To'] {
    background:no-repeat url("http://images.rbxcdn.com/049d72ade1586da1cfe2e48618cc3959.png");
} /*TBC:http://images.rbxcdn.com/709c584f36286157c955ffcbb8dbfe36.png OBC:http://images.rbxcdn.com/50e4f48e4007754b55c82fc3d50c9c12.png */
.profile-container .asset-item span[title^='Official'] {
    background:no-repeat url("http://images.rbxcdn.com/ca460efad9ffdbce1f982672d0bf5e2a.png");
}
.light-theme .btr-profile-groups .game-card-container .game-card-name {
    font-family:"Arial";
    font-size:11px;
    font-weight:normal
}
.light-theme .asset-thumb-container {
    background:none;
    border-radius:0;
    border:1px solid;
}
#rbx-body .pager .pager-prev a, #rbx-body .pager .pager-next a {
    background:transparent;
    border:none;
}
#rbx-body .pager a span {
    display:none
}
.pager li a {
    width:auto
}
#rbx-body .pager .pager-prev a:before {
    content:"Previous";
    font-size:10px;
    color:blue;
    cursor:pointer
}
.btr-pager-holder .pager-mid, .pager li span {
    font-size:10px;
}
#rbx-body .pager .pager-next a:before {
    content:"Next";
    font-size:10px;
    color:blue;
    cursor:pointer
}
#rbx-body.dark-theme .pager .pager-prev a:before, #rbx-body.dark-theme .pager .pager-next a:before, .dark-theme .group-details .group-members-list .member .member-name {
    color:#AFCDE0
}
#rbx-body .pager .pager-prev a {
    line-height:1.2
}
#rbx-body .pager .pager-next a {
    line-height:1.3
}
#rbx-body .pager  a:hover:before {
    text-decoration:underline
}
#rbx-body .pager .disabled .pager-btn, #rbx-body .pager .disabled a {
    opacity:1
}
#rbx-body .pager .disabled .pager-btn, #rbx-body .pager .disabled a:before {
    color:#000;
    cursor:text
}
.btr-pager-holder input.pager-cur {
    padding:0;
    min-width:20px;
    height:18px;
    border-radius:0;
    max-width:36px
}
.btr-profile .btr-profile-playerbadges .asset-item .asset-thumb-container {
    border-radius:0
}
.dark-theme .pager .pager-next a:before, .dark-theme .pager .pager-prev a:before, .dark-theme.btr-profile #roblox-badges-container .badge-list > .list-item .item-name, .dark-theme .people-list .friend .friend-name, .dark-theme.btr-profile .profile-about-content .text-link {
    color:#AFCDE0
}
        /*inventory*/
.menu-vertical .menu-option-content {
    padding:0px 10px;
    width:100px;
    box-sizing:content-box;
    border:1px solid #777;
    margin:5px;
}
.menu-vertical .menu-option-content:hover {
    border-color:#000
}
.light-theme .menu-vertical .menu-option:hover {
    box-shadow:none
}
.light-theme .menu-vertical .menu-option.active {
    box-shadow:none
}
.light-theme .menu-vertical .menu-option.active .menu-option-content {
    background:#6e99c9;
    color:#fff;
}
.menu-vertical .menu-option-content .menu-text {
    font-size:14px;
    font-family:Verdana;
    text-align:center;
    width:100%
}
.menu-vertical .menu-option .menu-secondary-container {
    left:130px
}
.menu-vertical-container.category-tabs h3 {
    display:none
}
/*game*/
.game-stat-footer .text-report:link {
    font-size:11px;
    color:#000;
    padding-right:20px
}
.game-stat-footer .text-report:link:before {
    content:url(https://www.roblox.com//images/abuse.PNG?v=2);
    padding-right:5px
}
.light-theme .carousel-controls.btn-primary-md {
    border-radius:0
}
.btr-gamedetails.btr-hide-ads div.content, #game-detail-page {
    max-width:920px;
    padding:0
}
#game-detail-page {
    padding:0 10px
}
#game-badges-container {
    background:#fff;
    border-right:2px solid #6e99c9;
    border-left:2px solid #6e99c9
}
.btr-gamedetails.btr-hide-ads .btr-game-main-container {
    padding:0;
    height:442px
}
#game-details-carousel-container {
    width:480px;
    height:auto;
    position:absolute;
    margin-top:46px;
    margin-left:20px
}
.gotham-font .game-main-content .game-calls-to-action {
    padding:0;
}
.game-main-content .game-calls-to-action .game-name {
    font-size:16px;
    font-family:"Verdana";
    font-weight:700;
    color:#fff;
    background:#6e99c9;
    border-bottom:1px solid;
    padding: 3px 12px;
    text-align:center
}
.game-main-content .game-calls-to-action .game-creator {
    position:absolute;
    margin-top:2px;
    z-index:999;
    left:519px;
    right:auto!important;
    width:max-content
}
#recommended-games-container .game-card-link .game-card-info .playing-counts-label {
    top:0
}
.game-main-content .game-calls-to-action .game-creator a {
    color:blue
}
.gotham-font .game-main-content .game-calls-to-action .game-title-container {
    padding:0
}
.game-main-content .game-calls-to-action {
    border:2px solid #6e99c9;
    margin-top:10px;
    border-bottom:0;
    background:#fff;
    min-height:770px;
    width:900px;
    float:left;
    height:100%
}
.game-main-content {
    min-height:300px;
    height:330px
}
.game-stats-container {
    padding:8px 0 12px 0;
    border:0
}
.game-stats-container .game-stat {
    float:none;
    text-align:left;
    align-items: normal;
    display: block;
}
.game-stats-container .game-stat p {
    display:contents;
    margin:0
}
.game-stats-container.follow-button-enabled .game-stat-width {
    width:100%;
    padding-left:10px;
    height:13px
}
.game-stats-container.follow-button-enabled .game-stat-width .text-label, .game-stats-container .text-lead, .game-stats-container .text-lead:hover {
    color:#555;
    font-size:11px
}

.game-stats-container.follow-button-enabled .game-stat-width .text-label:after {
    content:":"
}
.game-stats-container.follow-button-enabled .game-stat-width .text-lead:before {
    content:" "
}
.gotham-font .text-name:link {
    color:blue;
    font-size:11px
}
.game-creator .text-label, .game-creator .text-label:hover {
    font-size:11px;
    color:#555
}
.game-creator .text-label:after {
    content:":"
}
.text.game-description.linkify {
    font-family:"Arial";
    color:#000;
    font-size:11px;
    line-height:16px;
    font-weight:400;
}
.dark-theme .text.game-description.linkify, .dark-theme .game-stat-footer .text-report:link {
    color:#fff
}
.dark-theme .game-stats-container.follow-button-enabled .game-stat-width .text-label, .dark-theme .game-stats-container .text-lead, .game-stats-container .text-lead:hover, .dark-theme .game-creator .text-label, .game-creator .text-label:hover {
    color:#aaa
}
.btr-game-main-container .btr-description {
    max-width:370px;
    border-top:0;
    position:absolute;
    right:20px;
    background:#fff;
    border:1px dashed #000;
    top:46px;
    display:flex;
    flex-direction:column;
}
.dark-theme .btr-game-main-container .btr-description {
    background:transparent;
    border-color: #477594;
}
.btr-game-main-container .btr-description pre {
    order:2;
    max-height:232px;
    overflow-y:scroll
}
.btr-game-main-container .btr-description .game-stat-footer {
    order:3
}
.game-main-content .game-calls-to-action .game-buttons-container {
    top:332px!important;
    display:flex;
    height:70px;
        background-color: #ccc;
    border: dashed 1px Green;
    color: Green;
    width:480px;
    left:20px;
    padding-top:10px!important
}
.dark-theme .game-main-content .game-calls-to-action .game-buttons-container {
    background:#333
}
.game-main-content .game-calls-to-action .game-buttons-container #game-details-play-button-container{
    width:auto;
    display:inline-block;
    position:absolute;
    margin-left:68px;
    z-index:99;
}
.game-main-content .game-calls-to-action .game-buttons-container #game-details-play-button-container .error-message {
    font-size:9px;
    font-family:"Comic Sans MS";
}
.icon-common-play {
    background:none!important;
    width:230px!important;
    height:40px!important
}
.btn-common-play-game-lg, .btn-common-play-game-lg:hover, .light-theme .btn-common-play-game-lg,  .btr-profile .btr-games-list .btr-game-playbutton-container .btn-primary-lg { /*play button*/
    border:none;
    background:url(https://i.imgur.com/21oPrDI.png)!important
}
#rbx-body .icon-favorite {
    background:url(https://www.roblox.com/images/cssspecific/rbx2/favoriteStar_20h.png);
    width:20px;
    height:20px;
    background-position:0 -20px;
    min-width:20px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container .icon-follow-game {
    background:url(http://www.roblox.com/images/feed-icons/feed-icon-14x14.png);
    width:14px;
    height:14px;
    min-width:14px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share {
    padding-top:4px;
    margin-left:0px
}
#rbx-body a:hover .icon-favorite, .icon-favorite:hover {
    background-position:0 0
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-favorite-button-container .icon-label {
    color:blue;
    line-height:20px;
    margin-left:6px;
    font-size:11px;
    font-family:Verdana
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container .icon-label {
    line-height:14px;
    color:blue;
    margin-left:6px;
    font-size:11px;
    font-family:Verdana
}
.text-link {
    color:blue!important
}
.dark-theme .text-link, .dark-theme .game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container .icon-label, .dark-theme .game-main-content.follow-button-enabled .favorite-follow-vote-share .game-favorite-button-container .icon-label {
    color:#AFCDE0!important
}
.favorite-button a, .follow-button a {
    display:flex
}
.voting-panel .users-vote .upvote span {
        background: url(http://www.roblox.com/images/Icons/thumbsup.png?1) no-repeat 0 -170px;
    width: 12px;
    height:13px
}
.voting-panel .users-vote .upvote span.selected {
    background-position:0 -184px
}
.voting-panel .users-vote .upvote span:hover {
    background-position:0 -197px
}
.voting-panel .users-vote .downvote span {
    background: url(http://www.roblox.com/images/Icons/thumbsup.png?1) no-repeat 0 -224px;
    width: 12px;
    height: 13px;
    position:relative
}
.voting-panel .users-vote .downvote span.selected {
    background-position:0 -238px
}
.voting-panel .users-vote .downvote span:hover {
    background-position:0 -252px
}
.voting-panel .users-vote .downvote {
    margin-top:-7px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .voting-panel .users-vote .upvote, .game-main-content.follow-button-enabled .favorite-follow-vote-share .voting-panel .users-vote .downvote {
    top:9px
}
#rbx-body .voting-panel .users-vote .vote-details .vote-container .vote-percentage {
    background:#52A846;
    height:5px
}
#rbx-body .voting-panel .users-vote .vote-details .vote-container .vote-background, #rbx-body .voting-panel .users-vote .vote-details .vote-container .vote-background.has-votes {
    height:5px;
    background:#CE645B
}
#rbx-body .voting-panel .users-vote .vote-details .vote-container .vote-mask .segment {
    height:5px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .voting-panel {
    bottom:0px;
}
.voting-panel .users-vote .vote-details .vote-numbers {
    padding:0 14px;
}
.vote-numbers .count-left span,.vote-numbers .count-right span {
    font-size:11px;
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container {
    width:335px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-favorite-button-container {
    width:85px;
    position:absolute;
    top:-35px;
    left:-10px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share {
    width:auto;
}
.game-stat-footer {
    padding:0
}
.btr-game-main-container {
    margin-bottom:0
}
.social-links *, .btr-badges-container * {
    padding:0
}
.social-links, .badge-container {
    border:2px solid #6e99c9;
    margin:0 10px 5px 10px
}
.badge-container {
    margin-bottom:0
}
.social-links .container-header, .btr-badges-container .container-header{
    background:#6e99c9;
    padding:5px 12px
}
.social-links .section-content.remove-panel {
    background:none;
    border:none;
    margin-bottom:0
}
.social-links .container-header h3, .btr-badges-container h3 {
    font-size:16px;
    font-weight:700;
    color:#fff;
    width:100%;
    text-align:center;
}
.social-links .medallion {
    all:unset
}
.social-links .type-img {
    transform:scale(.5);
    top:-10px
}
.social-links .contents {
    height:37px
}
.social-links .title-wrapper {
    margin-left:0px;
    padding-left:50px
}
.social-links .title-wrapper .title {
    font-size:12px
}
.btr-badges-container .badge-row .badge-image, .btr-badges-container .badge-row .badge-image img, .btr-badges-container .badge-row .badge-image thumbnail-2d {
    width:75px;
    height:75px
}
.badge-image .thumbnail-2d-container {
    border:0
}
.badge-content .badge-name {
    font-size:11px!important;
    color:blue
}
.badge-content p {
    font-size:11px;
    margin:0!Important;
    height:auto
}
.btr-badges-container .badge-row .badge-data-container > p {
    height:auto
}
.btr-badges-container .badge-row .badge-stats-container, game-badges-list .badge-row .badge-stats-container li {
    margin:0;
    padding:0
}
.game-badges-list .badge-row .badge-stats-container li .text-label, game-badges-list .badge-row .badge-stats-container li .text-label, .game-badges-list .badge-row .badge-stats-container li .badge-stats-info, game-badges-list .badge-row .badge-stats-container li .badge-stats-info {
    font-size:11px;
    font-weight:400;
    font-family:Verdana;
    margin:0
}
.stack .stack-list .stack-row {
    padding:0 12px;
    min-height:60px
}
.content .rbx-tab {
    min-width:0
}
.page-content .rbx-tabs-horizontal .rbx-tab {
    width:auto;
    margin-right:20px
}
#rbx-body .rbx-tabs-horizontal .rbx-tab-heading, #rbx-body .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover, #rbx-body .btn-buy-md, .light-theme .btn-control-xs {
    background-color: #fff;
    border: solid 1px #333!important;
    color: #333;
    font-family: Verdana, Sans-Serif;
    font-size: 10px;
    padding: 3px 10px 3px 10px;
    border-radius:0;
    box-shadow:none
}
#rbx-body.dark-theme .rbx-tabs-horizontal .rbx-tab-heading, #rbx-body.dark-theme .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover {
    background:#243a4a ;
    border-color:#477594!important;
}
#rbx-body.dark-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
    background:#477594!important
}
#rbx-body .create-server-banner .btn-secondary-md {
    margin-top:2px;
    margin-right:2px
}
.rbx-tab .rbx-tab-heading span {
    font-size:10px!important
}
#rbx-body .avatar .avatar-card-image {
    background:none!important
}
#rbx-body .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading, #rbx-body .btn-buy-md:hover, #rbx-body .btn-control-xs:hover, #rbx-body .btn-control-xs:focus {
    box-shadow:none;
    background-color: #6e99c9;
    color: #fff;
}
#rbx-body .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading * {
    color:#fff
}
#game-detail-page .game-carousel .grid-item-container {
    width:139px
}
.btr-gamedetails #game-instances .stack-list .stack-row {
    border:0
}
.gotham-font #game-detail-page .rbx-tabs-horizontal div, .gotham-font .rbx-tabs-horizontal p {
    font-size:11px
}
.gotham-font #game-detail-page .rbx-tabs-horizontal .section-left {
    width:140px;
}
#game-detail-page .rbx-tabs-horizontal {
    border:2px solid #6e99c9;
    border-width:0 2px 2px 2px;
    margin-top:0;
    background:#fff
}
.light-theme .rbx-tabs-horizontal .nav-tabs {
    padding-top:5px;
    padding-left:5px;
    background:transparent
}
.light-theme .rbx-tabs-horizontal #horizontal-tabs .rbx-tab:not(.active) a:not(:hover) {
    background:#e5f1fd
}
.pager.btr-server-pager .first a, .pager.btr-server-pager .last a{
    background:none;
    border:none;
    height:0px
}
.pager.btr-server-pager .first a:before {
    content:"First";
    font-size:10px;
    color:blue
}
.pager.btr-server-pager .first.disabled a:before, .pager.btr-server-pager .last.disabled a:before {
    color:black
}
.pager.btr-server-pager .last a:before {
    content:"Last";
    font-size:10px;
    color:blue
}
.pager li a {
    height:auto
}
.tab-content .pager-next, .tab-content .pager-prev {
    height:16px
}
.rbx-tab-content .stack .stack-list .stack-row {
    padding-left:2px;
    margin-bottom:0
}
.gotham-font.light-theme .refresh-link-icon {
    padding:0
}
.store-card img {
    width:120px;
    height:120px
}
.gotham-font.light-theme .refresh-link-icon::after {
    content:none
}
/*avatar*/
.avatar-editor-header {
    display:none
}
#avatar-container .left-wrapper-placeholder {
    float:right
}
#bodyColors .color-dot.ng-scope {
    border-radius:0;
    margin:1px;
    height:30px;
    width:30px
}
#bodyColors .advanced-link {
    font-size:60px;
    height:auto;
    width:max-content;
    margin-top:10px;
    margin-left:100px
}
.light-theme #avatar-container .rbx-tabs-horizontal .rbx-tab-heading {
    border:none!important;
    background:none;
    padding:0 9px 0 0
}
.six-tab.active span {
    font-weight:bold!important
}
.light-theme #avatar-container .rbx-tabs-horizontal .rbx-tab-heading span {
    color:blue
}
.light-theme #avatar-container .rbx-tabs-horizontal .rbx-tab-heading span:after {
    content:" |";
    padding-left:6px;
    color:#000
}
.light-theme #avatar-container .rbx-tabs-horizontal .rbx-tab-heading .icon-down {
    display:none
}
#avatar-container.page-content .rbx-tabs-horizontal .rbx-tab {
    margin-right:0
}
[data-internal-page-name="Avatar"] .content.six-column {
    width:900px;
    padding:12px 10px 0 10px
}
[data-internal-page-name="Avatar"] .section-content.remove-panel,[data-internal-page-name="Avatar"] .thumbnail-2d-container {
    border:0;
    background:0
}
[data-internal-page-name="Avatar"] .right-wrapper-placeholder-six-column * {
    max-width:450px!important;
    margin:0 auto
}
[data-internal-page-name="Avatar"] .right-wrapper-placeholder {
    max-width:600px;
    border-bottom:1px solid
}
.avatar-back {
    background:0;
    border:1px solid
}
[data-internal-page-name="Avatar"] .right-panel.six-column {
    border:1px solid
}
.modal-backdrop.in {
    display:none
}
[data-internal-page-name="Avatar"] .modal-dialog .modal-content .modal-header {
    display:none
}
[data-internal-page-name="Avatar"] .modal-dialog .modal-content .modal-body {
    padding-right:5px
}
.color-dot, .color-dot.active::after {
    border-radius:0;
    box-shadow:none!important
}
[data-internal-page-name="Avatar"] .tab-horizontal-submenu {
    padding:0
}
[data-internal-page-name="Avatar"] .right-wrapper-placeholder-six-column * {
    font-size:12px
}
.light-theme #wrap.pinned .right-wrapper::before {
    content:none
}
#wrap.pinned .right-wrapper {
    position:static
}
.color-dot.active::after {
    top:-1px;
    left:-1px
}
#advanced-body-colors .bodycolors-list-sm .color-dot {
    margin:0px 2px;
    width:30px;
    height:30px;
    box-shadow:1px 1px rgba(0,0,0,.5)!important
}

#advanced-body-colors .bodycolors-list-sm {
    margin-right:0;
    width:340px
}
#advanced-body-colors .radio {
    margin:0;
    padding:0
}
#advanced-body-colors .radio:not(:nth-child(1)) {
    box-shadow:1px 1px rgba(0,0,0.5)
}
#advanced-body-colors .radio:not(:nth-child(1)):focus-within {
    box-shadow: 2px 2px rgba(0,0,0.5)
}
#advanced-body-colors .radio:nth-child(1) {
    padding-left:15px
}
#advanced-body-colors .radio label {
    width:100%;
    height:100%
}
#advanced-body-colors .radio:not(:nth-child(1)) label, #advanced-body-colors .radio:not(:nth-child(1)) label:before, #advanced-body-colors .radio:not(:nth-child(1)) label:after {
    background:none;
    border:none;
    color: transparent;
}
#advanced-body-colors .radio:focus {
    border:1px solid
}

#advanced-body-colors .radio:nth-child(2) {
    background:yellow;
    width:50px;
    height:50px;
    color:transparent;
    margin-left:80px;
}
#advanced-body-colors .radio:nth-child(3) {
    background:blue;
    width:100px;
    height:100px;
    margin-left:55px;
    margin-top:10px
}
#advanced-body-colors .radio:nth-child(4) {
    position:absolute;
    width:45px;
    height:100px;
    background:yellow;
    margin-top:-100px;
    margin-left:0px
}
#advanced-body-colors .radio:nth-child(5) {
    position:absolute;
    width:45px;
    height:100px;
    background:yellow;
    margin-top:-100px;
    margin-left:165px
}
#advanced-body-colors .radio:nth-child(6) {
     position:absolute;
    width:45px;
    height:100px;
    background:green;
    margin-top:10px;
    margin-left:55px
}
#advanced-body-colors .radio:nth-child(7) {
     position:absolute;
    width:45px;
    height:100px;
    background:green;
    margin-top:10px;
    margin-left:110px
}
#advanced-body-colors {
    position:absolute;
    margin-left:-235px;
    border:1px solid;
    border-top:0;
    margin-top:-220px
}
.modal-content {
    border:none
}
.tab-horizontal-submenu .submenu-row .text-label, [data-internal-page-name="Avatar"]  .right-wrapper-placeholder-six-column .tab-horizontal-submenu * {
    min-width:0!important;
    padding-top:1px;
    padding-bottom:1px;
    color:blue;
    font-family:Verdana;
    border:0;
    font-size:11px!important;
    
}
.tab-horizontal-submenu .submenu-row {
    display:block;
    padding-top:0;
    padding-left:5px;
}
.tab-horizontal-submenu .submenu-row::after, .tab-horizontal-submenu .submenu-row::before {
    content:none!important
}
.tab-horizontal-submenu.six-column {
    padding:0 3px;
    background:none
}
[data-internal-page-name="Avatar"] .breadcrumb-container{
    display:none
}
.tab-horizontal-submenu.six-column {
    box-shadow:none;
    border:none
}
[data-internal-page-name="Avatar"] .items-list .item-card .item-card-thumb-container {
    width:85px;
    height:85px
}
.light-theme .item-card-container .item-card-equipped {
    background:none;
    width:85px;
    height:85px;
    border-radius:0
}
.item-card-container .item-card-equipped .icon-check-selection {
    background:none;
    height:0!Important;
    min-height:0;
    margin:0;
    width:auto;
    margin-top:-8px
}
.item-card-container .item-card-equipped .icon-check-selection:before {
    content:"[ Remove ]";
    font-size:8px;
    color:blue;
    border:1px solid #000;
    background:#fefefe;
}
.light-theme .item-card-container .item-card-thumb-container {
    border:1px solid
}
.items-list .item-card .item-card-caption {
    padding:0;
    width:90px
}
[data-internal-page-name="Avatar"]  .item-card-container .item-card-name {
    font-size:9px;

}
 .items-list .item-card .item-card-caption {
    line-height:1
}
[data-internal-page-name="Avatar"] .items-list.avatar-item-list .item-card {
    height:auto
}
[data-internal-page-name="Avatar"] .btn-secondary-xs:link {
    margin-right:5px
}
.light-theme .pill-toggle input:checked + label, .btr-switch .btr-switch-flip {
    background:#6e99c9;
    border-radius:0
}
.light-theme .pill-toggle, .btr-switch.btr-playertype-switch {
    border-radius:0;
    background:#fff;
    border:1px solid;
    padding:0;
}
.pill-toggle label {
    height:100%
}
[data-internal-page-name="Avatar"] .item-card-thumb-container {
    height:105px;
    width:105px
}
[data-internal-page-name="Avatar"] .hlist .list-item .item-card-link {
    display:grid
}
.item-card-creator.recommended-creator > span {
    font-size:0
}
[data-internal-page-name="Avatar"] .item-card-container {
    max-width:105px;
}
[data-internal-page-name="Avatar"] .item-card {
    height:auto
}
input[type=range]::-webkit-slider-runnable-track, input[type=range]::-moz-range-track {
    border-radius:0!important
}
input[type=range]::-webkit-slider-thumb, input[type=range]::-moz-range-thumb {
    border-radius:0!important;
    box-shadow:none!Important;
    border:1px solid!important;
    width:16px
}
.avatar-thumbnail .toggle-three-dee {
    min-height:0
}
input[type=range]::-webkit-slider-progress, input[type=range]::-moz-range-progress {
    background:#6e99c9!important;
    border-radius:0!important
}
input[type=range][disabled="disabled"]::-webkit-slider-progress, input[type=range][disabled="disabled"]::-moz-range-progress {
    background:#ccc!Important
}
/*item*/
[data-btr-page="itemdetails"] .clearfix.item-type-field-container .text {
    font-size:10.6px;
    color:#555;
    line-height:1
}
[data-btr-page="itemdetails"] .clearfix.item-type-field-container {
    line-height:1
}
[data-btr-page="itemdetails"] .content {
    max-width:900px;
    padding-left:10px;
    padding-right:10px;
}
[data-btr-page="itemdetails"] .item-thumbnail-container {
    margin-top:36px
}
.btr-explorer-btn-shown.btr-download-btn-shown h2, #item-container .border-bottom.item-name-container h2 {
        background-color: #6e99c9;
    color: #fff;
    font-family: Verdana;
    font-size: 18px;
    font-weight:700;
    margin: 0;
    text-align: center;
    padding:0;
    position:absolute;
    width:100%;
    left:0
}
.border-bottom.item-name-container {
    border:0;
}
.btr-explorer-button, .btr-download-button, .btr-content-button, [data-btr-page="itemdetails"] .item-context-menu {
    top:4px
}
[data-btr-page="itemdetails"] #item-details {
    background:#fff;
    border:1px dashed;
    width:400px;
    margin-top:1px;
    margin-right:10px
}
[data-btr-page="itemdetails"] .creator-name.text-link {
    font-size:10px;
    line-height:1;
    margin-left:0px;
}
[data-btr-page="itemdetails"] .creator-name.text-link:before {
    content:"Creator: ";
    color:#000;
    cursor:default
}
.light-theme .item-thumbnail-container .asset-thumb-container {
    background:transparent
}
[data-btr-page="itemdetails"] .thumbnail-holder, .light-theme .btr-preview-container-itempage {
    width:360px;
    height:360px;
    margin-left:10px;
    margin-top:10px
}
#item-details-description {
    color:#000;
    border:1px solid #555;
    margin:0 3px 0 5px;
    padding:2px 5px;
    width:97%
}
.light-theme .btr-preview-container-itempage {
    background:none
}
.light-theme .btr-preview-container-itempage canvas {
    margin-top:30px
}
#item-details-description {
    margin-left:0
}
[data-btr-page="itemdetails"] .border-bottom.item-name-container .text-name {
    margin-top:58px;
    position:absolute;
    margin-left:46px;
}
[data-btr-page="itemdetails"] .border-bottom.item-name-container .text-name:before {
    content:"Created by: ";
    color:#555;
    display:inline-block;
    padding-right:6px;
}
[data-btr-page="itemdetails"] .item-details .text-label, [data-btr-page="itemdetails"] .item-details .text-label:hover {
    display:none
}
.toggle-target.item-field-container .text-label {
    display:block;
    font-size:12px;
    margin-top:4px;
    margin-bottom:2px
}
.toggle-target.item-field-container .text-label:after {
    content:":"
}
[data-btr-page="itemdetails"] .text, [data-btr-page="itemdetails"] .text:hover {
    font-size:12px
}
[data-btr-page="itemdetails"] #type-content.text:before {
    content:"Type: "
}
.price-container, .item-field-container {
    margin:0
}
.light-theme .text-name.item-genre.wait-for-i18n-format-render {
    color:blue
}
.light-theme .text-name.item-genre.wait-for-i18n-format-render:before {
    content:"Genre:";
    color:#555!important;
    display:inline-block
}
.light-theme .field-content {
    color:#555;
    font-size:11px!important;
    line-height:1.1;
}
.light-theme .clearfix.item-field-container:nth-child(5) .field-content:before {
    content:"Created: "
}
.light-theme .clearfix.item-field-container:nth-child(6) .field-content:before {
    content:"Updated: "
}
[data-btr-page="itemdetails"] .container-header {
    background:#6e99c9;
}
[data-btr-page="itemdetails"] .container-header h3 {
    color:#fff;
    font-weight:700;
    width:100%;
    text-align:center
}
.recommendations-container .recommended-items-slider {
    background:#fff;
    border:2px solid #6e99c9
}
[data-btr-page="itemdetails"] .item-context-menu span, .light-theme .icon-flag, .light-theme .icon-flag:hover {
    background:url(https://www.roblox.com/images/abuse.PNG) no-repeat;
}
.light-theme .icon-flag:before {
    content:"Report Abuse";
    font-size:10px;
    color:blue;
    display:inline-block;
    width:80px;
    margin-left:-80px;
}
.light-theme .icon-flag:hover:before {
    text-decoration:underline
}
[data-btr-page="itemdetails"] .item-context-menu, [data-btr-page="itemdetails"] .item-context-menu span {
    height:19px;
    width:19px
}
.font-caption-body.item-note.has-price-label {
    margin-top:30px;
    padding:0;
    
}
.light-theme[data-btr-page="itemdetails"] .price-container .price-container-text {
    position:absolute;
    width:max-content;
    right:14px;
    top:70px;
}
.light-theme[data-btr-page="itemdetails"] .price-container .price-container-text span {
    color:green;
    font-weight:400;
    font-family:Verdana;
}
.light-theme[data-btr-page="itemdetails"] .price-container .price-container-text .text-robux-lg:before {
    content:"R$"
}
[ng-if="item.product.noPriceText.length > 0"]:before {
    content:none!Important
}
.light-theme[data-btr-page="itemdetails"] .favorite-button-container .text-favorite {
    padding:2px 0 0 1px;
    font-size:12px
}
.light-theme[data-btr-page="itemdetails"] .voting-panel .users-vote .downvote {
    margin-top:9px;
    margin-right:30px
}
.light-theme[data-btr-page="itemdetails"] .voting-panel .users-vote .upvote {
    margin-top:9px;
    margin-left:28px
}
.light-theme[data-btr-page="itemdetails"] .voting-panel {
    width:50%;
    margin-right:22px
}
.comments-container .comment-item .avatar img {
    border-radius:0;
    width:64px;
    height:64px;
    border:1px solid
}
.light-theme[data-btr-page="itemdetails"] .section-content {
    margin-bottom:0
}
.light-theme[data-btr-page="itemdetails"] #AjaxCommentsContainer {
    margin-top:0!important;
    background:#eee;
    border:1px solid;
    border-top:none;
    padding-bottom:10px;
}
asset-resale-pane .section-content{
    background:#eee!important;
    border-left:1px solid;
    border-right:1px solid
}
.resellers-container .vlist .list-item button {
    margin-right:10px;
    padding:0;
    height:30px
}
asset-resale-pane .container-header {
    background:#eee;
    margin-top:-6px;
    border-left:1px solid;
    border-right:1px solid
}
.btr-owners-container {
    background:#eee;
    border-left:1px solid;
    border-right:1px solid
}
.btr-owners-container .section-content {
    background:#eee;
}
[data-btr-page="itemdetails"] .item-card {
    width:14.2%
}
[data-btr-page="itemdetails"] .item-card-container,[data-btr-page="itemdetails"] .item-card-thumb-container {
    width:120px;
}
[data-btr-page="itemdetails"] .item-card-thumb-container {
    height:120px
}
[data-btr-page="itemdetails"] #AjaxCommentsContainer .section-content {
    padding:0;
    margin-left:10px;
    margin-right:56px;
    margin-bottom:10px;
    border:1px dashed
}
[data-btr-page="itemdetails"] .vlist .list-item .list-header {
    margin:7px 10px
}
[data-btr-page="itemdetails"] .comments-container .vlist .list-item .list-body, [data-btr-page="itemdetails"] .vlist .list-item .list-body .list-content {
    margin:0;
    font-size:11px;
    color:#555;
}
.light-theme[data-btr-page="itemdetails"] .comments-container .comment-form .form-group {
    margin-bottom:0;
    margin-top:10px;
    padding-left:10px
}
.light-theme[data-btr-page="itemdetails"] .comments-container .form-horizontal button {
    margin-top:10px
}
.comments-container .rbx-comment-input {
    height:auto
}
.light-theme[data-btr-page="itemdetails"] .comments-container .vlist .list-item .list-body {
    margin-top:5px
}
.light-theme[data-btr-page="itemdetails"] .vlist .list-item {
    min-height:80px;
    padding:0;
    border:0
}
.light-theme[data-btr-page="itemdetails"] .vlist .list-item:nth-child(odd) {
    background:#eee
}
.light-theme[data-btr-page="itemdetails"] #AjaxCommentsMoreButtonContainer button{
    background:none;
    border:none;
    text-align:right;
    float:right;
    color:blue;
    height:0;
    line-height:2.4
}
.text-favorite.favoriteCount {
    font-size:0!important;
    min-width:40px
}
.text-favorite.favoriteCount:before {
    content: attr(title);
    font-size:11px
}
.item-first-line {
    font-size:12px!important;
    padding:0;
    margin-top:18px
}
.icon-nav-charactercustomizer {
    height:16px;
    background:none!important;
    float:left
}
.icon-nav-charactercustomizer:before {
    content:"Go to editor";
    line-height:14px;
    margin-left:2px
}
#edit-avatar-button {
    padding:0;
    width:73px;
    margin-right:5px
}
/*group*/
.light-theme .group-details .text-date-hint {
    font-size:10px!important;
    letter-spacing:0;
    font-family:Verdana
}
.group-details .group-wall .comment .list-body {
    margin:0
}
.group-details .group-wall .comment .list-header {
    margin:8px 8px 8px 10px
}
.group-details .group-wall .comment .list-body .list-content {
    font-weight:bold;
    font-style:italic;
    font-size:11px;
    color:#000;
    padding:0;
    margin:0
}
.dark-theme .group-details .group-wall .comment .list-body .list-content {
    color:#fff
}
.group-details .group-wall .comment {
    border:0
}
.group-details .group-wall .comment:nth-child(odd) {
    background:#eee;
}
.dark-theme .group-details .group-wall .comment:nth-child(odd) {
    background:#477594;
}
.group-details .group-wall-no-margin {
    border:2px solid #6e99c9;
    padding:10px;
    background:#fff
}
.group-details .container-header {
    min-height:22px;
}
.btr-redesign group-description .container-header h3, .group-details .container-header.group-members-list-container-header h3, #rbx-body .input-group-btn .input-dropdown-btn {
    padding:0;
}
.btr-redesign group-members-list .input-group-btn > button .btr-role-member-count {
    font-size:11px;
    line-height:initial
}
.group-details .container-header h3, .group-details .group-header .group-caption .group-name {
    min-height:0;
    background-color: #6e99c9;
    color: #fff;
    font-family: Verdana;
    font-size: 16px;
    margin: 0;
    text-align: center;
    padding:0;
    position:absolute;
    width:100%;
    left:0
}
.dark-theme .group-details .container-header h3, .dark-theme .group-details .group-header .group-caption .group-name {
    background-color:#477594
}
.group-details .group-header .group-caption .group-name {
    border-color:transparent;
    border-bottom-color:#000
}
.group-details .group-header .group-image {
    margin-top:36px;
    margin-left:12px
}
group-description {
    margin-top:34px;
    overflow-y:clip!important;
    text-overflow:clip
}
.group-owner {
    margin-top:170px;
    margin-left:12px;
    position:relative
}
.group-header {
    width:150px
}
.group-details .group-header .group-caption {
    width:100%;
    position:absolute;
    height:auto
}
.group-games, .group-affiliates {
    border:2px solid #6e99c9;
    top:-6px;
    position:relative;
    background:#fff
}
.dark-theme .group-games, .dark-theme .group-affiliates {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
    border-color:#477594
}
.light-theme .text-robux {
    color:green;
    font-size:11px
}
group-store-item .text-robux:before {
    content:"R$: "
}
group-store-item .item-card {
    height:auto!Important
}
group-store-item .item-card-container {
    width:100px
}
.group-details .group-members-list {
    border:2px solid #6e99c9;
    top:-12px;
    position:relative;
    border-top:0;
    padding-top:0;
    background:#fff
}
.dark-theme .group-details .group-members-list {
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x;
    border-color:#477594
}
.group-games ul{
    margin-top:5px
}
.group-details .item-card-thumb-container {
    width:100px;
    height:100px
}
.group-details .item-cards-stackable .item-cardr {
    width:auto
}
.group-details  .rbx-tabs-horizontal .nav-tabs {
    padding-left:0
}
group-store .tab-content {
    margin-top:0px!important
}
.group-details .item-cards-stackable {
    border:2px solid #6e99c9;
    background:#fff
}
.dark-theme .group-details .item-cards-stackable{
    border-color: #477594;
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x
}
#group-shout .container-header {
    display:none 
}
.group-details .group-header .group-caption .group-info {
    min-height:0;
    display:block;
    max-width:146px
}
.group-details .group-header .group-caption .group-stats {
    flex-direction:column;
    margin-left:12px
}
.group-details .group-header .group-caption .group-info .group-stats li .font-header-2, .group-details .group-header .group-caption .group-info .group-stats .font-caption-header {
    font-size:10px
}
.group-details .group-header .group-caption .group-info .group-stats li span {
    order:2;
    margin-left:4px;
}
.group-details .group-header .group-caption .group-info .group-stats li {
    height:16px
}
.btr-redesign .btr-shout-container .shout-container {
    padding:0;
    width:max-content;
    max-width:400px;
    margin:0 auto
}
.group-details .group-shout .shout-container .avatar-headshot, group-description .container-header {
    display:none
}
.group-details .group-shout .shout-container .group-shout {
    padding:0;
    display:flex;
    flex-wrap:wrap;
    flex-direction:column

}
.group-shout-name {
    font-size:11px;
    height:18px;
    order:1;
    margin-top:-5px;
    margin-left:25px
}
.group-details .group-shout .shout-container .group-shout .group-shout-body {
    font-size:11px;
    color:black;
    background:#FEF1B5;
    border:1px solid #CD950C;
    padding:4px 3px
}
.group-details .group-shout .shout-container .group-shout .group-shout-body:before {
    content:"";
    width: 0; 
  height: 0; 
  border-left: 17px solid transparent;
  border-right: 0px solid transparent;
  border-top: 17px solid #CD950C;
    position:absolute;
    bottom:10px;
    left:4px
}
.group-details .group-shout .shout-container .group-shout .group-shout-body:after {
    content:"";
    width: 0; 
  height: 0; 
  border-left: 15px solid transparent;
  border-right: 0px solid transparent;
  border-top: 15px solid #FEF1B5;
    position:absolute;
    bottom:12px;
    left:5px
}
.group-details .group-shout .shout-container .group-shout .group-shout-info {
    margin:0;
    order:2;
    margin-left:26px;
}
.group-details .group-shout .shout-container .group-shout .group-shout-info .shout-date {
    font-size:9px!Important;
    color:#808080
}
.group-details .rbx-tabs-horizontal, .btr-group-about {
    margin:0
}
.btr-group-about {
    padding:0;
    margin:0!important;
    border:2px solid #6e99c9;
    border-bottom:0;
    display:flex;
    background:#fff!important
}
#group-shout {
    border:2px solid #6e99c9;
    border-top:0;
    padding-bottom:5px;
    background:#fff
}
.dark-theme #group-shout, .dark-theme .btr-group-about {
    border-color: #477594;
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x!important
}
.light-theme .rbx-tabs-horizontal #horizontal-tabs .rbx-tab:not(.active) a:not(:hover) {
    background:#fff
}
.group-owner.text.font-caption-body.ng-scope {
    z-index:99
}
.group-description {
    z-index:100;
    position:relative
}
.group-details .group-description .group-description-text .group-description-content-text {
    color:#000;
    font-size:11px;
    line-height:1
}
.dark-theme .group-details .group-description .group-description-text .group-description-content-text {
    color:#fff
}
.group-details .group-description .group-description-text {
    line-height:11px;
    overflow:hidden
}
.toggle-content.text-link[data-container-id="group-description-text"] {
    display:none
}
.group-details .toggle-target .content-height {
    height:100%
}
groups-list-item .menu-option-content {
    width:auto!important
}
.group-membership {
    margin-top:-56px;
    float:right;
    margin-right:20px;
    z-index:999
}
.gotham-font .text-robux-lg {
    color:green;
    font-weight:500;
    font-size:13px
}
group-store .container-header, group-games .container-header, group-affiliates .container-header{
    display:none!important
}
group-members-list .container-header {
    background:#fff!important;
    border-top:2px solid #6e99c9!important;
    border-bottom:0!important;
    border-left:2px solid #6e99c9;
    border-right:2px solid #6e99c9;
    margin-top:-6px
}
.dark-theme group-members-list .container-header{
    background:#243a4a url(https://www.roblox.com/images/CSSThemes/Outrageous/standardboxback.png) repeat-x!Important;
    border-color:#477594!important
}
.dark-theme .group-details .group-wall-no-margin {
    background:#243a4a;
    border-color:#477594
}
group-members-list .container-header h3 {
    display:none
}
.group-details .container-header.group-members-list-container-header .pager-holder .pager {
    margin-top:-12px
}
.btr-redesign group-members-list .input-group-btn > button .rbx-selection-label {
    font-size:12px
}
[data-internal-page-name="GroupDetails"] .content, [data-internal-page-name="GroupSearch"] .content {
    width:900px;
    padding-left:10px;
    padding-right:10px;
}
.group-details .container-header.group-members-list-container-header .group-dropdown {
    top:2px
}
.group-details .group-members-list .member {
    width:auto
}
.group-details .avatar-container {
    width:71px;
}
.group-details .avatar-container .hlist {
    margin-left:3px
}
.group-details .group-members-list .member .avatar-container span[thumbnail-type], .group-details .avatar-card-fullbody {
    width:64px;
    height:64px
}
.group-details .group-members-list .member .member-name {
    color:blue;
    font-size:11px;
    height:16px;
    margin-top:0
}
.group-details .group-members-list .thumbnail-2d-container {
    background:#fff;
    border:0
}
.rbx-scrollbar:not(.mCS_no_scrollbar) .mCSB_inside > .mCSB_container {
    margin-right:0
}
.gotham-font h1 {
    font-size:24px;
    padding:0
}
/*feed*/
#feed-container .list-body{
    font-size:11px
}
#feed-container .list-body .list-content a {
    font-size:12px;
    color:blue!Important;
    margin:0;
    padding:0;
    height:20px;
    line-height:1
}
#feed-container .list-body .list-content {
    margin:0;
    padding:0;
    line-height:1
}
#feed-container .list-body span {
    font-size:8px
}
#feed-container .list-item{
    margin:0
}
#feed-container .list-header {
    margin-right:8px
}
.feedtext.linkify {
    font-size:11px;
    font-style:italic;
    font-weight:bold;
    color:#000;
    font-family:Verdana
}
/*misc*/
.search-container .input-group .input-field.group-search-field {
    border-radius:0;
    padding:4px
}
[data-internal-page-name="PlayerSearch"] .avatar-cards .avatar-card {
    width:31%
}
.player-search-container  .input-group .input-field {
    padding:4px;
    width:500px;
    border-radius:0;
    height:26px;
    margin-left:10px
}
[data-internal-page-name="PlayerSearch"] .row.results-count {
    float:right;
    padding-right:5px;
    margin-top:-30px
}
.player-search-container .player-search-page .top-row {
    max-width:900px;
    background:#006699;
    border:2px solid #6e99c9
}
.player-search-container .player-search-page .top-row h3, .player-search-container .player-search-page .top-row .row.results-count * {
    color:#fff;
    font-family:Verdana;
    padding-left:4px
}
.player-search-container .player-search-page .input-group-btn {
    display:none
}
.player-search-container .player-search-page .top-row h3 {
    float:left;
}

[data-btr-page="friends"] .content {
    max-width:920px
}
#private-message .rbx-tab {
    min-width:200px!important;
    height:auto;
    border-bottom:1px solid
}
#friends-container .rbx-tab-heading.active {
    background:#6e99c9;
}
#friends-container .rbx-tab-heading.active span {
    color:#fff
}
.light-theme .content .friends-filter .friends-filter-searchbar-container {
    color:#000;
    border-radius:0;
    padding:0;
    height:24px
}
.content .friends-filter .dropdown button {
    height:24px;
    width:100px
}
.content .friends-filter .friends-filter-searchbar-container .icon-search {
    display:none
}
.avatar-card-container .avatar-card-content .avatar-card-caption.has-menu .avatar-name, .avatar-card-container .avatar-card-content .avatar-card-caption .avatar-name {
    color:blue
}
.avatar-card-container .avatar-card-content .avatar-card-caption.has-menu .avatar-name:hover, .avatar-card-container .avatar-card-content .avatar-card-caption .avatar-name:hover {
    text-decoration:underline
}
.light-theme .summary .table {
    background:transparent
}
.friends-content.section .avatar-card-container .avatar-card-content {
    display:block;
    width:max-content;
    margin:0 auto
}
.friends-content.section .avatar-card-container .avatar-card-content .avatar-card-caption {
    padding:0;
    display:block;
    width:100%
}
.friends-content.section .avatar-card-container .avatar-card-content .avatar-card-fullbody {
    margin:0 auto;
}
.friends-content.section .avatar-card-container {
    width:max-content;
    min-width:120px
}
.friends-content.section span {
    border:0
}
.friends-content .accept-friend, .friends-content .ignore-friend {
    width:95px
}
.friends-content.section .avatar-card-btns {
    width:max-content
}
.friends-content .avatar-name {
    font-size:13px
}
.friends-content .avatar-card-label {
    font-size:11px
}
.friends-content .avatar-cards .avatar-card {
    width:185px
}
.ignore-button.see-all-link.btn-control-xs.btn-min-width {
    background:none;
    border:none!important;
    color:blue;
    text-decoration:underline
}
.avatar-card-link  [thumbnail-target-id="156"] {
    background:url("https://static.wikia.nocookie.net/roblox/images/3/39/Fndjdjxjx.png")-1px !important;
    background-size:46px!important
}
.avatar-card-link [thumbnail-target-id="156"] img {
    visibility:hidden
}
.light-theme .paired-name span:first-child, .message-detail .body strong {
    color:blue
}
.message-detail .body div, .message-detail .body strong{
    font-size:12px!important
}
.message-detail .body {
    border:1px dashed;
    padding:5px
}
.message-detail {
    border:2px solid #ccc
}
/*awesomer*/
*[alt="We're making things more awesome.  Be back soon."] {
    background:url(https://static.wikia.nocookie.net/roblox/images/4/4a/OH_NOES.png/revision/latest?cb=20111228145107)
}
/*404*/
.request-error-page-content .default-error-page .action-buttons {
    bottom:-18px;
    left:37.7%
}
.request-error-page-content {
    margin-top:0
}
.request-error-page-content .default-error-page .message-container {
    float:none;
    width:100%
}
.request-error-page-content .default-error-page .error-image {
    display:none
}
.request-error-page-content .default-error-page .message-container .error-message {
    height:240px;
    background:no-repeat url(https://i.imgur.com/EcDVIU1.jpg)50% 28px;
    content:none!important;
    width:max-content;
    margin:0 auto;
    font-size:0;
}
.request-error-page-content .default-error-page .message-container .error-title {
    font-size:0px;
    color:#000;
    font-weight:700;
    font-family:arial;
    margin:0 auto;
    width:max-content
}
.request-error-page-content .default-error-page .message-container .error-title:after {
    content:"Oops - you've reached this page in error.";
    font-size:18px
}
.request-error-page-content .default-error-page .message-container .error-message:after {
    content:"If you continue to receive this page please contact customer service.";
    font-size:18px;
    color:#000;
    font-weight:700;
    font-family:arial
}
/*premium*/
.premium-landing-page .premium-title-section, .premium-landing-page .stipend-section, .premium-landing-page .catalog-benefit-section, .premium-landing-page .game-benefit-section, .premium-landing-page .trade-benefit-section, .premium-landing-page .membership-section .benefits-detail-container .lucky-gatito {
    display:none
}
.light-theme .premium-landing-page .membership-section .subscription-card, .light-theme .premium-landing-page .membership-section .subscription-card:not(.disabled):not(.purchased):hover {
    background:no-repeat url(https://i.imgur.com/oyiZFqE.png)0 -6px;
    background-size:409.76%;
    border:0
}
.light-theme .premium-landing-page .membership-section .div-table-cell:nth-child(2) .subscription-card {
    background-position:-516px -6px!important
}
.light-theme .premium-landing-page .membership-section .div-table-cell:nth-child(3) .subscription-card {
    background-position:-772px -6px!important
}
.premium-landing-page .membership-section .subscription-card {
    width:250px
}
.light-theme .premium-landing-page .membership-section .subscription-card div{
    display:none
}
.premium-landing-page .membership-section .subscribe-button {
    margin-top:200px
}
.light-theme .premium-landing-page .membership-section {
    background:#fff
}
.premium-landing-page .membership-section .subscription-card {
    height:206px
}
.light-theme .benefits-detail-container .icon-menu-games-on {
    background:url(https://www.roblox.com/images/HardHatBullet2.png);
    width:30px;
    height:30px
}
.light-theme .benefits-detail-container .icon-robux-28x28 {
    background:url(http://www.roblox.com/images/AllowanceBullet2.png);
    filter:none;
    width:30px;
    height:30px
}
.light-theme .benefits-detail-container .icon-menu-shop {
    background:url(http://www.roblox.com/images/SellBullet2.png);
    filter:none;
    width:30px;
    height:30px
}
.light-theme .icon-menu-trade {
     background:url(https://www.roblox.com/images/magnifying.png);
    filter:none;
    width:30px;
    height:30px
}
.light-theme .premium-landing-page .membership-section .benefits-detail-container {
    background:0;
    padding:0 30px;
    margin:0
}
.premium-landing-page .membership-section .membership-sec-header {
    margin:0;
    padding:20px
}
.premium-landing-page .membership-section {
    height:auto
}
/*money*/
[data-btr-page="money"] .content {
    max-width:920px
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
