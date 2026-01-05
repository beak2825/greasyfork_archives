//
// Written by Glenn Wiking
// Script Version: 0.2.2b
// Date of issue: 06/11/16
// Date of resolution: 06/11/16
//
// ==UserScript==
// @name        ShadeRoot Twitter
// @namespace   SRTW
// @version     0.2.2b
// @grant       none
// @icon        https://i.imgur.com/Qnk5qPF.png
// @description Eye-friendly magic in your browser for Twitter

// @include     http://twitter.*
// @include     https://twitter.*
// @include     http://*twitter.*
// @include     https://*twitter.*
// @include     *.twitter.*
// @include     *.twitter.*
// @include     http://blog.twitter.*
// @include     https://blog.twitter.*

// @downloadURL https://update.greasyfork.org/scripts/24607/ShadeRoot%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/24607/ShadeRoot%20Twitter.meta.js
// ==/UserScript==

function ShadeRootTwitter(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootTwitter(
	  // BG COLOR 1 // TEXT COLOR 1
	'html, body, .AppContent, .ProfilePage, .Gallery-content {background: #04111A !important; color: #98B5C8 !important;}'
	+
	'.message {background: #061D2C !important; box-shadow: 0px 2px 4px rgba(14, 87, 149, 0.3) !important;}'
	+
	'input, textarea:not(.TokenizedMultiselect-input), samp, code div[contenteditable], .t1-select, .js-stream-tweet, #user_description, .rc-anchor-light, .rc-anchor-normal, .front-signin, .front-signup {background-color: #061D2C !important; border: 1px solid #1377B4 !important; color: rgb(162, 205, 234) !important;}'
    +
    '.ProfileNav-value:hover, .flex-module-inner button, small, .btn-link, .btn-link:focus, .icon-btn, .pretty-link b, .pretty-link:hover s, .pretty-link:hover b, .pretty-link:focus s, .pretty-link:focus b, .metadata a:hover, .metadata a:focus, a.account-group:hover .fullname, a.account-group:focus .fullname, .account-summary:focus .fullname, .message .message-text a, .message .message-text button, .stats a strong, .plain-btn:hover, .plain-btn:focus, .dropdown.open .user-dropdown.plain-btn, .open > .plain-btn, #global-actions .new:before, .module .list-link:hover, .module .list-link:focus, .stats a:hover, .stats a:hover strong, .stats a:focus, .stats a:focus strong, .find-friends-sources li:hover .source, .stream-item a:hover .fullname, .stream-item a:focus .fullname, .stream-item .view-all-supplements:hover, .stream-item .view-all-supplements:focus, .tweet .time a:hover, .tweet .time a:focus, .tweet .details.with-icn b, .tweet .details.with-icn .Icon, .stream-item:hover .original-tweet .details b, .stream-item .original-tweet.focus .details b, .stream-item.open .original-tweet .details b, .client-and-actions a:hover, .client-and-actions a:focus, .dismiss-btn:hover b, .tweet .context .pretty-link:hover s, .tweet .context .pretty-link:hover b, .tweet .context .pretty-link:focus s, .tweet .context .pretty-link:focus b, .list .username a:hover, .list .username a:focus, .list-membership-container .create-a-list, .list-membership-container .create-a-list:hover, .new-tweets-bar, .card .list-details a:hover, .card .list-details a:focus, .card .card-body:hover .attribution, .card .card-body .attribution:focus {color: #cee4f3 !important;}'
	+
	'input:focus, textarea:focus, div[contenteditable="true"]:focus, div.fake-focus[contenteditable="true"], .WidgetsSelector-title, .is-dark, .explore-blogs__title {color: #BFE0F6 !important;}'
	+
	'.content-header .header-inner, .content-no-header .no-header-inner, .ProfileNav-item--userActions, .ModalDialog-content, header, .Header, .sticky-cta {background-color: #061D2C !important;}'
	+
	'.ProfileNav-item--userActions {height: 58px !important; padding: 11px 0px 0px 2px !important;}'
	+
	'.module .list-link:hover, .module .active .list-link, .stream-end-inner, .ProfileCanopy-navBar, .DMButtonBar {background-color: #061D2C !important;}'
	+
	'.list-link:hover, .WhoToFollow, .stream-item:not(.no-header-background-module), .DMActivity-body {background-color: #0F2D47 !important;}'
	+
	'.ProfileCanopy-navBar, .front-signup h2, .front-signin h2, .new-tweets-bar {border-top: 1px solid #1377B4 !important; border-bottom: 1px solid #1377B4 !important;}'
	+
	'img, .btn-cta, .ProfileCard-bg, .home .page-footer, video, .error-msg, .rosetta-icon-media-play {opacity: .85 !important;}'
	+ // BORDER COLOR 1
	'.file-upload-section {border: 1px solid #1377B4 !important;}'
	+
	'.TokenizedMultiselect-input, .front-signup h2, .front-signin h2 {background-color: #0F2D47 !important;}'
	+
	'.ProfileCard, .NotificationsEmptyModule, .ListCreationModule {background-color: #061D2C !important; border: 1px solid #0E4F86 !important;}'
	+
	'.u-bgUserColorLighter, .u-bgUserColorLightest, .RichEditor div[contenteditable], .RichEditor div[contenteditable]:focus, .RichEditor div.fake-focus[contenteditable] {background: #0E4F86 !important;}'
	+
	'.caret-inner {border-bottom: 9px solid #0F2D47 !important;}'
	+ // BG COLOR 2
	'.global-nav-inner, .page-canvas, .header-nav, .breadcrumbs, footer, .ProfileCard-avatarLink, .Footer-adsModule, .stream-item:not(.no-header-background-module) {background: #082538 !important;}'
	+
	'.ProfileAvatar, .ProfileAvatarEditing {background: #082538 !important; border: 5px solid #266183 !important;}'
	+
	'.dropdown-menu li > a:hover, .dropdown-menu li > a:focus, .dropdown-menu .dropdown-link:hover, .dropdown-menu .dropdown-link:focus, .dropdown-menu .dropdown-link.is-focused, .dropdown-menu li:hover .dropdown-link, .dropdown-menu li:focus .dropdown-link, .dropdown-menu .typeahead-recent-search-item.selected, .dropdown-menu .typeahead-saved-search-item.selected, .dropdown-menu .selected a, .dropdown-menu .dropdown-link.selected, .DMPopoverMenu, .DMPopover-content, .modal-content {background: #061D2C !important;}'
	+
	'.DMPopover-content.Caret::after {border-color: #061D2C !important;}'
	+ // BG COLOR 3
	'.mobile, .contact-support, .has-sms, .dropdown-menu, .content-inner, .list-link, body.home section.new-features, .thumbnail-wrapper {background-color: #0F2D47 !important;}'
	+ // BG COLOR 4
	'.u-bgUserColor, .u-bgUserColorHover:hover, .u-bgUserColorHover:focus, .top-timeline-tweetbox .timeline-tweet-box, .content-searchbar, .modal-header {background-color: #054D7A !important;}'
	+ // TEXT COLOR 1
	'.nav > li, .remember, .t1-label, .tweet-text, .ProfileNameTruncated-link, .ProfileCard-bio, .ButtonSelectModal-title, .DMPopoverMenu-button, .front-signup h2 strong, .front-signin h2 strong {color: #98B5C8 !important;}'
	+
	'.ProfileHeaderCard-birthdateText, .ProfileHeaderCard-joinDateText, .ProfileHeaderCard-locationText, .ProfileHeaderCard-onlineHoursText, .ProfileHeaderCard-responsivenessLevelText, .ProfileHeaderCard-vineProfileText, .ProfileHeaderCard-periscopeProfileText, .ProfileNav-label, .trend-location, .js-nav, .trend-item-stats {color: #98B5C2 !important;}'
	+
	'.Trends .context-trend-item .trend-item-stats, .DMActivity-title, .DMTypeaheadHeader, .UserPolicy p, label {color: #98B5C2 !important;}'
	+ // LINK COLOR 1
	'a {color: #1B95E0 !important;}'
	+ // LINK COLOR 2 == LOGO COLOR
	'.fullname {color: #1DA1F2 !important;}'
	+
	'.twitter-hashtag > *, .pretty-link > *, .find-friends-list .source {color: #09A5FB !important;}'
	+
	'.global-nav--newLoggedOut a, .global-nav--newLoggedOut a:hover, .global-nav--newLoggedOut a:focus, .global-nav--newLoggedOut a:active {color: #1DA1F2 !important;}'
	+
	'.typeahead strong, h1, h2, h3, h4, h5, h6, .message-text, .QuoteTweet-fullname, .ProfileNav-item.is-active .ProfileNav-value, .ProfileNav-item.is-active:hover .ProfileNav-value, .modal-header {color: #98B5C8 !important;}'
	+
	'.page-canvas {box-shadow: 0px 0px 225px #050D1B !important;}'
	+ // ARTICLE
	'.info, article, .article, .block-message {background: #0D2B48 !important; border: 1px solid #0E4F86 !important; color: rgba(136, 185, 227, 0.8) !important;}'
	+ // SINGLE BORDER 1
	'#feedback_vote h2.title::before, .list-link, .DashboardProfileCard-bg, .typeahead .dropdown-inner > .has-results ~ .has-results, .typeahead .dropdown-inner > .has-items ~ .has-items, .DMConversation-composer, .modal-footer, .AdaptiveSearchTimeline-separationModule + .stream-item {border-top: 1px solid #266183 !important;}'
	+
	'.stream-item + .stream-item.separated-module:not(.no-header-background-module), .stream-item.separated-module + .stream-item:not(.no-header-background-module), .PromptbirdPrompt-streamItem.separated-module + .stream-item:not(.no-header-background-module) {border-top: 1px solid #266183 !important;}'
	+
	'.content-header .header-inner, .content-no-header .no-header-inner, .no-stream-end, .stream-item-activity-notification, .DMActivity-header, .ProfileClusterFollow, .modal-header, .find-friends-list li, .app {border-bottom: 1px solid #266183 !important;}'
	+
	'.content-header, .content-no-header, hr, .WhoToFollow, .TokenizedMultiselect-inputContainer, .is-highlighted {border-color: #266183 !important;}'
	+
	'.content-inner, .stream-item:not(.no-header-background-module) {border-left: 1px solid #266183 !important; border-right: 1px solid #266183 !important;}'
	+
	'.AdaptiveFiltersBar-label {border-right: 1px solid #266183 !important;}'
	+
	'.DashboardProfileCard, .flex-module, .Trends, .u-bgUserColorLightest, .find-friends-list li:hover {border-color: #266183 !important; background: #061D2C !important;}'
	+
	'.DashboardProfileCard-bg, .dropdown-divider, .cta, .content-searchbar, .content-searchbar, .account, .ProfileCard-bg, .cd-content ul li a h5, .AdaptiveFiltersBar, .nav--menu__list-item a, .c22 {border-bottom: 1px solid #305E7E !important;}'
	+ // TEXT COLOR 2
	'legend, .t1-legend, .ProfileHeading-toggleItem.is-active, .ProfileHeading-toggleItem.is-active:hover, .ProfileHeading-toggleItem.is-active:focus {color: #43A7EA !important;}'
	+ // BUTTON COLOR
	'.btn, .white {color: #C6DFF0 !important; background-color: #2A8CCB !important; background-image: linear-gradient(#2F556E, #093465) !important; border: 1px solid #123C5A !important;}'
	+
	'.btn:hover, .follow-combo.open .btn-user-actions, .dropdown.open .user-dropdown {background-color: #1A78BD !important; background-image: linear-gradient(#1F7CD5, #145FC0) !important; border-color: #3F99D8 !important; color: #98B5C8 !important;}'
	+
	'.btn:focus, .btn.focus, .front-signup .btn, .front-signin .submit, .FollowButton, .follow-button {background: #1E63A7 !important; border-color: rgb(23, 77, 117) !important; box-shadow: -1px 0px 0px 1px rgba(0, 0, 0, 0), 0px 0px 0px 3px rgba(0, 0, 0, 0) !important;}'
	+
	'.list-link, .TwitterCard-container, .u-borderUserColorLighter {border-color: #204E7B #14364E !important;}'
	+
	'.js-nav-link li .js-nav, .modal-table th, .alert p, b, .TweetAuthor-name, .Identity-name, .customisable-highlight, .Tweet-text, .e-entry-title {color: #6A9FBF !important;}'
	+
	'.tweet, .EmbeddedTweet, .ComposerThumbnail {background-color: #0F457A !important; border: 1px solid #1D74B3 !important;}'
	+
	'.tweet-counter, .front-signin .remember, .front-signin .forgot, .front-signin .separator, .front-signup h2, .front-signin h2 {text-shadow: 0px 1px 1px rgba(22, 69, 140, 0.8) !important;}'
	+
	'.RichEditor, .QuoteTweet, .timeline-tweet-box, a.home-category {border: 1px solid #071723 !important;}'
	+
	'.RichEditor div[contenteditable], .RichEditor div[contenteditable]:focus, .RichEditor div.fake-focus[contenteditable] {border-radius: 3px; background: #04111A !important;}'
	+
	'.stream-end-item, .stream-end, .stream-loading, .stream-placeholder {border-color: -moz-use-text-color #195E8F #0D3D6C !important;}'
	+ // OVERLAY
	'.ProfilePage-editingOverlay, .tweet-content {background-color: #020911 !important;}'
	+
	'.u-boxShadowInsetUserColorHover:hover, .u-boxShadowInsetUserColorHover:focus {box-shadow: 0px 0px 0px 5px #0A527E inset !important;}'
	+
	'.u-borderUserColorLight, .u-borderUserColorLightFocus:focus, .u-borderUserColorLightHover:hover, .u-borderUserColorLightHover:focus {border-color: #0F3266 !important;}'
	+
	'.BirthdateSelect-button, .EmojiBar-icon, .EmojiBar-suggestions, .ProfileClusterFollow, .modal-header {background-color: #115690 !important;}'
	+
	'.u-bgUserColorLightest, .DMComposer-container {background: #061D2C !important;}'
	+
	'.ProfileHeaderEditing-addHeaderHelp, .ProfileHeaderEditing-changeHeaderHelp, .ProfileHeaderEditing-dropHeaderHelp, .ProfileHeaderEditing-iframeSavingHelp, .PlayerCard-playButton {opacity: .5 !important;}'
	+
	'.stream .tweet {background-color: #061D2C !important; border: 1px solid #123150 !important;}'
	+
	'.home-tweet-box, .LiveVideo-tweetBox, .RetweetDialog-commentBox, .WebToast-box--altColor, .NotificationsHeadingContent, .ProfileHeading-content, .DMActivity-header, .new-tweets-bar {background-color: #054D7A !important; border: #054D7A !important;}'
	+
	'.rosetta-icon-media-play-fill, .rosetta-icon-media-play-fill::before, .rosetta-icon::before {opacity: 0.75;}'
	+
	'.Footer-adsModule, .import-prompt, .stream ol li:nth-child(even) > div {background-color: #03101A !important;}'
	+
	'.TwitterCard-container--clickable:hover {background: #0F365C !important; border-color: rgba(22, 93, 147, 0.5) !important;}'
	+
	'.SummaryCard-content, .find-friends-top-subheader, .find-friends-bottom-subheader, .find-friends-sources, .nav-drawer.active {background: rgb(13, 65, 110) !important;}'
	+
	'.SummaryCard-content {padding: 0.85em !important;}'
	+
	'.DashboardProfileCard-avatarLink {background-color: #0D263C !important; opacity: .92 !important;}'
	+
	'body.home > header ul.search-terms > li {background-color: rgba(3, 14, 27, 0.4) !important;}'
	+
	'.home .profile-menu {background: rgba(20, 47, 66, 0.4) !important; padding: 0.5em !important; border-radius: 3px !important;}'
	+
	'blockquote {border-left: 5px solid #115CA7 !important;}'
	+
	'body.home .home-categories li a.home-category:hover, body.home .home-categories li a.home-category:active {background-color: #112A44 !important;}'
	+
	'.page-footer .page-footer-wrapper {background: transparent linear-gradient(to bottom, #06243B 0%, #0D3A6C 100%) !important;}'
	+
	'.search-results .load-more-results li article {padding: 0.8em 1.2em !important;}'
	+
	'.content-searchbar .search-query, .text-input, .front-signup h2, .front-signin h2 {box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 1px 0px #163E6B !important;}'
	+
	'.QuoteTweet--unavailable {background: #0F5189 !important;}'
	+
	'.is-highlighted {background-color: #175386 !important;}'
	+
	'.DMConversation-composer {box-shadow: 0px 1px 0px rgba(8, 23, 42, 0.85) inset !important;}'
	+
	'.u-borderUserColorLighter, .ProfileCanopy-header {border: none !important; opacity: .8;}'
	+
	'.u-borderUserColorLightest, .DMConversation-composer, .ProfileTweetbox {background-image: linear-gradient(#1F7CD5, #145FC0) !important;}'
	+
	'.DMNotice--error {background: #470717 !important;}'
	+
	'.sc-key {color: #B9DCF3 !important; background-color: #3A7BCF !important; background-image: linear-gradient(#1B7ABA, #145CAD) !important; border: 1px solid #539ACF !important; box-shadow: 0px 1px 0px #104E83 inset, 0px 1px 0px #0E2535 !important;}'
	+
	'.alert, .u-bgUserColorLighter, .ProfileHeaderCardEditing--extraFields {background-image: linear-gradient(#185690, #25496B) !important; text-shadow: 0px 1px 1px rgba(20, 47, 68, 0.3) !important;  border-width: 0 !important;}'
	+
	'.alert p, .UserPolicy p, p, .Field-items-item, .footer-bottom, .lang-selection {color: #A9D2ED !important;}'
	+
	'.modal-header {background: #020911 !important;}'
	+
	'*[style="background-color: rgb(238,238,238);"] {background: #05274E !important;}'
	+
	'.ProfileHeaderCardEditing {background-image: linear-gradient(#0E3F68, #08264E) !important;}'
	+
	'.ProfileHeaderCardEditing--extraFields {background-image: linear-gradient(#071B2D, #072553) !important;}'
	+
	'.front-page-photo-set .companion-tweet .text, .companion-tweet a, .text .tweet-text, .front-welcome-text p, .companion-tweet .username {text-shadow: 0 0 5px #000; font-size: 1.1em !important; text-decoration: none !important;}'
	+
	'.signup-btn.btn {text-shadow: none !important;}'
	+
	'.masthead h1 {color: #253950 !important;}'
	+
	'.background-white, .GridTimeline-footerIcon {background-color: #082538 !important;}'
	+
	'.comp-container button.yellow {background-color: #0C53A4 !important;}'
	+
	'.comp-container button.yellow:hover {background-color: #0B6BD7 !important;}'
	+
	'.g-recaptcha iframe {opacity: .55 !important;}'
	+
	'.header-right .avatar img, .header-right .search .search-icon {margin: 9px !important;}'
	+
	'.header-left .logo {margin: 5px !important;}'
	+
	'.nav-drawer header {border-radius: 3px !important;}'
	+
	'b {color: #6A9FBF !important;}'
	+
	'.dashboard .Footer .js-items-container::after {content: "Warning: Some of these pages are deliberately resistant to the Shaderoot stylesheet."; display: block !important; padding: .8em 0 0 0 !important; font-size: .9em !important;}'
	+
	'.front-page-photo-set .background-companion-tweets {background: rgba(11, 19, 35, 0.4) !important; border-radius: 3px !important;}'
	+
	'.front-page-photo-set .footer.inline-list {background: rgba(11, 19, 35, 0.4) !important; border-radius: 3px !important; padding: 0.75em;}'
	+
	'.front-page-photo-set .companion-tweet .username {margin-top: 2em !important;}'
	+
	'.wtf-module .import-prompt .service {border: 1px solid #136ABF !important; background: #7AA7DA !important;}'
	+
	'.new-tweets-bar:hover {background-color: #081f30 !important;}'
	+
	'.stream-end-item, .stream-end, .stream-loading, .stream-placeholder, .timeline-end > div {border-color: #195E8F #0D3D6C !important;}'
	+
	'.u-borderUserColorLight, .u-borderUserColorLightFocus:focus, .u-borderUserColorLightHover:hover, .u-borderUserColorLightHover:focus {border-color: #134B8C !important;}'
	+ // LARGE
	'.dashboard .three-col .wrapper, .dashboard .three-col .AppContainer {width: 78vw !important;}'
	+
	'.dashboard .tree-col .AppContainer {max-width: 78vw !important;}'
	+
	'.dashboard .content-main {width: 40vw !important;}'
	+
	'.dashboard .dashboard-left, .dashboard  .dashboard-right {width: 18vw !important;}'
	+
	'@media screen and (max-width: 1300px) {.dashboard .three-col .wrapper {width: 78vw !important;} .dashboard .content-main {width: 57vw !important; margin-right: -2vw !important;} .dashboard .dashboard-left, .dashboard .dashboard-right {width: 25vw !important;} .dashboard .dashboard-left {margin-left: -4vw !important;}}'
	+
	'@media screen and (max-width: 1000px) {.dashboard .three-col .wrapper {width: 78vw !important;} .dashboard .content-main {width: 60vw !important; margin-right: 3vw !important;} .dashboard .dashboard-left, .dashboard .dashboard-right {width: 25vw !important;} .dashboard .dashboard-left {margin-left: 1vw !important;}}'
	+
	'@media screen and (max-width: 900px) {.dashboard .three-col .wrapper {width: 78vw !important;} .dashboard .content-main {width: 58vw !important; margin-right: 12vw !important;} .dashboard .dashboard-left, .dashboard .dashboard-right {width: 25vw !important;} .dashboard .dashboard-left {margin-left: 1vw !important;}}'
	+	
	'@media screen and (max-width: 800px) {.dashboard .three-col .wrapper {width: 78vw !important;} .dashboard .content-main {width: 60vw !important; margin-right: 20vw !important;} .dashboard .dashboard-left, .dashboard .dashboard-right {width: 25vw !important;} .dashboard .dashboard-left {margin-left: 1vw !important;}}'
	+
	'.passwords-page #main_content, .welcome-guest-timeline-page #main_content .signup-form, .signup-link {border-bottom: 1px solid #1d436e !important;}'
	+
	'.signup-link, .welcome-guest-timeline-page .wtf-header {background: #17458a !important;}'
	+
	'.passwords-page #main_content, .sessions-page #main_content, .signup-page #main_content, .welcome-guest-timeline-page #main_content .signup-form, #container {background: #0e2c45 !important;}'
	+
	'#container {border-color: #1d5380 !important;}'
	+
	'.toast {background-color: #1473B9 !important; color: #c1cdd8 !important;}'
	+
	'.toast, .toast-error {text-shadow: #0d324e 0 1px 0 !important;}'
	+
	'#brand_bar .message {background: #1D75B0 !important;}'
	+
	'#failureMessage {background-color: rgb(11, 27, 45) !important;}'
	+
	'#failureMessage div a, ._1HXcreMa, ._24u5-vsm, .yxwwD_7C, ._1lW9BO8P, .FsR6j-G7:active, .FsR6j-G7:focus, .FsR6j-G7:hover, .kHlKyFGV, ._1u_kMV_N, ._1pzUva68 {color: #c3d4e4 !important;}'
	+
	'._12kgJrOL {border-bottom: 1px solid #0e507e !important; background-color: #0c416e !important;}'
	+
	'.TlmtDTCq, .yY8bJa97, ._1lW9BO8P, .FsR6j-G7:active, .FsR6j-G7:focus, .FsR6j-G7:hover {background: #0e3860 !important;}'
	+
	'._15o8K1hP {color: #105b8a !important;}'
	+
	'._38myriBx, ._38myriBx:active, ._38myriBx:focus, ._38myriBx:hover {background-color: #105b8a !important; color: #c3d4e4 !important;}'
	+
	'._2Rz0TobF, ._2Rz0TobF:active, ._2Rz0TobF:focus, ._2Rz0TobF:hover {color: #3d90ed !important;}'
	+
	'._1_FMKzvm {background: #145083 !important; border-bottom: 1px solid #0f4880 !important;}'
	+
	'._1_FMKzvm:last-child, .as-Section {border-top: 1px solid #0f4880 !important;}'
	+
	'.LqlkGmch, ._24u5-vsm {background-color: #1b3f5d !important;}'
	+
	'.FsR6j-G7 {background-color: #0f2542 !important; border-bottom: 1px solid #144d75 !important;}'
	+
	'._1gq1kIcW {border-bottom: 1px solid #184666 !important;}'
	+
	'._2ZrX5aIs, .empty-index {background-color: #0f2641 !important;}'
	+
	'.TopNav {background: black !important;}'
	+
	'.errorpage-global-nav-inner {background: #104178 !important;}'
	+
	'.errorpage-btn {background: #2065aa !important;}'
	+
	'.EdgeButton--secondary {background-color: #154f87 !important;}'
	+
	'.RichEditor-container, .disco .settings .settings-section-title, .disco h2, .settings .disco .settings-section-title {background: #08172a !important;}'
	+
	'.EdgeButton--tertiary {background-color: #0c3965 !important; border: 1px solid #0e68a4 !important; color: #b2cbdb !important;}'
	+
	'.EdgeButton--tertiary:active {box-shadow: 0 0 0 2px #1d72ba,0 0 0 4px #66757f !important;}'
	+
	'#who-to-follow, .see-more {border-top: 1px solid #1764b0 !important;}'
	+
	'.categories-list li, .disco .all-suggestions, .disco .disco-header, .disco .timeline .suggestions, .disco .timeline .user-list, .disco .timeline .user-list-more, .moments .cover, .profile .profile-actions, .replying-to-header, .topics-list li, .user-header, .user-item, .user-item .avatar, .users-page .w-mediaonebox {border-bottom: 1px solid #195ca8 !important;}'
	+
	'.user-item, .confirm_actions {background: #0e2a42 !important;}'
	+
	'.timeline .conversation-tweet-not-last .avatar, .timeline .conversation-tweet-not-last .meta-and-actions {border-color: #13619c !important;}'
	+
	'.timeline .activity .last, .timeline .avatar, .timeline .meta-and-actions, .timeline .titlebar {border-bottom: 1px solid #216dc3 !important;}'
	+
	'#who-to-follow, .global-actions, .profile-stats .stat {border-color: #115289 !important;}'
	+
	'#footer .global-actions .button-link, #footer .global-actions a, #footer .global-actions a:active, #footer .global-actions a:visited {background: #0b1d2f !important;}'
	+
	'.w-button-follow {background: #1e6498 !important; border: 1px solid #0c6eb6 !important;}'
	+
	'.w-button-more {border-bottom: 1px solid #104572 !important; background: #0c1f35 !important;}'
	+
	'.search-fields .value div, .recipient_box {border: 1px solid #0d669f00 !important; background-color: #093f6200 !important;}'
	+
	'#footer .global-actions td {background-color: #154e86 !important; border: 1px solid #1357a4 !important;}'
	+
	'.settings .settings-section-title, h2 {border-bottom: 1px solid #0e3b5c !important;}'
	+
	'.w-button-more a, .w-button-more input, .search-fields div, .search-fields input, .search-fields td, button, input[type="image"], input[type="submit"] {border: 1px solid #065895 !important; background-color: #080f15 !important;}'
	+
	'.tweetsheet {border-bottom: 1px solid #0F64A2 !important; background: #103b5a !important;}'
	+
	'.tweet_box, .profile-details {border: 1px solid #2175BC !important; background: #1c65a4 !important;}'
	+
	'.stat, .categories-list li, .disco .all-suggestions, .disco .disco-header, .disco .timeline .suggestions, .disco .timeline .user-list, .disco .timeline .user-list-more, .moments .cover, .profile .profile-actions, .replying-to-header, .topics-list li, .user-header, .user-item, .user-item .avatar, .users-page .w-mediaonebox {background: #112641 !important;}'
	+
	'.w-button {border: 1px solid #0e70ae !important;}'
	+
	'.notifications-settings .search, .w-button, .w-button input, .confirm .confirm_description, .confirm .confirm_footer, .confirm .confirm_title {background-color: #154e72 !important;}'
	+
	'.timeline .titlebar, .empty_inbox {background: #143950 !important;}'
	+
	'.username .screen-name, .dir-ltr, .screen-name, .username, .empty_inbox, .type--bold-14, .color--neutral-black, .c29__title, .bg-color--dark-blue, .nav--menu, .c29__title, .color--neutral-black {color: #d3dee6 !important;}'
	+
	'.images .fullname, header, .MutedKeyword-text, .MutedKeyword-item, .MutedKeyword-expiration {color: #7EC7FC !important;}'
	+
	'.w-button-common, a.w-button-common:active, a.w-button-common:link, a.w-button-common:visited {background: #164669 !important;}'
	+
	'.w-button-cancel {border: 1px solid #1a64ad !important;}'
	+
	'.blue {background-color: #22568a !important; color: #c9d5e3 !important;}'
	+
	'.WtfLargeCarouselStreamItem-title,.EdgeButton--primary:hover {color: #b0cdea !important;}'
	+
	'.UserSmallListItem {border-bottom: 1px solid #136aa5 !important;}'
	+
	'.QuoteTweet-authorAndText.u-alignTop {background: #0d3d6c !important; padding: .5em !important;}'
	+
	'.dropdown-menu .typeahead-items li > a:focus, .dropdown-menu .typeahead-items li > a:hover, .dropdown-menu .typeahead-items .selected, .dropdown-menu .typeahead-items .selected a {background-color: #091C39 !important; background-image: background-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 100%) !important;}'
	+
	'.leftnav-item a, #notifications-optout-all-top, .notifications-prompt-container, .MutedKeywordsFooter, .MomentGuideNavigation {background: #0a1827 !important; border-bottom: 1px solid #155b84 !important;}'
	+
	'.panel-default, .MutedKeywordsFooter, .MutedKeyword-item {border-color: #0a4f89 !important;}'
	+
	'.panel, .MomentMediaItem[data-showable="true"] .MomentMediaItem-entity {background-color: #18578c !important;}'
	+
	'.panel-heading,.tweet.visible::before {border-color: #105ca7 !important;}'
	+
	'.follow-button {border-radius: 16px !important;}'
	+
	'.DashUserDropdown.dropdown-menu li > a, .DashUserDropdown.dropdown-menu button, .tweet, .Tweet-header .TweetAuthor .TweetAuthor-name, .Tweet-header .TweetAuthor .TweetAuthor-screenName, .Tweet-text, .TweetAction-stat, .tweet-account__name, .js-textfit, .tweet-copy__text {color: #bfd2e6 !important;}'
	+
	'.settings-alert {background-color: #094c84 !important;}'
	+
	'.input-prepend .add-on, .input-append .add-on {background-color: #155a89 !important; border: 1px solid #1a81c9 !important;}'
	+
	'.MutedKeywordsAddItemForm, .MomentCapsuleSummary-cover, .MomentMediaItem, .EmbeddedTweet-tweet {background: #133c63 !important;}'
	+
	'.t1-legend {border-bottom: 1px solid #14659c !important;}'
	+
	'input, textarea, div[contenteditable], .t1-select, .bg-color--neutral-extra-extra-light-gray {background-color: #0b293f !important; border: 1px solid #115a98 !important;}'
	+
	'.MomentCapsuleSummary--hero:hover, .MomentCapsuleSummary--portrait:hover {background: #0a2e51 !important;}'
	+
	'.MomentCapsuleSummaryGroup:nth-child(2n+3) {border-top: 1px solid #104077 !important;}'
	+
	'.bg-color--dark-blue, .nav--menu, .c29__title, .color--neutral-black, .newsroom-featured-copy, #main {background-color: #08304e !important;}'
	+
	'.parallax-tweet-gallery--theme-green {background-color: #09421c !important;}'
	+
	'.theme-bg-color--dark, .abh04-two-tweet-conversation {background-color: #0b486e !important;}'
	+
	'.EmbeddedTweet-tweet, .twitter-tweet .EmbeddedTweet-tweet {background: #13375a !important;}'
	+
	'.c34-wrapper--theme-dark-purple.visible, .c19, c19-promo, .open--desktop, .atc-button--dark, .c19__headline, .c19__logo, .theme-fill-color--dark, main {background: #0f243c !important;}'
	+
	'.twitter-tweet, .imgRight div a div, .imgLeft div a div {opacity: .8 !important; filter: brightness(.8) !important;}'
	+
	'.tweet.visible::after {border-bottom-color: #2360a5 !important; border-right-color: #1c6695 !important;}'
	+
	'.dropdown.closed .title {background: #1f4366 !important; color: #338fde !important; border: 1px solid #116eae !important;}'
	+
	'.dropdown ul li, .account, .img-right .copy-container, .container--mini, .container--mobile, #component-wrapper, .loader-bird, .blank, .hide {background: #15324b !important;}'
	+
	'.dropdown ul li:hover {color: #d5e4ed !important; background: #2370b6 !important;}'
	+
	'.sticky, .col2 .copy-container, .col3 .copy-container, .img-right-half .copy-container {background-color: #203b6b !important; border-bottom: 1px solid #133c56 !important;}'
	+
	'.img-full h2 {text-shadow: 1px 2px 2px #081f32 !important;}'
	+
	'.medium h1 {text-shadow: 1px 2px 2px #9eb4ce !important;}'
	+
	'.account-container header, .bl04-topic-masthead__text .container--mini {background: none !important;}'
	+
	'.c20__contentWrapper {border-bottom: 1px solid #093e63 !important;}'
	+
	'.tag-billboard__title--keyline-top, .stream-item:first-child {border-top: 1px solid #194869 !important;}'
	+
	'.results-loop .result {border-bottom: 1px solid #165380 !important;}'
	+
	'.loader-bird, .blank, .hide {display: none !important;}'
	+
	'.bg-outer, .admonition, .timeline-Widget, .timeline-Footer {background: linear-gradient(to right, #011D34 40%, #03060e 40%) !important;}'
	+
	'.current > ul {border-left: 1px solid #1b64b6 !important;}'
	+
	'iframe {opacity: .9; filter: brightness(.85) !important;}'
	+
	'#sidebar-nav {overflow: none !important;}'
	+
	'table .row-odd {background-color: #0c1b26 !important;}'
	+
	'table .row-even {background-color: #11324e !important;}'
	+
	'.docutils.literal, .SidebarFilterModule, .AdaptiveRelatedSearches {background-color: #0c243c !important; border: 1px solid #15659b !important;}'
	+
	'code {color: #8fd0f3 !important;}'
	+
	'.comp-wrapper, #profile-hover-container, .profile-social-proof {background-color: #0b1620 !important;}'
	+
	'.module a, #globalnav {color: #c8dbec !important;}'
	+
	'#globalnav {box-shadow: 0 0 3px #114566 !important; background: #0f3b5c !important;}'
	+
	'.tweet .stats {border-bottom: 1px solid #0f6eae !important; border-top: 1px solid #1d6799 !important;}'
	+
	'.stats .avatar-row a:first-child {border-left: 1px solid #176aa1 !important;}'
	+
	'.stat-count strong, .recap-header {color: #bed0e3 !important;}'
	+
	'.inline-reply-tweetbox {border-bottom: 1px solid #206fb3 !important; border-top: 1px solid #19679b !important; background: #0f1e2d !important;}'
	+
	'.tweet-details-fixer .client-and-actions .created-via, .tweet-details-fixer .client-and-actions .metadata, .tweet-details-fixer .client-and-actions .metadata button.btn-link, .tweet-details-fixer .client-and-actions .metadata a {color: #ADBBC8 !important;}'
	+
	'.EdgeButton--secondary {background-color: #173a5c !important; color: #B4D1E4 !important;}'
	+
	'.permalink {background-color: #0c1c29 !important;}'
	+
	'.AdaptiveFiltersBar {background-color: #0f324b !important;}'
	+
	'.SearchExtrasDropdown-target, #profile-hover-container, .profile-social-proof {color: #43ac !important;}'
	+
	'.locations-list dd a, .ep-Signup .ep-SignupTextContainer .ep-SignupText, .ep-Signup .ep-SignupTextContainer .ep-RefreshText {color: #ADD1E7 !important;}'
	+
	'.nav-wrapper li.leftnav-item, .recap-header, .ActivityItem, .ep-Header {border-bottom: 1px solid #135174 !important;}'
	+
	'.ProfileAvatar-image, .ProfileAvatar-placeholderImage {opacity: 1 !important;}'
	+
	'.ep-CampaignContainer {background-color: #0d2341 !important;}'
	+
	'.as-Form select, .as-Form input {background-color: #154a86 !important; border: 1px solid #1868a1 !important;}'
	+
	'.is-background {background-color: #082e4e !important;}'
	+
	'.mtc-tile {border: 1px solid #1e64ab !important; background-color: #0b2030 !important;}'
	+
	'.mtc-cta--blue-to-dull {color: #c8d7e1 !important;}'
	+
	'.mtc-cta--transparent a {border-color: #14649f !important;}'
	+
	'mc23-masthead-large__item {opacity: .9 !important; filter: brightness(.92) !important;}'
	+
	'a[style="background-color: #ffffff; letter-spacing: -0.15px;"] {background-color: #0a1a2a !important;}'
    +
	'.Banner--red, .HomeEmptyTimeline {background-color: #0c1525 !important;}'
    +
    '.EdgeButton--primary {color: #dfecf3 !important;}'
    +
    '.ProfileUserList-listName .u-textUserColor, .ProfileHeaderCard-urlText .u-textUserColor {background: #487aa5 !important;}'
);