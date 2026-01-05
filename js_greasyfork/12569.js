// ==UserScript==
// @name autoSpurdo
// @description Convert text on every page into spurdo
// @namespace installgen2
// @include *
// @version 7
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/12569/autoSpurdo.user.js
// @updateURL https://update.greasyfork.org/scripts/12569/autoSpurdo.meta.js
// ==/UserScript==
(function() {
	// Return a random ebin face
	var ebinFaces = [":D", ":DD", ":DDD", ":-D", "XD", "XXD", "XDD", "XXDD", "xD", "xDD", ":dd"];
	function getEbinFace() {
		return ebinFaces[Math.floor(Math.random() * ebinFaces.length)];
	}

	// define replacements
	var spurdoReplacements = [
		["wh", "w"],
		["th", "d"],

		["af", "ab"],
		["ap", "ab"],
		["ca", "ga"],
		["ck", "gg"],
		["co", "go"],
		["ev", "eb"],
		["ex", "egz"],
		["et", "ed"],
		["iv", "ib"],
		["it", "id"],
		["ke", "ge"],
		["nt", "nd"],
		["op", "ob"],
		["ot", "od"],
		["po", "bo"],
		["pe", "be"],
		["pi", "bi"],
		["up", "ub"],
		["va", "ba"],

		["ck", "gg"],
		["cr", "gr"],
		["kn", "gn"],
		["lt", "ld"],
		["mm", "m"],
		["nt", "dn"],
		["pr", "br"],
		["ts", "dz"],
		["tr", "dr"],

		["bs", "bz"],
		["ds", "dz"],
		["es", "es"],
		["fs", "fz"],
		["gs", "gz"],
		[" is", " iz"],
		["ls", "lz"],
		["ms", "mz"],
		["ns", "nz"],
		["rs", "rz"],
		["ss", "sz"],
		["ts", "tz"],
		["us", "uz"],
		["ws", "wz"],
		["ys", "yz"],

		["alk", "olk"],
		["ing", "ign"],

		["ic", "ig"],
		["ng", "nk"],

		["kek", "geg"],
		["epic", "ebin"],
		["some", "sum"],
		["meme", "maymay"],
	];

	walk(document.body);
	function walk(node) {
		// I stole this function from here:
		// http://is.gd/mwZp7E
		var child,
			next;

		switch (node.nodeType) {
			case 1: // Element
			case 11: // Document fragment
				child = node.firstChild;

				while (child) {
					next = child.nextSibling;
					walk(child);
					child = next;
				}
				break;
			case 3: // Text node
				node.nodeValue = toSpurdo(node.nodeValue);
				break;
		}
	}

	function toSpurdo(string) {
		// Convert to lowercase
		string = string.toLowerCase();

		// apply replacements
		spurdoReplacements.forEach(function(filter) {
			var replaceFrom = new RegExp(filter[0], "gm"),
			replaceTo = filter[1];

			string = string.replace(replaceFrom, replaceTo);
		});

		// Replace "," and "." with ebin faces
		while (string.match(/\.|,(?=\s|$|\.)/m)) {
			string = string.replace(/\.|,(?=\s|$|\.)/m, " " + getEbinFace());
		}

		// return spurdo'd text
		return string;
	}
})();
