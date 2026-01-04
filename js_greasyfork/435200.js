// ==UserScript==
// @name     	Canvas LMS Tweaks Userscript
// @namespace	https://github.com/Enchoseon/canvas-lms-tweaks-userscript/blob/main/canvas-lms-tweaks.user.js
// @version  	0.1.3
// @description  Various client-side tweaks & bug-fixes to Canvas LMS.
// @author   	Enchoseon
// @include  	*instructure.com*
// @include  	*instructuremedia.com*
// @run-at   	document-start
// @grant    	none
// @downloadURL https://update.greasyfork.org/scripts/435200/Canvas%20LMS%20Tweaks%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/435200/Canvas%20LMS%20Tweaks%20Userscript.meta.js
// ==/UserScript==

(function () {
	"use strict";
	// ===
	// CSS
	// ===
	// Main LMS
	if (window.location.href.includes("instructure.com")) {
    	injectCSS(`
        	/* Responsiveness / Visibility */
        	.planner-completed-items { /* UX: Make completed items in the dashboard in list view greyed out unless hovered over */
            	opacity: 0.21 !important;
            	transition: opacity 169ms !important;
        	}
        	.planner-completed-items:hover {
            	opacity: 0.99 !important;
        	}
        	div.NotificationBadge-styles__activityIndicator.NotificationBadge-styles__hasBadge div span { /* UX: Make notification bubbles green & bouncy */
            	zoom: 125% !important;
            	background-color: lightgreen !important;
            	-webkit-animation: pulsate-fwd 690ms ease-in-out infinite both !important;
            	animation: pulsate-fwd 690ms ease-in-out infinite both !important;
        	}
        	body.primary-nav-transitions .menu-item__text { /* UX: Replace 600ms bounce animation with a faster sliding one */
            	transition: transform 69ms cubic-bezier(0.21, 0.420, 0.69, 1.275),opacity 42ms !important;
            	transition-delay: 21ms !important;
        	}
        	/* Debloat */
        	#immersive_reader_mount_point, /* UX: Remove the immersive reader button, which is just another eyesore unless you actually use it */
        	#new_activity_button, /* UX: Remove the new activity button. The new activity button doesn't work because most teachers don't remove/delete old assignments—It's clutter that links to clutter */
        	#footer, /* UX: Remove the footer, which is pointless linkspam for Instructure LTI's social media & legalese that noone reads */
        	#global_nav_history_link, /* UX: Remove the "History" button from the leftmost sidebar. Nobody uses this feature */
        	#global_nav_help_link, /* UX: Remove "Help" button from leftmost sidebar. Using this userscript means you're already proficient at using Canvas. Also, the "Ask Your Instructor a Question" feature is obsoleted by emailing—I also doubt you even knew it existed */
        	#primaryNavToggle, /* UX: Removes expand toggle for leftmost sidebar */
        	#conversation-actions button[disabled], /* UX: Remove buttons that were already disabled by your organization in the inbox—Why those basic features would be disabled is beyond me. */
        	#course_show_secondary a.btn.button-sidebar-wide , /* UX: Remove "View Course Stream", "View Course Calendar", "View Course Notifications" buttons from course view */
        	a.ic-app-header__logomark { /* UX: Remove the clipart-looking icon that is your organization's logo from the leftmost sidebar */
            	display: none !important;
        	}
        	div.Grouping-styles__root.planner-grouping a, div.ic-DashboardCard__header_image { /* UX: Remove class banner images from dashboard in list view & card view (makes them solid colors) */
            	background-image: none !important;
            	height: auto !important;
        	}
        	/* Animations */
        	@-webkit-keyframes pulsate-fwd {
            	0% {
                	-webkit-transform: scale(1);
                	transform: scale(1);
            	}
            	50% {
                	-webkit-transform: scale(1.1);
                	transform: scale(1.1);
            	}
            	100% {
                	-webkit-transform: scale(1);
                	transform: scale(1);
            	}
        	}
        	@keyframes pulsate-fwd {
            	0% {
                	-webkit-transform: scale(1);
                	transform: scale(1);
            	}
            	50% {
                	-webkit-transform: scale(1.1);
                	transform: scale(1.1);
            	}
            	100% {
                	-webkit-transform: scale(1);
                	transform: scale(1);
            	}
        	}
    	`);
	}
	// Video Player
	if (window.location.href.includes("instructuremedia.com")) {
    	injectCSS(`
        	/* Responsiveness / Visibility */
        	.dVRGv_crZr { /* Bug: Video player bar blocks bottom of the video & is not easily dismissed (problematic when pausing to take notes); Fix: The video player bar is now see-through when you're not hovering over it */
            	opacity: 0.25 !important;
            	transition: opacity 250ms !important;
        	}
        	.dVRGv_crZr:hover {
            	opacity: 0.95 !important;
        	}
    	`);
	}
	// ==
	// JS
	// ==
	window.addEventListener("DOMContentLoaded", function () {
    	if (document.getElementById("announcementWrapper") !== null) { // Bug: Scrolling to the top of the announcements causes the entire page to jump downwards (making it hard to close announcements); Fix: All wheel event listeners are now disabled when on the dashboard—May cause problems.
        	window.addEventListener(
            	"wheel",
            	function (event) {
                	event.stopImmediatePropagation();
            	},
            	true
        	);
    	}
    	document.getElementsByTagName("body")[0].classList.remove("primary-nav-expanded"); // UX: Always collapse leftmost sidebar
	});
	window.addEventListener("load", function () {
    	const y = document.getElementById("dashboard_header_container").getBoundingClientRect().top + window.scrollY; // UX: When visiting the dashboard, automatically scroll down to the actual dashboard rather than the announcements
    	window.scroll({
        	top: y,
        	behavior: "smooth",
    	});
	});
	// =========
	// Functions
	// =========
	function injectCSS(css) { // Inject CSS into the header
    	var s = document.createElement("style");
    	s.setAttribute("type", "text/css");
    	s.appendChild(document.createTextNode(css));
    	document.getElementsByTagName("head")[0].appendChild(s);
	}
})();
