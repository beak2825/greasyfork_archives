// ==UserScript==
// @name         Pride gold
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Rainbow gold posts
// @author       Milan
// @match        https://*.websight.blue/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468454/Pride%20gold.user.js
// @updateURL https://update.greasyfork.org/scripts/468454/Pride%20gold.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = `
    blockquote.gold {
      --angle: 0deg;
	  border-image: conic-gradient(from var(--angle), red, yellow, lime, aqua, blue, magenta, red) 1;
	  animation: 10s rotate linear infinite;
    }

    @keyframes rotate {
	  to {
		--angle: 360deg;
	  }
    }

    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }`;
    GM_addStyle(style);
})();