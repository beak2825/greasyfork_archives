// ==UserScript==
// @name trainingpeaks.com - Dark Mode
// @namespace typpi.online
// @version 20241107.04.57
// @description trainingpeaks.com Dark Mode
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.trainingpeaks.com/*
// @downloadURL https://update.greasyfork.org/scripts/518539/trainingpeakscom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518539/trainingpeakscom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(html:not([stylus-iframe]), img, svg, video):not(png),
	.tomahawkButton,
	.profilePicture > fieldset > div {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	/* Ensure background images are not inverted */
	:is(
			html:not([stylus-iframe]),
			img,
			svg,
			video,
			#workOutQuickView
				> div.QVHeader
				> div.QVHeaderItemsContain.cf
				> div.workoutBarView
				> div:nth-child(2)
				> div
				> div
		):not(z#z.z[z]) {
		background-color: inherit !important;
	}

	.appContainerMainContentContainer,
	.userControls,
	.todaysWorkouts > div:nth-child(n) > div.workoutHeader {
		background: #fff !important;
	}

	#wrapper
		> div
		> div
		> div.appContainerLibrayAndContentContainer
		> div.appContainerMainContentContainer
		> div
		> div
		> div.trainingPeaksAthleteHomeHeader
		> div.athleteName,
	.value {
		color: #9612b2 !important;
		text-decoration-line: underline;
		text-decoration-color: blue;
	}

	.appHeaderLogoLargeScreen,
	.appHeaderUserPhoto,
	span,
	button,
	.athletePhoto > div > div,
	.tpVirtualButtonContainer
		> button
		> svg
		> path:nth-child(n) {
		filter: invert(1) hue-rotate(180deg);
	}

	a:hover,
	button:hover {
		text-decoration-line: underline !important;
		text-decoration-color: #b41289 !important;
	}

	.tabbedLayoutNav li,
	.overlayBoxBody > ul > li.active > span {
		color: white;
	}

	.tabbedLayoutNav li:hover,
	.overlayBoxBody > ul > li.active > span:hover {
		color: #006bb9;
	}

	.css-37jdci-MuiTypography-root.title.newActivityUItitle.MuiTypography-H6.MuiTypography-root,
	.zoneSetContain.heartrate
		> fieldset
		> label:nth-child(n)
		> span,
	.zones.zonesConfigGroupView.ui-sortable
		> div:nth-child(n)
		> span,
	span.zoneEntryTo,
	span.zoneSetTitle {
		color: white;
	}

	.MuiTypography-root {
		color: #cb0808;
	}

	.units {
		color: #007580 !important;
	}

	.zoneSetContain.heartrate
		> fieldset
		> label:nth-child(n)
		> input,
	.heartRateZones
		> div
		> div
		> div.zones.zonesConfigGroupView.ui-sortable
		> div:nth-child(n)
		> input,
	.zoneSetContain.power > fieldset > label > input,
	.zones.zonesConfigGroupView.ui-sortable
		> div:nth-child(n)
		> input.numberInput.tpSettingsInput.min.first {
		color: black;
	}

	div.workoutStatsColumn.workoutStatsUnitLabel > label,
	div.workoutStatsColumn.workoutStatsLabel > label,
	div.workoutStatsColumn.workoutStatsMinMaxAvgLabel > label,
	div.equipment > div > div:nth-child(2) > div > label,
	div.equipment > div > div:nth-child(3) > label {
		color: green;
	}

	.activityHeader.metricsTileHeader
		> div
		> div
		> span.metricKeyStat.activitySubText,
	.activityHeader.metricsTileHeader
		> div
		> span:nth-child(n) {
		color: red;
	}

	.workoutTagsContainer
		> div
		> div
		> div:nth-child(n)
		> span,
	.dreamingSeasonPencilBannerContainer
		> div
		> span.MuiTypography-root.MuiTypography-body1.css-1njuh5f-MuiTypography-root,
	.dreamingSeasonPencilBannerContainer
		> div
		> span.MuiTypography-root.MuiTypography-body1.css-1d9r2xn-MuiTypography-root,
	.form.TSB > span.label,
	#workOutQuickView
		> div.QVHeader
		> div.QVHeaderItemsContain.cf
		> div.dateAndTime
		> div
		> div
		> div
		> span,
	.activityHeader.metricsTileHeader
		> div
		> div
		> span:nth-child(1) {
		color: white;
	}

	.workoutBarView > div:nth-child(2) > div > div {
		border: white !important;
		border-style: dashed !important;
		border-color: #cb0808 !important;
	}

	.css-70qvj9.MuiBox-root.athleteHealthMetricsCalendarCardHeaderRight
		> svg
		> path {
		fill: #ff0000 !important;
		/* changes the color to red */
	}

	.activities
		> div:nth-child(n)
		> div
		> div
		> div.lowerWorkoutCard
		> div.PRCommentRPEContainer {
		filter: invert(20%) sepia(90%) saturate(700%)
			hue-rotate(180deg) brightness(90%) contrast(90%);
	}

	.emojiScale > div:nth-child(n) {
		filter: invert(70%) sepia(100%) saturate(500%)
			hue-rotate(18deg) brightness(50%) contrast(100%);
	}

	#chartsContainer > div > div.dashboardChart {
		border: 2px solid pink;
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
