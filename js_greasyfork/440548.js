// ==UserScript==
// @name         Twitter News Sidebar Yeet
// @namespace    https://greasyfork.org/
// @version      1.0.1
// @description  Remove the garbage nobody wants to see.
// @author       ScocksBox
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440548/Twitter%20News%20Sidebar%20Yeet.user.js
// @updateURL https://update.greasyfork.org/scripts/440548/Twitter%20News%20Sidebar%20Yeet.meta.js
// ==/UserScript==

var callback = function (mutationsList, observer) {
	let elements = document.querySelectorAll('.css-1dbjc4n.r-x572qd.r-1d6w8o1.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x, .css-1dbjc4n.r-1ysxnx4.r-k0dy70.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');
	for (let i = 0; i < elements.length; i++) {
        let e = elements[i];
		let headers = e.querySelectorAll('h1');
        for (let j = 0; j < headers.length; j++) {
            let h = headers[j];
            if (h.textContent == "Trending now") {
                e.remove();
                break;
            }
        }
	}
};

const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true, attributes: true });