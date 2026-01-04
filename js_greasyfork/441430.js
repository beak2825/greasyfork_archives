// ==UserScript==
// @name         Roblox options extra
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  -
// @license GNU GPLv3
// @author       Genpro
// @match        https://*.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441430/Roblox%20options%20extra.user.js
// @updateURL https://update.greasyfork.org/scripts/441430/Roblox%20options%20extra.meta.js
// ==/UserScript==
(function() {
    'use strict';
		// css style insertion
    var styles = `
      body.light-theme {
        background-color: #e3e3e3;
        color: #191919;
      }
 
      .light-theme .content {
        background-color: unset;
        color: unset;
      }
 
      .light-theme .icon-default-navigation, .light-theme .icon-nav-blog, .light-theme .icon-nav-charactercustomizer, .light-theme .icon-nav-friends, .light-theme .icon-nav-group, .light-theme .icon-nav-home, .light-theme .icon-nav-inventory, .light-theme .icon-nav-menu, .light-theme .icon-nav-message, .light-theme .icon-nav-my-feed, .light-theme .icon-nav-notification-stream, .light-theme .icon-nav-profile, .light-theme .icon-nav-robux, .light-theme .icon-nav-search, .light-theme .icon-nav-search-white, .light-theme .icon-nav-settings, .light-theme .icon-nav-shop, .light-theme .icon-nav-trade {
        background-image: url(https://images.rbxcdn.com/f4000b6d03a0df7153556d2514045629-navigation_10022018.svg);
      }
 
      .light-theme .icon-default-logo, .light-theme .icon-logo {
        background-image: url(https://static.rbxcdn.com/images/Logo/roblox_logo.svg);
      }
 
      .light-theme .icon-default-logo-r, .light-theme .icon-logo-r {
        background-image: url(http://web.archive.org/web/20160805210957im_/https://static.rbxcdn.com/images/Logo/logo_R.svg);
	  }
 
      .light-theme .rbx-header {
        background-color: #0074bd;
        height: 40px;
        border-width: 0 0 0;
      }
 
      .light-theme.rbx-header {
        background-color: #0074bd;
        height: 40px;
        border-width: 0 0 0;
      }
 
      .light-theme.rbx-header .text-header, .light-theme.rbx-header .text-header:active, .light-theme.rbx-header .text-header:focus, .light-theme.rbx-header .text-header:hover, .light-theme.rbx-header .text-header:link, .light-theme.rbx-header .text-header:visited {
        color: #fff;
      }
 
      .dark-theme .game-card-container, .light-theme .game-card-container {
        background-color: #fff;
		box-shadow: 0 1px 4px 0 rgba(25,25,25,0.3)
      }
 
      .light-theme .game-card-info {
          position: absolute;
          bottom: 6px;
          width: 100%;
          margin: 0 6px;
      }
 
      .dark-theme .game-card-info .light-theme .info-label.icon-playing-counts-gray, .dark-theme .game-card-info .light-theme .info-label.icon-playing-counts-gray-white-70, .dark-theme .game-card-info .light-theme .info-label.icon-votes-gray, .dark-theme .game-card-info .light-theme .info-label.icon-votes-gray-white-70, .dark-theme .gotham-font .light-theme .refresh-link-icon::after, .dark-theme .gotham-font .light-theme .see-all-link-icon::after, .gotham-font.dark-theme .light-theme .refresh-link-icon::after, .gotham-font.dark-theme .light-theme .see-all-link-icon::after, .gotham-font.light-theme .refresh-link-icon::after, .gotham-font.light-theme .see-all-link-icon::after, .light-theme .game-card-info .info-label.icon-playing-counts-gray, .light-theme .game-card-info .info-label.icon-playing-counts-gray-white-70, .light-theme .game-card-info .info-label.icon-votes-gray, .light-theme .game-card-info .info-label.icon-votes-gray-white-70, .light-theme .gotham-font .refresh-link-icon::after, .light-theme .gotham-font .see-all-link-icon::after, .light-theme .icon-currently-playing-sm, .light-theme .icon-default-common-sm, .light-theme .icon-push-right-sm, .light-theme .icon-rating-sm, .light-theme .icon-refresh-sm {
        background-image: url(https://images.rbxcdn.com/153fd3209692232cd8087cad74a669b0-games.svg);
        background-repeat: no-repeat;
        vertical-align: middle;
 
      }
 
	  .game-tile .game-card-thumb-container .game-card-thumb {
	    border-top-right-radius: 3px;
		border-top-left-radius: 3px;
		height: 150px;
		width: 150px;
		overflow: hidden;
		display: inline-block;
		margin: auto;
	  }
	  
	  .game-card-container:hover {
	    -webkit-transition: box-shadow 200ms ease;
		-o-transition: box-shadow 200ms ease;
		transition: box-shadow 200ms ease;
		box-shadow: 0 1px 6px 0 rgba(25,25,25,0.75);
	  }
	  
 
      .dark-theme .game-card-info .info-label.icon-votes-gray, .dark-theme .game-card-info .info-label.icon-votes-gray-white-70, .icon-rating-sm, .light-theme .game-card-info .info-label.icon-votes-gray, .light-theme .game-card-info .info-label.icon-votes-gray-white-70 {
        background-position: 0 -480px;
      }
 
      .dark-theme .game-card-info .info-label.icon-playing-counts-gray, .dark-theme .game-card-info .info-label.icon-playing-counts-gray-white-70, .icon-currently-playing-sm, .light-theme .game-card-info .info-label.icon-playing-counts-gray, .light-theme .game-card-info .info-label.icon-playing-counts-gray-white-70 {
        background-position: 0 -496px;
      }
 
      .light-theme .game-card-container .game-card-name {
        padding: 0 6px;
      }
 
      .light-theme .btn-secondary-xs {
        user-select: none;
        background-color: #00a2ff;
        border: 1px solid #00a2ff;
        color: #fff !important;
        cursor: pointer;
        display: inline-block;
        font-weight: 500;
        height: auto;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        padding: 4px;
        font-size: 14px;
        line-height: 100%;
        border-radius: 3px;
      }
 
      .light-theme .btn-secondary-xs:link {
        color: #fff;
      }
 
      .light-theme .scroller {
        background-color: #fff;
        border: 1px solid #b8b8b8;
      }
 
 
      .light-theme .scroller.disabled {
        opacity: .5;
        cursor: default;
        border: 1px solid #e3e3e3;
      }
 
      .light-theme .section-content.remove-panel {
        background-color: #fff;
        padding-top: 16px;
        padding-left: 16px;
        padding-right: 16px;
      }
 
      .light-theme .people-list {
        height: 163px;
        max-height: 163px;
      }
 
      .light-theme .people-list-container {
        height: 220px;
      }
 
      .light-theme .rbx-upgrade-now .btn-secondary-md {
        background-color: #00a2ff;
        border: 1px solid #00a2ff;
      }
 
      .light-theme .notification, .light-theme .notification-blue, .light-theme .notification-red {
        background-color: #00a2ff;
        padding: 3px 5px;
        min-width: 24px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        text-align: center;
      }
 
      .light-theme .rbx-left-col {
        background-color: #fff;
        box-shadow: 0 0 3px rgba(25,25,25,.3);
      }
 
 
      .light-theme .btn-secondary-xs:focus, .light-theme .btn-secondary-xs:hover {
        background-color: #32B5FF;
        border-color: #32B5FF;
        color: #fff;
        cursor: pointer;
      }
 
      .light-theme .btn-secondary-xs.active, .light-theme .btn-secondary-xs:active {
        background-color: #32B5FF;
        color: #fff;
      }
 
      a.btn-secondary-xs .light-theme {
        color: #fff !important;
      }
 
      .btn-secondary-xs:link {
        color: #fff;
      }
 
 
      .light-theme.rbx-header .rbx-navbar li:hover {
        border: 0 #ececec66;
        border-bottom: 2px solid #ececec66;
      }
 
      .light-theme .item-card-container .item-card-caption {
        padding: 6px 6px 0 6px;
      }
 
      .dark-theme .item-card-container, .light-theme .item-card-container {
        background-color: #fff;
      }
 
      .light-theme .item-card-container .item-card-thumb-container {
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;
        position: relative;
        border-bottom: 1px solid #E3E3E3;
        background-color: #fff;
      }
 
      .light-theme .input-group-btn .input-dropdown-btn {
        user-select: none;
        border: 1px solid transparent;
        background-color: #fff;
        border-color: #B8B8B8;
        color: #191919;
        cursor: pointer;
        font-weight: 400;
        height: auto;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        margin: 0;
        line-height: 18px;
      }
 
      .light-theme .input-group-btn .input-dropdown-btn:focus, .light-theme .input-group-btn .input-dropdown-btn:hover {
        background-color: #00A2FF;
        border-color: #00A2FF;
        color: #fff;
        cursor: pointer;
      }
 
      .light-theme .input-group-btn .input-dropdown-btn.active, .light-theme .input-group-btn .input-dropdown-btn:active {
        background-color: #00A2FF;
        border-color: #00A2FF;
        color: #fff;
        cursor: pointer;
      }
 
 
 
      .light-theme .btn-control-md {
        user-select: none;
        background-color: #fff;
        border: 1px solid #b8b8b8;
        color: #191919;
        cursor: pointer;
        display: inline-block;
        font-weight: 500;
        height: auto;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        padding: 9px;
        font-size: 18px;
        line-height: 100%;
        border-radius: 3px;
      }
 
      .light-theme .btn-control-md:focus, .light-theme .btn-control-md:hover {
        background-color: #fff;
        border-color: #B8B8B8;
        color: #191919;
        cursor: pointer;
      }
 
      .light-theme .btn-control-md.active, .light-theme .btn-control-md:active {
        background-color: #fff;
        color: #191919;
      }
 
 
      .light-theme .pager .first .pager-btn, .light-theme .pager .first a, .light-theme .pager .last .pager-btn, .light-theme .pager .last a, .light-theme .pager .pager-next .pager-btn, .light-theme .pager .pager-next a, .light-theme .pager .pager-prev .pager-btn, .light-theme .pager .pager-prev a {
        background-color: #fff;
      }
	  
	  .light-theme .bg-gray-4 {
		background-color: unset;
	  }
 
.light-theme .btn-buy-md {
background-color: unset;
border-color: unset;
color: unset;
border-radius: unset;
 
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
border: 1px solid
transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
background-color:
#fff;
border-color:
#B8B8B8;
color:
#757575;
cursor: pointer;
display: inline-block;
font-weight: 400;
height: auto;
text-align: center;
white-space: nowrap;
vertical-align: middle;
padding: 9px 9px;
font-size: 18px;
line-height: 100%;
border-radius: 3px;
 
}
 
.light-theme .btn-buy-md:focus, .light-theme .btn-buy-md:hover {
background-color:
#3FC679;
border-color:
#3FC679;
color:
#fff;
cursor: pointer;
}
 
.light-theme .btn-buy-md.active, .light-theme .btn-buy-md:active {
background-color:
#3FC679;
color:
#fff;
}
 
 
 
.dark-theme .store-card, .light-theme .store-card {
    background-color: 
    #fff;
    position: relative;
    border: 0 none;
    border-radius: 3px;
    margin: 0 5% 0 0;
    max-width: 150px;
    padding: 0;
}
 
.light-theme .text-robux, .light-theme .text-robux-lg {
	  color:    #02b757;
    font-weight: 400;
}
.light-theme .text-robux-tile {
	  color:    #02b757;
    font-weight: 500;
}
 
.light-theme .icon-default-economy-small, .light-theme .icon-robux-16x16, .light-theme .icon-robux-gold-16x16, .light-theme .icon-robux-gray-16x16, .light-theme .icon-robux-white-16x16 {
background-image: url(https://static.rbxcdn.com/images/Shared/branded_04182018.svg);
background-repeat: no-repeat;
background-size: 32px auto;
width: 16px;
height: 16px;
display: inline-block;
vertical-align: middle;
}
.store-card-price .icon-robux-16x16 {
	margin-top: 0px !important;
}
 
.icon-robux-16x16 {
	background-position: 0px -64px !important;
}
 
 
.light-theme .icon-default-economy-28x28, .light-theme .icon-robux-28x28, .light-theme .icon-robux-gold-28x28, .light-theme .icon-robux-gray, .light-theme .icon-robux-white {
	background-image: url(https://images.rbxcdn.com/757f696cbfd2d8fcde61d219cead6a2c-branded_04182018.svg) !important;
}
 
#nav-robux-icon .icon-robux-28x28 {
 
    background-position: -0px -196px;
 
}
 
#nav-robux-icon .icon-robux-28x28:hover {
	background-position: -28px -196px; !important;
}
 
.rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
    color: 
#191919 !important;
box-shadow: 0 -4px 0 0
    #00A2FF inset !important;
}
 
 
.rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover, .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:focus, .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:active, .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading.active {
    box-shadow: 0 -4px 0 0 
    #00A2FF inset !important;
}
.rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover {
    background-color: 
    #F2F2F2 !important;
}
.rbx-tab:hover .rbx-tab-heading:hover, .rbx-tab:hover .rbx-tab-heading:focus, .rbx-tab:hover .rbx-tab-heading:active, .rbx-tab.active .rbx-tab-heading:hover, .rbx-tab.active .rbx-tab-heading:focus, .rbx-tab.active .rbx-tab-heading:active {
    border: 0 none !important;
}
 
.text-name, .text-name:link, .text-name:hover, .text-name:visited, .text-name:active {
    color: 
    #00A2FF !important;
}
.text-label {
    color: 
    #B8B8B8 !important;
    font-weight: 400 !important;
}
 
.light-theme .icon-clanpoint, .light-theme .icon-default-branded, .light-theme .icon-favorite, .light-theme .icon-follow-game, .light-theme .icon-follow-game-gray, .light-theme .icon-leaderboard, .light-theme .icon-playerpoint, .light-theme .icon-robux, .light-theme .icon-robux-28x28, .light-theme .icon-robux-burst-banner, .light-theme .icon-robux-gold, .light-theme .icon-robux-gray, .light-theme .icon-robux-white {
	background-image: url(https://static.rbxcdn.com/images/Shared/branded_04182018.svg)
}
 
.light-theme .icon-allgears, .light-theme .icon-Building, .light-theme .icon-catalog, .light-theme .icon-copylocked, .light-theme .icon-default-games, .light-theme .icon-dislike, .light-theme .icon-experimental-black, .light-theme .icon-experimental-gray1, .light-theme .icon-experimental-gray2, .light-theme .icon-experimental-white, .light-theme .icon-Explosive, .light-theme .icon-games, .light-theme .icon-inventory, .light-theme .icon-like, .light-theme .icon-Melee, .light-theme .icon-Musical, .light-theme .icon-Navigation, .light-theme .icon-nocopylocked, .light-theme .icon-nogear, .light-theme .icon-partialgears, .light-theme .icon-playaudio, .light-theme .icon-playing-counts-gray, .light-theme .icon-playing-counts-gray-white-70, .light-theme .icon-PowerUp, .light-theme .icon-privateserver, .light-theme .icon-publicserver, .light-theme .icon-Ranged, .light-theme .icon-share-game-to-chat, .light-theme .icon-Social, .light-theme .icon-Transport, .light-theme .icon-votes-gray, .light-theme .icon-votes-gray-white-70 {
	background-image: url(https://static.rbxcdn.com/images/Shared/games_08302018.svg);
}
 
.voting-panel .users-vote .upvote span {
    color: 
    #02b757 !important; 
}
 
.voting-panel .users-vote .vote-details .vote-numbers .count-left {
    float: left;
    color: 
    #02b757 !important;
}
 
.voting-panel .users-vote .vote-details .vote-numbers .count-right {
    float: right;
    text-align: right;
    color: 
    #E2231A !important;
}
 
.voting-panel .users-vote .vote-details .vote-container .vote-percentage {
    background-color: 
    #02b757 !important;
}
 
.voting-panel .users-vote .vote-details .vote-container .vote-background.has-votes {
    background-color: 
    #E27676 !important;
}
.light-theme .section-content.remove-panel {
 
    background-color: 
 
    #fff;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px !important;
 
}
 
.spinner {
    background-image: url("https://static.rbxcdn.com/images/shared/loading.gif") !important;
}
 
.dark-theme .icon-default-common, .dark-theme .icon-play-game, .dark-theme .icon-play-with-circle, .icon-default-common, .icon-play-game, .icon-play-with-circle, .light-theme .icon-default-common, .light-theme .icon-play-game, .light-theme .icon-play-with-circle {
	background-image: unset !important;
}
 
.icon-play-game:before {
	content: "Play";
	line-height: 163%;
}
 
.light-theme .section-content-off {
    background-color: 
#b8b8b8;
color:
    #757575;
    padding: 15px;
    text-align: center;
}
 
.light-theme .btn-secondary-md {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: 
#00a2ff;
border: 1px solid
#00a2ff;
color:
    #fff;
    cursor: pointer;
    display: inline-block;
    font-weight: 500;
    height: auto;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    padding: 9px;
    font-size: 16px;
    line-height: 100%;
    border-radius: 3px;
}
 
.light-theme .stack .stack-list .stack-row {
    background-color: 
    #fff;
}
 
.light-theme .btn-common-play-game-lg, .light-theme a.btn-common-play-game-lg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: 
#02b757;
border: 1px solid
#02b757;
color:
    #fff;
    cursor: pointer;
    display: inline-block;
    font-weight: 500;
    height: auto;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    padding: 12px;
    font-size: 20px;
    line-height: 100%;
    border-radius: 5px;
}
 
.light-theme .input-group .input-field {
	background-color: rgb(255, 255, 255);
}
 
.light-theme .btn-growth-md {
 
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: #02b757;
    border: 1px solid 
 
    #02b757;
        border-top-color: rgb(2, 183, 87);
        border-right-color: rgb(2, 183, 87);
        border-bottom-color: rgb(2, 183, 87);
        border-left-color: rgb(2, 183, 87);
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-weight: 500;
    height: auto;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    padding: 9px;
    font-size: 16px;
    line-height: 100%;
    border-radius: 3px;
 
}
 
.item-card-price {
	height: 28px;
}
 
.item-card-price h4 {
	font-size: 16px;
}
 
.light-theme .games-list-container {
	background-color: transparent !important;
}
 
.home-header-content a:before {
	content: "Hello, ";
}
.home-header-content a:after {
	content: "!";
}
 
.light-theme .container-footer {
	background-color: transparent;
}
 
.text-link, .text-link:active, .text-link:hover, .text-link:link, .text-link:visited, .vlist .list-item .list-body .list-content a, .vlist .list-item .list-body .list-content a:active, .vlist .list-item .list-body .list-content a:hover, .vlist .list-item .list-body .list-content a:link, .vlist .list-item .list-body .list-content a:visited {
    color: 
    #00a2ff !important;
}
 
.friend-list .friend .friend-link, .people-list .friend .friend-link {
	    color: #191919 !important;
}
 
a[href="https://www.roblox.com/upgrades/robux?ctx=nav"]{
	text-transform: uppercase;
}
 
.places-list {
	margin-bottom: 24px;
}
 
.sponsored-game .game-card-native-ad .native-ad-label {
	color: #fff !important;
}
 
.light-theme .game-card-native-ad {
    background-color: #b8b8b8 !important;
}
 
.games-page-left {
	margin-right: 345px !important;
	padding: 0 12px !important;
}
 
.btn-economy-robux-white-lg.disabled:hover span[class^="icon-"], .btn-economy-robux-white-lg.disabled span[class^="icon-"], .btn-economy-robux-white-lg[disabled]:hover span[class^="icon-"], .btn-economy-robux-white-lg[disabled] span[class^="icon-"], .btn-economy-robux-white-lg span[class^="icon-"], a.btn-economy-robux-white-lg.disabled:hover span[class^="icon-"], a.btn-economy-robux-white-lg.disabled span[class^="icon-"], a.btn-economy-robux-white-lg[disabled]:hover span[class^="icon-"], a.btn-economy-robux-white-lg[disabled] span[class^="icon-"], a.btn-economy-robux-white-lg span[class^="icon-"] {
	background-position: 0 -250px;
}
 
.light-theme .btn-secondary-md:link {
	color: #fff;
}
 
.light-theme .btn-secondary-md:focus, .light-theme .btn-secondary-md:hover {
    background-color: #32b5ff;
    border-color: #32b5ff;
    color: #fff;
    cursor: pointer;
}
 
.light-theme .pager .first .pager-btn, .light-theme .pager .first a, .light-theme .pager .last .pager-btn, .light-theme .pager .last a, .light-theme .pager .pager-next .pager-btn, .light-theme .pager .pager-next a, .light-theme .pager .pager-prev .pager-btn, .light-theme .pager .pager-prev a {
margin-left: 0;
background-color: #fff;
border: 1px solid
#b8b8b8;
border-radius: 3px;
display: inline-block;
border-radius: 0px;;
}
 
.light-theme .btn-control-md.disabled, .light-theme .btn-control-md.disabled.active, .light-theme .btn-control-md.disabled:active, .light-theme .btn-control-md.disabled:focus, .light-theme .btn-control-md.disabled:hover, .light-theme .btn-control-md[disabled], .light-theme .btn-control-md[disabled].active, .light-theme .btn-control-md[disabled]:active, .light-theme .btn-control-md[disabled]:focus, .light-theme .btn-control-md[disabled]:hover {
opacity: .5;
background-color: #fff;
border-color: #b8b8b8;
color: #b8b8b8;
cursor: not-allowed;
pointer-events: none;
}
 
.light-theme .menu-vertical .menu-option.active {
    color: 
#606162;
background-color:
transparent;
box-shadow: inset 4px 0 0 0
    #00A2FF;
}
 
.robux-upsell .unsubscribed .icon-robux-white {
		background-position: 0 -196px !important;
}
 
.robux-downsell .icon-robux-gray {
	background-position: 0 -167px;
}
 
.icon-default-economy-small, .icon-robux-16x16, .icon-robux-gold-16x16, .icon-robux-gray-16x16, .icon-robux-white-16x16 {
 
}
 
.light-theme .age-bracket-label {
	display: none;
}
 
.light-theme .navbar-icon-item .navbar-stream {
	display: none;
}
 
.icon-tix-28x28, .rbx-header .icon-nav-notification-stream {
	background-image: url(http://web.archive.org/web/20150901091744im_/http://www.roblox.com/images/NextStyleGuide/navigation.svg) !important;
  background-repeat: no-repeat;
  background-size: auto auto;
  width: 28px;
  height: 28px;
	background-position: 0 -56px;
  display: inline-block;
}
 
.icon-tix-28x28:hover, .rbx-header .icon-nav-notification-stream:hover {
	background-position: -28px -56px;
}
 
.notification-stream-icon:after {
	content: "";
}
 
.rbx-header .rbx-navbar-icon-group .navbar-stream {
	width: unset !important;
}
 
    `
 
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
  
  	var elem = "<span class='rbx-text-navbar-right text-header' id='nav-robux-amount0'>156K+</span>";
  	
 
  	var inserted_tix = false;
  	var patched_develop = false;
  	new MutationObserver(function(mutations) {
      
      if(!inserted_tix){
        var ico = document.getElementById("nav-ns-icon");
        if(ico){
          var nav = ico.parentNode.parentNode;
          var par = nav.parentNode;
          par.insertBefore(nav, par.children[1]);
 
          var span = document.createElement("span");
          span.class = "rbx-text-navbar-right text-header";
          span.innerHTML = "24";
 
          ico.appendChild(span);
          inserted_tix = true;
        }
      }
      
      if(!patched_develop){
        Array.from(document.getElementsByClassName("font-header-2 nav-menu-title text-header")).forEach(function(v){
          if(v.innerHTML.includes("Create")){
             v.innerHTML = "Develop";
             patched_develop = true;
           }
        });
      }
    }).observe(document, {childList: true, subtree: true});
function start() {
document.getElementById("nav-robux-amount").innerText = "10M+";
// Change 10M+ to whatever you want for that much fake robux. (You can do words too)
}
window.onload = start;
})();