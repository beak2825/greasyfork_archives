// ==UserScript==
// @name        Batoto Mod Tools
// @author      Gendalph
// @namespace   http://batoto.net/scripts
// @version     3
// @description a bunch of tools to help Batoto contribution mods
// @include     http://*batoto.net/comic/_/comics/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/3553/Batoto%20Mod%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/3553/Batoto%20Mod%20Tools.meta.js
// ==/UserScript==

(function() {
	"use strict";

	// xpath always returns an array
	var table = $x('//table[@class="ipb_table chapters_list"]/tbody')[0];
	// exit if we're not on comic page
	if (table === undefined) return;

	var expansionRow = $x('.//tr[@class="chapter_row_expand"]/td', table)[0],
		rows = $x('.//tr/td[1]', table),
		regexChapNum = / (?:Vol\.(\d+) )?Ch\.(\d+)(.*)/,
		// regexDLValidate = /\d\d\/.\/([\w\s\.\-_=+\[\]\(\)!#@]+)/
		regexDLValidate = /[%\ufffd]/,
		invalidRowColor = "rgba(240, 100, 113, 0.4)";

	// adds styles needed for the script
	function addStyles() {
		var styleSheet = getStyleSheet();
		styleSheet.insertRule('a span.monospaced {font-family: Consolas, DejaVu Sans Mono, Monospace;}', styleSheet.cssRules
			.length);
		styleSheet.insertRule('.masked {opacity: 0;}', styleSheet.cssRules.length);
	}

	// http://wiki.greasespot.net/XPath_Helper
	function $x() {
		var x = '';
		var node = document;
		var type = 0;
		var fix = true;
		var i = 0;
		var cur;

		function toArray(xp) {
			var final = [],
				next;
			while (next = xp.iterateNext()) {
				final.push(next);
			}
			return final;
		}

		while (cur = arguments[i++]) {
			switch (typeof cur) {
				case "string":
					x += (x == '') ? cur : " | " + cur;
					continue;
				case "number":
					type = cur;
					continue;
				case "object":
					node = cur;
					continue;
				case "boolean":
					fix = cur;
					continue;
			}
		}

		if (fix) {
			if (type == 6) type = 4;
			if (type == 7) type = 5;
		}

		// selection mistake helper
		if (!/^\//.test(x)) x = "//" + x;

		// context mistake helper
		if (node != document && !/^\./.test(x)) x = "." + x;

		var result = document.evaluate(x, node, null, type, null);
		if (fix) {
			// automatically return special type
			switch (type) {
				case 1:
					return result.numberValue;
				case 2:
					return result.stringValue;
				case 3:
					return result.booleanValue;
				case 8:
				case 9:
					return result.singleNodeValue;
			}
		}

		return fix ? toArray(result) : result;
	}

	function getStyleSheet() {
		var styleSheets = window.document.styleSheets,
			validStyleSheets = [];

		for (var i = styleSheets.length - 1; i >= 0; i--) {
			if (styleSheets[i].media.mediaText.match(/(screen)/) || styleSheets[i].media.mediaText === "") {
				validStyleSheets.push(styleSheets[i]);
			}
		}

		return validStyleSheets[0];
	}

	function modifyDescription(matchResult) {
		// console.log('Inside modify_description: ', matchResult);
		var volNum = matchResult[1],
			chapNum = matchResult[2],
			chapName = matchResult[3],
			checkZero = /^(?:0+)(\d+)/,
			result,
			volClass = '';

		if (volNum === undefined) {
			volNum = ' _';
			volClass = 'masked';
		} else {
			result = volNum.match(checkZero);

			if (result !== null) {
				volNum = result[1];
			}

			if (volNum.length === 1) {
				volNum = ' ' + volNum;
			}
		}

		if (volClass === 'masked') {
			volNum = '<span class="masked"> Vol.' + volNum + '</span>';
		} else {
			volNum = 'Vol.' + volNum;
		}

		if (chapNum === undefined) {
			chapNum = '   ';
		} else {
			result = chapNum.match(checkZero);
			if (result !== null) {
				chapNum = result[1];
				if (chapNum.length === 1) {
					chapNum = '  ' + chapNum;
				} else if (chapNum.length === 2) {
					chapNum = ' ' + chapNum;
				}
			}
		}
		chapNum = ' Ch.' + chapNum;

		var string =
			'<img src="http:\/\/www.batoto.net\/book_open.png" style="vertical-align:middle;"> <span class="monospaced">' +
			volNum + chapNum + '</span>' + chapName;

		return string;
	}

	// hiding table to avoid redrawing
	table.hide();
	addStyles();

	// lots of debugging here, yes
	for (var i = rows.length - 1; i >= 0; i--) {
		var row = rows[i];
		// skip some nasty rows
		if (row.innerText === "There are no chapters currently available (for the selected language).") continue;
		if (typeof row.onclick === "function") continue;

		var chapterLink = $x('./a[last()]', row)[0];
		if (chapterLink === undefined) {
			console.error('Error while initializing table row, chapterLink xpath caught undefiled on row ', row);
		}

		var downloadLink = $x('./a[@title="Link doesn\'t work? Just wait 5min."]', row)[0],
			linkText = chapterLink.innerHTML.toString(),
			result = linkText.match(regexChapNum);

		if (downloadLink !== undefined) {
			var url = downloadLink.href,
				invalidation = url.match(regexDLValidate);

			if (invalidation !== null) {
				console.log('Potentially broken chapter matched: ', row);
				row.style.backgroundColor = invalidRowColor;
			}
		}

		if (result !== null) {
			chapterLink.innerHTML = modifyDescription(result);
		} else {
			console.error('Matching against row returned null! Row: ', chapterLink);
		}
	}

	// showing hidden chapters and returning the table
	if (expansionRow !== undefined) expansionRow.click();
	table.show();
})();