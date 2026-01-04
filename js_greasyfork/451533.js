// ==UserScript==
// @name         Clean reading
// @namespace    https://leveling-solo.org/
// @version      0.1
// @description  Remove gaps between images
// @author       Manofry
// @match        https://leveling-solo.org/manga/solo-leveling-chapter-3-*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leveling-solo.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451533/Clean%20reading.user.js
// @updateURL https://update.greasyfork.org/scripts/451533/Clean%20reading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const images = document.querySelectorAll('.aligncenter');
    images.forEach(image => {
		image.style.marginTop=0;
		image.style.marginBottom=0;
		image.style.border=0;
	});
    const codeblock = document.querySelectorAll('.code-block');
	codeblock.forEach(block => {
		block.remove();
	});
})();