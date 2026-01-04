// ==UserScript==
// @name Requests
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 2.0.3
// @author rafaelgssa
// @description Useful library for sending requests.
// @match *://*/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// ==/UserScript==

/* global DOM, Utils */

/**
 * @typedef {'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'} RequestMethod
 */

/**
 * @template T
 * @typedef {Object} ExtendedResponse
 * @property {string} url
 * @property {string} text
 * @property {T} [json]
 * @property {Document} [dom]
 */

// eslint-disable-next-line
const Requests = (() => {
	/**
	 * Sends a request to a URL with a specific method.
	 * @template T
	 * @param {RequestMethod} method The method to use.
	 * @param {string} url The URL where to send the request.
	 * @param {RequestInit | GM.Request} [options] The options for the request.
	 * @returns {Promise<ExtendedResponse<T>>} The response of the request.
	 */
	const _sendWithMethod = (method, url, options = {}) => {
		return send(url, { ...options, method });
	};

	/**
	 * Sends a request to a URL.
	 * @template T
	 * @param {string} url The URL where to send the request.
	 * @param {RequestInit | GM.Request} [options] The options for the request.
	 * @returns {Promise<ExtendedResponse<T>>} The response of the request.
	 */
	const send = (url, options = {}) => {
		if (_isInternal(url, options)) {
			return _sendInternal(url, options);
		}
		return _sendExternal(url, options);
	};

	/**
	 * Checks if the request is internal (uses window.fetch) or external (uses GM.xmlHttpRequest to bypass CORS).
	 * @param {string} url
	 * @param {RequestInit | GM.Request} options
	 * @returns {options is RequestInit} Whether the request is internal or external.
	 */
	// eslint-disable-next-line
	const _isInternal = (url, options) => {
		return url.includes(window.location.host);
	};

	/**
	 * Sends an internal request (uses window.fetch).
	 * @template T
	 * @param {string} url
	 * @param {RequestInit} options
	 * @returns {Promise<ExtendedResponse<T>>}
	 */
	const _sendInternal = async (url, options) => {
		const [internalFetch, internalOptions] = _getInternalVars(options);
		const response = await internalFetch(url, internalOptions);
		const extendedResponse = /** @type {ExtendedResponse<T>} */ ({
			url: response.url,
			text: await response.text(),
		});
		return _processResponse(extendedResponse);
	};

	/**
	 * Returns internal variables that allow the request to be made in the current Firefox container.
	 * @param {RequestInit} options
	 * @returns {[Function, RequestInit]} The internal variables.
	 */
	const _getInternalVars = (options) => {
		if (!('wrappedJSObject' in window)) {
			return [window.fetch, options];
		}
		window.wrappedJSObject.options = cloneInto(options, window);
		return [window.wrappedJSObject.fetch, window.wrappedJSObject.options];
	};

	/**
	 * Sends an external request (uses GM.xmlHttpRequest to bypass CORS).
	 * @template T
	 * @param {string} url
	 * @param {Partial<GM.Request>} options
	 * @returns {Promise<ExtendedResponse<T>>}
	 */
	const _sendExternal = (url, options) => {
		return new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				url,
				method: 'GET',
				...options,
				onload: (response) => {
					const extendedResponse = /** @type {ExtendedResponse<T>} */ ({
						url: response.finalUrl,
						text: response.responseText,
					});
					resolve(_processResponse(extendedResponse));
				},
				onerror: reject,
			});
		});
	};

	/**
	 * Processes a response to return DOMs and JSONs already parsed.
	 * @template T
	 * @param {ExtendedResponse<T>} response The response to process.
	 * @returns {ExtendedResponse<T>} The processed response.
	 */
	const _processResponse = (response) => {
		const processedResponse = { ...response };
		try {
			processedResponse.dom = DOM.parse(response.text);
		} catch (err) {
			// Response is not a DOM, just ignore.
		}
		try {
			processedResponse.json = JSON.parse(response.text);
		} catch (err) {
			// Response is not a JSON, just ignore.
		}
		return processedResponse;
	};

	/**
	 * Parses a query string into an object.
	 * @param {string} query The query string to parse.
	 * @returns {Record<string, string>} The parsed object.
	 */
	const parseQuery = (query) => {
		const params = /** @type {Record<string, string>} */ ({});
		const rawQuery = query.startsWith('?') ? query.slice(1) : query;
		const parts = rawQuery.split('&').filter(Utils.isSet);
		for (const part of parts) {
			const [key, value] = part.split('=').filter(Utils.isSet);
			params[key] = value;
		}
		return params;
	};

	/**
	 * Converts an object to a query string.
	 * @param {Record<string, unknown>} obj The object to convert.
	 * @returns {string} The converted query string, without '?'.
	 */
	const convertToQuery = (obj) => {
		return Object.entries(obj)
			.map((entry) => entry.join('='))
			.join('&');
	};

	return {
		CONNECT: /** @template T */ (
			/** @type [string] | [string, RequestInit | GM.Request] */ ...args
		) => /** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('CONNECT', args[0], args[1])),
		DELETE: /** @template T */ (
			/** @type [string] | [string, RequestInit | GM.Request] */ ...args
		) => /** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('DELETE', args[0], args[1])),
		GET: /** @template T */ (/** @type [string] | [string, RequestInit | GM.Request] */ ...args) =>
			/** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('GET', args[0], args[1])),
		HEAD: /** @template T */ (/** @type [string] | [string, RequestInit | GM.Request] */ ...args) =>
			/** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('HEAD', args[0], args[1])),
		OPTIONS: /** @template T */ (
			/** @type [string] | [string, RequestInit | GM.Request] */ ...args
		) => /** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('OPTIONS', args[0], args[1])),
		PATCH: /** @template T */ (
			/** @type [string] | [string, RequestInit | GM.Request] */ ...args
		) => /** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('PATCH', args[0], args[1])),
		POST: /** @template T */ (/** @type [string] | [string, RequestInit | GM.Request] */ ...args) =>
			/** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('POST', args[0], args[1])),
		PUT: /** @template T */ (/** @type [string] | [string, RequestInit | GM.Request] */ ...args) =>
			/** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('PUT', args[0], args[1])),
		TRACE: /** @template T */ (
			/** @type [string] | [string, RequestInit | GM.Request] */ ...args
		) => /** @type Promise<ExtendedResponse<T>> */ (_sendWithMethod('TRACE', args[0], args[1])),
		send,
		parseQuery,
		convertToQuery,
	};
})();
