// ==UserScript==
// @name        TankTrouble Development Library
// @author      commander
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     1.0.0-beta.1
// @license     GPL-3.0
// @description Shared library for TankTrouble userscript development
// @match       *://*.tanktrouble.com/*
// @grant       none
// @run-at      document-start
// @noframes
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
class Loader {

	/**
	 * Pass a function to a hook with the correct context
	 * @param context Function context (e.g `window`)
	 * @param funcName Function identifier in the context
	 * @param handler Hook to call before the original
	 * @param attributes Optionally additional descriptors
	 */
	static interceptFunction(context, funcName, handler, attributes) {
		const original = Reflect.get(context, funcName);
		if (typeof original !== 'function') throw new Error('Item passed is not typeof function');

		Reflect.defineProperty(context, funcName, {
			/**
			 * Call the handler with the original function bound to its context
			 * and supply with the arguments list
			 * @param args Arguments passed from outside
			 * @returns Original function return value
			 */
			value: (...args) => handler(original.bind(context), ...args),
			...attributes
		});
	}

	/**
	 * Fires when the `main()` function is done on TankTrouble.
	 * @returns Promise that resolves when Content.init() finishes
	 */
	static whenContentInitialized() {
		if (GM.info.script.runAt !== 'document-start') return Loader.#createGameProxy();
		return whenContentLoaded().then(() => Loader.#createGameProxy());
	}

	/**
	 * Fires when the document is readyState `interactive` or `complete`
	 * @returns Promise that resolves upon content loaded
	 */
	static whenContentLoaded() {
		return new Promise(resolve => {
			if (document.readyState === 'interactive' || document.readyState === 'complete') resolve();
			else document.addEventListener('DOMContentLoaded', () => resolve());
		});
	}

	/**
	 * Apply a hook to the Content.init function which resolves when the promise ends
	 * @returns Promise when Content.init has finished
	 * @private
	 */
	static #createGameProxy() {
		const functionString = Function.prototype.toString.call(Content.init);
		const isAlreadyHooked = /hooked-by-userscript/u.test(functionString);

		return new Promise(resolve => {
			if (isAlreadyHooked) {
				const eventListener = document.addEventListener('content-initialized', () => {
					document.removeEventListener('content-initialized', eventListener);
					resolve();
				});
			} else {
				const event = new Event('content-initialized');

				const { init } = Content;
				Reflect.defineProperty(Content, 'init', {
					/**
					 * Intercept the Content.init function, add a stamp, dispatch the custom event and resolve
					 * @param args Arguments passed from outside
					 * @returns Original function return value
					 */
					value: (...args) => {
						// Hack that will add the string to
						// the return of toString so we can
						// lookup if it's already hooked
						// eslint-disable-next-line no-void
						void 'hooked-by-userscript';

						const result = init(...args);

						document.dispatchEvent(event);
						resolve();
						return result;
					},
					configurable: true
				});
			}
		});
	}

}
