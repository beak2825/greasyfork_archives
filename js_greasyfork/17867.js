//
// Written by Glenn Wiking
// Script Version: 1.2.0
// Date of issue: 24/02/16
// Date of resolution: 25/02/16
//
// ==UserScript==
// @name        ShadeRoot Bol.com
// @namespace   SRBC
// @description Eye-friendly magic in your browser for bol.com
// @include     *bol.com/*
// @version     1.2.0
// @icon		http://i.imgur.com/kGiVuUg.png

// @downloadURL https://update.greasyfork.org/scripts/17867/ShadeRoot%20Bolcom.user.js
// @updateURL https://update.greasyfork.org/scripts/17867/ShadeRoot%20Bolcom.meta.js
// ==/UserScript==

function ShadeRootBC(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootBC (
	'html, body {background: #1D1919 !important; color: #B7CFE7 !important;}'
	+
	'.constrain--light, .header-section--search {background-color: #111723 !important;}'
	+
	'.cookie-bar {border-bottom: 1px solid #0e1929 !important; background-color: #11222d !important; color: #bcd0d7 !important;}'
	+
	'.no-js .main-nav__item:active > .main-nav__link, .no-js .main-nav__item:hover > .main-nav__link {border-color: #0f242f !important;}'
	+
	'.navigation_slot a {color: #8CBCEC !important;}'
	+
	'p {color: #bcd0d7 !important;}'
	+
	'.header-fixed .main-nav__link {border-color: #102539 !important;}'
	+
	'.header-fixed .main-nav__item--special .main-nav__link {background: #1E2B42;}'
	+
	'.header-fixed .main-nav__item {border-color: #0f2130 !important; background-color: #0f1520 !important;}'
	+// //
	'.main-nav__link, .main-nav__link span, .menu-list a, .product_name {color: #B7CFE7 !important;}'
	+
	'.product_creator {color: #2E6CB3 !important;}'
	+
	'.list_price {color: #768189 !important;}'
	+
	'#doormat a {color: #3366AC !important;}'
	+
	'.header-fixed .main-nav {border-bottom: 1px solid #1f2f44 !important;}'
	+
	'.main-logo__svg {background-color: #3366CA !important; border-radius: 5px !important; padding: 2px !important;}'
	+
	'.marketing-banner {border-bottom: 1px solid #172839 !important;}'
	+
	'.header-fixed .large--is-visible {color: #447DF0 !important; background: #000 !important;}'
	+
	'.header-fixed .is-locked .category-nav-btn, .header-fixed .is-open .category-nav-btn {color: #31312f !important; border-color: #0d151e !important; background: #193554 !important;}'
	+
	'#top_bar .top-bar__bdr {border-bottom: 1px solid #17283c !important;}'
	+
	'.search-input, .search-select {border-color: #243744 !important; color: #DDE !important;}'
	+
	'.search_suggestions_completer {border: 1px solid #17232f !important; background: #142d47 !important;}'
	+
	'.search-input, .search-select, .form_newsletter fieldset input#email_adress {border-color: #243744 !important; background: #14417B !important; color: #DDE !important;}'
	+
	'.search-select, #cb_net_message_wrapper textarea, .text-input {background-color: #0f1520 !important; color: #3366CA !important;}'
	+
	'select, .content_box, .message, .overigeaanbiedingen ul li a {color: #B7CFE7 !important;}'
	+
	'.search-btn {border: 1px solid #112439 !important;}'
	+
	'#top_bar ul li a {color: #9bb2e1 !important;}'
	+
	'#top_bar ul li a:hover {color: #519FF6 !important;}'
	+
	'.basket__btn-bg {border: 2px solid #0f53b9 !important; background: #3366ca !important;}'
	+
	'.sub-nav {background: #11233F !important;}'
	+
	'.header-fixed .sub-nav {border: 1px solid #102539 !important;}'
	+
	'.sub-nav__title {border-bottom: 1px solid #102539 !important;}'
	+
	'.no-js .main-nav__item:active > .main-nav__link::before, .no-js .main-nav__item:hover > .main-nav__link::before, .main-nav::before, .is-open::before {background-color: #11233F !important;}'
	+
	'.sub-nav__title {border-bottom: 1px solid #1B4066 !important;}'
	+
	'h1, h2, h3, h4, h5, h6 {color: #3366CA !important;}'
	+
	'.box, .box-bottom, .box-no-tl, .box-top {border: 1px solid #3366CA !important;}'
	+
	'.footer__columns {border-color: #1B4066 !important;}'
	+
	'.h-fluid-img {opacity: .75 !important; border-radius: 4px !important;}'
	+
	'strong {color: rgb(51, 102, 202) !important;}'
	+
	'img {opacity: .85 !important;}'
	+
	'.category-nav-btn {border: 1px solid #36C !important;}'
	+
	'.basket__amount {color: #CDE0F2 !important;}'
	+
	'.footer_information_links li {border-right: 1px solid #3366CA !important;}'
	+
	'.header-section--search.fixed {border-bottom: 1px solid #0C2345 !important; box-shadow: 0px 0px 8px rgba(4, 15, 32, 0.8) !important;}'
	+
	'.fl-basket {border: 2px solid #0F53B9 !important; background-color: #3366CA !important;}'
	+
	'.form_newsletter fieldset input#email_adress, #cb_net_message_wrapper textarea, .text-input {border: 1px solid black !important;}'
	+
	'.footer--bottom__copyright a {border-bottom: 1px solid #10579E;}'
	+
	'.footer a {color: #4486DD;}'
	+
	'#cont_mhp a.large-banner, #cont_mhp a.small-banner {background: #162842 !important;}'
	+
	'.homepage-only-slot img.dc_banner {opacity: .85 !important;}'
	+
	'.overigeaanbiedingen ul li a:hover {color: #36C !important;}'
	+
	'.search-btn {background: #103265 !important;}'
	// WEBLOG //
	+
	'header .logo.fixed-pos, div.search {background: #3366CA !important; border: 1px solid #1B477A;}'
	+
	'.top-block .breadcrumbs, .main.article .left-col nav {background: #122D51 !important;}'
	+
	'.main .left-col > nav .soc {border-top: 1px solid #1D4E8D !important; background: #133963 !important;}'
	+
	'.top-block .close-links {background: #102348 !important;}'
	+
	'.top-block .close-links [class*=" icon-"], .top-block .close-links [class^="icon-"] {opacity: .7;}'
	+
	'.content-block .page {background: #0E1E35 !important; border-color: #0F2D54 !important;}'
	+
	'.content-block a:link {color: #3366CA !important;}'
	+
	'.main.article .left-col nav {background: #091F39 !important;}'
	+
	'nav .main-menu li a {color: #9EBDE4 !important;}'
	+
	'.main .left-col > nav a:hover {color: #3580F0 !important;}'
	+
	'.search.active {background: #26488D !important; color: #8DC6F0 !important;}'
	+
	'.top-block .progress {background: #0F2A59 !important;}'
	+
	'.top-block .progress .bar {background: #163563 !important;}'
	+
	'.top-block .close-links a {color: #3D72DA !important;}'
	+
	'.content-block .page hr {border-color: #1C488A !important;}'
	+
	'.more-articles-cont .car-arrow-inner {background: rgba(0, 0, 0, 0) !important;}'
	+
	'.more-articles-cont::before {border: 1px solid #165387 !important;}'
	+
	'.more-articles {background-color: #0E1E35 !important; border-radius: 4px !important;}'
	+
	'.main > .right-col .content .filter {background: #091F38 !important;}'
	+
	'.main > .right-col .content .filter #catName, .main > .right-col .content .filter .cat-current, .main > .right-col .content .filter {color: #AFC7E6 !important;}'
	+
	'.articles .article {background: #133963 !important; border: 1px solid #2B64A4 !important;}'
	+
	'.articles.tile-layout .article a {color: #CDE5F9 !important;}'
	+
	'.prod-slider .inner .title {border-bottom: 1px solid #1B61A5;}'
	+
	'.prod-slider .inner .slider .advertising-cont .ad-title-block .ad-title-holder a.ad-title {color: #4B9BD7 !important;}'
	+
	'#loadingScreen {background: #091426 !important;}'
	+
	'.left-col .footer {background: #091F39 !important;}'
	+
	'.main .left-col > nav .add-menu {border-top: 1px solid #103B74 !important;}'
	+
	'.content-block .page ol li, .content-block .page ul li {color: #8BB6ED !important;}'
	+
	'.win-block, .prod-slider {border: 1px solid #23518D !important;}'
	+
	'.prod-slider .inner .slider .advertising-cont .grey-block, .prod-slider .inner .slider .advertising-cont .ad-info-block {background: #113F7B !important; border-color: #1C4999 !important;}'
	+
	'.advertising-cont, .title {color: #AECCE3 !important;}'
	+
	'.articles.tile-layout .article .info .category {color: #4296F5 !important;}'
	+
	'.pic img {opacity: .8 !important;}'
	+
	'.article-cover img {opacity: .65 !important;}'
	+
	'.textAbove-inner strong {color: #A2B5E3 !important;}'
	+
	'input.search-field {color: #B9DCF9 !important;}'
	+
	'.search.active {border: 1px solid rgb(20, 95, 179) !important;}'
	+
	'.seo_block {color: #648FC6 !important;}'
	+
	'.wrapper_usps .usp {background: #0D2241 !important;}'
	+
	'.header-fixed .main-nav__item.is-open > .main-nav__link {border-color: #133E75 !important;}'
	+
	'.main-nav__item.is-open > .main-nav__link {border-color: #133E75 !important;}'
	// WEBLOG CATEGORY //
	+
	'.main .left-col, .main .left-col > nav {background: #0B1F3C !important;}'
	+
	'header .header-category {background-color: #000 !important;}'
	+
	'.expert-module-ext .expert-title-block {background: #112C4A !important; border-radius: 4px !important;}'
	+
	'.expert-module-ext .expert-carousel .expert-slide .slide-image {background: #132C48 !important;}'
	+
	'.expert-module-ext .expert-carousel .slick-arrow.next-arrow {background: #162235 !important;}'
	+
	'.interactive-image-block .tip-btn {background: #162235 !important;}'
	+
	'.expert-module-ext .expert-carousel .expert-slide .slide-product-container .expert-product-holder .expert-product-image {border-bottom: 1px solid #0F4C87 !important;}'
	+
	'.expert-module-ext .expert-carousel .expert-slide .slide-product-container .expert-product-holder .expert-product {border: 1px solid #276BB7 !important;}'
	+
	'.expert-module-ext .expert-carousel .expert-slide .slide-product-container .expert-product-holder.empty {background: #12417E !important;}'
	+
	'.expert-module-ext .expert-carousel .expert-slide .slide-description-block {background: #122436 !important;}'
	+
	'.button-wrap a, .btn-blue {color: rgb(189, 209, 240) !important;}'
	+
	'.top-block .breadcrumbs a {color: #5494F5 !important;}'
	+
	'.article-cover mob-hidden {background: rgb(21, 39, 57) !important;}'
	+
	'.content-block a:link {color: #BFD3FB !important;}'
	+
	'.expert-module-ext .expert-carousel .slick-list::before {background: rgba(12, 27, 50, 0.7) !important;}'
	+
	'.expert-module-ext .expert-carousel::after, .expert-module-ext .expert-carousel::before {background: #080F17 !important;}'
	+
	'.content-block .page .flax-block {background: #082E54 !important;}'
	+
	'.top-block .breadcrumbs .article-social .facebook .social-right {background: #1B3A78 !important;}'
	+
	'.top-block .breadcrumbs .article-social .twitter .social-right {background: #9CDDF8 !important;}'
	+
	'.dropdown .dropdown-menu {background: #091F38 !important;}'
	+
	'.dropdown .carousel-cont .bx-controls-direction .car-arrow {box-shadow: 0px 0px 0px 3px #102A51 !important;}'
	+
	'.dropdown .carousel-cont .bx-controls-direction .car-arrow::after {background: #5C98CB !important;}'
	+
	'.dropdown .carousel-cont .info {background: #1F4978 !important;}'
	+
	'.all-articles-cont a.all-articles {border: 1px solid #215999 !important;}'
	+
	'.carousel-cont .carousel-item .item-inner {background: #1F4978 !important;}'
	+
	'.carousel-cont .carousel-item .pic {background-color: #0A284B !important;}'
	+
	'.articles .article .viewed-label {border: 1px solid #3664C2 !important;}'
	+
	'.main-slider {opacity: .75 !important;}'
	+
	'.rwd-error-screen .info-box {border: 1px solid #1A4884 !important;}'
	+
	'.carousel {background: #14417B !important;}'
	// PRODUCT //
	+
	'.product_heading {border-bottom: 1px solid #10366F !important;}'
	+
	'.js_bol_favorite_button .counter_wrapper .counter {background: #194F8D !important; border: 1px solid #1A68AB !important;}'
	+
	'.product-image__thumb-list ul li {background: #0B2E50 !important; border: 1px solid #0D1E32 !important;}'
	+
	'.is-active {border: 1px solid #36C !important;}'
	+
	'.color_variants_item_small a {background: #0B2E50 !important; border: 1px solid #113160 !important;}'
	+
	'.select_dropdown .selpop_box_trigger {background-color: #112F56 !important; border: 1px solid #7F9DB9 !important; color: #B4D1EA !important;}'
	+
	'.select_dropdown ul li a {background: #185080 !important; color: #9DBAED !important;}'
	+
	'.select_dropdown ul li a:hover, .select_dropdown ul li a.marked {background: #1E4F98 !important; color: #83B1E4 !important;}'
	+
	'.select_dropdown .selpop_box {background: #689DD2 !important; border: 1px solid #1C4999 !important;}'
	+
	'.c-readmore_trigger {box-shadow: 0px -0.5em 0.25em -0.5em #234E9B inset !important; border-bottom: 1px solid #1B4B8A !important;}'
	+
	'.c-readmore_trigger a {background-color: #204C98 !important; border: 1px solid #265A95 !important; color: #B3D8F3 !important;}'
	+
	'.rule, .divide_top, .c-sort-bar, .table {border-color: #103981 !important;}'
	+
	'.bgbox_white, .table th {background: #14417B !important;}'
	+
	'a.seller_name {color: #A4CFF3 !important;}'
	+
	'.scroll_top {border: 1px solid #0D4FD5 !important; background-color: #14417B !important; color: #ACD7F6 !important; box-shadow: 3px 3px 4px #051021 !important;}'
	+
	'.page_crumbs li a {color: #87BAED !important;}'
	+
	'.page_crumbs li a:hover {color: #36C !important;}'
	+
	'.product-image__thumb-list ul li.is-active {border: 1px solid #36C !important;}'
	+
	'.form-select select {background-color: #14417B !important;}'
	+
	'.form-select::after {background: transparent linear-gradient(to right, rgba(255, 255, 255, 0) 0px, #1C65C5 55%) repeat scroll 0% 0% !important;}'
	+
	'.form-select {border: 1px solid #185A9B !important; background: #17477E !important;}'
	+
	'.list_page_sort_bar {border-bottom: 1px solid #144275 !important;}'
	+
	'.productlist_block, .prodtiles_4, .search_suggestion {border-bottom: 1px solid #144275 !important;}'
	+
	'#sidebar .single-select-item {color: #96C0F8 !important;}'
	+
	'.product-tile__box {border: 1px solid #17304D !important; background: #152A53 !important; box-shadow: 0px 0px 5px 3px #1C4599;}'
	+
	'.search_suggestion {opacity: .8 !important;}'
	+
	'.h-txt-left, .h-left--m, .h-right--m {color: #143C6F !important;}'
	+
	'.najaarsparfum .trend_buttons a {border: 1px solid #13427E !important;}'
	+
	'.najaarsparfum .trend_buttons a:hover {border: 1px solid #1A6FB7; color: #2B80D2 !important;}'
	+
	'.h-txt-left p {color: rgb(107, 161, 231) !important;}'
	+
	'.default_color, .black {color: #9BCAF8 !important;}'
	+
	'.inform_box-notice {background: #3366CA !important; border-color: #0F55BF !important;}'
	+
	'.small_details .h2, .small_details h2, .small_details .h4, .small_details h4 {color: #CFD8E6 !important;}'
	+
	'.buy_block .cart_quantity_box .selpop_box_trigger {background-color: #144B89 !important; border: 1px solid #185599 !important; color: #ABC6EF !important;}'
	+
	'.info-popup, .info-popup-visible {background: #14417B !important; color: #9BCAF8 !important; border: 1px solid #185599 !important;}'
	+
	'.explain, .h-bol-subtext-color {color: #3366CA !important !important;}'
	+
	'.accordion {border-top: 1px solid #1156B1 !important;}'
	+
	'.accordion__item {border-bottom: 1px solid #1156B1 !important;}'
	+
	'.nav-list {border: 1px solid #1156B1 !important;}'
	+
	'.nav-list__link {color: #98C9F3;}'
	+
	'.nav-list__link:hover {color: #36C;}'
	+
	'.category-nav-btn {background: transparent linear-gradient(to bottom, #0E5EAD 0px, #004695 100%) !important; box-shadow: 0px 1px 0px #0E4478 !important; color: #CAD7F2 !important;}'
	+
	'.main-nav__item {border-color: rgb(70, 145, 243) !important; background-color: #3371CE !important;}'
	+
	'.main-nav__link {border-color: #0C416E !important;}'
	+
	'.zoeken {border-top: 1px solid #16406F !important;}'
	+
	'.form-login--existing-user {border-right: 1px solid #144CAE !important;}'
	+
	'[class*="c-btn-quaternary"] a, [class*="c-btn-quaternary"] button, [class*="c-btn-quaternary"] input[type="button"], [class*="c-btn-quaternary"] input[type="submit"], [class*="c-btn-tertiary"] a, [class*="c-btn-tertiary"] button, [class*="c-btn-tertiary"] input[type="button"], [class*="c-btn-tertiary"] input[type="submit"], textarea, .payment-input input, .payment-input select, .payment-input textarea {border: 1px solid #1A4795 !important; background: #082954 !important;}'
	+
	'.search_suggestions_completer li.divider_top {border-top: 1px solid #19438C !important;}'
	+
	'.search_suggestions_completer li.selected {background: #164996 !important;}'
	+
	'.search_suggestions_completer li {color: rgb(159, 211, 243) !important;}'
	+
	'.search_suggestions_completer .completer_description {color: #287EED !important;}'
	+
	'#top_bar .country_select .country_menu, #top_bar .user_menu {background-color: rgb(22, 87, 171) !important; border: 1px solid #196BC9 !important;}'
	+
	'#top_bar .country_select .country_menu ul li.hover {background: #114283 !important;}'
	+
	'#top_bar .user_menu ul li:hover {background: #164489 !important;}'
	+
	'#top_bar .user_menu a:hover {background-color: #0E418D !important;}'
	+
	'.text-input--password .toggle-password input[type="checkbox"] ~ label {background-color: #1A578A !important; color: #94B8EF !important;}'
	+
	'.nav-list__header {border-bottom: 1px solid #174FA2 !important;}'
	+
	'#iChatLines .cAgentLine, #iChatLines .cBotLine {background-color: #0E3878 !important;}'
	+
	'#iChatLines .cAgentLine, #iChatLines .cBotLine, #iChatLines .cUserLine {border: 1px solid #165398 !important;}'
	+
	'#iChatLines .cAgentLine::before, #iChatLines .cBotLine::before {border-right-color: #1654A4 !important;}'
	+
	'.rsp-table td, .rsp-table th {border-bottom: 1px solid #1C498D !important;}'
	+
	'.content_header, .content_subelement {border-left: 1px solid #1F548F !important; border-right: 1px solid #194AAE !important;}'
	+
	'.signup-container .content_subelement h3 {background: #0B2853 !important;}'
	+
	'.first_of_two_columns {border-color: #1E4487 !important;}'
	+
	'.form_fields input[type="text"], .form_fields input[type="password"] {border: 1px solid #13378D !important; background: #0E2A47 !important;}'
	+
	'.menu .menu__top.no-login {border-bottom: 2px solid #203F77 !important;}'
	+
	'#content_wrapper .menu .menu__top .menu__top-logo .ng-returns div.instruction-list li.wrap li.add, #content_wrapper .menu .menu__top .menu__top-logo a, .ng-returns div.instruction-list li.wrap #content_wrapper .menu .menu__top .menu__top-logo li.add {background-color: #36C !important; border-radius: 9px !important;}'
	+
	'.box-large--is-visible {border: 1px solid #1549A2 !important;}'
	+
	'.selfservice-list__link {border-color: #124B8C !important; color: #99C9F9 !important;}'
	+
	'.selfservice-list__img {border-color: #18529C !important;}'
	+
	'.cp .h3 {color: #3366CA !important;}'
	+
	'.cp .options.sticky {background: #153E7B !important; border-bottom: 1px solid #142D53 !important;}'
	+
	'.stamptext {border: 1px solid #0F4489 !important;}'
	+
	'.replenishment .cart_quantity_box, .listpage_resultlist .cart_quantity_box, .wishlistItemsView .cart_quantity_box, .anonymous_wishlist .cart_quantity_box {border: 1px solid #2358C3 !important; background-color: #14417B !important;}'
	+
	'.footer a {color: #A4CAF0 !important;}'
	+
	'.crosscat_main hr {border-color: #3366CA !important;}'
	+
	'.crosscat_top {opacity: .8 !important;}'
	+
	'.landwissel-wrapper {background: none !important;}'
	+
	'.add-on-page-header {background-color: #0A2554 !important;}'
	+
	'.product-item__name {color: #99C9EC !important;}'
	+
	'.rating-stars__rating-count {color: #207DF5 !important;}'
	+
	'.modal__footer {border-top: 1px solid #1D57A2 !important;}'
	+
	'[class*="c-btn-added"] a, [class*="c-btn-added"] button, [class*="c-btn-added"] input[type="button"], [class*="c-btn-added"] input[type="submit"] {background: #0A4A2A !important;}'
	+
	'.shopping-cart__row {border-color: #154071 !important;}'
	+
	'.product-details__title {color: #3366CA !important;}'
	+
	'.shopping-cart--overview {background-color: #062753 !important;}'
	+
	'.shopping-cart--overview .totals__table .border-top, .shopping-cart--overview .totals__table .total {border-top: 1px solid #18548F !important;}'
	+
	'.box--checkout {background-color: #2053AD !important;}'
	+
	'.checkout_form .option {border: 1px solid #0E52C9 !important; background-color: #0B1F33 !important;}'
	+
	'.shoppinglist {border: 1px solid #25519E !important;}'
	+
	'.cost-overview__table .total, .cost-overview__table .total.payment {border-top: 3px double #164F90 !important;}'
	+
	'.shoppinglist__item {border-color: #0C519F !important;}'
	+
	'.box-medium--is-visible {border: 1px solid #0B4E99 !important;}'
	+
	'.checkout_form fieldset.sendform {background: #0B2D75 !important;}'
	+
	'.explain, .h-bol-subtext-color, .customer-menu__link, .explain a {color: #ACD1ED !important;}'
	+
	'.floating_basket .fulfilled {background-color: #2A5DB6 !important;}'
	+
	'.floating_basket .announcements {background: #10477D !important; border-top: 1px solid #164787 !important; border-bottom: 1px solid #134A89 !important;}'
	+
	'#js_floating_basket_products {background-color: rgb(14, 39, 78) !important;}'
	+
	'#floating_basket .totals {border-top: 1px solid #102541 !important; background-color: #093672 !important;}'
	+
	'#floating_basket table {background: #0E3560 !important;}'
	+
	'.floating_basket .pricelist {border-bottom: 1px solid #123665 !important;}'
	+
	'#floating_basket .subtotal {border-top: 1px solid #1D4278 !important;}'
	+
	'#floating_basket .control_buttons {border-top: 1px solid #1B4C7B !important;}'
	+
	'p strong {color: #B0C5F0 !important;}'
	+
	'.sub-nav {border: 1px solid #1B4D98 !important;}'
	+
	'.page h2 a, .post h2 a {color: #3366CA !important;}'
	+
	'.header {background: #173357 !important; border-bottom: 1px solid #173065 !important;}'
	+
	'.menu ul li.current-menu-item a {color: #4E89FF !important;}'
	+
	'.menu ul li a {color: #75B0E3 !important;}'
	+
	'.menu .sub-menu li:hover {background: #2056B6 !important;}'
	+
	'.menu li ul {background: #3370DB !important; border: 1px solid #1F62C6 !important;}'
	+
	'#sidebar {background: #112C56 !important}'
	+
	'#sidebar ul li a {color: #5D9CED !important;}'
	+
	'#sidebar select {background: #0C2A59 !important; border: 1px solid #164493 !important;}'
	+
	'input[type="text"] {border: 1px solid #1E65B4 !important; background: #0B2A4D !important; color: #C6DCF2 !important;}'
	+
	'.calendar {background: #1D3C6B !important;}'
	+
	'.month {border-bottom: 1px solid #0E2236 !important;}'
	+
	'hr, .hr {border-color: #163B72 !important;}'
	+
	'.cp .options {border-top: 1px solid #2A579B !important; border-bottom: 1px solid #193F81 !important;}'
	+
	'.product-title {color: #AED3EC !important;}'
	+
	'.group_amount {color: #CBD8E1 !important;}'
	+
	'.multiselect_filter_choices {border-bottom: 1px solid #234557 !important;}'
	+
	'.erase_filters a {color: #B2CADB;}'
	+
	'.basket__btn-bg::after {background: #142329 !important;}'
	+
	'.breadcrumbs__link {color: #3881D4 !important;}'
	+
	'.main-nav__link::before {background-color: #3371CE !important;}'
	+
	'#zakkoop #nav .main-nav2 a.selected, #zakkoop #nav .main-nav2 a:hover {color: #D0E7F3 !important;}'
	+
	'#zakkoop #nav .main-nav2 ul li a {color: #729CE4 !important;}'
	+
	'#zakkoop #nav {border-bottom: 1px solid #253A60 !important;}'
	+
	'#zakkoop .bgheader {opacity: .65 !important;}'
	+
	'.h-bottom--xl {color: #132D50 !important;}'
	+
	'.one-half p {color: #A2B9D8 !important;}'
	+
	'.h-bottom--s {background: #18232F !important;}'
	+
	'.large--three-quarters .h-bottom--xl, #livechat_slot .h-bottom--xl {color: rgb(189, 206, 230) !important;}'
	+
	'.bg_1, .bg_2, .bg_3, .bg_4, .bg_5, .bg_6, .bg_7, .cat, .min, .content_bg {background: rgb(29, 25, 25) !important;}'
	+
	'.table-zakelijk {border: 1px solid #2A5687 !important;}'
	+
	'.table-zakelijk tr:first-child:hover th {background: #274966 important;}'
	+
	'.table-zakelijk tr:first-child th {background: #366EA5 !important; border-color: #28556E !important;}'
	+
	'.table-zakelijk th, .table-zakelijk td {border-color: #16596B !important; color: #DDD !important;}'
	+
	'.table-zakelijk td {background: #1C313C !important;}'
	+
	'.subtitle ul li a {color: rgb(106, 164, 201) !important;}'
	+
	'.line {border-bottom: 1px solid #313D50 !important;}'
	+
	'.dc-intro {background-color: #212D3B !important;}'
	+
	'.usp h2 {border-bottom: 1px solid #22456C !important;}'
	+
	'.service {border-bottom: 2px solid #091721 !important;}'
	+
	'textarea {color: #C6DCF2 !important;}'
	+
	'.more-link, .more-link a {color: #36C !important;}'
	+
	'.entrances li > div {border: 1px solid #2E4681 !important;}'
	+
	'.footer {background-color: #21282F !important;}'
	+
	'article#home .module img {border-radius: 10em !important;}'
	+
	'.button-white-big {opacity: .85 !important;}'
	+
	'#content_bgs .cat, #content_bgs .min {display: none !important; visibility: hidden !important;}'
	+
	'#block-intro {border-bottom: 1px solid #264074 !important;}'
	+
	'#block-two article:hover, .block-vacancies-related article:hover, .article-content article:hover {background-color: #223041 !important;}'
	+
	'#block-two article, .block-vacancies-related article, .article-content article {border-top: 1px solid #264165 !important;}'
	+
	'#block-two .recruiter, .block-vacancies-related .recruiter, .article-content .recruiter {border-left: 1px solid #2D455D !important;}'
	+
	'#block-two .allvacancies, .block-vacancies-related .allvacancies, .article-content .allvacancies, .home #inner-content, #block-five header {border-bottom: 1px solid #233C4E !important;}'
	+
	'#block-six {border-top: 1px solid #343E4E !important;}'
	+
	'#block-six ul li {background-color: #1E3A5A !important; border-color: #27415A !important;}'
	+
	'#block-six .date, #block-six .location, .bottom-nav {color: #A5C8F5 !important;}'
	+
	'#block-six ul li p, #block-seven header, #footer {border-top: 1px solid #35628F !important; border-bottom: 1px solid #35628F !important;}'
	+
	'#block-one {background-color: #2A4257 !important;}'
	+
	'.menu-item-type-custom a, .menu-item-type-post_type a {color: #DDD !important;}'
	+
	'#logo, .info-text {background: #20588F !important;}'
	+
	'.bundle_slot .bundle_item {border-top: 1px solid #143F7E !important;}'
	+
	'.product-seller__name {border-bottom: 1px dashed #3079AE !important; color: #3079AE !important;}'
	+
	'.rounded_frame, .flextip .content, .bdr--gray {background-color: #2C3C5D !important; border: 1px solid #3079AE !important;}'
	+
	'.seller_popup_content .review_summary {background: #25364A !important;}'
	+
	'.seller-menu a {background-color: #234A8D !important; color: #DDD !important;}'
	+
	'.seller-menu a:hover {background-color: #0C5B9E !important; color: #DDD !important;}'
	+
	'.table-bordered--row td {border-top: 1px solid #12438C !important;}'
	+
	'.seller-menu li {border-top: 1px solid #0F325A !important;}'
	+
	'.c-sort-bar a span, .c-sort-bar a.active {color: #92BFDB !important;}'
	+
	'.comment--positive::before, .comment--negative::before {border-radius: 1em !important;}'
	+
    '.product-item--column::after {border-bottom: 1px solid #2A3F5C !important;}'
    +
    '.dl--responsive, .dl--responsive dd, .dl--responsive dt {border: 0px solid #304A63;}'
    +
    '.slot--seperated {border-bottom: 1px solid #2F4559 !important;}'
    +
    '.show-more__fade {border-bottom: 1px solid #0D2032 !important; background: transparent linear-gradient(rgba(255, 255, 255, 0), #0E2F62) repeat scroll 0% 0% !important;}'
    +
    '.show-more__button {background-color: #182E3B !important; border: 1px solid #1B5198 !important;}'
    +
    '.step-indicator {background-color: #3366CA !important; color: #DDD !important;}'
    +
    '.one-whole h3, .one-whole h4, #header-text, .payment-label, label, iframe #payment-container {color: #DDD !important;}'
    +
    '.bgbox-lightblue {background-color: #1E3565 !important;}'
    +
    '.cards-list__details {border-bottom: 1px solid #234881 !important;}'
    +
    '#payment-container {background: #0D0D0D !important;}'
    +
    '.wss_answer {background-color: #153253 !important;;}'
    +
    '.helping-billy {border: 1px solid #206AAA !important; background-color: #121D2D !important;}'
    +
    '#iChatLines .cUserLine {background-color: #1F71DB !important;}'
    +
    '.cAgentLine:after, .cAgentLine:before, .cUserLine:after, .cUserLine:before {visibility: hidden !important;}'
    +
    '.category-block {border: 1px solid #21548D !important;}'
    +
    '.category-block__image, .visual-banner__image {opacity: .85 !important;}'
    +
    '.article .pic {border-right: 1px solid #174572 !important;}'
    +
    '.article-inner {color: #B9D5EC !important;}'
    +
    '.is-active .nav-tab__link, .is-active .nav-tab__link:focus, .is-active .nav-tab__link:hover {background-color: #36C !important; border-color: #1B4483 !important; color: #B9D5EC !important;}'
    +
    '.nav-tab .is-active {border: 0px solid rgba(0,0,0,0) !important;}'
    +
    '.nav-tab, .tab-content .tab-filters {border-bottom: 1px solid #2E5377 !important;}'
    +
    '.focuscat ul li a {background: #2C6EC3 !important;}'
    +
    '.product-tile__box {box-shadow: 0px 0px 5px 3px #112D66 !important;}'
    +
    '.mini_details a, .categories a {color: #DDD !important;}'
	// OVERLAYS //
	+
	'.modal__window {background-color: #0B2F5F !important;}'
	+
	'.content_box strong {color: #BAD0FC !important;}'
	+
	'.quantity-popup {border: 1px solid #0E4780; background: #082954 !important;}'
	+
	'.remove_suggestion {background-color: rgb(18, 28, 46) !important;}'
);