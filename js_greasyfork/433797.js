// ==UserScript==
// @name         Editor image overlay - Bonk.io (Unmaintained)
// @version      1.0.1
// @description  Overlays an image onto the editor. idk.
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480 
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433797/Editor%20image%20overlay%20-%20Bonkio%20%28Unmaintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433797/Editor%20image%20overlay%20-%20Bonkio%20%28Unmaintained%29.meta.js
// ==/UserScript==

// What this does
// - Overlays an image in the bonk map editor

// You need to reload the page after you change the image
// The image will be stretched to fit
// GM_xmlhttpRequest is needed to load the image and bypass CORS
// This uses Javascript's Proxy API, which is not fast and may have a slight performance impact 
//   -> You should turn this off if you're not using it

(() => {
	let IMAGE_URL = null;

	// OPACITY is used to adjust the opacity of the overlay, from 0 - 1 with 1 being fully opaque
	const OPACITY = 0.35;

	// IMAGE_URL is the url to use as the background overlay - after changing this, you need to reload
	// Uncomment (remove the //) the line below if you want to always use a preset image every time
	// IMAGE_URL = "https://bonk.io/graphics/tt/bonkgameicon3.png";

	// Constant for the border color of the map rectangle thingy in the editor
	const EDITOR_BORDER_COLOR = 16776960;

	// This will allow us to override things in window.PIXI as soon as it's available
	Reflect.defineProperty(unsafeWindow, "PIXI", {
		get: () => null,
		set: (PIXI) => {
			Reflect.deleteProperty(unsafeWindow, "PIXI");

			// This will intercept calls to `new PIXI.Graphics`
			PIXI.Graphics = new Proxy(PIXI.Graphics, {
				construct(Target, args) {
					let Graphics = new Target(...args);

					// Intercept the drawRect function used for drawing rectangles
					Graphics.drawRect = new Proxy(Graphics.drawRect, {
						async apply(target, thisArg, args) {
							// If the map editor's orange border is detected
							if (thisArg._lineStyle?.color === EDITOR_BORDER_COLOR) {
								// Just making sure it's the right one
								if (thisArg._lineStyle.alignment === 0.5 && thisArg._lineStyle.matrix === null) {

									try {
										// Image where specified image will be loaded into
										const img = new Image();

										// Fetches the image
										const objectURL = await new Promise((resolve, reject) => {
											// eslint-disable-next-line no-undef
											GM_xmlhttpRequest({
												url: IMAGE_URL ?? prompt("Insert Editor image overlay URL.\nThe script has a slight performance impact, so it's recommended that you turn it off if you're not using it."),
												method: "GET",
												responseType: "arraybuffer",
												onload: data => resolve(URL.createObjectURL(new Blob([data.response]))),
												onerror: error => reject(error)
											});
										});

										img.src = objectURL;

										// Resize the image to be the same size as the editor's rectangle
										img.width = args[2];
										img.height = args[3];

										// Load the image as a texture
										const image = PIXI.Texture.from(img);
										// Use the texture for the Rectangle's fill
										Graphics.beginTextureFill.apply(thisArg, [{
											texture: image,
											alpha: OPACITY
										}]);

										// Draw the rectangle
										const result = target.apply(thisArg, args);

										// Stop using the texture as a fill.
										Graphics.endFill.apply(thisArg, null);

										return result;
									} catch (er) {
										console.error(er);
										alert(`Error loading image: ${er}`);
									}
								}
							}

							// If it's not the rectangle just do whatever it normally would
							return target.apply(thisArg, args);
						}
					});

					return Graphics;
				}
			});

			// Replace the original with ours
			unsafeWindow.PIXI = PIXI;
		},
		configurable: true
	});
})();