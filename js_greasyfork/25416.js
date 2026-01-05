//
// Written by Glenn Wiking
// Script Version: 1.2.0
// Date of issue: 12/11/16
// Date of resolution: 12/11/16
//
// ==UserScript==
// @name        ShadeRoot RedBubble
// @namespace   SRRB
// @description Eye-friendly magic in your browser for RedBubble
// @include     http://*redbubble.com*
// @include     https://*redbubble.com*
// @version     0.1.0a
// @icon		http://i.imgur.com/4LsJhuu.png

// @downloadURL https://update.greasyfork.org/scripts/25416/ShadeRoot%20RedBubble.user.js
// @updateURL https://update.greasyfork.org/scripts/25416/ShadeRoot%20RedBubble.meta.js
// ==/UserScript==

function ShadeRootRB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootRB (
	  // BAR COLOR 1
	'.account-toolbar, #global-product-nav .top, .hero-banner, .hero-banner-attribution, article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary, div[data-tab-name], .lastrow, .sign-up-page .title, .accordion, .comment, li.product-links, .groups-header-wrap, .preview-info, .add-work-details__language-inputs, .add-work-details__language-tab--primary, add-work-details__language-tab {background: #292929 !important;}'
	+ // BG COLOR 1
	'.nav-main, .product-dropdown, .product-dropdown::before, .artists-carousel, .swiper-slide-visible, #section_wrap, .content-wrapper, html, body, .category-boxes, .graybar, .tt-dataset-articles:hover, .tt-dataset-article:hover {background: #202020 !important;}'
	+
	'header {border-bottom: 1px solid #352626 !important;}'
	+
	'.logo {background-position: center bottom !important; background-color: #1A1313 !important;}'
	+
	'#wrap {background: #1A1313 !important; border: 1px solid #3F160D !important;}'
	+
	'.product-grid, p img {opacity: .9 !important;}'
	+
	'td, th {border-color: #332020 !important;}'
	+
	'.other-sites-sample, #recaptcha_area {opacity: .7 !important;}'
	+
	'blockquote, dd, div, dl, dt, form, h1, h2, h3, h4, h5, h6, li, ol, p, pre, td, th, ul, .text-resize a, .auto-accept a, #wrap a {color: #B4A4A4 !important;}'
	+
	'*::-moz-selection {background: #4B0C0C !important; color: #BCBABA !important;}'
	+
	'#global-product-nav .top {border-bottom: 1px solid #323232 !important;}'
	+
	'.nav-main,.manage-works-actions {border-bottom: 1px solid #2A2A2C !important;}'
	+
	'.site-search-query, #page {background-color: #3A3A3F !important;}'
	+
	'.hero-banner-attribution_text, span a, li[title="Redbubble"] {color: #CEC2C1 !important;}'
	+ // LINK COLOR 1
	'.hero-banner-attribution_text a, span a:hover, .rb-pagination .page-link a:hover, .rb-pagination .page-link span:hover, label, .article a {color: #DD4937 !important;}'
	+ // LINK COLOR 2
	'.hero-banner-attribution_text a:hover, .rb-dropdown > a, .product-link:hover a, .product-link a, h1, h2, h3, h4, h5, h6, span, .app-ui-components-FoundFeed-FoundFeedGridItem-FoundFeedGridItem_title_2cA3u, .home-content #section_wrap, .guarantee, .guarantee-find-out-more, .has-top-border, .atom-feed, .actual-list li, .rb-markup p, .footer-links_link, .article-more section a, .article a {color: #BDAAAB !important;}'
	+
	'.product-dropdown {border: 1px solid #313336 !important;}'
	+
	'.product-dropdown::before {border-color: #313336 !important;}'
	+
	'.product-dropdown .product-link:hover {background-color: #2C2827 !important;}'
	+
	'h2, .atom-feed, .add-work-details__label {text-shadow: 0px 1px #423B3B !important;}'
	+
	'.app-entries-homePage-components-ArtistFeedCarouselItem-ArtistFeedCarouselItem_featuredProduct_3HXpl, .swiper-slide div div a, RB_React_Component_HomePage_0 div div ul li a {background-color: #2C2C2C !important;}'
	+
	'.blog_link {border: 1px solid #5B5F63 !important;}'
	+
	'.blog_link:hover {background: #414141 !important; color: #CCCED7 !important;}'
	+
	'#RB_React_Component_HomePage_0 div div ul li a, .manage-works-actions, .manage-works-nav_button {border-color: #3C3A3A #242424 !important;}'
	+
	'RB_React_Component_HomePage_0 div div div {background: #414141 !important; color: #CCCED7 !important;}'
	+
	'.rb-button, .rb-button-legacy, .button {box-shadow: 0px 1px 0px #292424 !important; opacity: .9 !important;}'
	+
	'.product-grid .grid-item, .works-grid .grid-item {background-color: #262323 !important; border: 1px solid #322D2D !important;}'
	+
	'.product-grid .price, .works-grid .price {background: rgba(44, 38, 38, 0.9) !important;}'
	+
	'.rb-pagination {border-bottom: 2px solid #363535 !important;}'
	+
	'.home-box {border: 2px solid #4D1717 !important;}'
	+
	'.grid-item {background-color: #330F0F !important; border: 1px solid #5F1B1B !important;}'
	+
	'.rb-pagination .page-link.current span {border-bottom: 2px solid #E35942 !important;}'
	+
	'#pages-about h1, .gift-certif-wrap h1, #section_wrap h1, .title h1 {border-bottom: 4px solid #484848 !important; text-shadow: -1px -1px 0px #2F2B2B, -1px 1px 0px #690000, 1px -1px 0px #423B3B, 1px 1px 0px #410A0A, 2px 2px 0px #222326, 2px 3px 0px #902710 !important;}'
	+
	'#pages-about #copy {border-top: 4px solid #484848 !important}'
	+
	'.brand-name, .brand-mark, #section_wrap p a, #pages-about h1, .footer-links_link:hover, h1 a, .dialog-link, .rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li a, .rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li.rb-dropdown-item {color: #9F2028 !important;}'
	+
	'.image-list a img {border-radius: 5em !important;}'
	+
	'.scrollable-menu-item a:active::before {background-color: #19191A !important;}'
	+
	'.scrollable-menu-item.active a::before {background-color: #9F2028 !important;}'
	+
	'section.sign-in {border: 1px solid #6F1F16 !important;}'
	+
	'section.sign-in .facebook-or::before, section.sign-in .facebook-or::after {background-color: #6F1F16 !important;}'
	+
	'input, textarea, .rb-standard-form textarea, .rb-standard-form input[type="text"], .rb-standard-form input[type="password"], .rb-standard-form input[type="datetime"], .rb-standard-form input[type="datetime-local"], .rb-standard-form input[type="date"], .rb-standard-form input[type="month"], .rb-standard-form input[type="time"], .rb-standard-form input[type="week"], .rb-standard-form input[type="number"], .rb-standard-form input[type="email"], .rb-standard-form input[type="url"], .rb-standard-form input[type="search"], .rb-standard-form input[type="tel"], .rb-standard-form input[type="color"], .rb-standard-form .uneditable-input, select, .lang_sel_sel {background: rgb(50, 44, 44) !important; border: 1px solid #6C1009 !important; box-shadow: 0px 1px 1px rgba(102, 15, 15, 0.15) inset !important; color: #DDD1D1 !important;}'
	+
	'.sign-up, .app-entries-artistProfile-components-ReplaceableImage-ReplaceableImage_uploadPrompt_1cNwj {background: #202020 !important;}'
	+
	'.sign-up p, .work-toolbar_artist-name a, h3 a:hover {color: #9C8C8A !important;}'
	+
	'.classy-rule {background: #71160F -moz-linear-gradient(left center , #621010 0%, #451209 10%, #441410 90%, #721010 100%) !important;}'
	+
	'.rb-button, .rb-button-legacy, .button {color: #EADDDA !important; border: 1px solid #811212 !important; background: transparent linear-gradient(#891C0F, #420A0A) !important;}'
	+
	'.flash-messages div, h2.publication-warning {background: transparent linear-gradient(to right, #420909, #8C2519, #420909) !important; color: #F3E9E7;}'
	+
	'.app-ui-components-Button-Button_padded_1fH5b {background: #902222 !important;}'
	+
	'.profile-recent .title {border-bottom: 1px solid #6C2626 !important;}'
	+
	'.profile-view-more {border-top: 1px solid #6C2626 !important;}'
	+
	'.app-entries-artistProfile-components-ProfileAvatar-ProfileAvatar_avatar_145Ph {background: #5D1E17 !important; border: 1px solid #991414 !important;}'
	+
	'.profile-grid .grid-item {border: 1px solid #991414 !important; background-color: #390F0F !important;}'
	+
	'.app-entries-artistProfile-components-ProfileLinks-ProfileLinks_activityLink_2R3rr a, .mybubble p, .content p, .content-right p, p.intro {color: #9C8C8A !important;}'
	+
	'.rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li a:hover, .rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li.rb-dropdown-item:hover {color: #E7DDDB !important; background: #4A130F !important;}'
	+
	'.rb-dropdown-target {border: 1px solid #541912 !important;}'
	+
	'.rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li a, .rb-toplinks ul li.rb-dropdown ul.rb-dropdown-target li.rb-dropdown-item {border-top: 1px solid #782517;}'
	+
	'.app-ui-components-Separator-Separator_line__69ZP {background-color: #4A130C !important;}'
	+
	'.app-entries-cart-components-CartFooter-CartFooter_footer_3ZmtJ, .form footer {border-top: 1px solid #4A130C !important;}'
	+
	'.breadcrumbs span {text-shadow: 0px 1px 0px #301E1E !important;}'
	+
	'.gift-certif-amount {background: #211D1D !important; border: 1px solid #302827 !important;}'
	+
	'.group {background: rgba(68, 53, 53, 0.8) !important;}'
	+
	'.gift-certif-wrap h2 {border-bottom: 4px solid #3C3635 !important;}'
	+
	'.gift-certif-form form {background: #3D3131 !important;}'
	+
	'.gift-certif-wrap p b, .form .nesty-input, .upload-dropzone, .description_group-link:hover, .more-work_title:hover {color: #C22F1E !important;}'
	+
	'.header {border-bottom: 1px solid #5C1C11 !important;}'
	+
	'.category-box {background-color: #141111 !important; border-bottom: 2px solid #631D0B !important;}'
	+
	'.nesty-input {border: 1px solid #691414 !important; background-color: #2C1C1C !important;}'
	+
	'.nesty-panel {background: #383838 !important; border: 1px solid #3B3535 !important;}'
	+
	'.upload-dropzone {border: 1px solid #771313 !important;}'
	+
	'.work-toolbar_tab:hover {background-color: #6B1414 !important;}'
	+
	'.work-toolbar_tab[data-tab-active="true"] {border-left: 1px solid rgb(42, 35, 34) !important; border-right: 1px solid #2A2322 !important;}'
	+
	'.work-toolbar_tab {background: #232323 !important;}'
	+
	'.work-actions {border-top: 1px solid #712219 !important;}'
	+
	'.work-product-config {border: 1px solid #6B1D14 !important;}'
	+
	'.single-size {border-bottom: 1px solid #712219 !important;}'
	+
	'.app-ui-components-InfoBanner-InfoBanner_banner_1X2tS {background-color: #482E2A !important;}'
	+
	'.app-ui-components-Button-Button_secondary_24DXQ, #add-to-cart {background: #751C0E !important;}'
	+
	'.work-toolbar_tab {border: 1px solid #4A241E !important;}'
	+
	'.tag-link {border: 1px solid #8F2F1F !important; background-color: #57190F !important; color: #EADBD8 !important;}'
	+
	'.work-config-price {text-shadow: 0px 1px 0px #471313 !important;}'
	+
	'.detail-product-images a {border: 1px solid #992A12 !important; background-color: #741717 !important; color: #E7D9D7 !important;}'
	+
	'.work-carousel-wrapper ul li a {background-color: #741616 !important;}'
	+
	'.product-recommended-links ul li {border-bottom: 1px solid #7D2B1E !important;}'
	+
	'.product-recommended-links ul li a, .guarantee-find-out-more a {color: #D5C3C0 !important;}'
	+
	'.product-recommended-links ul li:hover {background: #68271C !important;}'
	+
	'.rb-font-icon::before, .manage-works-nav_button {color: #E9DDDA !important;}'
	+
	'.sidebar-nav-section-header, .breadcrumbs li a {color: #C82815 !important;}'
	+
	'.sidebar-nav-article, .contact-page .contact-bottom {background-color: #171515 !important; color: #ECDFDD !important;}'
	+
	'.sidebar-nav-article a, .article-more section a:hover {color: #E7DBD9 !important;}'
	+
	'.sidebar-nav-section {border-left: 1px solid #4E3937 !important;}'
	+
	'.article-body hr {border-color: #4A1911 !important;}'
	+
	'.related-articles, .recent-articles {border-top: 1px solid #501E13 !important;}'
	+
	'.article-page {border-bottom: 1px solid #53140C !important;}'
	+
	'.article-body img {opacity: .8 !important;}'
	+
	'#section_wrap p, .location-address, .home-box p, .box1 p {color: #B99D9A !important;}'
	+
	'.actual-list li a, .description_group-link, .more-work_title {color: #A22A1B !important;}'
	+
	'#main-image {border: 3px solid #A12929 !important;}'
	+
	'.work-actions_link:hover {background: transparent linear-gradient(#AB1515, #752113) !important;}'
	+
	'.work-actions_link {background: transparent linear-gradient(#833939, #3F120B) !important;}'
	+
	'.work-actions_link {border: 1px solid #331212 !important; box-shadow: 0px 1px 0px #292020 !important;}'
	+
	'.manage-works-actions_button {box-shadow: 0px 1px 0px #231313 !important;}'
	+
	'.contact-page h1, header h1 {border-bottom: 4px solid #441813 !important; text-shadow: -1px -1px 0px #362727, -1px 1px 0px #501414, 1px -1px 0px #7D1B1B, 1px 1px 0px #541111, 2px 2px 0px #2F2220, 2px 3px 0px #2A1A18 !important; border-bottom: 4px solid #441813 !important;}'
	+
	'.location-address, .media-enquirie, .contact-bottom {background: #272727 !important; border-bottom: 1px solid #271919 !important;}'
	+
	'hr {border-color: #5C1F16 -moz-use-text-color #451010 !important;}'
	+
	'.media-enquirie, .nav {background: #351818 !important;}'
	+
	'#shareprice td {background: #3A3A3F !important;}'
	+
	'h3 a, .carousel_heading, h2 a {color: #C3B7B6 !important;}'
	+
	'.location-card-tile, .media-enquiries {background: #420C0C !important;}'
	+
	'.more-work, .product-recommendation {border-top: 1px solid #38120A !important;}'
	+
	'#pages-play-nice h1 {color: #9F291B !important;}'
	+
	'#load-news tr {background: #3A3A3F !important;}'
	+
	'#sidenav, .form-actions {background: #262222 !important; border-color: #5A1919 !important;}'
	+
	'.rowline {border-top: 1px solid #630C0C !important;}'
	+
	'#sidenav li a:hover, #sidenav > li.current > a, #sidenav > li.current > ul > li.current > a, .sidenav a {background: #555 !important; color: #E4CFCF !important;}'
	+
	'#sidenav li a:hover, #sidenav > li.current > a, #sidenav > li.current > ul > li.current > a:hover, .text-resize a, .sidenav a {color: #BC3131 !important;}'
	+
	'tbody tr:nth-child(2n), .article a {background-color: #392929 !important;}'
	+
	'.entry-content .article, .newsitems tbody tr td[align="left"] {background: #272727 !important;}'
	+
	'.footer-map a {border-right: 1px solid #571616 !important;}'
	+
	'.line-table tr td {background: #212121 !important; border-bottom: 1px solid #442626 !important;}'
	+
	'.line-table th {background: #302E2E !important; border: 1px solid #601818 !important;}'
	+
	'.Expandable a:hover {background: #302E2E !important;}'
	+
	'.text-resize table tbody {background: rgb(36, 36, 36) !important;}'
	+
	'#ctl00_contentPlaceHolderBody_grdCalendar tr:nth-child(2n+1) td {background: #2D1C1C !important;}'
	+
	'#ctl00_contentPlaceHolderBody_grdCalendar tr:hover td {background: #181414 !important;}'
	+
	'.visitButton {border: 1px solid #6E2C30 !important; background-color: #71282D !important;}'
	+
	'.visitButton:hover {background: #322323 !important; color: #E31320 !important;}'
	+
	'.app-entries-discoveryPage-components-CollectionItem-CollectionItem_overlay_ZfNz9 {background-color: rgba(33, 29, 29, 0.9) !important;}'
	+
	'.app-entries-discoveryPage-components-CarouselItem-CarouselItem_title_3K-9D {color: #B94228 !important;}'
	+
	'#fancybox-overlay {background-color: rgb(15, 12, 11) !important;}'
	+
	'.work-toolbar_tab::after {background-color: #4E2727 !important;}'
	+
	'.rb-menu-set {background: #211D1D !important;}'
	+
	'.rb-menu > ul li a, .rb-menu > .community-search-nav > ul li a {border-bottom: 1px solid #421C14 !important;}'
	+
	'.rb-menu > ul li.active, .rb-menu > .community-search-nav > ul li.active {background-color: #534343 !important;}'
	+
	'.rb-menu h3, .rb-menu h2 {border-bottom: 1px solid #2F0F0C !important;}'
	+
	'.rb-menu > ul li.active a, .rb-menu > .community-search-nav > ul li.active a {color: rgb(224, 214, 212) !important;}'
	+
	'.rb-menu > ul li a:hover, .rb-menu > .community-search-nav > ul li a:hover {background-color: #361710 !important;}'
	+
	'.rb-menu a, .cta-button {color: #DDCECB !important;}'
	+
	'.controls a, .formatting-link, .rb-toplinks a {color: #932828 !important;}'
	+
	'.category-wrapper {background: #382825 !important;}'
	+
	'.category-wrapper .product-list, .payments tbody tr:nth-child(2n+1), #view-portfolio {background: #231E1E !important; border: 1px solid #150906 !important;}'
	+
	'.category-wrapper .product-list li {border-top: 1px solid #47251E !important;}'
	+
	'.category-wrapper .product-markup {background: #5A2219 !important;}'
	+
	'.other-sites-sample img {border: 1px solid #531C13 !important;}'
	+
	'.single-upload {border: 1px dashed #BC3030 !important; background: #2D1E1E !important;}'
	+
	'.checkbox-with-tick_label, .manage-works-actions_action.manage-works-actions_button, .manage-works-actions_action .manage-works-actions_button, .cta-button {background: #411818 !important; border: 1px solid #751B0C !important;}'
	+
	'.dropdown-with-arrow, .dropdown-with-arrow::before {background-color: #382323 !important; border: 1px solid #632014 !important;}'
	+
	'.two-post-wrap {background: #241D1D !important; border: 1px solid #4D1A1A !important;}'
	+
	'.one-post-copy h2, .three-post-copy h2, .grid-container a, .content_row p a, .link-centered a {color: #B01717 !important;}'
	+
	'.cta-button {border: 1px solid #6E1313 !important;}'
	+
	'a.footer-view-parent-site {background: #45171A !important; color: #E1D3D3 !important;}'
	+
	'.footer-wrap {border-top: 1px solid #3F1515 !important;}'
	+
	'.nav ul li {background: #231B1B !important; border-top: 1px solid #511717 !important;}'
	+
	'#menu-main-nav a:link, #menu-main-nav li a {color: #D1CACA !important;}'
	+
	'.search-form {border-color: #481818 !important;}'
	+
	'.header-view-parent-site {background: #4D1A1D !important; color: #DDCDCD !important;}'
	+
	'.nav ul li a:hover, .sign-up-page .actions {background: #483737 !important;}'
	+
	'.pagination a {background: #471E1E !important; color: #DAC4C4 !important;}'
	+
	'.next-prev-wrap {background: #292929 !important; border-top: 1px solid #411212 !important;}'
	+
	'.quote {border-top: 4px solid #5C1A1A !important; border-bottom: 4px solid #5C1A1A !important;}'
	+
	'.what-we-do .section-wrapper {border-bottom: 6px solid #412B28 !important;}'
	+
	'.what-we-do .section-wrapper {border-top: 6px solid #412B28 !important;}'
	+
	'.section-wrapper.highlighted, li.product-links, .rb-chunky-nav {background: #141313 !important; border-top: 1px solid #3E1009 !important; border-bottom: 1px solid #3C160F !important;}'
	+
	'.with-bubble .bubble {background-color: #42191B !important;}'
	+
	'.sign-up-page .big-box {background-color: #3B1414 !important; border: 1px solid #5F1B13 !important;}'
	+
	'.sign-up-page .classy-or::before, .sign-up-page .classy-or::after {background-color: #320E08 !important;}'
	+
	'.sign-up-page .big-box::before, .sign-up-page .big-box::after {border: 1px solid #4B150F !important; background-color: #571C12 !important;}'
	+
	'.icon-down-container {background: transparent linear-gradient(#60100A, #410808) !important;}'
	+
	'.icon-down-dir::before, .float-centerer ul li:first-child a {border-left: 1px solid #51170D !important;}'
	+
	'.filter-type {background: #441613 !important;}'
	+
	'.accordion .link {background: #271818 !important;}'
	+
	'#product-dropdown .link {border-top: 1px solid #480F08 !important;}'
	+
	'.product-type {background: #553633 !important;}'
	+
	'.product-type a, .inv a, .lp a, .forum-play-nice a, #bm_select_all {color: #ECD9D5 !important;}'
	+
	'tr td .flag, .float-centerer ul li a {border-right: 1px solid #541D14 !important;}'
	+
	'.product-type a:hover {background-color: #271C1C !important; color: #ECD9D5 !important;}'
	+
	'.product-type.active a {color: #D43D24 !important; background-color: #451C10 !important;}'
	+
	'.comment {border-bottom: 1px solid #5A1A13 !important;}'
	+
	'.comment_name a, .app-entries-cart-components-Step-Step_icon_EaWl9, .bm_to a {color: #B62413 !important;}'
	+
	'.reviews_review {border-bottom: 1px solid #4A1A12 !important;}'
	+
	'.app-ui-components-Button-Button_hollow_3IKou {color: #A72D19 !important; border: 2px solid #B62A19;}'
	+
	'.app-entries-cart-containers-Item-Item_row_1b1Ja {background-color: #361E1E !important;}'
	+
	'.app-ui-components-Separator-Separator_or_36KS0 {background-color: #39130C !important;}'
	+
	'svg {background-color: #7A281B !important; fill: #F3D3D3 !important;}'
	+
	'.app-entries-homePage-containers-homePage-homePage_artistAttribution_31Vx1 {background-color: #3E1818 !important;}'
	+
	'.business .business-text {border: 1px solid #621F13 !important; background-color: #361310 !important;}'
	+
	'.jobs-page .full, .work-config-color-option, .body_color_white {background-color: #38140F !important;}'
	+
	'.full.odd_two {background-color: #241E1E !important; border-left: 1px solid #38201C !important; border-right: 1px solid #38221F !important;}'
	+
	'.jobs-page a, .jobs-page a:active, .jobs-page a:link, .jobs-page a:visited {color: #B62817 !important; border-bottom: 1px solid #5A2019 !important;}'
	+
	'table.forums tr, table.topics tr, table.posts tr, .search-results-list > *, .group-list li {border-bottom: 1px solid #50221A !important;}'
	+
	'.groups-sunset-banner {background: #561811 !important; border: 1px solid #421310 !important;}'
	+
	'table.forums tr td a.title, table.topics tr td a.title, table.posts tr td a.title, .hentry td a, .product-links a {color: #B42323 !important;}'
	+
	'table.forums tr img.icon.grey, table.topics tr img.icon.grey, table.posts tr img.icon.grey {background-color: #832718 !important;}'
	+
	'table.forums tr td.author.vcard, table.topics tr td.author.vcard, table.posts tr td.author.vcard {border-right: 1px solid #532119 !important;}'
	+
	'.rb-markup h3 {background: #241F1F !important;}'
	+
	'.ui-dialog {background: #1E1A1A !important;}'
	+
	'.local-storage.background, .notification-notice {background-color: #51130F !important; border-color: #712012 !important;}'
	+
	'.nesty-panel ul, .tt-dropdown-menu, .tt-dataset-articles {background: #2F0C0C !important;}'
	+
	'.nesty-panel li {background: #332A2A !important;}'
	+
	'.nesty-panel li:hover, .tt-dataset-articles * {background: #271A1A !important;}'
	+
	'.outer-label-wrap {border: 1px solid #661D11 !important; background: transparent linear-gradient(#78160F, #500D0D) !important;}'
	+
	'.tt-dropdown-menu, .tt-dataset-articles, .tt-dataset-article, .tt-dataset-articles * {border-color: #532119 !important;}'
	+
	'.search-result-votes {background: #651B0B !important;}'
	+
	'.groups-section {border-top: 1px solid #471A13 !important;}'
	+
	'.no-results h3 {border-bottom: 2px solid #36100C !important;}'
	+
	'#community-results div.item, .rb-menu-select > a::before, .rb-menu-sub {border-bottom: 1px solid #3F110A !important;}'
	+
	'#search-forums .item-link {background-color: #241919 !important; border-bottom: 1px solid #1D0C09 !important;}'
	+
	'.item-link:nth-of-type(2n+1) {background: #351919 !important;}'
	+
	'.float-centerer ul li a {text-shadow: 0px 1px 0px #4E1616 !important; color: #DECCC8 !important;}'
	+
	'.float-centerer ul li a:hover {color: #DECCC8 !important; background: #3C2A2A !important;}'
	+
	'.float-centerer ul li.active {background: transparent linear-gradient(#561818, #2D0B07) !important;}'
	+
	'.rb-button.red, .rb-button-legacy.red, .button.red, #nsfw-info-link {color: #DECCC8 !important;}'
	+
	'#bm_friends {background: #231919 !important;}'
	+
	'#bm_backforward {border-bottom: 1px solid #48170F !important;}'
	+
	'tr:nth-child(2n+1) td {background: #211A1A !important;}'
	+
	'.collection-link, .add-work-details__language-inputs {border: 1px solid #3F1812 !important;}'
	+
	'.pc-title-foreground {text-shadow: 0px 1px 0px rgba(53, 17, 17, 0.9) !important; background: rgba(21, 9, 9, 0.7) !important;}'
	+
	'.pc-title-wrapper {border-left: 2px solid rgba(38, 12, 12, 0.6) !important;}'
	+
	'.rb-menu-select {border-bottom: 1px solid #561D13 !important;}'
	+
	'.app-entries-homePage-components-ArtistFeedCarouselItem-ArtistFeedCarouselItem_featuredProduct_3HXpl, .swiper-slide div div a, RB_React_Component_HomePage_0 div div ul li a {background-color: rgba(20, 14, 14, 0) !important;}'
	+
	'.slide-overlay {border: 1px solid #7A1E1E !important;}'
	+
	'.slide-overlay::after {background-color: rgba(41, 21, 21, 0.25) !important;}'
	+
	'.prerelease-banner span {background-color: #5F180F !important;}'
	+
	'.add-work-details__language-tab {border: 1px solid #832115 !important; background-color: #381A16 !important;}'
	+
	'.work-default, .work-privacy {border-right: 1px solid #4B170F !important; box-shadow: 1px 0px 0px #4B170F !important;}'
);