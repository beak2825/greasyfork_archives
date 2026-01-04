// ==UserScript==
// @name        Power Chat
// @author      commander
// @description Redesigned chatbox for power users — and for those that just want a refresh
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     0.1.4
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://cdn.jsdelivr.net/npm/match-sorter@6/dist/match-sorter.umd.min.js
// @require     https://update.greasyfork.org/scripts/482092/1309109/TankTrouble%20Development%20Library.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483168/Power%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/483168/Power%20Chat.meta.js
// ==/UserScript==

GM_addStyle(`
#chat {
	/* Disable drop shadow filter */
	filter: none;

	/* Transform chat location to bottom left */
	inset: calc(100% - 30px) auto auto 34px !important;
}

/* Reverse chat messages flow */
#chat,
#chat .content,
#chat .body {
	display: flex;
	flex-direction: column-reverse;
}

#chat .body {
	align-items: end;
	background: #00000014;
	border-image: linear-gradient(90deg, rgb(0 0 0 / 20%), #0000) 4 7 3 / 0 0 1pt 0 / 0;
	border-radius: 3px;
	direction: rtl;
	margin-bottom: 4px;
	margin-top: 0 !important;
	mask-image: linear-gradient(to top, rgb(0 0 0) 70%, rgb(0 0 0 / 11%));
	overflow: hidden;
	padding-right: 10px;
	pointer-events: visible;

	/* Scrollbar */
	scrollbar-gutter: stable;
	top: 0 !important;
}

#chat .content {
	position: relative;
	width: fit-content !important;
}

#chat .status.button {
	cursor: initial;
	transform: translate(7px, -18px);
	z-index: 1;
}

#chat form {
	background: #ececec;
	border-image: linear-gradient(90deg, rgb(0 0 0 / 20%), #0000) 4 7 3 / 0 0 1pt 0 / 1pt;
	margin-left: 20px;
	width: 200px;
}

/* Disable chat message sending animation */
#chat form[style*="repeating-linear-gradient"] {
	background: #d0d0d0 !important;
}

#chat:not(.open) form {
	display: none;
}

#chat textarea {
	font-family: Arial, verdana;
	left: 5px;
	transition: width 0s !important;
	width: calc(100% - 12px);
}

#chat .body .chatMessage svg {
	border-left: 2px dotted rgb(170 170 170);
	padding: 2px 4px 1px;
}

#chat .body.dragging {
	border: none !important;
	margin-left: 20px !important;
}

/* Rotate and align the handle to top-right */
.handle.ui-resizable-ne[src*="resizeHandleBottomRight.png"] {
	height: 12px !important;
	position: absolute;
	right: 0;
	top: 0;
	transform: rotate(-90deg);
	width: 12px;
}

body:has(#chat .body.ui-resizable-resizing) .ui-resizable-handle.handle.ui-resizable-ne {
	display: none !important;
}

#chat .body:hover {
	overflow-y: scroll;
}

#chat .body .chatMessage {
	margin-left: ${(/Chrome.*Safari/u).test(navigator.userAgent) ? '3px' : '5px'};
	direction: ltr;
}

#chat .body::-webkit-scrollbar {
	width: 3px;
}

#chat .body::-webkit-scrollbar-track {
	background: transparent;
}

#chat .body::-webkit-scrollbar-thumb {
	background: rgb(170 170 170);
}

#chat form .autocomplete-dropdown {
	background-color: #00ff02;
	border-radius: 3px;
	bottom: 0;
	filter: drop-shadow(0 0 3px rgb(0 0 0 / 70%));
	font-family: Arial, verdana;
	margin-bottom: 25px;
	max-height: 120px;
	max-width: 200px;
	min-width: 120px;
	overflow-y: scroll;
	padding: 4px 2px;
	position: absolute;
	scrollbar-color: #00a902 transparent;
	scrollbar-gutter: stable;
	scrollbar-width: thin;
	white-space: nowrap;
	z-index: 999;
}

#chat form .autocomplete-dropdown div {
	border-bottom: 1pt dotted #00a902;
	cursor: pointer;
	display: none;
	margin-bottom: 2px;
	overflow: hidden;
	padding: 0 8px 2px 4px;
	text-overflow: ellipsis;
}

#chat form .autocomplete-dropdown .match {
	display: block;
}

#chat form .autocomplete-dropdown .match:not(:has(~ .match)) {
	border-bottom: none;
	padding: 0 8px 0 4px;
}

#chat form .autocomplete-dropdown .highlight {
	font-weight: bold;
}

#chat form .autocomplete-dropdown:hover .highlight {
	font-weight: normal;
}

#chat form .autocomplete-dropdown div:hover {
	font-weight: bold !important;
}

#chat form .autocomplete-dropdown:has(div:not(.highlight):hover) > .highlight {
	font-weight: normal;
}

#chat form .autocomplete-caret-mirror {
	background: transparent;
	color: transparent;
	font-family: Arial, verdana;
	font-size: inherit;
	font-weight: bold;
	height: 0;
	margin: 0 0 0 5px;
	opacity: 0;
	padding: 1px 2px;
	pointer-events: none;
	z-index: -2147483647;
}
`);

/**
 * Reconfigure the chat handle to be dragging
 * from the south-east direction (down)
 * to the north-east direction (up)
 */
const changeHandleDirection = async() => {
	const { resizable } = $.fn;

	// Use a regular function to keep context
	$.fn.resizable = function(...args) {
		const [config] = args;

		// Reassign the chat handle to be north-east facing
		if (config.handles) {
			const handle = config.handles.se;
			if (handle === TankTrouble.ChatBox.chatBodyResizeHandle) {
				handle.removeClass('ui-resizable-se')
					.addClass('ui-resizable-ne');

				config.handles.ne = handle;
				delete config.handles.se;

				// Set a taller chat maxHeight
				config.maxHeight = 650;
			}
		}

		return resizable.call(this, config);
	};

	await Loader.whenContentInitialized();

	TankTrouble.ChatBox.chatBodyResizeHandle.detach().insertAfter(TankTrouble.ChatBox.chatBody);
};

/**
 * Hook message render functions to disable jquery .show() animation and scroll to bottom
 * This fixes chat messages not showing up in the reversed chat order or overflowed messages being cleared
 */
const fixChatRendering = () => {
	Loader.interceptFunction(TankTrouble.ChatBox, '_renderChatMessage', (original, ...args) => {
		TankTrouble.ChatBox.chatBody.scrollTop(TankTrouble.ChatBox.chatBody.height());

		// Set animateHeight to false
		args[9] = false;
		original(...args);
	});

	Loader.interceptFunction(TankTrouble.ChatBox, '_renderSystemMessage', (original, ...args) => {
		TankTrouble.ChatBox.chatBody.scrollTop(TankTrouble.ChatBox.chatBody.height());

		// Set animateHeight to false
		args[3] = false;
		original(...args);
	});
};

/**
 * Prevent TankTrouble from clearing the chat when the client disconnects
 * Print message to chat when client switches server to separate conversations
 */
const preventServerChangeChatClear = () => {
	Loader.interceptFunction(TankTrouble.ChatBox, '_clearChat', (original, ...args) => {
		const isUnconnected = ClientManager.getClient().getState() === TTClient.STATES.UNCONNECTED;

		// Void the call if the client is unconnected
		// when the function is invoked
		if (isUnconnected) return null;

		return original(...args);
	});

	Loader.interceptFunction(TankTrouble.ChatBox, '_updateStatusMessageAndAvailability', (original, ...args) => {
		const [systemMessageText, guestPlayerIds] = args;

		// Check for a welcome message. If match.
		// print a different system message
		if (systemMessageText === 'Welcome to TankTrouble Comms § § ') {
			const newServer = ClientManager.getAvailableServers()[ClientManager.multiplayerServerId];
			return original(`Connected to ${ newServer.name } ${ guestPlayerIds.length ? '§ ' : '' }`, guestPlayerIds);
		}

		return original(...args);
	});
};

/**
 * Write the chat savestate to storage and return
 * @returns Promise for last savestate
 */
const initChatSavestate = async() => {
	// Initialize dynamic stylesheet
	// for user-defined chat width
	const inputWidth = new CSSStyleSheet();
	inputWidth.insertRule('#chat form { padding-right: 12px !important; }', 0);
	inputWidth.insertRule('#chat form, #chat textarea { width: 208px !important; }', 1);
	document.adoptedStyleSheets = [inputWidth];

	// Savestate hooks
	Loader.interceptFunction(TankTrouble.ChatBox, 'open', (original, ...args) => {
		GM_setValue('chat-open', true);
		original(...args);
	});
	Loader.interceptFunction(TankTrouble.ChatBox, 'close', (original, ...args) => {
		GM_setValue('chat-open', false);
		original(...args);
	});
	Loader.interceptFunction(TankTrouble.ChatBox, '_refreshChat', (original, ...args) => {
		original(...args);
		GM_setValue('chat-width', TankTrouble.ChatBox.chatBody[0].clientWidth);
	});

	// Get savestate
	const shouldOpen = await GM_getValue('chat-open', true);
	const initialWidth = await GM_getValue('chat-width', 0);

	Loader.whenContentInitialized().then(() => {
		/* eslint-disable prefer-destructuring */
		const chatBody = TankTrouble.ChatBox.chatBody[0];
		const chatInput = TankTrouble.ChatBox.chatInput[0];
		/* eslint-enable prefer-destructuring*/

		if (shouldOpen) TankTrouble.ChatBox.open();
		if (initialWidth !== 0) chatBody.style.width = `${initialWidth}px`;

		// Create a mutation observer that looks for
		// changes in the chatBody's attributes
		new MutationObserver(() => {
			const width = Number(chatBody.offsetWidth || 220);

			inputWidth.deleteRule(1);
			inputWidth.insertRule(`#chat form, #chat form textarea { width: ${width - 12}px !important; }`, 1);

			chatInput.dispatchEvent(new InputEvent('input'));
		}).observe(chatBody, {
			attributes: true,
			characterData: false
		});
	});
};

/**
 * Add up/down history for sent messages
 * @param chatInput Input to target
 */
const addInputHistory = chatInput => {
	const messages = [];
	let currentInputValue = chatInput.value;

	// Create and initialize chat messages history iterator
	let i = messages.length;
	const iterator = (function* chatsIterator() {
		while (true) {
			const incOrDec = (yield messages[i]) === 'prev' ? -1 : 1;
			i = Math.min(Math.max(i + incOrDec, 0), messages.length);
		}
	}(messages));

	// Initialize the generator
	iterator.next();

	/**
	 * Check whether or not the input has an empty selection range
	 * @returns Selection range is 0
	 */
	const isSelectionEmpty = () => chatInput.selectionStart === chatInput.selectionEnd;

	/** Handle the user triggering a submit keydown event */
	const handleSubmit = () => {
		if (!chatInput.value) return;

		messages.push(chatInput.value);
		currentInputValue = '';

		i = messages.length;
	};

	/** Handle the user triggering an arrow up keydown event */
	const handleArrowUp = () => {
		if (isSelectionEmpty() && chatInput.selectionStart === 0) {
			const { value } = iterator.next('prev');
			chatInput.value = typeof value === 'undefined' ? '' : value;

			chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
			chatInput.dispatchEvent(new InputEvent('input', { isComposing: true }));
		}
	};

	/** Handle the user triggering an arrow down keydown event */
	const handleArrowDown = () => {
		if (isSelectionEmpty() && chatInput.selectionStart === chatInput.value.length) {
			const { value } = iterator.next();
			chatInput.value = typeof value === 'undefined' ? currentInputValue : value;

			chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
			chatInput.dispatchEvent(new InputEvent('input', { isComposing: true }));
		}
	};

	// If the user is at the top of the history,
	// save the chat input value as the "current"
	// message whenever there is a change
	chatInput.addEventListener('input', ({ inputType }) => {
		const isAtEndOfHistory = i === messages.length;
		const hasValueChanged = typeof inputType !== 'undefined';
		if (isAtEndOfHistory && hasValueChanged) currentInputValue = chatInput.value;
	});

	// Listen for keydown events
	// and trigger handlers
	chatInput.addEventListener('keydown', ({ key }) => {
		switch (key) {
		case 'Enter':
			handleSubmit();
			break;
		case 'ArrowUp':
			handleArrowUp();
			break;
		case 'ArrowDown':
			handleArrowDown();
			break;
		default:
			break;
		}
	});
};

/**
 * Add auto-complete for user mentions when typing @ in the chat input
 * @param chatInput Chat input instance
 */
const addMentionAutocomplete = chatInput => {
	class Dropdown {

		options = new Map();

		matches = [];

		/**
		 * Setup the dropdown class
		 * @param input Input to attach to
		 * @param config Dropdown configuration (allow multiple of the same value, expiry time)
		 */
		constructor(input, config) {
			this.input = $(input);
			this.wrapper = $('<div class="autocomplete-dropdown" tabindex="-1"></div>').insertAfter(this.input);
			this.textareaMirror = $('<div class="autocomplete-caret-mirror"></div>').appendTo(this.wrapper.parent());
			this.textareaMirrorInline = $('<span></span>').appendTo(this.textareaMirror);

			Object.assign(this, {
				allowRepeats: false,
				autofillLifetime: 10 * 60 * 100,
				inputHeight: 18,
				...config
			});

			this.wrapper.insertAfter(this.input);


			this.hide();
		}

		#searchTerm = -1;

		/**
		 * Filter the dropdown elements when searchterm is set
		 * @param term String term to search the dropdown registry for
		 * @returns term
		 */
		set searchTerm(term) {
			if (this.#searchTerm !== term) {
				this.#removeExpired();

				const allSymbols = Array.from(this.options.keys());
				this.matches = matchSorter.matchSorter(allSymbols, term, { keys: [symbol => symbol.description] });
				for (const symbol of allSymbols) {
					const element = this.options.get(symbol).value;

					element.classList[this.matches.includes(symbol) ? 'add' : 'remove']('match');
				}
				for (const symbol of this.matches) this.wrapper.append(this.options.get(symbol).value);

				this.#resetToFirst();
			}

			this.#searchTerm = term;
			return term;
		}

		/**
		 * Getter for `searchTerm`
		 * @returns `searchTerm`
		 */
		get searchTerm() {
			return this.#searchTerm;
		}

		iterator = (function* (options, that) {
			let i = 0;
			while (true) {
				const symbol = that.matches[i];

				const change = (yield [symbol, options.get(symbol)]) || 0;

				i = (i = (i + change) % Math.max(that.matches.length, 1)) < 0
					? i + that.matches.length
					: i;
			}
		}(this.options, this));

		/** Render the dropdown if not already visible */
		show() {
			if (this.isShowing()) return;

			this.#resetToFirst();

			this.wrapper.show();
			this.wrapper.scrollTop(0);
		}

		/** Hide the dropdown */
		hide() {
			this.wrapper.hide();
		}

		/**
		 * Check if the dropdown is visible
		 * @returns Is the dropdown showing?
		 */
		isShowing() {
			return this.wrapper.is(':visible');
		}

		/**
		 * Compute dropdown x-shift to textarea value.
		 * 
		 * Should be called when value changes in the input field
		 */
		update() {
			const transformed = this.input.val()
				.substr(0, this.input[0].selectionStart);
			this.textareaMirrorInline.html(transformed);

			const rects = this.textareaMirrorInline[0].getBoundingClientRect();
			const left = rects.right - rects.x;
			this.left = left
				+ Dropdown.#toNumeric(this.input.css('left'))
				+ Dropdown.#toNumeric(this.input.css('margin-left'))
				+ Dropdown.#toNumeric(this.input.css('padding-left'));

			const isWordWrapped = this.#isWordWrapped();
			const leftShift = isWordWrapped ? 0 : Math.max(0, this.left - (this.wrapper.width() / 2));
			const bottomShift = this.input.outerHeight() - this.inputHeight;
			this.wrapper.css('margin-left', `${leftShift}px`);
			this.wrapper.css('margin-bottom', `${bottomShift + 25}px`);

			if (!this.isShowing()) this.show();
		}

		/**
		 * Get data for the current position
		 * @returns Identifier and data for the current dropdown position
		 */
		getCurrent() {
			return this.iterator.next(0).value;
		}

		/**
		 * Add an autocomplete option to the dropdown
		 * @param option Option as string
		 * @param submitCallback Event handler for mouseup
		 * @returns Success in adding option?
		 */
		addOption(option, submitCallback) {
			const overrideSymbol = !this.allowRepeats
				&& Array.from(this.options.keys())
					.find(({ description }) => description === option);
			const symbolExists = typeof overrideSymbol === 'symbol';

			if (symbolExists) return false;

			const symbol = Symbol(option);

			const element = document.createElement('div');
			element.innerText = option;
			element.addEventListener('mouseup', evt => submitCallback(evt, evt.target.innerText));

			const insert = [
				symbol,
				{
					inserted: Date.now(),
					lifetime: this.autofillLifetime,
					value: element
				}
			];

			this.options.set(...insert);

			return true;
		}

		/**
		 * Add an array of text options to the dropdown
		 * @param options Options as string[]
		 * @param submitCallback Generalized event handler for mouseup for all options
		 */
		addOptions(options, submitCallback) {
			for (const option of options) this.addOption(option, submitCallback);
		}

		/**
		 * Remove option and corresponding HTMLElement from DOM
		 * @param symbol Symbol for element to remove
		 * @returns Was the option deleted?
		 */
		removeOption(symbol) {
			this.options.get(symbol)?.value.remove();
			this.matches = this.matches.filter(toRemove => toRemove !== symbol);
			return this.options.delete(symbol);
		}

		/**
		 * Clear all options from the dropdown
		 * @returns Did options clear?
		 */
		clearOptions() {
			for (const symbol of this.options.keys()) this.removeOption(symbol);

			return this.options.size === 0
				&& this.wrapper.children().length === 0;
		}

		/**
		 * Navigate position in the dropdown up/down
		 * @param direction Up/down shift as number
		 * @returns Identifier for where we navigated to
		 */
		navigate(direction) {
			this.wrapper.children().removeClass('highlight');

			const [symbol, data] = this.iterator.next(direction).value;
			if (!symbol) return null;

			data.value.classList.add('highlight');
			data.value.scrollIntoView(false);

			return symbol;
		}

		/**
		 * Check if the input wraps to newline
		 * @returns Whether the input is one or multiple lines
		 */
		#isWordWrapped() {
			return this.input.outerHeight() <= this.inputHeight;
		}

		/**
		 * Reset the position to the
		 * first item in the dropdown
		 */
		#resetToFirst() {
			const symbols = this.matches;
			const [currentSymbol] = this.iterator.next(0).value;
			const dist = symbols.indexOf(currentSymbol);

			this.navigate(-dist);
		}

		/**
		 * Remove expired entries
		 */
		#removeExpired() {
			for (const [symbol, value] of this.options.entries()) {
				const expiry = value.inserted + value.autofillLifetime;
				if (Date.now() > expiry) this.removeOption(symbol);
			}
		}

		/**
		 * Remove all non-numbers from string and return string as number
		 * @param str String to parse
		 * @returns String in number format
		 */
		static #toNumeric = str => Number(str.replace(/[^0-9.]/ug, ''));

	}

	const dropdown = new Dropdown(chatInput);

	/**
	 * Get the word and start/end indexies of the input selectionEnd
	 * @returns Object with word and range start/end 
	 */
	const getIndexiesOfWordInCurrentSelection = () => {
		// Separate string by whitespace and
		// list indexies for each word in array
		const tokenizedQuery = chatInput.value.split(/[\s\n]/u).reduce((acc, word, index) => {
			const previous = acc[index - 1];
			const start = index === 0 ? index : previous.range[1] + 1;
			const end = start + word.length;

			return acc.concat([ { word, range: [start, end] } ]);
		}, []);

		const currentWord = tokenizedQuery.find(({ range }) => range[0] < chatInput.selectionEnd && range[1] >= chatInput.selectionEnd);

		return currentWord;
	};

	/**
	 * Returns the user that the selection is over, from the input value, if prefixed by a @
	 * @returns Mention username or null
	 */
	const getUserFocusIfMention = () => {
		const currentWord = getIndexiesOfWordInCurrentSelection();
		const [mentions] = chatInput.value.split(/\s+(?=[^@])/u);
		const isUserChat = mentions.startsWith('@');

		if (currentWord && isUserChat) {
			const [, end] = currentWord.range;
			return end <= mentions.length ? currentWord : null;
		}

		return null;
	};

	/**
	 * Handle a dropdown submit event (enter, tab or click)
	 * by autofilling the value to the input field
	 * @param evt Event object
	 * @param username Username to autofill
	 */
	const handleSubmit = (evt, username = dropdown.getCurrent()[0].description) => {
		const mention = getUserFocusIfMention();
		if (mention === null) return;

		const [start, end] = mention.range;
		if (username) {
			const before = chatInput.value.slice(0, start);
			const after = chatInput.value.substring(end, chatInput.value.length);

			const insertSpaceAfter = !after.startsWith(' ');

			const beforeValue = `${ before }@${ username }${ insertSpaceAfter ? ' ' : '' }`;
			const cursorPosition = [beforeValue.length + 1, beforeValue.length + 1];
			chatInput.value = `${ beforeValue }${ after }`;

			chatInput.setSelectionRange(...cursorPosition);
		}

		evt.preventDefault();

		chatInput.dispatchEvent(new InputEvent('input'));
	};

	/**
	 * Event handler for TTClient.EVENTS.GAME_LIST_CHANGED
	 */
	const handleGameListChanged = () => {
		const gameStates = ClientManager.getClient().getAvailableGameStates();

		for (const gameState of gameStates) {
			const playerStates = gameState.getPlayerStates();

			for (const player of playerStates) {
				const playerId = player.getPlayerId();

				Backend.getInstance().getPlayerDetails(result => {
					if (typeof result === 'object') dropdown.addOption(result.getUsername(), handleSubmit);
				}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
			}
		}
	};

	/**
	 * Event handler for received chat messages
	 * @param data Event data
	 */
	const handleNewChatMessage = data => {
		const involvedPlayerIds = data.involvedPlayerIds || [...data.getFrom() || [], ...data.getTo() || []];
		const loggedIn = Users.getAllPlayerIds();
		const foreignPlayerIds = involvedPlayerIds.filter(playerId => !loggedIn.includes(playerId));

		for (const playerId of foreignPlayerIds) {
			Backend.getInstance().getPlayerDetails(result => {
				if (typeof result === 'object') dropdown.addOption(result.getUsername(), handleSubmit);
			}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
		}
	};

	chatInput.addEventListener('input', ({ isComposing }) => {
		if (isComposing) return;

		const userFocus = getUserFocusIfMention();
		if (userFocus === null) {
			dropdown.hide();
			return;
		}

		dropdown.searchTerm = userFocus.word.replace(/^@/u, '');
		if (!dropdown.matches.length) {
			dropdown.hide();
			return;
		}

		// Show UI
		dropdown.show();
		dropdown.update();
	});

	// eslint-disable-next-line complexity
	chatInput.addEventListener('keydown', evt => {
		const userFocus = getUserFocusIfMention();
		if (userFocus === null) return;

		dropdown.searchTerm = userFocus.word.replace(/^@/u, '');
		if (!dropdown.matches.length) return;

		switch (evt.key) {
		case 'Enter':
		case 'Tab':
			handleSubmit(evt);
			break;
		case 'ArrowUp':
			dropdown.navigate(-1);
			evt.preventDefault();
			break;
		case 'ArrowDown':
			dropdown.navigate(1);
			evt.preventDefault();
			break;
		default:
			break;
		}
	}, false);

	/**
	 * State change event handler
	 * @param _self Self reference
	 * @param _oldState Old client state
	 * @param newState New client state
	 */
	const clientStateEventHandler = (_self, _oldState, newState) => {
		switch (newState) {
		case TTClient.STATES.UNCONNECTED:
			dropdown.clearOptions();
			break;
		default:
			break;
		}
	};

	/**
	 * Event handler for new chat messages
	 * @param _self Self reference
	 * @param evt Event type
	 * @param data Event data
	 */
	// eslint-disable-next-line complexity
	const clientEventHandler = (_self, evt, data) => {
		switch (evt) {
		case TTClient.EVENTS.GAME_LIST_CHANGED:
			handleGameListChanged();
			break;
		case TTClient.EVENTS.USER_CHAT_POSTED:
			if (data) handleNewChatMessage(data);
			break;
		case TTClient.EVENTS.GLOBAL_CHAT_POSTED:
		case TTClient.EVENTS.CHAT_POSTED:
			if (data) handleNewChatMessage(data);
			break;
		case TTClient.EVENTS.SYSTEM_CHAT_POSTED:
		case TTClient.EVENTS.PLAYERS_BANNED:
		case TTClient.EVENTS.PLAYERS_UNBANNED:
			if (data) handleNewChatMessage(data);
			break;
		default:
			break;
		}
	};

	ClientManager.getClient().addStateChangeListener(clientStateEventHandler, this);
	ClientManager.getClient().addEventListener(clientEventHandler, this);
};

changeHandleDirection();
fixChatRendering();
initChatSavestate();

Loader.whenContentInitialized().then(() => {
	// eslint-disable-next-line prefer-destructuring
	const chatInput = TankTrouble.ChatBox.chatInput[0];

	preventServerChangeChatClear();
	addMentionAutocomplete(chatInput);
	addInputHistory(chatInput);

	// Allow more characters in the chat input
	chatInput.setAttribute('maxlength', '255');
});
