// Written by Glenn Wiking
// Script Version: 1.1.0b
// Date of issue: 24/05/16
// Date of resolution: 24/05/16
//
// ==UserScript==
// @name        ShadeRoot Twitch
// @namespace   SRTW
// @include     *.twitch.*
// @include     *.twitchadvertising.*
// @description Eye-friendly magic in your browser for Twitch
// @version     1.1.0b
// @grant       none
// @icon		https://i.imgur.com/BUIRWzD.png
// @downloadURL https://update.greasyfork.org/scripts/19938/ShadeRoot%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/19938/ShadeRoot%20Twitch.meta.js
// ==/UserScript==

function ShadeRootTW(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootTW (
	'p, #header_search .text, #header_search .countries-input, .new-header-search .text, .new-header-search .countries-input, .st-search-input {color: #EDE !important;}'
	+
	'#site_header, .contain-to-grid, .top-bar {background: #26153F !important;}'
	+
	'#left_col, .app-main {background: #16131E !important;}'
	+
	'#header_search .text, #header_search .countries-input, .new-header-search .text, .new-header-search .countries-input, .st-search-input {background-color: #40254E !important; border: 1px solid #5C3A81 !important;}'
	+
	'.main, .fullwidth_main, .container, #content {background: #1D142C !important;}'
	+
	'h2 span, .meta .title {color: #A287D7 !important;}'
	+
	'.dropmenu, .ui-menu, .ui-multiselect-menu {background: #251738 !important;}'
	+
	'h1, h2, h3, h4, h5, h6, .js-search-name {color: #8F44CC !important;}'
	+
	'#carousel .nav ul li a {background: #801FCF !important;}'
	+
	'#channel, .target-frame, .close-hostmode, .turbo_description {background: #100E17 !important;}'
	+
	'.info .title, .textwidget h1 {color: #EDE !important;}'
	+
	'.info .title:hover {background-color: #511B62 !important; color: #DCD !important;}'
	+
	'.channel-link .profile-photo, .profile-link .profile-photo, img, .widget:nth-of-type(2), .textwidget img {opacity: .85 !important;}'
	+
	'#main_col {background: #16131E !important;}'
	+
	'.balloon .player-menu__section {color: #DCD !important; background-color: #2A0C3C !important;}'
	+
	'.chat-header {box-shadow: 0px -1px 0px 0px #2C2541 inset !important; background: #201C2B !important;}'
	+
	'.chat-lines, #header-container {background: #17141F !important;}'
	+
	'.chat-interface .textarea-contain textarea {margin: 8px 0px 0px !important; background: #181020 !important; border: 1px solid #2C2541 !important;}'
	+
	/*INPUT*/'.conversations-content .conversations-list-bottom-bar, .ember-chat .chat-room-list .chat-create-room .input-contain input.text, .ember-chat .chat-room-list .chat-create-room .input-contain input.countries-input, .ember-chat .chat-room-list .chat-create-room .input-contain .recurly input, .recurly .ember-chat .chat-room-list .chat-create-room .input-contain input, .directory_header #gameselector_input {background: #201C2B !important; border: 1px solid #2C2541 !important;}'
	+
	'.message, .game, .game span, .game a, .following-col .header, .conversation-name, .black-box, .article-content {color: #DCD !important;}'
	+
	'.chat-room-list, .conversations-list {background: #291839 !important;}'
	+
	'label {color: #C2AEE6 !important;}'
	+
	'.panel-formatting .panel {color: #9E7ADE !important;}'
	+
	'.toggle-notification-menu {background: #201C2B !important;}'
	+
	'.brick {background-color: #2E2247 !important;}'
	+
	'.toggle-notification-menu::before {border-color: #6441A4 transparent transparent !important;}'
	+
	'.balloon::after {background-color: #2A0C3C !important;}'
	+
	'.chat-interface {background: #201C2B !important;}'
	+
	'.chat-messages {background: #17141F !important;}'
	+
	'.following-col .scroll {background: #17141F !important;}'
	+
	'ul.tabs li > a, .directory_header .nav li > a, ul.tabs_fake li > a {color: #8F44BE !important;}'
	+
	'ul.tabs li > a.active, .directory_header .nav li > a.active, ul.tabs_fake li > a.active {color: #BAACE1 !important; border-color: #2C2541 !important;}'
	+
	'ul.tabs::before, .directory_header .nav::before, ul.tabs_fake::before, .notification-center__footer {border-top: 1px solid #2C2541 !important;}'
	+
	'ul.tabs li > a:hover, .directory_header .nav li > a:hover, ul.tabs_fake li > a:hover {color: #B7AADD !important; border-color: rgba(100, 51, 146, 0.8) !important;}'
	+
	'.is-following a {background-color: #6441A4 !important;}'
	+
	'.conversations-list {border: 1px solid #4A3771 !important;}'
	+
	'.conversations-list .conversations-list-header {background: #6441A4 !important; border-bottom: 1px solid #382363 !important; color: #DCD !important;}'
	+
	'.conversations-list-item:hover {background-color: #22153C !important;}'
	+
	'.conversations-list-item {border-bottom: 1px solid #2C2541 !important;}'
	+
	'input.text:focus, input.countries-input:focus, .recurly input:focus, input.string:focus, textarea:focus {border: 1px solid #382363;}'
	+
	'.conversations-list-search-bar input {background: #181020 url("/images/xarth/left_col_search_icon.svg") no-repeat scroll 8px center !important;}'
	+
	'.search-divider, fieldset {border-bottom: 1px solid #472193 !important; color: #DCD !important;}'
	+
	'.thumb .boxart {border-color: #503295 !important;}'
	+
	'.thumb .cap {background: rgba(15, 6, 24, 0.9) !important;}'
	+
	'#flyout .content {background: #271633 !important;}'
	+
	'.linklist a, .st-next, .col-header .title, .following-col .following-list .channel .viewers, .flex {color: #DCD !important;}'
	+
	'.linklist a:hover, .st-next:hover {color: #8B549F !important;}'
	+
	'#flyout .point::before {border-color: transparent #271633 transparent transparent !important;}'
	+
	'.st-autocomplete-sidebar, .st-autocomplete-small, .st-autocomplete {background: #17141F !important;}'
	+
	'ul.subtabs, .user_list .user, .mixed_list .user, .video_list .video, .mixed_list .video {border-bottom: 1px solid #3F286E !important;}'
	+
	'.video_list .video .title .video_type, .video_list .video .desc .video_type, .video_list .video .video_stats .video_type, .mixed_list .video .title .video_type, .mixed_list .video .desc .video_type, .mixed_list .video .video_stats .video_type {background: #624895 !important;}'
	+
	'.st-autocomplete-sidebar .label, .st-autocomplete-small .label, .st-autocomplete .label {background-color: #312548 !important;}'
	+
	'.load-more span {background: #533D80 !important; color: #DCD !important;}'
	+
	'.viewall a {background: #342747 !important;}'
	+
	'#sidebar_query_small, search_input, input[name="query"], #sidebar_search_small input, form[action="/search"], form[action="/search"] input, .label {color: #DCD !important;}'
	+
	'.ember-chat .chat-settings .chat-colors .chat-colors-swatch.selected {box-shadow: 0px 0px 0px 3px #232127, 0px 0px 0px 1px #7D2CAE inset !important;}'
	+
	'.turbo_description {box-shadow: 1px 0px 0px #220F38, -3px 0px 3px rgba(0, 0, 0, 0.15) inset !important;}'
	+
	'.exception, #site_footer a, .item.price, .js-search-name, .features_desc {color: #DCD !important;}'
	+
	'#terms, #subscription_cancel {text-shadow: 0px 1px 0px #120920 !important;}'
	+
	'.messages #send_message_form, .messages #reply_message_form {border-top: 1px solid #2A1848; background: #292233 !important;}'
	+
	'input.text, input.countries-input, .recurly input, input.string, textarea {background: #181120 !important; color: #DCD !important; border: 1px solid #353041 !important;}'
	+
	'.messages #send_message_form #bottom_buttons, .messages #reply_message_form #bottom_buttons {border-top: 1px solid #3A2662 !important; border-bottom: 1px solid #412A6E !important; box-shadow: 0px -1px 0px #271644 !important;}'
	+
	'.messages #send_message_form .button_group, .messages #reply_message_form .button_group {background: transparent linear-gradient(#2F2445, #1E1138) repeat scroll 0% 0% !important;}'
	+
	'.whatisthis {background: #2C143E !important;}'
	+
	'.whatisthis::before {border-color: transparent transparent #2E1D47 !important;}'
	+
	'.messages p.empty, .section-header, #settings_buttons {background: rgb(46, 36, 72) !important;}'
	+
	'.messages #message_actions, fieldset {background: #201A2D !important; border-bottom: 1px solid #1E192A !important;}'
	+
	'.header-content .title, .connect-item-desc .title, .form_microcopy {color: #DCD !important;}'
	+
	'.section-header {border-bottom: 1px solid #1C0E38 !important;}'
	+
	'.cl-subheader, .hdr {background: #2E2448 !important; color: #DCD !important;}'
	+
	'li.hdr {border-bottom: 1px solid #3E2A60 !important;}'
	+
	'.multi_select li.selector form:hover, .multi_select li.selector > label:hover, .multi_select li.selector .ms-int:hover {background: #2C213E !important;}'
	+
	'.multi_select li.selector form, .multi_select li.selector > label, .multi_select li.selector .ms-int {border-bottom: 1px solid #3C2660 !important;}'
	+
	'.connect_items {border-bottom: 1px solid #361F5D !important;}'
	+
	'#settings form, .postArticle, iframe html body {background: #17141F !important;}'
	+
	'.connect-item-info {background: #2E2448 !important;}'
	+
	'.connect_items .connect-item-details, .connect_items .connect-item-details-legal {border-bottom: 1px solid #412C6C !important;}'
	+
	'select {background: rgb(100, 65, 164) none repeat scroll 0% 0% !important; border: 1px solid rgb(79, 41, 110) !important; color: #DCD !important;}'
	+
	'.postActions, .js-video-issue, .player-menu__section {background: #37255A !important;}'
	+
	'.avatar-text, .button--chromeless:active, .button--chromeless:focus, .button--chromeless:hover, .button--link:active, .button--link:focus, .button--link:hover {color: #DCD !important;}'
	+
	'.buttonSet-inner button, .player-text-link--no-color, .js-meta-title, .player-menu__item .player-text-link, .twitch_subwindow_container .card a, .kraken-embed .card a, .kraken-page .card a {color: #DCD !important;}'
	+
	'.buttonSet-inner button {background: #5A3A78 !important; border-radius: 1em !important;}'
	+
	'.video_list.external .video .cap_and_profile .profile, .mixed_list.external .video .cap_and_profile .profile {background: #4D2A89 !important;}'
	+
	'.user_list .user .user_stats .followers_count, .mixed_list .user .user_stats .followers_count {padding: 2px 5px 2px 20px !important; background: #584085 url("/images/xarth/g/g18_heart-00000020.png") no-repeat scroll left center !important; border-radius: 4px !important;}'
	+
	'.cl-container .cl-section {background: #100E17 !important;}'
	+
	'#turbo_action {background: #271536 !important; border: 1px solid #3A1963 !important; box-shadow: 0px 1px 0px #1E0C27 !important;}'
	+
	'.nav_section .header, .links_group a {color: #8661C5 !important;}'
	+
	'.twitch_subwindow_container .card .text-content, .kraken-embed .card .text-content, .kraken-page .card .text-content, .authorize, .kraken-embed .card .text-content {background: #392B59 !important;}'
	+
	'.twitch_subwindow_container .card .buttons, .kraken-embed .card .buttons, .kraken-page .card .buttons {border-top: 1px solid #372759 !important;}'
	+
	'.twitch_subwindow_container .card .text-content, .kraken-embed .card .text-content, .kraken-page .card .text-content {padding: 10px 25px 5px !important;}'
	+
	'.rightcol-content {background: #17141F !important;}'
	+
	'.chatters-container .chatters {background: #1C1327 !important;}'
	+
	'.player-button, .player-overlay {opacity: .85 !important;}'
	+
	'.chat-colors .small, .list-header, .active, .empty-grid, #setup_link, .stat, .quality, .quality span, .content-list, ul.vtabs li .not_linked, ul.vtabs li a {color: #DCD !important;}'
	+
	'.theatre .emoticon-selector .tabs .tab.active, .dark .emoticon-selector .tabs .tab.active, .app-main.theatre .chat-container .emoticon-selector .tabs .tab.active, .app-main.theatre .ember-chat-container .emoticon-selector .tabs .tab.active, .force-dark .emoticon-selector .tabs .tab.active {border-top-color: #6441A4 !important;}'
	+
	'#setup_link {background: #2F1C4B !important;}'
	+
	'.dash-chat-column {border: 1px solid #353041 !important;}'
	+
	'.emoticon-selector-toggle {top: 13px !important;}'
	+
	'.wrapper {background-color: rgba(23, 17, 29, 0) !important;}'
	+
	'.wrapper .title {color: #DCD !important;}'
	+
	'.horizontal-rule {border-bottom: 1px solid #341E62 !important; box-shadow: 0px 1px 0px rgba(65, 27, 64, 0.6) !important;}'
	+
	'ul.vtabs li a:hover {background: #3F1F66 !important;}'
	//+
	//'#footer_links, #copyright {background: rgba(41, 17, 81, 0.5) !important;}'
	+
	'#content-contain {background: #17141F !important; background-color: rgb(41, 41, 41); border-top: 1px solid #442263 !important; border-bottom: 1px solid #442263 !important;}'
	+
	'#company-header {background: #24104A !important; border-bottom: 1px solid #2F116B !important; border-top: 1px solid #231145 !important;}'
	+
	'.dashboard .topic {background: #28183B !important;}'
	+
	'a.viewall {border-top: 1px solid #492175 !important; color: #DCD !important;}'
	+
	'.support-search-big, .support-search-small {background: #2F1D51 !important; box-shadow: 0px 1px 0px #2F1C47 inset, 0px 1px 2px rgba(0, 0, 0, 0.75) !important;}'
	+
	'.normal_button {box-shadow: 0px 1px 0px #3C225C inset, 0px 1px 0px rgba(0, 0, 0, 0.07) !important; text-shadow: 0px 1px 0px rgba(35, 17, 65, 0.8) !important; background: #392252 !important; color: #DCD !important;}'
	+
	'#footer_links li a, .menu-item-type-custom, ul#noty_top_layout_container div.noty_bar.noty_type_error .noty_message, ul#noty_top_layout_container div.noty_bar.noty_type_success .noty_message {color: #DCD !important;}'
	+
	'#home_page_downs .widget, #home_page_downs .widget:nth-of-type(2n), #content-container, #widget-block, .cart_totals table, .related, .upsells {background-color: #2A1347 !important;}'
	+
	'.site-wide-cta .action-link:hover {border-color: #331E5C !important; background-color: #331E5C !important;}'
	+
	'#site-wide-container .arrow {border-top-color: #2A1347 !important;}'
	+
	'footer.full-width {background-color: #261F2F !important; border-top: 1px solid #3A1557 !important;}'
	+
	'button.secondary, .button.secondary {background: #361B4E !important;}'
	+
	'large-5 {text-shadow: 0px 0px 5px #424 !important;}'
	+
	'span[style="color: rgb(38, 38, 38); font-family: arial, sans-serif; font-size: 13px; line-height: 16px;"], .auth, .activity-meta__name {color: #DCD !important;}'
	+
	'.ct-tags__tag {color: #DCD !important; background-color: #6441A4 !important;}'
	+
	'.ct-toggle--trans .ct-toggle__knob {background-color: #6441A4 !important;}'
	+
	'.ct-tags--extracted {border-bottom: 1px solid #412B6E;}'
	+
	'.activity-card__status {background: #311F42 !important;}'
	+
	'.activity-card {border: 1px solid #543C7B !important;}'
	+
	'.activity-meta {box-shadow: 0px -1px 0px #5B3798 inset !important;}'
	+
	'.activity-react__item:hover {border-color: #3E1E77 !important; color: #C7BAE0 !important;}'
	+
	'.activity-meta::before {background: #3D2553 !important; border: 1px solid #5B3798 !important;}'
	+
	'.balloon--left, .balloon--dropmenu, .js-controls, .show {background-color: #201424 !important;}'
	+
	'.activity-react__item {border: 1px solid #30195F !important; background-color: #23132C !important;}'
	+
	'.more-details ul li, .appfeatures li, .more-details, .more-details li, .press_list li span, .callout h6 {color: #DCD !important;}'
	+
	'.static_context_banner {border-bottom: 1px solid #311762 !important; box-shadow: 0px 1px 0px rgba(45, 20, 83, 0.6) !important;}'
	+
	'.white {background-color: #17111D !important;}'
	+
	'.purple {background-color: #311D54 !important; color: #DCD !important;}'
	+
	'.noty_message, .fp-carousel__title {color: #DCD !important;}'
	+
	'#carousel .nav ul li a::before {box-shadow: 0px 0px 0px 2px #332057 inset, 0px 0px 0px 3px #000 inset !important;}'
	+
	'#carousel .nav ul li.active a::before {box-shadow: 0px 0px 0px 2px #7E3ABD inset, 0px 0px 0px 3px #000 inset !important;}'
	+
	'.balloon--cols .balloon__list ~ .balloon__list {box-shadow: -1px 0px 0px #4C3874 !important;}'
	+
	'ul.mininav, hr:after {border-bottom: 1px solid #402C56 !important;}'
	+
	'.article-content div div {border: 2px solid rgb(67, 46, 107) !important;}'
	+
	'li.article {background: #2F193F url("http://assets2.desk.com/images/portal/icon-types.png") no-repeat scroll 20px -258px !important; border: 1px solid #4C2F7B !important;}'
	+
	'.pagination, .prime-offers__list.prime-offers--offset::after {background-color: #17141F !important;}'
	+
	'#paginate_block .current {background-color: #2F193F !important; border: 1px solid #4C2F7B !important; color: #DCD !important;}'
	+
	'hr {opacity: 0;}'
	+
	'hr:after {opacity: 1 !important;}'
	+
	'.border, .text-container, #noty_bottomCenter_layout_container li, .notification__container {border: 1px solid #451987 !important;}'
	+
	'.fp-container {color: #dfd5ef !important;}'
	+
	'.activity-card, .fp-side, #noty_bottomCenter_layout_container li, .linklist a, .st-next, .col-header .title, .following-col .following-list .channel .viewers, .flex, .noty_message, .border, .text-container, .fp-side__footer, .notification-center__footer {background: #271e35 !important;}'
	+
	'select.form__input, textarea.form__input, .form__input[type="text"], .form__input[type="email"], .form__input[type="password"], .form__input[type="search"] {background-color: #140a2d !important; color: #c4b6dd !important;}'
	+
	'select.form__input, textarea.form__input, .form__input[type="text"], .form__input[type="email"], .form__input[type="password"], .form__input[type="search"] {box-shadow: inset 0 0 0 1px #6b47b3,0 0 0 transparent !important;}'
	+
	'.header-announcement__bar, .header-announcement__bar .flex--verticalCenter {background: #0E9DD9 !important;}'
	+
	'.fp-carousel-nav__item {border-bottom: .4rem solid #3d2c5f !important;}'
	+
	'.fp-carousel-nav__item--active {border-bottom: 4rem solid #6441a4 !important;}'
	+
	'.offer-item--title {background: #1c0d39 !important; border-bottom: .1rem solid #4f15c3 !important;}'
	+
	'.balloon {box-shadow: 0 0 0 1px #552ca5,0 1px 1px rgba(0,0,0,.25) !important;}'
	+
	'.offer-list__core::after {background-image: linear-gradient(rgba(255,255,255,0) 0,#361853 100%) !important;}'
);