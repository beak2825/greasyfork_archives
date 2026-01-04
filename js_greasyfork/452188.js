// ==UserScript==
// @name Full page Theme [ X ]
// @namespace userstyles.world/user/terifash
// @version 2.9.05
// @description Full page view styles and aside menu extender, and hide all not needed blocks
// @author terifash <teri.fash@gmail.com>
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/452188/Full%20page%20Theme%20%5B%20X%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/452188/Full%20page%20Theme%20%5B%20X%20%5D.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document regexp("https?://(www\\\\.)?xvideos.*") {



:root {
	--var-max-height-menu: 46px;
	--var-max-height-mozaique: 54px;
	--var-max-widht-menu: 255px;
	--var-height-menu-item: 140px;
	--var-thumb-transform: translate(-194px, -43px);
	--var-max-width-btn: 79px;
 	--min-height-page: 1px;
 	--color-main-red: #de2600;
	--color-main-white: #fff;
	--color-main-black: #161616;
	--color-main-gray: #262626;
}

@media (min-width: 768px) {
	#page #main {
/*     min-height: calc(var(--vh,1vh) * 100 - var(--min-height-page))!important; */
	}
}

@media (max-width: 1920px) {
	:root {
		--min-height-page: 2px;
	}
}

@media (max-width: 1440px) {
:root {
	--min-height-page: 1px;
	}
}


#page.video-page #video-player-bg #html5video.embed-responsive,
#page.video-page #video-player-bg #player,
#page.video-page #video-player-bg #html5video.embed-responsive .embed-responsive-item,
#page.video-page #video-player-bg #html5video.embed-responsive .embed,
#page.video-page #video-player-bg #player .embed-responsive-item,
#page.video-page #video-player-bg #player .embed {
/* 	height: 901px; */
	position: static;
	height: calc(var(--vh, 1vh) * 100 - var(--min-height-page))!important;
	min-height: calc(var(--vh, 1vh) * 100 - var(--min-height-page))!important;
}

body.home #footer,
body .search-page #footer,
#page #main + div[class^=foot],
.video-page #site-settings.btn-settings-top span[class*=flag],
.thumb-block--wrapper .metadata > .bg > span:not(.duration),
body .menu-list #related-videos .show-more,
/* .video-page .x-popup ul li:nth-child(1), */
.video-page .x-popup ul li:nth-child(2),
.video-page .x-popup ul li:nth-child(3),
.video-page .x-popup ul li:nth-child(4),
.video-page .x-popup ul li:nth-child(5),
.video-page .x-popup ul li:nth-child(6),
.video-page .x-popup ul li:nth-child(8),
.video-page .x-popup ul li:nth-child(7),
.video-page .x-popup ul li:nth-child(10),
.video-page .x-popup ul li:nth-child(11),
#main #content .premium-results-line,
#main #content .thumb-block p.metadata a,
#main #content  #related-videos .thumb-block p.metadata a,
#page.video-page .btn.menu-login-acct,
#page.video-page #footer .botLinks,
#page.video-page #html5video #hlsplayer .top-left,
#page.video-page .related-content__btns,
#page.video-page #v-actions-container,
#page.video-page #tabComments_bottom_page {
	display: none;
}

 #page.video-page #html5video #hlsplayer.play-clicked .big-button.play {
    display: block;
	  z-index: 11;
}

/* #related-videos .show-more, */
/* #v-actions-container, */
/* #related-videos .show-more2 */
#page.video-page #related-videos .bg .thumb-related-exo span,
#page.video-page #related-videos .bg span.sprfluous {
	/* 	opacity: 0; */
	/* 	visibility: hidden; */
}

#page.video-page #nav,
#page.video-page #header,
#main .page-title,
#page.video-page .video-tags-list.cropped {
	position: absolute;
}

#page.video-page #main #content {
	margin-right: auto;
	margin-left: auto;
	min-width: 61vw;
	padding-bottom: 38vw;
}

#page.video-page #content #html5video {
	position: absolute!important;
	min-height: 100vh;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
}

#page {
	max-width: unset;
	position: relative;
}

#main {
	margin-right: auto;
	margin-left: auto;
	width: 99.95vw;
}

#main .page-title {
	display: none;
	top: 6px;
	overflow: hidden;
	left: 770px;
	max-width: 43vw;
	width: 100%;
	font-size: 16px;
	line-height: 32px;
}

.video-page .thumb-block .duration {
	background-color: var(--color-main-red);
	color: var(--color-main-white);
}

#page.video-page .video-tags-list.cropped {
	padding: 0 20px;
	bottom: 23px;
	margin-bottom: 10px;
	left: 0px;
}

#page.video-page #nav {
	padding: 0 20px;
	bottom: 40px;
	left: 0;
	margin-bottom: 100px;
}

#page.video-page #header {
	width: 100%;
	padding: 0 20px;
	bottom: 70px;
	left: 0;
	margin-bottom: 30px;
}

#footer {
	padding: 0 20px;
	margin-top: 220px;
	bottom: 80px;
}

#related-videos .mozaique .thumb-block {
	width: 16.66%!important;
}

#page.video-page #xv-search-form {
	width: 100%;
}

#page.video-page #home-search .search-input,
#page.video-page #xv-search-form .search-input {
	background: var(--color-main-gray);
	border: 2px solid #333;
	color: #ddd;
}

#page.video-page #home-search .search-submit,
#page.video-page #xv-search-form .search-submit {
	background: #333;
	border: 2px solid #333;
	color: #000;
}

#page.video-page .x-popup.below .x-popup-arrow {
	top: unset;
	bottom: 0;
	transform: scale(-1);
}

.video-page {
	width: 100%;
	padding-left: 0;
	padding-top: 8px;
	padding-right: 0;
	transform: translateY(-26px);
	overflow-x: hidden;
}

.video-page #page {
	max-width: unset;
}

.video-page #header,
.video-page #nav,
.video-page .page-title,
.video-page .video-metadata,
.video-page #video-player-bg,
.video-page #video-tabs,
.video-page #content,
.video-page #tabComments_bottom_page,
.video-page #footer {
	/* 		max-width: 100vw !important;
		margin: 0 auto !important;
		padding: 0 0.5rem !important; */
}

body.video-page #site-settings:not(.btn-primary).btn-settings-top {
		z-index: 100;
    position: absolute;
    top: 25px;
    border: none;
		background-color: var(--color-main-red);
}

body.video-page #site-settings:not(.btn-primary) {
/* 	display: none; */
}

body.video-page #site-settings.btn-settings-top {
	display: block;
}

.btn-settings-top.btn-settings-top--left {
	left: 0;
	right: unset;
}

.btn-settings-top.btn-settings-top--right {
	left: unset;
	right: 0;
}

@media (min-width: 1440px) {
	.video-page #header,
	.video-page #nav,
	.video-page .page-title,
	.video-page .video-metadata,
	.video-page #video-player-bg,
	.video-page #video-tabs,
	.video-page #content,
	.video-page #tabComments_bottom_page,
	.video-page #footer {
		/* 			max-width: 100vw !important; */
	}
}

#content #video-player-bg,
.player-enlarged #video-player-bg {
	/* 		max-width: unset !important; */
	/* 		padding: 0 !important; */
}

#page.video-page #video-player-bg #html5video.embed-responsive,
#page.video-page #video-player-bg #player {
	/* 		padding-bottom: min(26.25%, 99vh); */
}

#html5video #hlsplayer .video-bg-pic .video-click-handler,
#html5video #hlsplayer .video-bg-pic .video-pic {
	left: 0;
	width: 100%;
	margin: 0;
}

body:not(.video-page) {
	overflow-x: hidden;
}

body.video-page .btn-settings-top {
	display: block;
}

body:not(.video-page) #page .menu-list {
	visibility: hidden;
	display: none;
}

body.video-page .menu-list {
	visibility: visible;
	display: flex;
	flex-wrap: wrap;
	transition: height 0.3s ease-in-out;
	position: absolute;
	max-width: var(--var-max-widht-menu);
	width: 100%;
	top: 0;
	height: calc(100vh - var(--var-max-height-menu));
	z-index: 12;
	background-color: var(--color-main-black);
	padding-top: 16px;
	padding-bottom: 16px;
	max-height: calc(100vh - var(--var-max-height-menu));
	overflow: hidden;
	justify-content: flex-start;
}

.video-page .menu-list.left {
	left: 0;
	right: unset;
	padding-left: 5px;
	direction: ltr;
}

.video-page .menu-list.right {
	padding-right: 5px;
	right: 0;
	left: unset;
	direction: rtl;
}

.video-page .menu-list.shows {
	/*   transition: all 0.5s; */
	/*   max-height: calc(100vh - 46px); */
	display: flex;
}

.video-page .menu-list.hides {
	max-height: 50px;
	min-height: 50px;
	display: flex;
	border-bottom-right-radius: 0!important;
	--var-max-height-mozaique: 46px;
}

.video-page .menu-list.small {
	--var-max-width-btn: 79px;
	--var-max-height-menu: 200px;
	--var-max-height-mozaique: 195px;
	--var-max-widht-menu: 255px;
	--var-height-menu-item: 140px;
	--var-thumb-transform: translate(-119px, -42px);
}

/* // ---- Start set big UI ----- // */
.video-page .menu-list.main {
	--var-max-width-btn: 80px;
	--var-thumb-transform: translate(-194px, -43px);
	--var-max-height-mozaique: 56px;
	--var-height-menu-item: 225px;
	--var-max-widht-menu: 405px;
}

.video-page .menu-list.is--related-videos.main {
	--var-max-widht-menu: 420px;
	--var-max-height-mozaique: 4px;
	--var-height-menu-item: 234px;
}

body.video-page .menu-list.small.hides {
/* 	--var-max-widht-menu: 140px; */
}

body.video-page .menu-list.hides.main {
	--var-max-widht-menu: 205px;
}

body.video-page .menu-list.hides.main .mozaique {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0!important;
	width: fit-content;
}

body.video-page .menu-list.small.hides .mozaique  {
/*  */
}

.thumb-block--wrapper.thumb-block .thumb-under {
	margin-bottom: -50px;
}

.thumb-block--wrapper.thumb-block .title a {
	font-size: 10px !important;
}

.thumb-block--wrapper .metadata .bg {
	display: inline-block;
	position: absolute;
	top: -195px;
	left: 5px;
}

body .menu-list.hides .mozaique {
	overflow-y: hidden;
}

/* // ----- End big UI ----- // */
body .menu-list #related-videos {
	width: 100%;
	height: 100%;
	min-height: 100%;
}

body .menu-list #related-videos .mozaique .thumb-block {
	width: 100%!important;
	padding: 0;
}

body .menu-list #related-videos .mozaique {
	margin-left: 0;
	margin-right: 0;
	min-height: 100%;
	height: 100%;
}

body .menu-list .mozaique {
	grid-area: video;
	background-color: var(--color-main-black);
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
	align-items: flex-start;
	opacity: 0.99;
	position: relative;
	flex-grow: 1;
	min-height: calc(100vh - var(--var-max-height-mozaique));
}

body .menu-list .menu-list__btn-wrapper {
	flex-grow: 1;
	margin-left: 5px;
	margin-right: 5px;
	margin-bottom: 5px;
	max-height: 32px;
	align-items: center;
	justify-content: flex-start;
	display: flex;
}

body .menu-list.left .menu-list__btn-wrapper {
	justify-content: flex-start;
	margin-right: 6px;
}

body .menu-list.right .menu-list__btn-wrapper {
	justify-content: flex-end;
	margin-left: 6px;
}

.menu-list__btn {
	text-decoration: none;
	margin: 0 2px 4px 0;
  border-width: 1px;
  transition: color ease .2s, box-shadow ease .2s, background-color ease .4s, border ease .2s;
	display: flex;
	align-items: center;
	max-width: var(--var-max-width-btn);
	min-height: 32px;
	line-height: 1;
	text-align: center;
	width: fit-content;
	justify-content: center;
	
  margin-bottom: 0;
/*   font-weight: 700; */
  white-space: nowrap;
  vertical-align: middle;
/*   touch-action: manipulation; */
  cursor: pointer;
  background-image: none;
  border: 1px solid var(--color-main-black);
  padding: 6px 10px;
  font-size: 20px;
  border-radius: 2px;
	color: var(--color-main-white);
  background-color: var(--color-main-gray);
}

.menu-list__btn.focus, 
.menu-list__btn:focus, 
.menu-list__btn:hover {
  background-color: var(--color-main-red);
	color: var(--color-main-gray);
	cursor: pointer;
/*   background-color: #262626; */
  border-color: var(--color-main-red);
	text-decoration: none;
	box-shadow: none;
}

.menu-list__btn-wrapper .left > .icf-arrow-left {
	/* 	display: none; */
}
.menu-list__btn-wrapper .right > .icf-arrow-right {
	/* 	display: none; */
}

.menu-list .menu-list__btn-wrapper .menu-list__btn.shows,
.menu-list .menu-list__btn-wrapper .menu-list__btn.hides {
	max-width: 50px;
	display: flex;
}

#site-settings {
	opacity: 1;
	pointer-events: auto;
	cursor: pointer;
}

body .menu-list .mozaique .thumb-block {
	width: 100%!important;
	max-height: var(--var-height-menu-item);
	cursor: pointer;
	color: var(--color-main-white);
	box-sizing: border-box;
	display: inline-block;
	padding: 4px;
	text-align: center;
	vertical-align: top;
}

body .menu-list .thumb-block .duration {
	background: var(--color-main-white);
	color: var(--color-main-black);
}

body .menu-list .mozaique .thumb-block .thumb-inside {
	min-height: var(--var-height-menu-item);
	height: 100%;
	width: 100%;
	display: block;
	position: relative;
	margin-bottom: 2px;
	overflow: hidden;
}

body .menu-list .mozaique .thumb-block .thumb-inside .thumb a {
	border: 1px solid #000;
	display: block;
	min-height: 89%;
	overflow: hidden;
	zoom: 1;
}

body .related-content__tabs .thumb-block {
	z-index: 50;
}

body .menu-list .mozaique .thumb-block img {
	vertical-align: bottom;
	width: 100%;
}

body .menu-list .mozaique .thumb-block:hover .thumb-related-exo .videopv video {
	z-index: 55;
}

body .menu-list .mozaique .thumb-block {
	transition: opacity 300ms ease-in;
}

body .menu-list .thumb-block .thumb-under .metadata {
	opacity: 1;
}

body .menu-list .thumb-block:hover .thumb-under .metadata {
	opacity: 0 !important;
	transition: opacity 300ms ease-out;
}

body .menu-list .thumb-block .title {
	display: inline-block;
}

body .menu-list #related-videos .thumb-block .sprfluous,
body .menu-list .thumb-block .thumb-under > .title,
body .menu-list .thumb-block .metadata .bg > span.duration + span a.thumb-related-exo,
body .menu-list .prof-verified-tick,
body .menu-list .thumb-block .metadata .bg > span.duration + span > .sprfluous,
body .menu-list .thumb-block .metadata .bg > span:not(.duration) > span .sprfluous {
	display: none;
}

body.video-page .menu-list .mozaique .thumb-block .thumb-under {
	transform: var(--var-thumb-transform);
	max-height: 36px;
	height: 20px;
	display: inline-block;
}

.video-page .menu-list .mozaique .thumb-block .thumb-under p {
	color: black;
}

.video-page .menu-list .thumb-block .metadata .bg > span:not(.duration) span,
.video-page .menu-list .thumb-block .metadata .bg > span.duration {
	background: #fdfdfd;
	border-radius: 3px;
	color: #161616;
	font-size: .83em;
	height: 18px;
	line-height: 15px;
	margin-left: 4px;
	left: 0;
	padding: 2px 3px;
	vertical-align: baseline;
	position: absolute;
	z-index: 3;
}

.video-page .menu-list .thumb-block .thumb-inside .video-hd-mark {
	background-color: var(--color-main-red);
}

.video-page .menu-list > .mozaique .thumb-block .metadata .bg > span:not(.duration) span {
	left: 45px;
}

.video-page .menu-list > .mozaique .thumb-block .metadata .bg > span:not(.duration) > .sprfluous {
	/* 	position: relative; */
	/* 	top: 0; */
	/* 	left: 0; */
}

.video-page .menu-list .thumb-block .thumb-inside .video-sd-mark,
.video-page .menu-list .thumb-block .thumb-inside .video-hd-mark {
	vertical-align: baseline;
	position: absolute;
	height: 18px;
	line-height: 18px;
	top: 5px;
	font-size: .93em;
	left: 5px;
	width: fit-content;
}

.video-page #related-videos a.btn-default.show-more {
	opacity: 0;
	height: 0;
	width: 0;
}

.video-page .menu-list .mozaique::-webkit-scrollbar-track {
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	border-radius: 2px;
	background-color: #3d3d3d;
}

#menu-content-list > .mozaique::-webkit-scrollbar,
#menu-content-list::-webkit-scrollbar,
body::-webkit-scrollbar {
	width: 4px;
	background-color: #333;
}

#menu-content-list > .mozaique::-webkit-scrollbar-thumb,
#menu-content-list::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
	border-radius: 2px;
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	background-color: #ccc;
}

body::-webkit-scrollbar-track {
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
	border-radius: 2px;
	background-color: var(--color-main-black);
}

}`;
if (new RegExp("^(?:https?://(www\\.)?xvideos.*)\$").test(location.href)) {
		css += `



		:root {
			--var-max-height-menu: 46px;
			--var-max-height-mozaique: 54px;
			--var-max-widht-menu: 255px;
			--var-height-menu-item: 140px;
			--var-thumb-transform: translate(-194px, -43px);
			--var-max-width-btn: 79px;
		 	--min-height-page: 1px;
		 	--color-main-red: #de2600;
			--color-main-white: #fff;
			--color-main-black: #161616;
			--color-main-gray: #262626;
		}

		@media (min-width: 768px) {
			#page #main {
		/*     min-height: calc(var(--vh,1vh) * 100 - var(--min-height-page))!important; */
			}
		}

		@media (max-width: 1920px) {
			:root {
				--min-height-page: 2px;
			}
		}

		@media (max-width: 1440px) {
		:root {
			--min-height-page: 1px;
			}
		}


		#page.video-page #video-player-bg #html5video.embed-responsive,
		#page.video-page #video-player-bg #player,
		#page.video-page #video-player-bg #html5video.embed-responsive .embed-responsive-item,
		#page.video-page #video-player-bg #html5video.embed-responsive .embed,
		#page.video-page #video-player-bg #player .embed-responsive-item,
		#page.video-page #video-player-bg #player .embed {
		/* 	height: 901px; */
			position: static;
			height: calc(var(--vh, 1vh) * 100 - var(--min-height-page))!important;
			min-height: calc(var(--vh, 1vh) * 100 - var(--min-height-page))!important;
		}

		body.home #footer,
		body .search-page #footer,
		#page #main + div[class^=foot],
		.video-page #site-settings.btn-settings-top span[class*=flag],
		.thumb-block--wrapper .metadata > .bg > span:not(.duration),
		body .menu-list #related-videos .show-more,
		/* .video-page .x-popup ul li:nth-child(1), */
		.video-page .x-popup ul li:nth-child(2),
		.video-page .x-popup ul li:nth-child(3),
		.video-page .x-popup ul li:nth-child(4),
		.video-page .x-popup ul li:nth-child(5),
		.video-page .x-popup ul li:nth-child(6),
		.video-page .x-popup ul li:nth-child(8),
		.video-page .x-popup ul li:nth-child(7),
		.video-page .x-popup ul li:nth-child(10),
		.video-page .x-popup ul li:nth-child(11),
		#main #content .premium-results-line,
		#main #content .thumb-block p.metadata a,
		#main #content  #related-videos .thumb-block p.metadata a,
		#page.video-page .btn.menu-login-acct,
		#page.video-page #footer .botLinks,
		#page.video-page #html5video #hlsplayer .top-left,
		#page.video-page .related-content__btns,
		#page.video-page #v-actions-container,
		#page.video-page #tabComments_bottom_page {
			display: none;
		}

		 #page.video-page #html5video #hlsplayer.play-clicked .big-button.play {
		    display: block;
			  z-index: 11;
		}

		/* #related-videos .show-more, */
		/* #v-actions-container, */
		/* #related-videos .show-more2 */
		#page.video-page #related-videos .bg .thumb-related-exo span,
		#page.video-page #related-videos .bg span.sprfluous {
			/* 	opacity: 0; */
			/* 	visibility: hidden; */
		}

		#page.video-page #nav,
		#page.video-page #header,
		#main .page-title,
		#page.video-page .video-tags-list.cropped {
			position: absolute;
		}

		#page.video-page #main #content {
			margin-right: auto;
			margin-left: auto;
			min-width: 61vw;
			padding-bottom: 38vw;
		}

		#page.video-page #content #html5video {
			position: absolute!important;
			min-height: 100vh;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;
		}

		#page {
			max-width: unset;
			position: relative;
		}

		#main {
			margin-right: auto;
			margin-left: auto;
			width: 99.95vw;
		}

		#main .page-title {
			display: none;
			top: 6px;
			overflow: hidden;
			left: 770px;
			max-width: 43vw;
			width: 100%;
			font-size: 16px;
			line-height: 32px;
		}

		.video-page .thumb-block .duration {
			background-color: var(--color-main-red);
			color: var(--color-main-white);
		}

		#page.video-page .video-tags-list.cropped {
			padding: 0 20px;
			bottom: 23px;
			margin-bottom: 10px;
			left: 0px;
		}

		#page.video-page #nav {
			padding: 0 20px;
			bottom: 40px;
			left: 0;
			margin-bottom: 100px;
		}

		#page.video-page #header {
			width: 100%;
			padding: 0 20px;
			bottom: 70px;
			left: 0;
			margin-bottom: 30px;
		}

		#footer {
			padding: 0 20px;
			margin-top: 220px;
			bottom: 80px;
		}

		#related-videos .mozaique .thumb-block {
			width: 16.66%!important;
		}

		#page.video-page #xv-search-form {
			width: 100%;
		}

		#page.video-page #home-search .search-input,
		#page.video-page #xv-search-form .search-input {
			background: var(--color-main-gray);
			border: 2px solid #333;
			color: #ddd;
		}

		#page.video-page #home-search .search-submit,
		#page.video-page #xv-search-form .search-submit {
			background: #333;
			border: 2px solid #333;
			color: #000;
		}

		#page.video-page .x-popup.below .x-popup-arrow {
			top: unset;
			bottom: 0;
			transform: scale(-1);
		}

		.video-page {
			width: 100%;
			padding-left: 0;
			padding-top: 8px;
			padding-right: 0;
			transform: translateY(-26px);
			overflow-x: hidden;
		}

		.video-page #page {
			max-width: unset;
		}

		.video-page #header,
		.video-page #nav,
		.video-page .page-title,
		.video-page .video-metadata,
		.video-page #video-player-bg,
		.video-page #video-tabs,
		.video-page #content,
		.video-page #tabComments_bottom_page,
		.video-page #footer {
			/* 		max-width: 100vw !important;
				margin: 0 auto !important;
				padding: 0 0.5rem !important; */
		}

		body.video-page #site-settings:not(.btn-primary).btn-settings-top {
				z-index: 100;
		    position: absolute;
		    top: 25px;
		    border: none;
				background-color: var(--color-main-red);
		}

		body.video-page #site-settings:not(.btn-primary) {
		/* 	display: none; */
		}

		body.video-page #site-settings.btn-settings-top {
			display: block;
		}

		.btn-settings-top.btn-settings-top--left {
			left: 0;
			right: unset;
		}

		.btn-settings-top.btn-settings-top--right {
			left: unset;
			right: 0;
		}

		@media (min-width: 1440px) {
			.video-page #header,
			.video-page #nav,
			.video-page .page-title,
			.video-page .video-metadata,
			.video-page #video-player-bg,
			.video-page #video-tabs,
			.video-page #content,
			.video-page #tabComments_bottom_page,
			.video-page #footer {
				/* 			max-width: 100vw !important; */
			}
		}

		#content #video-player-bg,
		.player-enlarged #video-player-bg {
			/* 		max-width: unset !important; */
			/* 		padding: 0 !important; */
		}

		#page.video-page #video-player-bg #html5video.embed-responsive,
		#page.video-page #video-player-bg #player {
			/* 		padding-bottom: min(26.25%, 99vh); */
		}

		#html5video #hlsplayer .video-bg-pic .video-click-handler,
		#html5video #hlsplayer .video-bg-pic .video-pic {
			left: 0;
			width: 100%;
			margin: 0;
		}

		body:not(.video-page) {
			overflow-x: hidden;
		}

		body.video-page .btn-settings-top {
			display: block;
		}

		body:not(.video-page) #page .menu-list {
			visibility: hidden;
			display: none;
		}

		body.video-page .menu-list {
			visibility: visible;
			display: flex;
			flex-wrap: wrap;
			transition: height 0.3s ease-in-out;
			position: absolute;
			max-width: var(--var-max-widht-menu);
			width: 100%;
			top: 0;
			height: calc(100vh - var(--var-max-height-menu));
			z-index: 12;
			background-color: var(--color-main-black);
			padding-top: 16px;
			padding-bottom: 16px;
			max-height: calc(100vh - var(--var-max-height-menu));
			overflow: hidden;
			justify-content: flex-start;
		}

		.video-page .menu-list.left {
			left: 0;
			right: unset;
			padding-left: 5px;
			direction: ltr;
		}

		.video-page .menu-list.right {
			padding-right: 5px;
			right: 0;
			left: unset;
			direction: rtl;
		}

		.video-page .menu-list.shows {
			/*   transition: all 0.5s; */
			/*   max-height: calc(100vh - 46px); */
			display: flex;
		}

		.video-page .menu-list.hides {
			max-height: 50px;
			min-height: 50px;
			display: flex;
			border-bottom-right-radius: 0!important;
			--var-max-height-mozaique: 46px;
		}

		.video-page .menu-list.small {
			--var-max-width-btn: 79px;
			--var-max-height-menu: 200px;
			--var-max-height-mozaique: 195px;
			--var-max-widht-menu: 255px;
			--var-height-menu-item: 140px;
			--var-thumb-transform: translate(-119px, -42px);
		}

		/* // ---- Start set big UI ----- // */
		.video-page .menu-list.main {
			--var-max-width-btn: 80px;
			--var-thumb-transform: translate(-194px, -43px);
			--var-max-height-mozaique: 56px;
			--var-height-menu-item: 225px;
			--var-max-widht-menu: 405px;
		}

		.video-page .menu-list.is--related-videos.main {
			--var-max-widht-menu: 420px;
			--var-max-height-mozaique: 4px;
			--var-height-menu-item: 234px;
		}

		body.video-page .menu-list.small.hides {
		/* 	--var-max-widht-menu: 140px; */
		}

		body.video-page .menu-list.hides.main {
			--var-max-widht-menu: 205px;
		}

		body.video-page .menu-list.hides.main .mozaique {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0!important;
			width: fit-content;
		}

		body.video-page .menu-list.small.hides .mozaique  {
		/*  */
		}

		.thumb-block--wrapper.thumb-block .thumb-under {
			margin-bottom: -50px;
		}

		.thumb-block--wrapper.thumb-block .title a {
			font-size: 10px !important;
		}

		.thumb-block--wrapper .metadata .bg {
			display: inline-block;
			position: absolute;
			top: -195px;
			left: 5px;
		}

		body .menu-list.hides .mozaique {
			overflow-y: hidden;
		}

		/* // ----- End big UI ----- // */
		body .menu-list #related-videos {
			width: 100%;
			height: 100%;
			min-height: 100%;
		}

		body .menu-list #related-videos .mozaique .thumb-block {
			width: 100%!important;
			padding: 0;
		}

		body .menu-list #related-videos .mozaique {
			margin-left: 0;
			margin-right: 0;
			min-height: 100%;
			height: 100%;
		}

		body .menu-list .mozaique {
			grid-area: video;
			background-color: var(--color-main-black);
			display: flex;
			width: 100%;
			height: 100%;
			flex-direction: column;
			overflow-y: auto;
			overflow-x: hidden;
			align-items: flex-start;
			opacity: 0.99;
			position: relative;
			flex-grow: 1;
			min-height: calc(100vh - var(--var-max-height-mozaique));
		}

		body .menu-list .menu-list__btn-wrapper {
			flex-grow: 1;
			margin-left: 5px;
			margin-right: 5px;
			margin-bottom: 5px;
			max-height: 32px;
			align-items: center;
			justify-content: flex-start;
			display: flex;
		}

		body .menu-list.left .menu-list__btn-wrapper {
			justify-content: flex-start;
			margin-right: 6px;
		}

		body .menu-list.right .menu-list__btn-wrapper {
			justify-content: flex-end;
			margin-left: 6px;
		}

		.menu-list__btn {
			text-decoration: none;
			margin: 0 2px 4px 0;
		  border-width: 1px;
		  transition: color ease .2s, box-shadow ease .2s, background-color ease .4s, border ease .2s;
			display: flex;
			align-items: center;
			max-width: var(--var-max-width-btn);
			min-height: 32px;
			line-height: 1;
			text-align: center;
			width: fit-content;
			justify-content: center;
			
		  margin-bottom: 0;
		/*   font-weight: 700; */
		  white-space: nowrap;
		  vertical-align: middle;
		/*   touch-action: manipulation; */
		  cursor: pointer;
		  background-image: none;
		  border: 1px solid var(--color-main-black);
		  padding: 6px 10px;
		  font-size: 20px;
		  border-radius: 2px;
			color: var(--color-main-white);
		  background-color: var(--color-main-gray);
		}

		.menu-list__btn.focus, 
		.menu-list__btn:focus, 
		.menu-list__btn:hover {
		  background-color: var(--color-main-red);
			color: var(--color-main-gray);
			cursor: pointer;
		/*   background-color: #262626; */
		  border-color: var(--color-main-red);
			text-decoration: none;
			box-shadow: none;
		}

		.menu-list__btn-wrapper .left > .icf-arrow-left {
			/* 	display: none; */
		}
		.menu-list__btn-wrapper .right > .icf-arrow-right {
			/* 	display: none; */
		}

		.menu-list .menu-list__btn-wrapper .menu-list__btn.shows,
		.menu-list .menu-list__btn-wrapper .menu-list__btn.hides {
			max-width: 50px;
			display: flex;
		}

		#site-settings {
			opacity: 1;
			pointer-events: auto;
			cursor: pointer;
		}

		body .menu-list .mozaique .thumb-block {
			width: 100%!important;
			max-height: var(--var-height-menu-item);
			cursor: pointer;
			color: var(--color-main-white);
			box-sizing: border-box;
			display: inline-block;
			padding: 4px;
			text-align: center;
			vertical-align: top;
		}

		body .menu-list .thumb-block .duration {
			background: var(--color-main-white);
			color: var(--color-main-black);
		}

		body .menu-list .mozaique .thumb-block .thumb-inside {
			min-height: var(--var-height-menu-item);
			height: 100%;
			width: 100%;
			display: block;
			position: relative;
			margin-bottom: 2px;
			overflow: hidden;
		}

		body .menu-list .mozaique .thumb-block .thumb-inside .thumb a {
			border: 1px solid #000;
			display: block;
			min-height: 89%;
			overflow: hidden;
			zoom: 1;
		}

		body .related-content__tabs .thumb-block {
			z-index: 50;
		}

		body .menu-list .mozaique .thumb-block img {
			vertical-align: bottom;
			width: 100%;
		}

		body .menu-list .mozaique .thumb-block:hover .thumb-related-exo .videopv video {
			z-index: 55;
		}

		body .menu-list .mozaique .thumb-block {
			transition: opacity 300ms ease-in;
		}

		body .menu-list .thumb-block .thumb-under .metadata {
			opacity: 1;
		}

		body .menu-list .thumb-block:hover .thumb-under .metadata {
			opacity: 0 !important;
			transition: opacity 300ms ease-out;
		}

		body .menu-list .thumb-block .title {
			display: inline-block;
		}

		body .menu-list #related-videos .thumb-block .sprfluous,
		body .menu-list .thumb-block .thumb-under > .title,
		body .menu-list .thumb-block .metadata .bg > span.duration + span a.thumb-related-exo,
		body .menu-list .prof-verified-tick,
		body .menu-list .thumb-block .metadata .bg > span.duration + span > .sprfluous,
		body .menu-list .thumb-block .metadata .bg > span:not(.duration) > span .sprfluous {
			display: none;
		}

		body.video-page .menu-list .mozaique .thumb-block .thumb-under {
			transform: var(--var-thumb-transform);
			max-height: 36px;
			height: 20px;
			display: inline-block;
		}

		.video-page .menu-list .mozaique .thumb-block .thumb-under p {
			color: black;
		}

		.video-page .menu-list .thumb-block .metadata .bg > span:not(.duration) span,
		.video-page .menu-list .thumb-block .metadata .bg > span.duration {
			background: #fdfdfd;
			border-radius: 3px;
			color: #161616;
			font-size: .83em;
			height: 18px;
			line-height: 15px;
			margin-left: 4px;
			left: 0;
			padding: 2px 3px;
			vertical-align: baseline;
			position: absolute;
			z-index: 3;
		}

		.video-page .menu-list .thumb-block .thumb-inside .video-hd-mark {
			background-color: var(--color-main-red);
		}

		.video-page .menu-list > .mozaique .thumb-block .metadata .bg > span:not(.duration) span {
			left: 45px;
		}

		.video-page .menu-list > .mozaique .thumb-block .metadata .bg > span:not(.duration) > .sprfluous {
			/* 	position: relative; */
			/* 	top: 0; */
			/* 	left: 0; */
		}

		.video-page .menu-list .thumb-block .thumb-inside .video-sd-mark,
		.video-page .menu-list .thumb-block .thumb-inside .video-hd-mark {
			vertical-align: baseline;
			position: absolute;
			height: 18px;
			line-height: 18px;
			top: 5px;
			font-size: .93em;
			left: 5px;
			width: fit-content;
		}

		.video-page #related-videos a.btn-default.show-more {
			opacity: 0;
			height: 0;
			width: 0;
		}

		.video-page .menu-list .mozaique::-webkit-scrollbar-track {
			box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
			border-radius: 2px;
			background-color: #3d3d3d;
		}

		#menu-content-list > .mozaique::-webkit-scrollbar,
		#menu-content-list::-webkit-scrollbar,
		body::-webkit-scrollbar {
			width: 4px;
			background-color: #333;
		}

		#menu-content-list > .mozaique::-webkit-scrollbar-thumb,
		#menu-content-list::-webkit-scrollbar-thumb,
		body::-webkit-scrollbar-thumb {
			border-radius: 2px;
			box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
			background-color: #ccc;
		}

		body::-webkit-scrollbar-track {
			box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
			border-radius: 2px;
			background-color: var(--color-main-black);
		}

		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
