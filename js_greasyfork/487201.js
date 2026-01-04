// ==UserScript==
// @name Roblox in Early 2016
// @namespace userstyles.world/user/theoldrobloxuserstylefixer
// @version 20220525.17.32
// @description i cannot update this style without making a new CSS style. i will make a pastebin or a greasyfork to help me update fast.
// @author theoldrobloxuserstylefixer
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/487201/Roblox%20in%20Early%202016.user.js
// @updateURL https://update.greasyfork.org/scripts/487201/Roblox%20in%20Early%202016.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "roblox.com" || location.hostname.endsWith(".roblox.com"))) {
  css += `
  /*main code*/
  /*tha headers*/
  .light-theme .rbx-header {
      background-color: #0074bd;
      border-bottom: 1px solid #0074bd;
  /*need to find a way to modify this to be exact to the old one*/
  }


  .light-theme .notification-stream-header {
      background-color: #0074bd;
      border-bottom: 1px solid #0074bd;
      color: white;
  }
  .btr-light-theme .btr-settings-header {
      background-color: #0074bd;
      color: #ffffff;
  }


  .light-theme .icon-default-navigation,
  .light-theme .icon-nav-blog,
  .light-theme .icon-nav-charactercustomizer,
  .light-theme .icon-nav-friends,
  .light-theme .icon-nav-group,
  .light-theme .icon-nav-home,
  .light-theme .icon-nav-inventory,
  .light-theme .icon-nav-menu,
  .light-theme .icon-nav-message,
  .light-theme .icon-nav-my-feed,
  .light-theme .icon-nav-notification-stream,
  .light-theme .icon-nav-profile,
  .light-theme .icon-nav-robux,
  .light-theme .icon-nav-search,
  .light-theme .icon-nav-search-white,
  .light-theme .icon-nav-settings,
  .light-theme .icon-nav-shop,
  .light-theme .icon-nav-trade {
      background-image: url(https://images.rbxcdn.com/f4000b6d03a0df7153556d2514045629-navigation_10022018.svg);
  }

  .light-theme .notification-red {
      background-color: #e2231a;
  }



  .light-theme .notification-blue {
      background-color: #00a2ff;
  }

  .light-theme .rbx-header .rbx-navbar li .nav-menu-title:focus,
  .light-theme .rbx-header .rbx-navbar li .nav-menu-title:hover {
      background-color: rgba(25, 25, 25, 0.1);
      border-radius: 5px;
  }

  .dark-theme .rbx-header .rbx-navbar li .nav-menu-title:focus,
  .dark-theme .rbx-header .rbx-navbar li .nav-menu-title:hover {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 5px;
  }

  .light-theme .rbx-header .rbx-navbar li:hover,
  .dark-theme .rbx-header .rbx-navbar li:hover {
      border: none;
  }

  .light-theme .rbx-header .text-header,
  .light-theme .rbx-header .text-header:active,
  .light-theme .rbx-header .text-header:focus,
  .light-theme .rbx-header .text-header:hover,
  .light-theme .rbx-header .text-header:link,
  .light-theme .rbx-header .text-header:visited {
      color: #fff;
  }


  .user-info-container .user-icon-container,
  .user-info-container .user-name-container > a::before {
      content: 'Hello, ';
  }

  .user-info-container .user-icon-container,
  .user-info-container .user-name-container > a::after {
      content: '!'
  }


  .light-theme .input-group .input-field::placeholder {
      color: #b8b8b8b8;
      opacity: 1
  }

  .light-theme #nav-message:hover,
  .light-theme #nav-friends:hover,
  .light-theme #nav-trade:hover,
  .light-theme #nav-group:hover,
  .light-theme #nav-forum:hover,
  .light-theme #nav-blog:hover,
  .light-theme #nav-shop:hover,
  .light-theme #nav-giftcards:hover {
      color: #00a2ff;
  }

  .light-theme .light-theme #nav-home:hover,
  .light-theme #nav-inventory:hover {
      color: #02b757;
  }

  .light-theme #nav-profile:hover,
  .light-theme #nav-character:hover {
      color: #F68802;
  }

  .light-theme #nav-shop:hover > div > span {
      background-position: -28px -420px
  }



  .icon-nav-premium-btr {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTE0IDE0VjJIMnYxNGEyIDIgMCAwIDEtMi0yVjJhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMS0yIDJIOHYtMnptLTItOHY2SDh2LTJoMlY2SDZ2MTBINFY0aDh6IiBmaWxsPSIjMzkzYjNkIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);
      background-repeat: no-repeat;
      background-size: 22px;
      background-position: center;
      width: 28px;
      height: 28px;
      display: inline-block;
  }



  .light-theme .menu-vertical .menu-option .menu-secondary-container {
      color: #00a2ff;
      background-color: transparent;
      box-shadow: inset 4px 0 0 0 #00a2ff;
  }


  .rbx-tab.active .rbx-tab-heading,
  .rbx-tab.active .rbx-tab-heading:active,
  .rbx-tab.active .rbx-tab-heading:focus,
  .rbx-tab.active .rbx-tab-heading:hover,
  .rbx-tab:hover .rbx-tab-heading,
  .rbx-tab:hover .rbx-tab-heading:active,
  .rbx-tab:hover .rbx-tab-heading:focus,
  .rbx-tab:hover .rbx-tab-heading:hover {
      color: #00a2ff;
      background-color: transparent;
      box-shadow: inset 4px 0 0 0 #00a2ff;
  }

  .light-theme .rbx-tabs-vertical .rbx-tab.active .rbx-tab-heading {
      color: #393b3d;
      background-color: transparent;
      box-shadow: inset 4px 0 0 0 #00a2ff;
  }

  .rbx-tabs-vertical .rbx-tab.active .rbx-tab-heading {
      color: #191919;
      box-shadow: inset 4px 0 0 0 #00a2ff;
  }


  .light-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
      color: #393b3d;
      background-color: transparent;
      box-shadow: inset 0 -4px 0 0 #00a2ff;
  }

  .light-theme .menu-vertical .menu-option.active,
  .light-theme .menu-vertical .menu-option:hover {
      box-shadow: inset 4px 0 0 0 #00a2ff;
  }

  ul.nav:nth-child(2) > li:nth-child(1) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(1) > a:nth-child(1)::before {
      content: "Games";
      font-size: 16px;
  }

  ul.nav:nth-child(2) > li:nth-child(2) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(2) > a:nth-child(1)::before {
      content: "Catalog";
      font-size: 16px;
  }
  ul.nav:nth-child(2) > li:nth-child(3) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(3) > a:nth-child(1)::before {
      content: "Develop";
      font-size: 16px;
  }
  ul.nav:nth-child(2) > li:nth-child(4) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(4) > a:nth-child(1)::before {
      content: "ROBUX";
      font-size: 16px;
  }
  ul.nav:nth-child(2) > li:nth-child(1) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(1) > a:nth-child(1)::before {
      content: "Games";
      font-size: 16px;
  }

  ul.nav:nth-child(2) > li:nth-child(2) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(2) > a:nth-child(1)::before {
      content: "Catalog";
      font-size: 16px;
  }
  ul.nav:nth-child(2) > li:nth-child(3) > a:nth-child(1) {
      font-size: 0 !important;
  }
  ul.nav:nth-child(2) > li:nth-child(3) > a:nth-child(1)::before {
      content: "Develop";
      font-size: 16px;
  }
  ul.nav:nth-child(2) > li:nth-child(4) > a:nth-child(1) {
      font-size: 0 !important;
  }

  .light-theme .icon-default-economy-28x28,
  .light-theme .icon-robux-28x28,
  .light-theme .icon-robux-gold-28x28,
  .light-theme .icon-robux-white {
      background-image: url(https://svgur.com/i/GuZ.svg);
      background-size: 56px;
  }

  #nav-robux-icon .icon-robux-28x28 {
      background-position: 0 -28px;
      background-image: url(https://raw.githubusercontent.com/anthony1x6000/ROBLOX2016stylus/80a1e55d792875c92f6a4c5e7b4ef949fa17c157/images/robux/icons.svg);
  }

  .light-theme .icon-default-economy-28x28,
  .light-theme .icon-robux-28x28,
  .light-theme .icon-robux-gold-28x28,
  .light-theme .icon-robux-white:hover {
      background-size: 56px;
  }


  .light-theme .icon-default-logo-r,
  .light-theme .icon-logo-r,
  .light-theme .icon-logo-r-95 {
      background-image: url(https://raw.githubusercontent.com/anthony1x6000/ROBLOX2016stylus/e7e1749ce9770fc92c27226b20627243cd8291ad/images/logo_R2016.svg);
  }

  .dark-theme .icon-default-logo-r,
  .dark-theme .icon-logo-r,
  .dark-theme .icon-logo-r-95,
  .icon-default-logo-r,
  .icon-logo-r,
  .icon-logo-r-95 {
      background-image: url(https://raw.githubusercontent.com/anthony1x6000/ROBLOX2016stylus/e7e1749ce9770fc92c27226b20627243cd8291ad/images/logo_R2016.svg) !important;
  }

  .light-theme .icon-default-logo,
  .light-theme .icon-logo {
      background-image: url(https://raw.githubusercontent.com/anthony1x6000/ROBLOX2016stylus/15ff06a608df59433976333e28ef66ff6f114bf3/images/roblox_logo2016.svg) !important;
      background-size: 118px 30px;
  }

  .icon-logo {
      background-position: 50%;
      background-size: 110px;
  }

  #header .btr-nav-notif {
      background-color: #fff!important;
      color: #191919 !important;
      border: 2px solid #0074bd !important;
  }
  .btr-item-card-more {
      border-radius: 3px !important;
      background-color: #fff !important;
      max-width: 124px;
      position: absolute;
      left: 0px !important;
      bottom: -37px;
  }
  #nav-money:hover {
      color: #00a2ff
  }
  .light-theme .icon-nav-message-btr,
  .light-theme .icon-nav-friend-btr {
      filter: brightness(1)
  }


  .light-theme .chat-container .chat-main .chat-header,
  .light-theme .dialogs .dialog-container .dialog-header,
  .light-theme .chat-windows-header,
  .light-theme .chat-main .chat-header {
      background-color: #00a2ff;
      color: #fff;
  }

  .light-theme .dialogs .dialog-container .dialog-message-container .dialog-message {
      background-color: #00a2ff;
      color: #fff;
      border-color: #00a2ff;
  }

  .light-theme .dialogs .dialog-container .dialog-message-container .dialog-message span {
      color: #fff;
  }

  .light-theme .dialogs .dialog-container .dialog-message-container .link-card-container.dialog-triangle::after,
  .light-theme .dialogs .dialog-container .dialog-message-container .link-card-container.dialog-triangle::before,
  .light-theme .dialogs .dialog-container .dialog-message-container.message-cluster-master .dialog-triangle.message-is-sending::after,
  .light-theme .dialogs .dialog-container .dialog-message-container.message-cluster-master .dialog-triangle.message-is-sending::before,
  .light-theme .dialogs .dialog-container .dialog-message-container.message-cluster-master .dialog-triangle::after,
  .light-theme .dialogs .dialog-container .dialog-message-container.message-cluster-master .dialog-triangle::before {
      border-color: transparent transparent transparent #00a2ff;
  }

  .light-theme .dialogs .dialog-container .dialog-message-container.message-inbound .dialog-message {
      background-color: #fff;
      border-color: #e3e3e3;
  }

  .light-theme .dialogs .dialog-container .dialog-message-container.message-inbound .dialog-message span {
      color: #393b3d;
  }


  /*game cards are finished now!!!*/
  .light-theme .game-card-container .game-card-thumb-container {
      background-color: rgba(0, 0, 0, .1);
      border-bottom-left-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
      border-top-left-radius: 3px !important;
      border-top-right-radius: 3px !important;
  }
  div.game-card-info,
  span.playing-counts-label:before {
      content: title;
  }
  div.game-card-info,
  span.playing-counts-label:after {
      content: " Playing";
  }

  .game-cards .game-card {
      float: none;
      width: 161px;
      height: 223px;
      padding: 0 11px 0 0;
      display: inline-block;
      margin-bottom: 12px;
      vertical-align: top;
      white-space: normal;
  }


  .light-theme .game-card-container .game-card-thumb-container {
      border-top-right-radius: 3px;
      border-top-left-radius: 3px;
      position: relative;
      height: 150px;
      width: 150px;
      display: inline-block;
  }


  .light-theme .game-card-info .info-label.icon-votes-gray {
      background-image: url(https://web.archive.org/web/20150915203731im_/http:/www.roblox.com/images/Icons/thumbs.svg);
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: auto auto;
  }

  .light-theme .game-card-info .info-label.icon-playing-counts-gray {
      display: none;
  }






  .game-card-container thumbnail-2d,
  .game-card-thumb-container {
      border-top-right-radius: 3px;
      border-top-left-radius: 3px;
      position: relative;
      height: 150px;
      width: 150px;
      display: inline-block;
  }



  .light-theme .game-card-container {
      background-color: #fff;
      box-shadow: 0 1px 4px 0 rgb(25 25 25 / 30%);
      transition: box-shadow 200ms ease;
      border-radius: 3px;
  }

  /* yes*/
  .light-theme .alert-info {
      background-color: #f68806;
      color: #fff;
  }

  .gotham-font.light-theme .refresh-link-icon {
      background-position: 1000px;
  }

  /* code to hide the ugly arrow key*/
  .dark-theme .gotham-font .see-all-link-icon:after,
  .gotham-font.dark-theme .see-all-link-icon:after,
  .gotham-font.light-theme .see-all-link-icon:after,
  .icon-push-right-sm,
  .light-theme .gotham-font .see-all-link-icon:after {
      visibility: hidden;
  }


  /*placeholder*/
  .light-theme .rbx-left-col {
      box-shadow: 0 0 8px 0 rgb(0 0 0 / 10%);
      background-color: #ffffff;
  }


  .light-theme .section-content.remove-panel {
      background-color: white;
  }

  .light-theme .section-content {
      background-color: #fff;
      box-shadow: 0 1px 4px 0 rgb(25 25 25 / 30%);
      padding: 15px;
      position: relative;
  }

  .chat-main-empty .chat-disconnect .logo-tagline-chat {
      right: 0;
      right: calc(50% - 61px);
      width: 122px;
      height: 34px;
      background-size: auto 32px;
      position: absolute;
      bottom: 12px;
  }


  body,
  html {
      background-color: #F2F2F2;
      color: #191919;
      font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
      font-weight: 300;
      font-size: 16px;
      width: 100%;
      min-width: 320px;
      margin-bottom: 210px;
  }

  .light-theme .spinner {
      background-image: url(http://web.archive.org/web/20160526052452im_/http://images.rbxcdn.com/4bed93c91f909002b1f17f05c0ce13d1.gif);
      background-position: 50%;
      background-repeat: no-repeat;
      background-color: transparent;
      margin: 6px auto;
      display: inline-block;
      width: 100%;
  }
  .light-theme .icon-chat-add-friends, .light-theme .icon-chat-arrow-right, .light-theme .icon-chat-back, .light-theme .icon-chat-close-black, .light-theme .icon-chat-close-white, .light-theme .icon-chat-error, .light-theme .icon-chat-friends, .light-theme .icon-chat-group-create, .light-theme .icon-chat-group-label, .light-theme .icon-chat-group-name, .light-theme .icon-chat-info-black, .light-theme .icon-chat-info-white, .light-theme .icon-chat-more-dialogs, .light-theme .icon-chat-more-options, .light-theme .icon-chat-notification, .light-theme .icon-chat-notification-mute, .light-theme .icon-chat-party-label-black, .light-theme .icon-chat-party-label-white, .light-theme .icon-chat-pin, .light-theme .icon-chat-pinned, .light-theme .icon-chat-place-favorite, .light-theme .icon-chat-place-my, .light-theme .icon-chat-place-popular, .light-theme .icon-chat-place-recent, .light-theme .icon-chat-place-recommended, .light-theme .icon-chat-place-vip, .light-theme .icon-chat-play-together, .light-theme .icon-chat-resend, .light-theme .icon-chat-search, .light-theme .icon-chat-search-cancel, .light-theme .icon-chat-search-white, .light-theme .icon-chat-selected, .light-theme .icon-chat-set-place, .light-theme .icon-chat-unpin, .light-theme .icon-default-chat {
      background-image: url(https://images.rbxcdn.com/f4d8925211682759829e2662560c7639-chat_02142018.svg);
  }


  /*navbar*/
  .light-theme .rbx-header .navbar-search .new-input-field {
      border: 1px solid #b8b8b8;
      color: #191919;
      border-radius: 3px;
  }
     .rbx-header .navbar-search .input-addon-btn .icon-common-search-sm, .rbx-header .navbar-search .input-field .icon-common-search-sm {
     background-image: url(https://web.archive.org/web/20160229151706im_/http://static.rbxcdn.com/images/NextStyleGuide/navigation_02012016.svg);
      background-repeat: no-repeat;
      background-size: auto auto;
      width: 28px;
      height: 28px;
      display: inline-block;
         background-position: 0 -112px;
  }

  .light-theme .rbx-header .navbar-search .new-dropdown-menu {
      box-shadow: 0 -5px 20px rgb(25 25 25 / 15%);
      margin: 0;
      padding: 0;
      min-width: 105px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
  }


  `;
}
if (location.href.startsWith("https://www.roblox.com/users") || location.href.startsWith("https://web.roblox.com/users")) {
  css += `
  /*profile*/

  .col-sm-6.slide-item-container-left {
      background-color: #0074bd !important;
  }

  .profile-container .asset-item img {
      width: 140px;
      height: 140px;
      border: 1px solid #B8B8B8;
      border-radius: 3px;
      background-color: #fff !important;
  }

  .light-theme .profile-avatar-right .profile-avatar-mask {
      background-color: #3b7599 !important;
      color: #393b3d;
  }
  `;
}
if ((location.hostname === "roblox.com" || location.hostname.endsWith(".roblox.com"))) {
  css += `
  /* font changes*/
  /* ~/CSS/Fonts/SourceSansPro-Google.css */
  @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 300;
      src: local('Source Sans Pro Light'), local('SourceSansPro-Light'), url(https://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGMVNtom4QlEDNJaqqqzqdSs.woff) format('woff');
  }

  @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlNHq-FFgoDNV3GTKpHwuvtI.woff) format('woff');
  }
  .gotham-font,
  .gotham-font .h1,
  .gotham-font .h2,
  .gotham-font .h3,
  .gotham-font .h4,
  .gotham-font .h5,
  .gotham-font .h6,
  .gotham-font h1,
  .gotham-font h2,
  .gotham-font h3,
  .gotham-font h4,
  .gotham-font h5,
  .gotham-font h6,
  * {
      font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  }
  @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 600;
      src: local('Source Sans Pro Semibold'), local('SourceSansPro-Semibold'), url(https://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGCmgpmuQqK2I-L2S9cF65Ek.woff) format('woff');
  }


  .chat-windows-header .chat-header-title:after {
      content: " & Party";
  }



  .search-options .btn-text {
      background-color: transparent;
      text-align: unset;
      padding: 0;
      box-shadow: none;
      border-color: transparent;
      border-width: 0;
      font-size: 16px;
      font-family: source sans pro;
  }
  /* at some point learn how to rename text*/
  /*and that rename caused the robux to dissapear wow.*/
  .catalog-container .catalog-results .featured-items-heading:before {
      visibility: visible;
      position: absolute;
      content: " Featured Items on ROBLOX";
      font-weight: 400
  }
  .catalog-container .catalog-results .featured-items-heading {
      visibility: hidden;
      position: relative;
  }


  /*2016 font changes by the style guide, refence is in the section under*/
  /* kinda dissapointing to see*/
  .gotham-font .h1,
  .gotham-font h1 {
      font-size: 36px;
      font-weight: 400;
      color: #191919;
  }


  .gotham-font .h2,
  .gotham-font h2 {
      font-size: 30px;
      font-weight: 400;
      color: #191919;
  }


  .gotham-font h3,
  .gotham-font .h3 {
      font-weight: 300;
      font-size: 24px;
      color: #191919;
  }



  .gotham-font .h4,
  .gotham-font h4 {
      font-size: 21px;
      font-weight: 400;
      color: #191919;
  }


  .gotham-font .h5,
  .gotham-font h5 {

      font-size: 18px;
      font-weight: 400;
      color: #191919;
  }


  .gotham-font .text-name {
      color: #00A2FF;
  }



  .gotham-font .font-bold {
      color: #191919;
      font-weight: bold;
  }

  .gotham-font .text-secondary {
      font-size: 12px;
      font-weight: 400;
      color: #757575;
  }

  .gotham-font .text-pastname {
      font-size: 14px;
      font-weight: 400;
      color: #B8B8B8;
  }

  .gotham-font .text-pastname:hover {
      font-size: 14px;
      font-weight: 400;
      color: #B8B8B8;
  }

  .gotham-font .text-lead {
      font-size: 18px;
      font-weight: 400;
  }


  .gotham-font .text-lead:hover {
      font-size: 18px;
      font-weight: 400;
  }


  .gotham-font .text-label {
      color: #B8B8B8;
      font-weight: 400;
  }

  .gotham-font .text-label:hover {
      color: #B8B8B8;
      font-weight: 400;
  }


  .light-theme .text-report-ads,
  gotham-font .text-report-ads {
      font-size: 12px;
      font-weight: 400;
      color: #B8B8B8;
  }

  .light-theme .text-report-ads:hover,
  gotham-font .text-report-ads:hover {
      font-size: 12px;
      font-weight: 400;
  }


  .gotham-font .text-report {
      font-size: 14px;
      font-weight: 400;
      color: #D86868;
  }



  .gotham-font .text-report:hover {
      font-size: 14px;
      font-weight: 400;
      color: #D86868;
  }
  .gotham-font .text-error {
      font-size: 12px;
      font-weight: 400;
      color: #D86868;
  }
  .gotham-font .text-error:hover {
      font-size: 12px;
      font-weight: 400;
      color: #D86868;
  }
  gotham-font .text-link,
  .light-theme .text-link {
      color: #00A2FF;
  }
  gotham-font .text-link: hover,
  .light-theme .text-link:hover {
      color: #191919;
  }
  .light-theme .text-link,
  .light-theme .text-link.small,
  .light-theme .text-link.small:active,
  .light-theme .text-link.small:link,
  .light-theme .text-link.small:visited,
  .light-theme .text-link.xsmall,
  .light-theme .text-link.xsmall:active,
  .light-theme .text-link.xsmall:link,
  .light-theme .text-link.xsmall:visited,
  .light-theme .text-link.xxsmall,
  .light-theme .text-link.xxsmall:active,
  .light-theme .text-link.xxsmall:link,
  .light-theme .text-link.xxsmall:visited,
  .light-theme .text-link:active,
  .light-theme .text-link:hover,
  .light-theme .text-link:link,
  .light-theme .text-link:visited,
  .light-theme .text-name,
  .light-theme .text-name.small,
  .light-theme .text-name.small:active,
  .light-theme .text-name.small:link,
  .light-theme .text-name.small:visited,
  .light-theme .text-name.xsmall,
  .light-theme .text-name.xsmall:active,
  .light-theme .text-name.xsmall:link,
  .light-theme .text-name.xsmall:visited,
  .light-theme .text-name.xxsmall,
  .light-theme .text-name.xxsmall:active,
  .light-theme .text-name.xxsmall:link,
  .light-theme .text-name.xxsmall:visited,
  .light-theme .text-name:active,
  .light-theme .text-name:hover,
  .light-theme .text-name:link,
  .light-theme .text-name:visited,
  .light-theme .vlist .list-item .list-body .list-content a,
  .light-theme .vlist .list-item .list-body .list-content a.small,
  .light-theme .vlist .list-item .list-body .list-content a.small:active,
  .light-theme .vlist .list-item .list-body .list-content a.small:link,
  .light-theme .vlist .list-item .list-body .list-content a.small:visited,
  .light-theme .vlist .list-item .list-body .list-content a.xsmall,
  .light-theme .vlist .list-item .list-body .list-content a.xsmall:active,
  .light-theme .vlist .list-item .list-body .list-content a.xsmall:link,
  .light-theme .vlist .list-item .list-body .list-content a.xsmall:visited,
  .light-theme .vlist .list-item .list-body .list-content a.xxsmall,
  .light-theme .vlist .list-item .list-body .list-content a.xxsmall:active,
  .light-theme .vlist .list-item .list-body .list-content a.xxsmall:link,
  .light-theme .vlist .list-item .list-body .list-content a.xxsmall:visited,
  .light-theme .vlist .list-item .list-body .list-content a:active,
  .light-theme .vlist .list-item .list-body .list-content a:hover,
  .light-theme .vlist .list-item .list-body .list-content a:link,
  .light-theme .vlist .list-item .list-body .list-content a:visited,
  .vlist .list-item .list-body .list-content .light-theme a,
  .vlist .list-item .list-body .list-content .light-theme a.small,
  .vlist .list-item .list-body .list-content .light-theme a.small:active,
  .vlist .list-item .list-body .list-content .light-theme a.small:link,
  .vlist .list-item .list-body .list-content .light-theme a.small:visited,
  .vlist .list-item .list-body .list-content .light-theme a.xsmall,
  .vlist .list-item .list-body .list-content .light-theme a.xsmall:active,
  .vlist .list-item .list-body .list-content .light-theme a.xsmall:link,
  .vlist .list-item .list-body .list-content .light-theme a.xsmall:visited,
  .vlist .list-item .list-body .list-content .light-theme a.xxsmall,
  .vlist .list-item .list-body .list-content .light-theme a.xxsmall:active,
  .vlist .list-item .list-body .list-content .light-theme a.xxsmall:link,
  .vlist .list-item .list-body .list-content .light-theme a.xxsmall:visited,
  .vlist .list-item .list-body .list-content .light-theme a:active,
  .vlist .list-item .list-body .list-content .light-theme a:hover,
  .vlist .list-item .list-body .list-content .light-theme a:link,
  .vlist .list-item .list-body .list-content .light-theme a:visited {
      color: #00a2ff;
  }

  .light-theme .text-date-hint {
      font-size: 12px;
      font-weight: 400;
      color: #B8B8B8;
  }


  .light-theme .text-date-hint:hover {
      font-size: 12px;
      font-weight: 400;
      color: #B8B8B8;
  }


  .light-theme .text-footer-nav {
      color: #B8B8B8;
      font-size: 21px;
      font-weight: 300;
  }
  .light-theme .text-footer-nav:hover {
      color: #00a2ff;
      font-size: 21px;
      font-weight: 300;
  }


  .gotham-font .text-footer {
      color: #B8B8B8;
      font-size: 21px;
      font-weight: 300;
  }





  .gotham-font .text-footer:hover {
      font-weight: 400;
      color: #B8B8B8;
  }


  .light-theme .text-robux,
  .light-theme .text-robux:hover {
      color: #02b757;
      font-weight: 400;
  }
  .gotham-font .text-favorite,
  .gotham-font .text-favorite:hover {
      color: #F6B702;
      font-size: 16px;
      font-weight: 400;
  }



  * {
      font-family: source sans pro;
  }

  `;
}
if (location.href.startsWith("https://web.roblox.com/my/avatar") || location.href.startsWith("https://roblox.com/my/avatar")) {
  css += `
  .light-theme .rbx-tabs-horizontal #horizontal-tabs .rbx-tab:not(.active) a:not(:hover),

  .light-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
      float: left;
      background-color: #D6D6D6;
      padding: 7px;
      border: 1px solid #9e9e9e;
      font-weight: bold;
      font-size: 15px;
      margin: 4px 2px 0 1px;
      border-bottom-width: 0;
      position: relative;
      top: -1px;
      box-shadow: none;
  }
  `;
}
if ((location.hostname === "roblox.com" || location.hostname.endsWith(".roblox.com"))) {
  css += `
  .light-theme .item-card-container .item-card-thumb-container {
      border: 0;
      background-color: rgb(0 0 0 / 0%);
      border-color: #fff;
      width: 122px;
      height: 122px;
  }
  .item-card-thumb-container .item-card-thumb {
      height: unset;
      border-radius: 0px !important;
  }

  .light-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
      color: #fff
  }
  html {
      background-color: #fff;
  }

  div#container-main {
      background: #fff !important;
  }
  .light-theme .content {
      background-color: #fff;
      color: #191919;
  }
  `;
}
css += `


/*remake*/

.items-list .item-card .item-card-thumb-container::before {
    display: inline-block !important;
    width: auto !important;
    content: "Wear";
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    border: 1px solid #0852b7;
    background-color: #0852b7 !important;
    background-image: url(http://static.rbxcdn.com/images/Buttons/StyleGuide/bg-btn-blue.png) !important;
    padding: 1px 7px 0px;
    border-radius: 0px;
    visibility: visible !important;
    background-position: left -96px !important;
    position: relative;
    left: 79px;
    transition: none;
    opacity: 1 !important;
    visibility: visible;
    position: absolute;
}
.items-list .item-card .item-card-equipped::before {
    display: inline-block !important;
    width: auto !important;
    content: "Remove";
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    height: 26.781px !important;
    color: #fff;
    border: 1px solid #0852b7;
    background-color: #0852b7;
    background-image: url(http://static.rbxcdn.com/images/Buttons/StyleGuide/bg-btn-blue.png);
    padding: 1px 7px 0px;
    vertical-align: middle;
    background-position: left -96px;
    position: relative;
    left: 62px;
    top: -1px;
    visibility: visible;
    position: absolute;
    height: 127px;
}
}

`;
if ((location.hostname === "roblox.com" || location.hostname.endsWith(".roblox.com"))) {
  css += `
  /*refence: http://web.archive.org/web/20160526060027/http://www.roblox.com:80/reference/styleguide
  /*finally finished most of the buttons for the style guide yaaay*/
  .light-theme .btn-control-lg {
      border: 1px solid transparent;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #757575;
      cursor: pointer;
      display: inline-block;
      font-weight: 600;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      border-radius: 5px;
      font-family: source sans pro;
  }


  .light-theme .btn-control-lg:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      font-weight: 600;
      font-family: source sans pro;
  }



  .light-theme .btn-control-md {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      border-radius: 3px;
      padding: 7px 16px;
      font-weight: 600;
      font-family: source sans pro;
  }




  .light-theme .btn-control-md:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      padding: 7px 16px;
      font-weight: 600;
      font-family: source sans pro;
  }
  .light-theme .ignore-friend.btn-secondary-md {
      background-color: #fff;
      border-color: #B8B8B8;
      color: #191919;
      cursor: pointer;
      display: inline-block;
      font-weight: 400;
      border-radius: 3px;
      font-family: source sans pro;
  }

  .light-theme .ignore-friend.btn-secondary-md:hover {
      background-color: #fff;
      border-color: #B8B8B8;
      color: #191919;
      box-shadow: 0 1px 3px rgba(149, 150, 150, .74);
      cursor: pointer;
      display: inline-block;
      font-weight: 400;
      border-radius: 3px;
      font-family: source sans pro;
  }



  .light-theme .btn-control-sm {
      border: 1px solid transparent;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #757575;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 600;
      font-family: source sans pro;
  }

  .light-theme .btn-control-sm:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      font-family: source sans pro;
  }




  .light-theme .btn-control-xs {
      border: 1px solid transparent;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #757575;
      cursor: pointer;
      display: inline-block;
      font-weight: 400;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }


  .light-theme .btn-control-xs:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      font-family: source sans pro;
  }


  .light-theme .btn-control-lg.disabled,
  .light-theme .btn-control-lg.disabled.active,
  .light-theme .btn-control-lg.disabled:active,
  .light-theme .btn-control-lg.disabled:focus,
  .light-theme .btn-control-lg.disabled:hover,
  .light-theme .btn-control-lg[disabled],
  .light-theme .btn-control-lg[disabled].active,
  .light-theme .btn-control-lg[disabled]:active,
  .light-theme .btn-control-lg[disabled]:focus,
  .light-theme .btn-control-lg[disabled]:hover {
      opacity: 1;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #B8B8B8;
  }


  .light-theme .btn-control-md.disabled,
  .light-theme .btn-control-md.disabled.active,
  .light-theme .btn-control-md.disabled:active,
  .light-theme .btn-control-md.disabled:focus,
  .light-theme .btn-control-md.disabled:hover,
  .light-theme .btn-control-md[disabled],
  .light-theme .btn-control-md[disabled].active,
  .light-theme .btn-control-md[disabled]:active,
  .light-theme .btn-control-md[disabled]:focus,
  .light-theme .btn-control-md[disabled]:hover {
      opacity: 1;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #B8B8B8;
  }



  .light-theme .btn-control-sm.disabled,
  .light-theme .btn-control-sm.disabled.active,
  .light-theme .btn-control-sm.disabled:active,
  .light-theme .btn-control-sm.disabled:focus,
  .light-theme .btn-control-sm.disabled:hover,
  .light-theme .btn-control-sm[disabled],
  .light-theme .btn-control-sm[disabled].active,
  .light-theme .btn-control-sm[disabled]:active,
  .light-theme .btn-control-sm[disabled]:focus,
  .light-theme .btn-control-sm[disabled]:hover {
      opacity: 1;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #B8B8B8;
  }



  .light-theme .btn-control-xs.disabled,
  .light-theme .btn-control-xs.disabled.active,
  .light-theme .btn-control-xs.disabled:active,
  .light-theme .btn-control-xs.disabled:focus,
  .light-theme .btn-control-xs.disabled:hover,
  .light-theme .btn-control-xs[disabled],
  .light-theme .btn-control-xs[disabled].active,
  .light-theme .btn-control-xs[disabled]:active,
  .light-theme .btn-control-xs[disabled]:focus,
  .light-theme .btn-control-xs[disabled]:hover {
      opacity: 1;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #B8B8B8;
  }







  .light-theme .btn-cta-lg {
      background-color: #02b757;
      border-color: #02b757;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-cta-lg:hover {
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      cursor: pointer;
      display: inline-block;

      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      border-radius: 5px;
      font-weight: 800;
      font-family: source sans pro;
  }



  .light-theme .btn-cta-md {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 9px 9px;
      font-size: 18px;
      line-height: 100%;
      font-weight: 800;
      font-family: source sans pro;
  }


  .light-theme .btn-cta-md:hover {
      border: 1px solid transparent;
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 9px 9px;
      font-size: 18px;
      line-height: 100%;
      font-weight: 800;
      font-family: source sans pro;
  }




  .light-theme .btn-cta-sm {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-cta-sm:hover {
      border: 1px solid transparent;
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-cta-xs {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-cta-xs:hover {
      border: 1px solid transparent;
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }

  /*lmao pain*/
  .light-theme .btn-cta-lg.disabled,
  .light-theme .btn-cta-lg.disabled.active,
  .light-theme .btn-cta-lg.disabled:active,
  .light-theme .btn-cta-lg.disabled:focus,
  .light-theme .btn-cta-lg.disabled:hover,
  .light-theme .btn-cta-lg[disabled],
  .light-theme .btn-cta-lg[disabled].active,
  .light-theme .btn-cta-lg[disabled]:active,
  .light-theme .btn-cta-lg[disabled]:focus,
  .light-theme .btn-cta-lg[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }



  .light-theme .btn-cta-md.disabled,
  .light-theme .btn-cta-md.disabled.active,
  .light-theme .btn-cta-md.disabled:active,
  .light-theme .btn-cta-md.disabled:focus,
  .light-theme .btn-cta-md.disabled:hover,
  .light-theme .btn-cta-md[disabled],
  .light-theme .btn-cta-md[disabled].active,
  .light-theme .btn-cta-md[disabled]:active,
  .light-theme .btn-cta-md[disabled]:focus,
  .light-theme .btn-cta-md[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }




  .light-theme .btn-cta-sm.disabled,
  .light-theme .btn-cta-sm.disabled.active,
  .light-theme .btn-cta-sm.disabled:active,
  .light-theme .btn-cta-sm.disabled:focus,
  .light-theme .btn-cta-sm.disabled:hover,
  .light-theme .btn-cta-sm[disabled],
  .light-theme .btn-cta-sm[disabled].active,
  .light-theme .btn-cta-sm[disabled]:active,
  .light-theme .btn-cta-sm[disabled]:focus,
  .light-theme .btn-cta-sm[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }



  .light-theme .btn-cta-xs.disabled,
  .light-theme .btn-cta-xs.disabled.active,
  .light-theme .btn-cta-xs.disabled:active,
  .light-theme .btn-cta-xs.disabled:focus,
  .light-theme .btn-cta-xs.disabled:hover,
  .light-theme .btn-cta-xs[disabled],
  .light-theme .btn-cta-xs[disabled].active,
  .light-theme .btn-cta-xs[disabled]:active,
  .light-theme .btn-cta-xs[disabled]:focus,
  .light-theme .btn-cta-xs[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }
  /*time to do it again but with primary*/
  .light-theme .btn-growth-lg {
      background-color: #02b757;
      border-color: #02b757;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      display: inline-block;

      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-growth-md {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 9px 9px;
      font-size: 18px;
      line-height: 100%;
      font-weight: 800;
      font-family: source sans pro;
  }

  /*cataLOG*/
  .catalog-container .catalog-results .buy-robux:hover {
      background-color: transparent;
      background-position: left -128px!important;
      border-color: #007001;
  }
  /*ok back to 2016 primary*/
  .light-theme .btn-growth-sm {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-growth-xs {
      border: 1px solid transparent;
      background-color: #02b757;
      border-color: #02b757;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-growth-lg:hover {
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      border-radius: 5px;
      font-weight: 800;
      font-family: source sans pro;
  }



  .light-theme .btn-growth-sm:hover {
      border: 1px solid transparent;
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-growth-xs:hover {
      border: 1px solid transparent;
      background-color: #3fc679;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-color: #3fc679;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-growth-lg.disabled,
  .light-theme .btn-growth-lg.disabled.active,
  .light-theme .btn-growth-lg.disabled:active,
  .light-theme .btn-growth-lg.disabled:focus,
  .light-theme .btn-growth-lg.disabled:hover,
  .light-theme .btn-growth-lg[disabled],
  .light-theme .btn-growth-lg[disabled].active,
  .light-theme .btn-growth-lg[disabled]:active,
  .light-theme .btn-growth-lg[disabled]:focus,
  .light-theme .btn-growth-lg[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }


  .light-theme .btn-growth-md.disabled,
  .light-theme .btn-growth-md.disabled.active,
  .light-theme .btn-growth-md.disabled:active,
  .light-theme .btn-growth-md.disabled:focus,
  .light-theme .btn-growth-md.disabled:hover,
  .light-theme .btn-growth-md[disabled],
  .light-theme .btn-growth-md[disabled].active,
  .light-theme .btn-growth-md[disabled]:active,
  .light-theme .btn-growth-md[disabled]:focus,
  .light-theme .btn-growth-md[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }
  .light-theme .btn-growth-sm.disabled,
  .light-theme .btn-growth-sm.disabled.active,
  .light-theme .btn-growth-sm.disabled:active,
  .light-theme .btn-growth-sm.disabled:focus,
  .light-theme .btn-growth-sm.disabled:hover,
  .light-theme .btn-growth-sm[disabled],
  .light-theme .btn-growth-sm[disabled].active,
  .light-theme .btn-growth-sm[disabled]:active,
  .light-theme .btn-growth-sm[disabled]:focus,
  .light-theme .btn-growth-sm[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }
  .light-theme .btn-growth-xs.disabled,
  .light-theme .btn-growth-xs.disabled.active,
  .light-theme .btn-growth-xs.disabled:active,
  .light-theme .btn-growth-xs.disabled:focus,
  .light-theme .btn-growth-xs.disabled:hover,
  .light-theme .btn-growth-xs[disabled],
  .light-theme .btn-growth-xs[disabled].active,
  .light-theme .btn-growth-xs[disabled]:active,
  .light-theme .btn-growth-xs[disabled]:focus,
  .light-theme .btn-growth-xs[disabled]:hover {
      opacity: 1;
      background-color: #A3E2BD;
      border-color: #A3E2BD;
      color: #fff;
  }



  .light-theme .btn-secondary-lg {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      border-radius: 5px;
      font-family: source sans pro;
  }

  .light-theme .btn-secondary-lg:focus,
  .light-theme .btn-secondary-lg:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .btn-secondary-md {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 9px 9px;
      font-size: 18px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }
  .light-theme .btn-secondary-md:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-secondary-sm {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }
  .light-theme .btn-secondary-sm:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }



  .gotham-font.light-theme .refresh-link,
  .gotham-font.light-theme .refresh-link-icon,
  .gotham-font.light-theme .refresh-link-icon:active,
  .gotham-font.light-theme .refresh-link-icon:hover,
  .gotham-font.light-theme .refresh-link-icon:link,
  .gotham-font.light-theme .refresh-link-icon:visited,
  .gotham-font.light-theme .refresh-link:active,
  .gotham-font.light-theme .refresh-link:hover,
  .gotham-font.light-theme .refresh-link:link,
  .gotham-font.light-theme .refresh-link:visited,
  .gotham-font.light-theme .see-all-link,
  .gotham-font.light-theme .see-all-link-icon,
  .gotham-font.light-theme .see-all-link-icon:active,
  .gotham-font.light-theme .see-all-link-icon:hover,
  .gotham-font.light-theme .see-all-link-icon:link,
  .gotham-font.light-theme .see-all-link-icon:visited,
  .gotham-font.light-theme .see-all-link:active,
  .gotham-font.light-theme .see-all-link:hover,
  .gotham-font.light-theme .see-all-link:link,
  .gotham-font.light-theme .see-all-link:visited,
  .gotham-font.light-theme .touch .refresh-link,
  .gotham-font.light-theme .touch .refresh-link-icon,
  .gotham-font.light-theme .touch .refresh-link-icon:active,
  .gotham-font.light-theme .touch .refresh-link-icon:hover,
  .gotham-font.light-theme .touch .refresh-link-icon:link,
  .gotham-font.light-theme .touch .refresh-link-icon:visited,
  .gotham-font.light-theme .touch .refresh-link:active,
  .gotham-font.light-theme .touch .refresh-link:hover,
  .gotham-font.light-theme .touch .refresh-link:link,
  .gotham-font.light-theme .touch .refresh-link:visited,
  .gotham-font.light-theme .touch .see-all-link,
  .gotham-font.light-theme .touch .see-all-link-icon,
  .gotham-font.light-theme .touch .see-all-link-icon:active,
  .gotham-font.light-theme .touch .see-all-link-icon:hover,
  .gotham-font.light-theme .touch .see-all-link-icon:link,
  .gotham-font.light-theme .touch .see-all-link-icon:visited,
  .gotham-font.light-theme .touch .see-all-link:active,
  .gotham-font.light-theme .touch .see-all-link:hover,
  .gotham-font.light-theme .touch .see-all-link:link,
  .gotham-font.light-theme .touch .see-all-link:visited {
      color: white;
      background-color: #00a2ff;
      border-color: #00a2ff;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      padding: 7px 16px;
      font-size: 1em;
      line-height: 100%;
      border-radius: 3px;
  }

  .light-theme .btn-secondary-xs {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }

  .light-theme .btn-secondary-xs:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }


  .light-theme .btn-secondary-xs:link {
      color: rgb(255 255 255);
  }


  button#group-join-button.btn-secondary-md.group-button.ng-binding.ng-scope {
      border-color: #0852b7;
      background-color: #0852b7;
      background-image: url(https://web.archive.org/web/20150905183525im_/https://www.roblox.com/images/Buttons/StyleGuide/bg-btn-blue.png);
      color: white;
      border-radius: 0px;
      padding: 1px 13px 0 13px;
      height: 50px;
      width: 134.08px;
      font-size: 23px;
      line-height: 27px;
      background-position: left 0px;
      font-family: source sans pro;
      margin-top: 10px;
      display: inline-block;
      font-weight: normal
  }
  button#group-join-button.btn-secondary-md.group-button.ng-binding.ng-scope:hover {
      background-color: transparent;
      background-position: left -128px!important;
  }

  .light-theme .rbx-upgrade-now .btn-secondary-md {
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;

      font-weight: 800;
      font-family: source sans pro;
  }

  .light-theme .rbx-upgrade-now .btn-secondary-md:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }
  .light-theme .btn-secondary-lg.disabled,
  .light-theme .btn-secondary-lg.disabled.active,
  .light-theme .btn-secondary-lg.disabled:active,
  .light-theme .btn-secondary-lg.disabled:focus,
  .light-theme .btn-secondary-lg.disabled:hover,
  .light-theme .btn-secondary-lg[disabled],
  .light-theme .btn-secondary-lg[disabled].active,
  .light-theme .btn-secondary-lg[disabled]:active,
  .light-theme .btn-secondary-lg[disabled]:focus,
  .light-theme .btn-secondary-lg[disabled]:hover {
      opacity: 1;
      background-color: #99DAFF;
      border-color: #99DAFF;
      color: #fff;
  }


  .light-theme .btn-secondary-md.disabled,
  .light-theme .btn-secondary-md.disabled.active,
  .light-theme .btn-secondary-md.disabled:active,
  .light-theme .btn-secondary-md.disabled:focus,
  .light-theme .btn-secondary-md.disabled:hover,
  .light-theme .btn-secondary-md[disabled],
  .light-theme .btn-secondary-md[disabled].active,
  .light-theme .btn-secondary-md[disabled]:active,
  .light-theme .btn-secondary-md[disabled]:focus,
  .light-theme .btn-secondary-md[disabled]:hover {
      opacity: 1;
      background-color: #99DAFF;
      border-color: #99DAFF;
      color: #fff;
  }

  .light-theme .btn-secondary-sm.disabled,
  .light-theme .btn-secondary-sm.disabled.active,
  .light-theme .btn-secondary-sm.disabled:active,
  .light-theme .btn-secondary-sm.disabled:focus,
  .light-theme .btn-secondary-sm.disabled:hover,
  .light-theme .btn-secondary-sm[disabled],
  .light-theme .btn-secondary-sm[disabled].active,
  .light-theme .btn-secondary-sm[disabled]:active,
  .light-theme .btn-secondary-sm[disabled]:focus,
  .light-theme .btn-secondary-sm[disabled]:hover {
      opacity: 1;
      background-color: #99DAFF;
      border-color: #99DAFF;
      color: #fff;
  }

  .light-theme .btn-secondary-xs.disabled,
  .light-theme .btn-secondary-xs.disabled.active,
  .light-theme .btn-secondary-xs.disabled:active,
  .light-theme .btn-secondary-xs.disabled:focus,
  .light-theme .btn-secondary-xs.disabled:hover,
  .light-theme .btn-secondary-xs[disabled],
  .light-theme .btn-secondary-xs[disabled].active,
  .light-theme .btn-secondary-xs[disabled]:active,
  .light-theme .btn-secondary-xs[disabled]:focus,
  .light-theme .btn-secondary-xs[disabled]:hover {
      opacity: 1;
      background-color: #99DAFF;
      border-color: #99DAFF;
      color: #fff;
  }
  .groups-list .create-group-button {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 9px 9px;
      font-size: 18px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }
  .groups-list .create-group-button:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }





  .light-theme .btn-primary-xs {
      border: 1px solid transparent;
      background-color: #00A2FF;
      border-color: #00A2FF;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-weight: 800;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 4px 4px;
      font-size: 14px;
      line-height: 100%;
      border-radius: 3px;
      font-family: source sans pro;
  }


  .light-theme .btn-primary-xs:hover {
      background-color: #32b5ff;
      border-color: #32b2ff;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      color: #fff;
      font-weight: 800;
      font-family: source sans pro;
  }
  /*wtf is this? ima convert it to control*/
  .light-theme .btn-alert-lg {
      border: 1px solid transparent;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #757575;
      cursor: pointer;
      display: inline-block;
      font-weight: 600;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 15px 15px;
      font-size: 21px;
      line-height: 100%;
      border-radius: 5px;
      font-family: source sans pro;
  }

  .light-theme .btn-alert-lg:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      font-weight: 600;
      font-family: source sans pro;
  }

  .light-theme .btn-alert-md {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      border-radius: 3px;
      padding: 7px 16px;
      font-weight: 600;
      font-family: source sans pro;
  }



  .light-theme .btn-alert-md:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      padding: 7px 16px;
      font-weight: 600;
      font-family: source sans pro;
  }

  .light-theme .btn-alert-sm {
      border: 1px solid transparent;
      background-color: #fff;
      border-color: #B8B8B8;
      color: #757575;
      cursor: pointer;
      display: inline-block;
      height: auto;
      transition: all, 0.2s, ease-in-out;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      padding: 7px 7px;
      font-size: 16px;
      line-height: 100%;
      border-radius: 3px;
      font-weight: 600;
      font-family: source sans pro;
  }

  .light-theme .btn-alert-sm:hover {
      background-color: white;
      border-color: #b8b8b8;
      color: #757575;
      box-shadow: 0 1px 3px rgba(150, 150, 150, 0.74);
      border-radius: 3px;
      font-family: source sans pro;
  }
  `;
}
if (location.href.startsWith("web.roblox.com/users") || location.href.startsWith("https://www.roblox.com/users")) {
  css += `
  .col-sm-6.slide-item-container-left {
      background-color: #0074bd !important;
  }




  .profile-container .asset-item img {
      width: 140px;
      height: 140px;
      border: 1px solid #B8B8B8;
      border-radius: 3px;
      background-color: #fff !important;
  }

  .light-theme .profile-avatar-right .profile-avatar-mask {
      background-color: #3b7599 !important;
      color: #393b3d;
  }

  `;
}
if (location.href.startsWith("https://www.roblox.com/games") || location.href.startsWith("web.roblox.com/games")) {
  css += `
  /*game page*/

  .icon-common-play:after {
      visibility: visible;
      position: relative;
      top: 0px !important;
      left: 0px !important;
      content: "Play";
      font-size: 21px !important;
      font-weight: 400 !important;
  }
  #game-details-play-button-container {
      display: flex;
      min-width: 265.875px !important;
      resize: both;
      padding: 36px 36px !important;
      margin-left: 0px;
      border-top: 1px solid #B8B8B8 !important;
      border-bottom: 1px solid #B8B8B8 !important;
      border-radius: 0px !important;
      margin-left: 7px !important;
  }

  .light-theme .voting-panel .users-vote .vote-details .vote-container .vote-percentage {
      background-color: #02b757 !important;
  }
  .light-theme .voting-panel .users-vote .vote-details .vote-container .vote-background, .light-theme .voting-panel .users-vote .vote-details .vote-container .vote-background.has-votes {
      background-color: #e27676 !important;
  }
  .light-theme .voting-panel .users-vote .vote-details .vote-numbers .count-left {
      color: #02b757 !important;
  }
  .light-theme .voting-panel .users-vote .vote-details .vote-numbers .count-right {
      color: #e2231a !important;
  }
  .btn-common-play-game-lg span[class^=icon-] {
  	visibility: hidden !important;
  }

  .voting-panel span {
      float: none;
      line-height: 20px;
      font-size: 16px !important;
  }
  .vote-background.has-votes {
      border-radius: 4px !important;
  }
    
  .game-main-content.follow-button-enabled .favorite-follow-vote-share {
      position: relative;
      width: 100%;
      padding-top: -0px;
      bottom: 2px !important;
      top: 6px !important;
      left: -9px !important;
  }
  .light-theme .voting-panel .users-vote .upvote span {
      margin-left: -3px !important;
    }

  .light-theme .voting-panel .users-vote .upvote span {
      background-image: url(https://web.archive.org/web/20160229161017im_/http://static.rbxcdn.com/images/NextStyleGuide/games.svg);
      background-repeat: no-repeat;
      background-size: auto auto;
      width: 28px;
      height: 28px;
      display: inline-block;
  }

  .light-theme .voting-panel .users-vote .downvote span {
      background-image: url(https://web.archive.org/web/20160229161017im_/http://static.rbxcdn.com/images/NextStyleGuide/games.svg);
      background-repeat: no-repeat;
      background-size: auto auto;
      width: 28px;
      height: 28px;
      display: inline-block;
  }


  .game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container .icon-follow-game, .game-main-content.follow-button-enabled .favorite-follow-vote-share .game-follow-button-container .icon-label {
  display: none
  }

  .light-theme .icon-clanpoint, .light-theme .icon-default-branded, .light-theme .icon-favorite, .light-theme .icon-follow-game, .light-theme .icon-follow-game-gray, .light-theme .icon-leaderboard, .light-theme .icon-playerpoint, .light-theme .icon-robux, .light-theme .icon-robux-28x28, .light-theme .icon-robux-burst-banner, .light-theme .icon-robux-gold, .light-theme .icon-robux-gray, .light-theme .icon-robux-white {
      background-image: url(https://images.rbxcdn.com/757f696cbfd2d8fcde61d219cead6a2c-branded_04182018.svg);
  }


  .voting-panel span {
      float: none;
      line-height: 20px;
      font-size: 16px !important;
  }


  .light-theme .voting-panel .users-vote .vote-details .vote-numbers .count-left {
      position: relative !important;
      left: 22px !important;
      bottom: 31px !important;
      font-size: 16px !important;
      line-height: 20px !important;
  }
  .light-theme .voting-panel .users-vote .vote-details .vote-numbers .count-right {
      font-size: 14px !important;
      position: relative !important;
      left: -12px !important;
      bottom: 31px !important;
  }
  button.btn-full-width.btn-common-play-game-lg.btn-primary-md.btn-min-width {
      box-shadow: none !important;
  }
  button.btn-full-width.btn-common-play-game-lg.btn-primary-md.btn-min-width:hover {
      box-shadow: 0 1px 3px #969696bd !important;
      background-color: #3FC679 !important;
      border-color: #3FC679 !important;
  }
    button.btn-full-width.btn-common-play-game-lg.btn-primary-md.btn-min-width:focus {
      box-shadow: 0 1px 3px #969696bd !important;
      background-color: #3FC679 !important;
      border-color: #3FC679 !important;
  }
  button.btn-full-width.btn-common-play-game-lg.btn-primary-md.btn-min-width:active {
      background-color: #3FC679  !important;
      border-color: #02b757  !important;
      box-shadow: none !important;
  }
  .game-main-content.follow-button-enabled .favorite-follow-vote-share .voting-panel .users-vote .downvote {
      right: 0;
      top: -32px;
      left: 100px !important;
    width: 23px !important
  }
  /*store next update*/

  `;
}
if (location.href.startsWith("https://www.roblox.com/catalog") || location.href.startsWith("https://web.roblox.com/catalog")) {
  css += `

  .catalog-container .search-bar-placement-right .heading {
      visibility: hidden;
      position: relative;
  }

  .catalog-container .search-bar-placement-right .heading:before {
      visibility: visible;
      position: absolute;
      content: "Catalog";
      font-size: 32px;
      font-weight: bold;
      color: #343434;
      letter-spacing: -1px;
  }
  .ng-scope.status-new {
      width: 50px !important;
      height: 53px !important;
      border-radius: 0 !important;
      color: #0000 !important;
      background-color: #0000 !important;
      background-image: url(https://images.rbxcdn.com/b84cdb8c0e7c6cbe58e91397f91b8be8.png);
      position: relative;
      left: -7px;
      top: 1px;
  }


  .light-theme .item-card-container .item-card-caption {
      padding: 0;
      position: relative;
      left: 10px;  
      top: -6px;
      height: 40px !important;
      width: 114px !important;
  }
  span.icon-robux-gray-16x16 {
      display: none !important;
  }
  .light-theme .thumbnail-2d-container {
      padding:5.5px !important;
      background-color: transparent;
      border-color: #fff0 !important;
      border-radius: 0px;
  }
  .light-theme .thumbnail-2d-container:hover {
      padding:5.5px !important;
      background-color: transparent;
      border-color: #fff0 !important;
  }
  img.ng-scope.ng-isolate-scope {
      margin: 0px !important;
      padding: 0px !important;
      border: 1px solid #eee;
      position: relative;
  	cursor: pointer;
  }

  .light-theme .item-card-container .item-card-name {
      color: #0055B3;
          text-decoration: none;
      font-weight: 400;
      transition: none;
  }


  .light-theme .text-robux-tile {
      background: url(https://web.archive.org/web/20160331224851im_/http://static.rbxcdn.com/images/Icons/img-robux.png) no-repeat 0 1px;
      color: #060;
      font-weight: bold;
      padding: 0 0 2px 20px;
      font-size: 12px;
  }



  .item-card-container .icon-robux-16x16 {
      visibility: hidden;
      position: relative;
  }
  .search-options .search-options-header {
      font-size: 0px;
      background: url(https://web.archive.org/web/20160401140241im_/http://static.rbxcdn.com/images/UI/catalog/browse-by-category-header.png);
      width: 136px;
      height: 34px;
      display: block;
  }
  .light-theme .catalog-content .search-options .category-section, .light-theme .catalog-content .search-options .filters-section {
      margin: 0;
      padding: 0;
      list-style: none;
      width: 137px;
      border: 1px solid #777;
      background: #efefef;
  }
  button.category-name.btn-text.ng-binding.ng-scope {
      background-image: url(http://static.rbxcdn.com/images/UI/catalog/img-right_arrow.png) !important;
      background-position: 112px 12px;
      background-repeat: no-repeat;
  }

  .catalog-container .catalog-results .buy-robux {
      border-color: #007001;
      background-color: #007001;
      background-image: url(http://web.archive.org/web/20140516222354im_/http://www.roblox.com/images/Buttons/StyleGuide/bg-btn-green.png);
      color: white;
      border-radius: 0;
      /*totally not stolen code from myster van to fix the padding*/
          padding: 1px 13px 3px 13px !important;
      height: 34px !important;
      min-width: 62px !important;
      font-size: 20px !important;
      background-position: left -96px !important;
      line-height: 1.428 !important;
     /*font looks like mac default browser font*/
     font-family: 'Source Sans Pro';
     font-weight: 600;

  }
  .catalog-container .catalog-results .buy-robux:hover {
  background-position: left -128px !important;
  }



  .catalog-container .search-container-original .search-input {
           width: 325px;
      float: left;
      padding: 2px 5px;
      margin-right: 4px;
      height: 21px;
      font-size: 11px;
      line-height: 18px;
      border: 1px solid #a7a7a7;
      border-radius: 0;
         font-family: 'Source Sans Pro';
       color: #000
  }


  .input-group .icon-search {
  display: none;
  }
  iv.ng-scope[ng-if='\\!layout\\.hasSearchOptionsError'] {
      margin: 0;
      padding: 0;
      list-style: none;
      width: 134px;
      border: 0px solid #777;
      background: #0000;
  }
  .border-bottom.category-section {
      width: 136px !important;
      border: 1px solid #777 !important;
      margin: 0;
      padding: 0;
      list-style: none;
      width: 134px;
      background: #efefef;
  }
  .search-options .search-options-header {
      margin-bottom: 0px;
      width: 134px !important;
      padding: 0 !important;
      background: url(https://static.rbxcdn.com/images/UI/catalog/browse-by-category-header.png) !important;
      height: 34px !important;
      font-size: 0px !important;
  }
  orm.border-right.search-options-form.ng-pristine.ng-valid.ng-valid-maxlength.ng-valid-required.ng-valid-min.ng-valid-pattern {
      width: 151px !important;
  }
  form.border-right.search-options-form.ng-pristine.ng-valid.ng-valid-maxlength.ng-valid-required.ng-valid-min.ng-valid-pattern {
      width: 151px !important;
      background-color: rgb(0 0 0 / 0%) !important;
      border-right: 1px solid #ccc !important;
  }
  .catalog-content .search-options .panel {
      margin-bottom: 0px; 
      height: 31px !important;
      padding: 7px 6px !important;
      font-size: 14px !important;
  }
  .catalog-content .search-options .panel:hover {
      background-color: #d8d8d8 !important;
  }
  button.category-name.btn-text.ng-binding.ng-scope {
      height: 31px !important;
      padding: 0px 0px !important;
      font-size: 14px !important;
      line-height: unset;
      position: relative;
      top: -6px;
  	color: #000 !important;
  }
  #expandable-menu-category-13 > button.category-name.btn-text.ng-binding.ng-scope {
      font-size: 11px !important;
  }
  button.category-name.btn-text.ng-binding.ng-scope {
      background-image: url(http://static.rbxcdn.com/images/UI/catalog/img-right_arrow.png) !important;
      background-position: 112px 12px;
      background-repeat: no-repeat;
  }
  .catalog-content .search-options .toggle-submenu {
      background-position: unset;
      height: 0px;
      width: 0px;
      background-size: auto;
  }

  .collapsing {
      display: inline-block;
      position: relative;
      left: 128px;
      top: -38px;
      border: 1px solid #777;
      background: #efefef;
  	z-index: 4 !important;
  	width: 134.828px !important;
  }
  .collapse.in {
      display: inline-block;
      position: relative;
      left: 128px;
      top: -38px;
      border: 1px solid #777;
      background: #efefef;
  	z-index: 4 !important;
  	width: 134.828px !important;
  }






  li.top-border.ng-scope {
      padding-right: 5px;
      display: block;
      text-decoration: none;
      color: black;
      padding: 7px 6px !important;
  	font-size: 14px !important;
  	height: 31px !important;
  }
  button.small.text.menu-link.text-link-secondary.btn-text.ng-binding {
  	position: relative;
  	top: -3px;
  	font-size: 14px !important;
  	color: #000 !important;
     width: 134px !important;
  	padding-left: 6px;
     margin-left: -6px;
  }

  .catalog-content .search-options .subcategory-menu {
      padding: 0px 0px;
  }



  .light-theme .input-group-btn .input-dropdown-btn {
      height: 23px;
      border: 1px solid #a7a7a7;
      padding: 2px 2px 0px 2px;
      margin-right: 6px;
      float: left;
      position: relative;
  }




  button.input-dropdown-btn.category-options.ng-scope {
          font-size: 12px;
      height: 21px;
      width: 150px;
      height: 27px !important;
      border: 1px solid #a7a7a7 !important;
      padding: 2px 2px 0px 2px !important;
      background-color: #fff0 !important;
      margin-right: 6px !important;
      float: left !important;
      position: relative !important;
      font-size: 12px !important;
      width: 150px !important;
      left: 0px !important;
      -webkit-appearance: none !important;
      -webkit-border-radius: 0 !important;
      background-color: #fff !important;
      position: relative;
      left: -40px !important;
      background-image: url(http://www.roblox.com/images/UI/Catalog/dropdown.png) !important;
      background-position: right top !important;
      background-repeat: no-repeat !important;
      background-position-y: 3px !important;
      background-position-x: 127px !important;
  }

  `;
}
if (location.href.startsWith("https://www.roblox.com/groups") || location.href.startsWith("web.roblox.com/groups")) {
  css += `
  .group-details .container-header h3 {
      border: 1px solid #ccc;
      background: #efefef;
      margin-left: 14px;
      font-size: 18px;
      font-weight: bold;
      display: block;
      clear: both;
      padding: 3px;
      margin-bottom: 5px;
  }

  .light-theme .input-group-btn .input-dropdown-btn {
      background-color: #D6D6D6;
      padding: 7px;
      border: 1px solid #9e9e9e;
      font-weight: bold;
      font-size: 15px;
      margin: 4px 2px 0 1px;
      border-bottom-width: 0;
      position: relative;
      top: -1px;
     border-radius:0px;
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
