/* ==UserStyle==
 -- THEME STUFF --
@name           GreasyFork | Modernized ( Optional Dark Theme )
@version        1.3.17
@description    A much cleaner and more modern version of GreasyFork!

 -- AUTHOR STUFF --
@namespace      Freeplay
@author         Freeplay (https://freeplay.codeberg.org/)
@homepageURL    https://codeberg.org/Freeplay/UserStyles
@supportURL     https://codeberg.org/Freeplay/UserStyles/issues
@preprocessor   stylus


--- SETTINGS ---
@var select theme "Theme" ["auto", "light", "dark"]

@downloadURL https://update.greasyfork.org/scripts/404443/GreasyFork%20%7C%20Modernized%20%28%20Optional%20Dark%20Theme%20%29.user.css
@updateURL https://update.greasyfork.org/scripts/404443/GreasyFork%20%7C%20Modernized%20%28%20Optional%20Dark%20Theme%20%29.meta.css
==/UserStyle== */


@-moz-document domain("greasyfork.org") {
	dark() {
		--color-primary: #272b36bd;
		--color-secondary: #072b3a ;
		--color-tertiary: #2c3242;
		--color-bg: #1c1f28;
		--color-text: #d1d1d1;
		--color-link: #00b3ff;
		--color-link-visited: cyan;
		--color-highlighted #287721;
		--shadow-normal: 0 0px 3px rgba(0,0,0,0.5);
		--shadow-button: none;
		--border-button:  1px solid rgba(150,150,150,.1);
	}
	light() {
		--color-primary: #980000bd;
		--color-secondary: white;
		--color-tertiary: white;
		--color-bg: #F6F6F6;
		--color-text: black;
		--color-link: #0265be;
		--color-link-visited: #cf2525;
		--color-highlighted: #9fefa3;
		--shadow-normal: 0 0 10px rgba(0, 0, 0, .01);
		--shadow-button: 0px 0px 0px 20px var(--color-bg) inset;
		--border-button:  1px #dcdcdc solid;
	}
	:root {
		if theme == auto {
			light();
			@media (prefers-color-scheme: dark) {
				dark();
			}
			
		} else if theme == light {
			light();
		} else {
			dark();
		}
	}
	* {
		transition: background .2s;
	}
		
		/* TEXT */
		h3, h2 {
			color: var(--color-text);
		}
		h3 {
			margin-bottom: 1em !important;
		}
		p {
			color: var(--color-text);
		}
		
		.post-discussion > p:first-child,
		.sidebarred-main-content > p,
		{
			font-size: 0;
		}
		.sidebarred-main-content > h2 + p {
			font-size: inherit !important;
			margin-top: 0 !important;
		}
		
		/* BUTTONS/LINKS */
		select, option, input, button:not(.lum-gallery-button), code, #user-control-panel > li, .sign-in-link a,
		.pagination > *, .script-list + .pagination > *, .user-list + .pagination > *, 
		a.list-option-button, #script-links > li > *, #script-feedback-suggestion a, .discussion-actions a, .report-link, .edit-comment, .post-discussion > p:first-of-type a, .discussion-up-level a, .post-discussion > div > .inline-list > li a,
		#script-content > ul li a,
		#about-user > p:last-child > *, #about-user > a:first-child,
 		#install-area a, .expander, #contribution > a,  #support-url > a, .script-in-sets > a,
 		.sidebarred-main-content > p:last-child a, .sidebarred-main-content > p:first-of-type a,
 		#home-top-sites a,
 		#by-site-list > li > a {			
			border: var(--border-button) !important;
			text-decoration: none !important;
			border-radius: .3rem !important;
			padding: 5px 14px;
			font-size: 14px;
			font-family: Segoe UI, Helvetica, Arial, sans-serif, Segoe UI Emoji !important;
			transition: all .2s;
			background-color: var(--color-secondary) !important;
			color: var(--color-text) !important;
			list-style: none;
			outline: none !important;
		}
		code {
			padding: 2px 4px !important;
		}
		select:hover, input:hover, input:focus, button:not(.lum-gallery-button):hover, #user-control-panel > li:hover,  .sign-in-link a:hover,
		a.list-option-button:hover, #script-links > li > *:hover, #script-feedback-suggestion a:hover, #script-links .current span, .discussion-actions a:hover, .report-link:hover, .edit-comment:hover, .post-discussion > p:first-of-type a:hover, .discussion-up-level a:hover, .post-discussion > div > .inline-list > li a:hover,
		#script-content > ul li a:hover,
		#about-user > p:last-child > *:hover, #about-user > a:first-child:hover,
		.pagination > *:hover, .script-list + .pagination > *:hover, .user-list + .pagination > *:hover, .pagination > *:focus, .script-list + .pagination > *:focus, .user-list + .pagination > *:focus, 
 		#install-area a:hover, .expander:hover, #contribution > a:hover, #support-url > a:hover, .script-in-sets > a:hover,
 		.sidebarred-main-content > p:last-child a:hover, .sidebarred-main-content > p:first-of-type a:hover,
 		#home-top-sites a:hover,
 		#by-site-list > li > a:hover {
			box-shadow: var(--shadow-button) !important;
			background-color: var(--color-tertiary) !important;
			text-decoration: none !important;
		}
		
		select:not(#remove-scripts-included) { /* Contributed by https://codeberg.org/Riedler */
			appearance:none;
			background-image:url("https://riedler.wien/sfto/darklearning/double_triangles_top_bottom_AAA.svg");
			background-repeat:no-repeat;
			background-position:center right 7px !important;
			background-size:auto 50%;
		}
		
		
		nav > li > a, .pagination > a, #user-control-panel > li > a, #script-links > li > a, div[class="list-option-group"] > ul > li > a, h2 > a ,
		.comment-meta-item-main a {
			text-decoration: none;
			color: var(--color-text);
		}
		.pagination {
			margin-bottom: 20px;
		}
		a {
			display: inline-block;
		}
		a, a.discussion-title, a.discussion-title:hover {
			text-underline-offset: .25em;
			color: var(--color-link);
		}
		a:hover, a.discussion-title:hover {
			text-decoration: underline;
		}
		a:visited {
			color: var(--color-link-visited);
		}
		body, html {
			background-color: var(--color-bg);
			font-family: Segoe UI, Helvetica, Arial, sans-serif, Segoe UI Emoji !important;
		}
		body > .width-constraint {
			max-width: 100% !important;
			margin: 0;
			padding: 10px;
			display: flex;
			flex-direction column
			// flex-wrap: wrap;
		}
		body > .width-constraint > * {
			width: 100%;
		}
		body > .width-constraint > section, .notice, .alert, .announcement {
			max-width: 80rem;
			margin: auto !important;
		}
		body > .width-constraint > section:first-child, .notice, .alert {
			margin-top: 20px !important;
		}
		body > .width-constraint > section:last-of-type {
			margin-bottom: 40px !important;
		}
		.alert, .announcement {
			background-color: var(--color-secondary);
			margin-bottom: 20px !important;
		}
		.alert *, .announcement {
			color: var(--color-text) !important;
			padding: 10px;
		}
		.announcement {
			margin-top: 10px !important;
			border-radius: .3rem;
		}
		section {
			border: none !important;
		}
		
		.notice {
			background-color: var(--color-secondary);
		}
		
		
		.text-content, .discussion-list, #browse-user-list, .inline-form, #new_user,
		#script-meta, #additional-info, #script-show-info-ad, #script-content .script-discussion-list, canvas, 
		/*.multiform-page*/, #script-content form:not(.script-in-sets), table, .comment,
 		#script-content > ul {
			padding: 1rem !important;
			margin: 0 auto !important;
			margin-bottom: 20px !important;
			border: var(--border-button) !important;
			box-shadow: var(--shadow-normal) !important;
			background-color: var(--color-tertiary) !important;
			color: var(--color-text);
			border-radius: .5rem;
		}
		.text-content > *:first-child {
			margin-top: 0 !important;
		}
		.text-content > *:last-child, #script-meta > *:last-child {
			margin-bottom: 0 !important;
		}
		
		
	@media only screen and (min-width: 940px) { 
		
		
		body {
			margin-top: 44px;
		}
		
		
		
		

		/* HEADER */
		#main-header {
			position: fixed;
			top: 0;
			width: 100%;
			height: 44px;
			padding: 0;
			z-index: 5;
			background-image: none;
			background-color: var(--color-primary);
			backdrop-filter: blur(10px);
		}
		#main-header > .width-constraint {
			max-width: 100%;
			padding-left: 10px;
			padding-right: 10px;
			display: flex !important;
			align-items: center;
			margin: auto !important;
		}
		#site-name {
			position: absolute;
			width: 200px;
			min-width: 200px;
			height: 30px;
			margin-top: auto;
			margin-bottom: auto;
			display: flex;
			white-sapce: nowrap;
			align-items: center;
			gap: 4px;
			z-index: 10;
		}
		#site-name img {
			height: 30px;
			width: 30px;
		}
		#site-name-text {
			margin-top: 0 !important;
		}
		#site-name-text > h1 {
			font-size: 24px;
			font-weight: 600;
			white-space: nowrap;
		}

		#site-nav {
			display: flex !important;
			height: 40px;
			padding-top: 1px;
			width: auto;
			align-items: center;
			margin-top: 0 !important;
			width: 100%;
			justify-content: flex-end;
		}
		#site-nav > * {
			position: relative !important;
		}
		#site-nav > nav {
			width: 100% !important;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
		#nav-user-info {
			width: auto;
			order: 2;
			height: 20px;
			display: flex;
			align-items: center;
		}
		#nav-user-info .sign-out-link, #nav-user-info .sign-in-link {
			width: max-content !important;
		}
		#nav-user-info > form > select {
			margin: 0 0 0 26px;
			height: 32px;
		}
		
		#site-nav > nav > li + li {
			margin-left: 1em;
		}
		#nav-user-info .user-profile-link a, #nav-user-info .sign-out-link a {
			text-decoration: none;
			font-size: 16px;
		}
		#nav-user-info .sign-out-link {
			font-size: 0;
			margin-left: 16px;
		}
		#nav-user-info .with-submenu {
			padding-right: 16px;
		}
		#nav-user-info a:hover {
			text-decoration: underline;
		}
		.with-submenu > nav {
			background-color: var(--color-primary);
			backdrop-filter: blur(10px);
		}
		
		/* SIDEBAR */
		.sidebar ~ div {
			max-width: 50rem;
		}
		.sidebar {
			position: sticky;
			top: 44px;
			order: -1;
			margin: -10px 15px -10px -10px;
			padding: 20px 0 20px 10px;
			height: calc(100vh - 84px);
			max-height: calc(100vh - 84px);
			overflow-y: auto;
			overflow-x: hidden;
			z-index: 6;
			text-decoration: none !important;
			
			scrollbar-color: var(--color-primary) transparent;
			scrollbar-width: thin;
		}
			.sidebar-search {
				position: fixed;
				top: 5px;
				left: 180px;
				
			}
				.sidebar-search input[type="search"] {
					height: 32px;
					border: none !important;
					border-radius: .3rem !important;
					width: 170px;
					text-align: center;
					color: var(--color-text) !important;
					padding-inline-end: 30px;
					box-shadow: 0px 0px 2px rgba(0,0,0,0.1) !important;
					background-color: var(--color-primary) !important;
					color: white !important;
					font-weight: 700;
					filter: opacity(.5);
					transition: width .2s, background-color .5s, color .5s, filter .2s; 
				}
				.sidebar-search input[type="search"]:focus, .sidebar-search input[type="search"]:hover {
					width: calc(100vw - 450px);
					transition: width .5s, background-color .2s, color .2s, filter .2s; 
					filter: opacity(1);
					background-color: var(--color-secondary) !important;
					color: var(--color-text) !important;
				}
				.sidebar-search input[type="submit"] {
					display: none;
				}
			#script-list-option-groups > div, .list-option-group {
				padding: 10px;
				color: var(--color-text);
				
				background-color: var(--color-secondary);
				border-radius: .3rem;
				box-shadow: 0px 0px 2px rgba(0,0,0,0.1);
			}
				#script-list-option-groups > div > ul, .list-option-group > ul {
					background-color: transparent;
					box-shadow: none;
					border: none;
					margin: -10px;
				}
				.list-current {
					border-left-color: var(--color-primary) !important;
					border-left-width: 4px !important;
				}
					
					
	
					
					
					
		/* LISTS */
		.sidebarred-main-content {
			margin-top: 10px !important;
		}
		.sidebarred-main-content > h2 {
			margin-top: 0;
		}
		#browse-script-list {
			margin-top: 0;
		}
		#browse-script-list, #user-script-list, #user-deleted-script-list, .script-list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
			grid-gap: 10px;
			border: none !important;
			box-shadow: none !important;
			background-color: transparent;
		}
		
		
	}
		
		
			#browse-script-list > li, #user-script-list > li, #user-deleted-script-list > li, #user-unlisted-script-list > li,
 			#user-library-script-list > li {
				border: var(--border-button) !important;
				border-radius: .5rem;
				background-color: var(--color-tertiary);
				transition: box-shadow .2s;
				color: var(--color-text);
				display: flex;
				&:hover {
					box-shadow: 0px 2px 20px rgba(0,0,0,0.1);
				}
			}
				#browse-script-list > li > article, #user-script-list > li > article, #user-deleted-script-list > li > article, #user-unlisted-script-list > li > article {
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					width: auto !important;
					flex-grow: 1 !important;
					max-width: 100% !important;
				}
					#browse-script-list > li > article > h2 {
						overflow: hidden;
						max-height: 100px;
					}
					.inline-script-stats {
						margin-top: auto;
						width: 100%;
					}
					.inline-script-stats dd {
						max-width: 100%;
					}
					#browse-script-list > li > article > h2 > a {
						font-weight: 600;
					}
					#browse-script-list > li > article > h2::before {
						content: "";
						display: flex;
						position: relative;
						z-index: 2;
						width: 100%;
						height: 40px;
						color: var(--color-tertiary);
						background: linear-gradient(transparent, currentColor);
						box-shadow: 0 10px 0 var(--color-tertiary);
						margin-top: -40px;
						transform: translateY(100px);
						pointer-events: none;
					}
					/* Greasy Fork Tweaks Thumbnail Images */
					#browse-script-list > li > article ~ div,
 					#user-script-list > li > article ~ div,
					#user-deleted-script-list > li > article ~ div {
						max-height: 185px !important;
						height: calc(100% + 2em) !important;
						width: auto !important;
						max-width: 40% !important;
						margin-right: -1em !important;
						margin-top: -1em !important;
						margin-bottom: -1em !important;
						margin-left: 1em !important;
						border-top-right-radius: .5rem !important;
						border-bottom-right-radius: .5rem !important;
						padding: 0 !important;
						transition: max-width .5s, width .5s;
						display: flex !important;
						transition: max-width .5s;
						justify-content: center;
					}
					#browse-script-list > li > article ~ div > img,
 					#user-script-list > li > article ~ div > img,
					#user-deleted-script-list > li > article ~ div > img {
						max-width: 100% !important;
						width: 100% !important;
						align-self: center;
					}
					#browse-script-list #script-list-ea {
						width: 100%;
					}
					#browse-script-list #script-list-ea + div:last-of-type {
						display: none !important;
						width: 0 !important;
					}
				
			.script-list li:not(.ad-entry) {
				border-right: 1px solid #DDDDDD;
			}
			.ad-entry, #codefund {
				grid-column: 1/-1;
			}
			.ad-entry > div {
				height: auto !important;
				padding: 0 !important;
			}
			[data-ea-publisher].loaded .ea-content a:link, [data-ea-type].loaded .ea-content a:link {
				color: var(--color-link) !important;
			}
			
			
		.sidebarred-main-content {
			display: flex;
			flex-wrap: wrap;
			height: min-content;
		}
		.sidebarred-main-content > * {
			width: 100%;
			
		}
		.sidebarred-main-content > p {
			width: auto;
			margin: 1em 0 0;
		}
		.sidebarred-main-content > p:last-child {
			order: -1;
		}
			
		/*** FILTER BY SITES PAGE ***/
		
		#by-site-list > li > a {
			font-size: inherit !important;
		}

		/*** SCRIPT DETAILS PAGE ***/
		
		#script-info {
			display: flex;
			flex-wrap: wrap;
			
			background: none !important;
		}
		#script-info > * {
			width: 100%;
		}
		#script-info, #additional-info, #user-profile {
			background: none;
			background-color: var(--color-tertiary);
			box-shadow: none;
			color: var(--color-text);
		}
		#script-info > header {
			order: -1;
			width: 100%;
		}
		#script-info header h2 {
			font-weight: 600;
		}
		#script-links {
			margin: 12px 0;
			padding-top: 12px !important;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			
			position: sticky;
			top: 45px;
			display: inline;
			width: 150px;
			height: min-content;
			max-height: calc(100vh - 58px);
			overflow-y: auto;
		}
		#script-links .current {
			border: none !important;
			box-shadow: none;
		}
		#script-links li {
			margin: 8px 0px;
		}
		.script-show-applies-to .inline-list {
			display: flex;
			flex-wrap: wrap;
		}
		#script-content {
			margin: 20px;
			width: calc(100% - 200px);
			display: flex;
			flex-wrap: wrap;
			height: min-content;
		}
		#script-content > * {
			width: 100%;
		}
		#script-show-info-ad {
			min-height: 0;
			overflow-y: auto;
			.ad-content {
				height: 0;
			}
		}
		#script-feedback-ad:has(#script-feedback-ea:empty) { // if ublock
			display: none;
		}
		.install-link {
			background-color: var(--color-highlighted) !important;
		}
		#script-feedback-suggestion, .script-in-sets, #install-area {
			margin: 0;
			width: auto !important;
			display: flex;
			flex-wrap: wrap;
			font-size: 0;
		}
		#script-feedback-suggestion a, .script-in-sets *, #install-area a,
 		.post-discussion > p:first-child a,
 		.sidebarred-main-content > p a {
			font-size: 14px;
			margin: 0;
			margin-right: 8px;
			margin-bottom: 1em;
		}
		.discussion-snippet {
			white-space: normal !important;
		}
		.script-in-sets {
			order: 1;
			width: 100% !important;
		}
		#script-meta {
			order: 2;
			max-width: none;
			flex: 1 1 600px;
		}
		#script-meta dt {
			max-width: none !important;
		}
		
		#script-show-info-ad {
			order: 3;
			margin-left: 1em !important;
			flex: 1 1 200px;
		}
		#additional-info {
			order: 3;
			display: flex;
			flex-wrap: wrap;
		}
		#additional-info > * {
			width: 100%;
		}
		.user-screenshots {
			order: -1;
			margin-top: 0 !important;
			margin-bottom: 1em;
			width: 100%;
		}
		.post-discussion {
			width: 100%;
		}
		
		section > *:first-child, #script-content > *:first-child, #script-content p, #script-content h3, form > p:first-of-type,
 		.discussion-header {
			margin-top: 0 !important;
		}
		.multiform-page {
			padding: 0 !important;
		}
		
		canvas {
			background-color: white !important;
		}
		
		/*** FORUMS ***/
		.discussion-read {
			background-color: var(--color-secondary) !important;
		}
		.discussion-list-item {
			border-top: var(--border-button) !important;
			border-bottom: var(--border-button) !important;
		}
		.user-content {
			background: none;
		}
		.comment-meta-item a {
			margin-bottom: -100px;
		}
		.discussion-header h2 {
			margin-top: .5rem;
		}
		
		/* FAVORITES LIST */
		.post-discussion > div:last-of-type {
			order: 5;
		}
			
		/*** USER PAGE ***/
		/* About User */
		
		a.report-link.report-link-abs {
			margin-top: 1em !important;
		}
		/* Control Panel */
		#user-control-panel, #script-content > ul {
			display: flex;
			flex-wrap: wrap;
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			grid-gap: 10px;
			padding: 10px;
			list-style: none;
		}
			#user-control-panel > li {
				text-decoration: none;
				list-style: none;
				text-align: center;
				background-color: var(--color-secondary);
				padding: 5px 16px;
				border-radius: .3rem;
			}
			
		.post-discussion > div > .inline-list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			grid-gap: 4px 6px;
		}
			.post-discussion > div > .inline-list > li a {
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		


		/*** HOMEPAGE ***/
		body .width-constraint > .text-content > h2 {
			z-index: 2;
			position: relative;
			margin-bottom: 1rem;
			margin-top: 2rem !important;
		}
		#home-script-nav {
			margin-bottom: 60px;
			z-index: 1;
			width: max-content;
			max-width: none;
			border: none !important;
		}
		
		#home-top-sites {
			margin-top: 1rem;
			z-index: 2;
			position: relative;
			font-size: 0;
		}

		/*** POPUPS ***/
		.lum-lightbox {
			z-index: 100;
		}


		
	}