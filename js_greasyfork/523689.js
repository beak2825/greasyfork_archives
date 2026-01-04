 // ==UserScript==
// @name         Isolation -  Cosmic Aqua Green
// @namespace    http://tampermonkey.net/
// @version      1.60
// @description  Motyw NI
// @author       Mateoo
// @icon         https://i.imgur.com/U1B1myX.png
// @match        https://*.margonem.pl/
// @match        https://*.margonem.com/
// @exclude      https://dev.margonem.pl/
// @icon
// @downloadURL https://update.greasyfork.org/scripts/523689/Isolation%20-%20%20Cosmic%20Aqua%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/523689/Isolation%20-%20%20Cosmic%20Aqua%20Green.meta.js
// ==/UserScript==
(function() {
  'use strict';
if (getCookie('interface') === 'ni'){
  $(`<style>

:root {
  --color: #006764ab;
}

/*Import czcionek*/
 @import url('https://fonts.cdnfonts.com/css/Futura');
 @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap');
 @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.profs-icon{background: url(https://i.imgur.com/W3zdTf7.png);}


/*KURSORY*/
  .party__list .party-member .table-wrapper {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party__list .party-member .table-wrapper .nickname {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party__list .party-member .party-options .give-lead, .party__list .party-member .party-options .kick-out, .party__list .party-member .party-options .party__disband {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .border-window .header-label-positioner {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .border-window.transparent .tw-tabs > div{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-partyStats-font{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-partyStats-profs{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-partyStats-font *{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .dropdown-menu .menu-arrow{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background:url(https://i.imgur.com/W3zdTf7.png)no-repeat -849px -107px;}
  .clan-quests-content .black{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .one-addon-on-list {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;border: 1px solid #53e4b1;background: #15433991;}
  .matchmaking-ranking .cards-header-wrapper .cards-header .card {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;text-align: center;}
  .matchmaking-panel .all-pages .main-wnd .section table .hover-tr{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;border: 1px solid #53e4b1;background: #15433991;}
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .scroll-wrapper .scroll-pane .one-location-on-list:hover{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;border: 1px solid #53e4b1; color:#83e9fd}
  .tabs-nav .card:not(.disabled):hover{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;color: #4cfabe;}
  .c-slider__input{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .default-cursor {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .dialogue-cursor {cursor: url("https://i.imgur.com/NBDHulA.png"), url("https://i.imgur.com/NBDHulA.png"), auto;}
  .ie-icon{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .battle-msg {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .rewards-calendar .calendar-days-content .day-wrapper .day .reward .lock::after{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .new-chat-message .information-part .author-section.click-able, .new-chat-message .information-part .receiver-section.click-able, .new-chat-message .message-part .chat-message-clan-link, .new-chat-message
  .message-part .chat-message-profile-link, .new-chat-message .message-part .link.mark-message-span, .new-chat-message .message-part .linked-chat-item, .new-chat-message .message-part .message-section .click-able
  {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .color-picker .choose-color-wrapper .choose-color-bck{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-choice{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .news-panel .news-content .news-arrow-element{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .news-panel .news-content .news-section a {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .news-time-promo-tile .buy-button-wrapper .buy-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto !important;}
  .button, .widget-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto !important;}
  .border-window .close-button-corner-decor .close-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto}
  .skills-window .left-column .skills-wrapper .skill {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .world-window__tabs{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto}
  .relogger__one-world {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto; transition:.2s;}
  .relogger__one-character:not(.disabled) {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .settings-window .hero-options-config .hero-options li {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .settings-window .notifications-config .scroll-wrapper .scroll-pane .all-notification .sound-notif{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .do-action-cursor {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .card-content .clan-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr .hover-header{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .game-window-positioner .inventory_wrapper .bags-navigation .item{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cards-header-wrapper .cards-header .card:not(.disabled):hover{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;color: #4cfabe;}
  .elite-timer .row.short{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .elite-timer .row.long{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .member-online, .mz-button--icon svg, #maddonz .cursor--pointer, .mz-control__control, .mz-state-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .addonDisplay-scroll-content > div{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .divide-list-group{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .tp-scroll .right-column .scroll-wrapper .scroll-pane .mini-map-wrapper .mini-map-positioner .cords{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .one-item-on-divide-list{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-alert{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .cll-alert button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-bordered-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-modal button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-modal{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .chat-input-wrapper .control-wrapper .menu-card .card-name{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .border-window .header-label-positioner .header-label{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr .hover-header{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr .normal-td{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .layer.interface-layer .positioner.top .hud-container .btn-min {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .MBEditor .mb-label{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .battle-skill{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .battle-skill.disabled{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .battle-controller .attach-battle-log-help-window{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .battle-controller .attach-battle-prediction-help-window{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .scroll-wrapper .scrollbar-wrapper .track .handle, .scroll-wrapper.classic-bar .scrollbar-wrapper .track .handle {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .scroll-wrapper .scrollbar-wrapper .arrow-down, .scroll-wrapper.classic-bar .scrollbar-wrapper .arrow-down {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .scroll-wrapper .scrollbar-wrapper .arrow-up, .scroll-wrapper.classic-bar .scrollbar-wrapper .arrow-up {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .btn-min{cursor:url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .chat-channel-card-wrapper .chat-channel-card .chat-channel-card-icon {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .friend-enemy-list .friend-enemy-cards .card{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .border-window.transparent .increase-opacity {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .settings-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .toggle-size-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .matchmaking-tile{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png ) 4 0,auto;}
  .border-window.transparent .collapse{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .scroll-wrapper.small-bar .scrollbar-wrapper .track .handle{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .clan .left-column .scroll-wrapper .scroll-pane .card{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .clan-skills-content .black {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .popup-menu .menu-item {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;min-width: 90px;padding: 3px 5px;display: block;margin-bottom: 1px;font-size: 12px;text-align: center;border-radius: 3px;background-color: #0c0c0c8c;color: #a3a3a3;border: 1px solid #000000;}
  .chat-input-wrapper .control-wrapper .chat-config-wrapper .chat-config-wrapper-button{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .attack-cursor {cursor: url(https://i.imgur.com/fdzL5gi.png),url(https://i.imgur.com/fdzL5gi.png),auto;}
  .mAlert-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option{cursor:  url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .who-is-here .scroll-wrapper .scroll-pane .one-other .tip-container{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party .list .party-member .table-wrapper{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party .list .party-member .party-options .kick-out{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party .list .party-member .party-options .give-lead{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .party .list .party-member .table-wrapper .hp{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .dialogue-window .content .answers li{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto; border-bottom: 1px solid rgb(64 93 92 / 40%);}
  .border-window .increase-opacity, .dialogue-window .increase-opacity{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .captcha-pre-info__toggler{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .radio-custom [type=radio]+label{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .depo .bottom-section .cards-menu .card:not(.disabled){cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up
  {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down
  {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .background, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .background, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .background, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .background
  {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle
  {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .menu-list .menu-option{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item{width: 65px; cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .drop-down-menu-section .type-header{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .auction-window .left-column-auction .all-categories-auction .one-category-auction{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .auction-but{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-dock{cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-dock-widget img {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-dock-handle {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-dock-widgets {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-dock-widget {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-change-character-char {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-change-character-world-menu {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-window {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-window-header {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-window-title {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .gargonem-close-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-settings-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background: url(https://i.imgur.com/W3zdTf7.png) -607px -117px;}
  .gargonem-opacity-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-otherlist-other-text .gargonem-otherlist-left.nowrap, .gargonem-otherlist-other-text .gargonem-otherlist-right.nowrap{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-otherlist-other-button *, .gargonem-otherlist-other-text * {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-otherlist-other.rel-1 .gargonem-otherlist-other-button, .gargonem-otherlist-other.rel-1 .gargonem-otherlist-other-text {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-timer {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-menu .cll-menu-item{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-link {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .timer--active .timer-node {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  .timer-node__arrow, .timer-node__delete {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  ._1ol33ot0 {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background: #011e25c7;border: 1px double #33836ced;opacity:0.6;bottom:100px;left:1px; height: 26px;width: 26px;text-align: center;}
  #cll-ok, #cll-notify {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-launcher {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  #PWLauncher{width: 12px;height: 12px;padding: 6px;position: absolute;bottom: 50px;z-index: 297;background: #011e25c7 !important;border: 1px double #33836ced !important;opacity: 0.6;color: #ffffff;left: 1px;top:717px !important;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0, url(https://i.imgur.com/jppqBuq.png) 4 0, auto;pointer-events: initial;}
  .gargonem-checkbox {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-detector-pin {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-card {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-card-enable-wnd {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-tab-selector {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-card-title {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-card-content {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-flex, .gargonem-addon-wrapper {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;}
  #cll-show-settings, #cll-send-msg, #cll-active-users, #cll-add-timer, #cll-hidden-timers, #cll-show-console{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  a.cll-bordered-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-help-link {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .cll-member:hover {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  span.cll-bordered-button {cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}

/*LADOWANIE*/
  .layer.loader-layer {background: url(https://i.imgur.com/YnDVpJg.jpeg) !important; background-size:100%;}
  .layer.loader-layer .progress-bar .progress-bar-and-image-wrapper .loader-image {margin: auto;display: none !important;}
  .layer.loader-layer .progress-bar .progress-bar-and-image-wrapper .inner-wrapper {background: black !important}
  .layer.loader-layer .progress-bar .progress-bar-and-image-wrapper .inner-wrapper .inner {background: linear-gradient(to right, #000000 0%, #30bf92 45%, #000000 100%) !important; animation: pulse 1s;}

/*Alerty */
  .alerts-layer .big-messages .message, .console-layer .big-messages .message, .mAlert-layer .big-messages .message, .mAlert-mobile-layer .big-messages .message {pointer-events: all; margin-bottom: -16px; width: 100%; font-size: 16px; line-height: 35px; color:#07fab1; font-weight: 500; padding: 10px 10px; text-shadow: 0 0 3px #000, 0 0 10px #000; font-family: Cinzel;}
  .log-off .log-out-actions,.log-off .time-to-out{color:#91f7ff;}
  .alerts-layer .big-messages .message, .console-layer .big-messages .message, .mAlert-layer .big-messages .message, .mAlert-mobile-layer .big-messages .message{animation:none !important;}

/*BELKI GORA-DOL*/
  .layer.interface-layer .positioner.top .bg { background: url(https://i.imgur.com/416cXMB.png) 0 -61px repeat }
  .layer.interface-layer .positioner.bottom .bg { background: url(https://i.imgur.com/416cXMB.png) 0 0 repeat }

/*Panel prawy*/
  .layer.interface-layer .main-column.right-column .border{background:none;}
  .layer.interface-layer .main-column.right-column{background: url(none) 0px -184px !important;background: #010e09ad !important;border-left: solid 2px #53e4b1;}
  .interface-element-grid-border{outline: 1px solid #53e4b1cf;}
  .game-window-positioner .character_wrapper .stats-wrapper{background: #0000008a;box-shadow: inset 0px 0px 4px 2px #236650;border-radius: 5px;}
  .game-window-positioner .character_wrapper .stats-wrapper .header-title-wrapper .header-title{color:#53e4b1;}
  .interface-element-active-card-background-stretch{background: none;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list li .icon{background:url(https://i.imgur.com/W3zdTf7.png);}
  .extended-stats .scroll-pane h3 {border-bottom: 1px solid #1f4739;color: #ffffff;}
  .extended-stats .scroll-pane .bonuses .one-legend-bonus{color: #99ffe8;}
  .extended-stats .scroll-pane .stats-section{font-family: 'Futura', sans-serif;}
  .extended-stats .scroll-pane h3{font-family: 'Futura', sans-serif;color: #00ffa7;}
  .extended-stats .scroll-pane .stat-group h4 {color:#3cc3ab;font-family: 'Futura', sans-serif;border-top: 1px solid #3ce0a0;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.green{color: #57f488;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.blue{color: #8adae9;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.yellow{color: #f4fd5d;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.red{color: #f42077;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list li .value{color: #2bdcbc;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.orange{color:#f6b85c;}
  .interface-element-grid-border{box-shadow: 0 0 0 1px #319d8296, 0 0 0 2px #354744, 0 0 0 3px #1b3235;}
  .interface-element-one-item-slot-background-to-repeat{background:url(https://i.imgur.com/xlrJIYP.png);}
  .interface-element-equipment .equipment-wrapper-outline .equipment-outline-1, .interface-element-equipment-with-additional-bag .equipment-wrapper-outline .equipment-outline-1{background: #43cf88;}
  .interface-element-equipment .equipment-wrapper-outline .equipment-outline-2, .interface-element-equipment-with-additional-bag .equipment-wrapper-outline .equipment-outline-2{background: #62cd9c;}
  .interface-element-equipment .equipment-wrapper-outline .equipment-outline-3, .interface-element-equipment-with-additional-bag .equipment-wrapper-outline .equipment-outline-3{background: #3d9885;}
  .interface-element-equipment .equipment-wrapper-outline .equipment-outline-4, .interface-element-equipment-with-additional-bag .equipment-wrapper-outline .equipment-outline-4{background: #032b1c;}
  .game-window-positioner .character_wrapper .pvp-btn{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -430px -369px;}
  .build-index{font-family:Futura; color:#2fd1a7d6;}
  .interface-element-one-black-tile{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -189px -178px;filter: brightness(0.4);}
  .interface-element-item-slot-grid-stretch{background: url(https://i.imgur.com/xlrJIYP.png);}
  .item .amount, .bottomItem .amount  {background: rgb(20 160 89 / 38%);    border: 1px solid rgb(37 237 255);color: #95ecbc;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .game-window-positioner .inventory_wrapper .bags-navigation .item:hover{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -227px -178px;}
  .game-window-positioner .inventory_wrapper .bags-navigation .item.active .highlight{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -227px -178px;}
  .item:hover{background: #89ecf536;filter: brightness(0.8);}
  .layer.interface-layer .main-column .extended-stats{background: rgb(38 77 64 / 48%);}
  .interface-element-active-card-background-stretch{border-style:none; border-image:none;}


/*BUTTONY*/
  .button.red, .widget-button.red {box-shadow: inset 0 0 1px 1px #101a16, inset 0 0 0 3px #2e1317; background-image: linear-gradient(to top,#2e0914, #0e362c);}
  .button.red:hover, .widget-button.red:hover {box-shadow: inset 0 0 1px 1px #101a16, inset 0 0 0 3px #4f1b23 !important; background-image: linear-gradient(to bottom,#2e0914, #0e362c) !important;}
  .button.red::before, .widget-button.red::before{box-shadow:none !important;}
  .button.green, .widget-button.green, .pressed {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #68bd95e3;background-image: linear-gradient(to top, #212725, #106e57c2);}
  .widget-button.green.window-is-open::before {background-image: linear-gradient(to bottom,#00311e, #011a10);}
  .button.green::before, .widget-button.green::before{box-shadow: inset 0 0 1px 1px rgb(0 0 0 / 100%);}
  .button.black, .widget-button.black, body.mobile-version .button:not(.no-hover):not(.disabled):active, body.mobile-version .widget-button:not(.no-hover):not(.disabled):active, body:not(.mobile-version) .button:not(.no-hover):not(.disabled):hover:not(.active), body:not(.mobile-version) .widget-button:not(.no-hover):not(.disabled):hover:not(.active){background-image: linear-gradient(to top,#002113,#004f2b);box-shadow: inset 0 0 1px 1px #9ae6b6, inset 0 0 0 3px #131c18;}
  .button.blue, .widget-button.blue {box-shadow: inset 0 0 1px 1px #006d38, inset 0 0 0 3px #01452a;background-image: linear-gradient(to top,##00311d, #0a120d);}
  .button.blue.window-is-open::before, .widget-button.blue.window-is-open::before {background-color: transparent;}
  .button.blue::before, .widget-button.blue::before{box-shadow:none;}
  .button.purple.window-is-open::before, .button.violet.window-is-open::before, .widget-button.purple.window-is-open::before, .widget-button.violet.window-is-open::before{box-shadow:none;}
  .button.blink-violet, .widget-button.blink-violet  {background-image: linear-gradient(to top, #212725, #106e57c2);box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #68bd95e3;}
  .button.purple.window-is-open::before, .button.violet.window-is-open::before, .widget-button.purple.window-is-open::before, .widget-button.violet.window-is-open::before {background-image: linear-gradient(to bottom,#001c31, #000806);}
  .widget-button.violet.widget-in-interface-bar.widget-news-icon.ui-draggable.ui-draggable-handle.ui-draggable-disabled.window-is-open{background-image: linear-gradient(to bottom,#1e5c3f, #00211d);}
  .widget-button.blink-violet.widget-in-interface-bar.widget-star.ui-draggable.ui-draggable-handle.ui-draggable-disabled.window-is-open{background-image: linear-gradient(to bottom,#1e5c3f, #00211d);}
  .menu-list .bck .menu-option{color:#a2ffdb;}
  .leave-but.v-but.v-item>.button.small{box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000; background-image: linear-gradient(to top,#310000, #000806);}
  .buttons.action-buttons.btns-spacing>.button.small{box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000; background-image: linear-gradient(to top,#310000, #000806);}
  .buttons.action-buttons.btns-spacing>.button.small.green{box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #1e5c3f; background-image: linear-gradient(to top,#013b18, #000806);}
  .quest-buttons-wrapper>.button.small.track.button-tracking{box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000; background-image: linear-gradient(to top,#013b18, #000806);}
  .button{box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000; background-image: linear-gradient(to top,,#013b18, #000806);}
  .button.purple::before, .button.violet::before, .widget-button.purple::before, .widget-button.violet::before{inset 0 0 1px 1px rgb(41 156 167 / 65%);}
  .button.black, .widget-button.black, body.mobile-version .button:not(.no-hover):not(.disabled):active, body.mobile-version .widget-button:not(.no-hover):not(.disabled):active, body:not(.mobile-version) .button:not(.no-hover):not(.disabled):hover:not(.active), body:not(.mobile-version) .widget-button:not(.no-hover):not(.disabled):hover:not(.active){box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #68bd95e3;background-image: linear-gradient(to top, #41554e, #2aeebec2);}
  .widget-button .icon{background: url(https://i.imgur.com/W3zdTf7.png);filter: brightness(0.8);}
  .button.purple, .button.violet, .widget-button.purple, .widget-button.violet {background-image: linear-gradient(to top, #212725, #106e57c2);box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #68bd95e3;}
  .widget-button .widget-blink{background: #d0fff9;opacity: 0.3;border: solid 1px #7cc5ff;}
  .button.blink-violet.window-is-open::before, .widget-button.blink-violet.window-is-open::before{background-color:transparent;}
  .button.small.green.pressed {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #56ebd0;background: #4fede7b5;}
  .button.blink-violet::before, .widget-button.blink-violet::before{box-shadow: inset 0 0 1px 1px rgb(144 226 213 / 65%);border-radius: 2px;}
  .widget-button .amount{background: rgb(20 160 89 / 38%);    border: 1px solid rgb(37 237 255);color: #95ecbc;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .button, .widget-button{color:#30F8FF;}

/*Czat/Lewy Panel*/
  .chat-configure-window .middle-graphic {border-image: url(none);border-style:none;}
  .new-chat-window{border-right: solid 2px #53e4b1;}
  .new-chat-message:nth-of-type(2n+2) {background: none;}
  .new-chat-window .chat-message-wrapper {box-shadow: inset 0 0 3px 3px #1b3127;flex-grow: 1;min-height: 20px;background-image: none;background: #010e09ad !important;}
  .chat-channel-card-wrapper{border:1px solid #429e75; box-shadow:none;}
  .new-chat-window .chat-message-wrapper{border:none;}
  .chat-input-wrapper{background:#031713b0;}
  .new-chat-window .chat-message-wrapper {backdrop-filter: blur(4px);font-family: 'Montserrat'; font-size: 12px;}
  .chat-input-wrapper .magic-input-wrapper {border: 1px solid #429e75;position: relative;}
  .chat-input-wrapper .control-wrapper .chat-config-wrapper .chat-config-wrapper-button{background: url(https://i.imgur.com/W3zdTf7.png) -523px -1009px;}
  .info-icon{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -497px -199px;}
  .chat-input-wrapper .control-wrapper .menu-card{border: 1px solid #429e75 !important;}
  .chat-input-wrapper .control-wrapper .chat-config-wrapper{border: 1px solid #429e75;}
  .border-window.transparent .header-label-positioner .header-label .left-decor, .border-window.transparent .header-label-positioner .header-label .right-decor, .border-window.transparent .header-label-positioner .header-label .text {font-size: 14px;}
  .border-window .header-label-positioner .header-label .text {color: #42ffe5; font-family: 'Futura', sans-serif; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .card-name {font-family: 'Futura', sans-serif;}
  .layer.interface-layer .main-column.left-column .border{background:none !important;}
  .chat-channel-card-wrapper .chat-channel-card{background: url(https://i.imgur.com/W3zdTf7.png) -488px -1000px;}
  .new-chat-message .message-part.special-style-7{color: #01ffc7;}
  .new-chat-message.wrapper-special-style-7{border-bottom: 1px solid #2fdaaf;}
  .chat-configure-window .chat-option-header{color: #01ffd2;border: 1px solid rgb(18 255 211 / 40%);background: rgb(33 251 242 / 10%);}
  .color-picker .choose-color-wrapper .choose-color-bck{box-shadow: inset 0 0 1px 1px #00f6ec, inset 0 0 0 3px #0c0d0d;}
  .chat-configure-window{color: #7ce7b9;}
  .radio-custom [type="radio"]:checked + label{color: #3cebf9;}
  .radio-custom [type="radio"] + label{color: #335e69;}
  .chat-channel-card-wrapper .chat-channel-card.active{background: url(https://i.imgur.com/W3zdTf7.png) -454px -1000px;border: solid 0px #53e4b1;box-shadow: inset 0 0 5px 1px #53e4b1;}

/*HUD Gorny*/
  .layer.interface-layer .positioner.top .hud-container .hero-data .heroname{color: #30F8FF;font-family: Futura;text-shadow: #30F8FF 1px 0 10px;border: solid 1px #53e4b136;}
  .layer.interface-layer .positioner.top .hud-container{background: url(https://i.imgur.com/xuCzydt.png); color: #8ed1be; filter: brightness(0.95);}
  .layer.interface-layer .positioner.top .hud-container .map-data .location{border: solid 1px #53e4b136;text-align: center;color: #53e4b1;text-shadow: #53e4b1 1px 0 10px;}
  .layer.interface-layer .positioner.top .hud-container .map-data .coords{border: solid 1px #53e4b136;color: #53e4b1;text-shadow: #53e4b1 1px 0 10px;}
  .layer.interface-layer .positioner.top .hud-container .world-name{border: solid 1px #53e4b136;text-align: center;color: #53e4b1;text-shadow: #53e4b1 1px 0 10px;}
  .layer.interface-layer .positioner.top .hud-container .herocredits.herogold, .layer.interface-layer .positioner.top .hud-container .herogold.herogold{border: solid 1px #53e4b136;text-align: center;color: #53e4b1;text-shadow: #53e4b1 1px 0 10px;}
  .layer.interface-layer .positioner.top .hud-container .herocredits.herocredits, .layer.interface-layer .positioner.top .hud-container .herogold.herocredits{border: solid 1px #53e4b136;text-align: center;color: #53e4b1;text-shadow: #53e4b1 1px 0 10px;}

/*KULKI PVP*/
  .layer.interface-layer .positioner.top .hud-container .map_ball.red {background-position: -14px -38px;background: radial-gradient(#e85772, #8f142b);border: 1px solid #53e4b1;scale: 0.9;pointer-events: all;box-shadow: 0px 0px 6px 3px #53e4b1;}
  .layer.interface-layer .positioner.top .hud-container .map_ball.green {background-position: -14px -38px;background: radial-gradient(#6cc588, #079e4e);border: 1px solid #53e4b1;scale: 0.9;pointer-events: all;box-shadow: 0px 0px 6px 3px #53e4b1;}
  .layer.interface-layer .positioner.top .hud-container .map_ball.yellow {background-position: -14px -38px;background: radial-gradient(#c5c26c, #949410);border: 1px solid #53e4b1;scale: 0.9;pointer-events: all;box-shadow: 0px 0px 6px 3px #53e4b1;}
  .layer.interface-layer .positioner.top .hud-container .map_ball.orange {background-position: -14px -38px;background: radial-gradient(#c5926c, #c56f08);border: 1px solid #53e4b1;scale: 0.9;pointer-events: all;box-shadow: 0px 0px 6px 3px #53e4b1;}
  .layer.interface-layer .positioner.top .hud-container .map_ball{top: 20.5px;left: 8px;width: 14px;height: 14px;}
  .layer.interface-layer .positioner.top .hud-container .credits-tip{left: 196px;background: url(https://i.imgur.com/bLpYDL6.png);background-size: 70%;background-repeat: no-repeat;bottom: 2px;}
  .layer.interface-layer .positioner.top .hud-container .gold-tip{background: url(https://i.imgur.com/sHIHQ56.png);left: 72px;background-size: 70%;background-repeat: no-repeat;bottom: 2px;}
  .layer.interface-layer .positioner.top .hud-container .btn-min.gold-btn{display:none;}
  .layer.interface-layer .positioner.top .hud-container .btn-min.credits-btn{display:none;}

/*HUD Dolny*/
  .bottom-panel .glass{background: url(https://i.imgur.com/yQMxfGY.png)-8px -199px;}
  .bottom-panel .hp-indicator .blood {bottom: -1px;position: absolute;background: radial-gradient(#30f8ffa6, #53e4b170);}
  .bottom-panel-pointer-bg .pointer-ttl {position: absolute;background: radial-gradient(#30f8ffa6, #53e4b170);font-size: 10px;font-family: 'Futura';font-weight: 300;color: #ffffff;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;border: solid 1.5px #2b675675;border-radius: 100%;width: 40px;height: 40px;line-height: 40px;left: 160px;box-shadow: 0 0 5px 5px #2df7a296;top: -25px;}
  .bottom-panel-pointer-bg .pointer-exp {position: absolute;background: radial-gradient(#30f8ffa6, #53e4b170);font-size: 10px;font-family: 'Futura';font-weight: 300;color: #ffffff;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;border:solid 1.5px #2b675675;border-radius: 100%;width: 40px;height: 40px;line-height: 40px;left: 32px;box-shadow: 0 0 5px 5px #2df7a296;top: 29px;}
  .bottom-panel .exp-bar-wrapper .exp-progress .overlay {width: 250px;height: 18px;left:9px;}
  .bottom-panel .exp-bar-wrapper .exp-progress.right .overlay{width: 261px;left: -10px;}
  .bottom-panel-pointer-bg{background: url(none);}
  .bottom-panel .exp-bar-wrapper .exp-progress .progress.noexp .inner{background: linear-gradient(180deg, #4d6567 0, #8abac5 25%, #84bbbb 60%, #577572 100%); animation: pulse 5s infinite;}
  .bottom-panel .exp-bar-wrapper .exp-progress .progress .inner {background: linear-gradient(to right, #002722 0%, #86ecd3 45%, #3decaa 100%); animation: pulse 5s infinite;}
  .bottom-panel .hp-indicator .hpp {font-size: 20px;color:#91ffd8;top: 20px;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; left: 4px;font-family: Futura;font-weight: bold;}
  .bottom-panel .lagmeter .lag{background: url(https://i.imgur.com/W3zdTf7.png);}
  .bottom-panel .lagmeter .lag.lag-0 {background-postion:default; background:url(https://i.imgur.com/kLIbXU4.png)no-repeat;}
  .bottom-panel .lagmeter .lag.lag-1 {background-postion:default; background:url(https://i.imgur.com/kLIbXU4.png)no-repeat;}
  .bottom-panel .lagmeter .lag.lag-2 {background-postion:default; background:url(https://i.imgur.com/oRCyU1b.png)no-repeat;}
  .bottom-panel .lagmeter .lag.lag-3 {background-postion:default; background:url(https://i.imgur.com/oRCyU1b.png)no-repeat;}
  .bottom-panel .lagmeter .lag.lag-4 {background-postion:default; background:url(https://i.imgur.com/ny98oTU.png)no-repeat;}
  .bottom-panel .lagmeter .lag.lag-5 {background-postion:default; background:url(https://i.imgur.com/ny98oTU.png)no-repeat;}
  .bottom-panel .lagmeter{width: 16px;height: 16px;left: 412px;bottom: 8px;}
  .bottom-panel .hp-indicator-wrapper{left: 282px;}
  .layer.interface-layer .positioner.bottom .bg-additional-widget-left{background:none;}
  .layer.interface-layer .positioner.bottom .bg-additional-widget-right{background:none;}
  .bottom-panel .hp-indicator .blood-frame{filter:hue-rotate(175deg);}
  .bottom-panel .exp-bar-wrapper .exp-progress .progress{left:8px;width: 241px;}
  .bottom-panel .exp-bar-wrapper .exp-progress.right{left: 384px;}
  .bottom-panel-of-bottom-positioner .bottom-panel-graphic{background: url(https://i.imgur.com/k1FH210.png) no-repeat -256px -870px;}
  .bottom-panel-of-bottom-positioner .exp-bar-wrapper .exp-progress.right .overlay {background: url(https://i.imgur.com/k1FH210.png) no-repeat -450px -976px;}
  .bottom-panel-of-bottom-positioner .exp-bar-wrapper .exp-progress .overlay{background: url(https://i.imgur.com/k1FH210.png) no-repeat -445px -955px;}
  .bottom-panel-pointer-bg .pointer-exp-graphic{background:none;}
  .bottom-panel-pointer-bg .pointer-ttl-graphic{background:none;}
  .interface-element-one-item-slot-2{border: 1px solid #53e4b1;outline: 1px solid #53e4b180;background: #143b2d;box-shadow: inset 2px 0 15px 1px #000;}

/*Standard Okno*/
  .border-window{border-image: url(https://i.imgur.com/5afWWAY.png) 32 20 fill repeat;}
  .interface-element-middle-1-background{background:#0b1210;}
  .border-window .close-button-corner-decor .close-button{background: url(https://i.imgur.com/W3zdTf7.png) -263px -79px;top:10px;right:10px;}
  .border-window .close-button-corner-decor {background: none;}
  .interface-element-middle-1-background{border-style: none;border-image: none;}
  .border-window .content{background:#0b1210;}
  .border-window{color: #30F8FF;}

/*OKNO LUPOW*/
  .loot-window .bottom-wrapper .bottom-graphic{background: url(none);border-top: solid 1px #2df3bf;}
  .loot-window .middle-graphics{border-image: url(none) 0 11 fill repeat;border-color: #0b1311;}
  .loot-window .items-wrapper .loot-item-wrapper .slot{background: none; box-shadow: 0 0 5px 1px var(--color) !important;}
  .loot-window .items-wrapper .loot-item-wrapper .button-holder .button.green{border-color: transparent;}
  .loot-window .bottom-wrapper .table-wrapper .bag-left, .loot-window .bottom-wrapper .table-wrapper .time-left{color:#aef2ff;}
  .loot-window .items-wrapper .loot-item-wrapper.yours{border: solid 1px #53e4b1;}
  .loot-window .items-wrapper .loot-item-wrapper .text-info{color: #30F8FF;}
  .interface-element-bottom-bar-background-stretch{border-image:none; border-style:none;border-top:solid 1px #53e4b1;}
  .loot-window .items-wrapper .loot-item-wrapper .slot{border: 1px solid #53e4b18f;}
  .loot-window .items-wrapper .loot-item-wrapper{box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, .4);border: 1px solid #53e4b18f;}
  .loot-window .items-wrapper .loot-item-wrapper .text-info{border-top: 1px solid #53e4b18f;border-bottom: 1px solid #53e4b18f;}
  .interface-element-background-color-1{background:none;}

 /*PASEK*/
  .scroll-wrapper .scrollbar-wrapper .arrow-down, .scroll-wrapper.classic-bar .scrollbar-wrapper .arrow-down {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .scroll-wrapper .scrollbar-wrapper .arrow-up, .scroll-wrapper.classic-bar .scrollbar-wrapper .arrow-up {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .scroll-wrapper .scrollbar-wrapper .track .handle, .scroll-wrapper.classic-bar .scrollbar-wrapper .track .handle {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .friend-enemy-list .column .scroll-wrapper .scrollbar-wrapper .background{filter:brightness(0.5);}
  .skills-window .left-column .scroll-wrapper .scrollbar-wrapper .background, .skills-window .right-column .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .clan .right-column .scroll-wrapper.classic-bar .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .new-chat-window .chat-message-wrapper .scrollbar-wrapper{background: #0b1c1a;border: 1px solid #529f84;}
  .clan .left-column .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .border-window .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat !important;}
  .addons-panel .left-column .scroll-wrapper .scrollbar-wrapper .background, .addons-panel .right-column .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .settings-window .section .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .left-grouped-list-and-right-description-window .left-column .scroll-wrapper .scrollbar-wrapper .background, .left-grouped-list-and-right-description-window .right-column .scroll-wrapper .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .battle-controller .battle-content .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .extended-stats .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .builds-window .scroll-wrapper .scrollbar-wrapper{right: 2px !important;}

/*AFK*/
  .stasis-overlay {background-color: rgb(23 38 33 / 76%);pointer-events: none;}
  .stasis-overlay__caption {color: #75e0c4;font-family: Futura;top: 350px;font-size: 18px;}
  .stasis-incoming-overlay__caption{color: #00bb76;}

/*dymek*/
  .bubbledialog .content-layer .inner .container {color: #44b6a1;}
  .bubbledialog .content-layer .inner .container .answers .answer{color: #377f88;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;text-align: center;}

/*QUESTY Wyglad*/
  .quest-box{left: 2px;}
  .quest-box .quest-content {background: url(none);background: #0c2420;border: solid 1px #3b6e5a;width: auto; box-shadow: 0px 0px 1px 1px #73ddd4;}
  .quest-log .scroll-wrapper .scroll-pane .middle-graphics{background: url(https://i.imgur.com/Mgjx5HO.png);}
  .quest-box .info-wrapper{background: url(none);background: #0c2420;border: solid 1px #3b6e5a;width: 97.5%;margin-left: 0px;margin-right: 0px; box-shadow: 0px 0px 1px 1px #73ddd4;    margin-top: 0.5px;}
  .search-wrapper{border-image: url(https://i.imgur.com/O5DbfFb.png) 5 9 23 34 fill;}
  .quest-observe-window .scroll-wrapper .scroll-pane .quest-observe-list .one-quest-observe .title{color: #72faff; font-family: Montserrat;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .quest-observe-window .scroll-wrapper .scroll-pane .quest-observe-list .one-quest-observe .quest-content{color: #85c2c4;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .one-observe__title{color: #72faff;font-family: Montserrat;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .one-observe__content{color: #85c2c4;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}

/*DIALOGI NAGLOWKI*/
  .border-window .header-label-positioner .header-label .left-decor{background: none;}
  .border-window .header-label-positioner .header-label .right-decor{background: none;}


/*zestawyum*/
  .one-build.active:hover {border: 1px solid #439c84;}
  .one-build.active {border: 1px solid #1e755a;}
  .one-build .build-items-wrapper, .one-build-to-buy .build-items-wrapper {background: url(https://i.imgur.com/7GXXK2G.png) 0 0;}
  .one-build, .one-build-to-buy{border:1px solid #12211b;}
  .one-build:hover {border: 1px solid #429976; transition:.3s;}
  .build-index{font-family:Futura; color:#2fd1a7d6;}
  .one-build .build-name-wrapper>.build-name, .one-build .build-name-wrapper>.build-number, .one-build .build-skills-left-wrapper>.build-skills-left, .one-build-to-buy .build-name-wrapper>.build-name, .one-build-to-buy .build-name-wrapper>.build-number, .one-build-to-buy .build-skills-left-wrapper>.build-skills-left {color: #308564; text-shadow: 1px 1px #578271; font-family: 'Futura';}
  .attach-icon{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -516px -398px;}
  .right-column .inner-wrapper .battle-set-wrapper{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -517px -709px;}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-0.active{filter: brightness(0.9);}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-1.active{filter: brightness(0.9);}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-2.active{filter: brightness(0.9);}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-0:hover{filter: brightness(0.9);}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-1:hover{filter: brightness(0.9);}
  .right-column .inner-wrapper .battle-set-wrapper .battle-set-nr-2:hover{filter: brightness(0.9);}
  .build-index {color: #47ae92 !important; text-shadow: -1px -1px 2px ##32ad6e;}

/*Grupa*/
  .party__list .party-member.yellow{color: #58ffd2;font-weight:bold}
  .party__list .party-member{color: #a3d5c8;}
  .party__list .party-member .table-wrapper .hp .hp-bar{filter:hue-rotate(175deg);}
  .border-window.transparent .tw-tabs > div.active, .border-window.transparent .tw-tabs > div.is-active{color: #73f3e9;}
  .border-window.transparent .tw-tabs > div{color: #72d9df;}
  .party__list .party-member .table-wrapper .party__crown {filter: hue-rotate(114deg);}
  .party__list .party-member .party-options .give-lead:hover {filter: hue-rotate(114deg);}


  .party .list .party-member .table-wrapper .hp .hp-bar {filter:hue-rotate(175deg);}
  .party .players-number{color:#30F8FF;}
  .ni .gargonem-partyStats-profs, .ni .gargonem-partyStats-font{color:#30F8FF;}
  .gargonem-partyStats-font *{color: #30F8FF;}
  .party .list .party-member .party-options .destroy-group{background: url(https://i.imgur.com/W3zdTf7.png) -686px -146px;}
  .party .list .party-member .party-options .give-lead{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -641px -117px;}
  .party .list .party-member .party-options .kick-out{background: url(https://i.imgur.com/W3zdTf7.png) -624px -117px;}
  .close-button:hover{background: url(https://i.imgur.com/W3zdTf7.png) -726px -117px;}.party .list .party-member .party-options .kick-out:hover{background: url(https://i.imgur.com/W3zdTf7.png) -726px -117px;}

  /*Grupa procent info */
.party .exp-percent::before{background:none;}
.party .exp-percent{color: #43f5c7; top: 6px;font-size: 12px;}

 /*NPC DIALOG*/
  .dialogue-window .border-image{box-shadow: 0 0 0 1px #121c16, 0 0 0 2px #81eabd, 0 0 0 3px #414644, 2px 2px 3px 3px #415c5452, 0 0 23px 0px #537e6d; background: rgb(39 59 51 / 39%);}
  .dialogue-window .content .npc-dialogue-wrapper .h_content{color: #73e5c3;}
  .dialogue-window .content .answers li.exit, .dialogue-window .content .answers li.line_exit{color: #e03761;text-shadow: 0px 0px 1px #bc2158;font-weight: bold;}
  li.dialogue-window-answer.answer.line_option {color: #b1c5bd;font-weight: 500}
  .dialogue-window .content .npc-message{color: #d9f8f8;}
  .dialogue-window .content .answers li:hover{background: rgb(53 90 81 / 44%);}
  li.dialogue-window-answer.answer.line_auction{color: #b8f7e1;font-weight: bold;}
  .dialogue-window .content .answers li div.icon{filter: brightness(1.3);}
  .dialogue-window .content .answers .line_cont_quest, .dialogue-window .content .answers .line_new_quest{font-weight: 700;color: #8df6d3;}
  li.dialogue-window-answer.answer.line_depo{font-weight: 600;color: #8df6d3;}
  li.dialogue-window-answer.answer.line_shop{font-weight: 600;color: #ddd677;}
  li.dialogue-window-answer.answer.line_heal{font-weight: 600;color: #4dff86;}
  li.dialogue-window-answer.answer.line_motel{font-weight: 600;color: #ddd677;}
  li.dialogue-window-answer.answer.line_cont_quest{font-weight: 800;color: #33c5ff;}
  li.dialogue-window-answer.answer.line_barter{font-weight: 600;color: #ddd677;}
  li.dialogue-window-answer.answer.line_attack{font-weight: 800;color: #00b46f;}
  li.dialogue-window-answer.answer.line_mail{font-weight: 600;color: #FFF;}

/*who-is-here*/
  .who-is-here .players-number{font-family: 'Futura', sans-serif; color:#56eed9; top:-33px; right:1px; font-size:12px;}
  .border-window.transparent .search-wrapper .search::-webkit-input-placeholder{color: #43d099;}
  .who-is-here .scroll-wrapper .scroll-pane .empty{color: #43d099;}
  .border-window.transparent .search-wrapper::before{background: url(https://i.imgur.com/W3zdTf7.png) -681px -162px no-repeat;}

/*grafiki inne adddony trzeba sobie samemu dodać pozycje*/
  .widget-button .icon.addon_17{background:url(https://i.imgur.com/TmwyFMs.png)-438px -3px;}

/*RELOG*/
  .table-img-avatar>.table-cell-img-avatar:hover{filter: drop-shadow(0px 0px 3px aquamarine); transform: translateY(-1px);}
  .table-img-avatar .table-cell-img-avatar{transition: .2s;}
  .c-line {background-image: linear-gradient(90deg,#ffffff00 10%,rgb(0 137 80 / 80%),transparent 90%);}
  .relogger__one-world.active{color:#91f7ff;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .map-overlay.dead-overlay {background-color: rgb(1 38 21 / 89%);}
  .map-overlay.dead-overlay .positioner .dazed-time{background-color: rgb(0 213 128 / 30%); font-family:Futura;}
  .map-overlay.dead-overlay .positioner .inner-text {color: #a3c9b6; font-family: Futura;}
  .relogger__header{color:#51f2ff;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .relogger__one-world{color: #63a68a;}
  .border-window.transparent .collapse{background: url(https://i.imgur.com/W3zdTf7.png) -556px -399px;}
  .relogger__one-world:hover{background: rgb(115 207 164 / 15%);text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}

/*stroj in game*/
  .change-outfit .cards-header-wrapper .cards-header .card{width: 49.6% !important;}
  .one-outfit .outfit-border{border: 1px solid #53e4b1;}
  .one-outfit .requirements .green{color: #34a859;}
  .change-outfit .bottom-change-outfit-panel .bottom-panel-graphics{top: 0;position: absolute;left: -2px;bottom: 0;right: 0;border-style: none;border-width: 0 59px;border-image: url(none);height: 41px;background: #0d2b26;border-top: solid 1px #53e4b1;width: 532px;}
  .change-outfit .preview-outfit .outfit-header, .change-outfit .your-outfit .outfit-header{padding-left: 8px;height: 20px;color: #57fffd;border-style: none;border-width: 3px 3px;border-image: url(none);line-height: 20px;background: #0d2b26;border: solid 1px #53e4b1;border-radius: 5px;}
  .change-outfit .crazy-bar{background:url(none);}
  .change-outfit .preview-outfit .outfit-wrapper, .change-outfit .your-outfit .outfit-wrapper{background: #24514b;}
  .change-outfit .scroll-wrapper .scroll-pane .empty-info{color: #1ef8ff;}

/*POMOC*/
  .help-window2 .scroll-wrapper .scroll-pane .graphic-background{border-image: url(none) 27 11 fill repeat; background-size: contain;}
  .help-window2 .scroll-wrapper .scroll-pane .content-header {background: url(none);}

/*KONSOLA*/
  .console-wnd.border-window .content{border-image: url(none); border-style:none;}
  .console-window .console-bottom-panel-wrapper .console-bottom-panel{border-image: url(none);border-style: none; border-top: solid 1px #53e4b1;  background: #0d2b26; right: 2px;}
  .console-window .scroll-wrapper .scroll-pane .console-content{color: #4dffb3;}
  .console-message.span.i{color:blue;}
  .console-wnd.global-addons-exist .content .console-bottom-panel-wrapper{height: 33px;background: #0d2b26;}
  #consoleNotif {background: url(https://i.imgur.com/aRnc85W.png) no-repeat -763px -365px;}

/*LOSOWANIE BONUSUW*/
  .bonus-reselect-wnd__bg {background: none;}
  .bonus-selector-wnd__bg{background: none;}
  .bonus-reselect-wnd__item{background: url(https://i.imgur.com/W3zdTf7.png) -51px -444px;}
  .bonus-reselect-wnd__require{background: url(https://i.imgur.com/7GXXK2G.png) -178px -3px;box-shadow: 0 0 0 1px #0c615a, 0 0 0 2px #497b5c, 0 0 0 3px #1a4c4a;}
  .interface-element-one-item-slot{    background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -800px -79px;}

/*POCZTA*/
  .mails-window .bottom-mail-panel .bottom-panel-graphics{background: url(none);background: #0d2b26; border-top: solid 1px #53e4b1;left: -2px; right: 2px;}
  .mails-window .content-header{background: url(none);background: #0d2b26; border-top: solid 1px #53e4b1;left: -10px;}
  .mails-window .mail-column .middle-graphic{border-image: url(none); border-style:none;}
  .mails-window .new-message .new-message-wrapper .text-area-wrapper textarea {color: #50ca98;background-color: #010e09;}
  .mails-window .how-mail-or-char {color:#a2ffe3; font-family:Futura; font-size:14px;}
  .mails-window .new-message .new-message-wrapper .content-header .to .wrapper-mail-to input{color: #50ca98;background-color: #010e09;}
  .mails-window .new-message .footer .atachments{color: #bfded7;}
  .mails-window .new-message .footer .atachments .foot-item .send-item{background: url(https://i.imgur.com/kBwm4AL.png) no-repeat -800px -79px;}
  #mailnotifier{filter: hue-rotate(101deg) brightness(0.5);}
  .mails-window {width: 440px;min-height: 415px;background-color: #010e09;}
  .border-window{border-image: url(https://i.imgur.com/5afWWAY.png) 32 20 fill repeat;}
  .mails-window .mail-column .scroll-wrapper .scroll-pane .one-mail-wraper{background: url(none);background: #08271ec9;}
  .mails-window .mail-column .scroll-wrapper .scroll-pane .one-mail-wraper .msg-content {color: #47d3ac;border-top: 2px solid #0e4d33;border-bottom: 2px solid #0e4d33;padding-top: 10px; padding-bottom: 8px;min-height: 25px;word-wrap: break-word;}
  .mails-window .mail-column .scroll-wrapper .scroll-pane .one-mail-wraper {position: relative;border-image: none;border: #193f30;border-width: 2px;}
  .mails-window .mail-column .scroll-wrapper .scroll-pane .one-mail-wraper .one-mail-head .from b{color: #02a18b;}
  .from, .when, .small, .a-info{color:#9fe3c7;}
  .border-window .header-label-positioner .header-label {display: inline-block;position: relative;margin: 0 auto;height: 28px;background: none;box-shadow:none;margin-top: 7px;}
  .tabs-nav::before{border-image: url(https://i.imgur.com/TnCqfUA.png) 11 13 fill stretch;}
  .tabs-nav .card.active{background: url(none); background: #406e61; color: #4cfabe; border-radius: 2px; }
  .tabs-nav .card{background: url(none);background: #0d211c;border-radius: 2px; color: #57897e;}

/*ZNAJOMI*/
  .friend-enemy-list .column .scroll-wrapper .scroll-pane .middle-graphics{border-image: url(none);border-style:none;}
  .friend-enemy-list .amound-wrapper{background: url(none);background: #0d2b26;border: solid 1px #0f241d;right: -9px;}
  .friend-enemy-list .amound-wrapper .amound-value{font-size: 1em; color: #b6ffe3; font-family: 'Futura';}
  .friend-enemy-list .bottom-friend-panel{background: url(none);background: #0d2b26;}
  .friend-enemy-list .friend-enemy-cards .card {background: url(none);background: #0d211c;border-radius: 2px; border: solid 1px #104331;color: #57897e;width: 33.3%;height: 34px;}
  .friend-enemy-list .friend-enemy-cards .card.active {opacity: 1;background: url(none); background: #406e61; background-size: 100% 100%;color: #4cfabe; border: solid 1px #4ad1a1; border-radius: 2px; height: 34px;}
  .friend-enemy-list .column .scroll-wrapper .scroll-pane .list .one-person .line{background: url(https://i.imgur.com/2MlAJnZ.png);width: 155px;}
  .friend-enemy-list .header-background-graphic{background:#050a09; height:35px; border-image:url(none); border-style:none;}
  .friend-enemy-list .bottom-friend-panel .input-wrapper .add-person{color: #13ff86;}
  .friend-enemy-list .column{color: #57edd2;}
  .friend-enemy-list .column .scroll-wrapper .scroll-pane .list .one-person .info .online-text.gray{color: #5f8484;}
  .friend-enemy-list .friend-enemy-cards .card:hover .label{color: #4cfabe;}

/*elementy powtarzalne interfejsu*/
  .interface-element-header-1-background-stretch{border-style: none;border-width: 0px 20px;border-image: none;position: absolute;background: #0d2b26; border: solid 1px #53e4b1;width: 99.4%;}
  .interface-element-middle-2-background{border-style: none;border-image: none;background:none;}
  .interface-element-middle-2-background-stretch{border-style: none;border-image: none;background: #0b1210;}
  .interface-element-middle-3-background-stretch{border-style: none;border-image: none;background: none;}
  .interface-element-vertical-wood{background:none;}
  .interface-element-table-header-1-background{background:none;}

/*HANDEL*/
  .trade-window .content .decision .dec-item {position: absolute;font-weight: 700;font-size: 65%;color: #08c583;font-family: 'Futura';}
  .trade-window .content .info .gold-right, .trade-window .content .info .sell, .trade-window .content .info .show {left: 186px;font-family: 'Futura';}
  .trade-window .content .info .buy, .trade-window .content .info .gold-left, .trade-window .content .info .watch {color: #6dffc2;font-family: 'Futura';}
  .trade-window header .h_content{color: #d0f2e9; font-family: 'Futura', sans-serif;}
  .trade-window header .h_background .right {background: url(https://i.imgur.com/AhdRqvQ.png) -91px -2px;}
  .trade-window header .h_background .left {background: url(https://i.imgur.com/AhdRqvQ.png) -38px -2px;}
  .button.cancel-trade {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000;background-image: linear-gradient(to top,#310000, #000806);}
  .trade-window header .h_background .middle{background:url(https://i.imgur.com/tlpZLtf.png);box-shadow:none;}
  .interface-element-border-window-frame{border-image: url(https://i.imgur.com/5afWWAY.png) 32 20 fill repeat;}
  .trade-window .interface-element-middle-3-background-stretch{background: #061411;}
  .interface-element-background-color-2{background:none;}
  .trade-window .content .hero-show-item, .trade-window .content .other-watch-item{background:none;}
  .trade-window .content .buy, .trade-window .content .sell, .trade-window .content .show, .trade-window .content .watch{background:none;}
  .trade-window .content .prize .hero-prize{background:#0a3228;}
  .trade-window .content .credits-left, .trade-window .content .credits-right, .trade-window .content .gold-left, .trade-window .content .gold-right{background:#0a3228;}
  .trade-window .content .info .label{color: #6dffc2;}
  .trade-window .content .hero-credits, .trade-window .content .other-credits{background:#0a3228;}
  .trade-window .content .prize .other-prize{background:#0a3228;}
  .border-window.mAlert .paper-background, .border-window.mAlert-mobile-layer .paper-background{background: #0b1210;}

/*PokojeOkno*/
  .interface-element-table-3 .table-header-tr td{border: 1px solid #53e4b1;background: #0d2b26;}
  .interface-element-table-3 td{border: 1px solid #53e4b1;}

/*MINIMAPA*/
  .border-window.transparent .border-image{background: rgba(47,79,67,.3); box-shadow: 0 0 0 1px #000000, 0 0 0 2px #61f4c1, 0 0 0 3px #059e68, 2px 2px 3px 3px #00000085;}
  .border-window .header-label-positioner .header-label .text{color: #43f5c7;}
  .border-window.transparent .search-wrapper::before{background: url(https://i.imgur.com/W3zdTf7.png) -681px -162px no-repeat;}
  .border-window.transparent .search-wrapper .search{color: #43d099;}
  .border-window .increase-opacity, .dialogue-window .increase-opacity{background: url(https://i.imgur.com/W3zdTf7.png) -725px -131px;}
  .settings-button{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -607px -117px;}
  .toggle-size-button{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -465px -399px;}
  .border-window .increase-opacity:hover,.dialogue-window .increase-opacity:hover {background: url(https://i.imgur.com/W3zdTf7.png) -725px -146px;    filter: brightness(1.3);}
  .toggle-size-button:hover {background: url(https://i.imgur.com/W3zdTf7.png) -433px -399px;}
  .settings-button:hover { background: url(https://i.imgur.com/W3zdTf7.png) -659px -117px;}
  .layer.interface-layer .mini-map .mini-map-panel{background: url(none);background: #010e09;border: solid 1px #1c6b66;width: 250px;height: 35px;}
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .search-wrapper{filter:brightness(0.5);}
  .layer.interface-layer .mini-map .mini-map-map .graphic {border-image: url(https://i.imgur.com/Mgjx5HO.png) 0 11 fill repeat; background-size:contain;}
  .quest-box .info-wrapper .quest-title{color: #ffffff; font-family: 'Futura';}
  .quest-box .quest-content span {color: #e5e5e5;}
  .border-window.transparent[data-opacity-lvl="5"] .border-image, .dialogue-window[data-opacity-lvl="5"] .border-image {background: #15221c;}
  .border-window .bottom-bar {background: url(none);background: #0d2b26; border-top: solid 1px #53e4b1;}
  .table-with-static-header .table-with-static-header-header .table-with-static-header-header-td, .table-with-static-header .table-with-static-header-table .table-with-static-header-header-td{border: 1px solid #53e4b1;background: #03251b;}
  .table-with-static-header .scroll-table-plug{border: 1px solid #0befc6;background: #03251b;}
  .table-with-static-header .table-with-static-header-header .table-with-static-header-td, .table-with-static-header .table-with-static-header-table .table-with-static-header-td{border: 1px solid #53e4b1;}
  .table-with-static-header .table-with-static-header-header tr:nth-of-type(2n+1) .table-with-static-header-td, .table-with-static-header .table-with-static-header-table tr:nth-of-type(2n+1) .table-with-static-header-td{background: rgb(34 83 71 / 50%);}
  .text-and-input .input-wrapper .input, .text-and-input .text {color: #6bffc6;}
  .text-and-input .input-wrapper input {border: 1px solid #53e4b1;color: #87c6b0;}
  .divide-and-color-edit .middle-graphic{border-image:url(none);border-style:none;}



/*NEWSY*/
  .news-panel .news-content .section-header{background: url(none); color:#30F8FF;}
  .news-panel .middle-graphics{border-image: url(none) 10 fill round;}
  .news-panel .news-content .crazy-bar {background: url(none);}
  .news-panel .news-content .left-arrow, .news-panel .news-content .left-news-btn{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -641px -313px;}
  .news-panel .news-content .right-arrow, .news-panel .news-content .right-news-btn{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -618px -313px;}
  .news-panel .news-content .right-arrow:hover, .news-panel .news-content .right-news-btn:hover{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -668px -313px;}
  .news-panel .news-content .left-arrow:hover, .news-panel .news-content .left-news-btn:hover{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -691px -313px;}

/*swiat*/
  .players-online__items-container{width: 99.5%;}
  .world-window__info{background: #000d0e;border: 1px solid #052d20;}
  .world-window .filter-label, .world-window .legend, .world-window .start-lvl, .world-window .stop-lvl{color:white;}
  .world-window .filter-label {color:#36fabf;}
  .players-online__item {border: 1px solid #0befc6a3;}
  .hunting-statistics-table td, .hunting-statistics-table-header td{border: 1px solid #0befc6a3;}
  .hunting-statistics-table th, .hunting-statistics-table-header th{border: 1px solid #0befc6a3;background: #03251b;}
  .location-parameters__item, .server-parameters__item{border: 1px solid #0befc6a3;}
  .location-parameters__item-value, .server-parameters__item-value{border-left: 1px solid #0befc6a3;}
  .world-window .start-lvl input, .world-window .stop-lvl input{color: #30F8FF;}
  .world-window .start-lvl input, .world-window .stop-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .world-window .start-lvl input, .world-window .start-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .scroll-auction-plug{border: 1px solid #0befc6a3;background: #03251b;}
  .c-table table th:first-child{border: 1px solid #0befc6a3;background: #03251b;}
  .activities .c-table thead th:nth-child(2){border-top: 1px solid #0befc6a3;border-bottom: 1px solid #0befc6a3;border-right: 1px solid #0befc6a3;background: #03251b;}
  .c-table table td:first-child{border-left: 1px solid #54a798;}
  .c-table table td{border-right: 1px solid #54a798;}
  .c-table table td, .c-table table th{color: #4ffff0;}
  .activities .c-table .inactive{color: #6d8a8d;}
  .activities .c-table .is-done{color: #579f99;}

/*PRAWY KLIK MENU*/
  .popup-menu {box-shadow: 0 0 0 1px #00613c inset, 0 0 0 1px #19b189b0, 0 0 0 2px #000000; background-color: #00382a;}
  .popup-menu .menu-item{background-color: #02302654;color: #bbffed;border: 1px solid #00bd92;}
  .popup-menu .menu-item:hover:not(.label):not(.disabled):not(.cooldown-disabled):not(.one-step-skill-menu) {border: 1px solid #83e7d1;background-color: #2c8c74;transition: .2s;}
  .popup-menu .menu-item.cooldown-disabled {cursor: url(https://i.imgur.com/sALzCQs.png),url(https://i.imgur.com/sALzCQs.png),auto;background-color: #202525;border: solid 1px #ee2588;color: #ee2588;}
  .cooldown{color: #c0fff1;}
  .bottomItem .amount, .item .amount{background: rgb(20 160 89 / 75%);border: 1px solid rgb(37 237 255);color:#8af9bc;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .popup-menu .menu-item.disabled{    background-color: #202525;border: solid 1px #ee2588;color: #ee2588;}

/*Mapa Duza*/
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .search-wrapper{border-image: url(https://i.imgur.com/O5DbfFb.png) 5 9 23 34 fill;width: 199px;left: -2px;}
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .scroll-wrapper.scrollable .scroll-pane, .layer.interface-layer .mini-map .mini-map-content .mini-map-local-content .scroll-wrapper.scrollable .scroll-pane{width: 228px;}
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .scroll-wrapper .scroll-pane, .layer.interface-layer .mini-map .mini-map-content .mini-map-local-content .scroll-wrapper .scroll-pane{border-image: url(none);border-style: none;background: #010e09;border: solid 3px #1c6b66;}
  .layer.interface-layer .mini-map .mini-map-content .mini-map-global-content .scroll-wrapper .scroll-pane .one-location-on-list{color: #33cabc;}

/*WALKA*/
  .battle-window .one-warrior .warrior {position: absolute;text-align: center;filter: drop-shadow(0px 0px 4px #1be3b8);}
  .battle-window .battle-background {filter: brightness(0.5);}
  .battle-controller .skill-hider {background: #010e09;width: 510px;left: 10px;}
  .battle-controller .battle-content .time-wrapper .time-progress-bar::after{border: 1px solid #004945; background: #00172b; box-shadow: inset 1px 1px 1px 1px rgb(0 0 0 / 44%);}
  .bottom-panel .battle-bars-wrapper .battle-bar.mana .background{filter:brightness(0.5);}
  .bottom-panel .battle-bars-wrapper .battle-bar .background{filter: brightness(0.5);background:none;}
  .bottom-panel .battle-bars-wrapper .battle-bar .overlay{filter:brightness(0.5);background:none;}
  .bottom-panel .battle-bars-wrapper .battle-bar.mana .overlay{filter:brightness(0.5);}
  .bottom-panel .battle-bars-wrapper .battle-bar.energy .bar-overflow .inner{background: linear-gradient(to right, #131311, #ffea43 90%, transparent);}
  .battle-controller .battle-content .time-wrapper .time-progress-bar .time-inner{background-color: #00a8f3;}
  .bottom-panel .battle-bars-wrapper .battle-bar.mana .values{right: auto;background: radial-gradient(#30f8ff, #53e4b1a6);left: 200px;font-size: 10px;font-family: 'Futura';font-weight: 300;color: white;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;border:solid 1.5px #22be9229;border-radius: 50%;width: 45px;line-height: 20px;box-shadow: 0 0 5px 5px #42dfff96;;top: 2px;}
  .battle-msg.neu {background: linear-gradient(90deg,#2f2f2f 1%,#494949 49%,#0e0e0e 100%);}
  .bottom-panel .battle-bars-wrapper .battle-bar .values{position: absolute;   right: 200px;text-align: center;background: radial-gradient(#e5cc2d, #fff79ba6);font-size: 10px;font-family: 'Futura';font-weight: 300;color: white;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;border: solid 1.5px #c9cd2f29;border-radius: 50%;width: 45px;line-height: 20px;box-shadow: 0 0 5px 5px #fff98b96;top: 2px;}
  .battle-msg.attack {background: linear-gradient(90deg,#002d5b 1%,#003b5f 49%,#001016 100%);}
  .battle-msg.attack2 {background: linear-gradient(90deg,#370001 1%,#690001 49%,#270100 100%);}
  .bottom-panel .battle-bars-wrapper .battle-bar .bar-overflow{left: 38px;transform: scaleX(-1);}
  .battle-controller .battle-watch{color:#52fffd;}
  .battle-controller .battle-content .time-wrapper .seconds{color:#52fffd;}
  .battle-msg.txt {background-color: rgb(34 64 51 / 70%);}
  .battle-skill .background {filter: grayscale(1) brightness(0.65);}
  .battle-msg{background-color: rgb(34 64 51 / 70%);}
  .battle-controller .battle-content .right-column .battle-end-layer{color: #17f6d8;}
  .turn-prediction__item:first-child{border-color: #2ad5a7;}
  .turn-prediction__name--green{color: #44fec6;}
  .bottom-panel .battle-bars-wrapper .battle-bar.mana .bar-overflow .inner{background: linear-gradient(to right, black, #35d1c4 90%, transparent);transform: scaleX(-1);}
  .bottom-panel .battle-bars-wrapper .battle-bar.mana .bar-overflow{transform: scaleX(-1);left: 62px;}
  .battle-controller .toggle-battle.show-more{background: url(https://i.imgur.com/aRnc85W.png) no-repeat -845px -122px;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .battle-controller .battle-content .surrender{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background: url(https://i.imgur.com/aRnc85W.png) no-repeat -857px -907px;}
  .battle-controller .battle-content .surrender:hover {background: url(https://i.imgur.com/aRnc85W.png) no-repeat -857px -941px;}
  .battle-controller .graphics .battle-border{border-image: url(https://i.imgur.com/5afWWAY.png) 32 20 fill repeat;}
  .interface-element-middle-4-background{border-style:none;}
  .bottom-panel-of-bottom-positioner .battle-bars-wrapper .battle-bar.mana .background{background: none;}
  .bottom-panel-of-bottom-positioner .battle-bars-wrapper .battle-bar.mana .overlay{background: none;}
  .bottom-panel-of-bottom-positioner .battle-bars-wrapper .battle-bar.energy .background{background: none;}
  .bottom-panel-of-bottom-positioner .battle-bars-wrapper .battle-bar.energy .overlay{background: none;}



/*PREMIUM*/
  .pre-premium-panel .chests-bottom-panel{background: #0d2b26;border: solid 1px #53e4b1;left: -11px;right: -11px;}
  .pre-premium-panel .brown-background{border-image: url(https://i.imgur.com/Mgjx5HO.png) 0 11 fill repeat;}
  .pre-premium-panel .tiles-wrapper {filter:grayscale(1) brightness(0.5);}
  .premium-panel .premium-bottom-panel{background: #0d2b26;border: solid 1px #53e4b1;left: -11px;right: -11px;}
  .premium-panel .premium-graphic {border-image: url(https://i.imgur.com/Mgjx5HO.png) 0 11 fill repeat;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.chest {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -2px -2px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.upgrades {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -93px -2px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.stamina {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -2px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.gold-shop {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -275px -2px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item {background: url(https://i.imgur.com/gr3ypUN.png);}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.boots {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -2px -93px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.helmets {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -93px -93px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.gloves {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -93px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.armor {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -275px -93px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.necklaces {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -2px -184px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.rings {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -93px -184px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.arrows {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -184px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.teleports {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -275px -184px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.consumtable {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -2px -275px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.pets {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -93px -275px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.outfits {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -275px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.bags {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -275px -275px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.potions {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -2px -366px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.ornamentation {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -93px -366px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.sales {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -366px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.blessing {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -275px -366px;}
  .premium-panel .product-kind .premium-item-wrapper .premium-item.for-you {background: url(https://i.imgur.com/gr3ypUN.png) no-repeat -184px -184px;}
  .chests-window .chests-bottom-panel{background: #0d2b26;border: solid 1px #53e4b1;left: -11px;right: -11px;}
  .chests-window .brown-background{border-image: url(https://i.imgur.com/Mgjx5HO.png) 0 11 fill repeat;}
  .chests-window .chests-choice-wrapper{filter:grayscale(1) brightness(0.5);}
  .chests-window .chests-bottom-panel .info-wrapper .info-label{color: #ffffff; font-family: 'Futura';}
  .shop-wrapper .shop-content .show-items-filter .wrapper {color: #30F8FF;}
  .gold-shop .scroll-wrapper .scroll-pane .middle-graphics{background: url(none);}
  .gold-shop .footer .bottom-panel-graphics{background: #0d2b26;border: solid 1px #53e4b1;left: -3px;right: 1px;}
  .shop-wrapper .shop-content .shop-bottom-panel .chest-wrapper .chest.sl{background: url(none);}
  .gold-shop .footer .chest-graphic{background: url(none);}
  .chests-window .chests-bottom-panel .chest-wrapper .chest{background: url(none);}
  .premium-panel .premium-bottom-panel .chest-wrapper .chest{background: url(none);}
  .one-offer{filter: grayscale(1) brightness(0.45);}
  .gold-shop .footer .table-wrapper .sl-label{color: white;}
  .stamina-shop .footer .bottom-panel-graphics{background: #0d2b26;border: solid 1px #53e4b1;left: -3px;right: 1px;}
  .stamina-shop .background-graphic{border-image: url(none) 0 11 fill round;border-color: #0a1311;}
  .stamina-shop .description{color: white;}
  .stamina-shop .one-day .but, .stamina-shop .one-day .info-label, .stamina-shop .one-month .but, .stamina-shop .one-month .info-label, .stamina-shop .one-week .but, .stamina-shop .one-week .info-label{color: white;}
  .stamina-shop .footer .table-wrapper .sl-label{color: white;}
  .stamina-shop .yellow{color: #00c2ff;}
  .shop-wrapper .shop-content .for-you-plug{    background: url(https://i.imgur.com/W3zdTf7.png) 1px -709px;top: 93px;left: 294px;}
  .stamina-shop .footer .chest-graphic{background: url(none);}

/*odzyskiwanie*/
  .recovery-item .scroll-wrapper .scroll-pane .middle-graphics{background: url(none);}
  .recovery-item .info-3{background: url(none);background: #0d2b26;border: solid 1px #53e4b1;left: -11px;}
  .recovery-item .recover-bottom-panel{background: url(none);background: #0d2b26;border: solid 1px #53e4b1;left: -11px;}
  .recovery-item .info-2{background: none;color: #47ffc1;}
  .recovery-item .scroll-wrapper .static-bar-table .table-header{background: #0b1c1a;color: #30F8FF;}
  .recovery-item .info-1, .recovery-item .info-2, .recovery-item .info-3{color: #30F8FF;}
  .recovery-item .scroll-wrapper .static-bar-table .table-header td{border: solid 1px #176f63;}
  .recovery-item .info-2{background: url(none) -4px 0;}
  .recovery-item .scroll-wrapper.scrollable .scroll-pane .paper-graphics{right: 12px;border-image: none;border-style: none;background: none;}
  .recovery-item .scroll-wrapper .scroll-pane .recovery-items-table tr td{height: 46px;border: solid 1px #176f63;vertical-align: middle;}
  .recovery-item .info-label{color: #30F8FF;}
  .recovery-item .recover-bottom-panel .chest-wrapper .chest{background:none;}

/*USTAWIENIA*/
  .settings-window h2 {background: url(none);color: #8dffe6;font-family: Futura;background: #0d2b26;border: solid 1px #53e4b1;}
  .settings-window .section .scroll-wrapper .scroll-pane .graphic-background{border-image: url(none);border-style:none;}
  .button .label, .widget-button .label{color:white;}
  .cards-header-wrapper .cards-header .card.active {background: url(none);background: #406e61 !important;background-size: 100% 100%;color: #4cfabe !important;border: solid 1px #4ad1a1 !important;border-radius: 2px !important;width: 33%;}
  .settings-window .notifications-config .scroll-wrapper .scroll-pane .display-table .middle .loudly-panel .center .slider-wrapper .volumeSlider .marker{border: 1px solid #00bd9a; background: #000000;}
  .settings-window .section .scroll-wrapper .scroll-pane{color: #57bc95;}
  .settings-window .hot-keys-config .scroll-wrapper .scroll-pane .hot-keys-list{border: 1px solid #53e4b1;}
  .settings-window .hot-keys-config .scroll-wrapper .scroll-pane .hot-keys-list tr:nth-of-type(2n+1){background: rgb(44 83 70 / 50%);}
  .settings-window .hot-keys-config .scroll-wrapper .scroll-pane .hot-keys-list tr td{border-right: 1px solid #53e4b1;border-bottom: 1px solid #53e4b1;}
  .checkbox{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -484px -94px;}
  .checkbox.active{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -503px -94px;}
  .settings-window .hot-keys-config .scroll-wrapper .scroll-pane .hot-keys-list{color:#30F8FF;}
  .button .add-bck, .widget-button .add-bck{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat;}
  .settings-window .notifications-config .scroll-wrapper .scroll-pane .all-notification .sound-notif:hover{background-color: rgb(75 138 138 / 10%);}


/*Captcha*/
  .captcha__triesleft{color:#42ffe5;}
  .captcha__question{color: #42ffe5;}
  .captcha__image{border: 1px solid #42ffe57d;}
  .captcha-pre-info {border-style: solid;border-radius: 2px;pointer-events: none;background: #72dbb263;box-shadow: 0 0 11px 1px #50ebc4;padding: 10px 0;text-align: center;color: #5bfff7;text-shadow: 1px 1px 1px #000;position: relative;border: 1px solid #41d2a8;font-family: 'Futura';font-size: 11px;}
  .captcha-pre-info__toggler {width: 52px;height: 18px;box-shadow: 0 0 13px 1px #50ebc4;border-radius: 0 0 15px 15px;position: absolute;bottom: -20px;left: 0;right: 0;margin: 0 auto;background: #72dbb263;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}

/*heros detektor*/
  .heros-detector{color: #30F8FF;}
  .copy-btn{background: url(https://i.imgur.com/W3zdTf7.png) -772px -202px;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}

/*zegar*/
  .window-clock .clock{color: #77ffdb;}

/*Kalendarz*/
  .rewards-calendar{color: #9fffdd;}

 /*UMKI*/
  .skills-window .right-column .points-header-wrapper .skills-points-wrapper .skills-points-description {font-family:Futura; font-size:22px;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .stats-wrapper .all-stats .skill-stat .compare span {color: #00ffb3;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .stats-wrapper .all-stats .skill-stat .first {color: #03fc88;}
  .skills-window .right-column .scroll-wrapper.scrollable {padding-right: 15px;backdrop-filter: blur(4px);}
  .skills-window .left-column .middle-graphic, .skills-window .right-column .middle-graphic{border-image: url(https://i.imgur.com/ybK7dAX.png) 0 11 fill round;}
  .skills-window .bottom-part .bottom-panel-graphics{    border-image: url(none) 0 59 fill stretch;background: #0d2b26;border: solid 1px #53e4b1;left: -3px;right: 1px;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .empty .info1, .skills-window .right-column .scroll-wrapper .scroll-pane .empty .info2 {margin-bottom: 15px;color: #0a7a55; text-shadow: 1px 1px #067a61;}
  .button.purple, .button.violet, .widget-button.purple, .widget-button.violet {background-image: linear-gradient(to top, #212725, #106e57c2);box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #68bd95e3;}
  .skills-window .right-column .maku-wood{background:none;}
  .extended-stats .scrollbar-wrapper .background{background: url(https://i.imgur.com/vsRxaTr.png) repeat;}
  .skills-window .right-column .points-header-wrapper{border-image: url(none);border-style: none;background: #0d2b26;border: solid 1px #53e4b1;height: 35px;}
  .skills-window .left-column .list-label-wrapper .list-border{border-image: url(none);border-style: none;background: #0d2b26;border: solid 1px #53e4b1;height: 30px;top: 0px;}
  .skills-window .left-column .list-label-wrapper .list-label .label {color: #a4f5f4; font-family: 'Futura', sans-serif;}
  .skills-window .right-column .points-header-wrapper .skills-points-wrapper .skills-points {color:#a4f5f4;font-weight: 900;font-size: 1.5em;}
  .skills-window .left-column .skills-wrapper .description-wrapper{border-image: url(none);border-style: none;background: #053c37;border: solid 1px #2a7e61;width: 325px;height: 16px;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .board-graphic{border-style:none;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .stone{border-image: url(none);border-style: none;background: #0d2b26;filter: drop-shadow(2px 4px 6px black);}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .header .right-wrapper .name{color: #30F8FF;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .header .right-wrapper .description{color: #43c1c1;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .stats-wrapper .stats-h{color: #30F8FF;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .requirements-wrapper{color: #30F8FF;}
  .skills-window .right-column .scroll-wrapper .scroll-pane .description-wrapper .skill-description .board-wrapper .board-graphic{border-image:none;}
  .skills-window .bottom-part .MB-wrapper .MB-label-2{color: #13ecab; font-family: 'Futura', sans-serif;}
  .game-window-positioner .character_wrapper .stats-wrapper .header-title{font-family: 'Futura', sans-serif; border:1px solid #003b29;color: #4deab4;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list li .icon{background: url(https://i.imgur.com/W3zdTf7.png);}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.green{color: #57f488;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.blue{color: #8adae9;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.yellow{color: #f4fd5d;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list .stat.red{color: #f42077;}
  .game-window-positioner .character_wrapper .stats-wrapper .stats-list li .value{color: #2bdcbc;}
  .skill .label-wrapper{color: #30F8FF;}
  .clickable:hover {background-color: #00b0d326;}
  .MBEditor .buttons-wrapper{background:none;}
  .MBEditor .skills-list .single-skill-row.usable {border-color: #53e4b1;color: #34feda;font-weight: 700;font-family: 'Futura', sans-serif;backdrop-filter: blur(2px);}
  .MBEditor .buttons-wrapper .checkbox-wrapper .mb-label, .MBEditor .buttons-wrapper .clear-btn .mb-label, .MBEditor .buttons-wrapper .close-btn .mb-label, .MBEditor .buttons-wrapper .save-btn .mb-label{color:#3dffbe;}
 
  .battle-skill .background{filter: grayscale(1) brightness(0.5);}
  .skills-window .left-column .skills-wrapper .description-wrapper{font-family: 'Futura', sans-serif;font-size: 15px;color:#13ffb0;}
  .additional-skill-panel .header-tip{color:#00ffbd;}
  .button .label .small-money{filter:grayscale(0.3) brightness(0.5);}
  .button .label .small-draconite{filter:grayscale(0.3) brightness(0.5);}
  .MBEditor .skills-list .single-skill-row.usable:hover{background: #003b5936;}
  span.reset {color: white;}
  span.learn{color:white;}
  .skill .label-wrapper.chosen .label-background {color: #fff;}
  .skill .label-wrapper.cl-6 .label-background {background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -850px -247px;}
  .MBEditor .skills-list .single-skill-row.usable .number{border-color: #53e4b1;}
  .skills-window .right-column .points-header-wrapper .skills-points-wrapper{top: 9px;color: #a4f5f4;}
  .skills-window .left-column .list-label-wrapper .list-label{top: 7px;}
  .skill .icon-background{background: #336256;border: 1px solid #53e4b1;}
  .skill.chosen .icon-background{box-shadow: inset 0 0 8px 2px #294540;background: #76e0b8;}
  .skills-window .bottom-part .free-skills-label{color: #27deff;}
  .additional-skill-panel .graphics .additional-skill-panel-border{border-image: url(https://i.imgur.com/5afWWAY.png) 32 20 fill repeat;}
.additional-skill-panel{background: #0b1210;}


/*DEPOZYT*/
  .depo .bottom-section .cards-menu .card .amount{background: rgb(94 179 154 / 50%);border: 1px solid rgb(41 126 85 / 50%);color: #c1f8ff;}
  .depo .bottom-bar .start-lvl input, .depo .bottom-bar .start-lvl input{color:#30F8FF;}
  .depo .bottom-bar .start-lvl input, .depo .bottom-bar .start-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .depo .bottom-bar .start-lvl input, .depo .bottom-bar .stop-lvl input{color:#30F8FF;}
  .depo .bottom-bar .start-lvl input, .depo .bottom-bar .stop-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .depo .bottom-bar .filter-label{color: #30F8FF;}
  .search-wrapper .search::-webkit-input-placeholder{color:#30f8ff;}
  .depo .depo-graphic-background {border-image: url(none) 0 11 fill repeat;}
  .depo .find-and-manage-money-section .right-part .money-info{border-image: url(none);border-style: none;border: solid 1px #53e4b1;top: 2px;right:1px;}
  .depo .find-and-manage-money-section .left-part .manage-money-wrapper .manage-money-wrapper-graphic {border-image: url(none);border-style: none;top: 2px;border: solid 1px #53e4b1;}
  input.default2 {border-image: url(https://i.imgur.com/HBmt3wu.png) 1 1 1 1 fill;}
  .depo .bottom-section .cards-menu .card:not(.disabled).active::before{border-image: url(none);border-style: none;background: #406e61;color: #4cfabe;border: solid 1px #4ad1a1;border-radius: 2px;}
  .depo .bottom-section .cards-menu .card::before{border-image: url(none);border-style: none;background: #0d211c;border-radius: 2px;border: solid 1px #104331;color: #57897e;}
  .depo .filter-section .filter-section-graphic {background:none;}
  .depo .bottom-section .cards-menu .card .label .number {font-family:Futura;}
  .depo .bottom-bar .available-slots {color: #66ffb7; font-family: Futura; font-size: 16px;}
  .depo .find-and-manage-money-section .right-part .date-available, .depo .find-and-manage-money-section .right-part .date-value, .depo .find-and-manage-money-section .right-part .gold-amound, .depo .find-and-manage-money-section .right-part .gold-value{color:#30f8ff; font-size: 13px !important; font-family: Futura;}
  ::placeholder {color:white;}
  .depo .bottom-section .cards-menu .cards-background{filter:brightness(0.5);}
  .depo .find-and-manage-money-section .left-part .manage-money-wrapper .payments-bar-wrapper .price-wrapper .price::-webkit-input-placeholder{color:#30f8ff; font-family:Futura;}
  .depo .find-and-manage-money-section .left-part .manage-money-wrapper .payments-bar-wrapper .price-wrapper .price{color: #30f8ff;font-family: Futura;}
  .alerts-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option, .console-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option, .mAlert-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option
  {background-color: #155137bf;color: #9efffa;border: 1px solid #208264;}
  .alerts-layer .scroll-wrapper.menu-wrapper, .console-layer .scroll-wrapper.menu-wrapper, .mAlert-layer .scroll-wrapper.menu-wrapper, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper{box-shadow: 0 0 0 1px #2fc8a2 inset, 0 0 0 1px #1af2cfb0, 0 0 0 2px #000000;background-color: #2de9e6;}
  .alerts-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option:hover:not(.disabled), .console-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option:hover:not(.disabled), .mAlert-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option:hover:not(.disabled), .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .wrapper .bck-wrapper .option:hover:not(.disabled)
  {border: 1px solid #49ffc6; background-color: #38c59f; transition: .2s; color:white;}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-up
  {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .arrow-down
  {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .alerts-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .console-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .mAlert-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle, .mAlert-mobile-layer .scroll-wrapper.menu-wrapper .scrollbar-wrapper .track .handle
  {background-image: url(https://i.imgur.com/0upYxzS.png);}
  .depo .bottom-section .cards-menu .card .label .k-b{filter:grayscale(1);}

/*DODATKI*/
  .addons-panel .right-column .middle-right-column-graphics{background: url(none);}
  .addons-panel .left-column .main-header .addon-list-label{position: absolute;top: 7px;left: 10px;color: #2fe4a6;font-size: 17px;background: #010e09;font-family: 'Futura';border: solid 1px #00ffdb;box-shadow: inset 0px 0px 3px 2px #319d74;border-radius: 8px;justify-content: center;display: flex;align-items: center;text-shadow: 0 0 4px #34abf0;width: 230px;height: 30px;}
  .addons-panel .right-column .paper-graphics{border-image: url(none);border-style:none;}
  .addons-panel .right-column .addon-header .img-wrapper .border-blink{box-shadow: 0 0 6px 3px #015285;animation: blinker 4s linear infinite;}
  .addons-panel .left-column .middle-left-column-graphics{background: url(none);}
  .addons-panel .left-column .bottom-left-column-graphics{background: url(none);}
  .one-addon-description .description-label{color: #49d7a7;}
  .one-addon-description .description-text{color: #98f0d2;}
  .one-addon-description .drag-info{color: #98f0d2;}
  .one-addon-on-list .title-wrapper{color: #24ffbd;}
  .one-addon-on-list .title-wrapper:hover{color:#adfffb;}
  .one-addon-on-list:hover {background: #276f6c;}
  .search-wrapper .search-x{cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;background: url(https://i.imgur.com/W3zdTf7.png) -624px -117px;}
  .addons-panel .left-column .left-scroll .scrollbar-wrapper{top:3px;}
  .search-wrapper .search{color: #65e9bc;}
  .addons-panel .left-column .main-header{left: 0;right: 10px;height: 60px;width: 546px;background: url(none);border: solid 1px #53e4b1;}

/*OTCHLAN*/
  .matchmaking-summary .summary-content .wood-bar{border-image: url(none) 3 3 fill stretch;}
  .matchmaking-summary .middle-graphics{background: url(none);background-size: contain;}
  .matchmaking-summary .bottom-panel-graphics{border-image: none;border-style: none;background: #0d2b26;border-top: solid 1px #53e4b1;}
  .matchmaking-panel .bottom-panel-graphics{background: url(none);background: #0d2b26;border-top: solid 1px #53e4b1;}
  .matchmaking-panel .middle-graphics{border-image: url(https://i.imgur.com/Mgjx5HO.png) 10 fill round;}
  .stats-and-history .season-wnd .middle-wood{background: url(none);}
  .stats-and-history .season-wnd .season-header{border-image: url(none);border-style: none;background: #0d2b26;height: 13px;color: aquamarine;text-align: center;display: flex;align-content: center;align-items: center;justify-content: center;border: solid 1px #53e4b1;left: -8px;}
  .stats-and-history .season-wnd .reward-wrapper .rage-wrapper{background: url(https://i.imgur.com/Qi6bmln.png) 0 -637px;}
  .stats-and-history .section .history-bottom-panel .input-wrapper .default{border: 1px solid #006b83; color: white; font-family: Futura; font-weight: bold;}
  .stats-and-history .progress-wnd .left-side .char-info, .stats-and-history .progress-wnd .left-side .char-prof, .stats-and-history .progress-wnd .left-side .tokens-amount{color: #ffffff; font-family: Futura; font-size: 14px;}
  .matchmaking-progress-stage .points-side .ratio{color:#51e2fd;}
  .matchmaking-progress-stage .bar-and-item-side .progress-bar{filter: hue-rotate(45deg) brightness(0.5);}
  .matchmaking-progress-stage .points-side .stage {color: #00ffbc; font-family:Futura;}
  .matchmaking-panel .all-pages .main-wnd .section table td {color:#22fff4;border: 1px solid #53e4b1;}
  .stats-and-history .section .history-table .result-win {color: #0bda79;font-family: 'Futura';}
  .stats-and-history .section .history-table .result-lose{font-family:'Futura';color: #d30a53e3;}
  .stats-and-history .section .history-bottom-panel .button .label{color:white;}
  .matchmaking-ranking .section .ranking-bottom-panel .input-wrapper .default{border: 1px solid #006560; color: white; font-family:Futura;}
  .tw-list-item {background: rgb(72 83 80 / 35%); box-shadow: 0 0 0 1px rgb(0 75 121 / 23%) inset, 0 0 0 1px rgb(0 226 141 / 55%); transition: .3s;}
  .tw-list-item:hover{background: rgb(18 173 134 / 42%);}
  .matchmaking-ranking .cards-header-wrapper .header-background-graphic{display:none;}
  .matchmaking-ranking .cards-header-wrapper .cards-header {position: absolute;top: 2px;left: 5px;right: 0px;bottom: 0;}
  .cards-header-wrapper .header-background-graphic {border-image: url(none);border-style: none;}
  .stats-and-history .cards-header-wrapper .cards-header .card{width: 24.62%;height: 35px;}
  .matchmaking-tile{filter: hue-rotate(156deg);}
  .matchmaking-ranking .cards-header-wrapper .cards-header .card{width: 32.5%;background: url(none);color: #57897e;background: #0d211c;border: solid 1px #104331;}
  .layer.interface-layer .positioner.top .matchmaking-timer{top:58px; }
  .stats-and-history .season-wnd .season-bottom-panel .your-records{color: #26de97;}
  .stats-and-history .season-wnd .reward-wrapper .rage-wrapper .place.place-1{color: #dac110c7;}
  .stats-and-history .season-wnd .reward-wrapper .rage-wrapper .place{color: #5bf4e5;}
  .stats-and-history .season-wnd .reward-wrapper .rage-wrapper .place.place-4-10{color: #5bf4e5;}
  .stats-and-history .season-wnd .winners-wrapper .header-info{color: #48ebe2;}
  .stats-and-history .season-wnd .winners-wrapper .txt-info{color: #57b48c;}
  .matchmaking-panel .all-pages .main-wnd .section table .hover-tr:hover{background: #3c705dc4;height:35px;bottom: -24px;}
  .stats-and-history .section .stats-bottom-panel .stats-info{color: #93ffe7;}
  .divide-panel .left-column .middle-left-column-graphics{border-image: url(none);border-style: none;}
  .divide-panel .left-column .top-left-column-graphics{border-image: url(none);border-style: none;background: #0d2b26;border: solid 1px #53e4b1;height: 30px;width: 310px;left: 20px;}
  .divide-panel .right-column .location-graphics{border-image: url(none);border-style: none;background: #0d2b26;border: solid 1px #53e4b1;height: 53px;}
  .divide-panel .right-column .middle-graphics {border-image: url(none);border-style: none;}
  .divide-panel .bottom-part .bottom-panel-graphics {border-image: url(none);border-style: none;background: #0d2b26;border-top: solid 1px #53e4b1;width: 99.9%;left: -2px;}
  .divide-panel .left-column .bottom-left-column-graphics{background: url(none);background: #15433991;border-right: solid 1px #35c7a6; border-bottom: solid 1px #35c7a6;bottom: -2px;}
  .tp-scroll .right-column .right-column-header .city-name{color:#90ffd8;}
  .cards-header-wrapper .cards-header .card{display: inline-block;background: none;background-size: 100% 100%;color: #57897e;text-align: center;line-height: 33px;border: solid 1px #104331;background: #0d211c;border-radius: 2px;}
  .season-reward-main .txt-info, .season-reward-main .your-place{color: #8fd8fb;}
  .season-reward-main .your-place .color-place{color: #fff18f;}
  .matchmaking-ranking .section .ranking-bottom-panel .page-info{color: #6affe4;}


/*RZEMIOSLO*/


  .enhance__item{background: url(https://i.imgur.com/W3zdTf7.png) -51px -444px;filter: brightness(0.5);}
  .enhance__progressbar{filter:brightness(0.8);}
  .enhance__reagents{background: url(https://i.imgur.com/JJceqPN.png) no-repeat -178px -3px; box-shadow: 0 0 0 1px #070807, 0 0 0 2px #003535, 0 0 0 3px #070807;}
  .enhance__label{border: 1px solid #005f69;box-shadow: 0 2px 0 -1px #00391b;background: #012e1d;color: #3bffc4;}
  .enhance__progress--preview {background: #00d188;}
  .enhance__info{border: 1px solid rgb(0 240 156 / 42%);background:rgb(7 83 62 / 32%);color:#00ffbd;}
  .info-box{border: 1px solid #53e4b1;background: #0d2b26;color: #84fcdd;}
  .enhance__progress-bg{background: url(https://i.imgur.com/rkDg8oN.png) 0 -104px;}
  .enhance__progress--current{background: #00fed4;}
  .enhance__limit{color: #3bffc4;}
  .button .add-bck, .widget-button .add-bck{background:url(https://i.imgur.com/W3zdTf7.png);}
  .item-slot{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -800px -79px;}
  .crafting-reagent .reagent-wrapper .reagent-info .amount-items{color: #70ff9d;}
  .salvage__arrows::after, .salvage__arrows::before{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -849px -107px;}
  .crafting-description-header .item-name, .crafting-description-header .offer-name, .crafting-reagent .item-name, .crafting-reagent .offer-name{color: #68eeff;}
  .salvage__info{border: 1px solid rgb(0 240 156 / 42%);background:rgb(7 83 62 / 32%);color:#00ffbd;}
  .one-item-on-divide-list.enabled .name-wrapper{color: #39ffa9;}
  .one-item-on-divide-list.enabled .name-wrapper:hover{color: #5bf4b1;}
  .crafting__bg{background: none; background-size:contain;}
  .cards-header-wrapper .cards-header .card{background: url(none);background: #0d211c;border-radius: 2px;border: solid 1px #104331;color: #57897e;}
  .cards-header-wrapper .header-background-graphic{border-image: none;}
  .left-grouped-list-and-right-description-window .main-header {background: url(none);width: 536px;height: 60px;}
  .left-grouped-list-and-right-description-window .right-column .middle-right-column-graphics{background: url(none);width: 90%;}
  .left-grouped-list-and-right-description-window .right-column .paper-graphics{border-image: none;border-style: none;}
  .left-grouped-list-and-right-description-window .left-column .middle-left-column-graphics{background: url(none);border-right: solid 1px #35c7a6;top: 61px;}
  .left-grouped-list-and-right-description-window .left-column .bottom-left-column-graphics{background: url(none);border-right: solid 1px #35c7a6; border-bottom: solid 1px #35c7a6;bottom: -2px;}
  .divide-list-group .card-graphic{border-image: url(none);border-style: none;background: #0d2b26;border: solid 1px #53e4b1;height: 25px;}
  .left-grouped-list-and-right-description-window .right-column .right-scroll .scroll-pane .reagents-label{color:#25f8ff; font-family: 'Futura', sans-serif;}
  .salvage__reagents{background: url(https://i.imgur.com/JJceqPN.png) no-repeat -178px -3px; box-shadow: 0 0 0 1px #070807, 0 0 0 2px #003535, 0 0 0 3px #070807;}
  .salvage__receives{background: url(https://i.imgur.com/JJceqPN.png) no-repeat -178px -3px;box-shadow: 0 0 0 1px #070807, 0 0 0 2px #003535, 0 0 0 3px #070807;}
  .salvage__arrows::after, .salvage__arrows::before{filter:brightness(0.5);}
  .salvage__label{border: 1px solid #005f69; box-shadow: 0 2px 0 -1px #00391b; background: #012e1d; color: #3bffc4;}
  .extraction__item{background: url(https://i.imgur.com/W3zdTf7.png) -51px -444px;filter: brightness(0.5);}
  .divide-list-group .label{color: #40d7fc;}
  .divide-list-group .amount{color: #40d7fc;}
  .divide-list-group.active .direction{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -848px -128px;}
  .extraction__arrows::after, .extraction__arrows::before{filter:brightness(0.5);}
  .left-grouped-list-and-right-description-window .bottom-row-panel .filter-label{color:#4effe6;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .menu .menu-option{color:#4effe6;}
  .extraction__receives {background: url(https://i.imgur.com/JJceqPN.png) no-repeat -178px -3px; box-shadow: 0 0 0 1px #070807, 0 0 0 2px #003535, 0 0 0 3px #070807;}
  .extraction__label{border: 1px solid #006e44; box-shadow: 0 2px 0 -1px #003924; background: #002317; color: #3bffc4;}
  .extraction__info {border: 1px solid rgb(0 240 156 / 42%);background:rgb(7 83 62 / 32%);color:#00ffbd;}
  .radio-custom [type=radio]+label::after{background: #00ff91; border: 1px solid #00ffa6;}
  .one-item-on-divide-list{border-bottom: 1px solid #7ce0b6;}
  .autofiller-config{color: #46b5a6;}
  .checkbox-custom [type="checkbox"]:checked + label{color: #52ffe8;}
  .checkbox-custom [type="checkbox"] + label.c-checkbox__label--highlight{color: #4b7d76;}
  .crafting-reagent{background: rgb(36 110 113 / 60%);}
  .crafting-description-header .item-name-wrapper .offer-name{color: #72f8fc;}
  .one-item-on-divide-list .name-wrapper{color: #5b8b9a;background: #387e665c;}
  .one-item-on-divide-list .name-wrapper:hover{color: #00ffdd;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .bottom-panel-graphics{background: url(none);background: #0d2b26;border: solid 1px #53e4b1;}
  .radio-custom [type="radio"] + label::before{border: 1px solid #53e4b1;background: #0a2924;}
  .extraction__currency .icon{filter: hue-rotate(91deg);}
  .extraction__currency .amount{color: #30F8FF;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .safe-mode label{color: #36ced3;}
  .checkbox-custom [type="checkbox"] + label::before{border: 1px solid #53e4b1;background: #32827f;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .start-lvl input, .left-grouped-list-and-right-description-window .bottom-row-panel .stop-lvl input{color:#30F8FF;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .start-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .left-grouped-list-and-right-description-window .bottom-row-panel .stop-lvl input::-webkit-input-placeholder{color:#30F8FF;}
  .crafting__tabs.cards-header-wrapper .cards-header .card.active{width: 25%;}
  .crafting__tabs.cards-header-wrapper .cards-header .card{width: 24.5%;}
  .left-grouped-list-and-right-description-window .left-column .scroll-wrapper{border: 1px solid #53e4b1;}

/*AUKCJE*/
  .auction-window .cards-header-wrapper .cards-header .card{width:24.72%!important;background: url(none);background: #0d211c;border-radius: 2px;border: solid 1px #104331; color: #57897e;}
  .auction-window .bottom-part .bottom-panel-graphics {border-image: url(none);border-style: none;background: #0d2b26;border-top: solid 1px #53e4b1;left: -2px;width: 744px;}
  .auction-window .middle-graphic {border-image: url(none) 0 11 fill repeat;background-color: #0a1311;}
  .auction-window .left-column-auction-and-main-column-auction {background: url(none);background: #53e4b1;width: 5px;left: 154px;border: solid 1px #163b32;top: 36px;}
  .auction-window .main-column-auction {background: #010e09;}
  .auction-window .main-column-auction .auction-search-item {border: 1px solid #00262f;}
  .auction-window .cards-header-wrapper .header-background-graphic {border-image: url(https://i.imgur.com/TnCqfUA.png);}
  .auction-window .bottom-part .amount-of-auction{color: #30F8FF; font-family: 'Futura'; font-size: 20px;}
  .auction-off-item-panel .auction-off-item-panel-wrapper .one-info .second-span {color: white; font-size: 17px; font-family: Futura;}
  .small-currency-icon .small-money {filter: brightness(0.7) grayscale(0.1);}
  .scroll-auction-plug{border: solid 1px #4db997;background: #072c22;}
  .auction-window .main-column-auction .all-auction-section .auction-table .auction-td, .auction-window .main-column-auction .all-auction-section .auction-table-header .auction-td{border: solid 1px #036f5b;}
  .auction-off-item-panel .auction-off-item-panel-wrapper .item-slot-wrapper .item-slot {background: url(https://i.imgur.com/W3zdTf7.png) -51px -444px;}
  .drop-down-menu-section .type-header {background: url(none);background: #0d2b26;border: solid 1px #53e4b1;width: 156px;}
  .auction-off-item-panel input.default, .auction-window input.default{background: url(https://i.imgur.com/HBmt3wu.png) no-repeat; background-size: 100% 100%; border: 1px solid #002e31;}
  .auction-off-item-panel input.default, .auction-window input.default::-webkit-input-placeholder{color:white; font-family:Futura;}
  .auction-window .cards-header-wrapper .header-background-graphic{filter:brightness(0.5);}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item{background: url(none);background: #16453e;border: solid 1px #53e4b1;background-position: -772px -558px;height: 28px;}
  .auction-window .main-column-auction .all-auction-section .auction-table .hover-td:hover, .auction-window .main-column-auction .all-auction-section .auction-table-header .hover-td:hover{background: #11644d;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0, url(https://i.imgur.com/jppqBuq.png) 4 0, auto;}
  .auction-window .main-column-auction .all-auction-info-wrapper .all-auction-info{color: #30F8FF; font-family: Futura; font-size: 17px;}
  .auction-window .left-column-auction .all-categories-auction .one-category-auction{background: url(none);background-position: -191px -179px;background: #16453e;border: solid 1px #53e4b1;height: 30px;width: 30px;}
  .auction-window .main-column-auction .all-auction-section .auction-table .header-auction-td, .auction-window .main-column-auction .all-auction-section .auction-table-header .header-auction-td{border: solid 1px #4db997;background: #072c22;}
  table.auction-table>tr{color:#3aebd3;}
  .auction-window .main-column-auction .all-auction-section .auction-table tr:nth-of-type(2n+1) .auction-td, .auction-window .main-column-auction .all-auction-section .auction-table-header tr:nth-of-type(2n+1) .auction-td {background: rgb(0 205 188 / 12%);}
  .auction-but .label {font-family: 'Futura'; color:#30F8FF; padding:3px; }
  .auction-but.green {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #1e5c3f; background-image: linear-gradient(to top,#001c31, #000806); border: 1px solid #000000;}
  .auction-but.green:hover {background: linear-gradient(to bottom, #21a261, #05211a);}
  .auction-but.violet {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #58007f; background-image: linear-gradient(to top,#480093, #120021); border:none;}
  .auction-but.violet:hover {background: linear-gradient(to bottom,#480093, #120021);}
  .auction-off-item-panel .middle-graphic{border-image: url(https://i.imgur.com/Mgjx5HO.png) 0 11 fill repeat;}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item .label{color:#30F8FF;}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item.selected{background: #0c7c6b;}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item:hover, .auction-window .left-column-auction .all-categories-auction .one-category-auction:hover{background: #0c7c6b;}
  .auction-window .left-column-auction .all-categories-auction .action-menu-item:hover, .auction-window .left-column-auction .all-categories-auction .one-category-auction:hover{background: #0c7c6b;}
  .auction-window .main-column-auction .all-auction-section .auction-table .auction-td.is-featured, .auction-window .main-column-auction .all-auction-section .auction-table-header .auction-td.is-featured{background: #13828c8c;}
  .auction-window .left-column-auction .all-categories-auction .one-category-auction.selected{background: #0c7c6b;}
  .auction-window .main-column-auction .all-auction-section .auction-table .sort-arrow-down:after, .auction-window .main-column-auction .all-auction-section .auction-table-header .sort-arrow-down:after{border-color: #30F8FF transparent transparent transparent;}
  .auction-window .main-column-auction .all-auction-section .auction-table .sort-arrow-up:after, .auction-window .main-column-auction .all-auction-section .auction-table-header .sort-arrow-up:after{border-color: transparent transparent #30F8FF transparent;}
  .auction-window .left-column-auction{top:39px;}
  .drop-down-menu-section .type-header .type-header-label{color:#30F8FF;}
  .auction-window .main-column-auction .auction-search-item .column-bar-search .one-line .between-arrow, .auction-window .main-column-auction .auction-search-item .column-bar-search .one-line .label, .auction-window .main-column-auction .auction-search-item .column-bar-search .one-line .menu-wrapper, .auction-window .main-column-auction .auction-search-item .column-bar-search .one-line input::-webkit-input-placeholder{color:#30F8FF;}
  .auction-window .main-column-auction .auction-search-item .column-bar-search .one-line input{color:#30F8FF;}
  .auction-window .main-column-auction .auction-search-item .first-column-bar-search .between-arrow{border-color: transparent transparent transparent #30F8FF;}
  .auction-off-item-panel .auction-off-item-panel-wrapper .item-slot-wrapper .item-slot .item{margin-left: 4px;margin-top: 4px;}
  .auction-off-item-panel .auction-off-item-panel-wrapper .item-slot-wrapper .item-slot{left: -10px;}

/*KLAN*/
  .clan-banner-name .clan-name{color: #65d9bf;}
  .page-content{color:white;}
  .clan .left-column .clan-info .clan-level, .clan .left-column .clan-info .clan-member-amount, .clan .left-column .clan-info .clan-name, .clan .left-column .clan-info .clan-recruit-state{color: #61ffdc;}
  .clan-info-content .scroll-wrapper{color:white;}
  .clan-other-recruit-content .green-box, .clan-recruit-content .green-box{color:#70ebc0; background: url(none);background: #0d2b26;border: solid 1px #337d63;}
  .clan-recruit-content .invite-to-clan .v-align .label-info {color:#70ebc0;}
  .header-bar.padd.clan-recruit-header-atribute{color:white;}
  .char-stats {color: #42e0cb;font-family: 'Futura';}
  .clan-member .char-info .last-visit{color: #497975;}
  .level-and-prof {color: white;}
  .clan-members-content .clan-members-table td .member-rank, .clan-members-content .table-header td .member-rank{color:#3be8ff;}
  .online-status-wrapper.red.v-item {color: red;font-weight: bolder;font-size: 12px;font-family: 'Futura';}
  span.online-status.green {color:#09c89e !important;font-size: 13px;font-weight: bolder;font-family: 'Futura';}
  .card-content .clan-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td{border-right: 1px solid  #19ffcb;border-bottom: 1px solid  #19ffcb;}
  table.clan-members-table.table-content {font-weight: bold;}
  .card-content .clan-list-find-panel input.default, .card-content .green-box input.default{border: 1px solid rgba(58,117,42,.8); }
  tr {color: #74d9c7;font-weight: bold;}
  .clan-treasury-content .scroll-wrapper .scroll-pane .history-table tr:first-child td {text-align: left;color: white;font-weight: bold;font-family: Futura; font-size: 14px;}
  .card-content .clan-manage-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .enable{background: url(../img/gui/buttony.png?v=1702544610454) no-repeat -805px -116px;filter: hue-rotate(76deg) brightness(1.5);}
  .header-bar.text-center.padd {font-family: Futura;color: white;font-size: 18px;}
  .clan-manage-content .green-box {background-size:100%;}
  td.medium-height-td.table-header {color: white;}
  td.table-header {color: white !important;}
  td.table-header {font-family: Futura;}
  .header-bar {text-align: center; color: #8bf9d8 !important;; font-weight: bold; font-family: Futura; font-size: 17px;}
  .one-clan-quest.quest_active {border: 1px solid #036f5b !important; color:#98fae4;background-color: rgb(43 82 81 / 40%);}
  .one-clan-quest .quest-state.quest_unactive {background: #373737;}
  .clan-bless-content .scroll-wrapper{color:white;}
  .one-bless-skill {border: 1px solid #006a93;}
  .one-clan-quest.quest_unactive {border: 1px solid #89173d;color: #ff1463;}
  .card-content .clan-list-find-panel input.default, .card-content .green-box input.default{border: 1px solid rgb(101 240 191 / 80%) !important;}
  .clan-manage-content .inline .leave-clan .v-align .input-wrapper .confirm-leave::placeholder{color:white !important;}
  .label-info {color: #3cebea}
  .one-clan-skill .skill-clan-info .skill-progress .skill-points-wrapper .use-lvl{filter: hue-rotate(102deg) brightness(0.8);}
  .clan .left-column .clan-list-repeat{background: url(none);left: 7px;width: 163px;height: 427px;top: 159px;}
  .clan .left-column .clan-list-bottom{background: url(none);}
  .clan .left-column .clan-info .clan-name .name.no-clan{color:#30F8FF;}
  .clan .left-column .scroll-wrapper .scroll-pane{border: 1px solid #53e4b18f;}
  .interface-element-green-box-background{background:none;border: 1px solid #53e4b18f;}
  .clan-info-content .scroll-wrapper .scroll-pane .ribbon{background:none;}
  .clan-list-content .first-scroll-wrapper .scroll-pane table .hover:hover {background: #003b3678;}
  .clan .left-column .scroll-wrapper .scroll-pane .card {background: url(none);background: #0d211c;border-radius: 2px;border: solid 1px #104331;color: #57897e;width: 90%;}
  .clan .left-column .scroll-wrapper .scroll-pane .active{background: url(none);background: #406e61;background-size: 100% 100%;color: #4cfabe;border: solid 1px #4ad1a1;border-radius: 2px;width: 90%;}
  .clan .right-column{border-image: url(none);border-style:none;}
  .clan-bless-content .header-bar, .clan-diplomacy-content .header-bar, .clan-edit-page-content .header-bar, .clan-history-content .header-bar, .clan-manage-content .header-bar, .clan-official-page-content .header-bar, .clan-priv-page-content .header-bar, .clan-quests-content .header-bar, .clan-rank-edit-content .header-bar, .clan-recruit-content .header-bar,/*by rajdens*/ .clan-skills-content .header-bar, .clan-treasury-content .header-bar
  {background: #0b1c1a;border: solid 1px #176f63;}
  .clan-other-recruit-content .clan-list-butts-wrapper, .clan-recruit-content .clan-list-butts-wrapper{background: url(none);}
  .card-content .table-header-wrapper{background: url(none);border: solid 1px #4db997;}
  .amount-label {background: url(none);background: #0d2b26;border: solid 1px #53e4b1;color: #75ffc4;font-weight: bold;font-family: 'Futura';}
  .clan-treasury-content .table-header {background: #0d2b26;}
  .clan-treasury-content .scroll-wrapper .scroll-pane .right-part .outfit-content {background: url(none);background: #1e7d7182;border: solid 1px #53e4b1;width: 165px;height: 245px;}
  .clan-treasury-content .green-box{background: url(none);}
  .clan-manage-content .green-box{background: url(none) repeat-y;}
  .clan-history-content .chose-show {padding: 16px 40px; background: url(https://i.imgur.com/TvKSsf1.png) repeat-y; background-size: 100%;}
  .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr .normal-td{border: solid 1px #036f5b;}
  .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr .hover-header{border: solid 1px #036f5b;}
  .card-content .table-header td.header-sort--asc::after{background: url(https://i.imgur.com/W3zdTf7.png) -878px -192px;}
  .card-content .clan-bless-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-diplomacy-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-edit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-edit-official-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-edit-priv-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-history-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-info-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-manage-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-official-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-other-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-other-recruit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-priv-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-quests-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-rank-edit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-recruit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-skills-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-socPlayGroup-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td, .card-content .clan-treasury-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td {border: solid 1px #036f5b;}
  .clan-info-content .scroll-wrapper .scroll-pane .first-text{color:#439b88;}
  .clan-info-content .scroll-wrapper .scroll-pane .heading{color:#9effdd;}
  .clan-info-content .scroll-wrapper .scroll-pane .second-text ul{color:#439b88;}
  .button.small .label, .widget-button.small .label{color: #aef1eb;}
  .clan .left-column .clan-info .clan-name{color: #61ffdc;}
  .clan .left-column .clan-info .clan-level{color: #61ffdc;}
  .clan .left-column .clan-info .stats{color: #77b7a6;}
  .clan .left-column .clan-info .stats span {color: #77b7a6;}
  td.table-header{color:#74d9c7 !important;}
  .clan-diplomacy-content .green-box{background:#13251f8f;border: solid 1px #036f5b;}
  .clan-diplomacy-content .green-box .label-info{color: #50e4b7;}
  .clan-recruit-content .clan-recruit-menu .cards-header-wrapper .cards-header .card{width: 32.9%;}
  .crafting__tabs.cards-header-wrapper .cards-header .card{width:24.5%;}
  .crafting__tabs.cards-header-wrapper .cards-header .card.active{width:25%;}
  .clan-list-content .clan-list-show-btn{border: solid 1px 54b88dcf;background: #47b582c7;}
  .level-and-prof{color: #46ffde;}
  .card-content .clan-bless-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-diplomacy-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-edit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-edit-official-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-edit-priv-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-history-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-info-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-list-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-manage-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-official-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-other-members-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-other-recruit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-priv-page-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-quests-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-rank-edit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-recruit-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-skills-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-socPlayGroup-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red, .card-content .clan-treasury-content:not(.clan-official-page-content):not(.clan-priv-page-content) table tr td .red{color: #a13c69;}
  .card-content .table-header td.header-sort--desc::after{background: url(https://i.imgur.com/W3zdTf7.png) -878px -201px;}
  .clan-skills-content .clan-skill-header span.green{color: #5fecff;}
  .border-window.mAlert .content .inner-content, .border-window.mAlert-mobile-layer .content .inner-content{color: #6dffc0;}
  .clan .left-column .scroll-wrapper .scroll-pane .card:hover{color:#4cfabe;}
  .clan-list-find-panel .clan-list-find-content .atribute-name{color: #4ae3b5;}
  .clan-treasury-content .scroll-wrapper .scroll-pane .right-part .outfit-content .to-dress-available{color: #00ffc7;}
  .clan-treasury-content .scroll-wrapper .scroll-pane .right-part .outfit-content .clan-outfit{width: 165px;height: 115px;position: absolute;top: 2px;border: solid 1px #39b7a2;border-radius: 35px;box-shadow: inset 0px 0px 5px 5px #39b7a2;}
  .one-clan-quest.quest_completed{border: 1px solid #59d485;background-color: rgb(26 68 52 / 40%);}
  .one-clan-quest.quest_completed .progress-text, .one-clan-quest.quest_completed .quest-header, .one-clan-quest.quest_completed .quest-percent{    color: #2ec880;}
  .one-clan-quest .left-side .quest-content{color: #2eb8d2;}
  .one-clan-quest .quest-state.quest_completed{color: #3efdac;border: 1px solid #25c79b;}
  .one-clan-quest .quest-state.quest_unactive{color: #ea467d;border: 1px solid #89173d;}
  .showcase .card-content{color: #5dffe2;}
  .clan-members-content .scroll-wrapper .scroll-pane .clan-member .add-to-group .button .add-bck{background: url(https://i.imgur.com/W3zdTf7.png) no-repeat -334px -81px;}
  .one-clan-quest .quest-state{background:none;}
  .one-clan-quest .quest-progress-wrapper .clan-progress-bar{background: url(https://i.imgur.com/qiYkod3.png) no-repeat 0 -81px;}
  .one-clan-quest .quest-progress-wrapper .clan-progress-bar .background-bar{filter: hue-rotate(143deg);}
  .one-clan-skill{border: 1px solid #53e4b1;box-shadow: 0 0 1px rgb(38 92 97 / 50%);background-color: rgb(136 246 251 / 16%);}
  .clan{color: #35d8e4;}

/*POKAZ OFICJALKE*/
  .showcase .header-menu{background: url(none) repeat-x;}
  .showcase .header-bar{background: url(none);background: #0d2b26;border: solid 1px #53e4b1;}
  .showcase .card-content{border-image: url(https://i.imgur.com/ybK7dAX.png) 0 9 repeat;}
  .clan-other-recruit-content .clan-recruit-header-0, .clan-other-recruit-content .clan-recruit-header-1, .clan-other-recruit-content .clan-recruit-header-2, .clan-recruit-content .clan-recruit-header-0, .clan-recruit-content .clan-recruit-header-1, .clan-recruit-content .clan-recruit-header-2
  {background: url(none);background: #0d2b26;border: solid 1px #53e4b1;color: #3ff6ce;    width: 99.8%;}
  .clan-other-recruit-content .scroll-wrapper .scroll-pane .background-wrapper .one-clan-atribute, .clan-recruit-content .scroll-wrapper .scroll-pane .background-wrapper .one-clan-atribute{color: #4ef4a6.clan-other-recruit-content .clan-list-butts-wrapper, .clan-recruit-content .clan-list-butts-wrapper !important;}
  .showcase .header-menu .active{background: url(none);background: #406e61 !important;color: #4cfabe !important; border: solid 1px #4ad1a1 !important;border-radius: 2px;}
  .showcase .header-menu .active, .showcase .header-menu .card{width: 32.9%;}
  .showcase .header-menu .card{background: url(none);background: #0d211c;border-radius: 2px;border: solid 1px #104331;color: #57897e;margin-top: 2px;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0, url(https://i.imgur.com/jppqBuq.png) 4 0, auto;text-align: center;}
  .showcase .header-menu .card:hover{color:#4cfabe;}

/*FILTRUJ KLAN*/
  .clan-list-find-panel{border-image: url(none);border-style: none;background: url(none);background: #010e09;border-left: solid 1px #53e4b1;}
  .clan-list-find-panel .clan-list-find-content .scroll-pane .background-wrapper .clan-find-header-0, .clan-list-find-panel .clan-list-find-content .scroll-pane .background-wrapper .clan-find-header-1, .clan-list-find-panel .clan-list-find-content .scroll-pane .background-wrapper .clan-find-header-2
  {background: url(none);background: #0d2b26;border: solid 1px #53e4b1;color: #64faff;}
  .clan-list-find-panel .clan-list-butts-wrapper{background: #0d2b26;border: solid 1px #53e4b1;width: 103%;}
  .divide-button .button.active.active::before{box-shadow: none;}
  .divide-button .button.active {box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #1e5c3f; background-image: linear-gradient(to top,#001c31, #000806);}
  .divide-button .button{background-image: linear-gradient(to top,#101010,#121212); box-shadow: inset 0 0 1px 1px #2b2b2b, inset 0 0 0 3px #0c0d0d;}
  .divide-button .button::before{box-shadow: none;}
  .border-window.mAlert .content .button, .border-window.mAlert-mobile-layer .content .button{    box-shadow: inset 0 0 1px 1px #000000, inset 0 0 0 3px #410000;
      background-image: linear-gradient(to top,#310000, #000806);}
  .one-clan-quest .quest-state.quest_active {color: #00e5ff; border: 1px solid #429e75;}
  .one-clan-quest .quest-state {background: #2b8c9582;}
  .one-clan-quest .quest-progress-wrapper .clan-progress-bar .background-bar{filter:hue-rotate(137deg);}
  .clan-skills-content .clan-skill-heading-text{color: #2ae1d0;}
  .one-clan-skill{color:#98fae4; border: 1px solid #036f5b;  background-color: rgb(43 82 81 / 40%);}
  .clan-skills-content .scroll-wrapper .one-clan-skill .skill-icon-wrapper .skill-icon {filter:grayscale(1);}
  .showcase .header .showcase-header-bar{color: #30F8FF;}

/*SKLEP*/

  .shop-wrapper .shop-content .shop-balance .buy {top: 5px;color: #c73e58;font-family: 'Futura';font-weight: 700;}
  .shop-wrapper .shop-content .shop-balance .sell {top: 21px; color: #198363;font-family: 'Futura';font-weight: 700;}
  .shop-wrapper .shop-content .shop-balance .balance.minus {color: #c73e58;font-family: 'Futura';font-weight: 700;}
  .shop-wrapper .shop-content .shop-balance .balance {top: 42px;font-family: 'Futura';font-weight: 700;color: #198363;}
  .shop-wrapper .shop-content .shop-bottom-panel .table-wrapper .currency-label{color: #30F8FF;}
  .shop-wrapper .shop-content .shop-info-wrapper{color: #30F8FF;}
  .shop-wrapper .shop-content .shop-balance .total-price{color: #30F8FF;}
  .shop-wrapper .shop-content .bag-heading, .shop-wrapper .shop-content .filters-heading, .shop-wrapper .shop-content .quick-sell-heading{color: #30F8FF;}
  .shop-wrapper .shop-content .bag-heading{color: #30F8FF;}
  .shop-wrapper .shop-content .items-grid .label{color: #3bffc4;}
  .interface-element-middle-1-background-stretch{border-style: none; border-image: none;background: none;}
  .shop-wrapper .shop-background.normal-shop-zl .canopy{background:none;}
  .shop-wrapper .shop-background .paper-1, .shop-wrapper .shop-background .paper-2{background: none;border: solid 1px #53e4b1;box-shadow: inset 0 0 5px 1px #48f0cd;}
  .interface-element-line-1-background{background: linear-gradient(to right, #000 0, #58a1c6 30%, #1fb6c4 50%, #2ebfc6 70%, #000 100%);}
  .interface-element-wood-box-background{background: none;}
  .shop-wrapper .shop-content .shop-bottom-panel .chest-wrapper .chest{background:none;}
  .shop-wrapper .shop-background.pet-shop-sl .canopy{background: none;}
  .shop-wrapper .shop-background .outfit-pet-scene{background: url(https://i.imgur.com/mLkZmei.png) -315px -149px;}
  .shop-wrapper .shop-background.normal-shop-sl .canopy{background: none;}
  .shop-wrapper .shop-content .for-you-txt{color: #78ffd0;background: linear-gradient(0deg, #259369a6 27%, #33bbc799 85%);}


.border-window.transparent .header-label-positioner .header-label .left-decor, .border-window.transparent .header-label-positioner .header-label .right-decor, .border-window.transparent .header-label-positioner .header-label .text[name="Minutnik"] {top: -8px !important;position: absolute;left: -22px;text-align: center;}
.border-window.transparent .header-label-positioner .header-label .left-decor, .border-window.transparent .header-label-positioner .header-label .right-decor, .border-window.transparent .header-label-positioner .header-label .text[name="Grupa"] {top: -8px !important;position: absolute;left: -18px;text-align: center;}
.border-window.transparent .header-label-positioner .header-label .left-decor, .border-window.transparent .header-label-positioner .header-label .right-decor, .border-window.transparent .header-label-positioner .header-label .text[name="Podręczna mapa"] {top: -8px !important;position: absolute;left: -35px;text-align: center;}
.border-window.transparent .header-label-positioner .header-label .left-decor, .border-window.transparent .header-label-positioner .header-label .right-decor, .border-window.transparent .header-label-positioner .header-label .text[name="Gracze na mapie"] {top: -8px !important;position: absolute;left: -59px;text-align: center;width: 120px;}



/*SEKCJA DODATKÓW DO GRY*/


/*LL*/
  .gargonem-cll-list .gargonem-cll-button.selected, .gargonem-cll-list .gargonem-cll-button:hover{background: #12eab475;box-shadow: inset 0 0 4px 1px #07e2f696;}
  body.cll-catcher-portal-active .gargonem-cll-list{color: #30F8FF;margin-bottom: 0;font-weight: bold;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
  .gargonem-cll-list .gargonem-cll-button{background: #55fff854;cursor: url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
  .gargonem-current-cll.gargonem-cll-transparent .cll-timer.cll-timer-highlighted{background: radial-gradient(#115e5e78, #319b66cf) !important;}
  .cll-timer-monster{color: #30F8FF;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-weight: bold}
  .gargonem-current-cll.gargonem-cll-transparent .cll-timer {background: radial-gradient(#246c5478, #030d08) !important;}
  .cll-modal button{background: #001014ba !important;  box-shadow:none !important;border: 1px solid #007852;color: white;}
  .cll-modal button:hover{border: 1px solid #026943 !important;box-shadow: inset 0px 0px 17px -3px #00c4ff73 !important;background: #001014ba !important;}
  .cll-bordered-button{ box-shadow:none !important;}
  .cll-bordered-button:hover {border: 1px solid #025169 !important;box-shadow: inset 0px 0px 17px -3px #00c4ff73 !important;background: #001014ba !important;}
  .cll-timer:hover {box-shadow: inset 0px 3px 6px 5px rgb(68 175 135 / 65%) !important;background: #00161ca3; border-radius:8px;}
  .cll-timer {border: 1px solid #53e4b1ab;background: #001014ba;box-shadow: none; transition: .2s; border-radius:8px;}
  .c-tip{border: 1px solid #025169 !important;box-shadow: inset 0px 0px 17px -3px #00c4ff73 !important;background: #001014ba !important;}
  .cll-modal textarea {width: 454px;border: 1px solid #025169;padding: 5px;font-size: 12px;height: 130px;max-height: 100px;max-width: 90%;min-width: 90%;min-height: 100px;background: #02516973;outline: none;font-family: 'Futura';text-align: center;color:white;}
  .cll-modal button{background: #001014ba !important; box-shadow:none !important;}
  .cll-bordered-button:hover {border: 1px solid #025169 !important; box-shadow: inset 0px 0px 17px -3px #00c4ff73 !important; background: #001014ba !important;}
  .cll-bordered-button {border: 1px solid #025169;padding: 4px 8px 3px;display: inline-block;max-width: 120px;margin: 0 auto;font-size: 9px;line-height: 12px;cursor: pointer;color: white;margin-top: 7px;box-sizing: border-box;box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);text-decoration: none;text-align: center;font-family: Arial;}
  .cll-modal {text-align: center;top: 0;left: 0;bottom: 0;right: 0;margin: auto;min-width: 180px;background: #174c3c6b;z-index: 999;max-height: 75vh;border: 1px solid #33836ced;padding: 5px;color: white;pointer-events: initial;font-family: Futura;visibility: hidden;display: none; flex-wrap: wrap; justify-content: center;align-items: center;box-shadow: 0px 0px 4px #011e25f7;text-shadow: 1px 1px 2px black;}
  .cll-launcher {width: 12px;height: 12px;padding: 6px;position: absolute;bottom: 125px;z-index: 297;background: #011e25c7;border: 1px double #33836ced;opacity: 0.6;color: #ffffff;left: 1px;pointer-events: initial;}
  .cll-alert {color: #072d57; font-family: 'Futura' !important; text-shadow: 0 0 7px #a1e3ff; background: #174c3c6b !important;}
  .cll-alert-content {margin: 12px 0 0; font-size: 11px; width: 100%; border: none; resize: none; text-align: center; font-family: 'Futura' !important; background: transparent !important; color: white;}
  .cll-alert {position: absolute; border-radius: 5px; width: 90%; min-width: 180px; max-width: 500px; background: white; z-index: 400; border: 3px double #33836ced !important;; padding: 5px; text-align: center; font-family: Segoe UI, sans-serif; pointer-events: initial; box-shadow: 0px 0px 14px 5px rgb(37 104 90);}
  .cll-alert button {margin: 5px auto 0; font-size: 11px; border: none; padding: 7px 13px 4px; cursor: pointer; outline: none; background: #00000047 !important; color: white; margin-right: 4px; box-shadow: 0px 0px 3px #0c96bf; border: 3px; font-family: 'Futura' !important;}
  .cll-alert button:hover {margin: 5px auto 0; font-size: 11px; border: none; padding: 7px 13px 4px; cursor: pointer; outline: none; background: #ad000047 !important; color: white; margin-right: 4px; box-shadow: 0px 0px 14px #ff000047; border: 3px; font-family: 'Futura'!important;}
  .cll-modal-title{color: #032d1e; font-family: 'Futura' !important; text-shadow: 0 0 5px #46f7bc; background: #011e2500 !important;}
  .c-tip{background: #0e231bf5; border: 1px solid #005d3e; color: #ffffff;}
  .cll-timer-highlighted {box-shadow: inset 0 0 8px 1px #117952d4 !important;}
  .cll-timer.cll-timer-highlighted:hover {background: #11aa71d4;}
  .gargonem-current-cll{scrollbar-color: #3edcad6e #69c6c26e;}

/*PANEL WALK*/
  #PWContainer {background: linear-gradient(0deg, #28e9a069, #13a97736) !important;border-bottom: 1px solid #00f398  !important;border-right: 1px solid #00f398  !important;}
  .PWLink, .PWLinks > * {color: #78bdd9 !important;}
  #PWCloseButton, #PWLogCloseButton{background-color: rgb(0 36 65 / 63%) !important;border: 1px solid #006167 !important;color: #f2f4f6;}
  #PWCloseButton:hover, #PWLogCloseButton:hover{background-color: #570000b0 !important;border: 1px solid #670000 !important;color: #f6f2f3;}
  #PWLauncher {background: #0f1a1e !important;border: 1px solid rgb(9 56 73) !important;}
  #PWLogContainer{background: #011e25c7; border: 1px solid #025169;}
  #PWLogInput{background: #02516973; border: 1px solid #025169; color: #bdbdbd; font-weight: 600;}

  /*MADDONZ*/
  .mz-window{border: 1px solid #2ad894;}
  .mz-window__background {position: absolute; inset: 0; z-index: -1; background: linear-gradient(45deg, #42d39633, #1e3c4ead); pointer-events: none; border-radius: 5px;}
  .mz-switch .mz-control__label {color: white;text-shadow: 0px 0px 6px #001728;font-family: Futura;font-size: 11px;}
  .addon__description[data-v-037596b6] {text-align: center;text-shadow: 0px 1px #ababab;font-family: Futura;font-size: 10px;}
  .mz-state-button--active {background: radial-gradient(ellipse at center, #00ffcb, #041e19);box-shadow: 0 0 2px 2px #0eb095;}
  .mz-switch .mz-control__control:checked {background: linear-gradient(0deg, #09502f, #015838);}
  .mz-switch .mz-control__control:before {content: "";position: absolute;top: 0;left: 0;width: 15px;height: 15px;background: linear-gradient(0deg, #23877f, #21f1c6);border-radius: 50%;box-shadow: 0 0 0 1px #484a4c;transition: transform .2s ease-in-out;}
  .mz-control__control {box-shadow: 0 0 1px 2px #28a47a, inset 0 0 0.8em #07553a;background: linear-gradient(0deg, #27ba95a8, #053e266e);}
  .mz-tabs__tab-btn {color: #90f1c7;border-bottom: 2px solid transparent;border-radius: 5px;font-family: Futura;}
  .mz-card {background: rgb(27 90 61 / 25%);border-radius: 3px;border: 1px solid #00ce85fc;padding: 0 0.5em;}
  .mz-control__control:hover {box-shadow: 0 0 5px 2px #02407dd9, inset 0 0 0.8em #000;}
  .button.mz-widget, .widget-button.mz-widget {background: linear-gradient(to top,#2b2b2b, #020202);box-shadow: inset 0 0 1px 1px #000b0d, inset 0 0 0 3px #1e5c3f;}
  .mz-switch .mz-control__control{box-shadow: 0 0 1px 2px #0c825a, inset 0 0 10px #000;}
  .mz-switch .mz-control__control:before{box-shadow: 0 0 0 1px #000000;}
  .mz-switch .mz-control__control:after{background: linear-gradient(0deg, #ff0000, #ff0000);}
  .mz-switch .mz-control__control:hover {box-shadow: 0 0 5px 2px #0099e7d9, inset 0 0 10px #000;}
  .gargonem-otherlist-other.grp .gargonem-otherlist-other-button, .gargonem-otherlist-other.grp .gargonem-otherlist-other-text{background: #2ad3b730;border-color: #0fa77759;}
  .gargonem-otherlist-other.grp .gargonem-otherlist-other-text:hover{background: #11bccc70;}

/*PRIW8*/
 .priw8-change-character-char{transition:.15s;}
 .mmpMap {filter: brightness(0.7);}
 .mmpWrapper .mmpBottombar{background: #818181;border-top: 2px solid black;color: #ffffff;}
 .addonDisplay-single-wrapper.long {height: 400px;}
 .addonDisplay-single-wrapper > .addonDisplay-single-display.long {height: 416px;margin-top: 0px;}
 .addonDisplay-single-wrapper{padding:0;}
 .addonDisplay-single-wrapper{padding-top:5px;}
 .priw8-change-character-wrapper{left: 387px; pointer-events: all;}
 .message.active>.inner>span[style="color: #ff8400"] {color: red !important; font-weight: bold;}
 .item-tip-section.s-4>.inner>span[style="color: #ff8400"] {color: red !important; font-weight: bold;}
 .border-window.askAlert .input-wrapper input{color: white;}
 .ni .gargonem-change-character-portal{left: 387px; pointer-events: all;}
 .gargonem-flex.between>div{font-family: Futura;}
 .gargonem-window.opacity-4{background: #032f25;}
 .gargonem-window.opacity-1{background: #073e324d;}
 .gargonem-close-button{background: url(https://i.imgur.com/W3zdTf7.png) -624px -117px;}
 .gargonem-close-button:hover{background: url(https://i.imgur.com/W3zdTf7.png) -726px -117px;}
 .gargonem-opacity-button{background: url(https://i.imgur.com/W3zdTf7.png) -725px -131px;}

/*LicznikUbic*/
 .bcizgm3[data-id=elite] {border-radius:8px;}
 .bcizgm3[data-id=elite2] {border-radius:8px;}
 .bcizgm3[data-id=hero] {border-radius:8px;}
 .bcizgm3[data-id=titan] {border-radius:8px;}
 .bcizgm3[data-id=colossus] {border-radius:8px;}
 .bcizgm3[data-id=event] {border-radius:8px;}
 .bcizgm3[data-id=other] {border-radius:8px;}
 .addonDisplay-single-wrapper.long{height:375px;}
 .addonDisplay-single-wrapper > .addonDisplay-single-display.long{height: 400px; margin-top: -2px; overflow: scroll;}
 .bcizgm0 {background-color:#6a918c;opacity:0.8;border: 1px solid #2b5657;border-radius: 6px;bottom: 0;box-shadow: 0 1px 6px 0 #0c0e11;color: #16f0d3;}
 ._1rnrz0u0 {background-color:#475e5d;}
 ._1rnrz0u2 p{color:white;}

/*NIEBIESKIE-TIPY*/
 .tip-wrapper.normal-tip {box-shadow: rgb(26 38 33 ) 0px 0px 0px 0px, #53e4b1 0px 0px 0px 1px, rgb(0 0 0) 0px 0px 0px 2px, rgb(33 43 40 / 0%) 0px 0px 0px 3px, rgb(65 84 77 / 0%) 0px 0px 0px 4px, rgb(27 168 126/ 0%) 0px 0px 0px 5px, rgb(73 92 89/ 0%) 0px 0px 0px 6px, rgb(37 51 47/ 0%) 0px 0px 0px 7px, #53e4b1 0px 1px 13px -4px !important;}
 .tip-wrapper{color: #b0f8f2;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; }
 .tip-wrapper[data-item-type=t-upgraded], .tip-wrapper[data-item-type=upgraded]{box-shadow: 0 0 0 0 #2b282a, 0 0 0 1px #353131, 0 0 0 2px #191311, 0 0 0 3px #2b2727, 0 0 0 4px #59595a, 0 0 0 5px #ffc800, 0 0 0 6px #5a585b, 0 0 0 7px #2c2625;}
 .tip-wrapper[data-item-type=heroic], .tip-wrapper[data-item-type=t-her]{box-shadow: 0 0 0 0 #2b282a,0 0 0 1px #353131,0 0 0 2px #191311,0 0 0 3px #2b2727,0 0 0 4px #59595a,0px 0px 50px 15px #3cb0de,0 0 0 6px #5a585b,0 0 0 7px #2c2625!important;}
 .tip-wrapper[data-item-type=t-uniupg]{box-shadow: 0 0 0 0 #2b282a,0 0 0 1px #353131,0 0 0 2px #191311,0 0 0 3px #2b2727,0 0 0 4px #59595a,0px 0px 50px 15px #c4c43f,0 0 0 6px #5a585b,0 0 0 7px #2c2625 !important;}
 .tip-wrapper[data-item-type=t-upgraded]{box-shadow: 0 0 0 0 #2b282a,0 0 0 1px #353131,0 0 0 2px #191311,0 0 0 3px #2b2727,0 0 0 4px #59595a,0px 0px 50px 15px #30d976,0 0 0 6px #5a585b,0 0 0 7px #2c2625!important;}
 .tip-wrapper[data-item-type=normal], .tip-wrapper[data-item-type=t-norm]{box-shadow: 0 0 0 0 #2b282a,0 0 0 1px #353131,0 0 0 2px #191311,0 0 0 3px #2b2727,0 0 0 4px #59595a,0px 0px 50px 15px #8994a3,0 0 0 6px #5a585b,0 0 0 7px #2c2625 !important;}
 .tip-wrapper[data-item-type=t-leg] {box-shadow: 0 0 0 0 #2b282a,0 0 0 1px #353131,0 0 0 2px #191311,0 0 0 3px #2b2727,0 0 0 4px #59595a,0px 0px 50px 15px #d60d49,0 0 0 6px #5a585b,0 0 0 7px #2c2625 !important;}
 .tip-wrapper[data-type=t_item] .item-head .legendary, .tip-wrapper[data-type=t_item] .item-tip-section .legendary {color:rgb(255 49 115) !important;font-size: 12.5px;text-shadow: 1px 1px #da428642;font-family: 'Futura' !important; font-weight:bold;}
 .tip-wrapper .content {padding: 5px;background: rgb(25 50 35 / 54%);word-break: break-word; font-family: 'Futura';}
 .tip-wrapper[data-type=t_item] .item-head {border: 1px solid #53e4b182;box-shadow: inset #53e4b18c 0px 0px 1px 1px;border-radius: 2px;background: #29695233;}
 .tip-wrapper[data-type=t_item] .item-head .head-icons .cl-icon {border: 1px solid #0092a870;}
 .tip-wrapper[data-type=t_item] .item-tip-section {border-bottom: 1px solid #05bc7a9e;box-shadow: 0 .5px 2px 0px #05bc7a33;}
 .tip-wrapper .content .info-wrapper .nick {color:#30F8FF; font-family: Futura; font-size: 13px; text-shadow: 0 0 2px #53e9ff, 0 0 1px #000; border:none;border-radius: 2px;background: none;font-weight: 600;}
 .tip-wrapper[data-type=t_other] .line {border-bottom:1px solid  #53e4b1; background: none;}
 .tip-wrapper[data-type=t_item] .item-head .item{background: rgb(65 193 155 / 15%);border: 1px solid #53e4b1a6;box-shadow: 0 0 1px #2dbb91;box-sizing: content-box;float: left;height: 32px;margin: 3px;position: relative;width: 32px;}
 .tip-wrapper[data-type=t_item] .item-head .item-builds, .tip-wrapper[data-type=t_item] .item-head .item-type{color:#88c9cce3;}
 .tip-wrapper[data-type=t_item]{color: #92f6e5;}
 .tip-wrapper.normal-tip .damage, .tip-wrapper.sticky-tip .damage{color: #1fff8c;font-weight: bold;text-shadow: 0px 0px 2px #61d8b3;}
 .item-tip-section.s-4 span[style="color: #87f187;"]{color:#35ffb1 !important;text-align: center;}
 .tip-wrapper[data-type=t_item] .item-tip-section.s-5{color: #30F8FF;font-weight: 600;text-align: center;}
 .tip-wrapper[data-type=t_item] i.looter{color: #00ffbc;margin: 3px 0;text-align: center;}
 .tip-wrapper[data-type=t_item] .item-tip-section.s-7{color: #30f8ffbf;text-align: center;text-shadow: 1px 1px rgb(48 120 86 / 50%);}
 .item-tip-section.s-8{color: #46d48b;text-align: center;}
 .tip-wrapper[data-type=t_item] .prof-icons-holder{color: #30F8FF;text-align: center;}
 .tip-wrapper[data-type=t_item] .item-tip-section .level-required{color: #52e8a7;}
 .tip-wrapper[data-type=t_item] .item-tip-section.s-9 .level-required+.value-item{color: #52e8a7;}
 i.prc-icon{filter: hue-rotate(119deg);}
 .tip-wrapper[data-type=t_item] .item-head .unique,.tip-wrapper[data-type=t_item] .item-tip-section .unique {color: #ffe16e;font-weight:bold;text-shadow:0 0 1px #fcff58;}
 .tip-wrapper[data-type=t_item] .item-head .heroic,.tip-wrapper[data-type=t_item] .item-tip-section .heroic { color: #38b8eb;font-weight:bold;text-shadow:0 0 1px #38b8eb;}
 .tip-wrapper[data-type=t_item] .item-head .upgraded,.tip-wrapper[data-type=t_item] .item-tip-section .upgraded {color: #ff59af;font-weight:bold;text-shadow:0 0 1px #ff59af;}
 .tip-wrapper[data-type=t_item] .item-head .common,.tip-wrapper[data-type=t_item] .item-tip-section .common {color: #adb4c2;font-weight:bold;text-shadow: 0 0 2px #000000;}
 .tip-wrapper[data-type=t_item] .item-tip-section .green{color:#51dba6;}
.tip-wrapper[data-type=t_item] .item-tip-section .red{color: #f33f79;}
 .tip-wrapper[data-type=t_other] .rank{color: #46f0af;}
 .tip-wrapper[data-type=t_other] .clan-in-tip{color:#35ffaa;}
 .info_tooltip_loot{color: #b2f0d6;}
 .info_tooltip_loot .value{color: #61ffeb;}
 .content span[style="color:#888"]{color:#a0a0a0; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
 .content span[style="color:#f50"]{color:#d14600;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
 .tip-wrapper i{color: #00ffb3;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}

/* PRIW8 #2 */
 @import url('https://fonts.cdnfonts.com/css/Futura');
 .gargonem-input.gargonem-clan-members-online-search.right-attached.right-border::-webkit-input-placeholder{color:#30F8FF;}
 .gargonem-window-body{color: #53fffd;}
 .gargonem-window.opacity-2 {background: #073e326b;}
 .gargonem-window.opacity-3 {background: #085746a1;}
 .gargonem-box {border: 1px solid #005c71;}
 .gargonem-dock{border: 1px solid #0e9c59;background: #27996e45;box-shadow: 0 0 1px #086938, 0 0 0 1px #023529, 0 0 0 2px #001414, 1px 1px 2px 2px #002d1466;}
 .gargonem-dock-handle {color: #5fb6aa;border: 1px solid #0e9c59;background: #27996e45;box-shadow: 0 0 1px #086938, 0 0 0 1px #023529, 0 0 0 2px #001414, 1px 1px 2px 2px #002d1466;}
 .gargonem-window{box-shadow: 0 0 1px #36de9e, 0 0 0 1px #17a451, 0 0 0 2px #3a8878, 1px 1px 2px 2px #002d2d66;}
 .gargonem-button {border: 1px solid #0d9f6e; background: #12a16b99;color: #bcffe8;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
 .gargonem-button:hover{background: #55ffff99;}
 .gargonem-build-switcher-purchase-btn:hover{color:#7dc7b8;}
 .gargonem-build-switcher-purchase-btn{color: #60d7cb;cursor:url(https://i.imgur.com/jppqBuq.png) 4 0,url(https://i.imgur.com/jppqBuq.png) 4 0,auto;}
 .gargonem-tab-switcher {border: 1px solid #13aa82;background: #366e5400;}
 .gargonem-card {border: 1px solid #19d298;box-shadow: inset 0 0 6px 1px #15917cbf;}
 .gargonem-input {border: 1px solid #0a8e72;background-color: #21a67929;color: #a1f8fb;}
 .gargonem-tab-selector.active {background: linear-gradient(90deg, #58ffb966 50%,#00ff8ad1);}
 .gargonem-tab-selector:hover {background: linear-gradient(90deg, #00ff9fd4 50%, #00e1a000);}
 .gargonem-tab-selector{background: linear-gradient(90deg, #414f484d 40%, #1c2a24);}
 .gargonem-flex.between {color: #11f8c6; font-family: Futura;}
 .gargonem-checkbox {background: url(https://i.imgur.com/pfPD0tx.png) no-repeat -484px -94px;}
 .gargonem-window-title {color: #00ffc7; font-family: 'Futura'; font-size: 16px;}
 .gargonem-thp-wrapper .gargonem-thp-effect.negative {color: #ff0000; font-weight: bold;}
 .gargonem-thp-wrapper .gargonem-thp-effect.positive {color: #00ff00; font-weight: bold;}
 .gargonem-textarea{border: 1px solid #005c71;}
 .gargonem-card:hover {background: #1dc49a33;}
 .gargonem-clan-members-online-wrapper{border: 1px solid #30c480bd;}
 .gargonem-clan-members-online-member:nth-child(odd) {background: #00202975;}
.gargonem-clan-members-online-member{background: #00000070;}
.gargonem-clan-members-online-form button{border-color: #34dc8767;}
.gargonem-otherlist-other.rel-1 .gargonem-otherlist-other-button, .gargonem-otherlist-other.rel-1 .gargonem-otherlist-other-text{color: #8effe1;}
.gargonem-build-wrapper .gargonem-build-btn.selected {background: #2b433e99;border-color: #94f3d7;}


</style>`).appendTo('body');
}
})();
