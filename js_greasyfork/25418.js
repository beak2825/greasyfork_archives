//
// Written by Glenn Wiking
// Script Version: 0.1.1b
// Date of issue: 11/11/16
// Date of resolution: 11/11/16
//
// ==UserScript==
// @name        ShadeRoot PhotoBucket
// @namespace   SRPB
// @description Eye-friendly magic in your browser for Photobucket
// @include     http://*.photobucket.*
// @include     https://*.photobucket.*
// @include     http://*photobucket.*
// @include     https://*photobucket.*

// @version     0.1.1b
// @icon       	http://i.imgur.com/7Z6s7sg.png
// @downloadURL https://update.greasyfork.org/scripts/25418/ShadeRoot%20PhotoBucket.user.js
// @updateURL https://update.greasyfork.org/scripts/25418/ShadeRoot%20PhotoBucket.meta.js
// ==/UserScript==

function ShadeRootPB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPB (
	'html, body, .contentWrapper, .pageFeature, .featureFooter, .site-footer {background: #1B1B1B !important;}'
	+
	'.navbar .subnav, #footer {background-color: #141414 !important;}'
	+
	'.navbar .divider-vertical {border-right: 1px solid #8A8A8A !important;}'
	+ // TEXT COLOR 1
	'body, .navbar .subnav .printCategories a, .navbar .subnav .printCategories p, .breadcrumb, span, a:not(.btn), h1, h2, h3, h4, h5, h6, .subheader, .category-description, .description, .lihpUsername, .row ul li, label, textarea, .modal, font[color="red"], font, .fancyout, .fancyout p, .site-footer__links, .grid__item p {color: #B6B6B6 !important;}'
	+
	'.btn-social, .btn {background-color: #1A1A1A !important;}'
	+
	'#libraryContainer, #footer, .featureFooter {border-top: 1px solid #3B3B3B !important;}'
	+
	'.libraryViewContainer, .siteLinks {border-left: 1px solid #3B3B3B !important;}'
	+
	'.linkcopy, input, .btn-secondary, .btn-icon, .btn-details, select, textarea {background: #414143 !important; border: 1px solid #7A7A7A !important; color: #B6B6B6 !important;}'
	+
	'.paginationBar a:hover:not(.btn) {background-color: #3F3F3F !important; color: #D7D7D7 !important;}'
	+
	'.organizerHandle {border: 2px solid rgba(54, 49, 49, 0.8) !important;}'
	+
	'h2.title.selected, .site-nav {background-color: #363738 !important; border: 1px solid #363738 !important;}'
	+ // TEXT COLOR 2 (DARK)
	'.extraSpecialSignUpLink a, .cart, .count, .signUpBtn span {color: #3E3E3E !important;}'
	+ // LINK COLOR 1
	'footer li a {color: #0EA0DB !important;}'
	+
	'.alert {text-shadow: 0px 1px 0px rgba(77, 77, 77, 0.5) !important;}'
	+ // TEXT COLOR 3
	'.alert, .alert-heading {color: #838383 !important;}'
	+
	'.lihpBtn:hover, .box-inn, .content-header, div[style="background-color:#ffffff; height:55px;"] {background: #353535 !important;}'
	+
	'.barMeter.progress, .member-benefit, .navbar-default {background: #424242 !important;}'
	+
	'#libraryBtn, #uploadBtn, #printBtn, #cancel-album-form, .ordertop {border-color: #454545 !important;}'
	+
	'.free-storage h3 {border-bottom: 1px solid #9B9B9B !important;}'
	+
	'.current-block, .modal {background: #2C2C2C !important;}'
	+
	'.progress-bar, .storageMeterContainer, .upgradeLink, .modal-footer, .dropdownbox, .mainnav ul li:hover a, .mainnav ul li.active a, .paginationBar .active > span {background: #535353 !important;}'
	+
	'.box-outer h3, .box-outer h2, .each-type .image-print {border-bottom: 1px solid #424242 !important;}'
	+
	'.box-outer.active .box-inn, .header-bar {background: #414D51 !important;}'
	+
	'.box-top, .top-text, .logoportion a img {background: #2C718D !important; padding: 0.5em !important;}'
	+
	'.dropdown-menu, .dropdown-menu a {background-color: #1B1B1B !important; border-color: #4B4B4B !important;}'
	+
	'.dropdown-menu .divider {background-color: #5D5D5D !important; border-bottom: 1px solid #5D5D5D !important;}'
	+
	'#aviaryEditor.upload {opacity: .75 !important;}'
	+
	'img {opacity: .9 !important;}'
	+
	'.subscribe-here h4, strong, span[style="color: #ff0000;"], .navbar-default {color: #6F6565 !important;}'
	+
	'.footer-inner, .nav-tabs {border-bottom: 1px solid #333 !important;}'
	+
	'.review-inner {border-top: 2px solid #393939 !important; border-bottom: 2px solid #393939 !important;}'
	+
	'.review-each {border-top: 1px solid #2F2F2F !important;}'
	+
	'.navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {color: #EAEAEA !important; background-color: #5F5F5F;}'
	+
	'.navbar-default, #cancelButton {border-color: #2A2A2A !important;}'
	+
	'.mainnav ul li {border-left: 1px solid #424242 !important;}'
	+
	'.mainnav ul li:last-child {border-right: 1px solid #424242 !important;}'
	+
	'.print-img-dimensions {border-bottom: 1px solid #3C3C3C !important;}'
	+
	'.print-details p {color: #E3E3E3 !important;}'
	+
	'span.selected {border: 3px solid #5A5A5A !important; background: #272727 !important;}'
	+
	'.nav-tabs > li.active > a, .nav-tabs > li.active > a:hover {background: #303030 !important; border-color: #4D4C4C !important;}'
	+
	'.nav-tabs > li > a:not(.btn), #scrambleFilenamesForm, .privacyButton {background: #212121 !important; border: 1px solid #353535 !important;}'
	+
	'.btn-primary, .submit-btn, #cancel-info-form, .header-bar__module, .header-bar__search {border-color: rgb(47, 47, 47) !important;}'
	+
	'.modal-footer {border-top: 1px solid #232323 !important; box-shadow: 0px 1px 0px #262626 inset !important;}'
	+
	'.consumer:hover, .dynamicThumbnail.mediumThumbnail .thumbnailMedia, .dynamicThumbnail.largeThumbnail .thumbnailMedia {background-color: #454545 !important;}'
	+
	'.thumbnailOverlay, .thumbnailImage .thumbnailLink {background-color: rgba(57, 57, 57, 0.1) !important;}'
	+
	'.alert-danger, .alert-error, .alert.global.alert-error {background-color: #272727 !important; border-color: rgb(47, 47, 47) !important;}'
	+
	'.dropdown-menu .active > a, .dropdown-menu .active > a:hover, .mediawrapper {background: #393939 !important;}'
	+
	'#mediaTemplateTarget {background-color: #2C2C2C !important; border: 1px solid #474747 !important;}'
	+
	'.items .item .wrap {background-color: #454545 !important;}'
	+
	'.items .item .wrap.selected, .site-branding-text div a, .site-header__logo a {background-color: #2C6BC9 !important;}'
	+
	'.site-branding-text div a {padding: 0.8em !important;}'
	+
	'#mediaTitle .editable-field.editHover, .mediaDescription .editable-field.editHover {background-color: #363636 !important;}'
	+
	'.detailActions .shareExternal.shareExternal, .shareOther.shareExternal, .menus .oneClickOrderButton {border-right: 1px solid #414040 !important;}'
	+
	'#mediaTemplate .previous, #mediaTemplate .next, span[style="background-color: white;"], #previous .previous, #next .next {background: #0F0F0F !important; border: 1px solid rgb(56, 56, 56) !important;}'
	+
	'.category-list li, .twoTierBlock {background: #151414 !important;}'
	+
	'.community, .section-tree, .subtle-wrap, .article-sidebar section {background: #121212 !important;}'
	+
	'.article-vote-up, .article-vote-down {background: #383838 !important;}'
	+
	'button, [role="button"], [type="button"], [type="submit"], #user .dropdown-toggle {background: transparent linear-gradient(to bottom, #383838 0%, #606060 50%, #353535 100%) !important;}'
	+
	'.headerBlock, .strip.alt {background-color: #272F35 !important;}'
	+
	'.threeTierBlock, .faqTips, .linen, .strip {background-color: #1B1B19 !important;}'
	+
	'.unstyled .automatic, .unstyled .secure, .textcat, #avpw_lftArrow, .avpw_clip {border-right: 1px solid #414141 !important;}'
	+
	'.unstyled .private, .unstyled .secure {border-left: 1px solid #414141 !important;}'
	+
	'.reasons .tipsTricks {background-color: #2F2F2F !important;}'
	+
	'.strip {border-bottom: 1px solid #171717 !important;}'
	+
	'#mobileWebBtn {border-color: #474443 !important;}'
	+
	'.remove-back-color, .box-inn p {color: #BCBCBC !important;}'
	+
	'#footer-navigation ul.dividers > li:nth-child(n+2)::before {border-left: 1px solid #4A4848 !important;}'
	+
	'hr {border-color: #3C3C3C !important;}'
	+
	'.menus .spacer {1px solid #414040 !important;}'
	+
	'span.selectArrow {background-color: rgba(255, 255, 255, 0) !important;}'
	+
	'.details-box {border-color: #393939 !important;}'
	+
	'.bx-viewport, .fancybox-skin {background: #1A1A1A !important;}'
	+
	'.fancybox-overlay {background-color: rgba(18, 18, 18, 0.7) !important;}'
	+
	'.grid-link__sale_price {color: #686868 !important;}'
	+
	'.selectOptions {border: 3px solid #595959 !important; background: #262626 !important;}'
	+
	'.selectOption:hover {background: #1B1B1B !important;}'
	+
	'.mediawrapper table td, .currentView {background: #2C2C2C !important;}'
	+
	'#avpw_canvas_embed {border-top: 1px solid #2C2C2C !important; background-color: #121212 !important;}'
	+
	'#avpw_tool_content_header {border-bottom: 1px solid #2C2C2C !important; box-shadow: 0px 1px 0px 0px #2D2D2D inset !important; background-color: #2F2F2F !important; background-image: -moz-linear-gradient(center top , #3C3C3C, #1D1D1D) !important;}'
	+
	'#avpw_lftArrow {box-shadow: 0px 1px 0px 0px #303030 inset, 1px 0px 0px #303030 inset !important;}'
	+
	'#avpw_lftArrow, #avpw_rghtArrow, .avpw_mode_action_right {background: #7A7A7A !important;}'
	+
	'.avpw_clip, #avpw_footer, .avpw_scroll_strip {background-color: #1E1E1E !important; background-image: -moz-linear-gradient(center top , #8C8C8C, #757575) !important;}'
	+
	'.avpw_mode_action_right {box-shadow: 0px 1px 0px 0px #353535 inset, 2px 0px 0px #262626 inset !important;}'
	+
	'#avpw_rghtArrow:hover:not(.avpw_next_disabled), .avpw_next.avpw_bookend:hover:not(.avpw_next_disabled) {box-shadow: 0px 0px 4px #2A2A2A inset, 0px 0px 10px #444 inset !important;}'
	+
	'.avpw .avpw_icon_label {color: #DBDBDB !important;}'
	+
	'.aviaryEditorContainer #aviaryEditor.upload {background: none !important;}'
	+
	'#avpw_tool_container, .avpw_mode_action_left, .avpw_mode_action_right {box-shadow: 0px 1px 0px 0px #505050 inset, 1px 0px 0px #424242 inset !important;}'
	+
	'#avpw_tool_container, .avpw_mode_action_left, .avpw_mode_action_right {background: #212121 !important;}'
	+
	'.avpw_mode_action_left::after, .avpw_mode_action_right::before {background: #323232 !important;}'
	+
	'#avpw_footer {background-image: -moz-linear-gradient(center top , #262626, #1E1E1E) !important; box-shadow: 0px 1px 0px 0px #363636 inset !important; border-top: 1px solid #1A1717 !important;}'
	+
	'.avpw {border-top: 1px solid #1A1717 !important;}'
	+
	'.avpw *, .avpw a, .avpw a:active, .avpw a:hover, .avpw a:link, .avpw a:visited {color: #C4C9CC !important;}'
	+
	'#avpw_rghtArrow {box-shadow: 0px 1px 0px 0px #303030 inset, 1px 0px 0px #696969 inset !important;}'
	+
	'#avpw_rghtArrow, .avpw_clip {border-left: 1px solid #2A2A2A !important;}'
	+
	'.btn-default {border-color: #565656 !important;}'
);