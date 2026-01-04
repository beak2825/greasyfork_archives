// ==UserScript==
// @name         Code Injector - Bonk.io
// @version      1.0.4
// @description  Allows different userscripts to define functions that modify the game's code
// @author       Excigma & kklkkj
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433861/Code%20Injector%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/433861/Code%20Injector%20-%20Bonkio.meta.js
// ==/UserScript==

// What this does:
// - Finds other userscripts that have defined their injectors in `window.bonkCodeInjectors`, and runs them

// Much of the code below was copied from or inspired by https://github.com/kklkkj/kklee/blob/master/src/runInjectors.js
// Credits to https://github.com/kklkkj for creating this system where multiple
// extensions can edit different parts of Bonk.io' code.

// This script was originally made to inject kklkkj's kklee as a userscript

// Go thank kklkkj for this

(function () {
	// Original `document.head.appendChild` function that we're going to overwrite
	const _appendChild = document.head.appendChild;
	const log = (msg) => console.log(`%c[Injector] ${msg}`, "color: #06c26d");

	// When RequireJS tries to add alpha2s.js to <head> we will intercept it,
	// and patch it using functions defined by other scripts in window.bonkCodeInjectors
	document.head.appendChild = function (...args) {
		// `args?.[0]?.src.includes("alpha2s.js")` is more difficult to read
		if (args[0] && args[0]?.tagName === "SCRIPT" && args[0]?.src?.includes("alpha2s.js")) {
			// Store the url of the original unmodified alpha2s.js
			// Add ? to prevent double injection
			const code_url = args[0].src + "?";

			// Remove the src attribute so it doesn't try to load the original alpha2s.js script
			args[0].removeAttribute("src");

			(async function () {
				// Fetch alpha2s.js
				log("Fetching alpha2s.js...");
				const request = await fetch(code_url).catch(error => console.error(error));

				// Error fetching alpha2s.js (for example http 404)
				if (!request.ok) {
					log("Failed to fetch alpha2s.js");
					alert("An error occurred whilst fetching game code");

					// Fallback to what bonk.io would normally do
					args[0].src = code_url;
					return _appendChild.apply(document.head, args);
				}

				let code = await request.text();

				log("Patching alpha2s.js...");
				const start_time = performance.now();

				// No bonkCodeInjectors found, this might mean that the user does not have any bonk userscripts installed
				// or that they failed to load before this script

				// I removed the alert because people who prefer userscripts over extensions likely
				// enjoy the flexibility of being able to disable userscripts easily
				// and it's possible that they will have all their userscripts disabled at one time

				if (!window.bonkCodeInjectors) {
					// Still log to the console
					log(
						"Did not find any Bonk.io userscripts to load. This may be an error, make sure you have scripts installed."
					);
				} else {
					// Loop through `bonkCodeInjectors` and pass alpha2s.js' code in for them to modify
					let error_notified = false;
					for (const injector of window.bonkCodeInjectors) {
						try {
							// Run injector from other userscripts
							if (typeof injector === "function") code = injector(code);
							else {
								log("Injector was not a function");
								console.log(injector);
							}
							// I could check if code === injector(code); and throw an error if the code
							// did not change, but Salama also does in their userscripts which would caue
							// a double up in alert()s, which is not very nice
						} catch (error) {
							// Only notify the user once if any userscript fails to load
							// helpful to prevent spamming alerts()
							
							if (!error_notified) {
								// An injector from one of the other userscripts failed to load
								alert("One of your Bonk.io userscripts was unable to be loaded");
								error_notified = true;
							}

							console.error(error);
						}
					}
				}

				const end_time = performance.now();
				log(`Patched alpha2s.js successfully (${(end_time - start_time).toFixed(0)}ms)`);

				// Add the new script to the <script>'s contents
				args[0].textContent = code;

				// Make RequireJS think that the script loaded
				args[0].dispatchEvent(new Event("load"));

				// Append the modified <script> tag to document.head
				return _appendChild.apply(document.head, args);
			})().catch(error => {
				// Error patching alpha2s.js somewhere
				log("Failed to inject code into alpha2s.js");
				console.error(error);
				alert("An error occurred whilst patching game code");

				// Fallback to what bonk.io would normally do without this userscript
				args[0].src = code_url;
				return _appendChild.apply(document.head, args);
			});
		} else {
			return _appendChild.apply(document.head, args);
		}
	};
})();