// ==UserScript==
// @name        Keystroke overlay
// @author      commander
// @description Keys overlay for game inputs in TankTrouble
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     0.0.3
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @run-at      document-idle
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483171/Keystroke%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/483171/Keystroke%20overlay.meta.js
// ==/UserScript==

GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@700&display=swap&text=%E2%86%91%E2%86%93%E2%86%90%E2%86%92_');
	 
.keystrokes-hold {
	transform: skewX(-6deg);
	display: grid;
	grid-template: "shoot up ." "left down right";
	position: fixed;
	user-select: none;
	column-gap: 0.25rem;
	row-gap: 0.25rem;
	bottom: 8px;
	right: 7px;
	z-index: 2147483647;
}
#keystrokes-arrowKeys.keystrokes-hold {
	grid-template: ". . up ." "shoot left down right" auto / 120px;
}
.keystrokes-hold .key {
	background: #ececec;
	color: #6e6e6e;
	font-family: 'Source Code Pro', monospace;
	font-size: 1.875rem;
	font-weight: bold;
	border: 1.5px solid #aaaaaa;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	min-width: 2.5rem;
	min-height: 2.5rem;
}
#keystrokes-arrowKeys.keystrokes-hold .key {
	min-height: calc(2.5rem - 5px);
	padding-bottom: 5px;
}
.keystrokes-hold .key-up { grid-area: up; }
.keystrokes-hold .key-left { grid-area: left; }
.keystrokes-hold .key-down { grid-area: down; }
.keystrokes-hold .key-right { grid-area: right; }
.keystrokes-hold .key-shoot { grid-area: shoot; }
.keystrokes-hold .key.active {
	background-color: #d2d2d2;
	color: #232323;
}
`);

const keycodes = {};

/**
 * Create HTML elements for the input overlays
 * from all keyboard input entries
 */
const createInputOverlays = () => {
	const order = ['up', 'down', 'left', 'right', 'shoot'];

	// Character dictonary for special characters
	const characterDict = {
		// Arrow up
		38: '↑',

		// Arrow down
		40: '↓',

		// Arrow left
		37: '←',

		// Arrow right
		39: '→',

		// Space
		32: '_'
	};

	/**
	 * Create an input overlay element from an input set and append it to body
	 * @param inputSetId Identifier for the input set
	 * @param input Input details and keycodes
	 */
	const createKeys = (inputSetId, input) => {
		const keysWrapper = $(`<div id="keystrokes-${ inputSetId }" class="keystrokes-hold"></div>`);

		const keys = Object.values(input.data).map((key, index) => {
			let character = String.fromCharCode(key);
			if (!/[a-zA-Z]/u.test(character) && key in characterDict) character = characterDict[key];

			const element = $(`<div class="key key-${ order[index] }">${character}</div>`);

			keycodes[key] = element;

			return element;
		});
		keysWrapper.append(keys);
		keysWrapper.hide();

		$(document.documentElement).append(keysWrapper);
	};

	for (const [inputSetId, input] of Object.entries(Inputs._inputSets)) {
		const { type } = input;
		if (type === 'keyboard') createKeys(inputSetId, input);
	}
};

Inputs._inputSetsInUse = new Proxy(Inputs._inputSetsInUse, {
	set(target, key, value) {
		target[key] = value;

		$('.keystrokes-hold').hide();
		let [priority] = Object.keys(target);
		if (priority === 'mouse') [, priority] = Object.keys(target);
		if (priority) $(`#keystrokes-${ priority}`).show();
	},
	deleteProperty(target, key) {
		const result = delete target[key];
		if (!Object.keys(target).length) $('.keystrokes-hold').hide();

		return result;
	}
});

document.addEventListener('keydown', ({ keyCode }) => GameManager.getGame()?.input.enabled && keycodes[keyCode]?.addClass('active'));
document.addEventListener('keyup', ({ keyCode }) => keycodes[keyCode]?.removeClass('active'));

createInputOverlays();
