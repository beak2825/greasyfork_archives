//
// Written by Glenn Wiking
// Script Version: 1.0.3a
// Date of issue: 18/02/16
// Date of resolution: 24/02/16
//
// ==UserScript==
// @name        ShadeRoot Amazon
// @namespace   SRAZ
// @description Eye-friendly magic in your browser for Amazon
// @include     *.amazon.*

// @version     1.0.3a
// @icon       	http://i.imgur.com/xZvwHZr.png
// @downloadURL https://update.greasyfork.org/scripts/19686/ShadeRoot%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/19686/ShadeRoot%20Amazon.meta.js
// ==/UserScript==

function ShadeRootAZ(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootAZ (
	'html, #navbar.nav-bluebeacon #nav-belt, #nav-main {background-color: #18212d !important;}'
	+
	'body {color: #F8DDC3 !important; background-color: #241712 !important;}'
	+
	'hr, .primeBadge {border-top: 1px solid #8c482d !important;}'
	+
	'img, .shogun-widget, .non-critical-image, .aui-desktop, .non-critical-image-ready, #nav-upnav, .a-icon-star {opacity: .85 !important;}'
	+
	'.nav-search-field {background: #38342e !important;}'
	+
	'.nav-input, .a-color-base {color: #F3EAD8 !important;}'
	+
	'.nav-search-scope {background-color: #231b15 !important; border-color: #4d3b18 !important;}'
	+
	'#gw-content-grid {background: #2C241D !important;}'
	+
	'.gw-flex-col .desktop-unrec-col, .a-box {background: #3E2D23 !important;}'
	+
	'a, a:active, a:link, a:visited, .navFooterColHead {color: #dd832c !important;}'
	+
	'a:hover {color: #da4500 !important;}'
	+
	'#a-page {background: rgb(12, 17, 24) !important;}'
	+
	'.navFooterBackToTop span {color: #F0CFBD !important; background: #3C2C22 !important;}'
	+
	'.a-button-text {color: #241D17 !important;}'
	+
	'.a-color-secondary {color: #DEA145 !important;}'
	+
	'.a-link-normal, .nav_a {color: #ef530a !important;}'
	+
	'.a-color-price {color: #EAB38F !important;}'
	+
	'.a-icon-logo, .a-logo {background-color: #6B5346 !important; border-radius: 4px !important;}'
	+
	'.a-box {border: 1px #863f12 solid !important;}'
	+
	'.a-input-text, input[type="number"], input[type="tel"], input[type="password"], input[type="search"], input[type="text"] {background-color: #2c251f !important;}'
	+
	'.a-input-text, input[type="number"], input[type="tel"], input[type="password"], input[type="search"], input[type="text"], select.a-select-multiple, textarea {border: 1px solid #8d4d16 !important; border-top-color: #B3621E !important; box-shadow: 0 1px 0 rgba(126, 51, 22, 0.5),0 1px 0 rgba(0,0,0,.07) inset !important;}'
	+
	'.a-box .a-divider.a-divider-break h5, .a-color-base-background .a-divider.a-divider-break h5, .a-divider.a-divider-break h5 {background-color: #3e2d23 !important;}'
	+
	'.a-box .a-divider.a-divider-break::after, .a-color-base-background .a-divider.a-divider-break::after, .a-divider.a-divider-break::after {border-top: 1px solid #ab6623 !important;}'
	+
	'.a-box .a-divider.a-divider-break h5, .a-color-base-background .a-divider.a-divider-break h5, .a-divider.a-divider-break h5 {color: #F0D4BD !important;}'
	+
	'.a-button {background: #9e4820 !important; border-color: #d47518 #d77b14 #d77b14 !important;}'
	+
	'.a-button .a-button-inner, .watchTheDealButton {background: linear-gradient(to bottom,#e98727,#bf5c14) !important;}'
	+
	'.a-button .a-button-inner:hover, .GB-SUPPLE .watchTheDealButton, .miniDPSuppleWatchButton .watchTheDealButton {background: linear-gradient(to bottom,#f6c35b,#ef741b) !important;}'
	+
	'.a-button .a-button-text {color: #241D17 !important;}'
	+
	'#sidebar {background: #211A17 !important;}'
	+
	'.a-fixed-right-grid-inner {background: rgba(0,0,0,0) !important;}'
	+
	'.feed-carousel-control {background-color: #232F3E !important;}'
	+
	'.feed-scrollbar-track, .feed-scrollbar-thumb, .feed-scrollbar-thumb:hover {background-color: #B77429 !important;}'
	+
	'.a-color-base, .rhf-fresh-header, .fresh-shoveler .as-title-block {color: #D7D2CD !important;}'
	+
	'.ybh-fresh-link, .nav-search-label, .a-checkbox label, .a-radio label, .a-color-link, .rvi-container .you-viewed, .rvi-container #ybh-text-on, .rvi-container #ybh-text-off, .rvi-container #ybh-link, .rhf-sign-in-button {color: #E7CAB2 !important;}'
	+
	'.billboardRow {background: rgba(0,0,0,0) !important; border-right: 1px solid #B77429 !important;}'
	+
	'#nav-subnav {background: #513620 !important;}'
	+
	'.hud-carousel-element a:active .value, .hud-carousel-element a:focus .value, .hud-carousel-element a:hover .value, .hud-carousel-element a:link .value, .hud-carousel-element a:visited .value {color: #EFD1C5 ! important;}'
	+
	'.top-1, .top-2, .filterResultBar {background-color: #2C241D !important;}'
	+
	'.tallCellView {border-color: #8F5124 !important; background: #241712 !important;}'
	+
	'.GB-SUPPLE .filters {background-color: #472B16 !important;}'
	+
	'.GB-SUPPLE .filterItem .filterLink {color: #DD7428 !important;}'
	+
	'.GB-SUPPLE .filterItem .filterLink:hover, #nav-timeline, #nav-timeline-error .nav-line-2, #nav-timeline-error .nav-paragraph, #nav-timeline-error-content .nav-line-2, #nav-timeline-error-content .nav-paragraph, .nav-timeline-large-text .nav-line-2, .nav-timeline-large-text .nav-paragraph {color: #F8A95D !important;}'
	+
	'#nav-npm-header, .nav-npm-text-detail, a.nav-npm-text-detail-a, a.nav-npm-text-detail-a:link, a.nav-npm-text-detail-a:visited, a.nav-npm-text-detail-a:hover, a.nav-npm-text-detail-a:active {color: #E1AD98 !important;}'
	+
	'.gbh1-bold {color: #E78B31 !important;}'
	+
	'.gbhcopy {color: #9B521B !important;}'
	+
	'.progbarWrapper {background-color: rgb(100, 52, 20) !important;}'
	+
	'.GB-M-COMMON {background-color: #18212D !important;}'
	+
	'ul.a-pagination li {background-color: #442E2E !important;}'
	+
	'ul.a-pagination li a {background: #E38B5B linear-gradient(to bottom, #D4972D, #C05D14) repeat scroll 0% 0% !important; border-color: #6E371A !important; box-shadow: 0px 1px 0px rgba(234, 105, 54, 0.6) inset !important; color: #3E1E0C !important;}'
	+
	'ul.a-pagination li a:hover {background: transparent linear-gradient(to bottom, #FED982, #B66F1F) repeat scroll 0% 0% !important;}'
	+
	'.a-row a:hover {color: #50210B !important;}'
	+
	'ul.a-pagination li.a-selected a {border-color: #814C15 !important;}'
	+
	'ul.a-pagination li.a-selected {background-color: #29150F !important;}'
	+
	'.a-meter-animate {background-color: #241712 !important;}'
	+
	'.scheduled-ad div {background-color: rgb(140, 72, 45) !important;}'
	+
	'.GB-SUPPLE .firstRowDiv {background-image: linear-gradient(to bottom, #5C2B19 0px, #2D2214 100%) !important;}'
	+
	'.primeBadge {color: #E47436 !important;}'
	+
	'.GB-SUPPLE .shortCellView:hover {border: 2px solid #C6713B !important;}'
	+
	'.rhf-divider {background: transparent -moz-linear-gradient(center top , #4D1E0F, #DB5B31 3px, #CE7824) repeat scroll 0% 0% !important;}'
	+
	'.rhf-divider::after {background: transparent -moz-linear-gradient(left center , #241712, rgba(255, 255, 255, 0), #241712) repeat scroll 0% 0% !important;}'
	+
	'.rhf-border {border: 1px solid #4E2E21 !important;}'
	+
	'.a-popover-wrapper {background-color: #201612 !important;}'
	+
	'.a-popover.a-arrow-bottom .a-arrow, #nav-flyout-wl-alexa, #nav-flyout-wl-items, .acs-category-header {border-bottom-color: #201612 !important;}'
	+
	'.bucket + div {border-top: 1px solid rgb(68, 39, 25) !important;}'
	+
	'.nav-flyout, .nav-timeline-item {background: #2F1F1A !important; border: 1px solid #472020 !important;}'
	+
	'.nav-arrow {border-color: rgba(0,0,0,0) rgba(0,0,0,0) #472020 !important;}'
	+
	'.nav-arrow-inner {border-color: rgba(0,0,0,0) rgba(0,0,0,0) #2F1F1A important; display: none;}'
	+
	'#nav-timeline-error .nav-line-1, #nav-timeline-error .nav-title, #nav-timeline-error-content .nav-line-1, #nav-timeline-error-content .nav-title, .nav-timeline-large-text .nav-line-1, .nav-timeline-large-text .nav-title, .nav-timeline-date, .nav-timeline-remove-error-msg, .nav-timeline-remove-item, .nav-timeline-asin-title, .nav-tpl-discoveryPanelList .nav-text, .nav-tpl-discoveryPanelSummary .nav-text, .nav-tpl-itemList .nav-text {color: #EA8840 !important;}'
	+
	'.nav-tpl-discoveryPanelList .nav-text:hover, .nav-tpl-discoveryPanelSummary .nav-text:hover, .nav-tpl-itemList .nav-text:hover {color: #B39889 !important;}'
	+
	'.nav-timeline-line {border-top: 10px solid #714A2E !important;}'
	+
	'#nav-timeline.nav-timeline-asin-title-enabled .nav-timeline-img-holder {background-color: #482E26 !important; border-left: 1px solid #66381F !important;}'
	+
	'.nav-tpl-discoveryPanelList .nav-divider, .nav-tpl-discoveryPanelSummary .nav-divider, .nav-tpl-itemList .nav-divider {background: #593525 !important;}'
	+
	'.nav-icon {border-color: #606060 transparent transparent !important;}'
	+
	'.nav-item span:after {border-top: 6px solid transparent !important; border-bottom: 6px solid transparent !important; border-left: 6px solid #383E38 !important;}'
	+
	'.nav-catFlyout .nav-flyout-content .nav-hasPanel {background-image: none !important;}'
	+
	'.nav-catFlyout .nav-subcats {border-left: 1px solid #543522 !important;}'
	+
	'.nav-promo {opacity: .7 !important;}'
	+
	'#nav-flyout-anchor .nav-link .nav-text, #nav-flyout-anchor .nav-tpl-itemList .nav-link:focus .nav-text, #nav-flyout-anchor .nav-tpl-itemList .nav-link:hover .nav-text {color: #B44511 !important;}'
	+
	'input[width="94"] {border-radius: .9em !important;}'
	+
	'#s-result-info-bar {border-top: 1px solid #894D31 !important; border-bottom: 1px solid #A83813 !important; box-shadow: 0px 0px 10px #78401D !important;}'
	+
	'#searchTemplate {background: #513620 !important;}'
	+
	'#leftNavContainer {border-right: 1px solid #6F4429 !important;}'
	+
	'.a-ws .s-result-list-hgrid.s-col-ws-1 li:nth-child(n+2) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-10 li:nth-child(n+11) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-11 li:nth-child(n+12) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-12 li:nth-child(n+13) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-2 li:nth-child(n+3) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-3 li:nth-child(n+4) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-4 li:nth-child(n+5) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-5 li:nth-child(n+6) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-6 li:nth-child(n+7) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-7 li:nth-child(n+8) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-8 li:nth-child(n+9) .s-item-container, .a-ws .s-result-list-hgrid.s-col-ws-9 li:nth-child(n+10) .s-item-container {border-top: 1px solid #5C392E !important;}'
	+
	'.a-col-left {background: rgb(68, 65, 64) !important;}'
	+
	'.a-spacing-mini .a-row .a-link-normal {color: #D84E18 !important;}'
	+
	'.sx-deal-badge, .sx-deal-badge::before {border-bottom-color: #BF572E !important;}'
	+
	'.sx-deal-badge, .sx-deal-badge::after {border-top-color: #BF572E !important;}'
	+
	'.sx-deal-badge {background-color: #BF572E !important;}'
	+
	'.a-fixed-left-grid .a-fixed-left-grid-inner {background: #2F201A !important;}'
	+
	'.a-meter {background: rgb(174, 119, 57) linear-gradient(to bottom, #C3531E, #7A4329) repeat scroll 0% 0% !important;}'
	+
	'.a-color-success {color: #DD3216 !important;}'
	+
	'.a-row a:hover {color: #A24B22 !important;}'
	+
	'#leftNav .seeMore, #leftNav li .boldRefinementLink, #leftNav h2 {color: #D75315 !important;}'
	+
	'div.pagnHy {background-color: #291B17 !important;}'
	+
	'div.pagn a:active, div.pagn a:hover, div.pagnBg span.pagnLink a:active, div.pagnBg span.pagnLink a:hover, div.pagnHy span.pagnLink a:active, div.pagnHy span.pagnLink a:hover {background: #6F4331 !important; border: 1px solid #8D3623 !important;}'
	+
	'#pagnPrevString::before {content: "<<  " !important;}'
	+
	'#pagnNextString::after {content: "  >>" !important;}'
	+
	'#pagn .srSprite {background-image: none !important;}'
	+
	'.rhf-header {color: #ECC3B1 !important;}'
	+
	'.rhf-divider {border-top: 1px solid #50332C !important;}'
	+
	'.a-color-tertiary {color: #D25D37 !important !important;}'
	+
	'a.cta {color: #3F2A23 !important;}'
	+
	'.a-box .a-divider.a-divider-section .a-divider-inner:after, .a-color-base-background .a-divider.a-divider-section .a-divider-inner:after, .a-divider.a-divider-section .a-divider-inner:after {background: none !important;}'
	+
	'.sc-list-item-border, .sc-list-head {border-bottom: 1px solid #713A2B !important;}'
	+
	'ol .a-list-item, ul .a-list-item, #sc-delivery-slot-form input[type="submit"], .sc-list .sc-action-links input[type="submit"], .sc-list .sc-action-links input[type="button"], .sc-update-all-quantity input {color: #CB4B30 !important;}'
	+
	'.a-dropdown-common .a-dropdown-link.a-active {background-color: #A53F23 !important; border-color: #711919 !important;}'
	+
	'#cbcc_banner {background-color: #51362E !important;}'
	+
	'.cbcc_cboxB, .cbcc_cboxT, .cbcc_cboxR, .cbcc_cboxL {background-color: #653A2F !important;}'
	+
	'.cbcc_cboxBL, .cbcc_cboxBR, .cbcc_cboxTL, .cbcc_cboxTR {opacity: 0 !important;}'
	+
	'.cbcc_box {border-color: #653A2F !important;}'
	+
	'#cbcc_banner a img {background: #FFFCFC !important;}'
	+
	'.a-alert-inline-info .a-alert-container {color: #E4D3D3 !important;}'
	+
	'.ss-gradient-bg {background: transparent linear-gradient(#63371C, #391D15) repeat scroll 0% 0% !important;}'
	+
	'.a-search input {color: #EDD0C6 !important;}'
	+
	'.csg-hover-box .csg-hover-box-categories {background: #351D1A none repeat scroll 0px 0px; border-right: 1px solid #74382E;}'
	+
	'.csg-hover-box .csg-hover-box-content {border-left: 1px solid #74382E !important;}'
	+
	'.csg-box {border: 1px solid #532B20 !important;}'
	+
	'ol.a-nostyle, ul.a-nostyle {color: #EDC2B9 !important;}'
	+
	'.csg-cat-sep {display: none !important;}'
	+
	'.cs-help-header {background: #513620 !important;}'
	+
	'.cs-help-sidebar-module {border: 1px solid #60352B !important;}'
	+
	'.a-color-tertiary {color: #D47464 !important;}'
	+
	'.s-border-right {border-right: 1px solid #573329 !important;}'
	+
	'.acs-ln-widget .acs-ln-nav-section {border: 1px solid #4E2824 !important;}'
	+
	'.a-col-left {background: #302420 !important}'
	+
	'.acs-ln-widget .acs-ln-header {background: #302420 !important; color: #EDD !important}'
	+
	'.acs-ln-widget .acs-ln-header:hover {background-color: #98553F !important; color: #EDD !important}'
	+
	'.narrowValue {color: #C9491F !important;}'
	+
	'.bxc-grid__image img, img[alt="Amazon Gift Cards"] {display: none !important;}'
	+
	'.s9ShovelerBackBookendButton {border-radius: 5em !important;}'
	+
	'.SponsoredLinksBox {border: 1px solid #44241D !important;}'
	+
	'.gc-qpw-amount, #hud-dashboard, .hud-modal, .hud-modal ul.prime-benefits li, .popup-gutter, .np-grid-title, #a-page div.left_nav.browseBox h3 {color: #E9C0B7 !important;}'
	+
	'.acs-ln-header {border-color: -moz-use-text-color -moz-use-text-color #4B2A21 !important;}'
	+
	'.acs-ln-widget .acs-ln-expand-all {background: rgba(0,0,0,0) !important;}'
	+
	'#low-price, #high-price {background-color: rgb(234, 202, 174) !important;}'
	+
	'#hud-dashboard {background-color: #35221E !important;}'
	+
	'li.recs-grid-item {border-right: 1px solid #573636 !important; border-bottom: 1px solid #573636 !important;}'
	+
	'.recs-grid-container {border-top: 1px solid #573636 !important;}'
	+
	'.rhf-source-title, .a-carousel-page-count, .card-title {color: #DB7A65 !important;}'
	+
	'.nav-tpl-discoveryPanelList .nav-subtext, .nav-tpl-discoveryPanelSummary .nav-subtext, .nav-tpl-itemList .nav-subtext {color: #542D24 !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-main-section-container {border-bottom: 1px solid #6E392A !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-middle-section a {background-color: #513620 !important;}'
	+
	'.acs-en-widget .acs-en-full {border-color: #783838 #563528 -moz-use-text-color -moz-use-text-color !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-tabs {border-color: #783838 !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-tabs .acs-en-tab-selected button {background-color: #8D5948 !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-tabs button {border-color: -moz-use-text-color -moz-use-text-color #693E35 #9B4D3D !important; background-color: #3C2929 !important; color: #E9CFC9 !important;}'
	+
	'acs-en-tab-selected {background: rgb(141, 89, 72) !important; color: #292120 !important;}'
	+
	'.acs-en-widget .acs-en-full .acs-en-tabs .acs-en-tab-selected-bar {background-color: #8D5948 !important;}'
	+
	'.unified_widget.rcmBody p, .s9Widget, #magnifierLens {opacity: .8 !important;}'
	+
	'.nav-npm-content, #nav-npm-footer {border-top: 1px solid #774934 !important;}'
	+
	'.s-item-container, #revDivider .a-divider-inner, hr.bucketDivider, .a-divider-normal, .sims-carousel-heading {border-top: 1px solid rgb(78, 49, 42) !important;}'
	+
	'#searchTemplate {border-radius: 5em !important;}'
	+
	'#miniATFUDP {background: transparent linear-gradient(to bottom, #933324 0px, #632F1E 100%) repeat scroll 0% 0% !important; border-top: 1px solid #713C3C !important; border-bottom: 1px solid #442121 !important;}'
	+
	'.nav-tpl-itemList .nav-subtext, #prodDetails #SalesRank ul li span.zg_hrsr_ladder, #prodDetails #SalesRank ul li span.zg_hrsr_rank, #prodDetails .wrapper, #prodDetails td, .vote .label {color: #EFD0C8 !important;}'
	+
	'#plan-comparison td:first-child {background-color: #422F2C !important;}'
	+
	'#plan-comparison .table-header {background-color: #7E5050 !important;}'
	+
	'#plan-comparison tr td {border: 1px solid #1A0D09 !important; background-color: #33211D !important;}'
	+
	'#plan-comparison tr td.benefit-description {color: #C95239 !important;}'
	+
	'#plan-comparison tr td.prime-img-cell {background-color: #E47810 !important;}'
	+
	'#plan-comparison tr td h3, #plan-comparison tr td h5 {color: #EFC1BC !important;}'
	+
	'#plan-comparison tr td, #plan-comparison tr td h2, .PV-benefit-subDescription {color: #E3B4B4 !important;}'
	+
	'#nav-flyout-shopAll .nav-tpl-itemList .nav-subtext {color: #542D24 !important;}'
	+
	'.a-dropdown-common .a-dropdown-item:focus .a-dropdown-link, .a-dropdown-common .a-dropdown-item:hover .a-dropdown-link {border-color: #622B22 !important; background-color: #412525 !important;}'
	+
	'.cbcc_mathright img, .acs-gradient-divider:after, .a-spacing-top-medium:after {display: none !important;}'
	+
	'.cbcc_red nobr {padding-top: 2px !important; padding-left: 2.25em !important; border-top: 1px solid #E4B6AC !important;}'
	+
	'.a-icon-text-separator, .a-text-separator {background-color: #743B32 !important;}'
	+
	'.sc-zipcode-option input, .acs-bgtext-widget h1, .acs-bgtext-widget h2, .acs-bgtext-widget h3, .acs-bgtext-widget h4, .acs-bgtext-widget h5, .acs-bgtext-widget h6 {color: #EFBFBF !important;}'
	+
	'.acs-bgtext-widget {color: #BC5F3B !important;}'
	+
	'#twister .swatches li {border: 1px solid #452E25 !important;}'
	+
	'#twister .swatches li.swatchSelect {border-color: #FFD6C6 !important; border-radius: 4px !important; border-width: 2px !important;}'
	+
	'#twister .swatches li.swatchHover {border-color: #98492F !important;border-radius: 4px !important;}'
	+
	'#twister .swatches li.swatchHover .a-button-text, #twister .swatches li.swatchUnavailableHover .a-button-text {background-color: #6E2F1F !important; color: #F6E3DF !important;}'
	+
	'.dp-accordion .unselected .rbbHeader {background-image: -moz-linear-gradient(center top , #A53F23, #682911) !important;}'
	+
	'.comparison_image_title_cell, .comparison_sim_items_column {border: 1px dotted #8C5B4C !important;}'
	+
	'.comparison_attribute_name_column {background-color: #48271D !important; border: 1px dotted #B9795B !important;}'
	+
	'.comparison_baseitem_column {background-color: #74473B !important; border: 1px dotted #21110E !important;}'
	+
	'.comparison_tablerow_highlight {border-top: 1px solid #E08263 !important; border-bottom: 1px solid #F28B6A !important;}'
	+
	'#quickPromoBucketContent .content ul li {color: #F0D2C6 !important;}'
	+
	'.disclaim {color: #CF542C !important;}'
	+
	'.a-section-expander-inner {border-top: 1px solid #60382D !important;}'
	+
	'#prodDetails .secHeader, .aplus-v2 .aplus-module.module-1, .aplus-v2 .aplus-module.module-2, .aplus-v2 .aplus-module.module-3, .aplus-v2 .aplus-module.module-4, .aplus-v2 .aplus-module.module-6, .aplus-v2 .aplus-module.module-7, .aplus-v2 .aplus-module.module-8, .aplus-v2 .aplus-module.module-9, .aplus-v2 .aplus-module.module-10, .aplus-v2 .aplus-module.module-11, .aplus-v2 .aplus-module.module-12 {border-bottom: 1px solid #60382D !important;}'
	+
	'table.a-keyvalue {border-bottom: 1px solid #4B261E !important;}'
	+
	'table.a-keyvalue td, table.a-keyvalue th {border-top: 1px solid #A44D35 !important;}'
	+
	'table.a-keyvalue th {background-color: #392727 !important;}'
	+
	'.va-carousel .product-title {border-color: 1px solid #D17259 !important;}'
	+
	'.askInlineWidget .vote input[type="submit"] {background-color: rgba(0, 0, 0, 0) !important;}'
	+
	'.askInlineWidget .vote {border-right: 1px solid #7E574F !important;}'
	+
	'.a-row a:hover {color: #1E140F !important !important;}'
	+
	'.a-expander-partial-collapse-header {background-color: #AA462B !important;}'
	+
	'.a-expander-partial-collapse-header .a-size-base a-link-normal {color: #2F190B !important;}'
	+
	'.a-expander-content-fade {background: transparent linear-gradient(to bottom, rgba(255, 255, 255, 0), #AA462B) repeat scroll 0% 0% !important;}'
	+
	'textarea {background-color: #B7441E !important; color: #FFF !important;}'
	+
	'.a-expander-container .arrow-inner {border-color: #3E2D23 transparent !important;}'
	+
	'.a-expander-container .arrow-outer {border-color: #863F12 rgba(238, 238, 238, 0) !important;}'
	+
	'.a-form-actions {border-top: 1px solid #4A1F11 !important; background: transparent linear-gradient(to bottom, #3F1F16, #291313) repeat scroll 0% 0% !important;}'
	+
	'.make-money-tracking-wrapper:nth-child(2n+1) .simple-row {background: #18212D !important;}'
	+
	'.simple-row-column:not(:last-child) {border-right: 1px solid #A4643C !important;}'
	+
	'.simple-row-column {color: #F5DAC4 !important;}'
	+
	'#ag-empty-garage-image-container {opacity: .7 !important;}'
	+
	'#ag-no-vehicles-text-box {border: 5px solid #542C1C !important; background-color: #A56A5A !important;}'
	+
	'#automotive-feedback-tab-link a {color: #38211A !important;}'
	+
	'.a-popover-header, .a-button-primary.a-button-disabled .a-button-inner {background: transparent linear-gradient(to bottom, #77462C, #511E1E) repeat scroll 0% 0% !important; box-shadow: 0px 1px 0px rgba(155, 92, 39, 0.5) inset, 0px -1px 0px rgba(116, 52, 27, 0.4) inset !important;}'
	+
	'.a-button-primary.a-button-disabled {background-color: #C26344 !important; border-color: #F2C1B4 !important; border-width: 2px !important;}'
	+
	'#ap_email, #ap_password {color: #E7D0C9 !important;}'
	+
	'.custom-view-options {border-bottom: 1px solid #5C3427 !important;}'
	+
	'.acsUxWidget .bxw-content-grid .a-button.bxc-button {border-radius: 8px !important;}'
	+
	'.acs-bgtext-textblock ul li {color: #F28358 !important;}'
	+
	'.acs-bgtext-imageblock img {border-radius: 4px !important;}'
	+
	'.a-declarative input, #gc-redemption-input, .gcYANavCurrent {color: #F0D3C8 !important;}'
	+
	'.RBC1, .RBC11, .RBC13, .RBC3, .RBC5, .RBC7, .RBC9, .RBT3, .RBT5, .RBT7, .RBT9 {background-color: #4A3833 !important;}'
	+
	'.RBB1, .RBB11, .RBB12, .RBB14, .RBB2 {border: 1px solid #804C41 !important;}'
	+
	'.gcNewBalanceBox .autoReload {background-color: #513620 !important;}'
	+
	'.gcNewBalanceBox .autoReload {border-left: 1px solid #71463A !important;}'
	+
	'.gcNewTopBox h3, .gcNewTopBox p {color: #E7CBC1 !important;}'
	+
	'.gcCenterLayoutColumn table tbody tr td table {background: rgb(36, 23, 18) !important; opacity: .85 !important;}'
	+
	'.gcCenterLayoutColumn {border-left: 1px solid #563832 !important;}'
	+
	'div.gcAmountBox h3 span {color: #EC6A4E !important;}'
	+
	'.gcYASubnav li.selected {background-color: #84412B !important; border-left: 1px solid #812F1E !important; border-right: 1px solid #592121 !important;}'
	+
	'.gcYASubnav li {background-color: #452D26 !important; border-bottom: 1px solid #874029 !important; border-left: 1px solid #6F2C1A !important;}'
	+
	'.gcYASubnav li.first {border-top: 1px solid #572B20 !important;}'
	+
	'img[usemap="#gc-bday-refine"], img[usemap="#kidsbirthdays-hero"], map, .scheduled-ad a img, #header-logo {opacity: .75 !important;}'
	+
	'ul.a-tabs {background-color: #513620 !important; border: 1px solid #4A261C !important;}'
	+
	'ul.a-tabs .a-tab-heading.a-active a, ul.a-tabs li.a-active a {border-color: #E77600 #562323 #993929 !important; background-color: #6F4E4A !important;}'
	+
	'.wl-list.selected {background-color: #5C2C1C !important;}'
	+
	'.a-meter-animate table tbody tr td div div {color: rgb(239, 201, 201) !important;}'
	+
	'#a-page table tbody tr td table {background: #0C1118 !important;}'
	+
	'.fg-cell-list-item.fg-list-first-child {border-top: 1px solid #5D3C2C !important;}'
	+
	'.fg-cell-list-item {border-bottom: 1px solid #3C2D28 !important;}'
	+
	'.fg-theme-1.fg-cell-title {background: rgba(0, 0, 0, 0) !important; color: #CE6339 !important; font-size: 1.4em !important;}'
	+
	'.acs-bgh1-header h1, .acs-bgh1-header h2, .acs-bgh1-header h3, .acs-bgh1-header h4, .acs-bgh1-header h5, .acs-bgh1-header h6, .acs-category-header h2, h2 {color: #EFCCC0 !important;}'
	+
	'.acs-category-header h2, .dotdBadge {background: #C45500 !important;}'
	+
	'.GB-SUPPLE .shortCellView:hover .hoverVisible {background: #75301F !important; padding: 0.2em !important;}'
	+
	'.GB-SUPPLE .primeBadge {border-left: 1px solid rgb(93, 45, 45) !important; border-bottom: 1px solid rgb(93, 45, 45) !important; background: #C45500 !important;}'
	+
	'.GB-SUPPLE .primeBadge::after, .GB-SUPPLE .primeBadge::before {border-bottom: 1px solid rgba(0, 0, 0, 0) !important; border-top: 1px solid rgba(0, 0, 0, 0) !important; background: rgba(0, 0, 0, 0) !important;}'
	+
	'.GB-SUPPLE .shortCellView {border-color: #482E2E !important;}'
	+
	'.GB-SUPPLE .shortCellView:hover {border-color: #ED7A54 !important;}'
	+
	'.primeBadge, .peaBadge, .smallLine {color: #EFCCC0 !important;}'
	+
	'.coupon-border {border-color: #C55031 !important;}'
	+
	'.a-alert-inline-success .a-alert-container {color: #F35C2B !important;}'
	+
	'.smallLineDiscount {color: #E45121 !important;}'
	+
	'table.a-bordered {border-color: #BC533D !important;}'
	+
	'table.a-bordered tr:first-child th {background: transparent linear-gradient(to bottom, #9C4836, #722F2F) repeat scroll 0% 0% !important; border-color: #5F3A2D #53332B #4B221A !important; border-bottom: 1px solid #633636 !important; 0%; box-shadow: 0px 1px 0px rgba(189, 71, 52, 0.5) inset !important;}'
	+
	'table.a-bordered tr:last-child td {border-color: #513830 !important;}'
	+
	'table.a-bordered tr:nth-child(2n) {background-color: #322525 !important;}'
	+
	'#membershipInfoLeftPanelDiv {background-color: #3E2D23 !important; border-color: #833F31 !important;}'
	+
	'#customerNameWithGreetingSpan {color: #F2C2B5 !important;}'
	+
	'.autoRenewWarningMessage {background-color: #D46C34 !important;}'
	+
	'.a-alert-info .a-alert-container {background-color: #7B381E !important;}'
	+
	'#landing-header {background-color: #513428 !important;}'
	+
	'#signin {background: none !important;}'
	+
	'#hero .banner {border-top: 1px solid #4E2A20 !important; border-bottom: 1px solid #4E2A20 !important;}'
	+
	'.joinnow .btn {color: #803F1C !important;}'
	+
	'div.main_alert {background-color: #302F20 !important;}'
	+
	'.banner2 {border-top: 1px solid #382323 !important;}'
	+
	'.stepsrule {border-top: 1px solid #BA632B !important;}'
	+
	'ul.whatsnew li {border-bottom: 1px solid #B65A36 !important;}'
	+
	'.cs-help-sidebar-module .inner {border-bottom: 1px solid #78351F !important;}'
	+
	'.cs-help-content p.lead {border-bottom: 1px solid #87442E !important;}'
	+
	'p.lead {color: #E96937 !important;}'
	+
	'#acsux-hero li {opacity: .75 !important;}'
	+
	'#acsux-menu .acsux-active {background: #AA461F !important}'
	+
	'#acsux-menu li {border-color: rgb(159, 83, 58) !important; background: transparent -moz-linear-gradient(center top , #633326, rgb(63, 42, 35)) repeat scroll 0% 0% !important;}'
	+
	'.acsux-inner-menu span {color: #F2C7BB !important;}'
	+
	'h2.horizontal {background-color: #8C3421 !important;}'
	+
	'div.horizontal {border: 1px solid #4B281F !important; background-color: #302525 !important;}'
	+
	'.binChoice select {font-family: background: #542D17 !important; border: 1px solid #984429; border-radius: 2px !important; color: #EDCFC6 !important;}'
	+
	'.textColor {color: #F5D6C8 !important;}'
	+
	'#s-result-info-bar, .picker {background: #211815 !important;}'
	+
	'#error_msg, #zip_code_prompt {color: rgb(242, 213, 195) !important;}'
	+
	'.a-histogram-row {color: rgb(233, 209, 195) !important;}'
	+
	'.shoppingEngineSectionHeaders, .categoryRefinementsSection ul li strong {color: #F2CCC4 !important;}'
	+
	'input#p_postal_code {color: rgb(233, 209, 195) !important;}'
	+
	'.as-title-block-left span, .as-title-block-single-title span {background-color: #D57258 !important; border-radius: 2px !important; padding: 2px 8px !important;}'
	+
	'.kmd-section-divider {background-image: none !important;}'
	+
	'.kmd-text-paragraph-body {color: #F2D1CA !important;}'
	+
	'.kmd-paragraph-title, .kmd-section-tagline, #suggestion-title {color: #E15E3B !important;}'
	+
	'.kcc-container td, th.kcc-image, th.kcc-manufacturer, th.kcc-name, th.kcc-shopnow {border-right: 1px solid #543229 !important;}'
	+
	'th.kcc-attribute {border-left: 1px solid #5C2F1D !important;}'
	+
	'.kcc-fill {background-color: #6E4731 !important;}'
	+
	'kcc-fill td {color: #EDD !important;}'
	+
	'hr.bucketDivider::after {background: transparent -moz-linear-gradient(left center , #2C2121, rgba(255, 255, 255, 0), rgba(30, 22, 22, 0)) repeat scroll 0% 0% !important;}'
	+
	'#prodDetails table td.label {background-color: #2F201C !important;}'
	+
	'#prodDetails .col1 td, #prodDetails .col2 td {border-top: 1px dotted #B36330 !important;}'
	+
	'#prodDetails .content, #productDescription, .askTypicalExamples, .askExampleQuestion, #hero-quick-promo .headline, #hero-quick-promo .qpHeadline {color: #F3D2CC !important;}'
	+
	'img[src="/error-image/kailey-kitty._V192197191_.gif"] {border-radius: 2em !important;}'
	+
	'.generic-subnav-divider {background-color: #5C362E !important;}'
	+
	'.acsux-menu li {background: transparent -moz-linear-gradient(center top , rgb(65, 36, 36), rgb(32, 16, 16)) repeat scroll 0% 0% !important; border-color: rgb(87, 47, 34) rgb(110, 67, 56) #412626 !important; box-shadow: 0px 1px 0px rgba(53, 18, 18, 0.6) inset !important;}'
	+
	'.acsux-menu li.acsux-active {background: rgb(87, 46, 46) none repeat scroll 0% 0% !important;}'
	+
	'.acs-category-header h2 {padding: 2px 8px !important;}'
	+
	'.acs-wtfl-filtersort-wrap {border-bottom: 1px solid #54372C !important;}'
	+
	'.acs-wtfl-filtersort-wrap {background-color: rgba(237, 80, 28, 0.9);}'
	+
	'.acs-wtfl-filtersort-category {color: #090404 !important;}'
	+
	'.acs-wtfl-card-details {background-color: #45312B !important; border-top: 1px solid #B95050 !important;}'
	+
	'.acs-wtfl-card {border: 1px solid rgb(147, 92, 80) !important; background-color: rgb(39, 31, 31) !important;}'
	+
	'.acs-wtfl-quickview {background-color: rgba(53, 30, 23, 0.6) !important;}'
	+
	'.technicalData .h3color, .technicalData font, .technicalData ul, .technicalData {color: #F2CAC1 !important;}'
	+
	'.s-suggestion:hover {background-color: #512C2C !important;}'
	+
	'.aplus p, .kdp-footer .cr, .kdp-footer .kdp-social, .kdp-footer .links {color: #E7BCAD !important;}'
	+
	'.sims-fbt-checkbox-label, .sims-fbt-unselected-item {opacity: .75 !important}'
	+
	'#twister .swatches li.swatchUnavailable .text {color: #534945 !important;}'
	+
	'#productDescription .aplus table.data th {background: #3F2929 !important; border-color: #5C3737 !important;}'
	+
	'#productDescription .aplus table.data td {border-left: 1px solid #502A2A !important; border-bottom: 1px dotted #B1644A !important;}'
	+
	'#productDescription h3 {color: #E6735A !important;}'
	+
	'#merchant-help-links table table {border: 1px solid #512F2F !important;}'
	+
	'.indpub .sidebar h4 a {background-image: linear-gradient(116deg, #30160C 41.97%, #6B2617 100%) !important; text-shadow: 0px -1px 2px #200A0A !important;}'
	+
	'.mm-product tr {background: #642416 !important;}'
	+
	'.mm-product td {color: #F5D0C7 !important;}'
	+
	'.shade {background-color: #301E1B !important; box-shadow: 0px 0px 25px #4A1D15 inset !important;}'
	+
	'.indpub, .kdp-social, .jele-image-text-inner {opacity: .75 !important;}'
	+
	'.cta_text {color: #39231E !important;}'
	+
	'.mm-product {background-color: #30211D !important; border-radius: 1em !important;}'
	+
	'.indpub a.startbtn {color: #422A2A !important;}'
	+
	'.ctabox {border: 1px solid #2A1815 !important;}'
	+
	'.new-look .header-row, .signin-header .a-box-inner, .kdp-top-header {background-color: #382725 !important; background-image: none !important;}'
	+
	'.footer-top {background-color: #442E2A !important; border-color: #442924 !important;}'
	+
	'a.footer-link span.footer-link-header {color: #EFC7BC !important;}'
	+
	'#ap_email, #ap_password {color: #E7D0C9 !important; background: #5A352E !important; border: 1px solid #9C4C37 !important;}'
	+
	'.navigation-row {background-color: #59322D !important; border-bottom: 1px solid #7B3030 !important;}'
	+
	'.agreement-display {border: 1px solid #5C332E !important;}'
	+
	'.agreement-display table, .agreement-display table td {border: 1px solid #633A31 !important;}'
	+
	'.kdp-footer {background-color: #231919 !important;}'
	+
	'#help-breadcrumb, #help-search-heading {border-bottom: 1px dotted #955547 !important;}'
	+
	'.a-box-title .a-box-inner {background: transparent linear-gradient(to bottom, #AD4B40, #713B2D) repeat scroll 0% 0% !important;}'
	+
	'#help-content .help-content, #help-content .help-content ol, #help-content .help-content ul {color: #F5CECE !important;}'
	+
	'.deals-image .deals-inner .price-section .a-color-price {color: #F9805F !important !important;}'
	+
	'.hud-carousel-element a:active .subtext, .hud-carousel-element a:focus .subtext, .hud-carousel-element a:link .subtext, .hud-carousel-element a:visited .subtext {color: #F07B5B !important;}'
	+
	'#hud-dashboard .label {color: #DE6B4C !important;}'
	+
	'.a-section-expander-container {border: 1px solid #BC6A50 !important;}'
	+
	'.a-section-expander-container:first-child a.a-link-section-expander {background: #231310 !important;}'
	+
	'#ybh.desktop .asin_container:not(.right), #ybh.tablet .asin_container:not(.right) {border-right: 1px solid #452B26 !important;}'
	+
	'#ybh.desktop .asin-title, #ybh.tablet .asin-title {color: #EA684C !important !important;}'
	+
	'.a-switch-control {background: transparent linear-gradient(to bottom, #AE3414, #8A1616) repeat scroll 0% 0% !important; box-shadow: 0px 1px 0px 0px #B01414 inset, 0px 1px 3px rgba(0, 0, 0, 0.1) inset, 0px 0px 1px #231C1C inset, 0px 1px 2px rgba(0, 0, 0, 0.15) !important;}' 
	+
	'.a-switch, .a-switch-control {border-color: #CF3F34 #CB4B30 #C66038 !important;}'
	+
	'.prime-button-try a {color: #392222 !important;}'
	+
	'ul.a-box-list li {border-bottom: 1px solid #7B3A3A !important;}'
	+
	'.cs-help-content .cs-help-landing-section {border-bottom: 1px solid #864230 !important;}'
	+
	'.cs-help-content .linkfarm li a {color: #BD5134 !important;}'
	+
	'.bxc-grid__text--light.bxc-grid-overlay--background {background: #513620 !important; color: #E47911 !important;}'
	+
	'.gift-page-desktop .clear-all-link-text-disabled {color: #F07E51 !important;}'
	+
	'.gift-page-desktop .age-group-container .interest-filter-area .interest-filter-button {border: 1px solid #C96E5A !important;}'
	+
	'.gift-page-desktop .age-group-container .interest-filter-area .interest-filter-button:hover {background-color: #5F4B39 !important;}'
	+
	'.gift-page-desktop .price-prime-filter-container .price-dropdown {border: 1px solid #412A2A !important;}'
	+
	'.prime-button {background-color: #2F201A !important; border: 1px solid #C96E5A !important; color: #EDD !important;}'
	+
	'.prime-button:hover {background-color: #E6A391 !important;}'
	+
	'#modal-scroller {background: #140A0A !important;}'
	+
	'#wr-home-find-registry-first-name, #wr-home-find-registry-last-name {color: #EDD !important;}'
	+
	'.wr-home-banner {opacity: .75 !important;}'
	+
	'.wr-layout-body {background: #18212D !important;}'
	+
	'.wr-page-footer-title {color: #E95A21 !important;}'
	+
	'.wr-page-footer-content {color: #EDD !important;}'
	+
	'#hsx-list-top-bar td {background: #3E2D23 !important;}'
	+
	'#list-preview-btn-publish-action span span button {color: #E9DDD3 !important;}'
	+
	'div #list-preview-contents-1LY7L0OYARUVK {border-left: 1px solid #724838;}'
	+
	'.cs-contact-title {border: 1px solid #753E32 !important;}'
	+
	'.leftcol .step {margin-left: -1em !important;;}'
	+
	'#orderSection h2.step::before {content: "1) " !important; padding-left: 1em !important;}'
	+
	'#issueSelectorSection h2.step::before {content: "2) " !important; padding-left: 1em !important;}'
	+
	'a.anchor-radio-btn:hover {border: 1px solid #B6533E !important;}'
	+
	'#orderYes, #kindleYes, #orderDigital, #orderNo {border-color: #7B443B !important; background: transparent -moz-linear-gradient(center top , #904141 0px, #60311E 100%) repeat scroll 0% 0% !important;}'
	+
	'#orderYes:hover, #kindleYes:hover, #orderDigital:hover, #orderNo:hover {border: 1px solid rgb(182, 83, 62) !important; background: rgb(80, 49, 49) none repeat scroll 0% 0% !important;}'
	+
	'.cu-bottom, .cu-bottom-left, .cu-eb-bottom, .cu-eb-bottom-left, .cu-eb-top, .cu-eb-top-left, .cu-top, .cu-top-left {background-image: none !important;}'
	+
	'.cs-step-answer select {background: #8F432E !important; color: #EDD !important; border: 1px solid #CB523F !important;}'
	+
	'.cu-middle {border-left: 1px solid #573A34 !important; border-right: 1px solid #573A34 !important;}'
	+
	'.cs-step {border-bottom: 1px dotted #8D584D !important;}'
	+
	'.ap_content {background: rgb(81, 55, 55) !important;}'
	+
	'.ap_popover .ap_titlebar {background: #7D3222 !important; border-bottom: 1px solid #AB4726 !important;}'
	+
	'.ap_popover_sprited .ap_footer .ap_left, .ap_popover_sprited .ap_footer .ap_middle, .ap_popover_sprited .ap_footer .ap_right, .ap_popover_sprited .ap_header .ap_left, .ap_popover_sprited .ap_header .ap_middle, .ap_popover_sprited .ap_header .ap_right {background-image: none !important;}'
	+
	'.w160, .amzn-btn, .btn-sec-med, #embed-content, .dv-packshot-image {opacity: .8 !important;}'
	+
	'.ap_left, .ap_right {display: none !important;}'
	+
	'.doItYourself2 p, .a-size-mini {color: #F8DADA !important;}'
	+
	'.doItYourself2 {border-top: 1px solid #5A3030 !important;}'
	+
	'.cs-contact-method .bestmethod {background: #241712 !important;}'
	+
	'#selfServiceActionTableStandaloneTextArea ul {color: #F2D7D0 !important;}'
	+
	'.selfServiceActionTable, ol li, .dv-carousel-heading p {color: #F2D7D0 !important;}'
	+
	'.newOrderSummary {border: 1px solid #452525 !important;}'
	+
	'.newOrderShipmentActions {background-image: none !important;}'
	+
	'.dv-fs .dv-fs-list-wrapper {background-color: #18212D !important; border-bottom: 1px solid #350F0F !important;}'
	+
	'.dv-new-ux .dv-superhero-carousel {background-color: #18212D !important;}'
	+
	'.dv-carousel-item .dv-carousel-item-image, .dv-hero-carousel .dv-tile-image {opacity: .85 !important;}'
	+
	'.dv-new-ux .dv-carousel-heading {background-color: #542929 !important;}'
	+
	'.dv-carousel-control {background-color: #542929 !important;}'
	+
	'.dv-packshot-title {opacity: 0 !important;}'
	+
	'#universal-hover {opacity: .85 !important; background-color: #542929 !important; border: 1px solid #AB4726 !important;}'
	+
	'#uh-watchBox {border-top: 1px solid #AB4726 !important;}'
	+
	'.dv-new-ux #dv-super-hero .dv-carousel-item, .dv-new-ux #dv-super-hero .dv-tile {opacity: .9 !important;}'
	+
	'.dv-ad-packshot, .dv-carousel-element, .dv-seed-item, .dv-shelf-item {background-color: #140C0C !important;}'
	+
	'#aiv-pin-form input[type="text"] {color: #EDD !important;}'
	+
	'.aiv-expander-requires-pin {color: #E96C43 !important;}'
	+
	'.aiv-feature-on {color: #C0441C !important;}'
	+
	'.public-name-text {color: #F3C1C1 !important;}'
	+
	'.stats-bar {background-color: #2F201A !important;}'
	+
	'.stats-bar .stat {border-right: 1px solid #573C3C !important;}'
	+
	'.touBox p, .acs-wtfl-filtersort-category {color: #F3D8D3 !important;}'
	+
	'.p13n-text-color-secondary {color: #F3D8D3 !important;}'
	+
	'.p13n-sc-nonAUI-sprite {opacity: .5 !important;}'
	+
	'.shoveler-pagination span {color: #F3C1C1 !important;}'
	+
	'.root .modal-overlay {background-color: #3C2222 !important;}'
	+
	'.onboard .onboard-product-card {border: 1px solid #955247 !important;}'
	+
	'.feedback-link {background-color: #392626 !important;}'
	+
	'.sizing-trays .tray {background-color: #5A2828 !important; box-shadow: 0px 0px 6px #211414 inset !important;}'
	+
	'.nib .t2 {border-bottom: 24px solid #5A2828 !important;}'
	+
	'.nib .t1 {border-bottom: 12px solid #391818 !important;}'
	+
	'.airstream-image-container {background: #382424 !important;}'
	+
	'.s-airstream-list .s-item-container {border-left: 1px solid #632929 !important;}'
	+
	'.s-airstream-list {border-right: 1px solid #632929 !important;}'
	+
	'.s-item-wrapper {background: #362323 !important;}'
	+
	'a.aux-intro-dismiss {border: 1px solid #573232 !important;}'
	+
	'#airstream-navigation {background-color: #6B5346 !important;}'
	+
	'.a-global-nav-wrapper {background: transparent linear-gradient(to bottom, #6B3232, #471E13) repeat scroll 0% 0% !important;}'
	+
	'.swa-sub-nav-links span, .acs-wtfl-filtersort-category:hover {color: #EFCCC5 !important;}'
	+
	'.swa-widget-list-header {background-color: #302420 !important; border-bottom: 1px solid #623C3C !important;}'
	+
	'.swa-widget-list, .swa-other-subsmgr-widget {border: 1px solid #562929 !important;}'
	+
	'.acs-wtfl-filtersort-wrap {background-color: rgba(56, 37, 37, 0.9) !important;}'
	+
	'.acs-wtfl-filtersort-sortby {border-left: 1px solid #683030 !important;}'
	+
	'.acs-wtfl-filtersort-sortby:hover {background-color: #712C2C !important;}'
	+
	'#orders-box {border-right: 1px solid #7A422C !important;}'
	+
	'#ya-ohs-searchbox, .a-spacing-micro a div, .a-input-text, div#mp-slotted, #contentSearch_myx, .myx-button-text, .myx-button-text .ng-scope {color: #EDD !important;}'
	+
	'.hud-modal .try-prime {background-color: #361C1C !important;}'
	+
	'table.a-bordered td, table.a-bordered th {border-bottom: 1px solid #DD4D1E !important;}'
	+
	'.sns-top-subnav-row {background-color: #472D2D !important; border-bottom: 1px solid #5F2C2C !important;}'
	+
	'.info-panel {border-right: 1px solid #4A2D25 !important;}'
	+
	'.no-subs-page .info-panels {border-bottom: 1px solid #4E291D !important;}'
	+
	'.rightbox-bordered {border: 10px solid #381E18 !important; background-color: #4B251D !important;}'
	+
	'.iss-color-link {color: #DE7255 !important;}'
	+
	'.iss-color-secondary {color: #B73715 !important;}'
	+
	'.slot-main hr {display: none !important;}'
	+
	'.myx-alert-info .myx-alert-container, .myx-alert-info > .myx-box-inner:only-child {background-color: #452B26 !important;}'
	+
	'.myx-alert-info {border-color: #6C291B !important;}'
	+
	'.navHeader_myx .navOptions_myx ul.myx-tabs > li .tab_myx > a, .navHeader_myx .navOptions_myx ul.myx-tabs > li > a {border-right: 1px solid #C25734 !important;}'
	+
	'.navHeader_myx .navOptions_myx ul.myx-tabs > li .tab_myx > a, .navHeader_myx .navOptions_myx ul.myx-tabs > li > a {background: #413434 !important;}'
	+
	'.myx-active a {background-color: #6E2C2C !important;}'
	+
	'.contentTaskBarItem_myx .dropDownToggle_myx .myx-button-inner {background: #413434 !important;}'
	+
	'.myx-button-inner {box-shadow: 0px 1px 0px rgba(104, 28, 28, 0.6) inset !important;}'
	+
	'.myx-button {background: #35241F !important; border-color: #84463B #541C1C #6B2B1D !important;}'
	+
	'ul.myx-tabs {border: 1px solid #C66538 !important;}'
	+
	'.myx-color-base, .mycd-household-list, .mycd-household-list, .myx-color-base, .ng-binding {color: #EDD0C8 !important !important;}'
	+
	'.myx-color-secondary, .myx-color-base {color: #EC5422 !important !important;}'
	+
	'.myx-button .myx-button-inner {background: transparent -moz-linear-gradient(center top , #A23D27, #7D301F) repeat scroll 0% 0%  !important;}'
	+
	'.myx-color-link {color: #D24E32 !important;}'
	+
	'.myx-box {border: 1px solid #7D3E3E !important; background-color: #4E2E29 !important;}'
	+
	'.myx-button-inner {background: transparent -moz-linear-gradient(center top , #782F23, #4B1C15) repeat scroll 0% 0% !important;}'
	+
	'.myx-button:hover {border-color: #A24835 !important;}'
	+
	'.myx-popover .myx-popover-wrapper {background-color: #382525 !important;}'
	+
	'.myx-dropdown .myx-list-link li:focus a, .myx-dropdown .myx-list-link li:hover a, .myx-splitdropdown .myx-list-link li:focus a, .myx-splitdropdown .myx-list-link li:hover a, .myx-suggest .myx-list-link li:focus a, .myx-suggest .myx-list-link li:hover a {border-color: #502D2D !important; background-color: #291919 !important;}'
	+
	'table.myx-bordered tr:first-child th {background: transparent -moz-linear-gradient(center top , #664040, #472222) repeat scroll 0% 0% !important; box-shadow: 0px 1px 0px rgba(59, 19, 19, 0.5) inset !important; border-color: #472929 !important;}'
	+
	'table.myx-bordered {border-color: #602D2D !important;}'
	+
	'.myx-color-base {background: #A15858 !important;}'
	+
	'.mycd-household-list li, .myx-color-secondary, #a-page div.unified_widget.pageBanner p, .vxd-smaller-h2, div.vxd-wrap a.vxd-music-bs-artist, div.vxd-wrap .vxd-music-bs-artist, .gry, .asSection select {color: #EDD !important;}'
	+
	'#a-page div.unified_widget.pageBanner h1.bkgnd {background-color: #0C1118 !important;}'
	+
	'.bkgnd, #tou.en_US {opacity: .8 !important;}'
	+
	'#touContinue {color: #3B2510 !important;}'
	+
	'#ap_overlay, #ap_overlay div {background-color: #090606 !important; opacity: .8 !important;}'
	+
	'#enterAddressCountryCode, select {background: #2C251F !important; border: 1px solid #8D4D16 !important;}'
	+
	'#enterCreditCardForm select, #enterCreditCardForm input, .roundedBox tbody tr .content, #left-content.dragonfly .mainLinks .mainLinksTitle, #sort, .bucket .content ul, .asField {color: #EDD !important;}'
	+
	'.s-result-card, .s-result-card-for-container .s-item-container {border: 1px solid rgb(86, 42, 42) !important; box-shadow: 1px 1px 3px 0px rgb(75, 37, 37) !important; background-image: linear-gradient(to top, rgb(78, 24, 24) 0px, rgb(158, 44, 44) 20%, rgb(192, 74, 35) 60%) !important;}'
	+
	'.ap_body {background-color: #4E3434 !important;}'
	+
	'#MediaMatrix #twister #binding_row_landing, #MediaMatrix #twister .top-level.selected-row {background: #2F261E none repeat scroll 0px 0px !important;}'
	+
	'#revDivider {border-top: 1px solid #57332D !important;}'
	+
	'#MediaMatrix #twister tr:hover {background-color: #543420 !important;}'
	+
	'.fading-line {background: transparent linear-gradient(#C65326, #87412E, #C65326) repeat scroll 0% 0% !important;}'
	+
	'table.roundedBox td.bottom, table.roundedBox td.topLeft, table.roundedBox td.topRight, table.roundedBox td.right, table.roundedBox td.bottomRight, table.roundedBox td.bottomLeft, table.roundedBox td.left, table.roundedBox td.top {background-image: none !important;}'
	+
	'.singlecolumnminwidth div table tbody tr td {background: rgb(36, 23, 18) none repeat scroll 0% 0% !important;}'
	+
	'#asNav .asSubhead, #asNav .selected, #asNav .asNavLink, #asNav .asNavBottom {border-right: 1px solid #934A4A !important; border-bottom: 1px solid #7E4848 !important;}'
	+
	'#asNav .asNavLink a:hover {background: #4B2B24 !important;}'
	+
	'#asMain tbody tr td {background-image: none !important;}'
	+
	'.a-alert-warning .a-alert-container {box-shadow: 0px 0px 0px 4px #74372B inset !important;}'
	+
	'.a-accordion .a-accordion-active .a-accordion-row {background-color: #412525 !important;}'
	+
	'.a-accordion .a-accordion-active .a-accordion-inner {background-color: #2A1A1A !important;}'
	+
	'.a-accordion .a-accordion-row {background-color: #331313 !important;}'
	+
	'.a-accordion .a-accordion-row:hover {background-color: #532626 !important;}'
	+
	'.a-dropdown-common .divider {background-color: #201612 !important;}'
	+
	'.a-divider.a-divider-section .a-divider-inner, .a-color-offset-background .a-box .a-divider.a-divider-section .a-divider-inner, .a-color-offset-background .a-color-base-background .a-divider.a-divider-section .a-divider-inner {background: transparent -moz-linear-gradient(center top , #2C1010, #4A1717 3px, #241712) repeat scroll 0% 0% !important;}'
	+
	'.addr-display ul, #AddressType {color: #F5CBCB !important;}'
	+
	'.notouch ul.order-level-item-summary-list li div, .rk1, tiny-example, .kcc-fill td, .kcc-row td {color: #F3D4CF !important;}'
	+
	'#standardRates_expanded table tbody tr td, .tiny, .sans {background: #1D1414 !important;}'
	+
	'.kfs-popover-container {background-color: rgb(62, 45, 35) !important; border: 1px solid #45332F !important; color: #F2DAD5 !important;}'
	+
	'.kfs-bg-container {background-image: none !important; background-color: rgb(62, 45, 35) !important; border: 1px solid rgb(134, 63, 18) !important;}'
	+
	'.kfs-front-title, img[alt="Amazon.com Logo"] {background-color: #F6E2E2 !important;}'
	+
	'#technical-details-table tbody tr td {border-bottom: 1px solid rgb(171, 78, 63) !important; background: rgb(51, 35, 35) !important;}'
	+
	'.kfs-inner-container {opacity: .7 !important;}'
	+
	'.kfs-selected {opacity: 1 !important;}'
	+
	'#buybox_feature_div .a-native-dropdown, #buybox .a-native-dropdown, .share_count_text, .cat-link, .ap_pagelet_title p, .section-sub-tagline, .plan .content {color: #EDD !important;}'
	+
	'#get-started, .section-right .blue {border: 2px solid #562C2C !important; background-color: #382828 !important;}'
	+
	'.btn.white:hover, .btn.white:active, .btn.blue:hover, .btn.blue:active {background-color: #532626 !important;}'
	+
	'.section-right .section-sub-tagline {color: #E45B25 !important;}'
	+
	'#home-banner {background-color: rgba(35, 26, 26, 0.9) !important;}'
	+
	'#app-dropdown li, .section-sub-tagline {color: #F6D0D0 !important;}'
	+
	'#app-dropdown {border: 3px solid #B6481D !important;}'
	+
	'#pricing-panel #plans-container .plan {background: rgba(99, 51, 51, 0.9) !important; border: 3px solid #963C2D !important;}'
	+
	'#pricing-panel #plans-container .plan:hover {background-color: #775E5E !important; border: 3px solid #963C2D !important;}'
	+
	'.plan .desktop-download-msg {background-color: #322121 !important;}'
	+
	'.plan .content .cta {background-color: #A44D3A !important;}'
	+
	'#pricing-panel #plans-container .plan .content .content-title, .pricing-content, .app-catagory-title {color: #EA5F42 !important;}'
	+
	'.pricing-section, .prime-desc-container {border: 3px solid #89402C !important;}'
	+
	'.pricing-content, .panel .legal, #prime-panel, .prime-panel-title {color: #F3A9A9 !important;}'
	+
	'.description-item-list li, #prime-panel-subcopy, .featured-apps-description-title {color: #DE4D1D !important;}'
	+
	'.call-to-action .footer {background-color: #482929 !important;}'
	+
	'#prime-panel {background-color: rgb(36, 23, 18) !important; color: #DE4D1D !important;}'
	+
	'#free-with-prime, .featured-apps-description {color: #E65841 !important;}'
	+
	'.featured-apps-description {color: #F2D2CD !important;}'
	+
	'.featured-apps-pic-container {border: 1px solid #622C2C !important;}'
	+
	'#twitter-follow {border: 2px solid #7D3C3C !important;}'
	+
	'.parseasinTitle, .mas-rating-title {color: #F6CBCB !important;}'
	+
	'.masrw-box {border: 1px solid #933737 !important; background-color: #44231D !important;}'
	+
	'.masrw-box-footer {border-top: 1px solid #722424 !important;}'
	+
	'.grayBox {border-color: #873939 !important;}'
	+
	'.masrw-main-image-inner {background-color: #382D2A !important;}'
	+
	'.cBoxTL, .cBoxTR, .cBoxBL, .cBoxBR {background-image: none !important;}'
	+
	'div.bucket {color: #FCD8D8 !important;}'
	+
	'center .small, .cBoxB, .cBoxR {background-color: rgb(62, 43, 40) !important; border: 1px solid rgb(109, 32, 15) !important;}'
	+
	'#masrw-get-app-button-announce, .masrw-button-text, .goButton {color: rgb(71, 48, 48) !important;}'
	+
	'.mas-availability, .dv-ad-desc {color: rgb(228, 61, 26) !important;}'
	+
	'.feature table {border-top: 1px solid rgb(140, 72, 45) !important;}'
	+
	'.jump-links-separator {color: #B33F20 !important;}'
	+
	'.dv-ad-packshot, .dv-carousel-element, .dv-seed-item, .dv-shelf-item {background-color: #C84C4C !important; border: 1px solid #C84C4C !important;}'
	+
	'.dv-ad-shelf .dv-ad-unit {border: 1px solid #6F2424 !important; background: transparent linear-gradient(to bottom, #691A1A 0px, #452411 100%) repeat scroll 0% 0% !important;}'
	+
	'.dv-new-ux .dv-carousel-heading .dv-view-all, .dv-new-ux .dv-carousel-heading h3, .dv-new-ux .dv-carousel-heading p {color: #D4482A !important;}'
	+
	'.p13n-text-color-base {color: #F2C9C9 !important;}'
	+
	'#oneBAv2-header-container {background-image: none !important; background-color: #593535 !important;}'
	+
	'.aA-slider-menu-option:hover, .aa-active {background-color: rgb(63, 41, 41)!important; border: 1px solid #723636 !important;}'
	+
	'#sliderMenuHeader {color: #F0CBCB !important;}'
	+
	'#aASliderMenu .slider-menu-text, .dv-cl-breadcrumb-text {color: #F3754C !important;}'
	+
	'#sliderImageContainer {opacity: .85 !important;}'
	+
	'#dv-cl-breadcrumb {background-color: #2C1F1B !important; border-bottom: 1px solid #602121 !important; color: #EDD !important;}'
	+
	'#dv-cl-top-bar {background-color: #18212D; border-bottom: 1px solid #602121 !important;}'
	+
	'.dv-cl-empty-holder {background: #3F2525 !important;}'
	+
	'.dv-cl-empty-holder span {background: transparent linear-gradient(to bottom, #812323 0px, #592D1F 100%) repeat scroll 0% 0% !important; border: 1px solid #511111 !important;}'
	+
	'.dv-action-secondary .dv-button-inner, .dv-action.dv-watchlist .dv-button-inner, .dv-buzz a.dv-button-inner {background: #78402E !important;}'
	+
	'.dv-action-secondary .dv-button-inner, .dv-action.dv-watchlist .dv-button-inner, .dv-buzz a.dv-button-inner {color: #F5D4D4 !important;}'
	+
	'.carousel-progress-bar-scrubber {background: #683423 !important;}'
	+
	'.carousel-progress-bar-track {background: #C56540 !important;}'
	+
	'.carousel-progress-bar {background-color: #4D2727 !important;}'
	+
	'.carousel-control {background-color: #C56540 !important;}'
	+
	'table.a-keyvalue th {color: #EDD !important;}'
	+
	'#a-autoid-1-announce .a-color-secondary, #a-autoid-0-announce .a-color-secondary {color: #533126 !important !important;}'
	+
	'.atv_di fieldset {border-color: #92503F !important;}'
	+
	'.atv_di th {background-color: #563232 !important;}'
	+
	'.atv_row_alt {background-color: #362525 !important;}'
	+
	'.va-product-title, .va-product-image {background-color: #392020 !important; border-color: #723333 !important;}'
	+
	'.shelf li {background: #241C1C none repeat scroll 0% 0% !important; border: 1px solid #692929 !important;}'
	+
	'h2.a-size-base, .a-color-secondary {text-shadow: 1px 1px 3px #38140C !important;}'
	+
	'.slp-widget {background-color: #302121 !important;}'
	+
	'.slp-widget .slp-container {background: #7B6060 !important;}'
	+
	'#slp-install-instr-input {color: #EDD !important;}'
	+
	'.slp-hor-line {border-color: #020101 !important;}'
	+
	'.slp-highlight {background-color: #18212D !important;}'
	+
	'.content-header {border-bottom: 1px solid #542D2D !important;}'
	+
	'#nav-subnav.spacious {box-shadow: 0px 0px 1px #501D1D !important;}'
	+
	'.nav-subnav #nav-subnav.spacious .nav-a.nav-active .nav-a-content, .nav-subnav #nav-subnav.spacious .nav-a:hover .nav-a-content {color: #EAB8B8 !important;}'
	+
	'.product-card .info-grid .title::after {background: transparent linear-gradient(to right, rgba(255, 255, 255, 0), #241712 40%) repeat scroll 0% 0% !important;}'
	+
	'.as-header {background-color: #563C3C !important;}'
	+
	'.as-header .as-dropdown {background-color: #3F2828 !important;}'
	+
	'.as-cta-button, .as-cta .as-cta-primary .as-cta-button, .as-cta .as-cta-pill .as-cta-button {color: #392222 !important;}'
	+
	'.as-border.as-border-vertical.as-border-dark {border-color: #512519 !important;}'
	+
	'.as-cta .as-cta-primary.as-cta-inverse .as-cta-button, .as-cta .as-cta-inverse.as-cta-pill .as-cta-button {background-color: #381D1D !important;}'
	+
	'.as-subnavbar {background-color: #513A36 !important;}'
	+
	'ul.subnav-items .subnav-item {opacity: .8 !important;}'
	+
	'ul.subnav-items .subnav-item:hover {opacity: 1 !important;}'
	+
	'.as-bg-white {background-color: #412727 !important;}'
	+
	'.as-bg-dark-light {background-color: #17110F !important;}'
	+
	'.divider {border-color: #663636 !important;}'
	+
	'.as-hero-container.as-hero-aqua-theme {border-top: 10px solid #382824 !important; background-color: #382824 !important;}'
	+
	'.subnav-item a {background: #9C7979 !important; border-radius: 1em !important;}'
	+
	'.as-border.as-border-vertical {border-left: 1px solid #331919 !important; border-right: 1px solid #331919 !important;}'
	+
	'h3.as-heading {color: #E4CBC6 !important;}'
	+
	'.as-color-blue {color: #DA5438 !important;}'
	+
	'.as-header .countries {background-color: #3B2121 !important; border-radius: .5em !important;}'
	+
	'.a-container {border-top: 1px solid #573028 !important;}'
	+
	'#actionPanelWrapper.burj {background: rgba(42, 30, 28, 0.9) !important;}'
	+
	'#merchant-info, .a-carousel-heading, a-span8 h2, .brandFrom, #zg_banner_subtext, .zg_price, .zg_more_title {color: #F5DBD6 !important;}'
	+
	'#burjPpdDivider {background: linear-gradient(to bottom, #000 0px, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0) 80%, #AE3939 100%) repeat scroll 0% 0%, #5F3629 none repeat scroll 0% 0% !important;}'
	+
	'#fast-track-message .a-section {border-bottom: 1px solid #442824 !important;}'
	+
	'.a-carousel-heading, .bucket h2, .askInlineWidget h2, .a-span8 h2 {background: #9B6259 !important; border-radius: 4px !important; padding: 2px 6px !important;}'
	+
	'.product-title {border-left: 1px solid #782E2E !important; border-right: 1px solid #782E2E !important; border-bottom: 1px solid #4E2525 !important;}'
	+
	'.rhf-source-title {color: #322727 !important; background: none !important;}'
	+
	'.ybh-fresh-link, .drkgry {color: #E6B9B9 !important;}'
	+
	'.bucket h2 {text-shadow: 0px 0px 4px #170B0B !important;}'
	+
	'.zg_more_seeAll .text, .readMoreLink {color: #E47911 !important;}'
	+
	'#zg_col2 {border-left: 1px solid #60392F !important;}'
	+
	'.zg_more_subtitle {border-top: 1px solid #603C34 !important;}'
	+
	'.histoFullBar {border: 1px solid #5A2A2A !important;}'
	+
	'input[type="text"], .c7yBadge, .VN-1 {color: #EDD !important;}'
	+
	'.reviews a.btn-sec, .reviews span.btn-sec {background: transparent -moz-linear-gradient(center top , #A75A4A, #532719, #602A21) repeat scroll 0% 0% !important;}'
	+
	'.reviews .btn-sec {border-color: #6B2D1D !important; text-shadow: 0px 1px 0px #4E261E !important; color: #EDD important;}'
	+
	'.a-color-price {text-shadow: 0px 0px 2px #422 !important;}'
	+
	'.acs-en-widget.acs-en-noTabs .acs-en-full .acs-en-main-section-container {border-left: 1px solid #51281D !important;}'
	+
	'.subnav.dock {background-color: rgba(65, 39, 39, 0.9) !important;}'
	+
	'.size-editor {background-color: #5D362C !important;}'
	+
	'.size-selection-container {background-color: #351D1D !important;}'
	+
	'.size-editor-content {color: #F5CACA !important;}'
	+
	'.tab-wrapper {background: #4E3B3B !important;}'
	+
	'.size-tabs .single-size-tab.selected {border-bottom: 1px solid #5F1A1A !important; border-top: 1px solid #5F1A1A !important;}'
	+
	'.single-size-tab.selected {background-color: #351D1D !important;}'
	+
	'.size-tabs {background-color: #503636 !important; border-right: 1px solid #512A2A !important;}'
	+
	'.size-selection-summary, .size-remove {color: #ED5D3E !important;}'
	+
	'.size-cell:hover {background-color: #3E2626 !important;}'
	+
	'.size-cell {border: 1px solid #7D3C3C !important;}'
	+
	'.a-popover-footer {background: transparent linear-gradient(to bottom, #8C4646, #501212) repeat scroll 0% 0% !important; border-top: 1px solid #742D2D !important;}'
	+
	'.su-horizontal-divider {background-color: #331919 !important; background-image: linear-gradient(to left, #000 0px, #F05B33 50%, #060202 100%) !important;}'
	+
	'#payment-method .paymentNew.hover, #payment-method .paymentNew.selected, #payment-method .paymentNew:hover, #payment-method tr th, #payment-method tr.hover, #payment-method tr.selected, #payment-method tr:hover {background-color: #3F2323 !important;}'
	+
	'#payment-method td, #payment-method th {border-bottom: 1px solid #9B4D4D !important;}'
	+
	'.su-form table {border: 1px solid #7A2D2D !important;}'
	+
	'.paymentNew {border: 1px solid #652E2E !important;}'
	+
	'#payment-method .paymentNew, #payment-method tr {background-color: #332727 !important;}'
	+
	'#billing-address .addressNew.hover, #billing-address .addressNew.selected, #billing-address .addressNew:hover, #billing-address th, #billing-address tr.hover, #billing-address tr.selected, #billing-address tr:hover, #delivery-address .addressNew.hover, #delivery-address .addressNew.selected, #delivery-address .addressNew:hover, #delivery-address th, #delivery-address tr.hover, #delivery-address tr.selected, #delivery-address tr:hover, #validate-address th, #validate-address tr.hover, #validate-address tr.selected, #validate-address tr:hover {background-color: #332727 !important;}'
	+
	'#billing-address td, #billing-address th, #delivery-address td, #delivery-address th, #validate-address td, #validate-address th {border-bottom: 1px solid #5C1F1F !important;}'
	+
	'#billing-address .addressNew, #delivery-address .addressNew {border: 1px solid #6E2C2C !important;}'
	+
	'#billing-address .addressNew, #billing-address tr, #delivery-address .addressNew, #delivery-address tr, #validate-address tr {background-color: #3F2323 !important;}'
	+
	'.new-address-details ul li label, .tail, .new-payment-details ul li label {color: #D76047 !important;}'
	+
	'select, #validation-error ul li {color: #EDD !important;}'
	+
	'.a-alert-container {box-shadow: 0px 0px 0px 4px #662626 inset !important;}'
	+
	'#refinementsOnTop {background: #2C1B1B none repeat scroll 0% 0% !important; border-bottom: 1px solid #593838 !important;}'
	+
	'.dp-accordion-row {background: transparent -moz-linear-gradient(center top , #352020, #6F1919) repeat scroll 0px 0px !important; box-shadow: 0px 1px 0px rgba(78, 50, 50, 0.5) inset, 0px -1px 0px rgba(188, 35, 35, 0.4) inset !important;}'
	+
	'#nope {box-shadow: 0px 0px 0px 1px #753030 inset !important; background-color: #422A2A !important;}'
	+
	'.s9NavTitle, #amsSparkleBrandName, #amsShopNow {color: #F2D0D0 !important;}'
	+
	'#amsSparkleAdBrandContainer {background: #4A2D2D none repeat scroll 0% 0% !important;}'
	+
	'#amsSparkleHead, .amsSparkleAsinTitle {color: #CF441F !important;}'
	+
	'#amsSparkleAdWrapper {border-bottom: 1px solid #743932 !important;}'
	+
	'#amsSparkleBufferContainer {background: #4A2D2D !important;}'
	+
	'.twisterShelf_displaySection {border: 2px solid #6B2F2F !important;}'
	+
	'.twisterShelf_infoSection span {color: #E7A0A0 !important;}'
	+
	'.expanderButton {background: #623434 !important; color: #EDD !important;}'
	+
	'.expanderButton span, .ItemTitle {color: #EDD !important;}'
	+
	'.twisterShelf_container::after {border-bottom: 1px solid #4E3333 important; display: none !important;}'
	+
	'.a-text-center {border-bottom: 1px solid #593434 !important;}'
	+
	'.twisterShelf_placeholder_price, .twisterShelf_placeholder_badge {background: #271D1C !important;}'
	+
	'.a-meter-animate .header td {border-bottom: 1px solid #602518 !important;}'
	+
	'.featuredVideoHero, .heroImageWrapper {background-color: rgb(42, 26, 26) !important;}'
	+
	'#leftNav .customPriceV2 input#high-price, #leftNav .customPriceV2 input#high-year, #leftNav .customPriceV2 input#low-price, #leftNav .customPriceV2 input#low-year {color: #422 !important;}'
	+
	'#ivTitle {color: #E65A22 !important;}'
	+
	'.noMediaSelection {border-top: 1px solid #772D1E !important;}'
	+
	'#ivThumbs {border-color: #5A2517 #6E291A !important;}'
	+
	'.a-button-top-right {background: #BF3A3A !important;}'
	+
	'.imageInformation {background-color: rgb(44, 30, 30) !important;}'
	+
	'.acs-mn2-divider {background-image: none !important;}'
	+
	'.s-position-relative, #rhf-shoveler, .tiny, .a-radio-label, label.a-checkbox {color: #EDD !important;}'
	+
	'.cdPageSelectorHeader, .cdPageSelectorPagination {background-image: none !important; background-color: #302019 !important; border: 1px solid #633022 !important;}'
	+
	'.cdPageSelectorCurrentPage {background-color: #322424 !important;}'
	+
	'.secEyebrow h2 {background-color: #53261A !important; border-bottom: 1px solid #5C2D1E !important;}'
	+
	'.secondary, .secEyebrow, .primary {border-color: #8A3523 !important;}'
	+
	'.histoFullBar, .histoFullBar {background-color: rgb(71, 31, 23) !important;}'
	+
	'.a-icon-next span, .a-icon-previous span {color: #422 !important;}'
	+
	'.histoRatingBar, .histoRatingBar {background-color: rgb(185, 49, 27) !important;}'
	+
	'.crCdDotsBottom {border-bottom: 1px solid #5A2517 !important; background-image: none !important;}'
	+
	'.sx-sparkle-container {background-color: #321818 !important; border: 1px solid #602929 !important;}'
	+
	'.sx-sparkle-text, #dealTimeRemaining, .miniText {color: #F3CFCF !important;}'
	+
	'.olpOfferList {border-left: 1px solid #2D1313 !important;}'
	+
	'#isbn-search-submit {background: #382321 -moz-linear-gradient(center bottom , #531616 24%, #841D1D 62%) repeat scroll 0% 0% !important; border-color: #5F2525 #511C1C #2F1818 !important; box-shadow: -2px 0px 4px rgba(0, 0, 0, 0.1), 0px -2px 1px rgba(62, 33, 33, 0.8) inset !important; color: #EDD !important;}'
	+
	'#selectedCategory, #upcoming_filter, #missed_filter {color: #EFCECE !important;}'
	+
	'.gbwrule {border-top: 1px solid #6B4141 !important;}'
	+
	'.gbwcont {border-bottom: 1px solid #5C4343 !important;}'
	+
	'.wls-steps-image-row {border: 1px solid #5C3636 !important;}'
	+
	'.wishlist-left-nav {background-color: #2C251F !important; border: 1px solid #8D4D16 !important; color: #EDD !important;}'
	+
	'.pay-desktop .payment-selected, .a-box-inner:only-child, .a-box-inner:only-child {background-color: #332313 !important; border: 1px solid #572315 !important;}'
	+
	'.a-color-alternate-background {background-color: #3E2D23 !important;}'
	+
	'.a-box-inner:only-child h4 {color: #F0BABA !important;}'
	+
	'.a-spinner-medium {border-radius: 1em !important;}'
	+
	'.a-color-offset-background {background-color: #261A1A !important;}'
	+
	'.informationrow {background: #3B1B13 !important;}'
	+
	'tr[bgcolor="#FFFFFF"] {background: #1B1010 !important;}'
	+
	'.loading-spinner-blocker, #first-pipeline-load-page-spinner-blocker {background-color: #2D1616 !important;}'
	+
	'.loading-spinner-inner {background: #291919 none repeat scroll 0% 0% !important; border: 1px solid #572D2D !important; border-radius: 4em !important; opacity: .5 !important;}'
	+
	'#sc_logo_top_image, img.amazon-logo {background: #AE796E !important; border-radius: 4px !important;}'
	+
	'.titlebar-purple {background-color: #963D20 !important; background-image: none !important;}'
	+
	'.data-entry-purple tr {background-color: #44251C !important;}'
	+
	'.data-entry-purple {background-color: #662F1D !important;}'
	+
	'.label-container, tr td strong, #ll h3, .data-entry-purple tbody tr td div, .a-input-text, input[type="number"], input[type="tel"], input[type="password"], input[type="search"], input[type="text"], .black, #ap_fpp_footer, .ap_input_label, .cs-content td, .as-post-text div span, span["color:#696969;"], span[font-size:16px;] strong, .huc-v2-small-line-height {color: #EDD !important;}'
	+
	'.ll-grey {border-right: 1px solid #561D1D !important; border-left: 1px solid #621818 !important; background: transparent -moz-linear-gradient(center top , rgba(230, 230, 230, 0) 0%, #843434 20%, #381515 50%, rgba(230, 230, 230, 0) 100%) repeat scroll 0% 0% !important;}'
	+
	'#ap_captcha_img {border: 1px solid #83412F !important;}'
	+
	'.linkedText {color: #E3631E !important;}'
	+
	'#help_srch_sggst {display: block !important;}'
	+
	'.suggest_link {background: #241712 !important;}'
	+
	'.suggest_link:hover {background: #542718 !important;}'
	+
	'img[src="https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/orders/images/loading-med._CB196681624_.gif"] {border-radius: 1em !important;}'
	+
	'.orderSummaryTable tr {background: #683939 !important; border: 1px solid #3C1C1C !important;}'
	+
	'#global-header-content-wrapper {background-image: none !important;}'
	+
	'#global-header-content .as-search input {padding-left: 12px !important; margin-top: -.5em !important;}'
	+
	'#centerSlots {background: #2F1E1B !important;}'
	+
	'.grey-border, .shadow-border {opacity: .25 !important;}'
	+
	'.top-nav .as-search {border-radius: 4px !important;}'
	+
	'.search-module-input-wrapper .query {padding: 5px 7.8em 4px 4px !important; margin: 0px -8px !important;}'
	+
	'.a-popover.a-arrow-top .a-arrow {border-top-color: #201612 !important;}'
	+
	'.col {border-left: 0px solid #754237 !important; border-bottom: 1px solid #754237 !important; color: #EDD !important;}'
	+
	'.itemq, .huc-v2-scarcity, .huc-v2-small-line-height {color: #EDD !important; background: #B98989 !important;}'
	+
	'#huc-v2-order-row-items, #huc-v2-order-row-messages {background-color: #332313 !important; border-right: 1px solid #471818 !important;}'
	+
	'.quantity-option-10 {border-top: 1px solid #5C2525 !important;}'
	+
	'.aux-text-see-details {background-color: #843434 !important; border-color: #A43B3B !important;}'
	+
	'.aux-text-grey6, .cBoxTitle, .lower-box {color: #EACBC1 !important;}'
	+
	'.a-spacing-small {text-shadow: 0px 0px 4px #422 !important;}'
	+
	'.airy-dialog-elements {background-color: #321B1B !important;}'
	+
	'.cBoxTitle {background-color: #68301B !important; border-bottom: 1px solid #662716 !important;}'
	+
	'.eyebrow, .primary, .secondary {border-color: #923921 #77362B !important;}'
	+
	'.lower-box-bullets li, .cBoxInner div span {color: #EDD !important;}'
	+
	'.GB-SHOVELER .primeBadge ~ .overlapSkew, .GB-SUPPLE .primeBadge ~ .overlapSkew {background: #C45500 none repeat scroll 0% 0% !important; border-left: 1px solid #C45500 !important;}'
	+
	'.GB-SUPPLE .watchTheDealButton, .miniDPSuppleWatchButton .watchTheDealButton {border-color: #983727 #923E27 #A7412C !important;}'
	+
	'input[height="20"] {border-radius: 1em !important;}'
	+
	'.acs-hr-overtext {background-color: #472E1E !important;}'
	+
	'.a-color-secondary, .a-cal-day-label {color: #EFD0C6 !important;}'
	+
	'.a-cal-month-row {background: transparent linear-gradient(to bottom, #7D3030, #481A1A) repeat scroll 0% 0% !important; box-shadow: 0px 1px 0px rgba(77, 22, 22, 0.5) inset !important; border-bottom: 1px solid #501515 !important;}'
	+
	'.a-cal-month-container {border: 1px solid #4E2525 !important;}'
	+
	'.a-cal-na {background-color: #412424 !important;}'
	+
	'.a-cal-labels {background-color: #74362B !important; border-bottom: 1px solid #480E0E !important;}'
	+
	'.a-cal-d:hover {background-color: #562B2B !important;}'
	+
	'#gc-live-preview-container {box-shadow: 0px 4px 10px -3px #892626 !important; border: 1px solid #4B1C1C !important;}'
	+
	'.gc-live-preview-amount, .gc-live-preview-message-inactive, .gc-empty-totals, .acs-feature-item p {color: #F2D5D5 !important;}'
	+
	'.gc-logo-img {border-right: 1px solid #663737 !important;}'
	+
	'.acsUxWidget .bxw-hs, .acsUxWidget .bxw-hs h1, .acsUxWidget .bxw-hs h2, .acsUxWidget .bxw-hs h3, .acsUxWidget .bxw-hs h4, .acsUxWidget .bxw-hs h5, .acsUxWidget .bxw-hs a, .acsUxWidget .bxw-hs a:link, .acsUxWidget .bxw-hs a:hover, .acsUxWidget .bxw-hs a:visited, .acsUxWidget .bxw-hs p, .acsUxWidget .bxw-hs span, .acsUxWidget .bxw-hs div, .acsUxWidget .bxw-hs ol, .acsUxWidget .bxw-hs ol li, .acsUxWidget .bxw-hs ul, .acsUxWidget .bxw-hs ul li, .acsUxWidget .bxw-hs ol ul li, .acsUxWidget .bxw-hs li {color: #EDD !important;}'
	+
	'.bxc-slideButton {border-color: rgb(144, 59, 59) !important; background: transparent -moz-linear-gradient(center top , rgb(72, 42, 37), rgb(45, 11, 11)) repeat scroll 0% 0% !important; box-shadow: 0px 1px 0px rgba(116, 27, 27, 0.6) inset !important;}'
	+
	'.bxc-slideButton:hover, .bxc-slideButton.is-active {background: #6F2F2F !important;}'
	+
	'.s-highlight-secondary {color: #EFD4D4 !important;}'
	+
	'.dealViewContentWrapper {background-color: #482020 !important; border: 1px solid #633116 !important;}'
	+
	'.a-popover-inner, .hud-feed-carousel {background-color: #1a100c !important;}'
	+
	'.hud-feed-carousel .feed-carousel-card {background-color: #451f0d !important;}'
	+
	'.hud-white-dashboard .hud-profilecard-digital-preorders, .hud-white-dashboard .hud-profilecard-yourorders, .hud-white-dashboard .hud-profilecard-category, .hud-white-dashboard .hud-profilecard-name, .hud-white-dashboard .hud-card-subtext-line1, .hud-white-dashboard .hud-card-subtext-line2 {color: #e3d2be !important;}'
	+
	'.hud-white-dashboard .hud-profilecard-digital-preorders, .hud-white-dashboard .hud-profilecard-yourorders, .hud-white-dashboard .hud-profilecard-category, .hud-white-dashboard .hud-profilecard-name {background: #904415;}'
	+
	'.ys-center {background: #201d1c !important;}'
	+
	'li.recs-grid-item {border: 5px solid #7b240d !important; background: #231813 !important;}'
	+
	'.welcome-msg {color: #e4cbbf !important;}'
);