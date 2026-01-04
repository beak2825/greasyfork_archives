// ==UserScript==
// @name         Fullscreen - Bonk.io
// @description  Adds a button to enter fullscreen
// @author       Excigma
// @namespace    https://github.com/Excigma
// @license      GPL-3.0
// @version      0.0.5
// @match        https://bonk.io/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/436028/Fullscreen%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/436028/Fullscreen%20-%20Bonkio.meta.js
// ==/UserScript==

(() => {
	if (unsafeWindow.parent !== unsafeWindow) {
		let fullscreen = false;

		const parent_document = unsafeWindow.parent.document;
		const fullscreen_button = document.createElement("div");
		const pretty_top_bar = document.getElementById("pretty_top_bar");
		const button_count = document.querySelectorAll("#pretty_top_bar>.pretty_top_button.niceborderleft").length;
		const map_editor_style = document.getElementById("mapeditor").style;
		const lobby_style = document.getElementById("newbonklobby").style;

		fullscreen_button.id = "pretty_top_fullscreen";
		fullscreen_button.classList.add("pretty_top_button", "niceborderleft");
		pretty_top_bar.appendChild(fullscreen_button);
	
		// Thanks to kklkkj for this
		// https://github.com/kklkkj/kklee/blob/3d93fb10134bfc6c0b9bd98b413edc511a53ae21/src/injector.js#L283
		const limit_size = () => {
			const max_width = `${Math.min(unsafeWindow.innerWidth / 730, unsafeWindow.innerHeight / 500) * 730 * 0.9}px`;
			map_editor_style.maxHeight = "calc(100vh - 70px)";
			lobby_style.maxHeight = "calc(100vh - 70px)";
			map_editor_style.maxWidth = max_width;
			lobby_style.maxWidth = max_width;
		};

		fullscreen_button.addEventListener("click", () => {
			fullscreen = !fullscreen;

			if (fullscreen) {
				document.body.classList.add("fullscreen");
				parent_document.body.classList.add("fullscreen");
				
				// Limit the size of the chat and map editor
				limit_size();
			} else {
				document.body.classList.remove("fullscreen");
				parent_document.body.classList.remove("fullscreen");

				// Stop limiting the size
				map_editor_style.maxHeight = "calc(100vh - 70px)";
				lobby_style.maxHeight = "100%";
				map_editor_style.maxWidth = "90vw";
				lobby_style.maxWidth = "100%";
			}
		});
	
		unsafeWindow.addEventListener("resize", () => {
			if (fullscreen) setTimeout(limit_size, 50);
		});

		// eslint-disable-next-line no-undef
		GM_addStyle(`
			#pretty_top_fullscreen {
				width: 58px;
				height: 34px;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 24 24'%3E%3Cpath d='M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'/%3E%3C/svg%3E");
				background-size: 24px 24px;
				background-repeat: no-repeat;
				background-position: center;
				position: absolute;
				right: ${(button_count * 58) + 1}px;
				top: 0;
			}

			.fullscreen #pretty_top_fullscreen {
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 24 24'%3E%3Cpath d='M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'/%3E%3C/svg%3E") !important;
			}

			/* Move the game frame to the top, so the adverts do not interfere with clicking*/
			.fullscreen #maingameframe {
				z-index: 10000;
			}

			/* Makes the main game section have no border, have 100% of it's parent's height, and 100% of it's parent's width (in this case the size of your screen */
			.fullscreen #bonkiocontainer {
				height: 100vh !important;
				width: 100vw !important;
				border: none !important;
			}

			/* Makes the countdown partially transparent, as some maps spawn you there */
			.fullscreen #ingamecountdown {
				opacity: 75%;
			}

			/* The actual canvas where the game is drawn; this does NOT include buttons, menus etc */
			/* Tells it to make the position absolute on the screen (doesn't care about parent) and move it to the right? idk what i did here lol i wrote it ages ago but it works */
			/* also hides the cursor while you're hovering over the game canvas */
			.fullscreen #gamerenderer {
				text-align: center !important;
			}

			.fullscreen #gamerenderer>canvas {
				display: inline-block !important;
			}

			/* Center the Bonk.io main menu replays */
			.fullscreen #bgreplay {
				text-align: center !important;
			}

			.fullscreen #bgreplay>canvas {
				display: inline-block !important;
			}

			/* Moves the XP bar down a bit, so it's visible when in fullscreen*/
			.fullscreen #xpbarcontainer {
				top: -3px !important;
			}
		`);
	} else {
		// eslint-disable-next-line no-undef
		GM_addStyle(`
			.fullscreen #maingameframe {
				position: fixed !important;
				margin-top: 0px !important;
				z-index: 99999 !important;
			}
			.fullscreen #bonkioheader {
				display:none;
			}
			body.fullscreen {
				overflow: hidden;
			}
		`);
	}
})();