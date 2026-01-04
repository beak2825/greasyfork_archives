// ==UserScript==
// @name        UX Improvements
// @author      commander
// @description Many refactors and additions to the TankTrouble interface
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     0.0.4
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @run-at      document-end
// @grant       GM_addStyle
// @require     https://update.greasyfork.org/scripts/482092/1309109/TankTrouble%20Development%20Library.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484942/UX%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/484942/UX%20Improvements.meta.js
// ==/UserScript==

// TODO: Minimum game quality setting
// TODO: Lobby games carousel instead
// TODO: Controls switcher

const ranges = {
	years: 3600 * 24 * 365,
	months: (365 * 3600 * 24) / 12,
	weeks: 3600 * 24 * 7,
	days: 3600 * 24,
	hours: 3600,
	minutes: 60,
	seconds: 1
};

/**
 * Format a timestamp to relative time ago from now
 * @param date Date object
 * @returns Time ago
 */
const timeAgo = date => {
	const formatter = new Intl.RelativeTimeFormat('en');
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;

	for (const key in ranges) {
		if (ranges[key] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key];
			return formatter.format(Math.ceil(delta), key);
		}
	}

	return 'now';
};

GM_addStyle(`
player-name {
	width: 150px;
	height: 20px;
	left: -5px;
	top: -12px;
	position: relative;
	display: block;
}`);

// Wide "premium" screen
GM_addStyle(`
#content {
    max-width: 1884px !important;
    width: calc(100%) !important;
}

.horizontalAdSlot,
.verticalAdSlot,
#leftBanner,
#rightBanner,
#topBanner {
    display: none !important;
}
`);

if (!customElements.get('player-name')) {
	customElements.define('player-name',

		/**
		 * Custom HTML element that renders a TankTrouble-style player name
		 * from the username, width and height attribute
		 */
		class PlayerName extends HTMLElement {

			/**
			 * Initialize the player name element
			 */
			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'closed' });

				this.username = this.getAttribute('username') || 'Scrapped';
				this.width = this.getAttribute('width') || '150';
				this.height = this.getAttribute('height') || '25';

				// create the internal implementation
				this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				this.svg.setAttribute('width', this.width);
				this.svg.setAttribute('height', this.height);

				this.name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				this.name.setAttribute('x', '50%');
				this.name.setAttribute('y', '0');
				this.name.setAttribute('text-anchor', 'middle');
				this.name.setAttribute('dominant-baseline', 'text-before-edge');
				this.name.setAttribute('font-family', 'TankTrouble');
				this.name.setAttribute('font-weight', 'normal');
				this.name.setAttribute('font-size', '16');
				this.name.setAttribute('fill', 'white');
				this.name.setAttribute('stroke', 'black');
				this.name.setAttribute('stroke-line-join', 'round');
				this.name.setAttribute('stroke-width', '2');
				this.name.setAttribute('paint-order', 'stroke');
				this.name.textContent = this.username;

				this.svg.appendChild(this.name);

				shadow.appendChild(this.svg);
			}

			/**
			 * Scale the username SVG text when it's in the DOM.
			 * 
			 * Bounding boxes will first be calculated right when
			 * it can be rendered.
			 */
			connectedCallback() {
				const nameWidth = this.name.getComputedTextLength();
				if (nameWidth > this.width) {
					// Scale text down to match svg size
					const newSize = Math.floor((this.width / nameWidth) * 100);
					this.name.setAttribute('font-size', `${ newSize }%`);
				}
			}

		});
}

(() => {
	/**
	 * Patch a sprite that doesn't have a .log bound to it
	 * @param spriteName Name of the sprite in the DOM
	 * @returns Function wrapper
	 */
	const bindLogToSprite = spriteName => {
		const Sprite = Reflect.get(unsafeWindow, spriteName);
		if (!Sprite) throw new Error('No sprite in window with name', spriteName);

		return function(...args) {
			const sprite = new Sprite(...args);

			sprite.log = Log.create(spriteName);

			return sprite;
		};
	};

	Reflect.set(unsafeWindow, 'UIDiamondSprite', bindLogToSprite('UIDiamondSprite'));
	Reflect.set(unsafeWindow, 'UIGoldSprite', bindLogToSprite('UIGoldSprite'));
})();

(() => {
	GM_addStyle(`
	@keyframes highlight-thread {
		50% {
			border: #a0e900 2px solid;
			background-color: #dcffcc;
		}
	}
	.forum .thread.highlight .bubble,
	.forum .reply.highlight .bubble {
		animation: .5s ease-in 0.3s 2 alternate highlight-thread;
	}
	.forum .tanks {
		position: absolute;
	}
	.forum .reply.left .tanks {
		left: 0;
	}
	.forum .reply.right .tanks {
		right: 0;
	}
	.forum .tanks.tankCount2 {
		transform: scale(0.8);
	}
	.forum .tanks.tankCount3 {
		transform: scale(0.6);
	}
	.forum .tank.coCreator1 {
		position: absolute;
		transform: translate(-55px, 0px);
	}
	.forum .tank.coCreator2 {
		position: absolute;
		transform: translate(-110px, 0px);
	}
	.forum .reply.right .tank.coCreator1 {
		position: absolute;
		transform: translate(55px, 0px);
	}
	.forum .reply.right .tank.coCreator2 {
		position: absolute;
		transform: translate(110px, 0px);
	}
	.forum .share img {
		display: none;
	}
	.forum .thread .share:not(:active) .standard,
	.forum .thread .share:active .active,
	.forum .reply .share:not(:active) .standard,
	.forum .reply .share:active .active {
		display: inherit;
	}
	`);

	// The jquery SVG plugin does not support the newer paint-order attribute
	$.svg._attrNames.paintOrder = 'paint-order';

	/**
	 * Add tank previews for all thread creators, not just the primary creator
	 * @param threadOrReply Post data
	 * @param threadOrReplyElement Parsed post element
	 */
	const insertMultipleCreators = (threadOrReply, threadOrReplyElement) => {
		// Remove original tank preview
		threadOrReplyElement.find('.tank').remove();

		const creators = {
			...{ creator: threadOrReply.creator },
			...threadOrReply.coCreator1 && { coCreator1: threadOrReply.coCreator1 },
			...threadOrReply.coCreator2 && { coCreator2: threadOrReply.coCreator2 }
		};
		const creatorsContainer = $('<div/>')
			.addClass(`tanks tankCount${Object.keys(creators).length}`)
			.insertBefore(threadOrReplyElement.find('.container'));

		// Render all creator tanks in canvas
		for (const [creatorType, playerId] of Object.entries(creators)) {
			const wrapper = document.createElement('div');
			wrapper.classList.add('tank', creatorType);

			const canvas = document.createElement('canvas');
			canvas.width = UIConstants.TANK_ICON_WIDTH_SMALL;
			canvas.height = UIConstants.TANK_ICON_HEIGHT_SMALL;
			canvas.style.width = `${UIConstants.TANK_ICON_RESOLUTIONS[UIConstants.TANK_ICON_SIZES.SMALL] }px`;
			canvas.style.height = `${UIConstants.TANK_ICON_RESOLUTIONS[UIConstants.TANK_ICON_SIZES.SMALL] * 0.6 }px`;
			canvas.addEventListener('mouseup', () => {
				const rect = canvas.getBoundingClientRect();
				const win = canvas.ownerDocument.defaultView;

				const top = rect.top + win.scrollY;
				const left = rect.left + win.scrollX;

				TankTrouble.TankInfoBox.show(left + (canvas.clientWidth / 2), top + (canvas.clientHeight / 2), playerId, canvas.clientWidth / 2, canvas.clientHeight / 4);
			});
			UITankIcon.loadPlayerTankIcon(canvas, UIConstants.TANK_ICON_SIZES.SMALL, playerId);

			wrapper.append(canvas);
			creatorsContainer.append(wrapper);
		}

		// Render name of primary creator
		Backend.getInstance().getPlayerDetails(result => {
			const username = typeof result === 'object' ? Utils.maskUnapprovedUsername(result) : 'Scrapped';
			const width = UIConstants.TANK_ICON_RESOLUTIONS[UIConstants.TANK_ICON_SIZES.SMALL] + 10;
			const height = 25;

			const playerName = $(`<player-name username="${ username }" width="${ width }" height="${ height }"></player-name>`);
			creatorsContainer.find('.tank.creator').append(playerName);
		}, () => {}, () => {}, creators.creator, Caches.getPlayerDetailsCache());
	};

	/**
	 * Scroll a post into view if it's not already
	 * and highlight it once in view
	 * @param threadOrReply Parsed post element
	 */
	const highlightThreadOrReply = threadOrReply => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			const inView = entry.isIntersecting;

			threadOrReply[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
			if (inView) {
				threadOrReply.addClass('highlight');

				observer.disconnect();
			}
		});

		observer.observe(threadOrReply[0]);
	};

	/**
	 * Insert a share button to the thread or reply that copies the link to the post to clipboard
	 * @param threadOrReply Post data
	 * @param threadOrReplyElement Parsed post element
	 */
	const addShare = (threadOrReply, threadOrReplyElement) => {
		const isReply = Boolean(threadOrReply.threadId);

		const url = new URL(window.location.href);
		const wasWindowOpenedFromPostShare = url.searchParams.get('ref') === 'share';
		if (wasWindowOpenedFromPostShare && isReply) {
			const urlReplyId = Number(url.searchParams.get('id'));
			if (urlReplyId === threadOrReply.id) highlightThreadOrReply(threadOrReplyElement);
		}

		const likeAction = threadOrReplyElement.find('.action.like');

		let shareAction = $('<div class="action share"></div>');
		const shareActionStandardImage = $('<img class="standard" src="https://i.imgur.com/emJXwew.png" srcset="https://i.imgur.com/UF4gXBk.png 2x"/>');
		const shareActionActiveImage = $('<img class="active" src="https://i.imgur.com/pNQ0Aja.png" srcset="https://i.imgur.com/Ti3IplV.png 2x"/>');

		shareAction.append([shareActionStandardImage, shareActionActiveImage]);
		likeAction.after(shareAction);

		// Replies have a duplicate actions container for 
		// both right and left-facing replies.
		// So when the share button is appended, there may be multiple
		// and so we need to realize those instances as well
		shareAction = threadOrReplyElement.find('.action.share');

		shareAction.tooltipster({
			position: 'top',
			offsetY: 5,

			/** Reset tooltipster when mouse leaves */
			functionAfter: () => {
				shareAction.tooltipster('content', 'Copy link to clipboard');
			}
		});
		shareAction.tooltipster('content', 'Copy link to clipboard');

		shareAction.on('mouseup', () => {
			const urlConstruct = new URL('/forum', window.location.origin);

			if (isReply) {
				urlConstruct.searchParams.set('id', threadOrReply.id);
				urlConstruct.searchParams.set('threadId', threadOrReply.threadId);
			} else {
				urlConstruct.searchParams.set('threadId', threadOrReply.id);
			}

			urlConstruct.searchParams.set('ref', 'share');

			ClipboardManager.copy(urlConstruct.href);

			shareAction.tooltipster('content', 'Copied!');
		});
	};

	/**
	 * Add text to details that shows when a post was last edited
	 * @param threadOrReply Post data
	 * @param threadOrReplyElement Parsed post element
	 */
	const addLastEdited = (threadOrReply, threadOrReplyElement) => {
		const { created, latestEdit } = threadOrReply;

		if (latestEdit) {
			const details = threadOrReplyElement.find('.bubble .details');
			const detailsText = details.text();
			const replyIndex = detailsText.indexOf('-');
			const lastReply = replyIndex !== -1
				? ` - ${ detailsText.slice(replyIndex + 1).trim()}`
				: '';

			// We remake creation time since the timeAgo
			// function estimates months slightly off
			// which may result in instances where the
			// edited happened longer ago than the thread
			// creation date
			const createdAgo = timeAgo(new Date(created * 1000));
			const editedAgo = `, edited ${ timeAgo(new Date(latestEdit * 1000)) }`;

			details.text(`Created ${createdAgo}${editedAgo}${lastReply}`);
		}
	};

	/**
	 * Add anchor tags to links in posts
	 * @param _threadOrReply Post data
	 * @param threadOrReplyElement Parsed post element
	 */
	const addHyperlinks = (_threadOrReply, threadOrReplyElement) => {
		const threadOrReplyContent = threadOrReplyElement.find('.bubble .content');

		if (threadOrReplyContent.length) {
			const urlRegex = /(?<_>https?:\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?)/gu;
			const messageWithLinks = threadOrReplyContent.html().replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
			threadOrReplyContent.html(messageWithLinks);
		}
	};

	/**
	 * Add extra features to a thread or reply
	 * @param threadOrReply Post data
	 * @param threadOrReplyElement
	 */
	const addFeaturesToThreadOrReply = (threadOrReply, threadOrReplyElement) => {
		insertMultipleCreators(threadOrReply, threadOrReplyElement);
		addLastEdited(threadOrReply, threadOrReplyElement);
		addShare(threadOrReply, threadOrReplyElement);
		addHyperlinks(threadOrReply, threadOrReplyElement);
	};

	/**
	 *
	 * @param threadOrReply
	 */
	const handleThreadOrReply = threadOrReply => {
		if (threadOrReply === null) return;

		const [key] = Object.keys(threadOrReply.html);
		const html = threadOrReply.html[key];

		if (typeof html === 'string') {
			const threadOrReplyElement = $($.parseHTML(html));

			addFeaturesToThreadOrReply(threadOrReply, threadOrReplyElement);
			threadOrReply.html[key] = threadOrReplyElement;
			threadOrReply.html.backup = html;
		} else if (html instanceof $) {
			// For some reason, the post breaks if it's already
			// been parsed through here. Therefore, we pull
			// from the backup html we set, and re-apply the changes
			const threadOrReplyElement = $($.parseHTML(threadOrReply.html.backup));

			addFeaturesToThreadOrReply(threadOrReply, threadOrReplyElement);
			threadOrReply.html[key] = threadOrReplyElement;
		}
	};

	const threadListChanged = ForumView.getMethod('threadListChanged');
	ForumView.method('threadListChanged', function(...args) {
		const threadList = args.shift();
		for (const thread of threadList) handleThreadOrReply(thread);

		const result = threadListChanged.apply(this, [threadList, ...args]);
		return result;
	});

	const replyListChanged = ForumView.getMethod('replyListChanged');
	ForumView.method('replyListChanged', function(...args) {
		const replyList = args.shift();
		for (const thread of replyList) handleThreadOrReply(thread);

		const result = replyListChanged.apply(this, [replyList, ...args]);
		return result;
	});

	const getSelectedThread = ForumModel.getMethod('getSelectedThread');
	ForumModel.method('getSelectedThread', function(...args) {
		const result = getSelectedThread.apply(this, [...args]);

		handleThreadOrReply(result);

		return result;
	});
})();

(() => {
	Loader.interceptFunction(TankTrouble.AccountOverlay, '_initialize', (original, ...args) => {
		original(...args);

		TankTrouble.AccountOverlay.accountCreatedText = $('<div></div>');
		TankTrouble.AccountOverlay.accountCreatedText.insertAfter(TankTrouble.AccountOverlay.accountHeadline);
	});

	Loader.interceptFunction(TankTrouble.AccountOverlay, 'show', (original, ...args) => {
		original(...args);

		Backend.getInstance().getPlayerDetails(result => {
			if (typeof result === 'object') {
				const created = new Date(result.getCreated() * 1000);
				const formatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(created);

				TankTrouble.AccountOverlay.accountCreatedText.text(`Created: ${formatted} (${timeAgo(created)})`);
			}
		}, () => {}, () => {}, TankTrouble.AccountOverlay.playerId, Caches.getPlayerDetailsCache());
	});
})();

(() => {
	/**
	 * Determine player's admin state
	 * @param playerDetails Player details
	 * @returns -1 for retired admin, 0 for non-admin, 1 for admin
	 */
	const getAdminState = playerDetails => {
		const isAdmin = playerDetails.getGmLevel() >= UIConstants.ADMIN_LEVEL_PLAYER_LOOKUP;

		if (isAdmin) return 1;
		else if (TankTrouble.WallOfFame.admins.includes(playerDetails.getUsername())) return -1;
		return 0;
	};

	/**
	 * Prepend admin details to username
	 * @param usernameParts Transformable array for the username
	 * @param playerDetails Player details
	 * @returns Mutated username parts
	 */
	const maskUsernameByAdminState = (usernameParts, playerDetails) => {
		const adminState = getAdminState(playerDetails);

		if (adminState === 1) usernameParts.unshift(`(GM${ playerDetails.getGmLevel() }) `);
		else if (adminState === -1) usernameParts.unshift('(Retd.) ');

		return usernameParts;
	};

	/**
	 * Mask username if not yet approved
	 * If the user or an admin is logged in
	 * locally, then still show the username
	 * @param usernameParts Transformable array for the username
	 * @param playerDetails Player details
	 * @returns Mutated username parts
	 */
	const maskUnapprovedUsername = (usernameParts, playerDetails) => {
		if (!playerDetails.getUsernameApproved()) {
			const playerLoggedIn = Users.isAnyUser(playerDetails.getPlayerId());
			const anyAdminLoggedIn = Users.getHighestGmLevel() >= UIConstants.ADMIN_LEVEL_PLAYER_LOOKUP;

			if (playerLoggedIn || anyAdminLoggedIn) {
				usernameParts.unshift('× ');
				usernameParts.push(playerDetails.getUsername(), ' ×');
			} else {
				usernameParts.length = 0;
				usernameParts.push('× × ×');
			}
		} else {
			usernameParts.push(playerDetails.getUsername());
		}

		return usernameParts;
	};

	/**
	 * Transforms the player's username
	 * depending on parameters admin and username approved
	 * @param playerDetails Player details
	 * @returns New username
	 */
	const transformUsername = playerDetails => {
		const usernameParts = [];

		maskUnapprovedUsername(usernameParts, playerDetails);
		maskUsernameByAdminState(usernameParts, playerDetails);

		return usernameParts.join('');
	};

	Utils.classMethod('maskUnapprovedUsername', playerDetails => transformUsername(playerDetails));
})();

(() => {
	GM_addStyle(`
	.walletIcon {
	  object-fit: contain;
	  margin-right: 6px;
	}
	`);

	Loader.interceptFunction(TankTrouble.VirtualShopOverlay, '_initialize', (original, ...args) => {
		original(...args);

		// Initialize wallet elements
		TankTrouble.VirtualShopOverlay.walletGold = $("<div><button class='medium disabled' style='display: flex;'>Loading ...</button></div>");
		TankTrouble.VirtualShopOverlay.walletDiamonds = $("<div><button class='medium disabled' style='display: flex;'>Loading ...</button></div>");
		TankTrouble.VirtualShopOverlay.navigation.append([TankTrouble.VirtualShopOverlay.walletGold, TankTrouble.VirtualShopOverlay.walletDiamonds]);
	});

	Loader.interceptFunction(TankTrouble.VirtualShopOverlay, 'show', (original, ...args) => {
		original(...args);

		const [params] = args;
		Backend.getInstance().getCurrency(result => {
			if (typeof result === 'object') {
				// Set wallet currency from result
				const goldButton = TankTrouble.VirtualShopOverlay.walletGold.find('button').empty();
				const diamondsButton = TankTrouble.VirtualShopOverlay.walletDiamonds.find('button').empty();

				Utils.addImageWithClasses(goldButton, 'walletIcon', 'assets/images/virtualShop/gold.png');
				goldButton.append(result.getGold());
				Utils.addImageWithClasses(diamondsButton, 'walletIcon', 'assets/images/virtualShop/diamond.png');
				diamondsButton.append(result.getDiamonds());
			}
		}, () => {}, () => {}, params.playerId, Caches.getCurrencyCache());
	});
})();

(() => {
	Loader.interceptFunction(TankTrouble.TankInfoBox, '_initialize', (original, ...args) => {
		original(...args);

		// Initialize death info elements
		TankTrouble.TankInfoBox.infoDeathsDiv = $('<tr/>');
		TankTrouble.TankInfoBox.infoDeathsIcon = $('<img class="statsIcon" src="https://i.imgur.com/PMAUKdq.png" srcset="https://i.imgur.com/vEjIwA4.png 2x"/>');
		TankTrouble.TankInfoBox.infoDeaths = $('<div/>');

		// Align to center
		TankTrouble.TankInfoBox.infoDeathsDiv.css({
			display: 'flex',
			'align-items': 'center',
			margin: '0 auto',
			width: 'fit-content'
		});

		TankTrouble.TankInfoBox.infoDeathsDiv.tooltipster({
			position: 'left',
			offsetX: 5
		});

		TankTrouble.TankInfoBox.infoDeathsDiv.append(TankTrouble.TankInfoBox.infoDeathsIcon);
		TankTrouble.TankInfoBox.infoDeathsDiv.append(TankTrouble.TankInfoBox.infoDeaths);
		TankTrouble.TankInfoBox.infoDeathsDiv.insertAfter(TankTrouble.TankInfoBox.infoTable);

		TankTrouble.TankInfoBox.infoDeaths.svg({
			settings: {
				width: UIConstants.TANK_INFO_MAX_NUMBER_WIDTH,
				height: 34
			}
		});
		TankTrouble.TankInfoBox.infoDeathsSvg = TankTrouble.TankInfoBox.infoDeaths.svg('get');
	});

	Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
		original(...args);

		TankTrouble.TankInfoBox.infoDeathsDiv.tooltipster('content', 'Deaths');
		TankTrouble.TankInfoBox.infoDeathsSvg.clear();

		const [,, playerId] = args;

		Backend.getInstance().getPlayerDetails(result => {
			const deaths = typeof result === 'object' ? result.getDeaths() : 'N/A';

			const deathsText = TankTrouble.TankInfoBox.infoDeathsSvg.text(1, 22, deaths.toString(), {
				textAnchor: 'start',
				fontFamily: 'Arial Black',
				fontSize: 14,
				fill: 'white',
				stroke: 'black',
				strokeLineJoin: 'round',
				strokeWidth: 3,
				letterSpacing: 1,
				paintOrder: 'stroke'
			});
			const deathsLength = Utils.measureSVGText(deaths.toString(), {
				fontFamily: 'Arial Black',
				fontSize: 14
			});

			scaleAndTranslate = Utils.getSVGScaleAndTranslateToFit(UIConstants.TANK_INFO_MAX_NUMBER_WIDTH, deathsLength + 7, 34, 'left');
			TankTrouble.TankInfoBox.infoDeathsSvg.configure(deathsText, { transform: scaleAndTranslate });
		}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
	});
})();
