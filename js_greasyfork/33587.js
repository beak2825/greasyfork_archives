//
// Written by Glenn Wiking
// Script Version: 1.1.1a
// Date of issue: 09/16/17
// Date of resolution: 09/16/17
//
// ==UserScript==
// @name        ShadeRoot XTube
// @namespace   SRXT
// @description Eye-friendly magic in your browser for XTube
// @version     1.1.1a
// @icon        https://i.imgur.com/RJWWjiZ.png

// @include        http://*.xtube.*
// @include        https://*.xtube.*
// @downloadURL https://update.greasyfork.org/scripts/33587/ShadeRoot%20XTube.user.js
// @updateURL https://update.greasyfork.org/scripts/33587/ShadeRoot%20XTube.meta.js
// ==/UserScript==

function ShadeRootXT(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootXT(
	// BG 1
	'body, body .wrapper {border-top: solid 24px #321111 !important; background: #150d0d !important;}'
	+
	// OBJ 1
	'.teaser, .mainNavWrapper > div > ul > li a.active, .mainNavWrapper > div > ul > li a:active, .mainNavWrapper > div > ul > li a:focus, .mainNavWrapper > div > ul > li a:hover, .mainNavWrapper > div > ul > li:hover > a, .mainNavWrapper .rollOutBox, .pageFooter .rollOutBox, .pageHeader .rollOutBox, .v3MobileWrapper .rollOutBox {background: #3b1111 !important;}'
	+
	// TEXT 1
	'.teaser h3, .teaser h3 a, label, span, h1, h2, h3, h4, h5, h6, option, select, textarea, input, dl.group dt, dl.line dt, ol.group dt, ol.line dt, ul.group dt, ul.line dt, .htmlEditor, article p, body, button, .smallFont {color: #e9cbd3 !important;}'
	+
	// LINK 1
	'a, .contentStats dd, .fancybox-skin {color: #d81b1c !important;}'
	+
	// LINK 2
	'a:hover {color: #931415 !important;}'
	+
	// BANNER
	'.mainNavWrapper, .bottom li > *, .tab-header {background: #662525 !important;}'
	+
	// OBJ 2
	'.profileHeader, .cntBox {background-color: #302828 !important;}'
	+
	'.btnGroup {border-top: 3px solid #2a0c0c !important;}'
	+
	'.btn-bright, .btn-bright-grey, .collapseWrapper header, .btn-secondary {color: #e9cbd3 !important; background-color: #2c1e1e !important; border-color: #4e0e0e !important;}'
	+
	'.scrollTopBtn i {border-top: 2px solid #7d1515 !important;}'
	+
	'.styledSelect {color: #ead0cb !important; border: 1px solid #800909 !important; background-color: #411111 !important;}'
	+
	'form {padding-left: 7px !important; background-color: #6c1414 !important;}'
	+
	'.mainNavWrapper form .form-control, .pageFooter form .form-control, .pageHeader form .form-control, .v3MobileWrapper form .form-control {background-color: #574a4a !important; color: #ddcbc8 !important;}'
	+
	'.rollOutBox {border-top-color: #531919 !important;}'
	+
	'.categories span {background-color: rgba(36, 22, 22, 0.6) !important;}'
	+
	'img, svg {opacity: .9 !important; filter: brightness(.92) !important;}'
	+
	'.rollOutBox.autoCompleteSearch dd a:focus, .rollOutBox.autoCompleteSearch dd a:hover {background-color: #2a1c1c !important; color: #dec8c8 !important;}'
	+
	'.mainNavWrapper .btn-secondary, .pageFooter .btn-secondary, .pageHeader .btn-secondary, .v3MobileWrapper .btn-secondary, menu ul li a, .authWrapper h3 {color: #e6d2d0 !important; background-color: #781e0b !important; border-color: #a21f0f !important;}'
	+
	'.mainNavWrapper .btn-white, .pageFooter .btn-white, .pageHeader .btn-white, .v3MobileWrapper .btn-white, .btnGroup .btn {background-color: #272121 !important; border-color: #831818 !important;}'
	+
	'.showCount::after, .cntBox, .webmasterTitleBackground {background-color: #443535 !important;}'
	+
	'.btn-outline.bright {background-color: #211818 !important; border-color: #571c1c !important;}'
	+
	'.contentStats dt, .shareWrapper li a, .btnGroup .btn {border: solid #621d1d !important; color: #e9d6d6 !important;}'
	+
	'.tabsWrapper > menu ul {border-bottom: 5px solid #2a0d0d !important;}'
	+
	'.shareWrapper ul {border-top: 2px solid #302828 !important;}'
	+
	'.htmlEditor, .portalchat-wrapper, .pc-friendlist-wrapper {background-color: #320f0f !important; border: 1px solid #871212 !important;}'
	+
	'li:first-child .btn {border-left: 1px solid #650f0f !important;}'
	+
	'.toolbar .btn {border: 1px solid #831515 !important; background-color: #231818 !important;}'
	+
	'.contentMatchNotPreference {background: #35110d !important; color: #c9b1b1 !important; font-size: 22px !important;}'
	+
	'aside .cntPanel footer, aside .tabsWrapper footer {border-top: 2px solid #1d1212 !important; background-color: #331c1c !important;}'
	+
	'.profileImages li:first-child {border: 5px solid #711717 !important;}'
	+
	'.activities .activity, .comment {background-color: #271818 !important;}'
	+
	'.facts li {color: #D82E2E !important; border-color: #D82E2E;}'
	+
	'dl.basic dt, dl.group dt, dl.line dt, ol.basic dt, ol.group dt, ol.line dt, ul.basic dt, ul.group dt, ul.line dt {color: #cf1919 !important;}'
	+
	'.avatar img {border: 1px solid #cb2020 !important;}'
	+
	'.giftList .description {border-top: 2px solid #631717 !important;}'
	+
	'.authOverlay .tabContent, .selectableButtonList .highlightCredits, .selectedCredits .highlightCredits {background: #2a1c1c !important;}'
	+
	'.greenFont, .greenFont * {color: rgba(215, 51, 32, 0.8) !important;}'
	+
	'body .fancybox-inner .authWrapper menu, body .fancybox-inner .tabsWrapper menu {background-color: #2a1a1a !important;}'
	+
	'form .form-control {border: 1px solid #931212 !important; background-color: #301e1e !important;}'
	+
	'.alert-danger {background-color: #421e1e !important; border-color: #781021 !important; color: #e4c9c9 !important;}'
	+
	'.tabBtn:hover, .entry-content a:hover, .entry-content a:focus, .entry-content a:active, .entry-content a {color: #d7b5b5 !important;}'
	+
	'.menu li a {color: #e1c6c6 !important;}'
	+
	'.tab-content {border: 1px solid #921818 !important; background-color: #2c1919 !important;}'
	+
	'.portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li a:active, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li a:focus, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li a:hover, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li.active a, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li.active a:active, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li.active a:focus, .portalchat-wrapper .friendlist-toggle-view.nav-pills.nav-row li.active a:hover {background-color: #362626 !important;}'
	+
	'.nav-row li.active {border-bottom-color: #571414 !important; border-left: 1px solid #631818 !important; border-bottom: 1px solid #801717 !important;}'
	+
	'.nav-row li a, .pc-toggle {background-color: #7e3d3d !important;}'
	+
	'.alert-info, .popover, .fade, .left, .in, .pc-infopanel {background-color: #3e312f !important; border-color: #752517 !important; color: #e0beba !important;}'
	+
	'.status-menu {border: 1px solid #651212 !important;}'
	+
	'.dropdown-menu, .popover *, .fade *, .left *, .in *, .pc-infopanel * {background-color: #301010 !important;}'
	+
	'.dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover, .pc-toolbar {background-color: #201010 !important; color: #EDD !important;}'
	+
	'.nav-row li {border-left: 1px solid #752121 !important; border-bottom: 1px solid #511818 !important;}'
	+
	'.pc-friendlist li:nth-child(2n+1) {background-color: #1b0c0c !important;}'
	+
	'.pc-toplist .icon, .alert, .activities .activity, .notifications .activity {background-color: #2c1414 !important;}'
	+
	'.alert-fill {background-color: #951a1a !important;}'
	+
	'.method, .selectedOptions li, .credit, .vip, .alert-warning {background: #2f1919 !important; border: 1px solid #230909 !important;}'
	+
	'.asideNav a {background-color: #291919 !important; border-color: #3e1919 !important;}'
	+
	'.asideNav a.active, .asideNav a:active, .asideNav a:hover, .open > .asideNav a.dropdown-toggle {background-color: #4e1414 !important; border-color: #720b0b !important;}'
	+
	'.mainNavWrapper .notificationBox footer, .pageFooter .notificationBox footer, .pageHeader .notificationBox footer, .v3MobileWrapper .notificationBox footer {background-color: #481414 !important;}'
	+
	'.mainNavWrapper .notificationBox li::before, .pageFooter .notificationBox li::before, .pageHeader .notificationBox li::before, .v3MobileWrapper .notificationBox li::before {background: #270b0b !important;}'
	+
	'.mainNavWrapper .btn-primary-outline, .pageFooter .btn-primary-outline, .pageHeader .btn-primary-outline, .v3MobileWrapper .btn-primary-outline, .btn-primary-outline.active, .btn-primary-outline:active, .btn-primary-outline:hover, .open > .btn-primary-outline.dropdown-toggle, .btn-primary-outline, .btn-sm {background-color: #2a0f0f !important; border-color: #9f1919 !important;}'
	+
	'.basic tbody td {border: solid #500d0d !important; background-color: #301414 !important;}'
	+
	'.btn-outline {background-color: #3b1d1d !important; border-color: #6b0d0d !important;}'
	+
	'.alert-success {border-color: #832b18 !important; color: #d5b8c0 !important;}'
	+
	'.site-header {border-bottom: 3px solid #691414 !important;}'
	+
	'#th-search-form input[type="text"] {background: #3e2d2d !important;}'
	+
	'.widget_recent_entries ul li, .widget_pages ul li, .widget_categories ul li, .widget_archive ul li, .widget_nav_menu ul li, .widget_recent_comments ul li, .widget_meta ul li, .widget_nav_menu ul li {border-bottom: 1px solid #602525 !important;}'
	+
	'.paging-navigation {background: hsl(0, 47.5%, 12%) !important;}'
	+
	'.current {background-color: #2c1717 !important;}'
	+
	'a.page-numbers, a.page-numbers:hover, span.page-numbers {color: #edd7d7 !important; background-color: #d1173b !important;}'
	+
	'.current {color: #541C1C !important;}'
	+
	'.sitemapCollapse a {background-color: #311 !important;}'
	+
	'.sitemap ul a, .sitemap ul li.sitemapCollapse a {background-color: #4e1313 !important; color: #D7BABA !important;}'
	+
	'.sitemapCollapse li a:hover {background-color: #4e1313 !important; color: #D7BABA !important;}'
	+
	'.sitemap ul > li > ul li::after, .sitemap ul > li > ul li::before {background-color: #8d2121 !important;}'
	+
	'.active:first-child a {border-left-color: #652727 !important;}'
	+
	'.nav-pills > li.active > a, .nav-pills > li.active > a:focus, .nav-pills > li.active > a:hover {background-color: #441010 !important;}'
	+
	'.mg-mailbox .nav-pills > li a {border-right: 1px solid #721f1f !important; border-top: 1px solid #6e1b1b !important; background: #2d1515 !important;}'
	+
	'.conversations-wrapper, .mg-mailbox .conversations-list, .mg-mailbox .messages-list, .mg-mailbox .conversations-list, .mg-mailbox .messages-list {background-color: #261212 !important;}'
	+
	'.mg-mailbox .messages-list {border-left: 40px solid #261212 !important;}'
	+
	'.conversation-header, .message-form {background-color: #381919 !important; border-bottom: 1px solid #681e1f !important;}'
	+
	'.mg-mailbox .btn-border-success, .mg-mailbox .btn-default {background-color: #841717 !important; border-color: #4b0e0e !important;}'
	+
	'.tab-controls .btn:hover {background: #451a1a !important;}'
	+
	'.tab-body .messages {border-bottom: 15px solid #391313 !important; background-color: #391313 !important;}'
	+
	'.pc-status.online {border-left-color: #b0523d !important;}'
	+
	'.tab-body .tab-input {border-top: 1px solid #5d2218 !important; border-bottom: 8px solid #391313 !important;}'
	+
	'.tab-body .tab-input textarea {background-color: #2d1717 !important;}'
	+
	'.tab-body .tab-input .btn {background-color: #511414 !important;}'
	+
	'.pc-tab-wrapper .pc-conversation-tab {background-color: #5c1111 !important; border: 1px solid #6b2525 !important;}'
	+
	'.user-info .price, .f_left {color: #e1c3c3 !important;}'
	+
	'.message.is-conversation.is-active {background-color: #392525 !important;}'
	+
	'.message.is-conversation {border-bottom: 2px solid #741717 !important;}'
	+
	'.tab-body .messages li.right {background-color: #c63a1c !important;}'
	+
	'.message.is-message.right .content {background-color: #5f1a12 !important;}'
	+
	'.mg-mailbox .message-actions a:active, .mg-mailbox .message-actions a:focus, .mg-mailbox .message-actions a:hover {background: #2d1717 !important;}'
	+
	'.content_w {background: #411414 !important; border-left: 1px solid #860a0a !important; border-right: 1px solid #860a0a !important;}'
	+
	'.bottom_w, .bottom_l, .bottom_r {background: none !important;}'
	+
	'.color_dark_gray {color: #d7a9a9 !important;}'
	+
	'.teaser h3, .teaser h3 a, label, span, h1, h2, h3, h4, h5, h6, option, select, textarea, input, dl.group dt, dl.line dt, ol.group dt, ol.line dt, ul.group dt, ul.line dt, .htmlEditor, article p, body, button, .smallFont {background: #180c0c !important;}'
	+
	'.message.is-conversation {background-color: #380f0f !important;}'
);