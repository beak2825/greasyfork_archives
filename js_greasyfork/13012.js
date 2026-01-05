// ==UserScript==
// @name            xkcd 1418
// @name:ru         xkcd 1418
// @namespace       http://xkcd.com/1418
// @license         MIT
// @description     Replaces the word "force" with "horse" everywhere. Is expandable with other replacements.
// @description:ru  Заменяет слово "force" на "horse". Можно добавлять свои замены.
// @version         4
// @include         *
// @exclude         https://greasyfork.org/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/13012/xkcd%201418.user.js
// @updateURL https://update.greasyfork.org/scripts/13012/xkcd%201418.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2015-2023 Andrei Rybak
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

/*
 * Based on http://bitcoinshell.mooo.com/users/noiob/dev/horse.user.js
 * and https://www.techradar.com/news/internet/the-beginner-s-guide-to-greasemonkey-scripting-598247/4
 */

const replacements = [
	['Force', 'Horse'],
	['FORCE', 'HORSE'],
	['force', 'horse']
	// add your own replacements here (e.g. ['the cloud', 'my butt']).
	// don't forget to add commas to the list
	// ru:можно добавлять свои замены здесь, например, ['the cloud', 'my butt']
	// ru:не забывайте добавить запятые к списку
];

const textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

function xkcd_replace(source, replace) {
	var searchRE = new RegExp(source, 'g');
	for (var i = 0; i < textNodes.snapshotLength; i++) {
		const node = textNodes.snapshotItem(i);
		node.data = node.data.replace(searchRE, replace);
	}
}

for (var i = 0; i < replacements.length; ++i) {
	xkcd_replace(replacements[i][0], replacements[i][1]);
}