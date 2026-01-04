// ==UserScript==
// @name         Kuromoji
// @namespace    kuromoji
// @version      0.1
// @description  Loads kuromoji and provides the tokenizer for use in other scripts: kuromoji.tokenizer.tokenize()
// @author       Sinyaven
// @match        https://www.wanikani.com/
// @grant        GM_getResourceURL
// @require      https://cdn.jsdelivr.net/gh/hata6502/kuromoji.js@303605c8f3211c6f3739009a48d07985528da281/build/kuromoji.min.js
// @require      https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako_inflate.min.js
// @resource     base       https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/base.dat.gz
// @resource     check      https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/check.dat.gz
// @resource     tid        https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/tid.dat.gz
// @resource     tid_pos    https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/tid_pos.dat.gz
// @resource     tid_map    https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/tid_map.dat.gz
// @resource     cc         https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/cc.dat.gz
// @resource     unk        https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk.dat.gz
// @resource     unk_pos    https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk_pos.dat.gz
// @resource     unk_map    https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk_map.dat.gz
// @resource     unk_char   https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk_char.dat.gz
// @resource     unk_compat https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk_compat.dat.gz
// @resource     unk_invoke https://raw.githubusercontent.com/takuyaa/kuromoji.js/master/dict/unk_invoke.dat.gz
// @downloadURL https://update.greasyfork.org/scripts/414770/Kuromoji.user.js
// @updateURL https://update.greasyfork.org/scripts/414770/Kuromoji.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global kuromoji, pako */

	const RESOURCES = ["base", "check", "tid", "tid_pos", "tid_map", "cc", "unk", "unk_pos", "unk_map", "unk_char", "unk_compat", "unk_invoke"];
	const FILE_EXTENSION = ".dat";

	function fetchData(resource) {
		return fetch(GM_getResourceURL(resource)).then(r => r.arrayBuffer()).then(a => pako.inflate(new Uint8Array(a)).buffer);
	}

	console.log("Kuromoji started");

	kuromoji.tokenizer = new Promise((resolve, reject) => {
		try {
			kuromoji.cached_dics = RESOURCES.map(resource => ({fetch: fetchData(resource), url: resource + FILE_EXTENSION}));
			Promise.all(kuromoji.cached_dics.map(c => c.fetch)).then(() => console.log("Kuromoji loaded"));
			kuromoji.builder({dicPath: ""}).build((err, tokenizer) => { err ? reject(err) : resolve(tokenizer); });
		} catch (e) {
			reject(e);
		}
	});
})();
