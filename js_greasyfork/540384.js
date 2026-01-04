// ==UserScript==
// @name        Bypass login on mature posts
// @match       *://*.artstation.com/*
// @match       *://*.deviantart.com/*
// @grant       none
// @version     1.6
// @author      -
// @license      MIT
// @description Bypass login on specific websites that block access to mature content without logging in.
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/540384/Bypass%20login%20on%20mature%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/540384/Bypass%20login%20on%20mature%20posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var done = false;
    function uncensor() {
        if (window.location.hostname.endsWith('artstation.com')) {
            document.querySelector('mature-content')?.remove();
            document.querySelector('.matureContent')?.remove();
            document.querySelector('.matureContent-hide')?.classList.remove('matureContent-hide');
        }
        if (window.location.hostname.endsWith('deviantart.com')) {
            if (done==false) {
                done = true;

                function replaceBackgroundWithImage(selector) {
					let element = document.querySelector(selector);
					if (!element) return;
					if (!(element.tagName === "DIV" && /^background-image\s*:\s*url/i.test(element.getAttribute("style") || ""))) {
						return;
					}


					//There are images without <figure> element
					document.querySelector('body > main > div > div > div > div > div:nth-child(2) > div > div:nth-child(2)')?.remove();
					//And with <figure> element
					document.querySelector('body > main > div > div > div > div > figure > div > div > div:nth-child(2)')?.remove();

					element.classList.remove(element.classList.item(1));

					element.style.backgroundImage = element.style.backgroundImage.replace(
					/w_\d+,h_\d+/,
					"w_800,h_800"
					);

					const imageUrl = element.style.backgroundImage.slice(4, -1).replace(/['"]/g, '');

					const img = document.createElement('img');
					img.src = imageUrl;
					img.className = element.className;
					element.replaceWith(img);
					img.parentElement.classList.remove(img.parentElement.classList.item(0));
                }

				replaceBackgroundWithImage('body > main > div > div > div > div > div:nth-child(2) > div > div > div');
				replaceBackgroundWithImage('body > main > div > div > div > div > figure > div > div > div > div');
		    }
        }
    }

    // Observe DOM changes in case elements load dynamically
    const observer = new MutationObserver(uncensor);
    observer.observe(document.body, { childList: true, subtree: true });
})();