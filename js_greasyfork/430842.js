// ==UserScript==
// @name         TorrentBD True Dark CSS - Github Theme
// @namespace    https://github.com/webdevsk
// @version      2.23
// @description  Modifies TorrentBD to use Dark mode inspired by Github.
// @author       BENZiN
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhEQ0QxMEFEM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhEQ0QxMEFFM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OERDRDEwQUIzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OERDRDEwQUMzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l3CaDAAADIUlEQVR42rRXv09aURQ+FsHWCg2RIAwSm6okJZSmi4tLKUZjw+TC6H9RN7vRTu3CYOzSxXY0JozCQgJ1KNSENKQ1jRB/1GJMKaBAyOs5z3vN8/mAdwVO8oXAu/d8H/f8uOcNgH4bQbxEPEc8RTxEPGDP/iJ+ITKIOCKKKEOPbBKxzhxKOlFmeya7Ib6LeIOoCRCrQXvfMl9C9giR7oJYjbTIaTxDHPeQnOOY+e4Y75M+kHOctDuJeyyLpT7jG+OSbVAh4DXC1+mILBYLGAwGMBqNMDw8DENDQ5eOBi9dXVxcQK1Wg3q9Do1GQ0a5fK0inzCuV/RlQJF03xHGa4U/MiKTOJ1O8Pl8MDMzA4FAAKanp3VncyaTgXg8DolEArLZLBSLRRLVKJVKj/HxT75unR8RkkpIKIVCISkWi0n9ML/fT1wfOLmZNxkiDwaDUr9tfn6eNyszBW4RcV9WYjbD1tZWT9pntVqFzc1N2N/fh7GxMZibm4Px8XEIh8Ows7MDjHORBLzgmyje3VoqlYLl5WU4OjoCjPON5FUlpcyd4vG3Wq1SpVK5cWT5fF5aXV2V8yIajbY82nQ6LfsQKEnihj/KHz0ej5x8uVxOWllZkdxut4Tqr56Pjo62FICVItoTiFvssqFETSaTmgLsdrvwZXVHNMYUv/Pzc82koyYkaiSgJLKBksnr9fZq1iiRgD2RHZTJNpvtxu+3rKA9ErArsoPugHbiBG2XBGyL7DCZTC0bT7PZFBWwfa0V68HExIRmBVCvEKyACnHTCfxDfBbJAS07ODgQ/fefiJuXIQ2fDT27+L2vtsPDQxHyBhtWgQuge/ldN/VEl46AvUf8UArgE9HubQUUCgXdmc+4QC2A2tsS78+iRrefDiPfS5izVS0BgA8oFAuI36ICzs7OOi0hnwuMAzQFMBFf8WNWNBynp6edjn2W+W5tuOAK7HWKMrWuvq61jOZIjVqv81czpW/mv70AxcIpNrRS45DnA7VFIhH5mlYQV9nQOaXlU0iAYgO9nodcLtdHnOvynHxjY6PpcDiK+OwLYo3W0Np2vpQC/gswALqtfOgnVs/UAAAAAElFTkSuQmCC
// @match       https://www.torrentbd.com/*
// @match       https://www.torrentbd.me/*
// @match       https://www.torrentbd.net/*
// @match       https://www.torrentbd.org/*
// @run-at       document-start
// @grant        GM_addStyle
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/430842/TorrentBD%20True%20Dark%20CSS%20-%20Github%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/430842/TorrentBD%20True%20Dark%20CSS%20-%20Github%20Theme.meta.js
// ==/UserScript==

(function() {
	let css = `

	:root:root .dark-scheme{

		--body-bg: 				#1c2026;
		--main-bg:				#21262d;
		--nav-bg:				#30363d;
	}
	:root:root .dark-scheme{

		/* Main background */
		/* --body-bg: 				#1c2026; */
		/* 	--body-bg: 				#111111; */
		/* 	--body-bg: 				#1e232a; */

		/* Block color */
		/* --main-bg:				#21262d; */
		/* 	--main-bg: 				#161B22; */
		/* 	--main-bg: 				#22272E; */

		/* Navbar color */
		/* 	--nav-bg:				#21262d; */
		/* --nav-bg:				#30363d; */
		/* 	--nav-bg: 				#2D333B; */

		/* --nav-bg:              #161B22;   */

		/* Text color main */
		--text-color: 			#c9d1d9;

		/* Text color for buttons with background color */
		--text-color-offset: 	#000000;

		--modal-color: 			#c1cdd2;
		--nav-alt-bg:			#58a6ff;
		--border-color: 		#404040;
		--link-color: 			#cae8ff;
		--link-hover-color: 	#79c0ff;
		--link-sp1-color:		#bbbbbb;
		--link-sp1-hover-color: #58a6ff;
		--link-sp2-color: 		#58a6ff;
		--link-sp3-color:		#388bfd;
		--btn-1-color: 			#58a6ff;
		--btn-2-color:			#388bfd;
		--progress-bar-bg: 		#051d4d;
	}

	/* scrollbar css for chome and opera only */

	.dark-scheme::-webkit-scrollbar, .dark-scheme ::-webkit-scrollbar{
		width: 8px !important;
	}
	.dark-scheme::-webkit-scrollbar-track, .dark-scheme ::-webkit-scrollbar-track{
		background-color: var(--main-bg) !important;
	}
	.dark-scheme::-webkit-scrollbar-thumb, .dark-scheme ::-webkit-scrollbar-thumb{
		background-color: var(--link-sp2-color) !important;
		border-radius: 50px;
	}
	.dark-scheme::-webkit-scrollbar-thumb:hover, .dark-scheme ::-webkit-scrollbar-thumb:hover{
		background-color: var(--link-sp3-color) !important;
	}

	/* scrollbar css for chome and opera only ends */

	/* Smaller Smiliey/Emotes portion */

	// body.dark-scheme #smilies-outline{
	// 	width: 300px !important;
	// 	margin-top: -340px;
	// 	float: right !important;
	// 	margin-right: 30px !important;
	// 	height: 290px;
	// 	background: var(--body-bg) !important;
	// 	overflow-y: scroll !important;
	// }
	body.dark-scheme #smilies-outline img{
		/*padding: 5px !important;*/
	}

	/* Smaller Smiliey/Emotes portion ends*/

	body.dark-scheme .card-panel{
		margin-top: 0px !important;
	}
	body.dark-scheme .tradiopill [type="radio"]:checked+label{
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme #form h5{
		color: var(--text-color) !important;
	}
	body.dark-scheme .btn.fltrsb-btn, body.dark-scheme .red.lighten-2, body.dark-scheme .teal, body.dark-scheme .teal.darken-3, body.dark-scheme .switch label input[type="checkbox"]:checked + .lever::after{
		background: var(--btn-1-color) !important;
	}
	body.dark-scheme .switch label input[type="checkbox"]:checked + .lever{
		background-color: #051d4d !important;
	}
	body.dark-scheme .epi-trigger td{
		color: var(--text-color) !important;
		border-top: 1px solid var(--border-color) !important;

	}
	body.dark-scheme #sbgift-modal{
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .loader-spinner{
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-outline{
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-outline:hover{
		color: var(--text-color-offset) !important;
		opacity: 0.9 !important;
	}
	body.dark-scheme .picker__day--selected, body.dark-scheme .picker__day--selected:hover, body.dark-scheme .picker--focused .picker__day--selected{
		background: var(--btn-1-color) !important;
		color: var(--text-color-offset) !important;
		font-weight: 900 !important;
	}
	body.dark-scheme .picker__day--infocus:hover{
		color: var(--text-color) !important;
	}
	body.dark-scheme .btn-floating i{
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .btn-flat{
		color: var(--link-color) !important;
	}
	body.dark-scheme .btn-flat:hover{
		color: var(--link-sp1-hover-color) !important;
	}
	body.dark-scheme .bbcc-mictr h6.sh6 {
	 	background-color: var(--nav-bg) !important;
	}
	body.dark-scheme a.atwl-common-trigger{
		color: var(--btn-1-color) !important;
		border: 1px solid var(--btn-1-color) !important;
		background: transparent !important;
	}
	body.dark-scheme .accc-btn:hover i{
		color: var(--link-sp3-color) !important;
	}
	body.dark-scheme .card-action, body.dark-scheme .personal-links{
		user-select: none !important;
	}
	body.dark-scheme a.atwl-common-trigger:hover{
		background: var(--btn-1-color) !important;
	}
	body.dark-scheme select[name="kuddus_secondary_filters_extended"]{
		border: 1px solid var(--btn-1-color) !important;
	}
	body.dark-scheme #torrents_search:focus{
	/* 	border-top: 1px solid #9e9e9e;

		border-right: 1px solid #9e9e9e;

		border-left: 1px solid #9e9e9e;	 */
		border-color: var(--border-sp-light-color) var(--border-sp-light-color) var(--border-sp-light-color);
	}
	button.picker__today:focus, button.picker__clear:focus, button.picker__close:focus{
		background: var(--main-bg) !important;
	}
	body.dark-scheme .donation-card{
		background: transparent !important;
	}
	body.dark-scheme .season-intro {
		color: var(--text-color) !important;
	}
	body.dark-scheme .movie-torrents-table .download-icon {
		color: var(--text-color) !important;
	}
	body.dark-scheme .movie-torrents-table .download-icon:hover {
		color: var(--link-sp3-color) !important;
	}
	body.dark-scheme tr.pck td {
		border-bottom: 1px solid var(--border-color) !important;
	}
	body.dark-scheme .sc-trigger{
		color: var(--text-color) !important;
		border: 2px solid var(--border-color) !important;
		background: var(--main-bg) !important;
	}
	body.dark-scheme .dropdown-content li>span{
		color: var(--text-color) !important;
	}
	body.dark-scheme .dropdown-content li>span:hover{
		color: var(--text-color-offset) !important;
		background: var(--link-sp1-hover-color) !important;
	}
	body.dark-scheme .dropdown-content li:hover, body.dark-scheme .dropdown-content li.active, body.dark-scheme .dropdown-content li.selected{
		background: var(--link-sp1-hover-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme #kuddus-resetter {
		background: var(--link-sp2-color) !important;
		border: 3px solid var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
		border-radius: 6px !important;
		transition: all 0.3s !important;
	}
	body.dark-scheme #kuddus-resetter:hover {
		background: var(--link-sp3-color) !important;
		border: 3px solid var(--link-sp3-color) !important;
		box-shadow: none !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .content-title, body.dark-scheme .row .content-title, body.dark-scheme .cnav-menu-item>a, body.dark-scheme .cnav-menu-item>span{
		color: var(--text-color) !important;
	}
	body.dark-scheme .tradiopill [type="radio"]+label{
		border-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .sh6{
		border-color: var(--link-sp2-color) !important;
		background-color: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme h6.sh6{
		border: 0px !important;
		background-color: transparent !important;
		color: var(--text-color) !important;
	}
	body.dark-scheme .carousel .carousel-item img, body.dark-scheme .logo-img, body.dark-scheme .tbdrank, body.dark-scheme .uc-seeding, body.dark-scheme .uc-leeching, body.dark-scheme .tooltipped img, body.dark-scheme .material-icons, body.dark-scheme .rel-icon, body.dark-scheme .cat-pic-img, body.dark-scheme .shout-text img{
	}
	body.dark-scheme .btn, body.dark-scheme .btn-large{
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .tamperhead {
		position:sticky !important;
		top:-1px !important;
		z-index:9999 !important;
	}
	body.dark-scheme .new-torrent-tag {
		background: var(--link-sp2-color)!important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .new-torrent-tag:hover {
		background: #388bfd !important;
	}
	body.dark-scheme .pagination li {
		line-height: 20px !important;
	}
	body.dark-scheme .pagination li.active, body.dark-scheme .paginator.active,  .paginator.active a{
		color: #111 !important;
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .comment-posted-on{
		color: var(--btn-2-color) !important;

	}
	body.dark-scheme .z-depth-2 {
		box-shadow: 0 0 0 0 !important;
	}
	body.dark-scheme #user-sb:hover {
		color: var(--text-color) !important;
	}
	body.dark-scheme .blue-grey.darken-2 {
		background-color: var(--main-bg) !important;
	}
	body.dark-scheme select:focus{
		outline: 1px solid var(--link-sp2-color) !important;
	}
	/*body.dark-scheme .circle {
		border-radius: 2% !important;
		margin-top: 15px !important;
		max-width: 60% !important;
	}*/
	body.dark-scheme .inline-submit-btn {
		color: var(--text-color) !important;
	}
	body.dark-scheme .inline-submit-btn:hover {
		color: #ccc !important;
	}
	body.dark-scheme #tampersmile {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme #tampersmile:hover {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .shout-label.active {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .green.darken-1 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .green.darken-2 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .btn-floating.btn-large {
		height: 40px !important;
		width: 40px !important;
	}
	body.dark-scheme .btn-floating {
		border-radius: 20% !important;
	}
	body.dark-scheme .btn-floating.btn-large i {
		line-height: 40px !important;
	}
	body.dark-scheme #kuddus-trigger {
		height: 40px !important;
		width: 40px !important;
		margin-top: 7px !important;
		border: 0px !important;
		background-color: transparent !important;
		box-shadow: none !important;
	}
	body.dark-scheme #kuddus-trigger i {
		text-shadow: 2px 3px #222 !important;
		color: var(--text-color) !important;
	}
	body.dark-scheme #kuddus-trigger-handle {
		display: none !important;
	}
	body.dark-scheme #kuddus-trigger-container {
		top: 3px !important;
		right: 0px !important;
	}
	body.dark-scheme .material-icons.orange600 {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .title-glyph {
		width: 0 !important;
		height: 0 !important;
		background-size: contain !important;
		padding: 13px !important;
		background-repeat: no-repeat !important;
		background-image: url(data:image/webp;base64,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) !important;
	}
	body.dark-scheme #kuddus-wrapper {
		background: var(--main-bg) !important;
	}
	body.dark-scheme .kuddus-title-bar {
		background: #111 !important;
	}
	body.dark-scheme #kuddus-close {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme #kuddus-close:hover {
		background: var(--link-sp3-color) !important;
	}
	body.dark-scheme #kuddus-searchtype {
		background: var(--main-bg) !important;
	}
	body.dark-scheme .kuddus-listener{
	/*     border: 1px solid var(--border-sp-color) !important; */
	}
	body.dark-scheme .kuddus-listener:focus{
		border: 1px solid var(--border-sp-color) !important;
		border-bottom: 1px solid var(--link-sp2-color) !important;
		box-shadow: 0 1px 0 0 var(--link-sp2-color) !important;
	}
	body.dark-scheme input[type="range"]::-moz-range-thumb{
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme input[type="range"] + .thumb{
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme input[type="range"] + .thumb .value{
		color: #000000 !important;
	}
	body.dark-scheme .forum-page-title {
		background: var(--nav-bg) !important;
		color: var(--text-color) !important;
	}
	body.dark-scheme .crumb-container, body.dark-scheme .crumb-container a {
		color: var(--text-color) !important;
	}
	body.dark-scheme .crumb-container a:hover {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .pg-intro {
		color: var(--text-color) !important;
	}
	body.dark-scheme .red100 {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .trgbtn {
		border-color: var(--link-sp2-color) !important;
		color: var(--link-sp2-color) !important;
		transition-duration: 0.3s;
	}
	body.dark-scheme .trgbtn:hover {
		background-color: var(--link-sp2-color) !important;
		color: #000000 !important;
	}
	body.dark-scheme .instr-trg {
		border-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .instr-trg {
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn:hover, body.dark-scheme .btn-large:not(#kuddus-trigger):hover {
		background-color: var(--link-sp3-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .blue.darken-2 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .blue.darken-2:hover{
		background-color: var(--btn-2-color) !important;
	}
	body.dark-scheme .blue.darken-3{
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .cyan.darken-2 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .cyan.darken-2:hover{
		background-color: var(--btn-2-color) !important;
	}
	body.dark-scheme .card .card-action a:hover {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .bbc-btn, body.dark-scheme .bbc-option {
		border: 1px solid var(--link-sp2-color) !important;
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .bbc-btn:hover {
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}
	option {
		background: #111 !important;
		color: var(--link-sp2-color) !important;
	}
	button:focus {
		background-color: var(--body-bg) !important;
	}
	body.dark-scheme .scrollToTop:hover {
		opacity: 1.0 !important;
	}
	body.dark-scheme .load-comments{
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .load-comments:hover{
		background-color: var(--btn-2-color) !important;
	}
	body.dark-scheme .teal.lighten-2 {
		background-color: #88f !important;
	}
	body.dark-scheme .teal.lighten-2:hover {
		background-color: #77f !important;
	}
	body.dark-scheme .options .btn-floating i {
		color: #111 !important;
	}
	body.dark-scheme .orange.lighten-2 {
		background-color: #fc6 !important;
	}
	body.dark-scheme .orange.lighten-2:hover {
		background-color: #c93 !important;
	}
	body.dark-scheme .cnav-menu-item > a:hover, body.dark-scheme .cnav-menu-item > span:hover {
		background-color: var(--link-sp2-color) !important;
		color: #000000 !important;
	}
	body.dark-scheme .section-description, body.dark-scheme .updated-by-text {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .forum-repu {
		background: #388bfd !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .white-text {
		color: var(--body-bg) !important;
	}
	body.dark-scheme .mrsr {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .tampertopsl-btn {
		color: var(--text-color) !important;
		border: 1px solid var(--link-sp2-color) !important;
		box-shadow: 0 2px 5px 0 var(--link-sp2-color)2, 0 2px 10px 0 var(--link-sp2-color)2 !important;
		background: none !important;
		margin-right: 5px !important;
		margin-top: 6px !important;
	}
	input[type="text"]:focus:not([readonly]) + label, input[type="password"]:focus:not([readonly]) + label, input[type="email"]:focus:not([readonly]) + label, input[type="url"]:focus:not([readonly]) + label, input[type="time"]:focus:not([readonly]) + label, input[type="date"]:focus:not([readonly]) + label, input[type="datetime-local"]:focus:not([readonly]) + label, input[type="tel"]:focus:not([readonly]) + label, input[type="number"]:focus:not([readonly]) + label, input[type="search"]:focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {
		color: var(--link-sp2-color) !important;
	}
	#urlWindow input:focus, input[type="text"]:focus:not([readonly]), input[type="password"]:focus:not([readonly]), input[type="email"]:focus:not([readonly]), input[type="url"]:focus:not([readonly]), input[type="time"]:focus:not([readonly]), input[type="date"]:focus:not([readonly]), input[type="datetime-local"]:focus:not([readonly]), input[type="tel"]:focus:not([readonly]), input[type="number"]:focus:not([readonly]), input[type="search"]:focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {
		border-bottom-color: transparent !important;
		box-shadow: 0 1px 0 0 var(--link-sp2-color) !important;
	}
	[type="checkbox"].filled-in:checked + label::after {
		border: 2px solid var(--link-sp2-color) !important;
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .red.lighten-2:hover {
		background-color: var(--link-sp3-color) !important;
	}
	body.dark-scheme .red.lighten-3 {
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .red.lighten-3:hover {
		background-color: var(--link-sp3-color) !important;
	}
	body.dark-scheme .tamperfltrsb-btn {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme {
		background: var(--body-bg) !important;
	}
	body.dark-scheme .subject-header {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .bg-warning {
		background-color: #222 !important;
	}
	body.dark-scheme hr {
		border: 1px solid #444 !important;
	}
	body.dark-scheme .bg-success {
		background-color: #333 !important;
	}
	body.dark-scheme .form-control, body.dark-scheme .list-group-item, body.dark-scheme select:not[name="kuddus_secondary_filters_extended"], body.dark-scheme .dropdown-menu {
		background: #161B22 !important;
		border: 1px solid #333 !important;
	}
	body.dark-scheme .form-control:focus {
		box-shadow: inset 0 1px 1px var(--text-color-offset)d, 0 0 8px var(--text-color-offset)d !important;
	}
	body.dark-scheme .label-success {
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .btn-info {
		background-color: var(--link-sp2-color) !important;
		border-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-info:hover {
		border-color: #1f6feb !important;
	}
	body.dark-scheme .btn-warning {
		color: var(--text-color-offset) !important;
		font-weight: 700 !important;
	}
	body.dark-scheme .btn-warning:hover {
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .btn-success {
		color: var(--text-color-offset) !important;
		font-weight: 700 !important;
	}
	body.dark-scheme .btn-success:hover {
		color: var(--text-color-offset) !important;
		background: #398439 !important;
	}
	[type="checkbox"]:checked + label::before {
		border-right: 2px solid var(--link-sp2-color) !important;
		border-bottom: 2px solid var(--link-sp2-color) !important;
	}
	table.striped > tbody.dark-scheme > tr:nth-child(2n+1) {
		background-color: var(--main-bg) !important;
	}
	body.dark-scheme .tclabel, body.dark-scheme .kuddus-sorter {
		color: var(--text-color) !important;
	}
	body.dark-scheme #kuddus-more-categories {
		color: var(--text-color) !important;
		user-select: none !important;
	/*     border: 1px solid var(--link-sp2-color) !important; */
	}
	body.dark-scheme .tclabel:hover {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .cmodal {
		background: rgba(0, 0, 0, 0.95) !important;
	}
	body.dark-scheme .cmodal-header {
		background: var(--body-bg) !important;
	}
	body.dark-scheme .forum-cat-heading {
	/*     background: var(--text-color-offset) !important; */
	}
	body.dark-scheme .btn-links {
		border: 2px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-links:hover {
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .tabs .tab a {
		color: var(--text-color) !important;
	}
	body.dark-scheme .tabs .tab a:hover {
		color: #ccc !important;
	}
	body.dark-scheme .tabs .indicator {
		background-color: var(--text-color) !important;
	}
	body.dark-scheme .tab-sortable {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .tab-sortable:hover {
		color: var(--link-hover-color) !important;
	}
	body.dark-scheme .torr-sort-icon {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .side-nav li:hover, body.dark-scheme .side-nav li:active {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .side-nav li.active {
		background: #c33 !important;
	}
	body.dark-scheme .btn-clear {
		border: 1px solid var(--link-sp2-color) !important;
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-clear:hover, body.dark-scheme .btn-clear:focus {
		color: var(--text-color) !important;
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .tradiopill[type="radio"] + label {
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .tradiopill[type="radio"]:checked + label {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme #kuddus-results-container a {
		color: var(--link-sp1-color) !important;
	}
	body.dark-scheme #kuddus-results-container a:hover {
		color: var(--link-sp1-hover-color) !important;
	}
	body.dark-scheme .border-teal {
		border:1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .short-links {
		background: #051d4d !important;
	}
	body.dark-scheme .short-link-counter {
		background: var(--link-sp2-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme .sub-h6 {
		color: var(--text-color-offset) !important;
		background: var(--link-sp2-color) !important;
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .tp-progress {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .tp-container {
		background: #051d4d !important;
	}
	body.dark-scheme .icon-input-box input {
		background: transparent !important;
	}
	body.dark-scheme .icon-input-box i {
	}
	body.dark-scheme .main-header, body.dark-scheme .sub-header {
		background: var(--nav-bg) !important;
		border-bottom: 1px solid #333 !important;
	}
	body.dark-scheme .main-header--icon, body.dark-scheme .sub-header--title {
		color: var(--text-color) !important;
	}
	body.dark-scheme .icon-input-box input[type="text"]:focus {
		border-color: var(--link-sp2-color) !important;
		box-shadow: 0 0 0 2px var(--link-sp2-color)8 !important;
	}
	body.dark-scheme .picker__date-display {
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .picker__weekday-display {
		background-color: #222 !important;
	}
	body.dark-scheme .picker__close, body.dark-scheme .picker__today {
		color: var(--text-color) !important;
	}
	body.dark-scheme .picker__header {
		margin-bottom: .75em !important;
	}
	body.dark-scheme .picker__box {
		background: #222 !important;
		border: 1px solid var(--body-bg) !important;
	}
	body.dark-scheme .picker__day.picker__day--today {
		color: var(--link-sp2-color) !important;
	}
	button.picker__today:focus, button.picker__clear:focus, button.picker__close:focus {
		background-color: #633 !important;
	}
	body.dark-scheme .picker__nav--prev, body.dark-scheme .picker__nav--next {
		margin-top: .25em !important;
	}
	body.dark-scheme .picker__nav--prev:hover, body.dark-scheme .picker__nav--next:hover {
		background: var(--text-color-offset)0 !important;
	}
	body.dark-scheme .picker__nav--prev:hover::before {
		border-right: 0.75em solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .picker__nav--next:hover::before {
		border-left: 0.75em solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .select-field-custom {
		background: transparent !important;
	}
	body.dark-scheme .select-field-custom::after {
		background: #333 !important;
	}
	body.dark-scheme .select-field-custom:hover::after {
		color: var(--text-color) !important;
	}
	[type="radio"].with-gap:checked + label::before {
		border: 2px solid var(--link-sp2-color) !important;
	}
	[type="radio"].with-gap:checked + label::after, [type="radio"]:checked+label:after {
		border: 2px solid var(--link-sp2-color) !important;
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .friend-card {
		background: transparent;
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .friend-card--delete::after{
		background: transparent !important;
	}
	body.dark-scheme .light-blue.darken-3 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .light-blue.darken-3:hover {
		background-color: var(--btn-2-color) !important;
	}
	body.dark-scheme .picker__select--month, body.dark-scheme .picker__select--year {
		background-color: var(--body-bg) !important;
	}
	body.dark-scheme .friend-card--delete {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .shoutbox-text {
		color: var(--text-color) !important;
	}
	body.dark-scheme .progress {
		background-color: var(--progress-bar-bg) !important;
	}
	body.dark-scheme .progress .determinate {
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .pr-action-container .btn-floating {
		background: var(--btn-1-color) !important;
	}
	body.dark-scheme .pr-action-container .btn-floating:hover {
		background: #1f6feb !important;
	}
	body.dark-scheme #msg-search {
		border-bottom: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .listitem {
		background: var(--body-bg) !important;
		border-bottom: 1px solid var(--border-color) !important;
	}
	/* .listitem:hover {
		background: var(--body-bg) !important;
		color: var(--text-color) !important;
	} */
	body.dark-scheme .listitem.thread-unread {
		background: var(--nav-bg) !important;
		color: var(--text-color) !important;
	}
	body.dark-scheme .message-body.dark-scheme {
		background: var(--main-bg) !important;
	}
	body.dark-scheme .message-subject, body.dark-scheme .backBtn {
		color: var(--link-sp2-color) !important;
	}
	button.replyBtn {
		background: var(--link-sp2-color) !important;
	}
	button.replyBtn:hover {
		background: var(--link-sp3-color) !important;
	}
	body.dark-scheme #message-thread-delete-btn {
		background-color: #822 !important;
		border: 2px solid #1f6feb !important;
	}
	body.dark-scheme #message-thread-delete-btn:hover {
		background-color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .teal.darken-1 {
		background-color: var(--btn-1-color) !important;
	}
	body.dark-scheme .teal.darken-1:hover {
		background-color: var(--btn-2-color) !important;
	}
	body.dark-scheme .tradiopill.ell[type="radio"] + label {
		border-right: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .gratitude legend, body.dark-scheme .stats {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .collapsible-header{
		user-select: none !important;
	}
	body.dark-scheme .tgaction {
		color: var(--link-sp2-color) !important;
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .repu {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .topsl-btn {
		border:1px solid var(--link-sp2-color) !important;
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .news-content h5, body.dark-scheme .news-content span a {
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .cnp-container {
		background: var(--progress-bar-bg) !important;
	}
	body.dark-scheme .cnp-progress {
		background: var(--link-sp2-color) !important;
	/*     background: linear-gradient(90deg, #d53369 0%, #daae51 100%) !important; */
	}
	body.dark-scheme .ft-lock-indicator {
		border: 2px solid var(--link-sp2-color) !important;
		color: var(--link-sp2-color) !important;
	}
	body.dark-scheme .fixed-pos {
		top: 0px !important;
		background-color: var(--nav-bg) !important;
	}
	body.dark-scheme .btn-outline {
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .btn-outline:focus {
		background: var(--link-sp2-color) !important;
	}
	body.dark-scheme .supp-post-body.dark-scheme {
		background:transparent;
		border:1px solid #444 !important;
	}
	body.dark-scheme .req-reseed-btn:hover {
		border: 1px solid var(--link-sp2-color) !important;
	}
	body.dark-scheme .tx-sp {
		color:var(--link-sp2-color)!important;
	}
	body.dark-scheme .likebtn:hover {
		color:var(--link-sp2-color)!important;
	}
	body.dark-scheme .hti-sf{
		border: 1px solid var(--btn-1-color) !important;
	}
	body.dark-scheme .hti-sf.active{
		background: var(--btn-1-color) !important;
		color: var(--text-color-offset) !important;
	}
	body.dark-scheme #notif-container{
		background: var(--body-bg) !important;
		border: 3px solid #333 !important;
	}
	body.dark-scheme #notif-container-header {
		background: var(--body-bg) !important;
		border-bottom: 1px solid #333 !important;
	}
	body.dark-scheme #v-a-notif-btn:hover{
		background: var(--btn-1-color) !important;
		color: #000 !important;
	}

	body.dark-scheme .collection a.collection-item:not(.active):hover {
		background: var(--body-bg) !important;
		color: var(--text-color) !important;
	}
	body.dark-scheme img:is([src*="smilies/hello.gif"], [src*="smilies/sticker-sq-yes.png"], [src*="smilies/sticker-sc-laugh.png"]){
    	filter: drop-shadow(0px 0px 0px #ffffff);
	}
	body.dark-scheme .shouts .shout-text a:not(:is(:has([color]), [href*="/requests.php"])){
		color: var(--btn-1-color);
	}
	body.dark-scheme .toast{
		background-color: var(--nav-bg);
	}
	body.dark-scheme .toast>*{
		color: var(--text-color) !important;
	}
	.
	////////////////////////////////////////////////////////////////////////
	@media(max-width: 1300px){
		body.dark-scheme #shout-idle-notice{
			background-position: 70% !important;
		}
	}
	@media(max-width: 700px){
		body.dark-scheme #shout-idle-notice{
			background-position: 75% !important;
		}
	}
	@media(max-width: 991px){
		body.dark-scheme #shout-idle-notice{
			background: none !important;
		}
		body.dark-scheme .cnav{
			top: auto;
			bottom: 0;
			box-shadow: 0px -2px 5px 0 rgb(0 0 0 / 16%), 0px -2px 10px 0 rgb(0 0 0 / 12%);
		}
		body.dark-scheme #logo-img-sm{
			height: 30px;
		}
		body.dark-scheme .nav-trigger i{
			line-height: 40px;
		}
		body.dark-scheme #kuddus-trigger-container {
			top: auto !important;
			right: 10px;
			bottom: 0px;
		}
		body.dark-scheme #middle-block{
			margin-top: 0px;
		}
		body.dark-scheme .edit-btn, .floating-btn {
			bottom: 60px;
			right: 20px;
		}
		body.dark-scheme .scrollToTop.forum-scroll{
			bottom: 130px;
			right: 20px;
		}
		body.dark-scheme #left-block{
			top: 0px;
		}
		body.dark-scheme #middle-block .options.right{
			float: left !important;
		}
		body.dark-scheme .mdi-navigation-arrow-drop-down:before{
			content: "";
		}

    /*   Cool RGB notifcation counter by >_<   */

    div#notif-wrapper {
       margin-top: 1rem;
    }

    div#notif-counter.z-depth-1 {
       position: relative;
       height: 42px;
       width: 350px;
       display: flex;
       align-items: center;
       justify-content: center;
       color: #FFF;
       font-size: 1.5em;
       font-weight: 500;
       font-family: Poppins, sans-serif;
       text-transform: capitalize;
       word-spacing: 1px;
       letter-spacing: 1px;
       background: #171B23;
       border-radius: 4px;
       border: none;
       cursor: pointer;
    }

    div#notif-counter.z-depth-1 i {
       font-size: 1.2em;
       padding: 0;
    }

    div#notif-counter.z-depth-1::before,
    div#notif-counter.z-depth-1::after {
       content: '';
       z-index: -1;
       position: absolute;
       width: calc(100% + 6px);
       height: calc(100% + 6px);
       top: -3px;
       left: -3px;
       border-radius: 5px;
       background: linear-gradient(200deg,
       #FF0000, #FFFF00, #00FF00, #0099FF,
       #001AFF, #A200FF, #A200FF, #FF0055,
       #FF0000, #FF0055
       );
       background-size: 300%;
       animation: border 12s linear infinite;
    }

    div#notif-counter.z-depth-1::after {
       filter: blur(12px);
    }

    div#notif-container.z-depth-2 {
       position: relative;
       width: 550px;
       font-family: Poppins, sans-serif;
       border-radius: 4px;
       border: none;
       cursor: pointer;
    }

    div#notif-container.z-depth-2::before,
    div#notif-container.z-depth-2::after {
       content: '';
       z-index: -1;
       position: absolute;
       width: calc(100% + 6px);
       height: calc(100% + 6px);
       top: -3px;
       left: -3px;
       border-radius: 5px;
       background: linear-gradient(200deg,
       #FF0000, #FFFF00, #00FF00, #0099FF,
       #001AFF, #A200FF, #A200FF, #FF0055,
       #FF0000, #FF0055
       );
       background-size: 300%;
       animation: border 12s linear infinite;
    }

    div#notif-container.z-depth-2::after {
       filter: blur(12px);
    }

    div#notif-container-header {
       background: #171B23;
       border-radius: 4px 4px 0 0;
       align-items: center;
       padding: 4px 0 4px 0;
    }

    div#notif-heading {
       margin-left: 4px;
    }

    div#notif-container-header div {
       display: flex;
       justify-content: center;
       align-items: center;
    }

    a#v-a-notif-btn {
       border-radius: 4px;
       transition: 300ms ease-in-out;
    }

    a#v-a-notif-btn:hover {
       background: #2C3E50;
    }

    span#notif-close-btn {
       background: transparent;
       border: 1px solid #CFD8DC;
       border-radius: 100px;
       width: 25px;
       height: 25px;
       display: flex;
       justify-content: center;
       align-items: center;
       padding: 0;
       margin-right: 8px;
       transition: 200ms ease-in-out;
    }

    span#notif-close-btn:hover {
       background: #DF5353;
    }

    div#notif-items-container {
       background: #2A2C32;
       border-radius: 0 0  4px 4px;
    }


    @keyframes border {

       0%,
       100% {
           background-position: 0 0;
       }

       50% {
           background-position: 100%;
       }
    }
    /* Done */

	}
	@media(min-width: 575px){
		/*body.dark-scheme #smilies-outline{
			width: 300px !important;
			margin-top: -340px;
			float: right !important;
			margin-right: 30px !important;
			height: 290px;
			background: var(--body-bg) !important;
			overflow-y: scroll !important;*/
		}
	}

	`;
	if (typeof GM_addStyle !== "undefined") {
	  GM_addStyle(css);
	  console.log('CSS Injection method: GM_addStyle');
	} else {
	  let styleNode = document.createElement("style");
	  styleNode.appendChild(document.createTextNode(css));
	  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
	  console.log('CSS Injection method: document.appendChild');
	}

	})();