// ==UserScript==
// @name DOM
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 4.1.6
// @author rafaelgssa
// @description Useful library for dealing with the DOM.
// @match *://*/*
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js
// ==/UserScript==

/* global Utils */

/**
 * @typedef {(element?: Element) => void} ElementCallback
 *
 * @typedef {InsertPosition | 'atouter' | 'atinner'} ExtendedInsertPosition
 *
 * @typedef {ElementArrayConstructor<ElementArrayBase, 8>} ElementArray Any higher than 8 is too deep and does not work.
 *
 * **The definition for ElementArrayConstructor is in DOM.d.ts, as it is too complex for JSDoc:**
 * declare type ElementArrayConstructor<
 *   T extends [any, any] | ElementArrayChildrenBase | null,
 *   N extends number
 * > = T extends [infer A, infer B]
 *   ? {
 *       done: [A, B, ElementArrayChildrenBase | null];
 *       recurse: [
 *         A,
 *         B,
 *         (
 *           | ElementArrayConstructor<ElementArrayBase, ElementArrayDepth[N]>[]
 *           | ElementArrayChildrenBase
 *           | null
 *         )
 *       ];
 *     }[N extends 0 ? 'done' : 'recurse']
 *   : T extends ElementArrayChildrenBase | null
 *   ? T
 *   : never;
 *
 * @typedef {[never, 0, 1, 2, 3, 4, 5, 6, 7]} ElementArrayDepth
 *
 * @typedef {{ [K in ElementTag]: [K, ElementAttributes<K> | null] }[ElementTag] | ElementArrayChildrenBase | null} ElementArrayBase
 *
 * @typedef {keyof HTMLElementTagNameMap} ElementTag
 *
 * @typedef {Object} ExtendedElementBase
 * @property {Record<string, string>} attrs
 * @property {NodeCallback} ref
 *
 * @typedef {ElementArray[] | ElementArrayChildrenBase} ElementArrayChildren
 *
 * @typedef {Node | string} ElementArrayChildrenBase
 *
 * @typedef {Object} MutationTypes
 * @property {boolean} [attributes]
 * @property {boolean} [childList]
 * @property {boolean} [subtree]
 *
 * @typedef {(node: Node) => void} NodeCallback
 */

/**
 * @template {ElementTag} T
 * @typedef {{
 *   [K in keyof ExtendedElement<T>]?: {
 *     [L in keyof ExtendedElement<T>[K]]?: ExtendedElement<T>[K][L] | null;
 *   } | null;
 * }} ElementAttributes
 */

/**
 * @template {ElementTag} T
 * @typedef {HTMLElementTagNameMap[T] & ExtendedElementBase} ExtendedElement
 */

// eslint-disable-next-line
const DOM = (() => {
	const _parser = new DOMParser();

	/**
	 * Waits for an element that is dynamically added to the DOM.
	 * @param {string} selectors The selectors to query for the element.
	 * @param {number} [timeout] How long to wait for the element in seconds. Defaults to 60 (1 minute).
	 * @param {number} [frequency] How often to keep checking for the element in seconds. Defaults to 1.
	 * @returns {Promise<Element | undefined>} The element, if found.
	 */
	const dynamicQuerySelector = (selectors, timeout = 60, frequency = 1) => {
		return new Promise((resolve) => _checkElementExists(selectors, resolve, timeout, frequency));
	};

	/**
	 * @param {string} selectors
	 * @param {ElementCallback} callback
	 * @param {number} [timeout]
	 * @param {number} [frequency]
	 */
	const _checkElementExists = (selectors, callback, timeout = 60, frequency = 1) => {
		const element = document.querySelector(selectors);
		if (element) {
			callback(element);
		} else if (timeout > 0) {
			window.setTimeout(
				_checkElementExists,
				frequency * 1000,
				selectors,
				callback,
				timeout - frequency,
				frequency
			);
		} else {
			callback();
		}
	};

	/**
	 * Inserts elements in reference to another element based on element arrays that are visually similar to JSX.
	 * @param {Element} referenceEl The element to use as reference.
	 * @param {ExtendedInsertPosition} position Where to insert the elements.
	 * @param {ElementArray[]} arrays The arrays to use.
	 * @returns {(HTMLElement | undefined)[]} The inserted elements from the root level, if successful.
	 *
	 * @example
	 * // `pElement` will contain the P element.
	 * // `elements` will be an array containing the DIV and SPAN elements, in this order, if successful.
	 * let pElement;
	 * const elements = DOM.insertElement(document.body, 'beforeend', [
	 *   ['div', { className: 'hello', onclick: () => {} }, [
	 *     'Hello, ', // This is added as a text node.
	 *     ['p', { ref: (ref) => pElement = ref }, 'John'],
	 *     '!' // This is added as a text node.
	 *   ]],
	 *   ['span', null, 'How are you?']
	 * ]);
	 *
	 * @example
	 * // Using array destructuring.
	 * // `divElement` will contain the DIV element and `spanElement` will contain the SPAN element, if successful.
	 * let pElement;
	 * const [divElement, spanElement] = DOM.insertElement(document.body, 'beforeend', [
	 *   ['div', { className: 'hello', onclick: () => {} }, [
	 *     'Hello, ', // This is added as a text node.
	 *     ['p', { ref: (ref) => pElement = ref }, 'John'],
	 *     '!' // This is added as a text node.
	 *   ]],
	 *   ['span', null, 'How are you?']
	 * ]);
	 */
	const insertElements = (referenceEl, position, arrays) => {
		const docFragment = _buildFragment(arrays);
		if (!docFragment) {
			return [];
		}
		const elements = /** @type {HTMLElement[]} */ (Array.from(docFragment.children));
		const referenceElParent = referenceEl.parentElement;
		switch (position) {
			case 'beforebegin':
				if (referenceElParent) {
					referenceElParent.insertBefore(docFragment, referenceEl);
				}
				break;
			case 'afterbegin':
				referenceEl.insertBefore(docFragment, referenceEl.firstElementChild);
				break;
			case 'beforeend':
				referenceEl.appendChild(docFragment);
				break;
			case 'afterend':
				if (referenceElParent) {
					referenceElParent.insertBefore(docFragment, referenceEl.nextElementSibling);
				}
				break;
			case 'atouter':
				if (referenceElParent) {
					referenceElParent.insertBefore(docFragment, referenceEl.nextElementSibling);
					referenceEl.remove();
				}
				break;
			case 'atinner':
				referenceEl.innerHTML = '';
				referenceEl.appendChild(docFragment);
				break;
			// no default
		}
		if (docFragment.children.length > 0) {
			return [];
		}
		return elements;
	};

	/**
	 * Builds a document fragment from element arrays.
	 * @param {ElementArray[]} arrays The arrays to use.
	 * @returns {DocumentFragment | undefined} The built document fragment, if successful.
	 */
	const _buildFragment = (arrays) => {
		if (!Array.isArray(arrays)) {
			return;
		}
		const docFragment = document.createDocumentFragment();
		// @ts-ignore
		const filteredArrays = arrays.filter(Utils.isSet);
		for (const array of filteredArrays) {
			const element = _buildElement(array);
			if (element) {
				docFragment.appendChild(element);
			}
		}
		return docFragment;
	};

	/**
	 * Builds an element from an element array.
	 * @param {ElementArray} array The array to use.
	 * @returns {Node | undefined} The built element, if successful.
	 */
	const _buildElement = (array) => {
		if (!array) {
			return;
		}
		if (array instanceof Node) {
			return array;
		}
		if (typeof array === 'string') {
			return document.createTextNode(array);
		}
		const [tag, attributes, children] = array;
		const element = document.createElement(tag);
		if (attributes) {
			_setElementAttributes(element, attributes);
		}
		if (children) {
			_appendElementChildren(element, children);
		}
		return element;
	};

	/**
	 * Sets attributes for an element.
	 * @template {ElementTag} T
	 * @param {HTMLElement} element
	 * @param {ElementAttributes<T>} attributes
	 */
	const _setElementAttributes = (element, attributes) => {
		const filteredAttributes = Object.entries(attributes).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredAttributes) {
			if (key === 'attrs' && typeof value === 'object') {
				_setCustomElementAttributes(element, value);
			} else if (key === 'ref' && typeof value === 'function') {
				value(element);
			} else if (key.startsWith('on') && typeof value === 'function') {
				const eventType = key.slice(2);
				element.addEventListener(eventType, value);
			} else if (typeof value === 'object') {
				_setElementProperties(element, key, value);
			} else {
				// @ts-ignore
				element[key] = value;
			}
		}
	};

	/**
	 * Sets custom attributes for an element.
	 * @template {ElementTag} T
	 * @param {HTMLElement} element
	 * @param {ElementAttributes<T>} attributes
	 */
	const _setCustomElementAttributes = (element, attributes) => {
		const filteredAttributes = Object.entries(attributes).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredAttributes) {
			element.setAttribute(key, value);
		}
	};

	/**
	 * Sets properties for the attribute of an element.
	 * @param {HTMLElement} element
	 * @param {string} attribute
	 * @param {Object} properties
	 */
	const _setElementProperties = (element, attribute, properties) => {
		const filteredProperties = Object.entries(properties).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredProperties) {
			// @ts-ignore
			element[attribute][key] = value;
		}
	};

	/**
	 * Appends children to an element from an element array.
	 * @param {HTMLElement} element
	 * @param {ElementArrayChildren} children
	 */
	const _appendElementChildren = (element, children) => {
		const docFragment = _buildFragment(Array.isArray(children) ? children : [children]);
		if (docFragment) {
			element.appendChild(docFragment);
		}
	};

	/**
	 * Observes a node for mutations.
	 * @param {Node} node The node to observe.
	 * @param {MutationTypes | null} types The types of mutations to observe. Defaults to the child list of the node and all its descendants.
	 * @param {NodeCallback} callback The callback to call with each updated / added node.
	 * @returns {MutationObserver} The observer.
	 */
	const observeNode = (node, types, callback) => {
		const observer = new MutationObserver((mutations) =>
			_processNodeMutations(mutations, callback)
		);
		observer.observe(
			node,
			types || {
				childList: true,
				subtree: true,
			}
		);
		return observer;
	};

	/**
	 * @param {MutationRecord[]} mutations
	 * @param {NodeCallback} callback
	 */
	const _processNodeMutations = (mutations, callback) => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes') {
				callback(mutation.target);
			} else {
				mutation.addedNodes.forEach(callback);
			}
		}
	};

	/**
	 * Parses an HTML string into a DOM.
	 * @param {string} html The HTML string to parse.
	 * @returns {Document} The parsed DOM.
	 */
	const parse = (html) => {
		return _parser.parseFromString(html, 'text/html');
	};

	return {
		dynamicQuerySelector,
		insertElements,
		observeNode,
		parse,
	};
})();
