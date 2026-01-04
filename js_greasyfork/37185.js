// ==UserScript==
// @name         Zendesk Dark Mode
// @namespace    plugable.com
// @version      0.18
// @description  This userscript is a full dark theme for Zendesk
// @author       Derek Nuzum
// @match        https://*.zendesk.com/*
// @exclude      https://www.zendesk.com/apps/*
// @exclude      https://support.zendesk.com/hc/en-us/articles/*
// @exclude      https://support.zendesk.com/hc/en-us/sections/*
// @grant        none
// @license         MIT - https://opensource.org/licenses/MIT
// @copyright       Copyright (C) 2017, by Derek Nuzum <derek@plugable.com>
// @downloadURL https://update.greasyfork.org/scripts/37185/Zendesk%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/37185/Zendesk%20Dark%20Mode.meta.js
// ==/UserScript==

//DO NOT TOUCH THIS AREA
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//END DO NOT TOUCH AREA

//CUSTOMIZATION BEGINS HERE

//Change Styling Here

//Highest Level Container
addGlobalStyle('.container {background-color: #424242;};');
//Header
addGlobalStyle('#branding_header {background: #212121 !important; border-bottom: 1px #3D7CDC solid; border-color: #3D7CDC !important;}');
//Tabs
addGlobalStyle('#branding_header #tabs .add {background: #303030; height: inherit; width: auto;};');
addGlobalStyle('#tabs .tab {border-bottom: 1px solid #3D7CDC;};');
addGlobalStyle('#tabs .tab > .tab-content-holder .tab_text {color: #3D7CDC !important;};');
addGlobalStyle('#tabs .tab > .tab-content-holder .close {color: #3D7CDC;};');
addGlobalStyle('#tabs .tab.selected .tab-content-holder {background: #424242 !important;};');
addGlobalStyle('#tabs .tab:not(.add):not(.overflow-tab) {background: #303030; border-right: 1px solid #3D7CDC; border-left: 0 solid #3D7CDC; border-bottom: 1px solid #3D7CDC;};');
//Tab Popover
addGlobalStyle('.ticket-tab-hover .popover-inner {background-color: #424242;};');
addGlobalStyle('.ticket-tab-hover .popover-title {background: #424242; color: #3D7CDC;};');
addGlobalStyle('.ticket-tab-hover .popover-content {background: #424242; color: #3D7CDC;};');
//Header Right Side Menus
addGlobalStyle('.channels-control #voice-control {display: none !important;};');
addGlobalStyle('#zd-product-tray {color: #3D7CDC;};');
addGlobalStyle('.zd-product-tray-toggle {color: #3D6EC5;};');
addGlobalStyle('#zd-product-tray > div {background-color: #a0a0a0;};');
//Header SVG Icons
addGlobalStyle('#tabs .mail.tab > .tab-content-holder .icon, #tabs .mail.selected > .tab-content-holder .icon {background-color: #3D7CDC; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .overflow-tab.tab > .tab-content-holder .icon, #tabs .overflow-tab.selected > .tab-content-holder .icon {background-color: #3D7CDC; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .add.tab > .tab-content-holder .icon, #tabs .add.selected > .tab-content-holder .icon {background-color: #3D7CDC; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .web.tab > .tab-content-holder .icon, #tabs .web.selected > .tab-content-holder .icon {background-color: #3D7CDC; border: 1px solid; border-radius: 5px;};');
//More Menu
addGlobalStyle('#tabs .tab.overflow-tab .overflow-tabs-container {background: #303030;};');
addGlobalStyle('#tabs .search.tab > .tab-content-holder .icon, #tabs .search.selected > .tab-content-holder .icon {background-color: #3D7CDC; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .tab.overflow-tab .overflow-tabs-container .tab:hover {background: #424242};');
//Add Menu
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner {background: #303030; color: #3D7CDC; border: 1px solid #3D6EC5;};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .popover-title {background: #303030; color: #3D7CDC; border-color: #3D6EC5};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .popover-content {background: #303030; color: #3D7CDC;};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .links-section a {color: #3D7CDC};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .links-section li:hover {background: #424242;};');
addGlobalStyle('#tabs .tab .recent-ticket:hover {background: #424242;};');
//Profile Menu
addGlobalStyle('.c-menu {background-color: #303030; color: #3D7CDC;};');
addGlobalStyle('.c-menu__item {color: #3D7CDC;};');
addGlobalStyle('.c-menu__item.is-selected, .c-menu__item:hover {background-color: #424242; color: #3D7CDC;};');
addGlobalStyle('.c-menu__separator {border-bottom: 1px solid #3D6EC5;};');
//Search
addGlobalStyle('#branding_header #user_options .header-search.collapsed .search-dropdown .zd-searchmenu-base {background-color: #424242 !important; border: none 1px #3D7CDC !important;};');
addGlobalStyle('#branding_header #user_options .header-search.expanded .zd-searchmenu-base {background-color: #424242 !important; color: #3D7CDC !important; border: solid 1px #3D7CDC !important;};');
addGlobalStyle('#branding_header #user_options .header-search.expanded > .search-icon {color: #3D7CDC !important;};');
addGlobalStyle('#branding_header #user_options .header-search.collapsed > .search-icon {color: #3D7CDC !important;};');
addGlobalStyle('#tabs .tab.selected.search .tab-content-holder {border-bottom: #2a97f7;};');

//Ticket View
addGlobalStyle('.main_panes > header, .workspace > header {background-color: #212121; border-bottom: 1px #3D7CDC solid;};');
addGlobalStyle('.main_panes > header .pane .btn, .workspace > header .pane .btn {background-color: #303030; color: #3D7CDC; border: 1px solid #3D7CDC;};');
addGlobalStyle('.main_panes > header .pane .btn:active, .main_panes > header .pane .btn.active, .main_panes > header .pane .btn:hover, .workspace > header .pane .btn:active, .workspace > header .pane .btn.active, .workspace > header .pane .btn:hover {background-color: #424242 !important;};');
addGlobalStyle('.main_panes > header .pane .btn-group span:last-of-type, .workspace > header .pane .btn-group span:last-of-type {#61d83a; background-color: #212121 !important; border-color: #61d83a;};');
addGlobalStyle('.section.ticket .notice {background: #212121; border-bottom: 1px dotted #61d83a;};');
addGlobalStyle('.section.ticket .notice p.pre {color: #61d83a;};');


//Ticket View > Sidebar
addGlobalStyle('.left.pane .property_box_container {background: #303030;};');
addGlobalStyle('.ticket-sidebar .property_box {background: #303030; border-bottom: 1px solid #3D7CDC;};');
addGlobalStyle('.form_field label {color: #3D7CDC;};');
addGlobalStyle('.zd-searchmenu-base {background-color: #404040; border: 1px solid #3d7cdc !important; color: #2a97f7;};');
addGlobalStyle('.zd-tag-menu-root .zd-tag-editor-holder, .zd-tag-menu-root .zd-searchmenu-root, .zd-tag-menu-root input {border: none !important;};');
addGlobalStyle('.ticket-sidebar .zd-selectmenu-base, .ticket-sidebar .zd-tag-menu-root {color: #3D7CDC !important; background-color: #424242 !important; border: 1px solid #3D7CDC !important;};');
addGlobalStyle('.zd-selectmenu-root, .zd-searchmenu-root, .zd-combo-selectmenu-root {color: #3D7CDC;};');
addGlobalStyle('select:focus, textarea:focus, .editable:focus, .editable input[type="text"]:focus, .focused, .token_list.ui-state-focus, .ui-selectmenu:focus, .zd-state-focus .zd-selectmenu-base, .zd-state-focus .zd-searchmenu-base {color: #3D7CDC !important; background-color: #4f4f4f !important; border: 1px solid #3D7CDC !important;};');
addGlobalStyle('.ticket-sidebar .form_field > input, .ticket-sidebar .form_field textarea, .ticket-sidebar .form_field .token_list, .ticket-sidebar .form_field .zd-menu-list-holder {color: #3D7CDC; background-color: #424242; border: 1px solid #3D7CDC;};');
addGlobalStyle('.zd-tag-item {background-color: #303030; border: 1px solid #3D7CDC; color: #3D7CDC;};');
addGlobalStyle('.zd-tag-item a {color: #3D7CDC; font-weight: 500;};');
addGlobalStyle('.ticket-sidebar .form_field > input:focus, .ticket-sidebar .form_field textarea:focus {border-color: #61d83a !important;};');
addGlobalStyle('.ticket_collision {background-color: #303030; color: #3D7CDC;};');
addGlobalStyle('.notification.v2 {background-color: #303030; border: 1px solid #61d83a; color: #3d7cdc;};');
addGlobalStyle('.left.pane.ticket-sidebar.section {background-color: #424242;};');
addGlobalStyle('.notification.v2 .btn {background-color: #212121; border-color: #61d83a; color: #3d7cdc;};');
addGlobalStyle('.zd-menu-item.zd-item-focus {background-color: #303030;};');
addGlobalStyle('.zd-menu-root {background-color: #424242;};');
addGlobalStyle('.zd-menu-link > a {color: #2a97f7;};');
addGlobalStyle('.zd-selectmenu-base-content {color: #2a97f7;};');
addGlobalStyle('.zd-menu-back-link > a {#61d83a !important;};');
addGlobalStyle('.user-picker-menu .zd-menu-footer, .ccs-menu .zd-menu-footer, .requester-menu .zd-menu-footer {border: 1px solid #61d83a !important; background-color: #303030;};');
addGlobalStyle('.user-picker-menu .add-user, .ccs-menu .add-user, .requester-menu .add-user {color: #2a97f7;};');
addGlobalStyle('.zd-combo-selectmenu .zd-highlight, .zd-selectmenu .zd-highlight, .zd-searchmenu .zd-highlight {color: #61d83a !important;};');


//Ticket View > Ticket
addGlobalStyle('.section.ticket {background: #424242; color: #2a97f7;};');
addGlobalStyle('.ticket .mast {background: #303030; border-bottom: 1px solid #3d7cdc;};');
addGlobalStyle('.mast .editable input {color: #3d7cdc;};');
addGlobalStyle('.mast .source {color: #3d7cdc;};');
addGlobalStyle('.mast .source a.email {color: #61d83a;};');
addGlobalStyle('a {color: #61d83a; text-decoration: none;};');
addGlobalStyle('a:hover {color: #61d83a; text-decoration: underline;};');
addGlobalStyle('.btn-group.open .btn.dropdown-toggle:not(.btn-inverse) {#a0a0a0 !important;};');
addGlobalStyle('.mast .object_options .dropdown-menu {background-color: #424242;};');
addGlobalStyle('.dropdown-menu li a {color: #2a97f7;};');
addGlobalStyle('.dropdown-menu li a:hover {color: #61d83a; background-color: #404040;};');
addGlobalStyle('.rich_text .comment-actions .btn.active {color: #2a97f7; border-bottom-color: #61d83a;};');
addGlobalStyle('.rich_text .comment-actions .btn.active:hover {color: #61d83a;};');
addGlobalStyle('.comment_input {border-top: none !important;};');
addGlobalStyle('.comment_input .btn {color: #3d7cdc;};');
addGlobalStyle('.rich_text .comment-actions .btn:hover {color: #61d83a;};');
addGlobalStyle('.zendesk-editor--toolbar {border: 1px solid #61d83a; background-color: #424242;};');
addGlobalStyle('.zendesk-editor--group li.active {box-shadow: 0px 0px 0px 1px #61d83a; background: #212121;};');
addGlobalStyle('.zendesk-editor--group li, .zendesk-editor--group li * {color: #3d7cdc;};');
addGlobalStyle('.zendesk-editor--menu {border: 1px solid #61d83a; background-color: #212121;};');
addGlobalStyle('.event .header .actor .name a {color: #61d83a;};');
addGlobalStyle('ul.attachments li {background-color: #303030;};');
addGlobalStyle('.zendesk-editor--rich-text-comment code, .markdown_formatting code, .markdown_preview code, .event .comment code {border: 1px solid #61d83a; background-color: #303030; color: #61d83a;};');
addGlobalStyle('.zendesk-editor--rich-text-comment pre, .markdown_formatting pre, .markdown_preview pre, .event .comment pre {background-color: #303030; border: 1px solid #61d83a; color: #61d83a;};');
addGlobalStyle('.event .header .meta .comment_menu .dropdown-menu {background-color: #303030;};');
addGlobalStyle('.main_panes > .pane.right, .workspace > .pane.right {border-left: 1px solid #3d7cdc;};');
addGlobalStyle('.section.ticket .tab-controls-container {border-bottom: 1px solid #3d7cdc;};');
addGlobalStyle('.dropdown-container .dropdown-toggle {color: #2a97f7;};');
addGlobalStyle('.open .dropdown-menu {background-color: #303030;};');
addGlobalStyle('.dropdown-menu .selected::after {border: 1px solid #61d83a;};');
addGlobalStyle('.section.ticket .conversation-nav:after {border-right: 1px solid #61d83a;};');
addGlobalStyle('.c-tab__list {color: #2a97f7};');
addGlobalStyle('.c-tab__list .c-tab__list__item.is-selected, .c-tab__list__dropdown .c-tab__list__item.is-selected {border-bottom-color: #61d83a; color: #2a97f7;};');
addGlobalStyle('.c-tab__list .c-tab__list__item.is-selected:after, .c-tab__list__dropdown .c-tab__list__item.is-selected:after {background-color: #212121; color: #2a97f7; border-color: #2a97f7;};');
addGlobalStyle('.event {border-top: 1px solid #2a97f7;};');
addGlobalStyle('.event.is-new {background-color: #303030; border-left-color: #61d83a;};');
addGlobalStyle('.event.is-new .is_new_flag {color: #61d83a;};');
addGlobalStyle('#editor-tooltip {background-color: #424242; border: 1px solid #61d83a; };');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment {border:1px solid #61d83a; background-color: #212121;};');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner:before {border-bottom: 14px solid #3d7cdc;};');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner:after {border-bottom: 12px solid #3d7cdc;};');
addGlobalStyle('.comment_input .zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner {background-color: #424242;};');

//Ticket View > Social Tickets
addGlobalStyle('.comment_input:not(.is-public) textarea {background-color: #212121 !important; border: 1px solid #61d83a; color: #2a97f7;};');
addGlobalStyle('.classic_input:focus, .ember-text-field:focus, .ember-text-area:focus {border-color: #61d83a !important;};');
addGlobalStyle('.comment_input textarea {background-color: #4f4f4f; color: #2a97f7;};');
addGlobalStyle('.comment_input .comment-twitter-identity {color: #61d83a;};');
addGlobalStyle('.comment_input .twitter-handle-picker .zd-selectmenu-root span.handle {color: #2a97f7;};');
addGlobalStyle('.comment_input .twitter-handle-picker .zd-selectmenu-root span {color: #61d83a;};');
addGlobalStyle('.section.ticket .audits:not(.show-audits) .twitter:hover {background-color: #303030;};');


//Ticket View > Events
addGlobalStyle('.event .audit-events {background: #303030;};');
addGlobalStyle('.event .audit-events .info label {color: #61d83a;};');

//Ticket View > Footer
addGlobalStyle('.ticket .ticket-resolution-footer {background: #212121; border-top: 1px solid #3d7cdc; border-left: 1px solid #3d7cdc;};');
addGlobalStyle('footer .object_options .dropdown-toggle, .footer .object_options .dropdown-toggle {color: #2a97f7;};');
addGlobalStyle('.ticket_submit_buttons .save strong {color: #2a97f7;};');
addGlobalStyle('.btn.btn-primary:hover, .btn.btn-inverse:hover {background-color: #303030; color:#61d83a;};');
addGlobalStyle('.ticket_submit_buttons li:hover:not(.disabled) {background-color: #424242;};');
addGlobalStyle('.ticket_submit_buttons li.status:not(.disabled) {color: #2a97f7;};');
addGlobalStyle('.macro-selector .zd-selectmenu-base-content {color: #2a97f7;};');
addGlobalStyle('.macro-selector .zd-menu-item > a {color: #2a97f7 !important;};');
addGlobalStyle('.zd-selectmenu-base {background-color: #424242; border: 1px solid #2a97f7;};');
addGlobalStyle('.zd-menu-list-holder {background-color: #424242;};');
addGlobalStyle('.zd-menu-item {background-color: #424242;};');
addGlobalStyle('.zd-menu-item > a {color: #2a97f7;};');
addGlobalStyle('.zd-menu-root:first-child .zd-menu-label a {border-bottom: 1px solid #61d83a; color: #61d83a !important;};');
addGlobalStyle('.macro-selector .zd-item-focus {background-color: #303030;};');
addGlobalStyle('.zd-menu-item.zd-item-focus a {color: #61d83a !important;};');
addGlobalStyle('.macro-selector .zd-menu-item.zd-menu-link:not(.zd-item-focus) > a {color: #2a97f7 !important;};');
addGlobalStyle('.macro-selector .zd-menu-root {background-color: #424242;};');
addGlobalStyle('.macro-selector:hover .zd-selectmenu-base-content {color: #61d83a;};');
addGlobalStyle('.btn.btn-primary, .btn.btn-inverse {background-color:#404040;};');
addGlobalStyle('footer .object_options .dropdown-toggle:hover, .footer .object_options .dropdown-toggle:hover {color: #61d83a;};');
addGlobalStyle('.index__c-btn___1jmsn.index__c-btn--primary___3nbMO, .index__c-btn___1jmsn.index__is-selected___3_GHf {background-color: #404040 !important; color: #2a97f7;};');
addGlobalStyle('.index__l-btn-group___13ccZ .index__c-btn--primary___3nbMO.index__c-btn--primary___3nbMO, .index__l-btn-group___13ccZ .index__c-btn--primary___3nbMO.index__is-active___1BWHk.index__is-active___1BWHk, .index__l-btn-group___13ccZ .index__c-btn--primary___3nbMO.index__is-hovered___FcBpC.index__is-hovered___FcBpC, .index__l-btn-group___13ccZ .index__c-btn--primary___3nbMO:active:active, .index__l-btn-group___13ccZ .index__c-btn--primary___3nbMO:hover:hover, .index__l-btn-group___13ccZ .index__c-btn___1jmsn.index__is-disabled___dBwMh.index__is-disabled___dBwMh, .index__l-btn-group___13ccZ .index__c-btn___1jmsn:disabled:disabled {border-left-color: #2a97f7;};');
addGlobalStyle('.index__c-btn___1jmsn.index__is-hovered___FcBpC.index__is-hovered___FcBpC, .index__c-btn___1jmsn:hover:hover {background-color: #303030; color: #61d83a;};');
addGlobalStyle('.index__c-menu___4Vp4s {border: 1px solid #61d83a; background-color: #404040;};');
addGlobalStyle('.index__c-menu__item___1VmSc.index__is-focused___g7yDa, .index__c-menu__item___1VmSc.index__is-hovered___3cIPG, .index__c-menu__item___1VmSc:not(.index__c-menu__item--header___2OHN9):focus, .index__c-menu__item___1VmSc:not(.index__c-menu__item--header___2OHN9):hover {background-color: #383838;};');
addGlobalStyle('.index__c-menu__item___1VmSc:not(.index__c-menu__item--add___3ZqhT) {color: #3d7cdc;};');

//Dashboard > Header
addGlobalStyle('.main_panes > header h1, .workspace > header h1 {color: #2a97f7;};');

//Dashboard > Activity Feed
addGlobalStyle('.activities h4, .activities .no-updates {color: #61d73a;};');
addGlobalStyle('.activities .item {border: 1px solid #61d83a; background-color: #424242};');
addGlobalStyle('.activities .description {color: #2a97f7;};');
addGlobalStyle('.activities .description strong {color: #61d83a;};');
addGlobalStyle('.activities .comment_value {color: #2a97f7;};');
addGlobalStyle('.activities time {color: #61d83a};');

//Dashboard > Main Panel > Ticket Stats
addGlobalStyle('.indicators {background-color: #303030; border-bottom: 1px solid #61d83a;};');
addGlobalStyle('.indicators h4 {color: #2a97f7;};');
addGlobalStyle('.indicators h4 > span {color: #61d83a};');
addGlobalStyle('.indicators ul {background-color: #424242; border: 1px solid #61d83a;};');
addGlobalStyle('.indicators .cell-value {color: #2a97f7;};');
addGlobalStyle('.indicators .cell-title {color: #61d83a;};');

//Dashboard > Main Panel > Details
addGlobalStyle('h4.list-heading {background-color: #424242; border-bottom: 1px solid #61d83a; color: #2a97f7;};');
addGlobalStyle('h4.list-heading .link {color: #61d83a;};');
addGlobalStyle('.dashboard .filter-grid-list {background-color: #424242;};');

//Ticket List View > Sidebar
addGlobalStyle('.main_panes > .pane.left, .workspace > .pane.left {background-color: #303030;};');
addGlobalStyle('section.filters .left header h1, section.user_filters .left header h1, section.incidents .left header h1 {color: #3d7cdc !important; border-bottom: 1px solid #61d83a !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.selected, .user_filters > .pane.left ul.filters li.selected, .user > .pane.left ul.filters li.selected {background-color: #424242 !important; color: #61d83a !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li a, .user_filters > .pane.left ul.filters li a, .user > .pane.left ul.filters li a {color: #2a97f7 !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.legacy-styling .count, .user_filters > .pane.left ul.filters li.legacy-styling .count, .user > .pane.left ul.filters li.legacy-styling .count {color: #2a97f7 !important;};');
addGlobalStyle('.filters > .pane.left .filter-group-heading, .user_filters > .pane.left .filter-group-heading, .user > .pane.left .filter-group-heading {border-bottom: 1px dotted #61d83a !important; color: #3d7cdc; !important};');
addGlobalStyle('.filters > .pane.left .filters.more, .user_filters > .pane.left .filters.more, .user > .pane.left .filters.more {border-top: 1px dotted #61d83a !important;};');
addGlobalStyle('.filters > .pane.left .filters.more a, .user_filters > .pane.left .filters.more a, .user > .pane.left .filters.more a {color: #3d7cdc !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li:not(.selected):hover, .user_filters > .pane.left ul.filters li:not(.selected):hover, .user > .pane.left ul.filters li:not(.selected):hover {background-color: #424242 !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.suspended_tickets a, .filters > .pane.left ul.filters li.deleted_tickets a, .user_filters > .pane.left ul.filters li.suspended_tickets a, .user_filters > .pane.left ul.filters li.deleted_tickets a, .user > .pane.left ul.filters li.suspended_tickets a, .user > .pane.left ul.filters li.deleted_tickets a {color: #bd322c !important;};');

//Ticket List View > Focused Panel
addGlobalStyle('section.filters .right header, section.user_filters .right header, section.incidents .right header {background-color: #424242;};');
addGlobalStyle('.split_pane.collapsible .pane.right {background-color: #424242;};');
addGlobalStyle('section.filters .right header h1, section.user_filters .right header h1, section.incidents .right header h1 {color: #2a97f7;};');
addGlobalStyle('section.filters .right header .header-count, section.user_filters .right header .header-count, section.incidents .right header .header-count {color: #61d83a;};');
addGlobalStyle('.filter_tickets th a, .filter_tickets td a {color: #2a97f7 !important;};');
addGlobalStyle('.filter_tickets th, .filter_tickets td {color: #2a97f7 !important;};');
addGlobalStyle('.filter_tickets th {color: #61d83a !important;};');
addGlobalStyle('.filter_tickets:not(.deleted) .regular:hover td {background-color: #303030 !important;};');
addGlobalStyle('.filter_tickets td {border-top: 1px solid #a0a0a0;};');
addGlobalStyle('.filter_tickets:not(.deleted) .regular:hover td a, .filter_tickets:not(.deleted) .regular:hover td .link {color: #61d83a !important;};');
addGlobalStyle('.LRv {color: #2a97f7 !important;};');
addGlobalStyle('.LRbm {background-color: #404040 !important;};');
addGlobalStyle('.LRck:hover {color: #2a97f7 !important; text-decoration: none !important;};');
addGlobalStyle('.LRbg {background-color: #404040 !important;};');
addGlobalStyle('.LRce {background color: #404040 !important;};');

//Ticket List View > Hover Popover
addGlobalStyle('.ticket_summary .popover-inner {border: 1px solid #61d83a !important;};');
addGlobalStyle('.ticket_summary h3 {color: #61d83a !important; background-color: #303030 !important;};');
addGlobalStyle('.popover-content {background-color: #303030 !important;};');
addGlobalStyle('.ticket_summary .popover-content {color: #2a97f7 !important;};');
addGlobalStyle('.ticket_summary .popover-content p {color: #2a97f7 !important;};');
addGlobalStyle('.ticket_summary .last-comment-header, .ticket_summary .next-sla-header, .ticket_summary .comments-header {color: #61d83a !important;};');
addGlobalStyle('.ticket_summary .summary-date {color: #61d83a !important;};');
addGlobalStyle('.ticket_summary .other-viewers {background-color: #212121 !important; color: #61d83a !important; border-bottom: 1px solid #61d83a !important;};');
addGlobalStyle('.ticket_summary .comment.private-comment {border: 1px solid #61d83a !important; background-color: #212121 !important;};');
addGlobalStyle('.action_button {color: #61d83a;};');
addGlobalStyle('.LRbn:hover {background-color: #303030 !important;};');
addGlobalStyle('.LRcs {background-color: #404040 !important;};');
addGlobalStyle('.LRcr {border-color: #61d83a !important; background-color: #404040 !important;};');
addGlobalStyle('.LRdk LRdl LRdm span {color: #61d83a !important;};');
addGlobalStyle('.LRu.LRdq.LRdr.LRdp {color: #2a97f7 !important;};');
addGlobalStyle('.LRab {color: #61d83a !important;};');
addGlobalStyle('.LRab span{color: #2a97f7 !important;};');
addGlobalStyle('.LRds {color: #2a97f7 !important;};');
addGlobalStyle('.LRdz {color: #2a97f7 !important;};');
addGlobalStyle('.LRco.LRcp.LRcq.LRcr.LRu.LRcs.LRav h3 {background-color: #404040 !important;};');
addGlobalStyle('.LRci.LRcj.LRck.LRcl.LRu.LRcm.LRav h3 {background-color: #404040 !important;};');
addGlobalStyle('.LRcr.LRcs.LRct.LRcj.LRu.LRcu.LRav h3 {background-color: #404040 !important;};');
addGlobalStyle('.LRdh {color: #61d83a !important;};');
addGlobalStyle('.LRee {background-color: #303030 !important;};');
addGlobalStyle('.LRed {border-color: #61d83a !important;};');
addGlobalStyle('.LRcm {background-color: #404040 !important;};');
addGlobalStyle('.LRcl {border-color: #61d83a !important;};');
addGlobalStyle('.LRbh:hover {background-color: #404040 !important;};');
addGlobalStyle('.LRdb {color: #61d83a !important;};');
addGlobalStyle('.LRdj {color: #2a97f7 !important;};');
addGlobalStyle('.LRdm {color: #2a97f7 !important;};');
addGlobalStyle('.LRdy {background-color: #303030 !important; color: #2a97f7 !important;};');
addGlobalStyle('.LRdx {border-color: #61d83a !important;};');
addGlobalStyle('.LRdv {color: #2a97f7 !important;};');
addGlobalStyle('.LRbd:hover {background-color: #303030 !important;};');
addGlobalStyle('.LRci {background-color: #404040 !important;};');
addGlobalStyle('.LRch {border-color: #61d83a !important;};');
addGlobalStyle('.LRcv {color: #2a97f7 !important;};');
addGlobalStyle('.LRcw {background-color: #404040 !important;};');

//Settings > Main Page
addGlobalStyle('.stacked_menu_settings .section .title {border-bottom: 1px solid #61d83a; color: #2a97f7;};');
addGlobalStyle('#admin_content .overview header {background-color: #303030 !important; border-bottom: 1px solid #61d83a !important;};');
addGlobalStyle('#admin_content .overview header h1 {color: #2a97f7 !important;};');
addGlobalStyle('#admin_content .overview header .right {color: #61d83a !important;};');
addGlobalStyle('#admin_content .overview header .right a {color: #2a97f7 !important;};');
addGlobalStyle('#admin_content .overview .overview_content {background-color: #424242;};');
addGlobalStyle('#admin_content .overview h3 {color: #2a97f7 !important; border-bottom: 1px solid #61d83a;};');
addGlobalStyle('#admin_content .overview .overview_content .feature_usages .feature_usage {border: 1px solid #61d83a !important;};');
addGlobalStyle('#admin_content .overview .overview_content a {color: #2a97f7 !important;};');
addGlobalStyle('#admin_content .overview .overview_content .feature_usages .feature_usage .stat {color: #61d83a !important;};');
addGlobalStyle('#admin_content {background-color: #424242;};');
addGlobalStyle('#admin_content .overview .overview_content .system_updates li:hover {background-color: #303030 !important;};');
addGlobalStyle('#admin_content .overview .overview_content a:hover {color: #61d83a !important; text-decoration: none !important;};');
addGlobalStyle('#admin_content .overview .overview_content .system_updates .controls .newer, #admin_content .overview .overview_content .system_updates .controls .older {border: 1px solid #61d83a !important; box-shadow: none !important;};');
addGlobalStyle('.nav-stacked > li.active a, .nav-stacked > li.active a:hover {color: #61d83a; background-color: #212121; box-shadow: none !important;};');
addGlobalStyle('.nav-stacked > li a:hover {background-color: #212121;};');

//Settings > Macros
addGlobalStyle('.macros-page {background-color: #424242;};');
addGlobalStyle('.macros-page .page__header header h1 {color: #61d83a !important;};');
addGlobalStyle('.u-fg-oil {color: #61d83a !important;};');
addGlobalStyle('.macros-page .page__description {color: #2a97f7;};');
addGlobalStyle('.rule-search .z-field--input--text {background-color: #303030; color: #2a97f7;};');
addGlobalStyle('.z-field--date__input:focus, .z-field--input--text:focus, .z-field--textarea:focus {border-color: #61d83a !important;};');
addGlobalStyle('.z-field--date__input, .z-field--input--text, .z-field--textarea {border: 1px solid #2a97f7;};');
addGlobalStyle('.rule-search .z-field--input--text::placeholder {color: #2a97f7;};');
addGlobalStyle('.rule-actions__tabs {border-bottom: 1px solid #61d83a;};');
addGlobalStyle('.z-tab.active {border-bottom: 3px solid #61d83a !important; color: #2a97f7;};');
addGlobalStyle('.z-tab {color: #2a97f7;};');
addGlobalStyle('.z-dropdown__toggle {color: #61d83a;};');
addGlobalStyle('.z-dropdown__menu {background-color: #303030; };');
addGlobalStyle('.z-dropdown__menu-item {color: #2a97f7};');
addGlobalStyle('.z-dropdown__menu-item:not(.z-dropdown__menu-item--disabled):focus, .z-dropdown__menu-item:not(.z-dropdown__menu-item--disabled):hover {background-color: #424242; color: #61d83a;};');
addGlobalStyle('.rule-table__row .rule-table__data a, .rule-table__row .rule-table__header {color: #2a97f7;};');
addGlobalStyle('.rule-table__row .rule-table__data[data-column-id=name] a {color: #2a97f7;};');
addGlobalStyle('.rule-table__row.hover:not(.rule-table__headers) {background-color: #303030;};');
addGlobalStyle('.rule-table__row .rule-table__data[data-column-id=name] a:hover {color: #61d83a; text-decoration: none;};');

//Settings > Macros > Add Macro
addGlobalStyle('.z-field__label__text {color: #2a97f7;};');
addGlobalStyle('.rule-page--edit .z-field--input--text[name=title], .rule-page--edit .z-field--textarea[name=description] {background-color: #303030; color: #61d83a;};');
addGlobalStyle('.rule-page--edit .z-field--input--text[name=title], .rule-page--edit .z-field--textarea[name=description]::placeholder {color: #61d83a !important;};');
addGlobalStyle('.z-fieldset__legend__heading {color: #61d83a;};');
addGlobalStyle('.z-fieldset__legend__description {color: #2a97f7;};');
addGlobalStyle('.c-btn.c-btn--primary:not(:disabled) {border-color: none; color: #2a97f7;};');
addGlobalStyle('.c-btn.c-btn--primary:not(:disabled):focus, .c-btn.c-btn--primary:not(:disabled):hover, .c-btn.c-btn--primary:not(:disabled):hover:hover {border-color: #61d83a; color: #61d83a;};');
addGlobalStyle('.z-card {background-color: #303030; border: 1px solid #61d83a;};');
addGlobalStyle('.zendesk-editor--plaintext-box .zendesk-editor--plain-text-comment, .zendesk-editor--rich-text-comment {color: #2a97f7; border: 1px solid #61d83a;};');


//Search
addGlobalStyle('.workspace.search {background-color: #424242 !important};');
addGlobalStyle('.query-box .query-container .query-field {border: 1px solid #61d83a !important; background-color: #303030; color: #2a97f7;};');
addGlobalStyle('body.voltron .query-box.is-focused input, body.voltron .query-box.is-focused .clear-search {border: 1px solid #61d83a !important;};');
addGlobalStyle('.query-box .query-container .clear-search {border: 1px solid #61d83a !important; background-color: #303030 !important; color: #61d83a;};');
addGlobalStyle('body.voltron .query-box.is-focused input, body.voltron .query-box.is-focused .clear-search {border: 1px solid #61d83a !important;};');
addGlobalStyle('.query-box .query-container .advanced-search {border: 1px solid #61d83a !important; background-color: #303030 !important; color: #2a97f7 !important;};');
addGlobalStyle('.workspace.search nav.content-type-nav {border-bottom: 1px solid #61d83a;};');
addGlobalStyle('.navigation-item {color: #2a97f7 !important;};');
addGlobalStyle('.navigation-item.active {border-bottom-color: #61d83a;};');
addGlobalStyle('.workspace.search nav.content-type-nav {border-bottom: 1px solid #61d83a !important;};');
addGlobalStyle('.navigation-item:hover {border-bottom-color: #2a97f7 !important;};');
addGlobalStyle('.ticket_summary .popover-header {background-color: #303030 !important; border-bottom: 1px solid #61d83a !important; color: #2a97f7;};');
addGlobalStyle('.pagination a {color: #2a97f7; border: 1px solid #212121;};');
addGlobalStyle('.pagination a:hover, .pagination .active a {background-color: #303030;};');
addGlobalStyle('.pagination .active a {color: #61d83a;};');
addGlobalStyle('.pagination a:hover {color: #61d83a; text-decoration: none !important;};');

//Search > Filters
addGlobalStyle('.query-box .query-builder {border-color: #61d83a};');
addGlobalStyle('.z-tooltip {background-color: #303030;};');
addGlobalStyle('.query-box .query-type-selector .query-label {color: #61d83a !important;};');
addGlobalStyle('.query-box .query-modifier-field label {color: #2a97f7 !important;};');
addGlobalStyle('.zd-tag-menu-root {border: 1px solid #61d83a;};');
addGlobalStyle('.zd-tag-menu-root {background-color: #212121;};');
addGlobalStyle('.zd-selectmenu-root, .zd-searchmenu-root, .zd-combo-selectmenu-root {background-color: #212121;};');
addGlobalStyle('.current_collaborators .zd-tag-menu-root, .user-picker-menu-base .zd-tag-menu-root {background-color: #212121;};');

//User View
addGlobalStyle('.mast {background: #404040;};');
addGlobalStyle('.navigation-item:hover {text-decoration: none !important;};');
addGlobalStyle('.user .devices.scroll_content {background: #404040;};');
addGlobalStyle('.property_box {background: #404040;};');
addGlobalStyle('.details.property_box label {color: #61d83a;};');
addGlobalStyle('.details.property_box .item {color: #2a97f7;};');
addGlobalStyle('.left.pane .log > span {color: #61d83a;};');
addGlobalStyle('.left.pane .log {color: #2a97f7;};');
addGlobalStyle('.editable input[type="text"].ui-state-disabled, .editable input[type="text"].disabled {color: #2a97f7 !important};');


//Internal Note Text Input Box Color
addGlobalStyle('.rich_text .comment_input:not(.is-public) div[contenteditable] {background: #303030 !important; color: #2a97f7; border: 2px solid #61d83a;}');
//Public Reply Text Box Color
addGlobalStyle('.rich_text .comment_input.is-public div[contenteditable] {background: #4f4f4f;};');
//Previous Internal Notes Text Box Color
addGlobalStyle('.event:not(.is-public) .comment{background: #212121 !important; border: 2px solid #61d83a; color: #2a97f7;}');