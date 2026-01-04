// ==UserScript==
// @name ReversiPlusPlus AMOLED MOD
// @namespace https://github.com/w4tchdoge
// @version 1.0.10-20240526.185941
// @description Modification of ReversiPlusPlus (https://github.com/galaxygrotesque/ReversiPlusPlus) by galaxygrotesque
// @author w4tchdoge
// @homepageURL https://github.com/w4tchdoge/w4tchdoge-AO3-CSS
// @license AGPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/496453/ReversiPlusPlus%20AMOLED%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/496453/ReversiPlusPlus%20AMOLED%20MOD.meta.js
// ==/UserScript==

(function() {
let css = `
	/*
	---+ REVERSI PLUS PLUS +---

	++ CREDITS & ACKNOWLEDGEMENTS ++
	- reversi base:     archiveofourown   (https://archiveofourown.org/skins/929)
	- tag scroll box:   archiveofourown   (https://archiveofourown.org/skins/3756)
	- tag bubbles:      @nyxmidnight      (https://github.com/nyxmidnight/ao3tagsfonts)
	- typography:       mb                (https://practicaltypography.com/index.html)
	- fonts:
		*                 charter             (https://fontesk.com/charter-typeface/)
		*                 fira code           (https://fonts.google.com/specimen/Fira+Code)
		    @        $    helvetica neue      (https://www.myfonts.com/collections/neue-helvetica-font-linotype)
		*                 ibm plex mono       (https://fonts.google.com/specimen/IBM+Plex+Mono)
		*                 ibm plex sans       (https://fonts.google.com/specimen/IBM+Plex+Sans)
		*                 ibm plex serif      (https://fonts.google.com/specimen/IBM+Plex+Serif)
		*                 lato                (https://fonts.google.com/specimen/Lato)
		*                 literata            (https://fonts.google.com/specimen/Literata)
		*                 libre baskerville   (https://fonts.google.com/specimen/Libre+Baskerville)
		*    @            menlo               (https://github.com/hbin/top-programming-fonts/blob/master/Menlo-Regular.ttf)
		*                 noto sans           (https://fonts.google.com/specimen/Noto+Sans)
		*                 noto serif          (https://fonts.google.com/specimen/Noto+Serif)
		    @        $    palatino            (https://www.myfonts.com/collections/palatino-font-linotype)
		        #         palatino linotype   (https://learn.microsoft.com/en-us/typography/font-list/palatino-linotype)
		    @        $    proxima nova        (https://fonts.adobe.com/fonts/proxima-nova)
		*                 source code pro     (https://fonts.google.com/specimen/Source+Code+Pro)
		*                 source sans 3       (https://fonts.google.com/specimen/Source+Sans+3)
		*                 source serif 4      (https://fonts.google.com/specimen/Source+Serif+4)

	- font chart legend:
		* web font (i.e., free!)
		@ iOS/iPadOS system font
		# microsoft office cloud
		$ paid

	++ SECTIONS ++
	00. colour guide
	01. body fonts
	02. base
	03. actions
	04. header
	05. main
	06. footer
	07. work reading adjustments (reading fonts here!)
	08. comments
	09. tags
	10. work blurb cleanup
	11. messages & tooltips
	12. dashboard
	13. stats page
	14. other pages
	15. sort & filter sidebar
	16. misc
	17. user added
	18. userscript compatibility
	*/

	/* ---+ 00. COLOUR GUIDE +--- */

	/* using this as a colour guide as ao3 does not allow variables

	:root {
		--ao3-accent-color: #5998d6;               -- User Modified to #929292
		--ao3-accent-color-light: #9ecfff;         -- User Modified to #c9c9c9
		--background-color: #1c1b22;               -- User Modified to #000
		--background-color-dark: #151319;          -- User Modified to #000
		--box-background-color: #16151b;           -- User Modified to #161616
		--box-border-color: #78777d;               -- User Modified to #787878
		--box-border-color-alt: #c2d2df;           -- User Modified to #cfcfcf
		--box-border-color-subtle: #454547;        -- User Modified to #454545
		--button-background-color: #2b2a33;        -- User Modified to #2b2b2b
		--button-current-color: #0b0b0b;
		--button-highlight-color: #4e4e5e;         -- User Modified to #4f4f4f
		--tag-bubble-color-visited-hover: #5b5b66; -- User Modified to #5c5c5c
		--text-color: #eee;
		--text-link-color: #fff;
		--text-link-visited-color: #bfbfbf;
		--textbox-background-color: #23222b;       -- User Modified to #232323
	}
	*/

	/* ---+ 01. BODY FONTS +--- */

	/* body fonts
		grab whichever strikes your fancy insert it after font-family!
		fonts:	"IBM Plex Sans", "Noto Sans", "Source Sans 3", "Proxima Nova", "Helvetica Neue",
		ao3 defaults:	"Lucida Grande", "Lucida Sans Unicode", "GNU Unifont", Verdana, Helvetica, sans-serif;
	*/

	body {
		/* font choices go here ↓ */
		font-family: "Lucida Grande", "Lucida Sans Unicode", "IBM Plex Sans", "Proxima Nova", "Helvetica Neue", "GNU Unifont", Verdana, Helvetica, sans-serif;
	}

	input,
	textarea,
	blockquote,
	blockquote.userstuff,
	.blurb blockquote,
	.dropdown,
	.expander,
	.toggled form {
		/* font choices go here ↓ */
		font-family: "Lucida Grande", "Lucida Sans Unicode", "IBM Plex Sans", "Proxima Nova", "Helvetica Neue", "GNU Unifont", Verdana, Helvetica, sans-serif;
	}

	/* header fonts
		fonts:	"Charter", "IBM Plex Serif", "Source Serif 4", "Palatino Linotype", "Palatino", "Literata",
		ao3 defaults:	"Georgia", serif;
	*/
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	.heading,
	.bookmark .user .meta {
		/* font choices go here ↓ */
		font-family: "Charter", "IBM Plex Serif", "Palatino", "Georgia", serif;
	}

	/* mono/code fonts */
	kbd,
	tt,
	code,
	var,
	pre,
	samp {
		/* font choices go here ↓ */
		font-family: "Fira Code", "Source Code Pro", "Menlo", "Monaco", "Consolas", Courier, monospace;
		font-size: 0.9em;
	}

	/* ---+ 02. BASE +--- */

	/* banishes every box shadow, text shadow, and outline like the demons they are */
	* {
		box-shadow: none !important;
		outline: none !important;
		text-shadow: none !important;
	}

	body {
		background: #000;
		border-color: #787878;
		color: #eee;
	}

	a,
	a:link {
		color: #fff;
		text-decoration: none;
	}

	/* lighter ao3 blue on link hover */
	a:hover,
	a:link:hover,
	a:link:visited,
	a:visited:hover,
	div.preface .byline a:hover,
	div.preface .byline a:visited:hover,
	.blurb h4 a:hover,
	.blurb h4 a:link:hover,
	.blurb h4 a:visited:hover,
	.listbox .heading a:visited:hover {
		color: #c9c9c9;
	}

	/* darker grey for visited links */
	a:visited,
	div.preface .byline a:visited,
	span.series .divider,
	.blurb h4 a:visited,
	.listbox .heading a:visited {
		color: #bfbfbf;
	}

	/* icons are sharp no more */
	a img,
	.icon {
		border: 0;
		border-radius: 0.25em;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	.heading {
		border: 0;
	}

	h1 {
		font-size: 2.5em;
		line-height: 1;
		margin: 0.5em 0;
	}

	h2 {
		font-size: 2.145em;
		line-height: 1;
		margin: 0.5em 0;
		display: inline;
	}

	h3 {
		font-size: 1.29em;
		line-height: 1.25;
		margin: 0.5375em 0;
	}

	h4 {
		font-size: 1.145em;
		line-height: 1.25;
		margin: 0.5em 0;
	}

	h5 {
		font-size: 1em;
		line-height: 1.285;
		margin: 0.65em 0;
	}

	h6 {
		font-size: 0.875em;
		font-weight: 900;
		line-height: 1.5;
		margin: 1.5em 0;
	}

	/* makes lots of link things ao3 blue */
	a.cloud7,
	a.cloud8,
	a.work,
	.blurb h4 a:link,
	.blurb h4 img,
	.delete a,
	.splash .browse li a:before {
		color: #929292;
	}

	.delete a:hover {
		color: #c9c9c9;
	}

	/* makes HR dividers the same colour as text + extra margin space */
	hr,
	.userstuff hr {
		border: 0;
		border-bottom: 2px solid;
		color: #eee;
		margin: 1.5em auto;
	}

	/*
	fieldset.listbox {

	}*/

	/* rounds and pretties text boxes */
	input,
	textarea {
		/* User Modified */
		background: #232323;
		border-color: #787878;
		/* border-radius: 0.25em; */
		color: #eee;
	}

	/* blue border now appears when you're focused a text box */
	input:focus,
	textarea:focus,
	form blockquote.userstuff,
	form.search input:focus[type="text"] {
		background: #232323;
		border-color: #6ab5ff;
	}

	/* white border on text box hover */
	input:hover,
	form.search input:hover[type="text"] {
		background: #232323;
		border-color: #fff;
	}

	th,
	.secondary,
	.thread .even,
	.system .tweet_list li,
	.ui-datepicker tr:hover {
		background: #232323;
	}

	.heading,
	.group .heading {
		background: none;
		color: #fff;
	}

	/* makes lots of things the ao3 blue accent */
	span.claimed,
	span.delete,
	span.requested,
	span.unread,
	.draggable,
	.droppable,
	.replied,
	.required,
	.blurb h4 img {
		color: #929292;
	}

	/* some labels are misbehaving (namely edit skin: parent skins) so trying this */
	#main .verbose legend {
		background: transparent;
	}

	/* sets base colours for oodles of elements */
	.group,
	.group .group,
	.region,
	fieldset,
	fieldset fieldset ul,
	form dl,
	.verbose fieldset,
	ul.notes,
	table,
	th,
	td:hover,
	tr:hover,
	.symbol .question:hover,
	.ui-sortable li,
	.required .autocomplete,
	.autocomplete .notice,
	div.dynamic,
	.dynamic form,
	#ui-datepicker-div,
	.ui-datepicker table {
		background: #000;
		border-color: #787878;
		color: #eee;
	}

	.picture .header {
		border: 0;
	}

	.dropdown-toggle {
		border-radius: 0 !important;
	}

	.secondary {
		border: 0;
	}

	/* small blue pop for expandables — e.g., download on works */
	ul.expandable.secondary {
		/* User Modified */
		border: 1px solid #4f4f4f !important;
		background: #2b2b2b !important;
		/* border: 0; */
		/* background: #929292; */
	}

	/* nix border on toggle forms like bookmarks */
	.toggled form {
		background: #000;
		border: 0;
	}

	li.blurb,
	fieldset,
	form dl {
		border: 0;
		padding: 1em;
		overflow: hidden;
	}

	/* ---+ 03. ACTIONS +--- */

	legend .action:link {
		margin: 0 0.5em;
	}

	/* action buttons and some nav buttons */
	button,
	input[type="submit"],
	.action,
	.action:link,
	.actions a,
	.actions a:link,
	.actions input,
	.actions label,
	.current,
	.flash.notice .action {
		background: #2b2b2b;
		border-color: transparent; /* nix lines while keeping white space */
		color: #eee;
	}

	/* active button behaviours (mostly) */
	#outer .current,
	legend .action:link:active,
	input:active[type="submit"],
	a.current,
	label.action:active,
	span.unread,
	span.claimed,
	.action a:active,
	.actions a:active,
	.actions a:active:visited,
	.current a:visited,
	.flash.notice .action:active,
	.flash.notice .action:active:visited,
	.replied,
	.own,
	.draft,
	.draft .unread,
	.child,
	.unwrangled,
	.unreviewed,
	.ui-sortable li:hover {
		background: #0b0b0b;
		border-color: transparent;
		color: #fff;
	}

	/* button/actions hover */
	legend .action:link:hover,
	input:hover[type="submit"],
	label.action:hover,
	input.button:hover,
	.action:hover,
	.action a:hover,
	.action a:link:hover,
	.actions a:focus,
	.actions a:hover,
	.actions a:link:hover,
	.actions a:visited:hover,
	.actions a:focus:visited,
	.actions input:hover,
	.actions input:focus,
	.flash.notice .action:hover,
	.flash.notice .action:visited:hover,
	.work.index.group .actions li a:hover,
	.work.index.group .actions li a:visited:hover {
		background: #4f4f4f;
		border-color: transparent;
		color: #fff;
	}

	/* button/actions visited */
	.actions a:visited,
	.action a:link,
	.action a:visited,
	.blurb h4 a:visited,
	.listbox .heading a:visited {
		color: #bfbfbf;
	}

	dl.meta {
		border: 0;
	}

	ul.actions,
	p.actions,
	li.actions,
	span.actions,
	fieldset.actions,
	dd.actions {
		padding: 0.429em 0.25em 0.25em 0;
		float: right;
		text-align: center;
	}

	/* arrow to-the-top buttons on fandoms page */
	.action.top a:active {
		background: transparent;
	}

	/* ---+ 04. HEADER +--- */

	/* dark header bg at the top */
	#header {
		background: #000 !important;
		color: #fff;
		font-size: 0.875em;
		margin: 0 0 1em 0;
		padding: 0;
		position: relative;
	}

	#header .heading {
		float: left;
		padding: 0.375em;
	}

	#header li {
		display: block;
		float: left;
		position: relative;
	}

	#header a,
	#header a:visited,
	#header .heading a:visited,
	#header .primary .open a,
	#header .primary .open a:focus,
	#header .primary .dropdown:hover a,
	#header .user a:focus,
	.filters dt a:hover {
		color: #fff;
	}

	#header .actions a:hover,
	#header .actions a:focus,
	#header .dropdown:hover a,
	#header .open a {
		background: #ddd;
	}

	/* header nav buttons as blue: fandoms/browse/search/about */
	#header .actions a {
		background: transparent;
		border-color: transparent;
		color: #fff;
	}

	#header .actions a:active,
	#header .actions a:focus {
		background: transparent;
		color: #fff;
	}

	/* header dropdown menu bgs */
	#header .actions a:hover,
	#header .dropdown:hover a,
	#header .dropdown a:focus,
	#header .user .open a:focus
	/* unused rule: #header .primary .dropdown a:focus */ {
		/* User Modified */
		background: #3c3c3c;
		color: #fff;
	}

	/* dropdowns are hover colour */
	#header .dropdown .menu a,
	#greeting .dropdown .menu a {
		/* User Modified */
		background: #3c3c3c;
		border-color: #3c3c3c;
		color: #eee;
		display: block;
		padding: 0.75em 0.5em 0.75em 0.5em;
	}

	/* dropdown menu links with dark hover */
	#header .dropdown .menu a:focus,
	#header .dropdown .menu a:hover {
		/* User Modified */
		background: #1c1c1c;
		color: #fff;
	}

	#header .dropdown .menu a:hover,
	#greeting .dropdown .menu a:hover {
		border-radius: 0;
	}

	/* nix lines in header nav */
	#header .dropdown .menu li {
		border: 0;
		margin: auto;
	}

	#header .heading a {
		color: #fff;
		font-size: 1.714em;
		line-height: 1.75;
	}

	#header .heading sup {
		font-size: 0.583em;
		font-style: italic;
	}

	#header .logo {
		float: left;
		height: 42px;
	}

	/* "archiveofourown beta" lighter text pop on active */
	#header .heading a:active {
		color: #c9c9c9;
	}

	#header .landmark {
		clear: none;
		font-size: 0;
		border: 0;
	}

	#header .primary {
		background: #30679e;
		padding: 0 0;
		width: 100%;
	}

	#header .menu,
	#greeting .menu {
		padding: 0;
	}

	/* "archiveofourown beta" text pop on hover */
	#header #greeting img,
	#header fieldset,
	#header form,
	#header p,
	#header .heading a:focus,
	#header .heading a:hover,
	#header .heading a:hover:visited,
	#tos_prompt .heading {
		color: #929292;
	}

	/* stay square, nav buttons */
	#header ul.primary {
		border-radius: 0 !important;
	}

	#header .menu li {
		border-bottom: 0;
		margin: 0 0.25em;
		text-align: left;
	}

	#header .menu li:last-child {
		border-bottom: 0;
	}

	#header .open a,
	#small_login {
		background: #232323;
	}

	/* user/post/login not blue */
	#header .user a {
		background: transparent;
		border: transparent;
	}

	/* user/post/login drowndown border rounding is consistent */
	#header .user .dropdown-toggle {
		border-radius: 0.25em 0.25em 0 0 !important;
	}

	#outer .group .heading,
	fieldset.listbox .heading,
	.userstuff .heading,
	.userstuff h2 {
		background: none;
		color: #fff;
	}

	/** SEARCH SECTION **/

	#header .search {
		float: right;
		color: #eee;
		margin-right: 0.25em;
	}

	#header #search .text,
	#header #search .button {
		border: 0;
	}

	/* small margin fix in searchbar */
	#header #search .text {
		margin: 0.3em 0.43em;
	}

	#header #search .button {
		border-radius: 1em;
		margin: 0;
	}

	/* header searchbar colours */
	#header #search .text,
	#header #search .text:active {
		background: #232323;
	}

	/* header searchbar colours */
	#header #search input:focus,
	#header #search .text:focus,
	#header #search .text:hover {
		background: #2b2b2b;
		border-color: transparent;
		color: #fff;
	}

	/* header searchbar remain round */
	#header form.search input[type="text"] {
		border-radius: 1em;
	}

	/* gives user greeting some breathing room */
	#greeting {
		padding: 0.5em 0;
	}

	#greeting .user > li {
		margin: 0 0.125em;
	}

	#greeting .menu {
		right: 0;
	}

	#header input,
	#header #search > *,
	#header #search .submit {
		display: inline;
		float: none;
	}

	/* check login and greeting; was a quick fix to remove bg */
	#header a,
	#header fieldset,
	#header form,
	#header p,
	#header li,
	#header h1,
	#small_login dl {
		background: transparent;
		font-size: 100%;
		border: 0;
		padding: 0;
		margin: 0;
		border-radius: 0;
	}

	/* collections header */
	#header h2 {
		border-top: 0;
		clear: both;
		color: #fff;
		display: block;
		font-size: 1.714em;
		line-height: 1.5;
		margin: 0;
		padding: 0 0.375em;
	}

	/* ---+ 05. MAIN +--- */

	/* nix h3 and news underlines on main splash */
	.splash .module h3 {
		border: 0;
		color: #929292;
	}

	.splash .browse li a,
	.splash .favorite a {
		border-radius: 0;
	}

	.splash .comment .userstuff {
		margin: inherit;
	}

	.splash .favorite li a {
		background: #2b2b2b;
		border: 1px solid transparent;
	}

	.splash .favorite li a:hover {
		background: #eee;
		border-color: #eee;
		color: #2b2b2b;
	}

	.splash .favorite li a:visited {
		color: #bfbfbf;
	}

	.splash .favorite li:nth-of-type(odd) a:focus,
	.splash .favorite li:nth-of-type(odd) a:hover,
	.splash .favorite li:nth-of-type(odd) a:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #2b2b2b;
	}

	/* nix news underlines on main splash */
	.splash .news li {
		border: 0;
	}

	/* preserves unread comment padding on splash page */
	.abbreviated h4.byline {
		padding-left: 83px !important;
	}

	/* ---+ 06. FOOTER +--- */

	#outer #footer {
		/* User Modified */
		background: #3c3c3c;
	}

	#outer .region,
	#footer .group {
		background: none;
	}

	/* nix the top border in the footer */
	#footer {
		border: 0;
	}

	/* ao3 blue accent on hover */
	#footer a:hover,
	#footer a:focus {
		background: transparent;
		color: #929292;
	}

	/* give the footer nav text a readable pillow */
	#footer ul.actions {
		background-color: #000;
	}

	/* ---+ 07. WORK READING ADJUSTMENTS +--- */

	/* WARNING:
		note: this change likely can (and will) royally screw up writers' work skins
	*/

	/* USER MODIFIED -- Completely removed this section  */

	/* ---+ 08. COMMENTS +--- */

	/* nix border outside the add comment box */
	#add_comnent,
	#add_comment div.comment,
	div.comment {
		border: 0;
	}

	#add_comment div.comment,
	fieldset fieldset,
	.comment fieldset,
	.post fieldset fieldset {
		background: none;
	}

	/* pretties up comments */
	li.comment {
		/* User Modified */
		background: #000 !important;
		border: 1px solid #555;
		/* border-radius: 0.25em; */
		margin: 1em 0;
		padding: 0.5em 1em;
	}

	/* something was misbehaving so this had to happen now it's the next day and i don't remember what it actually does */
	.actions li label {
		display: revert;
	}

	/* scoots comment user icon over + accommodates new comment padding */
	.comment div.icon {
		margin: -1.5em 0.75em 0.5em 0;
		border: 0;
	}

	.comment h4.byline {
		margin-top: 0.375em;
		/* padding: 0 .25em .25em 110px; */
	}

	/* new comment padding FINALLY */
	.comment .userstuff {
		margin: 1em 0;
		min-height: 3.3em;
	}

	/* ---+ 09. TAGS +--- */

	a.tag:hover {
		background: transparent;
	}

	/* User MOD - Make Relationship Tags Rounded when viewing a work */
	.work.meta .commas a {
		background: #2b2b2b;
		border: 1px solid transparent;
		border-radius: 0.75em;
		color: #eee;
		display: inline-block;
		font-size: 1em;
		margin: 1px 0;
		overflow: hidden;
		padding: 0.5px 6px;
		text-decoration: none;
		text-overflow: ellipsis;
	}

	/* tag-specific link attributes — makes tag bubbles! */
	.bookmark.blurb .commas a.tag,
	.series.blurb .commas a.tag,
	.work.blurb .commas a.tag,
	.work.meta .commas a.tag {
		background: #2b2b2b;
		border: 1px solid transparent;
		border-radius: 0.75em;
		color: #eee;
		display: inline-block;
		font-size: 0.9em;
		margin: 1px 0;
		overflow: hidden;
		padding: 0.5px 6px;
		text-decoration: none;
		text-overflow: ellipsis;
	}

	/* specific to edit work tags page */
	.work.meta .autocomplete li.added.tag {
		background: #2b2b2b;
		border: 1px solid transparent;
		border-radius: 0.75em;
		color: #eee;
		display: inline-block;
		font-size: 0.9em;
		margin: 1px 6px 1px 0;
		overflow: hidden;
		padding: 1px 2px 1px 9px;
		text-decoration: none;
		text-overflow: ellipsis;
	}

	/* tag bubble hover colours */
	.bookmark.blurb .commas a.tag:hover,
	.series.blurb .commas a.tag:hover,
	.work.blurb .commas a.tag:hover,
	.work.meta .commas a.tag:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* tag bubble visited colours */
	.bookmark.blurb .commas a.tag:visited,
	.series.blurb .commas a.tag:visited,
	.work.blurb .commas a.tag:visited,
	.work.meta .commas a.tag:visited,
	.work.meta .autocomplete li.added.tag:visited {
		background: #2b2b2b;
		border-color: #2b2b2b;
		color: #bfbfbf;
	}

	/* tag bubble visited hover colours */
	.bookmark.blurb .commas a.tag:visited:hover,
	.series.blurb .commas a.tag:visited:hover,
	.work.blurb .commas a.tag:visited:hover,
	.work.meta .commas a.tag:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* characters tag colours */
	.bookmark.blurb .commas li.characters a,
	.series.blurb .commas li.characters a,
	.work.blurb .commas li.characters a,
	.work.meta .character.tags .commas li a,
	.work.meta .character li.added.tag {
		background: #337e00;
		border-color: #337e00;
		color: #eee;
	}

	/* characters tag hover colours */
	.bookmark.blurb .commas li.characters a:hover,
	.series.blurb .commas li.characters a:hover,
	.work.blurb .commas li.characters a:hover,
	.work.meta .character.tags .commas li a:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* characters tag visited colours */
	.bookmark.blurb .commas li.characters a:visited,
	.series.blurb .commas li.characters a:visited,
	.work.blurb .commas li.characters a:visited,
	.work.meta .character.tags .commas li a:visited,
	.work.meta .character li.added.tag:visited {
		background: #204d02;
		border-color: #204d02;
		color: #eee;
	}

	/* character tag visited hover colours */
	.bookmark.blurb .commas li.characters a:visited:hover,
	.series.blurb .commas li.characters a:visited:hover,
	.work.blurb .commas li.characters a:visited:hover,
	.work.meta .character.tags .commas li a:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* relationships tag colours */
	.bookmark.blurb .commas li.relationships a,
	.series.blurb .commas li.relationships a,
	.work.blurb .commas li.relationships a,
	.work.meta .relationship.tags .commas li a,
	.work.meta .relationship li.added.tag {
		background: #0e60b0;
		border-color: #0e60b0;
		color: #eee;
	}

	/* relationships tag hover colours */
	.bookmark.blurb .commas li.relationships a:hover,
	.series.blurb .commas li.relationships a:hover,
	.work.blurb .commas li.relationships a:hover,
	.work.meta .relationship.tags .commas li a:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* relationships tag visited colours */
	.bookmark.blurb .commas li.relationships a:visited,
	.series.blurb .commas li.relationships a:visited,
	.work.blurb .commas li.relationships a:visited,
	.work.meta .relationship.tags .commas li a:visited,
	.work.meta .relationship li.added.tag:visited {
		background: #124679;
		border-color: #124679;
		color: #eee;
	}

	/* relationship tag visited hover colours */
	.bookmark.blurb .commas li.relationships a:visited:hover,
	.series.blurb .commas li.relationships a:visited:hover,
	.work.blurb .commas li.relationships a:visited:hover,
	.work.meta .relationship.tags .commas li a:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* warning tag colours */
	.bookmark.blurb .commas li.warnings a,
	.series.blurb .commas li.warnings a,
	.work.blurb .commas li.warnings a,
	.work.meta .warning.tags .commas li a {
		background: #e66000;
		border-color: #e66000;
		color: #eee;
	}

	/* warning tag hover colours */
	.bookmark.blurb .commas li.warnings a:hover,
	.series.blurb .commas li.warnings a:hover,
	.work.blurb .commas li.warnings a:hover,
	.work.meta .warning.tags .commas li a:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* warning tag visited colours */
	.bookmark.blurb .commas li.warnings a:visited,
	.series.blurb .commas li.warnings a:visited,
	.work.blurb .commas li.warnings a:visited,
	.work.meta .warning.tags .commas li a:visited {
		background: #5f0102;
		border-color: #5f0102;
		color: #eee;
	}

	/* warning tag visited hover colours */
	.bookmark.blurb .commas li.warnings a:visited:hover,
	.series.blurb .commas li.warnings a:visited:hover,
	.work.blurb .commas li.warnings a:visited:hover,
	.work.meta .warning.tags .commas li a:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #0b0b0b;
	}

	/* de-bubble rating/cat/fandom */
	.work.meta .category.tags .commas a,
	.work.meta .fandom.tags .commas a,
	.work.meta .rating.tags .commas a {
		background: transparent;
		border: 0;
		border-bottom: 1px dotted #eee;
		border-radius: 0;
		font-size: revert;
		margin: revert;
		padding: inherit;
	}

	.work.meta .category.tags .commas a:hover,
	.work.meta .category.tags .commas a:visited:hover,
	.work.meta .fandom.tags .commas a:hover,
	.work.meta .fandom.tags .commas a:visited:hover,
	.work.meta .rating.tags .commas a:hover,
	.work.meta .rating.tags .commas a:visited:hover {
		border-bottom: 1px dotted #c9c9c9;
		color: #0b0b0b;
	}

	/* de-bubble fandom labels in work blurbs/work page */
	.work.meta .category.tags .commas a:visited,
	.work.meta .fandom.tags .commas a:visited,
	.work.meta .rating.tags .commas a:visited {
		border-bottom: 1px dotted #bfbfbf;
		border-radius: 0;
		color: #bfbfbf;
	}

	/* ---+ 10. WORK BLURB CLEANUP +--- */

	/* turn down the lights on work blurb bgs */
	#main li.blurb {
		background: #000;
		border-color: transparent;
		border-radius: 0.25em;
		padding: 0.5em 1em;
		margin: 1em 0;
	}

	.bookmark .user {
		border: 0;
		margin-top: 0.65em;
		padding: 0.429em 0.75em;
		overflow: hidden;
	}

	.blurb .datetime,
	.datetime {
		font-size: small;
		line-height: 1.25;
	}

	/* makes tag scroll box for those 10000+ tag fics so you don't have to scroll for like ten minutes */
	li.blurb .tags {
		max-height: 8em;
		overflow-y: auto;
	}

	/* pretty sure these are the blurb key symbol blocks */
	ul.required-tags,
	.blurb .icon,
	.bookmark .status span {
		border: 0;
		opacity: 0.9;
	}

	/* cushion work blurb stats, align with bottom of listbox */
	.blurb dl.stats {
		margin-top: 1em;
		margin-bottom: 0.55em;
		line-height: 1.25;
	}

	/* gives work blurb some cushion between bottom buttons */
	.blurb blockquote {
		margin: 0.5em auto 1em auto;
	}

	/* adjust padding near edit/tags blurb buttons */
	.blurb .actions li {
		padding: 0 0.25em 0 0;
	}

	/* adjusts blurb header with rest of blurb bg */
	.blurb .header .heading {
		margin: 0.375em 5.25em 0 65px;
	}

	/* gets rid of commas after tags because bubbles */
	.commas li::after {
		content: none;
	}

	/* trims padding off the last child (sorry kiddo) */
	.commas li.last {
		padding: 0;
	}

	/*
	padding problem between li classes i gotta fix
	(ref: dl.meta dd ul li:first-child)

	li.warnings a:last-child,
	li.relationships a:last-child,
	li.characters a:last-child {
	}

	ul.commas

	.commas.warnings li:last-child {
		padding-right: .5em;

	}

	ul.tags.commas li.characters:first-child {
		padding-left: .25em;
	}

	*/

	/* knock tag bubbles on work page back into alignment */
	.meta dd ul li {
		padding-right: 0.5em;
		padding-left: 0;
	}

	/* de-bubble bookmarker tags */
	.bookmark.blurb .meta.tags.commas a.tag {
		background: revert;
		border: 0;
		border-bottom: 1px dotted #fff;
		border-radius: revert;
		color: #fff;
		display: inline;
		padding: revert;
	}

	/* de-bubble bookmarker hover tags */
	.bookmark.blurb .meta.tags.commas a.tag:hover {
		color: #c9c9c9;
	}

	/* de-bubble bookmark hover tags */
	.meta.tags.commas .tag:hover,
	.meta.tags.commas .tag:visited:hover {
		background: transparent;
	}

	/* stops blockquotes in work blurbs from inheriting margins */
	.summary.userstuff blockquote {
		margin: 0 1.5em !important;
		padding: 0.25em 0.75em;
	}

	/* some white space between tag block and rest of the work blurb */
	.tags.commas {
		margin: 0.5em 0;
	}

	/* cleans up user history work blurbs */
	.user.module.group {
		background: transparent;
		margin-top: 0.75em;
		padding: 0.375em 0 0 0;
	}

	/* ---+ 11. MESSAGES & TOOLTIPS +--- */

	#modal {
		background: #000;
		border: 0;
		border-radius: 0.5em;
		color: #eee;
	}

	#modal .content {
		border: 0;
	}

	#modal .footer {
		bottom: 0;
		height: 44px;
		left: 0;
		line-height: 44px;
		padding: 0.5em 1em;
		right: 0;
		position: absolute;
	}

	#modal .footer .action.modal-closer {
		bottom: 1em;
		position: absolute;
		right: 1em;
	}

	#modal .footer a.action.modal-closer:active {
		background: #0b0b0b;
		border-color: transparent;
		color: #fff;
	}

	#modal .footer a.action.modal-closer:hover,
	#modal .footer a.action.modal-closer:focus,
	#modal .footer a.action.modal-closer:visited:hover {
		background: #4f4f4f;
		border-color: transparent;
		color: #fff;
	}

	.error,
	.comment_error,
	.kudos_error,
	.LV_invalid,
	.LV_invalid_field input.LV_invalid_field:hover,
	input.LV_invalid_field:active,
	textarea.LV_invalid_field:hover,
	textarea.LV_invalid_field:active,
	.qtip-content,
	.system .intro {
		background: #000;
		border-color: #5998d6;
		color: #fff;
	}

	.flash,
	.notice {
		background: transparent;
		border-color: #929292;
		color: #eee;
		padding: 0.5em 0.375em;
	}

	#outer,
	.javascript,
	#tos_prompt,
	.announcement input[type="submit"] {
		background: #000;
	}

	form dd.required,
	.event.announcement .userstuff a,
	.filters .expander {
		color: #eee;
	}

	.announcement .userstuff a,
	.announcement .userstuff a:link,
	.announcement .userstuff a:visited:hover {
		color: #929292;
	}

	.announcement .userstuff a:visited {
		color: #bfbfbf;
	}

	.announcement .userstuff a:hover,
	.announcement .userstuff a:focus {
		color: #5897d4;
	}

	.bookmark .status span {
		border-color: #787878;
	}

	/* nix white in tooltip dropdown bg */
	.dropdown {
		background: none;
	}

	.mce-container input:focus {
		background: #f3efec;
	}

	/* help buttons get weird in the sidebar so this is a shrink ray */
	.help.symbol.question.modal.modal-attached {
		font-size: 0.75em;
	}

	/* search tooltip adjustments */
	.search [role="tooltip"] {
		background: #000;
		border: 1px solid #787878;
		border-radius: 0.25em;
		color: #eee;
		margin: 0.65em auto;
		padding: 0.25em 0.375em;
	}

	/* from reversi */
	.splash .favorite li:nth-of-type(odd) a,
	.ui-datepicker td:hover,
	#tos_prompt .heading,
	#tos_prompt [disabled] {
		background: #000;
	}

	/* ao3 blue accent on help (?) hover */
	.symbol .question,
	.qtip-content {
		background: transparent;
		color: #929292;
	}

	/* ---+ 12. DASHBOARD +--- */

	#dashboard,
	#dashboard.own {
		border-color: #929292;
	}

	#dashboard a,
	#dashboard span {
		color: #fff;
	}

	#dashboard a:active,
	#dashboard .current {
		background: #0b0b0b;
		border-color: transparent;
		color: #fff;
	}

	#dashboard a:focus,
	#dashboard a:hover {
		background: #4f4f4f;
		color: #fff;
	}

	/* nix dash button lines */
	#dashboard ul {
		border: 0;
	}

	/* dark dashboard backdrop, smaller font size, more padding */
	#dashboard.own {
		background: transparent;
		border-top: 0.75em solid #30679e;
		border-bottom: 0.75em solid #30679e;
		font-size: 0.85em;
		margin-top: 1.75em;
		padding: 0.25em;
	}

	/* ---+ 13. STATS PAGE +--- */

	/* smooth stats page borders, dark bg */
	.statistics .fandom.listbox.group {
		background: transparent;
		border: #000;
		border-radius: 0.25em;
		margin: 1em 0;
	}

	.statistics .fandom ul.index.group {
		background: #000 !important;
		border-radius: inherit;
		padding: 0.15em 0.65em;
	}

	/* cushion for h5 on stats page */
	.statistics .listbox h5.heading {
		font-size: 1.1em;
		margin: 0.75em 0 !important;
	}

	/* adjusts stats spacing */
	.statistics .index dd {
		margin: 1em 0 0.5em 0 !important;
	}

	/* adjusts stats spacing */
	.statistics .index li {
		border-radius: inherit;
		margin: 0.5em 0;
		padding: 0.5em;
	}

	/* even entries get a cool different colour */
	.statistics .index li:nth-of-type(even) {
		background: #2b2b2b;
	}

	/* ---+ 14. OTHER PAGES +--- */

	/* grabbed from ao3 core */
	.listbox,
	fieldset fieldset.listbox {
		clear: right;
		background: #161616;
		border: 0;
		border-radius: 0.25em;
		padding: 0;
		margin: 0.75em auto;
		overflow: hidden;
	}

	/* edit multiple works page: now all/none buttons should align with h5 */
	#edit-multiple-works a.check_all,
	#edit-multiple-works a.check_none {
		margin: -2px 0.15em 0 0.15em;
	}

	/* edit multiple works page: nix borders and backgrounds */
	#edit-multiple-works .fandom.listbox {
		border-color: transparent;
		border-radius: 0.25em;
		background: transparent;
	}

	/* edit multiple works page: tweak all/none button ul margins */
	#edit-multiple-works .fandom.listbox ul.actions {
		margin: 0 0 0.5em 0;
	}

	/* edit multiple works page: nix all/none button li margins */
	#edit-multiple-works .fandom.listbox ul.actions li {
		margin: 0;
	}

	/* banish noisy lines and background for: user fandoms, works, series, bookmarks */
	/*#user-fandoms,
#user-fandoms ol,*/
	#user-works,
	#user-works ul,
	#user-series,
	#user-series ol,
	#user-bookmarks,
	#user-bookmarks ol {
		background: transparent;
		border-color: transparent;
	}

	/*
	#user-fandom .fandom.listbox.group {
	}
	*/

	/* banishes giant black bar on subs/related works pages */
	dl.index dd,
	dl.index dt {
		background: transparent;
		border: transparent;
	}

	/* wrangles buttons/details directly below titles on subs/related works pages */
	dl.index dd {
		margin: 0.25em 0.25em 1.25em 0;
	}

	/* edit multiple works: kill background behind checkboxes */
	.concise label.action {
		background: transparent;
	}

	/* edit multiple works: darker bg */
	.listbox ul.index.concise {
		background: #000;
		border-radius: inherit;
	}

	/* bookmark buttons align with blurb padding */
	.bookmark .actions {
		padding: 0;
	}

	/* adjust bookmark icons */
	.bookmark.blurb p.status {
		right: 0.5em;
	}

	.bookmark .datetime {
		top: 30px;
	}

	/* changed bookmark box colours; might tweak more */
	.bookmark div.user,
	.bookmark div.recent {
		background-color: #000;
		border: 0;
	}

	/* additional tags category, cleans up tag category pages */
	.bookmark.listbox.group,
	.bookmark.listbox.group ul.index.group,
	.parent.listbox.group,
	.work.listbox.group,
	.work.listbox.group ul.index.group {
		background: transparent;
		border: 0;
	}

	/* remove blurb header bg on collection entries */
	.collection .header.module.group {
		background: transparent;
	}

	/* ao3 blue accent on hover */
	.listbox .heading a.tag:visited:hover {
		background: transparent;
		color: #c9c9c9;
	}

	/* ALL the listbox bgs transparent?? i guess */
	.listbox .index {
		background: transparent;
	}

	/* nix line on user dashboard/profile */
	.home .header h2 {
		border: 0;
	}

	/* for mobile: now the nav buttons on user screen no longer clip into user icon */
	.home .header ul.actions {
		max-width: 70%;
		text-align: right;
	}

	/* icon was misbehaving in header on dashboard/profile, now NO ONE floats */
	.profile .primary,
	.home .primary {
		float: none;
	}

	/* space bewteen h3 and listbox on fandoms page */
	.medium.listbox .index.group {
		margin: 0.5em 0;
	}

	.tags.commas.index.group {
		background: transparent;
	}

	/* ---+ 15. SORT & FILTER SIDEBAR +--- */

	/* S&F margin adjustment */
	#bookmark-filters fieldset,
	#work-filters fieldset {
		margin: 0 0.65em;
		padding: 0 0.65em;
	}

	/* S&F margin adjustment */
	#bookmark-filters fieldset dl,
	#work-filters fieldset dl {
		margin: 0.65em 0;
	}

	/* shortens S&F input boxes because otherwise the right end runs off the page */
	#collection_filters_title_autocomplete,
	#collection_filters_fandom_autocomplete,
	#bookmark_search_excluded_bookmark_tag_names_autocomplete,
	#bookmark_search_excluded_tag_names_autocomplete,
	#bookmark_search_other_bookmark_tag_names_autocomplete,
	#bookmark_search_other_tag_names_autocomplete,
	#bookmark_search_bookmark_query,
	#bookmark_search_bookmarkable_query,
	#work_search_excluded_tag_names_autocomplete,
	#work_search_other_tag_names_autocomplete,
	#work_search_query,
	#work_search_words_from,
	#work_search_words_to,
	#work_search_date_from,
	#work_search_date_to {
		padding: 1px 0 1px 0;
		width: 99%;
	}

	/* slightly smaller text for collapsed filter criteria */
	#include_rating_tags,
	#exclude_rating_tags,
	#include_archive_warning_tags,
	#exclude_archive_warning_tags,
	#include_category_tags,
	#exclude_category_tags,
	#include_fandom_tags,
	#exclude_fandom_tags,
	#include_character_tags,
	#exclude_character_tags,
	#include_relationship_tags,
	#exclude_relationship_tags,
	#include_freeform_tags,
	#exclude_freeform_tags,
	#include_tag_tags,
	#exclude_tag_tags {
		font-size: 0.9em;
	}

	/* slight space between S&F labels and their input */
	.filters .group dt.bookmarker,
	.filters .group dt.language,
	.filters .group dt.search,
	.filters .group dt.options {
		margin: 0.2em 0 0 0;
		padding: 0.25em 0;
	}

	/* adjust margins on dds containing input */
	.filters .group dd.language,
	.filters .group dd.search,
	.filters .group dd.options,
	.filters .more dd.search,
	dd.options ul li {
		margin: 0.2em 0;
	}

	/* slight space between S&F headings */
	dt.include.heading,
	dt.exclude.heading,
	dt.more.heading {
		margin-bottom: 0.15em;
	}

	/* adjust S&F dl containers because the margins obscure input boxes */
	dd.include.tags.group dl,
	dd.exclude.tags.group dl,
	dd.more.group dl,
	dt.search dd {
		margin: 0;
	}

	/* ao3 blue accent on autocomplete hover */
	.autocomplete .dropdown ul li:hover,
	.autocomplete .dropdown li.selected {
		background: transparent;
		color: #929292;
	}

	/* this is the part where the sort and filter arrow .gifs are taken out */
	.filters .expander,
	.filters .expanded .expander {
		background: transparent;
	}

	/* and replaced! hi, meet right unicode arrow */
	.filters .expander::before {
		content: "\\23F5\\00A0";
	}

	/* and left unicode arrow */
	.filters .expanded .expander::before {
		content: "\\23F7\\00A0";
	}

	/* parent expander buttons are too far in, so they're scooching over a skosh */
	.filters button.expander {
		padding: 0;
	}

	/* opposite with the kiddos */
	#work_crossover li,
	#work_complete li,
	.filters .tags li {
		padding-left: 0.75em;
	}

	/* gets rid of extra lines in S&F sidebar */
	form dl dt,
	.filters dt {
		border-bottom: 0;
	}

	/* fix search bars in work search because they're. A Lot */
	form.search input[type="text"] {
		border-color: #787878;
		border-radius: 0.25em;
	}

	fieldset,
	form.verbose legend,
	.verbose form legend,
	.filters .group dt.bookmarker {
		border: 0;
	}

	fieldset fieldset.listbox,
	.group.listbox {
		background: transparent;
		border-color: transparent;
		border-radius: 0.25em;
	}

	/* trying to make some boxes behave */
	.group.listbox .index {
		background: #000;
		border-radius: 0.25em;
	}

	form dl dt,
	form.single fieldset {
		border-color: #787878;
	}

	/* ---+ 16. MISC +--- */

	/* AREA UNPOPULATED BY ORIGINAL AUTHOR */

	/* ---+ 17. USER ADDED +--- */

	/* Make Nav Bar match other similar elements */
	#header ul.primary {
		background-color: #3c3c3c;
	}

	/* Make Dashboard borders match header */
	#dashboard.own {
		border-top: 0.75em solid #3c3c3c;
		border-bottom: 0.75em solid #3c3c3c;
	}

	/* Fix weird placement of "My Bookmarks" button when viewing a bookmark you made */
	ul.actions {
		padding-bottom: 0;
		padding-top: 0;
	}

	/* Make Chapter selection area more dark mode */
	select#selected_id {
		background-color: #000;
		color: #eee;
	}

	/* Style Kudos message similar to what it was in original Reversi */
	.kudos_error {
		color: #5998d6 !important;
		border-color: #5998d6 !important;
	}

	/* Desaturate symbols like the help question mark */
	span.symbol {
		border-color: #505050;
	}

	/* Fix unicode pointers used for sort and filter arrows not rendering on Android devices */
	.filters .expander::before {
		content: "\\25B6";
		font-family: sans-serif;
	}
	.filters .expanded .expander::before {
		content: "\\25BC";
		font-family: sans-serif;
	}

	/* Fix hover colours of rating and fandom tags when viewing a work page */
	.work.meta .rating.tags .commas a:hover,
	.work.meta .fandom.tags .commas a:hover {
		color: #000;
		background-color: #eee;
	}

	/* Increase max height since I don't mind it that much */
	li.blurb .tags {
		max-height: 50em;
	}

	/* Re-bubble category tags when viewing a work */
	.work.meta .category.tags .commas a {
		background: #2b2b2b;
		border: 1px solid transparent;
		border-radius: 0.75em;
		color: #eee;
		display: inline-block;
		font-size: 0.9em;
		margin: 1px 0;
		overflow: hidden;
		padding: 0.5px 6px;
		text-decoration: none;
		text-overflow: ellipsis;
	}

	/* Make category tags colour the same even if they're visited */
	.work.meta .category.tags .commas a:visited {
		color: #eee;
	}

	/* Change tag background for Multi category */
	.work.meta .category.tags .commas a[href*="Multi"],
	.work.meta .category.tags .commas a[href*="Multi"]:visited {
		color: #eee;
		background: linear-gradient(
			90deg,
			hsl(0, 100%, 30%),
			hsl(30, 100%, 30%),
			hsl(60, 100%, 30%),
			hsl(90, 100%, 30%),
			hsl(120, 100%, 30%),
			hsl(150, 100%, 30%),
			hsl(180, 100%, 30%),
			hsl(210, 100%, 30%),
			hsl(240, 100%, 30%),
			hsl(270, 100%, 30%),
			hsl(300, 100%, 30%),
			hsl(330, 100%, 30%),
			hsl(360, 100%, 30%)
		);
	}

	/* Add more category tag colours */

	/* F/F */
	.work.meta .category.tags .commas a[href*="F*s*F"] {
		background: #c10827;
		border-color: #c10827;
		color: #eee;
	}

	/* F/M */
	.work.meta .category.tags .commas a[href*="F*s*M"] {
		background: #81124d;
		border-color: #81124d;
		color: #eee;
	}

	/* M/M */
	.work.meta .category.tags .commas a[href*="M*s*M"] {
		background: #0245a8;
		border-color: #0245a8;
		color: #eee;
	}

	/* Gen */
	.work.meta .category.tags .commas a[href*="Gen"] {
		background: #78a602;
		border-color: #78a602;
		color: #eee;
	}

	/* Make all category tags the same when hovering */
	.work.meta .category.tags .commas a:hover,
	.work.meta .category.tags .commas a:visited:hover {
		background: #eee;
		border-color: #eee;
		color: #000;
	}

	div.header.module > p.datetime {
		background-size: 1px 1em;
		border-bottom: dotted 1px;
		display: inline;
	}

	div.own.user.module.group h5.byline.heading {
		padding-left: 0.45em;
		margin-bottom: 0.3em;
	}

	li[id^="bookmark_"][class^="bookmark"][class*="collapsed-blurb"] {
		height: max-content !important;
		padding-bottom: 0;
	}

	li[id^="bookmark_"][class^="bookmark"][class*="collapsed-blurb"] > div.own.user.module.group {
		margin-bottom: 1.1285714285714286em;
		position: relative;
		top: 9.7px;
	}

	div.header.module p.datetime,
	div.own.user.module.group p.datetime {
		/* margin-right: 0.3em; */
		padding-top: 0.175em;
	}

	div[id="chapters"][role="article"] > div.userstuff {
		padding: 0 4em;
	}

	/* Make sure author's using custom work skins don't flashbang me with a white background */
	#workskin details > summary,
	#workskin details > p,
	#workskin details[open] > summary,
	#workskin details[open] > p {
		background: inherit !important;
	}
	
	/* ---+ 18. USERSCRIPT COMPATIBILITY +--- */

	/* Add styling for elements added by the AO3: Tracking userscript (https://greasyfork.org/en/scripts/8382) */
	#tracked-box {
		border-color: #323232;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 8px 0px;
		background-color: #212121;
	}
	#tracked-bg {
		background-color: #000;
	}

	/* Ensure Kudos/Hit Element added by userscript is the correct colour */
	dl.stats dd.kudoshits {
		color: #eee !important;
	}

	/* Fix issues with Bookmark Maker Setting Dropdown */
	#w4BM_settings_dropdown > ul.dropdown-menu > li[style*="padding: 0.5em;"],
	#w4BM_divider_input_area {
		background-color: #3c3c3c !important;
	}

	/* Add styling for elements added by the AO3: Kudosed and seen history userscript (https://greasyfork.org/en/scripts/5835) */
	.has-kudos.marked-seen,
	.has-kudos {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFLklEQVRYw+1YC28UVRjdv0Db7c7zztw7M/e9KGDBUJ5SREQiEEBCBFECAlGggDws70cqD7GAhRYCFY3/0zN32IW0XdJuNSSGzaSZ3czM+R7nnO+b1vQ7+tTeA8/nY94VcGG6h6/NPbn2gY9yJxuFrODNfwcstM6NKdyh3NdVUt2M0p1ZsVLKacH9a8B48Coht+TiO5rtZ8VypVJj9mbFi97gjx7/tk+GlFLuMl4WwMgFArczwLNOEfZXjz/ZGzz2yGdcUGNWKnXfi+94ZEfOF7viL5dqpVSfCLnMxdElsHUZ5K3CrhPythc/rYfbixKmLIPRq6VcqnXmrlHGXAnTJ/XweV/4DcuZMbYLYGSJnFDSrVx85MIv3NctheBGy9Y1vMUy44LblnMAP2hEa4QULvR5Aze1/rIQl8P0ZU9wilBhXhfAzOhF+xxZbuJyIxfVZfKtWq/NzBUwg1I+8sjjevS0J7gWpsZMh+lUJ/XGMaDK+nNj5gqM5q1Q6kaYTPSFL3v9M4SJDjebGfp+dW70rqwYa8QjEcUJny3i2qySZa5Wm7g4xPL1QnIzC3KVH5iV2fLg5jW8NeYAy6G0vxf5w4QVs90+HViVziCHBOqtY2tSJ0o7GyqQQIWtBf+a5btZAaFX3lIR7QOtr4TJ4TSvlKbnArxGygNZcTxl+1kOJsvSrfQ0TuGXIS7u+uR+I77uJ6MeGe+Pj6SZbGErh81m3PvWUpuSvVARynU5oicJWy1kO+8qoY+lGvPiYwlrOqqDBJ9y8agRHaR5YcvCWlcSMByCFHPscdUq6aS8QarrYTLmkWWqbGf1ROb88oEXg0UVcfBj3LSHaI4aKFOmix6hcjdjioC4mRtwG966iiGBQ2l21yNbCs5sWcrcmhMxPRfTNumqlm/g4kEjHlCA1vDRMwmtnKTLIVHeCWya/94fH04znJOmPRulJwhDHM1WiADGmIJ7D0k5EqUjMV2iVG6M6Q644tHnQuwqOHg73h+N+gQyg2M/asRL0A5rqomUWHskyUb9BJDQbu7kYLoei5UR7sz5VzmPrAXLYAsYA3uy4lxE73gxJtVaKTFCjiXZWIPc8wmqQh2/zELmcTUTv2U5hh2oWwn0aJK96AshNoA9bMQA+9UjF8L0eJpdDdM2Pxa0CCj3iNMJG5BKtGYlHPhSlP7ZE3xRCIS1ScqdXG4TCmo+T+h6rRBiZsxCgT9U6jxhS5VuOwOkslnIiXp0yyffJ+xiUBrIfY9M9oUT/dE9j5yK6e6s6B7YOikjrWE3J8Bb/F0h1facj4Tps75wqieY6g1GA4JB8rAe3QgS0AoUuxUkWBn2spJidr7AVaWaRp8hFBtd1LTrpDxN6GQ5soKJeniS0B8JA/CxlG1QarwRAzVs2qBp1yj1S5Agb+itG2DEi1wRPtarHxIGMk/Ww7MR3ec8nLuNc5hQrHzj9QhKwyZkHfXu+AR3YdgIo818Vx/IdzMXT/qji1Fablt94dGEYZcDXu7obV75msaiMrXIR78Xu9UF7vG4Pzob07evfLVOiwSkiJ496w3QSAhmUKnMvnLm13PXrV2DUl2O6dE0qxY88AAj/AKhFyLKO3O71km76Ovz3uC3RvRTTNe2ppPpwEFUHh4y6DwSHEytGdDqWphgxHXyr9lLDZu/FKboH4aS7DxT33yJAvzBrNiXFeswCgt+PGHleNZ63l69tITUfG5vJVV3ALMn5z8TdjVKhhO22P0yb2DZ1YtotXWDzHyBztX1G7NZoFe//1fE/wD4H/scSFEBcv7UAAAAAElFTkSuQmCC)
				left no-repeat,
			url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLQaVxUOnAAAAIUlEQVQ4y2PU0tL6zzCIARPDIAejDhx14KgDRx040h0IAJzfAZEqmx9yAAAAAElFTkSuQmCC)
				left repeat-y !important;
		padding-left: 50px !important;
	}
	.kh-highlight-bookmarked-yes .is-bookmarked,
	dl.is-bookmarked {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLRqBxB/oAAAAe0lEQVRIx83V0Q3AIAhF0SvjuAH7fzBW+2fStNWorT4GICcEeCnnfFApdwcgIviievuZMq4KVMC9AlVwj0Al3A2ohrsAFXEFqIoDMGVcmaAqzt1JrSTZiWsmyW5cRMwD/95hU8ZNAVddvynjhoCr/6Yp47qAuxLHlHEAJ393eMyq3PGvAAAAAElFTkSuQmCC)
			right repeat-y !important;
		padding-right: 50px !important;
	}
	.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos,
	dl.is-bookmarked.has-kudos,
	.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen,
	dl.is-bookmarked.has-kudos.marked-seen {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFLklEQVRYw+1YC28UVRjdv0Db7c7zztw7M/e9KGDBUJ5SREQiEEBCBFECAlGggDws70cqD7GAhRYCFY3/0zN32IW0XdJuNSSGzaSZ3czM+R7nnO+b1vQ7+tTeA8/nY94VcGG6h6/NPbn2gY9yJxuFrODNfwcstM6NKdyh3NdVUt2M0p1ZsVLKacH9a8B48Coht+TiO5rtZ8VypVJj9mbFi97gjx7/tk+GlFLuMl4WwMgFArczwLNOEfZXjz/ZGzz2yGdcUGNWKnXfi+94ZEfOF7viL5dqpVSfCLnMxdElsHUZ5K3CrhPythc/rYfbixKmLIPRq6VcqnXmrlHGXAnTJ/XweV/4DcuZMbYLYGSJnFDSrVx85MIv3NctheBGy9Y1vMUy44LblnMAP2hEa4QULvR5Aze1/rIQl8P0ZU9wilBhXhfAzOhF+xxZbuJyIxfVZfKtWq/NzBUwg1I+8sjjevS0J7gWpsZMh+lUJ/XGMaDK+nNj5gqM5q1Q6kaYTPSFL3v9M4SJDjebGfp+dW70rqwYa8QjEcUJny3i2qySZa5Wm7g4xPL1QnIzC3KVH5iV2fLg5jW8NeYAy6G0vxf5w4QVs90+HViVziCHBOqtY2tSJ0o7GyqQQIWtBf+a5btZAaFX3lIR7QOtr4TJ4TSvlKbnArxGygNZcTxl+1kOJsvSrfQ0TuGXIS7u+uR+I77uJ6MeGe+Pj6SZbGErh81m3PvWUpuSvVARynU5oicJWy1kO+8qoY+lGvPiYwlrOqqDBJ9y8agRHaR5YcvCWlcSMByCFHPscdUq6aS8QarrYTLmkWWqbGf1ROb88oEXg0UVcfBj3LSHaI4aKFOmix6hcjdjioC4mRtwG966iiGBQ2l21yNbCs5sWcrcmhMxPRfTNumqlm/g4kEjHlCA1vDRMwmtnKTLIVHeCWya/94fH04znJOmPRulJwhDHM1WiADGmIJ7D0k5EqUjMV2iVG6M6Q644tHnQuwqOHg73h+N+gQyg2M/asRL0A5rqomUWHskyUb9BJDQbu7kYLoei5UR7sz5VzmPrAXLYAsYA3uy4lxE73gxJtVaKTFCjiXZWIPc8wmqQh2/zELmcTUTv2U5hh2oWwn0aJK96AshNoA9bMQA+9UjF8L0eJpdDdM2Pxa0CCj3iNMJG5BKtGYlHPhSlP7ZE3xRCIS1ScqdXG4TCmo+T+h6rRBiZsxCgT9U6jxhS5VuOwOkslnIiXp0yyffJ+xiUBrIfY9M9oUT/dE9j5yK6e6s6B7YOikjrWE3J8Bb/F0h1facj4Tps75wqieY6g1GA4JB8rAe3QgS0AoUuxUkWBn2spJidr7AVaWaRp8hFBtd1LTrpDxN6GQ5soKJeniS0B8JA/CxlG1QarwRAzVs2qBp1yj1S5Agb+itG2DEi1wRPtarHxIGMk/Ww7MR3ec8nLuNc5hQrHzj9QhKwyZkHfXu+AR3YdgIo818Vx/IdzMXT/qji1Fablt94dGEYZcDXu7obV75msaiMrXIR78Xu9UF7vG4Pzob07evfLVOiwSkiJ496w3QSAhmUKnMvnLm13PXrV2DUl2O6dE0qxY88AAj/AKhFyLKO3O71km76Ovz3uC3RvRTTNe2ppPpwEFUHh4y6DwSHEytGdDqWphgxHXyr9lLDZu/FKboH4aS7DxT33yJAvzBrNiXFeswCgt+PGHleNZ63l69tITUfG5vJVV3ALMn5z8TdjVKhhO22P0yb2DZ1YtotXWDzHyBztX1G7NZoFe//1fE/wD4H/scSFEBcv7UAAAAAElFTkSuQmCC)
				left no-repeat,
			url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLQaVxUOnAAAAIUlEQVQ4y2PU0tL6zzCIARPDIAejDhx14KgDRx040h0IAJzfAZEqmx9yAAAAAElFTkSuQmCC)
				left repeat-y,
			url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLRqBxB/oAAAAe0lEQVRIx83V0Q3AIAhF0SvjuAH7fzBW+2fStNWorT4GICcEeCnnfFApdwcgIviievuZMq4KVMC9AlVwj0Al3A2ohrsAFXEFqIoDMGVcmaAqzt1JrSTZiWsmyW5cRMwD/95hU8ZNAVddvynjhoCr/6Yp47qAuxLHlHEAJ393eMyq3PGvAAAAAElFTkSuQmCC)
				right repeat-y !important;
	}
	.marked-seen {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLQaVxUOnAAAAIUlEQVQ4y2PU0tL6zzCIARPDIAejDhx14KgDRx040h0IAJzfAZEqmx9yAAAAAElFTkSuQmCC)
			left repeat-y !important;
		padding-left: 50px !important;
	}
	.kh-highlight-bookmarked-yes .marked-seen.is-bookmarked,
	dl.marked-seen.is-bookmarked {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLQaVxUOnAAAAIUlEQVQ4y2PU0tL6zzCIARPDIAejDhx14KgDRx040h0IAJzfAZEqmx9yAAAAAElFTkSuQmCC)
				left repeat-y,
			url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAABGdBTUEAALGPC/xhBQAAAYRpQ0NQSUNDIHByb2ZpbGUAACiRfZE9SMNAHMVfU8UiFQcriChkqE52URHdShWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uripOgiJf4vKbSI8eC4H+/uPe7eAUKjwlSzKwqommWk4jExm1sVe14RwCiCGMScxEw9kV7MwHN83cPH17sIz/I+9+foU/ImA3wicZTphkW8QTyzaemc94lDrCQpxOfEEwZdkPiR67LLb5yLDgs8M2RkUvPEIWKx2MFyB7OSoRJPE4cVVaN8IeuywnmLs1qpsdY9+QuDeW0lzXWaI4hjCQkkIUJGDWVUYCFCq0aKiRTtxzz8w44/SS6ZXGUwciygChWS4wf/g9/dmoWpSTcpGAO6X2z7Ywzo2QWaddv+Prbt5gngfwautLa/2gBmP0mvt7XwEdC/DVxctzV5D7jcAYaedMmQHMlPUygUgPcz+qYcMHAL9K65vbX2cfoAZKir5Rvg4BAYL1L2use7A529/Xum1d8P+IBy3DhW7RUAAAAGYktHRAAcABsAIplAzIkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCB0MLRqBxB/oAAAAe0lEQVRIx83V0Q3AIAhF0SvjuAH7fzBW+2fStNWorT4GICcEeCnnfFApdwcgIviievuZMq4KVMC9AlVwj0Al3A2ohrsAFXEFqIoDMGVcmaAqzt1JrSTZiWsmyW5cRMwD/95hU8ZNAVddvynjhoCr/6Yp47qAuxLHlHEAJ393eMyq3PGvAAAAAElFTkSuQmCC)
				right repeat-y !important;
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
