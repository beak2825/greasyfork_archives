// ==UserScript==
// @name         roblox classic light theme
// @namespace    wtf2
// @version      10
// @description  fixes the theme
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/390442/roblox%20classic%20light%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390442/roblox%20classic%20light%20theme.meta.js
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
        background-image: url(http://web.archive.org/web/20190614211456im_/https://images.rbxcdn.com/1359485336f67d6e7be76b5e8ff4b72c-roblox_logo_11212016.svg);
      }

      .light-theme .icon-default-logo-r, .light-theme .icon-logo-r {
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHBhdGggZD0iTTguMyAzLjdMMy42IDIxLjhsMTguMSA0LjYgNC42LTE4LjEtMTgtNC42em04IDEzLjZsLTMuNS0uOS45LTMuNSAzLjUuOS0uOSAzLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+);
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
        background-image: url(http://web.archive.org/web/20190614211456im_/https://images.rbxcdn.com/153fd3209692232cd8087cad74a669b0-games.svg);
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
    `

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

})();