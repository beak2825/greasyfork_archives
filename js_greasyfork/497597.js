// ==UserScript==
// @name NordNet
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A Nord themed style for nexus mods, a lot of tweaks, including one for easy access search filter. This is the first version, not all pages and sections have been modified yet, but the mostly used are. Hope you like it, and recommend any changes.
// @author TragicNet
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/497597/NordNet.user.js
// @updateURL https://update.greasyfork.org/scripts/497597/NordNet.meta.js
// ==/UserScript==

(function() {
let css = `/* domain("next.nexusmods.com"), */
domain("nexusmods.com") {
	/* Core */
	:root {
		--bg-0: #161a21;
		--bg-1: #1c2028;
		--fg-0: #eee;
		--fg-1: #d6d6d6;
		--ac-0: #a8afbd;
		--ac-1: #c5c9d3;
	}

	body {
		--bg-0: #161a21;
		--bg-1: #1c2028;
		--fg-0: #eee;
		--fg-1: #d6d6d6;
		--ac-0: #a8afbd;
		--ac-1: #c5c9d3;

		--bg-0t: #161a2180;

		--theme-primary: var(--ac-0) !important;
		--theme-primary-translucent: var(--ac-0) !important;
		--theme-secondary: var(--ac-0) !important;
		--theme-dark: var(--ac-0) !important;
		--sm-breakpoint: 481px;
		--md-breakpoint: 769px;
		--lg-breakpoint: 1200px;
		--xl-breakpoint: 1461px;
		--md-max-width: 990px;
		--lg-max-width: 1240px;
		--xl-max-width: 1300px;
		--rj-header-height: 40px;
		--rj-mobile-header-height: 40px;
		--rj-mobile-menu-section-height: 72px;
		--rj-header-tray-height: 250px;
		--rj-nexusblack: var(--bg-0) !important;
		--rj-nexusblack-light: var(--bg-1) !important;
		--rj-nexusblack-high-contrast: var(--bg-1) !important;
		--rj-border: var(--bg-1) !important;
		--rj-white-80: rgba(255, 255, 255, 0.8);
		--rj-white-60: rgba(255, 255, 255, 0.6);
		--rj-white-38: rgba(255, 255, 255, 0.38);
		--rj-white-32: rgba(255, 255, 255, 0.32);
		--rj-white-30: rgba(255, 255, 255, 0.3);
		--rj-white-16: rgba(255, 255, 255, 0.16);
		--rj-white-10: rgba(255, 255, 255, 0.10);
		--rj-white-08: rgba(255, 255, 255, 0.08);
		--rj-white-05: rgba(255, 255, 255, 0.05);
		--rj-gray-16: rgba(221, 221, 221, 0.16);
		--rj-black-60: rgba(0, 0, 0, 0.6);
		--rj-black-40: rgba(0, 0, 0, 0.4);
		--rj-black-16: rgba(0, 0, 0, 0.16);
		--rj-black-08: rgba(0, 0, 0, 0.08);
		--rj-orange-font: var(--ac-0) !important;
		--rj-orange-dark: var(--ac-0) !important;
		--rj-button-focus: rgba(128, 128, 128, 0.32);
		--rj-button-focus-border: #388ffa;
		--rj-button-focus-blur: #0673fa;
		--rj-standard-button-hover: var(--bg-1) !important;
		--rj-standard-button-focus: var(--bg-1) !important;
		--rj-secondary-button-bg: #ddd;
		--rj-secondary-button-hover: #aaa;
		--rj-secondary-button-focus: #bbb;
		--colour-surface-low: var(--bg-0) !important;
		--colour-surface-translucent-mid: var(--bg-0t) !important;


		--header-height: 40px;

		/* 		--bg-0: #ffe0e0;
	--fg-0: #ff7795;
	--fg-3: #ff7795; */
	}
	* {
		overscroll-behavior: none;
	}

	.notifications-header-left {
		color: var(--fg-1);
	}

	.theme-primary {
		fill: var(--ac-0) !important;
	}

	body {
		margin: 0;
		padding: 0;

		@media only screen and (min-width: 1240px) {
			margin: 0px !important;
		}
	}

	body::before {
		background: var(--bg-0);
	}

	input,
	select {
		background: var(--bg-1);
		color: var(--fg-0);
		outline: none;

		option {
			background: var(--bg-1) !important;
			color: var(--fg-0);
		}
	}

	.select2-dropdown,
	.select2-selection__rendered {
		background: var(--bg-0);
		color: var(--fg-0) !important;
		outline: none;
		border: none;

		input {
			border: none !important;
		}
	}


	.select2-selection__rendered {
		background: var(--bg-1);
	}

	header {
		box-shadow: none !important;
		background: var(--bg-0) !important;
		height: auto !important;
		padding: 0 1% !important;

		a {
/* 				height: 100% !important; */
		}

		.headlogo {
			height: auto !important;
			* {
				height: 100% !important;
			}
			path {
				fill: var(--ac-0);
			}
		}

		.rj-header-wrap {
			max-width: 100% !important;
			margin: 0 !important;
		}

		.rj-nav {
			height: var(--header-height);
		}
		
		.nav-current-game * {
			border-color: var(--bg-1) !important;
			background: var(--bg-0) !important;
		}

/* 			.rj-nav-item.rj-nav-game {
			padding-right: 24px;
			border-color: transparent;
		}

		.rj-nav-item:not(.rj-nav-game) {
			border-radius: 8px;
		} */

		.rj-nav-item:hover {
			background: none;
		}

		.rj-nav-item.active {
			background: var(--bg-1);
		}

		.game-home-link {
			top: 0;
			background: none !important;
			left: -32px;
			height: 100%;
		}

		.rj-header-tray,
		.rj-header-full-width-banner,
		.rj-mobile-menu-subsections,
		.rj-panel-inner {
			background: none !important;
		}

		.rj-header-tray {
			a:hover {
				background: var(--bg-1);
			}
		}

		.user-profile-menu-section--link .section-content:hover {
			background: var(--bg-1);
		}

		.notifications-clear {
			color: var(--ac-0) !important;
		}

		.rj-notifications-tray .arrow {
			right: 50px;
		}

		.rj-right-tray,
		.rj-profile-tray-content {
			background: var(--bg-0);

			div,
			li,
			a {
				background: none !important;
			}

			li:hover {
				background: var(--bg-1) !important;
			}
		}

		.rj-search {
			* {
				color: color: var(--fg-0);
			}
			outline: none !important;
			margin: 0;

			.rj-search-input {
				max-width: 100% !important;
				background: var(--bg-1);
				color: var(--fg-0);
				outline: none;
				border: none;
			}


			.rj-search-category-wrapper {
				right: 0;
				border: none;

				.rj-search-category-dropdown-toggle {
					background: var(--bg-1);
					color: var(--fg-0);
				}

				.rj-search-category-dropdown-toggle:hover {
					background: var(--bg-1);
				}

				.rj-search-category-dropdown {
					background: var(--bg-0);

					li:hover {
						background: var(--bg-1);
					}
				}
			}

			.search-button {
				display: none !important;
			}

			#gsearch_results {
				/* 				display: block !important; */
				width: 100%;
				max-width: unset;
				background: var(--bg-0);

				.gsearch_results_list h2,
				div {
					background: none;
				}
			}
		}

		.ni-background {
			display: none;
		}
	}

	.rj-header-wrap.rj-active-game:not(.rj-search-active) .rj-search {
		/* 		margin-left: 56px; */
	}

	#maintenance_banner {
		position: fixed;
		top: 40px;
		left: 0px;
		width: 100%;
		z-index: 12;
	}
	
	body.mods #maintenance_banner {
		top: 80px;
	}
	

	li {
		border-color: var(--bg-1) !important;
	}

	ul.tags li a.btn,
	ul.tags li a.btn:visited {
		color: var(--ac-0);
		background-color: var(--bg-1) !important;

		svg {
			fill: var(--ac-0);
		}
	}

	.rj-btn-outline {
		border-color: var(--ac-0) !important;
	}

	.btn {
		border-radius: 8px;
		/* 		border-radius: 20px; */
	}

	.pip,
	.btn:not(.btn-inactive) {
		background: var(--ac-0);
		/* 		off blue highlight important */
	}

	.btn-inactive {
		background: var(--bg-1) !important;
	}

	#mainContent {
		max-width: 100%;
		width: 100%;
		margin: 0;
		margin-top: var(--header-height);
		padding: 0;
		padding-bottom: 20px;
		
		#featured h1 {
			margin: 0px;
		}

		#feature::before {
			background: var(--bg-0);
		}

		#nofeature {
			background: var(--bg-0) !important;
			#pagetitle {
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, var(--bg-0) 100%) !important;
			}
		}

		#feature .gradient {
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, var(--bg-0) 100%);
		}

		.collections-banner-outer-wrapper-trigger,
		.collections-banner-wrapper {
			display: none;
		}
		.collections-banner {
			background: var(--bg-1);
		}


		ul.modtabs {
			background: var(--bg-0);

			li {
				background: var(--bg-0);

				a {
					border: 0;
					padding: 13px 10px;
					height: 36px;
					min-width: 100px;
				}
			}

			li a.selected,
			li a:hover {
				background: var(--bg-1);
			}
		}

		.gameindex > .wrap {
			background: var(--bg-0);

			#game-mods {
				background: var(--bg-0);
			}

			.tabs {

				.tabcontent {
					background: var(--bg-0);

					a.mod-image {
						background: var(--bg-0);
					}

					.mod-tile {

						.mod-tile-left {
							background: var(--bg-1) !important;
							overflow: hidden;



							.tile-data {
								background-color: var(--bg-1);

								ul {
									display: flex;
									flex-direction: row;
									justify-content: space-between;
								}
							}
						}
					}
				}
			}
		}

		.resultpage {
			margin-top: var(--header-height);
		}

		.resultpage .wrap:first-of-type {
			background: var(--bg-0);

			.tabcontent #mod-list {
				padding: 0;
				background: var(--bg-0);

				.search-terms {
					margin-top: 10px;

					li {
						color: var(--ac-0);
						background-color: var(--bg-1);
						border-radius: 8px;
					}
				}

				.pagenav {
					.pagination li a {
						background-color: var(--bg-0);
						color: var(--fg-0);
					}

					.pagination li a.page-selected {
						background-color: var(--bg-1);
					}

					svg {
						fill: var(--fg-0);
					}
				}

				ul[class="tiles"],
				ul[class="tiles "],
				ul[class="tiles big-tiles"] {

					display: grid;
					grid-template-columns: repeat(5, 1fr);

					a.mod-image {
						background: var(--bg-0);
					}

					.mod-tile {
						width: 100%;

						.mod-tile-left {
							background: var(--bg-1) !important;
							overflow: hidden;
							.mod-image {
								/* 								position: absolute; */
								/* 							top: 0;
						left: 0; */
								/* 									:hover {
									z-index: 3;
								} */
							}

							.tile-desc {
								background: var(--bg-0t);
								backdrop-filter: blur(20px);
								/* 															top: 100px; */
								/* 								top: 145px; */
								/* 								min-height: 360px;
							max-height: 360px; */
							}

							.tile-data {
								/* 								position: absolute; */
								background-color: var(--bg-1);
								/* 								z-index: 2; */
								bottom: 0;
								/* 								width: 100%; */
								ul {
									display: flex;
									flex-direction: row;
									justify-content: space-between;
								}
							}
						}
					}
				}

				ul[class="tiles tile-list"] {
					display: grid;
					grid-template-columns: repeat(2, 1fr);

					.mod-tile-right {
						background: var(--bg-1);
						overflow: hidden;

						.tile-desc {
							min-height: 100%;
							max-height: 100%;
						}
					}

					.tile-data {
						background-color: var(--bg-1);

						ul {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
						}
					}
				}

				ul[class="tiles big-tiles"] {
					grid-template-columns: repeat(3, 1fr);
				}
			}
		}
	}

	.modpage .wrap:first-of-type {
		background: var(--bg-0);

		.modimages {
			background: var(--bg-0);
		}

		.wrap > div {
			background: var(--bg-0);

			#fileinfo {
				padding-top: 0;
				padding-bottom: 0;
				border: 0;

				.sideitem:last-child {
					.result {
						top: 0 !important;
					}
				}
			}

			.side-tags {
				display: inline-flex;
				padding: 5px 15px 15px 15px;
				border: 0;
				align-items: center;
				width: 100%;

				h2 {
					visibility: hidden;
					white-space: nowrap;
					float: left;
					width: 0;
					margin: 0 40px 0 10px;
				}

				h2::after {
					position: absolute;
					left: 20px;
					visibility: visible;
					content: 'Tags';
				}


				ul.tags li {
					margin: 0 10px 0 0;
				}
				a.btnsmall {
					margin: 0px 10px 0px 0px !important;
				}

				a.btn.btnsmall.popup-btn-ajax {
					font-size: 0;
					line-height: 25px;
					height: 25px;
				}

				.sideitem {
					display: inline-flex;
					flex-wrap: wrap;
					flex-direction: row;
					padding: 0;
					align-items: center;
				}
			}


			.tabs {

				.tabcontent {
					background: var(--bg-0);

					.tab-description {
						display: grid !important;
						/* 							grid-column-gap: 20px; */
						grid-template-columns: 50% 40% 1fr;
						grid-template-rows: 37px 1fr;
						grid-template-areas: "header history history" "body accordion accordion" "body buttons1 buttons2";
						padding: 20px;
						/* 							width: calc(100% - 40px); */
						/* 							background: #101010; */
						> h2 {
							grid-area: header;
							margin-top: 2px;
							padding: 0;
						}
						.modhistory.inline-flex {
							grid-area: history;
							align-items: center;
							align-self: end;
							margin-bottom: -2px;
						}
						.modhistory.inline-flex .icon-tickunsafe {
							width: 16px;
							height: 16px;
						}
						> p {
							grid-area: body;
							margin-top: 15px;
							text-align: left;
						}
						.accordionitems {
							grid-area: accordion;
							max-width: 100%;
							margin: 15px 0 20px 0;
							overflow-wrap: anywhere;
						}
						ul.actions {
							grid-area: buttons1;
							align-self: auto;
							justify-self: start;
							margin-right: 0;
						}
						.btn.inline-flex {
							grid-area: buttons2;
							align-self: end;
							justify-self: end;
							left: 10px !important;
						}
						ul.actions li {
							margin-bottom: 5px;
						}
					}

					.mod_description_container {
						padding: 20px;
					}

					.accordion {
						dt {
							background: var(--bg-0) !important;
						}

						dd {
							background: var(--bg-1) !important;
						}

						.tabbed-block .table {
							th {
								border: 0;
								background: var(--bg-0);
							}

							td {
								border: 0;
								background: var(--bg-1);
							}
						}
					}
					.comments {
						.comment-nav {
							.pagination li a {
								background-color: var(--bg-0);
								color: var(--fg-0);
							}

							.pagination li a.page-selected {
								background-color: var(--bg-1);
							}
						}

						.comment {
							background: var(--bg-0);
							border-color: var(--bg-1);
						}

						.comment-head,
						.comment-kids {
							background: var(--bg-0);
							border: 0;
						}

						.comment-content {
							background: var(--bg-1);
						}
					}
				}
			}
		}
	}

	.tile-desc .fadeoff {
		display: none;
	}

	#rj-back-to-top {
		background-color: var(--ac-0) !important;
		position: fixed !important;
		z-index: 9;
		left: 20px;
		bottom: 20px !important;
		width: 24px;
		height: 24px;
	}

	/* Hide Elements */
	.premium-block--upgrade,
	.premium-banner,
	.section,
	.ads,
	footer,
	#nonPremiumBanner {
		display: none !important;
	}

	/* 		div[class="clearfix"]:not([id]) {
		display: none;
	} */
	.mfp-wrap {
		/* 			position: absolute; */
		/* 			top: 0px !important; */
		.popup-mod-tagging {
			background: var(--bg-0);

			div:first-child {
				background: none !important;
			}

			.vote-tag-section {
				background: none !important;
			}
		}

		.popup-mod-requirements {
			background: var(--bg-0);

			ul {
				background: none;
				border: 0;
			}
		}
	}

	/* PORTED FROM DARKENED */
}

@-moz-document domain("nexusmods.com") {
	/* Filter Section */
	.lg-toolbar {
		background-color: rgba(0, 0, 0, .5);
		background-color: var(--bg-0t);
		/* 		backdrop-filter: blur(2px); */
	}

	#acc-advanced-collection {

		dt {
			background-color: var(--bg-0);
			position: fixed;
			z-index: 99;
			left: 0;
			top: 40px;
			width: 100vw;
		}

		dd.open {
			position: fixed;
			z-index: 99;
			left: 0;
			top: 80px;
			width: 100vw;
			height: calc(100vh - 80px);
			overflow-y: scroll;
			background-color: var(--bg-0);
			backdrop-filter: blur(10px);

			div {
				border: none;
				padding-top: 2px;
				padding-bottom: 1px;
				max-height: calc(100vh - 220px);
			}

			ul.choice-list,
			.range-area {
				background-color: var(--bg-1);
			}

			.selection :first-child {
				background-color: var(--bg-1);
				color: var(--fg-0);
			}
		}
	}
}

@-moz-document domain("next.nexusmods.com") {
	header,
	header > div {
		background: var(--bg-0) !important;
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
