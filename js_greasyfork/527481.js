// ==UserScript==
// @name			IdlePixel Dialogue Handler
// @namespace		luxferre.dev
// @version			1.0.2
// @description		Library which creates a modal for opening plugin panels.
// @author			Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// ==/UserScript==

(function () {
	if (window.dialoguer) {
		// already loaded
		return;
	}

	class Dialoguer {
		constructor() {
			this.original_dialogue = Modals.open_image_modal
			this.handlers = {}

			Modals.open_image_modal = function (title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable) {
				const check_text = title + image_path + message

				for (const [selector, handler] of Object.entries(window.dialoguer.handlers)) {
					if (check_text.includes(selector)) {
						[title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable] = handler.handler(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable)
						if (!handler.propagate) {
							return
						}
					}
				}

				window.dialoguer.original_dialogue(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable)
			}
		}

		register_handler(selector, handler, propagate) {
			this.handlers[selector] = {
				handler: handler,
				propagate: propagate
			}
		}
	}

	// Add to window and init
	window.dialoguer = new Dialoguer();
})();