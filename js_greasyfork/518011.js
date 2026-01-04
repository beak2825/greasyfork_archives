// ==UserScript==
// @name Strava Darkest Fusion [Updated for Sauce + Elevate Users]
// @namespace https://github.com/Nick2bad4u/UserStyles
// @version 6.8
// @description Updated Dark Mode for Strava for users who use Sauce for Strava.
// @author ATX (Updated by Nick2bad4u)
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.labs.strava.com/*
// @include /^(?:https:\/\/(?:www\.)?strava\.com.*)$/
// @downloadURL https://update.greasyfork.org/scripts/518011/Strava%20Darkest%20Fusion%20%5BUpdated%20for%20Sauce%20%2B%20Elevate%20Users%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/518011/Strava%20Darkest%20Fusion%20%5BUpdated%20for%20Sauce%20%2B%20Elevate%20Users%5D.meta.js
// ==/UserScript==

(function() {
let css = `
	#__next > header,
	#view > .header,
	#global-header,
	.footer-promos,
	section header,
	section .header,
	.section header,
	.section .header,
	section footer,
	section .footer,
	.section footer,
	.section .footer,
	#global-footer,
	[class*='KudosCommentsAndAchievementsModal-KudosCommentsAndAchievementsModal__footer'],
	[class^='Header_container__'],
	[class*='src--noBackground'] nav,
	.container-wrapper {
		background-color: #161616 !important;
	}

	.\\------packages-dashboard-ui-src-components-YourChallenges-ChallengeList-ChallengeList-module__challengeList--DgbGk
		.\\------packages-dashboard-ui-src-components-YourChallenges-ChallengeList-ChallengeList-module__challenge--jsQPr
		.\\------packages-dashboard-ui-src-components-YourChallenges-ChallengeList-ChallengeList-module__challengeTitle--Qigmq
		a {
		color: #fc5200;
		text-decoration: none;
	}

	.segments-list.ride {
		contain: content;
	}

	#activity_table,
	#sidebar .section {
		color: #000;
	}

	.onboarding-flow-wrap,
	body,
	.lightbox-window header,
	#basic-analysis #stacked-chart,
	.ride.segments-list tr.selected,
	.swim.segments-list tr.selected,
	.ride .segment-effort-detail .pr-comparison,
	.swim .segment-effort-detail .pr-comparison,
	.edit-personal-records tr.editable-row > td,
	ul.routes-list li.route-card .actions,
	.footer-global,
	[class*='Header--container--'],
	[class*='LandingPageV2--main-content-'],
	.glossary-header,
	[class*='LandingPage--middle-column'],
	[class^='logged-out-home-page-ui--main-'],
	body > div#__next header + div > div,
	body
		> div#__next
		header
		+ div
		> div
		div:not([class*='PrivacyToggle']),
	[class*='Comments--empty'],
	[class*='packages-ui-ModalWithTabs-styles-module__tabList'],
	[class^='Desktop_container__'],
	body > .view > .container.react-container,
	[class*='MapsPage_page']
		> [class*='styles_globalHeader_'],
	[class*='Desktop_middleColumn__'],
	[class*='src-components-Gallery-styles__page-body'],
	[class*='KudosCommentsAndAchievementsModal-module__footer'],
	#chart-container,
	#open-global-search-button,
	.src-Notifications-module__navBarButton--jeAZg {
		background-color: #1c1c1c !important;
	}

	.leaderboard .filters .option {
		background: #1c1c1c;
	}

	.flow-premium > .content-footer,
	.flow-container,
	#deny-or-accept-buttons,
	.search > .panel-default,
	.table > thead > tr > td.active,
	.table > tbody > tr > td.active,
	.table > tfoot > tr > td.active,
	.table > thead > tr > th.active,
	.table > tbody > tr > th.active,
	.table > tfoot > tr > th.active,
	.table > thead > tr.active > td,
	.table > tbody > tr.active > td,
	.table > tfoot > tr.active > td,
	.table > thead > tr.active > th,
	.table > tbody > tr.active > th,
	.table > tfoot > tr.active > th,
	#search-results.table .edit-col,
	.react-card-container
		> div
		> [class*='-feed-entry'],
	.activity-tags label:hover,
	[class*='ExpandableOptionList--'],
	[data-reach-dialog-content],
	.stats-container .table,
	[class*='ModalWithTabs--content'],
	.content > form.search[action],
	.segment-effort-detail,
	.segment-effort-detail .leaderboard-summary,
	#athlete-profile.card,
	.btn-white,
	.tab-contents > [data-sport],
	.tabbed-cards
		.tabs
		> li[aria-selected='true']
		.tab,
	#progress-goals + .card,
	.drop-down-menu .options,
	.drop-down-menu .options .opt-group.premium,
	.slide-menu .options .opt-group.premium,
	.view section.feature-section,
	.starred-segments thead > tr,
	.goal.card,
	.activity-summary-container,
	.pagenav li > a:hover,
	.pagenav,
	.dropdown-menu,
	#js-dashboard-athlete-goals > .card,
	.dense > thead > tr,
	#notifications-drop-down,
	.card:not(#js-dashboard-athlete-goals),
	#map-control-container
		.button:not(
			#toggle-fullscreen,
			#create-route,
			:hover
		),
	#map-control-container
		.drop-down-menu
		.selection,
	#basic-analysis .chart,
	.lightbox-window .tabs,
	.lightbox-window #tab-contents,
	[class*='SegmentDetailsSideBar--card--'],
	.pagination > .disabled > span,
	.pagination > .disabled > span:hover,
	.pagination > .disabled > span:focus,
	.pagination > li > a,
	.pagination > li > span,
	.leaderboard .leaderboards-upsell,
	.table-striped
		> tbody
		> tr:nth-of-type(2n):not(
			#activity_table > tbody > tr:nth-child(n)
		),
	.table-leaderboard th,
	.ride
		.segment-effort-detail
		.segment-leaderboard
		thead,
	.swim
		.segment-effort-detail
		.segment-leaderboard
		thead,
	#profile-heatmap-upsell,
	.invite-friends,
	ul.tabs > li.selected .tab,
	ul.tabs > li[aria-selected='true'] .tab,
	.edit-personal-records td.readonly-column,
	.edit-personal-records,
	.striped > li:nth-child(2n),
	.striped > div:nth-child(2n),
	.striped > tr:nth-child(2n),
	#settings-menu a:link,
	#settings-menu a:visited,
	#explorer .main-content #segments-sidebar,
	.page > .panel,
	#race-table > thead th,
	.year-calendar a:not(:hover),
	#search-results > thead > tr > th,
	._3Qs1zA618wFVYn1omT73_U,
	.g7N7fBojz_GFCESrdaxzf,
	._2wk2mpI6KzJRgwh0uUGnGU:hover
		.cQx-n1x8ZWjdIAziPar_Y,
	._2wk2mpI6KzJRgwh0uUGnGU:active
		.cQx-n1x8ZWjdIAziPar_Y,
	._2wk2mpI6KzJRgwh0uUGnGU:focus
		.cQx-n1x8ZWjdIAziPar_Y,
	.more-stats > table.unstyled tr > th,
	.more-stats > table.unstyled tr > td,
	.month-calendar.marginless th,
	.leaflet-popup-content-wrapper,
	.map-legends,
	.map-tooltip,
	.segment-info-box,
	.segment-info-box .records,
	ul.routes-list li.route-card,
	.slide-menu .options,
	[class^='EntryHeader--icon-container--'],
	#map_canvas,
	#contextual-health,
	#uploadFile form,
	[class*='Activity--card--'],
	.list-apps .app-card,
	.index-heading section .upsell,
	[class*='HeaderWithOwnerMetadata--icon-container--'],
	[class*='PromoEntry--card--'],
	[class*=' Card--'],
	[class*='LandingPage--main--'],
	.ui-dialog,
	.ui-dialog-titlebar,
	[role='dialog'] > [class^='Modal--content-'],
	#appUpsell,
	.glossary-body,
	[class^='src-components-NotificationsList-NotificationsList__notification-unread'],
	[class^='src-components-NotificationsList-NotificationsList__notifications'],
	#__next > header > div ul > li div li *,
	#__next
		> header
		> div
		nav
		> ul
		> li:not([class*='styles_navItem']),
	[class*='-packages-feed-ui-src-components-media-'],
	[class*='HeaderWithOwnerMetadata__icon-container'],
	.invite-friends
		+ .drop-down-menu
		> div:not(:hover),
	.my-segments > thead th,
	[class^='LimitedProfileEntry--content--'],
	[class*='packages-ui-ModalWithTabs-styles__tab-list'],
	[class*='-HeaderWithOwnerMetadata-module__avatar'],
	[class*='OwnerMetadata-module__iconContainer'],
	#elevation-profile,
	.leaflet-control-attribution,
	.mapboxgl-ctrl-scale,
	[class*='MoreActivities--more-activities'],
	.uploads .drop-down-menu.enabled > .selection,
	.uploads
		.drop-down-menu[class*='workout-type']
		> .selection,
	[class*='--packages-ui-Card-Card-module__card--nHcH9'],
	[class*='packages-ui-Button-styles-module__default'],
	[class*='-components-Footer-Footer']
		[class*='css'][class*='-control'],
	[class*='packages-ui-Select-Select-module']
		[class*='css'][class*='-control'],
	[class^='Footer_footer__'],
	[class*='-ui-Button-Button-module__default--jLxgA'],
	.seg-leaderboard-upsell,
	#roster thead th,
	[class*='styles_menuItems_'],
	[class*='styles_menuItems_'] [class*='styles'],
	[class*='-EmptyState-EmptyState-module__iconCircleContainer'],
	[class*='NotificationsList'],
	[class*='NotificationsList'] a,
	[class*='packages-shared-ui-src-challenges'],
	[class*='PromotedDoradoSection-styles__challenge-info'],
	.activity-summary-v2
		.activity-breakdown
		.cycling,
	[class*='SubscriptionValueProps-module__'],
	[class*='ModalWithTabs--tabList'],
	[class*='styles_navItem']
		> a[class*='Button_default_'],
	[class*='Leaderboard--privacy-section'],
	[class*='LeaderboardsTable--paywall-banner'],
	[class*='DropdownSelect']
		> .react-select__control,
	[id*='listbox'][class*='react-select__menu'] {
		background-color: #2c2c2c !important;
	}

	.feed-pagination.pagination {
		background-image: linear-gradient(
			#2c2c2c,
			#0000
		) !important;
	}

	.description-overflow:not(.expand-description)
		.description-container::after {
		background-image: linear-gradient(
			rgb(0 0 0 / 0%),
			#1c1c1c
		) !important;
	}

	.btn-accept-cookie-banner,
	.table-sortable > thead button:hover,
	.panel-footer,
	input:not([type='range'], [role='combobox']),
	textarea,
	.textarea-clone,
	[class*='ModalWithTabs--tab-list'],
	[class*='KudosCommentsAndAchievementsModal--footer'],
	[class*='Button--default--'],
	[class*='Button--default--']:link,
	[class*='Button--default--']:visited,
	[class*='AchievementCelebration--achievement-celebration'],
	.activity-indicator,
	.drop-down-menu .options a:hover,
	.slide-menu .options a:hover,
	.drop-down-menu .options .clickable:hover,
	.slide-menu .options .clickable:hover,
	.drop-down-menu .options .btn:hover,
	.slide-menu .options .btn:hover,
	#global-header .nav-group .drop-down-menu:hover,
	#global-header
		.nav-group
		.drop-down-menu.active,
	#global-header
		.nav-group
		.drop-down-menu:hover
		.nav-link,
	#global-header
		.nav-group
		.drop-down-menu.active
		.nav-link,
	.button.minimal,
	button.minimal,
	.pagenav li > a:hover,
	.pagenav li > a:active,
	.actions-menu > .button:hover,
	.actions-menu > .slide-menu .selection:hover,
	.dropdown-menu > li > a:hover,
	.dropdown-menu > li > a:focus,
	.sidebar .upsell,
	input[type='submit']:hover,
	input[type='button']:hover,
	input[type='reset']:hover,
	.selection:hover,
	.pagination a:hover,
	.pagination span:hover,
	.pagination em:hover,
	:not(.photo-nav) > .btn:active,
	:not(.photo-nav) > .button:active,
	:not(.photo-nav) > button:active,
	input[type='submit']:active,
	input[type='button']:active,
	input[type='reset']:active,
	.selection:active,
	.pagination a:active,
	.pagination span:active,
	.pagination em:active,
	.active.btn,
	.active.button,
	button.active,
	input.active[type='submit'],
	input.active[type='button'],
	input.active[type='reset'],
	.active.selection,
	.pagination a.active,
	.pagination span.active,
	.pagination em.active,
	.drop-down-menu.active .selection,
	.editable-setting:hover,
	.editable-setting.editing,
	.btn-default,
	.pinned .pinnable,
	.local-legend-container,
	.upsell-text-container,
	.drop-down-menu a:hover,
	.drop-down-menu .clickable:hover,
	.dropdown a:hover,
	.dropdown .clickable:hover,
	#notifications-drop-down li a:hover,
	basic-analysis #stacked-chart,
	ul.tabs > li:hover .tab,
	.s-chart-tooltip,
	.infobox,
	:not(.photo-nav, .media-body) > .btn,
	.button,
	:not(
			[class*='KudosAndComments--'],
			[class*='GroupActivity'],
			.photo-nav,
			.drop-down-menu
		)
		> button:not(
			[class^='src-Notifications__nav-bar-button'],
			[class*='-components-KudosAndComments-KudosAndComments__count-button'],
			[class*='Activity__headline-text-btn'],
			[class*='-ActivityEntryBody__achievements-trophy'],
			.ui-dialog.sauce-dialog
				.ui-dialog-buttonpane
				.ui-dialog-buttonset
				button,
			.ui-dialog.sauce-dialog
				.ui-dialog-buttonpane
				.ui-dialog-buttonset
				.btn,
			[id^='feed-entry-']
				> div
				> div.------packages-feed-ui-src-components-media-EntryBody-EntryBody__entryBody--RDiit
				> div
				> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
				> div
				> div
				> div.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__stat--SvAS3.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__textRight--A4rwD
				> div.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__statText--zlBKv
				> button,
			[id^='feed-entry-']
				> div
				> div.------packages-feed-ui-src-components-media-EntryFooter-EntryFooter-module__entryFooter--X26JH
				> div
				> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn.------packages-feed-ui-src-components-KudosAndComments-KudosAndComments-module__mediaBody--E8jna
				> div.------packages-feed-ui-src-components-KudosAndComments-KudosAndComments-module__countWrapper--mPWEM
				> button,
			[id^='feed-entry-']
				> div
				> div.------packages-feed-ui-src-components-media-EntryFooter-EntryFooter-module__entryFooter--X26JH
				> div:nth-child(n)
				> div
				> button,
			[id^='feed-entry-']
				> div
				> div.------packages-feed-ui-src-components-media-EntryFooter-EntryFooter-module__entryFooter--X26JH
				> div:nth-child(n)
				> div
				> ol
				> li:nth-child(n)
				> div
				> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn.------packages-feed-ui-src-components-KudosAndComments-CommentsThread-CommentsThread-module__comment--Qf1Yv
				> div.------packages-feed-ui-src-shared-KudosCommentsAndAchievements-CommentReaction-CommentReaction-module__commentReactionContainer--nixAS
				> button,
			[id^='feed-entry-']
				> div
				> div.------packages-feed-ui-src-components-media-EntryFooter-EntryFooter-module__entryFooter--X26JH
				> div:nth-child(n)
				> div
				> ol
				> li:nth-child(n)
				> div
				> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn.------packages-feed-ui-src-components-KudosAndComments-CommentsThread-CommentsThread-module__comment--Qf1Yv
				> div.------packages-feed-ui-src-shared-KudosCommentsAndAchievements-CommentReaction-CommentReaction-module__commentReactionContainer--nixAS
				> span
				> button,
			#tabs--1--panel--0
				> div
				> div
				> div.------packages-dashboard-ui-src-components-AthleteProgressGoals-RelativeEffort-RelativeEffort-module__head--nI6Px
				> div:nth-child(n)
				> div
				> button,
			#sauce-kudo-all button.sauce-invoke,
			#search-results
				> tbody
				> tr:nth-child(n)
				> td.view-col.col-actions
				> ul
				> li:nth-child(n)
				> button,
			#view
				> section
				> div
				> table
				> tfoot
				> tr
				> td,
			#feed-entry-null
				> div
				> div.------packages-feed-ui-src-components-media-EntryHeader-EntryHeader-module__entryHeader--m1apc
				> div
				> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
				> button,
			#cpra-compliance-cta,
			#__next > div > header > div > button,
			.------packages-ui-Button-Button-module__btn--mQaJJ,
			#global-search-button,
			#global-search-cancel,
			#open-global-search-button,
			.src-Notifications-module__navBarButton--jeAZg,
			#authorize
		),
	input[type='submit'],
	input[type='button'],
	input[type='reset'],
	:not(.subactions, .drop-down-menu) > .selection,
	.pagination a,
	.pagination em,
	table.unstyled tr,
	table.unstyled tr:nth-child(2n),
	.ride
		.segment-effort-detail
		.leaderboard-footer,
	.swim
		.segment-effort-detail
		.leaderboard-footer,
	#settings-menu a:hover,
	#settings-menu a:active,
	#explorer #segment-list ul li:hover,
	.form-control,
	.css-1jl1bc3-control,
	.css-1liq7bz-control,
	.css-16j759p-control,
	.css-drn9af-control,
	.activity-stats .secondary-stats.inline-stats,
	.month-calendar td:not(:disabled),
	.leaflet-bar,
	ul.routes-list li.route-card .timestamp,
	.dropzone,
	.leaderboard-page .leaders tbody td,
	.gear,
	#interval-date-range
		.drop-down-menu
		> div:not(:hover),
	#distance-unit-dd > div,
	#activity-type-dd > div,
	#workout-type-run-dd > div,
	#elevation-unit-dd > div,
	#sauce-infopanel table tr:hover:not(.selected),
	[class^='src-components-NotificationsList-NotificationsList__notification-unread']
		> a:hover,
	[class^='src-components-NotificationsList-NotificationsList__notifications']
		> li:hover,
	[class^='src-components-NotificationsList-NotificationsList__notifications']
		> li:active,
	[class*='__achievement-celebration--'],
	[class*='packages-ui-Button-styles-module__default']:hover,
	[class*='packages-ui-Button-styles-module__default']:focus,
	[class*='-components-Footer-Footer']
		[class*='css'][class*='-control']:hover,
	[class*='-components-Footer-Footer']
		[class*='css'][class*='-control']:focus,
	[class*='packages-ui-Select-Select-module']
		[class*='css'][class*='-control']:hover,
	[class*='packages-ui-Select-Select-module']
		[class*='css'][class*='-control']:focus,
	[class*='styles_menu__']:hover
		[class*='styles_button'],
	[class*='-ui-Dropdown-Dropdown-module__list'],
	[class*='-ui-Button-Button-module__default--jLxgA']:hover,
	[class*='-ui-Button-Button-module__default--jLxgA']:focus,
	.drop-down-menu.leaderboard-filter
		> .selection:not(:hover),
	#roster .roster-entry-row:nth-child(2n) td,
	.grabber,
	[class*='styles_menuItems_']
		[class*='styles']:not(
			[class*='subscription']
		):hover,
	[class*='styles_menuItems_'] a:hover,
	[class*='NotificationsList-module'] a:hover,
	[class*='NotificationsList'] li:hover,
	[class^='styles_menuItems'] a:active,
	[class^='styles_menuItems'] a:focus,
	[class^='styles_menuItems'] a:hover,
	[class^='styles_menu_']:active
		> [class^='styles_button_'],
	[class^='styles_menu_']:focus
		> [class^='styles_button_'],
	[class^='styles_menu_']:hover
		> [class^='styles_button_'],
	.alert-info,
	[class*='-SuggestedRoutes-module__routeCard-'],
	[class*='-module__achievementCelebration'],
	[class*='RecentActivities_card__'],
	[class*='-ModalWithTabs-module__tabList'],
	[class*='styles_navItem']
		> a[class*='Button_default_']:hover,
	.react-select__option--is-selected {
		background-color: #3c3c3c !important;
	}

	[class*='-LoadingState-Placeholder-Placeholder-module__placeholder'] {
		background: #3c3c3c !important;
	}

	.btn-accept-cookie-banner:hover,
	.upload-tags label:hover,
	section header .button:not(.disabled):hover,
	section header .button:not(.disabled):active,
	section header .button:not(.disabled).active,
	section header .selection:hover,
	section header .selection:active,
	section header .selection.active,
	[class*='ModalWithTabs--tab'][data-selected],
	[class*='ModalWithTabs--tab-list']
		> [class*='ModalWithTabs--tab']:hover:not(
			[data-selected]
		),
	[class*='Button--default--']:hover,
	.tabbed-cards .tabs > li:hover .tab,
	.button.minimal:hover,
	button.minimal:hover,
	.button.minimal:focus,
	button.minimal:focus,
	#global-footer
		.footer-nav-menu
		.footer-nav-submenu,
	:not(.photo-nav) > .btn:hover,
	.button:hover,
	:not(.photo-nav, .drop-down-menu)
		> button:hover,
	input[type='submit']:hover,
	input[type='button']:hover,
	input[type='reset']:hover,
	.selection:hover,
	.pagination a:hover,
	.pagination span:hover,
	.pagination em:hover,
	[class*='Form--hr-'],
	.sauce-title-menu > a,
	[class*='-Dropdown-module__item']:hover,
	.activity-summary-v2 .activity-breakdown .other,
	[class*='DropdownSelect']
		> .react-select__control
		div
		span[class*='indicatorSeparator'],
	.react-select__option--is-focused {
		background-color: #4c4c4c !important;
	}

	#strava-map-controls > #create-route:hover,
	#toggle-fullscreen:hover {
		background-color: #b3b3b3 !important;
	}

	#toggle-fullscreen {
		background-color: #d3d3d3 !important;
	}

	#map-control-container #gpx-download {
		position: relative;
		background-color: transparent;
	}

	#map-control-container #gpx-download::before {
		position: absolute;
		top: 50%;
		left: 5px;
		transform: translateY(-50%);
		z-index: 1;
		filter: invert(1);
		background-image: url('https://d3nn82uaxijpm6.cloudfront.net/assets/svg/2024/actions_download_normal_small-99d901d5f3767d8e2464a13987c976fdc10c89656f3c89e7a5a472f5f325e3d3.svg');
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
		width: 16px;
		height: 16px;
		content: '';
	}

	[class*='packages-feed-ui-src-Feed__feed-pagination'],
	[class*='src-Feed-module__feedPaginatio'] {
		background-image: linear-gradient(
			#2c2c2c,
			rgb(255 255 255 / 0%)
		);
	}

	.pagination > .active > span,
	.pagination > .active > span:hover,
	.pagination > .active > span:focus,
	#settings-menu .selected a,
	.flagged.error {
		background-color: #fc5200 !important;
	}

	.leaderboard tr.highlighted > td {
		background-color: #962f03 !important;
	}

	.upload-tags label .hole::after,
	.year-calendar .interval-graph .bar .fill,
	#strava-map-controls > #create-route,
	[class*='WeekInsightStats-WeekChart-WeekChart-module__bar']
		> span,
	.ui-dialog.sauce-dialog.sauce-sync-athlete-dialog
		.sync-logs
		.logs {
		background-color: #ccc !important;
	}

	[class*='FriendList-FriendList__scroll-shadow'],
	.view-col.col-actions
		> ul
		> li:nth-child(n)
		> button,
	.view-col.col-actions
		> ul
		> li:nth-child(n)
		> div
		> button,
	#__next > div > header > div > button {
		background: transparent !important;
	}

	.view-col.col-actions
		> ul
		> li:nth-child(n)
		> button,
	.view-col.col-actions
		> ul
		> li:nth-child(n)
		> div
		> button:not(
			.drop-down-menu.drop-down-xs .selection
		),
	.description .btn-link {
		padding: 3px;
	}

	.link-learn-more-cookie-banner,
	.btn-accept-cookie-banner,
	.feed-entry .entry-body .media-body,
	#global-header
		.nav-group
		.drop-down-menu
		.selection,
	.sidebar
		.section:first-child:not(
			.limited,
			.your-challenges
		),
	.search > .panel-default,
	.table > tbody > tr > td,
	[class*='--list-stats'] > li::after,
	.activity-tags label:hover,
	.activity-tags label,
	.panel-footer,
	[class*='ExpandableOptionList--'],
	.visibility-section,
	.activity-summary .private-note-container,
	section header .sharing,
	[class*='KudosAndComments--'],
	[class*='ModalWithTabs--tab-list'],
	[class*='KudosCommentsAndAchievementsModal--footer'],
	[class*='ModalWithTabs--tab-list']
		> [class*='ModalWithTabs--tab'][data-selected],
	[class*='CommentDeleteAlertDialog--action-'],
	[class*='Button--default--'],
	[class*='Button--default--']:link,
	[class*='Button--default--']:visited,
	.content > form.search[action],
	.entry-subtitle,
	.track-props > td,
	.card .card-footer,
	.card .card-section,
	#progress-goals .yearly-goal,
	[class*='GroupActivity--list-entries--']
		> li::before,
	[class*='GroupActivity--headline-image']::before,
	.btn-white,
	.list-stats li::after,
	.drop-down-menu .options,
	.drop-down-menu .options .opt-group::before,
	.slide-menu .options .opt-group::before,
	.starred-segments thead > tr > th,
	.goal.card,
	.card > .tab-contents,
	.goal.card.failed .content,
	section.with-border,
	.button.minimal,
	button.minimal,
	.sidenav > .pagenav,
	.sidenav .pagenav > li,
	.activity-summary .others-section-v2,
	#heading .social > .collapse,
	.sidenav > .actions-menu,
	#view > .header,
	.dense > thead > tr > th,
	.dense > tbody > tr > td,
	#notifications-drop-down,
	.athlete-graph ul.intervals .interval,
	[class*='Details--follow-stats-']
		> li:first-child,
	[class*='AthleteProfileApp--activities-'],
	.dropdown-menu > li > a::after,
	.dropdown-menu > li > .btn::after,
	ol > [class*='Activities--card--'],
	[class*='Activities--card--']
		[class*='Activities--list-stats-']
		> li,
	[class*='Achievements--athlete-achievements-']
		> ul
		> li,
	[class*='AthleteProfileApp--metrics-']
		[class*='AthleteProfileApp--section-'],
	.drop-down-menu > ul,
	.pinned .pinnable,
	.section.with-border,
	[class*='KudosCommentsAndAchievementsModal--entry-'],
	input:not([type='range'], :focus),
	textarea:not(:focus),
	.textarea-clone:not(:focus),
	#notifications-drop-down li,
	.lightbox-window header,
	.lightbox-window,
	.s-chart-tooltip,
	.infobox,
	.border-bottom-light,
	[class*='SegmentDetailsSideBar--action-link--'],
	[class*='SegmentDetailsSideBar--card--'],
	.leaderboard .filters #premium-enhanced ul,
	.pagination > .disabled > span,
	.pagination > .disabled > span:hover,
	.pagination > .disabled > span:focus,
	.pagination > li > a,
	.pagination > li > span,
	#global-header,
	.table-leaderboard th,
	.leaderboard .filters,
	.fixed-sidebar-container .section,
	.upsell-section,
	section header,
	section .header,
	.section header,
	.section .header,
	.activity-stats .section,
	.activity-summary-container::before,
	.btn:not(.btn-sm),
	.button,
	button,
	input[type='submit'],
	input[type='button'],
	input[type='reset'],
	.selection,
	.pagination a,
	.pagination span,
	.pagination em,
	.ride .segment-effort-detail .content,
	.swim .segment-effort-detail .content,
	ul.tabs > li.selected .tab,
	ul.tabs > li[aria-selected='true'] .tab,
	.sidebar .comparison table th,
	.sidebar .comparison table td,
	.striped > li,
	.striped > div,
	.striped > tr,
	#settings-menu a:link,
	#settings-menu a:visited,
	.page > .panel,
	#race-table > thead th,
	.border-top-light,
	#search-results > thead > tr > th,
	.form-control,
	.g7N7fBojz_GFCESrdaxzf,
	._20SrlX3s5w5pg4W3cnHhP1,
	.css-1jl1bc3-control,
	.css-1liq7bz-control,
	.css-16j759p-control,
	.css-drn9af-control,
	._2tHFsObM1XTWmMJqQESh9T,
	._2wk2mpI6KzJRgwh0uUGnGU:hover
		.cQx-n1x8ZWjdIAziPar_Y,
	._2wk2mpI6KzJRgwh0uUGnGU:active
		.cQx-n1x8ZWjdIAziPar_Y,
	._2wk2mpI6KzJRgwh0uUGnGU:focus
		.cQx-n1x8ZWjdIAziPar_Y,
	._3r8IlbmQT2zCJZ1LnVpdVH,
	.comments li.media,
	.comments form.media,
	.media-body > div > textarea,
	#lightbox-tabs,
	.main > .tabs,
	#totals li,
	.month-calendar.marginless th,
	.month-calendar td,
	[class*='ActivityEntryBody--activity-entry-container']
		li,
	.general-info .stat.spacer,
	.setting,
	.editable-setting,
	#my-badges .step,
	.slide-menu .options,
	.sport-select,
	#header-photos ul a,
	.profile-heading .avatar img,
	#profile-heatmap-upsell + ul.tabs,
	#partner-integrations-page > hr,
	#new_activity > hr,
	.nav-categories-container,
	.list-apps .app-card,
	.app-support,
	.leaderboard-page .leaders tbody td,
	.leaderboard-page .leaders table,
	.row > div > .tabs,
	section .place-holder,
	[class*='AthleteProfileHeaderMediaGrid--image'],
	[class*='Header--container--'],
	.ui-dialog,
	.ui-dialog-titlebar,
	[data-source='peak_power'] > td,
	[class^='EmailVerificationCTA--dialog'] hr,
	.glossary-header,
	[class*='Summary--stats-wrapper--'],
	[class*='Comments--comment-wrapper--'],
	[class^='Photos--container--'],
	#hide-anywhere-page hr,
	[class^='HideAnywhereApp--slider-'],
	.setting-group,
	.sauce-comments-feed:not(:empty),
	[class^='src-components-NotificationsList-NotificationsList__notification-unread'],
	[class^='src-components-NotificationsList-NotificationsList__notifications'],
	[class^='src-components-NotificationsList-NotificationsList__notifications']
		> li,
	#__next > header > div nav ul,
	[class*='-KudosAndComments-KudosAndComments__hairline'],
	.list-athletes > li,
	.my-segments td,
	.my-segments > thead th,
	[class*='-packages-ui-ModalWithTabs-styles__tab-list'],
	[class*='KudosCommentsAndAchievementsModal-KudosCommentsAndAchievementsModal__entr'],
	[class*='KudosCommentsAndAchievementsModal__footer'],
	[class*='src-features-GroupActivity-GroupActivity']::before,
	ul[class*='src-features-GroupActivity-GroupActivity']
		> ::before,
	body > div#__next header + div > div div,
	[class*='Upsell--upsell-container'],
	[class*='MoreActivities--more-activities'],
	.uploads > li,
	[class*='packages-ui-ModalWithTabs-styles-module__tabList'],
	[class*='-shared-AthleteInfo-AthleteInfo__list-row'],
	[class*='-packages-ui-Card-Card-module__card'],
	[class*='-ui-src-Dashboard-module'],
	[class*='packages-ui-Button-styles-module__default'],
	[class*='-components-Footer-Footer']
		[class*='css'][class*='-control'],
	[class*='packages-ui-Select-Select-module']
		[class*='css'][class*='-control'],
	[class*='-AthleteProfileStat-AthleteProfileStat-module']
		li,
	[class^='Header_container__'],
	[class^='styles_globalHeader__'],
	[class*='styles_menu__']:hover
		[class*='styles_button'],
	[class*='styles_subscriptionCallout__'],
	[class*='-Dropdown-module__item'],
	[class*='-KudosAndComments__comments-form'],
	[class*='-ui-Button-Button-module__default--jLxgA']:not(
			.------packages-feed-ui-src-shared-KudosCommentsAndAchievements-CommentReaction-CommentReaction-module__commentReactionContainer--nixAS
				> button
		),
	[class*='AvatarWithDataRow--avatar-border'],
	#roster thead th,
	.grabber,
	#sauce-infopanel td,
	[class*='-EmptyState-EmptyState-module__iconCircleContainer'],
	[class*='NotificationsList'],
	[class*='NotificationsList'] li,
	[class^='styles_menu_']:active
		> [class^='styles_button_'],
	[class^='styles_menu_']:focus
		> [class^='styles_button_'],
	[class^='styles_menu_']:hover
		> [class^='styles_button_'],
	.activity-summary-v2 .activity-breakdown .sport,
	.alert-info,
	[class*='src-components-account-Membership-Membership-module__row'],
	[class*='-LoginDetails-module__link'],
	[class*='SubscriptionValueProps-module__'],
	[class*='ModalWithTabs--tabList'],
	[class*='-SuggestedRoutes-module__routeCard-'],
	[class*='-ModalWithTabs-module__tabList'],
	[class*='-ActivityEntryBody-module__stats']
		> li,
	[class*='ProfileEveryone_activities'],
	[class*='RecentActivities_card__'],
	[class*='KudosCommentsAndAchievementsModal-module__entr'],
	.upgrade > a,
	[class*='-KudosAndComments-module__hairlin'],
	[class*='styles_navItem']
		> a[class*='Button_default_'],
	[class*='LeaderboardsTable--leaderboard-entry'],
	[class*='LeaderboardsTable--table-container']
		> table
		th,
	[class*='CategoryTabs--container--']
		[data-reach-tab][data-selected],
	[class*='DropdownSelect']
		> .react-select__control,
	[class*='Discussions--discussion-list']
		> :not(:last-child),
	[class*='CollapsibleSection--line'],
	[class*='Show--top-row'],
	.MediaUploader--dropzone--sS1mw {
		border-color: #4c4c4c !important;
	}

	.activity-tags label::before,
	.activity-tags label::after,
	.upload-tags label:hover::after,
	._10qP2Xkrc-PEXwwlEspwf9,
	[class*='-components-ActivityEntryBody-ActivityEntryBody__stats']
		> li,
	body > div#__next header + div > div {
		border-right-color: #4c4c4c !important;
	}

	#global-footer
		.footer-nav-menu
		.footer-nav-submenu::after,
	ul.tabs > li:hover,
	.drop-down-menu .opt-group,
	footer,
	.ride .segment-effort-detail .pr-comparison,
	.swim .segment-effort-detail .pr-comparison,
	.sidebar .section:not(:first-child),
	[class*='Form--hr-'],
	.dense
		.drop-down-minimal.enabled
		.selection::after,
	.uploads
		.drop-down-menu.enabled
		> .selection::after,
	.uploads
		.drop-down-menu[class*='workout-type']
		> .selection::after,
	[class*='GlobalHeatmapAboutModal_aboutModal_']
		> hr,
	[class*='GlobalHeatmapAboutModal_modalBod']
		> hr,
	[class*='KudosCommentsAndAchievementsModal-module__footer'] {
		border-top-color: #4c4c4c !important;
	}

	.drop-down-menu.drop-down-sm.enabled.active
		> .selection::after,
	#gpx-export .selection::after,
	#dropdown-language-picker-button::after,
	#dropdown-more-button::after,
	#dropdown-follow-us-button::after,
	#selected-map::after,
	.text-nowrap
		> .drop-down-menu
		.selection::after,
	#language-picker > .btn-white.selection::after,
	.drop-down-menu.leaderboard-filter
		> .selection::after,
	#ytd_year_run > .selection::after,
	.drop-down-menu > .btn.selection::after,
	#interval-date-range .selection::after,
	.dense
		.drop-down-minimal.enabled
		.selection:hover::after,
	.sauce-title-menu a.selection::after,
	#distance-unit-dd > div::after,
	#activity-type-dd > div::after,
	#workout-type-run-dd > div::after,
	#elevation-unit-dd > div::after,
	.drop-down-menu > .selection::after {
		border-top-color: #ccc !important;
	}

	[class*='Spinner_spinner']
		> [class*='Spinner_graphic'],
	.PopupContents--popup-button-list--OU7Sn
		> li:first-child {
		border-color: #ccc #6c6c6c #6c6c6c !important;
	}

	h1,
	#legal-body > section h2,
	#legal-body > section h3,
	.list-unstyled > li > a:hover,
	.list-unstyled > li > a:focus,
	.footer-global.container h4,
	.entry-title,
	.title-text,
	.text-subhead.media-title,
	#athlete-profile .athlete-name,
	.count.text-display5,
	[scope='col'] > .weekday,
	.sidebar > .section,
	.premium-hr-upsell > h2,
	[class*='ExpandableOptionList--'] h4,
	[class*=' KudosAndComments--count'],
	[class*='Button--default--'],
	[class*='Button--default--']:link,
	[class*='Button--default--']:visited,
	a.text-subhead:hover,
	a.text-subhead:focus,
	[class*='ActivityEntryBody--activity'],
	[class*='Activity--card--']
		a:not([class*='.Activity--btn--']):link,
	.page
		a:not(.btn):link:not(
			#athlete-profile
				> div.row.no-margins
				> div.spans5.offset1.sidebar
				> div.section.comparison.borderless
				> div.hidden.sport-0.active-tab
				> table
				> tbody:nth-child(n)
				> tr:nth-child(n)
				> td:nth-child(n)
				> a,
			a.minimal:link
		),
	.page .btn.btn-link:link,
	.page .btn.btn-link:visited,
	.page a:not(.btn, a.minimal):visited,
	.selection.nav-link,
	.year-calendar strong,
	.inline-stats.nav-style a:not(:hover),
	.goal.card .context,
	.footer-promos .promo a:hover,
	.setting-label,
	.label.premium,
	[class*='Activities--timestamp--'],
	#fitness-freshness .list-stats li,
	.btn-default:hover,
	.dropdown-menu > li > a:hover,
	#global-footer
		.footer-nav-wrapper:hover
		.footer-nav-menu:hover
		h4,
	#global-footer
		.footer-nav-wrapper:hover
		.footer-nav-menu:hover
		.h4,
	#global-footer
		.footer-nav-wrapper:hover
		.footer-nav-menu:hover
		h4
		a,
	#global-footer
		.footer-nav-wrapper:hover
		.footer-nav-menu:hover
		.h4
		a,
	#basic-analysis
		.ride-segments-chart-upsell
		.upsell-text-container
		.upsell-title,
	#notifications-drop-down li a,
	[class*='CardActionsSection--link-with-caret']:not(
			:active
		),
	.leaderboard .leaderboards-upsell .heading,
	.btn-unstyled:hover,
	.leaderboard td.athlete a:not(:focus),
	.leaderboard td.athlete a:not(:active),
	.leaderboard td.athlete a:not(:hover),
	.button.title:hover,
	#kudos .count-hover,
	.button:hover,
	a.cancel:hover,
	a.cancel:active,
	._3NT_0X1dhVQp4ZAiKyNdPC,
	._3Me6VUlnxd5fsLdgWb9bbK,
	._2fAFbrpTUd4U_68t7mryKE:hover,
	#totals li strong,
	.leaflet-container,
	#segment-cat-container > div.cat-label,
	.sidebar.spans4 div > .label,
	.author-edit .author-name,
	.breadcrumb > li + li,
	.breadcrumb > li + li::before,
	.dropzone .header,
	.manual-entry label,
	.manual-entry legend,
	.nav-categories-container
		li
		> [aria-selected='true'],
	.leaderboard-page .leaders .unit,
	.leaderboard-page .leaderboard .unit,
	.index-heading section .upsell,
	[class*='Trophies--list-item--'] > a:hover,
	.primary-stats .actual,
	[class*='Welcome--modal--'],
	#onboarding-step-title,
	.ui-dialog-titlebar,
	#map-vis-modal-title,
	.sauce-header,
	#__next
		> header
		> div
		ul
		> li
		div
		> a:not(:hover),
	#__next
		> header
		> div
		nav
		> ul
		> li
		> a:not(:hover),
	#__next div > div li > a,
	[class^='TextBlock--text-block-'] p,
	[class*='KudosCommentsAndAchievement']
		> a:not(:hover),
	[class*='Activity__headline-text-btn'],
	body
		> div#__next
		header
		+ div
		> div
		div
		label
		> span,
	[class*='Stat--sta'],
	[class*='-AthleteProfile-AthleteName-AthleteName-']:not(
			:hover
		),
	[class*='-AthleteProfile-AthleteName-AthleteName-']:not(
			:focus
		),
	[class*='-Stat-module__statLabel'],
	[class*='-components-YourSuggestedFollows']:not(
			:hover
		),
	[class*='-components-YourSuggestedFollows']:not(
			:focus
		),
	[class*='-Footer-Footer-module__sidebarFooter']
		li
		> a:not(:hover),
	[class*='-Footer-Footer-module__sidebarFooter']
		li
		> a:not(:focus),
	[class*='-GroupActivity-GroupActivity__headline-text-btn']:focus,
	[class*='-HeaderWithOwnerMetadata-HeaderWithOwnerMetadata']
		> a,
	.clubMemberPostHeaderLinks > a,
	[class*='packages-ui-Select-Select-module']
		[class*='css'][class*='-control']
		div,
	#legal-nav li.selected > a,
	[class^='Footer_footer__'] li > a:hover,
	[class*='src-TermsOfServiceUpdateModal-module__title'],
	.seg-leaderboard-upsell .heading,
	[class^='Modal_title_'],
	[class*='DesktopNav--navLinks'] li > a:hover,
	[class*='styles_navItem'] a:hover,
	[class*='Desktop_middleColumn'] p,
	[class*='notificationTitle'],
	[class*='-ChallengeCard-styles__card-title'] a,
	[class*='shared-ui-src-challenges'],
	[class*='PromotedDoradoSection-styles__challenge-title']
		a,
	.ride
		.segment-effort-detail
		.segment-leaderboard
		tr.current-athlete
		td:last-child,
	.swim
		.segment-effort-detail
		.segment-leaderboard
		tr.current-athlete
		td:last-child,
	[class*='src-components-account-Account-module__account-'],
	[class*='-SuggestedRoutes-SuggestedRoutes-module__title'],
	[class*='-SuggestedRoutes-module__routeCardTitle']:not(
			:hover
		),
	[class*='RecentActivities_timestamp'],
	[class*='-components-media-EntryBody-EntryBody__entryBody'],
	[class*='CommentsThread-module__athleteName']
		> a:not(:hover),
	[class*='-CommentsThread-module__commentText']
		> .mention:not(:hover),
	[class*='LeaderboardsTable--leaderboard-entry']
		div
		> a:not(:hover),
	[class*='CollapsibleSection--dark'],
	[class*='Post--author-name--']:hover,
	.ui-dialog.sauce-dialog.sauce-sync-athlete-dialog
		header.title,
	.\\------packages-feed-ui-src-features-Post-Post-module__entryTitle--qi9Ab,
	.\\------packages-feed-ui-src-features-Post-Post-module__postBody--st353,
	.KudosCommentsAndAchievementsModal--kudos-and-comments-modal--Y9sxh
		button {
		color: #fafafa !important;
	}

	body,
	.content-body p,
	.content-body h2,
	.btn-accept-cookie-banner,
	#legal-body > section > p,
	section ul > li::marker,
	p.copyright,
	.list-unstyled > li > a,
	.entry-subtitle,
	.media-body p,
	#athlete-profile .location,
	.text-footnote,
	.count text-display5,
	.setting-value,
	.timezone-container,
	textarea.input-block,
	.connections-list,
	.premium-hr-upsell p,
	small,
	#my-badges p,
	#shoes,
	th[class^='col'] > .button-white,
	[class*='--stat-subtext--'],
	[class*='ExpandableOptionList--'] span,
	[class*='PerceivedExertionInput'],
	[class*='Button--default--'],
	[class*='Button--default--']:link,
	[class*='Button--default--']:visited,
	.color-n80-asphalt,
	a.text-subhead,
	div.text-title3,
	[class*='LocationAndTime'],
	.stat-subtext,
	[class*='ActivityEntryBody--count--']:not(
			:hover
		),
	[class*='ActivityEntryBody--achievements-summary'],
	[class*='ActivityEntryBody--achievements-summary']
		li
		strong,
	#clamped-content-default,
	[class*='GroupActivity--headline-text']:not(
			:hover
		),
	.btn-section-link,
	.h5.btn-text,
	.activity-calendar .day,
	.drop-down-menu .options a,
	.slide-menu .options a,
	.drop-down-menu .options .clickable,
	.slide-menu .options .clickable,
	.drop-down-menu .options .btn,
	.slide-menu .options .btn,
	.nav-link:visited:not(:hover),
	.footer-promos .promo a,
	.btn-default,
	.dropdown-menu > li > a,
	#global-footer h4,
	#global-footer .h4,
	#global-footer a,
	#global-header .nav-bar .nav-link,
	[class*='Details--location-'],
	#similar-activities-teaser .trending,
	[class*='LocationAndTime--subtitle-wrapper-']
		time,
	[class*='KudosCommentsAndAchievementsModal--tab-content']
		a:not(
			[class*='KudosCommentsAndAchievementsModal--btn-']
		):link:not(:hover),
	[class*='AvatarAndMeta--location'],
	textarea[placeholder*='Add a comment'],
	#segment-list .info,
	.drop-down-menu a,
	.drop-down-menu .clickable,
	.dropdown a,
	.dropdown .clickable,
	#notifications-drop-down li a:not(:hover),
	[class*='Comment--'] + textarea,
	.leaderboard .leaderboards-upsell .text,
	.sidebar-footer a,
	.sidebar-footer .dropdown .btn,
	.sidebar-footer .copyright,
	.footer-global,
	.compact.minimal,
	.button.title,
	#kudos .count,
	.button,
	.btn,
	button,
	input[type='submit'],
	input[type='button'],
	input[type='reset'],
	.selection,
	.pagination a,
	.pagination em,
	.edit-personal-records td.readonly-column span,
	input[type],
	a.cancel:not(:hover),
	.form-control,
	.css-1liq7bz-control,
	.css-1rf2su1-singleValue,
	._2fAFbrpTUd4U_68t7mryKE,
	.cQx-n1x8ZWjdIAziPar_Y:not(:hover),
	.cQx-n1x8ZWjdIAziPar_Y:visited,
	.comments time,
	ul.tabs li .tab,
	[class*='CommentsThread--more-comments-button--'],
	[class*='CommentsThread--comment--'] time,
	.month-calendar .day,
	.general-info > .stat,
	.badge-code,
	.moving-time > .label,
	[class*='ActivityEntryBody--activity'] > div,
	[class*='Trophies--list-item--'] > a,
	[class*='Form--hr-'],
	[class*='DisclaimerText--disclaimer-text--'] p,
	[class*='ADPKudosAndComments--count--'],
	[class*='MediaBody--media-body-'],
	[class*='Modal--body-'],
	[class^='ActivityDescriptionEdit'],
	#activity_private_note,
	[class*='Comments--comment-body--'],
	[class*='MapVisModal--description--'],
	[class*='HideAnywhereApp--'],
	#basic-analysis #effort-detail,
	[class^='src-components-NotificationContent-NotificationContent__text-container']
		p,
	#__next > header > div ul > li div li *,
	#__next > header > div nav > ul > l,
	#__next div > div > div > div > div div,
	[class*='-Stat-styles__stat-value'],
	[class*='ActivityEntryBody__achievements-summary--']
		> li
		strong,
	[class*='-src-components-media-MediaBody-MediaBody__media-body'],
	[class*='CommentsThread-CommentsThread__more-comments-button'],
	[class*='-ui-src-components-media-EntryBody-EntryBody__entry-body'],
	[class*='src-components-ActivityEntryBody-ActivityEntryBody__description-body'],
	[class*='KudosCommentsAndAchievements-AvatarAndMeta-AvatarAndMeta__location'],
	[class*='ActivityEntryBody__stats'],
	.leaflet-bottom
		> .leaflet-control-attribution
		> a[title],
	.mapboxgl-ctrl-scale,
	[class*='shared-friends-components-shared-AthleteInfo']
		p,
	[class*='-module__latestActivityLink']:not(
			:hover
		),
	[class*='-module__latestActivityLink']:not(
			:focus
		),
	[class*='-DashboardCardLink-DashboardCardLink-module']:not(
			:hover
		),
	[class*='-DashboardCardLink-DashboardCardLink-module']:not(
			:focus
		),
	[class*='-ActivityEntryBody-ActivityEntryBody']:not(
			:hover
		),
	[class*='-ActivityEntryBody-ActivityEntryBody']:not(
			:focus
		),
	[class*='s-AthleteProfile-AthleteProfileStat-']:not(
			:hover
		),
	[class*='s-AthleteProfile-AthleteProfileStat-']:not(
			:focus
		),
	[class*='packages-ui-Button-styles-module__default'],
	[class*='-components-Footer-Footer']
		[class*='css'][class*='-control']
		div
		> div,
	.effective-date,
	[class^='Footer_footer__'] li > a,
	[class*='ExpandableOptionList--heading--frEbW'],
	[class*='-Dropdown-module__item'],
	[class*='-ui-Button-Button-module__default--jLxgA'],
	.seg-leaderboard-upsell .text,
	.breadcrumbs,
	[class*='-CommentsThread-CommentsThread__']
		a:not(:hover),
	[class^='Modal_body_'],
	[class*='DesktopNav--navLinks'] li > a,
	[class*='styles_navItem'] a,
	[class*='src-components-media-EntryBody-EntryBody__entry-inset']
		> a,
	[class*='NotificationContent'] p,
	.ride
		.segment-effort-detail
		.segment-leaderboard
		td:last-child,
	.swim
		.segment-effort-detail
		.segment-leaderboard
		td:last-child,
	.ride .segment-effort-detail .rank strong,
	.ride .segment-effort-detail .rank,
	[class*='src-TermsOfServiceUpdateModal-module__description'],
	[class*='Membership-components-SubscriptionValueProps-SubscriptionValueProps'],
	[class*='MembershipStatus-MembershipStatus-module__info'],
	[class*='MembershipStatus-module__iconInline'],
	.page .row .btn-block.button,
	[class*='-SuggestedRoutes-SuggestedRoutes-module__subtitle'],
	[class*='AvatarAndMeta--athlete-name']
		> a:not(:hover),
	[class*='-DateRange-module__dateRange'],
	[class*='-SuggestedRoutes-module__statText'],
	[class*='-ActivityEntryBody-module__achievementsSummary']
		li
		strong,
	[class*='Stat_statLabel_'],
	[class*='-AvatarAndMeta-module__location'],
	[class*='NotificationsList-module__notificationsEmpty']
		p,
	[class*='MediaBody-MediaBody__mediaBody'],
	[class*='Legend_overflowString'],
	[class*='Calendar_bottomContainer'],
	[class*='-GroupActivity-module__headlineTextBtn']:not(
			:hover
		),
	[class*='CommentsThread-module__moreCommentsButton']:not(
			:hover
		),
	[class*='LeaderboardsTable--leaderboard-entry'],
	[class*='DropdownSelect']
		> .react-select__control
		div,
	.react-select__option,
	[class*='CollapsibleSection--light'],
	[class*='Post--author-name--'],
	.ui-dialog.sauce-dialog.sauce-sync-athlete-dialog
		.sync-logs
		header
		.btn
		[data-icon][data-prefix='far'] {
		color: #ccc !important;
	}

	.ui-dialog.sauce-dialog
		.btn:not(
			.btn-unstyled,
			.btn-primary,
			.btn-secondary
		) {
		border: 1px solid #fff !important;
		background-color: #962f03b0 !important;
		color: #fff !important;
	}

	.ui-dialog.sauce-dialog
		.btn:not(
			.btn-unstyled,
			.btn-primary,
			.btn-secondary
		):hover {
		outline: 1px solid #fff !important;
		border: 1px solid #fff !important;
		background-color: #999 !important;
	}

	.ui-dialog.sauce-dialog
		input:not([type='range']),
	.entry.block.history.ftp.history-view.mutable-data-view
		> div.mutable-data-entries
		> div:nth-child(n)
		> div,
	.sauce-sync-athlete-dialog
		.ui-dialog-content
		.entry
		.btn {
		outline: 1px solid #fff !important;
		border: 1px solid #fff !important;
		background-color: rgb(
			150 47 3 / 69%
		) !important;
		color: #fff !important;
	}

	.------packages-feed-ui-src-shared-KudosCommentsAndAchievements-CommentReaction-CommentReaction-module__commentReactionContainer--nixAS
		> button {
		margin-left: -9px;
		border: unset;
		padding: 6px 10px !important;
	}

	.------packages-feed-ui-src-components-media-EntryHeader-EntryHeader-module__entryHeader--m1apc
		> div,
	.------packages-feed-ui-src-components-media-EntryHeader-EntryHeader-module__entryHeader--m1apc
		> div
		> a,
	.------packages-feed-ui-src-components-AthleteJoinEntry-AthleteJoinEntry-module__athleteJoinEntryBody--Y3xIM
		> div
		> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
		> h3
		> a,
	.------packages-feed-ui-src-components-AthleteJoinEntry-AthleteJoinEntry-module__athleteJoinEntryBody--Y3xIM
		> div
		> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
		> button,
	.src-components-BeesAdpTable-BeesAdpTable-module__adpTable--m7oGI
		th {
		color: #fff !important;
	}

	.------packages-feed-ui-src-components-media-EntryHeader-EntryHeader-module__entryHeader--m1apc
		> div
		> a:hover,
	.------packages-feed-ui-src-components-AthleteJoinEntry-AthleteJoinEntry-module__athleteJoinEntryBody--Y3xIM
		> div
		> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
		> h3
		> a:hover,
	.------packages-feed-ui-src-components-AthleteJoinEntry-AthleteJoinEntry-module__athleteJoinEntryBody--Y3xIM
		> div
		> div.------packages-feed-ui-src-components-media-MediaBody-MediaBody__mediaBody--VKChn
		> button:hover {
		color: #fc5200 !important;
	}

	table.unstyled td,
	table.unstyled th,
	.segment-effort-detail
		> div
		> div
		> div
		> div.spans7
		> div
		> div
		> div
		> table
		> tbody
		> tr:nth-child(n)
		> td:nth-child(n) {
		color: #000 !important;
	}

	.hr-zones-panel table tr.lt {
		background-color: #962f03b0 !important;
		color: #fff !important;
	}

	label,
	#performance-goals .timestamp,
	#performance-goals .label,
	.activity-summary time,
	.activity-summary .location,
	.inline-stats .label,
	.pagenav > li .title.small,
	.x-axis > .label,
	[class*='--stat-label'],
	[class*='Stat--stat-value-'],
	[class*='ActivityEntryBody__achievements-summary'],
	[class*='ActivityEntryBody-ActivityEntryBody__stat-label'],
	[class*='-LocationAndTime-LocationAndTime']
		> time,
	[class*='RelativeEffort-RelativeEffort-module__head'],
	[class*='SegmentDetailsSideBar--action-link']
		.light,
	.segment-data .inline-stats,
	[class*='CommentsThread__comment'] time,
	.activity-summary-v2 .count-label,
	.athlete-achievements time,
	[class*='CommentsThread-module__comment'] time {
		color: #999 !important;
	}

	[class*='src-components-media-EntryBody-EntryBody__entry-inset']
		> a:hover,
	[class*='-ChallengeCard-styles__card-title']
		a:hover,
	[class*='shared-ui-src-challenges']:hover,
	[class*='CommentsThread-module__athleteName']
		> a:hover,
	[class*='-CommentsThread-module__commentText']
		> .mention:hover,
	.src-components-TextWithIcon-TextWithIcon-module__textFields--a2gUr
		> a
		> div {
		color: #4285f4 !important;
	}

	#strava-map-controls > #create-route,
	.distribution-chart td,
	.uploads li.type-tag a,
	.flagged.error .marginless,
	.ui-dialog.sauce-dialog.sauce-sync-athlete-dialog
		.sync-logs
		.logs {
		color: #1a1a1a !important;
	}

	#global-header
		.nav-item:hover
		> a:not(.btn-default),
	footer.achievements
		.footer-achievements-title
		.segment-achievement,
	footer.achievements
		.footer-achievements-list
		.segment-achievement:hover,
	.name-col > div.name:hover,
	.active-tab
		> table
		> tbody:nth-child(n)
		> tr:nth-child(n)
		> td:nth-child(2),
	.sidebar .comparison table th,
	.drop-down-menu.drop-down-xs .selection,
	.sport-0.active-tab
		> table
		> tbody:nth-child(5)
		> tr:nth-child(n)
		> td:nth-child(2)
		> a:hover {
		color: #fc5200 !important;
	}

	[class*='Modal--close-button'] > svg,
	[class*='ActivityEntryBody--icon-wrapper--'],
	.chart-tooltip text,
	.chart-tooltip-label,
	.chart-tooltip-unit,
	[class*='packages-ui-Button-styles__bt'] > svg,
	[class*='ui-Modal-Modal-module__closeButton']:hover
		> svg,
	[class*='__commentReactionContainer']
		button:hover
		svg
		> path,
	[class*='Search_searchIcon']:hover > svg,
	.yAxis > g > g:nth-child(n) > text > tspan,
	.xAxis > g > g:nth-child(n) > text > tspan {
		fill: #fafafa !important;
	}

	#progress-goals .bg-circle,
	#basic-analysis text.static-info-box.value,
	#basic-analysis text.static-label-box.label,
	#basic-analysis .xaxis-container text,
	.elevation-chart .axis-tick-text,
	.css-tlfecz-indicatorContainer,
	._1NvngUATPAl1Fqr2rfhB1f svg,
	.Q3ynW3SmwW49b_A2mykmJ,
	._1i2y2pE00YIFH7lflo5-0w:not(:hover),
	#athlete-history-chart .axis-tick-text,
	#basic-analysis text.static-label-box.detail,
	#basic-analysis text.laps-label,
	#basic-analysis text.segments-label,
	#basic-analysis #effort-detail,
	[class*='ui-Modal-Modal-module__closeButton']
		> svg,
	[class*='EmptyTrophyCase_emptyTrophyCase__']
		svg,
	[class*='__commentReactionContainer']
		button
		svg
		> path,
	[class*='Search_searchIcon'] > svg {
		fill: #ccc !important;
	}

	.s-chart-tooltip-svg,
	#infoBox rect,
	.chart-tooltip,
	.elevation-chart .info-box,
	.activity-charts .info-box {
		fill: #1c1c1c !important;
	}

	#basic-analysis rect.static-info-box,
	#basic-analysis .xaxis-container .background,
	#basic-analysis rect.static-label-box,
	#athlete-history-chart #effort-box {
		fill: #2c2c2c !important;
	}

	#basic-analysis
		#elevation-chart
		rect.static-info-box {
		fill: #3c3c3c !important;
	}

	.elevation-chart .fill {
		fill: #6c6c6c6c !important;
	}

	#progress-goals .volume-bar-container,
	#progress-goals .bg-circle,
	#progress-goals .progress-bar-container {
		fill: #6c6c6c !important;
	}

	#fitness-freshness .stress-bar:nth-child(odd) {
		fill: #4c4c4c !important;
	}

	#fitness-freshness .stress-bar:nth-child(even) {
		fill: #3c3c3c !important;
	}

	#fitness-freshness .fitness-dot {
		fill: #f00;
		stroke-width: 6px;
		stroke: #f00;
	}

	#effort-lines > .vert-line,
	.horiz-line,
	.base-chart .grid-line,
	#infoBox rect,
	.chart-tooltip,
	#basic-analysis .xaxis-container .domain,
	#basic-analysis g .bottom-line.partial,
	#athlete-history-chart .axis,
	#athlete-history-chart #hgrid-selected,
	#athlete-history-chart #effort-box,
	.elevation-chart .axis,
	.elevation-chart .info-box,
	.elevation-chart .grid,
	#athlete-history-chart .vgrid,
	.base-chart .axis path,
	[class*='ElevationChart--axis'] path {
		stroke: #4c4c4c !important;
	}

	[class*='-ui-Carousel-Carousel-module__indicatorButton']:not(
			:hover
		)
		svg
		path {
		stroke: #ccc !important;
	}

	.content > form.search[action],
	footer.achievements.row,
	.show-hide-segments,
	section#segments footer,
	.no-segments {
		box-shadow: inset 0 1px 0 0 #4c4c4c !important;
	}

	table.segments tr.selected > td,
	table.hidden-segments tr.selected > td,
	table.laps-list tr.selected > td {
		box-shadow: inset 1px 0 1px 1px #d84e0b !important;
	}

	.icon-elliptical,
	.icon-run,
	.icon-run-v2,
	.icon-run-v3,
	.icon-soccer,
	.icon-stairstepper,
	.icon-virtualrun,
	.icon-sail,
	.icon-swim,
	.icon-swim-v2,
	.icon-swim-v3,
	.icon-watersport,
	image.sport-type,
	.icon-nav-more,
	.icon-other-v3,
	.icon-nav-training,
	.tab .app-icon[class*='icon'],
	.icon-ride,
	.icon-ride-v2,
	.icon-ride-v3,
	.icon-virtualride,
	.icon-bike,
	.follow-action .selection.gear::after,
	.following .action .selection.gear::after,
	.icon-search,
	.nav-arrow-icon.next,
	.nav-arrow-icon.prev,
	#notifications-button .icon-notification,
	#global-header
		.nav-group
		.drop-down-menu
		.selection::after,
	.icon-edit,
	.icon-walk,
	.icon-workout,
	.sharing .icon-share,
	#kudos .icon-kudo,
	#comments .icon-comment,
	.sprite:not(
			.connections-list .sprite,
			.photo-upload .avatar .add
		),
	.with-sprite::after,
	[class*='icon-weather-day'],
	.app-icon.icon-caret-right,
	.app-icon.icon-caret-left,
	.app-icon.icon-star,
	#map-control-container #create-route,
	#toggle-fullscreen,
	.leaflet-control-attribution::after,
	.leaflet-control-zoom-in,
	.leaflet-control-zoom-out,
	.leaflet-popup-close-button,
	.controls-block #search > img,
	.app-icon.icon-close,
	.app-icon.icon-remove,
	.icon-sm.icon-dark,
	.invite-friends
		+ .drop-down-menu
		> div:not(:hover)::after,
	.mapboxgl-ctrl-icon,
	#search-results thead button::after,
	.app-icon.icon-info-xsmall,
	.activity-sprite.leaderboard,
	.app-icon.icon-strong-caret-down,
	.app-icon.icon-strong-caret-up,
	.app-icon.icon-caret-down,
	.app-icon.icon-hike,
	.app-icon.icon-hike-v3,
	.location > .app-icon.icon-location,
	[class*='styles_navItem']
		> a[class*='Button_default_']
		> img,
	.nav-item
		> .experiment
		> img[alt]:not(
			#global-header .user-nav .upgrade img
		),
	[class*='ActionsDropdown--more-icon'][role='button'],
	#sauce-infopanel
		table
		td
		.sauce-peak-rank
		.place,
	#sauce-infopanel
		table
		td
		.sauce-peak-rank
		.category,
	#main
		> div
		> div
		> div:nth-child(3)
		> div
		> ul
		> li:nth-child(n),
	#container-nav
		> ul.global-nav.nav-group
		> li:nth-child(n)
		> ul
		> li:nth-child(n)
		> a
		> img,
	#global-header .upload-menu .options .app-icon,
	.css-1o7vvpb-menu,
	.StravaMediaLightbox--more-options-dropdown-list--mS7Sa,
	.sauce-sync-icon svg[data-icon='check'] {
		filter: invert(100%) !important;
	}

	.slide-menu .selection::after,
	img[class*='SimplePromo--logo--'],
	[class*='--activity-icon--'],
	.uploads li.type-tag a,
	.icon-segment-marker-white {
		filter: invert(75%) !important;
	}

	.sprite.wrench {
		filter: invert(25%) !important;
	}

	table.segments tr.selected div.name,
	.button {
		font-weight: 300 !important;
	}

	.sauce-segment-score {
		font-weight: 600 !important;
		font-size: 10px;
	}

	#sauce-infopanel
		table
		td
		.sauce-peak-rank
		.place,
	#sauce-infopanel
		table
		td
		.sauce-peak-rank
		.category {
		font-size: 8px;
	}

	.btn-link:hover,
	#search-results
		> tbody
		> tr:nth-child(n)
		> td.view-col.col-actions
		> ul
		> li:nth-child(n)
		> div
		> button:hover,
	#search-results
		> tbody
		> tr:nth-child(n)
		> td.view-col.col-actions
		> ul
		> li:nth-child(n)
		> div
		> ul
		> li:nth-child(n)
		> button:hover,
	#search-results
		> tbody
		> tr:nth-child(n)
		> td.view-col.col-actions
		> ul
		> li:nth-child(n)
		> div
		> ul
		> li:nth-child(n)
		> a:hover,
	#search-results
		> tbody
		> tr:nth-child(n)
		> td.view-col.col-title
		> a:hover,
	body
		> div.fancybox-overlay.fancybox-overlay-fixed
		> div
		> div
		> div
		> div
		> div
		> div:nth-child(1)
		> div:nth-child(2),
	.elevateExtendedData .gridDataContainer:hover,
	.elevateExtendedData td:hover,
	#sauce-performance
		> nav
		section
		row.full
		> header,
	#sauce-performance
		> main
		section.sauce-panels
		.sauce-panel
		> header,
	.\\------packages-ui-Tabs-Tabs-module__tab--gFjuZ
		svg:hover,
	#relative-effort
		> div
		> div.WeeklySummary--base--YQgHZ
		> div.WeeklySummary--week-details--7Fo3D
		> div.WeeklySummary--week-insight--7Xvc7
		> div
		> div.text-callout.WeekInsight--title--CitJN,
	#relative-effort
		> div
		> div.WeeklySummary--base--YQgHZ
		> div:nth-child(n)
		> table
		> tbody
		> tr:nth-child(n)
		> td.Activities--name--YwPVu
		> a:hover,
	#heading
		> div
		> div.row.no-margins.activity-summary-container
		> div.spans8.activity-stats.mt-md.mb-md
		> div.section.more-stats
		> table
		> tbody:nth-child(n)
		> tr
		> td:nth-child(n) {
		color: #fc5200 !important;
	}

	.summaryGrid .summaryGridDataContainer,
	.inline-stats strong,
	.inline-stats b {
		color: #d84e0b;
		font-weight: 700;
	}

	.ui-dialog.sauce-dialog
		.sauce-key-value.sauce-vertical
		input::placeholder,
	.ui-dialog.sauce-dialog
		.sauce-key-value.sauce-vertical
		input {
		color: #000 !important;
		font-weight: 750 !important;
	}

	.summaryGrid .summarySubGridTitle,
	.elevateExtendedData .gridUnits,
	#sauce-performance,
	#heading
		> div
		> div.row.no-margins.activity-summary-container
		> div.spans8.activity-stats.mt-md.mb-md
		> div.section.more-stats
		> table
		> tbody:nth-child(n)
		> tr
		> td:nth-child(n)
		> abbr,
	abbr[title],
	abbr[data-original-title],
	.summaryGridUnits {
		color: #3c66ac;
	}

	.summaryGrid .summaryGridTitle,
	.ActivitySummary--impact--QUNSY,
	#relative-effort
		> div
		> div.WeeklySummary--base--YQgHZ
		> div.WeeklySummary--week-details--7Fo3D
		> div.WeeklySummary--week-insight--7Xvc7
		> div
		> div.text-caption1.WeekInsight--description--V1GNG {
		color: #b8b8b8;
	}

	#heading
		> div
		> div.row.no-margins.activity-summary-container
		> div.spans8.activity-stats.mt-md.mb-md
		> div.section.more-stats
		> table
		> tbody:nth-child(n)
		> tr
		> th,
	#heading
		> div
		> div.row.no-margins.activity-summary-container
		> div.spans8.activity-stats.mt-md.mb-md
		> div.section.more-stats
		> table
		> thead
		> tr
		> th:nth-child(n) {
		color: #b8b8b8 !important;
	}

	.elevateExtendedData .gridTitle {
		color: #962f03b0;
	}

	body
		> div.fancybox-overlay.fancybox-overlay-fixed
		> div
		> div,
	#sauce-performance,
	#sauce-performance
		> nav
		.summary
		section
		> header,
	#sauce-performance a.view-control,
	#sauce-performance
		> main
		section.sauce-panels
		.sauce-panel
		> header,
	table.unstyled td,
	table.unstyled th,
	body
		> div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.sauce-dialog.sauce-sync-athlete-dialog.ui-dialog-buttons.ui-draggable.ui-resizable,
	.more-stats > table,
	.ui-dialog.sauce-dialog,
	#sauce-performance > aside.details,
	#sauce-performance a.view-control svg,
	#sauce-performance
		> main
		> header.filters
		.window-controls,
	.fa-secondary,
	.sauce-enabled dialog.sauce-attr.anchored,
	#sauce-performance
		> main
		section.sauce-panels
		.sauce-panel-content,
	#sauce-performance .btn,
	.leaflet-map-pane canvas,
	#compare-outer,
	#sidebar {
		filter: invert(1) hue-rotate(180deg);
	}

	#sauce-performance
		.filters
		.range-selector
		select:nth-child(n)
		> option,
	.loading-mask > select > option:nth-child(n),
	.ftue-education-lightbox > div > div.inset {
		background: #000;
	}

	#sauce-performance
		> main
		section.sauce-panels
		.sauce-panel
		.chart-tooltip
		.data-label
		small {
		color: #fc5200 !important;
	}

	.show-more-js,
	.show-more-js.hidden {
		position: inherit;
		z-index: 999;
	}

	body
		> div.fancybox-overlay.fancybox-overlay-fixed
		> div
		> div
		> div
		> div
		> div
		> div:nth-child(1)
		> div:nth-child(3)
		> a,
	#container-nav
		> ul.user-nav.nav-group
		> li.nav-item.upgrade
		> a {
		display: none;
	}

	body
		> div.fancybox-overlay.fancybox-overlay-fixed
		> div
		> div
		> div
		> div
		> div
		> h2:nth-child(8),
	#dated-ftp-contents > div > table > thead > tr {
		background-color: #fc5200 !important;
	}

	body
		> div.fancybox-overlay.fancybox-overlay-fixed
		> div
		> div
		> div
		> div
		> div
		> h2:nth-child(10),
	.src-components-BeesAdpTable-BeesAdpTable-module__adpTable--m7oGI
		.src-components-BeesAdpTable-BeesAdpTable-module__highlightedRow--y7wRu,
	.ui-dialog.sauce-dialog.sauce-sync-athlete-dialog
		header.title {
		background-color: #962f03 !important;
	}

	.ride table.segments th,
	.ride table.segments td,
	.ride table.hidden-segments th,
	.ride table.hidden-segments td,
	.run table.segments th,
	.run table.segments td,
	.run table.hidden-segments th,
	.run table.hidden-segments td,
	.swim table.segments th,
	.swim table.segments td,
	.swim table.hidden-segments th,
	.swim table.hidden-segments td {
		padding-right: 0;
	}

	.Activities--table--ysu9S tr:nth-child(2n) > td,
	.src-components-BeesAdpTable-BeesAdpTable-module__adpTable--m7oGI
		tr:nth-child(even),
	.src-components-BeesAdpApp-BeesAdpApp-module__mapAndElevation--D1Fjo,
	#best-efforts-adp
		> div
		> div
		> div:nth-child(n)
		> table
		> thead
		> tr
		> th:nth-child(n),
	table.laps-list tr:nth-child(even),
	.MediaUploader--dropzone--sS1mw,
	.Thumbnail--spinner-container--i5R4D,
	.Popup--contents--89pnQ {
		background-color: #2c2c2c;
	}

	#best-efforts-adp
		> div
		> div
		> div:nth-child(n)
		> table
		> thead
		> tr
		> th:nth-child(n),
	table.laps-list tr:nth-child(n):hover {
		background-color: #962f03;
	}

	.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__stat--SvAS3.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__textRight--A4rwD
		> div.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__statText--zlBKv
		> button,
	#tabs--1--panel--0
		> div
		> div
		> div:nth-child(2)
		> div:nth-child(4)
		> div
		> div
		> div
		> svg,
	.device-section > div > div.gear.spans8,
	#cpcurve-options > div {
		background-color: #2c2c2c !important;
	}

	#sauce-performance
		> nav
		section
		row.full
		> header,
	#sauce-performance
		> main
		section.sauce-panels
		.sauce-panel
		> header {
		background-color: #fff0 !important;
	}

	.recharts-area-area,
	.sauce-panel > header {
		background-image: unset !important;
		fill: #962f03b0 !important;
	}

	#sauce-performance
		> nav
		section
		row.full
		.backdrop-icon {
		opacity: 100%;
	}

	#sauce-kudo-all button:hover,
	.btn-icon.sauce-invoke:hover,
	.half > a:hover,
	.spans6 > select {
		background-color: #fc5200 !important;
		color: #fff !important;
	}

	#view
		> section
		> div
		> table
		> tfoot
		> tr
		> td
		> p
		> a {
		color: red !important;
	}

	.summarySubGridTitle {
		color: rgb(255 241 131 / 69%) !important;
	}

	#view
		> section
		> div
		> table
		> tfoot
		> tr
		> td {
		background: #e3e3e3;
	}

	.gear.bikes.hidden {
		border: medium dashed #fc5200;
		border-top-color: #fc5200 !important;
		border-radius: 25px;
		padding: 10px;
	}

	.gear.bikes.hidden > h3 {
		color: #fc5200;
		font-weight: 800;
		font-size: 26px;
		text-align: center;
		text-decoration: underline;
	}

	.sidebar .gear td:first-child {
		white-space: normal;
	}

	.sidebar .gear td:last-child {
		color: #fc5200;
	}

	.btn-icon-right .app-icon-wrapper {
		margin: 0;
	}

	a.minimal:visited {
		color: #3c66ad;
	}

	a.minimal:visited:hover {
		color: #fc5200;
	}

	.------packages-feed-ui-src-components-ActivityEntryBody-ActivityEntryBody-module__appIconWrapper--DEx9Z
		> svg
		> path {
		color: #fff77a;
	}

	.activity-description.description-overflow:not(
			.expanded
		)::after {
		display: none;
	}

	#fitness-freshness .line-chart-fitness {
		stroke: #5081a5;
	}

	#fitness-freshness .line-chart-fitness-fill {
		fill: #b8c9d6;
		opacity: 20%;
	}

	#fitness-freshness .line-chart-freshness {
		stroke: #f754d9;
	}

	#fitness-freshness .line-chart-form {
		stroke: #f1ad30;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(1)
		.toggle-containers {
		color: #5081a5;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(1)
		.toggle-containers
		> p::before {
		background-color: #5081a5 !important;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(2)
		.toggle-containers {
		color: #f754d9;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(2)
		.toggle-containers
		> p::before {
		background-color: #f754d9 !important;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(3)
		.toggle-containers {
		color: #f1ad30;
	}

	.fitness-data
		ul.list-stats
		li:nth-child(3)
		.toggle-containers
		> p::before {
		background-color: #f1ad30 !important;
	}

	.fancybox-opened .fancybox-skin {
		-webkit-box-shadow: 0 10px 25px #fc52004a;
		-moz-box-shadow: 0 10px 25px #fc52004a;
		box-shadow: 0 10px 25px #fc52004a;
	}

	/* For WebKit browsers (e.g., Chrome, Safari) */
	::-webkit-scrollbar {
		width: 12px;
	}

	::-webkit-scrollbar-track {
		background: #000000a1;
	}

	::-webkit-scrollbar-thumb {
		border: 3px solid #fc5200;
		border-radius: 6px;
		background-color: #000;
	}

	/* For Edge, IE */
	body {
		-ms-overflow-style: -ms-autohiding-scrollbar;
	}

	.fancybox-overlay-fixed
		> div
		> div
		> div
		> div::-webkit-scrollbar-thumb {
		border: 3px solid #fc5200;
		border-radius: 6px;
		background-color: #fff;
	}

	.elevateExtendedData
		div::-webkit-scrollbar-thumb {
		border: 1px solid #fc5200;
		background-color: #fff;
	}

	.elevateExtendedData div::-webkit-scrollbar {
		width: 6px;
	}

	.elevateExtendedData
		div::-webkit-scrollbar-track {
		background: #ffffffb8;
	}

	.fancybox-overlay-fixed
		> div
		> div
		> div
		> div::-webkit-scrollbar-track {
		background: #fafafa9c;
	}

	#similar-activities-section
		> div.pinnable-anchor {
		filter: invert(1) hue-rotate(180deg) !important;
		color: black !important;
	}

	#similar-activities-section
		#similar-activities-chart-footer
		.trending-average
		a,
	#similar-activities-section
		.efforts-table
		td.date-column {
		color: #fc5200 !important;
	}

	body
		> div.lightbox.trend-education-lightbox
		> div
		> div.inset {
		background: black;
		color: white;
	}

	.base-chart .axis text,
	#similar-activities-section
		#similar-activities-chart-container
		#similar-activities-chart
		.date-tick {
		fill: #fc5200ba;
	}

	#similar-activities-chart
		> svg
		> g
		> g:nth-child(3)
		> g
		> text.annotation-pace {
		fill: red;
	}

	#similar-activities-chart
		> svg
		> g
		> g:nth-child(5)
		> g
		> text.annotation-pace {
		fill: #fc5200;
	}

	#similar-activities-chart
		> svg
		> g
		> g:nth-child(4)
		> g
		> text.annotation-pace {
		fill: #3c66ac;
	}

	.base-chart .axis text,
	#similar-activities-section
		#similar-activities-chart-container
		#similar-activities-chart
		.date-tick,
	#similar-activities-section
		#similar-activities-chart-container
		#similar-activities-chart
		.annotation-pace,
	#similar-activities-section
		#similar-activities-chart-container
		#similar-activities-chart
		.annotation {
		font-size: 14px;
	}

	table.hoverable > tbody > tr.selected {
		background-color: #fc520029;
	}

	.area-chart-curr {
		stroke-width: 0;
		fill: #962f03b0;
	}

	.base-chart .crossbar {
		stroke: #fff77a4f;
		stroke-width: 1px;
		pointer-events: none;
	}

	.base-chart .title {
		color: #fff77a99;
	}

	.base-chart .crossbar-text {
		fill: #fc5200;
		background-color: black;
		padding: 2px;
		text-shadow:
			-1px -1px 0 #000,
			1px -1px 0 #000,
			-1px 1px 0 #000,
			1px 1px 0 #000,
			-2px -2px 0 #000,
			2px -2px 0 #000,
			-2px 2px 0 #000,
			2px 2px 0 #000,
			0 0 5px #000;
		/* Adjust the last value to make the shadow thicker */
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
