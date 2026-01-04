// ==UserScript==
// @name          Reddit - Greyscale - No Karma
// @namespace     http://userstyles.org
// @description	  This userstyle is derived from "Reddit - Hide All Karma" by Reddit user gavin19.  (However, I have his blessing to put it up on here.)  It completely removes all instances of karma from the Reddit website. It works with old.reddit.com. In your reddit preferences, under display options, uncheck "allow subreddits to show me custom themes."
// @author        Visiblink
// @include       http://reddit.com/*
// @include       https://reddit.com/*
// @include       http://*.reddit.com/*
// @include       https://*.reddit.com/*
// @run-at        document-start
// @version       0.71
// @downloadURL https://update.greasyfork.org/scripts/373474/Reddit%20-%20Greyscale%20-%20No%20Karma.user.js
// @updateURL https://update.greasyfork.org/scripts/373474/Reddit%20-%20Greyscale%20-%20No%20Karma.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
// grey everything
  "body {filter:grayscale(100%); background-color:#eeeeee;}",
  ".content {background-color:#fffffe; padding-top: 10px;}",
  ".side {background-color:#fffffe; margin: 10px 10px 0 5px;}",
// hide karma / scores. If you don't want to hide karma/scores, put double slashes before the lines down to and including .rank
	".titlebox > .karma {font-size:0px !important;color:transparent !important;}",
	".titlebox > .karma::before {font-size:12px !important;color:black !important;content:\'plenty of\';}",
	".arrow.up.login-required,.arrow.down.login-required,.linkinfo .score, .linkinfo .upvotes, .linkinfo .downvotes, #header-bottom-right .user b, span.score {display: none !important;}",
	".midcol {width: 0px !important;}",
	".midcol .score {visibility:hidden !important;}",
	".rank {color:black !important; padding-right:3px !important;}",
// remove overall user karma
  "#header-bottom-right .userkarma {font-size:0px !important;color:transparent !important;}",
  ".karma::before {display:none !important;}",
  ".karma-breakdown {display:none !important;}",
// remove comment vote buttons and comment karma scores on user profile comments page
	".Comment__votes {display: none !important;}",
	".Comment__metadata {display: none !important;}",
// remove reddit gold ad
	".goldvertisement {display:none !important;}",
// restyle sidebar elements on main page 
	".morelink {background-image:none !important; border-top-color:black; border-bottom-color:black; border-right-color:black; border-left-color:black}",
	".morelink:hover {background-image:none !important; border-top-color:#808080; border-bottom-color:#808080; border-right-color:#808080; border-left-color:#808080}",
  ".morelink .nub {display:none}",
	".sidebox .spacer {display:none}",
// make sidebar box disappear from main page
	".sidecontentbox {display:none !important;}",
	".link .title {color:#303030 !important;}",
// sidebar: remove green circle beside "users online"
	".users-online::before {display:none;}",
// restyle subscribe and unsubscribe buttons
	"a.option.active.add.login-required {background-image:none!important; border-radius:0px !important;}",
	"a.option.active.remove.login-required {background-image:none!important; border-radius:0px !important;}",
  ".toggle .option.active {color:#606060 !important;}",
//  ".sidebox {display:none !important;}",
	".account-activity-box {display:none !important;}",
// trending subreddits must be visibility:hidden rather than display:none or the first item is misaligned
	".trending-subreddits-content {visibility:hidden !important;}",
  ".trending-subreddits {margin-bottom: 0px !important; line-height:0em !important; margin-top: -10px;}",
// for grey make sr-header-area, #header-bottom-right, and .choice background-color:#f0f0f0 for white theme make them #e0e0e0
	"#sr-header-area {background-color:#f0f0f0 !important;}",
// set background color for header area (old was white)
	"#header-bottom-left {background-color:#e0e0e0 !important;}",
// set background color for header area
	"#header-bottom-right {background-color:#f0f0f0 !important;}",
// set header area bottom border color
	"#header {border-bottom-color:gray !important;}",
// short link information background colour on comment page at top right
  ".linkinfo {background-color:#FFFFFF !important; border-color:gray; border-radius:0px;}",
// make authors' names dark
	".comment .author {color:#303030 !important;}",
// top menu links background color and border color
	".choice {background-color:#f0f0f0 !important; border-top-color:gray !important; border-right-color:gray !important; border-left-color:gray !important;}",
// top menu edit link (comment it out for the white them)
	"a#sr-more-link {background-color:#e0e0e0 !important;}",
// restyle main OP post box
  ".link .usertext-body .md {background-color:#f0f0f0; border-color:gray; border-radius:0px;}",
// reddits menu
	".drop-choices a.choice {color:#303030 !important;}",
// posting flair label colour
  ".linkflairlabel {background-color:#ccccc7 !important; border-color:#ccccc7 !important;}",  
// stickied tagline
  ".stickied-tagline {filter:grayscale(100%)}",   
// thumbnail colour
  ".thumbnail {filter:grayscale(100%)}",  
// highlight OP in red
	".tagline .submitter, .search- {color:red !important;}",
// remove new reddit beta opt-in
	"#sr-header-area .redesign-beta-optin {display:none !important;}",
// background for message compose boxes
	".roundfield {background-color:#f0f0f0 !important;}",
// remove left sidebar
	"body.with-listing-chooser .listing-chooser.initialized {display:none !important;}",
// set hyperlink colour
	"a {color:#606060 !important;}",
// footer color
	".footer-parent {background-color:#f0f0f0 !important;}",
// SEARCH PAGE
// restyle the search button
	".c-btn-primary {background-color:#c0c0c0; border-bottom-width:1px; border-radius:0px; border-top-color:gray; border-bottom-color:gray; border-right-color:gray; border-left-color:gray;}",
	".c-btn-primary:hover {background-color:#a0a0a0; border-bottom-width:1px; border-radius:0px; border-top-color:gray; border-bottom-color:gray; border-right-color:gray; border-left-color:gray;}",
// restyle subscribe button background to white and border to black
	".combined-search-page .search-subscribe-button .add {background-color:white !important; border-color:black;}",
// make search word highlight dark gray rather than blue
	".search-result :link, .search-result :link > mark {color:#404040;}",
// remove blue search magnifying glass
	".search-result-icon-filter {display:none;}",
// restyle the "more" link
  ".search-expando-button {color:gray;}",
// EDIT SUBREDDITS PAGE
// restyle the "Click the 'Subscribe' or 'Unsubscribe' buttons" info bar
	".infobar {background-color:#e0e0e0 !important; border-color:gray !important;}",
// USER PROFILE
// set user profile titlebar color
	".BlueBar {background-color:#e0e0e0 !important; border-bottom-color:gray !important;}",
// set user profile titlebar username color
	"a.BlueBar__username {background-color:#f0f0f0 !important;}",
	".BlueBar__account {background-color:#f0f0f0 !important;}",
// set user profile titlebar username color
	"a.TabMenu__tab.m-active::after {border-top-color:black !important;}",
// set user profile body background color
  ".ProfileTemplate__body {background-color:#f0f0f0 !important;}",
  ".ProfileTemplate.m-updated {background-color:#f0f0f0 !important;}",
  ".Footer {background-color:#f0f0f0 !important;}",
// user presence circle colour
  ".presence_circle {filter:grayscale(100%)}",  
// user flair label colour
  ".flair {background-color:#ccccc7 !important; border-color:#ccccc7 !important;}",  
// restyle New Post button
  ".ProfileSidebar__newPost {background-image:none !important; background-color:#FFFFFF !important; border-top-color:black; border-bottom-color:black; border-right-color:black; border-left-color:black; border-radius:0px;}",
  ".ProfileSidebar__newPost:hover {background-image:none !important; background-color:#FFFFFF; border-top-color:#808080; border-bottom-color:#808080; border-right-color:#808080; border-left-color:#808080}",
  ".ProfileSidebar__newPost .nub {display:none}",
// remove cake icon
  ".icon::before {display:none !important;}",
  ".UserSpecialsListSidebar__icon {display:none !important;}",
// remove karma from titlebox
  ".titlebox .bottom {border-top:none !important;}",
  ".titlebox {color:transparent;}",
// restyle snoovatar box
  ".linkinfo.snoovatar-link {border-radius:0px;}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();