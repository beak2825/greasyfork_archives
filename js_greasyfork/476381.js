// ==UserScript==
// @name         kick Chat Flusher (Legacy)
// @namespace    Violentmonkey Scripts
// @match        *://*.kick.com/*
// @grant        none
// @version      0.4.1
// @author       spaghetto
// @description  Enhances the Kick.com viewing experience by providing a fullscreen chat overlay. Messages will flow from right to left, allowing for a seamless chat experience while watching content.
// @icon         https://s2.googleusercontent.com/s2/favicons?domain=kick.com&sz=32
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476381/kick%20Chat%20Flusher%20%28Legacy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476381/kick%20Chat%20Flusher%20%28Legacy%29.meta.js
// ==/UserScript==

window.onload = function () {
	const messageQueue = [];
	const elementQueue = [];

	const timeoutIds = [];
	const rowQueue = [];

	const badgeCache = [];
	const lastPositionPerRow = [];

	let displayedMessages = {};

	let observer, existingSocket, chatMessages;

	let loading = true,
		isVod = true,
		isProcessingElements = false,
		isProcessingMessages = false,
		chatEnabled = true,
		chatEnabledVisible = true,
		parentWidth = null,
		parentHeight = null,
		lastFollowersCount = null;

	const boundHandleChatMessageEvent = handleChatMessageEvent.bind(this);

	function getMessageKey(key, value) {
		return key + "|" + value;
	}

	async function processMessageQueue() {
		if (!chatEnabled && isProcessingMessages) {
			return;
		}

		isProcessingMessages = true;

		const data = messageQueue.shift();
		if (data === undefined) return;

		const eventType = data.event ?? "";

		try {
			if (eventType === "App\\Events\\ChatMessageEvent") {
				createMessage(data.data);
			} else if (data.type === "message") {
				createMessage(data);
			} else if (eventType === "App\\Events\\UserBannedEvent") {
				createUserBanMessage(data.data);
			} else if (eventType === "App\\Events\\GiftedSubscriptionsEvent") {
				createGiftedMessage(data.data);
			} else if (eventType === "App\\Events\\FollowersUpdated") {
				createFollowersMessage(data.data);
			} else if (eventType === "App\\Events\\StreamHostEvent") {
				createHostMessage(data.data);
			} else if (eventType === "App\\Events\\SubscriptionEvent") {
				createSubMessage(data.data);
			}

		} catch (error) {
			console.error("Error parsing message data: ", error);
		}

		isProcessingMessages = false;
		processMessageQueue();
	}

	async function processElementQueue() {
		if (isProcessingElements || !chatEnabled || elementQueue.length === 0) {
			return;
		}

		isProcessingElements = true;

		const data = elementQueue.shift();
		selectRow(data.message, data.key);

		const queueLength = elementQueue.length;

		let wait = Math.trunc(isVod ? 5000 / queueLength : 2000 / queueLength);
		if (queueLength < 3) {
			wait = 1000;
		}

		setTimeout(function () {
			isProcessingElements = false;
			processElementQueue();
		}, wait);
	}

	async function checkResize() {
		if (chatMessages === null) return;
		let resizeTimer;

		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					for (let entry of entries) {
						const { width, height } = entry.contentRect;
						if (width === 0) {
							if (chatMessages !== null) {
								chatMessages = null;
								clearChat();
							}
							return;
						}
						parentWidth = Math.trunc(width) * 2;
						parentHeight = Math.trunc(height);
						clearChat();
						updateAnimation();
					}
				}, 100);
			}
		});

		resizeObserver.observe(chatMessages);
	}

	function clearChat() {
		const isEnabled = chatEnabled;
		chatEnabled = false;

		messageQueue.length = 0;
		elementQueue.length = 0;

		for (const id of timeoutIds) {
			clearTimeout(id);
		}

		if (chatMessages !== null) {
			while (chatMessages.firstChild) {
				chatMessages.removeChild(chatMessages.firstChild);
			}
		}

		displayedMessages = {};
		lastPositionPerRow.length = 0;
		rowQueue.length = 0;
		timeoutIds.length = 0;

		chatEnabled = isEnabled;
	}

	function initializeChat(self) {
		chatMessages = document.getElementById("chat-messages");
		if (chatMessages !== null && (loading || !self)) return;

		loading = true;
		resetConnection();

		if (document.querySelector("video") !== null) {
			createChat();
			existingSocket.connection.bind("message", boundHandleChatMessageEvent);
			return;
		}

		observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes) {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeName.toLowerCase() === "video") {
							observer.disconnect();
							createChat();
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		existingSocket.connection.bind("message", boundHandleChatMessageEvent);
		interceptChatRequests();

		setTimeout(function () {
			observer.disconnect();
		}, 5000);
	}

	function resetConnection() {
		existingSocket = window.Echo.connector.pusher;
		existingSocket.connection.unbind("message", boundHandleChatMessageEvent);

		clearChat();
		badgeCache.length = 0;
		lastFollowersCount = null;

		isVod = window.location.href.includes('/video/');
	}

	async function handleChatMessageEvent(data) {
		if (isVod) return;
		if (chatMessages !== null && chatEnabled) {
			messageQueue.push(data);
			processMessageQueue();
			return;
		}

		initializeChat(false);
	}

	function createChat() {
		if (chatMessages !== null) return;
		chatMessages = 0;

		observer.disconnect();

		const chatOverlay = document.createElement("div");
		chatOverlay.id = "chat-overlay";

		const chatMessagesContainer = document.createElement("div");
		chatMessagesContainer.id = "chat-messages";

		chatMessages = chatMessagesContainer;
		chatOverlay.appendChild(chatMessagesContainer);

		const videoPlayer = document.querySelector("video");
		videoPlayer.parentNode.insertBefore(chatOverlay, videoPlayer);

		createToggle();
		checkResize();

		loading = false;
		console.info('Chat Overlay Created: ' + window.location.href);
	}

	function updateAnimation() {
		const chatAnimationStyles = document.getElementById('chat-animation-styles');
		chatAnimationStyles.textContent = `
        @keyframes slide-in {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-${parentWidth}px);
            }
        } `;
	}

	function createToggle() {
		const toggleButton = document.createElement('button');
		toggleButton.className = 'vjs-control vjs-button';

		const spanIconPlaceholder = document.createElement('span');
		spanIconPlaceholder.className = 'vjs-icon-placeholder';
		spanIconPlaceholder.setAttribute('aria-hidden', 'true');

		const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElement.setAttribute('width', '65%');
		svgElement.setAttribute('viewBox', '0 0 16 16');
		svgElement.setAttribute('fill', 'none');
		svgElement.classList.add('mx-auto');
		svgElement.id = 'toggle-icon';

		const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pathElement.setAttribute('d', 'M12.8191 7.99813C12.8191 7.64949 12.7816 7.30834 12.7104 6.97844L13.8913 6.29616L12.3918 3.69822L11.2071 4.38051C10.7048 3.9269 10.105 3.57076 9.44517 3.35708V2H6.44611V3.36082C5.78632 3.57451 5.19025 3.9269 4.68416 4.38426L3.49953 3.70197L2 6.29616L3.18088 6.97844C3.10965 7.30834 3.07217 7.64949 3.07217 7.99813C3.07217 8.34677 3.10965 8.68791 3.18088 9.01781L2 9.70009L3.49953 12.298L4.68416 11.6157C5.1865 12.0694 5.78632 12.4255 6.44611 12.6392V14H9.44517V12.6392C10.105 12.4255 10.701 12.0731 11.2071 11.6157L12.3918 12.298L13.8913 9.70009L12.7104 9.01781C12.7816 8.68791 12.8191 8.34677 12.8191 7.99813ZM9.82006 9.87254H6.07123V6.12371H9.82006V9.87254Z');
		pathElement.setAttribute('fill', 'currentColor');
		pathElement.classList.add('svg-toggle');

		const spanControlText = document.createElement('span');
		spanControlText.className = 'vjs-control-text';
		spanControlText.setAttribute('aria-live', 'polite');
		spanControlText.textContent = 'Toggle Chat';

		svgElement.append(pathElement);
		toggleButton.append(spanIconPlaceholder, svgElement, spanControlText);

		const existingButton = document.querySelector('.vjs-fullscreen-control');
		existingButton.parentNode.insertBefore(toggleButton, existingButton.nextSibling);

		chatEnabled = true;

		toggleButton.addEventListener('click', function () {
			chatEnabled = !chatEnabled;
			if (chatEnabled) {
				pathElement.classList.add('svg-toggle');
			} else {
				clearChat();
				pathElement.classList.remove('svg-toggle');
			}
		});
	}

	function interceptChatRequests() {
		let open = window.XMLHttpRequest.prototype.open;
		window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
			if (url.includes("/api/v2/channels/") && url.includes("/messages")) {
				this.addEventListener("load", function () {
					let self = this;
					const response = JSON.parse(self.responseText);
					if (response.data && response.data.messages) {
						parseRequest(response);
					}
				}, false);
			}

			open.apply(this, arguments);
		};
	}

	function parseRequest(response) {
		if (!isVod || !chatEnabled) return;
		if (chatMessages !== null) {
			response.data.messages.forEach(function (message) {
				messageQueue.push(message);
			});
			processMessageQueue();
		} else {
			setTimeout(function () {
				initializeChat(false);
			}, 1000);
		}
	}

	async function selectRow(messageContainer, messageKey) {
		let selectedRow = 0;
		const positions = lastPositionPerRow.length;
		if (positions > 0) {
			for (let i = 0; i < positions; i++) {
				rowQueue[i] = rowQueue[i] ?? [];

				const item = lastPositionPerRow[i];
				if (item === undefined) {
					selectedRow = i;
					break;
				}

				if (rowQueue[i].length < 2) {
					rowQueue[i].push({ key: messageKey, index: i, message: messageContainer });
					return;
				}

				selectedRow = i + 1;
			}

		}

		rowQueue[selectedRow] = rowQueue[selectedRow] ?? [];
		startAnimation(selectedRow, messageContainer, messageKey);
	}

	async function startAnimation(rowIndex, messageContainer, messageKey) {
		chatMessages.appendChild(messageContainer);
		const topPosition = (rowIndex === 0) ? 2 : rowIndex * (messageContainer.clientHeight + 6) + 2;

		if (topPosition <= parentHeight) {
			lastPositionPerRow[rowIndex] = messageContainer;

			let timeNeeded = Math.trunc((messageContainer.clientWidth + 7) / parentWidth * 16000);

			messageContainer.style.top = topPosition + 'px';
			messageContainer.style.marginRight = `-${messageContainer.clientWidth}px`;

			messageContainer.classList.add("chat-overlay-animation");

			messageContainer.addEventListener("animationend", function () {
				chatMessages.removeChild(messageContainer);
				delete displayedMessages[messageKey];
			});

			const timeoutId = setTimeout(() => {
				checkQueue(rowIndex);
				const index = timeoutIds.indexOf(timeoutId);
				if (index !== -1) {
					timeoutIds.splice(index, 1);
				}
			}, timeNeeded);
			timeoutIds.push(timeoutId);
		}
		else {
			try {
				chatMessages.removeChild(messageContainer);
				delete displayedMessages[messageKey];
			} finally {
				return;
			}
		}
	}

	async function checkQueue(rowIndex) {
		const queueItem = rowQueue[rowIndex].shift();

		if (queueItem !== undefined) {
			const queueContainer = queueItem.message;
			lastPositionPerRow[rowIndex] = queueContainer;
			startAnimation(rowIndex, queueContainer, queueItem.key);
			return;
		}

		lastPositionPerRow[rowIndex] = undefined;
	}

	async function appendMessage(messageKey, messageContent) {
		if (displayedMessages[messageKey]) {
			return;
		}

		displayedMessages[messageKey] = true;

		const messageContainer = document.createElement("div");
		messageContainer.classList.add("chat-message");

		messageContainer.appendChild(messageContent);

		elementQueue.push({ key: messageKey, message: messageContainer });
		processElementQueue();
	}

	async function createMessage(data) {
		const sender = data.sender;
		const username = sender.username;
		const color = sender.identity.color;
		const content = data.content;

		const reduced = reduceRepeatedSentences(content);
		const messageKey = getMessageKey(sender.id, reduced);

		const messageContentContainer = document.createElement("div");
		messageContentContainer.classList.add("chat-message-content");

		const badgeSpan = document.createElement("span");
		badgeSpan.classList.add("chat-overlay-badge");

		const badgeElements = await getBadges(data);
		badgeElements.forEach(badgeElement => {
			badgeSpan.appendChild(badgeElement.cloneNode(true));
		});

		const usernameSpan = document.createElement("span");
		usernameSpan.style.color = color;
		usernameSpan.classList.add("chat-overlay-username");
		usernameSpan.textContent = username;

		const boldSpan = document.createElement("span");
		boldSpan.classList.add("font-bold", "text-white");
		boldSpan.textContent = ": ";

		const contentSpan = document.createElement("span");
		contentSpan.style.color = "#ffffff";
		contentSpan.classList.add("chat-overlay-content");

		const emoteRegex = /\[emote:(\d+):(\w+)\]/g;
		let lastIndex = 0;
		let match;

		while ((match = emoteRegex.exec(reduced)) !== null) {
			const textBeforeEmote = reduced.slice(lastIndex, match.index);
			contentSpan.appendChild(document.createTextNode(textBeforeEmote));

			const img = document.createElement("img");
			const [, id, name] = match;
			img.src = `https://files.kick.com/emotes/${id}/fullsize`;
			img.alt = name;
			img.classList.add("emote-image", "my-auto");
			contentSpan.appendChild(img);

			lastIndex = emoteRegex.lastIndex;
		}

		const textAfterLastEmote = reduced.slice(lastIndex);
		contentSpan.appendChild(document.createTextNode(textAfterLastEmote));

		messageContentContainer.append(badgeSpan, usernameSpan, boldSpan, contentSpan);
		appendMessage(messageKey, messageContentContainer);
	}

	async function createUserBanMessage(data) {
		const now = new Date();
		const bannedUser = data.user.username;

		const messageKey = getMessageKey(`-ban${now.getMinutes()}-`, bannedUser);

		const banMessageContent = document.createElement("div");
		banMessageContent.classList.add("chat-message-content");

		const bannedUserSpan = document.createElement("span");
		bannedUserSpan.textContent = bannedUser;

		const bannedBySpan = document.createElement("span");
		bannedBySpan.textContent = data.banned_by.username;

		const emoji = document.createElement('span');
		emoji.textContent = ' ' + String.fromCodePoint(0x1F6AB) + ' ';

		const banText = document.createTextNode("banned by");

		const banMessageSpan = document.createElement("span");
		banMessageSpan.style.color = "#FF0000";
		banMessageSpan.append(bannedUserSpan, emoji, banText, emoji.cloneNode(true), bannedBySpan);

		banMessageContent.appendChild(banMessageSpan);

		appendMessage(messageKey, banMessageContent);
	}

	async function createSubMessage(data) {
		const now = new Date();

		const username = data.username;
		const months = data.months;
		const messageKey = getMessageKey(`-sub${now.getMinutes()}-`, username + '-' + months);

		const subscriptionMessageContent = document.createElement("div");
		subscriptionMessageContent.classList.add("chat-message-content");

		const emojiSpan = document.createElement('span');
		emojiSpan.textContent = String.fromCodePoint(0x1F389) + ' ';

		const subscriptionMessageSpan = document.createElement("span");
		subscriptionMessageSpan.style.color = "#00FF00";
		subscriptionMessageSpan.textContent = `${months > 1 ? months + ' months' : '1 month'} subscription by ${username}`;

		const subSpan = document.createElement("span");
		subSpan.style.color = "#00FF00";

		subSpan.append(emojiSpan, subscriptionMessageSpan);

		subscriptionMessageContent.append(subSpan);

		appendMessage(messageKey, subscriptionMessageContent);
	}

	async function createHostMessage(data) {
		const now = new Date();

		const hostUsername = data.host_username;
		const viewersCount = data.number_viewers;
		const messageKey = getMessageKey(`-host${now.getMinutes()}-`, hostUsername + ' ' + viewersCount);

		const hostMessageContent = document.createElement("div");
		hostMessageContent.classList.add("chat-message-content");

		const emojiSpan = document.createElement('span');
		emojiSpan.textContent = String.fromCodePoint(0x1F389) + ' ';

		const viewersCountSpan = document.createElement("span");
		viewersCountSpan.textContent = `${viewersCount > 1 ? viewersCount + ' viewers' : '1 viewer'} hosted by ` + hostUsername;

		const hostMessageSpan = document.createElement("span");
		hostMessageSpan.style.color = "#00FF00";

		hostMessageSpan.append(emojiSpan, viewersCountSpan);

		hostMessageContent.appendChild(hostMessageSpan);

		appendMessage(messageKey, hostMessageContent);
	}

	async function createGiftedMessage(data) {
		const now = new Date();

		const gifterUsername = data.gifter_username;
		const giftedUsernames = data.gifted_usernames;
		const messageKey = getMessageKey(`-gift${now.getMinutes()}-`, gifterUsername + '-' + giftedUsernames[0]);

		const giftedContent = document.createElement("div");
		giftedContent.classList.add("chat-message-content");

		const emojiSpan = document.createElement('span');
		emojiSpan.textContent = String.fromCodePoint(0x1F389) + ' ';

		const gifterUsernameSpan = document.createElement("span");
		gifterUsernameSpan.textContent = `${giftedUsernames.length > 1 ? giftedUsernames.length + ' Subscriptions' : '1 Subscription'} gifted by ` + gifterUsername;
		const giftedSpan = document.createElement("span");
		giftedSpan.style.color = "#00FF00";

		giftedSpan.append(emojiSpan, gifterUsernameSpan);

		giftedContent.appendChild(giftedSpan);

		appendMessage(messageKey, giftedContent);
	}

	async function createFollowersMessage(data) {
		const followersCount = data.followersCount;
		const messageKey = getMessageKey('-followers-', followersCount);

		if (lastFollowersCount !== null) {
			const followersDiff = followersCount - lastFollowersCount;
			if (followersDiff === 0) {
				return;
			}

			const messageContent = document.createElement("div");
			messageContent.classList.add("chat-message-content");

			const emojiSpan = document.createElement('span');
			emojiSpan.textContent = String.fromCodePoint(0x1F389) + ' ';

			const followersMessageSpan = document.createElement("span");
			followersMessageSpan.textContent = `${followersDiff > 1 ? followersDiff + ' new followers' : '1 new follower'}`;

			const followersSpan = document.createElement("span");
			followersSpan.append(emojiSpan, followersMessageSpan)

			messageContent.append(followersSpan);

			appendMessage(messageKey, messageContent);
		}

		lastFollowersCount = followersCount;
	}

	function reduceRepeatedSentences(input) {
		const regexSentence = /(\b.+?\b)\1+/g;
		const sentence = input.replace(regexSentence, '$1');
		const regexChar = /(.)(\1{10,})/g;
		return sentence.replace(regexChar, '$1$1$1$1$1$1$1$1$1$1');
	}

	function checkForBadges(data) {
		const badges = data.sender.identity.badges || [];
		const badgeElements = [];

		let firstChatIdentity = document.querySelector(`.chat-entry-username[data-chat-entry-user-id="${data.sender.id}"]`);

		if (firstChatIdentity !== null) {
			let identity = firstChatIdentity.closest('.chat-message-identity');

			identity.querySelectorAll('div.badge-tooltip').forEach(function (baseBadge, index) {
				let badge = badges[index];
				if (badge === undefined) return;
				let badgeText = badge.text;

				if (badge.count) {
					badgeText = `${badge.type}-${badge.count}`;
				}

				const cachedBadge = badgeCache.find(badgeCache => badgeCache.type === badgeText);
				if (cachedBadge) {
					badgeElements.push(cachedBadge.html);
					return;
				}

				const imgElement = baseBadge.querySelector(`img`);
				if (imgElement) {
					const imgUrl = imgElement.src;
					const newImg = document.createElement('img');
					newImg.src = imgUrl;
					newImg.classList.add('badge-overlay');
					badgeCache.push({
						type: badgeText,
						html: newImg
					});

					badgeElements.push(newImg);
					return;
				}

				const svgElement = baseBadge.querySelector('svg');
				if (svgElement) {
					const svgCopy = svgElement.cloneNode(true);
					svgCopy.classList.add('badge-overlay');

					badgeCache.push({
						type: badgeText,
						html: svgCopy
					});

					badgeElements.push(svgCopy);
					return;
				}

				console.warn('badge not found: ' + badgeText);
			});
		}
		return badgeElements;
	}

	async function getBadges(data) {
		const badges = data.sender.identity.badges || [];

		let badgeArray = [];
		let badgeCount = 0;

		if (badges.length === 0) return badgeArray;

		badges.forEach(badge => {
			let badgeText = badge.text;
			if (badge.count) {
				badgeText = `${badge.type}-${badge.count}`;
			}
			const cachedBadge = badgeCache.find(badgeCache => badgeCache.type === badgeText);
			if (cachedBadge) {
				badgeArray.push(cachedBadge.html);
				badgeCount++;
				return;
			}
		});

		let attempts = 0;
		while (badgeCount !== badges.length && attempts < 10) {
			const newBadges = checkForBadges(data);
			badgeArray = newBadges;

			badgeCount = badgeArray.length;
			attempts++;

			await new Promise(resolve => setTimeout(resolve, 750));
		}

		return badgeArray;
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			chatEnabledVisible = chatEnabled
			chatEnabled = false;
			clearChat();
		} else {
			chatEnabled = chatEnabledVisible;
		}
	}

	function addCSS() {
		const chatOverlayStyles = document.createElement("style");
		chatOverlayStyles.id = 'chat-overlay-styles';
		chatOverlayStyles.textContent = `
			#chat-overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
				overflow: hidden;
				z-index: 9999;
			}

			#chat-messages {
				display: flex;
				flex-direction: column-reverse;
				align-items: flex-end;
				height: 100%;
				overflow-y: auto;
			}

			.chat-overlay-username {
				font-weight: 700;
			}

			.chat-message .font-bold {
				margin-right: 0.2em;
			}

			.chat-message {
				position: absolute;
				background-color: rgba(34, 34, 34, 0.6);
				border-radius: 9px;
				max-width: calc(100% - 20px);
				height: 2em;
				display: flex;
   			    align-items: center;
				will-change: transform;
 				padding: 0 .5rem;
  			    font-size: .875rem;
  			    line-height: 1.25rem;
  			    font-weight: 500;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.chat-overlay-badge,
			.chat-overlay-content,
			.chat-message-content {
				display: flex;
				align-items: center;
			}

			.badge-overlay {
				max-width: 16px;
				max-height: 16px;
				margin-right: 5px;
			}

			.chat-overlay-animation {
				animation: slide-in 16s linear;
			}

			.svg-toggle {
				fill: rgb(83, 252, 24) !important;
			}

			.emote-image {
				display: inline-block;
				max-width: 1.5rem;
				max-height: 1.5rem;
				vertical-align: middle;
				margin:  0 0.2em;
			}

			.chat-overlay-content img:last-child {
				margin-right: 0;
			}
		`;

		const animationStyles = document.createElement("style");
		animationStyles.id = 'chat-animation-styles';

		document.head.appendChild(chatOverlayStyles);
		document.head.appendChild(animationStyles);
	}

	document.addEventListener('visibilitychange', handleVisibilityChange);

	addCSS();

	initializeChat(false);
};