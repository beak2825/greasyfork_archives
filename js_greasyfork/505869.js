// ==UserScript==

// @name 			Expandify Twitter Media
// @version			4.9.1a

// @description 	Uncrops and expands Twitter image previews to their original ratios while browsing. View media pages in full-width and uncover rounded edges for a better viewing experience. Written in SCSS.
// @author			Neuvalence, JayeVisual.com


// @match 			https://*.twitter.com/*
// @match 			https://*.x.com/*
// @grant  			GM_addStyle
// @license         MIT
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	 		https://code.jquery.com/ui/1.13.3/jquery-ui.js
// @icon         	https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/292px-Logo_of_Twitter.svg.png

// @namespace https://greasyfork.org/users/1275871
// @downloadURL https://update.greasyfork.org/scripts/505869/Expandify%20Twitter%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/505869/Expandify%20Twitter%20Media.meta.js
// ==/UserScript==


(function () {
	'use strict';
	function onElementAvailable(selector, callback) {
		const observer = new MutationObserver(mutations =>  {
			if (document.querySelector(selector)) {
				observer.disconnect();
				callback();
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	const rafraichir = 2000;
	setInterval(() => {
		const ogTwt__Header = document.querySelector("header");
		let ogTwt__HeaderSubArea = document.querySelector("header > div:nth-child(1) > div:nth-child(1)");
		ogTwt__Header.id = "ogTwt__Header";
		ogTwt__HeaderSubArea.id = "ogTwt__HeaderSubArea";
		$(ogTwt__Header).append(ogTwt__HeaderSubArea);
	}, rafraichir);

	(function () {
		let css = `
	header {
		overflow: hidden !important;
		height: 100vh !important;
		max-height: 100vh !important;
		display: block !important;
			.r-pt392 {
				margin-left: unset !important;
			}
			#ogTwt__HeaderSubArea {
				width: unset !important;
				transform: scale(0.9) !important;
				max-width: unset !important;
				min-width: unset !important;
			}
	}
	header *, header,
	header::-webkit-scrollbar,
	header *::-webkit-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	main {
		width: 100% !important;
		max-width: 100% !important;
		display: block !important;
		position: relative !important;

		& > div:nth-child(1),
		& > div > div:nth-child(1),
		& > div > div > div:nth-child(1) {
			width: 100% !important;
			max-width: 100% !important;
			display: block !important;
			position: relative !important;
		}
	}

	article *,
	article [aria-label] img,
	article [aria-label] div *,
	article [aria-label] *,
	[data-testid='tweet'] * {
		border: unset !important;
		border-radius: unset !important;
		clip-path: unset !important;
		border-style: none !important;
	}
		[data-testid="cellInnerDiv"] * {
			border: none;
		}
		article {
			border: #ffffff11 0.3px solid !important;
			border-radius: 3px !important;
		}
		article [aria-label] img {
			border-radius: 2px !important;
		}
		[data-testid='Tweet-User-Avatar'] a * {
			border-radius: 10rem !important;
		}



	main > div:nth-child(1),
	main > div:nth-child(1) > div:nth-child(1),
	main > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)
	{
		width: 100% !important;
		max-width: 100% !important;

	}

		main div[data-testid*='primary'] > div > div:nth-child(3) > div > div > div:nth-child(1),
		main div[data-testid*='primary'] > div > div:nth-child(3) > div > div > nav,
		main div[data-testid*='primary'] section
		{
			width: 100% !important;
			max-width: 875px !important;
			margin: 0 auto !important;
			margin-left: 10vw !important;

		}
		main div[data-testid*='primary'] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1),
		main div[data-testid*='primary'] > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) nav {
			max-width: calc(100% - 350px) !important;
		}

			main div[data-testid*='primary'],
			main div[data-testid*='primary'] > div,
			main div[data-testid*='primary'] > div > div, /* all 3 */

				main div[data-testid*='primary'] .r-1ye8kvj,
				main div[data-testid*='primary'] > div > div,
				main div[data-testid*='primary'] > div > div > div,
				main div[data-testid*='primary'] > div > div > div > div,
				main div[data-testid*='primary'] > div > div > div > .r-1ye8kvj,  /* troisième */
				main div[data-testid*='primary'] > div > div > div > div > .r-1ye8kvj,  /* troisième avc sous-mâitre */
				main:has(a[href*="/media"]) div[data-testid*='primary']:has(div[data-testid*="ScrollSnap-List"] > div:last-child > a[aria-selected*="true"]) section
					{
						width: 100% !important;
						max-width: 100% !important;
			}
				main div[data-testid*='primary'] section:has([id*='verticalGridItem']),
				main div[data-testid*='primary']:has([id*='verticalGridItem'])
					{
						width: 100% !important;
						min-width: 100% !important;
						max-width: 100% !important;
						margin: 0 auto !important;
						margin-right: 0% !important;
				}


	main div[data-testid*='primary'] li img {
		inset: unset !important;
		opacity: 1 !important;
		border-radius: 2px !important;
		position: relative !important;
		left: unset !important;
		top: unset !important;
		width: 100% !important;
		height: auto !important;
		object-fit: contain !important;
		min-height: auto !important;
		max-height: 100% !important;
		max-width: 100% !important;
	}

		div[data-testid*='primary'] [data-testid="tweetPhoto"] > img,
		div[data-testid*='primary'] [aria-label] > img {
			width: auto !important;
			height: 100% !important;
			background: none !important;
			position: relative !important;
			z-index: 1 !important;
			inset: unset !important;
			opacity: 1 !important;
			object-fit: contain !important;
		}
			div[data-testid*='primary'] li a > div > div:nth-child(2) > div > div:nth-child(1),
			div[data-testid*='primary'] [aria-label]:has(> img) > div:nth-child(1),
			div[data-testid*='primary'] [data-testid="tweetPhoto"]:has(> img) > div:nth-child(1) {
				background: none !important;
				display: none !important;
				visibility: hidden !important;
			}
			[data-testid="tweetText"] span {
				font-size: 1.2rem !important;
				line-height: 1.1 !important;
			}


	div[data-testid*='sidebar'] {
		position: absolute !important;
		right: 2rem !important;
		top: 0 !important;
		height: 80px !important;
		z-index: 9000;
		margin: 0 !important;

		padding: 5px !important;
		background-color: unset !important;

			div[aria-label] > div:nth-child(1) > div:nth-child(1) {
				margin-top: 5px !important;
			}
			& > div > div:nth-child(2) {
				padding: 10px;
			}
			& > div > div:nth-child(2) > div > div > div > div {
				display: none;
			}
			& > div > div:nth-child(2) > div > div > div > div:nth-child(1) {
				display: block !important;
			}
			& > div > div:nth-child(2) > div > div > div > div:nth-child(1) {
				background: none !important;
			}
			&:hover {
				height: 100% !important;

				div[aria-label],
				div:nth-child(1) > div,
				div:nth-child(1) > div > div,
				div > div:nth-child(2) > div > div > div > div:nth-child(1) {
					background-color: #000000 !important;
					border-radius: 20px;
				}
				& > div > div:nth-child(2) > div > div > div > div {
					display: block !important;
				}
			}

		}


`;
		if (typeof GM_addStyle !== "undefined") {
			GM_addStyle(css);
			} else {
				let styleNode = document.createElement("style");
				styleNode.appendChild(document.createTextNode(css));
				(document.querySelector("head") || document.documentElement).appendChild(styleNode);
		}
	})(); /* End CSS*/



})(); /* End ALL */
