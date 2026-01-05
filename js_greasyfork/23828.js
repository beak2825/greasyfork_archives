// ==UserScript==
// @name         Inverter
// @icon         http://i.imgur.com/wBrRGXc.png
// @namespace    skoshy.com
// @version      0.2.41
// @description  Inverts webpages with a hotkey
// @author       Stefan Koshy
// @run-at       document-start
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/23828/Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/23828/Inverter.meta.js
// ==/UserScript==

var DEBUG_MODE = false;
var SCRIPT_ID = 'inverter';
var CURRENT_SITE = getCurrentSite();

// From https://gist.github.com/arantius/3123124
// These are replacement functions for GreaseMonkey scripts, but the only work on a single domain instead of being cross domain
// Todo: Implement solution that works cross domain

if (typeof GM_getValue == 'undefined') {
	function GM_getValue(aKey, aDefault) {
		'use strict';
		let val = localStorage.getItem(SCRIPT_ID + aKey)
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

var timers = {};
timers.lastToggle = 0; // default the last toggle to nothing

var options = {};
options.toggleDelayMs = 200; // number of milliseconds delay there needs to be to switch from toggle mode to save inversion mode

var css = {};
css.defaults = {};
css.overrides = {};

css.common = {};
css.common.css = `
html {
	filter: invert(1);
	min-height: 100%;
	background-color: black;
}

img, figure, video, picture {
	filter: invert(1);
}

figure img { /* no need to invert imgs in figures */
	filter: invert(0);
}

*[style*="url(/"],
*[style*="blob:"],
*[style*="url('https:"],
*[style*="url('http:"],
*[style*="url('://"],
*[style*="url('blob:"],
*[style*='url("https:'],
*[style*='url("https:'],
*[style*='url("http:'],
*[style*='url("://'],
*[style*='url("blob:']
{ filter: invert(1); }

body, body > div {
	background-color: white;
}

iframe[src*="youtube.com"], iframe[src*="vimeo.com"] {
	filter: invert(1);
}

twitterwidget::shadow .MediaCard-media {
	filter: invert(1);
}

twitterwidget::shadow .Avatar {
	filter: invert(1);
}

.gbii /* This is for multiple Google Domains to reinvert the profile icon in the top right */
{filter: invert(1);}
`;
css.messenger = {};
css.messenger.includeCommon = false;
css.messenger.javascriptOnce = function() {
	var chatColor = '';

	setInterval(function() {
		var chatColorEl = document.querySelector('._fl2 [data-testid="info_panel_button"] svg polygon, ._fl2 [data-testid="info_panel_button"] svg path'); /* Two elements, depends on if the info button is pressed or not */
		if (!chatColorEl || chatColorEl.style.fill == chatColor) return;

		chatColor = chatColorEl.style.fill;

		var newCss = `
			._43by
			{ background: `+chatColor.replace('rgb', 'rgba').replace(')', ', .3)')+` !important; }
		`;

		addGlobalStyle(newCss, SCRIPT_ID+'-css', isInverterEnabled(), SCRIPT_ID+'-messengerSpecialCss');
	}, 500);
};
css.messenger.css = `
body
,._5i_d * /* Text from YouTube/video share */
{ color: white; }

/* Bug Fixes */
._kmc /* message box, min height fix */
{ min-height: 26px !important; }

._4sp8 {
background: black !important;
}

._4rv3 /* Message box container */
,._5743 * /* Top name */
,._1ht6 /* Names in the sidebar */
,._1ht3 ._1htf /* Unread message in sidebar */
,._1tqi ._4qba /* App Name */
,._5swm * /* Text from link shares */
,._hh7 a /* Link from received message */
,._55r /* video chat notices */
,._1enh ._364g /* from searching, contact names */
,._225b /* from searching, header */
,._lll * /* Intro message text for first time chatting someone */
,._3szq /* Info Box text */
,._58ak input /* Composing new message text box */
,._1jt6 ._3oh- /* Info box contact name */
,._4rph ._4rpj /* Info box group chat, add people */
,._4_j5 ._364g /* Info box group chat, additional people */
,._2jnv /* Info box group chat, chat name */
{ background: transparent !important; color: white !important; }

._1ht3._1ht1 /* unread message in sidebar */
{ background-color: rgba(0, 132, 255, .5) !important; }

._1ht1._1ht2 /* current message in the sidebar */
{ background-color: rgba(255, 255, 255, .15) !important; }

._2y8_ * /* Popup boxes text */
{ color: black; }

._29_7 ._hh7 /* receiving message boxes */
{ background: rgba(255,255,255,.12) !important; color: white; }

._43by /* sent message boxes */
{ background: rgba(0, 132, 255,.45) !important; transition: background 0.3s ease; }

._497p /* Timestamps and joining video chat messages in the chat */
,._1ht7 /* timestamps in sidebar */
,._ih3 /* Names in group chat */
,._5iwm ._58al::placeholder /* placeholder text for search */
,._1lj0 /* Info Box Headers */
,._3eus, ._5uh /* Info Box Person Description */
,._2y8z /* Composing new message "To" field" */
,._58ak input::placeholder /* Composing new message text box, placeholder */
,._5i_d .__6m /* Link share URL */
,._3x6v /* Info box, side text next to notifications if notifications are muted */
{ color: rgba(255,255,255,.6) !important; }

._29_7 ._52mr /* Borders of message bubble stuff, like video chat notifications, links, etc, received */
,._nd_ ._52mr /* Same as above, but sent */
{ border-color: rgba(255,255,255,.2); }

.sp_1g5zN81j-1P /* tiny icons, like when a video chat ends */
,._5iwm ._58ak::before /* search icon */
,.sp_6SI1R2TSgtb /* more tiny icons */
,._2t5t /* more icons, like the forward icon */
{ filter: invert(1); }

a._4ce_ /* games icon */
,._4rv6 /* stickers icon */
{ opacity: .7 !important; filter: invert(1) !important; }

._5iwm ._58al /* search box */
{ background: rgba(255,255,255,.3) !important; color: white !important; }

::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
	border-radius: 10px !important;
	background-color: #333 !important;
}

::-webkit-scrollbar
{
	width: 12px !important;
	background-color: transparent !important;
}

::-webkit-scrollbar-thumb
{
	border-radius: 10px !important;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3) !important;
	background-color: #555 !important;
}
`;
css.gmail = {};
css.gmail.css = `
iframe[src*="hangouts.google.com"]
{ filter: invert(1); }
`;
css.inbox = {};
css.inbox.css = `
img[src*="ssl.gstatic.com"], img[src*="www.gstatic.com"]
{ filter: invert(0); }
nav#GH > .b4 /* Header bar, kepp the same color */
{ filter: invert(1); }
iframe[src*="hangouts.google.com"]
{ filter: invert(1); }
.cf /* Shipping notification headers */
{ filter: invert(1); }
.xW /* Shipping icon */
{ filter: invert(1) !important; }
`;
css.hangouts = {};
css.hangouts.enableInIframe = true;
css.hangouts.css = `
.Ik:not(.uB) /* Chat Headers */
{ filter: invert(1); }
`;
css.youtube = {};
css.youtube.css = `
.player-api video
{filter: inherit;}

#theater-background
{background: white !important;}

#player-playlist,
.player-api,
#c4-header-bg-container /* Banner on YouTube channel page */
{filter: invert(1);}

#player-playlist img,
#c4-header-bg-container img /* Banner on YouTube channel page */
{filter: invert(0);}

`;
css.facebook = {};
css.facebook.css = `
i /* Emoji and other small icons */
{filter: invert(1);}
`;
css.twitter = {};
css.twitter.css = `
.PermalinkOverlay-with-background /* overlay when clicking on a tweet */
{background: rgba(255,255,255,.55) !important;}

iframe
{background-color: white; filter: invert(1);}

.is-generic-video {
	filter: invert(1);
}
`;
css.soundcloud = {};
css.soundcloud.css = `
span[style]
`;
css.pocketcasts = {};
css.pocketcasts.css = `
#header {filter: invert(1);}
#audio_player {filter: invert(1); background-color: black;}

#header img {filter: invert(0);}
#audio_player img {filter: invert(0);}

#audio_player #audio_player_wrapper .player_top,
#audio_player #audio_player_wrapper .player_bottom
{background-color: transparent;}
`;
css.slack = {};
css.slack.includeCommon = false;
css.slack.css = `
body #loading_welcome,
.loading #loading-zone,
#loading_message p,
body #client_body,
body .end_div_msg_lim,
#client_body h1,
#client_body h2,
#client_body h3,
#client_body h4,
body #footer,
body #msg_input,
#msgs_overlay_div,
body .file_container:not(.snippet_container),
#messages_container.has_top_messages_banner:before, /* The background of the X New Message since blah thing in the message window */

/* Flexible column, aka threaded messages */
body #col_flex,
#flex_contents .heading,

/* About channel column */
body #details_tab .channel_page_section,
body #details_tab .channel_page_section div,
#details_tab .channel_page_section .section_title,
.c-channel_insights__message ts-message.standalone:not(.for_mention_display):not(.for_search_display):not(.for_top_results_search_display):not(.for_star_display),
.c-channel_insights__date_heading span,

/* All threads view */
#threads_msgs_scroller_div,
body ts-thread,
body ts-thread .thread_messages,
#convo_container .convo_flexpane_divider .reply_count, #file_preview_scroller .convo_flexpane_divider .reply_count,
body .reply_input_container .ql-container,

/* Top Header */
body #client_header,
body .channel_header,
body .ql-container.texty_single_line_input .ql-editor, /* Search input */
.feature_name_tagging_client #edit_topic_inner:before, /* Topic box */
.day_divider .day_divider_label, /* Day divider */
#client_body:not(.onboarding):before, /* Top day divider */

/* New Direct Message modal */
#fs_modal.active,
.plastic_select, input[type=url], input[type=text], input[type=tel], input[type=number], input[type=email], input[type=password], select, textarea,

/* Unreads Tab */
body .unread_msgs_loading,

/* Image viewer */
.fs_modal_file_viewer_content .viewer
  { background: rgb(27, 27, 27) !important; color: white !important; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: rgba(101, 101, 101, 0.1); }

.sli_briefing, /* New Unreads Banner */
#msgs_div .unread_divider.no_unreads .divider_label /* New Message line indicator text */
  { background: rgb(27, 27, 27) !important; }

body .channel_title .channel_name,
body #archives_end_div_msg_lim h1,
body #end_display_msg_lim h1,
body ts-message,
body #client_body ts-message .message_content .message_sender,
body .c-message__sender,
body .c-message--light .c-message__sender .c-message__sender_link,
body .c-message__body,
body ts-thread .thread_header .thread_channel_name a,
.c-member__display-name, .c-team__display-name, .c-usergroup__handle,

/* Unread Tab */
body .unread_empty_state,

/* Convo Tab */
body #convo_tab .message_input, body #convo_tab textarea#msg_text,

/* New Direct Message Modal */
#fs_modal h1, #fs_modal h2, #fs_modal h3, #fs_modal h4, #fs_modal h5,
.c-member__secondary-name--medium,
#im_browser .im_browser_row.multiparty,
body .flexpane_file_title .member, body .flexpane_file_title .service_link, .flexpane_file_title .title a, /* files pane */
body .comment .member, .comment_body, /* file comments */
#details_tab .feature_sli_channel_insights .channel_created_section .creator_link, #details_tab .feature_sli_channel_insights .channel_purpose_section .channel_purpose_text
  { color: white !important; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: rgba(101, 101, 101, 0.1); }

/* Hover Message */
ts-message.active:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply),
ts-message.message--focus:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply),
ts-message:hover:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply),
#msg_input+#primary_file_button:not(:hover):not(.active),
ts-message .reply_bar:hover, /* Hovering over the reply bar in a message */
ts-message.selected:not(.delete_mode),
ts-thread ts-message.new_reply, /* when a thread has a new message */
#im_browser #im_list_container:not(.keyboard_active).not_scrolling .im_browser_row:not(.disabled_dm):hover, #im_browser .im_browser_row.highlighted, /* New direct message modal, hovering over row */

/* Unreads Tab */
body .unread_group_header, body .unread_group_header_name a,

.msg_inline_attachment_column.column_border
  { background: rgb(40, 40, 40) !important; color: white !important;  }

/* Hover - Border */
#client_body:not(.onboarding):before, /* Top day divider */
#convo_container .convo_flexpane_divider,
#file_preview_scroller .convo_flexpane_divider,
#flex_contents .heading,
.flex_pane_showing #col_flex,
.day_container .day_msgs,
.c-channel_insights__message ts-message.standalone:not(.for_mention_display):not(.for_search_display):not(.for_top_results_search_display):not(.for_star_display)
  { border-color: rgb(40, 40, 40) !important; }

/* Placeholder text */
body .ql-placeholder
  { color: rgb(200,200,200); }

/* Override text with black text */
.feature_name_tagging_client ts-message .mention, /* channel mention */
body .comment .mention, body .ql-editor .mention, body ts-message .mention /* more mentions */
  { color: black !important; }

/* Remove the white border between channel switcher and messages */
body #col_messages,
#client_body:not(.onboarding):before,
.channel_header,
#footer,
body ts-message.active:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply),
body ts-message.message--focus:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply),
body ts-message:hover:not(.standalone):not(.multi_delete_mode):not(.highlight):not(.new_reply)
  { box-shadow: none !important; }

/* Links */
ts-message .message_body a,
ts-message .message_body a:link,
ts-message .message_body a:visited,
ts-message .message_body .file_preview_link
  { color: #66baec !important; }

/* Links - Hover */
ts-message .message_body a:hover,
ts-message .message_body a:link:hover,
ts-message .message_body a:visited:hover,
ts-message .message_body .file_preview_link:hover
  { color: #569eca !important; }
`;
css.zohonotebook = {};
css.zohonotebook.css = `
#wholeContainer,
.versionsContainer
{ background: rgb(27, 27, 27) !important; color: white !important; }

.noteCardDiv:before
{ border-color: rgb(27, 27, 27) !important; }

.navBarIcon
{ filter: invert(1); }

#createWrapper
{ background: transparent !important; }
`;
css.zohonotebook.includeCommon = false;
css.none = {};
css.none.css = ``;


function addGlobalStyle(css, className, enabled, id) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }

	// check to see if this element already exists, if it does override it
	var oldEl = document.getElementById(id);

	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = id;
	style.className = className;
	head.appendChild(style);
	style.disabled = !enabled;

	// delete old element if it exists
	if (oldEl) {
		oldEl.parentNode.removeChild(oldEl);
	}
}

function parseCSS(parsed) {
	for (attribute in css.defaults) {
		exceptionToReplace = new RegExp('{{'+attribute+'}}', 'g');
		parsed = parsed.replace(exceptionToReplace, css['defaults'][attribute]);
	}

	return parsed;
}

document.addEventListener("keydown", function(e) {
	if (e.altKey === true && e.shiftKey === false && e.ctrlKey === true && e.metaKey === false && e.code == 'KeyI') {
		var timestamp = new Date();
		timestamp = timestamp.getTime();

		if (timers.lastToggle > timestamp-options.toggleDelayMs) {
			if (isInverterEnabled()) {
			GM_setValue('enabled_'+document.domain, true);
			alert('Saved inversion for '+document.domain);
			} else {
			GM_deleteValue('enabled_'+document.domain);
			alert('Deleted inversion setting for '+document.domain);
			}
		} else {
			// toggle style

			if (isInverterEnabled()) {
				disableStyle();
			} else {
				enableStyle();
			}
		}

		timers.lastToggle = timestamp;
	}
});

function getCssStyleElements() {
	return document.getElementsByClassName(SCRIPT_ID+'-css');
}

function enableStyle() {
	var cssToInclude = '';

	if (css[CURRENT_SITE].includeCommon === false) {}
	else { cssToInclude += css.common.css; }

	cssToInclude += css[CURRENT_SITE].css;

	addGlobalStyle(parseCSS(
		cssToInclude
	), SCRIPT_ID+'-css', true, SCRIPT_ID+'-css');
}

function disableStyle() {
	var cssEls = getCssStyleElements();
	for (let i = 0; i < cssEls.length; i++) {
		cssEls[i].parentNode.removeChild(cssEls[i]); // remove the element
	}
}

function isInverterEnabled() {
	var cssEl = document.getElementById(SCRIPT_ID+'-css');

	return isTruthy(cssEl);
}

function getCurrentSite() {
	var url = document.documentURI;
	var toReturn = 'none';

	if (url.indexOf('messenger.com') != -1) toReturn = 'messenger';
	if (url.indexOf('youtube.com') != -1) toReturn = 'youtube';
	if (url.indexOf('twitter.com') != -1) toReturn = 'twitter';
	if (url.indexOf('inbox.google.com') != -1) toReturn = 'inbox';
	if (url.indexOf('hangouts.google.com') != -1) toReturn = 'hangouts';
	if (url.indexOf('mail.google.com') != -1) toReturn = 'gmail';
	if (url.indexOf('facebook.com') != -1) toReturn = 'facebook';
	if (url.indexOf('play.pocketcasts.com') != -1) toReturn = 'pocketcasts';
	if (url.indexOf('notebook.zoho.com') != -1) toReturn = 'zohonotebook';
	if (url.indexOf('slack.com/messages') != -1 || url.indexOf('slack.com/threads') != -1 || url.indexOf('slack.com/unreads') != -1) toReturn = 'slack';

	return toReturn;
}

function init() {
	var styleEnabled = GM_getValue( 'enabled_'+document.domain , false );

	if (DEBUG_MODE) {
		console.log('Inversion Enabled for site ('+CURRENT_SITE+'): '+styleEnabled);
	}

	if (inIframe() && isFalsy(css[CURRENT_SITE].enableInIframe)) { styleEnabled = false; }

	if (css[CURRENT_SITE].javascriptOnce) { css[CURRENT_SITE].javascriptOnce(); }

	if (styleEnabled) {
		enableStyle();
	}
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

function inIframe () {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}