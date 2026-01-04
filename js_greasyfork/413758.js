// ==UserScript==
// @name Another Dark Habitica Style
// @namespace https://greasyfork.org/users/662334
// @version 0.6.0
// @description A low-contrast dark mode user style for Habitica. Goes one step further than many other Habitica dark modes and even goes so far as to dim images as well.
// @author citrusella
// @supportURL https://habitica.com/profile/2d6ef231-50b4-4a22-90e7-45eb97147a2c
// @license CC-BY-NC-ND-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.habitica.com/*
// @downloadURL https://update.greasyfork.org/scripts/413758/Another%20Dark%20Habitica%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/413758/Another%20Dark%20Habitica%20Style.meta.js
// ==/UserScript==

(function() {
let css = `
body,.well,#front .purple-4,#loading-screen-inapp,#buy-gems___BV_modal_body_ .gem-deck,#buy-quest-modal .right-sidebar,.bordered-item .item {
    background-color: #161616 !important;
}
#report-flag blockquote {
    background-color: #161616 !important;
    color: #b1b5a8 !important;
}
.floating-header-shadow {
    filter: invert(100%) !important;
}
.modal-backdrop {
    background: #36205D !important;
}
.reward-control {
    background: #ffca88 !important;
}
.at-text {
    color: #965eff !important;
}
.at-highlight {
    background-color:rgba(105, 99, 127, .32);
}
footer.expanded,.btn-primary,.btn-secondary,.btn-show-more,.topbar-dropdown-item,.bg-gray-700,.pet-slot.item-empty {
    background: #393939 !important;
}
.btn-primary:focus {
    background-color: #696473 !important;
}
.ph {
    filter: saturate(0%) !important;
}
.quest-box {
    filter: invert(100%);
}
.boss-info {
    filter: invert(100%);
}
.task-content,.form-control,.spell .details,.spell,.card,.chat-row textarea,.item,.filter-panel,.dropdown-menu,.challenge,.modal-content,.dropdown .btn-secondary,.box,#private-message .header-bar,#private-message,.input-group input,.stats-column,.messages-column textarea,#private-message .conversation.active,#private-message .conversation:hover,.chat-receive-actions .btn-secondary:not(:disabled):not(.disabled):hover,.standard-page .col-4 .item-with-icon,.standard-page .row .item-with-icon,.quick-add:focus,.btn-secondary:not(:disabled):not(.disabled):hover,#buy-gems___BV_modal_body_,.autocomplete-selection,.subscribe-card,.multi-item.pill-invert,.create-task-btn.diamond-btn,.questRewards .reward-item,#buy-quest-modal .purchase-amount .box input,.left-panel .quest-col .quest-wrapper,#buy-modal .purchase-amount .box input,.white-header {
    background-color: #000 !important;
}
.left-control,.right-control,.create-btn,.progress-container,.habitica-emoji,.item-with-icon,.badge-purple,.checklist-item-done,.grassy-meadow-backdrop,.guild-background,.btn-danger,.quest-boss,.grey-progress-bar,.avatar,.mentioned-icon,.error,.class-badge,.challenge-prize,.pause-button,.btn-warning,.btn-info,.featuredItems .background,.image,.btn-success,a,.logo,[class*="promo"],[class*="scene"],.bailey .npc_bailey,.npc_matt,.item-content,.badge,img,.profile .btn-secondary:not(:disabled):not(.disabled):hover,[class*="icon_background_"],.price .svg-icon,#buy-gems___BV_modal_header_,.profile .info-item .progress,.achievement-wrapper .achievement,.achievement-icon,.gem-icon,.subscribe-card .round-container,.subscribe-card .svg-heart,.svg-gift-box,.bg-gray-700,.alert-warning,.iconalert,.market .featuredItems .background,.classgroup .svg-icon,.task-modal-header,.input-group .input-group-prepend.input-group-icon,.input-group-spaced,.toggle-group,.questRewards .reward-item .svg-icon,.quest-image,.left-panel .quest-col .quest-wrapper,.purchase-amount .svg-icon,.team-based,.group-management,.gear.box.white,.pet-mount-well .box.white {
    filter: brightness(75%);
}
.task-modal-header .form-control {
    color: #fff !important;
}
#buy-quest-modal .purchase-amount .box,#buy-modal .purchase-amount .box {
    box-shadow: 0 2px 2px 0 rgba(26,24,29,.48),0 1px 4px 0 rgba(26,24,29,.36);
}

.task-title,h1,h2,h3:not(.leader),h4,h5,h6,.quest-box a,.standard-page .col-4 .item-with-icon .number,.standard-page .col-4 .item-with-icon .label,.standard-page .card-link,.bg-gray-700 .justify-content-around,.bg-gray-700 .header-mini {
    color: #CBCEC5 !important;
}
pre {
    color: #DEDAD6 !important;
}
.tasks-list,.collapse-checklist,.secondary-menu,.sidebar,.tier-list li,hr,.standard-sidebar,.category-label,.group .items,.disable-background,.btn-secondary:not(:disabled):not(.disabled):hover, .dropdown > .btn-secondary.dropdown-toggle:not(.btn-success):not(:disabled):not(.disabled):hover,.select-multi .dropdown-header,#select-member-modal header,#members-modal .modal-header {
    background-color: #2C2C2C !important;
}
.disable-background {
    z-index: 2
}
.checklist-item {
    color: #B1B5C1 !important;
}
body p,body li,body td,body th,.text,.nav-link,.sidebar,.btn-secondary:not(.pause-button),.tags-header,.notification-content,.spell,.standard-sidebar .custom-control-label,.dropdown-item,.achievement-list-item span {
    color: #b1b5a8 !important;
}
.notification .text,.white-header a,.close {
    color: #FFF !important;
}
.nav-link:hover,.topbar-item:hover,.topbar-dropdown-item:hover,#front .purple-3,.claim-bottom-message,#task-modal .advanced-settings,#buy-quest-modal .modal-footer,#buy-modal .modal-footer,#start-quest-modal___BV_modal_content_ .side-panel,#start-quest-modal___BV_modal_content_ .left-panel {
    background-color: #1e1f1c !important;
}
.chat-row .user-entry,.btn-show-more {
    color: #e5e7e2 !important;
}
.leader,.sidebar .staff .title {
    background-color: #DDD;
    width: auto !important;
    text-indent: 8px;
    border-radius: 6px;
    padding-right: 8px;
  }
.leader .svg-icon:empty,#private-message .conversation .user-label .svg-icon:empty {
    display: none !important
 }
#private-message .conversation .user-label {
    background-color: #DDD;
    width: auto !important;
    text-indent: 8px;
    border-radius: 6px;
    padding-right: 8px;
    padding-bottom: 22px;
    filter: brightness(75%);
  }
.challenge .well .muted, .challenge .well .muted .svg-icon,.achievement-list-item .badge {
    color: #878190 !important;
}
.challenge .well > div, .challenge .well .svg-icon {
    color: #C3C0C7 !important;
}
.topbar,.btn-contribute,.social-circle,/*nav.navbar,*/#front .purple-1 {
    background: #333 !important;
}
#app-header,#front .purple-2 {
    background-color: #282828 !important;
}
#front .pixel-horizontal {
    color: #333 !important;
}
#front .pixel-horizontal-2 .svg-icon {
    color: #282828 !important;
    fill: #282828 !important;
}
#front .pixel-horizontal-3 {
    color: #161616 !important;
}
.card {
	border: 1px solid rgba(255,255,255,.25);
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
