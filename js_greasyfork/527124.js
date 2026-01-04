// ==UserScript==
// @name         MAL: fix genres in stats
// @namespace    https://andrybak.dev
// @version      1
// @description  Fix names of genres in stats
// @author       Andrei Rybak
// @license      MIT
// @match        https://myanimelist.net/profile/*/statistics/anime-genres
// @icon         https://myanimelist.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527124/MAL%3A%20fix%20genres%20in%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/527124/MAL%3A%20fix%20genres%20in%20stats.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2025 Andrei Rybak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
	'use strict';

	function fixGenres() {
		const genres = Array.from(document.querySelectorAll('.data.name b')).map(e => e.innerText);
		const tspans = Array.from(document.querySelectorAll('.amcharts-Label.amcharts-AxisLabel.amcharts-AxisLabelCircular')).map(e => e.querySelector('tspan'));
		const n = Math.min(genres.length, tspans.length);
		for (let i = 0; i < n; ++i) {
			const genre = genres[i];
			const tspan = tspans[i];
			tspan.replaceChildren(document.createTextNode(genre));
		}
	}

	setTimeout(fixGenres, 5000);
})();