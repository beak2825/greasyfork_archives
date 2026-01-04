// ==UserScript==
// @name         TicketURL2Link
// @namespace    JoroSpider
// @version      1.0.0
// @description  カレンダーのURLをリンクにする
// @author       JoroSpider
// @match        https://lsp-marvelous.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lsp-marvelous.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503676/TicketURL2Link.user.js
// @updateURL https://update.greasyfork.org/scripts/503676/TicketURL2Link.meta.js
// ==/UserScript==

/*
Copyright © 2024 JoroSpider

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(() => {
	const MODAL_BODY = 'eaelec-modal-body';
	const URL_REGEX = /https:\/\/\S+/;

	const rootElement = document.getElementsByClassName(MODAL_BODY)[0];
	const options = { childList: true };
	const observer = new MutationObserver((mutations, observer) => {
		observer.disconnect();

		mutations.filter(mutation => mutation.addedNodes.length).forEach(mutation => {
			for (const node of mutation.addedNodes) {
				if (node.nodeType === Node.TEXT_NODE) {
					const nextNode = node.nextSibling;
					let parts = [];
					node.nodeValue.split(/\s/).forEach(s => {
						if (URL_REGEX.test(s)) {
							if (parts.length) {
								rootElement.insertBefore(document.createTextNode(parts.join(' ')), nextNode);
								parts = [];
							}

							const link = document.createElement('a');
							link.href = s;
							link.target = '_blank';
							link.textContent = s;
							link.style.color = 'blue';
							link.style.textDecoration = 'underline';
							rootElement.insertBefore(link, nextNode);
						} else {
							parts.push(s);
						}
					});

					if (parts.length) {
						rootElement.insertBefore(document.createTextNode(parts.join(' ')), nextNode);
					}

					node.parentNode.removeChild(node);
				}
			}
		});

		observer.observe(rootElement, options);
	});

	observer.observe(rootElement, options);
})();
