// ==UserScript==
// @name Roblox 2008 Look
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.0.4
// @description Makes Roblox look like its 2008
// @author Anthony Chavez
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @include http://roblox.com/*
// @include https://roblox.com/*
// @include http://*.roblox.com/*
// @include https://*.roblox.com/*
// @downloadURL https://update.greasyfork.org/scripts/438181/Roblox%202008%20Look.user.js
// @updateURL https://update.greasyfork.org/scripts/438181/Roblox%202008%20Look.meta.js
// ==/UserScript==

(function() {
let css = `
/*roblox 2008*/
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
    font-family:"Comic Sans MS";
    background:#fff;
    font-size: 8pt;
}
#navigation-container {
    max-width:900px;
    margin:0 auto;
    color:#fff
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
.light-theme .item-card-container .item-card-thumb-container {
    background:transparent
}
.light-theme .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading.active {
    box-shadow:none
}
/*feet*/
.light-theme .container-footer {
    padding:0;
    background:none;
}
.footer .footer-links, .footer .footer-link {
    margin:0
}
.light-theme .copyright-container {
    margin:0;
    border:0;
    padding:0
}
.footer .footer-links a {
    color:blue!Important;
    font-size:11px!Important;
    margin:0
}
.container-main {
    padding-bottom:60px
}
.copyright-container .footer-note {
    font-size:9px!important;
    color:transparent;
    margin:0;
    line-height:1.1
}
.copyright-container .col-sm-6:nth-child(1) {
    width:auto;
    padding-right:5px
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
.light-theme .rbx-header .rbx-navbar li:hover {
    border-color:transparent
}
.light-theme .rbx-header .container-fluid, .dark-theme .rbx-header .container-fluid {
    background-color: #6e99c9;
    border:1px solid #000;
    position:static;
    margin-top:72px;
    border-left:0;
    border-right:0;
    height:38px;
    width:898px
}
.btr-no-hamburger #header .rbx-navbar-header {
    position:absolute;
    margin-left:35%;
    top:0px;
    display:block
    
}
.light-theme .icon-logo, .dark-theme .icon-logo {
    background:url(https://www.roblox.com/images/roblox_logo.png);
    width:224px;
    height:59px;
}
.light-theme .rbx-header, .dark-theme .rbx-header {
    height:110px;
    background:no-repeat url(https://i.imgur.com/NqtRvsU.png);
    border:1px solid #000;
    width:900px;
    margin:0 auto;
    position:static;
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
.light-theme .rbx-header .navbar-search .input-field {
    font-size:12px
}
.light-theme .input-group .input-group-btn .input-addon-btn {
    display:none
}
.rbx-header .rbx-navbar-right {
    position:absolute;
    right:14px;
    top:14px;
    background:#fff;
    border:1px solid;
}
.light-theme .rbx-header .navbar-search .input-field {
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
.light-theme .rbx-header .text-header, .light-theme .rbx-header .text-header:visited {
    color:#fff;
    font-size:0px;
    font-family:"Comic Sans MS";
    padding:0;
    line-height:1.8;
}
.text-header[href="/home"]:before {
    content:"My ROBLOX | ";
    font-size:18px;
    padding-left:4px;
    color:#fff;
}
.text-header[href="/discover"]:before {
    content:"Games | ";
    font-size:18px;
    color:#fff;
}
.text-header[href="/catalog"]:before {
    content:"Catalog | ";
    font-size:18px;
    color:#fff;
}
.text-header[href="/develop"]:before {
    content:"Build ";
    font-size:18px;
    color:#fff;
}
.light-theme .icon-nav-notification-stream {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -35px -245px;
    opacity:.3;
    width:20px;
    height:28px
}
a:hover .light-theme .icon-nav-notification-stream, .icon-nav-notification-stream:hover, a:hover .icon-nav-notification-stream, button:hover .icon-nav-notification-stream {
    opacity:.5;
    background-position:-35px -244px!important;

}
.icon-nav-message-btr {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    filter:invert(0)
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
#nav-robux-icon .icon-robux-28x28, .light-theme .icon-robux-28x28 {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    background-position:0 -80px;
    filter:invert(.75)
}
#nav-robux-icon .icon-robux-28x28:hover, .light-theme .icon-robux-28x28:hover {
    background-position:0 -100px
}
.light-theme .icon-nav-settings {
    background:url(https://i.imgur.com/iA7MsgL.png);
    width:20px;
    height:20px;
    background-position:0 -180px;
    filter:invert(.75)
}
.light-theme .icon-nav-settings:hover {
    background-position:0 -160px
}
.rbx-header .rbx-navbar-icon-group li span[class^="rbx-text"] {
    color:green;
    font-size:11px;
}
.light-theme #header .btr-nav-notif, .light-theme .notification, .light-theme .notification-blue, .light-theme .notification-red {
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
    background:red
}
.light-theme #header .btr-nav-notif {
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
    margin:0 auto
}
.light-theme .rbx-left-col {
    width:240px;
    margin:0 auto;
    position:static
}
.rbx-left-col ul, .rbx-left-col li {
    padding:0;
    margin:0
}
.rbx-left-col .rbx-scrollbar .left-col-list {
    display:flex;
    padding-top:4px;
    font-family:"Comic Sans MS";
}
.btr-no-hamburger .rbx-left-col .rbx-scrollbar {
    width:230%;;
    overflow:hidden!Important
}
.simplebar-wrapper {
    max-width:000px
}
.rbx-left-col li span[class^="icon"] {
    display:none
}
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
    left:-320px
}
.rbx-left-col li .text-nav .avatar-headshot-xs {
    display:none
}
.rbx-left-col li .text-nav .font-header-2 {
    color:#fff;
    font-size:18px;
    margin:0;
    padding-right:6px
}
.rbx-left-col li .text-nav .font-header-2:before {
    content:"| "
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
.container-header {
    margin:0
}
.gotham-font .text, .gotham-font body, .gotham-font button, .gotham-font html, .gotham-font input, .gotham-font pre, .gotham-font select, .gotham-font textarea {
    font-family:Verdana
}
.light-theme .input-group-btn .input-dropdown-btn {
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
.light-theme, .light-theme .content {
    background:#fff
}
.light-theme .btn-control-sm, .profile-avatar-left .enable-three-dee, .btr-profile .btr-games-list .btr-game-playbutton-container .btn-primary-lg, .light-theme .btn-control-md, .light-theme .btn-primary-md, .light-theme .btn-alert-md, .light-theme .btn-secondary-md, .light-theme .btn-primary-sm, .light-theme .btn-secondary-xs:link, .avatar-thumbnail .toggle-three-dee, .light-theme .btn-growth-lg, .light-theme .avatar-card-btns .accept-friend, .light-theme .btn-primary-xs, .light-theme .request-error-page-content .action-buttons .btn-primary-md:link, .premium-landing-page .membership-section .subscribe-button {
    background-color: #fff;
    border: solid 1px #333;
    color: #333;
    font-family: Verdana, Sans-Serif;
    font-size: 10px;
    padding: 3px 10px 3px 10px;
    border-radius:0
}

.light-theme .btn-control-sm:hover, .profile-avatar-left .enable-three-dee:hover, .btr-profile .btr-games-list .btr-game-playbutton-container .btn-primary-lg:hover, .light-theme .btn-control-md:hover, .light-theme .btn-primary-md:hover, .light-theme .btn-alert-md:hover, .light-theme .btn-secondary-md:hover, .light-theme .btn-primary-sm:hover, .light-theme .btn-secondary-xs:link:hover, .avatar-thumbnail .toggle-three-dee:hover, .light-theme .btn-secondary-xs.active, .light-theme .avatar-card-btns .accept-friend:hover, .light-theme .avatar-card-btns .accept-friend,.light-theme .btn-primary-xs, .light-theme .request-error-page-content .action-buttons .btn-primary-md:hover, .premium-landing-page .membership-section .subscribe-button:hover {
    background-color: #6e99c9;
    color: #fff;
    border-radius:0
}
.input-group-btn .dropdown-menu li a {
    padding:1px 2px 1px 6px;
    font-size:13px;
    color:#333
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
.home-header-container {
    display:none
}
.light-theme .section-content.remove-panel {
    background:#eee;
    border:1px solid
}
.container-header.people-list-header {
    margin:0;
    border:1px solid;
    border-bottom:0;
}
.game-carousel {
    border:1px solid;
    background:#fff;
    padding:2px 0 0 5px
}
.game-home-page-container .game-home-page-carousel-title {
    background:#bbb;
    margin:0;
    border:1px solid;
    border-bottom:0;
    padding: 0
}

.people-list-container .container-header h3, .game-home-page-container .game-home-page-carousel-title .font-header-1 {
    font-family:"Comic Sans MS";
    font-size:16px;
    font-weight:700;
    color:#333;
    padding: 3px
}
.gotham-font.light-theme .see-all-link-icon, .gotham-font h3 {
    font-family:"Comic Sans MS";
    font-size:16px;
    font-weight:500;
    color:#333;
}
.light-theme .game-card-container .game-card-name {
    font-size: .8em;
    font-weight: bold;
    font-family:Verdana, Sans-Serif;
    line-height:16px;
    color:blue;
    margin:0
}
.light-theme .game-card-container .game-card-name:hover {
    text-decoration:underline
}
.game-card-container thumbnail-2d, .game-card-thumb-container, .light-theme .thumbnail-2d-container {
    border-radius:0;
    border:1px solid #000
}
.game-card-link .game-card-info .no-vote, .game-card-link .game-card-info .playing-counts-label, .game-card-link .game-card-info .vote-percentage-label {
    font-size:.65em;
    color:#000;
    padding:0
}
.game-card-link .game-card-info .playing-counts-label {
    color:red;
    top:-10px;
    position:relative;
    line-height:1;
    font-weight:bold
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
/*games*/
.dark-theme .game-cards .game-card, .light-theme .game-cards .game-card {
    margin-bottom:0
}
.game-tile-list {
    background:#fff;
    border:1px solid;
    height:240px;
    padding-top:2px;
    padding-left:2px;
    border-left:0;
    border-right:0
}
.games-list-container.is-windows .container-header.games-filter-changer{
    margin:0;
}
.horizontal-scroller .scroller, .light-theme .scroller.disabled {
    border:1px solid #000;
    background:#fff
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
    height:130px;
    width:130px
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-container, .container-main .splash.catalog-full-screen .catalog-results .item-cards-stackable .item-card .item-card-container {
    width:130px;
    margin:0
}
.container-main .catalog-full-screen .catalog-results .item-cards-stackable .item-card, .container-main .splash.catalog-full-screen .catalog-results .item-cards-stackable .item-card {
    width:145px
}
.light-theme .item-card-container .item-card-caption {
    padding-top:1px
}
.light-theme .item-card-container .item-card-name {
    margin:0;
    color:blue;
    font-size:11px;
    font-weight:bold;
    font-family:verdana
}
.light-theme .item-card-container .item-card-name:hover {
    text-decoration:underline
}
.item-card-container .icon-robux-16x16 {
    display:none
}
.light-theme .text-robux-tile {
    color:green;
    font-size:10px;
}
.light-theme .text-robux-tile:before {
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
    font-size:9px
}
.item-cards-stackable .item-card-price {
    top:-8px;
    position:relative;
    height:18px
}
[data-internal-page-name="Catalog"] .item-card-container .item-card-thumb-container span{
    border:none!important
}
.btr-catalog.light-theme .btr-item-card-more {
    pointer-events: unset;
    visibility: visible;
    opacity: 1;
    max-height: 50px;
    transition:none;
    border:none;
    box-shadow:none;
    background:transparent;
    margin-top:-10px
}
.light-theme .item-card-label, .light-theme .store-card-add-label, .light-theme .store-card-price {
    color:#000;
    font-size:10px;
    font-weight:bold
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
.light-theme .item-card .item-card-thumb-container::before {
    content:none
}
.search-options .btn-text, .light-theme .catalog-content .search-options .menu-link.active, .light-theme .catalog-content .search-options .menu-link:hover {
    color:blue;
    font-size:12px;
    line-height:15px
}
.light-theme .catalog-content .search-options .menu-link:hover {
    text-decoration:underline
}
.light-theme .catalog-content .search-options .menu-link.active {
    font-weight:bold
}
.catalog-container .search-bar-placement-right .heading {
    font-weight:200;
    font-family:Verdana;
    font-size:26px;
    position:absolute;
    left:0
}
.light-theme .input-field {
    border-radius:0;
}
 .light-theme #catalog-content .input-group .input-field {
    padding:0 0 0 4px;
     border-radius:0;
     height:30px;
     margin-top:2px
}
.light-theme #catalog-content .input-group-btn .input-dropdown-btn {
    padding:0 0 0 4px;
    border-radius:0;
    height:30px;
    margin-top:2px;
    background:#fff;
    margin-left:4px;
    border-color:#ccc
}
.light-theme #catalog-content .input-group-btn .input-dropdown-btn span {
    color:#000;
    font-family:verdana
}
.catalog-container .search-container {
    margin-bottom:0
}
.catalog-container .search-container {
    margin:0 auto;
    float:none
}
#catalog-content .search-bars.search-bar-placement-right {
    background-color: #eee;
    border: solid 1px #bbb;
    max-width:900px;
    margin:0 auto;
    padding-bottom:2px
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
    width:530px;
    background:rgb(176, 196, 222);
    margin:0;
    position:absolute;
    border:1px solid;
    padding:0 5px
}
.light-theme .btr-profile-about > .section-content {
    background:rgb(176, 196, 222);
    border:1px solid;
    margin-bottom:10px;
    padding:0 5px;
    border-top:0
}
.profile-about .profile-about-content .profile-about-content-text, .profile-about .remove-panel .description-container .personal-field-description {
    font-size:11px;
    font-family:"Comic Sans MS";
    line-height:1;
    color:#000;
}
.profile-about .profile-about-content {
    position:absolute;
    top:60px;
    width:42%;
    height:auto;
    right:5px
}
.btr-profile .profile-about-content .profile-about-text {
    line-height:1em
}
.btr-profile .profile-about-content .text-link {
    color:blue;
    font-size:11px
}
.btr-profile .btr-profile-left .btr-profile-about .container-header {
    height:0;
    min-height:0
}
.profile-header .header-caption .header-title .profile-name, .profile-header .profile-display-name {
    font-size:18px;
    font-family:"Comic Sans MS";
    font-weight:400;
    color:#000;
}
.profile-header .profile-display-name {
    font-size:13px!important;
    color:#000;
    margin:0 auto;
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
    background:rgb(176, 196, 222);
}
.profile-header .header-caption .header-title {
    margin:0 auto
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
#profile-current-wearing-avatar .thumbnail-2d-container, #profile-current-wearing-avatar .thumbnail-holder, .btr-profile .profile-avatar-left, .btr-profile .profile-avatar {
    width:max-content
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
    border:1px solid
}
.btr-profile .profile-container .profile-game .container-header {
    display:none
}
.btr-profile .container-header {
    min-height:16px;
    color: #333;
    margin-bottom:0
}
.btr-profile .container-header h3 {
    padding:0;
}
.profile-container .badge-list {
    overflow:visible
}
.btr-profile-groups, #roblox-badges-container, .btr-profile-favorites {
    border:1px solid;
    margin-top:5px
}
#roblox-badges-container .container-header, .btr-profile-groups .container-header, .btr-profile-bottom .container-header, .btr-profile-playerbadges .container-header, .btr-profile-favorites .container-header {
    background-color: #ccc;
    border-bottom: solid 1px #000;
    color: #333;
    padding:0;
    line-height:1;
    margin-top:0
}
.btr-profile-favorites .input-group-btn {
    margin:0
}
.btr-profile  .section-content.remove-panel {
    border:none
}
.btr-profile-bottom, .btr-profile-playerbadges {
    border:1px solid;
    margin-top:5px
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
#roblox-badges-container h3 {
    padding-left:210px;
    padding-right:210px
}
.btr-profile .btr-profile-groups h3 {
    padding-left:235px;
    padding-right:235px
}
.btr-profile .btr-profile-bottom .container-header h3 {
    padding-left:500px
}
.btr-profile .home-friends h3 {
    padding-left:230px
}
.btr-profile-playerbadges .container-header {
    padding-left:212px;
    padding-right:212px
}
.btr-profile-favorites .container-header h3 {
    padding-left:234px;
}
.profile-name-history .text-pastname {
    color:#000!important
}
.home-friends .section-content.remove-panel {
    border:1px solid
}
.home-friends .thumbnail-2d-container {
    border:none
}
.home-friends .thumbnail-2d-container img, .home-friends .section-content.remove-panel {
    background:none;
    border-top:0
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
    font-family:"Comic Sans MS";
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
    font-family:"Comic Sans MS";
    font-size:11px;
    font-weight:normal
}
.light-theme .asset-thumb-container {
    background:none;
    border-radius:0;
    border:1px solid;
}
.light-theme .pager .pager-prev a, .light-theme .pager .pager-next a {
    background:transparent;
    border:none;
}
.light-theme .pager a span {
    display:none
}
.pager li a {
    width:auto
}
.light-theme .pager .pager-prev a:before {
    content:"Previous";
    font-size:10px;
    color:blue;
    cursor:pointer
}
.btr-pager-holder .pager-mid, .pager li span {
    font-size:10px;
}
.light-theme .pager .pager-next a:before {
    content:"Next";
    font-size:10px;
    color:blue;
    cursor:pointer
}
.light-theme .pager .pager-prev a {
    line-height:1.2
}
.light-theme .pager .pager-next a {
    line-height:1.3
}
.light-theme .pager  a:hover:before {
    text-decoration:underline
}
.light-theme .pager .disabled .pager-btn, .light-theme .pager .disabled a {
    opacity:1
}
.light-theme .pager .disabled .pager-btn, .light-theme .pager .disabled a:before {
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
.btr-gamedetails.btr-hide-ads div.content, #game-detail-page {
    max-width:900px;
    padding:0
}
.btr-gamedetails.btr-hide-ads .btr-game-main-container {
    padding:0
}
#game-details-carousel-container {
    width:480px;
    height:auto;
    position:absolute;
    margin-top:30px;
    margin-left:58px
}
.game-main-content .game-calls-to-action {
    width:600px;
    float:left
}
.gotham-font .game-main-content .game-calls-to-action {
    padding:0
}
.game-main-content .game-calls-to-action .game-name {
    font-size:11.4px;
    font-family:"Comic Sans MS";
    font-weight:700;
    color:#333;
    background:#eee;
    border-bottom:1px solid;
    padding:0px;
    text-align:center
}
.game-main-content .game-calls-to-action .game-creator {
    position:absolute;
    margin-top:2px;
    z-index:999;
    left:620px;
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
    border:1px solid;
    margin-top:10px;
    border-bottom:0;
}
.game-main-content {
    min-height:300px;
    height:330px
}
.game-stats-container {
    border:1px solid #000!Important;
    position:absolute;
    right:0;
    width:290px;
    top:10px;
    padding:40px 0 0 0
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
    padding-left:10px
}
.game-stats-container.follow-button-enabled .game-stat-width .text-label {
    color:#888;
}
.game-stats-container.follow-button-enabled .game-stat-width .text-label:after {
    content:":"
}
.game-stats-container.follow-button-enabled .game-stat-width .text-lead:before {
    content:" "
}
.gotham-font .text-name:link {
    color:blue;
    font-size:12px
}
.game-creator .text-label {
    font-size:12px;
    color:#888
}
.game-creator .text-label:after {
    content:":"
}
.game-stats-container:after {
    content:"Stats";
    display:inline-block;
    width:100%;
    background:#eee;
    border-bottom:1px solid;
    font-size:11px;
    font-family:"Comic Sans MS";
    font-weight:700;
    position:absolute;
    top:0;
    height:17px;
    line-height:1.4;
    padding-left:126px
}
.text.game-description.linkify {
    font-family:"Comic Sans MS";
    color:#000;
    font-size:11px;
    line-height:16px;
    font-weight:400;
}
.btr-game-main-container .btr-description {
    max-width:600px;
    border:1px solid;
    border-top:0
}
.game-main-content .game-calls-to-action .game-buttons-container {
    top:290px!important;
    display:flex;
    height:40px
}
.game-main-content .game-calls-to-action .game-buttons-container #game-details-play-button-container{
    width:auto;
    display:inline-block;
    position:absolute;
    margin-left:232px;
    z-index:99;
    max-width:160px
}
.game-main-content .game-calls-to-action .game-buttons-container #game-details-play-button-container .error-message {
    font-size:9px;
    font-family:"Comic Sans MS";
}
.icon-common-play {
    background:none!important;
    width:auto!important;
    height:auto!important
}
.icon-common-play:before{
    content:"Visit Online";
    font-family:Verdana;
}
.light-theme .btn-common-play-game-lg:focus, .light-theme .btn-common-play-game-lg:hover {
    border-color:#000;
    background:#6e99c9
}
.light-theme .icon-favorite {
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
    margin-left:46px
}
.light-theme a:hover .icon-favorite, .icon-favorite:hover {
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
.light-theme .voting-panel .users-vote .vote-details .vote-container .vote-percentage {
    background:#52A846;
    height:5px
}
.light-theme .voting-panel .users-vote .vote-details .vote-container .vote-background, .light-theme .voting-panel .users-vote .vote-details .vote-container .vote-background.has-votes {
    height:5px;
    background:#CE645B
}
.light-theme .voting-panel .users-vote .vote-details .vote-container .vote-mask .segment {
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
    width:265px
}
.game-main-content.follow-button-enabled .favorite-follow-vote-share .game-favorite-button-container {
    width:85px
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
    border:1px solid
}
.social-links .container-header, .btr-badges-container .container-header{
    background:#eee;
    border-bottom:1px solid
}
.social-links .section-content.remove-panel {
    background:none;
    border:none;
    margin-bottom:0
}
.social-links .container-header h3, .btr-badges-container h3 {
    font-size:11px;
    font-weight:700;
    padding-left:417px;
}
.btr-badges-container h3 {
    padding-left:430px;
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
.light-theme .rbx-tabs-horizontal .rbx-tab-heading, .light-theme .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover, .light-theme .btn-buy-md, .light-theme .btn-control-xs {
    background-color: #fff;
    border: solid 1px #333!important;
    color: #333;
    font-family: Verdana, Sans-Serif;
    font-size: 10px;
    padding: 3px 10px 3px 10px;
    border-radius:0;
    box-shadow:none
}
.light-theme .create-server-banner .btn-secondary-md {
    margin-top:2px;
    margin-right:2px
}
.rbx-tab .rbx-tab-heading span {
    font-size:10px!important
}
.light-theme .avatar .avatar-card-image {
    background:none
}
.light-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading, .light-theme .btn-buy-md:hover, .light-theme .btn-control-xs:hover, .light-theme .btn-control-xs:focus {
    box-shadow:none;
    background-color: #6e99c9;
    color: #fff;
}
.light-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading * {
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
    border:1px solid
}
.light-theme .rbx-tabs-horizontal .nav-tabs {
    padding-top:5px;
    padding-left:5px
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
    width:900px
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
[data-btr-page="itemdetails"] .content {
    max-width:900px
}
[data-btr-page="itemdetails"] .item-thumbnail-container {
    margin-top:36px
}
.btr-explorer-btn-shown.btr-download-btn-shown h2, #item-container .border-bottom.item-name-container h2 {
        background-color: #ccc;
    border-bottom: solid 1px #555;
    color: #333;
    font-family: Comic Sans MS,Sans-Serif;
    font-size: 24px;
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
    margin-top:54px;
    position:absolute;
    margin-left:48px
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
    font-size:12px!important
}
.light-theme .clearfix.item-field-container:nth-child(5) .field-content:before {
    content:"Created: "
}
.light-theme .clearfix.item-field-container:nth-child(6) .field-content:before {
    content:"Updated: "
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
.light-theme[data-btr-page="itemdetails"] #AjaxCommentsContainer .section-content {
    padding:0;
    margin-left:10px;
    margin-right:56px;
    margin-bottom:10px;
    border:1px dashed
}
.light-theme[data-btr-page="itemdetails"] .section-content.remove-panel {
    border-bottom:0
}
.light-theme[data-btr-page="itemdetails"] .vlist .list-item .list-header {
    margin:7px 10px
}
.light-theme[data-btr-page="itemdetails"] .comments-container .vlist .list-item .list-body, .light-theme[data-btr-page="itemdetails"] .vlist .list-item .list-body .list-content {
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
.group-details .group-wall .comment {
    border:0
}
.group-details .group-wall .comment:nth-child(odd) {
    background:#eee;
}
.group-details .group-wall-no-margin {
    border:1px solid;
    padding:10px
}
.group-details .container-header {
    min-height:22px;
}
.btr-redesign group-description .container-header h3, .group-details .container-header.group-members-list-container-header h3, .light-theme .input-group-btn .input-dropdown-btn {
    padding:0;
}
.btr-redesign group-members-list .input-group-btn > button .btr-role-member-count {
    font-size:11px;
    line-height:initial
}
.group-details .container-header h3, .group-details .group-header .group-caption .group-name {
    min-height:0;
    background-color: #ccc;
    border: solid 1px #000;
    color: #333;
    font-family: Comic Sans MS,Sans-Serif;
    font-size: 16px;
    margin: 0;
    text-align: center;
    padding:0;
    position:absolute;
    width:100%;
    left:0
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
    margin-left:12px
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
    border:1px solid;
    top:-6px;
    position:relative
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
    border:1px solid;
    top:-12px;
    position:relative;
    border-top:0;
    padding-top:0
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
    border:1px solid
}
#group-shout .container-header {
    display:none
}
.group-details .group-header .group-caption .group-info {
    min-height:0;
    display:block
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
    border:1px solid;
    border-bottom:0;
    display:flex
}
#group-shout {
    border:1px solid;
    border-top:0;
    padding-bottom:5px
}
.group-details .group-description .group-description-text .group-description-content-text {
    color:#000;
    font-size:11px;
    line-height:1
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
    background:none!important;
    border-top:0!important;
    border-bottom:0!important;
    border-left:1px solid;
    border-right:1px solid;
    margin-top:-6px
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
[data-internal-page-name="GroupDetails"] .content {
    width:900px
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
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
