// ==UserScript==
// @name         Decreased Productivity Plus
// @icon         http://i.imgur.com/ffgP58A.png
// @namespace    skoshy.com
// @version      0.9.15
// @description  Makes webpages more discreet
// @author       Stefan Koshy
// @match        *://*/*
// @match        http*://*.messenger.com/*
// @match        http*://*.slack.com/messages/*
// @match        http*://mail.google.com/mail/*
// @match        http*://hangouts.google.com/webchat/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/21582/Decreased%20Productivity%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/21582/Decreased%20Productivity%20Plus.meta.js
// ==/UserScript==

var DEBUG_MODE = false;
var SCRIPT_ID = 'dpplus';
var CURRENT_SITE = getCurrentSite();

// From https://gist.github.com/arantius/3123124
// These are replacement functions for GreaseMonkey scripts, but the only work on a single domain instead of being cross domain
// Todo: Implement solution that works cross domain

if (typeof GM_getValue == 'undefined') {
	function GM_getValue(aKey, aDefault) {
		'use strict';
		let val = localStorage.getItem(SCRIPT_ID + aKey);
		if (null === val && 'undefined' != typeof aDefault) return aDefault;
		return val;
	}
}

if (typeof GM_setValue == 'undefined') {
	function GM_setValue(aKey, aVal) {
		'use strict';
		localStorage.setItem(SCRIPT_ID + aKey, aVal);
	}
}

var css = {};
css.defaults = {};

css.defaults.imageOpacity = '.05';
css.defaults.imageOpacityHover = '.4';

css.defaults.imageOpacitySmall = '.2';
css.defaults.imageOpacitySmallHover = '.55';

css.overrides = {};
css.overrides.disableUnfocusedTransparency = [
	'gmailhangouts'
];

css.common = {};
css.common.css = `
html {
	transition: opacity .1s ease-in-out;
}

html.unfocused {
	opacity: .1;
}

html, body, div, p, span, a, table, td {
	font-family: Arial, sans-serif !important;
	font-size: 13px !important;
	font-weight: 400 !important;
	color: #222 !important;
	background-color: rgba(255, 255, 255, .3) !important;
}

img, figure, video
{opacity: {{imageOpacity}};}

img:hover, figure:hover, video:hover
{opacity: {{imageOpacityHover}};}

`;
css.messenger = {};
css.messenger.css = `
._1z8r img {font-size: 30px !important; opacity: .2;}  /* Reaction images (emoji) in the react popup */

._55lt img, /* Left hand avatars */
._4ld- div[style]:not([class]), /* Left hand avatars (group icons) */
._3xn1, /* Link Thumbnails */
._4tsk, /* Photo Messages */
.img, /* Other images */
[role="img"], /* more images */
._2pon /* Little blue messenger overlays */
{opacity: {{imageOpacity}};}

._2560, /* Small Emoji */
._1ifu /* Medium Emoji (32x32) */
{ opacity: .2; }

._55lt img:hover,
._4ld- div[style]:not([class]):hover,
._3xn1:hover,
._4tsk:hover,
.img:hover,
[role="img"]:hover,
._2pon:hover
{opacity: {{imageOpacityHover}};}

._1a-, /* small fb emojis */
.emoticon, /* embedded-in-messages emoji */
._5qi2 /* medium fb emojis standalone */
{opacity: {{imageOpacitySmall}};}

._1a-:hover,
.emoticon:hover,
._5qi2:hover,
{opacity: {{imageOpacitySmallHover}};}

/* Unread Messages override */
._1ht3 * { font-weight: bold !important; }

._52mr              /* Get rid of messages background */
{ background-color: transparent !important; }

._hw2 ._53ij                     /* "Delete" Message Background Fix */
,.uiTooltipX .tooltipContent     /* Various Tooltips */
{background-color: rgba(0,0,0,.1) !important;}
`;

css.slack = {};
css.slack.css = `
#col_channels_bg, #col_channels, #team_menu, #quick_switcher_btn, #team_menu_overlay, #col_channels_overlay {
	background: #f9f9f9 !important;
} /* sidebar background */

#quick_switcher_btn #quick_switcher_label, #quick_switcher_btn .ts_icon, #quick_switcher_btn #quick_switcher_shortcut, body #team_menu_user_name {
	color: #222 !important;
}

#team_header_user_name, /* username in sidebar */
body .channels_list_holder ul li .primary_action.im_name > *:not(.unread_highlights) /* Items in sidebar */
{color: black !important;}

body #channels_scroller.show_which_channel_is_active ul li.active .primary_action.im_name > *:not(.unread_highlights) /* Selected item in sidebar */
{color: black !important;}

#col_channels h2 {
	color: black !important;
} /* section headers in sidebar */

#channels_scroller.show_which_channel_is_active ul li.active a.channel_name, #channels_scroller.show_which_channel_is_active ul li.active a.group_name, #channels_scroller.show_which_channel_is_active ul li.active a.im_name, #channels_scroller.show_which_channel_is_active ul li.active a.mpim_name, #channels_nav ul li.unread_link.active a {
	background: #eee;
} /* highlighted things in slack, like the current tab you're looking at */

body:not(.sorting_mode) .channels_list_holder ul li a:hover, #monkey_scroll_wrapper_for_channels_scroller .monkey_scroll_bar,
body:not(.loading) #team_menu:hover, body:not(.loading) #team_menu.active, #quick_switcher_btn:hover, #quick_switcher_btn:active {
	background: #ddd;
} /* highlighted things, hovering over them */

#channel_scroll_up /* the MORE UNREADS thing that shows up in the chat list when there's unread messages */
{top: 10px;}

.ts_tip .ts_tip_multiline_inner, .ts_tip:not(.ts_tip_multiline) .ts_tip_tip /* tooltip, like when mousing over a message reaction */
{background: rgba(0,0,0,.65) !important; border: 1px solid gray; color: white !important;}

#msgs_div img, #msgs_div figure, /* most images */
#msgs_div .member_image /* avatars in message panel */
{opacity: {{imageOpacity}};}

#msgs_div img:hover, #msgs_div figure:hover,
#msgs_div .member_image:hover
{opacity: {{imageOpacityHover}};}
`;

css.gmail = {};
css.gmail.css = `
.wl /*Background color */
{ background: white !important; }
.zE /* Unread Email rows */,
.yO /* Read Email Rows */
{ background: transparent !important; }
.TI .T-I-ax7, .z0 .T-I-ax7, .G-atb .T-I-ax7 /* Buttons, like the settings button, refresh, labels button, etc */
{ background: #ddd !important; }
.ZY /* Header that shows up if you're forwarding any email to a new email address */
{background-color: rgba(255,221,221,.2);}
`;
css.gmailhangouts = {};
css.gmailhangouts.css = `
.TsiDff /* Whole chat box */
{opacity: .2; transition: opacity .1s ease-in-out;}
.TsiDff:hover /* Hover over chat box */
{opacity: 1;}
.Ik /* Chat header */
{background: rgba(0,0,0,.5) !important;}
.uB /* Chat header, new message */
{background: rgba(83, 169, 63,.6) !important; border-bottom-color: rgba(83, 169, 63,.6);}
.GN * /* Chat header text */
{color: white !important;}
div.EV, /* Chat top button bar */
.iN /* Chat background */
{background: rgba(255, 255, 255, .9) !important;}
.Ia .Bb /* Chat list contact */
{transition: background .1s ease-in-out;}
.Ia .Bb:hover, .Ia .Bb:focus /* Chat list contact, hovering */
{background: rgba(35,35,35,.1);}
.Ia .Bb>.R8jgRe>.ng /* Chat list, contact text */
{text-shadow: none;}
`;
css.inbox = {};
css.inbox.css = `
.ss, .qG, .qG * /* Bolded Messages */
{ font-weight: bold !important; }
`;
css.none = {};
css.none.css = ``;


function addGlobalStyle(css, className, enabled, id) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = id;
	style.className = className;
	head.appendChild(style);
	style.disabled = !enabled;
}

function getCssStyleElements() {
	return document.getElementsByClassName(SCRIPT_ID+'-css');
}

function getBgElements() {
	return document.querySelectorAll('[style*="url("]');
}

function getGradientString() {
	return 'linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.7) 100%), ';
}

function enableStyle() {
	var cssToInclude = '';
	var bgEls = getBgElements();
	var gradientString = getGradientString();

	addGlobalStyle(parseCSS(
		css.common.css + css[CURRENT_SITE].css
	), SCRIPT_ID+'-css', true, SCRIPT_ID+'-css');

	// enable all background image manipulations
	for (var i = 0; i < bgEls.length; i++) {
		bgEls[i].attributes.origBackgroundImage = bgEls[i].style.backgroundImage;
		bgEls[i].style.backgroundImage = gradientString + bgEls[i].style.backgroundImage;
	}
}

function disableStyle() {
	var cssEls = getCssStyleElements();
	var bgEls = getBgElements();

	for (let i = 0; i < cssEls.length; i++) {
		cssEls[i].parentNode.removeChild(cssEls[i]); // remove the element
	}

	// disable all background image manipulations
	for (var i = 0; i < bgEls.length; i++) {
		bgEls[i].style.backgroundImage = bgEls[i].attributes.origBackgroundImage;
	}
}

function isStyleEnabled() {
	var cssEl = document.getElementById(SCRIPT_ID+'-css');

	return isTruthy(cssEl);
}

function parseCSS(parsed) {
	for (attribute in css.defaults) {
		exceptionToReplace = new RegExp('{{'+attribute+'}}', 'g');
		parsed = parsed.replace(exceptionToReplace, css['defaults'][attribute]);
	}

	return parsed;
}

document.addEventListener("keydown", function(e) {
	if (e.altKey === true && e.shiftKey === false && e.ctrlKey === false && e.metaKey === false && e.code == 'KeyI') {
		if (isStyleEnabled()) {
			disableStyle();

			if (CURRENT_SITE != 'none') {GM_setValue( 'enabled_'+CURRENT_SITE , false );}
		} else {
			enableStyle();

			if (CURRENT_SITE != 'none') {GM_setValue( 'enabled_'+CURRENT_SITE , true );}
		}
	}
});

function getCurrentSite() {
	var url = document.documentURI;
	var toReturn = 'none';

	if (url.indexOf('messenger.com') != -1) toReturn = 'messenger';
	if (url.indexOf('slack.com') != -1) toReturn = 'slack';
	if (url.indexOf('mail.google.com') != -1) toReturn = 'gmail';
	if (url.indexOf('hangouts.google.com/webchat') != -1) toReturn = 'gmailhangouts';
	if (url.indexOf('inbox.google.com') != -1) toReturn = 'inbox';

	return toReturn;
}

function init() {
	var styleEnabled = GM_getValue( 'enabled_'+CURRENT_SITE , true );
	if (CURRENT_SITE == 'none') styleEnabled = false; // don't automatically enable if the site isn't specifically tailored for the script

	if (styleEnabled) {
		enableStyle();
	}

	// unfocus / focus transparency effect
	if (css.overrides.disableUnfocusedTransparency.indexOf(CURRENT_SITE) == -1) {
		addEvent(window, "mouseout", function(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;

			if (from == null) {
				// the cursor has left the building
				hideHtml();
			} else {
				showHtml();
			}
		});
		addEvent(window, "mouseover", function(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;

			if (from != null) {
				showHtml();
			}
		});
	}
}


function hideHtml() {
	document.querySelector('html').classList.add('unfocused');
}

function showHtml() {
	document.querySelector('html').classList.remove('unfocused');
}

init();

/*
* Utility functions
*/

function isTruthy(item) {
	return !isFalsy(item);
}

// from https://gist.github.com/skoshy/69a7951b3070c2e2496d8257e16d7981
function isFalsy(item) {
	if (
		!item
		|| (typeof item == "object" && (
			Object.keys(item).length == 0 // for empty objects, like {}, []
			&& !(typeof item.addEventListener == "function") // omit webpage elements
		))
	)
		return true;
	else
		return false;
}

function addEvent(obj, evt, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	}
	else if (obj.attachEvent) {
		obj.attachEvent("on" + evt, fn);
	}
}