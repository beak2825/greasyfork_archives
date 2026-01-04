//
// Written by Glenn Wiking
// Script Version: 0.0.1a
// Date of issue: 09/17/17
// Date of resolution: 09/17/17
//
// ==UserScript==
// @name        ShadeRoot StackOverflow
// @namespace   SRSO
// @description Eye-friendly magic in your browser for StackOverflow
// @version     0.0.1a
// @icon        https://i.imgur.com/UppYNjW.png

// @include        http://*stackoverflow.*
// @include        https://*stackoverflow.*
// @include        http://*stackexchange.*
// @include        https://*stackexchange.*
// @include        http://*superuser.*
// @include        https://*superuser.*
// @include        http://*stackoverflowbusiness.*
// @include        https://*stackoverflowbusiness.*
// @include        http://*mathoverflow.*
// @include        https://*mathoverflow.*
// @include        http://*askubuntu.*
// @include        https://*askubuntu.*
// @include        http://*serverfault.*
// @include        https://*serverfault.*
// @include        http://*stackapps.*
// @include        https://*stackapps.*

// @downloadURL https://update.greasyfork.org/scripts/33589/ShadeRoot%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/33589/ShadeRoot%20StackOverflow.meta.js
// ==/UserScript==

function ShadeRootSO(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootSO(
	// BG 1
	'html, .container, body, #content {background: #1d1b19 !important;}'
	+
	'.s-footer {background-color: #181716 !important; background-image: none !important;}'
	+
	// TEXT 1
	'body, .label-key b, .label-key strong, h1, h2, h3, h4, h5, h6, strong, small, pre, code, select, option, li, .nav a, .number, .badge1-alternate .-total, .badge2-alternate .-total, .badge3-alternate .-total, .badge-how-to .-total, .subtabs a.youarehere, .filter a.youarehere, .subtabs a.active, .filter a.active, .subtabs a:hover, .filter a:hover, .reputation-score, .badgecount, .-number, .-subtitle, .g-col, .ai-center, .name, .votes-cast-stats th, .desc, .answer-votes, .room-tab-description, .user-tab-description, .room-description, #transcript-body .signature, #conversation-body .signature, .msplab, #copyright, .msg-small {color: #bcb8b0 !important;}'
	+
	'.user-show-new #user-tab-answers .answer-votes, .user-show-new .post-container .vote, .user-show-new .user-panel .mini-counts, .user-show-new .user-rep .rep-amount .rep-down, .user-show-new .user-rep .rep-amount .rep-up {color: #f6ecce !important; border: 1px solid #474747 !important;}'
	+
	// TEXT 2
	'p, .stats-row, .stats-row a, .stats-row a:visited, .item-multiplier-count, .summarycount, .al, b {color: #908F89 !important;}'
	+
	'.question-hyperlink, .answer-hyperlink, .excerpt, .user-card-name, .signature, .flair {color: #aea691 !important;}'
	+
	// LINK 1
	'.question-hyperlink:hover, .answer-hyperlink:hover, .question-hyperlink:active, .answer-hyperlink:active, .-link {color: #e3e0d0 !important;}'
	+
	'.wmd-button-bar {border: 1px solid #605d4e !important;}'
	+
	'input[type="text"], input[type="password"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="datetime"], input[type="datetime-local"], input[type="date"], textarea, select {color: #e4dfd4 !important; background: #171614 !important; border: 1px solid #5f5a4c !important;}'
	+
	'blockquote {background-color: #383735 !important;}'
	+
	'.owner {background-image: none !important; background-color: #302e29 !important; border: 1px dotted #68655f !important;}'
	+
	'.post-tag, .geo-tag, .container .chosen-choices .search-choice, .container .chosen-container-multi .chosen-choices li.search-choice {color: #95B7C3 !important; background-color: #393530 !important;}'
	+
	'.post-tag:hover, .meta {color: #a2c4d1 !important; background-color: #1b1917 !important;}'
	+
	'.wmd-preview, .topbar-dialog, .usercard-xxl, .roomcard-xxl {border-color: #5e6266 !important;}'
	+
	'.show-votes .sidebar-linked .spacer > a:first-child .answer-votes.answered-accepted, .show-votes .sidebar-related .spacer > a:first-child .answer-votes.answered-accepted, .user-show-new #user-tab-answers .answer-votes.accepted, .user-show-new .post-container .vote.accepted, .user-show-new .user-panel .mini-counts.accepted, .user-show-new .user-rep .rep-amount .rep-down.accepted, .user-show-new .user-rep .rep-amount .rep-up.accepted, .user-show-new #user-tab-answers .answer-votes.answered-accepted, .user-show-new .post-container .vote.answered-accepted, .user-show-new .user-panel .mini-counts.answered-accepted, .user-show-new .user-rep .rep-amount .rep-down.answered-accepted, .user-show-new .user-rep .rep-amount .rep-up.answered-accepted, .user-show-new #user-tab-answers .answer-votes.special-rep, .user-show-new .post-container .vote.special-rep, .user-show-new .user-panel .mini-counts.special-rep, .user-show-new .user-rep .rep-amount .rep-down.special-rep, .user-show-new .user-rep .rep-amount .rep-up.special-rep {color: #bee78c !important; background-color: #36560e !important;}'
	+
	'.answered-accepted {border: 1px solid #5e9637 !important;}'
	+
	'.user-details a, .badge, li a, h1 a {color: #2f93f5 !important;}'
	+
	'.show-votes .sidebar-linked .spacer > a:first-child .answer-votes, .show-votes .sidebar-related .spacer > a:first-child .answer-votes {background-color: #525457 !important; color: #d3dae1 !important;}'
	+
	'.favicon, img, svg, img[title="subscribe.svg"] {opacity: .9; filter: brightness(.92) !important;}'
	+
	'.nav li.youarehere a, .nav a:hover {color: #9c2424 !important;}'
	+
	'.tag-cell, .rep-table-row > td, .room-header, .user-header, .question-summary, #question-header {border-bottom: 1px dotted #57564F !important;}'
	+
	'.page-numbers {border: 1px solid #605f53 !important;}'
	+
	'.page-numbers:hover {color: #D8D3C1 !important; background-color: #555f65 !important;}'
	+
	'.incomplete {color: #C8D4E1 !important; background: #36302c !important; border: 1px solid #7b490d !important;}'
	+
	'.user-card-name {background: #808080 !important; border-top: 1px dotted #3f3f3f !important; border-bottom: 1px dotted #3f3f3f !important;}'
	+
	'.avatar-card {border: 1px solid #63615a !important; box-shadow: inset 0 130px 0 #212121 !important;}'
	+
	'.badge3-alternate, .-badge {background-color: #302c29; border-color: #786c60;}'
	+
	'.roomcard, .usercard, .frozen-room, .room-mini {background-color: #1a1716 !important; border-color: #544c44 !important; box-shadow: 0px 1px 3px #17140d !important;}'
	+
	'.rep-and-badges::before {background: linear-gradient(270deg, #3B3B3B, rgba(47, 47, 47, 0)) !important;}'
	+
	'.rep-and-badges {background-color: #3e3b3b !important;}'
	+ 
	'.badgecount {padding-right: .2em !important;}'
	+
	'.-card {background-color: #383838 !important; border: 1px solid #57564e !important;}'
	+
	'.subheader, .question-summary, .answer, .comment > td, .title-section {border-bottom: 1px solid #575650 !important;}'
	+
	'.-values .-item {color: #3C3A34 !important; font-size: .9em !important;}'
	+
	'.-label {color: #413F3C !important;}'
	+
	'.history-table > tbody > tr, .comments, #add-login-page .or-hr, #login-page .or-hr, #signup-page .or-hrn, .b2b-footer, .listResults, .badge-hierarchy, .single-badge-row-question {border-top: 1px solid #505050 !important;}'
	+
	'.badge1-alternate, .badge2-alternate, .badge-how-to {background-color: #33322e !important; border-color: #7b7668 !important;}'
	+
	'.badge-tag {color: #8696a5 !important; background-color: #181a1b !important; border-color: #514f49 !important;}'
	+
	'.-progress .-label {color: #DED6CB !important;}'
	+
	'.answered-accepted {background-color: #222913 !important;}'
	+
	'.answer-summary {border-bottom: 1px solid #47484a !important;}'
	+
	'.user-show-new .user-rep-chart-summary .user-rep-chart-summary-tooltip:hover {background-color: #525559 !important;}'
	+
	'.user-rep-chart-summary-bar {background-color: #2f7747 !important;}'
	+
	'.user-rep-chart-summary, #top-section {border-bottom: 1px solid #363a3e !important;}'
	+
	'.newuser {background-color: #2D2C27 !important;}'
	+
	'.grippie {border: 1px solid #3f3f3f !important; background-color: #3f3f3f !important;}'
	+
	'.mdhelp {background-color: #35322e !important;}'
	+
	'.mdhelp-tabs {background-color: #2d2a23 !important;}'
	+
	'.tag-editor {border: 1px solid #272a2d !important; background-color: #383535 !important;}'
	+
	'.wmd-help-button.active-help {background-color: #1d1b19 !important;}'
	+
	'pre, code, .spaces {background-color: #2e2f30 !important;}'
	+
	'.hi {background-color: #1d1c19 !important;}'
	+
	'kbd {color: #dad6bc !important; text-shadow: 0 1px 0 #302F2E !important; background-color: #27292a !important; border: 1px solid #212c38 !important; box-shadow: 0 1px 0 rgba(12,13,14,0.2),0 0 0 2px #68211C inset !important;}'
	+
	'.expanded {background: #26292a !important;}'
	+
	'.col-section {border: solid 1px #4E4B45 !important;}'
	+
	'.preferred-login, .new-login-right .form-item {background: #353131 !important; border: 1px solid #534e4e !important; box-shadow: -1px 1px #0b2024 !important; color: #c0cfdd !important;}'
	+
	'.topbar .topbar-icon-on, .topbar .topbar-icon-on:hover {background-color: #4a5460 !important;}'
	+
	'.topbar .icon-help.topbar-icon-on {color: rgba(198, 219, 240, 1) !important;}'
	+
	'.topbar-dialog {color: #bdcad7 !important; background-color: #424344 !important; box-shadow: 0 2px 2px rgba(12,13,14,0.2) !important;}'
	+
	'.item-summary {color: #c8d3de !important;}'
	+
	'.topbar-dialog a {color: #2d9ae9 !important;}'
	+
	'.modal-content li {border-bottom: 1px solid #6e859c !important;}'
	+
	'.modal-content li:hover {background-color: #1e262a !important;}'
	+
	'.new-about-content-page h2.about-title {text-shadow: 0 1px 0 #112F42 !important; background: #858a8d !important;}'
	+
	'.new-about-content-page hr {background-color: #393a3b !important; box-shadow: 0 1px #383535 !important;}'
	+
	'.about-page .new-about-content-page .content-block, .about-page .new-about-content-page .qa-block {background: #30302E !important; border: 1px solid #504c3f !important;}'
	+
	'.user-info-rep {background: #393834 !important; border: 1px solid #514f45 !important;}'
	+
	'.user-details, #sidebar, .ob-post-title a {color: #bfd1e3 !important;}'
	+
	'.header {background-color: #2a2d30 !important;}'
	+
	'.siteSwitcher-dialog .current-site li {background: #373a3c !important;}'
	+
	'#footer {background: #232526 !important;}'
	+
	'.outside #container {background: #33322f !important;}'
	+
	'.nav li {background: #262222 !important;}'
	+
	'.subtabs a {border: 1px solid #726e66 !important;}'
	+
	'.subheader #tabs a.youarehere {background: #24211e !important; border-bottom-color: #3b3329 !important; color: #cfcdbd !important;}'
	+
	'.messages {background-color: #442e1e !important; color: #dad7c9 !important;}'
	+
	'.timestamp, .ob-wikipedia, .ob-amazon, .ob-gist, .ob-message, .ob-lpadbug, .ob-manpage, .ob-blog, .ob-exception, .ob-anime, .ob-github, .ob-post-tag, .tag {background-color: #2a2825 !important; color: #dddacf !important;}'
	+
	'.system-message {text-shadow: 1px 1px 1px #e6dfc2, -1px 1px 1px #e6dfc2, 1px -1px 1px #e6dfc2, -1px -1px 1px #e6dfc2;;}'
	+
	'#loading {background: rgba(26, 29, 30, 0.9) !important;}'
	+
	'#loading-message {background-color: #292824 !important; box-shadow: 0 1px 15px #0f0f0c !important;}'
	+
	'#input-area {background: #2a2925 !important;}'
	+
	'#starred-posts > div > ul > li {border-bottom: 1px dotted #5a5757 !important;}'
	+
	'.popup, #main.message-admin-mode .message-controls, #conversation-sel {border: 1px solid #3f3e39 !important; background: rgb(36, 35, 32) !important; box-shadow: 0 1px 15px #1a1917 !important;}'
	+
	'.ob-post {background-color: #292222 !important; color: #e4e0d4 !important;}'
	+
	'.ob-post-votes {background-color: #1b1813 !important; color: #dbd6c6 !important;}'
	+
	'#sidebar-menu, #present-users, ul#my-rooms {border-bottom: 1px dotted #62605b !important;}'
	+
	'div.message.reply-parent, div.message.reply-child {background-color: #29261b !important;}'
	+
	'.notification, #feed-ticker {background: rgb(39, 33, 33) !important; box-shadow: 0 1px 10px #1a1515 !important;}'
	+
	'.subheader #tabs a, .subheader #tabs .disabled {border: 1px solid #564e45 !important; color: #cbc6ba !important;}'
	+
	'.subheader #tabs a:hover {background: #625544 !important;}'
	+
	'.messages .content {color: #D4D1C0 !important;}'
	+
	'.ob-post-title a {color: #ccc6ba !important;}'
	+
	'.last-dates, .usercard-xxl, .roomcard-xxl {color: #BD3B2C !important;}'
	+
	'#roomtitle {text-shadow: 0px 1px 0px #412f10 !important;}'
	+
	'.so-header {background-color: #3b3938 !important;}'
	+
	'.-link {color: #e3ddd0 !important;}'
	+
	'.so-header .navigation .-link:hover, .so-header .navigation .-link:focus {background-color: #4e4c45 !important;}'
	+
	'.f-input, textarea.f-input, input.f-input[type="text"], input.f-input[type="password"], input.f-input[type="number"], input.f-input[type="email"], input.f-input[type="url"], input.f-input[type="search"], input.f-input[type="tel"], input.f-input[type="datetime"] {border: 1px solid #5d6165 !important; background-color: #212629 !important;}'
	+
	'.f-input:focus, textarea.f-input:focus, input.f-input[type="text"]:focus, input.f-input[type="password"]:focus, input.f-input[type="number"]:focus, input.f-input[type="email"]:focus, input.f-input[type="url"]:focus, input.f-input[type="search"]:focus, input.f-input[type="tel"]:focus, input.f-input[type="datetime"]:focus {box-shadow: inset 0 0 4px #14171a,0 0 5px rgb(20, 31, 39) !important; color: #D7D2C0 !important;}'
	+
	'.-fill {color: #c5cdd4 !important; background-color: #3f3f3f !important;}'
	+
	'.so-header .secondary-nav .-item._active, .so-header .secondary-nav .-item .-link.topbar-icon-on, .so-header .secondary-nav .-item .-link:hover {color: #bcd0e4 !important; background-color: #26292d !important;}'
	+
	'.s-hero {color: #D7D4CE !important; background-color: #06264b !important; background-image: linear-gradient(to right, #113671 0, #062F50 100%) !important;}'
	+
	'#tabs a, .tabs a, .newnav .tabs-list-container .tabs-list .intellitab a {background-color: #1D1811 !important;}'
	+
	'._darken {background-image: linear-gradient(to right, #072759 0, #05253f 100%) !important;}'
	+
	'.usercard-xxl, .roomcard-xxl {background: #171511 !important; box-shadow: 0px 1px 3px #181414 !important;}'
	+
	'.activity-stats .button {border: 1px solid #c47b07 !important; background-color: #874d08 !important; background: -webkit-gradient(linear,left top,left bottom,from(#fba00c),to(#f67c16)) !important; background: -moz-linear-gradient(top,#a26706,#753806) !important;}'
	+
	'input.btn-outlined.white[type="submit"], input.btn-outlined.white[type="button"], button.btn-outlined.white, .btn-outlined.white, input.btn-outlined.-white[type="submit"], input.btn-outlined.-white[type="button"], button.btn-outlined.-white, .btn-outlined.-white {color: #D8D3C4 !important; border-color: #7E776D !important;}'
	+
	'.question-page .container, .user-page .container {box-shadow: #27292A 0 120px 0 inset !important;}'
	+
	'.s-footer .-title a {color: #c9d9e4 !important;}'
	+
	'#hlogo a, .s-footer .-title a:hover {color: #D5E8ED !important;}'
	+
	'#hmenus .nav li {background: none !important;}'
	+
	'.envelope-on, .envelope-off, .vote-up-off, .vote-up-on, .vote-down-off, .vote-down-on, .star-on, .star-off, .comment-up-off, .comment-up-on, .comment-flag, .comment-flag-off, .comment-flag-on, .edited-yes, .feed-icon, .vote-accepted-off, .vote-accepted-on, .vote-accepted-bounty, .badge-earned-check, .delete-tag, .grippie, .expander-arrow-hide, .expander-arrow-show, .expander-arrow-small-hide, .expander-arrow-small-show, .anonymous-gravatar, .badge1, .badge2, .badge3 {filter: brightness(.8) !important;}'
	+
	'.post-tag {border-color: #616365 !important;}'
	+
	'.post-tag, .faviconBox {border-color: #156f90 !important;}'
	+
	'.search-container input[type="text"] {box-shadow: inset 0 1px 2px #1a232c,0 0 0 #0E354B !important;}'
	+
	'.answer blockquote {border-left: 2px solid #93812e !important;}'
	+
	'.post-text hr, .wmd-preview hr {background-color: #3d4145 !important;}'
	+
	'.bottom-notice {background-color: #2C2B29 !important; border: 1px solid #44423c !important;}'
	+
	'.badges-wrapper {border-right: 1px solid #3E4042 !important;}'
	+
	'.askquestion ul li a, .askquestion ul li.youarehere a {background-color: #45433d !important; text-shadow: 0 1px 0 rgb(41, 35, 35) !important;}'
	+
	'.welovestackoverflow, .hero-box {border: 2px solid #4d5156 !important;}'
	+
	'.community-bulletin, .user-about-me {background-color: #33322E !important; border: 1px solid #5C5A4B !important;}'
	+
	'.s-footer, .placeholder, .salary-changelog {border-top: 1px solid #302E2E !important;}'
	+
	'.-tag-group, .dateNavBox {background-color: #141312 !important;}'
	+
	'.reputation, .top-answer-container {color: #d7d6c1 !important;}'
	+
	'.post-container, .top-question-container, .top-answer-container, .post-container {border-bottom: 1px solid #373a3c !important;}'
	+
	'.user-page h1 a, .user-page .subheader a {color: #cdd9e4 !important;}'
	+
	'#content {border-top: 1px solid #4b4b49 !important;}'
	+
	'.navMain li a, .heading, .module h3, .subheader h1, .top-question-score-number, .top-answer-score {color: #ccd9f2 !important;}'
	+
	'.navMain li a:hover, .top-question-site-link a, .top-answer-site-link a {color: #366FB3 !important;}'
	+
	'.league-container {border-bottom: 1px solid #474643 !important; box-shadow: 0 1px 0 #45443c !important;}'
	+
	'.newuser, .dateNavBox {border: 1px solid #48473E !important; box-shadow: 0 1px 1px rgba(0,0,0,0.1),0 1px 0 #4b4a46 inset !important;}'
	+
	'.sidebar-stats td, .sidebar-stats th {border-bottom: 1px solid #4A4947; border-right: 1px solid #42413E;}'
	+
	'.module, .tabs a, .salary-value {color: #dbdad3 !important;}'
	+
	'.col-content .-label {color: #2096CE !important;}'
	+
	'.top-bar {background-color: #393731 !important;}'
	+
	'.pun, .pln {color: #a8a59c !important;}'
	+
	'.kwd, .dec {color: #669dbc !important;}'
	+
	'.str, .lit, .tag, #switch {color: #D23B3B !important;}'
	+
	'.page-numbers {color: #e7e4d4 !important; background: linear-gradient(to bottom, #2a281b, #353023) !important; text-shadow: 0 1px 0 #4d4a42 !important;}'
	+
	'.page-numbers.current {color: #e3deca !important; background: linear-gradient(to bottom, #8c1e1f, #b92527) !important; box-shadow: 0 2px 3px rgba(0,0,0,0.4) inset,0 1px 0 #382c2c !important;}'
	+
	'.page-numbers:hover {background: #151412 !important;}'
	+
	'.page-numbers:active {background: linear-gradient(to bottom, #692a20, #451b0f) !important; box-shadow: 0 2px 2px rgba(0,0,0,0.3) inset,0 1px 0 #260f0c !important;}'
	+
	'a[href="https://superuser.com"], a[href="https://workplace.stackexchange.com"], a[href="https://stackoverflow.com"], .top-bar .-logo .-img, .s-widget-toreplace .-body .-item .-col img, .b2b-hero-logo, img.logo-so-color, img[alt="so-logo"], img[alt="Stack Overflow"], svg[aria-label="Stack Overflow Logo"], a[href="https://stackexchange.com"] h1, a[href="https://puzzling.stackexchange.com"], a[href="https://mathoverflow.net"], a[href="https://electronics.stackexchange.com"], a[href="https://serverfault.com"], a[href="https://apple.stackexchange.com"], a[href="https://webapps.stackexchange.com"], a[href="https://codereview.stackexchange.com"] {filter: brightness(8) !important; opacity: .85 !important;}'
	+
	'a[href="https://math.stackexchange.com"], a[href="https://mathematica.stackexchange.com"], a[href="https://skeptics.stackexchange.com"], a[href="https://movies.stackexchange.com"], a[href="https://stackapps.com"] {background-color: #727270 !important;}'
	+
	'.m-post-card--no-featured-thumbnail {background-color: #2D2C29 !important;}'
	+
	'.container #hmenus .nav ul li.youarehere a, .container #hmenus .nav ul li a:hover {background-color: #086680 !important; color: #EDD !important;}'
	+
	'#hmenus .nav ul li a, #add-login-page #or, #login-page #or, #signup-page #or {background-color: #094c5d !important;}'
	+
	'#header::before, .s-footer .-container::before, .s-footer .-container::after {display: none !important;}'
	+
	'.container #hmenus .nav ul li.youarehere a, .container #hmenus .nav ul li a:hover, #hmenus .nav ul li a {padding: .25em !important;}'
	+
	'.help-category-box h3, .s-press .-item, .-body .-item, .callouts-section-bar, .three-x-post-block {border-bottom: 1px solid #42403a !important;}'
	+
	'input[type="submit"], input[type="button"], button, .button, a.button, a.button:visited, .btn, .hero-box.double-panel .panel.white .btn {background-color: #6c281e !important; color: #D7CFC0 !important;}'
	+
	'#add-login-page #formContainer, #login-page #formContainer, #signup-page #formContainer, #add-login-page #switch, #login-page #switch, #signup-page #switch {border: 1px solid #4e4b41 !important; background: #2D2C28 !important;}'
	+
	'input.btn-secondary[type="submit"], input.btn-secondary[type="button"], button.btn-secondary, .btn-secondary, .privacy-switch-btn {color: #84b5d8 !important; background-color: #36352F !important; border-color: #2f516b !important; box-shadow: inset 0 1px 0 #252627 !important;}'
	+
	'input.btn-outlined[type="submit"]:hover, input.btn-outlined[type="button"]:hover, button.btn-outlined:hover, .btn-outlined:hover, input.btn-outlined[type="submit"]:focus, input.btn-outlined[type="button"]:focus, button.btn-outlined:focus, .btn-outlined:focus {color: #b6d1e4 !important; background-color: #484742 !important;}'
	+
	'.s-widget-toreplace, #action-bar {border: 1px solid #23507d !important;}'
	+
	'.s-timeline .-event::before {border: 4px solid #1F62A4 !important; background: #E69A5D !important;}'
	+
	'.s-timeline::after, .secondary-nav .-item .-link:hover {background: #1e4f80 !important;}'
	+
	'.divided-grid .-item {border-bottom: 1px solid #27496b !important; border-right: 1px solid #22486e !important;}'
	+
	'.top-bar .navigation .-link:hover, .top-bar .navigation .-link:focus {background-color: #68655b !important;}'
	+
	'#tabs a.youarehere:hover, .tabs a.youarehere:hover, .newnav .tabs-list-container .tabs-list .intellitab a.youarehere:hover, .-department {border-bottom-color: #423A3A !important;}'
	+
	'#tabs a.youarehere, .tabs a.youarehere, .newnav .tabs-list-container .tabs-list .intellitab a.youarehere, .salary-cta:hover, .salary-cta:focus, .salary-cta:active {border-color: #44474a !important;}'
	+
	'.s-press .-item .-logo {border: 1px solid #225486 !important;}'
	+
	'.s-widget-toreplace .-header {background: #3c3c38 !important; border-bottom: 1px solid #393834 !important;}'
	+
	'.salary-calculator-calculator, .salary-results, .salary-share, .modal-content, #post-job {background: #232426 !important; border: 1px solid #3E3C36 !important;}'
	+
	'.salary-share .-label, .nav-link, .m-post-card__title a {color: #C0B7AA !important;}'
	+
	'.top-bar .secondary-nav .-item .-link.topbar-icon-on, .map-graphic, .section-three, .section-two, .section-one, .section-four {background-color: #202830 !important;}'
	+
	'.b2b-hero-intro, .b2b-hero-card-headline, .home-hero-copy, .b2b-hero h2, .b2b-hero-cards-link-wrapper {color: #B0AC9D !important;}'
	+
	'.b2b-hero {background-image: none !important; background-color: #171512 !important;}'
	+
	'.b2b-hero-callout-2-supporting h1, #hs_cos_wrapper_B2B-SO-Hero p {color: #B0AC9D !important;}'
	+
	'.region-link {border: 1px solid #534219 !important;}'
	+
	'.site-header.default {background: #32302B !important;}'
	+
	'.w-control {background-color: #1b1e20 !important;}'
	+
	'.callouts-section-item .text, #job-detail .job-detail-header .-description .-title a, #job-detail .job-detail-header .-description .-title a:hover, .-company .-name a {color: #a9bed4 !important;}'
	+
	'#platform-meganav {background: #2a2925 !important;}'
	+
	'.platform-option:first-child {border-right: 1px solid #68541b !important;}'
	+
	'.platform-option p a, .m-author__name {color: #e37d19 !important;}'
	+
	'.recruiting-guide-list-content {background: #1b1e20 !important;}'
	+
	'.recruiting-guide-list-item-content {background: #272420 !important;}'
	+
	'.recruiting-guide-list-item {border-bottom: 4px solid #c38426 !important;}'
	+
	'.recruiting-guide-list-item:hover {border-bottom: 4px solid #f05912 !important;}'
	+
	'.custom-footer-wrapper {border-top: 1px solid #7b6328 !important; background-color: #151411 !important; color: #ded6c4 !important;}'
	+
	'.blog-sidebar-section-subscribe {background: #1b2b38 !important;}'
	+
	'.sidebar-section {border-bottom: 1px solid #24221c !important;}'
	+
	'.blog-post-list-item {border-bottom: 1px solid #423d34 !important;}'
	+
	'.permalink, .widget-module ul li a {color: #c95a27 !important;}'
	+
	'img[alt="how i hire"], img[alt="developer interview"], img[alt="ask a developer"], img[alt="how to find a developer"] {background: #555 !important;}'
	+
	'.main-navigation {background: #2F2A19 !important; border-top: 1px solid #35250A !important; border-bottom: 1px solid #362508 !important;}'
	+
	'.primary-navigation a {color: #b9b7b0 !important;}'
	+
	'.m-tag-list__link {background: #352113 !important;}'
	+
	'.twitter-row {background-color: #24201C !important; fill: #24201C !important;}'
	+
	'.m-tweet-card, .-tabs {border: 1px solid #535049 !important;}'
	+
	'.m-footer-cta__title {color: #2d2222 !important;}'
	+
	'.search-form .job-alert-tooltip::after {border-top: 7px solid #4a433c !important;}'
	+
	'.job-alert-tooltip {background-color: #2d2a26 !important;}'
	+
	'.icon-advanced-search {border-color: #18476e !important;}'
	+
	'.-item._highlighted {background: #2a251b !important;}'
	+
	'.-item.-job, #job-detail section, .-tabs {border-bottom: 1px solid #404347 !important;}'
	+
	'.-item._highlighted._topspot > span._badge {background: #7e5c0b !important; color: #ded7ba !important;}'
	+
	'.pagination a:visited, .pagination > a {border: 1px solid #3d4854 !important;}'
	+
	'.-popout {background-color: #2f3439 !important; border: solid 1px #304d5f !important;}'
	+
	'.company-module > header > h2 {background: #393942 !important;}'
	+
	'.company-module {border: 1px solid #344d66 !important;}'
	+
	'.-details strong span {background: #0d3654 !important;}'
	+
	'.-details strong::before, .-favorite, .dropdown li:first-child {border-top: 1px solid #164574 !important;}'
	+
	'.job-alert-tooltip .text {color: #e1a030 !important;}'
	+
	'.-job-badges .-badge, .dropdown li {border: 1px solid #0f447a !important; color: #a0b8d1 !important; background-color: #11314b !important;}'
	+
	'.job-cover-image.-no-image {background-color: #282a2d !important;}'
	+
	'#job-detail, .detail-company-logo {background-color: #1a1816 !important;}'
	+
	'.-share-report .-item:hover {background-color: #2c3438 !important; border-right: 1px solid #245b93 !important;}'
	+
	'.dropdown {background-color: #363D41 !important;}'
	+
	'.-description .-title a:hover, .sidebar #action-bar .-share-report .-item .mail, .sidebar #action-bar .-share-report .-item .report, .sidebar #action-bar .-share-report .-item .share {color: #c6dae0 !important;}'
	+
	'#job-detail .apply, .question-container {border-bottom: 1px solid #282b2f !important;}'
	+
	'.job-detail-content .-sticky-tabs {background: #292824 !important;}'
	+
	'.-share-report {border-top: 1px solid #2c3945 !important;}'
	+
	'.-share-report .-item {border-right: 1px solid #2b3e51 !important;}'
	+
	'.company-module footer {background: rgba(50, 53, 57, 0.5) !important;}'
	+
	'#action-bar .-title {background: #3f3e3a !important; border-bottom: 1px solid #363532 !important;}'
	+
	'.dropdown-menu::after, #job-detail .-more-jobs .-company-alert, #job-detail .-similar-jobs .-company-alert, #question-header h1 {border-bottom-color: #413f35 !important;}'
	+
	'.dropdown-menu {background-color: #172029 !important;}'
	+
	'.dropdown-menu > li > a {background: #206c95 !important;}'
	+
	'.row-fluid {background: none !important;}'
	+
	'.title-banner, .header-img {background-color: #323c44 !important;}'
	+
	'.input-group > label, .f-label, .salary-calc-inputs span, .-name, .collection .-content, .benefit-desciption {color: #D0DDE3 !important;}'
	+
	'.search-form input[type="number"]::placeholder, .search-form input[type="text"]::placeholder, .search-form select::placeholder {color: rgba(206, 224, 231, 0.5) !important;}'
	+
	'#dr, #tl {min-height: 16em !important;}'
	+
	'.salary-calc-inputs {background-color: #105184 !important;}'
	+
	'.salary-survey-sidebar, .salary-results-wrapper {background: #1f2326 !important; border: 1px solid #414f5d !important;}'
	+
	'.collection {border: 1px solid #596b7e !important;}'
	+
	'.inline-survey-cta {background-color: #333b44 !important; color: #b2c6da !important;}'
	+
	'.salary-results-wrapper .line, .ad502-room {border: 1px solid #1a1f24 !important;}'
	+
	'.-item.social {border: 1px solid #3f71a4 !important;}'
	+
	'.-item.social:hover, .share {background-color: #1c3e65 !important; color: #AED6DD !important;}'
	+
	'#question-header {border: 1px solid #d2cabb00 !important;}'
	+
	'.answer-help-background, .comment-help {background-color: #323029 !important; border: 1px solid #504E45 !important;}'
	+
	'.ad502-room {background: #3b3930 !important; box-shadow: 0 1px 3px #14191e !important;}'
	+
	'#add-login-page .or-hr, #login-page .or-hr, #signup-page .or-hr {border-top: 1px solid #174d6b !important;}'
	+
	'#add-login-page .openid_small_btn, #login-page .openid_small_btn, #signup-page .openid_small_btn {border: 2px solid #92273e !important;}'
	+
	'.val-info {background: #2F2D25 !important; border: 2px solid #907818 !important;}'
	+
	'.val-success {background: #27321e !important; border: 2px solid #3c681e !important;}'
	+
	'.val-error {background: #32211e !important; border: 2px solid #68231e !important;}'
	+
	'.module h4 a, .room-mini, .footerwrap a {color: #e7e7d4 !important;}'
	+
	'.mini-counts span {color: #bad5e7 !important;}'
	+
	'.mini-counts, .-rep, .js-header-rep {color: #77b6f5 !important;}'
	+
	'#new-answer-activity, .new-post-activity, .hero-box {background-color: #101112 !important;}'
	+
	'.unread-item {background-color: #1C2427 !important;}'
	+
	'.openid_large_btn, .featured-site {border: 2px solid #0F71C5 !important; box-shadow: 2px 2px 4px #1d6eb3 !important;}'
	+
	'.question-page #answers .answer, #feedBody {background: #1D1B19 !important;}'
	+
	'.top-bar .my-profile:hover {background-color: #212529 !important;}'
	+
	'.question-container {box-shadow: 0 1px 0 #5d6368 !important;}'
	+
	'.hero-box .column, .site-details, .stats-label {color: #c4d8e7 !important;}'
	+
	'.question-status {background-color: #322f2a !important;}'
	+
	'input[type="submit"], input[type="button"], button, .button, a.button, a.button:visited, .btn, .hero-box.double-panel .panel.white .btn {border-color: #2d2c25 !important; box-shadow: inset 0 1px 0 #29241b !important; background: -moz-linear-gradient(top, #4D4B44, #322929);}'
	+
	'#feedBody {border: 1px solid black;}'
	+
	'#hot-network-questions a, #feedSubscribeLine label {color: #C0BCA8 !important;}'
	+
	'.messages {border: 1px solid #483f3f !important;}'
	+
	'.highlight {background-image: linear-gradient(to bottom, rgb(51, 48, 46) 0%,rgb(15, 13, 9) 100%) !important;}'
	+
	'.container {box-shadow: #1B1E20 0 120px 0 inset !important;}'
	+
	'.question .postcell {background: rgba(0,0,0,0) !important;}'
	+
	'.question-hyperlink {text-shadow: 0 1px 0 rgba(77, 54, 54, 0.9) !important;}'
	+
	'#feedHeaderContainer, #feedHeader {background-color: #3b3934 !important;}'
	+
	'#feedEntryContent h1, #feedTitleContainer h1 {border-bottom: 1px solid #454340 !important;}'
	+
	'.question-link:visited {color: #1855BF !important;}'
	+
	'a.post-tag::before, span.post-tag::before {background-color: rgba(0,0,0,0) !important; border-color: rgba(0,0,0,0) !important;}'
	+
	'#question-header, #mainbar, #sidebar, #mainbar-full, .mainbar-full, #sidebar .module {background: #1d1b19 !important;}'
	+
	'#sidebar .module {border-bottom: 10px solid #351313 !important;}'
	+
	'.-container {background: #232526 !important;}'
	+
	'#content {border: 5px solid #1d1b19 !important;}'
	+
	'#hmenus .nav ul li a, .stats-label, .stats-value {border-bottom: 1px solid rgba(90, 63, 63, 0.9) !important;}'
	+
	'.question-link {color: #387AED !important;}'
	+
	'.gv-item, .category-culturerecreation, .gv-size-medium, .gv-item-shadow, .gv-item-triangle {background-color: rgb(56, 50, 43) !important; border-color: rgb(56, 51, 46) !important;}'
	+
	'.lv-info, .lv-stats-wrapper {background: #383131 !important;}'
	+
	'.lv-stats-box .number {background: #21201B !important;}'
	+
	'.list-view-container a {color: #2F88F2 !important;}'
	+
	'.list-view-container a:visited {color: #408AC0 !important;}'
	+
	'.lv-item {border-bottom: 1px solid #36352C !important; box-shadow: 0 1px 0 #231c1c !important;}'
	+
	'.nav-global {background: #3c2d2d !important;}'
	+
	'.nav-global li a {color: #ccd4dd !important;}'
	+
	'#hero-content {border: 3px #121212 solid !important;}'
	+
	'#herobox {border: 1px #121212 solid !important;}'
	+
	'.logo-small {background: #1d1b19 !important;}'
);