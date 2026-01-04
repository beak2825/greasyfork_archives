// ==UserScript==
// @name        Nexusmods Old UI
// @namespace   zys52712
// @match       https://www.nexusmods.com/*
// @match       https://www.nexusmods.com/games/*
// @grant       none
// @version     1.1
// @author      zys52712
// @license     GNU GPLv3
// @description Style new nexusmods site closer to how it used to look
// @downloadURL https://update.greasyfork.org/scripts/533882/Nexusmods%20Old%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/533882/Nexusmods%20Old%20UI.meta.js
// ==/UserScript==

const styles = document.createElement('style');

styles.innerHTML = `
#mainContent {
	& > div > .bg-gradient-to-b,
	& > div > div > .size-full.object-cover[src*="media.nexusmods"],
	& > div > div > .size-full.object-cover[src*="media.nexusmods"] + div,
	div:has(> img.w-screen) {
		display: none;
	}
}

img.max-w-none[src*='home/hero-bg'] {
	display: none;
}

.next-container-fluid,
.next-container {
	@media screen and (min-width: 1640px) {
		width: 1552px;
	}

	section:has(> div > div[class*='group/mod-tile']):nth-child(2) > div:nth-child(2),
	div:has(+ .mods-grid) {
		margin-bottom: 0;
		background: #2d2d2d;

		div[aria-label*='Mods filter'] {
			gap: 0;

			button {
				border-radius: 0;
				padding: 13px 16px;
				border: 0;
				color: white;

				&[aria-checked='true'] {
					background: #444;
					box-shadow: inset 0 3px 0 0 #8197ec;
				}

				&[aria-checked='false'] {
					border-right: 1px solid #414141;
				}
			}
		}

		button[aria-haspopup='listbox'] {
			padding: 11px 15px;
			border-radius: 0;
		}
	}

	div[class*='group/mod-tile'] {
		background: #383838;

		& > div > div > div:nth-child(3) *,
		& > div > div > div:nth-child(4),
		& > div:last-child * {
			color: #c2c2c2;
		}
	}

	& > div:has(div[class*='group/mod-tile']),
	& > div:has(.mods-grid) {
		padding: 20px;
		background: #383838;

		.mods-grid,
		div:has(> div[class*='group/mod-tile']) {
			margin-top: 0;
			padding: 20px;
			background: #444;
			gap: 16px;

			.typography-body-md {
				font-size: 13px;
			}

			a.typography-body-xl {
				font-size: 15px;
			}
		}
	}

	/*
	div:has(> div[aria-label*='Filters panel']) {
		flex-direction: column;
		padding: 20px;
		background: #383838;

		div:has(> div[class*='group/checkbox']) {
			display: flex;
			column-gap: 10px;
			flex-wrap: wrap;
			align-items: center;
		}

		div[class*='group/checkbox'] {
			width: unset;
		}
	}

	div[aria-label*='Filters panel'] {
		width: unset;

		display: grid;

		& > div:first-child {
			grid-row: 1;
		}
		& > button {
			grid-row: 2;
		}
		& > div {
			grid-row: 3;
		}
	}
	*/

	div:has(> div[aria-label*='Filters panel']) {
		div.items-center:has(> .flex-wrap > button) {
			background: #383838;
			margin-bottom: 24px;

			button {
				padding: 10px 0;
			}
		}
	}

	div[aria-label*='Filters panel'] + div {
		padding-left: 0;
	}
}

body:has(.next-container-fluid, .next-container) {
	* {
		font-family: Roboto, sans-serif !important;
	}
}

body {
	background: none;

	&::before {
		content: ' ';
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: #060702;
		background-image: url('/assets/images/default/bg_game_index.jpg');
		background-position: center top;
		background-size: cover;
		background-repeat: no-repeat;
		will-change: transform;
		z-index: -1;
	}

	footer {
		background-color: rgb(15 15 16 / var(--tw-bg-opacity));
	}
}
`;

document.body.appendChild(styles);

function replaceDates() {
	const timeElements = document.querySelectorAll('time[datetime*="20"]');

	timeElements.forEach((time) => {
		time.innerHTML = formatDate(time.dateTime);
	});
}

function formatDate(iso) {
	const date = new Date(iso);
	return date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	return [...a].sort().toString() === [...b].sort().toString();
}

let elements = [];

const observer = new MutationObserver((mutations) => {
	if (
		!arraysEqual([...document.querySelectorAll('.mods-grid time')], elements)
	) {
		elements = [...document.querySelectorAll('.mods-grid time')];
		replaceDates();
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true,
});