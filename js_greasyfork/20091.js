//
// Written by Glenn Wiking
// Script Version: 1.0.1a
// Date of issue: 29/02/16
// Date of resolution: 29/02/16
//
// ==UserScript==
// @name        ShadeRoot Dropbox
// @namespace   SRDB
// @description Eye-friendly magic in your browser for Dropbox
// @include     *.dropbox.*

// @version     1.0.1a
// @icon		http://i.imgur.com/NI7JuyX.png
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/20091/ShadeRoot%20Dropbox.user.js
// @updateURL https://update.greasyfork.org/scripts/20091/ShadeRoot%20Dropbox.meta.js
// ==/UserScript==

function ShadeRootDB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootDB (
	'body, #modal-box, #browse-header, #browse-header {background-color: #071F33; color: #CEDDE9 !important;}'
	+
	'h1, h2, h3, h4, h5, h6, span, .text-input-input, .upgrade-features, .business-theme p, .plans-table__plan-subhead, .plans-table__description, .plans-table__price-sub, .list-item--check, .list-item--strikethrough, #company_size_label, label {color: #C8DCEC !important;}'
	+
	'header, footer, section, main, .notes-signin-container {background: #09152A !important;}'
	+
	'select {border: 1px solid #356EB6 !important; background-color: #16436F !important; color: #555 !important;}'
	+
	'.notifications-dropdown #event-feed-container.empty #event-feed-empty, #locale-link a, .homepage__action-container p, .homepage__subsubheadline, .homepage__example-container p {color: #DDD !important;}'
	+
	'#page-header {background-color: #0C3A68 !important;}'
	+
	'#modal-overlay, .db-modal-overlay {background-color: rgba(7, 15, 27, 0.62) !important;}'
	+
	'#modal-box {border: 1px solid #11344E !important;}'
	+
	'#modal-content {background: #245484 !important; border-top: 1px solid #12477B !important;}'
	+
	'#browse-rightmenu .action a, #browse-rightmenu .action .selectable, #browse-rightmenu .action .action-button, #global-actions .action a, #global-actions .action .selectable, #global-actions .action .action-button {border: 1px solid #2895E7 !important;}'
	+
	'.text-input-input.focused, .browse-file.file-select-one .inline-button, .browse-file--is-selected .inline-button, .browse-file:hover .inline-button, .browse-file-row.file-select-one .inline-button, .browse-file-row--is-selected .inline-button, .browse-file-row:hover .inline-button, .browse-new-folder.file-select-one .inline-button, .browse-new-folder--is-selected .inline-button, .browse-new-folder:hover .inline-button {box-shadow: 0px 0px 30px 30px #1758A1 !important;}'
	+
	'#browse-search-suggested-list {background-color: #114674 !important; border-color: #1B6AA4 !important;}'
	+
	'.focused {background-color: #1C3953 !important;}'
	+
	'.freshbutton, .freshbutton-silver, .freshbutton-gray, .freshbutton-blue-on-gray, .button-tertiary, a.button-tertiary {background: #164F8F !important; border: 1px solid #166EC5 !important; color: #C4D6E9 !important;}'
	+
	'.search-item {border-top: 1px solid #2672A8 !important;}'
	+
	'.customers__list-item--kayak {background: #2F2418 !important;}'
	+
	'.search-item.search-text, #browse-location, .sprite-text-inner, #context-menu a, #context-menu button, #context-menu button div, #context-menu button img, .sprite-div .sprite-text, .customers__headline, .customers__quote-copy, .customers__position, .customers__author-name, #business-footer nav a {color: #DDD !important;}'
	+
	'.text-input .text-input-wrapper input, .text-input .text-input-wrapper textarea {border: 1px solid #1E72AE !important;}'
	+
	'#browse-sort, #browse-root-actions, #browse-header-wrapper {background: #184C90 !important; border-bottom: 1px solid #05357D !important;}'
	+
	'li.browse-file, li.browse-new-folder {border-color: #184C87 !important; color: #DDD !important;}'
	+
	'.browse-file:hover {background: #0D4186 !important; border-color: #22669B !important;}'
	+
	'.browse-file .filename-link, .browse-file-row .filename-link, .browse-new-folder .filename-link {color: #9EC5E4 !important;}'
	+
	'.freshbutton-lightblue, .button-secondary, a.button-secondary {background-color: #195180 !important; background-image: linear-gradient(#217ECC, #1366AB) !important; border: 1px solid #5EB0F0 !important; color: #B6D0E6 !important;}'
	+
	'.dialog-menu, .chat-bubble, .chat-bubble-bottom, .chat-bubble-left, .chat-bubble-right {background: #184C90 !important;}'
	+
	'.chat-bubble-arrow {border-color: transparent transparent #184C90 !important;}'
	+
	'ul li:hover {background-color: #0F2D50 !important;}'
	+
	'.text-input-input {background: #092941 !important; box-shadow: 0px 0px 30px 30px #144B9E !important;}'
	+
	'.browse-file .inline-button.variant-DROPDOWN:hover, .browse-file .inline-button.variant-DROPDOWN.hovered, .browse-file-row .inline-button.variant-DROPDOWN:hover, .browse-file-row .inline-button.variant-DROPDOWN.hovered, .browse-new-folder .inline-button.variant-DROPDOWN:hover, .browse-new-folder .inline-button.variant-DROPDOWN.hovered {background: transparent linear-gradient(#2171AB, #12467A) repeat scroll 0% 0% !important;}'
	+
	'.sharing__actions .button-secondary {box-shadow: 0px 0px 8px 6px rgb(23, 88, 161) !important;}'
	+
	'#page-footer {background: #184C90 !important;}'
	+
	'.bubble-dropdown {background: #102B53 !important;}'
	+
	'.bubble-dropdown.bottom .bubble-arrow, .bubble-dropdown.bottom-left .bubble-arrow, .bubble-dropdown.bottom-right .bubble-arrow {border-top-color: #102B53 !important;}'
	+
	'.bubble-menu .bubble-menu-item:hover {background-color: #081F32 !important;}'
	+
	'.recents-section__title, .recents-item {border-bottom: 1px solid #1D4983;}'
	+
	'.recents-item:hover, .recents-item:focus {border-color: #0E6BC6 !important;}'
	+
	'.recents-item:hover .recents-item__action-button:first-child, .recents-item:focus .recents-item__action-button:first-child {box-shadow: -8px 0px 32px 16px #154EA4 !important;}'
	+
	'.recents-item__heading {color: #89C0EA !important;}'
	+
	'.bubble-dropdown.top .bubble-arrow, .bubble-dropdown.top-left .bubble-arrow, .bubble-dropdown.top-right .bubble-arrow {border-bottom-color: #102B53 !important;}'
	+
	'.recents-onboarding__confirm, .get-started p, .pro-header--bars {color: #C8DEF0 !important;}'
	+
	'.recents-onboarding, .business-2015, #snapengage-iframe {background-color: #1E385F !important;}'
	+
	'.db-modal-content, .db-modal {background-color: #102438 !important;}'
	+
	'.recents-onboarding-modal__header {background-color: #18406C !important;}'
	+
	'.recents-onboarding-modal .db-modal .recents-onboarding-modal__body, .db-modal-content {color: #D5E2EC !important; background: #122845 !important;}'
	+
	'.pro-header--bars {background-color: #11283B !important;}'
	+
	'.upgrade-features p, .upgrade-features .o--p, .upgrade-features blockquote, .upgrade-features table, .upgrade-features form, .upgrade-features ul, .upgrade-features ol, .upgrade-features .img, .upgrade-features pre, .upgrade-features .mega, .upgrade-features .ultra, .plans li p {color: #BAD3E7 !important;}'
	+
	'.plans__pro {border-left: 1px solid #2870B7 !important;}'
	+
	'#footer-border {border-top: 1px solid #1D4980 !important;}'
	+
	'.anywhere-block__props, .tile a img, .tour-book__pages, .dl-dropbox, .primary-position img, .pane-image img {opacity: .85 !important;}'
	+
	'.anywhere-block__stage, .anywhere-block__props, .anywhere-block, .try-business-cta-footer {background-color: #09152A !important;}'
	+
	'.business-2015 .mast-head, .dropbox-enterprise .mast-head {border-bottom: 1px solid #244A7A !important;}'
	+
	'.plans-table__plan {border: 1px solid #1A408F !important;}'
	+
	'.plans-features-table__list {border-left: 1px solid #1958A7 !important;}'
	+
	'.db-modal-title {background-color: #194193 !important;}'
	+
	'.db-modal-content {border-top: 1px solid #101B29 !important;}'
	+
	'.hero__background-container--male, .hero__background-container--female, .benefits-carousel {opacity: .45 !important;}'
	+
	'.mast-head__list-sub-items, .mast-head__list-sub-items {background: #0D2744 !important; border: 1px solid #1B4377 !important;}'
	+
	'.accordion-list__item {background: #0D284B !important;}'
	+
	'.accordion-list__item:hover, .accordion-list__item.active:hover {background: #0B1823 !important;}'
	+
	'#header-border-div, .total td {border-top: 1px solid #1C5C8C !important; border-bottom: 1px solid #1C5C8C !important;}'
	+
	'.payment-security-buy-V1 #teams_billing_form, .payment-security-buy-V2 #teams_billing_form {border: 1px solid #2F5B92 !important;}'
	+
	'.business-create-page .section-header .tooltip-wrapper--payment-security-buy-V1, .business-create-page .section-header .tooltip-wrapper--payment-security-buy-V2 {box-shadow: 0px -11px 0px 0px #2F5CA1 inset !important;}'
	+
	'.pricing-heading {background: #0E467D !important; border-bottom: 1px solid #1E5B96 !important;}'
	+
	'.business-create-page #plan_info #total-price {border: 1px solid #205495 !important;}'
	+
	'.pricing-heading--annual, #total-price .annual {border-right: 1px solid #3264A2 !important;}'
	+
	'.business-create-page #plan_info #total-price .pricing-option .pricing-scheme-annual, .business-create-page #plan_info #total-price .pricing-option .pricing-scheme-monthly {color: #A3CFF2 !important;}'
	+
	'.business-create-page .lr-container .helper.rfloat .helper-sections, .business-create-page .lr-container .helper.rfloat #order-summary {background-color: #09152A !important;}'
	+
	'#paypal-form .text-input select {border: 1px solid #3369C8 !important;}'
	+
	'.select-input-input {background: #114681 none repeat scroll 0% 0% !important; border: 1px solid #2971A5 !important;}'
	+
	'.tooltip-bubble {background: #256BBA !important;}'
	+
	'.page-header-border {border-bottom: 1px solid #2C5990 !important;}'
	+
	'.banner-yellow {border: 1px solid #10528A !important; background: #0E2D5C none repeat scroll 0% 0% !important;}'
	+
	'.c-tabs__tab--selected .c-tabs__label, #full-download-link {color: #B4CEE3 !important;}'
	+
	'.c-tabs__tab--selected {border-color: #266C9F !important;}'
	+
	'.c-tabs__tab {border-color: #1D6099 !important;}'
	+
	'.c-tabs__content {border-top: 1px solid #142F59 !important;}'
	+
	'#outer-frame, .body-section {background: #0D223E !important;}'
	+
	'.install-illustration, .blog-thumb img, .entry-content img, .entry-summary img, .page-content img, .related-thumb, .header-images img {opacity: .85 !important;}'
	+
	'.header-section {border-bottom: 1px solid #153C80 !important;}'
	+
	'.business-2015 .button-tertiary:hover, body.business-2015 .button-tertiary.hovered {background-color: #12447B !important;}'
	+
	'.button-tertiary {color: #8CADCF !important; background-color: #1666A1 !important; border-color: #2E7AC6 !important;}'
	+
	'.business-2015 .dfb-businesses, body.business-2015 .dfb-comparison {border-top: 1px solid #1D5FB1 !important;}'
	+
	'.business-2015 hr {border-bottom: 1px solid #204069 !important;}'
	+
	'.business-2015 .dfb-businesses, .section-gray {background: #0F223F !important;}'
	+
	'#news-home #nav a:hover {background: #0D3D7B !important;}'
	+
	'#nav ul .selected, a:hover .keyword-label {color: #C3D6E1 !important;}'
	+
	'#nav #more {border-top: 1px dotted #1F629B !important;}'
	+
	'.author, .callout-diversity__content {color: #8DBAE1 !important;}'
	+
	'.header-inner {border-bottom: 1px solid #1E528D !important;}'
	+
	'#content-nav, #related-stories, #most-read, .site-footer, .jobs-home-diversity {border-top: 1px solid #174698 !important; border-bottom: 1px solid #174698 !important;}'
	+
	'#content-nav li a.active::after {border-top-color: #174698 !important;}'
	+
	'ul#content-nav li a.active::before {border-top-color: #134186 !important;}'
	+
	'.content .hentry {border-bottom: 1px solid #184F86 !important;}'
	+
	'.search-field:focus {background-color: #0E2548 !important;}'
	+
	'.jobs-header {border-bottom: 1px solid #0C397D !important;}'
	+
	'.callout-department::before, .slider__subcontent::before {border-left: 1px solid #0E316F !important;}'
	+
	'.callouts-departments::before {border-left: 1px solid #244E84 !important;}'
	+
	'.btn-secondary:hover {background: #1D406E !important;}'
	+
	'.paging-navigation {border-top: 1px solid #07172F !important;}'
	+
	'.keywords a {border: 1px solid #164F90 !important;}'
	+
	'.help-page-prefooter {border-top: 1px solid #123F6B !important;}'
	+
	'.help-page-prefooter li a:hover {background-color: #123350 !important;}'
	+
	'.help-page-prefooter li + li {border-left: 1px solid #1F4066 !important;}'
	+
	'.help-page-prefooter li a, a .keyword-label, .page h1, .page h2, .page h3 {color: #226FC5 !important;}'
	+
	'.page p {color: #555 !important;}'
	+
	'.browse-file.context-select {background-color: #1D4B72 !important;}'
	+
	'.sharing__actions .button-secondary, .extra-padding {box-shadow: 0px 0px 10px 8px #1758A1 !important;}'
	+
	'.react-title-bar, #shmodel-content-area .react-title-bar {background: #143A7E !important; border-bottom: 1px solid #0D3883 !important;}'
	+
	'.react-title-bar__divider, #shmodel-content-area .react-title-bar__divider {border-right: 1px solid #317BCF !important;}'
	+
	'.react-title-bar__fileinfo-wrap .file-modifier, #shmodel-content-area .react-title-bar__fileinfo-wrap .file-modifier {color: #87C5F6 !important;}'
	+
	'.server-error {background-color: #2B527E !important; border: 1px solid #2162C5 !important; color: #CFE4F2 !important;}'
	+
	'.flex-preview-container, .preview-content-container {background: #0F1B27 !important;}'
	+
	'.preview-image-container .preview-image {border: 1px solid #21497B !important;}'
	+
	'.file-feedback .file-feedback-section, .file-feedback .comments-holder {border-left: 1px solid #205890 !important;}'
	+
	'.u-pad-horizontal-m {background: #122542 !important;}'
	+
	'.comment-list-header-container {border-bottom: 1px solid #154D84 !important; background-color: #0F3163 !important;}'
	+
	'.comment-field {background: #0F3163 !important; border-top: 1px solid #1F5181 !important;}'
	+
	'.mentions-input {border: 1px solid #1D5FAA !important;}'
	+
	'.show-button.white {border-left: 1px solid #0E3B60 !important; background: #1A3A65 !important;}'
	+
	'.text-input.edit-mode, .help-article-body p, .keyword-entry-active a, .help-article-body ol li {color: #DDD !important;}'
	+
	'.seperator {border-color: #1B5077 !important;}'
	+
	'.comments-header-menu-option:hover {background-color: #061D45 !important;}'
	+
	'a.bubble-menu-item {background-color: #102B53 !important;}'
	+
	'.bubble-dropdown ul li a:hover {background-color: #0C1F3C !important;}'
	+
	'.top-border {border-top: 1px solid #144371 !important;}'
	+
	'.half-column:last-child:not(:only-child) {border-left: 1px solid #1C3F56 !important;}'
	+
	'.bottom-border, .help-breadcrumbs {border-bottom: 1px solid #0E3A57 !important;}'
	+
	'.settings-table td {border-top: 1px solid #0D4C77 !important;}'
	+
	'.mast-head {border-bottom: 1px solid #134584 !important; box-shadow: 0px 1px 1px #173862 !important;}'
	+
	'.help-feedback {background-color: #1B4166 !important; border-top: 1px solid #1D6390 !important;}'
	+
	'.freshbutton:hover, .freshbutton.hovered, .freshbutton-silver:hover, .freshbutton-silver.hovered, .freshbutton-gray:hover, .freshbutton-gray.hovered, .freshbutton-blue-on-gray:hover, .freshbutton-blue-on-gray.hovered, .button-tertiary:hover, .button-tertiary.hovered, a.button-tertiary:hover, a.button-tertiary.hovered {background: transparent linear-gradient(#135DB1, #0F456E) repeat scroll 0% 0% !important;}'
	+
	'.search-mag-glass {background-color: #132D54 !important;}'
	+
	'.center-box.gray-box {background-color: #16406B !important; border: 3px dashed #256C9F !important;}'
	+
	'.bubble-dropdown.left .bubble-arrow, .bubble-dropdown.left-top .bubble-arrow, .bubble-dropdown.left-bottom .bubble-arrow {border-right-color: #102B53 !important;}'
	+
	'.gifting-round-box {background-color: #144474 !important; border: 1px solid #1B5EB3 !important;}'
	+
	'.gifting-break {border-color: #124483 !important;}'
	+
	'.feature-table__table-column, .feature-table__table-column--blue, .feature-table__table-column--head {border-bottom: 1px solid #2B578F !important;}'
	+
	'.feature-table__table-column--blue {background-color: #0F3857 !important;}'
	+
	'#sidebar {background-color: #0D2B4D !important;}'
	+
	'.homepage__action-container {border-right: 1px solid #153E72 !important;}'
	+
	'.homepage__action-group {border: 1px solid #1F4778 !important;}'
	+
	'.homepage__example-container {border-bottom: 1px solid #2D496C !important;}'
	+
	'.head a, .app-creation__legend, .radio__description, .right-body p, .help-article-body ul li {color: #DDD !important;}'
	+
	'.radio__item:first-child {border-right: 1px solid #1E498A !important;}'
	+
	'.radio--horizontal {border: 1px solid #1D4480 !important;}'
	+
	'.app-creation__legend {color: #9CC4ED !important;}'
	+
	'.radio__item:hover {background: #0E2E57 !important;}'
	+
	'#chooser-demo-tbl tr {border-bottom: 1px solid #194A74 !important;}'
	+
	'tbody {border: 1px solid #1F426F !important;}'
	+
	'#chooser-demo-tbl td {background: #152035 !important;}'
	+
	'#chooser-demo-tbl td:first-child {background: #132B4B !important;}'
	+
	'.dropbox-dropin-default:hover, .dropbox-dropin-error:hover {border-color: #355F95 !important;}'
	+
	'.dropbox-dropin-error {background: #174E7D linear-gradient(to bottom, #254C87 0%, #16467B 100%) repeat scroll 0% 0% !important; color: #DDD !important;}'
	+
	'.literal-block {background: #16436F !important; border: 1px solid #356EB6 !important;}'
	+
	'.graybox {background-color: #0C1A27 !important;}'
	+
	'.hotbox, .green-hotbox, .orange-hotbox {background: none !important; background-color: #173B5A !important; border: 1px solid #195898 !important;}'
	+
	'.hotbox-inner {background: #173B5A !important;}'
	+
	'.divider, hr {display: none !important;}'
	+
	'#support-steps .support-option:hover {background: none !important;}'
	+
	'#support-steps .support-option {border-bottom: 1px solid #224A87 !important;}'
	+
	'.round-blue-border {border: 1px solid #1D516E !important;}'
	+
	'.emo {background: #0E2B44 !important; border: 1px solid #144E87 !important;}'
	+
	'#browse-files .browse-file.file-select, #browse-files .browse-file.context-select, #browse-files .browse-new-folder.file-select {background-color: #0D5CA1 !important;}'
	+
	'.comments-holder {background-color: #0A1724 !important;}'
	+
	'.paper-header {border-bottom: 1px solid #205495 !important; box-shadow: 0px 1px 1px #122E51 !important; background-color: #1E3E69 !important;}'
	+
	'.notes-signin-text-title, .pane-title {color: #CCDDED !important;}'
	+
	'.notes-dbox-app-section-divider {border-bottom: 1px solid #234E7E !important;}'
	+
	'.pane-title, .notes-footer-text {color: #DDD !important;}'
	+
	'.ob-welcome-header {background-color: #0D2532 !important;}'
	+
	'.ob-welcome-btn {background-color: #154498 !important;}'
	+
	'.ob-welcome-btn.create-new {border: 3px dashed #2B9AEC !important;}'
	+
	'.hp-button-secondary, a.hp-button-secondary {border: 1px solid #1D78D5 !important; background-color: #19529C !important;}'
	+
	'.threaded-comment-list, .comment-field-wrapper {background-color: #12579B !important;}'
	+
	'.file-feedback .file-feedback-section, .file-feedback .comments-holder {color: #DDD !important;}'
	+
	'textarea {border-color: #1D4889 !important;}'
	+
	'.db-modal .sick-input input, .db-modal .sick-input textarea, #modal .sick-input input, #modal .sick-input textarea {background: #1F447D !important;}'
	+
	'.share-link-modal-content .share-link-modal-send-form .custom-message-container textarea {color: #DDD !important;}'
	+
	'.tokenizer {border: 1px solid #2C6DC0 !important;}'
	+
	'#share-link-modal-new-collab-input {background: rgba(0,0,0,0) !important;}'
	+
	'#sf-view .sf-list-container ol.sf-list li.sf-folder, #sf-view .sf-list-container ol.sf-list li.sf-file {border-color: #265C92 !important;}'
	+
	'.c-banner.c-banner--warning {background-color: #1B4A9E !important;}'
	+
	'#links-view #links-list li.link, #links-view #recent-links-list li.link {border-color: #295786 !important;}'
	+
	'.links-sub-header__banner__text {color: #C9E0F2 !important;}'
	+
	'#links-view #links-list li.link img.thumbnail, #links-view #recent-links-list li.link img.thumbnail {border: 1px solid #275B96 !important;}'
	+
	'.autocomplete ul li {border-bottom: 1px solid #184368 !important;}'
	+
	'.autocomplete ul {border: 1px solid #184C90 !important; background-color: #19324B !important;}'
	+
	'li.selected {background-color: #0E2538 !important;}'
	+
	'#events-header {border-bottom: 0px solid #1E4589 !important;}'
	+
	'.events-header {background-color: #1B4071 !important;}'
	+
	'.ul_select_menu {border-color: #2162C3 !important;}'
	+
	'#cur_date {border: 1px solid #3B7DC8 !important;}'
	+
	'.calendar {background-color: #132F44 !important; border: 1px solid #1265A2 !important;}'
	+
	'.calendar .date {background-color: #1F527D !important;}'
	+
	'.calendar .date:hover {background-color: #113860 !important;}'
	+
	'.calendar .date.inactive, .calendar .date.inactive {background: #1F79C6 !important;}'
	+
	'#event-table td, #trash-table-header {border-bottom: 1px solid #214C77 !important;}'
	+
	'div#events-container {border-top: 1px solid #143C65 !important;}'
	+
	'.event-row:hover {background: #113654 !important; border-color: #164366 !important;}'
	+
	'div#events-container #event-table .event-row:hover .inline-button .inline-share, div#events-container #event-table .event-row:hover .inline-button .inline-restore, .recents-item__action-button:first-child {box-shadow: -10px 0px 8px #1A5FA4 !important;}'
	+
	'.freshbutton-lightblue:hover, .freshbutton-lightblue.hovered, .button-secondary:hover, .button-secondary.hovered, a.button-secondary:hover, a.button-secondary.hovered {background: transparent linear-gradient(#296CAE, #134169) !important;}'
	+
	'.dbox-app-promo-header {border-top: 1px solid #2A5AA2 !important; border-bottom: 1px solid #2A5AA2 !important;}'
	+
	'.dbox-app-promo-header-h1, .pane-text {color: #D0E2F3 !important;}'
	+
	'.pane-image {border: 1px solid #2763AE !important;}'
	+
	'.dbox-fixed-header__account-info-container {background-color: #1B486E !important;}'
	+
	'.context-menu-item, #main-nav .nav-item-link.selected, #main-nav .button-as-link.selected, .drops-empty-page-header-h1 {color: #CDDCE9 !important;}'
	+
	'.context-menu-item:hover {background: #234F75 !important;}'
	+
	'.scroll-bottom-banner {background: #19519B !important;}'
	+
	'#new-or-existing-sf li, #new-sf-or-shmodel li, #shared-folder-type li {background: #12213C !important; border: 1px solid #355E9C !important;}'
	+
	'.token-container .tokenizer .tokenizer_input .new-collab-input, .tokenized_autocompleter_container .tokenizer .tokenizer_input .new-collab-input {background: #1C3953 !important; color: #DDD !important;}'
	+
	'.bubble-picker-option:hover, .upsell a, .upsell a:hover {background-color: #1B63A1 !important;}'
	+
	'.sharing-settings-modal-content td, .landing-page__module {border-bottom: 1px solid #144D7E !important;}'
	+
	'.drops-empty-page-header, .drops-empty-page-3pane {border-top: 1px solid #20609E !important;}'
	+
	'.landing-page__column--vertical-borders:not(:last-child) {border-right: 1px solid #386699 !important;}'
	+
	'.business-create-page .business-create-page--refresh-try-B #teams_billing_form, .business-create-page .business-create-page--refresh-buy-B #teams_billing_form {background-color: #09152A !important;}'
	+
	'.business-create-page .business-create-page--refresh-try-A #teams_billing_form, .business-create-page .business-create-page--refresh-try-B #teams_billing_form, .business-create-page .business-create-page--refresh-buy-A #teams_billing_form, .business-create-page .business-create-page--refresh-buy-B #teams_billing_form {border: 1px solid #164178 !important;}'
	+
	'.focused-option {background: #174975 !important;}'
	+
	'.select-input-dropdown {background: #1B377A !important; border: 1px solid #195F92 !important;}'
	+
	'.step-count {border-top: 6px solid #327ED4 !important;}'
	+
	'.business-create-page .business-create-page--refresh-try-A #plan_info #total-price .pricing-heading, .business-create-page .business-create-page--refresh-try-B #plan_info #total-price .pricing-heading, .business-create-page .business-create-page--refresh-buy-A #plan_info #total-price .pricing-heading, .business-create-page .business-create-page--refresh-buy-B #plan_info #total-price .pricing-heading {color: #78AFE7 !important;}'
	+
	'.pricing-option {background: #132C3F !important;}'
	+
	'.business-2015 {background: #09152A !important;}'
	+
	'.c-banner {background-color: #0A3250 !important;}'
	+
	'.c-btn--secondary {background: #1668A4 !important; border-color: #1E8DD4 !important; color: #BECDDB !important;}'
	+
	'.c-btn--secondary:hover:not(:disabled) {background: transparent linear-gradient(#1476BF, #185FBA) !important;}'
	+
	'.member-container {background: #1F447D !important; border: 1px solid #255DB0 !important;}'
	+
	'.c-btn--secondary {background: #4B6EAA !important;}'
	+
	'.sf-display-name, .u-font-meta, .c-banner, #trash-table-header {color: #B4D3EC !important;}'
	+
	'.sf-tooltip-warning {border-top: 1px solid #1B4F81 !important;}'
	+
	'.complete {border-color: #266AB7 !important;}'
	+
	'#inline-upload-status {background: #1B3147 !important;}'
	+
	'.inline-upload-info {background-color: #10406E !important;}'
	+
	'.inline-upload-bar {background-color: #2476BC !important;}'
	+
	'.inline-upload-progress, #more-loading {background-color: #2671D2 !important;}'
	+
	'#inline-upload-status {border: 1px solid #3064A7 !important;}'
	+
	'.server-success, #notify-msg {background-color: rgb(27, 81, 152) !important; border: 1px solid #1D75C0 !important;}'
	+
	'.token-container .tokenizer, .tokenized_autocompleter_container .tokenizer {background: #1C3953 !important;}'
	+
	'.trash-header, #trash-table-header {background-color: #132F4B !important;}'
	+
	'.trash-row:hover {background: #123859 !important;}'
	+
	'.trash-row {border-bottom: 1px solid #285784 !important;}'
	+
	'#file-viewer.has-preview.doc-preview #file-viewer-container .title-bar, #file-viewer.has-preview.html-preview #file-viewer-container .title-bar, #file-viewer.has-preview.htmlified-preview #file-viewer-container .title-bar, #file-viewer.has-preview.adobecs-preview #file-viewer-container .title-bar, #file-viewer.has-preview.photo-preview #file-viewer-container .title-bar, #file-viewer.has-preview.video-preview #file-viewer-container .title-bar, #file-viewer.has-preview.linkfile-preview #file-viewer-container .title-bar {border-bottom: 1px solid #143F5A !important;}'
	+
	'.title-bar {background: #1E3D6B !important;}'
	+
	'.table-header {border-bottom: 2px solid #154275 !important;}'
	+
	'.table-body li.table-row, .business-comparison-matrix--plans-comparison.sticky thead tr:last-child td {border-bottom: 1px solid #084087 !important;}'
	+
	'#namespace-list-container ul li {background: #0D3766 !important;}'
	+
	'.plans-table__cta:hover {background: #172D4E !important;}'
	+
	'tr:nth-child(2) td {border-top: 1px solid #1B4E8F !important;}'
	+
	'.business-comparison-matrix--plans-comparison thead tr:first-child td {border-top: 1px solid #1A4881 !important;}'
	+
	'.business-comparison-matrix--plans-comparison td {border-left: 1px solid #284F80 !important;}'
	+
	'.business-comparison-matrix--plans-comparison td:last-child {border-right: 1px solid #244E83 !important;}'
	+
	'.business-comparison-matrix--plans-comparison tbody td, .business-comparison-matrix--plans-comparison tfoot td {border-top: 1px solid #20385C !important;}'
	+
	'.sticky thead td {background-color: #162E42 !important;}'
	+
	'.business-comparison-matrix--plans-comparison thead tr:first-child td.column--active {background-color: #154F87 !important;}'
	+
	'.column--active {background-color: #154F87 !important;}'
	+
	'.business-comparison-matrix--plans-comparison tfoot tr:last-child td {border-bottom: 1px solid #1B4274 !important;}'
	+
	'#SnapABug_P div img {opacity: .8 !important;}'
	+
	'.browse-file-row--is-selected, .browse-file-row--is-selected:hover {background-color: #0F395A !important; border-top-color: #19527E !important;}'
	+
	'.browse-file-row--is-selected + .browse-file-row, .browse-file-row--is-selected:hover + .browse-file-row {border-top-color: #173B57 !important;}'
	+
	'.c-column-header {border-bottom: 1px solid #2F609E !important;}'
	+
	'.browse-file-list-header {background: #1D5296 !important;}'
	+
	'.browse-file-row {border-color: #053E6F !important;}'
	+
	'.browse-header {background: #175192 !important;}'
	+
	'.context-menu-item--selected {background-color: #1C5D96 !important;}'
	+
	'.search-bar__button:focus {background-color: #122C4D;}'
	+
	'.search-bar__input {border: 1px solid #28538A !important;}'
	+
	'.search-bar {background-color: #1F64B1 !important; color: #DDE !important;}'
	+
	'.search-bar.is-expanded, .search-bar.is-focused {box-shadow: 0px 0px 30px 30px #184C90 !important;}'
	+
	'.search-bar__text-input {background: #338BC3 !important;}'
	+
	'.search-bar__dropdown {background: #142F66 !important; border-color: rgba(29, 81, 146, 0.8) !important;}'
	+
	'.search-bar__suggestion--is-highlighted {background-color: rgba(18, 74, 117, 0.6) !important;}'
);