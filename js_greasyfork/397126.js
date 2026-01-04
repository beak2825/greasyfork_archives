// ==UserScript==
// @name         Iwara UI Fix
// @namespace    none
// @version      1.11
// @description  An alternate style for 天音's Iwara 1-Click Filter script, also works as a standalone
// @author       Nothson
// @license      CC BY-NC
// @resource     https://creativecommons.org/licenses/by-nc/4.0/
// @match        https://*.iwara.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397126/Iwara%20UI%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/397126/Iwara%20UI%20Fix.meta.js
// ==/UserScript==

/*
	--- Iwara UI Fix by Nothson : https://iwara.tv/users/Nothson ---

		Mainly for scratching the Iwara's UI/UX itches I have.
		I'm not a senior web dev so plz don't scold me if the code below looks messy to you.

		21 Jul 2020

		- Added fullscreen fit mode button in the video player
			- The button only appears in fullscreen, as a square icon on the bottom right
			- Alternate fit mode fits the video by minimum dimension, good for some videos wider than your screen
			- Do note that this mode doesn't work well with videos with black paddings.
		- Various video player adjustments
			- +20% UI size
			- Loop button size & reordering some buttons
			- Font for floating time texts
			- Colored active toggle buttons (for clarity)
		- Known issue: After loading the page, if you play the video too quickly, the video player isn't properly modified. I'll look into that later.

		19 Jul 2020

		- Fixed video height in fullscreen

		21 Apr 2020

		- Added drop shadow under the profile picture borders
		- Fixed video player size for vertical videos, it should look better in landscape screen/view like desktop monitor
		- Now also clears 1-Click Filter's transparency on hover

		25 Mar 2020

		- Changed external player flair detection (thanks once again, Erono!)
		- Now, the accept/reject all friend requests button should actually work. I just lacked test subjects back then.

		10 Mar 2020

		- On hover, 1-Click Filter's thumbnail background colors are now cleared to white
		- Fixed page number spacing and responsive scaling in forums and forum posts
		- Updated 1-Click Filter style conflict detection

		8 Mar 2020

		- Improved page number styles
		- Added accept/reject all friend requests in friends page (with confirmation dialog)
			- The buttons only appear if there are more than 1 pending request in the page

		4 Mar 2020

		- In the cards (video/image page or sidebar), improved view count and likes formatting (k and M prefix, decimals)

		3 Mar 2020

		- Changed the approach to replace the blank images, there were some corner cases that make errors
		- Added profile picture border for special roles (profile page only) + unique animated border for my own
		- Added script version number at the bottom of the page

		2 Mar 2020

		- Now, this script has conflicts with Iwara 1-Click Filter version 1.6 and newer
			- See the note at the bottom of any Iwara page for the workaround

		1 Mar 2020

		- Added like percentage
		- Polaroid print style for video/image cards
		- Repositioned the card stats & icons
		- Added flairs, shown on the right of the card stats
			- Fire Icon: % like reaches the threshold (based on view count) + 200 views or more
			- Star Icon: % like reaches the threshold + 20k views or more
			- Lock Icon: Private video
			- Grid Icon: Multiple images
			- Screen Icon: External player (YouTube, Vimeo, etc.)
		- Card transitions on hover + extra transitions for some flairs
		- Added block backgrounds on many regions + made paddings and margins consistent
		- Fixed video player seek head
		- Changed forum post timestamp text color
		- Fixed user profile background, user lists (following/followers), and layout
		- Perhaps a few more things I did but couldn't remember, idk

		Expected to run after Erono's Iwara 1-Click Filter Script: https://greasyfork.org/scripts/393957
		However, this script works as a standalone UI fix as well
		Tested on the latest version of Firefox & Chrome, plus responsive
*/

window.addEventListener('load', async function() {
	if (!window.location.href.match('://i.iwara.tv')) {
		let oneClickFilterConflict = document.head.querySelector('#css_custom') || document.head.querySelector('#css_likes') || document.head.querySelector('#css_colors');

		let baseCSS = document.createElement('style');	// Add original CSS rules from 1-Click Filter
		baseCSS.innerHTML = `
			/* fix page */
			body {background-color: #eee;}
			section#content > .container {background-color: #eee; padding: 10px;}
			.container {width: unset;}
			@media (min-width: 1300px) {.container {width: 1300px;}}

			/* fix overflow */
			#block-system-main, .row {margin-left: 0; margin-right: 0;}
			.col-sm-3, .col-sm-6, .col-sm-9, .col-xs-6, .col-sm-12 {padding-left: 0; padding-right: 0;}
			.view-videos .view-content .views-row, .view-images .view-content .views-row {padding-bottom: 0px;}

			/* compact page */
			.view-content .col-sm-3, .view-content .col-sm-6 {width: 50%; float: left;}
			@media (min-width: 768px) {
			.view-content .col-sm-3 {width: 25%;}
			}

			/* card style */
			.node.node-teaser {background-color: #ffffff; border: 1px solid #ccc; border-radius: 4px; padding: 5px; margin: 4px;}
			.node.node-teaser .icon-bg, .node.node-teaser .private-video {width: calc(100% - 10px);}
			.node.node-teaser .icon-bg .likes-icon {filter: drop-shadow(0px 0px 2px #000);}
			.node.node-teaser h3.title {font-size: 1em; line-height: 1em; height: 3em; margin-bottom: 0px; overflow: hidden;}
			.node.node-teaser .username {display: block; white-space: nowrap; overflow: hidden;}
			.node.node-teaser .field-item {min-height: 2em;}
			.node.node-video .content {margin: 4px;}
			.sidebar .block.block-views,
			.sidebar .block.block-facetapi,
			.sidebar .block.block-mainblocks   {background-color: #fafafa; border: 1px solid #ccc; border-radius: 4px; padding: 8px; margin: 4px 4px 8px 4px;}
			.sidebar .node.node-sidebar_teaser {background-color: #ffffff; border: 1px solid #ccc; border-radius: 2px; padding: 4px; margin: 2px;}
			.sidebar .node.node-sidebar_teaser .icon-bg, .node.node-sidebar_teaser .private-video {width: calc(100% - 8px);}
			.sidebar .node.node-sidebar_teaser .icon-bg .likes-icon {filter: drop-shadow(0px 0px 2px #000);}
			.item-list ul.pager li {margin: 0; padding: 0;}
			.item-list ul.pager li.pager-current,
			.item-list ul.pager li.pager-ellipsis,
			.item-list ul.pager li > a {background: #fafafa; border: 1px solid #ccc; border-radius: 8px; padding: 4px 16px; margin: 0px; display: inline-block;}

			/* video style for external link (youtube) */
			/*
			.node.node-teaser .field-type-video-embed-field {border: 4px solid #c33; background-color: #000;}
			.node.node-teaser .field-type-video-embed-field .field-items {overflow: hidden;}
			.node.node-teaser .field-type-video-embed-field .field-items .field-item {margin: -4px;}
			*/

			/* image style in subscriptions page */
			.view-subscriptions .field-type-image {border: 1px solid #ccc; background-color: #fff; padding: 5px;}
			.view-subscriptions .field-type-image .field-items {overflow: hidden;}
			.view-subscriptions .field-type-image .field-items .field-item {margin: -6px;}

			/* search and playist */
			.node-wide_teaser {background-color: #fafafa; border: 1px solid #ccc; border-radius: 4px; padding: 4px; margin: 4px;}
			.node-wide_teaser {width: unset; word-break: break-all; min-height: 170px;}
			.node-wide_teaser .col-sm-2 {width: 230px; padding: 4px;}
			.node-wide_teaser .col-sm-10 {width: calc(100% - 230px); padding: 4px;}
			.node-wide_teaser .field-name-field-video {border: 1px solid #999;}
			.node-wide_teaser .field-name-field-video-url {border: 1px solid #999; position: absolute; top: 0px; left: -230px; margin: 4px;}
			@media (max-width: 768px) {.node-wide_teaser .field-name-field-video-url {display: none;}}
			.node-wide_teaser .field-name-field-images .field-item {display: unset;}
			.node-wide_teaser .field-name-field-images .field-item > a > img {width: calc(100%/3 - 8px); border: 1px solid #aaa; padding: 4px; margin: 4px;}
			.node-wide_teaser .field-name-field-images .field-item > video {width: calc(100%/1 - 8px); margin: 4px; border: 1px solid #aaa; padding: 4px; height: auto;}
			.node-wide_teaser .node-info {padding: 4px;}
			.node-wide_teaser .node-info .submitted {display: inline-block; width: 100%;}
			.node-wide_teaser .node-info .submitted h1.title {font-size: 28px; position: unset; margin: unset;}
			ul.facetapi-facetapi-tagcloud li > a {white-space: normal;}
			ul.facetapi-facetapi-tagcloud .element-invisible {display: none;}

			/* footer */
			#wrapper {margin-bottom: unset; padding-bottom: unset;}
			footer {height: unset;}
			footer .block {width: 25%; float: left;}
			footer .block.block-forum {width: 50%;}
			footer .copyright {float: unset;}

			/* video player */
			/* expand volume and seekbar height */
			.video-js .vjs-volume-bar {margin: 1em 0em;}
			.video-js .vjs-volume-bar.vjs-slider-horizontal, .video-js .vjs-volume-bar.vjs-slider-horizontal .vjs-volume-level {height: 1em;}
			.video-js .vjs-progress-holder, .video-js .vjs-progress-holder .vjs-load-progress, .video-js .vjs-progress-holder .vjs-play-progress {height: 0.7em;}
		`;
		baseCSS.id = 'xtension-base-css';
		document.head.appendChild(baseCSS);

		let cards = document.querySelectorAll('.node-teaser, .node-sidebar_teaser');
		let styleOverride = document.createElement('style');
		styleOverride.id = 'xtension-css';

		function logn (val, base) {
			return Math.log(val) / Math.log(base);
		}

		function kilo2Number (text) {
			if (text.match('k') == null) {
				return {value: parseInt(text), isKilo: false};
			}
			else {
				return {value: parseFloat(text.replace('k', '')) * 1000, isKilo: true};
			}
		}

		function number2Prefixed(value) {
			if (value < 999) {
				return value;
			}
			else if (value < 99999) {
				return (value / 1000).toFixed(1) + 'k';
			}
			else if (value < 999999) {
				return Math.floor(value / 1000) + 'k';
			}
			else {
				return (value / 1000000).toFixed(1) + 'M';
			}
		}

		function getFlair (viewCount, likePercentage, card) {
			if (card.querySelector('.private-video')) {
				return 'lock';
			}
			else if (card.querySelector('.field-type-video-embed-field')) {
				return 'share';
			}
			else {
				let likeThreshold = 8 - logn(viewCount, 6);
				if (viewCount < 200) {
					return '';
				}
				else if (viewCount < 20000) {
					return (likePercentage > likeThreshold) ? 'fire' : '';
				}
				else {
					return (likePercentage > likeThreshold) ? 'star' : '';
				}
			}
		}

		// HTML Mod
		cards.forEach(card => {
			let icons = card.querySelector('.icon-bg');
			if (icons) {	// Rearrange stat icons, add like percentage and flairs
				if ((card.className.match('node-sidebar_teaser') && card.children.length > 1) || card.children.length > 3) {
					card.insertBefore(icons, card.children[2]);
				}
				else {
					card.insertBefore(icons, card.children[1]);
				}
				if (card.className.match('node-image') && icons.children.length == 3) {
						icons.appendChild(icons.children[1]);
						icons.appendChild(icons.children[0]);
				}
				else if (icons.children.length == 2) {
					icons.appendChild(icons.children[0]);
				}

				let likeNode = icons.querySelector('.glyphicon-heart');
				if (likeNode && !(card.className.match('node-image') && card.className.match('node-sidebar_teaser'))) {
					likeNode = likeNode.nextSibling;
					let viewNode = icons.querySelector('.glyphicon-eye-open').nextSibling;
					let viewNodeTxt = viewNode.wholeText.trim();
					let likeNodeTxt = likeNode.wholeText.trim();
					let like = kilo2Number(likeNodeTxt);
					let viewCount = kilo2Number(viewNodeTxt);
					let likePercentage = (viewCount == 0) ? 0 : parseFloat(like.value / viewCount.value * 100).toFixed(2);
					viewNode.parentElement.setAttribute('title', viewNodeTxt);
					viewNode.nodeValue = ' ' + number2Prefixed(viewCount.value);
					if (likeNode) {
						likeNode.parentElement.setAttribute('title', likeNodeTxt);
						likeNode.nodeValue = ' ' + number2Prefixed(like.value);
					}
					if (!card.className.match('node-sidebar_teaser')) {
						let likePercentageHTML = document.createElement('div');
						likePercentageHTML.className += 'right-icon likes-icon like-percentage';
						if (like.isKilo || viewCount.isKilo) {
							likePercentageHTML.innerText = '(~' + likePercentage + '%)';
						}
						else {
							likePercentageHTML.innerText = '(' + likePercentage + '%)';
						}
						likeNode.parentElement.parentElement.appendChild(likePercentageHTML);
					}
					if (card.className.match('node-video')) {
						let flair = getFlair(viewCount.value, likePercentage, card);
						if (flair) {
							card.className += ' flair-' + flair;
							let flairNode = document.createElement('div');
							flairNode.setAttribute('class', 'left-icon flair-icon');
							flairNode.innerHTML = '<i class="glyphicon glyphicon-' + flair + '" title="Flair"></i>';
							icons.appendChild(flairNode);
						}
					}
				}
			}
			else {
				let blankFooter = document.createElement('div');
				blankFooter.setAttribute('class', 'icon-bg');
				card.appendChild(blankFooter);
			}

			let thumbnail = card.querySelector('a > img');
			if (!thumbnail) {	// Fix inconsistent height of the cards with no thumbnail
				let imgArea = card.firstElementChild;
				let title = card.querySelector('h3.title > a');
				if (!title) {
					title = card.querySelector('.field-item > a');
				}
				let url = (title) ? title.getAttribute('href') : '';
				imgArea.innerHTML = '<div class="field blankimg"><div class="field-items"><div class="field-item"><a' +
					(url ? ' href="' + url + '"' : '') +
					(title ? ' title="' + title.innerText + '"' : '') +
					'>' + 
					(card.className.match('node-sidebar_teaser') ? '<img width="141" height="84"></img>' : '<img width="220" height="150"></img>') +
					'</a></div></div></div>';
			}
		});

		let contentInfo = document.querySelector('body.node-type-video .node.node-video .node-info .node-views, body.node-type-image .node.node-image .node-info .node-views');
		if (contentInfo) {	// Add like percentage for a video/image page
			let heartIcon = contentInfo.querySelector('.glyphicon.glyphicon-heart');
			if (heartIcon) {
				let eyeIcon = contentInfo.querySelector('.glyphicon.glyphicon-eye-open');
				let viewCount = parseInt(eyeIcon.nextSibling.nodeValue.replace(/,/g, ''));
				let like = parseInt(heartIcon.nextSibling.nodeValue.replace(/,/g, ''));
				let likePercentage = (viewCount == 0) ? 0 : parseFloat(like / viewCount * 100).toFixed(4);
				heartIcon.nextSibling.nodeValue = ' ' + like + ' (' + likePercentage + '%)';
				contentInfo.appendChild(contentInfo.querySelector('.glyphicon.glyphicon-heart'));
				contentInfo.appendChild(contentInfo.querySelector('.glyphicon.glyphicon-eye-open').previousSibling);
			}
		}

		let copyrightNode = document.querySelector('footer .copyright');
		if (copyrightNode) {	// Add script credits
			let innerHTMLExt = '<br><u><b><a href="https://greasyfork.org/en/scripts/397126">Iwara UI Fix</a></b></u> version ' + GM_info.script.version + ' by <u><b><a href="/users/nothson">Nothson</a></b></u><br><b>Note:</b> <u><b><a href="/images/iwara-1-click-filter">Iwara 1-Click Filter</a></b></u>\'s <b>User Style</b> and/or <b>Like Colors</b> are enabled. Disable them in the in-page settings, then refresh to prevent style conflict.';
			if (!oneClickFilterConflict) {
				innerHTMLExt = '<br><u><b><a href="https://greasyfork.org/en/scripts/397126">Iwara UI Fix</a></b></u> version ' + GM_info.script.version + ' by <u><b><a href="/users/nothson">Nothson</a></b></u><br><i>Based on CSS rules from <u><b><a href="/images/iwara-1-click-filter">Iwara 1-Click Filter</a></b></u> (version 1.5) by <u><b><a href="/users/erono">Erono</a></b></u></i>.';
			}
			copyrightNode.innerHTML = copyrightNode.firstChild.nodeValue + innerHTMLExt;
		}

		let addForumCommentElement = document.querySelectorAll('#forum-comments h2.comment-form, #forum-comments noscript, #forum-comments #comment-form');
		if (addForumCommentElement.length > 0) {	// Wrap forum's "Add new comment" section in a block
			let commentBlock = document.createElement('div');
			commentBlock.id = 'add-forum-comment-block';
			addForumCommentElement.forEach(elem => {
				commentBlock.appendChild(elem);
			});
			document.getElementById('forum-comments').appendChild(commentBlock);
		}

		let creatorProfileCard = document.querySelector('body.page-user.page-user- #block-views-profile-block .field-content');
		if (creatorProfileCard) {
			if (document.body.className.match('page-user-603563')) {	// My special profile pic border + tooltip
				creatorProfileCard.innerHTML = creatorProfileCard.innerHTML + creatorProfileCard.innerHTML + creatorProfileCard.innerHTML + creatorProfileCard.innerHTML + creatorProfileCard.innerHTML + creatorProfileCard.innerHTML + creatorProfileCard.innerHTML;
				creatorProfileCard.children[5].setAttribute('src', 'https://i.imgur.com/fQZC1bB.png');
				creatorProfileCard.setAttribute('title', 'The creator of "Iwara UI Fix"');
			}
			else {	// User role profile pic border
				let role = document.querySelector('body.page-user.page-user- #content div.content > div.profile > div:last-child > ul > li');
				if (role) {
					switch (role.innerText) {
						case 'administrator':
							creatorProfileCard.className += ' role-admin';
							creatorProfileCard.setAttribute('title', 'Administrator');
							break;
						case 'moderator':
							creatorProfileCard.className += ' role-mod';
							creatorProfileCard.setAttribute('title', 'Moderator');
							break;
					}
					role = role.parentElement.parentElement;
					role.parentElement.removeChild(role);
				}
			}
		}
		
		let friendsList = document.querySelector('body.page-user-friends table.table');
		if (friendsList) {	// Accept/reject all friends buttons
			let acceptReqButton = friendsList.querySelectorAll('tr.warning button[data-original-title="Accept"]');
			let rejectReqButton = friendsList.querySelectorAll('tr.warning button[data-original-title="Reject"]');
			let doAllReqButtonsArea = null;
			if (acceptReqButton.length > 1) {
				doAllReqButtonsArea = friendsList.querySelector('tr:first-child th:last-child');
				doAllReqButtonsArea.innerHTML = '<button id="accept-all-friends" class="btn btn-xs btn-success accept-friend" title="Accept all pending requests"><span class="glyphicon glyphicon-ok"></span><span class="glyphicon glyphicon-ok"></span></button><button id="reject-all-friends" class="btn btn-xs btn-danger remove-friend" title="Reject all pending requests"><span class="glyphicon glyphicon-remove"></span><span class="glyphicon glyphicon-remove"></span></button>';
				document.getElementById('accept-all-friends').addEventListener('click', function acceptAllFriends () {
					if (confirm("Accept all pending friend requests?")) {
						while (doAllReqButtonsArea.lastElementChild) {
							doAllReqButtonsArea.removeChild(doAllReqButtonsArea.lastElementChild);
						}
						acceptReqButton.forEach(e => {e.click();});
					}
				}, false);
				document.getElementById('reject-all-friends').addEventListener('click', function rejectAllFriends () {
					if (confirm("Reject all pending friend requests?")) {
						while (doAllReqButtonsArea.lastElementChild) {
							doAllReqButtonsArea.removeChild(doAllReqButtonsArea.lastElementChild);
						}
						rejectReqButton.forEach(e => {e.click();});
					}
				}, false);
			}
		}

		document.addEventListener('click', function modifyVideoPlayer (event) {
			let videoPlayerRoot = document.querySelector('#video-player.video-js');
			if (
				videoPlayerRoot &&
				(event.target.className.match('vjs-big-play-button') || event.target.className.match('vjs-poster'))
			) {
				document.removeEventListener('click', modifyVideoPlayer);
				let videoControlBar = videoPlayerRoot.querySelector('.vjs-control-bar');

				// Fix replay button HTML structure (which makes the size inconsistent), along with reordering it
				let videoResButton = videoControlBar.querySelector('.vjs-resolution-button');
				let videoFullscreenButton = videoControlBar.querySelector('.vjs-fullscreen-control');
				let videoReplayButton = videoControlBar.querySelector('.vjs-loop-button');
				if (videoReplayButton) {
					videoReplayButton.innerHTML = '';
					videoReplayButton.className = 'vjs-icon-replay vjs-control vjs-button';
				}
				videoControlBar.insertBefore(videoReplayButton, videoResButton);

				// Add toggle fullscreen fit mode button to the video player
				let videoFitButton = document.createElement('button');
				videoFitButton.className = 'vjs-icon-square vjs-control vjs-button';
				videoFitButton.setAttribute('type', 'button');
				videoFitButton.setAttribute('aria-live', 'polite');
				videoFitButton.innerHTML = '<span class="vjs-control-text">Fullscreen Fit Mode</span>';
				videoControlBar.insertBefore(videoFitButton, videoFullscreenButton);
				videoFitButton.addEventListener ('click', function toggleVideoFitMode () {
					if (videoPlayerRoot.className.match('alt-fit')) {
						videoPlayerRoot.className = videoPlayerRoot.className.replace(' alt-fit', '');
						videoFitButton.className = videoFitButton.className.replace(' vjs-control-active', '');
					}
					else {
						videoPlayerRoot.className += ' alt-fit';
						videoFitButton.className += ' vjs-control-active';
					}
				}, false);
			}
		}, false);

		// CSS Override
		styleOverride.innerHTML += `
			.node.node-teaser,
			.node.node-sidebar_teaser,
			.node.node-teaser i,
			.node.node-sidebar_teaser i,
			.node.node-teaser img,
			.node.node-sidebar_teaser img {
				transition: 0.15s!important;
			}

			/*
			.node.node-teaser img,
			.node.node-sidebar_teaser img {
				filter: contrast(0)!important;
			}
			*/

			.node.node-teaser h3.title,
			.node.node-sidebar_teaser h3.title {
				height: auto!important;
				white-space: nowrap!important;
				text-overflow: ellipsis!important;
			}

			.node.node-teaser:hover,
			.node.node-sidebar_teaser:hover {
				background: #fff;
				opacity: 1!important;
				box-shadow: 3pt 12pt 12pt -6pt #0004;
				transform: rotate3d(0.9, -0.1, 0.1, 3deg) scale(1.02);
				z-index: 42;
			}

			.node.node-teaser.flair-fire:hover,
			.node.node-sidebar_teaser.flair-fire:hover {
				transform: rotate3d(0.9, -0.1, 0.1, -4.5deg) scale(1.02);
				border-color: #f40a;
			}

			.node.node-teaser.flair-star:hover,
			.node.node-sidebar_teaser.flair-star:hover {
				transform: rotate3d(-0.9, 0.1, -0.2, 4.5deg) scale(1.04);
				filter: drop-shadow(-0.2em -0.2em 2em #ffe8);
				outline: 0.32em solid #fe8;
				border: 0;
				border-radius: 0;
			}

			.views-responsive-grid.views-responsive-grid-horizontal.views-columns-2 > * {
				margin-bottom: 0;
			}

			.node.node-teaser .icon-bg,
			.node.node-sidebar_teaser .icon-bg {
				width: 100%!important;
				position: unset;
				margin-top: 0.4em;
				padding: 0;
			}

			.node.node-sidebar_teaser .icon-bg {
				min-height: 1.35em;
			}

			.node:hover .icon-bg {
				background: unset!important;
			}

			.node.node-teaser .left-icon,
			.node.node-sidebar_teaser .left-icon {
				color: inherit;
				margin-left: 0.1em;
				font-size: 0.8em;
				filter: unset!important;

			}

			.node.node-teaser .right-icon,
			.node.node-sidebar_teaser .right-icon {
				float: left!important;
				color: inherit;
				margin-left: 0.5em;
				font-size: 0.8em;
				filter: unset!important;
			}

			.node-image.node-sidebar_teaser .right-icon:first-of-type {
				margin-left: 0;
			}

			.node.node-teaser .left-icon.multiple-icon,
			.node.node-sidebar_teaser .left-icon.multiple-icon {
				float: right!important;
				color: inherit;
				margin-left: 0.5em;
				font-size: 0.8em;
				filter: unset!important;
			}

			.node.node-teaser .left-icon.flair-icon,
			.node.node-sidebar_teaser .left-icon.flair-icon {
				float: right!important;
				color: inherit;
				margin-right: 0.1em;
				font-size: 0.8em;
				filter: unset!important;
			}

			.node.node-teaser .right-icon.like-percentage,
			.node.node-sidebar_teaser .right-icon.like-percentage {
				margin-left: 0.3em;
			}
			
			.right-icon.ratio-icon {
				display: none;
			}

			.node.node-teaser h3.title {
				width: 100%;
				height: 2em;
			}

			.node.node-teaser.flair-lock:hover [title="Flair"],
			.node.node-sidebar_teaser.flair-lock:hover [title="Flair"] {
				color: #bbbf;
			}

			.node.node-teaser.flair-fire:hover [title="Flair"],
			.node.node-sidebar_teaser.flair-fire:hover [title="Flair"] {
				color: #f40f;
				filter: drop-shadow(0.12em -0.16em 0 #f806) drop-shadow(-0.12em -0.04em 0.06em #fd08);
			}

			.node.node-teaser.flair-star:hover [title="Flair"] {
				color: #fd4f;
				transform: rotate(18deg) scale(3.2);
				filter: drop-shadow(1pt 0.5pt 0.5pt #0002) drop-shadow(-0.04em -0.04em 0.1em #ffd8) drop-shadow(0.08em 0.08em 0.02em #fb0f);
			}

			.node.node-sidebar_teaser.flair-star:hover [title="Flair"] {
				color: #fd4f;
				transform: rotate(18deg) scale(2.4);
				filter: drop-shadow(1pt 0.5pt 0.5pt #0002) drop-shadow(-0.04em -0.04em 0.1em #ffd8) drop-shadow(0.12em 0.12em 0.01em #fb0f);
			}

			.node.node-video.node-teaser.flair-lock:hover > div > div div > a > img,
			.node.node-video.node-sidebar_teaser.flair-lock:hover > div div > div > a > img {
				filter: grayscale(1);
			}

			.node.node-video.node-teaser.flair-fire:hover > div > div div > a > img,
			.node.node-video.node-sidebar_teaser.flair-fire:hover > div > div div > a > img {
				filter: sepia(0.3) contrast(1.25) hue-rotate(-15deg) saturate(1.25);
			}

			.node.node-video.node-teaser.flair-star:hover > div > div div > a > img,
			.node.node-video.node-sidebar_teaser.flair-star:hover > div > div div > a > img {
				filter: sepia(0.5) brightness(1.1) contrast(1.25) saturate(1.5);
			}

			.node.node-teaser .blankimg,
			.node.node-sidebar_teaser .blankimg {
				display: block;
				border: #ccc 0.5pt dashed;
			}

			.node.node-teaser .blankimg a,
			.node.node-sidebar_teaser .blankimg a {
				filter: opacity(0);
			}

			.node-video.node-full .video-js .vjs-poster, .node-video.node-full video .vjs-poster {
				background-size: contain;
			}

			.node-video.node-full .video-js, .node-video.node-full video {
				max-height: 90vh;
			}

			.node-video.node-full .vjs-fullscreen video {
				max-height: unset;
			}

			.node-video.node-full .vjs-fullscreen.alt-fit video {
				object-fit: cover;
			}

			#video-player.video-js > .vjs-control-bar {
				font-size: 1.2em;
			}

			.video-js .vjs-play-progress:before {
				top: -56%;
				color: #fffd;
				font-size: 1.4em;
				box-shadow: 0 8pt 8pt -4pt #0006;
			}

			.video-js .vjs-volume-level:before {
				display: none;
			}

			#video-player.video-js > .vjs-control-bar > .vjs-icon-square {
				display: none;
			}

			#video-player.video-js.vjs-fullscreen > .vjs-control-bar > .vjs-icon-square {
				display: inline-block;
			}

			.video-js .vjs-fullscreen-control {
				transform: scale(1.25);
			}

			.video-js button.vjs-control-active {
				color: #8bcba1;
			}

			.video-js div.vjs-mouse-display, .video-js div.vjs-play-progress {
				font-family: inherit;
			}

			.vjs-play-progress::before {
				font-family: VideoJS;
			}

			body.front #wrapper > section > .container,
			body.page-node-add form,
			body.page-node-edit form,
			body.page-user-friends #content > .container,
			body.page-user-liked #content > .container,
			body.page-subscriptions #content > .container,
			body.page-my-content #content > .container,
			body.page-messages #content > .container,
			body.page-user-edit form,
			body.page-comment #content > .container,
			body.page-forum #content > .container,
			body.node-type-video .node.node-video > .content,
			body.node-type-image .node.node-image > .content,
			#comments,
			#add-forum-comment-block,
			.region.region-content .view-id-profile,
			.node.node-journal,
			[class*="block-views"],
			.sidebar .block.block-facetapi,
			.sidebar .block.block-mainblocks,
			.region.region-sidebar .extra-content-block {
				background-color: #fafafa;
				border: 1px solid #ccc;
				border-radius: 4px!important;
				padding: 0.8em!important;
				margin: 0.5em 0.5em 1em 0.5em!important;
			}

			body.page-user #content {
				background-attachment: fixed;
			}

			body.page-user- #content > .container {
				background-color: #eee8;
			}

			body.page-user [class*="block-views"],
			body.page-user .sidebar .block.block-views,
			#block-mainblocks-user-connect,
			body.page-user #comments {
				background-color: #fafafad0;
			}

			body.page-user.page-user- #block-views-profile-block .field-content.role-admin > img {
				border: #f88 6pt solid;
				filter: drop-shadow(2pt 2pt 2pt #c444);
			}

			body.page-user.page-user- #block-views-profile-block .field-content.role-mod > img {
				border: #8af 6pt solid;
				filter: drop-shadow(2pt 2pt 2pt #48c4);
			}

			body.page-node-add form,
			body.page-node-edit form {
				background-color: #ffffff;
			}

			body.front #wrapper > section > .container,
			body.page-user-friends #content > .container,
			body.page-user-liked #content > .container,
			body.page-subscriptions #content > .container,
			body.page-my-content #content > .container,
			body.page-messages #content > .container,
			body.page-user-edit form,
			body.page-comment #content > .container,
			body.page-forum #content > .container {
				margin-left: auto!important;
				margin-right: auto!important;
			}
			
			body.page-user-friends tr:first-child th:last-child {
				text-align: right;
			}

			body.page-user-friends #accept-all-friends,
			body.page-user-friends #reject-all-friends {
				position: relative;
			}

			body.page-user-friends #reject-all-friends {
				margin-left: 4px;
			}

			body.page-user-friends #accept-all-friends span:first-child {
				transform: translateX(-3px);
				filter: drop-shadow(3px 0 0 #2ecc71);
				z-index: 1;
			}

			body.page-user-friends #reject-all-friends span:first-child {
				transform: translateX(-3px);
				filter: drop-shadow(3px 0 0 #e74c3c);
				z-index: 1;
			}

			body.page-user-friends #accept-all-friends span:last-child,
			body.page-user-friends #reject-all-friends span:last-child {
				position: absolute;
				top: 29%;
				left: 40%;
				color: #fffa;
			}

			body.page-forum #content > .container .panel-group > * {
				margin-top: 1em;
			}

			body.node-type-video .node.node-video .node-info .node-views .glyphicon.glyphicon-heart,
			body.node-type-image .node.node-image .node-info .node-views .glyphicon.glyphicon-heart {
				margin-left: 0.5em;
			}

			.node.node-wide_teaser {
				padding: 0.8em!important;
				margin: 0.5em 0.5em 1em 0.5em!important;
			}

			.forum-post {
				margin: 0.5em 0.5em 1em 0.5em!important;
			}

			.forum-post > .panel-heading > .text-muted {
				color: #0008;
			}

			body.node-type-video .node.node-video > .content,
			body.node-type-image .node.node-image > .content {
				padding: 0!important;
			}

			body.node-type-video .node.node-video > .content > .node-buttons,
			body.node-type-image .node.node-image > .content > .node-buttons {
				margin-bottom: 0;
			}

			body.node-type-video .node.node-video > .content > .well {
				max-width: 100%!important;
				margin: 0;
			}

			.node-journal #comments {
				border: unset;
			}

			.view-profile.view-display-id-block {
				background-color: unset;
				padding: unset;
				box-shadow: unset;
			}

			#block-views-profile-block {
				background-color: #fafafa;
				box-shadow: 2pt 8pt 8pt -4pt #0004;
			}

			.region.region-sidebar .view-id-profile .views-responsive-grid > .views-row > div img,
			.region.region-content .view-id-profile .views-responsive-grid > .views-row > div img {
				border-radius: 50%;
				overflow: hidden;
				border: #0001 0.2em solid;
			}

			h1 {
				padding: 0.25em;
				margin: 0;
			}

			#comments > h2.title {
				padding: 0.4em;
				margin-bottom: 0.8em;
			}

			#add-forum-comment-block > h2,
			.extra-content-block {
				padding: 0.6em 0;
			}

			.region.region-sidebar .extra-content-block {
				background-color: #0000;
				border: 0;
				overflow: hidden;
			}

			.region.region-sidebar .extra-content-block iframe {
				transform: translateX(-8.75pt);
			}

			.extra-content-block > center + br,
			body.node-type-video #block-extra-content-extra-content-block-5, 
			body.node-type-video #block-extra-content-extra-content-block-8 {
				display: none;
			}

			.pager {
				border-top: 0;
			}

			#forum > div.view > div.row:first-of-type > div:first-of-type,
			#forum > div.view > div.row:nth-of-type(3) > div:first-of-type {
				width: unset;
				float: left;
				margin: 1.25em 0;
			}

			#forum > div.view > div.row:first-of-type > div:last-of-type,
			#forum > div.view > div.row:nth-of-type(3) > div:last-of-type {
				width: unset;
				float: right;
			}

			.forum-node-create-links {
				width: unset;
			}

			#forum .pager {
				text-align: right;
			}

			#forum-comments .pager li {
				margin: unset;
				padding: unset;
			}

			div.item-list ul.pager > li,
			div.item-list ul.pager > li.pager-current,
			div.item-list ul.pager > li.pager-ellipsis,
			div.item-list ul.pager > li > a {
				margin: 0.2em 0;
				padding: 0;
				border: 0.05em #0000 solid;
				transition: 0.15s;
			}

			div.item-list ul.pager > li > a,
			div.item-list ul.pager > li.pager-current,
			div.item-list ul.pager > li.pager-ellipsis {
				border-radius: 1em;
				padding: 0 0.6em;
				border: 0.05em #0002 solid;
			}

			div.item-list ul.pager > li.pager-ellipsis {
				border: 0.05em #0000 solid;
				background: #0000;
			}

			div.item-list ul.pager > li.pager-current,
			#forum-comments div.item-list ul.pager > li.pager-current {
				border: 0.05em #16a085c0 solid;
				margin: 0 0.1em;
				padding: 0 0.6em;
				background: #16a085c0;
				color: #fafafa;
			}

			div.item-list ul.pager > li > a:hover {
				border: 0.05em solid;
			}

			body.page-user-603563 #block-views-profile-block .field-content {
				position: relative;
				filter: drop-shadow(0.1em 0.3em 0.4em #0002);
			}

			body.page-user-603563 #block-views-profile-block .field-content > img {
				width: 75%;
				margin: 3%;
				transform-origin: 48%;
				border: 0;
				border-radius: 0;
				clip-path: circle(50% at center);
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(1) {
				position: absolute;
				filter: contrast(0) brightness(0);
				transform: scale(1.05);
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(2) {
				position: absolute;
				filter: contrast(0) sepia(1) saturate(3) brightness(1.7);
				animation: special-border 3.7s infinite linear;
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(3) {
				position: absolute;
				filter: contrast(0) sepia(1) saturate(7) brightness(1.5) hue-rotate(120deg);
				animation: special-border 1.2s -0.41s infinite linear;
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(4) {
				position: absolute;
				filter: contrast(0) sepia(1) saturate(7) brightness(1.2) hue-rotate(240deg);
				animation: special-border 2.5s -0.83s infinite linear;
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(5) {
				position: absolute;
				filter: contrast(0) brightness(2);
				animation: special-border 0.7s -0.24s infinite linear;
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(6) {
				position: absolute;
			}

			body.page-user-603563 #block-views-profile-block .field-content > img:nth-child(7) {
				visibility: hidden;
			}

			@keyframes special-border {
				0% {transform: translate(2%, 0) rotateZ(40deg) scale(1.03);}
				100% {transform: translate(2%, 0) rotateZ(400deg) scale(1.03);}
			}
			`;
		document.head.appendChild(styleOverride);
	}
}, true);