// ==UserScript==
// @name Night on the Last Horizon
// @namespace https://lasthorizon.boards.net/user/1
// @version 1.0.0
// @description A dark theme for Last Horizon. Not complete.
// @author Izaiah
// @grant GM_addStyle
// @run-at document-start
// @match *://*.lasthorizon.boards.net/*
// @downloadURL https://update.greasyfork.org/scripts/421866/Night%20on%20the%20Last%20Horizon.user.js
// @updateURL https://update.greasyfork.org/scripts/421866/Night%20on%20the%20Last%20Horizon.meta.js
// ==/UserScript==

(function() {
let css = `
	body {
		background: rgb(0, 0, 0);
		background: linear-gradient(0deg, rgb(109, 109, 109) 0%, rgb(0, 0, 0) 100%);
		color: rgb(255, 255, 255);
	} a, a:active {
		color: rgb(135, 255, 55);
	} #nav-tree>li a {
		color: lime;
	} /* Most content should be dark, with light text, and green links. */
	
	.posts .post, .post .quote div.quote div.quote_body, .post.even .quote div.quote_body {
		color: white;
		background-color: rgb(35, 35, 35);
	} .posts .post.even, .post .quote div.quote_body, .post.even .quote div.quote div.quote_body {
		color: white;
		background-color: rgb(28, 28, 28);
	} .mini-profile, .mini-profile .info, .even .mini-profile .info, .even .mini-profile,
	.shoutbox_messages .shoutbox_delete_button,
	.embed-menu li>a, .options_menu li>a, .select_menu_list li>a, .smiley-menu li>a, .ui-menu-context li>a {
		color: white;
	} .container>.control-bar {
		color: white;
		background-color: rgb(28, 28, 28);
	} .post.item.even abbr.time, .post.item .quote abbr.time, .post.item.even .quote .quote abbr.time /* Post timestamp... */ {
		color: white;
	} .post.item abbr.time, .post.item.even .quote abbr.time, .post.item .quote .quote abbr.time {
		color: white;
	} /* Posts on thread pages (odd and even), as well as the 'mini-profile' sidebars for each posts, are made dark, and text is made white. The control-bar on top likewise. */
	
	.container abbr.time{
		color: rgba(255,255,255,0.5);
	} /* The timestamp on shoutbox messages is made a semi-transparent white. */
	
	input.search-input,
	.ui-selectMenu-box,
	.ui-selectMenu-box .arrow,
	.embed-menu, .embed-menu ul, .options_menu, .options_menu ul, .select_menu_list, .select_menu_list ul, .smiley-menu, .smiley-menu ul, .ui-menu-context, .ui-menu-context ul,
	.recent-threads-button, #navigation-tree {
		color: white;
		background-color: rgb(28, 28, 28);
	} .ui-selectMenu-box .arrow,
	.ui-selectMenu-box .arrow.down>span, .arrow.down>span {
		border-top-color: white;
	} .embed-menu li:hover>a, .options_menu li:hover>a, .select_menu_list li:hover>a, .smiley-menu li:hover>a, .ui-menu-context li:hover>a {
		background-color: darkgray;
	} /* The actions menu, search field, and post control buttons on thread pages are made dark gray with white text. */
	
	.message > textarea {
		background-color: rgb(28, 28, 28);
		color: white;
	} .button, a.button, input[type="submit"], input[type="button"], button {
		color: white;
		background-color: rgb(59, 59, 59);
	} /* The quick-reply text-field is made dark with white text. */
	
	
	table.list, .legend .content td {
		color: white;
	} thead, .container>.content, .ui-dialog .ui-dialog-content, .ui-dialog .ui-dialog-buttonpane, .container.copy .clone, .content-box {
		background-color: #444444;
		color: white;
	} /* Text on the main forum page lists is made white, and background made gray. */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
